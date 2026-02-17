'use client'

import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'What we do', href: '#what-we-do' },
  { label: 'Products', href: '#products' },
  { label: 'How we work', href: '#how-we-work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const SECTION_IDS = ['what-we-do', 'focus', 'products', 'how-we-work', 'about', 'contact']

export function Header() {
  const [activeSection, setActiveSection] = useState<string>('')
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  // Scroll-spy via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0px -75% 0px', threshold: 0 },
    )

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  function handleNavClick() {
    setMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="font-semibold text-lg">
            Nexto
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-8">
            {NAV_LINKS.map(({ label, href }) => {
              const sectionId = href.replace('#', '')
              const isActive = activeSection === sectionId
              return (
                <a
                  key={href}
                  href={href}
                  className={
                    isActive
                      ? 'text-sm font-semibold text-neutral-900'
                      : 'text-sm text-neutral-600 hover:text-neutral-900 transition-colors'
                  }
                >
                  {label}
                </a>
              )
            })}
          </nav>

          {/* Hamburger button (mobile only) */}
          <button
            className="md:hidden"
            aria-label="Open navigation menu"
            onClick={() => setMenuOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Dark overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-6">
          <button
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile nav links */}
        <nav className="flex flex-col px-6">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={handleNavClick}
              className="text-lg py-3 text-neutral-700 hover:text-neutral-900 transition-colors border-b border-neutral-100"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </>
  )
}
