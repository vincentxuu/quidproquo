---
title: "請模型當裁判：grader 選擇、裁判偏誤與校準｜Stanford CS329Z 第 14 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 15
tldr: "第 14 堂依課表談三種 grader、judge prompt 設計、已知偏誤、pairwise 與 pointwise、pass@k 與 pass^k 等非確定性指標、harness 設計與 Anthropic 的八步路線圖。讀物從 Demystifying Evals、MT-Bench 讀到 AutoMetrics 與 AutoLibra。"
description: "依課表與指定閱讀預習 Stanford CS329Z 第 14 堂 LLM-as-Judge & Evaluation Infrastructure：深讀 Demystifying Evals、MT-Bench、AutoMetrics 與 AutoLibra，說明裁判形態、偏誤與校準。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-14-llm-as-judge-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

開放式回答沒有標準答案，這是第 14 堂（11/9，LLM-as-Judge & Evaluation Infrastructure）的起點。傳統選擇題基準量的是知識對錯，例如 [MMLU](https://arxiv.org/abs/2009.03300) 這類多選題。兩個回答可以都對，只有一個讓人想用，這段差距傳統基準看不見。

人工評分是黃金標準，代價是又貴又慢。Prompt 一改，總不能重請幾十位研究生再投一次票。解法是請強模型當裁判，做法在 [MT-Bench 論文](https://arxiv.org/abs/2306.05685)裡完整驗證過；Anthropic 的[評測指南](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)則把它放進智慧體評測的完整拼圖。指定讀物還有 Ryan 等人的 AutoMetrics，延伸閱讀是 AutoLibra，本文四篇都深讀。裁判本身也會犯錯，所以這堂的重點不只是怎麼請裁判，還有怎麼檢查裁判。截至 2026-10-29，這堂還沒有公開投影片，本文是依官方課表與指定閱讀寫的預習，不代表講師在課堂上說過的內容。第 11 堂以後的堂次編號依課表順序推算，官網目前只列日期與主題。

## 先確認證據，再決定由誰判分

依[官方課表](https://cs329z.stanford.edu/)，11/9 談 judge 與評估基礎設施。截至 2026-10-29 尚未發布這堂的公開投影片；以下依指定閱讀預習。繁中客服助理即使語氣自然，也可能答錯退款狀態，不能用一個總分掩蓋這種差別。

### 先確認哪種證據能判哪件事

客服是否完成退款，可查交易狀態；是否解釋清楚，才需要 rubric 與語言判斷。把每項要求對到可觀測證據，再選 grader。[Anthropic 的評測指南](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)將程式、模型與人類評分放進同一套 harness，也區分一次成功與多次都可靠。不要拿多次嘗試至少成功一次，替代每次使用都能成功的承諾。

### 裁判要有自己的考卷

先保留一組人類已判定的輸出，包含簡短但正確、冗長但錯誤與證據不足的答案。固定 rubric 後，比較模型與人類分歧，再交換 pairwise 答案順序測位置影響。[MT-Bench 論文](https://arxiv.org/html/2306.05685)研究位置、冗長等偏誤；交換順序是診斷方法，不保證消除所有偏誤。裁判模型、prompt 或規則改了，都要重新校準。

## 讀物 1｜Demystifying Evals for AI Agents

原文：[Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)

### TL;DR

指南把任務、trial、grader 與 harness 分清，組合程式、模型、人類評分，並區分至少成功一次與多次皆成功。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 最適合誰 | 已有工具型 agent，準備建立第一批可重跑驗收的人。 |
| 先讀哪裡 | Task／trial／grader／harness 的定義，再讀成果與軌跡的區別。 |
| 採用成本 | 需維護乾淨測試環境、失敗案例與人工校準，並非換一個 judge prompt 即完成。 |

### 領域背景

單次問答通常能把最終答案交給評分器，agent 卻會讀寫檔案、改變資料庫，再用後續動作補救前面的錯誤。最終回覆說「已處理」時，外部狀態可能根本沒變；軌跡看起來曲折，任務也可能確實完成。因此，評估必須同時描述任務起點、允許的動作與可觀察的完成條件。

### 中階導讀

**問題。** 同一個任務有多種合理解法時，如何確認它真的完成，又不因軌跡與範本不同而誤判？

**方法與觀察。**

Anthropic 把 grader 分成三種。Code-based 看確定性證據：字串比對、單元測試、靜態分析、工具呼叫紀錄。Model-based 看開放性品質：照 rubric 打分、自然語言斷言、兩兩比對、參考答案比對、多裁判共識。Human 當黃金標準：專家審查、群眾外包、抽查採樣。

選擇原則務實：能用確定性檢查就不用模型。模型裁判留給非用它不可的地方，人力留給校準模型裁判與定期抽查。一個客服任務可以同時掛三種 grader：票單狀態是否寫入資料庫、關鍵工具是否照規矩呼叫、語氣是否有同理心。前兩項是 code-based，最後一項才請模型出手。

| Grader | 主要證據 | 本文客服例子 | 人類的角色 |
|---|---|---|---|
| Code-based | 狀態、測試、工具紀錄 | 票單狀態與工具使用 | 決定檢查什麼 |
| Model-based | 回答與 rubric | 語氣是否有同理心 | 校準與抽查 |
| Human | 專家或使用者判斷 | 校準模型裁判 | 提供對齊依據 |

結論先記下：judge 只是 model-based 那一格，不是評測的全部。選錯 grader，再強的裁判都救不回來。

**結果怎麼讀。** 這是工程指南；pass@k 與 pass^k 回答不同問題，不能互換成產品可靠性。

### 深入要點

- **Transcript 與 outcome 要分開。** 軌跡能說明 agent 做過什麼，環境狀態才回答任務是否完成。若只比對一條理想工具序列，會把有效的替代解法誤判為失敗。

- **環境重置是評估的一部分。** 前一次留下的檔案或帳號狀態，可能讓下一次試驗看似成功。每次 trial 的初始條件與工具版本都應可追溯。

- **重試指標對應不同使用方式。** pass@k 看多次嘗試中至少一次成功，pass^k 看整組嘗試皆成功；可重試的搜尋助手與每次都得正確的執行器，需要不同的摘要。

### Reviewer 一句話評

這篇最適合在寫第一個評測之前讀：它能防止團隊把「有裁判分數」誤當成「有驗收依據」，但不提供可直接套用的可靠性門檻。

### 給你的 take-away

挑一個會寫入外部狀態的任務，固定初始資料，並各存一份最終回覆、工具紀錄與狀態快照；讓 grader 分別指出成功或失敗的證據，再重跑以檢查結果是否一致。

## 讀物 2｜MT-Bench and Chatbot Arena

原文：[MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685)

### TL;DR

研究比較 pairwise、single-answer 與 reference-guided 判分，並測位置、冗長與自我偏好。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 最適合誰 | 需要大量比較開放式回答，又能取得少量領域專家標註的團隊。 |
| 先讀哪裡 | 裁判形式之後接位置與冗長偏差實驗，最後核對專家比較的排除條件。 |
| 不宜單獨用於 | 需要可驗證正確性或高後果授權的判決；偏好勝出不足以完成這些驗收。 |

### 領域背景

開放式助理的回答很難只用正確答案比對：完整性、表達與偏好都會影響評價。人工兩兩比較有價值，成本卻限制了規模。MT-Bench 用可控的多輪題測裁判，Chatbot Arena 蒐集真實使用者的盲測偏好；兩者提供不同的驗證視角，不能把聊天室投票當成所有專業任務的標準答案。

### 中階導讀

**問題。** 把人工偏好判斷交給模型後，哪些答案差異會反映品質，哪些其實只是裁判的呈現偏好？

**方法與觀察。**

裁判形態有三種。第一種 pairwise 把兩份回答並排，只選優劣不打分。第二種 pointwise 對單份回答直接打分，又稱 single answer grading。第三種 reference-guided 專治數學推理題：先附參考解答再判。

取捨在成本與靈敏度之間。Pairwise 靈敏，打分工作量隨參賽者數量平方成長。Pointwise 好擴展，絕對分數容易隨裁判模型浮動。MT-Bench 的驗證顯示，[GPT-4](https://arxiv.org/abs/2303.08774) 的 pointwise 與 pairwise 結果高度一致，內部標準相當穩定。

數學題是裁判的弱點：會解題不代表會判題。錯誤答案會把裁判帶偏，連基本題都可能判錯。緩解法有兩層：先讓裁判獨立解一次再判，或直接附上參考解答。附上參考解答後，誤判率降到一成五左右。

第一種壞習慣是 position bias：總愛選排第一的答案。緩解法是換位重判，兩次都贏才算贏，不一致就記平手。花雙倍打分成本，買一個可信的勝負。

第二種是 verbosity bias：又長又水的回答反而吃香。論文用「重複列表」攻擊驗證：把答案的列表改寫後再貼一次，不加任何新資訊。較弱的裁判幾乎每次都上當，GPT-4 的上當率不到一成。

第三種是 self-enhancement：懷疑裁判偏愛自己生成的答案。這條證據不足，[Claude](https://www.anthropic.com/claude) 的自愛幅度看似最大，GPT-3.5 又看不出偏好。論文誠實收尾：無法定論，需要更乾淨的對照實驗。

校準才是信任的來源。基準是五十八位專家的投票。在排除平手的 S2 設定中，GPT-4 與人類多數的一致率為八成五，人類專家彼此則為八成一。這支持該設定中的偏好對齊，沒有證明模型在任意領域都能取代專家。

**結果怎麼讀。** 85% 對 81%的比較限於S2 排除平手設定；58 位專家與23 題重複列表攻擊都不能代表任意領域。

### 深入要點

- **順序交換是在量裁判穩定性。** 同兩份回答換位後勝負翻轉，表示判決受到呈現方式影響；記平手能減少偏差，但也會減少可區分的比較。

- **參考解答會改變裁判資訊條件。** 數學題附解答後較少誤判，支持的是 reference-guided 設定，不足以推論模型能獨立驗證陌生推理。

- **偏好一致率有條件。** S2 排除平手後的專家比較，與包含含糊案例的實務審查不同；自我偏好則仍受答案品質等混雜因素影響。

### Reviewer 一句話評

它讓模型裁判成為值得驗證的工程選項；最值得複製的是偏差測試，而非把與專家一致的比例貼成跨領域認證。

### 給你的 take-away

從自己的任務抽出一小組有人工判決的答案對；同時測原順序、交換順序及刻意加長但不增資訊的版本。把翻盤案例交回人工修訂 rubric，保留原始判決供後續裁判版本比較。

## 讀物 3｜AutoMetrics

原文：[AutoMetrics](https://arxiv.org/abs/2512.17267)

### TL;DR

AutoMetrics 從既有與新生指標挑選候選，再以少量人類回饋學出可解釋的評分組合。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 最適合誰 | 只有少量人類評分，仍需要頻繁迭代主觀品質的產品團隊。 |
| 先讀哪裡 | Generate／retrieve／regress／report，再看不同 backbone 與資料集的結果。 |
| 採用前提 | 人類訊號、候選指標與保留驗證集必須對應同一個任務和使用者群。 |

### 領域背景

使用者可能只留下按讚、評分或後續行為，沒有告訴開發者究竟喜歡哪個面向。手寫 rubric 容易漏掉真正相關的因素，大型 reward model 又需要更多資料。AutoMetrics 把少量昂貴的人類訊號當成學習目標，嘗試從候選指標中找出能預測這些訊號的組合。

### 中階導讀

**問題。** 當回饋只有分數而沒有解釋時，能否從一組便宜指標中學出較貼近使用者評價的自動評估器？

**方法與觀察。**

[Ryan 等人的 AutoMetrics](https://arxiv.org/abs/2512.17267)將流程分成產生、檢索、迴歸與報告。第一作者 Michael Ryan 也是本課授課者。候選來源有兩路：一邊生成單一條件、rubric 與範例型 LLM judge，一邊從收錄 48 個既有指標的 MetricBank 挑選相關項目。Metric Card 記錄每項指標的用途、實作與限制，讓檢索與後續審查有明確依據。

候選分數先標準化，再用偏最小平方法（PLS）迴歸擬合人類訊號。它先對較大的候選集合學權重，挑出較重要的指標後重新擬合，最後報告組合、權重與相關性。在標籤少、指標之間又高度相關的情境中，這種做法有用，也讓團隊能回頭檢查分數主要來自哪些判準。[完整論文第 3 節](https://arxiv.org/pdf/2512.17267v1.pdf)提供這些步驟，不能只把它理解為請 LLM 生一張 rubric。

五項任務的結果中，與人類評分的 Kendall correlation 相較 LLM-as-judge 最高相對改善 33.4%；這不是答對率增加同樣的百分點。所需回饋少於一百筆，研究也在特定系統優化實驗中比較代理獎勵與可驗證獎勵。表格按 backbone 與資料集列出不同表現，部署時仍要保留自己的人工驗證集。

### 深入要點

- **先找候選，再學權重。** 檢索 Metric Card 是降低評估成本的篩選步驟；迴歸才決定哪些指標組合與人類訊號相關，不能把檢索排名當成權重。

- **相關性之外還有敏感度與穩定性。** 論文另用品質下降與無關緊要的改寫檢查指標；只在既有標籤上排名正確，未必能抓到新的退化。

- **可解釋的係數仍有範圍。** 多個候選指標可能高度相關；PLS 能處理這種小樣本情境，卻不會讓某個權重自動成為使用者偏好的因果解釋。

### Reviewer 一句話評

值得試作的部分是把評估器也當成需驗證的學習系統；它能減少手工調權重，無法免除蒐集代表性使用者回饋。

### 給你的 take-away

把少量回饋分成擬合與保留兩批，先比較單一 judge 和組合指標在保留集的排序；再加入一組只改措辭、一組實際刪掉必要內容的答案，檢查評分是否分別保持穩定與下降。

## 讀物 4｜AutoLibra

原文：[AutoLibra](https://openreview.net/forum?id=4BjGVZ7Bxn)

### TL;DR

AutoLibra 將對軌跡的自然語言回饋轉成可重用的行為指標，並檢查它們與人類關切是否一致。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 最適合誰 | 已有文字軌跡與具體使用者回饋，卻缺少可重用行為指標的團隊。 |
| 先讀哪裡 | Feedback grounding 與 metric 定義，再讀 coverage／redundancy 的計算。 |
| 與 AutoMetrics 的差別 | 它先問評估哪些行為；AutoMetrics 著重指標組合如何對齊人類訊號。 |

### 領域背景

使用者通常更容易指出「按鈕已停用還一直點」或「你替我做了太多決定」，而非設計完整評分表。這類意見描述的是過程行為，容易被任務成功率蓋過。AutoLibra 從自然語言回饋歸納評估面向，讓原本分散在軌跡裡的觀察能跨案例累積。

### 中階導讀

**問題。** 如何把對某次執行的具體抱怨，變成下次也能判斷的行為標準，而不丟失使用者原意？

**方法與觀察。**

[AutoLibra 完整論文](https://arxiv.org/html/2505.02820v3) 把問題再往前推。任務成功率太粗：智慧體可能完成任務，過程卻反覆忽略限制；也可能前面都做對，只在最後一步失敗。系統先把使用者對完整 trajectory 的自然語言回饋，對回軌跡裡的具體行為。接著把相似的正負行為聚成帶定義與範例的 metric。新的軌跡交給 LLM judge 依各 metric 判 `+1`、`-1` 或 `N/A`，接著以 coverage 檢查回饋面向是否被涵蓋，並以 redundancy 檢查偵測到的 traits 有多少未被人類回饋提及；再比較不同指標集合的取捨。

這些指標也能回頭當改進目標。論文在協作、社交、網頁操作與文字遊戲環境裡，最佳 coverage 依資料集落在六成到近九成。用指標引導 prompt 迭代或篩選訓練軌跡，也在特定 benchmark 上提高成功率。不過研究只處理文字型 observation 與 action，多數新增標註來自作者而非多元終端使用者，抽取 metric 的模型偏誤也可能被固化。MT-Bench 與 AutoMetrics 問裁判準不準，AutoLibra 問的是更早的一題：使用者真正介意的行為，有沒有先被寫進考卷。

**結果怎麼讀。** 研究在文字型環境與有限標註者上進行；指標抽取仍會繼承模型與標註偏誤。

### 深入要點

- **Grounding 決定抱怨有沒有被讀對。** 「太自主」必須對回某個未確認的決策，才能形成可判定行為；抽象詞直接變指標會保留原來的歧義。

- **Redundancy 有特定定義。** 論文計算偵測到的 traits 中有多少未被人類回饋提及；它不只是兩個 metric 是否近義。高分可能反映無關判斷，也可能反映人類沒有寫出的行為，仍需複查。

- **回饋供應者會界定優化方向。** 研究多數新增資料由作者標註，且 observation／action 限於文字；歸納出來的使用者觀點不能自動代表不同職能或視覺介面的需求。

### Reviewer 一句話評

它比直接請模型列「好 agent 的十項標準」更有依據，但指標是否代表產品使用者，仍取決於回饋者與 grounding 品質。

### 給你的 take-away

收集一批包含實際軌跡的使用者抱怨，逐條標出對應動作與期待的替代行為；保留未參與歸納的回饋，檢查新指標能否涵蓋它，並人工複查模型額外判出的 traits。

## 怎麼做：交出一份會動的裁判分數

**怎麼做**：給自己的智慧體加一個裁判評測。從錯誤回報撿二十個真實任務，正確性用確定性檢查，語氣與完整度各寫一條自然語言斷言請模型判，每週跑一次抓迴歸。先用一組人類已判定的輸出校準裁判，交換 pairwise 答案順序測位置影響，再把裁判分數放進報告。

## 它在課程裡的位置

第 14 堂讓分數能判斷品質，[第 15 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-15-agent-safety)接著回答另一個問題：評分過關的智慧體，實際上線為什麼還會出事。HW2 要求至少一個 LLM-as-judge，本堂的校準步驟可以直接套用。

## 本堂 Course Material 對照

- 官方投影片：尚未公開（截至 2026-10-29）
- 指定閱讀：Grace 等人〈Demystifying Evals for AI Agents〉（本文深讀）、Zheng 等人〈Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena〉（本文深讀）、Ryan 等人〈AutoMetrics〉（本文深讀）
- 延伸閱讀：Zhu 等人〈AutoLibra〉（本文深讀）
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

官方 Logistics 頁（2026-10-10 即時讀取）的 Lecture Recordings 一節寫明：講課錄影只能登入課程 Canvas 取得。我實際開啟課程 Canvas 入口（canvas.stanford.edu/courses/233286），被導向 Stanford 登入頁，確認有登入牆。課程官網與搜尋都沒有找到公開的 YouTube 或 OCW 錄影，所以沒有可嵌入的影片。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 14（11/9 週一）的內容，原屬「第 8 週：請模型當裁判，再幫 agent 上護欄」導讀；以下保留拆分前的紀錄。
- 2026-10-23：逐篇補齊十份讀物的背景、獨立編輯判斷與實作練習；依完整論文釐清 AutoMetrics 流程及 AutoLibra redundancy 定義。
- 2026-10-23：依第一堂模板重整材料狀態、機制、情境與理解檢查；將指定閱讀深讀與課堂預習分開。
- 2026-10-23：將既有教學內容補成圖解與必要對照表；本次未重新查證數據、課表或研究結果。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-12：補上 AutoLibra、CDI、prompt injection 與 RSP 四篇延伸閱讀的實質導讀，並標明 RSP 的歷史版本邊界。
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 13 堂：Evaluation Fundamentals & Benchmark Design](/posts/ai/2026-09-10-stanford-cs329z-lecture-13-eval-benchmarks)、[第 15 堂：Agent Safety & Guardrails](/posts/ai/2026-09-10-stanford-cs329z-lecture-15-agent-safety)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Grace et al., Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)、[Zheng et al., Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena, NeurIPS 2023](https://arxiv.org/abs/2306.05685)、[Ryan et al., AutoMetrics](https://arxiv.org/abs/2512.17267)、[Zhu et al., AutoLibra](https://openreview.net/forum?id=4BjGVZ7Bxn)
