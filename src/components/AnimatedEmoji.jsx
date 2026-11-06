import React from 'react'

/**
 * AnimatedEmoji Component
 *
 * Implements the centralized ambient emoji animation system across the portfolio.
 *
 * Animation Variants:
 * 1. 'wave': Distinct waving hand 👋 animation with natural wrist rotation (±14°)
 *    and a natural pause between cycles.
 * 2. 'brain': Special spring-like scaling 🧠 animation (scale 1.0 -> 1.15 -> 0.97 -> 1.03 -> 1.0)
 *    with organic overshoot and a calm rest interval.
 * 3. 'bulb': Special spring-like idea takeoff 💡 animation (lifts 8px, scales 1.15, settles back)
 *    with organic spring recoil and 3-4s relaxed interval.
 * 4. 'rocket': Special takeoff 🚀 animation with diagonal lift, tilt, and gentle return.
 * 5. 'float': Gentle vertical floating (2-3px) with subtle angle tilt.
 * 6. 'wobble': Subtle playful tilt wobble with a rest pause.
 * 7. 'pulse': Soft breathing scale (1.08) with a rest pause.
 * 8. 'ambient': Default smooth ambient float and slight rotation.
 *
 * Performance & Accessibility:
 * - Uses pure CSS transforms (scale, rotate, translateY) in compositor layer
 * - Zero layout recalculations (doesn't shift nearby text or alter dimensions)
 * - Fully respects prefers-reduced-motion
 * - Accessible role="img" with aria-label support
 */
export default function AnimatedEmoji({
  children,
  emoji,
  variant = 'ambient',
  delay = 0,
  className = '',
  ariaLabel,
  role = 'img',
  ...rest
}) {
  const content = children || emoji

  const variantClassMap = {
    wave: 'animate-emoji-wave origin-[75%_75%]',
    brain: 'animate-emoji-brain origin-center',
    bulb: 'animate-emoji-bulb origin-center',
    rocket: 'animate-emoji-rocket origin-bottom-left',
    float: 'animate-emoji-float origin-center',
    wobble: 'animate-emoji-wobble origin-center',
    pulse: 'animate-emoji-pulse origin-center',
    ambient: 'animate-emoji-ambient origin-center',
  }

  const animationClass = variantClassMap[variant] || variantClassMap.ambient
  const style = delay ? { animationDelay: `${delay}s` } : undefined

  return (
    <span
      className={`inline-block select-none will-change-transform ${animationClass} ${className}`}
      style={style}
      role={role}
      aria-label={ariaLabel}
      {...rest}
    >
      {content}
    </span>
  )
}

