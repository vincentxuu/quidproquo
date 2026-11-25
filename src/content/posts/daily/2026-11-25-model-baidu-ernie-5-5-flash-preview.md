---
title: "模型卡｜ERNIE 5.5 Flash Preview"
date: 2026-11-25
category: daily
type: digest
tags: [ai-agent, model-release, daily, baidu, model-family-ernie]
lang: zh-TW
description: "百度開源 ERNIE 5.5 Flash Preview：280B 總參數 MoE、1M context，投機解碼草稿頭 DSpark 直接焙進權重；辦公自動化與多工具協調打平甚至小贏 Claude Opus 5.5，但一般知識推理仍明顯落後"
tldr: "ERNIE 5.5 Flash Preview（baidu/ERNIE-5.5-Flash-Preview，2026-11-24 開源權重，API 自 11-11 於百度千帆上線）：280B 總參數/14B 活躍參數 MoE、1M context、Apache 2.0；國際版定價 input $0.28／output $1.13 per 1M tokens；投機解碼草稿頭 DSpark 直接內建在發行權重裡，1M context 下索引器再加速 40%；MCP-Atlas（84.6）與 AutomationBench（61.9）兩項代理/辦公自動化 benchmark 都高於 Claude Opus 5.5，但 HLE 落後 15 分，顯示後訓練明顯偏向辦公與多工具代理任務而非通用知識推理"
series:
  name: "AI Model Tracker"
  order: 82
glossary:
  - term: "ERNIE"
    def: "百度開發的大型語言模型家族，中文全稱文心大模型"
  - term: "DSpark"
    def: "ERNIE 5.5 Flash 系列內建的投機解碼草稿頭，一次平行提出一整段候選 token 讓主模型驗證，訓練時與主模型同步量化、持續用線上蒸餾校準接受率"
---

