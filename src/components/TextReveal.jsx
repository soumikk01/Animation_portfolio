import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';

const TextReveal = ({ children, className }) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, { types: 'lines,words,chars' });

    gsap.fromTo(
      split.chars,
      {
        y: 80,
        opacity: 0,
        rotateX: -45,
        scale: 0.8,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        stagger: 0.02,
        duration: 1,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
          once: true,
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
