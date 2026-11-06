import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import App from './App.jsx'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  window.gsap = gsap
  window.ScrollTrigger = ScrollTrigger
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
