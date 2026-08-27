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
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-5 py-8 md:flex-row md:items-end md:gap-8 md:px-8">
        <div className="flex flex-col items-center">
          <div className="speech-bubble mb-3 px-3 py-2 text-center">
            <p className="pixel-text text-[10px] leading-4 text-ink">{speech}</p>
          </div>
          <img
            src={`${sprite.src}?v=2`}
            alt={sprite.alt}
            className={`penny-sprite penny-${mood} h-44 w-auto md:h-56`}
          />
          <span className="mt-3 rounded-full border-2 border-[#5d4037] bg-[#fff8f0] px-3 py-1 pixel-text text-[8px] text-ink">
            {sprite.label}
          </span>
        </div>

        <div className="flex w-full flex-1 flex-col items-center text-center md:items-start md:text-left">
          <p className="pixel-text mb-2 text-[10px] text-[#6d4c41]">Budgie&apos;s Finance Adventure</p>
          <h1 className="pixel-title text-[clamp(1.15rem,5vw,2.6rem)] leading-snug">Penny Planner</h1>

          <div className="mt-6 w-full max-w-xl">
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
