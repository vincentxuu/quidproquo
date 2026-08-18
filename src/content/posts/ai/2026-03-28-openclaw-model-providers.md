---
title: "OpenClaw 的模型需求與供應商生態：先搞懂 provider、model、runtime 是三件事"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, llm, anthropic, openai, gemini, model-failover, tool-use]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 6
tldr: "OpenClaw 對模型的硬需求是 tool use 加夠大的 context——onboarding 自動推薦本地模型的門檻是支援 tool 且 context 至少 16K。但更容易搞混的是 provider、model、agent runtime 其實是三層，`openai/*` 不等於走 Codex。"
description: "OpenClaw 的模型層級架構（provider／model／agent runtime／channel）、模型選擇的硬需求、供應商生態規模，以及 modelPolicy 允許清單與 utility model 這些容易忽略的設定。"
draft: false
---

OpenClaw 是模型無關的 AI 閘道器，但「接上一個模型」這件事比想像中多一層。這篇講的是**選模型之前要先搞懂的層級關係**，以及幾個實際會擋住你的設定。

## 四層，不是兩層

最常見的混淆是把「供應商」和「執行 agent 的東西」當成同一件事。官方把它拆成四層：

| 層 | 例子 | 意義 |
|---|---|---|
| Provider（供應商）| `anthropic`、`openai`、`github-copilot` | OpenClaw 怎麼認證、怎麼發現模型、模型 ref 怎麼命名 |
| Model（模型）| `claude-opus-5`、`gpt-5.6-sol` | 這一輪要用哪個模型 |
| Agent runtime | `openclaw`、`codex`、`claude-cli`、`copilot` | **實際跑那個 model loop 的後端** |
| Channel（頻道）| Discord、Slack、Telegram | 訊息從哪進來、往哪出去 |

agent runtime 是最容易被忽略的一層。它擁有一整個「準備好的 model loop」——收 prompt、驅動模型輸出、處理原生 tool call、把完成的一輪交回 OpenClaw。

分成兩個家族：**嵌入式 harness** 跑在 OpenClaw 自己的 agent loop 裡（內建的 `openclaw`，加上 `codex`、`copilot` 這類 plugin harness）；**CLI 後端**則是跑一個本地 CLI 程序，但模型 ref 保持標準寫法——`anthropic/claude-opus-5` 配上 model-scoped 的 `agentRuntime.id: "claude-cli"`，意思是「選 Anthropic 的模型，但透過 Claude CLI 執行」。

## `openai/*` 不等於 Codex

這條規則值得單獨拿出來講，因為它反直覺：**`openai/` 這個前綴本身永遠不會選到 Codex**。

runtime policy 沒設或設成 `auto` 時，OpenAI 只在一種情況會隱含選到 Codex：走官方 HTTPS 的 Platform Responses 或 ChatGPT Responses 路由、而且沒有自訂的 request override。只要你用了 Completions adapter、自訂端點、或帶了自訂 request 行為，就留在 OpenClaw 自己的 runtime 上。明文 HTTP 的官方端點會被直接拒絕。

要明確指定，就在 provider／model 層設 `agentRuntime.id`——設 `"openclaw"` 是「就算符合條件也留在 OpenClaw」，設 `"codex"` 則是**fail closed**：路由不相容時直接失敗，不會偷偷降級。

順帶一提，`claude-cli/*`、`google-gemini-cli/*`、`codex-cli/*` 這些舊寫法都已經是 legacy，`openclaw doctor --fix` 會把它們改寫成標準的 provider ref 加上獨立記錄的 runtime。整個 agent 層級的 runtime 設定鍵也已經被忽略，只有 model-scoped 的算數。

## 模型的硬需求

**Tool use 是底線。** 這點有個很具體的佐證：Ollama 的引導設定要自動推薦一個已安裝的本地模型時，條件是 `/api/show` 確認**支援 tool、而且 context window 至少 16K**——兩個條件缺一個，就退回手動設定路徑。

這比抽象的「建議用能力強的模型」有用得多：如果你想接本地模型，這兩條就是門檻。

## 不要在筆記裡寫死模型名

這篇刻意不列「推薦模型」清單，理由很實際：**官方文件自己就不一致**。同一天讀，`/providers/` 首頁的快速範例寫 `anthropic/claude-opus-4-6`，而 `/concepts/model-providers` 和 `/concepts/agent-runtimes` 寫的是 `claude-opus-5`。

模型 ref 是所有內容裡最會腐爛的一種。要知道你的帳號現在實際能用什麼，唯一可靠的方法是問：

```bash
openclaw models list
openclaw models list --provider openai   # 特定供應商
openclaw models list --all               # 含隱藏／已標記淘汰的列
```

## 引導設定不會覆蓋你的預設模型

這是實用的行為保證：`openclaw configure` 在你新增或重新認證一個供應商時，**會保留既有的 `agents.defaults.model.primary`**。`openclaw models auth login` 也一樣，除非你加 `--set-default`。

供應商 plugin 可能會在認證後回傳一個「推薦的預設模型」，但只要 primary 已經存在，OpenClaw 就把它當成「讓這個模型可用」，不是「換掉你的 primary」。

要刻意換預設，用 `openclaw models set <ref>` 或 `openclaw models auth login --provider <p> --set-default`。

