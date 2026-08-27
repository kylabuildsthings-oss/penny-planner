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

function InfoTip({ label, text }) {
  const [open, setOpen] = useState(false)
  const tipId = `${label.toLowerCase().replace(/\s+/g, '-')}-tip`

  return (
    <span className={`info-tip ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="info-tip-btn"
        aria-label={`About ${label}`}
        aria-expanded={open}
        aria-describedby={tipId}
        onClick={() => setOpen((value) => !value)}
        onBlur={() => setOpen(false)}
      >
        i
      </button>
      <span id={tipId} role="tooltip" className="info-tip-panel">
        {text}
      </span>
    </span>
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
  return (
    <article
      className={`strategy-card p-5 text-white md:p-6 ${gradient}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:gap-6 xl:flex-col">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="pixel-text text-[11px] leading-5">{title}</h3>
            <InfoTip label={title} text={info} />
          </div>
          <p className="mt-3 text-[0.95rem] leading-6 text-white/90">{description}</p>
          <div className="mt-4 space-y-3">{children}</div>
        </div>
        <div className="shrink-0 border-t border-white/25 pt-4 text-center md:flex md:w-48 md:flex-col md:justify-center md:border-l md:border-t-0 md:pl-5 md:pt-0 xl:w-auto xl:border-l-0 xl:border-t xl:pl-0 xl:pt-5">
          <MonthsBlock months={months} paidOff={paidOff} />
          <p className="freedom-date mt-3 text-base text-white">
            Freedom date: {freedomDate}
          </p>
          <p className="mt-3 text-sm italic text-white/95">{message}</p>
        </div>
      </div>
    </article>
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

const PLAN_PREVIEWS = [
  {
    title: 'AVALANCHE',
    text: 'Hit the expensive debt first so you pay less extra overall.',
    wait: 'Your months and freedom date will land here.',
    gradient: 'bg-gradient-to-br from-[#4A90D9] to-[#2E6BB0]',
  },
  {
    title: 'SNOWBALL',
    text: 'Clear the smallest balance first so you get a quick win.',
    wait: 'Your months and freedom date will land here.',
    gradient: 'bg-gradient-to-br from-[#66BB6A] to-[#2E7D32]',
  },
  {
    title: 'SAFETY NET',
    text: 'Pay the card, and keep a little savings for surprises.',
    wait: 'Your months, savings, and freedom date will land here.',
    gradient: 'bg-gradient-to-br from-[#FFB74D] to-[#F57C00]',
  },
]

export default function ResultsCards({ results }) {
  if (!results) {
    return (
      <section className="landing-plans mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-6 pt-2">
        <p className="mb-4 text-center">
          <span className="pixel-text block text-[10px] leading-5 text-ink sm:text-xs">
            Ready to see your future?
          </span>
          <span className="mt-1 block text-sm text-warm-brown">
            Enter your numbers and crack the nut.
          </span>
        </p>
        <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-3 md:gap-5">
          {PLAN_PREVIEWS.map((plan) => (
            <article
              key={plan.title}
              className={`strategy-card preview-card flex flex-col justify-between p-5 text-white md:p-6 ${plan.gradient}`}
            >
              <div>
                <h3 className="pixel-text text-[11px] leading-5">{plan.title}</h3>
                <p className="mt-4 text-[0.95rem] leading-6 text-white/90">{plan.text}</p>
              </div>
              <p className="mt-8 text-sm italic text-white/80">{plan.wait}</p>
            </article>
          ))}
        </div>
      </section>
    )
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
        <div className="mb-5 rounded-xl border-2 border-border-warm bg-white/80 px-5 py-4 text-center">
          <p className="text-ink">
            After living costs you have <strong>{formatCurrency(spendable)}</strong> left
            for debt this month.
          </p>
          <p className="mt-2 text-sm text-warm-brown">
            Pick a plan below. Each one is a simple to-do list — not a spreadsheet.
            {!rates.ccCustom && !rates.otherCustom
              ? ` We used typical rates (${percentLabel(rates.ccPercent)} card, ${percentLabel(rates.otherPercent)} other).`
              : ''}
          </p>
        </div>
      )}

      <div className="grid items-stretch gap-5 xl:grid-cols-3">
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
