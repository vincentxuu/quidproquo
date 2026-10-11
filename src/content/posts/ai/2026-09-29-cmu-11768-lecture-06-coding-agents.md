---
title: "CMU 11-768 導讀 L6：Coding Agents——從補一行程式到修完整個 repo"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, coding-agent, benchmark, rlvr]
lang: zh-TW
series:
  name: "CMU 11-768 AI Agents 導讀"
  order: 6
tldr: "Neubig 的 L6 把 coding agent 拆成三層：先把模型訓練成會寫程式（預訓練、中訓練、infilling、測試獎勵的 RL），再用 localize–edit–verify 迴圈和一套編輯工具讓它改 repo，最後用 SWE-bench 類的可執行環境評測與訓練；修 bug 只佔開發者一天的 15%，下一步是測試、CI、維護這些外迴圈任務。"
description: "導讀 CMU 11-768 第六講 Coding Agents：程式模型的預訓練資料與 tokenizer、中訓練配比與長上下文、infilling、BLEU 到執行測試的評測演變、pass@k、localize–edit–verify 迴圈、bash-only 與編輯工具格式的取捨、SWE-bench 與 SWE-Gym／SWE-smith 等訓練環境、多 harness 訓練、前端驗證、外迴圈任務與程式行為預測模型。"
draft: false
glossary:
  - term: "infilling"
    aliases: ["fill-in-the-middle", "FIM", "填空"]
    definition: "讓模型根據一段程式的前文和後文，生成中間缺的那一段。"
    advanced: "訓練時把中間片段挪到序列尾端並用哨兵 token 標位置，推論時就能用一般的由左到右生成完成填空。"
    context: "L6 用 InCoder 說明：看得到函式本體，才猜得對回傳型別。"
  - term: "pass@k"
    definition: "對同一題取樣 k 份程式，至少一份通過全部測試的機率。"
    advanced: "HumanEval 論文用取樣 n 份、其中 c 份正確的無偏估計量 1 − C(n−c,k)/C(n,k) 計算。"
    context: "單步程式生成最常見的評分方式。"
  - term: "SWE-bench"
    definition: "拿真實 GitHub issue 當題目、用該 PR 相關測試評分的 repo 層級修 bug 基準。"
    advanced: "評分分兩組測試：FAIL_TO_PASS 檢查修好了沒，PASS_TO_PASS 檢查有沒有弄壞原本的功能。"
    context: "L6 後半的評測與訓練環境幾乎都沿用它的題目格式。"
---

> 🌏 [English version](/en/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) 第六講是 Domains 模組的第一堂（系列入口見[課程總覽](/posts/ai/2026-09-29-cmu-11768-course-overview)），主題是 coding agent，由 Graham Neubig 主講。他開場就說，台下多數人每天都在用 coding agent，所以不需要介紹它能做什麼；這堂要講的是**怎麼做出一個**，以及背後需要什麼。

他把「會寫程式的 AI」分成三個層次：寫出一段程式（單次補全）、改一個 repo（同時動多個檔案）、做完整的軟體開發（需求、實作、審查、部署、維護的整個生命週期）。任何 agent 都有三個原料——prompt、工具、LLM。prompt 在前幾堂（[L4 Skills and Memory](/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory) 與 [L5 Planning](/posts/ai/2026-09-29-cmu-11768-lecture-05-planning)）已經談過，這堂專注在後兩者：模型怎麼學會寫程式，agent 又該拿什麼工具。

這篇照課堂順序走七段：程式模型的訓練、生成程式的評測、agentic coding 的迴圈、工具組設計、coding agent 的評測與訓練、前端開發、inner loop 之外的開發任務。最後一段「預測程式行為的模型」課堂上時間不夠沒講，本篇依投影片補上。

## 課程影片來源

已核對 CMU 11-768 Fall 2026 第 6 講的公開錄影；影片由課程教師 Graham Neubig 的頻道發布，影片標題與說明對應本課程。

```youtube
url: https://www.youtube.com/watch?v=1BWeH1oOM7k
title: CMU AI Agents 2026: 6. Agents for Coding and Software Development
```

