---
title: "語音與音訊模型家族——從 Whisper 開源 ASR 到 Eleven v4 與 GPT-Live：轉錄、合成、即時對話與音樂怎麼選"
date: 2026-08-26
category: tech
tags: [whisper, elevenlabs, text-to-speech, speech-to-text, kokoro, voice-cloning, model-family-speech]
lang: zh-TW
type: deep-dive
tldr: "2026-11 的語音模型分四條線。轉錄（ASR）：Artificial Analysis 的 AA-WER v2.2 上，阿里 Fun-Realtime-ASR-preview 錯字率最低（1.7%），ElevenLabs Scribe v3 第二（1.9%）；開放權重第一是 Salesforce 的 SOV-Transcribe-1（2.3%，Apache 2.0），Voxtral Small 與 Nemotron 3.5 Transcribe 並列其後（2.8%），Whisper Large v3 約 4.1%，已是舊基線。語音合成（TTS）：Eleven v4 與 v4 Turbo 同分第一（Turbo 價格一半），開放權重第一是 Fish Audio Drama 3，授權只讓年營收 50 萬美元以下的公司免費商用。即時對話：OpenAI 改推全雙工的 GPT-Live-1（每分鐘 $0.05），Google 有 Gemini 3.8 Live。音樂：AA 純音樂榜第一是 Suno v6。"
description: "AI 語音與音訊模型 2026-11 選型：AA-WER v2.2 轉錄榜與 Whisper 之後的開放權重 ASR（SOV-Transcribe-1、Voxtral、Nemotron 3.5 Transcribe），Eleven v4／Scribe v3 與 ElevenLabs 定價，Fish Audio Drama 3、Kokoro 等開放 TTS 的授權，GPT-Live-1、Gemini 3.8 Live 即時語音，Suno v6 音樂生成，以及 Whisper 到 Eleven v4 的演化時間線。"
series:
  name: "AI 模型家族"
  order: 17
draft: false
glossary:
  - term: "WER"
    aliases: ["Word Error Rate", "字錯誤率"]
    definition: "語音辨識的核心指標：轉錄結果與人工參考稿相比，錯字數佔總字數的比例，越低越好。中文、日文等無空格斷詞的語言常用 CER（字元錯誤率）替代"
  - term: "ASR"
    aliases: ["Automatic Speech Recognition", "自動語音辨識"]
    definition: "把音訊轉成文字的技術，即語音轉錄。Whisper、Scribe、Voxtral、Nemotron Transcribe 都屬這條線"
  - term: "TTS"
    aliases: ["Text-to-Speech", "語音合成"]
    definition: "把文字轉成語音的技術。主流評測是人類盲聽對戰的 Elo 排名，Eleven v4、Fish Audio Drama 3、Kokoro 都屬這條線"
  - term: "零樣本語音複製"
    aliases: ["zero-shot voice cloning"]
    definition: "只給幾秒鐘參考音訊就能合成該說話者的聲音，不需重新訓練模型。Eleven v4 的 Instant Voice Clone 約需 10 秒、Chatterbox 約 5 秒"
  - term: "全雙工"
    aliases: ["full duplex"]
    definition: "語音模型可以邊聽邊講：使用者插話、附和或停頓時，模型不必等一輪結束才反應。GPT-Live-1 屬於這類"
---

> :globe: [English version](/posts/tech/2026-08-26-ai-model-family-speech-audio-en)

語音模型的選型問題分成四類：把聲音轉成文字（ASR）、把文字唸出來（TTS）、讓 agent 直接跟人講話（即時語音對話），以及生成音樂。這篇給要在 agent 或內容產品裡接語音的開發者，看完能決定：轉錄用哪個 API 或開放權重模型、配音與語音 agent 用哪個 TTS、即時對話走哪種架構，以及哪些開放權重其實不能直接商用。榜單與定價是 2026-11-23 的資料，引用時請帶日期。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)；各用途的總表在[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)。

## 目前的選型地圖

