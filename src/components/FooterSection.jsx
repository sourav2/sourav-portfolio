import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedBorderBadge from './AnimatedBorderBadge'
import AnimatedEmoji from './AnimatedEmoji'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * FooterSection Component
 *
 * Implements the official footer section based on the Figma reference:
 * - Full-width minimal editorial section with warm off-white background (#F7F5F0)
 * - Heading: Faculty Glyphic, large black typography
 *   "Enough scrolling.\nLet's start something. 👋"
 * - Email & Copy interaction: souravhaldar2@gmail.com with Gmail icon & copy button
 * - Social Links: Behance ↗, LinkedIn ↗, GitHub ↗ vertically stacked with subtle lavender borders
 * - Renaissance Artwork: David sculpture positioned at bottom-right corner, gently blending into background
 * - Subtle viewport entrance animation with GSAP ScrollTrigger
 */
export default function FooterSection({ className = '' }) {
  const footerRef = useRef(null)
  const headingRef = useRef(null)
  const emailRef = useRef(null)
  const artworkRef = useRef(null)

  const [copied, setCopied] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const emailAddress = 'souravhaldar2@gmail.com'

  const handleCopyEmail = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(emailAddress)
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea')
        textarea.value = emailAddress
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mq.matches)
      const handler = (e) => setPrefersReducedMotion(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [])

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !footerRef.current ||
      prefersReducedMotion
    ) {
      return
    }

    const ctx = gsap.context(() => {
      // Gentle reveal for David artwork as footer approaches viewport
      if (artworkRef.current) {
        gsap.from(artworkRef.current, {
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 24,
          scale: 0.98,
          duration: 1.2,
          ease: 'power2.out',
        })
      }
    }, footerRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  const socialLinks = [
    {
      id: 'behance',
      name: 'Behance',
      url: 'https://www.behance.net/souravhaldar',
      icon: (
        <svg
          className="w-4 h-4 shrink-0 rounded-full"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" fill="#0057ff" />
          <path
            fill="#ffffff"
            d="M14.2 9.2h3.6v.9h-3.6v-.9zm-6.2 5.6H6.1V9.2H8c1.3 0 2 .5 2 1.4 0 .6-.3 1.1-.9 1.3.8.2 1.2.8 1.2 1.5 0 1-.8 1.4-2.3 1.4zm-.2-3.1c.6 0 1-.2 1-.7s-.4-.7-1-.7H7.1v1.4h.7zm.1 2.3c.7 0 1.2-.2 1.2-.8s-.4-.8-1.1-.8H7.1v1.6h.8zm7.3-.2c.6 0 1-.3 1.2-.8h1.4c-.3 1.1-1.3 1.8-2.6 1.8-1.7 0-2.8-1.2-2.8-2.8s1.1-2.9 2.8-2.9c1.6 0 2.7 1.1 2.7 2.7v.4h-4.1c0 .9.6 1.6 1.4 1.6zm-.1-2.4c-.6 0-1.1.4-1.3 1h2.5c-.1-.6-.6-1-1.2-1z"
          />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/souravhaldar',
      icon: (
        <svg
          className="w-4 h-4 shrink-0 rounded-full"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" fill="#0A66C2" />
          <path
            fill="#ffffff"
            d="M8.2 16.5H6.2v-6.3h2v6.3zm-1-7.2c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2 1.2.5 1.2 1.2-.5 1.2-1.2 1.2zm10.6 7.2h-2v-3.3c0-.9-.3-1.5-1.1-1.5-.6 0-1 .4-1.1.9-.1.2-.1.4-.1.6v3.3h-2s.03-5.7 0-6.3h2v.9c.3-.4.8-1 1.9-1 1.4 0 2.3.9 2.3 2.9v3.5z"
          />
        </svg>
      ),
    },
    {
      id: 'github',
      name: 'Github',
      url: 'https://github.com/souravhaldar',
      icon: (
        <svg
          className="w-4 h-4 shrink-0 rounded-full"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" fill="#171717" />
          <path
            fill="#ffffff"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 6C8.686 6 6 8.686 6 12c0 2.655 1.724 4.908 4.115 5.702.3.055.41-.13.41-.29 0-.142-.005-.52-.008-1.022-1.669.363-2.021-.806-2.021-.806-.272-.695-.666-.88-.666-.88-.545-.372.041-.365.041-.365.602.042.918.62.918.62.535.918 1.405.653 1.746.5.055-.388.21-.653.382-.803-1.332-.152-2.733-.668-2.733-2.97 0-.656.234-1.193.617-1.613-.062-.152-.268-.763.059-1.59 0 0 .504-.162 1.65.616A5.738 5.738 0 0112 8.906c.51.002 1.023.069 1.502.202 1.146-.778 1.648-.616 1.648-.616.328.827.122 1.438.06 1.59.385.42.617.957.617 1.613 0 2.309-1.403 2.816-2.74 2.966.216.185.407.552.407 1.113 0 .803-.007 1.452-.007 1.648 0 .161.108.348.413.289C16.278 16.906 18 14.653 18 12c0-3.314-2.686-6-6-6z"
          />
        </svg>
      ),
    },
  ]

  return (
    <footer
      id="contact"
      ref={footerRef}
      className={`relative w-full h-screen h-[100svh] min-h-[100vh] max-h-[100svh] flex items-center bg-transparent text-primary overflow-hidden select-none py-8 lg:py-0 ${className}`}
      aria-label="Footer and Contact Section"
    >
      {/* Container aligned to main website container (max-w-[1440px]) */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 flex flex-col justify-center">

        {/* Left-Aligned Editorial Content */}
        <div className="max-w-3xl lg:max-w-4xl flex flex-col">

          {/* Main Heading in Faculty Glyphic (Standardized 32px mobile -> 64px desktop) */}
          <h2
            ref={headingRef}
            className="font-['Faculty_Glyphic',serif] type-section-heading text-[32px] sm:text-[44px] md:text-[52px] lg:text-[64px] font-normal leading-[1.14] lg:leading-[1.08] text-primary tracking-tight"
          >
            Enough scrolling.
            <br />
            <span className="inline-flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap">
              Let's start something.
              <AnimatedEmoji
                variant="wave"
                ariaLabel="Waving hand"
                className="text-[0.9em]"
              >
                👋
              </AnimatedEmoji>
            </span>
          </h2>

          {/* Email with Gmail Icon & Interactive Copy Button (Exact 40px below Heading) */}
          <div
            ref={emailRef}
            className="mt-[40px] inline-flex items-center gap-2.5 text-[15px] sm:text-[16px] text-secondary font-sans tracking-tight"
          >
            {/* Official Google Gmail Icon */}
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052C21.69 2.28 24 3.434 24 5.457z"
                fill="#EA4335"
              />
              <path
                d="M0 5.457v13.909c0 .904.732 1.636 1.636 1.636h3.819V11.73L0 7.822v-2.365z"
                fill="#4285F4"
              />
              <path
                d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L24 7.822v-2.365z"
                fill="#34A853"
              />
              <path
                d="M18.545 11.73V21H5.455v-9.27L12 16.64l6.545-4.91z"
                fill="#FBBC05"
              />
            </svg>

            {/* Email Address Link */}
            <a
              href={`mailto:${emailAddress}`}
              className="hover:text-primary transition-colors cursor-pointer select-text font-normal underline-offset-4 hover:underline"
              aria-label={`Send email to ${emailAddress}`}
            >
              {emailAddress}
            </a>

            {/* Copy Email Button with Feedback */}
            <button
              onClick={handleCopyEmail}
              className="relative inline-flex items-center justify-center p-1.5 rounded-md hover:bg-black/[0.04] text-secondary hover:text-primary transition-colors cursor-pointer ml-0.5"
              title="Copy email to clipboard"
              aria-label="Copy email address"
            >
              {copied ? (
                <svg
                  className="w-4 h-4 text-accent"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}

              {/* Toast Feedback Tooltip */}
              {copied && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[11px] font-mono font-medium rounded bg-primary text-white shadow-xs pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                  Copied!
                </span>
              )}
            </button>
          </div>

          {/* Social Links (Exact 40px below Email, Exact 36px between consecutive pills) */}
          <div className="mt-[40px] flex flex-col items-start space-y-[36px]">
            {socialLinks.map((link) => (
              <AnimatedBorderBadge
                key={link.id}
                as="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${link.name} profile in new tab`}
                className="group bg-white/95 hover:bg-white transition-all duration-200 cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(163,144,251,0.22)] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                contentClassName="text-[16px] font-medium text-primary gap-2"
              >
                {/* Brand Icon */}
                {link.icon}

                {/* Brand Name */}
                <span>{link.name}</span>

                {/* Outward External Arrow */}
                <span
                  className="font-sans text-[14px] text-secondary group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150 ml-0.5"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </AnimatedBorderBadge>
            ))}
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* Renaissance Artwork (David Sketch in Bottom-Right Corner)    */}
      {/* ============================================================ */}
      <div
        ref={artworkRef}
        className="absolute right-0 bottom-0 pointer-events-none select-none z-0 overflow-hidden w-[380px] sm:w-[500px] md:w-[640px] lg:w-[840px] xl:w-[960px] max-w-[62vw]"
        aria-hidden="true"
      >
        <img
          src="/assets/david-sketch.png"
          alt="Michelangelo David Sketch Artwork"
          className="w-full h-auto object-contain object-right-bottom mix-blend-multiply opacity-80 sm:opacity-90 lg:opacity-95 transition-opacity"
          style={{
            maskImage:
              'radial-gradient(ellipse 85% 85% at 90% 90%, black 45%, rgba(0,0,0,0.8) 65%, rgba(0,0,0,0.2) 85%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 85% 85% at 90% 90%, black 45%, rgba(0,0,0,0.8) 65%, rgba(0,0,0,0.2) 85%, transparent 100%)',
            filter: 'contrast(1.05) brightness(0.97)',
          }}
          loading="lazy"
        />
      </div>
    </footer>
  )
}
