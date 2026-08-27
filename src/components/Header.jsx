import { THINK_MS } from '../hooks/useDebtCalculator.js'

const SPRITES = {
  happy: { src: '/sprites/penny-happy.png', label: '😊 HAPPY', alt: 'Penny the budgie, happy' },
  thinking: { src: '/sprites/penny-thinking.png', label: '⌛ THINKING', alt: 'Penny the budgie, thinking' },
  dancing: { src: '/sprites/penny-dancing.png', label: '🎉 DANCING', alt: 'Penny the budgie, dancing' },
}

export default function Header({
  mood = 'happy',
  speech,
  thinking = false,
  sparkleKey = 0,
  onHome,
}) {
  const displayMood = thinking ? 'thinking' : mood
  const sprite = SPRITES[displayMood] ?? SPRITES.happy
  const penny = (
    <img
      key={displayMood}
      src={`${sprite.src}?v=2`}
      alt={sprite.alt}
      className={`penny-sprite penny-${displayMood} w-auto`}
    />
  )

  return (
    <header className="header-banner relative overflow-hidden rounded-b-3xl border-b-4 border-[#c47a32]">
      <div className="header-inner mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 sm:flex-row sm:items-end sm:gap-8 sm:px-8">
        <div className="grid grid-cols-[auto_auto] items-start gap-x-3">
          {onHome ? (
            <button
              type="button"
              className="penny-home col-start-1 row-start-1"
              onClick={onHome}
              aria-label="Back to home"
            >
              {penny}
            </button>
          ) : (
            <div className="col-start-1 row-start-1">{penny}</div>
          )}
          <div className="speech-bubble col-start-2 row-start-1 mt-6 max-w-[11rem] px-3 py-2 text-center sm:mt-8 md:mt-10">
            <p className="pixel-text text-[10px] leading-4 text-ink">{speech}</p>
          </div>
          <span className="col-start-1 row-start-2 mt-2 justify-self-center whitespace-nowrap rounded-full border-2 border-[#5d4037] bg-[#fff8f0] px-3 py-1 pixel-text text-[8px] text-ink">
            {sprite.label}
          </span>
        </div>

        <div className="flex w-full flex-1 flex-col items-center text-center sm:items-start sm:pb-2 sm:text-left">
          <p className="pixel-text mb-2 text-[10px] text-[#6d4c41]">Budgie&apos;s Finance Adventure</p>
          <h1 className="pixel-title text-[clamp(1.15rem,5vw,2.6rem)] leading-snug">Penny Planner</h1>

          {thinking ? (
            <div className="mt-5 w-full max-w-xl md:mt-6">
              <p className="pixel-text mb-2 text-[10px] text-[#6d4c41]">Loading</p>
              <div
                className="progress-track h-6 w-full"
                role="progressbar"
                aria-label="Loading"
                aria-busy="true"
              >
                <div
                  key={sparkleKey}
                  className="progress-fill progress-fill-loading"
                  style={{ animationDuration: `${THINK_MS}ms` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
