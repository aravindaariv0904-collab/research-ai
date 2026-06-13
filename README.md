# ResearchAI — NEXUS Research Operating System

ResearchAI (Code-named **NEXUS**) is a production-grade, SaaS-quality AI Research Operating System designed to automate information retrieval, verify claims, analyze market trends, and output structured intelligence briefings.

Unlike traditional search summaries, ResearchAI employs a multi-agent system to scrape, cross-verify, and audit web data to ensure high-fidelity insights with vector-sharp citations.

**Live Deployment:** [https://research-ai-khaki.vercel.app](https://research-ai-khaki.vercel.app)

---

## ⚙️ How It Works

ResearchAI coordinates a multi-stage research pipeline for every query:

```
          [ User Query ]
                │
                ▼
      [ Query Expansion ] (Expands keywords for broader recall)
                │
                ▼
     [ Context.dev Search ] (Searches and scrapes live Markdown text)
                │
                ▼
     [ Image Extraction ] (Scrapes visual evidence from top source)
                │
                ▼
     [ Multi-Agent Audit ] (Parallel analysis by specialized agents)
         ├── Research Agent (Extracts key findings & deep context)
         ├── Fact Checker Agent (Verifies statistical claims)
         ├── Trend Agent (Identifies market trajectories)
         ├── Risk Agent (Pinpoints limitations & uncertainties)
         ├── Opportunity Agent (Maps commercial innovation gaps)
         └── Summary Agent (Synthesizes board-level briefs)
                │
                ▼
  [ Contradiction Detector ] (Scans for policy or data disagreements)
                │
                ▼
   [ Knowledge Graph Gen ] (Builds semantic entity relationship map)
                │
                ▼
    [ Interactive Report ] (Renders dashboard & launches Copilot Q&A)
```

---

## 🌟 Core Features

- **Multi-Agent Research Pipeline:** Specialized AI agents collaborate to compile findings, statistics, risks, and forecasts.
- **Context.dev Scraping Engine:** Directly utilizes Context.dev Web Search API to scrape live GFM Markdown content and extract raw images from target domains.
- **Claim Verification Pass:** Automatically assigns verification badges (`Verified`, `Partially Verified`, `Conflicting Evidence`, `Unverified`) and links claims to supporting sources.
- **Friction & Contradiction Detection:** Highlights policy disagreements and contradictory assertions made by different publications.
- **Interactive Knowledge Graph:** A custom SVG-based visualizer showing connections between Companies, Technologies, Concepts, Researchers, and Products with highlight-on-click, search, and pan/zoom controls.
- **Strategic Horizon Forecasts:** Provides 6-Month, 1-Year, 3-Year, and 5-Year outlooks.
- **Research Copilot:** A persistent sidebar chat system to ask follow-up questions, summarize sections, or compare statistics with inline citations.
- **Historical Change Detection:** Compares active reports with past history to trace new findings, updated statistics, or shifted trends.
- **Multi-Format Exports:** One-click download options for Markdown (`.md`), MS Word (`.doc`), raw JSON, and printable stylesheets for sharp PDF vector saves.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling & Motion:** Tailwind CSS + Framer Motion
- **State Management:** Zustand
- **Visual Analytics:** Recharts
- **Icons:** Lucide Icons
- **Web Scraping:** Context.dev APIs
- **Synthesis Engine:** Google Gemini (via HTTP REST interface)

---

## 🚀 Local Quickstart

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file at the root of the project:
```env
# Optional: Fallback key is embedded, but define here to override
CONTEXT_DEV_API_KEY=your_context_dev_api_key

# Required for live Gemini synthesis. If not set, the app will 
# gracefully run on our high-fidelity dynamic mock engine.
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run Development Server
```bash
npm run dev -- -p 9420
```
Open your browser to [http://localhost:9420](http://localhost:9420).

---

## 📂 Project Structure

- `/src/app/api/research/start`: Triggers Context.dev search, image extraction, and Gemini multi-agent synthesis.
- `/src/app/api/research/chat`: Handles interactive chat copilot events.
- `/src/store/useResearchStore.ts`: Zustand store managing active state, history tracking, loading stepper delays, and comparison filters.
- `/src/components/dashboard`: Sub-views representing the Executive Briefing, verified Key Insights, Technical Deep Dive, SVG Knowledge Graph, Opportunities/Risks matrix, and Source bibliography.
- `/src/utils/docExporter.ts`: Handles client-side multi-format download triggers.
