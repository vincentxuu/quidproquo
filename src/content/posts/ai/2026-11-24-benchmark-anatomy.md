---
title: "拆開一個 benchmark：題目、受測系統、評分器、隔離環境與紀錄"
date: 2026-11-24
category: ai
type: deep-dive
tags: [benchmark, llm-evaluation, evaluation, agent-evaluation, mmlu]
lang: zh-TW
tldr: "一個 benchmark 拆開是五塊：題目（輸入加標準答案或測試）、受測系統、評分器、隔離環境、紀錄。MMLU 一題只有題目、模型和字母比對；Terminal-Bench 的 fix-git 多了 Docker 環境、檢查容器終態的測試和參考解，受測的是模型加 agent harness，同一個 Claude Opus 4.5 換 harness 就從 57.8% 變 52.1%。"
description: "用一題 MMLU 和一題 Terminal-Bench 任務對照拆解 benchmark 的五個零件，說明受測的是模型還是模型加 scaffold、比對／執行驗證／評審三類評分方式，以及為什麼每題都要有拿得到滿分的參考解（oracle）。"
series:
  name: "認識 benchmark"
  order: 1
draft: false
---

> :globe: [English version](/posts/ai/2026-11-24-benchmark-anatomy-en)

下面兩樣東西都叫 benchmark 的「一題」。

