import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const ExperienceModal = ({ onStart }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [ripples, setRipples] = useState([]);
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const logoRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Initial entrance animation
    const tl = gsap.timeline();
    tl.fromTo(logoRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power4.out' }
    ).fromTo('.modal-option',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' },
      '-=1'
    ).fromTo('.start-btn',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1, ease: 'expo.out' },
      '-=0.5'
    );

    // Magnetic button effect
    const handleMouseMove = (e) => {
      if (!buttonRef.current) return;

      const btn = buttonRef.current;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = 100;

      if (distance < maxDistance) {
        const strength = 1 - distance / maxDistance;
        gsap.to(btn, {
          x: x * strength * 0.3,
          y: y * strength * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
      }
    };

    const handleMouseLeave = () => {
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    if (buttonRef.current) {
      buttonRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (buttonRef.current) {
        buttonRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const handleButtonClick = (e) => {
    // Create ripple effect
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = {
      x,
      y,
      id: Date.now()
    };

    setRipples(prev => [...prev, ripple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);

    // Proceed with normal start action
    handleStart();
  };

  const handleStart = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        onStart();
      }
    });

    // Cinematic rush animation for lines
    tl.to('.left-line', {
      x: -window.innerWidth,
      opacity: 0,
      duration: 1,
      ease: 'power4.in'
    }, 0)
      .to('.right-line', {
        x: window.innerWidth,
        opacity: 0,
        duration: 1,
        ease: 'power4.in'
      }, 0)
      .to(contentRef.current, {
        opacity: 0,
        scale: 1.1,
        filter: 'blur(10px)',
        duration: 1.2,
        ease: 'power3.inOut'
      }, 0.2)
      .to(modalRef.current, {
        backgroundColor: 'rgba(8, 8, 8, 0)',
        backdropFilter: 'blur(0px)',
        duration: 1,
        ease: 'power4.inOut'
      }, 0.5)
      .set(modalRef.current, { display: 'none' });
  };

  if (!isVisible) return null;

  return (
    <div ref={modalRef} className="experience-modal">
      {/* Floating Bubbles */}
      <div className="bubbles-container">
        <div className="bubble bubble-1"><span>Code</span></div>
        <div className="bubble bubble-2"><span>Creative</span></div>
        <div className="bubble bubble-3"><span>Dynamic</span></div>
        <div className="bubble bubble-4"><span>Bubble</span></div>
        <div className="bubble bubble-5"><span>AI</span></div>
        <div className="bubble bubble-6"><span>Pop</span></div>
        <div className="bubble bubble-7"><span>Design</span></div>
        <div className="bubble bubble-8"><span>React</span></div>
      </div>

      {/* Decorative Background Phrases */}
      <div className="background-phrases">
        <div className="floating-phrase p-1">Welcome to the Bubble Space</div>
        <div className="floating-phrase p-6">Ethereal Experience</div>
      </div>

      <div ref={contentRef} className="modal-content">
        <div ref={logoRef} className="modal-logo">
          <p className="text-accent">Portfolio</p>
        </div>

        <div className="modal-options">
          <div className="modal-option">
            <span className="dot"></span>
            <p>For the best experience</p>
          </div>
          <div className="modal-option">
            <span className="dot"></span>
            <p className="highlight-text">Turn your sound on / Switch to desktop</p>
          </div>
        </div>

        <div className="button-container">
          <div className="side-line left-line"></div>
          <button
            ref={buttonRef}
            className="start-btn"
            onClick={handleButtonClick}
          >
            <span className="btn-bg"></span>
            <span className="btn-glow"></span>
            {ripples.map(ripple => (
              <span
                key={ripple.id}
                className="ripple"
                style={{
                  left: ripple.x,
                  top: ripple.y
                }}
              />
            ))}
            <span className="btn-line"></span>
            <span className="btn-text">START EXPERIENCE</span>
            <span className="btn-line"></span>
          </button>
          <div className="side-line right-line"></div>
        </div>

        <div className="fashion-soul-container">
          <p className="fashion-soul-text">
            Scrolling with <span className="word-fashion">Fashion</span> & <span className="word-soul">Soul</span>
          </p>
        </div>
      </div>

      <style>{`
        .experience-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(8, 8, 8, 0.4); /* Semi-transparent */
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          backdrop-filter: blur(8px);
          overflow: hidden;
        }

        /* Floating Bubbles */
        .bubbles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(139, 92, 246, 0.2),
            rgba(139, 92, 246, 0.05) 70%,
            transparent
          );
          backdrop-filter: blur(2px);
          border: 1px solid rgba(139, 92, 246, 0.2);
          animation: float linear infinite;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bubble span {
          color: rgba(139, 92, 246, 0.8);
          font-size: 0.7em;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
          white-space: nowrap;
        }

        @keyframes float {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(1);
            opacity: 0;
          }
        }

        .bubble-1 {
          width: 60px;
          height: 60px;
          left: 10%;
          animation-duration: 15s;
          animation-delay: 0s;
        }

        .bubble-2 {
          width: 40px;
          height: 40px;
          left: 25%;
          animation-duration: 12s;
          animation-delay: 2s;
        }

        .bubble-3 {
          width: 80px;
          height: 80px;
          left: 40%;
          animation-duration: 18s;
          animation-delay: 1s;
        }

        .bubble-4 {
          width: 50px;
          height: 50px;
          left: 60%;
          animation-duration: 14s;
          animation-delay: 3s;
        }

        .bubble-5 {
          width: 70px;
          height: 70px;
          left: 75%;
          animation-duration: 16s;
          animation-delay: 0.5s;
        }

        .bubble-6 {
          width: 30px;
          height: 30px;
          left: 85%;
          animation-duration: 10s;
          animation-delay: 4s;
        }

        .bubble-7 {
          width: 100px;
          height: 100px;
          left: 50%;
          animation-duration: 20s;
          animation-delay: 1.5s;
        }

        .bubble-8 {
          width: 45px;
          height: 45px;
          left: 15%;
          animation-duration: 13s;
          animation-delay: 2.5s;
        }

        /* Background Phrases */
        .background-phrases {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .floating-phrase {
          position: absolute;
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: clamp(2rem, 8vw, 6rem);
          color: rgba(255, 255, 255, 0.03);
          -webkit-text-stroke: 1px rgba(139, 92, 246, 0.1);
          white-space: nowrap;
          text-transform: uppercase;
          animation: floatPhrase linear infinite;
        }

        @keyframes floatPhrase {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(1deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        .p-1 { top: 10%; left: -5%; animation-duration: 25s; }
        .p-2 { top: 30%; right: -10%; animation-duration: 30s; opacity: 0.5; }
        .p-3 { bottom: 20%; left: 15%; animation-duration: 22s; font-size: 4rem; }
        .p-4 { top: 50%; right: 15%; animation-duration: 28s; }
        .p-5 { bottom: 5%; right: 5%; animation-duration: 35s; }
        .p-6 { top: 70%; left: -2%; animation-duration: 32s; opacity: 0.4; }
        
        .modal-content {
          text-align: center;
          max-width: 500px;
          padding: 2rem;
        }
        
        .modal-logo h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          letter-spacing: 0.1em;
        }
        
        .modal-logo p {
          font-size: 0.9rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin-bottom: 3rem;
        }
        
        .modal-options {
          margin-bottom: 4rem;
        }
        
        .modal-option {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 0.8rem;
          font-size: 0.9rem;
          color: var(--secondary-text);
        }

        .highlight-text {
          background: linear-gradient(
            90deg,
            #fff 0%,
            var(--accent-color) 25%,
            #fff 50%,
            var(--accent-color) 75%,
            #fff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerHighlight 3s linear infinite, Pulse 2s ease-in-out infinite;
          font-weight: 700 !important;
          filter: drop-shadow(0 0 5px rgba(139, 92, 246, 0.3));
        }

        @keyframes shimmerHighlight {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        @keyframes Pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.02); opacity: 1; }
        }
        
        .dot {
          width: 4px;
          height: 4px;
          background-color: var(--accent-color);
          border-radius: 50%;
        }

        /* Button Container with Side Lines */
        .button-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          width: 100%;
        }

        .side-line {
          height: 2px;
          min-width: 80px;
          background: rgba(255, 255, 255, 0.4);
          flex: 1;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .button-container:hover .side-line {
          background: rgba(255, 255, 255, 0.7);
          height: 3px;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
        }

        .fashion-soul-container {
          margin-top: 2.5rem;
          display: flex;
          justify-content: center;
          width: 100%;
          perspective: 1000px;
        }

        .fashion-soul-text {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          display: inline-flex;
          align-items: center;
          gap: 0.8em;
          font-style: italic;
          white-space: nowrap;
        }

        .word-fashion, .word-soul {
          display: inline-block;
          position: relative;
          color: var(--accent-color);
          text-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
        }

        .word-fashion {
          animation: swapFashion 6s cubic-bezier(0.7, 0, 0.3, 1) infinite;
        }

        .word-soul {
          animation: swapSoul 6s cubic-bezier(0.7, 0, 0.3, 1) infinite;
        }

        @keyframes swapFashion {
          0%, 20% { transform: translate(0, 0) scale(1); z-index: 1; }
          45%, 55% { transform: translate(6.5em, -5px) scale(1.1); z-index: 2; color: #fff; }
          80%, 100% { transform: translate(0, 0) scale(1); z-index: 1; }
        }

        @keyframes swapSoul {
          0%, 20% { transform: translate(0, 0) scale(1); z-index: 1; }
          45%, 55% { transform: translate(-6.5em, 5px) scale(0.9); z-index: 0; opacity: 0.5; }
          80%, 100% { transform: translate(0, 0) scale(1); z-index: 1; }
        }
        
        .start-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          width: auto;
          min-width: 300px;
          padding: 1.2rem 2rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          position: relative;
          overflow: hidden;
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 50px;
          background: transparent;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }

        /* Animated Gradient Background */
        .btn-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            45deg,
            rgba(139, 92, 246, 0.1) 0%,
            rgba(236, 72, 153, 0.1) 25%,
            rgba(59, 130, 246, 0.1) 50%,
            rgba(139, 92, 246, 0.1) 75%,
            rgba(236, 72, 153, 0.1) 100%
          );
          background-size: 300% 300%;
          animation: gradientShift 8s ease infinite;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .start-btn:hover .btn-bg {
          opacity: 1;
        }

        /* Glow Effect */
        .btn-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          background: radial-gradient(
            circle,
            rgba(139, 92, 246, 0.6) 0%,
            rgba(236, 72, 153, 0.4) 50%,
            transparent 70%
          );
          border-radius: 50%;
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .start-btn:hover .btn-glow {
          width: 300px;
          height: 300px;
          opacity: 1;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 0.6;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.1); 
            opacity: 1;
          }
        }

        /* Ripple Effect */
        .ripple {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(139, 92, 246, 0.6) 40%,
            transparent 70%
          );
          transform: translate(-50%, -50%) scale(0);
          animation: rippleEffect 0.6s ease-out forwards;
          pointer-events: none;
        }

        @keyframes rippleEffect {
          to {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
          }
        }

        /* Hover 3D Transform */
        .start-btn:hover {
          transform: translateY(-4px) scale(1.03);
          border-color: var(--accent-color);
          box-shadow: 
            0 10px 40px rgba(139, 92, 246, 0.4),
            0 0 60px rgba(139, 92, 246, 0.2),
            inset 0 0 30px rgba(139, 92, 246, 0.1);
        }

        .start-btn:active {
          transform: translateY(-1px) scale(1);
        }
        
        .btn-text {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          position: relative;
          z-index: 2;
          color: rgba(139, 92, 246, 0.9);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 0.2em;
        }

        .start-btn:hover .btn-text {
          letter-spacing: 0.3em;
          color: #fff;
          text-shadow: 
            0 0 20px rgba(139, 92, 246, 0.8),
            0 0 40px rgba(139, 92, 246, 0.4);
        }
        
        .btn-line {
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.2) 50%,
            transparent 100%
          );
          flex: 1;
          position: relative;
          z-index: 2;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .start-btn:hover .btn-line {
          background: linear-gradient(
            90deg,
            transparent 0%,
            var(--accent-color) 50%,
            transparent 100%
          );
          height: 3px;
          box-shadow: 
            0 0 10px var(--accent-color),
            0 0 20px rgba(139, 92, 246, 0.4);
          animation: lineGlow 1.5s ease-in-out infinite;
        }

        @keyframes lineGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @media (max-width: 768px) {
          .modal-content {
            padding: 1.5rem;
            width: 90%;
          }
          
          .modal-logo h1 {
            font-size: 2rem;
          }

          .modal-options {
            margin-bottom: 3rem;
          }

          .modal-option {
            font-size: 0.85rem;
            text-align: left;
            justify-content: flex-start;
          }

          .start-btn {
            padding: 1.2rem;
            gap: 15px;
          }

          .btn-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ExperienceModal;
