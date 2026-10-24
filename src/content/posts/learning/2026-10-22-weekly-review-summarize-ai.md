---
title: "維護：筆記怎麼不在三個月後荒廢，以及哪些事交給 LLM"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, note-taking, weekly-review, progressive-summarization, llm]
lang: zh-TW
tldr: "排一個 30 分鐘的每週回顧：清收件匣、處理結束的專案、從一張 MOC 挑一個問題往下想。摘要不必排時間，碰到才加一層。LLM 可以幫你找重複、建議可能相關的筆記、把你先寫好的重點擴寫成句子；那一句自己的話、判斷什麼重要、刪不刪，留給自己。一項 30 人的研究比較三種 AI 協助，AI 直接給完整筆記的那組學得最少，也最少修改。"
description: "知識庫怎麼建 order 5：GTD 每週回顧改成筆記版、Forte 漸進摘要的正確用法、刪除與降級、AI 摘要與自動筆記的研究、LLM 與自己的分工、隱私，以及個人段的總整理與換成同事讀時會遇到的問題。"
series:
  name: "知識庫怎麼建"
  order: 5
---

> 🌏 [English version](/posts/learning/2026-10-22-weekly-review-summarize-ai-en)

剛開始整理筆記的第一個月，通常很順：收件匣每週清、資料夾照新規則放、連結也寫了理由。三個月後，收件匣又堆了兩百則，你已經想不起上次打開 MOC 是什麼時候。筆記系統最常見的結局不是壞掉，是被忘記。

這篇是「知識庫怎麼建」個人段的最後一篇。前面四篇談收什麼、放哪裡、怎麼連、用什麼工具，這篇談怎麼讓它三個月後還活著，以及現在大家最常問的：這些整理工作，哪些可以交給 LLM？讀完你能排出一份 30 分鐘的每週回顧，並決定哪一步交給 LLM、哪一步留給自己。

