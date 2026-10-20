---
title: "AI Agent Arxiv Digest — 2026-10-18"
date: 2026-10-18
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天三篇檢視 Agent 的記憶與執行效率是否經得起檢驗——外在 QA 分數掩蓋了記憶系統 80% 的分類錯誤、使用者要求遺忘後資料仍有 39-76% 可被拼回、而決定何時該換上更強模型的訊號其實藏在弱模型自己的隱藏狀態裡"
tldr: "FEB-30 發現記憶系統的外在 QA 評測跟內在正確性平均相差 16 個百分點,系統對記憶操作的分類準確率其實只有 20%;MemCut 用 456 個刻意設計的秘密測試「刪除」是否等於「遺忘」,LLM 引導式刪除後仍有 39-76% 可從殘留證據拼回原貌;LEASH 證明決定何時該把任務交給更強模型不需要額外訓練,弱模型自己的隱藏狀態就有足夠訊號,35B 開源模型搭配後用低 19% 的成本打平 Claude Opus 5"
series:
  name: "AI Agent Arxiv Digest"
  order: 147
---

> 🌏 [English version](/posts/daily/2026-10-18-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇從三個不同角度檢視 Agent 的記憶與執行效率是否真的可信:FEB-30 發現幾乎所有記憶系統評測都只看「QA 答對了沒有」,這種外在評測方式掩蓋了一個系統性落差——內在記憶正確性跟外在 QA 分數平均相差 16 個百分點,系統對記憶操作(建立/更新/強化/取代)的分類準確率實際只有 20%,卻完全被 QA 分數的表面及格掩蓋;MemCut 接著追問「刪除」是不是等於「遺忘」——用 456 個刻意設計、埋在長對話裡的秘密測試後發現,就算用 LLM 主動挑選要刪的內容,殘留證據仍有 39-76% 可以被拼回原貌,使用者要求遺忘的資料,其實還躲在那些從沒直接提到秘密的日常對話裡;LEASH 則示範了相反方向的好消息:決定什麼時候該把任務交給更貴的強模型,不需要額外訓練監督模組或多次取樣,弱模型自己的隱藏狀態就藏著足夠的訊號,讓 35B 開源模型搭配後,可以用比一路用 Claude Opus 5 低 19% 的成本打平它的表現。三篇合起來的提醒是:Agent 記憶系統的「好」,目前多半只是 QA 分數的表面假象;但執行效率上的突破,反而比想像中容易拿到。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Agent(智能代理) | 可以自己規劃步驟、呼叫工具、跨多輪互動執行任務的 AI 系統,不是一問一答的聊天機器人 |
| 內在評測 vs. 外在評測(Intrinsic vs. Extrinsic) | 外在評測只看「問答對不對」這個最終輸出;內在評測直接打開記憶儲存,核對裡面存的內容是否正確——就像單元測試跟整合測試的差別 |
| 被遺忘權(Right to erasure) | GDPR 等隱私法規定使用者可以要求系統刪除自己提供的個人資料,是企業合規的基本義務 |
| Weak-to-Strong Escalation(弱到強升級) | 先讓便宜的小模型處理任務,只在判斷它可能做不好時才把控制權交給昂貴的大模型,藉此兼顧成本跟品質 |
| 隱藏狀態(Hidden states) | 模型內部每一層計算過程中產生的數值向量,通常比模型自己說出來的話更能反映它「有多確定」 |

---

## 論文一｜外在評測量不到的記憶漏洞:QA 答對,不代表記憶是對的

**Beyond Downstream QA: Rethinking How We Evaluate Agent Memory**
Sebastian-Antonio Toma, Jean de Kernier, Mike Ply, Oliviu Matei(Amazon Web Services;Technical University of Cluj-Napoca)　·　arxiv: 2610.22209

連結: [arxiv](https://arxiv.org/abs/2610.22209) · [alphaxiv](https://www.alphaxiv.org/abs/2610.22209)

### TL;DR

幾乎所有 Agent 記憶 benchmark 都只測「QA 答對了沒有」,這篇直接打開記憶儲存核對內容,發現內在正確性跟外在 QA 分數平均相差 16 個百分點,系統對記憶操作的分類準確率其實只有 20%,卻完全被 QA 分數掩蓋。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查) |
| 引用速度 | 發布 3 天,Semantic Scholar citationCount=0,尚無引用資料(符合剛發布的預期) |
| 機構 | Amazon Web Services;Technical University of Cluj-Napoca, Romania |
| 社群反應 | 未見於 HuggingFace Daily Papers 收錄;無 Papers with Code 條目 |
| 可信度 | 通過 — 正文提供完整的 benchmark 設計(30 條事實演化軌跡、6 診斷類別、3 難度層級)、intrinsic/extrinsic 雙指標、N=11 次重複實驗的統計顯著性檢定(Wilcoxon signed-rank,p<10⁻¹⁶),並做了 4 組系統設定的穩健性檢驗 |
| 證據成熟度 | 較完整 — 涵蓋方法、量化結果、統計檢定與跨系統設定的消融,但只套用在單一代表性記憶系統(extract-embed-classify-synthesize 架構)上 |
| 可復現性 | 部分產物 — 論文聲明程式碼與資料公開於 GitHub(amazon-science/feb-30-benchmark),該連結目前尚未上線 |
| 為什麼選這篇 | 直接 — 直指所有現有 Agent 記憶 benchmark 都只做外在 QA 評測這個系統性缺陷 |
| 方向新意 | 實質增量 — 首次把 NLP 詞向量評測的 intrinsic/extrinsic 區分引入 Agent 記憶評測,並用「paradigm inversion」生成有確定性 ground truth 的測試資料 |
| 今日重要性 | 高 — 任何正在用 QA 準確率當記憶系統唯一指標的團隊,都該知道這個系統性落差有多大 |
| 實務連結 | 明確 — 直接適用於 Mem0、Hindsight 等遵循同一套提取/嵌入/分類/合成架構的商用記憶系統 |
| 編輯信心 | 高 — 文章只陳述統計檢定支持的主張(16 個百分點落差、20% 分類準確率),並明確說明只測了一個代表性系統 |
| 閱讀建議 | 必讀 — 任何在評估或建置 Agent 記憶系統的人 |
| 主要限制 | 只套用在一個代表性記憶系統上,30 條軌跡的規模足夠做診斷,但不足以做精細的統計比較 |

### 領域背景

LLM Agent 跑長時間任務時需要外部記憶來累積超出 context window 的知識。但目前所有主流記憶 benchmark(MemoryAgentBench、LongMemEval、AMA-Bench 等)都共用同一套評測方式:對 Agent 提問,看它答對沒有。問題是這個分數同時混了記憶、檢索、生成三種能力——系統答錯,不知道是記憶真的壞了還是檢索沒找到;系統答對,也不能確定記憶內容本身是正確的,可能只是強模型靠著片段資訊硬是推理出了正確答案。

### 中階導讀

- **問題**:想像一個記憶系統裡存的某個事實早就過期沒更新,但一個很聰明的生成模型靠著推理,還是從殘缺資訊裡拼出了正確答案——QA 測驗給它打勾,但記憶其實是壞的。反過來,如果某段記憶正確存著,卻因為檢索時關鍵字不匹配而撈不出來,QA 測驗給它打叉,卻怪錯了對象。
- **方法**:作者用「paradigm inversion」反過來建構資料——先定好一串事實演化軌跡(某個事實怎麼從建立、更新到被取代),再讓 LLM 根據這串軌跡生成對應的文件、郵件、會議記錄,讓文件生成服從已知的 ground truth,而不是事後替真實文件人工標註。接著用兩套指標同時測:intrinsic 直接比對記憶儲存裡的內容跟已知軌跡是否吻合;extrinsic 就是傳統的問答準確率。兩者的差距,就是外在評測漏掉的部分。
- **為什麼重要**:這代表「記憶系統評測」應該像 NLP 詞向量評測一樣,分成內在(直接測表徵品質)跟外在(測下游任務表現)兩層——只看下游分數,會讓你誤判系統到底是哪一塊故障。

### 深入要點

- 30 條軌跡上,intrinsic(60.6%)跟 extrinsic(48.8%)平均相差 16.8 個百分點,44% 的軌跡超過有意義落差門檻(τ=0.15)
- 用嚴格的及格/不及格標準(≥0.5 vs. <0.5)判斷,21% 的情況兩種評測方式會得出相反結論——代表只靠外在評測,大約每 5 次就有 1 次會對系統正確性判斷錯誤(Cohen's κ=0.118,幾乎跟隨機猜測差不多)
- 系統正確分類記憶操作(建立/更新/強化/取代)的準確率只有 20.1%,這個數字完全看不出 extrinsic 分數,因為 extrinsic 分數在所有類別上都呈現平坦的 42-55%
- 難度越高,分類準確率掉得越快:從 L1 的 33.8% 掉到 L3 的 10.1%,但 extrinsic QA 分數在三個難度層級幾乎沒變化(47.7-50.9%),完全看不出系統正在崩壞
- 落地門檻:要套用這套 intrinsic 評測方法,團隊得先能直接存取記憶儲存的內部內容(而不只是透過對話介面問答),對商用 SaaS 記憶服務可能需要額外的 API
- Limitation:只在一個代表性記憶系統上驗證(雖然做了 4 組設定穩健性測試),30 條軌跡的規模足夠診斷,但不足以做精細統計比較

### Reviewer 一句話評

把 NLP 詞向量評測的 intrinsic/extrinsic 區分搬進 Agent 記憶領域,這個類比很扎實,而且用 paradigm inversion 解決了「怎麼確定 ground truth」的老問題;但目前只驗證了一個代表性系統,想知道這個 16 個百分點的落差能不能類推到其他記憶架構,還需要更多系統的複驗。

### 給你的 take-away

- 如果你在建置或採購 Agent 記憶系統:不要只拿 QA 準確率當驗收標準,想辦法直接核對記憶儲存裡的內容有沒有正確更新——這篇顯示分類準確率可能低到 20%,卻完全被 QA 分數掩蓋
- 如果你在設計自己的記憶評測:用 paradigm inversion 的思路反過來生成測試資料,可以用更低的標註成本拿到有確定性 ground truth 的測試集

---

## 論文二｜使用者要求「忘記」之後,秘密還留著痕跡

**MemCut: Every Secret Leaves a Trail in the Long-Term Memory of LLM Agents**
Cheng Zhang, Xuanning Cao, Zhicheng Zheng, Hui Xiong(The Hong Kong University of Science and Technology (Guangzhou);University of Science and Technology of China)　·　arxiv: 2610.21405

連結: [arxiv](https://arxiv.org/abs/2610.21405) · [alphaxiv](https://www.alphaxiv.org/abs/2610.21405)

### TL;DR

測試 456 個刻意設計、埋在長對話裡的秘密後發現,就算用 LLM 主動挑選要刪的內容,殘留證據仍有 39-76% 可以被同一個讀取模型拼回原貌——使用者要求遺忘的資料,其實還躲在從沒直接提到秘密的日常對話裡。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查) |
| 引用速度 | 發布 3 天,Semantic Scholar citationCount=0,尚無引用資料(符合剛發布的預期) |
| 機構 | The Hong Kong University of Science and Technology (Guangzhou);University of Science and Technology of China |
| 社群反應 | 有 HuggingFace Paper page(huggingface.co/papers/2610.21405,2026-10-15 上線),但目前無 model/dataset/space 連結;無 Papers with Code 條目 |
| 可信度 | 通過 — 456 個人工設計的秘密、完整標註的證據鏈與最小充分集、5 種記憶設計 × 4 個 LLM × 3 種刪除 baseline 的對照實驗,並用兩套獨立演算法核對全部 456 個最小切割 |
| 證據成熟度 | 較完整 — 涵蓋資料建構驗證(合併證據可還原 96-99%、單一證據還原 0%)、budget/choice/reach 三因子消融拆解、案例研究,但只限文字記憶,不含多模態或參數化記憶 |
| 可復現性 | 部分產物 — 論文聲明 benchmark 將釋出供研究使用,公開程式碼連結目前尚未上線 |
| 為什麼選這篇 | 直接 — 直接測試 GDPR「被遺忘權」在 Agent 長期記憶裡的實際落地程度 |
| 方向新意 | 實質增量 — 首創 native/residual 雙指標與 hidden-risk share,把「助理答不出來」跟「記憶真的刪乾淨」兩件事分開測量 |
| 今日重要性 | 高 — LLM 引導式刪除後仍有 39-76% 殘留可還原,這對任何處理使用者資料刪除請求或企業合規的團隊都是立即可用的風險數字 |
| 實務連結 | 明確 — 直接測試 MemoryBank/Nemori/LightMem 等類似 Mem0 架構的刪除有效性,可直接套用到公司自己的記憶模組上評估 |
| 編輯信心 | 高 — 文章只陳述三種 reference baseline 在固定設定下的表現,並明確說明這是「重用現有元件」的參考效能,不是「刪除方法的能力上限」 |
| 閱讀建議 | 必讀 — 做企業資料刪除合規或記憶系統設計的人 |
| 主要限制 | 只評測重用現有檢索與寫入元件的三種參考刪除 baseline,不是專門設計的刪除方法,所以數字是「現狀基準」而非「刪除能力的上限」 |

### 領域背景

長期記憶已經是 LLM Agent 的標配元件,但研究主要集中在怎麼準確、有效率地檢索記憶,「怎麼確實忘記」反而被忽略得多。GDPR 等隱私法明文規定使用者有權要求刪除自己的資料,但移除「直接說出秘密」的那條訊息,不代表秘密真的被抹除了——因為同一個秘密往往可以從其他從沒直接提到它、看起來完全無害的日常對話裡被重新拼湊出來。

### 中階導讀

- **問題**:想像你跟 AI 助理提過一次健康診斷,後來要求它刪掉這件事。助理刪掉了那條直接說出診斷的訊息,但你後來跟同事提過「要請假去看那個專科」、約了某個門診時間、買了某種藥——這些訊息單獨看都無害,助理自己答不出診斷結果了,但只要把這些片段拼在一起,秘密其實還原封不動地躺在記憶裡。
- **方法**:MemCut 設計兩個指標來分開測量這個問題:native recovery 測「透過系統自己的檢索機制,還能不能問出答案」;residual recovery 測「把所有跟秘密有關、沒被刪除的物件直接餵給同一個讀取模型,它還能拼出答案嗎」。兩者的差,除以 residual recovery,就是 hidden-risk share——衡量有多少「記憶其實還在」的風險,是系統自己的檢索沒抓出來的。
- **為什麼重要**:這代表「助理答不出來了」跟「記憶真的刪乾淨了」是兩件不同的事,只測前者會讓團隊誤以為遺忘請求已經被落實,但真正的風險(秘密仍可被拼湊還原)其實沒有解決。

### 深入要點

- 只刪除直接揭露秘密的訊息(S0),native recovery 從 91-95% 降到 57-60%,但 residual recovery 仍停在 85-99%——因為只有 1.8% 的證據跟揭露訊息共用同一個對話場次,其他證據分散在別處完全沒被動到
- 讓 LLM 從 20 個檢索候選裡主動挑 10 個刪除(S2 策略),residual recovery 降到 39-76%,比單純依檢索排序刪除(S1)再低 7-17 個百分點,顯示「選得準」確實有幫助
- 刪除後 hidden-risk share 不減反增:以 Turn RAG 為例,刪除前是 5-9%,S0 之後變成 39-42%,S2 之後暴增到 76-82%——代表刪除動作本身讓「系統看起來忘了、但其實記憶還在」的風險變得更隱蔽
- 分析發現候選池覆蓋率(reach)是主要瓶頸:橫跨 132 組參數設定,殘留回復率幾乎完全跟「刪除了幾個證據輪次」成正比(R²=0.95),把候選池從 20 擴大到 60 筆,殘留回復率能再降 12.5-23.9 個百分點——說明問題不在「挑得不夠準」,而在「候選池根本沒撈到足夠的證據」
- 落地門檻:要測試自己的記憶系統,需要先定義好「秘密」「揭露」「證據」「最小充分集」的標註架構,論文作者平均花了 12 小時人工設計每一段長對話
- Limitation:只評測了重用現有檢索與寫入元件的三種參考刪除 baseline,反映的是「現狀下有多少風險」,不是「專門設計的刪除方法能做到多好」

### Reviewer 一句話評

用 native/residual 雙指標乾淨地拆開「答不出來」跟「真的刪乾淨」兩件事,這個設計思路很扎實,而且人工標註跟兩套獨立驗證演算法都交代得清楚;但目前測的是重用現有元件的參考 baseline,真正針對「遺忘」設計的刪除方法能不能做得更好,這篇還沒給出答案。

### 給你的 take-away

- 如果你的產品要支援「刪除我的資料」這類使用者請求:不要只測助理刪除後答不出問題了,想辦法核對跟那筆資料有關的其他記憶物件(就算從沒直接提到它)有沒有也被清理
- 如果你在做企業合規稽核:這篇的 hidden-risk share 指標值得直接拿來用——刪除後風險沒有不見,只是從系統檢索看不到,換個角度查就可能找到

---

## 論文三｜決定要不要換更強模型,其實不用訓練監督模型——弱模型自己的隱藏狀態就有答案

**LEASH: Uncertainty-Aware Weak-to-Strong Escalation and Oversight for Computer-Use Agents**
Qingni Wang, Changdae Oh, Yuzhe Yang, Sharon Li, Jiachen Yang, Ang Li, Xin Eric Wang(Simular;University of Wisconsin–Madison)　·　arxiv: 2610.22280

連結: [arxiv](https://arxiv.org/abs/2610.22280) · [alphaxiv](https://www.alphaxiv.org/abs/2610.22280)

### TL;DR

用弱模型自己的隱藏狀態(跟它過去成功/失敗的軌跡比對)當升級訊號,不需要額外訓練監督模組或多次取樣,35B 開源模型搭配後在 OSWorld 上達到 73.66% 任務成功率,打平一路用 Claude Opus 5 的 72.90%,成本卻低 19.2%。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查) |
| 引用速度 | 發布 3 天,Semantic Scholar citationCount=0,尚無引用資料(符合剛發布的預期) |
| 機構 | Simular(電腦操控 Agent 新創,作者所屬公司);University of Wisconsin–Madison(Sharon Li 團隊,OOD 偵測領域學者) |
| 社群反應 | HuggingFace Daily Papers 收錄(6 個 upvote);Papers with Code 有收錄條目(paperswithcode.co/paper/2610.22280);公司官方部落格發表研究說明(simular.ai) |
| 可信度 | 通過 — 正文有正式問題定義(budget-constrained sequential stopping problem)、理論分析含證明、4 種弱模型 backbone × OSWorld benchmark 的完整實驗、與兩個既有方法(StepWise、Progress Advantage)的直接對照,以及 component-wise 消融 |
| 證據成熟度 | 較完整 — 涵蓋方法、理論、跨 4 種 backbone 的實驗、既有方法對照、消融與敏感度分析,但只在 OSWorld 單一 benchmark 上驗證 |
| 可復現性 | 部分產物 — OSWorld 是公開 benchmark,論文附完整演算法與超參數設定,但 LEASH 自身未見獨立官方程式碼 repo |
| 為什麼選這篇 | 直接 — 直接解決「何時該讓更貴的強模型接手」這個電腦操控 Agent 部署的核心成本問題 |
| 方向新意 | 實質增量 — 把弱模型自己的隱藏狀態同時用在「升級判斷」跟「升級後對強黑箱模型的監督(shadow oversight)」兩件事上,不需額外訓練或取樣 |
| 今日重要性 | 高 — 用 35B 開源模型搭配 LEASH,可以用比 Opus 5 低 19% 的成本打平其表現,對正在控制 Agent 推理成本的團隊是立即可行的作法 |
| 實務連結 | 明確 — 可直接套用在任何電腦操控/GUI Agent 的 weak-to-strong routing 架構上 |
| 編輯信心 | 高 — 數字都附帶與隨機升級及既有方法的對照,並誠實呈現 AUROC「效果中等」的部分而不是誇大成完美訊號 |
| 閱讀建議 | 必讀 — 做電腦操控 Agent 或 Agent 成本優化的人 |
| 主要限制 | 只在 OSWorld 一個 benchmark 上驗證,不確定能否推廣到其他類型的長程 Agent 任務 |

### 領域背景

電腦操控 Agent(computer-use agent)跑長程任務時,全程用頂級模型跑每一步成本很高,但只靠小型開源模型又常常做不好。Weak-to-strong escalation 讓小模型當預設執行者,只在判斷需要時才把控制權交給大模型——但業界現有做法要麼得再跑一個額外的監督 agent(增加成本),要麼得額外訓練一個監督模組(需要標註資料跟訓練成本),而且升級之後,強模型是黑箱 API,內部狀態看不到,驗證信心也不可靠。

### 中階導讀

- **問題**:想像一個便宜的小模型在操作電腦完成多步驟任務,大部分時候表現不錯,但偶爾會卡住、繞圈圈或做錯決定。如果每一步都找昂貴的大模型來把關,成本太高;如果完全不管,品質沒保障。而且就算把控制權交給大模型,它也可能在複雜任務裡迷失方向,偏偏這個大模型通常是看不到內部運作的黑箱 API,很難知道它什麼時候也需要被盯著。
- **方法**:LEASH 利用一個已經被證實的現象——模型的隱藏狀態其實早就「知道」自己可能要失敗了。作者先讓弱模型在一小批任務上跑過一次,記錄下它在成功軌跡跟失敗軌跡裡的隱藏狀態,建立一個「參考資料庫」。接下來遇到新任務時,比較當下隱藏狀態離過去的「成功」近還是離「失敗」近,算出一個不確定性分數。這個分數做了三件事:任務一開始就先判斷要不要升級(initial gate),執行過程中每一步都監看要不要臨時升級(runtime gate),升級之後弱模型從「演員」變成「影子觀察者」,繼續用同一套隱藏狀態訊號盯著強模型,發現它可能也迷路時觸發反思式介入。整套流程完全不用額外訓練或多次取樣,直接重用生成動作時本來就會產生的隱藏狀態。
- **為什麼重要**:這代表決定「什麼時候該花錢換更強模型」這件事,答案可能已經藏在便宜模型自己的內部運作裡,不需要額外投資訓練監督模組或跑一個昂貴的監督 agent——這對正在想辦法壓低 Agent 推理成本、又不想犧牲品質的團隊是直接可用的思路。

### 深入要點

- 用 Qwen3.5-35B-A3B 當弱模型,LEASH 在 64.1% 任務升級率下達到 73.66% 成功率,對比一路用 Claude Opus 5(100% 升級)的 72.90%,成本從 $0.5094 降到 $0.4117,低了 19.2%
- 在 4 種弱模型 backbone 上,LEASH 在相同升級比例下都比隨機升級高出 6.55-11.94 個百分點,證明這個隱藏狀態訊號確實提供了有用資訊,不只是「升級機會變多」的效果
- Component-wise 消融顯示:加上升級機制,成功率從 41.15%(只有任務拆解的 Manager)跳到 67.94%;再加上升級後的 Shadow 監督跟介入機制,又進一步提升到 73.66%,顯示升級後持續監督強模型這件事本身就有獨立貢獻
- Shadow 觀察者觸發介入的那些任務,原本一路用 Opus 5 都只有 51.6% 會成功(明顯比沒被觸發的 74.5% 低),顯示它確實抓到了「連強模型都容易出錯」的困難任務子集
- 跟兩個既有方法比較(同樣用 EvoCUA-8B 當弱模型):StepWise 在 49.6% 升級率下成功率 58.40%,Progress Advantage 在 46.9% 升級率下 62.98%,LEASH 用更低的 45.4% 升級率就拿到 67.18%
- Limitation:只在 OSWorld 單一 benchmark 上驗證;不確定性估計器的 AUROC 在不同 backbone 跟階段間表現不一(0.488-0.749),效果中等而非近乎完美的訊號

### Reviewer 一句話評

把「何時升級」跟「升級後怎麼監督黑箱強模型」這兩個通常分開處理的問題,統一用同一個訓練免費的隱藏狀態訊號解決,這個設計很優雅,而且有理論分析跟扎實的消融支撐;但目前只在 OSWorld 一個 benchmark 上驗證,想知道這套方法能不能類推到其他長程 Agent 任務,還需要更多場景的複驗。

### 給你的 take-away

- 如果你在做電腦操控或 GUI Agent 的成本優化:不用急著投資訓練一個獨立的監督模組,先試試看能不能直接比對弱模型當下的隱藏狀態跟它過去成功/失敗軌跡的距離,這個訓練免費的訊號可能就夠用
- 如果你的 Agent 架構已經有 weak-to-strong escalation:考慮把同一套升級訊號延伸到升級後的監督上,讓弱模型從單純的執行者轉成持續盯著強模型的觀察者,這篇顯示這個額外步驟能帶來獨立的效能提升

## 今日收穫

之前以為「記憶系統測 QA 準不準」就能代表記憶好不好、「使用者要求刪除」就等於資料真的被抹除、「要不要換更強模型」是個需要額外訓練監督模組才能解決的難題——今天這三篇分別打破了這些假設:記憶系統的分類準確率可能只有 20%,卻被平坦的 QA 分數完全掩蓋;刪除揭露秘密的那句話之後,39-76% 的秘密還能從看似無關的對話片段裡被拼回原貌;而決定何時升級給強模型,答案可能早就藏在弱模型自己的隱藏狀態裡,不用多花一分訓練成本。評測分數跟「系統真的做到了」之間,中間可能藏著比想像中更大的落差。

## 參考資料

- [Beyond Downstream QA: Rethinking How We Evaluate Agent Memory — arXiv 2610.22209](https://arxiv.org/abs/2610.22209)
- [MemCut: Every Secret Leaves a Trail in the Long-Term Memory of LLM Agents — arXiv 2610.21405](https://arxiv.org/abs/2610.21405)
- [LEASH: Uncertainty-Aware Weak-to-Strong Escalation and Oversight for Computer-Use Agents — arXiv 2610.22280](https://arxiv.org/abs/2610.22280)
- [LEASH 研究說明 — Simular 官方部落格](https://www.simular.ai/articles/put-the-frontier-model-on-a-leash)
- [LEASH — Papers with Code](https://paperswithcode.co/paper/2610.22280)
- [MemCut — HuggingFace Paper page](https://huggingface.co/papers/2610.21405)
- [OSWorld benchmark](https://arxiv.org/abs/2404.07972)
- [Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory](https://arxiv.org/abs/2504.19413)
- [arXiv cs.AI new submissions](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL new submissions](https://arxiv.org/list/cs.CL/new)
