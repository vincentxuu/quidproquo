---
title: "AI Engineer 面試日練 — 2026-11-14：Paper Reading"
date: 2026-11-14
category: daily
type: digest
tags: [ai-engineer-interview, daily, paper-reading]
lang: zh-TW
description: "今天讀的是 DISCERN——一篇指出企業 agent 記憶的真正難題不是檢索、是「解析」的論文，練的是面試官給你一個雙客戶名字相似、新舊報價互相矛盾的案例，要你設計怎麼解析指稱、辨別哪筆現行、該不該誠實拒答。"
tldr: "今天的論文是 DISCERN（arXiv:2611.15729，Amazon 團隊，2026-11-11 發布）。在 ENT-310 這個企業 sales agent 記憶 benchmark 上，八個基線的 retention、currency 都落在 0.93–0.98，代表查得到證據早就不是問題，真正的缺口是解析：指稱哪個實體、哪個時間點的事實現行、要不要拒答。DISCERN 的原則是「寫入時只保留、讀取時才解析」，寫入時把易混淆的實體連結但不合併、把被取代的事實軟性失效但不刪除，讀取時用不靠 LLM 判斷的導航迴圈收斂成回答、更新、澄清、拒答四個終端動作之一。結果是拒答 F1 0.924（基線最高 0.802），entity resolution 0.800（基線沒有一個超過 0.40），換到完全沒調參的 LoCoMo 一樣領先。練習題模擬面試官丟一個名字相似、報價互相矛盾的客戶記憶案例，要你設計怎麼解析指稱、判斷時效、決定該不該拒答。"
series:
  name: "AI Engineer 面試日練"
  order: 87
---

> 🌏 [English version](/posts/daily/2026-11-14-ai-interview-daily-en)

## 今日主題

星期六是 Paper Reading，練的不是背論文結論，是面試官丟一個企業 agent 記憶系統的案例、要你當場設計「這個系統該怎麼解析指稱、辨別時效、決定要不要拒答」的討論題。今天選的論文是 2026-11-11 掛上 arXiv 的 DISCERN（出自 Amazon 團隊），主題是企業 agent 跨 session 累積記憶時，相似實體會在向量空間裡糊在一起、事實會互相取代，而這篇論文的核心論點是：大家把這當成檢索問題在解，其實不是——在他們的 benchmark 上，連最普通的 RAG reader 都能把 retention、currency 這兩個「證據是否被檢索到」的指標做到 0.93 以上，真正卡住的是解析：這個查詢指的是哪個實體、哪個時間點的事實才是現行、證據不足時要不要誠實拒答。這個拆解動作跟 Thursday 的 LLM & Agent Engineering 主題（RAG、agent 架構、guardrails）直接相關，也是面試官很愛考的「你以為是檢索問題，其實是另一層問題」的典型案例。

## 核心概念速記

### 1. 把記憶問題拆成「檢索」跟「解析」兩層，檢索早就解決了

ENT-310 上，八個基線在 retention、currency（證據是否被檢索到）的指標上都落在 0.93–0.98 之間，連最弱的 vanilla RAG reader 都一樣，說明光是「查得到相關記憶」這件事早就飽和了。真正卡住的是解析層：這筆查詢指的是哪個實體（entity resolution）、哪個時間點的事實才是現行（temporal currency），以及證據不夠時要不要誠實說「我不知道」（abstention）。面試官問「幫 agent 設計記憶系統」時，很多人會把力氣全部花在換更好的 retriever 或 embedding，但論文的數據顯示，那其實不是真正的瓶頸。

### 2. 寫入時只增不減：易混淆的實體連結但不合併，被取代的事實軟性失效但不刪除

DISCERN 的核心原則是「preserve at write, resolve at read」。寫入時遇到名字很像的兩個實體（例如 Zephyron Cloud Solutions 跟 Zephyron Cloud Systems），只用 SIMILAR_NAME 邊連起來，絕對不合併成一個節點，避免把一間公司的數字錯誤地寫到另一間公司頭上。遇到被取代的事實（例如季度營收從 4.8B 改成 5.1B），舊值用軟性失效（expired_at）標記起來保留，不真的刪除，所以之後有人問「併購前的營收是多少」還是答得出來。這個設計的好處是：寫入時做錯的唯一代價是多一個之後可以再排除的節點（drift），而不是把資料不可逆地毀掉。

