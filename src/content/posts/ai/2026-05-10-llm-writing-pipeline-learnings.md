---
title: "別人怎麼用 LLM 寫文章：從 Karpathy LLM-wiki 到多 agent pipeline 的取捨筆記"
date: 2026-05-10
type: deep-dive
category: ai
tags: [llm-writing, content-pipeline, claude-code, agent-skills, llm-wiki, geo, multi-agent, harness-engineering]
lang: zh-TW
tldr: "綜述 11 個公開的 LLM 寫作 pipeline，三條主流模式：多 agent（researcher → writer → critic）、Karpathy LLM-wiki（raw + wiki + LLM 寫不手寫）、品質防線（technical verifier + never fabricate + brief gate）。Princeton GEO 論文（KDD 2024）量化了 inline 引用 +28%、加數字 +33%、quote 原文 +41%、關鍵字塞詞 −9%。"
description: "整理 Karpathy LLM-wiki、Paul Iusztin Nova、Dheeraj Sharma 技術 verifier、xnor.ca 紀律等 11 個 LLM 寫作 pipeline 的設計取捨，並對照 Princeton GEO 論文（arxiv 2311.09735）的量化發現。"
draft: false
---

把「研究新工具 → 寫成導讀文」做成 pipeline 已經不是新鮮事，但實作差異很大。這次研究 11 個公開的 LLM 寫作 pipeline，從 Karpathy 個人 wiki、Paul Iusztin 的 Nova、Dheeraj Sharma 的 technical verifier、到 rzlt.io 的 8-step 商用流程。三條主流設計模式很清楚，每條都有量化證據支撐。

## 主流模式一：多 agent（researcher → writer → critic）

