---
title: "Building a Taiwan Stock Research Agent (Part 9): Deployment Boundaries—from Docker to a Public API on Cloudflare Containers"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, cloudflare, containers, docker, deployment, fastapi, observability]
lang: en
tldr: "The full deployment path for a Python agent, from local uv run to Docker to a public API on Cloudflare Containers: the Worker enforces authentication, the Container runs FastAPI, secrets never enter the image, and the service sleeps automatically after 10 idle minutes—the right way for a side project to save money."
description: "The deployment architecture of stock-research-agent: how the Dockerfile is structured, why the Worker rather than the container is the authentication boundary, three-layer secret management, sleep-after and scale-to-zero on Cloudflare Containers, and why the public service deliberately disables the LLM."
draft: false
glossary:
  - term: "timing-safe comparison"
    definition: "A comparison that takes the same amount of time regardless of which bit differs, preventing attackers from inferring the correct token's length or contents from response timing."
  - term: "scale-to-zero"
    definition: "A deployment model that shuts down compute resources when there are no requests, incurs no compute charges while idle, and cold-starts them when a request arrives."
  - term: "healthcheck"
    definition: "A periodic probe sent to a service to confirm that it is alive; a failed check triggers a restart or marks the service unhealthy."
  - term: "binding"
    definition: "Cloudflare Workers' mechanism for attaching services such as KV, D1, Durable Objects, and Containers to the Worker runtime without going over the network and with zero network latency."
---

> 🌏 [中文版](/posts/tech/2026-08-23-stock-agent-9-cloudflare-deployment)

> **Building a Taiwan Stock Research Agent (Part 9 of 9)**: [Previous: The Boundary Between Research and Paper Orders—Content-Addressed Execution Contracts](/posts/tech/2026-08-23-stock-agent-8-execution-contracts-en) ｜ [Full table of contents in Part 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan-en)

The first eight parts took apart what happens *inside* the agent: graph topology, LLM tiers, backtest accountability, citation guards, the copilot loop, and execution contracts. This final part answers one last question: **how can other people use any of it?** From a local `uv run` to Docker and then a public API on Cloudflare Containers, I will explain what each of the three deployment layers solves, where secrets live, why the public service deliberately disables the LLM, and how a side project can spend nothing when nobody is using it.

## Three deployment layers, one codebase

The project supports three ways to run the same FastAPI app (`stock_agent.api:app`):

| Layer | Entry point | Best for | Requirements |
|---|---|---|---|
| Local uv | `uv run stock-agent research 2330` | Development, evaluation, everyday research | Python 3.12 + uv |
| Docker | `docker run -p 8000:8000 stock-research-agent` | Validating the production image locally | Docker |
| Cloudflare Containers | `stock-research-agent.vincent-xu-work.workers.dev` | Public API / interview demo | Cloudflare account + wrangler |

The key point is that all three layers run **the same Python code**. The only differences are who holds the secrets and who enforces authentication.

## Dockerfile: what 24 lines accomplish

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app
RUN pip install --no-cache-dir uv==0.9.27

COPY pyproject.toml uv.lock README.md ./
COPY src ./src
RUN uv sync --frozen --no-dev --no-editable

RUN useradd --create-home --uid 10001 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import os, urllib.request; urllib.request.urlopen('http://127.0.0.1:' + os.getenv('PORT', '8000') + '/health', timeout=3)"

CMD ["sh", "-c", "exec uvicorn stock_agent.api:app --host 0.0.0.0 --port ${PORT:-8000}"]
```

Several choices here are deliberate.

**`uv sync --frozen --no-dev --no-editable`**: `--frozen` guarantees that the lockfile produces the same environment used during development, rather than installing different versions depending on when the Docker build runs. `--no-dev` excludes testing tools such as pytest and ruff. `--no-editable` copies the package into `.venv` instead of symlinking it back to `src/`, so later changes under `src/` cannot unexpectedly alter the installed package.

**The non-root `appuser`**: its UID is 10001, not 0. The Python process inside the container cannot write to system directories. FastAPI does not require this; it is there so that if prompt injection ever breaches the trust boundary, the attacker still does not get root.

**A healthcheck built with the Python standard library**: the image installs neither curl nor wget because `urllib.request`, already included with `python:3.12-slim`, is enough. One fewer binary means one less attack surface. The `PORT` environment variable also lets Cloudflare Containers choose a different port.

**No secrets enter the image**: the Dockerfile contains no `ANTHROPIC_API_KEY`, `LANGFUSE_SECRET_KEY`, or `RESEARCH_API_TOKEN`. The runtime injects all of them. The image itself is safe to push to any registry.

## The Worker is the authentication boundary, not the container

This is the most important deployment decision: **authentication does not happen inside the container**.

```text
Internet ──▶ Cloudflare Worker (認證) ──▶ Container (FastAPI)
                  │
                  ├── /health, /docs → 直接放行
                  └── /research → Bearer token 驗證
