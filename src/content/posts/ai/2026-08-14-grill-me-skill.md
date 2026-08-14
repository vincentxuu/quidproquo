---
title: "grill-me：讓 agent 反過來拷問你，把模糊想法逼成能承諾的決策"
date: 2026-08-14
category: ai
type: deep-dive
tags: [claude-code, agent-skills, prompt-engineering, spec-driven, context-engineering]
lang: zh-TW
tldr: "Matt Pocock 的 grill-me 現在全文只有一行「Run a /grilling session」，真正的機制在 grilling：把主題建模成決策樹，每輪只問「前緣」上彼此不相依的問題，13 題約 3 輪問完，前緣清空後還要你確認共識才准動工。"
description: "拆解 grill-me 與 grilling 兩個 skill 的原始碼與設計：四行舊版與現行 primitive 的差異、design tree / frontier / round 三個概念、事實與決策的分工、確認閘門，以及被動點頭與 ungrillable 兩個公認失效模式。"
draft: false
glossary:
  - term: "frontier"
    aliases: ["前緣"]
    definition: "決策樹上「前置條件都已解決」的那一圈決策——也就是此刻能誠實提問、不必先猜別的答案的問題集合。"
    context: "grilling 每一輪就是把整個 frontier 一次問完，你答完後重算，前緣往外推。"
  - term: "ungrillable"
    definition: "談不出答案的問題，例如「這個互動應該是什麼感覺」——需要有東西可以反應才能決定。"
    context: "官方建議撞到這種問題就停止 grilling，先做拋棄式原型，再回來一行答完。"
  - term: "disable-model-invocation"
    definition: "Agent Skill frontmatter 欄位，設為 true 時該 skill 只能由使用者手動觸發，模型不會自己叫用。"
    context: "grill-me 用它把自己鎖成純手動入口，底下的 grilling 則保持 model-invoked。"
---

> 🌏 [English version](/posts/ai/2026-08-14-grill-me-skill-en)

