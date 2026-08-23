---
title: "Stanford CS224V 第 3 講：用 Genie Worksheets 建立不亂編動作的任務型 Agent"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, task-oriented-dialogue, semantic-parsing, genie]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 4
tldr: "Genie Worksheets 把任務能力宣告成表單式規格，讓 contextual semantic parser 只更新形式對話狀態；查詢、動作與回應由 runtime 依規格執行。"
description: "逐段拆解 CS224V Building a Task-Oriented Agent：對話狀態、Worksheet 語言、semantic parser、runtime、組合與評估。"
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224v-task-oriented-agent-en)

本文依據[官方 Fall 2025 講義](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf)重建本講；下文的系統設計與講義所報結果，除非在主張處另連原論文，均歸屬這份歷史課程材料。

第三講處理一個很實際的風險：叫車、選課或訂位 agent 不能憑語感補出不存在的選項，也不能執行規格外動作。Genie Worksheets 的做法是把任務能力寫成可檢查的宣告式規格，讓 LLM 處理語言理解，卻不讓它自由決定系統能做什麼。

## Agenda：從對話狀態到完整 runtime

講義先比較有限狀態機、intent／slot 架構與 LLM agent，再建立 formal dialogue state。中段說明 Genie Worksheet 的設計理由與語法：task worksheet、knowledge-base worksheet、欄位、確認與動作。後段才進 contextual semantic parser、runtime、worksheet 組合，以及離線與真人評估。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

## Worksheet 是規格，不是 prompt 範本

Worksheet 看起來像網站表單：欄位記錄完成任務需要的資訊，欄位可有型別、選項與依賴關係。不同之處是使用者不必照欄位順序說話；semantic parser 讀取目前對話狀態、上一輪 agent acts、worksheet 規格與新 utterance，輸出「要套用到狀態的變更」。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

這個切割讓 runtime 保有控制權。資料庫查詢由 knowledge-base worksheet 定義，外部動作只能從規格宣告的集合選，回應則依目前缺少或已確認的欄位產生。模型可以理解「我改搭星期五下午的班」，但不能因此創造一門不存在的課。

## 正式對話狀態壓縮歷史

一般 agent 把整段聊天塞回 context，期待模型自己找出目前條件。Worksheet 把有效資訊壓成 typed state：哪個值由使用者提出、哪個值待確認、哪個查詢已完成。這同時服務兩件事：降低長對話的歧義，也讓評估可以逐 turn 檢查狀態是否正確。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

Worksheet 還能組合。某個 worksheet 的結果可以成為另一個 worksheet 的欄位，因而建立「先找課程，再加入修課計畫」之類的流程。組合仍受規格約束，而不是把所有工具交給 planner 臨場決定。

## 傳統 task agent 的三個層次

講義在介紹 Worksheet 前先畫出典型架構：utterance history 進 semantic parser，parser 產生可供 dialogue manager 使用的表示；dialogue state tracker 更新使用者目前需求；policy 決定下一個 agent act，最後 response generator 把 act 寫成自然語言。這幾層若全部塞進一次 LLM call，就很難知道是理解錯、記錯狀態，還是選錯動作。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

最早的有限狀態機直接把流程寫成節點與邊。它的好處是確定性強，適合步驟固定、分支少的任務；代價是使用者跳著提供資訊、改口或一次說多個條件時，開發者要補大量 transitions。Intent/slot 系統把語言彈性提高，仍通常需要手寫 dialogue acts 與 policy。

LLM function calling 再把 parser 與 policy 變得彈性，但也可能生成不存在的參數值、跳過確認或選用不允許的 function。Genie Worksheets 並不是否定前面架構，而是重新切 responsibility：LLM 專注把話語轉成 state changes，task specification 與 runtime 保留可控部分。

## Formal dialogue state 包含的不只是 slot values

