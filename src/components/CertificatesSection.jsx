import { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react'
import {
  motion,
  useMotionValue,
  animate,
  useInView,
} from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'

/* =====================================================================
   DATA — 13 certificates (gold/bronze palette accents)
   Images live in /public/certificates/ — Vite serves them at root.
   On Vercel, image src/srcSet routes through /_vercel/image for
   auto-WebP + responsive sizes (see optimizeImage helper below).
   ===================================================================== */
const CERTS = [
  {
    title: 'AI Fundamentals',
    org: 'DataCamp',
    date: '2026',
    image: '/certificates/AI_Fundamentals_DC.png',
    accent: '#D4A574',
  },
  {
    title: 'API Fundamentals',
    org: 'DataCamp',
    date: '2026',
    image: '/certificates/API_DC.png',
    accent: '#D4A574',
  },
  {
    title: 'AI Engineer — Data Science',
    org: 'DataCamp',
    date: '2026',
    image: '/certificates/AiE_DS_DC.png',
    accent: '#C4956A',
  },
  {
    title: 'AI Engineer — Development',
    org: 'DataCamp',
    date: '2026',
    image: '/certificates/AiE_dev_DC.png',
    accent: '#A67C52',
  },
  {
    title: 'Intro to Programming',
    org: 'Kaggle',
    date: '2025',
    image: '/certificates/B V Manoj - Intro to Programming.png',
    accent: '#B8895E',
  },
  {
    title: 'Python Programming',
    org: 'Kaggle',
    date: '2025',
    image: '/certificates/B V Manoj - Python.png',
    accent: '#B8895E',
  },
  {
    title: 'Season 13 Cohort',
    org: 'Google Developer Groups',
    date: '2026',
    image: '/certificates/B V Manoj_certificate_s13.jpeg',
    accent: '#C4956A',
  },
  {
    title: 'Ultimate AI Power Weekend',
    org: 'Outskill',
    date: '2025',
    image: '/certificates/Certificate - B V Manoj - The Ultimate AI Power Weekend_pages-to-jpg-0001.jpg',
    accent: '#D4A574',
  },
  {
    title: 'Embeddings Fundamentals',
    org: 'DataCamp',
    date: '2026',
    image: '/certificates/Embeddings_DC.png',
    accent: '#A67C52',
  },
  {
    title: 'Large Language Models',
    org: 'DataCamp',
    date: '2026',
    image: '/certificates/LLM_DC.png',
    accent: '#D4A574',
  },
  {
    title: 'AI Certification',
    org: 'NIELIT',
    date: '2026',
    image: '/certificates/NIELIT.png',
    accent: '#C4956A',
  },
  {
    title: 'RAG Bootcamp',
    org: 'KodeKloud',
    date: '2026',
    image: '/certificates/RAG-BootCamp-KodeKloud.png',
    accent: '#B8895E',
  },
  {
    title: 'Jio Course Certificate',
    org: 'Jio',
    date: '2026',
    image: '/certificates/course_certificate_jio.png',
    accent: '#A67C52',
  },
]

/* =====================================================================
   CONSTANTS — auto-play, sizing
   ===================================================================== */
const AUTOPLAY_INTERVAL_MS = 5000
const CARD_GAP_PX = 24
const CARD_DESKTOP_WIDTH_PX = 380
const CARD_MOBILE_WIDTH_RATIO = 0.85
const TOTAL = CERTS.length
const CLONE_COUNT = 3

// Build flat array of clones for infinite scroll (4 full sets)
const ALL_CERTS = []
for (let i = 0; i < CLONE_COUNT + 1; i++) {
  ALL_CERTS.push(...CERTS)
}

/* =====================================================================
   IMAGE OPTIMIZATION — Vercel Image Optimization
   On Vercel deployments, routes /certificates/foo.png through
   /_vercel/image?url=...&w=...&q=...&f=webp for auto-WebP + resize.
   Off-Vercel (local dev, GitHub Pages, etc.) returns the original path.
   ===================================================================== */
const IS_VERCEL = typeof window !== 'undefined'
  && /vercel\.app$|vercel\.com$/.test(window.location.hostname)

function optimizeImage(path, width, quality = 75) {
  if (!IS_VERCEL) return encodeURI(path)
  return `/_vercel/image?url=${encodeURIComponent(path)}&w=${width}&q=${quality}`
}

/* =====================================================================
   CERTIFICATE CARD
   ===================================================================== */
function CertificateCard({ cert, index, isVisible }) {
  const staggerDelay = (index % TOTAL) * 100

  return (
    <article
      className={`cert-card group ${isVisible ? 'is-visible' : 'is-hidden'}`}
      data-index={index}
      role="group"
      aria-roledescription="slide"
      aria-label={`${(index % TOTAL) + 1} of ${TOTAL}: ${cert.title}`}
      style={{ transitionDelay: `${staggerDelay}ms` }}
    >
      {/* Top gold streak */}
      <div className="absolute top-0 left-[10%] right-[10%] h-[2px] z-4 pointer-events-none bg-gradient-to-r from-transparent via-[#D4A574] via-[30%] via-[#A67C52] via-[70%] to-transparent" aria-hidden="true" />

      {/* Watermark number (top-right) */}
      <span className="absolute top-[70px] right-4 font-mono font-black text-[6rem] leading-none z-2 pointer-events-none gold-text opacity-6" style={{ letterSpacing: '-0.04em' }} aria-hidden="true">
        {String((index % TOTAL) + 1).padStart(2, '0')}
      </span>

      {/* Shimmer overlay (hover only) */}
      <div className="cert-shimmer" aria-hidden="true" />

      {/* Image area */}
      <div className="relative w-full h-[240px] bg-black/50 overflow-hidden">
        <img
          src={optimizeImage(cert.image, 640)}
          srcSet={`
            ${optimizeImage(cert.image, 320)} 320w,
            ${optimizeImage(cert.image, 640)} 640w,
            ${optimizeImage(cert.image, 960)} 960w
          `}
          sizes="(max-width: 768px) 85vw, 380px"
          alt={`${cert.title} certificate`}
          loading="lazy"
          decoding="async"
          className="cert-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            transition:
              'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onError={(e) => {
            e.currentTarget.style.opacity = '0.15'
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, transparent 40%, rgba(30,28,26,0.95) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          position: 'relative',
          zIndex: 3,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(212,165,116,0.5)',
            border: '1px solid rgba(212,165,116,0.12)',
            borderRadius: '999px',
            background: 'rgba(212,165,116,0.03)',
            alignSelf: 'flex-start',
          }}
        >
          {cert.org}
        </span>
        <h3
          style={{
            fontWeight: 700,
            color: '#EDE7D9',
            fontSize: '1.25rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {cert.title}
        </h3>
        <p
          style={{
            fontSize: '0.85rem',
            fontWeight: 300,
            color: 'rgba(237,231,217,0.4)',
          }}
        >
          {cert.date}
        </p>
        <a
          href={cert.image}
          target="_blank"
          rel="noopener noreferrer"
          className="view-link"
          aria-label={`View ${cert.title} certificate in a new tab`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '4px',
            fontSize: '0.78rem',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(212,165,116,0.5)',
          }}
        >
          <span>View Certificate</span>
          <span className="arrow-shift" style={{ display: 'inline-block' }}>
            <ArrowUpRight size={14} />
          </span>
        </a>
      </div>
    </article>
  )
}

