import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import CertificatesSection from './CertificatesSection'

vi.mock('framer-motion')

describe('CertificatesSection', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders the section heading', () => {
    render(<CertificatesSection />)
    expect(screen.getByText('CERTIFICATES')).toBeInTheDocument()
  })

  it('renders the "Verified Credentials" eyebrow', () => {
    render(<CertificatesSection />)
    expect(screen.getByText('Verified Credentials')).toBeInTheDocument()
  })

  it('renders the synapse web canvas with an accessible label', () => {
    render(<CertificatesSection />)
    const canvas = screen.getByRole('img', { name: /Interactive neural map of certifications/i })
    expect(canvas).toBeInTheDocument()
    expect(canvas.tagName).toBe('CANVAS')
  })

  it('renders pulse all and reset tool buttons', () => {
    render(<CertificatesSection />)
    expect(screen.getByText('pulse all')).toBeInTheDocument()
    expect(screen.getByText('reset')).toBeInTheDocument()
  })

  it('renders the detail panel container hidden by default', () => {
    const { container } = render(<CertificatesSection />)
    const panel = container.querySelector('[data-testid="cert-panel"]')
    expect(panel).toBeInTheDocument()
    expect(panel).toHaveAttribute('aria-hidden', 'true')
  })
})
