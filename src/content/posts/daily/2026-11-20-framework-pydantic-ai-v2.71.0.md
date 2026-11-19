---
title: "框架更新｜Pydantic AI v2.71.0"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.71.0 一次補上十幾個 harness 原語，核心是讓無人值守的長任務知道還剩多少預算、該不該收尾，以及要不要把工具錯誤直接丟給模型處理"
tldr: "Pydantic AI v2.71.0 最大的變化是 harness 層一次新增超過十個原語：Goal 讓任務跑到真正達標才收工，WrapUpAtLimits／ReportRemainingBudget 處理用量上限前的收尾，PermissionRule／RequireVerification 把權限與驗證規則化。唯一的 breaking change 是 PeerNetwork 改名成 PeerConnection。"
series:
  name: "AI Framework Changelog"
  order: 71
---

> 🌏 [English version](/posts/daily/2026-11-20-framework-pydantic-ai-v2.71.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.71.0 |
| 前一版 | [v2.70.0](/posts/daily/2026-11-19-framework-pydantic-ai-v2.70.0) |
| 發布日 | 2026-11-18 |
| Release Notes | [v2.71.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.71.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21.3k |

## 這個版本為什麼重要

上一版（v2.70.0）修的是兩個資安漏洞，這一版把重心換回功能，而且是這幾週以來單次新增原語數量最多的一版：十幾個新能力幾乎全部掛在 Harness 底下，主題也很一致——讓「沒人盯著跑」的長任務知道自己還剩多少預算、該不該收尾、遇到錯誤要不要自己處理，而不是整條任務悄悄爆掉或硬被砍斷。對照 v2.69、v2.70 兩篇文章提到的沙箱與安全強化，Pydantic AI 現在補的是「agent 自己管理自己的執行狀態」這塊，三版加起來看得出同一條主軸：把 harness 從「跑 agent 的殼」變成「agent 可以查詢、依賴的執行環境」。唯一的 breaking change 是一個類別改名，衝擊範圍很小。

## 重要變更

- **Goal**：讓無人值守的 run 持續跑到呼叫端定義的完成條件通過為止，不是跑完固定輪數就停 → 長任務可以設「真的達標才收工」，而不是用輪數或 token 數硬性限制
- **WrapUpAtLimits**：usage limit 快到頂時讓 agent 收個結論作答，不再直接丟 `UsageLimitExceeded` → 長任務碰到用量上限不會連一個可用的輸出都拿不到
- **ReportRemainingBudget**：每次呼叫前就把剩餘的 usage limit 和花費預算回報給模型 → 模型自己能決定要不要提早收尾或壓縮回答，而不是等外部硬性中斷
- **PermissionRule**：用規則判斷工具呼叫和 shell 指令要「允許、詢問還是拒絕」 → 權限控制不用再寫一堆條件判斷，宣告式規則就能收斂成一份清單
- **RequireVerification**：coding agent 想在還沒跑過驗證（測試、lint）前結束時，把它送回去先跑驗證 → 避免「看起來做完了但其實沒驗證過」的輸出被當成完成品
- **ToolBridge**：把工具列表固定在 `tool_search`／`tool_describe`／`tool_call` 背後，不隨實際工具數量變動 → 工具很多或常態新增時，prompt cache 不會因為工具列表變了就整個失效
- **ReportToolErrors**：工具丟出沒處理的例外時，把錯誤當成失敗的工具結果回報給模型，而不是直接中斷整個 run → 一次工具出錯不會讓整條長任務作廢
- **ReportStaleFiles**：工作區檔案被外部改動或刪除時，主動告知模型，不是讓它拿著過期內容繼續推理
- **LabelCrossModelHistory**：標記對話歷史裡哪些回覆來自另一個模型 → 換模型接手長對話時，新模型知道哪些上下文不是自己產生的
- **ModelRouter**：讓同一個 agent run 依規則把請求路由到不同模型 → 簡單步驟用便宜模型處理，貴的模型只留給真正需要的步驟

下圖把這批新原語按作用分成三類，各舉一個代表性例子：

```diagram
title: Pydantic AI v2.71.0 新增的 Harness 原語分類
desc: 這版新增的 harness 能力分成預算與終止、權限與驗證、工具與情境三類，各舉一個代表原語，其餘列在正文。
caption: 簡化示意，每類只標代表性原語；完整清單見上方「重要變更」。
---
<svg viewBox="0 0 720 296">
  <path class="dg-line" d="M360 84V106"/>
  <path class="dg-line" d="M120 106H600"/>
  <path class="dg-line" d="M120 106V128"/>
  <path class="dg-line" d="M360 106V128"/>
  <path class="dg-line" d="M600 106V128"/>
  <path class="dg-line" d="M120 184V232"/>
  <path class="dg-line" d="M360 184V232"/>
  <path class="dg-line" d="M600 184V232"/>

  <rect class="dg-box dg-box--accent" x="240" y="20" width="240" height="64" rx="6"/>
  <text class="dg-label" x="360" y="43" text-anchor="middle" dominant-baseline="central">Harness 原語</text>
  <text class="dg-sub" x="360" y="64" text-anchor="middle" dominant-baseline="central">v2.71.0 新增三類能力</text>

  <rect class="dg-box" x="20" y="128" width="200" height="56" rx="6"/>
  <text class="dg-label" x="120" y="147" text-anchor="middle" dominant-baseline="central">預算與終止</text>
  <text class="dg-sub" x="120" y="168" text-anchor="middle" dominant-baseline="central">剩多少預算、何時收尾</text>

  <rect class="dg-box" x="260" y="128" width="200" height="56" rx="6"/>
  <text class="dg-label" x="360" y="147" text-anchor="middle" dominant-baseline="central">權限與驗證</text>
  <text class="dg-sub" x="360" y="168" text-anchor="middle" dominant-baseline="central">用規則允許、詢問或拒絕</text>

  <rect class="dg-box" x="500" y="128" width="200" height="56" rx="6"/>
  <text class="dg-label" x="600" y="147" text-anchor="middle" dominant-baseline="central">工具與情境</text>
  <text class="dg-sub" x="600" y="168" text-anchor="middle" dominant-baseline="central">錯誤與情境都回報給模型</text>

  <rect class="dg-box" x="36" y="232" width="168" height="48" rx="6"/>
  <text class="dg-label" x="120" y="247" text-anchor="middle" dominant-baseline="central">Goal</text>
  <text class="dg-sub" x="120" y="268" text-anchor="middle" dominant-baseline="central">跑到達標才收工</text>

  <rect class="dg-box" x="276" y="232" width="168" height="48" rx="6"/>
  <text class="dg-label" x="360" y="247" text-anchor="middle" dominant-baseline="central">PermissionRule</text>
  <text class="dg-sub" x="360" y="268" text-anchor="middle" dominant-baseline="central">判斷允許/詢問/拒絕</text>

  <rect class="dg-box" x="516" y="232" width="168" height="48" rx="6"/>
  <text class="dg-label" x="600" y="247" text-anchor="middle" dominant-baseline="central">ToolBridge</text>
  <text class="dg-sub" x="600" y="268" text-anchor="middle" dominant-baseline="central">工具列表固定不變</text>
</svg>
```

## Breaking Changes

- `PeerNetwork` 改名為 `PeerConnection`，同時讓 `Peers(network)` 用 agent 的 `name` 加入 `InMemoryPeerNetwork`
  - 影響範圍：直接 import `PeerNetwork` 或依賴它的類別名稱的多 agent 程式碼

本版沒有其他會改變既有呼叫方式的破壞性異動；其餘變更都是新增能力或內部效能修補。

## 遷移指南

### 從 2.70.x 升級到 2.71.0

```bash
pip install --upgrade pydantic-ai==2.71.0
```

```python
# 舊寫法（<=2.70.x）
from pydantic_ai.multi_agent import PeerNetwork
network = PeerNetwork(agents=[agent_a, agent_b])

# 新寫法（2.71.0+）
from pydantic_ai.multi_agent import PeerConnection
network = PeerConnection(agents=[agent_a, agent_b])
```

其餘新增的 harness 原語（`Goal`、`PermissionRule`、`ReportRemainingBudget` 等）都是加法：不主動啟用就不影響既有程式碼，直接升級即可。

## 與其他框架的對比觀察

同一週 [CrewAI 1.15.44](https://github.com/crewAIInc/crewAI/releases/tag/1.15.44) 加的是「把檔案存成有版本、可分享的 artifact」這種單一功能，[LangGraph 1.2.23](https://github.com/langchain-ai/langgraph/releases/tag/1.2.23) 這週則完全是 bug fix，沒有新功能。相比之下 Pydantic AI 這版一次補十幾個原語，而且全部聚焦在「agent 自己管理執行狀態」——這和 CrewAI 的角色導向高階 API、LangGraph 的 graph-level 精細控制是不同的切入點：Pydantic AI 把賭注押在「能不能讓 agent 無人看管地跑很久、跑到真的達標而不失控」這件事上，這一塊目前還沒有其他框架補到這麼細。

## 今日收穫

之前以為框架之間的差異主要是「開發介面」——宣告式、graph 式還是角色導向。看到 Pydantic AI 一次塞進十幾個像 `Goal`、`ReportRemainingBudget`、`RequireVerification` 這種聽起來很瑣碎的原語才意識到：等 agent 真的要無人值守跑很久，差異會從「怎麼定義 agent」轉移到「agent 能不能自己知道『我還能跑多久』『我是不是真的做完了』」——這批原語補的正是這塊，而且是目前看到投入最明確的一家。

## 參考資料

- [Pydantic AI v2.71.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.71.0)
- [Full Changelog: v2.70.0...v2.71.0](https://github.com/pydantic/pydantic-ai/compare/v2.70.0...v2.71.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #13733：Goal](https://github.com/pydantic/pydantic-ai/pull/13733)
- [PR #13670：WrapUpAtLimits](https://github.com/pydantic/pydantic-ai/pull/13670)
- [PR #13747：ReportRemainingBudget](https://github.com/pydantic/pydantic-ai/pull/13747)
- [PR #13751：PermissionRule](https://github.com/pydantic/pydantic-ai/pull/13751)
- [PR #13753：RequireVerification](https://github.com/pydantic/pydantic-ai/pull/13753)
- [PR #13744：ToolBridge](https://github.com/pydantic/pydantic-ai/pull/13744)
- [PR #13745：ReportToolErrors](https://github.com/pydantic/pydantic-ai/pull/13745)
- [PR #13777：PeerNetwork 改名為 PeerConnection](https://github.com/pydantic/pydantic-ai/pull/13777)
- [CrewAI 1.15.44 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.44)
- [LangGraph 1.2.23 Release Notes](https://github.com/langchain-ai/langgraph/releases/tag/1.2.23)
- [Pydantic AI v2.70.0 更新（上一版：兩個 ReDoS 安全公告）](/posts/daily/2026-11-19-framework-pydantic-ai-v2.70.0)
