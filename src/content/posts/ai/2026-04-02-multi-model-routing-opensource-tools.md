---
title: "Multi-Model Routing 開源工具與實作：讓對的模型做對的事"
date: 2026-04-02
category: ai
tags: [multi-model-routing, llm-router, cost-optimization, agent-router, freerouter, ruflo]
lang: zh-TW
tldr: "透過多模型路由，將 70% 的簡單任務導向便宜模型，只讓 10-15% 的複雜任務使用旗艦模型，實測節省 40-85% 推論成本。本文介紹五個主要開源工具的架構與實作。"
description: "深入介紹 ruflo、iblai-openclaw-router、freerouter、agent-router、NVIDIA llm-router 等開源多模型路由工具的架構設計、評分機制與實際部署方式。"
draft: false
---

## 為什麼需要模型路由

不是每個任務都需要 Opus。實際觀察開發者的日常使用，任務複雜度大致呈現這樣的分布：

| 複雜度 | 佔比 | 適合模型 | 範例 |
|--------|------|----------|------|
| 簡單 | ~70% | Haiku | 修 typo、寫 commit message、格式化 |
| 中等 | ~15-20% | Sonnet | 重構函式、寫測試、code review |
| 複雜 | ~10-15% | Opus | 架構設計、跨系統除錯、大規模重構 |

盲目使用旗艦模型，等於 70% 的花費是浪費。團隊實測報告顯示，導入多模型路由後節省 40-85% 推論成本：

- 輕度使用者：$200/月 → $70/月
- 重度使用者：$943/月 → $347/月

關鍵不是「少用 AI」，而是「讓對的模型做對的事」。

## 路由策略比較

### 有效的策略

**Budget Ladder（預算階梯）**：從最便宜的模型開始，驗證輸出品質，品質不足時自動升級。優點是保守且安全，缺點是多次呼叫會增加延遲。

**Classifier Routing（分類路由）**：先分析任務複雜度（<1ms），一次路由到正確的模型。速度快、路徑短，是目前主流做法。

### 不要踩的坑

- **按檔案類型路由**：`.py` 不代表簡單，`.md` 不代表不需要推理。任務複雜度跟檔案類型無關。
- **超過三層分級**：三層（Quick / Standard / Deep）已經足夠。更多層級只會增加分類錯誤率，收益遞減。

## 五個開源路由工具

### 1. ruflo（ruvnet/ruflo）

Claude 專用的 agent 編排框架。透過 CLI 指令直接推薦模型：

```bash
# 修 typo → Haiku
ruflo route "fix the typo in README.md"
# → recommended: claude-haiku | confidence: 0.95

# 架構設計 → Opus
ruflo route "design a distributed event sourcing system"
# → recommended: claude-opus | confidence: 0.91
```

核心特色：
- **Agent Swarms**：多個 agent 協作，各自使用適合的模型
- **RAG 整合**：結合知識庫上下文來判斷路由
- **原生整合**：直接嵌入 Claude Code 和 Codex 的工作流程

### 2. iblai-openclaw-router

14 維度加權評分器，分類延遲 <1ms。不靠 LLM 判斷，純規則引擎：

```python
scores = {
    "token_count": 0.72,        # 輸入 token 數
    "code_presence": 0.85,      # 是否包含程式碼
    "reasoning_markers": 0.60,  # 推理關鍵字密度
    "technical_terms": 0.45,    # 技術術語密度
    # ... 共 14 個維度
}
# 加權總分 → 路由到 Haiku / Sonnet / Opus
```

實測結果：只有約 15% 的流量需要最貴的模型。多數請求在 Haiku 層就能處理。

### 3. freerouter（openfreerouter/freerouter）

自架版的 OpenRouter 替代方案。同樣使用 14 維度分類器，但完全自託管、無中間商。

| 分類 | 路由目標 | 成本 |
|------|----------|------|
| SIMPLE | Kimi K2.5 | 近乎零成本 |
| MEDIUM | Sonnet 4.5 | 中等 |
| COMPLEX | Opus 4.6 | 高 |
| REASONING | Opus 4.6 | 高 |

支援手動覆寫，在 prompt 中加入指令即可：

```
/max 請幫我設計微服務架構    # 強制使用最強模型
[simple] 幫我修正拼字錯誤   # 強制使用最便宜模型
```

實測節省 60-80% 成本。沒有中間商抽成，API key 直連各家供應商。

### 4. agent-router（dabit3/agent-router）

專注多 agent 任務路由的框架，四種路由模式：

- **成本最佳化**：簡單任務 → 便宜模型，複雜任務 → 強力模型
- **延遲路由**：時間敏感任務 → 回應最快的模型
- **專長路由**：程式任務 → coding agent，研究任務 → research agent
- **負載平衡**：自動分散流量，故障時自動重試與 failover

