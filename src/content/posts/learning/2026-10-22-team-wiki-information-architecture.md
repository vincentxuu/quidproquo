---
title: "資訊架構：團隊 wiki 要按部門分還是按任務分，以及怎麼驗證"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, wiki, information-architecture, card-sorting]
lang: zh-TW
tldr: "團隊 wiki 常見的爭論是按部門分還是按任務分。研究的答案比想像中保守：熟悉組織圖的員工用按部門分的內網反而比較快，標籤取得好不好的影響也比分類方式大得多。比較穩的做法是：主結構選一個每頁都找得到負責人的分法，再加幾頁按任務整理的入口頁、只放連結；頁面標題寫讀者會搜的字。動手分之前用卡片分類找出讀者怎麼想，分完用樹狀測試驗證找不找得到。"
description: "知識庫怎麼建 order 7：按部門與按任務分類的研究與取捨、GitLab Handbook 的做法、頁面標題怎麼取、卡片分類法與樹狀測試怎麼做、要幾個人，以及同一批文件的兩種樹。"
series:
  name: "知識庫怎麼建"
  order: 7
---

> 🌏 [English version](/posts/learning/2026-10-22-team-wiki-information-architecture-en)

新人想知道怎麼申請出差，打開公司 wiki，看到的頂層是「人資部」「財務部」「行政部」「工程部」。出差該找哪一個？申請表在財務部，規定在人資部，訂機票的流程在行政部。每個部門都把自己的部分寫好了，新人卻要點開三個地方才拼得出答案。

這篇是「知識庫怎麼建」團隊段的第二篇。[order 6](/posts/learning/2026-10-22-team-wiki-why-it-rots) 談了團隊 wiki 為什麼會爛、要寫哪幾種文件，這篇談這些文件怎麼分層、怎麼命名，讓新人找得到。頁面內文怎麼寫留給 order 8。讀完你能替團隊 wiki 畫出兩層架構，用卡片分類找出讀者的分法，再用樹狀測試驗證。

## 按部門分，還是按任務分

