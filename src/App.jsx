import { useState } from 'react';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import ExperienceModal from './components/ExperienceModal';
import ShaderHero from './components/ShaderHero';
import About from './components/About';
import TextReveal from './components/TextReveal';
import FadeIn from './components/FadeIn';
import SocialButtons from './components/SocialButtons';
import TechStack from './components/TechStack';
import StaggerFadeIn from './components/StaggerFadeIn';
import ContactForm from './components/ContactForm';
import './components/GlobalAnimations.css';
import './App.css';

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
        <TechStack />

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
          <div className="container">
            <div className="footer-bottom">
              <div className="footer-info">
                <p>&copy; {new Date().getFullYear()} Soumya. All rights reserved.</p>
                <p>Designed with passion</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </SmoothScroll>
  );
}

export default App;
