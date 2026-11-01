---
title: "Product Builder 面試日練 — 2026-11-02：Product Sense"
date: 2026-11-02
category: daily
type: digest
tags: [product-builder-interview, daily, product-sense]
lang: zh-TW
description: "用 CIRCLES 框架拆一題『幫長者獨立搭大眾運輸』的產品設計題，再搭配 Sean Ellis『很失望』分群法，看 Superhuman 怎麼把產品市場契合分數從 22% 做到 58%。"
tldr: "CIRCLES 負責把題目拆成七步結構，Sean Ellis 的『很失望』分群法負責決定該聽誰的話——這兩個框架合起來才是今天的重點：分群不是面試裡隨口列幾個人設，是決定後面所有分析該往哪個方向走的第一個選擇。練習題是真實 PM 模擬面試題庫收錄的『設計一個幫助長者獨立使用大眾運輸系統的產品』，拆解示範怎麼把長者這個籠統標籤，先切成『認知清楚但行動不便』與『認知退化但行動自如』兩種完全不同的失敗模式，再各自配不同的解法與安全防線。案例是 Rahul Vohra 在 First Round Review 公開的 Superhuman 原始敘述：早期只有 22% 使用者說『如果不能用了會很失望』，遠低於 Sean Ellis 認定的 40% 產品市場契合門檻，Vohra 沒有急著改產品，而是先把回答『很失望』的那群人單獨抓出來分析他們共同的使用情境，光是這個分群動作、什麼都還沒改，分數就跳到 32%，接下來四個季度用同一套『調查→分群→分析→迭代』流程跑完，分數依序推進到 47%、56%、58%。"
series:
  name: "Product Builder 面試日練"
  order: 75
---

> 🌏 [English version](/posts/daily/2026-11-02-product-builder-interview-daily-en)

## 今日主題

Product Sense 面試考的不是你有沒有框架，是你有沒有在一開始就選對要服務的那一群人。多數人一聽到「設計一個產品」就急著列解法，但真正拉開分數差距的，是最前面那一步：面對一個籠統的使用者標籤（長者、新手爸媽、小商家），你能不能把它拆成幾個行為完全不同的子群，然後講清楚為什麼先服務這一群、放掉另一群。今天用 CIRCLES 方法練一道面試題庫真實收錄的設計題，再用一個把分群當成整間公司成長引擎的真實案例收尾——不是比喻，是真的拿使用者調查數字跑出來的分數。

## 核心框架速記

### CIRCLES 方法

產品設計題最通用的七步結構，每一步都限制下一步要回答什麼，避免一開口就跳到解法：

| 步驟 | 要回答什麼 |
|---|---|
| **C**omprehend 理解情境 | 跟面試官確認這題在哪個產品、哪個情境下發生，縮小範圍 |
| **I**dentify 鎖定使用者 | 列出幾種可能的使用者群，選一群深入 |
| **R**eport 列出需求 | 這群人在這個情境下，真正卡住的是什麼 |
| **C**ut through 排序 | 需求通常不只一個，講清楚先解決哪一個、為什麼 |
| **L**ist 列解法 | 針對排第一的需求，提兩三個解法方向 |
| **E**valuate 評估取捨 | 挑一個解法，講清楚放棄其他選項的理由 |
| **S**ummarize 收尾 | 一句話總結方案，加上怎麼衡量成功 |

### Sean Ellis「很失望」分群法

CIRCLES 的「I（鎖定使用者）」說的是面試裡怎麼選人，Sean Ellis 這套講的是真實產品裡怎麼用數字找到該聽誰的話，兩者是同一件事的兩種做法：

1. **調查**：問現有使用者一題——「如果你再也不能用這個產品，你會有多失望？」選項是很失望、有點失望、不失望。
2. **分群**：只留下回答「很失望」的那一群，其他人先放一邊——他們的意見再多也不會讓產品變得更好，只會讓產品變得更雜。
3. **分析**：針對「很失望」這群人，再問一題開放題——「這個產品帶給你最大的好處是什麼？」找出他們共同描述自己的方式。
4. **迭代**：針對這群人的共同語言去改產品，讓更多潛在使用者也變成「很失望」那一群，分數會跟著往上跳。

這四步會不斷繞回「調查」重新量一次分數，而且每一圈的分數都該比上一圈高，所以是一個會越轉越強的循環，不是走完就結束的流程：