講義用 belief state 說明使用者對任務的目前需求，但 Worksheet state 還要表示 partial information、確認狀態與多個 worksheet instances。以選課為例，使用者可能先說「我想找 NLP 課」，系統查到多門候選；接著說「第二門，但不要星期五」。這不是單一 `course=NLP` slot，而是查詢結果、選取對象與新增限制共同形成的狀態。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

狀態還要區分使用者直接說的值、資料庫回傳的值與系統推導值。若全都只存成文字摘要，後面模型可能把候選名稱當成已確認選擇。Typed fields 與 worksheet instances 讓 runtime 知道哪些值能觸發 action、哪些仍要 clarification。

Formal dialogue history 也不同於 transcript。Transcript 保留原句，適合回看語氣與指涉；formal history 保存每輪對 state 做了什麼。兩者可同時存在，但 executor 應依正式狀態做決定，而不是每次重新從全部文字猜一次。

## Genie Worksheet 的語言設計

Task Worksheet 描述完成任務所需欄位與 action，類似一張可由對話填寫的表單。Knowledge Base Worksheet 則描述可查詢的 entity 或 records，讓使用者自然語言條件能轉成資料查詢。講義把兩者分開，因為「找到符合條件的課」與「正式把課加入計畫」有不同權限與失敗模式。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

欄位可以有型別、允許值、required/optional、依賴與確認要求。型別讓 parser 不能把任意文字放進日期或 entity 欄；依賴讓某欄只有在前置資訊齊全時才出現；確認則避免高影響 action 在使用者尚未同意時執行。這些規則是 executable specification，不只是給模型閱讀的說明。

Data-dependent worksheet/field 尤其重要。可選課程或可叫車地點來自資料庫，不能全寫死在 prompt。Runtime 先執行查詢，把合法 results 放回 state，後續 parser 才能處理「第一個」「比較便宜的那個」等指涉。這把 knowledge grounding 內建到 dialogue protocol。

## Contextual semantic parser 的輸入與輸出

Parser 不能只看當前 utterance。講義列出的 context 包含 formal dialogue history、目前 Worksheet specification、partial worksheet state 與先前 agent acts。使用者說「改成星期二」時，parser 要知道是在改出發時間、課程時段還是會議日期；這個消歧依賴 formal context。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

輸出也不是最終 response，而是 updates to Worksheets。理想上每個 update 都能做 schema validation：欄位是否存在、型別是否正確、entity 是否來自合法 query result、是否嘗試修改不可寫欄位。Validation 失敗時，runtime 可以要求澄清或重新 parse，而不是讓錯誤一路進 action。

講義的架構還把 previous agent acts 納入輸入。這能理解簡短回答「對」「不是那個」「都可以」，因為它們的意義取決於 agent 剛問什麼。若只把這些詞獨立分類，幾乎沒有資訊；放在 structured interaction 中，它們會成為精確的 confirm/reject/update。

## Runtime 如何從 state 走到 response

Parser 更新 state 後，runtime 根據 Worksheet 判斷下一步。Required field 未填就詢問；knowledge query 條件足夠就執行；有多個候選就要求選擇；高影響 action 已填滿但未確認就先確認；全部通過才執行 action。這是一個規格驅動的 policy，不需要 LLM 自由規劃每一步。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

Response generation 仍可由 LLM 讓語句自然，但內容受 agent acts 與 state 約束。若 query 無結果，response 應表達空集合並引導修改條件，不能生成「也許有一門」；若 action 失敗，應保留 state 並說明失敗，而不是假稱完成。可靠性來自 runtime 對事實與動作的所有權。

Worksheet composition 讓複雜任務由小能力組合。例如 `CourseToTake` 可以引用 `Course` knowledge worksheet 的 instance；ride request 可引用 location search 的 result。每個子 worksheet 維持自己的 schema，composition 以 typed reference 連接，比把子任務結果改寫成一段文字再傳下去更可檢查。

## Wizard 與 missing capability 問題

