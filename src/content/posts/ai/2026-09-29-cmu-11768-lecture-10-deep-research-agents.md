---
title: "CMU 11-768 導讀 L10：Deep Research Agent 怎麼評、怎麼訓、怎麼檢索"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, deep-research, evaluation, reinforcement-learning]
lang: zh-TW
series:
  name: "CMU 11-768 AI Agents 導讀"
  order: 11
tldr: "Akari Asai 的 L10 把 deep research agent 拆成三塊：評測要補齊搜尋難度、領域專業、長答案品質與引用支持四個缺口；訓練走 mid-training → SFT → RL，長答案用 DR Tulu 的演化式 rubric 當 reward；檢索要讓 retriever 看到 agent 的推理，AgentIR-4B 在 BrowseComp-Plus 搭 Tongyi-DR 拿到 68%。"
description: "帶讀 CMU 11-768 第 10 講 Deep Research Agents（講者 Akari Asai）：從 BrowseComp、ScholarQABench 到 DeepResearch Bench 的評測演進，Tongyi DeepResearch 的 mid-training／SFT／RL 訓練流程，DR Tulu 的演化式 rubric reward，以及 AgentIR 的推理感知檢索。本篇依投影片撰寫。"
draft: false
glossary:
  - term: "GRPO"
    aliases: ["Group Relative Policy Optimization"]
    definition: "同一題取樣一組回答，用組內平均當基準：比平均好的回答提高機率，比平均差的降低機率，不需要另外訓練 value model。"
    context: "本講用它說明 Search-R1、DR Tulu 這類搜尋 agent 怎麼從自己的嘗試學習。"
  - term: "RLER"
    aliases: ["Reinforcement Learning with Evolving Rubrics", "演化式 rubric"]
    definition: "DR Tulu 提出的訓練法：評分用的 rubric 不是固定的，而是在訓練中根據模型新搜到的資訊與好壞回答的對比持續新增、汰換。"
    context: "本講用它回答「長篇研究報告沒有標準答案時，RL 的 reward 從哪來」。"
  - term: "hard negative"
    aliases: ["困難負例"]
    definition: "跟查詢很像、看起來相關，但其實缺了關鍵資訊的文件；用來逼檢索器或 agent 分辨「像」和「對」。"
    context: "BrowseComp-Plus 在固定語料裡刻意放進這類文件。"
---

> 🌏 [English version](/en/posts/ai/2026-09-29-cmu-11768-lecture-10-deep-research-agents-en)

