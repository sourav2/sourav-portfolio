import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import CaseStudyTemplate from './components/CaseStudyTemplate'
import {
  ELVAN_CASE_STUDY,
  ROAMIO_CASE_STUDY,
  PHREALTORS_CASE_STUDY,
  GHREALL_CASE_STUDY,
  APTECH_CASE_STUDY,
  ALL_CASE_STUDIES,
} from './data/caseStudiesData'
import './index.css'

function CaseStudyPreviewApp() {
  const [selectedId, setSelectedId] = useState('elvan')
  const currentProject = ALL_CASE_STUDIES[selectedId] || ELVAN_CASE_STUDY

  const projects = [
    { id: 'elvan', label: '01 ELVAN (8 Sections)' },
    { id: 'roamio', label: '02 ROAMIO AI (9 Slides)' },
    { id: 'ghreall', label: '03 PH REALTORS (6 Slides)' },
    { id: 'aptech', label: '04 APTECH AVIATION (8 Slides)' },
  ]

  return (
    <div className="min-h-screen bg-canvas text-primary font-sans">
      {/* Top Template Inspector Bar */}
      <div className="bg-[#171717] text-white py-2 px-4 sm:px-8 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-white/10 z-50 relative select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-white/80 uppercase tracking-wider">
            Case Study Presentation Template • Reusable Project Inspector
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white/50 font-mono hidden sm:inline">Active Project:</span>
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`px-2.5 py-1 rounded-sm font-mono text-[11px] transition-all cursor-pointer ${
                selectedId === p.id
                  ? 'bg-accent text-[#171717] font-semibold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white/80'
              }`}
            >
              {p.label}
            </button>
          ))}
          <a
            href="/"
            className="ml-2 px-2.5 py-1 rounded-sm font-mono text-[11px] bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
          >
            ← View Portfolio
          </a>
        </div>
      </div>

      {/* Main Reusable Case Study Template */}
      <CaseStudyTemplate
        key={selectedId}
        project={currentProject}
        onBack={() => {
          window.location.href = '/'
        }}
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CaseStudyPreviewApp />
  </React.StrictMode>
)

