import { useState } from 'react';
import UrgencyBadge from './UrgencyBadge';

function ConsensusDashboard({ consensus, patientData, messages, onNewConsultation }) {
    const [copied, setCopied] = useState(false);

    // Strip markdown formatting (asterisks, etc.)
    const cleanText = (text) => {
        return text
            .replace(/\*\*/g, '')  // Remove bold asterisks
            .replace(/\*/g, '')    // Remove italic asterisks
            .replace(/`/g, '')     // Remove backticks
            .replace(/^#+\s*/gm, '') // Remove heading markers
            .trim();
    };

    // Parse the consensus text to extract structured data
    const parseConsensus = (text) => {
        const cleanedText = cleanText(text);
        const lines = cleanedText.split('\n').filter(line => line.trim());

        let diagnosisName = '';
        let diagnosisReason = '';
        let confidence = 65;
        let recommendations = [];
        let urgencyText = '';
        let alternatives = '';
        let warningSignsText = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const upperLine = line.toUpperCase();

            // PRIMARY ASSESSMENT parsing
            if (upperLine.startsWith('PRIMARY ASSESSMENT:')) {
                const assessmentPart = line.replace(/^PRIMARY ASSESSMENT:\s*/i, '');

                // Extract condition and confidence
                const confMatch = assessmentPart.match(/(.+?)\s*\((\d+)%\s*confidence\)/i);
                if (confMatch) {
                    diagnosisName = confMatch[1].trim();
                    confidence = parseInt(confMatch[2]);
                } else {
                    diagnosisName = assessmentPart;
                    const numMatch = assessmentPart.match(/(\d+)%/);
                    if (numMatch) confidence = parseInt(numMatch[1]);
                }

                // Get the next line as the reason
                if (i + 1 < lines.length && !lines[i + 1].toUpperCase().startsWith('URGENCY')) {
                    diagnosisReason = lines[i + 1].trim();
                }
            }

            // URGENCY parsing
            if (upperLine.startsWith('URGENCY:')) {
                urgencyText = line.replace(/^URGENCY:\s*/i, '').trim();
            }

            // WHAT YOU SHOULD DO parsing
            if (/^\d+[\.\)]\s/.test(line)) {
                recommendations.push(line.replace(/^\d+[\.\)]\s*/, '').trim());
            }

            // OTHER POSSIBILITIES
            if (upperLine.startsWith('OTHER POSSIBILITIES:')) {
                alternatives = line.replace(/^OTHER POSSIBILITIES:\s*/i, '').trim();
            }

            // WHEN TO SEEK IMMEDIATE CARE
            if (upperLine.startsWith('WHEN TO SEEK')) {
                warningSignsText = line.replace(/^WHEN TO SEEK.*?:\s*/i, '').trim();
            }
        }

        // Fallback if no structured diagnosis found
        if (!diagnosisName) {
            diagnosisName = lines.find(l => l.length > 10 && !l.startsWith('#')) || 'Assessment pending';
        }

        return {
            diagnosisName,
            diagnosisReason,
            confidence,
            recommendations,
            alternatives,
            warningSignsText,
            fullText: cleanedText
        };
    };

    const parsed = parseConsensus(consensus.text);

    // Build a concise, sentence-based summary for telling the doctor
    const urgencyLevel = consensus.urgency?.message || 'standard follow-up';
    const doctorSummary = `I've been experiencing ${patientData.symptoms.toLowerCase()}${patientData.painLevel ? ` with a pain level of ${patientData.painLevel}/10` : ''}${patientData.duration ? ` for ${patientData.duration}` : ''}. An AI health tool suggested this may be ${parsed.diagnosisName.toLowerCase()} with ${parsed.confidence}% confidence and recommended ${urgencyLevel.toLowerCase()}.${parsed.alternatives ? ` Other possibilities mentioned were ${parsed.alternatives.toLowerCase()}.` : ''}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(doctorSummary);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const handleDownloadPDF = () => {
        const report = `
HEALTHHUDDLE CONSULTATION REPORT
================================
Date: ${new Date().toLocaleDateString()}

PATIENT SYMPTOMS:
${patientData.symptoms}

PRIMARY ASSESSMENT:
${parsed.diagnosisName}
${parsed.diagnosisReason}

Confidence: ${parsed.confidence}%
Urgency: ${consensus.urgency?.message || 'Consult healthcare provider'}

RECOMMENDED ACTIONS:
${parsed.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

${parsed.alternatives ? `OTHER POSSIBILITIES: ${parsed.alternatives}` : ''}

${parsed.warningSignsText ? `SEEK IMMEDIATE CARE IF: ${parsed.warningSignsText}` : ''}

AGENT DISCUSSION:
${messages.filter(m => !m.isPatient).map(m => `[${m.agent}]: ${m.text}`).join('\n\n')}

---
DISCLAIMER: This report is generated by AI for informational purposes only.
Always consult a qualified healthcare provider for medical decisions.
        `.trim();

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'healthhuddle-report.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <section className="consensus-section">
            <div className="consensus-card glass-panel-elevated">
                {/* Header */}
                <div className="consensus-header">
                    <div className="consensus-title">
                        <span className="consensus-icon">🎯</span>
                        <div>
                            <h2>Team Consensus</h2>
                            <p className="text-muted">All 4 agents have weighed in</p>
                        </div>
                    </div>
                    <UrgencyBadge urgency={consensus.urgency} />
                </div>

                {/* Primary Diagnosis - Cleaner Format */}
                <div className="diagnosis-box">
                    <div className="diagnosis-label">Primary Assessment</div>
                    <div className="diagnosis-name" style={{ fontSize: '1.4rem', fontWeight: '600' }}>
                        {parsed.diagnosisName}
                    </div>
                    {parsed.diagnosisReason && (
                        <div className="diagnosis-reason" style={{
                            marginTop: '8px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem',
                            fontStyle: 'italic'
                        }}>
                            {parsed.diagnosisReason}
                        </div>
                    )}
                    <div className="diagnosis-confidence">
                        <div className="confidence-bar">
                            <div
                                className="confidence-fill"
                                style={{ width: `${parsed.confidence}%` }}
                            />
                        </div>
                        <span className="confidence-text">{parsed.confidence}% confidence</span>
                    </div>
                </div>

                {/* Recommendations */}
                {parsed.recommendations.length > 0 && (
                    <div className="recommendations">
                        <h3>✅ What You Should Do</h3>
                        <ul className="recommendations-list">
                            {parsed.recommendations.slice(0, 5).map((rec, index) => (
                                <li key={index} className="recommendation-item">
                                    <span className="recommendation-number">{index + 1}</span>
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Warning Signs */}
                {parsed.warningSignsText && (
                    <div className="warning-signs" style={{
                        background: 'rgba(255, 82, 82, 0.1)',
                        border: '1px solid rgba(255, 82, 82, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-md)',
                        marginTop: 'var(--space-lg)'
                    }}>
                        <h4 style={{ color: 'var(--agent-safety)', margin: '0 0 8px 0' }}>
                            ⚠️ Seek Immediate Care If:
                        </h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                            {parsed.warningSignsText}
                        </p>
                    </div>
                )}

                {/* Alternatives */}
                {parsed.alternatives && (
                    <div className="alternatives" style={{ marginTop: 'var(--space-lg)' }}>
                        <h4 style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                            Other Possibilities to Discuss:
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                            {parsed.alternatives}
                        </p>
                    </div>
                )}

                {/* Doctor Summary */}
                <div className="doctor-summary">
                    <h4>📝 What to Tell Your Doctor</h4>
                    <div className="doctor-summary-text">
                        {doctorSummary}
                    </div>
                    <button className="copy-button" onClick={handleCopy}>
                        {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
                    </button>
                </div>

                {/* Sources */}
                {consensus.sources && consensus.sources.length > 0 && (
                    <div className="sources-section">
                        <h4>🔍 Sources Consulted ({consensus.sources.length})</h4>
                        <div className="sources-list">
                            {consensus.sources.map((source, index) => (
                                <span key={index} className="source-pill">
                                    <span className="source-icon">{source.icon}</span>
                                    {source.title}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button className="action-button primary" onClick={handleDownloadPDF}>
                        📄 Download Report
                    </button>
                    <button className="action-button secondary" onClick={onNewConsultation}>
                        🔄 New Consultation
                    </button>
                </div>
            </div>
        </section>
    );
}

export default ConsensusDashboard;
