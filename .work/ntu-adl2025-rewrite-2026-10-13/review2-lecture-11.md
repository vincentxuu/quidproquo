# 第 11 堂 Language Agents 獨立審稿報告（第二輪）

- 審查日期：2026-10-13
- 文章（工作區未提交版本）：
  - zh：`src/content/posts/ai/2026-09-30-ntu-adl2025-language-agents.md`，sha256 開頭 `1242ac7aec690451`
  - en：`src/content/posts/ai/2026-09-30-ntu-adl2025-language-agents-en.md`，sha256 開頭 `0ff172de5d8b05a0`
- 來源：`transcripts/lecture-11-captions.txt`（全文讀完）、`slides/251110_LangAgent.pdf`（65 頁，pdftotext 全文；第 11、17、25、30、36、40、42、47、56、57、58、62、63 頁轉成圖片讀圖）、`course-guide-contract.md`
- 只審查，沒有改文章。

結論：數字、頁碼、人名年份全部對得上來源，沒有發現會改變概念或結論的事實錯誤。必修 2 項、建議 7 項。

---

## 必修

### M1. 自我檢查第 6 題的答案和它引用的同一張投影片對不起來

- zh L208–210、en L206–208
- 原句（zh）：「4 × 3 = 12 次，和講義第 63 頁辯論基準線的 12 次一致。只挑兩個是 2 × 3 = 6 次。（挑選本身的成本另計。）」
- 依據（讀圖確認）：
  - 第 63 頁右圖只畫一條「LLM Debate (4 agents)」的虛線在 12，沒有寫基準線跑幾輪。「4 × 3」是本文自己的推算，講義沒有這個算式，寫「一致」等於把推算說成講義內容。
  - 同一張圖上，挑選後的實際呼叫次數是 7 人 8.30、4 人 4.39、3 人 3.90、2 人 2.83。題目問「每題只挑兩個 agent 參與」，答案給 6 次，但講義同一情境的數字是 2.83 次；4 人團隊也是 4.39 而不是 12。「挑完再跑滿三輪」這個模型不是講義的做法（第 62 頁是 t=1 到 t=4 的網路，中途淘汰 agent）。
  - 算術本身沒錯（4×3=12、2×3=6 已重算），問題在答案沒有說明這是簡化假設，讀者會以為挑兩個要 6 次。
- 建議文字（zh）：「照題目的簡化假設是 4 × 3 = 12 次；講義第 63 頁辯論基準線也是 12 次，但講義沒有寫它跑幾輪。只挑兩個、仍跑三輪是 2 × 3 = 6 次。這是簡化的算法：講義裡實際的做法是中途淘汰 agent，第 63 頁量到的平均呼叫次數是 4 人 4.39 次、2 人 2.83 次。呼叫變少不代表比較好：只留 2 個 agent 時，準確率 68.4% 低於不挑的基準線。」
- 建議文字（en）："Under the question's simplified assumption it is 4 × 3 = 12 calls; the debate baseline on slide 63 is also 12, though the slide does not say how many rounds it ran. With two agents still running three rounds, 2 × 3 = 6. This is a simplification: the method in the deck drops agents partway, and the averages measured on slide 63 are 4.39 calls for a team of 4 and 2.83 for a team of 2. Fewer calls does not mean better: with only 2 agents kept, accuracy is 68.4%, below the unselected baseline."

### M2. 中文版出現「優化」五次（本次審查清單列為中國用語）

- zh L11（tldr「團隊優化三步驟」）、L12（description「團隊優化」）、L170（「團隊優化」「優化團隊」「優化後」）
- 依據：審查項目 8 的清單。補充：`.agents/skills/post/references/writing-guide.md` 的替換表裡我沒有 grep 到「優化」這一條，所以這項是依本次任務清單判定，不是依 writing-guide。
- 建議文字（zh）：改成「團隊最佳化」「透過挑選 agent 讓團隊最佳化」「最佳化之後同樣的團隊規模效果更好」。
- en 不受影響（"team optimization" 無誤）。
- 其餘清單詞（質量、信息、視頻、默認、反饋、技術棧、窗口、數據、用戶、算法、代碼、調用、運行、項目等）已 grep，沒有命中；文中用的是「回饋」「品質」「呼叫」「使用者」。

---

## 建議

