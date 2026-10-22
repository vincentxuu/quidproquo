---
title: "知識庫怎麼建：個人筆記、團隊 wiki、AI 知識庫的四個共同問題"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, personal-information-management, note-taking, wiki, rag]
lang: zh-TW
tldr: "個人筆記、團隊 wiki、給 AI 用的知識庫，差在讀者是誰：未來的自己、同事、模型。三種都要回答收什麼、怎麼整理、怎麼找到、誰來維護。個人收藏的研究發現，「找」多半是找回自己看過的東西；企業 wiki 的研究則看到，負責整理或代寫的人一離開，內容就開始變亂、過時。"
description: "「知識庫怎麼建」系列總覽：用讀者區分個人筆記、團隊 wiki 與 AI 知識庫，說明三者共同的四個問題、三者怎麼重疊，以及系列 20 篇從哪裡開始讀。"
series:
  name: "知識庫怎麼建"
  order: 0
---

> 🌏 [English version](/posts/learning/2026-10-22-knowledge-base-three-readers-en)

三個常見的場景。你讀到一篇好文章存進 Notion，三個月後要用，搜了半天找不到，最後重新 Google。新同事第三次在群組問「年假怎麼請」，因為 wiki 上那頁寫的是兩年前的流程。公司的 AI 助理被問到同一題，引用了那頁舊文件，答得頭頭是道，但答錯了。

