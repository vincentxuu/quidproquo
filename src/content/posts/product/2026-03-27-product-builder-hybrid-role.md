---
title: "Product Builder：當角色界線消融，Claude Code 團隊的五種原型重新定義產品開發"
date: 2026-07-25
type: deep-dive
tldr: "Boris Cherny 觀察 Claude Code 團隊，歸納出五種角色原型：Prototyper、Builder、Sweeper、Grower、Maintainer。不綁定職稱，隨產品階段流動。結合 Anthropic 不寫 PRD、預期多數 prototype 會死的文化，Product Builder 不是新職位，是正在取代流水線分工的工作方式。"
category: product
tags: [product-builder, product-management, ai, anthropic, claude-code, career]
lang: zh-TW
description: "Claude Code 創造者 Boris Cherny 觀察到工程、產品、設計的角色正在融合，歸納出五種原型。Aakash Gupta 拆解 Anthropic 的運作模式：不寫 PRD、預期 prototype 會死、Claude Code 先 review PR。從 LinkedIn 到 Walmart，這場組織變革正在發生。"
draft: false
---

🌏 [English version](/posts/product/2026-03-27-product-builder-hybrid-role-en)

Claude Code 的創造者 Boris Cherny 發了一則觀察：

> As engineering, product, design, DS, etc. melt into a new kind of role, I was reflecting on what roles might look like in the future.

他看的不是產業趨勢報告，而是自己團隊——Claude Code 團隊——每天的工作方式。他發現角色不是按職稱劃分的，而是按五種原型運作。

## 五種原型

**1. Prototyper** — 不斷產出全新想法的人。大量嘗試，多數不會上線，但少數存活下來的會改變產品方向。

**2. Builder** — 把存活的 prototype 快速推進到 production-grade 的產品或基礎設施。

**3. Sweeper** — 清理 UI、簡化程式碼和系統、下架沒在拉重量的功能、優化效能。團隊裡最容易被低估，但缺了會讓產品臃腫到無法維護。

**4. Grower** — 接手已上線的產品，持續迭代以改善 Product-Market Fit。

**5. Maintainer** — 負責成熟系統的安全性、可靠性、速度和效率，確保它在規模化的過程中不會崩壞。

Boris 特別強調兩件事：

第一，很多人會橫跨 2 個角色，有時甚至 3 個。第二，這些原型**不綁定職能**——在 Anthropic，有些設計師是 Prototyper，有些是 Builder，有些是 Sweeper。工程師、PM、資料科學家也一樣。

這跟傳統的「你是 PM 還是 Engineer」問法完全不同。真正的問題是：**你現在是在 prototype、build、sweep、grow、還是 maintain？**

### 這不是全新的概念

五種原型的思路有跡可循。1992 年 Robert Cringely 用軍事比喻把團隊分成突擊隊（Commando）、步兵（Infantry）和憲兵（Police）。2010 年代 Simon Wardley 發展出 Pioneers / Settlers / Town Planners 框架，被廣泛應用於技術組織設計。Boris 的五原型是這條線的最新演化：Prototyper ≈ Pioneer、Builder/Grower ≈ Settler、Maintainer ≈ Town Planner。

Boris 多加了什麼？兩件事。第一，**Sweeper 被獨立出來**——在 AI 大量生成程式碼的時代，「做減法」的重要性已經跟「做加法」一樣高。第二，他明確指出這些原型橫切所有職稱，不只適用於工程師。

## 產品階段決定原型組合

健康的團隊不是固定編制，而是根據產品階段配置不同的原型比例：

| 產品階段 | 需要的原型 |
|---------|-----------|
| **新產品，尚未找到 PMF** | Prototyper + Builder + Sweeper 為主力 |
| **成長期，已找到 PMF** | Builder + Sweeper + Grower 為主力，加上 Maintainer |
| **成熟期，PMF 穩固** | Sweeper + Grower + Maintainer 為主力，加上 Builder |

這比「我們需要幾個前端、幾個後端、一個 PM」的思考方式更貼近現實。你需要的不是特定職稱的人頭，而是特定原型的能力。

## Anthropic 怎麼讓這套模式運作

產品策略作家 Aakash Gupta 拆解了 Anthropic 背後的組織文化，解釋為什麼五種原型在這裡能成立：

**全員同一個頭銜。** PM 寫程式、設計師寫程式、連財務也寫程式。所有人的頭銜都是 Member of Technical Staff。

**不寫 PRD，先做再說。** 出 agent teams 功能時，試了幾百個版本才有一個上線。

**預期多數 prototype 會死。** Claude Code 等待時的那個小動畫（spinner），做了 50 到 100 個迭代版本，大約 80% 從未出貨。

**極速出貨。** Cowork——一個給非工程師用的完整產品——大約十天就做完了。

**AI 先 review，人再看。** 每個 pull request 都先讓 Claude Code review，模型在第一輪就抓到大部分 bug，工程師做最後把關。