/* =====================================================================
   CERTIFICATES SECTION — Horizontal infinite auto-scrolling carousel
   ===================================================================== */
export default function CertificatesSection() {
  const headerRef = useRef(null)
  const trackRef = useRef(null)
  const x = useMotionValue(0)
  const autoAnimRef = useRef(null)
  const startAnimRef = useRef(null)
  const pauseTimerRef = useRef(null)
  const isInitialisedRef = useRef(false)
  const prevIndexRef = useRef(0)

  const [stepWidth, setStepWidth] = useState(0)
  const [oneSetWidth, setOneSetWidth] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardsVisible, setCardsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)

  const headerInView = useInView(headerRef, { once: true })
  const [prefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  /* ── Card entrance — triggered when header scrolls into view ── */
  useEffect(() => {
    if (!headerInView || cardsVisible) return
    const id = requestAnimationFrame(() => setCardsVisible(true))
    return () => cancelAnimationFrame(id)
  }, [headerInView, cardsVisible])

  /* ── Measure card width and handle window resize dynamically ── */
  useLayoutEffect(() => {
    const handleResize = () => {
      const track = trackRef.current
      if (!track || !track.children[0]) return
      const isMobile = window.innerWidth < 1024
      const cardW = isMobile
        ? Math.min(window.innerWidth * CARD_MOBILE_WIDTH_RATIO, CARD_DESKTOP_WIDTH_PX)
        : CARD_DESKTOP_WIDTH_PX
      const step = cardW + CARD_GAP_PX
      setStepWidth(step)
      setOneSetWidth(step * TOTAL)

      if (!isInitialisedRef.current) {
        x.set(-step * TOTAL)
        isInitialisedRef.current = true
      } else {
        const currentX = x.get()
        const setOffset = step * TOTAL
        // Keep within bounds: if position drifted, snap to nearest valid offset
        const remainder = ((currentX % setOffset) + setOffset) % setOffset
        x.set(-(setOffset + remainder % step))
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [x])

  /* ── Auto-scroll function ── */
  useEffect(() => {
    if (prefersReducedMotion) return

    startAnimRef.current = () => {
      if (!oneSetWidth) return
      const currentX = x.get()
      const targetX = currentX - oneSetWidth
      if (autoAnimRef.current) autoAnimRef.current.stop()
      autoAnimRef.current = animate(x, [currentX, targetX], {
        duration: 40,
        ease: 'linear',
        onComplete: () => {
          x.set(x.get() + oneSetWidth)
          if (startAnimRef.current) startAnimRef.current()
        },
      })
      if (isHovering && autoAnimRef.current) {
        autoAnimRef.current.pause()
      }
    }
  }, [oneSetWidth, x, isHovering, prefersReducedMotion])

  /* ── Start / stop auto-scroll based on isPlaying ── */
  useEffect(() => {
    if (prefersReducedMotion) return
    if (isPlaying && oneSetWidth > 0) {
      startAnimRef.current()
    } else if (autoAnimRef.current) {
      autoAnimRef.current.stop()
    }
    return () => {
      if (autoAnimRef.current) autoAnimRef.current.stop()
    }
  }, [isPlaying, oneSetWidth, prefersReducedMotion])

  /* ── Pause / resume on hover ── */
  useEffect(() => {
    if (!autoAnimRef.current) return
    if (isHovering) {
      autoAnimRef.current.pause()
    } else if (isPlaying) {
      autoAnimRef.current.play()
    }
  }, [isHovering, isPlaying])

  /* ── Track focused index from x position ── */
  useEffect(() => {
    if (!stepWidth) return
    const unsubscribe = x.on('change', (latest) => {
      const absScroll = Math.abs(latest)
      const cardAtLeft = Math.floor(absScroll / stepWidth)
      const index = cardAtLeft % TOTAL
      if (index >= 0 && index < TOTAL && index !== prevIndexRef.current) {
        prevIndexRef.current = index
        setCurrentIndex(index)
      }
    })
    return unsubscribe
  }, [stepWidth, x])

  /* ── Cleanup timers on unmount ── */
  useEffect(() => {
    return () => clearTimeout(pauseTimerRef.current)
  }, [])

  /* ── Navigation helpers ── */
  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const next = useCallback(() => {
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
        pauseTimerRef.current = setTimeout(() => setIsPlaying(true), AUTOPLAY_INTERVAL_MS)
      },
    })
  }, [stepWidth, x])

  const prev = useCallback(() => {
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
        pauseTimerRef.current = setTimeout(() => setIsPlaying(true), AUTOPLAY_INTERVAL_MS)
      },
    })
  }, [stepWidth, x])

  const scrollToIndex = useCallback(
    (targetIndex) => {
      if (stepWidth === 0) return
      if (autoAnimRef.current) autoAnimRef.current.stop()
      clearTimeout(pauseTimerRef.current)
      setIsPlaying(false)

      let delta = targetIndex - currentIndex
      if (delta > TOTAL / 2) delta -= TOTAL
      if (delta < -(TOTAL / 2)) delta += TOTAL

      const currentX = x.get()
      const targetX = currentX - delta * stepWidth

      animate(x, [currentX, targetX], {
        duration: 0.5 + Math.abs(delta) * 0.1,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          pauseTimerRef.current = setTimeout(() => setIsPlaying(true), AUTOPLAY_INTERVAL_MS)
        },
      })
    },
    [stepWidth, x, currentIndex]
  )

  return (
    <section
      id="certificates"
      className="relative w-full overflow-hidden px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-36 bg-[#0C0C0C] min-h-screen"
    >
      {/* ── Ambient orbs (3 layers, gold/bronze drifting) ── */}
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

      {/* ── Gold grid overlay (60×60, masked radial) ── */}
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
        {/* ── Header (eyebrow + heading + underline + subtitle) ── */}
        <div ref={headerRef}>
          <p
            className={`cert-eyebrow text-center text-[0.75rem] font-medium uppercase tracking-[0.3em] mb-1 ${headerInView ? 'in-view' : ''}`}
            style={{ color: 'rgba(212,165,116,0.50)' }}
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
            className="text-center text-[0.90rem] font-light tracking-[0.15em] mb-12 max-sm:mb-8"
            style={{ color: 'rgba(237,231,217,0.40)' }}
          >
            Industry-recognized credentials validating expertise
          </motion.p>
        </div>

        {/* ── Carousel body ── */}
        <div
          id="carouselRoot"
          aria-roledescription="carousel"
          aria-label="Certificates carousel"
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false)
            if (autoAnimRef.current && isPlaying) {
              autoAnimRef.current.play()
            }
          }}
        >
          <motion.div
            ref={trackRef}
            id="track"
            className="flex gap-6"
            style={{ x }}
            aria-live="polite"
            aria-atomic="false"
          >
            {ALL_CERTS.map((cert, i) => (
              <CertificateCard
                key={`${cert.title}-${i}`}
                cert={cert}
                index={i}
                isVisible={cardsVisible}
              />
            ))}
          </motion.div>
        </div>

        {/* ── Navigation row (prev / play-pause / dots / next) ── */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            type="button"
            className="cert-nav-btn"
            onClick={prev}
            aria-label="Previous certificate"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Play/Pause toggle */}
          <button
            type="button"
            onClick={togglePlayPause}
            className="cert-nav-btn"
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
            aria-label="Certificate slides"
          >
            {CERTS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === currentIndex ? 'cert-dot is-active' : 'cert-dot'}
                role="tab"
                aria-label={`Go to certificate ${i + 1}`}
                aria-selected={i === currentIndex ? 'true' : 'false'}
                onClick={() => scrollToIndex(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className="cert-nav-btn"
            onClick={next}
            aria-label="Next certificate"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* ── Hint text ── */}
        <p
          className="cert-hint-pulse text-center text-[0.7rem] sm:text-xs font-light tracking-[0.25em] uppercase mt-6"
          style={{ color: 'rgba(237,231,217,0.4)' }}
        >
          Drag to scroll · Use arrows to navigate
        </p>
      </div>
    </section>
  )
}
