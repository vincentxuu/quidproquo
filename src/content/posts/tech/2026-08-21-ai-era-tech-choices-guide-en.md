---
title: "Reading Guide: Pick What Most People Use — the Other Five Criteria Are Tie-Breakers"
date: 2026-08-21
category: tech
type: guide
tags: [tech-selection, ai-agent, developer-tools, series-guide, dx]
lang: en
tldr: "The primary criterion has not changed: it is still adoption — and AI makes it matter more, not less, because more users means more training data means higher agent accuracy. The five criteria this series collects (machine-readable docs, types, whether the source is in your repo, data shape, machine-callability) are for breaking ties when adoption is comparable, or for costing out what picking the less popular option will charge you."
description: "A reading guide to the Technology Choices in the AI Era series: why adoption is still the primary criterion, how the five secondary criteria the AI era adds should be used, and the reading paths and roadmap for the series."
series:
  name: "Technology Choices in the AI Era"
  order: 0
draft: false
---

🌏 [中文版](/posts/tech/2026-08-21-ai-era-tech-choices-guide)

Start with a concrete problem, because that is what this series grew out of.

You are starting a new React project and choosing a router: TanStack Router or React Router. The traditional criteria point almost entirely one way. TanStack Router derives paths, params, and search params at compile time, so navigating to a route that does not exist is a type error rather than a runtime 404. Its docs site ships `llms.txt`, it is actively maintained, and it pulls roughly twenty million weekly downloads. There does not look like much to deliberate.

Then you ask an agent to write the first file-based route, and what comes back is laced with React Router idioms.

That is not the agent being stupid. It is that **the agent has read far more React Router than TanStack Router**. And that fact appears on no traditional selection checklist anywhere.

## The traditional criteria still work — they are just no longer sufficient

Weekly downloads, maintenance activity, community size, documentation quality: you still check all of them. What they measure is whether a project will die halfway through and whether anyone will help when it breaks. None of those questions went away in the AI era.

Where they fall short is that every one of them assumes **a human reads the docs, writes the code, and debugs it**. Once a meaningful share of that work goes to an agent, properties of a library that used to be irrelevant start deciding the quality of what you ship. Across twenty posts, those properties settled into a few.

## What the divergence produced

The most direct one is **whether the documentation can be read effectively by a machine**. An agent reads the docs before it writes anything, and whether it finds a clean structured index or HTML tangled with nav bars and ads shows up directly in the code. The most concrete vehicle is `llms.txt`, a Markdown index at the site root written for language models. Tested across six frontend docs sites: TanStack, shadcn, Zustand, AI SDK, and Next.js all ship one. React Router is the only 404.

The second is that **the role of types has changed**. Type safety used to be insurance for humans. Now it is the agent's guardrail — wherever the agent gets it wrong, if the compiler goes red you do not need code review to catch it. Zod pushes this furthest: define once, get runtime validation and static types from the same source. TanStack Router carries the same idea into routing. This is why type-related material takes up so much of the series; when an agent is writing the code, investment in the type system pays back more.

The third is counterintuitive: **whether the source lives in your repo**. An npm package is a black box to an agent — it cannot read the implementation inside `node_modules`, so it guesses the API from training memory. The copy-in model shadcn popularized inverts that: component source lands in your project, where the agent can read it and change it. AI Elements takes the same route, and the shadcn registry standardizes the pattern into a distribution mechanism.

Then there is the one most easily skipped: **whether the data shape is stable**. AI SDK splits a message into an array of parts — text, reasoning, source-url, tool-\* each an independent fragment — so the interface layer gets a firm boundary out of a single `switch part.type`. Picking a library whose data model is vague means stacking another layer of uncertainty on top of the one you already have.

The last one is still under observation: **whether your functions are callable by a machine**. The earlier criteria are about a machine reading; this one is about a machine invoking. WebMCP lets a page register its own functions as agent-callable tools, replacing the guess-the-button routine. But only one browser engine is shipping it and WebKit has formally opposed it — so the status here is "worth knowing," not "go do it."

## And then the contradiction

Every criterion above favours young tools: cleanly designed, rethought for the agent era.

