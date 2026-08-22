---
title: "數位產品的價值驗證：從假設地圖到 AI 產品的 M3 留存基準"
date: 2026-07-25
category: product
type: deep-dive
tags: [value-validation, product-market-fit, product-discovery, experimentation, pricing, product-management, ai-product]
lang: zh-TW
tldr: "價值驗證的單位是假設不是點子。Kohavi 的資料顯示產業中位數只有 10% 的實驗會成功，這代表在 p<0.05 下約 22% 的「獲勝實驗」其實是假陽性；Sean Ellis 的 40% 門檻查不到任何公開資料集；AI 產品的留存要從 M3 而非 M0 起算，且 <$50/mo 的 GRR 只有 23%、>$250/mo 有 70%。"
description: "拆解數位產品價值驗證的方法論：Cagan 四大風險、證據強度階梯、WTP 問卷的雙向偏誤、40% test 與 retention curve 的破口、實驗假陽性率的數學，以及 AI 產品在定價、留存基準與 evals 上的三個修正。"
draft: false
glossary:
  - term: "fake door"
    aliases: ["painted door", "假門測試", "fake door test"]
    definition: "在產品裡放一個看起來能用、實際上還不存在的功能入口，用點擊率當作需求訊號。"
    advanced: "量的是好奇心不是承諾——點擊不代表使用者會改變工作流程或付錢。真正無可取代的場景只有『原型成本以月計的深度整合或基礎設施型功能』。門檻必須在開跑前訂死，否則會退化成確認偏誤製造機。"
    context: "產品探索階段用來在開發前取得需求訊號，但有真實的使用者信任成本。"
  - term: "concierge MVP"
    aliases: ["concierge test", "管家式 MVP"]
    definition: "先用純人工的方式把價值親自交付給少數顧客，看他們是否重視這個結果、會不會回來。"
    advanced: "測的是 desirability：顧客在乎的是不是這個「結果」。因為交付完全靠人工，它證明不了任何關於可規模化的事——成本與工作量都不具代表性。"
    context: "適合全新產品、顧客對這類服務還沒有價格與體驗參考點的時候。"
  - term: "Wizard of Oz"
    aliases: ["綠野仙蹤測試", "Wizard of Oz MVP"]
    definition: "使用者看到的是一個自動化產品，後台其實由人力手動操作。"
    advanced: "跟 concierge 的差別在測的東西不同：concierge 測「顧客要不要這個結果」，Wizard of Oz 測「你提案的那套交付機制與體驗成不成立」。用在已知顧客要這個結果、要驗交付方式的階段。"
    context: "常見於 AI 產品早期——先用人工冒充模型，確認體驗成立再投入自動化。"
  - term: "HXC"
    aliases: ["high-expectation customer", "高期待顧客"]
    definition: "對這類產品期待最高、最挑剔的那群顧客——如果連他們都滿意，一般使用者通常也會。"
    advanced: "Superhuman 的做法是先從『很失望』族群裡歸納出 HXC 輪廓，再把 PMF 分數的計算收斂到這群人身上；光是這一步就讓分數從 22% 跳到 33%，產品一行沒改。反過來說，做出一個『一般人勉強能忍受』的產品，比做出一個『挑剔的人很愛』的產品位置弱得多。"
    context: "用於 PMF 量測時的分群，也用於定義目標市場與 roadmap 優先序。"
---

> 🌏 [English version](/posts/product/2026-07-25-digital-product-value-validation-en)

多數團隊講「我們驗證過了」的時候，講的其實是「我們訪了 20 個人，大家都說想要」。這句話的資訊量接近零，而且成本不低——依 Ronny Kohavi 在 Microsoft 累積的實驗資料，即使是通過了內部層層評估才被實作出來的想法，也只有約三分之一真的改善了它們原本設計要改善的指標。在 Bing 這種已高度優化的領域，成功率降到 10–20%。

這篇拆解數位產品的**價值驗證**：它到底在驗什麼、有哪些方法、怎麼判斷「驗過了」、以及這些方法本身有多不可靠。最後一節處理 AI 產品把哪三件事改掉了。

## 價值驗證在驗什麼：四大風險裡的第一個

