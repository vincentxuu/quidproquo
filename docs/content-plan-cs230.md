# 內容規劃：Stanford CS230 系列

- 來源：Stanford CS230 Deep Learning, **Autumn 2025**（9 支影片，約 13 小時）
- 逐講筆記：`.work/cs230-notes/lecture-0N.md`；來源清單與已知問題：`.work/cs230-notes/SOURCES.md`
- 規模：**9 篇 × zh-TW/en = 18 檔**
- 決策（2026-08-16 與使用者確認）：**1:1 對應講次** ／ **雙語**

## ⚠️ 方針修正（2026-08-16，寫完前兩篇之後）

**原本的寫法錯了，已作廢。** 原方針是「每篇挑一條主線，其餘只當佐證」，
結果是**課程內容沒被寫完整**——例如 Lecture 4 叫 "Adversarial Robustness and
**Generative Models**"，我卻一個字都沒寫生成模型。

錯誤的來源有兩個，都要記下來避免重犯：

1. 我在給使用者的選項裡，把「純課程筆記」描述成「原創性低、和站上風格不一樣」，
   **那是在把人往我寫起來比較有發揮空間的方向推**，不是它比較符合目的。
2. 「避免和站上 21 篇重疊」這個理由**對 L8 成立，但我擴大套用到全部九講**，
   於是用重疊當藉口一路砍課程內容。

**現行方針：**

| 項目 | 做法 |
|---|---|
| 結構 | **照講者自己的 agenda 走**，他講了什麼就寫什麼 |
| 標題 | **課程原標題 + 觀點副標**（例：`Introduction to Deep Learning：光靠 prompt 走不遠的那兩個時刻`） |
| 評註 | 集中在文末 `## 延伸：` 段落，用分隔線與正文區隔，**不混進正文** |
| 站上重疊處 | **照樣寫完整**，只在該處加一句「這點站上有更深的展開」並連過去 |
| 長度 | **6,000–9,500 字元**。站上 zh 中位數 4,945、p90 9,087、最長 32,245，所以完整覆蓋不衝突 |

（**先前寫進本檔的「1,200–2,000 字」是我抓錯的數字，已作廢。**）

## 系列定義（待寫進 `src/utils/series.ts`）

```ts
{
  slug: 'cs230',
  names: { 'zh-TW': 'Stanford CS230 導讀', en: 'Reading Stanford CS230' },
  descriptions: {
    'zh-TW': '把 Stanford CS230（2025 秋季）九講逐講讀完：不只記錄課堂講了什麼，
              也補上課後到現在這領域變了什麼、以及它和站上既有實戰系列的對照。',
    en: 'A lecture-by-lecture reading of Stanford CS230, Autumn 2025 — what was taught,
         what has changed since, and where it agrees or disagrees with the practice
         written up elsewhere on this site.',
  },
}
```

`order` 直接用**講次編號**（1–6、8–10，**沒有 7**，因為 11/4 停課）。
系列頁的上下篇會因此少一格——這是刻意的，並在每篇開頭說明。

---

## 全系列共用規則

1. **每篇開頭必須標明是 Autumn 2025 那一輪**，附上課日期與影片連結。
   理由：**Autumn 2026 已排定 2026/09/22 開課**，新一輪影片預計 2026 年 10 月起陸續發佈，
   屆時講次內容會變（見下方「大綱正在漂移」）。不標時間的話讀者會對不上。
2. **照講者的 agenda 走，完整覆蓋該講內容**；觀點與延伸集中在文末 `## 延伸：` 段落。
   目標長度 **6,000–9,500 字元**（見上方方針修正）。
3. **引用一律標明講者**（Ng vs Katanforoosh vs 客座 Moroney），三人立場不一致的地方要寫出來。
4. **逐字稿是 YouTube 自動字幕，人名與數字全部不可信**。每篇的「待查證」清單見各講筆記末段，
   寫作前必須用 `post-verify` 跑過。
5. **投影片**：L2/L4/L5/L8/L9/L10 有 fall_2025 新版 PDF 可抓；L1/L6 掛的是 fall_2024 舊版；
   L3 沒有投影片，圖表要自己畫。

