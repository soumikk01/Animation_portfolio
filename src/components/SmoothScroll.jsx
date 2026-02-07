import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Immediate scroll to top - before anything else
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Disable browser's scroll restoration to always start from top
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => {
        // Ultra-smooth easing with momentum feel
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      // Design choice: smoothTouch disabled for mobile performance
      // Touch device scrolling uses native browser behavior for better responsiveness
      // Desktop gets the enhanced smooth scroll experience
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
      normalizeWheel: true,
    });

    lenisRef.current = lenis;

    // Force Lenis to start at top immediately
    lenis.scrollTo(0, { immediate: true });

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Ensure scroll starts at top - optimized to reduce layout thrashing
    const forceScrollTop = () => {
      window.scrollTo(0, 0);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    };

    // Immediate scroll to top
    forceScrollTop();

    // One delayed attempt to ensure it sticks after initial render
    requestAnimationFrame(() => {
      setTimeout(forceScrollTop, 100);
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
