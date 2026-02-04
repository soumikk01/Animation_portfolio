import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * FadeIn component - Simple fade and slide up animation on scroll
 * Use this for any text element (headings, paragraphs, etc.)
 */
function FadeIn({ children, className = '', delay = 0, direction = 'up', duration = 0.8 }) {
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // Animation direction settings
        let yStart = 0;
        let xStart = 0;

        switch (direction) {
            case 'up':
                yStart = 50;
                break;
            case 'down':
                yStart = -50;
                break;
            case 'left':
                xStart = 50;
                break;
            case 'right':
                xStart = -50;
                break;
        }

        // Set initial state
        gsap.set(element, {
            opacity: 0,
            y: yStart,
            x: xStart,
        });

        // Create scroll-triggered animation
        gsap.to(element, {
            opacity: 1,
            y: 0,
            x: 0,
            duration: duration,
            delay: delay,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger === element) {
                    trigger.kill();
                }
            });
        };
    }, [delay, direction, duration]);

    return (
        <div ref={elementRef} className={className}>
            {children}
        </div>
    );
}

export default FadeIn;