```

The complete Worker is only 60 lines (`cloudflare/worker.ts`). Its core is:

```typescript
export class StockResearchContainer extends Container<Env> {
  defaultPort = 8000;
  sleepAfter = "10m";
  enableInternet = true;
  pingEndpoint = "/health";

  constructor(ctx: DurableObjectState<{}>, env: Env) {
    super(ctx, env);
    this.envVars = {
      STOCK_AGENT_NO_LLM: env.STOCK_AGENT_NO_LLM,
      LANGFUSE_PUBLIC_KEY: env.LANGFUSE_PUBLIC_KEY,
      LANGFUSE_SECRET_KEY: env.LANGFUSE_SECRET_KEY,
      LANGFUSE_BASE_URL: env.LANGFUSE_BASE_URL,
    };
  }
}
```

Notice that `envVars` contains neither `ANTHROPIC_API_KEY` nor `RESEARCH_API_TOKEN`. The first is unnecessary because the public deployment sets `STOCK_AGENT_NO_LLM=1`. The second is unnecessary because the Worker verifies the token; the container never needs to know the correct token.

Token matching uses a timing-safe comparison. Instead of a direct `===`, it hashes both values with SHA-256 before calling `crypto.subtle.timingSafeEqual`:

```typescript
async function tokenMatches(provided: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(provided)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  return crypto.subtle.timingSafeEqual(providedHash, expectedHash);
}
```

Why bother? An ordinary string comparison returns false at the first mismatched character. An attacker can measure response times to guess the correct token one character at a time. Hashing first and then comparing takes the same amount of time regardless of which bit differs. These are the six lines most worth borrowing from this 60-line Worker.

## Three-layer separation for secrets

| Secret | Where it lives | Visible to the container? | Why |
|---|---|---|---|
| `RESEARCH_API_TOKEN` | Worker secret | No | Authentication finishes in the Worker; the container does not need it |
| `ANTHROPIC_API_KEY` | Absent from the public deployment | No | The public service follows the no-LLM path |
| `LANGFUSE_PUBLIC_KEY` | Worker secret → injected into container | Yes | The container uploads traces |
| `LANGFUSE_SECRET_KEY` | Worker secret → injected into container | Yes | The container uploads traces |
| `LANGFUSE_BASE_URL` | `wrangler.jsonc` vars | Yes | It is not a secret; it points to `jp.cloud.langfuse.com` |

Secrets are configured outside version control:

```bash
npx wrangler secret put RESEARCH_API_TOKEN
npx wrangler secret put LANGFUSE_PUBLIC_KEY
npx wrangler secret put LANGFUSE_SECRET_KEY
```

Local development uses `.env` (already gitignored). Both the CLI and FastAPI auto-load it without overriding same-named variables already present in the shell. The demo token lives in macOS Keychain and is unset immediately after use:

```bash
research_token="$(security find-generic-password \
  -s stock-research-agent-api -a cloudflare-demo -w)"
curl -X POST .../research \
  -H "authorization: Bearer ${research_token}" \
  -d '{"symbol":"2330","question":"現在適合波段進場嗎？"}'
