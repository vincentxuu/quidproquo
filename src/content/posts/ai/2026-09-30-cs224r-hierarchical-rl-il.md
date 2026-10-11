---
title: "CS224R L15：階層式 RL 與模仿學習"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, imitation-learning, embodied-ai]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 18
tldr: "長 horizon 任務難，是因為要走過的狀態太多、犯錯和卡住的機會也多。CS224R 第 15 講的答案是拆成兩層：高層 policy 出子目標，低層 policy 以較高頻率執行。真正要做的設計決定有三個：子目標用什麼表示、兩層各自拿什麼監督、什麼時候換下一個子目標。投影片也坦白，階層和「單一 policy 加 chain of thought」誰比較好，還沒有定論。"
description: "Stanford CS224R Spring 2026 第 15 講「Hierarchical RL and IL」導讀：長 horizon 任務為什麼難、階層可能幫上的四個理由、階層 vs 扁平 policy vs chain of thought、好的子目標表示有哪些性質、兩層 policy 怎麼監督、何時切換子目標，以及語言子目標、影像子目標、狀態子目標的代表系統（Yell At Your Robot、Hi Robot、π0.5、SuSIE、HIRO），加上課表指定閱讀 SayCan。"
draft: false
glossary:
  - term: "hierarchical policy"
    aliases: ["階層式 policy", "分層 policy"]
    definition: "把決策拆成兩層（或更多層）的 policy：高層 policy 根據觀測和指令輸出中間目標 g_t，低層 policy 以較高頻率輸出實際動作去完成 g_t。g_t 也常被叫做 subgoal、skill、option 或 high-level action。"
    context: "CS224R L15 的核心結構。"
  - term: "HL DAgger"
    aliases: ["高層 DAgger"]
    definition: "只對階層式 policy 的高層做 DAgger：凍結低層 policy，執行時由人用語言糾正覆寫高層的預測，再用這些語言糾正當監督更新高層。"
    context: "CS224R L15 用 Yell At Your Robot（RSS 2024）示範。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-hierarchical-rl-il-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

