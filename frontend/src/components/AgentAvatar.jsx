function AgentAvatar({ agent, config, isSpeaking, isActive }) {
    const agentStyles = {
        Guidelines: 'agent-guidelines',
        Evidence: 'agent-evidence',
        Cases: 'agent-cases',
        Safety: 'agent-safety',
        Consensus: 'agent-consensus'
    };

    const className = agentStyles[agent] || '';

    const classes = [
        'agent-avatar',
        className,
        isSpeaking ? 'speaking' : '',
        isActive ? 'active' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            <div className="avatar-circle">
                {config?.icon || '🤖'}
            </div>
            <span className="avatar-name">{config?.name || agent}</span>
        </div>
    );
}

export default AgentAvatar;
