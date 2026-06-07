import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
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
    date: '2024',
    image: '/certificates/AI_Fundamentals_DC.png',
    accent: '#D4A574',
  },
  {
    title: 'API Fundamentals',
    org: 'DataCamp',
    date: '2024',
    image: '/certificates/API_DC.png',
    accent: '#D4A574',
  },
  {
    title: 'AI Engineer — Data Science',
    org: 'DataCamp',
    date: '2024',
    image: '/certificates/AiE_DS_DC.png',
    accent: '#C4956A',
  },
  {
    title: 'AI Engineer — Development',
    org: 'DataCamp',
    date: '2024',
    image: '/certificates/AiE_dev_DC.png',
    accent: '#A67C52',
  },
  {
    title: 'Intro to Programming',
    org: 'Kaggle',
    date: '2024',
    image: '/certificates/B V Manoj - Intro to Programming.png',
    accent: '#B8895E',
  },
  {
    title: 'Python Programming',
    org: 'Kaggle',
    date: '2024',
    image: '/certificates/B V Manoj - Python.png',
    accent: '#B8895E',
  },
  {
    title: 'Season 13 Cohort',
    org: 'Outskill',
    date: '2024',
    image: '/certificates/B V Manoj_certificate_s13.jpeg',
    accent: '#C4956A',
  },
  {
    title: 'Ultimate AI Power Weekend',
    org: 'Outskill',
    date: '2024',
    image: '/certificates/Certificate - B V Manoj - The Ultimate AI Power Weekend_pages-to-jpg-0001.jpg',
    accent: '#D4A574',
  },
  {
    title: 'Embeddings Fundamentals',
    org: 'DataCamp',
    date: '2024',
    image: '/certificates/Embeddings_DC.png',
    accent: '#A67C52',
  },
  {
    title: 'Large Language Models',
    org: 'DataCamp',
    date: '2024',
    image: '/certificates/LLM_DC.png',
    accent: '#D4A574',
  },
  {
    title: 'AI Certification',
    org: 'NIELIT',
    date: '2024',
    image: '/certificates/NIELIT.png',
    accent: '#C4956A',
  },
  {
    title: 'RAG Bootcamp',
    org: 'KodeKloud',
    date: '2024',
    image: '/certificates/RAG-BootCamp-KodeKloud.png',
    accent: '#B8895E',
  },
  {
    title: 'Jio Course Certificate',
    org: 'Jio',
    date: '2024',
    image: '/certificates/course_certificate_jio.png',
    accent: '#A67C52',
  },
]

/* =====================================================================
   CONSTANTS — auto-play, debounce, sizing
   ===================================================================== */
const AUTOPLAY_INTERVAL_MS = 5000
const SCROLL_DEBOUNCE_MS = 80
const CARD_GAP_FALLBACK_PX = 24
const CARD_DESKTOP_WIDTH_PX = 380
const CARD_MOBILE_WIDTH_RATIO = 0.85
const MIN_SIDE_PADDING_PX = 24
const TOTAL = CERTS.length

/* =====================================================================
   IMAGE OPTIMIZATION — Vercel Image Optimization
   On Vercel deployments, routes /certificates/foo.png through
   /_vercel/image?url=...&w=...&q=...&f=webp for auto-WebP + resize.
   Off-Vercel (local dev, GitHub Pages, etc.) returns the original path.
   ===================================================================== */
const IS_VERCEL = typeof window !== 'undefined'
  && /vercel\.app$|vercel\.com$/.test(window.location.hostname)

function optimizeImage(path, width, quality = 75) {
  if (!IS_VERCEL) return path
  return `/_vercel/image?url=${encodeURIComponent(path)}&w=${width}&q=${quality}`
}

/* =====================================================================
   CERTIFICATE CARD
   ===================================================================== */
