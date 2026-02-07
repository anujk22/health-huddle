import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { SpaceBackground, AuroraOverlay } from '../components/space-background';
import { Header } from '../components/header-new';
import { AgentOrb } from '../components/agent-orb';
import { FileText, Activity, AlertTriangle, Plus, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { startDebateStream, parseSSEEvent, sendInterjection, skipQuestion } from '../services/api';
import type {
  AgentType,
  Source,
  ConsensusResult,
  DebateSSEEvent
} from '../types';

interface DisplayMessage {
  id: string; // Unique ID to prevent duplicates
  agent: string;
  agentKey: AgentType;
  content: string;
  sources: Source[];
  isPatient?: boolean;
}

export function DebatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const patientData = (location.state as any)?.patientData;

  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<AgentType | null>(null); // Agent currently thinking
  const [lastSpeaker, setLastSpeaker] = useState<AgentType | null>(null); // Last agent who sent a message
  const [statusMessage, setStatusMessage] = useState<string>('Connecting to AI team...');
  const [isDebating, setIsDebating] = useState(true);
  const [consensus, setConsensus] = useState<ConsensusResult | null>(null);
  const [pendingQuestion, setPendingQuestion] = useState<{ agent: string; question: string } | null>(null);
  const [interjectionInput, setInterjectionInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [questionTimer, setQuestionTimer] = useState<number>(10);

  const eventSourceRef = useRef<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-skip timer for pending questions
  useEffect(() => {
    if (pendingQuestion) {
      setQuestionTimer(10);

      timerRef.current = setInterval(() => {
        setQuestionTimer((prev) => {
          if (prev <= 1) {
            // Auto-skip when timer reaches 0
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
  }, [pendingQuestion]);

  const handleAutoSkip = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    try {
      await skipQuestion();
      setPendingQuestion(null);
    } catch (error) {
      console.error('Failed to skip question:', error);
    }
  }, []);

  // Start debate when page loads
  useEffect(() => {
    if (!patientData?.symptoms) {
      // No symptoms, redirect to intake
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
        // Map agent name to key
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
        // Set this agent as the last speaker (for pulsating effect)
        setLastSpeaker(event.agentKey);
        setCurrentSpeaker(null); // No longer thinking
        break;

      case 'agent_question':
        setPendingQuestion({
          agent: event.agent,
          question: event.question,
        });
        break;

      case 'patient_response':
        // Only add if this exact message isn't already in the list
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

      case 'interjection':
        // Already handled by patient_response in most cases
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
        // Navigate to results after a short delay
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


  const handleSendInterjection = async () => {
    if (!interjectionInput.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendInterjection(interjectionInput);
      // Don't add locally - let the backend send patient_response to avoid duplicates
      setInterjectionInput('');
      setPendingQuestion(null);
    } catch (error) {
      console.error('Failed to send interjection:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSkipQuestion = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    try {
      await skipQuestion();
      setPendingQuestion(null);
    } catch (error) {
      console.error('Failed to skip question:', error);
    }
  };

  const getSourceIcon = (source: Source) => {
    if (source.type === 'warning' || source.type === 'safety') {
      return <AlertTriangle className="w-3 h-3" />;
    }
    if (source.type === 'study' || source.type === 'chart') {
      return <Activity className="w-3 h-3" />;
    }
    return <FileText className="w-3 h-3" />;
  };

  const getAgentBorderColor = (agentKey: AgentType) => {
    const colors: Record<AgentType, string> = {
      guidelines: 'border-cyan-500/30',
      evidence: 'border-purple-500/30',
      cases: 'border-green-500/30',
      safety: 'border-red-500/30',
    };
    return colors[agentKey];
  };

  const getAgentTextColor = (agentKey: AgentType) => {
    const colors: Record<AgentType, string> = {
      guidelines: 'text-cyan-400',
      evidence: 'text-purple-400',
      cases: 'text-green-400',
      safety: 'text-red-400',
    };
    return colors[agentKey];
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <SpaceBackground />
      <AuroraOverlay />
      <Header />

      <div className="relative z-10 min-h-screen flex flex-col pt-20">
        {/* Agent orbs */}
        <div className="px-6 mb-8 mt-6">
          <div className="flex justify-center gap-8 max-w-2xl mx-auto">
            <AgentOrb type="guidelines" isSpeaking={currentSpeaker === 'guidelines' || lastSpeaker === 'guidelines'} isThinking={currentSpeaker === 'guidelines'} />
            <AgentOrb type="evidence" isSpeaking={currentSpeaker === 'evidence' || lastSpeaker === 'evidence'} isThinking={currentSpeaker === 'evidence'} />
            <AgentOrb type="cases" isSpeaking={currentSpeaker === 'cases' || lastSpeaker === 'cases'} isThinking={currentSpeaker === 'cases'} />
            <AgentOrb type="safety" isSpeaking={currentSpeaker === 'safety' || lastSpeaker === 'safety'} isThinking={currentSpeaker === 'safety'} />
          </div>
        </div>

        {/* Status message */}
        <div className="text-center mb-4">
          <motion.div
            key={statusMessage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-cyan-400/80"
          >
            {isDebating && <Loader2 className="w-4 h-4 inline-block mr-2 animate-spin" />}
            {statusMessage}
          </motion.div>
        </div>

        {/* Conversation area */}
        <div className="flex-1 px-6 pb-6 max-w-5xl mx-auto w-full overflow-y-auto">
          <div className="space-y-4">
            {/* User symptoms card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-teal-950/40 backdrop-blur-sm border border-teal-500/30 rounded-xl p-4"
            >
              <div className="text-xs font-medium text-teal-400 mb-2 tracking-wider">YOUR SYMPTOMS</div>
              <div className="text-gray-200">{patientData?.symptoms || 'No symptoms provided'}</div>
            </motion.div>

            {/* Agent messages */}
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`backdrop-blur-sm border rounded-xl p-4
                  ${message.isPatient
                    ? 'bg-teal-950/40 border-teal-500/30 ml-12'
                    : `bg-zinc-950/80 ${getAgentBorderColor(message.agentKey)}`
                  }`}
              >
                <div className={`text-xs font-medium mb-3 tracking-wider uppercase
                  ${message.isPatient ? 'text-teal-400' : getAgentTextColor(message.agentKey)}`}
                >
                  {message.agent}
                </div>

                <div className="text-gray-300 leading-relaxed mb-4">
                  {message.content}
                </div>

                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {message.sources.map((source, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
                          bg-slate-800/50 text-slate-300 border border-slate-700/30"
                      >
                        {getSourceIcon(source)}
                        <span className="truncate max-w-[200px]">{source.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Pending question with YES/NO buttons */}
            {pendingQuestion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-950/40 backdrop-blur-sm border border-purple-500/40 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium text-purple-400 tracking-wider">
                    {pendingQuestion.agent} ASKS
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <span className={`font-mono ${questionTimer <= 3 ? 'text-red-400' : ''}`}>
                      {questionTimer}s
                    </span>
                    <span>until auto-skip</span>
                  </div>
                </div>
                <div className="text-gray-200 mb-4">{pendingQuestion.question}</div>

                {/* Text input for answering */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={interjectionInput}
                    onChange={(e) => setInterjectionInput(e.target.value)}
                    placeholder="Type your answer..."
                    className="flex-1 bg-zinc-900/80 border border-gray-700/50 rounded-lg px-4 py-3 text-sm
                      focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendInterjection();
                    }}
                  />
                  <button
                    onClick={handleSendInterjection}
                    disabled={isSending || !interjectionInput.trim()}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-6 rounded-lg
                      transition-all duration-200 disabled:opacity-50"
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
                  </button>
                  <button
                    onClick={handleSkipQuestion}
                    className="bg-zinc-800 hover:bg-zinc-700 text-gray-400 font-medium px-4 rounded-lg
                      transition-all duration-200"
                  >
                    Skip
                  </button>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area - for interjections */}
        <div className="p-6 border-t border-gray-800/50 bg-black/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={interjectionInput}
                onChange={(e) => setInterjectionInput(e.target.value)}
                placeholder='Add more details, correct something, or tell them about new symptoms...'
                className="flex-1 bg-zinc-900/80 border border-gray-700/50 rounded-xl px-4 py-3 text-sm
                  focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20
                  placeholder:text-gray-600"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendInterjection();
                }}
                disabled={!isDebating}
              />
              <button
                onClick={handleSendInterjection}
                disabled={!isDebating || isSending || !interjectionInput.trim()}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-6 rounded-xl
                  transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Add
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Examples: "I forgot to mention I have a fever" • "The pain just got worse" • "I'm female, 28 years old"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}