import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, X, Play, Volume2 } from 'lucide-react'

const TRACKS = [
  {
    id: 'hero', sectionId: 'hero', label: 'Welcome', duration: 17,
    subtitles: [
      { start: 0, end: 3.5, text: "Hello there! I am PAM, Manoj's Personal Assistant." },
      { start: 3.5, end: 7, text: "Since he is currently busy coding, I will be your guide today." },
      { start: 7, end: 10, text: "Let's start with a quick overview of Manoj's profile." },
      { start: 10, end: 13, text: "He is a B.Tech CSE student specializing in AI and Data Science." },
      { start: 13, end: 17, text: "Scrolling down to show you his background and core skills." },
    ],
  },
  {
    id: 'about', sectionId: 'about', label: 'About', duration: 11,
    subtitles: [
      { start: 0, end: 4, text: "Here you can see Manoj's educational background at SIMATS Engineering, class of 2028." },
      { start: 4, end: 7.5, text: "He has built a strong foundation in Python, JavaScript, machine learning, and generative AI." },
      { start: 7.5, end: 11, text: "Next up, let's explore his areas of expertise." },
    ],
  },
  {
    id: 'expertise', sectionId: 'expertise', label: 'Expertise', duration: 10,
    subtitles: [
      { start: 0, end: 3.5, text: "Manoj specializes in five key areas of AI and software engineering." },
      { start: 3.5, end: 7, text: "Generative AI, Machine Learning, Full Stack Development, RAG pipelines, and Reinforcement Learning." },
      { start: 7, end: 10, text: "Now let's look at some of his featured projects." },
    ],
  },
  {
    id: 'projects', sectionId: 'projects', label: 'Projects', duration: 14,
    subtitles: [
      { start: 0, end: 4, text: "This is Manoj's project bento grid." },
      { start: 4, end: 8, text: "VideoReverse, AI-News-Bot, WhatIF, Capstone-Forage, and more." },
      { start: 8, end: 12, text: "Hover over any card for details or click to visit live deployments." },
      { start: 12, end: 14, text: "Finally, let's head to the Contact section." },
    ],
  },
  {
    id: 'contact', sectionId: 'contact', label: 'Contact', duration: 12,
    subtitles: [
      { start: 0, end: 3.5, text: "We have reached the end of the tour!" },
      { start: 3.5, end: 7.5, text: "Connect with Manoj on LinkedIn, GitHub, or send him an email." },
      { start: 7.5, end: 12, text: "Thank you for visiting! Feel free to explore at your own pace." },
    ],
  },
]

/*
 * TrackTimer manages the per-track clock.
 * It mounts fresh per track (via key={currentTrackIndex} in the parent),
 * so its currentTime starts at 0 without any synchronous setState reset.
 */
