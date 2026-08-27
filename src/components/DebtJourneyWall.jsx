import { useState } from 'react'
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
]

function visibleRowCount(remaining, startDebt, free) {
  if (free) return 2
  if (!(startDebt > 0) || remaining <= 0) return 1
  const ratio = remaining / startDebt
  if (ratio >= 0.85) return 4
  if (ratio >= 0.55) return 3
  if (ratio >= 0.25) return 2
  return 1
}

function brickTones(count, remaining, startDebt, free) {
  if (free) return Array.from({ length: count }, () => 'green')
  if (!(startDebt > 0) || remaining <= 0) {
    return Array.from({ length: count }, () => 'gold')
  }
  if (remaining >= startDebt * 0.98) {
    return Array.from({ length: count }, () => 'red')
  }
  const gold = Math.max(1, Math.min(count, Math.round((1 - remaining / startDebt) * count)))
  return [
    ...Array.from({ length: count - gold }, () => 'red'),
    ...Array.from({ length: gold }, () => 'gold'),
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

export default function DebtJourneyWall({ avalanche, snowball, safetyNet, startDebt }) {
  const [strategy, setStrategy] = useState('avalanche')
  const selected =
    strategy === 'snowball' ? snowball : strategy === 'safetyNet' ? safetyNet : avalanche
  const stages = selected.journey ?? []

  return (
    <section className="journey-wall" aria-labelledby="journey-wall-title">
      <h2 id="journey-wall-title" className="pixel-text journey-title">
        Debt Journey Wall
      </h2>

      <div className="journey-toggle" role="radiogroup" aria-label="Choose a plan for the wall">
        {STRATEGIES.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={strategy === option.id}
            className={`journey-toggle-btn ${strategy === option.id ? 'is-on' : ''}`}
            onClick={() => setStrategy(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="journey-track">
        {stages.map((stage, index) => (
          <Stage
            key={`${stage.kind}-${stage.month}-${stage.label}`}
            stage={stage}
            startDebt={startDebt}
            showArrow={index < stages.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
