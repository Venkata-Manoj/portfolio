import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act, cleanup } from '@testing-library/react'
import { useIsMobile } from '../hooks/useIsMobile'

describe('useIsMobile', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('returns false by default with wide viewport', () => {
    // Default jsdom viewport is 1024x768
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('returns true when viewport is narrow', () => {
    // Mock a narrow window
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('responds to resize from narrow to wide', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)

    // Resize to wide
    act(() => {
      window.innerWidth = 1024
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current).toBe(false)
  })

  it('responds to resize from wide to narrow', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    // Resize to narrow
    act(() => {
      window.innerWidth = 600
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current).toBe(true)
  })

  it('accepts custom breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    })
    const { result: defaultBreakpoint } = renderHook(() => useIsMobile())
    expect(defaultBreakpoint.current).toBe(false)

    const { result: customBreakpoint } = renderHook(() => useIsMobile(900))
    expect(customBreakpoint.current).toBe(true)
  })
})
