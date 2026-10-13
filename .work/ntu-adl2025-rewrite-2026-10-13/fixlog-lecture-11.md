# 第 11 堂 Language Agents 修改紀錄（依 review2-lecture-11.md）

- 日期：2026-10-13
- 檔案：`src/content/posts/ai/2026-09-30-ntu-adl2025-language-agents.md`（zh）、`…-language-agents-en.md`（en）
- 查證方式：講義第 11、16、17、20、40、63 頁轉圖讀圖；字幕 11.2 [12:01]、[15:00]、[18:01]，11.4 [06:00]、[09:03]、[12:00]、[15:00]
- 結果：報告 9 項（M1–M2、S1–S7）改了 8 項，1 項不改（S7，流程面）；另依任務規則多改 1 處（英文「常見的誤解」說明句）。

## M1 自我檢查第 6 題答案（已改）

- 依據：第 63 頁右圖，虛線「LLM Debate (4 agents)」在 12，長條 7 人 8.30、4 人 4.39、3 人 3.90、2 人 2.83；左圖 2 人 68.4、虛線約 69.3。投影片沒有寫基準線跑幾輪。報告屬實。
- zh 改前：「4 × 3 = 12 次，和講義第 63 頁辯論基準線的 12 次一致。只挑兩個是 2 × 3 = 6 次。（挑選本身的成本另計。）呼叫變少不代表比較好：講義裡只留 2 個 agent 時，準確率低於不挑的基準線。」
- zh 改後：「照題目的簡化假設是 4 × 3 = 12 次；講義第 63 頁辯論基準線也是 12 次，但講義沒有寫它跑幾輪。只挑兩個、仍跑三輪是 2 × 3 = 6 次。這是簡化的算法：講義裡實際的做法是中途淘汰 agent，第 63 頁量到的平均呼叫次數是 4 人 4.39 次、2 人 2.83 次。呼叫變少不代表比較好：只留 2 個 agent 時，準確率 68.4% 低於不挑的基準線。」
- en 改前："4 × 3 = 12 calls, matching the 12 calls of the debate baseline on slide 63. With two selected, 2 × 3 = 6. (The cost of selection itself is separate.) Fewer calls does not mean better: in the deck, keeping only 2 agents gives accuracy below the unselected baseline."
- en 改後："Under the question's simplified assumption it is 4 × 3 = 12 calls; the debate baseline on slide 63 is also 12, though the slide does not say how many rounds it ran. With two agents still running three rounds, 2 × 3 = 6. This is a simplification: the method in the deck drops agents partway, and the averages measured on slide 63 are 4.39 calls for a team of 4 and 2.83 for a team of 2. Fewer calls does not mean better: with only 2 agents kept, accuracy is 68.4%, below the unselected baseline."
- 備註：「中途淘汰 agent」沿用報告對第 62 頁的描述，這次沒有另外把第 62 頁轉圖重看。

## M2 「優化」改「最佳化」（已改，只動 zh）

- 共 5 處，改完 grep「優化」為 0。
- tldr：「初始化、協作、團隊優化三步驟」→「初始化、協作、團隊最佳化三步驟」
- description：「初始化、協作與團隊優化」→「初始化、協作與團隊最佳化」
- 多代理第 3 點：「**團隊優化**：透過挑選 agent 優化團隊（…），優化後同樣的團隊規模效果更好」→「**團隊最佳化**：透過挑選 agent 讓團隊最佳化（…），最佳化之後同樣的團隊規模效果更好」
- en 不動（"team optimization" 無誤）。其他中國用語沒有命中。

## S1 煮菜缺鹽例子的出處（已改）

- 依據：第 11 頁有 Obs t「You are cooking a dish and seeing salt is out…」、Act t「Turn right」、Obs t+1「You see a cabinet and a table…」、Act t+1「Open cabinet」四格，沒有 thought。
- zh 改前：「這是老師在影片裡講的。」→ 改後：「第 11 頁列出觀察與動作四格，中間的 thought 是老師在影片裡補上的。」
- en 改前："This one is from the video." → 改後："Slide 11 shows the four observation and action boxes; the thought in between is what Chen adds in the video."

## S2 鑰匙圈任務的目標（已改）

- 依據：第 16、17 頁 AlfWorld 方框「Your task is to: put two keychain in safe.」；第 16 頁 Act 17 的錯誤想法是「I can find the second keychain (2) later in drawer 4」，第 17 頁標題為 Human Thought edit。字幕 11.2 [12:01] 說成「保存在安全的地方」。
- zh 改前：「老師舉了一個在虛擬房間裡找兩個鑰匙圈的任務。」→ 改後：「第 16–17 頁是 ReAct 論文在虛擬房間（AlfWorld）裡的任務：把兩個鑰匙圈放進保險箱。」
- en 改前："She gives a task of finding two keychains in a virtual room." → 改後："Slides 16–17 show a ReAct task in a virtual room (AlfWorld): put two keychains in the safe."

