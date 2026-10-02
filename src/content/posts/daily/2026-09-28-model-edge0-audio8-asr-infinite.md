---
title: "模型卡｜Audio8 ASR Infinite"
date: 2026-09-28
category: daily
type: digest
tags: [ai-agent, model-release, daily, edge0, model-family-audio8]
lang: zh-TW
description: "Edge0 開源串流語音辨識模型 Audio8 ASR Infinite——4B 參數、Rolling KV Cache 支援 24/7 不間斷轉錄、中文辨識大幅超越 Voxtral 與 Nemotron，但號稱的 Apache-2.0 授權藏著非商用的 Qwen decoder 缺口"
tldr: "Audio8 ASR Infinite：Edge0 2026-09-21 在 HuggingFace 開源，4B 參數（Voxtral Realtime 音訊塔＋Qwen2.5-3B-Instruct decoder），30 秒 Rolling KV Cache＋RoPE re-basing 支援無限長 24/7 串流轉錄不漂移，附語意 VAD 分辨思考停頓與真正結束語句；中文 CER（aishell1 1.75%、aishell4 2.89%）大幅領先 Voxtral-Mini-4B-Realtime（16.80%／16.46%）與 Nemotron-3.5-ASR-Streaming-0.6B，但英文 LibriSpeech WER 反而輸給 Voxtral；模型卡標榜 Apache-2.0，社群已在 GitHub Issue 指出 decoder 繼承自 Qwen2.5-3B-Instruct 的非商用 Qwen Research License，商用部署前需先解決這個授權缺口"
series:
  name: "AI Model Tracker"
  order: 34
glossary:
  - term: "Audio8"
    def: "Edge0 開發的串流語音辨識（ASR）模型系列，Audio8 ASR Infinite 是首個公開釋出的版本"
---

