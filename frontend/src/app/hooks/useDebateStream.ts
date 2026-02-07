import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { startDebateStream, parseSSEEvent, sendInterjection as apiSendInterjection, skipQuestion as apiSkipQuestion } from '../services/api';
import type { AgentType, Source, ConsensusResult, DebateSSEEvent } from '../types';

export interface DisplayMessage {
    id: string;
    agent: string;
    agentKey: AgentType;
    content: string;
    sources: Source[];
    isPatient?: boolean;
}

export function useDebateStream(patientData: any) {
    const navigate = useNavigate();

    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [currentSpeaker, setCurrentSpeaker] = useState<AgentType | null>(null);
    const [lastSpeaker, setLastSpeaker] = useState<AgentType | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('Connecting to AI team...');
    const [isDebating, setIsDebating] = useState(true);
    const [consensus, setConsensus] = useState<ConsensusResult | null>(null);
    const [pendingQuestion, setPendingQuestion] = useState<{ agent: string; question: string } | null>(null);
    const [questionTimer, setQuestionTimer] = useState<number>(10);
    const [isSending, setIsSending] = useState(false);

    const eventSourceRef = useRef<EventSource | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const consensusRef = useRef<ConsensusResult | null>(null);
    const messagesRef = useRef<DisplayMessage[]>([]);

    // Keep refs in sync
    useEffect(() => {
        consensusRef.current = consensus;
    }, [consensus]);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    // Auto-skip logic
    const handleAutoSkip = useCallback(async () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        try {
            await apiSkipQuestion();
            setPendingQuestion(null);
        } catch (error) {
            console.error('Failed to skip question:', error);
        }
    }, []);

    // Timer effect
    useEffect(() => {
        if (pendingQuestion) {
            setQuestionTimer(10);
            timerRef.current = setInterval(() => {
                setQuestionTimer((prev) => {
                    if (prev <= 1) {
                        handleAutoSkip();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };
        }
    }, [pendingQuestion, handleAutoSkip]);

    // SSE Connection
    useEffect(() => {
        if (!patientData?.symptoms) {
            navigate('/intake');
            return;
        }

        const eventSource = startDebateStream(
            patientData.symptoms,
            patientData.severity,
            patientData.duration
        );
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
            const parsed = parseSSEEvent(event.data);
            if (!parsed) return;
            handleSSEEvent(parsed);
        };

        eventSource.onerror = () => {
            setStatusMessage('Connection lost. Please refresh to try again.');
            setIsDebating(false);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [patientData, navigate]);

    const handleSSEEvent = (event: DebateSSEEvent) => {
        switch (event.type) {
            case 'connected':
                setStatusMessage('Connected! AI team is analyzing your symptoms...');
                break;

            case 'status':
                setStatusMessage(event.message);
                break;

            case 'agent_speaking':
                const agentKeyMap: Record<string, AgentType> = {
                    'Guidelines': 'guidelines',
                    'Evidence': 'evidence',
                    'Cases': 'cases',
                    'Safety': 'safety',
                };
                setCurrentSpeaker(agentKeyMap[event.agent] || null);
                break;

            case 'agent_message':
                const agentMsgId = `agent-${Date.now()}-${Math.random()}`;
                setMessages(prev => [...prev, {
                    id: agentMsgId,
                    agent: event.agent,
                    agentKey: event.agentKey,
                    content: event.text,
                    sources: event.sources || [],
                }]);
                setLastSpeaker(event.agentKey);
                setCurrentSpeaker(null);
                break;

            case 'agent_question':
                setPendingQuestion({
                    agent: event.agent,
                    question: event.question,
                });
                break;

            case 'patient_response':
                setMessages(prev => {
                    const exists = prev.some(m => m.isPatient && m.content === event.message);
                    if (exists) return prev;
                    return [...prev, {
                        id: `patient-${Date.now()}`,
                        agent: 'You',
                        agentKey: 'guidelines',
                        content: event.message,
                        sources: [],
                        isPatient: true,
                    }];
                });
                setPendingQuestion(null);
                break;

            case 'consensus':
                const newConsensus = {
                    text: event.text,
                    urgency: event.urgency,
                    sources: event.sources,
                    agentMessages: event.agentMessages,
                };
                setConsensus(newConsensus);
                consensusRef.current = newConsensus;
                break;

            case 'complete':
                setIsDebating(false);
                setStatusMessage('Consultation complete!');
                setTimeout(() => {
                    navigate('/results', {
                        state: {
                            consensus: consensusRef.current,
                            patientData,
                            messages: messagesRef.current.filter(m => !m.isPatient),
                        }
                    });
                }, 1500);
                break;

            case 'error':
                setStatusMessage(`Error: ${event.message}`);
                setIsDebating(false);
                break;
        }
    };

    const sendInterjection = async (input: string) => {
        if (!input.trim() || isSending) return;
        setIsSending(true);
        try {
            await apiSendInterjection(input);
            setPendingQuestion(null);
        } catch (error) {
            console.error('Failed to send interjection:', error);
        } finally {
            setIsSending(false);
        }
    };

    const skipQuestion = async () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        try {
            await apiSkipQuestion();
            setPendingQuestion(null);
        } catch (error) {
            console.error('Failed to skip question:', error);
        }
    };

    return {
        messages,
        currentSpeaker,
        lastSpeaker,
        statusMessage,
        isDebating,
        pendingQuestion,
        questionTimer,
        isSending,
        sendInterjection,
        skipQuestion
    };
}
