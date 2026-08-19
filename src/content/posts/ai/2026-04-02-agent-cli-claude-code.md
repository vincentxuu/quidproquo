---
title: "Claude Code 完整方案分析：終端 Agent 的深度推理之王"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, claude-code, pricing, subagent, anthropic]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 3
tldr: "Claude Code 從 $20/mo Pro 到 $200/mo Max 20x，額度以 5 小時滾動視窗計算並疊加週上限，Claude 網頁／桌面／終端共用同一個池子。額度用完可選擇改走 API 費率的 usage credits 繼續做事，而不是硬停。"
description: "分析 Claude Code 的訂閱方案、額度制度、API 定價與折扣機制、Subagent 架構、模型分層策略與成本優化技巧。"
draft: false
---

Claude Code 是 Anthropic 推出的終端機原生 AI coding agent。和其他工具不同的地方在於：它同時提供**固定月費訂閱**和**按量 API** 兩種定價路線，而且訂閱這條路可以在額度用完時無縫切到 API 費率，不會硬停在半路。

這篇拆解 Claude Code 的訂閱方案與額度制度、API token 定價、模型分層策略、Subagent 架構，以及在不同使用強度下的成本比較。

**關於模型名稱**：這篇刻意不把某個特定模型寫死成「最強」。Anthropic 的模型迭代速度以月計，任何寫進文章的型號幾個月後都會變成錯的——[官方定價頁](https://claude.com/pricing)與 [Models API](https://docs.anthropic.com/en/docs/about-claude/models) 才是可靠來源。這裡只講**分層邏輯**，那部分不會過期。

## 訂閱方案總覽

| 方案 | 月費 | 用量額度 | 備註 |
|------|------|----------|------|
| **Free** | $0 | 有限 | 日常問答 |
| **Pro** | $20/mo（年繳約 $17/mo，$200 一次付清） | 每 5 小時視窗至少為 Free 的 5x | 小型 codebase、短時段開發 |
| **Max 5x** | $100/mo | 每 5 小時視窗為 Pro 的 5x | 日常主力 |
| **Max 20x** | $200/mo | 每 5 小時視窗為 Pro 的 20x | 重度使用者 |
| **Team** | Standard / Premium 兩種 seat | Standard 高於 Pro；Premium 為 Standard 的 5x | 團隊管理與共用 |
| **Enterprise** | 客製報價（僅年約） | 依約定 | 企業 |

年繳只有 Pro 和 Team 有，Max 目前**只能月繳**。

### 額度是怎麼算的

這是最容易誤解的部分。Claude 的額度**不是固定的訊息則數**：

- 以 **5 小時滾動視窗**計算，付費方案在此之上另有**週上限**（週上限在固定時間重置，跟你什麼時候開始用無關）
- **Claude 網頁、桌面、手機與 Claude Code 共用同一個池子**——在終端機做的事和在對話視窗做的事扣的是同一份額度
- 實際能做多少取決於對話長度與複雜度、選用的模型、以及用到哪些功能，所以沒有固定的則數
- IDE（VS Code、Cursor 等 VS Code fork、JetBrains）裡的 Claude Code 也算同一份額度

**額度用完時你有三個選擇**：等它重置、升級方案，或在付費方案上打開 **usage credits**——以標準 API 費率繼續工作。這是「吃到飽」這個說法需要修正的地方：固定月費買的是一個很大的額度，不是無限量，但你不會被硬卡住。

想嚴格控制在訂閱額度內，就在跳出 API credit 選項時拒絕；要完全避免被問，用 `claude login` 只以訂閱身分認證即可。

> ⚠️ **常見陷阱**：如果系統裡設了 `ANTHROPIC_API_KEY` 環境變數，Claude Code 會拿它去做認證，**而不是用你的訂閱**——結果是照 API 計費，訂閱額度完全沒動到。付了 Max 還收到 API 帳單，多半是這個原因。

## API Token 定價

如果你選擇走 API 路線（自備 key），或需要在 CI/CD 中程式化呼叫 Claude，定價按模型分層。以目前的模型世代來說：

| 層級 | Input / M tokens | Output / M tokens | Context |
|------|-------------------|---------------------|---------|
| **Opus 級**（深度推理） | $5 | $25 | 1M |
| **Sonnet 級**（日常主力） | $3 | $15 | 1M |
| **Haiku 級**（輕量派遣） | $1 | $5 | 200K |

確切的型號與價格請以[官方定價頁](https://claude.com/pricing)為準——上面這三層的**相對關係**（大約 5:3:1 的 input 比例、output 是 input 的 5 倍）比具體型號穩定得多。

另外有 **fast mode**：同一個模型跑在更高的輸出速度上（最高約 2.5 倍 tokens/秒），價格約為標準的兩倍，僅限最高階模型且屬研究預覽性質。趕時間才用。

### 成本折扣機制

| 機制 | 折扣幅度 | 說明 |
|------|----------|------|
| **Prompt Caching** | **90% off**（0.1x 原價） | 重複 prompt 前綴快取，效果顯著 |
| **Batch API** | **50% off** | 非即時批次處理，適合大規模任務 |

Prompt caching 是最容易被忽略的省錢手段。如果你的 system prompt 或 CLAUDE.md 內容固定不變，快取命中後 input token 只收原價的十分之一。在 Claude Code 的使用模式下，這幾乎是自動生效的。

要注意的是 caching 吃的是**前綴完全相符**：前綴裡任何一個 byte 變了，後面全部失效。把會變動的東西（時間戳、每次不同的 ID）放在最後面，快取命中率才拉得起來。

## 模型選擇策略

Claude Code 讓你在同一個 session 裡切換模型。關鍵不是選「最好的」，而是選**最適合當下任務的**。

### 三層模型分工

| 層級 | 適用場景 | 佔比 |
|------|----------|------|
| **深度推理**（Opus 級） | 複雜架構設計、跨系統重構、難 debug | ~10-15% |
| **日常主力**（Sonnet 級） | 一般開發、code review、測試撰寫 | ~80% |
| **輕量派遣**（Haiku 級） | Subagent 搜尋、格式轉換、簡單查詢 | ~5-10% |

Opus 級模型的 token 成本最高，只在真正需要深度思考的場景使用；Sonnet 級處理 80% 以上的日常工作綽綽有餘，是速度與品質的平衡點，也是預設選擇；Haiku 級便宜且快，最適合派給 subagent 做搜集資訊的苦工。

**這個比例比任何型號都耐用。** 每一代新模型出來時，benchmark 數字會翻新、命名會變，但「少數任務值得用最貴的模型、多數不值得」這件事不會變。與其記住某個型號的 SWE-bench 分數，不如把分層習慣建立起來——換代時你只要換名字，策略不用重寫。

另外一個容易被忽略的維度是 **effort / 思考深度**：新一代模型可以在同一個型號下調整推理投入，很多時候「同型號降 effort」比「換小一級的模型」更划算，因為你保留了模型的能力上限，只是讓它少想一點。

## Subagent 架構

Claude Code 的 subagent 架構是控制成本和上下文長度的關鍵設計。

### 運作原理

主 session 遇到繁瑣但明確的任務時，可以**派遣子代理**去執行。子代理在獨立的上下文中完成工作，只把**摘要結果**回傳給主 session。

這帶來三個好處：

1. **主上下文保持精簡**——不會因為搜尋、讀檔等 verbose 操作撐爆 context window
2. **成本更低**——子代理可以指定用 Haiku 模型（`model:haiku`）
3. **平行處理**——多個子代理可以同時執行不同任務

### 典型用法

```
主 Session（Sonnet/Opus）
  ├── Subagent 1（Haiku）→ 搜尋 codebase 中所有 API endpoint
  ├── Subagent 2（Haiku）→ 列出所有測試檔案的覆蓋率
  └── Subagent 3（Haiku）→ 檢查 dependency 版本
  
  ← 三份摘要回傳主 session
  → 主 session 基於摘要做架構決策
```

對於大型 monorepo，這種模式特別有效。讓主 session 專注在高價值推理，把搜集資訊的苦工交給便宜的 subagent。

## 成本優化：訂閱 vs API

訂閱與 API 的取捨很單純：**只要你每天認真在用 Claude Code，訂閱幾乎一定比純 API 便宜**。API 定價合理的場景只有兩個——用量很低，或需要程式化呼叫（CI/CD、批次處理、自建服務）。

粗略的判斷方式：把你的月用量乘上 Sonnet 級的費率（$3 / $15 per M tokens），跟月費比。任何每天用滿數小時的使用模式，算出來都會遠超過 $200。

但有兩個修正，是網路上那些「省了 95%」的比較文常漏掉的：

1. **訂閱額度不是無限的。** 5 小時視窗加上週上限是實際會撞到的牆，撞到之後要嘛等、要嘛升級、要嘛開 usage credits 走 API 費率。所以真實成本是「月費 + 超出部分的 API 費用」，不是純月費。
2. **省下來的比例取決於你會不會用 caching。** 走 API 但 cache 命中率高的人，跟走 API 完全不 cache 的人，帳單可以差一個量級。拿「完全不 cache 的 API 帳單」去對比訂閱月費，會誇大節省幅度。

實務上的建議：從 Pro 開始，觀察一兩個週期實際撞到上限的頻率（Settings > Usage 看得到），再決定要不要往上跳。用量的分布通常比自己想的更集中在少數幾天。

### 額外省錢技巧

- **善用 Prompt Caching**：固定的 CLAUDE.md 和 system prompt 會自動快取，省 90% input 費用
- **Batch API 處理非即時任務**：程式碼掃描、大量檔案格式化等不急的工作用 batch 跑，省 50%
- **正確分配模型**：不要用 Opus 做 Haiku 就能搞定的事
- **控制 context 長度**：善用 subagent 避免主 session 上下文膨脹

## Claude Code 的獨特優勢

和其他 Agent CLI 相比，Claude Code 有幾個明顯的差異化優勢：

1. **終端機原生**——不需要 IDE，SSH 到遠端伺服器也能直接用。對 terminal-first 的開發者來說，這是最自然的工作流程。

2. **深度推理能力**——Opus 級模型在需要理解複雜系統、追蹤多層 call stack 的場景中，跟中階模型的差距很明顯。這也是為什麼分層策略值得做：把這個能力留給真的需要它的 10-15%。

3. **一份訂閱涵蓋所有介面**——網頁、桌面、手機、終端機、IDE 共用同一個額度池。不必為了在不同地方用而分開付費，代價是額度也一起消耗。

4. **額度用完不會硬停**——付費方案可以開 usage credits 以 API 費率續跑，這在趕死線時是實質差異。

5. **持久記憶**——跨 session 的記憶系統讓 Claude Code 記住你的偏好、專案慣例、過去的決策。用越久越好用。

## 適用場景

Claude Code 特別適合以下工作模式：

- **複雜 debug**：追蹤跨多個檔案的 bug，需要深度推理和大量 context
- **架構設計**：新功能的系統設計、API 設計、資料模型設計
- **多檔案重構**：大規模 rename、pattern 遷移、框架升級
- **Terminal-first 開發者**：習慣在終端機裡完成所有事情的人

如果你的工作主要是在 IDE 裡做小範圍的 inline 修改，Cursor 或 Copilot 可能更順手。但如果你需要一個能理解整個 codebase 並執行多步驟任務的代理，Claude Code 是目前最強的選擇。

## 參考資料

- [Plans & Pricing | Claude by Anthropic](https://claude.com/pricing)
- [Claude Code by Anthropic | AI Coding Agent](https://claude.com/product/claude-code)
- [Use Claude Code with your Pro or Max plan | Claude Help Center](https://support.anthropic.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan)
- [Choose a Claude plan | Claude Help Center](https://support.claude.com/en/articles/11049762-choose-a-claude-plan)
- [What is the Max plan? | Claude Help Center](https://support.claude.com/en/articles/11049741-what-is-the-max-plan)

## 更新紀錄

- 2026-08-18：對照官方定價與說明頁翻新。①**移除所有寫死的型號與 benchmark 數字**（原文的 Opus 4.6「SWE-bench 80.9%」、Sonnet 5「代號 Fennec、82.1%、Dev Team 多代理模式」等），改以 Opus／Sonnet／Haiku 三個價格層描述，理由見文中——型號半衰期太短，寫死必錯；②補上額度的真實機制：5 小時滾動視窗 + 週上限、跨介面共用同一池、額度用完可開 usage credits 走 API 費率，並修正原文「吃到飽／不限 token」的說法；③補上 `ANTHROPIC_API_KEY` 環境變數會蓋掉訂閱認證的陷阱；④移除「Max vs API 省 95%」那張以單一使用者軼事為基礎的表，改為判斷方法與兩個常見高估來源；⑤參考資料改以官方頁為主，移除二手定價文
