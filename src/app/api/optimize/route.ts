import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();
    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
      return NextResponse.json({ error: 'Missing Groq API key' }, { status: 500 });
    }

    if (!title) {
      return NextResponse.json({ error: 'Product title is required' }, { status: 400 });
    }

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
            content: `You are an elite E-commerce AI SEO Expert & Data Analyst. 
            Your job is to analyze raw product data and rewrite it so it is perfectly optimized for AI Shopping Agents (like ChatGPT, Google AI Overviews).
            
            Guidelines:
            1. Perform a deep, highly technical semantic analysis on the original text. Look for missing e-commerce data vectors (e.g., precise dimensions, material composition, IPX ratings, technical specs, demographic targeting, use-case constraints).
            2. Identify specific "AI Misrepresentation Risks". Do not use general statements. (e.g. BAD: "Might not know the size". GOOD: "AI agent lacks dimensional weight data, risking inaccurate shipping cost estimates for user queries.")
            3. Rewrite the description to be detailed, keyword-rich, and structured with HTML.
            4. If the original description is empty or very short, invent reasonable, highly specific professional details based on the product title to fill the gaps.
            
            Respond STRICTLY with a JSON object matching this exact schema:
            {
              "ai_readability_score": <number 0-100, representing how well an AI agent understands this product's purpose and specs>,
              "quality_gaps": ["Array of specific missing info, e.g., 'No dimensions listed', 'Target audience unclear'"],
              "misrepresentation_risks": ["Array of how an AI might get confused, e.g., 'May assume it is not waterproof'"],
              "optimized_title": "An SEO optimized version of the title (be descriptive)",
              "optimized_description_html": "The full description formatted in semantic HTML (e.g., <p>, <ul>, <li>, <strong>). Do not include <html> or <body> tags."
            }
            CRITICAL INSTRUCTION: You must return VALID JSON. You MUST escape all double quotes (\\") and all newlines (\\n) inside the string values. Do NOT use actual raw newline characters inside the strings. Do not include any markdown fences or explanations.`
          },
          {
            role: 'user',
            content: `Original Title: ${title}\nOriginal Description: ${description || 'Empty'}`
          }
        ],
        temperature: 0.4,
        max_tokens: 1500,
      }),
    });

    const groqData = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error("Groq API Error:", groqData);
      return NextResponse.json({ error: 'AI optimization failed' }, { status: 500 });
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
    console.error('Optimization Error:', error);
    return NextResponse.json({ error: 'Failed to optimize product due to AI formatting error.' }, { status: 500 });
  }
}