> 🌏 [English version](/en/posts/daily/2026-09-28-model-edge0-audio8-asr-infinite-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `Edge0/Audio8-ASR-Infinite` |
| 廠商 | Edge0 |
| 參數量 | 4B（Voxtral Realtime 4B 音訊塔初始化 + Qwen2.5-3B-Instruct 初始化的 decoder，兩者皆全參數重新訓練） |
| Context Window | 30 秒滾動音訊／文字視窗（Rolling KV Cache＋RoPE 精確 re-basing，理論上可 24/7 不間斷、不漂移） |
| Input 定價 (USD/1M tokens) | 未提供（開源權重，無官方託管 API，需自架 vLLM） |
| Output 定價 (USD/1M tokens) | 未提供（同上） |
| 開源 | 標榜是（Apache-2.0），但有授權缺口——見下方「與前代/競品比較」 |
| 發布日 | 2026-09-21（HuggingFace checkpoint 上傳）／2026-09-23（X 官方公告） |
| 官方公告 | [Samuel Zeng（Edge0）X 貼文](https://x.com/SamuelZengML/status/2102726739449332221) |
| HuggingFace | [Edge0/Audio8-ASR-Infinite](https://huggingface.co/Edge0/Audio8-ASR-Infinite) |
| 家族 | Audio8（Edge0 首發的串流 ASR 模型系列） |

## 能力亮點

- 原生串流架構，每秒最多解碼 12.5 次（80ms 音訊時鐘），可在 80/120/160ms 三種時鐘與 240–560ms 轉錄延遲之間自由組合，用一個 checkpoint 對應不同延遲預算
- Rolling KV Cache 只保留 30 秒音訊視窗並對 RoPE 做精確 re-basing，讓記憶體與延遲維持常數，官方宣稱可 24/7 連續運作不漂移
- 語意 VAD（Semantic VAD）用 8 類別、4 種時間窗（0.5／1.0／2.0／3.0 秒）的專用 head 分辨「說話者還在想」「口吃」與「真正講完」，而非傳統只看靜音長度的聲學 VAD
- 中英雙語，中文語音辨識準確率大幅領先同量級對手（見下方 benchmark）

## Benchmark 表現

| Benchmark | Audio8 ASR Infinite | Voxtral-Mini-4B-Realtime-2602 | Nemotron-3.5-ASR-Streaming-0.6B |
|---|---|---|---|
| aishell1/test（中文，CER） | 1.75% | 16.80% | 12.93%＠560ms |
| aishell4/test（中文，CER） | 2.89% | 16.46% | 14.68%＠560ms |
| LibriSpeech test-clean（英文，WER） | 3.04% | **2.21%** | 3.35%＠560ms |
| LibriSpeech test-other（英文，WER） | 6.81% | **5.55%** | 7.14%＠560ms |
| 平均錯誤率 | **3.62%** | 10.25%（僅 2 組） | 9.52% |

⚠️ 以上為 Edge0 官方在 80ms 音訊時鐘、480ms 轉錄延遲設定下的自測數據（greedy decode，EOS 抑制）。GitHub Issue #1 有第三方獨立復現，數字與官方表格一致。

## 與前代/競品比較

中文場景是這次最大的差距：aishell1／aishell4 的 CER 只有 Voxtral-Mini-4B-Realtime 的約十分之一、Nemotron-3.5-ASR-Streaming 的約五分之一，說明 Edge0 的訓練資料與優化目標明顯偏向中文。但英文 LibriSpeech 反而是唯一輸給 Voxtral 的項目，WER 高出約 0.8–1.3 個百分點，代表這不是全面碾壓，而是針對中文場景做了取捨。

真正需要留意的是授權。模型卡與 GitHub repo 都標榜 Apache-2.0，但社群在 [GitHub Issue #2](https://github.com/Edge0-AI/Audio8-ASR-Infinite/issues/2) 指出：decoder 是拿 `Qwen/Qwen2.5-3B-Instruct` 初始化再訓練，而 Qwen2.5-3B（不同於 0.5B／1.5B／7B／14B／32B 等其他尺寸）用的是 Qwen RESEARCH LICENSE AGREEMENT——僅限非商用研究/評測用途，且授權不可轉讓。換句話說，Edge0 自己訓練的音訊塔、投影層、VAD head 與程式碼可以是 Apache-2.0，但約 3B 參數的 decoder 部分，下游使用者能不能商用仍是未解問題，Edge0 官方尚未回應或在文件中揭露這個缺口。

## 對 Agent 開發的意義

Rolling KV Cache 加語意 VAD 這組合，直接對應語音 agent 最常見的兩個痛點：長時間監聽不能靠週期性重啟維持精度，以及單靠靜音長度判斷「使用者講完了沒」常常誤判打斷或搶話。

- 如果你在做 24/7 語音場景（客服監控、會議逐字稿、全雙工語音助理）：Rolling KV Cache 的常數記憶體特性是關鍵——不用像傳統串流 ASR 那樣定期重置 session 犧牲上下文連續性
- 如果你在做中文為主的語音 agent：中文 CER 個位數（1.75%／2.89%）明顯優於同量級開源選項，值得納入自架 ASR 前端的候選
- 如果你打算商用部署：先確認授權——decoder 繼承的 Qwen Research License 是非商用限制，直接上生產環境有法律風險，需要等 Edge0 釋出寬鬆授權底座版本，或自行向 Alibaba 取得商用授權
- 不適合：英文為主的場景（Voxtral-Mini-4B-Realtime 略勝一籌）；需要立即商用又不想處理授權疑慮的團隊

## 今日收穫

「Apache-2.0」標籤不代表整個 repo 都能放心商用——當模型是「自訓練模組＋外部 LLM decoder」拼接的架構時，decoder 原始授權會透過衍生作品條款繼續綁住下游使用者，而這種缺口往往要靠社群逐行核對 config.json 與 README 架構表才會被發現，官方模型卡不會主動揭露。

## 參考資料

- [HuggingFace：Edge0/Audio8-ASR-Infinite](https://huggingface.co/Edge0/Audio8-ASR-Infinite)
- [Samuel Zeng（Edge0）官方公告 X 貼文](https://x.com/SamuelZengML/status/2102726739449332221)
- [AlphaSignal：Edge0 Ships Audio8 ASR Infinite to Transcribe Speech for Hours Straight](https://alphasignal.ai/news/edge0-ships-audio8-asr-infinite-to-transcribe-speech-for-hours-straight)
- [GitHub：Edge0-AI/Audio8-ASR-Infinite](https://github.com/Edge0-AI/Audio8-ASR-Infinite)
- [GitHub Issue #2：decoder 授權缺口討論](https://github.com/Edge0-AI/Audio8-ASR-Infinite/issues/2)