The problem at the top of this post says the opposite. **A model cannot write well what it has not seen.** For the largest incumbent libraries, an agent's from-memory accuracy is simply higher. This criterion pulls against all the others, and it is not theoretical — it is precisely what you hit the first time you ask an agent to write a route.

The opposition is also structural. The reason a tool ships `llms.txt` early, pushes types into the compiler, and dares to use a copy-in model is often that it is young and carries no legacy. **Those traits and a thin training corpus are two faces of the same cause.**

## So the primary criterion has not changed

One thing needs saying plainly here, or this series will read as an advertisement for new tools.

Training-corpus volume is not an independent criterion. It is **downstream of adoption** — more users means more code in public, which means more the model has read, which means higher accuracy when an agent writes it. And adoption was always the primary criterion anyway: more users means the potholes have been hit, your problem has a searchable answer, you can hire people who know it, and the project is less likely to die.

So AI did not weaken "pick what most people use." **It added a second mechanism that supports the same old conclusion.** That is the most counterintuitive thing I took away from writing these twenty posts: the thing most worth holding onto in the agent era is the most traditional criterion there is.

So what are the other five for? Two things.

**First, breaking ties when adoption is comparable.** When both options are mature enough and both communities are large enough, whether the docs ship llms.txt, whether types can stop an agent's mistakes, and whether the source is readable become meaningful differences.

**Second, costing out the decision.** If you have some other reason to want the less popular option — it solves the pain you actually have, or the mainstream option simply does not do the thing — these five tell you what that decision will cost you in extra work, and whether any remediation exists. `llms.txt` is one such remediation: with it, the workflow shifts from writing from memory to fetching the index, locating the page, and writing against the current API, and the React Router drift from the opening disappears on the spot.

But remediation is not free, and it is certainly not permission. **Without one of those five as your reason, do not pick the less popular option.**

Back to the router problem at the top, the honest answer is this: if your team has no specific reason to need it, React Router remains the safe default. TanStack Router earns its place because its type safety solves a concrete pain — refactoring routes in a large codebase — not because it is newer and cleaner.

## What the twenty posts cover

| # | Subject | Where it sits on this line |
|---|---|---|
| 1 | [Choosing a React Stack in the AI Era](/posts/tech/2026-08-19-react-stack-ai-era-en) | The whole-stack map, where the criteria first take shape |
| 2 | [AI Elements](/posts/tech/2026-08-19-vercel-ai-elements-en) | The copy-in model in practice |
| 3 | [TanStack Router](/posts/tech/2026-08-21-tanstack-router-type-safety-en) | Types as guardrail, and the protagonist of this post's contradiction |
| 4 | [AI SDK message parts](/posts/tech/2026-08-21-ai-sdk-message-parts-en) | The data shape |
| 5 | [Zod](/posts/tech/2026-08-21-zod-universal-contract-en) | Schema as a universal contract |
| 6 | [shadcn registry and MCP](/posts/tech/2026-08-21-shadcn-registry-mcp-en) | Copy-in standardized into distribution |
| 7 | [llms.txt](/posts/tech/2026-08-21-llms-txt-en) | The remediation itself |
| 8 | [WebMCP](/posts/tech/2026-08-21-webmcp-browser-tools-en) | From machine-readable to machine-callable |
| 9 | [Microsoft Agent Framework](/posts/ai/2026-08-21-microsoft-agent-framework-en) | Framework boundaries after AutoGen and Semantic Kernel merged |
| 10 | [LlamaIndex](/posts/ai/2026-08-21-llamaindex-rag-framework-en) | From RAG framework to agent data layer |
| 11 | [The vLLM self-hosting decision](/posts/ai/2026-08-21-vllm-self-host-decision-en) | The default for self-hosted inference and the over-engineering line |
| 12 | [Exa](/posts/ai/2026-08-21-exa-neural-search-for-agents-en) | A search API designed for agents |
| 13 | [Modal](/posts/ai/2026-08-21-modal-serverless-gpu-en) | The serverless GPU execution layer below the inference engine |
| 14 | [Composio](/posts/ai/2026-08-21-composio-agent-tool-integration-en) | Authentication and tool integration when agents connect to SaaS |
| 15 | [Tailscale](/posts/tech/2026-08-21-tailscale-for-self-hosted-agents-en) | Private networking and permission boundaries for self-hosted agents |
| 16 | [Temporal](/posts/tech/2026-08-21-temporal-durable-execution-en) | Durable execution through deterministic replay |
| 17 | [Drizzle ORM](/posts/tech/2026-08-21-drizzle-orm-sql-first-en) | A reviewable, SQL-first data access layer |
| 18 | [Trigger.dev](/posts/tech/2026-08-21-trigger-dev-durable-tasks-en) | Process snapshots that avoid determinism constraints |
| 19 | [CrewAI](/posts/ai/2026-08-21-crewai-multi-agent-framework-en) | Organizing multi-agent work through roles and tasks |
| 20 | [Supabase](/posts/tech/2026-08-21-supabase-postgres-platform-en) | The tradeoffs of a PostgreSQL-centred BaaS |

