# 精讀批次

每批一個 agent，規格見 `agent-brief.md`，輸出到 `extracts/<批次>.md`。

| 批次 | 主題 | 指定來源 | 狀態 |
|---|---|---|---|
| A-methodology | 好 benchmark 的判準 | BetterBench（NeurIPS 2024 D&B）；Measuring what Matters: Construct Validity（arXiv 2511.04703）；Establishing Best Practices for Rigorous Agentic Benchmarks／ABC（NeurIPS 2025 D&B）；When AI Benchmarks Plateau（arXiv 2602.16763） | ✅ 完成，抽查 3 數字通過（τ-bench 38%、KernelBench 31%、BetterBench MMLU 5.5／GPQA 11.0） |
| B-contamination | 污染 | Are LLM Benchmarks Already Contaminated?（GEM 2026, doi 10.18653/v1/2026.gem-main.50）；Benchmarking LLMs Under Data Contamination: static to dynamic（EMNLP 2025）；A Careful Examination of LLM Performance on Grade School Arithmetic／GSM1k（arXiv 2405.00332）；LiveBench（arXiv 2406.19314） | ✅ 完成，抽查通過（GSM1k 最多掉 8%、1205 題、Spearman 0.36；LiveBench changelog 原句） |
| C-statistics | 統計雜訊與 harness | Adding Error Bars to Evals（Miller, arXiv 2411.00640）；Quantifying Variance in Evaluation Benchmarks（arXiv 2406.10229）；Holistic Agent Leaderboard（arXiv 2510.11977）；Epoch AI benchmarking FAQ／ECI methodology（epoch.ai/benchmarks/about、epoch.ai/eci） | ✅ 完成，抽查通過（CISPA 16.6 分、HAL 專用 scaffold 11/12 勝）；待核：Table A19 的 o4-mini 54% vs 6% 要看 PDF 原圖；待補精讀：Liu 2026（2611.04399）、Hardy 2026（2610.00651） |
| D-agent-validity | agent 評測失效與 reward hacking | Berkeley RDI trustworthy benchmarks 系列文；Do Agent Benchmarks Measure Capability? HackDetect（arXiv 2607.22368）；When Agent Evaluation Becomes Unreliable（arXiv 2610.16067）；METR reward hacking 報告（2025） | ✅ 完成，抽查通過（METR o3 RE-Bench 30.4%、HCAST 0.7%）；待補：posttrain.dev〈Clean on One Benchmark〉 |
| E-arena | 人類偏好排行榜 | Chatbot Arena（arXiv 2403.04132）；The Leaderboard Illusion（arXiv 2504.20879）；LMArena 官方回應；Arena style control 方法說明 | ✅ 完成，抽查通過（ArenaHard 23.5%→49.9%）；待補：Llama 4 Maverick 事件一手來源 |
| F-knowledge | 知識與推理 | MMLU（2009.03300）；MMLU-Pro（2406.01574）；Are We Done with MMLU?／MMLU-Redux（2406.04127）；GPQA（2311.12022）；Humanity's Last Exam（2501.14249）及勘誤 | ✅ 完成，抽查通過（MMLU-Redux 6.49%、GPQA 非專家 34%／37 分鐘）；待補：MMLU-Pro 選項捷徑兩篇（2507.15337、2409.02257）只讀摘要 |
| G-math | 數學 | FrontierMath（2411.04872）；Epoch FrontierMath 錯誤率與 v2 說明；MathArena（AIME 評測方法）；FrontierMath 資金揭露爭議的一手說明 | ✅ 完成，抽查通過（v2 changelog「corrected 123 … 12 … removed 5 … 7」）；待決：Tier 4「40%」與 changelog 算出 38% 不一致，寫稿引 changelog 原數並註明 |
| H-coding-terminal | coding 與終端機 | Terminal-Bench 論文；Harbor 文件；OpenAI Introducing SWE-bench Verified；SWE-bench Pro 論文；SWE-bench Verified 缺陷研究 | ✅ 完成，抽查通過（Verified 刪 68.3%、TB 摘要 89 題／表 2 用 74 題）；待補：SWE-bench Pro V2（2610.24206）全文、Epoch 對 TB 4.0 review |
| I-arc | 抽象推理 | On the Measure of Intelligence（1911.01547，讀第 I、III 部與 ARC 定義）；ARC Prize 2024 Technical Report；ARC-AGI-2 論文；ARC-AGI-3 現況 | ✅ 完成，抽查通過（ARC-AGI-1 私有集 49% 被合力解出、ARC-AGI-2「至少兩位非專家」）；注意：o3 成本有三版定價、排行榜為 2026-11-23 快照 |
| J-agent-env | agent 環境 | τ-bench（2406.12045）；τ²-bench；OSWorld（2404.07972）；WebArena（2307.13854）；GAIA（2311.12983） | ✅ 完成，抽查通過（OSWorld 人類 72.36%、WebArena 170 模板 vs 241 模板、78.24%）；待補：OSWorld 2.0 附錄、Epoch OSWorld review、arXiv 2611.14581 |
| K-horizon-econ | 長任務與經濟價值 | METR Measuring AI Ability to Complete Long Tasks（2503.14499）；METR time horizon 後續與批評；GDPval（OpenAI 2025）；Remote Labor Index | ✅ 完成，抽查通過（METR 207 天 CI 166–240；GDPval 47.6%、計入審查後 1.12–1.39 倍）；待查：METR Q4 文「105 天」計算區間 |
| L-aggregate | 聚合指數 | Epoch ECI 方法與 Bayesian 更新；Artificial Analysis Intelligence Index 方法頁；Benchmark Health Index（2602.11674） | ✅ 完成，抽查通過（BHI v3 158 個 benchmark；One Capability or Many 74.5%、R²=0.505）；待補：Balance of Benchmarks（2608.30044） |
| M-chinese | 中文與繁中 | C-Eval（2305.08322）；CMMLU（2306.09212）；TMMLU+（2403.01858）；VisTW（2503.10427） | ✅ 完成，抽查通過（TMMLU+ fertility r=−0.742；Global-MMLU 28%、84.9%）；待補：TAIDE／國科會評測一手文件 |
| N-building | 自己建 benchmark | Inspect 文件（UK AISI）；Harbor 任務撰寫文件；Anthropic agent eval 工程文章；Dynabench（2104.14337）；HELM（2211.09110 讀方法與分類部分） | ✅ 完成，抽查通過（Anthropic CORE-Bench 42%、HELM HellaSwag 79.1%→30.2%）；待驗：Harbor init 樣板與 v0.25 verifier 沙箱是否相容 |

