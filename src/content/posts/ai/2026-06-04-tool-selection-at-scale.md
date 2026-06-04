---
title: "幾百個工具怎麼選得準：tool selection 的崩塌曲線與工程解法"
date: 2026-06-04
category: ai
type: deep-dive
tags: [tool-use, ai-agent, mcp, llm, context-engineering]
lang: zh-TW
tldr: "工具一多，選擇準確率不是緩降是崩塌：4→51 個工具從 43% 掉到 2%、10→100+ 個從 78% 掉到 13.62%。根治解法是別一次塞全部——Anthropic Tool Search Tool 用 defer loading + 檢索砍 85% token，Opus 4.5 準確率 79.5%→88.1%。description 品質的效益是條件式的：簡單場景沒差，多工具串接場景 correctness 44%→50%。"
description: "整理 LLM agent 工具規模化的實證數字與工程解法：準確率崩塌曲線、prompt bloat 與 lost-in-the-middle 機制、description 品質的條件式效益（Paragon / Trace-Free+）、tool retrieval（RAG-MCP）、Anthropic Tool Search Tool、namespacing、漸進式揭露與決策樹。"
draft: false
---

MCP 普及後，掛 5 個 server 給 agent 帶來 150 個工具是常態，而真實生態的規模更誇張——MCPVerse（arXiv:2508.16260）收錄了 6,565 個 MCP server、暴露超過 55 萬個工具。問題是：**工具一多，模型選擇準確率不是緩降，是崩塌**。這篇整理崩塌的實證數字、背後兩個機制、description 品質的真實槓桿，以及從 retrieval 到 progressive disclosure 的工程解法。

## 崩塌曲線：實證數字

| 設定 | 小工具集 | 大工具集 | 衰退 |
|---|---|---|---|
| BFCL 行事曆排程，4 → 51 tools | 43% | 2% | −41pt |
| RAG-MCP stress test，10 → 100+ tools | 78% | 13.62% | −82% |
| Llama-3.1-70B（目錄變大，單源數字） | 95% | 20% | −79% |

（第三列引自 vLLM semantic router 的整理，僅單一來源，方向與前兩列一致但確切百分比別當定論。）

兩個機制疊加造成崩塌：

**Prompt bloat**。每個工具的 name + description + schema 都塞進 context——150 個工具光 metadata 就 30k–60k tokens，可吃掉 200k 視窗的 25–30%；有團隊回報 tool metadata 佔掉 40–50% 可用脈絡。

**Decision overhead + lost in the middle**。工具多、功能重疊，「選擇」本身就退化。741 個工具的測試中，**排在中間位置（40–60%）的工具命中率僅 22–52%**，頭尾位置則有 31–32% 的相對優勢——典型的長脈絡位置偏誤。

失敗模式很陰險：模型很少說「我不知道該用哪個」，而是**自信地挑一個聽起來合理但錯的工具**、或用 A 工具的參數呼叫 B 工具——回傳格式仍合法，只是語意錯，難以偵測。

## Description 品質：效益是條件式的

直覺上「description 寫好一點準確率就高」，實證說：**看情境**。

