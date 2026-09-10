import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import styles from './Sidebar.module.css'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { INSTAGRAM_URL } from '../config/social'

const NAV_ITEMS = [
  { number: '01', label: 'Works', to: '/#selected-works' },
  { number: '02', label: 'Commissions', to: '/#commissions' },
  { number: '03', label: 'How it works', to: '/#how-it-works' },
  { number: '04', label: 'Track your commission', to: '/#track' },
  { number: '05', label: 'Terms of Service', to: '/terms' },
]

const STAR_PATH =
  'M12 0 C12.6 6.4 13.2 10.4 15.5 12.5 C13.2 14.6 12.6 18.6 12 24 C11.4 18.6 10.8 14.6 8.5 12.5 C10.8 10.4 11.4 6.4 12 0 Z'

const LINE_LENGTH = 420

/**
 * Site-wide navigation. Self-contained: owns its own open state, toggles a
 * class on <html> so the routed page content can react (see .page-shift in
 * global.css), and does the opening as one orchestrated sequence rather
 * than a plain slide-in.
 */
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
  const sparkleARef = useRef<SVGSVGElement>(null)
  const sparkleBRef = useRef<SVGSVGElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const hasMounted = useRef(false)

  // Reflect open state on <html> so routed page content (.page-shift) can
  // nudge slightly, and lock background scroll while the panel is open.
  useEffect(() => {
    document.documentElement.classList.toggle('sidebar-open', isOpen)
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useLayoutEffect(() => {
    const panel = panelRef.current
    const overlay = overlayRef.current
    const line = lineRef.current
    if (!panel || !overlay) return

    const navItems = panel.querySelectorAll(`.${styles.navItem}`)
    const footer = panel.querySelector(`.${styles.footer}`)

    if (!hasMounted.current) {
      hasMounted.current = true
      gsap.set(panel, { x: '100%' })
      gsap.set(overlay, { opacity: 0, pointerEvents: 'none' })
      gsap.set(navItems, { opacity: 0, y: 14 })
      gsap.set(footer, { opacity: 0 })
      return
    }

    if (reduced) {
      gsap.set(panel, { x: isOpen ? '0%' : '100%' })
      gsap.set(overlay, { opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' })
      gsap.set(navItems, { opacity: isOpen ? 1 : 0, y: 0 })
      gsap.set(footer, { opacity: isOpen ? 1 : 0 })
      if (isOpen) firstLinkRef.current?.focus()
      else toggleRef.current?.focus()
      return
    }

    if (isOpen) {
      gsap.set(line, { strokeDasharray: LINE_LENGTH, strokeDashoffset: LINE_LENGTH })
      gsap.set([sparkleARef.current, sparkleBRef.current], { opacity: 0, scale: 0.5 })

      const tl = gsap.timeline()
      tl.to(overlay, { opacity: 1, pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' })
        .to(panel, { x: '0%', duration: 0.75, ease: 'expo.out' }, 0)
        .to(line, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.15)
        .to(
          navItems,
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.07, ease: 'power3.out' },
          0.3
        )
        .to(footer, { opacity: 1, duration: 0.6 }, '-=0.3')
        .to(
          [sparkleARef.current, sparkleBRef.current],
          { opacity: 1, scale: 1, duration: 0.6, stagger: 0.2, ease: 'back.out(2)' },
          0.5
        )
        .call(() => firstLinkRef.current?.focus())

      return () => {
        tl.kill()
      }
    } else {
      gsap.to(panel, { x: '100%', duration: 0.5, ease: 'power3.in' })
      gsap.to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: () => {
        gsap.set(overlay, { pointerEvents: 'none' })
      } })
      gsap.set(navItems, { opacity: 0, y: 14 })
      gsap.set(footer, { opacity: 0 })
      toggleRef.current?.focus()
    }
  }, [isOpen, reduced])

  const close = () => setIsOpen(false)

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className={styles.toggleLines} aria-hidden="true">
          <span />
          <span />
        </span>
        {isOpen ? 'Close' : 'Menu'}
      </button>

      <div
        className={styles.overlay}
        ref={overlayRef}
        onClick={close}
        aria-hidden="true"
      />

      <nav
        className={styles.panel}
        ref={panelRef}
        aria-label="Site navigation"
        aria-hidden={!isOpen}
      >
        <svg className={styles.ornamentLine} viewBox={`0 0 ${LINE_LENGTH} 2`} preserveAspectRatio="none" aria-hidden="true">
          <path ref={lineRef} d={`M0 1 L${LINE_LENGTH} 1`} />
        </svg>

        <svg
          ref={sparkleARef}
          className={styles.sparkleSlot}
          style={{ top: '14%', left: '10%', filter: 'drop-shadow(0 0 6px var(--color-glow)) drop-shadow(0 0 14px var(--color-glow))' }}
          width={22}
          height={22}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d={STAR_PATH} fill="var(--color-glow)" />
        </svg>
        <svg
          ref={sparkleBRef}
          className={styles.sparkleSlot}
          style={{ bottom: '22%', right: '12%', filter: 'drop-shadow(0 0 4px var(--color-glow)) drop-shadow(0 0 10px var(--color-glow))' }}
          width={15}
          height={15}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d={STAR_PATH} fill="var(--color-glow)" />
        </svg>

        <ul className={styles.nav} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {NAV_ITEMS.map((item, i) => (
            <li key={item.to} className={styles.navItem}>
              <Link
                to={item.to}
                className={styles.navLink}
                onClick={close}
                ref={i === 0 ? firstLinkRef : undefined}
                tabIndex={isOpen ? 0 : -1}
              >
                <span className={styles.navNumber}>{item.number}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <span className={styles.footerLabel}>Follow along</span>
          <a
            href={INSTAGRAM_URL}
            className={styles.socialLink}
            target="_blank"
            rel="noreferrer"
            tabIndex={isOpen ? 0 : -1}
          >
            Instagram
          </a>
        </div>
      </nav>
    </>
  )
}
