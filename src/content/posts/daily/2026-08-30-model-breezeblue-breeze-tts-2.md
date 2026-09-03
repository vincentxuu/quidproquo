---
title: "模型卡｜BreezeBlue Breeze TTS 2"
date: 2026-08-30
category: daily
type: digest
tags: [ai-agent, model-release, daily, breezeblue, model-family-breeze-tts]
lang: zh-TW
description: "BreezeBlue 開源即時語音模型 Breeze TTS 2——開放權重 TTS 榜首（1,215 Elo），首度把語音設計、語音導演、低延遲串流三項能力整合進單一模型"
tldr: "Breeze TTS 2：開放權重（Apache 2.0 程式碼／研究非商用權重授權），Artificial Analysis Provider Voices 榜單開放權重第一（1,215 Elo，領先 Fish Audio S2 Pro 90 分），Voice Design（Role Fit 78.02）與 Voice Direction（4.25 分）雙雙第一；TTFA p50 133.6ms／p95 163.3ms，RTF 0.32（H100）；官方托管 API $34／百萬字元（比 Fish Audio S2 Pro 貴逾兩倍）；支援 50 種語言，商用需另向 RESONIA, INC. 取得授權"
series:
  name: "AI Model Tracker"
  order: 10
glossary:
  - term: "Breeze TTS"
    def: "BreezeBlue 開發的即時互動語音（text-to-speech）模型家族，主打語音設計、語音導演與低延遲串流"
---

