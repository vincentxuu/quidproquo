---
title: "CMU 10-423 L23：程式生成與自主 agent——從 pass@k 到 coding agent 迴圈"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, code-generation, coding-agent, tool-use, agent-evaluation, computer-use-agent]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 21
tldr: "CMU 10-423 第 23 講分兩半。前半講程式生成：評估從 BLEU 轉向「單元測試過了幾個」，基準從 HumanEval、MBPP 一路到 SWE-Bench Verified 與 Terminal-Bench 2.0；模型從 CodeBERT、Codex 到 FIM 與 StarCoder；程式領域特有的技巧是拿單元測試輸出做自我修正。後半講 agent：tool calling 的定義、Kimi K2 怎麼合成工具資料、coding agent 的五步迴圈，以及 Mind2Web、Set-of-Mark、SeeClick 這些操作網頁與 GUI 的方法。這一講沒有作業，只由 Quiz 6 驗收。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）第 23 講導讀：程式生成的應用、評估指標與基準（BLEU、CodeBLEU、pass@k、HumanEval、MBPP、SWE-Bench Verified、Terminal-Bench 2.0）、代表性程式模型（CodeBERT、Codex、CodeT5、InCoder／FIM、StarCoder、LongCoder）、單元測試驅動的自我修正、tool calling 與 Kimi K2、coding agent 迴圈與系統提示詞，以及 Mind2Web、Set-of-Mark、SeeClick 等網頁／GUI agent。"
draft: false
glossary:
  - term: "pass@k"
    aliases: ["pass at k"]
    definition: "讓模型對同一題產生 k 份程式，只要其中一份通過所有單元測試就算解出；pass@k 是解出題目的比例。實作上會抽更多樣本再估計，以降低變異。"
    context: "CMU 10-423 第 23 講介紹 HumanEval 時使用的主要指標。"
    links:
      - label: "Chen et al. 2021（Codex／HumanEval）"
        url: "https://arxiv.org/abs/2107.03374"
  - term: "FIM"
    aliases: ["fill-in-the-middle", "中間填空"]
    definition: "把一段程式切成前綴、中間、後綴，訓練時排成「前綴、後綴、中間」的順序，讓只會往右生成的因果語言模型也能補出游標所在的中間段。"
    context: "CMU 10-423 第 23 講用它回答「因果遮罩的 LM 怎麼在檔案中間補程式」。"
    links:
      - label: "Bavarian et al. 2022：Efficient Training of Language Models to Fill in the Middle"
        url: "https://arxiv.org/abs/2207.14255"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-code-generation-agents-en)

**本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 版。** 這是 [CMU 10-423 導讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)系列第 21 篇，接續 [L22 + L26：實務風險與對齊科學](/posts/ai/2026-09-30-cmu10423-risks-alignment)，範圍是 2026 年 4 月 8 日的 Lecture 23「Code Generation / Autonomous Agents」，講者 Matt Gormley。

用到的官方材料：[講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)、[投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture23-code.pdf)（55 頁）與[課堂手寫版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture23-code-ink.pdf)（55 頁）。手寫版的文字和原版相同，只多了課堂上的紅筆圈畫。講次表這一講沒有列 readings，本文也不自行補上。這門課的存取等級是 **A3**（等級定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)），但錄影放在要 CMU 登入的 Panopto，所以本篇完全依投影片撰寫。

這一講的問題很實際：**讓模型寫程式、甚至自己動手操作電腦時，要怎麼判斷它做對了，又要怎麼把它組成一個能反覆嘗試的系統？** 投影片分成七段：程式生成的應用、評估、程式模型、程式專屬技巧、tool calling、coding agent、自主 agent。前四段講「模型本身」，後三段講「模型外面那一圈系統」。

## 課程影片來源

官方課站將 Spring 2026 錄影放在 SCS Panopto；匿名頁面未載入影片並提示登入。本文依公開投影片與作業導讀，錄影需依課程授權存取。

課程與錄影入口：

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 程式生成能做什麼

