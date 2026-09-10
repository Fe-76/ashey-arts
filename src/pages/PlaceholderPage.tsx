import styles from './PlaceholderPage.module.css'
import { Sparkle } from '../components/Sparkle'

type PlaceholderPageProps = {
  number: string
  title: string
  note: string
}

/**
 * Minimal but on-brand structure for routes that exist only so the sidebar
 * and navigation can be tested end to end this etapa. Real content
 * (pricing, process, legal text, tracking lookup) is a later etapa — this
 * is deliberately just a title + a short note, not a fleshed-out page.
 */
export function PlaceholderPage({ number, title, note }: PlaceholderPageProps) {
  return (
    <section className={styles.section}>
      <Sparkle size={16} className={styles.sparkle} delay={0.6} />
      <span className={styles.number}>{number}</span>
      <h1 className={`${styles.title} font-display`}>{title}</h1>
      <p className={styles.note}>{note}</p>
    </section>
  )
}
