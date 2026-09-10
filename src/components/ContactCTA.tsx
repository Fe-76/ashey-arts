import styles from './ContactCTA.module.css'
import { Sparkle } from './Sparkle'
import { INSTAGRAM_URL } from '../config/social'

type ContactCTAProps = {
  tagline?: string
  className?: string
}

/**
 * "Start your commission ✦" — treated as a typographic/interactive
 * moment, not a rounded button. Hover draws the underline, nudges the
 * tagline, and gives the sparkle a small reaction plus a soft pink glow.
 */
export function ContactCTA({ tagline = 'Have an idea in mind? Let\u2019s talk about it.', className }: ContactCTAProps) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.cta} ${className ?? ''}`}
    >
      <span>
        <span className={`${styles.line1} font-display`}>Start your</span>
        <span className={`${styles.line2} font-display`}>
          commission <Sparkle scale="medium" className={styles.sparkle} />
        </span>
      </span>
      <span className={styles.rule} aria-hidden="true" />
      <span className={styles.tagline}>{tagline}</span>
    </a>
  )
}
