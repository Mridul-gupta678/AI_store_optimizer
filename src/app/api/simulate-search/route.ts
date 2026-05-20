import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query, products } = await req.json();
    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
      return NextResponse.json({ error: 'Missing Groq API key' }, { status: 500 });
    }

    if (!query || !products || products.length === 0) {
      return NextResponse.json({ error: 'Search query and products are required.' }, { status: 400 });
    }

    // Format products for the prompt to reduce token size and make it easy for the LLM to parse
    const storeContext = products.map((p: any) => `
    ---
    ID: ${p.id}
    Title: ${p.title}
    Original Description (HTML): ${p.descriptionHtml}
    ---
    `).join('\n');

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an autonomous AI Shopping Agent (like ChatGPT or Google AI Overviews). A user has asked you a specific query.
            I will provide you with the raw data footprint of several products from a Shopify store.
            
            Your job is to simulate your inference engine:
            1. Would you recommend any of these products for this exact query based ONLY on the data provided?
            2. If yes, which one and why?
            3. If no, why is the data insufficient to make a confident recommendation? (e.g., "User asked for a beginner snowboard, but no skill level is mentioned in the data").
            
            Respond STRICTLY with a JSON object matching this exact schema:
            {
              "overall_verdict": "A short summary (e.g., 'Low Confidence: Missing critical specs', 'High Confidence: Perfect match')",
              "confidence_score": <number 0-100>,
              "recommended_product_id": "The ID of the recommended product, or null if none",
              "reasoning": "Detailed explanation of how the AI parsed the data and why it made this decision. Be highly technical about what vectors were missing or present."
            }
            CRITICAL INSTRUCTION: You must return VALID JSON. You MUST escape all double quotes (\\") and all newlines (\\n) inside the string values. Do NOT use actual raw newline characters inside the strings. Do not include any markdown fences or explanations.`
          },
          {
            role: 'user',
            content: `User Search Query: "${query}"\n\nStore Product Data:\n${storeContext}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    const groqData = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error("Groq API Error:", groqData);
      return NextResponse.json({ error: 'AI Simulation failed' }, { status: 500 });
    }

    let aiResponseText = groqData.choices?.[0]?.message?.content || '';
    
    // Clean potential markdown blocks
    aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Clean unescaped newlines/tabs inside string values
    aiResponseText = aiResponseText.replace(/[\u0000-\u001F]+/g, " ");
    
    // Fix invalid JSON escapes (like escaping single quotes \')
    aiResponseText = aiResponseText.replace(/\\'/g, "'");
    
    try {
      const analysisJson = JSON.parse(aiResponseText);
      return NextResponse.json(analysisJson);
    } catch (parseError) {
      console.error("Raw AI Output that failed to parse:", aiResponseText);
      throw parseError;
    }

  } catch (error) {
    console.error('Simulation Error:', error);
    return NextResponse.json({ error: 'Failed to simulate search due to server error.' }, { status: 500 });
  }
}
