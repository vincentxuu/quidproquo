# 批次 E-arena：人類偏好排行榜（Chatbot Arena／LMArena／Arena）

抽取日期：2026-11-23。全文本機副本在 scratchpad（`arena/*.txt`，由 arXiv HTML 轉純文字），session 結束後可能清除。

---

### Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference（2024）
- 網址：https://arxiv.org/html/2403.04132 （v1，2024-03-07；arXiv 只有 v1，ICML'24 收錄）
- 讀取狀態：✅
- 讀取紀錄：arXiv HTML 經 curl 轉純文字約 84,600 字元（1,118 行）；依序讀 1–681 行（摘要、§1–§9、參考文獻）、682–1,118 行（附錄 A–D：CI 模擬、非參數 BT、p 值證明、範例 prompt）。涵蓋全文。
- 類型：研究論文
- 研究設計或文件目的：介紹匿名雙盲對戰平台；收 2023-04 到 2024-01 約 24 萬票、9 萬使用者、50+ 模型；說明從成對比較到排名的統計方法（BT 係數、sandwich CI、近似排名、主動抽樣）、異常使用者偵測、prompt 多樣性分析、群眾票與專家標註一致率。
- 會被引用的結果：
  1. **BT 取代 Elo 的理由**（§4）：只有一句，「比較適合統計估計」。"previous evolutions of our online interface have reported different ranking scores, such as the Elo score (Elo, 1967) instead of the BT coefficients. We made this change because the BT coefficients are better for the purpose of statistical estimation." 補充：BT 是一次對全部票做（加權）最大概似估計，順序無關；即使 BT 的邏輯斯假設不成立，用 sandwich 共變異數仍漸近常態（Huber 1967; White 1982）。"maximum likelihood estimators are still asymptotically normal even when these assumptions do not hold, so long as the so-called “sandwich” covariance matrix is used"。附錄 B 給非參數 BT，聲稱在非二元回饋、不遞移勝率、模型設定錯誤時仍有效。
  2. **信賴區間怎麼算**（§5）：估計時用逆抽樣機率加權（目標是「對所有模型對均勻」的分數）；比較 pivot bootstrap 與 sandwich robust SE，選 sandwich："we choose to deploy the sandwich intervals due to their smaller size in large samples."（附錄 A：兩者肉眼幾乎相同，sandwich 小樣本較寬、大樣本較窄且穩定）。排名用同時信賴集（chi-square CLT 區間，多重比較校正）："R_m = 1 + Σ 1{inf C_m' > sup C_m}"，保證「高機率下沒有模型被低估」。§7.1 用 213,576 票重播：有無多重校正兩版區間都報，因為校正版「induces extra conservatism」。
  3. **主動抽樣**（§5 式 9、§7.1）：依「多抽這對能讓 CI 縮多少」比例抽樣。結果："To estimate θ* to a precision of 0.2, random needs 6,800 samples and adaptive needs 4,400 samples; meanwhile to estimate the score to a precision of 0.3, random needs 17,200 samples and adaptive needs 16,400 samples."→ 隨機抽樣多需 54%（勝率矩陣）與 5%（BT 分數）資料。
  4. **投票品質**（§6.3 表 3、表 4）：GPT-4-Turbo 對 Llama-2-13B、對 GPT-3.5-Turbo 各隨機抽 160 場，請 UC Berkeley 研究生盲審並查證事實（每筆 3–5 分鐘）。群眾 vs 專家一致率 72.8%／77.8%（對 Llama-2-13B）、73.8%／83.1%（對 GPT-3.5）；專家彼此 89.8%、79.4%。"we observe high agreement rates (72% to 83%) between Arena crowd-user and experts in both setup. Note that agreement rates between two experts are around similar levels (79.4% and 89.8%)." 落差 5–10% 歸因於群眾「making mistakes or overlooking factual errors」。表 4：GPT-4-Turbo 勝率群眾 81.2%／76.3%，專家 89.4%、86.9%／82.5%、89.4%——群眾給強模型的勝率較低。
  5. **異常使用者偵測**（§5.1、§7.2 表 5）：以歷史票分佈算 p 值、Fisher 合併，在 1–100 票間隨機 5 個時點檢定（隨機是為了防策略規避）。25 個人工挑出的異常使用者（如問「hi」100 次）＋25 個正常使用者：α=0.1 時預測陽性 13/14 為真，但 12 個異常者漏掉；作者稱 "reaching 90% true positive and 60-70% true negative rate"。
  6. **資料面**（§3.2）：77% 英文、5% 中文；3% 請求被 moderation 標記；以關鍵字過濾含模型名的對話以維持匿名。
  7. **prompt 能否分辨模型**（§6.2 表 2）：每群集 30 題、GPT-4-Turbo 當評審，GPT-4 對 Llama-2-70B 勝率從 96.7%（Python 遊戲）到 53.3%（電影推薦）。