> :globe: [English version](/posts/daily/2026-11-25-model-baidu-ernie-5-5-flash-preview-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `baidu/ERNIE-5.5-Flash-Preview`（另有 `-FP8`、`-BF16` 權重版本；千帆模型中心 ID `am-abe18d298d70`） |
| 廠商 | Baidu（百度文心 ERNIE 團隊） |
| 參數量 | 280B 總參數、14B 活躍參數／token（MoE，512 選 10 路由專家＋1 共享專家） |
| Context Window | 1,048,576 tokens（1M；訓練時從 128K 延伸而來） |
| Input 定價 (USD/1M tokens) | $0.28（cache hit $0.028） |
| Output 定價 (USD/1M tokens) | $1.13 |
| 開源 | 是（Apache License 2.0，僅涵蓋 Preview 權重；基座 ERNIE-5.5-Flash-Base 另受自訂授權條款規範） |
| 發布日 | 2026-11-24（HuggingFace 權重開源）；API 自 2026-11-11 於百度千帆先行上線 |
| 官方公告 | [ERNIE Blog：Introducing ERNIE 5.5 Flash Preview](https://ernie.baidu.com/release/ernie-5-5-flash-preview) |
| HuggingFace | [baidu/ERNIE-5.5-Flash-Preview](https://huggingface.co/baidu/ERNIE-5.5-Flash-Preview) |
| 家族 | ERNIE 5.5 Flash（基座 ERNIE-5.5-Flash-Base 於 2026-11-05 發布；Preview 是該系列首個後訓練版本） |

## 能力亮點

- **MCP-Atlas（多工具協調）84.6 分**，略高於 Claude Opus 5.5 的 84.2 分，是百度官方對照的六個模型中最高分
- **AutomationBench（辦公自動化）61.9 分**，同樣是六個模型裡最高，領先 Claude Opus 5.5 的 58.0 分（百度自測）
- **DSpark 投機解碼草稿頭直接焙進發行權重**：不是外接的獨立小模型，而是跟主模型一起做 W4A8 量化感知訓練、再用線上蒸餾持續校準接受率；搭配輕量索引器的 head-routing 與 threshold 預篩選，1M context 下再加速 40%
- 單次 **11 小時連續編碼任務**，在 Unreal Engine 5.8 上用 C++ 寫出完整第三人稱武俠遊戲《雲袖行》，展示長時程自主迭代與除錯能力

## Benchmark 表現

| Benchmark | ERNIE 5.5 Flash Preview | 前代模型 | 競品最強 |
|---|---|---|---|
| MCP-Atlas（多工具協調） | 84.6 | 無（ERNIE 5.5 系列首個後訓練版本） | Claude Opus 5.5　84.2 |
| AutomationBench（辦公自動化） | 61.9 | 無 | DeepSeek-V4.1-Flash-1017　60.5／60.5*（百度自測） |
| OfficeQA Pro V2（辦公文件問答） | 67.9 | 無 | GPT-6.1 Sol　70.0*（百度自測） |
| BrowseComp（網路檢索） | 87.4 | 無 | Hy4　91.8*（騰訊混元，百度自測） |
| HLE（無工具，一般知識推理） | 46.4 | 無 | Claude Opus 5.5　61.4 |

:warning: ERNIE 5.5 Flash Preview 的分數全部是百度自測；對照模型標 `*` 的也是百度自己跑出來的分數，未標 `*` 的才是取自對方官方發佈或 Artificial Analysis 排行榜，獨立機構尚未重現這張表。百度在模型卡上明講 Preview「是後訓練階段的中間 checkpoint」，正式版之前數字仍可能變動。

```diagram
title: ERNIE 5.5 Flash Preview 對 Claude Opus 5.5 的四項 benchmark 對照
desc: 代理與辦公自動化類 benchmark（AutomationBench、OfficeQA Pro V2）ERNIE 5.5 Flash Preview 領先，但開放域知識推理（HLE）大幅落後，呈現後訓練資料偏向代理／辦公任務而非通用知識的特徵。
caption: 數值來自百度 ERNIE 官方模型卡；Claude Opus 5.5 的分數標 * 處為百度自測，非 Anthropic 官方數字。x 座標 = 200 + 分數(%) × 4，0% 對應 x=200、100% 對應 x=600。
---
<svg viewBox="0 0 640 410">
  <text class="dg-small" x="200" y="36" text-anchor="middle" dominant-baseline="central">0%</text>
  <text class="dg-small" x="400" y="36" text-anchor="middle" dominant-baseline="central">50%</text>
  <text class="dg-small" x="600" y="36" text-anchor="middle" dominant-baseline="central">100%</text>
  <line class="dg-grid" x1="400" y1="50" x2="400" y2="356"/>

  <text class="dg-label" x="160" y="90" text-anchor="end" dominant-baseline="central">AutomationBench</text>
  <line class="dg-axis" x1="432" y1="90" x2="448" y2="90"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="432" cy="90" r="6"/>
  <circle class="dg-point dg-c-accent" cx="448" cy="90" r="6"/>
  <text class="dg-sub" x="420" y="90" text-anchor="end" dominant-baseline="central">58.0%*</text>
  <text class="dg-label dg-text--accent" x="460" y="90" text-anchor="start" dominant-baseline="central">61.9%</text>

  <text class="dg-label" x="160" y="170" text-anchor="end" dominant-baseline="central">OfficeQA Pro V2</text>
  <line class="dg-axis" x1="449" y1="170" x2="472" y2="170"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="449" cy="170" r="6"/>
  <circle class="dg-point dg-c-accent" cx="472" cy="170" r="6"/>
  <text class="dg-sub" x="437" y="170" text-anchor="end" dominant-baseline="central">62.2%</text>
  <text class="dg-label dg-text--accent" x="484" y="170" text-anchor="start" dominant-baseline="central">67.9%</text>

  <text class="dg-label" x="160" y="250" text-anchor="end" dominant-baseline="central">BrowseComp</text>
  <line class="dg-axis" x1="550" y1="250" x2="563" y2="250"/>
  <circle class="dg-point dg-c-accent" cx="550" cy="250" r="6"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="563" cy="250" r="6"/>
  <text class="dg-label dg-text--accent" x="538" y="250" text-anchor="end" dominant-baseline="central">87.4%</text>
  <text class="dg-sub" x="575" y="250" text-anchor="start" dominant-baseline="central">90.8%</text>

  <text class="dg-label" x="160" y="330" text-anchor="end" dominant-baseline="central">HLE（無工具）</text>
  <line class="dg-axis" x1="386" y1="330" x2="446" y2="330"/>
  <circle class="dg-point dg-c-accent" cx="386" cy="330" r="6"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="446" cy="330" r="6"/>
  <text class="dg-label dg-text--accent" x="374" y="330" text-anchor="end" dominant-baseline="central">46.4%</text>
  <text class="dg-sub" x="458" y="330" text-anchor="start" dominant-baseline="central">61.4%</text>

  <line class="dg-rule" x1="20" y1="356" x2="620" y2="356"/>
  <text class="dg-tag" x="20" y="382" dominant-baseline="central">圖例</text>
  <circle class="dg-point dg-c-accent" cx="130" cy="382" r="6"/>
  <text class="dg-small" x="146" y="382" dominant-baseline="central">ERNIE 5.5 Flash Preview</text>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="360" cy="382" r="6"/>
  <text class="dg-small" x="376" y="382" dominant-baseline="central">Claude Opus 5.5</text>
</svg>
```

## 與前代/競品比較

這是 ERNIE 5.5 系列第一個後訓練版本，沒有同系列前代可比；但基座 ERNIE-5.5-Flash-Base（2026-11-05 發布）本身已經在 base-to-base 評測中領先同量級開源基座——MMLU-Pro 78.4 分 vs DeepSeek V4 Flash Base 的 69.2 分，HumanEval+ 82.3 分 vs 69.5 分，差距都在 9-13 個百分點。Preview 是在這個基座上做中期訓練（context 從 128K 延伸到 1M）與後訓練得到的。

跟當前一線模型比，ERNIE 5.5 Flash Preview 的強弱分佈很清楚：在「多工具協調」（MCP-Atlas 84.6 分，略高於 Claude Opus 5.5 的 84.2 分）與「辦公自動化」（AutomationBench 61.9 分，領先 Claude Opus 5.5 近 4 分）這類垂直代理任務上打平甚至小贏頂尖模型；但在不給工具的開放域知識推理（HLE）上只有 46.4 分，落後 Claude Opus 5.5 的 61.4 分達 15 個百分點，AA-Omniscience 更是落後近 37 分。這說明後訓練資料顯然刻意偏向辦公與代理場景，不是在拼通用知識廣度。

定價策略也很直接：國際版 Qianfan 定價 input $0.28／output $1.13 per 1M tokens，只是 Claude Opus 5.5、GPT-6.1 Sol 這類旗艦模型牌價（通常落在 $3-8／$15-40 區間）的一小部分，走的是「代理任務夠用、成本壓到最低」的路線，而不是正面挑戰頂尖模型的通用智能上限。

## 對 Agent 開發的意義

DSpark 投機解碼頭直接焙進發行權重這件事，對長時程 Agent 迴圈的工程成本有實際影響：不用自己額外訓練、部署、維護一個獨立的草稿模型，官方 vLLM／SGLang 部署腳本裡 `--speculative-algorithm DSPARK` 一個參數就能開啟，而且因為 DSpark 跟主模型一起量化訓練、持續線上蒸餾校準，加速比不會隨著主模型更新而退化——這是社群常見「外接小模型當 draft model」做法會遇到的痛點。

- 如果你在做文件處理、試算表修復、跨 App 自動化這類垂直 Agent：AutomationBench 與 OfficeQA Pro V2 的領先說明這個方向被明確針對性訓練過，加上 1M context 在稀疏索引器優化下有 40% 加速，值得排進選型清單
- 如果你在做需要大量跨工具協調的多步驟 Agent：MCP-Atlas 84.6 分打平甚至略贏 Claude Opus 5.5，而單價只是後者的一小部分，是成本敏感場景的候選
- 不適合：需要開放域知識廣度或高難度推理的場景（HLE、AA-Omniscience 都明顯落後），也不適合直接當成生產環境的最終依賴——百度自己在模型卡上明講這是「訓練未完成的中間 checkpoint」，正式版發布前分數都可能再變動

## 今日收穫

過去看投機解碼，預設是「主模型訓練完之後，另外找一個小模型外接當草稿模型」。ERNIE 5.5 Flash Preview 的做法反過來：DSpark 這個草稿頭從後訓練階段就跟主模型一起做量化感知訓練，用的量化粒度、縮放係數和推理時完全一致，之後還靠線上蒸餾持續校準接受率，讓加速比隨主模型版本更新保持穩定。這提醒我，投機解碼的工程選擇不只是「要不要加草稿模型」，還有「草稿模型要不要跟主模型的生命週期綁在一起」——綁在一起換來的是免維護與加速比不衰退，代價是草稿頭沒辦法脫離這個主模型重複使用。

## 參考資料

- [ERNIE Blog：Introducing ERNIE 5.5 Flash Preview（官方發布文，含 benchmark 總表）](https://ernie.baidu.com/release/ernie-5-5-flash-preview)
- [ERNIE Blog：ERNIE 5.5 Flash Base（基座模型發布文，架構與 base-to-base 評測）](https://ernie.baidu.com/release/ernie-5-5-flash-base/)
- [HuggingFace：baidu/ERNIE-5.5-Flash-Preview（模型卡，含完整 20 項 benchmark 表與部署指令）](https://huggingface.co/baidu/ERNIE-5.5-Flash-Preview)
- [Baidu Qianfan 國際版定價文件（ERNIE-5.5-Flash-Preview 計費）](https://intl.cloud.baidu.com/en/doc/qianfan/s/Jm8r1826a-intl-en)
- [The Decoder：Baidu releases ERNIE 5.5 Flash Base with 280 billion parameters as an open-source foundation model](https://the-decoder.com/baidu-releases-ernie-5-5-flash-base-with-280-billion-parameters-as-an-open-source-foundation-model)
