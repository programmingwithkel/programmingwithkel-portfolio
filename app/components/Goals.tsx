interface GoalsProps {
    goals: string[];
}

export default function Goals({ goals }: GoalsProps) {
    return (
        <div className="goals-column">
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
    );
}
