---
title: "AI Agent Arxiv Digest — 2026-11-26"
date: 2026-11-26
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "三篇論文從三個角度逼近同一層:agent 的 context/記憶——訓練可以讓它更穩,評測卻會被它的不穩定拖垂,一旦被共用,它還能變成攻擊者的潛伏管道"
tldr: "RECAP 用行為失真度當訓練訊號,context 壓縮在深度搜尋與軟體工程任務上比純任務獎勵高 4.6 與 4.3 個百分點;Adobe 團隊對部署中的 agentic RAG 系統同題跑十次,retrieval 命中率在任一次成功 69.4% 與每一次都成功 50.9% 之間漂移,分歧過半源頭在 retrieval 規劃而非生成;MIMPA 顯示只要正常參與權限,就能讓誤導內容披著共享記憶裡「團隊過去的成功經驗」重新出現,TruthfulQA 上攻擊成功率達 79.5%"
series:
  name: "AI Agent Arxiv Digest"
  order: 186
---

## 今日總覽

今天三篇論文,從三個不同角度逼近同一個問題:agent 存取、累積、共用的 context/記憶,到底值得信任到什麼程度。RECAP 是少見的正面進展——只要用對學習訊號,context 壓縮可以在幾乎不犧牲效能的情況下把長任務塞進更小的視窗。但 Adobe 團隊對自家部署系統連跑 7390 次的研究顯示,agentic RAG 的單次評測分數幾乎沒有意義:同一題跑十次,retrieval 命中率在 50.9% 到 69.4% 之間漂移,而分歧的源頭過半發生在 retrieval 規劃,不是生成。MIMPA 則把這個脆弱性推到安全層面——當 multi-agent 系統把「成功協作」存進共享記憶重複使用,一個只有正常參與權限的內部 agent,就能讓錯誤資訊披著「團隊過去的成功經驗」外衣持續發揮影響。三篇的證據成熟度不同,但共同指向一件事:讓 agent「記住」和「共用」context,既是今天最值得投資的能力,也是最沒被誠實檢視的風險面。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Context 壓縮(Context Compaction) | 把 agent 互動歷史濃縮成一段摘要,讓 agent 在有限 context window 內繼續工作 |
| 行為失真度(Behavior Distortion) | 量化「壓縮後的行為」跟「沒壓縮時的行為」差多少的指標,差距越小代表摘要保留得越好 |
| Agentic RAG | agent 自己決定要搜尋什麼、搜幾次、什麼時候停,不是固定一次檢索就生成答案 |
| 任一次/每一次成功(Any-run / Every-run) | 評測 agent 時,「十次裡至少一次成功」跟「十次都成功」是兩個差很大的數字 |
| 共享記憶(Shared Memory) | multi-agent 系統把過去協作成功的紀錄存起來,之後依相似度檢索重複使用 |
| 攻擊成功率(ASR) | 對抗測試中,原本答對的案例被成功誘導成指定錯誤答案的比例 |

---

## 論文一｜RECAP:用「行為保真」訓練 agent 學會自己壓縮 context

**RECAP: Training Long-horizon LLM Agents with Context Compaction**
Yulun Jiang, Maria Brbic, Michael Moor et al.（EPFL + ETH Zurich）　·　arxiv: 2611.31258

