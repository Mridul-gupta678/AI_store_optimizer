import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { id, descriptionHtml } = await req.json();
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

    if (!domain || !token) {
      return NextResponse.json({ error: 'Missing Shopify credentials' }, { status: 500 });
    }

    if (!id || !descriptionHtml) {
      return NextResponse.json({ error: 'Product ID and description are required' }, { status: 400 });
    }

    const shopifyMutation = `
      mutation productUpdate($input: ProductInput!) {
        productUpdate(input: $input) {
          product {
            id
            descriptionHtml
          }
          userErrors {
            field
            message
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
      body: JSON.stringify({
        query: shopifyMutation,
        variables: {
          input: {
            id,
            descriptionHtml
          }
        }
      }),
    });

    const rawShopifyData = await shopifyResponse.json();

    if (rawShopifyData.errors || rawShopifyData.data?.productUpdate?.userErrors?.length > 0) {
      console.error("Shopify Update Error:", rawShopifyData);
      return NextResponse.json({ error: 'Failed to update Shopify product. Ensure write_products scope is enabled.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, product: rawShopifyData.data.productUpdate.product });

  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
