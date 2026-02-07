import { ArrowRight, Play } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="container mx-auto px-6 py-20 md:py-28">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left side - Text content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight text-white">
              Four AI specialists debating your symptoms in real time
            </h1>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl">
              Watch a transparent, live conversation between medical AI agents that explain what might be happening and what to do next.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40">
              <span>Describe your symptoms</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-slate-700 hover:border-teal-500/50 text-slate-200 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              <span>See how it works</span>
            </button>
          </div>
        </div>

        {/* Right side - Mock UI */}
        <div className="relative">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
            {/* Four AI Agents Header */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <AgentAvatar color="teal" name="Guidelines" />
              <AgentAvatar color="blue" name="Evidence" />
              <AgentAvatar color="purple" name="Cases" />
              <AgentAvatar color="green" name="Safety" />
            </div>

            {/* Debate Chat */}
            <div className="space-y-3 mb-6">
              <ChatBubble agent="Evidence" color="blue" message="Patient reports lower right abdominal pain, fever 38.2°C, and nausea for 18 hours." />
              <ChatBubble agent="Guidelines" color="teal" message="Classic McBurney's point tenderness suggests appendicitis. Recommending immediate evaluation." />
              <ChatBubble agent="Cases" color="purple" message="Similar presentation in 847 cases, 94% confirmed surgical appendicitis." />
              <ChatBubble agent="Safety" color="green" message="Time-sensitive condition. ER visit recommended within 2 hours." />
            </div>

            {/* Consensus Panel */}
            <div className="bg-slate-900/60 border border-teal-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-teal-400">Consensus Reached</span>
                <span className="text-xs text-slate-400">4/4 agents agree</span>
              </div>
              <div className="space-y-2">
                <div className="text-white">
                  <span className="font-medium">PRIMARY DIAGNOSIS:</span> Acute appendicitis
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></div>
                    <span className="text-sm text-slate-300">62% confidence</span>
                  </div>
                  <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-xs">
                    URGENT
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/10 to-blue-500/10 blur-3xl -z-10 rounded-3xl"></div>
        </div>
      </div>
    </section>
  );
}

function AgentAvatar({ color, name }: { color: 'teal' | 'blue' | 'purple' | 'green'; name: string }) {
  const colorMap = {
    teal: 'bg-teal-500/20 border-teal-500/40 text-teal-400',
    blue: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
    purple: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
    green: 'bg-green-500/20 border-green-500/40 text-green-400'
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-12 h-12 rounded-full border-2 ${colorMap[color]} flex items-center justify-center backdrop-blur-sm`}>
        <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
      </div>
      <span className="text-xs text-slate-400">{name}</span>
    </div>
  );
}

function ChatBubble({ agent, color, message }: { agent: string; color: 'teal' | 'blue' | 'purple' | 'green'; message: string }) {
  const colorMap = {
    teal: 'border-teal-500/30 bg-teal-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5',
    green: 'border-green-500/30 bg-green-500/5'
  };

  return (
    <div className={`border ${colorMap[color]} rounded-lg p-3 backdrop-blur-sm`}>
      <div className="text-xs text-slate-400 mb-1">{agent}</div>
      <div className="text-sm text-slate-200">{message}</div>
    </div>
  );
}