最普遍的設計，從 CrewAI、Google ADK、Amazon Strands 到 quidproquo 自己的 RAG chat graph 都是這個結構。Google 在 [Developer's guide to multi-agent patterns in ADK](https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/) 裡把它叫 **Generator and critic（編輯桌模式）**：

> One agent acts as the Generator, producing a draft, while a second agent acts as the Critic, reviewing it against specific, hard-coded criteria or logical checks.

Paul Iusztin 在 [How I Automated 91% of My Business with AI Agents](https://www.decodingai.com/p/how-i-automated-91-percent-of-my-business) 裡把這套發展成兩個獨立 agent：**Nova**（deep research）+ **Brown**（writing workflow）。Nova 的設計值得抄：

- 使用者先給 5-10 個「golden source seeds」（不是讓 agent 從零搜）
- 三輪 gap analysis（Iusztin 明說「Three rounds hits the cost-versus-coverage sweet spot」）
- 兩階段 filtering：top 5 全文抓、其餘只留 summary，用四維度評分（trust / authority / relevance / quality）

quidproquo 的 RAG chat（progress.txt 裡的 `planner → research → normalize → writer → critic → related` graph）已經是這個模式，但**只用在讀者端**。寫作端目前是手動單線（人手點頭再下一步），這是有意的紀律——自動 generator-critic 迴圈在創作場景容易跑偏，xnor.ca 的踩坑紀錄會說明為什麼。

## 主流模式二：Karpathy LLM-wiki

[Andrej Karpathy 在 2026 年 4 月發的 gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) 累計超過 100 個衍生實作，VentureBeat 把它稱為 [autonomous archive 模式](https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an)。核心三層：

```
┌──────────────────────────────────┐
│ CLAUDE.md / 規則                 │  ← 教 LLM 怎麼維護
├──────────────────────────────────┤
│ Layer 2: wiki/  (LLM owns)       │  ← LLM 寫，人讀
│  ├── Entity pages                │
│  ├── Concept pages               │
│  └── index.md / log.md           │
├──────────────────────────────────┤
│ Layer 1: raw/  (Immutable)       │  ← 人放，LLM 只讀
│  ├── PDFs / Articles             │
│  └── Transcripts / Notes         │
└──────────────────────────────────┘
```

Karpathy 自己的描述：「You rarely ever write or edit the wiki manually; it's the domain of the LLM.」這是它跟 RAG 的核心差別——RAG 每次查詢都從零拼答案，LLM-wiki 把工夫花在 ingest 階段一次做完，後續查詢直接讀已經結構化的 wiki。

[Ditto 公司的內部實作](https://www.ditto.com/blog/llm-wiki-for-ditto) 把它落地成三個固定操作：

| 操作 | 做什麼 |
|---|---|
| `ingest` | 讀 source、抽 entity 與 fact、建/更新 wiki 頁、記 log |
| `query` | 搜 wiki、產生帶引用的回答、可選擇把有用結果回填 |
| `lint` | 健康檢查：找矛盾、孤兒頁、過期主張、漏連結 |

Paul Iusztin 在 [LLM Knowledge Base I Built on My Second Brain](https://www.decodingai.com/p/llm-knowledge-base-obsidian-readwise-notebooklm) 把這個延伸成三個 Claude Code skill：`/research_create`、`/research_search`、`/research_distill`。最後那個特別有意思——**只把真正用到的來源從 memory 萃取出來，做成 portable `research.md` 附錄**，比例大約 15-20 / 62 sources。研究蒐集很多、實際寫文用很少，這個 distill 步驟避免最後參考資料變成噪音。

對 quidproquo 來說，`.research/` 目錄已經有了（前一篇 deep-research skill 就是這個結構），但還沒做到 wiki 化。一人寫作累積規模不到，先觀察使用 12-24 個月再決定。

## 主流模式三：品質防線

最值得學的是這條。三個獨立來源都收斂到同一條原則：**reviewer 永不 auto-fix、generator 永不 fabricate**。

[Dheeraj Sharma 的 Technical Verifier Claude subagent](https://genaiunplugged.substack.com/p/claude-code-subagent-technical-content-verification) 抓的就是 LLM 寫作最大破口——版本號、API、定價過時。他的設計流程：

> The agent reports issues but NEVER auto-fixes. Is this a critical error or a minor nitpick? Should you rewrite the section or add a disclaimer? That's your call, not the agent's.

實際抓到的例子：「GPT-4 costs 10x more」過時——當時 OpenAI 已下線「GPT-4」這個型號，現役是 GPT-5.2 / GPT-4.1，input 定價跟 Claude Sonnet 持平 $3.00/M tokens。**人讀過去看不出問題，因為敘述句法都對；只有對著官方文件比才發現事實過時**。手動逐條驗證 30+ 分鐘的事，他做成 90 秒的 agent。

[xnor.ca 的 Round 2 寫作日誌](https://xnor.ca/posts/2026-02-09-writing-with-claude/) 從另一頭看到問題。第一次跑 Claude 寫部落格 12 小時、發現兩個災難：

1. **Fabricated facts**：Claude 編造了 JTS 的 debugging 步驟（"reconnecting segments by proximity, merging nearby endpoints"）——實際 git history 裡完全沒這些。「The default behavior was to fill narrative gaps with plausible-sounding details instead of saying 'I don't have this information.'」
2. **Algorithm logic backwards**：寫到 Z 軸最佳化邏輯時，方向講反了；連看過 source code 還是錯。最後作者自己改才修對。

他的 Round 2 做了一條紀律寫進指令：**Never fabricate. If facts are missing, flag the gap.**「Say 'I don't have information about what was tried here' rather than inventing debugging attempts」。這句要寫死進 system prompt 或 skill 裡，不能靠 LLM 自覺。

[Kaz Sato 在 Google Cloud blog](https://medium.com/google-cloud/supercharge-tech-writing-with-claude-code-subagents-and-agent-skills-44eb43e5a9b7) 把這個紀律延伸到 source-code-aware 的 reviewer：他的 `adk-reviewer` 會直接讀 google-adk Python SDK 原始碼，抓出文章裡跟實作對不上的地方——31 個漏掉的 issue，包括 deprecated 參數與設計意圖誤解。

第三層防線是 [rzlt.io 8-step pipeline](https://www.rzlt.io/blog/claude-code-automating-long-form-content-creation) 強調的 **brief 閘門**：「If the brief is weak, the article will be weak. This separation matters.」不寫文章本身先寫 brief（meta title / meta description / target keywords / heading structure / FAQ schema），brief 過了再進寫作。Max Mitcham 在 [60-day blog agent 文](https://maxmitcham.substack.com/p/how-i-rank-1-in-claude-chatgpt-and) 也是同樣設計：「When I say 'let's write a blog about X', the agent doesn't just start writing. It interviews me. ... If my answers are thin, it pushes back.」

## GEO：寫法本身會影響可見度

寫好內容只是第一步——能不能被 ChatGPT / Claude / Perplexity 引用是第二步。Princeton + Georgia Tech + Allen AI + IIT Delhi 在 [KDD 2024 發表的 GEO 論文](https://arxiv.org/abs/2311.09735)（arxiv 2311.09735）跑了 10,000 query 的 GEO-bench 測試 9 種寫法，結論很具體：

| 寫作技巧 | Position-Adjusted Word Count 提升 |
|---|---|
| Quotation Addition（直接 quote 權威原文） | **+41%** |
| Statistics Addition（用具體數字） | **+33%**（Perplexity 上實測 +37%） |
| Fluency Optimization（簡潔通順） | **+29%** |
| Cite Sources（inline 標來源） | **+28%** |
| Easy-to-Understand（簡化語言） | +14% |
| Authoritative（權威語氣） | +12% |
| Unique Words / Technical Terms | +6% / +18% |
| **Keyword Stuffing（關鍵字塞詞）** | **−9%（懲罰）** |

論文也跑了 [Perplexity.ai 真實環境的對照](https://arxiv.org/html/2311.09735v3)：「demonstrate visibility improvements up to 37%」，方向跟 lab 結果一致。

特別值得注意的是 **位置在 SERP 第 5 名的網站，加 Cite Sources 後可見度 +115.1%**——對 quidproquo 這種非首頁的個人 blog 影響最大。傳統 SEO 強調的關鍵字密度在 GEO 直接被打折扣。

實務做法：把 [Anthropic Skills 指南](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) 那種文章寫法當基線——引用文件原文、給具體版本號、結構分明、流暢度優先。

## quidproquo 的取捨：哪些採納、哪些不採

對照下來，quidproquo 已有的 skill 體系（post / post-update / post-translate / post-review / post-verify / deep-research / tag-audit / deploy-preflight）已經覆蓋多數模式。具體取捨：

**採納（已落實或將補強）**：

- ✅ **多 agent pipeline**：RAG chat 端已實作（planner → research → writer → critic）；寫作端維持手動 review-at-each-step
- ✅ **never fabricate / never auto-fix**：post-review、post-verify 的 SKILL.md 都明文寫死
- ✅ **GEO 規則**：已寫進 `writing-guide.md`，post-review skill 會檢查
- ✅ **technical verifier**：post-verify skill 對版本 / API / 價格做 fact-layer cross-check

**先不採納**：

- ❌ **全自動 publish pipeline**（Khaled Zaky 的 Lambda → GitHub commit → deploy）——quidproquo 是 Cloudflare Workers + Astro SSR + 個人寫作，現有 `git commit + pnpm deploy` 流程已輕，多寫一層沒必要
- ❌ **月度 SEO audit + auto-refresh**（rzlt.io 的 GSC MCP feed → 3 個月翻新）——規模不到，手動 post-update 夠用
- ❌ **完整 LLM-wiki 套到 `.research/`**——一人寫作可能 over-engineering，先觀察 12-24 個月

**選擇性採納（看用幾次自然決定）**：

- 🟡 **Brief 閘門（rzlt.io / Max Mitcham 模式）**：對深度導讀有價值，但對隨手筆記是負擔。先觀察 deep-research skill 用幾次，自然累積夠多素材時再做成 `post-brief` skill
- 🟡 **Voice profile 抽取**：Khaled Zaky 從 20 篇抽 voice profile，quidproquo 已有 100+ 篇可用。值得做但不必每次寫文都跑——一次性 `pnpm voice:extract` 腳本更合適
- 🟡 **Research distill 模式**：發文前掃 `## 參考資料` 剃掉沒真正引用的——可以併入 `post-review`，不必獨立 skill

## 整體來說

11 個公開 pipeline 看下來，對「個人寫作站」最實用的反而不是最炫的多 agent 編舞，而是三條紀律：

1. **Reviewer 永不 auto-fix，Generator 永不 fabricate**——這是 LLM 寫作品質的下限
2. **Brief 與寫作分開**——brief 弱就退回，不要先寫了再說
3. **GEO 規則寫進 style guide 自動套**——加數字、quote 原文、別塞關鍵字，量化證據都在 Princeton 論文裡

剩下的多 agent 框架、自動 publish、月度 refresh，都是規模問題。先做完上面三件，再看真實使用累積出哪一個是 bottleneck。

對 quidproquo 自己的 skill 家族，下一步是把 `post-verify` 拿來實際跑兩三篇，看 cross-check 報告對不對得起手動驗證的結果，再決定要不要把更多 GEO 規則寫死進 post-review 的硬性檢查（目前是建議型）。

## 參考資料

- [GEO: Generative Engine Optimization (arxiv 2311.09735, KDD 2024)](https://arxiv.org/abs/2311.09735) — Aggarwal, Murahari, Rajpurohit, Kalyan, Narasimhan, Deshpande
- [Princeton 收錄頁](https://collaborate.princeton.edu/en/publications/geo-generative-engine-optimization/)
- [Performance Department：GEO paper plain-English breakdown](https://performancedepartment.nl/en/blog/geo-paper-generative-engine-optimization)
- [Andrej Karpathy 的 LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [VentureBeat：Karpathy LLM Knowledge Base architecture 解讀](https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an)
- [Ditto：Building an LLM Wiki](https://www.ditto.com/blog/llm-wiki-for-ditto)
- [Paul Iusztin：How I Automated 91% of My Business with AI Agents（Nova + Brown）](https://www.decodingai.com/p/how-i-automated-91-percent-of-my-business)
- [Paul Iusztin：The LLM Knowledge Base I Built on My Second Brain（research_create / search / distill）](https://www.decodingai.com/p/llm-knowledge-base-obsidian-readwise-notebooklm)
- [Dheeraj Sharma：Technical Verifier Claude Subagent](https://genaiunplugged.substack.com/p/claude-code-subagent-technical-content-verification)
- [xnor.ca：Writing Blog Posts with Claude Code Round 2（never fabricate）](https://xnor.ca/posts/2026-02-09-writing-with-claude/)
- [Kaz Sato (Google Cloud)：Tech writing with subagents and agent skills](https://medium.com/google-cloud/supercharge-tech-writing-with-claude-code-subagents-and-agent-skills-44eb43e5a9b7)
- [rzlt.io：Claude Code 8-step long-form content pipeline](https://www.rzlt.io/blog/claude-code-automating-long-form-content-creation)
- [Max Mitcham：60-day blog agent with Hermes + OpenClaw](https://maxmitcham.substack.com/p/how-i-rank-1-in-claude-chatgpt-and)
- [Khaled Zaky：AI agent that writes/revises/publishes via email trigger](https://khaledzaky.com/blog/i-built-an-ai-agent-that-writes-for-my-blog/)
- [Google Developers：Multi-agent patterns in ADK](https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/)
- 站內相關：
  - [Claude Skills：把專業知識打包成資料夾](/posts/ai/2026-05-08-anthropic-claude-skills-guide)
  - [用 LLM 做知識管理：從 Karpathy llm-wiki 到開源生態全覽](/posts/ai/2026-04-23-llm-knowledge-management-landscape)
  - [Skill vs Subagent：Claude Code 兩種 Agent 協作模式比較](/posts/ai/2026-03-30-skill-vs-subagent-comparison)
