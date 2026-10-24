---
title: "寫給同事看：how-to 模板、決策紀錄，與寫少一點"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, wiki, documentation, adr]
lang: zh-TW
tldr: "團隊文件要長得差不多、看得懂，靠的是兩份模板和一條原則。原則是寧可少而新鮮：Google 的文件指南說，少量但新鮮正確的文件，勝過大量年久失修的文件，別處有的就連過去。how-to 模板照「先決條件、步驟、怎麼確認成功、出問題找誰」排；一項研究裡，照模板改寫的安裝說明在讀者評分的十個面向中有八個較好。決策紀錄（ADR）記下當時為什麼這樣決定，推翻時不刪、標成「已被取代」並連到新決定。研究也看到 ADR 常常試了沒繼續、「考慮過的選項」那段問題最多，常常沒寫或寫錯地方，所以模板要短，那一段要留著。"
description: "知識庫怎麼建 order 8：Google 文件指南的「寫少一點、不重複」、how-to 和教學的寫法差在哪、一份 how-to 模板與改寫前後、ADR 的欄位與 superseded、Nygard 和 MADR 兩種模板的研究比較，以及開源專案裡 ADR 的實際樣子。"
series:
  name: "知識庫怎麼建"
  order: 8
---

> 🌏 [English version](/posts/learning/2026-10-22-team-docs-templates-adr-en)

團隊裡三個人各寫了一份部署文件。一份是十二個步驟，沒說要先裝什麼；一份是一大段文字，把為什麼這樣部署和怎麼部署混在一起；一份寫得很好，但三個月前改過流程，沒人更新。新人照著第一份做，第五步就卡住了。

這篇是「知識庫怎麼建」團隊段的第三篇。[order 6](/posts/learning/2026-10-22-team-wiki-why-it-rots) 談了團隊該寫哪幾種文件，[order 7](/posts/learning/2026-10-22-team-wiki-information-architecture) 談了這些文件放在哪、標題怎麼取，這篇談一頁裡面怎麼寫。誰負責維護留給 order 9。讀完你能替團隊寫出兩份模板：一份 how-to（操作指南），一份 ADR（架構決策紀錄）。

## 先寫少一點