**賭通用模型。** 團隊座位旁邊掛了一張裱框的 [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)。通用模型每次都贏過特化模型。

這不是管理理論，是一家正在定義 AI 產品開發方式的公司的日常運作。

Anthropic PM 負責人 Cat Wu 在 Lenny's Podcast 進一步揭露：團隊內部有一個「Concept Corner」機制——任何人有想法，目標是當週甚至當天就送到用戶手中測試。她直言：「我們用 team principles 取代 PRD。只要符合原則，任何人都可以自主決定發布。」Anthropic 的設計主管 Meaghan Choi 則說：「品質把關已經從 PRD 和 Figma 審查，移到了實際運行的程式碼裡。」

Cat Wu 認為，當寫程式碼的成本趨近於零，最稀缺的資產變成了 **product taste**——決定「該做什麼」的判斷力，而不是「能不能做」的執行力。這也是為什麼 Anthropic 的工程產出翻了三倍，但反而需要**更多** PM 而非更少。

## 為什麼是現在

兩個字：**AI**。

2025 年 Andrej Karpathy 提出 vibe coding——不再逐行寫程式，而是用自然語言描述需求，AI 幫你生成。這直接降低了「做出東西」的門檻。

當 Claude Code、Cursor、Lovable、Replit 這些工具讓一個人能在幾小時內從想法做出 working prototype，傳統的流水線——PM 寫 spec → Designer 出稿 → Dev 開發 → QA 驗收——就不再是唯一選項。

LogRocket 算了一筆帳：傳統三人組一年成本約 120–150 萬美元，而 50–60% 上線的功能表現不如預期。如果一個人能在投入完整工程資源之前就先驗證假設，每年避免 5 個不必要的功能就能省下 50 萬美元以上。

Boris 自己說過：

> Today coding is practically solved... We're going to start to see the title of 'software engineer' go away. It's just going to be 'builder' or 'product manager.'

五種原型框架，就是這句話的具體展開。

## 誰已經在做

這不是 Anthropic 的獨家實驗，大型組織已經在動：

- **LinkedIn** 把 APM（Associate Product Manager）計畫改名為 **Product Builder** 計畫，訓練跨產品、設計、工程的通才
- **Walmart** 設立了 **Agent Builder** 職位，全部由內部員工（包含非技術人員）轉任
- **Meta** 的 PM 開始自稱「AI Builder」
- **PayFit** 早在 2019 年就定義了 Product Builder 角色，用自研的 low-code 語言 JetLang 讓 PM / UX / Dev 三合一直接建構功能
- **SoFi** 正在招聘 Product Builder 職位

Khan Academy 的 Sal Khan 說得直接：

> The people who are just waiting to get the spec... they're going to have trouble. But the people who are like, 'I'm going to go meet with the customer, and I can build it,' I think they're going to do great.

## 這不是取代專業分工

當產品複雜度提高、需要大規模系統架構、需要深度的用戶研究時，專業分工仍然不可取代。五種原型模式最適合的場景是：

- 早期產品：大量 Prototyper + Builder 快速探索和驗證
- 內部工具：不需要大規模工程投入
- 功能迭代：Sweeper + Grower 快速實驗和數據驅動
- 成熟系統：Grower + Maintainer 確保穩定運維

數位時代的分析指出一個反直覺的趨勢：在 AI 時代，**清理者和維護者的價值正在超越建造者**。因為「做出來」這件事可以大量委派給 AI，但方向判斷與架構整頓是人類的最後堡壘。

paddo.dev 的深度分析進一步指出：「AI 只會做加法，不會做減法。」Sweeper 的核心工作——刪除、下架、簡化——正好是 AI 最不擅長的，因為這需要品味來判斷什麼不該存在。Prototyper 也一樣：AI 能產出一百個想法，但辨識出哪一個值得投入，是 AI 沒有的判斷力。

Aakash Gupta 的結論是：

> When your engineers can each run several agents at once, speed stops being the constraint. The constraint becomes whether anyone in the room can separate the prototype that turns into a product from the one that burns a quarter.

當速度不再是瓶頸，**品味**才是。能分辨哪個 prototype 值得投入、哪個應該砍掉的人，會變得極度有價值。

## 如果你想往這個方向走

不管你現在是 PM、設計師、還是工程師，路徑都一樣：**辨識你擅長的原型，然後補上你缺的那一塊。**

如果你是天生的 **Prototyper** → 學會把想法推進到 production-grade（Builder），而不是停在 demo。

如果你是 **Builder** → 花時間理解用戶，培養辨別哪些 prototype 值得投入的眼光（Grower）。

如果你是 **Maintainer** → 練習簡化和下架（Sweeper），不要讓系統只增不減。

Aakash 的建議：

> You don't need a new title or anyone's permission to start. Build five versions of something this week and keep the one that earns its place.

