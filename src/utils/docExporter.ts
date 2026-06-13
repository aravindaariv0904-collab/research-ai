import { ResearchReport } from '../types/research';

// Export report as JSON
export function exportToJSON(report: ResearchReport) {
  const dataStr = JSON.stringify(report, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${slugify(report.title)}_nexus_report.json`);
}

// Export report as Markdown
export function exportToMarkdown(report: ResearchReport) {
  const content = `# ${report.title}
*NEXUS AI Research Operating System Report*

**Generated:** ${new Date(report.timestamp).toLocaleString()}
**Research Depth:** ${report.depth}
**API Latency:** ${(report.latency / 1000).toFixed(2)}s
**Query Keyphrase:** "${report.query}"

---

## Executive Summary
${report.executiveSummary}

---

## Key Insights
${report.insights.map((ins, i) => `### 0${i + 1}. ${ins.title}
${ins.content}
* **Claim:** "${ins.claimVerification.claim}"
* **Verification Status:** ${ins.claimVerification.verificationStatus}
* **Confidence Level:** ${ins.claimVerification.confidenceLevel}%
* **Supporting Sources:**
${ins.claimVerification.supportingSources.map(url => `  - ${url}`).join('\n')}
`).join('\n')}

---

## Technical Deep Dive
### Historical Context
${report.deepAnalysis.context}

### Current Engineering State
${report.deepAnalysis.currentState}

### Security & Operational Implications
${report.deepAnalysis.implications}

### Future Evolutionary Trajectory
${report.deepAnalysis.futureTrajectory}

---

## Strategic Recommendations
${report.recommendations.map((rec, i) => `### Rec 0${i + 1}. ${rec.title}
* **Actionable Step:** ${rec.actionableStep}
* **Impact Score:** ${rec.impactScore}
`).join('\n')}

---

## Future Forecasts Outlook
${report.forecasts.map(f => `* **${f.period} Outlook:** ${f.outlook} (Confidence Estimate: ${f.confidenceEstimate}%)`).join('\n')}

---

## Detected Contradictions & Disagreements
${report.contradictions && report.contradictions.length > 0 ? 
  report.contradictions.map((con, i) => `### Conflict 0${i + 1}: ${con.reasonForConflict}
* **Viewpoint Alpha:** "${con.claimA}"
* **Viewpoint Beta:** "${con.claimB}"
* **Citations:** ${con.sourceUrls.join(', ')}
* **Certainty Score:** ${con.confidence}%
`).join('\n') : 'No contradictions identified.'}

---

## Scraped Source Publications
${report.sources.map((src, i) => `${i + 1}. **${src.title}**
   - URL: ${src.url}
   - Trust Index: ${src.credibilityScore} / Domain Trust: ${src.domainTrust}
   - Reference Tag: ${src.contextDevRef}
`).join('\n')}

---
*Powered by Context.dev & Google Gemini*
`;

  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${slugify(report.title)}_nexus_report.md`);
}

// Export report as MS Word document (.doc via HTML-to-Word trick)
export function exportToWord(report: ResearchReport) {
  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <title>${report.title}</title>
      <style>
        body { font-family: 'Arial', sans-serif; color: #333333; line-height: 1.6; }
        h1 { color: #8b5cf6; font-size: 24pt; border-bottom: 2px solid #8b5cf6; padding-bottom: 5px; }
        h2 { color: #06b6d4; font-size: 18pt; margin-top: 20px; }
        h3 { color: #475569; font-size: 14pt; }
        p { font-size: 11pt; margin-bottom: 15px; }
        .inset { background-color: #f8fafc; border-left: 4px solid #8b5cf6; padding: 10px; margin: 15px 0; font-style: italic; }
        .badge { display: inline-block; padding: 3px 8px; background-color: #e2e8f0; border-radius: 4px; font-size: 9pt; font-weight: bold; }
        .recommendation { background-color: #f1f5f9; padding: 10px; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h1>${report.title}</h1>
      <p><strong>NEXUS AI Research Operating System</strong> | Generated: ${new Date(report.timestamp).toLocaleString()}</p>
      <p><strong>Query:</strong> "${report.query}" | <strong>Depth:</strong> ${report.depth}</p>
      
      <h2>Executive Summary</h2>
      <p>${report.executiveSummary}</p>
      
      <h2>Key Research Insights</h2>
      ${report.insights.map((ins, i) => `
        <h3>0${i + 1}. ${ins.title}</h3>
        <p>${ins.content}</p>
        <div class="inset">
          <strong>Claim Check:</strong> "${ins.claimVerification.claim}" <br/>
          <strong>Status:</strong> ${ins.claimVerification.verificationStatus} (Confidence: ${ins.claimVerification.confidenceLevel}%)
        </div>
      `).join('')}
      
      <h2>Technical Deep Dive</h2>
      <h3>Historical Context</h3>
      <p>${report.deepAnalysis.context}</p>
      <h3>Current State</h3>
      <p>${report.deepAnalysis.currentState}</p>
      <h3>Implications</h3>
      <p>${report.deepAnalysis.implications}</p>
      <h3>Future Trajectory</h3>
      <p>${report.deepAnalysis.futureTrajectory}</p>
      
      <h2>Strategic Recommendations</h2>
      ${report.recommendations.map(rec => `
        <div class="recommendation">
          <strong>${rec.title}</strong> (${rec.impactScore} Impact)<br/>
          <em>Action:</em> ${rec.actionableStep}
        </div>
      `).join('')}
      
      <h2>Scraped Publications Bibliography</h2>
      <ul>
        ${report.sources.map(s => `<li><strong>${s.title}</strong> - <a href="${s.url}">${s.url}</a> (Trust: ${s.credibilityScore})</li>`).join('')}
      </ul>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${slugify(report.title)}_nexus_report.doc`);
}

// Trigger browser download
function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Slugify string for safe filenames
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w-]+/g, '')
    .replace(/__+/g, '_')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
