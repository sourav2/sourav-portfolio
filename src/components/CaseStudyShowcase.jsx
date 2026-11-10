import React, { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import AnimatedBorderBadge from './AnimatedBorderBadge'
import AnimatedCTA from './AnimatedCTA'
import AnimatedEmoji from './AnimatedEmoji'

// Register GSAP plugins safely in browser environments
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
  window.ScrollTrigger = ScrollTrigger
}

/**
 * Default Project Data matching reference mockups and specifications
 */
export const DEFAULT_PROJECTS = [
  {
    id: 'elvan',
    title: 'Curating Property Discovery for Exceptional Living',
    tags: ['UI/UX Design', 'Editorial UI Design', 'Premium Real Estate'],
    description:
      'Curated an editorial luxury residential discovery platform emphasizing generous negative space, bespoke typography, and high-conversion inquiry workflows.',
    image: '/assets/projects/Elvan.jpg',
    caseStudyUrl: '#case-study-elvan',
    category: 'Real Estate / Editorial UI',
  },
  {
    id: 'roamio',
    title: 'AI-Powered Travel Discovery & Itinerary Planning',
    tags: ['UI/UX Design', 'AI Product Design', 'Travel Tech'],
    description:
      'Translated AI-generated recommendations into clear destination cards, interactive maps, day-wise itineraries, and editable trip plans—keeping the traveler in control.',
    image: '/assets/projects/Roamio.jpg',
    caseStudyUrl: '#case-study-roamio',
    category: 'Travel Tech / AI UX',
  },
  {
    id: 'ghreall',
    title:
      'High-Density Interface Grid & Modular Component Architecture for Complex Data Search',
    tags: ['UI/UX Design', 'Data-Dense UI', 'Real Estate UX'],
    description:
      'Designed a highly structured, card-based UI grid that elegantly organises dense property listing datasets without creating visual noise or layout fatigue.',
    image: '/assets/projects/PH-Realtors.jpg',
    caseStudyUrl: '#case-study-ghreall',
    category: 'Enterprise / Data-Dense UI',
  },
  {
    id: 'aptech',
    title: "Redesigning Aptech's Course Discovery Website",
    tags: ['High-Fidelity Web UI', 'UI/UX Design'],
    description:
      'Reconstructed the web interface layout around a strong visual grid, prominent CTA placements, and a clear typographic hierarchy to drive user action.',
    image: '/assets/projects/Aptech.jpg',
    caseStudyUrl: '#case-study-aptech',
    category: 'EdTech / Web Platform',
  },
]

/**
 * CaseStudyMedia Component
 *
 * Renders the visual media for a case study item in the mockup frame.
 * If project.video is explicitly provided, renders an HTML5 video.
 * Otherwise, renders an optimized static <img> preview with object-fit: cover.
 */
