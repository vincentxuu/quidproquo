# 證據紀錄：怎麼判斷資安工具的宣稱（series order 8）

讀取程度說明：「查證依據」欄是 2026-10-24 獨立 post-verify 子代理（`review-verify-b4.md`）回到一手來源核對的結果；我沒有重新打開這些網址，只核對稿上現在的寫法與子代理確認的一致。標「未驗證」者代表沒有人讀到一手原文。

| 正文主張 | 一手來源 | 查證依據 | 備註 |
|---|---|---|---|
| OWASP Top 10 for Agentic Applications 2025 年 12 月發布，ASI01–ASI10 十個名稱 | https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/ ；https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/ | 子代理核對（頁面日期 December 9, 2025） | 少數第三方名稱略異，以 OWASP 為準 |
| 官方只有 ASI01–10，看不到 ASI16 官方來源 | 同上；MS 對照文件也寫 ASI11 非官方 | 缺席證據，措辭得當 | — |
| LLM Top 10 2026 於 2026 年 8 月發布，LLM01–LLM10 名稱 | https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/ ；https://www.imperva.com/blog/owasp-llm-top-10-2026-what-changed/ | 子代理核對（August 3, 2026） | 「v1.0」未驗證，稿上仍寫 v1.0 |
| 2025 版 LLM03 是 Supply Chain，2026 版 LLM03 是 Excessive Agency | Imperva 對照表 | 子代理核對 | Confirmed |
| 兩份清單的分界（模型是元件→LLM 清單；成為行動主體→Agentic 清單） | OWASP LLM Top 10 2026 PDF 的界線說明 | 引自研究筆記，子代理沒有重讀 PDF | 稿上已寫明只引目錄、附錄對照表與界線說明 |
| 微軟 Agent Governance Toolkit：repo 描述 10/10，對照文件 7 Full／3 Partial（ASI04、ASI06、ASI09），內部自評非認證 | https://microsoft.github.io/agent-governance-toolkit/compliance/owasp-agentic-top10-architecture/ ；repo 描述 | 子代理核對原句 | Confirmed |
| ATR 規則併入 Microsoft、Cisco 的 PR 都是 ATR 作者本人提的（Cisco skill-scanner #99、AGT #3025、PyRIT #1715） | https://github.com/cisco-ai-defense/skill-scanner ；https://github.com/microsoft/agent-governance-toolkit ；https://github.com/microsoft/PyRIT ；README https://github.com/Agent-Threat-Rule/agent-threat-rules | 子代理逐一核對這三處 | 其他宣稱併入的專案（如 Gen Digital Sage #33，作者欄為另一帳號）未逐一核對，稿上已限縮為「三處」 |
| 微軟自己不依賴 ATR，規則包 2026-07-30 已移出，只留 example 目錄（AGT PR #3451） | ATR README §6 | 子代理核對 | Confirmed |
| ATR 對 garak 野外越獄語料 650 筆：hunt 92.3%／enforce 0.9%；130 條規則參考該語料，移除後 hunt 65.4%（425/650） | ATR README | 子代理核對原句 | garak-full 3,475 筆只有 57.2%／0.5%，稿上沒放 |
| AVE 治理文件：由單一廠商創辦人維護，參考實作是該廠商掃描器 | https://raw.githubusercontent.com/aveproject/ave/main/GOVERNANCE.md ；AVE README | 子代理核對 | Confirmed |
| SkillEvaluator 是 NVIDIA 審自家 skill 目錄的流程，用 NVIDIA 自己的掃描器 | 無連結（研究筆記引 NVIDIA 的 README） | 未驗證：子代理沒重讀，筆記讀了 README 約 70% | 稿上寫「依其公開文件」但沒有連結 |
| Cisco 規則偵測率 7.7%（HIGH 以上）、誤報率 4.0%，frozen test split 839 惡意／545 良性 | https://github.com/cisco-ai-defense/skill-scanner README | 子代理核對原句 | Confirmed |
| Cisco 開發部分約 31%，沒見過的來源約 8%（MEDIUM 以上，31.43→31.94%、holdout 7.75%、7.99%） | Cisco releases／measured-results | 子代理核對 | 31% 與 7.7% 門檻不同，稿上已說明 |
| 獨立研究重跑得 2.5%，信賴區間不含 7.7% | MaliciousSkillBench https://arxiv.org/abs/2608.19901 （Table 3 CI [1.5, 3.6]） | 子代理核對摘要與 source-disjoint 設定；CI 數字來自筆記 | 該研究用本機相容環境、依賴版本偏差，稿上已加限定 |
| AgentDojo 評 agent（模型加管線）抗 prompt injection | https://arxiv.org/abs/2406.13352 ；NIST 文 | 子代理核對 | Confirmed |
| NIST CAISI：最強基線 11% → 最強新攻擊 81%，升級版 Claude 3.5 Sonnet、Workspace 環境 | https://www.nist.gov/news-events/news/2025/01/technical-blog-strengthening-ai-agent-hijacking-evaluations | 子代理核對 | Confirmed |
| Agent Security Bench 七個指標含 FPR/FNR | https://arxiv.org/abs/2410.02644 | 子代理只驗到摘要「7 evaluation metrics」 | 未驗證：「只用在兩個偵測型防禦、只針對記憶污染」來自筆記讀了約 40% 的結果，未回論文表 4 核對 |
| MalSkillBench：摘要說偵測器在 PI 崩落，內文顯示最強者 PI 仍 97.6%；單一工具召回率最多差 66.3 點 | https://arxiv.org/abs/2606.07131 §4.5 | 子代理核對摘要與內文 | 論文摘要與內文自相矛盾，稿上兩邊都寫 |
| 一個資料集上最好的偵測器，在 1% 誤報率下只抓到 AgentDojo 注入的 2% | https://arxiv.org/abs/2610.03448 | 子代理核對摘要 | 1% FPR 條件已補 |
| ADR 開源版不含阻擋元件 | ADR README（"ADR Prevention … is not included in the current open-source release"） | 子代理核對原句，但沒有記錄 repo 網址 | 稿上沒有連結，ADR 也未在稿上定義，待補 |
| 「我找到的獨立量測偵測工具的研究只有兩類」 | 無 | 缺席證據 | 稿上有「我找到的」限定 |

## 沒有放進正文的東西
- 87% precision 宣稱：本系列沒有任何一篇用過，加進來等於新增案例，不放。
- Gen Digital Sage #33：作者欄為另一帳號，未查清，不放。
