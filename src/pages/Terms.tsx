import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Terms.module.css'
import { Sparkle } from '../components/Sparkle'
import { Constellation } from '../components/Constellation'
import { Atmosphere } from '../components/Atmosphere'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const SECTIONS = [
  {
    id: 'publishing',
    number: '01',
    title: 'Publishing the artwork',
    paragraphs: [
      'If you post the artwork anywhere, please tag the artist at least in the main publication. It goes a long way in helping the artist\'s work reach more people.',
    ],
  },
  {
    id: 'portfolio',
    number: '02',
    title: 'Artist portfolio & publishing rights',
    paragraphs: [
      'The artist may use and publish your commission on her own profile to showcase her work.',
      'If there\'s a legitimate reason not to — an unreleased book, a secret character, a project that needs to stay private — that\'s completely respected, as long as it\'s agreed on beforehand.',
    ],
  },
  {
    id: 'referrals',
    number: '03',
    title: 'Referrals',
    paragraphs: [
      'Referrals are always welcome and appreciated. If you refer someone who becomes a new client, you can both receive a special discount on future commissions.',
    ],
  },
]

export function Terms() {
  const pageRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page) return

    const articles = page.querySelectorAll(`.${styles.article}`)

    if (reduced) {
      gsap.set(articles, { opacity: 1, y: 0 })
      return
    }

    const triggers: ScrollTrigger[] = []
    articles.forEach((article) => {
      const tween = gsap.to(article, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: article, start: 'top 85%', once: true },
      })
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })
    return () => triggers.forEach((t) => t.kill())
  }, [reduced])

  return (
    <div ref={pageRef} className={styles.page}>
      <Atmosphere tone="calm" />

      <header className={styles.header}>
        <Constellation className={styles.headerConstellation} />
        <span className={styles.kicker}>05 — Terms of Service</span>
        <h1 className={`${styles.title} font-display`}>
          Terms of Service
          <Sparkle size={16} className={styles.sparkle} delay={0.5} />
        </h1>
      </header>

      <nav className={styles.index} aria-label="Terms sections">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={styles.indexLink}>
            <span className={styles.indexNumber}>{s.number}</span>
            {s.title}
          </a>
        ))}
      </nav>

      {SECTIONS.map((s) => (
        <article className={styles.article} id={s.id} key={s.id}>
          <span className={styles.articleNumber}>{s.number}</span>
          <h2 className={`${styles.articleTitle} font-display`}>{s.title}</h2>
          {s.paragraphs.map((p, i) => (
            <p className={styles.articleText} key={i}>
              {p}
            </p>
          ))}
        </article>
      ))}
    </div>
  )
}