Deciding on a specific library? Jump straight to its post; each ends with a good-fit / bad-fit call. Building your own criteria? Read post 1 (the map) and post 7. Curious what the web becomes in the agent era? Posts 7 and 8 are two segments of one axis.

The first eight concentrate on the frontend because that is where the criteria diverged earliest and most visibly. The series name deliberately avoids naming React so it can move down the stack.

## What comes next

Having gone through the four hundred-plus posts already here, the gaps are clearer than I expected, and they lean heavily to the AI side. Here is what I intend to cover. **This is a plan, not a promise** — the order will move around as the research lands. It is written down so you can see how far this series means to go.

### The AI line

| Layer | Not yet written | Current state of this site |
|---|---|---|
| **Agent frameworks** | AG2, LangChain, Mastra, Pydantic AI, DSPy | Microsoft Agent Framework, CrewAI, and LangGraph have dedicated posts, plus an outdated 15-framework map; a current cross-framework comparison is still missing |
| **RAG frameworks** | Haystack, RAGFlow, Dify, R2R | LlamaIndex now has a dedicated post and RAG techniques have thirty-plus; a cross-framework selection guide is still missing |
| **Self-hosted inference** | SGLang, Triton, Ray | vLLM and Ollama both have posts |
| **Cloud LLM APIs and routing** | OpenRouter, Bedrock, Vertex AI, Together, Fireworks, LiteLLM, Portkey | Posts on Groq Console, 9Router, and a 40-plus provider pricing roundup |
| **Fetch and search APIs** | Tavily, Jina Reader, Serper, SerpAPI, Linkup, Brave Search API | Exa and Firecrawl have dedicated posts, plus one crawler landscape post |
| **Self-hosted crawling and anti-bot** | Crawl4AI, Scrapy, Selenium, Bright Data, Zyte, Apify | One hands-on post about getting past Cloudflare's bot defences |
| **Full-text and on-site search** | Pagefind, Meilisearch, Typesense, Algolia, Elasticsearch / OpenSearch | Entirely empty — and this site's own search runs on Pagefind |
| **Vector databases** | Qdrant, Chroma, Weaviate, Milvus, LanceDB, pgvector | A selection comparison, no single deep dive |
| **Agent memory services** | Mem0, Zep, Cognee, Letta / MemGPT | A concept post, no tool post |
| **Agent protocols** | AP2 and UCP (agent payments and commerce) | The best-covered layer here: MCP, A2A, A2UI, AGENTS.md, and WebMCP all have posts |
| **Tool-connection platforms for agents** | Arcade, Pipedream, Toolhouse, Zapier MCP | Composio now has a dedicated post |
| **Agent hosting and SDKs** | OpenAI Agents SDK, Cloudflare Agents SDK | Posts on Vercel Open Agents, Claude Managed Agents, OpenAI Workspace Agents |
| **Agent interface components** | CopilotKit, assistant-ui | AI Elements and A2UI have posts |
| **LLM gateways and tracing** | LiteLLM, Portkey, Helicone, LangSmith | Langfuse and 9Router have posts |
| **Low-code agent platforms** | Dify, n8n, Flowise | Entirely empty |

### The fast-growing startup tier

This layer turns over a fresh batch of names every few months, and the site has barely touched it. Every entry below has recent funding or adoption figures I checked myself (2026-08).

