import { useState } from 'react';
import { appConfig } from '../config';

function PatientInput({ onSubmit }) {
    const [mainSymptom, setMainSymptom] = useState('');
    const [location, setLocation] = useState('');
    const [duration, setDuration] = useState('');
    const [severity, setSeverity] = useState('');
    const [triggers, setTriggers] = useState('');
    const [otherDetails, setOtherDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mainSymptom.trim()) return;

        setIsSubmitting(true);

        // Compile all inputs into a single symptoms string
        const symptomParts = [mainSymptom.trim()];
        if (location.trim()) symptomParts.push(`Location: ${location.trim()}`);
        if (duration.trim()) symptomParts.push(`Duration: ${duration.trim()}`);
        if (severity.trim()) symptomParts.push(`Severity: ${severity.trim()}`);
        if (triggers.trim()) symptomParts.push(`What affects it: ${triggers.trim()}`);
        if (otherDetails.trim()) symptomParts.push(`Other details: ${otherDetails.trim()}`);

        const symptoms = symptomParts.join('. ');

        // Check for emergency before starting debate
        try {
            const response = await fetch('/api/check-emergency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms })
            });
            const data = await response.json();

            if (data.isEmergency) {
                onSubmit({ symptoms, emergency: data });
                return;
            }
        } catch (error) {
            console.error('Emergency check failed:', error);
        }

        onSubmit({ symptoms });
    };

    return (
        <section className="input-section">
            <div className="input-welcome">
                <h2>Welcome to {appConfig.ui.appName}</h2>
                <p>Tell us about your symptoms. The more details you provide, the better our AI team can help.</p>
            </div>

            <form onSubmit={handleSubmit} className="input-card glass-panel-elevated">
                {/* Main Symptom - Required */}
                <div className="input-field">
                    <label className="input-label required">
                        What's your main concern or symptom?
                    </label>
                    <textarea
                        className="symptom-textarea"
                        value={mainSymptom}
                        onChange={(e) => setMainSymptom(e.target.value)}
                        placeholder="e.g., Sharp abdominal pain, persistent headache, difficulty breathing..."
                        required
                        rows={3}
                    />
                </div>

                {/* Location */}
                <div className="input-field">
                    <label className="input-label">
                        Where exactly is the problem? (if applicable)
                    </label>
                    <input
                        type="text"
                        className="text-input"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Right lower abdomen, behind my left eye, both knees..."
                    />
                </div>

                {/* Duration */}
                <div className="input-field">
                    <label className="input-label">
                        How long have you had this?
                    </label>
                    <input
                        type="text"
                        className="text-input"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g., Started 2 hours ago, about 3 days, on and off for a week..."
                    />
                </div>

                {/* Severity - Free text instead of slider */}
                <div className="input-field">
                    <label className="input-label">
                        How would you describe the severity?
                    </label>
                    <input
                        type="text"
                        className="text-input"
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        placeholder="e.g., Mild but annoying, worst pain I've ever had, comes in waves..."
                    />
                </div>

                {/* Triggers */}
                <div className="input-field">
                    <label className="input-label">
                        What makes it better or worse?
                    </label>
                    <input
                        type="text"
                        className="text-input"
                        value={triggers}
                        onChange={(e) => setTriggers(e.target.value)}
                        placeholder="e.g., Worse when I move, better after eating, nothing helps..."
                    />
                </div>

                {/* Other Details */}
                <div className="input-field">
                    <label className="input-label">
                        Any other relevant details?
                    </label>
                    <textarea
                        className="symptom-textarea small"
                        value={otherDetails}
                        onChange={(e) => setOtherDetails(e.target.value)}
                        placeholder="e.g., I'm 35/female, have diabetes, took ibuprofen with no effect, also have nausea..."
                        rows={2}
                    />
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={!mainSymptom.trim() || isSubmitting}
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
