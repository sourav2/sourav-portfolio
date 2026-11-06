import React from 'react'

/**
 * AnimatedBorderBadge - Reusable Badge with 1px Animated Gradient Border
 *
 * Visual Design:
 * - Fully rounded pill border radius (`rounded-full`)
 * - 1px solid border with an animated angular/conic gradient
 * - Gradient colors: Lavender (#A390FB) transitioning to soft, near-white lavender (#F5F3FF)
 * - Transparent interior: Confined strictly to the 1px border using CSS masking
 * - Completes exactly one full 360° cycle every 3 seconds (linear infinite)
 *
 * Typography & Spacing:
 * - Font family: Geist (font-sans)
 * - Font weight: Regular (400)
 * - Font size: 12px, Line height: 18px
 * - Text color: Neutral grey (#777777)
 * - Padding: 4px vertical (`py-[4px]`), 8px horizontal (`px-[8px]`)
 *
 * Accessibility:
 * - Respects `prefers-reduced-motion` by disabling border rotation
 */
export default function AnimatedBorderBadge({
  as: Component = 'span',
  children = 'High-Fidelity Web UI',
  className = '',
  contentClassName = '',
  ...rest
}) {
  return (
    <Component
      className={`relative inline-flex items-center justify-center px-[8px] py-[4px] rounded-full select-none ${className}`}
      {...rest}
    >
      {/* 
        1px Animated Conic Gradient Border Mask:
        The content-box is excluded via CSS masking so the interior remains 
        100% transparent while the 1px perimeter border animates continuously.
      */}
      <span aria-hidden="true" className="animated-gradient-border" />

      {/* Badge Text Content */}
      <span
        className={`relative z-10 font-sans tracking-normal whitespace-nowrap flex items-center ${
          contentClassName || 'text-[12px] leading-[18px] font-normal text-secondary text-center'
        }`}
      >
        {children}
      </span>
    </Component>
  )
}

