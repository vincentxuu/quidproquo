> **Status: Fully planned, gated change** — proposal, design, specs, and tasks are present. Implementation remains blocked until `agent-foundation` and `agent-os` are merged, deployed, and stable in production.

## Why

Agents need to call many kinds of external services (LLM, search, reader, knowledge, action), each with its own auth, quota, latency, and failure modes. Without a provider router, every agent re-wires credentials and fallback chains; cost is invisible across providers; swapping `tavily → exa` requires editing agent code. The Gateway Console plan (§4.5) makes provider routing a first-class layer; this change implements it on top of the `agent-os` tool ABI.

## What Changes

- Add a provider registry under `src/lib/agent-providers/` covering five provider categories: **LLM** (OpenAI, Anthropic, Gemini, OpenRouter), **Search** (Tavily, Exa, Jina Search), **Reader** (Jina Reader, Firecrawl, browser, direct fetch), **Knowledge** (Notion, GitHub, Drive, SQL — full read + write), **Action** (GitHub issue/comment, Slack message, Notion page, email send — all gated behind `agent-access` approval flags)
- Each provider implements a typed capability contract; the router exposes them as MCP-compatible syscalls via the kernel's tool registry (`agent-tools`)
- **Credential storage** uses kernel `agent-storage` (encrypted at rest); no provider key lives in agent code
- **Fallback chains** declared per provider category (e.g. `search.order: [tavily, exa, jina]`); router auto-falls-back on failure or quota exhaustion
- **Cost + latency + success-rate tracking** per provider — feeds the kernel `ProviderCall` table for cross-agent dashboards
- Health checks + provider capability discovery; admin UI surfaces "which providers are healthy right now"
- **Load balancing** across healthy providers in a category (weighted by latency / cost / success rate), with declared fallback when a provider degrades
- **OAuth + API-key + service-account** credential types; per-credential scope and expiry tracking

## Capabilities

### New Capabilities

- `provider-registry`: Typed registry of LLM / Search / Reader / Knowledge / Action providers, exposed to agents through MCP-compatible syscalls
- `provider-credentials`: Encrypted credential storage (uses kernel `agent-storage`); per-agent grant integration with `agent-access`
- `provider-routing`: Declarative fallback chains, health checks, per-category routing rules, cost/latency/success-rate telemetry

## Dependencies

- `agent-os` (this change wraps the kernel's tool ABI; uses storage + access)

## References

- `/Users/xiaoxu/Projects/reseacher/feature/agent-gateway-console-plan.md` §4.5 Provider Router
- `/Users/xiaoxu/Projects/ai/2026-05-14_12-04_agent-workflow-trends.md` finding 8 (provider abstraction / MCP / connector ecosystem)