function TrackTimer({ duration, playing, onTimeUpdate, onComplete }) {
  useEffect(() => {
    if (!playing || duration <= 0) return undefined
    const start = performance.now()
    let raf
    let lastTenth = 0
    const tick = (now) => {
      const elapsed = (now - start) / 1000
      if (elapsed >= duration) {
        onTimeUpdate(duration)
        onComplete?.()
        return
      }
      const tenth = Math.floor(elapsed * 10)
      if (tenth !== lastTenth) {
        lastTenth = tenth
        onTimeUpdate(+(tenth / 10).toFixed(1))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => raf && cancelAnimationFrame(raf)
  }, [playing, duration, onTimeUpdate, onComplete])

  return null
}

export default function PamWidget({ tourTrigger }) {
  const [pamState, setPamState] = useState('idle')
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showOverride, setShowOverride] = useState(false)
  const lastAutoScrollRef = useRef(0)

  const currentTrack = TRACKS[currentTrackIndex]

  const activeSubtitle = currentTrack?.subtitles.find(
    s => currentTime >= s.start && currentTime < s.end
  )

  const startTour = useCallback(() => {
    setPamState('playing')
    setCurrentTrackIndex(0)
    setCurrentTime(0)
    setShowOverride(false)
  }, [])

  const closePam = useCallback(() => {
    setPamState('idle')
    setCurrentTrackIndex(0)
    setCurrentTime(0)
    setShowOverride(false)
  }, [])

  const autoScrollToSection = useCallback((sectionId) => {
    lastAutoScrollRef.current = Date.now()
    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleTrackEnd = useCallback(() => {
    if (currentTrackIndex < TRACKS.length - 1) {
      const nextIndex = currentTrackIndex + 1
      setCurrentTrackIndex(nextIndex)
      setCurrentTime(0)
      autoScrollToSection(TRACKS[nextIndex].sectionId)
    } else {
      setPamState('complete')
    }
  }, [currentTrackIndex, autoScrollToSection])

  useEffect(() => {
    if (tourTrigger > 0 && pamState === 'idle') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      startTour()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourTrigger])

  useEffect(() => {
    if (pamState !== 'playing') return

    const checkManualScroll = () => {
      if (Date.now() - lastAutoScrollRef.current > 2500) {
        setShowOverride(true)
        setPamState('paused')
      }
    }

    window.addEventListener('scroll', checkManualScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkManualScroll)
  }, [pamState])

  const resumeTour = () => {
    setShowOverride(false)
    setPamState('playing')
    autoScrollToSection(currentTrack.sectionId)
  }

  const trackProgress = currentTrack
    ? ((currentTime / currentTrack.duration) * 100).toFixed(0)
    : 0

  return (
    <>
      <AnimatePresence mode="wait">
        {pamState === 'idle' ? (
          <motion.button
            key="pam-bubble"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={startTour}
            style={{ animation: 'pam-pulse 2.5s ease-in-out infinite' }}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            <Bot size={24} />
          </motion.button>
        ) : (
          <motion.div
            key="pam-panel"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-72 sm:w-80 rounded-2xl border border-white/10 bg-[#141418]/95 backdrop-blur-2xl p-5 shadow-2xl"
          >
            {pamState === 'complete' ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Volume2 size={14} className="text-purple-400" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                      Tour Complete
                    </span>
                  </div>
                  <button type="button" onClick={closePam} className="text-white/30 hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </div>
                <p className="text-sm text-white/80 text-center leading-relaxed my-4">
                  Tour completed! You can explore the rest of the site on your own.
                </p>
                <button
                  type="button"
                  onClick={closePam}
                  className="w-full rounded-full border border-white/20 py-2.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Volume2 size={14} className="text-purple-400" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                      {currentTrack?.label} · {currentTrackIndex + 1}/{TRACKS.length}
                    </span>
                  </div>
                  <button type="button" onClick={closePam} className="text-white/30 hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-[3px] h-8 mb-4">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-purple-400/80 origin-bottom"
                      style={{
                        height: '16px',
                        animation: pamState === 'playing' ? 'pam-wave 0.7s ease-in-out infinite' : 'none',
                        animationDelay: `${i * 0.12}s`,
                        opacity: pamState === 'playing' ? 1 : 0.3,
                      }}
                    />
                  ))}
                </div>

                {pamState === 'playing' && currentTrack && (
                  <TrackTimer
                    key={currentTrackIndex}
                    duration={currentTrack.duration}
                    playing
                    onTimeUpdate={setCurrentTime}
                    onComplete={handleTrackEnd}
                  />
                )}

                <div className="min-h-[56px] flex items-center justify-center">
                  <p className="text-sm text-white/85 leading-relaxed text-center">
                    {activeSubtitle?.text || '...'}
                  </p>
                </div>

                <div className="mt-4 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all duration-100"
                    style={{ width: `${trackProgress}%` }}
                  />
                </div>

                {pamState === 'paused' && showOverride && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <p className="text-[10px] text-white/40 text-center uppercase tracking-[0.2em] mb-3">
                      Tour paused — you scrolled away
                    </p>
                    <button
                      type="button"
                      onClick={resumeTour}
                      className="flex items-center justify-center gap-2 w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 py-2.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Play size={12} fill="white" />
                      Resume Tour
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
