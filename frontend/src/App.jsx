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

  const handleSubmit = useCallback(async (data) => {
    setPatientData(data);
    setMessages([]);
    setConsensus(null);
    setPhase('debate');
    setStatus('Analyzing your symptoms...');

    // Start SSE connection
    const params = new URLSearchParams({
      symptoms: data.symptoms,
      painLevel: data.painLevel.toString(),
      duration: data.duration
    });

    const eventSource = new EventSource(`/api/debate/stream?${params}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'connected':
          setStatus('Connected to consultation team...');
          break;

        case 'status':
          setStatus(data.message);
          break;

        case 'emergency':
          setEmergency(data);
          eventSource.close();
          break;

        case 'agent_speaking':
          setSpeakingAgent(data.agent);
          setStatus(`${data.agent} is thinking...`);
          break;

        case 'agent_message':
          setSpeakingAgent(null);
          setMessages(prev => [...prev, {
            id: Date.now(),
            agent: data.agent,
            text: data.text,
            sources: data.sources || [],
            timestamp: data.timestamp
          }]);
          break;

        case 'interjection':
          setMessages(prev => [...prev, {
            id: Date.now(),
            agent: 'Patient',
            text: data.message,
            isPatient: true,
            timestamp: data.timestamp
          }]);
          break;

        case 'consensus':
          setConsensus({
            text: data.text,
            urgency: data.urgency,
            sources: data.sources,
            agentMessages: data.agentMessages
          });
          setPhase('consensus');
          setStatus('Consultation complete');
          eventSource.close();
          break;

        case 'complete':
          eventSource.close();
          break;

        case 'error':
          setStatus(`Error: ${data.message}`);
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

  const handleNewConsultation = useCallback(() => {
    setPhase('input');
    setPatientData(null);
    setMessages([]);
    setConsensus(null);
    setEmergency(null);
    setSpeakingAgent(null);
    setStatus('');
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