### 大綱正在漂移（值得在開篇文章寫一段）

2024 秋 → 2025 秋的變化（已用 Wayback 對照過）：

| 2024 | 2025 | 變化 |
|---|---|---|
| L2 Full-cycle（無投影片） | **L2 自監督／弱監督**（全新投影片） | 新增一講 |
| L4 Deep Learning Intuition | — | **整堂拿掉** |
| **L9 RAG and AI Agents**（一行標題，無投影片） | **L8 Beyond the model**（完整一講） | **從附註膨脹成主課** |
| L10 結業致詞（**沿用 fall_2021 投影片**） | **L10 可解釋性**（新投影片） | 換成真課程 |
| 3 次 project meeting | 2 次 | 流程收緊 |

方向：**LLM／agent 內容擴張，基礎理論壓縮，新增「打開模型看裡面」。**

### ⚠️ syllabus 的 Lecture 6 條目已過期

官網寫的是「職涯／論文閱讀／醫療客座」配 fall_2024 投影片，**實際影片是 AI Project Strategy**。
職涯是 Lecture 9。**一律以影片為準**，並在該篇提一句提醒讀者。

### ★ 跨篇的一條張力線（系列的隱藏主軸）

**Lecture 8 的 Katanforoosh**：「我不是 fine-tuning 的粉絲，盡可能避開——
等你調完，下一個模型已經打敗你 fine-tune 過的版本了。」

**Lecture 9 的客座 Moroney**：「未來兩三年開發者最需要的技能就是 **fine-tuning**。」

**不是矛盾，是兩個市場**：前者講雲端 API 應用（模型迭代快），
後者講自架小模型（資料不能外流，本來就換不了雲端模型）。
**L8 與 L9 兩篇要互相回指，把這條張力寫出來。**

---

## 九篇規劃

### 1 —— Lecture 1｜Introduction to Deep Learning：光靠 prompt 走不遠的那兩個時刻

- 講者 Ng｜category `ai`｜type `guide`
- **主線**：抽象層地圖（CS 基礎 → ML → DL → GenAI），以及**什麼時候會被迫往下鑽一層**。
- 兩個觸發條件（本篇的骨架）：
  1. **prompt 調了一個月效能就是上不去**
  2. **帳單**——原型期每百萬 token 幾塊錢，有了 PMF 之後帳單「skyrocket」，
     把成本曲線壓回去的技能是 fine-tune 小模型
- 資料型態判斷表：文字 → prompt 能走很遠；音訊／影像／影片／結構化 → 常要直接動 DL
- **收尾接系列**：這就是為什麼一門 2025 年還在教 CNN 的課值得看完。
- 次要素材（節制使用）：scaling 敘事、「recipe」那句、五個 Coursera 模組
- **回指**：`2026-03-28-harness-engineering-evolution`（從 Prompt 到 Harness 的三次演化）
- 待查：Ian Goodfellow 宿舍組 GPU 一事標為講者口述；「knowledge drops」疑為誤聽

### 2 —— Lecture 2｜Supervised, Self-Supervised & Weakly Supervised Learning：從比較像素到比較意義

- 講者 Katanforoosh｜category `ai`｜type `deep-dive`
- **★ 這是站上最大的缺口**：`RAG 系統實戰` 六篇都在用 embedding，沒有一篇講它怎麼來的。
- **主線（一條線走完）**：
  1. 為什麼**不能直接比像素**——光線讓左上角像素差 255，但那個像素根本不重要；
     平移／旋轉／縮放不變性；眼鏡、帽子、鬍子、年齡
  2. **encoding vs embedding 的定義**：距離有意義時才叫 embedding
  3. **triplet loss**（anchor/positive/negative、margin α、FaceNet 2015）
  4. **contrastive learning**（SimCLR）：從監督 triplet 到自監督 pairs
     ——**「這就是為什麼現代模型能用數十億張未標註影像訓練」**
  5. **多模態共享空間**（ImageBind）：樞紐是**影像**不是文字——課堂說法有誤，
     論文結論是 only image-paired data is sufficient，文中要標明差異
