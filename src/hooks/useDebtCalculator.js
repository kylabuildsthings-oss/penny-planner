import { useCallback, useMemo, useRef, useState } from 'react'
import { calculateFreedomDate } from '../utils/calculateFreedomDate.js'

export const DEFAULT_CC_APR = 0.22
export const DEFAULT_OTHER_APR = 0.1
export const MIN_RATE = 0.02
export const MIN_FLOOR = 5
export const MAX_MONTHS = 600
export const SAFETY_NET_MONTHS = 12
export const THINK_MS = 1500

const EPS = 0.005

function asMoney(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return 0
  return n
}

function asApr(value, fallback) {
  if (value === '' || value == null) return fallback
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return fallback
  return Math.min(n, 99.9) / 100
}

function minPay(balance) {
  if (balance <= EPS) return 0
  return Math.min(balance, Math.max(balance * MIN_RATE, MIN_FLOOR))
}

function applyPay(balance, amount) {
  if (amount <= 0 || balance <= EPS) {
    return { balance: Math.max(0, balance), leftover: Math.max(0, amount), paid: 0 }
  }
  const pay = Math.min(balance, amount)
  return { balance: balance - pay, leftover: amount - pay, paid: pay }
}

function cascadePay(cc, other, ccAmount, otherAmount) {
  const ccPay = applyPay(cc, ccAmount)
  const otherPay = applyPay(other, otherAmount + ccPay.leftover)
  const backToCc = applyPay(ccPay.balance, otherPay.leftover)

  return {
    cc: backToCc.balance < EPS ? 0 : backToCc.balance,
    other: otherPay.balance < EPS ? 0 : otherPay.balance,
    ccPaid: ccPay.paid + backToCc.paid,
    otherPaid: otherPay.paid,
  }
}

function simulate({
  ccDebt,
  otherDebt,
  extraMoney,
  ccApr,
  otherApr,
  ccSpending = 0,
  allocateExtra,
  stopAfter = MAX_MONTHS,
  snapshotAt = null,
}) {
  let cc = ccDebt
  let other = otherDebt
  let months = 0
  let interestPaid = 0
  let savings = 0
  let snapshot = null
  let firstMonth = null
  const startDebt = Math.max(0, ccDebt + otherDebt)
  const balances = [startDebt]

  if (cc <= EPS && other <= EPS && ccSpending <= EPS) {
    return {
      months: 0,
      interestPaid: 0,
      savings: 0,
      remaining: 0,
      paidOff: true,
      firstMonth: { ccPayment: 0, otherPayment: 0, extra: 0 },
      snapshot: { remaining: 0, savings: 0, interestPaid: 0 },
      balances: [0],
    }
  }

  while (months < stopAfter) {
    if (cc <= EPS && other <= EPS && (months > 0 || ccSpending <= EPS)) break

    months += 1
    cc += ccSpending
    const ccInterest = cc * (ccApr / 12)
    const otherInterest = other * (otherApr / 12)
    cc += ccInterest
    other += otherInterest
    interestPaid += ccInterest + otherInterest

    const ccMin = minPay(cc)
    const otherMin = minPay(other)
    const totalMin = ccMin + otherMin
    let budget = Math.max(0, extraMoney)

    let ccMinPay = 0
    let otherMinPay = 0
    if (budget >= totalMin) {
      ccMinPay = ccMin
      otherMinPay = otherMin
      budget -= totalMin
    } else if (budget > 0 && totalMin > 0) {
      ccMinPay = budget * (ccMin / totalMin)
      otherMinPay = budget * (otherMin / totalMin)
      budget = 0
    }

    const ccMinResult = applyPay(cc, ccMinPay)
    cc = ccMinResult.balance
    budget += ccMinResult.leftover
    const otherMinResult = applyPay(other, otherMinPay)
    other = otherMinResult.balance
    budget += otherMinResult.leftover

    const extra = budget
    const allocation = allocateExtra({ cc, other, extra, month: months })
    savings += allocation.savings || 0

    const afterExtra = cascadePay(cc, other, allocation.cc || 0, allocation.other || 0)
    cc = afterExtra.cc
    other = afterExtra.other
    balances.push((cc < EPS ? 0 : cc) + (other < EPS ? 0 : other))

    if (months === 1) {
      firstMonth = {
        ccPayment: ccMinResult.paid + afterExtra.ccPaid,
        otherPayment: otherMinResult.paid + afterExtra.otherPaid,
        extra,
      }
    }

    if (snapshotAt && months === snapshotAt) {
      snapshot = {
        remaining: cc + other,
        savings,
        interestPaid,
      }
    }
  }

  const paidOff = cc <= EPS && other <= EPS
  if (snapshotAt && !snapshot) {
    snapshot = {
      remaining: cc + other,
      savings,
      interestPaid,
    }
  }

  return {
    months: paidOff ? months : stopAfter,
    interestPaid,
    savings,
    remaining: cc + other,
    paidOff,
    firstMonth: firstMonth ?? { ccPayment: 0, otherPayment: 0, extra: 0 },
    snapshot,
    balances,
  }
}

