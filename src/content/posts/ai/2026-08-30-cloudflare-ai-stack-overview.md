---
title: "Cloudflare AI Stack 導讀：在 Workers 上做 AI、RAG 和 agent"
date: 2026-08-30
type: guide
category: ai
tags: [cloudflare, ai-stack, workers-ai, rag, agents, architecture]
lang: zh-TW
tldr: "Cloudflare AI Stack 這條系列回答 AI app 的基礎設施問題：模型怎麼跑、gateway 怎麼控、RAG 怎麼做、agent 怎麼持續執行、memory 怎麼治理、browser/sandbox/secrets 怎麼接進產品。"
description: "Cloudflare AI Stack 系列導讀，整理 Workers AI、AI Gateway、AI Search、Vectorize、Agents、Agent Memory、Browser Run、Sandbox SDK、Secrets Store、D1/R2/DO 與 observability 的閱讀順序。"
draft: false
series:
  name: "Cloudflare AI Stack"
  order: 0
---

> 🌏 [English version](/en/posts/ai/2026-08-30-cloudflare-ai-stack-overview-en)

做 AI app 時，模型只是其中一塊。真正麻煩的是周邊：provider key、gateway、RAG、向量索引、文件同步、agent session、tool 權限、browser、sandbox、memory、observability、成本控制。你可以每一塊都接一個外部服務，也可以把很多 infra 收斂到 Cloudflare。

這條系列叫 Cloudflare AI Stack，回答的是：「我怎麼用 Cloudflare 做 AI app，不用自己管一堆 infra？」它也是一份 AI app architecture 導讀，先把模型、檢索、agent runtime、memory、tooling、secret、storage 和 observability 的邊界排清楚。

## 這條系列適合誰

適合這些讀者：

- 想用 Workers AI 快速做 inference。
- 想用 AI Gateway 管 OpenAI、Anthropic、Gemini 或其他 provider。
- 想做 RAG，但還在選 AI Search 或 Vectorize。
- 想把 agent 做成 durable runtime，而不是一次性 HTTP loop。
- 想讓 agent 用 browser、sandbox、MCP、email、Slack、webhook。
- 想知道 memory、conversation、artifact、eval trace 應該放哪裡。

如果你的主要問題是一般網站/app 部署、cache、storage、email、Turnstile、Containers，請看 [Cloudflare Edge Platform](/posts/tech/2026-08-30-cloudflare-edge-platform-overview)。

## 閱讀順序

我會這樣讀：

1. **Inference**：Workers AI binding 和模型選型。
2. **Model control**：AI Gateway 負責 observability、cache、rate limit、fallback、BYOK。
3. **Retrieval**：AI Search 是 managed RAG；Vectorize 是自建 retrieval control。
4. **Runtime**：Agents 提供 durable identity、state、SQLite、WebSocket、scheduling、tool loop。
5. **Memory**：Agent Memory 記 user/team/project context，和 RAG 文件分開。
6. **Tools**：Browser Run 讓 agent 開 browser；Sandbox SDK 讓 agent 跑 code。
7. **Secrets and data**：Secrets Store 管 provider key；D1/R2/DO 決定 conversation、artifact、lock、trace 放哪裡。

這個順序從 model 開始，但很快就離開 model。AI app 的 production 問題通常不只看「模型會不會回」，更要看回覆是否可控、可查、可恢復、可治理。

## 每個服務的定位

| 主題 | 你讀完應該知道 |
|---|---|
| Workers AI | Cloudflare 上的 inference binding 能做什麼 |
| Workers AI model guide | chat、embedding、vision、rerank 怎麼選 |
| AI Gateway | provider 呼叫怎麼被觀測、快取、限流、fallback |
| AI Search | 什麼時候用 managed RAG pipeline |
| Vectorize | 什麼時候自己控制 chunking、embedding、metadata、query |
| Agents | durable agent runtime 怎麼組 |
| Agent Memory | 記憶和 RAG 文件怎麼分開 |
| Browser Run for agents | 什麼時候 agent 需要 browser |
| Sandbox SDK | 什麼時候 agent 需要隔離 Linux workspace |
| Secrets Store | BYOK 和 provider keys 怎麼集中治理 |
| D1/R2/DO for AI apps | conversation、artifact、lock、eval trace 放哪裡 |

## 什麼時候不要用 Cloudflare AI Stack

我會先避開這些場景：

- 需要自己管理 GPU、訓練、fine-tuning cluster。
- 對 model hosting 有非常細的硬體控制需求。
- RAG pipeline 需要完全自訂且已有成熟外部 infra。
- agent 需要長時間常駐 VM 或 persistent block storage。
- compliance 要求某些資料不能進 Cloudflare。

Cloudflare AI Stack 的強項是把 AI app 周邊 infra 拉近 Workers runtime。它不會替你解決所有 AI 產品問題，但能把 inference、gateway、retrieval、agent runtime、tools、secrets、observability 放到同一個操作面。

## 參考資料

- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- [Cloudflare AI Search](https://developers.cloudflare.com/ai-search/)
- [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/)
- [Cloudflare Agents](https://developers.cloudflare.com/agents/)
- [Cloudflare Agent Memory](https://developers.cloudflare.com/agent-memory/)
- [Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/)
- [Cloudflare Secrets Store](https://developers.cloudflare.com/secrets-store/)