- **回指**：`2026-03-12-hybrid-search-bm25-vector-rrf`、`2026-05-08-pageindex-vectorless-rag`
- **同樣要寫完整**：暖身（模型＝架構＋參數、capacity、逐層特徵、one-hot 錯誤）、
  日夜分類（人當 proxy、64×64×3、解析度取捨）、喚醒詞（cascade、資料分佈、
  標籤方案人體實驗、類別不平衡、三小時合成上百萬筆、去問專家）、
  verification / identification / clustering（Global Entry vs 歐洲海關、k-NN、k-means）
- 待查：Awni Hannun 拼寫、FaceNet/SimCLR/ImageBind 正式引用

### 3 —— Lecture 3｜Full Cycle of a DL Project：資料收兩天就好

- 講者 Ng｜category `ai`｜type `guide`
- **主線：速度是資料策略**，而且 Ng 全講用速度回答了本該用別的理由回答的問題。
- 骨架：
  - **兩種問法的對照**：「我們需要什麼資料、要多久？」（慢） vs
    **「我們有兩天。最有創意、又尊重人、又負責任的收集方式是什麼？」**（快）
  - **相稱原則**：花在準備資料的時間應與**訓練一次模型**的時間相稱
  - 反面故事：CEO 花超過一億美元併購一家公司拿資料，事後問怎麼變現
  - 例外：做過的題目、文獻有數字的題目（人臉辨識至少五萬張）就先投資
- **必須寫的第二段：只有做了才會發現的事**——VAD 選項一 vs 選項二，
  以及那個**畫格模糊／挑出五張對焦畫格**的發現。加上「簡單模型抗漂移」這個反直覺優點。
- 收尾：**「我的工作是做出一個真的能用的東西，那和做出一個在測試集上能用的東西不一樣。」**
- **回指**：`2026-08-10-enterprise-agent-case-studies`（上線才是工作的開始）
- 待查：一億美元那個數字是口述、Gemini 2.5 Pro 是 2025-10 的說法要標時間

### 4 —— Lecture 4｜Adversarial Robustness and Generative Models：不是非線性，是維度

- 講者 Katanforoosh｜category `ai`｜type `deep-dive`
- **主線：脆弱性的根源被誤解了。**
  - 研究者一開始猜是**非線性**——**錯的**。「從輸入到 logit 看過去，它其實非常線性。」
  - 真正的原因是**維度**。用五維邏輯迴歸手算：`x̄ = x + εw` → `σ(wᵀx + ε‖w‖²)`，
    0.08 → 0.83。**每個微小擾動往同一方向加總，複利累積。**
  - FGSM 一次到位
- **第二段：攻擊面隨 agent 化而擴張**（三波分期）：
  2013 adversarial examples → backdoor/data poisoning → prompt injection。
  **「2014–2018 走輸入；現在指令、context、檢索 pipeline 都是進入點。」**
  加上**間接注入**（agent 讀到被下毒的網頁）與**文字版 backdoor**（Wikipedia 埋指令）。
- **回指**：`2026-08-10-agent-security-harness-layer`（安全：prompt injection 只能在 harness 層做損害控制）
  ——那篇講怎麼防，這篇補「為什麼模型本質上就防不住」
- **後半場（生成模型）必須寫完整**：GAN 的三個病（冷啟動飽和梯度、mode collapse、
  兩個模型互相卡住）、非飽和 cost 的變換、潛在空間線性（男人+墨鏡−男人+女人）；
  diffusion 的前向／反向過程、noise schedule、latent diffusion、影片的 cube token。
  **mode collapse 的火鶴例子**（GAN 永遠生成成群的火鶴，從沒生出單獨一隻）是全講最好的圖。
- 本篇會是全系列最長的一篇（約 9,500 字元）。**若超過 11,000 就回報並考慮拆兩篇。**
- 待查：Szegedy 2013、Goodfellow FGSM、adversarial patch（針對 YOLO v2）出處；
  數值例子要自己重算

