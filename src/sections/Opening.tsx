import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './Opening.module.css'
import { ArtworkPlaceholder } from '../components/ArtworkPlaceholder'
import { Sparkle } from '../components/Sparkle'
import { SparkleField } from '../components/SparkleField'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * The opening moment. No headline + subhead + two buttons — the first thing
 * a visitor sees is an illustration bleeding off the frame, with the
 * wordmark treated as a typographic object rather than a label sitting
 * above it. This is the one orchestrated page-load sequence for the whole
 * page; everything else on the page only animates in response to scroll.
 */
export function Opening() {
  const rootRef = useRef<HTMLDivElement>(null)
  const artFrameRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const lines = root.querySelectorAll(`.${styles.wordmarkLine}`)
    const tagline = root.querySelector(`.${styles.tagline}`)
    const scrollCue = root.querySelector(`.${styles.scrollCue}`)
    const marginNote = root.querySelector(`.${styles.marginNote}`)
    const artFrame = artFrameRef.current

    if (reduced) {
      gsap.set(lines, { y: '0%' })
      gsap.set([tagline, scrollCue, marginNote], { opacity: 1 })
      gsap.set(artFrame, { clipPath: 'inset(0% 0% 0% 0%)' })
      return
    }

    const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'power4.out' } })

    tl.to(artFrame, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.5,
      ease: 'power3.inOut',
    })
      .to(
        lines,
        {
          y: '0%',
          duration: 1.1,
          stagger: 0.12,
          ease: 'expo.out',
        },
        0.35
      )
      .to(tagline, { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
      .to(scrollCue, { opacity: 1, duration: 0.8 }, '-=0.3')
      .to(marginNote, { opacity: 1, duration: 1 }, '-=0.6')

    return () => {
      tl.kill()
    }
  }, [reduced])

  return (
    <section className={styles.section} ref={rootRef} aria-label="Ashey Arts">
      <div className={styles.textCol}>
        <span className={styles.mark}>
          <Sparkle size={14} />
          Illustration &amp; character design
        </span>

        <h1 className={`${styles.wordmark} font-display`}>
          <span style={{ overflow: 'hidden', display: 'block' }}>
            <span className={styles.wordmarkLine}>Ashey</span>
          </span>
          <span style={{ overflow: 'hidden', display: 'block' }}>
            <span className={styles.wordmarkLine}>Arts</span>
          </span>
        </h1>

        <p className={styles.tagline} style={{ transform: 'translateY(10px)' }}>
          Original characters and <em>quiet fantasy</em>, drawn one commission at a time.
        </p>
      </div>

      <div className={styles.artCol}>
        <span className={styles.marginNote}>N.01 — Featured</span>

        <SparkleField
          marks={[
            { id: 'op-back-1', kind: 'star', top: '5%', left: '-2%', size: 13, delay: 1.4 },
            { id: 'op-back-2', kind: 'dot', top: '80%', left: '-4%', size: 7, delay: 3.2 },
          ]}
          style={{ zIndex: 0 }}
        />

        <div className={styles.artFrame} ref={artFrameRef}>
          <ArtworkPlaceholder variant={1} label="Featured illustration" />
        </div>

        <SparkleField
          marks={[
            { id: 'op-front-1', kind: 'dot', top: '12%', left: '84%', size: 8, delay: 2 },
            { id: 'op-front-2', kind: 'star', top: '68%', left: '90%', size: 16, delay: 4.4 },
            { id: 'op-front-3', kind: 'dot', top: '46%', left: '6%', size: 6, delay: 5.6 },
          ]}
          style={{ zIndex: 2 }}
        />
      </div>

      <div className={styles.scrollCue}>
        <span className={styles.scrollLine} aria-hidden="true" />
        <span className={styles.scrollLabel}>Scroll</span>
      </div>
    </section>
  )
}
