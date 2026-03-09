'use client';

interface ActionButtonsProps {
    onScheduleCall?: () => void;
    onSendEmail?: () => void;
    email?: string;
    calendarUrl?: string;
}

export default function ActionButtons({
    email = 'asismichael143@gmail.com',
    calendarUrl = 'https://calendly.com/asismichael143/30min'
}: ActionButtonsProps) {
    return (
        <div className="action-buttons">
            <a href={calendarUrl} className="action-button action-button--primary" target="_blank">
                <svg viewBox="0 0 24 24" fill="currentColor" className="action-icon">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
                </svg>
                <span>Schedule a Call</span>
                <svg viewBox="0 0 24 24" fill="currentColor" className="action-chevron">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
                </svg>
            </a>

            <a href={email} className="action-button action-button--secondary">
                <svg viewBox="0 0 24 24" fill="currentColor" className="action-icon">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span>Send Email</span>
            </a>

            <button className="action-button action-button--more">
                <svg viewBox="0 0 24 24" fill="currentColor" className="action-icon">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
                </svg>
            </button>
        </div>
    );
}
