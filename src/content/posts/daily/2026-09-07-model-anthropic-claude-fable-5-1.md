---
title: "模型卡｜Claude Fable 5.1"
date: 2026-09-07
category: daily
type: digest
tags: [ai-agent, model-release, daily, anthropic, model-family-claude]
lang: zh-TW
description: "Anthropic 發佈 Claude Fable 5.1 與受限版 Mythos 5.1——同一個模型、不同安全防護等級，1M context、cache read 降價 75%，中立的 Artificial Analysis Intelligence Index 66 分登頂"
tldr: "Claude Fable 5.1（API ID：claude-fable-5-1）：Anthropic 於 2026-09-01 發佈，1,000,000 tokens context window、128,000 max output、input $10.00／output $50.00（每 1M tokens，cache read 降至 $0.25，降 75%）、閉源；Terminal-Bench-Science 0.1 自測 52.6%（前代 24.7%）、中立 Artificial Analysis Intelligence Index 66 分（前代 62 分，領先 GPT-6 Astra 的 61 分）；同步發佈受限版 Claude Mythos 5.1，僅開放給網路安全與生科領域受信任機構"
series:
  name: "AI Model Tracker"
  order: 17
glossary:
  - term: "Claude"
    def: "Anthropic 開發的大型語言模型家族，Fable/Mythos 是繼 Opus 之後的最新旗艦分級"
---

