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
      <div className="header-inner mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 sm:flex-row sm:items-end sm:gap-5 sm:px-6">
        <div className="grid grid-cols-[auto_auto] items-start gap-x-2">
          <div className="relative col-start-1 row-start-1">
            <img
              src={`${sprite.src}?v=2`}
              alt={sprite.alt}
              className={`penny-sprite penny-${mood} w-auto`}
            />
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-[#5d4037] bg-[#fff8f0] px-2.5 py-0.5 pixel-text text-[7px] text-ink">
              {sprite.label}
            </span>
          </div>
          <div className="speech-bubble col-start-2 row-start-1 mt-3 max-w-[10rem] px-3 py-2 text-center sm:mt-4 md:mt-5">
            <p className="pixel-text text-[10px] leading-4 text-ink">{speech}</p>
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col items-center text-center sm:items-start sm:pb-1 sm:text-left">
          <p className="pixel-text mb-1 text-[9px] text-[#6d4c41] md:text-[10px]">Budgie&apos;s Finance Adventure</p>
          <h1 className="pixel-title text-[clamp(1rem,3.6vw,2.05rem)] leading-snug">Penny Planner</h1>

          <div className="mt-2 w-full max-w-xl md:mt-3">
            <p className="pixel-text mb-1.5 text-[9px] text-[#6d4c41] md:text-[10px]">Debt Freedom: {pct}%</p>
            <div
              className="progress-track h-3.5 w-full md:h-4"
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
