import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import { hexA } from '../lib/colorUtils'

/* =====================================================================
   DATA — 12 certificates (gold/bronze palette accents)
   Images live in /public/certificates/ — Vite serves them at root.
   ===================================================================== */

interface Certificate {
  title: string
  org: string
  date: string
  image: string
  accent: string
  badge: { letter: string; color: string }  // programmatic brand badge
}

const CERTS: Certificate[] = [
  {
    title: 'AI Fundamentals',
    org: 'DataCamp',
    date: '2026',
    image: '/certificates/AI_Fundamentals_DC.webp',
    accent: '#D4A574',
    badge: { letter: '🏕️', color: '#03C04A' },
  },
  {
    title: 'API Fundamentals',
    org: 'DataCamp',
    date: '2026',
    image: '/certificates/API_DC.webp',
    accent: '#D4A574',
    badge: { letter: '🏕️', color: '#03C04A' },
  },
  {
    title: 'AI Engineer — Data Science',
    org: 'DataCamp',
    date: '2026',
    image: '/certificates/AiE_DS_DC.webp',
    accent: '#C4956A',
    badge: { letter: '🏕️', color: '#03C04A' },
  },
  {
    title: 'AI Engineer — Development',
    org: 'DataCamp',
    date: '2026',
    image: '/certificates/AiE_dev_DC.webp',
    accent: '#A67C52',
    badge: { letter: '🏕️', color: '#03C04A' },
  },
  {
    title: 'Python Programming',
    org: 'Kaggle',
    date: '2025',
    image: '/certificates/B V Manoj - Python.webp',
    accent: '#B8895E',
    badge: { letter: '🏆', color: '#20BEFF' },
  },
  {
    title: 'Season 13 Cohort',
    org: 'Google Developer Groups',
    date: '2026',
    image: '/certificates/B V Manoj_certificate_s13.webp',
    accent: '#C4956A',
    badge: { letter: '🌐', color: '#4285F4' },
  },
  {
    title: 'Ultimate AI Power Weekend',
    org: 'Outskill',
    date: '2025',
    image: '/certificates/Certificate - B V Manoj - The Ultimate AI Power Weekend_pages-to-jpg-0001.webp',
    accent: '#D4A574',
    badge: { letter: '🚀', color: '#7C3AED' },
  },
  {
    title: 'Embeddings Fundamentals',
    org: 'DataCamp',
    date: '2026',
    image: '/certificates/Embeddings_DC.webp',
    accent: '#A67C52',
    badge: { letter: '🏕️', color: '#03C04A' },
  },
  {
    title: 'Large Language Models',
    org: 'DataCamp',
    date: '2026',
    image: '/certificates/LLM_DC.webp',
    accent: '#D4A574',
    badge: { letter: '🏕️', color: '#03C04A' },
  },
  {
    title: 'AI Certification',
    org: 'NIELIT',
    date: '2026',
    image: '/certificates/NIELIT.webp',
    accent: '#C4956A',
    badge: { letter: '🎓', color: '#1E3A5F' },
  },
  {
    title: 'RAG Bootcamp',
    org: 'KodeKloud',
    date: '2026',
    image: '/certificates/RAG-BootCamp-KodeKloud.webp',
    accent: '#B8895E',
    badge: { letter: '☁️', color: '#DC2626' },
  },
  {
    title: 'Jio Course Certificate',
    org: 'Jio',
    date: '2026',
    image: '/certificates/course_certificate_jio.webp',
    accent: '#A67C52',
    badge: { letter: '📡', color: '#D81B60' },
  },
]

/* =====================================================================
   TYPES — simulation nodes / edges / signals
   ===================================================================== */

interface Neuron {
  c: Certificate
  i: number
  x: number
  y: number
  vx: number
  vy: number
  r: number
  ph: number
  glow: number
  fire: number
}

interface Edge {
  a: number
  b: number
}

interface Signal {
  a: number
  b: number
  t: number
  speed: number
  energy: number
  trail: { x: number; y: number }[]
}

/* =====================================================================
   CERTIFICATES SECTION — Interactive Synapse Web canvas
   ===================================================================== */