## 兩個容易忽略的設定

**`agents.defaults.utilityModel`** — 一個較便宜的模型，用來做短小的內部任務：dashboard 的 session 標題、頻道的 thread／topic 標題、進度敘述。沒設的話，OpenClaw 會用主要供應商自己宣告的小模型預設（OpenAI 走 `gpt-5.6-luna`、Anthropic 走 `claude-haiku-4-5`），再沒有才退回 agent 的主模型；設成空字串則完全關掉。

值得知道的是：**utility 任務是獨立的模型呼叫，會把有限的任務內容送到那個供應商**。如果你對資料流向敏感，這是一個要主動決定的設定，不是可以忽略的細節。

**`agents.defaults.modelPolicy.allow`** — 覆寫用的允許清單。非空時，它同時管住 `/model`、session override 和 `--model`，選到清單外的模型會在產生任何回覆之前就被擋下：

```text
Model override "provider/model" is not allowed by agents.defaults.modelPolicy.allow.
```

支援尾綴萬用字元（`provider/*`、`provider/namespace/*`），所以要限制到供應商層級不必列出每個模型。有個坑：**本地／GGUF 模型必須寫完整的 provider 前綴 ref**（例如 `ollama/gemma4:26b`），裸檔名或顯示名稱在允許清單啟用後都不算數。

## 供應商生態有多大

官方的 provider 目錄現在列出 **60 個條目**，其中包含語音（Deepgram、ElevenLabs、Azure Speech、SenseAudio）與影像／音樂／影片生成（ComfyUI、fal、Runway）這類非 LLM 供應商。

分類大致是：頂級商用（Anthropic、OpenAI、Google）、中國廠商（DeepSeek、Qwen、Z.AI／GLM、MiniMax、Moonshot、Qianfan、Volcengine、Tencent、Xiaomi、LongCat）、推理加速（Groq、Cerebras、Together、Fireworks、Baseten、Novita）、本地部署（Ollama、LM Studio、vLLM、SGLang、inferrs、ds4）、代理閘道（OpenRouter、LiteLLM、ClawRouter、Vercel AI Gateway、Cloudflare AI Gateway）。下一篇會挑其中幾個實際講。

大部分供應商邏輯活在**供應商 plugin** 裡（`registerProvider(...)`），OpenClaw 只保留通用的推論迴圈。plugin 負責 onboarding、模型目錄、認證環境變數對應、傳輸與設定正規化、tool schema 清理、failover 分類、OAuth 更新、用量回報、thinking 設定檔。所以「這個供應商支援什麼」的答案通常在它的 plugin，不在核心。

## 從 Control UI 設定

Control UI 的 **Settings → Model Providers** 可以新增、替換、移除供應商 API key（存在 `models.providers.<p>.apiKey`）。它會標示每個 key 是來自 OpenClaw 設定還是環境變數，但**不顯示憑證本身**；環境變數提供的 key 仍由 gateway 程序的環境管理。

有個 **Test connection** 會做一次真實的供應商探測，回報延遲或分類過的錯誤（認證、速率限制、帳務、逾時、回應錯誤）。注意它是真的送一次請求，**會消耗少量 token**。

## 整體來說

接模型時真正該先想清楚的是層級：**provider 決定怎麼認證、model 決定用哪個腦、runtime 決定誰在跑那個迴圈**。三者分開之後，「為什麼我設了 `openai/...` 卻跑到 Codex」或「為什麼 doctor 改寫了我的模型 ref」這類問題才有答案。

至於模型名，別記——每次都問 `openclaw models list`。下一篇講其餘供應商，最後一篇講失效與容錯。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。**新增 agent runtime 這一層**（provider／model／agent runtime／channel），3 月版完全沒有這個概念；補上 `openai/*` 前綴不等於 Codex 的路由規則，以及 `claude-cli/*`、`codex-cli/*` 等 legacy ref 由 doctor 遷移的行為。**移除所有「推薦模型」的固定 ref**（原文寫 `claude-opus-4-6`、`openai/gpt-5.4`，現況已變，且官方文件各頁自己不一致），改為指向 `openclaw models list`。新增 onboarding 保留既有 primary 的保證、`utilityModel`（含它是獨立模型呼叫、會外送內容）、`modelPolicy.allow` 允許清單與本地模型需完整 ref 的坑、Control UI 的供應商設定頁與 Test connection 會消耗 token。供應商數量從「35+」更新為官方目錄現列的 60 個條目。三大供應商的逐項設定表移出，改由下一篇與官方文件承接。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Agent runtimes](https://docs.openclaw.ai/concepts/agent-runtimes) — provider／model／runtime／channel 的分層與 Codex 各介面的差異
- [Model providers](https://docs.openclaw.ai/concepts/model-providers) — 供應商設定、plugin 擁有的行為、Control UI 設定頁
- [Models CLI](https://docs.openclaw.ai/concepts/models) — 模型 ref 解析、選擇順序、`modelPolicy.allow` 與 utility model
- [Provider directory](https://docs.openclaw.ai/providers/) — 供應商目錄
- [Ollama](https://docs.openclaw.ai/providers/ollama) — 本地模型的 tool support 與 context 門檻