## 補缺口（2026-11-24）

使用者指出規劃表交出時仍留可查缺口。以下各批要把缺口關成 ✅／⚪／✉️，不再留「寫該篇前補」。

| 批次 | 範圍 | 狀態 |
|---|---|---|
| O1-gaps | HAL Table A19 原表；Liu 2026；Hardy 2026；Balance of Benchmarks；METR 105 天；ConStat 27.15%／40%；MMLU 6.5% 出處 | ✅ 7/7 結案；抽查 ConStat 表列 39.40 與 27.15 屬實：表頭 δ̂＝39.40 為點估計、δ̂0.95＝27.15 為 95% 下界，GEM 綜述寫反 |
| O2-gaps | Llama 4 Maverick 一手；Min et al. 數百票；posttrain.dev；MMLU-Pro 捷徑兩篇；最長選項出處；TAIDE／Breeze 評測方法 | ✅ 6/6 結案；✉️ 兩項：LeCun FT 專訪原句（付費）、taide-bench 題目（需登入） |
| O3-gaps | SWE-bench Pro V2；Epoch TB 4.0 review、Vetto 4.1；OSWorld 2.0 附錄；Epoch OSWorld review／2.1；arXiv 2611.14581；SABER；Harbor init 與 verifier 沙箱（讀原始碼）；FrontierMath Tier 4 分母 | ✅ 7/8 結案、✉️ 1（FrontierMath Tier 4 分母，問題清單在 O3-gaps.md）；抽查通過（Harbor PR #3712 2026-10-19 合併；Pro V2 731→642） |
| P-saturation | 換關鍵字補搜發現的新線：評測意識（OpenAI eval-production gap 2026-11、Needham 2505.23836、Stuttgart 2605.05835、Decomposing 2605.23055、Eval Awareness Is Not One Capability 2606.23583）；測量科學（Stanford AI Measurement Science 教科書、AACL 2026 教程、Botter 2026 Measurement 期刊）；台灣在地題庫 CTT／IRT（IEEE CAI 2026, doi 10.1109/cai68641.2026.11536224）；Ouroboros of Benchmarking（NeurIPS 2025） | ✅ 9/11 讀完、✉️ 2（Botter 全文、工研院 CAI 論文）；抽查通過（OpenAI 63.1/63.4、91.6/17.6、10.2–37.4 pp；Knecht ≤3.7 pp）；建議補讀的 2610.12409 由主對話讀完（extracts/Q-harmbench.md） |
