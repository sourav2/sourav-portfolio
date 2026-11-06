import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import AnimatedEmoji from './AnimatedEmoji'

/**
 * Seven Authentic Personal Images from public/assets/my_images/
 * Numbered sequence from 1 to 7 with exact file references and tags.
 */
export const ABOUT_CARDS = [
  {
    id: 'my-image-1',
    src: '/assets/my_images/My Image 1.jpg',
    rawFilename: 'My Image 1.jpg',
    alt: 'Sourav Haldar — Personal Image 1',
    tag: '01 / 07',
    objectPosition: 'center 20%',
  },
  {
    id: 'my-image-2',
    src: '/assets/my_images/My Image 2.jpg',
    rawFilename: 'My Image 2.jpg',
    alt: 'Sourav Haldar — Personal Image 2',
    tag: '02 / 07',
    objectPosition: 'center 20%',
  },
  {
    id: 'my-image-3',
    src: '/assets/my_images/My Image 3.jpg',
    rawFilename: 'My Image 3.jpg',
    alt: 'Sourav Haldar — Personal Image 3',
    tag: '03 / 07',
    objectPosition: 'center center',
  },
  {
    id: 'my-image-4',
    src: '/assets/my_images/My Image 4.jpg',
    rawFilename: 'My Image 4.jpg',
    alt: 'Sourav Haldar — Personal Image 4',
    tag: '04 / 07',
    objectPosition: 'center 25%',
  },
  {
    id: 'my-image-5',
    src: '/assets/my_images/My Image 5.jpg',
    rawFilename: 'My Image 5.jpg',
    alt: 'Sourav Haldar — Personal Image 5',
    tag: '05 / 07',
    objectPosition: 'center 25%',
  },
  {
    id: 'my-image-6',
    src: '/assets/my_images/My Image 6.jpg',
    rawFilename: 'My Image 6.jpg',
    alt: 'Sourav Haldar — Personal Image 6',
    tag: '06 / 07',
    objectPosition: 'center center',
  },
  {
    id: 'my-image-7',
    src: '/assets/my_images/My Image 7.png',
    rawFilename: 'My Image 7.png',
    alt: 'Sourav Haldar — Personal Image 7',
    tag: '07 / 07',
    objectPosition: 'center center',
  },
]

// Backward-compatible alias
export const ABOUT_PORTRAITS = ABOUT_CARDS

/**
 * Coordinate Slot Configurations for Circular Arc Depth (7-card queue)
 *
 * Depth hierarchy:
 * - Slot 0 (Front/Active): 100% sharp, 0 blur, 0 white overlay, scale 1.0, zIndex 50 (Focal point)
 * - Slot 1 (2nd card): Subtle white overlay (22%), very subtle blur (1.5px), scale 0.94, zIndex 40
 * - Slot 2 (3rd card): Stronger white overlay (42%), 3.5px blur, slight contrast/saturation reduction, scale 0.88, zIndex 30
 * - Slot 3 (4th card): Progressive white overlay (58%), 5.0px blur, scale 0.82, zIndex 20
 * - Slot 4 (5th card): Distant white overlay (70%), 6.5px blur, scale 0.76, zIndex 12
 * - Slot 5 (6th card): Queue behind slot 4 (75% overlay, 7.0px blur, scale 0.76, zIndex 9)
 * - Slot 6 (7th card / back of queue): Furthest in queue (80% overlay, 7.5px blur, scale 0.76, zIndex 6)
 */
