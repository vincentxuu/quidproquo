---
title: "AI Agent Arxiv Digest — 2026-09-25"
date: 2026-09-25
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天三篇論文分別對準長任務 Agent 的三個判斷關卡——記憶該留到讀取時再決定、上下文預算見底時該怎麼刪、以及前沿模型在該走哪條路這件事上其實只對六成"
tldr: "JitMem 把記憶策展從寫入時延後到讀取時,在 ALFWorld、WebShop、τ²-bench 上分別比最強基準多出 16.2、16.3、3.9 個絕對成功率百分點;CliffCompaction 用「只刪不改寫、絕不對壓縮結果再壓縮」的策略把成本砍最多 50%,讓 Kimi K2.6 追平 Opus 4.7;Taste-Bench 證明最強前沿模型在長任務決策分岔點只答對 59.7%,而且加大推理算力沒有幫助"
series:
  name: "AI Agent Arxiv Digest"
  order: 124
---

> 🌏 [English version](/en/posts/daily/2026-09-25-ai-agent-arxiv-digest-en)

## 今日總覽

長任務裡的 Agent,要做的判斷比想像中更多。今天三篇分別對準三個關卡:JitMem 主張記憶不該在寫入當下就決定好要留什麼,而是延後到讀取當下、看到具體任務後再動態生成;CliffCompaction 證明上下文預算見底時,「只刪不改寫」比摘要式壓縮更省錢也更準,讓 Kimi K2.6 追平 Opus 4.7 的表現;Taste-Bench 則從評測端戳破一個常見假設——就算記憶與上下文都管理得當,最強的前沿模型在「該走哪條路」這個分岔點上也只答對 59.7%,而且加大推理算力沒有幫助。同一天至少還有七、八篇論文在打同一場「長任務 Agent 記憶怎麼管」的仗,顯示這是業界正在集中攻堅的問題;但三篇的證據成熟度不同——CliffCompaction 有多個公開 benchmark、多個生產模型與開源程式碼的完整驗證,JitMem 與 Taste-Bench 目前都還侷限在各自建構或挑選的評測環境裡。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Agent(智能代理) | 可以自己規劃步驟、呼叫工具、迭代執行的 AI 系統,不是一問一答的聊天機器人 |
| 長程任務(Long-Horizon Task) | 需要跑很多步驟、累積大量互動歷史才能完成的任務,記憶與上下文管理是最大瓶頸 |
| 上下文壓縮(Compaction) | 上下文快超出模型能處理的長度時,把歷史內容變短以繼續執行的技術,常見做法是摘要或截斷 |
| 寫時策展 vs 讀時策展 | 決定「記憶要留什麼」的時間點:寫時策展在任務完成當下就固定摘要內容;讀時策展延後到真正要用時,依當前任務動態生成 |
| 決策分岔點(Decision Fork) | 軌跡裡出現多個可能方向、其中一個明顯通往更好結果的那一步,是衡量 Agent「判斷力」而非單純成功率的觀察點 |
| 知識蒸餾(Distillation) | 讓看過完整結果的「教師模型」把判斷力傳給沒看過結果的「學生模型」,學生藉此在新任務上做出更好的決定 |

---

## 論文一｜JitMem:記憶不該寫入時就決定好,該等看到任務再說

**Just-in-Time Memory: Learning to Curate Task-Adaptive Memory for LLM Agents**
Yefan Zhou, Yang Li, Zeyu Leo Liu et al.(Salesforce AI Research)　·　arxiv: 2609.27334

