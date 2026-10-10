---
title: "CMU 11-768 導讀 A2：替資料視覺化 agent 寫評分器——四類錯誤、MCC 與 Harbor 驗證器"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, evaluation, llm-as-a-judge, benchmark]
lang: zh-TW
series:
  name: "CMU 11-768 AI Agents 導讀"
  order: 14
tldr: "11-768 的 Assignment 2 要學生只用一個固定的 Qwen3-VL-30B-A3B 當裁判，替資料視覺化 agent 的每一次執行判四類錯誤，並用四類 MCC 的平均在私有測試集上評分（占作業 30%）；後半還要把自己出的題包成 Harbor 任務，寫一個被驗證器擋下、一個騙過驗證器的錯誤解。它的主題是：評分器就是之後 RL 的 reward。"
description: "導讀 CMU 11-768 Assignment 2（Eval，10/1 截止）：資料視覺化 agent 的四類錯誤定義、以 MCC 計分的理由、固定弱裁判與無參考答案的限制、四個 Part 的要求、Harbor 確定性驗證器的五層檢查與 mutant 設計，以及它如何回扣 L9／L10／L11 的 reward 設計。只講要求與取捨，不給解答。"
draft: false
glossary:
  - term: "MCC"
    aliases: ["Matthews correlation coefficient", "馬修斯相關係數"]
    definition: "二元分類的評分指標，同時用到真陽、真陰、偽陽、偽陰四格；1 是完全正確、0 等於沒有相關、負值是反向相關。類別很不平衡時比準確率可靠。"
    context: "A2 對四類錯誤各算一次 MCC，再取平均當 macro-MCC。"
  - term: "mutant"
    aliases: ["突變解", "錯誤解"]
    definition: "刻意做錯、但看起來像正確答案的解法，用來測驗證器能不能分辨對錯。"
    context: "A2 要學生替自己的 Harbor 任務寫兩個 mutant：一個被擋下、一個騙過驗證器。"
  - term: "Harbor"
    definition: "把評測任務包成自帶沙箱與驗證器的目錄格式的 agent 評測框架，任何 agent 都能用同一個指令跑。"
    context: "A2 Part 3 要求把學生自己出的視覺化任務包成 Harbor 任務。"
---

