import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './SelectedWorksTeaser.module.css'
import { Sparkle } from '../components/Sparkle'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Closes the scroll-told intro (ART 01 → 02 → 03) and hands off to the
 * Selected Works grid — which is Etapa 2's job, not this one. This section
 * is intentionally just the resolution beat: it names what comes next and
 * stops. No placeholder grid or fake cards here.
 */
export function SelectedWorksTeaser() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const trail = section.querySelector(`.${styles.trail}`)
    const titleLines = section.querySelectorAll(`.${styles.titleLine}`)
    const line = section.querySelector(`.${styles.line}`)

    if (reduced) {
      gsap.set(trail, { opacity: 1 })
      gsap.set(titleLines, { y: '0%' })
      gsap.set(line, { scaleY: 1 })
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        once: true,
      },
    })

    tl.to(trail, { opacity: 1, duration: 0.7 })
      .to(titleLines, { y: '0%', duration: 1, stagger: 0.1, ease: 'expo.out' }, '-=0.25')
      .to(line, { scaleY: 1, duration: 0.9, ease: 'power2.out' }, '-=0.3')

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [reduced])

  return (
    <section className={styles.section} ref={sectionRef} id="selected-works">
      <p className={styles.trail} aria-hidden="true">
        <span>01</span>&nbsp;✦&nbsp;<span>02</span>&nbsp;✦&nbsp;<span>03</span>
      </p>

      <h2 className={`${styles.title} font-display`}>
        <span style={{ overflow: 'hidden', display: 'block' }}>
          <span className={styles.titleLine}>Selected Works</span>
        </span>
      </h2>

      <span className={styles.line} aria-hidden="true" />
      <Sparkle
        scale="small"
        tone="moonlight"
        className={styles.guideSparkleLeft}
        delay={1.6}
        loop
        loopInterval={[7, 15]}
      />
      <Sparkle scale="medium" className={styles.guideSparkleRight} delay={2.2} loop loopInterval={[8, 16]} />
    </section>
  )
}
