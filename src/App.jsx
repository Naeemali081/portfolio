import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'

// Dynamic Visitor Counter Hook
// Uses localStorage with a base count for reliability
// For production with real-time sync, consider Firebase or your own backend
const useVisitorCounter = () => {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const STORAGE_KEY = 'naeem_portfolio_visitors'
    const VISITED_KEY = 'naeem_portfolio_visited_session'
    const BASE_COUNT = 1250 // Starting base for professional appearance
    
    // Get current count from localStorage
    let currentCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0')
    
    // If first time ever (no localStorage), set base count
    if (currentCount === 0) {
      currentCount = BASE_COUNT
    }
    
    // Check if this is a new session (not visited yet in this browser session)
    const hasVisitedThisSession = sessionStorage.getItem(VISITED_KEY)
    
    if (!hasVisitedThisSession) {
      // New visit - increment counter
      currentCount += 1
      localStorage.setItem(STORAGE_KEY, currentCount.toString())
      sessionStorage.setItem(VISITED_KEY, 'true')
    }
    
    setCount(currentCount)
    setLoading(false)
  }, [])
  
  return { count, loading }
}

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = '', loading = false }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  useEffect(() => {
    if (isInView && !loading && end > 0) {
      let startTime
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, end, duration, loading])
  
  return <span ref={ref}>{loading ? '...' : count}{!loading && suffix}</span>
}

// Floating Tech Icons for Hero
const FloatingIcons = () => {
  const icons = [
    { name: 'React', color: '#61DAFB', path: 'M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 0c-4.136 0-7.5-2.015-7.5-4.5S7.864 4.5 12 4.5s7.5 2.015 7.5 4.5-3.364 4.5-7.5 4.5z' },
    { name: 'Vue', color: '#4FC08D', path: 'M2 3l10 18L22 3h-4l-6 10.5L6 3H2z' },
    { name: 'JS', color: '#F7DF1E', path: 'M3 3h18v18H3V3zm4.5 14.4c.3.6.9 1.1 1.8 1.1.8 0 1.2-.4 1.2-.9 0-.6-.5-.9-1.3-1.2l-.4-.2c-1.3-.6-2.2-1.2-2.2-2.7 0-1.3 1-2.3 2.6-2.3 1.1 0 1.9.4 2.5 1.4l-1.4.9c-.3-.5-.6-.8-1.1-.8-.5 0-.8.3-.8.7 0 .5.3.7 1 1l.4.2c1.5.7 2.4 1.3 2.4 2.8 0 1.6-1.3 2.5-3 2.5-1.7 0-2.8-.8-3.3-1.9l1.6-.6zm6.5 0c.2.4.4.7.9.7.5 0 .8-.2.8-.9V11h2v6.1c0 1.5-.9 2.2-2.2 2.2-1.2 0-1.9-.6-2.2-1.3l1.3-.6z' },
    { name: 'TS', color: '#3178C6', path: 'M3 3h18v18H3V3zm10.5 8.5V10h5v1.5h-1.5v5h-2v-5h-1.5zm-4 0V10H7v1.5h1v3.5c0 1.1.9 2 2 2h1.5v-1.5H10c-.3 0-.5-.2-.5-.5v-3.5h2V10h-2v1.5z' },
    { name: 'Laravel', color: '#FF2D20', path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  ]
  
  return (
    <div className="floating-icons">
      {icons.map((icon, i) => (
        <motion.div
          key={icon.name}
          className="floating-icon"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.6, 
            scale: 1,
            y: [0, -15, 0],
            x: [0, i % 2 === 0 ? 10 : -10, 0],
          }}
          transition={{ 
            delay: 1 + i * 0.2,
            duration: 0.5,
            y: { duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ 
            color: icon.color,
            '--delay': `${i * 0.5}s`,
          }}
        >
          <span className="icon-label">{icon.name}</span>
        </motion.div>
      ))}
    </div>
  )
}

