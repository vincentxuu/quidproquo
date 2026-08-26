---
title: "語音與音訊模型家族——Whisper 從開源改寫 ASR 到 ElevenLabs 收編語音 API，一條 ASR 一條 TTS 的四年演化"
date: 2026-08-26
category: tech
tags: [whisper, elevenlabs, text-to-speech, speech-to-text, kokoro, voice-cloning, model-family-speech]
lang: zh-TW
type: deep-dive
tldr: "語音模型分兩條線：ASR 線由 Whisper 主導——2022/09 以 MIT 開源 1.55B 模型把轉錄成本打到趨近於零，v2→v3→turbo（decoder 32 層砍到 4 層）之後 OpenAI 轉閉源推 gpt-4o-transcribe；TTS 線則是 ElevenLabs 用品質與生態從新創做到 $11B 估值、$500M ARR，開源陣營靠 Kokoro（82M、Apache 2.0）與 Chatterbox 守住自架陣地。即時對話已被 speech-to-speech 的 Realtime API 重寫遊戲規則。"
description: "AI 語音模型家族深拆：Whisper v1/v2/v3/turbo 演化與 WER 表現、OpenAI 轉閉源後的 gpt-4o-transcribe、ElevenLabs v3/Flash/Scribe 模型線與定價融資、Kokoro/XTTS/Chatterbox 開源 TTS 格局、Realtime API 與 Gemini Live 即時對話趨勢。"
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
    definition: "把音訊轉成文字的技術，即語音轉錄。Whisper、Scribe、gpt-4o-transcribe 都屬這條線"
  - term: "TTS"
    aliases: ["Text-to-Speech", "語音合成"]
    definition: "把文字轉成語音的技術。評估常用主觀 MOS 分（人聲上限約 4.5+），ElevenLabs v3、Kokoro 都屬這條線"
  - term: "零樣本語音複製"
    aliases: ["zero-shot voice cloning"]
    definition: "只給幾秒鐘參考音訊就能合成該說話者的聲音，不需重新訓練模型。XTTS v2 約 6 秒、Chatterbox 約 5 秒即可克隆"
---

