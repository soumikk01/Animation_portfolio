import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const ExperienceModal = ({ onStart }) => {
  const [isVisible, setIsVisible] = useState(true);
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const logoRef = useRef(null);

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
  }, []);

  const handleStart = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        onStart();
      }
    });

    tl.to(contentRef.current, {
      opacity: 0,
      y: -20,
      duration: 1,
      ease: 'power4.inOut'
    }).to(modalRef.current, {
      backgroundColor: 'rgba(8, 8, 8, 0)',
      backdropFilter: 'blur(0px)',
      duration: 1,
      ease: 'power4.inOut'
    }, '-=0.5').set(modalRef.current, { display: 'none' });
  };

  if (!isVisible) return null;

  return (
    <div ref={modalRef} className="experience-modal">
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
            <p>Turn your sound on / Switch to desktop</p>
          </div>
        </div>

        <button className="start-btn" onClick={handleStart}>
          <span className="btn-line"></span>
          <span className="btn-text">START EXPERIENCE</span>
          <span className="btn-line"></span>
        </button>
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
        }
        
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
        
        .dot {
          width: 4px;
          height: 4px;
          background-color: var(--accent-color);
          border-radius: 50%;
        }
        
        .start-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          width: 100%;
          padding: 1rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          transition: all 0.3s ease;
        }
        
        .btn-text {
          font-family: var(--font-heading);
          font-size: 0.9rem;
        }
        
        .btn-line {
          height: 1px;
          background-color: rgba(255, 255, 255, 0.2);
          flex: 1;
        }
        
        .start-btn:hover .btn-line {
          background-color: var(--accent-color);
        }
        
        .start-btn:hover .btn-text {
          color: var(--accent-color);
        }
      `}</style>
    </div>
  );
};

export default ExperienceModal;