Paragon 的 [ablation 實驗](https://www.useparagon.com/learn/rag-best-practices-optimizing-tool-calling/)（50 個 test case，樣本小、one-shot 設定，當方向參考）把一般 description 對比「額外詳細（加範例 + 回傳 schema）」：**整體幾乎無差**（tool correctness 74.8% vs 74.5%），但**多工具串接任務明顯拉開**——correctness 44.1% → 50%、task completion 37.5% → 50%。

規模更大的證據來自 Trace-Free+（arXiv:2602.20426）：在 150+ 候選工具的實驗中，**純靠改寫 tool 介面**（不動模型）把準確率衰退降低 29.23%、query-level 成功率平均提升 60.89%——而且發現好的 description 有**可學習、可遷移的模式**，不是每個工具各自手調。企業場景的 fine-tuning 研究（arXiv:2412.15660）補上診斷工具：用 confusion matrix 分析，**precision 低的工具會干擾其他工具的選擇、recall 低的工具容易被搶走**——功能邊界不清是 tool confusion 的根源。

綜合判讀：工具少、語意區隔大 → description 的邊際效益低；**工具多、功能重疊、多步串接 → 高槓桿**，是少數能在不換模型、不改架構下顯著提升準確率的手段。具體怎麼寫，站內有 [tool description 硬規則](/posts/tech/2026-05-18-llm-tool-description-hard-rules)與[自動優化 tool description](/posts/ai/2026-06-04-auto-prompt-optimization-tool-descriptions) 兩篇展開。

## 根治解法：別一次塞全部工具

核心思想是**把工具發現（discovery）從生成（generation）解耦**——先用檢索從外部索引挑出 top-k 相關工具，只把這幾個餵給模型。

**RAG-MCP**（arXiv:2505.03275）：每個工具 description 向量化，查詢時檢索。Prompt token 砍超過 50%，tool selection accuracy **43.13% vs 13.62%（3 倍以上）**；新工具只需加進索引、不必 fine-tune。Caveat：工具到「數千」量級時 retriever 自己的 precision 也會掉，且檢索品質直接綁在 description 寫得好不好——retrieval 和 description 是互補，不是二選一。

**Anthropic Tool Search Tool**（[官方文件](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)）：工程上最成熟的版本。所有工具定義照給 API 但標 `defer_loading: true`，Claude 初始只看到 search 工具加少數高頻工具，需要時用 regex 或 BM25 變體搜尋，API 回傳 3–5 個最相關的 `tool_reference` 自動展開。實測 **token 用量降 85%**；大型工具庫評測 **Opus 4 從 49% → 74%、Opus 4.5 從 79.5% → 88.1%**。上限 10,000 工具；官方建議的適用門檻：10+ 工具、工具定義超過 10k tokens、或多 MCP server（200+ 工具）。

**Meta-tool / 漸進式揭露**：不載入全部 schema，改放 `find_tool`（語意找工具）+ `invoke_tool`（執行）兩個 meta 工具。MCP 的 lazy tool hydration 提案 reference 實作把 106 個工具的 metadata 從 54,604 → 4,899 tokens，**省 91%**——與 Claude Skills 同源思路：啟動時只載輕量描述，命中才載全文。

**Namespacing 與分群**：用 `service_resource_action` 前綴（`asana_projects_search`）劃清邊界；Anthropic 實測**前綴 vs 後綴命名對評測有 non-trivial 影響、且因模型而異**——要自己跑 eval 決定。再上一層是 tool groups：把跨 server 工具打包成「Development / QA / Admin」情境集合，agent 只掛需要的群組。

**Routing / 多 agent**：把工具切到專職 sub-agent，每個只持約 5 個工具。Paragon 實測的提醒：routing 對 GPT-4o 幾乎沒差（它本來就選得準），但把 Claude 3.5 Sonnet 的 correctness 從 67.6% → 75.8%——**routing 不是萬靈丹，是補特定模型的弱點**，先 eval 再上。

## 決策樹

```
工具 < ~10、語意清楚
  └─► 只要把 description / 命名寫好，不必上 retrieval

工具定義 >10k tokens，或 10–200+ 工具
  └─► Tool Search Tool / RAG retrieval + defer loading

工具到數千、高頻汰換
  └─► retrieval precision 會掉 → 加階層式 / 分群 / metadata 驅動，或切多 agent

特定模型選不準
  └─► routing / 縮小每 agent 工具數（先 eval 確認有效）
```

不論走哪條路，**最終那 3–5 個候選之間能不能選對，還是回到 description 品質與工具邊界**——retrieval 解決「找得到」，description 解決「選得對」，兩者一起做。

## 整體來說

三句話帶走：第一，工具規模是真問題，準確率崩塌的形狀在多個獨立 benchmark 一致出現，而且失敗是「自信選錯」不是「承認不知道」。第二，description 的投資報酬在多工具、功能重疊的場景才會兌現——先用 confusion matrix 找出互相干擾的工具對，把邊界寫清楚。第三，超過十個工具就該認真考慮 defer loading + 檢索——85% 的 token 節省和 8.6 個百分點的準確率提升，是目前性價比最高的一刀。

## 參考資料

- [Anthropic — Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Claude Docs — Tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)
- [RAG-MCP: Mitigating Prompt Bloat in LLM Tool Selection（arXiv:2505.03275）](https://arxiv.org/abs/2505.03275)
- [Learning to Rewrite Tool Descriptions / Trace-Free+（arXiv:2602.20426）](https://arxiv.org/abs/2602.20426)
- [Enterprise-Scenario Function-Calling（arXiv:2412.15660）](https://arxiv.org/abs/2412.15660)
- [MCPVerse（arXiv:2508.16260）](https://arxiv.org/abs/2508.16260)
- [Paragon — Optimizing Tool Calling](https://www.useparagon.com/learn/rag-best-practices-optimizing-tool-calling/)
- [Paragon — Optimize and Scale Your AI Agent's Tool Calling](https://www.useparagon.com/learn/optimizing-tool-performance-and-scalability-for-your-ai-agent/)
- [MCP Issue #1978 — lazy tool hydration](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1978)
