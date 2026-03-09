'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTheme } from './ThemeProvider';
import ContactModal from './ContactModal';

interface ProfileHeaderProps {
    name: string;
    location: string;
    roles: string[];
    avatarUrl?: string;
    email?: string;
    calendarUrl?: string;
    blogUrl?: string;
}

export default function ProfileHeader({
    name,
    location,
    roles,
    avatarUrl,
    email = 'mailto:asismichael143@gmail.com',
    calendarUrl = 'https://calendly.com/asismichael143/30min',
    blogUrl,
}: ProfileHeaderProps) {
    const [showContactModal, setShowContactModal] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <div className="profile-header animate-fadeInUp">
                <div className="profile-header__main">
                    <div className="profile-header__avatar">
                        {avatarUrl ? (
                            <Image
                                src={"/images/portfolioImage7.jpg"}
                                alt={name}
                                width={160}
                                height={160}
                                className="avatar-image"
                                loading="lazy"
                            />
                        ) : (
                            <div className="avatar-placeholder">
                                <span>{name.charAt(0)}</span>
                            </div>
                        )}
                    </div>

                    <div className="profile-header__info">
                        {/* Name + verified + toggle row */}
                        <div className="profile-header__name-row">
                            <div className="profile-header__name-group">
                                <h1 className="profile-header__name text-shimmer">{name}</h1>
                                <svg className="verified-badge" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" aria-label="Verified user">
                                    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="#1d9bf0" />
                                </svg>
                            </div>
                            <button
                                className="theme-toggle-switch"
                                onClick={toggleTheme}
                                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            >
                                <div className={`theme-toggle-switch__thumb ${theme === 'dark' ? 'theme-toggle-switch__thumb--dark' : ''}`}>
                                    {theme === 'light' ? (
                                        <svg className="theme-toggle-switch__icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="theme-toggle-switch__icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        </div>

                        {/* Location */}
                        <div className="profile-header__location">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="location-icon">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{location}</span>
                        </div>

                        {/* Roles */}
                        <div className="profile-header__roles-row">
                            <div className="profile-header__roles">
                                {roles.map((role, index) => (
                                    <span key={index}>
                                        {role}
                                        {index < roles.length - 1 && <span className="role-separator">|</span>}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="profile-header__buttons">
                            <a href={calendarUrl} className="action-button action-button--primary" target="_blank" rel="noopener noreferrer">
                                <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Schedule a Call</span>
                                <svg className="action-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </a>

                            <button onClick={() => setShowContactModal(true)} className="action-button action-button--secondary">
                                <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>Send Email</span>
                            </button>

                            {blogUrl && (
                                <a href={blogUrl} className="action-button action-button--secondary" target="_blank" rel="noopener noreferrer">
                                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
                                    </svg>
                                    <span>Read my blog</span>
                                    <svg className="action-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showContactModal && (
                <ContactModal onClose={() => setShowContactModal(false)} />
            )}
        </>
    );
}
