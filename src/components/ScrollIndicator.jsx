import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ScrollIndicator.scss';

const ScrollIndicator = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Reveal animation on mount
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 2.2 }
    );

    // Character wave animation
    const chars = textRef.current.querySelectorAll('.scroll-char');
    gsap.to(chars, {
      y: -5,
      opacity: 0.5,
      duration: 0.8,
      stagger: {
        each: 0.1,
        yoyo: true,
        repeat: -1
      },
      ease: 'sine.inOut',
      delay: 3 // Wait for intro sequence before animating characters
    });

    // Line running down animation
    const lineTl = gsap.timeline({ repeat: -1, delay: 2.5 });
    
    lineTl.fromTo('.scroll-line-inner', {
      scaleY: 0,
      transformOrigin: 'top'
    }, {
      scaleY: 1,
      duration: 1.2,
      ease: 'expo.inOut'
    }).to('.scroll-line-inner', {
      scaleY: 0,
      transformOrigin: 'bottom',
      duration: 1.2,
      ease: 'expo.inOut'
    });

    return () => {
      gsap.killTweensOf(chars);
      gsap.killTweensOf(containerRef.current);
      lineTl.kill();
    };
  }, []);

  return (
    <div className="scroll-indicator-wrapper" ref={containerRef}>
      <div className="scroll-text" ref={textRef}>
        {"SCROLL".split('').map((char, i) => (
          <span key={i} className="scroll-char">{char}</span>
        ))}
      </div>
      <div className="scroll-line-container">
        <div className="scroll-line-inner"></div>
      </div>
    </div>
  );
};

export default ScrollIndicator;
