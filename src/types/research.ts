export interface ResearchSource {
  url: string;
  title: string;
  credibilityScore: number;
  domainTrust: number;
  recencyScore: number;
  crossSourceAgreement: number;
  citationFrequency: number;
  contextDevRef: string;
  pubDate?: string;
  category?: 'Nature' | 'Government' | 'Research Institution' | 'Major News' | 'Blog' | 'Other';
}

export interface ClaimVerification {
  claim: string;
  supportingSources: string[]; // URLs of supporting sources
  verificationStatus: 'Verified' | 'Partially Verified' | 'Conflicting Evidence' | 'Unverified';
  confidenceLevel: number; // 0 to 100
}

export interface KeyInsight {
  id: number;
  title: string;
  content: string;
  claimVerification: ClaimVerification;
}

export interface Contradiction {
  claimA: string;
  claimB: string;
  reasonForConflict: string;
  confidence: number; // 0 to 100
  sourceUrls: string[]; // URLs of conflicting sources
}

export interface Trend {
  name: string;
  growthRate: number; // percentage growth projection
  popularity: number; // 0 to 100
  industryImpact: string;
  description: string;
}

export interface FutureForecast {
  period: '6-Month' | '1-Year' | '3-Year' | '5-Year';
  outlook: string;
  confidenceEstimate: number; // 0 to 100
}

export interface Opportunity {
  title: string;
  description: string;
  marketGap: string;
}

export interface Risk {
  title: string;
  description: string;
  uncertaintyLevel: 'High' | 'Medium' | 'Low';
}

export interface TimelineEntry {
  period: 'Today' | 'Recent' | 'Emerging' | 'Future';
  title: string;
  description: string;
  date?: string;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: 'Company' | 'Technology' | 'Concept' | 'Researcher' | 'Product' | 'Industry';
  val?: number; // size scaling
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  relationship: 'Related To' | 'Uses' | 'Influences' | 'Competes With';
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

export interface Recommendation {
  title: string;
  actionableStep: string;
  impactScore: 'Critical' | 'High' | 'Medium';
}

export interface ConfidenceMetrics {
  sourceQuality: number; // percentage
  dataFreshness: number; // percentage
  coverageDepth: number; // percentage
  consensusScore: number; // percentage
  overallConfidence: number; // percentage
}

export interface CompetitorComparison {
  competitorA: string;
  competitorB: string;
  fundingA?: string;
  fundingB?: string;
  productsA: string[];
  productsB: string[];
  researchA: string;
  researchB: string;
  partnershipsA: string[];
  partnershipsB: string[];
  marketPositionA: string;
  marketPositionB: string;
  sideBySideSummary: string;
}

export interface ResearchReport {
  id: string;
  query: string;
  title: string;
  depth: 'Quick' | 'Standard' | 'Deep' | 'Expert';
  timestamp: string;
  latency: number; // ms
  executiveSummary: string;
  insights: KeyInsight[];
  deepAnalysis: {
    context: string;
    currentState: string;
    implications: string;
    futureTrajectory: string;
  };
  trends: Trend[];
  forecasts: FutureForecast[];
  opportunities: Opportunity[];
  risks: Risk[];
  timeline: TimelineEntry[];
  sources: ResearchSource[];
  images: { url: string; alt: string | null }[];
  knowledgeGraph: KnowledgeGraph;
  contradictions: Contradiction[];
  recommendations: Recommendation[];
  confidence: ConfidenceMetrics;
  tags: string[]; // 8 classified tags
  competitorComparison?: CompetitorComparison;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: string[]; // Source URLs referenced
}

export interface HistoryComparison {
  addedFindings: string[];
  removedFindings: string[];
  newTrends: string[];
  updatedStatistics: string[];
}
