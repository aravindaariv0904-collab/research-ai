import React, { useState } from 'react';
import { ResearchReport, KeyInsight } from '../../types/research';
import { Card } from '../ui/Card';
import { CheckCircle, AlertTriangle, HelpCircle, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';

interface KeyInsightsProps {
  report: ResearchReport;
}

export function KeyInsights({ report }: KeyInsightsProps) {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);

  const getStatusBadge = (status: KeyInsight['claimVerification']['verificationStatus']) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" /> Verified
          </span>
        );
      case 'Partially Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Partially Verified
          </span>
        );
      case 'Conflicting Evidence':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Conflicting Evidence
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <HelpCircle className="w-3.5 h-3.5" /> Unverified
          </span>
        );
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedInsight(expandedInsight === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-white">Research Insights & Verified Claims</h2>
        <p className="text-slate-400 text-sm">Expand any insight card to view supporting citations, verification statuses, and credibility links.</p>
      </div>

      <div className="space-y-4">
        {report.insights.map((insight) => {
          const isExpanded = expandedInsight === insight.id;
          return (
            <Card
              key={insight.id}
              onClick={() => toggleExpand(insight.id)}
              className={`border transition-all duration-300 p-0 overflow-hidden bg-slate-900/10 border-white/5 hover:border-purple-500/25 cursor-pointer ${
                isExpanded ? 'bg-slate-950/60 border-purple-500/30 shadow-[0_0_30px_-10px_rgba(139,92,246,0.1)]' : ''
              }`}
            >
              {/* Card Header row */}
              <div className="p-6 flex items-start justify-between gap-4 select-none">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-purple-500/10 shrink-0">
                    0{insight.id}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-400 transition-colors">
                      {insight.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                      {insight.content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {getStatusBadge(insight.claimVerification.verificationStatus)}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Expandable Claim Details Panel */}
              {isExpanded && (
                <div className="border-t border-white/5 bg-slate-950/40 p-6 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Fact details */}
                    <div className="md:col-span-2 space-y-3">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Verified Technical Claim</div>
                      <div className="text-sm text-slate-200 bg-white/5 p-4 rounded-xl border border-white/5 italic">
                        "{insight.claimVerification.claim}"
                      </div>
                    </div>

                    {/* Right Column: Credibility details */}
                    <div className="space-y-3 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                      <div className="text-xs font-semibold uppercase tracking-wider text-purple-300">Confidence Metric</div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold text-purple-200">
                          {insight.claimVerification.confidenceLevel}%
                        </span>
                        <span className="text-xs text-purple-400 font-medium">Certainty Score</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-purple-950 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                          style={{ width: `${insight.claimVerification.confidenceLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Supporting Sources */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Evidence Citations</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {insight.claimVerification.supportingSources.map((url, index) => {
                        const matchedSource = report.sources.find(s => s.url === url);
                        return (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-white/5 hover:border-purple-500/20 text-xs text-slate-300 hover:text-purple-400 transition-all group"
                          >
                            <span className="truncate pr-4">
                              {matchedSource ? matchedSource.title : url}
                            </span>
                            <span className="flex items-center gap-1.5 shrink-0">
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                                {matchedSource?.contextDevRef || 'Ref'}
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
