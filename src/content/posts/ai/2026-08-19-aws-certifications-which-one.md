---
title: "AWS 三張 AI 證照怎麼選：MLA-C01 的窗口只剩 40 天，而且只有英文版在倒數"
date: 2026-08-19
type: guide
category: ai
tags: [certification, aws, career, generative-ai]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 21
tldr: "AIF-C01、MLA-C01、AIP-C01 不是難度階梯，是三個不同的職能切面：AIF 考「說得出來」、MLA 考「把 ML 上線」、AIP 考「把別人的模型整合成系統」。但 2026 年 8 月的選擇被時間卡住——官方認證頁公告 MLA-C01 英文版最後考試日是 2026/9/28，從今天算只剩 40 天，而 MLA-C02 要 9/1 才開放報名、考綱尚未公布。非英文（日／韓／簡中）考生的窗口反而長得多，這是真實差異。同一頁還同時出現 MLA-C02 與 ME1-C02 兩個代碼，官方沒說明兩者關係。另外續期圖會反過來決定考試順序：AIP-C01 一張就把 AIF-C01、MLA-C01 與 Data Engineer – Associate 各續三年。"
description: "AWS 三張 AI 證照（AIF-C01 / MLA-C01 / AIP-C01）的選擇指南：以官方 exam guide 的 domain 權重與 in-scope／out-of-scope 清單對照三張的實際分界，處理 MLA-C01 英文版 2026/9/28 停考造成的時間分支（含非英文考生的不同窗口），指出官方頁同時出現 MLA-C02 與 ME1-C02 兩個代碼的矛盾，並用續期圖推導最佳考試順序。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-19-aws-certifications-which-one-en)
>
> 本文是從官方資料建出來的選擇指南，不是應考實錄 —— 作者沒有報考這些考試。所有「考什麼」都指回官方 exam guide，所有規格都指回官方認證頁，不含考古題。查證日期：2026-08-19。

系列前面已經各出過 [AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide) 與 [AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide) 的備考路徑，這篇處理它們之間的取捨，以及第三張 MLA-C01 —— 它現在的狀態特殊到不能單獨寫一篇備考路徑。

**先說結論**：這三張不是初級／中級／高級的階梯。它們的官方 out-of-scope 清單幾乎不重疊，選錯的代價不是「考太簡單」，是**考了一張不證明你會做的事**。而 2026 年 8 月的選擇又多一層限制 —— 其中一張正在倒數停考。

各家證照的價格與效期總表在站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 三張的官方規格對照

