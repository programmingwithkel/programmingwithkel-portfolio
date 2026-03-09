interface SchoolItem {
    name: string;
    institution: string;
    year?: string;
}

interface SchoolBackgroundProps {
    items: SchoolItem[];
}

export default function SchoolBackground({ items }: SchoolBackgroundProps) {
    return (
        <section className="section-card school-background-section animate-fadeInUp animate-delay-3">
            <div className="school-background-header">
                <h2 className="section-title">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="section-title-icon">
                        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                    </svg>
                    Academic Background
                </h2>
            </div>

            <div className="experience-list">
                {items.map((item, index) => (
                    <div key={index} className="experience-item">
                        <div className="experience-indicator">
                            <div className={`experience-dot ${index === 0 ? 'experience-dot--current' : ''}`}></div>
                            {index < items.length - 1 && <div className="experience-line"></div>}
                        </div>
                        <div className="experience-content">
                            <h3 className="experience-title">{item.name}</h3>
                            <p className="experience-description">{item.institution}</p>
                        </div>
                        {item.year && <span className="experience-year">{item.year}</span>}
                    </div>
                ))}
            </div>
        </section>
    );
}