const DESKTOP_SLOTS = [
  { x: 0, y: 0, scale: 1.0, rotation: 0, zIndex: 50, overlayOpacity: 0.0, blur: 0, filter: 'none' },
  { x: 55, y: -95, scale: 0.94, rotation: 3.5, zIndex: 40, overlayOpacity: 0.22, blur: 1.5, filter: 'contrast(0.98)' },
  { x: 125, y: -125, scale: 0.88, rotation: 6.5, zIndex: 30, overlayOpacity: 0.42, blur: 3.5, filter: 'contrast(0.94) saturate(0.90)' },
  { x: 145, y: 35, scale: 0.82, rotation: 3.0, zIndex: 20, overlayOpacity: 0.58, blur: 5.0, filter: 'contrast(0.90) saturate(0.85)' },
  { x: 80, y: 155, scale: 0.76, rotation: -2.5, zIndex: 12, overlayOpacity: 0.70, blur: 6.5, filter: 'contrast(0.88) saturate(0.80)' },
  { x: 80, y: 155, scale: 0.76, rotation: -2.5, zIndex: 9, overlayOpacity: 0.75, blur: 7.0, filter: 'contrast(0.86) saturate(0.78)' },
  { x: 80, y: 155, scale: 0.76, rotation: -2.5, zIndex: 6, overlayOpacity: 0.80, blur: 7.5, filter: 'contrast(0.84) saturate(0.75)' },
]

const DESKTOP_PEEL = {
  x: -40,
  y: 35,
  scale: 1.02,
  rotation: -2.5,
}

const TABLET_SLOTS = [
  { x: 0, y: 0, scale: 1.0, rotation: 0, zIndex: 50, overlayOpacity: 0.0, blur: 0, filter: 'none' },
  { x: 42, y: -72, scale: 0.94, rotation: 3.0, zIndex: 40, overlayOpacity: 0.22, blur: 1.5, filter: 'contrast(0.98)' },
  { x: 95, y: -95, scale: 0.88, rotation: 5.5, zIndex: 30, overlayOpacity: 0.42, blur: 3.5, filter: 'contrast(0.94) saturate(0.90)' },
  { x: 110, y: 25, scale: 0.82, rotation: 2.5, zIndex: 20, overlayOpacity: 0.58, blur: 5.0, filter: 'contrast(0.90) saturate(0.85)' },
  { x: 62, y: 120, scale: 0.76, rotation: -2.0, zIndex: 12, overlayOpacity: 0.70, blur: 6.5, filter: 'contrast(0.88) saturate(0.80)' },
  { x: 62, y: 120, scale: 0.76, rotation: -2.0, zIndex: 9, overlayOpacity: 0.75, blur: 7.0, filter: 'contrast(0.86) saturate(0.78)' },
  { x: 62, y: 120, scale: 0.76, rotation: -2.0, zIndex: 6, overlayOpacity: 0.80, blur: 7.5, filter: 'contrast(0.84) saturate(0.75)' },
]

const TABLET_PEEL = {
  x: -32,
  y: 28,
  scale: 1.02,
  rotation: -2.0,
}

const MOBILE_SLOTS = [
  { x: 0, y: 0, scale: 1.0, rotation: 0, zIndex: 50, overlayOpacity: 0.0, blur: 0, filter: 'none' },
  { x: 12, y: -16, scale: 0.95, rotation: 2.0, zIndex: 40, overlayOpacity: 0.22, blur: 1.5, filter: 'contrast(0.98)' },
  { x: 22, y: -30, scale: 0.90, rotation: 3.5, zIndex: 30, overlayOpacity: 0.42, blur: 3.5, filter: 'contrast(0.94) saturate(0.90)' },
  { x: 30, y: -42, scale: 0.85, rotation: 5.0, zIndex: 20, overlayOpacity: 0.58, blur: 5.0, filter: 'contrast(0.90) saturate(0.85)' },
  { x: 36, y: -52, scale: 0.80, rotation: 6.5, zIndex: 12, overlayOpacity: 0.70, blur: 6.5, filter: 'contrast(0.88) saturate(0.80)' },
  { x: 36, y: -52, scale: 0.80, rotation: 6.5, zIndex: 9, overlayOpacity: 0.75, blur: 7.0, filter: 'contrast(0.86) saturate(0.78)' },
  { x: 36, y: -52, scale: 0.80, rotation: 6.5, zIndex: 6, overlayOpacity: 0.80, blur: 7.5, filter: 'contrast(0.84) saturate(0.75)' },
]

const MOBILE_PEEL = {
  x: -24,
  y: 16,
  scale: 1.01,
  rotation: -1.5,
}

