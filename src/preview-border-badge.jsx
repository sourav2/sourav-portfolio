import React from 'react'
import ReactDOM from 'react-dom/client'
import AnimatedBorderBadge from './components/AnimatedBorderBadge'
import './index.css'

function BorderBadgePreview() {
  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#171717] font-sans p-8 md:p-16 flex flex-col items-center justify-center selection:bg-[#A390FB]/20">
      <div className="w-full max-w-3xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-[#545454]/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A390FB]/15 text-[#171717] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#A390FB]"></span>
            <span>Component Preview: AnimatedBorderBadge.jsx</span>
          </div>
          <h1
            className="text-3xl font-semibold tracking-tight text-[#171717]"
            style={{ fontFamily: 'Faculty Glyphic, serif' }}
          >
            Animated Gradient Border Badge Showcase
          </h1>
          <p className="text-sm text-[#545454] max-w-lg mx-auto">
            1px perimeter border with an angular gradient traveling continuously around the pill every 3 seconds. Interior is 100% transparent.
          </p>
        </div>

        {/* 1. Primary Component Showcase */}
        <div className="bg-white/60 border border-[#545454]/10 rounded-2xl p-10 flex flex-col items-center justify-center space-y-6 shadow-sm">
          <span className="text-xs font-mono uppercase tracking-wider text-[#545454]">
            Live Animated Border Badge (3s Loop)
          </span>

          <div className="py-6 flex items-center justify-center">
            <AnimatedBorderBadge>
              High-Fidelity Web UI
            </AnimatedBorderBadge>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#545454]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A390FB]"></span>
              <span>3.0s continuous rotation</span>
            </span>
            <span>·</span>
            <span>1px gradient border</span>
            <span>·</span>
            <span>Geist 12px / 18px</span>
          </div>
        </div>

        {/* 2. Side-by-Side Reference State Comparison */}
        <div className="bg-white/60 border border-[#545454]/10 rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="border-b border-[#545454]/10 pb-4 flex items-center justify-between">
            <div>
              <h2
                className="text-base font-semibold text-[#171717]"
                style={{ fontFamily: 'Faculty Glyphic, serif' }}
              >
                Visual Comparison (Matching Reference Screenshot)
              </h2>
              <p className="text-xs text-[#545454] mt-0.5">
                Observed at different phases of the 3-second angular rotation cycle.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-1 bg-[#A390FB]/15 text-[#171717] rounded">
              Lavender #A390FB
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Top State from Screenshot */}
            <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-[#F6F5F1] border border-[#545454]/10 space-y-4">
              <span className="text-xs font-mono text-[#545454] uppercase tracking-wider">
                Phase A (Bottom-Left Peak)
              </span>
              <div className="py-3">
                <AnimatedBorderBadge>
                  High-Fidelity Web UI
                </AnimatedBorderBadge>
              </div>
              <ul className="text-[11px] text-[#545454] space-y-1 list-disc list-inside pt-2">
                <li>Lavender accent concentrated on lower edge</li>
                <li>Upper edge transitions to soft near-white lavender</li>
                <li>100% transparent interior</li>
              </ul>
            </div>

            {/* Bottom State from Screenshot */}
            <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-[#F6F5F1] border border-[#545454]/10 space-y-4">
              <span className="text-xs font-mono text-[#A390FB] uppercase tracking-wider">
                Phase B (Top-Right Peak)
              </span>
              <div className="py-3">
                <AnimatedBorderBadge>
                  High-Fidelity Web UI
                </AnimatedBorderBadge>
              </div>
              <ul className="text-[11px] text-[#545454] space-y-1 list-disc list-inside pt-2">
                <li>Smooth continuous rotation every 3 seconds</li>
                <li>Confined strictly to 1px border</li>
                <li>Text #777777 remains razor sharp</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Dark Background & Texture Transparency Test */}
        <div className="bg-[#171717] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Dark Background (#171717)
            </span>
            <h3 className="text-lg font-semibold mt-1 text-white">
              Interior Transparency Verification
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm">
              Demonstrates that the badge interior is truly transparent, allowing any parent canvas color to show through while the 1px perimeter border animates.
            </p>
          </div>
          <div>
            <AnimatedBorderBadge className="[&>span:last-child]:text-neutral-300">
              High-Fidelity Web UI
            </AnimatedBorderBadge>
          </div>
        </div>

        {/* 4. Multiple Labels Showcase (Consistent Dimensions & Flow) */}
        <div className="bg-white/60 border border-[#545454]/10 rounded-2xl p-8 space-y-4 shadow-sm">
          <span className="text-xs font-mono uppercase tracking-wider text-[#545454]">
            Portfolio Tag Cluster Showcase
          </span>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <AnimatedBorderBadge>High-Fidelity Web UI</AnimatedBorderBadge>
            <AnimatedBorderBadge>Design Systems</AnimatedBorderBadge>
            <AnimatedBorderBadge>Interactive Prototyping</AnimatedBorderBadge>
            <AnimatedBorderBadge>Creative Development</AnimatedBorderBadge>
            <AnimatedBorderBadge>Micro-Interactions</AnimatedBorderBadge>
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BorderBadgePreview />
  </React.StrictMode>
)

