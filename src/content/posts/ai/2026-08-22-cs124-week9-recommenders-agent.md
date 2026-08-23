---
title: "CS124 Week 9 Collaborative Filtering and LLM Agents：從電影相似度到搜尋與記憶工具"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, recommender-system, ai-agent, llm]
lang: zh-TW
series: { name: "Stanford CS124 導讀", order: 10 }
tldr: "Week 9 以 item-item collaborative filtering 產生電影推薦，再把推薦、web search、database 與 memory 包成 LLM agent tools；PA7 同時把模型非決定性、API 預算與團隊協作變成交付條件。"
description: "Stanford CS124 Winter 2026 Week 9：推薦系統、協同過濾、cosine similarity、LLM tool use、search、memory、Lab 5 ethics 與 PA7。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs124-week9-recommenders-agent-en)

Week 9 把一個傳統推薦演算法放進 LLM agent。官方 reading 先教 recommender systems 與 collaborative filtering，Lab 5 加入 classroom LLM ethics，PA7 則要求團隊完成能推薦電影、查 web、存取 database 與 memory 的 customer-service agent。

**版本：** Winter 2026。**單元：** Week 9，2026-03-03、03-05。**公開材料：** [schedule](https://web.stanford.edu/class/cs124/lec/)、[collaborative filtering slides](https://web.stanford.edu/class/cs124/lec/collaborativefiltering21.pdf)、[*Mining of Massive Datasets* Chapter 9](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf)、[Lab 5](https://github.com/cs124/labs/blob/main/Lab5_Chatbots.md)、[PA7](https://github.com/cs124/pa7-agent)。**缺口：** Lab 5 未錄影、Quiz 8 gated；PA7 依賴 Together、SerpAPI、mem0ai 與 DSPy，服務版本和費用可能改變。課表留下 Chatbot 舊稱，released repo 已叫 Agent，本文以 repo identity 為準並保留漂移。

## 推薦不是搜尋的另一個名字

搜尋從使用者明示 query 開始；推薦常要在沒有明確 query 時，根據使用者行為與其他人的 ratings 預測下一個 item。[collaborative-filtering slides](https://web.stanford.edu/class/cs124/lec/collaborativefiltering21.pdf) 區分 editorial lists、popular aggregates 與 individualized recommendations。collaborative filtering 屬於第三種：不必先理解電影內容，而從互動矩陣找相似模式。

[PA7](https://github.com/cs124/pa7-agent) 採 item-item collaborative filtering。ratings matrix 的 rows 是 movies、columns 是 users。兩部電影的 rating vectors 以 cosine similarity 比較，再用使用者已評分 items 對候選電影累積分數。README 明示不做 mean-centering 或 score normalization，因此實作應忠於這個指定版本，而不是自行換成另一個教科書變體。

## 稀疏矩陣帶來冷啟動與 popularity 問題

大多數使用者只評少量 items，matrix 很稀疏。新使用者沒有歷史，新電影也缺共同 ratings，這是 cold start。熱門 item 擁有更多互動，往往更容易取得穩定 similarity，可能進一步加深 exposure。

演算法輸出是依既有行為的相似度推估，不是品質、真實或適合性的保證。Week 9 slides 也把 misinformation spread 放進理解推薦系統的理由：排序機制會影響使用者看見什麼，不只是節省選片時間。

## PA7 把推薦函式變成 agent tool

[PA7](https://github.com/cs124/pa7-agent) 的第一部分要求實作 `similarity` 與 `recommend_movies`，再把推薦功能接進 LLM agent。agent 不應假裝自己心算 ratings matrix；它需要選擇工具、傳入使用者與數量，再把結構化結果轉成回答。

第二部分加入 web search 與 memory。search 提供模型參數之外的新資訊；memory 保存跨互動資訊；database 處理訂票等結構化狀態。這三者的 failure modes 不同：search 可取回錯來源，memory 可保存錯誤或敏感資訊，database tool 則可能造成真實狀態變更。

工具使用因此需要明確 input/output、錯誤處理與測試。[PA7 README](https://github.com/cs124/pa7-agent) 提供 `test_functions.py` 等 spot checks，也提醒 agent nondeterminism。可確定的函式應以 deterministic unit tests 覆蓋；LLM routing 則要保留多次執行與失敗案例，不該只展示一次成功對話。

## API 預算是系統約束

[PA7 setup instructions](https://github.com/cs124/pa7-agent) 要求 Together key 與 SerpAPI key，並直接提醒每次跑 REPL 都會消耗預算。這會改變開發方法：先單獨測試純函式與 mockable tool wrapper，再做少量 end-to-end calls。把所有除錯都交給真實 agent loop，會同時浪費費用與降低可重現性。

[PA7 repo](https://github.com/cs124/pa7-agent) 將 keys 放在 `api_keys.py` 的 local copy，且該檔不能提交或貼進文章。repo 的設定方式是課程 artifact，不代表 production secret management 已完成。

## Lab 5 的倫理內容能說到哪裡

[課表](https://web.stanford.edu/class/cs124/lec/)將 Lab 5 命名為 Collaborative Filtering and Ethical Use of LLMs in the Classroom。公開 lab artifact 可確認問題存在，但現場討論未錄影，不能把某個學生立場或講者結論歸給課堂。文章能忠實保留的是結構：同一週要求學生實作排序與 agent，也要求討論其教育使用邊界。

## 本週的完成線

先用固定 synthetic users 讓 collaborative filtering tests 通過，保存每個推薦的 contributing similarities。接著為 search、memory、database 各寫成功與失敗 case，最後才用有限 API calls 跑 agent。[PA7 README](https://github.com/cs124/pa7-agent) 規定團隊需記錄誰負責何部分、禁用 late days，也不能由一人單獨完成。

## Item-item collaborative filtering 手算

[PA7 README](https://github.com/cs124/pa7-agent) 指定 ratings matrix 以 movies 為 rows、users 為 columns。對兩部電影 `i,j`，取 rating vectors `r_i,r_j`，cosine 是 dot product 除以兩個 norms。沒有共同非零 ratings 時，similarity 缺乏證據；norm 為零時必須定義安全處理，不能讓除零產生 NaN 傳進排序。

候選電影 `i` 的 score 由使用者已評電影 `j` 的 rating 乘 `sim(i,j)` 後加總。[PA7 README](https://github.com/cs124/pa7-agent) 明示不 mean-center、不 normalize scores，因此 hand calculation 應完全照這個指定。若自行扣掉 user mean 或除 similarity sum，即使是合理變體，也會和公開 expected list 不同。

使用 [PA7 README 的 synthetic user Peter example](https://github.com/cs124/pa7-agent) 可當 regression test：輸入名字與推薦數量，結果順序應和 README 一致。不要只 assert 三個 titles 存在，還要 assert exact order；tie-breaking 也要 deterministic，例如以 score 後再以 movie ID 排。

score explanation 可列每個已評電影的 `rating × similarity` contribution。agent 最終不一定要把全部數學展示給使用者，但開發 log 應能重建 top recommendation，否則 tool output 錯時只能怪 LLM。

## Recommender evaluation 不等於看起來合理

離線評估可遮掉一筆已知 rating，讓系統由其他 ratings 預測，再以 ranking metrics 檢查 held-out item 是否出現在 top-k。train/test split 必須尊重 users 與時間，避免把未來 interaction 洩漏到過去。

popular baseline 很重要。若 collaborative filtering 無法超過「所有人都推最熱門」，個人化複雜度還沒有證據。也可分 cold-start users、heavy users、popular items、tail items 報結果，避免平均分數掩蓋稀疏區失敗。

coverage 與 diversity 是 accuracy 以外維度。系統是否只推薦很少一群 movies？同一列表是否全部高度相似？這些 metrics 不必全部變成 PA7 grading criteria，但可作自學 evaluation，並清楚標為延伸。

## Tool contract 先於 agent prompt

每個 tool 應有名稱、description、typed inputs、structured output、可能 errors 與 side effects。`recommend_movies(user, k)` 若 user 不存在，要回明確 error，不是空列表讓 agent 猜。web search 要保留 query、results、URLs；memory 要區分 write/read；database booking 要區分查詢與 mutation。

tool description 會影響 LLM routing。兩個 tools 描述重疊時，模型可能選錯。先用人工 cases 檢查「這個 request 應呼叫哪個 tool」，再調 prompt；不要用自然語言包裝掩蓋模糊 API。

structured outputs 比自由文字容易測。推薦 tool 回 movie IDs、titles、scores；search 回 title/snippet/url；database 回 status 與 record ID。agent 最後才將它們轉成對話。

## Search tool 的 evidence 與失敗處理

[PA7](https://github.com/cs124/pa7-agent) 用 SerpAPI Bing Search。wrapper 應處理 missing key、quota exhausted、timeout、empty results 與 malformed response。每個 failure 都回可辨識狀態，避免 LLM 在沒有結果時補寫網路內容。

測試 search 不必每次消耗 API。保存一個 redacted fixture 或 mock response，unit test parsing、ranking 與 URL extraction；只用少量 live calls 驗證 integration。[PA7 README](https://github.com/cs124/pa7-agent) 說 free account 有有限 searches 且 autograder 仍需額度，這直接支持先 mock 後 live 的開發順序。

agent 引用 search 結果時要把 URL 留在 output evidence。PA7 不等於完整 fact-checking system，但若結果來源消失，至少能知道模型依賴哪個 item。

## Memory 不是把所有對話永久保存

memory tool 需要定義寫入條件、scope、key、更新與刪除。使用者說「我喜歡科幻片」可成為推薦 preference；一次性訂票時間不一定該變永久 profile。若每句都寫入，錯誤與敏感資訊會累積。

測試至少涵蓋 create、retrieve、update、conflict、delete 與 wrong-user isolation。兩個同名使用者或 session IDs 不可共享 memory。agent 在使用舊 memory 前也應能讓使用者更正，而不是把 stale state 當事實。

[PA7](https://github.com/cs124/pa7-agent) 使用 mem0ai 是實作選擇，不取消資料治理問題。自學交付應列哪些 fields 被保存、保存位置、如何清除，且不得把真實個資放進公開 repo。

## Database tool 與 side effects

customer-service agent 涉及 movie ticket bookings。read-only 查詢可安全重試，booking／cancel 等 mutation 不一定可重試；timeout 後重送可能重複訂票。tool contract 應使用 idempotency key 或先查 status，再決定重試。

高影響 mutation 前可要求 confirmation，並在回應中回傳具體 booking ID 與狀態。LLM 自然語言說「完成」不算成功證據，database response 才算。

[PA7 scaffold](https://github.com/cs124/pa7-agent) 未必實作 production transaction semantics；文章把它列為 tool test 要看的 side effect，不宣稱課堂已完整處理所有付款／隱私要求。

## Agent nondeterminism 的測試策略

同一 prompt 多跑幾次，LLM 可能選不同 tool 或產生不同 phrasing。先將 correctness 拆成 deterministic core 與 stochastic orchestration：collaborative filtering、parsing、database updates 以 unit tests；tool selection 與 final response 以 scenario tests。

scenario 至少包括直接推薦、需要先問使用者資訊、search 無結果、memory 衝突、API timeout、mutation confirmation。每個 scenario 定義允許的 tool sequence 與必須出現的 facts，不要求整段文字逐字相同。

記錄 model、temperature、prompt version、tool schema 與 run ID。若版本不留，agent regression 無法判斷是 code、prompt 或 provider model 更新。

## Reflection 與團隊交付

[PA7 README](https://github.com/cs124/pa7-agent) 有 reflection 與 manual／LLM grading elements，並要求 `rubrics.txt` 標示完成 features。交付前逐項對照，不要把未實作 feature 寫成 YES。團隊 description 也要記誰做哪些 code 與 tests，符合 syllabus 對 group work 的要求。

ethics 不只在 Lab 5。推薦結果會影響 exposure，memory 會保存個人資訊，search 會引入外部來源，agent mutation 會改真實狀態。每個工具的 evidence log 同時是安全與除錯基礎。

最終 demo 應包含成功 case 與一個預期 failure：例如 search quota 用完時，agent明確說無法取得結果而不編造。能安全失敗，比只展示順利訂票更能證明系統理解 tool boundaries。

## 參考資料

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [Collaborative Filtering slides](https://web.stanford.edu/class/cs124/lec/collaborativefiltering21.pdf)
- [Mining of Massive Datasets, Chapter 9](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf)
- [CS124 Lab 5](https://github.com/cs124/labs/blob/main/Lab5_Chatbots.md)
- [CS124 PA7 Agent](https://github.com/cs124/pa7-agent)
