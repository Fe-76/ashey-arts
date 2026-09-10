import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Opening } from '../sections/Opening'
import { ArtOne } from '../sections/ArtOne'
import { ArtTwo } from '../sections/ArtTwo'
import { ArtThree } from '../sections/ArtThree'
import { SelectedWorksTeaser } from '../sections/SelectedWorksTeaser'
import { WorksGrid } from '../sections/WorksGrid'
import { CommissionsSection } from '../sections/CommissionsSection'
import { HowItWorksSection } from '../sections/HowItWorksSection'
import { TrackSection } from '../sections/TrackSection'
import { Footer } from '../sections/Footer'
import { useLenis } from '../hooks/useLenis'
import { useReducedMotion } from '../hooks/useReducedMotion'

const ANCHOR_IDS = ['selected-works', 'commissions', 'how-it-works', 'track']

/**
 * Etapa 3.5: Home is now the whole public experience end to end — a
 * visitor can scroll from the opening all the way through Commissions,
 * How it Works and Track your Commission without ever opening the
 * sidebar. The sidebar's non-Terms links are anchors into this page
 * (`/#commissions` etc.), not separate routes — see `/commissions`,
 * `/how-it-works` and `/track` in `src/pages`, which now just redirect
 * here. Only `/terms` stays a real, separate route.
 */
export function Home() {
  const reduced = useReducedMotion()
  useLenis(!reduced)
  const location = useLocation()

  // Sidebar anchors (and the redirect pages) land here with a hash —
  // scroll to the matching section once it exists. Runs whether Home
  // just mounted (coming from another route) or was already showing
  // (clicking a different anchor while on Home).
  useEffect(() => {
    const id = location.hash.replace('#', '')
    if (!ANCHOR_IDS.includes(id)) return
    const target = document.getElementById(id)
    if (!target) return
    const timer = setTimeout(() => {
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    }, 60)
    return () => clearTimeout(timer)
  }, [location.hash, location.key, reduced])

  return (
    <main>
      <Opening />
      <ArtOne />
      <ArtTwo />
      <ArtThree />
      <SelectedWorksTeaser />
      <WorksGrid />
      <CommissionsSection />
      <HowItWorksSection />
      <TrackSection />
      <Footer />
    </main>
  )
}
