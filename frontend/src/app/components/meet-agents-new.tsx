'use client';
import { motion } from 'motion/react';
import { BookOpen, Database, FileSearch, Shield } from 'lucide-react';

export function MeetAgents() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Animated background gradient - softened to blend with adjacent sections */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,255,0.06)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,0,255,0.05),transparent_50%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
            The AI Squad
          </h2>
          <p className="text-xl text-cyan-100/70 max-w-2xl mx-auto">
            Four specialized agents working together to analyze your symptoms
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AgentCard
            name="Guidelines"
            role="Protocol Expert"
            description="Reviews clinical practice guidelines and diagnostic criteria"
            icon={<BookOpen className="w-10 h-10" />}
            color="cyan"
            delay={0}
          />
          <AgentCard
            name="Evidence"
            role="Research Analyst"
            description="Analyzes peer-reviewed research and medical literature"
            icon={<Database className="w-10 h-10" />}
            color="purple"
            delay={0.1}
          />
          <AgentCard
            name="Cases"
            role="Pattern Matcher"
            description="Compares against documented case histories and outcomes"
            icon={<FileSearch className="w-10 h-10" />}
            color="green"
            delay={0.2}
          />
          <AgentCard
            name="Safety"
            role="Risk Assessor"
            description="Evaluates urgency levels and risk assessment protocols"
            icon={<Shield className="w-10 h-10" />}
            color="red"
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}

function AgentCard({
  name,
  role,
  description,
  icon,
  color,
  delay,
}: {
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
  color: 'cyan' | 'magenta' | 'green' | 'red' | 'purple';
  delay: number;
}) {
  const colors = {
    cyan: {
      border: 'border-cyan-400/50',
      text: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      gradient: 'from-cyan-500/20 to-transparent',
    },
    magenta: {
      border: 'border-magenta-400/50',
      text: 'text-magenta-400',
      bg: 'bg-magenta-400/10',
      gradient: 'from-magenta-500/20 to-transparent',
    },
    green: {
      border: 'border-green-400/50',
      text: 'text-green-400',
      bg: 'bg-green-400/10',
      gradient: 'from-green-500/20 to-transparent',
    },
    red: {
      border: 'border-red-400/50',
      text: 'text-red-400',
      bg: 'bg-red-400/10',
      gradient: 'from-red-500/20 to-transparent',
    },
    purple: {
      border: 'border-purple-400/50',
      text: 'text-purple-400',
      bg: 'bg-purple-400/10',
      gradient: 'from-purple-500/20 to-transparent',
    },
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.div
        className={`relative bg-gradient-to-b ${colors[color].gradient} border ${colors[color].border} backdrop-blur-sm rounded-2xl p-6 group cursor-pointer`}
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glowing background effect - only visible on hover */}
        <div className={`absolute inset-0 bg-gradient-to-b ${colors[color].gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10 rounded-2xl`} />

        {/* Solid dark background for better contrast */}
        <div className="absolute inset-0 bg-zinc-950/60 rounded-2xl -z-10" />

        {/* Icon with glow */}
        <div className="relative mb-6">
          <div className={`w-20 h-20 rounded-xl border-2 ${colors[color].border} ${colors[color].bg} flex items-center justify-center ${colors[color].text} relative`}>
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <h3 className="text-2xl text-white mb-1">{name}</h3>
          <div className={`text-sm ${colors[color].text} mb-4 uppercase tracking-wider`}>
            {role}
          </div>
          <p className="text-white/70 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Decorative corner */}
        <div className={`absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 ${colors[color].border} rounded-tr-2xl opacity-30`} />
      </motion.div>
    </motion.div>
  );
}