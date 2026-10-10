---
title: "CS2881R L9：AI 對就業與生產力的早期證據"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, labor-market, productivity]
lang: zh-TW
series:
  name: "Harvard CS2881R 導讀"
  order: 12
tldr: "Harvard CS 2881R 第 9 講請來 OpenAI 首席經濟學家 Ronnie Chatterji 與 Stanford 的 Bharat Chandar。Chandar 用 ADP 薪資資料說明：22–25 歲、在 AI 高曝險職業的年輕人，在控制公司層級衝擊後，就業相對下降 16%，資深員工沒有同樣的趨勢；調整主要出現在人數，薪資還沒動。兩位講者也一再提醒，總體就業目前看不出大規模替代，「曝險」不等於「被取代」。這講沒有投影片，材料是錄影與閱讀清單。"
description: "Harvard CS 2881R（Fall 2025）第 9 講 Economic Impacts of Foundation Models 導讀：Chatterji 談經濟學家在前沿實驗室的工作方式與「曝險不等於替代」，Chandar 講 Canaries in the Coal Mine 的六個事實與排除的替代解釋，四篇預讀（Jones AI in R&D、How People Use ChatGPT、Canaries、The A.I. Dilemma）各自補哪一塊，錄影中的學生實驗（模型發布與美債殖利率、GDPval 任務的 messiness），以及 Boaz Barak 的 Thoughts by a Non-Economist。"
draft: false
glossary:
  - term: "AI 曝險（AI exposure）"
    definition: "衡量一個職業的工作任務有多大比例能被 AI 執行或加速的指標。Canaries 論文主要使用 Eloundou et al. 的 GPT 曝險分數，另用 Anthropic Economic Index 區分自動化與增強兩種用法。"
    context: "CS2881R 第 9 講反覆強調：曝險高只代表任務重疊多，不代表這份工作一定會消失。"
  - term: "Baumol 成本病（Baumol's cost disease）"
    definition: "生產力進步快的部門，產品變便宜、占 GDP 比重反而可能下降；進步慢的部門（例如醫療、教育）占比與就業相對上升，整體成長因此被慢的部門拖住。"
    context: "Chandar 在 Q&A 用它推測 AI 之後就業可能往哪裡移，Boaz 的部落格文也用它解釋為何電腦沒讓 GDP 成長率跳升。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs2881r-lecture-09-economic-impacts-en)

