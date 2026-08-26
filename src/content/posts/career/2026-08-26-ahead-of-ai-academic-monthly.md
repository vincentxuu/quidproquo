---
title: "Ahead of AI：一位學者用月更深度文做到 20 萬訂閱的反直覺路線"
date: 2026-08-26
category: career
type: deep-dive
tags: [newsletter, creator-economy, machine-learning, academia, substack, llm, content-creation]
lang: zh-TW
series:
  name: "一個人的媒體公司"
  order: 5
tldr: "計算生物學博士、前威斯康辛大學統計系教授 Sebastian Raschka，2022 年在 Substack 創辦 Ahead of AI，用月更長文拆解 LLM 論文與架構，四年做到 20 萬+訂閱。他刻意不接贊助、不追日更，靠書籍和付費訂閱變現，證明低頻高深度在 AI 電子報紅海裡也能走出一條路。"
description: "Ahead of AI 創辦人 Sebastian Raschka 的完整成長歷程：從計算生物學博士、UW-Madison 教授到 Lightning AI 研究工程師，再到 20 萬訂閱技術電子報的時間線、內容策略、商業模式與方法論。"
draft: false
---

> 🌏 [English version](/en/posts/career/2026-08-26-ahead-of-ai-academic-monthly-en)

AI 電子報領域的多數成功案例都在追頻率——日更、五分鐘摘要、每天一張圖。Sebastian Raschka 反過來做：每月一到兩篇，每篇讀完要 30–90 分鐘，主題是 LLM 架構論文的深度拆解。四年後，他的 Ahead of AI 有 20 萬+訂閱者，而他從來沒有接過一筆贊助。

## 背景：從分子辨識到大型語言模型

Sebastian Raschka 的學術起點不是 AI——他在密西根州立大學拿的博士學位是計算生物學，論文主題是「用統計資料探勘揭開分子辨識的隱藏模式」。轉向機器學習的契機是 2012 年修了 Andrew Ng 在 Coursera 的開創性 ML 課程。

2015 年，他出版了第一本書 *Python Machine Learning*（Packt），後來出到第三版，成為該領域的暢銷教材。這本書讓他在 ML 社群建立了「寫得清楚、講得明白」的聲譽——後來電子報能起步，這個聲譽是最重要的初始資產。

2018 年，他加入威斯康辛大學麥迪遜分校統計系擔任助理教授，教的卻是深度學習。學術界的節奏和 AI 領域的爆發速度之間有巨大落差——他想分享的東西太多，但論文和課程的格式都裝不下那些「小而有趣的洞見」。

2022 年，他做了兩個重大決定：加入 Lightning AI（PyTorch Lightning 背後的公司）擔任 Staff Research Engineer，同時在 Substack 創辦了 Ahead of AI。

他在創刊部落格文章裡寫得很直白：

> 「There are many smaller but exciting topics I'd love to share and write about that don't fit the blog format.」

電子報成了他介於部落格長文和社群短文之間的第三種容器。

## 成長時間線

| 時間 | 里程碑 |
|---|---|
| 2015-09 | 出版 *Python Machine Learning*（Packt），建立 ML 教育者聲譽 |
| 2018 | 加入 UW-Madison 統計系任助理教授 |
| 2022-10-15 | 在 Substack 創辦 Ahead of AI，第一期〈A Diffusion of Innovations〉 |
| 2022 | 同年加入 Lightning AI 擔任 Staff Research Engineer |
| 2022 | 出版 *Machine Learning with PyTorch and Scikit-Learn*（Packt） |
| 2023-04（約 6 個月） | 突破 1.5 萬訂閱 |
| 2024-02（約 16 個月） | 突破 5 萬訂閱 |
| 2024-10 | 出版 *Build a Large Language Model (From Scratch)*（Manning） |
| 2026-07 | 突破 20 萬訂閱；出版 *Build a Reasoning Model (From Scratch)*（Manning） |
| 2026-08 | LLMs-from-scratch GitHub repo 突破 10 萬 stars |

