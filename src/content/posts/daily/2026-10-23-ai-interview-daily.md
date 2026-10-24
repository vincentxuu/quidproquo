---
title: "AI Engineer 面試日練 — 2026-10-23：Coding"
date: 2026-10-23
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: zh-TW
description: "星期五輪到 ML-flavored coding——今天練的是 reservoir sampling：從一個長度未知的資料串流裡均勻抽出 k 筆，不能排序、不能回頭看，也不是什麼題都該急著向量化。"
tldr: "今天的練習題是『從未知長度的資料串流裡均勻抽樣 k 筆』（reservoir sampling），改編自 CoPilot Interview 2026-10-22 發布的 MLE onsite 面試文章。核心不是背公式，是講得出『第 i 筆元素留在樣本裡的機率為什麼是 k/n』的歸納證明，以及為什麼這類單趟、狀態相依的串流題不該硬套上星期五教的向量化手法。"
series:
  name: "AI Engineer 面試日練"
  order: 65
---

> 🌏 [English version](/posts/daily/2026-10-23-ai-interview-daily-en)

## 今日主題

星期五繼續練 Coding，但今天換個子類型：上週練的 k-means 是「批次資料、一次全部讀進記憶體」的題型，今天練的是「串流資料、長度你事先不知道」的題型——reservoir sampling。這類題目在 MLE 的 onsite coding round 常跟「算 precision/recall/F1」「算使用者七天滾動活躍次數」排在同一組題庫裡，考的核心能力不是資料結構背得熟不熟，是你能不能在記憶體受限、資料只能看一次的前提下，推導出一個機率上站得住腳的演算法，並且講清楚「為什麼」而不是只把程式碼打出來。

## 核心概念速記

### 1. ML coding 題的「ML 味」藏在機率與串流假設裡

一般 LeetCode 題假設資料已經全部在手上，愛怎麼排序、怎麼多趟掃描都隨你。MLE 面試常故意加上「串流」或「機率抽樣」的限制——資料來源可能是使用者行為 log、即時特徵流、或大到裝不進記憶體的資料集，這時「排序後再處理」直接出局。面試官想看的是你有沒有意識到這個限制會整個改變解法方向，而不是把題目硬套進你背過的某個樣板。

### 2. Reservoir sampling 的核心不變量：每個元素留下的機率都要是 k/n

演算法本身不難：先把前 k 筆塞進「水庫」(reservoir)，從第 k+1 筆開始，對每一筆新資料用亂數決定要不要把它換進水庫、換掉誰。難的是講出為什麼這樣做是對的——用數學歸納法證明：處理完第 i 筆之後，水庫裡任何一個元素存在的機率都剛好是 k/i。這個不變量成立，才能保證跑到資料流結束時，所有 n 筆資料裡任何一筆被抽中的機率都是 k/n，是真正的均勻抽樣，不是看起來隨機但其實有偏。

```diagram
title: Reservoir sampling：第 i 筆資料的抽換判斷
desc: 資料流讀到第 i 筆時，用均勻亂數 r 決定要不要把它換進水庫、換掉第幾筆，讓每筆資料最終被抽中的機率都是 k/n。
caption: 簡化示意：只畫第 k+1 筆以後的判斷；前 k 筆會直接放入水庫，不經過這個判斷。
---
<svg viewBox="0 0 640 440">
  <path class="dg-line" d="M280 34V60" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 116V172" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M376 216H432" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M280 260V312" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 360V408"/>
  <path class="dg-line" d="M512 240V400Q512 408 504 408H280"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M280 408H100Q92 408 92 400V96Q92 88 100 88H200" marker-end="url(#arrow-warn)"/>

  <circle class="dg-dot" cx="280" cy="28" r="6"/>
  <circle class="dg-dot" cx="280" cy="408" r="4"/>

  <g>
    <rect class="dg-box" x="200" y="60" width="160" height="56" rx="6"/>
    <text class="dg-label" x="280" y="77" text-anchor="middle" dominant-baseline="central">讀入下一筆資料</text>
    <text class="dg-sub" x="280" y="100" text-anchor="middle" dominant-baseline="central">第 i 筆，i &gt; k</text>
  </g>

  <g>
    <path class="dg-box" d="M280 172L376 216L280 260L184 216Z"/>
    <text class="dg-label" x="280" y="206" text-anchor="middle" dominant-baseline="central">r 小於 k？</text>
    <text class="dg-sub" x="280" y="228" text-anchor="middle" dominant-baseline="central">r = rand(0, i)</text>
  </g>

  <g>
    <rect class="dg-box dg-box--accent" x="432" y="192" width="160" height="48" rx="6"/>
    <text class="dg-label" x="512" y="216" text-anchor="middle" dominant-baseline="central">換掉水庫第 r 筆</text>
  </g>

  <g>
    <rect class="dg-box" x="200" y="312" width="160" height="48" rx="6"/>
    <text class="dg-label" x="280" y="336" text-anchor="middle" dominant-baseline="central">丟棄這筆資料</text>
  </g>

  <text class="dg-edge" x="398" y="204" text-anchor="middle" dominant-baseline="central">是</text>
  <text class="dg-edge" x="290" y="276" text-anchor="start" dominant-baseline="central">否</text>
  <text class="dg-edge dg-text--warn" x="102" y="250" text-anchor="start" dominant-baseline="central">還有下一筆</text>
</svg>
```

