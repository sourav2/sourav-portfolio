import React, { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import HeaderNavLink from './components/HeaderNavLink'
import SHLogo from './components/SHLogo'
import './index.css'

function HeaderNavPreview() {
  const [activeLink, setActiveLink] = useState('Work')
  const [animationStyle, setAnimationStyle] = useState('left')
  const [customSpacing, setCustomSpacing] = useState(2)
  const [metrics, setMetrics] = useState(null)
  const measuredLinkRef = useRef(null)

  const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Articles', href: '#articles' },
    { label: 'Contact', href: '#contact' },
  ]

  // Inspect computed CSS and exact vertical gap
  useEffect(() => {
    if (!measuredLinkRef.current) return

    const linkEl = measuredLinkRef.current
    const textSpan = linkEl.querySelector('span.relative')
    const underlineEl = linkEl.querySelector('[data-testid="nav-link-underline"]')

    if (textSpan && underlineEl) {
      const computed = window.getComputedStyle(linkEl)
      const textRect = textSpan.getBoundingClientRect()
      const underlineRect = underlineEl.getBoundingClientRect()

      setMetrics({
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        letterSpacing: computed.letterSpacing,
        color: computed.color,
        textHeight: textRect.height,
        underlineTop: underlineEl.offsetTop,
        calculatedGap: underlineEl.offsetTop - textSpan.offsetHeight,
      })
    }
  }, [customSpacing])

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#171717] flex flex-col items-center py-12 px-6 font-sans">
      <div className="w-full max-w-4xl space-y-12">
        
        {/* Header / Meta */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-black/5 text-xs text-[#545454] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#A390FB]" />
            Header Navigation Component
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-[#171717]">
            HeaderNavLink.jsx
          </h1>
          <p className="text-sm text-[#545454] max-w-md mx-auto">
            Minimalist, accessible navigation links with Geist typography and a 2px-offset animated underline.
          </p>
        </div>

        {/* 1. Realistic Header Implementation in Context */}
        <div className="bg-white rounded-2xl border border-black/5 p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-black/5 pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#545454]">
              1. In-Context Header Bar
            </span>
            <span className="text-xs text-[#545454] font-mono">
              Active Link: <strong className="text-[#1A1A1A]">{activeLink}</strong>
            </span>
          </div>

          <header className="w-full py-4 px-6 rounded-xl bg-[#F6F5F1]/60 border border-black/5 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <SHLogo size={32} showGuides={false} />
              <span className="font-semibold text-xs tracking-wider text-[#171717] uppercase">
                Sourav Haldar
              </span>
            </div>

            {/* Navigation Links List */}
            <nav className="flex items-center gap-8">
              {navItems.map((item) => (
                <HeaderNavLink
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  isActive={activeLink === item.label}
                  animationStyle={animationStyle}
                  underlineSpacing={customSpacing}
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveLink(item.label)
                  }}
                />
              ))}
            </nav>
          </header>
        </div>

        {/* 2. States Comparison Matrix */}
        <div className="bg-white rounded-2xl border border-black/5 p-8 shadow-xs space-y-6">
          <span className="text-xs font-mono uppercase tracking-wider text-[#545454] block border-b border-black/5 pb-4">
            2. State Comparison & Visual Verification
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Default State */}
            <div className="p-6 rounded-xl bg-[#F6F5F1] border border-black/5 flex flex-col items-center justify-center space-y-4">
              <span className="text-xs font-mono text-[#545454]">Default State</span>
              <div className="h-12 flex items-center justify-center">
                <HeaderNavLink
                  ref={measuredLinkRef}
                  label="Navigation Link"
                  href="#default"
                  isActive={false}
                  animationStyle={animationStyle}
                  underlineSpacing={customSpacing}
                />
              </div>
              <span className="text-[11px] text-[#8E8E93] text-center">
                Plain text, no border, no shadow
              </span>
            </div>

            {/* Hover Simulation */}
            <div className="p-6 rounded-xl bg-[#F6F5F1] border border-black/5 flex flex-col items-center justify-center space-y-4">
              <span className="text-xs font-mono text-[#545454]">Hover / Focused</span>
              <div className="h-12 flex items-center justify-center">
                <HeaderNavLink
                  label="Navigation Link"
                  href="#hover"
                  isActive={false}
                  className="[&_[data-testid='nav-link-underline']]:scale-x-100 [&_[data-testid='nav-link-underline']]:opacity-100"
                  animationStyle={animationStyle}
                  underlineSpacing={customSpacing}
                />
              </div>
              <span className="text-[11px] text-[#8E8E93] text-center">
                Underline with exact 2px spacing
              </span>
            </div>

            {/* Active / Current Page State */}
            <div className="p-6 rounded-xl bg-[#F6F5F1] border border-black/5 flex flex-col items-center justify-center space-y-4">
              <span className="text-xs font-mono text-[#545454]">Active Page State</span>
              <div className="h-12 flex items-center justify-center">
                <HeaderNavLink
                  label="Navigation Link"
                  href="#active"
                  isActive={true}
                  animationStyle={animationStyle}
                  underlineSpacing={customSpacing}
                />
              </div>
              <span className="text-[11px] text-[#8E8E93] text-center">
                Persistent underline with aria-current="page"
              </span>
            </div>
          </div>
        </div>

        {/* 3. Real-Time Computed Metrics Inspector */}
        <div className="bg-white rounded-2xl border border-black/5 p-8 shadow-xs space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[#545454] block border-b border-black/5 pb-4">
            3. Computed Typography & Spacing Inspector
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-2">
            <div className="p-3 bg-[#F6F5F1] rounded-lg">
              <p className="text-[11px] text-[#545454] font-mono">Font Size</p>
              <p className="text-sm font-semibold text-[#171717]">16px</p>
            </div>
            <div className="p-3 bg-[#F6F5F1] rounded-lg">
              <p className="text-[11px] text-[#545454] font-mono">Font Weight</p>
              <p className="text-sm font-semibold text-[#171717]">400 (Regular)</p>
            </div>
            <div className="p-3 bg-[#F6F5F1] rounded-lg">
              <p className="text-[11px] text-[#545454] font-mono">Line Height</p>
              <p className="text-sm font-semibold text-[#171717]">16px</p>
            </div>
            <div className="p-3 bg-[#F6F5F1] rounded-lg">
              <p className="text-[11px] text-[#545454] font-mono">Letter Spacing</p>
              <p className="text-sm font-semibold text-[#171717]">1px</p>
            </div>
            <div className="p-3 bg-[#F6F5F1] rounded-lg">
              <p className="text-[11px] text-[#545454] font-mono">Color</p>
              <p className="text-sm font-semibold text-[#171717]">#1A1A1A</p>
            </div>
            <div className="p-3 bg-[#EAE5FC] rounded-lg border border-[#A390FB]/30">
              <p className="text-[11px] text-[#5A31F4] font-mono font-medium">Vertical Gap</p>
              <p className="text-sm font-bold text-[#5A31F4]">
                {metrics ? `${metrics.calculatedGap}px` : `${customSpacing}px`}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white/60 border border-black/5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#545454]">Animation Style:</span>
            <div className="flex items-center gap-1">
              {['left', 'center', 'fade'].map((style) => (
                <button
                  key={style}
                  onClick={() => setAnimationStyle(style)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    animationStyle === style
                      ? 'bg-[#171717] text-white'
                      : 'bg-[#F6F5F1] text-[#545454] hover:text-[#171717]'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#545454]">Vertical Gap:</span>
            {[1, 2, 3, 4].map((spacing) => (
              <button
                key={spacing}
                onClick={() => setCustomSpacing(spacing)}
                className={`px-2.5 py-1 text-xs rounded-md font-mono transition-colors ${
                  customSpacing === spacing
                    ? 'bg-[#A390FB] text-white font-medium'
                    : 'bg-[#F6F5F1] text-[#545454] hover:text-[#171717]'
                }`}
              >
                {spacing}px
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<HeaderNavPreview />)

