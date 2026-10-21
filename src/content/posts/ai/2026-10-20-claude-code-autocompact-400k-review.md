---
title: "Claude Code 設 /autocompact 400k 用了 11 天：省 16–22% 額度，返工沒有變多"
date: 2026-10-20
category: ai
type: guide
tags: [claude-code, context-window, compaction, cost-optimization]
lang: zh-TW
tldr: "1M 模型的 auto-compact 預設要到約 967K tokens 才觸發，後段每則訊息都帶著近一百萬 tokens 的歷史。我照 Lydia Hallie 的建議設 /autocompact 400k 用了 11 天，額度省下約 16–22%，也沒看到模型因摘要掉細節而返工或被糾正的次數明顯增加。這是單人、單一任務類型的觀察，不是普遍結論。"
description: "Lydia Hallie 推廣的 /autocompact 400k 是什麼、怎麼設、為什麼能省額度，以及我實測 11 天的結果與該調大的情況。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-20-claude-code-autocompact-400k-review-en)

如果你用的是 1M context 的 Claude Code，這篇回答一個問題：要不要把 auto-compact 的門檻從預設值改成 400K。我的答案是要，而且 11 天的使用沒有出現我擔心的副作用；但有兩種情況不該照做，後面會講。

## 為什麼預設值會貴

Claude Code 在 1M context 的模型上，預設要等到約 967K tokens 才自動壓縮。問題不在壓縮那一次，而在壓縮之前：每一則訊息都會把整段對話歷史再送一次，所以對話長到 900K 時，你隨手回一句話，背後也是近一百萬 tokens 的請求。

Claude Code 團隊的 [Lydia Hallie 在 10 月 9 日的貼文](https://x.com/lydiahallie/status/2108624109538291901)把這件事講得很清楚，她也順手澄清了常見誤解：

- auto-compact 會做摘要。觸發時整段對話被換成一份短摘要，不會保留最後 1M tokens。
- 約 967K 這個數字只在 1M 模型上成立。
- 壓縮本身只是一次請求，讀取的量大約等於你壓縮前最後一則訊息，暖快取時大部分是 cache read。
- 歷史大部分走快取，單價低很多，所以快取是熱的時候通常還好；但這些 tokens 仍然計入用量，隨著對話變長會累積。

`/autocompact 400k` 的效果就是讓摘要在 400K 發生，每則訊息的上限砍到不到一半。她在貼文中說，這個問題是 @rohit3a 先發現的，她的貼文是後續說明。

## 怎麼設

在 Claude Code 裡直接輸入：

```text
/autocompact 400k
```

幾個設定時會用到的細節：

- 可接受的範圍是 100K 到 1M，`200000`、`500k`、`1M` 都能寫。超出範圍會報錯。
- 400K 只對 1M 模型有作用。Claude Code 取「設定值」與「模型 context 上限」中較小的那個，所以 200K 的模型設了也不會變。這點見 [SpecWeave 的整理](https://spec-weave.com/docs/guides/claude-code-auto-compact/)。
- 指令會把值存在使用者設定檔、依模型分開記（v2.1.288 起，之前是全模型共用一個值）。
- 想回到預設，執行 `/autocompact auto`。
- 單次啟動才想用，可以加旗標 `claude --autocompact 400k`。

四個來源同時存在時，優先順序由高到低是環境變數 `CLAUDE_CODE_AUTO_COMPACT_WINDOW`、啟動旗標、`/autocompact` 與設定檔、模型預設。環境變數最容易讓人困惑：只要它有值，`/autocompact` 就只會告訴你「被覆蓋了」而不會改動任何東西，而且它只吃純整數，寫 `500k` 會被讀成 500 再被拉到下限。如果設了卻覺得沒效果，先執行不帶參數的 `/autocompact`，它會顯示目前的窗口與來源。細節見 [wmedia.es 的拆解](https://wmedia.es/en/tips/claude-code-auto-compact-window)與[官方文件](https://code.claude.com/docs/en/context-window)。

## 我 11 天的結果

我在 Lydia 貼文出來後照她的建議改成 400k，連續用了 11 天，再回頭量測，結論有兩個：

1. **副作用很小。** 在我做的任務類型上，因為壓縮掉細節而讓模型返工、或需要我出手糾正的狀況，沒有明顯增加。
2. **額度省得很明顯。** 大約省下 16–22%。

另一個可對照的數字來自 [@wholyv 的推文](https://x.com/wholyv/status/2108393422658908495)：他事後估算，如果早點設 400k，大約能省下 29% 的每週用量。兩個數字的量測方式不同，不能直接比，但方向一致，量級也接近。

## 這個結論的邊界

**這是一個人、一種任務的觀察。** 我沒有對照組，樣本是 11 天，所以「副作用不顯著」比較像是「沒有被我注意到」，不是證明。你的工作如果是長時間追同一個複雜 bug、需要隔了幾百輪還要逐字回頭看早期輸出，結果可能不一樣。

**Claude Code 自己的建議是用 `auto`。** `/autocompact` 的說明文字寫著 auto 是為模型調過的窗口，「strongly recommended for the best cost and performance」，偵測到你覆寫時還會警告 "Overriding auto may result in high token usage, especially when resuming long sessions."（[出處](https://wmedia.es/en/tips/claude-code-auto-compact-window)）。道理是壓縮越早，發生得越頻繁，而每次壓縮都是一次要讀完整段歷史的請求。如果那時快取已經冷了（例如你離開座位很久才回來），這一次的成本就比暖快取時高。

所以 400k 不是永遠划算。它划算的前提是你的 session 夠長，常常超過 400K。社群轉述也提到，Claude Code 團隊是把 400K 當成實驗中的門檻，建議先從這裡開始，再依任務調整（[轉述](https://x.com/hqmank/status/2108852709205876971)）。

**摘要一定會掉東西。** 壓縮前的逐字內容變成摘要，工具輸出與中途推理都不會留下。

## 該怎麼用

1. 先執行 `/autocompact` 確認目前的值與來源，再決定要不要改。
2. 日常任務、session 常常拉很長的人，設 `/autocompact 400k`，用一兩週看額度消耗與返工狀況。
3. 需要回頭對照早期輸出的調查型工作，臨時改成 600k–700k，結束後再改回來。
4. 不要把需求與架構決策只放在對話裡。寫進 CLAUDE.md 或任務文件，關鍵行為用測試鎖住，摘要掉了細節時，模型還能從專案本身找回來。
5. 設了沒效果，先查 `CLAUDE_CODE_AUTO_COMPACT_WINDOW` 有沒有被別處設定。

## 參考資料

- [Lydia Hallie：auto-compact 與 /autocompact 400k 的說明（X，2026-10-09）](https://x.com/lydiahallie/status/2108624109538291901)
- [Kai：轉述 Claude Code 團隊的 400K 實驗門檻（X）](https://x.com/hqmank/status/2108852709205876971)
- [Lxyv：事後估算可省 29% 每週用量（X）](https://x.com/wholyv/status/2108393422658908495)
- [SpecWeave：Claude Code auto-compact——compact at 400K to save usage](https://spec-weave.com/docs/guides/claude-code-auto-compact/)
- [wmedia.es：Claude Code auto-compact——誰決定你的 context window](https://wmedia.es/en/tips/claude-code-auto-compact-window)
- [Claude Code 官方文件：Explore the context window](https://code.claude.com/docs/en/context-window)
