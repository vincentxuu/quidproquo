---
title: "Vapi：語音 Agent 的即時編排層，以及電話上線前的安全界線"
date: 2026-08-22
category: ai
type: deep-dive
tags: [vapi, voice-agent, telephony, speech-to-text, text-to-speech, ai-agent]
lang: zh-TW
tldr: "Vapi 把電話與 Web 音訊、STT、LLM、TTS、tool calls 和 call observability 接成託管 voice runtime；可換 provider，卻不能搬走 Vapi 專屬的即時編排。官方 2026-05 自報已有 100 萬名開發者，並宣布 5,000 萬美元 B 輪。"
description: "從 phone/web call、assistant config、STT/LLM/TTS、tool calls 到 observability 拆解 Vapi，涵蓋 provider swapping、telephony、安全工具設計、錄音同意、資料保存、PCI/HIPAA 精確界線，以及相對 LiveKit、Cartesia、Deepgram、ElevenLabs 的選型位置。"
draft: false
---

🌏 [English version](/posts/ai/2026-08-22-vapi-voice-agents-en)

[Vapi](https://docs.vapi.ai/quickstart/introduction) 是託管 voice agent orchestration 平台。它把電話或 WebRTC 送來的聲音串過 speech-to-text（STT）、LLM 與 text-to-speech（TTS）。過程中處理輪次、打斷、轉接與 tool call，再留下每通電話的 transcript、latency 與結果。它不是一個更好的語音模型，而是讓多個即時服務在同一通電話裡不互相踩腳的 runtime。

截至 2026-08，Vapi 在[官方 B 輪公告](https://vapi.ai/blog/series-b)自報已有 100 萬名開發者使用平台。

同一份公告宣布由 Peak XV 領投的 5,000 萬美元 B 輪，累計融資 7,200 萬美元。這些是公司自報的註冊規模與融資，不是 active production calls。選型應回到一通電話從接通到結束，哪一層是你願意交給 Vapi 的。

## 一、Phone / Web call：先決定聲音從哪裡進來

Vapi 有兩種主要入口。Phone call 連到 PSTN，能接 inbound number 或由 server 發起 outbound call；Web call 則用 browser/mobile SDK 建立即時語音介面。[Web quickstart](https://docs.vapi.ai/quickstart/web)的最小前端只有 public key 與 assistant ID：

```bash
pnpm add @vapi-ai/web
```

```ts
import Vapi from "@vapi-ai/web";

const vapi = new Vapi("YOUR_PUBLIC_API_KEY");
await vapi.start("YOUR_ASSISTANT_ID");

vapi.on("call-end", () => console.log("ended"));
vapi.on("message", (message) => {
  if (message.type === "transcript") console.log(message.transcript);
});
```

電話端使用 private API key，不能放進 browser。先在 Vapi 匯入或購買 phone number，再由後端建立 outbound call：

```bash
curl -X POST https://api.vapi.ai/call \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumberId": "YOUR_PHONE_NUMBER_ID",
    "assistantId": "YOUR_ASSISTANT_ID",
    "customer": {"number": "+15551234567"}
  }'
```

Phone 和 Web 共用 assistant，媒體入口不同。電話還多一層 carrier、SIP、號碼法規與 voicemail；Web 則要處理 microphone permission、裝置切換與前端狀態。不要用瀏覽器 demo 的音質與延遲推論 PSTN production 表現，正式選型必須拿目標國家、carrier 與真實裝置測。

## 二、Assistant config：把對話契約放在一個可版本化物件

Assistant 是 Vapi 的設定中心：first message、system prompt、transcriber、model、voice、tools、artifact plan 與 compliance plan 都掛在這裡。[Create Assistant API](https://docs.vapi.ai/api-reference/assistants/create?explorer=true)可以用 JSON 建立。常見做法不是把每個值寫死在 call request，而是保存 assistant，再讓個別 call 用 override 傳入姓名、預約編號等動態資料。

Prompt 要為聲音重寫。一次只問一個問題、回覆短、數字與網址要能念、使用者打斷後不要從頭重講。Vapi 的 assistant 適合單一職責；需要跨部門時，Squad 才把專門 assistant 串成可保留 context 的 transfer。這比在一份 system prompt 裡塞客服、銷售、付款與醫療分流安全，因為每個 assistant 可以有不同 tools 與 artifact 設定。

## 三、STT → LLM → TTS：可替換的是 provider，不可忽略的是整條延遲

Vapi 把 voice pipeline 拆成三個 provider slot。[Core Models 文件](https://docs.vapi.ai/quickstart)說 STT、LLM 與 TTS 都能換成支援的 provider，也能接 custom server。2026-07 加入的 [Model Intelligence](https://docs.vapi.ai/assistants/model-intelligence/overview)則提供 preset 和每週更新的 latency、cost、quality metrics。

這個設計讓你能逐層替換：專有名詞辨識差就換 STT，推理不足只換 LLM，品牌聲音不對只換 TTS。它降低 model lock-in，沒有消除 platform lock-in。[Vapi data-flow 文件](https://docs.vapi.ai/security-and-privacy/data-flow)明列 endpointing、interruption detection、emotion detection、backchannel 與 filler injection 等 orchestration 只能跑在 Vapi 基礎設施上。

官方首頁宣稱 sub-600ms response time；[Core Models 文件](https://docs.vapi.ai/quickstart)則把理想 voice-to-voice 寫成 500–700ms。兩者都是 Vapi 的目標／自報，不是你的 SLA。實際 latency 是 endpointing、STT partial、LLM first token、TTS first byte、網路與 telephony transport 的總和。[Call artifact](https://docs.vapi.ai/whats-new/2025/8/9)會分別留下 transcriber、model、voice、endpointing 與 turn latency，調校時要看最慢的那一段，不要只換一個號稱更快的模型。

## 四、Tools：電話裡的一句話可能變成真實副作用

[Vapi tools](https://docs.vapi.ai/tools/)分成內建 call-control tools、自家 webhook custom tools、直接在 Vapi 執行的 TypeScript code tools，以及 Make / GoHighLevel integrations。它們讓 agent 查訂單、排時間、更新 CRM、轉真人或結束電話。Tool 可以同步或非同步，也能釘特定版本。

語音的攻擊面比 chat 大：轉錄錯一個數字、背景聲音插入一句指令，或 caller 冒充帳戶本人，都可能觸發不可逆動作。工具 schema 要小，後端重新驗證每個 argument；查詢和寫入用不同 tools；付款、取消、個資變更要再次口頭確認，必要時轉真人。不要把 caller 說出的 customer ID 當成 authorization，也不要讓 model 直接決定任意 webhook URL。

Tool webhook 還要驗證來源、設 timeout 與 idempotency key。電話斷線或模型重試時，同一個「幫我取消」可能送兩次；日曆預約、退款與 CRM update 必須能安全重放。Vapi 處理 function calling，不替你的業務 API 提供交易一致性。

## 五、Observability：從「聽起來怪」追到是哪一層慢

[Vapi debugging 文件](https://docs.vapi.ai/debugging)把資料分成 Call Logs、API Logs 與 Webhook Logs。Call log 能看 transcript、duration、ended reason、tool result 與 conversation flow；call artifact 另有逐 turn performance metrics。Structured outputs 會在通話結束後讀完整 transcript、messages、tool results 與 metadata，再依 JSON Schema 產出摘要、成功狀態或欄位。[官方文件](https://docs.vapi.ai/assistants/structured-outputs-quickstart)說通常在掛斷後數秒完成。

這些分析不是 ground truth。摘要與 CSAT extraction 仍是模型輸出，要抽樣人工對照。技術監控看 provider error、timeout 與 latency；成效監控看 task completion、轉真人率、掛斷位置與使用者申訴。Vapi 的 monitor 能定期查 Insights、超過 threshold 後建立 issue，並透過 email、Slack 或 webhook 通知；它不會自動證明 prompt 變更造成改善。

## 六、資料保存與錄音同意：預設會留資料，合規模式彼此不同

預設 data flow 會把 recording、完整 transcript、call log 與 structured output 存在 Vapi。[Call recording 文件](https://docs.vapi.ai/assistants/call-recording)列出的 Pay-As-You-Go retention 上限為 chat 30 天、call 14 天，Enterprise 才能設定 retention。也可把 artifacts 送到自己的 cloud storage，但 system logs 與 product usage metrics 仍留在 Vapi；支援的 storage 清單可回查 [data-flow 文件](https://docs.vapi.ai/security-and-privacy/data-flow)。

錄音同意不是開一個 toggle 就在全球合法。Vapi 的 Enterprise [Recording Consent Plan](https://docs.vapi.ai/security-and-privacy/recording-consent-plan)能先用不產生 artifact 的 consent assistant 詢問 verbal consent，或播放 stay-on-line notice。只有同意後才轉進主 assistant 並開始錄音。官方也明確提醒 jurisdiction 規則不同，有些地方要求所有人明確同意。部署者仍要由律師確認適用地區、目的、告知文字、撤回與刪除流程。

Zero Data Retention（ZDR）讓 variable values、call logs、recordings 與 transcripts 只在通話中使用，結束後不保存。這會犧牲 dashboard 除錯與事後分析，不等於資料從未經過 Vapi orchestration。

## 七、PCI 與 HIPAA：只能按官方設定的精確範圍理解

**PCI** 是 assistant-level 設定，`compliancePlan.pciEnabled` 預設為 false。[Vapi PCI 文件](https://docs.vapi.ai/security-and-privacy/pci)要求選 PCI-compatible model、voice、transcriber；開啟後若沒有設定自己的 compliant storage 或 webhook，recording 與 transcript 會永久刪除。這不會替你的 CRM、tool endpoint、付款流程或人員權限自動取得 PCI DSS 合規。

**HIPAA** 是 organization-level Enterprise／add-on 功能，啟用前要和 Vapi 簽 BAA，且整個 organization 只能選官方列出的 compliant providers。[HIPAA 文件](https://docs.vapi.ai/security-and-privacy/hipaa)明列 HIPAA mode 與 ZDR 互斥。HIPAA mode 預設仍把 recordings、transcripts、logs 放在 Vapi 的 private HIPAA-compliant storage，除非改接自己的 storage。自帶 provider key 也不夠，外部 provider account 與資料保存都要符合要求。

醫療 assistant 不該因為 toggle 存在就直接進 production。先把 PHI 會經過的 STT、LLM、TTS、tool、webhook、storage 全畫出來，逐家確認 BAA 與帳戶設定；測試 organization 不要放真實 PHI。PCI 與 HIPAA 也不取代錄音同意、TCPA 或所在地的電話行銷規範。

## 八、同層與相鄰工具怎麼選

**LiveKit Agents** 是 Apache-2.0 開源 framework，能自架 LiveKit server，也能用 LiveKit Cloud。[官方文件](https://docs.livekit.io/agents/)涵蓋 STT–LLM–TTS、realtime model、turn detection、WebRTC、SIP 與 agent server orchestration。要影音、多端 client、Kubernetes 或掌握 runtime code，LiveKit 更合理。要最快把電話號碼、provider、tools、logs 與 compliance config 接好，Vapi 的託管抽象較省事。

**Cartesia** 的核心是即時 TTS 與 voice model。[Realtime TTS quickstart](https://docs.cartesia.ai/get-started/realtime-text-to-speech-quickstart)直接從 WebSocket 串流文字換音訊。你可以把 Cartesia 選成 Vapi 的 voice provider；只有在自己已有 transport、STT、LLM、turn-taking 與 tools 時，才把它當 Vapi 替代品。

**Deepgram** 已從 STT/TTS 往完整 [Voice Agent API](https://developers.deepgram.com/docs/voice-agent)走，一條 WebSocket 可處理 listening、thinking、speaking、function calling 與 telephony，另有 Kubernetes self-hosted deployment。重視 speech stack 垂直整合、區域 endpoint 或自架時應實測 Deepgram；Vapi 的差異是更多 provider 組合、assistant/Squad 設定與跨 provider orchestration。

**ElevenLabs** 同時提供 TTS、STT、voice cloning 與 conversational agents；[官方文件](https://elevenlabs.io/docs/overview/intro/)把它定位成整套 voice infrastructure。若品牌聲音、voice library 與 speech quality 是產品核心，ElevenLabs 的垂直堆疊更直接；若要在 Deepgram STT、Anthropic LLM 與 Cartesia/ElevenLabs TTS 間自由組合，Vapi 的中立 orchestration 更符合需求。

## 整體來說

Vapi 的核心取捨是：用託管成本與 orchestration lock-in，換掉最難自己維護的即時串流、turn-taking、telephony、provider fallback 與逐通電話除錯。它適合要快速上線 inbound support、outbound qualification、booking 或 routing，而且團隊不想先養 voice infrastructure 的產品。

它不適合只需要 TTS 的功能，也不適合必須完全自架、所有音訊與系統 telemetry 都不能離開自家網路的環境。更不適合在沒有 consent、身份驗證與 tool 權限邊界前就大量撥號。第一個 production milestone 不該是「agent 聽起來像真人」，而是：它知道何時沒聽懂、何時不能執行、何時要轉真人，而且每個決定都能在 call artifact 裡追得回來。

## 參考資料

- [Vapi Introduction](https://docs.vapi.ai/quickstart/introduction)（assistant、STT/LLM/TTS、phone/web 與官方 latency 宣稱）
- [Vapi Web calls](https://docs.vapi.ai/quickstart/web)（Web SDK、server SDK 與 outbound call）
- [Vapi Create Assistant API](https://docs.vapi.ai/api-reference/assistants/create?explorer=true)（assistant 設定欄位）
- [Vapi Core Models](https://docs.vapi.ai/quickstart)（三段 pipeline、custom provider 與理想 latency）
- [Vapi Model Intelligence](https://docs.vapi.ai/assistants/model-intelligence/overview)（preset 與 metrics 方法）
- [Vapi Tools](https://docs.vapi.ai/tools/)（default、custom、code 與 integration tools）
- [Vapi Debugging voice agents](https://docs.vapi.ai/debugging)（Call/API/Webhook logs）
- [Vapi Structured outputs quickstart](https://docs.vapi.ai/assistants/structured-outputs-quickstart)（post-call analysis 與 HIPAA storage 行為）
- [Vapi Data Flow](https://docs.vapi.ai/security-and-privacy/data-flow)（預設／自有 storage、custom provider 與 orchestration 邊界）
- [Vapi Call recording](https://docs.vapi.ai/assistants/call-recording)（artifact、retention 與法律提醒）
- [Vapi Recording Consent Plan](https://docs.vapi.ai/security-and-privacy/recording-consent-plan)（verbal/stay-on-line consent 與 audit）
- [Vapi PCI Compliance](https://docs.vapi.ai/security-and-privacy/pci)（PCI mode、provider 與 storage 行為）
- [Vapi HIPAA Compliance](https://docs.vapi.ai/security-and-privacy/hipaa)（BAA、organization scope、provider 與 ZDR 互斥）
- [Vapi 2025-08-09 changelog](https://docs.vapi.ai/whats-new/2025/8/9)（component 與 turn latency artifacts）
- [Vapi Series B 官方公告](https://vapi.ai/blog/series-b)（融資與公司自報開發者數）
- [LiveKit Agents 文件](https://docs.livekit.io/agents/)（開源 runtime、模型、WebRTC 與 SIP）
- [Cartesia Realtime TTS quickstart](https://docs.cartesia.ai/get-started/realtime-text-to-speech-quickstart)（WebSocket TTS）
- [Deepgram Voice Agent API](https://developers.deepgram.com/docs/voice-agent)（single-WebSocket voice pipeline 與 telephony）
- [ElevenLabs 文件總覽](https://elevenlabs.io/docs/overview/intro/)（TTS、STT、voice cloning 與 conversational agents）
