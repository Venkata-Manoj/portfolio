import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ServicesSection from './components/ServicesSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import PamWidget from './components/PamWidget'

const App = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [tourTrigger, setTourTrigger] = useState(0)
  const handleStartTour = () => setTourTrigger(t => t + 1)

  return (
    <main className="relative w-full" style={{ overflowX: 'clip', background: '#0C0C0C' }}>
      <Navbar onStartTour={handleStartTour} />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
      <PamWidget tourTrigger={tourTrigger} />
    </main>
  )
}

export default App
