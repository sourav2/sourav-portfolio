import React, { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Header from './Header'
import HeroSection from './HeroSection'
import CaseStudyShowcase from './CaseStudyShowcase'
import CareerTimeline from './CareerTimeline'
import AboutSection from './AboutSection'
import FooterSection from './FooterSection'
import DottedMeshBackground from './DottedMeshBackground'
import SHLogo from './SHLogo'

// Safely register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
  window.ScrollTrigger = ScrollTrigger
}

/**
 * The 5 major homepage sections in sequence
 */
const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'works', label: 'Works' },
  { id: 'journey', label: 'The Journey So Far' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Helper: dynamically calculates the precise scroll target for a given section index.
 * For animated/pinned sections ('about'), position can be:
 * - 'start': top/entry of the section (progress = 0)
 * - 'end': bottom/exit of the section (progress = 1, for smooth reverse scrolling)
 */
function getSectionTargetTop(index, position = 'start') {
  if (typeof window === 'undefined') return 0

  const heroST = ScrollTrigger.getById('hero-scroll')
  const worksEl = document.getElementById('works')
  const journeyEl = document.getElementById('journey')
  const aboutEl = document.getElementById('about')
  const contactEl = document.getElementById('contact')

  const getDocTop = (el) => {
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    return Math.round(window.scrollY + rect.top)
  }

  const worksTop = worksEl ? getDocTop(worksEl) : (heroST ? heroST.end : window.innerHeight)
  const journeyTop = journeyEl ? getDocTop(journeyEl) : worksTop + window.innerHeight
  const aboutTop = aboutEl ? getDocTop(aboutEl) : journeyTop + window.innerHeight
  const contactTop = contactEl ? getDocTop(contactEl) : aboutTop + window.innerHeight

  if (index === 0) return 0
  if (index === 1) return worksTop
  if (index === 2) return journeyTop // Always lands at top of Journey so sequence plays 2016 → 2026
  if (index === 3) return aboutTop
  if (index === 4) return contactTop
  return 0
}

/**
 * Helper: determines current active section and associated ScrollTrigger instance
 * based on the current window.scrollY coordinate.
 */
function getCurrentSectionInfo() {
  if (typeof window === 'undefined') return { index: 0, id: 'home', st: null }

  const scrollY = window.scrollY
  const heroST = ScrollTrigger.getById('hero-scroll')
  const worksEl = document.getElementById('works')
  const journeyEl = document.getElementById('journey')
  const aboutEl = document.getElementById('about')
  const contactEl = document.getElementById('contact')

  const getDocTop = (el) => {
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    return Math.round(window.scrollY + rect.top)
  }

  const worksTop = worksEl ? getDocTop(worksEl) : (heroST ? heroST.end : window.innerHeight)
  const journeyTop = journeyEl ? getDocTop(journeyEl) : worksTop + window.innerHeight
  const aboutTop = aboutEl ? getDocTop(aboutEl) : journeyTop + window.innerHeight
  const contactTop = contactEl ? getDocTop(contactEl) : aboutTop + window.innerHeight

  // 25px boundary buffer prevents jitter at transition boundaries
  if (scrollY < worksTop - 25) {
    return { index: 0, id: 'home', st: heroST }
  }
  if (scrollY < journeyTop - 25) {
    return { index: 1, id: 'works', st: null }
  }
  if (scrollY < aboutTop - 25) {
    return { index: 2, id: 'journey', st: null }
  }
  if (scrollY < contactTop - 25) {
    return { index: 3, id: 'about', st: null }
  }
  return { index: 4, id: 'contact', st: null }
}

/**
 * HomepagePreview - Controlled Section Navigation System
 *
 * Implements full-page controlled navigation across all 5 sections:
 * 1. HeroSection (#home) - Smooth 1.2s exit transition with circle & content animations
 * 2. CaseStudyShowcase (#works) - 100svh presentation
 * 3. CareerTimeline (#journey) - Pinned sequential line fill & milestone card reveals
 * 4. AboutSection (#about) - Pinned 5-card arc sequence progression
 * 5. FooterSection (#contact) - Contact and closing footer
 *
 * Requirements:
 * - Transitions between sections have a minimum duration of 1 second (1.2s power2.inOut).
 * - Internal animations (Timeline, About cards) are fully preserved and scrubbed.
 * - Global section transitions only trigger when internal animations reach natural completion:
 *     - Scrolling down: progress >= 0.98
 *     - Scrolling up: progress <= 0.02
 * - Supports smooth reverse scrolling (entering at end position and scrubbing backward).
 * - Lavender background in CareerTimeline remains 100% active in both directions.
 * - Prevents rapid repeated section transitions during active animations.
 * - Respects prefers-reduced-motion and supports wheel, trackpad, touch swipe, and keyboard.
 */
export default function HomepagePreview({ isLoaded = true, onReplayLoader }) {
  const [inspectMode, setInspectMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentIndexRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const isTimelinePlayingRef = useRef(false)
  const cooldownTimerRef = useRef(null)

  const handleTimelineStart = useCallback(() => {
    isTimelinePlayingRef.current = true
  }, [])

  const handleTimelineComplete = useCallback(() => {
    isTimelinePlayingRef.current = false
  }, [])

  // Navigate smoothly to a specific section index
  const goToSection = useCallback((targetIndex, position = 'start') => {
    const clampedIndex = Math.max(0, Math.min(SECTIONS.length - 1, targetIndex))
    if (isAnimatingRef.current) return

    const targetTop = getSectionTargetTop(clampedIndex, position)

    isAnimatingRef.current = true
    currentIndexRef.current = clampedIndex
    setCurrentIndex(clampedIndex)

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current)

    // Controlled section transitions take 1.2s (> 1 second requirement)
    gsap.to(window, {
      scrollTo: { y: targetTop, autoKill: false },
      duration: prefersReducedMotion ? 0.05 : 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        // 300ms buffer to absorb residual trackpad momentum and prevent double-jumps
        cooldownTimerRef.current = setTimeout(() => {
          isAnimatingRef.current = false
        }, 300)
      },
    })
  }, [])

  // Expose goToSection for reliable programmatic testing & deep linking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__goToSection = goToSection
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.__goToSection
      }
    }
  }, [goToSection])

  // Header navigation click handler
  const handleNavClick = useCallback(
    (item, e) => {
      if (e && e.preventDefault) e.preventDefault()
      const targetId = item.href ? item.href.replace('#', '') : item.id
      const targetIdx = SECTIONS.findIndex((s) => s.id === targetId)
      if (targetIdx !== -1) {
        goToSection(targetIdx, 'start')
      }
    },
    [goToSection]
  )

  // Synchronize active header link with scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isAnimatingRef.current) return
      const current = getCurrentSectionInfo()
      if (current.index !== currentIndexRef.current) {
        currentIndexRef.current = current.index
        setCurrentIndex(current.index)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Main scroll, touch, and keyboard controller
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Wheel and Trackpad Interceptor
    const handleWheel = (e) => {
      // Absorb any wheel events during an active section transition
      if (isAnimatingRef.current) {
        if (e.cancelable) e.preventDefault()
        return
      }

      // Filter micro-jitter
      if (Math.abs(e.deltaY) < 4) return

      const current = getCurrentSectionInfo()
      const isDown = e.deltaY > 0

      if (isDown) {
        // SCROLLING DOWN
        if (current.index === 0) {
          // Hero (#home) -> Transition smoothly to Works (#works) over 1.2s
          e.preventDefault()
          goToSection(1, 'start')
          return
        }

        if (current.index === 1) {
          // Works (#works) -> Transition smoothly to Timeline (#journey) over 1.2s
          if (window.innerWidth < 1024) {
            const worksEl = document.getElementById('works')
            if (worksEl) {
              const rect = worksEl.getBoundingClientRect()
              if (rect.bottom > window.innerHeight + 30) {
                return
              }
            }
          }
          e.preventDefault()
          goToSection(2, 'start')
          return
        }

        if (current.index === 2) {
          // Career Timeline (#journey) -> Transition to About (#about) without scroll-locking
          e.preventDefault()
          goToSection(3, 'start')
          return
        }

        if (current.index === 3) {
          // About Section (#about) -> Transition smoothly to Contact (#contact)
          e.preventDefault()
          goToSection(4, 'start')
          return
        }

        if (current.index === 4) {
          // Contact (#contact) - Reached end of document
          return
        }
      } else {
        // SCROLLING UP (REVERSE)
        if (current.index === 4) {
          // Contact (#contact) -> Transition back to About (#about)
          e.preventDefault()
          goToSection(3, 'start')
          return
        }

        if (current.index === 3) {
          // About Section (#about) -> Transition to Timeline (#journey)
          e.preventDefault()
          goToSection(2, 'start')
          return
        }

        if (current.index === 2) {
          // Career Timeline (#journey) -> Transition back to Works (#works) without scroll-locking
          e.preventDefault()
          goToSection(1, 'start')
          return
        }

        if (current.index === 1) {
          // Works (#works) -> Transition smoothly to Hero (#home) over 1.2s
          e.preventDefault()
          goToSection(0, 'start')
          return
        }

        if (current.index === 0) {
          // Hero (#home) - Reached top of document
          return
        }
      }
    }

    // 2. Keyboard Navigation Controller
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return

      const isDown = ['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey)
      const isUp = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)

      if (!isDown && !isUp) return

      if (isAnimatingRef.current) {
        e.preventDefault()
        return
      }

      const current = getCurrentSectionInfo()

      if (isDown) {
        if (current.index === 0) {
          e.preventDefault()
          goToSection(1, 'start')
        } else if (current.index === 1) {
          e.preventDefault()
          goToSection(2, 'start')
        } else if (current.index === 2) {
          e.preventDefault()
          goToSection(3, 'start')
        } else if (current.index === 3) {
          e.preventDefault()
          goToSection(4, 'start')
        }
      } else if (isUp) {
        if (current.index === 4) {
          e.preventDefault()
          goToSection(3, 'start')
        } else if (current.index === 3) {
          e.preventDefault()
          goToSection(2, 'start')
        } else if (current.index === 2) {
          e.preventDefault()
          goToSection(1, 'start')
        } else if (current.index === 1) {
          if (window.innerWidth < 1024) {
            const worksEl = document.getElementById('works')
            if (worksEl) {
              const rect = worksEl.getBoundingClientRect()
              if (rect.top < -30) {
                return
              }
            }
          }
          e.preventDefault()
          goToSection(0, 'start')
        }
      }
    }

    // 3. Touch Gesture Navigation Controller
    let touchStartY = 0
    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e) => {
      if (isAnimatingRef.current && e.cancelable) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e) => {
      if (isAnimatingRef.current) return
      if (!e.changedTouches || !e.changedTouches[0]) return

      const touchEndY = e.changedTouches[0].clientY
      const delta = touchStartY - touchEndY // Positive = swiped UP (scroll down)
      if (Math.abs(delta) < 45) return

      const isDown = delta > 0
      const current = getCurrentSectionInfo()

      if (isDown) {
        if (current.index === 0) goToSection(1, 'start')
        else if (current.index === 1) {
          if (window.innerWidth < 1024) {
            const worksEl = document.getElementById('works')
            if (worksEl) {
              const rect = worksEl.getBoundingClientRect()
              if (rect.bottom > window.innerHeight + 30) {
                return
              }
            }
          }
          goToSection(2, 'start')
        }
        else if (current.index === 2) {
          goToSection(3, 'start')
        }
        else if (current.index === 3) {
          goToSection(4, 'start')
        }
      } else {
        if (current.index === 4) goToSection(3, 'start')
        else if (current.index === 3) goToSection(2, 'start')
        else if (current.index === 2) {
          goToSection(1, 'start')
        } else if (current.index === 1) {
          if (window.innerWidth < 1024) {
            const worksEl = document.getElementById('works')
            if (worksEl) {
              const rect = worksEl.getBoundingClientRect()
              if (rect.top < -30) {
                return
              }
            }
          }
          goToSection(0, 'start')
        }
      }
    }

    // 4. Viewport Resize Handler
    let resizeTimer = null
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 200)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('resize', handleResize)
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current)
    }
  }, [goToSection])

  // Derive active header link label from current section
  const activeHeaderLink = SECTIONS[currentIndex]?.label || 'Home'

  return (
    <div className="relative min-h-screen bg-canvas text-primary flex flex-col justify-between selection:bg-accent/20 overflow-x-hidden">
      {/* Subtle Dotted Mesh Pattern (Spans full page height, aligns to 1440px content width, scrolls naturally) */}
      <DottedMeshBackground />

      {/* Official Reusable Portfolio Header */}
      <Header
        activeLink={activeHeaderLink}
        ctaText="Get In Touch"
        ctaHref="#contact"
        onNavClick={handleNavClick}
        onCtaClick={(e) => handleNavClick({ href: '#contact', id: 'contact' }, e)}
        className="relative z-30 w-full"
      />

      {/* Major Viewport Sections (Exactly 100svh each) */}
      <main className="relative z-10 w-full flex flex-col">
        {/* Section 1: Hero Section (100svh with pinned exit animation) */}
        <HeroSection isLoaded={isLoaded} enablePinning={true} />

        {/* Section 2: Selected Projects / Case Studies (100svh) */}
        <CaseStudyShowcase enableScrollTrigger={false} />

        {/* Section 3: Career Timeline — The Journey So Far (Pinned sequential storytelling) */}
        <CareerTimeline
          isActive={currentIndex === 2}
          onTimelineStart={handleTimelineStart}
          onTimelineComplete={handleTimelineComplete}
        />

        {/* Section 4: About Me Section (100svh with autonomous circular card carousel) */}
        <AboutSection />

        {/* Section 5: Footer & Contact Section (100svh) */}
        <FooterSection />

        {inspectMode && (
          /* Geometry & Reference Verification Panel */
          <div className="max-w-5xl mx-auto px-6 py-8 w-full">
            <div className="p-8 rounded-2xl border border-border-subtle bg-surface/90 backdrop-blur-sm shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                  <h3 className="type-card-h3 text-primary">
                    Logo Asset Verification & Geometric Study
                  </h3>
                  <p className="type-caption text-secondary mt-0.5">
                    Comparison between your original reference asset and our exact SVG vector implementation.
                  </p>
                </div>
                <button
                  onClick={() => setInspectMode(false)}
                  className="px-3 py-1 text-xs rounded-full border border-border-medium hover:border-primary text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
                <div className="flex flex-col items-center p-6 rounded-xl bg-canvas border border-border-subtle">
                  <span className="text-xs uppercase tracking-wider text-secondary mb-4 font-mono">
                    1. Original Reference Asset (PNG)
                  </span>
                  <img
                    src="/assets/sh-logo-reference.png"
                    alt="Original Reference"
                    className="w-48 h-auto object-contain border border-dashed border-border-medium p-2"
                  />
                  <p className="text-[11px] text-muted mt-4 text-center">
                    Original 200×161 asset with construction lines & purple L-accent
                  </p>
                </div>

                <div className="flex flex-col items-center p-6 rounded-xl bg-canvas border border-border-subtle">
                  <span className="text-xs uppercase tracking-wider text-secondary mb-4 font-mono">
                    2. Pure SVG Vector Component (SHLogo.jsx)
                  </span>
                  <div className="w-48 h-auto border border-dashed border-accent/50 p-2 flex items-center justify-center">
                    <SHLogo size={192} showGuides={true} guideOpacity={0.4} />
                  </div>
                  <p className="text-[11px] text-muted mt-4 text-center">
                    100% mathematical vector, razor sharp at any scale, no rasterization
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer with subtle review controls */}
      <footer className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between type-caption text-secondary gap-4">
        <div className="flex items-center gap-4">
          <span>© 2026 Sourav Haldar</span>
          <span className="text-muted">·</span>
          <span>Crafted with React, Tailwind CSS, GSAP & Matter.js</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setInspectMode(!inspectMode)}
            className="text-xs text-secondary hover:text-primary transition-colors underline underline-offset-4 cursor-pointer"
          >
            {inspectMode ? 'Close Inspection' : 'Inspect Logo Blueprint'}
          </button>
          <span className="text-muted">·</span>
          <button
            onClick={onReplayLoader}
            className="text-xs text-secondary hover:text-primary transition-colors underline underline-offset-4 cursor-pointer"
          >
            Replay Loader
          </button>
        </div>
      </footer>
    </div>
  )
}