unset research_token
```

## wrangler.jsonc: the complete deployment declaration

```jsonc
{
  "name": "stock-research-agent",
  "main": "cloudflare/worker.ts",
  "containers": [{
    "name": "stock-research-api",
    "class_name": "StockResearchContainer",
    "image": "./Dockerfile",
    "instance_type": "basic",
    "max_instances": 1,
    "rollout_step_percentage": 100
  }],
  "durable_objects": {
    "bindings": [{
      "name": "STOCK_RESEARCH",
      "class_name": "StockResearchContainer"
    }]
  },
  "vars": {
    "STOCK_AGENT_NO_LLM": "1",
    "LANGFUSE_BASE_URL": "https://jp.cloud.langfuse.com"
  },
  "observability": {
    "enabled": true,
    "logs": { "head_sampling_rate": 1 },
    "traces": { "enabled": true, "head_sampling_rate": 0.1 }
  }
}
```

Several numbers deserve explanation.

**`instance_type: "basic"`**: this is the smallest Cloudflare Containers instance. A Python research agent needs neither a GPU nor a large amount of RAM. Its heaviest work is using pandas to calculate technical indicators and run backtests, which completes within seconds on a basic instance.

**`max_instances: 1`**: a side project does not need horizontal scaling. One instance is enough, and multiple instances would not share the `runs/` directory because the containers mount no persistent volume. Scaling would therefore make behavior inconsistent.

**`rollout_step_percentage: 100`**: deploy in one step, with no canary. The reason is the same: this is a side project, not a production trading system.

**`head_sampling_rate: 0.1` for traces**: trace only 10% of requests. A public API may be hit by scanners, and tracing 100% of them would create a large amount of meaningless data. Logs, however, remain at 100% because I want to see every request when something goes wrong.

## sleepAfter = "10m": the right way for a side project to save money

```typescript
sleepAfter = "10m";
```

This line puts the container to sleep after 10 minutes without a request. When the next request arrives, the Worker calls `container.startAndWaitForPorts()` to wake it and waits for FastAPI to start before forwarding the request. A cold start takes a few seconds, which is entirely acceptable for a research API.

This is why I chose Cloudflare Containers instead of renting a VPS. The smallest VPS starts at US$5 per month and keeps charging whether anyone uses it or not. A basic Container instance is billed only while it runs; sleeping costs nothing. For an interview demo and personal-research side project, “costs nothing when unused” matters far more than “cold-starts three seconds faster.”

## Why the public service deliberately disables the LLM

`STOCK_AGENT_NO_LLM=1` is not a shortcut. It is an intentional safety boundary:

1. **Cost control**: one synthesis call costs about US$0.03 in the measurement from Part 3. If someone scripts requests against the public API, it could run up a substantial bill in a day. Without a per-client rate limit and a queue, enabling the LLM would mean opening an uncapped bill.

2. **The fallback path already exists**: as Part 3 explained, synthesis falls back to a rule-based report template when the LLM is unavailable. The public API takes exactly that path. Technical analysis, backtesting, reflection, fundamentals, and chip data still run normally; only the final report uses a template rather than LLM prose. You receive the same data, just with less polished narration.

3. **Demonstrating that the boundary works**: the execution contract in Part 8 says that the Research Agent never holds trading credentials. The same principle applies at deployment: the public container holds no LLM credential, so even if an attacker compromises the container, they cannot obtain an Anthropic API key.

When will I enable it? After `/research` has a per-client rate limit, a request queue, and an LLM budget cap. `docs/deployment.md` explicitly records those as prerequisites.

## The container is not persistent—and that is a feature, not a bug

`docs/deployment.md` states the boundary plainly:

> The API does not persist decision artifacts. Container restarts therefore do not lose API-owned state, but they also do not provide the CLI's append-only research history.

The CLI's `runs/` directory is an append-only research history: it keeps every research run's decision JSON, backtest result, and review record on disk. The container version does not. Why?

Because Cloudflare Containers mounts no persistent volume, at least on the basic instance. A restart erases `runs/`. Rather than lead users to believe their data will remain and then surprise them when it disappears, the API makes no pretense of persistence. Every API research request stands alone: ask, calculate, answer, done. Use the CLI if you want a complete research history.

This also echoes the run-card design in Part 5. A run card's SHA-256 hash guarantees that “the same input data produces the same result,” not that “the result will exist somewhere forever.” Reproducibility and persistence are different concerns.

## Deployment in five steps

```bash
# 1. 本機驗證
docker build -t stock-research-agent .
docker run --rm -p 8000:8000 -e STOCK_AGENT_NO_LLM=1 stock-research-agent
curl --fail http://127.0.0.1:8000/health

# 2. TypeScript 類型檢查
npm install
npm run cf:types
npx tsc --noEmit

# 3. Dry run
npx wrangler deploy --dry-run

# 4. 設定 secret（只需一次）
npx wrangler secret put RESEARCH_API_TOKEN
npx wrangler secret put LANGFUSE_PUBLIC_KEY
npx wrangler secret put LANGFUSE_SECRET_KEY

