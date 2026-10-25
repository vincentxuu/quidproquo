---
title: "Gemini、Claude、ChatGPT、Grok 怎麼選：長影音、程式碼、X 即時搜尋與 App 平台"
date: 2026-10-25
type: deep-dive
category: ai
tags: [llm, gemini, claude, chatgpt, grok, multimodal, coding-agent]
lang: zh-TW
tldr: "兩小時的課程影片約 72 萬 token，Gemini 的 API 收得下，Claude 與 ChatGPT 的文件沒有列影片輸入；程式碼這條線 Claude 與 GPT 只差 0.8 分，該比的是速度與成本；X 輿情與代填結帳找 Grok，現成 App 與語音找 ChatGPT。"
description: "依任務比較 Gemini、Claude、ChatGPT、Grok：長影音理解、程式碼、X 即時搜尋與代辦結帳、App 平台與語音，每項附官方文件出處和一個今晚能做的測試。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-25-gemini-claude-chatgpt-grok-by-task-en)

Gemini、Claude、ChatGPT、Grok 是現在最常被放在一起比的四個 AI 助理。常見的講法是各家有一塊別人碰不到的地盤：Gemini 看長影片，Claude 寫程式，Grok 盯 X，ChatGPT 什麼都有。這些講法大多有官方文件撐腰，但「別人碰不到」說得太滿，有幾處要修正。

這篇按任務排：你手上是一部課程影片、一個 repo、一串 X 貼文，還是一張要結帳的購物車，各自先開哪一家。寫作與一般問答沒有公開基準可核對，這篇不比。下表是結論，後面每節附出處和一個今晚能做的測試。

| 你手上的任務 | 先開哪一家 | 依據 | 先別假設的事 |
|---|---|---|---|
| 1–3 小時的影片或課程，要帶時間戳的筆記 | Gemini | API 文件：音訊與畫面一起處理，可用 `MM:SS` 指定時間點 | Claude 與 ChatGPT 的文件沒有列影片輸入 |
| 修 bug、重構整個 repo | Claude 與 ChatGPT（Codex）各跑一次 | Vals AI 榜上 97.00% 對 96.20% | 分數差距小，耗時與成本差得多 |
| 查 X 上的輿情、某個帳號最近說了什麼 | Grok | `x_search` 工具：關鍵字、語意、使用者搜尋 | 只涵蓋 X |
| 讓 AI 代填登入資料與信用卡去結帳 | Grok Bot | 2026-10-23 加入的 Vault | 才上線兩天，先用有額度上限的卡 |
| 串現成 App、做語音客服 | ChatGPT | Apps SDK 與 Realtime API | 對話內購物已改走零售商 App |

## 長影音：Gemini 把音訊與畫面一起讀

