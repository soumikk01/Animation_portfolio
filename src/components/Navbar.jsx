import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Sound utility functions using Web Audio API
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;

const initAudio = () => {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    return audioContext;
};

const playSound = (frequency, duration, type = 'sine', volume = 0.1) => {
    const ctx = initAudio();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
};

// Different sound effects
const sounds = {
    hover: () => playSound(800, 0.1, 'sine', 0.05),
    click: () => {
        playSound(600, 0.05, 'sine', 0.08);
        setTimeout(() => playSound(900, 0.05, 'sine', 0.06), 50);
    },
    menuOpen: () => {
        playSound(400, 0.1, 'sine', 0.08);
        setTimeout(() => playSound(600, 0.1, 'sine', 0.06), 80);
        setTimeout(() => playSound(800, 0.1, 'sine', 0.04), 150);
    },
    menuClose: () => {
        playSound(800, 0.1, 'sine', 0.06);
        setTimeout(() => playSound(600, 0.1, 'sine', 0.05), 60);
    }
};

const Navbar = () => {
    const navRef = useRef();
    const navSectionRightRef = useRef();
    const menuBtnRef = useRef();
    const scrollTriggerRef = useRef(null);
    const soundTimersRef = useRef([]);
    const menuOpenedAtRef = useRef(0);
    const [logoText, setLogoText] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const fullText = "PORTFOLIO";

    useEffect(() => {
        // Initial entrance animation
        gsap.fromTo(navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 2.2 }
        );

        // Typing animation
        let ctx = gsap.context(() => {
            const obj = { count: 0 };
            gsap.to(obj, {
                count: fullText.length,
                duration: 3,
                ease: "none",
                delay: 3.4,
                onUpdate: () => {
                    setLogoText(fullText.slice(0, Math.ceil(obj.count)));
                }
            });
        });

        // Scroll-based shrink/expand animation
        scrollTriggerRef.current = ScrollTrigger.create({
            start: 'top top',
            end: 'max',
            onUpdate: (self) => {
                const scrollY = self.scroll();

                // If menu is open, handle "convert back on scroll" logic
                if (isMenuOpen) {
                    // Only convert back if user has scrolled a bit away (e.g. 100px) from where they opened it
                    if (Math.abs(scrollY - menuOpenedAtRef.current) > 100) {
                        setIsMenuOpen(false);
                        // The next update or current check below will handle the visual shrink
                    } else {
                        // While in the "buffer" zone, don't let scroll trigger override the manual open state
                        return;
                    }
                }

                // When scrolling down (past 100px), hide entire right section and show menu
                if (scrollY > 100) {
                    gsap.to(navSectionRightRef.current, {
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.4,
                        ease: 'power2.out',
                        pointerEvents: 'none',
                        display: 'none'
                    });
                    gsap.to(menuBtnRef.current, {
                        display: 'flex',
                        opacity: 1,
                        x: 0,
                        rotation: 0,
                        scale: 1,
                        duration: 0.6,
                        ease: 'elastic.out(1, 0.5)',
                        pointerEvents: 'auto'
                    });
                } else {
                    // When scrolling back to home, show right section and hide menu
                    gsap.to(navSectionRightRef.current, {
                        display: 'flex',
                        opacity: 1,
                        scale: 1,
                        duration: 0.4,
                        ease: 'power2.out',
                        pointerEvents: 'auto'
                    });
                    gsap.to(menuBtnRef.current, {
                        opacity: 0,
                        x: 100,
                        rotation: 180,
                        scale: 0.5,
                        duration: 0.5,
                        ease: 'back.in(1.7)',
                        pointerEvents: 'none',
                        display: 'none'
                    });
                }
            }
        });

        return () => {
            ctx.revert();
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.kill();
            }
            // Clean up any pending sound timers
            soundTimersRef.current.forEach(timer => clearTimeout(timer));
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        const newState = !isMenuOpen;
        setIsMenuOpen(newState);

        // Play menu sound and show/hide navbar section
        if (newState) {
            sounds.menuOpen();
            menuOpenedAtRef.current = window.scrollY || window.pageYOffset;

            // Disable ScrollTrigger animations while menu is open
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.disable();
            }
            // Show the navbar section when menu opens
            gsap.to(navSectionRightRef.current, {
                display: 'flex',
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: 'elastic.out(1, 0.6)',
                pointerEvents: 'auto'
            });
            // Hide the menu button when menu overlay is open
            gsap.to(menuBtnRef.current, {
                opacity: 0,
                x: 100,
                rotation: 180,
                scale: 0.5,
                duration: 0.4,
                ease: 'back.in(1.7)',
                pointerEvents: 'none',
                display: 'none'
            });
        } else {
            sounds.menuClose();
            // Re-enable ScrollTrigger
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.enable();
            }

            // When menu closes, check scroll position to determine if navbar should stay visible
            const scrollY = window.scrollY || window.pageYOffset;
            if (scrollY > 100) {
                // Hide navbar section if still scrolled down
                gsap.to(navSectionRightRef.current, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.4,
                    ease: 'power2.out',
                    pointerEvents: 'none',
                    display: 'none'
                });
                // Show menu button again
                gsap.to(menuBtnRef.current, {
                    display: 'flex',
                    opacity: 1,
                    x: 0,
                    rotation: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.5)',
                    pointerEvents: 'auto'
                });
            } else {
                // At top of page - hide menu button
                gsap.to(menuBtnRef.current, {
                    opacity: 0,
                    x: 100,
                    rotation: 180,
                    scale: 0.5,
                    duration: 0.5,
                    ease: 'back.in(1.7)',
                    pointerEvents: 'none',
                    display: 'none'
                });
            }
        }
    };

    return (
        <nav ref={navRef} className="navbar">
            {/* Left Section - Logo (Separate Container) */}
            <div className="nav-section nav-section-left">
                <div className="nav-logo">
                    <span className="logo-text">
                        <div className="logo-bubbles">
                            <span className="logo-bubble"></span>
                            <span className="logo-bubble"></span>
                            <span className="logo-bubble"></span>
                            <span className="logo-bubble"></span>
                        </div>
                        <span className="typing-part">{logoText}</span>
                    </span>
                </div>
            </div>

            {/* Right Container - Groups links and menu button */}
            <div className="nav-right-container">
                {/* Right Section - Navigation (Separate Container) */}
                <div ref={navSectionRightRef} className="nav-section nav-section-right">
                    <ul className="nav-links">
                        <li>
                            <a href="#home" className="nav-link" onClick={() => sounds.click()}>
                                <span className="link-text">Home</span>
                                <div className="link-bubbles">
                                    <span className="link-bubble"></span>
                                    <span className="link-bubble"></span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="#tech-stack" className="nav-link" onClick={() => sounds.click()}>
                                <span className="link-text">Tech Stack</span>
                                <div className="link-bubbles">
                                    <span className="link-bubble"></span>
                                    <span className="link-bubble"></span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="#projects" className="nav-link" onClick={() => sounds.click()}>
                                <span className="link-text">Projects</span>
                                <div className="link-bubbles">
                                    <span className="link-bubble"></span>
                                    <span className="link-bubble"></span>
                                </div>
                            </a>
                        </li>
                    </ul>

                    <div className="nav-action">
                        <a href="#contact" className="contact-btn" onClick={() => sounds.click()}>
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

                {/* Menu Button - Shown when scrolled down */}
                <button
                    ref={menuBtnRef}
                    className="menu-btn"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <div className="menu-btn-bubbles">
                        <span className="menu-btn-bubble"></span>
                        <span className="menu-btn-bubble"></span>
                        <span className="menu-btn-bubble"></span>
                    </div>
                    <div className="menu-lines">
                        <span className={`menu-line ${isMenuOpen ? 'open' : ''}`}></span>
                        <span className={`menu-line ${isMenuOpen ? 'open' : ''}`}></span>
                        <span className={`menu-line ${isMenuOpen ? 'open' : ''}`}></span>
                    </div>
                </button>
            </div>

            {/* Mobile/Shrunk Menu Overlay */}
            <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`}>
                <ul className="menu-overlay-links">
                    <li>
                        <a href="#home" onClick={toggleMenu}>Home</a>
                    </li>
                    <li>
                        <a href="#tech-stack" onClick={toggleMenu}>Tech Stack</a>
                    </li>
                    <li>
                        <a href="#projects" onClick={toggleMenu}>Projects</a>
                    </li>
                    <li>
                        <a href="#contact" onClick={toggleMenu}>Let's Talk</a>
                    </li>
                </ul>
            </div >

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
                    display: flex;
                    justify-content: space-between;
                    gap: 2rem;
                }

                .nav-section {
                    display: flex;
                    align-items: center;
                    padding: 0.5rem 1.5rem;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px) saturate(180%);
                    -webkit-backdrop-filter: blur(12px) saturate(180%);
                    border-radius: 100px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    pointer-events: auto;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
                }

                .nav-section-left {
                    /* Logo section */
                }

                .nav-section-right {
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                    position: relative;
                }

                .nav-right-container {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    position: relative;
                }

                .logo-text {
                    font-family: var(--font-heading);
                    font-weight: 800;
                    letter-spacing: 0.2rem;
                    font-size: 0.9rem;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    min-height: 1.5em;
                    position: relative;
                    text-shadow: 
                        0 2px 10px rgba(168, 85, 247, 0.6),
                        0 0 20px rgba(192, 132, 252, 0.4),
                        0 0 30px rgba(168, 85, 247, 0.3),
                        2px 2px 0 rgba(255, 255, 255, 0.1),
                        -2px -2px 0 rgba(0, 0, 0, 0.2);
                    filter: drop-shadow(0 4px 8px rgba(168, 85, 247, 0.5));
                }

                .typing-part {
                    background: linear-gradient(
                        135deg,
                        rgba(255, 255, 255, 0.95) 0%,
                        rgba(192, 132, 252, 0.9) 50%,
                        rgba(255, 255, 255, 0.95) 100%
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    position: relative;
                    padding: 0.2rem 0.5rem;
                    border-radius: 20px;
                    animation: bubbleGlow 3s ease-in-out infinite;
                }

                @keyframes bubbleGlow {
                    0%, 100% {
                        filter: brightness(1) contrast(1);
                    }
                    50% {
                        filter: brightness(1.2) contrast(1.1);
                    }
                }

                /* Logo Bubble Animations */
                .logo-bubbles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: visible;
                }

                .logo-bubble {
                    position: absolute;
                    background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(192, 132, 252, 0.15));
                    border: 1px solid rgba(192, 132, 252, 0.3);
                    border-radius: 50%;
                    backdrop-filter: blur(4px);
                    box-shadow: 0 4px 15px rgba(138, 43, 226, 0.2);
                }

                .logo-bubble:nth-child(1) {
                    width: 18px;
                    height: 18px;
                    top: -10px;
                    left: 10%;
                    animation: logoFloat1 4s ease-in-out infinite;
                }

                .logo-bubble:nth-child(2) {
                    width: 14px;
                    height: 14px;
                    bottom: -8px;
                    left: 30%;
                    animation: logoFloat2 4.5s ease-in-out infinite 0.5s;
                }

                .logo-bubble:nth-child(3) {
                    width: 20px;
                    height: 20px;
                    top: -12px;
                    right: 15%;
                    animation: logoFloat3 5s ease-in-out infinite 1s;
                }

                .logo-bubble:nth-child(4) {
                    width: 12px;
                    height: 12px;
                    bottom: -6px;
                    right: 25%;
                    animation: logoFloat4 4.2s ease-in-out infinite 1.5s;
                }

                @keyframes logoFloat1 {
                    0%, 100% { 
                        transform: translate(0, 0) scale(1);
                        opacity: 0.6;
                    }
                    50% { 
                        transform: translate(-8px, -12px) scale(1.2);
                        opacity: 1;
                    }
                }

                @keyframes logoFloat2 {
                    0%, 100% { 
                        transform: translate(0, 0) scale(1);
                        opacity: 0.5;
                    }
                    50% { 
                        transform: translate(10px, -8px) scale(1.15);
                        opacity: 0.9;
                    }
                }

                @keyframes logoFloat3 {
                    0%, 100% { 
                        transform: translate(0, 0) scale(1);
                        opacity: 0.7;
                    }
                    50% { 
                        transform: translate(-5px, -15px) scale(1.25);
                        opacity: 1;
                    }
                }

                @keyframes logoFloat4 {
                    0%, 100% { 
                        transform: translate(0, 0) scale(1);
                        opacity: 0.55;
                    }
                    50% { 
                        transform: translate(8px, -10px) scale(1.1);
                        opacity: 0.85;
                    }
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

                /* Menu Button Styles */
                .menu-btn {
                    position: relative;
                    display: none;
                    flex-direction: column;
                    gap: 5px;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(12px) saturate(180%);
                    -webkit-backdrop-filter: blur(12px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 50%;
                    cursor: pointer;
                    padding: 0.8rem;
                    opacity: 0;
                    transform: translateX(100px) rotate(180deg) scale(0.5);
                    pointer-events: none;
                    z-index: 1001;
                    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    overflow: visible;
                    width: 48px;
                    height: 48px;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
                }
                
                .menu-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .menu-lines {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    position: relative;
                    z-index: 2;
                }

                .menu-line {
                    width: 20px;
                    height: 2px;
                    background: #ffffff;
                    border-radius: 2px;
                    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }

                .menu-btn:hover .menu-line {
                    background: var(--accent-color);
                }

                .menu-line.open:nth-child(1) {
                    transform: rotate(45deg) translateY(7px);
                }

                .menu-line.open:nth-child(2) {
                    opacity: 0;
                    transform: translateX(-10px);
                }

                .menu-line.open:nth-child(3) {
                    transform: rotate(-45deg) translateY(-7px);
                }

                /* Menu Button Bubbles */
                .menu-btn-bubbles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: visible;
                }

                .menu-btn-bubble {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.15);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    backdrop-filter: blur(2px);
                    opacity: 0;
                    transform: scale(0);
                    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .menu-btn:hover .menu-btn-bubble {
                    opacity: 1;
                    transform: scale(1);
                }

                .menu-btn-bubble:nth-child(1) { 
                    width: 20px; 
                    height: 20px; 
                    top: -8px; 
                    right: -5px; 
                    transition-delay: 0.1s;
                    animation: float1 3s ease-in-out infinite;
                }

                .menu-btn-bubble:nth-child(2) { 
                    width: 15px; 
                    height: 15px; 
                    bottom: -6px; 
                    left: -4px; 
                    transition-delay: 0.2s;
                    animation: float2 3.5s ease-in-out infinite;
                }

                .menu-btn-bubble:nth-child(3) { 
                    width: 12px; 
                    height: 12px; 
                    top: 50%; 
                    left: -10px; 
                    transition-delay: 0.3s;
                    animation: float3 4s ease-in-out infinite;
                }

                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-5px, -8px) scale(1.1); }
                }

                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(5px, -5px) scale(1.15); }
                }

                @keyframes float3 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-3px, 5px) scale(1.2); }
                }

                /* Menu Overlay */
                .menu-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(8, 8, 8, 0.98);
                    backdrop-filter: blur(20px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.4s ease;
                    z-index: 999;
                }

                .menu-overlay.active {
                    opacity: 1;
                    pointer-events: auto;
                }

                .menu-overlay-links {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    text-align: center;
                }

                .menu-overlay-links li {
                    margin: 2rem 0;
                }

                .menu-overlay-links a {
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 2.5rem;
                    font-weight: 700;
                    font-family: var(--font-heading);
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    transition: all 0.3s ease;
                    position: relative;
                    display: inline-block;
                }

                .menu-overlay-links a::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: var(--accent-color);
                    transform: scaleX(0);
                    transition: transform 0.3s ease;
                }

                .menu-overlay-links a:hover {
                    color: var(--accent-color);
                }

                .menu-overlay-links a:hover::after {
                    transform: scaleX(1);
                }

                @media (max-width: 768px) {
                    .nav-links {
                        display: none;
                    }
                    
                    .nav-action {
                        display: none;
                    }
                    
                    .menu-btn {
                        display: flex !important;
                        opacity: 1 !important;
                        transform: scale(1) !important;
                        pointer-events: auto !important;
                        position: relative;
                        background: rgba(255, 255, 255, 0.08);
                    }
                    
                    .nav-section {
                        padding: 0.8rem 1.4rem;
                    }

                    .navbar {
                        padding: 1rem 5% 0;
                    }
                    
                    .logo-text {
                        font-size: 0.85rem;
                        letter-spacing: 0.15em;
                    }

                    .menu-overlay-links a {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </nav >
    );
};

export default Navbar;
