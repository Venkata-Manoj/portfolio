import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from './Navbar'

vi.mock('framer-motion')

describe('Navbar', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders all navigation items', () => {
    render(<Navbar onStartTour={vi.fn()} />)
    const navItems = ['Home', 'About', 'Education', 'Projects', 'Certificates', 'Contact']
    navItems.forEach((label) => {
      const links = screen.getAllByText(label)
      expect(links.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('renders logo and brand name', () => {
    render(<Navbar onStartTour={vi.fn()} />)
    expect(screen.getByText('Manoj')).toBeInTheDocument()
    const logo = screen.getByAltText('B V Manoj')
    expect(logo).toBeInTheDocument()
  })

  it('renders resume download link in desktop actions', () => {
    render(<Navbar onStartTour={vi.fn()} />)
    // "Resume" appears twice (desktop + mobile menu) — pick the desktop one
    const resumeLinks = screen.getAllByText('Resume')
    expect(resumeLinks.length).toBe(2)
    // Both are links to the resume PDF
    resumeLinks.forEach((link) => {
      const anchor = link.closest('a')
      expect(anchor).toHaveAttribute('href', '/Resume_Manoj.pdf')
    })
    // At least one has the download attribute
    const hasDownload = resumeLinks.some((link) => {
      const anchor = link.closest('a')
      return anchor?.getAttribute('download') === 'Resume_BV_Manoj.pdf'
    })
    expect(hasDownload).toBe(true)
  })

  it('renders tour button and calls onStartTour on click', async () => {
    const onStartTour = vi.fn()
    render(<Navbar onStartTour={onStartTour} />)
    const user = userEvent.setup()

    const tourButton = screen.getByText('Tour')
    expect(tourButton).toBeInTheDocument()

    await user.click(tourButton)
    expect(onStartTour).toHaveBeenCalledTimes(1)
    // The callback is called with the click event (default React behavior)
  })

  it('toggles mobile menu when hamburger button is clicked', async () => {
    render(<Navbar onStartTour={vi.fn()} />)
    const user = userEvent.setup()

    const menuButton = screen.getByLabelText('Toggle menu')
    expect(menuButton).toBeInTheDocument()
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    // Open
    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    // Close
    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes mobile menu when a nav item is clicked', async () => {
    render(<Navbar onStartTour={vi.fn()} />)
    const user = userEvent.setup()

    const menuButton = screen.getByLabelText('Toggle menu')
    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    // Click a nav link inside the mobile menu
    const aboutLinks = screen.getAllByText('About')
    // Click the first one (both desktop and mobile render, but both should close)
    await user.click(aboutLinks[0])
    // After clicking a link, menu should close
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })
})
