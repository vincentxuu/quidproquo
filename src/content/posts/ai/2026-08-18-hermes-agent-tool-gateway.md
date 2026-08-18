---
title: "Nous Tool Gateway：用一份訂閱換掉四個帳號，代價是把工具供應鏈集中到一家"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, nous-portal, tool-gateway, firecrawl, image-generation, tts]
lang: zh-TW
series:
  name: "Hermes Agent 文件導讀"
  order: 4
tldr: "Tool Gateway 把 Hermes 的網頁搜尋（Firecrawl）、圖像生成（FAL 九個模型）、TTS（OpenAI）與雲端瀏覽器（Browser Use）四類工具改走 Nous 的基礎設施，用一次 OAuth 取代四個帳號。它是 per-tool 開關而非全有全無，`use_gateway: true` 會蓋過你 `.env` 裡的直連金鑰——這是最容易搞混的優先序。"
description: "Nous Tool Gateway 的實際範圍、開啟方式、per-tool 優先序規則、免費工具池與付費門檻，以及把工具供應鏈集中到單一供應商的取捨。"
draft: false
---

系列第 4 篇。[導讀在這裡](/posts/ai/2026-08-18-hermes-agent-intro)。

要讓一個 agent 真的能做事，你通常得同時養四五個帳號：搜尋一個、抓網頁一個、生圖一個、語音一個、雲端瀏覽器一個，各有各的註冊、限流、帳單與怪脾氣。Tool Gateway 是 Nous 對這件事的答案，也是[上一篇](/posts/ai/2026-08-18-hermes-agent-providers)講的訂閱制路線在工具層的延伸。

## 它涵蓋哪四類

| 工具 | 背後是誰 | 內容 |
|---|---|---|
| 網頁搜尋與擷取 | Firecrawl | agent 級搜尋 + 整頁擷取，官方說「不用煩惱限流，由 gateway 處理擴展」 |
| 圖像生成 | FAL | 九個模型一個端點：FLUX 2 Klein 9B（預設）、FLUX 2 Pro、Z-Image Turbo、Nano Banana Pro（Gemini 3 Pro Image）、GPT Image 1.5／2、Ideogram V3、Recraft V4 Pro、Qwen Image |
| 文字轉語音 | OpenAI TTS | 接進 `text_to_speech` 工具，可以直接丟語音訊息到 Telegram |
| 雲端瀏覽器 | Browser Use | 無頭 Chromium，`browser_navigate` / `browser_click` / `browser_type` / `browser_vision` 全套，不需要 Browserbase 帳號 |

四類都是 pay-as-you-use，記在你的 Nous 訂閱上。官方的說法是「同樣的後端，只是由我們代管」——所以品質論點不在「更好」，在**少四次註冊**。

## 三條開啟路徑，差別在副作用

```bash
hermes setup --portal   # 新裝：OAuth + 設 Nous 為供應商 + 全部工具走 gateway
hermes model            # 既有安裝：切成 Nous Portal，然後問你要不要全開
hermes tools            # 逐項開：只挑你要的那個工具選 "Nous Subscription"
```

第三條有個容易錯過的性質：**`hermes tools` 不需要你先登入**。Nous 代管的後端一律會列在選單裡，選下去才跑 Portal 登入；而且這條路只登入並開啟你挑的那一個工具——**不會**順手換掉你的推論供應商，也不會問你要不要全部工具都轉過去。想「只用 Nous 的搜尋、模型繼續走自己的 vLLM」，走這條。

查現況：

```bash
hermes portal info    # 認證 + gateway 路由摘要
hermes portal tools   # 工具目錄與每個工具目前走誰
hermes status         # 全系統狀態，gateway 是其中一段
```

`hermes portal info` 會列出每個工具是「active via Nous subscription」還是走你自己的金鑰，這是唯一可靠的事實來源——設定檔看起來對不代表路由是對的。

## 最容易搞混的一條規則：優先序

每個工具的設定區塊都有一個 `use_gateway` 布林值：

```yaml
web:
  backend: firecrawl
  use_gateway: true
image_gen:
  use_gateway: true
tts:
  provider: openai
  use_gateway: true
browser:
  cloud_provider: browser-use
  use_gateway: true
```

優先序照官方寫法是：

