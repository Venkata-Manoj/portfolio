import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, Bot, Code2, Cloud, LineChart, Shield } from 'lucide-react'

const SERVICES = [
  {
    number: '01',
    icon: Bot,
    title: 'AI & ML Solutions',
    description: 'Custom LLM integrations, RAG pipelines, and intelligent automation systems built for production-scale performance.',
  },
  {
    number: '02',
    icon: Code2,
    title: 'Full-Stack Development',
    description: 'End-to-end web applications with React, Next.js, Node.js, and modern frameworks deployed on Vercel.',
  },
  {
    number: '03',
    icon: Cloud,
    title: 'Cloud & DevOps',
    description: 'CI/CD pipelines, Docker containerization, Firebase integration, and serverless architecture design.',
  },
  {
    number: '04',
    icon: LineChart,
    title: 'Data Engineering',
    description: 'Data pipelines, ETL processes, predictive modeling with XGBoost, and interactive data visualizations.',
  },
  {
    number: '05',
    icon: Shield,
    title: 'AI Consulting',
    description: 'Technical strategy for AI adoption, proof-of-concept development, and architecture review for AI-powered products.',
  },
]

const GAP = 24

function ServiceCard({ service, index, isActive, onDotClick }) {
  const cardRef = useRef(null)
  const inView = useInView(cardRef, { once: true, margin: '-40px' })

  const Icon = service.icon

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={inView ? {
        opacity: isActive ? 1 : 0.45,
        scale: isActive ? 1 : 0.88,
        y: 0,
      } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative shrink-0 snap-center cursor-pointer rounded-3xl overflow-hidden group w-[85vw] lg:w-[380px]"
      style={{
        minHeight: 420,
        background: 'rgba(30,28,26,0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(212,165,116,0.06)',
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
      }}
      whileHover={{ y: -6 }}
      onHoverStart={() => {}}
      onClick={() => onDotClick(index)}
    >
      {/* Gold top streak */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-500"
        style={{
          width: isActive ? '80%' : '60%',
          background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.30), transparent)',
          opacity: isActive ? 1 : 0,
        }}
      />

      {/* Shimmer sweep on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.04), transparent)',
          transform: 'skewX(-20deg)',
        }}
      />

      {/* Watermark number */}
      <span
        className="absolute top-[-0.05em] right-[0.05em] text-[8rem] font-black leading-none pointer-events-none select-none"
        style={{
          background: 'linear-gradient(135deg, rgba(212,165,116,0.06), rgba(166,124,82,0.06))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.04em',
        }}
      >
        {service.number}
      </span>

      {/* Content */}
      <div className="relative z-10 p-9 pb-8 flex flex-col h-full max-sm:p-6 max-sm:pb-6">
        {/* Icon circle */}
        <div
          className="w-[68px] h-[68px] rounded-full flex items-center justify-center mb-6 transition-all duration-400 group-hover:scale-110 max-sm:w-[56px] max-sm:h-[56px] max-sm:mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(212,165,116,0.20), rgba(166,124,82,0.12))',
            border: '1px solid rgba(212,165,116,0.10)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 0 20px rgba(212,165,116,0.06)',
          }}
        >
          <Icon className="w-7 h-7 text-[#EDE7D9] max-sm:w-6 max-sm:h-6" />
        </div>

        {/* Title */}
        <h3 className="text-[1.35rem] font-bold tracking-[0.02em] text-[#EDE7D9] mb-3 max-sm:text-[1.15rem]">
          {service.title}
        </h3>

        {/* Description */}
        <p
          className="text-[0.92rem] font-light leading-[1.7] flex-1 max-sm:text-[0.85rem]"
          style={{ color: 'rgba(237,231,217,0.45)' }}
        >
          {service.description}
        </p>
      </div>

      {/* Glow overlay for active state */}
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{
            boxShadow: 'inset 0 0 40px rgba(212,165,116,0.06), 0 0 40px rgba(212,165,116,0.12), 0 0 80px rgba(212,165,116,0.05)',
          }}
        />
      )}
    </motion.div>
  )
}