### 5 —— Lecture 5｜Deep Reinforcement Learning：把 RLHF 放回強化學習的框架裡

- 講者 Katanforoosh｜category `ai`｜type `deep-dive`
- **主線：多數 LLM 文章跳過的那一步——RLHF 到底 RL 在哪裡。**
- **前半照樣寫完整**：圍棋為什麼不能用監督式學習（三個反駁）、RL 詞彙、
  資源回收 Q table 手算、Bellman 方程、deep Q-learning 怎麼造標籤、
  Breakout 前處理（含 DeepMind 去色讓 Seaquest 的魚消失）、
  experience replay、ε-greedy（腳踏車路線類比）、湧現行為（AlphaGo 那步怪棋）、PPO/DPO。
- **後半（重點）：那張對照表**

  | RL | RLHF |
  |---|---|
  | agent | 正在被微調的語言模型 |
  | state | prompt + 已生成的 token |
  | action | **下一個 token** |
  | reward | 獎勵模型給的分數 |
  | 一個 episode | 一次完整生成 |

- **必寫**：**稀疏獎勵**——「不是每個 token 都有獎勵，是序列結束才有，
  所有中間獎勵都是零，**就像一盤西洋棋**」
- **必寫**：SFT 是 **imitation**，不是 preference optimization；
  RM 是把 softmax 層換成**輸出純量的 reward head**；
  「**問人偏好哪個，比請人自己寫答案容易也快太多**」
- 開頭鉤子用「圍棋為什麼不能用監督式學習」的三個反駁，**尤其第三個：ground truth 本身沒有良好定義**
  ——這個論證今天對 LLM eval 一樣成立
- **回指**：`2026-08-10-rag-graph-agentic-variants`（evaluator paradox）
- 待查：InstructGPT 13,000 組、Karpathy 那支「四天前」的影片（約 2025-10-17）

### 6 —— Lecture 6｜AI Project Strategy：三四個小時的試算表，省掉幾週的錯方向

- 講者 Ng｜category `ai`｜type `guide`
- **★ 全系列最能直接落地的一篇。** 而且 Ng 用的例子就是 **deep researcher**，站上讀者一看就懂。
- **主線：error analysis 電子表格**
  - 列 = pipeline 各步驟（生成搜尋詞／網路搜尋／挑網頁／寫作）
  - 行 = 查詢，**10 到 100 之間**
  - **只看表現不好的查詢**
  - 結果：搜尋詞 20%、網路搜尋 5%、**挑網頁 70%**、寫作 20%
    ——**「不需要加起來等於 100%，一個查詢可能在不只一欄出問題」**
  - **「三四個小時，省下幾週走錯方向。」**
  - 反面：團隊可能花**六個月**換搜尋引擎，而**根本不動如山**
- **必寫的兩句**：
  - 「**真的到了那個時候會去做的人的比例，遠低於 100%。**」
  - 「error analysis 是**手動**的，因為它在找**人類會做得比 AI 好的地方**，
    再把那份知識注入系統。有人在談自動化，但目前為止就是得靠人去看。」
- 第二段：**有經驗的人「變異數很小」**——這證明它有方法論，不是玄學
- **前半（喚醒詞案例）也要寫完整**：文獻搜尋的做法（略讀多篇再深讀少數）、
  去信問論文作者、合成資料為什麼不是第一步（電玩只有 20 種車）、
  100 訓練／25 dev／**0 test set**、97% 準確率卻從沒偵測到、不平衡的 1:10 經驗法則、
  音訊疊加的陷阱（**會得到語音活動偵測器**）。
- 再加：**一天修一個問題**的日節奏、訓練時間分級表（10 分鐘／4 小時／3 週）、2 倍複利
- **回指**：`2026-08-10-enterprise-agent-case-studies`、`2026-03-12-rag-failure-modes`
- **提一句**：syllabus 這一講的條目是過期的，別照官網找
- 待查：無投影片，pipeline 圖與 2 倍複利圖要自己畫

