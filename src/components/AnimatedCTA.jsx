import React, { useState, useRef, useEffect } from 'react'

/**
 * AnimatedCTA - Reusable Premium Interactive Call-to-Action Pill Button
 *
 * Dimensions & Typography:
 * - Pill-shaped with fully rounded corners (`rounded-full`)
 * - Geist font family (`font-sans`)
 * - Font size: 12px, Line height: 16px
 * - Padding: 6px around, 12px on text side (asymmetric padding preserved in both states)
 *
 * States:
 * - Default State:
 *   - Dark charcoal radial gradient background
 *   - White text
 *   - Lavender circular container (`#A390FB`) on left with diagonal up-right arrow (↗)
 * - Hover State:
 *   - Solid lavender background (`#A390FB`)
 *   - Near-black text (`#171717`)
 *   - Circle shifts to the right end with dark charcoal container and white right arrow (→)
 *   - Text shifts to the left side
 *
 * Accessibility & Motion:
 * - Smooth cubic-bezier spring easing
 * - Active press micro-interaction (`active:scale-[0.97]`)
 * - Full keyboard focus support (`focus-visible`)
 * - `prefers-reduced-motion` responsive fallback
 */
export default function AnimatedCTA({
  text = 'Get In Touch',
  href,
  onClick,
  className = '',
  ariaLabel,
  disabled = false,
  forcedState, // optional: 'default' | 'hover' for side-by-side showcase previews
  ...rest
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [textWidth, setTextWidth] = useState(72)
  const textRef = useRef(null)

  // Measure text width dynamically to guarantee zero layout shifts with custom strings
  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth)
    }
  }, [text])

  // Determine whether hover/active visual state is active (disabled suppresses hover)
  const isActive =
    !disabled &&
    (forcedState === 'hover' ||
      (forcedState !== 'default' && (isHovered || isFocused)))

  // Support system reduced-motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const transitionTiming = prefersReducedMotion
    ? 'duration-0'
    : 'duration-[540ms] ease-[cubic-bezier(0.16,1,0.3,1)]'

  const content = (
    <>
      {/* Background Layer 1: Dark Charcoal Subtle Radial Gradient (Default State) */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-full transition-opacity duration-[475ms] ease-out pointer-events-none ${isActive ? 'opacity-0' : 'opacity-100'
          }`}
        style={{
          background:
            'radial-gradient(120% 120% at 50% 50%, var(--color-dark-btn, #0E0E10) 0%, #1A1A1E 100%)',
          boxShadow:
            'inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 2px 6px rgba(0, 0, 0, 0.25)',
        }}
      />

      {/* Background Layer 2: Solid Lavender (Hover State) */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-full bg-accent transition-opacity duration-[475ms] ease-out pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'
          }`}
        style={{
          boxShadow: '0 2px 10px rgba(163, 144, 251, 0.35)',
        }}
      />

      {/* Inner Content Area: Height 28px (matching circle diameter) */}
      <span className="relative z-10 flex items-center h-7 select-none">
        {/* Animated Circle Container (28px x 28px) */}
        <span
          aria-hidden="true"
          className={`absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${transitionTiming} ${isActive ? 'bg-dark-btn' : 'bg-accent'
            }`}
          style={{
            transform: prefersReducedMotion
              ? 'none'
              : isActive
                ? `translateX(${textWidth + 14}px)`
                : 'translateX(0px)',
          }}
        >
          {/* Arrow 1: Diagonal Up-Right (↗) for Default State */}
          <svg
            className={`absolute w-3.5 h-3.5 text-white transition-all duration-[475ms] ease-out ${isActive
                ? 'opacity-0 rotate-45 scale-75'
                : 'opacity-100 rotate-0 scale-100'
              }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>

          {/* Arrow 2: Directly Right (→) for Hover State */}
          <svg
            className={`absolute w-3.5 h-3.5 text-white transition-all duration-[475ms] ease-out ${isActive
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 -rotate-45 scale-75'
              }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>

        {/* Text Container: Shifted -30px on hover so text lands 12px from left edge */}
        <span
          ref={textRef}
          className={`whitespace-nowrap font-sans text-[12px] leading-[16px] font-medium tracking-tight transition-all ${transitionTiming} ${isActive ? 'text-primary' : 'text-white'
            }`}
          style={{
            marginLeft: '36px',
            marginRight: '6px',
            transform: prefersReducedMotion
              ? 'none'
              : isActive
                ? 'translateX(-30px)'
                : 'translateX(0px)',
          }}
        >
          {text}
        </span>
      </span>
    </>
  )

  const commonClasses = `
    group relative inline-flex items-center p-[6px] rounded-full
    ${
      disabled
        ? 'cursor-not-allowed opacity-60 select-none'
        : 'cursor-pointer transition-transform duration-150 ease-out active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas'
    }
    ${className}
  `

  if (href && !disabled) {
    return (
      <a
        href={href}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={commonClasses}
        aria-label={ariaLabel || text}
        role="button"
        {...rest}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled ? 'true' : undefined}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      onFocus={() => !disabled && setIsFocused(true)}
      onBlur={() => !disabled && setIsFocused(false)}
      className={commonClasses}
      aria-label={ariaLabel || text}
      {...rest}
    >
      {content}
    </button>
  )
}

