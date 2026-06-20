import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useIsMobile } from '../hooks/useIsMobile'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import { useInfiniteCarousel } from '../hooks/useInfiniteCarousel'

/* =====================================================================
   DATA — 6 projects with gold/bronze palette accent colors
   ===================================================================== */
const PROJECTS = [
  {
    number: '01',
    emoji: '🎬',
    name: 'videoreverse',
    description: 'Tool to deconstruct videos into production-ready prompts for video AI models.',
    tech: ['Python'],
    accent: '#D4A574', // Warm Gold
    accent2: '#B8895E',
    github: 'https://github.com/Venkata-Manoj/videoreverse',
    live: null,
  },
  {
    number: '02',
    emoji: '🤖',
    name: 'AI-News-Bot',
    description: 'Autonomous news intelligence with a 6-LLM fallback chain — scrapes 6 sources and delivers rich Telegram cards every 45 minutes.',
    tech: ['Python', 'Multi-LLM', 'SQLite'],
    accent: '#A67C52', // Bronze
    accent2: '#8B6642',
    github: 'https://github.com/Venkata-Manoj/AI-News-Bot',
    live: null,
  },
  {
    number: '03',
    emoji: '🔬',
    name: 'WhatIF',
    description: 'AI-powered UI component analyzer — paste any React/Vue/HTML component for instant risk identification and exportable PDF reports.',
    tech: ['TypeScript', 'Next.js', 'Firebase', 'Genkit'],
    accent: '#C4956A', // Antique Gold
    accent2: '#A67C52',
    github: 'https://github.com/Venkata-Manoj/WhatIF',
    live: 'https://what-if-henna.vercel.app',
  },
  {
    number: '04',
    emoji: '📄',
    name: 'Capstone-Forage',
    description: 'RAG-powered report generator — ingests PDFs, DOCX, and images to produce institution-compliant capstone reports via FAISS + Ollama.',
    tech: ['Python', 'FastAPI', 'FAISS', 'Ollama'],
    accent: '#B8895E', // Copper
    accent2: '#9A7048',
    github: 'https://github.com/Venkata-Manoj/Capstone-Forage',
    live: null,
  },
  {
    number: '05',
    emoji: '🛡️',
    name: 'Resilience-Ops-Env',
    description: 'Gym-style RL environment for IT incident response — AI agents learn triage, diagnosis, and recovery across progressive difficulty levels.',
    tech: ['Python', 'RL', 'OpenAI Gym'],
    accent: '#E8B4A0', // Rose Gold
    accent2: '#D49A84',
    github: 'https://github.com/Venkata-Manoj/Resilience-Ops-Env',
    live: null,
  },
]

// Special 6th card — GitHub CTA (no flip)
const GITHUB_CARD = {
  number: '06',
  emoji: '📦',
  name: 'Explore More on GitHub',
  description: 'Discover all my open-source repositories, contributions, and ongoing projects.',
  accent: '#C0B8A8', // Warm Silver
  accent2: '#A89F90',
  github: 'https://github.com/Venkata-Manoj',
}

const ALL_PROJECTS = [...PROJECTS, GITHUB_CARD] // 6 items
const TOTAL = ALL_PROJECTS.length
const CLONE_COUNT = 3

// Build flat array of clones for infinite scroll:
// [clone copy 0, clone copy 1, original copy, clone copy 2, clone copy 3]
const ITEMS = []
for (let i = 0; i < CLONE_COUNT + 1; i++) {
  ITEMS.push(...ALL_PROJECTS)
}
// 24 items total

/* =====================================================================
   PROJECT CARD — Click-to-flip with shimmer + gold glow
   ===================================================================== */