連結: [arxiv](https://arxiv.org/abs/2611.31258) · [alphaxiv](https://www.alphaxiv.org/abs/2611.31258)

### TL;DR

用「壓縮後的行為要跟原本行為盡量一致」當訓練訊號,在 32K context 限制下,深度搜尋與軟體工程任務的準確率比純任務獎勵的 RL 基準高 4.6 與 4.3 個百分點,更接近無壓縮 128K 視窗的上限。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查) |
| 引用速度 | 今天進入 arXiv cs.CL /new 公告批次,太新,Semantic Scholar 多次查詢回 429(rate limit),尚無引用資料可查 |
| 機構 | EPFL + ETH Zurich |
| 社群反應 | 查詢時未見於 HuggingFace Daily Papers / Papers with Code |
| 可信度 | 通過 — 正文提供完整梯度推導、兩個任務環境(BrowseComp-Plus 深度搜尋、SWE-bench Verified 軟體工程)、消融實驗拆解兩個學習訊號各自貢獻,以及跨 context window 長度的泛化測試 |
| 證據成熟度 | 初步 — 核心結果有消融與多個對照組支撐,但只在單一 4B 模型、兩個任務領域驗證,作者自己列為未來工作 |
| 可復現性 | 部分產物 — GitHub 有程式碼,但正文未附完整訓練設定重跑腳本的細節確認 |
| 為什麼選這篇 | 直接 — context 壓縮是長任務 agent 最直接的工程瓶頸,這篇直接處理「怎麼訓練 agent 自己做好這件事」 |
| 方向新意 | 實質增量 — 把「壓縮後行為該保留什麼」拆成摘要獎勵與後續動作自我蒸餾兩個訊號,且不需要額外 rollout |
| 今日重要性 | 高 — 幾乎所有生產 agent harness 都在用 context compaction,這篇提供具體可比較的訓練方法改善幅度 |
| 實務連結 | 明確 — 可作為 RL 訓練 agent 時,context compaction 模組訓練目標設計的參考 |
| 編輯信心 | 中 — 數字具體且有消融支撐,但樣本侵限於單一模型規模與兩個任務域,敘述強度需收在這個設定內 |
| 閱讀建議 | 必讀 — 對正在訓練或微調長任務 agent、需要處理 context budget 的團隊直接相關 |
| 主要限制 | 只在 Qwen3.5-4B、兩個任務領域驗證;且隱含「完整 context 下的行為本身值得保留」這個前提——若原始行為已有繞路,壓縮後只會被更精確地複製,而不會被糾正 |

### 領域背景

Context compaction 是目前 agent harness 最常見的做法——context 超出預算時,把歷史濃縮成摘要繼續用。過去靠手寫的摘要 prompt,或用最終任務成功與否反推訓練訊號,但長任務裡一次壓縮的影響會傳到後面好幾步甚至下一次壓縮,光靠任務結果,訊號非常稀疏。

### 中階導讀

- **問題**:想像一個深度研究 agent 搜了 50 步之後 context 快爆了,必須把前面的搜尋紀錄壓成摘要繼續工作。如果摘要漏掉關鍵線索,agent 接下來每一步都會走偏,但要好幾步後才會發現,也不知道該怪哪次摘要。
- **方法**:RECAP 的核心想法是「好的摘要」應該讓 agent 接下來的行為,跟沒被壓縮、看得到完整歷史時的行為盡量一致。把「壓縮後的行為」跟「完整 context 下的行為」比對,中間差距(用 KL 散度量化)拆成兩股訓練訊號——摘要本身學到「差距小的摘要值得被鼓勵」,壓縮後的每個動作則直接拿完整 context 下的模型當老師蒸餾,兩股訊號跟任務獎勵加在一起訓練,不需要額外 rollout。
- **為什麼重要**:context 壓縮不用只靠最終任務結果這種稀疏訊號學,每一次壓縮本身都有直接可優化的目標,讓 agent 更快學會什麼樣的摘要不會讓後面的自己迷路。

### 深入要點

- BrowseComp-Plus(深度搜尋):32K 限制下 RECAP 準確率 62.8%,比純任務獎勵基準 58.2% 高 4.6 個百分點,只用 128K 視窗四分之一的長度就逼近無壓縮 128K 基準的 63.8%
- SWE-bench Verified(軟體工程):32K 限制下 RECAP 準確率 51.1%,比基準 46.8% 高 4.3 個百分點,逼近 128K 無壓縮基準的 55.5%
- 消融實驗:只加摘要獎勵訊號時,BrowseComp-Plus 準確率反而掉到 56.7%;只加自我蒸餾訊號時提升到 60.3%;兩者合併才達到 62.8%,兩股訊號互補
- 效率副產物:RECAP 訓練出的 agent 平均用更少工具呼叫次數與 token 總量完成任務,作者推測是壓縮後行為更一致,減少重複或多餘的探索
- Limitation:只驗證到 Qwen3.5-4B 單一模型規模與兩個任務域,更大模型規模、更多任務類型與多次壓縮疊加的情境是否仍成立,作者明確列為未來工作

### Reviewer 一句話評

用 KL 散度把「保留行為」量化成可優化的訓練訊號,設計簡潔、消融實驗清楚拆解貢獻,是今天少見能直接改善 agent 訓練方法的正面結果;但方法隱含「完整 context 下的行為本身值得保留」這個前提,如果完整 context 時 agent 自己就會繞路,RECAP 目前只會讓壓縮後的版本更精確地複製這些繞路,而不會糾正它。

### 給你的 take-away

