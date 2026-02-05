import { useState } from 'react';
import FadeIn from './FadeIn';
import TextReveal from './TextReveal';
import './ContactForm.css';

function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState(''); // 'sending', 'success', 'error'

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        // Simulate sending (replace with your actual email service later)
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });

            setTimeout(() => {
                setStatus('');
            }, 3000);
        }, 1000);
    };

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
                <FadeIn>
                    <h2 className="section-title">03 / Contact</h2>
                </FadeIn>
                <div className="contact-grid">
                    <FadeIn delay={0.2} className="contact-info">
                        <div className="contact-heading-wrapper">
                            <div className="contact-heading-reveal">
                                <TextReveal className="heading-lets">Let's</TextReveal>
                                <TextReveal className="heading-talk">Talk</TextReveal>
                            </div>
                            <div className="contact-floats">
                                <div className="contact-float-bubble"></div>
                                <div className="contact-float-bubble"></div>
                                <div className="contact-float-bubble"></div>
                            </div>
                        </div>
                        <p className="contact-description">
                            Have a project in mind? Want to collaborate?
                            Drop me a message and let's make it happen.
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

                    <FadeIn delay={0.4} className="contact-form-wrapper">
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    disabled={status === 'sending'}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Your Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="john@example.com"
                                    disabled={status === 'sending'}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Your Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    placeholder="Tell me about your project..."
                                    disabled={status === 'sending'}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className={`submit-btn ${status}`}
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Sending...
                                    </>
                                ) : status === 'success' ? (
                                    <>
                                        <span className="btn-checkmark">✓</span>
                                        Message Sent!
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </button>

                            {status === 'error' && (
                                <p className="error-message">
                                    Something went wrong. Please try again.
                                </p>
                            )}
                        </form>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}

export default ContactForm;
