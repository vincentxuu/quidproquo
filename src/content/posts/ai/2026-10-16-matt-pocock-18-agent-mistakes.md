---
title: "Agent 時代，你可能累錯地方了：Matt Pocock 的 18 條錯誤清單怎麼讀"
date: 2026-10-16
type: deep-dive
category: ai
tags: [coding-agent, agent-skills, harness-engineering, context-engineering, matt-pocock]
lang: zh-TW
tldr: "Matt Pocock 在 X 貼出 18 條「你可能正在犯的錯」，只有標題沒有說明。照他公開的 skills 與演講分成五組：驗證、放手、context、對齊、思考。其中六條直接對應 /retro 的檢查類別，今晚就能拿一次 session 試。"
description: "把 Matt Pocock 10 月 13 日的 18 條 coding agent 錯誤清單分成五組，對照他的 skills、Pragmatic Engineer 訪談與 /retro，附自我診斷與今晚能做的三步。"
draft: false
glossary:
  - term: "retro"
    aliases: ["/retro"]
    definition: "Matt Pocock skills 專案裡的 skill：讀一次 coding session，提議如何改善 agent 的工作環境（導覽、自動化檢查、coding standards、指示檔、工具耗費、資訊取得），只提議、不套用。"
    context: "本文用它示範怎麼把清單上的錯誤，變成下一次不再犯的檢查。"
  - term: "tautological test"
    aliases: ["恆真測試"]
    definition: "怎麼寫都會通過的測試，例如實作把上限設成 280，測試就斷言上限是 280，實作寫錯也抓不到。"
    context: "本文用它說明「架構讓爛測試有機會被寫出來」是什麼意思。"
---

> 🌏 [English version](/posts/ai/2026-10-16-matt-pocock-18-agent-mistakes-en)

如果你天天跟 coding agent 工作，還是覺得累，這篇想給你一張自我診斷表：Matt Pocock 這份 18 條清單怎麼分組、每組對應他公開過的什麼做法，以及今晚該先動哪一條。

## 這份清單是什麼

