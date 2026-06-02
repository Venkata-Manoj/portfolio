import FadeIn from './FadeIn'
import ContactButton from './ContactButton'
import AnimatedText from './AnimatedText'

const ABOUT_TEXT = "I'm an AI & Data Science engineering student at SIMATS Engineering, class of 2028. I build intelligent systems, automated pipelines, and interactive applications — bridging software engineering with advanced artificial intelligence. Whether developing modular agent workflows or testing local reinforcement learning setups, I aim to implement production-grade standards from day one."

const SKILL_GROUPS = [
  {
    label: 'Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'C++', 'SQL', 'HTML', 'CSS'],
  },
  {
    label: 'Frameworks & Libraries',
    items: ['React', 'Next.js', 'FastAPI', 'Node.js', 'Tailwind', 'Framer Motion'],
  },
  {
    label: 'AI & Data Science',
    items: ['LLMs', 'RAG Pipelines', 'FAISS', 'XGBoost', 'PyTorch', 'Ollama', 'LangChain'],
  },
  {
    label: 'Tools & Platforms',
    items: ['Vercel', 'Firebase', 'Docker', 'Git', 'Prisma', 'SQLite'],
  },
]

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 sm:px-8 md:px-10 py-20"
    >
      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16 text-center">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </h2>
        </FadeIn>

        <div className="flex flex-col items-center gap-12 sm:gap-16 md:gap-20">
          <AnimatedText
            text={ABOUT_TEXT}
            className="font-medium leading-relaxed text-[#D7E2EA] max-w-[560px]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />

          <FadeIn delay={0.15} className="w-full max-w-3xl">
            <div className="flex flex-col gap-5 sm:gap-6">
              {SKILL_GROUPS.map((group) => (
                <div
                  key={group.label}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-5"
                >
                  <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/40 sm:w-44 sm:shrink-0 sm:text-right">
                    {group.label}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#D7E2EA]/15 bg-[#D7E2EA]/[0.03] px-3 py-1 text-sm text-[#D7E2EA]/80 hover:border-[#D7E2EA]/40 hover:text-[#D7E2EA] transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