function CaseStudyMedia({ project, isActive, index }) {
  const isVideoProject = Boolean(project.video)
  const videoRef = useRef(null)
  const [videoError, setVideoError] = useState(false)

  // Pause when the case study becomes inactive, resume/play when active
  useEffect(() => {
    if (!isVideoProject || !videoRef.current || videoError) return

    if (isActive) {
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Catch and ignore abort errors from rapid slide transitions
          if (err.name !== 'AbortError') {
            console.warn('Video playback notice:', err)
          }
        })
      }
    } else {
      videoRef.current.pause()
    }
  }, [isActive, isVideoProject, videoError])

  if (isVideoProject && !videoError) {
    return (
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={project.video}
          poster={project.image}
          muted
          loop
          playsInline
          autoPlay={isActive}
          preload="auto"
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover object-center select-none"
          aria-label={`${project.title} video preview`}
        />
        {/* Subtle vignette gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <img
        src={project.image}
        alt={`${project.title} mockup preview`}
        className="w-full h-full object-cover object-center select-none"
        loading={index === 0 ? 'eager' : 'lazy'}
      />
      {/* Subtle vignette gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
    </div>
  )
}

/**
 * CaseStudyShowcase
 *
 * An interactive, editorial case study showcase component inspired by modern
 * agency portfolios.
 *
 * Refined Specifications:
 * - Left: Large, stable case study image occupying the full section height,
 *   aligned at the top with the right column and spanning the entire height
 *   of the case study section (including inactive titles below).
 *   Maintains width, border radius (14px), and object-fit: cover without shrinking.
 * - Right: Inactive titles separated by subtle horizontal dividers.
 * - Active Content: An editorial highlight with ONLY a distinct 2px vertical
 *   left border (`border-l-2 border-[#171717]`), with 16px left padding (`pl-[16px]`)
 *   and 16px vertical padding (`py-[16px]`). Explicitly no top, right, or bottom borders.
 * - Bidirectional GSAP ScrollTrigger pinning across all case studies.
 */
export default function CaseStudyShowcase({
  projects = DEFAULT_PROJECTS,
  className = '',
  initialIndex = 0,
  enableScrollTrigger = true,
  onProjectChange,
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const activeIndexRef = useRef(initialIndex)
  const sectionRef = useRef(null)
  const isProgrammaticScroll = useRef(false)
  const scrollTriggerInstance = useRef(null)
  const scrollTimeoutRef = useRef(null)
  const mobileItemRefs = useRef([])

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  // Keep callback in ref so it NEVER causes ScrollTrigger to re-create on render
  const onProjectChangeRef = useRef(onProjectChange)
  useEffect(() => {
    onProjectChangeRef.current = onProjectChange
  }, [onProjectChange])

  // Check user preference for reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)

      const handleChange = (e) => setPrefersReducedMotion(e.matches)
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Helper to calculate target index from raw progress [0, 1]
  const getIndexFromProgress = useCallback((progress, total) => {
    const clamped = Math.max(0, Math.min(0.999999, progress))
    return Math.min(total - 1, Math.floor(clamped * total))
  }, [])

  // Setup GSAP ScrollTrigger for pinned scrolling on desktop viewports
  useEffect(() => {
    if (!enableScrollTrigger || prefersReducedMotion || !sectionRef.current) {
      return
    }

    const total = projects.length
    if (total === 0) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        const scrollDistance = total * window.innerHeight * 0.7

        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
          onUpdate: (self) => {
            if (isProgrammaticScroll.current) return

            const targetIndex = getIndexFromProgress(self.progress, total)
            if (activeIndexRef.current !== targetIndex) {
              activeIndexRef.current = targetIndex
              setActiveIndex(targetIndex)
              if (onProjectChangeRef.current) {
                onProjectChangeRef.current(targetIndex, projects[targetIndex])
              }
            }
          },
        })

        scrollTriggerInstance.current = st
      })
    }, sectionRef)

    return () => {
      ctx.revert()
      scrollTriggerInstance.current = null
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [enableScrollTrigger, prefersReducedMotion, projects, getIndexFromProgress])

  // Handle clicking or keyboard selecting a project
  const handleSelectProject = (index) => {
    setActiveIndex(index)
    if (onProjectChangeRef.current) {
      onProjectChangeRef.current(index, projects[index])
    }

    const st = scrollTriggerInstance.current
    if (st && typeof window !== 'undefined' && !prefersReducedMotion) {
      isProgrammaticScroll.current = true

      const total = projects.length
      const targetProgress = (index + 0.5) / total
      const targetScroll = st.start + targetProgress * (st.end - st.start)

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      })

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScroll.current = false
      }, 700)
    }
  }

  // Handle mobile accordion selection and gentle scroll-into-view
  const handleMobileSelect = (index) => {
    handleSelectProject(index)

    // Bring the newly expanded project into comfortable visible position if clipped
    setTimeout(() => {
      const el = mobileItemRefs.current[index]
      if (el && typeof window !== 'undefined') {
        const rect = el.getBoundingClientRect()
        // If top is clipped under header or bottom extends far below viewport
        if (rect.top < 70 || rect.bottom > window.innerHeight) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      }
    }, 150)
  }

  const activeProject = projects[activeIndex] || projects[0]

  return (
    <section
      id="works"
      ref={sectionRef}
      className={`relative w-full lg:h-screen lg:h-[100svh] lg:min-h-[100vh] lg:max-h-[100svh] flex flex-col items-center justify-center bg-transparent text-primary selection:bg-accent/30 lg:overflow-hidden ${className}`}
      aria-label="Featured Case Studies Showcase"
    >
      {/* ============================================================ */}
      {/* DESKTOP VIEW (>= lg): Centered Two-Column Composition        */}
      {/* - Vertically centered in the viewport                        */}
      {/* - Balanced top/bottom spacing                                */}
      {/* - Mockup visual on left, interactive tabs on right           */}
      {/* ============================================================ */}
      <div className="hidden lg:flex w-full h-full max-h-[100svh] flex-col justify-center py-6 lg:py-8 px-6 sm:px-8 md:px-12 lg:px-16 max-w-[1440px] mx-auto select-none">

        {/* Section Header */}
        <div className="space-y-3 mb-6 lg:mb-8">
          <div>
            <span className="font-sans text-[18px] sm:text-[20px] lg:text-[22px] font-medium text-accent tracking-tight uppercase">
              Work and Personal Explorations
            </span>
          </div>

          <h2 className="font-display type-section-heading text-[32px] sm:text-[44px] md:text-[52px] lg:text-[56px] xl:text-[60px] font-normal leading-[1.1] text-primary tracking-tight inline-flex items-center gap-3 sm:gap-4 flex-wrap">
            <span>From Ideas to Interfaces</span>
            <AnimatedEmoji
              variant="bulb"
              ariaLabel="Light bulb"
              className="text-[0.82em]"
            >
              💡
            </AnimatedEmoji>
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">

          {/* LEFT COLUMN: Large, Stable Mockup Frame */}
          <div className="col-span-6 w-full flex items-center justify-center">
            <div className="relative w-full h-[470px] xl:h-[500px] rounded-mockup overflow-hidden bg-surface-muted border border-border-subtle shadow-card-light group">
              {projects.map((project, index) => {
                const isActive = index === activeIndex
                return (
                  <div
                    key={project.id}
                    className={`absolute inset-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive
                        ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                        : 'opacity-0 scale-[1.03] z-0 pointer-events-none'
                      }`}
                  >
                    <CaseStudyMedia
                      project={project}
                      isActive={isActive}
                      index={index}
                    />
                  </div>
                )
              })}

              {/* Direct Clickable Target on the Active Visual */}
              <a
                href={activeProject.caseStudyUrl}
                className="absolute inset-0 z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-mockup"
                aria-label={`Open case study: ${activeProject.title}`}
              >
                <span className="sr-only">Open {activeProject.title}</span>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Progressive Content Reveal & Editorial List */}
          <div className="col-span-6 w-full flex flex-col justify-center">
            <div
              role="tablist"
              aria-orientation="vertical"
              aria-label="Case Studies List"
              className="flex flex-col w-full"
            >
              {projects.map((project, index) => {
                const isActive = index === activeIndex
                const panelId = `case-study-panel-${project.id}`
                const buttonId = `case-study-tab-${project.id}`

                return (
                  <div key={project.id} className="w-full">
                    {index > 0 && (
                      <div className="w-full border-t border-border-subtle" />
                    )}

                    {isActive ? (
                      /* ACTIVE CONTENT BLOCK:
                         - ONLY a 2px vertical left border (`border-l-2 border-primary`)
                         - Exactly 16px left padding (`pl-[16px]`)
                         - Approximately 16px vertical padding (`py-[16px]`)
                         - Explicitly NO top, right, or bottom borders
                      */
                      <div
                        id={panelId}
                        role="tabpanel"
                        aria-labelledby={buttonId}
                        className="w-full border-l-2 border-primary border-t-0 border-r-0 border-b-0 pl-[16px] py-[16px] my-1 transition-opacity duration-300"
                      >
                        {/* 1. Animated Badges Row */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {project.tags.map((tag) => (
                            <AnimatedBorderBadge key={tag}>
                              {tag}
                            </AnimatedBorderBadge>
                          ))}
                        </div>

                        {/* 2. Active Title */}
                        <button
                          type="button"
                          role="tab"
                          id={buttonId}
                          aria-selected={true}
                          aria-controls={panelId}
                          tabIndex={0}
                          onClick={() => handleSelectProject(index)}
                          className="w-full text-left font-sans text-primary font-semibold text-[22px] sm:text-[24px] lg:text-[26px] leading-[1.28] tracking-[-0.015em] mb-3 cursor-default block focus:outline-none focus-visible:text-accent"
                        >
                          {project.title}
                        </button>

                        {/* 3. Description */}
                        <p className="font-sans text-[14px] sm:text-[15px] font-normal leading-[1.6] text-secondary max-w-xl mb-5">
                          {project.description}
                        </p>

                        {/* 4. View Casestudy CTA Button */}
                        <div className="pt-0.5 pb-1">
                          <AnimatedCTA
                            text="View Casestudy"
                            href={project.caseStudyUrl}
                            ariaLabel={`View case study: ${project.title}`}
                          />
                        </div>
                      </div>
                    ) : (
                      /* INACTIVE CASE STUDY HEADER */
                      <div className="w-full py-2.5 sm:py-3 lg:py-3 xl:py-3.5 pl-0 transition-colors duration-300">
                        <button
                          type="button"
                          role="tab"
                          id={buttonId}
                          aria-selected={false}
                          aria-controls={panelId}
                          tabIndex={0}
                          onClick={() => handleSelectProject(index)}
                          onMouseEnter={() => handleSelectProject(index)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleSelectProject(index)
                            }
                          }}
                          className="w-full text-left font-sans text-muted hover:text-primary font-medium text-[20px] sm:text-[22px] lg:text-[23px] leading-[1.3] tracking-[-0.01em] cursor-pointer transition-colors duration-300 block focus:outline-none focus-visible:text-accent group"
                        >
                          <span className="block transition-transform duration-300 group-hover:translate-x-1 sm:group-hover:translate-x-1.5 lg:group-hover:translate-x-0">
                            {project.title}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Bottom Closing Divider */}
              <div className="w-full border-t border-border-subtle" />
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE & TABLET VIEW (< lg): Editorial Vertical Accordion    */}
      {/* Built directly according to the user's sketch:               */}
      {/* - Collapsed projects: row with title & circular plus         */}
      {/* - Expanded project: large 16:10 image, active title with     */}
      {/*   circular minus indicator, description, and AnimatedCTA     */}
      {/* ============================================================ */}
      <div className="block lg:hidden w-full max-w-[680px] mx-auto px-5 sm:px-8 py-8 sm:py-12 select-none">

        {/* Section Heading */}
        <div className="space-y-2.5 mb-7 sm:mb-8">
          <div>
            <span className="font-sans text-[14px] sm:text-[16px] font-medium text-accent tracking-tight uppercase">
              Work and Personal Explorations
            </span>
          </div>

          <h2 className="font-display text-[27px] sm:text-[34px] font-normal leading-[1.16] text-primary tracking-tight inline-flex items-center gap-2.5 flex-wrap">
            <span>From Ideas to Interfaces</span>
            <AnimatedEmoji
              variant="bulb"
              ariaLabel="Light bulb"
              className="text-[0.85em]"
            >
              💡
            </AnimatedEmoji>
          </h2>
        </div>

        {/* Mobile Accordion Container */}
        <div
          role="region"
          aria-label="Case Studies Accordion"
          className="w-full border-t border-border-subtle flex flex-col"
        >
          {projects.map((project, index) => {
            const isExpanded = index === activeIndex
            const mobilePanelId = `mobile-panel-${project.id}`
            const mobileButtonId = `mobile-btn-${project.id}`

            return (
              <div
                key={project.id}
                ref={(el) => {
                  mobileItemRefs.current[index] = el
                }}
                className="w-full border-b border-border-subtle transition-colors duration-200"
              >
                {isExpanded ? (
                  /* ============================================================ */
                  /* EXPANDED PROJECT STATE (Based on the shared sketch)          */
                  /* 1. Large 16:10 Project Image                                 */
                  /* 2. Active Title with Circular Indicator                      */
                  /* 3. Tags & Description                                        */
                  /* 4. "View Casestudy" CTA Button                               */
                  /* ============================================================ */
                  <div
                    id={mobilePanelId}
                    role="region"
                    aria-labelledby={mobileButtonId}
                    className="w-full py-5 sm:py-6"
                  >
                    {/* 1. Large Project Image (16:10 aspect ratio, rounded corners, cover) */}
                    <div className="relative w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-surface-muted border border-border-subtle shadow-card-light mb-4 sm:mb-5 group">
                      <CaseStudyMedia
                        project={project}
                        isActive={true}
                        index={index}
                      />
                      <a
                        href={project.caseStudyUrl}
                        className="absolute inset-0 z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl sm:rounded-2xl"
                        aria-label={`Open case study: ${project.title}`}
                      >
                        <span className="sr-only">Open {project.title}</span>
                      </a>
                    </div>

                    {/* 2. Active Title + Circular Expand/Collapse Indicator */}
                    <button
                      type="button"
                      id={mobileButtonId}
                      aria-expanded={true}
                      aria-controls={mobilePanelId}
                      onClick={() => handleMobileSelect(index)}
                      className="w-full flex items-start justify-between gap-3 text-left mb-3 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xs"
                    >
                      <h3 className="font-sans font-semibold text-[19px] sm:text-[22px] leading-[1.3] text-primary tracking-[-0.015em]">
                        {project.title}
                      </h3>

                      {/* Circular Indicator: Expanded State */}
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-canvas flex items-center justify-center shrink-0 mt-0.5 shadow-xs transition-transform duration-200"
                        aria-hidden="true"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </div>
                    </button>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {project.tags.map((tag) => (
                          <AnimatedBorderBadge key={tag}>
                            {tag}
                          </AnimatedBorderBadge>
                        ))}
                      </div>
                    )}

                    {/* 3. Description */}
                    <p className="font-sans text-[14px] sm:text-[15px] font-normal leading-[1.6] text-secondary mb-5">
                      {project.description}
                    </p>

                    {/* 4. "View Casestudy" CTA */}
                    <div className="pt-0.5 pb-1">
                      <AnimatedCTA
                        text="View Casestudy"
                        href={project.caseStudyUrl}
                        ariaLabel={`View case study: ${project.title}`}
                      />
                    </div>
                  </div>
                ) : (
                  /* ============================================================ */
                  /* COLLAPSED PROJECT STATE (Spacious row with circular icon)   */
                  /* ============================================================ */
                  <button
                    type="button"
                    id={mobileButtonId}
                    aria-expanded={false}
                    aria-controls={mobilePanelId}
                    onClick={() => handleMobileSelect(index)}
                    className="w-full py-4 sm:py-5 flex items-center justify-between gap-4 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xs transition-colors duration-200"
                  >
                    <span className="font-sans font-medium text-[16px] sm:text-[18px] leading-[1.35] text-primary/80 group-hover:text-primary transition-colors">
                      {project.title}
                    </span>

                    {/* Circular Indicator: Collapsed State */}
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-border-medium bg-surface/50 text-secondary group-hover:text-primary group-hover:border-primary flex items-center justify-center shrink-0 transition-all duration-200"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
