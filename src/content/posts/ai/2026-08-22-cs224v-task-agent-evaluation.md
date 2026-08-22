---
title: "Stanford CS224V 第 4 講：任務型 Agent 評估不能只看回答像不像人"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, agent-evaluation, task-oriented-dialogue, genie]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 5
tldr: "CS224V 把任務型 agent 評估拆成狀態更新與完整互動：先測 semantic parser，再讓真人檢查任務完成、知識查詢與動作是否可靠。"
description: "CS224V Evaluation of Task-Oriented Agents：架構比較、Worksheet 與狀態機差異、兩段式評估、STARv2 與真人測試。"
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224v-task-agent-evaluation-en)

本文依據[官方 Fall 2025 講義](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf)重建本講；下文的系統設計與講義所報結果，除非在主張處另連原論文，均歸屬這份歷史課程材料。

第四講不是第三講的結果頁，而是在問「可靠」要怎麼量。回答自然、意圖分類正確，都不等於 agent 完成了任務；同樣地，一次成功也看不出系統是在遵守知識查詢結果，還是剛好猜對。

## Agenda：先釐清架構，再設計測試

講義先重訪三種架構：把整段流程寫死的 dialogue state machine、用 intents／dialogue acts 控制轉移的系統，以及 Genie Worksheets。接著逐項比較 Worksheet 的彈性、資料相依欄位與形式狀態，最後進入兩段式評估、STARv2、真人互動，以及 Homework 2。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

## Worksheet 與狀態機差在哪

狀態機把允許的對話路徑列成節點與邊；遇到改口、跨欄位提供資訊或資料查詢結果改變後續選項時，路徑數會快速增加。Worksheet 固定的是欄位、型別、依賴與動作，順序交給 parser 依語句更新。因此它不是沒有 policy，而是把 policy 從句子順序改成資料與能力約束。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

這個差異也決定測試單位。狀態機常測 intent 或下一個 node；Worksheet 可以直接比較每一輪的 partial worksheet 與正確 state update。

## 兩段式評估

第一段隔離 semantic parser：給定相同的 worksheet、歷史與使用者輸入，檢查欄位更新是否正確。STARv2 提供離線對話資料，但講義指出，簡單 slot filling 對現代 LLM 可能太容易，因此高分不能直接證明真實任務可靠。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

第二段是 end-to-end 真人互動。這裡要同時觀察任務是否完成、回應是否合宜、知識庫結果有沒有被忠實使用，以及動作有沒有越界。對照架構必須取得同一個 KB parser，否則比較的是「有沒有工具」，不是架構。

講義的真人測試案例也揭露另一種失敗：模型能拿到課程查詢結果，仍可能提到不存在的課。這正是形式狀態與 runtime 約束要攔的錯，不是靠更自然的語句評分能發現。

## 先比較架構，才知道該量什麼

講義再次畫出 dialogue state machine、dialogue acts 與 Genie Worksheet，不是重複上一堂，而是說明 metric 必須依 architecture 定義。狀態機把路徑寫死，常見測試是目前 node、辨識出的 intent 與合法 transition；Worksheet 固定欄位、型別與 dependency，測試則應落在 partial state、state diff 與 runtime actions。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

若拿 intent accuracy 比較兩者，Worksheet 的關鍵優勢會消失，因為它不一定把每句話壓成單一 intent。使用者一句「我想找星期二的 NLP 課，第二門如果滿了就看線上的」同時包含 query constraints、selection preference 與 fallback。評估要檢查這些是否正確進入 state，而不是只問分類 label。

反過來，也不能只因 Worksheet state 結構漂亮就宣稱 task 成功。Backend query 是否回傳正確 records、agent 是否要求必要確認、真正 action 是否執行，仍要 end-to-end 測。Lecture 的兩段式設計正是避免 component score 與使用結果互相代替。

## Genie Worksheet 與 state machine 的公平比較

狀態機在固定流程可能更可靠、延遲更低，也容易窮舉所有路徑；Worksheet 的價值出現在資訊順序彈性、data-dependent fields 與自然改口。比較 dataset 若只有簡單 slot filling，就會偏向「大家都已經會的」問題，量不到架構差異。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

講義以 Worksheet 對照 state machine 時，重點包括：開發者是否要手寫大量 paths、使用者是否能一次提供多欄、資料庫結果能否動態成為候選，以及狀態能否被 downstream action 直接使用。這些是 design claims，必須各自對應 scenario，而不是塞進一個平均分。

對 LLM function-calling baseline 也要控制工具權限。若 Worksheet 有 KB parser，baseline 卻只能看 prompt 內幾個例子，結果差異可能只是資料存取。講義真人評估讓 baseline 使用相同 KB parser，就是要把「grounding 能力」固定，集中比較狀態表示與 policy。

## STARv2 能測 parser，卻不是完整世界

STARv2 提供 task-oriented dialogues 與可檢查 annotations，適合把每一輪 parser output 對到預期 state。離線 dataset 可重跑、便於模型或 prompt regression，也能計算不同 domain 的錯誤。但講義指出其中很多 turns 是簡單 slot fills，現代 LLM 可能不用很強的 architecture 就拿高分。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

靜態對話還缺少互動效應。Agent 問錯澄清問題，使用者下一句就會不同；離線 replay 卻固定下一句，無法反映錯誤如何累積。資料庫內容也可能更新，原本合法的 course 或 ride option 後來消失。因此 STARv2 應當是 parser unit test，不是 deployment certification。

較好的使用方式是把 dataset 拆成現象：跨 turn 指涉、否定、改口、多值、未提供 required field、無效 entity 與確認。每類分別報 accuracy，才能知道新模型提升平均分時是否犧牲某個高風險現象。

