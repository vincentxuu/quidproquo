# 獨立審稿：CS329A 五篇客座場導讀（2026-10-13）

審稿者未參與撰寫。未修改任何文章。範圍：五篇 zh-TW 檔；英文版未審。
規格依據：`.agents/skills/post/references/course-guide-contract.md`「依角色教學」與「完成證據與防復發」第 3 項。
不評「用公開材料代替未公開場次」這個編輯決定。

判定用語：Confirmed／Wrong／Not in source／Unverifiable。行號為審稿當下檔案的行號，對應各節 sha256。

## 來源取得紀錄

| 來源 | 取得方式 | 結果 |
|---|---|---|
| cs329a.stanford.edu 課表 | curl | 取得 |
| arXiv 2312.11805（Gemini 1.0）全文 | curl arxiv.org/html | 取得 |
| arXiv 2507.06261（Gemini 2.5）全文 | curl arxiv.org/html | 取得 |
| Denny Zhou CS25 投影片 PDF | curl + pdftotext | 取得（公式是圖片，文字層沒有） |
| YouTube ebnX5Ur1hBk | yt-dlp 中繼資料 + en-US 字幕 | 取得（上傳日 2025-05-21，Stanford Online） |
| arXiv 2402.12875、2203.11171、2311.17311 摘要頁 | curl | 取得 |
| arXiv 2402.10200 | arxiv.org/html 無內容；改 r.jina.ai 讀摘要頁 | 取得摘要 |
| arXiv 2502.03544（AlphaGeometry2）全文 | curl arxiv.org/html | 取得 |
| Nature s41586-025-09833-y（AlphaProof） | curl | 取得全文 |
| DeepMind IMO 2025 公告 | curl | 取得 |
| ulisten.ai No Priors Ep.123 逐字稿 | curl 得 429；r.jina.ai 取得 | 取得，全文讀完（約 7.2 萬字元） |
| physicalintelligence.company 兩篇 | curl 429、r.jina.ai 被 Vercel checkpoint 擋、Firecrawl 額度用盡；Exa fetch 取得 | 取得 |
| arXiv 2505.23705 | curl arxiv.org/html | 取得（文章只列為參考，沒有引用其內容） |
| reflection.ai、lean-lang.org | curl | 取得；文章沒有靠它們支撐任何主張 |
| Melvin Johnson 的 LinkedIn | 文章沒給連結，未取得 | 見第 9 堂表格 |

所有算術另算一遍：0.9⁶=0.531441；4×7=28、5×7=35、6×7=42；94−74=20、94−49=45、94−31=63；50÷1=50、120÷1=120。全部正確。

中國用語掃描（視頻、數據、算法、代碼、優化、用戶、默認、質量、信息、軟件、網絡等）：五篇都沒有命中。

---

## 1. 第 9 堂 `2026-10-13-cs329a-session-09-post-training-agents.md`

(a) sha256：`5789ad6d8206fff749032a080433c62d6ada2182babac006a67f00729d7a79ea`

(b) 查核表

| 行 | 主張 | 判定 | 來源證據 |
|---|---|---|---|
| 18 | 第 9 堂、Melvin Johnson（Google DeepMind）、題目 | Confirmed | 課表：「9 / Mon Oct 20 / Guest Lecture Melvin Johnson (Google DeepMind) / Evolution of Post-training from Chatbots to Agents」 |
| 22 | 講者「依其 LinkedIn 自介是 Gemini 的 post-training 負責人」 | Unverifiable | 文章沒附連結，LinkedIn 未取得。兩份報告都不支持這個頭銜：Gemini 1.0 報告貢獻者名單寫「Melvin Johnson, Lead, Instruction Tuning」，同一份名單的「Overall Gemini Post-Training Lead」是 Slav Petrov |
| 22 | 列名於 Gemini 2.5 報告貢獻者名單 | Confirmed | 2507.06261 貢獻者名單有「Melvin Johnson」 |
| 26 | Gemini 1.0 §6.3 四階段：prompt、SFT、RM、RLHF | Confirmed | 「First, we collect a diverse set of prompts… Second, we apply supervised fine-tuning (SFT) on demonstration data… Third, we further collect different possible responses to a given prompt, and collect feedback data over these to train a Reward Model (RM). Finally… RLHF」 |
| 26 | 回饋是「請人比較」 | Confirmed（不完整） | 原文還有對單則回覆的回饋：「relative preferences over candidate responses and feedback regarding individual responses」 |
| 28 | 報告描述 RL 與 RM 的循環 | Confirmed（意譯偏鬆） | 「RL continually pushes the boundaries of the RM, while the RM is continuously improved through evaluation and data collection」。「RM 沒看過的地方」是文章的解讀，原文沒有這句 |
| 32 | 2.5 §2.4：RL 計算量增加、verifiable rewards 與 model-based generative rewards、演算法改動使長時間訓練更穩、可學多步動作與工具使用的環境 | Confirmed | §2.4 第二段逐項對應 |
| 34 | Thinking 用 RL 訓練、可設 thinking budget | Confirmed | §2.5：「trained with Reinforcement Learning to use additional compute at inference time」「ability to set a Thinking budget… trade off performance with cost」 |
| 34 | post-training 階段整理一批工程任務 | Confirmed，但章節沒列 | 出自 §2.6（Code）：「curated a diverse set of engineering tasks」。參考資料只列 2.4、2.5、5.3 |
| 34 | SWE-bench Verified 34.2% → 67.2% | Confirmed（漏條件） | §2.6 內文原句如此。Table 3 顯示這兩個數字是「multiple attempts」；single attempt 是 22.3% → 59.6% |
| 34 | RL\*F：Data Reward Model + Critic | Confirmed | §5.3：「a Data Reward Model (DRM), which amortizes human preference data, and a Critic, a prompted model that grades responses according to pre-defined rubrics」 |
| 44 | 兩份報告沒有公開環境數量、獎勵權重 | Confirmed（否定式，全文搜尋無相關數字） | — |
| 48 | 0.9⁶ ≈ 0.53 | Confirmed | 0.531441 |

沒有 Wrong 或 Not in source。

(c) 教學對齊

- 學習目標：L18「說出聊天時代與 Agent 時代的 post-training 各用什麼訊號當獎勵，並判斷一個任務該用哪一種」。有。
- 機制：L24–28（單則回覆偏好）、L30–34（多步結果）、L36–44（對照表，已標明是本文整理）。有，對齊。
- 完整例子：L46–52，已標「本文自擬」。條件（步數、每步 0.9、獨立）、計算、結果、意思都在，對齊目標。兩個瑕疵：
  - L48 列了四個動作（查訂單、確認資格、呼叫退款 API、寄確認信），卻寫「共六次工具呼叫」，另外兩次是什麼沒交代。
  - L50「大約一半的情況退款其實沒有成功」超出自己的模型：0.47 是六步任一步失敗的機率，包含寄信失敗，不等於退款沒成功；也沒說明失敗時 Agent 仍會寫出「已為您完成退款」。
- 自我檢查：L56、L58 兩題都有答案與理由，直接檢驗「判斷該用哪一種」。有，對齊。

(d) 必修項目（嚴重度由高到低）

1. L22 的 LinkedIn 頭銜沒有可查來源，且與 Gemini 1.0 報告的名單不一致。補上連結，或改用報告可證的寫法（1.0 報告：Lead, Instruction Tuning；2.5 報告：貢獻者）。
2. L34 SWE-bench 數字補上「multiple attempts」條件，或併列 single attempt 22.3% → 59.6%。
3. L48 四個動作對不上六次呼叫，補齊或改成四次（0.9⁴≈0.66）。L50 的「一半退款沒成功」改成「約 47% 的情況任務沒有完整完成」，並交代失敗時訊息為何仍然好看。
4. L70 參考資料補 §2.6。
5. L34「把人類偏好資料攤提進去的」讀者看不懂，改成「用人類偏好資料訓練出來的」。

