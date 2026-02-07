import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl text-white">HealthHuddle</div>
              <div className="text-xs text-slate-400">AI Medical Analysis</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button className="text-slate-300 hover:text-white transition-colors">How it works</button>
            <button className="text-slate-300 hover:text-white transition-colors">About</button>
            <button className="text-slate-300 hover:text-white transition-colors">Safety</button>
          </nav>

          {/* CTA */}
          <button className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-lg transition-all duration-300 shadow-lg shadow-teal-500/20">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