### 3. 讀取時走一個不靠 LLM 判斷的導航迴圈，只能收斂成四個受控終端動作之一

很多系統在讀取時只做一次 post-retrieval 的 LLM 判斷就直接回答，論文點名這是 P1「一次性解析」的問題——沒有來回驗證證據的迴圈。DISCERN 反過來，讀取時用一組不靠 LLM 判斷結果的工具（dense、lexical、graph、temporal 檢索都變成可呼叫的工具），在圖上一步步導航，靠 EarnedAnswerGate、EarnedAbstainGate、DeclineRouter 這幾道關卡，把每個查詢收斂成「回答」「更新」「澄清」「拒答」四個終端動作其中一個。這解決了論文點名的 P2「沒有終端狀態契約」問題——很多系統不管證據夠不夠都硬要回答，混進答案裡的錯誤完全被現有指標蓋掉。

```diagram
title: DISCERN：寫入保留、讀取才解析
desc: 寫入時只把觀察併入不可變事件記錄，各自長出不合併的實體圖與雙時態事實庫；讀取時用不靠 LLM 判斷的導航迴圈，把每個查詢收斂成回答、更新、澄清、拒答四個終端動作之一
caption: ENT-310 上，DISCERN 拒答 F1 達 0.924（八個基線最高 0.802），entity resolution 0.800（基線沒有一個超過 0.40）
---
<svg viewBox="0 0 640 420">
  <path class="dg-line" d="M320 100 V114 H174 V128" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 100 V114 H466 V128" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M174 200 V228" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M466 200 V228" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M102 292 V324" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M242 292 V324" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M382 292 V324" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M522 292 V324" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="40" y="36" width="560" height="64" rx="6"/>
  <text class="dg-label" x="320" y="59" text-anchor="middle" dominant-baseline="central">寫入時：Event Log</text>
  <text class="dg-sub" x="320" y="79" text-anchor="middle" dominant-baseline="central">per-actor、append-only、不可變</text>

  <rect class="dg-box" x="40" y="128" width="268" height="72" rx="6"/>
  <text class="dg-label" x="174" y="155" text-anchor="middle" dominant-baseline="central">實體圖</text>
  <text class="dg-sub" x="174" y="175" text-anchor="middle" dominant-baseline="central">連結不合併（SIMILAR_NAME）</text>

  <rect class="dg-box" x="332" y="128" width="268" height="72" rx="6"/>
  <text class="dg-label" x="466" y="155" text-anchor="middle" dominant-baseline="central">雙時態事實庫</text>
  <text class="dg-sub" x="466" y="175" text-anchor="middle" dominant-baseline="central">舊值保留、新值接續</text>

  <rect class="dg-box" x="40" y="228" width="560" height="64" rx="6"/>
  <text class="dg-label" x="320" y="251" text-anchor="middle" dominant-baseline="central">讀取時：zero-LLM 導航 loop</text>
  <text class="dg-sub" x="320" y="271" text-anchor="middle" dominant-baseline="central">沿著圖走訪，決定收斂到哪個終端動作</text>

  <rect class="dg-box" x="40" y="324" width="124" height="56" rx="6"/>
  <text class="dg-label" x="102" y="343" text-anchor="middle" dominant-baseline="central">回答</text>
  <text class="dg-sub" x="102" y="363" text-anchor="middle" dominant-baseline="central">證據齊全</text>

  <rect class="dg-box" x="180" y="324" width="124" height="56" rx="6"/>
  <text class="dg-label" x="242" y="343" text-anchor="middle" dominant-baseline="central">更新</text>
  <text class="dg-sub" x="242" y="363" text-anchor="middle" dominant-baseline="central">寫回新事實</text>

  <rect class="dg-box" x="320" y="324" width="124" height="56" rx="6"/>
  <text class="dg-label" x="382" y="343" text-anchor="middle" dominant-baseline="central">澄清</text>
  <text class="dg-sub" x="382" y="363" text-anchor="middle" dominant-baseline="central">指稱不明</text>

  <rect class="dg-box dg-box--accent" x="460" y="324" width="124" height="56" rx="6"/>
  <text class="dg-label" x="522" y="343" text-anchor="middle" dominant-baseline="central">拒答</text>
  <text class="dg-sub" x="522" y="363" text-anchor="middle" dominant-baseline="central">F1 0.924</text>
</svg>
```

