import { Eye, BookMarked, AlertTriangle } from 'lucide-react';

export function TrustSignals() {
  return (
    <section className="container mx-auto px-6 py-20 border-t border-slate-800/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl text-white mb-4">Why People Trust HealthHuddle</h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Transparent, evidence-based analysis you can trust
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
        <TrustCard
          icon={<Eye className="w-8 h-8" />}
          title="Full transparency"
          description="Every word visible"
          detail="Watch the complete debate unfold. Nothing is hidden from you."
        />
        <TrustCard
          icon={<BookMarked className="w-8 h-8" />}
          title="Real sources"
          description="For every claim"
          detail="All recommendations backed by peer-reviewed research and clinical guidelines."
        />
        <TrustCard
          icon={<AlertTriangle className="w-8 h-8" />}
          title="Urgency guidance"
          description="Monitor vs. doctor vs. ER"
          detail="Clear action steps based on symptom severity and timing."
        />
      </div>

      {/* Citation Example */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookMarked className="w-6 h-6 text-teal-400" />
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-white text-lg">Evidence-based citations in every response</h3>
              <div className="space-y-2">
                <CitationTag
                  source="PMID: 33568819"
                  title="Diagnostic Accuracy of Clinical Examination for Appendicitis"
                  journal="JAMA Surgery 2021"
                />
                <CitationTag
                  source="PMID: 31486780"
                  title="Management of Acute Appendicitis in Adults"
                  journal="BMJ 2019"
                />
              </div>
              <p className="text-sm text-slate-400">
                Click any citation to view the full research paper or guideline
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustCard({ 
  icon, 
  title, 
  description, 
  detail 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  detail: string;
}) {
  return (
    <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-slate-700/50 transition-all duration-300">
      <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center justify-center mb-6 text-teal-400">
        {icon}
      </div>
      <h3 className="text-xl text-white mb-2">{title}</h3>
      <p className="text-teal-400 mb-3">{description}</p>
      <p className="text-slate-400 text-sm leading-relaxed">{detail}</p>
    </div>
  );
}

function CitationTag({ source, title, journal }: { source: string; title: string; journal: string }) {
  return (
    <button className="w-full text-left bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-teal-500/30 rounded-lg p-3 transition-all duration-200 group">
      <div className="flex items-start gap-3">
        <div className="px-2 py-1 bg-teal-500/10 border border-teal-500/30 rounded text-xs text-teal-400 font-mono flex-shrink-0">
          {source}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-white group-hover:text-teal-400 transition-colors mb-1">{title}</div>
          <div className="text-xs text-slate-500">{journal}</div>
        </div>
      </div>
    </button>
  );
}