連結: [arxiv](https://arxiv.org/abs/2609.27334) · [alphaxiv](https://www.alphaxiv.org/abs/2609.27334)

### TL;DR

把記憶策展從寫入當下延後到讀取當下,讓策展器依當前任務動態生成專屬摘要,在 ALFWorld、WebShop、τ²-bench 三個基準上分別比最強基準多出 16.2、16.3、3.9 個絕對成功率百分點,即使不訓練策展器,光靠「讀時動態生成」的架構改變也已經能打平或超過既有基準。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查,cs.AI 主分類,2026-09-23 提交) |
| 引用速度 | 未查得(Semantic Scholar 本輪持續 429 限流);發布 2 天,尚無引用資料 |
| 機構 | Salesforce AI Research |
| 社群反應 | HuggingFace Daily Papers 有專頁、Papers with Code 已收錄 |
| 可信度 | 通過 — 正文在 ALFWorld、WebShop、τ²-bench 三個標準 agent 模擬基準上有完整對照與消融實驗 |
| 證據成熟度 | 初步 — 核心結果完整且一致,但僅在三個模擬環境驗證,尚未涉及生產流量或非模擬任務 |
| 可復現性 | 部分產物 — 方法、prompt 與超參數列於附錄,未見公開程式碼倉 |
| 為什麼選這篇 | 直接 — 重新定義「該在寫入時還是讀取時決定要記什麼」,是記憶策展的架構層問題 |
| 方向新意 | 實質增量 — 把記憶策展從「寫時固定」改成「讀時依任務動態生成」,並用 GRPO 直接以任務成功訓練 |
| 今日重要性 | 高 — 與同日至少七篇同題論文一起出現,顯示這是業界正在集中攻克的問題 |
| 實務連結 | 明確 — 任何「先寫摘要、後續才用」的記憶架構,都可以直接比較這個框架 |
| 編輯信心 | 中 — 三個基準都是模擬環境,缺乏生產環境或跨模型的外部複現 |
| 閱讀建議 | 必讀 — 正在設計長任務 Agent 記憶架構的工程師 |
| 主要限制 | 檢索器用簡單的 BM25,記憶庫變大變雜時可能成為瓶頸;策展器每個任務多一次 LLM 呼叫,增加延遲與成本 |

### 領域背景

現有 agentic 記憶系統多半在任務完成的當下就把軌跡蒸餾成固定產物(反思、workflow、技能或推理策略),之後靠相似度檢索取用。問題在於,系統必須在還不知道未來查詢長什麼樣子的情況下提前決定什麼值得留下,這個決定一旦做錯,資訊就永久遺失;而訓練這樣的「寫時策展器」很困難,因為一次寫入決定的價值往往要等好幾個任務後才會顯現,形成長程的信用分配問題。

### 中階導讀

- **問題**:想像 Agent 剛完成一個訂餐任務,把整個過程濃縮成一句「訂餐時要先確認地址」存進記憶庫。三個任務之後,遇到一個退貨情境,這句摘要完全派不上用場——因為寫入的時候沒人知道未來會遇到什麼問題,那句摘要只能是「盡量通用」的妥協版本。
- **方法**:JitMem 保留原始軌跡,不在寫入時做任何摘要;等新任務出現、用 BM25 檢索出最相關的幾條原始軌跡後,才由一個記憶策展器讀取當前任務與這些原始軌跡,現場生成一份針對這個任務量身打造的精簡摘要。因為這份摘要馬上就會被同一個任務用掉,策展器可以直接用任務成功與否訓練(GRPO 強化學習),不需要像寫時策展那樣人工把相關任務綁在一起、製造延遲的獎勵訊號。
- **為什麼重要**:對正在設計記憶架構的團隊,這代表「什麼時候該決定要記什麼」本身就是一個可以獨立最佳化的設計選擇,而不是預設一定要在寫入當下做完。

### 深入要點

- ALFWorld、WebShop、τ²-bench 三個標準 agent 模擬基準上全面測試
- 比最強的寫時策展基準分別多出 16.2、16.3、3.9 個絕對成功率百分點
- 即使不訓練策展器(zero-shot),光是「讀時動態生成」這個架構改變就已經打平或超過訓練過的寫時策展基準,顯示增益主要來自「何時策展」而非單純的訓練
- 訓練策展器(GRPO)後增益進一步疊加
- 落地門檻:需要能保存原始軌跡(不做寫時摘要)的儲存架構,以及一個額外的策展 LLM 呼叫,換算成每次任務多一次推理延遲與成本
- Limitation(作者自述):檢索器用簡單的 BM25,記憶庫變大變雜時可能成為瓶頸;策展器每個任務多一次 LLM 呼叫;payload 格式是針對各 benchmark 手動設計的固定格式

### Reviewer 一句話評

