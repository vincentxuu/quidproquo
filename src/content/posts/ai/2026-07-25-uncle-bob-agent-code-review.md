---
title: "Uncle Bob 不讀 agent 寫的程式碼：他用什麼關卡取代 code review"
date: 2026-07-25
category: ai
tags: [ai-code-review, agentic-coding, quality-gates, testing, spec-driven-development, ai-agent]
lang: zh-TW
type: deep-dive
tldr: "2026/7/23 Uncle Bob 那則 418 萬瀏覽的貼文不是宣言，是回覆——回一位 1983 年入行的工程師問「我心理上就是需要看懂程式碼，是不是太老派」。而且他沒有完全不讀：6/1 那則四階段 pipeline 的原文寫著 I spot check the code，門檻是 crap ≤ 6（業界慣例 30）、mutation 要 kill all survivors。附開源的 Acceptance-Pipeline-Specification 拆解與 Grady Booch 點名的三個指標盲區。"
description: "從 Uncle Bob 2026/7/23 那則回覆的原文與上下文出發，拆解他用來取代 agent code review 的驗證關卡：Gherkin 規格、acceptance mutation、品質指標，以及 Grady Booch 的反方論證與這套做法的天花板。"
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

2026 年 7 月 23 日 11:44 UTC，Robert C. Martin（Uncle Bob）發了一則 533 個字元的回覆，到目前為止累積 418 萬次瀏覽、1.6 萬個讚、1.1 萬次收藏、530 則回覆。《Clean Code》的作者說他不讀程式碼了。

但幾乎所有轉述都漏了一件事：**那是一則回覆，不是一篇宣言**。要看懂它，得先看他在回誰。

▍他回的是一個人的焦慮，不是一場辯論