---

## 2. 第 15 堂 `2026-10-13-cs329a-session-15-llm-reasoning.md`

(a) sha256：`8e981fa91e73e53edd9fee20edf28dc16cb7cbe19647fd7c48952d21025ac683`

(b) 查核表

| 行 | 主張 | 判定 | 來源證據 |
|---|---|---|---|
| 18 | 第 15 堂、Denny Zhou、題目「LLM Reasoning」 | Confirmed | 課表：「15 / Mon Nov 10 / Guest Lecture Denny Zhou, Google DeepMind / LLM Reasoning」 |
| 18 | 推理 = 輸入與輸出之間的中間 token | Confirmed | 投影片：「What is LLM Reasoning? Intermediate steps / tokens」 |
| 22 | CS25 講座日期 2025-04-29；另有公開錄影；相隔約半年 | Confirmed | 投影片首頁「Stanford, CS25: Transformers United V5, April 29, 2025」；YouTube 標題「Stanford CS25: V5 I Large Language Model Reasoning, Denny Zhou of Google Deepmind」，Stanford Online，上傳 2025-05-21；4/29 到 11/10 約 6.4 個月 |
| 26 | last-letter 例子 | Confirmed | 投影片原文一致 |
| 28 | 大小 T 的布林電路、固定大小 transformer、O(T) 中間 token；直接輸出要極大深度或解不了；Zhou 參與 | Confirmed | 投影片原句；「Joint work Li et al. … ICLR 2024」；arXiv 2402.12875 標題相符 |
| 32 | 錯誤信念；蘋果題；greedy 答「5 apples」；其他候選算出 8 | Confirmed | 投影片「Common Belief… WRONG」與蘋果題各候選 |
| 34 | 依對答案的信心挑選 = CoT decoding | Confirmed | 「Choose candidates which have the highest confidence on the final answer」；arXiv 2402.10200 摘要相符 |
| 40 | 提示法優缺點；「問人時不會先給例題」 | Confirmed | 「Pros and Cons of Prompting」兩頁 |
| 42 | SFT 通用但泛化差；「把資料量放大也幫助不大」 | Confirmed | 投影片只寫「Scaling does not help much」；錄影字幕補上是資料：「Scaling, scaling, scaling to get more data to train the model… no matter how you scale, it doesn't work」 |
| 44 | RL 微調步驟、第一原則、最佳化生成品質、可靠驗證器最關鍵、不是所有任務可自動驗證 | Confirmed | 投影片各頁原句。「不是像人」是文章的補語，投影片沒有這四個字 |
| 48 | 解碼目標與想要的不一致 → 邊際化 → self-consistency | Confirmed | 投影片「Not align! Let's fix it! Marginalization」；字幕：「sum over all reasoning paths… marginalization」 |
| 50 | 雞蛋題答案 18、26、18；選答案不選路徑；USC | Confirmed | 投影片三則回覆與「Most frequent answer is: 18 (Not most frequent reasoning path!)」；USC 頁 |
| 66 | 一致性高代表比較可能對 | Confirmed | 「Higher Consistency Indicates Higher Accuracy」 |
| 70 | 投影片留兩個問題 | Confirmed | [Q1]、[Q2] 原文 |
| 72 | 第一題答案「不需要」（標為本文推得） | Confirmed，且錄影有講者的回答 | 字幕：聽眾答「you can just get the probabilities」，講者「Yes, exactly… It's unnecessary. It's only useful for LLM reasoning」 |
| 74 | 第二題答案「不等價」（標為本文推得） | Unverifiable 為講者立場；作為本文推論已標示 | 字幕中講者沒有給是或否，只說「we just need to follow… max marginal inference. You just need to choose the final answer with the maximum probability」 |
| 76 | 四點總結 | Confirmed | Summary 頁 |
| 76 | 「下一步」是沒有唯一可驗證答案的任務 | Confirmed（只引一半） | 該頁有兩條，另一條是「Build real applications rather than solving benchmarks」 |

沒有 Wrong 或 Not in source。自擬內容（L54 例子、L70 答案）都有標示。

(c) 教學對齊

- 學習目標：L18「解釋中間 token 為什麼有用、SFT 與 RL 微調差在哪，並自己算一次 self-consistency」。有。
- 機制：L24–28（中間 token）、L30–34（解碼）、L36–44（提示／SFT／RL）、L46–50（邊際化）。有，對齊三項目標。
- 完整例子：L52–66，已標「本文自擬」。輸入（五次取樣表）、計數、結果（選 42）、意思（L66）齊全，對齊「自己算一次」。弱點在 L64：
  - 「先算單價再乘數量」被算成 3 次（第 1、3、5 次），但表裡第 3、5 次寫的是「…，漏掉折扣」，與第 1 次不是同一條路徑。依表格字面，最常見的路徑是「…漏掉折扣」（2 次），答案 48。結論相同，但文章的數法與自己的表不一致。
  - 這個例子真正示範的是邊際化（42 的機率分散在三條不同路徑上，48 集中在一條），文章卻解釋成「常見路徑裡有錯的」，沒有接回 L48 講的機制。
- 自我檢查：L70–74 兩題都有答案與理由，檢驗的是邊際化，對齊。L72 的理由嚴格說只在答案是單一 token 或能直接讀出各答案機率時成立；多 token 答案下 greedy 不保證取到機率最高的整串。

(d) 必修項目

1. L64 重寫計數：照表格字面，「先算單價再乘數量、漏掉折扣」出現 2 次是最常見的路徑，其餘三條各 1 次但都得 42；所以選路徑得 48、加總答案得 42。並用一句接回 L48 的邊際化。
2. L72 既然錄影字幕有講者對第一題的回答，改成引用錄影（講者同意「直接看機率」並說 self-consistency 在沒有推理時不必要），不必再寫「不是講者的原話」。L22 的「沒有逐句核對 CS25 錄影的字幕」相應調整。
3. L74 保留「本文推論」標示，並補一句講者在錄影中的實際說法（照 max marginal inference 選機率最高的答案），讓讀者知道講者沒有直接判定。
4. L72 理由加上條件（能直接取得各答案的機率時）。
5. L76「下一步」補上第二條，或寫明只引其中一條。

---

## 3. 第 16 堂 `2026-10-13-cs329a-session-16-superhuman-math-reasoning.md`

(a) sha256：`89dc03eaf065e305626357ee9cc1d416853f4555f89a0a15df95b8cc62da286c`

(b) 查核表

