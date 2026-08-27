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
    id: 'otherDebt',
    icon: '📊',
    label: 'Other Debts',
    hint: 'loans, buy-now-pay-later, etc.',
  },
  {
    id: 'expenses',
    icon: '🏠',
    label: 'Living Costs',
    hint: 'rent, food, bills, transport',
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

function MoneyField({ field, value, onChange }) {
  return (
    <label className="input-card" htmlFor={field.id}>
      <span className="mb-2 flex items-center gap-2 font-medium text-ink">
        <span aria-hidden="true">{field.icon}</span>
        {field.label}
        <span className="text-sm font-normal text-warm-brown">({field.hint})</span>
      </span>
      <span className="flex items-baseline gap-2">
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
}) {
  const [showRates, setShowRates] = useState(false)

  return (
    <section className="mx-auto w-full max-w-xl px-5 py-10">
      <div className="flex flex-col gap-4">
        {MONEY_FIELDS.map((field) => (
          <MoneyField
            key={field.id}
            field={field}
            value={inputs[field.id]}
            onChange={onChange}
          />
        ))}
      </div>

      <div className="mt-5 text-center">
        <button
          type="button"
          className="text-sm font-medium text-ink underline decoration-border-warm underline-offset-4 hover:text-warm-brown"
          onClick={() => setShowRates((open) => !open)}
        >
          {showRates ? 'Hide interest rates' : 'I know my interest rates (optional)'}
        </button>
      </div>

      {showRates && (
        <div className="mt-4 rounded-2xl border-2 border-border-warm bg-white/70 p-4">
          <p className="mb-4 text-sm text-warm-brown">
            No pressure — leave these blank and we&apos;ll use typical UK rates.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
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

      <p className="mt-6 text-center text-base italic text-warm-brown">
        Every penny counts toward your freedom!
      </p>

      <div className="mt-8 flex justify-center">
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
