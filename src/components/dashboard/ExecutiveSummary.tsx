import React from 'react';
import { ResearchReport } from '../../types/research';
import { Card } from '../ui/Card';
import { ProgressRing } from '../ui/ProgressRing';
import { Database, BadgeAlert, Award, Hourglass, ShieldCheck } from 'lucide-react';

interface ExecutiveSummaryProps {
  report: ResearchReport;
}

export function ExecutiveSummary({ report }: ExecutiveSummaryProps) {
  const verifiedCount = report.insights.filter(i => i.claimVerification.verificationStatus === 'Verified').length;
  
  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-8 md:p-10 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Intelligence Synthesis
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {report.title}
            </h1>
            <p className="text-slate-400 text-sm md:text-base flex flex-wrap items-center gap-3">
              <span>Query: <strong className="text-slate-200">"{report.query}"</strong></span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span>Depth: <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-bold uppercase">{report.depth}</span></span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span>Latency: <strong className="text-emerald-400">{(report.latency / 1000).toFixed(2)}s</strong></span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span>Timestamp: <span className="text-slate-300">{new Date(report.timestamp).toLocaleDateString()}</span></span>
            </p>
          </div>
          
          {/* Main Confidence Score Ring */}
          <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-white/5">
            <ProgressRing percentage={report.confidence.overallConfidence} size={90} strokeWidth={8} label="Trust Index" />
            <div className="text-left">
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Consensus Index</div>
              <div className="text-xl font-black text-white">{report.confidence.consensusScore}% Agreement</div>
              <div className="text-[11px] text-slate-400">Cross-verified across {report.sources.length} publications</div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Synthesis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-white/10 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900/80 to-slate-950 p-8">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-cyan-500" />
            <h2 className="text-xl font-bold tracking-tight text-slate-200 mb-4 flex items-center gap-2">
              Executive Briefing
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed font-light">
              {report.executiveSummary}
            </p>
          </Card>
          
          {/* Detailed Confidence breakdown */}
          <Card className="p-6 bg-slate-900/20">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-400 mb-6">Confidence Decomposition</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-2xl font-black text-purple-400">{report.confidence.sourceQuality}%</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Source Authority</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-2xl font-black text-cyan-400">{report.confidence.dataFreshness}%</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Data Freshness</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-2xl font-black text-pink-400">{report.confidence.coverageDepth}%</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Coverage Depth</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-2xl font-black text-emerald-400">{report.confidence.consensusScore}%</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Cross Agreement</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Dynamic Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <Card className="p-4 flex items-center gap-4 bg-slate-900/30 border border-white/5">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Sources Scraped</div>
              <div className="text-2xl font-bold text-white leading-tight">{report.sources.length}</div>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-4 bg-slate-900/30 border border-white/5">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Claims Verified</div>
              <div className="text-2xl font-bold text-white leading-tight">
                {verifiedCount} <span className="text-xs text-slate-500">/ {report.insights.length}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-4 bg-slate-900/30 border border-white/5">
            <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400 border border-pink-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">NEXUS Score</div>
              <div className="text-2xl font-bold text-white leading-tight">{report.confidence.overallConfidence}</div>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-4 bg-slate-900/30 border border-white/5">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <Hourglass className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Time Saved</div>
              <div className="text-2xl font-bold text-white leading-tight">
                ~{Math.round(report.sources.length * 12)} <span className="text-xs text-slate-500">mins</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
