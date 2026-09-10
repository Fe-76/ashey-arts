import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ArtTwo.module.css'
import { ArtworkPlaceholder } from '../components/ArtworkPlaceholder'
import { SparkleField } from '../components/SparkleField'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * ART 02 — the image starts contained and grows as the section scrolls
 * through view (scrubbed, so it tracks scroll position directly rather
 * than playing on a timer). Distinct from ART 01's one-shot reveal and
 * ART 03's parallax — each artwork uses exactly one technique.
 */
export function ArtTwo() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const section = sectionRef.current
    const image = imageRef.current
    if (!section || !image) return

    if (reduced) {
      gsap.set(image, { scale: 1 })
      return
    }

    gsap.set(image, { scale: 0.78, y: 34, transformOrigin: '50% 50%' })

    const tween = gsap.to(image, {
      scale: 1.02,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'center 40%',
        scrub: 0.6,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reduced])

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.caption}>
        <span className={styles.number}>02</span>
        <h2 className={`${styles.title} font-display`}>Book illustration</h2>
      </div>

      <div className={styles.imageWrap}>
        <span className={styles.verticalLabel} aria-hidden="true">
          02 — Book illustration
        </span>
        <span className={styles.ghostWord} aria-hidden="true">
          Pages
        </span>

        <SparkleField
          marks={[{ id: 'a2-back', kind: 'dot', top: '90%', left: '-6%', scale: 'small', delay: 2.8 }]}
          style={{ zIndex: 0 }}
        />

        <div className={styles.imageInner} ref={imageRef}>
          <ArtworkPlaceholder variant={3} label="Book illustration" />
        </div>

        <SparkleField
          marks={[
            { id: 'a2-front-1', kind: 'star', top: '-4%', left: '82%', scale: 'accent', delay: 1.6 },
            { id: 'a2-front-2', kind: 'dot', top: '30%', left: '-3%', scale: 'small', delay: 4.8 },
            { id: 'a2-front-3', kind: 'star', top: '68%', left: '96%', scale: 'medium', delay: 3.2, tone: 'moonlight' },
          ]}
          style={{ zIndex: 2 }}
        />
      </div>
    </section>
  )
}
