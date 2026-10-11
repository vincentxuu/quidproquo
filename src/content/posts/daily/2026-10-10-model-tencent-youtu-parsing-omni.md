---
title: "模型卡｜Youtu-Parsing-Omni"
date: 2026-10-10
category: daily
type: digest
tags: [ai-agent, model-release, daily, tencent, model-family-youtu]
lang: zh-TW
description: "Tencent 優圖實驗室開源 Youtu-Parsing-Omni——5B 單一模型用一個 encoder 吃文件/圖片/圖表/幾何/音訊/影片六種輸入，OmniDocBench v1.6 以 96.96 分創下目前已知最高分"
tldr: "Youtu-Parsing-Omni：2026-10-09 開源，HuggingFace ID `tencent/Youtu-Parsing-Omni`，5B 參數，1,048,576 tokens context window；OmniDocBench v1.6 總分 96.96（第三方可複現公開榜，比 Gemini-3-Pro 的 92.91 高 4 分以上）、OmniParsingBench 平均 75.08 為開源權重模型最高分（僅次 Gemini-3-Pro 的 77.44）；單一 Youtu-Omni-Encoder 統一處理文件/自然圖片/圖表/流程圖/幾何圖形/音訊/影片七種輸入並輸出同一套 OmniSchema JSON，取代傳統雙塔架構；開源自架、無官方 API 定價，license 為自訂條款且明文排除歐盟地區使用"
series:
  name: "AI Model Tracker"
  order: 44
glossary:
  - term: "Youtu Lab（優圖實驗室）"
    def: "Tencent 內部的電腦視覺與多模態 AI 研究團隊，Youtu-VL／Youtu-LLM／Youtu-Parsing 系列模型均由其開發"
  - term: "OmniDocBench"
    def: "評測文件解析能力（版面、文字、表格、公式、閱讀順序）的公開標準化榜單，第三方可自行複現分數"
---

