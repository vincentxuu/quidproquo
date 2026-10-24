---
title: "怎麼判斷資安工具的宣稱：OWASP 清單、benchmark 與「已併入某大廠」的檢查表"
date: 2026-10-24
category: ai
type: guide
tags: [security, ai-agent, owasp, benchmark, source-evaluation]
lang: zh-TW
series:
  name: "AI Agent 資安工具地圖"
  order: 8
tldr: "看到『涵蓋 OWASP 10/10』『已併入 Microsoft 與 Cisco』『偵測率 9X%』時，問五題：誰說的、這個詞指什麼、誰出的題、量的是什麼、一手來源在哪。前七篇的案例剛好各示範一題：微軟 toolkit 自己寫 7 項完整、3 項部分；ATR 併入各家的 PR 都是作者自己提的；Cisco 自己量的偵測率和獨立研究量的差好幾倍；常見的 benchmark 評的是模型或 agent，不是掃描工具。"
description: "用 OWASP Agentic Top 10 與 LLM Top 10 2026 當共同詞彙，整理標準、工具與 benchmark 的差別，並用前七篇的案例示範一份五題檢查表，拆解資安工具的涵蓋率、併入、偵測率等宣稱。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-10-24-judging-security-tool-claims-en)

這是系列的最後一篇，不介紹新工具。前七篇每一類工具都附帶了一堆數字與宣稱，這一篇把我用來拆解它們的問題整理成一份檢查表，並先交代它們共同使用的詞彙。

## 先認識兩份清單的名字

資安工具的 README 常出現 `ASI03` 或 `LLM01:2026` 這類編號，這些來自 OWASP 的兩份清單。清單是詞彙，不是工具，也不是測試標準：它告訴你風險叫什麼名字，不告訴你某個工具能抓到多少。

**OWASP Top 10 for Agentic Applications（2025 年 12 月發布），針對會自己行動的 agent：**

| 編號 | 名稱 |
|---|---|
| ASI01 | Agent Goal Hijack（目標被劫持） |
| ASI02 | Tool Misuse & Exploitation（工具誤用與利用） |
| ASI03 | Identity & Privilege Abuse（身分與權限濫用） |
| ASI04 | Agentic Supply Chain Vulnerabilities（agent 供應鏈弱點） |
| ASI05 | Unexpected Code Execution (RCE)（非預期的程式碼執行） |
| ASI06 | Memory & Context Poisoning（記憶與上下文污染） |
| ASI07 | Insecure Inter-Agent Communication（agent 之間的不安全通訊） |
| ASI08 | Cascading Failures（連鎖失效） |
| ASI09 | Human-Agent Trust Exploitation（利用人對 agent 的信任） |
| ASI10 | Rogue Agents（失控的 agent） |

官方只有 ASI01 到 ASI10。如果在某個工具裡看到 ASI16，我查不到任何官方來源。

**OWASP Top 10 for LLM Applications 2026（v1.0，2026 年 8 月發布），針對把模型當元件的應用。** 依該 PDF 目錄：LLM01 Prompt Injection、LLM02 Sensitive Information Disclosure、LLM03 Excessive Agency、LLM04 Supply Chain、LLM05 Data and Model Poisoning、LLM06 Unbounded Consumption、LLM07 Misinformation、LLM08 Hidden Context Exposure、LLM09 Vector and Embedding Weaknesses、LLM10 Improper Output Handling。我只讀了該 PDF 的目錄與附錄的對照表，沒有讀各項的內文。

編號要連年份一起看：2025 版的 LLM03 是 Supply Chain，2026 版的 LLM03 變成 Excessive Agency。舊文章或工具若沿用 2025 編號，同一個編號會指向不同的風險。

兩份清單的分界，是 LLM 清單自己寫的：模型是應用裡的一個元件時，風險歸 LLM 清單；一旦模型變成會行動的主體，風險就移到 Agentic 清單。

## 標準、工具、benchmark 是三種東西

| | 它是什麼 | 例子 | 它不是 |
|---|---|---|---|
| 清單／標準 | 給風險命名的詞彙 | OWASP 兩份 Top 10 | 不是測試，不能「通過」 |
| 工具 | 偵測或防禦的程式 | 第 1 到 7 篇的所有工具 | 不等於它自稱涵蓋的清單項目 |
| benchmark | 一組題目加計分方式 | AgentDojo、Agent Security Bench | 不等於部署後的實際表現 |

很多宣稱的毛病，就是把三者混為一談：用清單的名字當工具的功能，用 benchmark 的分數當工具的安全性。

## 五題檢查表

### 1. 誰說的，和被說的東西有沒有利害關係

- ATR 的 README 說規則已併入 Microsoft、Cisco 等。我逐一查了，PR 確實都合併了，但全部是 ATR 作者本人提的，由對方專案的維護者合併。這證明作者積極投稿，不等於這些公司把它當標準；微軟的工具本身也寫明不依賴它，只放在範例目錄。
- AVE 漏洞資料庫的治理文件寫明目前由單一廠商的創辦人維護，它的參考實作是那家廠商自己的掃描器。
- NVIDIA 的 SkillEvaluator 用 NVIDIA 自己的掃描器把關自家的 skill 目錄，這是內部流程，不是評掃描器的 benchmark。

利害關係不代表說謊，但要先揭露，再看它能不能被別人複查。

### 2. 這個詞到底指什麼

