import { generateAgentResponse, checkRedFlags } from './geminiService.js';
import { getMedicalSources } from '../data/sources.js';
import { agentConfig } from '../config.js';

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

// Helper to add reading pause
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function runDebate(patientInput, onEvent) {
    const { symptoms, painLevel, duration } = patientInput;
    const sessionId = `session_${Date.now()}`;

    // Initialize sources
    const sources = getMedicalSources(symptoms);

    // Get timing config
    const { readingPauseMs, beforeConsensusPauseMs } = agentConfig.timing;

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
        message: 'Starting team consultation... (You can add information anytime below)',
        phase: 'debate'
    });

    const messages = [];
    const agentOrder = ['guidelines', 'evidence', 'cases', 'safety'];

    // Run through each agent
    for (let i = 0; i < agentOrder.length; i++) {
        const agent = agentOrder[i];
        const agentInfo = agentConfig.agents[agent];

        // Check for patient interjection before each agent speaks
        const interjection = getUnprocessedInterjection(sessionId);

        onEvent({
            type: 'agent_speaking',
            agent: agentInfo.name,
            status: 'thinking'
        });

        const context = {
            symptoms,
            painLevel,
            duration,
            previousMessages: messages.map(m => `${m.agent}: ${m.text}`).join('\n\n'),
            interjection,
            agentNames: Object.fromEntries(
                Object.entries(agentConfig.agents).map(([k, v]) => [k, v.name])
            )
        };

        try {
            const response = await generateAgentResponse(agent, context);

            // Get relevant sources for this agent
            const agentSources = sources[agent] || [];

            const message = {
                agent: agentInfo.name,
                agentKey: agent,
                text: response,
                sources: agentSources,
                timestamp: new Date().toISOString()
            };

            messages.push(message);

            onEvent({
                type: 'agent_message',
                ...message
            });

            // Add reading pause after each message (except the last one before consensus)
            if (i < agentOrder.length - 1) {
                onEvent({
                    type: 'status',
                    message: `Take your time to read... ${agentConfig.agents[agentOrder[i + 1]].name} is preparing their thoughts`,
                    phase: 'reading_pause'
                });
                await sleep(readingPauseMs);
            }

        } catch (error) {
            console.error(`Error from ${agent}:`, error);
            onEvent({
                type: 'agent_error',
                agent: agentInfo.name,
                error: 'Had trouble responding, but the team continues...'
            });
        }
    }

    // Pause before consensus to allow final interjections
    onEvent({
        type: 'status',
        message: 'All agents have spoken. Add any final details now before we summarize...',
        phase: 'pre_consensus'
    });
    await sleep(beforeConsensusPauseMs);

    // Check for any last-minute interjections
    const finalInterjection = getUnprocessedInterjection(sessionId);

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
            previousMessages: messages.map(m => `${m.agent}: ${m.text}`).join('\n\n'),
            interjection: finalInterjection,
            agentNames: Object.fromEntries(
                Object.entries(agentConfig.agents).map(([k, v]) => [k, v.name])
            )
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
