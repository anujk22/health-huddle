import { MessageSquare, Users, ClipboardCheck } from 'lucide-react';

export function HowItWorks() {
  return (
    <section className="container mx-auto px-6 py-20 border-t border-slate-800/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl text-white mb-4">How HealthHuddle Works</h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          A transparent, three-step process designed to help you understand your symptoms with AI-powered medical analysis
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
        <Step
          number="01"
          icon={<MessageSquare className="w-8 h-8" />}
          title="Share your symptoms"
          description="Describe what you're experiencing in plain language. No medical jargon required."
          color="teal"
        />
        <Step
          number="02"
          icon={<Users className="w-8 h-8" />}
          title="Watch the live debate"
          description="Four specialized AI agents analyze your case from different medical perspectives in real time."
          color="blue"
        />
        <Step
          number="03"
          icon={<ClipboardCheck className="w-8 h-8" />}
          title="Get a clear, cited plan"
          description="Receive a transparent recommendation with confidence levels, urgency guidance, and medical sources."
          color="purple"
        />
      </div>
    </section>
  );
}

function Step({ 
  number, 
  icon, 
  title, 
  description, 
  color 
}: { 
  number: string; 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: 'teal' | 'blue' | 'purple';
}) {
  const colorMap = {
    teal: 'text-teal-400 border-teal-500/30 bg-teal-500/5',
    blue: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
    purple: 'text-purple-400 border-purple-500/30 bg-purple-500/5'
  };

  return (
    <div className="relative">
      {/* Step number */}
      <div className="text-6xl font-bold text-slate-800/50 absolute -top-4 -left-2">
        {number}
      </div>
      
      <div className="relative bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-slate-700/50 transition-all duration-300">
        {/* Icon */}
        <div className={`w-16 h-16 ${colorMap[color]} rounded-xl flex items-center justify-center mb-6 border backdrop-blur-sm`}>
          {icon}
        </div>
        
        {/* Content */}
        <h3 className="text-xl text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
