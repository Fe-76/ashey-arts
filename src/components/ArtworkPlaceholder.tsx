type ArtworkPlaceholderProps = {
  variant: 1 | 2 | 3 | 4
  className?: string
  label?: string
}

/**
 * Stand-in artwork. NOT meant to resemble finished illustration — just a
 * soft, painterly composition of layered gradient shapes in the site's
 * palette, close enough in tone/contrast to real artwork that layout,
 * spacing and motion timing can be judged honestly. Swap for real pieces
 * (via the future `artworks` table) without touching the section layout —
 * every consumer renders this at a fixed aspect ratio via its wrapper.
 *
 * The small corner label is a dev-only marker (low-opacity, easy to spot
 * in review, invisible at a glance) — remove once real artworks land.
 */
export function ArtworkPlaceholder({ variant, className, label }: ArtworkPlaceholderProps) {
  const filterId = `grain-${variant}`
  const gradA = `blobA-${variant}`
  const gradB = `blobB-${variant}`
  const gradC = `blobC-${variant}`

  const palettes: Record<number, { a: string; b: string; c: string; bg: string }> = {
    1: { a: '#a8637e', b: '#2a1830', c: '#e8d3c2', bg: '#241a2c' },
    2: { a: '#7d6a99', b: '#1c1220', c: '#c97e93', bg: '#1f1726' },
    3: { a: '#4f4a70', b: '#2a1e38', c: '#c9b8d9', bg: '#1e1826' },
    4: { a: '#9c5f78', b: '#241c36', c: '#e6c9a0', bg: '#221a2a' },
  }
  const p = palettes[variant]

  const shapes: Record<number, React.ReactNode> = {
    1: (
      <>
        <ellipse cx="230" cy="260" rx="220" ry="260" fill={`url(#${gradA})`} />
        <ellipse cx="560" cy="180" rx="180" ry="220" fill={`url(#${gradB})`} opacity={0.85} />
        <circle cx="480" cy="470" r="130" fill={`url(#${gradC})`} opacity={0.8} />
      </>
    ),
    2: (
      <>
        <path
          d="M50 500 C120 220 280 40 520 60 C700 76 660 300 520 420 C380 540 130 560 50 500 Z"
          fill={`url(#${gradB})`}
        />
        <circle cx="150" cy="150" r="140" fill={`url(#${gradA})`} opacity={0.75} />
        <circle cx="600" cy="470" r="110" fill={`url(#${gradC})`} opacity={0.85} />
      </>
    ),
    3: (
      <>
        <rect x="0" y="0" width="700" height="600" fill={p.bg} />
        <ellipse cx="520" cy="200" rx="260" ry="300" fill={`url(#${gradA})`} />
        <ellipse cx="180" cy="440" rx="220" ry="180" fill={`url(#${gradB})`} opacity={0.8} />
        <circle cx="380" cy="120" r="90" fill={`url(#${gradC})`} opacity={0.7} />
      </>
    ),
    4: (
      <>
        <path
          d="M0 620 C160 460 200 220 420 120 C600 40 700 140 700 300 C700 460 560 620 380 640 C220 660 90 660 0 620 Z"
          fill={`url(#${gradB})`}
        />
        <ellipse cx="220" cy="180" rx="170" ry="150" fill={`url(#${gradA})`} opacity={0.85} />
        <circle cx="540" cy="440" r="120" fill={`url(#${gradC})`} opacity={0.75} />
      </>
    ),
  }

  return (
    <svg
      viewBox="0 0 700 600"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={label ?? 'Illustration placeholder'}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id={gradA} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.a} />
          <stop offset="100%" stopColor={p.bg} />
        </linearGradient>
        <linearGradient id={gradB} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.b} />
          <stop offset="100%" stopColor={p.a} />
        </linearGradient>
        <radialGradient id={gradC}>
          <stop offset="0%" stopColor={p.c} />
          <stop offset="100%" stopColor={p.c} stopOpacity={0} />
        </radialGradient>
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.02 0" />
        </filter>
      </defs>
      <rect width="700" height="600" fill={p.bg} />
      {shapes[variant]}
      <rect width="700" height="600" filter={`url(#${filterId})`} />
      <text
        x="16"
        y="584"
        fontSize="11"
        fontFamily="Manrope, sans-serif"
        fill={p.bg}
        opacity={0.55}
      >
        placeholder artwork
      </text>
    </svg>
  )
}
