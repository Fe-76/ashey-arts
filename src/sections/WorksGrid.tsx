import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './WorksGrid.module.css'
import { ArtworkPlaceholder } from '../components/ArtworkPlaceholder'
import { SparkleField } from '../components/SparkleField'
import { Constellation } from '../components/Constellation'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type Work = {
  id: string
  number: string
  category: string
  title?: string
  variant: 1 | 2 | 3 | 4
  size: 'lg' | 'md' | 'sm'
  align: 'left' | 'right'
  sparkles?: boolean
  constellation?: boolean
  bleed?: boolean
  overlapTitle?: boolean
}

const WORKS: Work[] = [
  {
    id: 'w1',
    number: '01',
    category: 'Character illustration',
    title: 'Moonlit Study',
    variant: 1,
    size: 'lg',
    align: 'left',
    sparkles: true,
    constellation: true,
    bleed: true,
  },
  { id: 'w2', number: '02', category: 'Book illustration', variant: 3, size: 'sm', align: 'right' },
  {
    id: 'w3',
    number: '03',
    category: 'Fantasy character',
    title: 'Ashwood',
    variant: 4,
    size: 'md',
    align: 'left',
    overlapTitle: true,
  },
  { id: 'w4', number: '04', category: 'Character illustration', variant: 2, size: 'lg', align: 'right', sparkles: true, bleed: true },
  {
    id: 'w5',
    number: '05',
    category: 'Concept sketch',
    title: 'Wanderer',
    variant: 1,
    size: 'sm',
    align: 'left',
  },
]

/**
 * The exposition itself — several mocked artworks in an asymmetric editorial
 * layout. Nothing here is clickable: no cards, no hover-to-open, no
 * lightbox. Each piece fades/rises into place once as it's reached (not
 * scrubbed) and its image drifts a few percent on scroll — depth, not a
 * gimmick. Real pieces replace `ArtworkPlaceholder` later without touching
 * this layout.
 */
export function WorksGrid() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const items = wrap.querySelectorAll(`.${styles.item}`)
    const cleanups: Array<() => void> = []

    items.forEach((item) => {
      const frame = item.querySelector(`.${styles.frame}`)
      const parallax = item.querySelector(`.${styles.parallax}`)
      const caption = item.querySelector(`.${styles.caption}`)

      if (reduced) {
        gsap.set([frame, caption], { opacity: 1, y: 0 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: item, start: 'top 82%', once: true },
      })
      tl.to(frame, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }).to(
        caption,
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.6'
      )
      cleanups.push(() => {
        tl.scrollTrigger?.kill()
        tl.kill()
      })

      if (parallax) {
        const parallaxTween = gsap.fromTo(
          parallax,
          { yPercent: -9 },
          {
            yPercent: 9,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        )
        cleanups.push(() => {
          parallaxTween.scrollTrigger?.kill()
          parallaxTween.kill()
        })
      }
    })

    return () => cleanups.forEach((fn) => fn())
  }, [reduced])

  return (
    <div className={styles.wrap} ref={wrapRef}>
      {WORKS.map((work) => (
        <div
          key={work.id}
          className={`${styles.item} ${styles[`size-${work.size}`]} ${styles[`align-${work.align}`]} ${
            work.bleed ? styles.bleed : ''
          }`}
        >
          <div className={styles.frame}>
            <div className={styles.parallax}>
              <ArtworkPlaceholder variant={work.variant} label={work.category} />
            </div>
            {work.sparkles && (
              <SparkleField
                marks={[
                  { id: `${work.id}-s1`, kind: 'star', top: '8%', left: '86%', scale: 'accent', delay: 1.8 },
                  { id: `${work.id}-s2`, kind: 'dot', top: '90%', left: '4%', scale: 'small', delay: 4.2 },
                  { id: `${work.id}-s3`, kind: 'star', top: '48%', left: '-4%', scale: 'medium', delay: 6, tone: 'moonlight' },
                ]}
                style={{ zIndex: 2 }}
              />
            )}
            {work.constellation && <Constellation className={styles.constellation} />}
            {work.overlapTitle && work.title && (
              <span className={`${styles.overlapTitle} font-display`} aria-hidden="true">
                {work.title}
              </span>
            )}
          </div>
          <div className={styles.caption}>
            <span className={styles.number}>{work.number}</span>
            <span className={styles.category}>{work.category}</span>
            {work.title && !work.overlapTitle && (
              <span className={`${styles.title} font-display`}>{work.title}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
