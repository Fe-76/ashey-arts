import { useEffect, useState } from 'react'

/**
 * Tracks the user's `prefers-reduced-motion` setting live (it can change
 * without a reload on some OSes). Every scroll-driven / decorative animation
 * in the app should check this before wiring up GSAP timelines.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', handler)
    return () => query.removeEventListener('change', handler)
  }, [])

  return reduced
}