export default function CertificatesSection() {
  const prefersReducedMotion = usePrefersReducedMotion()

  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const neuronsRef = useRef<Neuron[]>([])
  const edgesRef = useRef<Edge[]>([])
  const adjRef = useRef<Set<number>[]>([])
  const signalsRef = useRef<Signal[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999, drag: null as Neuron | null })
  const hoveredRef = useRef<Neuron | null>(null)
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })
  const isCoarseRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fireCountRef = useRef(0)
  const hzRef = useRef(0)
  const lastHzRef = useRef(0)
  const readoutRef = useRef<HTMLDivElement>(null)

  const seedRef = useRef<() => void>(() => {})
  const pulseRef = useRef<() => void>(() => {})
  const resetRef = useRef<() => void>(() => {})
  const drawRef = useRef<() => void>(() => {})
  const sectionRef = useRef<HTMLElement>(null)
  const isVisibleRef = useRef(true)

  const [selected, setSelected] = useState<Certificate | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return // jsdom / no 2d context — skip simulation but keep DOM

    const neurons = neuronsRef.current
    const edges = edgesRef.current
    const adj = adjRef.current
    const signals = signalsRef.current
    const mouse = mouseRef.current
    const size = sizeRef.current

    function resize() {
      if (!wrap || !canvas) return
      size.dpr = Math.min(window.devicePixelRatio || 1, 2)
      size.w = wrap.clientWidth
      size.h = wrap.clientHeight
      canvas.width = size.w * size.dpr
      canvas.height = size.h * size.dpr
      ctx!.setTransform(size.dpr, 0, 0, size.dpr, 0, 0)
      // ponytail: coarse pointer OR narrow viewport → mobile/compact mode
      isCoarseRef.current =
        window.matchMedia('(pointer: coarse)').matches || size.w < 640
    }

    function seed() {
      neurons.length = 0
      edges.length = 0
      signals.length = 0
      adj.length = 0
      const cx = size.w / 2
      const cy = size.h / 2
      const R = Math.min(size.w, size.h) * 0.32
      const compact = isCoarseRef.current
      CERTS.forEach((c, i) => {
        const ang = (i / CERTS.length) * Math.PI * 2 - Math.PI / 2
        neurons.push({
          c, i,
          x: cx + Math.cos(ang) * R + (Math.random() - 0.5) * 40,
          y: cy + Math.sin(ang) * R + (Math.random() - 0.5) * 40,
          vx: 0, vy: 0,
          r: compact ? 26 + (i % 3) * 4 : 20 + (i % 3) * 3, ph: Math.random() * 6, glow: 0, fire: 0,
        })
        adj.push(new Set<number>())
      })
      const seen = new Set<string>()
      neurons.forEach((a, i) => {
        const dists = neurons
          .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
          .filter((o) => o.j !== i)
          .sort((p, q) => p.d - q.d)
        const k = 2 + (i % 2)
        dists.slice(0, k).forEach((o) => {
          const key = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`
          if (!seen.has(key)) {
            seen.add(key)
            edges.push({ a: i, b: o.j })
            adj[i].add(o.j)
            adj[o.j].add(i)
          }
        })
      })
    }
    seedRef.current = seed
    drawRef.current = draw

    // Reset: re-seed + reset interaction state, redraw a frame if static.
    resetRef.current = () => {
      seedRef.current()
      if (prefersReducedMotion) drawRef.current()
    }

    // Light force relaxation so the web breathes / recovers after drag.
    function relax() {
      const cx = size.w / 2
      const cy = size.h / 2
      for (let i = 0; i < neurons.length; i++) {
        const a = neurons[i]
        if (a === mouse.drag) continue
        let fx = 0
        let fy = 0
        for (let j = 0; j < neurons.length; j++) {
          if (i === j) continue
          const b = neurons[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy) || 1
          const rep = 2600 / (d * d)
          fx += (dx / d) * rep
          fy += (dy / d) * rep
        }
        adj[i].forEach((j) => {
          const b = neurons[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const d = Math.hypot(dx, dy) || 1
          const spring = (d - Math.min(size.w, size.h) * 0.24) * 0.006
          fx += (dx / d) * spring * d
          fy += (dy / d) * spring * d
        })
        fx += (cx - a.x) * 0.0008
        fy += (cy - a.y) * 0.0008
        a.vx = (a.vx + fx) * 0.82
        a.vy = (a.vy + fy) * 0.82
        a.x += a.vx * 0.05
        a.y += a.vy * 0.05
        a.x = Math.max(a.r, Math.min(size.w - a.r, a.x))
        a.y = Math.max(a.r, Math.min(size.h - a.r, a.y))
      }
    }

    function fire(start: number, manual: boolean) {
      const startN = neurons[start]
      startN.glow = 1
      if (manual) startN.fire = 1
      fireCountRef.current++
      const visited = new Set<number>([start])
      let frontier = [start]
      let energy = 1
      const step = () => {
        if (energy < 0.12 || frontier.length === 0) return
        const next: number[] = []
        frontier.forEach((idx) => {
          adj[idx].forEach((nb) => {
            if (visited.has(nb)) return
            visited.add(nb)
            next.push(nb)
            signals.push({ a: idx, b: nb, t: 0, speed: 0.045 + Math.random() * 0.02, energy: energy * 0.85, trail: [] })
          })
        })
        energy *= 0.62
        frontier = next
        if (energy >= 0.12) setTimeout(step, 130)
      }
      step()
    }
    pulseRef.current = () => {
      if (prefersReducedMotion) {
        neurons.forEach((n) => { n.glow = 1 })
        if (ctx) draw()
        return
      }
      neurons.forEach((_n, i) => setTimeout(() => fire(i, false), i * 90))
    }

    function isDim(n: Neuron): boolean {
      const h = hoveredRef.current
      if (!h) return false
      if (n === h) return false
      return !adj[h.i].has(n.i)
    }

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, size.w, size.h)

      // hover detection (skip while dragging — drag node stays hovered)
      hoveredRef.current = mouse.drag || null
      if (!mouse.drag && mouse.x !== -9999) {
        hoveredRef.current = null
        neurons.forEach((n) => {
          if (Math.hypot(n.x - mouse.x, n.y - mouse.y) < n.r + 5) hoveredRef.current = n
        })
      }

      edges.forEach((e) => {
        const a = neurons[e.a]
        const b = neurons[e.b]
        const dim = isDim(a) && isDim(b)
        let active = 0
        signals.forEach((s) => {
          if ((s.a === e.a && s.b === e.b) || (s.a === e.b && s.b === e.a)) {
            active = Math.max(active, s.energy * (1 - Math.abs(s.t - 0.5) * 2 + 0.4))
          }
        })
        const highlight = hoveredRef.current && (a === hoveredRef.current || b === hoveredRef.current) ? 0.4 : 0
        ctx.strokeStyle = hexA('#D4A574', (dim ? 0.04 : 0.12) + active * 0.7 + highlight)
        ctx.lineWidth = 1 + active * 2.5
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      })

      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i]
        s.t += s.speed
        const a = neurons[s.a]
        const b = neurons[s.b]
        const px = a.x + (b.x - a.x) * s.t
        const py = a.y + (b.y - a.y) * s.t
        s.trail.push({ x: px, y: py })
        if (s.trail.length > 8) s.trail.shift()
        for (let k = 0; k < s.trail.length - 1; k++) {
          ctx.strokeStyle = hexA('#E8C88A', s.energy * 0.4 * (k / s.trail.length))
          ctx.lineWidth = 2.5 * (k / s.trail.length)
          ctx.beginPath()
          ctx.moveTo(s.trail[k].x, s.trail[k].y)
          ctx.lineTo(s.trail[k + 1].x, s.trail[k + 1].y)
          ctx.stroke()
        }
        if (s.t >= 1) {
          neurons[s.b].glow = Math.max(neurons[s.b].glow, s.energy)
          signals.splice(i, 1)
          continue
        }
        const g = ctx.createRadialGradient(px, py, 0, px, py, 9)
        g.addColorStop(0, hexA('#EDE7D9', 0.95 * s.energy))
        g.addColorStop(1, hexA(a.c.accent, 0))
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(px, py, 9, 0, Math.PI * 2)
        ctx.fill()
      }

      neurons.forEach((n) => {
        const isH = hoveredRef.current === n
        const dim = isDim(n)
        const pr = n.r * (1 + (isH ? 0.22 : 0) + n.glow * 0.25)
        ctx.globalAlpha = dim ? 0.32 : 1
        if (n.fire > 0.05) {
          ctx.strokeStyle = hexA(n.c.accent, n.fire * 0.5)
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.r + (1 - n.fire) * 90, 0, Math.PI * 2)
          ctx.stroke()
        }
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pr * 2.6)
        g.addColorStop(0, hexA(n.c.accent, 0.45 + n.glow * 0.4))
        g.addColorStop(1, hexA(n.c.accent, 0))
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(n.x, n.y, pr * 2.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = hexA(n.c.accent, 0.92)
        ctx.beginPath()
        ctx.arc(n.x, n.y, pr, 0, Math.PI * 2)
        ctx.fill()
        // Brand badge — colored circular badge with emoji inside the neuron
        const badgeR = pr * 0.5
        const badgeY = n.y - pr * 0.08  // slightly above center
        ctx.save()
        // Badge background circle
        ctx.beginPath()
        ctx.arc(n.x, badgeY, badgeR, 0, Math.PI * 2)
        ctx.fillStyle = hexA(n.c.badge.color, 0.85)
        ctx.fill()
        // Badge ring
        ctx.strokeStyle = hexA('#EDE7D9', 0.3)
        ctx.lineWidth = 1
        ctx.stroke()
        // Emoji letter
        ctx.font = `${badgeR * 1.1}px system-ui`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#ffffff'
        ctx.fillText(n.c.badge.letter, n.x, badgeY + 1)
        ctx.restore()
        ctx.strokeStyle = hexA('#EDE7D9', 0.25 + (isH ? 0.5 : 0) + n.glow * 0.4)
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.arc(n.x, n.y, pr + 3, 0, Math.PI * 2)
        ctx.stroke()
        if (isH || n.glow > 0.3 || isCoarseRef.current) {
          ctx.font = isCoarseRef.current ? '600 11px "JetBrains Mono", monospace' : '600 10px "JetBrains Mono", monospace'
          ctx.globalAlpha = dim ? 0.32 : (isH ? 1 : n.glow)
          ctx.fillStyle = hexA('#EDE7D9', 0.9)
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(n.c.title.slice(0, 16), n.x, n.y + pr + 12)
        }
        ctx.globalAlpha = 1
      })

      if (readoutRef.current) {
        const h = hoveredRef.current
        readoutRef.current.textContent = h
          ? `Σ ${h.c.title}\n  ${h.c.org} · ${adj[h.i].size} synapses`
          : `Σ synaptic firing · ${hzRef.current} Hz`
      }
    }

    function tick() {
      if (isVisibleRef.current) {
        if (!prefersReducedMotion) relax()
        neurons.forEach((n) => {
          n.ph += 0.03
          n.glow *= 0.94
          if (n.fire > 0) n.fire *= 0.96
        })
        const now = performance.now()
        if (now - lastHzRef.current > 1000) {
          hzRef.current = fireCountRef.current
          fireCountRef.current = 0
          lastHzRef.current = now
        }
        draw()
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    function scheduleAuto() {
      if (prefersReducedMotion) return
      autoTimerRef.current = setTimeout(() => {
        fire(Math.floor(Math.random() * neurons.length), false)
        scheduleAuto()
      }, 900 + Math.random() * 1600)
    }

    /* ── interaction ── */
    function localPos(e: PointerEvent) {
      const r = wrap!.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    function onPointerDown(e: PointerEvent) {
      const p = localPos(e)
      mouse.x = p.x
      mouse.y = p.y
      let hit: Neuron | null = null
      let hd = 1e9
      const pad = isCoarseRef.current ? 12 : 6
      for (const n of neurons) {
        const d = Math.hypot(n.x - p.x, n.y - p.y)
        if (d < n.r + pad && d < hd) { hd = d; hit = n }
      }
      if (hit) {
        mouse.drag = hit
        hit.vx = 0
        hit.vy = 0
        wrap!.classList.add('dragging')
        wrap!.setPointerCapture(e.pointerId)
      }
    }
    function onPointerMove(e: PointerEvent) {
      const p = localPos(e)
      mouse.x = p.x
      mouse.y = p.y
      if (mouse.drag) {
        mouse.drag.x = p.x
        mouse.drag.y = p.y
        mouse.drag.vx = 0
        mouse.drag.vy = 0
      }
    }
    function onPointerUp(e: PointerEvent) {
      const p = localPos(e)
      if (mouse.drag) {
        const moved = Math.hypot(p.x - mouse.drag.x, p.y - mouse.drag.y) > (isCoarseRef.current ? 8 : 5)
        if (!moved) {
          if (prefersReducedMotion) mouse.drag.glow = 1
          else fire(mouse.drag.i, true)
          setSelected(mouse.drag.c)
        }
        mouse.drag = null
        wrap!.classList.remove('dragging')
      }
    }
    function onPointerLeave() {
      mouse.x = -9999
      mouse.y = -9999
      if (mouse.drag) {
        mouse.drag = null
        wrap!.classList.remove('dragging')
      }
    }

    wrap.addEventListener('pointerdown', onPointerDown)
    wrap.addEventListener('pointermove', onPointerMove)
    wrap.addEventListener('pointerup', onPointerUp)
    wrap.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('resize', resize)

    resize()
    seed()
    if (prefersReducedMotion) {
      draw() // single static frame
    } else {
      rafRef.current = requestAnimationFrame(tick)
      scheduleAuto()
    }

    return () => {
      wrap.removeEventListener('pointerdown', onPointerDown)
      wrap.removeEventListener('pointermove', onPointerMove)
      wrap.removeEventListener('pointerup', onPointerUp)
      wrap.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
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

  // Header animation state
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section
      ref={sectionRef}
      id="certificates"
      role="region"
      aria-label="Certificates"
      className="relative overflow-hidden mx-3 sm:mx-6 md:mx-8 my-6 sm:my-8 rounded-[2rem] border border-[rgba(212,165,116,0.06)] px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-36 bg-[#0C0C0C] min-h-screen"
    >
      {/* ═══════════════════════════════════════════════════════════════
          AMBIENT ORBS — 3 layers, gold/bronze drifting
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className="pointer-events-none absolute top-[-120px] right-[-80px] w-[500px] h-[500px] rounded-full blur-perf"
        style={{
          background:
            'radial-gradient(circle, rgba(212,165,116,0.07), transparent)',
          animation: 'orbFloatSlow 8s ease-in-out infinite',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[-100px] left-[-100px] w-[450px] h-[450px] rounded-full blur-perf"
        style={{
          background:
            'radial-gradient(circle, rgba(196,149,106,0.06), transparent)',
          animation: 'orbFloatMedium 6s ease-in-out infinite',
        }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-perf"
        style={{
          background:
            'radial-gradient(circle, rgba(196,149,106,0.06), transparent)',
          animation: 'orbFloatFast 4s ease-in-out infinite',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          GOLD GRID OVERLAY — 60×60, masked radial
          ═══════════════════════════════════════════════════════════════ */}
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
            HEADER — Eyebrow + heading + underline + subtitle
            ═══════════════════════════════════════════════════════════════ */}
        <div ref={headerRef}>
          <p
            className={`cert-eyebrow text-center text-xs font-medium uppercase tracking-[0.3em] mb-1 ${headerInView ? 'in-view' : ''}`}
            style={{ color: 'rgba(212,165,116,0.75)' }}
          >
            Verified Credentials
          </p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-6 mb-1"
          >
            <span
              className="flex-none h-[2px] rounded-full"
              style={{
                width: 140,
                background: 'linear-gradient(90deg, transparent, #D4A574, #A67C52)',
              }}
            />
            <h2
              className="font-['Kanit'] font-black uppercase leading-none tracking-[0.12em] whitespace-nowrap"
              style={{
                fontSize: 'clamp(3rem, 9vw, 7.5rem)',
                background: 'linear-gradient(135deg, #D4A574, #A67C52)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CERTIFICATES
            </h2>
            <span
              className="flex-none h-[2px] rounded-full"
              style={{
                width: 140,
                background: 'linear-gradient(90deg, #A67C52, #D4A574, transparent)',
              }}
            />
          </motion.div>

          <div
            className={`cert-underline-wrap flex justify-center mx-auto ${headerInView ? 'in-view' : ''}`}
            style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}
          >
            <span
              className="block h-[3px] rounded-full"
              style={{
                width: 80,
                background:
                  'linear-gradient(90deg, transparent, #D4A574, #A67C52, transparent)',
              }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-sm font-light tracking-[0.15em] mb-12 max-sm:mb-8"
            style={{ color: 'rgba(237,231,217,0.65)' }}
          >
            Industry-recognized credentials validating expertise
          </motion.p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SYNAPSE WEB CANVAS
            ═══════════════════════════════════════════════════════════════ */}
        <div
          ref={wrapRef}
          className="relative h-[min(82vh,800px)] mt-10 rounded-[var(--r-lg)] overflow-hidden border border-[rgba(212,165,116,0.12)] cursor-grab touch-none"
          style={{
            background: 'radial-gradient(circle at 50% 55%, rgba(212,165,116,0.06), transparent 65%)',
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block"
            role="img"
            aria-label="Interactive neural map of certifications. Click a neuron to view details."
          />

          {/* Tools */}
          <div className="absolute top-[14px] right-[14px] z-[5] flex gap-2">
            <button
              type="button"
              onClick={() => pulseRef.current()}
              className="font-['JetBrains_Mono',monospace] text-[0.68rem] text-[rgba(212,165,116,0.8)] bg-[rgba(12,12,12,0.7)] border border-[rgba(212,165,116,0.18)] px-[11px] py-[6px] rounded-full cursor-pointer backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-br hover:from-[#D4A574] hover:to-[#A67C52] hover:text-[#0C0C0C] hover:border-transparent"
            >
              pulse all
            </button>
            <button
              type="button"
              onClick={() => resetRef.current()}
              className="font-['JetBrains_Mono',monospace] text-[0.68rem] text-[rgba(212,165,116,0.8)] bg-[rgba(12,12,12,0.7)] border border-[rgba(212,165,116,0.18)] px-[11px] py-[6px] rounded-full cursor-pointer backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-br hover:from-[#D4A574] hover:to-[#A67C52] hover:text-[#0C0C0C] hover:border-transparent"
            >
              reset
            </button>
          </div>

          {/* Readout */}
          <div
            ref={readoutRef}
            className="absolute left-[14px] top-[14px] z-[5] font-['JetBrains_Mono',monospace] text-[0.75rem] text-[rgba(212,165,116,0.85)] text-left pointer-events-none leading-[1.6] min-h-[1.2em] whitespace-pre"
          >
            Σ synaptic firing · 0 Hz
          </div>

          {/* Hint */}
          <div className="absolute left-1/2 bottom-[16px] -translate-x-1/2 text-[rgba(237,231,217,0.4)] text-[0.72rem] tracking-[0.08em] pointer-events-none z-[4] text-center">
            click a neuron to fire · drag to rearrange · hover to isolate its circuit
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
        className={`fixed top-1/2 left-1/2 z-[60] w-[min(420px,92vw)] p-[1.8rem] overflow-hidden rounded-[var(--r-lg)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${selected ? 'opacity-100 -translate-x-1/2 -translate-y-1/2 scale-100' : 'opacity-0 -translate-x-1/2 -translate-y-[46%] scale-[0.94] pointer-events-none'}`}
        style={{
          background: 'linear-gradient(160deg, rgba(28,25,22,0.98), rgba(16,14,12,0.98))',
          border: '1px solid rgba(212,165,116,0.2)',
          boxShadow: '0 40px 100px -30px rgba(0,0,0,0.9)',
        }}
        aria-hidden={!selected}
        role="dialog"
        aria-modal="true"
        data-testid="cert-panel"
        aria-label={selected ? `${selected.title} certificate details` : undefined}
      >
        {selected && (
          <>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute top-[14px] right-[14px] w-[36px] h-[36px] rounded-full grid place-items-center z-[5] bg-[rgba(212,165,116,0.1)] border border-[rgba(212,165,116,0.25)] text-[#D4A574] cursor-pointer transition-all duration-300 hover:bg-[rgba(212,165,116,0.25)] hover:rotate-90"
            >
              ✕
            </button>
            <img
              src={encodeURI(selected.image)}
              alt={selected.title}
              className="w-full h-[220px] object-cover rounded-[12px] bg-black border border-[rgba(212,165,116,0.12)]"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="flex items-center gap-3 mt-[1rem]">
              <span
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{
                  background: hexA(selected.badge.color, 0.15),
                  border: `1px solid ${hexA(selected.badge.color, 0.35)}`,
                }}
              >
                {selected.badge.letter}
              </span>
              <div>
                <div className="font-['JetBrains_Mono',monospace] text-[rgba(212,165,116,0.7)] tracking-[0.1em] text-[0.74rem]">
                  {selected.org} · {selected.date}
                </div>
                <h3 className="font-['Kanit',sans-serif] text-[1.6rem] font-bold -mt-[2px]">
                  {selected.title}
                </h3>
              </div>
            </div>
            <a
              href={encodeURI(selected.image)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[6px] mt-[1.2rem] px-[16px] py-[9px] rounded-full text-[0.85rem] font-medium bg-[rgba(212,165,116,0.12)] border border-[rgba(212,165,116,0.3)] text-[#D4A574] transition-all duration-300 hover:bg-[rgba(212,165,116,0.22)]"
              aria-label={`View ${selected.title} certificate in a new tab`}
            >
              <span>View Certificate</span>
              <ArrowUpRight size={14} />
            </a>
          </>
        )}
      </aside>
    </section>
  )
}