## S3 Deep Dyna-Q 的「九次以上」（已改）

- 依據：第 40 頁圖例 DQN(1)、DDQ(2)、DDQ(5)、DDQ(10)、DDQ(20)，黃線是 DDQ(20)。字幕 11.4 [15:00]：「additional的一次…四次…九次」「這個黃色的…抖動就很大，就跟藍色比起來其實在後續是會比較差的」「只synthesize四個就是五倍而已，那這個紅色就還不錯還蠻穩定」。「九次以上」不是原話，報告屬實。
- zh 改前：「它的好處是減少和真實使用者互動的次數，加少量模擬經驗時，前期學得比只用真實互動快。老師描述的限制是：模擬經驗配得太多時（每一次真實互動配九次以上的模擬互動），學習曲線抖動變大，後期反而比只用真實互動差；每次真實互動配四次模擬互動時還算穩定。」
- zh 改後：「它的好處是減少和真實使用者互動的次數；從第 40 頁的曲線看，加少量模擬經驗時，前期學得比只用真實互動快。第 40 頁的曲線圖例是 DQN(1)、DDQ(2)、DDQ(5)、DDQ(10)、DDQ(20)。老師指出模擬經驗配太多的那條黃線（圖例是 DDQ(20)）抖動很大，後期比只用真實互動的藍線差；紅線 DDQ(5)，她說是每次真實互動多配四次模擬，還算穩定。」
- en 改前："Its benefit is fewer interactions with real users, and with a little simulated experience added, early learning is faster than with real interaction only. The limit as she describes it: with too much simulated experience (nine or more simulated interactions per real one), the learning curve fluctuates more and ends up worse than using real interaction only; with four simulated interactions per real one it is still fairly stable."
- en 改後："Its benefit is fewer interactions with real users; the curves on slide 40 show that with a little simulated experience added, early learning is faster than with real interaction only. The legend on slide 40 reads DQN(1), DDQ(2), DDQ(5), DDQ(10), DDQ(20). Chen points to the yellow curve with the most simulated experience (DDQ(20) in the legend): it fluctuates heavily and ends below the blue real-interaction-only curve, while the red DDQ(5) curve, which she describes as four extra simulated interactions per real one, stays fairly stable."
- 備註：「前期學得比較快」一句依報告建議標成從圖上看到的（綠線、紅線前段高於藍線）。

## S4 英文版講者點名（已改，只動 en）

- en 改前："The instructor explains it this way." → 改後："Yun-Nung Chen, the instructor, explains it this way."

## S5 補上第 20 頁（已改）

- 依據：第 20 頁「Action Planning for Improving Reasoning (Yao et al, 2023)」，圖為 IO、CoT、CoT-SC（Majority vote）、ToT；字幕 11.2 [18:01]「chain of thought 就是比較單刀直入…展開很多條思考的路徑…有八成都得到同樣的結果」。
- zh 改前：「老師接著說，往哪個方向想本身就是一種規劃：」→ 改後：「老師接著用第 20 頁（Yao 等人 2023）說，往哪個方向想本身就是一種規劃：」
- en 改前："She goes on to say that choosing which direction…" → 改後："She goes on, with slide 20 (Yao et al. 2023), to say that choosing which direction…"

## S6 自我檢查第 4 題答案（已改）

- 依據：第 37 頁只列 irreversible actions、unsafe、slow 與 model-based 的優缺點；字幕 11.4 [06:00]–[09:03] 講難復原、不安全、回饋慢、先想像再選，沒有提「執行前確認」。
- zh 改前：「這類任務應該先用 world model 模擬，或至少在執行前確認。」→ 改後：「依這一堂的說法，這類任務適合先用 world model 模擬。（執行前先向使用者確認是本文補充的做法，課堂沒有講。）」
- en 改前："Tasks like this should be simulated with a world model first, or at least confirmed before execution." → 改後："By this lecture's account, tasks like this are better simulated with a world model first. (Confirming with the user before executing is this post's addition, not from the lecture.)"

## S7 影片只嵌入五支中的兩支（不改）

- 理由：流程面項目（影片只嵌入幾支），任務說明列為可不改；報告自己也註明沒有查這是否為站上的既定做法。

## 任務規則另外處理的項目

- 英文「Common misreadings」說明句：改前 "These are my own summary of the lecture." → 改後 "This list is my own summary, not something the lecture enumerated point by point."（zh 對應句未動，報告沒有提。）
- 粗體 `**詞（說明）**` 後直接接中文字：zh 用 regex 掃過，沒有命中，不需修改。
- 報告「契約符合度」裡提到的「已依字幕核對／機器轉錄逐字稿」措辭：報告標為未驗證、沒有列成待改項目，這次沒有動。

## 檢查結果

- `check-course-titles.mjs`：Course title gate: 0 issue(s)
- `check-course-guide-layout.mjs`：Course source layout: 1716 posts, 0 issue(s)
- 沒有改 title、date、series、檔名，沒有 commit。
