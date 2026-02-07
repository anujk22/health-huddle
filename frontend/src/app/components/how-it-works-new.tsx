'use client';
import { motion } from 'motion/react';
import { MessageSquare, Sparkles, Target } from 'lucide-react';

export function HowItWorks() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Clean black background - no tint */}

      {/* Animated floating particles */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-cyan-400/40"
        animate={{
          y: [0, -30, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-magenta-400/30"
        animate={{
          y: [0, -40, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-cyan-300/50"
        animate={{
          y: [0, -20, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Section header */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Three simple steps to get AI-powered medical insights
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-500/30 to-transparent hidden lg:block" />

            <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
              <Step
                number="01"
                icon={<MessageSquare className="w-12 h-12" />}
                title="Describe Symptoms"
                description="Share what you're experiencing in your own words. Our AI understands natural language."
                color="white"
                delay={0}
              />
              <Step
                number="02"
                icon={<Sparkles className="w-12 h-12" />}
                title="AI Agents Debate"
                description="Watch four specialized AI agents analyze your case from different medical perspectives in real time."
                color="yellow"
                delay={0.2}
              />
              <Step
                number="03"
                icon={<Target className="w-12 h-12" />}
                title="Get Insights"
                description="Receive a transparent diagnosis with confidence scores, urgency levels, and cited medical sources."
                color="pink"
                delay={0.4}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  number,
  icon,
  title,
  description,
  color,
  delay,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'white' | 'yellow' | 'pink';
  delay: number;
}) {
  const colors = {
    white: 'from-white/10 to-transparent border-white/40 text-white shadow-[0_0_30px_rgba(255,255,255,0.3)]',
    yellow: 'from-yellow-400/20 to-transparent border-yellow-400/40 text-yellow-400',
    pink: 'from-pink-500/20 to-transparent border-pink-500/40 text-pink-400',
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.div
        className={`relative bg-gradient-to-b ${colors[color]} border backdrop-blur-sm rounded-2xl p-8 group cursor-pointer`}
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glowing background effect */}
        <div className={`absolute inset-0 bg-gradient-to-b ${colors[color]} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10 rounded-2xl`} />

        {/* Solid dark background for better contrast */}
        <div className="absolute inset-0 bg-zinc-950/60 rounded-2xl -z-10" />

        {/* Number badge */}
        <div className="absolute -top-6 -left-6 w-16 h-16 bg-zinc-950 border-2 border-white/20 rounded-full flex items-center justify-center shadow-xl">
          <span className="text-2xl text-white/50">{number}</span>
        </div>

        {/* Icon */}
        <div className={`mb-6 ${colors[color].split(' ')[2]}`}>{icon}</div>

        {/* Content */}
        <h3 className="text-2xl text-white mb-4">{title}</h3>
        <p className="text-white/70 leading-relaxed">{description}</p>

        {/* Decorative corner */}
        <div className={`absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 ${colors[color].split(' ')[1]} rounded-tr-2xl opacity-30`} />
      </motion.div>
    </motion.div>
  );
}