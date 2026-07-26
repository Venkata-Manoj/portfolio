import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import ProjectsSection from './ProjectsSection'

vi.mock('framer-motion')

describe('ProjectsSection', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders the section heading', () => {
    render(<ProjectsSection />)
    expect(screen.getByText('PROJECTS')).toBeInTheDocument()
  })

  it('renders the "Featured Work" eyebrow', () => {
    render(<ProjectsSection />)
    expect(screen.getByText('Featured Work')).toBeInTheDocument()
  })

  it('renders the constellation canvas with an accessible label', () => {
    render(<ProjectsSection />)
    const canvas = screen.getByRole('img', { name: /Interactive constellation/i })
    expect(canvas).toBeInTheDocument()
    expect(canvas.tagName).toBe('CANVAS')
  })

  it('renders the canvas with a descriptive label mentioning project nodes', () => {
    render(<ProjectsSection />)
    const canvas = screen.getByRole('img', { name: /Interactive constellation of project nodes/i })
    expect(canvas).toBeInTheDocument()
  })

  it('renders the category legend with at least one category label', () => {
    render(<ProjectsSection />)
    // "All repos" is the CTA category from the legend
    expect(screen.getByText('All repos')).toBeInTheDocument()
  })

  it('renders reset and shake tool buttons', () => {
    render(<ProjectsSection />)
    expect(screen.getByText('reset')).toBeInTheDocument()
    expect(screen.getByText('shake')).toBeInTheDocument()
  })

  it('renders the detail panel container hidden by default', () => {
    const { container } = render(<ProjectsSection />)
    const panel = container.querySelector('[data-testid="project-panel"]')
    expect(panel).toBeInTheDocument()
    expect(panel).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not throw on Escape key when panel is closed', () => {
    render(<ProjectsSection />)
    // Should be a no-op (no crash) when nothing is selected.
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.getByText('PROJECTS')).toBeInTheDocument()
  })
})
