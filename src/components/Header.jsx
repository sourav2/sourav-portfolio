import React, { useState } from 'react'
import SHLogo from './SHLogo'
import HeaderNavLink from './HeaderNavLink'
import AnimatedCTA from './AnimatedCTA'

/**
 * Header Component
 *
 * The official portfolio header engineered to match the reference design system:
 * - Left: Stationary SH Logo component with architectural drafting guides and lavender accent bracket.
 * - Right: Navigation links (Home, About, Works) using HeaderNavLink with animated 2px-offset underline.
 * - Far Right: AnimatedCTA pill button ("Get In Touch") with interactive hover shift and arrow transition.
 *
 * Styling Guidelines:
 * - Absolutely no background color (100% transparent, inherits canvas background).
 * - No borders, shadows, or decorative lines.
 * - Single horizontal row with vertically centered alignment.
 * - Responsive layout scaling gracefully across mobile, tablet, and desktop viewports.
 *
 * @param {Object} props
 * @param {string} [props.activeLink='Home'] - Currently active navigation link label or ID
 * @param {Array<{label: string, href: string, id?: string}>} [props.navItems] - Navigation link definitions
 * @param {string} [props.ctaText='Get In Touch'] - Call-to-action button label
 * @param {string} [props.ctaHref='#contact'] - Destination URL for the CTA button
 * @param {Function} [props.onNavClick] - Callback when any navigation link is clicked
 * @param {Function} [props.onCtaClick] - Callback when the CTA button is clicked
 * @param {string} [props.className=''] - Additional class names for header container
 */
export default function Header({
  activeLink = 'Home',
  navItems = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Works', href: '#works', id: 'works' },
  ],
  ctaText = 'Get In Touch',
  ctaHref = '#contact',
  onNavClick,
  onCtaClick,
  className = '',
}) {
  const [currentActive, setCurrentActive] = useState(activeLink)

  const handleLinkClick = (item, e) => {
    setCurrentActive(item.label)
    if (onNavClick) {
      onNavClick(item, e)
    }
  }

  return (
    <header
      className={`w-full bg-transparent border-none shadow-none select-none ${className}`}
      role="banner"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-5 sm:py-6 md:py-7 flex items-center justify-between gap-4">
        
        {/* ============================================================ */}
        {/* LEFT: Existing SH Logo Component with Drafting Guidelines    */}
        {/* ============================================================ */}
        <a
          href="#home"
          aria-label="Sourav Haldar - Home"
          className="inline-flex items-center justify-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 rounded-xs transition-opacity hover:opacity-85"
        >
          <SHLogo
            size={60}
            showGuides={true}
            guideOpacity={0.35}
            className="w-[56px] sm:w-[62px] h-auto"
          />
        </a>

        {/* ============================================================ */}
        {/* RIGHT: Navigation Links + Animated CTA (Consistent Spacing)  */}
        {/* ============================================================ */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 shrink-0">
          
          {/* Navigation Links Group */}
          <nav
            aria-label="Primary Navigation"
            className="flex items-center gap-4 sm:gap-6 md:gap-8"
          >
            {navItems.map((item) => {
              const isActive =
                currentActive.toLowerCase() === item.label.toLowerCase() ||
                (item.id && currentActive.toLowerCase() === item.id.toLowerCase())

              return (
                <HeaderNavLink
                  key={item.label}
                  href={item.href}
                  isActive={isActive}
                  onClick={(e) => handleLinkClick(item, e)}
                  animationStyle="left"
                  underlineSpacing={2}
                  underlineThickness={1}
                >
                  {item.label}
                </HeaderNavLink>
              )
            })}
          </nav>

          {/* Far Right: Existing Animated CTA Component */}
          <div className="shrink-0">
            <AnimatedCTA
              text={ctaText}
              href={ctaHref}
              onClick={onCtaClick}
              ariaLabel={ctaText}
            />
          </div>

        </div>

      </div>
    </header>
  )
}
