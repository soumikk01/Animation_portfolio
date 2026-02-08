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
import TechStack from './components/TechStack';
import StaggerFadeIn from './components/StaggerFadeIn';
import ContactForm from './components/ContactForm';
import LoadingScreen from './components/LoadingScreen';
import './components/GlobalAnimations.css';
import './App.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const heroSectionRef = useRef(null);

  // Handle initial loading
  useEffect(() => {
    // Simulate asset loading (fonts, images, etc.)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust based on actual asset load time

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasStarted && heroSectionRef.current) {
      const tl = gsap.timeline({ paused: true });

      // Define the professional intro sequence
      tl.to('.main-word', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: 'power4.out',
      })
        .to(
          '.annotation-line',
          {
            scaleX: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'expo.inOut',
          },
          '-=0.6'
        )
        .to(
          '.annotation-text',
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.4'
        );

      // Controlled by ScrollTrigger to replay on entry
      const trigger = ScrollTrigger.create({
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
        },
      });

      // Cleanup function to prevent memory leaks
      return () => {
        trigger.kill();
        tl.kill();
      };
    }
  }, [hasStarted]);

  return (
    <>
      {isLoading && <LoadingScreen />}
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
                <div className="bubble-flutter flutter-1">
                  <div className="bubble bubble-1"></div>
                </div>
                <div className="bubble-flutter flutter-2">
                  <div className="bubble bubble-2"></div>
                </div>
                <div className="bubble-flutter flutter-3">
                  <div className="bubble bubble-3"></div>
                </div>
                <div className="bubble-flutter flutter-4">
                  <div className="bubble bubble-4"></div>
                </div>
                <div className="bubble-flutter flutter-5">
                  <div className="bubble bubble-5"></div>
                </div>
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
              <h2 className="section-title">02 / Projects</h2>
            </FadeIn>
            <StaggerFadeIn className="project-grid" staggerDelay={0.2}>
              {[
                { 
                  name: 'Motion Identity', 
                  cat: 'Interaction Design', 
                  url: 'https://example.com/project-1',
                  image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
                },
                { 
                  name: 'Vortex System', 
                  cat: 'WebGL / Shader', 
                  url: 'https://example.com/project-2',
                  image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80'
                },
                { 
                  name: 'Orias Portal', 
                  cat: 'Creative Dev', 
                  url: 'https://example.com/project-3',
                  image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
                },
              ].map((proj, i) => (
                <a 
                  key={i} 
                  href={proj.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="project-card"
                >
                  <div className="project-card-image" style={{ backgroundImage: `url(${proj.image})` }}>
                    <div className="project-card-overlay">
                      <span className="view-link">View Project</span>
                    </div>
                  </div>
                  <div className="project-card-info">
                    <span className="project-num">0{i + 1}</span>
                    <TextReveal className="project-name">{proj.name}</TextReveal>
                    <span className="project-category">{proj.cat}</span>
                  </div>
                </a>
              ))}
            </StaggerFadeIn>
          </div>
        </section>

        {/* CONTACT / MESSAGE SECTION */}
        <ContactForm />
      </main>
    </SmoothScroll>
    </>
  );
}

export default App;
