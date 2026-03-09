interface TechCategory {
    name: string;
    skills: string[];
}

interface TechStackProps {
    categories: TechCategory[];
}

export default function TechStack({ categories }: TechStackProps) {
    return (
        <section className="section-card tech-stack animate-fadeInUp animate-delay-4">
            <div className="tech-stack__header">
                <h2 className="section-title">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="section-title-icon">
                        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                    </svg>
                    Tech Stack
                </h2>
            </div>

            {categories.map((category, index) => (
                <div key={index} className="tech-category">
                    <h3 className="tech-category__name">{category.name}</h3>
                    <div className="tech-category__skills">
                        {category.skills.map((skill, skillIndex) => (
                            <span key={skillIndex} className="skill-badge">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}
