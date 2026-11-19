---
title: "AI Agent Arxiv Digest — 2026-11-20"
date: 2026-11-20
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天三篇從不同角度證明同一件事：agent 評測的信號太弱，不管是自動演化迴圈、企業採購評比，還是自主做實驗的研究 agent，看到的進步都可能只是噪音"
tldr: "Resolution Hypothesis 用千萬次 LLM 呼叫證明主流 agent 自我演化方法的篩選機制幾乎等於隨機猜；跨國銀行的十家 agent 平台評比發現評分員打分幾乎只反映台風優劣（Cronbach's α=0.98）；KIT 的治理帳本證明沒有治理的自動化 ML 實驗會悄悄漏掉一半以上的失敗紀錄"
series:
  name: "AI Agent Arxiv Digest"
  order: 180
---

## 今日總覽

今天三篇論文從完全不同的場景切入，卻指向同一個結論：目前用來評測 agent 的方法，解析度常常不夠看出真正的進步。Resolution Hypothesis 用史上最大規模的重跑實驗（千萬次 LLM 呼叫）證明，agent 自我演化方法裡挑候選、排方法排名的那一步，準確率跟丟硬幣差不多；A Capability Framework for Evaluating Agentic AI Platforms 用一場真實的跨國銀行十家供應商 bakeoff 證明，企業評選 agent 平台時九個「應該獨立」的能力分數其實高度一致，測到的多半是台風而不是能力；Evaluating Governed LLM-Driven ML Experimentation 則示範，沒有強制紀錄機制的自動化 ML 實驗 agent，會悄悄把失敗的嘗試從紀錄裡抹掉，讓結果看起來比實際順利。三篇合起來：不管是機器自己挑、人類評審團挑，還是看任務分數挑，只要評測本身的解析度不夠，再好的方法都會被噪音吃掉。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Agent evolution（Agent 自我演化） | 讓 agent 自己改 prompt、技能或記憶、再靠分數決定要不要保留改動的迴圈，不改模型權重 |
| 評測解析度（Resolution） | 一套評測方法能穩定分辨出的「最小真實進步」；進步小於這個門檻，篩選就跟亂猜一樣 |
| Halo effect（光環效應） | 評分者被整體印象（台風、流暢度）牽著走，導致本來該獨立的幾個面向打分高度一致，測到的其實不是分項能力 |
| Append-only ledger（只能新增的帳本） | 每一次嘗試都強制寫一筆紀錄、不能事後刪除或覆蓋，用來防止失敗被悄悄忽略 |
| Bootstrap 信賴區間 | 用重複抽樣估計一個統計量的不確定範圍，而不是只看單一個點估計值 |
| LLM-as-judge | 讓另一個語言模型來幫忙評分或做選擇，而不是靠人工或固定規則 |

---

## 論文一｜解析度假說：Agent 自我演化的關鍵是能不能認出真正的進步

**The Resolution Hypothesis: Agent Evolution's Key Is Identifying Improvements**
Yuanhao Zeng, Shaocheng Lan, Ao Lu et al.（ShanghaiTech University + ByteDance + BIGAI + SUSTech）　·　arxiv: 2611.23068

