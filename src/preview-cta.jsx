import React from 'react'
import ReactDOM from 'react-dom/client'
import AnimatedCTA from './components/AnimatedCTA'
import './index.css'

function CTAPreview() {
  const [clickedCount, setClickedCount] = React.useState(0)

  return (
    <div className="min-h-screen bg-[#171717] text-white font-sans p-8 md:p-16 flex flex-col items-center justify-center selection:bg-[#A390FB]/30">
      <div className="w-full max-w-3xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A390FB]/15 text-[#A390FB] text-xs font-mono">
            <span>●</span> Component Preview: AnimatedCTA.jsx
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Animated CTA Button Showcase
          </h1>
          <p className="text-sm text-neutral-400 max-w-lg mx-auto">
            Hover over the button, click it, or navigate with the keyboard tab key to test all states and micro-interactions.
          </p>
        </div>

        {/* 1. Interactive Live Playground */}
        <div className="bg-[#202022] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center space-y-6 shadow-2xl">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Interactive Live Button
          </span>
          <div className="py-4">
            <AnimatedCTA
              text="Get In Touch"
              onClick={() => setClickedCount((c) => c + 1)}
            />
          </div>
          <p className="text-xs text-neutral-400">
            Click count: <span className="text-[#A390FB] font-mono">{clickedCount}</span>
            <span className="mx-2 text-neutral-600">·</span>
            Hover or Tab to activate state transition
          </p>
        </div>

        {/* 2. Side-by-Side Reference Comparison */}
        <div className="bg-[#202022] border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-base font-semibold text-white">
              Visual Reference State Comparison
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Exact side-by-side match with your reference image specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Default State Card */}
            <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-[#171717] border border-white/10 space-y-4">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                1. Default State
              </span>
              <AnimatedCTA text="Get In Touch" forcedState="default" />
              <ul className="text-[11px] text-neutral-400 space-y-1 list-disc list-inside pt-2">
                <li>Dark radial gradient background</li>
                <li>Lavender circle on left (#A390FB)</li>
                <li>Diagonal up-right arrow (↗)</li>
                <li>White text (#FFFFFF)</li>
              </ul>
            </div>

            {/* Hover State Card */}
            <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-[#171717] border border-white/10 space-y-4">
              <span className="text-xs font-mono text-[#A390FB] uppercase tracking-wider">
                2. Hover State
              </span>
              <AnimatedCTA text="Get In Touch" forcedState="hover" />
              <ul className="text-[11px] text-neutral-400 space-y-1 list-disc list-inside pt-2">
                <li>Solid lavender background (#A390FB)</li>
                <li>Dark circle on right (#1C1C1E)</li>
                <li>Horizontal right arrow (→)</li>
                <li>Near-black text (#171717)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Light Background Context Preview */}
        <div className="bg-[#F6F5F1] text-[#171717] border border-black/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              Light Portfolio Background (#F6F5F1)
            </span>
            <h3 className="text-lg font-semibold mt-1">
              Ready for Portfolio Integration
            </h3>
            <p className="text-xs text-neutral-600 mt-1 max-w-sm">
              Tested on your primary warm off-white canvas for optimal contrast and accessibility.
            </p>
          </div>
          <div>
            <AnimatedCTA text="Get In Touch" />
          </div>
        </div>

        {/* 4. Custom Labels Showcase */}
        <div className="bg-[#202022] border border-white/10 rounded-2xl p-8 space-y-4 shadow-2xl">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Dynamic Custom Labels (Zero Layout Shift)
          </span>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <AnimatedCTA text="View Work" />
            <AnimatedCTA text="Get In Touch" />
            <AnimatedCTA text="Download Resume" />
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CTAPreview />
  </React.StrictMode>
)

