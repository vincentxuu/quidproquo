---
title: "Deepgram Voice Agent API：從串流 STT、Turn Detection 到 TTS"
date: 2026-08-22
category: ai
type: deep-dive
tags: [deepgram, voice-agent, speech-to-text, text-to-speech, conversational-ai, telephony]
lang: zh-TW
tldr: "Deepgram 把 streaming STT、LLM orchestration、turn detection、barge-in 與 streaming TTS 放進單一 WebSocket，也保留分開採用語音模型或 BYO LLM／TTS 的路徑。"
description: "拆解 Deepgram Voice Agent API 的 streaming STT、turn detection、barge-in、TTS、電話整合、資料政策與競品選型。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-deepgram-voice-agents-en)

[Deepgram](https://developers.deepgram.com/reference/deepgram-api-overview) 原本以語音辨識基建起家，現在的產品已涵蓋 streaming STT、TTS、Audio Intelligence，以及把完整對話迴圈包起來的 Voice Agent API。它的主脊仍是 cascaded architecture：聲音先轉成文字，LLM 產生回覆，再合成聲音；差別是 STT、orchestration 與 TTS 可以在同一個雙向 WebSocket runtime 裡協調。

這個定位介於「只賣語音模型」和「完整 voice-agent 平台」之間。你可以單獨用 Flux／Nova 做 STT、用 Aura 做 TTS，自己接 Pipecat 或 LiveKit；也可以交給 Voice Agent API 處理 turn-taking、barge-in、LLM routing 與 tool events。Deepgram 亦支援 BYO LLM、BYO TTS、Dedicated 與 self-hosted，並非只能接受完全封閉的 bundled stack。

公司在 2026 年 1 月宣布 [1.3 億美元 Series C、估值 13 億美元](https://deepgram.com/learn/press-release-deepgram-raises-series-c)，由 AVP 領投。

同一份公司新聞稿稱超過 1,300 個組織以 Deepgram API 建置 Voice AI；這些屬公司揭露的融資與採用數字，不是獨立稽核。

## 主脊：Streaming STT → Orchestration → Streaming TTS

一通 Deepgram Voice Agent 對話可以簡化成：

```text
caller / microphone
        │ audio frames
        ▼
Flux or Nova STT ──> turn detection ──> LLM + tools
        ▲                                  │ text stream
        │ barge-in                         ▼
        └──────────── Aura TTS <───┘
```

STT 不是等整段錄音結束才回傳，而是持續產生 partial transcript 與語音事件。Flux 是為 conversational audio 設計的 STT，將 end-of-turn 判斷整合進模型；Nova 則是通用、可即時串流的辨識系列。Orchestration 看到可能的 utterance boundary，就能把增量 transcript 交給 LLM，不必等固定長度的 silence timeout。

LLM 回傳文字時，TTS 同樣串流，不必等完整句子生成完。Voice Agent runtime 同時追蹤使用者是否重新開始說話；一旦收到 barge-in，就停止 agent turn、發出 `UserStartedSpeaking`，由電話 bridge 清掉電信商仍在播放佇列中的音訊。這裡真正決定體感的不是單一模型 benchmark，而是 end-of-turn 太早、太晚與 interruption cleanup 是否協調一致。

## Endpointing、Turn Detection 與 Barge-in 不同

這三個詞常被混在一起：

- endpointing 判斷一段語音何時暫時停止，傳統做法常依 silence duration。
- turn detection 判斷說話者是否真的把意思說完，要看 cadence、語意與音訊脈絡；停頓不一定代表交棒。
- barge-in 是 Agent 已經說話時，使用者插話後停止合成與播放的完整流程。

Deepgram 的 Voice Agent runtime 管前兩項，也在 Deepgram 端停止被打斷的回覆。不過 telephony buffer 不在 Deepgram 控制內。官方 [Twilio 整合指南](https://developers.deepgram.com/docs/build-voice-agent-with-twilio-deepgram-openai)仍要求你的 bridge 在 `UserStartedSpeaking` 時向 Twilio 發 `clear`；否則模型停了，電話另一頭還會多播一截舊音訊。

正式上線要用真實通話測試短回答、猶豫、背景人聲、數字與姓名。衡量 false cutoff、dead air、成功插話到停止播放的時間，以及插話後 transcript 是否遺失，不能只看 STT word error rate。

## 最小 Voice Agent 連線

Python SDK 以一條 WebSocket 收送設定、音訊 bytes 與 typed events。最小骨架如下；實際程式還要持續讀取 output audio 與 events：

```python
import asyncio
from deepgram import AsyncDeepgramClient

async def run(audio_chunks):
    client = AsyncDeepgramClient()

    async with client.agent.v1.connect() as agent:
        await agent.send_settings({
            "type": "Settings",
            "audio": {
                "input": {"encoding": "linear16", "sample_rate": 16000},
                "output": {"encoding": "linear16", "sample_rate": 16000},
            },
            "agent": {
                "language": "en",
                "listen": {"provider": {"type": "deepgram", "model": "flux-general-en"}},
                "think": {"provider": {"type": "open_ai", "model": "gpt-4o-mini"}},
                "speak": {"provider": {"type": "deepgram", "model": "aura-2-thalia-en"}},
            },
        })

        async for chunk in audio_chunks:
            await agent.send_media(chunk)

asyncio.run(run(...))
```

電話不是直接把 SIP 號碼丟給這段程式。以 Twilio 為例，`<Connect><Stream>` 建立雙向 media stream，你的 server 每通電話維持一個 Twilio WebSocket 與一個 Deepgram WebSocket，做 μ-law／sample rate 對齊、audio relay、call state 與 barge-in clear。Amazon Connect、SIP 或其他 carrier 的責任邊界類似：Deepgram 處理 voice loop，telephony provider 處理號碼、路由與 PSTN。

## Tool Calling 與狀態放哪裡

Voice Agent API 可在 session 中送 structured function request，並支援即時更新 prompt、注入 message 或換 voice。這不代表 tool 應直接在 WebSocket handler 裡無限制執行。每通 call 應有一個可追蹤的 state object，保存 conversation ID、caller authorization、tool results、handoff 狀態與錄音同意。

Function arguments 仍是不受信任的模型輸出。查帳、改預約或付款前要做 schema validation、權限檢查、idempotency 與明確 confirmation。Barge-in 也可能發生在 tool 執行期間；取消語音不等於取消後端 side effect，因此 tool workflow 必須自己定義 cancel boundary。

## 資料保留、模型訓練與安全界線

Deepgram 的資料政策不能只用「不訓練」三個字帶過。[Model Improvement Partnership Program](https://developers.deepgram.com/docs/the-deepgram-model-improvement-partnership-program) 是可選的模型改進方案；文件表示只有契約納入該方案的資料才會用於之後的模型訓練。每次 request 可加 `mip_opt_out=true`，opt-out 資料只保留完成處理所需的時間。

但 MIP opt-out 不等於所有 metadata、帳務 log 或外部 LLM 都零保留。Voice Agent 若使用 managed LLM／TTS，還要檢查該 provider、Deepgram 合約、區域與 retention 設定的完整資料流。EU 與 AU endpoint 支援 Voice Agent；更嚴格的工作可用 Dedicated 或 [self-hosted](https://developers.deepgram.com/docs/self-hosted-introduction)，典型自架部署不把 audio／transcript 送回 Deepgram，只回報 usage metadata。

API key 不應放前端。需要瀏覽器或 mobile client 直接連線時，用短效 token，並把 key scope、expiration、rate limit 與 project 分開。Deepgram 文件列出 SOC 2 Type II、HIPAA、PCI、GDPR 等框架，但是否涵蓋你的具體產品、region、subprocessor 與 BAA，仍以合約及稽核文件為準。

## 跟 LiveKit、Vapi、Cartesia、ElevenLabs 怎麼選

| 產品 | 重心 | 優先考慮的情境 |
|---|---|---|
| [Deepgram](https://developers.deepgram.com/reference/deepgram-api-overview) | 自有 streaming STT／TTS 加 bundled orchestration，也能拆開採用 | 語音辨識、turn timing 與部署控制是核心風險 |
| [LiveKit Agents](https://docs.livekit.io/agents/) | WebRTC media infrastructure 與開放式 agent framework，可組不同 STT／LLM／TTS | browser／app 即時媒體、room topology、跨供應商組裝 |
| [Vapi](https://docs.vapi.ai/quickstart/introduction) | phone-first orchestration、號碼與 provider composition | 想快速建立電話 Agent，少維護 telephony bridge |
| [Cartesia](https://docs.cartesia.ai/get-started/overview) | 低延遲、可控的 speech generation 與 voice models | 自己掌握 orchestration，TTS 品質與表達是主要差異化 |
| [ElevenAgents](https://elevenlabs.io/docs/eleven-agents/overview) | ElevenLabs voices 加完整 conversational-agent platform | voice design、品牌聲音與一體式建置體驗優先 |

這不是單純功能打勾。LiveKit 比較像 media plane 與 framework；Deepgram bundled API 把更多 timing decision 收進供應商 runtime。Vapi 往電話產品與 orchestration 靠近。Cartesia 主要是語音模型元件。ElevenLabs 從 voice catalog 往完整 Agent 平台擴張。團隊已經有成熟 WebRTC 或 telephony control plane 時，組裝式 stack 可能更好除錯；缺少 voice runtime 經驗時，bundled API 能少掉最難的 turn coordination。

## Vendor Benchmark 怎麼讀

Deepgram 的 [Voice Agent Quality Index 自測](https://deepgram.com/learn/voice-agent-api-generally-available)使用相同 prompt、121 份 audio、50 ms audio chunks 與相近 LLM，比較 latency、interruption 與 response coverage。報告稱 Deepgram composite score 為 71.5，高於 OpenAI 與 ElevenLabs。

這是 Deepgram 設計並執行的 vendor benchmark，指標權重、default config 與測試語料都可能有利於其 runtime。它的價值是提醒團隊不要只看 latency；不能直接外推到你的語言、噪音、電信 codec 與 caller behavior。採購前應重跑相同概念的私有 call set，並逐通聽 false cutoff 與 barge-in failure。

## 適合、不適合與整體取捨

Deepgram 適合需要 streaming transcription、可追蹤 text boundary、電話中斷處理，以及 cloud／Dedicated／self-hosted 選項的 voice agent。尤其當 STT accuracy 與 turn timing 比 voice persona 更重要，整合式 runtime 能減少跨供應商 latency 與狀態不一致。

它不一定適合需要完全自訂 media graph、只想買某個明星 voice、或想把每個 component 隨時路由到不同供應商的團隊。Voice Agent API 雖支援 BYO，但 orchestration semantic、event model 與 billing 仍形成平台依賴。

最實際的評估方式是拿 100 通真實情境錄音，先單測 STT／endpoint，再跑 bundled Voice Agent。記錄 transcript accuracy、turn false-positive、barge-in stop time、end-to-end p95、tool success 與每分鐘完整成本。語音 Agent 的品質是一整條 streaming loop 的結果；只選「最快的 TTS」或「最準的 STT」，都還沒完成選型。

## 參考資料

- [Deepgram API Overview](https://developers.deepgram.com/reference/deepgram-api-overview)
- [Deepgram Voice Agent API 架構與 GA 說明](https://deepgram.com/learn/voice-agent-api-generally-available)
- [Deepgram Twilio Voice Agent Guide](https://developers.deepgram.com/docs/build-voice-agent-with-twilio-deepgram-openai)
- [Deepgram Model Improvement Partnership Program](https://developers.deepgram.com/docs/the-deepgram-model-improvement-partnership-program)
- [Deepgram Self-Hosted Introduction](https://developers.deepgram.com/docs/self-hosted-introduction)
- [Deepgram Data Privacy Compliance](https://developers.deepgram.com/trust-security/data-privacy-compliance)
- [Deepgram Series C 公告](https://deepgram.com/learn/press-release-deepgram-raises-series-c)
- [LiveKit Agents](https://docs.livekit.io/agents/)
- [Vapi Documentation](https://docs.vapi.ai/quickstart/introduction)
- [Cartesia Documentation](https://docs.cartesia.ai/get-started/overview)
- [ElevenAgents Overview](https://elevenlabs.io/docs/eleven-agents/overview)