- 作者自己列的限制（§8）："we anticipate that it will primarily consist of LLM hobbyists and researchers … This inclination may result in a biased distribution of users." 資料主要來自線上聊天介面，可能不反映正式環境或專業領域；只評 helpfulness，不評安全。異常偵測是「heuristic application」、只做小規模測試。
- 與摘要說法不一致處：
  - 摘要說群眾票與專家 "in good agreement"；正文只有 2 組模型對 × 160 場、兩位專家，且群眾 vs 專家（72.8–83.1%）低於專家彼此（79.4–89.8%），群眾系統性壓低強模型勝率。「good agreement」是在很小樣本上成立的說法。
  - 異常偵測「90% true positive」：依表 5（α=0.1），預測為異常的 14 人中 13 人為真（精確率約 93%），但 25 個真異常者只抓到 13 個（召回約 52%）。「true positive rate」用語與表格對不上。
  - 主動抽樣「sometimes to a large degree」：對最終排名用的 BT 分數只省 5% 資料，54% 是勝率矩陣。
- 反證或後續修正：The Leaderboard Illusion（2504.20879）指出 §5 的主動抽樣規則「we have not seen evidence of its deployment in the current leaderboard」，實際抽樣偏向頂尖／新模型（見下）；Arena 回應稱「The best models … are upsampled to improve the user experience」，等於承認抽樣不是照論文的式 9。Huang et al. 2025（2501.07493）、Min et al. 2025（2501.17858）示範匿名性可被打破與投票操弄。Arena 2025-07-23 改用「與出現頻率成反比」的重新加權＋閉式 CLT 區間（leaderboard changelog），取代 bootstrap。
- 對系列的用途：支撐「Arena 分數是什麼」：BT 係數（不是 Elo）、附同時信賴區間、名次是「區間不重疊才算贏」，以及群眾票品質約等於「略弱於專家」的證據規模很小。

---

