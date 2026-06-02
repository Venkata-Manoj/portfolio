import FadeIn from './FadeIn'

const EXPERTISE = [
  {
    number: '01',
    title: 'Generative AI & LLMs',
    description:
      'Building production-grade applications powered by large language models — from RAG pipelines and multi-LLM fallback chains to autonomous agents that summarise, analyse, and generate content at scale.',
  },
  {
    number: '02',
    title: 'Machine Learning & Data Science',
    description:
      'Developing end-to-end ML pipelines for classification, regression, and predictive modelling using XGBoost, scikit-learn, and PyTorch — with a focus on real-world deployment and interpretability.',
  },
  {
    number: '03',
    title: 'Full Stack Development',
    description:
      'Crafting responsive, performant web applications with React, Next.js, and Node.js — deployed seamlessly on Vercel with clean UI/UX and modern tooling.',
  },
  {
    number: '04',
    title: 'Retrieval-Augmented Generation',
    description:
      'Designing intelligent RAG engines that parse, chunk, index, and retrieve information from documents using FAISS, sentence-transformers, and Ollama — enabling question-answering over private knowledge bases.',
  },
  {
    number: '05',
    title: 'Reinforcement Learning & Simulation',
    description:
      'Building Gym-style environments for training AI agents in simulated scenarios — from IT incident response to autonomous decision-making with safety constraints.',
  },
]

export default function ExpertiseSection() {
  return (
    <section
      id="expertise"
      className="relative w-full bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <FadeIn y={40}>
        <h2
          className="text-center font-black uppercase text-[#0C0C0C] mb-16 sm:mb-20 md:mb-28 leading-none"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Expertise
        </h2>
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {EXPERTISE.map((item, i) => (
          <FadeIn key={item.number} delay={i * 0.1} y={30}>
            <div
              className="flex flex-row items-start gap-6 sm:gap-10 md:gap-14 py-8 sm:py-10 md:py-12"
              style={{
                borderTop: '1px solid rgba(12, 12, 12, 0.15)',
                ...(i === EXPERTISE.length - 1
                  ? { borderBottom: '1px solid rgba(12, 12, 12, 0.15)' }
                  : {}),
              }}
            >
              <div
                className="shrink-0 font-black text-[#0C0C0C] leading-none"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {item.number}
              </div>

              <div className="group flex flex-col gap-3 sm:gap-4 md:gap-5 pt-2 sm:pt-3 md:pt-4">
                <h3
                  className="font-medium uppercase text-[#0C0C0C] leading-tight relative inline-block w-fit"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {item.title}
                  <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#0C0C0C]/60 transition-all duration-500 group-hover:w-full" />
                </h3>
                <p
                  className="font-light leading-relaxed text-[#0C0C0C] max-w-2xl"
                  style={{
                    fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)',
                    opacity: 0.6,
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
