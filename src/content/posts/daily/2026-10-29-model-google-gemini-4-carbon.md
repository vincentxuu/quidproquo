---
title: "模型卡｜Gemini 4 Carbon"
date: 2026-10-29
category: daily
type: digest
tags: [ai-agent, model-release, daily, google, model-family-gemini]
lang: zh-TW
description: "Google 發佈 Gemini 4 Carbon——資安三項 benchmark（漏洞挖掘／驗證／修補）全面刷新 SOTA，Artificial Analysis Intelligence Index v5.0 拿下全球第一，但目前只開放給受信任資安夥伴測試"
tldr: "Gemini 4 Carbon：2026-10-28 發佈，距前代 Argon 僅兩週；官方未公布 context window 與 output 上限數字，第三方 Artificial Analysis 測得 1M tokens context window；定價沿用 Argon 促銷價 input $2.00／output $10.00（USD/1M tokens），促銷結束後倍增為 $4.00／$20.00，到期日未公布；資安三項 benchmark 全面刷新 SOTA——SEC-bench Pro 88.2%（漏洞挖掘）、ExploitGym 54.8%（漏洞利用驗證）、CWE-bench 71.0%（漏洞修補，前代 68%）；Artificial Analysis Intelligence Index v5.0 拿下全球第一 59 分，但只贏 Claude Opus 5.5 的 58 分一分；目前僅透過 Fairwind Program 開放給受信任資安夥伴，連 API Model ID 都還沒公開"
series:
  name: "AI Model Tracker"
  order: 62
glossary:
  - term: "Gemini"
    def: "Google DeepMind 開發的大型語言模型家族，Carbon 為 Gemini 4.x 分支裡緊接在 Argon 之後的旗艦模型"
---

