import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './HowItWorksSection.module.css'
import { ArtworkPlaceholder } from '../components/ArtworkPlaceholder'
import { AmbientLight } from '../components/AmbientLight'
import { Sparkle } from '../components/Sparkle'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Etapa 3.5: this used to be the standalone `/how-it-works` page — it now
 * lives inside Home as `#how-it-works`, right after Commissions.
 * `/how-it-works` now just redirects here.
 */
export function HowItWorksSection() {
  const wrapRef = useRef<HTMLElement>(null)
  const lineFillRef = useRef<HTMLDivElement>(null)
  const sketchRefs = useRef<Array<HTMLDivElement | null>>([])
  const continuationRef = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const lineFill = lineFillRef.current
    if (!wrap) return

    const steps = wrap.querySelectorAll(`.${styles.step}`)
    const continuation = continuationRef.current

    if (reduced) {
      gsap.set(wrap.querySelectorAll(`.${styles.stepNumber}, .${styles.stepBody}`), {
        opacity: 1,
        x: 0,
        y: 0,
      })
      gsap.set(continuation, { opacity: 1 })
      if (lineFill) gsap.set(lineFill, { scaleY: 1 })
      return
    }

    const triggers: ScrollTrigger[] = []

    if (lineFill) {
      const lineTween = gsap.to(lineFill, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: 0.4,
        },
      })
      if (lineTween.scrollTrigger) triggers.push(lineTween.scrollTrigger)
    }

    steps.forEach((step) => {
      const number = step.querySelector(`.${styles.stepNumber}`)
      const body = step.querySelector(`.${styles.stepBody}`)
      const tl = gsap.timeline({
        scrollTrigger: { trigger: step, start: 'top 78%', once: true },
      })
      tl.to(number, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }).to(
        body,
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger)
    })

    if (continuation) {
      const tween = gsap.to(continuation, {
        opacity: 1,
        duration: 1,
        scrollTrigger: { trigger: continuation, start: 'top 90%', once: true },
      })
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    }

    sketchRefs.current.forEach((el, i) => {
      if (!el) return
      const range = 6 + i * 3
      const tween = gsap.fromTo(
        el,
        { yPercent: -range },
        {
          yPercent: range,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5 + i * 0.15,
          },
        }
      )
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })

    return () => triggers.forEach((t) => t.kill())
  }, [reduced])

  return (
    <section ref={wrapRef} className={styles.section} id="how-it-works">
      <AmbientLight color="var(--color-aurora-blue)" size={640} top="-6%" right="-10%" opacity={0.2} />

      <div className={styles.intro}>
        <span className={styles.kicker}>03 — How it works</span>
        <h2 className={`${styles.introTitle} font-display`}>How it works</h2>
      </div>

      <div className={styles.stepsWrap}>
        <div className={styles.lineTrack}>
          <div className={styles.lineFill} ref={lineFillRef} />
          <Sparkle
            scale="small"
            tone="moonlight"
            className={styles.lineMarker}
            style={{ top: '32%' }}
            delay={0.4}
            loop
            loopInterval={[9, 18]}
          />
          <Sparkle
            scale="small"
            className={styles.lineMarker}
            style={{ top: '66%' }}
            delay={0.6}
            loop
            loopInterval={[10, 19]}
          />
        </div>

        <div className={styles.step}>
          <span className={styles.stepNumber}>
            01
            <Sparkle scale="small" delay={0.5} className={styles.stepSpark} />
          </span>
          <div className={styles.stepBody}>
            <h3 className={`${styles.stepTitle} font-display`}>Contact</h3>
            <p className={styles.stepText}>
              It all starts with a DM on Instagram —{' '}
              <span className={styles.handle}>@yehsarts</span>. Send over your idea, any
              references, a description of the character, your desired deadline, and anything
              else that helps.
            </p>
            <p className={styles.stepText}>
              I'll get back to you to check if the piece is doable, and share a price estimate
              and the available dates. I won't bite you, hahaha — just come say hi.
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <span className={styles.stepNumber}>
            02
            <Sparkle scale="small" delay={0.5} className={styles.stepSpark} />
          </span>
          <div className={styles.stepBody}>
            <h3 className={`${styles.stepTitle} font-display`}>Waiting list</h3>
            <p className={styles.stepText}>
              Once we've talked through the request, the approximate price and a date, your
              commission joins the waiting list. As we get closer to your date, I'll reach out
              again to confirm everything.
            </p>
            <p className={styles.aside}>
              You'll eventually be able to follow your place in the queue right here on the
              site, through{' '}
              <Link to="/#track" className={styles.asideLink}>
                Track your commission
              </Link>{' '}
              — that part isn't live yet.
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <span className={styles.stepNumber}>
            03
            <Sparkle scale="medium" tone="moonlight" delay={0.5} className={styles.stepSpark} />
          </span>
          <div className={styles.stepBody}>
            <h3 className={`${styles.stepTitle} font-display`}>Sketch &amp; payment</h3>

            <div className={styles.introRow}>
              <p className={`${styles.stepText} ${styles.introText}`}>
                When your date arrives, we confirm the idea once more and I put together two to
                four sketches, depending on how much room the idea has for variation.
              </p>

              <div className={styles.sketches} aria-hidden="true">
                {[1, 2, 3].map((n, i) => (
                  <div
                    className={styles.sketch}
                    key={n}
                    ref={(el) => {
                      sketchRefs.current[i] = el
                    }}
                  >
                    <ArtworkPlaceholder variant={((n % 4) + 1) as 1 | 2 | 3 | 4} label={`Sketch study ${n}`} />
                  </div>
                ))}
              </div>
            </div>

            <p className={styles.stepText}>
              You pick your favorite, and changes and suggestions are always welcome at this
              stage — that's what it's there for. Once we lock the final piece and price:
            </p>

            <div className={styles.paymentRow}>
              <span className={styles.paymentOption}>
                80%<span>to start the piece</span>
              </span>
              <span className={styles.paymentOption}>
                100%<span>if you'd rather pay it all upfront</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.continuation} ref={continuationRef}>
        From there, your piece moves into production and, eventually, delivery.
      </p>
    </section>
  )
}
