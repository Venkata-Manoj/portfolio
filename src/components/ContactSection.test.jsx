import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import ContactSection from './ContactSection'

vi.mock('framer-motion')

// Mock @formspree/react with a default "idle" state
vi.mock('@formspree/react', () => ({
  useForm: () => {
    return [
      { submitting: false, succeeded: false, errors: null },
      vi.fn(),
    ]
  },
}))

describe('ContactSection', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders the section heading', () => {
    render(<ContactSection formspreeId="test-id" />)
    expect(screen.getByText('Get in Touch')).toBeInTheDocument()
  })

  it('renders the form header and hint', () => {
    render(<ContactSection formspreeId="test-id" />)
    expect(screen.getByText('Send a Message')).toBeInTheDocument()
    expect(
      screen.getByText("Fill in the details below and I'll get back to you within 24-48 hours.")
    ).toBeInTheDocument()
  })

  it('renders all form fields with labels', () => {
    render(<ContactSection formspreeId="test-id" />)

    // Name field
    const nameInput = screen.getByRole('textbox', { name: 'Name' })
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).toHaveAttribute('type', 'text')
    expect(nameInput).toHaveAttribute('name', 'name')
    expect(nameInput).toBeRequired()

    // Email field — use role to be specific
    const emailInput = screen.getByRole('textbox', { name: 'Email' })
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('name', 'email')
    expect(emailInput).toBeRequired()

    // Message field
    const messageInput = screen.getByRole('textbox', { name: 'Message' })
    expect(messageInput).toBeInTheDocument()
    expect(messageInput.tagName).toBe('TEXTAREA')
    expect(messageInput).toHaveAttribute('name', 'message')
    expect(messageInput).toBeRequired()
  })

  it('renders submit button', () => {
    render(<ContactSection formspreeId="test-id" />)
    const submitButton = screen.getByText('Send Message')
    expect(submitButton).toBeInTheDocument()
    expect(submitButton.closest('button')).toHaveAttribute('type', 'submit')
    expect(submitButton.closest('button')).not.toBeDisabled()
  })

  it('renders social media links with correct aria labels', () => {
    render(<ContactSection formspreeId="test-id" />)
    expect(screen.getByLabelText('X (Twitter)')).toBeInTheDocument()
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument()
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument()
  })

  it('renders the section with correct aria-label', () => {
    render(<ContactSection formspreeId="test-id" />)
    const section = screen.getByLabelText('Contact')
    expect(section).toBeInTheDocument()
    expect(section.tagName).toBe('SECTION')
  })

  it('email link in orbit portal has correct href', () => {
    render(<ContactSection formspreeId="test-id" />)
    // Email label appears on both the orbit link and the form input label
    // Use link role to find the orbit link specifically
    const emailLink = screen.getAllByRole('link').find(
      (link) => link.getAttribute('aria-label') === 'Email'
    )
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', 'mailto:bvmanoj61@gmail.com')
  })

  it('GitHub link points to correct profile', () => {
    render(<ContactSection formspreeId="test-id" />)
    const githubLink = screen.getByLabelText('GitHub')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Venkata-Manoj')
  })

  it('LinkedIn link points to correct profile', () => {
    render(<ContactSection formspreeId="test-id" />)
    const linkedinLink = screen.getByLabelText('LinkedIn')
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/venkata-manoj')
  })
})
