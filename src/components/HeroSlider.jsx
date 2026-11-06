import React, { useState, useEffect, useRef, useCallback } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import Matter from 'matter-js'

/**
 * Slide Definitions matching the Reference Visual Specification
 */
export const SLIDES_DATA = [
  {
    id: 'portrait',
    type: 'portrait',
    navLabel: 'UI UX Designer',
    image: '/assets/portrait.jpg',
  },
  {
    id: 'expertise',
    type: 'expertise',
    navLabel: 'Experience',
    supportingText: '2+ Years',
    items: [
      {
        id: 'web-design',
        title: 'Web Design',
        icon: 'layout',
      },
      {
        id: 'ui-ux-design',
        title: 'UI UX Design',
        icon: 'layers',
      },
      {
        id: 'frontend',
        title: 'Frontend Implementation',
        icon: 'code',
      },
    ],
  },
  {
    id: 'clients',
    type: 'clients',
    navLabel: 'Clients',
    supportingText: 'Industries',
    industries: [
      {
        id: 'educational',
        title: 'Educational',
        clients: 'Aptech Aviation , Aptech , Balika Jalan',
        badgeType: 'education',
      },
      {
        id: 'real-estate',
        title: 'Real Estate',
        clients: 'PH Realtors, Elvan , Srijan',
        badgeType: 'real-estate',
      },
      {
        id: 'lottery',
        title: 'Lottery',
        clients: 'Vira Agency',
        badgeType: 'lottery',
      },
    ],
  },
]

/**
 * Custom SVG Icons used inside the translucent pills & badges
 */
function IconLayout() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  )
}

function IconLayers() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

function IconCode() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function EducationBadge() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#18181C] border border-white/10 flex items-center justify-center shrink-0 shadow-xs pointer-events-none">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#F5A623">
        <path d="M12 2L1 8l11 6 9-4.91V17h2V8L12 2zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
      </svg>
    </div>
  )
}

function RealEstateBadge() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#18181C] border border-white/10 flex items-center justify-center shrink-0 shadow-xs pointer-events-none">
      <span className="font-mono font-bold text-[11px] text-[#FF5B37] tracking-tight">
        IL
      </span>
    </div>
  )
}

function LotteryBadge() {
  return (
    <div className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center shrink-0 shadow-xs pointer-events-none">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#5A31F4">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
      </svg>
    </div>
  )
}

/**
 * InteractiveGravityCard
 *
 * Refined 2D physics simulation with Matter.js:
 * 1. Staggered initial gravity drop: Pills cascade naturally from top of card.
 * 2. Invisible separation: 6px invisible cushion around each pill body so colliding
 *    borders never touch or visually overlap.
 * 3. Collision-based background interaction:
 *    - In the air: Normal dark translucent background (`rgba(255,255,255,0.08)`).
 *    - Touching ground or another pill: Smoothly lightens (`rgba(255,255,255,0.22)` + soft lavender glow).
 *    - Airborne again: Smoothly darkens back. No mouse hover effect!
 * 4. Text overflow prevention: Pill widths dynamically fit content with strict box-border
 *    and truncate protection.
 * 5. Drag & Throw: Full pointer capture with momentum preservation on release.
 * 6. Protected supporting text: Physics floor reserves a safe 28px buffer above text.
 */
