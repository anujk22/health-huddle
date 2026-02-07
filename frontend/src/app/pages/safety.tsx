import { motion } from "motion/react";
import {
  SpaceBackground,
  AuroraOverlay,
} from "../components/space-background";
import { Header } from "../components/header-new";
import {
  AlertTriangle,
  Phone,
  FileText,
  Users,
  Shield,
  Heart,
} from "lucide-react";
import { useLocation } from "react-router";

export function SafetyPage() {
  const location = useLocation();
  const emergencyState = location.state as { isEmergency?: boolean; condition?: string; message?: string } | null;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <SpaceBackground />
      <AuroraOverlay />
      <Header />

      <div className="relative z-10 min-h-screen py-12 px-6 pt-28">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Emergency Alert - shown when redirected from intake */}
          {emergencyState?.isEmergency && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gradient-to-r from-red-950 to-red-900 border-2 border-red-500 rounded-2xl p-8 shadow-2xl shadow-red-500/30"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 rounded-2xl"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <div className="relative z-10 flex items-start gap-6">
                <div className="flex-shrink-0">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <Phone className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-white">
                    🚨 CALL 911 IMMEDIATELY
                  </h2>
                  <p className="text-xl text-red-200">
                    <strong>Detected: {emergencyState.condition}</strong>
                  </p>
                  <p className="text-lg text-white/90">
                    {emergencyState.message}
                  </p>
                  <p className="text-white/70">
                    Your symptoms indicate a potential emergency. Please call emergency services (911) immediately or go to the nearest emergency room.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl mb-6 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent leading-tight pb-2">
              Safety & Guidelines
            </h1>
          </motion.div>

          {/* Main safety warning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-red-500/10 border-2 border-yellow-500/30 rounded-2xl p-8">
              <div className="flex gap-6 relative">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/40 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                    <AlertTriangle className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-3xl text-white">
                    Important Safety Information
                  </h1>
                  <div className="space-y-3 text-base text-white/70 leading-relaxed">
                    <p>
                      HealthHuddle is an AI-powered
                      informational tool.{" "}
                      <strong className="text-white/90">
                        It is not a substitute for professional
                        medical advice, diagnosis, or treatment.
                      </strong>
                    </p>
                    <p>
                      <strong className="text-white/90">
                        Emergency situations:
                      </strong>{" "}
                      If experiencing a medical emergency, call
                      911 or your local emergency number
                      immediately.
                    </p>
                    <p>
                      Always consult qualified healthcare
                      providers before making medical decisions.
                      AI recommendations are for educational
                      purposes and should be discussed with your
                      doctor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* When to seek immediate care */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-red-950/30 border border-red-500/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-red-400" />
              <h2 className="text-xl text-white">
                When to Call 911
              </h2>
            </div>
            <p className="text-white/70 mb-4">
              Call emergency services immediately if you
              experience:
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Chest pain or pressure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>
                  Difficulty breathing or shortness of breath
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Severe bleeding that won't stop</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>
                  Sudden severe headache or vision changes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>
                  Loss of consciousness or severe confusion
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>
                  Signs of stroke (facial drooping, arm
                  weakness, speech difficulty)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Severe allergic reaction</span>
              </li>
            </ul>
          </motion.div>

          {/* How to use HealthHuddle safely */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl text-white">
                How to Use HealthHuddle Safely
              </h2>
            </div>
            <div className="space-y-4 text-white/70">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white mb-1">
                    For Educational Purposes Only
                  </h3>
                  <p className="text-sm">
                    Use HealthHuddle to better understand
                    symptoms and prepare questions for your
                    healthcare provider. It should not replace
                    professional medical consultation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white mb-1">
                    Consult Healthcare Professionals
                  </h3>
                  <p className="text-sm">
                    Always discuss AI-generated recommendations
                    with qualified healthcare providers who can
                    evaluate your complete medical history and
                    perform proper examinations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white mb-1">
                    Trust Your Instincts
                  </h3>
                  <p className="text-sm">
                    If something feels seriously wrong or
                    symptoms worsen, seek immediate medical
                    attention regardless of what the AI
                    suggests.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Limitations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-zinc-950/80 border border-gray-700/50 rounded-xl p-6"
          >
            <h2 className="text-xl text-white mb-4">
              Limitations of AI Medical Analysis
            </h2>
            <div className="space-y-3 text-white/70 text-sm">
              <p>
                <strong className="text-white/90">
                  No Physical Examination:
                </strong>{" "}
                AI cannot perform physical exams, lab tests, or
                imaging studies that are often essential for
                accurate diagnosis.
              </p>
              <p>
                <strong className="text-white/90">
                  Limited Context:
                </strong>{" "}
                AI may not have access to your complete medical
                history, current medications, allergies, or
                family history.
              </p>
              <p>
                <strong className="text-white/90">
                  Evolving Technology:
                </strong>{" "}
                AI systems are continuously improving but may
                not reflect the latest medical research or
                guidelines.
              </p>
              <p>
                <strong className="text-white/90">
                  Individual Variation:
                </strong>{" "}
                Every person is unique. What works for most
                people may not be appropriate for your specific
                situation.
              </p>
            </div>
          </motion.div>

          {/* Privacy notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-6"
          >
            <h2 className="text-xl text-white mb-3">
              Your Privacy Matters
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              HealthHuddle is designed with privacy in mind.
              Your symptom data is processed securely and is not
              shared with third parties. However, for
              comprehensive care, you should share all relevant
              information directly with your healthcare
              provider.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}