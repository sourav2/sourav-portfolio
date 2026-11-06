import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroSlider, { SLIDES_DATA } from './HeroSlider'
import ExpertiseBadge from './ExpertiseBadge'

// Register GSAP ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * TypewriterWord Component
 * Wraps a word in an inline-block whitespace-nowrap container so that line wrapping
 * occurs strictly at word boundaries. Each character is rendered as an inline span
 * with a .tw-token class for zero-layout-shift typewriter reveals.
 */
function TypewriterWord({ word }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {word.split('').map((char, index) => (
        <span
          key={index}
          className="tw-token opacity-0 will-change-[opacity]"
          data-char={char}
        >
          {char}
        </span>
      ))}
    </span>
  )
}

/**
 * HeroSection Component
 *
 * Implements the official two-column portfolio Hero Section with pinned scroll transition:
 * - Section is 100vh, initially fully visible and stationary.
 * - On scroll, Hero remains pinned while its content transitions out and the background
 *   circle animates upward until completely exiting the viewport.
 * - Background circle is positioned behind the Hero content, with its top aligned to the
 *   portrait and text area, within the 1440px content container, with a smooth gradient
 *   that fades naturally into the warm background (#F7F5F0).
 * - Smoothly releases into the Case Studies section once transition completes.
 *
 * @param {Object} props
 * @param {Array} [props.slides=SLIDES_DATA] - Slide definitions for the hero slider
 * @param {string} [props.className=''] - Additional container classes
 */
