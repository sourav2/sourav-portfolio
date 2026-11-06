import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import CaseStudyShowcase, { DEFAULT_PROJECTS } from './components/CaseStudyShowcase'
import './index.css'

function ShowcasePreview() {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0)

  return (
    <div className="min-h-screen bg-canvas text-primary font-sans selection:bg-accent/30">

      {/* Top Header / Context Banner */}
      <header className="border-b border-border-subtle bg-canvas/95 backdrop-blur-md sticky top-0 z-50 py-4 px-6 sm:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[12px] font-mono text-secondary uppercase tracking-wider">
                Live Showcase Preview • Warm Canvas Theme
              </span>
            </div>
            <h1 className="text-lg font-semibold text-primary tracking-tight mt-0.5">
              CaseStudyShowcase.jsx
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted mr-1 hidden md:inline">Jump to Project:</span>
            {DEFAULT_PROJECTS.map((proj, idx) => (
              <button
                key={proj.id}
                type="button"
                onClick={() => {
                  setSelectedProjectIndex(idx)
                  const el = document.getElementById(`case-study-tab-${proj.id}`)
                  if (el) el.click()
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 border ${selectedProjectIndex === idx
                    ? 'bg-accent text-primary font-semibold border-accent shadow-xs'
                    : 'bg-black/[0.03] hover:bg-black/[0.08] text-secondary border-border-subtle'
                  }`}
              >
                0{idx + 1} {proj.id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Intro Context Banner */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 pt-12 pb-4 text-center">
        <p className="text-accent text-xs font-mono uppercase tracking-widest mb-2 font-medium">
          Interactive Portfolio Section
        </p>
        <h2 className="type-display-h1 text-primary">
          Selected Design Works
        </h2>
        <p className="type-hero-intro text-secondary max-w-2xl mx-auto mt-3">
          Scroll down through this section to experience GSAP-powered pinned scrolling across all case studies, or click any title to expand it directly.
        </p>
      </div>

      {/* Primary CaseStudyShowcase Component (Rendered on pure white background) */}
      <CaseStudyShowcase
        projects={DEFAULT_PROJECTS}
        initialIndex={0}
        className="bg-[#FFFFFF]"
        onProjectChange={(idx) => setSelectedProjectIndex(idx)}
      />

      {/* Editorial States Comparison (Matching Reference Image Layout) */}
      <section className="border-t border-black/[0.08] bg-[#FAFAFA] py-20 px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-[1440px] mx-auto space-y-12">

          <div className="text-center space-y-2 border-b border-black/[0.08] pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A390FB]/15 text-[#171717] text-xs font-mono border border-[#A390FB]/30">
              Reference Alignment
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
              All Showcase States Side-by-Side
            </h3>
            <p className="text-sm text-[#545454] max-w-2xl mx-auto">
              Visual verification showing each of the {DEFAULT_PROJECTS.length} projects in its active state with the primary heading in near-black (#171717), description in muted grey (#545454), and corresponding mockup image.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {DEFAULT_PROJECTS.map((proj, pIdx) => (
              <div
                key={`state-${proj.id}`}
                className="bg-[#FFFFFF] border border-black/[0.08] rounded-2xl p-6 lg:p-8 space-y-6 flex flex-col justify-between shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 text-xs font-mono">
                  <span className="text-[#A390FB] font-semibold">STATE 0{pIdx + 1}</span>
                  <span className="text-[#777777]">{proj.title}</span>
                </div>

                <div className="relative aspect-[4/3] rounded-[12px] overflow-hidden bg-[#F5F5F3] border border-black/[0.08] shadow-xs">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Simulated Right Panel for this active index */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs text-[#A390FB] font-mono font-medium">
                    ACTIVE PROJECT: {proj.id.toUpperCase()}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2 py-0.5 rounded-full border border-[#A390FB]/40 text-[#545454] bg-[#A390FB]/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-lg font-semibold text-[#171717] leading-snug">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-[#545454] leading-relaxed line-clamp-2">
                    {proj.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer / Outro section to demonstrate natural scroll-out */}
      <footer className="border-t border-black/[0.08] bg-[#FFFFFF] py-16 px-6 text-center text-xs text-[#777777]">
        <p className="font-sans font-medium text-[#545454]">
          Sourav Haldar Portfolio • Interactive CaseStudyShowcase Component
        </p>
        <p className="mt-2 text-[#999999]">
          Built with React 19, Tailwind CSS v4, GSAP ScrollTrigger & ScrollToPlugin.
        </p>
      </footer>

    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ShowcasePreview />
  </React.StrictMode>
)
