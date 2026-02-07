import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * StaggerFadeIn component - Animates multiple children with stagger effect
 * Perfect for lists, tech items, project items, etc.
 */
function StaggerFadeIn({ children, className = '', staggerDelay = 0.1, direction = 'up' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.children;
    if (!items.length) return;

    // Animation direction settings
    let yStart = 0;
    let xStart = 0;

    switch (direction) {
      case 'up':
        yStart = 30;
        break;
      case 'down':
        yStart = -30;
        break;
      case 'left':
        xStart = 30;
        break;
      case 'right':
        xStart = -30;
        break;
    }

    // Set initial state with subtle effects
    gsap.set(items, {
      opacity: 0,
      y: yStart,
      x: xStart,
      scale: 0.95,
    });

    // Create staggered animation
    gsap.to(items, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: 0.7,
      stagger: staggerDelay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        once: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [staggerDelay, direction]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

export default StaggerFadeIn;
