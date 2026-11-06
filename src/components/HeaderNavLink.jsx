import React from 'react'

/**
 * HeaderNavLink Component
 *
 * A reusable, accessible header navigation link engineered to match the portfolio's
 * minimalist typographic design system.
 *
 * Design System Specifications:
 * - Font family: Geist, sans-serif
 * - Font size: 16px (1rem)
 * - Font weight: Regular (400)
 * - Line height: 16px (1)
 * - Letter spacing: 1px (0.0625rem)
 * - Text color: #1A1A1A
 *
 * States:
 * - Default: Plain text, transparent background, no border, no shadow, no underline.
 * - Hover / Focus: Smoothly animated underline beneath text with exactly 2px vertical spacing.
 * - Text color remains strictly #1A1A1A across all states.
 * - Fully accessible semantic <a> anchor with keyboard focus ring and touch support.
 *
 * @param {Object} props
 * @param {string} [props.label] - Navigation label text
 * @param {React.ReactNode} [props.children] - Alternate child content (used if label not provided)
 * @param {string} [props.href='#'] - Destination URL
 * @param {boolean} [props.isActive=false] - Whether this link represents the current page
 * @param {string} [props.className=''] - Additional classes for the anchor container
 * @param {string} [props.underlineClassName=''] - Additional classes for the underline element
 * @param {'left' | 'center' | 'fade'} [props.animationStyle='left'] - Origin of the underline animation
 * @param {number} [props.underlineThickness=1] - Underline thickness in pixels (default: 1)
 * @param {number} [props.underlineSpacing=2] - Vertical spacing between text and underline in pixels (default: 2)
 * @param {Function} [props.onClick] - Optional click event handler
 */
export default function HeaderNavLink({
  label,
  children,
  href = '#',
  isActive = false,
  className = '',
  underlineClassName = '',
  animationStyle = 'left',
  underlineThickness = 1,
  underlineSpacing = 2,
  onClick,
  target,
  rel,
  ...rest
}) {
  const content = label || children

  // Transform origin based on animation style preference
  const originClass =
    animationStyle === 'center'
      ? 'origin-center'
      : animationStyle === 'fade'
      ? 'origin-center'
      : 'origin-left'

  // Safe external link defaults
  const computedRel = target === '_blank' && !rel ? 'noopener noreferrer' : rel

  return (
    <a
      href={href}
      target={target}
      rel={computedRel}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      data-testid="header-nav-link"
      className={`group relative inline-flex items-center justify-center bg-transparent no-underline border-none shadow-none cursor-pointer select-none touch-manipulation transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 rounded-xs ${className}`}
      style={{
        fontFamily: "var(--font-sans, 'Geist', -apple-system, sans-serif)",
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '16px',
        letterSpacing: '1px',
        color: 'var(--color-primary, #171717)',
        textDecoration: 'none',
      }}
      {...rest}
    >
      {/* 
        Text wrapper with exact 16px line-height:
        Positions the animated underline exactly {underlineSpacing}px below the text box.
      */}
      <span className="relative inline-block leading-[16px] text-primary">
        {content}

        {/* 
          Smoothly Animated Underline
          - Exactly 2px of vertical spacing beneath the text (top: calc(100% + 2px))
          - Height: 1px
          - Color: primary text color
          - Animation: GPU-composited scaleX with cubic-bezier easing
        */}
        <span
          aria-hidden="true"
          data-testid="nav-link-underline"
          className={`absolute left-0 right-0 bg-primary pointer-events-none will-change-[transform,opacity] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${originClass} ${
            isActive
              ? 'scale-x-100 opacity-100'
              : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100 group-active:scale-x-100 group-active:opacity-100'
          } ${underlineClassName}`}
          style={{
            height: `${underlineThickness}px`,
            top: `calc(100% + ${underlineSpacing}px)`,
          }}
        />
      </span>
    </a>
  )
}

