import { useLayoutEffect, useRef, type FormEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './TrackSection.module.css'
import { Sparkle } from '../components/Sparkle'
import { Constellation } from '../components/Constellation'
import { AmbientLight } from '../components/AmbientLight'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * The last big moment of Home before the footer. Visual only, as
 * specified for Etapa 3.5 — the input looks ready to use, but submitting
 * it does nothing (no fake lookup, no simulated result). Real tracking
 * comes with Supabase in a later etapa.
 */
export function TrackSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const titleLines = section.querySelectorAll(`.${styles.titleLine}`)
    const kicker = section.querySelector(`.${styles.kicker}`)
    const subtitle = section.querySelector(`.${styles.subtitle}`)
    const form = section.querySelector(`.${styles.form}`)
    const note = section.querySelector(`.${styles.note}`)

    if (reduced) {
      gsap.set(titleLines, { y: '0%' })
      gsap.set([kicker, subtitle, form, note], { opacity: 1, y: 0 })
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 70%', once: true },
    })
    tl.to(kicker, { opacity: 1, duration: 0.6 })
      .to(titleLines, { y: '0%', duration: 1, stagger: 0.1, ease: 'expo.out' }, '-=0.3')
      .to(subtitle, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .to(form, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .to(note, { opacity: 1, duration: 0.7 }, '-=0.4')

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [reduced])

  // Visual only — intentionally does not look anything up yet.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <section className={styles.section} id="track" ref={sectionRef}>
      <AmbientLight color="var(--color-secondary)" size={700} top="-8%" left="50%" opacity={0.18} />

      <Constellation className={`${styles.constellation} ${styles.constellationTop}`} />
      <Constellation className={`${styles.constellation} ${styles.constellationBottom}`} />

      <Sparkle scale="accent" tone="moonlight" className={styles.sparkleTop} />

      <span className={styles.kicker}>04 — Track your commission</span>
      <h2 className={`${styles.title} font-display`}>
        <span style={{ overflow: 'hidden', display: 'block' }}>
          <span className={styles.titleLine}>Track your</span>
        </span>
        <span style={{ overflow: 'hidden', display: 'block' }}>
          <span className={styles.titleLine}>commission</span>
        </span>
      </h2>

      <p className={styles.subtitle}>
        Already working with Ashey? Enter your commission code to see where your artwork is.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          placeholder="YEH-K7F4Q2"
          aria-label="Commission code"
          autoComplete="off"
        />
        <button type="submit" className={styles.submit} aria-label="Track commission">
          →
        </button>
      </form>

      <p className={styles.note}>Tracking is coming soon — this part isn't live yet.</p>
    </section>
  )
}
