---
title: "AI Agent GitHub Digest — 2026-10-07"
date: 2026-10-07
category: daily
tags: [ai-agent, github, open-source, daily, coding-agent, rag, fine-tuning]
lang: zh-TW
description: "四個上升的 repo 不比模型聰明，比的是周邊執行層——把工程判斷嵌進 coding agent 的執行流程、把一個新 coding agent 包成手機能用的多人協作殼、把模型微調變成一段對話、把長文件搜尋從向量資料庫換成機率選擇"
tldr: "**Autoloom**（256★）把 Aegis 的工程治理方法包進 coding agent 的執行流程，底層跑在 DeepSeek 官方開源的 DeepSeek Harness 上；**pi-pocket**（136★）是給新 coding agent 「Pi」在剛發布的 Pi Durable 這套可持久 harness 上做的手機／網頁多人協作殼；**brewery-ai**（193★，前身 Homebrew）用一段對話帶你完成模型微調全流程，授權是 MIT 加商業營收門檻；**jev-doc-search**（99★）不用向量資料庫、不算 embeddings，靠 TypeSafe 的機率決策模型 Jev 配合 PageIndex 的樹狀索引做長文件搜尋。Claude Code 2.1.291 修了兩個會丟訊息、丟權限回覆的 regression。"
series:
  name: "AI Agent GitHub Digest"
  order: 53
---

> 🌏 [English version](/en/posts/daily/2026-10-07-ai-agent-github-digest-en)

## 今日亮點

今天上升的幾個 repo 有個共同點：沒有一個在比模型本身聰不聰明，全部在改模型外面那層——把工程判斷做成 coding agent 執行期的檢查點、把一個剛冒出來的 coding agent 包成手機也能用的多人協作殼、把模型微調收進一段對話、把長文件搜尋從「切 chunk、算向量」換成「丟給模型選一個答案」。决定一般人用不用得起 agent 的，往往是这些不碰模型本身的部分。

## Trending Repos

### Autoloom ⭐ 256（上線 7 天）