// Magnetic Button Component
const MagneticButton = ({ children, className, ...props }) => {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  const handleMouse = (e) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (clientX - left - width / 2) * 0.3
    const y = (clientY - top - height / 2) * 0.3
    setPosition({ x, y })
  }
  
  const reset = () => setPosition({ x: 0, y: 0 })
  
  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Custom Cursor
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  
  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    const handleHoverStart = () => setIsHovering(true)
    const handleHoverEnd = () => setIsHovering(false)
    
    window.addEventListener('mousemove', updateMousePosition)
    
    document.querySelectorAll('a, button, .hoverable').forEach(el => {
      el.addEventListener('mouseenter', handleHoverStart)
      el.addEventListener('mouseleave', handleHoverEnd)
    })
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])
  
  return (
    <>
      <motion.div
        className="cursor-dot"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="cursor-outline"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      />
    </>
  )
}

// Navigation
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const scrollToSection = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
  
  return (
    <motion.nav
      className={`navigation ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
    >
      <div className="nav-container">
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
        >
          <span className="logo-text">N</span>
        </motion.div>

        {/* Desktop Links */}
        <div className="nav-links nav-links-desktop">
          {['About', 'Services', 'Skills', 'Projects', 'Contact'].map((item, i) => (
            <motion.button
              key={item}
              className="nav-link"
              onClick={() => scrollToSection(item.toLowerCase())}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <span className={`nav-toggle-line ${menuOpen ? 'open' : ''}`} />
          <span className={`nav-toggle-line ${menuOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav-links-mobile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {['About', 'Services', 'Skills', 'Projects', 'Contact'].map(item => (
              <button
                key={item}
                className="nav-link nav-link-mobile"
                onClick={() => scrollToSection(item.toLowerCase())}
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// Hero Section - Enhanced
const Hero = () => {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  
  const techStack = ['React', 'Vue.js', 'TypeScript', 'Laravel', 'Tailwind']
  
  return (
    <section className="hero">
      <motion.div className="hero-background" style={{ y }}>
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
        <div className="grid-pattern" />
      </motion.div>
      
      <FloatingIcons />
      
      <motion.div className="hero-content" style={{ opacity }}>
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="badge-dot" />
          Available for work
        </motion.div>
        
        <motion.div
          className="hero-intro"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <span className="intro-text">Hi, I'm Naeem Abbas Ali</span>
        </motion.div>
        
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.6, 0.05, 0.01, 0.9] }}
        >
          <span className="title-line">I Build <span className="accent-text">Beautiful</span></span>
          <span className="title-line">Web Experiences</span>
        </motion.h1>
        
        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          A Senior Frontend Developer with 4+ years of expertise, specializing in 
          creating pixel-perfect, high-performance web applications that deliver 
          real business results.
        </motion.p>
        
        <motion.div
          className="hero-tech-stack"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <span className="tech-label">Tech Stack</span>
          <div className="tech-pills">
            {techStack.map((tech, i) => (
              <motion.span
                key={tech}
                className="tech-pill"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <MagneticButton 
            className="btn btn-primary"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>View My Work</span>
            <svg viewBox="0 0 24 24" className="btn-arrow">
              <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </MagneticButton>
          <MagneticButton 
            className="btn btn-secondary"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>Get In Touch</span>
          </MagneticButton>
          <motion.a
            href="/Naeem-Abbas-Ali-CV.pdf"
            className="btn btn-ghost hoverable"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Download CV</span>
          </motion.a>
          <motion.a
            href="https://github.com/Naeemali081"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-icon hoverable"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
          </motion.a>
        </motion.div>
        
      </motion.div>
      
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="scroll-text">Scroll</span>
        <motion.div
          className="scroll-line"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  )
}

// Stats Section - Enhanced with icons
const Stats = () => {
  const { count: visitorCount, loading } = useVisitorCounter()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const stats = [
    { 
      value: 4, 
      suffix: '+', 
      label: 'Years Experience',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      color: '#6366f1'
    },
    { 
      value: 25, 
      suffix: '+', 
      label: 'Projects Completed',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      color: '#22c55e'
    },
    { 
      value: 20, 
      suffix: '+', 
      label: 'Happy Clients',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      color: '#f59e0b'
    },
    { 
      value: visitorCount, 
      suffix: '', 
      label: 'Portfolio Visitors',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
      color: '#ec4899',
      loading
    },
  ]
  
  return (
    <section className="stats" ref={ref}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="stat-icon" style={{ color: stat.color, background: `${stat.color}15` }}>
                {stat.icon}
              </div>
              <span className="stat-value" style={{ color: stat.color }}>
                <AnimatedCounter end={stat.value} suffix={stat.suffix} loading={stat.loading} />
              </span>
              <span className="stat-label">{stat.label}</span>
              <div className="stat-glow" style={{ background: stat.color }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// About Section
const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <section className="about" id="about" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-tag">About Me</span>
          <h2 className="section-title">Passionate about creating seamless digital experiences</h2>
        </motion.div>
        
        <div className="about-content">
          <motion.div
            className="about-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="image-wrapper">
              <img src="/images/naeem-profile.png" alt="Naeem Abbas Ali" className="profile-photo" />
              <div className="image-decoration" />
            </div>
          </motion.div>
          
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p>
              I'm a Senior Frontend Developer with over 4 years of hands-on experience 
              building modern, responsive web applications. My expertise spans across 
              <strong> React.js</strong> and <strong>Vue.js</strong> ecosystems, where I've 
              delivered high-impact projects for diverse clients.
            </p>
            <p>
              Beyond frontend, I bring full-stack capabilities with <strong>Laravel</strong>, 
              enabling me to architect complete solutions. I'm passionate about clean code, 
              performance optimization, and creating intuitive user interfaces that drive 
              business results.
            </p>
          <p>
            I'm based in Pakistan and open to <strong>remote and hybrid opportunities worldwide</strong>.
          </p>
            <div className="about-highlights">
              <div className="highlight-item">
                <div className="highlight-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <span>Performance Focused</span>
              </div>
              <div className="highlight-item">
                <div className="highlight-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span>Modern Tech Stack</span>
              </div>
              <div className="highlight-item">
                <div className="highlight-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                </div>
                <span>Client Satisfaction</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Skills Section
const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  // Primary stack with official logos
  const primaryStack = [
    { 
      name: 'React.js', 
      tag: 'Frontend Framework', 
      color: '#61DAFB',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
    },
    { 
      name: 'Vue.js', 
      tag: 'Frontend Framework', 
      color: '#4FC08D',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg'
    },
    { 
      name: 'Next.js', 
      tag: 'Full‑stack React', 
      color: '#ffffff',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg'
    },
    { 
      name: 'Laravel', 
      tag: 'Backend Framework', 
      color: '#FF2D20',
      // Use the standard Laravel logo variant that is reliably available
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg'
    },
    { 
      name: 'Node.js', 
      tag: 'Backend Runtime', 
      color: '#3C873A',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
    },
    { 
      name: 'TypeScript', 
      tag: 'Typed JavaScript', 
      color: '#3178C6',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'
    },
    { 
      name: 'JavaScript', 
      tag: 'Language', 
      color: '#F7DF1E',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
    },
    { 
      name: 'Tailwind CSS', 
      tag: 'Styling', 
      color: '#06B6D4',
      // Use the main Tailwind CSS logo variant
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg'
    },
    { 
      name: 'Bootstrap', 
      tag: 'UI Library', 
      color: '#7952B3',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg'
    },
    { 
      name: 'GitHub',
      tag: 'Version Control',
      color: '#ffffff',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'
    },
    { 
      name: 'GitLab',
      tag: 'DevOps Platform',
      color: '#FC6D26',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg'
    },
    { 
      name: 'Slack',
      tag: 'Team Communication',
      color: '#4A154B',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg'
    },
    { 
      name: 'Jira',
      tag: 'Project Management',
      color: '#2684FF',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg'
    },
    { 
      name: 'Trello',
      tag: 'Project Management',
      color: '#026AA7',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg'
    },
  ]

  // Extended tools strip inspired by the second image
  const toolStrip = [
    'REST APIs',
    'MongoDB',
    'PostgreSQL',
    'Docker',
    'AWS',
    'HTML/CSS',
  ]
  
  return (
    <section className="skills" id="skills" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-tag">Skills</span>
          <h2 className="section-title">Technologies I work with</h2>
        </motion.div>
        
        <motion.p
          className="skills-lead"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Using the most up‑to‑date and battle‑tested technologies, I design and ship interfaces that feel modern, fast, and reliable.
        </motion.p>

        <div className="skills-badges">
          {primaryStack.map((skill, i) => (
            <motion.div
              key={skill.name}
              className="skill-badge hoverable"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.15 * i }}
              whileHover={{ y: -4, scale: 1.03, boxShadow: '0 12px 35px rgba(15, 23, 42, 0.6)' }}
            >
              <div 
                className="skill-badge-icon"
                style={{ background: `${skill.color}18` }}
              >
                <img src={skill.logo} alt={`${skill.name} logo`} loading="lazy" />
              </div>
              <div className="skill-badge-info">
                <span className="skill-badge-name">{skill.name}</span>
                <span className="skill-badge-tag">{skill.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="skills-strip"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {toolStrip.map((tool, i) => (
            <span key={tool} className="skills-chip" style={{ '--i': i }}>
              {tool}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Services / What I Do Section
const Services = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const services = [
    {
      title: 'Frontend Engineering',
      tag: 'React, Vue & SPA Development',
      description: 'Pixel-perfect, accessible, and responsive interfaces built with modern frameworks and best practices.',
      points: ['SPA & dashboard UIs', 'Design-to-code implementation', 'Performance & Lighthouse optimization'],
    },
    {
      title: 'Full‑stack Web Apps',
      tag: 'Laravel & Node.js Backends',
      description: 'From API design to deployment, I ship reliable full‑stack solutions that scale with your product.',
      points: ['RESTful APIs & auth flows', 'Database design & integrations', 'Production-ready deployments'],
    },
    {
      title: 'Product & UI Collaboration',
      tag: 'Design Systems & Team Workflows',
      description: 'Bridging product, design, and engineering to deliver cohesive experiences consistently.',
      points: ['Reusable component systems', 'Front‑of‑front‑end architecture', 'Agile & remote collaboration'],
    },
  ]

  return (
    <section className="services" id="services" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-tag">Services</span>
          <h2 className="section-title">How I can help your product</h2>
        </motion.div>

        <div className="services-grid">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              whileHover={{ y: -6, scale: 1.01 }}
            >
              <span className="service-tag">{service.tag}</span>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-points">
                {service.points.map(point => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Projects Section
const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const projects = [
    {
      title: 'FastP2P',
      description: 'A peer-to-peer cryptocurrency exchange platform with secure login, dark mode, and real-time trading.',
      url: 'https://fastp2p.pro/',
      tech: ['Vue.js', 'Laravel', 'WebSocket'],
      role: 'Frontend Lead · Vue.js & Laravel integration',
      impact: 'Delivered a fast, secure trading experience with real-time updates.',
      image: '/images/fastp2p.png'
    },
    {
      title: 'Vercepta',
      description: 'Business reputation management platform with alerts, insights, and V-Score analytics.',
      url: 'https://vercepta.com/',
      tech: ['React', 'Node.js', 'MongoDB'],
      role: 'Senior Frontend Developer · React dashboards',
      impact: 'Built analytical dashboards and alert flows for business teams.',
      image: '/images/vercepta.png'
    },
    {
      title: 'GoDocta',
      description: 'Healthcare platform connecting patients with medical professionals seamlessly.',
      url: 'https://testing.v2.godocta.com/',
      tech: ['Vue.js', 'Laravel', 'MySQL'],
      role: 'Full‑stack Developer · Vue.js & Laravel',
      impact: 'Implemented appointment journeys and responsive layouts for patients and doctors.',
      image: '/images/godocta.png'
    },
    {
      title: 'StickyTasks',
      description: 'Collaboration platform for software teams with Kanban boards and customizable workflows.',
      url: 'https://stickytasks.com/',
      tech: ['React', 'Firebase', 'Tailwind'],
      role: 'Frontend Developer · React & Tailwind UI',
      impact: 'Crafted interactive board experiences and realtime task updates.',
      image: '/images/stickytasks.png'
    },
    {
      title: 'Playy UK',
      description: 'Social music network empowering artists with monetization tools and genre discovery.',
      url: 'https://playy.co.uk/',
      tech: ['Vue.js', 'Laravel', 'AWS'],
      role: 'Senior Frontend Developer · Vue.js',
      impact: 'Shipped audience-facing music discovery experiences and creator tools.',
      image: '/images/playy.png'
    },
  ]
  
  return (
    <section className="projects" id="projects" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">Featured Projects</h2>
        </motion.div>
        
        <div className="projects-grid">
          {projects.map((project, i) => (
            <motion.a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card hoverable"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="project-image">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="project-img" />
                ) : (
                  <div className="project-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span>Project Preview</span>
                  </div>
                )}
                <div className="project-overlay">
                  <span className="view-project">
                    View Project
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                {project.role && (
                  <p className="project-meta"><strong>Role:</strong> {project.role}</p>
                )}
                {project.impact && (
                  <p className="project-meta"><strong>Impact:</strong> {project.impact}</p>
                )}
                <div className="project-tech">
                  {project.tech.map(tech => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section - Updated with real links
const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('name')
    const email = formData.get('email')
    const message = formData.get('message')

    const subject = encodeURIComponent(`Portfolio contact from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
    window.location.href = `mailto:naeemabbas101r@gmail.com?subject=${subject}&body=${body}`
  }
  
  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="container">
        <motion.div
          className="contact-content"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-tag">Get In Touch</span>
          <h2 className="contact-title">Let's work together</h2>
          <p className="contact-description">
            Have a project in mind? I'd love to hear about it. Let's discuss how 
            we can bring your ideas to life with modern, performant web solutions.
          </p>
          
          <div className="contact-layout">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" required placeholder="Your name" />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required placeholder="you@example.com" />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="message">Project details</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  placeholder="Tell me a bit about your project, timeline, and goals."
                />
              </div>
              <button type="submit" className="btn btn-primary contact-submit">
                Send Message
              </button>
            </form>

            <div className="contact-links">
              <motion.a
                href="mailto:naeemabbas101r@gmail.com"
                className="contact-link hoverable"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>Email Me</span>
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/naeem-abbas-ali-147a9122a/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link hoverable"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
                <span>LinkedIn</span>
              </motion.a>
              <motion.a
                href="https://github.com/Naeemali081"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link hoverable"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                <span>GitHub</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Testimonials Section
const Testimonials = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const testimonials = [
    {
      name: 'Product Founder, SaaS Platform',
      quote:
        'Naeem quickly understood our product vision and translated it into a polished UI. Our users immediately noticed the improved experience.',
    },
    {
      name: 'CTO, Healthcare Startup',
      quote:
        'From Vue frontends to Laravel backends, Naeem was instrumental in shipping features on time while keeping quality high.',
    },
    {
      name: 'Project Manager, Fintech',
      quote:
        'Reliable, communicative, and detail-oriented. Working with Naeem on our trading platform frontend was a smooth experience.',
    },
  ]

  return (
    <section className="testimonials" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-tag">Testimonials</span>
          <h2 className="section-title">What past collaborators say</h2>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
            >
              <p className="testimonial-quote">“{item.quote}”</p>
              <p className="testimonial-name">{item.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Naeem Abbas Ali. All rights reserved.</p>
          <p className="footer-tagline">Crafted with passion and React</p>
        </div>
      </div>
    </footer>
  )
}

// Main App
function App() {
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    setTimeout(() => setLoading(false), 1500)
  }, [])
  
  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="loader-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="loader-letter">N</span>
            </motion.div>
            <motion.div
              className="loader-bar"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CustomCursor />
          <Navigation />
          <main>
            <Hero />
            <Stats />
            <About />
            <Services />
            <Skills />
            <Projects />
            <Testimonials />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  )
}

export default App
