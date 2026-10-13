# 第 13 堂（對話系統與工具使用）複審報告

複審日期：2026-10-13。複審者未參與撰寫與第一次審查，只審查、未改動文章。

受審版本（sha256）：

- zh `src/content/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use.md`：`9af98e83e68590f5ecfb75a7167bb40063d34d83b164e0da4071e98d50dfab87`
- en `src/content/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use-en.md`：`d51882475f12e02d6ea7ce3c375ba5eaa97a190e8ebe3f0e413e3a3a76aea691`

兩個雜湊都與第一次報告記錄的不同，確認文章在第一次審查後改過。第一次受審的版本沒有留存（改動未 commit，HEAD 是重寫前的舊稿），所以「作者改了哪些句子」是用第一次報告引用的原句與現行文字比對得出的，不是逐行 diff。

這次實際對過的來源：

- 逐字稿：13.2（01:06–01:31、09:57–10:46）、13.3（01:11）、13.4（04:57–05:07）、13.5（05:29–06:23）、13.6（00:00–01:34、02:18–04:31、05:00–05:23、12:15–12:41、13:46–14:50 的關鍵行）、13.8（01:38–02:19、03:12–04:03、05:37–06:16、09:39–10:27）。
- 2024 講義轉圖讀圖：第 48、54、68、72 頁；第 76 頁抽文字。
- 影片畫面：13.8 於 04:00 放大（ExploreToM 投影片）；13.6 與 13.7 於 00:05、02:40、05:25、10:20、14:20 並排比對；13.7 於 02:40 另抓 1080p 畫面讀 ReSpAct 的小字。
- 13.6 與 13.7 的影片軌與原始音軌（見第二節）。

結論：第一次報告的 2 項必修與 9 項內容建議全部已修正，沒有改錯，也沒有發現新引入的事實錯誤。「13.6 與 13.7 是同一段錄影」可以定案為成立。剩下的都是選擇性的小幅措辭建議與一項流程缺件，沒有必修。

---

## 一、仍需修改

沒有必修項目。以下四項是建議，前兩項是文字與來源還有一點落差，後兩項是可選。

### R1. Toolformer：老師說「可能」還是不能做運算，文章寫成肯定（S3 的殘留，輕微）

- zh 第 189 行：「她說就算有搜尋，也不一定適合這種精確的問答，而且還是做不了這些運算。」
- en 第 189 行：「she says that even with search it would not necessarily suit such precise QA and still could not do the arithmetic.」
- 依據：13.5 06:06–06:19「其實有用 WebSearch 也不一定會很強啦／因為 WebSearch 可能不一定這麼符合他這種 QA 的這種精確問題／以及可能還是沒有辦法做這些運算」。兩句都帶「可能」，文章後半句把它拿掉了。
- 建議文字：
  - zh：「她說就算有搜尋，也不一定適合這種精確的問答，可能還是做不了這些運算。」
  - en：「she says that even with search it would not necessarily suit such precise QA and might still be unable to do the arithmetic.」

### R2. LaMDA 第二次查詢：查的是「何時完成」，回來的才是啟用日期（輕微）

- zh 第 127 行：「Research 其實查了兩次：先查動工的日期，再查啟用的日期，最後合併成一句。」
- en 第 127 行：「Research actually queries twice: first for the construction start date, then for the opening date, and merges the two into one sentence.」
- 依據：第 48 頁讀圖，兩次查詢是 `TS, Eiffel Tower construction date` → `construction started: 28 January 1887`，以及 `TS, Eiffel Tower complete when` → `date opened: 31 March 1889`。老師在 13.2 10:29–10:36 說「開始的時間是這個，然後他就會說那是什麼時候完成的呢，然後他就會再收完成時間」。「查兩次再合併」正確；只是第二次送出去的問題是「何時完成」，工具回的是啟用日期，第一次送的也是泛稱的 construction date。
- 建議文字：
  - zh：「Research 其實查了兩次：第一次查到動工的日期，再追問什麼時候完成，查到啟用的日期，最後合併成一句。」
  - en：「Research actually queries twice: the first query returns the date construction started, it then asks when the tower was completed and gets the opening date, and it merges the two into one sentence.」

