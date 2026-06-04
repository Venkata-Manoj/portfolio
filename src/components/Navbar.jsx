import { useState, useEffect, useCallback } from 'react'
import { Menu, X, Play } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
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

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const scrollPosition = window.scrollY + window.innerHeight / 3

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact')
        return
      }

      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
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
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 transition-all duration-500">
      <nav
        className={`mx-auto max-w-5xl rounded-full flex items-center justify-between border transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0C0C0E]/85 backdrop-blur-xl border-white/[0.06] px-6 py-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]'
            : 'bg-transparent border-transparent px-6 py-4'
        }`}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, 'hero')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center font-['Kanit'] font-black text-xs text-white transition-transform group-hover:scale-105 duration-300">
            M
          </div>
          <span className="font-['Kanit'] font-bold tracking-widest text-xs text-white/80 group-hover:text-white transition-colors">
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
                className={`relative px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-all duration-300 rounded-full ${
                  isActive
                    ? 'text-white bg-white/[0.06]'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onStartTour}
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white hover:border-white/20 font-semibold text-[9px] uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500" />
            </span>
            <span>Tour</span>
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden items-center justify-center w-9 h-9 rounded-full border border-white/[0.08] text-white/50 hover:text-white transition-colors cursor-pointer hover:bg-white/[0.04]"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`absolute left-4 right-4 top-20 rounded-3xl border border-white/[0.08] bg-[#0C0C0E]/95 backdrop-blur-2xl p-6 shadow-2xl shadow-black/90 flex flex-col gap-4 transition-all duration-300 ${
          isOpen
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
                className={`flex items-center px-4 py-3 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all duration-200 ${
                  isActive
                    ? 'bg-white/[0.06] text-white border border-white/[0.06]'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/[0.02]'
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </div>

        <div className="h-px bg-white/[0.06] my-1" />

        <button
          onClick={() => {
            setIsOpen(false)
            onStartTour()
          }}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/10 text-[10px] font-semibold uppercase tracking-widest text-white transition-all cursor-pointer"
        >
          <Play size={10} className="fill-white" />
          <span>Start Tour</span>
        </button>
      </div>
    </header>
  )
}