### The Leaderboard Illusion（2025）
- 網址：https://arxiv.org/html/2504.20879 （讀 v2，2025-05-12；另以 https://arxiv.org/html/2504.20879v1 對照 v1 差異）
- 讀取狀態：✅
- 讀取紀錄：v2 轉純文字約 193,300 字元（3,550 行）。依序讀 1–400（摘要、§1–§4.2 前段）、400–700（§4.2–§9、參考文獻開頭）；參考文獻（700–1,097）略過；附錄 A–E（1,098–1,206 行）全讀；附錄 E 的表 2–5（1,207–3,344 行，多為模型代號與自我介紹回應）以長行篩出表頭與自述文字讀過，未逐格讀代號；附錄 F–M（3,345–3,550）全讀。另把 v1（約 185,400 字元）與 v2 做 diff，逐段讀差異。
- 類型：研究論文（作者主要來自 Cohere Labs，並有 Princeton、Stanford、MIT、AI2、UW 等；作者自陳其 Cohere 模型曾在 Arena 受抽樣不足，是研究動機）
- 研究設計或文件目的：稽核 2024-01 至 2025-04 的 Arena：合併約 2M 場對戰、243 模型、42 家供應商；資料來源包括公開 battle 資料、Cohere 依 20% 政策取得的自家對戰（43,729 場）、Cohere API 收到的 Arena prompt（197,217 筆單輪）、HF 排行榜 commit 歷史（14.3K 筆）、自行爬取的 5,864 場隨機對戰（2025-01～03，先問「Who are you?」讓該場作廢，再只投平手）。另做模擬、真實提交實驗、微調實驗。
- 會被引用的結果：
  1. **私下測試多變體再挑最佳**（§3.1、圖 6）：2025-01～03 主榜 Meta 有 27 個私測變體、Google 10 個；加 vision 榜 Meta 共 43 個。"In a single month, we observe as many as 27 models from Meta being tested privately on Chatbot Arena in the lead up to llama 4 release." 共辨識 64 個私測模型屬 10 家，另 14 個無法辨識（附錄 E.1）。作者承認歸屬靠模型自報身分，可能誤判（§7）。
  2. **best-of-N 的偏誤**：附錄 C 證明取 N 個有雜訊估計的最大值必然高估（E[max] > E[單一]，iff Var>0）。模擬（§3.2、圖 7、附錄 I）：v2 正文 "testing just 20 variants yields a notable increase of approximately 50 points"；附錄 I：相同 checkpoint、每個 3,000 票時偏誤 = σ_noise·√(2 ln N)，σ_noise=6.34，N=50 時 ≈17.7 分，且票數→∞ 時趨近 0；不同 checkpoint（σ_true=20）N=50 時 ≈56 分，且 "Selection bias does not vanish"。
  3. **真實實驗**（§3.3、圖 9）：同一個 Aya-Vision-8B 提交兩次，得 1052（±21/22）與 1069（±19/23），中間夾 4 個模型；兩個不同 Aya-Vision-32B 變體 1097（±29/25）vs 1059（±18/23），夾 9 個模型。
  4. **資料取得不對稱**（§1、§4.1、圖 4、附錄 G）：以各家參與對戰比例估計「拿到的 prompt 份額」：OpenAI 20.4%、Google 19.2%；OpenAI+Google+Meta+Anthropic 合計 62.8%，"68 times more than the combined share of top academic and non-profit labs like Allen AI, Stanford, Princeton, and UC Berkeley"；41 個完全開源模型合計 8.9%（v1 寫 8.8%）；83 個 open-weight 合計 29.7%；專有供應商合計 61.4%。最大日抽樣率 Google／OpenAI 34%、xAI 22.0%、Meta 17.9%、Reka 3.3%（表 5，2025-01～03 爬取樣本）。自家 API 託管者拿到 100% prompt，第三方託管者只能申請 20%。Cohere 自己 1 個變體拿到 5.9% prompt，3 個變體時 19.4%。
  5. **下架不對等**（§5、附錄 K）：243 個公開模型中 205 個「靜默下架」（2025-03-03～04-23 平均 ≤10 場），官方 FastChat 清單只列 47 個。"87.8% of open weights and 89% of open-source models have been deprecated, in contrast to a lower deprecation rate of 80% for proprietary models." 靜默下架者 64% 為 open-weight／開源（v1 寫 66%）。模擬（§5.1–5.2）：任務分佈變動時中途下架一個模型會讓 4 個模型排名整個重排；比較圖不連通時 BT 排名偏離真值。
  6. **用 Arena 資料訓練的增益與 112% 的對照條件**（§4.2、圖 10、附錄 M 表 9）：7B 基底（Cohere Command 家族用的那個），固定 1.3K 步、batch 128，只改 SFT 混合中 Arena 資料比例 0%／30%／70%（其餘為 Cohere 自有 SFT 資料）。評測是 **ArenaHard 500 題英文 prompt、GPT-4o-2024-11-20 當評審、對手是 Llama-3.1-8B-Instruct**，不是 Arena 真人投票。勝率 23.5% → 42.7% → 49.9%；"The relative gains in win-rates are 81.7% for the 30_arena and 112.3% for the 70_arena variant." 112% 是勝率的相對增幅（49.9/23.5−1），絕對增幅 26.4 個百分點。MMLU 66.5% → 64.4% → 65.9%（沒有提升）。
  7. **prompt 重複**（§4.2、圖 12、附錄 H）：2024-11～2025-04 去重平均丟掉 20.14% prompt，2025-03 達 26.5%；2024-12 的 prompt 有 7.3% 原文再出現在 2025-01，語意相似度 >0.95 時 9%。非英文 prompt 從 2023-04 的 23.9% 升到 2025-01 的 43.5%。
  8. 五項建議：禁止撤回分數、公開並限制每家私測數量（例如同時最多 3 個）、各授權類別同比例下架（如各砍後 30 百分位）、照論文式 9 主動抽樣、公開所有測試／下架／抽樣率。
- 作者自己列的限制（§7）：拿不到 Arena 原始資料（公開資料已去重、已移除可疑票與私測對戰），無法研究對抗投票；爬取只涵蓋 2025-01～03，剛好碰上 Llama 4 發布，可能高估 Meta、低估其他家；訓練實驗只用了一小部分資料，「likely underestimate」過擬合；私測模型歸屬靠自報身分，可能誤判。
- 與摘要說法不一致處：
  - **v2 前後矛盾**：§3 開頭「Section Findings」仍寫 "testing just 10 variants yields a notable increase of approximately 100 points"（v1 原文，未改），但同節正文與附錄 I 已改成「20 個變體約 50 分」。引用時以正文與附錄 I 為準。
  - 摘要 "relative performance gains of up to 112% on ArenaHard, a test set from the arena distribution"：v2 已補「ArenaHard」與「relative」，但「access to Chatbot Arena data yields substantial benefits」讀起來像 Arena 名次提升；實驗量的是 LLM 評審的靜態 500 題勝率，沒有量 Arena 真人排名。
  - §1 寫「41 fully open-source models … 8.9%」、摘要寫「83 open-weight models … 29.7%」，兩個數字指不同類別；只引其一會誤導（Arena 回應正是抓「8.8%」）。
  - 「identical checkpoints 得到不同分數」：v2 補上的 CI（±21/22 與 ±19/23）其實重疊，正文仍稱 "notable differences"。