### 4. 評估要拆成兩個獨立指標：答案對不對，跟「該拒答時有沒有拒答」當分類問題打分

DISCERN 的評估設計用四個 LLM 裁判，一軸打 answer correctness，另一軸把「該回答還是該拒答」當成 precision、recall、F1 的分類問題來評分，專門測有多少不該答的題目被硬答了。結果是 DISCERN 在拒答上的 F1 達 0.924，八個基線最高只有 0.802；而在 answer correctness 上領先的 0.861（基線最高 0.806）主要是 entity resolution 這個子項目（0.800，沒有一個基線超過 0.40）撐起來的。這個拆法給面試很好用的收尾論點：只看單一準確率沒辦法看出系統有沒有在亂猜，要把「證據是否被檢索到」「查到後答得對不對」「不確定時有沒有誠實拒答」拆成至少三個獨立維度分別驗收。

### 5. 不調參就搬到別的 benchmark 還是領先，證明不是在自家資料上 overfit

論文另外把同一套 pipeline 原封不動搬到 LoCoMo 這個完全獨立、沒有調過參的對話記憶 benchmark 上，一樣在 macro answer correctness 領先（0.663 比基線 0.638），在 false-premise 拒答上也維持在最佳校準的那一群。面試官很常用「你的方法是不是只在自己設計的 benchmark 上好看」這個問題來考察候選人有沒有想過 overfitting 的風險，這篇論文直接示範了怎麼用零調參的跨 benchmark 遷移來回答這個質疑。

## 今日練習題

### 題目

面試官給你看一份企業 sales agent 的記憶系統案例：系統裡有兩間客戶，一間叫「捷方科技」（年約報價 1,200 萬），另一間叫「捷方科技股份有限公司」（年約報價 450 萬，是另一個業務窗口上個月新開的客戶）。業務問 agent：「我們上次跟捷方談的年約金額是多少？」而資料庫裡捷方科技本身的報價三個月前也從 1,200 萬改成 1,050 萬。面試官問：「你會怎麼設計這套記憶系統，讓它正確分辨問的是哪一間捷方、哪個金額才是現行報價，以及證據不足時該不該誠實拒答？」

**來源**：改編自 DISCERN（arXiv:2611.15729，Chirag Ahuja 等 4 位作者，Amazon，2026-11-11 發布）裡 entity resolution 跟 bi-temporal fact store 的設計案例，模擬 paper-reading 面試常見的「給你一個名字相似、資料互相矛盾的記憶案例，討論怎麼重新設計系統」題型　**難度**：進階　**環節**：onsite system design / research discussion round

### 拆解思路

1. **先釐清問題**：先問清楚資料來源有沒有對「捷方科技」跟「捷方科技股份有限公司」做唯一 ID、每筆報價有沒有時間戳記，也要確認業務問的那句話本身有沒有額外線索（例如他只負責其中一間客戶）。
2. **建立框架**：借用 DISCERN「preserve at write, resolve at read」——寫入時遇到兩間名字相似的公司，絕對不合併，只用 SIMILAR_NAME 一類的邊連起來，保留「這兩個很像但是不同」的訊號；每筆報價金額都用 bi-temporal 邊記錄，舊報價軟性失效但留著，不直接覆寫。
3. **深入核心**：討論讀取時為什麼不能只做一次 LLM 判斷就回答——先走「實體解析」這一步，靠名字、歷史互動頻率等線索決定業務問的是哪一間捷方（如果真的分不清，就該收斂到「澄清」而不是硬選一個）；解析完實體之後再走「時效判斷」，找出這個實體名下最新、還沒被取代的那筆報價；如果兩步都做完還是模糊（例如兩間捷方的歷史互動次數差不多，問題本身也沒指名），系統該收斂到「拒答」或「澄清」，而不是隨便挑一個金額回答——這正是論文裡 entity resolution 分數拉開最大差距的地方。
4. **收尾**：提出驗收設計——用兩個獨立指標分別打分：答案在「選對實體、選對時效」的情況下對不對，跟「該澄清／拒答的案例裡有沒有誠實澄清／拒答」當分類問題來看 precision、recall、F1，而不是只看單一的整體準確率；同時強調這套邏輯要在完全不同的客戶資料集上重新測一次，才能說服面試官這不是只在特定資料上調出來的結果。

