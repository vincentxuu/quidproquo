---
title: "Uncle Bob 不讀 agent 寫的程式碼：他用什麼關卡取代 code review"
date: 2026-07-25
category: ai
tags: [ai-code-review, agentic-coding, quality-gates, testing, spec-driven-development, ai-agent]
lang: zh-TW
type: deep-dive
tldr: "2026/7/23 Uncle Bob 說他完全不讀 agent 寫的程式碼，改用單元測試、Gherkin、mutation testing 等關卡包圍 agent。但這不是上週才轉向——他 4/14 就講過同一件事，3 月起公開建這條 pipeline，關卡規格開源在 Acceptance-Pipeline-Specification。他真正的招是 acceptance mutation：改壞 Gherkin 的例子資料，不是改壞程式碼。Grady Booch 的反駁點名三個測試指標看不到的東西。"
description: "拆解 Robert C. Martin 用來取代 agent code review 的驗證關卡：Gherkin 規格、acceptance mutation、品質指標，以及 Grady Booch 的反方論證與這套做法的天花板。"
glossary:
  - term: acceptance mutation
    aliases: [Gherkin mutation, 驗收突變]
    definition: "改動 Gherkin 規格裡的關鍵例子資料（而非程式碼），驗收測試就應該失敗；若照樣通過，代表那條測試沒有真的接到被測應用程式。"
    advanced: "和一般 mutation testing 方向相反：一般 mutation 改 production code 找出測試盲點，acceptance mutation 改規格的例子值，找出「測試其實在測 mock 或自造假資料」這種假綠燈。兩者互補，抓的是不同的失效模式。"
    links:
      - label: "Acceptance-Pipeline-Specification"
        url: "https://github.com/unclebob/Acceptance-Pipeline-Specification"
  - term: JSON IR
    aliases: [intermediate representation, IR]
    definition: "把 Gherkin feature 檔剖析成的中介 JSON 表示。後續的測試產生器與 mutator 都對這層操作，不直接改 feature 檔文字。"
    advanced: "多一層 IR 的好處是工具可攜：parser、DRY checker、mutator 都只認 JSON，不必理解各語言的 test runner；缺點是 IR 與原始 Gherkin 之間多了一層可能失真的轉換。"
  - term: IR-DRY checker
    definition: "掃 JSON IR、找出重複、近似重複與疑似同義的 Gherkin step 文字，讓 agent 把規格正規化、剪掉冗餘的工具。"
---

> 🌏 [English version](/posts/ai/2026-07-25-uncle-bob-agent-code-review-en)

2026 年 7 月 23 日，Robert C. Martin（Uncle Bob）在 X 上回覆一則留言，說了一句和他教了三十年的東西看起來完全相反的話：

