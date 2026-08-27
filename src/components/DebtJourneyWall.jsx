import { formatCurrency } from '../utils/formatCurrency.js'

const STRATEGIES = [
  { id: 'avalanche', label: 'Avalanche' },
  { id: 'snowball', label: 'Snowball' },
  { id: 'safetyNet', label: 'Safety Net' },
]

const ROW_PATTERNS = [
  [1, 1, 1, 1],
  [0.5, 1, 1, 1, 0.5],
  [1, 1, 1, 1],
  [0.5, 1, 1, 1, 0.5],
  [1, 1, 1, 1],
]

function visibleRowCount(remaining, startDebt, free) {
  if (free) return 1
  if (!(startDebt > 0) || remaining <= 0) return 1
  const ratio = remaining / startDebt
  if (ratio > 1.02) return 5
  if (ratio >= 0.85) return 4
  if (ratio >= 0.55) return 3
  if (ratio >= 0.25) return 2
  return 1
}

function brickTones(count, remaining, startDebt, free) {
  if (free) return Array.from({ length: count }, () => 'free')
  if (!(startDebt > 0) || remaining <= 0) {
    return Array.from({ length: count }, () => 'paid')
  }
  if (remaining >= startDebt * 0.98) {
    return Array.from({ length: count }, () => 'owing')
  }
  const paid = Math.max(1, Math.min(count, Math.round((1 - remaining / startDebt) * count)))
  return [
    ...Array.from({ length: count - paid }, () => 'owing'),
    ...Array.from({ length: paid }, () => 'paid'),
  ]
}

function BrickWall({ remaining, startDebt, free }) {
  const rows = visibleRowCount(remaining, startDebt, free)
  const pattern = ROW_PATTERNS.slice(ROW_PATTERNS.length - rows)
  const count = pattern.reduce((sum, widths) => sum + widths.length, 0)
  const tones = brickTones(count, remaining, startDebt, free)
  let cursor = 0

  return (
    <div className="journey-masonry-slot" aria-hidden="true">
      <div className="journey-masonry">
        {pattern.map((widths, rowIndex) => (
          <div key={rowIndex} className={`journey-row${widths[0] < 1 ? ' is-offset' : ''}`}>
            {widths.map((width, brickIndex) => {
              const tone = tones[cursor]
              cursor += 1
              return (
                <span
                  key={`${rowIndex}-${brickIndex}`}
                  className={`journey-brick journey-brick-${tone}${width < 1 ? ' is-half' : ''}`}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function Stage({ stage, startDebt, showArrow }) {
  const free = stage.kind === 'free'

  return (
    <>
      <div className={`journey-stage ${free ? 'is-free' : ''}`}>
        <p className="pixel-text journey-label">{stage.label}</p>
        {free ? (
          <img
            src="/sprites/penny-dancing.png?v=2"
            alt="Penny the budgie, dancing"
            className="journey-penny penny-dancing"
          />
        ) : (
          <div className="journey-penny-spacer" />
        )}
        <BrickWall remaining={stage.remaining} startDebt={startDebt} free={free} />
        <p className="pixel-text journey-balance">{formatCurrency(stage.remaining)}</p>
      </div>
      {showArrow ? (
        <div className="journey-arrow" aria-hidden="true">
          →
        </div>
      ) : null}
    </>
  )
}

function journeysMatch(a, b) {
  const left = a?.journey ?? []
  const right = b?.journey ?? []
  if (left.length !== right.length) return false
  return left.every(
    (stage, index) =>
      stage.month === right[index].month &&
      stage.kind === right[index].kind &&
      Math.abs(stage.remaining - right[index].remaining) < 0.5,
  )
}

function statusCopy(selected, leftover, avalanche, snowball, safetyNet) {
  const name = STRATEGIES.find((option) => option.id === selected)?.label ?? 'This plan'
  const plan = selected === 'snowball' ? snowball : selected === 'safetyNet' ? safetyNet : avalanche

  if (plan.paidOff && plan.months != null) {
    return `Penny dances at Month ${plan.months}, when ${name} reaches £0.`
  }

  if (!(leftover > 0)) {
    return 'There is no leftover this month, so every plan looks the same — the wall stays orange and can grow. Penny dances when a plan actually reaches £0.'
  }

  if (journeysMatch(avalanche, snowball) && selected !== 'safetyNet') {
    return 'With one main debt, Avalanche and Snowball follow the same wall. Safety Net keeps a bit back, so it can take longer.'
  }

  return `${name} does not reach £0 on this leftover, so Penny has no freedom wall to dance on yet.`
}

export default function DebtJourneyWall({
  avalanche,
  snowball,
  safetyNet,
  startDebt,
  leftover = 0,
  strategy = 'avalanche',
  onStrategyChange,
}) {
  const selected =
    strategy === 'snowball' ? snowball : strategy === 'safetyNet' ? safetyNet : avalanche
  const stages = selected.journey ?? []

  return (
    <section className="journey-wall" aria-labelledby="journey-wall-title">
      <h2 id="journey-wall-title" className="pixel-text journey-title">
        Debt Journey Wall
      </h2>
      <p className="journey-guide">
        Each wall is the debt still left at that point. Taller means more still to pay.
      </p>
      <ul className="journey-key">
        <li>
          <span className="journey-brick journey-brick-owing" aria-hidden="true" />
          Orange = still owing
        </li>
        <li>
          <span className="journey-brick journey-brick-paid" aria-hidden="true" />
          Gold = already paid
        </li>
        <li>
          <span className="journey-brick journey-brick-free" aria-hidden="true" />
          Green = debt-free
        </li>
      </ul>

      <div className="journey-toggle" role="radiogroup" aria-label="Choose a plan for the wall">
        {STRATEGIES.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={strategy === option.id}
            className={`journey-toggle-btn ${strategy === option.id ? 'is-on' : ''}`}
            onClick={() => onStrategyChange?.(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="journey-status" role="status">
        {statusCopy(strategy, leftover, avalanche, snowball, safetyNet)}
      </p>

      <div className="journey-track" key={strategy}>
        {stages.map((stage, index) => (
          <Stage
            key={`${strategy}-${stage.kind}-${stage.month}-${stage.label}`}
            stage={stage}
            startDebt={startDebt}
            showArrow={index < stages.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
