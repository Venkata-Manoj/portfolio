import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const ABOUT_TEXT = "I'm an AI & Data Science engineering student at SIMATS Engineering, class of 2028. I build intelligent systems - from RAG pipelines and multi-LLM agent workflows to full-stack applications deployed at scale. Every project starts with the same philosophy: production-grade quality from day one."

const SKILL_GROUPS = [
  {
    label: 'Languages',
    dotColor: '#D4A574',
    items: ['Python', 'TypeScript', 'JavaScript', 'C++', 'SQL', 'HTML', 'CSS'],
  },
  {
    label: 'Frameworks',
    dotColor: '#A67C52',
    items: ['React', 'Next.js', 'FastAPI', 'Node.js', 'Tailwind CSS', 'Framer Motion', 'LangChain', 'shadcn/ui'],
  },
  {
    label: 'AI / ML',
    dotColor: '#C4956A',
    items: ['LLMs', 'RAG Pipelines', 'FAISS', 'NLP', 'PyTorch', 'TensorFlow', 'Ollama', 'Prompt Engineering', 'Transformers', 'scikit-learn'],
  },
  {
    label: 'Tools & Platforms',
    dotColor: '#B8895E',
    items: ['Vercel', 'Firebase', 'Docker', 'Git', 'Prisma', 'SQLite', 'PostgreSQL', 'MongoDB', 'REST APIs', 'VS Code', 'AI Agents'],
  },
  // {
  //   label: 'Spoken Languages',
  //   dotColor: '#B8895E',
  //   items: ['English (Fluent)', 'Telugu (Native)', 'Hindi (Conversational)', 'Tamil (Conversational)'],
  // }
]

function SkillPill({ children }) {
  return (
    <span className="inline-flex px-3.5 py-1.5 rounded-full border border-[rgba(237,231,217,0.05)] bg-[rgba(255,255,255,0.015)] text-xs text-[rgba(237,231,217,0.5)] font-light cursor-default transition-all duration-300 hover:border-[rgba(212,165,116,0.25)] hover:text-[#EDE7D9] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(212,165,116,0.08)] active:translate-y-0 active:scale-[0.98] relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(212,165,116,0.08),transparent)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100">
      {children}
    </span>
  )
}

