import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const heroSectionRef = useRef(null);

  useEffect(() => {
    if (hasStarted && heroSectionRef.current) {
      const tl = gsap.timeline({ paused: true });

      // Define the professional intro sequence
      tl.to('.main-word', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: 'power4.out'
      })
        .to('.annotation-line', {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'expo.inOut'
        }, '-=0.6')
        .to('.annotation-text', {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        }, '-=0.4');

      // Controlled by ScrollTrigger to replay on entry
      ScrollTrigger.create({
        trigger: '#home',
        start: 'top center',
        onEnter: () => tl.play(),
        onEnterBack: () => tl.restart(),
        onLeave: () => {
          // Reset to hidden state when scrolling away for a fresh entrance next time
          gsap.set('.main-word', { opacity: 0, y: 30 });
          gsap.set('.annotation-line', { scaleX: 0 });
          gsap.set('.annotation-text', { opacity: 0, x: -10 });
          tl.pause(0);
        },
        onLeaveBack: () => {
          gsap.set('.main-word', { opacity: 0, y: 30 });
          gsap.set('.annotation-line', { scaleX: 0 });
          gsap.set('.annotation-text', { opacity: 0, x: -10 });
          tl.pause(0);
        }
      });
    }
  }, [hasStarted]);

  return (
    <SmoothScroll>
      <Navbar />
      <ExperienceModal onStart={() => setHasStarted(true)} />

      {/* Background is now outside main-content to show behind modal */}
      <ShaderHero />

      <main className={`main-content ${hasStarted ? 'started' : ''}`}>
        {/* HERO SECTION - REPLICATING "LOCKED AWAY" DESIGN */}
        <section id="home" className="hero hero-vibe">
          <div className="container hero-container" ref={heroSectionRef}>
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
                <div className="bubble-flutter flutter-1"><div className="bubble bubble-1"></div></div>
                <div className="bubble-flutter flutter-2"><div className="bubble bubble-2"></div></div>
                <div className="bubble-flutter flutter-3"><div className="bubble bubble-3"></div></div>
                <div className="bubble-flutter flutter-4"><div className="bubble bubble-4"></div></div>
                <div className="bubble-flutter flutter-5"><div className="bubble bubble-5"></div></div>
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
