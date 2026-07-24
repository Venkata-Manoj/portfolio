import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import { hexA } from '../lib/colorUtils'

/* =====================================================================
   TYPES
   ===================================================================== */

interface Project {
  number: string
  emoji: string
  name: string
  description: string
  tech: string[]
  accent: string
  accent2: string
  github: string
  live: string | null
  cta?: boolean
}

interface GitHubCardData {
  number: string
  emoji: string
  name: string
  description: string
  accent: string
  accent2: string
  github: string
  cta?: boolean
  tech?: string[]
  live?: string | null
}

type NodeData = Project | GitHubCardData

interface CatInfo {
  key: string
  label: string
  col: string
}

interface SimNode {
  p: NodeData
  i: number
  c: CatInfo
  x: number
  y: number
  vx: number
  vy: number
  fixed: boolean
  r: number
  pulse: number
  hover: number
}

/* =====================================================================
   DATA — 6 projects with gold/bronze palette accent colors
   ===================================================================== */
const PROJECTS: Project[] = [
  {
    number: '01',
    emoji: '🎬',
    name: 'videoreverse',
    description: 'Deconstruct any video into production-ready prompts for video AI models (Runway, Veo, Sora).',
    tech: ['Python', 'CLI', 'Web UI'],
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
    tech: ['Python', 'Multi-LLM', 'SQLite', 'Telegram'],
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
    tech: ['Python', 'FastAPI', 'FAISS', 'Ollama', 'Tesseract OCR'],
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
  {
    number: '06',
    emoji: '🕷️',
    name: 'web-crawl',
    description: 'Website Cloner — BFS crawl, asset download, link rewriting, CLI + Flask Web UI. 52 tests.',
    tech: ['Python', 'Flask', 'CLI'],
    accent: '#D4A574', // Warm Gold
    accent2: '#B8895E',
    github: 'https://github.com/Venkata-Manoj/web-crawl',
    live: null,
  },
  {
    number: '07',
    emoji: '📊',
    name: 'data-analysis',
    description: '6 ML projects: Customer Segmentation, NLP Sentiment, House Price Prediction, Wine Quality, PM2.5 Forecasting, Topic Modeling.',
    tech: ['Python', 'Jupyter', 'ML'],
    accent: '#C4956A', // Antique Gold
    accent2: '#A67C52',
    github: 'https://github.com/Venkata-Manoj/data-analysis',
    live: null,
  },
  {
    number: '08',
    emoji: '🎓',
    name: 'IdeaForge_2k26',
    description: 'E-certificate generation platform with glassmorphism UI, username validation, and PDF generation.',
    tech: ['TypeScript', 'React', 'Node.js', 'MongoDB'],
    accent: '#E8C88A', // Light Gold
    accent2: '#C4956A',
    github: 'https://github.com/Venkata-Manoj/IdeaForge_2k26',
    live: 'https://ideaforge-2k26.vercel.app',
  },
  {
    number: '09',
    emoji: '🤟',
    name: 'Sign-Language-TTS',
    description: 'Real-time sign language recognition using PyTorch LSTM with text-to-speech output via MediaPipe and OpenCV.',
    tech: ['Python', 'PyTorch', 'LSTM', 'MediaPipe', 'TTS'],
    accent: '#A67C52', // Bronze
    accent2: '#8B6642',
    github: 'https://github.com/Venkata-Manoj/Sign-Language-TTS',
    live: null,
  },
  {
    number: '10',
    emoji: '🧘',
    name: 'Habit-Zen-Web',
    description: 'Minimalist habit tracker with daily check-ins, calendar heatmap, AI-powered habit suggestions, and custom reminders.',
    tech: ['TypeScript', 'Next.js', 'Tailwind', 'shadcn/ui'],
    accent: '#B8895E', // Copper
    accent2: '#9A7048',
    github: 'https://github.com/Venkata-Manoj/Habit-Zen-Web',
    live: 'https://habit-zen-umber.vercel.app',
  },
  {
    number: '11',
    emoji: '📱',
    name: 'Flip2Function',
    description: 'Orientation-aware mobile app — phone tilt switches between Alarm, Stopwatch, Timer, and live Weather modes.',
    tech: ['TypeScript', 'Next.js', 'Tailwind', 'OpenWeatherMap'],
    accent: '#D4A574', // Warm Gold
    accent2: '#B8895E',
    github: 'https://github.com/Venkata-Manoj/Flip2Function',
    live: 'https://v0-no-content-hazel-nu.vercel.app',
  },
  {
    number: '12',
    emoji: '📚',
    name: 'Vibe-Learn',
    description: 'Prompt engineering education platform with interactive lessons and quiz modules teaching AI prompting skills.',
    tech: ['TypeScript', 'Next.js', 'Tailwind'],
    accent: '#C4956A', // Antique Gold
    accent2: '#A67C52',
    github: 'https://github.com/Venkata-Manoj/Vibe-Learn',
    live: 'https://vibe-learn-pi.vercel.app',
  },
  {
    number: '13',
    emoji: '🗳️',
    name: 'E-Voting-System',
    description: 'Secure client-side e-voting with voter registration, SHA-256 vote hashing, queue processing, and real-time results.',
    tech: ['HTML', 'CSS', 'JavaScript', 'SHA-256'],
    accent: '#E8B4A0', // Rose Gold
    accent2: '#D49A84',
    github: 'https://github.com/Venkata-Manoj/E-Voting-System',
    live: 'https://e-voting-system-eta.vercel.app',
  },
]

// Special last card — GitHub CTA
const GITHUB_CARD: GitHubCardData = {
  number: '14',
  emoji: '📦',
  name: 'Explore More on GitHub',
  description: 'Discover all my open-source repositories, contributions, and ongoing projects. 27 repos and counting.',
  accent: '#C0B8A8', // Warm Silver
  accent2: '#A89F90',
  github: 'https://github.com/Venkata-Manoj',
  cta: true,
}

const ALL_PROJECTS: NodeData[] = [...PROJECTS, GITHUB_CARD] // 14 items

/* =====================================================================
   CATEGORY TINT — gold/bronze family, distinguishable
   ===================================================================== */
function cat(p: NodeData): CatInfo {
  if (p.cta) return { key: 'all', label: 'All repos', col: '#C0B8A8' }
  const t = (p.tech?.[0] || '').toLowerCase()
  if (t.includes('python')) return { key: 'py', label: 'Python', col: '#D4A574' }
  if (t.includes('typescript') || t.includes('next')) return { key: 'ts', label: 'TypeScript | Next.js', col: '#C4956A' }
  if (t.includes('html')) return { key: 'web', label: 'Web Native', col: '#E8B4A0' }
  return { key: 'misc', label: 'Other', col: '#B8895E' }
}

/* =====================================================================
   PROJECTS SECTION — Interactive Constellation Nebula canvas
   ===================================================================== */
export default function ProjectsSection() {
  const isMobile = useIsMobile()
  const prefersReducedMotion = usePrefersReducedMotion()

  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<SimNode[]>([])
  const edgesRef = useRef<[number, number][]>([])
  const viewRef = useRef({ x: 0, y: 0, scale: 1 })
  const mouseRef = useRef({ x: -9999, y: -9999, sx: 0, sy: 0, down: false, drag: null as SimNode | null, panning: false })
  const rafRef = useRef<number | null>(null)
  const hoveredRef = useRef<SimNode | null>(null)
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })
  const resetRef = useRef<() => void>(() => {})
  const shakeRef = useRef<() => void>(() => {})
  const sectionRef = useRef<HTMLElement>(null)
  const isVisibleRef = useRef(true)

  const [selected, setSelected] = useState<NodeData | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current!
    const canvas = canvasRef.current!
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')!
    if (!ctx) return // jsdom / no 2d context — skip simulation but keep DOM

    const nodes = nodesRef.current
    const edges = edgesRef.current
    const view = viewRef.current
    const mouse = mouseRef.current
    const size = sizeRef.current

    function resize() {
      size.dpr = Math.min(window.devicePixelRatio || 1, 2)
      size.w = wrap!.clientWidth
      size.h = wrap!.clientHeight
      canvas!.width = size.w * size.dpr
      canvas!.height = size.h * size.dpr
      ctx!.setTransform(size.dpr, 0, 0, size.dpr, 0, 0)
    }

    function seed() {
      nodes.length = 0
      edges.length = 0
      const n = ALL_PROJECTS.length
      ALL_PROJECTS.forEach((p, i) => {
        const ang = (i / n) * Math.PI * 2
        const rad = Math.min(size.w, size.h) * 0.26
        nodes.push({
          p, i, c: cat(p),
          x: size.w / 2 + Math.cos(ang) * rad,
          y: size.h / 2 + Math.sin(ang) * rad,
          vx: 0, vy: 0, fixed: false,
          r: p.cta ? 20 : 20 + (13 - i) * 0.6,
          pulse: Math.random() * Math.PI * 2,
          hover: 0,
        })
      })
      for (let i = 0; i < n; i++) edges.push([i, (i + 1) % n])
      if (n > 6) { edges.push([0, Math.floor(n / 3)]); edges.push([3, n - 2]); edges.push([Math.floor(n / 2), n - 1]) }
    }
    // Reset: recenter view, clear interaction state, re-seed, redraw.
    // Operates on the effect's captured `view`/`mouse` so the change is visible.
    resetRef.current = () => {
      view.x = 0; view.y = 0; view.scale = 1
      mouse.drag = null; mouse.panning = false; mouse.down = false
      mouse.x = -9999; mouse.y = -9999   // reset mouse pos to kill hover
      hoveredRef.current = null           // clear hover state
      seed()
      draw()                              // always redraw immediately
    }

    // Shake: random velocity kick to every node, then redraw a frame.
    shakeRef.current = () => {
      nodes.forEach((nd) => {
        nd.vx += (Math.random() - 0.5) * 300
        nd.vy += (Math.random() - 0.5) * 300
      })
      draw()  // always redraw immediately for instant visual feedback
    }

    function toWorld(cx: number, cy: number) {
      return { x: (cx - view.x) / view.scale, y: (cy - view.y) / view.scale }
    }

    function step() {
      const k = 9000
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          let d2 = dx * dx + dy * dy
          if (d2 < 1) d2 = 1
          const d = Math.sqrt(d2)
          const f = k / d2
          const fx = (dx / d) * f, fy = (dy / d) * f
          a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy
        }
      }
      edges.forEach(([i, j]) => {
        const a = nodes[i], b = nodes[j]
        const dx = b.x - a.x, dy = b.y - a.y
        const d = Math.hypot(dx, dy) || 1
        const target = 150
        const f = (d - target) * 0.012
        const fx = (dx / d) * f, fy = (dy / d) * f
        a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy
      })
      nodes.forEach((nd) => {
        if (nd === mouse.drag) return
        nd.vx += (size.w / 2 - nd.x) * 0.0015
        nd.vy += (size.h / 2 - nd.y) * 0.0015
        nd.vx *= 0.86; nd.vy *= 0.86
        nd.x += nd.vx; nd.y += nd.vy
        nd.pulse += 0.03
      })
    }

    function draw() {
      ctx!.clearRect(0, 0, size.w, size.h)
      ctx!.save()
      ctx!.translate(view.x, view.y)
      ctx!.scale(view.scale, view.scale)

      edges.forEach(([i, j]) => {
        const a = nodes[i], b = nodes[j]
        const lit = (hoveredRef.current === a || hoveredRef.current === b)
        ctx!.strokeStyle = lit ? hexA('#EDE7D9', 0.28) : hexA('#D4A574', 0.12)
        ctx!.lineWidth = lit ? 1.6 : 1
        ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke()
      })

      hoveredRef.current = null
      const wm = toWorld(mouse.x, mouse.y)
      nodes.forEach((nd) => {
        if (mouse.x !== -9999) {
          const d = Math.hypot(nd.x - wm.x, nd.y - wm.y)
          if (d < nd.r + 8) hoveredRef.current = nd
        }
        const target = (hoveredRef.current === nd) ? 1 : 0
        nd.hover += (target - nd.hover) * 0.15

        const pr = nd.r * (1 + nd.hover * 0.25 + Math.sin(nd.pulse) * 0.02)
        const g = ctx!.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, pr * 2.6)
        g.addColorStop(0, hexA(nd.c.col, 0.5 + nd.hover * 0.3))
        g.addColorStop(1, hexA(nd.c.col, 0))
        ctx!.fillStyle = g; ctx!.beginPath(); ctx!.arc(nd.x, nd.y, pr * 2.6, 0, Math.PI * 2); ctx!.fill()

        ctx!.fillStyle = hexA(nd.c.col, 0.95)
        ctx!.beginPath(); ctx!.arc(nd.x, nd.y, pr, 0, Math.PI * 2); ctx!.fill()

        ctx!.strokeStyle = hexA('#EDE7D9', 0.2 + nd.hover * 0.5); ctx!.lineWidth = 1.4
        ctx!.beginPath(); ctx!.arc(nd.x, nd.y, pr + 4, 0, Math.PI * 2); ctx!.stroke()

        ctx!.font = (pr * 0.95) + 'px system-ui'; ctx!.textAlign = 'center'; ctx!.textBaseline = 'middle'
        ctx!.fillText(nd.p.emoji, nd.x, nd.y + 1)

        if (nd.hover > 0.15 || nd.p.cta) {
          ctx!.font = '600 12px "JetBrains Mono", monospace'
          ctx!.fillStyle = hexA('#EDE7D9', 0.9 * Math.max(nd.hover, nd.p.cta ? 0.5 : 0))
          ctx!.fillText(nd.p.name, nd.x, nd.y + pr + 16)
        }
      })

      ctx!.restore()
    }

    function loop() {
      if (isVisibleRef.current) {
        if (!prefersReducedMotion) {
          if (mouse.x !== -9999 && !mouse.panning) {
            const wm = toWorld(mouse.x, mouse.y)
            nodes.forEach((nd) => {
              if (nd === mouse.drag) return
              const dx = nd.x - wm.x, dy = nd.y - wm.y, d = Math.hypot(dx, dy)
              if (d < 120 && d > 0.1) { const f = (120 - d) / 120 * 0.35; nd.vx += dx / d * f; nd.vy += dy / d * f }
            })
          }
          step()
        }
        draw()
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    /* ── interaction ── */
    function localPos(e: PointerEvent | WheelEvent) {
      const r = wrap!.getBoundingClientRect()
      return { cx: e.clientX - r.left, cy: e.clientY - r.top }
    }
    let downPos = { x: 0, y: 0 }, moved = 0

    function onPointerDown(e: PointerEvent) {
      const { cx, cy } = localPos(e)
      mouse.x = cx; mouse.y = cy; mouse.down = true
      downPos = { x: cx, y: cy }; moved = 0
      const wm = toWorld(cx, cy)
      let hit: SimNode | null = null, hd = 1e9
      nodes.forEach((nd) => { const d = Math.hypot(nd.x - wm.x, nd.y - wm.y); if (d < nd.r + 8 && d < hd) { hd = d; hit = nd } })
      if (hit) { mouse.drag = hit; (hit as SimNode).fixed = true }
      else { mouse.panning = true; mouse.sx = cx - view.x; mouse.sy = cy - view.y }
      wrap!.classList.add('grabbing')
      wrap!.setPointerCapture(e.pointerId)
    }
    function onPointerMove(e: PointerEvent) {
      const { cx, cy } = localPos(e)
      mouse.x = cx; mouse.y = cy
      if (mouse.down) moved += Math.abs(cx - downPos.x) + Math.abs(cy - downPos.y)
      if (mouse.drag) { const wm = toWorld(cx, cy); mouse.drag.x = wm.x; mouse.drag.y = wm.y; mouse.drag.vx = mouse.drag.vy = 0 }
      else if (mouse.panning) { view.x = cx - mouse.sx; view.y = cy - mouse.sy }
    }
    function endPointer() {
      if (mouse.drag) mouse.drag.fixed = false
      mouse.down = false; mouse.drag = null; mouse.panning = false
      wrap!.classList.remove('grabbing')
    }
    function onPointerLeave() { if (!mouse.down) { mouse.x = -9999; mouse.y = -9999 } }
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const { cx, cy } = localPos(e)
      const before = toWorld(cx, cy)
      const factor = e.deltaY < 0 ? 1.1 : 0.9
      view.scale = Math.max(0.5, Math.min(2.5, view.scale * factor))
      const after = toWorld(cx, cy)
      view.x += (after.x - before.x) * view.scale
      view.y += (after.y - before.y) * view.scale
    }
    function onClick() {
      if (moved > 6) return
      const wm = toWorld(mouse.x, mouse.y)
      let best: SimNode | null = null, bd = 1e9
      nodes.forEach((nd) => { const d = Math.hypot(nd.x - wm.x, nd.y - wm.y); if (d < bd) { bd = d; best = nd } })
      if (best && bd < (best as SimNode).r + 12) setSelected((best as SimNode).p)
    }

    wrap!.addEventListener('pointerdown', onPointerDown)
    wrap!.addEventListener('pointermove', onPointerMove)
    wrap!.addEventListener('pointerup', endPointer)
    wrap!.addEventListener('pointercancel', endPointer)
    wrap!.addEventListener('pointerleave', onPointerLeave)
    wrap!.addEventListener('wheel', onWheel, { passive: false })
    wrap!.addEventListener('click', onClick)
    window.addEventListener('resize', resize)

    resize()
    seed()
    if (prefersReducedMotion) {
      draw() // single static frame
    } else {
      rafRef.current = requestAnimationFrame(loop)
    }

    return () => {
      wrap!.removeEventListener('pointerdown', onPointerDown)
      wrap!.removeEventListener('pointermove', onPointerMove)
      wrap!.removeEventListener('pointerup', endPointer)
      wrap!.removeEventListener('pointercancel', endPointer)
      wrap!.removeEventListener('pointerleave', onPointerLeave)
      wrap!.removeEventListener('wheel', onWheel)
      wrap!.removeEventListener('click', onClick)
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [prefersReducedMotion])

  // Pause canvas RAF when section scrolls out of view
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting },
      { threshold: 0 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Close panel on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const selectedCat = selected ? cat(selected) : null

  return (
    <section
      ref={sectionRef}
      id="projects"
      role="region"
      aria-label="Projects"
      className="relative overflow-hidden mx-3 sm:mx-6 md:mx-8 my-6 sm:my-8 rounded-[2rem] border border-[rgba(212,165,116,0.06)] px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-36 bg-[#0C0C0C]"
    >
      {/* ═══════════════════════════════════════════════════════════════
          AMBIENT AURORA BACKGROUND — Gold/Bronze drifting orbs
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-perf opacity-[0.08] top-[-20%] left-[-10%] animate-projects-float-a"
          style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.18), transparent 70%)' }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-perf opacity-[0.06] top-[30%] right-[-15%] animate-projects-float-b"
          style={{ background: 'radial-gradient(circle, rgba(166,124,82,0.14), transparent 70%)' }}
        />
        <div
          className="absolute w-[700px] h-[700px] rounded-full blur-perf opacity-[0.04] bottom-[-15%] left-[20%] animate-projects-float-a"
          style={{ background: 'radial-gradient(circle, rgba(196,149,106,0.10), transparent 70%)' }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-perf opacity-[0.03] top-[10%] left-[40%] animate-projects-float-b"
          style={{ background: 'radial-gradient(circle, rgba(184,137,94,0.08), transparent 70%)' }}
        />
        <div
          className="absolute w-[450px] h-[450px] rounded-full blur-perf opacity-[0.02] bottom-[20%] right-[10%] animate-projects-float-a"
          style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.06), transparent 70%)' }}
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
            HEADING
            ═══════════════════════════════════════════════════════════════ */}
        <motion.header
          className="text-center mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="eyebrow text-xs font-medium tracking-[0.3em] text-[rgba(212,165,116,0.75)] uppercase mb-[6px] animate-projects-eyebrow-fade-in">
            Featured Work
          </div>

          <h2
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
          </h2>

          <div className="title-ornaments flex items-center justify-center gap-[12px] mt-[4px] h-[10px]">
            <span className="title-dot w-[6px] h-[6px] rounded-full bg-[rgba(212,165,116,0.50)] flex-shrink-0" />
            <div
              className="title-underline h-[3px] rounded-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent, #D4A574, #A67C52, transparent)',
                width: '120px',
                transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
            <span className="title-dot w-[6px] h-[6px] rounded-full bg-[rgba(212,165,116,0.50)] flex-shrink-0" />
          </div>
        </motion.header>

        {/* ═══════════════════════════════════════════════════════════════
            CONSTELLATION NEBULA CANVAS
            ═══════════════════════════════════════════════════════════════ */}
        <div
          ref={wrapRef}
          className="neb relative h-[min(80vh,780px)] mt-10 rounded-[var(--r-lg)] overflow-hidden border border-[rgba(212,165,116,0.12)] cursor-grab touch-none"
          style={{
            background: 'radial-gradient(circle at 50% 38%, rgba(212,165,116,0.06), transparent 62%)',
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block"
            role="img"
            aria-label="Interactive constellation of project nodes. Drag a node to reposition, scroll to zoom, drag empty space to pan, and click a node to open its details."
          />

          {/* Tools */}
          <div className="absolute top-[14px] right-[14px] z-[5] flex gap-2">
            <button
              type="button"
              onClick={() => resetRef.current()}
              className="font-['JetBrains_Mono',monospace] text-[0.68rem] text-[rgba(212,165,116,0.8)] bg-[rgba(12,12,12,0.7)] border border-[rgba(212,165,116,0.18)] px-[11px] py-[6px] rounded-full cursor-pointer backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-br hover:from-[#D4A574] hover:to-[#A67C52] hover:text-[#0C0C0C] hover:border-transparent"
            >
              reset
            </button>
            <button
              type="button"
              onClick={() => shakeRef.current()}
              className="font-['JetBrains_Mono',monospace] text-[0.68rem] text-[rgba(212,165,116,0.8)] bg-[rgba(12,12,12,0.7)] border border-[rgba(212,165,116,0.18)] px-[11px] py-[6px] rounded-full cursor-pointer backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-br hover:from-[#D4A574] hover:to-[#A67C52] hover:text-[#0C0C0C] hover:border-transparent"
            >
              shake
            </button>
          </div>

          {/* Legend */}
          <div className="absolute left-[14px] bottom-[14px] z-[5] flex flex-col gap-[5px] font-['JetBrains_Mono',monospace] text-[0.66rem] text-[rgba(237,231,217,0.5)] pointer-events-none">
            {Array.from(new Map(ALL_PROJECTS.map((p) => { const c = cat(p); return [c.key, c] })).values()).map((c) => (
              <span key={c.key} className="flex items-center gap-[6px]">
                <i className="w-[9px] h-[9px] rounded-full inline-block" style={{ background: c.col }} />
                {c.label}
              </span>
            ))}
          </div>

          {/* Hint */}
          <div className={`absolute left-1/2 bottom-[16px] -translate-x-1/2 text-[rgba(237,231,217,0.4)] text-[0.72rem] tracking-[0.08em] pointer-events-none z-[4] text-center ${isMobile ? 'hidden' : ''}`}>
            drag a node to reposition · scroll to zoom · drag empty space to pan · click to open
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          DETAIL PANEL — centered modal card
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className={`fixed inset-0 z-[55] bg-black/55 backdrop-blur-[3px] transition-opacity duration-[400ms] ${selected ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSelected(null)}
        aria-hidden={!selected}
      />
      <aside
        className={`fixed top-1/2 left-1/2 z-[60] w-[min(440px,92vw)] p-[2.2rem] overflow-hidden rounded-[var(--r-lg)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${selected ? 'opacity-100 -translate-x-1/2 -translate-y-1/2 scale-100' : 'opacity-0 -translate-x-1/2 -translate-y-[46%] scale-[0.94] pointer-events-none'}`}
        style={{
          background: 'linear-gradient(160deg, rgba(28,25,22,0.98), rgba(16,14,12,0.98))',
          border: '1px solid rgba(212,165,116,0.2)',
          boxShadow: '0 40px 100px -30px rgba(0,0,0,0.9)',
        }}
        aria-hidden={!selected}
        role="dialog"
        aria-modal="true"
        data-testid="project-panel"
        aria-label={selected ? `${selected.name} details` : undefined}
      >
        {selected && selectedCat && (
          <>
            <div
              className="absolute inset-0 z-0 opacity-[0.14] pointer-events-none"
              style={{ background: `radial-gradient(circle at 30% 20%, ${hexA(selectedCat.col, 0.5)}, transparent 60%)` }}
            />
            <div className="relative z-[2]">
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute top-[-8px] right-[-8px] w-[38px] h-[38px] rounded-full grid place-items-center z-[5] bg-[rgba(212,165,116,0.1)] border border-[rgba(212,165,116,0.25)] text-[#D4A574] cursor-pointer transition-all duration-300 hover:bg-[rgba(212,165,116,0.25)] hover:rotate-90"
              >
                ✕
              </button>
              <div className="font-['JetBrains_Mono',monospace] text-[rgba(212,165,116,0.7)] tracking-[0.15em] text-[0.78rem]">
                {selected.cta ? 'ALL REPOS' : `PROJECT ${selected.number}`}
              </div>
              <div
                className="w-[76px] h-[76px] rounded-[20px] grid place-items-center text-[2.1rem] my-[0.9rem]"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(212,165,116,0.22), rgba(166,124,82,0.07) 60%, transparent 80%)',
                  border: '1px solid rgba(212,165,116,0.25)',
                }}
              >
                {selected.emoji}
              </div>
              <h3 className="font-['Kanit',sans-serif] text-[2.1rem] font-bold mb-[0.9rem]">{selected.name}</h3>
              <p className="text-[rgba(237,231,217,0.7)] font-light leading-[1.7] text-[0.95rem]">{selected.description}</p>
              <div className="flex flex-wrap gap-[6px] my-[1.2rem]">
                {selected.tech?.map((t: string) => (
                  <span
                    key={t}
                    className="text-xs px-[12px] py-[5px] rounded-full border border-[rgba(212,165,116,0.18)] text-[rgba(237,231,217,0.8)]"
                    style={{ background: 'rgba(212,165,116,0.06)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-[10px] mt-[1.4rem]">
                <a
                  href={selected.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[6px] px-[16px] py-[9px] rounded-full text-[0.85rem] font-medium bg-[rgba(212,165,116,0.12)] border border-[rgba(212,165,116,0.3)] text-[#D4A574] transition-all duration-300 hover:bg-[rgba(212,165,116,0.22)]"
                >
                  Code ↗
                </a>
                {selected.live && (
                  <a
                    href={selected.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-[6px] px-[16px] py-[9px] rounded-full text-[0.85rem] font-medium bg-[rgba(212,165,116,0.12)] border border-[rgba(212,165,116,0.3)] text-[#D4A574] transition-all duration-300 hover:bg-[rgba(212,165,116,0.22)]"
                  >
                    Live ↗
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </aside>
    </section>
  )
}
