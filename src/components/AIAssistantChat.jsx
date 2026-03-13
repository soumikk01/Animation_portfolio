import { useState, useRef, useEffect } from 'react';
import TypingAnimation from './TypingAnimation';
import { getGeminiEndpoint, API_CONFIG } from '../utils/apiConfig';
import airiLogo from '../assets/airi-logo.png';
import { useSound } from '../hooks/useSound';

function AIAssistantChat({ isFloating = false, onClose }) {
  const { playHover, playClick } = useSound();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "👋 Hi! I'm Airi🌸, your AI assistant. Ask me anything about this portfolio, the projects, skills, or experience!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyMissing] = useState(!import.meta.env.VITE_GEMINI_API_KEY);
  const messagesEndRef = useRef(null);
  const lastMessageTime = useRef(0);
  const MAX_MESSAGE_LENGTH = 500;
  const SESSION_MESSAGE_LIMIT = 15;
  const RATE_LIMIT_MS = 1500;

  const [messageCount, setMessageCount] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getGeminiResponse = async (userMessage) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return '⚠️ API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.';
    }

    const portfolioContext = `You are Airi🌸, an AI assistant for a Full-Stack Developer's portfolio website. 
The developer specializes in:
- Frontend: React, JavaScript, HTML/CSS, responsive design, animations
- Backend: Java, RESTful APIs, Node.js
- Tools: Git, CI/CD, databases
- Current focus: Building modern web experiences with cutting-edge technologies

Answer questions about the portfolio, projects, skills, and experience in a friendly, professional manner. 
Keep responses very concise and helpful (maximum 80 words).`;

    try {
      const response = await fetch(getGeminiEndpoint(apiKey), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${portfolioContext}\n\nUser question: ${userMessage}` }],
            },
          ],
          generationConfig: API_CONFIG.GEMINI.DEFAULT_PARAMS,
        }),
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        if (import.meta.env.DEV) {
          console.error('Gemini API Error:', data.error.message);
        }
        return 'Error...!!';
      } else {
        return 'Error...!!';
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('AI Assistant Error:', error.message);
      }
      return 'Error...!!';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    playClick();

    const now = Date.now();
    if (now - lastMessageTime.current < RATE_LIMIT_MS) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Slow down! Please wait a moment before sending another message.',
        },
      ]);
      return;
    }

    if (messageCount >= SESSION_MESSAGE_LIMIT) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "⚠️ Session limit reached. You've sent 15 messages already! Please refresh to chat more.",
        },
      ]);
      return;
    }

    if (trimmedInput.length > MAX_MESSAGE_LENGTH) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Message too long! Please keep messages under ${MAX_MESSAGE_LENGTH} characters.`,
        },
      ]);
      return;
    }

    const userMessage = trimmedInput;
    setInput('');

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setMessageCount((prev) => prev + 1);
    lastMessageTime.current = Date.now();

    const aiResponse = await getGeminiResponse(userMessage);

    setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setInput(value);
    }
  };

  return (
    <div className={`ai-chat-box ${isFloating ? 'floating' : ''}`}>
      <div className="chat-header">
        <div className="assistant-logo">
          <img src={airiLogo} alt="Airi Logo" />
        </div>
        <div className="assistant-name-status">
          <span className="assistant-name">Airi🌸</span>
          <span className="assistant-status">Online</span>
        </div>
        {isFloating && (
          <button className="chat-close-btn" onClick={onClose} aria-label="Close chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="chat-messages" data-lenis-prevent>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role} ${message.content === 'Error...!!' ? 'error' : ''}`}
          >
            {message.role === 'assistant' && (
              <div className="message-avatar">
                <img src={airiLogo} alt="Airi" />
              </div>
            )}
            <div className="message-bubble">
              {message.role === 'assistant' && index === messages.length - 1 ? (
                <TypingAnimation text={message.content} speed={25} showCursor={false} />
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-bubble loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={
              apiKeyMissing
                ? 'AI chat unavailable - API key not configured'
                : 'Ask about projects, skills, experience...'
            }
            disabled={isLoading || apiKeyMissing}
            className="chat-input"
            maxLength={MAX_MESSAGE_LENGTH}
            aria-label="Chat message input"
            onMouseEnter={playHover}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || apiKeyMissing}
            className="send-button"
            aria-label="Send message"
            onMouseEnter={playHover}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

export default AIAssistantChat;