第一題來自 [MMLU](https://arxiv.org/abs/2009.03300)（[資料集](https://huggingface.co/datasets/cais/mmlu)的高中資訊科第 0 題）：

> Let x = 1. What is x << 3 in Python 3?
> A. 1　B. 3　C. 8　D. 16

第二題來自 [Terminal-Bench 2.0](https://arxiv.org/abs/2601.11868) 的 [`fix-git`](https://github.com/harbor-framework/terminal-bench-2/tree/main/fix-git)，題目全文只有一句：

> I just made some changes to my personal site and checked out master, but now I can't find those changes. Please help me find them and merge them into master.

第一題的答案是一個字母，對答案鍵就知道對錯。第二題沒有「答案」可以對。受測的 agent 要在一台裝好 git 的容器裡下指令，把一筆遺失的 commit 找回來合併。做完之後，另一支測試程式去檢查容器裡的檔案對不對。

兩者發布時都只留下一個百分比，但產生那個百分比的機器差很多。[總覽](/posts/ai/2026-11-24-understanding-benchmarks-overview)講了一個分數從出題到上排行榜要經過的環節。這篇把其中「一題怎麼變成一個分數」拆開：零件有哪幾塊、各自負責什麼、拿到一份 benchmark 說明時怎麼把它們一一指出來。

## 五個零件

三份做評測工具的一手文件，用的名詞不同，切法卻一致：

- 英國 AISI 開源的評測框架 [Inspect](https://inspect.aisi.org.uk/)：一個 eval 是「a **dataset** of samples, a **solver** that produces an answer for each sample, and a **scorer** that grades the answers」，再加上沙箱和紀錄檔。
- Terminal-Bench 團隊的評測框架 [Harbor](https://github.com/harbor-framework/harbor)：一題是「an instruction, environment, and test script」，由 agent 在 sandbox 裡做，verifier 評分，每次嘗試留下一份軌跡。
- Anthropic 的工程文章〈[Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)〉：task、trial、grader、transcript、outcome，外加 evaluation harness 與 agent harness。

合起來是五塊：

```diagram
title: 一題 benchmark 怎麼變成一個分數
desc: 題目的輸入交給受測系統，受測系統在隔離環境裡動作；評分器拿環境終態或輸出，對照只有它看得到的標準答案或測試，給出分數；受測系統和評分器的過程都寫進紀錄。
caption: MMLU 這類純文字題沒有環境那一格，模型的輸出直接交給評分器。
---
<svg viewBox="0 0 640 404">
  <rect class="dg-zone" x="16" y="40" width="156" height="264" rx="8"/>
  <text class="dg-tag" x="32" y="62" dominant-baseline="central">題目</text>
  <rect class="dg-zone" x="392" y="40" width="144" height="120" rx="8"/>
  <text class="dg-tag" x="408" y="62" dominant-baseline="central">隔離環境</text>

  <path class="dg-line" d="M156 108H192" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M344 100H400" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M404 116H348" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M464 136V220" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M156 252H400" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M524 252H556" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M270 140V244A8 8 0 0 1 270 260V328" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M464 280V328" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="28" y="80" width="128" height="56" rx="6"/>
  <text class="dg-label" x="92" y="98" text-anchor="middle" dominant-baseline="central">輸入</text>
  <text class="dg-sub" x="92" y="120" text-anchor="middle" dominant-baseline="central">題幹或任務指示</text>

  <rect class="dg-box dg-box--store" x="28" y="224" width="128" height="56" rx="6"/>
  <text class="dg-label" x="92" y="242" text-anchor="middle" dominant-baseline="central">標準答案</text>
  <text class="dg-sub" x="92" y="264" text-anchor="middle" dominant-baseline="central">或測試腳本</text>

  <rect class="dg-box dg-box--accent" x="196" y="76" width="148" height="64" rx="6"/>
  <text class="dg-label" x="270" y="96" text-anchor="middle" dominant-baseline="central">受測系統</text>
  <text class="dg-sub" x="270" y="120" text-anchor="middle" dominant-baseline="central">模型或模型＋scaffold</text>

  <rect class="dg-box" x="404" y="80" width="120" height="56" rx="6"/>
  <text class="dg-label" x="464" y="98" text-anchor="middle" dominant-baseline="central">容器</text>
  <text class="dg-sub" x="464" y="120" text-anchor="middle" dominant-baseline="central">Docker 映像</text>

  <rect class="dg-box dg-box--accent" x="404" y="224" width="120" height="56" rx="6"/>
  <text class="dg-label" x="464" y="242" text-anchor="middle" dominant-baseline="central">評分器</text>
  <text class="dg-sub" x="464" y="264" text-anchor="middle" dominant-baseline="central">比對・執行・評審</text>

  <rect class="dg-box" x="560" y="228" width="64" height="48" rx="6"/>
  <text class="dg-label" x="592" y="252" text-anchor="middle" dominant-baseline="central">分數</text>

  <rect class="dg-box dg-box--store" x="196" y="332" width="328" height="56" rx="6"/>
  <text class="dg-label" x="360" y="350" text-anchor="middle" dominant-baseline="central">紀錄</text>
  <text class="dg-sub" x="360" y="372" text-anchor="middle" dominant-baseline="central">transcript・log・軌跡</text>

  <text class="dg-edge" x="372" y="88" text-anchor="middle" dominant-baseline="central">指令</text>
  <text class="dg-edge" x="372" y="128" text-anchor="middle" dominant-baseline="central">輸出</text>
  <text class="dg-edge" x="474" y="188" text-anchor="start" dominant-baseline="central">終態</text>
  <text class="dg-edge" x="340" y="240" text-anchor="middle" dominant-baseline="central">只交給評分器</text>
</svg>
```

| 零件 | 負責什麼 | Inspect | Harbor | Anthropic |
|---|---|---|---|---|
| 題目 | 輸入，加上判斷對錯的依據（標準答案、測試、評分準則） | Sample 的 `input`、`target` | `instruction.md`、`tests/` | task |
| 受測系統 | 產生答案或動作的那個東西 | solver（agent 也放這格） | agent | agent harness＋模型 |
| 評分器 | 把輸出或終態變成分數 | scorer | verifier | grader |
| 隔離環境 | 受測系統動手的地方，每次從乾淨狀態開始 | sandbox | `environment/`（Docker） | environment |
| 紀錄 | 過程與結果的完整留存 | eval log | trajectory | transcript |

圖裡最重要的一條線是「標準答案只交給評分器」：題目的兩半要分開送，受測系統只該看到輸入。這條線一破，分數量到的就變成偷看答案的本事。那是第 8 篇要處理的事。

## 拆一題 MMLU

MMLU 是 57 科、15,908 題的四選一選擇題，題目由學生從網路上公開的練習題與考試題（GRE、USMLE 練習題、大學課程題等）蒐集而來。

- **題目**：題幹、四個選項，加上一個答案鍵。資料集裡開頭那題的 `answer` 欄位是 `2`，也就是第三個選項 C（8）。
- **受測系統**：模型本身。原論文的做法是在 prompt 開頭寫「The following are multiple choice questions (with answers) about [subject].」，接最多 5 題範例，最後以「Answer:」結尾，比較模型接下來輸出 A、B、C、D 四個 token 的機率，取最高的那個。沒有工具，也沒有多輪對話。
- **評分器**：比對。選出的字母等於答案鍵得 1 分，否則 0 分，總分是平均。
- **隔離環境**：沒有。輸入是一段文字，輸出也是一段文字（甚至只是四個機率）。
- **紀錄**：每題的輸入、模型選了哪個字母、對或錯。用 Inspect 這類框架跑，這些會寫進 log。

「受測的是模型本身」不代表中間什麼都沒有。prompt 的寫法、範例題的數量、要模型直接吐字母還是比 token 機率，都是一層很薄的 harness。[HELM](https://arxiv.org/abs/2211.09110) 測過：同一個 OPT 175B 在 HellaSwag 上，每個選項分開算是 79.1%，改成把選項一起放進選擇題格式，掉到 30.2%。所以看到 MMLU 分數時，「怎麼問」也是規格的一部分，第 5、6 篇會細講。

## 拆一題 Terminal-Bench：fix-git

[Terminal-Bench](https://www.tbench.ai/) 量的是 agent 在終端機裡完成長程任務的能力。2.0 版有 89 題，由群眾貢獻再經審稿篩選。每題的格式依論文 §2.1 是「instruction、Docker image、tests、example solution、time limit」。`fix-git` 的資料夾長這樣：

```text
fix-git/
├── instruction.md          # 開頭那一句話
├── task.toml               # 難度、時限、資源
├── environment/
│   ├── Dockerfile          # python:3.13-slim-bookworm，裝 git
│   ├── setup.sh            # 布置「遺失的 commit」
│   └── resources/patch_files/
├── solution/solve.sh       # 參考解
└── tests/
    ├── test.sh             # 跑 pytest，寫出 reward
    └── test_outputs.py     # 檢查兩個檔案的內容
```

逐塊對回五個零件：

- **題目**：`instruction.md` 那一句話是輸入；判斷對錯的依據放在 `tests/`，agent 看不到。`task.toml` 寫著難度 easy、專家估 5 分鐘、初級工程師估 20 分鐘，agent 時限 900 秒。
- **隔離環境**：`setup.sh` 在建映像時 clone 一個個人網站的 repo，在 detached HEAD 上改兩個檔案並 commit，再切回 master。於是那筆 commit 不在任何分支上，只留在 reflog 裡。agent 拿到的就是這個狀態的容器。
- **受測系統**：一個 agent，也就是模型加上一套負責下指令、讀輸出、決定下一步的程式。這層程式叫 scaffold 或 harness，[總覽](/posts/ai/2026-11-24-understanding-benchmarks-overview)裡叫它 agent 外殼。論文把六種 agent harness 和多個前沿模型交叉配對來跑。
- **評分器**：執行驗證。`test_outputs.py` 算兩個檔案的 MD5，跟正確版本比；全過就由 `test.sh` 把 `1` 寫進 `/logs/verifier/reward.txt`，否則寫 `0`。論文的原則是「The tests verify that all outcomes described in the instruction have been achieved by testing properties of the final container state; they do not test the agent's commands or console output.」只看結果，不管 agent 是用 `git reflog` 還是翻 `.git/logs/HEAD` 找到的。
- **紀錄**：agent 每一步的指令與輸出存成軌跡，測試輸出存成 verifier log。Terminal-Bench 排行榜從 2026 年 4 月起[規定](https://www.tbench.ai/news/leaderboard-integrity-update)，每個通過的 trial 都要附軌跡。
- 另外還有 `solution/solve.sh`：讀 `.git/logs/HEAD` 找出那筆 commit、開分支、合併回 master。這是參考解，下面「oracle」一節會講它的用途。

fix-git 是 2.0 的題目，測試直接在 agent 用過的同一個容器裡跑。Harbor 後來把這點改了。v0.25.0（2026-10-25）起，用 `harbor task init` 建的新題目，預設讓 verifier 在[另一個沙箱](https://docs.harborframework.com/tasks/separate-verifier)裡跑，只拿得到題目宣告的 artifacts。樣板也多了一個 `tests/Dockerfile`（依原始碼與文件整理，未實際執行）。零件還是同樣五塊，只是「評分器和受測系統不共用環境」從審題規範變成了預設架構；Terminal-Bench 怎麼走到這一步，第 13 篇再談。

## 兩題並排

| 零件 | MMLU 高中資訊科第 0 題 | Terminal-Bench 2.0 fix-git |
|---|---|---|
| 輸入 | 題幹＋四個選項 | 一句自然語言指示 |
| 對錯依據 | 答案鍵 `C` | `tests/` 裡兩個檔案的 MD5 比對 |
| 受測系統 | 模型（加一段固定的 prompt 格式） | 模型＋agent harness |
| 評分器 | 比對字母 | 執行測試，檢查容器終態 |
| 隔離環境 | 無 | Docker 容器，git 與 repo 已布置好 |
| 參考解 | 答案鍵本身 | `solution/solve.sh` |
| 紀錄 | 每題的選擇與對錯 | 指令軌跡＋verifier log |
| 一次要多久 | 一次前向計算 | 最多 900 秒、多輪互動 |

## 受測的是模型，還是模型加 scaffold

這是讀任何 benchmark 分數之前要先回答的問題，因為它決定了這個分數能拿來比什麼。

MMLU 的分數是模型的分數：harness 固定且很薄，換模型就是換受測者。Terminal-Bench 的分數是一個組合的分數。Anthropic 那篇文章講得直接：「When we evaluate "an agent," we're evaluating the harness and the model working together.」Terminal-Bench 論文的表 2 有實例：同一個 Claude Opus 4.5，用中立的 Terminus 2 harness 是 57.8%，用 Claude Code 是 52.1%。論文的結論是換模型通常比換 harness 影響更大，但兩者都會動分數，所以排行榜的每一列都是「agent＋模型」，不是單一模型。

判斷方法：看排行榜的一列寫了什麼。只有模型名，受測的是模型；寫著「Claude Code＋某模型」「Codex CLI＋某模型」，受測的是組合。[ABC 檢查表](https://arxiv.org/abs/2507.02825)把這件事列成報告品質的一條（R.6）：benchmark 要說清楚受測對象是模型還是 agent 框架。

Inspect 的設計也反映了這點：agent 和「加一段系統提示再生成」放在同一個 solver 位置上。對框架來說，受測系統就是「拿到輸入、交出答案或動作」的那一格，裡面裝多少東西是規格的一部分。

## 評分的三種方式

Inspect 的 [scorer 文件](https://inspect.aisi.org.uk/scorers.html)列了四種形式，Anthropic 分成程式、模型、人三類。依「評分器要做什麼事」，可以收成三類：

**比對**：把輸出跟標準答案比，可以是完全相同、包含子字串、符合 regex，或選擇題的字母。便宜、決定性、可重現，MMLU 就是這類。弱點是合法的變體會被判錯。Anthropic 自述的例子：Claude Opus 4.5 在 CORE-Bench 一開始只有 42%，其中一個問題是評分器期待「96.124991…」卻扣掉了寫「96.12」的答案；修掉這個評分問題、模糊的題目敘述和無法重現的隨機題，再換一個限制較少的 scaffold 後，分數到 95%。

**執行驗證**：跑一段程式去檢查結果，例如單元測試、檢查資料庫或檔案狀態。適合「做對的方法很多種，但結果可以檢查」的任務，Terminal-Bench、SWE-bench 都是這類。弱點在測試本身：太鬆會讓沒做完的解法過關，太窄會擋掉別種正確寫法，第 7 篇會處理。

**評審**：讓另一個模型照評分準則打分，或讓人來評（人類偏好排行榜也算在這裡）。能處理開放式輸出，代價是同一份答案每次評的結果可能不同，而且要先跟人工標註比對過才知道準不準。一個容易漏掉的預設：Inspect 的[模型評分](https://inspect.aisi.org.uk/model-graded.html)在沒有指定評審模型、也沒有綁定 grader 角色時，會由受測模型自己評自己。

一個 benchmark 可以混用。Inspect 讓同一份紀錄換不同 scorer 重新評分，Harbor 的 RewardKit 可以把程式檢查和 LLM 評審設成不同維度再加權。讀說明文件時要找的是：最後那個百分比是哪一種評分器給的。

## oracle：先證明這題拿得到滿分

參考解（oracle）是一份「照著做一定對」的解法。它不給受測系統看，用途是檢查題目本身。如果連參考解都拿不到滿分，該修的是題目或評分器，跟受測者無關。

Harbor 把這件事做成建題的固定步驟：寫完測試後用 oracle agent 跑一次參考解，[建題教學](https://docs.harborframework.com/tutorials/create-a-task)要求它拿到 reward 1；失敗時要查的是 `solve.sh` 沒有執行權限、Dockerfile 少了依賴、測試沒寫 reward 檔、測試和解法的路徑對不上。Terminal-Bench 論文的審題流程把它和另一個反方向的檢查一起放進 CI：oracle 要能解出來，什麼都不做的 no-op agent 必須失敗。一個確認滿分拿得到，一個確認零分不是白送的。

Anthropic 的文章從另一個方向說同一件事：對前沿模型來說，同一題跑一百次全部失敗（0% pass@100），「is most often a signal of a broken task, not an incapable agent」。

選擇題的 oracle 就是答案鍵，沒有人會去「跑」它，所以答案鍵自己錯了也不會被發現。[MMLU-Redux](https://arxiv.org/abs/2406.04127) 抽查後估計，MMLU 約有 6.49% 的題目有問題（題意不清、選項不清、沒有正解、多個正解、答案鍵錯都算）。答案卷寫錯會怎樣影響分數，留給第 7 篇。

## 拿一份說明文件練習

下次讀到一個新 benchmark 的 README 或論文，花五分鐘填這張表。填不出來的格子，就是這個分數還不能拿來比的地方。

| 問題 | 去哪裡找 |
|---|---|
| 一題長什麼樣？輸入是什麼，對錯依據是答案鍵、測試還是評分準則？ | 範例題、資料格式說明 |
| 受測的是模型，還是模型加 scaffold？harness 是 benchmark 固定的，還是提交者自帶？ | 排行榜欄位、評測設定 |
| 評分是比對、執行驗證還是評審？評審的話用哪個模型？ | 評分方法一節、scorer 程式 |
| 受測系統在哪裡動手？有沒有容器、能不能上網、時限多長？ | 環境設定、任務設定檔 |
| 有沒有參考解證明每題可解？ | 資料集的 solution 欄位、審題流程 |
| 跑完留下什麼？能不能看到軌跡？ | 排行榜的提交規定、log 格式 |

拿 fix-git 填一次：輸入是一句話、對錯依據是兩個檔案的 MD5、受測的是 agent＋模型、評分是執行驗證、環境是可上網的 Docker 容器且時限 900 秒、有 `solve.sh`、排行榜要求附軌跡。六格都填得出來。

## 自我檢查

[GAIA](https://arxiv.org/abs/2311.12983) 有 466 題真實世界問題，答案是一個詞、一個數字或一串清單，用正規化後的近似完全比對評分。它的受測對象是模型還是 agent？

答案：agent。GAIA 的題目需要瀏覽網頁、讀檔案、組合多種工具才拿得到答案；評分器雖然是單純的比對，受測系統卻是模型加上工具與 scaffold。論文自己的數字顯示了差距：在 Level 1，GPT-4 單獨作答是 9.1%，加上人工替每題挑選的 plugin 後是 30.3%（這個設定不可重現）。

判準：答出「agent」並說明理由在「需要工具、多步互動」即可。如果你的理由是「因為它用比對評分，所以量的是模型」，回頭看「受測的是模型，還是模型加 scaffold」那節：評分方式和受測對象是兩個獨立的零件。

下一篇〈一個分數的誤差有多大〉從這裡往下走：零件都對了，一個 89 題的 benchmark 上差 3 分，算不算真的有差。

## 參考資料

- [Measuring Massive Multitask Language Understanding](https://arxiv.org/abs/2009.03300)（Hendrycks et al.，MMLU 原論文）；資料集 [cais/mmlu](https://huggingface.co/datasets/cais/mmlu)
- [Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces](https://arxiv.org/abs/2601.11868)（2026）
- [harbor-framework/terminal-bench-2：fix-git](https://github.com/harbor-framework/terminal-bench-2/tree/main/fix-git)（任務原始檔）
- [Leaderboard integrity update](https://www.tbench.ai/news/leaderboard-integrity-update)（tbench.ai，2026-04-19）
- [Inspect](https://inspect.aisi.org.uk/)：[Scorers](https://inspect.aisi.org.uk/scorers.html)、[Model Grading](https://inspect.aisi.org.uk/model-graded.html)、[Sandboxing](https://inspect.aisi.org.uk/sandboxing.html)、[Eval Logs](https://inspect.aisi.org.uk/eval-logs.html)（UK AI Security Institute）
- [Harbor](https://github.com/harbor-framework/harbor)：[Create a task](https://docs.harborframework.com/tutorials/create-a-task)、[Separate verifier](https://docs.harborframework.com/tasks/separate-verifier)、[Cracking down on reward hacking](https://docs.harborframework.com/news/reward-hacking)
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)（Anthropic Engineering，2026-01-09）
- [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110)（HELM）
- [Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://arxiv.org/abs/2507.02825)（ABC，NeurIPS 2025）
- [Are We Done with MMLU?](https://arxiv.org/abs/2406.04127)（MMLU-Redux）
- [GAIA: a benchmark for General AI Assistants](https://arxiv.org/abs/2311.12983)
- 站內：[認識 benchmark 總覽](/posts/ai/2026-11-24-understanding-benchmarks-overview)、[CS329Z 第 10 堂：Terminal-Bench](/posts/ai/2026-09-10-stanford-cs329z-lecture-10-terminal-bench)、[模型成績單怎麼看](/posts/ai/2026-08-26-understanding-ai-models-evaluation)
