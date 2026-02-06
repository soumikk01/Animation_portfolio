import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TypingAnimation from './TypingAnimation';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        const el = sectionRef.current;

        gsap.fromTo(textRef.current,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        gsap.fromTo(imageRef.current,
            { x: 50, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                delay: 0.2,
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, []);

    return (
        <section ref={sectionRef} id="about" className="about-section">
            <div className="container about-container">
                <div className="about-content">
                    <div ref={textRef} className="about-text-wrapper">
                        <h2 className="section-title">00 / About</h2>
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
                    </div>

                    <div ref={imageRef} className="about-image-wrapper">
                        <div className="image-frame">
                            {/* Placeholder for the user's image */}
                            <div className="placeholder-image"></div>
                            <div className="frame-corner top-left"></div>
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
                    background: transparent; /* Allows background from App.jsx or ShaderHero to show if layered */
                }

                .about-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }

                .about-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    align-items: center;
                }

                .about-text-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .about-headline {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: clamp(1rem, 2vw, 1.5rem);
                    font-weight: 400;
                    line-height: 1.5;
                    color: #e0e0e0;
                    text-transform: none;
                    letter-spacing: 0.05em;
                }

                .highlight {
                    color: inherit; /* Keep same color as parent */
                    font-style: normal;
                }

                .about-description {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: clamp(1rem, 2vw, 1.5rem);
                    font-weight: 400;
                    line-height: 1.5;
                    color: #e0e0e0;
                    letter-spacing: 0.05em;
                    max-width: 90%;
                    margin-top: 1.5rem; /* Increased margin for better separation */
                }

                .about-image-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .image-frame {
                    position: relative;
                    width: 100%;
                    max-width: 400px;
                    aspect-ratio: 4/5;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 1rem;
                    transition: transform 0.5s ease;
                }

                .image-frame:hover {
                    transform: scale(1.02);
                }

                .placeholder-image {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
                    backdrop-filter: blur(10px);
                    position: relative;
                    overflow: hidden;
                }

                .frame-corner {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border: 2px solid var(--accent-color, #ba55d3);
                }

                .top-left {
                    top: -2px;
                    left: -2px;
                    border-right: none;
                    border-bottom: none;
                }

                .bottom-right {
                    bottom: -2px;
                    right: -2px;
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
                    
                     .about-description {
                        text-align: center;
                    }
                }
            `}</style>
        </section>
    );
};

export default About;
