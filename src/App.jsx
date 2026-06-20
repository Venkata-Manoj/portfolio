import { useState, useEffect, lazy, Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { ErrorBoundary } from 'react-error-boundary'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import EducationSection from './components/EducationSection'
const CertificatesSection = lazy(() => import('./components/CertificatesSection'))
const ProjectsSection = lazy(() => import('./components/ProjectsSection'))
const ContactSection = lazy(() => import('./components/ContactSection'))
const PamWidget = lazy(() => import('./components/PamWidget'))
import { FORMSPREE_FORM_ID } from './constants'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-3xl mb-4">⚠</div>
      <h3 className="text-lg font-bold text-[#D4A574] mb-2">Section failed to load</h3>
      <p className="text-sm text-[rgba(237,231,217,0.5)] max-w-sm mb-4">
        {error?.message || 'An unexpected error occurred in this section.'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-5 py-2 rounded-full bg-gradient-to-r from-[#D4A574] to-[#A67C52] text-[#0C0C0C] text-xs font-semibold cursor-pointer"
      >
        Reload section
      </button>
    </div>
  )
}

const App = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [tourTrigger, setTourTrigger] = useState(0)
  const handleStartTour = () => setTourTrigger(t => t + 1)

  return (
    <main id="main-content" className="relative w-full" style={{ overflowX: 'clip', background: 'transparent' }}>
      {/* Vercel Analytics — only sends data on Vercel deployments */}
      <Analytics />
      {/* Vercel Speed Insights — only sends data on Vercel deployments */}
      <SpeedInsights />
      {/* Skip to content — first focusable element for keyboard users */}
      <a
        href="#main-content"
        aria-label="Skip to main content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-[#D4A574] focus:text-[#0C0C0C] focus:font-bold focus:text-sm focus:rounded-full focus:shadow-[0_0_30px_rgba(212,165,116,0.3)] focus:outline-none"
        tabIndex={0}
      >
        Skip to content
      </a>
      <Navbar onStartTour={handleStartTour} />
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <Suspense fallback={null}>
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
          <ProjectsSection />
        </ErrorBoundary>
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
          <CertificatesSection />
        </ErrorBoundary>
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
          <ContactSection formspreeId={FORMSPREE_FORM_ID} />
        </ErrorBoundary>
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
          <PamWidget tourTrigger={tourTrigger} />
        </ErrorBoundary>
      </Suspense>
      <footer role="contentinfo" className="text-center py-8 px-4 text-xs text-[rgba(237,231,217,0.45)] uppercase tracking-[0.15em] font-light">
        <p>&copy; {new Date().getFullYear()} Ballani Venkata Manoj. All rights reserved.</p>
      </footer>
    </main>
  )
}

export default App
