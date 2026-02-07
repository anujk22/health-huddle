import { BookOpen, FlaskConical, FileText, ShieldCheck } from 'lucide-react';

export function MeetAgents() {
  return (
    <section className="container mx-auto px-6 py-20 border-t border-slate-800/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl text-white mb-4">Meet the Four Agents</h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Each agent specializes in a different aspect of medical analysis, ensuring comprehensive evaluation
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <AgentCard
          name="Guidelines"
          description="Reviews clinical practice guidelines and diagnostic criteria"
          icon={<BookOpen className="w-8 h-8" />}
          color="teal"
        />
        <AgentCard
          name="Evidence"
          description="Analyzes peer-reviewed research and medical literature"
          icon={<FlaskConical className="w-8 h-8" />}
          color="blue"
        />
        <AgentCard
          name="Cases"
          description="Compares against documented case histories and outcomes"
          icon={<FileText className="w-8 h-8" />}
          color="purple"
        />
        <AgentCard
          name="Safety"
          description="Evaluates urgency levels and risk assessment protocols"
          icon={<ShieldCheck className="w-8 h-8" />}
          color="green"
        />
      </div>
    </section>
  );
}

function AgentCard({ 
  name, 
  description, 
  icon, 
  color 
}: { 
  name: string; 
  description: string; 
  icon: React.ReactNode; 
  color: 'teal' | 'blue' | 'purple' | 'green';
}) {
  const colorMap = {
    teal: 'from-teal-500/10 to-teal-500/5 border-teal-500/30 text-teal-400',
    blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/30 text-blue-400',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/30 text-purple-400',
    green: 'from-green-500/10 to-green-500/5 border-green-500/30 text-green-400'
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-transform duration-300`}>
      {/* Icon */}
      <div className="mb-4">
        <div className={`w-14 h-14 ${colorMap[color]} rounded-xl flex items-center justify-center border backdrop-blur-sm`}>
          {icon}
        </div>
      </div>
      
      {/* Content */}
      <h3 className="text-xl text-white mb-2">{name}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