function ProjectCard({ project, index, isMobile }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const flippingRef = useRef(false)
  const cardRef = useRef(null)
  const innerRef = useRef(null)
  const inView = useInView(cardRef, { once: true, margin: '-40px' })

  // --- Flip handler ---
  const handleFlip = useCallback(
    () => {
      if (flippingRef.current) return
      flippingRef.current = true

      const el = innerRef.current
      if (!el) return

      const newFlipped = !isFlipped
      setIsFlipped(newFlipped)

      // On mobile: simple show/hide without 3D flip (handled via state-driven style transitions on children)
      if (isMobile) {
        setTimeout(() => {
          flippingRef.current = false
        }, 300)
        return
      }

      // Desktop: full 3D flip animation
      el.style.transition =
        'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease'
      el.style.transform = newFlipped
        ? 'rotateY(180deg)'
        : 'rotateX(0deg) rotateY(0deg)'
      el.style.boxShadow =
        '0 8px 40px rgba(0,0,0,0.4), 0 2px 12px rgba(0,0,0,0.3)'

      setTimeout(() => {
        flippingRef.current = false
      }, 700)
    },
    [isFlipped, isMobile]
  )

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleFlip({ target: {} })
      }
    },
    [handleFlip]
  )

  // Simplified entrance animation on mobile
  const initialVariants = isMobile
    ? { opacity: 0, y: 20 }
    : { opacity: 0, scale: 0.85, y: 30 }
  const animateVariants = isMobile
    ? { opacity: 1, y: 0 }
    : { opacity: 1, scale: 1, y: 0 }
  const transitionConfig = isMobile
    ? { duration: 0.4, delay: (index % TOTAL) * 0.05, ease: [0.22, 1, 0.36, 1] }
    : { duration: 0.6, delay: (index % TOTAL) * 0.1, ease: [0.22, 1, 0.36, 1] }

  return (
    <motion.div
      ref={cardRef}
      initial={initialVariants}
      animate={inView ? animateVariants : {}}
      transition={transitionConfig}
      className="card relative shrink-0 snap-center rounded-3xl overflow-hidden group w-[85vw] lg:w-[400px] glass"
      style={{ minHeight: 480 }}
      whileHover={isMobile ? {} : { y: -6 }}
    >
      {/* ── Background gradient ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            background: [
              `radial-gradient(ellipse 80% 60% at 30% 40%, ${project.accent} 0%, transparent 70%)`,
              `radial-gradient(ellipse 60% 70% at 70% 60%, ${project.accent2} 0%, transparent 70%)`,
              `linear-gradient(145deg, ${project.accent}, ${project.accent2})`,
            ].join(', '),
          }}
        />
      </div>

      {/* ── Card inner — 3D flip target ── */}
      <div
        ref={innerRef}
        className="card-inner relative w-full h-full min-h-[480px] rounded-[24px]"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1200px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 2px 12px rgba(0,0,0,0.3)',
          transform: 'rotateX(0deg) rotateY(0deg)',
        }}
      >
        {/* ══════ FRONT FACE ══════ */}
        <div
          className="card-face absolute inset-0 rounded-[24px] overflow-hidden flex z-[2] glass-card"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            ...(isMobile ? {
              opacity: isFlipped ? 0 : 1,
              pointerEvents: isFlipped ? 'none' : 'auto',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              transform: isFlipped ? 'scale(0.95)' : 'scale(1)',
            } : {})
          }}
        >
          {/* ── Left panel (58%) ── */}
          <div className="card-front-left flex-[0_0_58%] flex flex-col justify-center px-[clamp(2rem,4vw,4rem)] py-[clamp(1.5rem,3vw,3rem)] relative overflow-hidden">
            {/* Dark diagonal overlay */}
            <div
              className="absolute inset-0 z-[-1]"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 82% 100%, 0 100%)',
                background:
                  'linear-gradient(160deg, rgba(12,12,12,0.88) 0%, rgba(12,12,12,0.76) 60%, rgba(12,12,12,0.60) 100%)',
              }}
            />
            {/* Diagonal accent edge */}
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                clipPath:
                  'polygon(calc(100% - 1px) 0, 100% 0, 82% 100%, calc(82% - 1px) 100%)',
                background:
                  'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, rgba(212,165,116,0.02) 50%, rgba(212,165,116,0.04) 100%)',
              }}
            />

            {/* Project number — gold gradient text */}
            <div
              className="card-front-number text-[clamp(4rem,8vw,8rem)] font-black leading-none tracking-[-0.03em] opacity-[0.9] mb-[0.4rem]"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                background: `linear-gradient(135deg, ${project.accent}, ${project.accent2}, ${project.accent})`,
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {project.number}
            </div>

            {/* Emoji in gold-tinted glass circle */}
            <div className="card-emoji-circle w-[80px] h-[80px] rounded-full flex items-center justify-center text-[2.2rem] flex-shrink-0 mb-4 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/inner:scale-[1.08] group-hover/inner:border-[rgba(212,165,116,0.45)] group-hover/inner:shadow-[0_0_40px_-4px_rgba(212,165,116,0.25)] hover:animate-projects-gold-ring select-none"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(212,165,116,0.20), rgba(166,124,82,0.08) 60%, transparent 80%)',
                border: '2px solid rgba(212,165,116,0.25)',
                boxShadow: '0 0 30px -6px rgba(212,165,116,0.12)',
              }}
            >
              {project.emoji}
            </div>

            {/* Project title */}
            <h2 className="card-front-title text-[clamp(1.4rem,2.8vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.01em] text-white mb-4">
              {project.name}
            </h2>

            {/* Front face tags */}
            <div className="card-front-tags flex flex-wrap gap-2 mb-4">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="card-front-tag inline-block text-[0.7rem] font-medium px-[14px] py-[5px] rounded-full border border-[rgba(212,165,116,0.08)] text-[rgba(237,231,217,0.55)] tracking-[0.02em] cursor-default transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[rgba(212,165,116,0.12)] hover:border-[rgba(212,165,116,0.30)] hover:text-[#EDE7D9] hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_0_20px_-4px_rgba(212,165,116,0.10)] active:translate-y-0 active:scale-[0.98]"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Flip button — accessible trigger */}
            <button
              type="button"
              onClick={handleFlip}
              onKeyDown={handleKeyDown}
              className="absolute bottom-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(212,165,116,0.15)] border border-[rgba(212,165,116,0.3)] text-[rgba(212,165,116,0.8)] transition-all duration-300 hover:bg-[rgba(212,165,116,0.25)] hover:border-[rgba(212,165,116,0.5)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[rgba(212,165,116,0.5)]"
              aria-label={isFlipped ? 'Flip to front' : 'Flip to back'}
              aria-expanded={isFlipped}
              aria-controls={`project-card-${index}`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m10 17 5-5-5-5" />
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0118 0" />
              </svg>
            </button>
          </div>

          {/* ── Right panel (42%) ── */}
          <div
            className="card-front-right flex-[0_0_42%] flex flex-col justify-center px-[clamp(1.5rem,3vw,3rem)] py-[clamp(2rem,4vw,4rem)] relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(212,165,116,0.03), rgba(212,165,116,0.08), rgba(212,165,116,0.03))',
              borderLeft: '1px solid rgba(212,165,116,0.08)',
            }}
          >
            {/* Project description */}
            <p
              className="text-[0.95rem] font-light leading-relaxed text-[rgba(237,231,217,0.6)] mb-6"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {project.description}
            </p>

            {/* Tech stack tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="tech-tag inline-block px-[12px] py-[4px] rounded-full border border-[rgba(212,165,116,0.12)] bg-[rgba(212,165,116,0.04)] text-[rgba(212,165,116,0.6)] text-[0.65rem] font-medium transition-all duration-300 hover:border-[rgba(212,165,116,0.25)] hover:text-[#D4A574] hover:scale-105"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* GitHub link */}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-[rgba(212,165,116,0.7)] hover:text-[#D4A574] transition-colors duration-300"
            >
              <Github size={16} />
              <span>View on GitHub</span>
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* ══════ BACK FACE ══════ */}
        <div
          className="card-face absolute inset-0 rounded-[24px] overflow-hidden flex z-[1] glass-card-back"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            ...(isMobile ? {
              opacity: isFlipped ? 1 : 0,
              pointerEvents: isFlipped ? 'auto' : 'none',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              transform: isFlipped ? 'scale(1)' : 'scale(0.95)',
            } : {})
          }}
        >
          {/* GitHub CTA content */}
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6"
              style={{
                background: `linear-gradient(135deg, ${project.accent}, ${project.accent2})`,
                boxShadow: `0 0 40px ${project.accent}40`,
              }}
            >
              {project.emoji}
            </div>
            <h3
              className="text-2xl font-bold text-[#EDE7D9] mb-3"
              style={{
                textShadow: `0 0 20px ${project.accent}40`,
              }}
            >
              {project.name}
            </h3>
            <p
              className="text-[0.9rem] font-light text-[rgba(237,231,217,0.5)] mb-6 leading-relaxed"
            >
              {project.description}
            </p>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4A574] to-[#A67C52] text-[#0C0C0C] font-semibold rounded-full hover:shadow-[0_0_30px_rgba(212,165,116,0.3)] hover:scale-105 transition-all duration-300"
            >
              <span>Explore All Projects</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* =====================================================================
   GITHUB CARD — Static, no flip
   ===================================================================== */
function GitHubCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: (index % TOTAL) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="card relative shrink-0 snap-center rounded-3xl overflow-hidden group w-[85vw] lg:w-[400px] glass"
      style={{ minHeight: 480 }}
      whileHover={{ y: -6 }}
    >
      {/* GitHub CTA content */}
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6"
          style={{
            background: `linear-gradient(135deg, ${project.accent}, ${project.accent2})`,
            boxShadow: `0 0 40px ${project.accent}40`,
          }}
        >
          {project.emoji}
        </div>
        <h3
          className="text-2xl font-bold text-[#EDE7D9] mb-3"
          style={{
            textShadow: `0 0 20px ${project.accent}40`,
          }}
        >
          {project.name}
        </h3>
        <p
          className="text-[0.9rem] font-light text-[rgba(237,231,217,0.5)] mb-6 leading-relaxed"
        >
          {project.description}
        </p>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4A574] to-[#A67C52] text-[#0C0C0C] font-semibold rounded-full hover:shadow-[0_0_30px_rgba(212,165,116,0.3)] hover:scale-105 transition-all duration-300"
        >
          <span>Explore All Projects</span>
          <ArrowUpRight size={16} />
        </a>
      </div>
    </motion.div>
  )
}

