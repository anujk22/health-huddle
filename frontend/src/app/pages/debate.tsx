import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { SpaceBackground, AuroraOverlay } from '../components/space-background';
import { Header } from '../components/header-new';
import { AgentOrb } from '../components/agent-orb';
import { FileText, Activity, AlertTriangle, Plus, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router';
import { useDebateStream } from '../hooks/useDebateStream';
import type { AgentType, Source } from '../types';

export function DebatePage() {
  const location = useLocation();
  const patientData = (location.state as any)?.patientData;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [interjectionInput, setInterjectionInput] = useState('');

  const {
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
  } = useDebateStream(patientData);

  // Auto-scroll logic remains in UI component
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingQuestion]);

  const handleSendInterjection = async () => {
    if (!interjectionInput.trim()) return;
    await sendInterjection(interjectionInput);
    setInterjectionInput('');
  };

  const handleSkipQuestion = async () => {
    await skipQuestion();
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

  // Helper for message styles with glow
  const getMessageStyles = (agentKey: AgentType, isLatest: boolean) => {
    const baseColors: Record<AgentType, string> = {
      guidelines: 'bg-cyan-950/30 border-cyan-500/30 shadow-cyan-900/20',
      evidence: 'bg-purple-950/30 border-purple-500/30 shadow-purple-900/20',
      cases: 'bg-green-950/30 border-green-500/30 shadow-green-900/20',
      safety: 'bg-red-950/30 border-red-500/30 shadow-red-900/20',
    };

    let style = baseColors[agentKey] || 'bg-zinc-950/80 border-gray-800';

    if (isLatest) {
      style += ' shadow-[0_0_15px_rgba(0,0,0,0.3)] ring-1 ring-white/10';
    }

    return style;
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
    <div className="relative h-[100dvh] bg-black text-white overflow-hidden flex flex-col">
      <SpaceBackground />
      <AuroraOverlay />
      <Header />

      <div className="relative z-10 flex-1 flex flex-col pt-32 max-w-5xl mx-auto w-full">
        {/* Agent orbs */}
        <div className="px-6 mb-4 flex-shrink-0">
          <div className="flex justify-center gap-4 md:gap-8 bg-zinc-950/50 backdrop-blur-md p-4 rounded-2xl border border-white/5 mx-auto w-fit">
            <AgentOrb type="guidelines" isSpeaking={currentSpeaker === 'guidelines' || lastSpeaker === 'guidelines'} isThinking={currentSpeaker === 'guidelines'} />
            <AgentOrb type="evidence" isSpeaking={currentSpeaker === 'evidence' || lastSpeaker === 'evidence'} isThinking={currentSpeaker === 'evidence'} />
            <AgentOrb type="cases" isSpeaking={currentSpeaker === 'cases' || lastSpeaker === 'cases'} isThinking={currentSpeaker === 'cases'} />
            <AgentOrb type="safety" isSpeaking={currentSpeaker === 'safety' || lastSpeaker === 'safety'} isThinking={currentSpeaker === 'safety'} />
          </div>
        </div>

        {/* Status message */}
        <div className="text-center mb-2 flex-shrink-0 h-6">
          <motion.div
            key={statusMessage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400/80 uppercase tracking-widest"
          >
            {isDebating && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            )}
            {statusMessage}
          </motion.div>
        </div>

        {/* Conversation area */}
        <div className="flex-1 px-4 md:px-6 pb-4 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* User symptoms card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-white to-transparent opacity-50" />
              <div className="text-xs font-bold text-white/50 mb-2 tracking-widest uppercase">Patient Case</div>
              <div className="text-lg text-white font-medium leading-relaxed">{patientData?.symptoms || 'No symptoms provided'}</div>
            </motion.div>

            {/* Agent messages */}
            {messages.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`backdrop-blur-sm border rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden
                  ${message.isPatient
                    ? 'bg-zinc-900/60 border-white/10 ml-8 md:ml-16'
                    : getMessageStyles(message.agentKey, idx === messages.length - 1)
                  }`}
              >
                {/* Glow effect for agents */}
                {!message.isPatient && (
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-${getAgentTextColor(message.agentKey).split('-')[1]}-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none`} />
                )}

                <div className="flex items-center gap-3 mb-3">
                  {!message.isPatient && (
                    <div className={`w-2 h-2 rounded-full bg-${getAgentTextColor(message.agentKey).split('-')[1]}-400 shadow-[0_0_10px_currentColor]`} />
                  )}
                  <div className={`text-xs font-bold tracking-widest uppercase
                    ${message.isPatient ? 'text-white/60' : getAgentTextColor(message.agentKey)}`}
                  >
                    {message.agent}
                  </div>
                  {/* Timestamp removed for cleaner look, or could add back small */}
                </div>

                <div className="text-gray-200 leading-relaxed text-sm md:text-base">
                  {message.content}
                </div>

                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                    {message.sources.map((source, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px]
                          bg-black/40 text-white/60 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-colors cursor-help"
                        title={source.title}
                      >
                        {getSourceIcon(source)}
                        <span className="truncate max-w-[150px]">{source.title}</span>
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
                className="bg-indigo-950/40 backdrop-blur-md border border-indigo-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-indigo-500/5 animate-pulse" />

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    <div className="text-xs font-bold text-indigo-300 tracking-widest uppercase">
                      {pendingQuestion.agent} ASKS
                    </div>
                  </div>
                  <div className="text-xs text-indigo-300/70 font-mono bg-indigo-950/50 px-2 py-1 rounded border border-indigo-500/20">
                    AUTO-SKIP: <span className={`${questionTimer <= 3 ? 'text-red-400' : 'text-white'}`}>{questionTimer}s</span>
                  </div>
                </div>
                <div className="text-white text-lg font-medium mb-6 relative z-10">{pendingQuestion.question}</div>

                {/* Text input for answering - duplicated logic but focused styling */}
                <div className="flex gap-2 relative z-10">
                  <input
                    type="text"
                    value={interjectionInput}
                    onChange={(e) => setInterjectionInput(e.target.value)}
                    placeholder="Type your answer..."
                    autoFocus
                    className="flex-1 bg-black/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-white
                      focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 placeholder:text-white/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendInterjection();
                    }}
                  />
                  <button
                    onClick={handleSendInterjection}
                    disabled={isSending || !interjectionInput.trim()}
                    className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-6 rounded-xl
                      transition-all duration-200 disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                  >
                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send'}
                  </button>
                  <button
                    onClick={handleSkipQuestion}
                    className="bg-white/5 hover:bg-white/10 text-white/60 font-medium px-4 rounded-xl
                      transition-all duration-200 border border-white/5"
                  >
                    Skip
                  </button>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input area - for interjections */}
        <div className="flex-shrink-0 p-4 md:p-6 border-t border-white/10 bg-black/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={interjectionInput}
                onChange={(e) => setInterjectionInput(e.target.value)}
                placeholder='Add details or ask a question...'
                className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3.5 text-white shadow-inner
                  focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50
                  placeholder:text-white/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendInterjection();
                }}
                disabled={!isDebating}
              />
              <button
                onClick={handleSendInterjection}
                disabled={!isDebating || isSending || !interjectionInput.trim()}
                className="bg-white text-black font-bold px-5 rounded-xl
                  hover:bg-cyan-50 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                <span className="hidden md:inline">Add</span>
              </button>
            </div>
            <div className="text-[10px] md:text-xs text-white/30 mt-2 text-center font-mono">
              AI medical debate in progress. Interject anytime.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}