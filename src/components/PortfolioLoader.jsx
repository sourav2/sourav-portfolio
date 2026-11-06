import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Helper to compute gradient parameters for an individual line.
 * Provides subtle opacity falloff at exposed endpoints while preserving
 * solid crisp opacity at the center and at 90° joints.
 */
function createLineGradient(id, x1, y1, x2, y2, opacity, fadeStart = true, fadeEnd = true, color = 'var(--color-secondary, #545454)') {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy)
  if (len === 0) return null

  // Subtle, clearly perceptible but restrained fade distance (~14% of length, 16px to 45px)
  const fadeDist = Math.min(45, Math.max(16, len * 0.14))
  const startOffset = fadeStart ? ((fadeDist / len) * 100).toFixed(1) : '0'
  const endOffset = fadeEnd ? ((1 - fadeDist / len) * 100).toFixed(1) : '100'

  return (
    <linearGradient
      key={id}
      id={id}
      gradientUnits="userSpaceOnUse"
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
    >
      <stop offset="0%" stopColor={color} stopOpacity={fadeStart ? '0' : opacity} />
      {fadeStart && (
        <stop offset={`${startOffset}%`} stopColor={color} stopOpacity={opacity} />
      )}
      {fadeEnd && (
        <stop offset={`${endOffset}%`} stopColor={color} stopOpacity={opacity} />
      )}
      <stop offset="100%" stopColor={color} stopOpacity={fadeEnd ? '0' : opacity} />
    </linearGradient>
  )
}

/**
 * PortfolioLoader - Figma-Matched Typographic Construction Loader
 * with Gradient Line Endings.
 *
 * Visual Characteristics:
 * - Central portion of each line remains crisp and clearly visible
 * - Both endpoints gradually fade from their existing opacity to 0
 * - Gradients follow the direction of each line (userSpaceOnUse)
 * - 90° joints stay solid without fading
 * - Protected visual exclusion zone around SH letters
 * - 5-Phase sequenced timeline with upward curtain transition
 */