把「何時策展記憶」從「寫時」搬到「讀時」是一個乾淨且可驗證的架構主張,三個基準的一致增益也支持這個結論;但比較對象都是既有的簡單基準方法,面對更複雜的生產級寫時記憶系統(例如帶主動整理、去重的版本)是否還有同樣優勢,目前還沒有答案。

### 給你的 take-away

- 如果你在設計 Agent 的長期記憶架構:檢查現有系統是不是在寫入當下就把原始資訊丟棄了——JitMem 的實驗顯示,光是「保留原始資料、延後到讀取時才摘要」這個改動本身就有顯著增益,不必等到有資源訓練策展器才動手
- 如果你在評估別人發布的記憶系統效能宣稱:追問比較基準是「寫時策展」還是「讀時策展」,兩者的效能天花板可能本來就不同

---

## 論文二｜CliffCompaction:上下文預算見底時,只刪不改寫比摘要式壓縮更省

**CliffCompaction: Cost-Efficient Compaction for Long-Horizon Coding Agents**
Trang Nguyen, Eulrang Cho, Bingqing Chen, Tim Dettmers(Carnegie Mellon University + Bosch Center for AI)　·　arxiv: 2609.26779

連結: [arxiv](https://arxiv.org/abs/2609.26779) · [alphaxiv](https://www.alphaxiv.org/abs/2609.26779)

### TL;DR

自動壓縮工具 CliffCompaction 在有限上下文預算下,靠「只截斷或刪除、絕不改寫」的策略把成本降最多 50%,同時維持或提升 Terminal-Bench 表現,並在 KernelBench 上刷新 state-of-the-art;搭配平行測試時算力擴展,CliffCompaction 讓 Kimi K2.6 追平 Opus 4.7、且以更低成本超過 Opus 4.6 與 GPT-5.3 Codex。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查,cs.AI 主分類、cs.LG／cs.SE 跨列,2026-09-22 提交) |
| 引用速度 | Semantic Scholar 已查得,citationCount 0(發布 2 天,尚無引用) |
| 機構 | Carnegie Mellon University + Bosch Center for AI |
| 社群反應 | HuggingFace Daily Papers 未上榜;作者本人於 X/Twitter 發佈宣傳,並被第三方工具追蹤站(ai-tldr.dev、jjakimoto/research-issues)收錄 |
| 可信度 | 通過 — 正文在 SWE-bench Verified、Terminal-Bench 2.0、KernelBench 三個公開 benchmark 上都有具體數字,並與多個生產模型直接比較 |
| 證據成熟度 | 較完整 — 涵蓋多 scaffold(Claude Code、Codex、OpenHands)、多模型、消融實驗,並在 Limitations 一節明講何時無效 |
| 可復現性 | 完整產物 — GitHub 開源 scaffold-agnostic API-proxy 實作 |
| 為什麼選這篇 | 直接 — 直接回答「上下文預算用完了要丟什麼」,是長任務 Agent 最基本的工程問題 |
| 方向新意 | 應用改寫 — 「只刪不改寫」的核心概念並非全新,但把它做成可插入任何 harness 的生產級工具並系統化驗證是本篇貢獻 |
| 今日重要性 | 高 — 作者是 QLoRA / bitsandbytes 作者 Tim Dettmers,且已與 Claude Code、Codex 直接相容 |
| 實務連結 | 明確 — 開源 API-proxy 可直接接上現有 coding agent,不需重寫 Agent 邏輯 |
| 編輯信心 | 高 — 多 benchmark、多模型、開源程式碼,主張範圍(保守截斷優於摘要式壓縮)可被現有證據支持 |
| 閱讀建議 | 必讀 — 任何在維運生產 coding agent 或長任務 harness 的團隊 |
| 主要限制 | 效益隨 scaffold 與任務複雜度而變,系統提示與工具定義等固定元件先吃掉一部分預算;未與「訓練模型自己管理上下文」或外部記憶庫方法比較,作者說明是資源限制而非設計排除 |

### 領域背景

