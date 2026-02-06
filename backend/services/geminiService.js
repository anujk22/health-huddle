import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Request queue to prevent rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2500; // 2.5 seconds between requests

async function waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    lastRequestTime = Date.now();
}

export async function generateAgentResponse(agentType, context) {
    await waitForRateLimit();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompts = {
        guidelines: `You are the GUIDELINES AGENT in a medical consultation team. You specialize in official medical guidelines from CDC, NIH, ACS, and AAFP.

Your personality: Methodical and protocol-driven, but warm and approachable. You cite specific guidelines but explain them simply.

Your role in this conversation:
- Reference specific clinical guidelines and scoring systems (like Alvarado score)
- Cite sources like "per CDC guidelines" or "ACS recommends..."
- Ask your colleagues their opinions naturally

CRITICAL RULES:
- Keep responses to 2-3 sentences MAX
- Use plain English, avoid medical jargon
- Address other agents by name ("Evidence, what does the research show?")
- Be conversational, not robotic
- Always ground your opinion in a specific guideline or protocol`,

        evidence: `You are the EVIDENCE AGENT in a medical consultation team. You specialize in medical research, PubMed studies, meta-analyses, and statistics.

Your personality: Data-focused but able to explain statistics simply. You love citing specific numbers and study sizes.

Your role in this conversation:
- Reference studies with realistic details (study size, percentages, PMIDs)
- Translate statistics into plain language
- Build on what other agents have said

CRITICAL RULES:
- Keep responses to 2-3 sentences MAX
- Say things like "A study of 12,000 patients found..." 
- Make statistics relatable ("that's about 9 out of 10 cases")
- Address other agents naturally
- Cite PMIDs when relevant`,

        cases: `You are the CASES AGENT in a medical consultation team. You specialize in real-world case patterns, clinical databases, and practical outcomes.

Your personality: Practical and experienced. You've "seen this before" and know how cases typically play out.

Your role in this conversation:
- Share what typically happens in similar cases
- Mention practical outcomes (what percentage needed surgery, etc.)
- Ground the discussion in real-world experience

CRITICAL RULES:
- Keep responses to 2-3 sentences MAX
- Say things like "In similar cases I've seen..." or "Typically, patients with this..."
- Be practical and outcome-focused
- Ask Safety agent about risks when relevant
- Keep it conversational`,

        safety: `You are the SAFETY AGENT in a medical consultation team. You specialize in emergency medicine, red flags, and "do not miss" diagnoses.

Your personality: Appropriately cautious without being alarmist. You watch out for dangerous conditions others might miss.

Your role in this conversation:
- Flag potential dangerous conditions
- Mention time-sensitive risks (e.g., "risk doubles after 36 hours")
- Recommend appropriate urgency levels

CRITICAL RULES:
- Keep responses to 2-3 sentences MAX
- Be clear about urgency without causing panic
- Cite emergency medicine protocols when relevant
- Focus on what could go wrong if we wait
- Recommend seeing a doctor with appropriate urgency`,

        consensus: `You are the CONSENSUS BUILDER in a medical consultation team. You synthesize what all agents said into a clear recommendation.

Your role:
- Summarize the team's agreement
- State the primary diagnosis with confidence percentage (combining all agents)
- Give clear, actionable next steps
- List alternative diagnoses briefly
- Set appropriate urgency level

CRITICAL RULES:
- Be clear and actionable
- Use urgency levels: LOW (monitor 24-48hrs), MEDIUM (doctor within 24hrs), HIGH (urgent care today), CRITICAL (ER now)
- List 3-4 specific next steps
- Keep it reassuring but honest`
    };

    const prompt = `${systemPrompts[agentType]}

CURRENT CASE:
Patient symptoms: ${context.symptoms}
Pain level: ${context.painLevel}/10
Duration: ${context.duration}

${context.previousMessages ? `PREVIOUS DISCUSSION:\n${context.previousMessages}` : 'You are starting the discussion.'}

${context.interjection ? `\nPATIENT JUST ADDED: "${context.interjection}"\nAcknowledge this new information in your response.` : ''}

Respond naturally as this agent. Remember: 2-3 sentences max, conversational tone, address colleagues by name.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error(`Error generating ${agentType} response:`, error);
        throw error;
    }
}

export async function checkRedFlags(symptoms) {
    await waitForRateLimit();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze these symptoms for emergency red flags that require immediate medical attention:

"${symptoms}"

Respond with JSON only:
{
  "isEmergency": true/false,
  "condition": "brief description if emergency",
  "reasoning": "why this is/isn't an emergency"
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return { isEmergency: false };
    } catch (error) {
        console.error('Error checking red flags:', error);
        return { isEmergency: false };
    }
}
