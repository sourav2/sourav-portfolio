import React from 'react'

/**
 * SHLogo - Exact Vector Recreation of Sourav Haldar's Logo
 * Derived directly from the original asset geometry (200x161 reference frame):
 * - Geometric "S" with horizontal cuts at terminals
 * - Geometric "H" with precise stem thickness and crossbar position
 * - Lavender (#A390FB) L-shaped accent bracket at top-right with chamfered inner corner
 * - Internal construction lines matching architectural drafting blueprint
 */
export default function SHLogo({
  className = '',
  size = 200,
  showGuides = true,
  guideOpacity = 0.35,
  accentColor = 'var(--color-accent, #A390FB)',
  textColor = 'var(--color-primary, #171717)',
  guideColor = 'var(--color-secondary, #545454)',
}) {
  return (
    <svg
      viewBox="0 0 200 161"
      width={size}
      height={(size * 161) / 200}
      className={`overflow-visible select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* --- Internal Construction Lines (Blueprint Drafting Guides) --- */}
      {showGuides && (
        <g
          stroke={guideColor}
          strokeWidth="0.75"
          opacity={guideOpacity}
          style={{ vectorEffect: 'non-scaling-stroke' }}
        >
          {/* Horizontal Guidelines */}
          {/* Top accent tangent */}
          <line x1="135" y1="17" x2="195" y2="17" />
          {/* Cap Height (aligned with top of S and H) */}
          <line x1="1" y1="40" x2="168" y2="40" />
          {/* S upper bowl tangent / cut line */}
          <line x1="22" y1="65.5" x2="184" y2="65.5" />
          {/* H crossbar top edge */}
          <line x1="22" y1="85" x2="184" y2="85" />
          {/* H crossbar bottom edge */}
          <line x1="22" y1="94.5" x2="184" y2="94.5" />
          {/* S lower bowl tangent / cut line */}
          <line x1="15" y1="104" x2="184" y2="104" />
          {/* Baseline (aligned with bottom of S and H) */}
          <line x1="1" y1="134.5" x2="196" y2="134.5" />

          {/* Vertical Guidelines */}
          {/* Leftmost bounding guide */}
          <line x1="22.5" y1="8" x2="22.5" y2="157" />
          {/* Left edge of S */}
          <line x1="27.5" y1="14" x2="27.5" y2="157" />
          {/* Center axis of S curves / compass centers */}
          <line x1="61.5" y1="35" x2="61.5" y2="138" />
          {/* Left edge of H / S right boundary */}
          <line x1="97.5" y1="14" x2="97.5" y2="150" />
          {/* Inner edge of H left stem */}
          <line x1="106.5" y1="35" x2="106.5" y2="150" />
          {/* Inner edge of H right stem */}
          <line x1="151.5" y1="35" x2="151.5" y2="150" />
          {/* Outer edge of H right stem */}
          <line x1="161.5" y1="35" x2="161.5" y2="157" />
          {/* Inner vertical edge of lavender accent */}
          <line x1="174.5" y1="57" x2="174.5" y2="155" />
          {/* Outer edge of lavender accent */}
          <line x1="184.5" y1="10" x2="184.5" y2="158" />

          {/* Circular Drafting Guides (Geometric Construction Arcs) */}
          {/* S Upper Bowl Circle */}
          <circle cx="61.5" cy="65.5" r="25.5" fill="none" strokeWidth="0.6" strokeDasharray="3 2" />
          {/* S Lower Bowl Circle */}
          <circle cx="61.5" cy="109" r="25.5" fill="none" strokeWidth="0.6" strokeDasharray="3 2" />
          {/* Secondary architectural arc sweeping under H crossbar */}
          <path
            d="M 61.5 65.5 A 48.5 48.5 0 0 0 151.5 134.5"
            fill="none"
            strokeWidth="0.6"
            strokeDasharray="2 2"
          />
        </g>
      )}

      {/* --- Lavender Inverted-L Accent (Top Right) --- */}
      <polygon
        points="142,17 184.5,17 184.5,57.5 174.5,57.5 174.5,29 172.5,27 144,27 142,25"
        fill={accentColor}
      />
      {/* Precision corner drafting ticks on lavender accent */}
      <rect x="142" y="25" width="2" height="2" fill={textColor} opacity="0.4" />
      <rect x="173" y="56" width="2" height="2" fill={textColor} opacity="0.4" />

      {/* --- Letter S (Geometric Smooth Vector Path) --- */}
      <path
        d="M 94.5,65.5 L 84,65.5 C 84,55 77,50.2 61.5,50.2 C 48,50.2 39.8,56.5 39.8,66 C 39.8,75.5 48.5,79.8 63,83.2 C 81.5,87.5 95.5,93.5 95.5,111.5 C 95.5,126 84,134.5 62,134.5 C 44,134.5 32,126 27,112 L 37.5,104 C 40.5,116 50,123.5 62,123.5 C 74.5,123.5 83,118 83,110.5 C 83,101.5 74.5,97.5 59.5,94 C 41.5,89.5 28.5,84 28.5,66.5 C 28.5,51.5 41.5,40 61.5,40 C 78,40 89.5,48.5 94.5,65.5 Z"
        fill={textColor}
      />

      {/* --- Letter H (Geometric Stems and Crossbar) --- */}
      {/* Left Vertical Stem */}
      <rect x="97.5" y="40" width="9" height="94.5" fill={textColor} />
      {/* Horizontal Crossbar */}
      <rect x="106.5" y="85" width="45" height="9.5" fill={textColor} />
      {/* Right Vertical Stem */}
      <rect x="151.5" y="40" width="9.5" height="94.5" fill={textColor} />
    </svg>
  )
}