```diagram
title: Sean Ellis 產品市場契合引擎
desc: 調查、分群、分析、迭代四站繞成一個循環，每一圈都把累積的「很失望」比例分數往上推高。
caption: 簡化示意：Superhuman 實際上每一季只跑一輪，分數依序是 22%、32%、47%、56%、58%。
step: 對現有使用者跑「很失望」調查
step: 只留下回答很失望的那一群，更新目前的分數
step: 針對這群人分析他們共同的使用情境與語言
step: 針對這群人的需求迭代產品，下一圈從更高的分數重新量
step: 迭代完成後繞回調查，下一圈從更高的分數重新開始
---
<svg viewBox="0 0 440 392">
  <path class="dg-line" d="M280 56.3A152 152 0 0 1 368.8 165.1" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M369.4 224A152 152 0 0 1 282.7 334.4" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M160 335.7A152 152 0 0 1 71.2 226.9" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M70.6 168A152 152 0 0 1 157.3 57.6" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--dashed" d="M312 196H276" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--dashed" d="M220 224V316" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="1 5">
    <rect class="dg-box" x="160" y="16" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">調查</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">很失望問卷</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="312" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">分群</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">只留很失望</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="160" y="320" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">分析</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">共同情境語言</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="8" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="68" y="187" text-anchor="middle" dominant-baseline="central">迭代</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">針對該群改版</text>
  </g>

  <rect class="dg-box dg-box--store" x="168" y="168" width="104" height="56" rx="6"/>
  <text class="dg-label" x="220" y="187" text-anchor="middle" dominant-baseline="central">PMF 分數</text>
  <text class="dg-sub" x="220" y="207" text-anchor="middle" dominant-baseline="central">每圈都更高</text>

  <text class="dg-edge" x="292" y="182" text-anchor="middle" dominant-baseline="central" data-step="2">更新</text>
  <text class="dg-edge" x="230" y="270" text-anchor="start" dominant-baseline="central" data-step="3">鎖定</text>
</svg>
```

## 今日練習題

### 題目

「設計一個幫助長者獨立使用大眾運輸系統的產品。」（來源：PMMockr 產品經理模擬面試題庫，屬於產品設計類真題）

### 拆解思路

1. **釐清問題**：先問面試官「獨立」指的是完全不靠家人陪同，還是只要降低每次出門都要求助的頻率？這會決定方案要做到什麼程度的自動化。再問範圍是公車、捷運還是所有大眾運輸——先鎖定一種交通工具深入，不要同時設計三種系統。
2. **定義使用者**：把「長者」切成至少兩個完全不同的子群——一群是認知清楚但行動或視力不便（怕上下車太慢、怕找不到月台），另一群是認知開始退化但行動自如（怕坐錯站、怕忘記怎麼轉乘）。這兩群人的失敗模式不一樣，不能用同一個解法打包。
3. **結構化分析**：用 CIRCLES 的 R 步驟，針對選定的子群列出真正卡住他們的是什麼，通常不是「不會用手機」這種表面問題，是「怕出狀況時求助不到人」這種深層的安全感缺口。
4. **提出方案**：針對排第一的需求提方案，並講清楚為什麼放掉另一個子群——例如先服務「行動不便但認知清楚」這群，因為他們能自己操作介面，方案可以是即時月台語音報位、延長刷卡感應窗口；放掉「認知退化」這群是因為他們的解法更像是照護產品而不是運輸產品，混在一起會讓第一版做得又慢又模糊。
5. **定義成功**：北極星可以是「獨立完成一次完整轉乘的比例」，輸入指標盯語音報位使用率，反指標要盯「求助按鈕被按下的次數」，因為如果獨立完成率上升但求助次數也同步飆高，代表使用者是硬撐著用，不是真的更有信心。

### 範例回答（面試時可以這樣講）