原始影片：[CMU AI Agents 2026: 6. Agents for Coding and Software Development](https://www.youtube.com/watch?v=1BWeH1oOM7k)

官方來源：

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：通讀全程字幕（約 79 分鐘），逐項核對文章轉述的 Neubig 說法與課堂問答：單步模型三能力、預訓練與資料清洗（StarCoder、授權、truffleHog）、tokenizer 與空白、語言偏好（Python／React）、中訓練（Code Llama、Qwen2.5-Coder 配比與 YaRN 長度）、infilling、diff／CI／執行軌跡資料、BLEU 到執行評測與測試品質問題、效率與註解問答、localize–edit–verify、Agentless、bash 單工具與 85–90% 工具呼叫的回答、search/replace 格式與 Gemini 編輯格式問題、SWE-bench 與 SWE-Gym／SWE-smith／持續更新的資料集、多 harness 訓練、前端與 GLM 5.2 的觀察、外迴圈任務與微軟 15% 調查、結尾沒講完 code world model；皆有依據。修正兩處：「InCoder 允許 token 跨空白、少約 40%」是台下另一人回答、Neubig 複述，不是 Neubig 自己的說法；Agentless 第一作者在字幕裡被稱為 assistant professor（非 associate）。逐篇論文的精確數字（EvalPlus、AlphaCode、Aider 等）屬論文，字幕未涵蓋。

## 一、會寫程式的模型

先講單步模型：給一個 prompt，一次吐出程式，還不是 agent。要做到這件事，模型需要三種能力：懂程式語言本身（語法、API、慣用寫法）、會**編輯**（同時參考前後文修改程式，而不是每次重寫）、會**推理**（從規格推到行為）。Neubig 特別點出推理：程式和數學是推理模型最成功的兩個應用，因為兩者都相對容易驗證答案對不對。

他也提醒，今天沒有哪個語言模型不會寫程式，因為程式是最有價值的使用情境之一，但這個能力不是白來的。訓練分三段：預訓練、中訓練、RL 後訓練。

### 預訓練：資料、清洗、tokenizer

預訓練就是一般的下一個 token 預測，差別在資料。程式模型要混入網頁文字、技術文章、數學、原始碼與文件——只餵程式不行，因為使用者用英文（或中文）下指令。投影片在這段列了 [OLMo](https://arxiv.org/abs/2402.00838)，它公開的預訓練資料 Dolma 就是這種混合：約 2.67T token 裡，GitHub 程式碼約 342B，其餘是網頁、Reddit、論文、書籍與維基百科（OLMo 論文 Table 2）。資料處理要**保留結構**：縮排、檔案邊界、API、文字與程式的對應關係。Neubig 舉了一個舊做法當反例：早年會把連續空白正規化成一個空格，這對 Python 是災難，因為縮排本身有語意。

資料清洗的細節大多引自 [StarCoder](https://arxiv.org/abs/2305.06161)（Daniel Fried 是作者之一）：

- **依語言與來源過濾**：自動產生的檔案、編碼壞掉的檔案、低價值的重複內容都丟掉。
- **去重**：GitHub 上一個專案可能有成千上萬個 fork，還有被整包 vendor 進來的第三方函式庫，不去重就會嚴重偏斜。
- **記錄來源**：授權、日期、退出請求（opt-out）、敏感資料過濾。他講得很直白：用了專有授權的程式碼訓練、模型賺了大錢，對方兩年後可能找上門；要不要在意是你的決定，但一定要做決定。敏感資料方面，常有人把 API key 推上 repo，可以用 TruffleHog 這類工具掃掉。
- **防洩漏**：依 repo 或題目家族切分訓練與測試集，並對評測題做去汙染。

tokenizer 也要為程式調整。原則有兩條：保留空白（空格、tab、換行都承載語法），並把高頻的空白串壓成單一 token，不然 16 格縮排就要花 16 個 token。投影片展示了 [StarCoder2 tokenizer](https://huggingface.co/bigcode/starcoder2-3b/blob/main/tokenizer.json) 實際把 `↵····return` 切成「換行加三格空白」與「空格加 return」兩個 token。本文下載這份 tokenizer 實測，結果相同；換行加 16 格縮排也只佔一個 token。

課堂上有人問要不要讓 token 跨越空白合併。台下有人（字幕沒標說話者，從內容看應是做過 InCoder 的 Fried）回答可以，InCoder 就這樣做過，Neubig 複述了這個答案（口頭說少約 40%；[InCoder 論文](https://arxiv.org/abs/2204.05999)附錄 A.4 的數字是：允許 token 跨空白（換行除外）後，編碼訓練語料所需的 token 數比 GPT-2 的 byte-level BPE 少 45%）；但會出怪錯。例如 `import numpy as np` 可能變成單一 token，使用者停在 `import numpy as` 時模型就補不下去，得回溯或做約束解碼。

語言選擇也是預訓練的決定。StarCoderBase 是 15.5B 參數、1T token、80 多種語言，結果符合直覺：資料越多的語言表現越好。他順帶聊到模型的語言偏好——不指定語言時，做儀表板會給你 React，其他幾乎都是 Python。他自己把資料管線改寫成 Rust 之後，模型下一次寫新程式還是回到 Python，得一直提醒。他推測原因有二：Python 簡潔好寫，而且 RL 階段多半是用 Python 直譯器訓練的。

### 中訓練：加程式、調配比、拉長上下文

中訓練是把一個通用模型接著訓練成程式模型。[Code Llama](https://arxiv.org/abs/2308.12950) 拿 Llama 2 再訓練 500B token，做出 7B／13B／34B 三個尺寸（論文後來的版本另加 70B，那個尺寸訓練了 1T token）。配比要靠實驗決定：[Qwen2.5-Coder](https://arxiv.org/abs/2409.12186) 試過全部餵程式，程式分數還行（49.8），但 MATH 只剩 10.3、MMLU 42.8；改成程式、文字、數學 70／20／10 之後，程式分數只掉一點（48.3），MATH 和 MMLU 則回到 33.2 與 62.9。註：投影片把全程式那列的 MMLU 標成 23.8，但論文 Table 3 裡 23.8 是 GSM8K 欄，MMLU 是 42.8，這裡依論文。今天沒有人會只拿模型寫程式，所以通用能力不能丟。

長上下文是程式模型的特殊需求，因為你想從整個 codebase 拿脈絡。最天真的做法是把 repo 所有檔案接起來，但多數正常規模的 codebase 都超過一百萬 token，Google 的 monorepo 據說有數十億行。比較好的做法是依目錄或依賴圖，把彼此相關的檔案串成一段訓練序列。Qwen2.5-Coder 從 8K 訓練到 32K，再用 YaRN 推到 128K（位置編碼外推在 [L3 Context Management](/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management) 講過）。驗證方式是跨檔補全、填空，以及確認短上下文能力沒退步。

### Infilling：同時看前文和後文

這段是 Daniel Fried 的 [InCoder](https://arxiv.org/abs/2204.05999) 工作。問題很具體：`def is_positive(x: int) -> ____:`，要填回傳型別。一般由左到右的模型只看得到空格左邊，只能從函式名稱猜 `bool`；但右邊的函式本體 `return x > 0` 才是真正的證據。

做法出乎意料地簡單：把填空改寫成由左到右的任務。訓練時把中間片段挪到尾端，原位置換成哨兵 token：`prefix [M0] suffix [M0] span [END]`。推論時餵 `prefix [M0] suffix [M0]`，模型就會生成缺的那段。要挖幾個洞、挖多長，從長尾分佈抽——大多一個，偶爾兩三個。學會之後，補中段程式、推型別、寫註解、改變數名都是同一種任務。

效果很明顯。在 HumanEval 改出來的填空題上（論文 Table 1，InCoder-6.7B），由左到右單一候選的單行／多行通過率是 48.2%／24.9%；產生十個候選再用後文重排，提升到 54.9%／28.2%；直接用 infilling 生成則到 69.0%／38.6%。而且這不是取捨：在相同 52B token 預算下（論文 Table 5 的 1.3B 消融），用 causal masking 目標訓練的模型，一般補全的 HumanEval 和 MBPP 反而還比純由左到右高一點。同期 OpenAI 也有 [FIM 的 scaling 研究](https://arxiv.org/abs/2207.14255)。

### 其他可以學的訊號

程式領域的訓練資料可以很有創意：

- **commit diff**：修改前的程式加 commit 訊息，預測修改後的版本或 diff，用來訓練編輯能力（[OctoPack](https://arxiv.org/abs/2308.07124)，整理出 350 種語言、4TB 的 commit 資料集 CommitPack）。
- **診斷訊息**：壞掉的程式加編譯器錯誤訊息，預測修復（[DrRepair](https://proceedings.mlr.press/v119/yasunaga20a.html)）。Neubig 問台下這種資料哪裡免費拿得到，答案是 CI：GitHub 上公開保存了大量「這版跑失敗、下一版修好並合併」的紀錄。
- **測試結果**：程式加單元測試結果當 RL 獎勵，另訓練一個 critic 預測程式對不對（[CodeRL](https://arxiv.org/abs/2207.01780)）。
- **執行軌跡**：程式與實際執行到的行數、變數狀態（[CodeExecutor](https://aclanthology.org/2023.findings-acl.308/)），這條會接到最後一段的程式世界模型。

## 二、怎麼評分模型寫出來的程式

### 比對參考答案

最早的做法是拿人寫的參考解比對。Neubig 2017 年的 [程式生成論文](https://aclanthology.org/P17-1041/) 就用 exact match 與 BLEU。問題很明顯：參考解是 `return x > 0`，模型寫 `return x >= 0` 只差一個 token，行為卻錯了（x = 0 時）；寫 `return not (x <= 0)` 字面差很多，對整數卻完全等價。

後來的改良有兩條路。[CodeBLEU](https://arxiv.org/abs/2009.10297) 保留 BLEU 的 n-gram 比對，再加比語法樹與資料流（變數從哪裡來）。[CodeBERTScore](https://aclanthology.org/2023.emnlp-main.859/) 則把兩段程式的每個 token 轉成上下文向量，找彼此最相近的配對，算 precision、recall 與 F 分數。

### 直接執行

今天主流是直接跑：候選程式放進隔離環境、設時間與記憶體上限、跑測試，全過就算對。優點是接受各種正確寫法，也抓得到語意錯誤。缺點 Neubig 講得很多：

- **測試品質難做**。每個知名 benchmark 都有一篇論文在抱怨它的測試（例如 [EvalPlus](https://arxiv.org/abs/2305.01210)：把 HumanEval 的測試擴充 80 倍，各模型的 pass@k 最多掉了 19.3–28.9%）。[AlphaCode](https://arxiv.org/abs/2203.07814) 論文也抽 50 題人工檢查過，HumanEval 通過的解有 30% 其實是錯的，CodeContests 補上生成的測試後降到 4%（Table 2）。測試太鬆會放過錯誤實作（false positive）；測試檢查了題目沒講的東西會冤枉正確實作（false negative）。他舉的例子是：題目要「右上角放一顆 learn more 按鈕」，測試卻檢查了按鈕背景色。任務越複雜，兩種錯誤都越難壓低，這是今天訓練 coding agent 最大的挑戰之一。
- **需要可信的依賴與隔離環境**。通常用 Docker 裝好依賴，但函式庫版本一更新，測試就壞，新模型反而因為舊測試被扣分。
- **需要時間與穩定環境**。大型 repo 跑一次完整測試可能要好幾分鐘。

單步生成的經典基準是 [HumanEval](https://arxiv.org/abs/2107.03374)（164 個 Python 函式，給 docstring 補完，藏有單元測試；今天已經被刷爛）和 [CodeContests](https://arxiv.org/abs/2203.07814)（AlphaCode 團隊整理的競賽題，要寫整支程式；驗證與測試集全部取自 Codeforces，訓練集另混入 Description2Code 與 CodeNet）。Neubig 提醒，很少人類能第一次提交就 100% 通過 Codeforces 題，而這正是我們對單步模型的期待。HumanEval 論文裡的模型也叫 Codex，是 2021 年 GitHub 補全功能背後那個，不是今天的 Codex。

常見指標是 pass@k：取樣 k 份，至少一份通過的機率。

<details>
<summary>pass@k 的無偏估計</summary>

直接取樣 k 份算「至少一份對」的變異很大。HumanEval 論文的做法是每題取樣 n ≥ k 份，數出其中 c 份通過，再算：

pass@k = E[ 1 − C(n−c, k) / C(n, k) ]

也就是「從 n 份裡隨機挑 k 份，全部都錯」的機率，拿 1 減掉。

</details>

### 非功能需求

有學生問訓練時怎麼考慮效率。Neubig 說單步任務幾乎只在乎對不對，例外之一是 [NoFunEval](https://arxiv.org/abs/2401.15963)：投影片引的 397 題是其中的程式編輯子集 NoFunEdit（整個基準共 958 題，另有兩個分類子集），評估「改快一點」「改得好維護」「改得安全」這類要求。評法依類別不同：執行時間類用測試確認正確再比平均執行時間，延遲與資源類比對參考修改（DiffBLEU），可維護性與安全類再乘上 CodeQL 靜態檢查的結果。agent 任務則比較常把效率算進去。

### 用測試結果做 RL

單步模型的標準訓練法是：取樣答案、跑測試、通過就給獎勵、更新模型。從 RL 角度看沒什麼特別，但它正是訓練推理模型的關鍵。投影片的例子是算 1 + … + n、n 最大到 10¹²：逐一加總太慢，想起公式卻抄錯成 `n * (n - 1) // 2` 在 n = 1 就錯，只有推導並檢查邊界的 `n * (n + 1) // 2` 又對又快。競賽題常有時間限制，超時就沒分，效率也就被間接訓練進去。[DeepCoder](https://www.together.ai/blog/deepcoder) 在 RL 期間把回應長度上限從 16K 拉到 32K，評測時再給到 64K，在 LiveCodeBench 上接近 o3-mini。

課堂上還有兩個問答值得記。為什麼模型愛寫註解？Neubig 強調只是推測：一是訓練資料本來就有註解；二是推理訓練可能隱性鼓勵多吐 token 換取思考空間；三是現在的程式品質獎勵模型會要求「適量」註解，因為上一代模型的一大抱怨是註解太囉嗦。怎麼訓練出人類好讀的程式？做法是訓練一個評程式品質的獎勵模型（可讀性可以從人工標註學），放進 RL 的獎勵。

## 三、Agentic coding：localize、edit、verify

單步和 agentic 的差別在於後者會反覆呼叫工具。最常見的情境是在 GitHub repo 修 bug 或加功能，流程分三步，並且是迴圈：

1. **Localize（定位）**：找出要改的地方。
2. **Edit（編輯）**：改它。
3. **Verify（驗證）**：確認真的改對了；驗證失敗就修正假設，回到前面。

投影片用一個小例子貫穿：設定裡的 `retries` 設成 0，結果變成 3。定位階段用 `rg 'retries'` 找到 `return config.get("retries") or 3`，再跑單元測試重現 `AssertionError: 3 != 0`，看出原因是 0 是 falsy。重點是「修條件，不是修測試」。編輯成 `3 if value is None else value`，最後跑整組測試，確認 missing、None、zero、positive 四種情況都過，沒有引入回歸。

Neubig 也介紹了不用 agent 的替代路線 [Agentless](https://arxiv.org/abs/2407.01489)（第一作者是 Chunqiu Steven Xia。Neubig 課堂上說他是 CMU 新進的 assistant professor，與 [CMU 計算機學院 2026 新進教師名單](https://scsbusinessoffice.cs.cmu.edu/new-faculty/2026.html)列的 Software and Societal Systems Department Assistant Professor 一致）：固定的三段流程——先預測要改哪些檔案，再縮到類別與函式，再縮到具體行，最後用單步模型生出 patch。他說這條路線有一段時間出奇地有效，他當時在做 coding agent，看到不少模型用這套固定流程反而比 agent 好。原因是模型被大量訓練去做單步解題，卻還沒被好好訓練去做工具呼叫與驗證迴圈。現在大家都用 agent 了，但這段歷史說明：**agent 的優勢要靠模型訓練撐起來**。

## 四、工具組：只給 bash 夠不夠

最精簡的答案是只給一個工具：執行 bash。[mini-SWE-agent](https://mini-swe-agent.com/latest/)（SWE-bench 團隊做的）就是這樣：`rg`、`cat`、`find` 負責定位，`sed`、Python 腳本、`patch` 負責編輯，`pytest` 或建置指令負責驗證。理論上這就夠了。

那為什麼不理想？台下學生的回答被 Neubig 採用：85–90% 的工具呼叫是讀檔和改檔，把它們包成專用工具，agent 就不必每次都想「這次用 sed、Python 還是 patch」。sed 碰到一堆反斜線要逐個跳脫，行號也得猜，bash 真的不是好的改檔介面。所以幾乎所有有競爭力的 coding agent，都至少多加一個檔案編輯工具。[SWE-agent](https://arxiv.org/abs/2405.15793) 的消融實驗量過這件事：SWE-bench Lite、GPT-4 Turbo，只能用重導向或 sed 改檔時解決 10.3%，換成附 linter 檢查的 edit 指令是 18.0%（論文 Table 3）。

編輯工具的格式有幾種：

| 格式 | 做法 | 取捨 | 例子 |
|---|---|---|---|
| 整檔覆寫 | 送出整個新檔案 | 簡單，但重複送出沒改的內容 | Pi write、OpenCode write、OpenHands create |
| Search / Replace | 送出舊字串和新字串 | 精簡，但舊字串必須唯一 | OpenHands、Pi、OpenCode 的 edit |
| Unified diff | 標準 diff，含行號 | 模型常把行號算錯 | Aider 省略 hunk 行號的變體 |
| 檔案操作 patch | Codex 的 `*** Begin Patch` 語法：`*** Add/Delete/Update File` 標出檔案操作，`@@` 後接上下文而非行號（見 [parser.rs](https://github.com/openai/codex/blob/16ff14c266179e6a762dc8081e9dab73a96683e0/codex-rs/apply-patch/src/parser.rs) 的文法） | 介於兩者之間 | Codex、部分 OpenCode／OpenHands preset |

Neubig 問台下 search/replace 的缺點，答案是：如果檔案裡有兩處 `RETRIES = 3`，就對不到唯一位置，agent 得多帶幾行上下文直到不含糊。但它的好處遠大於這個缺點，所以幾乎所有 coding agent 都用它。

格式影響可以非常大。[Aider 的實驗](https://aider.chat/docs/unified-diffs.html) 用 89 個 Python 重構任務測 GPT-4 Turbo：search/replace 成功率 20%，簡化版 unified diff 61%。原因是那個模型在訓練資料裡看過更多 diff。Neubig 說這個結果今天不那麼直接適用，但原則沒變；他也提到，Gemini 直到最近在很多工具裡表現都不好，他認為原因是它用自己的一套編輯格式訓練，近幾個月才改善。訓練格式這個原因是講者的說法，本文找不到一手來源；查得到的旁證是 [Aider 的編輯格式文件](https://aider.chat/docs/more/edit-formats.html)：Aider 為 Gemini 系列另做了 `diff-fenced` 格式，因為這些模型常常不照 `diff` 格式要求的圍欄寫法輸出。**模型訓練時看過的格式，就是它最會用的格式**——這條會在下一節的多 harness 訓練再出現。

定位方面，起點永遠是搜尋症狀（ripgrep 最常用），再追值的流向：zero 第一次在哪裡被讀進來？又在哪裡變成 3？更進階的做法像 [LocAgent](https://arxiv.org/abs/2503.09089)，給 agent 一個沿依賴圖做多跳搜尋的工具（TraverseGraph）：從 `config.py` 直接跳到呼叫它的 `client.py` 與測試（這個例子是投影片的）。Neubig 的經驗是，這類方法很難穩定贏過簡單的搜尋；LocAgent 論文自己報告的則是檔案層級定位準確率最高 92.7%，兩邊的評價並列供參考。

## 五、評測與訓練 coding agent

### SWE-bench

最主流的基準是 [SWE-bench](https://arxiv.org/abs/2310.06770)。題目取自 GitHub issue：repo 停在該 issue 對應 PR 送出前的狀態，agent 產生 patch，套上後跑測試。因為 Django、NumPy 這類 repo 跑完整測試一題就要五到十分鐘以上，SWE-bench 只挑相關的子集，分兩組：

- **FAIL_TO_PASS**：PR 前失敗、PR 後通過，檢查要求的修復有沒有做到。
- **PASS_TO_PASS**：PR 前後都要通過，檢查有沒有弄壞原本的功能。

Neubig 特別提醒一個用詞陷阱：SWE-bench 說的「harness」指的是**評測用的測試執行環境**，不是這門課說的 agent harness。

### 可執行的訓練環境

一個可執行的題目需要三樣東西：起始狀態（檔案、依賴、測試指令）、問題描述（要求的行為與重現方式），以及檢查（修之前失敗、修之後恢復）。能大量產出這種題目，就能拿它做 RL。收集訓練軌跡前要先驗證環境本身是好的。

- [SWE-Gym](https://arxiv.org/abs/2412.21139)（Neubig 團隊）：把 SWE-bench 從純評測集擴充成訓練環境，讓原本很弱的 32B 模型明顯進步；再加上多次取樣、用學到的 verifier 挑答案，推論時多花算力還能再往上。
- [R2E-Gym](https://arxiv.org/abs/2504.07164)：多步修 bug 的 RL。搜尋、編輯、測試都是訓練目標，但獎勵只在最後給「修好沒」。投影片點出這個設計的代價：**最後失敗時，你不知道是前面哪一步決策錯了**（credit assignment 問題，[L9 RL Basics](/posts/ai/2026-09-29-cmu-11768-lecture-09-rl-basics) 會展開）。
- [SWE-smith](https://arxiv.org/abs/2504.21798)：每題都要一個真實 PR 太貴，改成人工注入 bug。準備能跑的 baseline、只改程式不改測試、保留會讓測試失敗的變異。例子是把 `if value is None` 改回 `if not value`，四個測試變成三過一失敗。靈感接近軟體工程的 mutation testing。好處是幾乎能無限產生資料，缺點是這些 bug 不一定像真實世界會遇到的。
- 跨語言：[Multi-SWE-bench](https://arxiv.org/abs/2504.02605) 與 [SWE-bench Multilingual](https://www.swebench.com/multilingual.html) 把格式擴到其他語言。唯一的麻煩是各語言慣例不同（`pyproject.toml`／`package.json`／`Cargo.toml`，`pytest`／`npm test`／`cargo test`），好在現在的 coding agent 自己就很會處理。

Neubig 還口頭提到一個投影片沒放的持續更新型 SWE-bench 資料集，會不斷從新 PR 產生新環境，分訓練集與開發集，是目前公開資料裡規模最大的；逐字稿裡名稱不清楚，這裡不指名。

### 多 harness 訓練

前面說過，模型預期的編輯格式和 harness 提供的不一樣時，表現會變差。所以現在的模型開發者常在**多個 harness** 上一起訓練。投影片給了一個精確定義：

> Harness = prompts + tools + agent loop + context management

同一組權重分別接上 OpenHands、OpenCode、Codex 等 harness，任務檢查都用「patch → 測試 → 獎勵」，把所有軌跡與獎勵一起拿來更新模型。例子有 [Nemotron 3 Super](https://arxiv.org/abs/2604.12374)（做法是在 OpenHands 裡實作 OpenCode 與 Codex 的 agent 類別，同一個 harness 換工具與 prompt）與 [Nemotron 3 Ultra](https://arxiv.org/abs/2606.15007)（每類任務至少在兩個 harness 上訓練），以及 [Polar](https://arxiv.org/abs/2605.24220)（讓原生 harness 透過共用的模型 API proxy 呼叫同一個模型）。這個定義正是下一篇 [Assignment 1](/posts/ai/2026-09-29-cmu-11768-assignment-1-harness) 要你親手做的東西。

## 六、前端開發

前端是 issue 修復之外很重要、研究卻比較少的一塊。[SWE-bench Multimodal](https://arxiv.org/abs/2410.03859) 專做視覺化、面向使用者的 JavaScript 軟體的 bug 修復（不是從零做新頁面）：617 題，取自 17 個網頁介面、圖表、資料視覺化、語法高亮與地圖函式庫，每題的問題描述或測試至少含一張圖。多模態帶來兩個差別：模型要看得懂輸入裡的截圖，驗證也要換方法。

驗證有兩條路：

- **瀏覽器 agent**：模型每一步觀察畫面、決定下一個動作，適合探索（下一講 Computer Use Agents 的主題；評測這類多模態網頁 agent 的代表基準是 [VisualWebArena](https://arxiv.org/abs/2401.13649)，910 題，第一作者就是 L7 講者 Jing Yu Koh）。
- **Playwright 腳本**：模型寫一份可重複執行的檢查，`fill()`、`click()`、`expect()`、`screenshot()`，適合固定流程（見 [Playwright assertions](https://playwright.dev/docs/test-assertions)）。

投影片的例子是聯絡人表單接受純空白姓名：把 `value.length` 改成 `value.trim().length`，然後分兩面驗證——行為上空白名字存不進去、正常名字照存；外觀上錯誤訊息清楚出現在欄位旁（Playwright 可以用 `toHaveScreenshot()` 對基準截圖做像素比對，見 [Playwright snapshots](https://playwright.dev/docs/test-snapshots)）。評分時要注意：**issue 裡附了圖，不代表評分規則是比圖片相似度**。SWE-bench Multimodal 仍然用 repo 的測試評 patch；其中 69 題的測試本身是視覺測試，渲染頁面後逐像素比對截圖，比的是渲染結果，不是 issue 附圖。

Neubig 也坦白一個讓他動搖的觀察：幾個月前，不能讀圖的 GLM 5.2 在 Design Arena 拿了第一。[Design Arena 2026 年 6 月 19 日的說明](https://notes.designarena.ai/how-glm-5-2-beat-fable-5-at-website-design)寫得更精確：GLM 5.2 是在單輪、非 agentic 的 HTML Web Design 評測排總榜第一，模型沒有視覺能力；之後的榜首已經換過。他仍然認為多模態很重要，但這提醒我們，好的前端 agent 需要什麼，還沒有定論。

## 七、Inner loop 之外

到這裡講的都是 **inner loop**：改、測、修的迭代。**outer loop** 是其他一切：需求、code review、部署與監控、維護。它們更難定義，也更難找到訓練資料。

投影片引了微軟 [Meyer 等人 2019](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/04/devtime-preprint-TSE19.pdf) 對 5,928 個自評工作日的調查：開發者一天花在讀寫程式與測試上的時間約 15%，會議加 email 佔 25%，除錯 14%，跑測試 8%，需求與文件 6%，code review 5%。也就是說，修 bug 只是開發工作的一小片。

Neubig 用一張表比較不同開發任務：產出物、環境與驗證器、時間跨度都不同。

| 任務 | 產出 | 驗證 | 跨度 | 例子 |
|---|---|---|---|---|
| 定位 | 預測的檔案、模組、函式 | 對照 gold patch 位置的 F1 | 一個 issue | [CodeScout](https://arxiv.org/abs/2603.17829)（RL 訓練搜尋 agent，Neubig 推薦當小模型專題） |
| 做 app | 新 app 或延伸既有 MVP | LLM 評測器照人寫的測試計畫操作瀏覽器 | 多個功能 | [ViBench](https://vibench.ai/)：從零做、延伸參考 MVP、延伸自己上一輪的 MVP |
| 實作函式庫 | 整個套件 | 套件測試，或與參考執行檔行為一致 | 很多函式 | [Commit0](https://arxiv.org/abs/2412.01769)、[ProgramBench](https://arxiv.org/abs/2605.03546)（給執行檔與文件，要重寫出行為一致的程式碼） |
| 持續演進 | 累積的修改 | 里程碑與回歸測試 | 相依任務串 | [SWE-Milestone](https://arxiv.org/abs/2603.13428)：單題 80% 以上，連續做降到 38% |
| 產生測試 | 新測試 | 能分辨有 bug 與修好的版本 | 一個行為 | [SWT-Bench](https://arxiv.org/abs/2406.12952) |
| CI 修復 | 程式或設定 | 把修正推上 GitHub，重跑原本失敗的 Actions workflow | 一次建置 | [JetBrains LCA CI Builds Repair](https://huggingface.co/datasets/JetBrains-Research/lca-ci-builds-repair)（目前只有 Python） |

其中兩點 Neubig 特別強調。ProgramBench 這類長程任務變難，是因為短程任務已經變簡單了；而測試生成是半場勝利：**如果你能寫出好的測試來確認問題解決了，agent 就會非常擅長對著它反覆迭代**。部署類任務他認為還沒有好的基準，因為需要真實基礎設施。

最後是遷移：能不能用多種任務訓練，讓 agent 在沒見過的任務上也變強？[SWE-Playground](https://arxiv.org/abs/2512.12216) 與 [Hybrid-Gym](https://arxiv.org/abs/2602.16819)（兩者都有 CMU 團隊參與）自動產生定位、依賴搜尋、函式實作等練習任務。Hybrid-Gym 的 32B 模型在沒訓練過的 SWE-bench Verified 上從 7% 升到 32.4%，SWT-Bench 與 Commit0 Lite 也都上升。

## 八、預測程式行為的模型（依投影片）

這段課堂上時間不夠沒講，以下依投影片整理。

一般 agent 的 policy 根據歷史選動作，然後真的去跑，觀察結果。**世界模型**多一步：先預測「如果我跑這個測試，會得到什麼」。預測可能出錯，例如把 `alias = items` 當成複製，就會誤判 `alias.append(2)` 之後 `len(items)` 的值。

預測能幫上忙的情境，是在兩個候選修復之間做選擇，不必兩個都真的跑。風險也在這裡：模型說正確的 A 會失敗、錯誤的 B 會通過，你就丟掉了對的那個。所以評估時要同時看任務成功率與總成本（延遲、token、工具呼叫次數）。代表工作是 Meta FAIR 的 [CWM](https://arxiv.org/abs/2510.02387)（從程式執行軌跡學習的開放權重模型）與 [Code World Models / GIF-MCTS](https://arxiv.org/abs/2405.15383)。

投影片留下四個開放問題：預測真的讓決策變好嗎？有算進延遲和真實環境呼叫之後，真的比較省嗎？換成沒看過的程式、依賴和環境還準嗎？什麼時候該放棄預測、直接執行？

## 怎麼做：拿自己的 coding agent 對一次帳

1. **挑一個你修過的 bug，寫成 SWE-bench 格式**：記下修之前的 commit、issue 描述、一個 FAIL_TO_PASS 測試、幾個 PASS_TO_PASS 測試。這就是 L6 說的「可執行題目」三要素。
2. **只給 bash 跑一次，再開編輯工具跑一次**：數一下兩次各有多少呼叫是讀檔和改檔、有沒有 sed 跳脫失敗或 search/replace 對不到唯一位置。這是 L6 第四節的取捨，用你自己的模型實測。
3. **故意注入一個 bug 檢查你的測試**：像 SWE-smith 那樣改掉一個條件，看測試有沒有抓到。沒抓到，就先補測試，再讓 agent 上場。

## 它在課程裡的位置

L6 是 Capabilities 模組之後的第一個 Domain，把前五講的零件（工具、上下文管理、skills、規劃）落到最成熟的應用上。緊接的 [Assignment 1](/posts/ai/2026-09-29-cmu-11768-assignment-1-harness) 要你親手寫一個 ReAct harness 去修 SWE-bench 題目，本講的 harness 定義、編輯工具取捨、SWE-bench 評分方式都會用到。下一講 [L7 Computer Use Agents](/posts/ai/2026-09-29-cmu-11768-lecture-07-computer-use-agents)（JY Koh）接續前端段落提到的瀏覽器 agent；[L8 SFT](/posts/ai/2026-09-29-cmu-11768-lecture-08-sft)、L9 RL Basics 則展開本講一再出現的「用執行結果當獎勵」。

## 延伸閱讀

- 站內：[Stanford CS329Z Week 9：寫程式的智慧體](/posts/ai/2026-09-17-stanford-cs329z-week9-coding-agents)（SWE-agent 的 ACI 與 OpenHands 平台）
- 站內：[Coding agent 的編輯工具取捨](/posts/ai/2026-08-25-coding-agent-edit-tool-tradeoffs)
- 站內：[Coding agent 的工具組設計哲學](/posts/ai/2026-08-25-coding-agent-toolset-design-philosophy)
- 站內：[Coding agent 的驗證關卡](/posts/ai/2026-08-25-coding-agent-verification-gate)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：依字幕核對影片內容。修正兩處：InCoder 跨空白 token 的說話者，以及 Agentless 作者的職稱。

## 參考資料

- 課程：[CMU 11-768 AI Agents 官網（課表、投影片、作業）](https://www.cmu-agents.com/)；L6 投影片與課堂錄影逐字稿（自動字幕，只用來確認講者說了什麼，不當數字依據）
- 講者背景：[CMU 計算機學院 2026 新進教師名單](https://scsbusinessoffice.cs.cmu.edu/new-faculty/2026.html)
- 預訓練：[StarCoder](https://arxiv.org/abs/2305.06161)、[OLMo](https://arxiv.org/abs/2402.00838)（Table 2）、[StarCoder2 tokenizer](https://huggingface.co/bigcode/starcoder2-3b/blob/main/tokenizer.json)（本文以 `tokenizers` 套件實測）
- 其他訓練訊號：[OctoPack](https://arxiv.org/abs/2308.07124)、[DrRepair](https://proceedings.mlr.press/v119/yasunaga20a.html)、[CodeRL](https://arxiv.org/abs/2207.01780)、[CodeExecutor](https://aclanthology.org/2023.findings-acl.308/)
- 中訓練：[Code Llama](https://arxiv.org/abs/2308.12950)、[Qwen2.5-Coder](https://arxiv.org/abs/2409.12186)（Table 3 與 §3.2.2）
- Infilling：[InCoder](https://arxiv.org/abs/2204.05999)（Table 1、Table 5、附錄 A.4）、[Efficient Training of Language Models to Fill in the Middle](https://arxiv.org/abs/2207.14255)
- 評測：[Yin & Neubig 2017](https://aclanthology.org/P17-1041/)、[CodeBLEU](https://arxiv.org/abs/2009.10297)、[EvalPlus](https://arxiv.org/abs/2305.01210)、[AlphaCode / CodeContests](https://arxiv.org/abs/2203.07814)（§3.2、Table 2）、[CodeBERTScore](https://aclanthology.org/2023.emnlp-main.859/)、[HumanEval / Codex](https://arxiv.org/abs/2107.03374)、[NoFunEval](https://arxiv.org/abs/2401.15963)、[DeepCoder](https://www.together.ai/blog/deepcoder)
- Agentic coding：[Agentless](https://arxiv.org/abs/2407.01489)、[SWE-agent](https://arxiv.org/abs/2405.15793)（Table 3）、[Codex apply-patch parser](https://github.com/openai/codex/blob/16ff14c266179e6a762dc8081e9dab73a96683e0/codex-rs/apply-patch/src/parser.rs)、[LocAgent](https://arxiv.org/abs/2503.09089)、[mini-SWE-agent](https://mini-swe-agent.com/latest/)、[Aider edit formats](https://aider.chat/docs/more/edit-formats.html)、[Aider unified diffs](https://aider.chat/docs/unified-diffs.html)
- 評測與訓練環境：[SWE-bench](https://arxiv.org/abs/2310.06770)、[SWE-Gym](https://arxiv.org/abs/2412.21139)、[R2E-Gym](https://arxiv.org/abs/2504.07164)、[SWE-smith](https://arxiv.org/abs/2504.21798)、[Multi-SWE-bench](https://arxiv.org/abs/2504.02605)、[SWE-bench Multilingual](https://www.swebench.com/multilingual.html)
- 多 harness 訓練：[Nemotron 3 Super](https://arxiv.org/abs/2604.12374)、[Nemotron 3 Ultra](https://arxiv.org/abs/2606.15007)、[Polar](https://arxiv.org/abs/2605.24220)
- 前端：[SWE-bench Multimodal](https://arxiv.org/abs/2410.03859)、[VisualWebArena](https://arxiv.org/abs/2401.13649)、[Playwright assertions](https://playwright.dev/docs/test-assertions)、[Playwright snapshots](https://playwright.dev/docs/test-snapshots)、[Design Arena：GLM 5.2 的網頁設計評測說明（2026-06-19）](https://notes.designarena.ai/how-glm-5-2-beat-fable-5-at-website-design)
- 外迴圈：[Meyer et al. 2019](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/04/devtime-preprint-TSE19.pdf)（Table 2）、[CodeScout](https://arxiv.org/abs/2603.17829)、[Commit0](https://arxiv.org/abs/2412.01769)、[ProgramBench](https://arxiv.org/abs/2605.03546)、[SWE-Milestone](https://arxiv.org/abs/2603.13428)、[SWT-Bench](https://arxiv.org/abs/2406.12952)、[ViBench](https://vibench.ai/)、[LCA CI Builds Repair](https://huggingface.co/datasets/JetBrains-Research/lca-ci-builds-repair)、[SWE-Playground](https://arxiv.org/abs/2512.12216)、[Hybrid-Gym](https://arxiv.org/abs/2602.16819)
- 程式世界模型：[CWM](https://arxiv.org/abs/2510.02387)、[Code World Models / GIF-MCTS](https://arxiv.org/abs/2405.15383)