| Layer | Representative players | Current state of this site |
|---|---|---|
| **Agent sandboxes and execution** | Modal, E2B, Daytona, Runloop, Vercel Sandbox, Cloudflare Sandboxes | Modal now has a dedicated post; the rest remain uncovered |
| **Browser infrastructure for agents** | Browserbase, Steel, Hyperbrowser, Cloudflare Kitesurf | Only Stagehand has a post |
| **Web access for agents** | Parallel, Exa, Bright Data | Exa now has a dedicated post; Parallel and Bright Data remain uncovered |
| **Eval and simulation** | Patronus, Braintrust, Promptfoo, Arize Phoenix, Galileo | Only Langfuse has a post |
| **Agent-oriented inference** | Baseten, Sail, Fireworks, Together, Cerebras | Entirely empty |
| **Voice agents** | LiveKit, Vapi, Cartesia, Deepgram, ElevenLabs | Entirely empty |
| **Auth startups** | Clerk, WorkOS, Stytch, Better Auth | Entirely empty |

One layer deserves calling out because it runs the other way: **agent protocols are the best-covered area on this site**. MCP, A2A, A2UI, AGENTS.md, plus this series' eighth post on WebMCP — five posts. What is missing is the stretch where protocols reach into commerce: Google's AP2 payments protocol and the companion UCP, never mentioned here once. That is the loose thread the WebMCP post left behind, since it names fully autonomous agents as a non-goal and then points somewhere else for that scenario.

These names fight this post's primary criterion, so let me say up front how I read them: **most are not yet "what most people use," and the default answer is watch, not adopt.** They are here not as recommendations but because this layer moves fast enough that *not knowing they exist* is itself a risk — things that did not exist six months ago are already a box on somebody's architecture diagram.

When judging this tier, revenue and adoption numbers are far more useful than funding size. Modal raised a $355M Series C at a $4.65B valuation in May 2026, but the informative number is that its annualized revenue grew roughly fivefold to around $300M. Parallel raised $100M at a $2B valuation in April; again, the hundred thousand-plus developers using it says more than the valuation.

One of them lands very close to home. On 2026-08-06 Cloudflare launched **Kitesurf**, a browser runtime built specifically for agents: it runs on V8 isolates, drops Chromium entirely, claims three to seven times lower CPU and memory on common agentic tasks, and still speaks to existing Puppeteer, Playwright, and MCP clients. This site runs on Cloudflare Workers.

### General layers the AI era changed

| Layer | Not yet written | Current state of this site |
|---|---|---|
| **Build and toolchain** | Vite 8 and Rolldown, Vitest, oxlint / Oxc, TypeScript 7 | Entirely empty |
| **Message queues and event streaming** | Kafka, RabbitMQ, NATS, Redpanda, Pulsar, Redis Streams, AWS SQS / SNS, Cloudflare Queues | Two task-queue posts, BullMQ and Celery |
| **Durable execution** | Inngest, Restate, Hatchet | Temporal and Trigger.dev now have dedicated posts |
| **The backend contract layer** | tRPC, oRPC, ts-rest, Zodios, Hono RPC; on the OpenAPI side openapi-typescript, Stainless, Speakeasy; cross-language gRPC / Connect, Protobuf / Buf, GraphQL and Codegen | Entirely empty |
| **Data access** | Kysely | Drizzle and Prisma now have dedicated posts |
| **Auth and authorization** | Better Auth, plus the authorization model for an agent acting on a user's behalf | Entirely empty |
| **Compute on the big three clouds** | AWS Lambda / Fargate / App Runner, Google Cloud Run / GKE, Azure Container Apps / App Service | Only AI certification prep posts, nothing on choosing the platforms |
| **GPU and inference-specific clouds** | CoreWeave, Lambda Labs, RunPod, Nebius, Crusoe, Replicate, Hugging Face | Entirely empty |
| **Second-tier clouds and on-prem** | DigitalOcean, Hetzner, Vultr, Linode, Scaleway, OVHcloud, Oracle OCI; on-prem Proxmox, OpenStack | Entirely empty |
| **Managed PaaS** | Vercel, Netlify, Render, Railway, Fly.io, Koyeb, Deno Deploy, DigitalOcean App Platform | The Cloudflare line is covered thoroughly, the rest is empty |
| **Self-hosted PaaS** | Coolify, Dokploy, CapRover, Dokku, Kamal | Entirely empty |
| **Backend-as-a-Service** | Firebase, Appwrite, Convex, PocketBase, Nhost | Supabase now has a dedicated post |
| **Orchestration and infrastructure as code** | Kubernetes, Terraform, Pulumi, SST | Docker and nginx are covered; above that, nothing |
| **Backend frameworks** | NestJS, Fastify, Elysia, Django | Hono, Express, and FastAPI have posts |
| **Private networking and remote access** | WireGuard, ngrok, ZeroTier, Twingate, Teleport | Tailscale and Cloudflare Tunnel now have dedicated posts |
| **Realtime transport and collaboration** | Socket.IO, WebSocket, SSE, PartyKit, Ably, Liveblocks, Yjs / CRDT, Cloudflare Durable Objects | One RAG Streaming post, otherwise empty |
| **Supply chain and code security** | Socket.dev, Snyk, Semgrep, CodeQL, Renovate, gitleaks, zizmor, Sigstore / SLSA | Only Trivy has a post |
| **Agent security** | Prompt injection classifiers (Model Armor), red-team tooling (Promptfoo), sandbox escape and permission boundaries | A concept post, no tool posts |
| **General databases** | MySQL, MongoDB, DuckDB, managed Postgres (Neon / Turso) | PostgreSQL, Supabase, Redis, ClickHouse, and D1 have posts |

