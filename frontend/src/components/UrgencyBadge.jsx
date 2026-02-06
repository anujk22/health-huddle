function UrgencyBadge({ urgency }) {
    if (!urgency) return null;

    const levelClass = urgency.level?.toLowerCase() || 'medium';

    return (
        <div className={`urgency-badge ${levelClass}`}>
            <span>
                {levelClass === 'critical' && '🚨'}
                {levelClass === 'high' && '⚠️'}
                {levelClass === 'medium' && '📋'}
                {levelClass === 'low' && '✅'}
            </span>
            <span>{urgency.message || urgency.level}</span>
        </div>
    );
}

export default UrgencyBadge;
