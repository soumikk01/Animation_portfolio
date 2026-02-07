import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { sounds, setMuted, getMuted } from '../utils/audio';
import './GlobalAnimations.css';
import './Navbar.css';

const Navbar = () => {
  const navRef = useRef();
  const navSectionRightRef = useRef();
  const menuBtnRef = useRef();
  const scrollTriggerRef = useRef(null);
  const soundTimersRef = useRef([]);
  const menuOpenedAtRef = useRef(0);
  const [logoText, setLogoText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(getMuted());
  const [showSoundTooltip, setShowSoundTooltip] = useState(true);
  const [hasEnabledSound, setHasEnabledSound] = useState(false); // Track if user enabled sound this session
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipPop, setTooltipPop] = useState('');
  const fullText = 'PORTFOLIO';
  const tooltipFullText = 'every click goes';
  const tooltipPopText = 'POP!';

  useEffect(() => {
    // Initial entrance animation
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 2.2 }
    );

    // Typing animation
    let ctx = gsap.context(() => {
      const obj = { count: 0 };
      gsap.to(obj, {
        count: fullText.length,
        duration: 3,
        ease: 'none',
        delay: 3.4,
        onUpdate: () => {
          setLogoText(fullText.slice(0, Math.ceil(obj.count)));
        },
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
            display: 'none',
          });
          gsap.to(menuBtnRef.current, {
            display: 'flex',
            opacity: 1,
            x: 0,
            rotation: 0,
            scale: 1,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
            pointerEvents: 'auto',
          });
        } else {
          // When scrolling back to home, show right section and hide menu
          gsap.to(navSectionRightRef.current, {
            display: 'flex',
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
            pointerEvents: 'auto',
          });
          gsap.to(menuBtnRef.current, {
            opacity: 0,
            x: 100,
            rotation: 180,
            scale: 0.5,
            duration: 0.5,
            ease: 'back.in(1.7)',
            pointerEvents: 'none',
            display: 'none',
          });
        }
      },
    });

    const currentTimers = soundTimersRef.current;
    return () => {
      ctx.revert();
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      // Clean up any pending sound timers
      currentTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [isMenuOpen]);

  // Show tooltip for 5 seconds whenever navbar becomes visible (only when muted and user hasn't enabled sound)
  useEffect(() => {
    let tooltipTimer;
    let wasHidden = false; // Track if navbar was previously hidden

    const handleTooltipVisibility = () => {
      const scrollY = window.scrollY || window.pageYOffset;

      if (scrollY <= 100 && isMuted && !hasEnabledSound) {
        // Navbar is visible, sound is muted, and user hasn't enabled sound yet
        if (wasHidden || scrollY === 0) {
          setShowSoundTooltip(true);
          wasHidden = false;

          // Hide after 5 seconds
          clearTimeout(tooltipTimer);
          tooltipTimer = setTimeout(() => {
            setShowSoundTooltip(false);
          }, 5000);
        }
      } else {
        // Navbar is hidden, sound is on, or user already enabled sound - hide tooltip
        if (scrollY > 100) {
          wasHidden = true;
        }
        setShowSoundTooltip(false);
        clearTimeout(tooltipTimer);
      }
    };

    // Initial display on page load (only if muted and user hasn't enabled sound)
    setTimeout(() => {
      if (isMuted && !hasEnabledSound) {
        setShowSoundTooltip(true);

        tooltipTimer = setTimeout(() => {
          setShowSoundTooltip(false);
        }, 5000);
      }
    }, 500);

    // Listen to scroll events
    window.addEventListener('scroll', handleTooltipVisibility);

    return () => {
      window.removeEventListener('scroll', handleTooltipVisibility);
      clearTimeout(tooltipTimer);
    };
  }, [isMuted, hasEnabledSound]);

  // Typing animation for tooltip text
  useEffect(() => {
    if (!showSoundTooltip) {
      setTooltipText('');
      setTooltipPop('');
      return;
    }

    let textIndex = 0;
    let popIndex = 0;
    let textInterval;
    let popInterval;

    // Start typing main text after entrance animation (800ms delay)
    const startTextTyping = setTimeout(() => {
      textInterval = setInterval(() => {
        if (textIndex < tooltipFullText.length) {
          setTooltipText(tooltipFullText.slice(0, textIndex + 1));
          textIndex++;
        } else {
          clearInterval(textInterval);

          // Start typing "POP!" after main text completes (small delay)
          setTimeout(() => {
            popInterval = setInterval(() => {
              if (popIndex < tooltipPopText.length) {
                setTooltipPop(tooltipPopText.slice(0, popIndex + 1));
                popIndex++;
              } else {
                clearInterval(popInterval);
              }
            }, 80);
          }, 100);
        }
      }, 50);
    }, 800);

    return () => {
      clearTimeout(startTextTyping);
      clearInterval(textInterval);
      clearInterval(popInterval);
    };
  }, [showSoundTooltip]);

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
        pointerEvents: 'auto',
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
        display: 'none',
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
          display: 'none',
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
          pointerEvents: 'auto',
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
          display: 'none',
        });
      }
    }
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setMuted(nextMuted);

    if (!nextMuted) {
      // User just turned sound ON - permanently dismiss tooltip for this session
      setHasEnabledSound(true);
      setShowSoundTooltip(false);
      sounds.pop();
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

            <button
              className={`sound-toggle ${isMuted ? 'muted' : ''}`}
              onClick={toggleSound}
              onMouseEnter={() => !isMuted && sounds.hover()}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              <div className="sound-waves">
                <span className="sound-wave"></span>
                <span className="sound-wave"></span>
                <span className="sound-wave"></span>
                <span className="sound-wave"></span>
              </div>
              <div className="btn-bubbles">
                <span className="btn-bubble"></span>
                <span className="btn-bubble"></span>
              </div>

              {/* Tooltip with bubble animation */}
              {showSoundTooltip && (
                <div className="sound-tooltip">
                  <div className="tooltip-bubble tooltip-bubble-1"></div>
                  <div className="tooltip-bubble tooltip-bubble-2"></div>
                  <div className="tooltip-bubble tooltip-bubble-3"></div>
                  <div className="tooltip-bubble tooltip-bubble-4"></div>
                  <div className="tooltip-bubble tooltip-bubble-5"></div>
                  <div className="tooltip-content">
                    <span className="tooltip-text">
                      {tooltipText}
                      <span className="typing-cursor"></span>
                    </span>
                    <span className="tooltip-pop">{tooltipPop}</span>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Menu Button - Shown when scrolled down */}
        <button ref={menuBtnRef} className="menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
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
            <a href="#home" onClick={toggleMenu}>
              Home
            </a>
          </li>
          <li>
            <a href="#tech-stack" onClick={toggleMenu}>
              Tech Stack
            </a>
          </li>
          <li>
            <a href="#projects" onClick={toggleMenu}>
              Projects
            </a>
          </li>
          <li>
            <a href="#contact" onClick={toggleMenu}>
              Let's Talk
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