### 3. 串流限制改變了你能用的工具箱

批次題可以排序、可以多趟掃描、可以把整包資料攤開算距離矩陣；串流題只能看一次、不能回頭、記憶體只能裝 O(k) 而不是 O(n)。這代表你平常熟悉的某些招式（排序找中位數、多趟收斂這類迭代法）在這裡直接不能用，必須換成單趟、邊讀邊更新狀態的寫法。面試官故意用「資料串流」「未知長度」這兩個詞,就是在測你會不會先確認限制、再選演算法,而不是看到抽樣兩個字就反射性寫 `random.sample`。

### 4. 不是每個 ML coding 題都該急著向量化

上週五練 k-means 時強調「用 broadcasting 取代巢狀迴圈」,但 reservoir sampling 剛好是反例——每一步要不要換進水庫,機率跟結果都依賴前一步的狀態,是一個本質上序列相依的隨機決策鏈,不能用向量化一次算完,勉強向量化反而容易在「亂數種子共用」或「假裝獨立但其實不獨立」這種地方留下不易察覺的 bug。面試官想聽到的是你分得清楚「這題該向量化」跟「這題結構上不能向量化,硬做只會製造新 bug」兩種情況的差別。

### 5. Precision/Recall/F1 的 zero division 是同一份題庫裡的常見陷阱

同一篇文章列的另一題——「寫一個函式算 precision、recall、F1,處理模型完全沒預測任何正例的情況」——考的是同一種「邊界情況決定及格與否」的心態。分母為零時要明確定義回傳值（通常是 0,並在文件裡寫清楚這個選擇),而不是讓程式直接噴 `ZeroDivisionError` 或悄悄回傳 `nan`。

## 今日練習題

### 題目

你有一個資料來源,事先不知道它的長度(可能是即時事件流,也可能是大到沒辦法先算出總筆數的檔案)。請實作一個函式,從這個串流裡均勻抽出 k 筆資料,要求只能掃描資料一次,且額外記憶體只能跟 k 成正比(不能跟資料總長度 n 成正比)。並說明為什麼你的方法是均勻抽樣。

**來源**：改編自 CoPilot Interview「Machine Learning Engineer Onsite Interview: Round by Round」文章列出的 MLE coding round 範例題（2026-10-22 發布）　**難度**：中等　**環節**：onsite coding round

### 拆解思路

1. **先釐清問題**：資料是真的完全未知長度,還是上限已知只是很大?抽樣結果要不要保留原始順序?如果資料流中途可能重複出現同一筆,要不要去重?這些會決定要不要在基本版之外加額外處理。
2. **建立框架**：把問題拆成兩段——前 k 筆直接全部放進水庫,不需要任何機率判斷;從第 k+1 筆開始,每一筆都要決定「要不要換掉水庫裡的某一筆」,決定的機率公式才是整題的核心。
3. **深入核心**：第 i 筆(從 1 算起,i > k)要留在水庫的機率必須是 k/i,所以做法是生成一個 0 到 i-1(或 1 到 i,視實作習慣)的均勻亂數,如果這個亂數落在水庫大小的範圍內,就用這筆新資料換掉水庫裡對應位置的那筆,否則就丟棄。關鍵是要能口頭證明:假設前 i-1 筆處理完之後,每筆都以 k/(i-1) 的機率留在水庫裡,加入第 i 筆之後,舊資料留下的機率要經過「沒被換掉」的條件機率修正,新資料留下的機率要是 k/i,兩者算出來要一致,整個歸納鏈才成立。
4. **收尾**：提時間複雜度 O(n)、額外空間 O(k),並主動講這個演算法的實務限制——如果 n 其實已知且不大,直接用 `np.random.choice` 不放回抽樣會更直覺也更好測試,reservoir sampling 真正該用的場合是「n 真的未知或大到不能先算」這種串流情境。

