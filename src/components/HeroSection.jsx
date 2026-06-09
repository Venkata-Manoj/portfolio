import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Volume2, VolumeX, ChevronDown } from 'lucide-react'

const WordReveal = ({ text, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const isVisible = useInView(ref, { once: true, amount: 0.1 })

  const words = text.split(' ')

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: 50, opacity: 0, filter: 'blur(10px)' }}
          animate={isVisible ? { y: 0, opacity: 1, filter: 'blur(0px)' } : {}}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

export default function HeroSection() {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)
  const snapFired = useRef(false)

  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.95])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => { })
    }
  }, [])

  // Auto-mute on scroll away
  useEffect(() => {
    const handleScroll = () => {
      const hero = containerRef.current
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight
      if (!isVisible && !videoRef.current.muted) {
        setIsMuted(true)
        if (videoRef.current) videoRef.current.muted = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // First-scroll snap to About
  useEffect(() => {
    const goToAbout = () => {
      if (snapFired.current) return
      snapFired.current = true
      const about = document.getElementById('about')
      if (about) about.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const onWheel = (e) => {
      if (snapFired.current) return
      if (e.deltaY <= 0) return
      if (window.scrollY > 60) return
      e.preventDefault()
      goToAbout()
    }

    const onKey = (e) => {
      if (snapFired.current) return
      if (window.scrollY > 60) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        goToAbout()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const scrollToAbout = () => {
    snapFired.current = true
    const about = document.getElementById('about')
    if (about) about.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={containerRef} id="hero" className="relative -mt-16 h-[calc(100vh+4rem)] w-full overflow-hidden bg-background">
      {/* Video Background — preload=metadata avoids downloading entire video on page load */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: 'brightness(0.6)' }}
      >
        <source src="/video/intro.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Noise texture removed — SVG @ 3% opacity had negligible visual impact but costly GPU compositing */}

      {/* Ambient glow — gold/bronze animated orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-[100px] pointer-events-none animate-hero-orb-float" style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.15), transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[80px] pointer-events-none animate-hero-orb-float-delayed" style={{ background: 'radial-gradient(circle, rgba(166,124,82,0.10), transparent 70%)' }} />
      {/* Third subtle central orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-[120px] pointer-events-none animate-hero-orb-float-delayed" style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.06), transparent 70%)', animationDelay: '-10s' }} />

      {/* Main content */}
      <motion.div
        style={{ opacity, scale }}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pt-56 sm:pt-60"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Name */}
          <div className="space-y-1">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase"
              style={{ fontFamily: "'Kanit', sans-serif" }}
            >
              <WordReveal
                text="B V MANOJ"
                delay={0.5}
                className="bg-gradient-to-r from-[#EDE7D9] via-[#D4A574] to-[#E8C88A] bg-clip-text drop-shadow-lg"
              />
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-xs sm:text-sm md:text-base font-light text-[#EDE7D9]/70 tracking-wide drop-shadow-md"
            >
              <WordReveal text="AI Engineer · Data Scientist · Full-Stack Developer" delay={1.5} />
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="flex items-center justify-center gap-4"
          >
            <a
              href="mailto:bvmanoj61@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4A574] to-[#A67C52] text-white font-semibold rounded-full text-sm hover:shadow-[0_0_40px_rgba(212,165,116,0.25)] hover:scale-105 active:scale-[0.97] transition-all duration-300 cursor-pointer"
            >
              Get in touch
              <span className="text-base">→</span>
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Mute toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.5 }}
        onClick={toggleMute}
        className="absolute top-8 right-8 z-50 p-3 bg-black/30 backdrop-blur-md border border-[#D4A574]/20 rounded-full text-white hover:bg-[#D4A574]/10 transition-all duration-300 cursor-pointer"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </motion.button>

      {/* Mute hint */}
      {isMuted && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
          className="absolute top-21 right-3 text-[9px] uppercase tracking-[0.3em] text-[#D4A574]/40 font-light animate-pulse"
        >
          Tap for sound
        </motion.p>
      )}

      {/* Scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 3 }}
        onClick={scrollToAbout}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 p-3 text-[#EDE7D9]/60 hover:text-[#D4A574] transition-all duration-300 animate-bounce cursor-pointer active:scale-90"
        aria-label="Scroll to about section"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </div>
  )
}
