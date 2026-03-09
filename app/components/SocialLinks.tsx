interface SocialLink {
    name: string;
    url: string;
    icon: 'linkedin' | 'github' | 'instagram' | 'email';
}

interface SocialLinksProps {
    socialLinks: SocialLink[];
    speakingInfo?: string;
    email?: string;
    goals?: string[];
}

const icons = {
    linkedin: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    github: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    ),
    instagram: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    ),
    email: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
    )
};

export default function SocialLinks({
    socialLinks,
    speakingInfo,
    email,
    goals = []
}: SocialLinksProps) {
    return (
        <footer className="section-card animate-fadeInUp animate-delay-5">
            <div className="footer-section">
                {/* Goals Column */}
                <div className="footer-column">
                    <h3 className="footer-column-title">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="footer-title-icon">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        Goals
                    </h3>
                    <div className="goals-list">
                        {goals.map((goal, index) => (
                            <div key={index} className="goal-item">
                                <p className="goal-text">{goal}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Social Links Column */}
                <div className="footer-column">
                    <h3 className="footer-column-title">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="footer-title-icon">
                            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                        </svg>
                        Social Links
                    </h3>
                    <ul className="social-list">
                        {socialLinks.map((link, index) => (
                            <li key={index} className="social-item">
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    {icons[link.icon]}
                                    <span>{link.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Column */}
                <div className="footer-column">
                    <h3 className="footer-column-title">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="footer-title-icon">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                        Contact
                    </h3>
                    <div className="contact-text-column">
                        <p className="speaking-info">{speakingInfo || 'Open to collaborations on web design and development projects.'}</p>
                        <span className="get-in-touch-link">
                            Get in touch →
                        </span>
                    </div>
                </div>

                {/* Contact Cards Column */}
                <div className="footer-column">
                    <div className="contact-cards">
                        {email && (
                            <a href={`mailto:${email}`} className="contact-card">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="contact-card-icon contact-card-icon--email">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                                <div className="contact-card-info">
                                    <span className="contact-card-label">Email</span>
                                    <span className="contact-card-value">{email}</span>
                                </div>
                                <svg viewBox="0 0 24 24" fill="currentColor" className="contact-card-arrow">
                                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
                                </svg>
                            </a>
                        )}


                        <a href="https://messenger.com/hahakeelll.1/" className="contact-card" target="_blank" rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="contact-card-icon contact-card-icon--messenger">
                                <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.22.16.15.26.37.27.6l.05 1.88c.02.57.6.94 1.12.71l2.1-.93c.18-.08.38-.1.57-.06.91.25 1.87.38 2.74.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm5.89 7.55l-2.89 4.58c-.46.73-1.44.91-2.12.39l-2.3-1.72c-.19-.14-.45-.14-.64 0l-3.1 2.35c-.41.31-.95-.18-.68-.62l2.89-4.58c.46-.73 1.44-.91 2.12-.39l2.3 1.72c.19.14.45.14.64 0l3.1-2.35c.41-.31.95.18.68.62z" />
                            </svg>
                            <div className="contact-card-info">
                                <span className="contact-card-label">Messenger</span>
                                <span className="contact-card-value">Chat with me</span>
                            </div>
                            <svg viewBox="0 0 24 24" fill="currentColor" className="contact-card-arrow">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