和日更型電子報的爆發式成長不同，Ahead of AI 的成長曲線是穩定的長坡——前 6 個月 1.5 萬，16 個月到 5 萬，四年到 20 萬。沒有「五個月超過全職薪水」的戲劇性時刻，但也沒有「撐不下去要找合夥人」的焦慮。

## 內容策略：論文翻譯機，不是新聞策展人

Ahead of AI 的核心格式是**每月一到兩篇長文，每篇 30–90 分鐘閱讀時間**，主題集中在 LLM 架構、訓練方法、推論最佳化。

和 Daily Dose of Data Science 的 150 字日更圖文、TLDR 的 5 分鐘新聞摘要相比，Ahead of AI 走的完全是另一條路。Sebastian 不是在「選哪些新聞值得讀」，而是在「把一篇或一組論文讀通，用圖表和程式碼片段翻譯成工程師能理解的語言」。

他的工作流程散佈在整個月：

1. **日常掃描**：每天早上瀏覽 X 和 arXiv，把有趣的論文標記下來
2. **選題過濾**：從標記的 30–50 篇論文裡，選出自己真正想深入的主題
3. **逐篇拆解**：每篇論文花 30–60 分鐘閱讀、筆記、製作圖表
4. **收束成文**：週末把散落的筆記收束成一篇連貫的長文

他在 Interconnects 的訪談中特別強調選題策略：**只寫自己真正感興趣的論文**。這不是行銷話術——他的邏輯是，如果自己讀得沒熱情，寫出來的東西讀者也能感覺到。低頻出刊讓他有這個奢侈：不用為了填版面而寫不想寫的東西。

內容方向也隨時間演變。早期涵蓋的範圍較廣（擴散模型、通用 AI 趨勢），後來幾乎完全聚焦在 LLM——架構變體、注意力機制、推論時擴展、開源模型比較。這個收窄不是刻意規劃的，而是跟著 AI 領域的重心轉移自然發生的，也正好和他在 Lightning AI 維護 LitGPT 的工作完全重疊。

## 商業模式：書籍先行，電子報是飛輪

Sebastian Raschka 的變現路徑和多數電子報創作者截然不同：

1. **書籍**（主力）：五本書橫跨十年——*Python Machine Learning*（2015/2017/2019 三版）、*Machine Learning with PyTorch and Scikit-Learn*（2022）、*Machine Learning Q and AI*、*Build a Large Language Model (From Scratch)*（2024）、*Build a Reasoning Model (From Scratch)*（2026）。書籍版稅是他最穩定的收入來源。
2. **Substack 付費訂閱**（$6/月）：付費解鎖完整文章檔案庫和深度技術文。目前有 1,000+ 付費訂閱者。
3. **全職工作**（Lightning AI）：他從來不是全職做電子報——Lightning AI 的 Staff Research Engineer 是他的本業，電子報是副業。
4. **開源 + GitHub**：LLMs-from-scratch repo 10 萬+ stars，是書籍的配套程式碼，同時也是電子報的讀者發現管道。

**他刻意不接贊助。** 在 Interconnects 訪談裡，他把電子報定位為「社群貢獻」而不是「商業產品」。這個選擇犧牲了短期收入，但換來了內容的完全獨立性——讀者知道他推薦的工具或論文沒有利益衝突。

這和 TLDR、Morning Brew 的廣告模式形成鮮明對比。他不需要百萬訂閱來撐廣告費，因為他的收入結構根本不依賴訂閱規模。電子報的角色更像是**書籍銷售的持續行銷管道**和**個人品牌的信任資產**。

## 可持續月更四年的方法論

月更聽起來比日更輕鬆，但技術深度文章的單篇投入遠高於策展摘要。Sebastian 能持續四年不間斷，有幾個結構性原因：

**本業和副業的主題完全重疊。** 他在 Lightning AI 的工作就是研究 LLM 架構和維護 LitGPT——讀論文、理解架構本來就是工作的一部分，電子報只是把這些理解整理成文字。他不需要額外花時間「找素材」。

**低頻降低決策疲勞。** 日更型創作者每天面臨「今天寫什麼」的壓力，月更只需要每月做一到兩次選題決策。他可以等到真正有值得寫的主題再動筆。

