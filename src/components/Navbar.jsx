import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


import './GlobalAnimations.scss';
import './Navbar.scss';

const Navbar = () => {
  const navRef = useRef();
  const navSectionRightRef = useRef();
  const menuBtnRef = useRef();
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
              <a href="#home" className="nav-link">
                <span className="link-text">Home</span>

              </a>
            </li>
            <li>
              <a href="#tech-stack" className="nav-link">
                <span className="link-text">Tech Stack</span>

              </a>
            </li>
            <li>
              <a href="#projects" className="nav-link">
                <span className="link-text">Projects</span>

              </a>
            </li>
          </ul>

          <div className="nav-action">
            <a href="#contact" className="contact-btn">
              <span className="btn-text">Let's Talk</span>

              <div className="btn-glow" />
            </a>


          </div>
        </div>

        {/* Menu Button - Shown when scrolled down */}
        <button ref={menuBtnRef} className="menu-btn" onClick={toggleMenu} aria-label="Toggle menu">

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