export function InteractiveGravityCard({
  items,
  supportingText,
  isActive = false,
  prefersReducedMotion = false,
  renderPill,
  onDragStateChange,
}) {
  const containerRef = useRef(null)
  const pillDomRefs = useRef([])
  const engineRef = useRef(null)
  const pillBodiesRef = useRef([])
  const boundariesRef = useRef(null)
  const activeDragRef = useRef(null)
  const animFrameIdRef = useRef(null)
  const isInitializedRef = useRef(false)
  const prevActiveRef = useRef(false)
  const [collidingIndices, setCollidingIndices] = useState(new Set())

  // Subtle invisible cushion between colliding bodies (10px total separation)
  const COLLISION_CUSHION = 10

  // Exact typographic and badge measurements matching live rendered content
  const getItemDefaultDimensions = useCallback((item) => {
    if (item.badgeType === 'education' || item.id === 'educational') {
      return { w: 264, h: 53 }
    }
    if (item.badgeType === 'real-estate' || item.id === 'real-estate') {
      return { w: 202, h: 53 }
    }
    if (item.badgeType === 'lottery' || item.id === 'lottery') {
      return { w: 136, h: 53 }
    }
    if (item.id === 'frontend') {
      return { w: 219, h: 42 }
    }
    if (item.id === 'ui-ux-design') {
      return { w: 144, h: 42 }
    }
    if (item.id === 'web-design') {
      return { w: 137, h: 42 }
    }
    return { w: 150, h: 46 }
  }, [])

  // Randomized drop positioning and entrance sequence
  const triggerDrop = useCallback(() => {
    if (!containerRef.current || pillBodiesRef.current.length === 0) return

    const W = containerRef.current.clientWidth || 340
    const n = pillBodiesRef.current.length

    // 1. Generate a new randomized entrance order permutation on each entrance
    const order = Array.from({ length: n }, (_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]]
    }

    // 2. Randomized horizontal lanes so pills don't align in synchronized vertical stacks
    const xSlots = [W * 0.32, W * 0.50, W * 0.68]
    for (let i = xSlots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [xSlots[i], xSlots[j]] = [xSlots[j], xSlots[i]]
    }

    // 3. Stagger vertical drop heights and assign organic initial velocities
    order.forEach((pillIdx, rank) => {
      const body = pillBodiesRef.current[pillIdx]
      if (!body) return

      const spawnX = Math.max(90, Math.min(W - 90, xSlots[rank] + (Math.random() - 0.5) * 20))
      const spawnY = -20 - rank * (60 + Math.random() * 25)
      const initialAngle = (Math.random() - 0.5) * 0.12

      Matter.Body.setPosition(body, { x: spawnX, y: spawnY })
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 1.0,
        y: 0,
      })
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.03)
      Matter.Body.setAngle(body, initialAngle)
    })
  }, [])

  // Synchronize physics body dimensions with true DOM dimensions
  const syncBodyDimensions = useCallback(() => {
    if (!containerRef.current || pillBodiesRef.current.length === 0) return

    items.forEach((item, idx) => {
      const el = pillDomRefs.current[idx]
      const body = pillBodiesRef.current[idx]
      if (!el || !body) return

      const defaultDim = getItemDefaultDimensions(item)
      const w = el.offsetWidth > 50 ? el.offsetWidth : defaultDim.w
      const h = el.offsetHeight > 30 ? el.offsetHeight : defaultDim.h
      const bodyW = w + COLLISION_CUSHION
      const bodyH = h + COLLISION_CUSHION

      const currentW = body._unrotatedW || bodyW
      const currentH = body._unrotatedH || bodyH

      if (Math.abs(currentW - bodyW) > 3 || Math.abs(currentH - bodyH) > 3) {
        const scaleX = bodyW / currentW
        const scaleY = bodyH / currentH
        const currentAngle = body.angle
        Matter.Body.setAngle(body, 0)
        Matter.Body.scale(body, scaleX, scaleY)
        Matter.Body.setAngle(body, currentAngle)
        body._unrotatedW = bodyW
        body._unrotatedH = bodyH
      }
    })
  }, [COLLISION_CUSHION, getItemDefaultDimensions, items])

  // Pointer drag event handlers for each pill
  const handlePillPointerDown = (idx, e) => {
    e.preventDefault()
    e.stopPropagation()

    const body = pillBodiesRef.current[idx]
    if (!body || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const pointerX = e.clientX - rect.left
    const pointerY = e.clientY - rect.top

    const dragInfo = {
      idx,
      body,
      pointerId: e.pointerId,
      target: e.currentTarget,
      offsetX: body.position.x - pointerX,
      offsetY: body.position.y - pointerY,
      prevX: pointerX,
      prevY: pointerY,
      lastTime: performance.now(),
      vxHistory: [],
      vyHistory: [],
    }

    activeDragRef.current = dragInfo
    if (onDragStateChange) onDragStateChange(true)

    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch (_) { }
  }

  const handlePillPointerMove = (idx, e) => {
    const drag = activeDragRef.current
    if (!drag || drag.idx !== idx || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const pointerX = e.clientX - rect.left
    const pointerY = e.clientY - rect.top

    const now = performance.now()
    const dt = Math.max(now - drag.lastTime, 8)
    drag.lastTime = now

    const instantVx = Math.max(-20, Math.min(20, ((pointerX - drag.prevX) / dt) * 16.67))
    const instantVy = Math.max(-20, Math.min(20, ((pointerY - drag.prevY) / dt) * 16.67))

    drag.prevX = pointerX
    drag.prevY = pointerY

    drag.vxHistory.push(instantVx)
    drag.vyHistory.push(instantVy)
    if (drag.vxHistory.length > 4) {
      drag.vxHistory.shift()
      drag.vyHistory.shift()
    }

    const newX = pointerX + drag.offsetX
    const newY = pointerY + drag.offsetY

    const W = rect.width
    const H = rect.height
    const floorTop = H - 76
    const el = pillDomRefs.current[idx]
    const w = el ? el.offsetWidth : 140
    const h = el ? el.offsetHeight : 42

    const clampedX = Math.max(w / 2 + 10, Math.min(W - w / 2 - 10, newX))
    const clampedY = Math.max(h / 2 + 10, Math.min(floorTop - h / 2, newY))

    Matter.Body.setPosition(drag.body, { x: clampedX, y: clampedY })
    Matter.Body.setVelocity(drag.body, { x: instantVx, y: instantVy })

    if (el) {
      const deg = ((drag.body.angle * 180) / Math.PI).toFixed(2)
      el.style.transform = `translate3d(${(clampedX - w / 2).toFixed(2)}px, ${(clampedY - h / 2).toFixed(2)}px, 0) rotate(${deg}deg)`
    }
  }

  const handlePillPointerUp = (idx, e) => {
    const drag = activeDragRef.current
    if (!drag || drag.idx !== idx) return

    if (drag.target && drag.target.hasPointerCapture && drag.target.hasPointerCapture(drag.pointerId)) {
      try {
        drag.target.releasePointerCapture(drag.pointerId)
      } catch (_) { }
    }

    const avgVx = drag.vxHistory.length > 0
      ? drag.vxHistory.reduce((a, b) => a + b, 0) / drag.vxHistory.length
      : 0
    const avgVy = drag.vyHistory.length > 0
      ? drag.vyHistory.reduce((a, b) => a + b, 0) / drag.vyHistory.length
      : 0

    const speed = Math.hypot(avgVx, avgVy)
    const maxThrowSpeed = 22
    const scale = speed > maxThrowSpeed ? maxThrowSpeed / speed : 1

    Matter.Body.setVelocity(drag.body, {
      x: avgVx * scale,
      y: avgVy * scale,
    })

    Matter.Body.setAngularVelocity(drag.body, (avgVx / 20) * 0.15)

    activeDragRef.current = null
    if (onDragStateChange) onDragStateChange(false)
  }

  // Initialize Matter.js engine & bodies
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const W = container.clientWidth || 340
    const H = container.clientHeight || 450
    const floorY = H - 76

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.0016 },
    })
    engine.positionIterations = 20
    engine.velocityIterations = 20
    engineRef.current = engine

    const floor = Matter.Bodies.rectangle(W / 2, floorY + 50, W * 3, 100, {
      isStatic: true,
      friction: 0.8,
      restitution: 0.2,
      label: 'floor',
    })
    const leftWall = Matter.Bodies.rectangle(-50, H / 2, 100, H * 3, {
      isStatic: true,
      friction: 0.4,
      restitution: 0.2,
      label: 'leftWall',
    })
    const rightWall = Matter.Bodies.rectangle(W + 50, H / 2, 100, H * 3, {
      isStatic: true,
      friction: 0.4,
      restitution: 0.2,
      label: 'rightWall',
    })
    const ceiling = Matter.Bodies.rectangle(W / 2, -200, W * 3, 100, {
      isStatic: true,
      friction: 0.4,
      restitution: 0.2,
      label: 'ceiling',
    })

    Matter.Composite.add(engine.world, [floor, leftWall, rightWall, ceiling])
    boundariesRef.current = { floor, leftWall, rightWall, ceiling }

    // Dynamic Pill Bodies with invisible separation cushion
    const bodies = items.map((item, idx) => {
      const el = pillDomRefs.current[idx]
      const defaultDim = getItemDefaultDimensions(item)
      const w = el && el.offsetWidth > 50 ? el.offsetWidth : defaultDim.w
      const h = el && el.offsetHeight > 30 ? el.offsetHeight : defaultDim.h

      // Physical body has invisible collision cushion
      const bodyW = w + COLLISION_CUSHION
      const bodyH = h + COLLISION_CUSHION

      const spawnX = idx === 0 ? W * 0.32 : idx === 1 ? W * 0.68 : W * 0.50
      const spawnY = 40 - idx * 80
      const initialAngle = (idx % 2 === 0 ? 0.04 : -0.05) + (Math.random() - 0.5) * 0.04

      const body = Matter.Bodies.rectangle(spawnX, spawnY, bodyW, bodyH, {
        chamfer: { radius: bodyH / 2 },
        restitution: 0.28,
        friction: 0.6,
        frictionAir: 0.015,
        density: 0.002,
        angle: initialAngle,
        label: `pill-${item.id}`,
      })
      body._unrotatedW = bodyW
      body._unrotatedH = bodyH
      return body
    })

    Matter.Composite.add(engine.world, bodies)
    pillBodiesRef.current = bodies

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width
        const newH = entry.contentRect.height
        if (newW > 0 && newH > 0 && boundariesRef.current) {
          const newFloorY = newH - 76
          Matter.Body.setPosition(boundariesRef.current.floor, { x: newW / 2, y: newFloorY + 50 })
          Matter.Body.setPosition(boundariesRef.current.leftWall, { x: -50, y: newH / 2 })
          Matter.Body.setPosition(boundariesRef.current.rightWall, { x: newW + 50, y: newH / 2 })
          Matter.Body.setPosition(boundariesRef.current.ceiling, { x: newW / 2, y: -200 })
          syncBodyDimensions()
        }
      }
    })
    resizeObserver.observe(container)

    // Re-verify dimensions as soon as web fonts (Geist) are loaded
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        syncBodyDimensions()
      })
    }

    isInitializedRef.current = true
    if (isActive && !prefersReducedMotion) {
      triggerDrop()
    }

    bodies.forEach((body, idx) => {
      const el = pillDomRefs.current[idx]
      if (el) {
        const w = el.offsetWidth || 140
        const h = el.offsetHeight || 42
        const x = (body.position.x - w / 2).toFixed(2)
        const y = (body.position.y - h / 2).toFixed(2)
        const deg = ((body.angle * 180) / Math.PI).toFixed(2)
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`
      }
    })

    return () => {
      resizeObserver.disconnect()
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
      Matter.Composite.clear(engine.world, false)
      Matter.Engine.clear(engine)
    }
  }, [isActive, items, prefersReducedMotion, syncBodyDimensions, triggerDrop])

  useEffect(() => {
    if (isActive && isInitializedRef.current) {
      syncBodyDimensions()
      if (!prevActiveRef.current && !prefersReducedMotion) {
        triggerDrop()
      }
    }
    prevActiveRef.current = isActive
  }, [isActive, prefersReducedMotion, syncBodyDimensions, triggerDrop])

  // Physics simulation loop with collision-based background interaction
  useEffect(() => {
    if (!isActive || prefersReducedMotion) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
        animFrameIdRef.current = null
      }
      return
    }

    let lastTime = performance.now()

    const loop = (currentTime) => {
      const dtMs = currentTime - lastTime
      lastTime = currentTime

      if (engineRef.current && containerRef.current) {
        const stepMs = Math.min(dtMs, 32)
        // Two sub-steps for stable high-frequency collision solving without tunneling
        Matter.Engine.update(engineRef.current, stepMs / 2)
        Matter.Engine.update(engineRef.current, stepMs / 2)

        const W = containerRef.current.clientWidth || 340
        const H = containerRef.current.clientHeight || 450
        const floorTop = H - 76

        // Detect active physical collisions for collision-based background effect
        const activePairs = engineRef.current.pairs.list || []
        const currentCollisions = new Set()

        for (let p = 0; p < activePairs.length; p++) {
          const pair = activePairs[p]
          if (!pair.isActive) continue
          const { bodyA, bodyB } = pair
          const isFloor = bodyA.label === 'floor' || bodyB.label === 'floor'
          const idxA = pillBodiesRef.current.indexOf(bodyA)
          const idxB = pillBodiesRef.current.indexOf(bodyB)

          if (idxA !== -1 && (isFloor || idxB !== -1)) currentCollisions.add(idxA)
          if (idxB !== -1 && (isFloor || idxA !== -1)) currentCollisions.add(idxB)
        }

        // Boundary containment and DOM update
        pillBodiesRef.current.forEach((body, idx) => {
          const el = pillDomRefs.current[idx]
          if (el && body) {
            const defaultDim = getItemDefaultDimensions(items[idx])
            const w = el.offsetWidth > 50 ? el.offsetWidth : defaultDim.w
            const h = el.offsetHeight > 30 ? el.offsetHeight : defaultDim.h

            if (!activeDragRef.current || activeDragRef.current.idx !== idx) {
              // Gentle upright leveling torque to keep pills natural and readable
              const angle = body.angle
              body.torque += -angle * 0.006

              // Limit excessive rotation to keep pills stable and easily readable
              if (Math.abs(body.angle) > 0.45) {
                Matter.Body.setAngle(body, Math.sign(body.angle) * 0.45)
                Matter.Body.setAngularVelocity(body, body.angularVelocity * 0.5)
              }

              // Content-aware bounding box half-spans taking rotation into account
              const cosA = Math.abs(Math.cos(body.angle))
              const sinA = Math.abs(Math.sin(body.angle))
              const halfSpanX = (w / 2) * cosA + (h / 2) * sinA
              const halfSpanY = (w / 2) * sinA + (h / 2) * cosA

              const minX = halfSpanX + 6
              const maxX = W - halfSpanX - 6
              const maxY = floorTop - halfSpanY

              if (body.position.y > maxY) {
                Matter.Body.setPosition(body, { x: body.position.x, y: maxY })
                Matter.Body.setVelocity(body, {
                  x: body.velocity.x * 0.8,
                  y: -Math.abs(body.velocity.y) * 0.2,
                })
              }
              if (body.position.x < minX) {
                Matter.Body.setPosition(body, { x: minX, y: body.position.y })
                Matter.Body.setVelocity(body, {
                  x: Math.abs(body.velocity.x) * 0.5,
                  y: body.velocity.y,
                })
              } else if (body.position.x > maxX) {
                Matter.Body.setPosition(body, { x: maxX, y: body.position.y })
                Matter.Body.setVelocity(body, {
                  x: -Math.abs(body.velocity.x) * 0.5,
                  y: body.velocity.y,
                })
              }
            }

            const x = (body.position.x - w / 2).toFixed(2)
            const y = (body.position.y - h / 2).toFixed(2)
            const deg = ((body.angle * 180) / Math.PI).toFixed(2)
            el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`

            // Update physical collision styling directly in DOM (airborne vs grounded/colliding)
            const isTouching = currentCollisions.has(idx)
            el.setAttribute('data-colliding', isTouching ? 'true' : 'false')
            if (el.firstElementChild) {
              el.firstElementChild.setAttribute('data-colliding', isTouching ? 'true' : 'false')
            }
          }
        })
      }

      animFrameIdRef.current = requestAnimationFrame(loop)
    }

    animFrameIdRef.current = requestAnimationFrame(loop)

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
        animFrameIdRef.current = null
      }
    }
  }, [isActive, prefersReducedMotion])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-card overflow-hidden border border-white/10 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.4)] select-none touch-none"
      style={{
        backgroundColor: 'var(--color-dark-card, #0E0E10)',
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '28px 28px',
      }}
    >
      {/* Draggable & Falling Physics Pills */}
      {items.map((item, idx) => (
        <div
          key={item.id}
          ref={(el) => (pillDomRefs.current[idx] = el)}
          onPointerDown={(e) => handlePillPointerDown(idx, e)}
          onPointerMove={(e) => handlePillPointerMove(idx, e)}
          onPointerUp={(e) => handlePillPointerUp(idx, e)}
          onPointerCancel={(e) => handlePillPointerUp(idx, e)}
          className="absolute top-0 left-0 will-change-transform select-none cursor-grab active:cursor-grabbing pointer-events-auto touch-none"
          style={{
            transformOrigin: 'center center',
          }}
        >
          {renderPill(item, idx)}
        </div>
      ))}

      {/* Stationary Supporting Text at the Bottom (Protected from physics) */}
      <div className="absolute bottom-6 inset-x-0 flex items-center justify-center pointer-events-none select-none z-10">
        <span className="font-sans font-semibold text-[24px] text-white tracking-tight leading-none drop-shadow-sm">
          {supportingText}
        </span>
      </div>
    </div>
  )
}

