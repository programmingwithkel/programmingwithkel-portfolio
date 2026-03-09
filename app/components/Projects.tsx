'use client';

import { useState } from 'react';

export interface ProjectDetail {
    name: string;
    description: string;
    longDescription?: string;
    url?: string;
    image?: string;
    dateRange?: string;
    technologies?: string[];
    collaborators?: { name: string; avatar?: string }[];
    githubUrl?: string;
    featured?: boolean;
    subtitle?: string;
    deploymentType?: string;
    type?: string;
}

interface ProjectsProps {
    projects: ProjectDetail[];
}

export default function Projects({ projects }: ProjectsProps) {
    const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

    const toggleExpand = (index: number) => {
        setExpandedCards(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    return (
        <section className="section-card projects-section animate-fadeInUp animate-delay-4">
            <div className="projects-header">
                <h2 className="section-title">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="section-title-icon">
                        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
                    </svg>
                    Latest Projects
                </h2>
            </div>

            <div className="latest-projects-stack">
                {projects.map((project, index) => {
                    const isExpanded = expandedCards.has(index);
                    const displayDescription = project.longDescription || project.description;

                    return (
                        <div key={index} className="latest-project-card">
                            {/* Image Area */}
                            <div className="latest-project-card__image-area">
                                {project.featured && (
                                    <span className="latest-project-card__featured-badge">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                        Featured
                                    </span>
                                )}
                                {project.deploymentType && (
                                    <span className="latest-project-card__deploy-badge">
                                        {project.deploymentType}
                                    </span>
                                )}
                                <div className="latest-project-card__image-wrapper">
                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.name}
                                            className="latest-project-card__img"
                                        />
                                    ) : (
                                        <div className="latest-project-card__img-placeholder">
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                                                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="latest-project-card__content">
                                {/* Meta row */}
                                <div className="latest-project-card__meta">
                                    {project.dateRange && (
                                        <span className="latest-project-card__meta-item">
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z" />
                                            </svg>
                                            {project.dateRange.split(' - ')[0].split(',')[0].split(' ').pop() || project.dateRange}
                                        </span>
                                    )}
                                    {project.type && (
                                        <>
                                            <span className="latest-project-card__meta-sep">•</span>
                                            <span className="latest-project-card__meta-item">
                                                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                                    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                                                </svg>
                                                {project.type}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Title + Subtitle */}
                                <h3 className="latest-project-card__title">{project.name}</h3>
                                {project.subtitle && (
                                    <p className="latest-project-card__subtitle">{project.subtitle}</p>
                                )}

                                {/* Description: show short description, expand to longDescription */}
                                <p className="latest-project-card__description">
                                    {isExpanded ? displayDescription : project.description}
                                </p>
                                {project.longDescription && (
                                    <button
                                        className="latest-project-card__read-more"
                                        onClick={() => toggleExpand(index)}
                                    >
                                        {isExpanded ? 'Show less' : 'Read more'}
                                    </button>
                                )}

                                {/* Technologies */}
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="latest-project-card__tech">
                                        <h4 className="latest-project-card__tech-label">
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                                            </svg>
                                            Technologies
                                        </h4>
                                        <div className="latest-project-card__tech-list">
                                            {project.technologies.map((tech, idx) => (
                                                <span key={idx} className="latest-project-card__tech-badge">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Source Code Link */}
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="latest-project-card__source-link"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                                        </svg>
                                        Source Code
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
