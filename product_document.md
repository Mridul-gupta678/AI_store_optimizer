# PRODUCT DOCUMENT
## AI Store Optimizer — Kasparo Hackathon 2026

**Product Name:** AI Store Optimizer (by Kasparo AI)
**Version:** 1.0.0
**Live URL:** https://ai-optimizer-one.vercel.app
**GitHub:** https://github.com/Mridul-gupta678/AI_store_optimizer
**Hackathon Track:** Track 5 — AI Representation Optimizer
**Team:** Mridul Gupta

---

## 1. PRODUCT VISION

> "Every Shopify merchant knows how to rank on Google. Nobody knows how to rank in ChatGPT. We fix that."

The AI Store Optimizer is a zero-install SaaS platform that gives Shopify merchants their first-ever "AI Readiness Score" — a quantified measure of how visible, trustworthy, and recommendable their store is to conversational AI shopping agents like ChatGPT, Google AI Overviews, and Perplexity.

---

## 2. THE PROBLEM

### The Invisible Crisis
AI-powered shopping agents are replacing traditional search for a growing segment of consumers. Unlike Google's crawlers that rank URLs, AI agents extract semantic meaning, entity relationships, and contextual intent from raw text.

A store optimized for SEO keywords like "best winter jacket 2024" may score well on Google, but fail to answer an AI agent's question: "What jacket is best for someone hiking in -10°C who needs waterproofing and packability?"

### Why Merchants Are Blind to This
- No tool exists today that simulates how an AI agent reads a Shopify store.
- Merchants receive zero feedback on product description quality from AI's perspective.
- Traditional SEO auditors (SEMrush, Ahrefs) analyze backlinks and keyword density — not semantic richness.

---

## 3. THE SOLUTION

The AI Store Optimizer provides four interconnected diagnostic and repair tools:

### 3.1 Core Diagnostic Engine (Dashboard)
**What it does:** Fetches the store's public product catalog and passes it through Groq's Llama 3.3 70B model to simulate how an AI shopping agent would perceive the store.

**Outputs:**
- **AI Readiness Score (0-100):** A quantified assessment of the store's AI-discoverability.
- **Overall Perception Summary:** A 2-3 sentence natural language verdict from the AI's perspective.
- **Critical Gaps:** A ranked list of specific missing data points (e.g., "Missing Material Composition", "No Return Policy Detected") with an exact suggested fix for each.
- **Identified Strengths:** What the AI agent CAN understand and recommend about the store.
- **AI Readiness Trend Chart:** A Recharts area chart visualizing the score trajectory.
- **Semantic & Entity Extraction Panel:** A simulation of how LLMs extract brand tone, core entities, and intent classification from the store's text.

---

### 3.2 Product Auto-Fix Hub (Products Page)
**What it does:** Displays all products fetched from the connected store. For each product, the merchant can trigger an AI-powered content rewrite to generate optimized titles and descriptions.

**Outputs:**
- **Optimized Title:** A semantically rich title with natural language keywords.
- **Optimized Description:** A comprehensive product description with materials, use cases, sizing, and target audience.
- **AI Readability Score:** A sub-score for the individual product.
- **Quality Gap Tags:** Specific missing elements identified in the original description.
- **Misrepresentation Risk Tags:** Areas where the current description could cause an AI to make a wrong recommendation.
- **"Push to Live Store" Action:** Demonstrates the workflow of publishing the AI-optimized content.

---

### 3.3 AI Search Inference Terminal (Simulator)
**What it does:** Allows the merchant to type a hypothetical customer search query and see in real-time which of their products an AI agent would recommend — and, critically, WHY.

**User Input:** Natural language query (e.g., "Do you have anything for a beginner snowboarder on a budget?")

**Outputs:**
- **Overall Verdict:** Would the AI confidently recommend a product?
- **Confidence Score (0-100):** How certain the AI is in its recommendation.
- **Detailed Reasoning Log:** A live typewriter display of the AI's chain-of-thought, explaining which product it selected, why others were rejected, and what missing information lowered its confidence.

---

### 3.4 Competitor Intelligence Engine (Competitors Page)
**What it does:** Fetches a competitor's public Shopify catalog and runs a side-by-side AI analysis, comparing their AI readiness against the user's connected store.

**User Input:** Competitor's store domain (e.g., `competitor-brand.com`)

**Outputs:**
- **Competitor AI Score (0-100):** The competitor's AI readiness rating.
- **Competitor Strengths:** What the competitor does well that AI agents appreciate.
- **Competitor Weaknesses/Vulnerabilities:** Where the competitor's catalog is semantically weak.
- **Strategic Beat Plan:** An AI-generated action plan on exactly how to outperform the competitor in AI-driven recommendations.

---

## 4. USER JOURNEY

