import { create } from 'zustand';
import { ResearchReport, ChatMessage, HistoryComparison } from '../types/research';

interface ResearchState {
  history: ResearchReport[];
  activeReport: ResearchReport | null;
  chatMessages: ChatMessage[];
  isLoading: boolean;
  isChatLoading: boolean;
  loadingStage: number; // 0 to 8 corresponding to the pipeline stages
  error: string | null;
  
  // Actions
  startResearch: (
    query: string, 
    depth: 'Quick' | 'Standard' | 'Deep' | 'Expert',
    isComparison: boolean,
    dateRange?: string,
    sourceFilters?: string[]
  ) => Promise<void>;
  
  sendCopilotMessage: (text: string) => Promise<void>;
  setActiveReport: (report: ResearchReport) => void;
  clearHistory: () => void;
  deleteReport: (id: string) => void;
  getChangeDetection: () => HistoryComparison | null;
}

const PIPELINE_STAGE_DELAY = 1200; // simulated speed for smoother transitions

export const useResearchStore = create<ResearchState>((set, get) => ({
  history: [],
  activeReport: null,
  chatMessages: [],
  isLoading: false,
  isChatLoading: false,
  loadingStage: 0,
  error: null,

  startResearch: async (query, depth, isComparison, dateRange = 'last_month', sourceFilters = []) => {
    set({ isLoading: true, error: null, loadingStage: 0, chatMessages: [] });
    
    // Set up a stage cycling simulation to show premium animations
    const stageInterval = setInterval(() => {
      set((state) => {
        if (state.loadingStage < 7) {
          return { loadingStage: state.loadingStage + 1 };
        }
        return {};
      });
    }, PIPELINE_STAGE_DELAY);

    try {
      const response = await fetch('/api/research/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          depth,
          isComparison,
          dateRange,
          sourceFilters
        })
      });

      clearInterval(stageInterval);

      if (!response.ok) {
        throw new Error(`Research API failed with status ${response.status}`);
      }

      const report: ResearchReport = await response.json();
      
      // Complete the loading stages
      set({ loadingStage: 8 });
      
      // Delay slightly so the user sees the final "100%" checkmark
      await new Promise(r => setTimeout(r, 600));

      set((state) => {
        const newHistory = [report, ...state.history];
        return {
          history: newHistory,
          activeReport: report,
          isLoading: false,
          loadingStage: 0
        };
      });

    } catch (err: any) {
      clearInterval(stageInterval);
      set({ 
        isLoading: false, 
        loadingStage: 0, 
        error: err.message || 'An unexpected error occurred during research.' 
      });
    }
  },

  sendCopilotMessage: async (text) => {
    const { activeReport, chatMessages } = get();
    if (!activeReport) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    set({ 
      chatMessages: [...chatMessages, userMsg],
      isChatLoading: true
    });

    try {
      const response = await fetch('/api/research/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          report: activeReport
        })
      });

      if (!response.ok) {
        throw new Error('Copilot chat failed to respond.');
      }

      const reply: ChatMessage = await response.json();
      
      set((state) => ({
        chatMessages: [...state.chatMessages, reply],
        isChatLoading: false
      }));

    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'msg_err_' + Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: `Error: ${err.message || 'I was unable to connect to the Copilot backend.'}`,
        timestamp: new Date().toISOString()
      };
      
      set((state) => ({
        chatMessages: [...state.chatMessages, errorMsg],
        isChatLoading: false
      }));
    }
  },

  setActiveReport: (report) => {
    set({ activeReport: report, chatMessages: [] });
  },

  clearHistory: () => {
    set({ history: [], activeReport: null, chatMessages: [] });
  },

  deleteReport: (id) => {
    set((state) => {
      const newHistory = state.history.filter(r => r.id !== id);
      const newActive = state.activeReport?.id === id 
        ? (newHistory[0] || null) 
        : state.activeReport;
      return {
        history: newHistory,
        activeReport: newActive,
        chatMessages: state.activeReport?.id === id ? [] : state.chatMessages
      };
    });
  },

  getChangeDetection: () => {
    const { activeReport, history } = get();
    if (!activeReport || history.length < 2) return null;
    
    // Find the previous report matching the same query
    const previousReport = history.find(
      r => r.query.toLowerCase() === activeReport.query.toLowerCase() && r.id !== activeReport.id
    );
    
    if (!previousReport) return null;

    // Perform semantic difference
    const activeFindings = activeReport.insights.map(i => i.title);
    const prevFindings = previousReport.insights.map(i => i.title);
    
    const addedFindings = activeFindings.filter(f => !prevFindings.includes(f));
    const removedFindings = prevFindings.filter(f => !activeFindings.includes(f));
    
    const activeTrends = activeReport.trends.map(t => t.name);
    const prevTrends = previousReport.trends.map(t => t.name);
    const newTrends = activeTrends.filter(t => !prevTrends.includes(t));
    
    // Diff statistics: compare matching insight numbers
    const updatedStatistics: string[] = [];
    activeReport.insights.forEach(ai => {
      const match = previousReport.insights.find(pi => pi.title === ai.title);
      if (match && match.claimVerification.claim !== ai.claimVerification.claim) {
        updatedStatistics.push(`Insight "${ai.title}" verified stats updated: "${ai.claimVerification.claim}" (was "${match.claimVerification.claim}")`);
      }
    });

    return {
      addedFindings,
      removedFindings,
      newTrends,
      updatedStatistics
    };
  }
}));
