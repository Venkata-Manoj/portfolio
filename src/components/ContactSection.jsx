import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Linkedin, Github, Send, MapPin, User, ArrowUpRight } from 'lucide-react'

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'bsumanoj@gmail.com',
    href: 'mailto:bsumanoj@gmail.com',
    gradient: 'from-violet-500 to-purple-600',
    hoverGradient: 'group-hover:shadow-violet-500/20',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/venkata-manoj',
    href: 'https://linkedin.com/in/venkata-manoj',
    gradient: 'from-blue-500 to-blue-700',
    hoverGradient: 'group-hover:shadow-blue-500/20',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/Venkata-Manoj',
    href: 'https://github.com/Venkata-Manoj',
    gradient: 'from-gray-500 to-gray-700',
    hoverGradient: 'group-hover:shadow-gray-500/20',
  },
]

function ContactCard({ channel, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })

  return (
    <motion.a
      ref={ref}
      href={channel.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#141418]/60 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.15] hover:bg-[#1a1a24]/80 hover:shadow-lg overflow-hidden"
    >
      {/* Hover gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${channel.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${channel.gradient} bg-opacity-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
          style={{ backgroundOpacity: 0.1 }}
        >
          <channel.icon className="w-5 h-5 text-white" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-['Kanit'] font-semibold text-white/80 mb-1 group-hover:text-white transition-colors">
          {channel.label}
        </h3>
        <p className="text-xs text-white/40 font-light truncate">
          {channel.value}
        </p>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${channel.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-x-0 group-hover:scale-x-100 origin-left`} />
    </motion.a>
  )
}

export default function ContactSection() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section
      id="contact"
      className="relative z-10 w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-24 sm:py-28 md:py-36"
    >
      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-violet-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Section Heading */}
        <div ref={headerRef} className="text-center mb-16 sm:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="gradient-heading font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Get in Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-white/50 font-light mt-4"
          >
            Let's build something together
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Info card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col justify-between border border-white/[0.08] bg-[#141418]/60 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-2xl shadow-black/50"
          >
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Send className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-['Kanit'] font-bold text-white">Available for work</h3>
                  <p className="text-xs text-white/40 font-light">Open to opportunities</p>
                </div>
              </div>

              <div className="space-y-5 text-sm">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-white/20" />
                  <span className="text-white/30 w-20 text-xs">Name:</span>
                  <span className="text-white font-medium text-sm">Ballani Venkata Manoj</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-white/20" />
                  <span className="text-white/30 w-20 text-xs">Email:</span>
                  <a href="mailto:bsumanoj@gmail.com" className="text-violet-400 hover:text-violet-300 transition-colors text-sm">
                    bsumanoj@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-white/20" />
                  <span className="text-white/30 w-20 text-xs">Location:</span>
                  <span className="text-white/70 text-sm">Chennai, India</span>
                </div>
            </div>
          </div>

          {/* Visible spacer to prevent merged text */}
          <div className="h-4" />

          {/* Status badge */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/70 font-semibold">
                  Open to opportunities
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact channels grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CONTACT_CHANNELS.map((channel, i) => (
                <ContactCard key={channel.label} channel={channel} index={i} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mx-auto mt-20 sm:mt-24 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-white/30 tracking-widest font-light uppercase"
        >
          <span>© 2026 B V Manoj</span>
          <span>Built with React · AI & Data Science</span>
        </motion.div>
      </div>
    </section>
  )
}