2022 年 9 月，OpenAI 把 [Whisper](https://github.com/openai/whisper) 以 MIT 授權丟上 GitHub——一個用 680K 小時網路音訊弱監督訓練出來的 encoder-decoder 模型，最大版 1.55B 參數。當時商業 ASR 一小時音訊要價不斐，Whisper 直接把「自己跑一個接近 SOTA 的轉錄模型」變成筆電能做的事，整個語音新創與開源社群的遊戲規則被重寫。同一時間軸上另一條線，ElevenLabs 在 2022 年成立，四年後以 [Series D $500M、估值 $11B](https://elevenlabs.io/blog/series-d)、ARR 破 $500M 成為語音 API 的事實霸主。這是 AI 模型家族系列的第十四篇，把語音拆成 ASR 與 TTS 兩條子線一次看懂。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列第十四篇家族深度介紹。

## ASR 線：Whisper 家族的演化與轉折

| 版本 | 發佈 | 參數量 | 關鍵事實 |
|---|---|---|---|
| Whisper 初代 | 2022-09 | 39M–1550M | 六種尺寸＋四個英文專版；[論文](https://arxiv.org/abs/2212.04356)、[GitHub](https://github.com/openai/whisper)，MIT 授權 |
| large-v2 | 2022-12 | 1550M | 同架構再訓練，錯誤率下降約 10–20%（[官方討論串](https://github.com/openai/whisper/discussions/661)） |
| large-v3 | 2023-11 | 1550M | 換 Mel spectrogram（80→128 bins）、新 tokenizer，多語言 WER 全面改善 |
| large-v3-turbo | 2024-09-30 | 約 800M | [decoder 從 32 層砍到 4 層](https://github.com/openai/whisper/discussions/2363)，速度約 8 倍、品質近似 large-v2，成為 CLI 預設；泰語、粵語退化較明顯 |
| （開源線停滯） | 2024 至今 | — | turbo 之後無新的開源 Whisper 版本 |
| gpt-4o-transcribe / mini | 2025-03-20 | 未公開 | [閉源 API](https://openai.com/index/introducing-our-next-generation-audio-models/)，官方稱 FLEURS 英文 WER 2.46%、幻覺比 Whisper 少；明確不開源 |

兩個關鍵轉折值得記住：

**第一，turbo 是開源線的最後一章。** 它的思路來自 Distil-Whisper——decoder 變小對轉錄速度的影響遠大於品質損失。turbo 用 large-v3 剪枝後再微調，VRAM 需求大幅下降（社群實測約 10GB → 6GB），速度快 8 倍，代價是不支援翻譯任務、部分語言（如泰語）退化。此後 OpenAI 再也沒有釋出新權重：2025 年 3 月的 [gpt-4o-transcribe 明確閉源](https://techcrunch.com/2025/03/20/openai-upgrades-its-transcription-and-voice-generating-ai-models/)，理由是「比 Whisper 大得多、不適合本地跑」。開源 ASR 的前沿就此交給了社群——NVIDIA Parakeet、Mistral Voxtral 等接手（Artificial Analysis 的 [AA-WER v2.0](https://artificialanalysis.ai/articles/aa-wer-v2) 榜單可見 Parakeet 已擠進前列）。

**第二，ASR 的計費單位已經捲到每分鐘半美分以下。** 目前 OpenAI 定價頁（[pricing](https://developers.openai.com/api/docs/pricing)）：gpt-transcribe $0.0045/分鐘、gpt-4o-transcribe $0.006/分鐘、mini 版 $0.003/分鐘；ElevenLabs 批次 Scribe v2 約 $0.22/小時。轉錄本身已是 commodity，戰場移向 diarization（說話者分離）、時間戳結構化輸出與即時串流。

## TTS 線：ElevenLabs 的收編與開源陣營的反擊

| 里程碑 | 時間 | 關鍵事實 |
|---|---|---|
| ElevenLabs 成立 | 2022 | 兩位波蘭創辦人，從配音工具起家 |
| Multilingual v2 | 2023 | 29 語言高品質合成，長期是長文旁白主力 |
| Scribe（跨入 ASR） | 2025-02-26 | [99 語言、diarization、word-level timestamps](https://elevenlabs.io/blog/meet-scribe)，獨立測得 WER 7.7%（v1，Artificial Analysis） |
| Eleven v3 alpha | 2025 年中 | audio tags（[laughs] 等）、多說話人對白 |
| Flash v2.5 | 2024-12 | 約 75ms 延遲、32 語言，即時 Agent 迴圈的主力；Turbo 系列已標記棄用 |
| Eleven v3 GA | 2026-02-02 | 70+ 語言正式版，但**非即時**、單次 5,000 字元上限 |
| Series D | 2026-02-04 | [$500M @ $11B 估值](https://elevenlabs.io/blog/series-d)，Sequoia 領投；累計融資 $781M |
| ARR 破 $500M | 2026-05 | [NVentures（NVIDIA）、BlackRock 加入延伸輪](https://siliconangle.com/2026/05/05/elevenlabs-adds-high-profile-investors-annualized-revenue-tops-500m/)；5/7 全線降價（TTS −55%） |

ElevenLabs 的打法不是單點最強，而是全家桶：v3 做表現力上限（audio tags 可以直接在腳本裡寫舞台指示）、Multilingual v2 做長文、Flash v2.5 做即時（40,000 字元單次上限，是 v3 的八倍）、Scribe 反攻 ASR、再加 Agents 平台、音效與音樂。值得注意的是它的品質並非無敵——[Artificial Analysis 語音競技場](https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice)上 Eleven v3 已掉出前十（Provider Voice 板目前約第 14），卻是最貴的模型之一（每百萬字元 $100）：你付的是工作流整合費，不是不可挑戰的品質差距。

開源陣營這邊，格局在 2025 年被一個 82M 的小模型改寫：

| 模型 | 參數量 | 授權 | 克隆 | 定位 |
|---|---|---|---|---|
| [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) | 82M | Apache 2.0 | ✗ | 54 音色／8 語言，量化後約 86MB、瀏覽器可直接跑，一般 CPU 快過即時（樹莓派等低功耗板子低於即時）；訓練成本約 $1,000 |
| XTTS v2（Coqui） | 約 467M | CPML（非商用） | ✓（~6 秒） | 零樣本克隆曾是最好的，但 Coqui 2024/01 倒閉、授權頁已 404，商用無解；社群維護 [idiap fork](https://github.com/idiap/coqui-ai-TTS) |
| Chatterbox（Resemble AI） | 0.5B | MIT | ✓（~5 秒） | 商用克隆首選，附情緒誇張度旋鈕 |
| Fish Speech | 約 500M | Research License（禁商用） | ✓（10–30 秒） | 多語言克隆；新版已改掛自家研究授權，僅限非商用 |
| Meta SeamlessM4T-v2 | — | CC-BY-NC 4.0 | ✗ | 語音翻譯基礎模型，FLEURS WER 18.5%/77 語言；Voicebox 從未公開權重，純研究展示 |

Kokoro 的意義不在榜單而在證明：「幾百小時乾淨授權資料 + 82M 參數 + 約一千美元 GPU 時間」就夠做出可商用的旁白級 TTS。它不能克隆聲音，但把「離線唸稿」這個最大宗需求的成本打到零。要克隆且要商用，2026 年的務實答案只剩 Chatterbox——Fish Speech 曾是熱門選項，但已改掛自家的 Research License 禁止商用。XTTS 的技術遺產還活著，法律地位已經死了。

## 架構要點：三件事決定這個領域

**Encoder-decoder 與弱監督。** Whisper 是標準 Transformer encoder-decoder，吃 30 秒 log-Mel spectrogram、自迴歸吐 token。它的殺手锏不是架構而是資料：680K 小時的多語言弱標註音訊，讓它在雜訊、口音、domain 切換上的穩健度碾壓同期的監督式模型，且同一組權重同時做辨識、翻譯、語言辨識。turbo 進一步證明 decoder 大部分容量是冗餘的。

**零樣本克隆走「音訊 prompt」路線。** XTTS、Chatterbox、Fish Speech 共享同一套邏輯：先用 speaker encoder 把幾秒參考音訊壓成 embedding，生成時以此為條件。新一代模型改用 LLM backbone（Chatterbox 用 Llama、Orpheus 用 Llama 3）直接對離散音訊 token 自迴歸，好處是天然繼承 LLM 生態的推理基建。ElevenLabs 的 Professional Cloning 則需要數十分鐘素材做後台訓練，品質上限更高。

**即時對話正在從 cascade 走向 speech-to-speech。** 舊架構是 ASR→LLM→TTS 三段串接，延遲和情緒損耗都卡在中間轉換。[OpenAI Realtime API](https://developers.openai.com/api/docs/models/gpt-realtime) 2025/08 GA，2026/05 的 GPT-Realtime-2 支援可調推理檔位，原生 SIP 直通電話系統，單 session 上限 60 分鐘，音訊計價 $32/$64 每 1M tokens（換算約 $0.23/分鐘，估算值、隨用量浮動）。Gemini Live 走便宜路線（Gemini 2.5 native audio $3/$12，換算約 $0.036/分鐘，同為估算值），但每回合重計整個 context、session 約 15 分鐘就要壓縮續接，且 SIP 要靠 Twilio/LiveKit 橋接。ElevenLabs 自己的答案是 Flash v2.5（75ms）＋Agents 平台，留在 cascade 陣營但把每段都做到極致。三種路線的取捨：電話客服要 OpenAI 的 SIP 與長 session，消費級大流量選 Gemini 的單價，要聲音可控性（特定音色、audio tags）才回到 ElevenLabs。

## 授權與定價對照

| 供應 | 代表 | 授權 | 計價（約） | 適合 |
|---|---|---|---|---|
| OpenAI Whisper | large-v3 / turbo | **MIT，權重可自架** | 自付 GPU | 本地轉錄、隱私場景 |
| OpenAI API | gpt-4o-transcribe | 閉源 | $0.006/分鐘 | 高準確批次轉錄 |
| OpenAI Realtime | GPT-Realtime-2 | 閉源 | 音訊 $32/$64 每 1M tokens | 電話 Agent |
| ElevenLabs TTS | v3 / Flash v2.5 | 閉源 | $0.10 / $0.05 每千字元 | 配音、Agent 語音 |
| ElevenLabs Scribe | Scribe v2 | 閉源 | 批次 $0.22/小時 | 高準確結構化轉錄 |
| Kokoro-82M | v1.0 | **Apache 2.0** | 免費（CPU 可跑） | 離線旁白、邊緣裝置 |
| Chatterbox | V3 | **MIT** | 免費（建議 GPU） | 商用聲音克隆 |
| Meta SeamlessM4T-v2 | — | CC-BY-NC（禁商用） | 免費（研究） | 語音翻譯研究 |

注意兩個陷阱：XTTS v2 的 CPML 在公司倒閉後沒有任何取得商用授權的管道；F5-TTS、MaskGCT 等熱門模型的程式碼 MIT 但**權重**掛 CC-BY-NC；Fish Speech 舊版曾以寬鬆授權著稱，新版改成了自家的 Research License——判斷能不能商用永遠看權重授權的最新版，不是 repo license 或舊印象。

## 選型建議：Agent 開發者的三種場景

**批次轉錄**：有隱私或成本考量 → Whisper large-v3-turbo 自架（MIT、單張消費級 GPU 可跑）；要最高準確與 diarization → ElevenLabs Scribe v2 或 gpt-4o-transcribe，兩者每小時成本都在幾毛美元等級，差異在結構化輸出的完整度。中文場景記得 turbo 在部分語言有已知退化，重要案子先用自己的音訊測 WER。

**配音與內容製作**：品質優先 → ElevenLabs v3（audio tags 是目前唯一能「導戲」的介面）；大量離線旁白 → Kokoro 自架，零邊際成本；需要指定音色且要商用 → Chatterbox 自架，或 ElevenLabs Instant/Professional Cloning 走 API。

**即時語音對話**：電話進出（PSTN）→ OpenAI Realtime（原生 SIP、60 分鐘 session）；App/瀏覽器內、量大 → Gemini Live（單價低六倍以上，但要自己處理 session 續接）；聲音就是產品（IP 角色、品牌音色）→ ElevenLabs Flash v2.5 + Agents。cascade（Whisper + LLM + Kokoro）仍是全自架的最便宜路徑，只是你要自己扛延遲工程。

一句話總結這個家族四年：Whisper 把「聽」變成免費基建，ElevenLabs 把「說」變成一門 $500M ARR 的生意，而真正的下一戰在 speech-to-speech——誰能把延遲壓進人類對話的自然節奏，誰就收編下一代的互動介面。

---

## 參考資料

- [openai/whisper — GitHub](https://github.com/openai/whisper) — 各尺寸參數量、VRAM、速度對照表
- [Robust Speech Recognition via Large-Scale Weak Supervision（arXiv:2212.04356）](https://arxiv.org/abs/2212.04356) — Whisper 原始論文
- [large-v3-turbo model release — openai/whisper Discussion #2363](https://github.com/openai/whisper/discussions/2363) — decoder 32→4 層、turbo 技術細節
- [Introducing next-generation audio models in the API — OpenAI](https://openai.com/index/introducing-our-next-generation-audio-models/) — gpt-4o-transcribe 發佈與 FLEURS 數字
- [OpenAI upgrades its transcription and voice-generating AI models — TechCrunch](https://techcrunch.com/2025/03/20/openai-upgrades-its-transcription-and-voice-generating-ai-models/) — 新轉錄模型確定不開源的官方說法
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing) — 轉錄與 Realtime 全模型現行定價
- [GPT-Realtime Model — OpenAI Docs](https://developers.openai.com/api/docs/models/gpt-realtime) — Realtime API 架構與計價
- [Meet Scribe — ElevenLabs Blog](https://elevenlabs.io/blog/meet-scribe) — 99 語言 ASR、diarization 發佈文
- [What models do you offer — ElevenLabs Help Center](https://help.elevenlabs.io/hc/en-us/articles/17883183930129-What-models-do-you-offer-and-what-is-the-difference-between-them) — v3/Flash/Turbo 官方模型說明
- [ElevenLabs raises $500M Series D at $11B valuation](https://elevenlabs.io/blog/series-d) — 2026/02 融資公告
- [ElevenLabs raises $500M from Sequoia — TechCrunch](https://techcrunch.com/2026/02/04/elevenlabs-raises-500m-from-sequioia-at-a-11-billion-valuation/) — 融資第三方報導
- [ElevenLabs annualized revenue tops $500M — SiliconANGLE](https://siliconangle.com/2026/05/05/elevenlabs-adds-high-profile-investors-annualized-revenue-tops-500m/) — NVentures/BlackRock 延伸輪與 ARR
- [hexgrad/Kokoro-82M — Hugging Face](https://huggingface.co/hexgrad/Kokoro-82M) — 模型卡、Apache 2.0、訓練成本
- [fishaudio/fish-speech — GitHub](https://github.com/fishaudio/fish-speech) — 新版 Fish Audio Research License 原文
- [Speech Arena, Provider Voice — Artificial Analysis](https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice) — TTS 競技場即時排名
- [idiap/coqui-ai-TTS — GitHub](https://github.com/idiap/coqui-ai-TTS) — XTTS 社群維護 fork
- [AA-WER v2.0 — Artificial Analysis](https://artificialanalysis.ai/articles/aa-wer-v2) — 2026 STT 獨立榜單（Scribe v2 2.3%）
- [SeamlessM4T — Meta AI Blog](https://ai.meta.com/blog/seamless-m4t/) — 語音翻譯基礎模型與授權
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