Two gaps are glaring enough that they have to be named.

**Agent frameworks** now have dedicated posts on Microsoft Agent Framework and CrewAI, so two directions omitted by the old "15 Agent Frameworks Worth Watching in 2026" map have their own explanations. Individual posts are not a selection map, though: AG2, LangChain, Mastra, Pydantic AI, and DSPy remain uncovered, and the site still lacks a current comparison built on one shared set of criteria.

**RAG frameworks** fail differently. There are thirty-odd technique posts here — chunking, HyDE, CRAG, GraphRAG, ColBERT — probably the densest cluster on the whole site, and LlamaIndex now has its own post. The first question a reader has afterwards still stands: which of LlamaIndex, Haystack, RAGFlow, Dify, and R2R should I actually use? A cross-framework comparison has not answered it yet.

There is a third kind of gap, and it is the embarrassing one: **the tools this site uses every day and has never written about**.

This repository's own guidelines say in plain text to reach for Exa, Tavily, and Jina when fetching pages. Exa now has a dedicated post, while Tavily and Jina still live only in workflows and comparison posts. The full-text search runs on Pagefind — still zero dedicated posts. Hugging Face appears throughout the site and likewise still has no tool post of its own.

The clouds are a differently shaped hole. Five certification-prep posts for AWS and Microsoft AI exams sit here, and nothing at all on how to choose the platforms themselves. Modal now covers one corner of serverless GPU, but CoreWeave, Lambda Labs, RunPod, and Nebius still lack a horizontal comparison. There are posts here on vLLM and Ollama, which means **the inference engines are covered while the places you run them have only one shape represented**. A complete cost-and-latency map for the self-hosting decision is still missing.

### Why the last group counts

That last group looks like ordinary developer tooling with no particular connection to AI. The reason it belongs is simple: **this series is written for people choosing tools, not for agents.** Whether a tool is worth covering comes down first to whether anyone needs it to get work done — never to whether an agent can drive it.

Given that, AI is only an additional criterion: mentioned where it exists, not manufactured where it doesn't. These layers happen to have one, and each takes a different route to it.

For the toolchain layer, Cloudflare put the case better than I can, in its announcement about acquiring VoidZero:

> Developers used to be the only users of dev servers, bundlers, linters, formatters, and CLIs. That is no longer true: agents are using them too, constantly.

Every point it lists next is really a selection criterion. Builds have to be fast, because agents iterate far more often than people do. Tests have to be fast, because an agent re-runs them constantly to check what it just wrote. Linting and formatting have to be fast, because inside that loop they become guardrails. Errors have to be clear and structured, because the thing reading them and acting on them is a machine. That is a different question from which bundler wins a benchmark.

Before the other layers, one set of terms needs pulling apart, because they get used as synonyms: **task queues, event streams, and durable execution are three different things**. A queue (BullMQ, Celery) guarantees a message gets consumed. A stream (Kafka, NATS) guarantees events stay ordered and can be replayed. Durable execution guarantees that **a process spanning many external calls finishes even if it dies halfway through**. Agents mostly need the third, and the site now has dedicated posts on two different recovery models: Temporal and Trigger.dev.

