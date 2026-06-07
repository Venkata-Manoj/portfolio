import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EDUCATION = [
  {
    id: 'btech',
    title: "B.Tech CSE (AI & Data Science)",
    institution: 'SIMATS Engineering / Saveetha University',
    image: '/SIMATS.jpeg',
    marks: '9.2 CGPA',
    year: '2024 – 2028',
    description:
      "Pursuing a Bachelor's degree in Computer Science with a specialization in Artificial Intelligence & Data Science. Focused on machine learning, deep learning, and full-stack development.",
  },
  {
    id: 'intermediate',
    title: 'Class XII (MPC)',
    institution: 'SR Junior College, Vijayawada',
    image: '/SR.jpeg',
    marks: '95.6%',
    year: '2022 – 2024',
    description:
      'Completed intermediate education with a focus on Mathematics, Physics, and Chemistry. Achieved top percentile in the board examinations.',
  },
]

function EducationCard({ item, index }) {
  const cardRef = useRef(null)
  const inView = useInView(cardRef, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(30,28,26,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(212,165,116,0.06)',
      }}
    >
      {/* Gold top streak */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-4/5 rounded-full z-10 transition-all duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.30), transparent)',
        }}
      />

      {/* Shimmer on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.04), transparent)',
          transform: 'skewX(-20deg)',
        }}
      />

      {/* Watermark number */}
      <span
        className="absolute top-[-0.05em] right-[0.05em] text-[7rem] font-black leading-none pointer-events-none select-none z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(212,165,116,0.06), rgba(166,124,82,0.06))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.04em',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Image */}
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={item.image}
          alt={item.institution}
          width="400"
          height="200"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,12,12,0.7)] via-transparent to-transparent" />
        {/* Year badge on image */}
        <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-[0.7rem] font-medium tracking-wider bg-[rgba(12,12,12,0.6)] backdrop-blur-sm border border-[rgba(212,165,116,0.1)] text-[rgba(212,165,116,0.7)]">
          {item.year}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8">
        <h3 className="text-lg sm:text-xl font-bold text-[#EDE7D9] mb-1 font-['Kanit'] leading-tight">
          {item.title}
        </h3>
        <p className="text-sm text-[rgba(212,165,116,0.6)] mb-3 font-medium">
          {item.institution}
        </p>
        <p className="text-[0.88rem] text-[rgba(237,231,217,0.45)] font-light leading-relaxed mb-4">
          {item.description}
        </p>
        {/* Marks highlight */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(212,165,116,0.12)] bg-[rgba(212,165,116,0.04)]">
          <span className="text-[0.65rem] uppercase tracking-[0.15em] text-[rgba(212,165,116,0.4)] font-medium">
            Marks
          </span>
          <span className="text-sm font-bold text-[#D4A574]">{item.marks}</span>
        </div>
      </div>

      {/* Inner shadow effect */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{
          boxShadow:
            'inset 0 0 40px rgba(212,165,116,0.06), 0 0 40px rgba(212,165,116,0.12), 0 0 80px rgba(212,165,116,0.05)',
        }}
      />
    </motion.div>
  )
}

export default function EducationSection() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })


  return (
    <section
      id="education"
      className="relative w-full overflow-hidden min-h-screen px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-36 bg-[#0C0C0C]"
    >
      {/* Ambient gold orbs */}
      <div
        className="pointer-events-none absolute top-[-120px] left-[-160px] w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,165,116,0.07), transparent)',
          filter: 'blur(120px)',
          animation: 'orbFloatSlow 8s ease-in-out infinite',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[-100px] right-[-140px] w-[450px] h-[450px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(196,149,106,0.06), transparent)',
          filter: 'blur(120px)',
          animation: 'orbFloatMedium 6s ease-in-out infinite',
        }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(196,149,106,0.06), transparent)',
          filter: 'blur(120px)',
          animation: 'orbFloatFast 4s ease-in-out infinite',
        }}
      />

      {/* Gold grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: 0.08,
          backgroundImage:
            'linear-gradient(rgba(212,165,116,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212,165,116,0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div ref={headerRef}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center text-[0.75rem] font-medium uppercase tracking-[0.3em] mb-1"
            style={{ color: 'rgba(212,165,116,0.50)' }}
          >
            My Journey
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center gap-6 mb-1"
          >
            <span
              className="flex-none h-[2px] rounded-full"
              style={{
                width: 140,
                background: 'linear-gradient(90deg, transparent, #D4A574, #A67C52)',
              }}
            />
            <h2
              className="font-['Kanit'] font-black uppercase leading-none tracking-[0.12em] whitespace-nowrap"
              style={{
                fontSize: 'clamp(2.25rem, 6vw, 4.5rem)',
                background: 'linear-gradient(135deg, #D4A574, #A67C52)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              EDUCATION
            </h2>
            <span
              className="flex-none h-[2px] rounded-full"
              style={{
                width: 140,
                background: 'linear-gradient(90deg, #A67C52, #D4A574, transparent)',
              }}
            />
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={headerInView ? { width: 80 } : {}}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-[3px] mx-auto rounded-full mb-5"
            style={{
              background: 'linear-gradient(90deg, #D4A574, #A67C52, #D4A574)',
              backgroundSize: '200% 100%',
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-[0.90rem] font-light tracking-[0.15em] mb-12 max-sm:mb-8"
            style={{ color: 'rgba(237,231,217,0.40)' }}
          >
            Academic background & achievements
          </motion.p>
        </div>

        {/* Education cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {EDUCATION.map((item, index) => (
            <EducationCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
