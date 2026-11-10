import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import DottedMeshBackground from './DottedMeshBackground'
import AnimatedCTA from './AnimatedCTA'
import { ELVAN_CASE_STUDY } from '../data/caseStudiesData'

/**
 * Selectively highlights specified words/phrases within a heading in the portfolio's lavender accent.
 */
function renderHighlightedTitle(title, highlightWords) {
  if (!title) return ''
  if (!highlightWords || (Array.isArray(highlightWords) && highlightWords.length === 0)) {
    return title
  }
  const phrases = Array.isArray(highlightWords) ? highlightWords : [highlightWords]
  const escaped = phrases
    .filter(Boolean)
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  if (!escaped) return title

  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = title.split(regex)

  return parts.map((part, i) => {
    const isHighlight = phrases.some((p) => p.toLowerCase() === part.toLowerCase())
    return isHighlight ? (
      <span key={i} className="text-accent font-serif">
        {part}
      </span>
    ) : (
      part
    )
  })
}

/**
 * CaseStudyTemplate Component
 *
 * Master Reusable Case Study Presentation Template for Sourav Haldar's Portfolio.
 * Designed to present any project's case study with an editorial, architectural aesthetic.
 *
 * Visual & Functional Specifications:
 * - Color Palette: Strictly follows portfolio tokens:
 *   - Warm off-white canvas (#F7F5F0)
 *   - Near-black primary text (#171717)
 *   - Lavender accent (#A390FB) from homepage career timeline
 * - Sticky Top Navigation Header:
 *   - Left: "← Back to home"
 *   - Center: Project Name – Casestudy
 *   - Right: Desktop / Mobile Selector + "Explore Project" (AnimatedCTA)
 * - Dynamic Section Heading:
 *   - Uppercase section identifier (SECTION 01)
 *   - Serif heading (Fraunces / Faculty Glyphic)
 *   - Updates automatically based on visible slide section
 * - Horizontal Progress Indicator:
 *   - Adapts CareerTimeline visual language into a horizontal rail
 *   - Glowing lavender markers for active & completed states
 *   - Connects markers with smooth progress fill line
 *   - Clickable markers with smooth scrolling to sections
 * - Content Presentation:
 *   - Natural vertical scrolling of original Figma slide images
 *   - Centered with max-w-[1240px]
 *   - Uncompromised aspect ratios (no stretching or distortion)
 *
 * @param {Object} props
 * @param {Object} [props.project=ELVAN_CASE_STUDY] - Project case study data configuration
 * @param {Function} [props.onBack] - Callback when "Back to home" is clicked
 * @param {string} [props.className=''] - Additional container classes
 */
