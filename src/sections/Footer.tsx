import { Link } from 'react-router-dom'
import styles from './Footer.module.css'
import { INSTAGRAM_URL } from '../config/social'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={`${styles.mark} font-display`}>Ashey Arts</span>
      <nav className={styles.links}>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        <Link to="/terms">Terms of Service</Link>
      </nav>
      <span className={styles.credit}>
        Illustration &amp; character design — commissions open by request.
      </span>
    </footer>
  )
}
