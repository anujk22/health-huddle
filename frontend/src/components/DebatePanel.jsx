import { useState, useEffect, useRef } from 'react';
import AgentAvatar from './AgentAvatar';
import MessageBubble from './MessageBubble';

function DebatePanel({ messages, speakingAgent, status, onInterjection, patientData }) {
    const [interjectionText, setInterjectionText] = useState('');
    const messagesEndRef = useRef(null);

    const agents = ['Guidelines', 'Evidence', 'Cases', 'Safety'];

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInterjectionSubmit = (e) => {
        e.preventDefault();
        if (!interjectionText.trim()) return;

        onInterjection(interjectionText);
        setInterjectionText('');
    };

    // Check which agents have spoken
    const activeAgents = new Set(messages.map(m => m.agent));

    return (
        <div className="debate-section">
            <div className="debate-main glass-panel-elevated">
                {/* Status Bar */}
                <div className="status-bar">
                    <div className="status-dot"></div>
                    <span className="status-text">{status}</span>
                </div>

                {/* Agent Avatars */}
                <div className="agents-bar">
                    {agents.map(agent => (
                        <AgentAvatar
                            key={agent}
                            agent={agent}
                            isSpeaking={speakingAgent === agent}
                            isActive={activeAgents.has(agent)}
                        />
                    ))}
                </div>

                {/* Patient's Original Symptoms */}
                {patientData && (
                    <div className="message-bubble patient" style={{ margin: '0 16px 16px', opacity: 0.8 }}>
                        <div className="message-header">
                            <span className="message-agent-badge patient">Your Symptoms</span>
                        </div>
                        <div className="message-content">
                            {patientData.symptoms}
                            <div style={{ marginTop: '8px', fontSize: '0.875rem', opacity: 0.7 }}>
                                Pain: {patientData.painLevel}/10 | Duration: {patientData.duration}
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="debate-messages">
                    {messages.map(message => (
                        <MessageBubble key={message.id} message={message} />
                    ))}

                    {/* Thinking Indicator */}
                    {speakingAgent && (
                        <div className="thinking-indicator">
                            <div className="thinking-dots">
                                <div className="thinking-dot"></div>
                                <div className="thinking-dot"></div>
                                <div className="thinking-dot"></div>
                            </div>
                            <span className="thinking-text">{speakingAgent} is thinking...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Patient Interjection Input */}
                <form className="interjection-form" onSubmit={handleInterjectionSubmit}>
                    <input
                        type="text"
                        className="interjection-input"
                        value={interjectionText}
                        onChange={(e) => setInterjectionText(e.target.value)}
                        placeholder="Add more info anytime... (e.g., 'I'm also running a fever now')"
                    />
                    <button type="submit" className="interjection-button">
                        Add Info
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DebatePanel;