講義末尾提到 GenieWorksheet Wizard，因為手寫規格最大的風險是漏能力。開發者可能只想到 happy path，真實使用者卻會要求取消、比較、批次修改或例外條件。Wizard 的研究方向是從真實對話發現現有 worksheet 無法表示的需求，再協助補全 specification。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

這件事不能讓模型直接自動加 action。Missing capability discovery 與 capability authorization 必須分開：對話可以提供「使用者需要取消」的證據，但是否允許取消、需要什麼確認、後端 API 是否安全，仍由開發者決定。否則從對話學習會悄悄擴大 agent 權限。

Evaluation 也因此要包含 out-of-spec requests。可靠 agent 不一定要完成所有要求；能辨認「規格沒有這個能力」並清楚拒絕，比 hallucinate 一個成功結果更好。這是 Worksheet 設計相對自由工具 agent 最重要的產品行為之一。

## 從 lecture 到可部署原型的步驟

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

先選一個有明確 backend 的窄任務，列 knowledge operations 與 effectful actions。把前者做成只讀 Worksheet，後者逐一加 required fields、confirmation 與 idempotency key。接著寫 canonical conversations：順序填值、一次給多值、改口、指涉前一結果、空查詢、API failure 與未支援要求。

每輪測試保存四樣：輸入話語、pre-state、expected state diff、allowed next acts。Response wording 可以有多種正確答案，因此不要讓字串比較取代 state/action assertions。正式 action 另測「執行零次或一次」，避免重試造成重複訂位。

上線後收集的不是只有 thumbs up/down，而是 parser validation errors、clarification 次數、empty query、rejected capability 與 action failures。這些訊號分別指向 schema、語言理解、資料品質或後端，不應全部拿去微調 prompt。

## 這套設計的代價

Worksheet 不是零成本抽象。每個 domain 都要定義 fields、relations、queries、actions 與 confirmation，backend schema 改變時規格也要跟著更新。若任務本來高度開放、沒有明確完成條件，強行塞進表格式 state 可能失去使用者真正想做的事。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

因此適用邊界是「知識密集但能力可枚舉」：課程查詢、叫車、預約與申請流程都符合；開放研究或創意討論則更接近 STORM／Co-STORM。這不是哪種 agent 比較先進，而是 formal state 能否忠實表示任務。規格寫不出的部分應明確交還對話或人，而不是藏在自由文字欄位裡。

## 規格 review 應該逐欄問什麼

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

每個 field 都要回答來源、型別、誰能修改、何時確認、失效條件與是否含敏感資料。每個 action 則要回答前置狀態、權限、冪等性、失敗後 state、取消方式與 audit log。這些問題不在自然語言 demo 裡顯眼，卻決定系統能不能從一次成功對話走到真實服務。

最後拿規格跟 backend 對照。Worksheet 宣告的 enum 若比 API 舊，parser 再準也會產生無效要求；API 新增高權限 action 時，也不能自動暴露給 agent。Specification 是前後端之間的安全契約，版本與 migration 應像其他介面一樣管理。

## 評估在測什麼

講義區分 semantic parsing accuracy、dialogue-state correctness、任務完成與真人使用結果。它也提醒，傳統 slot-filling dataset 太簡單，不足以代表知識密集任務；真正的對照必須讓其他架構取得相同知識查詢能力，才知道差異來自狀態與 policy，而不是資料存取權。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf))

## 可以怎麼做

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

先不用寫 agent。挑一個「預約會議室」任務，列出 worksheet 的 typed fields、需要確認的欄位、唯一允許的外部 action，以及三段會改口的使用者對話。若某一步無法表示成 state update，規格還沒完整。

## 材料缺口

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

公開投影片沒有課堂 demo 錄影，部分語法頁也不是完整語言規格；本文不把投影片片段當成可直接執行的 API 文件。Autumn 2026 新課綱沒有用來補這堂 Fall 2025 內容。

## 參考資料

- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 3: Building a Task-Oriented Agent](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf)
- [Homework 2](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW2.pdf)
- [Lecture 4: Evaluation of Task-Oriented Agents](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