投影片開頭用一張圖對照「兩個人結對寫程式」和「跟 LLM 一起寫程式」，接著列出程式模型的應用：

- IDE 自動補全（例如 GitHub Copilot）
- 依文字提示或 docstring 寫出函式、類別
- 讀懂大型 codebase 後加新功能
- 找 bug、修 bug、寫單元測試
- 把程式翻成另一種語言、替既有程式補註解

資料面舉了兩個例子：[Dolma](https://allenai.github.io/dolma/) 是 3 兆 token 的文字資料集，由多個既有資料集組成；[The Stack](https://arxiv.org/abs/2211.15533) 則是 3TB、授權寬鬆、專門給 LLM 用的程式碼。投影片的重點是大部分 LLM 的訓練資料本來就混了大量程式語言，所以程式能力是一般預訓練的副產品，不必另外從零訓練。

## 怎麼評估程式：從「長得像」到「跑得過」

### 三種指標

| 指標 | 在量什麼 | 投影片的評語 |
|---|---|---|
| BLEU | 和參考答案的 n-gram 重疊（借自機器翻譯） | Codex 論文的結果顯示它不是好的替代指標 |
| [CodeBLEU](https://arxiv.org/abs/2009.10297) | 混合 n-gram、語法樹、資料流等句法與語意比對 | 仍是和參考答案比 |
| Functional correctness | 通過多少單元測試 | 已成為主流 |

轉向 functional correctness 的理由很直觀：兩段寫法完全不同的程式可能都對，只差一個字元的程式也可能完全錯。

### 五個基準

| 基準 | 內容 | 投影片記下的規模 |
|---|---|---|
| [HumanEval](https://arxiv.org/abs/2107.03374) | 跟 Codex 一起發表，用 pass@k 量測 | 164 題手寫題 |
| [MBPP](https://arxiv.org/abs/2108.07732) | 新手程式設計師解得出的 Python 題，每題有描述、3 個測試、一份解答 | 974 題，群眾外包 |
| DS-1000 | 只列名，沒有展開 | — |
| [SWE-Bench](https://arxiv.org/abs/2310.06770) Verified | 解真實 GitHub issue：產生 patch，用 repo 的單元測試比對參考修正 | 原版從 12 個熱門 Python repo、9 萬個 PR 篩出 2,294 題；Verified 是人工驗證過的 500 題子集 |
| [Terminal-Bench 2.0](https://arxiv.org/abs/2601.11868) | 命令列上的互動任務，每題有 Docker 容器、英文指示、驗證最終容器狀態的測試、參考解 | 89 題，每題經 3 人人工驗證 |

pass@k 的定義是「k 份樣本裡有一份過了所有測試」的比例；投影片特別註明，實際估計時會抽更多樣本來降低變異。

SWE-Bench 的篩選條件值得記：PR 必須解決某個 issue、必須改到測試，而且至少有一個測試要從失敗變成通過。這三個條件讓每一題都有可執行的驗收標準。Terminal-Bench 2.0 的兩個例題則顯示題型有多雜：一題要從原始碼編譯安裝 POV-Ray 2.2，再渲染測試場景和參考圖比對；另一題要從棋盤圖片判斷白方最佳著法，用代數記譜寫進檔案。

## 六個代表性的程式模型

| 模型 | 投影片的重點 |
|---|---|
| [CodeBERT](https://arxiv.org/abs/2002.08155) | 早期成功案例，1.25 億參數、架構同 RoBERTa；預訓練目標是 masked LM 加 replaced token detection；應用例是用自然語言檢索程式 |
| [Codex](https://arxiv.org/abs/2107.03374) | GitHub Copilot 最初背後的模型：120 億參數的 GPT-3，在 159GB Python 程式上微調。從預訓練 GPT-3 出發沒有提升最終表現，但收斂更快 |
| [CodeT5](https://arxiv.org/abs/2109.00859) | 以 T5 encoder-decoder 為底，像 T5 一樣把多種任務合在一起訓練 |
| [InCoder](https://arxiv.org/abs/2204.05999) / [FIM](https://arxiv.org/abs/2207.14255) | 回答「只會往右生成的模型怎麼補中間」；見下方 |
| StarCoder | 曾是最好的開源程式模型之一，用 FIM 預訓練 155 億參數、1 兆 token |
| LongCoder | 針對大型 codebase，用 sparse attention 處理長輸入 |

FIM 是這一段最值得弄懂的技巧。InCoder（2022 年 4 月）的做法是在要補的地方放一個 mask token。FIM（2022 年 7 月）則把程式切成前綴、中間、後綴，訓練時排成：

```text
<PRE> prefix <SUF> suffix <MID> middle
```

預測時只給到 `<MID>`，模型就會接著生出中間那段。因為順序被重排過，模型在生成中間段之前已經「看過」後綴，一般的因果遮罩不必改。這正是 IDE 補全需要的能力：游標前後都有程式。

## 程式專屬的技巧：拿單元測試當回饋

投影片先指出一個反例：一般推理題上，讓 LLM 自己檢查、自己修正通常沒什麼用。程式不一樣，因為模型可以拿到單元測試的輸出。把失敗的測試訊息餵回去，在測試時反覆修正，效果就會很好。

這個觀察把前後兩半串起來。能執行、能拿到客觀回饋，是程式領域最特別的地方；後面的 coding agent 就是把「寫、跑、看結果、再改」這件事自動化。

## Tool calling：模型提出請求，系統負責執行

投影片對 tool calling 的定義有五點：

1. 讓 LLM 選擇並呼叫外部函式，而不只是生成文字。
2. 一個工具通常有名稱、描述和參數 schema。
3. 模型判斷何時需要工具，輸出結構化的呼叫，拿回結果後接著推理。
4. 適合需要動作或實際資料的情境，例如查天氣、查資料庫、寄信、計算。
5. 模型本身並不「做」這個動作，它只是請外面的系統去執行。

第 5 點最容易被忽略。權限、審核、錯誤處理都在系統那一側，模型只負責提出請求。

接著以 [Kimi K2](https://arxiv.org/abs/2507.20534) 示範怎麼把工具能力訓練進模型：

- **合成 SFT 資料**：先建一個大型工具規格庫（真實的 MCP 工具加上合成工具），再生成 agent、任務和成功的工具呼叫軌跡。
- **聯合 RL**：在真實與合成環境裡做強化學習，讓模型從互動結果學會選工具、排順序，而不只是模仿。
- **推論時**：每次請求都把可用工具清單交給模型，由它自己決定何時、怎麼呼叫。

## Coding agent：一個會反覆嘗試的迴圈

投影片引用 [OpenHands](https://openhands.dev/blog/agent-control-plane) 的圖說明什麼是 coding agent，並列出 [CodeAct](https://arxiv.org/abs/2402.01030)（讓 agent 以可執行的程式碼作為動作）。核心是一個五步迴圈：

1. **理解目標**：讀任務、讀 codebase 和相關檔案。
2. **規劃下一步**：選一個具體動作，例如看程式、改檔案、跑測試、查文件。
3. **行動**：改程式或呼叫工具。
4. **觀察回饋**：讀編譯錯誤、測試結果、log 或工具輸出。
5. **修正**：更新理解，決定下一步。

迴圈一直跑到任務解決、卡住或碰到停止條件。投影片的精簡版是：讀 → 規劃 → 編輯／執行 → 檢查結果 → 重複。

### 系統提示詞長什麼樣

投影片整頁貼出 [OpenHands 的 system prompt](https://github.com/OpenHands/OpenHands/blob/754a96e7f33c68f55e7323d37f83234846cef519/openhands/agenthub/codeact_agent/prompts/system_prompt.j2)，另一頁貼 [Codex CLI 的基本指示](https://github.com/openai/codex/blob/d90a3488704c6a2d0a3f50c3a17c9e1a52a7ddd9/codex-rs/protocol/src/prompts/base_instructions/default.md)。OpenHands 那份分成角色、效率、檔案系統、程式品質、版本控制、PR、解題流程幾個區塊，幾條具體規則：

- 使用者問「為什麼會發生 X」時，只回答，不要動手修。
- 每個動作都有成本，能合併的指令就合併。
- 不要為同一個檔案建立多個帶後綴的版本，直接改原檔。
- 除非明確要求，不要 push 到遠端或開 PR。

這些規則幾乎都在處理「agent 做了使用者沒要的事」，讀起來像一份行為守則，而不是能力說明。

### 多 agent 與三個難題

多 agent 架構那頁引用 Anthropic 的 [2026 Agentic Coding Trends Report](https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf) 的圖，從單一 agent 畫到協調多個 agent。接著投影片列出打造 coding agent 的難題：

| 難題 | 投影片的說法 |
|---|---|
| 程式搜尋 | 找不到 bug 就修不了；不知道功能該放哪，就很難實作 |
| 編輯程式 | 這才是最根本的程式生成問題：找到位置後要產生 patch |
| 訓練資料 | 兩個來源：用 RL 跑完整的解題軌跡，或合成軌跡（例如 [SERA](https://arxiv.org/abs/2601.20789)）；算力不足時考慮後者 |

## 自主 agent：操作網頁與 GUI

最後一段把 agent 從程式碼延伸到網頁和圖形介面。

**[Mind2Web](https://arxiv.org/abs/2306.06070)** 直接讀網頁的 HTML 來互動，系統由兩個模型組成：先用一個 ranking LM 從頁面元素中篩出候選，再由一個 prediction LLM 決定要對哪個元素做什麼操作。

**VLM agent** 則看螢幕截圖。投影片說這類系統通常有兩個部分：visual grounding 模型決定下一步要點哪裡、在哪輸入；GUI agent 模型掌握整體流程，朝最終目標推進。

**[Set-of-Mark prompting](https://arxiv.org/abs/2310.11441)** 的做法是把圖片中有語意的區塊標上數字，數字直接改寫進像素裡，提示詞可以引用這些數字。投影片接著自問自答兩題：

- 區塊怎麼找？用現成的分割模型，例如 [Segment Anything](https://segment-anything.com/demo)。
- 每個 VLM 都能用嗎？不一定。論文發現 GPT-4V 能理解並對應這些標記，LLaVA-1.5 和 MiniGPT-v2 則不行。

**[SeeClick](https://arxiv.org/abs/2401.10935)** 直接訓練現成的 VLM（Qwen-VL），只看截圖就執行單一動作。

最後一頁講用 RL 訓練 agent：完成一件任務有很多種方法，只模仿某個人的操作過程並不理想；改用 RL，任務成功時在最後給正向獎勵。

## 課程怎麼驗收這一講

- **Quiz 6**：講次表標在 4 月 20 日課堂上，範圍 L21–L24，題目不公開。
- **作業**：L15 以後沒有程式作業，這一講沒有對應的作業。
- **練習考卷**：[Spring 2026 practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) 在 3 月 30 日考試前發布，13 大題到 Scaling Laws 為止，沒有考到這一講。
- **HW623**：10-623／723 學生的[論文清單](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf)裡有幾篇跟這講直接相關，例如 [ToolLLM](https://arxiv.org/abs/2307.16789)、[DeepSeek-Coder](https://arxiv.org/abs/2401.14196)、[WebArena](https://arxiv.org/abs/2307.13854)、[AutoGen](https://arxiv.org/abs/2308.08155)、[CRITIC](https://arxiv.org/abs/2305.11738)。HW623 的做法見 [order 23](/posts/ai/2026-09-30-cmu10423-exam-hw623-project)。

**怎麼做**：今晚從 [MBPP](https://arxiv.org/abs/2108.07732) 挑三題，讓你常用的模型各產生 5 份解答，自己跑那 3 個附帶測試，算出 pass@1 和 pass@5。再把一份沒過的解答連同錯誤訊息貼回去要它修一次，看看投影片說的「單元測試回饋」在你手上有沒有效。

## 這一篇可以確認與不能確認的

可以確認：講次表的日期與標題、投影片與手寫版的文字、投影片上引用的論文與網址。不能確認：課堂口述的補充（Panopto 需登入）、Quiz 6 的題目、投影片裡只以圖呈現的內容細節（例如 LLM-based autonomous agents 的成長圖、多 agent 架構圖、SWE-Bench Verified 的分數走勢圖）。投影片寫「In November 2024, Claude 2.0 only solved 1.96% of issues」，但 SWE-Bench 論文的 arXiv 編號是 2023 年 10 月（2310.06770），這個年份疑為投影片筆誤，本文只寫 1.96% 這個數字的出處，不採用投影片上的日期。

延伸閱讀：站上 [CME295 第 7 講：Agentic LLM](/posts/ai/2026-09-29-cme295-agentic-llms) 從 RAG、function calling 講到 agent 迴圈，[CME295 2026 第 6 講：AI Agents](/posts/ai/2026-09-29-cme295-ai-agents) 則談 context 管理與 harness；想把 agent 當成一整門課讀，可以看 [CMU 11-768 導讀](/posts/ai/2026-09-29-cmu-11768-course-overview)。

系列導覽：上一篇 [L22 + L26：實務風險與對齊科學](/posts/ai/2026-09-30-cmu10423-risks-alignment)｜下一篇 [L24–L26：語音、影片生成與互動式世界模型](/posts/ai/2026-09-30-cmu10423-audio-video-world-models)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [課程講次表（Lecture 23 與 Quiz 6 範圍）](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 23 投影片：Code Generation + LLMs / VLMs as Autonomous Agents](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture23-code.pdf)
- [Lecture 23 投影片（課堂手寫版）](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture23-code-ink.pdf)
- [Chen et al. 2021：Evaluating Large Language Models Trained on Code（Codex、HumanEval）](https://arxiv.org/abs/2107.03374)
- [Austin et al. 2021：Program Synthesis with Large Language Models（MBPP）](https://arxiv.org/abs/2108.07732)
- [Jimenez et al. 2023：SWE-bench](https://arxiv.org/abs/2310.06770)
- [Merrill et al. 2026：Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces](https://arxiv.org/abs/2601.11868)
- [Ren et al. 2020：CodeBLEU](https://arxiv.org/abs/2009.10297)
- [Feng et al. 2020：CodeBERT](https://arxiv.org/abs/2002.08155)
- [Wang et al. 2021：CodeT5](https://arxiv.org/abs/2109.00859)
- [Fried et al. 2022：InCoder](https://arxiv.org/abs/2204.05999)
- [Bavarian et al. 2022：Efficient Training of Language Models to Fill in the Middle](https://arxiv.org/abs/2207.14255)
- [Wang et al. 2024：Executable Code Actions Elicit Better LLM Agents（CodeAct）](https://arxiv.org/abs/2402.01030)
- [Shen et al. 2026：SERA: Soft-Verified Efficient Repository Agents](https://arxiv.org/abs/2601.20789)
- [Kimi Team 2025：Kimi K2: Open Agentic Intelligence](https://arxiv.org/abs/2507.20534)
- [Kocetkov et al. 2022：The Stack](https://arxiv.org/abs/2211.15533)
- [Deng et al. 2023：Mind2Web](https://arxiv.org/abs/2306.06070)
- [Yang et al. 2023：Set-of-Mark Prompting](https://arxiv.org/abs/2310.11441)
- [Cheng et al. 2024：SeeClick](https://arxiv.org/abs/2401.10935)
- [OpenHands system prompt（投影片引用的版本）](https://github.com/OpenHands/OpenHands/blob/754a96e7f33c68f55e7323d37f83234846cef519/openhands/agenthub/codeact_agent/prompts/system_prompt.j2)
- [Codex CLI base instructions（投影片引用的版本）](https://github.com/openai/codex/blob/d90a3488704c6a2d0a3f50c3a17c9e1a52a7ddd9/codex-rs/protocol/src/prompts/base_instructions/default.md)
- [Anthropic：2026 Agentic Coding Trends Report](https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf)
- [HW623 handout（論文清單）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf)