先看一個研究。MIT 的 Van Kleek 等人 2009 年追蹤 42 個人用一個側邊欄筆記工具 10 天：筆記記下之後，75% 再也沒有被編輯過，有改的多數在當天就改了（[Van Kleek et al. 2009](https://doi.org/10.1145/1518701.1518924)）。不刻意回頭，筆記大多就停在記下的那一刻。

## 每週回顧：把 GTD 改成筆記版

[GTD 的每週回顧清單](https://gettingthingsdone.com/wp-content/uploads/2014/10/Weekly_Review_Checklist.pdf)分成三段：Get Clear（清空）、Get Current（跟上進度）、Get Creative（想新東西）。它原本是給待辦事項用的，但三段剛好對應前面幾篇講的事：

| 段落 | GTD 原本 | 筆記版 | 對應 |
|---|---|---|---|
| Get Clear | 收件匣清到零 | 用三步判準清空收件匣 | [order 1](/posts/learning/2026-10-22-what-to-keep-collecting-is-not-knowledge) |
| Get Current | 檢查專案清單 | 結束的專案挑出可重用的，其餘封存；清理待讀清單 | [order 2](/posts/learning/2026-10-22-para-johnny-decimal-folders) |
| Get Creative | 檢視「將來／也許」清單 | 翻一張 MOC 的「還沒想清楚的」，挑一個問題往下想 | [order 3](/posts/learning/2026-10-22-zettelkasten-evergreen-notes-moc) |

order 1 建議每週排 20 分鐘清收件匣，這裡是把它擴成 30 分鐘，多出來的時間用來處理專案和想新東西。每週回顧是方法作者的建議；我搜尋過檢驗它效果的實證研究，沒有找到。

## 漸進摘要：碰到才加一層

Tiago Forte 的[漸進摘要（Progressive Summarization）](https://fortelabs.com/blog/progressive-summarization-a-practical-technique-for-designing-discoverable-notes/)常被誤解成一種要定期做的整理工作。它的做法是一層一層壓縮：第 0 層是原文，第 1 層是你收進筆記軟體的段落，第 2 層把最好的部分加粗，第 3 層在加粗裡挑最好的加螢光，第 4 層只給少數筆記，在開頭用自己的話寫一段摘要，第 5 層是極少數改造成你自己的作品。

重點在什麼時候加。Forte 說他不照任何時間表、不照任何順序摘要筆記，只在本來就為了別的事要看這則筆記時，順手加一層（[Forte, Part II](https://fortelabs.com/blog/progressive-summarization-ii-examples-and-metaphors/)）。很多筆記永遠不會被摘要，他認為這樣注意力才會留給真正有價值的筆記。他也提醒，重點劃得越多，越難一眼看到重點（[Forte, Part III](https://fortelabs.com/blog/progressive-summarization-iii-guidelines-and-principles/)）。

所以漸進摘要不該排進每週回顧。還有一點要分清：第 1 到 3 層的加粗、螢光，是為了之後好找；order 1 說的那一句自己的話，比較接近第 4 層。只劃線不算寫了那一句。

## 刪除、封存與降級

刪東西很難。Forte 的建議是讓用不到的東西自己沉下去，而不是逐一判斷要不要刪（[Forte, Part II](https://fortelabs.com/blog/progressive-summarization-ii-examples-and-metaphors/)）。研究指向類似的方向：Bergman 等人 2009 年做了一個實驗，給受試者一個「降級」選項，讓不重要的檔案移到資料夾底部的灰色區域，而不是只能刪除或保留。受試者降級的檔案比刪掉的多一倍多，資料夾也清得比較乾淨（[Bergman et al. 2009](https://doi.org/10.1145/1518701.1518745)）。

我會這樣分：

- **刪除**：重複的、已經有新版取代的、說不出用途的。
- **封存**：結束的專案、不再負責的領域，照 order 2 整個資料夾移進封存。
- **降級**：還不確定的，移到一個「冷凍區」資料夾，或加一個 `#冷凍` 標籤，不刪，但不再出現在眼前。

## LLM 能接手什麼

先講結論：讓 LLM 做那些你看過結果、自己決定收不收的工作；寫那一句自己的話、判斷什麼重要，留給自己。下面幾項研究量的都是「學到多少」或「有沒有檢查」，沒有直接測過筆記整理，所以下面的分工是我根據它們整理出的建議。

| 研究 | 做了什麼 | 結果 |
|---|---|---|
| [Chen et al. 2025](https://doi.org/10.1145/3757632) | 30 位學生看講座影片，比較三種 AI 協助：逐字稿、每 15 秒一段短摘要、每一兩分鐘一份完整筆記 | 短摘要組的閉卷成績最高，完整筆記組最低；短摘要被受試者自己改過的有 40%，完整筆記只有 8%。沒有完全不用 AI 的對照組 |
| [Melumad & Yun 2025](https://doi.org/10.1093/pnasnexus/pgaf316) | 七個實驗、超過一萬人，學一個主題後寫建議給朋友 | 用 ChatGPT 學的人寫得比自己搜尋的人短，也彼此相似 |
| [Etkin et al. 2025](https://doi.org/10.3389/feduc.2025.1506752) | 195 位大學年齡的受試者讀 ACT 閱讀文章，比較四種 AI 工具 | 用獨立的入學考試成績分組時，閱讀較好的人讀 AI 摘要取代原文會變差；蘇格拉底式的對話機器人則幫到閱讀較弱的人 |
| [Lee et al. 2025](https://doi.org/10.1145/3706598.3713778) | 319 位在工作上用生成式 AI 的人，填答 936 個實際例子 | 對 AI 完成某件事越有信心，越少自報做了批判思考；全是自評 |
| [Huq et al. 2025](https://doi.org/10.1145/3708359.3712086) | 12 人用 NoTeeline：自己打幾個字的重點，AI 擴寫成完整筆記 | 打字少了約一半，全部都想繼續用；沒有量學習效果 |

這張表有兩點要補充。第一，Etkin 那篇論文的主要結論是「AI 幫助弱者、傷害強者」，但它是用同一篇不用 AI 的文章成績來分組、又拿那篇成績當比較基準；偶然考低的人下一篇自然容易回升，這種分法本身就會做出「幫弱傷強」的樣子。這是我讀原文時的判斷，作者沒有討論。所以我只引改用獨立考試成績分組後還成立的兩項。第二，「越喜歡」只有 Chen 那篇有資料：受試者對完整筆記的評價，比只有逐字稿的高。

我會這樣分：

| 交給 LLM | 留給自己 |
|---|---|
| 列出每則收件匣項目可能的用途或可能重複的舊筆記，讓你決定去留 | 每則筆記那一句自己的話（order 1） |
| 找出重複或內容很像的筆記 | 判斷什麼重要、什麼可以刪 |
| 建議可能相關的筆記 | 連結的理由（order 3） |
| 把你先寫好的重點擴寫成完整句子 | 讀原文，而不是只讀摘要 |
| 把會議錄音轉成逐字稿 | 檢查 AI 給的摘要和連結對不對 |

左邊的共同點是你還要看過、決定要不要收下；右邊那幾步，正是 Chen 和 Etkin 的研究裡學習發生的地方。左邊幾項，目前沒有研究測過效果，是我的建議。

**隱私要先想清楚。** 把整個筆記庫交給雲端的 LLM 找重複、建議連結，等於把筆記內容送到別人的伺服器上，這和 [order 4](/posts/learning/2026-10-22-obsidian-notion-tool-choice) 談的「資料在自己手上」是兩件事。有私人日記、工作機密的人，可以只把特定資料夾交給 LLM，或改用在自己電腦上跑的模型。

想看把整理工作更大量交給 LLM 的做法，例如讓模型把一整批資料編譯成 wiki，可以讀〈[LLM 知識庫的三種模式](/posts/ai/2026-04-03-llm-knowledge-vault)〉和〈[LLM 知識管理全景](/posts/ai/2026-04-23-llm-knowledge-management-landscape)〉。

## 例子：一次 30 分鐘的每週回顧

**0–15 分鐘：清空收件匣（Get Clear）。** 照 order 1 的三步判準，每則決定進知識庫、只留連結、進待讀，或刪掉。可以先請 LLM 列出每則可能的用途和可能重複的舊筆記，你逐則看完再決定；那一句自己的話，不讓它寫。

**15–25 分鐘：處理專案和待讀（Get Current）。** 打開「專案」資料夾。這週結束的專案，挑出以後會用到的東西移到 Resources 或 Areas，其餘整個移進封存。待讀清單裡超過兩週沒讀的，刪掉或降級。

**25–30 分鐘：想一件新的事（Get Creative）。** 打開一張 MOC，看「還沒想清楚的」那一節，挑一個問題，寫下你現在的想法，一兩句就好；下週再接著寫。

時間是我的建議，依筆記量調整。重點是三段都要有：清空、跟上、想新的。

## 個人段總整理

| 做什麼 | 什麼時候 | 哪一篇 |
|---|---|---|
| 收：三步判準決定收不收 | 存的當下，或每週清收件匣時 | order 1 |
| 放：資料夾要淺、別太滿 | 每週處理專案時 | order 2 |
| 連：連結寫理由，筆記多了建 MOC | 每次寫永久筆記時 | order 3 |
| 裝：匯出一次、檢查專屬語法 | 每季 | order 4 |
| 養：每週回顧；摘要碰到才加 | 每週，以及每次打開筆記時 | order 5 |

## 換成同事讀，會發生什麼事

[order 0](/posts/learning/2026-10-22-knowledge-base-three-readers) 的例子是一則個人筆記：「年假：問 HR，表單在 Slack 置頂」。對你自己，這一句就夠，因為你記得是哪個 HR、哪個頻道。把它搬到團隊 wiki，新同事讀到時，「我知道這是什麼意思」就不成立了：他不知道要找誰、哪個頻道，也不知道這是不是去年的規定。

讀者從自己換成同事，前面五篇的四個問題都要重新回答一次：收什麼、怎麼組織、怎麼讓別人找到、誰來維護。這是團隊段要談的事，從 order 6〈團隊知識庫為什麼會爛掉，以及要寫哪幾種文件〉（撰寫中）開始。

## 研究的限制

每週回顧和漸進摘要都是方法作者的建議，我沒有找到檢驗它們效果的實證研究。AI 筆記的研究多半是單次、短時間的實驗：Chen 那篇是十分鐘左右的講座，Etkin 那篇是單篇閱讀測驗，都是立即測驗，沒有追蹤幾週後還記得多少，也不是長期經營一個知識庫的情境。Lee 那篇全是自評。

## 今晚可以做的事

1. **在行事曆排一個每週 30 分鐘。** 標題寫「筆記回顧」，照上面三段走。
2. **建一個冷凍區。** 一個資料夾或一個標籤，給還不確定要不要刪的東西。
3. **檢查你的 AI 工具。** 如果它會自動產生摘要或筆記，下一次用的時候，至少改寫其中一段成你自己的話。
4. **決定哪些筆記不給雲端 LLM 讀。** 把它們放在一個獨立的資料夾。

## 自我檢查

**問：** 讓 LLM 自動替每則筆記加標籤，有什麼風險？

**判準：** 有兩個。第一，標籤失去了「我的分類」的意義：order 2 說過，人找自己的東西靠的是記得放在哪；AI 加的標籤不是你決定的，你不會記得它，找的時候也就不會用它。第二，錯了不容易發現：Lee 等人的研究顯示，人對 AI 越有信心越少自己檢查，而標籤這種看似瑣碎的東西最容易被跳過。比較好的做法是讓 LLM 提出建議，你逐則看過再收下；或者照 order 2，標籤只用來標「待讀」「進行中」這類狀態，分類交給資料夾和連結。

## 參考資料

- [Van Kleek, Bernstein, Panovich, Vargas, Karger & schraefel 2009, Note to self: examining personal information keeping in a lightweight note-taking tool (CHI 2009)](https://doi.org/10.1145/1518701.1518924)
- [GTD Weekly Review Checklist (David Allen Company)](https://gettingthingsdone.com/wp-content/uploads/2014/10/Weekly_Review_Checklist.pdf)
- [Tiago Forte, Progressive Summarization: A Practical Technique for Designing Discoverable Notes](https://fortelabs.com/blog/progressive-summarization-a-practical-technique-for-designing-discoverable-notes/)
- [Tiago Forte, Progressive Summarization II: Examples and Metaphors](https://fortelabs.com/blog/progressive-summarization-ii-examples-and-metaphors/)
- [Tiago Forte, Progressive Summarization III: Guidelines and Principles](https://fortelabs.com/blog/progressive-summarization-iii-guidelines-and-principles/)
- [Bergman, Tucker, Beyth-Marom, Cutrell & Whittaker 2009, It's not that important: demoting personal information of low subjective importance using GrayArea (CHI 2009)](https://doi.org/10.1145/1518701.1518745)
- [Chen et al. 2025, More AI Assistance Reduces Cognitive Engagement: Examining the AI Assistance Dilemma in AI-Supported Note-Taking (CSCW 2025)](https://doi.org/10.1145/3757632)
- [Melumad & Yun 2025, Experimental evidence of the effects of large language models versus web search on depth of learning (PNAS Nexus)](https://doi.org/10.1093/pnasnexus/pgaf316)
- [Etkin et al. 2025, Differential effects of GPT-based tools on comprehension of standardized passages (Frontiers in Education)](https://doi.org/10.3389/feduc.2025.1506752)
- [Lee et al. 2025, The Impact of Generative AI on Critical Thinking: Self-Reported Reductions in Cognitive Effort and Confidence Effects From a Survey of Knowledge Workers (CHI 2025)](https://doi.org/10.1145/3706598.3713778)
- [Huq et al. 2025, NoTeeline: Supporting Real-Time, Personalized Notetaking with LLM-Enhanced Micronotes (IUI 2025)](https://doi.org/10.1145/3708359.3712086)