/* =====================================================================
   PROJECTS SECTION — Horizontal infinite auto-scrolling carousel
   ===================================================================== */
export default function ProjectsSection() {
  const isMobile = useIsMobile()
  const prefersReducedMotion = usePrefersReducedMotion()
  const { trackRef, x, isPlaying, currentIndex, stepWidth, goNext, goPrev, goToIndex, togglePlayPause, setIsHovering } = useInfiniteCarousel({
    total: TOTAL,
    cardWidth: 380,
    gap: 24,
    autoplayMs: 3000,
    reducedMotion: prefersReducedMotion,
  })

  // Progress bar percentage
  const progressPercent = (currentIndex / (TOTAL - 1)) * 100

  // Keyboard navigation — scoped to #projects section only
  useEffect(() => {
    const section = document.getElementById('projects')
    const handler = (e) => {
      // Only handle if focus is within the projects section
      const active = document.activeElement
      if (!section || !section.contains(active)) return
      
      // Skip when focus is in an input/textarea
      const tag = active?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goPrev, goNext])

  return (
    <section
      id="projects"
      className="relative w-full overflow-hidden px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-36 bg-[#0C0C0C]"
    >
      {/* ═══════════════════════════════════════════════════════════════
          AMBIENT AURORA BACKGROUND — Gold/Bronze drifting orbs
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-perf opacity-[0.08] top-[-20%] left-[-10%] animate-projects-float-a"
          style={{
            background:
              'radial-gradient(circle, rgba(212,165,116,0.18), transparent 70%)',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-perf opacity-[0.06] top-[30%] right-[-15%] animate-projects-float-b"
          style={{
            background:
              'radial-gradient(circle, rgba(166,124,82,0.14), transparent 70%)',
          }}
        />
        <div
          className="absolute w-[700px] h-[700px] rounded-full blur-perf opacity-[0.04] bottom-[-15%] left-[20%] animate-projects-float-a"
          style={{
            background:
              'radial-gradient(circle, rgba(196,149,106,0.10), transparent 70%)',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-perf opacity-[0.03] top-[10%] left-[40%] animate-projects-float-b"
          style={{
            background:
              'radial-gradient(circle, rgba(184,137,94,0.08), transparent 70%)',
          }}
        />
        <div
          className="absolute w-[450px] h-[450px] rounded-full blur-perf opacity-[0.02] bottom-[20%] right-[10%] animate-projects-float-a"
          style={{
            background:
              'radial-gradient(circle, rgba(212,165,116,0.06), transparent 70%)',
          }}
        />
      </div>

      {/* Gold grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: 0.08,
          backgroundImage:
            'linear-gradient(rgba(212,165,116,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212,165,116,0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* ═══════════════════════════════════════════════════════════════
            HEADING — Static (not fixed), same visual design
            ═══════════════════════════════════════════════════════════════ */}
        <header className="text-center mb-8 sm:mb-10">
          {/* Eyebrow */}
          <div className="eyebrow text-[0.7rem] font-medium tracking-[0.3em] text-[rgba(212,165,116,0.50)] uppercase mb-[6px] animate-projects-eyebrow-fade-in">
            Featured Work
          </div>

          {/* Main title — "PROJECTS" with gold gradient */}
          <h1
            className="gradient-title text-[clamp(3rem,9vw,7.5rem)] font-black leading-none tracking-[0.04em]"
            style={{
              background:
                'linear-gradient(135deg, #D4A574, #C4956A, #E8C88A, #A67C52, #C4956A, #D4A574, #B8895E, #E8C88A, #D4A574)',
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            PROJECTS
          </h1>

          {/* Title ornaments: dots + animated underline */}
          <div className="title-ornaments flex items-center justify-center gap-[12px] mt-[4px] h-[10px]">
            <span className="title-dot w-[6px] h-[6px] rounded-full bg-[rgba(212,165,116,0.50)] flex-shrink-0" />
            <div
              className="title-underline h-[3px] rounded-[2px]"
              style={{
                background:
                  'linear-gradient(90deg, transparent, #D4A574, #A67C52, transparent)',
                width: '120px',
                transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
            <span className="title-dot w-[6px] h-[6px] rounded-full bg-[rgba(212,165,116,0.50)] flex-shrink-0" />
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════
            PROGRESS BAR — Gold gradient, relative positioned
            ═══════════════════════════════════════════════════════════════ */}
        <div className="relative h-[3px] rounded-full mx-auto max-w-[500px] mb-8 sm:mb-10 bg-[rgba(212,165,116,0.10)] overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              width: `${progressPercent}%`,
              background:
                'linear-gradient(90deg, #D4A574, #A67C52, #C4956A, #D4A574)',
              backgroundSize: '200% 100%',
              boxShadow:
                '0 0 8px rgba(212,165,116,0.25), 0 0 20px rgba(212,165,116,0.10)',
            }}
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            CAROUSEL — Horizontal infinite auto-scroll
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false)
            // Restore auto-scroll if it was paused by hover
            if (isPlaying) {
              // The hook handles this automatically
            }
          }}
        >
          <motion.div
            ref={trackRef}
            className="flex gap-6 cursor-grab active:cursor-grabbing"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -stepWidth * 2.5, right: -stepWidth * 0.5 }}
            dragElastic={0.15}
            dragMomentum={false}
            aria-live="polite"
            aria-atomic="false"
          >
            {ITEMS.map((project, i) => {
              // Distinguish regular projects from the GitHub CTA card
              const isGitHubCard = project.number === '06'
              const itemIndex = i % TOTAL

              return isGitHubCard ? (
                <GitHubCard
                  key={`github-${i}`}
                  project={project}
                  index={itemIndex}
                />
              ) : (
                <ProjectCard
                  key={`project-${project.number}-${i}`}
                  project={project}
                  index={itemIndex}
                  isMobile={isMobile}
                />
              )
            })}
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            NAVIGATION CONTROLS — Prev / Play-Pause / Dots / Next
            ═══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            type="button"
            className="projects-nav-btn"
            onClick={goPrev}
            aria-label="Previous project"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Play/Pause toggle */}
          <button
            type="button"
            onClick={togglePlayPause}
            className="projects-nav-btn"
            aria-label={isPlaying ? 'Pause auto-scroll' : 'Resume auto-scroll'}
            aria-pressed={!isPlaying}
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          <div
            id="dots"
            className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center"
            role="tablist"
            aria-label="Project slides"
          >
            {PROJECTS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === currentIndex ? 'projects-dot is-active' : 'projects-dot'}
                role="tab"
                aria-label={`Go to project ${i + 1}`}
                aria-selected={i === currentIndex ? 'true' : 'false'}
                onClick={() => goToIndex(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className="projects-nav-btn"
            onClick={goNext}
            aria-label="Next project"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