**本文依據 [CS224R](https://cs224r.stanford.edu/) Spring 2026 版。** 這是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列第 18 篇，接續 [L13 Meta-RL](/posts/ai/2026-09-30-cs224r-meta-rl)，對應 2026 年 5 月 20 日（第 8 週週三）的第 15 講「Hierarchical RL and IL」。2026 年的 14 號沒有講課，那一天（5 月 15 日）是期中考。

用到的官方材料：

- 當期投影片 [15_cs224r_hierarchy_2026.pdf](https://cs224r.stanford.edu/slides/15_cs224r_hierarchy_2026.pdf)（46 頁，標題是「Hierarchy in Imitation and Reinforcement Learning」）
- 課表上的指定閱讀：[Do As I Can, Not As I Say: Grounding Language in Robotic Affordances（Ahn et al. 2022，也就是 SayCan）](https://arxiv.org/abs/2204.01691)

存取等級是 **A3**：投影片匿名可下載，2026 錄影只放在 Canvas 上，修課學生才看得到。

配套影片（**補充教材**）：[Spring 2025 Lecture 15: Hierarchical RL and IL](https://www.youtube.com/watch?v=iKWYLSVAtfM)（約 70 分鐘）。2025 版在 5 月 21 日上，標題和指定閱讀都和 2026 相同，但這是去年的錄影，細節可能和 2026 投影片有出入。以下以 2026 投影片為準。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=iKWYLSVAtfM
title: Spring 2025 Lecture 15: Hierarchical RL and IL（YouTube，補充）
```

原始影片：[Spring 2025 Lecture 15: Hierarchical RL and IL（YouTube，補充）](https://www.youtube.com/watch?v=iKWYLSVAtfM)

內容核對：已依字幕核對（2026-10-10）：抽樣讀取 Spring 2025 L15 Hierarchical RL and IL 的字幕（前／中／後段加關鍵字搜尋，非逐字比對），確認影片確實是這一講、講者為 Chelsea Finn、主題與本文相符。字幕談到高層／低層 policy、人類介入的 DAgger 式修正、用影像編輯模型產生子目標、最後接到 hierarchical RL，與本文主題一致。本文敘述以 2026 投影片為準，影片只當補充。

課程與錄影入口：

- [官方課程／講次來源](https://cs224r.stanford.edu/)

Spring 2026 當季講次錄影放在需 Stanford 登入的 Canvas／Panopto；公開 YouTube 播放清單是 Spring 2025。 查核日期：2026-10-10。

## 場景：把好幾個行為串起來

投影片第 3 頁先回顧前兩講：[多任務與 goal-conditioned RL](/posts/ai/2026-09-30-cs224r-multi-task-goal-conditioned-rl) 讓 policy 吃一個任務描述 z 或目標狀態 s_g；[Meta-RL](/posts/ai/2026-09-30-cs224r-meta-rl) 讓 policy 吃一小段新任務的經驗。今天的問題是：**能不能把多個（子）任務的行為串在一起？**

第 5 頁舉了四個長 horizon 任務：做佛卡夏、修一個讓訓練 loss 爆掉的 bug、開車去優勝美地、替一份 8 頁報告寫回饋。它們難在三件事：

1. 會走過非常多的狀態
2. 犯錯的機會很多
3. 「卡住」的機會很多

**怎麼做**：挑一個你手上的長任務（例如一個 agent 要完成的多步驟工作流），把它寫成「烤起司蛋糕 → 買材料 → 去商店 → 走到門口 → 踏一步」這樣的階梯（第 6 頁的例子）。你會發現最上層很難直接做，最下層很容易，中間那幾層就是階層要學的東西。

## 直覺：高層出目標，低層出動作

第 7 頁把結構畫出來：

- **高層 policy π_HL**：看觀測 o_t 和指令，輸出中間目標 g_t
- **低層 policy π_LL**：看 o_t 和 g_t，輸出動作 a_t，而且**執行頻率比高層高**

g_t 有很多名字：subgoal、subtask、skill、option、high-level action。階層也不一定只有兩層。

第 8 頁把執行流程寫成演算法：

1. 在 t = 1 觀察初始觀測 o_1
2. 依 π_HL(· | o_t, prompt) 規劃目標 g_t
3. 在選出新目標之前，重複：依 π_LL(· | o_t, g_t) 執行動作 a_t，t ← t + 1，觀察新的 o_t

### 階層可能幫上的四個理由

第 9 頁列了四點：

1. 提供「任務要怎麼完成」的監督訊號
2. 相似的子任務之間可以更直接地共享知識
3. 在 RL 裡，可以在高層空間做有結構的探索
4. 實務上的好處：兩層跑在不同頻率，比較好滿足延遲要求

### 真的需要兩個 policy 嗎

第 10–11 頁把三種做法擺在一起比：

| 做法 | 結構 | 投影片的評語 |
|---|---|---|
| 階層 | π_HL 出 g_t，π_LL 出 a_t | — |
| 扁平 policy | 一個 π 直接出 a_t | — |
| Chain of thought | 一個 π 先出 g_t 再出 a_t | 能用到和階層一樣的監督；但可能太耗算力，例如 50 Hz 的控制 |

投影片的結論是：**目前還沒有決定性的實證比較**。這句話值得記住，下面講到的系統都是階層式，但它們證明的是「階層比沒有中間監督的扁平 policy 好」，不是「階層一定比 chain of thought 好」。

## 機制一：子目標用什麼表示

第 13 頁是課堂討論題：從四個任務（做義大利菜、騎腳踏車到校園各處、擬法律文書、替使用者規劃並訂一週的假期）挑一個，討論中間目標是什麼、用什麼表示最好。投影片給的例子是「騎到 Dish 的入口」。

第 14 頁的總結：

1. 最好的目標表示**多半跟領域有關**
2. 好的目標表示有三個性質：
   - **有表達力**：能傳達很多種不同的低層行為
   - **有結構**：相似的行為應該有相似的 g
   - **抽象程度合適**：對低層和高層來說都不會太難

**怎麼做**：替你的任務列出三種候選表示（例如一句話、一張目標畫面、一組座標），逐一用這三個性質打勾。語言通常表達力強，座標通常結構好，畫面介於兩者之間。

## 機制二：兩層各自怎麼監督

第 16 頁先問：為什麼不直接端到端訓練、讓 g 當潛在表示？投影片的回答是，**這樣得到的其實就是一個扁平 policy**。它接著提醒：要仔細想好處到底從哪裡來，而且「在任何研究裡都該這樣做」。

第 17 頁點出兩層互相依賴的雞生蛋問題：

- **低層**：訓練目標是完成 g，不是原任務。關鍵問題是「用哪一種 g 的分佈來訓練？」理想上是高層會輸出的那些，但高層還沒學。
- **高層**：訓練目標是完成原本的長任務。關鍵問題是「搭配哪一個低層？」理想上是學好的那個低層，但低層也還沒學。

第 18 頁的建議：兩層可以**先各自分開訓練**，但至少要有一層去適應另一層的缺陷（如果不是兩層一起微調的話）。投影片另外加註：**LLM 往往是不錯的高層 policy**。

## 機制三：什麼時候換下一個子目標

第 20–21 頁問的是：多久重新查詢一次高層？兩個選項：

| | 選項 1：低層完成 g_t 時才換 | 選項 2：固定每 n 步換一次 |
|---|---|---|
| 做法 | 例如估計朝 g 的進度 | 例如挑一個相當頻繁的重新規劃間隔 |
| 優點 | 原理上最理想 | 簡單 |
| 缺點 | 很難判斷「做完了沒」；還要處理需要重做前面目標的錯誤 | n 小時高層負擔重；要在更多算力和切換延遲之間取捨 |
| 出錯的後果 | 判斷完成與否出錯，agent 很容易**永遠卡住** | 子任務預測錯，低層可能做 n 步錯的動作 |

投影片特別標註：選項 1 的錯誤**更致命**。

## 例子：語言子目標、影像子目標、狀態子目標

第 23 頁標題是「Hierarchy is hot」，列了四個業界系統：Physical Intelligence π0.5、NVIDIA GR00T N1、Figure Helix、Gemini Robotics。投影片只放了名字和圖，沒有展開。

接下來依第 25 頁的分類走四個例子。

### 模仿學習＋語言子目標

第 27 頁的資料是**切好段、每段附一句語言指令**的示範資料，高層和低層都用模仿學習訓練。

第 28–30 頁用 [Yell At Your Robot（Shi et al., RSS 2024）](https://arxiv.org/abs/2403.12910) 展示：高層是語言 policy，看 RGB 影像輸出一句話；低層是語言條件的 BC policy（LCBC），輸出關節目標，在 ALOHA 工作站上執行。

投影片問：兩層都能用 [DAgger](/posts/ai/2026-09-30-cs224r-imitation-learning) 嗎？答案是可以。而且高層**只要有語言形式的介入就能更新**。做法叫 **HL DAgger**：

1. 凍結低層 policy
2. 執行時，人用語言糾正（例如「不要倒到袋子外面」）覆寫高層的預測
3. 用這些語言糾正當監督，更新高層

第 33 頁的影片說明，微調後的 policy 能自我糾正。第 34–35 頁比較了扁平 VLA 和階層式 VLA、基礎階層 policy 和加了高層 DAgger 的版本，引用了 [Hi Robot（Lucy Shi et al., ICML 2025）](https://arxiv.org/abs/2502.19417)。第 35–36 頁的標題是「有了階層，機器人更擅長長 horizon 任務」，圖上標著 2X，分別出自 Yell At Your Robot 和 [π0.5（Pi team, 2025）](https://arxiv.org/abs/2504.16054)。PDF 上只看得到圖和 2X 標記，看不到它對應哪一個指標，本文不替它補寫。

### 模仿學習＋影像子目標

第 38 頁把高層換成輸出**目標影像**，實務上用一個影像編輯模型來生成，低層則是以目標影像為條件的 policy。好處有兩個：

- 不需要切段、附語言標註的影片
- 高層可以用上**沒有標註的影片資料**

第 39–40 頁的例子是 [SuSIE（Black, Nakamoto et al., ICLR 2024）](https://arxiv.org/abs/2310.10639)，任務像「把木碗移到桌子上方」「把牙膏放進木碗」「打開抽屜」。第 40 頁問：高層訓練時加入人類影片有沒有幫助？並排比較「只用機器人資料」和「機器人資料＋人類影片」。

第 41 頁補了一個 chain of thought 版本的視覺例子（Chen, Belkhale et al. 2025, Training Strategies for Efficient Embodied Reasoning），並加註：**用 RL 微調大型階層式機器人系統，是一個開放而且重要的研究方向**。這正是 [L17 VLA 的 RL](/posts/ai/2026-09-30-cs224r-rl-for-vlas) 要接的題目。

### 階層式 RL：狀態目標與語言目標

第 43 頁兩個例子：

- **狀態目標**（例如 agent 和物體的相對目標位置），出自 [Nachum et al. NeurIPS 2018（HIRO）](https://arxiv.org/abs/1805.08296)：
  - 低層：goal-conditioned policy，用「有沒有到達目標」當獎勵
  - 高層：把「輸出目標狀態」當成高層動作來訓練
  - 對高層動作做 hindsight relabeling，搭配 off-policy 演算法。hindsight relabeling 在[多任務與 GCRL](/posts/ai/2026-09-30-cs224r-multi-task-goal-conditioned-rl) 那篇講過
- **語言目標**（或簡單的語意任務），出自 [Jiang, Gu, Murphy, Finn. NeurIPS 2019](https://arxiv.org/abs/1906.07343)：
  - 低層：語言條件 policy，用 hindsight 語言重標註
  - 高層：訓練成輸出語言

第 44 頁留了一個活躍的研究題目：能不能**不靠監督**就發現一組多樣的技能？引用的是 [Diversity is All You Need（Eysenbach et al., ICLR 2019）](https://arxiv.org/abs/1802.06070)。

## 指定閱讀：SayCan

課表把 [SayCan](https://arxiv.org/abs/2204.01691) 列為這講的閱讀，但 2026 投影片沒有任何一頁提到它。依論文摘要，它是「LLM 當高層」的早期代表：

- LLM 懂很多語意知識，但缺乏真實世界經驗，說出的步驟不一定適用於眼前這台機器人和環境
- 解法是用**預先訓練好的技能**來約束 LLM，只讓它提出可行、又符合情境的語言動作
- 每個技能的**價值函數**負責把 LLM 的知識接地到具體的物理環境
- 在移動操作機器人上完成長 horizon、抽象的語言指令

對照第 18 頁的「LLM 往往是不錯的高層 policy」和第 21 頁的「何時換目標」，SayCan 可以看成是：高層由 LLM 提議，由低層技能的價值函數投票。

## 連回來

第 45 頁的回顧就是三個問題：長任務為什麼難、階層為什麼可能有幫助，以及三個設計選擇（目標表示、各層監督、何時換目標）。

**怎麼做**：拿你正在做的 agent 或機器人系統，替它寫下三行字：g 是什麼、高層和低層各用什麼資料訓練、什麼條件觸發重新規劃。寫不出第三行的系統，最容易在第 21 頁說的「永遠卡住」狀況出事。

下一講是 Guanya Shi 的客座演講，講模擬器裡學到的行為怎麼搬到真機器人上。見 [L16 Sim-to-Real](/posts/ai/2026-09-30-cs224r-sim2real-robot-learning)。

站內延伸閱讀：

- [Berkeley CS285 的探索與開放問題導讀](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems)
- [CS285 模仿學習與 RL 基礎](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics)，DAgger 的另一種講法

## 這一篇可以確認與不能確認的

可以確認：2026 投影片的文字、演算法步驟與圖表標題；課表的日期與指定閱讀；2025 影片的標題與長度；各篇論文的標題（逐一開過 arXiv 頁面）。不能確認：第 13 頁課堂討論的內容、第 34–36 頁長條圖的具體數值與指標、第 23 頁四個業界系統在課堂上被怎麼介紹。2026 投影片的 SuSIE 標題寫作「SuSIE: Subgoal Synthesis via Image Editing」，arXiv 上的標題是「Zero-Shot Robotic Manipulation with Pretrained Image-Editing Diffusion Models」，兩者是同一篇。

系列導覽：上一篇 [L13 Meta-RL](/posts/ai/2026-09-30-cs224r-meta-rl)｜下一篇 [L16 Sim-to-Real 機器人學習](/posts/ai/2026-09-30-cs224r-sim2real-robot-learning)｜[系列入口](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入的影片屬於較早學期的公開錄影，不是 2026 當季課程，狀態改為相關補充影片。
- 2026-10-10：依字幕核對影片內容。影片是 Spring 2025 L15，主題相符（約 70 分鐘亦相符），沒有需修正之處。

## 參考資料

- [CS224R: Deep Reinforcement Learning（Spring 2026 課程官網與課表）](https://cs224r.stanford.edu/)
- [Lecture 15 投影片：Hierarchy in Imitation and Reinforcement Learning（2026）](https://cs224r.stanford.edu/slides/15_cs224r_hierarchy_2026.pdf)
- [CS224R Spring 2025 封存頁](https://cs224r.stanford.edu/spring_2025/)
- [Spring 2025 Lecture 15: Hierarchical RL and IL（YouTube，補充）](https://www.youtube.com/watch?v=iKWYLSVAtfM)
- [Ahn et al. 2022：Do As I Can, Not As I Say（SayCan）](https://arxiv.org/abs/2204.01691)
- [Shi et al. 2024：Yell At Your Robot](https://arxiv.org/abs/2403.12910)
- [Shi et al. 2025：Hi Robot](https://arxiv.org/abs/2502.19417)
- [Physical Intelligence 2025：π0.5](https://arxiv.org/abs/2504.16054)
- [Black, Nakamoto et al. 2023：SuSIE（Zero-Shot Robotic Manipulation with Pretrained Image-Editing Diffusion Models）](https://arxiv.org/abs/2310.10639)
- [Nachum et al. 2018：Data-Efficient Hierarchical Reinforcement Learning](https://arxiv.org/abs/1805.08296)
- [Jiang et al. 2019：Language as an Abstraction for Hierarchical Deep RL](https://arxiv.org/abs/1906.07343)
- [Eysenbach et al. 2018：Diversity is All You Need](https://arxiv.org/abs/1802.06070)
