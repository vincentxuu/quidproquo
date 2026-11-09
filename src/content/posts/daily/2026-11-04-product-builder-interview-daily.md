---
title: "Product Builder 面試日練 — 2026-11-04：Strategy & Execution"
date: 2026-11-04
category: daily
type: digest
tags: [product-builder-interview, daily, strategy]
lang: zh-TW
description: "用 TAM-SAM-SOM 的 bottom-up 算法估市場規模，再練一道產品組合分配題：12 個人季的開發產能要怎麼分給可靠度、活化、新客群探索跟兩個被喊停的提案，取捨怎麼講才站得住。"
tldr: "今天的核心不是背出 TAM-SAM-SOM 三個字母，是練 bottom-up 算法：先列出可觸及的具體帳號清單（beachhead），再乘轉換率跟客單價往上推，而不是從一個很大的市場數字往下乘百分之一。練習題是一道產品組合分配案例——12 個人季的產能要分給可靠度、新用戶活化、新客群探索跟保留額度，同時要喊停兩個已經有政治聲量的提案，怎麼講清楚為什麼停、停了之後誰接手，比分配比例本身更重要。"
series:
  name: "Product Builder 面試日練"
  order: 77
---

> 🌏 [English version](/posts/daily/2026-11-04-product-builder-interview-daily-en)

## 今日主題

Strategy 面試最常見的失分點不是算錯市場規模,是用一個嚇人的大數字去交換説服力——「這是一個 500 億美元的市場」聽起來很有份量,但面試官接下來只會問一句:「所以你打算先打誰?」答不出一份具體的帳號清單,前面的大數字就只是裝飾。今天用兩件事練這個落差:TAM-SAM-SOM 的 bottom-up 算法練市場規模要怎麼算到能被檢驗,再用一道產品組合分配題練「停掉一個提案」要講清楚哪些具體動作,而不是一句「我們會重新排優先順序」就想過關。

## 核心框架速記

### 框架一:TAM-SAM-SOM(bottom-up 版)

三層定義分別回答不同的問題,但多數人卡在用 top-down 算法算出一個漂亮卻沒人信的數字:

| 層級 | 回答的問題 | 算法 | 常見錯誤 |
|---|---|---|---|
| **TAM** 總潛在市場 | 這個市場的天花板有多高 | 用產業報告、分析師數據 | 引用一個自己的產品根本服務不到的市場規模 |
| **SAM** 可服務市場 | 以現在的產品能力,能服務誰 | 用產品定位、地理範圍、目標客群去過濾 TAM | 忽略產品本身的能力限制 |
| **SOM** 可取得市場 | 3-5 年內,憑現有資源能拿下多少 | bottom-up:可觸及帳號數 × 轉換率 × 客單價 | 假設轉換率可以線性放大到全市場 |
| **Beachhead** 灘頭堡 | 下週一要先打誰 | 列出 25-100 個具體帳號名字 | 整個 SOM 階段完全跳過,只有規模沒有名單 |

Top-down 的算法是「市場規模 150 億,我們拿下 1%,所以營收 1.5 億」——沒有人會相信這個數字,包括講這句話的人自己。Bottom-up 的算法是「某個垂直市場裡有 4.5 萬家公司符合我們的客群特徵,平均客單價 8000 美元一年,如果轉換 3%,就是 1080 萬美元年收」——這是一個操盤者跟投資人都可以一起追問的故事,因為每個數字都能被拆開檢查。

### 框架二:Porter 五力(面試裡怎麼用才不空泛)

五力分析本身是教科書框架,面試官真正要看的是你能不能把它套進一個具體決策,而不是背誦五個名詞:

1. **現有競爭者**:這個市場已經有誰在打,靠什麼活下來
2. **新進入者威脅**:進這個市場的門檻是什麼,你的對手容易被複製嗎
3. **替代品威脅**:客戶不買你的產品,會用什麼方法解決同一個問題(包括「什麼都不做」)
4. **供應商議價力**:你依賴的上游(雲端服務、資料來源、關鍵人才)有多少談判空間
5. **買方議價力**:你的客戶換掉你的成本有多低

面試裡最常漏掉的是「替代品」這一格,因為多數人只想競品,卻忘了客戶最大的競爭對手往往是「維持現狀」。

## 今日練習題

### 題目

