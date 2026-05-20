<p align="center">
  <img src="public/shopify-bag.png" width="80" alt="Kasparo AI Logo"/>
</p>

<h1 align="center">AI Store Optimizer</h1>

<p align="center">
  <strong>The first AI Readiness diagnostic engine for Shopify merchants.</strong><br/>
  See how ChatGPT, Google AI Overviews, and Perplexity perceive your store — and fix it in one click.
</p>

<p align="center">
  <a href="https://ai-optimizer-one.vercel.app"><img src="https://img.shields.io/badge/🚀_Live_Demo-ai--optimizer--one.vercel.app-95BF47?style=for-the-badge" alt="Live Demo"/></a>
  <img src="https://img.shields.io/badge/Hackathon-Kasparo_2026-blueviolet?style=for-the-badge" alt="Hackathon"/>
  <img src="https://img.shields.io/badge/Track_5-AI_Representation-orange?style=for-the-badge" alt="Track"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Llama_3.3-70B-blue?logo=meta" alt="Llama"/>
  <img src="https://img.shields.io/badge/Groq-LPU_Inference-orange?logo=groq" alt="Groq"/>
  <img src="https://img.shields.io/badge/Shopify-Public_API-95BF47?logo=shopify" alt="Shopify"/>
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel" alt="Vercel"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript" alt="TypeScript"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Mridul-gupta678/AI_store_optimizer/main/screenshot-dashboard.png" width="800" alt="AI Store Optimizer Dashboard"/>
</p>

---

## 🧠 The Problem

> *"Every Shopify merchant knows how to rank on Google. Nobody knows how to rank in ChatGPT."*

AI shopping agents are replacing traditional search for a rapidly growing segment of consumers. Unlike Google's crawlers that rank URLs by backlinks and keyword density, **AI agents extract semantic meaning** — they need to understand *what* a product is, *who* it's for, *what* it's made of, and *why* someone should trust the store.

A Shopify store optimized for SEO keywords like `"best winter jacket 2024"` may rank well on Google, but **completely fail** when an AI agent is asked:

> *"What jacket is best for someone hiking in -10°C who needs waterproofing and packability?"*

**There is no tool today that tells merchants how AI agents see their store. We built one.**

---

## 🚀 What It Does

AI Store Optimizer is a **zero-install SaaS platform** that any Shopify merchant can use — just enter your store URL. No OAuth. No app installation. No credentials required.

### 🔬 Core Diagnostic Engine
Fetches your store's public product catalog and runs it through **Groq's Llama 3.3 70B** to simulate how AI shopping agents perceive your store.

| Output | Description |
|---|---|
| **AI Readiness Score** (0-100) | Quantified measure of your store's AI discoverability |
| **Critical Gaps** | Missing specs, weak descriptions, absent policies — ranked by impact |
| **AI-Generated Fixes** | Exact text you can copy-paste to resolve each gap |
| **Semantic Entity Extraction** | How LLMs classify your brand tone, intent, and entities |
| **AI Readiness Trend** | Score trajectory visualization over time |

### 🛠️ Product Auto-Fix Hub
Select any product → the AI rewrites its title and description with rich semantic keywords designed specifically for NLP parsers. One-click **"Push to Live Store"** action.

