---
title: "benchmark 分數能信多少：一個分數從出題到排行榜的五個環節"
date: 2026-11-24
category: ai
type: deep-dive
tags: [benchmark, llm-evaluation, evaluation, agent-evaluation]
lang: zh-TW
tldr: "一個 benchmark 分數要經過出題、評分、執行、報告、排行榜五個環節，每一環都能讓數字差到幾十分：同一個 o4-mini 換一套 agent 外殼，SWE-bench Verified Mini 從 54% 掉到 6%；什麼都不做的 agent 在 τ-bench 航空題拿 38%。看到分數時，先問是哪一環決定了它。"
description: "認識 benchmark 系列總覽：benchmark 是什麼、一個分數從出題到上排行榜經過的五個環節與各環節的代表性失真，以及系列 25 篇分成零件、失真、家族、讀、建五段的地圖。"
series:
  name: "認識 benchmark"
  order: 0
glossary:
  - term: "scaffold"
    aliases: ["harness", "agent 外殼"]
    definition: "把模型包成 agent 的那層程式：決定給模型什麼提示、能用哪些工具、可以跑幾步、什麼時候停。"
    context: "本文的「外殼」都指它。同一個模型換 scaffold，等於換了一個受測者。"
draft: false
---

> :globe: [English version](/posts/ai/2026-11-24-understanding-benchmarks-overview-en)

