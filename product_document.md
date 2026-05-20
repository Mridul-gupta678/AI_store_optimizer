# Product Document - AI Representation Optimizer

## 1. Target User & Why This Product Matters

**Target User:** Shopify Store Owners and E-commerce Managers who want their products to be discoverable and accurately represented by AI shopping agents.

**Why it matters:** Shopping is shifting from "search and browse" to "ask and decide." In 2025-2026, ChatGPT started completing purchases inside conversations. Google AI Mode began recommending products directly in search. A store's visibility now depends entirely on how AI interprets its data.

Currently, merchants have **zero visibility** into how AI agents perceive their store. If their product descriptions are vague, their store description is missing, or their policies are contradictory, the AI will either skip them entirely or confidently misrepresent them. This tool provides that critical diagnostic layer — think of it as "Google Search Console, but for AI shopping agents."

## 2. Core User Journey

1. **Connect:** The merchant's Shopify store is connected via Admin API credentials (Custom App with read-only permissions).
2. **Scan:** One click triggers a full diagnostic scan. The system pulls real store data (products, descriptions, store info) via Shopify's GraphQL API.
3. **AI Simulation:** The data is fed to Llama 3.3 70B (via Groq), which role-plays as an AI shopping agent evaluating the store for trust, clarity, and completeness.
4. **Diagnostic Dashboard:** The merchant sees their **AI Readiness Score** (0-100) with prioritized gaps ranked by impact (High/Medium/Low).
5. **Action:** For each gap, the tool provides an **AI-generated suggested fix** — exact text the merchant can copy and paste into their Shopify admin to resolve the issue.

## 3. What We Specifically Decided NOT to Build

- **A Customer-Facing Chatbot:** The hackathon prompt explicitly warns against building simple FAQ wrappers or generic chatbots. This is a *merchant-facing* diagnostic tool, not a B2C assistant.
- **Automated Store Updates:** While technically feasible via the Admin API with write permissions, automatically overwriting merchant content without review is risky. We provide suggestions and easy copy-paste, but leave final publishing to the merchant for brand safety.
- **Full SEO Optimization:** We are not optimizing for traditional Google Search ranking. We specifically optimize for LLM interpretation — how AI agents read, understand, and recommend products.
- **Multi-store Dashboard:** We focused on doing one store analysis extremely well rather than building a multi-tenant SaaS platform for the hackathon scope.

## 4. Edge Cases Encountered & Resolved

- **Edge Case 1: Empty Store Description.** Many Shopify stores (including development stores) have no store description set. The AI correctly flags this as a "High Impact" gap because AI agents rely on it to understand what the store sells. We handle this by passing "N/A" to the AI when the field is empty.

- **Edge Case 2: HTML in Product Descriptions.** Shopify returns product descriptions as raw HTML (`descriptionHtml`). Rather than stripping tags before sending to the AI, we pass the raw HTML to let the LLM evaluate the actual content quality, including whether the merchant is using proper formatting, headers, and structured content.

- **Edge Case 3: Gemini API Quota Exhaustion.** Our initial implementation used Google Gemini, but we hit a `limit: 0` free tier quota issue. Rather than being blocked, we pivoted to Groq (Llama 3.3 70B) which has a much more generous free tier. This pivot took under 30 minutes because our code was well-abstracted.

- **Edge Case 4: LLM Returning Markdown-Wrapped JSON.** Even with explicit "no markdown" instructions in the prompt, LLMs occasionally wrap their JSON response in ` ```json ``` ` code blocks. We handle this by stripping markdown fences before `JSON.parse()`.

- **Edge Case 5: Products with No Description.** Some products in development stores have completely empty descriptions. The AI correctly identifies these and provides specific, actionable text the merchant can add.

## 5. Key Product Decisions

| Decision | What We Chose | Why |
|---|---|---|
| Impact Labels | High / Medium / Low | Merchants are busy — they need to know what to fix first |
| Suggested Fixes | Exact copy-paste text | Reduces friction to zero — merchant doesn't need to think about wording |
| Score Range | 0-100 | Universal, intuitive. Below 50 = urgent. Above 80 = good |
| Scan Trigger | Manual "Run Scan" button | Gives merchant control; avoids surprise API costs |
| Read-Only API Access | Only `read_products`, `read_content` scopes | Builds trust — we never modify merchant data |
