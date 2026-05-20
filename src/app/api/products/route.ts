import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

    if (!domain || !token) {
      return NextResponse.json({ error: 'Missing Shopify credentials' }, { status: 500 });
    }

    const shopifyQuery = `
      {
        products(first: 10) {
          edges {
            node {
              id
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
      return NextResponse.json({ error: 'Failed to fetch Shopify data' }, { status: 400 });
    }

    const products = rawShopifyData.data?.products?.edges.map((e: any) => e.node) || [];
    return NextResponse.json({ products });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
