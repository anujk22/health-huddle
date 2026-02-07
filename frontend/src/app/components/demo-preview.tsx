import { Play } from 'lucide-react';

export function DemoPreview() {
  return (
    <section className="container mx-auto px-6 py-20 border-t border-slate-800/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl text-white mb-4">See HealthHuddle in Action</h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Watch a sample consultation to understand how our AI agents work together
        </p>
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Demo Frame */}
        <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
          {/* Browser-like header */}
          <div className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-3 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 bg-slate-900/50 rounded-lg text-xs text-slate-400">
                healthhuddle.ai/session/demo
              </div>
            </div>
          </div>

          {/* Demo Content */}
          <div className="p-8 space-y-6">
            {/* Patient Input */}
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Patient Input</div>
              <p className="text-slate-300">
                "I've had sharp pain in my lower right abdomen for about 18 hours. Started gradually but now it's constant. Also feeling nauseous and have a low fever around 100.8°F."
              </p>
            </div>

            {/* Agent Discussion */}
            <div className="space-y-3">
              <DemoChatBubble 
                agent="Evidence" 
                color="blue"
                message="Analyzing symptom pattern: McBurney's point pain + fever + nausea = 89% correlation with acute appendicitis in literature."
              />
              <DemoChatBubble 
                agent="Guidelines" 
                color="teal"
                message="Per SAGES guidelines: positive rebound tenderness and migration of pain strongly suggest appendicitis. Recommend surgical consultation."
              />
              <DemoChatBubble 
                agent="Cases" 
                color="purple"
                message="1,247 similar cases reviewed. 76% resulted in appendectomy within 24 hours. Average time from symptom onset: 21 hours."
              />
              <DemoChatBubble 
                agent="Safety" 
                color="green"
                message="Perforation risk increases significantly after 24 hours. Current timeline: 18 hours. Recommendation: Emergency department evaluation within 2 hours."
              />
            </div>

            {/* Highlighted Diagnosis */}
            <div className="bg-gradient-to-r from-teal-500/20 to-blue-500/20 border-2 border-teal-500/40 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-teal-400 mb-1">PRIMARY DIAGNOSIS</div>
                  <div className="text-2xl text-white">Acute appendicitis</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl text-white mb-1">62%</div>
                  <div className="text-sm text-slate-400">Confidence</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400">
                  URGENT - Seek ER care
                </div>
                <div className="text-sm text-slate-400">Within 2 hours recommended</div>
              </div>
            </div>
          </div>

          {/* Play Demo Overlay */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <button className="group flex items-center gap-3 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-xl transition-all duration-300 shadow-xl shadow-teal-500/20 hover:shadow-teal-500/40">
              <Play className="w-6 h-6 fill-current" />
              <span className="text-lg">Play Interactive Demo</span>
            </button>
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/5 to-blue-500/5 blur-3xl -z-10 rounded-3xl"></div>
      </div>
    </section>
  );
}

function DemoChatBubble({ 
  agent, 
  color, 
  message 
}: { 
  agent: string; 
  color: 'teal' | 'blue' | 'purple' | 'green'; 
  message: string;
}) {
  const colorMap = {
    teal: 'border-teal-500/30 bg-teal-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5',
    green: 'border-green-500/30 bg-green-500/5'
  };

  return (
    <div className={`border ${colorMap[color]} rounded-lg p-4 backdrop-blur-sm`}>
      <div className="text-sm text-slate-400 mb-2">{agent}</div>
      <div className="text-slate-200">{message}</div>
    </div>
  );
}