import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type ConstellationProps = {
  className?: string
  style?: React.CSSProperties
  color?: string
}

/**
 * A tiny abstract constellation — a few points joined by hairline strokes
 * that draw themselves in (stroke-dashoffset), with the points glowing on
 * just after. Used in only 2–3 places across the whole site — it's a
 * bigger gesture than a single sparkle, so it stays rare by design.
 */
export function Constellation({ className, style, color = 'var(--color-glow)' }: ConstellationProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const lines = svg.querySelectorAll('line')
    const points = svg.querySelectorAll('circle')

    if (reduced) {
      gsap.set(lines, { opacity: 0.45, strokeDashoffset: 0 })
      gsap.set(points, { opacity: 1 })
      return
    }

    lines.forEach((line) => {
      const length = line.getTotalLength()
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length, opacity: 0.55 })
    })
    gsap.set(points, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' })

    const tl = gsap.timeline({
      scrollTrigger: { trigger: svg, start: 'top 85%', once: true },
    })
    tl.to(lines, { strokeDashoffset: 0, duration: 1.4, stagger: 0.25, ease: 'power1.inOut' }).to(
      points,
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(2)' },
      '-=0.6'
    )

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [reduced])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 140 90"
      width={140}
      height={90}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <g stroke={color} strokeWidth={0.7} fill="none">
        <line x1="12" y1="70" x2="58" y2="22" />
        <line x1="58" y1="22" x2="104" y2="40" />
        <line x1="104" y1="40" x2="128" y2="14" />
      </g>
      <g style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
        <circle cx="12" cy="70" r="2" fill={color} />
        <circle cx="58" cy="22" r="2.8" fill={color} />
        <circle cx="104" cy="40" r="1.9" fill={color} />
        <circle cx="128" cy="14" r="2.3" fill={color} />
      </g>
    </svg>
  )
}
