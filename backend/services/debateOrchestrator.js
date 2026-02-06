import { generateAgentResponse, checkRedFlags } from './geminiService.js';
import { getMedicalSources } from '../data/sources.js';

// Store interjections by session
const sessionInterjections = new Map();

export function addInterjection(sessionId, message) {
    if (!sessionInterjections.has(sessionId)) {
        sessionInterjections.set(sessionId, []);
    }
    sessionInterjections.get(sessionId).push({
        message,
        timestamp: Date.now(),
        processed: false
    });
}

function getUnprocessedInterjection(sessionId) {
    const interjections = sessionInterjections.get(sessionId) || [];
    const unprocessed = interjections.find(i => !i.processed);
    if (unprocessed) {
        unprocessed.processed = true;
        return unprocessed.message;
    }
    return null;
}

export async function runDebate(patientInput, onEvent) {
    const { symptoms, painLevel, duration } = patientInput;
    const sessionId = `session_${Date.now()}`;

    // Initialize sources
    const sources = getMedicalSources(symptoms);

    // Send initial status
    onEvent({
        type: 'status',
        message: 'Analyzing your symptoms...',
        phase: 'initialization'
    });

    // Check for red flags first
    const redFlagCheck = await checkRedFlags(symptoms);

    if (redFlagCheck.isEmergency) {
        onEvent({
            type: 'emergency',
            condition: redFlagCheck.condition,
            message: 'STOP: Please call emergency services (911) immediately or go to the nearest emergency room.',
            reasoning: redFlagCheck.reasoning
        });
        return;
    }

    onEvent({
        type: 'status',
        message: 'Starting team consultation...',
        phase: 'debate'
    });

    const messages = [];
    const agentOrder = ['guidelines', 'evidence', 'cases', 'safety'];
    const agentNames = {
        guidelines: 'Guidelines',
        evidence: 'Evidence',
        cases: 'Cases',
        safety: 'Safety'
    };

    // Run through each agent
    for (const agent of agentOrder) {
        // Check for patient interjection before each agent speaks
        const interjection = getUnprocessedInterjection(sessionId);

        onEvent({
            type: 'agent_speaking',
            agent: agentNames[agent],
            status: 'thinking'
        });

        const context = {
            symptoms,
            painLevel,
            duration,
            previousMessages: messages.map(m => `${m.agent}: ${m.text}`).join('\n\n'),
            interjection
        };

        try {
            const response = await generateAgentResponse(agent, context);

            // Get relevant sources for this agent
            const agentSources = sources[agent] || [];

            const message = {
                agent: agentNames[agent],
                text: response,
                sources: agentSources,
                timestamp: new Date().toISOString()
            };

            messages.push(message);

            onEvent({
                type: 'agent_message',
                ...message
            });

        } catch (error) {
            console.error(`Error from ${agent}:`, error);
            onEvent({
                type: 'agent_error',
                agent: agentNames[agent],
                error: 'Had trouble responding, but the team continues...'
            });
        }
    }

    // Generate consensus
    onEvent({
        type: 'status',
        message: 'Building team consensus...',
        phase: 'consensus'
    });

    try {
        const consensusContext = {
            symptoms,
            painLevel,
            duration,
            previousMessages: messages.map(m => `${m.agent}: ${m.text}`).join('\n\n')
        };

        const consensusResponse = await generateAgentResponse('consensus', consensusContext);

        // Parse urgency from consensus
        const urgency = parseUrgency(consensusResponse);

        // Combine all sources
        const allSources = Object.values(sources).flat();

        onEvent({
            type: 'consensus',
            text: consensusResponse,
            urgency,
            sources: allSources,
            agentMessages: messages
        });

    } catch (error) {
        console.error('Error generating consensus:', error);
        onEvent({
            type: 'consensus_error',
            error: 'Unable to generate final consensus. Please consult a healthcare provider.'
        });
    }

    // Cleanup
    sessionInterjections.delete(sessionId);
}

function parseUrgency(consensusText) {
    const text = consensusText.toUpperCase();

    if (text.includes('CRITICAL') || text.includes('ER NOW') || text.includes('EMERGENCY')) {
        return { level: 'CRITICAL', color: '#ff4444', message: 'ER immediately' };
    }
    if (text.includes('HIGH') || text.includes('URGENT CARE') || text.includes('TODAY')) {
        return { level: 'HIGH', color: '#ff9944', message: 'Urgent care today' };
    }
    if (text.includes('MEDIUM') || text.includes('24 HOURS') || text.includes('WITHIN 24')) {
        return { level: 'MEDIUM', color: '#ffcc00', message: 'Doctor within 24 hours' };
    }
    return { level: 'LOW', color: '#44cc44', message: 'Monitor 24-48 hours' };
}