export default function ServicesSection() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  // Get which card is most centered in the viewport
  const getCenterIndex = useCallback(() => {
    const track = trackRef.current
    if (!track) return 0
    const trackRect = track.getBoundingClientRect()
    const trackCenter = trackRect.left + trackRect.width / 2
    const cards = track.querySelectorAll('[data-service-card]')
    let closestIdx = 0
    let closestDist = Infinity
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const dist = Math.abs(cardCenter - trackCenter)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    })
    return closestIdx
  }, [])

  // Scroll to a specific card
  const scrollToCard = useCallback((index) => {
    const track = trackRef.current
    if (!track) return
    const cards = track.querySelectorAll('[data-service-card]')
    const card = cards[index]
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      setActiveIndex(index)
    }
  }, [])

  // Track scroll to update active index
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let rafId = null
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setActiveIndex(getCenterIndex())
      })
    }
    track.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [getCenterIndex])

  // Auto-play
  useEffect(() => {
    if (isHovering) return
    const timer = setInterval(() => {
      const next = (activeIndex + 1) % SERVICES.length
      scrollToCard(next)
    }, 4000)
    return () => clearInterval(timer)
  }, [activeIndex, isHovering, scrollToCard])

  // Keyboard navigation (left/right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const prev = Math.max(0, getCenterIndex() - 1)
        scrollToCard(prev)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        const next = Math.min(SERVICES.length - 1, getCenterIndex() + 1)
        scrollToCard(next)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [getCenterIndex, scrollToCard])

  // Re-check on resize
  useEffect(() => {
    let rafId = null
    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setActiveIndex(getCenterIndex())
      })
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [getCenterIndex])

  const goPrev = () => {
    const prev = Math.max(0, getCenterIndex() - 1)
    scrollToCard(prev)
  }

  const goNext = () => {
    const next = Math.min(SERVICES.length - 1, getCenterIndex() + 1)
    scrollToCard(next)
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full overflow-hidden px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-36 bg-[#0C0C0C]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
      onTouchEnd={() => setTimeout(() => setIsHovering(false), 500)}
    >
      {/* Ambient gold orbs */}
      <div
        className="pointer-events-none absolute top-[-120px] left-[-160px] w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,165,116,0.07), transparent)',
          filter: 'blur(120px)',
          animation: 'orbFloatSlow 8s ease-in-out infinite',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[-100px] right-[-140px] w-[450px] h-[450px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(196,149,106,0.06), transparent)',
          filter: 'blur(120px)',
          animation: 'orbFloatMedium 6s ease-in-out infinite',
        }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(196,149,106,0.06), transparent)',
          filter: 'blur(120px)',
          animation: 'orbFloatFast 4s ease-in-out infinite',
        }}
      />

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
        {/* Eyebrow label */}
        <div ref={headerRef}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center text-[0.75rem] font-medium uppercase tracking-[0.3em] mb-1"
            style={{ color: 'rgba(212,165,116,0.50)' }}
          >
            Explore
          </motion.p>

          {/* Heading with flanking lines */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center gap-6 mb-1"
          >
            <span
              className="flex-0 h-[2px] rounded-full"
              style={{
                width: 140,
                background: 'linear-gradient(90deg, transparent, #D4A574, #A67C52)',
              }}
            />
            <h2
              className="font-['Kanit'] font-black uppercase leading-none tracking-[0.12em] whitespace-nowrap text-[#EDE7D9]"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4A574, #A67C52)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                S
              </span>
              ERVICES
            </h2>
            <span
              className="flex-0 h-[2px] rounded-full"
              style={{
                width: 140,
                background: 'linear-gradient(90deg, #A67C52, #D4A574, transparent)',
              }}
            />
          </motion.div>

          {/* Animated gold underline */}
          <motion.div
            initial={{ width: 0 }}
            animate={headerInView ? { width: 80 } : {}}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-[3px] mx-auto rounded-full mb-5"
            style={{
              background: 'linear-gradient(90deg, #D4A574, #A67C52, #D4A574)',
              backgroundSize: '200% 100%',
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-[0.90rem] font-light tracking-[0.15em] mb-12 max-sm:mb-8"
            style={{ color: 'rgba(237,231,217,0.40)' }}
          >
            What I bring to the table
          </motion.p>
        </div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-4 pb-8 pt-4"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`
            #services .flex::-webkit-scrollbar { display: none; }
          `}</style>
          {SERVICES.map((service, i) => (
            <div key={service.number} data-service-card>
              <ServiceCard
                service={service}
                index={i}
                isActive={activeIndex === i}
                onDotClick={scrollToCard}
              />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 mt-4">
          {/* Left arrow */}
          <button
            onClick={goPrev}
            aria-label="Previous service"
            className="w-11 h-11 max-sm:w-9 max-sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
            style={{
              border: '1px solid rgba(212,165,116,0.12)',
              background: 'rgba(30,28,26,0.5)',
              backdropFilter: 'blur(8px)',
              color: 'rgba(237,231,217,0.65)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212,165,116,0.15)'
              e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'
              e.currentTarget.style.color = '#EDE7D9'
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.boxShadow = '0 0 25px rgba(212,165,116,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(30,28,26,0.5)'
              e.currentTarget.style.borderColor = 'rgba(212,165,116,0.12)'
              e.currentTarget.style.color = 'rgba(237,231,217,0.65)'
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.92)'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
          >
            <ChevronLeft size={18} className="max-sm:w-4 max-sm:h-4" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Service indicators">
            {SERVICES.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Service ${i + 1}`}
                onClick={() => scrollToCard(i)}
                className="rounded-full border-none p-0 cursor-pointer transition-all duration-500"
                style={{
                  width: i === activeIndex ? 32 : 8,
                  height: 8,
                  background: i === activeIndex
                    ? 'linear-gradient(90deg, #D4A574, #A67C52)'
                    : 'rgba(237,231,217,0.18)',
                  boxShadow: i === activeIndex ? '0 0 12px rgba(212,165,116,0.30)' : 'none',
                }}
              />
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={goNext}
            aria-label="Next service"
            className="w-11 h-11 max-sm:w-9 max-sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
            style={{
              border: '1px solid rgba(212,165,116,0.12)',
              background: 'rgba(30,28,26,0.5)',
              backdropFilter: 'blur(8px)',
              color: 'rgba(237,231,217,0.65)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212,165,116,0.15)'
              e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'
              e.currentTarget.style.color = '#EDE7D9'
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.boxShadow = '0 0 25px rgba(212,165,116,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(30,28,26,0.5)'
              e.currentTarget.style.borderColor = 'rgba(212,165,116,0.12)'
              e.currentTarget.style.color = 'rgba(237,231,217,0.65)'
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.92)'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
          >
            <ChevronRight size={18} className="max-sm:w-4 max-sm:h-4" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes orbFloatSlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
        @keyframes orbFloatMedium {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-25px, 15px); }
        }
        @keyframes orbFloatFast {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, 25px); }
        }
      `}</style>
    </section>
  )
}
