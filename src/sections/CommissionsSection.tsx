import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './CommissionsSection.module.css'
import { ArtworkPlaceholder } from '../components/ArtworkPlaceholder'
import { SparkleField } from '../components/SparkleField'
import { AmbientLight } from '../components/AmbientLight'
import { ContactCTA } from '../components/ContactCTA'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type Modality = {
  id: string
  number: string
  name: string
  price: string
  description: string
  variant: 1 | 2 | 3 | 4
  scale: 'sm' | 'md'
  align: 'left' | 'right'
  extraDetail?: boolean
  priceOverlay?: boolean
}

const MODALITIES: Modality[] = [
  {
    id: 'portrait',
    number: '01',
    name: 'Portrait',
    price: '$165 USD',
    description: 'A drawing containing the face and a bit of the shoulders.',
    variant: 1,
    scale: 'sm',
    align: 'left',
  },
  {
    id: 'bust',
    number: '02',
    name: 'Bust',
    price: '$195 USD',
    description: 'Containing the chest and the face.',
    variant: 2,
    scale: 'sm',
    align: 'right',
  },
  {
    id: 'half-body',
    number: '03',
    name: 'Half-Body',
    price: '$250 USD',
    description: 'An art from the waist up, with arms and face.',
    variant: 3,
    scale: 'md',
    align: 'left',
    extraDetail: true,
    priceOverlay: true,
  },
  {
    id: 'full-body',
    number: '04',
    name: 'Full Body',
    price: '$285 USD',
    description: 'Wonderful art from head to toe.',
    variant: 4,
    scale: 'md',
    align: 'right',
    extraDetail: true,
    priceOverlay: true,
  },
]

const BACKGROUNDS = [
  { id: 'bg-forest', label: 'Forests', variant: 2 as const },
  { id: 'bg-cave', label: 'Caves', variant: 4 as const },
  { id: 'bg-room', label: 'Rooms', variant: 1 as const },
  { id: 'bg-ruins', label: 'Destroyed buildings', variant: 3 as const },
]

const PRICING_NOTES = [
  'Contact the artist through Instagram DM to reserve a slot on the waiting list.',
  'Base values include character art + plain or gradient background.',
  'Complex backgrounds and full illustrations use their respective additional pricing.',
  'Commercial licenses and book cover prices are discussed separately.',
  'Each additional character is charged according to the corresponding individual art price.',
  'NSFW commissions have an additional fee depending on difficulty.',
  'Special discounts may exist for VIP clients, second purchases and referrals.',
]

/**
 * Etapa 3.5: this used to be the standalone `/commissions` page — it now
 * lives inside Home as `#commissions`, opening quietly (no fresh page
 * hero) so it reads as a continuation of Selected Works rather than a
 * new page pasted underneath. `/commissions` now just redirects here.
 */
