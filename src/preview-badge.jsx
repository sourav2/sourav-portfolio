import React from 'react'
import ReactDOM from 'react-dom/client'
import ExpertiseBadge from './components/ExpertiseBadge'
import './index.css'

function BadgePreview() {
  const [hoverCount, setHoverCount] = React.useState(0)

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#171717] font-sans p-8 md:p-16 flex flex-col items-center justify-center selection:bg-[#A390FB]/20">
      <div className="w-full max-w-3xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-[#545454]/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A390FB]/15 text-[#171717] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#A390FB]"></span>
            <span>Component Preview: ExpertiseBadge.jsx</span>
          </div>
          <h1
            className="text-3xl font-semibold tracking-tight text-[#171717]"
            style={{ fontFamily: 'Faculty Glyphic, serif' }}
          >
            Animated Highlight Badge Showcase
          </h1>
          <p className="text-sm text-[#545454] max-w-lg mx-auto">
            3-second cycle: transparent (State 1) for ~2s, then gently breathes into glowing white with lavender aura (State 2) for ~1s. Hover locks in State 2; leave resumes the 3s cycle from State 1.
          </p>
        </div>

        {/* 1. Interactive Live Breathing Badge */}
        <div className="bg-white/60 border border-[#545454]/10 rounded-2xl p-10 flex flex-col items-center justify-center space-y-6 shadow-sm">
          <span className="text-xs font-mono uppercase tracking-wider text-[#545454]">
            Live Breathing Badge (Hover to lock in State 2)
          </span>

          <div className="py-6 flex items-center justify-center">
            <ExpertiseBadge
              onMouseEnter={() => setHoverCount((c) => c + 1)}
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-[#545454]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A390FB] animate-ping"></span>
              <span>3s breathing pulse cycle (2s transparent, 1s highlighted)</span>
            </span>
            <span>·</span>
            <span>Hover interactions: <strong className="text-[#171717] font-mono">{hoverCount}</strong></span>
          </div>
        </div>

        {/* 2. Side-by-Side Reference Comparison (Matching User Screenshot) */}
        <div className="bg-white/60 border border-[#545454]/10 rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="border-b border-[#545454]/10 pb-4 flex items-center justify-between">
            <div>
              <h2
                className="text-base font-semibold text-[#171717]"
                style={{ fontFamily: 'Faculty Glyphic, serif' }}
              >
                Visual Reference State Comparison
              </h2>
              <p className="text-xs text-[#545454] mt-0.5">
                Side-by-side verification matching your attached reference image.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-1 bg-[#A390FB]/15 text-[#171717] rounded">
              Lavender Glow #A390FB
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* State 1 Card */}
            <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-[#F6F5F1] border border-[#545454]/10 space-y-4">
              <span className="text-xs font-mono text-[#545454] uppercase tracking-wider">
                State 1 — Default (Transparent)
              </span>
              <div className="py-4">
                <ExpertiseBadge forcedState="default" />
              </div>
              <ul className="text-[11px] text-[#545454] space-y-1 list-disc list-inside pt-2">
                <li>Completely transparent background</li>
                <li>No visible border or shadow</li>
                <li>Dark, near-black text (#171717)</li>
                <li>Feels like ordinary inline text + emoji</li>
              </ul>
            </div>

            {/* State 2 Card */}
            <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-[#F6F5F1] border border-[#545454]/10 space-y-4">
              <span className="text-xs font-mono text-[#A390FB] uppercase tracking-wider">
                State 2 — Highlighted
              </span>
              <div className="py-4">
                <ExpertiseBadge forcedState="highlighted" />
              </div>
              <ul className="text-[11px] text-[#545454] space-y-1 list-disc list-inside pt-2">
                <li>Near-white solid pill background (#FFFFFF)</li>
                <li>Soft lavender outer glow (#A390FB)</li>
                <li>Diffused elevation shadow</li>
                <li>Text and emoji remain identical</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Dark Background Contrast Preview */}
        <div className="bg-[#171717] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Dark Background (#171717)
            </span>
            <h3 className="text-lg font-semibold mt-1 text-white">
              Glow & Aura Isolation
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm">
              Demonstrates how the soft #A390FB lavender outer aura diffuses smoothly in high contrast.
            </p>
          </div>
          <div>
            <ExpertiseBadge />
          </div>
        </div>

        {/* 4. Multiple Badges & Custom Props Showcase */}
        <div className="bg-white/60 border border-[#545454]/10 rounded-2xl p-8 space-y-4 shadow-sm">
          <span className="text-xs font-mono uppercase tracking-wider text-[#545454]">
            Custom Badges Showcase (Reusable API)
          </span>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <ExpertiseBadge icon="🧠" label="UI/UX Designer" />
            <ExpertiseBadge icon="🎨" label="Design Systems" />
            <ExpertiseBadge icon="⚡" label="Creative Developer" />
            <ExpertiseBadge icon="📐" label="Information Architecture" />
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BadgePreview />
  </React.StrictMode>
)