```typescript
const router = new AgentRouter({
  agents: [
    { name: "coder", model: "claude-sonnet", specialty: "code" },
    { name: "researcher", model: "claude-opus", specialty: "research" },
    { name: "assistant", model: "claude-haiku", specialty: "general" },
  ],
  strategy: "cost-optimized", // or "latency", "specialized", "load-balanced"
});
```

### 5. NVIDIA llm-router

NVIDIA 官方藍圖，提供企業級的模型路由方案。分析 prompt 意圖後路由到最適合的模型：

- 困難問題 → GPT-5
- 閒聊 → Nemotron Nano
- 可調整的 trade-off：準確度 vs 速度 vs 成本

適合已有 NVIDIA 基礎設施的企業團隊。

## 14 維度評分器詳解

多數開源路由器（freerouter、iblai-openclaw-router）都使用類似的 14 維度評分機制：

| # | 維度 | 說明 | 高分 → 路由 |
|---|------|------|------------|
| 1 | Token count | 輸入長度 | 長文 → 強模型 |
| 2 | Code presence | 是否含程式碼 | 有 → 中高階 |
| 3 | Reasoning markers | 「why」「analyze」「design」等關鍵字 | 多 → 強模型 |
| 4 | Technical term density | 專業術語密度 | 高 → 強模型 |
| 5 | Context length | 對話上下文長度 | 長 → 強模型 |
| 6 | Output sensitivity | 輸出精確度需求 | 高 → 強模型 |
| 7 | Conversation depth | 對話輪數 | 多 → 強模型 |
| 8 | Instruction complexity | 指令複雜度 | 高 → 強模型 |
| 9 | Multi-step indicators | 多步驟任務標記 | 有 → 強模型 |
| 10 | Domain specificity | 領域專屬程度 | 高 → 強模型 |
| 11 | Ambiguity level | 模糊程度 | 高 → 強模型 |
| 12 | Creativity requirement | 創意需求 | 高 → 強模型 |
| 13 | Precision requirement | 精確度需求 | 高 → 強模型 |
| 14 | Time sensitivity | 時間敏感度 | 高 → 快模型 |

每個維度 0-1 分，加權後得到總分，對應到三個 tier。權重可依團隊實際使用情境調整。

## 自建路由器的架構建議

如果現有工具不完全符合需求，自建路由器的推薦架構：

```
使用者請求
    │
    ▼
┌──────────────┐
│  Classifier  │  ← 用最便宜的模型（Haiku）做分類
│  (<1ms 規則)  │    或 <1ms 的規則引擎
└──────┬───────┘
       │
  ┌────┼────┐
  ▼    ▼    ▼
Quick  Std  Deep
Haiku  Son  Opus
  │    │    │
  └────┼────┘
       ▼
   回傳結果
```

**實作重點**：

1. **用最便宜的模型當分類器**：Haiku 分類一次的成本可以忽略不計，或直接用規則引擎（正則 + token 計數）達到 <1ms。
2. **只分三層**：Quick（即時回應）、Standard（一般任務）、Deep（深度推理）。三層以上收益遞減。
3. **支援手動覆寫**：讓使用者可以用 `/max` 或 `/quick` 強制指定層級，保留控制權。
4. **監控 tier 使用比例**：如果 Deep tier 超過 20%，代表閾值太鬆，需要調整。理想比例是 70/20/10。

## 延伸資源

更多開源多模型路由專案：

- [github.com/topics/llm-router](https://github.com/topics/llm-router)
- [github.com/topics/ai-router](https://github.com/topics/ai-router)

## 系列文章

- [Agent CLI 訂閱制與多模型路由完整指南](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing/)

## 參考資料

- [The Multi-Model Routing Pattern: Cut AI Agent Costs by 78% | DEV Community](https://dev.to/askpatrick/the-multi-model-routing-pattern-how-to-cut-ai-agent-costs-by-78-1631)
- [Building CostRouter — Route AI requests to the cheapest capable model | DEV Community](https://dev.to/rizzel7/building-costrouter-route-ai-requests-to-the-cheapest-capable-model-automatically-58gd)
- [How to Optimize AI Agent Token Costs with Multi-Model Routing | MindStudio](https://www.mindstudio.ai/blog/ai-agent-token-cost-optimization-multi-model-routing)
- [ruflo | GitHub](https://github.com/ruvnet/ruflo)
- [iblai-openclaw-router | GitHub](https://github.com/iblai/iblai-openclaw-router)
- [freerouter | GitHub](https://github.com/openfreerouter/freerouter)
- [agent-router | GitHub](https://github.com/dabit3/agent-router)
- [NVIDIA LLM Router Blueprint | GitHub](https://github.com/NVIDIA-AI-Blueprints/llm-router)
