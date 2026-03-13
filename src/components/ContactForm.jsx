import { useState, useRef, useEffect } from 'react';
import FadeIn from './FadeIn';
import TextReveal from './TextReveal';
import TypingAnimation from './TypingAnimation';
import SocialButtons from './SocialButtons';
import AIAssistantChat from './AIAssistantChat';
import { getGeminiEndpoint, API_CONFIG } from '../utils/apiConfig';
import airiLogo from '../assets/airi-logo.png';
import { useSound } from '../hooks/useSound';
import './ContactForm.scss';

function ContactForm() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-bg-effects">
        <div className="glass-pane"></div>
        <div className="contact-glow"></div>
        <div className="contact-glow contact-glow-2"></div>
        <div className="bg-bubble bubble-1"></div>
        <div className="bg-bubble bubble-2"></div>
        <div className="bg-bubble bubble-3"></div>
        <div className="bg-bubble bubble-4"></div>
      </div>

      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-heading-wrapper">
              <div className="contact-heading-reveal">
                <TextReveal className="heading-lets" direction="down" delay={0.1} repeatOnScroll={true}>Let's</TextReveal>
                <TextReveal className="heading-talk" direction="down" delay={0.4} repeatOnScroll={true}>Talk</TextReveal>
              </div>
              <div className="contact-floats">
                <div className="contact-float-bubble"></div>
                <div className="contact-float-bubble"></div>
                <div className="contact-float-bubble"></div>
              </div>
            </div>

            <FadeIn delay={0.6} className="contact-content" repeatOnScroll={true}>
              {/* Social Media Buttons */}
              <div className="contact-social-wrapper">
                <SocialButtons />
              </div>

              <p className="contact-description">
                Have a project in mind? Want to collaborate? Drop me a message and let's make it
                happen.
              </p>

              <div className="contact-details">
                <div className="contact-detail-item">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">West Bengal, India</span>
                </div>
                <div className="contact-detail-item">
                  <span className="detail-label">Availability</span>
                  <span className="detail-value">Open for opportunities</span>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.8} className="contact-form-wrapper" repeatOnScroll={true}>
            <AIAssistantChat />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