> **版本說明**：本文依據 [Harvard CS 2881R AI Safety](https://boazbk.github.io/mltheoryseminar/fall2025/) Fall 2025 課站的 10 月 30 日講次、[第 9 講錄影](https://youtu.be/4vQSMijp_M8)（YouTube 標題「Lecture 9: Economic Impacts of AI」，約 2 小時 32 分）、四篇預讀，以及課站首頁列出的 Boaz Barak 部落格文 [Thoughts by a Non-Economist on AI and Economics](https://windowsontheory.org/2025/11/04/thoughts-by-a-non-economist-on-ai-and-economics/)。事實皆於 2026-09-30 打開官方材料核對；錄影內容依 YouTube 自動字幕整理，人名以課站拼法為準。**本講材料**：錄影與閱讀清單公開；課站沒有列投影片，實驗欄寫「To be determined」，但錄影裡確實有一組學生實驗報告。整門課的存取分級與缺口見[系列總覽](/posts/ai/2026-09-30-cs2881r-course-overview)。

**系列位置**：上一篇 [L7：能力與安全](/posts/ai/2026-09-30-cs2881r-lecture-07-capabilities-vs-safety)｜下一篇 [L11：聊天機器人、情感依賴與心理健康](/posts/ai/2026-09-30-cs2881r-lecture-11-emotional-reliance)｜[系列總覽](/posts/ai/2026-09-30-cs2881r-course-overview)

[上一篇](/posts/ai/2026-09-30-cs2881r-lecture-07-capabilities-vs-safety)停在「能力怎麼量」：METR 的任務長度倍增、GDPval。這一篇往下問一層：能力長上去之後，勞動市場現在到底看得到什麼？

Boaz Barak 開場只講了一句定位：AI 安全課關心 AI 對世界的影響是好是壞，經濟面是其中最重要的一塊，少了這一講課程就不完整。接著把時間交給兩位客座，一位從 OpenAI 內部看，一位拿行政資料看。

## 課程影片來源

影片連結已與本文採用版本的官方課程頁核對。

```youtube
url: https://www.youtube.com/watch?v=4vQSMijp_M8
title: Lecture 9: Economic Impacts of AI（錄影）
```

原始影片：[Lecture 9: Economic Impacts of AI（錄影）](https://www.youtube.com/watch?v=4vQSMijp_M8)

課程與錄影入口：

- [harvard-cs2881r — official course materials and recording index](https://boazbk.github.io/mltheoryseminar/fall2025/)

## 這一講的材料

| 材料 | 內容 | 狀態 |
|---|---|---|
| [錄影](https://youtu.be/4vQSMijp_M8) | Chatterji 約 20 分鐘演講 → Chandar 演講 → 學生實驗 → 兩位講者聯合 Q&A | 公開 |
| 課站條列 | Labor substitution & productivity effects；Inequality & policy responses | 公開 |
| 預讀 4 篇 | 見下方「四篇預讀各補哪一塊」 | 全部公開 PDF |
| 延伸閱讀 5 篇 | Goldman Sachs、Generative AI at Work、Acemoglu & Restrepo、GPTs are GPTs、Roodman | 課站列出連結，本文未逐篇展開 |
| 投影片 | 課站未列 | 無 |

## Chatterji：經濟學家在前沿實驗室做什麼

Ronnie Chatterji 在錄影裡自我介紹：他是 OpenAI 第一位首席經濟學家，同時在 Duke 商學院任教，也曾在聯邦政府主持 CHIPS and Science Act 的執行。他說 OpenAI 給他的職務說明是「你自己寫」，他把工作定成三件事：做經得起同儕審查的實證研究、把組織與企業當成主角、把政策與「非市場環境」當成策略的一部分。

他給學生的第一個觀點是：**通往 AGI 的路會經過組織**。電力、蒸汽機、網際網路最後都要被企業採用才改變經濟，AI 現在還在這段的早期。

第二個觀點是整講最常被重複的一句：**你的工作「曝險於 AI」，不等於你的工作會「被 AI 取走」**。他給兩個理由。一是 AI 能做某項任務，不代表制度允許它做；他舉自己為例，AI 也許能寫課綱、上課，但 Duke 得先改規則。二是任務清單會變，AI 接走一部分，人會加上新的任務；他說父親也是經濟學家，1985 年做的事跟他今天做的事完全不同。

他也解釋為什麼經濟學家對 AI 的 GDP 估計差這麼多：技術史上常是「先發散、再收斂」；模型能力變得太快，今天的論文明天可能過時；最關鍵的是你的「案情理論」，把 AI 想成五年後還是一個聊天視窗，估計就會偏保守，把它想成用在最難問題上的智慧，估計就會偏高。

結尾他說 AI 跟過去技術不同的地方在採用速度、benchmark 飽和速度與推論成本下降速度，並主張 AI 安全是跨領域問題，經濟學、社會學、心理學、政治學要跟懂模型的人一起做。

## Chandar：Canaries in the Coal Mine 的六個事實

Bharat Chandar 講的是他與 Erik Brynjolfsson、Ruyu Chen 合寫的 [Canaries in the Coal Mine?](https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf)。他先從歷史鋪路：十六世紀 William Lee 發明織襪機，兩度被拒絕專利，理由正是怕讓窮人失業；但幾百年下來，英國人均 GDP 大幅上升，失業率並沒有失控。

他整理出技術影響勞動市場的兩條機制：舊工作被取代的同時會生出新工作（他引用 David Autor 等人的估計，今天約 60% 的就業是 1940 年還不存在的工作），而近幾十年新工作集中在高薪專業與低薪服務兩端，教育差距因此擴大了不平等。AI 可能反過來，因為高曝險職業偏向高薪、高學歷，Autor 甚至寫過 AI 有機會重建中產階級。

問題是資料。政府的 Current Population Survey 切到「某職業 × 某年齡層」時，樣本可能只剩個位數。這篇論文的優勢是 ADP（美國最大的薪資軟體商）的月度薪資紀錄，涵蓋數百萬名員工，最新資料到 2025 年 9 月。論文的六個事實如下：

| 事實 | 內容 |
|---|---|
| 1 | AI 高曝險職業的年輕員工就業下降。22–25 歲軟體開發者到 2025 年 9 月比 2022 年底高點下降近 20% |
| 2 | 整體就業仍在成長，但年輕員工的就業成長停滯；拖累來自高曝險職業 |
| 3 | 在 AI 用來「自動化」的職業，入門就業下降；用來「增強」的職業變化不明顯 |
| 4 | 控制公司 × 時間的衝擊後，年輕員工在高曝險職業仍有 16% 的相對就業下降 |
| 5 | 調整出現在就業人數，薪資還沒有明顯分歧 |
| 6 | 換樣本定義後結果大致不變 |

錄影裡 Chandar 對第 1 條特別加了但書：2022 年底科技業同時碰上升息與疫情期間的過度招募，軟體開發者這條線不能全歸給 AI。他說他比較信第 4 條的公司內比較，那條曲線下降得平緩很多。

事實 6 他逐項講了排除過的替代解釋：排除科技業、排除所有電腦相關職業、只看不能遠端的職業（排除回辦公室與外包）、區分有無大學學歷、區分性別、納入兼職與臨時工，以及新做的「職業利率曝險」分析。最後這項他解釋：利率曝險與 AI 曝險其實負相關，營造業對利率很敏感卻幾乎不受 AI 影響。

他補了一個對照組：健康照護助理（護理助理、居家照護等）屬於低曝險職業，年輕員工的就業成長反而比資深員工快。還有一個細節值得記：不需要大學學歷的高曝險職業，就業分歧一路延伸到 26–34 歲。他的推測是，年輕人在學校學到的東西跟模型訓練資料高度重疊，工作經驗累積的是比較難寫成文字的知識。

他的總結很克制：**AI 對總體就業的影響目前可能很小，但它可能正在減少高曝險入門職位的招募**。

### Q&A 裡對論文的三個質疑

學生當場問的三題，剛好是讀這篇論文該問的：

- **供給面**：會不會是年輕人主動避開高曝險職業、湧進低曝險職業？Chandar 說這方面的資料非常少，他看到的電腦科學主修人數到 2023 年左右沒有明顯下降，所以不認為這是主因。
- **時間點**：2022 年 9 月模型能力還很弱，為什麼曲線那時就開始掉？他給三個因素：ChatGPT 之前已有 GitHub Copilot 這類工具、雇主的預期效應、以及軟體業本身的非 AI 因素。
- **樣本偏誤**：ADP 的客戶組成會不會偏向某類公司？他承認對軟體開發者可能有影響，但客服等職業不太適用。

## 四篇預讀各補哪一塊

| 預讀 | 在這講的角色 |
|---|---|
| [Jones, B. F.：Artificial Intelligence in Research and Development](https://www.kellogg.northwestern.edu/faculty/jones-ben/htm/Artificial_Intelligence_in_Research_and_Development.pdf)（2025-09 初稿） | 把 AI 放進研發的生產函數。論文點名三個決定性因素：AI 能做的研究任務比例、AI 在這些任務上的生產力、以及想法生產的瓶頸強度 |
| [Chatterji et al.：How People Use ChatGPT](https://cdn.openai.com/pdf/a253471f-8260-40c6-a2cc-aa93fe9f142e/economic-research-chatgpt-usage-paper.pdf)（2025-09） | 使用面的資料。到 2025 年 7 月約 7 億使用者、每週 180 億則訊息；非工作用途從 53% 升到七成以上；Practical Guidance、Seeking Information、Writing 三類合計近八成 |
| [Brynjolfsson, Chandar & Chen：Canaries in the Coal Mine?](https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf) | 就業面的資料，即 Chandar 本講內容。課站連結目前指向 2025-11-13 更新版 |
| [Jones, C. I.：The A.I. Dilemma: Growth versus Existential Risk](https://web.stanford.edu/~chadj/existentialrisk.pdf)（AER: Insights 2024） | 把成長與生存風險放進同一個模型。結論高度依賴效用函數的曲度：對數效用下模型願意為大幅消費成長冒相當的滅絕風險，風險趨避係數 ≥ 2 時就變得很保守；AI 若能延長壽命則是關鍵例外 |

第四篇是這講跟整門 AI 安全課接得最緊的地方：它不問 AI 會不會帶來成長，而是問「為了成長，我們願意承擔多少風險」，答案取決於一個經濟學家平常不太注意的參數。

Chatterji 在 Q&A 提到 How People Use ChatGPT 時補了一句：很多人覺得「使用者主要拿它來問建議」不夠驚豔，他反而認為建議是人類決策的基礎，而決策是經濟的基礎。他接著提出一個還沒被研究的風險：十億人向同一個模型要理財、人際建議時，建議的同質化可能在文化上令人洩氣，也可能變成系統性風險。

## Boaz 的「非經濟學家」筆記

課站首頁的 related reading 列了 Boaz 在這講之後幾天（2025-11-04）發的 [Thoughts by a Non-Economist on AI and Economics](https://windowsontheory.org/2025/11/04/thoughts-by-a-non-economist-on-ai-and-economics/)，致謝名單裡有 Bharat Chandar 與兩位 Jones。它可以當成這講的延伸：

- 他把 METR 任務長度曲線的不確定性拆成**截距**與**斜率**。benchmark 與真實世界的落差（他稱為 messiness tax）他認為主要影響截距，不一定影響斜率。
- 美國人均 GDP 150 年來大致以每年約 2% 成長，電力、內燃機、電腦、網際網路都沒改變這條線。他的「兆元問題」是 AI 會不會打破它。
- 他用 B. Jones 的調和平均模型說明：不能自動化的任務比例 ρ 會把生產力上限鎖在 1/ρ，所以要轉型式成長，**ρ 要縮小、AI 生產力 λ 要變大，兩者缺一不可**。
- 他也承認這些推論很激進：它看的是能力，忽略了擴散速度；過去 80 年的自動化是線性的，AI 若讓未自動化任務以指數速度減少，就是跟歷史斷裂。

這篇的結論句是：AI 能不能帶來前所未有的成長，取決於它的能力指數成長，能不能讓「尚未自動化的任務比例」也以指數速度下降。

## 學生實驗：模型發布與 GDPval 任務的 messiness

課站的實驗欄寫「To be determined」，錄影裡則有一組學生報告，分成兩部分。

**模型發布與長天期美債殖利率。** 他們把 AI 重大發布日期當事件，計算 10 年期與 30 年期殖利率在五個交易日內的累積異常變動。只用早期 9 個 OpenAI 發布時，殖利率有顯著的負向反應；擴充到 19 個發布後，效果幾乎消失。深入看才發現，早期的顯著性多半來自同期的總體事件，例如 ChatGPT 發布當天剛好有 Fed 主席談打擊通膨，GPT-4 發布正好在矽谷銀行危機兩天後。他們的結論是總體事件主導了殖利率，原本的發現站不住。

**GDPval 任務的 messiness。** 他們從 GDPval 公開的 220 題中挑 70 題（專業科技服務、政府、零售），用 METR 的 16 個 messiness 因子讓 GPT-4o mini 評分，再讓 GPT-4o mini、GPT-5 mini、GPT-5 實際作答並由模型評分。他們報告的觀察：

- 96% 的任務需要讀輸入檔、產出檔案或執行程式碼
- messiness 分數集中在 10 與 12 兩個值，因子本身可能太籠統
- 新模型分數較高，但最佳模型平均也只有 58 分
- 模型估計自己完成任務的時間很不準，而且單位從「分鐘」改成「秒」對結果影響最大

Chatterji 回饋時問了一個好問題：messiness 是任務本身的屬性，還是人類為了自己設計出來的流程？如果從零設計給 AI 的工作流程，可能乾淨得多，這也許代表新創比大企業更容易導入 AI。

## Q&A：講者給了哪些判斷

聯合 Q&A 長約一小時，下面只列跟「AI 安全」直接相關、講者給了明確立場的幾題。

**如果 10–20% 的人失業，政府怎麼辦？** Chatterji 以他在金融海嘯與 COVID 期間任職政府的經驗說，失業保險、SNAP 這類自動穩定機制本來就存在，危機經濟學不是空白。他也要大家校準量級：新聞上的裁員數字加起來，對失業率的影響遠比想像小；要到大蕭條等級，得有一套 AI 迅速取代教師與護理師的說法。Chandar 補充了 UBI 以外的想法：放寬職業證照門檻讓人更容易轉職、用 AI 加速職業再訓練。

**大規模失業會不會伴隨大規模成長？** Boaz 認為 AI 很難在不帶來巨大成長的情況下造成大規模失業。Chandar 提醒另一種看法：Acemoglu 的研究指出，製造業機器人只小幅提高生產力，卻已足以讓公司停止雇人。

**需要哪些制度創新？** Chatterji 列了幾個他認為還沒人想清楚的問題：agent 在經濟裡運作的法律框架（出口管制下 agent 的「所在地」算哪裡）、AI 自動化研發之後研發抵稅怎麼算。Chandar 則提到 Acemoglu 等人的主張，現行稅制可能過度獎勵取代勞力的自動化技術。

**為什麼有些國家比較不擔心 AI 風險？** 兩位都說是推測：Chatterji 提到韓國、日本的人口結構讓「AI 取代勞力」沒那麼刺耳；Chandar 提到所得越低，越願意用風險換成長。這接回第四篇預讀的效用曲度。

## 這講還不能說什麼

把兩位講者的但書收在一起：

- Canaries 是相關性證據加上一連串排除，不是因果識別；Chandar 自己說軟體開發者那條線不能全算在 AI 頭上
- 月度波動不該過度解讀；Chandar 說到 2025 年 9 月的更新資料，沒看到趨勢反轉
- 企業內 AI 採用率的數字互相矛盾，Chandar 舉了主管調查與人口普查局數字的巨大落差
- AI 對教育與職涯選擇的影響，兩位都說幾乎沒有資料

## 自學怎麼做

1. 先讀 Canaries 的六個事實與 robustness 段，再看錄影 0:28 起 Chandar 的部分。先有圖在腦中，他的但書才有意義。
2. 讀 C. I. Jones 的 The A.I. Dilemma 時，只抓一件事：風險趨避係數從 1 變成 2，結論為什麼翻轉。
3. 讀完 Boaz 的部落格文，回頭比對 Chatterji 說的「案情理論」：Boaz 的假設屬於哪一端？

今晚可以做的一件事：打開 Canaries 論文，找到事實 2 的附錄圖，看最高兩個曝險五分位的 22–25 歲與 35–49 歲兩條線。只要看這一張，就能分辨「整體就業很好」和「年輕人在高曝險職業卡住」可以同時成立。

## 延伸閱讀

- 能力怎麼量、GDPval 的設計：[L7：能力與安全](/posts/ai/2026-09-30-cs2881r-lecture-07-capabilities-vs-safety)、[L12：AI 2035 與 GDPval](/posts/ai/2026-09-30-cs2881r-lecture-12-ai-2035)
- AI 做 AI 研發的時間軸：[L6：遞迴自我改進](/posts/ai/2026-09-30-cs2881r-lecture-06-recursive-self-improvement)
- 課程地圖與 A0–A3 分級：[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [Harvard CS 2881R AI Safety, Fall 2025 課站](https://boazbk.github.io/mltheoryseminar/fall2025/) — 10 月 30 日講次、客座名單、課站條列、預讀與延伸閱讀清單、實驗欄「To be determined」
- [Lecture 9: Economic Impacts of AI（錄影）](https://youtu.be/4vQSMijp_M8) — Chatterji 與 Chandar 演講、學生實驗、聯合 Q&A
- [Brynjolfsson, Chandar & Chen：Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence](https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf) — 六個事實、16% 相對下降、軟體開發者近 20% 下降、robustness
- [Chatterji et al.：How People Use ChatGPT](https://cdn.openai.com/pdf/a253471f-8260-40c6-a2cc-aa93fe9f142e/economic-research-chatgpt-usage-paper.pdf) — 使用規模、工作與非工作比例、三大主題
- [Jones, B. F.：Artificial Intelligence in Research and Development](https://www.kellogg.northwestern.edu/faculty/jones-ben/htm/Artificial_Intelligence_in_Research_and_Development.pdf) — 研發生產函數的三個決定因素
- [Jones, C. I.：The A.I. Dilemma: Growth versus Existential Risk](https://web.stanford.edu/~chadj/existentialrisk.pdf) — 效用曲度與生存風險的取捨
- [Boaz Barak：Thoughts by a Non-Economist on AI and Economics](https://windowsontheory.org/2025/11/04/thoughts-by-a-non-economist-on-ai-and-economics/) — 截距與斜率、2% 成長趨勢、調和平均模型