[Gemini API 的影片文件](https://ai.google.dev/gemini-api/docs/video-understanding)寫得很具體：模型同時處理音訊與畫面，每秒影片在預設解析度下約 100 個 token。兩小時的課程約 72 萬 token。文件寫明，百萬 token 級 context 的模型，預設解析度下最長可處理 3 小時，改用高解析度會縮短。

公開的 YouTube 網址可以直接貼，不用先下載。要問某個時間點的內容，用 `MM:SS` 的格式寫進提示。文件的範例把文字提示放在影片之後：

```python
from google import genai

client = genai.Client()
interaction = client.interactions.create(
    model="gemini-3.8-flash",
    input=[
        {"type": "video", "uri": "https://www.youtube.com/watch?v=<影片 ID>"},
        {
            "type": "text",
            "text": "整理成課程筆記。每個主題附 MM:SS 時間戳，並說明投影片上的圖表在講什麼。",
        },
    ],
)
print(interaction.output_text)
```

超過 5 到 10 分鐘的長影片，文件建議在影片那一項加上 `"processing": "agentic"`。這個[模式](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-agentic-video-in-gemini/)讓模型先看逐字稿，只載入需要的畫面，token 最多省 88%，準確度也略高；短片反而可能更慢、更耗 token。只有部分新型號支援，名單見文件。這個模式處理時間較長，文件建議同時設 `background=True`。預設每秒取一幀，會漏掉快速動作，需要逐格檢查時可以用 `fps` 自訂取樣率。

Claude 與 ChatGPT 這邊，[Claude 的 Vision 文件](https://platform.claude.com/docs/en/build-with-claude/vision)列出的格式是 JPEG、PNG、GIF、WebP，GIF 動畫只取第一幀；[OpenAI 的模型頁](https://developers.openai.com/api/docs/models)寫最新模型支援文字與圖片輸入、文字輸出。兩家的文件都沒有影片輸入，同一部課程得自己先處理：每隔幾秒抽一張投影片截圖，加上逐字稿一起送。

所以「長影音是 Gemini 專屬」只對一半。長影片基準 [Video-MME](https://github.com/MME-Benchmarks/Video-MME) 的做法是把影片抽幀再餵給模型，OpenAI 在 GPT-4.1 與 GPT-5 的發布文裡也拿它當成績單。Gemini 的差異在流程：整支影片檔連音訊一次送進 API，其他兩家要先自己抽幀、轉逐字稿。

各家榜單怎麼互相打臉，見[多模態模型盤點](/posts/ai/2026-08-18-multimodal-models-2026-landscape)。

**今晚能做的測試：**挑一部你真的需要看的 2 小時課程，用上面的程式碼跑一次，抽三個時間戳回原影片對，看筆記裡的時間點和投影片內容有沒有對上。

## 程式碼：Claude 與 ChatGPT 差的是耗時與成本

[Vals AI 的 SWE-bench Verified 榜](https://www.vals.ai/benchmarks/swebench)用同一套最簡 harness（mini-swe-agent，只給 bash 一個工具）測所有模型。Claude 與 GPT 的旗艦分數貼得很近，Vals 已經把這個榜封存，理由是分數飽和，新模型不再跑。

| 模型 | SWE-bench Verified | 每題平均耗時 | 每題成本 |
|---|---|---|---|
| Claude Opus 5 | 97.00% | 約 9 分 37 秒 | 1.29 美元 |
| GPT-5.6 Sol | 96.20% | 約 3 分 2 秒 | 1.15 美元 |

差距只有 0.8 分，耗時卻差了三倍，這兩欄對決定的影響比分數大。

榜上第四名是 Grok 4.6，Gemini 3.7 Flash 則落在 80.80%。程式碼這條線 Grok 不是弱角，Gemini 的 Flash 系列落後一截。

分數也跟 harness 綁在一起。同樣是 Claude Opus 4.8，換成 Claude Code 之後比 mini-swe-agent 低了近 3 分。榜單只能告訴你模型大概在哪一級，不能預測你換成 [Claude Code](/posts/ai/2026-04-02-agent-cli-claude-code) 或 [Codex](/posts/ai/2026-04-02-agent-cli-openai-codex) 之後的結果。

**今晚能做的測試：**拿自己 repo 最近三個已修好的 issue，各自退回修好之前的 commit，把 issue 描述原封不動貼給 Claude Code 與 Codex，記三件事：測試過不過、改了幾個檔、花了多久。三題跑完，哪一個在你的程式碼庫上比較順就很清楚了。

## X 即時搜尋與代辦：Grok

xAI 的 API 把 X 搜尋做成獨立工具 [`x_search`](https://docs.x.ai/developers/tools/x-search)：關鍵字搜尋、語意搜尋、使用者搜尋，還能抓整串討論。用 `allowed_x_handles` 可以只看指定帳號，用 `from_date` 與 `to_date` 限定日期，也可以打開貼文裡圖片與影片的理解。計費是每千篇貼文 5 美元，另加 token 費用，所以一次抓 200 篇的貼文費用約 1 美元。

**今晚能做的測試：**把想盯的題目寫成一句話，加上最近一週的日期區間跑一次，看引用的貼文是不是你要追的那批人。

代辦那一側是另一個產品。[Grok Bot](https://x.ai/changelog/bot) 可以在 Slack 與 Email 裡運作，有自己的電腦，也能排定 routines。

2026-10-23 的更新加入 Vault：Bot 可以把登入資料、信用卡與聯絡資訊存進 Settings 裡的 Vault，登入或結帳時代填。

Vault 需要 Grok Bot 0.75.2 以上。前一天的版本已加上 Shop Pay，商店支援就走 Shop 結帳，不支援就用一次性的 Shop 卡。付款時，Bot 會用一張卡片問你怎麼付，核准卡片會標示不可逆或敏感的動作；你拒絕之後，Bot 會停下來，直到你再傳訊息。我會先存一張有額度上限的虛擬卡，叫 Bot 買一樣便宜的東西，全程看著核准卡片長什麼樣子，再決定放不放手。

這個 Vault 和 [Grok Enterprise 的 Vault](https://x.ai/news/grok-business)是兩件事。後者是企業版的加購項目，提供獨立的資料平面與客戶自管的加密金鑰（CMEK），和代填結帳無關。

iPhone 上，RoutineHub 的熱門 [Grok 捷徑](https://routinehub.co/shortcut/21828/)說明了兩條路：走免費 Grok App 的「Ask Grok」動作只能純文字，作者自己註明可靠度較低；填入 xAI API 金鑰才有對話保存與圖片、影片生成。要靠捷徑做自動化，走 API 金鑰那條。

## 平台與語音：ChatGPT

OpenAI 在 2026 年二月公布 ChatGPT 的[週活躍使用者達 9 億](https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users/)。這個規模是它對開發者最大的賣點：[Apps SDK 的發布文](https://openai.com/index/introducing-apps-in-chatgpt/)直接寫「reach over 800 million ChatGPT users」。

Apps SDK 建在 MCP 上，再往上加一層：開發者可以定義 App 在對話裡的互動介面。工具連接本身不需要 ChatGPT，[MCP](/posts/ai/2026-03-22-mcp-model-context-protocol) 是開放標準，同一個 MCP server 其他客戶端也能用。ChatGPT 多出來的是兩樣東西，一個是對話裡的互動介面，一個是它的使用者。

語音方面，[Realtime API](https://openai.com/index/introducing-gpt-realtime/) 在 2025-08-28 正式上線。它用單一模型直接處理音訊，不再串語音轉文字和文字轉語音，並支援遠端 MCP server、圖片輸入與 SIP 電話。圖片輸入的做法是把一張圖放進對話，不是即時影片串流，由你的應用程式決定何時給模型看什麼。

購物的路線變過一次。[Instant Checkout](https://openai.com/index/buy-it-in-chatgpt/) 在 2025-09-29 上線，美國使用者可直接在對話裡向 Etsy 賣家買單品，背後是和 Stripe 共同制定的 Agentic Commerce Protocol。

據結帳基礎設施公司 [Rye 在 2026-03 的整理](https://rye.com/blog/openai-chatgpt-checkout-agentic-commerce)，OpenAI 已從搜尋結果直接結帳，轉向 Instacart、Target 等零售商 App 內結帳。和 Grok Bot 對照：ChatGPT 的結帳要商家先接上協定，Grok Bot 則由 Bot 用自己的電腦在網站上代填。

**今晚能做的測試：**想知道值不值得做 ChatGPT App，先看你的服務有沒有現成的 MCP server。有的話，Apps SDK 只是在上面加一層介面；沒有，先做 MCP server，其他客戶端也用得上。

## 整體來說

四家各有一條能用官方文件講清楚的主線：Gemini 的影片檔流程，Claude 與 GPT 在程式碼上的拉鋸，Grok 的 X 搜尋與代填結帳，ChatGPT 的 App 平台與語音。沒有一家通吃，比較實際的做法是按任務路由，就像多模態那篇的結論。

這篇的型號、分數與版本都是 2026-10-25 的狀態，Vault 和 Instant Checkout 這類功能一個月內就可能再變。每次要把任務交給某一家之前，用上面的小測試跑一次，比相信任何一張榜單可靠。

## 參考資料

- [Video understanding - Gemini API](https://ai.google.dev/gemini-api/docs/video-understanding)
- [Introducing agentic video understanding with Gemini - Google Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-agentic-video-in-gemini/)
- [Video-MME - GitHub](https://github.com/MME-Benchmarks/Video-MME)
- [Vision - Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/vision)
- [Models - OpenAI API](https://developers.openai.com/api/docs/models)
- [SWE-bench Verified Leaderboard and Methodology - Vals AI](https://www.vals.ai/benchmarks/swebench)
- [X Search - xAI Docs](https://docs.x.ai/developers/tools/x-search)
- [Grok Bot Changelog - xAI](https://x.ai/changelog/bot)
- [Introducing Grok Business and Grok Enterprise - xAI](https://x.ai/news/grok-business)
- [Grok AI Chat Shortcut - RoutineHub](https://routinehub.co/shortcut/21828/)
- [ChatGPT reaches 900M weekly active users - TechCrunch](https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users/)
- [Introducing apps in ChatGPT and the new Apps SDK - OpenAI](https://openai.com/index/introducing-apps-in-chatgpt/)
- [Introducing gpt-realtime and Realtime API updates - OpenAI](https://openai.com/index/introducing-gpt-realtime/)
- [Buy it in ChatGPT: Instant Checkout and the Agentic Commerce Protocol - OpenAI](https://openai.com/index/buy-it-in-chatgpt/)
- [OpenAI Scales Back ChatGPT Checkout - Rye](https://rye.com/blog/openai-chatgpt-checkout-agentic-commerce)
