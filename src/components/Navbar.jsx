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
            display: 'flex', // ensure it becomes flex when visible
          });
        } else {
          // When scrolling back to home, show right section and hide menu
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

    return () => {
      ctx.revert();
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [isMenuOpen]);



  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);

    if (newState) {
      menuOpenedAtRef.current = window.scrollY || window.pageYOffset;

      // Disable ScrollTrigger animations while menu is open
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.disable();
      }
      // Hide the navbar section when menu opens (if it was visible)
      gsap.to(navSectionRightRef.current, {
        autoAlpha: 0,
        scale: 0.8,
        duration: 0.5,
        ease: 'expo.out',
        overwrite: true,
      });

      // Animate overlay in
      gsap.to(menuOverlayRef.current, {
        autoAlpha: 1,
        duration: 0.4,
        ease: 'power2.out',
        pointerEvents: 'auto',
      });

      // Stagger animate links in
      gsap.fromTo(
        menuLinksRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.5)',
          delay: 0.2,
        }
      );
      // Hide the menu button when menu overlay is open
      gsap.to(menuBtnRef.current, {
        autoAlpha: 0,
        x: 60,
        rotation: 180,
        scale: 0.6,
        duration: 0.4,
        ease: 'power3.inOut',
        overwrite: true,
      });
    } else {

      // Animate overlay out
      gsap.to(menuOverlayRef.current, {
        autoAlpha: 0,
        duration: 0.4,
        ease: 'power2.in',
        pointerEvents: 'none',
      });

      // Animate links out
      gsap.to(menuLinksRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.3,
        stagger: -0.05,
        ease: 'power2.in',
      });

      // Re-enable ScrollTrigger
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.enable();
      }

      // When menu closes, check scroll position to determine if navbar should stay visible
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 100) {
        // Hide navbar section if still scrolled down
        gsap.to(navSectionRightRef.current, {
          autoAlpha: 0,
          scale: 0.8,
          duration: 0.6,
          ease: 'power3.inOut',
          overwrite: true,
        });
        // Show menu button again
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
        // At top of page - hide menu button
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
    }
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
