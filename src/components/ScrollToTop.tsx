import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Every route change starts at the top — except the sidebar's "Works" link
 * (`/#selected-works`), which Home's own effect smooth-scrolls to instead.
 *
 * Keyed on `pathname` only (not `hash`): an in-page anchor click — the
 * Terms index, for instance — changes the hash without changing the
 * pathname, so it never triggers this and never fights the browser's own
 * anchor jump. A real route change is what must land at the top.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}