### 範例回答（面試時可以這樣講）

> **先確認指稱本身有沒有被解開。** 我不會讓系統直接去查「捷方」然後挑一筆報價回答。第一步是做實體解析：資料庫裡「捷方科技」跟「捷方科技股份有限公司」要用類似 SIMILAR_NAME 的邊連起來，標記成「名字很像但是兩個不同實體」，而不是合併成一個節點——合併的風險是把其中一間的報價錯誤地寫到另一間身上，而且一旦合併就很難再救回來。如果業務的問句跟歷史互動都沒有足夠線索分出是哪一間，我會讓系統收斂到「澄清」，直接問業務「你是指捷方科技，還是捷方科技股份有限公司？」，而不是賭一個答案。
>
> **解開實體之後，才處理時效問題。** 確定業務問的是「捷方科技」之後，我會用 bi-temporal 的方式記錄每一筆報價——三個月前的 1,200 萬用 valid-to 標記成已經被取代，但保留下來，不直接覆寫；新的 1,050 萬是開放的 valid-from 邊。回答時只取現行、沒被取代的那一筆，但同時保留「如果有人問改價前的報價」還是答得出來的能力。
>
> **把能不能回答當成獨立的判斷題。** 我不會假設系統永遠都答得出來。如果實體解析跟時效判斷兩步都走完，證據還是模糊——比如兩間捷方的歷史互動次數差不多、問句也沒有額外線索——我會讓它收斂到「拒答」或「澄清」，而不是硬答一個數字。驗收的時候我會分開看兩個指標：答案在實體跟時效都選對的情況下正確率多少，跟「該拒答／澄清時有沒有真的拒答／澄清」當分類問題算 precision、recall、F1，而不是只看一個籠統的整體準確率——這樣才能看出系統是真的解析清楚了，還是只是矇對答案。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 把易混淆的實體連結但不合併，而不是直接合併成一個節點 | |
| 用 bi-temporal 方式記錄報價，軟性失效舊值而不是直接覆寫 | |
| 區分「實體解析」跟「時效判斷」兩個獨立步驟 | |
| 證據不足時收斂到澄清／拒答，而不是硬答一個數字 | |
| 驗收時把「答案正確率」跟「該拒答時有沒有拒答」拆成兩個獨立指標 | |
| 加分：提到要在不同資料集上重新驗證，避免只在自家 benchmark 上調出來的結果 | |

## 延伸閱讀

- [MEMOIR 把 LLM agent 記憶的 evidence recall 拉高 11.92 個百分點 — AI Weekly](https://aiweekly.co/alerts/memoir-adds-1192pt-evidence-recall-to-llm-agent-memory) — 同期另一篇 agent memory 論文的報導，切入點是 training-free 的 evidence recall，適合對照 DISCERN「解析優先於檢索」的論點
- [AstroMemBench：用具身太空船 agent 測記憶系統的 benchmark — ArXivSignals](https://arxivsignals.io/papers/2611.16590) — 另一個同期的記憶系統 benchmark，發現 session 重啟後 Mem0 反而贏 RAG 12.25 分，補今天概念 1「檢索已經飽和，但不同情境下差距會變」的細節

## 參考資料

- [DISCERN: Preserve at Write, Resolve at Read for Persistent LLM-Agent Memory — arXiv:2611.15729](https://arxiv.org/abs/2611.15729) — 今日 Paper Reading 核心概念速記與練習題設計的原始論文，LLM-agent memory benchmark（ENT-310、LoCoMo）上的評測數據來源
- [DISCERN 論文全文（HTML）— arxiv.org/html/2611.15729v1](https://arxiv.org/html/2611.15729v1) — 寫入時的 bi-temporal provenance graph、讀取時四個終端動作與各道 gate 的架構細節，補概念 2、3 的設計細節
