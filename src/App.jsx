import React, { useState, useEffect } from 'react'
import PortfolioLoader from './components/PortfolioLoader'
import HomepagePreview from './components/HomepagePreview'
import CaseStudyTemplate from './components/CaseStudyTemplate'
import { getCaseStudyById, ELVAN_CASE_STUDY } from './data/caseStudiesData'

/**
 * Helper to determine current route from URL search params or hash
 */
function getActiveRoute() {
  if (typeof window === 'undefined') return { view: 'home' }

  // 1. Check query parameter: ?caseStudy=elvan or ?project=elvan
  const params = new URLSearchParams(window.location.search)
  const queryProject = params.get('caseStudy') || params.get('project')
  if (queryProject) {
    return { view: 'case-study', projectId: queryProject }
  }

  // 2. Check hash: #case-study-elvan or #/case-study/elvan
  const hash = window.location.hash || ''
  if (hash.startsWith('#case-study-')) {
    const id = hash.replace('#case-study-', '')
    return { view: 'case-study', projectId: id }
  }
  if (hash.startsWith('#/case-study/')) {
    const id = hash.replace('#/case-study/', '')
    return { view: 'case-study', projectId: id }
  }

  return { view: 'home' }
}

/**
 * App Component - Sourav Haldar UI/UX Portfolio
 *
 * Controls top-level routing between:
 * 1. Homepage & Viewport Section Navigation (HomepagePreview)
 * 2. Dedicated Master Case Study Presentation Template (CaseStudyTemplate)
 */
export default function App() {
  const [route, setRoute] = useState(getActiveRoute)

  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('skipLoader') === 'true' || params.get('skipLoader') === '1') {
        return false
      }
      // If entering directly to a case study, skip loader
      const initialRoute = getActiveRoute()
      if (initialRoute.view === 'case-study') {
        return false
      }
    }
    return true
  })

  // Listen for hashchange and popstate events for seamless back/forward navigation
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleRouteChange = () => {
      const nextRoute = getActiveRoute()
      setRoute(nextRoute)
    }

    window.addEventListener('hashchange', handleRouteChange)
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('hashchange', handleRouteChange)
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  // Handler to return to homepage works section
  const handleBackToHome = () => {
    if (typeof window !== 'undefined') {
      // Clear query params if present, anchor to works section
      const url = new URL(window.location.href)
      url.searchParams.delete('caseStudy')
      url.searchParams.delete('project')
      window.history.pushState({}, '', url.pathname + '#works')
      setRoute({ view: 'home' })
    }
  }

  // 1. If currently in Case Study Presentation View
  if (route.view === 'case-study') {
    const projectData = getCaseStudyById(route.projectId) || ELVAN_CASE_STUDY
    return (
      <div className="relative min-h-screen bg-canvas text-primary font-sans">
        <CaseStudyTemplate
          key={projectData.id}
          project={projectData}
          onBack={handleBackToHome}
        />
      </div>
    )
  }

  // 2. Otherwise render Portfolio Homepage
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
        Homepage Preview & Section Navigation Hub:
        Visible once the loader completes, allowing easy replay and geometry inspection.
      */}
      <HomepagePreview isLoaded={!loading} onReplayLoader={() => setLoading(true)} />
    </div>
  )
}
