import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    const groqKey = process.env.GROQ_API_KEY;

    if (!domain || !token || !groqKey) {
      return NextResponse.json({ error: 'Missing API credentials in .env.local' }, { status: 500 });
    }

    // 1. DATA INGESTION ENGINE: Fetch Shopify Data via GraphQL
    const shopifyQuery = `
      {
        shop {
          name
          description
        }
        products(first: 5) {
          edges {
            node {
              title
              descriptionHtml
              status
            }
          }
        }
      }
    `;

    const shopifyResponse = await fetch(`https://${domain}/admin/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query: shopifyQuery }),
    });

    const rawShopifyData = await shopifyResponse.json();

    if (rawShopifyData.errors) {
      console.error("Shopify API Error:", rawShopifyData.errors);
      return NextResponse.json({ error: 'Failed to fetch Shopify data. Check scopes and token.' }, { status: 400 });
    }

    const shop = rawShopifyData.data?.shop || {};
    const products = rawShopifyData.data?.products?.edges.map((e: any) => e.node) || [];

    // 2. AI PERCEPTION ENGINE: Analyze with Groq (Llama 3)
    const promptContext = `
      STORE INFO:
      Name: ${shop.name}
      Description: ${shop.description || 'N/A'}
      
      PRODUCTS:
      ${products.map((p: any) => `- Title: ${p.title}\n  Description: ${p.descriptionHtml}`).join('\n\n')}
    `;

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
            content: `You are an elite AI Shopping Agent Diagnostician for Shopify stores. 
            Your job is to read raw store data and determine how a customer-facing AI agent (like ChatGPT or Google AI Overviews) would perceive this store.
            Identify missing information, contradictory policies, weak trust signals, or poor product descriptions that would confuse an AI.
            
            Respond STRICTLY with a raw JSON object (no markdown, no code blocks, no explanation) matching this exact schema:
            {
              "score": number (0-100 representing AI readiness),
              "overall_perception": string (2-3 sentences summarizing the store's AI readiness),
              "critical_gaps": [
                {
                  "title": string,
                  "impact": "High" | "Medium" | "Low",
                  "description": string (Why this hurts AI perception),
                  "suggested_fix": string (Exact text the merchant should add)
                }
              ],
              "optimized_areas": [
                {
                  "title": string,
                  "description": string (Why the AI likes this)
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Analyze this Shopify store data:\n${promptContext}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    const groqData = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error("Groq API Error:", groqData);
      return NextResponse.json({ error: 'AI analysis failed. Check Groq API key.' }, { status: 500 });
    }

    let aiResponseText = groqData.choices?.[0]?.message?.content || '';
    
    // Clean potential markdown blocks
    aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const analysisJson = JSON.parse(aiResponseText);
    return NextResponse.json(analysisJson);

  } catch (error) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to complete analysis' }, { status: 500 });
  }
}