| 行 | 主張 | 判定 | 來源證據 |
|---|---|---|---|
| 18 | 第 16 堂、Thang Luong、題目 | Confirmed | 課表：「16 / Fri Nov 14 / Guest Lecture Thang Luong, Google DeepMind / Towards AI Superhuman Reasoning: AlphaProof, AlphaGeometry & Gemini IMO Gold Medal」 |
| 18 | 六題、滿分 42 | Confirmed | Nature：「28 out of 42 points」；公告：「six exceptionally difficult problems」「35 out of a possible 42」 |
| 22 | 講者是 AG2 共同作者；共同署名 IMO 2025 公告 | Confirmed | 2502.03544 作者列有 Thang Luong；公告署名「Thang Luong and Edward Lockhart」，2025-07-21 |
| 26–28 | LM 提議輔助構造、DDAR 推到封閉；合成資料由隨機圖形推導再回溯 | Confirmed | AG2 §4：「we first run deduction closure on random diagrams, and "traceback" to obtain the minimal problem and minimal proof」 |
| 30 | 語言涵蓋率 66% → 88%（IMO 2000–2024 幾何題） | Confirmed | 摘要與 §2 原句 |
| 30 | 解題率 54% → 84% | Confirmed | 「solving rate of 84%… compared to 54% achieved in AG1」 |
| 30 | greedy、不做樹搜尋，26 題需輔助構造者只解 2 題 | Confirmed | 「With the greedy decoding t = 0.0, k = 1, and no tree search, our models can solve only two problems out of 26 that require auxiliary constructions」 |
| 34–36 | Lean 逐步檢查；仿 AlphaZero；約 8,000 萬自動形式化題；test-time RL 用變體（簡化、推廣） | Confirmed | Fig.2 說明：「approximately 80 million formal problem dataset」；「synthetic problem variants (for example, simplifications or generalizations)」 |
| 38 | P4 交 AG2；其餘五題專家手動形式化；解出 P1、P2、P6；各 2–3 天 TTRL；P3、P5 未解 | Confirmed | Nature IMO 2024 段落逐句對應 |
| 38 | 28 分、銀牌區間、離金牌一分；P6 只有五位選手解出 | Confirmed | 「28 out of 42… silver-medal range… one point below the gold-medal threshold」；「P6, which was solved by only five human contestants」 |
| 42 | Deep Think 自然語言、4.5 小時內、六題解五題、35 分 | Confirmed | 公告原句 |
| 44 | 平行思考；新 RL 方法與多步推理／解題／定理證明資料；精選解答與一般提示 | Confirmed | 公告「Making the most of Deep Think mode」兩段 |
| 46 | 協調員用與學生相同標準評分；IMO 確認不含系統、流程、模型 | Confirmed | 「graded and certified by IMO coordinators using the same criteria」；附註「their review does not extend to validating our system, processes, or underlying model」 |
| 54 | AG2 多棵搜尋樹共享事實 | Confirmed | SKEST：「shared facts database」 |
| 57 | 4×7=28、5×7=35、6×7=42 | Confirmed | — |
| 59 | 公告說形式系統研究繼續、預期結合自然語言與形式驗證 | Confirmed | 「we also continue making progress on our formal systems… agents that combine natural language fluency with rigorous reasoning - including verified reasoning in formal languages」 |

沒有 Wrong 或 Not in source。事實面是五篇裡最乾淨的。

(c) 教學對齊

- 學習目標：L18「說明這三套系統各自由誰判定答案正確，並看出 2024 到 2025 之間改變的是哪一段」。有。
- 機制：L24–30、L32–38、L40–46 各一套系統，每節都交代驗證來源。有，對齊。
- 完整例子：L48–59，弱。它是一張比較表加三個乘法，不是走完一個案例：
  - 表格只是把前三節的結論重排，沒有任何一格是推出來的。
  - 唯一的計算（4×7=28）檢驗的是分數，不是學習目標要的「誰判定正確」。
  - 沒有一個具體題目從提議走到被驗證或被否決的過程。規格寫「模型名清單…不算」，這張表離清單只差一步。
  - 表格是本文的整理，但沒有像第 9 堂那樣標明「不是來源裡的原表」。
- 自我檢查：L63 有答案、理由，並標「本文的推論」。對齊「誰能判定」。有。

(d) 必修項目

1. L48–59 補一個真的走過一遍的例子。可用素材都在已引來源裡：IMO 2024 P1/P2/P6 的流程（Gemini 產生數百個候選答案 → AlphaProof 低算力反證淘汰錯的 → 對剩下的做 2–3 天 TTRL → Lean 最終檢查），或 AG2 的一個搜尋節點（提議輔助點 → DDAR 推封閉 → 目標在不在裡面 → 失敗時把事實寫進共享庫）。現有表格可留作收尾。
2. L50 表格前加一句標明是本文整理。
3. L44「指示裡加了解 IMO 題的一般提示」斷句有歧義（「加了／解」或「加／了解」），改成「並在指示裡加入解 IMO 題的一般提示」。

---

## 4. 第 18 堂 `2026-10-13-cs329a-session-18-autonomous-agentic-systems.md`

(a) sha256：`708ec6aabc7b03fbef86a3fe250fe4952171ecf8a35f7b0def27c07281189137`

(b) 查核表（逐字稿全文讀完）

| 行 | 主張 | 判定 | 來源證據 |
|---|---|---|---|
| 18 | 第 18 堂、Misha Laskin（Reflection AI）、題目；執行長 | Confirmed | 課表第 18 列；逐字稿標題「ReflectionAI Co-Founder and CEO Misha Laskin」 |
| 22 | No Priors 第 123 集、2025 年 7 月、早四個月；自動轉錄有錯字 | Confirmed | Published 2025-07-17；課表 Nov 21；逐字稿有「Misha Larkin」「QuadCode」「Groq4」 |
| 26 | Asimov 是程式碼研究 Agent，像大型 codebase 的 deep research | Confirmed | 「the best code research agent… feel almost like a deep research for large code bases」 |
| 26 | 企業生產力提升低於預期，有時為負 | Confirmed | 「much lower than people expect… sometimes negative, sometimes negligible」 |
| 28 | 工具 80% 生成／20% 理解；工程師相反；知識在聊天與專案管理工具 | Confirmed | 「80% code generation, 20% comprehension. The actual problem is exactly the opposite」；「it exists in your chats and project management tools」 |
| 30 | 工作慢五倍；基礎設施與研究團隊各一個 PR、都過測試、合起來 race condition；兩三位工程師花幾天；語意型查詢 | Confirmed | 「five times more slowly」「two different teams, kind of infrastructure and research team, submitted pull requests… passed the tests… effectively a race condition」「two or three engineers who spend a few days」「semantic queries」 |
| 34 | 評估是前沿實驗室最少談、可能最重要；新人上手要幾個月；上億 token codebase | Confirmed | 「the least spoken about part of what frontier labs do, but possibly the most important」「it takes months to onboard an engineer」「100 million tokens or something」 |
| 36 | 要能調整產品、Agent 設計、模型訓練；否則受制第三方模型 | Confirmed | 「tweak every part of the system… at the mercy of… general third-party models」 |
| 36 | 競賽程式題接近世界頂尖 | Confirmed | 「Codeforces and other competitive coding environments, the models are almost best in the world」 |
| 36 | 走進公司問有沒有幫上忙，「得到的回答卻是參差不齊」 | Not in source（作為 Laskin 的話） | 那句是主持人接的：Laskin「…And they say-」，Sarah Guo「"It's uneven," yeah.」，Laskin「Yeah (laughs)」。Laskin 只是附和 |
| 40 | 教系統 environment jobs 指什麼；團隊記憶的編輯與檢視權限 | Confirmed | 「when we say environment jobs… we mean… Google bat[ch] jobs」；「who can edit the memory? who can view different parts」 |
| 42 | 資深工程師守門人先填、再擴大；像 pull request；替知識做版本控制 | Confirmed | 「trusted, senior, staff level plus engineers who are kind of the gatekeepers… populate the memory first… then expand」「probably is gonna look something like a pull request」「versioning the meta knowledge around it」 |
| 46 | 在 Gemini 1 與 1.5 負責獎勵模型；有完美獎勵則簡單 RL 也能走很遠 | Confirmed | 「the thing that I led for Gemini was reward models… post-train Gemini 1 and 1.5」「even the very simple RL methods we have today will be able to get a lot out of this」 |
| 48 | 評分規準評審有一定效果但帶雜訊的獎勵會被鑽；有標準答案的少、靠泛化；受限於獎勵；不會有突破；驗證任何結果的模型大概是超級智慧 | Confirmed | 「LLM as judge with different rubrics… A noisy or stochastic reward inevitably gets hacked」「ground truth rewards, but there are not many of them」「reward-bound world」「I don't think there's gonna be any breakthrough」「that is probably a super intelligence」 |
| 50 | RL 方法不做細粒度 credit assignment；推理繞路 | Confirmed | 「take the things that work and make them happen more frequently…」「garden path meandering」 |
| 52 | 「沒有泛化，只有把測試分布帶進訓練」；自稱偏激 | Confirmed（語氣略強） | 「Maybe the hot take is that there's no such thing as generalization. There's just bringing the test distribution in to train」。說「aggressive take」的是主持人；他自己稱 hot take |
| 54 | 各大類別有自己的環境、工具、Agent，基礎模型要再 post-train；例子是 Codex 與 deep research 的模型 | Confirmed | 「every big category having a different environment… general base models… need to post-train」「the model that powers OpenAI's Codex is not the O series… The deep research models…」 |
| 54 | 藍圖幾年內成形，部署以十年計 | Confirmed | 「within the next couple of years, the blueprint… will have been set」「multi-decade thing」 |
| 68 | 落差「就是 Laskin 說要靠客戶導向的評估去盯的地方」 | Confirmed（意譯） | 「develop your evals based on what customers are saying and what they're doing」；「then it goes back to, again, evaluations」 |
| 74 | 他認為 RL 是通往超級智慧的路 | Confirmed | 「the final paradigm… is just figuring out how to scale reinforcement learning on top of large language models」 |

