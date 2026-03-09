interface ExperienceItem {
    title: string;
    description?: string;
    year?: string;
    period?: string;
    company?: string;
    current?: boolean;
}

interface ExperienceProps {
    experiences: ExperienceItem[];
}

export default function Experience({ experiences }: ExperienceProps) {
    return (
        <section className="section-card experience-section animate-fadeInUp animate-delay-3">
            <h2 className="section-title">
                <svg viewBox="0 0 24 24" fill="currentColor" className="section-title-icon">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                </svg>
                Experience
            </h2>
            <div className="experience-list">
                {experiences.map((exp, index) => (
                    <div key={index} className="experience-item">
                        <div className="experience-indicator">
                            <div className={`experience-dot ${exp.current ? 'experience-dot--current' : ''}`}></div>
                            {index < experiences.length - 1 && <div className="experience-line"></div>}
                        </div>
                        <div className="experience-content">
                            <h3 className="experience-title">{exp.title}</h3>
                            {exp.description && <p className="experience-description">{exp.description}</p>}
                            {exp.company && <p className="experience-company">{exp.company}</p>}
                        </div>
                        {exp.year && <span className="experience-year">{exp.year}</span>}
                        {exp.period && <span className="experience-year">{exp.period}</span>}
                    </div>
                ))}
            </div>
        </section>
    );
}
