# Thinking Log - Kasparo Hackathon (Track 5)

This log documents our key engineering and product decisions throughout the development of the AI Representation Optimizer.

## Decision 1: Tech Stack Selection
* **Chose:** Next.js 16 (App Router) + Vanilla CSS
* **Because:** Next.js API Routes let us securely call external APIs (Shopify, LLM) server-side without exposing keys to the browser. We avoided Tailwind CSS to build a unique, premium SaaS aesthetic — judges will see dozens of Tailwind apps, ours stands out.

## Decision 2: Clean Slate Approach
* **Chose:** Delete existing codebase and start fresh.
* **Because:** The previous attempt was misaligned with hackathon guidelines. Starting fresh ensures every file serves Track 5's specific goal and maintains a clean git history with atomic commits.

## Decision 3: Connecting to Shopify Dev Store
* **Chose:** Shopify Partner Development Store.
* **Because:** Guidelines explicitly recommend this approach. It gives us real API endpoints with actual product data, avoiding the complexity of production OAuth while still demonstrating genuine Shopify integration.

## Decision 4: Read-Only API Permissions
* **Chose:** Only request `read_products`, `read_content`, `read_publications`, `read_orders` scopes.
* **Because:** Our tool is diagnostic-only — it analyzes and reports, never modifies. Requesting minimal permissions builds merchant trust and aligns with the principle of least privilege.

## Decision 5: Gemini → Groq Pivot
* **Chose:** Switched from Google Gemini to Groq (Llama 3.3 70B).
* **Because:** Hit persistent `limit: 0` quota on Gemini free tier despite creating new projects and enabling APIs. Groq offers 30 req/min free tier with sub-second inference. The pivot took ~30 minutes because our API integration was well-abstracted (just swapping the fetch URL and model name).
* **Trade-off:** Groq uses Llama (open-source) instead of Gemini (proprietary). For our use case, Llama 3.3 70B produces equally strong structured JSON analysis.

## Decision 6: Structured JSON Prompting
* **Chose:** Force the LLM to respond in strict JSON with a defined schema (score, gaps, fixes).
* **Because:** Freeform text responses would require complex parsing and make the UI unpredictable. By enforcing JSON, we get deterministic, machine-readable output that maps directly to UI components. We set temperature to 0.3 for consistency.

## Decision 7: Impact-Based Prioritization
* **Chose:** Categorize gaps as High/Medium/Low impact instead of a flat list.
* **Because:** The hackathon guidelines specifically say "not just a list, but prioritized." Merchants are busy — they need to know what to fix first. High-impact gaps (missing descriptions, empty store info) get visual prominence with red borders and large labels.

## Decision 8: No Dual-Engine Fallback
* **Chose:** Single clean Groq integration without a local fallback engine.
* **Because:** We initially built a dual-engine approach (AI + rule-based fallback) when Gemini was failing. Once Groq proved reliable, we removed the fallback to keep the codebase clean and the architecture honest. A rule-based fallback would undermine the "AI-powered" value proposition.

## Decision 9: GraphQL Over REST
* **Chose:** Shopify Admin GraphQL API instead of REST API.
* **Because:** A single GraphQL query fetches shop info + 5 products in one request. The equivalent REST approach would need 2+ separate API calls, increasing latency and complexity.

## Decision 10: Manual Scan Trigger
* **Chose:** A "Run Scan" button instead of auto-scanning on page load.
* **Because:** Auto-scanning would fire API calls every time the merchant refreshes the page, burning through rate limits. A manual trigger gives merchants control and makes the experience intentional.
