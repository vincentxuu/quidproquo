---
title: "AI Agent Arxiv Digest — 2026-11-24"
date: 2026-11-24
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "三篇論文分別檢查 Agent 工程裡三件常被想當然耳的事:記憶可以壓到幾十分之一還不太掉分,但guardrail 不存在能同時攔住所有壞輸出又放過所有好輸出的版本,而現在的 agent 復原機制真正被用到時,大多數情況下也救不回來"
tldr: "MemOnce 用記憶編碼器-解碼器搭配稀疏注意力,讓長上下文記憶壓縮後幾乎不掉效能,4B 規模下平均分數反而比全上下文基準高 5.77 個百分點;No Perfect Guardrail 用可計算性理論證明,只要語言模型能輸出任意長度字串且政策本身不可判定,就不存在能同時攔住所有壞輸出、又放過所有好輸出的完美 guardrail;Exercised, Rarely Recovered 盤點 50 個 agent harness 與研究用 runtime 的公開回報,128 筆真實使用中只有 19 筆完整恢復,而研究提出的補償保證沒有任何一個 harness 真正提供"
series:
  name: "AI Agent Arxiv Digest"
  order: 184
---

## 今日總覽

今天三篇論文合起來檢查 Agent 工程裡三件容易被想當然耳接受的事:記憶壓縮、guardrail、和出錯後的復原機制,各自能不能做到它們被期待的事。第一篇 MemOnce 帶來的是少見的正面進展:它把記憶編碼器-解碼器設計搭配稀疏注意力,讓模型只需要存一份精簡的記憶表示、按需動態解碼成多層 KV cache,在 4B 規模下平均分數比全上下文基準還高 5.77 個百分點,是作者自述的「第一個打敗全上下文基準的原生記憶模型」。第二篇 No Perfect Guardrail 則從可計算性理論出發,證明只要語言模型能輸出任意長度的字串、而政策本身是不可判定的,就不存在一個演算法能同時攔住所有違規輸出又放過所有合規輸出——這不是工程做得不夠好,是數學上的邊界。第三篇 Exercised, Rarely Recovered 把焦點轉到實務:它用凍結協定盤點 50 個 agent harness 與研究用 runtime 的公開回報,發現復原機制在實際使用中幾乎處處都被用到,但 128 筆真實回報裡只有 19 筆完整恢復,研究界最看重的「補償」保證,目前沒有任何一個 harness 真正提供。三篇的證據形式不同——一篇是大規模訓練實驗,一篇是形式證明,一篇是盲測編碼的實證調查——但都誠實標出了自己的界線:MemOnce 承認只測到 1B 參數規模,guardrail 證明明確區分哪些特例仍能有保證,復原調查則承認編碼過程全由 LLM agent 完成、沒有獨立人類雙重編碼。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| KV Cache(鍵值快取) | Transformer 推理時每一層都要保留的歷史狀態,上下文越長,這份快取就越肥大,是長任務記憶體成本的主要來源 |
| 稀疏注意力(Sparse Attention) | 不是對所有歷史內容都計算注意力,只挑出其中最相關的一部分來算,用來省計算量與記憶體 |
| 不可判定性(Undecidability) | 數學上存在一些是非題,沒有任何演算法能保證在有限步驟內對所有情況都答對,這篇論文把這個結果套用到 guardrail 的輸出判斷上 |
| Guard 與 Monitor(攔截器與監控器) | Guard 是在輸出送出前就擋下來,Monitor 是輸出之後邊執行邊觀察,兩者在理論上能做出的保證並不相同 |
| Saga 式補償(Compensation) | 分散式系統的術語,指某個動作已經對外部系統造成效果後,如果後面出錯,要有辦法「反著做一次」把那個外部效果撤銷,不只是復原自己內部的狀態 |
| 證據分級(Evidence ladder) | 用來區分一個機制是「只在文件裡寫到」還是「有可追查的真實使用者在真實執行中用過且留下紀錄」的分級方式,避免把展示當成已經能用 |

---

