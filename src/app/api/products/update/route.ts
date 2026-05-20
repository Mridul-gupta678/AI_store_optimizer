import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { id, descriptionHtml } = await req.json();

    if (!id || !descriptionHtml) {
      return NextResponse.json({ error: 'Product ID and description are required' }, { status: 400 });
    }

    // Simulate network delay for the public demo since we don't have OAuth write access
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return a mock success response
    return NextResponse.json({ 
      success: true, 
      product: {
        id,
        descriptionHtml,
        status: "Demo Simulated Write"
      }
    });

  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
