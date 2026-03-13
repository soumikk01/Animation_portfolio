import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


import './GlobalAnimations.scss';
import './Navbar.scss';

import { useSound } from '../hooks/useSound';

const Navbar = () => {
  const { playHover, playClick } = useSound();
  const navRef = useRef();
  const navSectionRightRef = useRef();
  const menuBtnRef = useRef();
  const menuOverlayRef = useRef();
  const menuLinksRef = useRef([]);
  const scrollTriggerRef = useRef(null);
  const menuOpenedAtRef = useRef(0);
  const [logoText, setLogoText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fullText = 'PORTFOLIO';

  const isMenuOpenRef = useRef(isMenuOpen);
  
  // Sync ref with state
  useEffect(() => {
    isMenuOpenRef.current = isMenuOpen;
  }, [isMenuOpen]);

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

    // Responsive Scroll Logic
    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // Desktop Scroll-based shrink/expand animation
      scrollTriggerRef.current = ScrollTrigger.create({
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
          const scrollY = self.scroll();

          if (isMenuOpenRef.current) {
            if (Math.abs(scrollY - menuOpenedAtRef.current) > 100) {
              // Close menu if user scrolls away
              toggleMenu();
            }
            return;
          }

          if (scrollY > 100) {
            gsap.to(navSectionRightRef.current, {
              autoAlpha: 0,
              scale: 0.8,
              duration: 0.6,
              ease: 'power3.inOut',
              overwrite: true,
            });
            gsap.to(menuBtnRef.current, {
              autoAlpha: 1,
              x: 0,
              rotation: 0,
              scale: 1,
              duration: 0.8,
              ease: 'expo.out',
              overwrite: true,
              display: 'flex',
            });
          } else {
            gsap.to(navSectionRightRef.current, {
              autoAlpha: 1,
              scale: 1,
              duration: 0.8,
              ease: 'expo.out',
              overwrite: true,
              display: 'flex',
            });
            gsap.to(menuBtnRef.current, {
              autoAlpha: 0,
              x: 60,
              rotation: 180,
              scale: 0.6,
              duration: 0.6,
              ease: 'power3.inOut',
              overwrite: true,
            });
          }
        },
      });
    });

    mm.add("(max-width: 768px)", () => {
      // On mobile, ensure menu button is visible and nav section right is hidden
      gsap.set(navSectionRightRef.current, { autoAlpha: 0, display: 'none' });
      gsap.set(menuBtnRef.current, { 
        autoAlpha: 1, 
        x: 0, 
        rotation: 0, 
        scale: 1, 
        display: 'flex',
        pointerEvents: 'auto'
      });
    });

    return () => {
      ctx.revert();
      mm.revert();
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, []); // Only run on mount



  const toggleMenu = () => {
    // We need to use the functional update or ref logic since this function 
    // might be called from within the ScrollTrigger onUpdate which 
    // closure-traps the initial state if not careful.
    // However, it's called from React event handlers too.
    
    setIsMenuOpen(prev => {
      const newState = !prev;
      
      if (newState) {
        menuOpenedAtRef.current = window.scrollY || window.pageYOffset;

        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.disable();
        }

        // Animate overlay in
        gsap.fromTo(menuOverlayRef.current, 
          { autoAlpha: 0, scale: 0.8, x: 20, y: -20 },
          { 
            autoAlpha: 1, 
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.6, 
            ease: 'expo.out',
            pointerEvents: 'auto' 
          }
        );

        // Stagger animate links in
        gsap.fromTo(
          menuLinksRef.current,
          { y: 40, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power4.out',
            delay: 0.2,
          }
        );
        
        gsap.to(menuBtnRef.current, {
          scale: 1.1,
          duration: 0.4,
          ease: 'back.out(2)',
        });
      } else {
        // Close menu
        gsap.to(menuOverlayRef.current, {
          autoAlpha: 0,
          duration: 0.4,
          ease: 'power3.in',
          pointerEvents: 'none',
        });

        gsap.to(menuLinksRef.current, {
          y: -40,
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          stagger: -0.05,
          ease: 'power3.in',
        });

        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.enable();
        }

        const scrollY = window.scrollY || window.pageYOffset;
        const isMobile = window.innerWidth <= 768;

        if (!isMobile) {
          if (scrollY > 100) {
            gsap.to(menuBtnRef.current, {
              autoAlpha: 1,
              x: 0,
              rotation: 0,
              scale: 1,
              duration: 0.6,
              ease: 'expo.out',
            });
          } else {
            gsap.to(menuBtnRef.current, {
              autoAlpha: 0,
              x: 60,
              rotation: 180,
              scale: 0.6,
              duration: 0.5,
              ease: 'power3.inOut',
            });
          }
        } else {
          gsap.to(menuBtnRef.current, {
            autoAlpha: 1,
            scale: 1,
            x: 0,
            duration: 0.5,
            ease: 'expo.out',
          });
        }
      }
      return newState;
    });
  };



  return (
    <nav ref={navRef} className="navbar">
      {/* Left Section - Logo (Separate Container) */}
      <div className="nav-section nav-section-left">
        <div className="nav-logo">
          <span className="logo-text">

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
              <a href="#home" className="nav-link" onMouseEnter={playHover} onClick={playClick}>
                <span className="link-text" data-text="Home">Home</span>
              </a>
            </li>
            <li>
              <a href="#tech-stack" className="nav-link" onMouseEnter={playHover} onClick={playClick}>
                <span className="link-text" data-text="Tech Stack">Tech Stack</span>
              </a>
            </li>
            <li>
              <a href="#projects" className="nav-link" onMouseEnter={playHover} onClick={playClick}>
                <span className="link-text" data-text="Projects">Projects</span>
              </a>
            </li>
          </ul>

          <div className="nav-action">
            <a href="#contact" className="contact-btn" onMouseEnter={playHover} onClick={playClick}>
              <span className="btn-text" data-text="Let's Talk">Let's Talk</span>
              <div className="btn-glow" />
            </a>


          </div>
        </div>

        {/* Menu Button - Shown when scrolled down */}
        <button 
          ref={menuBtnRef} 
          className="menu-btn" 
          onClick={() => { playClick(); toggleMenu(); }} 
          onMouseEnter={playHover}
          aria-label="Toggle menu"
        >

          <div className="menu-lines">
            <span className={`menu-line ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`menu-line ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`menu-line ${isMenuOpen ? 'open' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile/Shrunk Menu Overlay */}
      <div ref={menuOverlayRef} className={`menu-overlay`}>
        <ul className="menu-overlay-links">
          <li ref={(el) => (menuLinksRef.current[0] = el)}>
            <a href="#home" onMouseEnter={playHover} onClick={() => { playClick(); toggleMenu(); }}>
              Home
            </a>
          </li>
          <li ref={(el) => (menuLinksRef.current[1] = el)}>
            <a href="#tech-stack" onMouseEnter={playHover} onClick={() => { playClick(); toggleMenu(); }}>
              Tech Stack
            </a>
          </li>
          <li ref={(el) => (menuLinksRef.current[2] = el)}>
            <a href="#projects" onMouseEnter={playHover} onClick={() => { playClick(); toggleMenu(); }}>
              Projects
            </a>
          </li>
          <li ref={(el) => (menuLinksRef.current[3] = el)}>
            <a href="#contact" onMouseEnter={playHover} onClick={() => { playClick(); toggleMenu(); }}>
              Let's Talk
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
