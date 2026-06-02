import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ExpertiseSection from './components/ExpertiseSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'

const App = () => {
  return (
    <main className="relative w-full" style={{ overflowX: 'clip', background: '#0C0C0C' }}>
      <HeroSection />
      <AboutSection />
      <ExpertiseSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  )
}

export default App
