import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ArtOne.module.css'
import { ArtworkPlaceholder } from '../components/ArtworkPlaceholder'
import { SparkleField } from '../components/SparkleField'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * ART 01 — mask reveal. The image opens upward through a clip-path wipe as
 * it enters the viewport (played once, not scrubbed — a deliberate reveal
 * with its own timing/easing), then the title reveals line by line.
 */
export function ArtOne() {
  const sectionRef = useRef<HTMLElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const section = sectionRef.current
    const mask = maskRef.current
    if (!section || !mask) return

    const titleLines = section.querySelectorAll(`.${styles.titleLine}`)
    const category = section.querySelector(`.${styles.category}`)

    if (reduced) {
      gsap.set(mask, { clipPath: 'inset(0% 0% 0% 0%)' })
      gsap.set(titleLines, { y: '0%' })
      gsap.set(category, { opacity: 1, y: 0 })
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        once: true,
      },
    })

    tl.to(mask, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.9,
      ease: 'power4.inOut',
    })
      .to(
        titleLines,
        { y: '0%', duration: 0.9, stagger: 0.08, ease: 'expo.out' },
        '-=0.6'
      )
      .to(category, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4')

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [reduced])

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.imageWrap}>
        <span className={styles.ghostNumber} aria-hidden="true">
          01
        </span>

        <SparkleField
          marks={[{ id: 'a1-back', kind: 'star', top: '2%', left: '78%', scale: 'medium', delay: 2.9 }]}
          style={{ zIndex: 0 }}
        />

        <div className={styles.mask} ref={maskRef}>
          <ArtworkPlaceholder variant={2} label="Character illustration" />
        </div>

        <SparkleField
          marks={[
            { id: 'a1-front-1', kind: 'dot', top: '8%', left: '10%', scale: 'small', delay: 1.6 },
            { id: 'a1-front-2', kind: 'star', top: '86%', left: '18%', scale: 'accent', delay: 2.3, tone: 'moonlight' },
            { id: 'a1-front-3', kind: 'dot', top: '40%', left: '92%', scale: 'small', delay: 3.6 },
          ]}
          style={{ zIndex: 2 }}
        />
      </div>

      <div className={styles.caption}>
        <span className={styles.number}>01</span>
        <h2 className={`${styles.title} font-display`}>
          <span style={{ overflow: 'hidden', display: 'block' }}>
            <span className={styles.titleLine}>Character</span>
          </span>
          <span style={{ overflow: 'hidden', display: 'block' }}>
            <span className={styles.titleLine}>illustration</span>
          </span>
        </h2>
        <p className={styles.category}>
          A commissioned piece — full color, single character, atmospheric background.
        </p>
      </div>
    </section>
  )
}
