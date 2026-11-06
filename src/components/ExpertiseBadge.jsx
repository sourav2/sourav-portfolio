import React, { useState } from 'react'
import AnimatedEmoji from './AnimatedEmoji'

/**
 * ExpertiseBadge - Reusable Animated Highlight Badge Component
 *
 * Typography & Dimensions:
 * - Padding: Vertical 4px (`py-[4px]`), Horizontal 8px (`px-[8px]`)
 * - Font: Geist (font-sans), 16px, weight 500 (Medium)
 * - Pill-shaped with fully rounded corners (`rounded-full`)
 * - Icon: 🧠 (Brain emoji or custom node/emoji)
 *
 * States:
 * - State 1 (Default / Transparent):
 *   - Completely transparent background, no visible shadow
 *   - Dark, near-black text (#171717)
 *   - Feels like ordinary inline text with an icon
 * - State 2 (Highlighted):
 *   - Subtle white background (#FFFFFF)
 *   - Soft diffused lavender outer glow using portfolio accent #A390FB
 *   - Slightly diffused elevation shadow for emphasis
 *   - Text and icon remain completely unchanged
 *
 * Animation Behavior:
 * - Total cycle: 3 seconds, repeating indefinitely
 *   - State 1 (transparent): ~2 seconds
 *   - State 2 (highlighted): ~1 second
 *   - Smooth transitions with a gentle breathing effect
 * - Hover Behavior:
 *   - On mouse enter: Immediately transitions to State 2 (highlighted)
 *   - While hovered: Stays continuously in State 2; pauses automatic pulsing
 *   - On mouse leave: Resumes the automatic 3-second pulsating cycle from State 1
 * - Zero scaling, bouncing, rotation, or positional movement
 * - Respects prefers-reduced-motion
 */
export default function ExpertiseBadge({
  icon = '🧠',
  label = 'UI/UX Designer',
  iconPosition = 'left',
  animationDelay = 0,
  textSize = 'default',
  emojiVariant = 'ambient',
  className = '',
  onClick,
  forcedState, // optional: 'default' | 'highlighted' for static preview cards
  ...rest
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [pulseKey, setPulseKey] = useState(0)

  // Respect system reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    // Restart automatic 3-second cycle cleanly from State 1 (0% opacity) on leave
    setPulseKey((k) => k + 1)
  }

  // State 2 Highlight Style Specification matching the reference image:
  // - Pure white pill background (#FFFFFF)
  // - Soft diffused lavender glow (#A390FB)
  // - Soft elevation shadow
  const highlightStyles = {
    backgroundColor: 'var(--color-surface, #FFFFFF)',
    boxShadow:
      '0 0 20px 2px rgba(163, 144, 251, 0.38), 0 0 8px 0 rgba(163, 144, 251, 0.22), 0 2px 10px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.9)',
    ...(animationDelay && !isHovered ? { animationDelay: `${animationDelay}s` } : {}),
  }

  // Determine active visual state
  const isForcedDefault = forcedState === 'default'
  const isForcedHighlighted = forcedState === 'highlighted'

  let highlightLayerClass = ''
  if (isForcedDefault) {
    highlightLayerClass = 'opacity-0'
  } else if (isForcedHighlighted) {
    highlightLayerClass = 'opacity-100'
  } else if (isHovered) {
    // Immediate, smooth transition to State 2 on hover
    highlightLayerClass = 'opacity-100 transition-opacity duration-200 ease-out'
  } else if (prefersReducedMotion) {
    highlightLayerClass = 'opacity-0'
  } else {
    // Normal 3-second breathing pulse cycle (2s transparent, 1s highlighted)
    highlightLayerClass = 'animate-badge-pulse'
  }

  const isHeroSize = textSize === 'hero'

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative inline-flex items-center align-baseline ${isHeroSize
          ? (iconPosition === 'right' ? 'pl-[10px] pr-[6px] py-[2px] ml-[2px] mr-[1px]' : 'px-[10px] py-[2px] mx-[2px]')
          : 'px-[8px] py-[4px]'
        } rounded-full select-none cursor-default transition-transform duration-150 active:scale-[0.99] ${className}`}
      {...rest}
    >
      {/* 
        State 2 Highlight Layer (Pure White Pill + Lavender Glow):
        Smoothly breathes in and out underneath the unchanged text & icon.
      */}
      <span
        key={isHovered ? 'hovered' : `pulse-${pulseKey}`}
        aria-hidden="true"
        className={`absolute inset-0 rounded-full pointer-events-none ${highlightLayerClass}`}
        style={highlightStyles}
      />

      {/* Content: Icon & Label (Zero movement, identical in both states) */}
      <span className="relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap">
        {iconPosition === 'left' && icon && (
          typeof icon === 'string' ? (
            <AnimatedEmoji
              variant={emojiVariant}
              delay={animationDelay}
              className={`${isHeroSize ? 'text-[20px] sm:text-[22px]' : 'text-[16px]'} leading-none shrink-0`}
              aria-hidden="true"
            >
              {icon}
            </AnimatedEmoji>
          ) : (
            <span
              className={`${isHeroSize ? 'text-[20px] sm:text-[22px]' : 'text-[16px]'} leading-none shrink-0`}
              aria-hidden="true"
            >
              {icon}
            </span>
          )
        )}
        <span
          className={`font-sans ${isHeroSize
              ? 'text-[20px] sm:text-[24px] leading-[1.3] font-semibold text-primary'
              : 'text-[16px] leading-[24px] font-medium text-primary'
            } tracking-tight`}
        >
          {label}
        </span>
        {iconPosition === 'right' && icon && (
          typeof icon === 'string' ? (
            <AnimatedEmoji
              variant={emojiVariant}
              delay={animationDelay}
              className={`${isHeroSize ? 'text-[20px] sm:text-[22px]' : 'text-[16px]'} leading-none shrink-0`}
              aria-hidden="true"
            >
              {icon}
            </AnimatedEmoji>
          ) : (
            <span
              className={`${isHeroSize ? 'text-[20px] sm:text-[22px]' : 'text-[16px]'} leading-none shrink-0`}
              aria-hidden="true"
            >
              {icon}
            </span>
          )
        )}
      </span>
    </span>
  )
}