- 如果你在訓練或微調需要長任務 context compaction 的 agent:RECAP 的行為失真訊號設計(摘要獎勵 + 後續動作自我蒸餾)比純靠任務結果反推更直接,可作為訓練目標設計的參考起點
- 如果你在評估類似的 context 管理論文:優先看它是否測試了多個模型規模與任務域,以及多次連續壓縮疊加時效果是否還能保持,這兩點是 RECAP 自己承認還沒覆蓋的部分

---

## 論文二｜Agentic 系統需要多次評測:同一題跑十次,retrieval 命中率在 51% 到 69% 之間漂移

**Agentic Systems Need Multi-Run Evaluation: A Study of Retrieval and Response Variability in a Deployed Enterprise RAG System**
Karan Gupta, Sumit Bhatia, Yunyao Li（Adobe）　·　arxiv: 2611.31266

連結: [arxiv](https://arxiv.org/abs/2611.31266) · [alphaxiv](https://www.alphaxiv.org/abs/2611.31266)

### TL;DR

把部署中的企業級 agentic RAG 系統對 739 個問題各跑 10 次,retrieval 命中率「任一次成功」是 69.4%,「每一次都成功」只剩 50.9%,可歸因的分歧裡過半(53.5%)發生在 retrieval 規劃階段,不是生成。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查) |
| 引用速度 | 今天進入 arXiv cs.CL /new 公告批次,太新,Semantic Scholar 多次查詢回 429,尚無引用資料 |
| 機構 | Adobe(印度 Noida + 美國 San Jose) |
| 社群反應 | 查詢時未見於 HuggingFace Daily Papers / Papers with Code |
| 可信度 | 通過 — 739 題 ×10 次(共 7390 次)真實執行的部署系統數據,明確的實驗設定與統計方法,文末附完整的六點 Limitations 自我檢討 |
| 證據成熟度 | 較完整 — 核心「分歧歸因」結論靠客觀的 Hit 比對與 trace 比較,不依賴 LLM 裁判;但「agentic 比 non-agentic 更全面但更不 grounded」這個次要結論靠未經人工驗證的 GPT-4o 裁判,成熟度較低 |
| 可復現性 | 未提供 — 單一部署系統的內部研究,未見程式碼或資料集公開 |
| 為什麼選這篇 | 直接 — 直接挑戰業界把 agent 單次跑分當效能指標的習慣做法 |
| 方向新意 | 實質增量 — 首次把「兩次執行在哪一步開始分歧」用 trace-level 歸因量化,不只是說有變異,而是指出變異主要在 retrieval 規劃 |
| 今日重要性 | 高 — 幾乎所有 agentic RAG 系統的對外效能數字都是單次評測,這篇說明這種做法可能隱藏嚴重的可靠度問題 |
| 實務連結 | 明確 — 第一輪並行搜尋的數量單一因素就解釋 20.1% 的分歧,可直接對照自己系統的 retrieval 規劃邏輯去檢查 |
| 編輯信心 | 高 — 對「分歧歸因」與「品質 trade-off」兩類結論的證據強度做了清楚區分,且主動列出 LLM 裁判未經人工驗證的限制 |
| 閱讀建議 | 必讀 — 對任何正在評測或對外報告 agentic RAG 效能數字的團隊直接相關 |
| 主要限制 | grounding/comprehensiveness 的比較依賴未經獨立人工標註驗證的 GPT-4o 裁判;但這點不影響「分歧源頭在 retrieval 規劃」這個靠客觀 Hit 指標得到的核心發現 |

### 領域背景

RAG 系統過去幾乎都用單次執行評一個分數,agentic RAG 多了一層:agent 自己決定要搜幾次、怎麼搜、什麼時候停,這些決策是取樣出來的,同一題跑兩次可能走完全不同的 retrieval 路徑。現有的 RAG 評測工具量的是忠實度、相關性等單次輸出品質,沒有一個量「這個分數明天重跑還一樣嗎」。

### 中階導讀

- **問題**:想像你問一個企業文件 agent「產品 B 的管理員與使用報告類型」,它這次可能搜了四次(包含審計日誌),下次只搜三次(聚焦管理報告類型)——同一個問題,兩次 retrieval 結果就不一樣,答案當然也可能不一樣。只跑一次就拿分數去比較兩個系統版本,根本不知道那個分數是運氣好還是真的更強。
- **方法**:作者對部署中的系統跑 739 題各 10 次(共 7390 次執行),記錄每次完整 trace。分開算「任一次成功」(69.4%)跟「每一次都成功」(50.9%)兩個數字,中間 18.5 個百分點的落差就是 run-to-run 的不穩定程度;再對 45 組兩兩配對的回應做 trace 比對,找出兩次執行第一次出現差異的那一步,歸類成 routing、retrieval、reasoning、trace depth、generation 五種分歧來源。
- **為什麼重要**:可歸因的分歧裡超過一半(53.5%)發生在 retrieval 規劃階段,其中光是第一輪要並行搜幾次這一個決策就解釋了 20.1%——很多人以為的生成不穩定,源頭其實更早,在 agent 決定怎麼搜的那一步。

