---
title: "Stanford CS221 導讀：AI 入門課的先修欄位，寫的是 CS103、CS106B、CS109、CS161"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs221, ai-course, stanford, search, logic, reinforcement-learning]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 1
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 7
tldr: "CS221 把 AI 排成一條軸：反射式模型（也就是深度學習）在最低階那一格，往上是狀態、變數、邏輯。2025 年秋季 Percy Liang 接手後把講義換成可執行的 Python，並在第一堂的原始碼裡寫下『Cut constraint satisfaction problems :(』——但 ExploreCourses 與 Stanford Online 兩個官方頁面到現在還把約束滿足列為課程主題。專案已經從 2019 年的兩成成績掉到只剩加分。"
description: "Stanford CS221: Artificial Intelligence: Principles and Techniques 完整導讀。從三份互相打架的官方先修條件、課程自己用「資源限制」定義 AI 的方式、反射／狀態／變數／邏輯四層主脊，到 2025 年秋季砍掉約束滿足與改用可執行講義的變動、八份作業的分水嶺，以及自學者實際拿得到哪些一手材料。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-stanford-cs221-ai-principles-en)

[CS221: Artificial Intelligence: Principles and Techniques](https://stanford-cs221.github.io/) 是 Stanford 電腦科學系的 AI 入門課，一年開兩次，掛在 200 系列卻是整條 AI 路線的起點。它教搜尋、馬可夫決策過程、賽局、貝氏網路與邏輯，深度學習只是其中一節。

在所有人都在講 LLM 的 2026 年，一門還在教 A\* 與歸結法（resolution）的課值得被問一句「為什麼還教」。這篇不是替它辯護，是去讀它自己的講義怎麼回答。答案比想像中直接。課程把這些方法排在同一條軸上，而深度學習被放在**最低階**的那一格——不是因為它不重要，是因為它是唯一一種「不回溯、算完就輸出」的模型。

這篇涵蓋課程的硬事實、它自己怎麼定義 AI、四層主脊、2025 年秋季砍了什麼、八份作業各在做什麼，以及沒選課的人實際拿得到多少一手材料。**不涵蓋**逐堂的技術教學——那是講義本身的工作，而講義是公開的，文末會給路徑。系列的上一層入口是[〈Stanford CS 課程導讀〉](/posts/learning/2026-08-20-stanford-cs-course-map)，那篇講這門課在階梯的哪一格。

## 這門課的硬事實

授課者輪替。[Autumn 2025 那版](https://stanford-cs221.github.io/autumn2025/)由 [Percy Liang](https://cs.stanford.edu/~pliang/) 主講，[Spring 2025 那版](https://stanford-cs221.github.io/spring2025/)是 Moses Charikar 與 Zachary Robertson。依 [ExploreCourses 的 CS221 條目](https://explorecourses.stanford.edu/search?q=CS+221&view=catalog)，2026–2027 學年秋季由 Liang 開、春季由 Charikar 開。學分數與授課時段見附錄。

先修條件是這篇的軸心，而且**它同時存在三個版本**。ExploreCourses 的 `Prerequisites` 欄位寫得最硬：

> Prerequisites: CS 103 or CS 103B/X, CS 106B or CS 106X, CS 109, and CS 161 (algorithms, probability, and object-oriented programming in Python). We highly recommend comfort with these concepts before taking the course, as we will be building on them with little review.

這一句就是「想跳過地基直攻 AI」的官方反駁。離散數學與證明、程式抽象、機率、演算法，四門地基被直接列名，結尾還補了一句「我們幾乎不會複習」。

至於旁聽——沒有這個管道。非學位生要走 CGOE（原 SCPD），而 [Stanford Online 的 CS221 頁面](https://online.stanford.edu/courses/cs221-artificial-intelligence-principles-and-techniques)把門檻寫成「已取得學士學位且大學部 GPA 3.0 以上」。課堂錄影放在 Canvas，模組頁上那些 Panopto 連結點下去會要求登入。

## 三個官方頁面，三份先修清單

把三個頁面攤開來對，它們對不上：

| 項目 | ExploreCourses | 課程官網（Autumn 2025） | Stanford Online / CGOE |
|---|---|---|---|
| [CS103](https://web.stanford.edu/class/cs103/) 離散數學 | 必修 | Required | 列出 |
| [CS106B](https://web.stanford.edu/class/cs106b/) 程式抽象 | 必修 | Required（含 CS106A） | 以入門程式學程代替 |
| [CS109](https://web.stanford.edu/class/cs109/) 機率 | 必修 | Required | 列出 |
| [Math 51](https://web.stanford.edu/class/math51/textbook.html) 線性代數 | 未列 | **Required** | 列出 |
| [CS161](https://web.stanford.edu/class/cs161/) 演算法 | **必修** | Recommended | 未列 |
| [CS107](https://web.stanford.edu/class/cs107/) 系統 | 未列 | Recommended | 未列 |

課程官網把 CS161 標成 `(Recommended)`，ExploreCourses 把它寫進 `Prerequisites` 那一行。同一門課的兩個官方頁面，對「CS161 到底是不是必修」給了相反的答案；而線性代數只在其中兩份出現。哪一份優先，三個頁面都沒有說。

**怎麼做**：三份取聯集。四門地基加上線性代數全部補起來，就不必賭哪個頁面比較新。

至於補到什麼程度，課程官網給的判準比清單本身有用。它說重點不是你會不會某個特定的東西，而是你有沒有做過夠多相關的事、對它感到自在。原文舉的例子是：這門課根本不用特徵向量，即使那是線性代數的支柱。換句話說，把 CS109 的作業做出手感，比把課本讀完更接近它要的狀態。

## 課程怎麼定義 AI：不從人類定義，從資源限制定義

Autumn 2025 第一堂的講義是一份公開的 Python 檔，[welcome.py](https://github.com/stanford-cs221/autumn2025-lectures/blob/main/welcome.py) 可以直接讀原始碼。它先問「什麼是 AI」，然後拒絕用人類當標準——`artificial` 是「跑在電腦上」，`intelligence` 後面直接寫 `???`，接著說「我們想要一個從一般原理出發的定義」。

它給的定義是四個能力加一組限制：**感知、推理、行動、學習，全部在資源限制之下**。而資源只有兩種：計算（執行時間、記憶體、通訊）與資訊（資料、經驗、當下拿得到的輸入）。

這個定義不是那一年才發明的。ExploreCourses 上的課程描述已經掛了很多年：

> AI is the mathematics of making good decisions given incomplete information (hence the need for probability) and limited computation (hence the need for algorithms).

資訊不完整 → 需要機率；計算有限 → 需要演算法。整門課的兩條技術主線就是從這句話長出來的，而先修清單裡的 CS109 與 CS161 剛好對應這兩個字。**先修欄位不是行政要求，是課程定義的直接後果。**

講義接著把課堂上的每個演算法掛回那四個能力。推理那一格底下掛的是 uniform cost search、value iteration、minimax、貝氏網路上的機率推論；學習那一格底下是梯度下降、Q-learning、EM 演算法。這是一張對照表，也是這門課真正在賣的東西——不是演算法本身，是「什麼問題該用哪一格」的分類法。

## 主脊：深度學習是四格裡的一格

課程用一張圖貫穿整學期，[course-content 這份講義](https://stanford-cs221.github.io/spring2025-extra/modules/general/course-content.pdf)把它拆解得最完整。橫軸從低階到高階排四種模型：

```
                Search problems       Constraint satisfaction problems
            Markov decision processes        Markov networks
               Adversarial games            Bayesian networks

    Reflex          States                    Variables            Logic
  低階 ─────────────────────────────────────────────────────► 高階
                          Machine learning（撐住全部）
```

**Reflex（反射式模型）**就是線性分類器與深度神經網路。講義給它的定義只有一句：計算是純前饋的，「不回溯、不考慮其他計算路徑」。推論很簡單，因為就是把固定的計算跑一遍。

**States（狀態式模型）**處理需要事先盤算的事。搜尋問題是你控制一切；馬可夫決策過程是對手叫做「隨機性」；對抗賽局是真的有個對手在跟你作對。

**Variables（變數式模型）**處理「順序不重要」的問題。講義用數獨舉例：填格子的順序完全不影響評分標準，那就不該用一步一步的操作去描述解答。這一層是宣告式的——你說你要什麼，而不是微觀管理怎麼找到。

**Logic（邏輯）**是最高階那一格。課程對邏輯與統計的關係講得很明白：人們常把邏輯式 AI 與統計式 AI 對立起來，但這門課「不把兩者視為矛盾，而是互補」。同一頁還有一句更值得記的對照——大型語言模型「以幻覺聞名」，而課堂示範的邏輯系統「在內部是 100% 一致的」。這不是說邏輯比較好，講義下一句就承認邏輯需要機器學習提供的、對真實資料的接地能力。

最後，整門課的結論講義在總結四層模型時，替邏輯那一層的「Learning」欄位填了三個問號。**課程自己承認這一格是空的。** 有這種欄位的課綱不多。

## 2025 年秋季砍掉了什麼

Percy Liang 接手那學期做了三件事，而且他在第一堂的講義原始碼裡逐條列出來：

> Changes this year:
> - Tensor-native: from deep learning to value iteration to Bayesian network inference
> - Cut constraint satisfaction problems :(
> - Deep dive into societal impact (e.g., copyright, supply chains, policy)

那個顏文字是原文照抄。這件事在作業表上也留下痕跡。`scheduling`（課程排課，CSP）和 `car`（車輛追蹤，HMM 粒子濾波）這兩份作業，從 2022 一路到 Spring 2025 每屆都在；Autumn 2025 兩份同時消失，換成 `bayesian` 與 `society`。

**問題是，另外兩個官方頁面到現在還在賣約束滿足。** ExploreCourses 的課程描述裡列著 `constraint satisfaction`，Stanford Online 的頁面把它放在 `Topics Include` 的第一條，而那頁在 2026 年 8 月還更新過。想學 CSP 而衝著課程描述來的人，會發現最新一屆的講義裡沒有這個東西。

第二個變動是形式的。以前的講義是一套投影片系統，Spring 2025 那版把課程內容切成一百多個短模組，每個都有投影片與講稿。Autumn 2025 整個換掉了：[全部講義變成一個公開的 GitHub repo](https://github.com/stanford-cs221/autumn2025-lectures)，MIT 授權，內容是可以直接跑的 Python 檔，用 Liang 自己寫的 [edtrace](https://github.com/percyliang/edtrace) 產生。README 自己的說法是「executable lecture，一個執行起來就會把課上完的程式」。理由講義裡寫了三條：講次繼承程式的階層結構、程式比英文和數學都更精確、反正最後你要寫程式才做得出 AI。

## 作業長什麼樣

Autumn 2025 是八份週作業，各佔總成績的一部分，每份都有書面題與程式題，[zip 檔全部公開可下載](https://stanford-cs221.github.io/autumn2025/)：

| # | 名稱 | 在做什麼 |
|---|---|---|
| 1 | [foundations](https://stanford-cs221.github.io/autumn2025/assignments/hw1_foundations/index.html) | 線性代數、機率、複雜度暖身；NumPy 與 einsum |
| 2 | sentiment | 情感分類，線性分類器與特徵設計 |
| 3 | [route](https://stanford-cs221.github.io/autumn2025/assignments/hw3_route/index.html) | 用 OpenStreetMap 的 Stanford 地圖做路徑規劃，UCS 與 A\* |
| 4 | [mountaincar](https://stanford-cs221.github.io/autumn2025/assignments/hw4_mountaincar/index.html) | MDP 與強化學習，跑 Gymnasium 的 Mountain Car |
| 5 | [pacman](https://stanford-cs221.github.io/autumn2025/assignments/hw5_pacman/index.html) | 多對手 Pac-Man，minimax 與 expectimax |
| 6 | bayesian | 貝氏網路 |
| 7 | [logic](https://stanford-cs221.github.io/autumn2025/assignments/hw7_logic/index.html) | 把英文句子翻成邏輯式，加上歸結法推論 |
| 8 | [society](https://stanford-cs221.github.io/autumn2025/assignments/hw8_society/index.html) | 挑一個 AI 產品做完整的社會影響稽核，全書面 |

**分水嶺是第五份。** 這不是我排的難度，是頁面上唯一一份帶著這種警告的作業：

> The `grader.py` included is useful to verify whether or not your solution crashes due to bugs or to verify Pac-Man behavior, but will not give reliable information on whether your submission will time out on any of the tests.

前四份你在本機跑 `grader.py` 就知道自己過不過。到 Pac-Man，本機評分器不再夠用——超時測試只在 Gradescope 上跑，而且是零分測試，只告訴你會不會逾時。也就是說這是第一份「寫得對」不等於「過得了」的作業：minimax 樹要展開到任意深度，你得自己控制搜尋成本。相對的，第七份邏輯作業頁面反過來寫著「這份作業沒有隱藏測資，過了看得見的就滿分」。

還有一件很難不注意的事：**第一份作業有兩題的答案是一份 AI 對話紀錄的連結。**

> Learn basic NumPy operations with an AI tutor! [...] Provide a link to the chat session transcript with the AI tutor. The session should be ~15–20 minutes and interactive!

題目附了一份完整的家教 prompt 模板，還交代 AI 不准直接解作業。而同一門課的誠信條款寫著，你**不可以**用生成式 AI「檢查」自己的答案，即使那是你自己寫的。「用 AI 學基礎」被排進作業，「用 AI 驗答案」被列為違規——這兩條並存在同一學期的頁面上。課程沒有說明它怎麼劃這條線。

## 這門課已經是一門考試課

把歷屆課程網站的評分比重排出來，會看到一個橫跨六年的移動：專案從成績裡消失了。

Autumn 2019 那屆的專案佔總成績兩成。到 Autumn 2025，[專案說明頁](https://stanford-cs221.github.io/autumn2025/project.html)已經直接寫著「the project is ungraded (except for potential extra credit)」——最多換到一點加分，成績主體是一場期末考。逐屆的比重見附錄。

很多寫於幾年前的 CS221 自學指南還把專案當成這門課的重頭戲，那個描述已經過期了。課程網站沒有解釋為什麼這樣改。

不過專案指南裡有一條方法值得單獨拿走。**怎麼做**：動手做花俏方法之前，先實作一個 baseline 和一個 oracle。前者給效能下限，後者給上限；如果兩者的差距太小，那你選的題目本身就不好。這條規則跟 CS221 教的任何演算法都無關，但它可能是整份指南裡最能直接搬進工作的一段。

## 自學者實際拿得到什麼

逐項講，因為這門課的公開程度比多數人以為的高，但缺的那塊也很明確。

**拿得到（Autumn 2025）**：全部講義。[GitHub repo](https://github.com/stanford-cs221/autumn2025-lectures) 是 MIT 授權的可執行 Python，也可以直接[在瀏覽器裡逐行看](https://stanford-cs221.github.io/autumn2025-lectures/?trace=welcome)，從 welcome 一路到 society 都在。八份作業的 zip 全部可下載，裡面有 `submission.py` 骨架、`grader.py` 本機評分器、LaTeX 書面題模板，還有 Pac-Man 那份的完整遊戲程式。

**拿得到（Spring 2025）**：投影片。上一版的[模組索引](https://stanford-cs221.github.io/spring2025/modules/index.html)把課程切成一百多個短模組，它們的 PDF 掛在一個公開的 GitHub Pages 路徑上。索引頁只列出其中十份的下載連結，其餘要自己拼網址。值得拼——**這些 PDF 不只是投影片，每一頁下面都附著講者的完整口述講稿**，等於一整套講義。想同時要投影片和可執行程式，就是新舊兩版各拿一半。

**怎麼做**：網址規則是 `spring2025-extra/modules/<群組>/<名稱>.pdf`，群組與名稱兩個值都在模組索引頁上看得到。想要全課地圖就抓 `general/course-content.pdf`，想要那份把符號、神經、統計三條血脈講完的 AI 簡史就抓 `general/history.pdf`。

**拿不到**：課堂錄影。頁面上的 Panopto 連結一律要 SUNet 登入，官方公告寫著錄影放在 Canvas。也拿不到隱藏測資——本機評分器只跑得了看得見的那些，前面說的 Pac-Man 超時測試更是只存在於 Gradescope 上。作業解答也拿不到。誠信條款把「看往年解答」直接列為違規，不論那是官方的、別人寫的、還是網路上找到的。課程並說明會對歷屆提交跑相似度比對。

## 怎麼開始

**怎麼做**：打開 [route 那份作業](https://stanford-cs221.github.io/autumn2025/assignments/hw3_route/index.html)的 Problem 1，它是純紙筆題，不用裝任何東西。題目是一座無限大的網格城市，往東走的成本隨 x 座標遞增。先問你從原點到 (m, n) 的最小成本，再給三個關於 uniform cost search 行為的是非題——包括「狀態無限多所以 UCS 永遠不會終止」對不對。

寫完再去讀 [ucs\_astar 那份講義](https://stanford-cs221.github.io/autumn2025-lectures/?trace=ucs_astar)。三題全對，這門課的搜尋那一段你可以走快一點。如果你在第一題就卡在「這跟 Dijkstra 有什麼不一樣」，那先修欄位裡的 CS161 就是在講你。

想要更完整的入口，就從 [welcome](https://stanford-cs221.github.io/autumn2025-lectures/?trace=welcome) 開始逐行跑到底，它會在二十分鐘內告訴你這門課的世界觀，包括那句被砍掉的顏文字。

## 附錄：數字與查證方式

- **開課規格**：ExploreCourses 條目列 3–4 學分，註明「May be taken for 3 units by graduate students」。2026–2027 學年秋季班（class #1903）為 Percy Liang 授課，週二週四 15:00–16:20，地點 Hewlett Teaching Center 200，期末考排在 2026-12-10；春季班（class #1890）為 Moses Charikar 授課，週一週三 10:30–12:20。Autumn 2025 那屆上課地點是 NVIDIA Auditorium，考試訂在 2025-11-19 晚上 6 至 9 點，單場、實體、佔總成績 60%。
- **評分比重的歷屆變化**：Autumn 2019 為作業 60%、考試 20%、專案 20%；Autumn 2021 為作業 55%、考試 40%（兩場開書、各 100 分鐘、透過 Gradescope 發放）；Autumn 2022 為作業 60%、考試 40%，專案降為最多 2% 加分；Autumn 2023 起變成作業 40%、考試 60%；Autumn 2024 與 Spring 2025 為作業 40%、考試 59.5%（多出的 0.5% 是先修測驗），專案最多 1.5% 加分；Autumn 2025 為作業 40%、單場考試 60%，專案最多 1.5% 加分、Ed 討論最多 1% 加分。各數字取自 `stanford-cs221.github.io/<學期>/` 的評分段落。
- **模組數與公開範圍**：Spring 2025 的模組登錄檔（`modules/course-data.js`）共列出 111 個模組，其中 32 個帶 Panopto 影片連結、10 個在索引裡直接給 PDF 連結。那 10 份分別是五份先修複習與五份嵌入式倫理模組。其餘模組的投影片 PDF 未列在索引上，但同樣位於 `spring2025-extra/modules/<群組>/<名稱>.pdf`，逐一測試皆可下載。
- **Autumn 2025 的講次數**：課表列到第 20 講。其中第 17（語言模型）、18（AI 與社會）、19 三講在課程網站上標記為 `[New]`。第 19 講的名稱在課程網站上是「AI Supply Chains」，在講義 repo 的 README 上是「Economics of AI」，兩者連到的材料不同（前者無獨立連結，後者是一份 Google 簡報）。
- **作業歷屆組成**：Autumn 2022 為 foundations、blackjack、pacman、scheduling、car、logic；Autumn 2023 把 blackjack 換成 sentiment；Autumn 2024 與 Spring 2025 增加 route 與 mountaincar，成為八份；Autumn 2025 移除 scheduling 與 car，加入 bayesian 與 society。
- **遲交規則**：全學期 7 個延遲日，單份作業最多用 2 天，用完之後每逾一天上限降 25%，超過 2 天不收。
- **未能確認的項目**：（一）三份官方頁面在先修條件上不一致時該以哪一份為準，沒有任何一頁說明；本文只能建議取聯集，無法判定優先序。（二）約束滿足被砍掉的原因，第一堂講義只寫了結果與一個顏文字，沒有給理由。（三）專案從計分項降為加分項的原因，歷屆課程網站都沒有說明。（四）作業指南頁寫著提交的程式「不保證支援標準函式庫以外的套件，不要用 numpy、scikit-learn、pandas」，但第一份作業的安裝步驟要你 `uv add numpy einops`，兩頁的適用範圍我無法從頁面本身確定。（五）Autumn 2025 的選課人數未公開。

## 參考資料

- [CS221 歷屆開課索引](https://stanford-cs221.github.io/) — 列出 2019 秋季至 2025 秋季共 15 個學期的課程網站，本文的歷屆比對都從這裡進去。
- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/) — 本文的先修原文、評分比重、八份作業清單、20 講課表、誠信與生成式 AI 條款的來源。
- [CS221 Spring 2025 課程網站](https://stanford-cs221.github.io/spring2025/) — 上一版的模組制、兩場考試制、以及仍包含 scheduling 與 car 的作業表。
- [ExploreCourses：CS 221 條目](https://explorecourses.stanford.edu/search?q=CS+221&view=catalog) — `Prerequisites` 欄位列出 CS103、CS106B、CS109、CS161 的官方原文，以及 2026–2027 學年秋春兩班的授課者與時段。
- [Stanford Online：CS221 課程頁](https://online.stanford.edu/courses/cs221-artificial-intelligence-principles-and-techniques) — 第三份先修清單，以及非學位生的學士學位與 GPA 門檻。
- [CS221 Autumn 2025 可執行講義 repo](https://github.com/stanford-cs221/autumn2025-lectures) — MIT 授權，證明整學期講義以可執行 Python 形式公開，並列出每一講對應的檔案。
- [welcome.py（第一堂講義原始碼）](https://github.com/stanford-cs221/autumn2025-lectures/blob/main/welcome.py) — 課程對 AI 的定義、四能力加資源限制的框架，以及「Cut constraint satisfaction problems :(」那三條改版說明的出處。
- [edtrace](https://github.com/percyliang/edtrace) — 產生可執行講義的工具本身。
- [Spring 2025 模組索引](https://stanford-cs221.github.io/spring2025/modules/index.html) — 111 個模組的清單頁，也是 Panopto 影片連結需要登入的證據。
- [course-content 講義 PDF](https://stanford-cs221.github.io/spring2025-extra/modules/general/course-content.pdf) — 反射／狀態／變數／邏輯四層主脊、modeling–inference–learning 三支柱，以及邏輯與統計互補那段原文。
- [AI history 講義 PDF](https://stanford-cs221.github.io/spring2025-extra/modules/general/history.pdf) — 符號、神經、統計三條 AI 血脈的敘事，本文用來對照課程為何把統計視角當作全課的呈現方式。
- [conclusion 講義 PDF](https://stanford-cs221.github.io/spring2025-extra/modules/conclusion/conclusion.pdf) — 四層模型的總結表，包括邏輯那一層「Learning: ???」的空欄，以及課程建議的後續課程清單。
- [HW1 Foundations 作業頁](https://stanford-cs221.github.io/autumn2025/assignments/hw1_foundations/index.html) — 要求提交 AI 家教對話紀錄連結的兩題原文，以及 NumPy／einsum 的暖身內容。
- [HW3 Route Planning 作業頁](https://stanford-cs221.github.io/autumn2025/assignments/hw3_route/index.html) — 本文推薦的入門紙筆題 Problem 1，以及 Stanford 地圖版的 UCS 建模題。
- [HW5 Pac-Man 作業頁](https://stanford-cs221.github.io/autumn2025/assignments/hw5_pacman/index.html) — 本機評分器無法判斷超時那段警告的原文，也是分水嶺判斷的依據。
- [HW7 From Language to Logic 作業頁](https://stanford-cs221.github.io/autumn2025/assignments/hw7_logic/index.html) — 邏輯知識庫的 API、說謊者謎題，以及「這份作業沒有隱藏測資」的說明。
- [HW8 Society 作業頁](https://stanford-cs221.github.io/autumn2025/assignments/hw8_society/index.html) — 全書面的 AI 產品稽核作業，含不得選 ChatGPT／Gemini 的限制。
- [CS221 作業規則頁](https://stanford-cs221.github.io/autumn2025/homework.html) — 遲交日規則、Gradescope 提交流程、隱藏測資說明、以及提交程式的套件限制。
- [CS221 專案指南頁](https://stanford-cs221.github.io/autumn2025/project.html) — 「專案不計分」的原文，以及 baseline／oracle 那套題目品質判準。
- [CS221 歷屆學生專案 repo](https://github.com/stanford-cs221/sample-projects) — 課程網站給學生參考的公開專案樣本。
- [Stanford 榮譽守則](https://communitystandards.stanford.edu/policies-guidance/honor-code) — 課程誠信條款所引用的校級規定。
- 站內：[Stanford CS 課程導讀（系列入口地圖）](/posts/learning/2026-08-20-stanford-cs-course-map)
- 站內：[Stanford CS329A 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
- 站內：[Stanford CS230 導讀系列首篇](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)
