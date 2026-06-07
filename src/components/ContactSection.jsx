import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Linkedin, Github, Send } from 'lucide-react'

export default function ContactSection() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })

  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [feedback, setFeedback] = useState({ show: false, message: '', type: '' })

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formState.name || !formState.email || !formState.message) {
      setFeedback({ show: true, message: 'Please fill in all fields.', type: 'error' })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      setFeedback({ show: true, message: 'Please enter a valid email address.', type: 'error' })
      return
    }
    setFeedback({
      show: true,
      message: `Thanks, ${formState.name}! Your message has been sent. I'll respond within 24 hours.`,
      type: 'success',
    })
    setFormState({ name: '', email: '', message: '' })
  }

  return (
    <section
      id="contact"
      className="relative z-10 w-full bg-transparent px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-36"
    >
      {/* Background gold glow orbs */}
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none animate-contact-orb-float"
        style={{
          background: 'radial-gradient(circle, rgba(212,165,116,0.08), transparent 70%)',
          filter: 'blur(150px)',
        }}
      />
      <div
        className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none animate-contact-orb-float"
        style={{
          background: 'radial-gradient(circle, rgba(166,124,82,0.06), transparent 70%)',
          filter: 'blur(120px)',
          animationDelay: '-9s',
        }}
      />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Section Heading */}
        <div ref={headerRef} className="text-center mb-16 sm:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-['Kanit'] font-black uppercase leading-none tracking-tight inline-block"
            style={{
              fontSize: 'clamp(3rem, 9vw, 7.5rem)',
              background: 'linear-gradient(135deg, #D4A574, #A67C52)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Get in Touch
          </motion.h2>
          {/* Shimmer underline */}
          <div
            className="mx-auto mt-4 h-[2px] w-48 bg-[linear-gradient(90deg,transparent,#D4A574,transparent)] animate-shimmer-border rounded-full"
            style={{ backgroundSize: '200% 100%' }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT: Orbit Portal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center items-center"
          >
            <div className="orbit-container relative w-[360px] h-[360px] max-sm:scale-[0.7] origin-center flex items-center justify-center">
              {/* Dashed ring */}
              <div className="absolute w-[280px] h-[280px] rounded-full border-2 border-dashed border-[rgba(212,165,116,0.2)]" />

              {/* Spin layer — rotates all orbit items around the center */}
              <div className="absolute w-0 h-0 top-1/2 left-1/2 animate-contact-orbit-spin">
                {/* Twitter/X — 0° (top) */}
                <a
                  href="https://x.com/Manoj13016367"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(212,165,116,0.05)] border border-[rgba(212,165,116,0.2)] text-[#D4A574] transition-all duration-300 hover:bg-[rgba(212,165,116,0.15)] hover:border-[#D4A574] hover:shadow-[0_0_30px_rgba(212,165,116,0.15)] hover:scale-110 animate-contact-orbit-counter-spin"
                  style={{ top: '-133px', left: '0px', transform: 'translate(-50%, -50%)' }}
                  aria-label="X (Twitter)"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Instagram — 72° */}
                <a
                  href="https://instagram.com/call_me_v_m"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(212,165,116,0.05)] border border-[rgba(212,165,116,0.2)] text-[#D4A574] transition-all duration-300 hover:bg-[rgba(212,165,116,0.15)] hover:border-[#D4A574] hover:shadow-[0_0_30px_rgba(212,165,116,0.15)] hover:scale-110 animate-contact-orbit-counter-spin"
                  style={{ top: '-41px', left: '127px', transform: 'translate(-50%, -50%)' }}
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>

                {/* Email — 144° */}
                <a
                  href="mailto:bvmanoj61@gmail.com"
                  className="absolute flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(212,165,116,0.05)] border border-[rgba(212,165,116,0.2)] text-[#D4A574] transition-all duration-300 hover:bg-[rgba(212,165,116,0.15)] hover:border-[#D4A574] hover:shadow-[0_0_30px_rgba(212,165,116,0.15)] hover:scale-110 animate-contact-orbit-counter-spin"
                  style={{ top: '108px', left: '78px', transform: 'translate(-50%, -50%)' }}
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>

                {/* LinkedIn — 216° */}
                <a
                  href="https://linkedin.com/in/venkata-manoj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(212,165,116,0.05)] border border-[rgba(212,165,116,0.2)] text-[#D4A574] transition-all duration-300 hover:bg-[rgba(212,165,116,0.15)] hover:border-[#D4A574] hover:shadow-[0_0_30px_rgba(212,165,116,0.15)] hover:scale-110 animate-contact-orbit-counter-spin"
                  style={{ top: '108px', left: '-78px', transform: 'translate(-50%, -50%)' }}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                {/* GitHub — 288° */}
                <a
                  href="https://github.com/Venkata-Manoj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(212,165,116,0.05)] border border-[rgba(212,165,116,0.2)] text-[#D4A574] transition-all duration-300 hover:bg-[rgba(212,165,116,0.15)] hover:border-[#D4A574] hover:shadow-[0_0_30px_rgba(212,165,116,0.15)] hover:scale-110 animate-contact-orbit-counter-spin"
                  style={{ top: '-41px', left: '-127px', transform: 'translate(-50%, -50%)' }}
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>

              {/* Center circle — "Let's Talk" callout */}
              <div className="absolute w-[120px] h-[120px] rounded-full border-2 border-[rgba(212,165,116,0.3)] bg-[rgba(20,18,17,0.6)] backdrop-blur-sm flex flex-col items-center justify-center animate-contact-center-pulse">
                <span className="text-[#D4A574] text-sm font-['Kanit'] font-bold leading-tight">
                  Let's
                </span>
                <span className="text-[#D4A574] text-sm font-['Kanit'] font-bold leading-tight">
                  Talk
                </span>
                <span className="text-[rgba(212,165,116,0.4)] text-[8px] uppercase tracking-widest mt-0.5">
                  reach out
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-[rgba(20,18,17,0.55)] backdrop-blur-2xl border border-[rgba(212,165,116,0.08)] rounded-2xl p-8 transition-all duration-300 hover:border-[rgba(212,165,116,0.15)]">
              {/* Top gold accent line */}
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D4A574] to-transparent mb-6 rounded-full" />

              {/* Form header */}
              <h3 className="text-xl font-['Kanit'] font-bold text-white mb-2">Send a Message</h3>
              <p className="text-sm text-[rgba(212,165,116,0.5)] mb-8 font-light">
                Fill in the details below and I'll get back to you within 24 hours.
              </p>

              {/* Form fields */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name field */}
                <div>
                  <label className="block uppercase text-xs tracking-widest text-[rgba(212,165,116,0.5)] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(212,165,116,0.1)] rounded-xl text-white placeholder:text-[rgba(237,231,217,0.2)] focus:border-[#D4A574] focus:ring-2 focus:ring-[rgba(212,165,116,0.25)] focus:bg-[rgba(255,255,255,0.05)] outline-none transition-all"
                  />
                </div>

                {/* Email field */}
                <div>
                  <label className="block uppercase text-xs tracking-widest text-[rgba(212,165,116,0.5)] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(212,165,116,0.1)] rounded-xl text-white placeholder:text-[rgba(237,231,217,0.2)] focus:border-[#D4A574] focus:ring-2 focus:ring-[rgba(212,165,116,0.25)] focus:bg-[rgba(255,255,255,0.05)] outline-none transition-all"
                  />
                </div>

                {/* Message field */}
                <div>
                  <label className="block uppercase text-xs tracking-widest text-[rgba(212,165,116,0.5)] mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    rows={5}
                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(212,165,116,0.1)] rounded-xl text-white placeholder:text-[rgba(237,231,217,0.2)] focus:border-[#D4A574] focus:ring-2 focus:ring-[rgba(212,165,116,0.25)] focus:bg-[rgba(255,255,255,0.05)] outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="group w-full py-3 rounded-xl font-semibold text-[#0C0C0C] animate-contact-gold-sweep bg-[linear-gradient(135deg,#D4A574,#C4956A,#D4A574,#A67C52,#D4A574)] flex items-center justify-center gap-2 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(212,165,116,0.25)]"
                >
                  <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  Send Message
                </button>
              </form>

              {/* Feedback message (success or error) */}
              {feedback.show && (
                <div
                  className={`mt-4 px-4 py-3 rounded-xl text-sm ${
                    feedback.type === 'error'
                      ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                      : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {feedback.message}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