function getActiveLayout() {
  if (typeof window === 'undefined') {
    return { slots: DESKTOP_SLOTS, peel: DESKTOP_PEEL }
  }
  const w = window.innerWidth
  if (w >= 1024) {
    return { slots: DESKTOP_SLOTS, peel: DESKTOP_PEEL }
  }
  if (w >= 768) {
    return { slots: TABLET_SLOTS, peel: TABLET_PEEL }
  }
  return { slots: MOBILE_SLOTS, peel: MOBILE_PEEL }
}

/**
 * AboutSection Component
 *
 * Implements an autonomous, continuously running infinite image carousel:
 * - 100vh / 100svh section with two-column editorial layout.
 * - Left column:
 *   - Eyebrow: "A LITTLE ABOUT ME" (Geist, 24px medium, lavender accent).
 *   - Heading: "A designer by profession, a curious mind by nature. 🧠" (Faculty Glyphic).
 *   - Paragraph: Exact description in Geist 16px regular, muted text.
 * - Right column:
 *   - 7 authentic personal images arranged in an overlapping circular arc with layered depth.
 *   - Front card: 100% sharp, zero blur, zero overlay, visually dominant.
 *   - Background cards: progressive white overlays (22% → 80%) and controlled blur (1.5px → 7.5px).
 *   - Autonomous circular movement every ~2.8s: front card peels smoothly to the back of the queue,
 *     next card advances to front focal point. Zero disappearing, zero blank states, zero jumps.
 *   - Suspends when outside viewport; resumes without reset when visible.
 *   - Independent of page scrolling.
 */