「一個 B2B workflow 產品,下一季有 12 個人季的自由開發產能可以分配。既有客戶在續約時反覆提到可靠度問題;新管理員第一次用產品常常卡在找不到第一個有用的工作流;業務部門提案要做一個區域市場的推廣;某個高層想要一個付費的高級儀表板;還有一位 PM 提案要做一個新客群的探索研究。你會怎麼分配這 12 個人季?」(來源:PracHub 虛構案例,官方標註為原創練習材料,非驗證雇主真題)

### 拆解思路

1. **釐清目標,不要預設「最大化營收」**:先跟面試官確認這一季的目標是「保護既有客戶價值,同時確立下一步該投資哪個成長方向」,這個目標比「最大化營收」窄,但窄是刻意的——它排除了用猜測的 ROI 去硬比較四個性質完全不同的提案。
2. **列出受影響的對象,不要只講「使用者」**:既有客戶(抱怨可靠度)、新管理員(卡在活化)、業務部門(要推廣)、高層(要儀表板)、新客群(待驗證)——五個對象的證據強度完全不同,先分這一層才能決定誰的證據夠格拿到產能。
3. **用證據品質/策略相關性/可逆性/資源衝突四個維度打分,不要只算 ROI**:可靠度跟活化有具體的客訴記錄跟漏斗數字當證據,區域推廣跟儀表板目前只有「業務部門想做」跟「高層想要」當理由,新客群探索則完全還沒有證據,四者不該用同一套精確 ROI 公式硬比。
4. **提出配置方案,並且明確喊停兩個提案**:例如 4 個人季給可靠度、4 個人季給活化、2 個人季給新客群探索(限定在訪談驗證,不做任何交付系統)、2 個人季留作保留額度。區域推廣跟儀表板這一季不給團隊——「停」要講清楚三個動作:撤掉已排的里程碑、通知受影響的關係人、把還有價值的研究(例如儀表板背後的客戶訪談)留下來,而不是把兩個提案悄悄留在路線圖上卻不配人,製造「看起來有在做」的假象。
5. **定義保留額度的釋放條件跟成功指標**:保留額度要講清楚誰有權釋放、在什麼證據門檻下釋放(例如重大事故或驗證到新的硬性限制),否則關係人會透過一個個小請求把保留額度吃光,等真正的不確定性出現時反而沒有餘裕。

```diagram
title: 12 人季開發產能的組合分配
desc: 可靠度與活化各拿 4 人季,新客群探索與保留額度各拿 2 人季,加總 12;區域推廣與儀表板兩個提案本季不分配人力,完全停止,所以沒有出現在這張圖裡。
caption: 示意資料,改寫自 PracHub 虛構練習案例。換算:基線 y=300,每人季 60 單位(y=300−人季數×60),縱軸從 0 起。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">人季</text>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">2</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="228" y="60" width="64" height="240"/>
    <rect class="dg-bar dg-bar--soft" x="336" y="180" width="64" height="120"/>
    <rect class="dg-bar dg-bar--soft" x="444" y="180" width="64" height="120"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="120" y="60" width="64" height="240"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-label dg-text--accent" x="152" y="50" text-anchor="middle" dominant-baseline="central">4</text>
  <text class="dg-sub" x="260" y="50" text-anchor="middle" dominant-baseline="central">4</text>
  <text class="dg-sub" x="368" y="170" text-anchor="middle" dominant-baseline="central">2</text>
  <text class="dg-sub" x="476" y="170" text-anchor="middle" dominant-baseline="central">2</text>

  <text class="dg-label dg-text--accent" x="152" y="320" text-anchor="middle" dominant-baseline="central">可靠度</text>
  <text class="dg-sub" x="260" y="320" text-anchor="middle" dominant-baseline="central">活化</text>
  <text class="dg-sub" x="368" y="320" text-anchor="middle" dominant-baseline="central">新客群探索</text>
  <text class="dg-sub" x="476" y="320" text-anchor="middle" dominant-baseline="central">保留額度</text>
</svg>
```

### 範例回答(面試時可以這樣講)

