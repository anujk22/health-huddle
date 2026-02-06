import { useState } from 'react';
import { appConfig } from '../config';

function PatientInput({ onSubmit }) {
    const [symptoms, setSymptoms] = useState('');
    const [painLevel, setPainLevel] = useState(5);
    const [duration, setDuration] = useState('a few hours');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!symptoms.trim()) return;

        setIsSubmitting(true);

        // Check for emergency before starting debate
        try {
            const response = await fetch('/api/check-emergency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms })
            });
            const data = await response.json();

            if (data.isEmergency) {
                onSubmit({ symptoms, painLevel, duration, emergency: data });
                return;
            }
        } catch (error) {
            console.error('Emergency check failed:', error);
        }

        onSubmit({ symptoms, painLevel, duration });
    };

    const getPainLabel = (level) => {
        if (level <= 2) return 'Mild';
        if (level <= 4) return 'Moderate';
        if (level <= 6) return 'Significant';
        if (level <= 8) return 'Severe';
        return 'Extreme';
    };

    return (
        <section className="input-section">
            <div className="input-welcome">
                <h2>Welcome to {appConfig.ui.appName}</h2>
                <p>Describe your symptoms and our team of AI medical specialists will discuss your case and provide recommendations.</p>
            </div>

            <form onSubmit={handleSubmit} className="input-card glass-panel-elevated">
                <textarea
                    className="symptom-textarea"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe what's going on... Include symptoms, when they started, what makes them better or worse, and any other relevant details.

Example: Sharp pain in my right lower abdomen for about 12 hours. It hurts more when I move or cough. Feeling nauseous but haven't vomited."
                    required
                />

                {/* Optional Advanced Options */}
                <button
                    type="button"
                    className="advanced-toggle"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-tertiary)',
                        cursor: 'pointer',
                        padding: '8px 0',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '8px'
                    }}
                >
                    {showAdvanced ? '▼' : '▶'} Additional details (optional)
                </button>

                {showAdvanced && (
                    <div className="input-controls">
                        {appConfig.ui.showPainSlider && (
                            <div className="control-group">
                                <label className="control-label">Pain Level (optional)</label>
                                <div className="control-value">{painLevel}/10 - {getPainLabel(painLevel)}</div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={painLevel}
                                    onChange={(e) => setPainLevel(parseInt(e.target.value))}
                                    className="pain-slider"
                                />
                            </div>
                        )}

                        {appConfig.ui.showDurationSelector && (
                            <div className="control-group">
                                <label className="control-label">How long has this been going on?</label>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="duration-select"
                                >
                                    <option value="less than an hour">Less than an hour</option>
                                    <option value="a few hours">A few hours</option>
                                    <option value="about a day">About a day</option>
                                    <option value="2-3 days">2-3 days</option>
                                    <option value="about a week">About a week</option>
                                    <option value="more than a week">More than a week</option>
                                    <option value="several weeks">Several weeks</option>
                                    <option value="months">Months</option>
                                </select>
                            </div>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    className="submit-button"
                    disabled={!symptoms.trim() || isSubmitting}
                >
                    {isSubmitting ? 'Starting Consultation...' : '🏥 Start AI Consultation'}
                </button>

                <p className="text-center text-muted mt-md" style={{ fontSize: '0.75rem' }}>
                    ⚠️ This is an AI tool for informational purposes only. Always consult a real healthcare provider for medical decisions.
                </p>
            </form>
        </section>
    );
}

export default PatientInput;
