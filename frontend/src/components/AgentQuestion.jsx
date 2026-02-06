import { useState, useEffect } from 'react';
import { appConfig } from '../config';

function AgentQuestion({ question, onAnswer }) {
    const [answer, setAnswer] = useState('');
    const [timeLeft, setTimeLeft] = useState(question.timeoutSeconds || 10);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) {
            // Auto-skip when timer runs out
            onAnswer({ skipped: true, answer: null });
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, onAnswer]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim()) {
            onAnswer({ skipped: false, answer: answer.trim() });
        }
    };

    const handleSkip = () => {
        onAnswer({ skipped: true, answer: null });
    };

    const agentConfig = appConfig.agents[question.agent] || {};
    const timerPercent = (timeLeft / (question.timeoutSeconds || 15)) * 100;

    return (
        <div className="agent-question-overlay">
            <div className="agent-question-content">
                <div className="agent-question-header">
                    <span style={{ fontSize: '1.5rem' }}>{agentConfig.icon || '🤖'}</span>
                    <strong style={{ color: agentConfig.color || '#fff' }}>
                        {question.agent} has a question for you
                    </strong>
                </div>

                <div className="agent-question-text">
                    {question.text}
                </div>

                <div className="agent-question-timer">
                    <span>⏱️ {timeLeft}s to answer</span>
                    <div className="timer-bar">
                        <div
                            className="timer-fill"
                            style={{ width: `${timerPercent}%` }}
                        />
                    </div>
                    <span style={{ fontSize: '0.75rem' }}>(will continue automatically if skipped)</span>
                </div>

                <form className="agent-question-input" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer..."
                        autoFocus
                    />
                    <button type="submit">Answer</button>
                    <button type="button" className="skip-button" onClick={handleSkip}>
                        Skip
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AgentQuestion;
