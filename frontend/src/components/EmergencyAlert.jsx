function EmergencyAlert({ emergency, onDismiss }) {
    return (
        <div className="emergency-alert">
            <div className="emergency-content">
                <div className="emergency-icon">🚨</div>
                <h2 className="emergency-title">Emergency Detected</h2>
                <p className="emergency-message">
                    {emergency.message}
                </p>
                {emergency.condition && (
                    <p style={{ color: '#ff8a80', marginBottom: '24px', fontWeight: 600 }}>
                        Possible: {emergency.condition}
                    </p>
                )}
                <a
                    href="tel:911"
                    className="emergency-call"
                >
                    📞 Call 911
                </a>
                <button
                    onClick={onDismiss}
                    style={{
                        display: 'block',
                        margin: '16px auto 0',
                        background: 'transparent',
                        border: 'none',
                        color: '#78909c',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }}
                >
                    I understand the risk, continue anyway
                </button>
            </div>
        </div>
    );
}

export default EmergencyAlert;
