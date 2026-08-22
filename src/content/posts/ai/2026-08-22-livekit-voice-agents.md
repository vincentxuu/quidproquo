---
title: "LiveKit Voice Agents：從 WebRTC Room 到可插話的語音 Pipeline"
date: 2026-08-22
category: ai
tags: [livekit, voice-agent, webrtc, realtime-ai, speech-to-text, telephony]
lang: zh-TW
type: deep-dive
tldr: "LiveKit 把語音 agent 建模成 realtime media room 裡的 server participant，再由 AgentSession 串接 STT、turn detection、LLM、TTS 與 interruption。2026 年完成 1 億美元 C 輪、估值 10 億美元；它適合需要 WebRTC、多端 client、電話與可替換模型的產品，但自架 media server 不等於自架整條 AI pipeline。"
description: "從生命週期與選型拆解 LiveKit Voice Agents：WebRTC room、AgentSession、STT/LLM/TTS、turn detection、插話、SIP telephony、錄音安全，以及 self-host 與 Cloud 的分界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-livekit-voice-agents-en)

[LiveKit](https://livekit.io/) 最初是 WebRTC media server，後來才在上面長出 Agents SDK。這段歷史決定了它跟一般 voice-agent API 的差異：使用者、AI agent、電話與其他服務都是 room participant，音訊、視訊與 data track 先走 realtime media layer；STT、LLM、TTS 只是 agent session 內可替換的處理節點。

這個定位已經被大型系統驗證。LiveKit 在 2026 年 1 月宣布由 Index Ventures 領投的 [1 億美元 C 輪與 10 億美元估值](https://livekit.com/blog/livekit-series-c)；同一公告自報 Agents 每月下載超過 100 萬次、網路每年處理數十億通 agent 與使用者間的 calls。這些是公司口徑。較早的 [TechCrunch 報導](https://techcrunch.com/2025/04/10/livekits-tools-help-power-real-time-communications/)則確認它支援 ChatGPT Voice Mode，並引述公司當時有逾 500 家付費客戶與 10 萬名開發者。

## 架構：room 是連線邊界，session 是對話邊界

```text
Web / iOS / Android / SIP phone
              │ WebRTC / RTP media
              ▼
         LiveKit Room
       ┌──────┴────────┐
 user participant   agent participant
                          │
                    AgentSession
          audio → VAD/STT → turn detector
                          → LLM/tools
                          → streaming TTS → audio
```

Room 處理誰加入、誰發布 track、網路品質、codec、重連與權限。Agent worker 收到 dispatch job 後加入 room，`AgentSession` 才開始處理特定使用者的對話。這個拆法讓同一個 agent backend 可以服務瀏覽器、原生 app、電話、機器人或多使用者 room，不必為每種 client 重寫語音傳輸。

依[官方生命週期](https://docs.livekit.io/agents/logic/sessions/)，session 從 initializing、starting 進入 running，期間 agent 在 listening、thinking、speaking 間切換；closing 時可 drain 尚未播放的語音、commit transcript、等候 queued operation，再關閉 I/O。真正的 production bug 往往在邊界：使用者離開但 worker 沒關、TTS 還在播放卻換 agent、tool call 卡住讓電話一直計費。每條 close path 都要測。

## 最小 Agents SDK 用法

LiveKit Inference 提供統一 model string，也可以改用各 provider plugin。最小 Python agent 如下：

```python
from livekit.agents import (
    Agent, AgentServer, AgentSession, JobContext,
    TurnHandlingOptions, inference,
)

server = AgentServer()

@server.rtc_session()
async def voice_agent(ctx: JobContext):
    session = AgentSession(
        stt="deepgram/nova-3:en",
        llm="google/gemma-4-31b-it",
        tts="cartesia/sonic-3",
        turn_handling=TurnHandlingOptions(
            turn_detection=inference.TurnDetector(),
        ),
    )
    await session.start(
        room=ctx.room,
        agent=Agent(instructions="Be concise and confirm before taking action."),
    )

if __name__ == "__main__":
    server.run()
```

Agents SDK 的 API 演進很快；[目前文件](https://docs.livekit.io/agents/logic/sessions/)把 turn 設定收進 `TurnHandlingOptions`。不要從舊教學複製後就鎖版。先用 `console` 模式測 prompt 與工具，再用 `dev` 連 room，production 才用 `start` 與 worker autoscaling。

## 延遲不是一個數字，是一條 critical path

使用者停止說話到聽見回覆，至少包含：上行網路、VAD/STT partial、end-of-turn 判斷、LLM first token、TTS first audio 與下行 playout。平均值會掩蓋最糟體驗；應分段記錄 p50/p95，並把「被誤判為講完」另列成品質指標。

LiveKit 的 preemptive generation 會在 turn 尚未確認前先呼叫 LLM，縮短回覆時間；[官方文件](https://docs.livekit.io/agents/logic/sessions/)也明說代價是推測錯誤時丟棄回覆並增加 token 成本。這不是免費加速。先在真實語料量 early-endpoint、discard rate 與 interruption，再決定是否開啟 preemptive TTS。

網路路徑也重要。WebRTC 會優先建立直接或 UDP 連線，受限網路才經 TURN relay；電話則從 PSTN/SIP 進 room。Agent、media edge、STT/LLM/TTS 若分散在不同區域，每一跳都增加 jitter 與尾端延遲。LiveKit Cloud 可以做全球 media routing 與 inference routing，自架則要自己決定 SFU、TURN、worker 與模型 endpoint 的區域配置。

## Turn detection 與 interruption 才是「像在對話」的核心

只靠固定 silence timeout 會在使用者停頓時搶話，也會讓完整句子結束後等太久。LiveKit 可以結合 VAD、STT endpoint 與 semantic turn detector，判斷「這句話在語意上是否講完」。不同語言、口音、電話音質與填充詞會改變結果，應用自己的錄音建立 turn eval set。

Interruption（barge-in）是另一條 state transition：使用者在 agent 說話時開口，系統要停止 playout、取消或保留生成、更新 chat context，再開始聽新 turn。背景電視或 agent 自己的回音也可能觸發誤中斷，因此 noise cancellation、echo control 與 minimum speech duration 要一起調。客服情境還要決定哪些內容不可被打斷，例如法規揭露或一次性驗證碼說明。

## Telephony：SIP 只是接通，營運問題才剛開始

[LiveKit Telephony](https://docs.livekit.io/telephony/)以 SIP trunk 把 PSTN caller 轉成 room participant，因此同一個 AgentSession 可以接 web 與電話。Inbound trunk、dispatch rule 決定來電進哪個 room/agent；outbound trunk 則由系統撥號。DTMF、IVR detection、transfer 與 human handoff 都要成為明確 workflow，不要藏在 prompt 裡。

電話還多了 caller ID、carrier、地區法規、錄音提示、拒接與 voicemail 等失敗模式。先做一條能安全轉真人的路，再追求全自動。若業務只需要電話而沒有 web/mobile/video client，整套 WebRTC client 生態可能不是必要成本。

## 資料安全、錄音與同意

Realtime audio、逐字稿、session replay、tool arguments 與電話號碼都是敏感資料。第一個決策不是保存多久，而是**是否需要保存**。除錯可以只存時間對齊的事件與 redact 後 transcript；若要錄音，必須在通話開始前按適用地區與使用情境取得有效告知／同意，並提供停止錄製、刪除與人工處理流程。跨地區服務不能拿單一提示詞當成全球合規方案，應讓法務確認。

Self-host LiveKit server 能把 media plane 放在自己的 VPC，但若 STT、LLM、TTS 仍呼叫第三方 API，音訊與文字依然會離開網路邊界。必須逐一確認 provider 的 retention、training、region 與 zero-data-retention 條款。API key 應由 server 持有，participant token 只給最小 room permission；不要把 LiveKit API secret 或模型 key 放進 client。

錄影／錄音通常由 Egress 產生檔案，另有 object storage、加密、存取與 deletion lifecycle。Observability 也要做資料分級：工程師可能需要 latency trace，不代表能任意播放所有客戶通話。

## Self-host 還是 LiveKit Cloud

**選 self-host**：已有 WebRTC/SRE 能力、媒體必須留在指定網路、需要修改 SFU 或部署到 edge/特殊硬體，而且願意自己營運 TURN、autoscaling、upgrade、跨區與告警。LiveKit server 與 Agents framework 都開源，但模型服務、電話 carrier 與錄製儲存仍是額外系統。

**選 Cloud**：要快速取得全球 edge、managed TURN、telephony、agent dispatch/compute、observability 與統一 inference routing。Cloud 減少的是 realtime infrastructure 維運，不會替你完成 prompt、tool permission、conversation QA 與法規責任。

真正的成本單位是「成功完成的一分鐘對話」：同時計入 media、agent compute、STT、LLM token、TTS 字元、SIP 分鐘、錄音與失敗重試。只比 TTS 每百萬字元，會完全漏掉系統成本。

## 跟 Vapi、Cartesia、Deepgram、ElevenLabs 怎麼選

[Vapi](https://vapi.ai/)提供更高階、偏電話優先的 voice-agent API，想快速組 outbound/inbound call 與既有整合時路徑較短。LiveKit 適合要掌握 room、client、media track 與 agent code，或同時做 web/mobile/video 的團隊。

[Cartesia](https://cartesia.ai/)、[Deepgram](https://deepgram.com/)與 [ElevenLabs](https://elevenlabs.io/)首先是模型／語音平台：Cartesia 與 ElevenLabs 常作為 TTS，Deepgram 常作為 STT；它們也逐步提供完整 voice-agent 產品。LiveKit 不必取代它們，Agents SDK 的 plugin 與 Inference 正是用來把這些 provider 放進同一 pipeline。若單一供應商的 realtime voice-to-voice API 已滿足流程，少一層 orchestration 可能更簡單；若要替換 STT/TTS、加入視訊、電話與自有 client，LiveKit 的媒體抽象更有價值。

比較時固定同一批錄音與任務，量 end-of-turn error、p95 首音延遲、barge-in 成功率、電話接通率、工具完成率與每成功分鐘成本。聲音 demo 好聽，不代表跨區電話與吵雜環境能穩定運作。

## 結論

LiveKit 最適合把 voice agent 當 realtime distributed system，而不是一支「語音 API」的團隊。Room 解決媒體與 participant，AgentSession 管對話狀態，STT/LLM/TTS 可以替換；這種分層換來跨 client 與多模態彈性，也帶來更多需要營運的生命週期。

只做簡單電話 MVP，先試較高階的託管 voice-agent API。需要 WebRTC app、電話、視訊、自有 agent workflow、低階 media control，或想保留 self-host 路徑，再選 LiveKit。真正決勝點不是合成聲音多像真人，而是對方停頓、插話、斷線、轉真人與撤回同意時，整個 session 能不能正確收尾。

## 參考資料

- [LiveKit Agents GitHub repository](https://github.com/livekit/agents)
- [LiveKit AgentSession documentation](https://docs.livekit.io/agents/logic/sessions/)
- [LiveKit Turns overview](https://docs.livekit.io/agents/logic/turns/)
- [LiveKit Telephony documentation](https://docs.livekit.io/telephony/)
- [LiveKit Series C announcement](https://livekit.com/blog/livekit-series-c)
- [LiveKit’s tools power real-time communications, including OpenAI’s Voice Mode — TechCrunch](https://techcrunch.com/2025/04/10/livekits-tools-help-power-real-time-communications/)
- [LiveKit voice-agent examples](https://github.com/livekit/agents/tree/main/examples/voice_agents)
- [Vapi](https://vapi.ai/)
- [Cartesia](https://cartesia.ai/)
- [Deepgram](https://deepgram.com/)
- [ElevenLabs](https://elevenlabs.io/)
