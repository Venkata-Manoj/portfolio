import { useState, useEffect, useCallback } from 'react'
import { Menu, X, Play, Download } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar({ onStartTour }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = useCallback((e, id) => {
    e.preventDefault()
    setIsOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Track scrolled state for nav background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Active section detection via IntersectionObserver (no per-scroll DOM reads)
  useEffect(() => {
    const observers = []
    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id)
      if (!el) return
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(item.id)
            }
          })
        },
        { rootMargin: '-30% 0px -50% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    // Bottom-of-page fallback: when scrolled to end, force 'contact' active
    const handleBottom = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60
      ) {
        setActiveSection('contact')
      }
    }
    window.addEventListener('scroll', handleBottom, { passive: true })

    return () => {
      observers.forEach((o) => o.disconnect())
      window.removeEventListener('scroll', handleBottom)
    }
  }, [])

  // Auto-close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header className="sticky top-0 left-0 right-0 z-50 transition-all duration-300">
      <nav
        className={`mx-auto max-w-5xl rounded-full flex items-center justify-between border transition-all duration-500 px-4 py-3 ${isScrolled
          ? 'bg-[#0C0C0E]/80 backdrop-blur-xl border-[#D4A574]/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.6),0_0_24px_-8px_rgba(212,165,116,0.06)]'
          : 'bg-transparent border-transparent'
          }`}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, 'hero')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <img
            src="/favicon.png"
            alt="B V Manoj"
            className="w-8 h-8 rounded-full object-cover shadow-[0_0_14px_rgba(212,165,116,0.25)] transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-['Kanit'] font-bold tracking-widest text-xs text-[#EDE7D9]/80 group-hover:text-[#EDE7D9] transition-colors duration-300">
            Manoj
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative overflow-hidden px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-all duration-300 rounded-full ${isActive
                  ? 'bg-gradient-to-r from-[#D4A574] to-[#E8C88A] bg-clip-text text-transparent'
                  : 'text-white/40 hover:text-[#D4A574]/80'
                  }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-[60%] h-[2px] rounded-full bg-gradient-to-r from-[#D4A574] to-[#E8C88A]" />
                )}
              </a>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="/Resume_Manoj.pdf"
            download="Resume_BV_Manoj.pdf"
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4A574]/30 bg-transparent text-[#D4A574] font-semibold text-[9px] uppercase tracking-widest transition-all duration-300 hover:bg-[#D4A574]/10 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
          >
            <Download size={12} />
            <span>Resume</span>
          </a>

          <button
            type="button"
            onClick={onStartTour}
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D4A574] to-[#A67C52] text-[#0C0C0C] shadow-[0_4px_16px_-4px_rgba(212,165,116,0.3)] font-semibold text-[9px] uppercase tracking-widest transition-all duration-300 hover:shadow-[0_4px_20px_-4px_rgba(212,165,116,0.45)] hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A574] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4A574]" />
            </span>
            <span>Tour</span>
          </button>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden items-center justify-center w-10 h-10 rounded-full border border-[#D4A574]/20 text-white/50 hover:text-[#D4A574] transition-colors duration-300 hover:bg-[#D4A574]/8"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer - Absolute positioned relative to header */}
      <div
        className={`absolute left-4 right-4 top-full z-40 mt-2 rounded-3xl border border-[#D4A574]/10 bg-[#0C0C0E]/95 backdrop-blur-2xl p-6 shadow-2xl shadow-black/90 flex flex-col gap-4 transition-all duration-300 ${isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-4 pointer-events-none'
          } md:hidden`}
      >
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative flex items-center px-4 py-4 rounded-xl text-[11px] font-semibold uppercase tracking-widest transition-all duration-200 overflow-hidden ${isActive
                  ? 'bg-[#D4A574]/8 bg-gradient-to-r from-[#D4A574] to-[#E8C88A] bg-clip-text text-transparent'
                  : 'text-white/40 hover:text-[#D4A574]/80 hover:bg-[#D4A574]/5 active:text-[#D4A574]'
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full bg-gradient-to-b from-[#D4A574] to-[#E8C88A]" />
                )}
                {item.label}
              </a>
            )
          })}
        </div>

        <div className="h-px bg-[#D4A574]/10 my-1" />

        <a
          href="/Resume_Manoj.pdf"
          download="Resume_BV_Manoj.pdf"
          onClick={() => setIsOpen(false)}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-[#D4A574]/30 bg-transparent text-[#D4A574] text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 hover:bg-[#D4A574]/10 active:scale-[0.98]"
        >
          <Download size={16} />
          <span>Resume</span>
        </a>

        <button
          type="button"
          onClick={() => {
            setIsOpen(false)
            onStartTour()
          }}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-[#D4A574] to-[#A67C52] text-[#0C0C0C] shadow-[0_4px_16px_-4px_rgba(212,165,116,0.3)] text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_4px_20px_-4px_rgba(212,165,116,0.45)] active:scale-[0.98]"
        >
          <Play size={12} className="fill-white" />
          <span>Start Tour</span>
        </button>
      </div>
    </header>
  )
}
