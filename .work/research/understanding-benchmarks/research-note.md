# 認識 benchmark 系列：研究筆記

狀態：掃描與精讀完成（2026-11-23）。14 批精讀抽取紀錄在 `extracts/A–N`，每批由主對話回原文抽查 2–3 個數字皆通過（紀錄在 `reading-batches.md`）。規劃表：`.work/series-plans/understanding-benchmarks.md`。

## 站上既有盤點（缺口確認）

已有綜論三篇：
- `ai/2026-08-26-understanding-ai-models-evaluation`（模型成績單怎麼看：cherry-pick、污染、飽和、Arena Elo；認識 AI 模型系列）
- `ai/2026-08-26-coding-benchmarks-how-to-read`（六個 coding benchmark；認識 AI 模型系列）
- `tech/2026-08-24-ai-model-evaluation-sources`（評測平台與來源指南，含多模態、語音、embedding）

散在課程導讀的評估單元：CS224N 第 11 堂、CS336 第 12 堂、CS329Z 第 10／13 堂（Terminal-Bench 客座、四元組）、CS2680 第 7 堂（pass@k、洩漏）、CS329A 第 17 堂（長任務評估）、CME295 第 8 堂（LLM-as-judge 偏誤）、CS224U 行為評估。
評估工具文：Promptfoo、Braintrust、LangSmith、Galileo、Patronus、Phoenix、RAG 評估框架。
自建評測：私有語料 Retrieval Eval、Ask AI Retrieval Eval、Web Retrieval Benchmark。
排行榜快訊：AI Benchmark Watch（daily，12 組）。

缺口：沒有一條從「一個 benchmark 由什麼組成」→「分數為什麼會騙人」→「主要 benchmark 專案逐一解剖」→「怎麼讀發布表」的系列；個別 benchmark（Terminal-Bench、HLE、ARC-AGI、METR、GDPval、TMMLU+ 等）沒有專文，只在綜論裡一段帶過。

## 母群定義

公開、可重複執行、被模型開發者或獨立評測機構用來比較通用 AI 模型／agent 的評測集與排行榜，2018 年至今。
排除：只給單一應用內部用的 eval（客服 QA 集）、評估工具／框架本身（Promptfoo、Inspect 之類只在講 harness 時帶到）、純硬體效能 benchmark（MLPerf）、影像／影片／語音生成評測（既有來源指南已涵蓋）。

## 掃描方法與結果

1. Epoch AI Benchmarking Hub：登錄 99 個 benchmark；ECI 納入 58 個，分三類（Epoch 自跑 14、創作者自管 31、開發者自報 13）。🔎 https://epoch.ai/benchmarks/search 、https://epoch.ai/data/eci-documentation/data
2. 學術母群：Benchmark saturation 研究（60 個取自大廠技術報告，2026-02）、Benchmark Health Index（106 個取自 91 份 2025 技術報告，2026-02）、Oxford construct validity 系統性回顧（445 個頂會 benchmark，2025-11）、BetterBench（24 個依 46 項實務評分，NeurIPS 2024）。
3. 批評與稽核：Leaderboard Illusion（Arena，2025）、ABC Agentic Benchmark Checklist（NeurIPS 2025）、Berkeley RDI 自動 exploit 八個 agent benchmark、HAL Holistic Agent Leaderboard（2025-10）、HackDetect protocol validity（2026-07）、oracle failure 實證（2026-10）、污染偵測系統性回顧 55 篇（GEM 2026）。
4. 非英語：C-Eval、CMMLU、TMMLU+（COLM 2024）、VisTW、Multi-TW。

## 子問題（精讀時依此分組）

1. 一個 benchmark 由什麼組成？任務、資料、評分、harness、報告的分工與各自的失效點。
2. 分數為什麼會失真？污染、飽和、構念效度、harness／設定差異、統計雜訊、reward hacking、排行榜治理。
3. 主要 benchmark 家族各自量什麼、怎麼建、目前狀態與已知問題？
4. 聚合指數（ECI、Artificial Analysis）怎麼把多個分數合成一個，取捨在哪？
5. 中文／繁中 benchmark 的設計差異與限制。
6. 讀者實務：看到一張發布表時怎麼判讀；自己要做小評測時從哪開始。

## 覆蓋矩陣（初版）

| 維度 | 值 | 候選 | 缺口 |
|---|---|---|---|
| 能力類型 | 知識／推理 | MMLU 家族、GPQA、HLE、SimpleQA | |
| | 數學 | AIME、FrontierMath | |
| | 程式 | SWE-bench 家族、Aider、LiveCodeBench | 既有文已寫，系列內只補不重講 |
| | 終端機／agent | Terminal-Bench、τ-bench、OSWorld、WebArena、GAIA | |
| | 抽象推理 | ARC-AGI 1/2 | |
| | 長任務／經濟價值 | METR time horizons、GDPval、Remote Labor Index | |
| 評分方式 | 選擇題精確比對 | MMLU、GPQA | |
| | 執行驗證 | SWE-bench、Terminal-Bench | |
| | LLM-as-judge | WebArena 部分、HLE 部分？ | 精讀確認 |
| | 人類偏好 | Arena | |
| 資料來源 | 群眾／考試再利用 | MMLU、C-Eval、TMMLU+ | |
| | 專家出題 | GPQA、HLE、FrontierMath | |
| | 程序生成／動態 | LiveBench、ARC-AGI-2、Epoch Chess Puzzles | |
| 生命週期 | 已飽和／退役 | MMLU、HumanEval、GSM8K | |
| | 被發現有問題後修正 | SWE-bench → Verified、FrontierMath v1 錯誤率、OSWorld 壞網站 | |
| | 仍有鑑別力 | HLE、FrontierMath Tier 4、METR | |
| 管理方 | 開發者自報／創作者自管／第三方代跑 | ECI 三分類 | |
| 語言 | 英文／簡中／繁中 | C-Eval、CMMLU、TMMLU+ | 日韓與其他語言只在偏誤說明帶過 |

## 偏誤（初版）

- 母群來自 Epoch 與大廠技術報告，偏向前沿 lab 會報的 benchmark，偏英語、偏文字與程式。
- 多模態、語音、生成評測刻意排除（既有來源指南涵蓋）。
- 批評文獻多來自學界稽核團隊；廠商回應需要在精讀時補（例如 Arena 對 Leaderboard Illusion 的回應）。

## 來源讀取盤點

以各批抽取紀錄的「讀取狀態」為準（✅／🟡／⚪），本檔不重抄。仍為 🟡 或待補的項目集中在 `reading-batches.md` 狀態欄，寫到對應篇前補完。

跨批共通的引用規則（精讀發現的二手轉述錯誤）：
- GEM 2026 污染綜述的 6%–40% 是拼湊區間，且有三處引用錯誤（GSM1k ρ、ITD 歸屬、13B 微調歸屬）；數字一律回原論文引。
- METR 30.4% 只是 o3 在 RE-Bench；Berkeley／BenchJack 的「30%+」轉述錯誤。
- HackDetect 67% 來自預選或通過子集，不是盛行率。
- Leaderboard Illusion 112% 是 ArenaHard 靜態集勝率相對增幅。
- HLE 約 30% 錯誤率只適用純文字化學／生物子集。
- GSM1k 用現行版數字（最多掉 8%、1205 題、Spearman 0.36）。
- 飽和研究「近半數飽和」要附誤差公式的但書。
