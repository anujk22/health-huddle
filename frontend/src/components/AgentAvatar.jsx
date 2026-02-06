function AgentAvatar({ agent, isSpeaking, isActive }) {
    const agentConfig = {
        Guidelines: { icon: '📋', className: 'agent-guidelines' },
        Evidence: { icon: '📊', className: 'agent-evidence' },
        Cases: { icon: '🗂️', className: 'agent-cases' },
        Safety: { icon: '⚠️', className: 'agent-safety' },
        Consensus: { icon: '🎯', className: 'agent-consensus' }
    };

    const config = agentConfig[agent] || { icon: '🤖', className: '' };

    const classes = [
        'agent-avatar',
        config.className,
        isSpeaking ? 'speaking' : '',
        isActive ? 'active' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            <div className="avatar-circle">
                {config.icon}
            </div>
            <span className="avatar-name">{agent}</span>
        </div>
    );
}

export default AgentAvatar;