Wrong：無。Not in source：1 項（L36）。

(c) 教學對齊

- 學習目標：L18「說出他認為程式 Agent 缺的是哪一塊、為什麼他說這個領域受限於獎勵，並能判斷一個任務的獎勵訊號屬於哪一類」。有。
- 機制：L24–30（缺理解）、L32–36（評估）、L44–54（獎勵瓶頸）。有，對齊前兩項目標。L38–42 的團隊記憶不在學習目標內，屬補充。
- 完整例子：L56–68，已標「本文依他的分類自擬的練習，不是訪談內容」。輸入（三個任務）、推理（L66）、結果（表）、意思（L68）齊全，對齊第三項目標。一個歸因問題：Laskin 的分法只有兩類（帶雜訊的模型評審、有標準答案但數量少）；第三類「真實結果／客戶實際結果」是文章自己加的，「依他的分類」會讓讀者以為三類都出自他。
- 自我檢查：L72 有答案、理由與可操作的判準（持續抽查高分樣本、保留題），並標明是本文推得。對齊「為什麼受限於獎勵」。有。
- 跨篇不一致：本篇 L62、L66 說跑測試的獎勵「乾淨」，第 9 堂 L58 說同一種獎勵會被刪測試或寫死答案鑽過。兩篇同日發、同系列，讀者會對不上。

(d) 必修項目

1. L36 改寫歸因：「參差不齊」是主持人接的話，Laskin 附和。可寫成「主持人接話說『參差不齊』，他同意」。
2. L58 寫明前兩類取自訪談、第三類是本文加的。
3. L62／L66 的「獎勵乾淨」加一句限定（相對於模型評審而言；仍可能被刪測試這類手法繞過），與第 9 堂 L58 對齊。
4. L52「自稱偏激」改成「自稱 hot take」之類較貼近原話的寫法；說 aggressive 的是主持人。
5. L30「訓練用的環境工作」第一次出現時讀者不知道是什麼，要到 L40 才解釋。提前說明（environment jobs，他們內部對某類批次工作的稱呼）。

---

## 5. 第 19 堂 `2026-10-13-cs329a-session-19-robotics-vla.md`

(a) sha256：`50a92a0469fbd569539bdfa49c6fa6b802357988477c742252017dcce10affb7`

(b) 查核表

| 行 | 主張 | 判定 | 來源證據 |
|---|---|---|---|
| 18 | 第 19 堂、Danny Driess（Physical Intelligence）、題目 | Confirmed | 課表：「19 / Mon Dec 1 / Guest Lecture Danny Driess (Physical Intelligence) / Multimodal AI Agents in Robotics」 |
| 22 | KI 第一作者；π0.5 列名作者；日期 | Confirmed | KI 作者列首位 Danny Driess，2025-05-28；π0.5 作者列含 Danny Driess，2025-04-22 |
| 26 | 第一代（RT-2、OpenVLA）把關節角度分桶成 token；適合基本操作，不適合高頻精細動作，推論慢 | Confirmed | 「discretizing each robot arm joint angle into fixed-size bins and assigning a token to each one… not suitable for high-frequency, precise, or fluent motions… very slow at runtime」 |
| 28 | 第二代從 π0 起加 action expert、用 flow matching；大腦比喻 | Confirmed | 「second generation of VLAs, starting with π0… action experts… attend to the representations in the VLM backbone」；視覺皮質／前額葉／運動皮質比喻原文 |
| 32 | 梯度流回主幹 → 學得慢、流失知識；湯匙例子抓了垃圾 | Confirmed（譯名不準） | 「much slower learning, but also causes the VLM backbone to lose some of the knowledge」「instructed to put the spoon into the dish container… grasps the trash instead」。dish container 譯成「餐具盒」不準，是收碗盤的容器 |
| 34 | π0-FAST 沒有此問題但推論慢；影片對照 | Confirmed | 「autoregressive VLAs such as π0-FAST do not have this issue but… much slower」「only just starts to perform the task by the time… has already finished」 |
| 40 | 停梯度；只做這步不夠；摺衣實驗凍結主幹無法完成 | Confirmed | 「this approach alone is not sufficient」；圖說「Freezing the backbone as a knowledge insulation method is not possible for this task」 |
| 42 | 主幹預測 FAST 離散動作 token 當表示學習目標；訓練後丟棄 | Confirmed | 「use π0-FAST tokens as a representation learning objective」「the discretized actions are discarded」 |
| 44 | 同時訓練一般 VLM 資料與高階機器人指令 | Confirmed | 「general vision-language data from the web and high-level robot commands」 |
| 46 | bussing 任務訓練步數為 π0 的 1/7.5；推論與 π0 一樣快；3B／300M | Confirmed | 「requires 7.5 times less training steps than π0」「same fast inference speed as π0」「VLM Backbone (3B)」「Action Expert (300M)」 |
| 50 | π0.5 目標：沒見過的住家；異質資料共同訓練四類 | Confirmed | 「co-training on heterogeneous data」及其後段落 |
| 52 | 先輸出文字高階動作再輸出 50 步、1 秒 action chunk；像 chain-of-thought；同一個模型 | Confirmed | 「50-step (1-second) "action chunk"」「the same model is used for both… in a kind of "chain of thought" process」 |
| 54 | 限制；未來可利用自主經驗 | Confirmed | 「does not always succeed on the first try」「often makes mistakes both in terms of its high-level semantic deductions and motor commands」「could also in the future utilize their autonomous experience」 |
| 60–65 | OOD 成功率 94／74／49／31；no WD、no CE、no ME 的定義 | Confirmed | 「OOD Success Rate — π0.5: 94%, no WD: 74%, no CE: 49%, no ME: 31%」及各版本定義 |
| 67 | 20、45、63 個百分點 | Confirmed | — |
| 69 | 分布內拿掉網路資料幾乎沒差，83% 對 82% | Confirmed | 「In-distribution Success Rate — π0.5: 83%, no WD: 82%」 |
| 69 | 「其中機器人自己的多環境資料影響最大」 | 數字推得出，但與來源自己的說法相反，且措辭易誤讀 | 圖說：「Web data (WD) makes the biggest difference for generalizing to out-of-distribution objects, while data from other robots (ME and CE) is important across all evaluation conditions.」另外 ME 是「collected with non-mobile robots (e.g., static robots placed into many other homes)」，不是受測機器人自己的資料；L65 的列名寫對了，L69 卻寫成「機器人自己的」 |
| 71 | 約 100 個訓練環境時接近直接在測試環境訓練的對照 | Confirmed | 「after only about 100 training environments, it actually approaches the performance of the baseline model that was trained on test environment directly」 |
| 75 | 50 Hz；120 次；「兩倍」取自自迴歸模型完成同任務花兩倍時間 | Confirmed（已標為簡化假設） | KI 圖說：「An autoregressive VLA (π0-FAST) requires twice the amount of time to solve the task」。原文是完成任務的時間兩倍，不是單次推論時間兩倍；文章自己承認是借用 |
| 77 | 「兩篇文章測的是特定幾類清理任務」 | Wrong（對 KI 一文） | KI 一文的實驗是 shirt-folding、items-in-drawer、bussing，摺衣不是清理任務。圖說：「Performance on "shirt-folding" task」 |

