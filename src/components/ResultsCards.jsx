import { useState } from 'react'
import { formatCurrency } from '../utils/formatCurrency.js'

function percentLabel(value) {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded}%`
}

function monthsPhrase(months, paidOff) {
  if (paidOff && months === 0) return 'already'
  if (!paidOff || months == null) return 'not on this budget'
  if (months === 1) return '1 month'
  return `${months} months`
}

function monthsNumber(months, paidOff) {
  if (paidOff && months === 0) return '0'
  if (!paidOff || months == null) return '—'
  return String(months)
}

function interestPhrase(amount) {
  if (!Number.isFinite(amount) || amount < 1) {
    return 'Almost nothing extra — you are clearing this so quickly.'
  }
  return `About ${formatCurrency(amount)} extra the lender adds while you pay.`
}

function HowTo({ steps }) {
  return (
    <ol className="mt-2 list-decimal space-y-2 pl-5 text-[0.95rem] leading-6 text-white/95">
      {steps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
  )
}

function MonthsBlock({ months, paidOff }) {
  return (
    <div className="text-center">
      <p className="pixel-text text-4xl leading-none">{monthsNumber(months, paidOff)}</p>
      <p className="mt-2 text-sm text-white/90">
        Debt-free in {monthsPhrase(months, paidOff)}
      </p>
    </div>
  )
}

function StrategyCard({
  title,
  info,
  description,
  months,
  paidOff,
  freedomDate,
  message,
  gradient,
  delay,
  children,
}) {
  const [flipped, setFlipped] = useState(false)
  const cardId = `${title.toLowerCase().replace(/\s+/g, '-')}-plan`

  function toggle() {
    setFlipped((value) => !value)
  }

  return (
    <div className={`flip-card ${flipped ? 'is-flipped' : ''}`} style={{ animationDelay: delay }}>
      <div className="flip-card-inner">
        <div className="flip-face flip-front">
          <article
            className={`flip-rotator strategy-card flex h-full flex-col p-6 text-white md:p-7 ${gradient}`}
            aria-labelledby={cardId}
            aria-hidden={flipped}
          >
            <h3 id={cardId} className="pixel-text text-[11px] leading-5">
              {title}
            </h3>
            <p className="mt-4 text-lg font-semibold leading-7 text-white">{description}</p>
            <p className="mt-4 flex-1 text-[1.02rem] leading-7 text-white/95">{info}</p>
            <button
              type="button"
              className="flip-toggle"
              onClick={toggle}
              aria-expanded={flipped}
            >
              See how to do it
            </button>
          </article>
        </div>

        <div className="flip-face flip-back">
          <article
            className={`flip-rotator strategy-card flex h-full flex-col p-6 text-white md:p-7 ${gradient}`}
            aria-hidden={!flipped}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="pixel-text text-[11px] leading-5">{title}</h3>
              <button type="button" className="flip-toggle flip-toggle-back" onClick={toggle}>
                What this plan is
              </button>
            </div>
            <div className="mt-4 flex-1 space-y-3">{children}</div>
            <div className="mt-auto border-t border-white/25 pt-5 text-center">
              <MonthsBlock months={months} paidOff={paidOff} />
              <p className="freedom-date mt-3 text-base text-white">
                Freedom date: {freedomDate}
              </p>
              <p className="mt-3 text-sm italic text-white/95">{message}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

function avalancheSteps(results) {
  const { starter, avalanche, rates } = results
  const cardPay = formatCurrency(avalanche.firstMonth.ccPayment)
  const otherPay = formatCurrency(avalanche.firstMonth.otherPayment)
  const doneSoon = avalanche.paidOff && avalanche.months <= 1

  if (doneSoon) {
    return [
      `This month, send about ${cardPay} to the credit card and ${otherPay} to other debts.`,
      'That should clear both. You do not need a long plan — just pay them off now.',
    ]
  }

  return [
    `Pay the small required amount on other debts first (about ${formatCurrency(starter.otherMinimum)}).`,
    `Put every leftover pound on the credit card — about ${cardPay} this month. That card is charging ${percentLabel(rates.ccPercent)}.`,
    'When the card hits £0, send that leftover money to the other debts instead.',
  ]
}

function snowballSteps(results) {
  const { starter, snowball } = results
  const cardPay = formatCurrency(snowball.firstMonth.ccPayment)
  const otherPay = formatCurrency(snowball.firstMonth.otherPayment)
  const smallest = starter.smallerBalance === 'other' ? 'other debts' : 'credit card'
  const doneSoon = snowball.paidOff && snowball.months <= 1

  if (doneSoon) {
    return [
      `This month, send about ${otherPay} to other debts and ${cardPay} to the credit card.`,
      'Your leftover money covers the lot, so you can finish this month.',
    ]
  }

  return [
    `Start with the smaller balance (${smallest}) so you get a quick win.`,
    `This month that looks like about ${cardPay} to the card and ${otherPay} to other debts.`,
    'When the small one is gone, throw all leftover money at whatever is left.',
  ]
}

function safetySteps(results) {
  const { safetyNet } = results
  const cardPay = formatCurrency(safetyNet.firstMonth.ccPayment)
  const save = formatCurrency(safetyNet.firstMonth.extra * 0.3 || 0)

  return [
    `Pay the card, but keep a cushion: about ${cardPay} to debt this month.`,
    `Tuck about ${save} into savings (30% of your leftover money).`,
    'Repeat each month. You go a little slower, but you have a rainy-day pot.',
  ]
}

const TIPS = {
  avalanche:
    'Pay only what you must on each debt, then put all leftover money on the one charging the most. That usually means you pay less extra overall.',
  snowball:
    'Pay only what you must on each debt, then put all leftover money on the smallest balance. You clear one debt sooner, which can keep you going.',
  safety:
    'Use most leftover money to pay the card, and put a smaller slice into savings. You finish a bit later, but you have a cushion if something unexpected comes up.',
}

export default function ResultsCards({ results }) {
  if (!results) {
    return null
  }

  if (results.kind === 'empty') {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 pb-3 md:pb-4">
        <p className="text-center text-lg font-semibold text-[#d4a843]">
          🌱 No debt to crack—add numbers to start!
        </p>
      </section>
    )
  }

  if (results.kind === 'debtFree') {
    return (
      <section className="mx-auto max-w-7xl px-4 pb-6 md:pb-8">
        <div className="rounded-xl border-2 border-[#66bb6a] bg-[#e8f5e9] px-6 py-6 text-center md:py-8">
          <p className="pixel-text text-xs leading-6 text-[#2e7d32]">🎉 AMAZING! You&apos;re debt-free!</p>
          <p className="mt-3 text-[#2e7d32]">Penny is dancing for you.</p>
        </div>
      </section>
    )
  }

  const { avalanche, snowball, safetyNet, warning, extraMoney, spendable, rates } = results

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-8 md:pb-10" aria-live="polite">
      {warning === 'overspend' && (
        <p className="mb-3 text-center text-lg font-semibold text-orange">
          💪 Spending more than earning—let&apos;s cut back!
        </p>
      )}

      {extraMoney >= 0 && (
        <div className="leftover-banner mb-6 rounded-2xl border-2 border-border-warm bg-white/90 px-6 py-8 text-center shadow-sm md:px-10 md:py-10">
          <p className="pixel-text text-[10px] leading-5 text-warm-brown">This month&apos;s leftover</p>
          <p className="pixel-text mt-3 text-[clamp(1.7rem,4.8vw,2.8rem)] leading-tight text-ink">
            {formatCurrency(spendable)}
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink md:text-xl">
            After rent, food and bills, this is what you can put toward debt this month.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-warm-brown">
            We took your income and subtracted living costs. That leftover is the pot each plan
            below uses — they just spend it in different ways.
            {!rates.ccCustom && !rates.otherCustom
              ? ` We used typical UK rates (${percentLabel(rates.ccPercent)} card, ${percentLabel(rates.otherPercent)} other).`
              : ''}
          </p>
          <p className="mt-5 text-sm font-medium text-ink">
            Tap a plan to see how to do it, how long it takes, and your freedom date.
          </p>
        </div>
      )}

      <div className="plan-grid">
        <StrategyCard
          title="AVALANCHE"
          info={TIPS.avalanche}
          description={`Hit the expensive debt first — your credit card at ${percentLabel(rates.ccPercent)}.`}
          months={avalanche.months}
          paidOff={avalanche.paidOff}
          freedomDate={avalanche.freedomDate.label}
          message="You're closer than you think!"
          gradient="bg-gradient-to-br from-[#4A90D9] to-[#2E6BB0]"
          delay="0ms"
        >
          <div>
            <p className="text-[0.95rem] font-semibold text-white">How to do it</p>
            <HowTo steps={avalancheSteps(results)} />
          </div>
          <p className="text-[0.95rem] leading-6 text-white/90">{interestPhrase(avalanche.interestPaid)}</p>
        </StrategyCard>

        <StrategyCard
          title="SNOWBALL"
          info={TIPS.snowball}
          description="Clear the smallest balance first so you get a win on the fridge."
          months={snowball.months}
          paidOff={snowball.paidOff}
          freedomDate={snowball.freedomDate.label}
          message="Small wins lead to big victories!"
          gradient="bg-gradient-to-br from-[#66BB6A] to-[#2E7D32]"
          delay="80ms"
        >
          <div>
            <p className="text-[0.95rem] font-semibold text-white">How to do it</p>
            <HowTo steps={snowballSteps(results)} />
          </div>
          <p className="text-[0.95rem] leading-6 text-white/90">{interestPhrase(snowball.interestPaid)}</p>
        </StrategyCard>

        <StrategyCard
          title="SAFETY NET"
          info={TIPS.safety}
          description="Pay the card, and keep a little savings so a surprise bill does not knock you back."
          months={safetyNet.months}
          paidOff={safetyNet.paidOff}
          freedomDate={safetyNet.freedomDate.label}
          message="Smart planning pays off!"
          gradient="bg-gradient-to-br from-[#FFB74D] to-[#F57C00]"
          delay="160ms"
        >
          <div>
            <p className="text-[0.95rem] font-semibold text-white">How to do it</p>
            <HowTo steps={safetySteps(results)} />
          </div>
          {safetyNet.paidOff && safetyNet.months != null && safetyNet.months < 12 ? (
            <p className="text-[0.95rem] leading-6 text-white/90">
              You&apos;ll also have about {formatCurrency(safetyNet.savings)} saved along the way.
            </p>
          ) : (
            <p className="text-[0.95rem] leading-6 text-white/90">
              After 12 months: {formatCurrency(safetyNet.remaining)} debt left,{' '}
              {formatCurrency(safetyNet.savings)} saved.
            </p>
          )}
          <p className="text-[0.95rem] leading-6 text-white/90">{interestPhrase(safetyNet.interestPaid)}</p>
        </StrategyCard>
      </div>
    </section>
  )
}
