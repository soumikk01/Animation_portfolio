import { useState } from 'react';
import SmoothScroll from './components/SmoothScroll';
import ExperienceModal from './components/ExperienceModal';
import ShaderHero from './components/ShaderHero';
import TextReveal from './components/TextReveal';

function App() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <SmoothScroll>
      <ExperienceModal onStart={() => setHasStarted(true)} />

      {/* Background is now outside main-content to show behind modal */}
      <ShaderHero />

      <main className={`main-content ${hasStarted ? 'started' : ''}`}>
        {/* HERO SECTION */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                <TextReveal>Creative</TextReveal>
                <TextReveal className="text-accent">Engineer</TextReveal>
              </h1>
              <div className="hero-footer">
                <p className="text-secondary">Based in France / Available for freelance</p>
                <div className="scroll-hint">
                  <span>SCROLL TO EXPLORE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="about">
          <div className="container">
            <h2 className="section-title">01 / Profile</h2>
            <div className="about-grid">
              <div className="about-text">
                <TextReveal className="large-text">
                  I craft immersive digital experiences at the intersection of design and code.
                  Specializing in WebGL, GSAP, and advanced React development.
                </TextReveal>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className="projects">
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
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer section">
          <div className="container">
            <TextReveal className="hero-title text-accent">Let's Talk</TextReveal>
            <div className="footer-links">
              <a href="#" className="link-hover">LinkedIn</a>
              <a href="#" className="link-hover">GitHub</a>
              <a href="#" className="link-hover">Twitter</a>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        section {
          position: relative; /* Ensure children like ScrollTrigger work well */
          z-index: 2;
        }

        .main-content {
          opacity: 0;
          transition: opacity 2s ease;
        }
        
        .main-content.started {
          opacity: 1;
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
          font-size: clamp(2rem, 6vw, 4rem);
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
      `}</style>
    </SmoothScroll>
  );
}

export default App;
