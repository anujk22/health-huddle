import { useState, useCallback } from 'react';
import PatientInput from './components/PatientInput';
import DebatePanel from './components/DebatePanel';
import ConsensusDashboard from './components/ConsensusDashboard';
import EmergencyAlert from './components/EmergencyAlert';

function App() {
  const [phase, setPhase] = useState('input'); // 'input', 'debate', 'consensus'
  const [patientData, setPatientData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [consensus, setConsensus] = useState(null);
  const [emergency, setEmergency] = useState(null);
  const [speakingAgent, setSpeakingAgent] = useState(null);
  const [status, setStatus] = useState('');
  const [agentQuestion, setAgentQuestion] = useState(null);
  const [eventSourceRef, setEventSourceRef] = useState(null);

  const handleSubmit = useCallback(async (data) => {
    setPatientData(data);
    setMessages([]);
    setConsensus(null);
    setPhase('debate');
    setStatus('Analyzing your symptoms...');

    // Start SSE connection
    const params = new URLSearchParams({
      symptoms: data.symptoms
    });

    const eventSource = new EventSource(`/api/debate/stream?${params}`);
    setEventSourceRef(eventSource);

    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);

      switch (eventData.type) {
        case 'connected':
          setStatus('Connected to consultation team...');
          break;

        case 'status':
          setStatus(eventData.message);
          break;

        case 'emergency':
          setEmergency(eventData);
          eventSource.close();
          break;

        case 'agent_speaking':
          setSpeakingAgent(eventData.agent);
          setStatus(`${eventData.agent} is thinking...`);
          break;

        case 'agent_message':
          setSpeakingAgent(null);
          setMessages(prev => [...prev, {
            id: Date.now(),
            agent: eventData.agent,
            text: eventData.text,
            sources: eventData.sources || [],
            timestamp: eventData.timestamp
          }]);
          break;

        case 'agent_question':
          // Agent is asking the user a question
          setAgentQuestion({
            agent: eventData.agent,
            text: eventData.question,
            timeoutSeconds: eventData.timeoutSeconds || 15
          });
          setStatus(`${eventData.agent} is waiting for your response...`);
          break;

        case 'interjection':
        case 'patient_response':
          // Check if this message is already in the list (prevent duplicates)
          setMessages(prev => {
            const isDuplicate = prev.some(m => m.isPatient && m.text === eventData.message);
            if (isDuplicate) return prev;
            return [...prev, {
              id: Date.now(),
              agent: 'Patient',
              text: eventData.message,
              isPatient: true,
              timestamp: eventData.timestamp
            }];
          });
          break;

        case 'consensus':
          setConsensus({
            text: eventData.text,
            urgency: eventData.urgency,
            sources: eventData.sources,
            agentMessages: eventData.agentMessages
          });
          setPhase('consensus');
          setStatus('Consultation complete');
          eventSource.close();
          break;

        case 'complete':
          eventSource.close();
          break;

        case 'error':
          setStatus(`Error: ${eventData.message}`);
          eventSource.close();
          break;
      }
    };

    eventSource.onerror = () => {
      setStatus('Connection lost. Please try again.');
      eventSource.close();
    };
  }, []);

  const handleInterjection = useCallback(async (message) => {
    // Add patient message immediately
    setMessages(prev => [...prev, {
      id: Date.now(),
      agent: 'Patient',
      text: message,
      isPatient: true,
      timestamp: new Date().toISOString()
    }]);

    // Send to backend
    try {
      await fetch('/api/debate/current/interject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
    } catch (error) {
      console.error('Interjection failed:', error);
    }
  }, []);

  const handleQuestionAnswer = useCallback(async (response) => {
    setAgentQuestion(null);

    if (!response.skipped && response.answer) {
      // Don't add message here - backend will send it via patient_response event
      // Send to backend as an interjection
      try {
        await fetch('/api/debate/current/interject', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: response.answer })
        });
      } catch (error) {
        console.error('Answer submission failed:', error);
      }
    } else {
      // Notify backend that question was skipped
      try {
        await fetch('/api/debate/current/skip-question', {
          method: 'POST'
        });
      } catch (error) {
        console.error('Skip notification failed:', error);
      }
    }
  }, []);

  const handleNewConsultation = useCallback(() => {
    setPhase('input');
    setPatientData(null);
    setMessages([]);
    setConsensus(null);
    setEmergency(null);
    setSpeakingAgent(null);
    setStatus('');
    setAgentQuestion(null);
  }, []);

  if (emergency) {
    return <EmergencyAlert emergency={emergency} onDismiss={() => setEmergency(null)} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-logo">
          <div className="logo-icon">🏥</div>
          <div>
            <div className="logo-text">HealthHuddle</div>
            <div className="logo-tagline">AI-Powered Medical Consultation</div>
          </div>
        </div>
        {phase !== 'input' && (
          <button className="action-button secondary" onClick={handleNewConsultation}>
            New Consultation
          </button>
        )}
      </header>

      <main className="app-main">
        {phase === 'input' && (
          <PatientInput onSubmit={handleSubmit} />
        )}

        {phase === 'debate' && (
          <DebatePanel
            messages={messages}
            speakingAgent={speakingAgent}
            status={status}
            onInterjection={handleInterjection}
            patientData={patientData}
            agentQuestion={agentQuestion}
            onQuestionAnswer={handleQuestionAnswer}
          />
        )}

        {phase === 'consensus' && consensus && (
          <ConsensusDashboard
            consensus={consensus}
            patientData={patientData}
            messages={messages}
            onNewConsultation={handleNewConsultation}
          />
        )}
      </main>
    </div>
  );
}

export default App;