**按任務分的好處，主要是觀察，不是對照實驗。** Nielsen Norman Group（NN/g）多年研究企業內網，觀察到按任務組織的內網比按部門組織的更撐得過組織改組，因為內容的位置不取決於誰負責或誰寫的（[NN/g 2014](https://www.nngroup.com/articles/intranet-information-architecture-ia/)）。他們 2024 年整理 57 個內網的指南也寫道，按部門組織資訊會讓人難找（[NN/g 2024](https://www.nngroup.com/articles/intranet-usability-guidelines/)）。不過 NN/g 也承認，按部門分的好處是方便維護：每一區都知道歸誰。

**有實驗的研究，結果反而偏向部門。** Cozijn 等人 2007 年在一家公司的行銷部門做了實驗：同一批內網內容，一組按部門分，一組按工作任務分（[Cozijn et al. 2007](https://doi.org/10.2190/382G-91T8-T06R-2L52)）。從第一次點擊到找到資料的搜尋時間，按任務分那組多出一倍以上；研究者認為，這是因為受試者熟悉組織圖。錯誤數兩組沒有顯著差異，但每組不到十人，這不代表兩種分法一樣準。按任務分那組做了幾題之後越來越快，但研究沒有直接比較兩組最後是否打平，作者自己也說不確定這個學習成本值不值得。

另外，兩版的連結文字也不一樣：部門版是名詞，任務版是動詞。有一題還因為任務版的標籤誤導受試者而被剔除，作者也說按任務分的標籤要特別花心思。這個實驗只有 20 人，都是熟悉公司組織圖的行銷部員工。

**標籤的影響比分類方式大。** Resnick 和 Sánchez 2004 年在購物網站上同時改變分類方式和標籤品質（[Resnick & Sánchez 2004](https://doi.org/10.1518/hfes.46.1.104.30390)）。標籤品質對完成時間、錯誤次數和滿意度都有明顯影響。分類方式對完成時間沒有顯著影響；它對錯誤和滿意度的影響主要出現在標籤差的時候，而且是按商品分的那組比較好。另一個值得注意的發現是：研究者先請另一組人做卡片分類，大多數人按任務分組，但實際用起來，按任務分的版本並沒有比較快。使用者自己分出來的分法，不一定是他們用起來最快的分法。

**GitLab 選了職能，也承認這樣違反直覺。** GitLab 公開的 [Handbook](https://handbook.gitlab.com/) 有三千多頁，頂層按職能分。他們的說法是，這樣每一份內容都有位置、也有負責人能保持更新，並承認「Adhering to this hierarchy is sometimes counter-intuitive.」（[Handbook Usage](https://handbook.gitlab.com/handbook/about/handbook-usage/)）。為了補償，他們要求標題寫得具體、讓人搜得到，每頁頂端都有搜尋；需要從另一個角度看時，例如新人入職，就做一頁只放連結、不複製內容的頁面。他們明文不做常見問題、快速連結這類頁面。

## 結論：主結構看誰負責，入口頁看讀者要做什麼

把上面幾項放在一起，我的建議是：

1. **主結構選一個每頁都找得到負責人的分法。** 多數團隊就是按部門或職能；如果你的 wiki 只屬於一個團隊，「部門」就換成負責的小組、系統或人。這是 order 6 說的「誰來維護」問題，分類方式要幫它，不是跟它作對。代價是組織調整時，頁面要跟著搬家；搬的時候留轉址，入口頁就不會斷。
2. **加幾頁按任務整理的入口頁。** 例如「新人第一週」「出差」「請假」，裡面只放連結，指到各部門的原始頁面。內容只有一份，入口可以有很多個。
3. **花最多力氣在標籤上。** 頁面標題、資料夾名稱，用讀者會搜的字。

這裡有一個兩邊說法不同的地方：NN/g 2024 年的指南把詞彙表、取了好名字的快速連結列為好用的導覽，GitLab 卻明文不做。GitLab 給的理由是這類頁面很難保持更新，也跟按職能組織的結構不合。我的解讀是，GitLab 擔心的是答案被複製一份、之後沒人更新；入口頁只放連結、不放內容，就避開了這個問題。

## 頁面標題怎麼取

讀者搜尋或瀏覽目錄時，最先看到的通常就是標題。我的幾個原則：

- **寫讀者會搜的字，不寫內部代號。** 「出差申請」比「財務表單 F-07」好；「請假」比「假別管理辦法」好找。
- **寫內容是什麼，不寫什麼時候寫的。** 「Q3 會議紀錄」說的是時間，讀者要找的是會議裡的決定。
- **一頁一件事，標題說得出那件事。** 如果標題要用「與」「及」連三件事，大概要拆成三頁。

## 卡片分類與樹狀測試

這兩種方法用在不同時間點：分之前（或改版之前）用卡片分類了解讀者怎麼分，分完之後用樹狀測試驗證讀者找不找得到。

**卡片分類（card sorting）**：把頁面標題寫在卡片上，請受試者自己分組、自己命名（[NN/g Card Sorting](https://www.nngroup.com/articles/card-sorting-definition/)）。

- **卡片數**：NN/g 建議 30 到 50 張，避免受試者做到疲累、亂分。這是他們的經驗值，不是實驗結果。
- **開放式優先**：讓受試者自己決定有哪些組。要驗證現有的分類，NN/g 建議改用樹狀測試。
- **NN/g 建議的人數**：質性研究至少 15 人；量化研究要 30 到 50 人。
- **原始研究的人數**：常被引用的 Tullis 和 Wood 2004 年的結論是 20 到 30 人（[Tullis & Wood 2004](https://www.researchgate.net/publication/254164354_How_Many_Users_Are_Enough_for_a_Card-Sorting_Study)）；那是單一公司內網的一個案例。
- **記得 Resnick 的發現**：卡片分類告訴你讀者「覺得」怎麼分合理，不保證那樣分最好找。

**樹狀測試（tree testing）**：把架構寫成純文字的樹，不放任何設計，給受試者一個任務（「你要申請出差，會點哪裡？」），看他們點到哪（[NN/g Tree Testing](https://www.nngroup.com/articles/tree-testing/)）。

- **正確答案要放在最底層**，不能是本身也有頁面的上層分類。
- **看第一次點擊點到哪裡**：第一次就點對頂層分類，往往能預測最後找不找得到。
- **基準**：NN/g 引用一項彙整 98 個樹狀測試的研究，任務成功率的中位數是 62%（[NN/g Tree Testing Part 2](https://www.nngroup.com/articles/interpreting-tree-test-results/)）。最好的比較基準還是自己上一版的結果。
- **目標**：最關鍵的任務，NN/g 建議成功率要到 90% 以上。
- **工具會影響結果**：Kuric 等人 2025 年比較了幾種樹狀測試的介面，換一種介面，難題上的結果就可能不同（[Kuric et al. 2025](https://doi.org/10.1016/j.infsof.2025.107740)）。比較兩版架構時，用同一個工具。

## 例子：同一批文件的兩種樹

假設你有這些頁面：出差申請表、出差規定、訂機票流程、請假規定、請假表單、新人電腦設定、新人報到流程、報帳流程、部署 SOP、API 文件。

```text
按部門分（主結構）                 按任務的入口頁（只放連結）
├── 人資                          ├── 新人第一週
│   ├── 請假規定                  │   ├── → 新人報到流程
│   ├── 請假表單                  │   ├── → 新人電腦設定
│   ├── 出差規定                  │   ├── → 請假規定
│   └── 新人報到流程              │   └── → 報帳流程
├── 財務                          ├── 出差
│   ├── 出差申請表                │   ├── → 出差規定
│   └── 報帳流程                  │   ├── → 出差申請表
├── 行政                          │   ├── → 訂機票流程
│   └── 訂機票流程                │   └── → 報帳流程
└── 工程                          └── 請假
    ├── 新人電腦設定                  ├── → 請假規定
    ├── 部署 SOP                      └── → 請假表單
    └── API 文件
```

左邊每一頁都有一個部門負責；右邊三頁入口頁不放內容，只指回左邊。出差規定改了，只要改人資那一頁，入口頁不用動。入口頁也要有負責人：新增、搬移或刪除頁面時，記得回來更新連結。

## 研究的限制

按部門和按任務的直接比較很少，上面兩個實驗都很小，Resnick 那篇是購物網站，「任務」指的是購物目的，不是工作任務。2020 年後的英文研究裡，沒有看到直接比較這兩種分法的實驗。NN/g 的建議多半來自他們的觀察，公開文章沒有附對照數據。

## 今晚可以做的事

1. **列出新人最常問的五個問題。** 每個問題，數一數答案散在幾頁、幾個部門。
2. **散在三頁以上的，做一頁入口頁。** 只放連結，不複製內容。
3. **改三個最難搜的標題。** 換成新人真的會打進搜尋框的字。
4. **做一次小型樹狀測試。** 把 wiki 頂層和第二層寫成純文字，找三位新人，給他們五個任務，記下第一次點擊點到哪裡。三個人只能看出哪裡容易走錯，不能算成功率，也不要拿去跟 62% 比。

## 自我檢查

**問：** 一頁標題叫「Q3 會議紀錄」，好不好找？

**判準：** 看讀者是誰。開過會的人也許記得是 Q3，但新人不知道有這場會，他會搜想知道的那件事，例如「出差規定改了什麼」，所以對新人不好找。比較好的做法是：會議紀錄照時間放在封存區；會議裡改了規定，就直接更新「出差規定」那一頁；要留下為什麼這樣決定，另寫一份決策紀錄（order 8 會談怎麼寫），兩頁互相連結。

## 參考資料

- [NN/g 2014, Intranet Information Architecture (IA) Trends](https://www.nngroup.com/articles/intranet-information-architecture-ia/)
- [NN/g 2024, Intranet Usability Guidelines: New Findings From 57 Intranets](https://www.nngroup.com/articles/intranet-usability-guidelines/)
- [Cozijn, Maes, Schackman & Ummelen 2007, Structuring job related information on the intranet: An experimental comparison of task vs. an organization-based approach (Journal of Technical Writing and Communication)](https://doi.org/10.2190/382G-91T8-T06R-2L52)
- [Resnick & Sánchez 2004, Effects of organizational scheme and labeling on task performance in product-centered and user-centered retail Web sites (Human Factors)](https://doi.org/10.1518/hfes.46.1.104.30390)
- [GitLab Handbook](https://handbook.gitlab.com/)
- [GitLab Handbook: Handbook Usage](https://handbook.gitlab.com/handbook/about/handbook-usage/)
- [NN/g 2024, Card Sorting: Uncover Users' Mental Models for Better Information Architecture](https://www.nngroup.com/articles/card-sorting-definition/)
- [Tullis & Wood 2004, How Many Users Are Enough for a Card-Sorting Study? (UPA 2004)](https://www.researchgate.net/publication/254164354_How_Many_Users_Are_Enough_for_a_Card-Sorting_Study)
- [NN/g 2023, Tree Testing: Evaluate Menu Labels and Categories](https://www.nngroup.com/articles/tree-testing/)
- [NN/g 2024, Tree Testing Part 2: Interpreting the Results](https://www.nngroup.com/articles/interpreting-tree-test-results/)
- [Kuric, Demcak & Krajcovic 2025, Validation of information architecture: Cross-methodological comparison of tree testing variants and prototype user testing (Information and Software Technology)](https://doi.org/10.1016/j.infsof.2025.107740)
