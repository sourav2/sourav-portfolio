import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import HeroSlider, { SLIDES_DATA } from './components/HeroSlider'
import './index.css'

function HeroSliderPreview() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  return (
    <div className="min-h-screen bg-canvas text-primary font-sans selection:bg-accent/20 flex flex-col justify-between">

      {/* Top Header */}
      <header className="border-b border-border-subtle bg-canvas/90 backdrop-blur-md sticky top-0 z-50 py-4 px-6 sm:px-8">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[12px] font-mono text-secondary uppercase tracking-wider">
                Hero Section Component Preview
              </span>
            </div>
            <h1 className="text-lg font-semibold text-primary tracking-tight mt-0.5">
              HeroSlider.jsx — 3D Rotating Information Cards
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-secondary">
            <span>Active Slide:</span>
            <span className="px-2.5 py-1 rounded-full bg-surface border border-border-subtle text-primary font-medium shadow-xs">
              0{currentSlideIndex + 1} {SLIDES_DATA[currentSlideIndex].navLabel}
            </span>
          </div>
        </div>
      </header>

      {/* Main Interactive Showcase */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12 md:py-16 flex flex-col items-center justify-center">

        {/* Editorial Context */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-mono text-accent uppercase tracking-widest font-medium mb-2">
            Interactive 3D Carousel
          </p>
          <h2 className="type-display-h1 text-primary">
            Sourav Haldar
          </h2>
          <p className="type-hero-intro text-secondary mt-2">
            Physical card 3D turnover animation every 5s with pause on hover, faded edge navigation, and touch swipe.
          </p>
        </div>

        {/* Live HeroSlider Component */}
        <div className="w-full flex justify-center py-4">
          <HeroSlider
            slides={SLIDES_DATA}
            autoplayInterval={5000}
            onSlideChange={(idx) => setCurrentSlideIndex(idx)}
          />
        </div>

        {/* Reference Verification: All 3 States Side-by-Side */}
        <section className="w-full mt-20 pt-16 border-t border-black/[0.08]">
          <div className="text-center mb-10">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-white border border-black/10 text-[#545454]">
              Visual Source of Truth
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#171717] tracking-tight mt-2">
              All 3 Card States (Reference Alignment)
            </h3>
            <p className="text-xs sm:text-sm text-[#545454] max-w-lg mx-auto mt-1">
              Side-by-side reproduction of Slide 1 (Portrait), Slide 2 (Expertise), and Slide 3 (Client Industries) matching the design specification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">

            {/* State 1: Portrait */}
            <div className="flex flex-col items-center w-full max-w-[320px]">
              <div className="w-full h-[420px] rounded-[20px] overflow-hidden bg-white border border-black/[0.08] shadow-sm">
                <img
                  src="/assets/portrait.png"
                  alt="Portrait preview"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="w-full mt-5 flex items-center justify-between px-2 text-xs">
                <span className="text-[#8E8E93] opacity-40">Clients</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#A390FB]/30 shadow-xs font-medium text-[#171717]">
                  <span className="w-4 h-4 rounded-full bg-[#A390FB] text-white flex items-center justify-center text-[9px]">→</span>
                  UI UX Designer
                </span>
                <span className="text-[#8E8E93] opacity-40">Experience</span>
              </div>
            </div>

            {/* State 2: Expertise */}
            <div className="flex flex-col items-center w-full max-w-[320px]">
              <div
                className="relative w-full h-[420px] rounded-[20px] p-5 flex flex-col justify-between border border-white/10 shadow-sm overflow-hidden"
                style={{
                  backgroundColor: '#0E0E10',
                  backgroundImage: `
                    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '28px 28px',
                }}
              >
                <div className="self-start ml-2 mt-4 bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-full px-[12px] py-[8px] flex items-center gap-[8px] shadow-sm w-fit">
                  <div className="w-6 h-6 rounded-full bg-[#A390FB] flex items-center justify-center text-white text-[11px] shrink-0">
                    ▣
                  </div>
                  <span className="text-white text-[13px] font-medium whitespace-nowrap">Web Design</span>
                </div>
                <div className="self-end mr-2 bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-full px-[12px] py-[8px] flex items-center gap-[8px] shadow-sm w-fit">
                  <div className="w-6 h-6 rounded-full bg-[#A390FB] flex items-center justify-center text-white text-[11px] shrink-0">
                    ◫
                  </div>
                  <span className="text-white text-[13px] font-medium whitespace-nowrap">UI UX Design</span>
                </div>
                <div className="self-start ml-2 mb-14 bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-full px-[12px] py-[8px] flex items-center gap-[8px] shadow-sm w-fit">
                  <div className="w-6 h-6 rounded-full bg-[#A390FB] flex items-center justify-center text-white text-[11px] shrink-0">
                    &lt;/&gt;
                  </div>
                  <span className="text-white text-[13px] font-medium whitespace-nowrap">Frontend Implementation</span>
                </div>

                {/* Stationary Supporting Text */}
                <div className="absolute bottom-6 inset-x-0 flex items-center justify-center pointer-events-none select-none">
                  <span className="font-sans font-semibold text-[24px] text-white tracking-tight leading-none drop-shadow-sm">
                    2+ Years
                  </span>
                </div>
              </div>
              <div className="w-full mt-5 flex items-center justify-between px-2 text-xs">
                <span className="text-[#8E8E93] opacity-40">UI UX Designer</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#A390FB]/30 shadow-xs font-medium text-[#171717]">
                  <span className="w-4 h-4 rounded-full bg-[#A390FB] text-white flex items-center justify-center text-[9px]">→</span>
                  Experience
                </span>
                <span className="text-[#8E8E93] opacity-40">Clients</span>
              </div>
            </div>

            {/* State 3: Client Industries */}
            <div className="flex flex-col items-center w-full max-w-[320px]">
              <div
                className="relative w-full h-[420px] rounded-[20px] p-5 flex flex-col justify-start gap-4 border border-white/10 shadow-sm overflow-hidden"
                style={{
                  backgroundColor: '#0E0E10',
                  backgroundImage: `
                    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '28px 28px',
                }}
              >
                <div className="self-start bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-full px-[12px] py-[8px] flex items-center gap-[8px] w-fit max-w-[calc(100%-16px)] shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#18181C] border border-white/10 flex items-center justify-center text-[#F5A623] shrink-0 text-sm">
                    ★
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <div className="text-white text-[13px] font-medium leading-tight whitespace-nowrap">Educational</div>
                    <div className="text-[#8E8E93] text-[11px] leading-snug mt-0.5 whitespace-nowrap">Aptech Aviation , Aptech , Balika Jalan</div>
                  </div>
                </div>

                <div className="self-end mr-1 bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-full px-[12px] py-[8px] flex items-center gap-[8px] w-fit max-w-[calc(100%-16px)] shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#18181C] border border-white/10 flex items-center justify-center text-[#FF5B37] font-mono font-bold text-[11px] shrink-0">
                    IL
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <div className="text-white text-[13px] font-medium leading-tight whitespace-nowrap">Real Estate</div>
                    <div className="text-[#8E8E93] text-[11px] leading-snug mt-0.5 whitespace-nowrap">PH Realtors, Elvan , Srijan</div>
                  </div>
                </div>

                <div className="self-start ml-2 bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-full px-[12px] py-[8px] flex items-center gap-[8px] w-fit max-w-[calc(100%-16px)] shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-[#5A31F4] shrink-0 text-sm">
                    ◆
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <div className="text-white text-[13px] font-medium leading-tight whitespace-nowrap">Lottery</div>
                    <div className="text-[#8E8E93] text-[11px] leading-snug mt-0.5 whitespace-nowrap">Vira Agency</div>
                  </div>
                </div>

                {/* Stationary Supporting Text */}
                <div className="absolute bottom-6 inset-x-0 flex items-center justify-center pointer-events-none select-none">
                  <span className="font-sans font-semibold text-[24px] text-white tracking-tight leading-none drop-shadow-sm">
                    Industries
                  </span>
                </div>
              </div>
              <div className="w-full mt-5 flex items-center justify-between px-2 text-xs">
                <span className="text-[#8E8E93] opacity-40">Experience</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#A390FB]/30 shadow-xs font-medium text-[#171717]">
                  <span className="w-4 h-4 rounded-full bg-[#A390FB] text-white flex items-center justify-center text-[9px]">→</span>
                  Clients
                </span>
                <span className="text-[#8E8E93] opacity-40">UI UX Designer</span>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.08] bg-[#F6F5F1] py-8 text-center text-xs text-[#545454]">
        <p>Sourav Haldar Portfolio • Hero Section 3D Rotating Information Slider</p>
      </footer>

    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HeroSliderPreview />
  </React.StrictMode>
)