> 🌏 [English version](/en/posts/daily/2026-08-30-model-breezeblue-breeze-tts-2-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `BreezeBlue/Breeze-TTS-2`（托管 API 呼叫用 `breeze-tts-2`） |
| 廠商 | BreezeBlue（母公司 RESONIA, INC.） |
| 參數量 | 未完整公開；主幹（backbone）為 Qwen3 架構、`llama-1B` 規格（28 層、hidden size 2048），另含 depth decoder（`llama-100M` 規格）與 T5Gemma2 文字編碼器，音訊編解碼器採 Kyutai Mimi（24kHz、32 個量化器） |
| Context Window | 不適用（TTS 模型，非文字生成，以串流即時性為主要指標） |
| Input 定價 (USD/1M tokens) | 不適用；托管 API 定價為 $34.00 / 百萬字元 |
| Output 定價 (USD/1M tokens) | 不適用（同上，單一計費維度） |
| 開源 | 是（程式碼 Apache License 2.0；模型權重為 BreezeBlue Research and Non-Commercial License，商用需向 RESONIA, INC. 另取授權） |
| 發布日 | 2026-08-17（官方公告／新聞稿）；2026-08-25 開源模型權重與 PyTorch 推論程式碼 |
| 官方公告 | [Introducing Breeze TTS 2](https://breezeblue.ai/breeze-tts-2) |
| HuggingFace | [BreezeBlue/Breeze-TTS-2](https://huggingface.co/BreezeBlue/Breeze-TTS-2) |
| 家族 | Breeze TTS 系列（Breeze TTS 2 為目前最新一代） |

## 能力亮點

- Artificial Analysis Provider Voices 盲測 Speech Arena 開放權重榜首：1,215 Elo，領先前任開放權重王者 Fish Audio S2 Pro（1,125 Elo）90 分，全站（含閉源）排名第 6／約 100 個模型
- Voice Design（無參考音訊、純文字描述生成語音）自家 benchmark 第一：Role Fit 78.02 分，領先第二名 MiMo-V2.5-TTS（72.78）5.24 分，且產生的語音多樣性（Voice Diversity 708）比最接近的競品多 39%
- Voice Direction（保留原音色、用自然語言調整語氣／情緒／節奏）自家 benchmark 第一：4.25 分，比第二名 MiMo-v2.5-TTS（3.76）高 13%，同時維持 SPK_SIM 0.67 的音色相似度
- 低延遲串流：TTFA（time to first audio）p50 133.6ms／p95 163.3ms，TTFB（time to first byte）p50 119.4ms，在 H100 上暖機後 RTF 達 0.32（約 3.1 倍即時速度），優於 ElevenLabs Flash v2.5 與 Fish Audio S2.1 Pro 的延遲表現
- 支援 50 種語言的自然語音生成，並可用括號（英文如 `(sigh)`）或方括號（中文如 `[嘆氣]`）在文字中直接插入笑聲、咳嗽、嘆氣等口語事件標記

## Benchmark 表現

| Benchmark | Breeze TTS 2 | 第二名 | 備註 |
|---|---|---|---|
| Artificial Analysis Provider Voices（Elo，開放權重） | 1,215（全站第 6／約 100 模型） | Fish Audio S2 Pro：1,125 | 各模型使用自己的原生語音 |
| Artificial Analysis Controlled Voices（Elo） | 1,002（並列，開放權重第 16／39） | Voxtral TTS（Mistral）：1,010 | 所有模型合成同一參考語者，Breeze TTS 2 與 Fish Audio S2 Pro 打平 |
| TTS Voice Design Benchmark（Role Fit） | 78.02 | MiMo-V2.5-TTS：72.78 | BreezeBlue 自建開源 benchmark |
| TTS Voice Direction Benchmark | 4.25 | MiMo-v2.5-TTS：3.76 | BreezeBlue 自建開源 benchmark，SPK_SIM 0.67 |
| 吞吐量（字元／秒） | 45 | Fish Audio S2 Pro：102 | Breeze TTS 2 吞吐量不到競品一半 |

⚠️ Provider Voices／Controlled Voices Elo 來自第三方獨立平台 Artificial Analysis 的盲測競技場，可信度較高；Voice Design／Voice Direction／Latency 三項 benchmark 為 BreezeBlue 官方自建並開源評測程式碼（非黑箱自測），但目前尚未見到大規模第三方復現。吞吐量數字出自第三方報導 AlphaSignal 整理的 Artificial Analysis 資料。

## 與前代/競品比較

Breeze TTS 2 是 BreezeBlue 的第二代模型，本次是首度公開權重（此前僅有前代／同代的商用託管服務）。跟開放權重賽道的既有王者 Fish Audio S2 Pro 相比，Breeze TTS 2 在「用自己設計的語音」場景下大幅領先（+90 Elo），但在「所有模型合成同一參考語者」的 Controlled Voices 賽道只打平，甚至輸給 Mistral 的 Voxtral TTS。這代表 Breeze TTS 2 的優勢並非單純的語音自然度，而是「語音設計＋語音導演」這套產品導向能力——這與官方公告本身強調的定位一致：主打互動式語音體驗（遊戲角色、數位夥伴、敘事型內容），而非傳統一次性內容配音。

代價是速度與價格：45 字元／秒的吞吐量不到 Fish Audio S2 Pro（102 字元／秒）的一半，托管 API $34／百萬字元也是 Fish Audio（$15／百萬字元）的兩倍以上，更遠高於輕量開放權重選項 Kokoro 82M v1.0 的 $0.65／百萬字元。換句話說，Breeze TTS 2 用吞吐量與成本換取了語音設計／導演的可控性與延遲表現，這筆交易是否划算，取決於你的應用是否真的需要「每個角色一種聲音」而非單純的高吞吐量朗讀。

## 對 Agent 開發的意義

Breeze TTS 2 的定位很明確：不是通用配音工具，而是給需要即時互動語音的 Agent／應用用的模型。p50 133.6ms 的 TTFA 加上單一 WebSocket 連線可跨多輪對話持續串流（`connection.appendText()` / `flush()` / `endTurn()`），這個 API 設計本身就是為 voice agent 的多輪對話場景打造。

- 如果你在做遊戲 NPC 或數位夥伴：Voice Design 讓你不需要語音庫就能用一段文字描述（如「沙啞、老練的說書人」）生成專屬角色聲音，Voice Diversity 708 代表在大量角色需求下比競品更不容易撞聲
- 如果你在做客服或多輪對話 voice agent：Voice Direction 可以在同一個聲音身分下，依對話情境即時調整語氣（如從自信轉為驚慌），不需要重新設計語音，加上低延遲串流適合即時語音互動
- 不適合：需要高吞吐量批次生成大量朗讀內容的場景（有聲書、長篇內容配音）——45 字元／秒的速度與 $34／百萬字元的定價，在這類場景會遠比 Fish Audio S2 Pro 或 Kokoro 這類針對吞吐量優化的模型昂貴；另外商用部署需先向 RESONIA, INC. 取得授權，非商用測試才能直接用開源權重

## 今日收穫

多數 TTS benchmark 過去只測「像不像真人說話」（naturalness），但 Breeze TTS 2 在兩個賽道的分裂表現——Provider Voices 大贏、Controlled Voices 只打平——說明了一件容易被忽略的事：語音模型的「好」不是單一維度。當產品需求是「幫每個角色設計一個聽起來合理的聲音」而非「模仿某個特定真人語者」，傳統的音色相似度／自然度評測可能根本測不出真正的差異化能力，這也是為什麼 BreezeBlue 選擇自建並開源 Voice Design／Voice Direction 這兩套新 benchmark。

## 參考資料

- [BreezeBlue 官方公告：Introducing Breeze TTS 2](https://breezeblue.ai/breeze-tts-2)
- [HuggingFace 模型卡：BreezeBlue/Breeze-TTS-2](https://huggingface.co/BreezeBlue/Breeze-TTS-2)
- [GitHub：breezeblue-ai/breeze-tts](https://github.com/breezeblue-ai/breeze-tts)
- [AlphaSignal：BreezeBlue's Breeze TTS 2 Tops Open Weights Voice AI With 1,215 Elo](https://alphasignal.ai/news/breezeblue-s-breeze-tts-2-tops-open-weights-voice-ai-with-1-215-elo)
- [Artificial Analysis on X：Breeze TTS 2 排名公告](https://x.com/ArtificialAnlys/status/2092399623839326550)
- [Cincinnati Enquirer（新聞稿）：Breeze Blue Unveils Breeze TTS 2](https://www.cincinnati.com/press-release/story/110150/breeze-blue-unveils-breeze-tts-2-real-time-flagship-voice-ai-for-interactive-media/)
