import '@testing-library/jest-dom'

// Mock IntersectionObserver — used by framer-motion's useInView
window.IntersectionObserver = class {
  constructor() { this.observe = () => {}; this.unobserve = () => {}; this.disconnect = () => {} }
}

// Mock matchMedia — used by usePrefersReducedMotion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock scrollTo
window.scrollTo = vi.fn()

// Mock HTMLMediaElement play/pause for video/audio refs in jsdom
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn().mockResolvedValue(undefined),
})
Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
})
// Mock video properties used by HeroSection
Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
  writable: true,
  value: false,
})
Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
  writable: true,
  value: 1,
})