function avalancheExtra({ extra }) {
  return { cc: extra, other: 0, savings: 0 }
}

function snowballExtra({ cc, other, extra }) {
  if (other > EPS && (cc <= EPS || other < cc)) {
    return { cc: 0, other: extra, savings: 0 }
  }
  return { cc: extra, other: 0, savings: 0 }
}

function safetyNetExtra({ extra }) {
  return { cc: extra * 0.7, other: 0, savings: extra * 0.3 }
}

function remainingAfterMonths(result, months) {
  if (result.paidOff && result.months <= months) return 0
  if (result.snapshot) return result.snapshot.remaining
  return result.remaining
}

function buildJourney(run, startDebt) {
  const balances = run.balances ?? [startDebt]
  const freedomMonth = run.paidOff ? run.months : null
  const stages = [
    {
      month: 0,
      label: 'Now',
      remaining: balances[0] ?? startDebt,
      kind: 'debt',
    },
  ]

  for (const month of [3, 6, 9, 12]) {
    if (freedomMonth != null && month >= freedomMonth) break
    if (month >= balances.length) break
    stages.push({
      month,
      label: `Month ${month}`,
      remaining: balances[month],
      kind: 'debt',
    })
  }

  if (run.paidOff) {
    stages.push({
      month: freedomMonth,
      label: 'Freedom Month',
      remaining: 0,
      kind: 'free',
    })
  }

  return stages
}

function packStrategy(run, stoppedRun = run, startDebt = 0) {
  return {
    months: run.paidOff ? run.months : null,
    paidOff: run.paidOff,
    interestPaid: run.interestPaid,
    firstMonth: run.firstMonth,
    freedomDate: calculateFreedomDate(run.paidOff ? run.months : NaN),
    stoppedMonths: stoppedRun.paidOff ? stoppedRun.months : null,
    stoppedPaidOff: stoppedRun.paidOff,
    journey: buildJourney(run, startDebt),
  }
}

function runStrategy(base, allocateExtra) {
  const stopped = simulate({ ...base, ccSpending: 0, allocateExtra })
  const realistic =
    base.ccSpending > EPS ? simulate({ ...base, allocateExtra }) : stopped
  return { realistic, stopped }
}

