import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json({ error: 'Missing Shopify domain' }, { status: 400 });
    }

    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

    const shopifyResponse = await fetch(`https://${cleanDomain}/products.json?limit=10`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    const rawShopifyData = await shopifyResponse.json();

    if (!shopifyResponse.ok || !rawShopifyData.products) {
      return NextResponse.json({ error: 'Failed to fetch public products data' }, { status: 400 });
    }

    const products = rawShopifyData.products.map((p: any) => ({
      id: p.id.toString(),
      title: p.title,
      descriptionHtml: p.body_html || '',
      status: 'ACTIVE'
    }));
    
    return NextResponse.json({ products });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
