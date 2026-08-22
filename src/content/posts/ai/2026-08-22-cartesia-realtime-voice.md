---
title: "Cartesia 深入介紹：從 Sonic 串流 TTS 到即時語音 Agent Pipeline"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cartesia, voice-ai, text-to-speech, ai-agent, websocket, voice-cloning]
lang: zh-TW
tldr: "Cartesia 的核心是 Sonic 即時 TTS、Ink STT 與串流推論；雖然 2026 年已有 Line voice-agent 平台，選型時仍要分清模型層與電話 orchestration，並把 voice cloning 同意、資料保存與 fallback 自己設計好。"
description: "拆解 Cartesia Sonic 的模型、WebSocket 串流、聲音複製與在地化能力，以及它在 LiveKit、Vapi、Deepgram、ElevenLabs 語音 agent pipeline 中的位置。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cartesia-realtime-voice-en)

[Cartesia](https://www.cartesia.ai/) 最精確的定位，是為即時互動提供語音模型與推論平台：Sonic 做 text-to-speech（TTS），Ink 做 speech-to-text（STT），API 把音訊以串流方式送進 agent pipeline。截至 2026 年 8 月，Cartesia 也提供名為 Line 的 voice-agent 產品；但採用 Sonic API，不等於電話號碼、通話狀態、轉接、LLM 與工具 orchestration 都會自動完成。

這個界線決定怎麼比較產品。若你已用 LiveKit 或 Vapi 管會話，Cartesia 可以只是 TTS provider；若你採 Line，才是把 Cartesia 的 agent control plane 一起納入。本文主脊放在 model → streaming inference → voice cloning/localization → agent pipeline，因為這是 Cartesia 最具辨識度、也最容易被「voice agent 平台」四個字混淆的部分。

## Sonic：為串流輸出設計的語音模型

Cartesia 的 Sonic 系列建立在 state space model（SSM）研究路線上，產品重點是低延遲、逐段接受文字並持續產生音訊，而非等整段回答完成才合成。2025 年 Fortune 報導公司完成 [6,400 萬美元 Series A、累計募資 9,100 萬美元](https://fortune.com/2025/03/11/exclusive-cartesia-voice-ai-startup-raises-64-million-series-a/)，並轉述執行長稱 Sonic 延遲由 90ms 降到 45ms、已有超過 10,000 個客戶使用。這些延遲與採用量是公司向媒體提供的數字，不是跨供應商同條件 benchmark。

到 2026 年，主力已是 Sonic-3.5。舊模型、voice embedding input 與部分 endpoint 在 6 月停用，官方[changelog](https://docs.cartesia.ai/changelog/2026)要求新 API 使用 voice ID；production 應 pin dated snapshot，而不是永遠追 `latest`，否則語調或發音可能在沒有程式碼 diff 的情況下改變。

## WebSocket：把 LLM token 變成可播放音訊

官方[WebSocket API](https://docs.cartesia.ai/api-reference/tts/websocket)以 `context_id` multiplex 多次 generation。同一 turn 的文字 chunk 使用同一 context，Sonic 才能延續 prosody；新 turn 應使用新 context。連線最好在第一批文字到達前建立，避免把 handshake 算進首段音訊延遲。

```python
import asyncio, json, os, websockets

async def speak(text, voice_id):
    url = (
        "wss://api.cartesia.ai/tts/websocket"
        "?cartesia_version=2026-03-01&api_key=" + os.environ["CARTESIA_API_KEY"]
    )
    async with websockets.connect(url) as ws:
        await ws.send(json.dumps({
            "model_id": "sonic-3.5",
            "transcript": text,
            "voice": {"mode": "id", "id": voice_id},
            "output_format": {
                "container": "raw",
                "encoding": "pcm_s16le",
                "sample_rate": 24000,
            },
            "context_id": "turn-42",
            "continue": False,
        }))

        async for message in ws:
            event = json.loads(message)
            if event["type"] == "chunk":
                play_base64_audio(event["data"])
            elif event["type"] == "done":
                break

asyncio.run(speak("您好，需要我幫忙查訂單嗎？", os.environ["VOICE_ID"]))
```

實際 agent 還要處理 LLM partial text、標點切句、buffer、backpressure、barge-in 與取消。使用者開始說話時，不能只停播放器；也要取消尚未播放的 TTS context，否則舊回答會在新 turn 中漏出來。

## 聲音控制：先看模型版本再寫產品需求

Sonic 支援 emotion，以及 speed、volume 等 generation guidance，也可透過 SSML 調整。可是官方[控制文件](https://docs.cartesia.ai/build-with-cartesia/capability-guides/volume-speed-emotion)明確標示 Sonic-3.5 暫時停用 speed 與 volume；需要這兩項就 pin Sonic-3 snapshot。它們是自然度導向的 guidance，不是精確 DSP 旋鈕，測試要用真實台詞與語言。

自訂人名、品牌與縮寫應使用 pronunciation dictionary／IPA，而不是在 prompt 裡故意拼錯。語言與聲音也要配對；把英文 voice 直接拿來說中文，不代表自然的中文在地化。官方 2026 changelog 已加入 regional routing 與 pronunciation dictionaries，但「支援語言」仍不等於每個口音、數字與專有名詞都同樣穩定。

## Voice cloning 與 localization：技術容易，權利鏈更難

目前 instant clone API 接受短音訊並回傳 voice ID；官方[Clone Voice API](https://docs.cartesia.ai/api-reference/voices/clone)建議約 5 秒來源音訊。Professional Voice Clone 使用較大量錄音 fine-tune，適合品牌聲音；localization 則讓同一 voice 跨語言使用。品質要分別以 speaker similarity、intelligibility、accent 與真人偏好測試，不能只用「聽起來像」驗收。

聲音是可辨識的個人特徵。Cartesia [Terms](https://www.cartesia.ai/legal/terms)禁止未經本人明確許可上傳他人聲音，並說除非另有約定，input、output 與互動可能用於改善模型，使用者可提出未來訓練 opt-out。企業上線前至少要保存可撤回的書面同意、限制 clone 建立權限、記錄每次生成、提供刪除流程，並在適用情境揭露合成語音。

官方[Zero Data Retention 文件](https://docs.cartesia.ai/enterprise/zero-data-retention)也指出，ZDR 不適用 voice cloning、PVC 與需要保留來源素材的流程。不能因一般 TTS endpoint 開了 ZDR，就推論聲音複製資料也不保存；DPA、區域、retention 與刪除 SLA 要逐項確認。

## 放進完整 agent pipeline

```text
電話 / WebRTC
      ↓
STT（Ink 或其他 provider）
      ↓ partial transcript
Agent / LLM / tools
      ↓ partial text
Cartesia Sonic WebSocket
      ↓ PCM frames
播放 + barge-in + call state
```

Cartesia 決定最後一段「文字如何變聲音」，也可以提供 Ink 或 Line 擴大範圍。完整 production system 仍需 turn detection、echo cancellation、電話供應商、重試、錄音政策、tool timeout 與真人轉接。把 TTS 首包延遲當成 end-to-end latency，會漏掉 STT endpointing、LLM TTFT、網路與 jitter buffer。

## 和相鄰工具怎麼選

| 工具 | 公開重心 | 優先考慮的情境 |
|---|---|---|
| [Cartesia](https://docs.cartesia.ai/) | Sonic TTS、Ink STT、Line agents、低延遲串流 | 想以 Sonic 聲音模型為核心，或需要多種部署形態 |
| [LiveKit Agents](https://docs.livekit.io/agents/) | WebRTC media、turn handling、provider-neutral agent framework | 需要即時媒體層，且想自由替換 STT／LLM／TTS |
| [Vapi](https://docs.vapi.ai/) | 電話、agent orchestration 與 provider 組合 | 想快速完成 phone agent control plane |
| [Deepgram](https://developers.deepgram.com/docs/voice-agent) | streaming STT、TTS 與 Voice Agent API | transcription 是核心，想減少語音 provider 數量 |
| [ElevenLabs](https://elevenlabs.io/docs/overview) | TTS、voice library／cloning、Conversational AI | 聲音目錄、內容製作與 agent 平台都重要 |

不是每個團隊都該選同一層。已有 LiveKit/Vapi 的團隊可只替換 TTS 做盲測；想減少整合面的團隊才比較 Line 與其他 end-to-end agent 平台。至少用同一批台詞，在相同 codec、region、network 與 voice 類型下量首包、完整播放、打斷恢復與真人偏好。

## 整體來說

Cartesia 的核心價值是把可控制、可複製的語音用串流速度送進互動產品。它適合 latency 與聲音體驗都重要，且團隊願意自行設計 agent pipeline 邊界的產品；Line 則提供一條整合更多元件的路。

最容易踩的坑，是把 model latency 當通話 latency、把支援 emotion 當每個模型都有全部旋鈕、把 ZDR 當 clone data 的保證。先用 WebSocket 做一條可取消的 TTS path，再加真實語言與同意流程，最後才決定要不要把 orchestration 也交給 Cartesia。

## 參考資料

- [Cartesia Docs：TTS WebSocket API](https://docs.cartesia.ai/api-reference/tts/websocket)
- [Cartesia Docs：2026 Changelog](https://docs.cartesia.ai/changelog/2026)
- [Cartesia Docs：Volume, Speed, and Emotion](https://docs.cartesia.ai/build-with-cartesia/capability-guides/volume-speed-emotion)
- [Cartesia Docs：Clone Voice API](https://docs.cartesia.ai/api-reference/voices/clone)
- [Cartesia Docs：Zero Data Retention](https://docs.cartesia.ai/enterprise/zero-data-retention)
- [Cartesia AI, Inc.：Terms of Service](https://www.cartesia.ai/legal/terms)
- [Fortune：Cartesia raises $64M Series A](https://fortune.com/2025/03/11/exclusive-cartesia-voice-ai-startup-raises-64-million-series-a/)
- [LiveKit Agents documentation](https://docs.livekit.io/agents/)
- [Vapi documentation](https://docs.vapi.ai/)
- [Deepgram Voice Agent documentation](https://developers.deepgram.com/docs/voice-agent)
- [ElevenLabs documentation](https://elevenlabs.io/docs/overview)