export function calculateStrategies(rawInputs) {
  const salary = asMoney(rawInputs.salary)
  const ccDebt = asMoney(rawInputs.ccDebt)
  const ccSpending = asMoney(rawInputs.ccSpending)
  const otherDebt = asMoney(rawInputs.otherDebt)
  const expenses = asMoney(rawInputs.expenses)
  const ccApr = asApr(rawInputs.ccApr, DEFAULT_CC_APR)
  const otherApr = asApr(rawInputs.otherApr, DEFAULT_OTHER_APR)
  const extraMoney = salary - expenses
  const totalDebt = ccDebt + otherDebt
  const allZero =
    salary === 0 && ccDebt === 0 && ccSpending === 0 && otherDebt === 0 && expenses === 0

  if (allZero) {
    return {
      kind: 'empty',
      extraMoney,
      progress: 0,
      warning: null,
    }
  }

  if (totalDebt <= EPS && ccSpending <= EPS) {
    return {
      kind: 'debtFree',
      extraMoney,
      progress: 100,
      warning: extraMoney < 0 ? 'overspend' : null,
    }
  }

  const overspend = extraMoney < 0
  const spendable = Math.max(0, extraMoney)
  const ccMinimum = minPay(ccDebt)
  const otherMinimum = minPay(otherDebt)
  const smallerBalance = otherDebt > 0 && (ccDebt <= 0 || otherDebt < ccDebt) ? 'other' : 'card'

  const simBase = {
    ccDebt,
    otherDebt,
    extraMoney: spendable,
    ccApr,
    otherApr,
    ccSpending,
    snapshotAt: SAFETY_NET_MONTHS,
  }

  const avalanchePair = runStrategy(simBase, avalancheExtra)
  const snowballPair = runStrategy(simBase, snowballExtra)
  const safetyPair = runStrategy(simBase, safetyNetExtra)
  const avalancheRun = avalanchePair.realistic
  const snowballRun = snowballPair.realistic
  const safetyRun = safetyPair.realistic

  const remainingAt12 = remainingAfterMonths(avalancheRun, SAFETY_NET_MONTHS)
  const projected =
    totalDebt > EPS ? ((totalDebt - remainingAt12) / totalDebt) * 100 : 0
  const progress = Math.round(Math.max(0, Math.min(95, projected)))

  return {
    kind: 'results',
    extraMoney,
    spendable,
    progress,
    warning: overspend ? 'overspend' : null,
    rates: {
      ccApr,
      otherApr,
      ccPercent: ccApr * 100,
      otherPercent: otherApr * 100,
      ccCustom: rawInputs.ccApr !== '' && rawInputs.ccApr != null,
      otherCustom: rawInputs.otherApr !== '' && rawInputs.otherApr != null,
    },
    starter: {
      ccDebt,
      otherDebt,
      ccMinimum,
      otherMinimum,
      smallerBalance,
    },
    avalanche: packStrategy(avalancheRun, avalanchePair.stopped, totalDebt),
    snowball: packStrategy(snowballRun, snowballPair.stopped, totalDebt),
    safetyNet: {
      ...packStrategy(safetyRun, safetyPair.stopped, totalDebt),
      remaining: safetyRun.snapshot?.remaining ?? safetyRun.remaining,
      savings: safetyRun.snapshot?.savings ?? safetyRun.savings,
    },
    ccSpending,
  }
}

const EMPTY_INPUTS = {
  salary: '',
  ccDebt: '',
  ccSpending: '',
  otherDebt: '',
  expenses: '',
  ccApr: '',
  otherApr: '',
}

export function useDebtCalculator() {
  const [inputs, setInputs] = useState(EMPTY_INPUTS)
  const [mood, setMood] = useState('happy')
  const [cracked, setCracked] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [results, setResults] = useState(null)
  const [sparkleKey, setSparkleKey] = useState(0)
  const timersRef = useRef([])

  const progress = results?.progress ?? 0

  function clearTimers() {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }

  const speech = useMemo(() => {
    if (mood === 'thinking') return '????'
    if (mood === 'dancing') return '0!'
    return "Let's crack this nut!"
  }, [mood])

  const updateInput = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }, [])

  const crackTheNut = useCallback(() => {
    clearTimers()
    setCracked(true)
    setThinking(true)
    setMood('thinking')
    setSparkleKey((key) => key + 1)

    const outcome = calculateStrategies(inputs)

    timersRef.current.push(window.setTimeout(() => setCracked(false), 700))

    timersRef.current.push(
      window.setTimeout(() => {
        setThinking(false)
        setResults(outcome)
        if (outcome.kind === 'debtFree') {
          setMood('dancing')
        } else {
          setMood('happy')
        }
      }, THINK_MS),
    )
  }, [inputs])

  const goHome = useCallback(() => {
    clearTimers()
    setInputs(EMPTY_INPUTS)
    setMood('happy')
    setCracked(false)
    setThinking(false)
    setResults(null)
  }, [])

  return {
    inputs,
    updateInput,
    crackTheNut,
    goHome,
    mood,
    speech,
    cracked,
    thinking,
    results,
    progress,
    sparkleKey,
  }
}