Google 公開的文件指南開頭就說：「A small set of fresh and accurate docs is better than a large assembly of "documentation" in various states of disrepair.」少量但新鮮正確的文件，勝過一大堆年久失修的文件（[Google docguide: Best practices](https://google.github.io/styleguide/docguide/best_practices.html)）。重點是新鮮和正確，不是越少越好。同一頁還有兩條對團隊 wiki 很實用：

- **別處有的，連過去，不要自己再寫一份。** 原文是「Do not write your own guide to a common Google technology or process. Link to it instead.」原本那份過時了，就去原處補。這跟 order 7 的入口頁是同一個道理：內容只有一份。
- **短而有用。** 刪掉不必要的內容，包括過時、錯誤和重複的資訊。

這些是 Google 的寫作規範，不是研究結論。它寫的是 Google 內部的工程文件，不過我覺得「寫少一點、別重複」搬到一般團隊也成立：每多一份文件，就多一份要維護的東西，這是 order 9 的主題。

## how-to 和教學，寫法不一樣

order 6 用 Diátaxis 把文件分成四種。Diátaxis 的作者說，軟體文件裡最常見的混淆，就是把教學和 how-to 寫在一起。Diátaxis 對 how-to 的定義是：幫一個「已經會的人」完成一件實際的事（[Diátaxis: How-to guides](https://diataxis.fr/how-to-guides/)）。所以它跟教學的寫法正好相反：

| | 教學（tutorial） | 操作指南（how-to） |
|---|---|---|
| 讀者 | 第一次接觸的人 | 已經會、現在要做事的人 |
| 標題 | 「從零做出第一個功能」 | 「怎麼把服務部署到正式環境」：寫目標，不寫工具名 |
| 解釋 | 盡量少，帶著做就好 | 幾乎不要；為什麼放到說明類文件，連過去 |
| 選項 | 不給選擇，只走一條路 | 可以有分支：「如果是 A，做這個；如果是 B，做那個」 |

how-to 也不放「為什麼」：那是說明類文件的事。開頭那份「一大段文字」的部署文件，問題就是把說明和操作混在一起。拆開之後，how-to 只留步驟，為什麼這樣部署另寫一頁說明，兩頁互相連結。

## how-to 模板

Google 文件指南建議每份文件的骨架是：標題、一到三句話說這是什麼、目錄、各段內容、相關連結（[Google docguide: Style](https://google.github.io/styleguide/docguide/style.html)）。Gao 等人 2025 年研究開源專案 README 的安裝說明怎麼被修改，整理出一份模板：先決條件、安裝步驟、怎麼確認安裝成功、基本用法、外部文件、版本紀錄、求助管道（[Gao et al. 2025](https://doi.org/10.1109/TSE.2025.3552614)）。

把兩者合起來，套到團隊內部的 how-to，我會用這個版本：

~~~markdown
# 怎麼〔完成某件事〕

一到兩句：這份文件幫你做到什麼、適用在什麼情況。

**負責人**：〔名字或角色〕　**最後確認**：〔日期〕

## 開始之前
- 需要的權限、工具、版本

## 步驟
1. 〔動作〕
   ```
   〔可以直接複製的指令〕
   ```
2. ……

## 怎麼確認成功
- 看到什麼畫面、跑什麼指令會得到什麼結果

## 出問題時
- 常見錯誤與處理
- 還是不行，找誰、到哪個頻道問

## 相關文件
- 為什麼這樣做：〔說明類文件連結〕
- 規格：〔參考資料連結〕
~~~

我覺得「怎麼確認成功」最容易被漏掉。少了它，照著做的人不知道自己是真的做完了，還是在某一步默默失敗了。

**模板有沒有用？** Gao 等人用 ChatGPT 依這份模板改寫一批 README，請 IT 從業者盲評。改寫後的版本在十個面向裡有八個評分顯著較高，進步最多的是結構；清楚程度和一致性則沒有差別。有三個限制要知道：改寫是 LLM 做的，所以分不出是模板的功勞還是 LLM 的；評分者只讀、沒有照著安裝，所以量到的是閱讀感受，不是正確性；作者把改寫以 PR 送給各專案，願意看 LLM 改寫的專案裡也有人不滿意，理由之一是通用模板少了他們專案特有的段落，另有幾個專案直接拒絕 LLM 產生的內容。

所以模板是起點，不是終點：每個團隊都會有自己非寫不可的段落，加進去就好。

## 例子：一份 how-to，改寫前後

**改寫前：**

> **部署**
>
> 我們用 GitHub Actions 部署，因為之前用 Jenkins 太慢了。先 merge 到 main，然後 Actions 會跑，跑完之後要去 Cloudflare 看一下。有時候會失敗，失敗的話重跑就好，不行就問小王。記得要先設好 secret。

**改寫後：**

> **怎麼把網站部署到正式環境**
>
> 把 main 分支上的改動發布到正式網站。只適用前端網站，API 服務另見〈怎麼部署 API〉。
>
> **負責人**：前端值班　**最後確認**：2026-10-01
>
> **開始之前**：你需要 repo 的寫入權限；`CLOUDFLARE_API_TOKEN` 已設定在 repo 的 secrets（沒有的話找前端值班）。
>
> **步驟**
> 1. 把 PR 合併到 `main`。
> 2. 到 Actions 分頁，等「Deploy」這個 workflow 跑完，約 5 分鐘。
>
> **怎麼確認成功**：workflow 顯示綠色勾勾；打開正式網站，頁尾的版本號和最新的 commit 一致。
>
> **出問題時**：workflow 失敗，先按 Re-run；連續失敗兩次，到 #frontend 頻道貼上錯誤訊息。
>
> **相關文件**：〈ADR 7：以 GitHub Actions 部署前端〉（決策紀錄）

改寫前那段的「因為之前用 Jenkins 太慢了」，是一個決策的理由，被埋在操作步驟裡。它值得被好好記下來，這就是下面的 ADR。

## 決策紀錄：ADR

**為什麼要記。** Michael Nygard 2011 年提出架構決策紀錄（Architecture Decision Record，ADR）時寫道，新人面對一個看不懂的舊決定，只有兩條路：盲目接受，或盲目改掉（[Nygard 2011](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)）。盲目接受累積多了，團隊會什麼都不敢動；盲目改掉，可能弄壞當初要保護的東西。order 6 提過的 Ahmeti 等人 2024 年行動研究裡（[Ahmeti et al. 2024](https://doi.org/10.1007/978-3-031-70797-1_22)），團隊在導入 ADR 之前，決策的來龍去脈只存在少數人的記憶裡，人一走就沒了。

**Nygard 的五個欄位：**

1. **標題**：短的名詞片語，例如「ADR 7：以 GitHub Actions 部署前端」。
2. **背景**：當時有哪些考量和限制，只陳述事實。
3. **決定**：用「我們決定……」的完整句子寫。
4. **狀態**：提議中、已採用、已棄用、已被取代。
5. **後果**：好的、壞的、中性的都寫。

他建議一份 ADR 只寫一個決定，長度一到兩頁，「寫得像在跟未來的開發者對話」。ADR 依序編號，號碼不重複使用。

**推翻時不刪。** Nygard 的原話是：「If a decision is reversed, we will keep the old one around, but mark it as superseded.」舊的決定還是有意義：它說明了當時為什麼這樣做。MADR 這個後來的模板，把這件事直接寫進狀態欄：`superseded by ADR-0123`，舊紀錄上就有通往新決定的連結（[MADR](https://adr.github.io/madr/)）。

**MADR 多了一段「考慮過的選項」。** Nygard 的五個欄位裡沒有這一段，MADR 則把它放進最精簡的模板裡，理由是：不知道當時比較過哪些選項，就很難理解為什麼選了這個。Ahmeti 研究裡的團隊也是用 Nygard 的格式，再自己加上「考慮過的選項」。

## ADR 在實際專案裡長什麼樣子

ADR 的研究不多，但有幾項值得知道：

- **多數試了沒繼續。** Buchgeher 等人 2023 年發表的研究，找出到 2020 年底為止 GitHub 上用過 ADR 的 921 個專案，超過一半只寫了寥寥幾份（[Buchgeher et al. 2023](https://doi.org/10.1109/ACCESS.2023.3287654)）。作者的解讀是這些專案試過，但沒有持續用下去；他們沒有調查原因。
- **問題最多的是「考慮過的選項」。** Miccio 等人 2026 年用 LLM 分析了 4,316 份開源專案的 ADR，「背景」和「決定」大多寫得完整，「考慮過的選項」這一段在多數 ADR 裡不是沒有、就是放錯地方（[Miccio et al. 2026](https://arxiv.org/abs/2609.07375)）。不過這批 ADR 大多用 Nygard 的格式，本來就沒有這一欄，所以有一部分只是模板沒要求。這篇也還是預印本。
- **短模板寫得快，長模板理由寫得清楚。** Nogueira 等人 2026 年請 33 名學生分別用 Nygard 和 MADR 寫 ADR，Nygard 的綜合分數較高；但這個分數有一半看「效率與易用」，也就是填寫時間、查說明的次數和自評的客觀程度，欄位少本來就占便宜（[Nogueira et al. 2026](https://arxiv.org/abs/2604.27333)）。作者自己先評時 MADR 略勝，學生實驗才反過來。在質性回饋裡，學生說 MADR 把決策理由解釋得比較清楚，也覺得它比較繁雜。
- **討論常不在 ADR 裡。** Buchgeher 等人轉述的一個業界經驗是，ADR 適合記結論，但不適合拿來討論，討論改在聊天室進行。

把這些放在一起，我的建議是：用 Nygard 的五個欄位，加上一段「考慮過的選項」，頂多再補日期和決策者，就停在這裡。模板越長，越沒人寫；但少了選項，紀錄就只剩結論。

**什麼值得寫 ADR？** Nygard 的範圍是「影響結構、非功能需求、依賴、介面或建構方式」的決定。實際上 ADR 的用途比這廣：Miccio 那批資料裡，約五分之一記的是流程類的決定，例如 CI/CD、變更紀錄、審核流程、測試。Ahmeti 研究裡的架構師也說，最難的是判斷一個改動算不算值得記的決定。一個實用的判準是：半年後會有人問「當初為什麼這樣做」嗎？會，就寫。

## 例子：一份 ADR

```markdown
# ADR 7：以 GitHub Actions 部署前端

**狀態**：已採用（2026-03-02）；取代 ADR 3
**決策者**：前端小組

## 背景
Jenkins 部署一次要 20 分鐘，伺服器只有一個人會維護，他下個月調到別的團隊。
程式碼已經在 GitHub，Cloudflare 有官方的 Actions 範例。

## 考慮過的選項
- 繼續用 Jenkins，找人接手維護
- GitHub Actions
- Cloudflare 內建的 Git 整合

## 決定
我們決定改用 GitHub Actions。它不需要自己維護伺服器，
而且部署設定跟著程式碼一起版本控制、一起審。
Cloudflare 內建整合設定最簡單，但我們要在部署前跑完整測試，放在同一個 workflow 比較好管。

## 後果
- 好：不用維護 Jenkins；部署約 5 分鐘。
- 壞：每月免費額度有上限，超過要付費。
- 中性：部署 secrets 改存在 GitHub，權限要重新整理。
```

ADR 3 那份舊紀錄不刪，只把狀態改成「已被取代，見 ADR 7」。

## 研究的限制

Google 文件指南、Nygard 和 MADR 都是作者或社群的主張，不是研究結果。看大量 ADR 的研究都只看公開的 GitHub 專案，放在公司 wiki 裡的 ADR 看不到；Nogueira 的實驗是學生、Ahmeti 只有三個月。模板的證據只有 Gao 一篇，研究的是對外的 README 安裝說明，不是團隊內部文件。

## 今晚可以做的事

1. **挑團隊最常被問的一件事，用上面的 how-to 模板重寫。** 特別補上「怎麼確認成功」和「出問題找誰」。
2. **把文件裡的「因為……」挑出來。** 埋在操作步驟裡的理由，搬到一份 ADR 或說明類文件，原處留連結。
3. **補寫一份最近的決定。** 選一個最近三個月做的、半年後會有人問為什麼的決定，用五個欄位加「考慮過的選項」寫下來。
4. **建一個放 ADR 的地方，並寫一句「什麼要記」。** Ahmeti 等人的結論是，存放位置和清楚的「該記什麼」指引，是 ADR 用不用得起來的關鍵。

## 自我檢查

**問：** 團隊一年前決定用 A 資料庫，現在要換成 B。當初那份 ADR 該刪掉嗎？

**判準：** 不刪。新寫一份 ADR 記下為什麼換成 B，舊的那份把狀態改成「已被取代」，並連到新的那份。舊紀錄說明了當時為什麼選 A，有人問「當初怎麼會選 A」的時候答得出來，也能避免後人在條件變回來時又重新爭論一次。刪掉的話，連這次為什麼換也會變得難懂，因為新紀錄的背景少了前一段。

## 參考資料

- [Google docguide: Best practices](https://google.github.io/styleguide/docguide/best_practices.html)
- [Google docguide: Markdown style guide](https://google.github.io/styleguide/docguide/style.html)
- [Diátaxis: How-to guides](https://diataxis.fr/how-to-guides/)
- [Gao, Treude & Zahedi 2025, Adapting Installation Instructions in Rapidly Evolving Software Ecosystems (IEEE TSE)](https://doi.org/10.1109/TSE.2025.3552614)
- [Nygard 2011, Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [MADR: Markdown Architectural Decision Records](https://adr.github.io/madr/)
- [Ahmeti et al. 2024, Architecture decision records in practice: an action research study (ECSA 2024)](https://doi.org/10.1007/978-3-031-70797-1_22)
- [Buchgeher et al. 2023, Using Architecture Decision Records in Open Source Projects—An MSR Study on GitHub (IEEE Access)](https://doi.org/10.1109/ACCESS.2023.3287654)
- [Miccio, Tommasel & Diaz-Pace 2026, A Text Mining and Classification Approach for Analyzing Architecture Decision Records (arXiv)](https://arxiv.org/abs/2609.07375)
- [Nogueira, Silva & Conte 2026, One Size Fits All? An Empirical Comparison of ADR Templates regarding Comprehension, Usability, and Ease of Adoption (EASE 2026, arXiv)](https://arxiv.org/abs/2604.27333)
