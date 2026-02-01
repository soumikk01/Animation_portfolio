import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const Navbar = () => {
    const navRef = useRef();
    const [logoText, setLogoText] = useState("");
    const fullText = "PORTFOLIO";

    useEffect(() => {
        // Initial entrance animation
        gsap.fromTo(navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 2.2 }
        );

        // Typing animation - more robust approach
        let ctx = gsap.context(() => {
            const obj = { count: 0 };
            gsap.to(obj, {
                count: fullText.length,
                duration: 3, // Increased duration for better visibility
                ease: "none",
                delay: 3.4, // Start after nav entrance
                onUpdate: () => {
                    setLogoText(fullText.slice(0, Math.ceil(obj.count)));
                }
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <nav ref={navRef} className="navbar">
            <div className="nav-container">
                <div className="nav-logo">
                    <span className="logo-text">
                        <span className="typing-part">{logoText}</span>
                    </span>
                </div>

                <ul className="nav-links">
                    <li>
                        <a href="#about" className="nav-link">
                            <span className="link-text">About</span>
                            <div className="link-bubbles">
                                <span className="link-bubble"></span>
                                <span className="link-bubble"></span>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#projects" className="nav-link">
                            <span className="link-text">Works</span>
                            <div className="link-bubbles">
                                <span className="link-bubble"></span>
                                <span className="link-bubble"></span>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#services" className="nav-link">
                            <span className="link-text">Services</span>
                            <div className="link-bubbles">
                                <span className="link-bubble"></span>
                                <span className="link-bubble"></span>
                            </div>
                        </a>
                    </li>
                </ul>

                <div className="nav-action">
                    <a href="#contact" className="contact-btn">
                        <span className="btn-text">Let's Talk</span>
                        <div className="btn-bubbles">
                            <span className="btn-bubble"></span>
                            <span className="btn-bubble"></span>
                            <span className="btn-bubble"></span>
                        </div>
                        <div className="btn-glow" />
                    </a>
                </div>
            </div>

            <style>{`
                .navbar {
                    position: fixed;
                    top: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1000;
                    width: 90%;
                    max-width: 1200px;
                    pointer-events: none;
                }

                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem 2rem;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px) saturate(180%);
                    -webkit-backdrop-filter: blur(12px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 100px;
                    pointer-events: auto;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
                }

                .logo-text {
                    font-family: var(--font-heading);
                    font-weight: 800;
                    letter-spacing: 0.2rem;
                    font-size: 0.9rem;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    min-height: 1.5em; /* Prevent layout shift */
                }

                .nav-links {
                    display: flex;
                    list-style: none;
                    gap: 3rem;
                    margin: 0;
                    padding: 0;
                }

                .nav-link {
                    text-decoration: none;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.15rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    position: relative;
                    padding: 0.5rem 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .nav-link:hover {
                    color: #ffffff;
                }

                .link-text {
                    position: relative;
                    z-index: 2;
                }

                .link-bubbles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                }

                .link-bubble {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    backdrop-filter: blur(1px);
                    opacity: 0;
                    transform: scale(0);
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }

                .nav-link:hover .link-bubble {
                    opacity: 1;
                    transform: scale(1);
                }

                .link-bubble:nth-child(1) { width: 12px; height: 12px; top: -5px; left: 20%; transition-delay: 0.05s; }
                .link-bubble:nth-child(2) { width: 8px; height: 8px; bottom: -2px; right: 10%; transition-delay: 0.1s; }

                .nav-link:hover .link-bubble:nth-child(1) { top: -8px; left: 25%; }
                .nav-link:hover .link-bubble:nth-child(2) { bottom: -5px; right: 15%; }

                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 1rem;
                    right: 1rem;
                    height: 1px;
                    background: var(--accent-color);
                    transform: scaleX(0);
                    transform-origin: right;
                    transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
                }

                .nav-link:hover::after {
                    transform: scaleX(1);
                    transform-origin: left;
                }

                .contact-btn {
                    position: relative;
                    padding: 0.6rem 2rem;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 100px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1rem;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .contact-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.4);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }

                .btn-text {
                    position: relative;
                    z-index: 2;
                }

                .btn-bubbles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                }

                .btn-bubble {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    backdrop-filter: blur(2px);
                    opacity: 0;
                    transform: scale(0);
                    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .contact-btn:hover .btn-bubble {
                    opacity: 1;
                    transform: scale(1);
                }

                .btn-bubble:nth-child(1) { width: 30px; height: 30px; top: -10px; left: 10%; transition-delay: 0.1s; }
                .btn-bubble:nth-child(2) { width: 20px; height: 20px; bottom: -5px; right: 20%; transition-delay: 0.2s; }
                .btn-bubble:nth-child(3) { width: 15px; height: 15px; top: 40%; left: 80%; transition-delay: 0.3s; }

                .contact-btn:hover .btn-bubble:nth-child(1) { top: -15px; left: 15%; }
                .contact-btn:hover .btn-bubble:nth-child(2) { bottom: -10px; right: 25%; }
                .contact-btn:hover .btn-bubble:nth-child(3) { top: 30%; left: 85%; }

                .btn-glow {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.2),
                        transparent
                    );
                    z-index: 1;
                }

                .contact-btn:hover .btn-glow {
                    left: 100%;
                }

                @media (max-width: 768px) {
                    .nav-links {
                        display: none;
                    }
                    
                    .nav-container {
                        padding: 0.6rem 1.2rem;
                    }
                    
                    .logo-text {
                        font-size: 0.75rem;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