### 8 —— Lecture 8｜Agents, Prompts, and RAG：一堂課教完之後剩下的才是難的

- 講者 Katanforoosh｜category `ai`｜type `deep-dive`
- **★ 這篇是對照篇，不是導讀篇。**
  這一講約 70% 被站上 21 篇蓋掉且站上寫得更深（prompt 技巧、RAG 原理、HyDE、chunking、
  MCP、multi-agent、prompt injection）。**這些一句帶過並連過去，不重寫。**
- **只寫課堂獨有的四塊**：
  1. **鋸齒狀邊界（BCG × 哈佛研究）**：邊界內 AI 大幅提升，**邊界外 AI 讓結果更差**；
     「在方向盤上睡著」；**半人馬 vs 半機械人**；
     「**你不會靠 prompt engineering 做出一份職業生涯**」
  2. **決定論 → 模糊的典範轉移**：傳統軟體按技術職能切，agentic 軟體**像主管一樣按角色切**；
     「模糊工程真的很難」；Workera 用**申訴功能**把人放回迴圈
  3. **反 fine-tuning 的立場**：「等你調完，下一個模型已經打敗你了」+ **Slack fine-tuning 的笑話**
     （「我明早會處理」）→ **這裡開一條線連到第 9 篇的相反立場**
  4. **RAG 會不會被長 context 取代**的三個反駁，尤其**搜尋引擎的類比**
- 小而實用的點（各一兩句）：**八輪就走鐘**、**「你有 LLM traces 嗎」**當面試問題、
  eval 的三軸切法（端到端/元件、客觀/主觀、量化/質性）
- 收尾用他自己的話解釋這門課為什麼只給廣度：**「技能的半衰期太短了。」**
- **回指**（密集）：`2026-08-10-agent-workflow-rag-mcp-boundaries`、
  `2026-08-10-model-component-harness-system`、`2026-08-10-mcp-a2a-skills-protocol-layer`、
  `2026-03-14-rag-patterns-complete-guide`
- 待查：「from Yu」那則推文出處**必須查證**；BCG 研究正式引用（Dell'Acqua et al.）；
  McKinsey 信用備忘錄報告；Ross Lazerowitz 貼文（2023-09）

### 9 —— Lecture 9｜Career Advice in AI：投了 300 份履歷都失敗的 10x 工程師

- 講者 Ng（前 20 分鐘）+ **客座 Laurence Moroney**（其餘）｜category `career`｜type `guide`
- **主線：技能不是問題的時候，問題在哪。**
  - 開場故事：菁英 coder、300 多個職缺、多次走到最後一輪被拒。
    原因是求職手冊教他「**站穩立場、要有骨氣**」，他詮釋成強硬 →
    「**這個人就是那個老掉牙的 10x 工程師，但我不想讓他靠近我的團隊一步。**」
    修正後薪水翻倍。
  - **三根支柱**：深入理解（學術 + 趨勢訊噪比）／商業聚焦／交付偏好
  - **「不要為你現在的工作產出，要為你想要的工作產出」**
    ——他寫了個跑在 Google Cloud 上的 Java 應用放進履歷，
    「**整個面試流程就是他們問我我的程式碼。這把主導權放回我身上。**」
- **第二段：技術債作為 vibe coding 的判準**（本篇第二根支柱，可能佔 1/3 篇幅）
  - 好債（30 年房貸）vs 壞債（信用卡買鞋）
  - **「每一次你做出一個東西就背上了債。避免債的唯一方法是什麼都不做。」**
  - 四個檢查，尤其**「最糟的技術債是交付一份沒人看得懂的程式碼」**
  - **權威凌駕實力**：「那位 VP 訂閱了 Replit 開始做東西，猜猜變成誰的問題要修」
- **第三段（短）**：Ng 的 **PM 瓶頸**——eng:PM 從 8:1 走向 **1:1**；
  以及那個**被分派去做 Java 金流後端**的學生（同一家公司發生兩次）
