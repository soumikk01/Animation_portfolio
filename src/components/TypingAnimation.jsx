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
        let isCancelled = false;
        let typingInterval;

        // Start typing after delay
        const startTimeout = setTimeout(() => {
            if (isCancelled) return;

            // Initial reset if needed
            setDisplayedText('');
            setIsComplete(false);
            indexRef.current = 0;

            typingInterval = setInterval(() => {
                if (isCancelled) return;
                if (indexRef.current < text.length) {
                    setDisplayedText(text.substring(0, indexRef.current + 1));
                    indexRef.current++;
                } else {
                    setIsComplete(true);
                    clearInterval(typingInterval);
                }
            }, speed);
        }, delay);

        return () => {
            isCancelled = true;
            clearTimeout(startTimeout);
            if (typingInterval) clearInterval(typingInterval);
        };
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
