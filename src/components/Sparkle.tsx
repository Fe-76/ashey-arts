import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type SparkleProps = {
  /** Four-point star vs. small round dot — the two marks used across the site */
  variant?: 'star' | 'dot'
  /**
   * Rough scale category, for consistency across the site rather than a
   * hard rule: small ~4–8px, medium ~10–18px, accent ~20–32px. `size`
   * overrides it with an exact pixel value when a composition needs one.
   */
  scale?: 'small' | 'medium' | 'accent'
  size?: number
  className?: string
  style?: React.CSSProperties
  /** Stagger offset so nearby sparkles don't all fire at once */
  delay?: number
  color?: string
  haloColor?: string
  /** White-cream core + lilac halo, for variety alongside the default warm gold */
  tone?: 'gold' | 'moonlight'
  /**
   * When true, the mark keeps reappearing after an irregular pause instead
   * of playing once. Used for the small clusters around artworks — kept
   * off by default so most sparkles (nav marks, icons) stay one-shot.
   */
  loop?: boolean
  /** Range (seconds) for the random pause between loop cycles */
  loopInterval?: [number, number]
}

const SCALE_SIZES: Record<NonNullable<SparkleProps['scale']>, number> = {
  small: 6,
  medium: 14,
  accent: 26,
}

const TONES: Record<NonNullable<SparkleProps['tone']>, { color: string; halo: string }> = {
  gold: { color: 'var(--color-glow)', halo: 'var(--color-glow)' },
  moonlight: { color: 'var(--color-moonlight)', halo: 'var(--color-secondary-soft)' },
}

/**
 * A single ✦ / ✧ mark — meant to actually be seen, not just implied: a
 * bright core plus a soft diffuse halo. Fades and scales up, drifts a few
 * px while held, fades back down. Every cycle randomizes its own rotation,
 * duration and float slightly, so a cluster of these never reads as one
 * mechanical loop — and with `loop`, it reappears after an irregular pause.
 */
export function Sparkle({
  variant = 'star',
  scale,
  size,
  className,
  style,
  delay = 0,
  color,
  haloColor,
  tone = 'gold',
  loop = false,
  loopInterval = [5, 13],
}: SparkleProps) {
  const ref = useRef<SVGSVGElement>(null)
  const reduced = useReducedMotion()

  const resolvedSize = size ?? (scale ? SCALE_SIZES[scale] : 18)
  const resolvedColor = color ?? TONES[tone].color
  const resolvedHalo = haloColor ?? TONES[tone].halo

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduced) {
      gsap.set(el, { opacity: 0.6, scale: 1, rotate: 0, y: 0 })
      return
    }

    let cancelled = false
    let pendingCall: gsap.core.Tween | null = null

    const cycle = () => {
      if (cancelled) return
      const spin = gsap.utils.random(-10, -5)
      const settleSpin = gsap.utils.random(5, 11)
      const growDuration = gsap.utils.random(0.85, 1.3)
      const holdDuration = gsap.utils.random(1.6, 2.6)
      const floatDistance = gsap.utils.random(3, 7)

      gsap.set(el, { opacity: 0, scale: 0.35, rotate: spin, y: 0, transformOrigin: '50% 50%' })
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        rotate: settleSpin,
        duration: growDuration,
        ease: 'back.out(1.7)',
        onComplete: () => {
          if (cancelled) return
          // A slow drift while it's held visible — the "alive" part.
          gsap.to(el, {
            y: -floatDistance,
            duration: holdDuration / 2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: 1,
          })
          gsap.to(el, {
            opacity: 0,
            scale: 0.82,
            duration: 1.3,
            delay: holdDuration,
            ease: 'power1.inOut',
            onComplete: () => {
              if (cancelled || !loop) return
              const [min, max] = loopInterval
              const wait = min + Math.random() * (max - min)
              pendingCall = gsap.delayedCall(wait, cycle)
            },
          })
        },
      })
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        pendingCall = gsap.delayedCall(delay, cycle)
      },
    })

    return () => {
      cancelled = true
      trigger.kill()
      pendingCall?.kill()
      gsap.killTweensOf(el)
    }
  }, [reduced, delay, loop, loopInterval])

  return (
    <svg
      ref={ref}
      width={resolvedSize}
      height={resolvedSize}
      viewBox="0 0 24 24"
      className={className}
      style={{
        overflow: 'visible',
        filter: `drop-shadow(0 0 4px ${resolvedHalo}) drop-shadow(0 0 9px ${resolvedHalo}) drop-shadow(0 0 18px ${resolvedHalo})`,
        ...style,
      }}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" fill={resolvedHalo} opacity={0.32} style={{ filter: 'blur(5px)' }} />
      {variant === 'star' ? (
        <path
          d="M12 0 C12.6 6.4 13.2 10.4 15.5 12.5 C13.2 14.6 12.6 18.6 12 24 C11.4 18.6 10.8 14.6 8.5 12.5 C10.8 10.4 11.4 6.4 12 0 Z"
          fill={resolvedColor}
        />
      ) : (
        <circle cx="12" cy="12" r="3.2" fill={resolvedColor} />
      )}
    </svg>
  )
}
