import React from 'react';
import { ResearchReport } from '../../types/research';
import { Card } from '../ui/Card';
import { ArrowUpRight, AlertOctagon, Zap, ShieldAlert } from 'lucide-react';

interface OpportunitiesRisksProps {
  report: ResearchReport;
}

export function OpportunitiesRisks({ report }: OpportunitiesRisksProps) {
  const getUncertaintyColor = (level: 'High' | 'Medium' | 'Low') => {
    switch (level) {
      case 'High':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    }
  };

  return (
    <div className="space-y-10">
      {/* Opportunities & Risks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Opportunities Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/15 text-emerald-400 rounded-lg border border-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">Innovation Gaps & Opportunities</h3>
          </div>
          
          <div className="space-y-4">
            {report.opportunities.map((opp, idx) => (
              <Card key={idx} className="bg-slate-900/10 border border-white/5 p-6 space-y-3 hover:border-emerald-500/20 transition-all">
                <h4 className="text-base font-bold text-slate-200 flex items-center gap-1.5">
                  {opp.title}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {opp.description}
                </p>
                <div className="text-[11px] text-emerald-400 font-medium bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10">
                  <strong className="text-emerald-300">Unmet Market Gap:</strong> {opp.marketGap}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Risks Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-500/15 text-rose-400 rounded-lg border border-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">Systemic Risks & Limitations</h3>
          </div>
          
          <div className="space-y-4">
            {report.risks.map((risk, idx) => (
              <Card key={idx} className="bg-slate-900/10 border border-white/5 p-6 space-y-3 hover:border-rose-500/20 transition-all">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-200">
                    {risk.title}
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getUncertaintyColor(risk.uncertaintyLevel)}`}>
                    {risk.uncertaintyLevel} Uncertainty
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {risk.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contradiction Detection */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/15 text-amber-400 rounded-lg border border-amber-500/20">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-slate-200">Contradictory Evidence & Policy Disagreements</h3>
            <span className="text-xs text-slate-500">System automatically detects friction points and conflicting statements between different sources.</span>
          </div>
        </div>

        <div className="space-y-4">
          {report.contradictions && report.contradictions.length > 0 ? (
            report.contradictions.map((con, idx) => (
              <Card key={idx} className="border border-white/5 bg-slate-950/45 p-6 space-y-4 hover:border-amber-500/20 transition-all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Claim A */}
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Viewpoint Alpha</div>
                    <p className="text-xs text-slate-300 italic">"{con.claimA}"</p>
                  </div>

                  {/* Claim B */}
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">Viewpoint Beta</div>
                    <p className="text-xs text-slate-300 italic">"{con.claimB}"</p>
                  </div>
                </div>

                {/* Conflict Resolution detail */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase tracking-wider text-[9px]">
                      Conflict Identified
                    </span>
                    <span><strong>Reason:</strong> {con.reasonForConflict}</span>
                  </div>

                  {/* Source Links */}
                  <div className="flex gap-2">
                    {con.sourceUrls.map((url, i) => {
                      const matched = report.sources.find(s => s.url === url);
                      return (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-white/5 hover:bg-slate-900 border border-white/5 text-[10px] font-mono text-slate-400 hover:text-purple-400 rounded transition-colors"
                          title={matched?.title || url}
                        >
                          {matched?.contextDevRef || `Source ${i+1}`}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 bg-slate-900/10 border border-white/5 rounded-2xl">
              <span className="text-slate-500 text-sm">No contradictory claims or conflicting data detected among sources.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
