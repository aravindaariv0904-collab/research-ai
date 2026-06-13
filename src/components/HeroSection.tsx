import React, { useState } from 'react';
import { useResearchStore } from '../store/useResearchStore';
import { Card } from './ui/Card';
import { Search, Sliders, Calendar, Sparkles, AlertCircle } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (
    query: string, 
    depth: 'Quick' | 'Standard' | 'Deep' | 'Expert',
    isComparison: boolean,
    dateRange: string,
    sourceFilters: string[]
  ) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const { isLoading, error } = useResearchStore();
  const [query, setQuery] = useState('');
  const [depth, setDepth] = useState<'Quick' | 'Standard' | 'Deep' | 'Expert'>('Standard');
  const [dateRange, setDateRange] = useState('last_month');
  const [isComparison, setIsComparison] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sourceInput, setSourceInput] = useState('');
  const [sourceFilters, setSourceFilters] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSearch(query, depth, isComparison, dateRange, sourceFilters);
  };

  const handleAddSource = () => {
    if (!sourceInput.trim()) return;
    setSourceFilters(prev => [...prev, sourceInput.trim()]);
    setSourceInput('');
  };

  const handleRemoveSource = (idx: number) => {
    setSourceFilters(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 md:py-20 px-4 text-center space-y-8 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Title */}
      <div className="space-y-4 relative z-10">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tracking-wider bg-white/5 border border-white/10 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Platform Release v2.4
        </span>
        <h1 className="text-4xl md:text-7xl font-black tracking-tight text-white leading-tight">
          AI Research <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Operating System
          </span>
        </h1>
        <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Search. Verify. Reason. Forecast. Decide. <br />
          Synthesize structured web intelligence reports with instant fact citations.
        </p>
      </div>

      {/* Main search form */}
      <form onSubmit={handleSubmit} className="relative z-10 max-w-3xl mx-auto space-y-4">
        <Card className="p-2 bg-slate-900/40 border-white/10 shadow-2xl relative">
          <div className="flex flex-col md:flex-row items-center gap-2">
            {/* Input field */}
            <div className="flex-1 w-full flex items-center gap-3 px-3 relative">
              <Search className="w-5 h-5 text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="What would you like to research today? (e.g. 'Quantum Computing')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                className="w-full bg-transparent border-none py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Quick action controls */}
            <div className="flex items-center gap-2 w-full md:w-auto px-2 justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl border transition-all text-slate-400 hover:text-white ${
                  showFilters ? 'bg-white/5 border-purple-500/30' : 'bg-slate-950/40 border-white/5'
                }`}
                title="Filters & Parameters"
              >
                <Sliders className="w-4 h-4" />
              </button>
              
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all uppercase tracking-wider shrink-0"
              >
                Generate Report
              </button>
            </div>
          </div>
        </Card>

        {/* Expandable Advanced Filters Drawer */}
        {showFilters && (
          <Card className="bg-slate-950/60 border-white/5 p-6 text-left grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in relative z-20">
            {/* Depth selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Research Depth</span>
                <span className="text-cyan-400 font-bold uppercase">{depth}</span>
              </label>
              
              {/* Depth Slider/Buttons */}
              <div className="grid grid-cols-4 gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-white/5">
                {(['Quick', 'Standard', 'Deep', 'Expert'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDepth(d)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      depth === d 
                        ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              
              <div className="text-[10px] text-slate-500 leading-tight">
                {depth === 'Quick' && 'Quick: Scrapes top 3 sources for rapid outlines.'}
                {depth === 'Standard' && 'Standard: Scrapes 6 sources. Balanced recall & speed.'}
                {depth === 'Deep' && 'Deep: Scrapes 10 sources. Heavy academic/technical parsing.'}
                {depth === 'Expert' && 'Expert: Scrapes up to 15 sources. Maximum synthesis recall.'}
              </div>
            </div>

            {/* Parameters & Mode */}
            <div className="space-y-4">
              {/* Date Filter & Comparison Toggle */}
              <div className="flex gap-4 items-center">
                <div className="flex-1 space-y-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Freshness Window</span>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full bg-slate-900 border border-white/5 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-300 focus:outline-none focus:border-purple-500/30"
                    >
                      <option value="last_24_hours">Last 24 Hours</option>
                      <option value="last_week">Last Week</option>
                      <option value="last_month">Last Month</option>
                      <option value="last_year">Last Year</option>
                    </select>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Comparison Mode</span>
                  <button
                    type="button"
                    onClick={() => setIsComparison(!isComparison)}
                    className={`w-full py-1.5 border rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                      isComparison 
                        ? 'bg-pink-500/15 text-pink-300 border-pink-500/30'
                        : 'bg-slate-900 text-slate-400 border-white/5 hover:border-white/10'
                    }`}
                  >
                    {isComparison ? 'Comparison On' : 'Standard'}
                  </button>
                </div>
              </div>

              {/* Specific Domain allowlists */}
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Domain Filters (Allowlist)</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. nature.com"
                    value={sourceInput}
                    onChange={(e) => setSourceInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/30"
                  />
                  <button
                    type="button"
                    onClick={handleAddSource}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-purple-500/20 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>
                
                {/* Source chips */}
                {sourceFilters.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {sourceFilters.map((domain, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-semibold">
                        {domain}
                        <button type="button" onClick={() => handleRemoveSource(i)} className="text-purple-400 hover:text-purple-100">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </form>

      {/* Error notification */}
      {error && (
        <div className="max-w-md mx-auto p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-300 text-left text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <strong className="font-bold">Research Error:</strong> {error}
          </div>
        </div>
      )}
    </div>
  );
}