同一個 o4-mini，考同一份 SWE-bench Verified Mini（50 道真實的程式修改題）。用專門修程式的 agent 外殼 SWE-Agent 跑，答對 54%；換成通用的 HAL Generalist，只剩 6%（[HAL 論文](https://arxiv.org/abs/2510.11977)的附錄表）。

同一個 GLM-4.6 考同一份 [GPQA Diamond](https://arxiv.org/abs/2311.12022)（研究所程度的科學選擇題）。直接呼叫開發商 Z.ai 的 API，跑四次落在約 73%–83%。改經 [OpenRouter](https://openrouter.ai) 轉給另一家推論供應商，四次只剩約 2%–21%（[Epoch AI](https://epoch.ai/gradient-updates/why-benchmarking-is-hard)）。

這兩份考卷都是 benchmark，也就是拿來比較 AI 模型的標準化考卷。兩組實驗都沒有換模型，也沒有人作弊，變的是分數被量出來的方式。

這個系列要拆的就是那個方式。模型發布表上的每個數字，從題目被寫出來到變成排行榜上的名次，中間經過哪些環節？每一環怎麼讓數字偏掉？你自己建評測時又怎麼避開？這篇是入口，先講 benchmark 是什麼，再用一張圖把五個環節串起來，最後給整個系列 25 篇的地圖。

## benchmark 是什麼

benchmark 是一份固定的考卷，加上一套固定的閱卷方式。它規定了一批題目、每題怎麼算對、怎麼讓模型作答，以及怎麼把每題的對錯彙總成一個數字。大家考同一份卷子、用同一套規則閱卷，分數才能互相比。

三個常見的例子，形狀差很多：

- **[MMLU](https://arxiv.org/abs/2009.03300)**：57 個科目的四選一選擇題。原始做法是看模型在 A、B、C、D 四個選項裡給哪個最高的機率，跟標準答案比對。
- **[SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)**：題目是真實 GitHub 專案的 issue。受測的模型（通常包在一個 agent 裡）要改程式碼，再跑那個專案的單元測試，測試通過才算解出。Verified 是 OpenAI 請有 Python 經驗的開發者人工篩過的 500 題版本。
- **[Chatbot Arena](https://arxiv.org/abs/2403.04132)**：沒有標準答案。使用者提問，兩個匿名模型各答一次，使用者投票選比較好的；平台再從大量投票算出每個模型的分數與名次。

模型廠商在發布時用 benchmark 證明新模型變強，[Epoch AI](https://epoch.ai/benchmarks)、[HAL](https://hal.cs.princeton.edu) 這類第三方自己重跑一次來對照，做選型的人拿它們縮小候選名單。三種人看的是同一個數字，但那個數字背後的設定，常常只有跑分的人知道。

## 一個分數的一生

從一道題目被寫出來，到排行榜上出現一個名次，至少經過五個環節。每一環都有人做決定，每個決定都會改變最後的數字。

```diagram
title: 一個 benchmark 分數的一生
desc: 分數依序經過出題、評分、執行、報告、排行榜五個環節，每一環各有一種代表性的失真，對應系列中專門講它的篇次。
caption: 每一環只列一種代表性失真；同一環的其他問題見系列地圖。
step: 出題：決定題目從哪來、要量什麼能力
step: 評分：決定一題怎麼算對
step: 執行：決定用哪套外殼、哪家 API、什麼設定跑
step: 報告：決定公布幾題、跑幾次、附不附誤差
step: 排行榜：把很多分數排成名次
---
<svg viewBox="0 0 440 544">
  <path class="dg-line" data-step="2" d="M220 96V120" marker-end="url(#arrow)"/>
  <path class="dg-line" data-step="3" d="M220 204V228" marker-end="url(#arrow)"/>
  <path class="dg-line" data-step="4" d="M220 312V336" marker-end="url(#arrow)"/>
  <path class="dg-line" data-step="5" d="M220 420V444" marker-end="url(#arrow)"/>

  <g data-step="1">
    <rect class="dg-box" x="20" y="16" width="400" height="80" rx="6"/>
    <g class="dg-badge"><circle cx="44" cy="36" r="10"/><text x="44" y="36" text-anchor="middle" dominant-baseline="central">1</text></g>
    <text class="dg-label" x="64" y="36" dominant-baseline="central">出題</text>
    <text class="dg-sub" x="64" y="58" dominant-baseline="central">題目從哪來、要量什麼能力</text>
    <text class="dg-sub dg-text--warn" x="64" y="78" dominant-baseline="central">考題被看過、太簡單、量錯東西 → 第 3–5 篇</text>
  </g>
  <g data-step="2">
    <rect class="dg-box" x="20" y="124" width="400" height="80" rx="6"/>
    <g class="dg-badge"><circle cx="44" cy="144" r="10"/><text x="44" y="144" text-anchor="middle" dominant-baseline="central">2</text></g>
    <text class="dg-label" x="64" y="144" dominant-baseline="central">評分</text>
    <text class="dg-sub" x="64" y="166" dominant-baseline="central">一題怎麼算對</text>
    <text class="dg-sub dg-text--warn" x="64" y="186" dominant-baseline="central">答案卷寫錯、評分被鑽漏洞 → 第 7–8 篇</text>
  </g>
  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="20" y="232" width="400" height="80" rx="6"/>
    <g class="dg-badge dg-badge--accent"><circle cx="44" cy="252" r="10"/><text x="44" y="252" text-anchor="middle" dominant-baseline="central">3</text></g>
    <text class="dg-label" x="64" y="252" dominant-baseline="central">執行</text>
    <text class="dg-sub" x="64" y="274" dominant-baseline="central">用哪套外殼、哪家 API、什麼設定跑</text>
    <text class="dg-sub dg-text--warn" x="64" y="294" dominant-baseline="central">換設定就差幾十分 → 第 6 篇</text>
  </g>
  <g data-step="4">
    <rect class="dg-box" x="20" y="340" width="400" height="80" rx="6"/>
    <g class="dg-badge"><circle cx="44" cy="360" r="10"/><text x="44" y="360" text-anchor="middle" dominant-baseline="central">4</text></g>
    <text class="dg-label" x="64" y="360" dominant-baseline="central">報告</text>
    <text class="dg-sub" x="64" y="382" dominant-baseline="central">幾題、跑幾次、誤差多大</text>
    <text class="dg-sub dg-text--warn" x="64" y="402" dominant-baseline="central">差距落在誤差內 → 第 2 篇</text>
  </g>
  <g data-step="5">
    <rect class="dg-box" x="20" y="448" width="400" height="80" rx="6"/>
    <g class="dg-badge"><circle cx="44" cy="468" r="10"/><text x="44" y="468" text-anchor="middle" dominant-baseline="central">5</text></g>
    <text class="dg-label" x="64" y="468" dominant-baseline="central">排行榜</text>
    <text class="dg-sub" x="64" y="490" dominant-baseline="central">很多分數排成一個名次</text>
    <text class="dg-sub dg-text--warn" x="64" y="510" dominant-baseline="central">挑最好的那次上榜 → 第 9、19 篇</text>
  </g>
</svg>
```

開頭那兩組反差都發生在第 3 環，所以圖上把它標出來。但五環都會動到數字，下面一環一環看。

### 1. 出題：這份考卷量的是什麼

出題的人決定題目從哪來：考試題庫、專家手寫、真實 GitHub issue，或程式自動生成。他也決定題目要不要公開，以及這些題目合起來「代表」什麼能力。

最常見的失真是**模型考前看過考卷**。公開的題目會被爬進網路，再進到下一代模型的訓練資料。OpenAI 在 2026 年 2 月[停止回報 SWE-bench Verified](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)，理由之一是受測的前沿模型都能背出部分題目的標準修法或題目原文。他們的結論是這份 benchmark 上的進步 "increasingly reflect how much the model was exposed to the benchmark at training time"。

同一環還有兩種問題。一是題目太簡單，頂尖模型都擠在 90 分以上分不開（第 4 篇）。二是題目量到的其實是別的能力，例如一份叫「推理」的考卷，失分可能主要來自模型沒照規定格式作答（第 5 篇）。

### 2. 評分：一題怎麼算對

評分規則把模型的回答變成對或錯。常見的有四種：跟標準答案逐字比對、跑測試看程式能不能過、請另一個模型當評審、讓人投票。

評分寫錯，分數往兩個方向都會偏。往上偏的例子是 [τ-bench](https://arxiv.org/abs/2406.12045)。它的航空客服題有一部分刻意設計成不能辦，成功條件是「資料庫維持原狀」。結果一個什麼都不做的 agent 在航空子集拿到 38%，比原論文回報的 GPT-4o agent（35%）還高（[ABC](https://arxiv.org/abs/2507.02825)）。

往下偏的例子來自 SWE-bench Verified。OpenAI 回頭審 o3 跑 64 次都無法穩定解出的 138 題，發現過半題目的測試或題目描述有問題。其中一類是測試會擋掉功能正確的修法，模型寫對了也被判錯。

標準答案寫錯在第 7 篇，agent 主動鑽評分漏洞（例如把測試改成永遠通過）在第 8 篇。

### 3. 執行：用什麼設定跑

題目和評分都固定了，同一個模型還是可以跑出很不一樣的分數。「跑」這件事本身有一長串選擇：用哪套 agent 外殼、透過哪家 API 供應商、用哪個推論引擎、推理強度開多高、每題給多少時間、提示怎麼寫。

開頭兩組數字都在這裡。HAL 那組換的是外殼；Epoch 那組換的是 API 供應商，低分主要來自限流、回空、回應被截斷，這些錯誤在實驗裡一律記成答錯。Epoch 研究員在這篇分析裡的結論是 "Bugs and instabilities in the chosen API provider are the biggest source of evaluation errors, which particularly affects newer models."

廠商自報和第三方重測對不上時，多半就是這一環的設定不同，不一定有人說謊。第 6 篇把這些設定逐項拆開。

### 4. 報告：一個數字附了多少資訊

一份 benchmark 分數其實是從所有可能題目裡抽一批來考的結果，換一批題目，分數就會動。題數越少，動得越厲害。所以一個分數至少要附上題數、跑了幾次、誤差有多大，讀的人才能判斷兩個分數的差距是真的還是運氣。

多數 benchmark 沒附這些。牛津團隊回顧 445 篇 benchmark 論文，只有 16.0% 用統計檢定或不確定性估計來比較模型（[Bean et al.](https://arxiv.org/abs/2511.04703)）。Anthropic 的 Evan Miller 用一組自訂但合理的參數估算過題數（[Adding Error Bars to Evals](https://arxiv.org/abs/2411.00640)）。要有八成把握分出兩個模型差 3 個百分點，大約需要 1,000 題。開頭那份 SWE-bench Verified Mini 只有 50 題。

一個分數的誤差怎麼估、50 題的考卷差幾分才有意義，是第 2 篇的主題。

### 5. 排行榜：很多分數變成一個名次

最後一環把分數排成名次：排行榜、廠商發布表、把幾十個 benchmark 壓成一個數字的聚合指數。這一環決定哪個數字被看見。

最典型的偏誤是**挑最好的那次放上去**。取多次有雜訊的測量裡的最大值，期望值一定高於單次測量。[The Leaderboard Illusion](https://arxiv.org/abs/2504.20879) 統計到，Llama 4 發布前的一個月內，最多有 27 個 Meta 模型在 Chatbot Arena 上私下測試；廠商可以只公開表現最好的那一個。聚合指數也有同樣的結構：Epoch 的 ECI 對同一個模型的不同推理強度與供應商[取各 benchmark 的最高分](https://epoch.ai/data/eci-documentation/data)；HAL 論文的排行榜表也是每個組合跑得最好的那一次。

所以排行榜上的數字比較接近「這個模型在最順利的設定下能拿到多少」，不是你接上 API 後的日常表現。Arena 的治理問題在第 9 篇，聚合指數在第 19 篇。

## 系列地圖：五段各回答什麼

25 篇分成五段，順序是先看得見、再看不見：先拆開零件，再講抽象的失真機制，再用具體 benchmark 複習一遍機制，最後換你自己動手。

1. **零件**（第 0–2 篇）：一個 benchmark 由什麼組成，一個分數的誤差有多大。
2. **失真**（第 3–9 篇）：分數為什麼會騙人，一篇講一種機制，分別落在上圖的出題、評分、執行、排行榜四環。
3. **家族**（第 10–18 篇）：主要的 benchmark 逐一解剖。每篇開頭有一張「這個 benchmark 踩過哪些坑」小表，連回第 3–9 篇的機制。
4. **讀**（第 19–20 篇）：聚合指數怎麼讀，以及一張發布表的檢查清單。清單照本篇的五個環節排。
5. **建**（第 21–24 篇）：替自己的產品建評測。角色換成出題的人，前面每個坑都變成你要防的事，四篇照出題、評分、執行與報告、維護的順序走。

| 篇次 | 標題 | 回答的問題 |
|---|---|---|
| 0 | 總覽：一個分數的一生（本篇） | 一個 benchmark 分數從出題到上排行榜經過哪些環節，每個環節會怎麼出錯？ |
| 1 | [拆開一個 benchmark](/posts/ai/2026-11-24-benchmark-anatomy) | 一個 benchmark 由哪幾個零件組成，各自負責什麼？ |
| 2 | 一個分數的誤差有多大 | 兩個模型差 3 分，算不算真的有差？ |
| 3 | 污染：考題被看過了 | 模型怎麼會「看過考題」，看過之後分數會灌多少，怎麼偵測？ |
| 4 | 飽和：考卷太簡單了 | 為什麼大家都 90 分以上時分數就沒用了，哪些設計能延後這一天？ |
| 5 | 量到的是不是你想量的 | 一個叫「推理」的 benchmark，量到的真的是推理嗎？ |
| 6 | 同一個模型，不同的分數 | 為什麼同一個模型換 harness、換 API 供應商、換推論引擎，分數會差到幾十分？ |
| 7 | 答案卷本身寫錯了 | 標準答案錯、測試寫錯時，分數會往哪個方向偏？ |
| 8 | 受測者對考試本身的反應 | agent 為什麼會鑽評分的漏洞，模型知道自己在被考時又會怎樣？ |
| 9 | 人類投票的排行榜 | Arena 分數代表什麼、不代表什麼，它的治理問題在哪？ |
| 10 | 知識題：從 MMLU 到 HLE | 出題方式從考古題到專家出題再到先用模型篩題，各解決了什麼、又帶來什麼？ |
| 11 | 數學：從比賽題到未解問題 | 為什麼數學 benchmark 最早走到「答案可驗證」，又為什麼最後連比賽題都不夠用？ |
| 12 | SWE-bench 家族 | 用真實 GitHub issue 當考題，三代下來為什麼都還在修同一個問題？ |
| 13 | Terminal-Bench 與 Harbor | 怎麼在終端機裡出一道 agent 題，又怎麼防它作弊？ |
| 14 | ARC-AGI | 想量「學新技能的效率」而不是「會多少技能」，要怎麼出題？ |
| 15 | agent 互動環境 | 評分從比對答案變成檢查環境終態之後，多了哪些新問題？ |
| 16 | 時間地平線 | 「AI 能做多久的工作」怎麼量，倍增時間能信多少？ |
| 17 | 經濟價值評測 | GDPval 和 Remote Labor Index 怎麼量「能替代多少有償工作」？ |
| 18 | 中文與繁中 benchmark | 為什麼不能只看英文分數，繁中 benchmark 量得到什麼、量不到什麼？ |
| 19 | 聚合指數怎麼讀 | 把幾十個 benchmark 壓成一個數字，丟掉了什麼？ |
| 20 | 怎麼讀一張模型發布表 | 拿到一張廠商的 benchmark 表，依序要問哪些問題？ |
| 21 | 自己建：從失敗案例到題目 | 要替自己的產品建評測，第一批題目從哪來、要幾題、怎麼定義要量什麼？ |
| 22 | 自己建：評分器 | 用 exact match、執行測試還是 LLM 評審，評分器本身怎麼驗證？ |
| 23 | 自己建：跑起來與報告 | 怎麼把評測跑得可重現、隔離、留紀錄，結果怎麼附誤差報告？ |
| 24 | 自己建：維護與退役 | 評測集上線後怎麼防污染、換題，什麼時候該退役？ |

還沒上線的篇次先列標題，寫好後會補上連結。

## 從哪一篇開始讀

依你手上的問題挑路線：

- **只想看懂廠商的發布表**：本篇 → 第 2 篇（誤差）→ 第 6 篇（設定）→ 第 20 篇（檢查清單）。四篇讀完，下次看到「我們在 X 上領先 2 分」，你會先去找題數和設定。
- **要替自己的產品建評測**：本篇 → 第 1 篇（零件）→ 第 2 篇 → 第 21–24 篇。第 21 篇開頭有一張「失真機制 → 建題時的對應做法」對照表，想先知道要防什麼再回頭補第 3–9 篇也可以。
- **在意某一個 benchmark**：直接跳到第 10–18 篇對應的那篇，從開頭的踩坑小表連回機制篇。

站上幾篇較早的文章可以當旁支：[〈模型成績單怎麼看〉](/posts/ai/2026-08-26-understanding-ai-models-evaluation)用一篇講完挑分數、污染、飽和三個陷阱，適合想先有個整體印象的人。[〈2026 Coding Benchmark 怎麼讀〉](/posts/ai/2026-08-26-coding-benchmarks-how-to-read)橫向比較六個 coding benchmark。[〈AI 模型評測來源指南〉](/posts/tech/2026-08-24-ai-model-evaluation-sources)整理去哪裡找評測，包含這個系列不談的多模態與語音。

## 這個系列不涵蓋的

- **偏英文、文字與程式**。挑哪些 benchmark 來寫，是從 Epoch 收錄的清單與大廠技術報告出發，所以偏向前沿實驗室會回報的那些。影像、影片、語音生成的評測不在範圍內，見上面的評測來源指南。
- **中文只談簡中與繁中**，集中在第 18 篇；日韓與其他語言只帶過。
- **統計只講到能判斷的程度**。標準誤、信賴區間的公式放在折疊區，不做完整推導。
- **排行榜數字會過期**。文中引用的名次與分數都標出處與時間，讀的時候以那個時間點為準。

## 自我檢查

1. 廠商表上兩個模型差 2 分，你最先要問什麼？判準：答到下面任一個就算過。
   - 誤差：這份 benchmark 有幾題，2 分在不在誤差內（第 2 篇）。
   - 設定：兩個分數是不是用同一套外殼、同一個推理強度、同一家 API 跑的（第 6 篇）。
   - 題目來源：題目公開多久了，模型有沒有可能看過（第 3 篇）。
2. 不看上面的圖，說出一個 benchmark 分數經過的五個環節，並各舉一個你會追問的問題。參考答案：
   - 出題：題目是不是公開的？量的是不是我在意的能力？
   - 評分：標準答案有沒有已知錯誤？什麼都不做會拿幾分？
   - 執行：用哪套外殼、哪家 API、什麼推理強度？
   - 報告：幾題、跑幾次、有沒有附誤差？
   - 排行榜：是單次，還是多次裡最好的一次？跟誰比？

## 參考資料

- [Holistic Agent Leaderboard: The Missing Infrastructure for AI Agent Evaluation（Kapoor et al., 2025）](https://arxiv.org/abs/2510.11977)
- [Why benchmarking is hard（Epoch AI, Gradient Updates, 2025-12）](https://epoch.ai/gradient-updates/why-benchmarking-is-hard)
- [Epoch Capabilities Index：資料與前處理說明（Epoch AI）](https://epoch.ai/data/eci-documentation/data)
- [Measuring Massive Multitask Language Understanding（MMLU, 2020）](https://arxiv.org/abs/2009.03300)
- [GPQA: A Graduate-Level Google-Proof Q&A Benchmark（2023）](https://arxiv.org/abs/2311.12022)
- [Introducing SWE-bench Verified（OpenAI, 2024）](https://openai.com/index/introducing-swe-bench-verified/)
- [Why SWE-bench Verified no longer measures frontier coding capabilities（OpenAI, 2026-02）](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)
- [Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference（2024）](https://arxiv.org/abs/2403.04132)
- [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains（2024）](https://arxiv.org/abs/2406.12045)
- [Establishing Best Practices for Building Rigorous Agentic Benchmarks（ABC, 2025）](https://arxiv.org/abs/2507.02825)
- [Measuring what Matters: Construct Validity in Large Language Model Benchmarks（Bean et al., 2025）](https://arxiv.org/abs/2511.04703)
- [Adding Error Bars to Evals: A Statistical Approach to Language Model Evaluations（Miller, 2024）](https://arxiv.org/abs/2411.00640)
- [The Leaderboard Illusion（2025）](https://arxiv.org/abs/2504.20879)
- [模型成績單怎麼看](/posts/ai/2026-08-26-understanding-ai-models-evaluation)
- [2026 Coding Benchmark 怎麼讀](/posts/ai/2026-08-26-coding-benchmarks-how-to-read)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)
