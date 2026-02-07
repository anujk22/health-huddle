'use client';
import { motion } from 'motion/react';
import { Play, Sparkles } from 'lucide-react';
import { AgentOrb } from './agent-orb';

export function DemoPreview() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Add colorful background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/15 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,136,0.06),transparent_60%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
            See It In Action
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Watch how our AI agents collaborate to analyze a real medical case
          </p>
        </motion.div>

        <motion.div
          className="max-w-5xl mx-auto relative group cursor-pointer"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Holographic frame */}
          <div className="relative bg-black/40 border border-white/20 rounded-3xl overflow-hidden backdrop-blur-sm">
            {/* Solid dark background */}
            <div className="absolute inset-0 bg-zinc-950/90 rounded-3xl -z-10" />
            
            {/* Top status bar with thinking indicator */}
            <div className="bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10 px-6 py-4 flex items-center justify-center">
              <motion.div
                className="inline-flex items-center gap-2 text-cyan-400 text-sm"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Guidelines is thinking...
              </motion.div>
            </div>

            {/* Agent orbs */}
            <div className="px-6 py-8 flex justify-center gap-6">
              <AgentOrb type="guidelines" isSpeaking={true} isThinking={false} />
              <AgentOrb type="evidence" isSpeaking={false} isThinking={false} />
              <AgentOrb type="cases" isSpeaking={false} isThinking={false} />
              <AgentOrb type="safety" isSpeaking={false} isThinking={false} />
            </div>

            {/* Content */}
            <div className="p-8 space-y-4">
              {/* Patient input */}
              <motion.div
                className="bg-teal-950/40 backdrop-blur-sm border border-teal-500/30 rounded-xl p-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xs font-medium text-teal-400 mb-2 tracking-wider">YOUR SYMPTOMS</div>
                <div className="text-gray-200">
                  Sharp pain in lower right abdomen for 18 hours, nausea, fever 100.8°F
                </div>
              </motion.div>

              {/* Agent responses */}
              <div className="space-y-4">
                <AgentMessage
                  agent="cases"
                  color="green"
                  message="Cases: In similar cases I've seen with sharp right-sided pain, the real question is how quickly we can pinpoint the cause. Typically, patients presenting like this need prompt imaging to rule out urgent issues; about 15-20% end up needing some form of intervention within a few days."
                  delay={0.3}
                />
                <AgentMessage
                  agent="safety"
                  color="red"
                  message="Safety: Evidence, while ultrasound is valuable, we must consider the risk of appendiceal rupture, which significantly increases after 24-36 hours. Given the sharp pain and right-sided location, a high degree of suspicion for appendicitis necessitates immediate assessment, possibly in an urgent care or ER setting."
                  delay={0.4}
                />
              </div>
            </div>

            {/* Scan lines effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse" />
            </div>
          </div>

          {/* Outer glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-green-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 rounded-3xl" />
        </motion.div>
      </div>
    </section>
  );
}

function AgentMessage({
  agent,
  color,
  message,
  delay,
}: {
  agent: string;
  color: 'cyan' | 'purple' | 'green' | 'red';
  message: string;
  delay: number;
}) {
  const colors = {
    cyan: 'border-cyan-500/30 bg-zinc-950/80 text-cyan-400',
    purple: 'border-purple-500/30 bg-zinc-950/80 text-purple-400',
    green: 'border-green-500/30 bg-zinc-950/80 text-green-400',
    red: 'border-red-500/30 bg-zinc-950/80 text-red-400',
  };

  return (
    <motion.div
      className={`border ${colors[color]} backdrop-blur-sm rounded-xl p-4`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className={`text-xs font-medium mb-3 tracking-wider uppercase ${colors[color].split(' ')[2]}`}>
        {agent}
      </div>
      <div className="text-gray-300 text-sm leading-relaxed">{message}</div>
    </motion.div>
  );
}