前一天，[Ori Pomerantz](https://x.com/ori_pomerantz/status/2080024439345828249) 發了這則（16 萬瀏覽、227 則回覆）：

> I am trying to use Claude to help me write something, but I just don't feel comfortable letting it edit my files. Does anybody else feel the same? If I am responsible for code, I NEED to understand it, psychologically if for no other reason.
>
> Started programming in 1983. Old?

翻成白話：我要為這份程式碼負責，所以我必須看懂它——就算只是心理上過不去。最後那句「Started programming in 1983. Old?」是自嘲，也是在問：是不是我太老派了？

Uncle Bob 的[回覆全文](https://x.com/unclebobmartin/status/2080257779395154409)是這樣開頭的：

> **I'm significantly older than you.** I started coding in the late 60s. My current strategy is to not read any of the code written by my agents. That's the only way I can take advantage of their productivity. What I do instead is to surround the agents with extreme constraints. Unit tests, gherkin tests, QA procedures, quality metrics, mutation testing, test coverage, and a plethora of others. In the end, I have very high confidence in the code they produce because they've had to run the gauntlet of all of my constraints and tests.

第一句是在回「Old?」——你不是太老，我比你老得多，而我不讀。

這個上下文改變了整則貼文的性質。Ori 問的是一個**心理問題**：我需要理解它才安心。Uncle Bob 的回答不是「理解不重要」，而是**把安心的來源換掉**：

以前的信心來自「我看過」。他現在的信心來自最後那句——`they've had to run the gauntlet`，程式碼跑完了他所有的關卡。

換句話說，這則貼文回答的是「我怎麼在不讀的情況下還睡得著」，不是「你們都不該讀」。被剪成「Clean Code 作者不讀碼了」拿去傳播，主詞從他自己變成了所有人，這是原文沒有的意思。

▍逐句拆那份清單

他列了六類約束，一句話帶過，但每一項的分量差很多：

| 他寫的 | 實際在驗什麼 |
|---|---|
| Unit tests | 行為對不對——最基本，也是他自己說最常只用這個的那一項 |
| Gherkin tests | 用具體例子固定驗收條件，且必須保持自然語言 |
| QA procedures | 人工、UI 導向的檢查流程 |
| Quality metrics | 覆蓋率、依賴結構、cyclomatic complexity、模組大小 |
| Mutation testing | 改壞程式碼，看測試會不會叫 |
| Test coverage | 哪些路徑被執行過 |

其中最關鍵的是 mutation testing，因為它是唯一回答「誰來驗證測試」的一項——而這正是這則貼文底下最多人追問的問題：實作和測試都是同一個 agent 寫的，兩邊可能錯得很一致，綠燈到底代表什麼。

而他真正的做法，比推文裡這個詞暗示的還要特別。

▍關卡不是抽象概念，他把規格開源了

這套關卡有實作規格，不用靠貼文猜。

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

一個誠實的補充：這份 README 裡**沒有任何門檻數字**，沒有 mutation score 要幾分、覆蓋率要幾 %。但他在推文裡給過兩個，而且都很硬——下一節會看到。

▍他自己說了：不用每次全上

7/23 那則貼文把六類約束並排寫，讀起來像一套標準流程。但三週前的 [7/2 貼文](https://x.com/unclebobmartin/status/2072736888478175413)講的是相反的事——那則只有 2.1 萬瀏覽，是爆掉那則的 **1/194**：

> I've been pushing very hard on overloading with tests. Gherkin test unit test QA test mutation test gherkin mutation test. It's easy to make the AI's do these things. But just because we can do them doesn't mean we actually should.
>
> Lots of times I just use unit tests and crap evaluation. That seems to work pretty well. For larger projects I can imagine that gherkin testing is pretty useful and so is QA testing. **I'm checking that now.**

三件事：大部分時候他只用單元測試加上 crap evaluation，而且「seems to work pretty well」；Gherkin 和 QA 他用的是「I can imagine」，是推測不是結論；最後一句「I'm checking that now」——他自己還在驗證這套值不值得。

順帶一提，那個 `crap` 不是形容詞。**CRAP（Change Risk Anti-Patterns）是一個真的指標**，用 [crap4j](http://www.crap4j.org/faq.html) 的公式把循環複雜度和覆蓋率乘在一起：

```
CRAP(m) = comp(m)² × (1 − cov(m))³ + comp(m)
```

覆蓋率越低、複雜度越高，分數飆得越快。[Google Testing Blog](https://testing.googleblog.com/2011/02/this-code-is-crap.html) 用的慣例門檻是 30——超過 30 才算「CRAPpy」。記住這個 30。

所以那份清單不是套餐，是工具箱。連他本人都還在挑場合用，而且明講了「能做不代表該做」。任何把 7/23 那六項當標準流程照抄的人，抄的是他三週前才說過不必每次做的東西。

▍他其實有看——「I spot check the code」

「not read any of the code」這句話，他自己在 [6/1 的貼文](https://x.com/unclebobmartin/status/2061482997610610863)裡就沒有守住。那則把整條 pipeline 寫完了，四個 agent，人類介入逐段遞減：

| 階段 | 誰做 | 他的介入 |
|---|---|---|
| 非正式規格 | **他手寫** | 全程 |
| 轉成硬規格、切成 task | agent | **"I review these."** |
| specifier agent：task → Gherkin、剪枝 | agent | **"I spot check the Gherkin."** |
| coder agent：驗收測試 → 單元測試 → 程式碼 | agent | 無 |
| refactorer agent：把 crap 壓到 6 以下、去重複、寫 property test | agent | 無 |
| architect agent：跑 language mutation 補未覆蓋處、**kill all survivors**，再跑 Gherkin mutation 殺存活者，最後跑全套測試 | agent | 無 |
| 產出 | — | **"I spot check the code."** |

最後那句話很重要：**他抽查程式碼**。所以「完全不讀」是推文的修辭，不是他的實際流程。真正的分界不是「看 / 不看」，是**看多密**——規格他逐字寫、硬規格他 review、Gherkin 和程式碼他抽查、中間三個 agent 的產出他放手。

上一節說 README 沒有門檻數字，這則推文補上了兩個，而且都比業界慣例狠：

- **crap ≤ 6**：慣用門檻是 30，他要求的是 1/5
- **kill all survivors**：mutation 測試不容許任何存活的 mutant，等於要求滿分

他也講了代價：「Raw computer power is the limiting factor. Those mutation tests are CPU intensive.」這套關卡的瓶頸不是人，是 CPU。

▍順帶修正：這不是 7/23 才有的立場

很多轉述把它寫成「Uncle Bob 突然變了」。翻他自己的時間軸，這條 pipeline 已經公開建了五個月，7/23 只是碰巧被看見的那一則：

| 日期 | 內容 |
|---|---|
| 2026/3/7 | [宣布用 Gherkin 當主要行為規格工具](https://x.com/unclebobmartin/status/2030287900709978600)，要求保持自然語言、不含 code level artifacts |
| 2026/4/14 | [「I don't review code written by agents.」](https://x.com/unclebobmartin/status/2044114698451476492) 改看 test coverage、依賴結構、cyclomatic complexity、模組大小 |
| 2026/5/13 | [提出 Gherkin mutation](https://x.com/unclebobmartin/status/2054614775397568761)：Gherkin 轉 JSON，mutator 改 IR，預期測試要失敗 |
| 2026/5/22 | [說明兩種模式](https://x.com/unclebobmartin/status/2057809771361677498)：swarm 全套約束「很有生產力也安全，但比純 vibe coding 慢」 |
| 2026/6/1 | [公開完整 pipeline](https://x.com/unclebobmartin/status/2061482997610610863)，含 "I review these." |
| 2026/7/2 | [測試不用每次全上](https://x.com/unclebobmartin/status/2072736888478175413)，「I'm checking that now」 |
| 2026/7/23 | 回覆 Ori Pomerantz，418 萬瀏覽 |

四月那則講得比七月清楚：

> The code itself I leave to the AI. Humans are slow at code. To get productivity we humans need to disengage from code and manage from a higher level.

「Humans are slow at code」才是他真正的論點。7/23 那則之所以爆，不是因為它說了新東西，是因為它剛好落在一個有名有姓的人問「我是不是太老派」的位置上。

▍最有力的反方不是酸民，是 Grady Booch

四月那波討論裡，[Grady Booch](https://en.wikipedia.org/wiki/Grady_Booch)（UML 共同作者）給了一段點名到具體項目的反駁：

> Unlike Bob, I review all code generated by agents. Test coverage and similar metrics will give me confidence of functionality, but they offer me no confidence whatsoever that those agents have not introduced vulnerabilities, that they have not introduced dead code that will diminish understandability in the future, that they have missed factorizations that would have significant impact upon performance.

他接著說：「Trust but verify. As an experienced developer, I know the smell of what is good and what is not. And no agent has either the experience or the context to know those things.」最後一句是直接衝著 Uncle Bob 去的：

> If you want to be sloppy and fast then I suggest you proceed with Bob's advice.

這段的價值在於它不是情緒，是三個測試指標看不到的類別：

1. **安全漏洞**：測試驗行為對不對，不驗有沒有多開一扇門
2. **死碼**：不影響功能、不影響覆蓋率，但持續傷害後面所有人的理解成本
3. **錯過的重構機會**：能跑，就是慢；效能問題不會讓測試變紅

三項都有一個共同點：它們在「功能正確」這個維度上完全隱形。而 Uncle Bob 的關卡，量的幾乎都是功能正確。

▍這套做法真正的天花板

比 Booch 那三項更難處理的是另一件事：**關卡驗證的是規格，不是意圖**。

acceptance mutation 能抓「測試太弱」。它抓不到「驗收條件本身就寫錯了」。如果 Gherkin 裡的例子把商業規則理解錯了，整條 pipeline 會非常有效率地、覆蓋率很漂亮地、mutation 分數很高地，驗證一個錯的東西。

而且錯得比人工還隱蔽——因為所有燈都是綠的。

這也是為什麼他 review 規格那一步不是可選項，是整套東西的承重牆。他對程式碼只做抽查，而抽查不是關卡——關卡全部押在規格那一端。規格是這套系統唯一沒有自動化檢查保護的環節。

▍誰設計關卡，才是重點

大家吵「該不該讀碼」，漏掉的問題是：那套關卡是誰設計的？

Uncle Bob 敢不讀碼，是因為設計關卡的人 1970 年就開始當程式設計師（他自己在推文裡說 late 60s 就在寫），今年 73 歲。哪裡該設檢查、mutation 要改哪些值才有意義、Gherkin 的例子要涵蓋哪些邊界、IR-DRY checker 該把什麼判成同義——這些判斷全部來自大量讀過爛碼、修過爛測試的經驗。

他做的事，是先把幾十年的判斷力寫進驗證層，然後才敢把眼睛移開。而且他還在教這件事：cleancoders 上有 [Clean AI: Agentic Discipline 系列](https://cleancoders.com/episode/agentic-discipline-6)，O'Reilly 也開了 [AI Agents for Clean Code](https://www.oreilly.com/live-events/ai-agents-for-clean-code-with-uncle-bob-martin/0642572376765/) 的線上課。他不是叫大家別讀碼，他是在賣那套關卡怎麼設計。

一個三年資歷的工程師，照抄「不讀碼」這個結論，拿到的只有風險——因為他還設計不出值得信任的關卡。

結論可以一句話轉發。關卡沒辦法。

▍回到最初那個問題

Ori Pomerantz 問的是：我要為程式碼負責，心理上就是需要看懂它，這樣是不是太老派？

依原文，Uncle Bob 的答案不是「不用看懂」。是「你需要的不是看過，是有理由相信」——而理由要自己蓋出來。他的版本是六類關卡加上親自 review 規格；如果你手上沒有那套東西，那 Ori 的不安是完全正確的反應，不是老派。

這件事的重點不是選邊。是稀缺的能力已經從「寫得快」移到「設計驗證機制」，這跟 [Loop Engineering](/posts/ai/2026-06-20-loop-engineering) 裡「驗證成本才是真正瓶頸」是同一個結論從不同方向長出來的。

要不要跟 Uncle Bob 一樣不讀碼，先做兩件事就好：

1. **對程式碼跑一次 mutation testing。** 看你的測試套件在 production code 被改壞時抓到幾成。
2. **對驗收條件做一次 Uncle Bob 那種 mutation。** 挑幾條 end-to-end 測試，把裡面的關鍵輸入數值改掉，然後看測試會不會紅。如果照樣綠，那條測試沒接到你的系統。

第二件比第一件更少人做，通常也更難看。至於怎麼嚴謹地量「改完之後真的變好了嗎」，可以參考[調整 agent 之後怎麼比較前後差異](/posts/ai/2026-06-04-agent-change-rigorous-evaluation)。

## 參考資料

- [Uncle Bob 2026/7/23 貼文：不讀 agent 程式碼、用約束包圍](https://x.com/unclebobmartin/status/2080257779395154409)
- [Ori Pomerantz 2026/7/22 貼文：被回覆的原始提問](https://x.com/ori_pomerantz/status/2080024439345828249)
- [Uncle Bob 2026/4/14 貼文：改看指標而非 review 程式碼](https://x.com/unclebobmartin/status/2044114698451476492)
- [Uncle Bob 2026/3/7 貼文：Gherkin 作為主要行為規格工具](https://x.com/unclebobmartin/status/2030287900709978600)
- [Uncle Bob 2026/5/13 貼文：Gherkin mutation 的做法](https://x.com/unclebobmartin/status/2054614775397568761)
- [Uncle Bob 2026/5/22 貼文：swarm 模式與單 agent 模式的取捨](https://x.com/unclebobmartin/status/2057809771361677498)
- [Uncle Bob 2026/6/1 貼文：完整 pipeline，含「I review these」](https://x.com/unclebobmartin/status/2061482997610610863)
- [Uncle Bob 2026/7/2 貼文：測試不用每次全上](https://x.com/unclebobmartin/status/2072736888478175413)
- [unclebob/Acceptance-Pipeline-Specification（GitHub）](https://github.com/unclebob/Acceptance-Pipeline-Specification)
- [Crap4j FAQ：CRAP 指標的定義與公式](http://www.crap4j.org/faq.html)
- [Google Testing Blog: This Code is CRAP（門檻 30 的出處）](https://testing.googleblog.com/2011/02/this-code-is-crap.html)
- [Uncle Bob vs. Grady Booch: Rethinking Code Reviews in the Age of AI](http://mvark.blogspot.com/2026/04/uncle-bob-vs-grady-booch-rethinking.html)
- [Grady Booch（Wikipedia）](https://en.wikipedia.org/wiki/Grady_Booch)
- [Robert C. Martin（Wikipedia）](https://en.wikipedia.org/wiki/Robert_C._Martin)
- [Clean AI: Agentic Discipline 系列（cleancoders）](https://cleancoders.com/episode/agentic-discipline-6)
- [AI Agents for Clean Code with Uncle Bob Martin（O'Reilly 線上課）](https://www.oreilly.com/live-events/ai-agents-for-clean-code-with-uncle-bob-martin/0642572376765/)
- [Loop Engineering：當 AI 不再需要你打 Prompt](/posts/ai/2026-06-20-loop-engineering)
- [調整 agent 之後，怎麼嚴謹比較前後差異](/posts/ai/2026-06-04-agent-change-rigorous-evaluation)
