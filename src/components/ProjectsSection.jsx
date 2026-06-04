import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react'

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

const TOTAL = PROJECTS.length + 1 // 5 projects + 1 GitHub card

/* =====================================================================
   PROJECT CARD — Sticky, parallax, 3D tilt, click-to-flip
   ===================================================================== */
function ProjectCard({ project, index, scrollYProgress, total, isMobile }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const flippingRef = useRef(false)
  const cardRef = useRef(null)
  const innerRef = useRef(null)
  // rAF-throttled mouse state for 3D tilt
  const mouseRef = useRef({ x: 0, y: 0 })
  const tiltRafRef = useRef(null)

  // Per-card progress derived from global scrollYProgress
  const cardProgress = useTransform(
    scrollYProgress,
    [index / total, (index + 1) / total],
    [0, 1],
    { clamp: true }
  )

  // Parallax offsets (ratios: 0.3x / 0.4x / 0.6x matching HTML spec)
  const bgY = useTransform(cardProgress, [0, 1], [0, -60])
  const bgScale = useTransform(cardProgress, [0, 1], [1, 1.02])
  const emojiY = useTransform(cardProgress, [0, 1], [0, -100])
  const contentY = useTransform(cardProgress, [0, 1], [0, -160])

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
      el.style.transform = newFlipped ? 'rotateY(180deg)' : 'rotateX(0deg) rotateY(0deg)'
      el.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4), 0 2px 12px rgba(0,0,0,0.3)'

      setTimeout(() => {
        flippingRef.current = false
      }, 700)
    },
    [isFlipped]
  )

  // --- 3D Tilt handler (rAF-throttled) ---
  // Previously fired on every mousemove pixel, causing layout thrashing
  // Now: stores mouse position, only reads getBoundingClientRect + writes styles inside rAF
  const handleMouseMove = useCallback(
    (e) => {
      if (isMobile) return
      if (flippingRef.current) return

      // Store latest mouse position (no DOM reads/writes here)
      mouseRef.current = { x: e.clientX, y: e.clientY }

      // Skip if a rAF is already queued — only process once per frame
      if (tiltRafRef.current) return

      tiltRafRef.current = requestAnimationFrame(() => {
        tiltRafRef.current = null

        const el = innerRef.current
        if (!el) return

        const rect = el.getBoundingClientRect()
        const x = mouseRef.current.x - rect.left
        const y = mouseRef.current.y - rect.top
        const cx = rect.width / 2
        const cy = rect.height / 2
        const TILT_MAX = 15

        let rx = ((y - cy) / cy) * -TILT_MAX
        let ry = ((x - cx) / cx) * TILT_MAX
        rx = Math.max(-TILT_MAX, Math.min(TILT_MAX, rx))
        ry = Math.max(-TILT_MAX, Math.min(TILT_MAX, ry))

        // Fast transition for tilt
        el.style.transition = 'transform 0.08s ease-out, box-shadow 0.08s ease-out'

        if (isFlipped) {
          el.style.transform = `rotateY(180deg) rotateX(${rx}deg) rotateY(${-ry}deg)`
        } else {
          el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
        }

        // Dynamic gold shadow
        const shadowX = (ry / TILT_MAX) * 12
        const shadowY = (rx / TILT_MAX) * 12
        const intensity = 0.25 + ((Math.abs(rx) + Math.abs(ry)) / (TILT_MAX * 2)) * 0.35
        const goldIntensity =
          0.06 + ((Math.abs(rx) + Math.abs(ry)) / (TILT_MAX * 2)) * 0.12
        const goldShadowX = -(ry / TILT_MAX) * 8
        const goldShadowY = -(rx / TILT_MAX) * 8

        el.style.boxShadow = [
          `${shadowX}px ${shadowY + 8}px ${16 + Math.abs(shadowY)}px rgba(0,0,0,${intensity})`,
          `${shadowX * 0.5}px ${shadowY * 0.5 + 4}px 8px rgba(0,0,0,${intensity * 0.7})`,
          `${goldShadowX}px ${goldShadowY + 4}px 30px -6px rgba(212,165,116,${goldIntensity})`,
        ].join(', ')
      })
    },
    [isMobile, isFlipped]
  )

  // Clean up rAF on unmount
  useEffect(() => {
    return () => {
      if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current)
    }
  }, [])

  // --- Tilt reset on mouse leave ---
  const handleMouseLeave = useCallback(() => {
    const el = innerRef.current
    if (!el) return
    el.style.transition =
      'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease-out'
    el.style.transform = isFlipped
      ? 'rotateY(180deg)'
      : 'rotateX(0deg) rotateY(0deg)'
    el.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4), 0 2px 12px rgba(0,0,0,0.3)'
  }, [isFlipped])

  // --- Keyboard ESC to reset flip ---
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isFlipped) {
        setIsFlipped(false)
        const el = innerRef.current
        if (!el) return
        el.style.transition =
          'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease'
        el.style.transform = 'rotateX(0deg) rotateY(0deg)'
        el.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4), 0 2px 12px rgba(0,0,0,0.3)'
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isFlipped])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleFlip()
    }
  }, [handleFlip])

  return (
    <div
      ref={cardRef}
      className="card sticky top-0 h-screen w-full overflow-hidden"
      style={{ zIndex: total - index }}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Layer 1: Background gradient (0.3x scroll speed) ── */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ y: bgY, scale: bgScale }}
      >
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
        {/* Floating orbs */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[50px] opacity-[0.12] top-[10%] left-[-5%] pointer-events-none animate-projects-gold-bg-orb"
          style={{
            background: `radial-gradient(circle, ${project.accent}, transparent 70%)`,
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-[0.12] bottom-[5%] right-[5%] pointer-events-none animate-projects-gold-bg-orb"
          style={{
            background: `radial-gradient(circle, ${project.accent2}, transparent 70%)`,
            animationDelay: '-4s',
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-[0.12] top-[50%] left-[50%] pointer-events-none animate-projects-gold-bg-orb"
          style={{
            background: `radial-gradient(circle, ${project.accent}, transparent 70%)`,
            animationDelay: '-8s',
          }}
        />
      </motion.div>

      {/* ── Layer 2: Emoji/decorative element (0.4x scroll speed) ── */}
      <motion.div
        className="absolute inset-0 z-[2] pointer-events-none flex items-center justify-center"
        style={{ y: emojiY }}
      >
        <span className="text-[clamp(180px,25vw,320px)] opacity-[0.04] select-none blur-[2px] translate-x-[10%] translate-y-[5%]">
          {project.emoji}
        </span>
      </motion.div>

      {/* ── Layer 3: Content (0.6x scroll speed + 3D perspective) ── */}
      <motion.div
        className="absolute inset-0 z-[3] flex items-center justify-center"
        style={{
          y: contentY,
          perspective: isMobile ? 'none' : '1200px',
        }}
      >
        {/* Card inner — 3D flip + tilt target */}
        <div
          ref={innerRef}
          className="card-inner relative w-[88%] max-w-[1200px] h-[82%] max-h-[700px] rounded-[24px] cursor-pointer"
          style={{
            transformStyle: 'preserve-3d',
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
              <div className="card-emoji-circle w-[80px] h-[80px] rounded-full flex items-center justify-center text-[2.2rem] flex-shrink-0 mb-4 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/inner:scale-[1.08] group-hover/inner:border-[rgba(212,165,116,0.45)] group-hover/inner:shadow-[0_0_40px_-4px_rgba(212,165,116,0.25)] hover:animate-projects-gold-ring"
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

              {/* "Click to flip" hint */}
              <div className="card-front-hint text-[0.72rem] font-light tracking-[0.08em] text-[rgba(212,165,116,0.35)] transition-colors duration-300">
                Click to flip ↻
              </div>
            </div>

            {/* ── Right panel (42%) — Gold/bronze gradient blobs ── */}
            {/* Reduced blur: 60→40px */}
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
            {/* Back title */}
            <div
              className="card-back-title text-[clamp(1.2rem,2.5vw,2rem)] font-bold mb-3"
              style={{ color: project.accent }}
            >
              {project.name}
            </div>

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

            {/* Back hint */}
            <div className="card-back-hint absolute bottom-[24px] right-[32px] text-[0.68rem] font-light tracking-[0.08em] text-[rgba(212,165,116,0.18)]">
              Flip back ↩
            </div>
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
    </div>
  )
}

/* =====================================================================
   GITHUB CARD — Special 6th card (CTA only, no flip)
   ===================================================================== */
function GitHubCard({ project, index, scrollYProgress, total }) {
  const cardRef = useRef(null)

  const cardProgress = useTransform(
    scrollYProgress,
    [index / total, (index + 1) / total],
    [0, 1],
    { clamp: true }
  )

  const bgY = useTransform(cardProgress, [0, 1], [0, -60])
  const bgScale = useTransform(cardProgress, [0, 1], [1, 1.02])

  const handleGitHubKey = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      window.open(project.github, '_blank', 'noopener noreferrer')
    }
  }, [project.github])

  return (
    <div
      ref={cardRef}
      className="card sticky top-0 h-screen w-full overflow-hidden cursor-pointer"
      style={{ zIndex: total - index }}
      onClick={() =>
        window.open(project.github, '_blank', 'noopener noreferrer')
      }
      onKeyDown={handleGitHubKey}
      role="button"
      tabIndex={0}
    >
      {/* ── Background layer ── */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ y: bgY, scale: bgScale }}
      >
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
      </motion.div>

      {/* ── Content layer ── */}
      <motion.div className="absolute inset-0 z-[3] flex items-center justify-center">
        <div
          className="relative w-[88%] max-w-[1200px] h-[82%] max-h-[700px] rounded-[24px] overflow-hidden flex flex-col items-center justify-center gap-6 group/card transition-all duration-500"
          style={{
            background: 'rgba(30,28,26,0.50)',
            backdropFilter: 'blur(16px) saturate(1.1)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.1)',
            border: '1px solid rgba(212,165,116,0.06)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 2px 12px rgba(0,0,0,0.3)',
          }}
        >
          {/* Shimmer border on hover */}
          <div className="absolute inset-[-1px] rounded-[25px] pointer-events-none opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 animate-projects-gold-border" />

          {/* Glow orbs — reduced blur: 100→60, 80→50 */}
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
            <ArrowUpRight size={18} className="transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* =====================================================================
   PROJECTS SECTION — Main section with sticky cards, progress bar,
   project indicator, aurora background, fixed heading + scroll hint
   ===================================================================== */
export default function ProjectsSection() {
  const containerRef = useRef(null)
  const headingRef = useRef(null)
  const [underlineVisible, setUnderlineVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Scroll progress through the entire card container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ── Progress bar (fixed top) ──
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // ── Project indicator (fixed right) — updates active number ──
  const activeIndex = useTransform(
    scrollYProgress,
    (v) => String(Math.min(Math.floor(v * TOTAL), TOTAL - 1)).padStart(2, '0')
  )

  // ── Heading state: visible → scrolled → scrolled-out ──
  const headingState = useTransform(
    scrollYProgress,
    [0, 0.12, 0.35],
    [0, 0.5, 1]
  )
  const headingScale = useTransform(
    headingState,
    [0, 0.5, 1],
    [1, 0.92, 0.85]
  )
  const headingOpacity = useTransform(
    headingState,
    [0, 0.5, 1],
    [1, 0.35, 0]
  )

  // ── Scroll hint fades after first scroll ──
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  // ── Init: mobile check, underline animation, progress pulse ──
  const [progressPulsing, setProgressPulsing] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Gold underline grows after mount
    const underlineTimer = setTimeout(() => setUnderlineVisible(true), 600)

    // Progress bar brief pulse on load
    const pulse1 = setTimeout(() => setProgressPulsing(true), 800)
    const pulse2 = setTimeout(() => setProgressPulsing(false), 5300)

    return () => {
      window.removeEventListener('resize', checkMobile)
      clearTimeout(underlineTimer)
      clearTimeout(pulse1)
      clearTimeout(pulse2)
    }
  }, [])

  return (
    <section
      id="projects"
      className="relative bg-[#0C0C0C] text-white"
      style={{ minHeight: '100vh' }}
    >
      {/* ═══════════════════════════════════════════════════════════════
          FIXED PROGRESS BAR — Gold gradient with glow
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        className="fixed top-0 left-0 h-[3px] z-[1000] pointer-events-none"
        style={{
          width: progressWidth,
          background:
            'linear-gradient(90deg, #D4A574, #A67C52, #C4956A, #D4A574)',
          backgroundSize: '200% 100%',
          boxShadow: progressPulsing
            ? '0 0 16px rgba(212,165,116,0.45), 0 0 40px rgba(212,165,116,0.20)'
            : '0 0 8px rgba(212,165,116,0.25), 0 0 20px rgba(212,165,116,0.10)',
          transition: 'box-shadow 1.5s ease-in-out',
        }}
        role="progressbar"
        aria-label="Scroll progress"
      >
        <div
          className="absolute top-0 left-0 right-0 h-[10px] blur-[6px] pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,165,116,0.15), transparent)',
          }}
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          FIXED PROJECT INDICATOR — Gold numbers with "OF" label
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className="fixed right-[32px] top-1/2 -translate-y-1/2 z-[100] flex-col items-center gap-[6px] pointer-events-none hidden md:flex"
        aria-hidden="true"
      >
        <div
          className="w-[20px] h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,165,116,0.35), transparent)',
          }}
        />
        <div
          className="w-[1px] h-[40px]"
          style={{
            background:
              'linear-gradient(180deg, rgba(212,165,116,0.35), transparent)',
          }}
        />
        <motion.span
          className="indicator-current text-[1.6rem] font-bold leading-none tracking-[0.02em]"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            background: 'linear-gradient(135deg, #D4A574, #A67C52)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {activeIndex}
        </motion.span>
        <span className="indicator-total text-[0.72rem] font-normal text-[rgba(212,165,116,0.40)] tracking-[0.12em]">
          OF {String(TOTAL).padStart(2, '0')}
        </span>
        <div
          className="w-[1px] h-[60px]"
          style={{
            background:
              'linear-gradient(180deg, transparent, rgba(212,165,116,0.25))',
          }}
        />
        <div
          className="w-[20px] h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,165,116,0.35), transparent)',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FIXED AURORA BACKGROUND — Gold/Bronze drifting bands
          ═══════════════════════════════════════════════════════════════ */}
      {/* Reduced blur: 120→80px — blur beyond 80px has negligible visual gain vs GPU cost */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
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

      {/* ═══════════════════════════════════════════════════════════════
          FIXED HEADING — Eyebrow, gradient title, underline, scroll hint
          ═══════════════════════════════════════════════════════════════ */}
      <header
        ref={headingRef}
        className="fixed top-0 left-0 right-0 z-50 text-center pointer-events-none pt-10 sm:pt-16"
      >
        <motion.div
          style={{ scale: headingScale, opacity: headingOpacity }}
          className="origin-center"
        >
          {/* Eyebrow */}
          <div className="eyebrow text-[0.7rem] font-medium tracking-[0.3em] text-[rgba(212,165,116,0.50)] uppercase mb-[6px] animate-projects-eyebrow-fade-in">
            Featured Work
          </div>

          {/* Main title — "PROJECTS" with accented "O" */}
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
            PR
            <span
              className="title-accent inline-block"
              style={{
                background:
                  'linear-gradient(135deg, #E8C88A, #D4A574, #F0D8A0, #D4A574)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 30px rgba(212,165,116,0.40))',
              }}
            >
              O
            </span>
            JECTS
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
                transition:
                  'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
            <span className="title-dot w-[6px] h-[6px] rounded-full bg-[rgba(212,165,116,0.50)] flex-shrink-0" />
          </div>

          {/* Scroll hint */}
          <motion.div
            className="scroll-hint flex flex-col items-center gap-[8px] mt-[16px]"
            style={{ opacity: hintOpacity }}
          >
            <div className="mouse-icon w-[22px] h-[34px] border-2 border-[rgba(212,165,116,0.30)] rounded-[12px] flex justify-center transition-colors duration-300 hover:border-[rgba(212,165,116,0.50)]">
              <div className="mouse-wheel w-[3px] h-[8px] bg-[rgba(212,165,116,0.50)] rounded-[3px] mt-[6px] animate-projects-mouse-wheel" />
            </div>
            <div className="hint-chevrons flex flex-col items-center gap-[2px]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block w-[10px] h-[10px] border-r-[1.5px] border-b-[1.5px] border-[rgba(212,165,116,0.30)] rotate-45 animate-projects-chevron-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-[0.75rem] font-light tracking-[0.2em] uppercase text-[rgba(212,165,116,0.35)]">
              Scroll
            </span>
          </motion.div>
        </motion.div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          CARDS CONTAINER — Scroll target with sticky cards
          ═══════════════════════════════════════════════════════════════ */}
      <div
        ref={containerRef}
        className="relative z-[1]"
        style={{ height: `${TOTAL * 100}vh` }}
      >
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={i}
            total={TOTAL}
            scrollYProgress={scrollYProgress}
            isMobile={isMobile}
          />
        ))}
        <GitHubCard
          project={GITHUB_CARD}
          index={PROJECTS.length}
          total={TOTAL}
          scrollYProgress={scrollYProgress}
        />
      </div>

      {/* Inline @keyframes and responsive styles moved to src/styles/animations.css */}
    </section>
  )
}