### 深入要點

- Retrieval 命中率:任一次成功 69.4%、每一次都成功 50.9%、單次平均 61.5%,三個數字差距達 18.5 個百分點,沒有單一數字能代表系統的真實可靠度
- 8092 組分歧回應配對裡,retrieval 規劃佔 43.9%(第一輪並行搜尋數量單獨佔 20.1%),reasoning 佔 17.0%,generation(retrieval 流程相同、只是最後文字不同)佔 18.0%
- Agentic vs 非 agentic 基準(只搜一次就生成):retrieval 命中率幾乎相同(61.5% vs 61.8%),但 agentic 版本 comprehensiveness 高 22.6 個百分點、groundedness 卻低 12.8 個百分點——多搜不代表答案更可靠,是全面度與貼合來源的取捨
- 185 組分歧回應配對裡,兩次執行在完全相同的 retrieval pipeline 下給出互相矛盾的事實性說法,作者強調這不是用詞不同的表面差異,是真的傳達了不一樣的資訊
- Limitation:用 GT 文件 URL 當 retrieval 正確性的替代指標(可能漏掉用別的頁面也答對的案例),且 agentic vs 非 agentic 的品質比較靠未經人工標註驗證的 GPT-4o 裁判

### Reviewer 一句話評

7390 次真實部署執行加上 trace-level 歸因,是少見能把 run-to-run 變異具體定位到 pipeline 哪一步的實證研究,方法交代得很誠實;但這篇只研究單一企業系統的單一場景,「分歧主要來自 retrieval 規劃」這個結論能不能套用到其他 agentic RAG 架構,還不知道。

### 給你的 take-away

- 如果你在對外報告或比較 agentic RAG 系統的效能數字:不要只跑一次就拿分數比較版本差異,至少跑同一題多次看任一次/每一次的落差,否則可能把雜訊當成進步
- 如果你在設計 agentic RAG 的 retrieval 邏輯:優先檢查「第一輪要並行搜幾次」這類規劃決策是否被意外隨機化,這篇顯示這一步單獨解釋了五分之一的 run-to-run 分歧,相對容易透過系統設計變成可控的決定

---

## 論文三｜MIMPA:當「成功的協作」被存進共享記憶,就變成內部攻擊者的持久管道

**When Successful Collaboration Becomes an Attack Surface: Insider Memory Poisoning in Multi-Agent Systems**
Jihyung Ahn, Buru Chang（Korea University）　·　arxiv: 2611.31307

連結: [arxiv](https://arxiv.org/abs/2611.31307) · [alphaxiv](https://www.alphaxiv.org/abs/2611.31307)

### TL;DR

在 multi-agent debate 系統裡,只用正常參與權限、不直接碰記憶寫入,就能讓一次其實答對的協作紀錄裡藏著針對性 payload,之後被檢索到時誘導善意 agent 說出指定的錯誤答案,在 TruthfulQA 上攻擊成功率達 79.5%,遠超過直接說服等既有內部攻擊手法的 18.1%。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查,cs.MA 分類) |
| 引用速度 | 今天進入 arXiv cs.MA /new 公告批次,太新,Semantic Scholar 多次查詢回 429,尚無引用資料 |
| 機構 | Korea University |
| 社群反應 | 查詢時未見於 HuggingFace Daily Papers / Papers with Code |
| 可信度 | 通過 — 3 個 benchmark × 2 個 backbone × 2 種記憶設定的完整對照,拆解 Storage/Retrieval/Influence 三階段貢獻,附 auditing agent 與消融實驗,程式碼公開 |
| 證據成熟度 | 初步 — 核心 ASR 數字有完整消融支撐,但攻擊者「事先知道 target task 與想誘導的錯誤答案」是強假設,未測試攻擊者不知道未來任務時的效果 |
| 可復現性 | 完整產物 — 程式碼公開在 GitHub,附完整任務序列、payload 設計與 prompt |
| 為什麼選這篇 | 直接 — 直接揭露「共享記憶重複使用」這個越來越常見的 multi-agent 設計本身就是安全破口 |
| 方向新意 | 實質增量 — 跟既有的 AgentPoison、MINJA 等記憶投毒方法不同,payload 透過正常協作、不直接碰記憶寫入權限植入,且首次量化「直接說 vs 透過記憶講」的影響力差距 |
| 今日重要性 | 高 — 記憶增強的 multi-agent 系統正在變多,這篇顯示連正常參與者都能長期潛伏攻擊,不需要額外的系統存取權限 |
| 實務連結 | 明確 — G-Memory(分層記憶管理)能降低但不能消除攻擊,auditing agent 也只能部分攔截,對正在導入共享記憶的團隊是具體的設計提醒 |
| 編輯信心 | 中 — 攻擊效果在模擬的 multi-agent debate 框架與固定任務序列下成立,真實生產系統的任務序列通常不是攻擊者事先知道的,論文未測試 |
| 閱讀建議 | 必讀 — 對正在設計或導入 multi-agent 共享記憶機制的團隊直接相關 |
| 主要限制 | 威脅模型假設攻擊者事先知道未來的 target task 與想誘導的錯誤答案,且能挑選語意相近的過去任務植入 payload;若攻擊者不具備這種預知能力,Storage/Retrieval 階段的成功率可能大幅下降 |

