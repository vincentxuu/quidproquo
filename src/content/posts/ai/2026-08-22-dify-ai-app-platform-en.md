---
title: "Dify as a Low-Code Agent Platform: From a Working Workflow to a Published AI App"
date: 2026-08-22
category: ai
type: deep-dive
tags: [dify, rag, low-code, workflow, ai-agent]
lang: en
tldr: "Dify puts models, Knowledge, visual Workflows, Agents, Plugins, and application APIs in one workspace; this guide builds a minimal Workflow that can be tested, published, and called through the API, then explains when an Agent is actually warranted."
description: "An application-lifecycle introduction and hands-on guide to Dify model setup, Knowledge Pipelines, Chatflow and Workflow, Agents, publishing APIs, DSL portability, and self-hosting boundaries."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-dify-ai-app-platform)

[Dify](https://github.com/langgenius/dify) is an open-source AI application platform. It combines model providers, knowledge bases, visual workflows, Agents, tools, execution records, and application publishing in one workspace. RAG is one capability rather than the platform's only center.

This article follows an application from configuration to publishing and builds a minimal Workflow that can be called through the API. For a RAG product-layer comparison first, read the [RAG framework selection guide](/posts/ai/2026-08-22-rag-framework-selection-guide-en). Among low-code platforms, remember the boundary: [n8n](/posts/ai/2026-08-22-n8n-agent-automation-en) starts from general business automation, while [Flowise](/posts/ai/2026-08-22-flowise-ai-agent-builder-en) stays closer to an LLM and Agent flow builder.

## Models become managed platform resources

Dify uses model plugins for LLMs, embeddings, rerankers, speech, and moderation. The official [Model API interface](https://docs.dify.ai/en/develop-plugin/features-and-specs/plugin-types/model-schema) requires providers to validate credentials and implement model-specific invocation methods, so workflow nodes do not directly depend on every vendor SDK.

This centralizes management but turns model configuration into workspace state. Separate development, staging, and production credentials, restrict provider administration, and record the model used by each workflow version. Even when DSL carries an app definition, provider credentials and model availability must be validated in the target workspace; the export boundary is covered below.

## Knowledge Pipelines connect sources to retrieval

Knowledge is more than uploading files. Datasource plugins connect web crawlers, online documents, and cloud drives to a Knowledge Pipeline. The official [Datasource Plugin guide](https://docs.dify.ai/en/develop-plugin/dev-guides-and-walkthroughs/datasource-plugin) defines web crawler, online document, and online drive categories. Depending on the pipeline and indexing configuration, downstream processing can chunk content and build embeddings or other indexes for application retrieval.

The UI makes source maintenance accessible to content teams, but governance remains. Every source needs an owner, sync frequency, deletion policy, and access scope. Before creating a large knowledge base, define and test how quickly updates become searchable and how quickly deleted source data disappears.

## Chatflow and Workflow are executable programs

Visual flows connect input, knowledge retrieval, conditions, models, tools, code, and output. Under Dify's official [Workflow and Chatflow boundary](https://docs.dify.ai/en/cloud/use-dify/build/workflow-chatflow), Chatflow fits multi-turn interaction. A Workflow runs once: User Input accepts UI or API calls, while a Trigger starts it from schedules, webhooks, or integration events. Those start modes are mutually exclusive. The canvas helps product, content, and engineering discuss behavior, but every edge still represents production logic.

Define timeouts, failure branches, and output schemas for external calls. Test model timeouts, empty retrieval, and malformed tool output rather than only the happy path. Execution logs help diagnose one run, but they do not replace repeatable regression cases.

## Minimal build: from Studio to a callable Workflow API

Start with a deterministic `User Input → LLM → Output` flow. It is easier to debug than handing every decision to an Agent on day one. These steps follow Dify's official guides for [model providers](https://docs.dify.ai/en/cloud/use-dify/workspace/model-providers), [Workflow and Chatflow](https://docs.dify.ai/en/cloud/use-dify/build/workflow-chatflow), and [publishing](https://docs.dify.ai/en/cloud/use-dify/publish/):

1. Open **Integrations → Model Provider**, install a provider, click **Setup**, and enter its API key. Dify Cloud can also use models supported by AI credits. Only workspace owners and admins can manage providers.
2. Open **Studio → Create from blank → Workflow**. This example takes one input and returns one result, so Workflow is the right type; choose Chatflow only when the interaction needs conversation state.
3. Add a required Paragraph field to **User Input** and name its variable `question`.
4. Connect an **LLM** node and choose the configured model. Use “You are a technical editor. Answer in three points and state uncertainty explicitly” as the System prompt, then reference `{{question}}` in the User prompt.
5. Connect an **Output** node. Add an output named `answer` and map it to the LLM node's `text`. Output names become API response keys; a successful branch without an Output node returns no data.
6. Click **Test Run** and enter “What are the main risks of a low-code Agent platform?” Expect a three-point answer, a succeeded run, and an `answer` value in Output.
7. Click **Publish** to activate the latest version, then create an API key inside the app. The API executes only the published Workflow; editing the canvas without publishing again leaves the API on the previous version.

Call the published Workflow with its app API key:

```bash
export DIFY_API_KEY="your-app-api-key"

curl --request POST 'https://api.dify.ai/v1/workflows/run' \
  --header "Authorization: Bearer ${DIFY_API_KEY}" \
  --header 'Content-Type: application/json' \
  --data '{
    "inputs": {
      "question": "What are the main risks of a low-code Agent platform?"
    },
    "response_mode": "blocking",
    "user": "demo-reader-001"
  }'
```

A successful [Run Workflow API](https://docs.dify.ai/en/api-reference/workflow-runs/run-workflow) response contains `data.status: "succeeded"`, with the answer at `data.outputs.answer`. In a real product, follow the official [API getting-started guide](https://docs.dify.ai/en/api-reference/guides/get-started) and keep the key on your backend rather than in browser or mobile code.

Check four places first when the example fails:

- `provider_not_initialize`: the provider setup is incomplete or no credential is valid.
- `invalid_param`: `question`, `user`, or another field has the wrong name or type, or the Workflow has not been published.
- The run succeeds but returns no answer: the Output node does not map the LLM's `text` to `answer`.
- Studio runs the new version while the API runs the old one: the edited flow was not published again.

## When to replace the LLM node with an Agent

The example above does not need an Agent because every step is known in advance. When the model must choose tools from intermediate results, decide its next step, or retry dynamically, follow the official [Agent node guide](https://docs.dify.ai/en/cloud/use-dify/nodes/agent) and replace the LLM node with an Agent. Choose a strategy compatible with the model, add authorized tools, map `question` to Query, set Max Iterations, and connect the Agent's Final Answer to Output.

Limit tools and iterations first, then test empty tool results, expired credentials, and repeated selection of the wrong tool. Low-code removes some canvas implementation work; it does not define an Agent's stopping conditions for you.

## Plugins provide the extension boundary

[Dify Plugins](https://docs.dify.ai/en/develop-plugin/getting-started/getting-started-dify-plugin) extend models, tools, agent strategies, Extension (Endpoint), datasources, and triggers. The official [type guide](https://docs.dify.ai/en/develop-plugin/getting-started/choose-plugin-type) gives useful boundaries: use a Tool when a Workflow calls outward, an Extension (Endpoint) when an external service calls Dify over HTTP, a Trigger when an upstream event starts a Workflow, and a Datasource when documents enter Knowledge.

```bash
dify plugin init
```

Prefer a Plugin over forking the core platform. Stable extension contracts are easier to validate across upgrades than private patches. Plugins still process secrets and data, so review provenance, permissions, network access, and privacy documentation before installation.

## Publishing creates several entry points

According to Dify's official [publishing overview](https://docs.dify.ai/en/cloud/use-dify/publish/), applications can be exposed through web apps, APIs, website embeds, or MCP servers. That moves a prototype into a product without rewriting the entire backend, but production traffic should still pass through your gateway for authentication, tenant mapping, rate limits, and audit logs. Never put a platform API key in browser code.

Application behavior depends on the workflow, Knowledge, providers, Plugins, and environment variables together. Keep acceptance questions and expected citations, and rerun them whenever any layer changes. An unchanged canvas does not mean the underlying model or corpus is unchanged.

## Self-hosting: Compose starts services, not operations

The official [Docker guide](https://github.com/langgenius/dify/blob/main/docker/README.md) starts Dify with `docker compose up -d` and configures databases, vector stores, and services through `.env`. A complete deployment contains several stateful components. Volumes, backups, upgrades, worker capacity, Plugin execution, HTTPS, and observability remain operational work.

```bash
git clone https://github.com/langgenius/dify.git
cd dify/docker
cp .env.example .env
docker compose up -d
```

Check current official deployment and security guidance before going live. Do not expose default Compose services publicly or claim platform recoverability before restoring the database, object storage, and vector store in a rehearsal.

## DSL moves an app definition, not a complete platform backup

The Dify [CLI app reference](https://docs.dify.ai/en/cli/reference/apps) uses `difyctl export studio-app` to write an application definition as DSL YAML. Workflow and Chatflow exports default to the current draft; exporting a specific published version requires `--workflow-id`. An import also writes into the draft, so you must publish again before the API changes.

```bash
difyctl export studio-app <app-id> --output ./app.yaml
difyctl import studio-app --from-file ./app.yaml --name "App staging"
```

The CLI also offers `--include-secret` for encrypted secret values and reports missing Plugin dependencies after import. Operationally, I treat DSL as the versioning and transfer format for an app definition, not proof that an entire workspace has been backed up. Provider availability, Knowledge data, Plugins, databases, object storage, and vector stores still need separate inventories and restore rehearsals. That is an operational conclusion drawn from the documented DSL boundary, not a Dify promise of complete backup coverage.

| Option | Product center | Choose it first when |
| --- | --- | --- |
| Dify | Models, Knowledge, Agents, Workflows, and app publishing in one workspace | Product, content, and engineering jointly operate AI apps |
| [n8n](/posts/ai/2026-08-22-n8n-agent-automation-en) | [General workflow automation](https://docs.n8n.io/), with AI as one family of nodes and capabilities | Agents must participate in existing CRM, email, ERP, and business processes |
| [Flowise](/posts/ai/2026-08-22-flowise-ai-agent-builder-en) | [Assistant, Chatflow, and Agentflow](https://docs.flowiseai.com/) as LLM and Agent visual builders | You want to assemble RAG, single-Agent, or multi-Agent flows while keeping LLM components explicit |

## The overall trade-off

Dify expands the problem from building one RAG demo to operating multiple AI applications. Models, knowledge, flows, tools, and publishing share one surface, which is useful for product, content, and engineering collaboration. The trade-off is that the platform becomes part of the product: upgrades, permissions, backups, and Plugin supply-chain risks require governance.

Build the minimal Workflow above first, then add knowledge retrieval, an error branch, or an Agent. Rehearse DSL import, platform-data restoration, and a model switch separately. Dify earns its place when non-engineers can make safe daily changes while engineers retain testing and traceability.

## Update history

- 2026-08-22: Added a minimal Studio-to-API build, clarified the Dify/n8n/Flowise boundary, and separated DSL portability from full-platform backup.

## References

- [Dify repository](https://github.com/langgenius/dify)
- [Dify Docker deployment](https://github.com/langgenius/dify/blob/main/docker/README.md)
- [Dify Plugin](https://docs.dify.ai/en/develop-plugin/getting-started/getting-started-dify-plugin)
- [Choosing a Dify Plugin type](https://docs.dify.ai/en/develop-plugin/getting-started/choose-plugin-type)
- [Dify Datasource Plugin](https://docs.dify.ai/en/develop-plugin/dev-guides-and-walkthroughs/datasource-plugin)
- [Dify Model API Interface](https://docs.dify.ai/en/develop-plugin/features-and-specs/plugin-types/model-schema)
- [Dify Model Providers](https://docs.dify.ai/en/cloud/use-dify/workspace/model-providers)
- [Dify Workflow and Chatflow](https://docs.dify.ai/en/cloud/use-dify/build/workflow-chatflow)
- [Dify LLM node](https://docs.dify.ai/en/cloud/use-dify/nodes/llm)
- [Dify Output node](https://docs.dify.ai/en/cloud/use-dify/nodes/output)
- [Dify Agent node](https://docs.dify.ai/en/cloud/use-dify/nodes/agent)
- [Dify publishing overview](https://docs.dify.ai/en/cloud/use-dify/publish/)
- [Dify API getting started](https://docs.dify.ai/en/api-reference/guides/get-started)
- [Dify Run Workflow API](https://docs.dify.ai/en/api-reference/workflow-runs/run-workflow)
- [Dify CLI Apps: run, export, and import](https://docs.dify.ai/en/cli/reference/apps)
- [n8n documentation](https://docs.n8n.io/)
- [Flowise documentation](https://docs.flowiseai.com/)
