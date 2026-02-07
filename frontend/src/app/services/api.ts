// API service for HealthHuddle backend communication

import type { EmergencyCheckResult, DebateSSEEvent } from '../types';

const API_BASE = '/api';

/**
 * Check if symptoms indicate an emergency situation
 */
export async function checkEmergency(symptoms: string): Promise<EmergencyCheckResult> {
    const response = await fetch(`${API_BASE}/check-emergency`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
        throw new Error('Failed to check emergency status');
    }

    return response.json();
}

/**
 * Start a debate session and return an EventSource for SSE streaming
 */
export function startDebateStream(
    symptoms: string,
    painLevel?: string,
    duration?: string
): EventSource {
    const params = new URLSearchParams({
        symptoms,
        ...(painLevel && { painLevel }),
        ...(duration && { duration }),
    });

    const eventSource = new EventSource(`${API_BASE}/debate/stream?${params.toString()}`);
    return eventSource;
}

/**
 * Parse an SSE data event into a typed DebateSSEEvent
 */
export function parseSSEEvent(data: string): DebateSSEEvent | null {
    try {
        return JSON.parse(data) as DebateSSEEvent;
    } catch {
        console.error('Failed to parse SSE event:', data);
        return null;
    }
}

/**
 * Send a patient interjection during the debate
 */
export async function sendInterjection(message: string): Promise<void> {
    const response = await fetch(`${API_BASE}/debate/current/interject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error('Failed to send interjection');
    }
}

/**
 * Skip a pending question during the debate
 */
export async function skipQuestion(): Promise<void> {
    const response = await fetch(`${API_BASE}/debate/current/skip-question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to skip question');
    }
}
