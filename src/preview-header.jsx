import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import Header from './components/Header'
import DottedMeshBackground from './components/DottedMeshBackground'
import './index.css'

function HeaderPreview() {
  const [activeLink, setActiveLink] = useState('Home')
  const [lastClicked, setLastClicked] = useState('None')

  return (
    <div className="relative min-h-screen bg-canvas text-primary font-sans overflow-x-hidden">
      {/* Subtle Dotted Mesh Pattern (Spans full page height, aligns to 1440px content width, scrolls naturally) */}
      <DottedMeshBackground />

      <div className="relative z-10 w-full">
        {/* ============================================================ */}
        {/* 1. ACTUAL LIVE HEADER COMPONENT (Exact visual specification)   */}
        {/* ============================================================ */}
        <Header
          activeLink={activeLink}
          ctaText="Get In Touch"
          ctaHref="#contact"
          onNavClick={(item) => {
            setActiveLink(item.label)
            setLastClicked(`Nav: ${item.label}`)
          }}
          onCtaClick={() => setLastClicked('CTA: Get In Touch')}
        />

        {/* ============================================================ */}
        {/* 2. INSPECTION & VERIFICATION BENCHMARK PANEL                 */}
        {/* ============================================================ */}
        <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        
        {/* Editorial Introduction */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-subtle bg-surface/60 text-xs text-secondary">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            Portfolio Header Component — Reference Matching Verification
          </div>
          <h1 className="type-display-h1 text-primary">
            Portfolio Header
          </h1>
          <p className="type-hero-intro text-secondary max-w-2xl mx-auto">
            Transparent, minimalist header reusing the SHLogo, HeaderNavLink, and AnimatedCTA components.
          </p>
        </div>

        {/* Reference Asset Comparison Box */}
        <div className="p-8 rounded-card border border-border-subtle bg-surface/40 backdrop-blur-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
            <div>
              <h2 className="type-card-h3 text-primary">
                1:1 Visual Reference Comparison
              </h2>
              <p className="type-caption text-secondary mt-0.5">
                Comparing the Figma reference strip against the rendered Header component.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-accent/15 text-primary">
                Active Tab: {activeLink}
              </span>
              <span className="px-2.5 py-1 rounded bg-black/5 text-secondary">
                Last Clicked: {lastClicked}
              </span>
            </div>
          </div>

          {/* Reference Image */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-secondary font-mono">
              1. Reference Specification Asset
            </span>
            <div className="p-4 rounded-xl bg-canvas border border-border-subtle overflow-x-auto">
              <img
                src="/assets/header-reference.png"
                alt="Figma Header Reference Strip"
                className="w-full max-w-[861px] h-auto rounded border border-border-subtle shadow-xs"
              />
            </div>
          </div>

          {/* Live Component in Isolated Card */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-secondary font-mono">
              2. Live Rendered Header.jsx Component
            </span>
            <div className="p-2 rounded-xl bg-canvas border border-border-subtle shadow-xs">
              <Header
                activeLink={activeLink}
                onNavClick={(item) => {
                  setActiveLink(item.label)
                  setLastClicked(`Nav: ${item.label}`)
                }}
                onCtaClick={() => setLastClicked('CTA: Get In Touch')}
              />
            </div>
          </div>
        </div>

        {/* Specifications Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-card border border-border-subtle bg-surface/50 space-y-2">
            <span className="text-accent font-semibold text-sm">01 / Logo Alignment</span>
            <h3 className="type-button text-sm text-primary">SH Logo Vector</h3>
            <p className="type-caption text-secondary">
              Stationary mathematical SVG logo with blueprint drafting lines and lavender corner bracket, sized to 42px for balanced vertical visual weight.
            </p>
          </div>

          <div className="p-6 rounded-card border border-border-subtle bg-surface/50 space-y-2">
            <span className="text-accent font-semibold text-sm">02 / Navigation Links</span>
            <h3 className="type-button text-sm text-primary">Geist 16px Typographic Links</h3>
            <p className="type-caption text-secondary">
              Home, About, Works with 1px letter-spacing and 2px-offset animated underline using cubic-bezier easing.
            </p>
          </div>

          <div className="p-6 rounded-card border border-border-subtle bg-surface/50 space-y-2">
            <span className="text-accent font-semibold text-sm">03 / Animated CTA</span>
            <h3 className="type-button text-sm text-primary">Get In Touch Pill</h3>
            <p className="type-caption text-secondary">
              Dark charcoal pill with lavender ↗ icon on left, expanding to solid lavender with right arrow on hover.
            </p>
          </div>
        </div>

      </main>
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<HeaderPreview />)