Wrong：1 項（L77，輕微）。Not in source：無。L69 是與來源圖說衝突的自家解讀，未交代衝突。

(c) 教學對齊

- 學習目標：L18「說明 VLA 模型怎麼從語言模型長出動作輸出、訓練時會出什麼問題，並能讀懂一張資料消融表」。有。
- 機制：L24–28（動作輸出）、L30–34（梯度問題）、L36–46（解法）、L48–54（π0.5）。有，對齊前兩項。
- 完整例子：L56–71。輸入（來源的 OOD 成功率表）、計算（三個差值）、結果、意思都有，對齊「讀懂消融表」。這是五篇裡唯一用來源真實數字做的例子。問題在 L69 的解讀（見上表）：依規格「來源衝突若會改變…結論，在相關段落保留」，這裡文章的結論與圖說的講法不同卻沒提。兩者其實可以並存：以 OOD 成功率的絕對降幅算，ME 最大；以「只在 OOD 才出現差距」算，是 WD（分布內 83 對 82，OOD 94 對 74）。文章 L69 後半已經講了後者，只差把圖說講出來。
- 自我檢查：L75 有答案，並標「本文自擬」。弱：
  - 檢驗的是動作區塊與推論節奏，三項學習目標（動作怎麼輸出、梯度問題、讀消融表）一項都沒檢驗到。
  - 答案「每個區塊的等待時間加倍」只是把題目的假設重說一次，沒有需要推的東西。
  - 「兩倍」是把完成任務的時間換成單次推論時間，雖有聲明，仍是站不住的借用。

(d) 必修項目

1. L69 改掉「機器人自己的多環境資料」：ME 是別種（非行動）機器人在其他住家收的資料。並寫出來源圖說的講法與本文算法的差別，不要只留自己的結論。
2. L75 換一題真的檢驗學習目標的自我檢查。現成材料：給讀者 OOD follow rate 那一列（94／80／67／33）要他自己算降幅並判斷哪種資料影響指令遵循最多；或問「只停梯度、不加 FAST token 目標會怎樣」，答案在 L40。
3. L77「兩篇文章測的是特定幾類清理任務」改正：KI 一文測的是摺衣、收進抽屜、收拾餐桌。同句「成功率有明確的失敗案例」語意不通，改成「文章附了失敗的錄影」。
4. L32「餐具盒」改成「碗盤收納盒」之類對得上 dish container 的詞。
5. L46「π0 的七點五分之一」不好讀，改成「π0 要多花 7.5 倍的訓練步數」。

---

## 總評

| 文章 | 事實 | 教學 | 結論 |
|---|---|---|---|
| 第 9 堂 | 無 Wrong；1 項頭銜無來源、1 個數字漏條件 | 例子完整但內部數字對不上 | pass after listed fixes |
| 第 15 堂 | 全部 Confirmed | 例子完整，計數說明與自己的表不一致 | pass after listed fixes |
| 第 16 堂 | 全部 Confirmed | 「完整例子」只是比較表加乘法，不算走完一個案例 | pass after listed fixes（第 1 項是實質補寫，不是修字） |
| 第 18 堂 | 1 項 Not in source（主持人的話算到講者頭上） | 例子與自我檢查都到位 | pass after listed fixes |
| 第 19 堂 | 1 項 Wrong（輕微）；1 處與來源圖說衝突未交代 | 例子好；自我檢查沒有檢驗任何一項學習目標 | pass after listed fixes |

沒有一篇需要整篇重寫。五篇都把自擬例子與推論標示出來，沒有發現把自擬內容寫成講者原話的情況；唯一的歸因錯誤是第 18 堂 L36。修改後 sha256 會變，依規格第 3 項需要複審才能宣稱通過。

---

## 複審 2026-10-13

複審者未參與撰寫，也沒有修改任何文章。範圍：五篇 zh-TW 檔與對應的 `-en.md`。行號為複審當下檔案的行號，對應各節 sha256；zh 與 en 兩檔行號一一對應（五組都是同樣的行數與段落位置）。

狀態用語：Resolved／Partly resolved／Not resolved／Declined。新增文字的判定沿用 Confirmed／Wrong／Not in source／Unverifiable。

### 本次來源取得紀錄

| 來源 | 取得方式 | 結果 |
|---|---|---|
| arXiv 2507.06261（Gemini 2.5）全文 | 讀 scratchpad 既有的 arxiv.org/html 副本 | 取得；重讀 §2.6、§3 評測說明、Table 3、Figure 5 圖說 |
| arXiv 2502.03544（AlphaGeometry2）§3.1 | 讀 scratchpad 既有副本（純文字與原始 HTML 都對過） | 取得 |
| YouTube ebnX5Ur1hBk 字幕 | 沒有重新向 YouTube 抓；用指定的 `cs25/ebnX5Ur1hBk.en-orig.vtt` 副本，讀第 40:00–53:00 | 取得 |
| physicalintelligence.company 兩篇 | Exa fetch（各取全文） | 取得 |
| ulisten.ai No Priors Ep.123 逐字稿 | 讀 scratchpad 既有副本，只重查本次改動涉及的段落 | 取得 |

算術重算：1−0.9⁶=0.468559≈47%；五次取樣 42×3、48×2，路徑次數 1／1／2／1（「漏掉折扣」2 次）；94−74=20、94−49=45、94−31=63；50÷1=50、120÷1=120；4×7=28、5×7=35、6×7=42。全部正確。

五個英文檔第 22 行都寫「the speakers' personal sites」（複數所有格），中文是「講者的個人網站」。這是共用樣板句的筆誤，不影響事實，以下各篇不再重複列。

---

### 複審 1. 第 9 堂

sha256
- zh：`12c8409fdfcff7474190cfa4002580a5a607d60c486f44e73b680bfa7e2f8aee`
- en：`14d2f8f67070cdd07d029d04faef4f8f7f4637e641315529dabccdbab6ef4459`

(a) 逐項狀態