# 5. 部署
npx wrangler deploy
```

Step 1 is a habit I added myself: run a full local Docker smoke test first, confirm that the healthcheck passes and `/research` returns a result, and only then push to Cloudflare. It is much easier than deploying first and discovering afterward that `uv.lock` was stale.

## Observability: Langfuse traffic leaves from inside the container

After each research run, FastAPI inside the container uploads a sanitized trace to Langfuse, as detailed in Part 3. The trace contains only the symbol, direction, model, latency, token usage, and cost. It contains no prompt, report content, or credentials.

The public deployment points to `jp.cloud.langfuse.com`, the Tokyo region with lower latency. The Worker injects Langfuse's public and secret keys into the container. If the credentials are missing or authentication fails, trace upload skips gracefully and records `credentials_missing`; it does not block the research workflow.

The Worker also enables Cloudflare's native observability: logs are sampled at 100%, so every authentication failure is visible during an incident; traces are sampled at 10% to reduce scanner noise. The two observability layers complement each other. Cloudflare traces show Worker-level latency and errors, while Langfuse shows agent-level LLM behavior and cost.

## How this deployment extends the first eight parts

| Earlier part | How the deployment layer carries it forward |
|---|---|
| Part 2 (parallel architecture) | The container runs the same LangGraph graph, with five analysts in parallel within one superstep |
| Part 3 (LLM tiers) | The public deployment follows the no-LLM path, the lowest fallback tier in the provider chain |
| Part 5 (run cards) | The API response includes backtest results and a SHA-256 hash but does not persist them to `runs/` |
| Part 6 (citation guard) | The evidence manifest and citation guard still operate; template reports also use `{{fact.id}}` |
| Part 7 (copilot loop) | API parameters or `--approve-plan` control plan approval |
| Part 8 (execution contracts) | The public deployment **does not connect** an execution dispatcher; the container holds no trading credentials |

## An honest list of limitations

Here are the deployment architecture's current limitations:

- **`/research` is synchronous**: a request waits for the entire graph to finish before receiving a response. There is no queue, webhook callback, or streaming. Long research tasks that require external document search may take more than 30 seconds.
- **No per-client rate limit**: the Bearer token is binary—present or absent—not “N requests per minute.” This is manageable in no-LLM mode because the cost is CPU rather than an API bill, but it becomes necessary before enabling the LLM.
- **One instance and no persistence**: this is not a high-availability design. If the container fails, the Worker returns 503 and waits for the next request to wake a new container. `runs/` history exists only in CLI mode.
- **The healthcheck tests only FastAPI**: it does not test the availability of Yahoo Finance, FinMind, Anthropic, or Langfuse. A healthy container does not imply that every upstream data source is reachable.
- **Cold-start latency**: `sleepAfter = "10m"` means an infrequently used API often waits through a cold start. A Python image plus a uv virtual environment takes a few seconds to start, not milliseconds.

These are reasonable tradeoffs for a side project. Each has a clear remedy—a queue, rate-limit middleware, a persistent volume or external storage, and a deep healthcheck endpoint—but at the `max_instances: 1` stage, the extra engineering complexity is not worth it.

## Nine parts in one sentence

This series started with “why build it?” and ends with “how can other people use it?” Across all nine parts, there is one central proposition: **an LLM should explain existing evidence, not produce evidence**. The graph topology puts backtesting before synthesis (Part 2). LLM tiers call a model only when necessary (Part 3). Backtest accountability lets history speak (Part 4). Walk-forward evaluation keeps parameters honest (Part 5). The citation guard makes numbers trustworthy (Part 6). The copilot loop keeps humans in the loop (Part 7). Execution contracts keep the agent away from real money (Part 8). The deployment boundary preserves those guarantees in a public API (this part).

The project is still evolving. Its 50% golden-eval baseline is ugly, the public API has not enabled the LLM, and the QuantConnect paper workflow is still at the manual-walkthrough stage. But these are known problems that can be measured, tracked, and improved—not unknown risks hidden behind attractive numbers. I would rather admit 5/10 in public than cherry-pick my way to a fake 9/10.

The code is on [GitHub](https://github.com/vincentxuu/stock-research-agent), and issues are welcome.

---

## References

- [stock-research-agent (GitHub repository)](https://github.com/vincentxuu/stock-research-agent)
- [docs/deployment.md: Docker and Cloudflare boundaries](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/deployment.md)
- [Cloudflare Containers documentation](https://developers.cloudflare.com/containers/)
- [Cloudflare Workers Observability](https://developers.cloudflare.com/workers/observability/)
- [Langfuse: an LLM observability platform](https://langfuse.com/)
