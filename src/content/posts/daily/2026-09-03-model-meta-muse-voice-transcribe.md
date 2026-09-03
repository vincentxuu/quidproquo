---
title: "模型卡｜Muse Voice Transcribe"
date: 2026-09-03
category: daily
type: digest
tags: [ai-agent, model-release, daily, meta, model-family-muse]
lang: zh-TW
description: "Meta 發佈首款即時語音感知模型 Muse Voice Transcribe——單一模型整合 streaming ASR、20+ 人 diarization 與 endpointing，WER 3.1% 拿下 Artificial Analysis 串流語音辨識第一"
tldr: "Muse Voice Transcribe（muse-voice-transcribe-1.0）：Meta Superintelligence Labs 首款即時語音感知模型，2026-09-01 上線；閉源，僅提供 API，$0.18／小時音訊（$3.00／千分鐘）；Streaming 最終逐字稿 WER 3.1%（Artificial Analysis AA-WER Streaming 第一，優於 Cartesia Ink-2 的 3.4%），語音結束到出稿延遲僅 0.16 秒；單一模型同時做 ASR、20+ 人 diarization、endpointing，取代過去需串接三套系統的作法"
series:
  name: "AI Model Tracker"
  order: 13
glossary:
  - term: "Muse"
    def: "Meta 的多模態 AI 模型家族，涵蓋 Spark（文字／多模態 LLM）、Glimmer（本地端 agentic 模型）與 Voice（語音感知模型）等產品線"
---