| 任務 | API 首選 | 開放權重首選 | 關鍵差異 |
|---|---|---|---|
| 批次轉錄 | Fun-Realtime-ASR-preview（阿里）、Scribe v3（ElevenLabs）、MAI-Transcribe-2（Microsoft） | SOV-Transcribe-1（Apache 2.0）、Voxtral Small（Apache 2.0）、Nemotron 3.5 Transcribe（OpenMDW-1.1） | API 前三錯字率 1.7%～2.0%；開放權重最好 2.3%，Whisper Large v3 約 4.1% |
| 語音合成 | Eleven v4／v4 Turbo | Fish Audio Drama 3（有營收門檻）、Kokoro 82M（Apache 2.0） | v4 Turbo 與 v4 同分、價格一半；Drama 3 品質高但 35B 參數，Kokoro 便宜但不能複製聲音 |
| 即時語音對話 | GPT-Live-1、Gemini 3.8 Live、Eleven Realtime v1 | 自組 cascade（開放 ASR＋LLM＋TTS） | 計價單位不同：GPT-Live 按分鐘、Gemini Live 按 token 且每回合重算整段 context |
| 音樂 | Suno v6 | 沒有接近前段的選項 | Suno v6 純音樂 Elo 1148，第三名起落後 60 分以上 |

## ASR 線：Whisper 之後，轉錄變成語言模型的工作

### 2026-11 的 AA-WER 榜

| 模型 | AA-WER | 類型 | 每千分鐘 | 定位 |
|---|---|---|---|---|
| Fun-Realtime-ASR-preview | 1.7% | 閉源 API | $2.82 | 阿里，錯字率最低 |
| Scribe v3 | 1.9% | 閉源 API | $3.33 | ElevenLabs，2026-11-10 推出 |
| MAI-Transcribe-2 | 2.0% | 閉源 API | $1.67 | Microsoft，約 340 倍即時速度 |
| Voxtral Small Transcribe 3 | 2.1% | API | $4.00 | Mistral |
| SOV-Transcribe-1 | 2.3% | 開放權重，Apache 2.0 | — | Salesforce，開放權重第一 |
| Voxtral Small | 2.8% | 開放權重，Apache 2.0 | $4.00 | Mistral，24B |
| Nemotron 3.5 Transcribe | 2.8% | 開放權重，OpenMDW-1.1 | $2.00 | NVIDIA，34B（4.3B 啟用） |
| GPT Transcribe | 3.3% | 閉源 API | $4.50 | OpenAI |
| Whisper Large v3 | 約 4.1% | 開放權重，MIT | $1.15 起 | 工具支援最廣的舊基線，各服務商 4.1%～4.5% |
| Parakeet TDT 0.6B V3 | 4.5% | 開放權重 | $1.50 | NVIDIA，約 628 倍即時速度，最快 |

