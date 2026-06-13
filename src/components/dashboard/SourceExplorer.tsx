import React, { useState } from 'react';
import { ResearchReport, ResearchSource } from '../../types/research';
import { Card } from '../ui/Card';
import { Search, ExternalLink, Filter, TrendingUp } from 'lucide-react';

interface SourceExplorerProps {
  report: ResearchReport;
}

type SortField = 'credibilityScore' | 'domainTrust' | 'title';
type SortOrder = 'asc' | 'desc';

export function SourceExplorer({ report }: SourceExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('credibilityScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter sources
  const filteredSources = report.sources.filter(source => {
    const matchesSearch = source.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          source.url.toLowerCase().includes(searchQuery.toLowerCase());
    
    const category = getSourceCategory(source.url);
    const matchesCategory = selectedCategory === 'All' || category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort sources
  const sortedSources = [...filteredSources].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (typeof aVal === 'string') {
      aVal = (aVal as string).toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Helper to resolve category from domain
  function getSourceCategory(url: string): string {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('nature.com') || lowerUrl.includes('science')) return 'Nature';
    if (lowerUrl.includes('.gov') || lowerUrl.includes('nih.gov')) return 'Government';
    if (lowerUrl.includes('.edu') || lowerUrl.includes('arxiv.org')) return 'Research Institution';
    if (lowerUrl.includes('techcrunch.com') || lowerUrl.includes('nytimes.com') || lowerUrl.includes('wired.com') || lowerUrl.includes('sciencedaily')) return 'Major News';
    return 'Blog';
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 80) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    if (score >= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Source Explorer & Credentials</h2>
          <p className="text-slate-400 text-sm">Verify the authority index, publication dates, and cross-source consensus for scraped URLs.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search sources or domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/30"
          />
        </div>
      </div>

      {/* Filter and sorting headers */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Nature', 'Research Institution', 'Government', 'Major News', 'Blog'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                  : 'bg-slate-900/40 text-slate-400 border-white/5 hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
          <span>Sort By:</span>
          <button 
            onClick={() => handleSort('credibilityScore')}
            className={`hover:text-slate-200 transition-colors ${sortField === 'credibilityScore' ? 'text-purple-400 font-bold' : ''}`}
          >
            Trust Index {sortField === 'credibilityScore' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
          </button>
          <span className="w-1 h-1 rounded-full bg-slate-800" />
          <button 
            onClick={() => handleSort('domainTrust')}
            className={`hover:text-slate-200 transition-colors ${sortField === 'domainTrust' ? 'text-purple-400 font-bold' : ''}`}
          >
            Domain Authority {sortField === 'domainTrust' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>
      </div>

      {/* Grid of source cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedSources.length > 0 ? (
          sortedSources.map((source, idx) => {
            const category = getSourceCategory(source.url);
            return (
              <Card key={idx} className="border border-white/5 bg-slate-950/35 p-5 flex flex-col justify-between hover:border-purple-500/20 transition-all group">
                <div className="space-y-4">
                  {/* Category and Ref ID */}
                  <div className="flex justify-between items-center text-xs">
                    <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px] border ${getScoreColor(source.credibilityScore)}`}>
                      {category}
                    </span>
                    <span className="text-slate-500 font-mono font-semibold">{source.contextDevRef}</span>
                  </div>
                  
                  {/* Title & URL */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-purple-400 transition-colors line-clamp-2">
                      {source.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 truncate block max-w-sm font-mono">
                      {source.url}
                    </span>
                  </div>
                </div>

                {/* Score meters */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div>
                      <div className="text-[9px] text-slate-500 uppercase font-semibold">Trust Index</div>
                      <div className="text-sm font-black text-slate-200">{source.credibilityScore}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-500 uppercase font-semibold">Domain Authority</div>
                      <div className="text-sm font-black text-slate-300">{source.domainTrust}</div>
                    </div>
                    {source.pubDate && (
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Published</div>
                        <div className="text-sm font-semibold text-slate-400">{source.pubDate}</div>
                      </div>
                    )}
                  </div>

                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 group-hover:bg-purple-500/10 rounded-lg border border-white/5 group-hover:border-purple-500/20 text-slate-400 group-hover:text-purple-400 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </Card>
            )
          })
        ) : (
          <div className="col-span-2 text-center py-10 bg-slate-900/10 border border-white/5 rounded-2xl">
            <span className="text-slate-500 text-sm">No sources match your filter criteria.</span>
          </div>
        )}
      </div>
    </div>
  );
}