> 🌏 [English version](/posts/daily/2026-10-10-model-tencent-youtu-parsing-omni-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `tencent/Youtu-Parsing-Omni` |
| 廠商 | Tencent（優圖實驗室 Youtu Lab） |
| 參數量 | 5B |
| Context Window | 1,048,576 tokens |
| Input 定價 (USD/1M tokens) | 不適用（開源自架，無官方託管 API） |
| Output 定價 (USD/1M tokens) | 不適用（開源自架，無官方託管 API） |
| 開源 | 是（自訂《License Terms of Youtu-Parsing》，非 Apache/MIT，條款明文排除歐盟地區使用） |
| 發布日 | 2026-10-09 |
| 官方公告 | [GitHub：TencentCloudADP/youtu-parsing](https://github.com/TencentCloudADP/youtu-parsing) |
| HuggingFace | [tencent/Youtu-Parsing-Omni](https://huggingface.co/tencent/Youtu-Parsing-Omni) |
| 家族 | Youtu-Parsing（前代 Youtu-Parsing 2.5B → 本代 Youtu-Parsing-Omni 5B，新增 omni 多模態） |

## 能力亮點

- 單一 **Youtu-Omni-Encoder** 同時吃文件頁、自然圖片、圖表、流程圖、幾何圖形、音訊、影片七種輸入，用同一套 `(t, h, w)` 位置編碼把像素與聲音放進同一個雙向 Transformer，不像傳統 omni 模型要用兩個各自預訓練的塔分別處理影像與聲音，再到語言模型裡才融合
- OmniDocBench v1.6 總分 **96.96**，是目前已知公開榜最高分，比 Gemini-3-Pro 的 92.91 高 4.05 分，且優於多數同量級專用 OCR 模型（TeleOCR 1.2B 的 96.91、PaddleOCR-VL-1.6 的 96.34）
- OmniParsingBench（涵蓋圖表／幾何／自然圖片／音訊／自然影片／文字密集影片六類）平均 **75.08** 分，為開源權重模型最高分，僅次於閉源的 Gemini-3-Pro（77.44）
- 十種解析任務共用同一套 **OmniSchema** 輸出格式，搭配 OSAD（OmniSchema-Aware On-Policy Distillation）訓練法：模型自己採樣、自己當下一輪老師，不需要額外設計獎勵函數或另訓一個獨立教師模型

## Benchmark 表現

| Benchmark | Youtu-Parsing-Omni | 前代 Youtu-Parsing (2.5B) | 競品最強 |
|---|---|---|---|
| OmniDocBench v1.6（Overall） | 96.96 | 93.74 | Gemini-3-Pro 92.91 |
| OmniParsingBench（六類平均） | 75.08 | 未測（前代無此項） | Gemini-3-Pro 77.44（閉源模型，領先 2.36pp） |
| ChemOCR（化學結構辨識，Tani@1.0） | 54.2 | 未測 | DeepSeek-OCR 2（3B）49.6（但該模型 Avg. Sim. 74.9 略高於本模型的 74.6） |
| PDMX-Synth（樂譜辨識，CER） | 22.73 | 未測 | LEGATO（專用光學樂譜辨識模型）23.30（本模型小幅領先） |

⚠️ OmniDocBench／OmniParsingBench 為第三方可自行複現的公開標準化榜單；ChemOCR／PDMX-Synth 為官方技術報告內的自測結果，兩項皆非模型主打場景（分別是化學結構圖與樂譜），列入是為了說明「單一模型跨領域泛化」而非專長項目的峰值表現。

## 與前代/競品比較

跟前代 Youtu-Parsing（2.5B，純文件解析）比，最大進步是把輸入範圍從「只看文件頁」擴大到「文件、自然圖片、圖表、幾何圖形、音訊、影片」七種模態共用一套 encoder 與輸出格式，OmniDocBench 分數也從 93.74 進步到 96.96，代表擴大模態覆蓋範圍沒有拖累原本最強的文件解析能力。

跟競品比，Youtu-Parsing-Omni 在 OmniDocBench 贏了所有列出的對手（包含參數量大 47 倍的 Qwen3-VL-235B 與閉源的 Gemini-3-Pro、GPT-5.2），但在 OmniParsingBench 的六個子類裡，幾何圖形（74.33 vs Gemini-3-Pro 85.43）與自然圖片（62.84 vs 69.73）兩項明顯落後 Gemini-3-Pro，顯示這顆模型的優勢集中在「結構化、有固定版面規則」的輸入（文件、圖表），對「開放式自然場景理解」還有差距。化學結構與樂譜辨識兩個非主打場景也只打平或小贏專用模型，沒有全面碾壓。

由於是開源自架模型，沒有與閉源模型對應的定價策略可比；但以 5B 參數就打平甚至超過部分百億級閉源模型在特定任務上的表現，本身就是一種「用小模型換算力成本」的定價策略。

## 對 Agent 開發的意義

這次最大的架構訊號是「用一個 encoder 做完所有感知輸入」。過去要讓 agent 同時處理文件、圖片、音訊、影片，往往要接好幾個專用模型（OCR 模型＋ASR 模型＋影片理解模型），再自己把輸出拼起來；Youtu-Parsing-Omni 把這些輸出統一成同一套 OmniSchema JSON，等於把「多模態感知」這一層收斂成一個標準化介面。

- 如果你在做文件/知識庫處理 pipeline：OmniDocBench 96.96 分加上原生支援 LaTeX 公式、OTSL 表格、Mermaid 流程圖輸出，可以直接取代「PDF 轉文字＋另外跑表格辨識」的多階段流程，5B 參數也適合自架在本地跑批次任務，不用把敏感文件送出去給閉源 API
- 如果你在做多模態 RAG 或會議/影片摘要 agent：textrich_video 任務直接輸出整段影片的 Markdown 結構化報告（含 OCR＋ASR 時間軸），可以省掉自己寫影片切片＋逐段呼叫 LLM 的中間層
- 不適合：需要強開放域場景理解的 agent（如機器人視覺、自然場景問答）——OmniParsingBench 的自然圖片／幾何圖形分數明顯落後 Gemini-3-Pro，這顆模型的訓練重心是「結構化解析」而非「開放式視覺推理」；另外 license 明文排除歐盟地區使用，面向歐盟使用者的服務需另外確認合規性

## 今日收穫

多模態模型的「omni」通常指「看得懂多種輸入」，但 Youtu-Parsing-Omni 的重點其實是「輸出格式的統一」——不管丟文件、圖表還是影片進去，都吐出同一套 OmniSchema JSON。這代表模型架構的競爭，正從「誰的輸入模態更多」轉向「誰能把多模態輸出收斂成一個下游系統好接的標準介面」，後者對實際整合 agent pipeline 的人反而更有感。

## 參考資料

- [HuggingFace：tencent/Youtu-Parsing-Omni 模型卡](https://huggingface.co/tencent/Youtu-Parsing-Omni)
- [GitHub：TencentCloudADP/youtu-parsing](https://github.com/TencentCloudADP/youtu-parsing)
- [HuggingFace：tencent/Youtu-Parsing-Omni LICENSE](https://huggingface.co/tencent/Youtu-Parsing-Omni/blob/main/LICENSE)
- [arXiv 2601.20430：Youtu-Parsing（前代文件解析模型技術報告）](https://arxiv.org/abs/2601.20430)
- [arXiv 2601.19798：Youtu-VL（視覺編碼器技術報告）](https://arxiv.org/abs/2601.19798)
- [arXiv 2512.24618：Youtu-LLM（語言模型底座技術報告）](https://arxiv.org/abs/2512.24618)
- [OmniDocBench：公開文件解析標準化榜單](https://github.com/opendatalab/OmniDocBench)