## 論文一｜MemOnce:記憶只編碼一次,長上下文快取砍到數量級以下還不掉分

**MemOnce: A Scalable Memory Architecture for Large Language Models**
Chang Nie, Chaoyou Fu, Songlin Liu et al.（Nanjing University + University of Science and Technology of China）　·　arxiv: 2611.27973

連結: [arxiv](https://arxiv.org/abs/2611.27973) · [alphaxiv](https://www.alphaxiv.org/abs/2611.27973)

### TL;DR

把記憶狀態只編碼一次、按需動態解碼成多層 KV cache,讓持久記憶快取的體積降到數量級以下,在 0.15B–1B 規模從頭訓練時效能打平或超過標準 Transformer,在 4B 規模的長上下文記憶測試中平均分數比全上下文基準高 5.77 個百分點。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布約 4 天，Semantic Scholar 尚無引用資料 |
| 機構 | Nanjing University + University of Science and Technology of China |
| 社群反應 | 出現在 HuggingFace Daily Papers（2026-11-19 批次）/ 同時被今天 arXiv cs.CL 新公告批次收錄，雙來源佐證 |
| 可信度 | 通過 — 四條評測軸（基礎能力、長上下文記憶、一般能力保留、表徵任務）、多個對照基線、0.15B–1B 從頭訓練加 2B/4B 後訓練適配，數字可回到論文表格 |
| 證據成熟度 | 初步 — 在測試的規模內證據完整，但從頭訓練只做到 1B 參數，作者自己承認更大規模（7B 以上）與真實 agent 下游任務尚待驗證 |
| 可復現性 | 部分產物 — 有專案頁面與訓練/評測設定說明，正文未見明確的程式碼或權重公開聲明 |
| 為什麼選這篇 | 直接 — 記憶管理是長任務 Agent 最直接的推理成本與效能瓶頸，這篇直接處理快取體積與效能的取捨 |
| 方向新意 | 實質增量 — 把「快取共享」與「記憶壓縮」結合成同一個編碼-解碼設計，同時在從頭訓練與後訓練適配兩種情境都驗證，官方比較對象涵蓋 YOCO、LastKV、GDN 等多種既有方案 |
| 今日重要性 | 高 — 幾乎所有長上下文 Agent 服務都要面對 KV cache 成長的成本問題，這篇提供了具體可比較的改善幅度 |
| 實務連結 | 明確 — 可作為既有推理框架的記憶架構替代方案參考，尤其是需要壓低長期記憶服務成本的場景 |
| 編輯信心 | 中 — 效能數字具體且有多基線對照，但規模上限（1B 從頭訓練）與 LLM 當裁判（長上下文記憶測試用 DeepSeek-V4.1-Flash 評分）兩點都未見人工一致性驗證，敘述強度需要收在「已驗證規模內」 |
| 閱讀建議 | 必讀 — 對正在選型或優化長上下文推理架構的團隊直接相關 |
| 主要限制 | 從頭訓練只驗證到 1B 參數規模，大規模（7B 以上）是否仍保持優勢未知；長上下文記憶測試用 LLM 當嚴格裁判評分，論文未報告裁判與人工標註的一致性 |

### 領域背景

長任務 Agent 需要在互動過程中持續存取過去的狀態,但標準 Transformer 每一層都要存一份逐 token 的 KV cache,上下文一拉長,記憶體用量跟著線性成長、運算量跟著平方成長。線性時間架構(如把歷史壓進固定大小狀態的方法)省了這個成本,卻容易在細節保存上出問題。MemOnce 想同時解決兩邊:保留細節,又不用付出逐層存取的代價。

### 中階導讀

- **問題**:想像一個客服 Agent 要記住使用者三個月前提過的退貨單號,但每多記一句話,它腦袋裡要存的筆記就跟著變厚、變慢。傳統做法是每一層大腦都各自存一份筆記,記憶一多,存取速度和空間都吃緊。
- **方法**:MemOnce 的核心做法是「只編碼一次,按需解碼」。它先把最後一層的隱藏狀態壓成一份精簡的記憶表示,存成一份全域快取;當有新的輸入進來,用稀疏檢索機制找出跟目前輸入最相關的那幾塊記憶,而且這個檢索只做一次、所有層共用同一組結果,再用輕量的解碼器把它動態還原成每一層各自需要的 KV cache。
- **為什麼重要**:這代表記憶的存取成本不再隨著模型層數線性疊加——原本要「每層都查一次、每層都存一份」,現在是「全局查一次、按需還原」,讓長上下文的記憶體與計算成本大幅下降,卻不用在效能上做出明顯犧牲。

```diagram
title: 記憶怎麼存,決定長上下文的代價
desc: 標準做法逐層存取歷史，MemOnce 把檢索移到全局只做一次，再按需解碼回每一層
---
<svg viewBox="0 0 680 300">
  <rect class="dg-box" x="30" y="20" width="300" height="100" rx="6"/>
  <text class="dg-label" x="180" y="44" text-anchor="middle" dominant-baseline="central">標準 Transformer</text>
  <text class="dg-sub" x="180" y="68" text-anchor="middle" dominant-baseline="central">每一層各自存取 + 保留一份 KV cache</text>
  <text class="dg-sub" x="180" y="88" text-anchor="middle" dominant-baseline="central">上下文越長，體積線性成長</text>

  <rect class="dg-box dg-box--accent" x="350" y="20" width="300" height="100" rx="6"/>
  <text class="dg-label" x="500" y="44" text-anchor="middle" dominant-baseline="central">MemOnce</text>
  <text class="dg-sub" x="500" y="68" text-anchor="middle" dominant-baseline="central">全局只檢索一次（稀疏索引跨層共用）</text>
  <text class="dg-sub" x="500" y="88" text-anchor="middle" dominant-baseline="central">按需解碼還原各層 KV cache</text>

  <path class="dg-line" d="M180 120 V160" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M500 120 V160" marker-end="url(#arrow-accent)"/>

  <rect class="dg-box dg-box--warn" x="30" y="160" width="300" height="100" rx="6"/>
  <text class="dg-label" x="180" y="188" text-anchor="middle" dominant-baseline="central">成本：線性成長</text>
  <text class="dg-sub" x="180" y="212" text-anchor="middle" dominant-baseline="central">0.15B–1B 從頭訓練：Avg 51.85</text>
  <text class="dg-sub" x="180" y="232" text-anchor="middle" dominant-baseline="central">（Transformer 基準）</text>

  <rect class="dg-box" x="350" y="160" width="300" height="100" rx="6"/>
  <text class="dg-label" x="500" y="188" text-anchor="middle" dominant-baseline="central">成本：數量級縮減</text>
  <text class="dg-sub" x="500" y="212" text-anchor="middle" dominant-baseline="central">4B 長上下文記憶測試：Avg 60.07</text>
  <text class="dg-sub" x="500" y="232" text-anchor="middle" dominant-baseline="central">（全上下文基準 54.30，+5.77）</text>
</svg>
```

### 深入要點

- 0.15B–1B 規模從頭訓練比較:MemOnce(r=8) 平均分數 52.35、MemOnce(r=1) 平均分數 52.63,均略高於標準 Transformer 的 51.85,壓縮比拉到 8 倍幾乎不掉分
- 4B 規模長上下文記憶測試(MemBench、LoCoMo、LongMemEval、PersonaMem-128、PersonaMem-1M):MemOnce 平均 60.07,比全上下文基準 Qwen3.5-4B 的 54.30 高 5.77 個百分點,也遠高於既有原生記憶基線 M+(41.39)、EvoEmbedding(39.15)
- 一般能力保留測試(32K 記憶負載下的 MMLU/GSM8K/GPQA):MemOnce 相對 Qwen3.5-4B 基準只變動 +0.10,而全量微調(full SFT)做法掉了 27.48 個百分點,顯示 MemOnce 的凍結參數設計能避免催化式遺忘
- 論文原話:MemOnce 在持續推理時「只需啟用極小量的記憶狀態」,比以注意力為基礎的基線「把快取體積降到數量級以下」(cache footprint by orders of magnitude)
- Limitation:作者自承從頭訓練只做到 1B 參數規模,更大規模(7B 以上)的 scaling 行為與真實 agent 下游任務(長程互動式寫程式、多步工具使用)的效果都還是未來工作

### Reviewer 一句話評

四條評測軸、多個對照基線、從頭訓練到後訓練適配都覆蓋,是今天三篇裡證據密度最高的一篇,「全局只檢索一次」的設計也確實解決了既有方案「逐層各自處理」的痛點;但作者自己點名的規模上限(1B)才是決定這套架構能不能撐到生產規模的關鍵,目前還沒有答案。

### 給你的 take-away

- 如果你在設計或選型長上下文推理架構:MemOnce 的「編碼一次、按需解碼」思路值得直接參考,它證明了記憶壓縮不一定要用犧牲效能換取省成本
- 如果你在評估類似的記憶架構論文:優先看它測到的參數規模上限,以及長上下文測試是否有人工標註核對 LLM 裁判的一致性,這兩項是本篇目前尚未補上的部分

---

## 論文二｜No Perfect Guardrail:只要模型能輸出任何字串,就不存在完美的 guardrail

**No Perfect Guardrail & No Perfect Guard**
Ahmed Amer, Loren Kinczel, Darrell D. E. Long（Sustainable Systems Laboratory）　·　arxiv: 2611.27260

連結: [arxiv](https://arxiv.org/abs/2611.27260) · [alphaxiv](https://www.alphaxiv.org/abs/2611.27260)

### TL;DR

用可計算性理論(不可判定性、哥德爾不完備定理、Rice 定理)證明:只要語言模型是「完整生成器」(能以非零機率輸出任意長度的字串)而輸出政策本身是不可判定的,就不存在一個演算法能同時精確攔住所有違規輸出、又放過所有合規輸出;每一個保守(sound)的 guardrail,都必然排除掉無窮多個其實合規的輸出。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查，作者掛名獨立研究機構 Sustainable Systems Laboratory） |
| 引用速度 | 發布約 4 天，Semantic Scholar 尚無引用資料 |
| 機構 | Sustainable Systems Laboratory（獨立研究機構，非傳統大學掛名） |
| 社群反應 | 未見於 HuggingFace Daily Papers / Papers with Code |
| 可信度 | 通過 — 以正文與附錄的完整形式證明支持主張（Theorem 1 的完整歸約、Section 2.4／4.2／4.3 明確界定理論適用範圍與不適用範圍），證據形式與理論性論文的主張相稱 |
| 證據成熟度 | 較完整 — 核心定理與特例（有限長度輸出、算術假句、程式行為、理想化接收者）都給出完整證明，且明確劃出理論的邊界 |
| 可復現性 | 完整產物 — 正文提供完整定理陳述，附錄「Fuller Proof and Further Results」給出全部證明細節，任何人可逐步核對 |
| 為什麼選這篇 | 直接 — Guardrail 是 Agent 安全與產品合規的核心機制，這篇直接處理「guardrail 能不能被信任到什麼程度」這個根本問題 |
| 方向新意 | 應用改寫 — 作者自述「幾個結果已接近既有結論」，本篇的貢獻是把不可判定性、Rice 定理等已知結果系統性地套用並刻畫到 LLM guardrail 這個具體情境，而非提出全新定理 |
| 今日重要性 | 高 — 直接反駁業界常見的「guardrail 能保證安全」說法，給出可操作的理論邊界，而不是又一次性地喊口號 |
| 實務連結 | 明確 — 第 5 節「倫理與政策意涵」直接討論這個結果對責任歸屬、政策合規與保守排除的安全後果有什麼具體意義 |
| 編輯信心 | 高 — 論文反覆、刻意地把「這個定理證明了什麼」與「這個定理沒有證明什麼」分開寫（例如有限長度輸出仍可被精確攔截），敘述沒有被過度推廣到所有guardrail 情境 |
| 閱讀建議 | 必讀 — 對設計、採購或對外溝通 guardrail 保證的人直接相關 |
| 主要限制 | 定理的前提是模型是「完整生成器」(能以非零機率生成任意字串)，這一點對任何特定部署模型都沒有被經驗驗證，論文也承認這只是幾個已知結果的系統性刻畫而非全新證明 |

### 領域背景

業界常把 guardrail 講成一道能擋掉所有壞輸出的防線,學術上也有零散的結果指出某些特定情境下攔截是不可判定的(例如 Glukhov et al. 對程式輸出審查的分析、Hamlen et al. 對可強制執行性質的刻畫)。但這些結果彼此分散、各自處理不同的特例,沒有人把它們整合成一個清楚的「guardrail 在什麼條件下能/不能被保證」的全貌。

### 中階導讀

- **問題**:想像你要寫一個守門員程式,它要在使用者看到回覆之前,先判斷這段文字「有沒有違反某個規則」。如果這個規則本身的判斷標準夠複雜(複雜到等同於問「這段程式會不會停下來」這種無法一般性回答的問題),守門員就不可能對所有輸入都給出正確答案——不是因為它寫得不好,是這種問題本身就沒有萬能的演算法解法。
- **方法**:論文先建立一個形式模型:「生成器」是輸出字串的語言模型,「政策」是判斷字串合規與否的規則,「guard」是在輸出前做判斷的攔截器,「monitor」是輸出後邊跑邊觀察的監控器。核心定理(Theorem 1)證明:如果生成器是「完整」的(能以非零機率生成任意有限字串),而政策是不可判定的,那麼不存在一個演算法能同時保證「不放過任何違規輸出」又「不錯殺任何合規輸出」——每一個保守的 guard 都必然會排除無窮多個其實合規的輸出。論文接著用程式行為審查、算術真假句判斷等具體政策示範這個定理的套用,並仔細劃出哪些情況(例如輸出長度有上限)仍然可以有精確保證。
- **為什麼重要**:這給了一個清楚的理論邊界,讓工程團隊、政策制定者和使用者知道「guardrail 能保證安全」這句話在什麼條件下成立、在什麼條件下根本不可能成立——不是要你放棄做 guardrail,而是要你清楚知道它能做到什麼、不能做到什麼,並為做不到的那部分負起責任,而不是用「guardrail 已經擋了」當作免責聲明。

### 深入要點

- Theorem 1:對完整生成器而言,「存在精確 guard」恰好等價於「政策是可判定的」;政策不可判定時,每個保守 guard 都排除無窮多個合規輸出
- 特例分析:輸出長度有上限時,精確 guard 在原則上存在(有限字串集合總是可判定),但論文指出「沒有演算法能從長度上限『一般性地』構造出這個精確 guard」,實務上仍需逐案證明
- 把定理套用到「程式行為是否安全」(Alfonseca et al. 的歸約路徑)、「模型是否對齊」(Melo et al. 的判斷者遮蔽輸出方案)等已有文獻的具體政策類型,說明這些文獻各自處理的是同一個數學邊界的不同切面
- 作者明確區分 guard(輸出前攔截)與 monitor(輸出中觀察);對於可完整觀察、可攔截的具體動作,論文在 3.5 節給出精確監控器的存在性證明,但一旦違規是「交付一個被禁止的字串」,分類問題依然存在
- Limitation:核心前提「語言模型是完整生成器」對任何實際部署系統都沒有被驗證,論文也坦承幾個結果本身已接近既有文獻,貢獻在於系統性刻畫而非全新定理

### Reviewer 一句話評

形式化嚴謹、對自己結果的適用範圍交代得異常清楚（這點比大多數安全論文都做得好),是今天唯一以證明而非實驗為證據形式的一篇;但它整合的多是已知結果,真正的新意在於「系統性刻畫」而非「新發現」,而「模型是完整生成器」這個前提在真實部署情境下有多站得住,論文本身並未給出答案。

### 給你的 take-away

- 如果你在對外溝通產品的 guardrail 能力:避免使用「guardrail 保證安全」這類無條件說法,改用「guardrail 在哪些已知攻擊面上有效、在哪些開放式輸出空間上無法一般性保證」這種有邊界的敘述,這篇提供了可以直接引用的理論依據
- 如果你在設計 guardrail 評測:把重點放在量測「成功攻擊的機率與成本」而不是追求「零漏網」,論文指出不可判定性結果並不否定這種機率/成本層級的實證證據的價值

---

## 論文三｜Exercised, Rarely Recovered:50 個 Agent Harness 的復原機制,真正用到時大多救不回來

**Exercised, Rarely Recovered: What Public Reports Say About Recovery in 50 AI Agent Harnesses and Runtimes**
Kaviru Hapuarachchi（University of Colombo School of Computing）　·　arxiv: 2611.27090

連結: [arxiv](https://arxiv.org/abs/2611.27090) · [alphaxiv](https://www.alphaxiv.org/abs/2611.27090)

### TL;DR

用凍結協定盤點 12 個持久 agent runtime、26 個 coding-agent harness 與 12 個研究用 runtime 的公開回報,發現復原機制在實際使用中幾乎處處都被用到(38 個 harness/runtime 中 36 個至少有一次真實回報),但 128 筆真實使用回報裡只有 19 筆完整恢復、54 筆部分恢復、45 筆失敗,而研究界最強調的「補償」保證,目前沒有任何一個 harness 真正提供。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查，cs.SE 分類） |
| 引用速度 | 發布約 4 天，Semantic Scholar 尚無引用資料 |
| 機構 | University of Colombo School of Computing（斯里蘭卡） |
| 社群反應 | 未見於 HuggingFace Daily Papers / Papers with Code |
| 可信度 | 通過 — 協定與編碼手冊在資料收集前凍結並雜湊時戳,兩組獨立 LLM 盲測編碼（Claude Opus 5.5／GPT-6 Astra）加仲裁、對每個 L4／E3+／大分歧項目強制覆核，附完整複現包 |
| 證據成熟度 | 較完整 — 50 個系統、128 筆真實使用回報、逐項附來源連結與存檔快照，是今天三篇裡樣本規模最大、分級最細的 |
| 可復現性 | 完整產物 — 複現包公開於 Zenodo（含雜湊鎖定的資料集與生成每個數字的腳本），每個系統的來源都有存檔快照 |
| 為什麼選這篇 | 直接 — 直接量化「研究承諾的復原保證」與「使用者實際遇到的復原結果」之間的落差，對任何部署 agent harness 的團隊都是具體可操作的資訊 |
| 方向新意 | 實質增量 — 建立橫跨 50 個系統、8 種復原機制、6 階段證據分級的資料集，是第一個把研究保證與生產實務並排比較的系統性盤點 |
| 今日重要性 | 高 — 幾乎所有生產環境的 coding agent 都依賴 checkpoint/resume 或 rollback，這篇直接揭露這兩種機制在真實使用中最常失敗 |
| 實務連結 | 明確 — 具體點名 checkpoint/resume 僅在 27 筆回報裡成功 1 次、補償機制在 38 個 harness/runtime 中幾乎全數缺席，可直接對照自己的 harness 選型 |
| 編輯信心 | 高 — 作者自己用「嚴格視角」(strict view) 重新檢驗一遍，顯示結論在限縮定義下仍大致成立，且威脅效度一節誠實列出每一項方法侵蝕可信度的來源 |
| 閱讀建議 | 必讀 — 對正在評估或部署 agent harness 復原能力的團隊直接相關 |
| 主要限制 | 兩組編碼與後續仲裁、覆核全部由 LLM agent 執行，作者事後逐一核對但沒有獨立的人類雙重編碼數據；128 筆 L4 證據裡 98 筆僅來自 GitHub issue，而 issue 本身系統性地偏向記錄失敗案例 |

### 領域背景

Coding agent 與長時間運作的 agent runtime 一旦出錯(刪錯檔案、長任務跑到一半當掉),使用者仰賴的復原機制包括從檢查點恢復、撤銷、請求人工核准、查看日誌。研究端則提出了更強的保證,例如多代理計畫的 saga 式補償、交易式工具執行、環境層級的檢查點還原。但過去沒有人系統性地問:這些保證真正落到使用者手上、被實際用過時,到底有沒有撐住?

### 中階導讀

- **問題**:想像三個真實案例——Gemini CLI 使用者在套件安裝卡住時按了「永遠允許」,結果 agent 跑了 `rm -rf` 清掉整個家目錄;Aider 使用者對一次壞編輯按了 `/undo`,卻連自己原本沒 commit 的工作也一起被撤銷;Kilo Code 使用者發現 `revert` 撤銷了主 agent 的編輯,卻沒撤銷子 agent 的。三個案例裡,復原機制都「做了它被設計要做的事」,使用者卻還是損失了東西。
- **方法**:作者把 50 個系統分成三組——12 個持久 agent runtime(如 OpenHands、Letta)、26 個 coding-agent harness(如 Claude Code、Codex、OpenHands)、12 個強調復原保證的研究用 runtime——針對 8 種復原機制(checkpoint/resume、retry/timeout、rollback/undo、補償、驗證閘、人工核准、沙箱、追蹤日誌),用一套從「沒找到證據」到「有具名操作者在真實執行中用過且留下記錄」的六階證據分級,逐一評分。兩組不同模型的 LLM coding agent 獨立盲測編碼,分歧處由人工仲裁,再對每個最高等級的結論強制覆核一次。
- **為什麼重要**:這篇把「復原機制存在」和「復原機制真的能救你」這兩件事分開量化。結果顯示:復原機制幾乎每個系統都有,但被實際用到時,最常被倚賴救回全局的 checkpoint/resume 和 rollback,反而是失敗率最高的兩種;而研究界最在意的補償保證,至今沒有一個生產 harness 真正提供。

```diagram
title: 128 筆真實復原回報，結果大多不如預期
desc: 復原機制在真實使用中幾乎處處被用到，但完整恢復的案例只是少數
---
<svg viewBox="0 0 680 280">
  <rect class="dg-box" x="30" y="20" width="620" height="46" rx="6"/>
  <text class="dg-label" x="340" y="43" text-anchor="middle" dominant-baseline="central">50 個系統、8 種復原機制中，找到 128 筆「真實使用中被用過」的公開回報</text>

  <path class="dg-line" d="M110 66 V100" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M340 66 V100" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M570 66 V100" marker-end="url(#arrow-accent)"/>

  <rect class="dg-box" x="30" y="100" width="160" height="80" rx="6"/>
  <text class="dg-label" x="110" y="128" text-anchor="middle" dominant-baseline="central">完整恢復</text>
  <text class="dg-sub" x="110" y="152" text-anchor="middle" dominant-baseline="central">19 筆（15%）</text>

  <rect class="dg-box" x="260" y="100" width="160" height="80" rx="6"/>
  <text class="dg-label" x="340" y="128" text-anchor="middle" dominant-baseline="central">部分恢復</text>
  <text class="dg-sub" x="340" y="152" text-anchor="middle" dominant-baseline="central">54 筆（42%）</text>

  <rect class="dg-box dg-box--warn" x="490" y="100" width="160" height="80" rx="6"/>
  <text class="dg-label" x="570" y="128" text-anchor="middle" dominant-baseline="central">失敗</text>
  <text class="dg-sub" x="570" y="152" text-anchor="middle" dominant-baseline="central">45 筆（35%）</text>

  <rect class="dg-box" x="30" y="200" width="620" height="60" rx="6"/>
  <text class="dg-label" x="340" y="222" text-anchor="middle" dominant-baseline="central">checkpoint/resume：27 筆回報僅 1 次完整恢復</text>
  <text class="dg-sub" x="340" y="244" text-anchor="middle" dominant-baseline="central">補償（saga 式）：38 個 harness/runtime 中僅 2 個沾邊，且都不是真正的外部效果補償</text>
</svg>
```

### 深入要點

- 50 個系統中,11/12 持久 runtime、25/26 coding harness 至少有一筆真實使用(L4)回報;研究用 runtime 11/12 停在「只在基準測試上展示過」(E1),無人報告實際操作
- 128 筆 L4 回報中:19 筆完整恢復、54 筆部分恢復、45 筆失敗、10 筆不明;checkpoint/resume 在 27 筆回報中僅 1 次完整恢復(13 次失敗、13 次部分),rollback/undo 在 15 筆回報中僅 1 次完整恢復
- 追蹤日誌(trace log)是表現最好的機制:25 筆回報裡 7 筆完整恢復、沒有一筆被記錄為完全失敗,因為留存的紀錄讓操作者自己診斷並修復
- 補償(compensation,研究界最強調的保證):12 個研究 runtime 裡有 3 個在基準上評測過,但 38 個生產 harness/runtime 中只有 2 個(Langflow、Letta)沾邊,而且都只是框架內部清理自己寫入的狀態,不是真正撤銷 agent 動作對外部系統造成的效果
- 嚴格視角(排除單一操作者來源的證據)下,結果幾乎不變:128 筆 L4 中 122 筆存活,全部 7 筆 E4(可歸因、長期使用)等級也全部存活
- Limitation:編碼與仲裁全由 LLM agent 執行(作者事後逐一核對但非獨立人類雙重編碼);128 筆 L4 證據裡 98 筆僅來自 GitHub issue,而 issue 本身系統性偏向記錄失敗,成功案例可能被低估

### Reviewer 一句話評

凍結協定、盲測雙編碼、強制覆核、公開複現包,方法論嚴謹程度遠超一般的事後整理式調查,樣本規模(50 系統、128 筆真實回報)也足以支撐「復原機制常被用到卻很少真正救回」這個結論;但全程由 LLM agent 編碼、缺乏獨立人類雙重編碼數據,是這篇自己誠實點名、也還沒有答案的下一題。

### 給你的 take-away

- 如果你正在選型或評估 agent harness:不要只看文件宣稱有哪些復原機制,去查它的 checkpoint/resume 和 rollback 在真實事故報告裡表現如何——這篇顯示這兩個最常被倚賴的機制,反而是失敗率最高的
- 如果你在設計需要操作外部系統(下單、發信、改資料庫)的 agent:目前沒有任何生產 harness 提供真正的補償保證,這代表你需要自己在應用層設計撤銷/補償邏輯,不能假設 harness 會幫你擋下外部副作用

---

## 今日收穫

之前以為「記憶壓縮」「guardrail」「復原機制」是三個工程成熟度不同但方向類似的問題,各自努力做得更好就好;今天的對照讓我重新理解:這三件事其實站在三種不同的「能不能做到」上——記憶壓縮是工程問題,MemOnce 證明只要訊號設計對了,確實可以兩者兼顧;guardrail 的完美版本是數學上不存在的,No Perfect Guardrail 給出的是邊界而不是失敗案例;而復原機制理論上存在、工程上也做了,但 Exercised, Rarely Recovered 顯示它在真實世界被用到時,大多數情況下仍然救不回來——這不是「還沒做好」,而是「文件宣稱的保證」和「使用者遇到的真實結果」本來就是兩個需要分別驗證的東西。

## 參考資料

- [MemOnce: A Scalable Memory Architecture for Large Language Models](https://arxiv.org/abs/2611.27973)
- [MemOnce 專案頁面](https://clare-nie.github.io/MemOnce)
- [No Perfect Guardrail & No Perfect Guard](https://arxiv.org/abs/2611.27260)
- [Exercised, Rarely Recovered: What Public Reports Say About Recovery in 50 AI Agent Harnesses and Runtimes](https://arxiv.org/abs/2611.27090)
- [Exercised, Rarely Recovered 複現包（Zenodo）](https://doi.org/10.5281/zenodo.24122560)
- [arXiv cs.AI 當日公告清單](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL 當日公告清單](https://arxiv.org/list/cs.CL/new)