> `use_gateway: true` routes through Nous **regardless of any direct keys in `.env`**. `use_gateway: false` (or absent) uses direct keys if available and only falls back to the gateway when none exist.

翻成人話：**開了 gateway，你 `.env` 裡的 `FIRECRAWL_API_KEY` 就等於不存在**，不是「先用自己的、用完才走 gateway」。反過來，關掉 gateway 之後金鑰會自動變回來源，所以不需要為了切換而刪金鑰。`hermes tools` 在你選非 gateway 供應商時會自動清掉這個旗標，多數人不用手改。

這條規則造成的典型困惑是：「我明明有付 Firecrawl，帳單怎麼還是全記在 Nous？」——因為 `use_gateway: true` 在同一格上贏。

## 混搭是預期用法

官方明講 gateway 是 per-tool 而非全有全無，並且列了三種常見組合：全部走 Nous；網頁與圖像走 gateway、TTS 留自己的 ElevenLabs；或「我已經付了 Browserbase，但不想再開一個 Firecrawl 帳號」。

換句話說，這東西的設計定位是**捷徑而不是鎖定**（"The gateway isn't a lock-in, it's a shortcut."）。要驗證這句話成不成立，看的是「切回自己的金鑰要花多少力氣」——這裡的答案是一個布林值，算誠實。

## 資格：付費才有，但可能有免費池

Tool Gateway 是**付費訂閱功能**。免費 Nous 帳號可以用 Portal 做推論，但不含代管工具。文件另外提到有些帳號會有 **free tool pool**——一小份代管工具額度，首次使用時 gateway 會跳提示讓你選擇加入。

還有一條常被誤會的界線：**Modal（serverless 終端後端）不在 Tool Gateway 套餐裡**，它是 Nous 訂閱下的選購 add-on，要另外用 `hermes setup terminal` 或改 `config.yaml` 設定。[終端後端那篇](/posts/ai/2026-08-18-hermes-agent-terminal-backends)會細講。

訂閱到期會怎樣？走 gateway 的工具直接停擺，直到你續訂或用 `hermes tools` 換回直連金鑰；Hermes 會給一個指向 portal 的明確錯誤。用量與成本可以在 Portal dashboard 按工具拆分查看。

## 自架與企業佈署

要跑自己的 Nous 相容 gateway，端點可以在 `~/.hermes/.env` 覆寫：

```bash
TOOL_GATEWAY_DOMAIN=your-domain.example.com
TOOL_GATEWAY_SCHEME=https
TOOL_GATEWAY_USER_TOKEN=your-token
FIRECRAWL_GATEWAY_URL=https://...   # 只覆寫單一端點
```

官方說這些旋鈕是給企業佈署與開發環境用的，一般訂閱者不會碰。值得注意的是它允許「只覆寫一個端點」，代表這層是可以拆開替換的，不是黑箱。

## 取捨怎麼看

好處很清楚：一份帳單、一次註冊、一把金鑰，而且因為 gateway 作用在**工具執行層**而不是 CLI，Telegram、Discord、API server 等所有介面都自動吃到。

代價也很清楚，而且官方不會替你講：**你把四條工具供應鏈集中到同一家**。Nous 出事、限流、改價、改模型清單，你的搜尋、生圖、語音、瀏覽器會一起受影響；而分開養四個帳號時，這四件事的故障是獨立的。九個圖像模型的清單也會變（官方自己寫 "The set evolves"），你的 prompt 綁在特定模型 ID 上就要跟著動。

我的建議是照重要性分層：**agent 壞掉會讓你交不出東西的工具，留一把自己的金鑰當退路；純加分的工具（生圖、TTS）走 gateway 省事。** 因為切換成本只是一個布林值，這個混搭策略幾乎沒有維護成本。

下一篇談[七種終端後端](/posts/ai/2026-08-18-hermes-agent-terminal-backends)——指令到底跑在誰的機器上。

## 參考資料

- [Hermes Agent — Nous Tool Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway)
- [Hermes Agent — Nous Portal 整合](https://hermes-agent.nousresearch.com/docs/integrations/nous-portal)
- [Nous Portal 訂閱管理](https://portal.nousresearch.com/manage-subscription)
- [Firecrawl](https://firecrawl.dev/)
- [FAL](https://fal.ai/)
- [Browser Use](https://browser-use.com/)