> I started coding in the late 60s. My current strategy is to not read any of the code written by my agents. That's the only way I can take advantage of their productivity. What I do instead is to surround the agents with extreme constraints. Unit tests, gherkin tests, QA procedures, quality metrics, mutation testing, test coverage, and a plethora of others.
>
> —— [@unclebobmartin, 2026/7/23](https://x.com/unclebobmartin/status/2080257779395154409)

他接著說，正因為這些程式碼得「run the gauntlet」——跑完他所有的約束和測試——他對產出才有很高的信心。

《Clean Code》的作者說他不讀程式碼了。這句話當然會炸開。但如果只讀這一則貼文，你會抓錯三件事。

▍先修正時間軸：這不是上週的轉向

最容易誤讀的是「他突然改變立場」。他沒有。

翻他自己的貼文，這條 pipeline 是公開建了五個月的東西：

| 日期 | 內容 |
|---|---|
| 2026/3/7 | [宣布用 Gherkin 當主要行為規格工具](https://x.com/unclebobmartin/status/2030287900709978600)，要求 Gherkin 保持自然語言、不含 code level artifacts |
| 2026/4/14 | [「I don't review code written by agents.」](https://x.com/unclebobmartin/status/2044114698451476492) 改看 test coverage、依賴結構、cyclomatic complexity、模組大小 |
| 2026/5/13 | [提出 Gherkin mutation](https://x.com/unclebobmartin/status/2054614775397568761)：把 Gherkin 轉成 JSON，mutator 改 IR，然後預期測試要失敗 |
| 2026/5/22 | [說明專案的兩種模式](https://x.com/unclebobmartin/status/2057809771361677498)：swarm 全套約束「很有生產力也安全，但比純 vibe coding 慢」 |
| 2026/6/1 | [公開完整 pipeline](https://x.com/unclebobmartin/status/2061482997610610863)：手寫非正式規格 → agent 轉成硬規格並切成 task → **「I review these.」** → 丟給 specifier agent |
| 2026/7/2 | [承認不用每次全上](https://x.com/unclebobmartin/status/2072736888478175413) |
| 2026/7/23 | 上面那則爆掉的貼文 |

四月那則的完整說法比七月這則清楚得多：

> The code itself I leave to the AI. Humans are slow at code. To get productivity we humans need to disengage from code and manage from a higher level.

所以七月那則不是宣言，是一個已經跑了幾個月的做法的結論句。傳播的時候被剪成「Clean Code 作者不讀碼了」，比他的原意激進太多。

▍關卡不是抽象概念，他把規格開源了

第二件被漏掉的事：這套關卡有實作規格，不用靠貼文猜。

Uncle Bob 把它放在 GitHub 上的 [Acceptance-Pipeline-Specification](https://github.com/unclebob/Acceptance-Pipeline-Specification)，定位是「可攜的 acceptance pipeline 規格，讓 AI agent 能安裝到專案裡」。README 的一句話說完它做什麼：

> turns Gherkin feature files into JSON IR, generates executable acceptance test entry points, runs those tests, and uses acceptance mutation to check whether example data is actually connected to the application under test

它定義兩條流程。正常跑是：feature 檔 → Gherkin parser → JSON IR →（選用）IR-DRY checker → entrypoint generator → 產生的測試入口 → 專案 test runner。

Mutation 跑是：feature 檔 → parser → base JSON IR → entrypoint generator → **Gherkin mutator 改寫 IR** → runner adapter 用改過的 IR 評估 → mutation 報告。

工具分兩層：可攜的部分（gherkin-parser、gherkin-ir-dry-checker、gherkin-mutator，以 Babashka task 或 Go binary 提供）跟專案自己的部分（entrypoint generator、acceptance runtime、step handlers、runner adapter）。那個 IR-DRY checker 的工作是抓重複、近似重複、疑似同義的 step 文字，讓 agent 把 Gherkin 正規化、剪掉冗餘。

▍最常被講錯的一點：他改壞的不是程式碼

一般說 mutation testing，指的是把 production code 偷偷改壞，看測試會不會叫。Uncle Bob 確實也用這個（四月那則有列 mutation testing）。

但他這套 pipeline 的招牌機制是另一個東西，叫 **acceptance mutation**。README 講得很直白：

> The normal run proves that the project satisfies the feature. The mutation run checks whether the acceptance tests fail when important example values change.

改的是 Gherkin 裡的**例子資料**，不是程式碼。改掉一個關鍵數值之後，acceptance test 應該要紅。如果照樣綠，代表那條測試根本沒接到被測的應用程式。

這個差別很重要，因為它正面回答了「誰來驗證測試」這個問題裡最惡性的一種：測試寫得漂亮、斷言充足、覆蓋率好看，但測的其實是 mock 或是它自己造的假資料。改壞 production code 抓不到這種——你改的地方那條測試根本沒走到。改壞例子資料才抓得到。

一個誠實的補充：這份 README 裡**沒有任何門檻數字**，沒有 mutation score 要幾分、覆蓋率要幾 %。所以「有數字可以看」是對的，「有公認的及格線」不是。及格線還是人定的。

▍他自己說了：不用每次全上

7/2 那則貼文，是理解他實際做法的關鍵，卻幾乎沒人轉：

> I've been pushing very hard on overloading with tests. Gherkin test unit test QA test mutation test gherkin mutation test. It's easy to make the AI's do these things. But just because we can do them doesn't mean we actually should. Lots of times I just use unit tests and crap evaluation.

大部分時候他只用單元測試加上粗略評估。至於 Gherkin 和 QA，他的原話是「For larger projects I can imagine that gherkin testing is pretty useful」——用的是「我可以想像」，不是實測結論。

所以這套關卡沒有固定套餐，重裝配備連他自己都還在挑場合用。任何把它當標準流程照抄的人，抄的是他明確說過不必每次做的東西。

▍他停止看的只有實作細節

「完全不讀」這個說法有語病，而他 6/1 的貼文自己拆掉了這個語病：手寫非正式規格是他做的，agent 轉出來的硬規格和 task，**他 review**。

所以真正的分界不是「看 / 不看」，是**看哪一層**：

- 規格與驗收條件 → 他親自看、親自寫、親自剪
- 品質指標（覆蓋率、依賴結構、cyclomatic complexity、模組大小、mutation 結果）→ 他看數字
- 實作程式碼 → 交給 AI

這跟「不做 code review」是兩回事。他把 review 的位置從輸出端移到輸入端。

▍最有力的反方不是酸民，是 Grady Booch

四月那波討論裡，[Grady Booch](https://en.wikipedia.org/wiki/Grady_Booch)（UML 共同作者）給了一段點名到具體項目的反駁：

> Unlike Bob, I review all code generated by agents. Test coverage and similar metrics will give me confidence of functionality, but they offer me no confidence whatsoever that those agents have not introduced vulnerabilities, that they have not introduced dead code that will diminish understandability in the future, that they have missed factorizations that would have significant impact upon performance.

他接著說：「Trust but verify. As an experienced developer, I know the smell of what is good and what is not. And no agent has either the experience or the context to know those things.」

這段的價值在於它不是情緒，是三個測試指標看不到的類別：

1. **安全漏洞**：測試驗行為對不對，不驗有沒有多開一扇門
2. **死碼**：不影響功能、不影響覆蓋率，但持續傷害後面所有人的理解成本
3. **錯過的重構機會**：能跑，就是慢；效能問題不會讓測試變紅

三項都有一個共同點：它們在「功能正確」這個維度上完全隱形。而 Uncle Bob 的關卡，量的幾乎都是功能正確。

▍這套做法真正的天花板

比 Booch 那三項更難處理的是另一件事：**關卡驗證的是規格，不是意圖**。

acceptance mutation 能抓「測試太弱」。它抓不到「驗收條件本身就寫錯了」。如果 Gherkin 裡的例子把商業規則理解錯了，整條 pipeline 會非常有效率地、覆蓋率很漂亮地、mutation 分數很高地，驗證一個錯的東西。

而且錯得比人工還隱蔽——因為所有燈都是綠的。

這也是為什麼他 review 規格那一步不是可選項，是整套東西的承重牆。他把人類注意力從程式碼移走，全部押在規格上。規格是這套系統唯一沒有自動化關卡保護的環節。

▍誰設計關卡，才是重點

大家吵「該不該讀碼」，漏掉的問題是：那套關卡是誰設計的？

Uncle Bob 敢不讀碼，是因為設計關卡的人 1970 年就開始當程式設計師（他自己在推文裡說 late 60s 就在寫），今年 73 歲。哪裡該設檢查、mutation 要改哪些值才有意義、Gherkin 的例子要涵蓋哪些邊界、IR-DRY checker 該把什麼判成同義——這些判斷全部來自大量讀過爛碼、修過爛測試的經驗。

他做的事，是先把幾十年的判斷力寫進驗證層，然後才敢把眼睛移開。而且他還在教這件事：cleancoders 上有 [Clean AI: Agentic Discipline 系列](https://cleancoders.com/episode/agentic-discipline-6)，O'Reilly 也開了 [AI Agents for Clean Code](https://www.oreilly.com/live-events/ai-agents-for-clean-code-with-uncle-bob-martin/0642572376765/) 的線上課。他不是叫大家別讀碼，他是在賣那套關卡怎麼設計。

一個三年資歷的工程師，照抄「不讀碼」這個結論，拿到的只有風險——因為他還設計不出值得信任的關卡。

結論可以一句話轉發。關卡沒辦法。

▍給團隊的一個具體檢驗

這件事的重點不是選邊。是稀缺的能力已經從「寫得快」移到「設計驗證機制」，這跟 [Loop Engineering](/posts/ai/2026-06-20-loop-engineering) 裡「驗證成本才是真正瓶頸」是同一個結論從不同方向長出來的。

要不要跟 Uncle Bob 一樣不讀碼，先做兩件事就好：

1. **對程式碼跑一次 mutation testing。** 看你的測試套件在 production code 被改壞時抓到幾成。
2. **對驗收條件做一次 Uncle Bob 那種 mutation。** 挑幾條 end-to-end 測試，把裡面的關鍵輸入數值改掉，然後看測試會不會紅。如果照樣綠，那條測試沒接到你的系統。

第二件比第一件更少人做，通常也更難看。至於怎麼嚴謹地量「改完之後真的變好了嗎」，可以參考[調整 agent 之後怎麼比較前後差異](/posts/ai/2026-06-04-agent-change-rigorous-evaluation)。

## 參考資料

- [Uncle Bob 2026/7/23 貼文：不讀 agent 程式碼、用約束包圍](https://x.com/unclebobmartin/status/2080257779395154409)
- [Uncle Bob 2026/4/14 貼文：改看指標而非 review 程式碼](https://x.com/unclebobmartin/status/2044114698451476492)
- [Uncle Bob 2026/3/7 貼文：Gherkin 作為主要行為規格工具](https://x.com/unclebobmartin/status/2030287900709978600)
- [Uncle Bob 2026/5/13 貼文：Gherkin mutation 的做法](https://x.com/unclebobmartin/status/2054614775397568761)
- [Uncle Bob 2026/5/22 貼文：swarm 模式與單 agent 模式的取捨](https://x.com/unclebobmartin/status/2057809771361677498)
- [Uncle Bob 2026/6/1 貼文：完整 pipeline，含「I review these」](https://x.com/unclebobmartin/status/2061482997610610863)
- [Uncle Bob 2026/7/2 貼文：測試不用每次全上](https://x.com/unclebobmartin/status/2072736888478175413)
- [unclebob/Acceptance-Pipeline-Specification（GitHub）](https://github.com/unclebob/Acceptance-Pipeline-Specification)
- [Uncle Bob vs. Grady Booch: Rethinking Code Reviews in the Age of AI](http://mvark.blogspot.com/2026/04/uncle-bob-vs-grady-booch-rethinking.html)
- [Grady Booch（Wikipedia）](https://en.wikipedia.org/wiki/Grady_Booch)
- [Robert C. Martin（Wikipedia）](https://en.wikipedia.org/wiki/Robert_C._Martin)
- [Clean AI: Agentic Discipline 系列（cleancoders）](https://cleancoders.com/episode/agentic-discipline-6)
- [AI Agents for Clean Code with Uncle Bob Martin（O'Reilly 線上課）](https://www.oreilly.com/live-events/ai-agents-for-clean-code-with-uncle-bob-martin/0642572376765/)
- [Loop Engineering：當 AI 不再需要你打 Prompt](/posts/ai/2026-06-20-loop-engineering)
- [調整 agent 之後，怎麼嚴謹比較前後差異](/posts/ai/2026-06-04-agent-change-rigorous-evaluation)
