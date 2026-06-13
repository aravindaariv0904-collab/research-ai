import React, { useState, useEffect } from 'react';
import { ResearchReport } from '../../types/research';
import { Card } from '../ui/Card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';

interface TrendAnalysisProps {
  report: ResearchReport;
}

export function TrendAnalysis({ report }: TrendAnalysisProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-slate-950/20 border border-white/5 rounded-2xl">
        <span className="text-slate-500 text-xs animate-pulse">Initializing Recharts Engine...</span>
      </div>
    );
  }

  // 1. Data for Trend Growth Chart
  const trendData = report.trends.map(t => ({
    name: t.name.length > 20 ? t.name.substring(0, 18) + '...' : t.name,
    'Growth Rate (%)': t.growthRate,
    'Popularity Score': t.popularity
  }));

  // 2. Data for Source Distribution Pie Chart
  const categoryCounts: Record<string, number> = {};
  report.sources.forEach(s => {
    const cat = s.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const sourceData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  // 3. Data for Confidence breakdown
  const confidenceData = [
    { metric: 'Source Quality', score: report.confidence.sourceQuality },
    { metric: 'Data Freshness', score: report.confidence.dataFreshness },
    { metric: 'Coverage Depth', score: report.confidence.coverageDepth },
    { metric: 'Consensus', score: report.confidence.consensusScore },
  ];

  return (
    <div className="space-y-8">
      {/* Overview stats */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Visual Trend Analytics</h2>
        <p className="text-slate-400 text-sm">Visualizing growth rates, category distribution, and trust indices extracted from active literature.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Growth Comparison Chart */}
        <Card className="border border-white/5 bg-slate-950/45 p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-300">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold tracking-wider uppercase text-slate-300">Trend Growth & Popularity</h3>
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="Growth Rate (%)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Popularity Score" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Source distribution pie chart */}
        <Card className="border border-white/5 bg-slate-950/45 p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-300">
            <PieIcon className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold tracking-wider uppercase text-slate-300">Source Category Mix</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 h-[280px]">
            <div className="h-[200px] w-[200px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend block */}
            <div className="space-y-2 text-xs w-full max-w-[200px]">
              {sourceData.map((entry, index) => {
                const percentage = Math.round((entry.value / report.sources.length) * 100);
                return (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-slate-400 truncate font-medium">{entry.name}</span>
                    </div>
                    <span className="text-slate-500 font-mono font-semibold">{percentage}% ({entry.value})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Growth detailed indicators */}
      <Card className="border border-white/5 bg-slate-950/45 p-6">
        <h3 className="text-sm font-bold tracking-wider uppercase text-slate-300 mb-6 flex items-center gap-2">
          <Activity className="w-4 h-4 text-pink-400" /> Topic Impact Index Matrix
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {report.trends.map((t, idx) => (
            <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
              <div className="text-[10px] text-slate-500 font-mono uppercase">Impact Area: {t.industryImpact}</div>
              <h4 className="text-sm font-bold text-slate-200">{t.name}</h4>
              <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{t.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
