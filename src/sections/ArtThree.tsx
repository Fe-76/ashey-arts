import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ArtThree.module.css'
import { ArtworkPlaceholder } from '../components/ArtworkPlaceholder'
import { Sparkle } from '../components/Sparkle'
import { SparkleField } from '../components/SparkleField'
import { Constellation } from '../components/Constellation'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * ART 03 — parallax. The image drifts a little slower than the page scroll
 * while a small decorative mark drifts a little faster, giving a shallow
 * sense of depth. Kept small (single-digit % of section height) so it
 * reads as depth, not a scrolling-background gimmick.
 *
 * Forwards its root element so Home can hand it to <Atmosphere> — the
 * shared background layer darkens while this section is in view.
 */
export const ArtThree = forwardRef<HTMLElement>(function ArtThree(_props, forwardedRef) {
  const sectionRef = useRef<HTMLElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const sparkleWrapRef = useRef<HTMLDivElement>(null)
  const ghostWordRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useImperativeHandle(forwardedRef, () => sectionRef.current as HTMLElement, [])

  useLayoutEffect(() => {
    const section = sectionRef.current
    const layer = layerRef.current
    const sparkleWrap = sparkleWrapRef.current
    if (!section || !layer || !sparkleWrap) return

    if (reduced) return

    const imageTween = gsap.fromTo(
      layer,
      { yPercent: -13 },
      {
        yPercent: 13,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      }
    )

    const sparkleTween = gsap.fromTo(
      sparkleWrap,
      { yPercent: -32 },
      {
        yPercent: 32,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.35,
        },
      }
    )

    const ghost = ghostWordRef.current
    const ghostTween = ghost
      ? gsap.fromTo(
          ghost,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.1 },
          }
        )
      : null

    return () => {
      imageTween.scrollTrigger?.kill()
      sparkleTween.scrollTrigger?.kill()
      ghostTween?.scrollTrigger?.kill()
      imageTween.kill()
      sparkleTween.kill()
      ghostTween?.kill()
    }
  }, [reduced])

  return (
    <section className={styles.section} ref={sectionRef}>
      <span className={styles.ghostWord} aria-hidden="true" ref={ghostWordRef}>
        Fantasy
      </span>

      <span className={styles.verticalLabel} aria-hidden="true">
        Study — 03
      </span>

      <Constellation className={styles.constellation} />

      <div className={styles.imageWrap}>
        <SparkleField
          marks={[{ id: 'a3-back', kind: 'dot', top: '84%', left: '-4%', scale: 'small', delay: 2.2 }]}
          style={{ zIndex: 0 }}
        />

        <div className={styles.parallaxLayer} ref={layerRef}>
          <ArtworkPlaceholder variant={4} label="Fantasy character study" />
        </div>
        <div className={styles.scrim} />

        <SparkleField
          marks={[
            { id: 'a3-front-1', kind: 'star', top: '6%', left: '4%', scale: 'accent', delay: 1.4, tone: 'moonlight' },
            { id: 'a3-front-2', kind: 'dot', top: '78%', left: '88%', scale: 'small', delay: 4.4 },
          ]}
          style={{ zIndex: 3 }}
        />
      </div>

      <div className={styles.floatSparkle} ref={sparkleWrapRef}>
        <Sparkle scale="medium" loop loopInterval={[6, 14]} />
      </div>

      <div className={styles.caption}>
        <span className={styles.number}>03</span>
        <h2 className={`${styles.title} font-display`}>Fantasy character study</h2>
      </div>
    </section>
  )
})
