import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TypingAnimation from './TypingAnimation';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const glowRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = sectionRef.current;

    // Staggered text animation with subtle effects
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });

    tl.fromTo(
      textRef.current.querySelector('.section-title'),
      { y: 60, opacity: 0, scale: 0.95 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 1, 
        ease: 'power3.out' 
      }
    )
      .fromTo(
        textRef.current.querySelector('.about-headline'),
        { y: 60, opacity: 0, scale: 0.95 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 1, 
          ease: 'power3.out' 
        },
        '-=0.7'
      )
      .fromTo(
        textRef.current.querySelector('.about-description'),
        { y: 60, opacity: 0, scale: 0.95 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 1, 
          ease: 'power3.out' 
        },
        '-=0.7'
      );

    // Image animation with smooth entrance
    gsap.fromTo(
      imageRef.current,
      { 
        x: 100, 
        opacity: 0, 
        scale: 0.9,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true,
        },
      }
    );

    // Animate gradient background
    gsap.to('.about-section::before', {
      backgroundPosition: '200% center',
      duration: 20,
      repeat: -1,
      ease: 'none',
    });
  }, []);

  // Mouse tracking for glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (glowRef.current) {
        const rect = glowRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const element = glowRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      return () => element.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about-section">
      <div className="container about-container">
        <div className="about-content" ref={glowRef}>
          <div
            className="mouse-glow"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
            }}
          />

          <div ref={textRef} className="about-text-wrapper">
            <h2 className="section-title">
              <span className="title-glow">00</span> / About
            </h2>
            <h3 className="about-headline">
              <TypingAnimation
                text="B.Tech in Computer Science & Engineering (AI & Machine Learning)"
                speed={40}
                delay={500}
              />
            </h3>
            <p className="about-description">
              <TypingAnimation
                text="I am currently pursuing a B.Tech in Computer Science and Engineering (Artificial Intelligence & Machine Learning). I am actively learning backend development and AI concepts, with a strong interest in building real-world software systems. I specialize in Java backend development combined with modern frontend technologies such as JavaScript, React, and Three.js, and I focus on building scalable, efficient, and production-ready full-stack applications."
                speed={25}
                delay={3500}
              />
            </p>
            <div className="tech-highlights">
              <span className="tech-badge">AI/ML</span>
              <span className="tech-badge">Full-Stack</span>
              <span className="tech-badge">Three.js</span>
            </div>
          </div>

          <div ref={imageRef} className="about-image-wrapper">
            <div className="image-frame">
              <div className="animated-border"></div>
              <div className="placeholder-image">
                <div className="scan-line"></div>
                <div className="grid-overlay"></div>
              </div>
              <div className="frame-corner top-left"></div>
              <div className="frame-corner top-right"></div>
              <div className="frame-corner bottom-left"></div>
              <div className="frame-corner bottom-right"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
                .about-section {
                    padding: 10rem 0;
                    position: relative;
                    overflow: hidden;
                    background: transparent;
                }

                .about-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(
                        circle at 20% 50%,
                        rgba(147, 51, 234, 0.1) 0%,
                        transparent 50%
                    ),
                    radial-gradient(
                        circle at 80% 50%,
                        rgba(59, 130, 246, 0.1) 0%,
                        transparent 50%
                    );
                    animation: gradient-shift 15s ease infinite;
                    pointer-events: none;
                }

                @keyframes gradient-shift {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }

                .about-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    position: relative;
                    z-index: 1;
                }

                .about-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 5rem;
                    align-items: center;
                    position: relative;
                }

                .mouse-glow {
                    position: absolute;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(
                        circle,
                        rgba(147, 51, 234, 0.15) 0%,
                        rgba(59, 130, 246, 0.1) 25%,
                        transparent 70%
                    );
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                    transition: opacity 0.3s ease;
                    z-index: 0;
                    mix-blend-mode: screen;
                }

                .about-text-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                    position: relative;
                    z-index: 1;
                }

                .section-title {
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 700;
                    color: #fff;
                    letter-spacing: 0.05em;
                    position: relative;
                    display: inline-block;
                    width: fit-content;
                }

                .title-glow {
                    background: linear-gradient(135deg, #9333ea, #3b82f6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    filter: drop-shadow(0 0 20px rgba(147, 51, 234, 0.5));
                    animation: pulse-glow 3s ease-in-out infinite;
                }

                @keyframes pulse-glow {
                    0%, 100% {
                        filter: drop-shadow(0 0 20px rgba(147, 51, 234, 0.5));
                    }
                    50% {
                        filter: drop-shadow(0 0 30px rgba(147, 51, 234, 0.8));
                    }
                }

                .about-headline {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: clamp(1.1rem, 2.2vw, 1.6rem);
                    font-weight: 500;
                    line-height: 1.6;
                    color: #f0f0f0;
                    text-transform: none;
                    letter-spacing: 0.05em;
                    position: relative;
                    padding-left: 1.5rem;
                }

                .about-headline::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: linear-gradient(to bottom, #9333ea, #3b82f6);
                    box-shadow: 0 0 15px rgba(147, 51, 234, 0.6);
                    animation: border-pulse 2s ease-in-out infinite;
                }

                @keyframes border-pulse {
                    0%, 100% { box-shadow: 0 0 15px rgba(147, 51, 234, 0.6); }
                    50% { box-shadow: 0 0 25px rgba(147, 51, 234, 1); }
                }

                .about-description {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: clamp(0.95rem, 1.8vw, 1.3rem);
                    font-weight: 400;
                    line-height: 1.8;
                    color: #d0d0d0;
                    letter-spacing: 0.03em;
                    max-width: 95%;
                    position: relative;
                    padding: 1.5rem;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    transition: all 0.4s ease;
                }

                .about-description:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(147, 51, 234, 0.3);
                    box-shadow: 0 0 30px rgba(147, 51, 234, 0.2);
                    transform: translateY(-2px);
                }

                .tech-highlights {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    margin-top: 1rem;
                }

                .tech-badge {
                    padding: 0.6rem 1.5rem;
                    background: linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2));
                    border: 1px solid rgba(147, 51, 234, 0.4);
                    border-radius: 25px;
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 0.9rem;
                    color: #e0e0e0;
                    font-weight: 500;
                    letter-spacing: 0.05em;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .tech-badge::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }

                .tech-badge:hover {
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 5px 25px rgba(147, 51, 234, 0.4);
                    border-color: rgba(147, 51, 234, 0.8);
                }

                .tech-badge:hover::before {
                    left: 100%;
                }

                .about-image-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    z-index: 1;
                    perspective: 1000px;
                }

                .image-frame {
                    position: relative;
                    width: 100%;
                    max-width: 450px;
                    aspect-ratio: 4/5;
                    padding: 1.5rem;
                    transition: transform 0.6s ease;
                    transform-style: preserve-3d;
                }

                .image-frame:hover {
                    transform: scale(1.03) rotateY(5deg);
                }

                .animated-border {
                    position: absolute;
                    inset: 0;
                    border-radius: 8px;
                    padding: 2px;
                    background: linear-gradient(45deg, #9333ea, #3b82f6, #9333ea, #3b82f6);
                    background-size: 300% 300%;
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    animation: border-rotate 4s linear infinite;
                }

                @keyframes border-rotate {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .placeholder-image {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
                    backdrop-filter: blur(20px);
                    position: relative;
                    overflow: hidden;
                    border-radius: 8px;
                    box-shadow: 
                        inset 0 0 60px rgba(147, 51, 234, 0.1),
                        0 0 40px rgba(147, 51, 234, 0.2);
                }

                .scan-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.8), transparent);
                    animation: scan 3s ease-in-out infinite;
                    box-shadow: 0 0 10px rgba(147, 51, 234, 0.8);
                }

                @keyframes scan {
                    0%, 100% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }

                .grid-overlay {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                    opacity: 0.3;
                }

                .frame-corner {
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    border: 3px solid;
                    border-image: linear-gradient(135deg, #9333ea, #3b82f6) 1;
                    transition: all 0.4s ease;
                    z-index: 2;
                }

                .image-frame:hover .frame-corner {
                    width: 40px;
                    height: 40px;
                    filter: drop-shadow(0 0 15px rgba(147, 51, 234, 0.8));
                }

                .top-left {
                    top: -3px;
                    left: -3px;
                    border-right: none;
                    border-bottom: none;
                }

                .top-right {
                    top: -3px;
                    right: -3px;
                    border-left: none;
                    border-bottom: none;
                }

                .bottom-left {
                    bottom: -3px;
                    left: -3px;
                    border-right: none;
                    border-top: none;
                }

                .bottom-right {
                    bottom: -3px;
                    right: -3px;
                    border-left: none;
                    border-top: none;
                }

                @media (max-width: 768px) {
                    .about-content {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }
                    
                    .about-text-wrapper {
                        text-align: center;
                        align-items: center;
                    }

                    .about-headline {
                        padding-left: 0;
                    }

                    .about-headline::before {
                        display: none;
                    }
                    
                    .about-description {
                        text-align: left;
                        max-width: 100%;
                    }

                    .tech-highlights {
                        justify-content: center;
                    }

                    .mouse-glow {
                        display: none;
                    }
                }
            `}</style>
    </section>
  );
};

export default About;
