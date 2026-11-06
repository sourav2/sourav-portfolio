import React, { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedEmoji from './AnimatedEmoji'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Career Milestones Data matching exact reference specifications
 */
export const MILESTONES_DATA = [
  {
    year: '2016',
    title: 'Full Stack Development Intern',
    description:
      'Started my career building responsive websites with HTML5, CSS3, and functional layout rules like Flexbox and Grid.',
    side: 'right',
  },
  {
    year: '2020',
    title: 'Graphic Design, UI Design & Front-End',
    description:
      'Designed visual assets and website interfaces in Photoshop while designing and implementing responsive websites in WordPress.',
    side: 'left',
    nowrap: true, // Prevents "Front-End" from wrapping to a second line
  },
  {
    year: '2024',
    title: 'UI/UX Design & Figma',
    description:
      'Expanded into formal UI/UX, adopting Figma for wireframes, prototypes, and high-fidelity interfaces while applying UX principles to real-world projects.',
    side: 'right',
  },
  {
    year: '2026',
    title: 'UI/UX Design & AI-Powered Workflows',
    description:
      'Focused on creating polished, scalable interfaces while exploring motion, design systems, and AI-assisted tools to improve the design process.',
    side: 'left',
  },
]

/**
 * CareerTimeline Component
 *
 * Implements Section 3 of the portfolio ("The Journey So Far"):
 * 1. Direction-Independent Top-to-Bottom Sequential Animation:
 *    - Always animates forward: 2016 → 2020 → 2024 → 2026.
 *    - Whether scrolling down into the section or scrolling up from below, the animation
 *      always starts at 2016 and progresses forward to 2026. Never runs backward.
 * 2. Automatic Time-Based Playback:
 *    - Uses a self-playing GSAP timeline over ~4.0 seconds (not scroll-scrubbed).
 *    - Scroll direction does not influence animation playback speed or direction.
 * 3. Pinned Scrolling Experience & Viewport Following:
 *    - Pinned while the 4-second sequence is in flight so visitor can comfortably follow along.
 *    - Progressively shifts content upward so lower cards (2024, 2026) are brought right into
 *      the visible reading zone, even in shorter viewports or on mobile.
 *    - Releases pin upon completion so normal scrolling resumes.
 * 4. Replay on Every Entry:
 *    - Resets cleanly when leaving the section in either direction.
 *    - Replays fresh forward sequence every time the visitor returns.
 * 5. Responsive Mobile Layout:
 *    - Continuous vertical rail and glowing points visible on the left.
 *    - All cards arranged cleanly on the right with zero horizontal overflow.
 */
export default function CareerTimeline({
  milestones = MILESTONES_DATA,
  isActive = false,
  onTimelineStart,
  onTimelineComplete,
  className = '',
}) {
  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const cardsWrapperRef = useRef(null)
  const lavenderBgRef = useRef(null)
  const meshRef = useRef(null)
  const headingRef = useRef(null)
  const headingTextRef = useRef(null)
  const lineFillRef = useRef(null)
  const cardRefs = useRef([])
  const nodeRefs = useRef([])
  const animTlRef = useRef(null)
  const bgAnimRef = useRef(null)
  const isLavenderRef = useRef(false)
  const isPlayingRef = useRef(false)
  const hasCompletedRef = useRef(false)

  // Stable refs for callbacks to prevent re-triggering effects on parent re-renders
  const onTimelineStartRef = useRef(onTimelineStart)
  const onTimelineCompleteRef = useRef(onTimelineComplete)
  onTimelineStartRef.current = onTimelineStart
  onTimelineCompleteRef.current = onTimelineComplete

  // Helper: Resets all animated elements to pristine initial state
  const resetToInitial = useCallback(() => {
    if (animTlRef.current) {
      animTlRef.current.kill()
      animTlRef.current = null
    }
    isPlayingRef.current = false
    hasCompletedRef.current = false

    if (lineFillRef.current) {
      gsap.set(lineFillRef.current, {
        scaleY: 0,
        transformOrigin: 'top center',
      })
    }
    if (cardsWrapperRef.current) {
      gsap.set(cardsWrapperRef.current, { y: 0 })
    }
    nodeRefs.current.forEach((node) => {
      if (node) {
        gsap.set(node, {
          scale: 0.85,
          opacity: 0.45,
          transformOrigin: 'center center',
          boxShadow: '0 0 0px rgba(255, 255, 255, 0)',
        })
      }
    })

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024
    const slideDistance = isMobile ? 60 : 120
    cardRefs.current.forEach((card, idx) => {
      if (card) {
        const isRight = milestones[idx]?.side === 'right'
        const initX = isMobile ? slideDistance : (isRight ? slideDistance : -slideDistance)
        gsap.set(card, {
          x: initX,
          opacity: 0,
        })
      }
    })
  }, [milestones])

  // Helper: Plays forward 4.0s sequence from 2016 → 2026
  const playSequence = useCallback(() => {
    if (typeof window === 'undefined') return
    // Prevent double-triggering while running or if already completed for this viewport entry
    if (isPlayingRef.current || hasCompletedRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      if (lineFillRef.current) gsap.set(lineFillRef.current, { scaleY: 1 })
      if (cardsWrapperRef.current) gsap.set(cardsWrapperRef.current, { y: 0 })
      cardRefs.current.forEach((card) => {
        if (card) gsap.set(card, { x: 0, opacity: 1 })
      })
      nodeRefs.current.forEach((node) => {
        if (node) {
          gsap.set(node, {
            scale: 1.15,
            opacity: 1,
            boxShadow: '0 0 16px 3px rgba(255, 255, 255, 0.95), 0 0 6px 1px rgba(255, 255, 255, 0.8)',
          })
        }
      })
      hasCompletedRef.current = true
      onTimelineCompleteRef.current && onTimelineCompleteRef.current()
      return
    }

    // Reset cleanly before starting fresh forward animation
    resetToInitial()

    const isMobile = window.innerWidth < 1024
    const wrapperH = cardsWrapperRef.current?.offsetHeight || 0
    const viewportH = viewportRef.current?.offsetHeight || 0
    const overflowH = wrapperH - viewportH
    const shiftDistance = overflowH > 0
      ? overflowH + 28
      : (isMobile ? 36 : 0)

    const tl = gsap.timeline({
      paused: false,
      onStart: () => {
        isPlayingRef.current = true
        onTimelineStartRef.current && onTimelineStartRef.current()
      },
      onComplete: () => {
        isPlayingRef.current = false
        hasCompletedRef.current = true
        onTimelineCompleteRef.current && onTimelineCompleteRef.current()
      },
    })
    animTlRef.current = tl

    // 1. Smooth linear line fill from top to bottom over 4.0s
    tl.to(
      lineFillRef.current,
      {
        scaleY: 1,
        duration: 4.0,
        ease: 'none',
      },
      0
    )

    // 2. Viewport following: smoothly shift cards upward so lower cards are in view
    if (shiftDistance > 0) {
      tl.to(
        cardsWrapperRef.current,
        {
          y: -shiftDistance,
          duration: 2.8,
          ease: 'power1.inOut',
        },
        1.0
      )
    }

    // 3. Four sequential milestones (always forward 2016 → 2026)
    // 0–1s: Point 0 (2016) activates at 0.5s, Card 1 slides in
    // 1–2s: Point 1 (2020) activates at 1.5s, Card 2 slides in
    // 2–3s: Point 2 (2024) activates at 2.5s, Card 3 slides in
    // 3–4s: Point 3 (2026) activates at 3.5s, Card 4 slides in
    const activationTimes = [0.5, 1.5, 2.5, 3.5]

    milestones.forEach((_, idx) => {
      const time = activationTimes[idx] ?? (0.5 + idx * 1.0)

      // Point activation: spring scale pop + white ambient glow bloom
      if (nodeRefs.current[idx]) {
        tl.to(
          nodeRefs.current[idx],
          {
            scale: 1.25,
            opacity: 1,
            boxShadow:
              '0 0 16px 3px rgba(255, 255, 255, 0.95), 0 0 6px 1px rgba(255, 255, 255, 0.8)',
            duration: 0.4,
            ease: 'back.out(2)',
          },
          time
        )
      }

      // Card entrance: slides into position with natural spring settling
      if (cardRefs.current[idx]) {
        tl.to(
          cardRefs.current[idx],
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'back.out(1.4)',
          },
          time
        )
      }
    })

    // Brief settling hold at end
    tl.to({}, { duration: 0.3 }, 3.9)
  }, [milestones, resetToInitial])

  // Helper: Transitions background smoothly from warm off-white to atmospheric lavender (~850ms)
  const transitionToLavender = useCallback((duration = 0.85, delay = 0.15) => {
    if (isLavenderRef.current) return
    isLavenderRef.current = true

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const animDuration = prefersReducedMotion ? 0.05 : duration
    const animDelay = prefersReducedMotion ? 0 : delay

    if (bgAnimRef.current) bgAnimRef.current.kill()

    const tl = gsap.timeline({ overwrite: 'auto' })
    bgAnimRef.current = tl

    if (lavenderBgRef.current) {
      tl.to(
        lavenderBgRef.current,
        {
          opacity: 1,
          duration: animDuration,
          ease: 'power2.out',
        },
        animDelay
      )
    }

    if (meshRef.current) {
      tl.to(
        meshRef.current,
        {
          opacity: 1,
          duration: animDuration,
          ease: 'power2.out',
        },
        animDelay
      )
    }

    if (headingTextRef.current) {
      tl.to(
        headingTextRef.current,
        {
          color: '#FFFFFF',
          duration: animDuration,
          ease: 'power2.out',
        },
        animDelay
      )
    }
  }, [])

  // Helper: Transitions background gently back from lavender to warm off-white (~800ms)
  const transitionToOffWhite = useCallback((duration = 0.8) => {
    if (!isLavenderRef.current) return
    isLavenderRef.current = false

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const animDuration = prefersReducedMotion ? 0.05 : duration

    if (bgAnimRef.current) bgAnimRef.current.kill()

    const tl = gsap.timeline({ overwrite: 'auto' })
    bgAnimRef.current = tl

    if (lavenderBgRef.current) {
      tl.to(
        lavenderBgRef.current,
        {
          opacity: 0,
          duration: animDuration,
          ease: 'power2.out',
        },
        0
      )
    }

    if (meshRef.current) {
      tl.to(
        meshRef.current,
        {
          opacity: 0,
          duration: animDuration,
          ease: 'power2.out',
        },
        0
      )
    }

    if (headingTextRef.current) {
      tl.to(
        headingTextRef.current,
        {
          color: '#171717',
          duration: animDuration,
          ease: 'power2.out',
        },
        0
      )
    }
  }, [])

  // Reactive trigger on isActive prop change (plays when section becomes active)
  useEffect(() => {
    if (isActive) {
      transitionToLavender()
      playSequence()
    } else {
      transitionToOffWhite()
    }
  }, [isActive, transitionToLavender, transitionToOffWhite, playSequence])

  // ScrollTrigger & Viewport Observers
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current || !lineFillRef.current) return

    // Initially ensure background is warm off-white (lavender & white-mesh at opacity 0)
    if (lavenderBgRef.current) gsap.set(lavenderBgRef.current, { opacity: 0 })
    if (meshRef.current) gsap.set(meshRef.current, { opacity: 0 })
    if (headingTextRef.current) gsap.set(headingTextRef.current, { color: '#171717' })
    isLavenderRef.current = false

    resetToInitial()

    const triggerEl = sectionRef.current.closest('.pin-spacer') || sectionRef.current

    // Helper: resets ONLY when the section & its pinned scroll area have completely exited the viewport
    const handleExitReset = () => {
      if (!sectionRef.current) return
      const el = sectionRef.current.closest('.pin-spacer') || sectionRef.current
      const rect = el.getBoundingClientRect()
      // Completely exited downwards into About (rect.bottom <= 5) or upwards into Works (rect.top >= window.innerHeight - 5)
      const isCompletelyExited = rect.bottom <= 5 || rect.top >= window.innerHeight - 5
      if (isCompletelyExited) {
        resetToInitial()
        transitionToOffWhite()
      }
    }

    // 1. Strict Exit Detection ScrollTrigger:
    // Only resets when the section and its pinned scroll area have 100% exited the viewport.
    // - onLeave: fires when bottom passes top of viewport (scrolling down into About)
    // - onLeaveBack: fires when top passes bottom of viewport (scrolling up into Works)
    const exitST = ScrollTrigger.create({
      id: 'journey-exit-trigger',
      trigger: triggerEl,
      start: 'top bottom', // When top of section hits bottom of viewport
      end: 'bottom top',   // When bottom of section hits top of viewport
      onLeave: () => {
        handleExitReset()
        transitionToOffWhite()
      },
      onLeaveBack: () => {
        handleExitReset()
        transitionToOffWhite()
      },
    })

    // 2. Viewport Entry Playback ScrollTrigger:
    // Starts the forward 2016 → 2026 animation and blooms background to lavender
    const entryST = ScrollTrigger.create({
      id: 'journey-entry-trigger',
      trigger: triggerEl,
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => {
        // Entering scrolling DOWN from Works -> Always play forward 2016 → 2026 & bloom to lavender
        transitionToLavender()
        playSequence()
      },
      onEnterBack: () => {
        // Entering scrolling UP from About -> Always play forward 2016 → 2026 & bloom to lavender
        transitionToLavender()
        playSequence()
      },
    })

    // 3. Failsafe scroll listener to verify complete exit during fast wheel/trackpad gestures
    const handleScroll = () => {
      handleExitReset()
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      exitST.kill()
      entryST.kill()
      if (animTlRef.current) {
        animTlRef.current.kill()
        animTlRef.current = null
      }
      if (bgAnimRef.current) {
        bgAnimRef.current.kill()
        bgAnimRef.current = null
      }
    }
  }, [playSequence, resetToInitial, transitionToLavender, transitionToOffWhite])

  return (
    <section
      id="journey"
      ref={sectionRef}
      className={`relative w-full h-screen h-[100svh] min-h-[100vh] max-h-[100svh] bg-canvas text-primary flex flex-col justify-start overflow-hidden select-none ${className}`}
      aria-label="Career Timeline — The Journey So Far"
    >
      {/* ============================================================ */}
      {/* 1. Dynamic Lavender Background Transition Layer              */}
      {/* ============================================================ */}
      <div
        ref={lavenderBgRef}
        aria-hidden="true"
        className="absolute inset-0 bg-[#A390FB] opacity-0 pointer-events-none will-change-[opacity] z-0"
      />

      {/* ============================================================ */}
      {/* 2. Dotted Mesh Pattern over Lavender Background              */}
      {/* ============================================================ */}
      <div
        ref={meshRef}
        aria-hidden="true"
        className="absolute inset-0 opacity-0 pointer-events-none will-change-[opacity] z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255, 255, 255, 0.45) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          backgroundPosition: 'center top',
          maxWidth: '1440px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
        }}
      />

      {/* Content Container (Max 1440px Width) */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-16 sm:pt-20 lg:pt-20 pb-4 sm:pb-6 lg:pb-6 flex flex-col h-full max-h-[100svh] overflow-hidden">
        {/* ============================================================ */}
        {/* Main Heading: The Journey So Far 🚀                           */}
        {/* ============================================================ */}
        <div ref={headingRef} className="w-full mb-4 sm:mb-6 lg:mb-8 shrink-0">
          <h2
            ref={headingTextRef}
            className="font-display type-section-heading text-[32px] sm:text-[44px] md:text-[52px] lg:text-[64px] font-normal leading-[1.12] lg:leading-[1.08] tracking-tight inline-flex items-center gap-3 sm:gap-4 flex-wrap"
            style={{ color: '#171717' }}
          >
            <span>The Journey So Far</span>
            <AnimatedEmoji
              variant="rocket"
              ariaLabel="Rocket"
              className="text-[0.82em]"
            >
              🚀
            </AnimatedEmoji>
          </h2>
        </div>

        {/* ============================================================ */}
        {/* Story Viewport (Follows content downwards as cards reveal)   */}
        {/* ============================================================ */}
        <div
          ref={viewportRef}
          className="relative w-full flex-1 overflow-hidden flex flex-col justify-start"
        >
          <div
            ref={cardsWrapperRef}
            className="relative w-full py-2 will-change-transform"
          >
            {/* 
              Continuous Vertical Timeline Track:
              - Mobile (< lg): Anchored cleanly on the left (left-[20px] sm:left-[28px])
              - Desktop (>= lg): Centered in the middle (lg:left-1/2 lg:-translate-x-1/2)
            */}
            <div
              aria-hidden="true"
              className="absolute left-[20px] sm:left-[28px] lg:left-1/2 -translate-x-1/2 top-4 lg:top-6 bottom-4 lg:bottom-6 w-[6px] lg:w-[8px] rounded-full border-[1.5px] lg:border-2 border-white bg-white/20 pointer-events-none z-10 overflow-hidden"
            >
              {/* Active Progress Fill Line */}
              <div
                ref={lineFillRef}
                className="w-full h-full bg-[#0E0E10] rounded-full origin-top shadow-[0_0_8px_rgba(14,14,16,0.35)]"
              />
            </div>

            {/* 4 Milestone Rows */}
            {milestones.map((item, idx) => {
              const isRight = item.side === 'right'

              return (
                <div
                  key={item.year}
                  className="relative w-full grid grid-cols-1 lg:grid-cols-2 items-center lg:gap-x-16 xl:gap-x-24 my-2.5 sm:my-3 lg:my-3 pl-10 sm:pl-14 lg:pl-0 min-h-[96px] sm:min-h-[110px] lg:min-h-0"
                >
                  {/* 
                    Milestone Indicator Dot:
                    - Anchored directly on top of the vertical track
                    - Mobile: left-[20px] sm:left-[28px]
                    - Desktop: lg:left-1/2
                  */}
                  <div
                    aria-hidden="true"
                    className="absolute pointer-events-none z-20 flex items-center justify-center left-[20px] sm:left-[28px] lg:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6"
                  >
                    <div
                      ref={(el) => {
                        if (el) nodeRefs.current[idx] = el
                      }}
                      className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 border-white bg-[#0E0E10] flex items-center justify-center shadow-sm transition-all duration-300"
                      style={{ transformOrigin: 'center center' }}
                    >
                      <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-[#A390FB] transition-all duration-300" />
                    </div>
                  </div>

                  {isRight ? (
                    <>
                      <div className="hidden lg:block" />
                      <div className="w-full flex justify-start">
                        <div
                          ref={(el) => {
                            if (el) cardRefs.current[idx] = el
                          }}
                          className="w-full max-w-[calc(100vw-80px)] sm:max-w-none lg:max-w-[550px] xl:max-w-[580px] rounded-2xl bg-[#F8F6FE] border-2 border-white p-3.5 sm:p-4.5 lg:p-5 shadow-card-light will-change-[transform,opacity]"
                        >
                          {/* Year Label Badge */}
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-primary/15 bg-white/90 text-[12px] font-medium text-secondary mb-2 tracking-tight font-sans">
                            {item.year}
                          </div>

                          {/* Card Title */}
                          <h3
                            className={`font-sans font-semibold text-[20px] sm:text-[23px] lg:text-[25px] xl:text-[27px] text-primary leading-[1.24] tracking-[-0.015em] mb-1.5 ${item.nowrap ? 'whitespace-nowrap' : ''
                              }`}
                          >
                            {item.title}
                          </h3>

                          {/* Body Text */}
                          <p className="font-sans font-normal text-[14px] sm:text-[16px] text-secondary leading-[1.55] sm:leading-[1.6] tracking-tight">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-full flex justify-start lg:justify-end lg:col-start-1 lg:row-start-1">
                        <div
                          ref={(el) => {
                            if (el) cardRefs.current[idx] = el
                          }}
                          className="w-full max-w-[calc(100vw-80px)] sm:max-w-none lg:max-w-[550px] xl:max-w-[580px] rounded-2xl bg-[#F8F6FE] border-2 border-white p-3.5 sm:p-4.5 lg:p-5 shadow-card-light will-change-[transform,opacity]"
                        >
                          {/* Year Label Badge */}
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-primary/15 bg-white/90 text-[12px] font-medium text-secondary mb-2 tracking-tight font-sans">
                            {item.year}
                          </div>

                          {/* Card Title */}
                          <h3
                            className={`font-sans font-semibold text-[20px] sm:text-[23px] lg:text-[25px] xl:text-[27px] text-primary leading-[1.24] tracking-[-0.015em] mb-1.5 ${item.nowrap ? 'whitespace-nowrap' : ''
                              }`}
                          >
                            {item.title}
                          </h3>

                          {/* Body Text */}
                          <p className="font-sans font-normal text-[14px] sm:text-[16px] text-secondary leading-[1.55] sm:leading-[1.6] tracking-tight">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="hidden lg:block lg:col-start-2 lg:row-start-1" />
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
