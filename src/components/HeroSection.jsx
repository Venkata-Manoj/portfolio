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
          className="inline-block"
          style={{ marginRight: i < words.length - 1 ? '0.25em' : 0 }}
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
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-background">
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

      {/* Ambient glow — reduced blur for GPU efficiency */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-violet-600/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-600/10 blur-[80px] pointer-events-none" />

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
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white/80 drop-shadow-lg"
              style={{ fontFamily: "'Kanit', sans-serif" }}
            >
              <WordReveal text="B V MANOJ" delay={0.5} />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-xs sm:text-sm md:text-base font-light text-white/60 tracking-wide drop-shadow-md"
            >
              <WordReveal text="AI Engineer · Data Scientist · Full-Stack Developer" delay={1.5} />
            </motion.p>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="flex items-center justify-center gap-4"
          >
            <a
              href="mailto:bsumanoj@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-full text-sm hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:scale-105 transition-all duration-300"
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
        className="absolute top-8 right-8 z-50 p-3 bg-black/30 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-black/50 transition-all duration-300 cursor-pointer"
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
          className="absolute top-20 right-8 text-[9px] uppercase tracking-[0.3em] text-white/30 font-light animate-pulse"
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
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 p-3 text-white/60 hover:text-white transition-all duration-300 animate-bounce cursor-pointer"
        aria-label="Scroll to about section"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </div>
  )
}
