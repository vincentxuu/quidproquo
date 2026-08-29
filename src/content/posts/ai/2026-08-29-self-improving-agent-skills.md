---
title: "Agent 怎麼累積團隊判斷：Warp 的 Skill 回饋迴圈"
date: 2026-08-29
type: deep-dive
category: ai
tags: [ai-agent, claude, warp, skills, workflow, automation]
lang: zh-TW
tldr: "Warp 的自我改進 Agent 不把每次錯誤塞進 prompt。base skill 做任務，人類在 GitHub 或 Slack 留回饋，improver skill 把重複訊號整理成小 diff，再走 PR review。真正有價值的是這套工程邊界：可追溯、可回滾、可拒絕更新。"
description: "整理 Anthropic 與 Warp 公開文章中的 self-improving agents 做法：內層 skill、外層 improver、人類回饋、PR review，以及這套流程對 Codex / Claude Code skills 工作流的啟發。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-08-29-self-improving-agent-skills-en)

[Anthropic 在 2026-08-26 發的 Warp 案例](https://claude.com/blog/how-warp-builds-self-improving-agents-on-claude)，表面上是在講「self-improving agents」。但我覺得真正值得看的是另一件事：Warp 沒有把學習理解成讓 Agent 自己改一大包 prompt，也沒有把每次人類糾正都塞進記憶。它把團隊判斷力變成一個可以 review、可以回滾、可以累積的檔案變更。

這個差別很大。很多 Agent 工作流卡在「第一次看起來有用，第二次開始煩」。code review 留了不重要的意見，issue triage 貼錯標籤，Slack 回覆語氣怪，規格文件抓不到團隊真正重視的邊界。最直覺的修法是繼續改 prompt。Warp 一開始也這樣做，後來發現它不會規模化。prompt 變長不是學習，只是把上一輪錯誤的影子留在下一輪。

Warp 的解法是把 Agent 的「會做事」和「會學習」拆開。

## 兩個 Skill，不是一包大 Prompt

Anthropic 文章把 Warp 的架構拆成三段：base skill、人類回饋、improver skill。

base skill 是內層 Agent 用的工作指令。它負責具體任務，例如 code review、寫 spec、GitHub issue 分類。這一層不需要知道自己要怎麼演化，它只要把當下任務做好，並且把輸出留在一個人類本來就會看的地方。

人類回饋是中間那層。按讚有用，但「為什麼」更有用。在 issue triage 裡，維護者可能把 Agent 貼的 `ready-to-implement` 改成 `needs-info`，再補一句：這個需求還沒有講清楚使用者想解的問題。在 Slack 回覆裡，團隊可能直接改掉 Agent 草稿，或在 thread 裡說這句太像行銷稿。

improver skill 是外層 Agent 用的工作指令。它定期讀過去一段時間的回饋，找出可重複使用的原則，對 base skill 提出小修改。skill 是檔案，所以修改可以變成 Git diff，接著走 PR review。人類合併後，下一次 base skill 執行才會吃到這個改進。

用 ASCII 畫大概是這樣：

```text
new work item
    |
    v
base skill agent  ---> output in GitHub / Slack / PR
    |                              |
    |                              v
    |                       human feedback
    |                              |
    v                              v
interaction records ----> improver skill agent
                                  |
                                  v
                         small skill diff / PR
                                  |
                                  v
                            human review
                                  |
                                  v
                         next base skill run
```

這裡的安全邊界很清楚。Agent 可以提議改進，不能悄悄改變 production 行為。持久化的學習要進 Git，留下 review 和 rollback 的路徑。

## 真正難的是「從錯誤抽出原則」

[Warp 的 Buzz 文章](https://www.warp.dev/blog/agents-need-feedback-loops-not-perfect-prompts)講得最清楚：回饋本身不是學習，能泛化才是學習。

假設人類說「這則回覆太像在推銷」。爛一點的 improver 會加一條規則：不要在第一句提價格。這看起來有用，其實只是過度擬合上一個案例。下一次使用者在抱怨產品壞掉，Agent 仍然可能先講功能亮點，因為它只學到「第一句不要提價格」。

比較好的原則是：當使用者正在抱怨時，先承接情緒與具體問題，不要先推銷。這句話才有遷移能力。它把團隊的判斷方式寫下來，而不是把一個錯誤變成一條禁令。

所以 outer improver 的核心能力不在「會改 Markdown」。那太容易了。真正困難的是判斷：

- 這次錯誤是一次性的，還是反覆出現的類型？
- 人類回饋背後的理由是什麼？
- 既有 skill 裡是不是已經有相關原則，只是寫得不清楚？
- 應該新增一條、改寫一條，還是刪掉一條互相打架的舊原則？
- 這個修改會不會讓 skill 變肥，反而讓 Agent 更難用？

這也是為什麼 Warp 把 improver 做成獨立 skill。把任務做好是一種能力；把人類回饋整理成穩定原則，是另一種能力。

## Demo Repo 裡比較硬的規則

[Warp 的 self-improvement loop 文章](https://www.warp.dev/blog/self-improvement-loop-for-skills)有放一個 GitHub issue triage 的範例 repo。部落格講的是概念，repo 裡的 [triage-issue skill](https://raw.githubusercontent.com/warpdotdev-demos/issue-triage-loop/main/.agents/skills/triage-issue/SKILL.md) 和 [improve-triage-skill](https://raw.githubusercontent.com/warpdotdev-demos/issue-triage-loop/main/.agents/skills/improve-triage-skill/SKILL.md) 才能看出這套流程為什麼不是玩具。

base skill 有幾個刻意留下的鉤子：

- 每則 triage comment 開頭都有隱藏 marker，像 `<!-- oz-triage v:1 -->`，讓 improver 之後可以知道是哪個 skill 版本做的判斷。
- 留言結尾直接請人用反應或回覆給回饋，讓回饋長在 GitHub issue 裡。
- skill 裡有 `## Learned guidelines` 區塊，專門承接之後被驗證過的原則。
- 每次更新都要 bump version，避免後來回看時分不清是哪一版造成的結果。

improver skill 的規則更重要。它看最近 14 天內更新過的 issue，最多 100 筆。訊號來源包含留言反應、人類後續回覆、目前標籤是否被維護者改掉，以及 duplicate 判斷是否被人類修正。它還明確區分訊號強度：維護者改標籤和明確糾正最強，反應次之，沒人抱怨只能算很弱的正面訊號。

最值得抄的是這句精神：訊號弱或互相衝突時，不要改。一次空跑是合理結果。

這一點很成熟。很多自動化系統為了證明自己有價值，會在每次排程都產出一點東西。可是對 skill 來說，亂學比沒學更糟。學錯一次，下一輪所有任務都會帶著那個錯誤前進。

## Skill 要像 Code 一樣被維護

Warp 這套做法最強的地方，在於它把「修改 Agent 指令」變成普通工程流程。

Skill 一旦決定 Agent 的行為，它就不只是文字。它比較像測試、linter、CI 設定或 production config：小改動也可能大範圍影響輸出品質。既然這樣，就應該有版本紀錄、review、rollback、證據和變更說明。

這跟「把所有規則塞進 prompt」剛好相反。長 prompt 的問題不只在 token 成本，更麻煩的是維護。哪一條規則是為了哪個事件加的？哪一條已經過時？哪兩條互相矛盾？模型這次變笨，是因為少了 context？還是因為 prompt 裡的規則互相拉扯？

Skill 檔案至少讓這些問題有地方被處理。好的 improver PR 不應該只說「improve prompt」。它應該列出：

- 看過哪些案例；
- 哪些人類回饋算有效訊號；
- 原本 skill 哪裡不足；
- 這次新增、修改、刪除哪條原則；
- 為什麼這個原則可以套到更多案例，而不是只修某一個 issue。

這種 PR 可能看起來很小，但它把團隊以前只能靠口耳相傳的 taste，變成可檢查的專案資產。

## 對 Codex / Claude Code Skill 工作流的啟發

這篇對我最大的提醒是：不要急著做 fully automatic self-improvement。第一步應該是先做 feedback ledger。

例如在一個內容專案裡，人類常見的糾正可能長這樣：

- 「daily 內容不只論文」：代表 research skill 的觸發範圍寫太窄。
- 「不是每個專案都用 make」：代表實作 skill 不該假設 build tool。
- 「有些文章已經發佈了」：代表進度文件不能蓋過 tracked frontmatter。
- 「不要把 structural check 當 benchmark evidence」：代表驗證 skill 需要區分格式正確和實驗有效。

這些話如果只留在聊天紀錄裡，下次 Agent 很可能又犯。可是也不能每句都原封不動塞進 skill。比較好的流程是先記到 ledger：

```text
feedback:
  source: user correction
  observed_failure: treated daily digest as paper-only
  affected_skill: daily-digest
  proposed_principle: define the content population before selecting sources
  evidence: repeated scope correction
  action: propose skill diff only if same failure appears again
```

等 ledger 累積到一定程度，再讓 improver agent 定期整理。它的輸出是一個 reviewable diff，不是直接改 skill。對這個 repo 來說，還要加一條很硬的邊界：`.agents/skills/` 才是可編輯來源，`.claude/skills/` 是同步產物。improver 真要改 skill，只能改 source，再跑 sync。

這樣做的好處是把「使用者糾正我」變成系統真的會吸收的資料，但又不讓 Agent 自己變成無限制改規則的黑盒。

## 不適合自我改進的情境

這套方法不是所有任務都適合。

第一種不適合，是沒有足夠重複性的任務。只做一次的研究、一次性的修 bug、一次性的文件整理，不值得為它設計 outer loop。寫一則事後筆記就好。

第二種不適合，是沒有可信回饋來源的任務。開放給所有人按讚倒讚，不等於取得品質訊號。Warp 的 demo 至少把維護者 relabel 和明確 correction 看得比一般 reaction 更重；如果沒有這種權重，Agent 很容易被低品質回饋帶偏。

第三種不適合，是明明可以用測試驗證，卻只靠人類感覺。Anthropic 文章也提到，可驗證的 domain 應該先建 verification harness。code review、分類、文件品質這類工作可能需要 human taste；但 build、lint、typecheck、benchmark replay 這些東西不該變成「看起來比較好」。

第四種不適合，是團隊沒有 review capacity。每天開 PR 很酷，但沒人讀，就只是另一種噪音。比較好的節奏可能是一週一次、每次只提兩三條有證據的原則，而且允許空跑。

## 最後：自我改進其實很保守

Warp 這套流程聽起來像「Agent 自己進化」，但實際上很保守。

它保守在幾個地方：不直接改 production 行為；不把弱訊號硬寫進 skill；不讓 learned guidelines 無限膨脹。一次錯誤不能直接寫成永久規則；memory 不能當成程序知識；人類 review 不能跳過。

所以這篇最有用的啟發，不是「我們也來做會自我改 prompt 的 Agent」。比較準確的說法是：

> Agent 的學習如果要進入團隊工作流，就要像 code 一樣被維護。

base skill 做事，human feedback 留在工作現場，improver skill 把反覆出現的回饋整理成小而可審查的原則。Git PR 決定它能不能成為下一版行為。這不是比較炫的 prompt engineering；它是在把團隊判斷力工程化。

## 參考資料

- [Anthropic：How Warp builds self-improving agents on Claude](https://claude.com/blog/how-warp-builds-self-improving-agents-on-claude)
- [Warp：How to build a self-improvement loop for your Skills](https://www.warp.dev/blog/self-improvement-loop-for-skills)
- [Warp：Agents Need Feedback Loops, Not Perfect Prompts](https://www.warp.dev/blog/agents-need-feedback-loops-not-perfect-prompts)
- [Warp demo：triage-issue skill](https://raw.githubusercontent.com/warpdotdev-demos/issue-triage-loop/main/.agents/skills/triage-issue/SKILL.md)
- [Warp demo：improve-triage-skill](https://raw.githubusercontent.com/warpdotdev-demos/issue-triage-loop/main/.agents/skills/improve-triage-skill/SKILL.md)
- [Claude Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [站內：Claude Code Skills 設計指南](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide)