Coding agent 常需要處理跨越數百萬 token 的上下文,超出模型的 context window 後就必須壓縮或開新 session。既有做法多半靠摘要或改寫舊內容來塞進預算,但摘要本身會流失細節、改寫可能引入與原始事實不符的內容,長時間累積下來容易讓 Agent 逐漸偏離正確軌道(context drift)。

### 中階導讀

- **問題**:想像一個 coding agent 已經跑了 50 萬個 token 的工具呼叫與檔案內容,快超出上下文窗口。傳統做法是叫另一個 LLM 把這些內容摘要成幾千字——但摘要一定會漏掉細節,而且如果之後又要再摘要一次已經摘要過的內容,誤差會像滾雪球一樣愈滾愈大。
- **方法**:CliffCompaction 反其道而行,壓縮時只做截斷或直接刪除,絕不重新改寫或摘寫內容,確保保留下來的每一段文字都完全忠實於原文;而且「絕不對壓縮結果再壓縮」——每一輪壓縮都只作用在原始內容上,前一輪壓縮的輸出會被捨棄,避免壓縮誤差隨著回合數累積。這個機制包成一個與 scaffold 無關的 API-proxy,可以直接插進 Claude Code、Codex 等既有 harness,不需要改 Agent 本身的程式碼。
- **為什麼重要**:對任何在維運長任務 coding agent 的團隊,這代表上下文預算管理的問題不一定要靠更聰明的摘要模型解決——有時候「保守但確定」的截斷策略,反而比「聰明但可能失真」的摘要更可靠也更便宜。

### 深入要點

- SWE-bench Verified 上,CliffCompaction 讓 GLM-5.1 與 Kimi K2.6 在僅 32K 與 16K token 的上下文門檻下,仍維持全上下文的成功率
- Terminal-Bench 2.0 上,成功率提升的同時成本降低 50%
- 平行測試時算力擴展下,CliffCompaction 讓 Kimi K2.6 追平 Opus 4.7 的表現,並以更低成本超過 Opus 4.6 與 GPT-5.3 Codex;在 Terminal-Bench 上,用不到兩次全上下文執行的成本換來超過 10 個百分點的成功率提升
- KernelBench 上支援跨越百萬 token 的連續學習:200 步後 CUDA 核心加速達 2.23 倍,400 步後達 3.58 倍,超過專門設計的搜尋演算法與訓練過的專用 agent ⚠️(作者自測,尚未外部複現)
- 落地門檻:作者已開源與 scaffold 無關的 API-proxy 實作,可直接接上 Claude Code、Codex 等現有 harness,不需重寫 Agent 邏輯
- Limitation(作者自述):效益隨 scaffold 與任務複雜度而變,不同 scaffold 需要的最低上下文門檻不同,效益僅在中長程任務上顯著;比較侷限於在推論時直接操作對話歷史的方法,未涵蓋訓練模型自行管理上下文或維護外部記憶庫的方法

### Reviewer 一句話評

「只刪不改寫、絕不對壓縮結果再壓縮」是一個簡單到近乎保守的設計原則,但作者用 SWE-bench Verified、Terminal-Bench 2.0、KernelBench 三個公開基準與多個生產級模型的直接對照,扎實證明了這個保守策略反而優於更複雜的摘要式壓縮,而且已經開源到可以直接插進現有 harness;有待觀察的是它在系統提示與工具定義本身就佔掉大半預算的輕量級 scaffold 上是否還有同樣優勢。

### 給你的 take-away

- 如果你在維運會跑到上下文上限的長任務 coding agent:直接試試看 CliffCompaction 的開源 proxy,尤其是如果你現在用的是摘要式壓縮——這篇的結果顯示「只刪不改寫」在多個基準上都更省成本
- 如果你在設計自己的壓縮策略:記住「不要對壓縮結果再壓縮」這條規則,每輪只作用在原始內容上,能避免壓縮誤差隨回合數累積

---

## 論文三｜Taste-Bench:最強前沿模型在該走哪條路這件事上,只答對六成

**The Tasteful Agent: Measuring and Improving Taste in Long-Horizon Tasks**
Wenbo Pan, Zhichao Liu, Shujie Liu et al.(Microsoft)　·　arxiv: 2609.25804

