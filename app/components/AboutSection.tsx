interface AboutSectionProps {
    paragraphs: string[];
}

export default function AboutSection({ paragraphs }: AboutSectionProps) {
    return (
        <section className="section-card about-section animate-fadeInUp animate-delay-2">
            <h2 className="section-title">
                <svg viewBox="0 0 24 24" fill="currentColor" className="section-title-icon">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                About
            </h2>
            <div className="about-content">
                {paragraphs.map((paragraph, index) => (
                    <p key={index} className="about-paragraph">
                        {paragraph}
                    </p>
                ))}
            </div>
        </section>
    );
}