大多數 agent skill 是在教 agent 怎麼做事，[grill-me](https://www.aihero.dev/skills-grill-me) 反過來：整場都是它在問你問題，一行程式都不寫、一個檔案都不產。它處理的是動手之前那段——你有個「大概知道要幹嘛」的想法，但講不清楚細節，於是讓 agent 一路逼問到你能承諾為止。這篇拆解它的實際原始碼（現行版全文只有一行）、底下 `grilling` primitive 的 round／frontier 機制，以及兩個官方自己承認的失效模式。

## 原始版本：四行 prompt 就爆紅

[Matt Pocock](https://www.aihero.dev/my-grill-me-skill-has-gone-viral) 最早公開的 `grill-me` 全文是這樣：

```md
---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared
understanding. Walk down each branch of the design tree, resolving dependencies
between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.
```

四個約束撐起整個 skill：一次一題、每題附上「我建議的答案」、能自己查的別問人、沿決策樹逐一解依賴。Matt 自己指出最後一條建議答案是後補的：

> "This skill is incredibly short - just a few lines that pack a powerful punch. I recently added the 'provide your recommended answer' line. When the AI asks a question with an obviously good answer, it now recommends that answer."
> —— [My 'Grill Me' Skill Went Viral](https://www.aihero.dev/my-grill-me-skill-has-gone-viral)

差別在於你多半只要回「yes」，不必每題重新解釋一遍。他說這種 session 通常跑約 45 分鐘，本質上就是把過去工程師的橡皮鴨（rubber ducking）自動化——差別是這隻鴨子會回嘴。

## 改版後：grill-me 只剩一行

現在 [mattpocock/skills](https://github.com/mattpocock/skills) repo 裡的 `grill-me`，全文是這樣：

```md
---
name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true
---

Run a `/grilling` session.
```

（本文對照 2026-08-13 的 `main`。這個 repo 還在密集改動，各檔最後更動時間：`grill-me/SKILL.md` 停在 2026-06-12，`grilling/SKILL.md` 的 round 化改寫在 2026-07-31 落地，官方使用說明最後改於 2026-08-06。）

兩個設計決定藏在這五行裡。

`disable-model-invocation: true` 表示**只有你打 `/grill-me` 才會觸發，agent 永遠不會自己叫它**。這對一個「會問你四十題」的 skill 是必要的：你不會希望它在你趕著修 bug 的時候跳出來要求對齊願景。

而真正的邏輯被抽到 `grilling` 這個 primitive，官方把它定位成訪談技術唯一的權威版本（single source of truth），讓 `grill-with-docs`、`wayfinder`、`triage` 都去呼叫它，而不是各自發明一套訪談。代價是：**只裝 `grill-me` 不裝 `grilling` 會空轉**。官方文件把徵兆講得很明確——「一次問一大堆問題、而且沒有附建議答案」，那是模型在即興發揮，不是在跑這個 skill。

## design tree、frontier、round：三個概念

`grilling` 的本體引進了舊版沒有的東西。以下是它 SKILL.md 的核心段落：

> "Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled — the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer."
> —— [grilling/SKILL.md](https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grilling/SKILL.md)

三個詞各司其職：

- **design tree**：把主題建模成決策樹，每個決策底下掛著依賴它的決策。
- **frontier（前緣）**：前置條件都已解決的那一圈決策——此刻能誠實提問的問題。
- **round（回合）**：一次問完整個 frontier，你答完後重算，前緣往外推。

所以它從舊版的「一次一題」改成了「一次一輪」。官方給的量級是 13 個問題約 3 輪問完，46 題 4 輪是常態，判斷健康度要**數輪次，不是數題數**。問題格式固定，這是「能用編號回答」的前提：

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

最常見的質疑是「一次問一整輪，不就漏掉了前面答案才會引出的問題嗎」。官方的回答就是 frontier 的定義：同一輪裡的問題彼此不相依，所以一輪內的任何答案都不會讓同輪的另一題失效；會被影響的都在下游，而下一輪是重算出來的，不是預先寫好的。

但它也誠實標出這個機制的極限：**frontier 是模型的判斷，不是計算出來的圖**。它可能把兩題放進同一輪，事後才發現其中一個答案應該改變另一題。除了你出聲讓它重開那條分支之外，沒有其他保護。

想回到一次一題？官方支援而不只是容忍，在全域 `CLAUDE.md` 加一行就好：

```
When grilling, ask one question at a time.
```

文件特別提到，閱讀速度較慢的人、用第二語言工作的人、需要順序節奏當專注鷹架的人，普遍回報一次一題比較好用。（另外，曾經短暫存在的 `batch-grill-me` 已經併回 `grilling`，不用去找了。）

## 事實是 agent 的責任，決策是你的責任

這是整個 skill 最值得抄的一條分工：

> "Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it — don't ask the user for anything you could look up yourself."

而且查證不阻塞整輪：正在跑的探索算是「未解決的前置條件」，所以只有下游問題要等，其餘 frontier 照問。決策則相反——一定要問你、一定要等。文件把界線劃得很硬：**一個會自己回答決策題的 agent 是把 skill 弄壞了，不是彈性詮釋**。

session 也不是問完就結束。frontier 清空只是必要條件，還要你明確說「我們達成共識了」，它才准動工。官方承認這道閘門在較弱、較低 effort 的模型上會被跳過——那些模型會把「訪談到共識為止」壓縮成兩三個問題加一份大綱。相對的建議是：grilling 對模型能力的依賴比其他 skill 高，要給最好的模型，實作階段反而可以省。

## 兩個失效模式

**被動點頭**是頭號問題，而且它偽裝成生產力：

> "The failure mode is **passivity** — answering 'agreed, agreed, agreed' for forty questions and coming out with a plan the agent wrote and you nodded at. It feels productive because it was long. Nothing was actually decided, and the result carries a certainty it hasn't earned."

官方給的健康指標很好用：**一場你從頭同意到尾的 session，是一場你本來就不需要的 session**。其他指標包括後面幾輪明顯建立在前面的答案上、你最後停在一個沒預期到的地方、以及結束時你能對著沒參與的人辯護每個選擇。

**ungrillable 問題**是第二個。「一頁長表單還是三頁？」「這個互動應該是什麼感覺？」這類問題談不出答案，需要有東西可以反應。硬談的後果很具體：agent 一直換句話問，你一直猜，範圍膨脹去填補那份不確定。正確做法是停止 grilling，用 `prototype` 做個拋棄式版本，看一眼，回來一行答完。

順帶一提，「被問了兩百題」通常不是 skill 壞掉，而是範圍太大——先請 agent 把工作拆小再各自 grill。而且長 session 會把 context 塞滿，問題品質跟著下滑。官方也明說**不會提供題數上限**：有些計畫三題就夠，有些要五十題，固定天花板不是截斷難題就是在簡單題上顯得武斷。

## 它在整套 skill 裡的位置

```
                 grilling  (model-invoked，訪談機制本體)
                     ↑
      ┌──────────────┼──────────────┬─────────────┐
   grill-me    grill-with-docs   wayfinder      triage
  (無狀態)      (寫 CONTEXT.md    (大到一個      (把模糊回報
   不需 repo      與 ADR)          session       grill 成
                                   裝不下)        可處理的)
                     ↓
                  to-spec → implement
```

| 你手上有的東西 | 該用 |
|---|---|
| 任何東西，不必是程式、不必有 repo | [grill-me](https://www.aihero.dev/skills-grill-me)（stateless，不寫檔） |
| 一個要對齊的 codebase | [grill-with-docs](https://aihero.dev/skills-grill-with-docs)（stateful，寫 `CONTEXT.md` 與 ADR） |
| 大到一個 session 裝不下的工作 | [wayfinder](https://aihero.dev/skills-wayfinder)（畫成地圖，在決策票裡跑 grilling） |
| 談不出來的問題 | [prototype](https://aihero.dev/skills-prototype)（先做拋棄式版本） |
| grill 完要寫規格 | [to-spec](https://aihero.dev/skills-to-spec)，而且**別開新 session** |

最後一條值得單獨講：grill 完不要另起爐灶，session 的價值就是那份剛建立起來的 context，直接把同一段對話交給 `to-spec`。另外官方建議**跑 grill-me 時不要開 plan mode**——plan mode 會催 agent 趕快產出計畫，跟「保持在探問狀態」正好相反。

## 安裝、授權，以及不能信的安裝數

官方安裝方式有兩條：

```bash
# Claude Code（plugin）
claude plugins install mattpocock-skills

# Codex 與其他 agent
npx skills@latest add mattpocock/skills
```

裝完在每個 repo 跑一次 `/setup-matt-pocock-skills`。整包是 MIT 授權（`Copyright (c) 2026 Matt Pocock`），所以衍生版本很多：[stevegsax/grill-me](https://github.com/stevegsax/grill-me) 加了 session 檔案讓訪談可以續談（現已封存），[alirezarezvani 的版本](https://alirezarezvani.github.io/claude-skills/skills/engineering/grill-me/)外掛 Python 腳本做決策樹抽取與題目生成，而 [petekp/claude-code-setup](https://github.com/petekp/claude-code-setup/blob/main/skills/grill-me/SKILL.md) 等多數 repo 抄的仍是四行舊版。這件事本身就是提醒：你在網路上看到的 `grill-me`，有不小機率是 2026 年上半那個版本。

至於流量數字，**不要信**。同一個 skill 目錄站在不同頁面給出的安裝數彼此矛盾（460,658 / 509k / 812k / 833k 都出現過），還有頁面宣稱這個 repo 有「121,024 GitHub stars」。這些是聚合站的生成內容，我沒能獨立驗證（GitHub API 在這次查證的環境裡被 proxy 擋掉）。能確定的只有定性結論：它是目前流傳最廣的 planning skill，而且原始碼短到你可以在三十秒內讀完並自己判斷。

## 整體來說

`grill-me` 真正有價值的不是那段 prompt，是它把「訪談」當成一個可以被其他 skill 呼叫的 primitive，並且在裡面劃了兩條硬界線——事實歸 agent、決策歸人，以及沒有你的確認就不准動工。這兩條界線放到任何 agent 工作流都成立，不只在 planning。

它的成本也很誠實：一場 session 要你四十分鐘的專注，而且你必須真的在裡面反駁。如果你只打算點頭，那份計畫最後是 agent 的意見，不是你的——而它讀起來會很有把握，那種把握沒有任何東西支撐。

站內相關：[Claude Skills：把專業知識打包成資料夾](/posts/ai/2026-05-08-anthropic-claude-skills-guide)、[Skill vs Subagent](/posts/ai/2026-03-30-skill-vs-subagent-comparison)、[協定層：MCP、A2A、ACP、Skills 各解什麼問題](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer)。

## 參考資料

- [The /grill-me Skill — AI Hero](https://www.aihero.dev/skills-grill-me)
- [The /grilling Skill — AI Hero](https://www.aihero.dev/skills-grilling)
- [My 'Grill Me' Skill Went Viral — AI Hero](https://www.aihero.dev/my-grill-me-skill-has-gone-viral)
- [mattpocock/skills（GitHub）](https://github.com/mattpocock/skills)
- [grill-me/SKILL.md 原始碼](https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grill-me/SKILL.md)
- [grilling/SKILL.md 原始碼](https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grilling/SKILL.md)
- [docs/productivity/grill-me.md（官方使用說明）](https://github.com/mattpocock/skills/blob/main/docs/productivity/grill-me.md)
- [stevegsax/grill-me（變體，已封存）](https://github.com/stevegsax/grill-me)
- [alirezarezvani/claude-skills 的 grill-me 變體](https://alirezarezvani.github.io/claude-skills/skills/engineering/grill-me/)
- [petekp/claude-code-setup 的 grill-me（舊版）](https://github.com/petekp/claude-code-setup/blob/main/skills/grill-me/SKILL.md)
