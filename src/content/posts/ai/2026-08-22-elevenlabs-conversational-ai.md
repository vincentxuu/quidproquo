---
title: "ElevenLabs ElevenAgents：從即時語音到電話 Agent 的完整生命週期"
date: 2026-08-22
category: ai
type: deep-dive
tags: [elevenlabs, voice-agent, ai-agent, speech-to-text, text-to-speech, telephony]
lang: zh-TW
tldr: "ElevenLabs 已從 TTS 供應商擴成 ElevenAgents 平台：Scribe Realtime 收音、Flash 合成語音，再把 LLM、turn-taking、工具與電話整合收進同一條即時管線；選型關鍵是你要聲音品質，還是整個 agent 控制面。"
description: "拆解 ElevenLabs ElevenAgents 的即時 STT/TTS、turn-taking、工具、電話與資料治理，並與 LiveKit、Vapi、Cartesia、Deepgram 比較適用邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-elevenlabs-conversational-ai-en)

[ElevenAgents](https://elevenlabs.io/docs/eleven-agents/overview/) 是 ElevenLabs 目前的全託管語音 agent 平台，前身叫 Conversational AI。它把即時 speech-to-text（STT）、LLM、text-to-speech（TTS）與 turn-taking 接成一條管線。工具、知識庫、測試與部署也在同一控制面，agent 可放到網頁、行動裝置或電話。

它不只是一個「會說話的聊天機器人」。底層可單獨使用 [Scribe v2 Realtime](https://elevenlabs.io/docs/overview/capabilities/speech-to-text) 與 [Flash TTS](https://elevenlabs.io/docs/overview/capabilities/text-to-speech)。中間新增的 **Speech Engine** 只接管 STT、TTS、turn-taking 與 interruption，讓你的伺服器保留 LLM 邏輯。最上層 ElevenAgents 才連 LLM、tools、telephony 與營運控制面一起託管。

因此選型不是「ElevenLabs 的聲音好不好聽」而已。真正問題是：你要買一個 speech model、一個可替換 LLM 的 voice runtime，還是一套從設定到電話營運的完整 agent 平台？

## 一、Listen 與 Speak：延遲要看完整回路

語音 agent 的回路是：音訊輸入 → STT partial／committed transcript → 判斷輪次結束 → LLM 產生文字 → TTS 首段音訊 → 播放。ElevenLabs 的 Realtime STT 用 WebSocket 傳音訊，支援 VAD 自動 commit 或手動 commit。Scribe 會回傳 partial 與 committed transcript，不能把 partial 當成不可變的最終文字。

官方將 Scribe v2 Realtime 的延遲標為約 150ms，Flash TTS 的 model latency 標為約 75ms。這兩個都是 **ElevenLabs 自報的模型數字**，不是使用者感受到的端到端延遲；[延遲文件](https://elevenlabs.io/docs/api-reference/reducing-latency)也明說網路位置、endpoint 與排隊仍會加上去。上線前應錄下 `speech_end → committed transcript → first LLM token → first audio byte` 四個時間點，而不是把兩個 vendor 數字相加。

Flash 適合對話，Multilingual v2 偏長文穩定度，Eleven v3 偏表現力。串流時要及早送出可朗讀的短語，但不要切碎到破壞韻律。電話還要以實際的 μ-law 窄頻音訊測試，不能拿耳機裡的高音質展示當成通話品質。

## 二、Decide：Speech Engine 與 ElevenAgents 的分界

[Speech Engine](https://elevenlabs.io/docs/overview/capabilities/speech-engine) 適合已有文字 agent 的團隊。ElevenLabs 處理收音、轉錄、輪次與播放，你的 WebSocket server 收到 transcript 和對話歷史後，自行呼叫任何能串流文字的 LLM。這條路保留 prompt、memory、model routing 與工具 orchestration 的控制權。

ElevenAgents 則把 LLM、knowledge base、workflow 和 analytics 一起管理。它的工具分為 client tools、webhook tools、MCP tools 與 system tools；[工具文件](https://elevenlabs.io/docs/eleven-agents/customization/tools)也涵蓋掛斷、轉接、語言切換與 DTMF。方便的代價是你的 prompt、工具 schema、對話紀錄與發布流程更貼近平台物件。

最小的 React 連線如下。公開 agent 可直接用 ID；私人 agent 必須由後端換 signed URL 或 WebRTC token，不能把 API key 放進瀏覽器。

```tsx
import {
  ConversationProvider,
  useConversationControls,
} from "@elevenlabs/react";

function AgentButton() {
  const { startSession, endSession } = useConversationControls();
  return (
    <>
      <button onClick={() => startSession({ agentId: "YOUR_AGENT_ID" })}>
        Start call
      </button>
      <button onClick={endSession}>End call</button>
    </>
  );
}

export default function App() {
  return <ConversationProvider><AgentButton /></ConversationProvider>;
}
```

## 三、Turn-taking：沉默不是只有一種意思

[Conversation flow](https://elevenlabs.io/docs/eleven-agents/customization/conversation-flow) 可調 silence timeout、soft timeout、interruptions 與 turn eagerness。客服對話通常要允許 barge-in；法律揭露或安全說明則可能要暫時禁止打斷。太積極會搶話，太保守會留下尷尬空白，沒有一組設定適用所有語言與電話環境。

可執行的調法是收集真實通話，標記「正常停頓、思考停頓、完成一句、假中斷、真正插話」，再分語言測 endpointing。工具需要較久時，用 soft-timeout 或 tool-call sound 告知還在處理；不要讓 LLM 假裝「一秒就好」，因為外部 API 的時間不可預測。

## 四、Act 與 Call：工具權限比 prompt 更重要

Webhook tool 可以查訂單或建立預約，client tool 可以更新畫面，system tool 可以掛斷或轉接。每個會改變外部狀態的工具都應在你的 API gateway 再做身分驗證、輸入驗證、冪等與權限檢查；不要把「模型選了這個 tool」當成授權。

電話層支援 SIP trunk、Twilio、批次 outbound 與轉接。[Twilio register-call 文件](https://elevenlabs.io/docs/eleven-agents/phone-numbers/twilio-integration/register-call)顯示，保留既有 Twilio 控制權時要自行橋接 WebSocket，而且該模式不支援平台的 call transfer。要有人類接手，就在設計時先測轉接失敗、無人接聽與摘要交接，不要等上線後才補。

## 五、Voice cloning：驗證不是同意書

[Voice cloning 文件](https://elevenlabs.io/docs/eleven-api/concepts/voice-cloning)區分 Instant Voice Cloning 與 Professional Voice Cloning。前者用短樣本在推論時 conditioning；後者以較多錄音 fine-tune，較適合需要一致品牌聲音的正式環境。兩者都有 voice verification，但官方也承認驗證只能確認請求者參與，不能保證所有錄音的權利歸屬。

所以技術驗證不能取代明確同意。正式流程應保存聲音所有人的用途、期間、通路、撤回與再授權紀錄；來電開頭要揭露是 AI。沒有可稽核同意，就用 Voice Design 或已授權的 Voice Library，不要複製真人聲音。高風險流程還要限制可說內容，避免聲音身分被拿去越權背書。

## 六、Retention、training 與 security

[資料使用說明](https://elevenlabs.io/docs/help-center/legal/is-my-data-used-to-improve-eleven-labs-ai-models)指出，一般帳號的部分資料可能用於改善 audio models，使用者可關閉；Enterprise 預設不拿客戶資料訓練。這和 retention 是兩件事，兩個開關都要檢查。

Agents 可停存 audio、設定 transcript retention，企業方案另有敏感資料 redaction。[Zero Retention Mode](https://elevenlabs.io/docs/eleven-api/resources/zero-retention-mode)只涵蓋符合資格的 API traffic，不涵蓋 UI／playground；開啟後也會犧牲除錯能力。

今晚可以建立測試 agent，關閉 audio saving，並把 retention 設成符合目的的最短期間。打一次測試電話後，再到 history 與 webhook payload 驗證沒有多留資料。

私人 agent 用短效 signed URL／token；API key 只留後端。Webhook 要驗證來源、限制 egress 目的地並遮蔽 secrets；醫療用途先完成 BAA，不能只看到產品頁寫 HIPAA 就推定自己的部署已合規。

## 採用與融資數字怎麼看

ElevenLabs 在 2026 年二月的[官方 Series D 公告](https://elevenlabs.io/blog/series-d)宣布募得 5 億美元，估值 110 億美元。

公司當時自報前一年 ARR 超過 3.3 億美元。五月又[自報 ARR 已超過 5 億美元](https://elevenlabs.io/blog/500m-arr-and-new-investors)。

這些是公司公告，沒有公開稽核口徑。它們能顯示商業動能，不能替代你的接通率、任務完成率、人工轉接率、端到端延遲與每通成功成本。

## 與 LiveKit、Vapi、Cartesia、Deepgram 怎麼選

| 優先需求 | 先看 | 克制判斷 |
|---|---|---|
| ElevenLabs 聲音、低程式碼 agent 與同平台電話營運 | ElevenLabs | Speech Engine 到 ElevenAgents 有漸進路徑，但控制面較集中 |
| 即時媒體層、開放原始碼 agent framework、自由混搭模型 | [LiveKit](https://docs.livekit.io/agents/logic/turns/) | turn detector、WebRTC 與 pipeline 控制細；要自行組合更多供應商與營運層 |
| 電話優先且想自由選 STT／LLM／TTS 供應商 | [Vapi](https://docs.vapi.ai/quickstart/introduction) | provider orchestration 是核心；聲音本身可直接選 ElevenLabs |
| Cartesia Ink／Sonic 與 code-first managed runtime | [Cartesia Line](https://docs.cartesia.ai/line/introduction) | STT、TTS、部署與 agent code 收在 Line；先以實際語言和聲線 A/B |
| Deepgram STT 優先，或想用單一 WebSocket 的 voice pipeline | [Deepgram Voice Agent API](https://developers.deepgram.com/docs/voice-agent) | listening、thinking、speaking 整合直接，也提供 self-hosted 路徑 |

不要用單一 TTS latency 排名。LiveKit 偏即時媒體與可組裝 framework，Vapi 偏多供應商電話 orchestration。Cartesia 與 Deepgram 都有自己的語音模型和 agent 平台。ElevenLabs 的差異是從聲音資產一路延伸到 agent 營運。用你的語言、口音、噪音、電話 codec 和工具流程做盲測，才是可採用的比較。

## 適合、不適合與最後判斷

ElevenAgents 適合聲音品質與品牌 voice 是產品核心、要快速部署網頁與電話，而且願意採用整合控制面的團隊。已有成熟文字 agent 時，先從 Speech Engine 接入，比整套搬遷更容易驗證價值。

若你需要完全自架、要自由替換每一段 pipeline，或既有 contact center 有大量特殊 routing，LiveKit、Vapi 或 Deepgram 的組法可能更合適。若只需要 TTS，也不要為了未來可能用到的電話功能先導入完整 agent 平台。

最後先做一條窄流程：一種語言、一個工具、一個轉接出口。跑真實 codec 的端到端測試，逐通檢查 consent、turn-taking、工具權限與資料刪除。這四項過不了，聲音再像真人也還不是可營運的 voice agent。

## 參考資料

- [ElevenAgents overview](https://elevenlabs.io/docs/eleven-agents/overview/)（正式產品範圍與部署通路）
- [Speech Engine](https://elevenlabs.io/docs/overview/capabilities/speech-engine)（自帶 LLM 的產品邊界）
- [Speech to Text](https://elevenlabs.io/docs/overview/capabilities/speech-to-text)、[Text to Speech](https://elevenlabs.io/docs/overview/capabilities/text-to-speech) 與 [Latency optimization](https://elevenlabs.io/docs/api-reference/reducing-latency)（模型與延遲口徑）
- [React SDK](https://elevenlabs.io/docs/eleven-agents/libraries/react) 與 [WebSocket](https://elevenlabs.io/docs/eleven-agents/libraries/web-sockets)（最小連線與驗證）
- [Conversation flow](https://elevenlabs.io/docs/eleven-agents/customization/conversation-flow) 與 [Tools](https://elevenlabs.io/docs/eleven-agents/customization/tools)（turn-taking 與動作）
- [Register Twilio calls](https://elevenlabs.io/docs/eleven-agents/phone-numbers/twilio-integration/register-call)（電話整合限制）
- [Voice cloning](https://elevenlabs.io/docs/eleven-api/concepts/voice-cloning)（IVC、PVC 與 verification 邊界）
- [Data use](https://elevenlabs.io/docs/help-center/legal/is-my-data-used-to-improve-eleven-labs-ai-models)、[Agent privacy](https://elevenlabs.io/docs/eleven-agents/customization/privacy) 與 [Zero Retention Mode](https://elevenlabs.io/docs/eleven-api/resources/zero-retention-mode)（訓練、保存與刪除）
- [ElevenLabs Series D](https://elevenlabs.io/blog/series-d) 與 [2026 ARR update](https://elevenlabs.io/blog/500m-arr-and-new-investors)（公司自報融資與營收）
- [LiveKit turns](https://docs.livekit.io/agents/logic/turns/)、[Vapi introduction](https://docs.vapi.ai/quickstart/introduction)、[Cartesia Line](https://docs.cartesia.ai/line/introduction)、[Deepgram Voice Agent](https://developers.deepgram.com/docs/voice-agent)（同層產品公開定位）
