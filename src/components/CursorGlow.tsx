import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Mote = { id: number; x: number; y: number; shape: 'dot' | 'star' }

const IDLE_MS = 1100
const MOTE_COOLDOWN_MS = 650
const MOTE_LIFETIME_MS = 950
const STAR_PATH =
  'M12 0 C12.6 6.4 13.2 10.4 15.5 12.5 C13.2 14.6 12.6 18.6 12 24 C11.4 18.6 10.8 14.6 8.5 12.5 C10.8 10.4 11.4 6.4 12 0 Z'

/**
 * A continuous warm glow that trails the cursor with a soft lag — like the
 * cursor were a small fairy light, not a UI effect. One steady, gently
 * pulsing orb (never a hard-edged dot), plus the occasional tiny dust mote
 * that drifts and fades. Desktop (fine pointer) only; off under
 * prefers-reduced-motion.
 */
export function CursorGlow() {
  const orbRef = useRef<HTMLDivElement>(null)
  const [motes, setMotes] = useState<Mote[]>([])
  const reduced = useReducedMotion()
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastMote = useRef(0)
  const moteId = useRef(0)

  useEffect(() => {
    if (reduced) return
    if (!window.matchMedia?.('(pointer: fine)').matches) return

    const orb = orbRef.current
    if (!orb) return

    const quickX = gsap.quickTo(orb, 'x', { duration: 0.55, ease: 'power3.out' })
    const quickY = gsap.quickTo(orb, 'y', { duration: 0.55, ease: 'power3.out' })

    let visible = false

    const handleMove = (e: MouseEvent) => {
      quickX(e.clientX)
      quickY(e.clientY)

      if (!visible) {
        visible = true
        gsap.to(orb, { opacity: 1, duration: 0.6, ease: 'power2.out' })
      }
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        visible = false
        gsap.to(orb, { opacity: 0, duration: 0.9, ease: 'power2.out' })
      }, IDLE_MS)

      const now = performance.now()
      if (now - lastMote.current > MOTE_COOLDOWN_MS && Math.random() < 0.28) {
        lastMote.current = now
        const id = moteId.current++
        const shape: Mote['shape'] = Math.random() < 0.22 ? 'star' : 'dot'
        setMotes((m) => [...m.slice(-2), { id, x: e.clientX, y: e.clientY, shape }])
        setTimeout(() => {
          setMotes((m) => m.filter((mote) => mote.id !== id))
        }, MOTE_LIFETIME_MS)
      }
    }

    const handleLeave = () => {
      visible = false
      gsap.to(orb, { opacity: 0, duration: 0.5 })
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 40 }}>
      <div
        ref={orbRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 70,
          height: 70,
          marginLeft: -35,
          marginTop: -35,
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, var(--color-glow-soft) 0%, var(--color-glow) 32%, transparent 72%)',
            filter: 'blur(6px)',
            animation: 'yehs-fairy-pulse 2.6s ease-in-out infinite',
          }}
        />
      </div>
      {motes.map((m) =>
        m.shape === 'star' ? (
          <svg
            key={m.id}
            width={13}
            height={13}
            viewBox="0 0 24 24"
            style={{
              position: 'fixed',
              left: m.x - 6.5,
              top: m.y - 6.5,
              filter: 'drop-shadow(0 0 5px var(--color-glow))',
              animation: `yehs-mote-drift ${MOTE_LIFETIME_MS}ms ease-out forwards`,
            }}
          >
            <path d={STAR_PATH} fill="var(--color-moonlight)" />
          </svg>
        ) : (
          <div
            key={m.id}
            style={{
              position: 'fixed',
              left: m.x - 3,
              top: m.y - 3,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-glow-soft)',
              filter: 'drop-shadow(0 0 4px var(--color-glow))',
              animation: `yehs-mote-drift ${MOTE_LIFETIME_MS}ms ease-out forwards`,
            }}
          />
        )
      )}
      <style>{`
        @keyframes yehs-fairy-pulse {
          0%, 100% { transform: scale(0.92); opacity: 0.85; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes yehs-mote-drift {
          0% { opacity: 0; transform: translateY(0) scale(0.6); }
          25% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-18px) scale(0.3); }
        }
      `}</style>
    </div>
  )
}