### 領域背景

Multi-agent 系統過去的內部攻擊研究聚焦在惡意 agent 在當前討論裡直接誤導隊友——這種訊息還留著是誰說的,其他 agent 可以質疑它。但越來越多系統把過去成功的協作紀錄存進共享記憶,之後依相似度檢索重複使用,這讓錯誤資訊有機會換一個身分重新出現。

### 中階導讀

- **問題**:想像一個三人協作的 agent 團隊要回答醫療選擇題。其中一個 agent 其實是臥底——它在前一題故意答對,但順手在回答裡塞了一句看似矯正的誤導說明。這一題團隊答對了,這段對話被存進「成功經驗」記憶庫。三題之後,團隊遇到一個很像的題目,系統自動撈出這段成功經驗——誤導說明這時候看起來不再是某個 agent 的個人意見,而是「團隊過去做對的事」,份量完全不同。
- **方法**:MIMPA 分三步:設計一個只在特定情境下觸發的 payload(簽名定位目標任務、矯正內容給出想誘導的答案、範圍限制它不影響目前任務);在一個跟未來 target task 語意相近的過去任務裡正常答對、同時夾帶 payload,讓紀錄順利存進記憶;等 target task 真正出現、系統檢索到這筆紀錄時,攻擊者 agent 再主動指出「這筆紀錄適用於現在」來放大效果。
- **為什麼重要**:攻擊者不需要任何額外系統權限,只靠正常參與協作的身分,就能讓錯誤資訊披上「團隊過去成功經驗」的外衣持續影響之後的任務——而這個效果比攻擊者當下直接開口說同一句話強得多。

```diagram
title: MIMPA 攻擊鏈：被信任的記憶如何變成攻擊面
desc: 惡意 agent 先在種植任務裡答對並藏入針對性 payload，污染紀錄被存入共享記憶；之後的目標任務檢索到這筆紀錄，惡意 agent 再主動引用它，讓善意 agent 改口說出指定的錯誤答案
caption: 依 MIMPA（Ahn and Chang, 2026）定義的四階段：存入對應 Storage，檢索對應 Retrieval，引用對應 Triggering，改口對應 Influence
step: 惡意 agent 在種植任務中答對，同時把 payload 藏入協作紀錄，紀錄被存入共享記憶
step: 之後的目標任務觸發檢索，共享記憶把含 payload 的紀錄回傳給善意 agent
step: 惡意 agent 主動指出這筆紀錄適用於目前的任務
step: 善意 agent 採信這筆「過去的成功經驗」，改口說出攻擊者指定的錯誤答案
---
<svg viewBox="0 0 640 400">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="312"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="312"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="312"/>

  <g data-step="1">
    <path class="dg-line" d="M96 140H316" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="206" y="128" text-anchor="middle" dominant-baseline="central">存入協作紀錄</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M320 220H540" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="208" text-anchor="middle" dominant-baseline="central">後續任務被檢索</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M96 280H540" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="200" y="268" text-anchor="middle" dominant-baseline="central">指出紀錄適用本案</text>
  </g>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">惡意 Agent</text>

  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">共享記憶</text>

  <rect class="dg-box" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">善意 Agent</text>

  <g data-step="4">
    <rect class="dg-box dg-box--accent" x="468" y="340" width="152" height="48" rx="6"/>
    <text class="dg-label" x="544" y="364" text-anchor="middle" dominant-baseline="central">改口說出錯誤答案</text>
  </g>
</svg>
```

