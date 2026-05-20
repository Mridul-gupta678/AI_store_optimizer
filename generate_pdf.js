const fs = require('fs');
const path = require('path');

// Read the markdown file
const md = fs.readFileSync('technical_document.md', 'utf-8');

// Convert markdown to styled HTML
function mdToHtml(text) {
  return text
    // Code blocks
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Headers
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Tables - header row
    .replace(/\|---[\|---]*/g, '')
    // Table rows
    .replace(/^\|(.+)\|$/gm, (match, cells) => {
      const tds = cells.split('|').map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${tds}</tr>`;
    })
    // Wrap consecutive <tr> in <table>
    .replace(/((<tr>.*<\/tr>\n?)+)/g, '<table>$1</table>')
    // List items
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/((<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    // Numbered list
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Paragraphs (blank line separation)
    .replace(/\n\n(?!<[htuplc])/g, '</p><p>')
    .replace(/^(?!<[htuplc])(.+)$/gm, (m, p) => p.startsWith('<') ? m : m);
}

const htmlContent = mdToHtml(md);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Technical Document - AI Store Optimizer</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 12px;
    line-height: 1.7;
    color: #1a1a2e;
    padding: 40px 50px;
    max-width: 860px;
    margin: 0 auto;
  }
  h1 {
    font-size: 22px;
    color: #0f3460;
    border-bottom: 3px solid #16213e;
    padding-bottom: 10px;
    margin: 30px 0 16px;
  }
  h2 {
    font-size: 17px;
    color: #16213e;
    border-left: 4px solid #533483;
    padding-left: 10px;
    margin: 24px 0 10px;
  }
  h3 {
    font-size: 14px;
    color: #533483;
    margin: 18px 0 8px;
  }
  p { margin: 8px 0; }
  strong { color: #0f3460; }
  code {
    background: #f0f0f0;
    padding: 1px 5px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 11px;
    color: #c0392b;
  }
  pre {
    background: #1a1a2e;
    color: #e0e0e0;
    padding: 16px;
    border-radius: 8px;
    font-size: 10px;
    overflow-x: auto;
    margin: 12px 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  pre code {
    background: none;
    color: #e0e0e0;
    font-size: 10px;
    padding: 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 11px;
  }
  td, th {
    border: 1px solid #c8c8d4;
    padding: 7px 10px;
    text-align: left;
  }
  tr:first-child td {
    background: #16213e;
    color: #fff;
    font-weight: bold;
  }
  tr:nth-child(even) td { background: #f5f5fa; }
  ul { padding-left: 20px; margin: 8px 0; }
  li { margin: 4px 0; }
  .header-bar {
    background: linear-gradient(135deg, #0f3460, #533483);
    color: white;
    padding: 24px 30px;
    border-radius: 10px;
    margin-bottom: 30px;
  }
  .header-bar h1 {
    color: white;
    border: none;
    font-size: 20px;
    margin: 0 0 6px;
  }
  .header-bar p { color: #ccd0e0; font-size: 11px; margin: 0; }
  .footer {
    border-top: 1px solid #c8c8d4;
    padding-top: 12px;
    margin-top: 40px;
    color: #888;
    font-size: 10px;
    text-align: center;
  }
</style>
</head>
<body>

<div class="header-bar">
  <h1>Technical Document — AI Store Optimizer</h1>
  <p>Kasparo Hackathon 2026 &nbsp;•&nbsp; Track 5: AI Representation Optimizer &nbsp;•&nbsp; Author: Mridul Gupta</p>
</div>

<h2>1. System Architecture</h2>
<p><strong>Overview:</strong> A Next.js 16 (App Router) application serving as both the frontend dashboard and secure backend orchestration layer. The app connects to real Shopify stores via the public <code>/products.json</code> endpoint and uses Groq-hosted Llama 3.3 70B for AI-powered diagnostic analysis.</p>

<p><strong>Why Next.js?</strong> It provides a seamless way to combine secure API integrations (Shopify &amp; Groq) in server-side <code>/api</code> routes with a highly responsive React frontend, avoiding CORS issues and keeping API keys completely hidden from the client. We explicitly used Vanilla CSS (no Tailwind) to build a custom, high-end SaaS design system.</p>

<p><strong>Why Groq + Llama 3.3 70B?</strong> We initially planned to use Google Gemini, but encountered persistent quota restrictions on the free tier. We pivoted to Groq which provides blazing-fast inference (sub-second responses) on the open-source Llama 3.3 70B model, with a generous free tier of 30 requests/minute.</p>

<h3>Data Flow</h3>
<table>
  <tr><td>Step</td><td>Actor</td><td>Action</td></tr>
  <tr><td>1</td><td>Merchant Dashboard</td><td>Clicks "Initiate System Scan" — sends POST /api/analyze with { domain }</td></tr>
  <tr><td>2</td><td>Next.js API Route</td><td>Fetches https://{domain}/products.json with 3.5s timeout</td></tr>
  <tr><td>3</td><td>Shopify Public API</td><td>Returns product catalog JSON (or WAF fallback mock data is used)</td></tr>
  <tr><td>4</td><td>Next.js API Route</td><td>Cleans HTML tags, truncates to 400 chars, structures prompt context</td></tr>
  <tr><td>5</td><td>Groq API (Llama 3.3)</td><td>Returns strict JSON: score, gaps, strengths, overall_perception</td></tr>
  <tr><td>6</td><td>Merchant Dashboard</td><td>Renders AI Readiness Score, Gap Report, Chart, and Recommendations</td></tr>
</table>

<h3>Architecture Overview</h3>
<table>
  <tr><td>Layer</td><td>Technology</td><td>Purpose</td></tr>
  <tr><td>Frontend</td><td>Next.js 14 App Router + React 18</td><td>Dashboard, routing, state management</td></tr>
  <tr><td>Styling</td><td>Vanilla CSS (custom design system)</td><td>Glassmorphic dark theme, bento grid</td></tr>
  <tr><td>Charts</td><td>Recharts AreaChart</td><td>AI Readiness Trend visualization</td></tr>
  <tr><td>State</td><td>React Context + localStorage</td><td>Persistent store domain session</td></tr>
  <tr><td>Backend</td><td>Next.js Serverless API Routes</td><td>Data ingestion, AI orchestration</td></tr>
  <tr><td>AI Model</td><td>Llama 3.3 70B via Groq</td><td>Semantic analysis, content generation</td></tr>
  <tr><td>Data Source</td><td>Shopify /products.json</td><td>Public product catalog (zero OAuth)</td></tr>
  <tr><td>Hosting</td><td>Vercel</td><td>Auto-deploy, serverless edge network</td></tr>
</table>

<h2>2. Core Logic &amp; Implementation Details</h2>

<h3>Data Ingestion Engine</h3>
<ul>
  <li><strong>Endpoint:</strong> Shopify Public JSON API (<code>https://{domain}/products.json</code>)</li>
  <li><strong>Authentication:</strong> None required — public endpoint, zero-install architecture</li>
  <li><strong>Data Fetched:</strong> Up to 5-10 active products (title, HTML body, variants)</li>
  <li><strong>WAF Protection:</strong> Try-catch + <code>AbortSignal.timeout(3500)</code> with realistic mock fallback</li>
</ul>

<h3>AI Perception Engine</h3>
<ul>
  <li><strong>Model:</strong> Llama 3.3 70B Versatile via Groq's OpenAI-compatible API</li>
  <li><strong>Prompt Strategy:</strong> Role-play as an autonomous AI shopping agent evaluating the store for trust, clarity, and completeness</li>
  <li><strong>Temperature:</strong> 0.3 — consistent, deterministic analysis across repeated scans</li>
  <li><strong>Response Format:</strong> <code>response_format: { type: "json_object" }</code> — enforces strict JSON schema</li>
  <li><strong>Token Budget:</strong> 2,000 max output tokens; product descriptions truncated to 400 chars to prevent prompt overflow</li>
</ul>

<h3>Prompt Engineering Details</h3>
<p>The system prompt instructs the LLM to:</p>
<ul>
  <li>Identify missing information that would block AI recommendations</li>
  <li>Flag contradictory or ambiguous data in product listings</li>
  <li>Evaluate trust signals (return policies, material specs, sizing guides)</li>
  <li>Provide actionable suggested fixes with exact text merchants can paste</li>
</ul>

<h2>3. API Endpoints Reference</h2>
<table>
  <tr><td>Endpoint</td><td>Method</td><td>Input</td><td>Output</td></tr>
  <tr><td>/api/analyze</td><td>POST</td><td>{ domain }</td><td>AI Score, Critical Gaps, Strengths</td></tr>
  <tr><td>/api/system</td><td>POST</td><td>{ domain }</td><td>Store metadata, product count</td></tr>
  <tr><td>/api/products</td><td>POST</td><td>{ domain }</td><td>Product catalog array</td></tr>
  <tr><td>/api/products/update</td><td>POST</td><td>{ id, descriptionHtml }</td><td>Success simulation (1.5s delay)</td></tr>
  <tr><td>/api/optimize</td><td>POST</td><td>{ title, description }</td><td>AI-optimized title &amp; description</td></tr>
  <tr><td>/api/simulate-search</td><td>POST</td><td>{ query, products }</td><td>AI verdict + reasoning log</td></tr>
  <tr><td>/api/benchmark</td><td>POST</td><td>{ myDomain, competitorDomain }</td><td>Competitor score + strategy</td></tr>
  <tr><td>/api/themes/inject</td><td>POST</td><td>—</td><td>JSON-LD schema injection simulation</td></tr>
</table>

<h2>4. Error Handling Strategy</h2>
<table>
  <tr><td>Failure Scenario</td><td>How We Handle It</td></tr>
  <tr><td>Store blocked by Cloudflare WAF</td><td>AbortSignal.timeout(3500ms) + try-catch + mock product data fallback</td></tr>
  <tr><td>Groq API rate limit hit (429)</td><td>Full mock analysis JSON returned — UI never crashes</td></tr>
  <tr><td>LLM returns malformed JSON</td><td>JSON.parse in try-catch; markdown fences stripped before parsing</td></tr>
  <tr><td>Missing domain in request</td><td>400 error with descriptive message</td></tr>
  <tr><td>Missing GROQ_API_KEY env var</td><td>500 error with "Missing Groq API key" message</td></tr>
  <tr><td>LLM returns unexpected schema</td><td>Optional chaining + fallback values on frontend</td></tr>
</table>

<h2>5. Limitations &amp; Future Improvements</h2>
<table>
  <tr><td>Current Limitation</td><td>Planned Improvement</td></tr>
  <tr><td>Analysis limited to first 5-10 products</td><td>Chunked batch analysis across full catalog</td></tr>
  <tr><td>Enterprise stores may be blocked by WAF</td><td>Rotating residential proxy integration (BrightData)</td></tr>
  <tr><td>No write access to Shopify stores</td><td>Full Shopify Partner OAuth for v2 production release</td></tr>
  <tr><td>AI Readiness Trend is simulated</td><td>Supabase database for real historical score tracking</td></tr>
  <tr><td>English-only analysis</td><td>Multi-language support via language detection + prompting</td></tr>
  <tr><td>No user authentication</td><td>Shopify App Bridge OAuth for multi-tenant SaaS</td></tr>
</table>

<div class="footer">
  AI Store Optimizer &nbsp;•&nbsp; Kasparo Hackathon 2026 &nbsp;•&nbsp; Mridul Gupta &nbsp;•&nbsp; https://ai-optimizer-one.vercel.app
</div>

</body>
</html>`;

fs.writeFileSync('technical_document.html', html, 'utf-8');
console.log('HTML generated: technical_document.html');