**學術訓練帶來的寫作紀律。** 十年的論文寫作和教科書寫作經驗，讓他對「把複雜概念用圖表和分步解釋講清楚」這件事已經建立了成熟的工作流程。

**內在動機大於外在激勵。** 他在訪談中說過：「There's like a reward in a sense」——讀者的回饋和自己在寫作中發現知識盲區，是讓他持續寫的主要動力。這和 Daily Dose 的 Avi Chawla 維護「讀者正面回饋文件」來對抗低潮有異曲同工之處。

**用 LLM 輔助但不取代寫作。** 他會用 LLM 做改寫和評估，但維持人工編輯控制。技術深度文的價值在於作者的判斷力——哪些論文值得讀、哪些細節重要、哪些宣稱需要懷疑——這些沒辦法外包給 AI。

## 他的教訓

**書和電子報是互相餵養的飛輪。** 電子報的長期讀者是新書的第一批買家，書的讀者透過 GitHub repo 和參考資料發現電子報。他不需要做任何行銷——內容本身就是行銷。

**不接贊助是一種定位策略。** 在 AI 電子報充斥贊助內容的環境裡，「這個人從不接贊助」本身就是差異化。讀者信任他的推薦，因為他們知道推薦背後沒有商業考量。

**學術背景是護城河，不是包袱。** 很多從學術界轉出來的人會覺得學術訓練在業界沒用。但 Sebastian 的論文閱讀能力、圖表製作能力、和系統性解釋複雜概念的能力，全部來自學術訓練——而這些恰好是技術電子報最需要的技能。

## 整體來說

Ahead of AI 的成功建立在幾個特殊條件上：Sebastian 在 ML 社群已有十年寫作聲譽（不是從零開始）、他的全職工作和電子報主題完全重疊（不需要額外時間成本）、LLM 恰好是 2022–2026 年最熱門的技術領域（需求端持續膨脹）、他有暢銷書作為獨立於訂閱數的收入來源（不需要靠電子報養活自己）。

但真正值得注意的是他的**反直覺選擇**：在所有人都在追日更和廣告的時候，他選了月更和不接贊助。這個選擇之所以成立，是因為他把電子報定位為書籍飛輪的一環，而不是獨立的商業產品。

對想做技術內容創作的人來說，這個案例最大的啟示是：**不是每個電子報都要靠訂閱數變現。** 如果你有其他收入來源（書、課程、全職工作），電子報可以是純粹的信任資產——用來建立讀者對你專業判斷力的信任，然後在書籍、課程或職涯機會上變現。低頻高深度不是妥協，是一種策略。

## 參考資料

- [Ahead of AI — Substack](https://magazine.sebastianraschka.com/)
- [Ahead of AI 創刊緣起（Sebastian Raschka 部落格）](https://sebastianraschka.com/blog/2022/ahead-of-ai-and-whats-next.html)
- [Sebastian Raschka — 1.5 萬訂閱里程碑 Substack Note](https://substack.com/@rasbt/note/c-15347818)
- [Sebastian Raschka — 5 萬訂閱里程碑 Substack Note](https://substack.com/@rasbt/note/c-50030862)
- [Interviewing Sebastian Raschka on the state of open LLMs, Llama 3.1, and AI education（Interconnects）](https://www.interconnects.ai/p/interviewing-sebastian-raschka)
- [LLMs From Scratch at 100,000 GitHub Stars（Sebastian Raschka 部落格）](https://sebastianraschka.com/blog/2026/llms-from-scratch-reaches-100000-github-stars.html)
- [rasbt/LLMs-from-scratch — GitHub](https://github.com/rasbt/LLMs-from-scratch)
- [Build a Large Language Model (From Scratch) — Manning](https://www.manning.com/books/build-a-large-language-model-from-scratch)
- [Build a Reasoning Model (From Scratch) — Manning](https://www.manning.com/books/build-a-reasoning-model-from-scratch)
- [Lex Fridman Podcast #490 — State of AI in 2026（with Sebastian Raschka & Nathan Lambert）](https://lexfridman.com/ai-sota-2026-transcript/)
- [Sebastian Raschka — 個人網站](https://sebastianraschka.com/)
