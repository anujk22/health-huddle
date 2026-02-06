import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { runDebate, addInterjection } from './services/debateOrchestrator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Store active SSE connections
const activeConnections = new Map();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start a new debate session
app.post('/api/debate/start', async (req, res) => {
  const { symptoms, painLevel, duration } = req.body;
  
  if (!symptoms || symptoms.trim().length === 0) {
    return res.status(400).json({ error: 'Symptoms are required' });
  }

  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  res.json({ 
    sessionId,
    message: 'Debate session created. Connect to SSE endpoint to receive updates.',
    sseEndpoint: `/api/debate/${sessionId}/stream`
  });
});

// SSE endpoint for live debate streaming
app.get('/api/debate/:sessionId/stream', async (req, res) => {
  const { sessionId } = req.params;
  const symptoms = req.query.symptoms;
  const painLevel = req.query.painLevel || '5';
  const duration = req.query.duration || 'a few hours';

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  // Store connection for interjections
  activeConnections.set(sessionId, res);

  // Send initial connection confirmation
  res.write(`data: ${JSON.stringify({ type: 'connected', sessionId })}\n\n`);

  try {
    // Run the debate and stream results
    await runDebate(
      { symptoms, painLevel, duration },
      (event) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      }
    );
  } catch (error) {
    console.error('Debate error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
  } finally {
    res.write(`data: ${JSON.stringify({ type: 'complete' })}\n\n`);
    activeConnections.delete(sessionId);
    res.end();
  }
});

// Patient interjection endpoint
app.post('/api/debate/:sessionId/interject', async (req, res) => {
  const { sessionId } = req.params;
  const { message } = req.body;

  const connection = activeConnections.get(sessionId);
  
  if (!connection) {
    return res.status(404).json({ error: 'Session not found or already ended' });
  }

  // Add interjection to the debate
  addInterjection(sessionId, message);
  
  // Send acknowledgment through SSE
  connection.write(`data: ${JSON.stringify({ 
    type: 'interjection', 
    message,
    timestamp: new Date().toISOString()
  })}\n\n`);

  res.json({ success: true, message: 'Interjection received' });
});

// Red flag check endpoint
app.post('/api/check-emergency', (req, res) => {
  const { symptoms } = req.body;
  const lowerSymptoms = symptoms.toLowerCase();
  
  const redFlags = [
    { pattern: /chest pain.*(breath|breathing)/i, condition: 'Possible cardiac event' },
    { pattern: /(can't|cannot|unable).*(breath|breathe)/i, condition: 'Respiratory emergency' },
    { pattern: /severe.*headache.*sudden/i, condition: 'Possible stroke or aneurysm' },
    { pattern: /blood.*(vomit|cough)/i, condition: 'Internal bleeding' },
    { pattern: /unconscious|passed out|faint/i, condition: 'Loss of consciousness' },
    { pattern: /suicid|kill.*myself|end.*life/i, condition: 'Mental health emergency' },
    { pattern: /seizure|convuls/i, condition: 'Seizure activity' },
    { pattern: /paralyz|can't move|numb.*face/i, condition: 'Possible stroke' },
  ];

  for (const flag of redFlags) {
    if (flag.pattern.test(symptoms)) {
      return res.json({ 
        isEmergency: true, 
        condition: flag.condition,
        message: 'STOP: Please call emergency services (911) immediately or go to the nearest emergency room.'
      });
    }
  }

  res.json({ isEmergency: false });
});

app.listen(PORT, () => {
  console.log(`🏥 HealthHuddle server running on http://localhost:${PORT}`);
});