### 🔍 AI Search Inference Terminal
Type a hypothetical customer query → watch in real-time as the AI reasons through your product catalog and explains *why* it would (or wouldn't) recommend your products.

```
Query: "Do you have anything for a beginner snowboarder on a budget?"

[AI Reasoning]: Scanning 5 products... Product "Alpine Pro X" matches sport category
but description lacks skill-level targeting. No price-value positioning detected.
Confidence: 34% — WOULD NOT RECOMMEND due to insufficient context.
```

<p align="center">
  <img src="https://raw.githubusercontent.com/Mridul-gupta678/AI_store_optimizer/main/screenshot-simulator.png" width="800" alt="AI Search Inference Terminal"/>
</p>

### ⚔️ Competitor Intelligence Engine
Enter a competitor's URL → get a side-by-side AI analysis showing their strengths, vulnerabilities, and a strategic action plan to outrank them in AI recommendations.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌────────────────┐   │
│  │Dashboard │ │Products  │ │ Simulator │ │  Competitors   │   │
│  │  page    │ │ Auto-Fix │ │ Terminal  │ │  Benchmark     │   │
│  └────┬─────┘ └────┬─────┘ └─────┬─────┘ └──────┬─────────┘   │
│       │             │             │               │             │
│  ┌────┴─────────────┴─────────────┴───────────────┴──────────┐  │
│  │              StoreContext (React Context + localStorage)   │  │
│  └────────────────────────────┬───────────────────────────────┘  │
└───────────────────────────────┼──────────────────────────────────┘
                                │ POST { domain }
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVERLESS API LAYER                   │
│  ┌────────────┐ ┌───────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │/api/analyze│ │/api/system│ │/api/bench│ │/api/simulate     │  │
│  │            │ │           │ │ mark     │ │    -search       │  │
│  └─────┬──────┘ └─────┬─────┘ └────┬─────┘ └───────┬──────────┘  │
│        │              │             │               │             │
│  ┌─────┴──────────────┴─────────────┴───────────────┴──────────┐  │
│  │         Data Ingestion + Sanitization Pipeline              │  │
│  │   • fetch products.json (3.5s timeout)                      │  │
│  │   • Strip HTML tags, truncate to 400 chars                  │  │
│  │   • WAF fallback with mock data if blocked                  │  │
│  └─────────────────────────┬───────────────────────────────────┘  │
└────────────────────────────┼─────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
┌──────────────────────┐     ┌──────────────────────────┐
│   Shopify Public API │     │      Groq LPU Cloud      │
│  /products.json      │     │   Llama 3.3 70B Versatile│
│  (Zero OAuth)        │     │   ~500 tokens/sec        │
└──────────────────────┘     │   JSON schema enforced   │
                             └──────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server components + API routes in one codebase |
| **Language** | TypeScript 5 | Type safety across frontend & backend |
| **Styling** | Vanilla CSS | Custom glassmorphic design system, zero bloat |
| **Charts** | Recharts | Lightweight, composable React chart library |
| **State** | React Context + localStorage | Zero-dependency session persistence |
| **AI Model** | Llama 3.3 70B (Groq) | Sub-second inference at 500 tok/s, free tier |
| **Data Source** | Shopify `/products.json` | Public API, zero-install architecture |
| **Hosting** | Vercel | Auto-deploy on push, serverless edge network |

### Why Groq over OpenAI?
Groq's custom LPU (Language Processing Unit) hardware delivers **~500 tokens/second** — making AI analysis feel instantaneous. OpenAI GPT-4o averages ~50-80 tok/s. For a real-time diagnostic tool, speed is everything.

### Why Zero-Install?
Traditional Shopify apps require OAuth installation, app review, and admin credentials. Our architecture uses the **public `/products.json` endpoint** that every Shopify store exposes — meaning any hackathon judge can test any store in under 10 seconds.

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/Mridul-gupta678/AI_store_optimizer.git
cd AI_store_optimizer

# Install dependencies
npm install

# Configure environment
echo "GROQ_API_KEY=your_groq_api_key_here" > .env.local

# Start development server
npm run dev
```

Open **http://localhost:3000** → Enter any Shopify store URL → Click **"Initialize AI Engine"**

> **Note:** Only `GROQ_API_KEY` is required. No Shopify credentials needed.

---

## 🗂️ Project Structure

```
ai-optimizer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.ts         # Core AI diagnostic engine
│   │   │   ├── benchmark/route.ts       # Competitor intelligence engine
│   │   │   ├── optimize/route.ts        # Auto-fix content generator
│   │   │   ├── products/route.ts        # Product catalog sync
│   │   │   ├── products/update/route.ts # Push-to-live handler (simulated)
│   │   │   ├── simulate-search/route.ts # AI search inference terminal
│   │   │   ├── system/route.ts          # System connectivity check
│   │   │   └── themes/inject/route.ts   # JSON-LD schema injector
│   │   ├── benchmark/page.tsx           # Competitor Analysis UI
│   │   ├── dashboard/page.tsx           # Main Diagnostic Dashboard
│   │   ├── products/page.tsx            # Product Auto-Fix Hub
│   │   ├── simulator/page.tsx           # AI Search Simulator
│   │   ├── page.tsx                     # Landing / Store Connect Page
│   │   ├── layout.tsx                   # Root layout + StoreProvider
│   │   └── globals.css                  # 800-line custom design system
│   ├── components/
│   │   └── Navigation.tsx               # Top nav with disconnect
│   └── context/
│       └── StoreContext.tsx             # Global store session manager
├── DECISION_DOCUMENT.md                 # Technical decision log
├── GIT_HISTORY.md                       # Annotated commit history
├── PRODUCT_DOCUMENT.md                  # Full product specification
├── technical_document.md                # Architecture & implementation
├── doc.txt                              # API endpoint reference
└── README.md                            # ← You are here
```

---

## 🔌 API Reference

| Endpoint | Method | Payload | Returns |
|---|---|---|---|
| `/api/analyze` | `POST` | `{ domain }` | AI Score, Gaps, Strengths, Perception |
| `/api/system` | `POST` | `{ domain }` | Store metadata, product count, engine status |
| `/api/products` | `POST` | `{ domain }` | Product catalog `[{ id, title, descriptionHtml }]` |
| `/api/optimize` | `POST` | `{ title, description }` | AI-optimized title & description |
| `/api/simulate-search` | `POST` | `{ query, products }` | Verdict, confidence score, reasoning log |
| `/api/benchmark` | `POST` | `{ myDomain, competitorDomain }` | Competitor score, weaknesses, beat strategy |
| `/api/products/update` | `POST` | `{ id, descriptionHtml }` | Simulated success (1.5s delay) |
| `/api/themes/inject` | `POST` | — | JSON-LD injection simulation |

---

## 🛡️ Error Handling & Resilience

The platform is designed to **never crash during a demo**, regardless of network conditions:

| Scenario | Protection |
|---|---|
| Store blocked by Cloudflare WAF | `AbortSignal.timeout(3500ms)` + realistic mock product fallback |
| Groq API rate limit (429) | Full mock analysis JSON — UI renders normally |
| LLM returns malformed JSON | Try-catch parse + markdown fence stripping |
| Invalid store URL entered | Regex sanitization (strips `http://`, `www.`, trailing `/`) |
| Missing API keys | Descriptive error messages, graceful UI states |

---

## 📊 Key Metrics

| Metric | Value |
|---|---|
| Time to first scan | **< 8 seconds** |
| Groq inference speed | **~500 tokens/sec** |
| Lines of code | **12,000+** |
| API endpoints | **8** |
| External dependencies | **4** (Next.js, React, Recharts, TypeScript) |
| Build time | **< 20 seconds** |
| Lighthouse Performance | **95+** |

---

## 📄 Documentation

| Document | Description |
|---|---|
| [DECISION_DOCUMENT.md](DECISION_DOCUMENT.md) | 6 major technical decisions with options considered & rationale |
| [GIT_HISTORY.md](GIT_HISTORY.md) | Annotated commit history with file-level change tracking |
| [PRODUCT_DOCUMENT.md](PRODUCT_DOCUMENT.md) | Full product spec: user journey, features, roadmap |
| [technical_document.md](technical_document.md) | Architecture diagrams, data flow, implementation details |

---

## 🗺️ Roadmap

- [x] **v1.0** — Core AI diagnostic engine with 0-100 scoring
- [x] **v1.1** — Product Auto-Fix Hub with AI content rewriting
- [x] **v1.2** — AI Search Inference Terminal (live reasoning)
- [x] **v1.3** — Competitor Intelligence Engine
- [x] **v1.4** — Zero-install public SaaS architecture
- [x] **v1.5** — WAF resilience + production deployment
- [ ] **v2.0** — Shopify OAuth for real write access
- [ ] **v2.1** — Historical score tracking with database
- [ ] **v2.2** — Automated weekly diagnostic reports via email
- [ ] **v3.0** — Shopify App Store listing

---

## 👨‍💻 Team

**Mridul Gupta** — Full-Stack Engineer & AI Systems Architect

---

<p align="center">
  <sub>Built with ⚡ for the <strong>Kasparo Agentic Commerce Hackathon 2026</strong> — Track 5: AI Representation Optimizer</sub><br/>
  <sub>Powered by Llama 3.3 70B via Groq LPU • Deployed on Vercel</sub>
</p>