### R3. 「同一段錄影」的理由可以換成更直接的證據（可選）

- zh 第 51 行：「13.6 與 13.7 兩支的逐字稿一字不差，長度也相同，是同一段錄影掛了兩個標題。」
- en 第 51 行：「The transcripts of 13.6 and 13.7 are identical word for word and the lengths match: one recording is posted under two titles.」
- 依據：結論正確（見第二節）。但兩份逐字稿檔案位元組相同、修改時間也相同，無法排除其中一份是複製來的，拿它當理由比較弱。這次複審已直接比對影片與音軌，可以用那個當理由。
- 建議文字：
  - zh：「13.6 與 13.7 兩支影片的畫面與聲音完全相同，長度也相同，是同一段錄影掛了兩個標題。」
  - en：「Videos 13.6 and 13.7 have identical picture and sound and the same length: one recording is posted under two titles.」
- 不改也不算錯。

### R4. 流程缺件：第 13 堂的範圍卡仍然沒有（第一次報告 S12，未修正）

- `.work/ntu-adl2025-rewrite-2026-10-13/` 下仍只有 `scope-lecture-12.md`。
- 判斷：這是契約的流程要求，不影響文章內容。文章已寫完，事後補卡的價值有限，是否補由作者決定。

另有一處不建議一定要改、只列出供參考：zh／en 第 106 行寫老師「說不確定真假，請大家自己查」。13.2 01:27–01:31 的原話是「有一個這個八卦，當然不確定是真是假，但我覺得應該是蠻真的，大家可以去 Google 一下」。現行寫法沒有錯，只是略去了「她覺得應該是真的」這半句。要補的話：zh「她說不確定真假，但覺得應該是真的，請大家自己查。」／en「She says she is not sure whether it is true, though she thinks it probably is, and suggests looking it up.」

---

## 二、13.6 與 13.7 是否為同一段錄影：定案為「是」

全部是實際下載比對的結果，不是推測。

| 項目 | 13.6（FK-r_-dVHcI） | 13.7（fzzOlH0t0_w） | 結果 |
|---|---|---|---|
| YouTube 標題 | ADL 13.6: Plan-and-Execute 規劃策略後執行 | ADL 13.7: User Interaction 與使用者互動比單獨執行更有效 | 不同 |
| 上傳日期 | 2025-11-26 | 2025-11-26 | 相同 |
| 影片長度（360p VP9） | 911.400 秒 | 911.400 秒 | 相同（15:11） |
| 360p 影片檔 sha256 | 2f4fabfb… | e57f7482… | 不同（各自轉檔） |
| 畫面相似度 | 每 5 秒取一格，共 182 格，SSIM 平均 0.9948、最低 0.9858 | | 全片畫面一致 |
| 原始音軌（format 139-1，zh-Hant original） | 5,548,592 bytes，sha256 2c324dca…d66a | 5,548,592 bytes，sha256 2c324dca…d66a | **位元組完全相同** |

- 五個時間點（00:05、02:40、05:25、10:20、14:20）的並排畫面相同，連紅色雷射筆的位置都一樣：投影片 50–52 是 ReSpAct，54 是 Training SalesAgent via CoT，57 是 Personalized Strategies from Simulated Data。全片沒有 Plan-and-Execute 的投影片。
- 原始音軌兩支的檔案雜湊相同，等於是同一份聲音。這比「逐字稿相同」強，也不受「13.7 逐字稿是否獨立轉出」影響。
- 比對時踩到的坑，留作紀錄：`yt-dlp -f wa` 會抓到 YouTube 自動配音的英文音軌（`[en-US] dubbed-auto`），兩支的英文配音彼此只有弱相關（包絡相關 0.41）。要指定 `-f 139-1` 才是原始的中文音軌。之後若再做同類比對要留意。
- 所以文章的三處說法都成立：第 51 行「同一段錄影掛了兩個標題。內容是 13.7 的 User Interaction」、第 397 行「13.6 與 13.7 是同一段錄影」、第 402 行更新紀錄。「Plan-and-Execute 那一段在公開的影片裡找不到」就這兩支影片而言成立；第 13 堂其餘七支我沒有重看畫面，是依第一次報告與逐字稿的內容判斷其中沒有這一段。