| # | 原必修項目 | 狀態 | 現行文字（zh 行號） |
|---|---|---|---|
| 1 | LinkedIn 頭銜無來源 | Resolved（整句刪除） | L22：「講者列名於 Gemini 2.5 報告的貢獻者名單。」LinkedIn 頭銜已不存在，只剩報告可證的說法 |
| 2 | SWE-bench 補 multiple attempts 條件 | Resolved | L34：「報告列出 SWE-bench Verified 從 Gemini 1.5 Pro 的 34.2% 升到 Gemini 2.5 Pro 的 67.2%，兩個數字都是允許多次嘗試的設定。」 |
| 3 | 四個動作對不上六次；「一半退款沒成功」 | Resolved | L48：「查訂單、查付款紀錄、確認退款資格、呼叫退款 API、更新訂單狀態、寄確認信，共六次工具呼叫」；L50：「約 47% 的情況這六步並沒有全部做對；Agent 沒發現中間某一步失敗時，照樣會寫出這則訊息」 |
| 4 | 參考資料補 §2.6 | Resolved | L70：「（第 2.4、2.5、2.6、5.3 節）」 |
| 5 | 「攤提」改寫 | Resolved | L34：「一個是用人類偏好資料訓練出來的 Data Reward Model」 |

(b) 新增文字查核

| 行 | 主張 | 判定 | 來源證據 |
|---|---|---|---|
| L34 | 34.2% 與 67.2% 都是 multiple attempts 設定 | Confirmed | Table 3 的「SWE-bench Verified／multiple attempts」列：1.5 Pro 34.2%、2.5 Pro 67.2%；single attempt 列是 22.3%、59.6%。Figure 5 圖說：「SWE-bench verified numbers correspond to the "multiple attempts" setting reported in Table 3」 |
| L34 | 「允許多次嘗試」這個說法 | Confirmed（措辭會讓人想錯） | 報告的定義不是對評分器交很多次：「a scaffold that samples multiple agentic traces and re-reranks them before evaluation using Gemini's own judgement」。評分前由 Gemini 自己從多條軌跡挑一條。現行寫法是照標籤直譯，讀者容易讀成「可以重交」。非必修，建議改成「取樣多條軌跡、由模型自己挑一條再評分的設定」 |
| L48–50 | 六個動作、0.9⁶≈0.53、約 47% | Confirmed | 自擬例子，內部一致 |
| L70 | §2.6 | Confirmed | §2.6 標題「Capability-specific improvements」，其下 Code 小節有「curated a diverse set of engineering tasks」與 34.2%→67.2% |

沒有 Wrong 或 Not in source。

(c) zh／en 差異

| 行 | zh | en | 說明 |
|---|---|---|---|
| L34 | 「使用者可以設定 thinking budget 換取成本」 | 「users can set a thinking budget to trade performance against cost」 | zh 少了「效能」，句子本身也不通（「換取成本」）。來源：「trade off performance with cost」。改成「在效能與成本之間取捨」 |
| L34 | 「依照事先寫好的評分規準打分的 Critic 模型」 | 「a Critic, a prompted model that grades responses against predefined rubrics」 | en 有「prompted model」，zh 沒有。小差異 |

數字、歸因、聲明（L22、L44、L48 的自擬標示）兩邊一致。

(d) 結論：**pass**。五項全部解決，新增文字沒有錯。上面兩處 zh 措辭與 L34 的「允許多次嘗試」屬建議修正，不擋通過。

---

### 複審 2. 第 15 堂

sha256
- zh：`984bf16f8c1efdf87c620d434a7cb5132666ec647109cda9a7954be999aa5027`
- en：`cefa538aff2e3da83550f3badada3ffa8ca44246f16621fee9e5f3044a3afc6d`

(a) 逐項狀態

| # | 原必修項目 | 狀態 | 現行文字（zh 行號） |
|---|---|---|---|
| 1 | L64 計數與表不一致、沒接回邊際化 | Resolved | L64：「答對的三次各走一條不同的路徑，每條只出現 1 次；『先算單價再乘數量，漏掉折扣』這條路徑卻出現 2 次（第 3、5 次），是最常見的一條，於是選到 48。按答案加總次數，才是前面說的邊際化。」 |
| 2 | 第一題改引錄影；L22 相應調整 | Resolved | L72：「現場有聽眾回答可以直接看機率，講者同意，並說這就像傳統機器學習直接取機率最大的輸出，所以 self-consistency 只在有推理時才用得上。」L22：「另對照了錄影中 self-consistency 一段的自動字幕（約第 41–51 分鐘），其餘段落沒有逐句核對」 |
| 3 | 第二題補講者實際說法、保留本文推論標示 | Resolved | L74：「講者沒有直接判定，只說可以試，並要聽眾回到同一個原則：選機率最高的最終答案。**本文的推論是不等價。**」 |
| 4 | 第一題理由加條件 | Resolved | L72：「前提是你拿得到各個答案的機率。」 |
| 5 | 「下一步」補第二條 | Resolved | L76：「它列的下一步有兩項：處理沒有唯一可驗證答案的任務，以及做出真正的應用，而不只是解 benchmark。」 |

(b) 新增文字查核（字幕時間為 vtt 的 cue 起點）

| 行 | 主張 | 判定 | 來源證據 |
|---|---|---|---|
| L70 | 兩題的回應在約第 48–50 分鐘 | Confirmed | 第一題 48:14 起，第二題 49:27 起，講到 50:28 |
| L72 | 聽眾答可以直接看機率，講者同意 | Confirmed | 48:43–48:52：「you can just get probabilities.」「Exactly. Yes. Exactly.」 |
| L72 | 像傳統機器學習直接取機率最大的輸出 | Confirmed | 48:52–49:04：「exactly what we did in the classical machine learning… logistic regression to get a p y given x we just need to maximize the probability there」 |
| L72 | self-consistency 只在有推理時才用得上 | Confirmed | 49:15–49:25：「unnecessary it's only useful for reasoning… after we of reasoning and then we need self-consistency」 |
| L72 | 「前提是你拿得到各個答案的機率」 | 本文補充，不是講者的話 | L70 已交代「再補本文的說明」，可接受 |
| L74 | 講者只說可以試 | Confirmed | 49:51–49:55：「there actually we can try that」 |
| L74 | 要聽眾回到「選機率最高的最終答案」 | Confirmed | 49:59–50:17：「we just need to follow the machine learning principle… max marginal inference. You just need to choose the final answer with maximum probability. That's all we need to know」 |
| L74 | 講者沒有直接判定 | Confirmed | 49:27–50:28 之間沒有 yes 或 no |
| L22 | self-consistency 段約第 41–51 分鐘 | Confirmed | 40:58 開始談解碼目標，51:24 轉到 retrieval |
| L64 | 新的計數 | Confirmed | 與 L56–62 的表逐列一致 |

沒有 Wrong 或 Not in source。

(c) zh／en 差異：逐段比對，沒有事實、數字、歸因或聲明上的差異。

(d) 結論：**pass**。

---

### 複審 3. 第 16 堂

sha256
- zh：`107758570c5b0c2b4a68d2bb982aab4a65e204c0084c80b008c7ceb08bdf4ec7`
- en：`f35bb0cd1766fb65c032d6d876ba505f09488ec55d0bef0bcbea6a9bd7e47ab8`

(a) 逐項狀態

| # | 原必修項目 | 狀態 | 現行文字（zh 行號） |
|---|---|---|---|
| 1 | 補一個真的走過一遍的例子 | Resolved（見 (b) 的兩個瑕疵） | L48–58 新增「AlphaGeometry2 怎麼證一個點在圓上」，有條件（L52）、四步推理（L54）、結果（L56）、意思（L58）；原表格移到 L60–73 當收尾 |
| 2 | 表格前標明是本文整理 | Resolved | L62：「下表是本文依三份文件整理的對照。」 |
| 3 | L44 斷句歧義 | Resolved | L44：「並在指示裡加入解 IMO 題的一般提示」 |