> 🌏 [English version](/en/posts/daily/2026-09-03-model-meta-muse-voice-transcribe-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `muse-voice-transcribe-1.0` |
| 廠商 | Meta（Meta Superintelligence Labs） |
| 參數量 | 未公開 |
| Context Window | 不適用（即時串流語音辨識模型，非文字 context window 概念；WebSocket session 上限 60 分鐘，單次檔案上傳最長 10 分鐘音訊） |
| Input 定價 (USD/1M tokens) | 不適用（依音訊時長計費，非 token 計費，見下方） |
| Output 定價 (USD/1M tokens) | 不適用；官方牌價為 $0.18／每小時音訊（等同 $3.00／每 1,000 分鐘音訊），串流與非串流、ZDR（零資料保留）同價 |
| 開源 | 否（未釋出權重，僅透過 API 提供） |
| 發布日 | 2026-09-01 |
| 官方公告 | [Meta AI Research Blog：Introducing Muse Voice Transcribe](https://research.meta.ai/blog/introducing-muse-voice-transcribe) |
| HuggingFace | 無（閉源，僅透過 Meta Model API 提供） |
| 家族 | Muse（與 Muse Spark 1.x 文字模型、Muse Glimmer 本地模型同源；為首款即時語音感知模型） |

## 能力亮點

- 單一模型整合 streaming ASR、speaker diarization（可分辨 20 人以上）與 endpointing 三項任務，取代過去需串接三套系統的作法
- Streaming 最終逐字稿 WER 僅 3.1%，Artificial Analysis AA-WER Streaming 排名第一，優於 Cartesia Ink-2 的 3.4%
- 語音結束到出最終逐字稿的延遲僅 0.16 秒，比 Cartesia Ink-2 的 0.43 秒快超過 2.5 倍，達成 speed-accuracy 的 Pareto front
- 三個公開 diarization 測試集（AMI-IHM、AMI-SDM、VoxConverse）平均 speaker labelling error 17.5%，優於其他系統的 21.1%～28.6%（Meta 自測）
- 支援 70+ 語言（25 種經廣泛驗證），原生處理句內語碼轉換（code-switching），中英夾雜單句也能正確辨識

## Benchmark 表現

| Benchmark | Muse Voice Transcribe | 前代 | 競品最強 |
|---|---|---|---|
| Streaming 最終逐字稿 WER（AA-WER Streaming，越低越好） | 3.1% | 無（Meta 首款此類模型） | Cartesia Ink-2 3.4% |
| 語音結束後延遲（秒，越低越好） | 0.16 秒 | — | ElevenLabs Scribe v2 Realtime 0.14 秒（WER 較高且定價較貴） |
| Diarization 平均錯誤率（AMI-IHM／AMI-SDM／VoxConverse 平均） | 17.5% | — | 競品系統 21.1%～28.6%（Meta 自測） |
| API 定價（每 1,000 分鐘音訊） | $3.00 | — | Cartesia Ink-2 $4.00；ElevenLabs Scribe v2 Realtime $6.50 |

⚠️ Streaming WER 與延遲數字來自第三方 Artificial Analysis 的 AA-WER Streaming 測試；Diarization 誤差數字為 Meta 官方自測結果，尚待第三方獨立複現。

## 與前代/競品比較

這是 Meta Superintelligence Labs 首款即時語音感知模型，沒有嚴格意義上的「前代」可比，比較基準是業界既有的 streaming ASR 服務。

跟目前 streaming ASR 賽道最接近的 Cartesia Ink-2 相比，Muse Voice Transcribe 的 WER 差距其實不大（3.1% 對 3.4%），但延遲差距明顯：0.16 秒對 0.43 秒，快 2.5 倍以上，這對即時語音互動的自然度影響更直接。定價也便宜 25%（$3.00 對 $4.00／千分鐘）。跟 ElevenLabs Scribe v2 Realtime 比，ElevenLabs 延遲更低（0.14 秒）但準確度較差、定價貴超過一倍（$6.50 對 $3.00）——顯示 Meta 選擇的是「準確度與延遲都要顧、同時把價格壓到最低」的定位，而非單押某一項指標。

最大差異化在於「三合一」架構：diarization、endpointing 跟 ASR 共用同一個模型與同一組特殊 token 機制（`<|start_of_turn|>`、`<|speaker_A-Z|>`、`<|speech_onset|>`、`<|speech_endpoint|>`），不需要額外接第二、第三個模型，這是目前多數競品（包含 Cartesia、ElevenLabs、Deepgram）沒有做到的整合程度；diarization 也內建在同一費率中，不像部分競品需要為串流 diarization 額外收費。

## 對 Agent 開發的意義

過去做 voice agent 得串接 ASR、VAD/endpointing、diarization 三套獨立系統，每個環節銜接都會增加延遲跟同步失準的風險。Muse Voice Transcribe 用單一 API 就能同時拿到逐字稿、發言者標籤跟斷句時機，等於把這條 pipeline 收斂成一次呼叫。

- 如果你在做客服／會議記錄類 agent：diarization 內建在同一費率、音訊超過一小時也不必自己拆分送出，很適合會議轉錄、客服品質分析這類長音訊場景
- 如果你在做即時語音互動 agent（voice command、AI 眼鏡助理）：0.16 秒延遲加上「adaptive delay」（模型依單字難度動態決定要聽多久再回答），比固定緩衝策略更接近人類對話的自然節奏
- 不適合：需要地端／自架部署、或音訊資料不能離開自己機房的場景（沒有開放權重，只有雲端 API）；也不適合需要 word-level timestamp、情緒偵測或聲音事件偵測的場景，官方文件明確列出這些目前都不支援

## 今日收穫

原本以為做出「準確度最高」的語音辨識模型就是終點，但 Muse Voice Transcribe 的設計重點其實是把「延遲」本身變成一個模型可以學習的變數——用強化學習讓模型自己決定每個字要聽多久音訊才動筆，而不是工程師手動調一個固定的緩衝時間。這代表延遲不只能靠架構優化去壓縮，也可以是模型訓練目標的一部分。

## 參考資料

- [Meta AI Research Blog：Introducing Muse Voice Transcribe](https://research.meta.ai/blog/introducing-muse-voice-transcribe)
- [Meta Model API 文件：Speech to text（Muse Voice Transcribe）](https://dev.meta.ai/docs/speech-to-text)
- [MarkTechPost：Meta Superintelligence Labs Releases Muse Voice Transcribe](https://www.marktechpost.com/2026/09/01/meta-superintelligence-labs-releases-muse-voice-transcribe-one-real-time-model-for-streaming-asr-diarization-and-endpointing)
- [DataNorth AI：Meta launches Muse Voice Transcribe（含 Cartesia Ink-2／ElevenLabs 對比表）](https://datanorth.ai/news/meta-launches-muse-voice-transcribe)
- [9to5Mac：Meta launches Muse Voice Transcribe for real-time voice dictation on Mac](https://9to5mac.com/2026/09/01/meta-launches-muse-voice-transcribe-for-real-time-voice-dictation-on-mac)