- 反證或後續修正：
  - Arena 官方回應（2025-05-09，見下）逐條反駁 5 點並承諾 3 項政策改動。
  - Arena 執行長 Angelopoulos 在 Latent Space 訪談稱論文「unscientifically」、作者「corrected some aspects」但沒有全改（https://latentspace.podhood.com/37c6f092-ea0e-4653-acec-b0eff075212f ，二手轉錄，未當主要證據）。
  - arXiv 至今只有 v1、v2，v2 之後沒有再更新。
- 對系列的用途：支撐「Arena 有治理問題」：私測＋挑最佳在數學上必然往上偏（偏誤大小有爭議，見下一篇），資料與抽樣向大廠傾斜，下架不透明。112% 只能寫成「在 LLM 評審的 ArenaHard 上」。

---

### Our Response to 'The Leaderboard Illusion' Writeup（Arena／LMArena 官方，2025）
- 網址：https://arena.ai/blog/our-response （2025-05-09 發布，2025-06-13 更新；原 blog.lmarena.ai 已搬到 arena.ai）
- 讀取狀態：✅
- 讀取紀錄：Exa web_fetch_exa，maxCharacters 60,000；正文約 6,500 字元，一次讀完（頁尾相關文章連結不計）。另讀 Simon Willison 2025-04-30 文章轉述的官方首則 X 回應（X 原文 Exa 回 SOURCE_NOT_AVAILABLE）。
- 類型：官方文件（部落格）
- 研究設計或文件目的：被批評平台的正式回應：列出接受的建議與政策改動，逐條反駁「事實錯誤」。
- 會被引用的結果：
  - **承認／改動**：(1) 之後的政策會明文寫出「所有」供應商都能在發布前測多個變體 "model providers are all allowed to test multiple variants of their models pre-release, subject to our system's constraints"；(2) 更清楚說明模型如何退出對戰模式，並標示哪些已退役；(3) 原本發布前測試累積 2,000 票就上榜，之後「若同時測超過 10 個變體」，發布後要再收 2,000 張新票才拿掉「provisional」標記。changelog 顯示 2025-09-18 上線 "preliminary" 標籤（措辭與條件已改成：匿名測試後公開發布的模型，一律標 preliminary 直到收夠新票）。
  - **反駁**：(a) 開源 8.8% → 官方統計 open models 40.9%（論文漏算 open-weight）；(b) 「+100 分」來自任意變異數的高斯模擬，官方分析「around +11 Elo after 50 tests and 3000 votes」，且隨新票累積趨近 0；(c) 同 checkpoint 分數差在信賴區間內 "1069 (±27) and 1054 (±18/22) have overlapping confidence intervals"；(d) 沒有偏袒：任何供應商都能送，且 2025-01 起幫 Cohere 測了 9 個發布前模型，"2-3x more pre-release tests than labs like xAI/OpenAI"；(e) 政策 2024-03-01 就公開，"There's no secret or unstated policy"；(f) 112% 是在「Arena-Hard … uses an LLM judge, and no human labels」，"not representative of Chatbot Arena"。
  - **澄清抽樣**："The best models, regardless of provider, are upsampled to improve the user experience."
- 作者自己列的限制：無（立場文件）。
- 與摘要說法不一致處：開頭說「grateful … working together to amend the claims」，但對核心問題「撤回未公開變體的分數」沒有正面處理：沒有承諾公開所有變體分數或限制數量，只用「新票稀釋選擇偏誤」帶過。另外 (c) 引的分數「1069 (±27) and 1054 (±18/22)」與論文的 1052（±21/22）不同，原文沒解釋。
- 反證或後續修正：
  - 「+11」與論文附錄 I 的「相同 checkpoint、50 次、3,000 票 ≈ +17.7」是同一個模型（σ_noise·√(2 ln N)）的不同數值，兩邊都同意「相同 checkpoint、票夠多時偏誤會消失」；分歧在「不同 checkpoint」的情況。這時偏誤 = σ_true·√(2 ln N)，不會隨票數消失，官方回應沒處理。官方說的 "Any non-trivial boost … has to come from substantial model improvements" 其實正是論文說的「挑出最合投票者口味的變體」。
  - Simon Willison（2025-04-30）："it skips over the point from the paper that I find most interesting … cherry-pick for publication just the model that gets the highest score"。
  - 「open models 40.9%」與論文的「open-weight 29.7% + 開源 8.9% ≈ 38.6%」口徑接近，不算推翻論文的分類數字，反駁的是只引 8.8% 的讀法。