/**
 * AnimatedSlidingNav
 *
 * Implements a true horizontal sliding navigation matching user timeline specification:
 * - Exactly 3 navigation items visible at any given time (Left: previous, Center: active, Right: next).
 * - Phase A (0-4.5s): Center item active, illuminated pill with lavender glow, progress bar fills.
 * - Phase B (4.5-5.0s): Glow and pill background fade out over 500ms; item becomes visually neutral before moving.
 * - Phase C (5.0-5.5s): Track slides smoothly from right to left (along with 3D card flip).
 * - Phase D (5.5-6.0s): Settled in center, background & lavender glow fade in over 500ms (illumination).
 * - Phase E (4s hold): Holds stably and repeats for next slide.
 */
/**
 * AnimatedSlidingNav
 *
 * Reusable sliding bottom navigation track for the hero slider:
 * - Exactly 3 navigation items are visible at any time: previous (left), active (center), next (right).
 * - Continuous horizontal sliding track with edge masking so incoming labels enter from the right
 *   and outgoing labels exit on the left without popping or duplicate text.
 * - Center active pill remains precisely centered at all times (zero horizontal shift).
 * - Fades glow and pill background to neutral before sliding; illuminates upon arrival.
 */
function AnimatedSlidingNav({
  slides,
  activeIndex,
  onSelectPrev,
  onSelectNext,
  trackRef,
  progressFillRef,
  activePillRef,
  glowRef,
  pillBgRef,
  iconRef,
  centerTextRef,
}) {
  const total = slides.length
  const SLOT_WIDTH = 152

  // 5 slots (-2, -1, 0, 1, 2) allow a continuous track where:
  // - Slot -1 is previous, Slot 0 is center/active, Slot 1 is next.
  // - Slot 2 enters smoothly from right, Slot -2 exits smoothly to left.
  const offsets = [-2, -1, 0, 1, 2]

  const slots = offsets.map((offset) => {
    const normIdx = ((activeIndex + offset) % total + total) % total
    return {
      offset,
      slide: slides[normIdx],
      normIdx,
    }
  })

  return (
    <div
      data-testid="sliding-nav-container"
      className="relative w-full max-w-[480px] h-[72px] flex items-center justify-center select-none overflow-visible"
    >
      {/* ============================================================ */}
      {/* CONTINUOUS HORIZONTAL SLIDING TRACK                           */}
      {/* Masked edges so only 3 items are visible in frame            */}
      {/* Every pill is content-hugging with px-[12px] py-[8px] gap-[8px] */}
      {/* Unclipped vertical overflow allows lavender glow & shadow to bloom */}
      {/* ============================================================ */}
      <div
        className="relative z-10 w-full h-[140px] -my-[34px] flex items-center justify-center overflow-visible pointer-events-none"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
        }}
      >
        <div
          ref={trackRef}
          data-testid="sliding-nav-track"
          className="relative flex items-center justify-center will-change-transform h-full pointer-events-auto"
          style={{ width: '0px' }}
        >
          {slots.map(({ offset, slide }) => {
            const isCenter = offset === 0

            return (
              <div
                key={offset}
                data-testid={`nav-slot-${offset}`}
                className="absolute flex items-center justify-center whitespace-nowrap"
                style={{
                  left: `${offset * SLOT_WIDTH}px`,
                  transform: 'translateX(-50%)',
                }}
              >
                {isCenter ? (
                  <div
                    ref={activePillRef}
                    data-testid="nav-active-pill"
                    className="relative inline-flex items-center justify-center px-[12px] py-[8px] gap-[8px] rounded-full font-sans tracking-tight whitespace-nowrap select-none focus:outline-none z-20 cursor-default"
                  >
                    {/* Phase A & D: Ambient diffused lavender glow beneath active pill */}
                    <div
                      ref={glowRef}
                      data-testid="nav-active-glow"
                      className="absolute -inset-x-3 -bottom-4 top-1 rounded-full pointer-events-none -z-10 will-change-[opacity,transform,filter]"
                      style={{
                        background:
                          'radial-gradient(ellipse at 50% 65%, rgba(163, 144, 251, 0.38) 0%, rgba(163, 144, 251, 0.16) 55%, transparent 75%)',
                        filter: 'blur(8px)',
                        opacity: 0,
                        transform: 'scale(0.85)',
                      }}
                    />

                    {/* White Pill Capsule Background with Soft Drop Shadow (borderless) */}
                    <div
                      ref={pillBgRef}
                      data-testid="nav-active-bg"
                      className="absolute inset-0 rounded-full bg-white pointer-events-none will-change-[opacity] z-0"
                      style={{
                        boxShadow:
                          '0 10px 30px -2px rgba(163, 144, 251, 0.32), 0 18px 45px -4px rgba(163, 144, 251, 0.18), 0 2px 10px rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        outline: 'none',
                        opacity: 0,
                      }}
                    />

                    {/* 4.5-Second Linear Progress Fill (clipped inside pill boundary) */}
                    <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-0">
                      <div
                        ref={progressFillRef}
                        data-testid="nav-progress-fill"
                        className="h-full bg-accent-subtle/80 pointer-events-none rounded-full will-change-transform"
                        style={{
                          transformOrigin: 'left center',
                          transform: 'scaleX(0)',
                        }}
                      />
                    </div>

                    {/* Purple Circle Arrow Icon */}
                    <span
                      ref={iconRef}
                      data-testid="nav-active-icon"
                      className="relative z-10 w-[20px] h-[20px] rounded-full bg-accent text-white inline-flex items-center justify-center shrink-0 pointer-events-none shadow-xs will-change-[opacity,transform]"
                      style={{ opacity: 0 }}
                    >
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="block pointer-events-none select-none"
                      >
                        <path d="M1.5 4h5M4 1.5l2.5 2.5L4 6.5" />
                      </svg>
                    </span>

                    {/* Center active text label */}
                    <span
                      ref={centerTextRef}
                      className="relative z-10 text-[14px] sm:text-[15px] font-normal text-primary leading-none will-change-[color]"
                    >
                      {slide.navLabel}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (offset < 0) onSelectPrev()
                      if (offset > 0) onSelectNext()
                    }}
                    className="relative inline-flex items-center justify-center px-[12px] py-[8px] rounded-full font-sans tracking-tight whitespace-nowrap select-none transition-colors duration-200 cursor-pointer focus:outline-none z-20 text-[14px] sm:text-[15px] font-normal text-muted hover:text-primary leading-none"
                  >
                    <span>{slide.navLabel}</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/**
 * HeroSlider
 *
 * A reusable, 3D rotating information card slider for the portfolio hero section.
 * Features:
 * - Proper 3D card rotation: Physical card flip around Y-axis with perspective & backface visibility (no zero-opacity fading).
 * - Genuine sliding bottom navigation: Track slides horizontally in perfect sync with the card.
 * - Collision-based background interaction: Airborne pills are dark; colliding/grounded pills lighten up.
 * - Subtle invisible spacing: 6px cushion keeps colliding visual borders separated.
 * - Text overflow prevention: Content-aware widths with truncate protection.
 * - Protected supporting text: "2+ Years" and "Industries" protected below physics floor.
 */
export default function HeroSlider({
  slides = SLIDES_DATA,
  className = '',
  autoplayInterval = 5000,
  onSlideChange,
  isLoaded = true,
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isPillDragging, setIsPillDragging] = useState(false)
  const isHoveredRef = useRef(false)
  const isPillDraggingRef = useRef(false)
  const isAnimating = useRef(false)
  const cardRefs = useRef([])
  const stage3dRef = useRef(null)
  const navTrackRef = useRef(null)
  const activePillRef = useRef(null)
  const glowRef = useRef(null)
  const pillBgRef = useRef(null)
  const iconRef = useRef(null)
  const centerTextRef = useRef(null)
  const progressFillRef = useRef(null)
  const masterTlRef = useRef(null)
  const touchStartX = useRef(null)

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

  // Portrait card initial entrance animation:
  // - Drops from above simulating gravity
  // - Spring overshoot and rebound upon landing before settling into resting position
  // - Plays once on initial load, respects prefers-reduced-motion
  const hasMountedEntrance = useRef(false)
  useEffect(() => {
    if (!isLoaded || prefersReducedMotion || hasMountedEntrance.current) return
    const card = cardRefs.current[0]
    if (card) {
      hasMountedEntrance.current = true
      gsap.fromTo(
        card,
        { y: -130, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          delay: 0.15,
          ease: 'back.out(1.4)',
          clearProps: 'transform',
        }
      )
    }
  }, [isLoaded, prefersReducedMotion])

  const total = slides.length
  const SLOT_WIDTH = 152

  // ============================================================
  // UNIFIED 5-PHASE REPEATING TIMELINE SEQUENCE:
  // Phase D (0.0s - 0.5s): Illumination of active pill & glow (500ms)
  // Phase A/E (0.0s - 4.5s): Center item active, linear progress fill across 4.5s
  // Phase B (4.5s - 5.0s): Glow & pill background fade out over 500ms; becomes neutral
  // Phase C (5.0s - 5.5s): Horizontal track slide & 3D card rotation (500ms)
  // At 5.5s: Update activeIndex -> triggers next slide's illumination
  // ============================================================
  const startSlideCycle = useCallback(
    (currentIdx) => {
      if (masterTlRef.current) {
        masterTlRef.current.kill()
        masterTlRef.current = null
      }

      const nextIdx = (currentIdx + 1) % total
      const fromCard = cardRefs.current[currentIdx]
      const toCard = cardRefs.current[nextIdx]
      const glowEl = glowRef.current
      const pillBgEl = pillBgRef.current
      const iconEl = iconRef.current
      const centerTextEl = centerTextRef.current
      const progressFillEl = progressFillRef.current
      const navTrackEl = navTrackRef.current

      // Reset initial visual state
      if (progressFillEl) {
        gsap.set(progressFillEl, { scaleX: 0, opacity: 1, transformOrigin: 'left center' })
      }
      if (navTrackEl) {
        gsap.set(navTrackEl, { x: 0 })
      }

      const tl = gsap.timeline({
        paused: isHoveredRef.current || isPillDraggingRef.current,
      })
      masterTlRef.current = tl

      if (prefersReducedMotion) {
        if (glowEl) gsap.set(glowEl, { opacity: 1 })
        if (pillBgEl) gsap.set(pillBgEl, { opacity: 1 })
        if (iconEl) gsap.set(iconEl, { opacity: 1, scale: 1 })
        if (centerTextEl) gsap.set(centerTextEl, { color: '#171717' })
        if (progressFillEl) {
          tl.to(progressFillEl, { scaleX: 1, duration: 4.5, ease: 'none' }, 0)
        }
        tl.call(() => {
          if (fromCard && toCard) {
            gsap.to(fromCard, { opacity: 0, duration: 0.3 })
            gsap.to(toCard, {
              opacity: 1,
              duration: 0.3,
              onComplete: () => {
                setActiveIndex(nextIdx)
                if (onSlideChange) onSlideChange(nextIdx, slides[nextIdx])
              },
            })
          } else {
            setActiveIndex(nextIdx)
          }
        }, null, 5.0)
        return
      }

      // ------------------------------------------------------------
      // Phase D: New Active State Illumination (0.0s - 0.3s, 300ms)
      // "When the next navigation text moves into the center position and becomes active,
      // its lavender glow appears too abruptly. Add a smooth 300 ms fade-in transition to the glow.
      // Animate the glow's opacity and intensity gradually from 0 to its final state."
      // ------------------------------------------------------------
      if (glowEl) {
        tl.fromTo(
          glowEl,
          { opacity: 0, scale: 0.85, filter: 'blur(8px)' },
          { opacity: 1, scale: 1, filter: 'blur(14px)', duration: 0.3, ease: 'power2.out' },
          0
        )
      }
      if (pillBgEl) {
        tl.fromTo(
          pillBgEl,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' },
          0
        )
      }
      if (iconEl) {
        tl.fromTo(
          iconEl,
          { opacity: 0, scale: 0.75 },
          { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
          0
        )
      }
      if (centerTextEl) {
        tl.fromTo(
          centerTextEl,
          { color: '#8E8E93' },
          { color: '#171717', duration: 0.3, ease: 'power2.out' },
          0
        )
      }

      // ------------------------------------------------------------
      // Phase A / E: Hold & Linear Progress Fill (0.0s - 4.5s)
      // "The center navigation item is active. Its background gradually fills...
      // The active state stays stable and centered."
      // ------------------------------------------------------------
      if (progressFillEl) {
        tl.fromTo(
          progressFillEl,
          { scaleX: 0, opacity: 1 },
          { scaleX: 1, duration: 4.5, ease: 'none' },
          0
        )
      }

      // ------------------------------------------------------------
      // Phase B: Glow Fade-Out (4.5s - 5.0s, 500ms)
      // "At 4.5 seconds, begin fading out the active pill's background and glow.
      // Complete the fade within 500ms. The pill becomes visually neutral before the navigation starts moving."
      // ------------------------------------------------------------
      if (glowEl) {
        tl.to(
          glowEl,
          { opacity: 0, scale: 0.85, filter: 'blur(8px)', duration: 0.5, ease: 'power2.inOut' },
          4.5
        )
      }
      if (pillBgEl) {
        tl.to(
          pillBgEl,
          { opacity: 0, duration: 0.5, ease: 'power2.inOut' },
          4.5
        )
      }
      if (iconEl) {
        tl.to(
          iconEl,
          { opacity: 0, scale: 0.75, duration: 0.5, ease: 'power2.inOut' },
          4.5
        )
      }
      if (progressFillEl) {
        tl.to(
          progressFillEl,
          { opacity: 0, duration: 0.5, ease: 'power2.inOut' },
          4.5
        )
      }
      if (centerTextEl) {
        tl.to(
          centerTextEl,
          { color: '#8E8E93', duration: 0.5, ease: 'power2.inOut' },
          4.5
        )
      }

      // ------------------------------------------------------------
      // Phase C: Horizontal Navigation Transition + 3D Card Rotation (5.0s - 5.5s)
      // "The three navigation items smoothly move from right to left.
      // The next item enters from the right and settles into the center.
      // The previous active item moves toward the left."
      // ------------------------------------------------------------
      if (fromCard && toCard) {
        tl.call(() => {
          gsap.set(toCard, { zIndex: 10, opacity: 1, rotateY: 180, pointerEvents: 'none' })
          gsap.set(fromCard, { zIndex: 9, opacity: 1, rotateY: 0, pointerEvents: 'none' })
        }, null, 4.98)

        tl.to(fromCard, { rotateY: -180, duration: 0.5, ease: 'power2.inOut' }, 5.0)
        tl.to(toCard, { rotateY: 0, duration: 0.5, ease: 'power2.inOut' }, 5.0)
        if (stage3dRef.current) {
          tl.to(
            stage3dRef.current,
            { z: -40, duration: 0.25, ease: 'power1.out', yoyo: true, repeat: 1 },
            5.0
          )
        }
      }

      if (navTrackEl) {
        tl.to(
          navTrackEl,
          { x: -SLOT_WIDTH, duration: 0.5, ease: 'power2.inOut' },
          5.0
        )
      }

      // Complete cycle at 5.5s: Atomically flush React DOM update and reset track position
      tl.call(() => {
        if (fromCard) gsap.set(fromCard, { zIndex: 0, opacity: 0, clearProps: 'transform' })
        if (toCard) gsap.set(toCard, { zIndex: 10, opacity: 1, pointerEvents: 'auto', clearProps: 'transform' })
        if (stage3dRef.current) gsap.set(stage3dRef.current, { clearProps: 'transform' })

        flushSync(() => {
          setActiveIndex(nextIdx)
        })
        if (navTrackEl) gsap.set(navTrackEl, { x: 0 })
        if (onSlideChange) onSlideChange(nextIdx, slides[nextIdx])
      }, null, 5.5)
    },
    [onSlideChange, prefersReducedMotion, slides, total]
  )

  // User click or gesture navigation
  const navigateTo = useCallback(
    (targetIndex, direction = 1) => {
      if (isAnimating.current || targetIndex === activeIndex || isPillDragging) return
      isAnimating.current = true

      if (masterTlRef.current) {
        masterTlRef.current.kill()
        masterTlRef.current = null
      }

      const fromCard = cardRefs.current[activeIndex]
      const toCard = cardRefs.current[targetIndex]
      const glowEl = glowRef.current
      const pillBgEl = pillBgRef.current
      const iconEl = iconRef.current
      const centerTextEl = centerTextRef.current
      const progressFillEl = progressFillRef.current
      const navTrackEl = navTrackRef.current

      if (prefersReducedMotion) {
        if (fromCard && toCard) {
          gsap.to(fromCard, { opacity: 0, duration: 0.3 })
          gsap.to(toCard, {
            opacity: 1,
            duration: 0.3,
            onComplete: () => {
              isAnimating.current = false
              setActiveIndex(targetIndex)
              if (onSlideChange) onSlideChange(targetIndex, slides[targetIndex])
            },
          })
        } else {
          isAnimating.current = false
          setActiveIndex(targetIndex)
        }
        return
      }

      const dir = direction > 0 ? 1 : -1

      // Responsive Phase B fade-out (200ms) on direct click
      const quickTl = gsap.timeline({
        onComplete: () => {
          if (fromCard && toCard) {
            gsap.set(toCard, { zIndex: 10, opacity: 1, rotateY: dir > 0 ? 180 : -180, pointerEvents: 'none' })
            gsap.set(fromCard, { zIndex: 9, opacity: 1, rotateY: 0, pointerEvents: 'none' })
          }

          const slideTl = gsap.timeline({
            onComplete: () => {
              if (fromCard) gsap.set(fromCard, { zIndex: 0, opacity: 0, clearProps: 'transform' })
              if (toCard) gsap.set(toCard, { zIndex: 10, opacity: 1, pointerEvents: 'auto', clearProps: 'transform' })
              if (stage3dRef.current) gsap.set(stage3dRef.current, { clearProps: 'transform' })

              flushSync(() => {
                setActiveIndex(targetIndex)
              })
              if (navTrackEl) gsap.set(navTrackEl, { x: 0 })
              isAnimating.current = false
              if (onSlideChange) onSlideChange(targetIndex, slides[targetIndex])
            },
          })

          if (navTrackEl) {
            slideTl.to(navTrackEl, { x: dir > 0 ? -SLOT_WIDTH : SLOT_WIDTH, duration: 0.5, ease: 'power2.inOut' }, 0)
          }
          if (fromCard && toCard) {
            slideTl.to(fromCard, { rotateY: dir > 0 ? -180 : 180, duration: 0.5, ease: 'power2.inOut' }, 0)
            slideTl.to(toCard, { rotateY: 0, duration: 0.5, ease: 'power2.inOut' }, 0)
            if (stage3dRef.current) {
              slideTl.to(stage3dRef.current, { z: -40, duration: 0.25, ease: 'power1.out', yoyo: true, repeat: 1 }, 0)
            }
          }
        },
      })

      if (glowEl) {
        quickTl.to(glowEl, { opacity: 0, scale: 0.85, filter: 'blur(8px)', duration: 0.2, ease: 'power2.inOut' }, 0)
      }
      if (pillBgEl) {
        quickTl.to(pillBgEl, { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, 0)
      }
      if (iconEl) {
        quickTl.to(iconEl, { opacity: 0, scale: 0.75, duration: 0.2, ease: 'power2.inOut' }, 0)
      }
      if (progressFillEl) {
        quickTl.to(progressFillEl, { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, 0)
      }
      if (centerTextEl) {
        quickTl.to(centerTextEl, { color: '#8E8E93', duration: 0.2, ease: 'power2.inOut' }, 0)
      }
    },
    [activeIndex, isPillDragging, onSlideChange, prefersReducedMotion, slides]
  )

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % total
    navigateTo(nextIdx, 1)
  }, [activeIndex, navigateTo, total])

  const handlePrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + total) % total
    navigateTo(prevIdx, -1)
  }, [activeIndex, navigateTo, total])

  // Run the repeating 5-second slide cycle
  useEffect(() => {
    if (!isLoaded || isAnimating.current) return
    startSlideCycle(activeIndex)

    return () => {
      if (masterTlRef.current) {
        masterTlRef.current.kill()
        masterTlRef.current = null
      }
    }
  }, [activeIndex, isLoaded, startSlideCycle])

  // Synchronized pause/resume for hover and physics dragging
  useEffect(() => {
    isHoveredRef.current = isHovered
    isPillDraggingRef.current = isPillDragging
    if (masterTlRef.current) {
      if (isHovered || isPillDragging) {
        masterTlRef.current.pause()
      } else {
        masterTlRef.current.resume()
      }
    }
  }, [isHovered, isPillDragging])

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e) => {
    if (e.target.closest('.cursor-grab')) return
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchEndX - touchStartX.current
    if (diff > 45) {
      handlePrev()
    } else if (diff < -45) {
      handleNext()
    }
    touchStartX.current = null
  }

  return (
    <div
      className={`relative w-full flex flex-col items-center select-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ============================================================ */}
      {/* 3D PHYSICAL CARD ROTATION CONTAINER                         */}
      {/* (Hover pauses animation ONLY when directly over the card)   */}
      {/* ============================================================ */}
      <div
        data-testid="hero-card-container"
        className="relative w-[295px] h-[413px]"
        style={{ perspective: '1200px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={stage3dRef}
          data-testid="hero-card-stage"
          className="relative w-full h-full will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {slides.map((slide, index) => {
            const isActive = index === activeIndex

            return (
              <div
                key={slide.id}
                ref={(el) => (cardRefs.current[index] = el)}
                data-testid={`hero-card-${index}`}
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                className={`absolute inset-0 w-full h-full rounded-[20px] overflow-hidden ${isActive
                  ? 'z-10 opacity-100 pointer-events-auto'
                  : 'z-0 opacity-0 pointer-events-none'
                  }`}
              >
                {/* ---------------------------------------------------- */}
                {/* SLIDE 1: Monochromatic Portrait                      */}
                {/* ---------------------------------------------------- */}
                {slide.type === 'portrait' && (
                  <div className="relative w-full h-full bg-surface rounded-card overflow-hidden border border-border-subtle shadow-card-light">
                    <img
                      src={slide.image || '/assets/portrait.jpg'}
                      alt="Sourav Haldar portrait"
                      className="w-full h-full object-cover object-center select-none pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* SLIDE 2: Expertise with Collision Physics & Spacing  */}
                {/* ---------------------------------------------------- */}
                {slide.type === 'expertise' && (
                  <InteractiveGravityCard
                    items={slide.items}
                    supportingText={slide.supportingText || '2+ Years'}
                    isActive={isActive}
                    prefersReducedMotion={prefersReducedMotion}
                    onDragStateChange={setIsPillDragging}
                    renderPill={(item) => (
                      <div className="rounded-full px-[14px] py-[8px] flex items-center gap-[10px] backdrop-blur-md border border-white/10 w-fit whitespace-nowrap box-border bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.07)_50%,rgba(163,144,251,0.15)_100%)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(163,144,251,0.2),inset_0_1px_1px_rgba(255,255,255,0.08)] data-[colliding=true]:bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.20)_45%,rgba(163,144,251,0.32)_100%)] data-[colliding=true]:border-white/30 data-[colliding=true]:shadow-[0_4px_20px_-2px_rgba(163,144,251,0.28),inset_0_-1px_3px_rgba(163,144,251,0.35),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-[background,border-color,box-shadow] duration-200">
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white shrink-0 shadow-xs pointer-events-none select-none">
                          {item.icon === 'layout' && <IconLayout />}
                          {item.icon === 'layers' && <IconLayers />}
                          {item.icon === 'code' && <IconCode />}
                        </div>
                        <span className="text-white font-sans text-[13px] sm:text-[14px] font-medium tracking-tight pointer-events-none whitespace-nowrap select-none">
                          {item.title}
                        </span>
                      </div>
                    )}
                  />
                )}

                {/* ---------------------------------------------------- */}
                {/* SLIDE 3: Client Industries with Collision Physics    */}
                {/* ---------------------------------------------------- */}
                {slide.type === 'clients' && (
                  <InteractiveGravityCard
                    items={slide.industries}
                    supportingText={slide.supportingText || 'Industries'}
                    isActive={isActive}
                    prefersReducedMotion={prefersReducedMotion}
                    onDragStateChange={setIsPillDragging}
                    renderPill={(item) => (
                      <div className="rounded-full px-[14px] py-[8px] flex items-center gap-[10px] backdrop-blur-md border border-white/10 w-fit whitespace-nowrap box-border bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.07)_50%,rgba(163,144,251,0.15)_100%)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(163,144,251,0.2),inset_0_1px_1px_rgba(255,255,255,0.08)] data-[colliding=true]:bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.20)_45%,rgba(163,144,251,0.32)_100%)] data-[colliding=true]:border-white/30 data-[colliding=true]:shadow-[0_4px_20px_-2px_rgba(163,144,251,0.28),inset_0_-1px_3px_rgba(163,144,251,0.35),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-[background,border-color,box-shadow] duration-200">
                        {item.badgeType === 'education' && <EducationBadge />}
                        {item.badgeType === 'real-estate' && <RealEstateBadge />}
                        {item.badgeType === 'lottery' && <LotteryBadge />}

                        <div className="flex flex-col justify-center whitespace-nowrap pointer-events-none select-none shrink-0 pr-1">
                          <span className="text-white font-sans font-medium text-[13px] sm:text-[14px] leading-tight pointer-events-none whitespace-nowrap select-none">
                            {item.title}
                          </span>
                          <span className="text-muted font-sans text-[11px] leading-snug mt-0.5 pointer-events-none whitespace-nowrap select-none">
                            {item.clients}
                          </span>
                        </div>
                      </div>
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* GENUINE SLIDING BOTTOM NAVIGATION                            */}
      {/* ============================================================ */}
      <div className="relative w-full flex justify-center overflow-visible mt-4 sm:mt-5">
        <AnimatedSlidingNav
          slides={slides}
          activeIndex={activeIndex}
          onSelectPrev={handlePrev}
          onSelectNext={handleNext}
          trackRef={navTrackRef}
          progressFillRef={progressFillRef}
          activePillRef={activePillRef}
          glowRef={glowRef}
          pillBgRef={pillBgRef}
          iconRef={iconRef}
          centerTextRef={centerTextRef}
        />
      </div>

    </div>
  )
}
