import React, { useState } from 'react'
import PortfolioLoader from './components/PortfolioLoader'
import HomepagePreview from './components/HomepagePreview'

/**
 * App Component - Sourav Haldar UI/UX Portfolio
 *
 * Current Phase: Priority One — Custom Animated Blueprint Loader
 * Controls the full-screen loader lifecycle and transition into the homepage.
 */
export default function App() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('skipLoader') === 'true' || params.get('skipLoader') === '1') {
        return false
      }
    }
    return true
  })

  return (
    <div className="relative min-h-screen bg-canvas text-primary font-sans">
      {/* 
        Loader Component:
        - Stationary SH logo at center
        - Outward extending geometric construction lines
        - Preserved #A390FB lavender accent
        - Automatic transition on complete
      */}
      {loading && (
        <PortfolioLoader
          onComplete={() => {
            setLoading(false)
          }}
        />
      )}

      {/* 
        Homepage Preview & Review Hub:
        Visible once the loader completes, allowing easy replay and geometry inspection.
      */}
      <HomepagePreview isLoaded={!loading} onReplayLoader={() => setLoading(true)} />
    </div>
  )
}
