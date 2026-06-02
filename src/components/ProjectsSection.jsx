import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'
import FadeIn from './FadeIn'

const PROJECTS = [
  {
    number: '01',
    category: 'Media · Python',
    name: 'VideoReverse',
    desc: 'High-performance media utility for reversing, processing, and manipulating video streams with optimized frame extraction.',
    github: 'https://github.com/Venkata-Manoj/videoreverse',
    live: null,
  },
  {
    number: '02',
    category: 'AI · Automation',
    name: 'AI-News-Bot',
    desc: 'Autonomous Telegram news aggregator with a 6-LLM fallback chain that scrapes, filters, and formats breaking tech news every 45 minutes.',
    github: 'https://github.com/Venkata-Manoj/AI-News-Bot',
    live: null,
  },
  {
    number: '03',
    category: 'Reinforcement Learning',
    name: 'Resilience-Ops-Env',
    desc: 'Gym-style RL environment simulating IT system incidents for training AI agents in incident response and recovery procedures.',
    github: 'https://github.com/Venkata-Manoj/Resilience-Ops-Env',
    live: null,
  },
  {
    number: '04',
    category: 'Web · GenAI',
    name: 'WhatIF',
    desc: 'AI-powered UI component analysis platform that audits web interfaces for design alignment, accessibility, and visual compliance.',
    github: 'https://github.com/Venkata-Manoj/WhatIF',
    live: 'https://what-if-henna.vercel.app',
  },
  {
    number: '05',
    category: 'RAG · Python',
    name: 'Capstone-Forage',
    desc: 'Intelligent RAG engine that parses, chunks, and indexes PDFs/DOCX to generate comprehensive summary reports.',
    github: 'https://github.com/Venkata-Manoj/Capstone-Forage',
    live: null,
  },
  {
    number: '06',
    category: 'ML · XGBoost',
    name: 'Student Performance Predictor',
    desc: 'XGBoost-based pipeline predicting student academic outcomes from demographic and test data with a deployed web interface.',
    github: 'https://github.com/Venkata-Manoj/Student-Performance-Predictor',
    live: 'https://student-performance-predictor-orpin.vercel.app',
  },
  {
    number: '07',
    category: 'Mobile · Web',
    name: 'Flip2Function',
    desc: 'Orientation-aware mobile web app using DeviceOrientation API to bind phone movements to browser-side triggers.',
    github: 'https://github.com/Venkata-Manoj/Flip2Function',
    live: 'https://v0-no-content-hazel-nu.vercel.app',
  },
  {
    number: '08',
    category: 'React · Web',
    name: 'Habit-Zen-Web',
    desc: 'Minimalist habit tracker with streak building, AI-generated routine suggestions, and local-storage persistence.',
    github: 'https://github.com/Venkata-Manoj/Habit-Zen-Web',
    live: 'https://habit-zen-umber.vercel.app',
  },
]

function ProjectCard({ project, index, total }) {
  const cardRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  })
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])

  return (
    <div
      ref={cardRef}
      className="sticky h-[85vh] w-full"
      style={{ top: `${120 + index * 28}px` }}
    >
      <motion.article
        style={{ scale }}
        className="origin-top mx-auto h-full w-full flex flex-col gap-4 sm:gap-6 md:gap-8 rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4 sm:gap-6 flex-1">
          <div className="flex flex-row items-start gap-3 sm:gap-6 md:gap-10 min-w-0 w-full">
            <div
              className="shrink-0 font-black text-[#D7E2EA] leading-none"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 140px)' }}
            >
              {project.number}
            </div>
            <div className="flex flex-col gap-1 sm:gap-3 pt-1 sm:pt-3 md:pt-4 min-w-0 flex-1">
              <span
                className="font-light uppercase tracking-widest text-[#D7E2EA]/60"
                style={{ fontSize: 'clamp(0.65rem, 1.2vw, 1rem)' }}
              >
                {project.category}
              </span>
              <h3
                className="font-medium uppercase text-[#D7E2EA] leading-tight"
                style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2.1rem)' }}
              >
                {project.name}
              </h3>
              <p
                className="font-light text-[#D7E2EA]/70 mt-2 max-w-xl"
                style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)' }}
              >
                {project.desc}
              </p>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-auto pt-1 sm:pt-2 md:pt-3 flex gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#D7E2EA]/40 p-3 text-[#D7E2EA]/70 transition-colors duration-200 hover:bg-[#D7E2EA]/10 hover:border-[#D7E2EA]"
              title="View on GitHub"
            >
              <Github size={20} />
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#D7E2EA] px-6 py-3 text-xs sm:text-sm font-medium uppercase tracking-widest text-[#D7E2EA] whitespace-nowrap transition-colors duration-200 hover:bg-[#D7E2EA]/10"
              >
                <ExternalLink size={16} className="mr-2" />
                Live
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </div>
  )
}

export default function ProjectsSection() {
  const containerRef = useRef(null)

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 sm:-mt-12 md:-mt-14 w-full rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] bg-[#0C0C0C] px-4 sm:px-6 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-24"
    >
      <FadeIn y={40}>
        <h2
          className="hero-heading text-center font-black uppercase tracking-tight leading-none mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Projects
        </h2>
      </FadeIn>

      <div ref={containerRef} className="mx-auto max-w-7xl">
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={i}
            total={PROJECTS.length}
          />
        ))}
      </div>
    </section>
  )
}