export default function AboutSection() {
  const headingRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-40px' })
  const bioRef = useRef(null)
  const bioInView = useInView(bioRef, { once: true, margin: '-40px' })
  const skillsRef = useRef(null)
  const skillsInView = useInView(skillsRef, { once: true, margin: '-40px' })

  return (
    <section
      id="about"
      className="relative min-h-screen w-full overflow-hidden px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-36 bg-[#0C0C0C]"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.012] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(237,231,217,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(237,231,217,0.08) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Floating gold orbs */}
      {/* Reduced blur radii — blur >80px has diminishing visual returns but high GPU cost */}
      <div className="absolute top-[5%] -left-[5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.08),transparent)] blur-[80px] pointer-events-none animate-about-float-a" />
      <div className="absolute bottom-[5%] -right-[5%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(166,124,82,0.06),transparent)] blur-[100px] pointer-events-none animate-about-float-b" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.04),transparent)] blur-[60px] pointer-events-none animate-about-float-a-reverse" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* === Heading === */}
        <div ref={headingRef} className="text-center mb-16 sm:mb-20 group/heading">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[10px] uppercase tracking-[0.3em] text-[rgba(237,231,217,0.25)] font-normal mb-3"
          >
            Discover my story
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-['Kanit'] font-black uppercase leading-none tracking-tighter text-[#EDE7D9] transition-transform duration-500 group-hover/heading:scale-[1.01]"
            style={{ fontSize: 'clamp(3rem, 9vw, 7.5rem)' }}
          >
            About{' '}
            <span className="bg-gradient-to-r from-[#D4A574] to-[#A67C52] bg-clip-text text-transparent transition-[filter] duration-300 hover:brightness-110">
              me
            </span>
          </motion.h2>
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={headingInView ? { width: 80, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-[2px] mx-auto mt-4 rounded-full bg-gradient-to-r from-[rgba(212,165,116,0.6)] via-[rgba(166,124,82,0.2)] to-transparent transition-all duration-500 group-hover/heading:w-[120px]"
          />
        </div>

        {/* === Bio Row === */}
        <div
          ref={bioRef}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 mb-16 lg:mb-20 items-center"
        >
          {/* Avatar Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={bioInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-center"
          >
            <motion.div
              className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] mx-auto mb-7"
              style={{ perspective: '800px' }}
              whileHover={{ scale: 1.05, rotateY: 2, rotateX: -1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Shimmering gold ring */}
              <div
                className="w-full h-full rounded-full p-[4px] relative animate-about-shimmer-border cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, #D4A574, #A67C52, #C4956A, #D4A574)',
                  backgroundSize: '300% 300%',
                }}
              >
                {/* will-change optimized — already GPU-composited by shimmer animation */}
                <div className="absolute -inset-[10px] rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.12),transparent)] blur-[14px] -z-10 opacity-40 transition-opacity duration-400 group-hover:opacity-60" />
                <div className="w-full h-full rounded-full bg-[#0C0C0C] overflow-hidden transition-colors duration-300 hover:bg-[#11100E]">
                  <img
                    src="/me.jpeg"
                    alt="Ballani Venkata Manoj"
                    width="200"
                    height="200"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={bioInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-xl sm:text-2xl font-['Kanit'] font-bold text-[#EDE7D9] mb-1 transition-colors duration-300 hover:text-[#D4A574] cursor-default"
            >
              Ballani Venkata Manoj
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={bioInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-[10px] sm:text-[11px] text-[rgba(212,165,116,0.7)] uppercase tracking-[0.15em] font-medium"
            >
              AI & Data Science Student
            </motion.p>
          </motion.div>

          {/* Bio Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={bioInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="group/bio"
          >
            <span className="text-4xl sm:text-5xl leading-[0.5] text-[rgba(212,165,116,0.15)] font-serif mb-3 inline-block transition-all duration-400 group-hover/bio:rotate-90 group-hover/bio:scale-110 group-hover/bio:text-[rgba(212,165,116,0.3)]">
              &#10022;
            </span>
            <p className="text-sm sm:text-base leading-relaxed sm:leading-[1.85] text-[rgba(237,231,217,0.65)] font-light mb-7 transition-colors duration-400 group-hover/bio:text-[rgba(237,231,217,0.8)]">
              {ABOUT_TEXT}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="group/cta inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#D4A574] to-[#A67C52] text-[#0C0C0C] text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em] no-underline transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(212,165,116,0.3),0_0_60px_rgba(212,165,116,0.1)] active:scale-[0.98] active:translate-y-0 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.15),transparent)] opacity-0 transition-opacity duration-400 group-hover/cta:opacity-100" />
                <span className="relative z-10">Collaborate</span>
                <ArrowRight size={14} className="relative z-10 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:translate-x-1" />
              </a>
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="group/cta2 relative inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full border border-[rgba(237,231,217,0.12)] text-[rgba(237,231,217,0.6)] text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.08em] no-underline transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[rgba(212,165,116,0.3)] hover:text-[#EDE7D9] hover:-translate-y-0.5 overflow-hidden"
              >
                <span className="absolute inset-[-1px] rounded-full opacity-0 transition-opacity duration-400 group-hover/cta2:opacity-100"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,165,116,0.3), transparent, rgba(212,165,116,0.15))',
                    backgroundSize: '200% 200%',
                    zIndex: -1,
                  }}
                />
                View projects
              </a>
            </div>
          </motion.div>
        </div>

        {/* === Skills Wall === */}
        <motion.div
          ref={skillsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={skillsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="relative group/skills rounded-[28px] sm:rounded-[32px] p-[1px]"
          style={{
            background: 'linear-gradient(105deg, transparent 20%, rgba(212,165,116,0.12) 30%, rgba(212,165,116,0.25) 40%, rgba(212,165,116,0.12) 50%, transparent 60%, rgba(166,124,82,0.08) 70%, transparent 80%)',
            backgroundSize: '300% 300%',
          }}
        >
          {/* Animated gradient border */}
          <div className="absolute inset-[-1px] rounded-[28px] sm:rounded-[32px] opacity-0 group-hover/skills:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(105deg, transparent 20%, rgba(212,165,116,0.2) 30%, rgba(212,165,116,0.4) 40%, rgba(212,165,116,0.2) 50%, transparent 60%, rgba(166,124,82,0.12) 70%, transparent 80%)',
              backgroundSize: '300% 300%',
              animation: 'shimmer-border 6s ease-in-out infinite',
              zIndex: -1,
            }}
          />
          <div className="rounded-[28px] sm:rounded-[32px] bg-[rgba(30,28,26,0.5)] backdrop-blur-[24px] p-8 sm:p-10 md:p-12 relative overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/skills:-translate-y-0.5">
            {/* Top streak */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(212,165,116,0.2)] to-transparent animate-about-shimmer-streak" />

            <div className="flex items-center justify-between mb-8 sm:mb-9 flex-wrap gap-3">
              <h3 className="text-xs sm:text-sm font-medium text-[rgba(237,231,217,0.6)] uppercase tracking-[0.05em] transition-colors duration-300 group-hover/skills:text-[rgba(237,231,217,0.8)]">
                Technical expertise
              </h3>
              <span className="text-[10px] sm:text-[11px] text-[rgba(237,231,217,0.2)] font-light transition-colors duration-300 group-hover/skills:text-[rgba(212,165,116,0.4)]">
                36+ skills
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {SKILL_GROUPS.map((group, gi) => (
                <motion.div
                  key={group.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={skillsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + gi * 0.1 }}
                  className="group/category transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
                >
                  <h4 className="flex items-center gap-2 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[rgba(237,231,217,0.2)] font-semibold mb-3.5 pb-2.5 border-b border-[rgba(237,231,217,0.04)] transition-all duration-300 group-hover/category:text-[rgba(212,165,116,0.6)] group-hover/category:border-b-[rgba(212,165,116,0.1)]">
                    <span
                      className="w-[5px] h-[5px] rounded-full inline-block transition-all duration-300 group-hover/category:scale-150 group-hover/category:shadow-[0_0_8px_currentColor]"
                      style={{ background: group.dotColor, color: group.dotColor }}
                    />
                    {group.label}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item, ii) => (
                      <motion.span
                        key={item}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={skillsInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: 0.9 + gi * 0.1 + ii * 0.04 }}
                      >
                        <SkillPill>{item}</SkillPill>
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Animations moved to index.css — eliminates DOM style node recreation on every render */}
    </section>
  )
}