- 對系列的用途：支撐「Arena 被指出問題後改了什麼、沒改什麼」：新增 preliminary 標記、退役標示；沒有禁止撤回、沒有限量、沒有公開所有變體分數。

---

### Does Style Matter? Disentangling style and substance in Chatbot Arena（LMSYS／LMArena 部落格，2024）
- 網址：https://lmsys.org/blog/2024-08-28-style-control/ （同文搬到 https://arena.ai/blog/style-control ，2025-06-13 更新）
- 讀取狀態：✅
- 讀取紀錄：Exa web_fetch_exa，maxCharacters 80,000；全文約 9,000 字元（含兩張排名對照表、係數表），一次讀完。arena.ai 版經搜尋摘要比對，內容相同。
- 類型：官方文件（方法說明部落格）
- 研究設計或文件目的：在 BT 邏輯斯迴歸中加入風格共變數（回答 token 長度、markdown 標題數、粗體數、清單數，以 (A−B)/(A+B) 標準化），讓模型係數代表「控制風格後」的強度。
- 會被引用的結果：
  - 係數（三種控制法）："Control Both" 長度 0.249、清單 0.031、標題 0.024、粗體 0.019；只控制 markdown 時清單 0.111、標題 0.044、粗體 0.056；只控制長度 0.267。"we found that length was the dominant style factor. All other markdown effects are second order."
  - 排名變化（Overall，同時控制長度與 markdown）：gpt-4o-mini-2024-07-18 第 6 名 → 11；grok-2-mini 6 → 18；grok-2-2024-08-13 2 → 5；claude-3-opus 16 → 10；claude-3-5-sonnet 6 → 4；gpt-4o-2024-05-13 5 → 2；gemini-1.5-pro-api-0409-preview 11 → 18。"GPT-4o-mini and Grok-2-mini drop below most frontier models, and Claude 3.5 Sonnet, Opus, and Llama-3.1-405B rise substantially."
  - Hard Prompts：claude-3-5-sonnet 2 → 1（與 chatgpt-4o-latest 並列）；llama-3.1-405b 4 → 3；gpt-4o-mini 4 → 11；claude-3-opus 14 → 7。
- 作者自己列的限制："our analysis is still observational. There are possible unobserved confounders such as positive correlation between length and substantive quality"（例：思維鏈解釋同時讓回答變長也變好）；預計做因果推論與前瞻隨機試驗。
- 與摘要說法不一致處：文章開頭把 Llama-3.1-405B 列為「rise substantially」，但 Overall 表中它「控制兩者」時是 6 → 6，只有「只控制 markdown」時 6 → 4；大幅上升只出現在 Hard Prompts（4 → 3）。另外文中定義特徵時說用「長度差、標題數、清單數」，少了粗體，但表格有粗體。
- 反證或後續修正：
  - 2025-05-16 起，style control 成為 text 與 vision 榜的**預設**，並調整 offset 讓兩版落在同一分數尺度（HF `lmarena-ai/leaderboard-dataset` README："On May 16, 2025, style control was made the default for text and vision arenas"）。
  - 2025-08-26 Search Arena 反而**預設不做** style control："the effects of response style are different for search than they are for ordinary chat"（leaderboard changelog）。
  - Min et al. 2025 發現控制長度的榜仍可被灌票，且攻擊者可以把兩邊回答的長度差壓小，放大灌票的影響。
- 對系列的用途：支撐「Arena 分數混了內容與風格」：長度是最大的風格因子，控制後前段名次會換人；而且現在網站上預設看到的分數已經是控制過風格的版本。

---

