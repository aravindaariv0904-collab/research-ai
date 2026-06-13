import React from 'react';
import { ResearchReport } from '../../types/research';
import { Card } from '../ui/Card';
import { ShieldCheck, Compass, Lightbulb, TrendingUp } from 'lucide-react';

interface TechnicalDeepDiveProps {
  report: ResearchReport;
}

export function TechnicalDeepDive({ report }: TechnicalDeepDiveProps) {
  const getImpactBadge = (score: 'Critical' | 'High' | 'Medium') => {
    switch (score) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/20">Critical Impact</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/20">High Impact</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/20">Medium Impact</span>;
    }
  };

  return (
    <div className="space-y-10">
      {/* 4-Stage Deep Analysis Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/10 border-white/5 space-y-4 hover:border-purple-500/15 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/15 text-purple-400 rounded-lg border border-purple-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Historical & Technology Context</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed font-light">
            {report.deepAnalysis.context}
          </p>
        </Card>

        <Card className="bg-slate-900/10 border-white/5 space-y-4 hover:border-cyan-500/15 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/15 text-cyan-400 rounded-lg border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Current Engineering State</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed font-light">
            {report.deepAnalysis.currentState}
          </p>
        </Card>

        <Card className="bg-slate-900/10 border-white/5 space-y-4 hover:border-pink-500/15 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/15 text-pink-400 rounded-lg border border-pink-500/20">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Operational & Security Implications</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed font-light">
            {report.deepAnalysis.implications}
          </p>
        </Card>

        <Card className="bg-slate-900/10 border-white/5 space-y-4 hover:border-emerald-500/15 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/15 text-emerald-400 rounded-lg border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Future Evolutionary Trajectory</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed font-light">
            {report.deepAnalysis.futureTrajectory}
          </p>
        </Card>
      </div>

      {/* Board recommendations */}
      <div className="space-y-6">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold text-white tracking-tight">Executive Recommendations</h2>
          <p className="text-slate-400 text-sm">Actionable operational steps mapped directly from synthesized risks and opportunity signals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {report.recommendations.map((rec, i) => (
            <Card key={i} className="border border-white/5 bg-slate-950/40 p-6 flex flex-col justify-between hover:border-purple-500/20 transition-all group">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-slate-500">Rec 0{i + 1}</span>
                  {getImpactBadge(rec.impactScore)}
                </div>
                <h4 className="text-base font-bold text-slate-200 group-hover:text-purple-400 transition-colors">
                  {rec.title}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {rec.actionableStep}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
