import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import App from './App'

vi.mock('framer-motion')

// Mock lazy-loaded heavy components to avoid animation/form complexity
vi.mock('./components/PamWidget', () => ({
  default: function MockPamWidget() { return null },
}))
vi.mock('./components/CertificatesSection', () => ({
  default: function MockCertificates() { return null },
}))
vi.mock('./components/ProjectsSection', () => ({
  default: function MockProjects() { return null },
}))
vi.mock('./components/ContactSection', () => ({
  default: function MockContact() {
    const React = require('react')
    return React.createElement('div', { 'data-testid': 'contact-section' })
  },
}))
vi.mock('@vercel/analytics/react', () => ({
  Analytics: function MockAnalytics() { return null },
}))
vi.mock('@vercel/speed-insights/react', () => ({
  SpeedInsights: function MockSpeedInsights() { return null },
}))

describe('App', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders the main content element with correct id', () => {
    render(<App />)
    const main = document.getElementById('main-content')
    expect(main).toBeInTheDocument()
  })

  it('renders Navbar', () => {
    render(<App />)
    const nav = screen.getByLabelText('Main navigation')
    expect(nav).toBeInTheDocument()
  })

  it('renders HeroSection', () => {
    render(<App />)
    const hero = screen.getByLabelText('Hero')
    expect(hero).toBeInTheDocument()
  })

  it('renders AboutSection', () => {
    render(<App />)
    const about = screen.getByLabelText('About')
    expect(about).toBeInTheDocument()
  })

  it('renders EducationSection', () => {
    render(<App />)
    const education = screen.getByLabelText('Education')
    expect(education).toBeInTheDocument()
  })

  it('renders skip to content link', () => {
    render(<App />)
    const skipLink = screen.getByText('Skip to content')
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  it('renders footer with copyright', () => {
    render(<App />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
    const year = new Date().getFullYear().toString()
    expect(footer).toHaveTextContent(`© ${year} Ballani Venkata Manoj. All rights reserved.`)
  })

  it('renders lazy-loaded ContactSection', () => {
    render(<App />)
    const contact = screen.getByTestId('contact-section')
    expect(contact).toBeInTheDocument()
  })
})
