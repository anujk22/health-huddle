import { useState } from 'react';
import { SpaceBackground, AuroraOverlay } from '../components/space-background';
import { Header } from '../components/header-new';
import { IntakeForm } from '../components/intake-form';
import { useNavigate } from 'react-router';
import { checkEmergency } from '../services/api';
import { Loader2 } from 'lucide-react';

export function IntakePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIntakeSubmit = async (data: any) => {
    // Build a complete symptom description
    const parts = [];
    if (data.mainConcern) parts.push(data.mainConcern);
    if (data.location) parts.push(`Location: ${data.location}`);
    if (data.duration) parts.push(`Duration: ${data.duration}`);
    if (data.severity) parts.push(`Severity: ${data.severity}`);
    if (data.triggers) parts.push(`Triggers: ${data.triggers}`);
    if (data.otherDetails) parts.push(data.otherDetails);

    const symptoms = parts.join(' | ');
    const patientData = { ...data, symptoms };

    setIsSubmitting(true);

    try {
      // Check for emergency symptoms first
      const emergencyCheck = await checkEmergency(symptoms);

      if (emergencyCheck.isEmergency) {
        // Redirect to safety page with emergency information
        navigate('/safety', {
          state: {
            isEmergency: true,
            condition: emergencyCheck.condition,
            message: emergencyCheck.message,
          }
        });
        return;
      }

      // No emergency, proceed to debate
      navigate('/debate', { state: { patientData } });
    } catch (error) {
      console.error('Error checking emergency:', error);
      // If emergency check fails, still proceed to debate
      // (backend will handle it there too)
      navigate('/debate', { state: { patientData } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <SpaceBackground />
      <AuroraOverlay />
      <Header />

      <div className="relative z-10">
        {isSubmitting ? (
          <div className="min-h-screen flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
            <p className="text-cyan-400">Checking your symptoms...</p>
          </div>
        ) : (
          <IntakeForm onSubmit={handleIntakeSubmit} />
        )}
      </div>
    </div>
  );
}