連結: [arxiv](https://arxiv.org/abs/2609.25804) · [alphaxiv](https://www.alphaxiv.org/abs/2609.25804)

### TL;DR

Taste-Bench 從真實 agent 執行紀錄中挖出 502 個決策分岔點,測試 Agent 能否在還不知道結果的情況下選對方向,最強的前沿模型也只答對 59.7%,而且加大推理算力沒有幫助;把「看過結果的教師模型」的判斷蒸餾給學生模型後,學生在未見過的任務上判斷力進步,連帶讓保留的 SWE-bench Pro 任務端到端成功率也跟著提升。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查,cs.AI 主分類,2026-09-21 提交) |
| 引用速度 | 未查得(Semantic Scholar 本輪持續 429 限流);發布 4 天,尚無引用資料 |
| 機構 | Microsoft |
| 社群反應 | HuggingFace Daily Papers 117 個讚(2026-09-23 上榜);GitHub 已開源,2 顆星(剛發布) |
| 可信度 | 通過 — 502 題分岔點來自真實 agent 執行紀錄,並有人工審查覆核構造流程,附完整 reproducibility statement |
| 證據成熟度 | 初步 — 主張範圍限定在「從已知結果的軌跡中挖出的分岔點」,尚未驗證即時面對全新未知任務的表現 |
| 可復現性 | 完整產物 — benchmark 釋出於 HuggingFace Datasets,評測程式碼與所有受測模型結果釋出於 GitHub |
| 為什麼選這篇 | 間接 — 不提出新架構,而是揭露現有 Agent 評測的盲點:沒人在單獨量測「選對方向」這件事 |
| 方向新意 | 實質增量 — 首次把「判斷力」從端到端成功率獨立拆出來衡量,並證明這個能力可以被蒸餾訓練 |
| 今日重要性 | 高 — 最強模型只對 59.7%,且「加大 reasoning budget 沒用」直接挑戰「算力堆上去就會變好」的預設 |
| 實務連結 | 推測 — 對做研究型或工程型 Agent 平台的團隊有評測參考價值,但尚未看到落地產品案例 |
| 編輯信心 | 中 — 主張本身有清楚證據支持,但整個 benchmark 建立在作者自己收集的軌跡池上,外部複現還未發生 |
| 閱讀建議 | 必讀 — 做 Agent 評測或研究型 Agent 的團隊;略讀 — 一般開發者 |
| 主要限制 | 論文沒有獨立的「Limitations」章節;所有分岔點都來自作者自己收集的兩個軌跡池,訓練與測試資料某種程度上同源,外部任務與其他實驗室的複現還沒有發生 |

### 領域背景

現有的長任務 agent benchmark 大多只看「最後有沒有成功」這個端到端指標,沒有人單獨衡量 Agent 在過程中每一次「該選哪個方向」的判斷力——但長任務往往由一連串這樣的分岔點組成,選錯一次可能就決定了整個任務的成敗,而端到端成功率沒辦法告訴你問題出在哪個分岔點。

### 中階導讀

- **問題**:想像兩個工程師拿到同一個除錯任務,一路上都做對了大部分決定,但其中一人在某個關鍵時刻選擇繼續深挖某個假設、另一人選擇改用別的方法排查——選對的那個人任務成功,選錯的那個人最後失敗。這個當下的選擇,事後回頭看很清楚該怎麼選,但在做決定的當下,兩個方向看起來都合理。
- **方法**:Taste-Bench 從已經完成、結果已知的真實 agent 執行紀錄裡回頭挖掘這種分岔點——一種是同一個任務的兩次嘗試,一次成功一次失敗,取兩者分岔的那一步;另一種是單一軌跡裡,Agent 先走了一條後來被放棄的路、再改走另一條並成功的「繞路」時刻。挖出分岔點後,把分岔前的軌跡當題目、兩個方向當選項,讓待測模型在不知道結果的情況下選——正確答案就是實際上通往成功的那個方向。
- **為什麼重要**:這代表「Agent 到底哪裡判斷力不夠」現在可以被獨立量化,而不是只能從一次端到端失敗回頭猜測是哪個環節出了問題——對想要有針對性地改進 Agent 判斷力的團隊,這是一個新的診斷工具。

