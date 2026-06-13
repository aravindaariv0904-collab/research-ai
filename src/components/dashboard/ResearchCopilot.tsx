import React, { useState, useRef, useEffect } from 'react';
import { useResearchStore } from '../../store/useResearchStore';
import { Card } from '../ui/Card';
import { Send, Sparkles, User, RefreshCw, BookOpen, AlertTriangle } from 'lucide-react';

export function ResearchCopilot() {
  const { activeReport, chatMessages, sendCopilotMessage, isChatLoading } = useResearchStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Explain this simply",
    "Show only risks",
    "Show only opportunities",
    "Summarize for executives"
  ];

  // Auto-scroll chat to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  if (!activeReport) return null;

  const handleSend = async (text: string) => {
    if (!text.trim() || isChatLoading) return;
    setInputValue('');
    await sendCopilotMessage(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend(inputValue);
    }
  };

  return (
    <div className="flex flex-col h-[650px] border border-white/5 bg-slate-950/20 rounded-2xl overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-slate-950/60 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-md text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Research Copilot</h3>
            <span className="text-[10px] text-slate-500">Querying "{activeReport.title}"</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-6">
            <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-full flex items-center justify-center text-slate-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-300">NEXUS Conversational Workspace</h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Ask follow-up questions, request specific summaries, or drill down on conflicting claims.
              </p>
            </div>

            {/* Suggestions */}
            <div className="w-full grid grid-cols-2 gap-2 max-w-sm pt-4">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="p-3 text-left bg-slate-900/40 hover:bg-slate-900 border border-white/5 hover:border-purple-500/20 rounded-xl text-[11px] text-slate-400 hover:text-purple-300 transition-all font-medium leading-tight"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gradient-to-br from-slate-900 to-slate-800 text-purple-400 border border-white/5'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble */}
                <div className="space-y-2">
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                      msg.role === 'user'
                        ? 'bg-purple-500/10 border-purple-500/20 text-purple-200 rounded-tr-none'
                        : 'bg-slate-900/40 border-white/5 text-slate-300 rounded-tl-none'
                    }`}
                  >
                    {msg.content.split('\n').map((line, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                  </div>

                  {/* Citations list for assistant response */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center pl-1">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold mr-1">Citations:</span>
                      {msg.citations.map((url, index) => {
                        const source = activeReport.sources.find(s => s.url === url);
                        return (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-purple-400 transition-colors truncate max-w-[150px]"
                            title={source?.title || url}
                          >
                            {source?.contextDevRef || `Ref ${index+1}`}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading response */}
            {isChatLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center bg-slate-900 border border-white/5 text-purple-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-slate-900/20 border border-white/5 p-3.5 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="italic ml-1">Copilot is referencing sources...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/5 bg-slate-950/60 flex gap-2">
        <input
          type="text"
          placeholder="Ask Copilot a question (e.g. 'Show risks')..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isChatLoading}
          className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/30 disabled:opacity-50"
        />
        <button
          onClick={() => handleSend(inputValue)}
          disabled={!inputValue.trim() || isChatLoading}
          className="p-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-purple-500/10 disabled:opacity-50 transition-opacity flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