function CertificateCard({ cert, index, isVisible, registerFirstRef }) {
  const staggerDelay = (index % TOTAL) * 100 // ms

  return (
    <article
      ref={index === 0 ? registerFirstRef : null}
      className={`cert-card group ${isVisible ? 'is-visible' : 'is-hidden'}`}
      data-index={index}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${TOTAL}: ${cert.title}`}
      style={{
        scrollSnapAlign: 'center',
        flex: '0 0 auto',
        width: '85vw',
        maxWidth: '380px',
        minHeight: '520px',
        background: 'rgba(30,28,26,0.60)',
        backdropFilter: 'blur(20px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.1)',
        border: '1px solid rgba(212,165,116,0.06)',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        willChange: 'transform',
        transitionDelay: `${staggerDelay}ms`,
      }}
    >
      {/* Top gold streak */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '2px',
          background:
            'linear-gradient(90deg, transparent, #D4A574 30%, #A67C52 70%, transparent)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />

      {/* Watermark number (top-right) */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '70px',
          right: '16px',
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 900,
          fontSize: '6rem',
          lineHeight: 1,
          zIndex: 2,
          pointerEvents: 'none',
          background: 'linear-gradient(135deg, #D4A574, #A67C52)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          opacity: 0.06,
          letterSpacing: '-0.04em',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Shimmer overlay (hover only) */}
      <div
        className="cert-shimmer"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0,
          zIndex: 5,
          borderRadius: 'inherit',
          background:
            'linear-gradient(105deg, transparent 0%, transparent 30%, rgba(212,165,116,0.02) 45%, rgba(212,165,116,0.04) 50%, rgba(212,165,116,0.02) 55%, transparent 70%, transparent 100%)',
          backgroundSize: '200% 100%',
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Image area */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          background: 'rgba(12,12,12,0.5)',
          overflow: 'hidden',
        }}
      >
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
   CERTIFICATES SECTION
   ===================================================================== */
export default function CertificatesSection() {
  const headerRef = useRef(null)
  const trackRef = useRef(null)
  const firstCardRef = useRef(null)
  const autoplayTimerRef = useRef(null)
  const currentIndexRef = useRef(0)

  const headerInView = useInView(headerRef, { once: true })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardsVisible, setCardsVisible] = useState(false)
  // Lazy initializer — runs once on first render (client-only SPA)
  const [prefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  /* ── Card entrance — triggered when header scrolls into view ── */
  useEffect(() => {
    if (!headerInView || cardsVisible) return undefined
    const id = requestAnimationFrame(() => {
      setCardsVisible(true)
    })
    return () => cancelAnimationFrame(id)
  }, [headerInView, cardsVisible])

  /* ── Measure single card + gap ── */
  const cardWidth = useCallback(() => {
    const track = trackRef.current
    const first = firstCardRef.current
    if (!track || !first) return 0
    const styles = window.getComputedStyle(track)
    const gap = parseFloat(
      styles.columnGap || styles.gap || `${CARD_GAP_FALLBACK_PX}`
    )
    return first.getBoundingClientRect().width + gap
  }, [])

  /* ── Scroll to specific index (wraps on out-of-range) ── */
  const scrollToIndex = useCallback(
    (idx) => {
      // JS-correct modulo for negative numbers
      const wrapped = ((idx % TOTAL) + TOTAL) % TOTAL
      setCurrentIndex(wrapped)
      currentIndexRef.current = wrapped
      const track = trackRef.current
      if (!track) return
      const step = cardWidth()
      track.scrollTo({ left: step * wrapped, behavior: 'smooth' })
    },
    [cardWidth]
  )

  const next = useCallback(() => {
    scrollToIndex(currentIndexRef.current + 1)
  }, [scrollToIndex])

  const prev = useCallback(() => {
    scrollToIndex(currentIndexRef.current - 1)
  }, [scrollToIndex])

  /* ── Autoplay control (no-op if reduced motion) ── */
  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current)
      autoplayTimerRef.current = null
    }
  }, [])

  const startAutoplay = useCallback(() => {
    if (prefersReducedMotion) return
    if (autoplayTimerRef.current) return
    autoplayTimerRef.current = setInterval(() => {
      const idx = currentIndexRef.current
      scrollToIndex(idx + 1)
    }, AUTOPLAY_INTERVAL_MS)
  }, [prefersReducedMotion, scrollToIndex])

  /* ── Wire up mouse / focus / visibility listeners + start autoplay ── */
  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const onMouseEnter = () => stopAutoplay()
    const onMouseLeave = () => startAutoplay()
    const onFocusIn = () => stopAutoplay()
    const onFocusOut = () => startAutoplay()
    const onVisibilityChange = () => {
      if (document.hidden) {
        stopAutoplay()
      } else {
        startAutoplay()
      }
    }

    track.addEventListener('mouseenter', onMouseEnter)
    track.addEventListener('mouseleave', onMouseLeave)
    track.addEventListener('focusin', onFocusIn)
    track.addEventListener('focusout', onFocusOut)
    document.addEventListener('visibilitychange', onVisibilityChange)

    // Initial autoplay start
    startAutoplay()

    return () => {
      track.removeEventListener('mouseenter', onMouseEnter)
      track.removeEventListener('mouseleave', onMouseLeave)
      track.removeEventListener('focusin', onFocusIn)
      track.removeEventListener('focusout', onFocusOut)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      stopAutoplay()
    }
  }, [startAutoplay, stopAutoplay])

  /* ── Active dot sync — debounced scroll listener ── */
  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    let debounceTimer = null

    const onScroll = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        const step = cardWidth()
        if (step <= 0) return
        const idx = Math.round(track.scrollLeft / step)
        if (
          idx !== currentIndexRef.current &&
          idx >= 0 &&
          idx < TOTAL
        ) {
          setCurrentIndex(idx)
          currentIndexRef.current = idx
        }
      }, SCROLL_DEBOUNCE_MS)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }, [cardWidth])

  /* ── Keyboard nav on track ── */
  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
    }

    track.addEventListener('keydown', onKeyDown)
    return () => track.removeEventListener('keydown', onKeyDown)
  }, [next, prev])

  /* ── Side padding + resize handler ── */
  useEffect(() => {
    const recomputeSidePadding = () => {
      const isMobile = window.innerWidth < 1024
      const cardActual = isMobile
        ? Math.min(
            window.innerWidth * CARD_MOBILE_WIDTH_RATIO,
            CARD_DESKTOP_WIDTH_PX
          )
        : CARD_DESKTOP_WIDTH_PX
      const side = Math.max(
        MIN_SIDE_PADDING_PX,
        (window.innerWidth - cardActual) / 2
      )
      if (trackRef.current) {
        trackRef.current.style.paddingInline = `${side}px`
      }
    }

    const onResize = () => {
      recomputeSidePadding()
      // Keep current card in view
      const track = trackRef.current
      if (track) {
        const step = cardWidth()
        track.scrollTo({
          left: step * currentIndexRef.current,
          behavior: 'auto',
        })
      }
    }

    recomputeSidePadding()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [cardWidth])

  /* ── Initial scroll to index 0 ── */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const track = trackRef.current
      if (track) {
        track.scrollTo({ left: 0, behavior: 'auto' })
      }
    })
    return () => cancelAnimationFrame(id)
  }, [cardWidth])

  /* ── Callback ref for the first card (used to measure step) ── */
  const registerFirstRef = useCallback((node) => {
    firstCardRef.current = node
  }, [])

  return (
    <section
      id="certificates"
      className="relative w-full overflow-hidden px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-36 bg-[#0C0C0C] min-h-screen"
    >
      {/* ── Ambient orbs (3 layers, gold/bronze drifting) ── */}
      <div
        className="pointer-events-none absolute top-[-120px] right-[-80px] w-[500px] h-[500px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(212,165,116,0.07), transparent)',
          filter: 'blur(120px)',
          animation: 'orbFloatSlow 8s ease-in-out infinite',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[-100px] left-[-100px] w-[450px] h-[450px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(196,149,106,0.06), transparent)',
          filter: 'blur(120px)',
          animation: 'orbFloatMedium 6s ease-in-out infinite',
        }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(196,149,106,0.06), transparent)',
          filter: 'blur(120px)',
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
                fontSize: 'clamp(2.25rem, 6vw, 4.5rem)',
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
        >
          <div
            ref={trackRef}
            id="track"
            tabIndex={0}
            className="cert-card-track flex gap-6 overflow-x-auto pb-6"
            style={{
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              paddingInline: `${MIN_SIDE_PADDING_PX}px`,
            }}
          >
            {CERTS.map((cert, index) => (
              <CertificateCard
                key={cert.title}
                cert={cert}
                index={index}
                isVisible={cardsVisible}
                registerFirstRef={registerFirstRef}
              />
            ))}
          </div>
        </div>

        {/* ── Navigation row (prev / dots / next) ── */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            type="button"
            className="cert-nav-btn"
            onClick={prev}
            aria-label="Previous certificate"
          >
            <ChevronLeft size={18} />
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