（AA-WER v2.2 來自 [Artificial Analysis Speech to Text](https://artificialanalysis.ai/speech-to-text)，2026-11-23。測的是以英文為主的非串流轉錄，約 8 小時音訊，混合語音 agent 對話（50%）、歐洲議會演講與財報電話會議（各 25%）；價格以榜上列出的服務商為準，開放權重自架的成本另算。）

這張榜有兩個讀法。第一，API 的前段已經擠在 2% 上下，差距小於換一種錄音條件帶來的變化，選 API 時延遲、價格與 diarization（說話者分離）比榜上的 0.2 個百分點更重要。Scribe v3 的官方說法是比 Scribe v2 少 27% 字錯誤（FLEURS 102 種語言，ElevenLabs 自測），並且 diarization 錯誤更少；Microsoft 的 MAI-Transcribe-2 則用最低價與最高速度換一點準確率。第二，開放權重和 API 的距離縮到 0.5 個百分點以內：自架不再意味著明顯較差的轉錄品質。

### 開放權重的新形態：語音編碼器接 MoE 語言模型

Whisper 是 encoder-decoder：音訊編碼器吃 30 秒 log-Mel spectrogram，小型 decoder 自迴歸吐出文字。2026 年下半年衝到開放權重前段的模型，都改成「語音編碼器＋大型語言模型」：

- **[SOV-Transcribe-1](https://huggingface.co/salesforce-sovereign-intelligence/SOV-Transcribe-1)**（Salesforce，2026-11）：Whisper large-v3 的音訊編碼器，接上 Gemma 4 26B A4B 的 MoE 語言模型，26.6B 總參數、4.6B 啟用。支援英、法、德、西、義、葡、荷七種語言，單段音訊測到 30 分鐘，可以用自然語言指定逐字或整理過的稿、提供專有名詞做 context biasing。Whisper 的編碼器在這裡還活著，被換掉的是 decoder。
- **[Nemotron 3.5 Transcribe](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Transcribe-30B-A4B)**（NVIDIA，2026-10）：Mamba-2 與 Transformer 混合的 MoE 語言模型，加上 ASR 編碼器與說話者編碼器，34B 總參數、4.3B 啟用。40 種語言、單段錄音最長 1 小時，除了轉錄還做說話者標註、語音翻譯、時間戳與音訊問答，一張 H100 80GB 可跑。它在 NVIDIA 家族裡的位置見 [Nemotron 家族文](/posts/tech/2026-10-10-ai-model-family-nemotron)。
- **[Voxtral Small](https://huggingface.co/mistralai/Voxtral-Small-24B-2507)**（Mistral，2025-07）：24B、Apache 2.0，是三者中最早、授權最單純的一個；Mistral 後來的 Voxtral 3 轉錄模型走 API，見 [Mistral 家族文](/posts/tech/2026-08-24-ai-model-family-mistral)。

代價是體積：Whisper Large v3 是 1.55B，這三個模型總參數在 24B 到 34B 之間，自架要資料中心等級的 GPU。只看吞吐量，0.6B 的 Parakeet TDT V3 仍是最快的選項，準確率和 Whisper 同一級。

### Whisper：開源線停在 turbo

Whisper 的開源權重停在 2024-09 的 large-v3-turbo（decoder 從 32 層砍到 4 層，速度約 8 倍，泰語、粵語退化較明顯），之後沒有新的開放權重；GitHub 最後一次 release 是 2025-06 的套件更新。OpenAI 的轉錄改走閉源 API：[現行定價](https://developers.openai.com/api/docs/pricing)是 gpt-transcribe 每分鐘 $0.0045、gpt-4o-transcribe $0.006、mini 版 $0.003，即時轉錄的 gpt-live-transcribe 與 gpt-realtime-whisper 每分鐘 $0.017。Whisper 現在的價值是生態：幾乎所有語音工具都支援它，量化與加速版本最多，只是準確率在 AA-WER 上已落後前段約兩個百分點。

## TTS 線：Eleven v4 拿回第一，開放權重要先看授權

### 2026-11 的 TTS 榜

| 模型 | AA Elo | 類型 | 每百萬字元 | 定位 |
|---|---|---|---|---|
| Eleven v4 Turbo | 1340 | 閉源 API | $40 | ElevenLabs，即時 agent 用，與 v4 並列第一 |
| Eleven v4 | 1340 | 閉源 API | $80 | ElevenLabs，內容製作用 |
| StepAudio 3 TTS | 1307 | 閉源 API | $14 | 階躍星辰 |
| Qwen-Audio-3.1-TTS-Plus | 1298 | 閉源 API | $19.31 | 阿里 |
| Simba 3.5 | 1293 | 閉源 API | $6.58 | 前段班最便宜 |
| Gemini 3.8 Flash TTS | 1282 | 閉源 API | $16.49 | Google |
| Fish Audio Drama 3 | 1277 | 開放權重（Fish Audio Community License） | $15 | 開放權重第一 |
| Breeze TTS 2 | 1228 | 開放權重（權重非商用） | $34 | 開放權重第三 |
| Eleven v3 | 1191 | 閉源 API | $100 | 上一代，掉到第 24 |
| Kokoro 82M v1.0 | 1060 | 開放權重，Apache 2.0 | $0.65 | 全榜最便宜之一，可自架 |

（Elo 來自 [Artificial Analysis Text to Speech Leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard) 的 Provider Voice 榜，2026-11-23，以 Zonos-v0.1 為 1000 分基準。這張榜比的是各家內建的聲音，不測聲音複製；開放權重的價格是榜上託管服務的價格。）

### ElevenLabs：v4 換新架構，定價降回 v3 的水準

[Eleven v4 與 v4 Turbo](https://elevenlabs.io/blog/eleven-v4) 在 2026-09-28 推出，官方說是全新架構。和 v3 相比，影響選型的改變有四個：

- **v4 Turbo 讓即時 agent 也拿得到最高品質。** 中位推論延遲約 100ms、首音約 150ms（官方自測），在榜上和 v4 同分，價格一半（每千字元 $0.04 對 $0.08）。v3 時代要即時就得退回 Flash v2.5，現在 Flash v2.5 在榜上只有 1075 分。
- **聲音複製更快。** Instant Voice Clone 約 10 秒參考音訊；Professional Voice Clone 在 v3 不支援，v4 恢復支援。
- **90 多種語言，跨語言時刻意不保留原口音。** [官方文件](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4)說明：用韓語錄的聲音生成英文，v4 會說道地的英文，而不是帶韓國腔的英文。做配音在地化是好事；如果產品依賴「同一口音帶進其他語言」，遷移前要先測。
- **audio tags 仍在，但官方承認還不完美。** `[laughs]`、`[whispers]`、音效標籤可以疊用，v4 跟得比 v3 準。

[API 定價頁](https://elevenlabs.io/pricing/api)上，v4 與 v3 都是每千字元 $0.08，v4 Turbo 與 Flash/Turbo 系列是 $0.04。榜上 v3 的 $100 是 AA 列的標價，和定價頁不同，以定價頁為準。公司層面，ElevenLabs 在 2026-09-30 以 3 億美元員工股份收購，[估值來到 220 億美元](https://elevenlabs.io/blog/tender-22bn)，是 2 月 Series D 的兩倍，企業客戶佔營收 55%。它賣的仍是全家桶：TTS、Scribe 轉錄、ElevenAgents 平台、Realtime 語音對話、音效與音樂。

### 開放權重 TTS：品質、授權與維護狀態三選二

| 模型 | 參數量 | 權重授權 | 複製 | 現況 |
|---|---|---|---|---|
| [Fish Audio Drama 3](https://huggingface.co/fishaudio/drama-3) | 35B（3B 啟用） | Fish Audio Community License | ✓ | 2026-10，開放權重第一；最多 16 個角色的多人對白 |
| Breeze TTS 2 | — | 權重非商用，商用要另外授權 | ✓ | 2026-08，語音設計與導演能力強，吞吐量低 |
| [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) | 82M | Apache 2.0 | ✗ | 2025-01 之後沒有新版，一般 CPU 快過即時 |
| [Chatterbox](https://github.com/resemble-ai/chatterbox) | 0.5B | MIT | ✓（約 5 秒） | 2026-08 起停止維護，只剩存檔；輸出預設帶浮水印 |
| Voxtral 4B TTS | 4B | CC-BY-NC 4.0 | ✓ | Mistral，權重禁商用，商用走 API |
| XTTS v2（Coqui） | 約 467M | CPML（非商用） | ✓（約 6 秒） | Coqui 2024 年倒閉，沒有取得商用授權的管道 |

**Fish Audio Drama 3 是目前最強的開放權重，但不是無條件可商用。** 它的 [LICENSE](https://huggingface.co/fishaudio/drama-3/blob/main/LICENSE) 是 2026-10-13 的 Fish Audio Community License：研究與非商用免費；年營收低於 50 萬美元的公司可以免費商用；其他商用以及把它做成託管服務，都要另簽授權。HF 頁面的授權欄位仍寫 research license，以 LICENSE 檔為準。Fish Speech 的 GitHub repo 也換成同一份授權。架構上它是 35B 總參數、每個 token 3B 啟用的 MoE，H200 上單串流首音不到 100ms，但部署門檻遠高於約 500M 的舊一代 Fish Speech。

**Chatterbox 從「商用複製首選」變成存檔。** Resemble AI 在 2026-08 宣布 Chatterbox 系列退役、轉做深偽偵測：程式與權重仍以 MIT 授權公開，但沒有維護、更新與付費方案。6 月的 Multilingual V3（0.5B、25 種語言）是最後一版，所有自架輸出預設嵌入 PerTh 浮水印。現在用它等於自己扛維護。

**Kokoro 仍是「離線唸稿」的答案。** 82M 參數、Apache 2.0、一般 CPU 快過即時，榜上 1060 分是開放權重裡少數能直接商用、又便宜到可以忽略成本的選項；它不能複製聲音。

授權陷阱的通則沒變：程式碼的授權不等於權重的授權（F5-TTS、MaskGCT 程式碼 MIT、權重 CC-BY-NC），同一家公司的不同模型也可能不同授權（Mistral 的 Voxtral Small 是 Apache 2.0，Voxtral 4B TTS 是 CC-BY-NC）。每次換版都重讀權重的 LICENSE 檔。

## 即時語音對話：三種架構

舊做法是 ASR→LLM→TTS 三段串接（cascade），延遲與語氣都卡在轉換點。2026 下半年各家給出三種不同的答案，OpenAI 的 [voice agents 指南](https://developers.openai.com/api/docs/guides/voice-agents)也把它們並列：

- **全雙工語音層＋獨立後端：GPT-Live-1。** [2026-09-10 上線 API](https://openai.com/index/introducing-gpt-live-1-in-the-api/)，可以邊聽邊講，推理與工具呼叫委派給你選的後端模型（OpenAI 的 Responses 模型或任何自己的 agent）。計價只算語音層：活躍時每分鐘 $0.05，WebRTC 暫停推論時 $0.02，後端模型另計；支援 WebRTC、WebSocket 與 SIP 電話。好處是既有的文字 agent 不用重寫，只換掉語音介面。
- **單一 speech-to-speech 模型：gpt-realtime-2.1、Gemini 3.8 Live。** 同一個模型聽、想、講。OpenAI 的 gpt-realtime-2.1 音訊每百萬 token $32／$64，mini 版 $10／$20。Google 的 [Gemini 3.8 Live](https://blog.google/innovation-and-ai/technology/developers-tools/build-real-time-voice-applications-gemini-audio/)（2026-09-15）音訊輸入約每分鐘 $0.005、輸出約 $0.018，另有可調推理的 Extended Thinking 版；但 [Live API 每回合會把整段 session context 重新計費](https://cloud.google.com/model-garden/pricing)，而且 proactive audio 永遠開啟、聆聽時間也算輸入，長對話的實際帳單會遠高於每分鐘單價。
- **把 cascade 做到極致：ElevenLabs。** Eleven v4 Turbo＋Scribe v3 Live＋ElevenAgents，或直接用 [Eleven Realtime v1 Mini／Max](https://elevenlabs.io/pricing/api)（每分鐘 $0.08 加 LLM 用量，相容 OpenAI Realtime 介面）。聲音本身是產品（品牌音色、角色）時，這條路的可控性最高。

評測上，[Artificial Analysis 的 Speech to Speech 榜](https://artificialanalysis.ai/speech-to-speech)推理題（Big Bench Audio）前五名都在 98.8% 以上，對話動態（Full Duplex Bench）前五也在 96.9% 以上，GPT-Live-1 在後者之列。前段差距已經小到不足以決定選型，架構、計價方式與電話整合才是。

## 音樂生成：Suno v6 領先一截

| 模型 | AA Elo（純音樂） | 開發商 |
|---|---|---|
| Suno v6 | 1148 | Suno |
| Suno v6-mini | 1114 | Suno |
| Mureka V9.5 | 1084 | Mureka |
| Lyria 3 Pro | 1080 | Google |
| Eleven Music | 1021 | ElevenLabs |
| MiniMax Music 3.0 | 1000 | MiniMax（本榜基準點） |
| MusicGen | 868 | Meta，開放權重，排名最後 |

（[AA-Music-Instrumental v1.1](https://artificialanalysis.ai/music/leaderboard/instrumental)，2026-11-23。另有含人聲的榜，排名可能不同。）

[Suno v6](https://suno.com/blog/introducing-v6)（2026-09-09）分成 v6、偏實驗的 v6-wild 與給所有使用者的 v6-mini，可以用自然語言改歌的某一段、混搭多首歌的元素、用圖片或影片當參考。它和 Warner、BMG、Believe 合作開發，舊模型會退役；但 Suno 沒有公開訓練資料的細節，[Sony、Universal 的訴訟也還在進行](https://techcrunch.com/2026/09/09/suno-replaces-its-ai-models-with-a-new-one-trained-on-licensed-music-as-copyright-suits-pile-up/)，商用前要讀清楚授權條款。要用 API 串進產品，ElevenLabs 的 Eleven Music 每分鐘 $0.15 是現成選項，品質在第二梯隊之後。

## 演化時間線

| 時間 | 事件 | 改變了什麼選型 |
|---|---|---|
| 2022-09 | [Whisper](https://github.com/openai/whisper) 以 MIT 開源，最大 1.55B | 接近 SOTA 的轉錄可以在筆電上跑，商業 ASR 的價格被打下來 |
| 2023-11 | Whisper large-v3（Mel 80→128 bins） | 多語言錯字率全面改善，成為往後兩年的開源基線 |
| 2024-09 | large-v3-turbo（[decoder 32→4 層](https://github.com/openai/whisper/discussions/2363)） | 速度約 8 倍，也是最後一版開放權重 Whisper |
| 2025-01 | Kokoro-82M | 證明 82M 參數就能做出可商用的旁白級 TTS |
| 2025-03 | [gpt-4o-transcribe](https://openai.com/index/introducing-our-next-generation-audio-models/) 閉源 | OpenAI 的轉錄改走 API，開源前沿交給 NVIDIA、Mistral 等 |
| 2026-02 | Eleven v3 GA；[Series D 5 億美元、估值 110 億](https://elevenlabs.io/blog/series-d) | v3 的 audio tags 讓「導戲」成為 TTS 的標準介面 |
| 2026-08 | [Breeze TTS 2](/posts/daily/2026-08-30-model-breezeblue-breeze-tts-2) 開放權重；Chatterbox 停止維護 | 開放 TTS 前段改由研究或有門檻的授權主導 |
| 2026-09 | [Meta Muse Voice Transcribe](/posts/daily/2026-09-03-model-meta-muse-voice-transcribe)、[GPT-Live-1](/posts/daily/2026-09-11-ai-agent-daily)、[Gemini 3.8 Live](/posts/daily/2026-09-16-ai-agent-daily)、Suno v6、Eleven v4 | 即時語音從 cascade 轉向全雙工；TTS 第一回到 ElevenLabs |
| 2026-10 | Fish Audio Drama 3；[Nemotron 3.5 Transcribe](/posts/daily/2026-10-29-ai-agent-daily)；[Phonic-1](/posts/daily/2026-10-31-funding-phonic) | 開放權重 ASR 改成語音編碼器＋MoE 語言模型 |
| 2026-11 | Scribe v3、SOV-Transcribe-1 | API 與開放權重轉錄的差距縮到 0.5 個百分點內 |

串流轉錄這條支線另見 [Audio8 ASR Infinite](/posts/daily/2026-09-28-model-edge0-audio8-asr-infinite) 的模型卡：它在中文 CER 上大幅領先 Voxtral 與 Nemotron 的串流版，但 decoder 繼承自非商用的 Qwen 授權。

## 授權與定價對照

| 供應 | 代表 | 授權 | 計價 | 適合 |
|---|---|---|---|---|
| OpenAI Whisper | large-v3／turbo | **MIT，權重可自架** | 自付 GPU | 本地轉錄、要最廣工具支援 |
| Salesforce | SOV-Transcribe-1 | **Apache 2.0** | 自付 GPU（26.6B） | 自架最高準確率，七種歐洲語言 |
| NVIDIA | Nemotron 3.5 Transcribe | OpenMDW-1.1 | 自付 GPU（1×H100） | 40 種語言、說話者標註、長錄音 |
| ElevenLabs | Scribe v3／v3 Live | 閉源 | 每小時 $0.20／$0.22 | 高準確轉錄與 diarization |
| OpenAI API | gpt-transcribe | 閉源 | 每分鐘 $0.0045 | 已在 OpenAI 生態內的批次轉錄 |
| ElevenLabs | Eleven v4／v4 Turbo | 閉源 | 每千字元 $0.08／$0.04 | 配音、語音 agent |
| Fish Audio | Drama 3 | Community License（年營收 < 50 萬美元可商用） | 自架或 $15／百萬字元 | 小團隊自架高品質 TTS |
| Kokoro | 82M v1.0 | **Apache 2.0** | 免費，CPU 可跑 | 離線旁白、邊緣裝置 |
| OpenAI | GPT-Live-1 | 閉源 | 每分鐘 $0.05（後端另計） | 全雙工電話與 app 語音 agent |
| Google | Gemini 3.8 Live | 閉源 | 音訊約每分鐘 $0.005／$0.018，每回合重算 context | 大量、短回合的 app 語音 |
| Suno | v6 | 訂閱服務 | Pro／Premier 方案 | 音樂創作 |

## 選型建議：Agent 開發者的四種場景

**批次轉錄**：要 API 最準，Fun-Realtime-ASR-preview 或 Scribe v3；要便宜又快，MAI-Transcribe-2。要自架，先看語言：只需要英文與主要歐洲語言，SOV-Transcribe-1 最準；需要 40 種語言、說話者標註或一小時長錄音，Nemotron 3.5 Transcribe；要最單純的授權與最低部署門檻，Voxtral Small 或 Whisper。榜單以英文為主，中文場景一定要用自己的錄音測 CER。

**配音與內容製作**：品質優先選 Eleven v4，要做多語配音先測跨語言口音的新行為；大量離線旁白用 Kokoro；要自架又要複製聲音，Fish Audio Drama 3 在年營收 50 萬美元以下可以直接用，超過就得談授權或回到 ElevenLabs 的 Instant／Professional Voice Clone。

**即時語音對話**：已有文字 agent、想加語音介面，GPT-Live-1 讓後端保持不變；要單一模型、最低單價，Gemini 3.8 Live，但先用自己的對話長度估一次重算 context 後的帳單；聲音就是產品，選 ElevenLabs 的 v4 Turbo＋ElevenAgents。全自架的 cascade（Nemotron 或 Voxtral＋開放 LLM＋Kokoro）最便宜，延遲工程要自己扛。

**音樂**：要最好的成品，Suno v6；要用 API 串進產品，Eleven Music。兩者都要先確認生成內容的商用條款。

## 限制與取捨

- **榜單偏英文。** AA-WER 是英文為主的三個資料集，TTS 榜比的是各家內建聲音；中文轉錄、聲音複製品質、口音一致性都不在榜上。
- **自報數字不能混比。** Scribe v3 的「少 27% 錯誤」、Eleven v4 的「75% 盲測偏好」都是廠商自測，條件與 AA 不同。
- **開放權重的新前段很大。** SOV-Transcribe-1、Nemotron 3.5 Transcribe、Fish Audio Drama 3 都是 26B 到 35B 等級，「可以自架」不等於「部署便宜」。
- **授權與維護狀態會變。** Chatterbox 一年內從熱門變存檔，Fish Speech 從研究授權又換成 Community License；選開放權重時，授權檔與 repo 的維護狀態都要在上線前再看一次。
- **即時語音的帳單結構不同。** 按分鐘、按 token、每回合重算 context 三種計價無法直接用單價比較，要用自己的典型通話長度算。

---

## 更新紀錄

- 2026-11-23：全文換成 2026-11 資料並重組。ASR 改用 AA-WER v2.2 榜（原本引用 v2.0），加入 Scribe v3、SOV-Transcribe-1、Nemotron 3.5 Transcribe 與開放權重轉錄改成「語音編碼器＋MoE 語言模型」一節；TTS 換成 Eleven v4／v4 Turbo 與 2026-11 的 Provider Voice 榜，開放權重改寫為 Fish Audio Drama 3、Kokoro 與已停止維護的 Chatterbox；即時語音改寫為 GPT-Live-1、gpt-realtime-2.1、Gemini 3.8 Live 與 Eleven Realtime 三種架構；新增音樂生成一節（Suno v6）與演化時間線，Whisper 各版本與 ElevenLabs v3 時期的細節降為時間線，連到當時的每日模型卡。修正舊稿錯誤：ElevenLabs 定價（v3 為每千字元 $0.08、Flash $0.04，不是 $0.10／$0.05）、Fish Speech 已改為 Community License（小公司可商用，不是全面禁商用）、拿掉與 series 順序不符的「第十四篇」，以及沒有計算依據的 Realtime 每分鐘估算。
- 2026-10-11：統一系列名稱與文末順序，保留跨家族比較層級、既有來源與日期；本次未重新查證事實。

## 參考資料

- [Speech to Text Leaderboard（AA-WER v2.2）— Artificial Analysis](https://artificialanalysis.ai/speech-to-text) — 轉錄錯字率、速度與價格
- [Text to Speech Leaderboard — Artificial Analysis](https://artificialanalysis.ai/text-to-speech/leaderboard) — TTS Provider Voice Elo 與價格
- [Speech to Speech — Artificial Analysis](https://artificialanalysis.ai/speech-to-speech) — 即時語音模型的推理與對話動態評測
- [AA-Music-Instrumental v1.1 — Artificial Analysis](https://artificialanalysis.ai/music/leaderboard/instrumental) — 純音樂生成 Elo
- [SOV-Transcribe-1 — Hugging Face](https://huggingface.co/salesforce-sovereign-intelligence/SOV-Transcribe-1) — 架構、參數、語言與 Apache 2.0 授權
- [NVIDIA Nemotron 3.5 Transcribe — Hugging Face](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Transcribe-30B-A4B) — 架構、語言、部署需求與 OpenMDW-1.1 授權
- [Voxtral-Small-24B-2507 — Hugging Face](https://huggingface.co/mistralai/Voxtral-Small-24B-2507) — Apache 2.0 權重
- [openai/whisper — GitHub](https://github.com/openai/whisper) — 各尺寸參數量與 release 紀錄
- [Robust Speech Recognition via Large-Scale Weak Supervision（arXiv:2212.04356）](https://arxiv.org/abs/2212.04356) — Whisper 原始論文
- [large-v3-turbo model release — openai/whisper Discussion #2363](https://github.com/openai/whisper/discussions/2363) — decoder 32→4 層
- [Introducing next-generation audio models in the API — OpenAI](https://openai.com/index/introducing-our-next-generation-audio-models/) — gpt-4o-transcribe 發佈
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing) — 轉錄、Realtime 與 GPT-Live 定價
- [Build more natural voice experiences with GPT-Live-1 in the API — OpenAI](https://openai.com/index/introducing-gpt-live-1-in-the-api/) — GPT-Live-1 發佈與委派架構
- [Voice agents — OpenAI Docs](https://developers.openai.com/api/docs/guides/voice-agents) — GPT-Live、Realtime 與 chained 三種架構
- [Build real-time voice applications with Gemini 3.8 Live and 3.5 Transcribe — Google](https://blog.google/innovation-and-ai/technology/developers-tools/build-real-time-voice-applications-gemini-audio/) — Gemini 3.8 Live 發佈與每分鐘價格
- [Agent Platform Pricing — Google Cloud](https://cloud.google.com/model-garden/pricing) — Live API 每回合重算 context 的計費規則
- [Introducing Eleven v4 — ElevenLabs](https://elevenlabs.io/blog/eleven-v4) — v4／v4 Turbo 發佈、延遲與語言數
- [Eleven v4 — ElevenLabs Docs](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4) — model ID 與跨語言口音行為
- [ElevenLabs API Pricing](https://elevenlabs.io/pricing/api) — TTS、Scribe、Realtime 與 Music 現行定價
- [Introducing Scribe v3 and v3 Live — ElevenLabs](https://elevenlabs.io/blog/scribe-v3) — Scribe v3 發佈與自測錯誤率
- [ElevenLabs valuation increases to $22 billion — ElevenLabs](https://elevenlabs.io/blog/tender-22bn) — 2026-09 員工股份收購與營收結構
- [ElevenLabs raises $500M Series D at $11B valuation](https://elevenlabs.io/blog/series-d) — 2026-02 融資公告
- [fishaudio/drama-3 — Hugging Face](https://huggingface.co/fishaudio/drama-3) — 模型卡與 Fish Audio Community License
- [hexgrad/Kokoro-82M — Hugging Face](https://huggingface.co/hexgrad/Kokoro-82M) — 模型卡與 Apache 2.0
- [resemble-ai/chatterbox — GitHub](https://github.com/resemble-ai/chatterbox) — 停止維護公告與 MIT 存檔
- [Chatterbox Multilingual v3 — Resemble AI](https://www.resemble.ai/resources/chatterbox-multilingual-v3-tts-with-embedded-watermarking-for-25-languages) — 最後一版與預設浮水印
- [idiap/coqui-ai-TTS — GitHub](https://github.com/idiap/coqui-ai-TTS) — XTTS 社群維護 fork
- [Introducing v6 — Suno](https://suno.com/blog/introducing-v6) — Suno v6 模型家族與合作夥伴
- [Suno replaces its AI models with a new one trained on licensed music — TechCrunch](https://techcrunch.com/2026/09/09/suno-replaces-its-ai-models-with-a-new-one-trained-on-licensed-music-as-copyright-suits-pile-up/) — 授權資料與仍在進行的訴訟
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