| | [AIF-C01](https://aws.amazon.com/certification/certified-ai-practitioner/) | [MLA-C01](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/) | [AIP-C01](https://aws.amazon.com/certification/certified-generative-ai-developer-professional) |
|---|---|---|---|
| 等級 | Foundational | Associate | Professional |
| 費用 | $100 | $150 | $300 |
| 時間 | 90 分鐘 | 130 分鐘 | 180 分鐘 |
| 題數 | 65（50 計分） | 65（50 計分） | 75（65 計分） |
| 及格 | 700 | **720** | **750** |
| 題型 | 單選、複選、ordering、matching | 單選、複選、**ordering、matching** | 單選、複選（無 ordering／matching） |
| 效期 | 3 年 | 3 年 | 3 年 |
| 語言 | 12 種，**含繁體中文** | 英、日、韓、簡中 | 英、日、韓、簡中 |
| 官方建議經驗 | 接觸 AI/ML 六個月以內，「使用但不一定要會建」 | **1 年 SageMaker + 1 年後端／DevOps／資料工程／資料科學相關角色** | 2 年生產級開發 + 1 年 GenAI 實作 |
| 現況 | 考綱 v1.1（2026-04-30） | **英文版 2026/9/28 停考** | 2026-03 refresh，已含 AgentCore |

三張的及格線 700 / 720 / 750 是一路升高的，都用補償計分、單章不設門檻。

**題型有個容易被忽略的分界**：AIF-C01 與 MLA-C01 都有 ordering（排序 3–5 個步驟）與 matching（配對 3–7 組），兩者都是**全對才給分**；[AIP-C01 的 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html) 只有單選與複選。也就是說**級別最高的那張反而題型最單純**，考前的節奏演練不能三張共用。

## 時間分支：MLA-C01 現在能不能考

這是這篇最需要當下判斷的一段。[MLA-C01 官方認證頁](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/)頂端掛著改版公告：

> This exam is being updated. Registration for the updated version (MLA-C02) opens September 1, 2026. The last day to take the current exam (MLA-C01) in English is September 28, 2026. The current exam in other languages (Korean, Japanese, and Simplified Chinese) will remain available until general availability of MLA-C02.

從今天（2026-08-19）算：

| 事件 | 日期 | 距今 |
|---|---|---|
| MLA-C02 開放報名 | 2026-09-01 | **13 天** |
| MLA-C01 英文版最後考試日 | 2026-09-28 | **40 天**（5 週又 5 天） |
| MLA-C01 日／韓／簡中版最後考試日 | 到 MLA-C02 正式上線為止 | **官方未給日期** |

### 英文考生：40 天不夠，這條路多數人該放棄

[MLA-C01 官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01.html) 的四個 domain 是 28 / 26 / 22 / 24 —— 權重分布得非常平，沒有可以「這章比重低先跳過」的空間。而且它不是知識型考試：資料準備、模型開發、部署與 CI/CD 編排、監控與安全，四塊都要動手。

依本系列的換算方式（時程由內容量與經驗差距決定），把它放在已出的兩篇之間：[AIF-C01 是四週](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)（知識型、零實作章節、官方預設經驗六個月），[AIP-C01 是十週](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)（professional、大量必須動手的章節、官方要求三年經驗）。MLA-C01 是 associate、四個 domain 全部需要實作、官方要求兩年相關經驗 —— **合理區間是六到八週，每週 6–8 小時**。

40 天 ≈ 5 週又 5 天，而且那 40 天裡還得排進約考、通勤與緩衝。**時程對不上，所以對多數人來說結論是：現在不要開始準備 MLA-C01 英文版。**

**唯一的例外**是已經在做 SageMaker ML 工程、實務經驗完全對得上官方 target candidate 描述（1 年 SageMaker + 1 年後端／DevOps／資料工程／資料科學）的人。這種人需要的不是六到八週的學習，是兩三週的考綱對表與題型適應 —— 立刻約考仍然來得及。判斷方式很直接：把 exam guide 的四個 domain 逐條讀過，如果有超過三分之一是「我沒做過」，那就不是這種例外。

注意這裡的邏輯：**不是因為快停考所以要壓縮讀書計畫，是因為時程壓不下來所以這條路關了。** 截止日只當分支條件用，不當壓縮理由。

### 日／韓／簡中考生：窗口確實比較長

這是一條真實的差異，而且很少被寫出來。官方原文寫日文、韓文、簡體中文版「will remain available until general availability of MLA-C02」—— 也就是這三種語言的考生**不受 9/28 那條線約束**，可以撐到 C02 正式上線。

但要準確理解這句話的限制：

- **官方沒有公布 C02 的 GA 日期。** 只知道 9/1 開放報名（那是報名，不是上線），GA 是哪天沒說。所以這個窗口是「比 40 天長」，不是「還有半年」。
- 排時程時要把「GA 可能隨時公布」當風險，六到八週的計畫可以排，但**約考日訂得越前面越好**，不要排到計畫末端。
- **繁體中文不在這份名單裡。** MLA-C01 只有英、日、韓、簡中；三張裡唯一有繁中的是 AIF-C01。台灣讀者如果原本想靠中文版繞過 9/28，簡中版可以考，但那不是繁中。

### 兩個代碼打架：MLA-C02 還是 ME1-C02

**同一頁上出現了兩個新代碼，官方沒有說明兩者的關係。** 上面那段公告寫的是 MLA-C02，但同一頁另有一段：

> The beta exam (ME1-C02) will be available in English only. At general availability, the exam will be offered in English, Korean, Japanese, and Simplified Chinese.

於是 MLA-C02 與 ME1-C02 兩個代碼並列在同一頁，而且**兩段講的 GA 語言清單一致**（英、韓、日、簡中），看起來像同一張考試的兩個名字（beta 期用 ME1-C02、GA 後用 MLA-C02 之類），但**官方頁沒有任何一句話把它們連起來**。

依本系列的紀律，官方來源互相矛盾或語焉不詳時，兩邊都引、標成不確定，不挑一個當事實。所以：

- **確定的**：9/1 有東西開放報名；beta 版限英文；GA 後有四種語言。
- **不確定的**：MLA-C02 與 ME1-C02 是不是同一張考試；9/1 開放報名的是 beta 還是正式版；GA 是哪天。
- **實務影響**：報名前要在官方頁上核對你按下去的那張的代碼，不要憑「反正就是新版 ML 那張」下單。beta 版通常題數更多、時間更長、成績要等，這些差異在報名頁會寫。

### C02 的考綱還沒公布

`machine-learning-engineer-associate-02` 的官方 exam guide 網址今天仍回 404（2026-08-19 實測）。**沒有考綱就沒有備考路徑** —— 現在市面上任何一份「MLA-C02 準備指南」都不可能有官方依據。

所以要走 associate 這一級的人，理性做法是**等 9/1**：官方認證頁自己寫「Check back here on September 1 for more information about the MLA-C02 exam and exam preparation resources」。等 13 天換一份確定的考綱，比花 40 天賭一張即將停考的考試划算。

## 那三張到底分別考什麼

停考議題之外，這三張的分界其實非常乾淨 —— 因為官方各自寫了 out-of-scope 清單，而三份清單彼此幾乎不打架。

| | AIF-C01 | MLA-C01 | AIP-C01 |
|---|---|---|---|
| 一句話 | 說得出來 | 把 ML 上線 | 把別人的模型整合成系統 |
| Domain 權重 | 20 / 24 / 28 / 14 / 14 | 28 / 26 / 22 / 24 | 31 / 26 / 20 / 12 / 11 |
| 最重的一塊 | 基礎模型的應用（28%） | 資料準備（28%） | FM 整合、資料管理與合規（31%） |
| 官方明確**不考** | 寫模型或演算法、資料與特徵工程、超參數調校、建 pipeline 與基礎設施、模型的數學統計分析、實作資安合規協定、開發治理框架 | 設計端到端 ML 架構、制定 ML 策略與最佳實務、整合大量服務或新技術、深入兩個以上 ML 領域、模型量化與精度分析 | 模型開發與訓練、進階 ML 技術、資料工程與特徵工程 |

三份 out-of-scope 讀在一起，分界就出來了：

- **AIF-C01 排除的每一項，幾乎都是 MLA-C01 的 in-scope 任務。** 超參數調校、pipeline、特徵工程 —— AIF 不考，MLA 全考。
- **AIP-C01 排除的每一項，幾乎都是 MLA-C01 的核心。** 模型開發與訓練、進階 ML、資料與特徵工程 —— AIP 全部不考，MLA 全部要考。
- **所以 MLA 與 AIP 不是上下級，是左右兩邊。** MLA 是「訓練與營運自己的模型」，AIP 是「整合別人的基礎模型」。想證明 GenAI 應用能力的人考 MLA，考完手上那張證明的是 SageMaker 訓練與部署；想證明 ML 工程能力的人考 AIP，考完那張明寫不考訓練。
- **AIF 與另外兩張的關係則是真的上下級**：它的排除清單就是另外兩張的工作內容，所以它是唯一一張「三種人都可以先拿」的。

一個判斷小技巧：看到「我要證明我會做 RAG／agent／LLM 應用」就往 AIP；看到「我要證明我會訓練模型、把 ML pipeline 上線」就往 MLA；看到「我要能跟 AI 團隊對話、看懂術語」就往 AIF。**三句話對應不到同一張。**

## 續期圖會反過來決定考試順序

這是最少被寫、但最省錢的一段。依[官方 recertification 頁](https://aws.amazon.com/certification/recertification/)：

| 你持有的 | 續期方式（皆 +3 年） |
|---|---|
| AIF-C01 | 重考 AIF-C01、**或考過 MLA-C01**、**或考過 AIP-C01** |
| MLA-C01 | 重考 MLA-C01、**或考過 AIP-C01** |
| AIP-C01 | 只能重考 AIP-C01 |

而且[考過 AIP-C01 會同時把 AIF-C01、MLA-C01 與 Data Engineer – Associate 各續三年](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)。這張續期圖有兩個方向性的後果：

**一、如果你遲早會考 AIP-C01，AIF-C01 就該早點拿。** $100 這張不會變成長期維護負擔 —— 三年內考過 AIP，AIF 自動續期。反過來「先撐著不考 AIF、等有空一起考」沒有任何節省，只是晚三年才拿到那張。

**二、AIP-C01 是唯一沒有下家的那張。** 它續掉三張，自己只能靠重考續（可用 AWS Certification Account 的五折券，$150）。所以規劃長期成本時，AIP 是每三年的固定支出，另外幾張是它的附贈品。

**三、「考 MLA 來續 AIF」這條路現在不成立。** 它在圖上是有效的，但 MLA-C01 英文版 9/28 就停考，MLA-C02 的續期規則要等官方公布 —— 新代碼上線後續期表通常會跟著改，但那要等 9/1 之後才知道。純粹為了續期而在 40 天內衝一張 MLA-C01，成本效益不對。

另外提醒兩條全域規則：**三張都沒有「上課換效期」的選項**（AWS 的 maintain 只開放給 SAA、Developer、CloudOps、SAP、DOP），**考過之後兩年內不能重考同一張**，所以想靠重考提前續期也行不通。

## 決策：2026 年 8 月下旬的建議路徑

把上面幾段收成可執行的分支。

**如果你要做 GenAI 應用（RAG、agent、LLM 整合）**
→ AIP-C01。不受停考影響，考綱已含 AgentCore。經驗不足的話先補實作，[十週時程](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)裡有換算依據。想先拿一張墊底就順手加 AIF-C01（$100，而且 AIP 會把它續掉）。

**如果你要做 ML 工程（訓練、部署、pipeline、監控）**
→ **等 9/1**。除非你的實務經驗完全對得上官方 target candidate 描述、且能在 9/28 前約到考試。C02 的考綱一公布就能排六到八週的計畫，比賭 40 天穩。

**如果你考日／韓／簡中版**
→ MLA-C01 窗口仍開著，但 GA 日期未公布。要走這條就**現在排時程、把考試日訂在計畫前段**，不要押在末端。

**如果你是 PM／業務／法遵，或工程師想先建詞彙表**
→ AIF-C01。三張裡唯一有繁體中文，$100，v1.1 之後連 MCP 與 agentic AI 都進了考綱（見[備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)裡的 v1.1 異動表）。

**如果你的目標是「證明會做多 agent 系統」**
→ 這三張都不是最直接的答案。AWS 線上最接近的是 AIP-C01 第 2 章的 agentic AI（26% 那塊裡的 7 個技能點），但跨廠商的比對見[多 agent 架構的考點交集](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)。

**如果你的公司主力不是 AWS**
→ 先確認雲端廠商再挑證照。Google 生態只有 [PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide) 一張，規則（尤其是重考罰則）跟 AWS 差很多。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-19 查證） | 什麼時候要重查 |
|---|---|---|
| MLA-C01 英文版停考日 | 2026-09-28 | 9/1 官方更新後 |
| MLA-C02 報名開放 | 2026-09-01 | 9/1 當天 |
| MLA-C02 / ME1-C02 代碼關係 | 同頁並列，官方未說明 | 9/1 之後 |
| MLA-C02 exam guide | 官方網址回 404 | 9/1 之後 |
| MLA-C02 GA 日期與語言 | 未公布 GA 日期；GA 後英韓日簡中 | 9/1 之後 |
| 續期圖 | AIP 續 AIF／MLA／DEA | C02 上線後必查（代碼換了通常會改） |
| 三張費用 | $100 / $150 / $300 | 每季 |
| 及格線 | 700 / 720 / 750 | 每次改版 |

## 參考資料

- [AWS Certified Machine Learning Engineer – Associate 官方認證頁（含 MLA-C02 與 ME1-C02 兩段公告）](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/)
- [MLA-C01 官方 exam guide（四 domain 權重、及格線 720、題型）](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01.html)
- [AWS Certified AI Practitioner 官方認證頁](https://aws.amazon.com/certification/certified-ai-practitioner/)
- [AIF-C01 官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)
- [AWS Certified Generative AI Developer – Professional 官方認證頁](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AIP-C01 官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)
- [AWS Recertification（續期路徑與五折券）](https://aws.amazon.com/certification/recertification/)
- [AWS Certification — After Testing（重考政策）](https://aws.amazon.com/certification/policies/after-testing/)
- [AWS Skill Builder — MLA-C01 Exam Prep](https://skillbuilder.aws/category/exam-prep/machine-learning-engineer-associate-MLA-C01)

**站內相關**

- [AWS AI Practitioner（AIF-C01）備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
- [AWS GenAI Developer Professional（AIP-C01）備考路徑](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)
- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [多 agent 架構的考點交集](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)
- [Google PMLE 備考路徑](/posts/ai/2026-08-18-google-pmle-prep-guide)