- **大 AI vs 小 AI 的分岔要寫完整**（這是 Moroney 講的主要前瞻論點）：
  open weights / self-hostable、YC 80% 用中國小模型、**好萊塢 IP 案例**
  （機會在分析不在創作）、7B vs 50B、ARM 的 SME 與端側 AI、支付寶相簿。
  以及泡沫解剖、鐵達尼望遠鏡、「把它講得平淡無奇」。
- **回指**：第 8 篇（fine-tuning 立場的對照）
- 待查：METR 研究出處與「七個月倍增」「70 天」兩個數字；McKinsey 85% 失敗率報告；
  Google Cloud 靜坐事件報導

### 10 —— Lecture 10｜What's Going On Inside My Model?：模型退步了，你先看哪裡

- 講者 Katanforoosh｜category `ai`｜type `deep-dive`
- **★ 站上第二個真空區**（全站提到可解釋性的只有 14 篇且多為順帶）。
- **開場直接用課堂的案例**：2000 億參數模型、新 checkpoint 通過 sanity check，
  但推理 benchmark 變差、安全 eval 沒過、工具使用延遲有尖峰。**你先看哪裡？**
- **四個桶子**當骨架：訓練與 scaling ／ 表示與內部 ／ 資料與分佈 ／ 能力層級
- **主體：CNN 那七種方法**（挑三到四種寫透，其餘列表）
  - saliency map（**要用 softmax 之前的分數**；散得到處都是＝模型只是運氣好）
  - occlusion sensitivity（阿富汗獵犬那個例子：**遮住人臉分數反而上升**）
  - **class model visualization**：問模型「你心目中的狗長什麼樣」
    → **大麥町 = 白底黑點**；**「鵝」= 一大群鵝**（標註把一群標成 goose）← **這是本篇主圖**
  - dataset search（今天最常用）+ **感受野**解釋為什麼那些圖是裁切的
- **轉折**：這套方法到 transformer 上就只剩 attention map 與 embedding 降維，
  而且**「最前沿的研究也只能解釋兩層的 transformer」**（Anthropic 的 circuits / induction heads）
- **第三段：benchmark 怎麼讀**
  - **「我會看模型之間的相對值，不看絕對值」**；「社群花了一段時間才意識到 Claude 寫程式有多好」
  - 汙染偵測：n-gram / hash / **embedding 語意搜尋**
  - **Chinchilla**：GPT-3 不是太小，是**訓練得不夠久**；700 億贏 1750 億
- **回指**：站上 `daily-digest` 的 benchmark 相關內容
- 待查：Epoch AI 的資料耗盡數字（他自承忘了）、OpenAI × Anthropic 聯合安全評估出處、
  Chinchilla / The Pile / Zeiler & Fergus / Yosinski / Jesse Vig 正式引用

---

## 溢出的素材

**方針修正後，原本這張表上「割掉」的課程內容全部改回要寫。**
以下只保留真正屬於「延伸」而非課程內容的東西：

| 素材 | 出處 | 處置 |
|---|---|---|
| 大 AI vs 小 AI 分岔、好萊塢 IP 案例、YC 80% 用中國小模型、7B vs 50B | L9 | **候選：系列外的獨立單篇**，先不寫 |
| SME / on-device AI / 支付寶相簿 | L9 | 同上 |

---

## 執行順序

1. 先寫 **2、6、10**（三個真空區，價值最高、重疊最低）——先驗證寫法可行
2. 再寫 **1、3、4、5**
3. **8、9 最後寫**，因為它們要回指前面幾篇，而且 8 是對照篇需要先確認前面寫了什麼
4. zh 全部完成並過 `post-review` + `post-verify` 後，才用 `post-translate` 出英文版

## 未決事項

- 系列名稱「Stanford CS230 導讀」是否要更有觀點？目前選它是為了**可搜尋性**
  （讀者會搜 "CS230"），但和站上其他系列的命名風格（有立場的短語）不太一致。
- 第 9 篇放 `career` 分類會讓系列跨兩個分類。drone 系列跨五個分類是可接受的先例，
  但如果想維持單一分類，可改放 `ai`。
