import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

    if (!domain || !token) {
      return NextResponse.json({ error: 'Missing Shopify credentials' }, { status: 500 });
    }

    const apiUrl = `https://${domain}/admin/api/2024-04`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    };

    // 1. Get the main published theme
    const themesRes = await fetch(`${apiUrl}/themes.json`, { headers });
    const themesData = await themesRes.json();
    
    if (themesData.errors) {
      return NextResponse.json({ error: 'Failed to access themes. Ensure read_themes and write_themes are enabled.' }, { status: 400 });
    }

    const activeTheme = themesData.themes?.find((t: any) => t.role === 'main');
    if (!activeTheme) {
      return NextResponse.json({ error: 'No active theme found.' }, { status: 404 });
    }

    const themeId = activeTheme.id;

    // 2. Create the kasparo-ai-seo.liquid snippet
    const snippetContent = `
<!-- KASPARO AI SEO INJECTION -->
<script type="application/ld+json">
{
  "@context": "http://schema.org",
  "@type": "WebSite",
  "name": "{{ shop.name }}",
  "url": "{{ shop.url }}",
  "description": "{{ shop.description | escape }}"
}
</script>

{% if template contains 'product' %}
<script type="application/ld+json">
{
  "@context": "http://schema.org",
  "@type": "Product",
  "name": "{{ product.title | escape }}",
  "description": "{{ product.description | strip_html | escape }}",
  "image": [
    {% for image in product.images %}
      "https:{{ image.src | img_url: 'master' }}"{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ],
  "offers": {
    "@type": "Offer",
    "priceCurrency": "{{ cart.currency.iso_code }}",
    "price": "{{ product.price | divided_by: 100.0 }}",
    "availability": "http://schema.org/{% if product.available %}InStock{% else %}OutOfStock{% endif %}",
    "url": "{{ shop.url }}{{ product.url }}"
  }
}
</script>
{% endif %}
<!-- END KASPARO AI SEO -->
    `.trim();

    const createSnippetRes = await fetch(`${apiUrl}/themes/${themeId}/assets.json`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        asset: {
          key: 'snippets/kasparo-ai-seo.liquid',
          value: snippetContent
        }
      })
    });

    const snippetData = await createSnippetRes.json();
    if (snippetData.errors) {
      throw new Error('Failed to create snippet');
    }

    // 3. Fetch layout/theme.liquid
    const getThemeRes = await fetch(`${apiUrl}/themes/${themeId}/assets.json?asset[key]=layout/theme.liquid`, { headers });
    const getThemeData = await getThemeRes.json();
    let themeLiquid = getThemeData.asset?.value;

    if (!themeLiquid) {
      throw new Error('Could not read theme.liquid');
    }

    // 4. Inject snippet if not already there
    const injectTag = "{% render 'kasparo-ai-seo' %}";
    if (!themeLiquid.includes(injectTag)) {
      // Find the closing </head> tag and insert right before it
      themeLiquid = themeLiquid.replace('</head>', `\n  ${injectTag}\n</head>`);
      
      const updateThemeRes = await fetch(`${apiUrl}/themes/${themeId}/assets.json`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          asset: {
            key: 'layout/theme.liquid',
            value: themeLiquid
          }
        })
      });

      const updateThemeData = await updateThemeRes.json();
      if (updateThemeData.errors) {
        throw new Error('Failed to update theme.liquid');
      }
    }

    return NextResponse.json({ success: true, message: 'AI SEO Schema successfully injected into active theme!' });

  } catch (error: any) {
    console.error('Theme Injection Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to inject AI code' }, { status: 500 });
  }
}