[GitHub](https://github.com/GanyuanRan/Autoloom)　·　JavaScript　·　Other（原始碼公開，非標準授權）

- **是什麼**：一個免費桌面客戶端，把開源方法包 Aegis 的四組工程判斷——改動前先問有沒有必要、複雜度加得有沒有道理、失敗後先找因果再動手、交付前對照需求列出還沒驗證的部分——直接嵌進 coding agent 的執行流程，而不是寫在 system prompt 裡提醒。底層跑在 DeepSeek 官方開源的 DeepSeek Harness 上。
- **為什麼值得看**：多數「讓 agent 寫得更好」的做法是加更長的 prompt 或更多範例，Autoloom 反過來把判斷步驟變成執行期真的會卡住你的檢查點，而且每一步的治理紀錄都留著可以回頭查，不是做完就沒了。缺點是目前只有 Windows x64 Alpha，要先搞懂 Aegis 的方法在管什麼，才看得懂它在每個節點插進來的提示是為什麼。
- **Tech stack**：DeepSeek Harness（含 Cordis plugin 機制）+ Aegis 工程方法包 + 桌面客戶端
- **上手難度**：中——只有 Windows x64 Alpha，且要先理解 Aegis 四組方法的定位才看得懂它在幫你擋什麼。

---

### pi-pocket ⭐ 136（上線 3 天）

[GitHub](https://github.com/TannerMidd/pi-pocket)　·　TypeScript　·　MIT

- **是什麼**：給 Pi（Earendil 做的 coding agent）用的手機／網頁殼，建在 Earendil 剛發布的 Pi Durable 這套「可持久、可從任何介面接上」的 harness 上。每個 model call、tool call、subagent 都落地存起來，斷線重啟接著跑而不是重來；多人可以同時看同一個 session，各自標記、各自接話，手機上還能直接開一個真的 Chromium 看 agent 在瀏覽器裡做什麼。
- **為什麼值得看**：多數 coding agent 的手機支援做法是「把終端機搬到手機上」，pi-pocket 先把底層換成不怕斷線的 durable harness，再在上面做出分支（fork）、排程（`/schedule every weekday 8:00 ...`）、計畫模式這些原本只有桌面版才有的功能，手機只是其中一個接口而已，不是閱讀 agent 輸出用的簡化版。
- **Tech stack**：Pi Durable（durable harness）+ Node.js 22.19+ + PWA
- **上手難度**：中——要先裝好 Pi 本體並登入 provider，伺服器可以跑在自己機器或手機的 Termux 上，連線用的網址本身就是帳號金鑰，要保管好。

---

### brewery-ai ⭐ 193（上線 3 天，前身 Homebrew）

[GitHub](https://github.com/empero-org/brewery-ai)　·　Python　·　Brewery License（MIT 加商業營收門檻，月營收超過 200 萬美元才需要另外談授權）

- **是什麼**：一個對話式的微調 agent。你跟一個叫「brewmaster」的 AI（可選 Claude、任何 OpenAI 相容模型或本地模型）聊，它一路帶你決定要微調什麼行為、選哪個 base model、去哪裡找資料、挑安全的超參數、在自己的 GPU 或租來的伺服器上跑訓練，最後把結果連同模型卡發佈到 Hugging Face。
- **為什麼值得看**：微調本身的步驟沒有變，但「這個超參數範圍安不安全」「這個 LoRA 大概要跑多久、多貴」這些得查文件才知道的知識，收進對話裡隨時能問，而且每個模型都附超參數準則，agent 只能在準則範圍內提方案，不是自己亂猜。附的兩個示範模型都是一次會談、一張租來的 GPU 做完，訓練全程跟資料來源寫得清清楚楚，等於順便示範了一份可信模型卡該長怎樣。
- **Tech stack**：Qwen3.5／Llama 3.x／Gemma 系列的 LoRA、QLoRA、全參數微調 + 自家 ETF 統一資料格式 + Runpod／Vast.ai 租卡教學
- **上手難度**：低——一段對話就能跑完整流程，但實際訓練仍要自己的 GPU 或付費租伺服器，免費的只是 agent 本身。

---

### jev-doc-search ⭐ 99（上線 7 天）

[GitHub](https://github.com/VectifyAI/jev-doc-search)　·　Python　·　Apache-2.0

- **是什麼**：長文件搜尋，不用向量資料庫，也不算 embeddings。做法是把「哪一頁回答了這個問題」當成一道選擇題，用 TypeSafe 的機率決策模型 Jev 直接讀文件選答案；文件太長、選項太多（超過 255 頁或 7 萬多 token）時改用 PageIndex，把文件拆成樹狀結構，一層一層先選 section 再選 page，每層都只是個幾選一的小決定。
- **為什麼值得看**：傳統 RAG 的直覺是先切 chunk、算 embedding、存向量庫、算相似度，這個做法整段跳過，直接把「哪一頁」當成一個選項有限的決策問題丟給模型。巧合的是，同一週 DSPy 3.4.0 的重點功能也是透過同一個 TypeSafe 的 Jev 做「帶機率信心的決策輸出」，兩邊從不同方向在推同一套「讓模型回答機率而不是純文字」的用法。
- **Tech stack**：TypeSafe Jev（決策型模型）+ PageIndex（文件樹狀索引服務）+ pypdf
- **上手難度**：中——兩邊都是外部 API（需要 `TYPESAFE_API_KEY` 和 `PAGEINDEX_API_KEY`），適合先在短 PDF 上跑過範例腳本，再接自己的文件。

## Notable Releases

### Claude Code v2.1.291

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.291)

- **重要變更**：修掉 2.1.290 引入的一個 regression——雲端 session 有機率丟掉使用者對 permission prompt 的回覆；也修掉 2.1.288 以來的另一個 regression——結束 session 時最後幾則訊息可能遺失。
- **Breaking Changes**：無
- **對你的影響**：如果這幾天在雲端跑過 session，或遇過結束時訊息消失，升級到 2.1.291 兩個都修了；沒遇到這些症狀可以不急著升。

---

## 今日收穫

之前以為 agent 生態的進展主要看模型或框架的大版本號；這幾天看下來，真正在動的反而是「周邊」——把工程判斷做成執行期的檢查點、把一個新冒出來的 coding agent 包成手機能用的多人殼、把微調做成一段對話，這些都不碰模型本身，卻直接決定一般人用不用得起 agent。順便發現「讓模型輸出機率而不是純文字」這個想法，現在同時從 RAG（jev-doc-search）和 DSPy 兩個不相干的方向冒出來，可能比想像中更快變成一個通用模式。

## 參考資料

- [GanyuanRan/Autoloom](https://github.com/GanyuanRan/Autoloom)
- [TannerMidd/pi-pocket](https://github.com/TannerMidd/pi-pocket)
- [Pi Durable — Earendil](https://earendil.com/posts/pi-durable/)
- [empero-org/brewery-ai](https://github.com/empero-org/brewery-ai)
- [VectifyAI/jev-doc-search](https://github.com/VectifyAI/jev-doc-search)
- [DSPy 3.4.0 Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.0)
- [GitHub Trending（daily）](https://github.com/trending?since=daily)
- [Claude Code v2.1.291 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.291)
