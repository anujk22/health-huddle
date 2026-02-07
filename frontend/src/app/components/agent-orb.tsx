import { motion } from 'motion/react';
import { BookOpen, Database, FileSearch, Shield } from 'lucide-react';

interface AgentOrbProps {
  type: 'guidelines' | 'evidence' | 'cases' | 'safety';
  isThinking?: boolean;
  isSpeaking?: boolean;
}

const agentConfig = {
  guidelines: {
    color: 'cyan',
    icon: BookOpen,
    bgClass: 'bg-cyan-500/20',
    borderClass: 'border-cyan-500',
    glowClass: 'shadow-cyan-500/50',
    textClass: 'text-cyan-400',
    label: 'GUIDELINES',
  },
  evidence: {
    color: 'purple',
    icon: Database,
    bgClass: 'bg-purple-500/20',
    borderClass: 'border-purple-500',
    glowClass: 'shadow-purple-500/50',
    textClass: 'text-purple-400',
    label: 'EVIDENCE',
  },
  cases: {
    color: 'green',
    icon: FileSearch,
    bgClass: 'bg-green-500/20',
    borderClass: 'border-green-500',
    glowClass: 'shadow-green-500/50',
    textClass: 'text-green-400',
    label: 'CASES',
  },
  safety: {
    color: 'red',
    icon: Shield,
    bgClass: 'bg-red-500/20',
    borderClass: 'border-red-500',
    glowClass: 'shadow-red-500/50',
    textClass: 'text-red-400',
    label: 'SAFETY',
  },
};

export function AgentOrb({ type, isThinking = false, isSpeaking = false }: AgentOrbProps) {
  const config = agentConfig[type];
  const Icon = config.icon;
  const isActive = isSpeaking || isThinking;

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="relative"
        animate={isSpeaking ? {
          scale: [1, 1.08, 1],
        } : {}}
        transition={{
          duration: 2,
          repeat: isSpeaking ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* Outer pulsing ring - only when active */}
        {isActive && (
          <>
            <motion.div
              className={`absolute rounded-full border-2 ${config.borderClass}`}
              style={{
                width: '100px',
                height: '100px',
                left: '50%',
                top: '50%',
                marginLeft: '-50px',
                marginTop: '-50px',
              }}
              animate={{
                scale: [1, 1.4],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className={`absolute rounded-full border ${config.borderClass}`}
              style={{
                width: '100px',
                height: '100px',
                left: '50%',
                top: '50%',
                marginLeft: '-50px',
                marginTop: '-50px',
              }}
              animate={{
                scale: [1, 1.25],
                opacity: [0.4, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.4,
              }}
            />
          </>
        )}

        {/* Main orb - LARGER (24 = 96px) */}
        <motion.div
          className={`w-24 h-24 rounded-full ${config.bgClass} border-2 ${config.borderClass} 
            flex items-center justify-center relative overflow-hidden
            ${isActive ? `shadow-xl ${config.glowClass}` : 'opacity-60'}`}
          animate={isThinking ? {
            borderColor: ['currentColor', 'rgba(255,255,255,0.8)', 'currentColor'],
          } : {}}
          transition={{
            duration: 1,
            repeat: isThinking ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* Subtle inner glow when active */}
          {isActive && (
            <div className={`absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/5 to-white/10`} />
          )}

          {/* Icon - LARGER */}
          <Icon className={`w-10 h-10 ${config.textClass} relative z-10`} />
        </motion.div>
      </motion.div>

      {/* Label */}
      <div className={`text-xs font-medium tracking-wider ${isActive ? config.textClass : 'text-gray-500'}`}>
        {config.label}
      </div>
    </div>
  );
}