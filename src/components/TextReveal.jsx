import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';

const TextReveal = ({ children, className, direction = 'up', delay = 0, repeatOnScroll = false }) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, { types: 'lines,words,chars' });

    gsap.fromTo(
      split.chars,
      {
        y: direction === 'down' ? -150 : 80,
        opacity: 0,
        rotateX: direction === 'down' ? 45 : -45,
        scale: 0.8,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        stagger: 0.05,
        duration: 1,
        delay: delay,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
          once: !repeatOnScroll,
          toggleActions: repeatOnScroll ? 'play none none reverse' : 'play none none none',
        },
      }
    );

    return () => {
      split.revert();
    };
  }, []);

  return (
    <div ref={textRef} className={`text-reveal ${className}`}>
      {children}
    </div>
  );
};

export default TextReveal;