### 深入要點

- TruthfulQA 上,basic 記憶設定下 MIMPA 的攻擊成功率(ASR)達 79.5%,遠高於既有攻擊手法 MAC Attack 的 18.1% 與 AutoTransform 的 14.5%
- 階段拆解:Storage(紀錄成功存入)成功率 94.7%-100%,Retrieval(被檢索到)在 basic 設定下 86.6%-100%,Influence(真的改變答案)是主要瓶頸——MMLU-Pro 只有 38.0%(agent 能重新推導答案時較難被誤導),TruthfulQA 與 MedMCQA 都超過 80%
- 消融實驗:拿掉記憶投毒、直接在 target task 說同一句矯正,ASR 大幅降到 3.6%-18.1%,顯示同樣內容「透過記憶講」比「直接講」有效得多;拿掉觸發放大(不參與 target task),ASR 仍有一定效果(basic 設定下 22.9%-60.2%),代表記憶本身就有影響力
- 面對 auditing agent(事後審查協作紀錄),ASR 會下降但不會消失——MedMCQA 上事後審查後仍有 67.2% 的 ASR,因為這個領域的誤導內容依賴專業知識,不容易從對話紀錄本身判斷真假
- Limitation:攻擊者被假設已知未來的 target task 與想誘導的錯誤答案;G-Memory 分層管理能讓 retrieval 成功率從 86.6%-100% 降到 51.3%-58.3%,但沒有讓攻擊完全失效

### Reviewer 一句話評

三個 benchmark、兩個 backbone、兩種記憶設定,附消融與 auditing 測試,方法論完整度在今天三篇裡最高,「透過記憶講 vs 直接講」的對照實驗也乾淨地證明攻擊機制確實來自記憶的可信度轉移;但整套威脅模型假設攻擊者對未來任務有相當程度的預知能力,這在任務序列不可預先規劃的真實生產系統裡能不能成立,論文本身沒有測試。

### 給你的 take-away

- 如果你正在設計或導入 multi-agent 的共享記憶機制:不要假設「協作成功 = 內容可信」,這篇顯示光是「曾經成功」這個標籤就能讓誤導內容的影響力大幅提升,需要在記憶寫入或檢索階段加入內容層級的驗證
- 如果你在評估 auditing/監控機制的有效性:優先測試知識密集、不容易從對話表面判斷真假的領域(像這篇的 MedMCQA),這篇顯示 auditing 在這類領域的攔截效果明顯打折

---

## 今日收穫

之前以為「context 壓縮」「評測方法」「記憶安全」是三個進度不同但彼此獨立的 agent 工程問題,各自努力做得更好就好;今天的對照讓我重新理解——它們全部繞著同一層打轉:agent 怎麼處理、共用它看過的歷史。RECAP 證明這層可以被訓練得更好,但「更好」藏著一個沒被檢驗的前提(完整 context 下的行為值得保留);Multi-Run Evaluation 顯示,這層在真實部署裡的不穩定,足以讓單次評測分數失去意義;MIMPA 則說明,一旦這層被設計成共享、重複使用,它就從效率優化變成攻擊者可以長期潛伏的管道。記憶/context 不是 agent 架構裡的一個配件,它同時是今天最值得投資的能力,也是最沒被誠實檢視的風險面。

## 參考資料

- [RECAP: Training Long-horizon LLM Agents with Context Compaction](https://arxiv.org/abs/2611.31258)
- [RECAP 程式碼(GitHub)](https://github.com/eth-medical-ai-lab/recap)
- [Agentic Systems Need Multi-Run Evaluation: A Study of Retrieval and Response Variability in a Deployed Enterprise RAG System](https://arxiv.org/abs/2611.31266)
- [When Successful Collaboration Becomes an Attack Surface: Insider Memory Poisoning in Multi-Agent Systems](https://arxiv.org/abs/2611.31307)
- [MIMPA 程式碼(GitHub)](https://github.com/ahnji0520/MIMPA-code)
- [arXiv cs.AI 當日公告清單](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL 當日公告清單](https://arxiv.org/list/cs.CL/new)
- [arXiv cs.MA 當日公告清單](https://arxiv.org/list/cs.MA/new)
