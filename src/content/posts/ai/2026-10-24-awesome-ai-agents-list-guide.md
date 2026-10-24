---
title: "Awesome AI Agents 清單怎麼用：305 個專案、24 個分類與挑選步驟"
date: 2026-10-24
category: ai
type: guide
tags: [ai-agent, open-source, awesome-list, agent-memory, mcp, agent-framework]
lang: zh-TW
tldr: "awesome-ai-agents 是收錄 305 個 agent 專案的索引，不是能安裝的工具。它附 JSON 資料檔，一行 jq 就能依分類與星數篩出候選，再自己確認維護狀況。"
description: "導讀 GitHub 上的 awesome-ai-agents 清單：它收錄什麼、分類怎麼分、資料檔怎麼用 jq 篩，以及轉述它的貼文裡有哪些說法跟清單本身對不上。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-24-awesome-ai-agents-list-guide-en)

[awesome-ai-agents](https://github.com/slavakurilyak/awesome-ai-agents) 是 Slava Kurilyak 維護的 agent 專案索引，目前收錄 305 個專案，分在 24 個有內容的分類裡，資料檔提供 JSON 與 YAML，整個 repo 是 MIT 授權。最近有貼文把它轉述成「記憶、瀏覽器、agent loop 都已經有人做好了」。這篇說明它實際是什麼、怎麼用 `jq` 從資料檔挑出候選，以及轉述裡有哪幾處跟清單本身對不上。

## 是什麼

它是一份索引，不是框架，沒有東西可以安裝。每個專案有一張卡片：描述、GitHub 星數、近 9 天的星數成長、所屬分類，部分專案另有 capabilities 和 interfaces 欄位。

收錄條件寫在 README 開頭：要有公開的 GitHub、GitLab.com 或 Codeberg 儲存庫，不限授權；只有託管產品、沒有自己 repo 的不收。

repo 裡有四樣東西值得知道：

- **README**：依序是分類瀏覽、星數成長排名、總星數前十，最後是全部專案卡片。
- **`awesome-agents.json` / `awesome-agents.yaml`**：同一份專案資料的兩種格式，頂層是 `agents` 與 `categories` 兩個欄位。
- **`awesome-categories.yaml`**：分類定義，共 36 類。
- **`github-stars-history.json`**：星數歷史紀錄。

## 給誰、先備知識

適合已經知道自己缺哪一塊的人：agent 要加記憶、要操作瀏覽器、要做評估追蹤，想先看有哪些候選、規模多大。需要會讀 GitHub repo、會用命令列；下面的範例用 `jq`。

不適合想學概念的人。清單只給一兩句描述，不解釋這些專案怎麼運作，也不比較優劣。想先理解記憶，可以看本站的[Agent 記憶工程系列入門](/posts/ai/2026-09-19-agent-memory-engineering-series-intro)。

## 內容地圖

README 的分類用「這是什麼東西」切，不是用「你要解決什麼問題」切。下表改成從需求出發：

| 你想補的缺口 | 清單分類（專案數） | 清單中的例子 |
|---|---|---|
| 現成的 agent、編碼代理 | AI Agents（103） | Aider、AutoGPT、Cline |
| 自己搭 agent 的框架 | Development Frameworks（89） | LangGraph、crewAI、Google ADK、Cognee |
| 跨對話的記憶 | Long-Term Memory（25） | mem0、MemGPT、Zep、Screenpipe |
| 操作或抓取網頁 | Web Browsing Frameworks（7） | browser-use、Stagehand、Steel Browser、Firecrawl |
| 評估與追蹤 | Evaluation（13）、Observability（14） | Opik、Langfuse、Arize Phoenix |
| 接外部工具 | MCP Servers（21）、Tool Calling（24） | Serena、Context7、Playwright MCP |
| 安全護欄 | Safety Guardrails（27） | NeMo Guardrails |
| 把 prompt 寫成程式 | Flow Engineering（5） | DSPy |

一個專案可以掛在多個分類，所以各類加總會比專案總數多。其餘分類都只有一兩個專案，例如 Phone Calling、Bitcoin、Prompt Engineering 各只有一個。

### 轉述貼文提到的八個專案

下表的分類與描述都來自清單本身，星數是清單 2026-10-04 的快照：

| 專案 | 清單分類 | 清單的描述 | 星數 |
|---|---|---|---|
| [DSPy](https://github.com/stanfordnlp/dspy) | Flow Engineering | 把宣告式的語言模型呼叫編譯成可自我改進的管線，最佳化 prompt 與權重 | 38,491 |
| [Cognee](https://github.com/topoteretes/cognee) | Development Frameworks | 把資料處理成知識圖譜與資料模型，提供新增資料與相似度搜尋 | 31,338 |
| [Serena](https://github.com/oraios/serena) | MCP Servers | 以 MCP server 提供、靠 language server 做語意程式碼檢索與編輯的工具組 | 29,972 |
| [Stagehand](https://github.com/browserbase/stagehand) | Web Browsing Frameworks | 在 Playwright 上加 act、extract、observe 三個自然語言 API | 25,530 |
| [Opik](https://github.com/comet-ml/opik) | Evaluation Frameworks | LLM 與 agent 的追蹤、評估、prompt 管理與線上監控 | 22,364 |
| [Screenpipe](https://github.com/screenpipe/screenpipe) | AI Agents、Long-Term Memory、Local Inference、Personal Assistants | 在本機擷取螢幕與音訊，經 MCP 提供可搜尋的工作歷史給 agent | 21,806 |
| [Google ADK](https://github.com/google/adk-python) | Development Frameworks | 建置、評估、部署多 agent 系統的開源 kit | 21,701 |
| [Steel Browser](https://github.com/steel-dev/steel-browser) | Web Browsing Frameworks | 開源的瀏覽器 API 與沙盒，提供受管理的瀏覽器 session | 7,733 |

## 一個具體範例：從資料檔挑瀏覽器工具

假設你的 agent 要操作網頁，想知道清單裡有哪些選擇。資料檔每個專案都有 `categories` 陣列和 `sources[0].stars`，所以：

```bash
curl -sSLO https://raw.githubusercontent.com/slavakurilyak/awesome-ai-agents/main/awesome-agents.json

jq -r '.agents[]
  | select(.categories | index("Web Browsing Frameworks"))
  | [(.sources[0].stars // 0), .project] | @tsv' awesome-agents.json | sort -rn
```

輸出（2026-10-04 的快照）：

```text
188355	Firecrawl
117092	browser-use
84721	Crawl4AI
37797	Playwright MCP
25530	Stagehand
23132	Skyvern
7733	Steel Browser
```

同一類裡其實分了幾層：Firecrawl 把網站轉成 Markdown 與結構化資料，是抓取；browser-use 和 Stagehand 讓 agent 操作頁面；Steel Browser 提供瀏覽器環境本身。星數第一的 Firecrawl 和最後一名的 Steel Browser 解決的不是同一個問題，所以不能直接用星數排名選。先決定你缺的是哪一層，再比較同一層的幾個。

想看這類基礎設施怎麼比，可以接著讀[Browserbase 的瀏覽器基礎設施介紹](/posts/ai/2026-08-22-browserbase-browser-infrastructure)和[AI 網頁抓取工具全景](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape)。

## 限制

- **星數是快照，不是品質。** 星數代表熱度，清單給的是描述、星數與 repo 狀態，沒有品質或安全評估。收錄也不是背書。
- **分類粒度不一。** AI Agents 有一百多個，Prompt Engineering 只有一個；同一個專案掛多類，是提交時的選擇。
- **不是每個條目都有 repo 星數。** 例如 MemGPT 和 Zep 連到的是官網，資料檔裡沒有星數，用星數排序時會排在最後。
- **README 很長。** 全部專案卡片都在同一頁，要查資料用 JSON 比捲 README 快。

### 轉述的說法跟清單對得上多少

| 常見說法 | 清單實際的樣子 |
|---|---|
| 分成 36 個類別 | 36 是 `awesome-categories.yaml` 定義的類別數；目前有專案的是 24 類 |
| Cognee 負責長期記憶 | 清單把它歸在 Development Frameworks，不在 Long-Term Memory 的 25 個之內；描述講的是建知識圖譜 |
| Screenpipe 記錄電腦活動給 agent 上下文 | 對得上，它同時掛在四個分類 |
| DSPy、Serena、Stagehand、Steel Browser、Opik、Google ADK 的功能 | 跟上面的清單描述一致 |
| 記憶、瀏覽器、agent loop「已經做好了」 | 清單只能說有人做了並公開 repo，不代表可以直接上線；要自己確認維護狀況 |

想找記憶方案，直接看 Long-Term Memory 那一類更準，再搭配本站的[開源 Agent 記憶框架選型](/posts/ai/2026-09-19-open-source-agent-memory-framework-selection)和 [Mem0 介紹](/posts/ai/2026-08-22-mem0-agent-memory)。

## 怎麼用

1. **先寫一句缺口。** 例如「agent 要能登入網站、抓表格」，對到一到兩個分類，不要從頭逛 README。
2. **用 jq 列出候選。** 把上面範例的分類名稱換成你的，輸出依星數排序。
3. **開前三名的 repo 看三件事。** 授權、最近一次 commit 的日期、open issue 有沒有人回。資料檔每筆也有 `repository_status` 欄位（上表八個專案都是 `active`，全清單有 2 個標為 `archived`），可以當作第一道參考。
4. **同一層才比。** 先確認候選解決的是同一個層級的問題，再比功能。
5. **要選框架就接著讀選型文。** 想從清單的 Development Frameworks 挑 agent 框架，接著看本站的[Agent 框架選型指南](/posts/ai/2026-08-22-agent-framework-selection-guide)。

## 參考資料

- [slavakurilyak/awesome-ai-agents](https://github.com/slavakurilyak/awesome-ai-agents)（README）
- [awesome-agents.json](https://raw.githubusercontent.com/slavakurilyak/awesome-ai-agents/main/awesome-agents.json)（專案資料，本文星數與分類來源）
- [awesome-categories.yaml](https://raw.githubusercontent.com/slavakurilyak/awesome-ai-agents/main/awesome-categories.yaml)（36 個分類定義）
- [Agent 記憶工程系列入門](/posts/ai/2026-09-19-agent-memory-engineering-series-intro)
- [開源 Agent 記憶框架選型](/posts/ai/2026-09-19-open-source-agent-memory-framework-selection)
- [Mem0 介紹](/posts/ai/2026-08-22-mem0-agent-memory)
- [Agent 框架選型指南](/posts/ai/2026-08-22-agent-framework-selection-guide)
- [Browserbase 瀏覽器基礎設施](/posts/ai/2026-08-22-browserbase-browser-infrastructure)
- [AI 網頁抓取工具全景](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape)
