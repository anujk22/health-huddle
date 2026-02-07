import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, CheckCircle2, BookOpen } from 'lucide-react';
import GradientText from './gradient-text';

interface IntakeFormProps {
  onSubmit: (data: {
    mainConcern: string;
    location: string;
    duration: string;
    severity: string;
    triggers: string;
    otherDetails: string;
  }) => void;
}

export function IntakeForm({ onSubmit }: IntakeFormProps) {
  const [formData, setFormData] = useState({
    mainConcern: '',
    location: '',
    duration: '',
    severity: '',
    triggers: '',
    otherDetails: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.mainConcern.trim()) {
      setIsSubmitting(true);
      // Small delay for animation
      setTimeout(() => {
        onSubmit(formData);
      }, 600);
    }
  };

  const inputClasses = (fieldName: string) => `
    w-full bg-black/60 backdrop-blur-sm border rounded-xl px-4 py-3.5 text-white
    transition-all duration-300
    placeholder:text-gray-600
    focus:outline-none focus:ring-2 
    ${focusedField === fieldName
      ? 'border-cyan-400 ring-cyan-500/30 shadow-lg shadow-cyan-500/20'
      : 'border-white/10 hover:border-white/20'
    }
  `;

  const textareaClasses = (fieldName: string) => `
    w-full bg-black/60 backdrop-blur-sm border rounded-xl px-4 py-3.5 text-white
    transition-all duration-300 resize-none
    placeholder:text-gray-600
    focus:outline-none focus:ring-2 
    ${focusedField === fieldName
      ? 'border-cyan-400 ring-cyan-500/30 shadow-lg shadow-cyan-500/20'
      : 'border-white/10 hover:border-white/20'
    }
  `;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-28 pb-12">
      <motion.div
        className="w-full max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-4xl md:text-5xl lg:text-6xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GradientText
              colors={["#00D4FF", "#00E5A0", "#00D4FF"]}
              animationSpeed={6}
              showBorder={false}
              className="text-4xl md:text-5xl lg:text-6xl"
            >
              Welcome to HealthHuddle
            </GradientText>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Tell us about your symptoms. The more details you provide, the better our AI team can help.
          </motion.p>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
                initial={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%'
                }}
                animate={{
                  y: [null, Math.random() * -200 - 100],
                  opacity: [0.4, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="relative bg-gradient-to-br from-zinc-900/40 to-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0"
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent)',
              filter: 'blur(20px)',
            }}
          />

          <div className="relative space-y-6">
            {/* Main concern */}
            <div>
              <label className="block text-white/90 mb-2 font-medium">
                What's your main concern or symptom? <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                className={textareaClasses('mainConcern')}
                placeholder="e.g., Sharp abdominal pain, persistent headache, difficulty breathing..."
                value={formData.mainConcern}
                onChange={(e) => setFormData({ ...formData, mainConcern: e.target.value })}
                onFocus={() => setFocusedField('mainConcern')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-white/90 mb-2 font-medium">
                Where exactly is the problem? <span className="text-white/40 text-sm">(if applicable)</span>
              </label>
              <input
                type="text"
                className={inputClasses('location')}
                placeholder="e.g., Right lower abdomen, behind my left eye, both knees..."
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                onFocus={() => setFocusedField('location')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-white/90 mb-2 font-medium">
                How long have you had this?
              </label>
              <input
                type="text"
                className={inputClasses('duration')}
                placeholder="e.g., Started 2 hours ago, about 3 days, on and off for a week..."
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                onFocus={() => setFocusedField('duration')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Severity */}
            <div>
              <label className="block text-white/90 mb-2 font-medium">
                How would you describe the severity?
              </label>
              <input
                type="text"
                className={inputClasses('severity')}
                placeholder="e.g., Mild but annoying, worst pain I've ever had, comes in waves..."
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                onFocus={() => setFocusedField('severity')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Triggers */}
            <div>
              <label className="block text-white/90 mb-2 font-medium">
                What makes it better or worse?
              </label>
              <input
                type="text"
                className={inputClasses('triggers')}
                placeholder="e.g., Worse when I move, better after eating, nothing helps..."
                value={formData.triggers}
                onChange={(e) => setFormData({ ...formData, triggers: e.target.value })}
                onFocus={() => setFocusedField('triggers')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Other details */}
            <div>
              <label className="block text-white/90 mb-2 font-medium">
                Any other relevant details?
              </label>
              <textarea
                rows={4}
                className={textareaClasses('otherDetails')}
                placeholder="e.g., I'm 35/female, have diabetes, took ibuprofen with no effect, also have nausea..."
                value={formData.otherDetails}
                onChange={(e) => setFormData({ ...formData, otherDetails: e.target.value })}
                onFocus={() => setFocusedField('otherDetails')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              className="w-full group relative px-8 py-5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black rounded-xl font-bold text-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: formData.mainConcern.trim() ? 1.02 : 1 }}
              whileTap={{ scale: formData.mainConcern.trim() ? 0.98 : 1 }}
              disabled={!formData.mainConcern.trim()}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatDelay: 1,
                }}
              />

              <span className="relative flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5" />
                Start AI Consultation
                <Sparkles className="w-5 h-5" />
              </span>
            </motion.button>

            {/* Info badges */}
            <div className="flex flex-wrap justify-center items-center gap-6 pt-4 text-sm text-cyan-100/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Results in seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>Backed by sources</span>
              </div>
            </div>
          </div>
        </motion.form>

        {/* Disclaimer */}
        <motion.p
          className="text-center text-xs text-white/30 mt-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          This is not medical advice. Always consult with a healthcare professional for proper diagnosis and treatment.
        </motion.p>
      </motion.div>
    </div>
  );
}