export default function CaseStudyTemplate({
  project = ELVAN_CASE_STUDY,
  onBack,
  className = '',
}) {
  const sections = project?.sections || []
  const totalSections = sections.length

  // Prototype Device Selection ('desktop' | 'mobile') - Desktop selected by default
  const [selectedDevice, setSelectedDevice] = useState('desktop')
  const [toastMessage, setToastMessage] = useState(null)
  const toastTimerRef = useRef(null)

  // Determine if device selector should be displayed (hidden for desktop-only products like Roamio)
  const showDeviceSelector =
    project?.showDeviceSelector !== false &&
    !project?.desktopOnly &&
    project?.id !== 'roamio'

  // Label for the explore button (default "Explore Project")
  const exploreLabel = project?.exploreLabel || 'Explore Project'

  // Device-specific prototype URL resolution (graceful fallback only if explicitly device-targeted)
  const currentPrototypeUrl = useMemo(() => {
    if (!showDeviceSelector || selectedDevice === 'desktop') {
      return (
        project?.desktopPrototypeUrl ||
        project?.prototypes?.desktop ||
        project?.figmaUrl ||
        null
      )
    } else {
      return (
        project?.mobilePrototypeUrl ||
        project?.prototypes?.mobile ||
        (project?.prototypeDevice === 'mobile' ? project?.figmaUrl : null) ||
        null
      )
    }
  }, [project, selectedDevice, showDeviceSelector])

  // Handle explore click when link is unconfigured
  const handleExploreClick = useCallback(() => {
    if (currentPrototypeUrl) {
      // Native <a> navigation with target="_blank" handles opening the URL in a new tab
      return
    }

    // Graceful feedback when device prototype is not yet configured
    const deviceName = selectedDevice === 'desktop' ? 'Desktop' : 'Mobile'
    const msg = `${project?.projectName || 'Project'} ${deviceName} prototype link coming soon`
    setToastMessage(msg)

    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null)
    }, 2800)
  }, [currentPrototypeUrl, project?.projectName, selectedDevice])

  // Clear toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const isManualScrollRef = useRef(false)
  const manualScrollTimerRef = useRef(null)

  const sectionRefs = useRef([])
  const markerRefs = useRef([])
  const progressContainerRef = useRef(null)

  // Track system preference for reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mq.matches)
      const handler = (e) => setPrefersReducedMotion(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [])

  // Sync ref with active index
  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  // Reset scroll to top whenever the case study project changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
      setActiveIndex(0)
    }
  }, [project?.id])

  // Scroll active marker into view smoothly on smaller mobile & tablet screens
  useEffect(() => {
    const activeMarker = markerRefs.current[activeIndex]
    const container = progressContainerRef.current
    if (activeMarker && container && typeof window !== 'undefined' && window.innerWidth < 1024) {
      const markerLeft = activeMarker.offsetLeft
      const markerWidth = activeMarker.offsetWidth
      const containerWidth = container.offsetWidth
      container.scrollTo({
        left: markerLeft - containerWidth / 2 + markerWidth / 2,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    }
  }, [activeIndex, prefersReducedMotion])

  // Setup IntersectionObserver / Scroll tracking for rock-solid section detection
  useEffect(() => {
    if (typeof window === 'undefined' || totalSections === 0) return

    // Calculate section in view based on scroll position and focal viewing zone
    const handleScroll = () => {
      if (isManualScrollRef.current) return

      // Focal zone sits right below the sticky progress header
      const navEl = document.querySelector('nav[aria-label="Case Study Section Progress"]')
      const stickyBottom = navEl
        ? navEl.getBoundingClientRect().bottom
        : window.innerWidth < 1024 ? 210 : 150
      const focalY = stickyBottom + 60

      let bestIndex = 0
      let minDistance = Infinity

      sectionRefs.current.forEach((el, idx) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        // If section encompasses the focal zone right below header
        if (rect.top <= focalY && rect.bottom >= focalY) {
          bestIndex = idx
          minDistance = 0
        } else if (minDistance > 0) {
          const distance = Math.abs(rect.top - focalY)
          if (distance < minDistance) {
            minDistance = distance
            bestIndex = idx
          }
        }
      })

      if (bestIndex !== activeIndexRef.current) {
        setActiveIndex(bestIndex)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (manualScrollTimerRef.current) {
        clearTimeout(manualScrollTimerRef.current)
      }
    }
  }, [totalSections])

  // Handle marker click: smoothly scroll to selected section
  const handleMarkerClick = useCallback(
    (index) => {
      const targetEl = sectionRefs.current[index]
      if (!targetEl || typeof window === 'undefined') return

      setActiveIndex(index)
      isManualScrollRef.current = true

      // Temporarily lock scroll listener to prevent flutter during smooth scroll
      if (manualScrollTimerRef.current) {
        clearTimeout(manualScrollTimerRef.current)
      }
      manualScrollTimerRef.current = setTimeout(() => {
        isManualScrollRef.current = false
      }, prefersReducedMotion ? 50 : 850)

      // Calculate dynamic sticky header offset
      const navEl = document.querySelector('nav[aria-label="Case Study Section Progress"]')
      const headerOffset = navEl
        ? navEl.getBoundingClientRect().bottom
        : window.innerWidth < 1024 ? 220 : 160

      const elementPosition = targetEl.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 16

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    },
    [prefersReducedMotion]
  )

  // Handle Back to Home navigation
  const handleBackToHome = (e) => {
    e.preventDefault()
    if (onBack) {
      onBack()
    } else if (typeof window !== 'undefined') {
      window.location.hash = '#works'
    }
  }

  // Active section data
  const currentSection = sections[activeIndex] || sections[0] || {
    number: 'SECTION 01',
    title: project.projectName,
  }

  // Calculate progress line fill percentage
  const progressPercent =
    totalSections > 1 ? (activeIndex / (totalSections - 1)) * 100 : 100

  return (
    <div
      className={`relative min-h-screen w-full bg-canvas text-primary font-sans selection:bg-accent/30 ${className}`}
    >
      {/* ============================================================ */}
      {/* 1. Architectural Dotted Mesh Background Underlay             */}
      {/* ============================================================ */}
      <DottedMeshBackground
        maxWidth="max-w-[1440px]"
        dotColor="rgba(23, 23, 23, 0.08)"
        dotSize={1.5}
        spacing={24}
      />

      {/* ============================================================ */}
      {/* 2. Top Navigation Header (Sticky, Minimal, Editorial)        */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 w-full bg-canvas/92 backdrop-blur-md border-b border-border-subtle select-none transition-colors">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 h-14 sm:h-16 flex items-center justify-between gap-4">

          {/* Left: Back to Home Link */}
          <div className="flex items-center min-w-[120px] sm:min-w-[160px]">
            <button
              type="button"
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 font-sans text-[13px] sm:text-[14px] text-secondary hover:text-primary transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xs py-1"
              aria-label="Back to home"
            >
              <span
                className="font-mono text-[14px] sm:text-[15px] transition-transform duration-200 group-hover:-translate-x-1"
                aria-hidden="true"
              >
                ←
              </span>
              <span className="font-medium tracking-tight">Back to home</span>
            </button>
          </div>

          {/* Center: Project Name – Case Study Title */}
          <div className="flex-1 text-center truncate px-2">
            <h1 className="font-sans font-medium text-[13px] sm:text-[15px] md:text-[16px] text-primary tracking-tight truncate">
              {project.caseStudyTitle || `${project.projectName} – Casestudy`}
            </h1>
          </div>

          {/* Right: Device Selector (if enabled) + Explore Project CTA */}
          <div className="flex items-center justify-end min-w-[120px] sm:min-w-[160px] shrink-0">
            <div className="flex items-center gap-2 sm:gap-2.5 scale-85 sm:scale-90 md:scale-100 origin-right shrink-0">
              {/* Segmented Prototype Device Selector (hidden for desktop-only projects) */}
              {showDeviceSelector && (
                <div
                  role="radiogroup"
                  aria-label="Select prototype device view"
                  className="inline-flex items-center h-10 p-[3px] rounded-full bg-black/[0.04] border border-border-subtle shadow-xs select-none"
                >
                  {/* Desktop Option */}
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selectedDevice === 'desktop'}
                    onClick={() => setSelectedDevice('desktop')}
                    title="Desktop prototype"
                    className={`h-full inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 rounded-full text-[12px] font-sans font-medium transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      selectedDevice === 'desktop'
                        ? 'bg-[#E8E4F8] text-primary shadow-xs border border-accent/40 font-semibold'
                        : 'text-secondary hover:text-primary hover:bg-black/[0.03] border border-transparent'
                    }`}
                  >
                    <svg
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors ${
                        selectedDevice === 'desktop' ? 'text-[#6A52DE]' : 'currentColor'
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="20" height="14" x="2" y="3" rx="2" />
                      <line x1="8" x2="16" y1="21" y2="21" />
                      <line x1="12" x2="12" y1="17" y2="21" />
                    </svg>
                    <span className="hidden sm:inline leading-none">Desktop</span>
                  </button>

                  {/* Mobile Option */}
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selectedDevice === 'mobile'}
                    onClick={() => setSelectedDevice('mobile')}
                    title="Mobile prototype"
                    className={`h-full inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 rounded-full text-[12px] font-sans font-medium transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      selectedDevice === 'mobile'
                        ? 'bg-[#E8E4F8] text-primary shadow-xs border border-accent/40 font-semibold'
                        : 'text-secondary hover:text-primary hover:bg-black/[0.03] border border-transparent'
                    }`}
                  >
                    <svg
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors ${
                        selectedDevice === 'mobile' ? 'text-[#6A52DE]' : 'currentColor'
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                      <line x1="12" x2="12.01" y1="18" y2="18" />
                    </svg>
                    <span className="hidden sm:inline leading-none">Mobile</span>
                  </button>
                </div>
              )}

              {/* Explore Project Button — Restored Normal Prominent Appearance */}
              <AnimatedCTA
                text={exploreLabel}
                href={currentPrototypeUrl || undefined}
                onClick={handleExploreClick}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel={`Explore ${project.projectName}${showDeviceSelector ? ` ${selectedDevice}` : ''} prototype`}
                title={
                  currentPrototypeUrl
                    ? `Open prototype in new tab`
                    : `${selectedDevice === 'desktop' ? 'Desktop' : 'Mobile'} prototype link coming soon`
                }
              />
            </div>
          </div>

        </div>
      </header>

      {/* ============================================================ */}
      {/* 3. Sticky Section Heading & Mobile Progress Control Bar      */}
      {/* ============================================================ */}
      <nav
        aria-label="Case Study Section Progress"
        className="sticky top-14 sm:top-16 z-30 w-full bg-canvas/92 backdrop-blur-md border-b border-border-subtle/60 pt-4 sm:pt-5 pb-4 sm:pb-5 select-none transition-all"
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">

          {/* Dynamic Section Identifier & Prominent Serif Heading (Full Available Width) */}
          <div className="mb-0 lg:mb-1">
            {/* Small uppercase section identifier */}
            <p className="font-mono text-[11px] sm:text-[12px] font-semibold text-accent uppercase tracking-[0.2em] mb-1.5 sm:mb-2 transition-all duration-300">
              {currentSection.number || `SECTION 0${activeIndex + 1}`}
            </p>

            {/* Prominent Serif Section Heading with selective lavender highlight */}
            <h2
              key={currentSection.title}
              className="font-serif font-normal text-[22px] sm:text-[28px] md:text-[32px] lg:text-[34px] xl:text-[36px] text-primary leading-[1.18] tracking-tight transition-opacity duration-300 ease-out"
            >
              {renderHighlightedTitle(currentSection.title, currentSection.highlightWords)}
            </h2>
          </div>

          {/* ============================================================ */}
          {/* Mobile / Tablet Horizontal Progress Bar (Hidden on Desktop)  */}
          {/* ============================================================ */}
          <div
            ref={progressContainerRef}
            className="lg:hidden relative w-full overflow-x-auto sm:overflow-visible scrollbar-none pt-4 pb-2 px-4 sm:px-0 -mx-4 sm:mx-0 mt-3 sm:mt-4"
          >
            <div className="relative min-w-[620px] md:min-w-0 w-full flex items-center justify-between overflow-visible px-2 sm:px-1">

              {/* Continuous Horizontal Timeline Rail (Underneath Markers) */}
              <div
                aria-hidden="true"
                className="absolute left-[24px] right-[24px] sm:left-[22px] sm:right-[22px] top-[14px] sm:top-[16px] -translate-y-1/2 h-[5px] sm:h-[6px] rounded-full border-[1.5px] sm:border-2 border-white bg-[#E8E4F8] pointer-events-none z-0 overflow-hidden"
              >
                {/* Active Progress Fill Line with CareerTimeline Dark Treatment */}
                <div
                  className="h-full bg-[#0E0E10] rounded-full origin-left shadow-[0_0_8px_rgba(14,14,16,0.35)] transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Mobile Section Markers & Short Labels */}
              {sections.map((section, idx) => {
                const isActive = idx === activeIndex
                const isCompleted = idx < activeIndex

                return (
                  <button
                    key={`mobile-marker-${section.id || idx}`}
                    ref={(el) => {
                      markerRefs.current[idx] = el
                    }}
                    type="button"
                    onClick={() => handleMarkerClick(idx)}
                    className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm px-1.5 py-1 overflow-visible"
                    aria-label={`Jump to ${section.number || `Section ${idx + 1}`}: ${section.title}`}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {/* Marker Node */}
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white transition-all duration-300 flex items-center justify-center ${isActive
                          ? 'bg-[#0E0E10] scale-115 sm:scale-125 shadow-[0_0_16px_3px_rgba(163,144,251,0.6),0_0_6px_1px_rgba(163,144,251,0.4)]'
                          : isCompleted
                            ? 'bg-[#0E0E10] scale-100 opacity-90 shadow-[0_0_6px_rgba(163,144,251,0.25)]'
                            : 'bg-[#0E0E10]/75 scale-85 sm:scale-90 opacity-40 group-hover:opacity-75 group-hover:scale-100'
                        }`}
                      style={{ transformOrigin: 'center center' }}
                    >
                      <div
                        className={`rounded-full transition-all duration-300 ${isActive
                            ? 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#A390FB]'
                            : isCompleted
                              ? 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#A390FB]/90'
                              : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#A390FB]/60'
                          }`}
                      />
                    </div>

                    {/* Short Text Label Beneath Marker */}
                    <span
                      className={`font-sans text-[11px] sm:text-[12px] md:text-[13px] tracking-tight transition-colors duration-200 mt-2 sm:mt-2.5 whitespace-nowrap select-none ${isActive
                          ? 'text-primary font-semibold'
                          : isCompleted
                            ? 'text-secondary font-medium'
                            : 'text-muted/80 group-hover:text-secondary'
                        }`}
                    >
                      {section.shortLabel || section.title}
                    </span>
                  </button>
                )
              })}

            </div>
          </div>

        </div>
      </nav>

      {/* ============================================================ */}
      {/* 4. Desktop: Fixed Left Vertical Timeline Navigation          */}
      {/* ============================================================ */}
      <aside
        aria-label="Case Study Desktop Navigation"
        className="hidden lg:block fixed left-6 lg:left-10 xl:left-[max(2.5rem,calc(50vw-660px))] top-[182px] xl:top-[186px] bottom-6 z-40 w-[140px] xl:w-[145px] select-none pointer-events-none"
      >
        <div className="relative w-full h-full flex flex-col justify-center pointer-events-auto">
          <div className="relative w-full h-[58vh] xl:h-[62vh] max-h-[560px] min-h-[300px]">

            {/* Continuous Vertical Timeline Rail (Underneath Markers) */}
            <div
              aria-hidden="true"
              className="absolute left-[16px] xl:left-[17px] -translate-x-1/2 top-[14px] bottom-[14px] xl:top-[15px] xl:bottom-[15px] w-[5px] xl:w-[6px] rounded-full border-[1.5px] border-white bg-[#E8E4F8] pointer-events-none z-0 overflow-hidden"
            >
              {/* Active Progress Fill Line with CareerTimeline Dark Treatment */}
              <div
                className="w-full bg-[#0E0E10] rounded-full origin-top shadow-[0_0_8px_rgba(14,14,16,0.35)] transition-all duration-300 ease-out"
                style={{ height: `${progressPercent}%` }}
              />
            </div>

            {/* Vertical Milestone Items Distributed Evenly Across Available Height */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between">
              {sections.map((section, idx) => {
                const isActive = idx === activeIndex
                const isCompleted = idx < activeIndex

                return (
                  <button
                    key={`desktop-marker-${section.id || idx}`}
                    type="button"
                    onClick={() => handleMarkerClick(idx)}
                    className="group relative flex items-center gap-2.5 xl:gap-3 py-1 px-1.5 rounded-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent text-left w-full transition-all"
                    aria-label={`Jump to ${section.number || `Section ${idx + 1}`}: ${section.title}`}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {/* Concentric Marker Node matching CareerTimeline */}
                    <div
                      className={`w-5 h-5 xl:w-5.5 xl:h-5.5 rounded-full border-2 border-white transition-all duration-300 flex items-center justify-center shrink-0 ${isActive
                          ? 'bg-[#0E0E10] scale-115 xl:scale-120 shadow-[0_0_16px_3px_rgba(163,144,251,0.6),0_0_6px_1px_rgba(163,144,251,0.4)]'
                          : isCompleted
                            ? 'bg-[#0E0E10] scale-100 opacity-90 shadow-[0_0_6px_rgba(163,144,251,0.25)]'
                            : 'bg-[#0E0E10]/75 scale-85 xl:scale-90 opacity-40 group-hover:opacity-75 group-hover:scale-100'
                        }`}
                      style={{ transformOrigin: 'center center' }}
                    >
                      <div
                        className={`rounded-full transition-all duration-300 ${isActive
                            ? 'w-2 h-2 xl:w-2.5 xl:h-2.5 bg-[#A390FB]'
                            : isCompleted
                              ? 'w-1.5 h-1.5 xl:w-2 xl:h-2 bg-[#A390FB]/90'
                              : 'w-1.5 h-1.5 xl:w-2 xl:h-2 bg-[#A390FB]/60'
                          }`}
                      />
                    </div>

                    {/* Short Text Label Beside Marker */}
                    <span
                      className={`font-sans text-[12px] xl:text-[13px] tracking-tight transition-colors duration-200 truncate select-none ${isActive
                          ? 'text-primary font-semibold'
                          : isCompleted
                            ? 'text-secondary font-medium'
                            : 'text-muted/80 group-hover:text-secondary'
                        }`}
                    >
                      {section.shortLabel || section.title}
                    </span>
                  </button>
                )
              })}
            </div>

          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 5. Main Presentation Column (Offset on Desktop for Sidebar)  */}
      {/* ============================================================ */}
      <div className="w-full lg:pl-[200px] xl:pl-[calc(max(2.5rem,50vw-660px)+190px)] lg:pr-8 xl:pr-12 transition-all">

        {/* ============================================================ */}
        {/* 5. Main Case Study Content (Vertically Stacked Presentation) */}
        {/* ============================================================ */}
        <main
          role="main"
          className="relative z-10 w-full max-w-[1020px] xl:max-w-[1080px] 2xl:max-w-[1140px] px-4 sm:px-6 lg:px-0 pt-6 sm:pt-8 lg:pt-10 pb-24 sm:pb-32"
        >
          {/* Presentation slide stack with project-configured vertical spacing */}
          <div className={`flex flex-col ${project?.slideSpacing || (project?.id === 'elvan' ? 'gap-0 space-y-0' : 'gap-12 sm:gap-16 md:gap-20')} m-0 p-0`}>
            {sections.map((section, index) => (
              <article
                key={section.id || index}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[index] = el
                }}
                tabIndex={-1}
                aria-label={`${section.number}: ${section.title}`}
                className="relative w-full focus:outline-none scroll-mt-[220px] sm:scroll-mt-[200px] lg:scroll-mt-[150px] m-0 p-0 block leading-none"
              >
                {/* Slide Image with Preserved Aspect Ratio and Optional Video Embed */}
                {section.image ? (
                  <div className="relative w-full m-0 p-0 block leading-none">
                    <img
                      src={section.image}
                      alt={section.alt || `${section.number} — ${section.title}`}
                      className="w-full h-auto object-contain object-center block select-none m-0 p-0"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />

                    {/* Embedded Interactive Video Walkthrough (e.g. Roamio Slide 5) */}
                    {section.video && (
                      <div
                        className="absolute z-10 overflow-hidden rounded-xl sm:rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.16)] border border-black/10 bg-black/5"
                        style={{
                          left: section.videoStyle?.left || '7.45%',
                          width: section.videoStyle?.width || '85.1%',
                          top: section.videoStyle?.top || '18.25%',
                          aspectRatio: section.videoStyle?.aspectRatio || '16 / 9',
                        }}
                      >
                        <video
                          src={section.video}
                          controls
                          playsInline
                          muted
                          autoPlay
                          loop
                          preload="metadata"
                          className="w-full h-full object-cover block"
                          aria-label={section.videoAriaLabel || `${section.title} — Video walkthrough`}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Fallback Elegant Slide Card if Image Pending Export */
                  <div className="w-full aspect-[16/10] bg-surface rounded-xl sm:rounded-2xl border border-border-subtle p-8 sm:p-12 md:p-16 flex flex-col justify-between shadow-sm my-4">
                    <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                      <span className="font-mono text-xs text-accent uppercase tracking-widest font-semibold">
                        {section.number}
                      </span>
                      <span className="font-sans text-xs text-muted">
                        {project.projectName} Presentation Slide
                      </span>
                    </div>

                    <div className="max-w-2xl my-auto py-8">
                      <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-primary font-normal leading-tight mb-4">
                        {section.title}
                      </h3>
                      <p className="font-sans text-sm sm:text-base text-secondary leading-relaxed">
                        {section.description ||
                          `Figma slide export for ${section.title}. When exported from Figma, place the image in the project configuration.`}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border-subtle/60 flex items-center justify-between text-xs text-muted font-mono">
                      <span>SLIDE 0{index + 1} OF 0{totalSections}</span>
                      <span>16:10 ASPECT RATIO PRESERVED</span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Case Study Footer Note & Return Home CTA */}
          <footer className="mt-16 sm:mt-24 pt-10 sm:pt-14 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <p className="font-serif text-xl sm:text-2xl text-primary font-normal">
                Thanks for exploring {project.projectName}.
              </p>
              <p className="font-sans text-sm text-secondary mt-1">
                {project.subtitle || 'UI/UX Design Case Study'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBackToHome}
                className="px-5 py-2.5 rounded-full border border-border-medium bg-canvas hover:bg-black/[0.04] text-primary font-sans text-sm font-medium transition-colors cursor-pointer"
              >
                ← Back to Projects
              </button>
              <AnimatedCTA
                text={exploreLabel}
                href={currentPrototypeUrl || undefined}
                onClick={handleExploreClick}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel={`Explore ${project.projectName} ${selectedDevice} prototype`}
                title={
                  currentPrototypeUrl
                    ? `Open ${selectedDevice} prototype in new tab`
                    : `${selectedDevice === 'desktop' ? 'Desktop' : 'Mobile'} prototype link coming soon`
                }
              />
            </div>
          </footer>
        </main>
      </div>

      {/* Floating Feedback Toast for Unconfigured Device Prototypes */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-18 sm:top-20 right-4 sm:right-8 z-50 px-4 py-2.5 rounded-full bg-[#0E0E10]/95 text-white border border-white/10 shadow-2xl backdrop-blur-md font-sans text-xs flex items-center gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-top-2 select-none"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="tracking-tight">{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
