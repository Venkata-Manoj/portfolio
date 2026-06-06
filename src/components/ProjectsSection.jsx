import { useRef, useState, useEffect, useCallback } from 'react'
import {
  motion,
  useMotionValue,
  animate,
  useInView,
} from 'framer-motion'
import {
  Github,
  ExternalLink,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

/* =====================================================================
   DATA — 6 projects with gold/bronze palette accent colors
   ===================================================================== */
const PROJECTS = [
  {
    number: '01',
    emoji: '🎬',
    name: 'videoreverse',
    description:
      'Tool to deconstruct videos into production-ready prompts for video AI models.',
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
    description:
      'Autonomous news intelligence with a 6-LLM fallback chain — scrapes 6 sources and delivers rich Telegram cards every 45 minutes.',
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
    description:
      'AI-powered UI component analyzer — paste any React/Vue/HTML component for instant risk identification and exportable PDF reports.',
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
    description:
      'RAG-powered report generator — ingests PDFs, DOCX, and images to produce institution-compliant capstone reports via FAISS + Ollama.',
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
    description:
      'Gym-style RL environment for IT incident response — AI agents learn triage, diagnosis, and recovery across progressive difficulty levels.',
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
  description:
    'Discover all my open-source repositories, contributions, and ongoing projects.',
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
function ProjectCard({ project, index }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const flippingRef = useRef(false)
  const cardRef = useRef(null)
  const innerRef = useRef(null)
  const inView = useInView(cardRef, { once: true, margin: '-40px' })

  // --- Flip handler ---
  const handleFlip = useCallback(
    (e) => {
      // Don't flip on link/button clicks
      if (e.target.closest('a') || e.target.closest('button')) return
      if (flippingRef.current) return
      flippingRef.current = true

      const el = innerRef.current
      if (!el) return

      const newFlipped = !isFlipped
      setIsFlipped(newFlipped)

      // Set smooth flip transition
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
    [isFlipped]
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

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: (index % TOTAL) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="card relative shrink-0 snap-center rounded-3xl overflow-hidden group w-[85vw] lg:w-[400px] cursor-pointer"
      style={{
        minHeight: 480,
        background: 'rgba(30,28,26,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(212,165,116,0.06)',
      }}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      whileHover={{ y: -6 }}
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
          className="card-face absolute inset-0 rounded-[24px] overflow-hidden flex z-[2]"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'rgba(30,28,26,0.50)',
            backdropFilter: 'blur(16px) saturate(1.1)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.1)',
            border: '1px solid rgba(212,165,116,0.06)',
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

            {/* "Click to flip" hint — sr-only accessible text */}
            <span className="sr-only">Click to flip</span>
          </div>

          {/* ── Right panel (42%) — Gold/bronze gradient blobs ── */}
          <div className="card-front-right flex-1 relative overflow-hidden flex items-center justify-center max-md:hidden">
            <div
              className="absolute w-[350px] h-[350px] rounded-full blur-[40px] opacity-[0.30] top-[10%] right-[20%] animate-projects-gold-blob"
              style={{
                background: `radial-gradient(circle, ${project.accent}, transparent 70%)`,
              }}
            />
            <div
              className="absolute w-[280px] h-[280px] rounded-full blur-[40px] opacity-[0.25] bottom-[15%] right-[35%] animate-projects-gold-blob"
              style={{
                background: `radial-gradient(circle, ${project.accent2}, transparent 70%)`,
                animationDelay: '-3s',
              }}
            />
            <div
              className="absolute w-[200px] h-[200px] rounded-full blur-[40px] opacity-[0.20] top-[50%] right-[10%] animate-projects-gold-blob"
              style={{
                background: `radial-gradient(circle, ${project.accent}, transparent 70%)`,
                animationDelay: '-6s',
              }}
            />
            <div
              className="absolute w-[150px] h-[150px] rounded-full blur-[40px] opacity-[0.15] top-[25%] right-[45%] animate-projects-gold-blob"
              style={{
                background: `radial-gradient(circle, ${project.accent2}, transparent 70%)`,
                animationDelay: '-2s',
              }}
            />
          </div>
        </div>

        {/* ══════ BACK FACE ══════ */}
        <div
          className="card-face absolute inset-0 rounded-[24px] overflow-hidden flex flex-col justify-center px-[clamp(2rem,4vw,5rem)] py-[clamp(1.5rem,3vw,3.5rem)] z-[1]"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'rgba(26,24,22,0.96)',
            backdropFilter: 'blur(16px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
            border: '1px solid rgba(212,165,116,0.08)',
          }}
        >
          {/* Back description */}
          <p className="card-back-desc text-[clamp(0.88rem,1.2vw,1.05rem)] font-light leading-[1.7] text-[rgba(237,231,217,0.65)] max-w-[640px] mb-6">
            {project.description}
          </p>

          {/* Back tech pills */}
          <div className="card-back-tags flex flex-wrap gap-2 mb-6">
            {project.tech.map((t) => (
              <span
                key={t}
                className="card-back-tag inline-block text-[0.72rem] font-medium px-[14px] py-[5px] rounded-full border text-[rgba(237,231,217,0.85)] tracking-[0.02em] cursor-default transition-all duration-300 hover:bg-[#D4A574] hover:text-[#0C0C0C] hover:-translate-y-0.5 hover:scale-[1.05] hover:shadow-[0_0_20px_-4px_rgba(212,165,116,0.20)] active:translate-y-0 active:scale-[0.95]"
                style={{
                  background: 'rgba(212,165,116,0.08)',
                  borderColor: 'rgba(212,165,116,0.25)',
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Back links */}
          <div className="card-back-links flex gap-[14px] flex-wrap items-center">
            {/* GitHub button */}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="card-back-link github inline-flex items-center gap-[6px] text-[0.82rem] font-medium px-[22px] py-[9px] rounded-[12px] no-underline transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] border border-[rgba(212,165,116,0.25)] text-[rgba(212,165,116,0.70)] hover:bg-[rgba(212,165,116,0.10)] hover:border-[rgba(212,165,116,0.50)] hover:text-[#D4A574] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3),0_0_20px_-4px_rgba(212,165,116,0.10)] active:translate-y-0 active:scale-[0.96]"
              onClick={(e) => e.stopPropagation()}
              aria-label={`View ${project.name} on GitHub`}
            >
              <Github size={16} />
              GitHub
            </a>

            {/* Live Demo button (only if live URL exists) */}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="card-back-link demo inline-flex items-center gap-[6px] text-[0.82rem] font-semibold px-[22px] py-[9px] rounded-[12px] no-underline transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-[#0C0C0C] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-4px_rgba(212,165,116,0.40)] hover:brightness-110 active:translate-y-0 active:scale-[0.96]"
                style={{
                  background: 'linear-gradient(135deg, #D4A574, #A67C52)',
                  border: 'none',
                }}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Live Demo of ${project.name}`}
              >
                <ExternalLink size={16} />
                Live Demo
              </a>
            )}
          </div>

          {/* Back hint — sr-only accessible text */}
          <span className="sr-only absolute bottom-[24px] right-[32px]">Flip back</span>
        </div>

        {/* ── Shimmer overlay (hover gold sweep) ── */}
        <div
          className="card-shimmer absolute inset-0 z-[5] pointer-events-none opacity-0 transition-opacity duration-500 rounded-[24px]"
          style={{
            background:
              'linear-gradient(105deg, transparent 0%, transparent 30%, rgba(212,165,116,0.02) 45%, rgba(212,165,116,0.04) 50%, rgba(212,165,116,0.02) 55%, transparent 70%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />

        {/* ── Gold glow edge on hover ── */}
        <div
          className="card-glow absolute -inset-[1px] rounded-[25px] pointer-events-none opacity-0 transition-opacity duration-500 z-[6]"
          style={{
            boxShadow:
              '0 0 0 1px rgba(212,165,116,0.20), 0 0 30px -4px rgba(212,165,116,0.12)',
          }}
        />
      </div>
    </motion.div>
  )
}

/* =====================================================================
   GITHUB CARD — Special CTA card (no flip)
   ===================================================================== */
function GitHubCard({ project, index }) {
  const cardRef = useRef(null)
  const inView = useInView(cardRef, { once: true, margin: '-40px' })

  const handleGitHubKey = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        window.open(project.github, '_blank', 'noopener noreferrer')
      }
    },
    [project.github]
  )

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: (index % TOTAL) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="card relative shrink-0 snap-center rounded-3xl overflow-hidden group w-[85vw] lg:w-[400px] cursor-pointer"
      style={{
        minHeight: 480,
        background: 'rgba(30,28,26,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(212,165,116,0.06)',
      }}
      onClick={() =>
        window.open(project.github, '_blank', 'noopener noreferrer')
      }
      onKeyDown={handleGitHubKey}
      role="button"
      tabIndex={0}
      whileHover={{ y: -6 }}
    >
      {/* ── Background layer ── */}
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

      {/* ── Content ── */}
      <div
        className="relative z-[3] w-full h-full min-h-[480px] rounded-[24px] overflow-hidden flex flex-col items-center justify-center gap-6 group/card transition-all duration-500"
        style={{
          background: 'rgba(30,28,26,0.50)',
          backdropFilter: 'blur(16px) saturate(1.1)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.1)',
          border: '1px solid rgba(212,165,116,0.06)',
        }}
      >
        {/* Shimmer border on hover */}
        <div className="absolute inset-[-1px] rounded-[25px] pointer-events-none opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 animate-projects-gold-border" />

        {/* Glow orbs */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[60px] opacity-[0.08] top-[20%] left-[30%] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${project.accent}, transparent 70%)`,
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full blur-[50px] opacity-[0.06] bottom-[10%] right-[20%] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${project.accent2}, transparent 70%)`,
          }}
        />

        {/* GitHub logo */}
        <div
          className="w-[100px] h-[100px] rounded-full flex items-center justify-center transition-all duration-500 group-hover/card:scale-110 group-hover/card:shadow-[0_0_50px_-4px_rgba(212,165,116,0.30)]"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(212,165,116,0.20), rgba(166,124,82,0.08) 60%, transparent 80%)',
            border: '2px solid rgba(212,165,116,0.25)',
            boxShadow: '0 0 30px -6px rgba(212,165,116,0.12)',
          }}
        >
          <Github size={48} className="text-[rgba(212,165,116,0.7)]" />
        </div>

        {/* Title */}
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-white text-center">
          {project.name}
        </h2>

        {/* Description */}
        <p className="text-[clamp(0.9rem,1.2vw,1.1rem)] font-light leading-[1.6] text-[rgba(237,231,217,0.5)] max-w-[500px] text-center">
          {project.description}
        </p>

        {/* CTA Button */}
        <div
          className="inline-flex items-center gap-3 text-[0.9rem] font-semibold px-[28px] py-[12px] rounded-[14px] transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-[#0C0C0C] group-hover/card:-translate-y-0.5 group-hover/card:shadow-[0_8px_28px_-4px_rgba(212,165,116,0.40)] group-hover/card:brightness-110 active:scale-[0.96]"
          style={{
            background: 'linear-gradient(135deg, #D4A574, #A67C52)',
          }}
        >
          View all repositories on GitHub{' '}
          <ArrowUpRight
            size={18}
            className="transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
          />
        </div>
      </div>
    </motion.div>
  )
}

/* =====================================================================
   PROJECTS SECTION — Horizontal infinite auto-scrolling carousel
   ===================================================================== */
export default function ProjectsSection() {
  const x = useMotionValue(0)
  const autoAnimRef = useRef(null)
  const startAnimFn = useRef(null)
  const [stepWidth, setStepWidth] = useState(0)
  const [oneSetWidth, setOneSetWidth] = useState(0)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [underlineVisible, setUnderlineVisible] = useState(false)
  const trackRef = useRef(null)
  const pauseTimerRef = useRef(null)

  // ── Measure card width on mount ──
  useEffect(() => {
    const track = trackRef.current
    if (!track || !track.children[0]) return
    const cardW = track.children[0].offsetWidth
    const gap = 24
    const step = cardW + gap
    setStepWidth(step)
    setOneSetWidth(step * TOTAL)

    // Initial position: show the "original" set (copy 1, starts at index TOTAL)
    x.set(-step * TOTAL)
  }, [x])

  // ── Gold underline grows after mount ──
  useEffect(() => {
    const timer = setTimeout(() => setUnderlineVisible(true), 600)
    return () => clearTimeout(timer)
  }, [])

  // ── Auto-scroll function ──
  useEffect(() => {
    startAnimFn.current = () => {
      if (!oneSetWidth) return
      const currentX = x.get()
      const targetX = currentX - oneSetWidth
      if (autoAnimRef.current) autoAnimRef.current.stop()
      autoAnimRef.current = animate(x, [currentX, targetX], {
        duration: 40,
        ease: 'linear',
        onComplete: () => {
          x.set(x.get() + oneSetWidth)
          if (startAnimFn.current) startAnimFn.current()
        },
      })
    }
  }, [oneSetWidth, x])

  // ── Start / stop auto-scroll based on isPlaying ──
  useEffect(() => {
    if (isPlaying && oneSetWidth > 0) {
      startAnimFn.current()
    } else if (autoAnimRef.current) {
      autoAnimRef.current.stop()
    }
    return () => {
      if (autoAnimRef.current) autoAnimRef.current.stop()
    }
  }, [isPlaying, oneSetWidth])

  // ── Pause / resume on hover ──
  useEffect(() => {
    if (!autoAnimRef.current) return
    if (isHovering) {
      autoAnimRef.current.pause()
    } else if (isPlaying) {
      autoAnimRef.current.play()
    }
  }, [isHovering, isPlaying])

  // ── Track focused index from x position ──
  useEffect(() => {
    if (!stepWidth) return
    const unsubscribe = x.on('change', (latest) => {
      const absScroll = Math.abs(latest)
      const cardAtLeft = Math.floor(absScroll / stepWidth)
      const index = cardAtLeft % TOTAL
      if (index >= 0 && index < TOTAL) {
        setFocusedIndex(index)
      }
    })
    return unsubscribe
  }, [stepWidth, x])

  // ── Cleanup pause timer on unmount ──
  useEffect(() => {
    return () => {
      clearTimeout(pauseTimerRef.current)
    }
  }, [])

  // ── Navigation helpers ──
  const goNext = useCallback(() => {
    if (stepWidth === 0) return
    if (autoAnimRef.current) autoAnimRef.current.stop()
    clearTimeout(pauseTimerRef.current)
    setIsPlaying(false)

    const currentX = x.get()
    const targetX = currentX - stepWidth

    animate(x, [currentX, targetX], {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        pauseTimerRef.current = setTimeout(() => setIsPlaying(true), 3000)
      },
    })
  }, [stepWidth, x])

  const goPrev = useCallback(() => {
    if (stepWidth === 0) return
    if (autoAnimRef.current) autoAnimRef.current.stop()
    clearTimeout(pauseTimerRef.current)
    setIsPlaying(false)

    const currentX = x.get()
    const targetX = currentX + stepWidth

    animate(x, [currentX, targetX], {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        pauseTimerRef.current = setTimeout(() => setIsPlaying(true), 3000)
      },
    })
  }, [stepWidth, x])

  const goToCard = useCallback(
    (targetIndex) => {
      if (stepWidth === 0) return
      if (autoAnimRef.current) autoAnimRef.current.stop()
      clearTimeout(pauseTimerRef.current)
      setIsPlaying(false)

      // Calculate the shortest delta in steps
      let delta = targetIndex - focusedIndex
      if (delta > TOTAL / 2) delta -= TOTAL
      if (delta < -(TOTAL / 2)) delta += TOTAL

      const currentX = x.get()
      const targetX = currentX - delta * stepWidth

      animate(x, [currentX, targetX], {
        duration: 0.5 + Math.abs(delta) * 0.1,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          pauseTimerRef.current = setTimeout(() => setIsPlaying(true), 3000)
        },
      })
    },
    [stepWidth, focusedIndex, x]
  )

  // ── Keyboard navigation ──
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goPrev, goNext])

  // ── Progress bar percentage ──
  const progressPercent = (focusedIndex / (TOTAL - 1)) * 100

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
          className="absolute w-[800px] h-[800px] rounded-full blur-[80px] opacity-[0.08] top-[-20%] left-[-10%] animate-projects-float-a"
          style={{
            background:
              'radial-gradient(circle, rgba(212,165,116,0.18), transparent 70%)',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[80px] opacity-[0.06] top-[30%] right-[-15%] animate-projects-float-b"
          style={{
            background:
              'radial-gradient(circle, rgba(166,124,82,0.14), transparent 70%)',
          }}
        />
        <div
          className="absolute w-[700px] h-[700px] rounded-full blur-[80px] opacity-[0.04] bottom-[-15%] left-[20%] animate-projects-float-a"
          style={{
            background:
              'radial-gradient(circle, rgba(196,149,106,0.10), transparent 70%)',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[80px] opacity-[0.03] top-[10%] left-[40%] animate-projects-float-b"
          style={{
            background:
              'radial-gradient(circle, rgba(184,137,94,0.08), transparent 70%)',
          }}
        />
        <div
          className="absolute w-[450px] h-[450px] rounded-full blur-[80px] opacity-[0.02] bottom-[20%] right-[10%] animate-projects-float-a"
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
            className="gradient-title text-[clamp(4rem,12vw,10rem)] font-black leading-none tracking-[0.04em]"
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
                width: underlineVisible ? '120px' : '0px',
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
            if (autoAnimRef.current && isPlaying) {
              autoAnimRef.current.play()
            }
          }}
        >
          <motion.div
            ref={trackRef}
            className="flex gap-6"
            style={{ x }}
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
                />
              )
            })}
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            CONTROLS — Arrows + dot indicators + project indicator
            ═══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-center gap-6 mt-8 sm:mt-10">
          {/* Left arrow */}
          <button
            onClick={goPrev}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-[rgba(212,165,116,0.20)] text-[rgba(212,165,116,0.60)] transition-all duration-300 hover:bg-[rgba(212,165,116,0.10)] hover:border-[rgba(212,165,116,0.40)] hover:text-[#D4A574] active:scale-90"
            aria-label="Previous project"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Project navigation">
            {ALL_PROJECTS.map((_, i) => (
              <button
                key={i}
                onClick={() => goToCard(i)}
                role="tab"
                aria-selected={focusedIndex === i}
                aria-label={`Go to project ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  focusedIndex === i
                    ? 'bg-[#D4A574] w-6 shadow-[0_0_8px_rgba(212,165,116,0.40)]'
                    : 'bg-[rgba(212,165,116,0.20)] hover:bg-[rgba(212,165,116,0.40)]'
                }`}
              />
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={goNext}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-[rgba(212,165,116,0.20)] text-[rgba(212,165,116,0.60)] transition-all duration-300 hover:bg-[rgba(212,165,116,0.10)] hover:border-[rgba(212,165,116,0.40)] hover:text-[#D4A574] active:scale-90"
            aria-label="Next project"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Project indicator — gold gradient number + OF label */}
        <div className="flex items-center justify-center gap-3 mt-5" aria-hidden="true">
          <div className="w-[30px] h-[1px]" style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,165,116,0.35), transparent)',
          }} />
          <span
            className="text-[1.2rem] font-bold leading-none tracking-[0.02em]"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              background: 'linear-gradient(135deg, #D4A574, #A67C52)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {String(focusedIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-[0.65rem] font-normal text-[rgba(212,165,116,0.40)] tracking-[0.12em]">
            OF {String(TOTAL).padStart(2, '0')}
          </span>
          <div className="w-[30px] h-[1px]" style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,165,116,0.35), transparent)',
          }} />
        </div>
      </div>
    </section>
  )
}