> **先定義目標再分配**:「我會先跟面試官確認,這一季的目標不是最大化營收,而是在保護既有客戶價值的前提下,確立下一個該投資的成長方向——這樣我才有理由把兩個看起來很吸引人的提案往後排,而不是被迫把每個提案都塞一點資源進去。」
>
> **用證據分層,不用精確 ROI 硬比**:「可靠度問題有具體的續約抱怨記錄,活化卡關有漏斗數字可以驗證,這兩個我歸類為有證據的既有價值保護。區域推廣跟儀表板目前都只是提案,沒有客戶證據支撐規模,新客群探索則完全還在假設階段——我不會幫這兩個還沒驗證的提案編一個漂亮的 ROI 數字去跟前兩個比,因為那個數字是編出來的,不是算出來的。」
>
> **明確喊停,講清楚停的動作**:「我會分配 4 個人季給可靠度、4 個人季給活化、2 個人季給新客群的驗證性訪談、2 個人季當保留額度。區域推廣這一季直接喊停,我會撤掉已經排進去的里程碑,去跟業務部門說清楚原因,也會問清楚是不是有合約義務需要先滿足——如果有,那是一個有限範圍的承諾,不代表整個區域推廣案過關。儀表板我會保留客戶訪談這部分繼續做,但不會承諾交付系統,因為目前還不知道這個儀表板真正要改變的是哪個客戶行為。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點:

| 核對項目 | 有提到? |
|---------|---------|
| 有沒有先定義這一季的目標,而不是預設「最大化營收」 | |
| 有沒有把每個提案的證據強度分開看,而不是用同一套 ROI 硬比 | |
| 配置數字有沒有加總對,且留了保留額度 | |
| 「停」有沒有講清楚具體動作(撤里程碑、通知關係人、留存研究) | |
| 保留額度有沒有講清楚釋放條件跟釋放權在誰手上 | |
| 加分項:有沒有講清楚自己在這個決策裡是建議者、核准者、還是執行一個上層已經下的決定 | |

## 今日案例

**GitLab:把「哪些功能該停止投資」的決策寫進公開的 handbook,而不是留在會議室裡**

GitLab 的產品管理團隊把資源分配跟決策框架整個寫成公開的線上手冊,任何人(包括還沒加入公司的面試者)都能看到一個功能為什麼拿到資源、為什麼被降到次要優先順序。這跟多數公司「策略決策在高層會議室裡做完,團隊只收到結論」的做法完全相反——GitLab 選擇把判斷依據本身公開,讓外部也能檢查這個組織的決策邏輯是不是前後一致,而不只是公開最終結果。

**面試連結**:這個案例可以用來回答「你怎麼讓一個停止投資的決定讓團隊信服,而不是覺得你在搞政治?」——很多人的答案停在「我會多溝通」,但多溝通不等於決策可受檢驗。GitLab 的做法示範了另一種答案:把決策標準寫下來並公開,讓「這次為什麼停」跟「上次為什麼沒停」可以被同一套標準檢查。拿今天的練習題來說,如果區域推廣喊停的理由只存在你腦中,下一次業務部門還是會覺得是你針對他們;但如果這套四維度打分標準(證據品質/策略相關性/可逆性/資源衝突)是公開且重複使用的,爭議會從「你針對我」變成「這次的證據是不是真的比較弱」。

## 延伸閱讀

- [Product Leader Interview Questions: Portfolio Strategy, PM Coaching, and Organizational Decisions](https://prachub.com/resources/product-leader-interview-questions-portfolio-strategy-pm-coaching-and-organizational-decisions) — 今天練習題與拆解思路的原始出處,附更多關於歸因(你是建議者還是核准者)的追問練習。
- [Go to Market Strategy: 5 Motions, 7-Layer B2B Framework](https://www.tommasomariaricci.com/blog/go-to-market-strategy-complete-framework) — TAM-SAM-SOM bottom-up 算法與七層 B2B GTM 框架的完整說明,附 2026 年 Gartner 數據佐證買方行為轉變。
- [GitLab Product Management Handbook](https://handbook.gitlab.com/handbook/product/product-management/) — 今天案例引用的 GitLab 公開產品管理手冊,可以直接看到真實公司怎麼把決策標準寫成可檢驗的公開文件。

## 參考資料

- [Product Leader Interview Questions: Portfolio Strategy, PM Coaching, and Organizational Decisions](https://prachub.com/resources/product-leader-interview-questions-portfolio-strategy-pm-coaching-and-organizational-decisions) — 今日練習題(12 個人季產能分配案例)的原始出處,官方標註為虛構練習材料。
- [Go to Market Strategy: 5 Motions, 7-Layer B2B Framework](https://www.tommasomariaricci.com/blog/go-to-market-strategy-complete-framework) — TAM-SAM-SOM bottom-up 算法段落、beachhead 帳號清單概念的出處。
- [GitLab Product Management Handbook](https://handbook.gitlab.com/handbook/product/product-management/) — 今日案例「公開決策標準」的原始依據,GitLab 官方產品管理手冊。
