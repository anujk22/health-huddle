// TypeScript interfaces for HealthHuddle API

export type AgentType = 'guidelines' | 'evidence' | 'cases' | 'safety';

export interface Source {
    title: string;
    url?: string;
    type: string;
}

export interface AgentMessage {
    agent: string;
    agentKey: AgentType;
    text: string;
    sources: Source[];
    timestamp: string;
}

export interface UrgencyLevel {
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    color: string;
    message: string;
}

export interface ConsensusResult {
    text: string;
    urgency: UrgencyLevel;
    sources: Source[];
    agentMessages: AgentMessage[];
}

export interface PatientQuestion {
    agent: string;
    question: string;
    timeoutSeconds: number;
}

export interface EmergencyCheckResult {
    isEmergency: boolean;
    condition?: string;
    message?: string;
}

// SSE Event Types
export interface SSEConnectedEvent {
    type: 'connected';
    sessionId: string;
}

export interface SSEStatusEvent {
    type: 'status';
    message: string;
    phase: 'initialization' | 'reading_pause' | 'pre_consensus' | 'consensus' | 'debate';
}

export interface SSEAgentSpeakingEvent {
    type: 'agent_speaking';
    agent: string;
    status: 'thinking';
}

export interface SSEAgentMessageEvent {
    type: 'agent_message';
    agent: string;
    agentKey: AgentType;
    text: string;
    sources: Source[];
    timestamp: string;
}

export interface SSEAgentQuestionEvent {
    type: 'agent_question';
    agent: string;
    question: string;
    timeoutSeconds: number;
}

export interface SSEPatientResponseEvent {
    type: 'patient_response';
    message: string;
    timestamp: string;
}

export interface SSEInterjectionEvent {
    type: 'interjection';
    message: string;
    timestamp: string;
}

export interface SSEConsensusEvent {
    type: 'consensus';
    text: string;
    urgency: UrgencyLevel;
    sources: Source[];
    agentMessages: AgentMessage[];
}

export interface SSECompleteEvent {
    type: 'complete';
}

export interface SSEErrorEvent {
    type: 'error';
    message: string;
}

export type DebateSSEEvent =
    | SSEConnectedEvent
    | SSEStatusEvent
    | SSEAgentSpeakingEvent
    | SSEAgentMessageEvent
    | SSEAgentQuestionEvent
    | SSEPatientResponseEvent
    | SSEInterjectionEvent
    | SSEConsensusEvent
    | SSECompleteEvent
    | SSEErrorEvent;

// Intake form data
export interface IntakeData {
    mainConcern: string;
    location: string;
    duration: string;
    severity: string;
    triggers: string;
    otherDetails: string;
    symptoms: string; // Combined symptom string
}
