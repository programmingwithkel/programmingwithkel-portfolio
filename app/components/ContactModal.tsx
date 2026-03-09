'use client';

import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';

interface ContactModalProps {
    onClose: () => void;
}

export default function ContactModal({ onClose }: ContactModalProps) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const formRef = useRef<HTMLFormElement>(null);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const result = await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                    reply_to: formData.email,
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
            );

            if (result.status === 200) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                console.error('EmailJS error:', result.text);
                setStatus('error');
            }
        } catch (error) {
            console.error('EmailJS error:', error);
            setStatus('error');
        }
    };

    return (
        <div className="contact-modal-overlay" onClick={onClose}>
            <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="contact-modal__header">
                    <div className="contact-modal__header-text">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="contact-modal__header-icon">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                        <h2 className="contact-modal__title">Send me a message</h2>
                    </div>
                    <button className="contact-modal__close" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form className="contact-modal__form" onSubmit={handleSubmit} ref={formRef}>
                    <div className="contact-modal__field">
                        <label htmlFor="contact-name" className="contact-modal__label">Name</label>
                        <input
                            id="contact-name"
                            type="text"
                            className="contact-modal__input"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="contact-modal__field">
                        <label htmlFor="contact-email" className="contact-modal__label">Email</label>
                        <input
                            id="contact-email"
                            type="email"
                            className="contact-modal__input"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="contact-modal__field">
                        <label htmlFor="contact-message" className="contact-modal__label">Message</label>
                        <textarea
                            id="contact-message"
                            className="contact-modal__textarea"
                            placeholder="Write your message here..."
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            required
                        />
                    </div>

                    {/* Status Messages */}
                    {status === 'success' && (
                        <div className="contact-modal__status contact-modal__status--success">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                            Message sent successfully!
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="contact-modal__status contact-modal__status--error">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            Something went wrong. Please try again.
                        </div>
                    )}

                    {/* Actions */}
                    <div className="contact-modal__actions">
                        <button type="button" className="contact-modal__cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="contact-modal__submit-btn"
                            disabled={status === 'sending' || status === 'success'}
                        >
                            {status === 'sending' ? (
                                <>
                                    <span className="contact-modal__spinner"></span>
                                    Sending...
                                </>
                            ) : status === 'success' ? (
                                'Sent'
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                    </svg>
                                    Send Message
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