export default function AboutSection({
  cards = ABOUT_CARDS,
  portraits,
  className = '',
}) {
  const cardList = portraits || cards
  const sectionRef = useRef(null)
  const cardRefs = useRef([])
  const overlayRefs = useRef([])
  const imageRefs = useRef([])
  const cardOrderRef = useRef(cardList.map((_, i) => i))
  const isTransitioningRef = useRef(false)
  const timerRef = useRef(null)
  const isVisibleRef = useRef(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mq.matches)
      const handler = (e) => setPrefersReducedMotion(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [])

  // Position cards in their respective slot coordinates and depth styling
  const applySlots = useCallback((order) => {
    const { slots } = getActiveLayout()
    const lastSlotIndex = slots.length - 1
    const backSlot = slots[lastSlotIndex]

    order.forEach((cardIdx, slotIdx) => {
      const cardEl = cardRefs.current[cardIdx]
      const overlayEl = overlayRefs.current[cardIdx]
      const imgEl = imageRefs.current[cardIdx]
      const slot = slots[slotIdx] || backSlot

      if (cardEl) {
        gsap.set(cardEl, {
          x: slot.x,
          y: slot.y,
          scale: slot.scale,
          rotation: slot.rotation,
          zIndex: slot.zIndex,
          opacity: 1,
          transformOrigin: 'center center',
        })
      }
      if (overlayEl) {
        gsap.set(overlayEl, {
          opacity: slot.overlayOpacity,
        })
      }
      if (imgEl) {
        const filterStr = slot.blur > 0 ? `blur(${slot.blur}px) ${slot.filter}` : 'none'
        gsap.set(imgEl, {
          filter: filterStr,
        })
      }
    })
  }, [])

  // Ensure cardOrderRef matches cardList length if cardList prop changes
  useEffect(() => {
    if (cardOrderRef.current.length !== cardList.length) {
      cardOrderRef.current = cardList.map((_, i) => i)
      applySlots(cardOrderRef.current)
    }
  }, [cardList, applySlots])

  // Advance circular queue: front card smoothly loops to back; next card advances to front
  const advanceToNextCard = useCallback(() => {
    if (isTransitioningRef.current || prefersReducedMotion) return
    const order = cardOrderRef.current
    if (!order || order.length < 2) return

    isTransitioningRef.current = true
    const { slots, peel } = getActiveLayout()
    const lastSlotIndex = Math.min(order.length - 1, slots.length - 1)
    const backSlot = slots[lastSlotIndex]

    const card0Idx = order[0]
    const card0El = cardRefs.current[card0Idx]
    const card0Overlay = overlayRefs.current[card0Idx]
    const card0Img = imageRefs.current[card0Idx]

    // Circular queue shift: front card moves to the end of queue
    const nextOrder = [...order.slice(1), order[0]]
    const moveDuration = 0.9

    const tl = gsap.timeline({
      onComplete: () => {
        if (card0El) {
          gsap.set(card0El, { zIndex: backSlot.zIndex })
        }
        cardOrderRef.current = nextOrder
        isTransitioningRef.current = false
      },
    })

    // 1. Front card: peels gently outward to waypoint, drops zIndex to 3, then settles into backSlot
    if (card0El) {
      tl.to(
        card0El,
        {
          x: peel.x,
          y: peel.y,
          scale: peel.scale,
          rotation: peel.rotation,
          duration: moveDuration * 0.42,
          ease: 'power1.out',
        },
        0
      )

      tl.set(card0El, { zIndex: 3 }, moveDuration * 0.42)

      tl.to(
        card0El,
        {
          x: backSlot.x,
          y: backSlot.y,
          scale: backSlot.scale,
          rotation: backSlot.rotation,
          duration: moveDuration * 0.58,
          ease: 'power2.inOut',
        },
        moveDuration * 0.42
      )
    }

    if (card0Overlay) {
      tl.to(
        card0Overlay,
        {
          opacity: backSlot.overlayOpacity,
          duration: moveDuration,
          ease: 'power2.inOut',
        },
        0
      )
    }

    if (card0Img) {
      const targetFilter = backSlot.blur > 0 ? `blur(${backSlot.blur}px) ${backSlot.filter}` : 'none'
      tl.to(
        card0Img,
        {
          filter: targetFilter,
          duration: moveDuration,
          ease: 'power2.inOut',
        },
        0
      )
    }

    // 2. Advancing cards (slots 1 -> 0, 2 -> 1, ..., s -> s - 1)
    for (let s = 1; s < order.length; s++) {
      const cardIdx = order[s]
      const cardEl = cardRefs.current[cardIdx]
      const overlayEl = overlayRefs.current[cardIdx]
      const imgEl = imageRefs.current[cardIdx]
      const targetSlot = slots[s - 1] || backSlot

      if (cardEl) {
        if (s === 1) {
          // Immediately elevate the new front card to zIndex 50
          tl.set(cardEl, { zIndex: targetSlot.zIndex }, 0)
        } else {
          tl.set(cardEl, { zIndex: targetSlot.zIndex }, moveDuration * 0.45)
        }

        tl.to(
          cardEl,
          {
            x: targetSlot.x,
            y: targetSlot.y,
            scale: targetSlot.scale,
            rotation: targetSlot.rotation,
            duration: moveDuration,
            ease: 'power2.inOut',
          },
          0
        )
      }

      if (overlayEl) {
        tl.to(
          overlayEl,
          {
            opacity: targetSlot.overlayOpacity,
            duration: moveDuration,
            ease: 'power2.inOut',
          },
          0
        )
      }

      if (imgEl) {
        const targetFilter = targetSlot.blur > 0 ? `blur(${targetSlot.blur}px) ${targetSlot.filter}` : 'none'
        tl.to(
          imgEl,
          {
            filter: targetFilter,
            duration: moveDuration,
            ease: 'power2.inOut',
          },
          0
        )
      }
    }
  }, [prefersReducedMotion])

  // Lifecycle & Viewport management
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return

    // Apply initial slot coordinates & depth effects
    applySlots(cardOrderRef.current)

    if (prefersReducedMotion) return

    const startTimer = () => {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        if (isVisibleRef.current && !document.hidden) {
          advanceToNextCard()
        }
      }, 2800)
    }

    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    // Viewport intersection observer: starts carousel when visible, pauses when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisibleRef.current
        isVisibleRef.current = entry.isIntersecting
        if (entry.isIntersecting) {
          if (!wasVisible) {
            startTimer()
          }
        } else {
          stopTimer()
        }
      },
      {
        threshold: 0.15,
      }
    )

    observer.observe(sectionRef.current)

    // Visibility change handler (tab switching)
    const handleVisibility = () => {
      if (document.hidden) {
        stopTimer()
      } else if (isVisibleRef.current) {
        startTimer()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // Window resize handler: update slot coordinates dynamically
    const handleResize = () => {
      if (!isTransitioningRef.current) {
        applySlots(cardOrderRef.current)
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      stopTimer()
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('resize', handleResize)
    }
  }, [applySlots, advanceToNextCard, prefersReducedMotion])

  // Expose verification helpers for deterministic testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__aboutCardOrder = () => [...cardOrderRef.current]
      window.__advanceAboutCard = advanceToNextCard
      window.__isAboutTransitioning = () => isTransitioningRef.current
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.__aboutCardOrder
        delete window.__advanceAboutCard
        delete window.__isAboutTransitioning
      }
    }
  }, [advanceToNextCard])

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`relative w-full h-screen h-[100svh] min-h-[100vh] max-h-[100svh] flex items-center justify-center max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-8 lg:py-12 select-none overflow-hidden ${className}`}
      aria-label="About Me Section"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-center w-full">

        {/* ============================================================ */}
        {/* LEFT COLUMN: Stationary Text Content (Vertically Centered)   */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-7">

          {/* Eyebrow: Geist 24px Medium (#A390FB) */}
          <div>
            <span className="font-sans text-[18px] sm:text-[20px] lg:text-[24px] font-medium text-accent tracking-tight">
              A LITTLE ABOUT ME
            </span>
          </div>

          {/* Heading: Faculty Glyphic, Standardized Primary Section Heading */}
          <h2 className="font-['Faculty_Glyphic',serif] type-section-heading text-[32px] sm:text-[44px] md:text-[52px] lg:text-[64px] font-normal leading-[1.14] lg:leading-[1.08] text-primary tracking-tight">
            A designer by profession,
            <br className="hidden sm:inline" />
            {' '}a curious mind by nature.{' '}
            <AnimatedEmoji variant="brain" ariaLabel="Brain">
              🧠
            </AnimatedEmoji>
          </h2>

          {/* Paragraph: Geist 16px Regular, Muted Text Color */}
          <p className="font-sans text-[15px] sm:text-[16px] text-secondary font-normal leading-[1.65] tracking-tight max-w-xl">
            I'm Sourav, a UI/UX designer who enjoys turning complex ideas into intuitive, meaningful digital experiences. With a background in web development and visual design, I bring creative thinking and technical understanding to the way I design. Outside of work, I'm usually exploring new places, collecting inspiration, or experimenting with something new.{' '}
            <AnimatedEmoji variant="float" delay={0.6} ariaLabel="Globe">
              🌍
            </AnimatedEmoji>
          </p>

        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Semicircular Card Composition along Arc       */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 flex items-center justify-center relative w-full h-[520px] sm:h-[560px] lg:h-[600px] overflow-visible">

          {/* Semicircular Card Anchor/Frame */}
          <div className="relative w-[280px] sm:w-[310px] lg:w-[325px] xl:w-[335px] h-[350px] sm:h-[390px] lg:h-[405px] xl:h-[420px] translate-y-3 sm:translate-y-4 lg:translate-y-5">
            {cardList.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className="about-card-item absolute inset-0 w-full h-full rounded-2xl bg-white border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden select-none will-change-[transform]"
                style={{
                  transformOrigin: 'center center',
                }}
              >
                {/* Card Visual / Photograph */}
                <img
                  ref={(el) => (imageRefs.current[index] = el)}
                  src={encodeURI(decodeURI(item.src))}
                  alt={item.alt}
                  className="w-full h-full object-cover select-none pointer-events-none will-change-[filter]"
                  style={{ objectPosition: item.objectPosition || 'center center' }}
                  loading={index < 3 ? 'eager' : 'lazy'}
                />

                {/* Subtle Vignette Gradient for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                {/* Layered White Translucent Depth Overlay */}
                <div
                  ref={(el) => (overlayRefs.current[index] = el)}
                  className="absolute inset-0 bg-white pointer-events-none will-change-[opacity]"
                  style={{ opacity: 0 }}
                />

                {/* Top Corner Index Badge */}
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-surface/85 backdrop-blur-md border border-border-subtle text-[11px] font-mono text-secondary shadow-xs pointer-events-none">
                  {item.tag}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
