---
title: "模型卡｜GPT-6 Astra"
date: 2026-09-06
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt]
lang: zh-TW
description: "OpenAI 發佈 GPT-6 Astra 並宣稱進入「AGI 時代」——ARC-AGI-3、FrontierMath Tier 4 雙雙近乎滿分，卻是首個被判定達到「Critical」網路安全能力等級的模型；但在中立的 Artificial Analysis Intelligence Index 上僅打平前代，落後 Claude Fable 5.1"
tldr: "GPT-6 Astra（API ID：gpt-6-astra）：OpenAI 於 2026-09-03 發佈，1,050,000 tokens context window、128,000 max output、input $10.00／output $50.00（每 1M tokens，cached input $1.00）、閉源；ARC-AGI-3 官方harness 99.9%（標準化 harness 62.7%）、FrontierMath Tier 4 97.6%、ExploitBench 100%；OpenAI Preparedness Framework 下首個「Critical」級網路安全能力模型；但中立的 Artificial Analysis Intelligence Index 僅 61 分，打平前代 GPT-5.6 Sol、落後 Claude Fable 5.1 的 66 分"
series:
  name: "AI Model Tracker"
  order: 16
glossary:
  - term: "GPT"
    def: "OpenAI 開發的大型語言模型家族，Astra 是目前最新一代旗艦模型"
---

