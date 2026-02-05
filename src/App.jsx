import { useState } from 'react';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import ExperienceModal from './components/ExperienceModal';
import ShaderHero from './components/ShaderHero';
import About from './components/About';
import TextReveal from './components/TextReveal';
import SocialButtons from './components/SocialButtons';
import FadeIn from './components/FadeIn';
import StaggerFadeIn from './components/StaggerFadeIn';
import ContactForm from './components/ContactForm';

function App() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <SmoothScroll>
      <Navbar />
      <ExperienceModal onStart={() => setHasStarted(true)} />

      {/* Background is now outside main-content to show behind modal */}
      <ShaderHero />

      <main className={`main-content ${hasStarted ? 'started' : ''}`}>
        {/* HERO SECTION - REPLICATING "LOCKED AWAY" DESIGN */}
        <section id="home" className="hero hero-vibe">
          <div className="container hero-container">
            <div className="typography-design">
              {/* Line 1: Full-Stack */}
              <div className="text-line line-1">
                {/* Top-center annotation */}
                <div className="annotation top-center-ann">
                  <span className="annotation-text">"logic"</span>
                  <div className="annotation-line"></div>
                </div>

                <h1 className="main-word">Full-Stack</h1>

                {/* Top-left annotation */}
                <div className="annotation top-left-ann">
                  <span className="annotation-text">"Java backend"</span>
                  <div className="annotation-line diag-line"></div>
                </div>

                {/* Top-right annotation */}
                <div className="annotation ligature">
                  <div className="annotation-line"></div>
                  <span className="annotation-text">"RESTful APIs"</span>
                </div>


              </div>

              {/* Animated Bubbles */}
              <div className="hero-bubbles">
                <div className="bubble bubble-1"></div>
                <div className="bubble bubble-2"></div>
                <div className="bubble bubble-3"></div>
                <div className="bubble bubble-4"></div>
                <div className="bubble bubble-5"></div>
              </div>

              {/* Line 2: Developer */}
              <div className="text-line line-2">
                {/* Left annotation */}
                <div className="annotation alternate-left">
                  <div className="annotation-line"></div>
                  <span className="annotation-text">"JavaScript frontends"</span>
                </div>

                <h1 className="main-word">Developer</h1>

                {/* Bottom-center annotation */}
                <div className="annotation bottom-center-ann">
                  <div className="annotation-line"></div>
                  <span className="annotation-text">"CI/CD"</span>
                </div>

                {/* Right annotation */}
                <div className="annotation alternate-right">
                  <div className="annotation-line"></div>
                  <span className="annotation-text">"databases"</span>
                </div>
              </div>

              {/* Subtext */}
              <FadeIn delay={0.8} className="hero-description">
                <p>Building modern web experiences</p>
                <p>with cutting-edge technologies</p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <About />

        {/* TECH STACK SECTION */}
        <section id="tech-stack" className="tech-stack">
          <div className="container">
            <FadeIn>
              <h2 className="section-title">01 / Tech Stack</h2>
            </FadeIn>
            <StaggerFadeIn className="tech-grid" staggerDelay={0.15}>
              <FadeIn delay={0.2}>
                <div className="tech-category">
                  <h3 className="category-title">Frontend</h3>
                  <div className="tech-items">
                    <div className="tech-item">React</div>
                    <div className="tech-item">Next.js</div>
                    <div className="tech-item">TypeScript</div>
                    <div className="tech-item">Tailwind CSS</div>
                    <div className="tech-item">GSAP</div>
                    <div className="tech-item">Three.js</div>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="tech-category">
                  <h3 className="category-title">Backend</h3>
                  <div className="tech-items">
                    <div className="tech-item">Node.js</div>
                    <div className="tech-item">Express</div>
                    <div className="tech-item">MongoDB</div>
                    <div className="tech-item">PostgreSQL</div>
                    <div className="tech-item">Firebase</div>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="tech-category">
                  <h3 className="category-title">Tools & Others</h3>
                  <div className="tech-items">
                    <div className="tech-item">Git</div>
                    <div className="tech-item">Docker</div>
                    <div className="tech-item">Figma</div>
                    <div className="tech-item">Blender</div>
                    <div className="tech-item">WebGL</div>
                  </div>
                </div>
              </FadeIn>
            </StaggerFadeIn>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="projects">
          <div className="container">
            <FadeIn>
              <h2 className="section-title">02 / Selected Works</h2>
            </FadeIn>
            <StaggerFadeIn className="project-list" staggerDelay={0.2}>
              {[
                { name: 'Motion Identity', cat: 'Interaction Design' },
                { name: 'Vortex System', cat: 'WebGL / Shader' },
                { name: 'Orias Portal', cat: 'Creative Dev' }
              ].map((proj, i) => (
                <div key={i} className="project-item">
                  <span className="project-num">0{i + 1}</span>
                  <TextReveal className="project-name">{proj.name}</TextReveal>
                  <span className="project-category">{proj.cat}</span>
                </div>
              ))}
            </StaggerFadeIn>

            {/* Social Media Buttons with Bubble Animation */}
            <FadeIn delay={0.3}>
              <SocialButtons />
            </FadeIn>
          </div>
        </section>

        {/* CONTACT / MESSAGE SECTION */}
        <ContactForm />

        {/* FOOTER */}
        <footer className="footer-cinematic">
          <div className="footer-bg-bubbles">
            <div className="footer-bubble"></div>
            <div className="footer-bubble"></div>
          </div>

        </footer>
      </main>

      <style>{`
        section, .footer-cinematic {
          position: relative; /* Ensure children like ScrollTrigger work well */
          z-index: 2;
        }

        .footer-cinematic {
          padding: 2rem 0;
          background: #0a0a0f !important;
          overflow: hidden;
          position: relative;
          z-index: 10;
        }

        .footer-bg-bubbles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          display: none;
        }

        .footer-bubble {
          position: absolute;
          border-radius: 50%;
          background: transparent;
          filter: blur(60px);
        }

        .footer-bubble:nth-child(1) { width: 600px; height: 600px; top: -200px; right: -200px; }
        .footer-bubble:nth-child(2) { width: 500px; height: 500px; bottom: -100px; left: -100px; opacity: 0.5; }

        .footer-bottom {
          width: 100%;
          padding: 1rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          z-index: 3;
        }

        .footer-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--secondary-text);
        }

        .mail-link {
          color: white;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .mail-link:hover {
          color: var(--accent-color);
        }

        .main-content {
          opacity: 0;
          transition: opacity 2s ease;
        }
        
        .main-content.started {
          opacity: 1;
        }
        
        .hero-vibe {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, rgba(168, 85, 247, 0.15) 0%, transparent 70%); /* Purple tint */
          position: relative;
          color: #f8f8f8;
          overflow: hidden;
        }

        .hero-container {
          max-width: 1200px;
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 5;
        }

        .typography-design {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          filter: drop-shadow(0 0 50px rgba(0,0,0,0.5));
        }

        .main-word {
          font-family: 'Caprasimo', serif;
          font-size: clamp(2.5rem, 6vw, 5.5rem);
          font-weight: 400; /* Caprasimo is naturally heavy */
          line-height: 0.88;
          letter-spacing: -0.04em;
          margin: 0;
          z-index: 2;
          color: #fff9f0;
          text-shadow: 0 10px 40px rgba(0,0,0,0.4);
          will-change: transform;
        }

        .text-line {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: fit-content;
        }

        .line-1 {
          margin-bottom: -0.2vw;
          z-index: 3;
        }

        /* Annotations */
        .annotation {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fff9f0;
          opacity: 0.6;
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 300;
          pointer-events: none;
          white-space: nowrap;
          letter-spacing: 0.05em;
        }

        .ligature {
          top: -22%;
          right: -12%;
          flex-direction: row;
          align-items: center;
        }

        .annotation-line {
          width: 45px;
          height: 1.5px;
          background: rgba(255, 255, 255, 0.6);
        }

        .alternate-left {
          left: -35%;
          top: 48%;
          flex-direction: row-reverse;
          align-items: center;
        }

        .alternate-right {
          right: -24%;
          top: 48%;
          flex-direction: row;
          align-items: center;
        }
        
        /* New annotation positions for Full-Stack */
        .top-left-ann {
          top: -30%;
          left: -21%;
          flex-direction: row;
          align-items: center;
        }
        
        .diag-line {
          transform: rotate(45deg);
          transform-origin: left center;
          width: 25px;
        }
        

        
        /* New annotation positions for Developer */
        .top-center-ann {
          top: -35%;
          left: 50%;
          transform: translateX(-50%);
          flex-direction: column;
          align-items: center;
        }
        
        .bottom-center-ann {
          bottom: -40%;
          left: 50%;
          transform: translateX(-50%);
          flex-direction: column;
          align-items: center;
        }

        .annotation-curve {
          width: 50px;
          height: 50px;
          opacity: 0.7;
        }
        
        .curve-left { 
          transform: rotate(-8deg) translateY(6px); 
        }
        .curve-right { 
          transform: rotate(8deg) translateY(6px); 
        }

        .hero-description {
          margin-top: 3rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 0.04em;
          line-height: 1.4;
          text-transform: lowercase;
        }

        /* Animated Bubbles */
        .hero-bubbles {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 1;
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(186, 85, 211, 0.15), rgba(138, 43, 226, 0.1));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 8px 32px 0 rgba(31, 38, 135, 0.2),
            inset 0 0 20px rgba(255, 255, 255, 0.05);
        }

        .bubble-1 {
          width: 120px;
          height: 120px;
          top: -10%;
          left: 15%;
          animation: slideFloat1 8s ease-in-out infinite;
        }

        .bubble-2 {
          width: 80px;
          height: 80px;
          top: 20%;
          right: 10%;
          animation: slideFloat2 10s ease-in-out infinite;
        }

        .bubble-3 {
          width: 150px;
          height: 150px;
          bottom: 5%;
          left: -5%;
          animation: slideFloat3 12s ease-in-out infinite;
        }

        .bubble-4 {
          width: 60px;
          height: 60px;
          top: 50%;
          right: -3%;
          animation: slideFloat4 9s ease-in-out infinite;
        }

        .bubble-5 {
          width: 100px;
          height: 100px;
          bottom: 15%;
          right: 20%;
          animation: slideFloat5 11s ease-in-out infinite;
        }

        @keyframes slideFloat1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(20px, -30px) scale(1.1);
            opacity: 0.5;
          }
          50% {
            transform: translate(40px, -10px) scale(0.9);
            opacity: 0.4;
          }
          75% {
            transform: translate(15px, 20px) scale(1.05);
            opacity: 0.35;
          }
        }

        @keyframes slideFloat2 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.4;
          }
          33% {
            transform: translate(-25px, 30px) rotate(120deg);
            opacity: 0.6;
          }
          66% {
            transform: translate(-10px, -15px) rotate(240deg);
            opacity: 0.45;
          }
        }

        @keyframes slideFloat3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.25;
          }
          30% {
            transform: translate(30px, -20px) scale(1.15);
            opacity: 0.4;
          }
          60% {
            transform: translate(-15px, -40px) scale(0.95);
            opacity: 0.35;
          }
        }

        @keyframes slideFloat4 {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.5;
          }
          40% {
            transform: translate(-30px, -25px);
            opacity: 0.7;
          }
          80% {
            transform: translate(10px, 15px);
            opacity: 0.55;
          }
        }

        @keyframes slideFloat5 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0.35;
          }
          25% {
            transform: translate(-20px, -35px) rotate(90deg) scale(1.1);
            opacity: 0.5;
          }
          50% {
            transform: translate(15px, -20px) rotate(180deg) scale(0.9);
            opacity: 0.45;
          }
          75% {
            transform: translate(-10px, 25px) rotate(270deg) scale(1.05);
            opacity: 0.4;
          }
        }

        /* Sparkles */
        .sparkle {
          position: absolute;
          color: #ffffff;
          display: flex;
          gap: 4px;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
        }

        .sparkle svg {
          width: 20px;
          height: 20px;
        }

        .sparkle svg.small {
          width: 10px;
          height: 10px;
          align-self: flex-start;
          margin-top: 3px;
        }

        .top-left {
          top: -20%;
          left: -8%;
          flex-direction: row;
        }

        .bottom-right {
          bottom: 12%;
          right: -8%;
          flex-direction: row-reverse;
        }

        @media (max-width: 768px) {
          .main-word {
            font-size: 5rem;
          }
          .annotation {
            display: none; /* Hide on small screens to avoid clutter */
          }
          .hero-description {
            font-size: 0.9rem;
            margin-top: 2rem;
          }
          .sparkle svg {
            width: 20px;
            height: 20px;
          }
        }
        
        .hero {
          height: 100vh;
          display: flex;
          align-items: center;
          background: transparent;
        }
        
        .hero-title {
          font-size: clamp(4rem, 12vw, 8rem);
          line-height: 0.9;
          font-weight: 800;
          display: flex;
          flex-direction: column;
        }
        
        .hero-footer {
          margin-top: 4rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        
        .scroll-hint {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          opacity: 0.5;
        }
        
        .section-title {
          font-size: 0.8rem;
          letter-spacing: 0.3em;
          color: var(--accent-color);
          margin-bottom: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .tech-stack {
          padding: 8rem 0;
        }
        
        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .tech-category {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .tech-category:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .category-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--accent-color);
          margin-bottom: 1.5rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        
        .tech-items {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
        }
        
        .tech-item {
          padding: 0.6rem 1.2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .tech-item:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--accent-color);
          color: #ffffff;
          transform: translateY(-2px);
        }
        
        
        .large-text {
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          line-height: 1.2;
          max-width: 900px;
        }
        
        .project-item {
          display: flex;
          align-items: baseline;
          padding: 2rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          gap: 2rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        
        .project-item:hover {
          color: var(--accent-color);
        }
        
        .project-num {
          font-size: 0.8rem;
          font-family: var(--font-heading);
          opacity: 0.5;
        }
        
        .project-name {
          font-size: clamp(1rem, 2.5vw, 1.6rem);
          flex: 1;
        }
        
        .link-hover {
  position: relative;
  overflow: hidden;
}

.link-hover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--accent-color);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.link-hover:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

        /* Responsive Optimizations */
        @media (max-width: 1024px) {
          .hero-title {
            font-size: clamp(3.5rem, 10vw, 6rem);
          }
          .container {
            padding: 0 6vw;
          }
        }

        @media (max-width: 768px) {
          .hero-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
            margin-top: 2rem;
          }
          
          .scroll-hint {
            display: none;
          }

          .tech-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Adjusted minmax */
            gap: 1.5rem;
          }

          .project-item {
            flex-direction: column;
            gap: 0.5rem;
            padding: 1.5rem 0;
          }

          .project-name {
            font-size: 1.8rem;
          }

          .footer-cinematic {
            padding: 10vh 0 5vh;
          }

          .footer-content-left {
            margin-bottom: 4rem;
          }

          .hero-title {
            font-size: 3.5rem;
          }

          .large-text {
            font-size: 1.5rem;
          }

          .footer-info {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2.8rem;
          }

          .tech-category {
            padding: 1.5rem;
          }

          .tech-item {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </SmoothScroll >
  );
}

export default App;