### 深入要點

- 502 題分岔點,來自 SWE-bench Pro 的 2,677 筆評分過的工程軌跡(517 個任務、11 個 repository)與 METR MALT 公開釋出的 1,132 筆研究型軌跡(RE-Bench 與 HCAST 子集)
- 目前最強的前沿模型只答對 59.7% 的題目
- 分岔點的關鍵證據若出現在軌跡較後段,所有受測模型的正確率都明顯更低
- 加大模型的推理算力(reasoning budget)並不會提升正確率 ⚠️(作者自測,尚未外部複現)
- 把「看過結果的教師模型」的判斷蒸餾給學生模型後,學生在未見過任務上的判斷力進步,把這個判斷力當建議注入 Agent 後,連帶提升了在保留的 SWE-bench Pro 任務上的端到端成功率
- 落地門檻:benchmark 與評測程式碼、所有受測模型的結果已完整釋出,但分岔點的建構高度依賴作者自己收集的 agent 執行池,換到別的任務類型或 scaffold 需要重新挖掘
- Limitation:論文沒有獨立的「Limitations」章節;所有分岔點都來自作者自己收集的兩個軌跡池(SWE-bench Pro 子集與 METR MALT),訓練與測試資料某種程度上同源

### Reviewer 一句話評

把「Agent 的判斷力」從端到端成功率裡獨立拆出來衡量,是目前評測方法論裡少見但切中要害的角度,「加大算力沒用」這個發現也直接挑戰了一個常見預設;但整個 benchmark 建立在作者自己收集的軌跡池上,訓練與測試某種程度上同源,距離獨立的跨任務、跨團隊複現還有一段路。

### 給你的 take-away

- 如果你在做研究型或工程型 Agent 平台的評測:把「判斷力」和「端到端成功率」分開看,Taste-Bench 的分岔點構造方法(同任務兩次嘗試比對、單軌跡繞路偵測)可以直接借用來自建類似的診斷工具
- 如果你負責提升 Agent 的長任務表現:不要預設加大 reasoning budget 就能解決判斷力不足的問題——這篇顯示兩者可能無關,蒸餾訓練判斷力才是這篇驗證有效的方向

---

## 今日收穫

之前以為長任務 Agent 的效能瓶頸主要是「記憶容量不夠」或「上下文預算不夠」;今天發現真正稀缺的是三個更根本的判斷——什麼時候該決定要記什麼(JitMem 把它延後到讀取當下)、預算見底時該怎麼刪(CliffCompaction 選擇只刪不改寫、絕不重複壓縮)、以及分岔點上該選哪條路(Taste-Bench 證明連前沿模型都只對六成,而且加大算力沒用)。同一天至少七、八篇論文在打同一場「Agent 記憶怎麼管」的仗,這代表這已經不是單一團隊的偏好,而是整個領域正在集中攻堅的核心問題。

## 參考資料

- [Just-in-Time Memory: Learning to Curate Task-Adaptive Memory for LLM Agents](https://arxiv.org/abs/2609.27334)
- [JitMem — alphaxiv](https://www.alphaxiv.org/abs/2609.27334)
- [JitMem — Papers with Code](https://paperswithcode.co/paper/2609.27334)
- [CliffCompaction: Cost-Efficient Compaction for Long-Horizon Coding Agents](https://arxiv.org/abs/2609.26779)
- [CliffCompaction — alphaxiv](https://www.alphaxiv.org/abs/2609.26779)
- [CliffCompaction — code](https://github.com/nguyenvuthientrang/cliffcompaction)
- [The Tasteful Agent: Measuring and Improving Taste in Long-Horizon Tasks](https://arxiv.org/abs/2609.25804)
- [Taste-Bench — alphaxiv](https://www.alphaxiv.org/abs/2609.25804)
- [Taste-Bench — dataset](https://huggingface.co/datasets/wenbopan/taste-bench)
- [Taste-Bench — code](https://github.com/wbopan/tastebench)
- [arXiv cs.AI new listings](https://arxiv.org/list/cs.AI/new)
- [HuggingFace Daily Papers](https://huggingface.co/papers)
