function MessageBubble({ message }) {
    const agentClass = message.isPatient
        ? 'patient'
        : message.agent.toLowerCase();

    return (
        <div className={`message-bubble ${agentClass}`}>
            <div className="message-header">
                <span className={`message-agent-badge ${agentClass}`}>
                    {message.agent}
                </span>
            </div>

            <div className="message-content">
                {message.text}
            </div>

            {message.sources && message.sources.length > 0 && (
                <div className="message-sources">
                    {message.sources.map((source, index) => (
                        <span key={index} className="source-pill">
                            <span className="source-icon">{source.icon}</span>
                            {source.title.length > 35
                                ? source.title.substring(0, 35) + '...'
                                : source.title}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MessageBubble;