Product Builder 不是一個職稱，是一種工作方式。在角色界線消融的時代，能在五種原型之間流動的人，會越來越有價值。

---

## 參考資料

### 原始來源

- [Boris Cherny — Five archetypes on the Claude Code team (X, 2026-06-28)](https://x.com/bcherny/status/2071379474277613732)
- [Aakash Gupta — Anthropic's operating model breakdown (X, 2026-06-29)](https://x.com/aakashgupta/status/2071692050714501494)
- [Aakash Gupta — Anthropic's Claude Code Team Has 5 Roles and Zero Job Titles (Medium)](https://aakashgupta.medium.com/anthropics-claude-code-team-has-5-roles-and-zero-job-titles-bf4860a389fc)
- [How Anthropic's product team moves faster — Cat Wu on Lenny's Podcast (YouTube)](https://www.youtube.com/watch?v=PplmzlgE0kg)
- [Anthropic Head of Design on How Claude Code Hit $2.5B — Product School](https://productschool.substack.com/p/anthropic-head-of-design-on-how-claude)
- [How AI Is Transforming Work at Anthropic — Anthropic Research](https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic)

### 英文延伸討論

- [The 5 job archetypes of the future — Business Insider](https://www.businessinsider.com/job-archetypes-ai-claude-codes-boris-cherny-2026-6)
- [Claude Code Head Says You Need These 5 Employee Archetypes — Inc.](https://www.inc.com/ashley-couto/claude-code-startup-needs-employee-archetypes/91370409)
- [Five Archetypes for a Post-Role Team — jamesm.blog](https://jamesm.blog/ai/five-archetypes-post-role-team/)
- [The Archetype Under the Title — paddo.dev](https://paddo.dev/blog/the-archetype-under-the-title/)
- [Product Management Archetypes: Beyond the PM Job Title — Lots of Data](https://lotsofdata.blog/2026/06/30/the-product-managers-new-operating-system/)
- [Roles of the future: Claude Code Team five archetypes — fernandocomet (Medium)](https://medium.com/design-bootcamp/roles-of-the-future-0eb1cfae0f3c)
- [How Anthropic Builds AI-Native Engineering Teams — Engineering Leadership Newsletter](https://newsletter.eng-leadership.com/p/how-anthropic-builds-ai-native-engineering)
- [Forget Job Titles, Staff Your Team by Archetype — Samuel Lawrentz](https://samuellawrentz.com/blog/staff-your-team-by-archetype/)

### 中文圈討論

- [職稱正在失效，Claude Code 負責人提出 AI 時代五種人才原型 — INSIDE](https://www.inside.com.tw/article/41672-boris-cherny-five-product-archetypes-ai-roles-claude-code)
- [工程師與 PM 的價值被 AI 重寫？未來團隊最缺的不是「建造者」— 數位時代](https://www.bnext.com.tw/article/91395/ai-product-work-archetypes-from-handovers-to-prototypes)
- [Claude Code 負責人提五種角色原型，取代傳統職務分工 — TechNews 科技新報](https://technews.tw/2026/06/29/five-key-archetypes-for-future-product-teams/)
- [Claude Code 問世，第一個被改變的是做出它的人 — 數位時代](https://www.bnext.com.tw/article/90340/ai-agent-software-engineer)
- [Claude Code 之父版"职场 MBTI"：AI 洗牌后只剩 5 类人 — 36氪 / 量子位](https://36kr.com/p/3875518156763399)
- [想法即產品：AI 時代 Product Builder 的崛起 — Peter Su (Substack)](https://petersuppi.substack.com/p/ai-product-builder)
- [AI 時代只剩四種人能留下來？— TechOrange 科技報橘](https://techorange.com/2026/04/13/four-jobs-left-in-tech/)
- [深度解密 Anthropic：当代码沦为"白菜价"— 騰訊雲](https://cloud.tencent.com/developer/article/2665528)
- [為什麼 Claude Code 的創作者反對 AI 通才的理想化觀點 — youmind](https://youmind.com/zh-TW/landing/x-viral-articles/claude-code-creator-ai-archetypes)

### 歷史脈絡

- ['Engineer' is so 2025. In AI land, everyone's a 'builder' now — SF Standard](https://sfstandard.com/2026/03/05/engineer-2025-ai-land-everyone-s-builder-now/)
- [Why product managers must become product builders in 2026 — LogRocket](https://blog.logrocket.com/product-management/product-builders-future-product-management)
- [AI is turning product managers into builders — Fast Company](https://www.fastcompany.com/91452231/ai-is-turning-product-managers-into-builders)
- [Introducing the Product Builder — PayFit](https://backstage.payfit.com/introducing-the-product-builder/)
- [The Era of the Product Creator — SVPG](https://www.svpg.com/the-era-of-the-product-creator/)
- [The Bitter Lesson — Rich Sutton](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)
