import { useEffect, useRef, useState } from 'react';
import './TypingAnimation.css';

/**
 * TypingAnimation component - Creates a realistic typing effect
 */
function TypingAnimation({
    text = '',
    speed = 50,
    delay = 0,
    className = '',
    showCursor = true,
    cursorChar = '|'
}) {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const indexRef = useRef(0);

    useEffect(() => {
        // Reset when text changes
        setDisplayedText('');
        setIsComplete(false);
        indexRef.current = 0;

        // Start typing after delay
        const startTimeout = setTimeout(() => {
            const typingInterval = setInterval(() => {
                if (indexRef.current < text.length) {
                    setDisplayedText(text.substring(0, indexRef.current + 1));
                    indexRef.current++;
                } else {
                    setIsComplete(true);
                    clearInterval(typingInterval);
                }
            }, speed);

            return () => clearInterval(typingInterval);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [text, speed, delay]);

    return (
        <span className={`typing-animation ${className}`}>
            {displayedText}
            {showCursor && !isComplete && (
                <span className="typing-cursor">{cursorChar}</span>
            )}
        </span>
    );
}

export default TypingAnimation;