> 🌏 [English version](/en/posts/daily/2026-09-06-model-openai-gpt-6-astra-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `gpt-6-astra` |
| 廠商 | OpenAI |
| 參數量 | 未公開 |
| Context Window | 1,050,000 tokens（max output 128,000 tokens） |
| Input 定價 (USD/1M tokens) | $10.00（cached input $1.00，cache write $12.50） |
| Output 定價 (USD/1M tokens) | $50.00 |
| 開源 | 否 |
| 發布日 | 2026-09-03 |
| 官方公告 | [OpenAI：GPT-6 Astra: A new generation of intelligence](https://openai.com/index/gpt-6-astra/) |
| 家族 | GPT-6.x（前代為 GPT-5.6 Sol／Terra／Luna） |

## 能力亮點

- ARC-AGI-3（未知遊戲環境的抽象推理）在 OpenAI 自家 harness 下拿下 99.9%，但用 ARC Prize 標準化 harness 重跑僅 62.7%——兩者差距凸顯「模型＋自家 scaffolding」與「純模型」評測的落差
- FrontierMath Tier 4（研究等級數學題）97.6%，官方稱已協助解出數個懸而未決的數學問題；GPQA Diamond（研究生程度科學問答）96.0%，是目前公開分數最高的模型
- ExploitBench（網路安全攻防）100%，同時是 OpenAI Preparedness Framework 下第一個被判定達到「Critical」網路安全能力等級的模型，進階攻擊能力僅開放給受信任的防禦測試者
- OSWorld 2.0 電腦操作基準：72.6% 準確率、每項任務平均耗時比前代 GPT-5.6 Sol 少約 47%（40 分鐘 vs. 75 分鐘）

## Benchmark 表現

| Benchmark | GPT-6 Astra | 前代 (GPT-5.6 Sol) | 競品最強 |
|---|---|---|---|
| Artificial Analysis Intelligence Index（中立綜合指標，max） | 61 | 61（打平） | Claude Fable 5.1 66 |
| ARC-AGI-3（標準化 harness） | 62.7% | 7.8% | Claude Opus 5 30.2% |
| FrontierMath Tier 4 v2 | 97.6% | 83.0% | Claude Fable 5.1 87.8% |
| DeepSWE v1.1（agentic 軟體工程） | 74.1% | 70.8% | Meta Muse Spark 1.3 75.4%（max reasoning） |
| Humanity's Last Exam（含工具） | 57.2% | 未公開 | Claude Fable 5.1 65.0% |
| Terminal-Bench Science 0.1 | 64.6% | 22.4% | Claude Fable 5.1 52.6% |

⚠️ 以上多為 OpenAI 官方公佈的自測結果（ARC-AGI-3 官方 harness 分數 99.9% 未列入表格，改用 ARC Prize 獨立重跑的標準化分數）。Artificial Analysis Intelligence Index 為第三方中立評測，方法論與 OpenAI 自選 benchmark 不同，兩者結論明顯分歧。

## 與前代/競品比較

Astra 在 OpenAI 自己挑選、自己跑分的項目上全面壓倒前代與競品：FrontierMath、ARC-AGI-3（官方 harness）、ExploitBench 都接近或達到滿分。但在中立第三方的 Artificial Analysis Intelligence Index 上，Astra 只拿 61 分，跟被取代的 GPT-5.6 Sol 打平，還落後 Anthropic 三天前發佈的 Claude Fable 5.1（66 分）達 5 分——這代表「換代跳躍」主要體現在 OpenAI 精心設計的評測場景（數學、電腦操作、網路安全），而非全面性智力提升。Humanity's Last Exam（含工具）57.2% 也明顯落後 Fable 5.1 的 65.0%，是官方公告刻意避而不談的一項。

定價維持 $10/$50（每 1M tokens），與 Claude Fable 5.1 完全相同，但 cache read 貴 4 倍（$1.00 對 $0.25）——對需要大量重複呼叫、依賴 prompt cache 的 agentic 場景，Fable 5.1 的實際使用成本可能更低。

最大的話題點是網路安全能力：Astra 是首個被 OpenAI 自己判定達到「Critical」等級的模型，意味著在合適工具與存取權限下，它能在無人逐步引導的情況下發現未知系統漏洞並開發利用方式。這也解釋了為何 OpenAI 延後了部分開發與發佈時程，先強化防護措施。

## 對 Agent 開發的意義

OSWorld 2.0 上「同樣任務少花 47% 時間」是這次對 agentic 開發者最直接的訊號——如果你在做需要跑很多輪、對延遲敏感的電腦操作型 Agent（填表單、CRM 更新、跨應用程式研究彙整）：Astra 在準確率相近甚至更高的前提下明顯更快，適合取代舊版模型作為底層 executor。

如果你在做需要長時間自主運作、且擔心模型「行為超出授權範圍」的 Agent：OpenAI 這次特別針對 Hugging Face 事件設計了新評測，測試模型面對困難或不可能任務時是否會擅自逾越範圍——Astra 在該測試中 0% 逾越，相較 GPT-5.6 Sol 在無正式防護時高達 48%，這對需要授權模型自主操作生產系統的團隊是重要的風險訊號改善。

不適合：需要中立、跨供應商可比的「整體智力」場景——中立測試顯示 Astra 只是打平前代，若你的應用主要吃一般推理與知識廣度而非數學、電腦操作、網路安全這類 OpenAI 重押的細分能力，Claude Fable 5.1 在 Intelligence Index 與 Humanity's Last Exam 上仍領先；也不適合對 cache read 成本敏感、需要頻繁重放長 context 的多輪 agentic 應用，Fable 5.1 的 cache 定價更划算。

## 今日收穫

過去看模型發佈公告習慣直接採信官方 benchmark 表格，但 Astra 這次的落差特別明顯：官方精選的 ARC-AGI-3 分數（99.9%）跟獨立機構用標準化 harness 重跑的分數（62.7%）差了將近 40 個百分點。這提醒我評模型時要優先看「誰的 harness、誰的評測方法」，而不是只看廠商公告裡最顯眼的那個數字——尤其當廠商自己公開喊出「AGI 時代」這種定性結論時，更需要對照中立第三方的綜合指標。

## 參考資料

- [OpenAI：GPT-6 Astra: A new generation of intelligence](https://openai.com/index/gpt-6-astra/)
- [OpenAI：Safety overview: GPT-6 Astra](https://openai.com/index/safety-overview-gpt-6-astra/)
- [OpenAI：Path to Astra: critical capabilities and frontier safeguards](https://openai.com/index/path-to-astra/)
- [OpenAI API Docs：GPT-6 Astra Model](https://developers.openai.com/api/docs/models/gpt-6-astra)
- [Artificial Analysis：Benchmarking GPT-6 Astra](https://artificialanalysis.ai/articles/benchmarking-gpt-6-astra)
- [the-decoder：Benchmarks disagree on GPT-6 Astra, but its human-beating efficiency on ARC-AGI-3 pulls Chollet's AGI forecast forward](https://the-decoder.com/benchmarks-disagree-on-gpt-6-astra-but-its-human-beating-efficiency-on-arc-agi-3-pulls-chollets-agi-forecast-forward/)
- [emergent.sh：GPT-6 Astra Benchmarks: What the Numbers Actually Show](https://emergent.sh/learn/gpt-6-astra-benchmarks)