### Arena 2025–2026 重大變化（一手說明）
主讀：**Leaderboard Changelog**（https://arena.ai/company/leaderboard-changelog ，讀取時最新為 2026-11-20）。輔讀：Series A 公告（https://arena.ai/blog/series-a ，2026-01-06）、Arena-Rank 開源公告（https://arena.ai/blog/arena-rank ，2025-12-18）、公司化公告（https://arena.ai/blog/new-beta ，2025-04-17）、種子輪公告（https://arena.ai/blog/new-lmarena ，2025-05-27）、改名公告（https://arena.ai/blog/lmarena-is-now-arena ，2026-01-28）、PR Newswire 新聞稿（https://www.prnewswire.com/news-releases/lmarena-raises-150-million-to-build-the-worlds-most-trusted-ai-evaluation-platform-302653012.html ）、HF 排行榜資料集 README。
- 讀取狀態：✅（changelog 全文；series-a、arena-rank 全文；其餘公告與新聞稿以 Exa 搜尋摘要讀到主要段落，標 🟡）
- 讀取紀錄：changelog 用 Exa 抓到約 58,300 字元，存檔後以腳本濾掉「X has been added」類新增模型句，再逐段讀剩下的方法／政策段落並回查日期；series-a 約 4,000 字元、arena-rank 約 5,000 字元全文讀完。
- 類型：官方文件
- 會被引用的結果（依時間）：
  - 2024-01-09（HF README）／2023-12（論文）：Elo → Bradley-Terry。
  - 2025-04-17：成立公司 Arena Intelligence Inc.，"Our leaderboard will never be biased towards (or against) any provider"；2025-05-27：種子輪 1 億美元（a16z、UC Investments 領投）。
  - 2025-05-16：style control 成為 text／vision 預設。
  - 2025-07-14：強化去重（出現頻率前 0.5% 的 prompt 只留部分樣本，"Deduplication filters out around 10% of all submitted votes"）與身分外洩偵測（LLM 分類器，"Less than 4% of all votes are labeled as identity_leak"）。
  - 2025-07-23：CI 改用 M-估計量 CLT 閉式解；依「與出現頻率成反比」重新加權對戰，"Reweighting increases the variance of Arena scores, and we observe wider confidence intervals as a result. This mean that the new rankings will have more ties"。
  - 2025-08-26：Search Arena 上線，預設不做 style control。
  - 2025-09：第一個商業評估產品上線（Series A 公告；新聞稿說 2025-12 年化消費 run rate 超過 3,000 萬美元，收入來自「paid AI evaluation services to AI labs and enterprises」，客戶包括 OpenAI、Google、xAI）。
  - 2025-09-17：過濾「統計上異常」使用者的票。2025-09-18：新增 "preliminary" 標籤（匿名測試後公開的模型，在收夠發布後新票前都標 preliminary）。
  - 2025-11-05：Arena Expert（只占全部 prompt 5.5%）與 8 個職業類別榜；同期 WebDev 改由 Code Arena 驅動（HF README：WebDev 資料從 2025-11-12 起算）。
  - 2025-12-18：Arena-Rank 開源（Apache 2.0），"since our graduation into a company of our own, that repo [FastChat] has not been maintained"，聲明這套程式就是網站所有榜單在用的。
  - 2026-01-06：Series A 1.5 億美元，估值 17 億美元（新聞稿）；月活 500 萬、150 國、每月 6,000 萬次對話。2026-01-28 改名 Arena（arena.ai）。about 頁累計融資 2.5 億美元。
  - 2026-05-12：「Battles in Direct」票開始計入（自 2026-03 起把 10% 直接聊天 session 轉成對戰）；發現兩個新偏誤：偏向左側 Model A，以及「與前文同一家」的模型占優，分別加入 `is_direct_battle`、`same_org_indicator` 共變數吸收。
  - 2026-06-04：Agent Arena 上線，用行為訊號（下載檔案、不認同、重試、可操控性）而非只靠投票；後續（2026-09-30、10-12、11-17、11-18）多次改用 **LLM 評審**判定訊號，並新增 Alignment Index（未授權行為、捏造使用者同意、假裝完成）。
- 作者自己列的限制：changelog 多處標明「Models and leaderboards with fewer votes may see larger score fluctuations」；Agent 訊號定義多次更動，舊分數要回填。
- 與摘要說法不一致處：Series A 說「LMArena's evaluation … transparent, open-source methodology」，但收入來自付費評估服務給「被它排名的同一批實驗室」；公告沒有說明利益衝突怎麼隔離（沒找到相關政策頁，屬未查證缺口，不是反證）。
- 反證或後續修正：無直接反證；這批是政策與方法本身的更新紀錄。
- 對系列的用途：支撐「2025 年後的 Arena 已經不是學術排行榜」：公司化、估值 17 億、向被評者收費；方法持續修補（重新加權、去重、preliminary、異常票過濾）；Agent Arena 開始依賴 LLM 評審，「真人偏好」的成分在新榜變少。

---

## 補搜精讀（2 篇）