Of those three, durable execution shows most clearly what "AI changed the answer" means. The split inside it is not about vocabulary — DBOS and Hatchet both say checkpoint and still require your orchestration code to be deterministic. The real dividing line is **whether recovery re-runs the code you wrote**: Temporal-style engines do, so workflow code must be deterministic; Trigger.dev restores an OS-level process snapshot and re-runs none of it, so it does not. And since LLM calls are inherently non-deterministic, that one fact settles most of the decision for you.

Data access asks something else entirely: can you review what the agent wrote? SQL-first output sits in the diff where you can read it. A DSL plus a generated client does not.

Auth is the mess WebMCP leaves behind. Tools run in a tab where the user is already signed in, so the agent inherits full human privileges, and no existing auth product was designed for that.

Deployment comes back to something unglamorous: whether your CLI is consistent. An agent runs its own deploys and rollbacks, and scattered command shapes send it on detours. Part of why self-hosted PaaS has warmed up again is exactly this — a one-command deploy serves humans and agents better than a Kubernetes manifest.

Private networking is a layer I missed on the first pass and added afterwards, and it has a clear AI-era criterion: **self-hosting a long-running agent means putting something on your network that has to be reachable from outside and must not sit on the public internet**. The Tailscale post now covers tailnets, subnet routers, tags, and ACL boundaries. How to choose among WireGuard, ngrok, ZeroTier, Twingate, and Teleport remains the next gap.

Realtime deals with streaming and shared state. Agent output arrives token by token; a human and an agent editing the same document is an old CRDT problem in a new setting; and where a long-running agent parks its state belongs to this layer too.

The hardest criteria of all sit in the two security layers. In the npm supply chain attack of May 2026, the malicious packages carried **valid SLSA Build Level 3 provenance** — the signatures were real, because what the attacker hijacked was the legitimate release pipeline. And the malware's persistence locations included `.claude/settings.json` and `.vscode/`, meaning **attackers are already using coding agents' config directories as a foothold**. zizmor, the GitHub Actions static analyzer TanStack adopted afterwards, has never been covered here either. And on the agent's own side of security — injection classifiers, red-team tooling, sandbox permission boundaries — this site has concept posts and not a single one about a tool.

About the last two layers I should be straight: backend frameworks and general databases **have essentially no AI-specific criterion**. Express and PostgreSQL have overwhelming corpus behind them and agents do write them more accurately, but that is only another way of saying they are widely adopted. If those layers get written, they get written the old way — maturity, ecosystem, operational cost, which wall you hit at which scale. Forcing an AI angle into every post would just make the posts worse.

## One last thing

These criteria exist to support a decision, not to replace one. A library can score full marks on every one of them and still be the wrong choice if your team doesn't know it, the ecosystem doesn't fit, or it solves a problem you don't have. What this series is trying to give you is not a list of recommendations — it is **a few questions you would not otherwise have thought to ask**.

## Update history

- 2026-08-21: Updated the series through order 20, added the twelve later reading paths, and reconciled the roadmap's covered and uncovered items.

## References

- Series posts: [the stack map](/posts/tech/2026-08-19-react-stack-ai-era-en), [AI Elements](/posts/tech/2026-08-19-vercel-ai-elements-en), [TanStack Router](/posts/tech/2026-08-21-tanstack-router-type-safety-en), [AI SDK message parts](/posts/tech/2026-08-21-ai-sdk-message-parts-en), [Zod](/posts/tech/2026-08-21-zod-universal-contract-en), [shadcn registry and MCP](/posts/tech/2026-08-21-shadcn-registry-mcp-en), [llms.txt](/posts/tech/2026-08-21-llms-txt-en), [WebMCP](/posts/tech/2026-08-21-webmcp-browser-tools-en)
- [The llms.txt spec (llmstxt.org)](https://llmstxt.org/)
- [WebMCP specification (W3C Web Machine Learning CG)](https://webmachinelearning.github.io/webmcp/)
- On this site: [AI-Ready Content](/posts/ai/2026-03-30-ai-ready-content-en)
