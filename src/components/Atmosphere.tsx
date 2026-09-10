import { useLayoutEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Atmosphere.module.css'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type Blob = { top?: string; bottom?: string; left?: string; right?: string; size: number; tint: string; mix: number }

type Tone = 'home' | 'commissions' | 'journey' | 'calm'

const TONE_BLOBS: Record<Tone, Blob[]> = {
  // Home — the full range: plum, lilac, a touch of warmth
  home: [
    { top: '2%', left: '-8%', size: 520, tint: 'var(--color-primary)', mix: 38 },
    { top: '34%', right: '-10%', size: 620, tint: 'var(--color-secondary)', mix: 42 },
    { bottom: '0%', left: '14%', size: 560, tint: 'var(--color-primary-soft)', mix: 32 },
    { top: '58%', left: '38%', size: 380, tint: 'var(--color-glow)', mix: 16 },
  ],
  // Commissions — a little warmer/rosier, since the artworks carry the color
  commissions: [
    { top: '4%', right: '-8%', size: 560, tint: 'var(--color-aurora-rose)', mix: 34 },
    { top: '46%', left: '-10%', size: 600, tint: 'var(--color-primary-soft)', mix: 30 },
    { bottom: '2%', right: '18%', size: 460, tint: 'var(--color-glow)', mix: 18 },
  ],
  // How it Works — cooler, night-sky "journey" feel to match the vertical line
  journey: [
    { top: '6%', left: '-6%', size: 520, tint: 'var(--color-aurora-blue)', mix: 26 },
    { top: '48%', right: '-8%', size: 500, tint: 'var(--color-primary)', mix: 28 },
    { bottom: '4%', left: '24%', size: 420, tint: 'var(--color-aurora-blue)', mix: 18 },
  ],
  // Terms — deliberately the quietest: two small, faint, warm blobs
  calm: [
    { top: '6%', right: '10%', size: 380, tint: 'var(--color-glow)', mix: 12 },
    { bottom: '8%', left: '8%', size: 340, tint: 'var(--color-secondary)', mix: 14 },
  ],
}

type AtmosphereProps = {
  /** The dark (ART 03) section — the shared backdrop darkens while it's in view.
   * Omit on pages that have no dark section — the ambient blobs still render,
   * just without the light↔dark scrub. */
  darkSectionRef?: RefObject<HTMLElement>
  /** Which aurora palette to show — each page gets its own, not one wash reused everywhere */
  tone?: Tone
}

/**
 * A single background layer, fixed behind every section: it tints the
 * whole backdrop from off-white to deep plum and back while a dark section
 * (ART 03) is in view, and holds a few faint "aurora" blobs, specific to
 * the current page, that drift very slowly on their own — quiet ambient
 * lighting, not a landing-page gradient.
 */
export function Atmosphere({ darkSectionRef, tone = 'home' }: AtmosphereProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const blobRefs = useRef<Array<HTMLDivElement | null>>([])
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const layer = layerRef.current
    const darkSection = darkSectionRef?.current
    if (!layer || !darkSection || reduced) return

    const rootStyles = getComputedStyle(document.documentElement)
    const bg = rootStyles.getPropertyValue('--color-bg').trim()
    const dark = rootStyles.getPropertyValue('--color-dark').trim()

    const tween = gsap.to(layer, {
      keyframes: {
        '0%': { backgroundColor: bg },
        '28%': { backgroundColor: dark },
        '72%': { backgroundColor: dark },
        '100%': { backgroundColor: bg },
      },
      ease: 'none',
      scrollTrigger: {
        trigger: darkSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reduced, darkSectionRef])

  // Slow, autonomous drift — quiet lighting shifting, not scroll-linked,
  // so it reads the same whether the page is tall or short.
  useLayoutEffect(() => {
    if (reduced) return
    const tweens = blobRefs.current.map((el, i) => {
      if (!el) return null
      const dx = gsap.utils.random(18, 34) * (i % 2 === 0 ? 1 : -1)
      const dy = gsap.utils.random(14, 26) * (i % 2 === 0 ? -1 : 1)
      return gsap.to(el, {
        x: dx,
        y: dy,
        duration: gsap.utils.random(26, 40),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    })
    return () => tweens.forEach((t) => t?.kill())
  }, [reduced, tone])

  const blobs = TONE_BLOBS[tone]

  return (
    <div className={styles.layer} ref={layerRef}>
      {blobs.map((b, i) => (
        <div
          key={i}
          ref={(el) => {
            blobRefs.current[i] = el
          }}
          className={styles.blob}
          style={{
            top: b.top,
            bottom: b.bottom,
            left: b.left,
            right: b.right,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, color-mix(in srgb, ${b.tint} ${b.mix}%, transparent) 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  )
}