```
1. USER ARRIVES at https://ai-optimizer-one.vercel.app
        ↓
2. USER ENTERS their Shopify store URL (e.g., "allbirds.com")
        ↓
3. SYSTEM VERIFIES connectivity and loads the store session
        ↓
4. USER IS REDIRECTED to the Dashboard
        ↓
5. USER CLICKS "Initiate System Scan"
        ↓
6. AI ENGINE fetches products → cleans data → runs Llama 3 inference
        ↓
7. DASHBOARD RENDERS: AI Score + Critical Gaps + Strengths + Trend Chart
        ↓
8. USER NAVIGATES to Products Tab → selects a weak product → runs Auto-Fix
        ↓
9. AI GENERATES optimized title and description → user pushes live
        ↓
10. USER NAVIGATES to Simulator → tests how AI handles their best products
        ↓
11. USER NAVIGATES to Competitors → enters a rival brand → sees strategic gap analysis
        ↓
12. USER CLICKS "Disconnect" → returns to landing page
```

---

## 5. TECHNICAL ARCHITECTURE

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS (Custom Glassmorphic Design System) |
| Charts | Recharts (AreaChart) |
| State Management | React Context API + localStorage |
| Routing | Next.js File-based Routing |

### Backend
| Layer | Technology |
|---|---|
| API Routes | Next.js Serverless Functions |
| AI Model | Llama 3.3 70B Versatile (via Groq API) |
| Data Source | Shopify Public JSON (`/products.json`) |
| Response Format | Strict JSON schema enforcement via `response_format: json_object` |

### Infrastructure
| Layer | Technology |
|---|---|
| Hosting | Vercel (Serverless, Edge Network) |
| CI/CD | Auto-deploy on git push to main branch |
| Environment Secrets | Vercel Project Settings (GROQ_API_KEY) |
| Repository | GitHub (Public) |

---

## 6. API ENDPOINTS REFERENCE

| Endpoint | Method | Input | Output |
|---|---|---|---|
| `/api/analyze` | POST | `{ domain }` | AI Score, Gaps, Strengths |
| `/api/system` | POST | `{ domain }` | Store metadata, product count |
| `/api/products` | POST | `{ domain }` | Product catalog array |
| `/api/products/update` | POST | `{ id, descriptionHtml }` | Success simulation |
| `/api/optimize` | POST | `{ title, description }` | AI-optimized content |
| `/api/simulate-search` | POST | `{ query, products }` | AI verdict + reasoning |
| `/api/benchmark` | POST | `{ myDomain, competitorDomain }` | Competitor analysis |
| `/api/themes/inject` | POST | — | JSON-LD injection simulation |

---

## 7. KEY DIFFERENTIATORS

| Feature | AI Store Optimizer | SEMrush | Shopify Analytics | Traditional SEO Audits |
|---|---|---|---|---|
| AI Agent Perception Analysis | ✅ | ❌ | ❌ | ❌ |
| Zero-Install (No OAuth) | ✅ | N/A | ❌ (requires install) | N/A |
| Real-time AI Content Rewrite | ✅ | ❌ | ❌ | ❌ |
| AI Search Simulation | ✅ | ❌ | ❌ | ❌ |
| Competitor AI Benchmarking | ✅ | ✅ (SEO only) | ❌ | ❌ |
| Any Public Shopify Store | ✅ | Limited | ❌ | ❌ |
| Groq LPU Inference Speed | ✅ (~500 tok/s) | N/A | N/A | N/A |

---

## 8. CURRENT LIMITATIONS

| Limitation | Reason | Planned Resolution |
|---|---|---|
| Cannot write changes to store | No Shopify OAuth in zero-install mode | Implement Shopify Partner App with OAuth for v2 |
| Enterprise stores blocked by WAF | Cloudflare blocks Vercel's datacenter IPs | Integrate rotating residential proxy (BrightData) |
| Analyzes only first 5-10 products | Prompt token limit management | Implement chunked batch analysis |
| AI Readiness Trend is simulated | No historical data storage | Integrate database (Supabase/PlanetScale) for trend tracking |

---

## 9. FUTURE ROADMAP

### v1.1 — Post-Hackathon
- Real Shopify OAuth integration for actual write access
- Persistent analysis history with trend tracking database
- Email alerts when AI Readiness Score drops

### v2.0 — Growth Phase
- Multi-store management dashboard
- Automated weekly AI diagnostics with email reports
- API for third-party integrations
- Shopify App Store listing

### v3.0 — Enterprise
- Team collaboration features
- Custom AI fine-tuning for specific industries
- Integration with Google Merchant Center

---

## 10. METRICS FOR SUCCESS

| Metric | Hackathon Target | 30-Day Target |
|---|---|---|
| Demo completions | 10+ (judges) | 100+ |
| AI scans run | 20+ | 500+ |
| Stores analyzed | 5+ | 50+ |
| Avg. time-to-value (first scan) | < 30 seconds | < 30 seconds |

---

*Product Document prepared by Mridul Gupta for the Kasparo Hackathon 2026.*
*Last Updated: May 21, 2026*
