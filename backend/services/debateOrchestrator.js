import { generateAgentResponse, generateFollowUpQuestion } from './geminiService.js';
import { getMedicalSources } from '../data/sources.js';
import { agentConfig } from '../config.js';

// Store interjections and question responses by session
const sessionInterjections = new Map();
const pendingQuestions = new Map();

export function addInterjection(sessionId, message) {
    if (!sessionInterjections.has(sessionId)) {
        sessionInterjections.set(sessionId, []);
    }
    sessionInterjections.get(sessionId).push({
        message,
        timestamp: Date.now(),
        processed: false
    });

    // Also resolve any pending question
    if (pendingQuestions.has(sessionId)) {
        const { resolve } = pendingQuestions.get(sessionId);
        pendingQuestions.delete(sessionId);
        resolve(message);
    }
}

export function skipQuestion(sessionId) {
    if (pendingQuestions.has(sessionId)) {
        const { resolve } = pendingQuestions.get(sessionId);
        pendingQuestions.delete(sessionId);
        resolve(null);
    }
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

// Wait for user response with timeout
function waitForUserResponse(sessionId, timeoutMs) {
    return new Promise((resolve) => {
        pendingQuestions.set(sessionId, { resolve });

        // Auto-resolve after timeout
        setTimeout(() => {
            if (pendingQuestions.has(sessionId)) {
                pendingQuestions.delete(sessionId);
                resolve(null); // null means timeout/skipped
            }
        }, timeoutMs);
    });
}

export async function runDebate(patientInput, onEvent, sessionId) {
    const { symptoms } = patientInput;
    const actualSessionId = sessionId || `session_${Date.now()}`;

    // Initialize sources
    const sources = getMedicalSources(symptoms);

    // Get timing config
    const { readingPauseMs, beforeConsensusPauseMs, questionTimeoutMs } = agentConfig.timing;

    // Send initial status
    onEvent({
        type: 'status',
        message: 'Analyzing your symptoms...',
        phase: 'initialization'
    });

    const messages = [];
    const agentOrder = ['guidelines', 'evidence', 'cases', 'safety'];

    // Questions that agents might ask (one per agent, alternating)
    const shouldAskQuestion = [true, false, true, false]; // Guidelines and Cases ask questions

    // Run through each agent
    for (let i = 0; i < agentOrder.length; i++) {
        const agent = agentOrder[i];
        const agentInfo = agentConfig.agents[agent];

        // Check for patient interjection before each agent speaks
        const interjection = getUnprocessedInterjection(actualSessionId);

        onEvent({
            type: 'agent_speaking',
            agent: agentInfo.name,
            status: 'thinking'
        });

        const context = {
            symptoms,
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

            // Reading pause
            await sleep(readingPauseMs);

            // Ask a follow-up question if this agent should
            if (shouldAskQuestion[i] && i < agentOrder.length - 1) {
                const question = await generateFollowUpQuestion(agent, symptoms, messages);

                if (question) {
                    onEvent({
                        type: 'agent_question',
                        agent: agentInfo.name,
                        question: question,
                        timeoutSeconds: Math.floor(questionTimeoutMs / 1000)
                    });

                    // Wait for user response (with timeout)
                    const userAnswer = await waitForUserResponse(actualSessionId, questionTimeoutMs);

                    if (userAnswer) {
                        // Add the answer as context for next agents
                        messages.push({
                            agent: 'Patient',
                            text: userAnswer,
                            isPatient: true,
                            timestamp: new Date().toISOString()
                        });

                        onEvent({
                            type: 'patient_response',
                            message: userAnswer,
                            timestamp: new Date().toISOString()
                        });
                    } else {
                        onEvent({
                            type: 'status',
                            message: 'Moving on...',
                            phase: 'debate'
                        });
                    }
                }
            }

            // Status update for next agent
            if (i < agentOrder.length - 1) {
                onEvent({
                    type: 'status',
                    message: `${agentConfig.agents[agentOrder[i + 1]].name} is preparing their thoughts...`,
                    phase: 'reading_pause'
                });
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
        message: 'All agents have spoken. Building consensus...',
        phase: 'pre_consensus'
    });
    await sleep(beforeConsensusPauseMs);

    // Check for any last-minute interjections
    const finalInterjection = getUnprocessedInterjection(actualSessionId);

    // Generate consensus
    onEvent({
        type: 'status',
        message: 'Building team consensus...',
        phase: 'consensus'
    });

    try {
        const consensusContext = {
            symptoms,
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
            agentMessages: messages.filter(m => !m.isPatient)
        });

    } catch (error) {
        console.error('Error generating consensus:', error);
        onEvent({
            type: 'consensus_error',
            error: 'Unable to generate final consensus. Please consult a healthcare provider.'
        });
    }

    // Cleanup
    sessionInterjections.delete(actualSessionId);
}

function parseUrgency(consensusText) {
    // Look specifically for the URGENCY: line in the response
    const urgencyMatch = consensusText.match(/URGENCY:\s*(LOW|MEDIUM|HIGH|CRITICAL)/i);

    if (urgencyMatch) {
        const level = urgencyMatch[1].toUpperCase();
        switch (level) {
            case 'CRITICAL':
                return { level: 'CRITICAL', color: '#ff4444', message: 'Go to ER immediately' };
            case 'HIGH':
                return { level: 'HIGH', color: '#ff9944', message: 'Urgent care today' };
            case 'MEDIUM':
                return { level: 'MEDIUM', color: '#ffcc00', message: 'See doctor within 24 hours' };
            case 'LOW':
            default:
                return { level: 'LOW', color: '#44cc44', message: 'Monitor 24-48 hours' };
        }
    }

    // Fallback: scan for keywords if URGENCY line wasn't found
    const text = consensusText.toUpperCase();

    if (text.includes('ER NOW') || text.includes('EMERGENCY ROOM') || text.includes('CALL 911')) {
        return { level: 'CRITICAL', color: '#ff4444', message: 'Go to ER immediately' };
    }
    if (text.includes('URGENT CARE TODAY') || text.includes('GO TO URGENT CARE')) {
        return { level: 'HIGH', color: '#ff9944', message: 'Urgent care today' };
    }
    if (text.includes('WITHIN 24 HOURS') || text.includes('SEE A DOCTOR SOON')) {
        return { level: 'MEDIUM', color: '#ffcc00', message: 'See doctor within 24 hours' };
    }

    // Default to LOW for routine symptoms
    return { level: 'LOW', color: '#44cc44', message: 'Monitor 24-48 hours' };
}