### S1. 煮菜缺鹽例子的出處寫得不完整

- zh L81、en L79
- 原句：「這是老師在影片裡講的。」
- 依據（讀圖確認）：第 11 頁就有這個例子的四格：Obs t「You are cooking a dish and seeing salt is out…」、Act t「Turn right」、Obs t+1「You see a cabinet and a table…」、Act t+1「Open cabinet」。老師口頭補的只有中間的 thought（鹹食、找替代、醬油、右邊櫃子，11.2 [06:01]–[09:00]）。現在的寫法讓人以為整個例子不在講義上。
- 建議（zh）：「第 11 頁列出觀察與動作四格，中間的 thought 是老師在影片裡補上的。」
- 建議（en）："Slide 11 shows the four observation and action boxes; the thought in between is what Chen adds in the video."

### S2. 鑰匙圈任務的目標寫成「找」

- zh L93、en L91
- 原句：「老師舉了一個在虛擬房間裡找兩個鑰匙圈的任務。」
- 依據（讀圖確認）：第 17 頁 AlfWorld 的任務是「Your task is to: put two keychain in safe.」，要把兩個鑰匙圈放進保險箱；找只是過程。老師口頭說成「保存在安全的地方」（11.2 [12:01]），是把 safe 講成形容詞。另外這個例子在講義第 16–17 頁，不只是口述。
- 建議（zh）：「第 16–17 頁是 ReAct 論文在虛擬房間（AlfWorld）裡的任務：把兩個鑰匙圈放進保險箱。」
- 建議（en）："Slides 16–17 show a ReAct task in a virtual room (AlfWorld): put two keychains in the safe."

### S3. Deep Dyna-Q 的「九次以上」是本文歸納，不是老師原話

- zh L149、en L147
- 原句：「老師描述的限制是：模擬經驗配得太多時（每一次真實互動配九次以上的模擬互動），學習曲線抖動變大，後期反而比只用真實互動差；每次真實互動配四次模擬互動時還算穩定。」
- 依據（讀圖確認）：第 40 頁圖例是 DQN(1)、DDQ(2)、DDQ(5)、DDQ(10)、DDQ(20)。老師口頭只舉了「additional 的一次、四次、九次」，說抖動大、後期輸給藍線的是「黃色」（11.4 [15:00]），而黃線在圖例上是 DDQ(20)，不是 DDQ(10)。圖上紫線 DDQ(10) 與黃線 DDQ(20) 後期確實都低於藍線，所以結論方向沒錯，但「九次以上」是把老師的說法和圖例合併後的歸納。
- 另外同一句的「加少量模擬經驗時，前期學得比只用真實互動快」是讀圖得到的（綠線、紅線前段高於藍線），老師沒有這樣說；現在的句子沒有把它歸給老師，可以保留，建議標明是圖上看到的。
- 建議（zh）：「第 40 頁的曲線圖例是 DQN(1)、DDQ(2)、DDQ(5)、DDQ(10)、DDQ(20)。老師指出模擬經驗配太多的那條黃線（圖例是 DDQ(20)）抖動很大，後期比只用真實互動的藍線差；紅線 DDQ(5)，她說是每次真實互動多配四次模擬，還算穩定。」
- 建議（en）："The legend on slide 40 reads DQN(1), DDQ(2), DDQ(5), DDQ(10), DDQ(20). Chen points to the yellow curve with the most simulated experience (DDQ(20) in the legend): it fluctuates heavily and ends below the blue real-interaction-only curve, while the red DDQ(5) curve, which she describes as four extra simulated interactions per real one, stays fairly stable."

### S4. 英文版第一次提到講者沒有點名

- en L55：「The instructor explains it this way.」之後整篇用 She／Her（L55、L65、L73、L91、L93、L108…）。沒有一開始就用 She，但正文裡講者的名字只出現在系列名稱和第 12 頁例句，沒有一句話說明 she 是誰。
- 建議（en）：L55 改成 "Yun-Nung Chen, the instructor, explains it this way."（zh 不需改。）

### S5. 「往哪個方向想也是規劃」那段可補上第 20 頁