### Exploring and Mitigating Adversarial Manipulation of Voting-Based Leaderboards（2025）
- 網址：https://arxiv.org/html/2501.07493 （v1，2025-01-13；作者含 Google、UC Berkeley 的 Arena 團隊 Angelopoulos、Chiang、Stoica，以及 ETH、CMU）
- 讀取狀態：✅
- 讀取紀錄：轉純文字約 80,500 字元；正文（摘要至 §7、貢獻聲明）全讀；附錄 A–B 讀過正文段落（表格數值只讀表頭與正文引用處）。
- 類型：研究論文（與 Arena 團隊合作的安全研究）
- 研究設計或文件目的：兩步攻擊：(1) 去匿名化——用身分探測 prompt 或用 BoW／TF-IDF 加邏輯斯迴歸分辨目標模型；(2) 只在認出目標模型時投票。在離線模擬環境（1,670,250 票、477,322 使用者）估計移動名次需要的票數，再分析防禦。
- 會被引用的結果：
  - 去匿名化：「Who are you?」對所有測試模型 >90%（表 2）；BoW 簡單分類器多數模型 >95%（表 3：claude-3.5-sonnet 93.7%、gpt-4o-mini 95.8%、llama-3.1-70b 95.7%）；只看長度也有 63–78%。
  - 票數（表 4–5）："moving a model up just one position Up(M,1) or down one position requires less than 1,000 votes. Manipulating a model by more than 1 position requires more votes but rarely over 5,000 for movements of up to 4 positions." 低名次模型最便宜：上升 4 名只需 381 票；第 5 名的模型要 3,127 票。換成「互動次數」（包括沒抽到目標時的提問）就是數萬到 20 萬次。
  - 成本：沒有防禦時主要是訓練分類器約 440 美元；強制 prompt 不可重複可讓每次行動約 2.2 美元。
  - 防禦：登入驗證、速率限制、異常投票偵測（似然比檢定）、每票 CAPTCHA、拒收重複 prompt；發布加噪排行榜可抓到模仿公開排名的攻擊者，但會犧牲榜單效用。
- 作者自己列的限制：全部在模擬環境；"Preventing a well resourced adversary in the limit would be almost unfeasible since the adversary could hire many users"；Arena 註記 "To date, Chatbot Arena is not aware of any attempts to adversarially manipulate the existing leaderboard."
- 與摘要說法不一致處：摘要說「roughly a thousand votes」，那是「移動 1 名」的下限；移動 2–4 名多數要 1,000–3,700 票（第 3 名的 gpt-4o 掉到第 5 名要 3,756 票），另外還需要數萬次互動。
- 反證或後續修正：Min et al. 2025（下一篇）稱只針對目標的灌票其實很沒效率（目標模型只出現在約 1% 對戰中），改用全面灌票。Arena 後來加上登入、reCAPTCHA、異常使用者過濾（changelog 2025-09-17）。
- 對系列的用途：支撐「Arena 的匿名性比想像中脆弱，而且模型擁有者自己最容易認出自家模型」（§6：可以記錄自家 API 的輸出，或埋浮水印、後門），直接挑戰「廠商無法動手腳」的說法。

### Improving Your Model Ranking on Chatbot Arena by Vote Rigging（2025）
- 網址：https://arxiv.org/html/2501.17858 （v2，2025-08-10；ICML 2025）
- 讀取狀態：🟡（正文全讀；附錄只讀到正文引用的段落）
- 讀取紀錄：轉純文字約 91,000 字元；正文（70–542 行）全讀，表格以原始行回查；附錄 A–E 只讀到正文引用處，未逐表精讀。
- 類型：研究論文
- 研究設計或文件目的：提出「全面灌票」（omnipresent rigging）：因為 BT 是對所有票聯合擬合，就算對戰裡沒有目標模型，投票也能改變目標的相對名次。在約 1.7M 歷史票、129 個模型的模擬環境裡，比較只針對目標的灌票與全面灌票。
- 會被引用的結果：理想情境灌 20,000 票，只針對目標平均升 4 名，全面灌票約 10 名（圖 2）；目標模型完全不被抽到（β=0）時全面灌票仍升 >5 名（表 2）；實務情境（25 個模型、約 23,000 票、匿名、RoBERTa 分類器）Omni-BT 平均升 5 名（表 4）；在控制長度的榜上仍平均升 4 名（表 5）；過濾「與歷史勝率不符的票」在 τ=0.7 時全面灌票仍升 >6 名（表 8）。
- 作者自己列的限制：概念驗證；"our findings demonstrate the difficulty of thoroughly defending against vote rigging"。
- 與摘要說法不一致處：摘要說「rigging only hundreds of new votes」，但正文讀到的實驗都用 2 萬票級的設定；「數百票」對應哪個表格，我在正文沒找到，可能在圖 1／附錄，**未查實**，引用時不要用「數百票」。
- 反證或後續修正：未見 Arena 對此文的專門回應；Arena 後續的異常票過濾、去重屬於同類防禦。
- 對系列的用途：支撐「BT 把所有票連在一起：可以不碰目標模型就拉高它的名次」，以及控制風格的榜也一樣能被灌票。

---

## 對〈模型成績單怎麼看〉（`src/content/posts/ai/2026-08-26-understanding-ai-models-evaluation.md`）的檢查