價值驗證不是一種活動，是**針對特定一類風險的證據蒐集**。Marty Cagan 在 [The Four Big Risks](https://www.svpg.com/four-big-risks/) 把產品風險拆成四類：

> 1. value risk (whether customers will buy it or users will choose to use it)
> 2. usability risk (whether users can figure out how to use it)
> 3. feasibility risk (whether our engineers can build what we need with the time, skills and technology we have)
> 4. business viability risk (whether this solution also works for the various aspects of our business)

Cagan 在 [Product Risk Taxonomy](https://www.svpg.com/product-risk-taxonomies/) 裡交代了這個分類的演化：《INSPIRED》2008 年第一版只有 value / usability / feasibility 三個，2018 年第二版才把「對顧客有價值」與「對生意可行」拆開。他自己說明拆開的理由——三個比四個好記，但 viability 被吞掉的代價太大。

價值驗證專指**第一類**。這個定義本身就排除了大量被誤稱為「驗證」的行為：可用性測試在驗 usability，技術 spike 在驗 feasibility，跟法務確認在驗 viability。它們都不會告訴你有沒有人真的要這個。而 Cagan 反覆強調，value risk 通常是四個裡面最難的那個。

真正的分界線在 Teresa Torres 的一句話。她在 [Discovering Solutions](https://www.producttalk.org/discovering-solutions/) 裡把兩種研究活動分得很開：

> Interviewing is generative. Assumption testing is evaluative. We need both.

訪談用來**生成機會**，假設測試用來**評估解法**。混在一起做，就會產出「大家都說想要」這種既不能證偽也不能行動的結論。

還有一層更關鍵：驗證的單位不是「點子」而是**假設**。[Opportunity Solution Tree](https://www.producttalk.org/opportunity-solution-trees/) 的最底層是 assumption tests 而不是 A/B tests，Torres 特別解釋過這個設計——給實驗自己一列，是為了逼團隊想出「測同一個解法的多種方式」，避免過度依賴 A/B test 去測整個方案。

搭配 assumption mapping 的 2×2（重要性 × 現有證據）就完整了：落在**高重要 × 低證據**那格的是 leap-of-faith assumption，也就是「錯了這個解法就死」但你目前一無所知的那些。這個工具真正的價值在於它強迫團隊承認一件不舒服的事——多數團隊測的是自己**測得順手**的假設（工程師測技術可行性、設計師測可用性），而不是**錯了會死**的那個。

## 證據強度只有一條軸

Osterwalder 與 David Bland 的 [Testing Business Ideas](https://www.strategyzer.com/library/testing-business-ideas-book) 收錄了 40 餘種實驗（官方頁寫 43、官方書摘寫 44），按 cost、time、strength of evidence 三個維度排序。背後的排序邏輯只有一條：

**意見 < 意向 < 行為。**

一份簽了字的 letter of intent 勝過一百句「我們有興趣」。Bland 把實驗分成 discovery（開放、方向性、便宜）與 validation（有**真實的價值交換**、貴、慢）兩階段，承自 Steve Blank 的 customer discovery / validation。多數團隊卡在 discovery 層不動，因為 discovery 永遠給得出「還可以再訪幾個人」的藉口。真正的門檻是：有沒有出現真實的價值交換。

同一條軸線也解釋了 [The Mom Test](https://www.momtestbook.com/) 的核心。Rob Fitzpatrick 這本書常被誤讀成「怎麼問問題的技巧書」，但它真正的主張是：**讚美是社交潤滑劑，承諾才是證據**。而承諾有三種貨幣，依重量排序是時間（答應下次會議、測原型）< 名譽（介紹具名同事、向老闆背書）< 金錢（訂金、預購、LOI）。

推論很不舒服但很乾淨：一場結束於「保持聯絡」或「我再想想」的訪談不是中性結果，是**弱負向**結果。對方沒有花任何一種貨幣，你就沒有拿到資料。

實務上的選型大致是這樣：

| 你要驗的事 | 適合的實驗 | 證據強度 | 主要限制 |
|---|---|---|---|
| 顧客有沒有這個問題 | 顧客訪談（Mom Test 規則） | 中 | 沒有承諾就沒有資料 |
| 在不在乎到願意行動 | Landing page / 註冊表單 | 中高 | 測的是好奇心 |
| B2B 會不會真的採用 | Letter of intent / paid pilot | 高 | 需要真實決策者 |
| 顧客是否重視這個「結果」 | Concierge MVP（人工交付） | 高 | 證明不了可規模化 |
| 提案中的交付機制成不成立 | Wizard of Oz（前台自動、後台人工） | 高 | 成本高 |
| 願不願意真的付錢 | Pre-sale / 預購 | 極高 | 承諾成本最高，最難取得 |

Fake door（painted door）測試值得單獨講，因為它被濫用得最嚴重。它量的是 **CTR，也就是好奇心，不是承諾**——點擊不代表使用者會改變工作流程、付更多錢、或持續使用。它有兩個真實成本：一是信任，使用者發現自己被騙進一個不存在的功能，這個負面體驗不會出現在 CTR 報表上；二是它只告訴你 what，不告訴你 why。

Fake door 真正無可取代的場景只有一個：**原型成本以月計的深度整合或基礎設施型功能**，用小時級的成本換一個需求訊號。反過來，多步驟複雜功能（單一 CTA 無法代表流程）、極早期產品（一次糟糕的 reveal 就毀掉尚未建立的信任）、已經被測過的 segment，都不該用它。

還有一條紀律：**判準要在開跑前訂死**。沒有事前門檻的 fake door 測試不是實驗，是一台確認偏誤製造機——資料回來之後才決定「多少算成功」，你永遠會決定它成功了。

## 付費意願：問卷全都有偏誤，只是方向不同

WTP（willingness to pay）的量測有四種常見方法，各有各的位子：

| 方法 | 產出 | 適合 | 已知問題 |
|---|---|---|---|
| [Van Westendorp PSM](https://www.relevantinsights.com/articles/van-westendorp-price-sensitivity-meter/) | 可接受價格**區間** | 全新產品、無價格參考點 | 無理論基礎、不考慮競品、結果不穩定 |
| Gabor-Granger | 需求曲線、**營收最佳點** | 已知大致價格帶、要調價 | 需預設價格點；序列版本有 anchoring bias |
| Conjoint / 離散選擇 | **feature-level WTP** + 競品模擬 | 要設計方案分級 | 樣本與成本最高 |
| 直接開口問 | 平均 / 中位數 WTP | 只當粗略方向 | 最不可信 |

學術文獻的結論很硬：**所有假設性方法都有偏誤**。Schmidt 與 Bijmolt 2020 年發表在 *Journal of the Academy of Marketing Science* 的 meta-analysis 指出，假設性 WTP 與實際 WTP 相差約 **21%**，而且 indirect 方法（如 conjoint）的假設性偏誤**更大**。

這裡是實務上最容易搞錯的一點——**兩種相反方向的偏誤同時存在，作用在不同方法上**：

- **直接開口問「你願意付多少」** → 受訪者有策略性誘因**報低**。Lipovetsky 等人在 [Pricing Models in Marketing Research](https://content.scirp.org/pdf/iim20110500007_64675493.pdf) 裡的說法是「respondents often overstate their price sensitivity」，也就是誇大自己的價格敏感度。
- **假設性的購買意願或選擇任務**（contingent valuation、非誘因對齊的 conjoint）→ **高估**購買意願與 WTP，因為受訪者的回答不對自己造成任何後果。

所以「問卷會高估還是低估 WTP」這個問題沒有單一答案，得看你用的是哪一種方法。把兩者混為一談，就會套錯修正方向。

有解，但幾乎沒人用。[Marketing Letters 2025 年的一篇 meta-analysis](https://doi.org/10.1007/s11002-025-09764-8)（134 個 effect size、34 篇論文、N=12,980）發現，把受測者的報酬與其選擇掛鉤（incentive alignment）能把 conjoint 的預測效度提升 **12%**。同一篇引述 Pachali 等人的統計：市調公司實作的 conjoint 有 **96% 是純假設性的**。

至於 Van Westendorp，實務研究者 Michaela Mora 的批評相當直接：沒有理論基礎、直接問價會誘發 lowballing、不考慮競爭、沒有預測成功的紀錄、也無法用來優化營收或利潤。她舉了自己的案例——PSM 算出來的「最佳價」比該產品實際成交價**低 $10**，且現行價格完全落在 PSM 建議的「可接受區間」之外。Lipovetsky 等人的技術批評則是：結果不穩定，樣本的微小變動就會造成價格曲線大幅位移。

持平地說，VW 也有一條相當強的挺方，值得放進來讓你自己判斷：[Kloss 與 Kunter 2016](https://iabe.org/IABE-DOI/article.aspx?DOI=EJM-16-2.4) 發現 VW 的 optimal pricing point 能重現 **BDM 機制**的量測結果——那是受測者要拿真錢下注的設計，被視為最接近真實 WTP 的基準。如果成立，等於用一份兩三分鐘的問卷換到接近誘因對齊實驗的準確度。

但兩位作者自己的但書更值得讀：這個吻合**可能是兩個偏誤互相抵消**——假設性偏誤把價格推高，而 PSM 聚焦「最小顧客抗拒」又把價格壓低——而且結論只來自他們測的單一產品。換句話說，目前無法區分 VW 是「真的有效」還是「碰巧會對」。一個靠兩個錯誤抵消而準的工具，換個產類別別就沒有理由繼續準。

**可操作的結論：問卷用來縮小搜尋範圍，pre-sale、paid pilot、LOI 用來下決定。** 這也解釋了為什麼連主張「該讓 painted door 退休」的人都承認，在測價格點這一項上，行為式測試贏過問卷——因為問卷受訪者有強烈誘因選最低價的那個選項。

## 什麼算「驗過了」：Sean Ellis 的 40% test

最廣為流傳的判準是 Sean Ellis 的 40% test。[Ellis 本人的說法](https://medium.com/growthhackers/using-product-market-fit-to-drive-sustainable-growth-58e9124ee8db)是：

> In my experience, it becomes possible to sustainably grow a product when it reaches around 40% of users who try it that would be "very disappointed" if they could no longer use it.

他也交代了樣本量要求：至少 30 份才有方向性，100+ 才有信心。而且必須只問**近期真正體驗過核心功能**的人——他舉的例子是 Uber 要問搭過車的人，不是只下載 App 的人。

最有名的應用案例是 Superhuman。Rahul Vohra 在 [First Round Review](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/) 記錄的軌跡是 **22% → 33% → 58%**：第一次跑出 22%，光是把樣本收斂到符合 high-expectation customer 的族群就跳到 33%（**產品一行沒改**），再花三季系統性迭代到 58%。他的 roadmap 拆法是一半強化「很失望」族群所愛的、一半移除符合 HXC 的「有點失望」族群的阻礙，完全忽略「不失望」的人。

這個工具好用，但它的四個破口需要講清楚：

1. **倖存者偏誤是設計內建的。** 它只問現有使用者，已流失的人按定義被排除在樣本外。一個看不見 churn 的指標，很難宣稱自己在偵測 fit。
2. **題目是負向框架。** 「不能再用會怎樣」觸發的可能是損失趨避、習慣與轉換摩擦，而不是價值判斷。一個對產品無感、正在看替代方案的使用者，仍然可能對「突然被拿走」回答「很失望」。
3. **>40% 會出現假陽性。** Tristan Kromer 記錄過自己的案例：[StartupSquare 跑出 >40% 但明確沒有 PMF](https://kromatic.com/blog/false-positives-and-product-market-fit/)——受訪者回應的是「解法的承諾」而非產品本身，產品其實沒做出什麼東西。他的結論是 <40% 大概真的沒有 PMF，但 >40% 不保證有。
4. **40% 這個數字本身查不到公開驗證。** 它來自 Ellis benchmark 約上百家新創的觀察，但本次查找（含 Ellis 本人文章、Superhuman 原文、Reforge 教材、多篇批評文）找不到任何公開資料集、同儕審查研究或可獨立複現的分析。**如果你知道有公開來源，請告訴我，我會更新這段。**

所以合理的用法是：**把它當追蹤自身變化的診斷儀表，不要當跨公司的 go/no-go 閘門。** 本季 47% 掉到 31% 代表出事了，而且這個訊號取得成本極低——這才是它的價值。

有個實務上的旁證：Nubank 的 CPO Jag Duggal 在 [Lenny's Podcast](https://www.lennysnewsletter.com/p/be-fundamentally-different-jag-duggal) 上提到，他們對每個要上線的新功能都跑 40% test，但因為巴西人在文化上比全球平均更樂觀友善，他們把門檻拉到 **50%**。一個需要按文化重新校準的數字，本來就不適合當普世及格線。

## B2B 的判準不一樣：六個 reference customer

40% test 還有一個更根本的限制——它是為 B2C 設計的。Cagan 對 B2B 產品給的判準完全不同：[至少六個 live 的 reference customer](https://www.svpg.com/the-power-of-reference-customers/)，而且每個垂直市場各算各的（先湊滿金融業的六個，再湊製造業的六個）。

他對「reference customer」的定義很嚴，四個條件缺一不可：

1. **真實顧客**——不是親友、不是內部人
2. **在 production 環境實際使用**——不是試用、不是 POC
3. **付過真金白銀**——不是為了拉人用而免費送的
4. **願意主動且真誠地告訴別人他有多喜歡這個產品**

第四條是最難也最關鍵的一條。前三條都可以靠銷售折扣硬湊，第四條不行——它要的是顧客願意拿自己的名譽為你背書，回到前面那條證據強度軸上，這是「名譽」這個貨幣的最高規格。

Cagan 自己說六這個數字[不具統計顯著性，目的是建立信心](https://www.svpg.com/product-market-fit/)。更值得抄走的是他的推論：**在拿到這六個之前不要啟動銷售與行銷機器**——因為你還沒有證據顯示你能讓顧客成功，這時候放大獲客只會放大失敗。

## 行為面的判準：retention curve

行為面的判準則是 retention curve flattening。Casey Winters 在 [Casey's Guide to Finding Product/Market Fit](https://www.caseyaccidental.com/p/caseys-guide-to-finding-product-market-fit) 講得很具體：cohort 分析的 y 軸要放**產品的核心動作**（Pinterest 是儲存一則內容、Grubhub 是線上點餐），x 軸要放**該產品的自然使用頻率**（Pinterest 週、Grubhub 月一到兩次）。用錯這兩個軸，曲線就沒有意義。

但完整判準是**三個條件的合取**，不是任一單項：

> A flattened retention curve of your key action at the designated frequency plus month over month growth in new customers is the best way I have found to measure true product/market fit.

加上他在另一篇補的第三條——能在可接受的 payback period 內獲客——才構成完整定義。少一件都不算。

還有一個常被忽略的細節：**曲線的形狀比絕對數字重要**。Casey 自己的說法是「where the retention graph flattens is more important to me than the six month retention rate」。電商在 8% 變平，比 SaaS 在 20% 還在往下掉更健康。

至於大家最想要的 benchmark 數字——[Lenny Rachitsky 與 Casey Winters 2020 年那份彙整](https://www.lennysnewsletter.com/p/what-is-good-retention-issue-29)（6 個月 user retention）：consumer social 25%(good)/45%(great)、consumer transactional 30/50、consumer SaaS 40/70、SMB 與 mid-market SaaS 60/80、enterprise SaaS 70/90。

**但這份數字有保鮮期問題**，用之前要知道三件事：它是實務者訪談的彙整而非公開資料集、發表於 2020 年、而且那是 AI 產品出現之前。當座標系用可以，當及格線用要非常小心。

## 算你的 base rate：為什麼「贏了」有 22% 機率是假的

這是價值驗證裡最被忽略、也最反直覺的一段。

Kohavi 在 [Online Experimentation at Microsoft](https://ai.stanford.edu/~ronnyk/ExPThinkWeek2009Public.pdf) 的長期資料是：約 1/3 的想法正向且統計顯著、1/3 持平、1/3 負向且統計顯著。他在 [2014 年 MIT 的簡報](https://exp-platform.com/Documents/2014-10-11MITCodeKohaviExP.pdf)裡寫得更白：

> Features are built because teams believe they are useful. But most experiments show that features fail to move the metrics they were designed to improve.

在 Bing 這種高度優化的領域，失敗率上升到 80–90%。而 Bing 的核心指標 sessions/user，**約 5,000 個實驗才有 1 個能改善它**。Kohavi、Tang、Xu 與 Ioannidis 等人 2020 年發表在 *Trials* 的[跨公司論文](https://doi.org/10.1186/s13063-020-4084-y)把這個現象確立為 Google、LinkedIn、Microsoft 的共同經驗。

真正致命的推論在下一步：**成功率越低，一個 p<0.05 的顯著結果是假陽性的機率就越高。**

| 公司 | 實驗成功率 | p<0.05 顯著結果為假陽性的機率 |
|---|---|---|
| Microsoft | 33% | 5.9% |
| Bing | 15% | 15% |
| Booking.com / Google Ads / Netflix | 10% | 22% |
| Airbnb Search | 8% | 26.4% |

（[GrowthBook 彙整](https://www.growthbook.io/blog/designing-a-b-testing-experiments-for-long-term-growth)自 Kohavi 2009/2014、Manzi 2012、Thomke 2020）

產業中位數約 10% 的成功率，意味著**約每 5 個「獲勝實驗」就有 1 個是假陽性**。大部分團隊以為 p<0.05 代表 5% 的出錯率，數學上並非如此——那是在假設「你的想法本來就有 50/50 機會是對的」之下才成立。你的 base rate 越差，同一個 p 值的可信度就越低。

而資料品質問題比統計問題更常見。Kohavi 列的幾條：A/A test 的失敗率遠高於預期的 5%（新網站可達 **30%**），最常見原因是 carryover effect；sample ratio mismatch（50/50 設計跑出 49/51）是「出大事了」最常見的訊號；Bing 超過一半的流量是 bot 產生的。

他還記錄了一個關於「不做實驗會怎樣」的案例：Office Online 把評分機制從 yes/no 改成 5 星，**損失超過 80% 的回應，花了 8 個月才發現、分析、改回來**。指標掉 3% 而有人主動去把自己驕傲上線的功能撤回的機率，用他的話說是 miniscule。

## AI 產品改變了三件事

先說沒變的：四大風險的分類沒變，證據強度階梯沒變，Mom Test 沒變，假陽性的數學沒變。

**（一）計價單位開始內建價值驗證。**

[Intercom Fin](https://fin.ai/pricing) 收 **$0.99 / outcome**，而且只在 Fin 真的達成結果時計費——[官方文件](https://www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes)明確寫「You will never be charged for an outcome that didn't happen」，一次對話最多只計一個 outcome。2026 年 3 月他們還把計價單位從 resolution 擴大到 outcome，[理由](https://www.intercom.com/blog/from-resolutions-to-outcomes-evolving-how-fin-delivers-value/)是「依設定完成交接」也是價值，不該因為人類有介入就不算。

對照組是 [Salesforce Agentforce](https://www.salesforce.com/agentforce/pricing/)：$2 / conversation，或 Flex Credits（$500 / 100k credits，標準 action 20 credits ≈ $0.10）——**不論是否解決都計費**。

Zendesk 走的是第三條路：[$1.50 per automated resolution](https://www.zendesk.com/blog/ai/productivity/cost-per-resolution/)，只在 AI 獨立解決、沒有轉人工時才計費。有意思的是它怎麼認定「解決了」——[官方文件](https://support.zendesk.com/hc/en-us/articles/5352026794010-About-automated-resolutions-for-AI-agents)說標記為已解決的對話要由 LLM 驗證，並搭配一段靜默期（顧客沒有回頭重開對話才算數）。換句話說，**當 outcome 變成計價單位，「outcome 到底成不成立」本身就變成一個需要被評測的判斷**——這條線會直接接到後面 evals 那一節。

這件事對價值驗證的意義比表面上大：當計價單位＝價值單位，**營收本身就變成價值指標**，不需要另外設計代理指標。代價是 viability risk 整個轉移到毛利端——每一次沒收到錢的嘗試都燒了 token。

**（二）留存的分佈極度分化，中位數會騙你。**

這是這次研究裡最需要小心的一組數字，因為三份資料看似互相矛盾：

- [RevenueCat 2026 State of Subscription Apps](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026)（訂閱 app 全體中位數）：AI app 的年度 realized LTV 比非 AI 高 **41%**（$30.16 vs $21.37）、trial→paid 轉換好 **52%**，但 12 個月年訂閱留存只有 **21.1%**（非 AI 30.7%），退款率高 20%（4.2% vs 3.5%）。
- [Kyle Poyar 的 3,500 家公司分析](https://www.growthunhinged.com/p/the-ai-churn-wave)：AI-native 的中位數 GRR 僅 **40%**、NRR 48%——比 B2C SaaS 還差。
- [a16z 的 Retention Is All You Need](https://a16z.com/ai-retention-benchmarks/)（>$1M ARR 的頭部公司）：留存強勁，甚至出現罕見的 smiling curve。

三者不衝突，是**樣本不同**。而且 Poyar 按價格切開之後，「AI 留存問題」直接裂成兩個世界：

| 價格帶 | GRR | NRR |
|---|---|---|
| < $50 / 月 | 23% | 32% |
| $50–249 / 月 | 45% | 61% |
| > $250 / 月 | **70%** | **85%** |

最後一列基本上等同健康的 B2B SaaS。用 Poyar 的說法：AI 產品本身沒有高流失的宿命，**高流失的是面向消費者的 AI wrapper**。（他自陳每層樣本約 50 家，屬方向性而非統計上無懈可擊。）

所以「AI 產品留存好不好」這個問法本身就會得到誤導性答案。該問的是：在我這個價格帶、這個客群，留存分佈落在哪。

a16z 的方法論修正值得直接採用：**把留存基準從 M0 改成 M3**。理由是前三個月的曲線被 "AI tourist" 汙染——花 $20 試一個月就走的人——M3 之後才是真實客群；並以 **M12/M3** 作為長期留存品質的早期預測指標。他們的觀察是曲線通常在 M3 左右開始變平。

**（三）evals 補上了一層過去不存在的驗證。**

[Hamel Husain 的立場](https://hamel.dev/blog/posts/evals-faq/)很反直覺——**不要做 eval-driven development**（先寫評測再實作）：

> Unlike traditional software where failure modes are predictable, LLMs have infinite surface area for potential failures. You can't anticipate what will break.

正確順序是先做 error analysis：人工看 20–50 條 trace，累積到至少 100 條、直到約 20 條不再出現新失敗類別（theoretical saturation），**只為實際觀察到的錯誤寫 evaluator**。

架構上分三層：L1 assertions（每次程式改動都跑）→ L2 human + model eval（固定週期）→ L3 A/B test（重大改動後），成本 L3 > L2 > L1。

而 LLM-as-judge 本身也需要被驗證。方法是用約 100 條人工標註的 gold set，看 **TPR / TNR 而不是 agreement**——因為若某個失敗只發生 10% 的時間，一個永遠回答 pass 的判官就有 90% 準確率。Hamel 直接把 agreement 稱為 trap metric。

最關鍵的一句留在最後：**離線 eval 分數只是 user happiness 的 proxy，必須定期驗證這個 proxy 是否成立。** 如果離線指標改善 30% 而線上使用者行為沒動，那不是勝利，是回頭做 error analysis 的訊號。

這在概念上就是價值驗證被推進到 AI 產品的內層——你不只要驗「使用者要不要這個功能」，還要驗「你用來衡量這個功能好壞的那把尺，量的是不是價值」。

## 整體來說

八條可以直接帶走的：

1. **價值驗證的單位是假設，不是點子。** 先做 assumption mapping，測「錯了會死」的那個，不要測「測得順手」的那個。
2. **證據強度只有一條軸：意見 < 意向 < 行為。** 讚美不是資料，承諾才是；承諾的貨幣依重量是時間 < 名譽 < 金錢。
3. **判準要在開跑前訂死**，否則實驗會退化成確認偏誤製造機。
4. **問卷縮小範圍，行為下決定。** WTP 問卷全都有偏誤，而且方向依方法而異——直接問會被報低、假設性選擇會被高估。能用 pre-sale 校準就一定要校準。
5. **算你的 base rate。** 成功率 10% 的環境下，p<0.05 的「贏」有約 22% 機率是假的。不算這個就會把雜訊當成產品洞見。
6. **40% test 當診斷儀表，不當閘門。** 追蹤自己隨時間的變化有效；跨公司的及格線沒有公開證據支撐，連 Nubank 都得按文化把它調到 50%。而且它是 B2C 的工具——**B2B 該用的是六個 reference customer**，其中最硬的一條是對方願意主動具名推薦你。
7. **PMF 的行為判準是三件事的合取**：曲線變平 ＋ 新客 cohort 成長 ＋ payback period 內能獲客。少一件都不算。
8. **AI 產品的三個修正**：留存起算點改 M3；用價格帶而非「是不是 AI」找對照組；把 eval 當成價值驗證的內層，並定期驗證 eval 本身是不是好的 proxy。

如果只能記一句：**驗證不是為了證明你對，是為了讓你錯得便宜一點。** 一個永遠驗證成功的流程，只證明了它沒有在驗證。

## 更新紀錄

- 2026-07-25：新增「B2B 的判準不一樣：六個 reference customer」一節（Cagan 的 reference customer 四條件與「湊滿六個之前不要啟動銷售機器」的推論）；補上 Nubank 把 40% 門檻按文化調到 50% 的例子；AI 定價一節補上 Zendesk 的 $1.50 per automated resolution 與其 LLM 驗證機制；定價一節補上 Kloss & Kunter 2016 對 Van Westendorp 的正面證據與作者自己的「兩個偏誤互相抵消」但書，原本只寫了批評的一面。

## 參考資料

**框架與定義**

- [The Four Big Risks — Marty Cagan / SVPG](https://www.svpg.com/four-big-risks/)
- [Product Risk Taxonomy — Marty Cagan / SVPG](https://www.svpg.com/product-risk-taxonomies/)
- [Planning Product Discovery — Marty Cagan / SVPG](https://www.svpg.com/planning-product-discovery/)
- [Opportunity Solution Trees — Teresa Torres / Product Talk](https://www.producttalk.org/opportunity-solution-trees/)
- [Discovering Solutions — Teresa Torres / Product Talk](https://www.producttalk.org/discovering-solutions/)

**實驗方法**

- [Testing Business Ideas — Strategyzer（Osterwalder & Bland, 2019）](https://www.strategyzer.com/library/testing-business-ideas-book)
- [How to Select the Next Best Test from the Experiment Library — David Bland / Strategyzer](https://www.strategyzer.com/library/how-to-select-the-next-best-test-from-the-experiment-library)
- [Testing Business Ideas 官方書摘 PDF — Wiley](https://catalogimages.wiley.com/images/db/pdf/9781119551447.excerpt.pdf)
- [The Mom Test — Rob Fitzpatrick](https://www.momtestbook.com/)
- [Is Fake Door Testing Still Worth Doing in The Vibe-Coding Era? — Userpilot](https://userpilot.com/blog/fake-door-testing/)

**定價與付費意願**

- [Incentive alignment in conjoint analysis: a meta-analysis on predictive validity — Marketing Letters, 2025](https://doi.org/10.1007/s11002-025-09764-8)
- [Pricing Models in Marketing Research — Lipovetsky, Magnan, Zanetti-Polzi](https://content.scirp.org/pdf/iim20110500007_64675493.pdf)
- [Making the Case Against the Van Westendorp Price Sensitivity Meter — Michaela Mora](https://www.relevantinsights.com/articles/van-westendorp-price-sensitivity-meter/)
- [The Van Westendorp Price-Sensitivity Meter As A Direct Measure Of Willingness-To-Pay — Kloss & Kunter, 2016](https://iabe.org/IABE-DOI/article.aspx?DOI=EJM-16-2.4)

**PMF 判準**

- [Using Product/Market Fit to Drive Sustainable Growth — Sean Ellis](https://medium.com/growthhackers/using-product-market-fit-to-drive-sustainable-growth-58e9124ee8db)
- [How Superhuman Built an Engine to Find Product Market Fit — Rahul Vohra / First Round Review](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/)
- [Casey's Guide to Finding Product/Market Fit — Casey Winters](https://www.caseyaccidental.com/p/caseys-guide-to-finding-product-market-fit)
- [Product-Market Fit Requires Arbitrage — Casey Winters](https://www.caseyaccidental.com/p/product-market-fit-arbitrage)
- [What is good retention — Lenny Rachitsky × Casey Winters](https://www.lennysnewsletter.com/p/what-is-good-retention-issue-29)
- [Product Market Fit Survey: Why the 40% Test Gives False Positives — Tristan Kromer / Kromatic](https://kromatic.com/blog/false-positives-and-product-market-fit/)
- [PMF: Product/Market Folklore — Ian Reppel](https://ianreppel.org/product-market-folklore/)
- [The Power of Reference Customers — Marty Cagan / SVPG](https://www.svpg.com/the-power-of-reference-customers/)
- [Product Market Fit — Marty Cagan / SVPG](https://www.svpg.com/product-market-fit/)
- [Be fundamentally different, not incrementally better — Jag Duggal（Nubank）/ Lenny's Podcast](https://www.lennysnewsletter.com/p/be-fundamentally-different-jag-duggal)

**實驗信效度**

- [Online Experimentation at Microsoft — Kohavi, Crook, Longbotham](https://ai.stanford.edu/~ronnyk/ExPThinkWeek2009Public.pdf)
- [Lessons from Running Thousands of A/B Tests — Ronny Kohavi](https://exp-platform.com/Documents/2014-10-11MITCodeKohaviExP.pdf)
- [Online randomized controlled experiments at scale — Kohavi, Tang, Xu, Hemkens, Ioannidis / Trials, 2020](https://doi.org/10.1186/s13063-020-4084-y)
- [Designing A/B testing experiments for long-term growth — GrowthBook](https://www.growthbook.io/blog/designing-a-b-testing-experiments-for-long-term-growth)

**AI 產品**

- [Fin AI Agent Pricing — Intercom](https://fin.ai/pricing)
- [Fin AI Agent outcomes — Intercom 官方文件](https://www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes)
- [From resolutions to outcomes — Intercom Blog](https://www.intercom.com/blog/from-resolutions-to-outcomes-evolving-how-fin-delivers-value/)
- [Agentforce Pricing — Salesforce](https://www.salesforce.com/agentforce/pricing/)
- [Cost per resolution — Zendesk](https://www.zendesk.com/blog/ai/productivity/cost-per-resolution/)
- [About automated resolutions for AI agents — Zendesk 官方文件](https://support.zendesk.com/hc/en-us/articles/5352026794010-About-automated-resolutions-for-AI-agents)
- [Retention Is All You Need — a16z](https://a16z.com/ai-retention-benchmarks/)
- [The AI churn wave? — Kyle Poyar / Growth Unhinged](https://www.growthunhinged.com/p/the-ai-churn-wave)
- [State of Subscription Apps 2026 — RevenueCat](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026)
- [LLM Evals: Everything You Need to Know — Hamel Husain & Shreya Shankar](https://hamel.dev/blog/posts/evals-faq/)
- [Your AI Product Needs Evals — Hamel Husain](https://hamel.dev/blog/posts/evals/)

**站內相關**

- [拆解 Anthropic Founder's Playbook：四階段、三條 moat、一個 Cowork 合規坑](/posts/ai/2026-05-18-anthropic-founders-playbook)
- [Product Builder：當 AI 讓每個人都能從 0 到 1，產品開發的角色正在重組](/posts/product/2026-07-25-product-builder-hybrid-role)
