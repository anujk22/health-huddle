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
    label: 'GUIDELINES',
  },
  evidence: {
    color: 'purple',
    icon: Database,
    bgClass: 'bg-purple-500/20',
    borderClass: 'border-purple-500',
    glowClass: 'shadow-purple-500/50',
    label: 'EVIDENCE',
  },
  cases: {
    color: 'green',
    icon: FileSearch,
    bgClass: 'bg-green-500/20',
    borderClass: 'border-green-500',
    glowClass: 'shadow-green-500/50',
    label: 'CASES',
  },
  safety: {
    color: 'red',
    icon: Shield,
    bgClass: 'bg-red-500/20',
    borderClass: 'border-red-500',
    glowClass: 'shadow-red-500/50',
    label: 'SAFETY',
  },
};

export function AgentOrb({ type, isThinking = false, isSpeaking = false }: AgentOrbProps) {
  const config = agentConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="relative"
        animate={isSpeaking ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          duration: 1.5,
          repeat: isSpeaking ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* Outer pulsing ring - Jarvis effect */}
        {isSpeaking && (
          <>
            <motion.div
              className={`absolute inset-0 rounded-full border-2 ${config.borderClass}`}
              style={{ width: '80px', height: '80px', left: '-8px', top: '-8px' }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className={`absolute inset-0 rounded-full border ${config.borderClass}`}
              style={{ width: '72px', height: '72px', left: '-4px', top: '-4px' }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3,
              }}
            />
          </>
        )}

        {/* Main orb */}
        <motion.div
          className={`w-16 h-16 rounded-full ${config.bgClass} border-2 ${config.borderClass} 
            flex items-center justify-center relative overflow-hidden
            ${isSpeaking ? `shadow-lg ${config.glowClass}` : ''}`}
          animate={isThinking ? {
            opacity: [1, 0.6, 1],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: isThinking ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* Animated scanning lines - Jarvis style */}
          {isSpeaking && (
            <motion.div
              className={`absolute inset-0 bg-gradient-to-b from-transparent via-${config.color}-500/30 to-transparent`}
              style={{ height: '20%' }}
              animate={{
                top: ['-20%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
          
          <Icon className={`w-7 h-7 text-${config.color}-400 relative z-10`} />
        </motion.div>
      </motion.div>

      <div className="text-xs font-medium text-gray-400 tracking-wider">
        {config.label}
      </div>
    </div>
  );
}