這三件事的病因相同：東西存起來了，但需要時找不到，或找到了卻不能信。英國研究者 [Boardman 和 Sasse](https://doi.org/10.1145/985692.985766) 2004 年訪談 31 個人怎麼管理檔案、email 和書籤，其中一位受訪者的話後來成了論文標題：「stuff goes into the computer and doesn't come out – it just builds up」，東西進了電腦就出不來，只會越積越多。

這個系列說的「知識庫」，是一堆資料，加上一套讓它在需要時被找到、被信任的做法。系列分三段，分別寫給上面三種人：整理自己筆記的人、負責團隊 wiki 的人、要讓 AI 讀公司文件的工程師。它不寫給要比較向量資料庫效能、調檢索參數的人，那些在 [RAG 技法大全](/posts/ai/2026-03-14-rag-patterns-complete-guide)。這篇是總覽：三種知識庫差在哪、共同要回答哪四個問題、20 篇從哪裡開始讀。

## 三種讀者

知識庫長什麼樣子，由讀者決定。拿同一則內容「年假怎麼請」來看：

| | 讀者 | 讀者手上有什麼 | 最常見的壞法 |
|---|---|---|---|
| 個人筆記 | 未來的自己 | 記得當初為什麼存、大概存在哪 | 存了找不到，或忘了有存 |
| 團隊 wiki | 同事 | 不知道你的分類邏輯，只能搜尋或從目錄點 | 寫的人離開，內容過期沒人改 |
| AI 知識庫 | 模型 | 只看到系統交給它的那些文字 | 答案不在庫裡，或拿到舊版本，照樣回答 |

**未來的自己**最寬容。筆記寫「年假：問 HR，表單在 Slack 置頂」就夠了，因為你記得脈絡。[Malone](https://doi.org/10.1145/357423.357430) 1983 年訪談十位上班族怎麼整理辦公桌，發現桌上那疊文件除了方便找，還有一個一樣重要的功能：提醒你還有事沒做。個人筆記可以亂一點，只要它還提醒得到你。

**同事**沒有你的脈絡。在同一篇研究裡，Malone 請同事描述一份文件，再請桌子的主人去找。大約三分之二的情況，文件歸檔的依據和同事描述它的方式不同，例如同事說的是標題和作者，文件卻是按專案放的。「年假」放在「HR／福利／假別」底下很合理，但新人搜的是「請假」。

團隊 wiki 還有一個個人筆記沒有的問題：寫的人會離開。[Stocker 和 Tochtermann](https://doi.org/10.1007/978-3-642-19032-2_22) 研究三家奧地利公司的 wiki，其中一家的行政人員不願意自己更新 wiki，行政類文章大多由一位核心成員代寫；他離職之後，這些文章越來越過時，大多已經沒有用處。同一個 wiki 裡，技術人員自己寫、自己用的技術區塊，卻一直保持更新。

**模型**拿到的最少。它只看得到系統放進提示詞的那些文字，看不到你的脈絡，也不會像新人一樣覺得「這頁好像很舊」。最常見的做法是 RAG（retrieval-augmented generation，檢索增強生成）：先把文件切成小段，問題進來時找出最相關的幾段交給模型。[Anthropic](https://www.anthropic.com/news/contextual-retrieval) 舉過一個例子：財報裡一句「營收比上一季成長 3%」被切出來後，看不出是哪家公司、哪一季。「年假要提前三天申請」被切出來，模型也分不出這是 2023 年的舊規定還是今年的。

Deakin 大學的 [Barnett 等人](https://arxiv.org/abs/2401.05856)整理三個 RAG 專案的失敗點，第一個就是庫裡根本沒有答案，系統卻可能被誤導而照樣回答。人在 wiki 找不到會去問同事，模型找不到則可能直接給出一個答案。

## 三種讀者會重疊

這三種知識庫不是三個分開的世界。你的 Obsidian 筆記、團隊的 Notion，現在都可能被 AI 工具讀進去；給 AI 用的知識庫，來源多半就是團隊 wiki 裡那些文件。所以同一份文件常常同時有兩、三種讀者：寫給同事看的那頁，也要讓模型讀得懂；個人筆記一旦交給 AI 整理，也要經得起被斷章取義。

讓模型讀文件也不一定要切塊檢索。Anthropic 那篇 2024 年的文章就提醒，知識庫夠小、整份放得進模型一次能讀的長度時，直接放進提示詞就好，不必建檢索。模型能讀的長度一直在變，所以要看的是你的資料放不放得進去，不是某個固定數字。AI 段會從這裡談起。

## 收藏和知識庫差在哪

個人資訊管理（personal information management，PIM）研究把這件事拆成幾個動作：遇到資訊時決定要不要留（keeping）、之後把它找回來（re-finding）、中間偶爾整理和清理（maintenance）。華盛頓大學與微軟研究院的 [Bruce、Jones 和 Dumais](https://informationr.net/ir/10-1/paper207.html) 觀察上班族怎麼保存網頁，看到的方法很多種：書籤、寄 email 給自己、存成檔案、印出來。他們用十種功能比較這些方法，例如能不能提醒、好不好維護，但最終的檢驗是同一個：之後找不找得回來。

而且「找」多半是找回自己看過的東西。Google DeepMind 的 [Bendersky 等人](https://arxiv.org/abs/2412.12330)整理個人收藏的搜尋研究時指出，典型的檢索任務是找回已知的項目。這和上網搜尋不一樣：你通常記得一些線索，例如大概誰寄的、什麼時候，只是不記得放在哪。

所以收藏要變成知識庫，至少得回答兩件事：之後要怎麼找到它，以及誰負責讓它保持可信。往前加上「一開始收什麼」，中間加上「怎麼整理」，就是這個系列的四個問題。

## 四個問題

不管讀者是誰，都要回答四件事。三段各走一次，一次比一次深入：

| 問題 | 個人（order 1–5） | 團隊（order 6–10） | AI（order 11–19） |
|---|---|---|---|
| 收什麼 | 收集者謬誤、收件匣（1） | 要寫哪幾種文件（6） | 先寫測試題、盤點來源（11、12） |
| 怎麼整理 | 放哪裡、怎麼連（2、3） | 資訊架構、寫作規範（7、8） | 解析、安全、metadata、切塊（13–16） |
| 怎麼找到 | 搜尋與導覽、工具（2、4） | 搜尋紀錄分析（10） | 檢索與權限過濾（16、17） |
| 誰來維護 | 每週回顧（5） | owner、驗證到期、刪除（9） | 增量同步、評估（18、19） |

**收什麼**決定了後面三件事有多難。個人段從「存了不等於讀了」談起；團隊段先決定要寫哪幾種文件；AI 段反過來，先寫下使用者會問的問題，才知道要收哪些文件。

**怎麼整理**是研究和方法書最常唱反調的地方。IBM 研究院的 [Whittaker 等人](https://doi.org/10.1145/1978942.1979457)分析 345 位使用者找回 email 的紀錄，結論是「high filers were no more successful at finding messages than low filers」：勤於歸檔的人並沒有比較找得到。這不代表整理沒用，同一篇研究發現，人整理信箱主要是為了管理待辦、不被信件淹沒，不是為了之後好找。

**怎麼找到**，個人靠記憶線索，同事靠目錄和搜尋，模型靠檢索和權限過濾。微軟的 [Stuff I've Seen](https://doi.org/10.1145/860435.860451) 把一個人看過的 email、網頁和文件建成同一個索引，使用者回報找東西變容易，而且常改用日期排序、查詢裡常出現人名：時間和人，都是找回自己東西時好用的線索。

**誰來維護**是最容易被跳過的一題。Boardman 和 Sasse 的受訪者很少整理，大整理多半發生在換工作這類人生轉折。微軟研究院的 Grudin 和喬治亞理工學院的 Poole [研究企業 wiki](https://doi.org/10.1145/1832772.1832780)，看到一個 200 人團隊的 wiki：固定修格式的主要貢獻者離開後，接手的專案經理又被調走，wiki 仍然很多人用，內容卻越來越亂；他們訪談的人裡，也沒有人提過清掉過時內容這件事。RAG 系統同樣需要上線後持續校正，Barnett 等人的結論是，系統的穩健性是運作之後逐步改出來的，不是一開始就設計得出來。

## 方法書和研究各能告訴你什麼

這個領域的方法大多來自寫書、開課的作者，例如 [Tiago Forte](https://fortelabs.com/blog/basboverview/) 的 PARA 與 Building a Second Brain，以及 [zettelkasten.de](https://zettelkasten.de/posts/collectors-fallacy/) 這類推廣 Zettelkasten 筆記法的網站。這些做法有它的道理，但我沒找到拿它們和其他做法比較的對照研究。研究本身也有限制：個人資訊管理的經典研究多半只有十幾到幾十位受試者，主題多是 2000 年代的 email 和電腦檔案；企業 wiki 研究以訪談和個案為主；RAG 的效果數字常來自廠商自己的測試。

所以系列每篇都把兩種來源分開寫，衝突時直接講出來。例如 PARA 主張依可行動性分類（專案、領域、資源、封存），上面那篇 email 研究卻發現勤於歸檔的人沒有比較找得到；那是 email 不是筆記軟體，兩者能不能互相推論，留給 order 2。

## 從哪段開始讀

| 你要建的 | 從這篇開始 | 這段會講 |
|---|---|---|
| 自己的筆記 | order 1〈[收什麼：收集不等於知識庫](/posts/learning/2026-10-22-what-to-keep-collecting-is-not-knowledge)〉 | 收什麼、放哪裡、怎麼連、工具、維護（order 1–5） |
| 團隊 wiki | order 6〈[團隊知識庫為什麼會爛掉，以及要寫哪幾種文件](/posts/learning/2026-10-22-team-wiki-why-it-rots)〉 | 資訊架構、寫作規範、維護責任、搜尋（order 6–10） |
| 給 AI 用的知識庫 | order 11〈[給 AI 讀的知識庫差在哪：動手前先寫測試題](/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first)〉 | 盤點來源、解析、安全、metadata、切塊、權限、更新、評估（order 11–19） |

系列依 order 順序陸續發布，個人段先寫完。每段的第一篇都只假設你讀過這篇總覽，可以直接跳段。要做 AI 助理的人，最好也讀團隊段：模型讀的多半就是團隊 wiki 裡那些文件，文件本身過時或找不到，檢索做得再好也救不回來。想先看用 LLM 整理個人知識的做法，可以讀〈[LLM 知識庫的三種模式](/posts/ai/2026-04-03-llm-knowledge-vault)〉。

## 自我檢查

**問：**「把 300 篇網路文章存進 Notion」算不算知識庫？

**判準：** 問自己兩句。三個月後要用其中一篇，你會用什麼線索找到它？誰、多久會把過時的那些清掉？兩句都答不出來，它還是收藏。只答得出第一句，它是一個找得到東西、但會慢慢過時的收藏；只答得出第二句，它是一個乾淨、但找不到東西的收藏。兩句都答得出來，它才開始像知識庫，而這兩句的答案，就是後面各篇要幫你補齊的東西。

## 參考資料

- [Boardman & Sasse 2004, "Stuff goes into the computer and doesn't come out": A cross-tool study of personal information management (CHI 2004)](https://doi.org/10.1145/985692.985766)
- [Malone 1983, How do people organize their desks? (ACM TOIS)](https://doi.org/10.1145/357423.357430)
- [Stocker & Tochtermann 2011, Enterprise Wikis: Types of Use, Benefits and Obstacles: A Multiple-Case Study (IC3K 2009, CCIS 128)](https://doi.org/10.1007/978-3-642-19032-2_22)
- [Anthropic 2024, Introducing Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)
- [Barnett et al. 2024, Seven Failure Points When Engineering a Retrieval Augmented Generation System (CAIN 2024; arXiv:2401.05856)](https://arxiv.org/abs/2401.05856)
- [Bruce, Jones & Dumais 2004, Information behaviour that keeps found things found (Information Research 10(1))](https://informationr.net/ir/10-1/paper207.html)
- [Bendersky, Metzler, Najork & Wang, Searching Personal Collections, in Information Retrieval: Advanced Topics and Techniques (ACM Press, 2025); arXiv:2412.12330](https://arxiv.org/abs/2412.12330)
- [Whittaker et al. 2011, Am I wasting my time organizing email? A study of email refinding (CHI 2011)](https://doi.org/10.1145/1978942.1979457)
- [Dumais et al. 2003, Stuff I've Seen: A System for Personal Information Retrieval and Re-Use (SIGIR 2003)](https://doi.org/10.1145/860435.860451)
- [Grudin & Poole 2010, Wikis at Work: Success Factors and Challenges for Sustainability of Enterprise Wikis (WikiSym 2010)](https://doi.org/10.1145/1832772.1832780)
- [Tiago Forte, Building a Second Brain: The Definitive Introductory Guide](https://fortelabs.com/blog/basboverview/)
- [zettelkasten.de, The Collector's Fallacy](https://zettelkasten.de/posts/collectors-fallacy/)