export function CommissionsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const revealSets = [
      section.querySelectorAll(`.${styles.modalityFrame}`),
      section.querySelectorAll(`.${styles.modalityInfo}`),
      section.querySelectorAll(`.${styles.cinematicFrame}`),
      section.querySelectorAll(`.${styles.cinematicInfo}`),
      section.querySelectorAll(`.${styles.bgItem}`),
    ]
    const priceOverlays = section.querySelectorAll(`.${styles.priceOverlay}`)

    if (reduced) {
      revealSets.forEach((set) => gsap.set(set, { opacity: 1, y: 0 }))
      gsap.set(priceOverlays, { opacity: 1, y: 0 })
      return
    }

    const triggers: ScrollTrigger[] = []

    revealSets.forEach((set) => {
      set.forEach((el) => {
        const tween = gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
      })
    })

    priceOverlays.forEach((el) => {
      const tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 94%', once: true },
      })
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })

    return () => triggers.forEach((t) => t.kill())
  }, [reduced])

  return (
    <section className={styles.section} id="commissions" ref={sectionRef}>
      <AmbientLight color="var(--color-aurora-rose)" size={720} top="-10%" left="-12%" opacity={0.22} />
      <AmbientLight color="var(--color-primary)" size={560} top="40%" right="-8%" opacity={0.16} />

      <div className={styles.intro}>
        <span className={styles.kicker}>02 — Commissions</span>
        <h2 className={`${styles.introTitle} font-display`}>Commissions</h2>
        <p className={styles.introNote}>
          A few ways to bring a character to life — from a close-up portrait to a full
          illustrated scene.
        </p>
      </div>

      {MODALITIES.map((m) => (
        <article className={styles.modality} data-align={m.align} data-scale={m.scale} key={m.id}>
          <div className={styles.modalityFrame}>
            <ArtworkPlaceholder variant={m.variant} label={m.name} />
            {m.extraDetail && (
              <SparkleField
                marks={[{ id: `${m.id}-s`, kind: 'star', top: '8%', left: '84%', scale: 'medium', delay: 1.4 }]}
                style={{ zIndex: 2 }}
              />
            )}
            {m.priceOverlay && (
              <span className={`${styles.priceOverlay} font-display`} aria-hidden="true">
                {m.price}
              </span>
            )}
          </div>
          <div className={styles.modalityInfo}>
            <span className={styles.modalityNumber}>{m.number}</span>
            <h3 className={`${styles.modalityName} font-display`}>{m.name}</h3>
            {!m.priceOverlay && (
              <span className={`${styles.modalityPrice} font-display`}>{m.price}</span>
            )}
            <p className={styles.modalityDescription}>{m.description}</p>
          </div>
        </article>
      ))}

      <article className={styles.cinematic}>
        <AmbientLight color="var(--color-primary)" size={480} top="10%" left="8%" opacity={0.24} />
        <div className={styles.cinematicFrame}>
          <ArtworkPlaceholder variant={2} label="Couple illustration" />
        </div>
        <div className={styles.cinematicAccent}>
          <ArtworkPlaceholder variant={4} label="Couple illustration detail" />
        </div>
        <SparkleField
          marks={[{ id: 'couple-s', kind: 'dot', top: '6%', left: '4%', scale: 'small', delay: 2 }]}
          style={{ zIndex: 2 }}
        />
        <div className={styles.cinematicInfo}>
          <div className={styles.cinematicHeading}>
            <span className={styles.modalityNumber}>05</span>
            <h3 className={`${styles.cinematicName} font-display`}>Couple Illustration</h3>
          </div>
          <span className={`${styles.cinematicPrice} font-display`}>$600–650 USD</span>
        </div>
        <p className={styles.cinematicDescription}>
          Two half-body characters with a moody, complex background.
        </p>
        <p className={styles.additionalNote}>
          Each additional character is priced as its own individual art.
        </p>
      </article>

      <article className={styles.cinematic}>
        <div className={`${styles.cinematicFrame} ${styles.full}`}>
          <ArtworkPlaceholder variant={3} label="Full illustration" />
        </div>
        <div className={styles.cinematicAccent}>
          <ArtworkPlaceholder variant={1} label="Full illustration detail" />
        </div>
        <SparkleField
          marks={[
            { id: 'full-s1', kind: 'star', top: '10%', left: '6%', scale: 'accent', delay: 1.2, tone: 'moonlight' },
            { id: 'full-s2', kind: 'dot', top: '86%', left: '46%', scale: 'small', delay: 3.4 },
            { id: 'full-s3', kind: 'star', top: '22%', left: '92%', scale: 'medium', delay: 2.4 },
            { id: 'full-s4', kind: 'dot', top: '68%', left: '2%', scale: 'small', delay: 4.6 },
          ]}
          style={{ zIndex: 2 }}
        />
        <div className={styles.cinematicInfo}>
          <div className={styles.cinematicHeading}>
            <span className={styles.modalityNumber}>06</span>
            <h3 className={`${styles.cinematicName} font-display`}>Full Illustration</h3>
          </div>
          <span className={`${styles.cinematicPrice} font-display`}>$700–750 USD</span>
        </div>
        <p className={styles.cinematicDescription}>
          Two full-body characters with a moody, complex background — the most complete piece.
        </p>
        <p className={styles.additionalNote}>
          Each additional character is priced as its own individual art.
        </p>
      </article>

      <div className={styles.backgrounds}>
        <div className={styles.backgroundsHead}>
          <span className={styles.modalityNumber}>Complex backgrounds</span>
          <h3 className={`${styles.backgroundsPrice} font-display`}>$50–150 USD</h3>
          <p className={styles.modalityDescription}>
            Priced by complexity — forests, caves, rooms, destroyed buildings, or whatever the
            scene calls for.
          </p>
        </div>
        <div className={styles.backgroundsGallery}>
          {BACKGROUNDS.map((bg) => (
            <div className={styles.bgItem} key={bg.id}>
              <ArtworkPlaceholder variant={bg.variant} label={bg.label} />
              <span className={styles.bgLabel}>{bg.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={`${styles.infoTitle} font-display`}>Good to know</h3>
        <ul className={styles.infoList}>
          {PRICING_NOTES.map((note) => (
            <li className={styles.infoItem} key={note}>
              <span className={styles.infoMark}>✦</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.cta}>
        <ContactCTA />
      </div>
    </section>
  )
}
