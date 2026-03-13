import { useState, useEffect, useRef } from 'react';
import AIAssistantChat from './AIAssistantChat';
import { useSound } from '../hooks/useSound';
import airiLogo from '../assets/airi-logo.png';
import './FloatingAIButton.scss';

function FloatingAIButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMerged, setIsMerged] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const { playHover, playClick } = useSound();
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const contactSection = document.getElementById('contact');
      if (!contactSection) return;

      const rect = contactSection.getBoundingClientRect();
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Detect if we are at the very top (near navbar)
      if (scrollY < 50) {
        setIsAtTop(true);
      } else {
        setIsAtTop(false);
      }

      // Detect if we are near or in the contact section
      // We want to start the "merge" when the contact section starts coming into view
      if (rect.top <= windowHeight * 0.5) {
        setIsMerged(true);
        // If chat was open, we might want to close it or let it stay until it's fully merged
        if (isOpen) {
          // Keep it open for a bit or close it immediately? 
          // Merging implies it's now "there" in the contact section.
          setIsOpen(false);
        }
      } else {
        setIsMerged(false);
      }

      // Hide button completely if we are deep into the contact section
      if (rect.top <= 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const toggleChat = () => {
    playClick();
    setIsOpen(!isOpen);
  };

  if (isMerged && !isVisible) return null;

  return (
    <div className={`floating-ai-container ${isMerged ? 'merged' : ''} ${isVisible ? 'visible' : 'hidden'} ${isAtTop ? 'at-top' : ''}`}>
      <button 
        ref={buttonRef}
        className={`floating-ai-button ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        onMouseEnter={playHover}
        aria-label="Open AI Assistant"
      >
        <div className="button-glow"></div>
        <div className="logo-wrapper">
          <svg className="ai-svg-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.85 8.15L21 11L14.85 13.85L12 20L9.15 13.85L3 11L9.15 8.15L12 2Z" fill="url(#gemini-grad)" />
            <defs>
              <linearGradient id="gemini-grad" x1="3" y1="2" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4285F4" />
                <stop offset="0.5" stopColor="#9B72CB" />
                <stop offset="1" stopColor="#D96570" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="button-label">Ask Airi🌸</span>
        <div className="button-pulse"></div>
      </button>

      {isOpen && (
        <AIAssistantChat isFloating={true} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}

export default FloatingAIButton;
