'use client';
import { motion } from 'motion/react';
import { CheckCircle, Link2, Award, Lock } from 'lucide-react';

export function TrustSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background gradient - softened radial for seamless blending */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(100,80,0,0.15)_0%,transparent_70%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-yellow-300 via-white to-green-300 bg-clip-text text-transparent">
            Built on Trust
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Transparency and reliability at every step
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TrustCard
            icon={<Link2 className="w-8 h-8" />}
            title="Source-Backed"
            description="Every recommendation links to peer-reviewed medical sources"
            color="cyan"
            delay={0}
          />
          <TrustCard
            icon={<CheckCircle className="w-8 h-8" />}
            title="Fully Transparent"
            description="Watch the entire AI debate process in real-time"
            color="magenta"
            delay={0.1}
          />
          <TrustCard
            icon={<Award className="w-8 h-8" />}
            title="Clinically Grounded"
            description="Based on established medical guidelines and research"
            color="green"
            delay={0.2}
          />
          <TrustCard
            icon={<Lock className="w-8 h-8" />}
            title="Privacy First"
            description="Your health data stays private and secure"
            color="yellow"
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}

function TrustCard({
  icon,
  title,
  description,
  color,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'cyan' | 'magenta' | 'green' | 'yellow';
  delay: number;
}) {
  const colors = {
    cyan: {
      border: 'border-cyan-400/40',
      text: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      glow: 'from-cyan-400/20 to-transparent',
    },
    magenta: {
      border: 'border-magenta-400/40',
      text: 'text-magenta-400',
      bg: 'bg-magenta-400/10',
      glow: 'from-magenta-400/20 to-transparent',
    },
    green: {
      border: 'border-green-400/40',
      text: 'text-green-400',
      bg: 'bg-green-400/10',
      glow: 'from-green-400/20 to-transparent',
    },
    yellow: {
      border: 'border-yellow-400/40',
      text: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      glow: 'from-yellow-400/20 to-transparent',
    },
  };

  return (
    <motion.div
      className={`relative border ${colors[color].border} ${colors[color].bg} backdrop-blur-sm rounded-xl p-6 group cursor-pointer`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      {/* Solid dark background for better contrast */}
      <div className="absolute inset-0 bg-zinc-950/80 rounded-xl -z-10" />

      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[color].glow} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10 rounded-xl`} />

      <div className={`${colors[color].text} mb-4`}>{icon}</div>
      <h3 className="text-lg text-white mb-2">{title}</h3>
      <p className="text-sm text-white/60 leading-relaxed">{description}</p>
    </motion.div>
  );
}