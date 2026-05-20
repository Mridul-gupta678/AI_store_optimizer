# AI Representation Optimizer

> **Kasparo Hackathon — Track 5 (Advanced)**
> A merchant-facing diagnostic tool that helps Shopify stores understand how AI shopping agents perceive and represent them — and take action to improve.

## What It Does

AI shopping agents (ChatGPT, Google AI Overviews) are becoming the primary way consumers discover products. But merchants have **zero visibility** into how these AI agents interpret their store data.

**AI Representation Optimizer** scans a Shopify store's real data via the Admin GraphQL API, feeds it to Llama 3.3 70B (via Groq), and generates:

- **AI Readiness Score** (0-100) — How well AI agents can understand your store
- **Critical Gaps** — Missing descriptions, weak trust signals, incomplete product data (ranked by impact)
- **AI-Generated Fixes** — Exact text merchants can copy-paste to resolve each gap

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 16 (App Router) + Vanilla CSS | Premium SaaS aesthetic, no framework bloat |
| Backend | Next.js API Routes | Server-side API calls, secure key storage |
| Data Source | Shopify Admin GraphQL API (v2024-04) | Real store data from development store |
| AI Engine | Groq API → Llama 3.3 70B | Fast inference, generous free tier |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **"Run Scan"**.

## Environment Variables

```env
GROQ_API_KEY=your_groq_api_key
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_API_ACCESS_TOKEN=shpat_your_token
```

## Project Structure

```
ai-optimizer/
├── src/
│   └── app/
│       ├── api/analyze/route.ts    # Data Ingestion + AI Perception Engine
│       ├── globals.css              # Custom design system (Vanilla CSS)
│       ├── layout.tsx               # Root layout with metadata
│       └── page.tsx                 # Dashboard UI (React client component)
├── product_document.md              # Product thinking & decisions
├── technical_document.md            # Architecture & implementation details
├── thinking_log.md                  # Engineering decision log
└── README.md                        # This file
```

## Hackathon Submission Checklist

- [x] Product Document (PDF/Markdown)
- [x] Technical Document (PDF/Markdown)
- [x] Thinking Log (Markdown in repo)
- [x] GitHub Repository with clean commit history
- [x] README with project overview
- [ ] Demo Video (3-5 min, screen recording with narration)
- [ ] Contribution Note

## Demo Video

> *Link will be added before submission deadline*

## License

Built for the Kasparo Agentic Commerce Hackathon 2026.
