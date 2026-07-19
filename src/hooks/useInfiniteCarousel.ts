import { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { useMotionValue, animate } from 'framer-motion'
import type { AnimationPlaybackControls, MotionValue } from 'framer-motion'

export interface UseInfiniteCarouselOptions {
  total: number
  gap?: number
  autoplayMs?: number
  reducedMotion?: boolean
}

export interface UseInfiniteCarouselReturn {
  trackRef: React.RefObject<HTMLDivElement | null>
  x: MotionValue<number>
  isPlaying: boolean
  currentIndex: number
  stepWidth: number
  oneSetWidth: number
  goNext: () => void
  goPrev: () => void
  goToIndex: (i: number) => void
  togglePlayPause: () => void
  setIsHovering: (v: boolean) => void
}

export function useInfiniteCarousel({
  total,
  gap = 24,
  autoplayMs = 5000,
  reducedMotion = false,
}: UseInfiniteCarouselOptions): UseInfiniteCarouselReturn {
  const trackRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const autoAnimRef = useRef<AnimationPlaybackControls | null>(null)
  const startAnimRef = useRef<(() => void) | null>(null)
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialisedRef = useRef<boolean>(false)
  const prevIndexRef = useRef<number>(0)

  const [stepWidth, setStepWidth] = useState(0)
  const [oneSetWidth, setOneSetWidth] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)

  const stepWidthRef = useRef<number>(stepWidth)
  const oneSetWidthRef = useRef<number>(oneSetWidth)

  // Update refs when state changes
  useEffect(() => {
    stepWidthRef.current = stepWidth
    oneSetWidthRef.current = oneSetWidth
  }, [stepWidth, oneSetWidth])

  // Measure card width and handle window resize dynamically
  useLayoutEffect(() => {
    const handleResize = () => {
      const track = trackRef.current
      if (!track || !track.children[0]) return
      const isMobile = window.innerWidth < 1024
      const cardW = isMobile
        ? Math.min(window.innerWidth * 0.85, 380)
        : 380
      const step = cardW + gap
      setStepWidth(step)
      setOneSetWidth(step * total)

      if (!isInitialisedRef.current) {
        x.set(-step * total)
        isInitialisedRef.current = true
      } else {
        const currentX = x.get()
        const setOffset = step * total
        // Keep within bounds: if position drifted, snap to nearest valid offset
        const remainder = ((currentX % setOffset) + setOffset) % setOffset
        x.set(-(setOffset + remainder % step))
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [x, total, gap])

  // Auto-scroll function
  useEffect(() => {
    if (reducedMotion) return

    startAnimRef.current = () => {
      if (!oneSetWidthRef.current) return
      const currentX = x.get()
      const targetX = currentX - oneSetWidthRef.current
      if (autoAnimRef.current) autoAnimRef.current.stop()
      autoAnimRef.current = animate(x, [currentX, targetX], {
        duration: 40,
        ease: 'linear',
        onComplete: () => {
          x.set(x.get() + oneSetWidthRef.current)
          if (startAnimRef.current) startAnimRef.current()
        },
      })
      if (isHovering && autoAnimRef.current) {
        autoAnimRef.current.pause()
      }
    }
  }, [x, oneSetWidth, isHovering, reducedMotion])

  // Start / stop auto-scroll based on isPlaying
  useEffect(() => {
    if (reducedMotion) return
    if (isPlaying && oneSetWidthRef.current > 0) {
      startAnimRef.current?.()
    } else if (autoAnimRef.current) {
      autoAnimRef.current.stop()
    }
    return () => {
      if (autoAnimRef.current) autoAnimRef.current.stop()
    }
  }, [isPlaying, oneSetWidth, reducedMotion])

  // Pause / resume on hover
  useEffect(() => {
    if (!autoAnimRef.current) return
    if (isHovering) {
      autoAnimRef.current.pause()
    } else if (isPlaying) {
      autoAnimRef.current.play()
    }
  }, [isHovering, isPlaying])

  // Track focused index from x position
  useEffect(() => {
    if (!stepWidthRef.current) return
    const unsubscribe = x.on('change', (latest: number) => {
      const absScroll = Math.abs(latest)
      const cardAtLeft = Math.floor(absScroll / stepWidthRef.current)
      const index = cardAtLeft % total
      if (index >= 0 && index < total && index !== prevIndexRef.current) {
        prevIndexRef.current = index
        setCurrentIndex(index)
      }
    })
    return unsubscribe
  }, [x, total])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    }
  }, [])

  // Navigation helpers
  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const next = useCallback(() => {
    if (stepWidthRef.current === 0) return
    if (autoAnimRef.current) autoAnimRef.current.stop()
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    setIsPlaying(false)

    const currentX = x.get()
    const targetX = currentX - stepWidthRef.current

    animate(x, [currentX, targetX], {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
      onComplete: () => {
        pauseTimerRef.current = setTimeout(() => setIsPlaying(true), autoplayMs)
      },
    })
  }, [x, autoplayMs])

  const prev = useCallback(() => {
    if (stepWidthRef.current === 0) return
    if (autoAnimRef.current) autoAnimRef.current.stop()
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    setIsPlaying(false)

    const currentX = x.get()
    const targetX = currentX + stepWidthRef.current

    animate(x, [currentX, targetX], {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
      onComplete: () => {
        pauseTimerRef.current = setTimeout(() => setIsPlaying(true), autoplayMs)
      },
    })
  }, [x, autoplayMs])

  const scrollToIndex = useCallback(
    (targetIndex: number) => {
      if (stepWidthRef.current === 0) return
      if (autoAnimRef.current) autoAnimRef.current.stop()
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
      setIsPlaying(false)

      let delta = targetIndex - currentIndex
      if (delta > total / 2) delta -= total
      if (delta < -(total / 2)) delta += total

      const currentX = x.get()
      const targetX = currentX - delta * stepWidthRef.current

      animate(x, [currentX, targetX], {
        duration: 0.5 + Math.abs(delta) * 0.1,
        ease: [0.22, 1, 0.36, 1] as const,
        onComplete: () => {
          pauseTimerRef.current = setTimeout(() => setIsPlaying(true), autoplayMs)
        },
      })
    },
    [x, currentIndex, total, autoplayMs]
  )

  return {
    trackRef,
    x,
    isPlaying,
    currentIndex,
    stepWidth,
    oneSetWidth,
    goNext: next,
    goPrev: prev,
    goToIndex: scrollToIndex,
    togglePlayPause,
    setIsHovering,
  }
}
