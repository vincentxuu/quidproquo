---
title: "AI Agent Arxiv Digest — 2026-07-23"
date: 2026-07-23
category: daily
tags: [ai-agent, arxiv, daily, agent-evaluation, agent-coding, agent-tool-use]
lang: zh-TW
description: "今天三篇的共同主題是：**我們測 agent 的方式，本身就有問題**"
tldr: "今天三篇的共同主題是：**我們測 agent 的方式，本身就有問題**。第一篇直接審計主流工具呼叫 benchmark，發現近兩成的分數是評錯的；第二篇用重播分析告訴你哪些 benchmark 不用跑完就能得出可靠結論（SWE-bench 是反例）；第三篇推出首個將「執行任務」與「生成操作教學」合二為一的多模態 web agent benchmark，截圖輸入、雙目標評測，最強模型也只完成不到四成。三篇合讀能讓你對 agent 評測的現況有完整的危機感與應對方向。"
series:
  name: "AI Agent Arxiv Digest"
  order: 60
---
> 🌏 [English version](/en/posts/daily/2026-07-23-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇的共同主題是：**我們測 agent 的方式，本身就有問題**。第一篇直接審計主流工具呼叫 benchmark，發現近兩成的分數是評錯的；第二篇用重播分析告訴你哪些 benchmark 不用跑完就能得出可靠結論（SWE-bench 是反例）；第三篇推出首個將「執行任務」與「生成操作教學」合二為一的多模態 web agent benchmark，截圖輸入、雙目標評測，最強模型也只完成不到四成。三篇合讀能讓你對 agent 評測的現況有完整的危機感與應對方向。

## 讀這篇前該知道的詞


| 白話解釋 | 詞 |
|---|---|
| 讓 LLM 在推理過程中決定「要呼叫哪個外部工具、帶什麼參數」，是 agent 的核心技能 | Tool calling / Function calling |
| 一組標準化任務與評分規則，讓不同模型在同樣條件下比較——名次差幾名可能牽涉百萬選型決策 | Benchmark |
| 用規則（字串比對、狀態機）自動判斷對錯的評估程式，速度快但容易死板 | Deterministic evaluator |
| 用另一個大模型來打分，靈活但會有「每次跑分數不一樣」的一致性問題 | LLM-judge |
| 在網頁截圖上標出所有可互動元素並加上編號，讓模型用「點選第 3 號按鈕」這種方式操作，避免直接輸出像素座標 | Set-of-Mark (SoM) |


---


## 論文一｜Benchmarking the Benchmarks: A Validity Audit of Tool-Calling Evaluation

**作者**: Jay Vaghasiya, Vishvesh Bhat, Muhammad Ahmed Mohsin, Asad Aali（CoreThink AI & Stanford University）　·　**arxiv**: 2607.02577
**連結**: [arxiv](https://arxiv.org/abs/2607.02577) · [alphaxiv](https://www.alphaxiv.org/abs/2607.02577)

### TL;DR

你在看的工具呼叫排行榜（BFCL、MCP-Atlas 等）有 18.5% 的題目被判錯了；LiveMCPBench 同一組設定重跑 23 次，分數差距達 18.9 個百分點。

### Read Priority

必讀
如果你的團隊曾用 BFCL 或類似 benchmark 排名來選模型、評估 agent 工具呼叫能力，這篇直接衝擊你的決策基礎。

### 領域背景

工具呼叫是 agent 的核心：讓 LLM 判斷何時、用什麼參數呼叫外部工具（查資料庫、打 API、執行程式）。近兩年 BFCL、τ2-Bench、LiveMCPBench、MCP-Atlas 等 benchmark 陸續出現，業界幾乎直接用排行榜分數做模型採購決策。但這些評測本身準嗎？從沒人系統驗證過。

### 中階導讀


#### 問題

你打開 BFCL 排行榜，看到模型 A 比模型 B 高 5 分，就選 A。但如果 benchmark 有 18.5% 的題目被判錯——換句話說，每 5 題就有近 1 題算錯——你的選型結論可能剛好是反的。

#### 方法

研究者從 BFCL v4、τ2-Bench、LiveMCPBench、MCP-Atlas 四個主流 benchmark 共抽出 496 道任務，由人類專家逐題核對評測器的判斷，整理出評測器與人類不一致的所有案例，並歸納成可重現的失敗模式分類法。

#### 為什麼重要

agent 平台在評估第三方模型、向客戶展示測試結果、或設計 CI pipeline 時，都高度仰賴這些 benchmark。若分數本身不可信，整個評測流程的可靠性需要重建。這篇給出的失敗模式分類讓你知道在哪裡補防。

### 深入要點

- 496 道任務人工核對，共發現 92 處評測器與人類不一致，**整體誤判率 18.5%**（來源：論文 Table 1）
- **確定性評測器（deterministic evaluator）失敗模式**：brittle state matching（只比對字串不比語意）、trajectory lock-in（只接受唯一解題路徑，其他正確走法算錯）、incorrect ground truth（答案本身就標錯了）、substring-based communication failures、reward-basis misalignment
- **LLM-judge 評測器失敗模式**：rubric drift（評分標準在不同題目間漂移）、hallucinated completion（LLM 幻覺任務已完成）、answer-only scoring（只看結果忽略過程）、substantial run-to-run variance（同題重複跑分數不同）
- **LiveMCPBench 穩定性極差**：同一組 setup 重複執行 23 次，得分從 57.9% 跑到 76.8%，**相差 18.9 個百分點** ⚠️——這個波動幅度已足以翻轉排行榜名次，讓你選出完全不同的模型
- 四個 benchmark 分為 rule-based（BFCL v4、MCP-Atlas）和 LLM-judge（τ2-Bench、LiveMCPBench）兩類，兩類都有系統性問題但失敗模式不同
- Limitation：抽樣審計 496 題，非全集；未涵蓋所有現有 benchmark
- 與 LangGraph / AutoGen 等 framework 的關聯：若用上述 benchmark 做 CI regression test，同樣面臨分數不穩定問題，建議加入人工抽查或多次重跑取均值

### Reviewer 一句話評

數據確鑿、問題真實，18.5% 誤判率和 18.9pp 重複波動是很有說服力的具體數字。但這篇偏審計報告，較少建設性的修正建議——指出問題後的解決路徑仍需後續工作填補。整體紮實，但停在診斷層面，稍嫌保守。

### 給你的 take-away

- 引用 BFCL 或 LiveMCPBench 分數做模型比較時，先確認兩模型的分數差距是否大於 20pp；差距更小的比較結論很可能因誤差而失效
- 建內部評測時，優先採「deterministic evaluator + 人工抽查 10%」混合策略，避免單純依賴 LLM-judge 帶來的 run-to-run 波動

---


## 論文二｜How Many Tasks Are Enough for Agent Benchmark Decisions? A Replay Analysis of Public LLM Agent Benchmarks

**作者**: Wei-Jung Huang（機構未詳）　·　**arxiv**: 2607.12338
**連結**: [arxiv](https://arxiv.org/abs/2607.12338) · [alphaxiv](https://www.alphaxiv.org/abs/2607.12338)

### TL;DR

跑完全部任務才能比較兩個 agent？AppWorld 跑 15%、tau-bench 跑 25% 就夠了；SWE-bench 例外——幾乎要跑到 90% 以上才能信任結論。

### Read Priority

略讀
如果你在做 agent 研究或設計評測流程想降低成本，這篇直接告訴你哪些 benchmark 可以提早停。純平台工程師可先看 TL;DR 和深入要點即可。

### 領域背景

跑一次完整 agent benchmark 極為昂貴：SWE-bench 可能要花數天與數千美元 API 費用。研究者常被迫在跑到一半時就停下來比較，但「提早結論」到底可不可靠？過去沒有量化答案。這篇透過重播（replay）已公開的完整任務紀錄，回答這個問題。

### 中階導讀


#### 問題

想像你要比較兩個 coding agent，完整跑完 SWE-bench 要三天。你的 PM 問：「跑一天夠嗎？」以前你只能憑直覺猜，現在有數據了。

#### 方法

作者不重新跑 agent，而是利用 SWE-bench、AppWorld、tau-bench 已公開的逐題結果（task-level records）做重播（replay）分析，模擬「跑到 X% 就停下」的場景。他設計了三個通過條件：①pairwise 比較結論與 full run 一致、②覆蓋所有任務分組（不能漏掉某類難題）、③未解決爭議比例低於容忍閾值。三個條件都達到才算「跑夠了」。

#### 為什麼重要

對維護內部 benchmark 的工程師、或需要頻繁比較新模型版本的 agent 平台團隊，知道評測可以「提早停」能大幅降低成本與決策週期。

### 深入要點

- 主要結論（strict 0pp threshold，5pp budget grid）：**AppWorld 跑 15% 就夠**；**tau-bench 跑 25% 就夠**；**SWE-bench Verified 需要跑到 90%**；**SWE-bench Lite 在 95% 前都未達標** ⚠️（來源：論文主要結果表）
- AppWorld 和 tau-bench 提早收斂的原因：任務間分數分布均勻，agent 間差異足夠大，pairwise 結論很快就穩定
- SWE-bench 難以提早收斂：任務難度分布極不均勻（少數超難題幾乎所有模型都錯），拿掉這些題目後 pairwise 排名容易翻轉
- 「跑 15% 就夠」≠「隨機取 15%」——必須確保覆蓋所有任務分組，否則偏取容易題或難題都會讓結論失真
- Limitation：這篇屬 retrospective study，使用已有的完整紀錄做回顧；現實中你事先不知道 full run 結論，15% 的建議需搭配分層抽樣才有效
- 與 coding agent CI 的關聯：若用 SWE-bench 做版本 regression test，需接受「幾乎每次都要完整跑」的現實，建議另找更輕量的代理 benchmark

### Reviewer 一句話評

分析思路嚴謹、數字明確，但屬回顧性研究——現實中你不知道 full run 長什麼樣，所以「15% 就夠」的結論是有條件的。對想降低評測成本的研究者很有參考價值，但直接套用在工程流程前需仔細設計抽樣策略。

### 給你的 take-away

- 使用 AppWorld 或 tau-bench 比較 agent 時，可先跑 20-30% 任務（確保分層抽樣），快速得到初步排名，再決定是否跑完整
- SWE-bench 幾乎要完整跑才能信任，建議把它定位成「完整驗收測試」而非「快速篩選工具」

---


## 論文三｜MAG: A Web-Agent Benchmark and Harness for Multimodal Action and Guide Generation

**作者**: Chengguang Gan, Hanjun Wei, Yunhao Liang, Zhixi Cai, Qinghao Zhang, Shiwen Ni（University of Chinese Academy of Sciences、Monash University、Pusan National University、Shenzhen University of Advanced Technology）　·　**arxiv**: 2607.10079
**連結**: [arxiv](https://arxiv.org/abs/2607.10079) · [alphaxiv](https://www.alphaxiv.org/abs/2607.10079)

### TL;DR

首個把「完成網頁任務」和「生成操作教學」合為一個 benchmark 的多模態評測，完全基於截圖；目前最強模型任務完成率低於 40%，GRPO 訓練讓 9B 小模型完成率從 6.9% 近乎翻倍到 13.2%。

### Read Priority

必讀
如果你在做 web agent、computer-use agent，或需要「agent 自動生成 SOP 教學文件」功能，MAG 的設計直接對應這個使用場景，值得仔細看。

### 領域背景

Web agent 研究長期分成兩條平行賽道：「完成任務」（幫你填表訂票）和「生成教學文件」（錄下操作步驟供人學習）。現有 benchmark（如 WebArena、VisualWebArena）多用 DOM 樹或 accessibility tree 的文字表示餵模型，而非人類實際看到的視覺截圖，與真實 computer-use agent 部署方式有落差。MAG 把兩條賽道合一，且全部基於截圖作為輸入。

### 中階導讀


#### 問題

假設你要做一個「幫使用者在電商平台下單並同步生成操作 SOP 教學」的 agent，現有 benchmark 要嘛只測你能不能下單成功，要嘛只測你能不能寫出好教學，沒有同時測兩者的標準。MAG 就是來填這個缺口的。

#### 方法

MAG 設計了「雙目標任務（Multimodal Action + Guide）」：agent 不只要在真實瀏覽器環境中完成網頁任務，還要同步生成對應操作教學文字。輸入僅為截圖（不給 DOM），提供兩種元素定位方式：**Set-of-Mark**（在截圖上標記可點擊元素並編號）和**原始像素座標**（pixel coordinates）。整個評測框架含 LLM 輔助標注加人工驗證、訓練流程、live 瀏覽器評估環境、以及動作與教學的聯合評測指標。研究者也用 GRPO（Group Relative Policy Optimization，一種強化學習方法）搭配 expert trajectory 來訓練小模型。

#### 為什麼重要

agent 平台若要提供「邊做邊教」或「自動生成 SOP 文件」功能，MAG 是目前最貼近此場景的公開 benchmark。截圖輸入設計也更接近 computer-use agent 的真實運作方式，比 DOM-based 評測更難迴避（模型無法靠 DOM 走捷徑）。

### 深入要點

- 即使當前最強 frontier 模型，任務完成率也**低於 40%** ⚠️（來源：論文主要結果；未具體指明模型名稱），顯示 benchmark 還有大量提升空間，但也讓人質疑難度設計是否略為極端
- GRPO + expert trajectories 訓練：讓 **9B 參數小模型從 6.9% 提升到 13.2%**，幾乎翻倍；動作準確率和教學品質兩個指標同步改善（來源：論文訓練實驗部分）
- 兩種定位方案各有取捨：Set-of-Mark 直觀（模型只需選號碼）但需要額外前處理步驟；pixel coordinates 更通用但對模型空間感知要求更高
- 評測涵蓋 live 瀏覽器環境（非靜態截圖重播），評估更貼近真實部署但也讓大規模重現更困難
- Limitation：任務來源的多樣性未詳細揭露；「guide 品質」評測仍有主觀成分；GRPO 訓練只在 9B 模型上驗證，是否適用大模型待觀察
- 與 MCP browser tools 的關聯：MCP 目前提供 browser 工具但尚無標準化評測，MAG 可作為 browser-use agent 評測的對齊基準

### Reviewer 一句話評

合二為一的設計思路新穎，工程實作完整。但最強模型僅 <40% 完成率讓人疑慮——若所有模型都差不多差，benchmark 的鑑別力存疑。GRPO 訓練結果亮眼，但僅在 9B 小模型驗證，泛化性仍待觀察。整體是個有趣的方向但還需要更多社群驗證。

### 給你的 take-away

- 如果你的 agent 需要「做完任務後輸出操作教學」，可以參考 MAG 的雙目標評測框架設計內部測試集，不用從零定義「動作+教學」的聯合評測指標
- 截圖 + Set-of-Mark 輸入比 DOM 更接近真實使用情境；若你在評估 computer-use agent 的輸入格式，這篇的實驗設計可作為參考基準


## 參考資料

- [arxiv:2607.02577](https://arxiv.org/abs/2607.02577)
- [arxiv:2607.12338](https://arxiv.org/abs/2607.12338)
- [arxiv:2607.10079](https://arxiv.org/abs/2607.10079)