(b) 新增文字查核（AG2 §3.1 "Handling double points"）

| 行 | 主張 | 判定 | 來源證據 |
|---|---|---|---|
| L50 | 例子出自論文對重合點的說明 | Confirmed | §3.1：「imagine a problem where we intersect two lines a, b at a point X, and intend to prove that X lies on a certain circle ω」 |
| L52 | 直接證很難，「因為引擎手上關於 X 的事實都和兩條線有關，和圓無關」 | Not in source | 論文沒有這個理由。它只說換個方向證比較容易：「This is equivalent, yet can be much easier to prove because we can move angles on the circle」。論文在這一節講的缺口是另一件事：DDAR1「is unable to accept two points with different names and the same coordinates」。L52 的理由是本文自己的解釋，卻接在「這個例子出自論文」之後，讀起來像論文的說法 |
| L54 第一步 | 語言模型提議 X′ 為 a 與 ω 的交點，此時不知是否與 X 重合 | Confirmed | 「Construct a new point X′ as the intersection of a, ω (we don't know yet that X′ coincides with X). This is an auxiliary construction that must be predicted by a language model.」 |
| L54 第二步 | 「符號引擎證明 X′ 也在直線 b 上」 | 邏輯正確，但與論文印出的字不同，且沒交代 | 論文第二步印的是「Prove that X lies on b」（原始 HTML 的 MathML 也是 X，沒有撇號）。照字面那是已知條件，顯然是論文的筆誤；前一句「we prove that the intersection of a, ω lies on b」支持文章的 X′ 讀法。文章默默改正了來源，應加一句說明。另外「由符號引擎證明」是從本節談 DDAR 推得，論文沒有逐步寫出執行者 |
| L54 第二步 | 可以利用圓上的角度關係，所以比原題容易 | Confirmed | 「can be much easier to prove because we can move angles on the circle」 |
| L54 第三步 | X 與 X′ 都在 a、b 上，所以是同一點 | Confirmed | 「Since both X and X′ lie on both, a, b, we conclude X = X′」。「兩條線只有一個交點」是文章補的理由，正確 |
| L54 第四步 | 因此 X 在 ω 上 | Confirmed | 「Consequently X lies on ω」 |
| L58 | 第二到第四步「每個推論都由引擎依規則檢查」；沒用的點會讓嘗試作廢 | 本文推論，與論文一致 | 論文只明寫第一步「must be predicted by a language model」。其餘歸給引擎是合理推論，與 L26–28 已查核過的分工一致 |

Wrong：無。Not in source：1 項（L52 的理由）。

(c) zh／en 差異：逐段比對，沒有差異。新例子（L48–58）兩邊步驟、歸因、結論完全對應；en 的 L52、L54 帶有同樣兩個瑕疵。

(d) 教學對齊複評

原報告認定「完整例子」只是比較表加乘法。現在的 L48–58 走完了一次「提議 → 引擎驗證 → 得證」，條件、推理、結果、意思四項齊全，L58 直接回到學習目標的「誰判定正確」。算是補上了。

還是有兩點不足，如實記錄：
- 它是論文自己的示意情境（「imagine a problem」），不是一道具體題目，沒有任何實際的角或點可以跟著算。讀者驗證不了第二步，只能相信「比較容易」。
- 「提議被否決」的那條路只有 L58 一句敘述，沒有示範一個沒用的輔助點長什麼樣。

以現有公開來源而言，這是做得到的程度，不要求再補。

(e) 結論：**pass after listed fixes**（兩項，都是一句話的事，zh 與 en 同步改）
1. L52：把「因為引擎手上關於 X 的事實都和兩條線有關，和圓無關」標為本文的解釋，或換成論文的說法（反過來證比較容易，因為可以利用圓上的角度關係；前一代引擎不接受兩個不同名字的點座標相同）。
2. L54 第二步：加一句交代論文原文印的是「X lies on b」，本文依前一句的敘述讀作 X′。

---

### 複審 4. 第 18 堂

sha256
- zh：`6981689cc67751c647d040b5ff731b40f1fac1c8fe335842bb977dad244e2159`
- en：`c0cc1301738a3f3ea97c59b32b0d5d8271bb841005296f2b8414281c83f637d4`

(a) 逐項狀態

| # | 原必修項目 | 狀態 | 現行文字（zh 行號） |
|---|---|---|---|
| 1 | 「參差不齊」歸因 | Resolved | L36：「答案並不一致；主持人接話說是參差不齊，他表示同意。」 |
| 2 | 寫明第三類是本文加的 | Resolved | L58：「『有標準答案』與『帶雜訊』兩類是他在訪談中的區分，第三類『真實結果』是本文依他談客戶導向評估的段落加上的。」 |
| 3 | 「獎勵乾淨」加限定，與第 9 堂對齊 | Resolved | L66：「獎勵比模型評審乾淨；但它仍可能被刪掉測試這類手法繞過，要另外檢查。」與第 9 堂 L58 說法一致 |
| 4 | 「自稱偏激」 | Resolved | L52：「他講了一句自稱 hot take 的話」 |
| 5 | environment jobs 提前說明 | Resolved | L30：「他們內部稱為 environment jobs 的一類訓練用批次工作，突然慢了五倍。」 |

(b) 新增文字查核

| 行 | 主張 | 判定 | 來源證據 |
|---|---|---|---|
| L30 | environment jobs 是內部稱呼，指一類批次工作；慢的就是這類工作 | Confirmed | 「when this was happening that our kind of environment jobs were slowing down」；「when we say environment jobs as in our team, we mean this specific thing, which we mean kind of Google bat jobs」。「訓練用」取自前文「when you're training these models, there's a lot of infrastructure work」，合理 |
| L36 | 主持人接話、他同意 | Confirmed | Laskin：「And they say-」；Sarah Guo：「"It's uneven," yeah.」；Laskin：「Yeah (laughs).」「答案並不一致」是文章替被打斷的那句補的話，後半句已交代是主持人的用詞 |
| L52 | 自稱 hot take | Confirmed | 「Maybe the hot take is that there's no such thing as generalization. There's just bringing the test distribution in to train.」 |
| L58、L66 | 分類歸屬與限定 | 本文標示，無需來源 | — |

沒有 Wrong 或 Not in source。

(c) zh／en 差異：逐段比對，沒有差異。L72 的答案 zh「不能直接放心」、en「not without further safeguards」，意思相同。

(d) 結論：**pass**。

---

### 複審 5. 第 19 堂

sha256
- zh：`c9e20b754c0b72550fc4918a77375dbedac823a61cd035d6d6a24d02d16e42e5`
- en：`28f1d45e368c8ed0586429e1a709ed7736ceeba5896e04193646eb1e2ced520f`

(a) 逐項狀態

| # | 原必修項目 | 狀態 | 現行文字（zh 行號） |
|---|---|---|---|
| 1 | ME 不是「機器人自己的」資料；交代圖說與本文算法的差別 | Resolved | L69：「這批資料來自放進許多不同住家的固定式機器人，不是受測的行動機器人自己收集的。文章圖說強調的則是另一個對比：網路資料對辨認沒見過的物件類別影響最大，其他機器人的資料在所有條件下都重要。兩種說法看的是不同的比較，並不衝突」 |
| 2 | 換一題檢驗學習目標的自我檢查 | Resolved（新題加在前面，舊題保留） | L75：「如果只停止動作專家到主幹的梯度，其他什麼都不加，會發生什麼事？**答案：主幹的語言能力保住了，但動作會做不好。**」舊的動作區塊題留在 L77 |
| 3 | 「清理任務」改正；「成功率有明確的失敗案例」語意不通 | Partly resolved | L79：「兩篇文章測的是摺衣、收拾餐桌、把物品放進抽屜與居家清理這幾類任務，也都列出了失敗的案例。」任務清單改對了。後半句對 KI 一文仍然說過頭，見 (b) |
| 4 | 「餐具盒」 | Resolved | L32：「把湯匙放進碗盤收納盒」 |
| 5 | 「七點五分之一」 | Resolved | L46：「π0 要多花到 7.5 倍的訓練步數才追得上新方法」 |

(b) 新增文字查核

| 行 | 主張 | 判定 | 來源證據 |
|---|---|---|---|
| L69 | ME 資料來自放進許多住家的固定式機器人 | Confirmed | π0.5：「the "no ME" version excludes Multiple Environment data collected with non-mobile robots (e.g., static robots placed into many other homes)」 |
| L69 | 圖說：網路資料對沒見過的物件影響最大，其他機器人的資料在所有條件下都重要 | Confirmed | 「Web data (WD) makes the biggest difference for generalizing to out-of-distribution objects, while data from other robots (ME and CE) is important across all evaluation conditions.」內文：「greatly improves the robot's ability to correctly identify new object categories」 |
| L69 | 83% 對 82%；OOD 才掉 20 個百分點 | Confirmed | In-distribution Success Rate：π0.5 83%、no WD 82%；OOD Success Rate：94%、74% |
| L69 | 「兩種說法…並不衝突」 | 本文的調和，沒有標示 | 圖說寫的是 WD「makes the biggest difference」，表上 OOD 掉最多的是 no ME。文章把圖說讀成「網路資料的影響在 OOD 條件最大」，說得通，但這是本文的讀法，句子寫成定論。建議加「本文的讀法是」。非必修 |
| L75 | 只停梯度時主幹不再從機器人資料收到訊號，表示不適合控制 | Confirmed | KI：「this approach alone is not sufficient. Since the VLM backbone no longer receives any gradients from the robot data, its representations are no longer adapted to the needs of robotic control, making it much harder for the action expert to generate correct motions」 |
| L75 | 「主幹的語言能力保住了」 | Confirmed | 「stop the gradient flow from the action expert to the VLM backbone, which fully insulates the VLM backbone」 |
| L75 | 摺衣實驗凍結主幹的版本無法完成任務 | Confirmed | 圖說：「Freezing the backbone as a knowledge insulation method is not possible for this task.」 |
| L75 | 所以另外預測 FAST 動作 token 提供訓練訊號 | Confirmed | 「To fix this, we train the VLM backbone with π0-FAST action tokens. This way, we equip the VLM backbone with representations for motor control」 |
| L46 | π0 要多花到 7.5 倍步數 | Confirmed | 「requires 7.5 times less training steps than π0」 |
| L79 | 任務清單 | Confirmed | KI：shirt-folding、items-in-drawer、bussing；π0.5：居家清理 |
| L79 | 兩篇「也都列出了失敗的案例」 | Not in source（對 KI 一文） | π0.5 有：「examples of successful and failed episodes of our model」。KI 一文沒有自家方法的失敗片段，只有對照組的失敗（naive 版本抓了垃圾、凍結主幹版本做不了）和不到滿分的成功率圖。這句放在反駁「家用機器人已經能用」的段落裡，讀者會理解成兩篇都展示了自家方法失敗，KI 一文不支持 |
| L77 | 50 Hz、120 次 | Confirmed（算術） | 「兩倍」的借用與原報告指出的一樣，聲明仍在 |

另發現一處原報告沒有列的問題（不是新增文字，兩個語言檔都有）：

| 行 | 主張 | 判定 | 來源證據 |
|---|---|---|---|
| L12（tldr） | 「π0.5 的作法是擋住梯度，並用網路資料與多種機器人資料一起訓練」；en：「π0.5 blocks the gradient and co-trains…」 | Not in source | 擋梯度是 knowledge insulation 的作法，對應的模型叫「π0.5 + KI」。KI 一文：「formalizes the method we used in our recent π0.5 model, and we extend it with a more refined single-stage training recipe that insulates the VLM backbone from the action expert」。π0.5 一文全文沒有提停梯度。內文 L38–40 歸屬寫對了，只有 tldr 把它算到 π0.5 頭上。tldr 會出現在列表頁與分享預覽，應改 |

Wrong：無。Not in source：2 項（L79 後半句、L12 tldr）。

(c) zh／en 差異

| 行 | zh | en | 說明 |
|---|---|---|---|
| L32 | 「主幹會流失預訓練得到的知識」 | 「the backbone loses some knowledge acquired in pretraining」 | zh 少了「部分」。來源：「lose some of the knowledge」。zh 讀起來像全部流失，應補「部分」 |

其餘逐段一致，包括 L69 的改寫、L75 的新自我檢查、L79 的任務清單（en 也帶同樣的「both show failure cases」問題）與 L12 的 tldr。

(d) 教學對齊複評

原報告認定自我檢查沒有檢驗任何一項學習目標。L75 的新題檢驗的是第二項目標「訓練時會出什麼問題」及其解法為什麼要有 FAST token 那一步，有答案、有理由、有來源實驗。對齊了。

如實記錄它的強度：答案幾乎逐字重複 L40（「主幹不再從機器人資料收到訊號，它的表示就不適合控制。文章的摺衣實驗裡，凍結主幹的版本無法完成任務。」），所以它是回想題，不是要讀者推出新東西的題目。唯一要推的是「語言能力保住了」這半句。原報告當初建議的就是這一題，算達標，不要求再改。

L77 的舊題仍然只是把假設重說一次，「兩倍」的借用也還在。它現在是第二題，不再是唯一的自我檢查，不擋通過。

(e) 結論：**pass after listed fixes**（三項，zh 與 en 同步改）
1. L12 tldr：「π0.5 的作法是擋住梯度」改成歸給 knowledge insulation（例如「knowledge insulation 擋住梯度，π0.5 則用網路資料與多種機器人資料一起訓練」）。
2. L79：「也都列出了失敗的案例」改成兩篇各自能證的說法（π0.5 一文附了失敗的錄影；KI 一文的成功率圖沒有一項是滿分）。
3. L32（只有 zh）：補「部分」。

---

### 複審總評

| 文章 | 原必修項目 | 新增文字 | zh／en | 結論 |
|---|---|---|---|---|
| 第 9 堂 | 5／5 Resolved | 無錯 | 2 處 zh 措辭較弱 | pass |
| 第 15 堂 | 5／5 Resolved | 字幕逐句對得上 | 無差異 | pass |
| 第 16 堂 | 3／3 Resolved | 1 項 Not in source（L52 理由）；1 處默默改正來源筆誤（L54） | 無差異 | pass after listed fixes |
| 第 18 堂 | 5／5 Resolved | 無錯 | 無差異 | pass |
| 第 19 堂 | 4 Resolved、1 Partly resolved（第 3 項） | 2 項 Not in source（L79、L12 tldr，後者原報告漏查） | 1 處 zh 漏「部分」 | pass after listed fixes |

沒有一項是 Not resolved 或 Declined，沒有 Wrong。沒有一篇需要重寫。第 16、19 堂剩下的都是一句話等級的修正，但改完 sha256 會再變，這兩篇要再看一次被改的那幾行才能宣稱通過。原報告沒有審 frontmatter；這次只在第 19 堂的 tldr 發現問題，其餘四篇的 description 與 tldr 與內文一致。
