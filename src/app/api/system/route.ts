import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    const groqKey = process.env.GROQ_API_KEY;

    // 1. Verify Environment Variables
    const envStatus = {
      shopifyDomain: !!domain,
      shopifyToken: !!token,
      groqKey: !!groqKey
    };

    if (!domain || !token) {
      return NextResponse.json({ 
        error: 'Missing Shopify credentials', 
        status: envStatus 
      }, { status: 500 });
    }

    // 2. Fetch Real Store Data from Shopify
    const shopifyResponse = await fetch(`https://${domain}/admin/api/2024-04/shop.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      }
    });

    if (!shopifyResponse.ok) {
      return NextResponse.json({ 
        error: 'Failed to connect to Shopify API',
        status: envStatus
      }, { status: 500 });
    }

    const shopData = await shopifyResponse.json();
    const shop = shopData.shop;

    // 3. Fetch product count
    let productCount = 0;
    try {
      const countRes = await fetch(`https://${domain}/admin/api/2024-04/products/count.json`, {
        headers: { 'X-Shopify-Access-Token': token }
      });
      if (countRes.ok) {
        const countData = await countRes.json();
        productCount = countData.count;
      }
    } catch (e) { /* ignore */ }

    return NextResponse.json({
      success: true,
      store: {
        name: shop.name,
        domain: shop.domain,
        email: shop.email,
        currency: shop.currency,
        plan: shop.plan_display_name,
        country: shop.country_name,
        productCount
      },
      engines: {
        shopifyApi: 'Connected',
        llamaEngine: groqKey ? 'Standby' : 'Offline'
      }
    });

  } catch (error) {
    console.error('System API Error:', error);
    return NextResponse.json({ error: 'Failed to verify system status' }, { status: 500 });
  }
}
