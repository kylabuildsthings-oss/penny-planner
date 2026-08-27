const SPRITES = {
  happy: { src: '/sprites/penny-happy.png', label: '😊 HAPPY', alt: 'Penny the budgie, happy' },
  thinking: { src: '/sprites/penny-thinking.png', label: '⌛ THINKING', alt: 'Penny the budgie, thinking' },
  dancing: { src: '/sprites/penny-dancing.png', label: '🎉 DANCING', alt: 'Penny the budgie, dancing' },
}

export default function Header({ mood = 'happy', speech, progress = 0 }) {
  const sprite = SPRITES[mood] ?? SPRITES.happy
  const pct = Math.max(0, Math.min(100, Math.round(progress)))

  return (
    <header className="header-banner relative overflow-hidden rounded-b-3xl border-b-4 border-[#c47a32]">
      <div className="header-inner mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 sm:flex-row sm:items-end sm:gap-8 sm:px-8">
        <div className="grid grid-cols-[auto_auto] items-start gap-x-3">
          <div className="relative col-start-1 row-start-1">
            <img
              src={`${sprite.src}?v=2`}
              alt={sprite.alt}
              className={`penny-sprite penny-${mood} w-auto`}
            />
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-[#5d4037] bg-[#fff8f0] px-3 py-1 pixel-text text-[8px] text-ink">
              {sprite.label}
            </span>
          </div>
          <div className="speech-bubble col-start-2 row-start-1 mt-6 max-w-[11rem] px-3 py-2 text-center sm:mt-8 md:mt-10">
            <p className="pixel-text text-[10px] leading-4 text-ink">{speech}</p>
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col items-center text-center sm:items-start sm:pb-2 sm:text-left">
          <p className="pixel-text mb-2 text-[10px] text-[#6d4c41]">Budgie&apos;s Finance Adventure</p>
          <h1 className="pixel-title text-[clamp(1.15rem,5vw,2.6rem)] leading-snug">Penny Planner</h1>

          <div className="mt-5 w-full max-w-xl md:mt-6">
            <p className="pixel-text mb-2 text-[10px] text-[#6d4c41]">Debt Freedom: {pct}%</p>
            <div
              className="progress-track h-6 w-full"
              role="progressbar"
              aria-label="Debt freedom"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
            >
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
