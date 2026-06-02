import { useState } from 'react'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ExpertiseSection from './components/ExpertiseSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import PamWidget from './components/PamWidget'

const App = () => {
  const [tourTrigger, setTourTrigger] = useState(0)

  const handleStartTour = () => setTourTrigger(t => t + 1)

  return (
    <main className="relative w-full" style={{ overflowX: 'clip', background: '#0C0C0C' }}>
      <HeroSection onStartTour={handleStartTour} />
      <AboutSection />
      <ExpertiseSection />
      <ProjectsSection />
      <ContactSection />
      <PamWidget tourTrigger={tourTrigger} />
    </main>
  )
}

export default App
