import { useState } from 'react'
import { formatCurrency } from '../utils/formatCurrency.js'

const STRATEGIES = [
  { id: 'avalanche', label: 'Avalanche', icon: '❄️' },
  { id: 'snowball', label: 'Snowball', icon: '🌱' },
  { id: 'safetyNet', label: 'Safety Net', icon: '🛡️' },
]

const BRICK_COUNT = 3

function brickSplit(remaining, startDebt) {
  if (!(startDebt > 0) || remaining <= 0) {
    return { red: 0, gold: BRICK_COUNT }
  }
  if (remaining >= startDebt * 0.98) {
    return { red: BRICK_COUNT, gold: 0 }
  }
  const gold = Math.max(
    1,
    Math.min(BRICK_COUNT, Math.round((1 - remaining / startDebt) * BRICK_COUNT)),
  )
  return { red: BRICK_COUNT - gold, gold }
}

function BrickStack({ remaining, startDebt, free }) {
  const { red, gold } = free ? { red: 0, gold: 0 } : brickSplit(remaining, startDebt)
  const bricks = free
    ? Array.from({ length: BRICK_COUNT }, () => 'green')
    : [...Array.from({ length: red }, () => 'red'), ...Array.from({ length: gold }, () => 'gold')]

  return (
    <div className="journey-stack" aria-hidden="true">
      {bricks.map((tone, index) => (
        <span key={`${tone}-${index}`} className={`journey-brick journey-brick-${tone}`} />
      ))}
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
          <>
            <p className="pixel-text journey-free-title">🎉 FREE!</p>
            <img
              src="/sprites/penny-dancing.png?v=2"
              alt="Penny the budgie, dancing"
              className="journey-penny penny-dancing"
            />
            <BrickStack remaining={0} startDebt={startDebt} free />
          </>
        ) : (
          <BrickStack remaining={stage.remaining} startDebt={startDebt} />
        )}
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
            <span aria-hidden="true">{option.icon}</span> {option.label}
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