### 範例回答（面試時可以這樣講）

> **先確認限制。** 我會先問清楚資料來源是不是真的事先不知道長度,還是只是「很大」,因為如果 n 其實有上限,直接用均勻亂數不放回抽樣會更簡單也更好測。假設確認真的是未知長度的串流,我就會往 reservoir sampling 的方向走。
>
> **寫核心邏輯。** 前 k 筆我會直接全部放進一個固定大小的陣列當水庫,不做任何機率判斷。從第 k+1 筆開始,對每一筆新資料,我會生成一個 0 到目前已經看過的筆數減一之間的均勻亂數,如果這個數字小於 k,就用這筆新資料換掉水庫裡索引等於這個亂數的那一筆,否則直接丟棄這筆資料繼續往下讀。整個過程只掃描一次,額外記憶體只有水庫本身的 O(k),完全不依賴 n。
>
> **證明為什麼是對的。** 這是面試官真正想聽的部分——用歸納法:假設處理完第 i-1 筆之後,水庫裡每一筆的存在機率都是 k/(i-1),那處理第 i 筆時,新資料留下的機率是我選的亂數範圍,算出來剛好是 k/i;舊資料要留下,必須是這次沒被換掉,機率是「沒被選中去替換」乘上「原本就在水庫裡」,兩項相乘後化簡,算出來也剛好是 k/i。歸納成立,代表跑到最後一筆資料時,所有 n 筆資料裡任何一筆最終留在水庫的機率都公平地是 k/n,這才是「均勻抽樣」真正的定義,不是感覺隨機就夠了。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先確認資料真的是未知長度串流，而非已知上限 | |
| 前 k 筆直接放入水庫、第 k+1 筆起才用機率判斷換入，兩階段分清楚 | |
| 能口頭講出「每筆元素留下機率為 k/n」的歸納證明，不只是背演算法步驟 | |
| 明確講出時間 O(n)、額外空間 O(k)，且不依賴 n | |
| 加分：講出這題結構上不適合向量化，跟批次題（如 k-means）的差異 | |

## 延伸閱讀

- [Machine Learning Engineer Onsite Interview: Round by Round — CoPilot Interview](https://copilotinterview.com/blog/machine-learning-engineer-onsite-interview) — 今日練習題的改編來源，同一份題庫還列了 precision/recall/F1、滾動視窗活躍次數等 ML-flavored coding 範例
- [LinkedIn Interview Questions (Updated 2026) — PracHub](https://prachub.com/companies/linkedin) — 217 題真實 LinkedIn 面試題庫，MLE 分類明確點出「機率抽樣」「加權索引抽樣」是常考主題，可對照練習
- [Machine Learning Interview Questions and Answers (2026) — goodspace.ai](https://goodspace.ai/interview-questions/machine-learning) — mini-batch SGD 的完整向量化 NumPy 實作，可對照今天「哪些題該向量化、哪些不該」的討論

## 參考資料

- [Machine Learning Engineer Onsite Interview: Round by Round — CoPilot Interview](https://copilotinterview.com/blog/machine-learning-engineer-onsite-interview) — 今日練習題（reservoir sampling）與 precision/recall/F1 zero division 陷阱的來源
- [LinkedIn Interview Questions (Updated 2026) — PracHub](https://prachub.com/companies/linkedin) — MLE 面試常考「機率抽樣」「加權索引抽樣」主題的佐證來源
- [Machine Learning Interview Questions and Answers (2026) — goodspace.ai](https://goodspace.ai/interview-questions/machine-learning) — 向量化 NumPy 實作範例，作為「哪些題該向量化」的對照
