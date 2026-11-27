---
title: "AI Agent Arxiv Digest — 2026-11-28"
date: 2026-11-28
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天的主題是 Agent 的記憶管理：記對的記憶可能被模型自己蓋過、確定性索引打贏生成式記憶、GPU 伺服層的情境淘汰有代價"
tldr: "TASK Memory 把記憶忽略幻覺壓到 1.5% 以下；MGMem 不靠生成式索引就打贏三個生成式記憶系統；Contexture 讓 agent serving 吞吐量提升 20-73%，但有最差 3.7 個百分點的準確率風險"
series:
  name: "AI Agent Arxiv Digest"
  order: 188
---

## 今日總覽

今天三篇論文把「Agent 記憶管理」拆成三個各自獨立卻常被混為一談的問題。TASK Memory 指出一個容易被忽略的盲點：就算檢索系統把正確記憶放進了 prompt，模型自己內部的舊知識仍可能蓋過它，造成「記對了卻答錯」的幻覺，而且這種幻覺有三種不同成因,不能用同一招解決。MGMem 則從另一端出發,質疑「記憶索引一定要靠生成式 LLM 來寫」這個預設——它用一套完全確定性的解析器取代生成式索引,在標準對話記憶測試上反而贏過三個生成式記憶系統。Contexture 把問題拉到最底層的 GPU 伺服基礎設施:Agent 執行歷史不斷累積,佔用的 KV cache 直接限制了能同時服務多少個 agent session,而清掉「已被取代」的舊歷史不是沒有代價的免費午餐。三篇證據成熟度都算紮實(有跨模型統計檢定、有重跑的 baseline、有生產級的評測矩陣),但也都誠實揭露了自己的邊界——這正是今天值得仔細讀的原因。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| 長程記憶（Long-Horizon Memory） | Agent 跨越數千輪對話或任務時，需要持久記住先前資訊的能力，不是單次對話的上下文 |
| KV Cache（鍵值快取） | GPU 推理時用來存放每個 token 的注意力中間計算結果，讓模型不用每次重算，但會佔用大量顯卡記憶體 |
| 激活引導（Activation Steering） | 不改模型權重，直接在推理時微調模型內部某一層的激活向量，藉此改變輸出行為 |
| 知識編輯（Knowledge Editing） | 針對模型內部某個具體事實做局部修改，不需要重新訓練整個模型 |
| 鷹架（Harness） | 驅動 Agent 的程式框架，包含 system prompt、工具定義、記憶讀寫邏輯，不含模型本身 |
| SLO（服務等級目標） | 服務商承諾的效能門檻，例如「平均回應延遲低於某個毫秒數」，是 GPU 伺服系統常用的衡量基準 |

```diagram
title: 今天三篇論文對應的記憶管理三層
desc: 由上往下依序是模型是否正確使用記憶、記憶怎麼被索引儲存、執行歷史在 GPU 伺服層怎麼被淘汰；三層分別對應 TASK Memory、MGMem、Contexture 三篇論文。
caption: 示意：三篇論文分別對應三個概念層級，彼此不是技術依賴關係，只是編輯上把「記憶管理」拆成由應用到硬體的三個問題。
---
<svg viewBox="0 0 640 248">
  <path class="dg-axis" d="M36 220V40" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="36" y="28" text-anchor="middle" dominant-baseline="central">抽象</text>
  <text class="dg-tag" x="36" y="232" text-anchor="middle" dominant-baseline="central">具體</text>

  <rect class="dg-box dg-box--accent" x="72" y="24" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="60" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="42" dominant-baseline="central">正確性層</text>
  <text class="dg-sub" x="124" y="64" dominant-baseline="central">已檢索到的記憶，模型是否真的採用？</text>
  <text class="dg-sub" x="124" y="84" dominant-baseline="central">TASK Memory：記憶忽略最高 46%，壓到 ≤1.5%</text>

  <rect class="dg-box" x="72" y="104" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="132" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="120" dominant-baseline="central">索引架構層</text>
  <text class="dg-sub" x="124" y="144" dominant-baseline="central">MGMem：不靠生成式索引，仍贏 3 個對手 +2.6~13.5pp</text>

  <rect class="dg-box" x="72" y="168" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="196" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="184" dominant-baseline="central">GPU 伺服層</text>
  <text class="dg-sub" x="124" y="208" dominant-baseline="central">Contexture：淘汰已取代的舊歷史，吞吐量 +20~73%</text>
</svg>
```