> **先講分群，不要先講解法**：「這題我會先把『長者』拆成兩種完全不同的人。第一種是行動或視力不方便，但判斷和記憶都正常，他們的恐懼是『萬一上下車太慢被車門夾到、或找不到正確月台怎麼辦』。第二種是認知開始退化，判斷力不穩定，他們的恐懼是『會不會坐過站、會不會忘記自己要去哪』。這兩種人需要的根本不是同一個產品，我會先選第一種深入，因為他們能自己操作手機介面，第一版可以做得完整，不用等到照護相關的流程設計好。」
>
> **接問題跟方案**：「這群人真正卡住的不是『不會用 App』，是『出狀況的那一刻求助不到人』——月台廣播太快聽不清楚、轉乘指標太小看不到。我的第一版會做即時語音報位：手機定位到車廂位置後，用大字體加語音提前兩站提醒『下一站到了請往車頭移動』，同時把刷卡感應窗口自動延長，因為他們上下車本來就比一般乘客慢。我不會先做『求救按鈕通知家人』這種照護功能，因為那解決的是家人的焦慮，不是這位長者當下想要的獨立感。」
>
> **收在指標**：「我會用『獨立完成一次完整轉乘的比例』當北極星，輸入指標盯語音提醒的開啟率，反指標盯求助按鈕被按下的次數——如果獨立完成率上升、求助次數也一起飆高，代表使用者只是硬撐著用介面，我會把這當成紅燈，優先回頭修介面而不是慶祝北極星數字。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有沒有把「長者」拆成至少兩個失敗模式不同的子群 | |
| 有沒有講清楚為什麼先服務這群、放掉另一群 | |
| 需求有沒有講到深層的安全感缺口，不是停在表面的「不會用」 | |
| 方案有沒有針對排第一的需求，而不是把所有想到的功能都塞進去 | |
| 有沒有講出北極星、輸入指標、反指標三層 | |
| 加分項：反指標能不能揭穿「表面成功、實際硬撐」的假象 | |

## 今日案例

**Superhuman：用一題調查，把產品市場契合從「感覺」變成「分數」**

Superhuman 創辦人 Rahul Vohra 在 First Round Review 公開的原始文章裡講得很直接：早期團隊內部對「我們準備好規模化了嗎」這件事意見分歧，有人覺得已經可以衝，有人覺得還太早，但誰都拿不出證據。他借用成長顧問 Sean Ellis 的調查法，問現有使用者「如果你再也不能用 Superhuman，你會有多失望」，結果只有 22% 回答「很失望」，遠低於 Ellis 認定能健康成長的 40% 門檻。多數團隊看到這個數字會急著改產品，Vohra 的做法是先把回答「很失望」的那群人單獨抓出來，只分析他們的使用情境與共同描述自己的方式，完全不理會另外 78% 的意見——光是這個分群動作，什麼功能都還沒改，分數就從 22% 跳到 32%。接下來團隊把這套「調查、分群、分析、迭代」流程變成每季固定跑一輪的引擎，分數依序推進到 47%、56%、58%。

**面試連結**：這個案例可以直接拿來回答面試官常見的追問——「你怎麼知道該聽誰的意見？」很多人會答「做使用者訪談」，但訪談誰、訪談多少人才是真正的分群問題。Superhuman 的做法示範了一個更具體的答案：先用一題篩選把使用者切成「會不會離不開產品」兩群，只深入分析其中一群，而且用同一套流程反覆跑，讓分數本身變成追蹤產品決策有沒有進步的北極星。拿今天的大眾運輸題來說，等於是先把長者切成兩個子群，再用「獨立完成轉乘比例」當同等角色的分數，每一輪改版都重新量一次。

## 延伸閱讀

- [How Superhuman Built an Engine to Find Product Market Fit](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit) — Rahul Vohra 本人撰寫的第一手敘述，今天案例的完整四步流程與各季分數出處。
- [Product Sense Interview Prep (2026 Guide)](https://www.aced.io/blog/product-sense-interview) — 補充 Product Sense 面試在 Meta、Stripe、Airbnb 等公司的實際考法與評分重點。
- [Product Manager Mock Interview Practice](https://www.pmmockr.com/product-manager-interview-practice) — 今天練習題的原始題庫，附其他產品設計、指標、策略類真題與解法大綱可以接著練。

## 參考資料

- [How Superhuman Built an Engine to Find Product Market Fit](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit) — Sean Ellis 分群法四步流程與 22%→58% 分數進展的原始出處。
- [Product Manager Mock Interview Practice](https://www.pmmockr.com/product-manager-interview-practice) — 練習題「設計一個幫助長者獨立使用大眾運輸系統的產品」出處。
- [Product Sense Interview Prep (2026 Guide)](https://www.aced.io/blog/product-sense-interview) — CIRCLES 方法與 Product Sense 面試評分重點出處。