> 🌏 [English version](/en/posts/ai/2026-09-29-cmu-11768-assignment-2-eval-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) 的三份個人作業剛好是一條線：[A1](/posts/ai/2026-09-29-cmu-11768-assignment-1-harness) 蓋 harness、A2 做評測、A3 做訓練。[Assignment 2](https://github.com/cmu-agents/assignment-2) 占學期成績 15%，10 月 1 日截止，官網的一句話摘要是「設計量測 agent 正確性與功能所需的評測框架」。作業由 Andy Liu、Jiarui Liu、Yueqi Song 設計，GPU 用的是課程提供的 Modal 額度。

這篇只講作業要什麼、架構長怎樣、怎麼計分、設計上有哪些取捨，**不給解答**。課表上沒有一堂專門講評測的課，評測設計只出現在這份作業裡，所以本篇最後會把它接回 L9 到 L11：你在 A2 寫的評分器，就是 A3 之後 RL 要最大化的 reward。

## 課程影片來源

本篇是作業導讀，附官方課程入口；尚未核對到這份作業的專屬錄影。課程已有部分公開講課影片，但不能直接視為這份作業的影片。

官方來源：

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

查核日期：2026-10-10。

## 作業在評什麼：資料視覺化 agent

受測對象是**資料視覺化 agent**：拿到資料檔和使用者的圖表規格，自己寫 matplotlib 程式、執行、存出 `figure.png`。學生要寫的是**評分器（validator）**：給定任務、agent 的完整軌跡、輸入資料與最後的圖，判斷這次執行有沒有錯，錯在哪一類。

作業說明 `ASSIGNMENT.md` 的 Overview 講了為什麼選這個題目：agent 系統複雜、任務時間長，評測比傳統 LLM 評測多了很多麻煩，要親手做一次才知道難在哪。資料視覺化的好處是對錯大多看得見，壞處是「看得見」要靠一個視覺模型去看。

## 四類錯誤

每次執行的輸出是一串錯誤，每個錯誤屬於四類之一，並附上扎根於該次執行的具體證據。空串代表可接受。

| 類別 | 意思 | 典型例子 |
|---|---|---|
| `execution_failure` | 最後沒有產出有效的圖 | 崩潰、步數用完、放棄 |
| `wrong_data` | 畫出來的資料不是要求的資料 | 聚合錯、少一組序列、篩選錯欄位、排序不對 |
| `wrong_chart` | 資料對，但沒照要求的圖表設計 | 圖型錯、子圖排列錯、軸標籤或範圍錯、圖例缺、線型或色盤錯 |
| `hard_to_read` | 照要求畫了，但讀不了或很難讀 | 文字被裁切或重疊、圖例蓋住資料、對比太低、兩組序列分不出來 |

幾條邊界規則值得先記住，它們決定了評分器要怎麼切：

- **`execution_failure` 是終止類別。** 標準答案標了它，就不再算另外三類，因為沒有圖就無從判斷。反過來，評分器預測了它，並不會讓這次執行在其他三類免評。
- **同一個瑕疵的程度決定歸類。** 標題被裁掉一半是 `hard_to_read`；標題整個跑到圖外面，等於缺了標題，算 `wrong_chart`。
- **圖例蓋在空白處沒問題**，蓋到資料才算 `hard_to_read`。對比度的門檻大約是 2.5:1。

作業附的 110 筆 seed 執行裡，只有 16 筆完全沒錯；有 `wrong_chart` 的 71 筆、`hard_to_read` 39 筆、`wrong_data` 25 筆、`execution_failure` 12 筆（依 `seed_labels.json` 統計，一筆可以同時有多類；`execution_failure` 那 12 筆都是單獨出現）。

## 為什麼用 MCC，不用準確率

每一類各自當成二元分類：標準答案有這類就是正例，評分器的錯誤清單有點名這類就是預測正例。四格計數算出 [Matthews correlation coefficient](https://en.wikipedia.org/wiki/Phi_coefficient)：

$$
\mathrm{MCC}=\frac{TP\cdot TN-FP\cdot FN}{\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}}
$$

總分 `macro_mcc` 是四類 MCC 的簡單平均，分母固定是 4。

看上面的 seed 分布就知道為什麼不用準確率。標準答案是 `execution_failure` 的 12 筆不計入另外三類，所以 `wrong_chart` 是在剩下的 98 筆上算，其中 71 筆是正例，一個永遠說「有 `wrong_chart`」的評分器準確率就有七成多（71/98）；`execution_failure` 在 110 筆裡只有 12 筆，永遠說「沒有」的準確率接近九成（98/110）。MCC 對這兩種常數預測都給 0，想拿分就得真的分辨。

作業也把小樣本的陷阱寫出來了：自己出的題目很少時，某一類可能完全沒出現、或每一筆都有，這時 MCC 無從計算，評分腳本會回報 0 並標註樣本不足，這種分數要保守解讀。私有測試集保證每一類兩種情況都有。另外 MCC 只量分類，錯誤說明裡的證據品質另外評。

## 三個刻意的限制

作業的難度主要來自三個限制，每一個都對應真實世界評測會碰到的處境：

1. **裁判模型固定而且不強。** 評分器只能呼叫 `Qwen/Qwen3-VL-30B-A3B-Instruct-FP8`，不能換、也不能再呼叫別的模型，評分時也用同一個模型的部署。作業明講：評分器要設計成能泛化，而不是靠一個很強的裁判。
2. **沒有參考答案。** 評分時一次只看一筆執行，拿不到標準標籤、參考圖或同一題其他人的執行，只有任務、輸入、軌跡和圖。
3. **私有測試集會出現沒看過的圖型。** 作業提醒不要設計成過擬合公開範例，也不能把公開任務 ID 或標籤寫死。

第一個限制還帶出工程問題：軌跡可能比 context 長。官方 baseline 的做法是先送完整證據，如果超出 context 被拒，就重試一次：用伺服器的 tokenizer，把 context 的 50% 分給文字與回應，保留軌跡和輸入檔的開頭與結尾，任務和圖保持完整。壓縮後還是塞不下怎麼辦，兩份一手材料說法不一致：`ASSIGNMENT.md` 寫的是沒有逐步縮小的重試迴圈、錯誤會直接拋出；但同一版 repo（commit `f609e76`）的 `validator/baseline.py` 實際會把圖片最長邊每次縮成 0.7 倍重試，縮到 64 像素才放棄。以程式碼為準的話是後者。作業特別說這只是 baseline 的做法，壓縮可能丟掉關鍵證據，context 怎麼管由學生決定。

## 作業架構

學生只需要改 `validator/solution.py`，實作 `validate(run)`，函式簽名和輸出格式（`validator/prediction.py`）不能動。骨架拆成三個函式：`judge_execution`、`judge_data_and_chart`、`judge_readability`。官方 baseline（`validator/baseline.py`）的做法是對每一類問裁判一個 YES/NO 問題，並把任務、軌跡、輸入與圖一起送進去；先判 `execution_failure`，成立就直接回傳。

其他目錄：

- `artifacts/<run_id>/`：110 筆 seed 執行，每筆有 `result.json`（任務、完整軌跡、結果）和 `figure.png`（有產出的話）。`run_id` 是唯一鍵，同一個 `task_id` 可能對應多筆。
- `workflow/`：驗證任務格式、產生執行、初始化標籤、計分、打包 Harbor、檢查繳交內容的指令。
- `infrastructure/`、`scripts/`：在 Modal 上部署裁判模型、三個受測 agent 模型與 agent runner。
- `harbor/`：Harbor 範例、任務模板、preflight 檢查與疑難排解。

受測 agent 有三個，也是固定的：`Qwen/Qwen2.5-Coder-3B-Instruct`、`mistralai/Ministral-3-14B-Instruct-2512`、`zai-org/GLM-4.7-Flash`。每次執行最多 20 步、每個 shell 指令 120 秒、總時間 15 分鐘。

## 四個 Part 要做什麼

| Part | 要做的事 | 報告要交代的 |
|---|---|---|
| 1 檢查 seed 執行 | 跑 baseline、對照人工標籤 | 四類 MCC 與 macro-MCC；兩種常見錯誤，各至少出現在兩筆軌跡（附 run ID），說明可觀察的證據與改法 |
| 2 改進評分器 | 實作 Part 1 提出的兩個改動 | 新的四類 MCC 與 macro-MCC、跟 baseline 比；至少一個偽陽、一個偽陰的成因分析 |
| 3 設計新任務 | 找出評分器可能無法泛化的兩類任務，出 5 題以上（每類至少 2 題），三個 agent 各跑一次（至少 15 筆），人工標註；再把每題包成 Harbor 任務 | 自出題上的 MCC；哪些失敗是 agent 的弱點、哪些是評分器的弱點；兩個 mutant 的 reward 與原因 |
| 4 再迭代 | 至少再改一次評分器，在 seed 與自出題上都重跑 | 新 MCC；至少一個偽陽、一個偽陰（附軌跡原文與假設）；所有額外改動的動機與成效 |

Part 1 和 Part 3 代表兩種找評分器弱點的方法：一種是讀真實軌跡、從錯誤裡歸納；一種是主動出分布外的題目壓力測試。作業要求兩種都做。

### Part 3 的 Harbor 打包

[Harbor](https://github.com/harbor-framework/harbor) 把評測任務定義成自帶沙箱與驗證條件的目錄，任何 agent 都能跑；作業形容它隨 Terminal-Bench 2.0 流行，已經成為 agent benchmark 的業界標準。Harbor 要的是**確定性的驗證器**，不是模型裁判，所以打包時每題都要額外要求 agent 寫出 `plot.py` 和 `plotted_values.json`，但不准改題目本身的內容，產生執行之後也不能再改題目文字。

官方範例（`harbor/example/`）是一題虛構果園的產量長條圖，驗證器分五層，從便宜到昂貴：

| 層 | 做法 | 擋下的錯誤 |
|---|---|---|
| S1 | 檔案存在、是非空白 PNG、輸入 CSV 沒被改、程式有留下來 | 完全失敗 |
| S2 | 在乾淨的工作區重跑 `plot.py`，攔截 `savefig`，對 matplotlib 物件樹斷言長條高度、刻度標籤、y 軸範圍 | `sum_crates`（加總錯欄位），以及其他聚合、順序、標籤錯誤 |
| S3 | 比對交出來的 PNG 是否就是重跑產生的那張 | `forgery`（程式是對的，圖卻是別的資料畫的）；只有 S3 擋得住 |
| S4 | 改動輸入 CSV 再跑一次，要求畫出的數字跟著變 | `hardcoded`（手打正確答案，從沒讀檔）；只有 S4 擋得住 |
| S5 | 比對 agent 自己申報的 `plotted_values.json` 與答案、與實際畫出的圖 | 申報與圖不一致 |

第四個範例 `illegible` 是這一節的重點：數字全對、標籤全對，但畫在 3×2.2 英寸的畫布上、字只有 2pt，標題、兩個軸標籤和四個果園名稱都不到三個像素高。十五條斷言全過，reward 1.0。物件樹斷言量的是資料和結構，量不到畫出來之後讀不讀得了。

作業要學生在自己的任務上複製這個發現：所有任務的參考解都要拿到 1.0，另外寫兩個 mutant，一個被自己的斷言擋下（reward 0）、一個是真的錯卻騙過驗證器（reward 1.0）。報告要寫出每個 mutant 錯在哪、被哪條斷言抓到，或為什麼沒有任何斷言抓得到。作業原文說得很直接：第二個 mutant 才是這部分的重點，它讓你**量出**確定性驗證器的邊界，而那個邊界正是 VLM 評分器要跨過去的地方。

## 計分方式

| 比重 | 項目 |
|---:|---|
| 40% | 報告與設計理由 |
| 30% | 評分器在私有測試集上的 macro-MCC |
| 20% | 小考／理解程度檢查 |
| 10% | 程式品質與可重現性 |

繳交內容包括 `validator/solution.py`、所有預測輸出、自出題與輸入、三個 agent 的執行、`labels.json`、Harbor 任務與兩個 mutant、報告的 PDF 與 LaTeX 原始檔，以及 `AI_USAGE.md`（申報用了哪些 AI 工具，不計分，但會用小考檢查你懂不懂自己交的程式）。繳交前要跑 `workflow check-submission`，它會檢查結構，並實際跑 Harbor 確認參考解 1.0、一個 mutant 0、一個 mutant 1.0。它不檢查標籤是否正確、報告寫得好不好，那些要人看。

報告占 40%、私有集分數占 30%，比重本身就是訊號：這份作業更在意你能不能說清楚評分器為什麼這樣設計、在哪裡會錯，而不只是分數。

## 設計上的取捨

以下是讀完作業說明後，我認為動手前值得先想清楚的幾個問題。它們沒有標準答案，作業也沒有規定。

- **一次問一類，還是一次問全部？** baseline 對每一類各問一次。分開問比較好控制每一類的判準，代價是呼叫次數和 context 成本乘上四，而且各類之間的邊界規則（裁切一半 vs 整個出界）要靠你自己串起來。
- **證據從哪裡來？** 軌跡、輸入檔、圖三種證據能回答的問題不一樣。`prediction.py` 開頭的註解把四類錯誤對應到證據所在的地方：軌跡、圖記錄的數字、圖記錄的結構、渲染出來的影像。哪一類該主要看哪一種證據，是設計的核心。
- **偏向多報還是少報？** MCC 對偽陽和偽陰是對稱的，但各類的正例比例差很多，同一個判斷門檻在 `wrong_chart` 和 `execution_failure` 上的後果不同。
- **弱裁判能信到什麼程度？** 裁判固定是 30B 級的 MoE 視覺模型。哪些判斷可以交給它，哪些判斷用它不如直接讀軌跡裡的程式與錯誤訊息，要靠 Part 1 的錯誤分析去找。
- **確定性驗證和模型裁判各管哪一段？** Harbor 那部分讓你親手看到：資料對不對可以用程式斷言抓得很準，讀不讀得了幾乎只能靠看圖。兩者不是二選一。

## 評測就是之後的 reward：回扣 L9／L10／L11

課表沒有一堂叫 Evaluation 的課，但前後三講都在講同一件事的不同面向。

**[L9（RL Basics）](/posts/ai/2026-09-29-cmu-11768-lecture-09-rl-basics)**：RL 的目標是最大化期望 reward。L9 的玩具例子「猜數字」reward 很乾淨，猜中是 1、沒中是 0；expert iteration 則是用 reward 過濾軌跡，只拿高分軌跡做 SFT。這兩件事都預設你手上有一個可信的評分函式。A2 讓你親手做一次這個函式，才知道它不會自己變出來。

**[L10（Deep Research Agents）](/posts/ai/2026-09-29-cmu-11768-lecture-10-deep-research-agents)**：Akari Asai 那講的評測段落幾乎是 A2 的預告：正確答案不只一種、跟參考答案像不代表對、LM 裁判要先量過跟專家的一致率（投影片上 Expert–LM 79%、Expert–expert 80%）、rubric 本身也要稽核。建模段落的 DR Tulu 則示範下一步：評分器寫得夠好，就直接拿來當 RL 的 reward，reward 品質直接決定模型學到多少：投影片比較了隨機 reward、只用初始 rubric、演化式 rubric 三條 RL 曲線，[論文](https://arxiv.org/abs/2511.19399)的消融寫的是拿掉演化式 rubric 平均最多掉 2 分，兩者都勝過隨機 reward。

**[L11（Advanced RL Algorithms）](/posts/ai/2026-09-29-cmu-11768-lecture-11-advanced-rl)**：L11 的投影片把驗證器的兩種錯誤攤開來講。偽陰是把正確解判錯，後果是 reward 雜訊與 benchmark 提早飽和。投影片舉 SWE-bench Verified 停在約 81%，出處是 OpenAI 2026 年 2 月的[稽核文章](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)：半年內最佳成績只從 74.9% 升到 80.9%；抽查 138 題 o3 在 64 次執行中沒能穩定解出的題目，59.4% 有測試設計或題目描述的實質問題，會把功能正確的解判錯。那篇文章也把訓練資料污染列為另一個主因，投影片只取了測試有瑕疵這一半。偽陽是把錯誤解判對，後果是 reward hacking。投影片的例子是自己構造的小題：函式 `retry_count` 有四種輸入要處理，訓練驗證器只測 `retries=0` 一種，「永遠回傳 0」的解就拿到 reward 1，實際上四種情況只對一種。A2 的 Harbor 部分兩種錯誤都碰得到。`hardcoded` 和 `illegible` 都屬於偽陽：前者要到 S4 才擋得下，其他四層都會放過；後者整套確定性驗證器都放過。偽陰則藏在斷言寫得太嚴的地方，範例 README 提醒，題目沒要求的條件寫進斷言，就是在設陷阱，不是在測試。L11 給的對策是用獨立的檢查確認進步是真的，A2 的私有測試集就扮演這個角色。

換句話說，A2 的 macro-MCC 量的是你的評分器當 reward 時會有多少雜訊。A3 要訓練 agent，到時候你會很慶幸現在把偽陽、偽陰都追過一遍。

## 今晚可以動手的事

- **先跑 baseline 並計分。** 照 README 部署裁判模型，跑 `validator.runner --solution validator.baseline`，再用 `workflow score` 對 `seed_labels.json` 計分，記下四類 MCC。這是 Part 1 的第一步，也是之後每次改動的對照組。
- **挑五筆 baseline 判錯的執行，逐筆讀軌跡。** 每筆寫一行：人工標了什麼、評分器說了什麼、證據其實在軌跡、數字、結構還是影像裡。五行寫完，Part 1 要的「兩種常見錯誤」通常就浮出來了。
- **跑一次 Harbor 範例的 `illegible` mutant。** 照 `harbor/example/README.md` 把它換進去跑，打開 `pytest.log` 看十五條斷言怎麼全部通過。親眼看過一次，比讀任何說明都更清楚確定性驗證器的邊界在哪。

## 延伸閱讀

系列總覽見 [CMU 11-768 AI Agents 導讀：課程總覽](/posts/ai/2026-09-29-cmu-11768-course-overview)。

- [Stanford CS329Z 導讀 Week 7：分數別騙自己，資料再做大——期中驗收週](/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks)
- [Stanford CS329Z 導讀 Week 8：請模型當裁判，再幫 agent 上護欄](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety)
- [調整 agent 之後，怎麼嚴謹比較前後差異：從 golden set 到統計檢定](/posts/ai/2026-06-04-agent-change-rigorous-evaluation)
- [Self-Reflection + LLM-as-Judge：讓 AI 評估自己的回答](/posts/ai/2026-03-12-self-reflection-llm-as-judge)
- [CS336 Lecture 16：RLVR 用可驗證獎勵擴大推理，但 GRPO 不是免費的 PPO](/posts/ai/2026-08-22-cs336-rlvr)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CMU 11-768 AI Agents 課程官網](https://www.cmu-agents.com/)
- [cmu-agents/assignment-2（作業 repo，含 ASSIGNMENT.md）](https://github.com/cmu-agents/assignment-2)
- [Harbor（harbor-framework/harbor）](https://github.com/harbor-framework/harbor)
- [Lecture 9 投影片：RL Basics](https://www.cmu-agents.com/slides/lecture-09-rl-basics.pdf)
- [Lecture 10 投影片：Deep Research Agents](https://www.cmu-agents.com/slides/lecture-10-deep-research-agents.pdf)
- [Lecture 11 投影片：Advanced RL Algorithms](https://www.cmu-agents.com/slides/lecture-11-rl-advanced.pdf)
- [Why SWE-bench Verified no longer measures frontier coding capabilities（OpenAI，2026-02）](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)
- [DR Tulu: Reinforcement Learning with Evolving Rubrics for Deep Research（arXiv:2511.19399）](https://arxiv.org/abs/2511.19399)
- [Phi coefficient／Matthews correlation coefficient（Wikipedia）](https://en.wikipedia.org/wiki/Phi_coefficient)
