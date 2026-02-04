import { useState } from 'react';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import ExperienceModal from './components/ExperienceModal';
import ShaderHero from './components/ShaderHero';
import About from './components/About';
import TextReveal from './components/TextReveal';
import SocialButtons from './components/SocialButtons';

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
              {/* Top Sparkle */}
              <div className="sparkle top-left">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className="small">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>

              {/* Line 1: Locked */}
              <div className="text-line line-1">
                <h1 className="main-word">Locked</h1>
                <div className="annotation ligature">
                  <div className="annotation-line"></div>
                  <span className="annotation-text">"ligature"</span>
                </div>
              </div>

              {/* Line 2: Away */}
              <div className="text-line line-2">
                <div className="annotation alternate-left">
                  <span className="annotation-text">"alternate"</span>
                  <div className="annotation-curve curve-left">
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M100 10 C 50 10, 10 50, 10 90" />
                    </svg>
                  </div>
                </div>

                <h1 className="main-word">Away</h1>

                <div className="annotation alternate-right">
                  <div className="annotation-curve curve-right">
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M0 10 C 50 10, 90 50, 90 90" />
                    </svg>
                  </div>
                  <span className="annotation-text">"alternate"</span>
                </div>

                {/* Bottom Sparkle */}
                <div className="sparkle bottom-right">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="small">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                </div>
              </div>

              {/* Subtext */}
              <div className="hero-description">
                <p>a new design serif font</p>
                <p>with stylistic alternates</p>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <About />

        {/* TECH STACK SECTION */}
        <section id="tech-stack" className="tech-stack">
          <div className="container">
            <h2 className="section-title">01 / Tech Stack</h2>
            <div className="tech-grid">
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
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="projects">
          <div className="container">
            <h2 className="section-title">02 / Selected Works</h2>
            <div className="project-list">
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
            </div>

            {/* Social Media Buttons with Bubble Animation */}
            <SocialButtons />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer-cinematic">
          <div className="footer-bg-bubbles">
            <div className="footer-bubble"></div>
            <div className="footer-bubble"></div>
          </div>

          <div className="container footer-content-left">
            <div className="footer-text-wrapper">
              <TextReveal className="hero-title text-accent">Let's Talk</TextReveal>
              <div className="text-floats">
                <div className="float-bubble"></div>
                <div className="float-bubble"></div>
                <div className="float-bubble"></div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="container">
              <div className="footer-info">
                <p>© 2026</p>
                <a href="mailto:hello@antigravity.io" className="mail-link">hello@antigravity.io</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        section, .footer-cinematic {
          position: relative; /* Ensure children like ScrollTrigger work well */
          z-index: 2;
        }

        .footer-cinematic {
          padding: 20vh 0 10vh;
          background: linear-gradient(180deg, #000000 0%, #1e0a29 100%);
          overflow: hidden;
          position: relative;
        }

        .footer-content-left {
          position: relative;
          z-index: 5;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }

        .footer-text-wrapper {
          position: relative;
          padding-left: 2vw;
        }

        .text-floats {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .float-bubble {
          position: absolute;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: bob 4s ease-in-out infinite alternate;
        }

        .float-bubble:nth-child(1) { width: 60px; height: 60px; top: -20px; right: -40px; animation-delay: 0s; }
        .float-bubble:nth-child(2) { width: 40px; height: 40px; bottom: 10px; left: -30px; animation-delay: 0.5s; }
        .float-bubble:nth-child(3) { width: 25px; height: 25px; top: 30%; right: -60px; animation-delay: 1s; }

        @keyframes bob {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-10px, -20px); }
        }

        .footer-bg-bubbles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .footer-bubble {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(46, 16, 101, 0.3));
          filter: blur(60px);
        }

        .footer-bubble:nth-child(1) { width: 600px; height: 600px; top: -200px; right: -200px; }
        .footer-bubble:nth-child(2) { width: 500px; height: 500px; bottom: -100px; left: -100px; opacity: 0.5; }

        .footer-bottom {
          width: 100%;
          margin-top: 5vh;
          padding-top: 2rem;
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
          top: -15%;
          right: -5%;
          flex-direction: row;
          align-items: center;
        }

        .annotation-line {
          width: 30px;
          height: 1px;
          background: rgba(255, 255, 255, 0.4);
        }

        .alternate-left {
          left: -15%;
          top: 35%;
          flex-direction: row-reverse;
          align-items: center;
        }

        .alternate-right {
          right: -15%;
          top: 35%;
          flex-direction: row;
          align-items: center;
        }

        .annotation-curve {
          width: 30px;
          height: 30px;
          opacity: 0.4;
        }
        
        .curve-left { transform: rotate(-15deg) translateY(8px); }
        .curve-right { transform: rotate(15deg) translateY(8px); }

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
    </SmoothScroll>
  );
}

export default App;
