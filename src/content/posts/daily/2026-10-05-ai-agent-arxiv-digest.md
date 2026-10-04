---
title: "AI Agent Arxiv Digest — 2026-10-05"
date: 2026-10-05
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天的主題是 Agent 評測到底有多可信——DAYJOB 揭露頂尖模型在長時程專業工作上的真實能力缺口,Agent Evaluation Reliability 拆解排行榜訊號與雜訊的比例,KaliBench 則示範用可驗證獎勵訓練讓小模型追上大模型"
tldr: "DAYJOB 顯示最強模型在醫療/金融長時程任務嚴格計分下只通過 24.7%/23.9%,多數設定接近零分;Agent Evaluation Reliability 證明目前排行榜的模型排名信度低至 0.148-0.841,遠不如看起來穩定;KaliBench 用 SFT+RLVR 讓 8B 模型在資安工具操作整體分數追平 685B 模型"
series:
  name: "AI Agent Arxiv Digest"
  order: 134
---

> 🌏 [English version](/en/posts/daily/2026-10-05-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文合起來在問同一個問題:我們是怎麼知道 Agent 真的會做事的?DAYJOB 把 Agent 丟進真實的長時程專業工作(醫療、金融),用領域專業人士設計的 rubric 逐條打分,結果最強模型嚴格計分下也只通過兩到三成,多數設定接近零分。Agent Evaluation Reliability 則往回問一層:我們拿來判斷「哪個模型更強」的排行榜,名次本身有多穩?答案是常常不太穩——模型排名的信度區間低到 0.148。KaliBench 沒有停在揭露問題,它示範了一條具體修法:用可驗證獎勵訓練,一個 8B 模型在資安工具操作的整體分數上可以追平 685B 模型。三篇放在一起看,訊息很清楚:評測數字能告訴你方向,但在確認評分方式、排名信度與衡量指標之前,別把單一分數當成定論。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Agent 鷹架（Harness / Scaffold） | 包著模型的系統程式——怎麼呼叫工具、組織 prompt、管理對話迴圈。同一顆模型換不同鷹架,表現可能差很多 |
| RLVR（可驗證獎勵強化學習） | 用「能自動判斷對錯的訊號」（例如指令是否真的能執行成功）取代人工標記,訓練模型提高做對的機率 |
| Pass@1 / Exact Correct | 模型第一次嘗試就答對的比例,是常見但粗略的單一分數,容易掩蓋「差一點」跟「完全錯」的差別 |
| LLM 評審（LLM-as-judge） | 讓另一個 LLM 來判斷 Agent 的輸出對不對,取代人工評分——但評審本身的可靠度通常沒被驗證過 |
| 信度（Reliability） | 同一套評測換一批類似的題目重做,排名會不會大洗牌。信度低代表這次排行榜的名次,換個種子可能就不一樣 |

---

## 論文一｜DAYJOB：長時程專業工作基準,最強模型也只通過兩到三成

**DAYJOB: A Benchmark for Long-Horizon Professional Work**
Stephanie Finley, Liudas Panavas, Thomas Mikkelson et al.（機構未揭露,資料集與引用來源疑似與 Surge AI 相關,論文內未確認）　·　arxiv: 2610.01306

連結: [arxiv](https://arxiv.org/abs/2610.01306) · [alphaxiv](https://www.alphaxiv.org/abs/2610.01306)

### TL;DR

130 個由醫療與金融領域專業人士設計的長時程任務中,最強模型 Claude Opus 5.5 嚴格計分下只通過 24.7%（醫療）／23.9%（金融）,30 組模型設定的中位數通過率僅 0.6%／2.5%。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | NeurIPS 2026 AABA4ET Workshop（workshop,非主會議；依 arXiv comments 欄位） |
| 引用速度 | 發布 4 天,Semantic Scholar 尚無引用資料 |
| 機構 | 未揭露（GitHub 組織為 surge-ai,論文自引部落格文章疑似同源,未在文中確認） |
| 社群反應 | 本次研究範圍內未見於 HF Daily Papers 或 Papers with Code 復現 repo |
| 可信度 | 有條件通過 — 130 題經三層審核且有明確 rubric,但評分用的 agentic judge（OpenCode + Claude Opus 4.8）從未與人類專家評分做一致性驗證 |
| 證據成熟度 | 初步 — 分數在不同寬鬆度門檻下方向一致（放寬到 90% 達標時升至 62.4%/58.3%）,但「人類等效工時」只是任務設計者自估,並非實測人類基準 |
| 可復現性 | 部分產物 — 50 個醫療任務與 50/80 個金融任務公開於 HuggingFace（MIT 授權）,harness 開源（Apache 2.0）,另 30 個金融任務需申請取得 |
| 為什麼選這篇 | 直接 — 直接測試 Agent 能否完成真實專業長時程工作,而非抽象推理題 |
| 方向新意 | 實質增量 — 由領域專業人士設計、containerized 環境執行、二元專家 rubric 全有全無計分 |
| 今日重要性 | 高 — 揭露現有頂尖模型在真實專業場景的能力上限,遠低於一般展示用 demo 給人的印象 |
| 實務連結 | 明確 — 評估把 Agent 導入醫療/金融專業工作流之前,這組數字是現實的天花板參考 |
| 編輯信心 | 中 — 「專業長任務仍很難」的方向性結論可信,但精確百分比依賴未經驗證的 LLM 評審 |
| 閱讀建議 | 必讀 — 對「Agent 能不能做真正的專業工作」有疑問的人 |
| 主要限制 | 評分的 agentic judge 從未與人類專家評分做一致性驗證;「人類等效工時」是任務設計者自估而非實測基準 |

### 領域背景

多數 Agent benchmark 測的是定義清楚的短任務(解程式題、網頁導航)。DAYJOB 改問領域專業人士:真正的多日專業工作長什麼樣子,再用專家 rubric 取代單一對錯分數——概念上接近 GDPval 這類人類任務對照 benchmark,但這次是用 LLM 評審取代盲測人類評分。

### 中階導讀

- **問題**:想像要求一個新進分析師處理一份牽涉上百條規範、要核對記錄、再做出不能回頭的決定(例如要不要核發理賠)的案子。沒有人會只給他一個「對/錯」答案,而是用一條條檢查清單打分。DAYJOB 就是把這種真實工作搬進評測。
- **方法**:50 個醫療任務、80 個金融任務,每題平均要核對 47.5-57.5 條二元 rubric(含 8-16% 的「不可以做」禁止項),由另一個 Agent(OpenCode + Claude Opus 4.8)依 rubric 逐條打分,全部通過才算過關。
- **為什麼重要**:多數團隊看到「某模型拿下八成準確率」就覺得能上線,但 DAYJOB 顯示一旦任務變成多步驟、有禁止項、需要核對記錄的真實工作,通過率可以直接掉到個位數。

### 深入要點

- Claude Opus 5.5(adaptive/max)嚴格計分下通過率 24.7%(醫療)/23.9%(金融),30 組設定中位數只有 0.6%/2.5%
- 放寬到「完成 90% 以上 rubric」的門檻,通過率跳到 62.4%/58.3%,顯示多數失敗是差一點,不是整題錯 ⚠️(作者自行設計的 agentic judge 評分,未與人類專家評分比對)
- 30 組設定中,10 組在醫療任務全部拿零分,金融任務有 7 組全部拿零分
- 最貴的設定單次任務要花 7.10-11.47 美元、消耗 980-1780 萬 tokens(94-95% 來自快取)
- 落地門檻:若要用於真實醫療/金融流程,目前沒有任何設定能穩定跨過及格線,人工複核仍不可少
- Limitation:論文沒有獨立的 Limitations 章節,評分用的 LLM judge 從未驗證是否與人類專家一致

### Reviewer 一句話評

用真實專業 rubric 取代單一分數是明顯進步,但評分本身靠一個沒驗證過的 LLM judge,「人類等效工時」又只是任務設計者自估——在看到獨立的人類對照實驗之前,24.7% 這個數字該當作「方向正確但精確度存疑」。

### 給你的 take-away

- 如果你在評估要不要把 Agent 導入醫療/金融專業流程:先假設它在真實多步驟工作上的通過率遠低於 demo 展示的分數,人工複核不能省
- 如果你在設計自己的 Agent 評測:參考 DAYJOB 用專家 rubric 取代單一分數的做法,但務必驗證你的 LLM judge 跟人類評分的一致率,不要假設它們一致

---

## 論文二｜Agent 評測可靠嗎？拆解排行榜的訊號與雜訊

**Agent Evaluation Reliability: More Tasks Won't (Always) Fix a Leaderboard**
Michael Hardy, Ruhana Azam, Anka Reuel et al.（機構未揭露）　·　arxiv: 2610.00651

連結: [arxiv](https://arxiv.org/abs/2610.00651) · [alphaxiv](https://www.alphaxiv.org/abs/2610.00651)

### TL;DR

用 Bayesian 變異拆解法分析 Holistic Agent Leaderboard 的 9 個基準(加上 13 個經篩選的 Harbor-Index 子集作輔助佐證),發現「鷹架固定比較」的排名信度高達 0.935-0.994,但「模型排名」信度只有 0.148-0.841——同一個排行榜換一批相似任務,模型名次可能整個洗牌。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint |
| 引用速度 | 發布 5 天,Semantic Scholar 尚無引用資料 |
| 機構 | 未揭露 |
| 社群反應 | 本次研究範圍內未見於 HF Daily Papers 或 Papers with Code 復現 repo |
| 可信度 | 有條件通過 — 方法完整列出公式並可重現(GitHub 開源),但摘要強調的「22 個 benchmark」其實是 9 個主要分析加上 13 個經篩選的次要佐證混合 |
| 證據成熟度 | 較完整 — 核心數字(0.935-0.994 vs 0.148-0.841)可追溯到正文與附錄表格,作者自行點名適用範圍限制 |
| 可復現性 | 完整產物 — 程式碼與資料公開於 GitHub,含 Reproducibility Statement 與附錄完整估計細節 |
| 為什麼選這篇 | 間接 — 不是提出新 Agent 能力,而是提供讀其他評測論文數字時該有的判斷框架 |
| 方向新意 | 實質增量 — 首次用 Bayesian 變異拆解明確區分「模型差異」與「鷹架差異」對排名的貢獻 |
| 今日重要性 | 高 — 直接影響該如何解讀包括 DAYJOB、KaliBench 在內所有 Agent benchmark 論文的數字 |
| 實務連結 | 明確 — 做模型選型的團隊應該分散多個 benchmark,而不是在單一 benchmark 上狂加任務量 |
| 編輯信心 | 高 — 核心統計框架與數字可追溯,作者自行揭露適用範圍的侵蝕因子 |
| 閱讀建議 | 必讀 — 任何依賴排行榜做模型選型決策的人 |
| 主要限制 | 作者自己點名「前沿模型目前彼此表現太接近」可能是模型排名信度低的部分原因,而非純粹的 benchmark 設計缺陷;「22 個 benchmark」的標題性數字實際上是 9+13 的混合分析 |

### 領域背景

Agent 排行榜(像 HAL、Harbor Index)常被拿來當模型選型的依據,但任務數量少、模型間差異小的情況下,排名本身的統計信度很少被檢驗——這篇把「這個排行榜到底靠不靠譜」這件事本身量化出來。

### 中階導讀

- **問題**:想像你用兩次不同的小考成績去判斷哪個學生更強,如果小考題目太少或學生程度太接近,這次第一名下次可能變最後一名。Agent 排行榜有同樣的問題,只是通常沒人去量化「換一批題目會不會換名次」的機率。
- **方法**:用 generalizability theory 把排行榜分數拆成「真實模型差異」「鷹架差異」「任務抽樣雜訊」三個變異來源分別估計,再反推:固定鷹架比較時名次穩不穩(很穩),換模型比較時名次穩不穩(很不穩)。
- **為什麼重要**:如果你在用排行榜決定「要不要換模型」,這篇告訴你光加測更多題目通常救不了排名的信度上限,反而該分散到不同 benchmark 上。

### 深入要點

- 9 個 HAL benchmark 的模型排名信度區間為 0.148-0.841,鷹架固定比較的信度為 0.935-0.994
- 即使有無限多張同類型任務,OnlineMind2Web 的模型排名信度最多只從 0.148 升到 0.153(正文取整為「最多提升 0.10」,摘要寫 0.097,兩處有微小不一致)
- 分散到九個 benchmark 的組合評測,可把模型排名信度從單一 benchmark 的約 0.44 提升到 0.75,估計成本可降約 83%(從單一 HAL 全套約 4.7 萬美元降到約 1.9 萬美元) ⚠️(以擬合變異成分推算的成本投影,非重新花錢做的獨立複現)
- 13 個 Harbor-Index 子集是從原本 29 個 benchmark 中篩選「題數≥3」才留下的,作者自己點名這個篩選門檻會影響信度估計
- 落地門檻:若要認真比較模型,至少要跨 3-5 個設計迥異的 benchmark 分攤預算,而不是把全部預算砸在一個 benchmark 加測題量
- Limitation:信度高不代表 benchmark 本身測的東西「對」(reliability ≠ validity);目前的低信度結論可能部分來自「前沿模型彼此太像」而非 benchmark 設計本身的問題

### Reviewer 一句話評

統計框架紮實、完全開源可重現,是這份清單裡方法論最嚴謹的一篇;但「22 個 benchmark」的講法容易讓讀者以為是均質的大規模驗證,實際上主結論主要撐在 9 個 benchmark 上,引用時要說清楚。

### 給你的 take-away

- 如果你在用排行榜做模型選型:別只看單一 benchmark 的名次,至少分散到 3 個以上設計不同的 benchmark 再做結論
- 如果你在寫/讀其他 Agent benchmark 論文(包括本篇清單裡的 DAYJOB、KaliBench):記住「鷹架固定比較」通常比「跨模型比較」穩定得多,看到模型排名時多問一句「信度區間是多少」

---

## 論文三｜KaliBench：資安工具操作基準,用 RLVR 讓 8B 模型打平 685B

**KaliBench: A Fine-Grained Benchmark for Cybersecurity Tool Use on Kali Linux**
Pengfei Li, Naufal Suryanto, Sicheng Zhang et al.（機構未揭露,GitHub 組織為 RISys-Lab）　·　arxiv: 2610.02206

連結: [arxiv](https://arxiv.org/abs/2610.02206) · [alphaxiv](https://www.alphaxiv.org/abs/2610.02206)

### TL;DR

8,504 組「自然語言指令→Kali Linux CLI 指令」配對,24 個開源模型設定在無限制模式下沒有一個精確指令正確率超過 42%;但用 SFT+RLVR(可驗證獎勵強化學習)訓練過的 8B 模型,整體平均分數追到跟 685B MoE 模型只差 1 個百分點。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | NeurIPS 2026 Evaluations and Datasets Track(已確認,arXiv Comments 欄位直接標注) |
| 引用速度 | 發布 4 天,Semantic Scholar 引用數為 0 |
| 機構 | 未揭露(GitHub 組織為 RISys-Lab) |
| 社群反應 | HuggingFace Daily Papers 8 個讚、2 則留言(2026-10-01) |
| 可信度 | 有條件通過 — 資料集建構與訓練流程公開且數字可在正文表格追溯,但人工驗證僅由作者內部完成,非獨立標註者 |
| 證據成熟度 | 較完整 — 24 個開源模型設定加多個商用模型比較,並以 Unrestricted/Hinted/Restricted 多種模式交叉驗證 |
| 可復現性 | 完整產物 — 資料集與完整訓練流程開源(CC BY-NC 4.0),模型權重上傳 HuggingFace,並附 Croissant metadata |
| 為什麼選這篇 | 直接 — 提供「怎麼讓小模型在特定工具操作任務上追上大模型」的具體訓練配方 |
| 方向新意 | 實質增量 — 用可驗證獎勵(執行是否成功)取代人工標記來訓練工具操作能力,而非只是另一個靜態 benchmark |
| 今日重要性 | 高 — 對想用中小模型做特定領域工具呼叫的團隊有直接參考價值 |
| 實務連結 | 明確 — RLVR 的 reward 設計與訓練資料建構流程可直接參考複製到其他工具操作場景 |
| 編輯信心 | 高 — 已通過 NeurIPS 評測與資料集軌同行審查,核心數字在正文可追溯 |
| 閱讀建議 | 必讀 — 對訓練/評估工具呼叫能力有興趣的人 |
| 主要限制 | 「8B 打平 685B」只在整體平均分數成立,Hinted 模式下的精確指令正確率仍落後 15 個百分點(69.4% vs 84.5%);人工驗證僅由作者內部完成 |

### 領域背景

資安工具(像 Kali Linux 上的上千個工具)操作需要精準的 CLI 語法,錯一個參數整條指令就失效,這跟一般聊天式工具呼叫的容錯度完全不同——KaliBench 想知道模型是不是真的懂怎麼打指令,而不是只是「看起來很懂」。

### 中階導讀

- **問題**:想像要求一個新手用 1,642 種資安工具中的其中一種完成滲透測試任務,光記住工具名字不夠,還要記住每個參數的正確拼法與順序——打錯一個字元,指令可能直接失敗或做錯事。
- **方法**:先用 manuscript-grounded 流程產生 2.7 萬組「指令→CLI 命令」候選,經過 LLM 驗證、沙箱實際執行、人工複核三層過濾,最後留 30.7%(約 8,504 組);再用這些配對當作可驗證獎勵(指令能不能真的跑成功),直接訓練一個 8B 模型。
- **為什麼重要**:證明工具操作能力不一定要靠堆大模型參數,用對了 reward 訊號,小模型也能在特定領域追上大模型——這對想自己部署、不想依賴超大模型 API 的團隊是具體可行的路。

### 深入要點

- 24 個開源模型設定中最強的 GLM-5.2(753B)無限制模式下精確正確率只有 41.3%,沒人超過 42%
- SFT+RLVR 訓練後的 8B 模型(RedSage-K)整體平均分數 79.2%,對比 685B/37B-active MoE 的 DeepSeek-V3.2 的 80.2%,只差 1 個百分點
- 但在 Hinted 模式(給工具文件提示)的精確指令正確率上,RedSage-K 仍落後 DeepSeek-V3.2 15 個百分點(69.4% vs 84.5%) ⚠️(作者自行訓練的小模型,尚待第三方複現)
- 提供工具文件提示(Hinted 模式)是單一干預中效果最大的:Optional-Arg F1 從 45.1% 跳到 87.8%,精確正確率從 22.3% 跳到 73.1%
- 商用系統(GPT-5.6-Sol 61.68%、Codex 51.68%、Claude Opus 5 44.02%)在完整資料集上全面超過所有開源模型,但 Claude Opus 5 因為拒答 26.5% 的查詢而拉低總分
- Limitation:訓練資料與測試集在「工具」層級有重疊(1,642 個工具中 962 個同時出現在訓練與測試),雖然具體指令配對不重複,論文未特別點名這個工具層級重疊

### Reviewer 一句話評

資料建構流程嚴謹、已過 NeurIPS 評測與資料集軌同行審查,RLVR 訓練配方具體可複製;但「整體打平 685B」的講法容易蓋掉 Hinted 模式仍有 15 個百分點落差的事實,引用時該說清楚是哪個指標。

### 給你的 take-away

- 如果你在訓練/微調工具呼叫能力:KaliBench 的 SFT+RLVR 配方(拿「指令是否真的能執行」當獎勵)是目前最具體的小模型追大模型路線圖,可以直接參考
- 如果你在選型資安工具 Agent:別只看整體平均分數,去查精確指令正確率(Exact Correct)這個更嚴格的指標,尤其在沒有工具文件提示的情境下

---

## 今日收穫

之前以為「排行榜分數越高,模型就越可信」,今天發現排行榜本身的名次可能極不穩定(模型排名信度低到 0.148-0.841),而真正讓 Agent 在真實專業工作上及格的門檻,遠比展示用的 demo 分數更高(DAYJOB 多數設定不到 1% 通過率)。但也不是全是壞消息——KaliBench 證明只要獎勵訊號設計對了,8B 模型一樣能在特定任務上追平 685B 模型。

## 參考資料

- DAYJOB 論文:[arxiv](https://arxiv.org/abs/2610.01306) ・ [alphaxiv](https://www.alphaxiv.org/abs/2610.01306)
- DAYJOB 開源程式碼與資料集:[GitHub](https://github.com/surge-ai/dayjob)
- Agent Evaluation Reliability 論文:[arxiv](https://arxiv.org/abs/2610.00651) ・ [alphaxiv](https://www.alphaxiv.org/abs/2610.00651)
- Agent Evaluation Reliability 開源程式碼:[GitHub](https://github.com/hardy-education/scaffold_eval)
- KaliBench 論文:[arxiv](https://arxiv.org/abs/2610.02206) ・ [alphaxiv](https://www.alphaxiv.org/abs/2610.02206)
- KaliBench 開源資料集與訓練流程:[GitHub](https://github.com/RISys-Lab/KaliBench)
- KaliBench 社群討論:[HuggingFace Daily Papers](https://huggingface.co/papers/2610.02206)