- 微軟 Agent Governance Toolkit 的 repo 描述說涵蓋 OWASP Agentic Top 10 的 10 項，它自己的對照文件卻寫 7 項完整、3 項部分，並註明是內部自評，不是認證（[第 3 篇](/posts/ai/2026-10-24-agent-guardrails-hooks-gateways)）。
- 「已併入」要看是誰提的 PR、誰合併、宿主專案的 README 怎麼寫。
- 「Cisco 的 skill-scanner 抓到 X%」要看是規則還是加上 LLM、算哪一級以上的告警才算抓到（[第 1 篇](/posts/ai/2026-10-24-skill-mcp-pre-install-scanners)）。

### 3. 誰出的題，分母是什麼

- Cisco 自己量的規則偵測率（HIGH 以上）是 7.7%，同一份切分由獨立研究重跑得到 2.5%，信賴區間不含 7.7%。兩邊都說靜態規則抓不到多少，但具體數字不能互相引用。
- Cisco 自己也說規則包是對那份資料集的開發部分調整的：在開發部分的成績約 31%，在沒見過的來源上只有約 8%。所以看偵測率，要看它是在開發用的樣本還是陌生樣本上量的。
- ATR 自己報告對 garak 資料集的 92.3% 偵測率，其中 130 條規則是依那份資料集寫的，拿掉這些規則後降到 65.4%。這是 ATR 自己公開的限制。
- 第 6 篇的攻擊成功率也是一樣的問題：攻擊者模型、judge、分母要先一致。

### 4. 量的是什麼

常被引用的 benchmark 大多評的是模型或 agent，不是掃描器或護欄：

- AgentDojo 評的是 agent（模型加管線）抗 prompt injection 的能力。防禦工具只是被當管線零件放進去比，沒有獨立的偵測召回率。美國 NIST 的 CAISI 用它時發現，針對特定模型調整攻擊後，攻擊成功率從 11% 升到 81%，靜態攻擊會低估風險。
- Agent Security Bench 的七個指標裡有誤報率與漏報率，但只用在其中兩個偵測型防禦，而且只針對記憶污染。
- 我找到的、直接量偵測工具能力的獨立研究只有兩類：一是針對 skill 的 MalSkillBench，結果顯示專用偵測器在程式碼注入上召回率很高，在 prompt injection 與 agent 控制類攻擊上崩落，只用野外樣本計分還會讓排名差到 66 個召回點；二是針對 prompt injection 分類器的研究，顯示在一個 benchmark 上的排名搬到另一個幾乎不成立，例如在某個資料集上最好的偵測器，在 AgentDojo 上只抓到 2%。這兩項我讀的是摘要與部分內文。

所以「偵測率 9X%」要問：在哪一組樣本、誤報多少、樣本和工具的開發是不是同一批人。

### 5. 一手來源在哪

回到清單原文、論文、宿主專案的 README 與 PR 記錄，而不是介紹文章。這個系列的第三方報導，不少其實是在轉述同一個來源（第 7 篇的 ARTEX 與 HexStrike 就是例子）。

## 實際練習：把前七篇的宣稱過一遍

| 宣稱 | 該查什麼 | 查到的 |
|---|---|---|
| 「涵蓋 OWASP 10/10」 | 工具自己的對照文件 | 7 項完整、3 項部分，內部自評 |
| 「已併入 Microsoft、Cisco」 | 誰提 PR、宿主 README | PR 是作者自己提的；微軟寫明不依賴 |
| 「規則偵測率 X%」 | 誰出題、哪一級告警 | 自量 7.7%，獨立重跑 2.5% |
| 「在 benchmark 上排第一」 | benchmark 量的是什麼 | 多半量模型，不量工具 |
| 「在生產環境部署」 | 開源版與內部版是否同一份 | ADR 的開源版不含阻擋元件 |

## 自我檢查

問題：兩份報告都寫「攻擊成功率 5%」，可以直接比較嗎？答案：不行，要先確認攻擊者模型、judge 和分母是否相同（第 6 篇）。

問題：「這個專案已併入 Microsoft 與 Cisco」，怎麼確認？答案：看是誰提的 PR、誰合併、宿主專案的 README 怎麼描述它。ATR 的 PR 是作者自己提的，微軟那邊寫的是不依賴它。

## 整體來說

整個系列的一個結論是：目前沒有任何單一工具足以當唯一的防線，也沒有中立的 benchmark 能替你量工具的偵測力。你能做的是把每一則宣稱都放進同一份檢查表，查得到來源的才採信，查不到的就當成「未驗證」。這份檢查表本身也有限制：它只能告訴你宣稱站不站得住，不能告訴你工具在你的環境好不好用，那要自己實測。

## 參考資料

- [OWASP Top 10 for Agentic Applications](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)
- [AgentDojo（arXiv:2406.13352）](https://arxiv.org/abs/2406.13352)
- [NIST CAISI：Strengthening AI Agent Hijacking Evaluations](https://www.nist.gov/news-events/news/2025/01/technical-blog-strengthening-ai-agent-hijacking-evaluations)
- [Agent Security Bench（arXiv:2410.02644）](https://arxiv.org/abs/2410.02644)
- [MalSkillBench（arXiv:2606.07131）](https://arxiv.org/abs/2606.07131)
- [Passing the Test You Trained On（arXiv:2610.03448）](https://arxiv.org/abs/2610.03448)
- [MaliciousSkillBench（arXiv:2608.19901）](https://arxiv.org/abs/2608.19901)
- [Agent-Threat-Rule/agent-threat-rules](https://github.com/Agent-Threat-Rule/agent-threat-rules)
- [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit)
- [系列起點：AI Agent 資安工具地圖](/posts/ai/2026-10-24-ai-agent-security-tooling-map)
- [上一篇：用 AI 打別人的工具與雙用途風險](/posts/ai/2026-10-24-ai-pentest-agents-dual-use)
