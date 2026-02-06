import { useState, useEffect, useRef } from 'react';
import AgentAvatar from './AgentAvatar';
import MessageBubble from './MessageBubble';
import { appConfig } from '../config';

function DebatePanel({ messages, speakingAgent, status, onInterjection, patientData }) {
    const [interjectionText, setInterjectionText] = useState('');
    const [showInterjectionHint, setShowInterjectionHint] = useState(true);
    const messagesEndRef = useRef(null);

    const agents = Object.keys(appConfig.agents);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Show hint for first few seconds then hide
    useEffect(() => {
        const timer = setTimeout(() => setShowInterjectionHint(false), 8000);
        return () => clearTimeout(timer);
    }, []);

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
                            config={appConfig.agents[agent]}
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
                            {(patientData.painLevel || patientData.duration) && (
                                <div style={{ marginTop: '8px', fontSize: '0.875rem', opacity: 0.7 }}>
                                    {patientData.painLevel && `Pain: ${patientData.painLevel}/10`}
                                    {patientData.painLevel && patientData.duration && ' | '}
                                    {patientData.duration && `Duration: ${patientData.duration}`}
                                </div>
                            )}
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

                {/* Patient Interjection Input - More Prominent */}
                <div className="interjection-wrapper" style={{
                    background: 'rgba(0, 212, 170, 0.08)',
                    borderTop: '2px solid var(--accent-primary)',
                    padding: '16px'
                }}>
                    {showInterjectionHint && (
                        <div style={{
                            background: 'rgba(0, 212, 170, 0.15)',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            marginBottom: '12px',
                            fontSize: '0.85rem',
                            color: 'var(--accent-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            💡 <strong>Tip:</strong> You can add information at any time during the consultation!
                        </div>
                    )}

                    <form className="interjection-form" onSubmit={handleInterjectionSubmit} style={{ margin: 0 }}>
                        <input
                            type="text"
                            className="interjection-input"
                            value={interjectionText}
                            onChange={(e) => setInterjectionText(e.target.value)}
                            placeholder="Add more details, correct something, or tell them about new symptoms..."
                            style={{ flex: 1 }}
                        />
                        <button type="submit" className="interjection-button">
                            ➤ Add
                        </button>
                    </form>

                    <p style={{
                        margin: '8px 0 0',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        textAlign: 'center'
                    }}>
                        Examples: "I forgot to mention I have a fever" • "The pain just got worse" • "I'm female, 28 years old"
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DebatePanel;