站上原文：tldr「最抗操弄的訊號是 Chatbot Arena 的 Elo 排名——真人盲測投票，模型廠商無法控制題目」；第 18 行術語「LMSys 維護……是目前最抗操弄的 LLM 評估方式」；第 106 行「它的題目來自真人、匿名投票、持續更新，廠商最難動手腳」。

這批證據對照：
1. **「Elo」過時**：自 2023-12／2024-01 起用 Bradley-Terry；Arena 自己也說 "the Bradley-Terry coefficients, which we formerly called the Elo score"（style control 文）。
2. **「LMSys 維護」過時**：2025-04 起是 Arena Intelligence Inc.，2026-01 改名 Arena，估值 17 億美元，向 AI 實驗室收評估費。
3. **「廠商無法控制題目」大致成立，但「最難動手腳」要加條件**：廠商能做的不是改題目，而是 (a) 私下測多個變體、只公開最好的（數學上必然往上偏；同一 checkpoint 時偏誤隨票數消失，不同 checkpoint 時不會）；(b) 自家 API 託管拿到 100% prompt，配合 7–9% 的跨月重複 prompt，可以針對 Arena 分佈調模型（但 112% 是在 LLM 評審的 ArenaHard 上量的，不是 Arena 名次）；(c) 匿名性可被打破，認出自家模型最容易，移動 1 名在模擬中不到 1,000 票（實際平台有登入、CAPTCHA、異常票過濾，且至今沒有實際被灌票的公開證據）。
4. **「真人偏好」本身有偏**：長度是最大風格因子，現在預設榜已經做了 style control；群眾 vs 專家一致率 72–83%，略低於專家彼此。

建議（待寫稿時決定）：把「最抗操弄」改成「最難直接污染題目、但有治理與選擇偏誤問題的訊號」，並更新 Elo／LMSys 用語。這是改既有文章，要走 post-update，不在本批範圍。

---

## 補搜紀錄
| 查詢（工具） | 找到 | 收／不收 |
|---|---|---|
| "LMArena official response to The Leaderboard Illusion paper Cohere private testing"（Exa search） | arena.ai/blog/our-response；Latent Space 訪談；SocioLens 摘錄；Simon Willison；princetekki 部落格 | 官方回應收為指定來源 3；Willison 收為轉述首則 X 回應的佐證；訪談、SocioLens、princetekki 屬二手，不收 |
| "LMArena blog announcement 2025 2026 funding company, style control default …"（Exa search） | new-beta、new-lmarena、series-a、lmarena-is-now-arena、arena-rank、about、a16z、Laude、PR Newswire、SiliconANGLE | 官方公告收進「2025–2026 變化」；投資方部落格與 SiliconANGLE 是二手，不收 |
| "LMArena style control now default"（Exa search） | HF leaderboard-dataset README（含方法變更日期）、arena.ai style-control 搬遷版、TechnoLynx、FastChat issue | README 收（官方資料卡）；其餘二手，不收 |
| "Arena leaderboard changelog methodology changes"（Exa search） | leaderboard-changelog、Agent Arena Index、Agent Arena methodology | changelog 全文收；Agent Arena methodology 只看搜尋摘要（Agent 屬另一主題，可留給 agent benchmark 那批） |
| 2024 年後反證：arXiv 2501.07493、2501.17858（The Leaderboard Illusion §7、§8.2 引用的對抗投票文獻，curl arXiv HTML） | 兩篇都是在模擬環境中操弄 Arena 的研究 | 兩篇都收，作為補搜精讀（每批上限 2 篇） |
| x.com/lmarena_ai/status/1909397817434816562（Llama 4 Maverick 事件的官方 X 貼文，Exa fetch） | SOURCE_NOT_AVAILABLE | 未讀到。Llama 4 實驗版與公開版不同一事，目前只有 The Leaderboard Illusion 腳註 3–4 與 Willison 轉述（"The arena released a pseudo-apology"）。jina、WebFetch、curl 這三條 fallback 尚未對這個 X 網址試過；要寫進正文前要補 |
| arXiv abs 版本歷史（curl） | 2504.20879 有 v1（2025-04-29）、v2（2025-05-12）；2403.04132 只有 v1 | 用來做 v1／v2 差異比對 |

沒收但值得後續看的：Zhao et al. 2024（浮水印式灌票，被兩篇攻擊論文引用）；Boubdir et al. 2024 "Elo Uncovered"（Elo 的穩健性，可補「為何不用 Elo」的實證，主論文只有一句理由）；Arena "Arena Expert" 部落格（news.lmarena.ai/arena-expert）。
