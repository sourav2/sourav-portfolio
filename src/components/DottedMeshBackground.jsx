import React from 'react'

/**
 * DottedMeshBackground - Architectural Dotted Grid Mesh Layer
 *
 * Visual & Functional Specifications:
 * - Recreates the subtle pattern of tiny, evenly spaced dots.
 * - Low-contrast light grey against the warm canvas background (#F7F5F0).
 * - Aligns strictly with the main website content container width (max-w-[1440px]),
 *   centered horizontally within the viewport (not edge-to-edge full viewport).
 * - Spans the full vertical height of the page content.
 * - Scrolls naturally with content (absolute inset-y-0, never fixed/sticky).
 * - Zero pointer events, non-interactive, placed behind all content (z-0 / -z-10).
 * - Implemented via lightweight CSS radial-gradient (no image assets).
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Optional content to wrap
 * @param {string} [props.className=''] - Additional classes
 * @param {string} [props.maxWidth='max-w-[1440px]'] - Container width constraint
 * @param {string} [props.dotColor='rgba(23, 23, 23, 0.095)'] - Dot color with low-contrast opacity
 * @param {number} [props.dotSize=2] - Radius of each dot in pixels (~2x size)
 * @param {number} [props.spacing=24] - Grid spacing in pixels between dot centers
 */
export default function DottedMeshBackground({
  children,
  className = '',
  maxWidth = 'max-w-[1440px]',
  dotColor = 'rgba(23, 23, 23, 0.095)',
  dotSize = 2,
  spacing = 24,
  ...rest
}) {
  const meshStyle = {
    backgroundImage: `radial-gradient(circle, ${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
    backgroundSize: `${spacing}px ${spacing}px`,
    backgroundPosition: 'center top',
  }

  // Wrapper mode: wraps children and renders the mesh layer behind them
  if (children) {
    return (
      <div className={`relative w-full ${className}`} {...rest}>
        <div
          aria-hidden="true"
          data-testid="dotted-mesh-background"
          className={`pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-full ${maxWidth} select-none z-0 overflow-hidden`}
          style={meshStyle}
        />
        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    )
  }

  // Standalone layer mode: absolute positioned within a relative scrolling parent
  return (
    <div
      aria-hidden="true"
      data-testid="dotted-mesh-background"
      className={`pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-full ${maxWidth} select-none z-0 overflow-hidden ${className}`}
      style={meshStyle}
      {...rest}
    />
  )
}