## 兩段式 evaluation 的第一段怎麼做

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

第一段固定 Worksheet、pre-state、previous agent acts 與 user utterance，要求 parser 產生 updates。測試不只比較序列字串，而是 parse 後的 canonical state diff：欄位名稱、typed value、operation（新增、修改、清除）與 instance reference。

對部分正確要小心。一句話改兩個欄位，模型只改一個，若用 turn-level exact match 是全錯；若只用 field accuracy 又可能掩蓋兩欄必須一起更新才能安全 action。可以同時報 field-level 診斷與 turn-level all-correct，前者用來 debug，後者接近 runtime 是否能繼續。

還要測 invalid updates。模型寫入不存在欄位、把任意名稱當合法 course、或未確認就標記 action ready，都應由 validator 拒絕。Parser evaluation 因此包含「產生對」與「錯誤不穿透」兩面；只計正確答案召回會漏掉安全性。

## 第二段真人測試看完整任務

真人 evaluation 的基本單位是 session。除了 task completion，還要記錄 turns、clarification、repair、使用者是否放棄、query 是否忠於 state、effectful action 是否正確。講義表格將不同面向分列，因為一個 agent 可能語意剖析好，卻回應慢或讓使用者一直重複。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

Knowledge-intensive task 尤其要查 hallucination。Baseline 已取得正確課程 records，response generator 仍可能提到清單外項目；若只問使用者「對話自然嗎」，錯誤不一定被發現。Evaluator 要把每個 entity mention 對回 KB result，並檢查 action arguments 是否來自 confirmed state。

真人測試也需要 failure recovery。使用者提供無結果條件時，好的 agent 應清楚說明並邀請放寬某個限制；backend timeout 時不能假裝沒有資料；parser 不確定時應問針對性問題。完成率相同的兩個 agent，若其中一個靠猜，可靠性完全不同。

## 指標要沿著 causal chain 排列

可以把一次任務的 causal chain 寫成：utterance → state update → query/action decision → backend result → response grounding → user outcome。每一箭頭都有觀測值。若 user outcome 下降，先看上游哪一層開始偏離，而不是直接改最後一句 prompt。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

Semantic parsing metrics 對準第一箭頭；state consistency 看跨 turn 累積；query execution 看資料存取；action validity 看權限與確認；grounding 看 response 是否只使用 state/result；task success 與 satisfaction 才是最末端。末端指標重要，但不能替代上游 diagnosis。

這種排列也能處理 tradeoff。例如增加 clarification 可能讓 turns 變多，卻降低錯誤 action；若只追求短對話會錯誤懲罰安全行為。應依任務成本先定義 unacceptable failure，再看效率，而不是把所有數字平均。

## 建一套 regression harness

**本文建議：** 從二十段 canonical conversations 開始，每段保存 Worksheet、initial state、逐 turn expected diff、allowed agent acts 與 mock backend result。測試 runner 在每輪驗 parser update、validator result 與 runtime decision；response 只驗必要 facts、禁止 mentions 與 action confirmation，不鎖死措辭。

再建立 adversarial variants：欄位換順序、同義詞、否定、一次改兩次、引用「上一個」、插入無關句與要求未宣告功能。每個 production incident 回填最小重現對話，標記 root layer。這樣換 LLM、改 prompt 或 schema 時，回歸測試能指出能力漂移。

最後安排小型真人 study，讓受試者完成相同 goals，但可以自由措辭。保存匿名化 trace 與人工判定，不只收滿意度。離線 harness 提供可重複性，真人 study 提供 distribution；兩者共同構成 lecture 所說的 meaningful evaluation。

## 報告結果時不要藏掉 denominator

完成率必須同時說明任務數、失敗類型與是否排除中斷 session；hallucination rate 要說是按 response、entity mention 還是 claim 計算。不同 denominator 會讓同一系統看起來完全不同。講義把真人表格與 parser metrics 分開，正是避免用一個百分比代表全部可靠性。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

也要報未完成但安全停止的案例。Backend 沒資料時拒絕與模型有資料卻答錯，都算「未完成」，風險卻不同。至少把 success、safe failure、unsafe failure 三類分開，才能看出 architecture 是否真的把錯誤限制在可接受邊界。

## 模型更新後的驗收順序

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

先跑 parser/state regression，因為它便宜且能快速定位；再跑 mock backend 的 runtime tests，確認 action policy 沒漂移；最後才做少量真人 session。若第一層已出現 invalid field 或 confirmation regression，就不該用「真人覺得更自然」把更新推過去。

新模型也可能讓 response 更好，state 卻更差。驗收報告要並排舊／新版本的 phenomenon breakdown 與 unsafe failures，並保存同一批 trace。只有平均 completion 上升不足以批准高影響 agent；課程的重點正是把自然語言能力與可靠執行拆開驗。

## Homework 2 在驗證什麼

作業先要求理解 Worksheet 的表示與更新，再建立叫車 agent。真正該驗的不是 demo 能不能走完 happy path，而是改目的地、缺欄位、無效選項與確認後再反悔時，狀態和外部 action 是否一致。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf))

## 動手做一份最小測試集

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

為同一個任務寫四段對話：正常完成、中途改口、知識庫無結果、要求未宣告動作。每輪保存預期 state diff，而不只保存理想回覆。這份測試才會在換模型後告訴你能力邊界有沒有漂移。

## 材料缺口

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

投影片提供評估摘要，沒有公開完整真人對話、標註規範與統計細節；本文因此不重算或擴大解讀表格數字。沒有 Fall 2025 課堂錄影。

## 參考資料

- [Lecture 4: Evaluation of Task-Oriented Agents](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf)
- [Homework 2](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW2.pdf)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 3: Building a Task-Oriented Agent](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