- zh L95、en L93：這段寫在「第 18–19 頁」之後，內容（直線的 CoT、多條路徑取多數、展成樹）對應第 20 頁「Action Planning for Improving Reasoning (Yao et al, 2023)」與 11.2 [18:01]–[21:01]。現在第 20 頁在正文沒有被引到。
- 建議（zh）：「老師接著用第 20 頁（Yao 等人 2023）說，往哪個方向想本身就是一種規劃：…」
- 建議（en）："She goes on, with slide 20 (Yao et al. 2023), to say that choosing which direction to think in is itself a kind of planning: …"

### S6. 自我檢查第 4 題答案裡的「或至少在執行前確認」不在來源內

- zh L202、en L200。來源只講到不可逆、不安全、慢，以及改用 world model 模擬（第 37 頁、11.4 [06:00]–[09:03]）；「執行前確認」是本文加的建議。放在自擬題答案裡可以，但語氣是「應該」。
- 建議（zh）：「依這一堂的說法，這類任務適合先用 world model 模擬。（執行前先向使用者確認是本文補充的做法，課堂沒有講。）」
- 建議（en）："By this lecture's account, tasks like this are better simulated with a world model first. (Confirming with the user before executing is this post's addition, not from the lecture.)"

### S7. 影片來源段只嵌入五支中的兩支

- zh L225–233、en L223–231：`youtube` 區塊只有 11.1、11.2，另外三支只有文字連結。中英一致。我沒有查這是否為站上的既定做法（未驗證），只是提醒。

---

## 無誤確認

### 實際對過來源的項目

圖表數字（全部讀圖）：

- 第 25 頁：2.34 = 0.91 + 0.63 + 0.80，三項相加，取出情人節派對。相符。
- 第 47 頁：成功率 17.7／23.6／26.4%，動作數 4.3／4.6／11.6，時間 80／199／836 秒，順序為 reactive、model-based、tree search。相符。「Model-based 成功率比 tree search 低一點，動作數和反應式差不多」與圖及 11.4 [21:00] 一致。
- 第 56–58 頁（多代理辯論）：第一輪 Agent 1 答 225（錯）、Agent 2 答 595（對）；第二輪 Agent 1 改成 560（仍錯）；第三輪 Agent 1 改成 595，達成共識。相符；560、595 也在 11.5 [06:00]。
- 第 63 頁：辯論基準線虛線在 69.0 與 69.5 之間約 69.3、呼叫 12 次；挑選後 4 人 70.5%、4.39 次；2 人 68.4%。相符（7 人 69.5%、8.30 次，3 人 69.9%、3.90 次，文章未引用）。
- 第 30 頁：負面情緒 Undecided 21%、Compromise 15%；正面情緒 Undecided 2%、Compromise 1%、Decided 14%。文章只做定性描述，方向相符。
- 第 42 頁：D3Q 曲線較穩、人工評估 0.222／0.326／0.440。文章只寫「更穩健、人工評估有改善」，相符。

頁碼與引用：第 2、3–4、5、6、7、9、10、11–12、13–17、18–19、22、23–25、26–30、32、33、34、35–37、38、39–42、41（D3Q 作者含 Y.-N. Chen）、43–45、44、46–47、49、50、52、53–54、56–58、59–60、62–63、64 頁的內容與文章描述逐一對過，頁碼無誤。講義 65 頁（pdfinfo）。人名年份：Wei 2022、Yao 2022、Park 2023、Zhang 2024、Kuo & Chen 2023、Deng 2024、Koh 2024、Peng 2018、Su 2018、Gu 2024、Chen 2024、Du 2023、Wu 2023、Liu 2024，都和投影片標題相符。

老師口述（對字幕）：

- token 生成是 internal action、agent 定義不變、之後有更好的工具可替換（11.1 [06:00]–[12:00]）。
- 三種 agent 的補充、「一本正經」（11.1 [15:00]–[18:00]）。
- 推理更新 short-term memory 即 context window（11.2 [00:00]）。
- 煮菜缺鹽的 thought（11.2 [06:01]）、人可以刪改 thought（11.2 [15:00]）。
- 八成路徑同結果、樹狀展開（11.2 [18:01]–[21:01]）。
- RAG 是唯讀的長期記憶（11.3 [03:03]）；很久以前聽到與今天早上父母才講（11.3 [06:00]）。
- 合成一天事件與情緒：打翻咖啡、九點信件、十一點半解 bug；負面情緒的會議常沒有結論或妥協（11.3 [12:01]–[18:02]）。
- 一步失敗就卡住、tree search 回頭、數值、難復原、不安全、慢（11.4 [03:03]–[09:03]）。
- LLM 想像點下去的頁面再評估哪個離目標近（11.4 [18:00]–[21:00]）。
- 辯論過程、三個臭皮匠、三方對話與主管分層（11.5 [06:00]–[09:00]）。
- 每輪互看很花時間、生物題的例子、同儕互評（11.5 [12:02]）。
- 11.1 開場「這學期的倒數第二堂課」（11.1 [00:00]）。

