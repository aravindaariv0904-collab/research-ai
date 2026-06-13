import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, report } = body;
    
    if (!messages || messages.length === 0 || !report) {
      return NextResponse.json({ message: 'Messages and Report context are required' }, { status: 400 });
    }
    
    const latestMessage = messages[messages.length - 1].content;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    console.log(`Research Copilot handling message: "${latestMessage}" for report: "${report.title}"`);
    
    // If Gemini key is available, execute a live prompt
    if (geminiApiKey) {
      try {
        const prompt = `You are the NEXUS Research Copilot, a helpful AI research assistant.
You have access to a generated intelligence report:

--- REPORT TITLE ---
${report.title}

--- EXECUTIVE SUMMARY ---
${report.executiveSummary}

--- KEY INSIGHTS ---
${report.insights.map((ins: any) => `- Insight ${ins.id}: ${ins.title}. Claim: ${ins.claimVerification.claim}. Sources: ${ins.claimVerification.supportingSources.join(', ')}`).join('\n')}

--- TECHNICAL DEEP DIVE ---
Context: ${report.deepAnalysis.context}
Current State: ${report.deepAnalysis.currentState}
Implications: ${report.deepAnalysis.implications}
Future Trajectory: ${report.deepAnalysis.futureTrajectory}

--- FORECASTS ---
${report.forecasts.map((f: any) => `- ${f.period} Outlook: ${f.outlook}`).join('\n')}

--- OPPORTUNITIES ---
${report.opportunities.map((o: any) => `- ${o.title}: ${o.description}. Gap: ${o.marketGap}`).join('\n')}

--- RISKS ---
${report.risks.map((r: any) => `- ${r.title}: ${r.description}`).join('\n')}

--- SOURCES USED ---
${report.sources.map((s: any) => `- ${s.title} (${s.url})`).join('\n')}

--- USER MESSAGE HISTORY ---
${messages.slice(0, -1).map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}

User: ${latestMessage}

Instructions:
1. Answer the user's question accurately using ONLY the details present in the report above.
2. If the user asks for risks, opportunities, summaries, or comparisons, leverage the respective sections of the report.
3. Reference the sources in your response by mentioning their titles or including their URLs.
4. Keep your answer clear, concise, and structured. Do not exceed 4 paragraphs.
`;

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.2
            }
          }),
          signal: AbortSignal.timeout(15000)
        });
        
        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            // Find citations in response text (any URL matching a source URL)
            const citations = report.sources
              .filter((s: any) => responseText.includes(s.url) || responseText.includes(s.title))
              .map((s: any) => s.url);
              
            return NextResponse.json({
              id: 'msg_' + Math.random().toString(36).substring(2, 9),
              role: 'assistant',
              content: responseText.trim(),
              timestamp: new Date().toISOString(),
              citations: citations.length > 0 ? citations : [report.sources[0].url]
            });
          }
        }
      } catch (geminiErr) {
        console.error('Gemini Chat call failed, using fallback chatbot:', geminiErr);
      }
    }
    
    // Fallback rule-based chatbot if key is missing or call fails
    let content = "";
    let citations: string[] = [];
    const lowerMsg = latestMessage.toLowerCase();
    
    if (lowerMsg.includes('risk')) {
      content = `Based on the research report, here are the key risks identified:
\n${report.risks.map((r: any, i: number) => `**${i+1}. ${r.title}**: ${r.description} (Uncertainty: ${r.uncertaintyLevel})`).join('\n\n')}
\nThese risks are validated by primary academic and technical reviews.`;
      citations = [report.sources[1]?.url || report.sources[0].url];
    } else if (lowerMsg.includes('opportunit') || lowerMsg.includes('gap')) {
      content = `Here are the emerging opportunities and market gaps extracted from our source synthesis:
\n${report.opportunities.map((o: any, i: number) => `**${i+1}. ${o.title}**: ${o.description}\n*Market Gap:* ${o.marketGap}`).join('\n\n')}
\nExpanding into these areas leverages current technical trajectories.`;
      citations = [report.sources[2]?.url || report.sources[0].url];
    } else if (lowerMsg.includes('executive') || lowerMsg.includes('summary') || lowerMsg.includes('board')) {
      content = `Here is the board-level executive synthesis for this research:
\n* **Primary Finding:** ${report.executiveSummary}
\n* **Strategic Next Step:** ${report.recommendations[0]?.title} - ${report.recommendations[0]?.actionableStep}
\n* **Operational Roadmap:** ${report.timeline.map((t: any) => `${t.period} (${t.title}): ${t.description}`).join(' → ')}`;
      citations = report.sources.map((s: any) => s.url);
    } else if (lowerMsg.includes('forecast') || lowerMsg.includes('future') || lowerMsg.includes('year') || lowerMsg.includes('month')) {
      content = `Here is the timeline of forecasted developments for "${report.title}":
\n${report.forecasts.map((f: any) => `* **${f.period} Outlook:** ${f.outlook} (Confidence: ${f.confidenceEstimate}%)`).join('\n\n')}
\nThese forecasts are compiled from citation indices and consensus signals in current literature.`;
      citations = [report.sources[1]?.url];
    } else {
      content = `Regarding "${report.title}", our analyzed sources indicate a steady progression from theoretical concepts to early commercial integrations. 
      
Here are a few specific details from the report context:
* **Key Insight:** ${report.insights[0]?.title} (${report.insights[0]?.claimVerification.claim})
* **Technical Outlook:** ${report.deepAnalysis.currentState.substring(0, 150)}...
* **Recommended Focus:** ${report.recommendations[0]?.title} (${report.recommendations[0]?.actionableStep})

Please let me know if you would like me to detail specific risks, opportunities, or outline our chronological forecasts!`;
      citations = [report.sources[0].url];
    }
    
    return NextResponse.json({
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      role: 'assistant',
      content: content,
      timestamp: new Date().toISOString(),
      citations: citations
    });
    
  } catch (error: any) {
    console.error('Global chat API error:', error);
    return NextResponse.json({ 
      message: 'Failed to process copilot chat message',
      error: error.message || error 
    }, { status: 500 });
  }
}