[Matt Pocock](https://x.com/mattpocockuk) 是 [Total TypeScript](https://www.totaltypescript.com/) 的作者，這一年多在教人用 coding agent。他的 [skills 專案](https://github.com/mattpocock/skills)以 MIT 授權公開，2026 年 2 月建立，現在有超過 29 萬顆星；README 說這些是他每天拿來做「real engineering, not vibe coding」的 skill。

10 月 13 日他在 X 貼出[這份清單](https://x.com/mattpocockuk/status/2109973273924579720)：18 行，每行一句「你……太……」，沒有任何說明。所以下面的分組是我的讀法，每組背後的做法則來自他的 skills 專案、[Pragmatic Engineer 訪談](https://newsletter.pragmaticengineer.com/p/ai-skills-with-matt-pocock)，以及他在 AI Engineer 演講的[二手整理](https://finance.biggo.com/news/4884c941b185405c)。

| 組 | 清單裡的條目 | 一句話 |
|---|---|---|
| 驗證 | 自動化檢查太鬆、自動化 review 做太少、agent 無法驗證自己的工作、架構讓爛測試有機會被寫出來、沒用 agent 回顧之前的 session | agent 寫得越快，卡關的地方越往「驗」移 |
| 放手 | effort 太高、人工 review 太多、vibe coding 的 prototype 太少、盯 agent 盯太緊 | 人從逐行盯著，退到設計檢查機制 |
| context | skill 太長、自訂工具太耗 token、全域指示檔塞太多、codebase 難找東西 | agent 的注意力是預算 |
| 對齊 | 開工前沒對齊、對齊太頻繁太用力 | 前面重、中間輕 |
| 思考 | 沒有共同語言、策略想得不夠、想得不夠多 | agent 接走戰術，腦力留給高層 |

## 兩個容易讀歪的地方

**成對的條目是故意相反的。** 「開工前沒對齊」和「對齊太頻繁」、「自動化 review 做太少」和「人工 review 做太多」並排出現。答案不在任何一端，而在力氣該放哪一段。

**「effort」和「想得不夠多」說的是不同的人。** 這條原帖一句話沒展開；在 agent 工具裡 effort 通常指模型的推理強度設定，我照這個意思讀：agent 不必每題都想得那麼久，你自己卻該多想一點。這也是第一條和最後一條看起來矛盾、其實不矛盾的原因。

## 驗證：卡關的地方移到後面

這組有五條，是整份清單的重心。Pocock 在演講裡把問題講成「slop cannon」：agent 產出 PR 的速度超過任何人能讀的速度。他的解法是三層由便宜到貴的煞車：自動化檢查只花 CPU，自動化 review 補檢查漏掉的，人工 review 只留給真正重要的變更。

「檢查太鬆」不只是沒有 lint。演講整理列了三種 agent 寫出來的爛測試：實作把上限設成 280、測試就斷言 280（恆真測試）；測試去讀原始碼斷言段落順序，重新排版就壞；測試把 `AudioContext` 整個 stub 掉，永遠不會失敗。「架構讓爛測試有機會被寫出來」對應的解法是 Ousterhout 的 deep module：介面小、實作深，測試寫在介面上，就少了綁死結構的測試。

「agent 無法驗證自己的工作」在 README 裡是第三個問題：沒有回饋，agent 是盲飛。他要的是靜態型別、瀏覽器存取與自動化測試。訪談裡他也說，現在更常要求 agent 交出程式有用的證據，不一定走 TDD。

最後一條「回顧之前的 session」就是 [`/retro`](https://github.com/mattpocock/skills/blob/main/skills/engineering/retro/SKILL.md)，9 月 24 日才從試驗區移進正式的 engineering 分類。

## 放手：把盯著的力氣換成檢查機制

演講裡他用 AWS 的說法分「單向門」和「雙向門」：多數 PR 合併後還能 revert，輕輕看就好；寄出六萬封信、昂貴的 migration、資料遺失這類才值得逐行讀。同一場演講的另一個主張是 reviewer agent 應該直接 commit 修正，不要只留評論，因為留評論只是把工作丟回給人。

「prototype 太少」對應 [`prototype`](https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/SKILL.md) skill：寫一個用完就丟的版本回答一個設計問題。這跟上一組不矛盾，邊界是會不會合併：丟掉的程式不需要嚴格檢查，進主線的才需要。

## context：把注意力當預算

這組四條，Pocock 的 `/retro` 都有對應的檢查類別：指示檔、工具耗費、導覽。`/retro` 的說明寫得很直接：`CLAUDE.md`／`AGENTS.md` 會被推進每個 agent 的 context，應該「極度節制」，通常只放指向其他檔案的導覽指標。coding standards 則放進 review 時才讀的檔案，不要塞給實作的 agent，因為它已經同時在探索、改檔與除錯。

這也是他把 skill 做得小的原因：README 的說法是「small, easy to adapt, composable」。

## 對齊：前面重、中間輕

README 把「agent 沒做我要的」列為第一個失敗模式，解法是 [`/grill-with-docs`](https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md)，讓 agent 先逐題問你，並建議每次要改東西都用。另一頭，「對齊太頻繁」的例子可以看 Daniel Mackay 整理的[工作流程選擇](https://www.dandoescode.com/blog/matt-pococks-skills-choosing-the-right-workflow)：一個 session 做得完的工作，不需要為了保險再補一份 spec。要不要多一道對齊，看這件事一個 context window 裝不裝得下。

## 思考：共同語言是最便宜的壓縮

README 的例子是把「一個 lesson 在 course 的 section 裡被『真正建立』，也就是有了檔案系統位置」這整句話，壓成一個詞：materialization cascade。詞彙記在 `GLOSSARY.md`，命名一致、codebase 更好找，agent 思考時也更省 token。他在訪談裡的比喻是《記憶拼圖》：agent 每天醒來都不記得你，所以 codebase 要為「每次都是新人」而優化。

## 一個具體例子：從爛測試到下一次不再犯

假設 review 時你看到 agent 寫了「上限 280、測試斷言 280」的測試。

1. 先分類：這是固定樣式的機械錯誤，還是要判斷的品味？`/retro` 的規則是機械錯誤一律做成確定性檢查（自訂 lint 規則、pre-commit、CI），只有判斷題才寫進 `CODING_STANDARDS.md` 讓 reviewer 讀。
2. 恆真測試很難用 lint 抓，所以寫成 coding standard：「斷言要來自需求，不要抄自實作」。
3. 下次 review agent 自己抓到，你就不用再寫同一條評論。Pocock 的原話是「你不想把同一條評論寫兩次」。

## 限制

- 清單沒有說明、沒有優先順序，它是診斷表，不是處方。分組與各條的解讀，是我拿他公開的做法拼出來的。
- 演講部分我讀的是二手整理，引用時以整理為準。
- `/retro` 只提議、不套用；Mackay 提醒它會為了湊類別編出泛泛的建議，追不回 session 裡某個具體時刻的就丟掉。
- skills 更新很快，Mackay 的文章寫的是 v1.3.1；指令名稱與分類可能再調整，安裝前先看 README。

## 怎麼用：今晚三步

1. 18 條各打一個勾或叉，只挑最痛的兩條，不要全改。
2. 挑一次剛做完的 session：用 `claude plugin install mattpocock-skills@claude-plugins-official` 安裝，在 repo 跑一次 `/setup-matt-pocock-skills`，再執行 `/retro`。沒有 Claude Code 就手動請 agent 照 `/retro` 的七個類別讀 session 紀錄。
3. 找出你最近重複寫過的 review 評論，把一條變成檢查（lint、型別或測試），而不是再叮嚀一次。

如果你想把「驗」這一半系統化，站外有一門講同一個瓶頸的課：[GenAI 時代下的測試管理](https://agile3uncles.com/products/t004/)（敏捷三叔公，2026/11/22），課程介紹把重點放在瓶頸從「寫程式」移到「驗證與信任」。這是另一位講師的課程，不是 Pocock 的內容。

站內相關：[Poteto 的信任階梯：先讓 agent 能自己驗證，再談放手](/posts/ai/2026-10-07-poteto-trust-ladder-verification-first)、[pstack 怎麼用](/posts/ai/2026-10-16-pstack-cursor-agent-skills-guide)。

## 參考資料

- [Matt Pocock 的 18 條清單（X，2026-10-13）](https://x.com/mattpocockuk/status/2109973273924579720)
- [mattpocock/skills（GitHub，MIT）](https://github.com/mattpocock/skills)
- [retro SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/retro/SKILL.md)
- [AI Skills with Matt Pocock（The Pragmatic Engineer，2026-09-17）](https://newsletter.pragmaticengineer.com/p/ai-skills-with-matt-pocock)
- [Matt Pocock: The Fix for AI's 'Slop Cannon' Is Teaching Your Reviewer to Commit（BigGo Finance，演講二手整理）](https://finance.biggo.com/news/4884c941b185405c)
- [Matt Pocock's Skills: Choosing The Right Workflow（Dan Does Code）](https://www.dandoescode.com/blog/matt-pococks-skills-choosing-the-right-workflow)
- [GenAI 時代下的測試管理（敏捷三叔公）](https://agile3uncles.com/products/t004/)
