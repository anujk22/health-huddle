import { AlertCircle } from 'lucide-react';

export function SafetyDisclaimer() {
  return (
    <section className="border-t border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg text-white">Important Safety Information</h3>
              <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                <p>
                  HealthHuddle is an AI-powered informational tool designed to help you understand your symptoms. It is <strong className="text-slate-300">not a substitute for professional medical advice, diagnosis, or treatment</strong>.
                </p>
                <p>
                  <strong className="text-slate-300">In case of emergency:</strong> If you are experiencing a medical emergency, call 911 (US) or your local emergency number immediately. Do not rely on HealthHuddle for emergency medical situations.
                </p>
                <p>
                  Always consult with a qualified healthcare provider before making any medical decisions. The AI agents provide analysis based on available medical literature and guidelines, but cannot account for your complete medical history or perform physical examinations.
                </p>
                <p className="text-xs text-slate-500">
                  HealthHuddle uses advanced AI models trained on medical literature. Recommendations are generated for educational purposes and should be discussed with your healthcare provider.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800/50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div>© 2026 HealthHuddle. All rights reserved.</div>
            <div className="flex gap-6">
              <button className="hover:text-slate-400 transition-colors">Privacy Policy</button>
              <button className="hover:text-slate-400 transition-colors">Terms of Service</button>
              <button className="hover:text-slate-400 transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