比對用的檔案在 `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/42e64be7-986b-4e7a-9d48-f878878ecdfd/scratchpad/rereview-13/`（`dl/13.7.webm`、`dl/zh136.m4a`、`dl/zh137.m4a`、`ssim.log`、`cmp.png`）。這是暫存目錄，要長期留證請另存。

---

## 三、已確認修正正確

以下每一項都回到來源對過現行文字。行號是現行檔案的行號，中英相同。

### 必修

- **M1 ExploreToM（第 243 行）— 已正確修正。** 現行：「Anne 和 Beth 走進廚房，Beth 在蘋果上加了鹽然後離開，並傳訊息告訴 Charles；之後 Charles 進來，把蘋果移到冰箱。」13.8 影片 04:00 畫面（投影片 59）的節點是「Anne entered the kitchen. Beth entered the kitchen.」→「Beth salted the apple. Beth left the kitchen.」→「Beth texted to Charles to let him know the apple is salted. Charles entered the kitchen.」→「Charles moved the apple to the fridge.」順序與人物都對。接著列的三個問題與第 245 行的四個答案（fridge、table、yes、no；模型答 fridge ✓、table ✓、no ✗、yes ✗，acc = 0.5）也與畫面相符。英文版同步。
- **M2 延伸閱讀（第 359–361 行）— 已正確修正。** 兩版現在是相同的三項、相同的順序：CS224N 第 10 堂、本系列第 11 堂、本系列第 8 堂。英文版原有的 CMU 11-768 與 CME295 兩項已拿掉，全文搜尋無殘留。六個連結目標檔案都存在；第 8 堂文章確有 WebGPT，第 11 堂確有 ReAct，描述語正確。

### 建議

- **S1 自編訂房例子的結語（第 86 行）— 已正確修正。** 現在只說「先查再決定」這一步是沒有接工具的語言模型做不到的事，不再把 DST 也算進去。13.1 的說法支持這一句。
- **S2 LaMDA 查兩次（第 127 行）— 已修正，內容正確。** 第 48 頁確實是兩次查詢再合併，老師也說「實際上是收了兩次……最後再把它合併在一起」。措辭的小落差見 R2。
- **S3 Toolformer 的圖（第 189 行）— 已修正，新增的括號句正確。** 第 72 頁讀圖：QA Benchmarks 那張 GPT-3 虛線約 39，最大的 Toolformer 約 31，虛線確實較高；LAMA 與 Math 兩張最大的 Toolformer 高於 GPT-3。「GPT-3 沒有用搜尋」「就算有搜尋也不一定適合這種精確的問答」都對得上 13.5 06:01–06:12。只剩 R1 的「可能」。
- **S4 ReSpAct 三類話（第 214 行）— 已正確修正。** 改成「論文整理了代理人會說的三類話」。13.6 05:00–05:13 說的是這個 framework 下發現的互動策略；畫面投影片 52 的三個小標是 (a) Seeking User Guidance、(b) Sharing Status Update、(c) Seeking User Preference。
- **S5 BlenderBot「會去查」（zh 第 139 行）— 已正確修正。** 改成「之後會找來聽」。第 54 頁原文「I haven't heard that one. I'll have to check it out.」，記憶寫入是「(self) I am a fan of 808s and Heartbreak」。
- **S6 WebGPT 動作清單（第 159 行）— 已正確修正。** 改成「判定題目不合理或有爭議而跳過」。第 68 頁最後一列是 `End: <Nonsense, Controversial>`。十項動作與表格逐列相符。
- **S7 保留語氣 — 已正確修正。** 第 106 行改成「傳聞……她說不確定真假」；第 163 行改成「老師推測可能是網路上很多人這樣講」（13.4 05:03「因為可能網路上面很多人說」）。
- **S8 「對回第 7 堂」（第 137 行）— 已正確修正。** 改成「對回前面講過的 post-training（本系列第 7 堂）」，堂次標成本文的對應。13.3 01:11 是「很像我們前面講過的 post training」；本站該篇標題是第 7 堂。
- **S9 Toolformer 例子的機率（第 184 行）— 已正確修正。** 例子標題直接寫「機率都是假設的數字」。

