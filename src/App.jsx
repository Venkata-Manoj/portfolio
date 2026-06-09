import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import EducationSection from './components/EducationSection'
import CertificatesSection from './components/CertificatesSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import PamWidget from './components/PamWidget'
import { FORMSPREE_FORM_ID } from './constants'

const App = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [tourTrigger, setTourTrigger] = useState(0)
  const handleStartTour = () => setTourTrigger(t => t + 1)

  return (
    <main className="relative w-full" style={{ overflowX: 'clip', background: 'transparent' }}>
      {/* Skip to content — first focusable element for keyboard users */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-[#D4A574] focus:text-[#0C0C0C] focus:font-bold focus:text-sm focus:rounded-full focus:shadow-[0_0_30px_rgba(212,165,116,0.3)] focus:outline-none"
        tabIndex={0}
      >
        Skip to content
      </a>
      <Navbar onStartTour={handleStartTour} />
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <ProjectsSection />
      <CertificatesSection />
      <ContactSection formspreeId={FORMSPREE_FORM_ID} />
      <PamWidget tourTrigger={tourTrigger} />
    </main>
  )
}

export default App
