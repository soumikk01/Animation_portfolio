import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';

const TextReveal = ({ children, className = '' }) => {
    const textRef = useRef(null);

    useEffect(() => {
        if (!textRef.current) return;

        const split = new SplitType(textRef.current, { types: 'lines,words,chars' });

        gsap.fromTo(split.chars,
            {
                y: 100,
                opacity: 0,
                rotateX: -90
            },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                stagger: 0.02,
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
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
