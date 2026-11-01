---
title: "該單幹還是開會：多智慧體的分工、溝通與失敗｜Stanford CS329Z 第 8 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, compound-ai-systems]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 9
tldr: "Lecture 08 先問單一 agent 夠不夠，再比較 orchestrator、swarm、hybrid 三種編排，以及 handoff、留言板、A2A 協議與 task ledger、共享記憶、worktree 隔離等協調設施，最後追查多智慧體為什麼失敗。讀物從 AutoGen 讀到 MAST、單一 agent 反論與 DyLAN。"
description: "依實體頁碼帶讀 CS329Z Lecture 08 Multi-Agent Systems 投影片，再深讀 AutoGen、MAST 失敗分類、單一 agent 的反論與 DyLAN，並用兩個 agent 整理 email 的例子檢查分工。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-08-multi-agent-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

一個模型解不開的題目，直覺解法是多找幾個模型來分工：一個寫程式、一個跑程式、一個負責挑錯，就像開一場會。但開過會的人都知道，會議本身有成本。誰先發言、結論誰寫、錯了算誰的，一樣都少不了。模型開會也一樣，而且錯得更安靜：上游 agent 的幻覺，會變成下游 agent 深信不疑的事實。

第 8 堂（10/19，Multi-Agent Systems）的指定讀物是 Wu 等人的 [AutoGen](https://arxiv.org/abs/2308.08155)、Cemri 等人的 MAST 失敗分類，以及 Kim 等人的 agent 系統擴展研究。本文深讀 AutoGen 與 MAST，另讀單一 agent 的反論與 DyLAN。先備是[第 6 堂的迴圈](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns)與[第 7 堂的記憶分層](/posts/ai/2026-09-10-stanford-cs329z-lecture-07-memory)。以下先依 PDF 實體頁碼帶讀投影片，再接指定讀物的深入解說。本文的例子與自測題是教學練習，不是官方作業解答；重複動畫、課務與章節分隔頁合併說明。

## Lecture 08 投影片導讀：先設計分工，再追查失敗

<div class="slide-reader" data-slide-reader data-pages="92" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf">
<p>Lecture 08: 92 頁 PDF；點下方頁碼可對照原始教材。</p>
<button type="button" data-slide-open>開啟投影片對照</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf" target="_blank" rel="noopener noreferrer">原始 PDF</a></p>
</div>

### 第 1–15 頁：先判斷能不能拆，再決定要不要加 agent

<a href="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf#page=1" data-slide-page="1">投影片第 1–15 頁</a>

開場先把單一模型、workflow、agent 與 multi-agent system 放在同一條複雜度軸上。多 agent 可以平行處理獨立子任務，也能分離角色；代價是訊息、整合與錯誤傳播。讀比較圖時要問任務是否真的能拆，而不是只問哪個架構平均分數最高。本文 email 情境若只有一封信與一個簡單問題，先用單 agent 保留較短的證據路徑。

### 第 16–29 頁：四種編排，先追資訊往哪裡走

<a href="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf#page=16" data-slide-page="16">投影片第 16–29 頁</a>

Independent 讓各自完成後彙整；centralized 把分派與收斂交給中央；decentralized 允許同儕直接協作；hybrid 混合中央目標與局部溝通。DyLAN 的動態網路展示分工還能依中途結果調整。選擇應根據相依與成本：檢索不同來源可平行，最後措辭卻可能需要單一整合者。

### 第 30–49 頁：通訊：訊息內容與控制權一起看

<a href="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf#page=30" data-slide-page="30">投影片第 30–49 頁</a>

AutoGen 把角色透過對話接起來；handoff 把後續控制權交給接手者，agent-as-tool 則把有界工作做完後交回呼叫者。Message board 讓角色共享成果，A2A 介紹跨 agent 的能力描述與溝通。這些機制不會自動保證證據正確：摘要若丟掉原始信件的「可能」，傳輸再成功也仍是錯誤。

### 第 50–68 頁：協調：把承諾寫進狀態

<a href="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf#page=50" data-slide-page="50">投影片第 50–68 頁</a>

Task ledger 記目標、分工、進度與未解問題；shared memory 保存共同經驗；worktree 隔離編輯中的檔案。角色分工、資源切分與協商則處理彼此的相依。兩個 agent 能讀同一聊天室，仍可能同時改同一介面；要指定 owner 與交接契約，合併後再做整合驗證。

### 第 69–82 頁：失敗：一致意見不能取代外部驗證

<a href="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf#page=69" data-slide-page="69">投影片第 69–82 頁</a>

這段把失敗放在系統設計、agent 間互動與驗證等層面，也用協調困難、從眾與不相容目標說明「各自做對」未必等於整體成功。讀圖時先辨認資料集與實驗條件，不把單一研究結果延伸成所有 multi-agent 都不值得。實務檢查仍應回到原始工具輸出、共同介面與端到端結果。

### 第 83–92 頁：工程案例：自主工作需要可用的回饋

<a href="https://web.stanford.edu/class/cs329z/slides/lecture08.pdf#page=83" data-slide-page="83">投影片第 83–92 頁</a>

案例把專責角色、Git 上的任務狀態與 worktree 連起來。重點是測試、錯誤摘要、可搜尋紀錄與進度回報能否讓 agent 自己辨認下一步。測試若不反映真正任務，多個 agent 只會更有效率地達成錯誤目標。**理解檢查**：各分支測試通過就能合併發布嗎？**答案判準**：仍需共同環境中的整合測試與最終需求驗收。

## 從會聊天到能協作：Lecture 08 的三層設計

[Lecture 08](https://web.stanford.edu/class/cs329z/slides/lecture08.pdf)把設計拆成 orchestration、communication、coordination。第一層決定工作怎麼分；第二層決定資訊怎麼交換；第三層管理相依、承諾與共同資源。會傳訊息，只代表第二層存在。

| 編排方式 | 中途資訊怎麼走 | 適合試驗的條件 | 主要代價 |
|---|---|---|---|
| Independent | 各自完成，最後彙整 | 可獨立查證的來源或候選解 | 無法利用彼此中途發現 |
| Centralized | 由 orchestrator 派工、收回 | 需要單一整合者 | 中央可能塞車 |
| Decentralized | 同儕直接交換 | 大範圍探索、可自行領任務 | 承諾與衝突難追蹤 |
| Hybrid | 中央整合，同儕有限互通 | 有全域目標，也有局部相依 | 必須界定何時直接協調 |

Communication 還要分清 handoff 與 agent-as-tool。前者把後續控制權交給接手的 specialist；後者把有界問題交出去，拿回結果後由呼叫者繼續整合。這個差別決定誰負責最後的答案，不能只看呼叫了幾個模型。

協調需要可檢查的狀態。Task ledger 記目標、任務歸屬、相依、進度與阻塞；shared memory 保存跨任務經驗；worktree isolation 讓寫程式的 agent 各用自己的 checkout 與 branch。Worktree 只減少工作時互踩，合併後仍須解衝突、測共同結果，不能把「各自測過」當成整合成功。

**理解檢查**：兩個 agent 都能讀同一個聊天室，卻各自改了同一個介面，為什麼仍會整合失敗？**答案判準**：指出聊天解決資訊通道，沒有自動解決資源歸屬與介面承諾；要補 task ledger 的 owner、共同介面約定、隔離工作區與整合驗證。

講義把失敗分成設計、agent 間、驗證等問題，也提醒從眾和目標不相容：所有 agent 同意，不代表證據更強；各自達標，也不代表整體目標一致。因此 reviewer 應回到原始工具輸出與測試，而不是只替上一個 agent 的摘要背書。

## 本文教學例子：兩個 agent 整理 email

以下是本文自擬例子，數字是示範資料，並非官方作業結果。任務是回答「哪幾封信支持本週要延期交付？」原始信件必須可追溯，否則答案不算成功。檢索 agent 找信，整理 agent 寫答案；前者交出的摘要若把「可能延期」寫成「已決定延期」，下游再流暢也只是放大錯誤。

先設交接契約：每項結論附 email ID、原句與不確定性；task ledger 記誰已完成檢索、是否還缺反例。整理者不得把候選結論升格為已確認事項；最後依原始信件驗證引用與措辭。

```diagram
title: 讓證據穿過交接仍不變形
desc: 檢索把原始證據與不確定性交給整理者，最後驗證回到原信。
caption: 本文教學例子；箭頭表示交接資料的方向。
---
<svg viewBox="0 0 440 440">
<path class="dg-line" d="M220 88V128" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 200V240" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 312V352" marker-end="url(#arrow)"/>
<rect class="dg-box" x="40" y="16" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="52" text-anchor="middle" dominant-baseline="central">檢索 agent：回到原始信件</text>
<rect class="dg-box dg-box--accent" x="40" y="128" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="164" text-anchor="middle" dominant-baseline="central">交接契約：ID、原句、不確定性</text>
<rect class="dg-box" x="40" y="240" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="276" text-anchor="middle" dominant-baseline="central">整理 agent：保留證據邊界</text>
<rect class="dg-box" x="40" y="352" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="388" text-anchor="middle" dominant-baseline="central">驗證：逐項對照原始信件</text>
</svg>
```

假設凍結系統在保留的二十題只答對十二題。另用開發集檢查失敗，發現多數錯在交接摘要丟失不確定性，因此先改交接 prompt，加入一個成功示範。再跑同一保留集得到十六題成功：成功率由 60% 到 80%，增加二十個百分點。這是這份示範資料上的對照結果；小樣本不足以保證未來有相同提升。若題目已被拿來反覆選版本，就另留一批沒看過的題目做最後驗收。

下一步要看成本與失敗軌跡。假如剩下的錯都是搜尋工具沒回傳正確信件，加一個 reviewer 無法憑空補出證據；應先檢查查詢與索引。如果有正確候選、卻挑錯答案，才試更多候選加 verifier。是否拆 agent、改 prompt 或訓練權重，都要對著同一個瓶頸做對照。

**綜合理解檢查**：拆成三個 agent 後，每個都回報成功，整體仍錯；你會先增加 agent，還是改哪一個檢查？**答案判準**：先用原始 email 對照端到端輸出，找資訊在哪次交接變形；檢查 ledger、交接契約與 evaluator。只有確認可分工的瓶頸，且對照顯示收益大於協調成本，才擴編。單一失敗結果無法直接判定需要微調。

## 讀物 1｜AutoGen

原文：[AutoGen](https://arxiv.org/abs/2308.08155)

### TL;DR

Conversable agents 統一收發訊息與回覆；conversation programming 同時定義計算與控制流程，並允許人類或工具加入。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 多角色如何交換回饋，而不用為每個應用重寫控制器？ |
| 證據與邊界 | 這是論文版本的框架設計；ALFWorld 的結果限於該環境與模型，不能推成多 agent 普遍勝出。 |

### 領域背景

多角色應用的難點包含誰接手、誰執行工具與何時終止；角色名稱本身不會建立這些規則。

### 中階導讀

**方法。** 先定義角色能用的模型、人類與工具能力，再註冊回覆行為；流程由訊息與終止條件推進。

AutoGen 的核心抽象有兩個，[開源實作](https://github.com/microsoft/autogen)可以直接玩。第一是 conversable agent：每個 agent 都能收訊息、做事、回訊息，後端可以是 LLM、人、工具或混搭。內建最常用的兩個是 AssistantAgent（LLM 主力，負責想和寫）與 UserProxyAgent（人或工具的代理，負責跑 code、回傳結果、必要時找人）。

第二是 conversation programming：複雜流程不寫成管線，寫成 agent 之間的對話。計算（收到訊息後做什麼）與流程控制（訊息傳給誰、何時停）都繞著對話轉。機制是統一的 send/receive 加上 generate_reply，再配 auto-reply：收到訊息就自動回，除非觸發終止條件。

控制手段有兩種，程式和自然語言混用。自然語言控制寫在 system message 裡，例如叫 agent 修好錯誤再交、做完回 TERMINATE。程式控制寫在 Python 裡，例如最大回覆輪數與工具執行邏輯。兩種可以互轉：在 code 裡呼叫一次 LLM 就是切到自然語言，LLM 吐一個 function call 就是切回程式。

幾個應用裡最好記的是 [ALFWorld](https://arxiv.org/abs/2010.03768) 那個：雙 agent 卡在重複錯誤迴圈時，多掛一個專門補常識的 grounding agent，成功率平均漲 15%。分工的價值不在人多，在有人專門負責大家都忽略的那件事。

**怎麼做**：先別拆。拿 HW1 的 email 助理跑 20 題，把失敗分成兩堆：單一步驟錯、後面跟著全錯。只有當同一條分工邊界反覆出現（例如寫 code 和驗 code 老是互相污染），才把那條邊切成第二個 agent。切分要有失敗證據，不要為組織圖好看而切。

這堂的標題直接點名：coordination and error propagation。多體架構的帳單有三張。第一張是狀態交接：agent 之間傳的不只是答案，還有做到哪、為什麼這樣做。傳丟了，下游就重蹈覆轍。

第二張是錯誤放大：沒人檢查的管線，每多一站就多一次把幻覺當事實的機會。AutoGen 把原本解供應鏈問答的 [OptiGuide](https://arxiv.org/abs/2307.03875)重寫成多智慧體：Commander 協調 Writer 與 Safeguard，寫 code 和驗 code 分家，正是為了讓檢查獨立於生產。自己驗自己寫的東西，人跟模型都做不好。

第三張是流程本身：誰決定下一個發言者。AutoGen 內建 GroupChatManager，用角色扮演式 prompt 動態選下一個講者，再廣播給全員，適合沒有固定順序的協作。代價是除錯時得先還原當時為什麼輪到他。人類介入也是成本設計：UserProxyAgent 的 human_input_mode 可以調成每輪都問，也可以讓人跳過。自動化與人類控制的平衡，論文討論章節明說是開放問題。

**怎麼做**：HW1 不准用框架，AutoGen 的規矩要自己寫進迴圈：TERMINATE 終止條件、最大輪數、一個只檢查不做事的角色（抄 Safeguard）。檢查者判定沒把握時就停下來問人，這正好是 HW1 要求的 human in the loop。拿 10 題難題跑一次，記下檢查者攔下幾次、誤攔幾次、轉給人幾次。這張攔截紀錄就是報告裡協調成本的現成素材。

**證據與結果。** 論文用六種應用展示相同對話抽象可承載不同協作流程；這是可組裝性與受測任務表現的證據。

### 深入要點

- 自然語言控制能決定角色應怎麼回，但最大輪數、執行器與停止判斷仍可由程式固定。
- GroupChatManager 選下一位講者，不會自動決定資料是否充分或答案是否正確。

### Reviewer 一句話評

它把協作變成可程式化的對話，但協作收益仍要實測。

### 給你的 take-away

先寫兩個角色的交接欄位與停止條件，再用原始工具輸出驗證每次交接。

## 讀物 2｜MAST: Why Multi-Agent Systems Fail

原文：[MAST: Why Multi-Agent Systems Fail](https://arxiv.org/abs/2503.13657)

### TL;DR

MAST-Data 蒐集七種框架超過 1600 條標註軌跡，從系統設計、agent 對齊與驗證等面向分類。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 多 agent 的失敗，能否被整理成可定位的類別？ |
| 證據與邊界 | 分類描述觀察到的失敗，不是某種架構在所有任務上的因果排名。 |

### 領域背景

多 agent 出錯時，單看最後答案很難分辨是任務設計、資訊交接還是驗證失效。

### 中階導讀

**方法。** 先人工分析軌跡建立分類，再以標註流程擴到較多框架與任務。

**證據與結果。** 研究形成含多種失敗類別的分類法，讓相似表面錯誤能依責任層重新整理。

### 深入要點

- 一條軌跡可能有多個失敗點，最早發生的不一定是最終判分指出的那一步。
- LLM協助標註能擴大覆蓋，但分類可靠性仍需要人工檢查與定義一致。

### Reviewer 一句話評

失敗分類能幫你縮小調查範圍，不能代替重播證據。

### 給你的 take-away

把自己的失敗 trace 標成設計、交接或驗證問題，再選一類先修。

## 讀物 3｜Do Not Sleep on Single-Agent Systems

原文：[Do Not Sleep on Single-Agent Systems](https://openhands.dev/blog/dont-sleep-on-single-agent-systems)

### TL;DR

作者以 OpenHands 經驗主張先建立有通用工具與足夠 context 的單 agent 基線，再判斷拆分的必要。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 多角色是否只是把單 agent 已能做的工作變得難維護？ |
| 證據與邊界 | 這是工程經驗與設計立場，不是涵蓋所有工作負載的受控實驗。 |

### 領域背景

拆分角色會引入新的訊息與狀態邊界；若工作高度相依，這些邊界可能比原問題更難管理。

### 中階導讀

**方法。** 先讓一個角色取得通用工具與足夠觀察，再檢查是否有可獨立且反覆出現的子任務瓶頸。

**證據與結果。** 文章提供先測單agent的設計理由，沒有宣稱用同一組完整受控實驗證明單體總是較強。

### 深入要點

- 跨agent摘要是資訊壓縮，省下context同時可能丟掉原始依據。
- 固定角色管線可能限制臨時需要的探索順序，通用工具則把部分選擇留給同一個決策者。

### Reviewer 一句話評

先有強單體基線，才知道團隊增加了什麼。

### 給你的 take-away

保留一份單 agent 對照版，以同一題集量協調收益與額外成本。

## 讀物 4｜DyLAN

原文：[DyLAN](https://arxiv.org/abs/2310.02170)

### TL;DR

DyLAN 先挑選團隊，再讓角色以動態網路互動，避免每題固定同樣的成員與輪數。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 團隊裡誰該參與，本身是否能成為可調整變數？ |
| 證據與邊界 | 作者在特定 MMLU 科目報告最高 25% 的 accuracy 改善；保留科目、模型與基線條件，不當成全域分數。 |

### 領域背景

固定團隊會讓每題都付出相同角色與輪數成本，卻不保證每個成員都提供新資訊。

### 中階導讀

**方法。** 先以任務表現估計成員組合，再依中途訊息調整參與，最後由留下的網路產生答案。

**證據與結果。** 實驗支持團隊選擇對部分科目有實質影響，說明「誰參與」不必視為固定設定。

### 深入要點

- 動態網路需要判斷貢獻與停止；否則刪掉角色可能一起刪掉晚一點才出現的有效資訊。
- 選角與通訊拓樸是不同設計變數，應分開做對照。

### Reviewer 一句話評

選誰參與可以優化，收益仍取決於題型。

### 給你的 take-away

比較固定團隊與動態選角，記錄哪些角色在何種題目提供有效資訊。

## 它在課程裡的位置

第 8 堂決定要不要分工，[第 9 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-09-optimization)接著問：不管單幹還是開會，力氣該花在改 prompt、改權重還是加推理算力。HW1 在 10/30 截止，這是交卷前最後一個完整週。

## 本堂 Course Material 對照

- 官方投影片（PDF）：[Multi-Agent Systems — Lecture 08](https://web.stanford.edu/class/cs329z/slides/lecture08.pdf)
- 指定閱讀：Wu 等人〈AutoGen〉（本文深讀）、Cemri 等人〈Why Do Multi-Agent LLM Systems Fail?〉（本文深讀）、Kim 等人〈Towards a Science of Scaling Agent Systems〉
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

官方 Logistics 頁（2026-10-10 即時讀取）的 Lecture Recordings 一節寫明：講課錄影只能登入課程 Canvas 取得。我實際開啟課程 Canvas 入口（canvas.stanford.edu/courses/233286），被導向 Stanford 登入頁，確認有登入牆。課程官網與搜尋都沒有找到公開的 YouTube 或 OCW 錄影，所以沒有可嵌入的影片。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 8（10/19 週一）的內容，原屬「第 5 週：該單幹還是開會」導讀；以下保留拆分前的紀錄。
- 2026-10-23：依 Lecture 08–09 補入協調、worktree、權重優化與依評估選策略，新增完整教學例子、圖解與理解檢查。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-29：HW1 改版（不再分 Part A／Part B、語料換成企業 email、改成不用框架的完整 harness），改寫「HW1 收尾」的十天計畫與各節「怎麼做」裡的作業對應
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 7 堂：Agent Memory Architectures](/posts/ai/2026-09-10-stanford-cs329z-lecture-07-memory)、[第 9 堂：Optimization](/posts/ai/2026-09-10-stanford-cs329z-lecture-09-optimization)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 講義：[Lecture 08: Multi-Agent Systems](https://web.stanford.edu/class/cs329z/slides/lecture08.pdf)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Wu et al., AutoGen, COLM 2024](https://arxiv.org/abs/2308.08155)
- 工具：[AutoGen](https://github.com/microsoft/autogen)