export default function HeroSection({
  slides = SLIDES_DATA,
  className = '',
  isLoaded = true,
  enablePinning = true,
}) {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const circleWrapperRef = useRef(null)
  const circleInnerRef = useRef(null)
  const paragraphRef = useRef(null)
  const metricsRef = useRef(null)

  // 1. Align resting top position of circle with the top of portrait and text area
  useEffect(() => {
    const updateCircleTop = () => {
      if (contentRef.current && circleWrapperRef.current) {
        const contentTop = contentRef.current.offsetTop
        circleWrapperRef.current.style.top = `${contentTop}px`
      }
    }

    updateCircleTop()
    window.addEventListener('resize', updateCircleTop)
    return () => window.removeEventListener('resize', updateCircleTop)
  }, [])

  // 2. Initial page load animation: slides upward from below to resting position
  useEffect(() => {
    if (circleInnerRef.current) {
      gsap.fromTo(
        circleInnerRef.current,
        { y: 120, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.2 }
      )
    }
  }, [])

  // 3. ScrollTrigger: Continuous scroll-driven pinned transition (optional, disabled in 100svh full-page mode)
  useEffect(() => {
    if (
      !enablePinning ||
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !circleWrapperRef.current ||
      !contentRef.current
    ) {
      return
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'hero-scroll',
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=100%',
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // Circle animates upward until it completely exits the viewport
        tl.to(
          circleWrapperRef.current,
          {
            y: -1400,
            opacity: 0,
            ease: 'power1.inOut',
          },
          0
        )

        // Hero content transitions out smoothly
        tl.to(
          contentRef.current,
          {
            y: -70,
            opacity: 0,
            ease: 'power1.out',
          },
          0
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [enablePinning])

  // 4. Typewriter Text Entrance Animation & Metrics Summary Coordination
  // - Types out introductory text character by character with pauses at punctuation & badges
  // - Coordinates with portrait card drop (begins at 0.5s as card rebound settles)
  // - Metrics summary fades in smoothly once typewriter finishes
  // - Zero layout shift because all elements are rendered in DOM from frame 0
  // - Immediately displays static content if prefers-reduced-motion is active
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined' || !paragraphRef.current) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      const tokens = paragraphRef.current.querySelectorAll('.tw-token')
      gsap.set(tokens, { opacity: 1 })
      if (metricsRef.current) {
        gsap.set(metricsRef.current, { opacity: 1, y: 0 })
      }
      return
    }

    const tokens = Array.from(paragraphRef.current.querySelectorAll('.tw-token'))
    gsap.set(tokens, { opacity: 0 })
    if (metricsRef.current) {
      gsap.set(metricsRef.current, { opacity: 0, y: 12 })
    }

    // Coordinated entrance: begins at 0.5s as portrait card drop and rebound settles
    const tl = gsap.timeline({ delay: 0.5 })

    tokens.forEach((token) => {
      const char = token.getAttribute('data-char') || ''
      const isBadge = token.classList.contains('tw-badge')

      if (isBadge) {
        tl.to(token, {
          opacity: 1,
          duration: 0.12,
          ease: 'power1.out',
        })
        tl.to({}, { duration: 0.10 })
      } else {
        tl.to(token, {
          opacity: 1,
          duration: 0.016,
          ease: 'none',
        })

        if (char === ',' || char === '—') {
          tl.to({}, { duration: 0.08 })
        } else if (char === '.') {
          tl.to({}, { duration: 0.16 })
        }
      }
    })

    // Metrics summary fades in smoothly once typewriter completes
    if (metricsRef.current) {
      tl.to(
        metricsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '+=0.05'
      )
    }

    return () => {
      tl.kill()
    }
  }, [isLoaded])

  return (
    <section
      id="home"
      ref={sectionRef}
      className={`relative w-full min-h-[calc(100svh-5rem)] lg:h-[calc(100svh-5rem)] lg:max-h-[calc(100svh-5rem)] flex items-center justify-center max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pt-4 sm:pt-6 lg:pt-8 pb-8 select-none overflow-hidden ${className}`}
      aria-label="Hero Section"
    >
      {/* 
        Refined Background Gradient Circle:
        - Initially positioned behind Hero content, top aligned to portrait and text area
        - Kept within 1440px content container (w-[1240px])
        - Perfectly round (aspect-ratio: 1)
        - Bottom fades naturally into #F7F5F0 with no abrupt clipping
        - On scroll, animates upward until completely exiting the viewport
      */}
      <div
        ref={circleWrapperRef}
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none will-change-[transform,opacity] z-0"
        style={{
          top: 'clamp(140px, 18vh, 220px)',
        }}
      >
        <div
          ref={circleInnerRef}
          className="w-[1240px] h-[1240px] max-w-[calc(100vw-2rem)] max-h-[calc(100vw-2rem)] aspect-square rounded-full will-change-[transform,opacity]"
          style={{
            background:
              'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.95) 15%, rgba(250, 248, 244, 0.70) 35%, rgba(247, 245, 240, 0.40) 60%, rgba(247, 245, 240, 0.12) 80%, rgba(247, 245, 240, 0) 100%)',
          }}
        />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-18 items-center w-full will-change-[transform,opacity]"
      >

        {/* ============================================================ */}
        {/* LEFT COLUMN: Existing 3D Hero Slider Component                */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start w-full">
          <HeroSlider slides={slides} isLoaded={isLoaded} className="w-full max-w-[440px] xl:max-w-[480px]" />
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Editorial Introduction & Pulsing Badges         */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8 sm:space-y-10 w-full">

          {/* Main Introduction Paragraph: Geist 24px, Regular 400, uniform line spacing */}
          <p
            ref={paragraphRef}
            className="text-[20px] sm:text-[22px] lg:text-[24px] font-normal leading-[1.7] sm:leading-[1.75] lg:leading-[1.8] text-primary tracking-tight font-sans"
            aria-label="Hi, I'm Sourav — a UI/UX Designer who enjoys turning complex ideas into simple, meaningful digital experiences. I work across UI design, web design, and front-end implementation."
          >
            <TypewriterWord word="Hi," />{' '}
            <TypewriterWord word="I'm" />{' '}
            <TypewriterWord word="Sourav" />{' '}
            <TypewriterWord word="—" />{' '}
            <TypewriterWord word="a" />{' '}
            <span className="inline-block whitespace-nowrap">
              <span className="tw-token tw-badge inline-flex align-baseline opacity-0 will-change-[opacity]">
                <ExpertiseBadge
                  icon="🧠"
                  label="UI/UX Designer"
                  iconPosition="left"
                  textSize="hero"
                  animationDelay={0}
                  emojiVariant="pulse"
                />
              </span>
            </span>{' '}
            <TypewriterWord word="who" />{' '}
            <TypewriterWord word="enjoys" />{' '}
            <TypewriterWord word="turning" />{' '}
            <TypewriterWord word="complex" />{' '}
            <TypewriterWord word="ideas" />{' '}
            <TypewriterWord word="into" />{' '}
            <TypewriterWord word="simple," />{' '}
            <TypewriterWord word="meaningful" />{' '}
            <TypewriterWord word="digital" />{' '}
            <TypewriterWord word="experiences." />{' '}
            <TypewriterWord word="I" />{' '}
            <TypewriterWord word="work" />{' '}
            <TypewriterWord word="across" />{' '}
            <span className="inline-block whitespace-nowrap">
              <span className="tw-token tw-badge inline-flex align-baseline opacity-0 will-change-[opacity]">
                <ExpertiseBadge
                  icon="💻"
                  label="UI design"
                  iconPosition="right"
                  textSize="hero"
                  animationDelay={0.75}
                  emojiVariant="wobble"
                />
              </span>
              <span className="tw-token opacity-0 will-change-[opacity]" data-char=",">,</span>
            </span>{' '}
            <span className="inline-block whitespace-nowrap">
              <span className="tw-token tw-badge inline-flex align-baseline opacity-0 will-change-[opacity]">
                <ExpertiseBadge
                  icon="🎨"
                  label="web design"
                  iconPosition="right"
                  textSize="hero"
                  animationDelay={1.5}
                  emojiVariant="ambient"
                />
              </span>
              <span className="tw-token opacity-0 will-change-[opacity]" data-char=",">,</span>
            </span>{' '}
            <TypewriterWord word="and" />{' '}
            <span className="inline-block whitespace-nowrap">
              <span className="tw-token tw-badge inline-flex align-baseline opacity-0 will-change-[opacity]">
                <ExpertiseBadge
                  icon="🛠️"
                  label="front-end implementation"
                  iconPosition="right"
                  textSize="hero"
                  animationDelay={2.25}
                  emojiVariant="float"
                />
              </span>
              <span className="tw-token opacity-0 will-change-[opacity]" data-char=".">.</span>
            </span>
          </p>

          {/* Experience Metrics Summary */}
          <div
            ref={metricsRef}
            className="pt-2 sm:pt-4 space-y-3 font-sans hero-metrics opacity-0 will-change-[opacity,transform]"
          >
            <div className="metric-hover-row w-fit flex items-center gap-2.5 text-[14px] sm:text-[15px] font-normal cursor-pointer select-none">
              <span className="text-[20px] font-semibold text-accent tracking-tight leading-none">
                2+ Years
              </span>
              <span className="text-secondary leading-none">—</span>
              <span className="text-secondary leading-none">
                UI/UX Experience
              </span>
            </div>

            <div className="metric-hover-row w-fit flex items-center gap-2.5 text-[14px] sm:text-[15px] font-normal cursor-pointer select-none">
              <span className="text-[20px] font-semibold text-accent tracking-tight leading-none">
                6+ Years
              </span>
              <span className="text-secondary leading-none">—</span>
              <span className="text-secondary leading-none">
                Graphics, Web Design & Development
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