---

## 論文一｜TASK Memory：記對了記憶，模型還是可能答錯

**TASK Memory: Beyond Text-Only Memory with Activation Steering and Knowledge Editing against Memory Hallucination**
Jin-Kun Zhao, Wen-Jun Wu（機構未公開列於 Semantic Scholar）　·　arxiv: 2611.34762

連結: [arxiv](https://arxiv.org/abs/2611.34762) · [alphaxiv](https://www.alphaxiv.org/abs/2611.34762)

### TL;DR

即使正確的記憶已經被檢索出來放進 prompt，五個開源模型的測試顯示仍有高達 46% 的查詢會被模型自己腦內的舊知識蓋過，TASK Memory 這套方法把這種「記憶忽略」幻覺壓到所有十個模型-資料組合中最高 1.5%。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布 3 天，Semantic Scholar 尚無引用資料 |
| 機構 | 未公開列出（2 位作者，Semantic Scholar 無機構欄位資料） |
| 社群反應 | HF Daily Papers 未上榜（已查 11/26、11/27）/ 未見 GitHub 復現 repo |
| 可信度 | 通過 — 五模型四家族、pre-registered 統計協定，95% paired-bootstrap CI 跨多個 benchmark |
| 證據成熟度 | 較完整 — 涵蓋 provided-evidence、library、continual-revision 三種協定與多跳組合測試 |
| 可復現性 | 未提供 — 摘要與正文未見程式碼或資料釋出連結 |
| 為什麼選這篇 | 直接 — 揭露的是記憶增強 Agent 的核心失效模式，不是周邊問題 |
| 方向新意 | 實質增量 — 把「記憶幻覺」拆成記憶忽略、誤用、版本混淆三種機制，並各自對症下藥 |
| 今日重要性 | 高 — 多數記憶系統評測只看「有沒有檢索到正確記憶」，這篇證明檢索對了不代表用對了 |
| 實務連結 | 明確 — 但限定在可存取權重的開源模型，無法套用在只透過 API 呼叫的封閉模型 Agent |
| 編輯信心 | 高 — pre-registered 跨模型統計檢定的嚴謹度在這個領域並不常見 |
| 閱讀建議 | 必讀 — 任何在做記憶增強 Agent 評測的團隊 |
| 主要限制 | 方法需要讀寫模型內部權重與激活，無法套用在封閉 API 模型上 |

### 領域背景

過去評測 Agent 記憶系統，多半只問「有沒有檢索到正確的那條記憶」，把「檢索準確率」當成終點。但檢索正確之後，模型真的會照著記憶回答嗎？這篇指出答案不一定——模型自己權重裡的舊知識、或是記憶被誤用到不相關的問題上，都是檢索準確率量不到的失敗模式。

### 中階導讀

- **問題**：想像一個客服 Agent 查到了「這個客戶上週已經退貨」這條記憶，放進了 prompt，但模型還是回答「可以幫您辦理退貨」——因為模型自己訓練時學到的「退貨流程通常這樣走」蓋過了眼前明明白白寫著的記憶。這不是沒檢索到，是檢索到了也沒用上。
- **方法**：TASK Memory 把文字記憶、激活引導、知識編輯三者綁在同一個「位址」上——文字負責內容，一個可移除的知識編輯提供這條記憶的索引鍵（支援多跳推理），一對引導向量則逐題判斷模型該不該採用這條記憶、而不是自己瞎編。三者分工，誰出錯就只動誰。
- **為什麼重要**：這篇把「記憶幻覺」這個模糊說法，拆成三種可以分別測量、分別修的機制：模型忽略記憶回到舊知識（最高 46%）、把記憶誤用到不相關的實體上（最高 24%，疊加知識編輯時 49%）、新舊版本搞混（53% 的改版問題答案還在講舊版本）。

### 深入要點

- 在 CounterFact（300 題世界）上，TASK 配置把準確率從 baseline 的 0.811 推到 0.919（+10.80 個百分點，95% CI 排除 0）
- 在記憶庫情境（library protocol，模型要先從一堆記憶裡檢索）下，TASK 比 BM25 RAG 在 CounterFact 上高 16.36 個百分點
- 相較三個 context-steering 方法，在 10 個模型-資料組合中的 9 個都勝出；跨模型（8B-27B、四個模型家族）的 23 組對照裡有 21 組達統計顯著
- 把「鄰近記憶誤用率」從 39.2% 壓到 7.5%（CounterFact 上 +10.8 個百分點複合分數）
- 落地門檻：方法要改模型內部的激活與做知識編輯，只能用在可存取權重的開源模型，封閉 API 模型（多數生產環境在用的 Claude、GPT 類服務）套用不了
- Limitation：論文用「normalised assertion matcher」自動判定幻覺類型，不是人工標註核對——但橫向比較用同一個 matcher，相對排序與統計顯著性仍可信

### Reviewer 一句話評

Pre-registered 的跨模型統計協定在這個領域相當少見，三種幻覺類型的拆解也讓「記憶幻覺」從模糊說法變成可檢驗的機制；但方法需要存取模型內部權重，目前只能用在自己部署的開源模型，離「幫你的 Claude/GPT agent 修 bug」還有一段距離。

### 給你的 take-away

- 如果你在評測記憶增強 Agent：不要只看檢索準確率，加一組「記憶就在 prompt 裡，但模型答案是否真的採用它」的測試，這篇的三種幻覺分類可以直接拿來當分類標準
- 如果你在自建開源模型的記憶系統：TASK 的「文字+激活引導+知識編輯」分工設計值得參考，尤其是當記憶庫會隨時間修訂（版本混淆問題）時

---

## 論文二｜MGMem：記憶索引不一定要靠生成式 LLM

**MGMem: An Efficient, Deterministic, and Provenance-Preserving Framework for Long-Horizon Agent Memory**
Jun-Hong Huang, Xin Tong, Jun Xia（香港科技大學（廣州）Red Bird MPhil 專案支援；資助包含中國國家自然科學基金、螞蟻集團、上海 AI 實驗室）　·　arxiv: 2611.33174

連結: [arxiv](https://arxiv.org/abs/2611.33174) · [alphaxiv](https://www.alphaxiv.org/abs/2611.33174)

### TL;DR

多數長程記憶系統靠生成式 LLM 把對話歷史重寫成摘要或知識圖，每次建索引都要花上千次生成呼叫，而且結果不確定、也看不到原始對話。MGMem 完全不用生成式呼叫，靠一個確定性的解析器做索引，在 LoCoMo 對話記憶測試上反而贏過三個生成式記憶系統（+2.60 到 +13.47 個百分點）。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint；正文含 NeurIPS 論文檢查清單與「感謝匿名審稿人」字樣，可能已投稿會議，但 Semantic Scholar 尚未標示確定 venue |
| 引用速度 | 原始提交 2026-10-21，公開於 2026-11-26 公告批次，Semantic Scholar 尚無引用資料 |
| 機構 | 致謝列出香港科技大學（廣州）Red Bird MPhil 專案、中國國家自然科學基金、CCF-GHFund、螞蟻集團與上海 AI 實驗室資助 |
| 社群反應 | HF Daily Papers 未上榜（已查 11/26、11/27）/ 已釋出 GitHub 程式碼（github.com/junhong-h/MGMem） |
| 可信度 | 通過 — 用相同種子（42-44）在本地重跑三個競爭對手、有 bootstrap 信賴區間，且自陳一個失效類別 |
| 證據成熟度 | 較完整 — 兩個獨立長程記憶 benchmark（LoCoMo、LongMemEval-S）、episode 層級檢索指標 |
| 可復現性 | 完整產物 — 程式碼公開，使用的是公開 benchmark |
| 為什麼選這篇 | 直接 — 直接挑戰「記憶索引要靠生成式 LLM」這個業界預設 |
| 方向新意 | 實質增量 — 用確定性解析器完全取代生成式索引步驟，同時解決成本、不確定性、溯源三個問題 |
| 今日重要性 | 高 — 生成式索引的成本與不確定性是記憶系統規模化部署時的實際痛點 |
| 實務連結 | 明確 — 可作為生成式記憶系統旁的輕量替代方案，尤其在意成本與可重現性的場景 |
| 編輯信心 | 高 — 本地重跑對手、揭露失效類別，比較基礎紮實 |
| 閱讀建議 | 必讀 — 任何在煩惱記憶索引建置成本的團隊 |
| 主要限制 | 只在英文對話測試，且在開放域問題類別的平均準確率低於 Dense／HippoRAG 2 兩個 baseline |

### 領域背景

主流的長程記憶系統（Mem0、A-Mem 等）多半靠 LLM 把原始對話重寫成摘要、事實或知識圖再建索引。這一步看似理所當然，但代價是：建一次索引要花上千次生成呼叫（貴）、同樣的對話重跑兩次可能得到不同的摘要（不確定）、而且讀者看到的是被改寫過的文字，不是原始那一輪對話（溯源消失）。

### 中階導讀

- **問題**：想像客服系統每天處理上萬通對話，每通都要建記憶索引——如果每通都要呼叫 LLM 重寫成摘要，光是索引建置的 API 費用就會變成一筆可觀的固定成本，而且同一通對話明天重新索引可能得到不一樣的摘要，複現調查時沒辦法對齊。
- **方法**：MGMem 完全跳過生成式重寫這一步，改用一套確定性的解析器：把跨對話重複出現的提及（mention）組織成一個關聯圖，問題裡提到的對象則透過一個三階段、以主體為條件的解析器去對應回原始對話，最後直接把原始對話片段還給讀者，不經過 LLM 改寫。
- **為什麼重要**：這篇示範了「記憶索引」和「記憶摘要生成」其實是兩件可以分開的事——索引負責「找到相關的原始片段」，不一定要靠生成式 LLM 才能做好；省下的不只是呼叫次數，還有不確定性和溯源能力。

### 深入要點

- 在 LoCoMo 四類問題上整體判準準確率達 75.89%，比本地重跑的 EMem（73.29%，+2.60pp）、AnchorMem（71.69%，+4.20pp）、LightMem（62.42%，+13.47pp）都高，且全程零生成式索引呼叫
- 在 episode 層級檢索指標上，hit@1 = 0.591、hit@5 = 0.837、hit@10 = 0.893，全面超過 BM25、Dense、Hybrid 三個檢索 baseline
- 比起本地重跑的 Hybrid 檢索（66.62%），整體再高 9.27 個百分點
- Limitation（作者自陳）：只在英文對話資料驗證（用 en_core_web_trf 做提及擷取）；在開放域問題類別平均準確率 49.65%，低於 Dense 與 HippoRAG 2 的 50.00% 參考值，顯示「近期重複提及的實體就是答案相關證據」這個核心假設在開放域問題上不一定成立
- 落地門檻：需要跨對話的提及解析管線（目前靠 spaCy 的 NER/coref），換語言或換領域需要額外驗證
- 與主流框架的關聯：可作為 Mem0、A-Mem 等生成式記憶系統旁的替代索引層，兩者甚至可以並存（論文提到可與密集檢索或 LLM 生成的補充內容組合）

### Reviewer 一句話評

本地重跑三個競爭對手、用相同種子與評分流程做比較，這個嚴謹度值得肯定；但作者自己也誠實標出開放域問題類別反而輸給基礎檢索法，說明「近期重複提及=相關證據」這個核心假設不是放諸四海皆準，讀者該依問題類型決定要不要套用。

### 給你的 take-away

- 如果你在煩惱記憶索引的 API 成本與可重現性：MGMem 的確定性解析器管線值得當成生成式索引之外的另一個選項，尤其是單跳、多跳、時間性問題較多的場景
- 如果你的應用大量是開放域問答：先看論文附錄的失效分析，MGMem 在這類問題上不保證優於基礎檢索法

---

## 論文三｜Contexture：清掉舊記憶省 GPU，但不是沒有代價

**Contexture: Runtime Context Eviction for High-Throughput Agent Serving**
作者未完整列出（內容擷取未保留作者署名）（機構未查證，Semantic Scholar API 多次限流無法查證）　·　arxiv: 2611.26980

連結: [arxiv](https://arxiv.org/abs/2611.26980) · [alphaxiv](https://www.alphaxiv.org/abs/2611.26980)

### TL;DR

Agent 執行歷史會不斷累積，佔用的 GPU KV cache 直接限制了伺服器能同時撐住幾個 agent session。Contexture 發現歷史裡 64% 的 token 其實已經被後續操作取代、可以安全清掉，靠這個機制讓真實 GPU 伺服環境的吞吐量提升 20–73%，但現場 Agent 實驗顯示最差情況下任務準確率會掉 3.7 個百分點。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（cs.DC 主分類，cs.AI/cs.MA/cs.OS 跨列） |
| 引用速度 | 發布 8 天（本篇為 14 天回溯池候選），Semantic Scholar API 多次回應 429，未能查證 |
| 機構 | 未查證（內容擷取未保留作者署名，Semantic Scholar 查詢受限流） |
| 社群反應 | HF Daily Papers 未上榜（已查 11/26、11/27）/ 未見 GitHub 連結，但比較基準是真實的生產工具（Hermes、OpenClaw、vLLM、LMCache） |
| 可信度 | 通過 — 兩模型、兩 harness、兩 benchmark 的生產級評測矩陣，對照生產預設與學術 baseline |
| 證據成熟度 | 較完整 — 同時報吞吐量、延遲、能耗、任務準確率，並揭露最差情況的準確率下降幅度 |
| 可復現性 | 未提供 — 擷取到的章節未見程式碼或產物釋出連結 |
| 為什麼選這篇 | 直接 — 把「記憶管理」問題延伸到 GPU 伺服層級的真實成本 |
| 方向新意 | 實質增量 — 把工具執行資訊和全域 KV 壓力狀態結合，做到 harness 與模型無關的淘汰機制 |
| 今日重要性 | 中 — 對正在規模化部署 Agent 服務的團隊是直接的基礎設施問題 |
| 實務連結 | 明確 — 針對長程 Agent 任務的 GPU 伺服瓶頸提出具體架構 |
| 編輯信心 | 中 — 評測矩陣寬廣可信，但可復現性未確認，且最差情況準確率風險需要讀者自行權衡 |
| 閱讀建議 | 略讀 — 對 Agent 平台的基礎設施/SRE 團隊有用，一般應用開發者可先看結論 |
| 主要限制 | 現場 Agent 實驗最差情況下任務準確率下降 3.7 個百分點，「已取代的歷史不會再被需要」這個判斷不是在所有情境都成立 |

### 領域背景

Agent 任務越跑越長，執行歷史（工具呼叫結果、中間輸出）不斷累積，每次請求都要重新餵給模型做 KV cache 計算。現有的情境縮減方法看不到 GPU 整體的快取壓力，而現有的 GPU 快取管理工具又看不到「這個工具呼叫的結果是不是已經被後面的操作取代了」這種語意資訊。兩邊互相看不見對方，就留下了優化空間。

### 中階導讀

- **問題**：想像一個 Agent 在處理一份文件，先呼叫工具讀了草稿版本，後來又讀了修訂版——草稿版本的內容已經沒用了，但它還佔在對話歷史裡，每次請求都要重新算一次 KV cache，就像辦公室裡堆著已經作廢的舊文件草稿，卻還要每次開會都重新影印一份。
- **方法**：Contexture 把「harness 看到的完整對話歷史」和「模型實際執行用的情境」分開管理：先靠工具執行的語意追蹤找出哪些歷史片段已經被取代（supersession），再結合 GPU 整體的 KV 壓力狀態和哪些片段還留在快取裡（prefix residency），決定什麼時候清、清哪些，不需要改 harness 邏輯或模型本身。
- **為什麼重要**：這篇把「記憶管理」問題從「要記住什麼」拉到「要花多少 GPU 成本記住」——對正在規模化服務 agent 平台的團隊，這直接關係到能撐住多少同時上線的使用者。

### 深入要點

- 分析發現：追蹤 token 的來源工具操作後，有 64% 的歷史 token 可被標記為可移除的候選
- 在兩模型（Qwen3.8-27B on H200、Qwen3.6-35B-A3B MoE on H100）、兩個開源 harness（Hermes、OpenClaw）、兩個長程 benchmark（Terminal-Bench 2.1、SWE-Atlas-QnA）上，SLO 下吞吐量比「無淘汰、harness 預設 compaction、AgentDiet、Continuum」中最好的高 20–73%
- 比起觀察遮蔽（observation masking），八組設定中有五組高出 7–63%；在 H100 上比單獨使用 LMCache 的 SLO 吞吐量高 23%
- 現場 Agent 實驗：平均準確率比「不淘汰」高 1.4 個百分點，但最差情況下低 3.7 個百分點（相比之下觀察遮蔽最差掉 3–28 個百分點）
- 另外還可降低每次完成 session 的 GPU 能耗最多 11%
- Limitation：「某段歷史已被取代、可以安全清掉」的判斷規則不是百分百正確，最差情況的準確率下降就是判斷錯誤的代價；論文未進一步分析哪種任務型態最容易踩到這個前提失效

### Reviewer 一句話評

評測矩陣寬廣扎實——兩模型兩 harness 兩 benchmark、對照生產預設與學術方法，而且誠實報了最差情況的準確率下降，不是只秀平均值;但「supersession 判斷」本身的錯誤率有多高、什麼任務類型最容易踩雷，論文沒有進一步拆解，留給讀者自己評估風險。

### 給你的 take-away

- 如果你在營運 Agent serving 基礎設施，GPU KV cache 是吞吐量瓶頸：Contexture 的「追蹤工具語意 + 全域 KV 壓力」設計值得參考，但部署前先用自己的任務分佈測一次最差情況的準確率影響，不要只看平均吞吐量提升
- 如果你在選型現有的 harness compaction 機制：這篇的基準測試資料顯示 Hermes/OpenClaw 預設的 compaction 策略（依內容長度觸發）都明顯不如結合 KV 壓力狀態的淘汰機制，值得重新檢視自己 harness 的壓縮時機設計

---

## 今日收穫

之前以為 Agent 記憶的問題主要是「記不記得住、找不找得到」，今天發現這其實是三層各自會出錯的獨立問題：記對了記憶，模型自己的舊知識還是可能蓋過它（TASK Memory）；要把記憶存進索引，生成式 LLM 其實不是必選項，確定性解析器反而可能更可靠（MGMem）；就算記憶架構設計得再好，GPU 伺服層級清理舊情境的決策本身也有判斷錯誤的風險，不是純粹的免費午餐（Contexture）。記憶管理不是一個問題，是三個問題疊在一起。

## 參考資料

- [TASK Memory: Beyond Text-Only Memory with Activation Steering and Knowledge Editing against Memory Hallucination](https://arxiv.org/abs/2611.34762)
- [MGMem: An Efficient, Deterministic, and Provenance-Preserving Framework for Long-Horizon Agent Memory](https://arxiv.org/abs/2611.33174)
- [Contexture: Runtime Context Eviction for High-Throughput Agent Serving](https://arxiv.org/abs/2611.26980)
- [MGMem GitHub repository](https://github.com/junhong-h/MGMem)
- [arXiv cs.AI new submissions, 2026-11-26](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL new submissions, 2026-11-26](https://arxiv.org/list/cs.CL/new)