> **本篇依投影片撰寫，影片上架後補充。** 截至 2026-09-29，[CMU 11-768](https://www.cmu-agents.com/) 第 10 講只公開了 [124 頁投影片](https://www.cmu-agents.com/slides/lecture-10-deep-research-agents.pdf)，沒有錄影。下文所有數字與例子都出自投影片或投影片引用的論文。被引用來支撐內容的論文，我都打開全文對過相關段落：投影片與論文說法不同時兩者都寫出來，只在投影片出現、論文裡找不到的標為「投影片所述」。講者課堂上怎麼口頭補充，要等影片出來才知道，這裡不代為揣測。

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) 是 Daniel Fried 與 Graham Neubig 在 2026 秋季開的 agent 課，Domains 模組依序講 coding agent、computer use agent，第三個領域就是 deep research。第 10 講（9/24）由 [Akari Asai](https://akariasai.github.io/) 客座主講，她是 [OpenScholar](https://arxiv.org/abs/2411.14199)（arXiv:2411.14199，Nature 2026）的第一作者、[DR Tulu](https://arxiv.org/abs/2511.19399)（arXiv:2511.19399，ICML 2026）的共同第一作者，所以這一講有一半是在講她自己怎麼做這件事。

Deep research agent 指的是：接到一個需要多次搜尋、跨多份文件綜合的研究問題，自己規劃、搜尋、反思、再搜尋，最後交出一份附引用的長答案。投影片把一堂課切成三塊——**評測**（benchmark、rubric、引用支持）、**建模**（怎麼學會搜尋與綜合）、**檢索**（怎麼替 agent 的下一步找到證據）。這篇照同樣的順序走。

## 課程影片來源

課程官方課表位於 SPA 的 #/schedule；本次 Groundlane 與 Exa 未取得完整課表，未重新核實本文的直接影片來源。請由官方課表查看該講錄影是否已上架。

課程與錄影入口：

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

## 一次搜尋和很多次搜尋差在哪

開場用兩個問題對比。「Akari Asai 在 CMU 的辦公室是幾號？」搜一次教職員頁面就有答案。「AI agent 綜合科學文獻的能力能不能跟人類專家一樣好？」就不一樣了，投影片把 agent 處理這題的過程拆成四步：

1. **Plan**：先分清楚「benchmark 分數很高」和「直接跟人類專家比過」是兩件事，列出要找文獻綜合研究、看專家和 agent 怎麼比、比對任務範圍三個步驟。
2. **Search**：搜到兩類結果，一類是跟其他 AI 系統比分數的 benchmark，一類是拿 agent 答案跟人寫答案比的專家評估。
3. **Reflect**：發現兩類研究比的東西不同，benchmark 分數高並不能回答「跟專家比如何」，於是改問「測了哪些任務和領域」，再搜一次。
4. **Final answer**：「在測過的任務上有潛力，但全面與專家同等尚未證實」，並分別引用 OpenScholar 與 DR Tulu。

這個例子的重點在第三步。deep research 難的地方不是搜很多次，是**搜到之後判斷證據能不能支撐結論**，然後把結論的範圍收窄到證據撐得住的地方。後面整堂課的評測設計，都在想辦法量這件事。

## 評測：從 QA 到 deep research benchmark 的四個缺口

投影片拿 [Natural Questions](https://ai.google.com/research/NaturalQuestions/databrowser) 的一題當反例：「誰替《原力覺醒》寫配樂？」答案 John Williams，一篇維基百科就找得到。這種經典 QA benchmark 有四個缺口，整節就是一個一個補：

| 缺口 | 經典 QA 的問題 | 投影片給的補法 |
|---|---|---|
| 搜尋複雜度 | 一次搜尋或靠記憶就能答 | [BrowseComp](https://arxiv.org/abs/2504.12516)、[BrowseComp-Plus](https://arxiv.org/abs/2508.06600) |
| 領域專業 | 一般網路問題測不到專業知識 | [MedBrowseComp](https://arxiv.org/abs/2505.14963)、[FinSearchComp](https://arxiv.org/abs/2509.13160) |
| 答案品質 | 短答案比對，量不到多文件綜合 | [ScholarQABench](https://arxiv.org/abs/2411.14199)、[ResearchQA](https://arxiv.org/abs/2509.00496) |
| 證據支持 | 答對不代表證據用得對 | [DeepResearch Bench](https://arxiv.org/abs/2506.11763) |

### 搜尋複雜度：BrowseComp 把問題反著出

[BrowseComp](https://arxiv.org/abs/2504.12516)（arXiv:2504.12516）有 1,266 題，全部人寫。出題流程是反著來的：先選一個已知的人、事件或作品當答案，把名字藏起來，再用好幾條事實線索組出一個複雜問題。驗證難度有兩道關：模型加搜尋要答不出來、搜五次 Google 不夠；人類花 10 分鐘還是難。論文註明 10 分鐘這條沒有嚴格執行，只抽一部分題目請另一位出題者試解。

投影片舉的例子是找一個虛構角色：題目給了五條線索，分別關於角色的敘事手法、背景故事、個性，以及他的電視節目在哪個年代播出、總共幾集。每條線索單獨搜都有一大堆候選，要交叉才能收斂。（BrowseComp 論文請讀者不要用明文轉貼範例題，以免題目流進訓練資料、汙染 benchmark，所以這裡只描述題目的結構，不列原題和答案。）

投影片列的成績（模型五列與 BrowseComp 論文 Table 3 相同）：

| 系統 | 準確率 |
|---|---|
| GPT-4o | 0.6% |
| GPT-4o + browsing | 1.9% |
| GPT-4.5 | 0.9% |
| OpenAI o1 (medium) | 9.9% |
| Deep Research（有針對這類任務訓練） | 51.5% |
| 人類與參考答案相符（投影片換算） | 25.3% |

人類那一列論文不是這樣報的。論文的數字是：出題者互相試解 1,255 題，解出 29.2%，其餘 70.8% 在搜了兩小時後放棄；解出的題目裡有 86.4% 跟參考答案一致。投影片的 25.3% 是把兩者相乘（317／1,255）。

光給瀏覽功能幾乎沒用，要專門訓練過搜尋行為才拉得上去。投影片接著引 [Tongyi DeepResearch](https://arxiv.org/abs/2510.24701)（arXiv:2510.24701）報告 Figure 10(a) 的曲線：context 長度從 8K 放到 128K，BrowseComp 準確率從接近 0 一路升到四成多（數值是圖上讀數）。報告另外寫到，SFT 資料裡超過 20% 的樣本長度超過 32K token、工具呼叫超過 10 次；評測時每題最多呼叫 128 次工具。**給 agent 更多搜尋空間，準確率就跟著漲**。

BrowseComp 的問題在於它跑在即時網路上，搜尋 API 會變、網頁會變，兩個系統的分數很難公平比較。[BrowseComp-Plus](https://arxiv.org/abs/2508.06600)（arXiv:2508.06600）把語料凍結：拿 BrowseComp 的題目與答案，用 o3 找證據頁，再由人標出支持每條線索的段落與答案文件，最後補進 hard negative。投影片把 hard negative 描述成「相關但缺了某條線索」的頁面；論文的實際做法是讓 GPT-4o 把每題拆成約七個子查詢，各自丟 Google 搜尋，搜回來的結果當干擾文件。原本 1,266 題裡有 830 題通過人工驗證，最後的固定語料是 830 題、100,195 份文件。語料固定之後，才能單獨比較 retriever 的貢獻，這點在最後一節會用到。

### 領域專業：讓專家出題

一般網路問題測不到專業判斷。[FinSearchComp](https://arxiv.org/abs/2509.13160)（arXiv:2509.13160；投影片標註 ICLR 2026）由金融專家從工作情境或財報表格出題，用多個來源交叉核對答案，再請一到兩位其他專家在看不到答案的情況下獨立作答；結果不一致時由資深專家裁決。例題是「Johnson & Johnson 2022–2024 年國際營收占比每年怎麼變」。同類還有醫療的 [MedBrowseComp](https://arxiv.org/abs/2505.14963)（串接臨床試驗、藥物、法規事實）、學術搜尋的 [ScholarSearch](https://arxiv.org/abs/2506.13784) 與 [AutoResearchBench](https://arxiv.org/abs/2604.25256)（找一篇論文，或找出所有符合條件的論文）。

### 答案品質：相似度指標不夠，改用 rubric

長答案評測的難處，投影片用開場那題示範。參考答案寫「一項研究中專家偏好 OpenScholar，跨領域同等尚未證實」。另一個寫法「一項研究支持 OpenScholar，但無法證明跨領域同等」同樣正確。第三個寫法「……跨領域同等**已經**證實」跟參考答案字面幾乎一樣，意思卻錯了。**正確答案不只一個，跟參考答案像也不代表對。**

實證也是這樣。投影片引 [A Critical Evaluation of Evaluations for Long-form Question Answering](https://aclanthology.org/2023.acl-long.181/)（ACL 2023）：在 109 組有參考答案的專家比較中，拿相似度指標挑「專家比較喜歡的那個答案」，ROUGE 只對 58%、BERTScore 57%、BLEURT 62%，隨機猜是 50%。同一張表還有一個更難看的對照：在同一批專家比較（含沒有參考答案的領域，共 129 組）上，直接挑比較長的那個答案就有 68%，比三個指標都高。

替代做法是 rubric。[OpenScholar 論文](https://arxiv.org/abs/2411.14199)提出的 ScholarQABench 裡，Scholar-CS 子集（100 題）請博士級專家替每題列出好答案該有的要素，分成 must-have 與 nice-to-have；評分時由 GPT-4o 逐項判斷，這部分占總分 60%，另外 40% 看長度、專業度、引用與摘錄等通用項目。投影片把它簡化成帶權重的兩項示範：「有報告跟人類專家的直接比較」（權重 2）、「有依任務與領域限定結論」（權重 1）。候選答案寫「OpenScholar 在 70% 的專家比較中勝出，而且所有領域都成立」，第一項過、第二項沒過，分數是 (2×1 + 1×0) / 3 = 0.67。Nature 版論文測了「某條 rubric 有沒有被滿足」這個判斷的一致率：用兩個系統的輸出、兩位專家，專家之間是 0.80，專家與 LLM 裁判是 0.79。投影片另外標註是 12 題、每個答案 2 位專家，題數論文正文沒寫，這裡依投影片。

rubric 要專家寫，規模上不去。[ResearchQA](https://arxiv.org/abs/2509.00496)（arXiv:2509.00496；投影片標註 TACL 2026）改從綜述論文挖題目，再用 LM 產生 rubric，做到 75 個領域、2.1 萬題、16 萬條 rubric 項目。代價是 rubric 本身可能錯。專家稽核時，一條 rubric 只要有下列任一問題就算無效：難以判斷、不清楚、空泛（例如只是把問題換句話說）、含錯誤（例如引用一篇不存在的論文）。三種 rubric 裡，模型只憑自身知識生成的（parametric）rubric 無效比例最高，是 15%；論文最後採用的是把綜述內容和模型知識合併的 hybrid rubric。投影片另外補了一條：寫得太模糊的項目，會讓看似合理的錯誤也過關。投影片的結論是**先評 rubric，再拿 rubric 評答案**：評分項目要扎根在來源上，並稽核它的相關性和可驗證性。[DeepResearch Bench II](https://arxiv.org/abs/2601.08536) 就是這樣做的：從專家寫的調查報導抽出評分項目，經過 LLM 抽取、LLM 自我檢查、人工修訂、領域專家審閱四道工序，做出 132 題、9,430 條是非題式的 rubric。

### 證據支持：逐條檢查引用

答案內容對了，引用也可能是亂掛的。[DeepResearch Bench](https://arxiv.org/abs/2506.11763)（arXiv:2506.11763；投影片標註 ICLR 2026）的 FACT 框架分三步：用 LLM 從報告抽出「陳述＋引用 URL」並把重複的合併、抓被引用頁面的文字、由 LLM 判斷頁面是否支持該陳述，最後算出引用準確率與每題平均有效引用數。以下是投影片自己的例子：「OpenScholar 有跟人類答案比較過 [1]」被 OpenScholar 論文支持；「OpenScholar 在每個領域都跟專家一樣好 [1]」不被支持，因為論文沒有測每個領域。兩條主張一條成立，引用準確率 50%，有效引用數 1。

四個缺口補完，投影片的總表變成：BrowseComp 系列管搜尋難度，MedBrowseComp／FinSearchComp 管領域，ScholarQABench／ResearchQA 用 rubric 管答案品質，DeepResearch Bench 管引用支持。**沒有一個 benchmark 同時蓋四格**，選 benchmark 前先問自己要量的是哪一格。

## 建模：deep research agent 怎麼訓練

### 推論迴圈

投影片先把一次推論拆開：模型產生 `<think>` 推理 → 產生 `<tool>search(...)</tool>` 工具呼叫 → 執行搜尋 → 搜尋結果接回 context → 帶著新證據繼續推理 → 最後產出附引用的 `<answer>`。這就是 [L2](/posts/ai/2026-09-29-cmu-11768-lecture-02-tool-use) 講的工具呼叫迴圈，差別只在工具是搜尋、輸出是有引用的長答案。

### 三段式訓練：mid-training、SFT、RL

投影片用 Tongyi DeepResearch 的流程當範本：

| 階段 | 目的 | 訓練資料 |
|---|---|---|
| Mid-training | 大規模學會 agent 行為 | 題目＋答案、teacher 軌跡 |
| SFT | 模仿成功的示範 | 題目＋答案、teacher 軌跡 |
| RL | 從自己的嘗試得到回饋 | 題目＋答案、policy 自己的 rollout |

接下來的問題是：題目和軌跡從哪來？

**合成題目：從知識圖譜抽子圖。** 投影片引 [WebSailor-V2](https://arxiv.org/abs/2509.13305)（arXiv:2509.13305）的做法：先建一張密集的知識圖譜，用 random walk 抽子圖，再依子圖出題。下面的 CMU 例子是投影片自己編的示意，事實取自 CMU 檔案與諾貝爾獎資料。知識圖譜的節點是實體、帶標籤的箭頭是關係：Allen Newell 是 CMU 教職員、Newell 和 Herbert Simon 合著《Human Problem Solving》（1972）、兩人共同獲得 1975 年圖靈獎、Simon 拿了 1978 年諾貝爾經濟學獎。從圖上抽一個連通子圖，把目標名字藏起來、把關係變成線索，就得到「哪位 CMU 研究者跟一位未來的諾貝爾經濟學獎得主合寫了人類問題解決的書，並在對方得諾貝爾獎前三年與他共享圖靈獎？」答案 Allen Newell 是已知的，所以可以自動驗證。這跟 BrowseComp 人工出題的邏輯一樣，只是改成機器大量產生。

**SFT：先收集、再過濾、最後模仿。** 讓 teacher 模型對這些題目產生軌跡，只留下答案正確、格式有效、推理連貫的軌跡來做 SFT。這對應 [WebDancer](https://arxiv.org/abs/2505.22648) 的三段式過濾（格式有效性、答案正確性、軌跡品質），Tongyi 報告則稱為 rejection sampling。答對但格式壞掉的、格式對但答錯的，都丟掉。

**Mid-training：先讓 base model 習慣 agent 工作流。** Tongyi 的 mid-training 用的是 Agentic Continual Pre-training（[Scaling Agents via Continual Pre-training](https://arxiv.org/abs/2509.13310)；投影片標註 ICLR 2026）：拿大量合成的 agent 行為資料，加上網頁、工具呼叫紀錄、過去淘汰的軌跡等語料，在 base model 上繼續預訓練。投影片的比較是同一份下游 SFT 資料、只換起點（論文 Table 3 的 SFT-B 設定，模型是 Qwen3-30B-A3B 與 AgentFounder-30B）：

| Benchmark | Qwen3 base + SFT | AgentFounder base + SFT |
|---|---|---|
| BrowseComp-en | 28.6 | 39.9 |
| BrowseComp-zh | 35.6 | 43.3 |
| GAIA | 71.8 | 72.8 |

起點好，SFT 之後的表現就跟著好。論文比了三種 SFT 資料，BrowseComp-en 的差距分別是 4.5（SFT-A）、11.3（SFT-B）、14.3（SFT-C）分，投影片選的是中間那組。

### RLVR：用答案對不對當 reward

短答案題可以直接用答案對錯當 reward。[Search-R1](https://arxiv.org/abs/2503.09516)（arXiv:2503.09516）就只用最終答案的 exact match 當 reward。投影片的示意（題目與 reward 是投影片自己編的）：同一題讓 policy 搜尋並推理，取樣三條軌跡，分別答 Herbert Simon、Allen Newell、Allen Newell，跟已知答案比對，reward 是 0、1、1，再用這些 reward 更新 policy。

投影片的更新方法是 [DeepSeekMath](https://arxiv.org/abs/2402.03300) 提出的 GRPO（Search-R1 論文 PPO 與 GRPO 都試過）：同一題的一組嘗試互相比，高於組內平均的提高機率、低於平均的降低機率。[L9](/posts/ai/2026-09-29-cmu-11768-lecture-09-rl-basics) 講過 RL 的基本目標（最大化期望 reward），GRPO 的細節是 [L11](/posts/ai/2026-09-29-cmu-11768-lecture-11-advanced-rl) 的主題。

<details>
<summary>GRPO 目標函數（投影片版本）</summary>

$$
J(\theta) = \mathbb{E}\left[\min\left(\rho \hat{A},\ \mathrm{clip}(\rho, 1-\epsilon, 1+\epsilon)\hat{A}\right) - \beta D_{\mathrm{KL}}\right]
$$

- $\hat{A}$：組內相對 reward（跟同一題其他嘗試比）
- $\mathrm{clip}$：限制每次更新的幅度
- $\beta D_{\mathrm{KL}}$：懲罰偏離參考模型太遠

投影片標註只對模型產生的 token 計算，工具回傳的文字不算。這是 Search-R1 論文的 retrieved token loss masking。

</details>

**非同步 rollout。** 每條軌跡的工具呼叫次數不同，有的兩輪就答、有的要五輪。投影片的做法是軌跡跑完就評分，湊滿一批已完成的軌跡再更新 policy，並搭配快取工具結果、容錯的 API 處理、背景任務整理來省成本。Tongyi 報告的對應做法是 step-level 非同步 RL，推論與工具呼叫各用一台獨立的非同步伺服器，工具端做了結果快取、逾時重試與備援 API。排程與訓練效率留到 L12（RL Systems）。

Tongyi 報告的訓練曲線（Figure 8）顯示 reward 穩定上升，policy entropy 短暫上升後收斂到穩定值。投影片特別註明：這是 RL 訓練曲線，報告沒有把每個訓練階段的貢獻單獨拆開。

### 長篇報告的 reward：DR Tulu 的演化式 rubric

短答案可以 exact match，長篇研究報告不行。投影片列出開放式綜合要量的東西：涵蓋度、相關性、事實正確、主張有沒有引用支持。

[DR Tulu](https://arxiv.org/abs/2511.19399) 的解法是 RLER（Reinforcement Learning with Evolving Rubrics）。每條 rollout 產出一份報告，reward 是 rubric 各項的加權平均：

$$
r_i = \frac{\sum_k w_k \cdot \mathrm{Judge}(c_k, y_i)}{\sum_k w_k}
$$

關鍵在 rubric $c_k$ 不是固定的。投影片的流程圖分兩層（IL-10 的例子是投影片的）：

- **持久 rubric**：訓練前先用題目去搜網頁，把搜到的文件交給 LM 產生，整個訓練過程都保留，例如「有引用『IL-10 工程化 T 細胞降低結腸炎嚴重度』」。
- **每題新增的 rubric**：訓練中比較同一題的好壞 rollout 產生。例如某條 rollout 寫「IL-10 抑制巨噬細胞 TNF-α，經由 STAT3 活化」，另一條寫「抗發炎訊號反而增加促發炎作用」，對比之後生出「回答有指出 STAT3 機制」這類正向項目，和「回答含有抗發炎細胞因子會上調的錯誤主張」這類負向項目。

這些 rubric 進入 rubric buffer，既用來評分，也回頭影響下一輪 rubric 的生成。論文裡的負向 rubric 主要用來抓 reward hacking，例如為了衝引用分數而整段照抄搜尋結果。buffer 大小固定，每輪只留讓同一題各 rollout 分數差異最大的項目。固定 rubric 的問題是 policy 學會之後就分不出好壞；演化式 rubric 會跟著 policy 新搜到的資訊與新犯的錯更新。

投影片的消融（論文 Figure 6，HealthBench、ScholarQABench v2、DeepResearch Bench 三者平均；數值是圖上讀數）：從約 50% 起跑，隨機 reward 只到 51% 左右，只用初始 rubric 在 2,500 步升到約 59%，演化式 rubric 升到約 61%。論文的文字說法是拿掉演化式 rubric 最多少 2 分，而且差距隨訓練拉大。**reward 的品質直接決定 RL 學到什麼**，這句話在 A2 還會再出現。

另外兩個結果：

- **SFT 是 RL 的暖身。** 投影片的圖（論文 Figure 5，數值是圖上讀數）：沒做 SFT 直接 RL，分數從約 27% 起跑；標為 Undertrained SFT 的那條從 46% 左右起跑；完整 SFT 資料的 RL 結果最好，4,000 步到 62% 左右。投影片旁註「即使只用 5% 的 SFT 也有幫助」，對應論文正文的說法：只用完整 SFT 混合資料的 5% 當冷啟動，RL 效果就勝過不做 SFT。
- **成本。** 投影片的成本／表現圖把 DR Tulu-8B 放在最左上角：分數跟 OpenAI Deep Research、GPT-5+Search 同一級，每題成本低好幾個數量級。論文的說法：四個長篇 benchmark（ScholarQA-CSv2、HealthBench、ResearchQA、DeepResearch Bench）平均 65.6 分，比 Tongyi DR 高 15.6 分（摘要寫成 15.6%），比 OpenAI DR 高 0.7%；在 ScholarQA-CSv2 上每題成本約 0.0019 美元，OpenAI DR 約 1.8 美元，差了將近三個數量級。

## 檢索：讓 retriever 看到 agent 在想什麼

### 工具與 dense retrieval 基礎

deep research agent 用的搜尋工具分兩類：自己架索引的檢索（BM25 這類詞彙比對、embedding 模型）和黑箱 API（web search、browse）。Tongyi 還接了 Python 執行，Tongyi 和 DR Tulu 都接了學術搜尋（Tongyi 用 Google Scholar；DR Tulu 在 ScholarQA-CSv2 上有九成時間用論文搜尋）。

Embedding 檢索用 [Dense Passage Retrieval](https://aclanthology.org/2020.emnlp-main.550/)（EMNLP 2020）的雙編碼器：文件先用 document encoder 編碼建索引，查詢用 query encoder 編碼，分數是兩個向量的內積 $s(q,d) = E_q(q)^\top E_d(d)$，取前 k 名。訓練用對比學習，拉近查詢與相關段落、推遠負例：

$$
L = -\log \frac{\exp s(q, d^+)}{\exp s(q, d^+) + \sum_{d^-} \exp s(q, d^-)}
$$

投影片把編碼器設計、負例取樣、索引細節交給 Advanced NLP 和 IR 課。

### 問題：retriever 只看得到最後一個 query

agent 的 context 裡有原始任務、之前的推理、之前的查詢與證據、當下的推理，但傳給 retriever 的只有最新那一條 query。推理明明寫出了「我現在要找的是什麼、為什麼」，retriever 完全看不到。

[AgentIR](https://arxiv.org/abs/2603.04384)（arXiv:2603.04384；投影片標註 COLM 2026）改兩件事：

1. **輸入**：把當下的推理 $\tau_t$ 跟 query $q_t$ 一起編碼。
2. **訓練資料（DR-Synth）**：一般 retriever 訓練只有整題的正負例，但 agent 中途的每次搜尋要的東西都不一樣，需要「這一輪哪些文件有用」的局部標籤。DR-Synth 的做法是先用只看 query 的傳統 retriever 取這一輪的前 50 份文件，把整題的正例文件放到最前面，再讓 LLM 依這一輪的 query、整題問題與答案做 listwise rerank，排第一的標為正例、最後七份標為 hard negative。論文拿 WebShaper 做出 5,238 筆訓練資料，微調 Qwen3-Embedding-4B 得到 AgentIR-4B。

### 結果

在 BrowseComp-Plus 上，AgentIR 論文報告 AgentIR-4B 搭 Tongyi-DeepResearch 的準確率是 68%，兩倍大的傳統 embedding 模型是 52%，BM25 是 37%。投影片的散佈圖還多了一個軸：AgentIR 的準確率更高，**平均搜尋次數也更少**，換成 gpt-oss-120B、GLM-4.7 當 agent 趨勢一樣。

消融把兩個改動拆開看（論文 Table 2，準確率 %；「+ 推理」是把推理接在 query 前面、不另外訓練）：

| Agent | 只給 query | + 推理 | + DR-Synth | 兩者都有（AgentIR） |
|---|---|---|---|---|
| Tongyi-DR | 48.7 | 55.5 | 59.4 | 66.3 |
| gpt-oss-120B | 47.6 | 51.3 | 59.2 | 67.0 |
| GLM-4.7 | 50.5 | 50.9 | 57.5 | 64.7 |
| Tongyi-DR (visit) | 50.2 | 54.0 | 59.5 | 68.1 |

兩個改動各自有效，合起來最好。

最後一張消融問「給 retriever 哪一段歷史最有用」：全部用 DR-Synth 訓練，只改輸入內容（論文 Table 3，準確率 %；論文還多比了「整題問題」一欄，投影片沒列，這裡也省略）：

| Agent | 只給 query | 先前查詢 | 查詢＋推理 | 查詢＋推理＋文件 | 當下推理（AgentIR） |
|---|---|---|---|---|---|
| Tongyi-DR | 59.4 | 63.1 | 63.1 | 60.0 | 66.3 |
| gpt-oss-120B | 59.2 | 61.9 | 64.3 | 58.7 | 67.0 |
| GLM-4.7 | 57.5 | 59.1 | 60.8 | 58.7 | 64.7 |
| Tongyi-DR (visit) | 59.5 | 63.0 | 66.3 | 61.5 | 68.1 |

**當下這一步的推理訊號最強**。把先前搜到的文件也塞進去，四個設定都比「查詢＋推理」低，歷史不是給越多越好。

## 四句話總結

投影片最後一頁：

1. **任務**：deep research 是多次搜尋加上證據綜合。
2. **評測**：評答案品質與引用支持，rubric 本身也要稽核。
3. **訓練**：先從示範學，再從任務回饋改進。
4. **檢索**：把 agent 的資訊需求交給 retriever，並針對它訓練。

## 今晚可以動手的事

- **替自己的研究 agent 跑一次 FACT 式檢查。** 挑它最近產出的一份報告，把每個「主張＋引用」抽成一行，逐條打開連結看頁面有沒有支持那句話，算出引用準確率。這比任何 benchmark 都更快告訴你 agent 的問題在哪。
- **把 query 改成「推理＋query」再搜一次。** 如果你的 agent 用 embedding 檢索，把它搜尋前寫的推理一起丟進 query encoder，比較前後的前 5 名結果。不用重訓，先看看訊號有沒有差。
- **寫三條 rubric 之前，先檢查 rubric。** 替一個研究問題寫 3 到 5 條評分項目，逐條問：有沒有引用不存在的東西？是不是只是重講題目？一個看似合理的錯答案能不能過？

## 它在課程裡的位置

L10 是 Domains 模組的第三講，也是 Training 模組中間插進來的一講：前面的 [L8](/posts/ai/2026-09-29-cmu-11768-lecture-08-sft) 講 SFT、L9 講 RL 基礎，後面的 L11 講進階 RL 演算法、L12 講 RL 系統。所以這一講的建模段落幾乎就是 L8、L9 的應用實例——資料合成、拒絕取樣後 SFT、RLVR、GRPO 都在這裡落地到搜尋 agent 上。

它也是 [Assignment 2（Eval）](/posts/ai/2026-09-29-cmu-11768-assignment-2-eval) 的鋪陳。A2 要學生替資料視覺化 agent 寫評分器，碰到的問題正是本講評測段落列的那些：答案不只一種、相似度不可靠、LM 裁判要稽核。DR Tulu 則示範了下一步：評分器寫得夠好，就能直接變成 RL 的 reward。

## 延伸閱讀

系列總覽見 [CMU 11-768 AI Agents 導讀：課程總覽](/posts/ai/2026-09-29-cmu-11768-course-overview)。

站內相關文章，可以跟本講對照：

- [Deep Research 全景圖：80+ 實作的分類、路線與取捨](/posts/ai/2026-09-19-deep-research-survey-overview)
- [Deep Research Agent 怎麼蓋：多輪搜尋規劃、衝突調和、可驗證結論](/posts/ai/2026-06-04-autonomous-deep-research-agent)
- [從搜尋結果到可靠引用：URL 去重、來源分級與 Claim-Source Mapping](/posts/ai/2026-08-22-search-results-reliable-citations)
- [CS336 Lecture 16：RLVR 用可驗證獎勵擴大推理，但 GRPO 不是免費的 PPO](/posts/ai/2026-08-22-cs336-rlvr)
- [Stanford CS329Z 導讀 Week 7：分數別騙自己，資料再做大——期中驗收週](/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

以下每一篇都打開全文（arXiv HTML、ACL Anthology PDF、Nature 全文頁或原始網頁）核對過文中引用的段落。

課程材料：

- [CMU 11-768 AI Agents 課程官網](https://www.cmu-agents.com/)
- [Lecture 10 投影片：Deep Research Agents（Akari Asai）](https://www.cmu-agents.com/slides/lecture-10-deep-research-agents.pdf)
- [Natural Questions 資料瀏覽器](https://ai.google.com/research/NaturalQuestions/databrowser)：官方 train set 範例中有「who wrote the score for the force awakens」這一題，對應文件是[維基百科《Star Wars: The Force Awakens (soundtrack)》2018 年版本](https://en.wikipedia.org/w/index.php?oldid=824425456)，首段寫明作曲者 John Williams（2026-09-29 核對）

指定讀物：

- [OpenScholar: Synthesizing Scientific Literature with Retrieval-augmented LMs（arXiv:2411.14199）](https://arxiv.org/abs/2411.14199)；[Nature 版本](https://www.nature.com/articles/s41586-025-10072-4)（rubric 一致率 0.79／0.80 出自 Nature 版 Methods）
- [BrowseComp: A Simple Yet Challenging Benchmark for Browsing Agents（arXiv:2504.12516）](https://arxiv.org/abs/2504.12516)
- [DeepResearch Bench: A Comprehensive Benchmark for Deep Research Agents（arXiv:2506.11763）](https://arxiv.org/abs/2506.11763)
- [Tongyi DeepResearch Technical Report（arXiv:2510.24701）](https://arxiv.org/abs/2510.24701)
- [DR Tulu: Reinforcement Learning with Evolving Rubrics for Deep Research（arXiv:2511.19399）](https://arxiv.org/abs/2511.19399)
- [AgentIR: Reasoning-Aware Retrieval for Deep Research Agents（arXiv:2603.04384）](https://arxiv.org/abs/2603.04384)

投影片引用、本文用來支撐內容的其他論文：

- [BrowseComp-Plus: A More Fair and Transparent Evaluation Benchmark of Deep-Research Agent（arXiv:2508.06600）](https://arxiv.org/abs/2508.06600)（投影片引用的標題為 A Fair and Disentangled Evaluation Benchmark for Deep Search Agents，標註 ACL 2026）
- [FinSearchComp: Towards a Realistic, Expert-Level Evaluation of Financial Search and Reasoning（arXiv:2509.13160）](https://arxiv.org/abs/2509.13160)
- [MedBrowseComp: Benchmarking Medical Deep Research and Computer Use（arXiv:2505.14963）](https://arxiv.org/abs/2505.14963)
- [ScholarSearch: Benchmarking Scholar Searching Ability of LLMs（arXiv:2506.13784）](https://arxiv.org/abs/2506.13784)
- [AutoResearchBench: Benchmarking AI Agents on Complex Scientific Literature Discovery（arXiv:2604.25256）](https://arxiv.org/abs/2604.25256)
- [A Critical Evaluation of Evaluations for Long-form Question Answering（ACL 2023）](https://aclanthology.org/2023.acl-long.181/)
- [ResearchQA: Evaluating Scholarly Question Answering at Scale Across 75 Fields with Survey-Mined Questions and Rubrics（arXiv:2509.00496）](https://arxiv.org/abs/2509.00496)
- [DeepResearch Bench II: Diagnosing Deep Research Agents via Rubrics from Expert Reports（arXiv:2601.08536）](https://arxiv.org/abs/2601.08536)
- [WebSailor-V2: Bridging the Chasm to Proprietary Agents via Synthetic Data and Scalable Reinforcement Learning（arXiv:2509.13305）](https://arxiv.org/abs/2509.13305)
- [WebDancer: Towards Autonomous Information Seeking Agency（arXiv:2505.22648）](https://arxiv.org/abs/2505.22648)
- [Scaling Agents via Continual Pre-training（arXiv:2509.13310）](https://arxiv.org/abs/2509.13310)
- [Search-R1: Training LLMs to Reason and Leverage Search Engines with Reinforcement Learning（arXiv:2503.09516）](https://arxiv.org/abs/2503.09516)
- [DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models（arXiv:2402.03300）](https://arxiv.org/abs/2402.03300)
- [Dense Passage Retrieval for Open-Domain Question Answering（EMNLP 2020）](https://aclanthology.org/2020.emnlp-main.550/)
