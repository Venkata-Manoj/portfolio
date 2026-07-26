import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import EducationSection from './EducationSection'

vi.mock('framer-motion')

describe('EducationSection', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders the section heading', () => {
    render(<EducationSection />)
    // The EDUCATION text is rendered in a gradient heading
    const heading = screen.getByText('EDUCATION')
    expect(heading).toBeInTheDocument()
  })

  it('renders the "My Journey" subtitle', () => {
    render(<EducationSection />)
    expect(screen.getByText('My Journey')).toBeInTheDocument()
  })

  it('renders the academic background description', () => {
    render(<EducationSection />)
    expect(screen.getByText('Academic background & achievements')).toBeInTheDocument()
  })

  it('renders both education entries with correct data', () => {
    render(<EducationSection />)

    // B.Tech entry
    expect(screen.getByText("B.Tech CSE (AI & Data Science)")).toBeInTheDocument()
    expect(screen.getByText('SIMATS Engineering / Saveetha University')).toBeInTheDocument()
    expect(screen.getByText('9.2 CGPA')).toBeInTheDocument()

    // Intermediate entry
    expect(screen.getByText('Class XII (MPC)')).toBeInTheDocument()
    expect(screen.getByText('SR Junior College, Vijayawada')).toBeInTheDocument()
    expect(screen.getByText('95.6%')).toBeInTheDocument()
  })

  it('renders institution images', () => {
    render(<EducationSection />)
    const images = screen.getAllByRole('img')
    // B.Tech image + Intermediate image
    expect(images.length).toBeGreaterThanOrEqual(2)

    // Check alt text
    const altTexts = images.map((img) => img.getAttribute('alt'))
    expect(altTexts).toContain('SIMATS Engineering / Saveetha University')
    expect(altTexts).toContain('SR Junior College, Vijayawada')
  })

  it('renders the section with correct aria-label', () => {
    render(<EducationSection />)
    const section = screen.getByLabelText('Education')
    expect(section).toBeInTheDocument()
    expect(section.tagName).toBe('SECTION')
  })

  it('renders year badges', () => {
    render(<EducationSection />)
    expect(screen.getByText('2024 – 2028')).toBeInTheDocument()
    expect(screen.getByText('2022 – 2024')).toBeInTheDocument()
  })
})