> 🌏 [English version](/en/posts/daily/2026-09-07-model-anthropic-claude-fable-5-1-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `claude-fable-5-1` |
| 廠商 | Anthropic |
| 參數量 | 未公開 |
| Context Window | 1,000,000 tokens（max output 128,000 tokens） |
| Input 定價 (USD/1M tokens) | $10.00（cache read $0.25，5m cache write $12.50，1h cache write $20.00） |
| Output 定價 (USD/1M tokens) | $50.00 |
| 開源 | 否 |
| 發布日 | 2026-09-01 |
| 官方公告 | [Anthropic：Introducing Claude Fable 5.1 and Claude Mythos 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1) |
| 家族 | Claude 5.x（Fable/Mythos 分級，前代為 Fable 5／Mythos 5） |

## 能力亮點

- Terminal-Bench-Science 0.1（agentic 科學研究）達 52.6%，是前代 Fable 5（24.7%）的兩倍以上，也高於自家 Opus 5（29.0%）與 GPT-5.6 Sol（22.4%）
- 中立第三方 Artificial Analysis Intelligence Index 在 max effort 下拿下 66 分，登上該指標榜首，領先前代 Fable 5（62 分）與同週發佈的 GPT-6 Astra（61 分）
- cache read 定價從 $1.00 降到 $0.25（降 75%），一般工作負載整體成本降約 25%，高強度 agentic 工作（context 重複讀取為主）最高可省約 45%
- 受限版 Mythos 5.1 在蛋白質設計任務上，三個標的的結合親和力達 Adaptyv Bio 蛋白質設計競賽最佳紀錄的 10 倍，12 個標的的命中率近 50%（業界典型命中率僅 10–15%）

## Benchmark 表現

| Benchmark | Fable 5.1 | 前代 (Fable 5) | 競品最強 |
|---|---|---|---|
| Artificial Analysis Intelligence Index（中立，max effort） | 66 | 62 | Claude Opus 5　63.0（GPT-6 Astra max　61） |
| Terminal-Bench-Science 0.1 | 52.6% | 24.7% | GPT-5.6 Sol　22.4%（GPT-6 Astra　64.6%，OpenAI 自測） |
| Terminal-Bench 4.0（agentic coding） | 55.8%（Mythos 5.1　60.9%） | 42.0% | GPT-5.6 Sol　37.3% |
| AutomationBench（企業流程自動化） | 31.4% | 17.1% | GPT-5.6 Sol　19.6% |
| Humanity's Last Exam（含工具） | 65.0% | 63.8% | GPT-6 Astra　57.2%（OpenAI 自測） |

⚠️ 除 Artificial Analysis Intelligence Index 為獨立第三方評測外，其餘皆為廠商自測（Anthropic 或 OpenAI），Terminal-Bench-Science／Humanity's Last Exam 的 GPT-6 Astra 分數轉引自 OpenAI 官方公告，方法論與 Anthropic 自選 benchmark 不完全相同，僅供參考。

## 與前代/競品比較

跟 Fable 5 比，最大進步在需要多步驟、長時間自主運作的任務：Terminal-Bench-Science 從 24.7% 跳到 52.6%，AutomationBench 從 17.1% 跳到 31.4%，都是超過一倍的成長；反而 Humanity's Last Exam（純知識推理，65.0% vs. 63.8%）進步幅度相對小，說明這次升級的重點是「agentic 執行力」而非泛用知識量。

跟同週發佈的 GPT-6 Astra 比，兩家用的評測組合幾乎不重疊：OpenAI 主推 FrontierMath、ARC-AGI-3、ExploitBench 等自選題型全面壓過對手，Anthropic 則在中立的 Artificial Analysis Intelligence Index（66 分對 61 分）與 Humanity's Last Exam（65.0% 對 57.2%）上領先。定價完全相同（$10/$50 每 1M tokens），但 cache read 差 4 倍（Fable 5.1 的 $0.25 對 Astra 的 $1.00）——對依賴 prompt cache 的重複呼叫場景，Fable 5.1 實際成本更低。

定價策略上，Fable 5.1 選擇「維持牌價、砍 cache read」而非直接降價：因為 Anthropic 自家數據顯示典型 agentic 工作負載裡 cache read 佔了大部分 token 用量，這個結構性調整比全面調降 input/output 單價更能反映真實使用成本，也符合 Artificial Analysis 觀察到的「每個任務仍貴 20%，但每 token 更便宜」現象。

## 對 Agent 開發的意義

Fable 5.1 和 Mythos 5.1 其實是同一份權重，差別只在安全防護層級——Fable 5.1 一般開放，Mythos 5.1 僅供網路安全與生科領域的受信任機構透過 CVP／LSVP 申請使用。如果你在做防禦性資安工具（弱點掃描、程式碼安全審查）：Fable 5.1 現在已經能協助找出軟體漏洞（但不能開發利用方式），Claude Security 產品也已換裝 Mythos 5.1，值得評估導入。

如果你在做長時間跑、tool-heavy 的 agentic 應用（coding agent、research agent、跨系統自動化）：cache read 降 75% 是這次對你最直接的訊號——重複讀取長 context（系統提示、專案文件、對話歷史）是這類應用的主要成本來源，同樣的架構下帳單可望降 25–45%，值得重新跑一次成本試算。Adaptive thinking 預設在 Claude Code 用 high effort、在 Claude Cowork／Claude.ai 用 medium effort，如果對延遲敏感，可以先試 low/medium effort——官方圖表顯示中低 effort 下已能打平甚至超越 Fable 5 的表現，成本卻更低。

不適合：需要客製化蒸餾（distillation）自家小模型的團隊——新帳號（9/1 後建立）已無法透過編輯先前 context 保留 Claude 思考過程的方式萃取推理內容，這條路徑被官方明確堵死；也不適合需要真正生科 R&D 能力（新藥標靶設計等）的場景，這類需求會被安全防護導向 Opus 模型，Mythos 5.1 的完整能力僅限 LSVP 受邀機構。

## 今日收穫

以前預設「防護等級不同」代表模型本身也不同（就像閹割版 vs. 完整版是分開訓練的）。Fable 5.1／Mythos 5.1 的作法打破這個假設：兩者是同一份權重，差異完全體現在推論時套用的 safeguard 層——這代表安全防護正在從「訓練時決定的模型能力上限」變成「部署時可配置的存取控制層」，對需要依場景切換防護強度的企業客戶是更彈性的架構，但也意味著同一個模型在不同帳號下的實際行為邊界可能差異很大，評估風險時不能只看「用的是哪個模型」。

## 參考資料

- [Anthropic：Introducing Claude Fable 5.1 and Claude Mythos 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1)
- [Anthropic：Claude Fable 5.1 / Mythos 5.1 System Card](https://www.anthropic.com/claude-fable-5-1-mythos-5-1-system-card)
- [Claude Platform Docs：Claude Fable 5.1](https://platform.claude.com/docs/en/models/fable-5-1/overview)
- [Claude 官方定價頁](https://claude.com/pricing)
- [Artificial Analysis：GPT-6 Astra (max) vs Claude Fable 5.1 comparison](https://artificialanalysis.ai/models/comparisons/gpt-6-astra-vs-claude-fable-5-1)
- [OpenAI：GPT-6 Astra: A new generation of intelligence](https://openai.com/index/gpt-6-astra/)
