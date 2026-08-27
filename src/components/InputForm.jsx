import { useState } from 'react'

const MONEY_FIELDS = [
  {
    id: 'salary',
    icon: '💰',
    label: 'Monthly Income',
    hint: 'after tax',
  },
  {
    id: 'ccDebt',
    icon: '💳',
    label: 'Credit Card Debt',
    hint: 'total balance',
  },
  {
    id: 'ccSpending',
    icon: '💳',
    label: 'Additional Card Spending',
    hint: 'additional spending on your credit card',
  },
  {
    id: 'otherDebt',
    icon: '📊',
    label: 'Other Debts',
    hint: 'loans, buy-now-pay-later, etc.',
  },
  {
    id: 'expenses',
    icon: '🏠',
    label: 'Living Costs',
    hint: 'rent, food, bills, transport, subscriptions',
  },
]

const SPARKLES = [
  { x: '12%', y: '18%', sx: '-40px', sy: '-50px' },
  { x: '22%', y: '70%', sx: '-55px', sy: '30px' },
  { x: '48%', y: '8%', sx: '10px', sy: '-60px' },
  { x: '70%', y: '20%', sx: '50px', sy: '-40px' },
  { x: '86%', y: '58%', sx: '60px', sy: '20px' },
  { x: '60%', y: '82%', sx: '20px', sy: '45px' },
  { x: '35%', y: '88%', sx: '-20px', sy: '50px' },
  { x: '8%', y: '48%', sx: '-70px', sy: '0px' },
]

function MoneyField({ field, value, onChange, compact }) {
  return (
    <label className="input-card" htmlFor={field.id}>
      <span className={`mb-1 flex items-center gap-2 font-medium text-ink ${compact ? 'text-sm' : 'text-sm md:text-base'}`}>
        <span aria-hidden="true">{field.icon}</span>
        {field.label}
        {!compact && (
          <span className="text-sm font-normal text-warm-brown">({field.hint})</span>
        )}
      </span>
      <span className="money-value">
        <span className="pixel-text text-sm text-[#d4a843]">£</span>
        <input
          id={field.id}
          name={field.id}
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={value}
          onChange={(event) => {
            const next = event.target.value
            if (next === '' || Number(next) >= 0) onChange(field.id, next)
          }}
        />
      </span>
    </label>
  )
}

function RateField({ id, label, hint, value, onChange, placeholder }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <span className="flex items-center gap-2 rounded-full border-2 border-border-warm bg-white px-4 py-2">
        <input
          id={id}
          name={id}
          type="number"
          inputMode="decimal"
          min="0"
          max="99.9"
          step="0.1"
          placeholder={placeholder}
          value={value}
          className="w-full min-w-0 border-0 bg-transparent font-sans text-base text-ink outline-none"
          onChange={(event) => {
            const next = event.target.value
            if (next === '' || Number(next) >= 0) onChange(id, next)
          }}
        />
        <span className="pixel-text text-[10px] text-warm-brown">%</span>
      </span>
      <span className="mt-1 block text-xs text-warm-brown">{hint}</span>
    </label>
  )
}

export default function InputForm({
  inputs,
  onChange,
  onCrack,
  cracked,
  thinking,
  sparkleKey,
  compact = false,
}) {
  const [showRates, setShowRates] = useState(false)

  return (
    <section
      className={`input-section mx-auto w-full px-4 ${compact ? 'max-w-7xl' : 'landing-form max-w-2xl'}`}
    >
      <div className="money-grid">
        {MONEY_FIELDS.map((field) => (
          <MoneyField
            key={field.id}
            field={field}
            value={inputs[field.id]}
            onChange={onChange}
            compact={compact}
          />
        ))}
      </div>

      {showRates && (
        <div className="mt-2.5 rounded-2xl border-2 border-border-warm bg-white/70 p-3 md:p-4">
          <p className="mb-3 text-sm text-warm-brown">
            No pressure — leave these blank and we&apos;ll use typical UK rates.
            {compact ? ' Tap Crack the Nut again to update your plans.' : ''}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <RateField
              id="ccApr"
              label="Credit card rate"
              hint="Typical card: 22%"
              placeholder="22"
              value={inputs.ccApr}
              onChange={onChange}
            />
            <RateField
              id="otherApr"
              label="Other debts rate"
              hint="Typical loan: 10%"
              placeholder="10"
              value={inputs.otherApr}
              onChange={onChange}
            />
          </div>
        </div>
      )}

      <div className="mt-2.5 flex flex-col items-center gap-1.5 text-center sm:flex-row sm:justify-center sm:gap-5">
        {!compact && (
          <p className="text-sm italic text-warm-brown">Every penny counts toward your freedom!</p>
        )}
        <button
          type="button"
          className="text-sm font-medium text-ink underline decoration-border-warm underline-offset-4 hover:text-warm-brown"
          onClick={() => setShowRates((open) => !open)}
        >
          {showRates
            ? 'Hide interest rates'
            : compact
              ? 'Add or change interest rates (optional)'
              : 'I know my interest rates (optional)'}
        </button>
      </div>

      <div className={`flex justify-center ${compact ? 'mt-2.5' : 'mt-auto pt-3'}`}>
        <button type="button" className="crack-btn" onClick={onCrack} disabled={thinking}>
          {sparkleKey > 0 &&
            SPARKLES.map((sparkle, index) => (
              <span
                key={`${sparkleKey}-${index}`}
                className="sparkle"
                style={{
                  left: sparkle.x,
                  top: sparkle.y,
                  '--sx': sparkle.sx,
                  '--sy': sparkle.sy,
                }}
              />
            ))}
          <img src="/sprites/chestnut.png?v=2" alt="" className="nut-icon" />
          <span>{cracked ? '💥 CRACKED!' : 'CRACK THE NUT'}</span>
          <img src="/sprites/chestnut.png?v=2" alt="" className="nut-icon" />
        </button>
      </div>
    </section>
  )
}