### 其他新寫或改寫的句子

- 第 199 行「13.6 開頭老師提到『前面那個機票、飯店的例子，每一步都和使用者確認』，指的應該就是這類例子」：13.6 00:00–00:35 是「像剛剛前面那個機票啊 Hotel 的這個例子，他是有明確每一個都跟使用者確認」。第 76 頁的 AirlineBot 與 HotelBot 確實每一步都反問使用者，推測合理，而且文中用「應該」標明是推測。
- 第 197 行對第 76 頁的描述：頁面文字是「I want to plan a trip to SF.」、Implicit Tasks「Flight Ticket Booking; Room Reservation」、AirlineBot、HotelBot、「→ Plan-and-Execute in LLM Agents」、Kuo 與 Chen 2023，相符。
- 第 205 行「Dongre 等，投影片標 2025」：畫面標題是「ReSpAct: Reasoning, Speaking, and Acting (Dongre et al., 2025)」。
- 第 210 行 ReSpAct 的問句：1080p 畫面是「I think a cloth is more likely to appear in dresser (1), drawer (1-4), or shelf (1-2). Where should I look for the cloth first?」，使用者回「There should be one on the bathtubbasin. Why don't you check that?」。文章只寫梳妝台與抽屜，沒提架子，跟的是老師的口述（03:38–03:45「dresser 裡或者是 drawer 裡面」），不算錯。
- 第 235 行 plug and play（12:36）、第 237 行深色是成功次數（13:46）、藝術類與展覽（14:10–14:25）、成功率大幅上升（14:50）：逐字稿相符。
- 第 249 行「例子是數學題，一個模型本來就解得出來」：13.8 06:03–06:08 相符。第 257 行偏好資料與 preference alignment：09:39–09:54、10:27 相符。

### 中英一致性

M1、S1–S9 與延伸閱讀的修改處，中英兩版內容一致，沒有只改一邊的情況。英文版第 139 行本來就是「will check it out」，S5 只需要改中文。

### 自編例子與自我檢查

- 訂房例子：第 86 行改寫後，條件、推理、分歧、結果仍然連貫；自我檢查第 2、3 題的答案與例子一致。
- Toolformer 例子：加上「假設的數字」後，推理與第 182 行的篩選規則仍一致。
- 自我檢查第 4 題的答案沒有提「查兩次」，與正文的四步一致，也不與第 127 行的補充矛盾。第 8 題的三類話與第 216–218 行一致。
- 常見誤解第 3 條「搜尋之後反而答錯」與第 163 行一致（GPT-3 答 I have no comment，WebGPT 答了錯的內容）。

---

## 四、未驗證

- 第一次報告「無誤確認」一節裡，這次沒有重對的部分：13.1、13.9 的全部內容；13.3、13.4 除上列幾行以外的內容；講義第 48、54、68、72、76 頁以外的頁面；SalesAgent 投影片上括號想法的原文；Collaborative Reasoner 三個發現的投影片原文；Collaborative Gym 的畫面。這些沿用第一次報告的結論。
- 第 13 堂另外七支影片（13.1–13.5、13.8、13.9）的 YouTube 長度，以及「九支都沒有字幕」。這次只確認了 13.6 與 13.7 各為 911 秒。順帶看到兩支都有 YouTube 自動配音的英文音軌，這和「沒有字幕」是兩回事，沒有進一步查字幕軌。
- 「Fall 2025（114-1，2025/09/01–12/15）11/24 那一週」。這次只看到兩支影片的上傳日期是 2025-11-26，與該週相容，但不足以證明。
- 「Fall 2025 沒有公開這一堂的講義」、參考資料的各個網址、「已於 2026-10-10 對照官方 YouTube 播放清單」。
- `check-course-titles.mjs`、`check-course-guide-layout.mjs`、`pnpm verify` 這次沒有重跑；實際渲染的頁面也沒有看。
- S11（文末只嵌四支影片）與 S13（第 37 行的查核說明）維持原狀，第一次報告本來就判定可留，這次沒有另外意見。