連結: [arxiv](https://arxiv.org/abs/2611.23068) · [alphaxiv](https://www.alphaxiv.org/abs/2611.23068)

### TL;DR

測了 7 種 agent 自我演化方法、6 個模型，跑超過一千萬次 LLM 呼叫，發現無論用執行分數還是找另一個 LLM 當裁判，挑出「比較好的那個候選」的準確率都跟丟硬幣差不多（49.7%），而論文裡常見的方法排名，單跑一次只有 33% 機率選到真正最強的方法。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（尚未同行審查；專案頁已公開，作者說完整程式碼與軌跡資料要等論文接受後才釋出） |
| 引用速度 | 發布 3 天，Semantic Scholar API 持續被 rate limit 擋下，無法查得引用數（preprint 剛發布，實際引用數幾乎必為 0） |
| 機構 | ShanghaiTech University、ByteDance、BIGAI、SUSTech |
| 社群反應 | HuggingFace Daily Papers 2026-11-19 上榜，33 個 upvote |
| 可信度 | 通過 — 用正式的變異數拆解（評測內噪音 σ、跑與跑之間真實品質差異 τ）把「方法真的更好」和「這次運氣好」分開，並用空模型（equal-quality null）與統計檢定力公式驗證每個數字 |
| 證據成熟度 | 較完整 — 1,030 次獨立演化、210 萬條測試軌跡、1,000 萬次 LLM 呼叫，橫跨 7 種方法、6 個模型、13 個 benchmark |
| 可復現性 | 部分產物 — 專案頁已上線，但完整程式碼與軌跡資料要等論文接受後才釋出 |
| 為什麼選這篇 | 直接 — 直接檢驗「agent 能不能自己變強」這整條邏輯裡最沒人驗證過的一環：篩選步驟到底可不可靠 |
| 方向新意 | 實質增量 — 第一次用這麼大規模的重跑實驗，把「方法真的贏」和「評測噪音讓它看起來贏」拆開計算 |
| 今日重要性 | 高 — 直接動搖一整批 agent 自我演化論文（GEPA、ReasoningBank 這類方法）宣稱贏過對手的根據 |
| 實務連結 | 明確 — 任何在用分數自動保留或丟棄 prompt、skill、記憶改動的團隊，都正好踩在這篇指出的陷阱上 |
| 編輯信心 | 高 — 主張範圍限定在「目前的評測解析度不夠」，每個數字都對應到描述清楚的實驗 |
| 閱讀建議 | 必讀 — 在做或在用 agent 自我演化／RSI 系統的人 |
| 主要限制 | 完整程式碼與軌跡資料尚未公開（等論文接受後才釋出），目前無法由外部重跑驗證 |

### 領域背景

Agent evolution（用 GEPA 改 prompt、ReasoningBank 存記憶、各種 skill-optimizer 調技能）這幾年聲稱能讓凍結權重的模型在各種 benchmark 上穩定變強，但業界常遇到「同一方法這篇文章贏、那篇文章輸」的怪現象，多半被歸咎於任務不同或 prompt 工程功力，很少有人系統性檢查評測本身夠不夠準。

### 中階導讀

- **問題**：想像你在玩一個「改食譜再試吃」的遊戲——你做 100 份食譜的小變化，每份只給一位評審試吃一次就決定要不要留下來。如果評審的味覺本身就有一兩成的隨機誤差（比方那天有點感冒），真正好吃一成的改動和難吃一成的改動，評審根本分不出來，留下來的只是那次試吃分數剛好高的。
- **方法**：論文把每次評測分數拆成兩塊——「這個改動真的多好」（τ，跑與跑之間的真實差異）和「評測本身的隨機噪音」（σ，同一個改動反覆測也會上下跳動的量）。Terminal-Bench 上 σ 可以到 4.5 個百分點，而論文裡典型的方法差距中位數只有 3.4 個百分點，意味著評一次根本看不出誰贏。他們也直接測「選擇」這一步：給 100 個候選 skill，不管是看執行分數還是找另一個 LLM 來當裁判，挑出較好那個的準確率都在 49–50% 左右，跟丟硬幣沒有差別。
- **為什麼重要**：這代表 agent 自我演化這個方向過去幾年很多論文宣稱的進步，有一部分可能只是評測噪音剛好站在那次實驗這邊，而不是方法真的變強了。

### 深入要點

- Terminal-Bench 上，單次跑分只有 33% 機率選到 4 種文字型方法裡真正最強的（隨機猜是 25%）
- 執行分數選擇器挑出較優候選的準確率 49.7%，LLM-as-judge 裁判也只有 48.6%，統計上都跟 50% 沒有差別
- 候選池裡「比較差」的改動只佔 30.5%，卻佔了被選進下一輪的 62.1%
- 論文裡常被報告的最大進步（中位數 17.6 個百分點），在修掉評測漏洞（例如只認一種答案格式）後掉到中位數 0.8 個百分點 ⚠️（作者自己稽核後重算，尚待外部重跑驗證）
- 演化迴圈內部記錄的驗證分數漲了 6.9 到 9.0 個百分點，但拿同一批改動獨立重新評測，結果只剩 +0.4 到 −3.2 個百分點
- 落地門檻：想在真實專案裡用自動演化／RSI 系統的團隊，至少要先量出自己評測的 σ 和 τ，否則保留下來的改動可能只是雜訊

### Reviewer 一句話評

統計設計紮實、規模罕見（千萬級 LLM 呼叫），對「agent 自我演化有沒有用」給出少見的誠實答案；但完整程式碼和軌跡資料目前還沒公開，外部複現要等論文被接受。

### 給你的 take-away

- 如果你在做 agent 自我演化／RSI 系統：先量出你評測的 σ（同一改動反覆測的噪音）和 τ（不同跑之間的真實差異），再決定要跑幾次才敢保留一個改動，不要只跑一次就接受
- 如果你在讀 agent 論文找方法來用：看到「某方法贏基準線 2–5 個百分點」但只跑一次，先打個問號——這篇的數字顯示，這個量級的差距很可能分不清是真進步還是運氣

---

## 論文二｜企業買 Agent 平台到底在評什麼：十家供應商 bakeoff 揭露的光環效應

**A Capability Framework for Evaluating Agentic AI Platforms in Regulated Enterprises**
Abbas Raza Ali, Muhammad Ajmal Siddiqui, Moona Zahid（Citigroup Inc. + Ernst & Young LLP + NVIDIA Corporation，倫敦）　·　arxiv: 2611.24039

連結: [arxiv](https://arxiv.org/abs/2611.24039) · [alphaxiv](https://www.alphaxiv.org/abs/2611.24039)

### TL;DR

一家跨國銀行的創新實驗室找了十家 agent 平台（H2O.ai、Google、Microsoft、Writer、Letta 等）在九個能力面向上打分，結果九個「應該獨立」的面向彼此一致性高達 Cronbach's α=0.98——代表評分員很大程度是被 demo 整體印象牽著走，而不是真的分別評出記憶、工具呼叫、多 agent 協作等能力。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | Proceedings of the 10th MLSys Conference, 2027（已接受，同行審查過的系統研究會議） |
| 引用速度 | 發布 2 天，Semantic Scholar API 被 rate limit 擋下，無法查得引用數（論文剛被接受，引用數幾乎必為 0） |
| 機構 | Citigroup Inc.、Ernst & Young LLP、NVIDIA Corporation（均為倫敦辦公室） |
| 社群反應 | 未見於 HuggingFace Daily Papers / Papers with Code |
| 可信度 | 通過 — 用真實 10 家供應商的 bakeoff 資料直接做統計檢定（α 值、各面向與總分的排序相關），不是用故事講光環效應 |
| 證據成熟度 | 較完整 — 但論文自己強調這是 demonstration-based 評分，不是動手操作的受控評測，只評估了 Layer 1（能力面），後續執行可靠度、治理關卡、商業價值等層只是提案 |
| 可復現性 | 部分產物 — 評分方法、九維度量表、總分表格都公開；但每位評分員的原始打分沒有保留，因此無法重算評分員間一致性（作者自己承認這是必須改進之處） |
| 為什麼選這篇 | 直接 — 討論的正是企業決定買哪個 agent 平台時依賴的那套評比方法本身可不可信 |
| 方向新意 | 實質增量 — 把「光環效應」這個心理測量學的老概念，第一次用統計方式套進企業 agent 平台採購評比 |
| 今日重要性 | 高 — 任何要在公開 benchmark 之外自辦 bakeoff 選 agent 平台的團隊，都正好是這篇要提醒的對象 |
| 實務連結 | 明確 — 論文附帶具體補救方案（分別打分、要求證據而非口頭保證、保留評分員原始資料） |
| 編輯信心 | 高 — α=0.98 是直接算出來的統計量，沒有超出資料支持的範圍 |
| 閱讀建議 | 必讀 — 負責技術採購／平台選型的人 |
| 主要限制 | 單一機構、供應商協助準備過的 demo 條件（不是盲測），D8 成本／延遲數字是供應商自報，未獨立量測 |

### 領域背景

公開的 agent benchmark（AgentBench、GAIA、WebArena、τ-bench）測的是模型在固定 harness 裡的表現，但企業實際買的是整個平台——orchestration、記憶、治理、工具整合層才是決定成敗的關鍵，而這些目前幾乎沒有公開、可比較的評測方式，買家多半還是看供應商 demo 下判斷。

### 中階導讀

- **問題**：想像公司要選一套系統，找五家供應商各來 demo 一次，每次由同一批人打分「介面好不好用」「功能強不強」「安全性夠不夠」。如果 demo 當天某家表現特別流暢、業務員口條特別好，評分員很容易在所有項目上都給高分——即使這家的某項功能其實普通。這篇論文量化了這件事：九個「應該獨立」的能力面向，實際打分結果幾乎變成同一個分數的九份拷貝。
- **方法**：他們訂出九個維度（反思、工具使用、記憶、規劃、多 agent 協作、易用性、協定支援、量化表現、評測與可解釋性），讓跨部門評審團在三個金融場景（信用風險分析、RAG、流程自動化）上對十家平台打分。算完總分後，再做一次「這九個維度彼此有多獨立」的統計檢定——結果 α=0.98，代表這套量表測到的其實比較接近一個半構念，而不是九個。
- **為什麼重要**：對任何要自己辦 bakeoff 選 agent 平台的團隊，這篇先把陷阱標出來：demo 式評分測到的多半是台風，不是真能力，除非改成要求證據（trace 記錄、評測報告）而不是口頭保證。

### 深入要點

- 十家平台分成三層：第一層（H2O.ai、Google、Microsoft、Writer、Letta）61.7–69.2 分，跟第二層（Glean、CrewAI、UiPath）41.4–43.0 分之間有 18.7 分的落差，遠大於同層內部差距
- 九個維度裡，八個跟總分的排序相關係數 ≥ 0.93，只有「易用性」一項只有 0.66——評審確實能把「好不好用」跟「強不強」分開，但其他八項幾乎測的是同一件事
- Letta（基於 MemGPT）在記憶這一項拿到全場最高分，但總分只排在第一層中段——能力拆解確實能挖出聚合分數藏住的專長
- 用「治理優先」和「開發者優先」兩種不同權重重算總分，三層分級完全沒變，只有層內排名小幅調整——分層結論比較穩，但排名本身對權重敏感
- 每位評審的原始打分沒有保留，因此評審間一致性完全沒法算——論文自己列為必須改進的項目
- 落地門檻：論文提出的補救方案是分維度分開打分、要求 trace 與評測報告等證據而非 demo 印象、各維度由不同小組評分以打破整體印象的汙染

### Reviewer 一句話評

少見地敢把自己辦的 bakeoff 拿出來做統計檢定、承認結果有問題的論文——α=0.98 不是作者想藏的瑕疵，而是這篇的核心發現；但畢竟只是一家機構、一輪 demo 式評分，下一步需要真正盲測、動手操作的受控評測才能驗證光環效應消失後排名會不會變。

### 給你的 take-away

- 如果你的團隊要辦 agent 平台 bakeoff：把九個維度拆開，每個維度找不同的人、不同時段評分，而不是同一批人看完一次 demo 就全部打完；並要求供應商提供 trace 記錄或評測報告而不是只給 demo
- 如果你在看別人發的 agent 平台評比報告：先問一句「這幾個維度的分數彼此獨立嗎」，如果每個維度都高度一致地偏好同一家，很可能測到的是台風不是能力

---

## 論文三｜治理帳本：當自動跑 ML 實驗的 Agent，失敗紀錄自己說了算

**Evaluating Governed LLM-Driven ML Experimentation: Lifecycle, Provenance, and Failure Metrics**
Dowling Wong（Karlsruhe Institute of Technology）　·　arxiv: 2611.23678

連結: [arxiv](https://arxiv.org/abs/2611.23678) · [alphaxiv](https://www.alphaxiv.org/abs/2611.23678)

### TL;DR

把 1,445 次自動 ML 實驗的每一步都強制寫進一本不能事後修改的帳本，結果發現：同樣條件下，沒有這套治理的陽春迴圈會悄悄漏掉「失敗的那一半」——在一組對照測試裡，50 次嘗試中 43 次失敗紀錄直接消失，只留下 7 次成功的，讓整個實驗看起來比實際順利得多。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | KDD 2026 Workshop on Evaluation and Trustworthiness of Agentic AI（ETAAI），Jeju, Korea — workshop 發表，非 archival 但有場次審稿 |
| 引用速度 | 發布 2 天，Semantic Scholar API 被 rate limit 擋下，無法查得引用數（workshop 剛發表，引用數幾乎必為 0） |
| 機構 | Karlsruhe Institute of Technology（KIT），德國 |
| 社群反應 | 未見於 HF Daily Papers，但程式碼與全部 1,445 筆 trial 帳本已公開在 GitHub，並發放 Zenodo DOI |
| 可信度 | 通過 — 用真正獨立跑的「有治理 vs 無治理」對照實驗（不是從同一份紀錄回推），並用 bootstrap 信賴區間量化結果 |
| 證據成熟度 | 較完整 — 核心的治理／漏記對照主張有紮實的對照實驗支撐；次要的記憶效應分析作者自己多次標明是描述性觀察、不是顯著性檢定，其中一個重複實驗還被自己判定「不算獨立複現」而排除 |
| 可復現性 | 完整產物 — 程式碼與全部 1,445 筆 trial 帳本已公開，並聲明所有治理指標都可以不重跑訓練、直接從帳本重算 |
| 為什麼選這篇 | 直接 — 針對自動做 ML 實驗的 agent，提出一套不靠 agent 自己誠實回報的獨立治理機制 |
| 方向新意 | 實質增量 — 把「評測 agent 的過程，不只評結果分數」做成可操作、可重算的治理指標 |
| 今日重要性 | 高 — 任何在用 agent 自動跑 ML 實驗／調參的團隊，都正好暴露在這篇指出的「失敗被悄悄吃掉」風險下 |
| 實務連結 | 明確 — control plane 的設計（scope 校驗、pending-trial guard、append-only ledger）可以直接套用到別的 agent 實驗迴圈 |
| 編輯信心 | 高 — 核心主張（43/50 vs 0/50 完整性）有真正獨立對照組支撐，作者對次要主張的語氣也主動收緊 |
| 閱讀建議 | 必讀 — 在建或在用自動化 ML 實驗／調參 agent 的人 |
| 主要限制 | 單一作者、任務規模仍是研究級（未在真正企業生產環境驗證），記憶效應的次要分析在不同重複實驗之間結果不一致 |

### 領域背景

MLAgentBench、MLE-bench 這類 agent benchmark 問的是「agent 有沒有把任務分數衝高」，AIDE 這類系統則把搜尋狀態留在 agent 自己的迴圈裡——兩者都沒有回答「這個分數是怎麼跑出來的」：agent 有沒有碰了不該碰的檔案、失敗的嘗試有沒有被悄悄丟掉、每個保留或丟棄的決定能不能回溯到證據。

### 中階導讀

- **問題**：想像一個實驗室助理自己跑實驗、自己決定哪些結果值得寫進報告——如果牠只把成功的那幾次寫進筆記本，失敗的直接撕掉不留痕跡，你看報告會覺得這個方法很成功，卻看不到牠試了多少次才矇到一次。
- **方法**：這篇論文把「誰能決定紀錄」這個權力從 agent 手上拿走，交給一個獨立的 control plane——manager（通常是 LLM）只能提出改動，control plane 負責檢查改動範圍、跑訓練、判定要留下還是丟棄，並且不管結果是什麼都強制寫一筆帳。在六種 ML 任務、1,445 次嘗試裡測試同一套規則，包括一個全部 120 次都失敗的極端案例，帳本的溯源完整度在每一種情況下都是 100%。
- **為什麼重要**：作者直接做了一組對照實驗——同樣的任務，把治理拿掉，只留下「只記錄成功」的陽春版迴圈——結果在失敗率 55% 的任務上，無治理版的帳本只留下 7 筆成功紀錄，13 筆失敗的嘗試完全消失不見；在全部失敗的任務上，無治理的帳本直接是空的，跟「這個實驗根本沒跑過」看起來一樣。

### 深入要點

- 對照實驗：50 次嘗試中，無治理版漏記 43 次（全部都是失敗的那些），有治理版漏記 0 次，95% 信賴區間明確顯示無治理完整度低於 1.00（bootstrap 10,000 次重抽樣）
- 跨六個節點、1,445 次嘗試，溯源完整度全部是 100%，包括一個 120 次全部失敗的極端案例
- 記憶效應的次要分析：在大規模 225 次重跑（5 個 seed × 3 種記憶模式）裡，有記憶模式的平均最佳準確率是 0.939–0.941，沒有記憶模式是 0.899 ⚠️（作者自己標注這是診斷用的描述性比較，不是正式顯著性檢定）
- 一組小規模重複實驗被作者自己排除，因為發現第二輪重跑時某個分支其實是接著上一個分支的最終狀態繼續跑，不是獨立重來——主動排除自己不夠乾淨的數據，這在單作者論文裡並不常見
- 落地門檻：要導入這套治理需要重寫 agent harness 的執行迴圈，把「誰能決定留或丟」的權力從 LLM manager 手上明確移交給獨立的 control plane
- Limitation：目前只在研究規模的六個任務上驗證，沒有真正企業生產環境的案例

```diagram
title: 治理前後：失敗紀錄留下來了嗎
desc: 同樣的任務，有治理的帳本在兩個節點都留下 100% 的紀錄；沒有治理的陽春迴圈，在全部失敗的 autoresearch_linux 上帳本直接是空的，在失敗率 55% 的 openml_bank_mkt 上也只留下 35%（這正是 43/50 vs 0/50 完整性對照的來源）
caption: 資料來自論文 Table 9（Governed vs Ungoverned counterfactual）。換算：基線 y=300、繪圖區頂 y=60，數值網域 0–100%，k=(300−60)÷100=2.4，長條頂 y=300−數值×2.4。openml_bank_mkt 的無治理完整度 95% bootstrap CI 為 [15%, 55%]，圖中僅標示點估計值 35%。
---
<svg viewBox="0 0 640 340">
  <text class="dg-text--series dg-c-accent" x="76" y="20" dominant-baseline="central">有治理</text>
  <text class="dg-text--series dg-c-s1" x="180" y="20" dominant-baseline="central">無治理</text>
  <text class="dg-small" x="608" y="20" text-anchor="end" dominant-baseline="central">帳本完整度</text>

  <line class="dg-grid" x1="72" y1="60" x2="612" y2="60"/>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">100%</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">50%</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0%</text>

  <rect class="dg-bar dg-c-accent" x="140" y="60" width="56" height="240"/>
  <rect class="dg-bar dg-c-s1" x="204" y="298" width="56" height="2"/>
  <rect class="dg-bar dg-c-accent" x="380" y="60" width="56" height="240"/>
  <rect class="dg-bar dg-c-s1" x="444" y="216" width="56" height="84"/>

  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="168" y="50" text-anchor="middle" dominant-baseline="central">100%</text>
  <text class="dg-sub dg-text--accent" x="232" y="288" text-anchor="middle" dominant-baseline="central">0%</text>
  <text class="dg-sub" x="408" y="50" text-anchor="middle" dominant-baseline="central">100%</text>
  <text class="dg-sub" x="472" y="206" text-anchor="middle" dominant-baseline="central">35%</text>

  <text class="dg-sub" x="200" y="320" text-anchor="middle" dominant-baseline="central">autoresearch_linux</text>
  <text class="dg-sub" x="440" y="320" text-anchor="middle" dominant-baseline="central">openml_bank_mkt</text>
</svg>
```

### Reviewer 一句話評

單作者論文裡少見的嚴謹——核心主張有真正獨立對照組和 bootstrap 信賴區間撐著，而且作者主動排除自己不夠乾淨的重複實驗、公開全部 1,445 筆原始帳本；但目前仍是研究規模的驗證，距離正式企業 ML pipeline 的治理規範還有距離。

### 給你的 take-away

- 如果你在用 agent 自動跑 ML 實驗或調參：把「誰能決定留下哪個結果」這個權力從 agent 手上移交給一個獨立的記錄層，強制每次嘗試（不管成功失敗）都寫一筆不能事後修改的紀錄，否則你看到的成功率可能只是存活者偏差
- 如果你在評估別人「agent 自動發現 XX」的成果：先問「失敗的嘗試有被完整記錄下來嗎」，如果對方只能給你成功案例，這篇論文告訴你這很可能不是方法特別穩，而是失敗紀錄被悄悄吃掉了

---

## 今日收穫

之前以為「agent 能不能自我變強」是方法設計的問題——誰的 prompt optimizer 更聰明、誰的記憶架構更精巧；今天才發現，更根本的瓶頸其實是「能不能看清楚」——不管是自動演化迴圈裡的選擇器、企業評比裡的評審團，還是 ML 實驗 agent 的紀錄本，評測本身的解析度不夠，再好的方法也會被噪音吃掉。

## 參考資料

- [The Resolution Hypothesis: Agent Evolution's Key Is Identifying Improvements (arXiv:2611.23068)](https://arxiv.org/abs/2611.23068)
- [Resolution Hypothesis 專案頁](https://lineshogan.github.io/resolution-hypothesis/)
- [A Capability Framework for Evaluating Agentic AI Platforms in Regulated Enterprises (arXiv:2611.24039)](https://arxiv.org/abs/2611.24039)
- [Evaluating Governed LLM-Driven ML Experimentation: Lifecycle, Provenance, and Failure Metrics (arXiv:2611.23678)](https://arxiv.org/abs/2611.23678)
- [Governed ML Experimentation 程式碼與 1,445 筆 trial 帳本（GitHub）](https://github.com/dowlingwong/autoresearch_harness)
- [arXiv cs.AI new submissions, 2026-11-19 announcement batch](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL new submissions, 2026-11-19 announcement batch](https://arxiv.org/list/cs.CL/new)
- [arXiv cs.MA new submissions, 2026-11-19 announcement batch](https://arxiv.org/list/cs.MA/new)