export default function PortfolioLoader({ onComplete, autoStart = true }) {
  const containerRef = useRef(null)
  const linesGroupRef = useRef(null)
  const logoGroupRef = useRef(null)

  // Track viewport dimensions dynamically for responsive edge boundaries
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  })

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Scroll lock while loader is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const { width: W, height: H } = dimensions

  // Scale: 1.05x on desktop, 0.85x on mobile for optical balance
  const isMobile = W < 640
  const scale = isMobile ? 0.85 : 1.05

  // Half-extents in logo coordinate space from center (100, 85)
  // Adding small bleed (10px) ensures lines touch and cross screen boundaries cleanly
  const halfExtentX = (W / 2) / scale + 10
  const halfExtentY = (H / 2) / scale + 10

  // Exact Viewport Boundary Coordinates in SVG space
  const xLeft = 100 - halfExtentX // Far Left viewport boundary
  const xRight = 100 + halfExtentX // Far Right viewport boundary
  const yTop = 85 - halfExtentY // Far Top viewport boundary
  const yBottom = 85 + halfExtentY // Far Bottom viewport boundary

  // Construction line definitions: restored previous well-balanced composition
  // - Retains exact previous distribution, lengths, and positions of all horizontal and vertical paths
  // - Preserves original bottom composition (h7 at Y=365 with v_bot1, v_bot2, v_bot3 extending to yBottom)
  // - Retains exact opacities (0.24-0.35) and stroke widths (0.75-0.85)
  // - Distracting corner tick fragments removed while preserving all structural lines and extensions
  const lineConfigs = [
    // --- VERTICAL GUIDES ---
    { id: 'v1_up', x1: -10, y1: 40, x2: -10, y2: -75, opacity: 0.26, strokeWidth: 0.8, fadeStart: true, fadeEnd: true },
    { id: 'v1_down', x1: -10, y1: 40, x2: -10, y2: 365, opacity: 0.28, strokeWidth: 0.8, fadeStart: true, fadeEnd: false },
    { id: 'v2_up', x1: 18, y1: 25, x2: 18, y2: yTop, opacity: 0.26, strokeWidth: 0.75, fadeStart: true, fadeEnd: true },
    { id: 'v2_down', x1: 18, y1: 146, x2: 18, y2: 390, opacity: 0.28, strokeWidth: 0.75, fadeStart: true, fadeEnd: false },
    { id: 'v3_up', x1: 110, y1: 25, x2: 110, y2: yTop, opacity: 0.32, strokeWidth: 0.8, fadeStart: true, fadeEnd: true },
    { id: 'v3_down', x1: 110, y1: 146, x2: 110, y2: 320, opacity: 0.26, strokeWidth: 0.8, fadeStart: true, fadeEnd: true },
    { id: 'v4_up', x1: 195, y1: 17, x2: 195, y2: yTop, opacity: 0.32, strokeWidth: 0.8, fadeStart: true, fadeEnd: true },
    { id: 'v4_down', x1: 195, y1: 146, x2: 195, y2: 240, opacity: 0.26, strokeWidth: 0.8, fadeStart: true, fadeEnd: true },
    { id: 'v5_up', x1: 285, y1: 85, x2: 285, y2: 25, opacity: 0.24, strokeWidth: 0.8, fadeStart: true, fadeEnd: true },
    { id: 'v5_down', x1: 285, y1: 85, x2: 285, y2: 365, opacity: 0.28, strokeWidth: 0.8, fadeStart: true, fadeEnd: false },

    // --- HORIZONTAL GUIDES ---
    { id: 'h1', x1: 195, y1: -65, x2: xLeft, y2: -65, opacity: 0.32, strokeWidth: 0.8, fadeStart: true, fadeEnd: true },
    { id: 'h2', x1: 18, y1: -8, x2: xRight, y2: -8, opacity: 0.32, strokeWidth: 0.8, fadeStart: true, fadeEnd: true },
    { id: 'h3_left', x1: 18, y1: 28, x2: -60, y2: 28, opacity: 0.24, strokeWidth: 0.75, fadeStart: true, fadeEnd: true },
    { id: 'h3_right', x1: 195, y1: 28, x2: 285, y2: 28, opacity: 0.24, strokeWidth: 0.75, fadeStart: true, fadeEnd: true },
    { id: 'h4_left', x1: 18, y1: 85, x2: Math.max(xLeft * 0.85, -450), y2: 85, opacity: 0.28, strokeWidth: 0.8, fadeStart: true, fadeEnd: true },
    { id: 'h4_right', x1: 195, y1: 85, x2: 285, y2: 85, opacity: 0.26, strokeWidth: 0.8, fadeStart: true, fadeEnd: true },
    { id: 'h5_left', x1: 18, y1: 146, x2: xLeft, y2: 146, opacity: 0.35, strokeWidth: 0.85, fadeStart: true, fadeEnd: true },
    { id: 'h5_right', x1: 195, y1: 146, x2: xRight, y2: 146, opacity: 0.35, strokeWidth: 0.85, fadeStart: true, fadeEnd: true },
    { id: 'h6', x1: 18, y1: 240, x2: xRight * 0.95, y2: 240, opacity: 0.28, strokeWidth: 0.8, fadeStart: true, fadeEnd: true },
    { id: 'h7', x1: -10, y1: 365, x2: 285, y2: 365, opacity: 0.28, strokeWidth: 0.8, fadeStart: false, fadeEnd: false },

    // --- BOTTOM EXTENSIONS TO VIEWPORT BOUNDARY ---
    { id: 'v_bot1', x1: -10, y1: 365, x2: -10, y2: yBottom, opacity: 0.28, strokeWidth: 0.8, fadeStart: false, fadeEnd: true },
    { id: 'v_bot2', x1: 18, y1: 390, x2: 18, y2: yBottom, opacity: 0.26, strokeWidth: 0.75, fadeStart: false, fadeEnd: true },
    { id: 'v_bot3', x1: 285, y1: 365, x2: 285, y2: yBottom, opacity: 0.28, strokeWidth: 0.8, fadeStart: false, fadeEnd: true },
  ]

  useEffect(() => {
    if (!autoStart) return

    const ctx = gsap.context(() => {
      // Respect prefers-reduced-motion: calm reveal, brief hold, gentle curtain slide
      if (prefersReducedMotion) {
        const reducedTl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = ''
            onComplete && onComplete()
          },
        })

        // 1. Brief blank pause
        reducedTl.to({}, { duration: 0.2 })

        // 2. Calm fade-in of logo
        reducedTl.fromTo(
          logoGroupRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: 'power1.out' }
        )

        // 3. Calm fade-in of construction lines
        reducedTl.fromTo(
          linesGroupRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: 'power1.out' }
        )

        // 4. Brief hold
        reducedTl.to({}, { duration: 0.3 })

        // 5. Curtain slides up
        reducedTl.to(containerRef.current, {
          yPercent: -100,
          duration: 0.7,
          ease: 'power3.inOut',
        })
        return
      }

      const lines = linesGroupRef.current?.querySelectorAll('.perimeter-line')

      // Initial state: hide lines completely using strokeDashoffset
      if (lines) {
        lines.forEach((el) => {
          const len = el.getTotalLength ? el.getTotalLength() : 1000
          gsap.set(el, {
            strokeDasharray: len,
            strokeDashoffset: len,
          })
        })
      }

      // Initial state: logo completely invisible, scale 0.85 centered at (100, 85)
      gsap.set(logoGroupRef.current, {
        opacity: 0,
        scale: 0.85,
        svgOrigin: '100 85',
      })

      // Master Sequenced GSAP Timeline
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = ''
          onComplete && onComplete()
        },
      })

      // ================================================================
      // Phase 1 — Blank Screen (300ms pause with warm off-white canvas)
      // ================================================================
      tl.to({}, { duration: 0.3 })

      // ================================================================
      // Phase 2 — Logo Entrance (400ms, scale 0.85 -> 1.0, power2.out)
      // ================================================================
      tl.to(logoGroupRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      })

      // ================================================================
      // Phase 3 — Construction Lines Draw Outward Progressively
      // ================================================================
      if (lines && lines.length > 0) {
        tl.to(lines, {
          strokeDashoffset: 0,
          duration: 0.95,
          stagger: {
            each: 0.028,
            from: 'center',
          },
          ease: 'power2.out',
        })
      }

      // ================================================================
      // Phase 4 — Brief Hold (300ms hold of completed composition)
      // ================================================================
      tl.to({}, { duration: 0.3 })

      // ================================================================
      // Phase 5 — Loader Curtain Transition (Slide up by 100vh with power3.inOut)
      // ================================================================
      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [autoStart, prefersReducedMotion, W, H, scale, xLeft, xRight, yTop, yBottom])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas overflow-hidden select-none"
      style={{ backgroundColor: 'var(--color-canvas, #F7F5F0)' }}
      aria-label="Loading portfolio animation"
      role="status"
    >
      {/* 
        Single unified SVG viewport centered directly on the logo's center (100, 85).
        Geometric Exclusion Zone: [X: 18..185, Y: 25..146]
        ZERO lines enter or intersect the letter area. All lines frame it from the perimeter.
      */}
      <svg
        viewBox={`${100 - halfExtentX} ${85 - halfExtentY} ${halfExtentX * 2} ${halfExtentY * 2}`}
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ================================================================ */}
        {/* SVG DEFS: Dynamic linear gradients for soft fading line ends    */}
        {/* ================================================================ */}
        <defs>
          {lineConfigs.map((cfg) =>
            createLineGradient(
              cfg.id,
              cfg.x1,
              cfg.y1,
              cfg.x2,
              cfg.y2,
              cfg.opacity,
              cfg.fadeStart,
              cfg.fadeEnd,
              'var(--color-secondary, #545454)'
            )
          )}
        </defs>

        {/* ================================================================ */}
        {/* CONSTRUCTION LINES - FRAMING THE LOGO FROM THE OUTER PERIMETER   */}
        {/* ================================================================ */}
        <g
          ref={linesGroupRef}
          fill="none"
          strokeLinecap="square"
          strokeLinejoin="miter"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        >
          {lineConfigs.map((cfg) => (
            <path
              key={cfg.id}
              className="perimeter-line"
              d={`M ${cfg.x1} ${cfg.y1} L ${cfg.x2} ${cfg.y2}`}
              stroke={`url(#${cfg.id})`}
              strokeWidth={cfg.strokeWidth}
            />
          ))}
        </g>

        {/* ================================================================ */}
        {/* STATIONARY SH LOGO (Centerpiece, 100% Vector Precision)          */}
        {/* Protected Visual Exclusion Zone: Zero lines intersect the text   */}
        {/* ================================================================ */}
        <g ref={logoGroupRef} id="stationary-sh-logo">
          {/* Lavender Inverted-L Accent (Top Right) */}
          <polygon
            points="142,17 184.5,17 184.5,57.5 174.5,57.5 174.5,29 172.5,27 144,27 142,25"
            fill="var(--color-accent, #A390FB)"
          />
          {/* Precision drafting corner ticks on lavender accent */}
          <rect x="142" y="25" width="2" height="2" fill="var(--color-primary, #171717)" opacity="0.4" />
          <rect x="173" y="56" width="2" height="2" fill="var(--color-primary, #171717)" opacity="0.4" />

          {/* Letter S (Exact Geometric Vector Path) */}
          <path
            d="M 94.5,65.5 L 84,65.5 C 84,55 77,50.2 61.5,50.2 C 48,50.2 39.8,56.5 39.8,66 C 39.8,75.5 48.5,79.8 63,83.2 C 81.5,87.5 95.5,93.5 95.5,111.5 C 95.5,126 84,134.5 62,134.5 C 44,134.5 32,126 27,112 L 37.5,104 C 40.5,116 50,123.5 62,123.5 C 74.5,123.5 83,118 83,110.5 C 83,101.5 74.5,97.5 59.5,94 C 41.5,89.5 28.5,84 28.5,66.5 C 28.5,51.5 41.5,40 61.5,40 C 78,40 89.5,48.5 94.5,65.5 Z"
            fill="var(--color-primary, #171717)"
          />

          {/* Letter H (Exact Stems & Crossbar) */}
          {/* Left Vertical Stem */}
          <rect x="97.5" y="40" width="9" height="94.5" fill="var(--color-primary, #171717)" />
          {/* Horizontal Crossbar */}
          <rect x="106.5" y="85" width="45" height="9.5" fill="var(--color-primary, #171717)" />
          {/* Right Vertical Stem */}
          <rect x="151.5" y="40" width="9.5" height="94.5" fill="var(--color-primary, #171717)" />
        </g>
      </svg>
    </div>
  )
}