> 🌏 [English version](/posts/daily/2026-10-29-model-google-gemini-4-carbon-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | 未公開（Google 的 Gemini API 定價頁截至 2026-10-29 仍只列 Argon，沒有 Carbon 條目） |
| 廠商 | Google DeepMind |
| 參數量 | 未公開 |
| Context Window | 官方公告沒有給出具體數字；第三方評測平台 Artificial Analysis 的模型頁測得 1,000,000 tokens context window，支援文字／圖片／語音／影片輸入，輸出為文字 |
| Input 定價 (USD/1M tokens) | $2.00（促銷價，沿用 Argon 現行促銷價） |
| Output 定價 (USD/1M tokens) | $10.00（促銷價，沿用 Argon 現行促銷價） |
| 開源 | 否（閉源，Google 專有） |
| 發布日 | 2026-10-28 |
| 官方公告 | [Google Blog：Gemini 4 Carbon: our next frontier model](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/) |
| HuggingFace | 不適用（閉源模型） |
| 家族 | Gemini 4.x（緊接 2026-09-30 發佈的 Gemini 4 Argon） |

## 能力亮點

- 資安防禦三項 benchmark 全面刷新 SOTA：SEC-bench Pro（找漏洞）88.2%、ExploitGym（驗證漏洞可否利用）54.8%、CWE-bench（修補漏洞）71.0%，官方表示內部測試中生成無漏洞程式碼的成功率比 Argon 提升超過 2 倍
- Terminal-Bench 4.0 的「成功作弊」比例降到 0.0%（嘗試作弊比例 0.4%），同時維持整體準確率不降，顯示對齊訓練在抑制走捷徑行為上明顯見效
- Gray Swan 的 Indirect Prompt Injection Benchmark 攻擊成功率降到 0.0%，比 Argon 當時的 0.7% 再進一步，抵擋了評測中的每一次注入攻擊
- WebDev Arena elo 衝高 89 分、躍升到第 4 名（1768 elo），官方內部測試顯示高嚴重度的「行為偏差」警示比 Argon 減少近 80%

## Benchmark 表現

| Benchmark | 分數 | 前代 (Argon) | 競品最強 |
|---|---|---|---|
| SEC-bench Pro（漏洞挖掘） | 88.2%（SOTA） | 未公布對應分數 | 未列出次高分 |
| ExploitGym（漏洞利用驗證） | 54.8%（SOTA） | 未公布對應分數 | 未列出次高分 |
| CWE-bench（漏洞修補） | 71.0% | 68%（並列第一） | GPT-6 Astra 68%、Claude Opus 5.5 67% |
| Artificial Analysis Intelligence Index v5.0 | 59（全球第一） | 50.4（同版本重測，felloai.com 整理） | Claude Opus 5.5 58、GPT-6 Astra 57 |
| Artificial Analysis Coding Agent Index | 59 | 未列入 | Claude Opus 5.5（max）62（第一） |
| Gray Swan IPI Benchmark（prompt injection 攻擊成功率，越低越好） | 0.0% | 0.7% | 未列出次高分 |

⚠️ SEC-bench Pro、ExploitGym、CWE-bench、WebDev Arena、Terminal-Bench 4.0、Gray Swan IPI 均為 Google 官方自測／合作方（Gray Swan、Wiz）評測結果，尚無第三方獨立複現；Artificial Analysis Intelligence Index 與 Coding Agent Index 為第三方平台（Artificial Analysis）獨立測得，非官方自報數字。CWE-bench、Artificial Analysis Intelligence Index 兩項可與前代 Argon 直接對照，其餘資安 benchmark 官方未公布 Argon 對應分數，無法逐項比較進步幅度。

```diagram
title: Gemini 4 Carbon 在 Intelligence Index v5.0 拿下第一，但只贏一兩分
desc: Carbon 59 分排名全球第一，只比 Claude Opus 5.5 的 58 分高 1 分、比 GPT-6 Astra 的 57 分高 2 分，差距遠小於贏前代 Argon（50.4 分）的 8.6 分。
caption: 資料來源：Artificial Analysis Intelligence Index v5.0（2026-10-27 發布，2026-10-29 查證）；Argon 分數為同一版本重新測試後的分數（felloai.com 整理），非 Argon 發布時使用的 v4.x 分數。換算：基線 y=300，繪圖區頂 y=60，網域 0–60 分，k=(300−60)÷60=4（每分 4 單位），長條頂 y=300−分數×4。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">分</text>
  <line class="dg-grid" x1="72" y1="140" x2="612" y2="140"/>
  <line class="dg-grid" x1="72" y1="220" x2="612" y2="220"/>
  <text class="dg-small" x="64" y="140" text-anchor="end" dominant-baseline="central">40</text>
  <text class="dg-small" x="64" y="220" text-anchor="end" dominant-baseline="central">20</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <rect class="dg-bar dg-c-accent" x="107.5" y="64" width="64" height="236"/>
  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="242.5" y="68" width="64" height="232"/>
    <rect class="dg-bar dg-bar--soft" x="377.5" y="72" width="64" height="228"/>
    <rect class="dg-bar dg-bar--soft" x="512.5" y="98" width="64" height="202"/>
  </g>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-label dg-text--accent" x="139.5" y="54" text-anchor="middle" dominant-baseline="central">59</text>
  <text class="dg-sub" x="274.5" y="58" text-anchor="middle" dominant-baseline="central">58</text>
  <text class="dg-sub" x="409.5" y="62" text-anchor="middle" dominant-baseline="central">57</text>
  <text class="dg-sub" x="544.5" y="88" text-anchor="middle" dominant-baseline="central">50.4</text>

  <text class="dg-label dg-text--accent" x="139.5" y="320" text-anchor="middle" dominant-baseline="central">Carbon</text>
  <text class="dg-sub" x="274.5" y="320" text-anchor="middle" dominant-baseline="central">Opus 5.5</text>
  <text class="dg-sub" x="409.5" y="320" text-anchor="middle" dominant-baseline="central">GPT-6 Astra</text>
  <text class="dg-sub" x="544.5" y="320" text-anchor="middle" dominant-baseline="central">Argon</text>
</svg>
```

## 與前代/競品比較

跟 Argon 比，Carbon 最大的進步集中在資安防禦與對齊兩個維度：CWE-bench 從 68% 進步到 71.0%，Gray Swan IPI 攻擊成功率從 0.7% 降到 0.0%，Terminal-Bench 4.0 的作弊率也顯著下降。但官方同時承認，Carbon 的幻覺率（hallucination rate）從 Argon 的 4% 上升到 11%——雖然仍是目前所有模型裡第二低（僅輸給 Argon 本身），但這代表「更願意嘗試回答」與「更可能編造」之間存在拉力，不是單純全面進步。

跟競品比，Artificial Analysis Intelligence Index v5.0 上 Carbon 拿下全球第一（59 分），但只贏 Claude Opus 5.5 的 58 分一分、GPT-6 Astra 的 57 分兩分——三者差距在評測機構自己都沒標示誤差範圍的情況下，更接近「同一量級內的些微領先」而非全面碾壓。在 Coding Agent Index 上 Carbon 甚至落後 Claude Opus 5.5 3 分（59 比 62），顯示 Carbon 的強項明確偏向資安與複雜推理，不是全面刷新所有 agentic coding 場景。

定價上，Carbon 完全沿用 Argon 現行的促銷價 $2/$10，促銷結束後同樣倍增為 $4/$20——這次發布沒有新的定價策略，純粹是同一價位帶上的能力迭代，而且促銷到期日跟 Argon 一樣，官方都沒有公布。

## 對 Agent 開發的意義

Carbon 目前最大的限制不是能力，是存取權——只開放給 Fairwind Program 裡的受信任資安夥伴，一般開發者連 API Model ID 都看不到，Google 公告裡也沒給出對外開放的具體時程。

- 如果你在做資安防禦類 agent（漏洞挖掘、利用驗證、自動修補的完整流程）：三項資安 benchmark 全面 SOTA，是目前能找到的最強候選，但要先申請進入 Fairwind Program 才能實測，短期內無法直接整合進產品
- 如果你在做需要連續運行數天、處理複雜多步驟工程任務的 coding agent：官方提到內部團隊讓 Carbon 連續跑數天去解決大型程式碼庫裡的細微 bug，但 Coding Agent Index 分數仍落後 Claude Opus 5.5，實際選型前建議先用自己的任務跑一輪對照
- 不適合：現在就把 Carbon 寫進生產架構的依賴清單——沒有公開 Model ID、沒有 API 開放時程，連 context window 都只是第三方測出來的「1M tokens」，不是 Google 官方確認的數字，跟 Argon 剛發布時的狀況一模一樣
- 如果你在比較 Gemini／Claude／GPT 的旗艦模型：Carbon 跟 Opus 5.5、GPT-6 Astra 的綜合分數差距只有 1-2 分，選型時「哪個模型你已經能申請到存取權」可能比「誰的 benchmark 分數高一點」更實際

## 今日收穫

Google 兩週內連發 Argon 到 Carbon，用的是同一套劇本：先公告 benchmark 和定價，存取權卻留到最後、而且比前一次更晚公開。這提醒我追蹤「新模型」時要把「公告日」和「可用日」當成兩條獨立時間軸記錄——這次差距可能是兩週，也可能像 Argon 一樣拖上一個多月，模型卡的發佈日期不代表任何人真的能拿到手測試。

## 參考資料

- [Google Blog：Gemini 4 Carbon: our next frontier model](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)
- [Ars Technica：Google announces Gemini 4 Carbon, its latest frontier AI model that you can't use](https://arstechnica.com/ai/2026/10/google-announces-gemini-4-carbon-its-latest-frontier-ai-model-that-you-cant-use/)
- [CNET：Google Debuts New AI Models, Genie 4 and Gemini 4 Carbon: What You Need to Know](https://www.cnet.com/tech/services-and-software/google-genie-4-gemini-4-carbon-ai-news/)
- [Artificial Analysis：Gemini 4 Carbon is the new #1 on the Artificial Analysis Intelligence Index](https://artificialanalysis.ai/articles/gemini-4-carbon-new-number-1)
- [Artificial Analysis：Gemini 4 Carbon (high) model page](https://artificialanalysis.ai/models/gemini-4-carbon)
- [本站：模型卡｜Gemini 4 Argon](/posts/daily/2026-10-05-model-google-gemini-4-argon)
