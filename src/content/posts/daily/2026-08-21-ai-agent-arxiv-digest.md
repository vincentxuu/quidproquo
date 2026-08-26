---
title: "AI Agent Arxiv Digest — 2026-08-21"
date: 2026-08-21
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天三篇都在問同一件事：Agent 能不能從自己的執行軌跡裡學會變強——答案是能學執行、學技能，但學不會改策略"
tldr: "DART-SD 用互動狀態圖只監督修復步驟，讓工具呼叫 agent 自蒸餾不再誤殺有效探索；SkillForge 讓 agent 先解合成題把 repo 知識蒸成技能，SWE-bench Verified +5.8%；Post-Training AI 分析發現頂尖 agent 開場就鎖死訓練策略，之後十小時只做局部微調"
series:
  name: "AI Agent Arxiv Digest"
  order: 89
---

> 🌏 [English version](/en/posts/daily/2026-08-21-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文可以串成一條完整的問句：Agent 能不能從自己跑過的軌跡裡學會變強？三篇分別給了不同深度的答案。DART-SD（ByteDance）從**訓練方法**切入，指出「照抄整條成功軌跡」會誤殺同樣有效的替代路徑，改成只監督「該轉彎卻走錯的那一步」；SkillForge（上海交大）從**落地應用**切入，讓 SWE agent 在碰到真 bug 前先解一批自己合成的題目，把 repo 的隱性知識預先蒸成可檢索的技能；而 Post-Training AI（清華）從**能力極限**切入，分析大量公開軌跡後發現一個尷尬事實——頂尖 agent 開場十分鐘就把訓練策略鎖死，剩下十小時全在同一個策略裡打轉。合起來看：Agent 已經很會「執行」和「累積技能」，但「在執行途中自己推翻大方向」這件事，目前還沒有機制能做到。這條界線，正是下一代 agent 訓練要跨的坎。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| 軌跡（Trajectory / Rollout） | Agent 為了完成一個任務，一步步「想什麼、呼叫哪個工具、拿到什麼結果」的完整過程紀錄，是訓練 agent 的原料 |
| 自蒸餾（Self-Distillation） | 讓模型自己跑出軌跡、再從這些軌跡裡挑好的來教自己，不靠更大的老師模型，等於「自己當自己的教練」 |
| 工具呼叫（Tool-Calling / TIR） | Agent 呼叫外部工具（搜尋、計算、API）並根據回傳結果決定下一步，多輪工具呼叫是自主 agent 的核心能力 |
| SWE-bench | 用 GitHub 真實 issue 測 agent 能不能自動修 bug 的權威基準，Verified 是人工核實過的子集，Pro 是更難的版本 |
| SFT / PEFT | 兩種微調模型的方式：SFT 調整全部參數（貴、徹底），PEFT 只調一小部分（便宜、輕量），是 post-training 最常見的兩條路線 |
| Cold-start problem（冷啟動問題） | Agent 剛進一個陌生 repo 時沒有專案知識，只能像新人一樣反覆踩同樣的坑，直到累積夠多經驗 |

---

## 論文一｜DART-SD：別逼 Agent 照抄整條軌跡

### DART-SD: Diamond-topology Aware Retrieval and Tuning for Self-Distillation of Multi-Turn Tool-Calling Agents
Hangrui Xu, Jiarui Wang, Yang Yang et al.（ByteDance）　·　arxiv: 2608.18524

連結: [arxiv](https://arxiv.org/abs/2608.18524) · [alphaxiv](https://www.alphaxiv.org/abs/2608.18524)

### TL;DR

訓練多輪工具呼叫 agent 時，逼它「照抄整條成功軌跡」會誤殺同樣有效的替代做法。DART-SD 改成先畫出所有成功與失敗路徑的「互動狀態圖」，只在 agent「該轉彎卻走錯的那一步」做監督，其餘正確前綴一律不動——在五個工具呼叫基準上都勝過傳統整條軌跡訓練與強化學習基準。

### Read Priority

必讀 — 如果你在訓練或微調工具呼叫 agent。這篇點破了一個很多人沒意識到的訓練陷阱：多個子目標順序無所謂時，逼模型記住某一種順序反而會傷害泛化。它給的解法（只修錯的那一步）在概念上乾淨，工程上也可落地。

### 領域背景

要讓 LLM 變成能跑多輪任務的 agent，主流做法是「軌跡模仿」——收集成功案例，讓模型照著一步步學。問題是：很多任務的子目標其實沒有固定順序（先查天氣還是先查機票都行），成功的解法不是一條線，而是一大片「怎麼走都對」的組合空間。硬把這片空間壓成一條條單一軌跡來訓練，模型會被迫認定「只有這個順序才對」，反而懲罰了其他同樣正確的走法，論文稱之為「拓撲崩塌」（topological collapse），代價是探索多樣性大幅下降。

### 中階導讀

- **問題**：想像你教人做一道三步料理，切菜、燒水、備醬三件事誰先誰後都行。但如果你只給他看「切菜→燒水→備醬」這一種示範影片，還要求他每個動作都跟影片一模一樣，他就會誤以為「先備醬是錯的」。多輪工具呼叫 agent 的訓練正在犯這個錯。
- **方法**：DART-SD 把整個執行過程畫成一張「互動狀態轉移圖」（ISTG），節點是「到目前為止累積了哪些狀態」而不是「這一步做了什麼動作」——這樣順序不同但結果相同的路徑會自然匯流到同一個節點。訓練時，它找出學生軌跡「第一次偏離成功可達區」的那個關鍵斷點（CTB），從圖裡撈出一條能救回來的參考路徑，然後**只對修復步驟算 loss，嚴格保護前面正確的推理前綴不被破壞**。
- **為什麼重要**：這把 agent 訓練從「全域強迫模仿」改成「局部精準糾錯」。對做 agent RL / SFT 的團隊來說，意味著你不必再糾結於收集「標準答案軌跡」，而是讓模型自己跑、只在它真正走錯的地方補課。

### 深入要點

- 核心機制：ISTG（互動狀態轉移圖）以累積互動狀態為節點，讓順序無關的探索路徑自然匯流，避免拓撲崩塌
- CTB（關鍵拓撲斷點）：把學生的互動狀態投影到「成功可達區」，找出它第一次脫離的位置作為補課點
- 訓練損失只計算在生成的 recovery 步驟上，正確前綴不吃破壞性梯度——這是「保護有效探索」的關鍵設計
- 漸進式自蒸餾：學生每輪重新 rollout，CTB 會隨能力提升往後移，形成自動難度曲線（self-paced curriculum）
- 在五個 benchmark、兩個模型規模上勝過蒸餾與 RL 基準，並減少冗餘工具呼叫 ⚠️（ByteDance 自測，需等外部複現）
- 與現有 agent RL 框架（GRPO 類方法）相容——本質是換掉「怎麼算 loss」，不是換整套訓練管線

### Reviewer 一句話評

「順序無關子目標造成拓撲崩塌」這個問題定位很準，ISTG + 局部監督的設計也優雅；但「勝過所有基準」目前是單一團隊自測，且圖的建構成本與大規模工具空間下的可擴展性論文著墨不多，先觀察複現。

### 給你的 take-away

- 如果你在訓練工具呼叫 agent：先檢查你的訓練資料是不是在強迫模型記住「某一種正確順序」——若任務有順序無關的子目標，整條軌跡模仿很可能正在傷害泛化，DART-SD 的「只監督斷點」值得直接借鏡
- 如果你在做 agent RL：ISTG 這種「以狀態而非動作為節點」的表示法，是處理長程、多分支任務時做 credit assignment 的實用思路

---

## 論文二｜SkillForge：讓 Agent 進 repo 前先自修一遍

### SkillForge: Self-Distilling Agents for Project-Specific Issue Resolution
Silin Chen, Han Li, Xiaodong Gu et al.（Shanghai Jiao Tong University）　·　arxiv: 2608.18933

連結: [arxiv](https://arxiv.org/abs/2608.18933) · [alphaxiv](https://www.alphaxiv.org/abs/2608.18933)

### TL;DR

SWE agent 進到陌生 repo 常常反覆踩同樣的坑，因為它缺專案特定知識。SkillForge 讓 agent 在碰到真 issue 前，先「自己出題自己解」——用 repo 裡有測試覆蓋的核心功能合成一批練習題，解完把學到的知識蒸成可檢索的技能。SWE-bench Verified 上 Pass@1 提升 +5.8%（DeepSeek-V3.2）。

### Read Priority

必讀 — 如果你在做程式修復 agent 或內部 coding agent 平台。它直接對準一個真實痛點：agent 換 repo 就變回新手。而且它的解法不依賴「歷史 issue 修復紀錄」（很多 repo 根本沒有），只靠 repo 本身的程式碼和測試，門檻低、可規模化。

### 領域背景

LLM agent 在自動修 bug 上已經很強，但有個結構性弱點：它們缺乏「專案特定知識」——這個 repo 的命名慣例、模組怎麼串、哪些坑是這個專案獨有的。現有的自我進化方法要嘛依賴 repo 的歷史修復軌跡（不是每個專案都有），要嘛在解每個 issue 時臨場大量探索（貴又慢）。這造成一個冷啟動困境：在累積夠知識之前，再強的 agent 進到新 repo 都只是個「通用探索者」，會反覆掉進同樣的專案陷阱。

### 中階導讀

- **問題**：想像一個很厲害的工程師空降到一個從沒看過的大型專案，第一週他不是不會寫程式，而是不知道「這個專案的規矩」——結果把時間都花在重新摸索別人早就知道的慣例上。Agent 每次換 repo 都在重演這一週。
- **方法**：SkillForge 不等真 issue 上門才學，而是**主動出題**。它從 repo 裡「有測試覆蓋的核心功能」下手，追蹤執行軌跡找出共同實作某功能的程式區塊，然後在受限脈絡下改寫它們，生出一批「可執行、且被測試驗證」的合成 issue。接著讓 SWE agent 去解這些題，從解題軌跡中蒸出兩層技能：全域的「診斷技能」（這類問題怎麼判斷）和局部的「介入技能」（具體怎麼改），並綁定到相關的程式實體上供日後檢索。
- **為什麼重要**：這把「學專案知識」從被動（等踩坑）變成主動（先自修），而且完全不需要外部標註或歷史資料。對維護內部 coding agent 的團隊，這是一條把「repo 上手成本」前置攤銷的路徑。

### 深入要點

- SWE-bench Verified：Pass@1 絕對提升 +5.8%（DeepSeek-V3.2）、+5.6%（GPT-5-mini）⚠️（作者自測，需等外部複現）
- SWE-bench Pro（更難版本）：+5.8%（DeepSeek-V3.2）、+4.1%（GPT-5-mini）⚠️（同上）
- 合成題來源：重新實作 repo 中「有測試覆蓋的核心功能」，因此生成的 issue 天然可執行、可驗證，不會產出假題
- 雙層技能庫：global diagnostic skills（診斷）+ local intervention skills（介入），皆以「程式實體」為錨點做檢索
- 開源模型和閉源模型上都有穩定增益，代表方法不綁定特定模型能力
- 程式與資料已開源（github.com/cslsolow/SkillForge），可複現性相對高
- Limitation：合成題來自「有測試覆蓋」的部分，測試覆蓋率低的 repo 能蒸出的知識可能受限

### Reviewer 一句話評

「進 repo 前先自我練習」的切入角度務實且優雅，用測試覆蓋保證合成題不失真是聰明的一招；但 +5% 上下的增益需在更多 repo、更多模型上驗證是否穩定，且對測試稀疏的老專案效果存疑。

### 給你的 take-away

- 如果你在做內部 coding agent：SkillForge 的「用 repo 自身測試合成練習題」是一條不依賴歷史資料的冷啟動解法，特別適合測試覆蓋良好、但沒有 issue 修復紀錄的內部 codebase
- 如果你在評估 agent 表現：把「專案特定知識不足」從「模型能力不足」拆開來衡量——很多 agent 在陌生 repo 的失敗其實是冷啟動問題，不是推理能力問題

---

## 論文三｜Post-Training AI：Agent 會執行，但不會改主意

### What is Missing from AI Post-Training AI: An Empirical Analysis
Joy Jia Yin Lim, Xin Huang, Hao Peng et al.（Tsinghua University · Renmin University of China）　·　arxiv: 2608.19072

連結: [arxiv](https://arxiv.org/abs/2608.19072) · [alphaxiv](https://www.alphaxiv.org/abs/2608.19072)

### TL;DR

現在的頂尖 agent 已經能端到端幫 LLM 做 post-training——寫程式、跑訓練、評 checkpoint。但分析大量公開軌跡後發現一個尷尬真相：agent 在**開場就把訓練策略鎖死**，之後整整十小時的預算全花在同一策略內的局部微調，從不推翻大方向。補經驗、補人類指導、補推理算力都沒用——缺的是「執行途中自發重估策略」的機制。

### Read Priority

必讀 — 如果你在做 self-improving agent、autonomous R&D，或任何指望 agent「自己迭代變強」的系統。這篇是今天三篇的天花板，它冷靜地告訴你：自蒸餾、技能累積這些方法（就是論文一、二在做的事）都只在「策略之內」有效，而 agent 目前跨不出策略本身。

### 領域背景

「AI 幫 AI 做訓練」（AI-for-AI）最近很熱：PostTrainBench 證明了頂尖 agent 能端到端完成 LLM 的 post-training 並實際提升下游表現。但這篇論文指出，大家把兩種截然不同的能力混為一談了——**執行層能力**（在選定策略內迭代：修 bug、調超參、整理資料）和**策略層能力**（隨著實驗證據累積，回頭修正「該試什麼」的高層判斷）。前者 agent 已經很強，後者是這篇要拷問的。

### 中階導讀

- **問題**：想像你請一個很勤奮的研究員做實驗。他選定一個方向後就埋頭苦幹十小時——不斷修程式、調參數、跑更多實驗，效率極高。但無論結果怎麼暗示「這個方向本身可能錯了」，他從不停下來問「我是不是該換個策略？」。今天的 agent 就是這樣的研究員。
- **方法**：作者分析 PostTrainBench 上的公開軌跡（涵蓋 7 個 benchmark、4 個基礎模型、20 種 agent 配置），發現策略在寫第一行程式前就鎖定了，且**鎖定的是 agent 自己的偏好而非任務需求**——80.7% 的 Claude Code 軌跡收斂到全參數 SFT，89.6% 的 Codex CLI 軌跡收斂到 PEFT，同一個任務兩個 agent 卻系統性地選不同路。接著他們用三種遞進式介入測試「缺什麼」：補經驗（scaffold）、補人類指導、補推理算力。
- **為什麼重要**：三種介入全都只改善執行、改不動策略。這代表現在所有「讓 agent 自我進化」的方法都有一個共同天花板——它們能讓 agent 在既定策略裡跑得更好，卻無法讓它跳出錯誤的策略。一個 agent 可以在錯誤的方向上高效迭代十小時以上。

### 深入要點

- 分析規模：PostTrainBench 上 7 個 benchmark、4 個基礎模型、20 種 agent 配置的公開軌跡
- 策略鎖定反映 agent 先驗而非任務：80.7% Claude Code 軌跡收斂到全參數 SFT，89.6% Codex CLI 收斂到 PEFT ⚠️（論文對公開軌跡的統計）
- 介入一（補經驗）：實驗日誌 + 技能庫 + 評估 agent 的 scaffold 讓執行全面提升——GSM8K +12.6 分、HumanEval +40.8 分，但策略紋風不動 ⚠️（作者實驗）
- 介入二（補人類指導）：人類在訓練前重寫策略確實有效，但訓練一開始 agent 就退回局部微調的迴圈
- 介入三（補推理算力）：scaffold 版比自主基準多花 2–8 倍 inference tokens，簡單任務有回報，最難的任務幾乎零增益
- 核心結論：缺的不是資源（經驗/指導/算力），而是「執行中自發重啟策略選擇」的機制——策略只在「第一次訓練開始前」的短窗口內可塑
- 落地啟示：把「策略修正」設計成一個明確、有獎勵的動作，可能比把模型做得更大更有效

### Reviewer 一句話評

把「執行層 vs 策略層」拆開來看是很有洞察力的框架，三種遞進介入的實驗設計也扎實、有說服力；但研究限定在 LLM post-training 這一個任務域，「策略鎖定」是否普遍存在於所有長程 agent 任務仍待驗證——不過作為一記清醒劑已經足夠。

### 給你的 take-away

- 如果你在做 self-improving / autonomous agent：別再指望「多給經驗、多給算力」能讓 agent 跳出錯誤方向——先想清楚你的系統有沒有一個「強制重估大方向」的機制，這才是天花板所在
- 如果你在部署長程 agent 任務：在關鍵決策點插入人類 review 或明確的策略檢查點，因為 agent 一旦開跑就會鎖死方向、把預算燒在局部優化上

## 今日收穫

之前以為「讓 Agent 從經驗中自我進化」是一條連續的斜坡——給越多軌跡、越多算力，它就越接近能自主研究。今天發現這條路上有一道看不見的牆：Agent 可以自蒸餾（DART-SD）、可以預先累積技能（SkillForge）、可以在既定策略裡高效迭代，但這些全都發生在「策略之內」。真正卡住的是「執行到一半，自己推翻大方向」這個動作——而 Post-Training AI 那篇證明了，補經驗、補指導、補算力都撞不開這道牆。原來 Agent 缺的不是更多資源，而是一個「懷疑自己」的機制。

## 參考資料

- DART-SD 論文：[arxiv 2608.18524](https://arxiv.org/abs/2608.18524)
- SkillForge 論文：[arxiv 2608.18933](https://arxiv.org/abs/2608.18933)、[開源程式碼](https://github.com/cslsolow/SkillForge)
- What is Missing from AI Post-Training AI 論文：[arxiv 2608.19072](https://arxiv.org/abs/2608.19072)
- PostTrainBench（論文三分析對象的基準）：[arxiv 2603.08640](https://arxiv.org/abs/2603.08640)
