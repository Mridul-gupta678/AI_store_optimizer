import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();
    const groqKey = process.env.GROQ_API_KEY;

    if (!domain) {
      return NextResponse.json({ error: 'Missing Shopify domain' }, { status: 400 });
    }

    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

    // 1. Fetch Real Store Data from Public Shopify API
    const shopifyResponse = await fetch(`https://${cleanDomain}/products.json?limit=250`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!shopifyResponse.ok) {
      return NextResponse.json({ 
        error: 'Failed to connect to public Shopify API'
      }, { status: 500 });
    }

    const shopData = await shopifyResponse.json();
    const products = shopData.products || [];

    return NextResponse.json({
      success: true,
      store: {
        name: cleanDomain.split('.')[0].toUpperCase(),
        domain: cleanDomain,
        email: "contact@" + cleanDomain,
        currency: "USD",
        plan: "Public Access",
        country: "Global",
        productCount: products.length >= 250 ? "250+" : products.length
      },
      engines: {
        shopifyApi: 'Connected (Public)',
        llamaEngine: groqKey ? 'Standby' : 'Offline'
      }
    });

  } catch (error) {
    console.error('System API Error:', error);
    return NextResponse.json({ error: 'Failed to verify system status' }, { status: 500 });
  }
}