沒有發現把老師沒說的話寫成老師說的（S3 的「九次以上」是最接近的一處）。

### 本文自編例子與計算（已重算）

- 記憶表：0.2+0.6+0.8=1.6、0.9+0.7+0.7=2.3、0.95+0.2+0.1=1.25；只看 relevance 取發表會（0.8 最高），三項相加取派對。正確。
- 自我檢查 3：0.2+0.6+0.1=0.9、0.9+0.7+0.8=2.4、0.95+0.2+0.9=2.05；取派對、咖啡第二。正確。
- 規劃代價：3+9+27+81=120；model-based 3×4=12 次模擬、4 個實際動作。正確。
- 自我檢查 6：4×3=12、2×3=6 算術正確（問題見 M1）。

### 自我檢查答案

第 1、2、3、5 題答案正確，且能由正文推得（依序對應「Agent 是什麼」段、煮菜例子、記憶表、World model 段）。第 4 題見 S6，第 6 題見 M1。

### 常見的誤解

五條都有正文與來源依據，開頭有寫「這幾條是我依課堂內容整理的」，沒有冒充老師說法。第 5 條「挑得太少，準確率會掉」來自第 63 頁圖，老師沒有口頭講，文章也沒有歸給老師。

### 契約符合度

- 標題：zh「Language Agents 的推理、記憶、規劃與多代理｜台大陳縕儂 深度學習之應用 第 11 堂」、en「… | NTU Yun-Nung Chen Applied Deep Learning Lecture 11」，格式相符，兩語範圍一致。沒有跑 `check-course-titles.mjs`（未驗證）。
- 學習目標：zh L42、en L40，四項。
- 機制：各 H2 段都有。
- 完整範例：煮菜 ReAct（條件、推理、結果、意義齊備）、記憶檢索計分、規劃代價，三個都有條件、計算、結果與解讀，自編者有標「本文自編」。
- 常見誤解、自我檢查（六題皆附答案或判準）齊備。
- 查核歷程：正文只有開頭的版本提醒與文末「課程影片來源」的查核日期，屬契約允許的範圍。
- 「內容核對：已依字幕核對」：契約規定底本若是機器轉錄逐字稿要改寫成「講義與機器轉錄逐字稿」。這份檔名是 captions，STATUS.md 寫「有字幕者用 yt-dlp」，但我沒有獨立確認這一堂是字幕軌還是語音辨識（未驗證）。

### 中英對照

逐段比對，數字、頁碼、表格、程式區塊、六題自我檢查、五條誤解全部一致，沒有漏譯或誤譯。差異只有：英文版影片標題不帶中文副標並加註「taught in Mandarin」、第 12 頁例句加註「in Chinese」、glossary 沒有 aliases，都屬合理的在地化。講者點名見 S4。

### 粗體標記

兩個檔案都掃過，沒有 `**…（…）**` 後面直接接中文字，或 `**` 緊貼全形標點而無法渲染的寫法（`）。**` 之後都有空白；`**…**（` 的收尾前一字是文字或右括號，可正常渲染）。沒有實際看渲染後的頁面（未驗證）。

### 來源外、未驗證

- 五支影片長度（21:11、21:40、19:28、23:19、19:38）。字幕最後一個時間戳分別是 21:00、21:01、18:02、21:00、18:03，沒有矛盾，但不算驗證。
- 所有外部連結（課程頁、YouTube、arXiv、EMNLP tutorial）與站內連結。
- 「課程頁標為 Virtual」「最後一個附講義的堂次，之後三列只有標題」「影片 2025/11/10 上傳、說明欄 2024/12/04」「下一篇 Reasoning 只有影片沒有投影片」「存取分級 A2」。
