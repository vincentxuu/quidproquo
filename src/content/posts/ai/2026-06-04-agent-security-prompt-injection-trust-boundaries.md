---
title: "Agent 安全的同一條裂縫：從 Prompt Injection、信任邊界到 Multi-Agent 蠕蟲"
date: 2026-06-04
category: ai
type: deep-dive
tags: [security, ai-agent, prompt-injection, multi-agent, llm]
lang: zh-TW
tldr: "三個聽起來不同的 agent 安全問題——tool output 注入、信任邊界、惡意 agent——根是同一個：LLM 把指令與資料攤平成同一條 token 串流，架構上無法區分。理解這條主線，就能看懂從 EchoLeak（CVE-2025-32711，zero-click）到 Morris II AI 蠕蟲的所有攻擊，以及為什麼「把模型調乖」沒用、只有架構約束（六大設計模式、CaMeL）有用。"
description: "整理 LLM agent 安全的三層威脅：prompt injection via tool outputs（EchoLeak 完整攻擊鏈）、信任邊界設計（Lethal Trifecta、六大設計模式、CaMeL）、multi-agent 惡意 agent（Morris II、Prompt Infection），以及 OWASP Agentic Top 10 與 NIST Zero Trust 的對應防禦。"
draft: false
glossary:
  - term: "EchoLeak"
    definition: "2025 年 6 月揭露的 Microsoft 365 Copilot 漏洞（CVE-2025-32711），第一個在生產 LLM 系統中被武器化的 prompt injection；zero-click——攻擊者寄一封 email 就能外洩資料，使用者完全不需點擊。"
    context: "本文以 EchoLeak 為旗艦案例拆解完整攻擊鏈。"
  - term: "Lethal Trifecta"
    aliases: ["致命三元組", "lethal trifecta"]
    definition: "Simon Willison 提出的快篩法則：存取私有資料、接觸不可信內容、可對外通訊——三者同時存在於同一個 session，就有資料外洩管道。"
    context: "本文用它作為判斷 agent 架構是否危險的最快方法。"
---

Agent 安全的討論常被拆成三個獨立題目：tool output 裡的 prompt injection、信任邊界該畫在哪、multi-agent 系統裡的惡意 agent。但這三題其實是**同一個根本缺陷在不同尺度上的展開**：

> LLM 把「指令」與「資料」壓進同一條 token 串流，模型在架構上**無法區分**哪些 token 是該執行的命令、哪些只是該閱讀的內容。

單一 prompt 尺度，這叫 prompt injection；單一 agent 系統尺度，這讓信任邊界無處可畫；multi-agent 尺度，一條注入的命令會自我複製成蠕蟲。把這條主線記住，後面全部是推論。

## 核心缺陷：data plane 與 control plane 在 Transformer 裡崩塌

傳統計算的安全建立在一條邊界上：data plane 載資料、control plane 載命令，CPU 用 privilege rings 和記憶體保護實體地強制這條界線。SQL injection、buffer overflow 全是「界線被跨過」的症狀，而修法（如 parameterized query）本質都是「讓資料維持資料」。

Transformer 沒有這條界線。Attention 不區分 system prompt、使用者輸入、retrieved document、tool output——全部攤平成單一 token 串流，全部參與 next-token prediction，因此在字面意義上全部「可執行」。2022 年命名「prompt injection」一詞的 Simon Willison 給出最精準的表述：**任何曾接觸過潛在惡意 token 的輸出，整個都被污染了**——能塞進自己 token 的攻擊者，應被視為對接下來發生的事擁有完整控制權，不只控制文字輸出，也控制 LLM 能呼叫的任何 tool。

OWASP 在 LLM01:2025 正式收錄 direct（使用者直接輸入惡意指令）與 indirect（指令藏在 agent 代為抓取的網頁、email、文件、tool output）兩類，並強調 payload 不需要人類可讀——隱藏文字、白字、圖片隱寫，只要被模型 parse 到就算。**「via tool outputs」是 indirect injection 最危險的一支**：agent 的設計本質就是「tool output 餵回 context → 模型據此決定下一步」，tool output 既被當成可信的系統資料、又直接影響下一步 action——這正是注入的黃金管道。MCP 普及後，每個外接 data service 都是新的注入點。

## 旗艦案例：EchoLeak（CVE-2025-32711）

2025 年 6 月 Aim Security 揭露的 EchoLeak 是**第一個在生產 LLM 系統中被武器化、造成具體資料外洩的 prompt injection**——在此之前這類攻擊多被當成理論。目標是 Microsoft 365 Copilot，性質是 **zero-click**：攻擊者只要寄一封 email，使用者完全不需點擊。

攻擊鏈串接了三個繞過，每一步都值得拆開看：

1. **繞過 XPIA 注入分類器**：惡意 email 含近乎隱形的指令。技術社群點出的關鍵不對稱：注入偵測在「整份文件」層級做，但 RAG 實際只取回文件的 **chunk**——把 payload「噴灑」到語意多樣的多個段落，提高被 retrieve 命中的機率，同時整份文件看起來不像攻擊。
2. **繞過連結 redaction**：用 reference-style Markdown 語法。
3. **繞過 egress 限制**：濫用 CSP 允許的微軟 Teams proxy 網域，把資料自動送到攻擊者伺服器。

後果是外洩 Copilot 可存取範圍內的任何東西：私人 email、OneDrive、SharePoint、Teams 訊息、對話歷史。Aim Labs 把這命名為 **LLM Scope Violation**——AI 被誘騙跨越其信任邊界。它示範了 AI-specific 漏洞加傳統漏洞（CSP bypass）可以串成完整 kill chain，也暴露了多數 RAG / agent 系統的系統性設計弱點。後續 PromptArmor 又展示 Microsoft Copilot Cowork 能透過 poisoned skill 外洩 M365 檔案——對 SOTA 模型（含 Claude Opus 4.7）都有高成功率。

## 信任邊界：為什麼 agent 特別難畫

NIST 的 Zero Trust for AI Agent 文件講得最透徹：傳統系統的信任邊界是明確的——使用者輸入不可信、內部 function call 可信。但 agent 系統把這條界線模糊掉了，因為**模型的輸出同時是「內部邏輯」（決定下一步）又是「被外部輸入塑形的結果」**——不存在一個乾淨的架構點能說「過了這裡就都可信」。

實務判準很粗暴：**任何使用者能編輯、或來自系統外部的欄位，都是 attacker-controlled input**。Praetorian 的研究點出常見盲點：supervisor agent 只審查使用者的對話輸入，卻把 profile 欄位、retrieved 文件、tool output 當成「系統組裝的可信 context」——但使用者連自己的「名字」欄位都能塞注入；而且 context assembly 發生在 supervision 之後，supervisor 從沒看過實際組裝後的完整 prompt。

判斷一個 agent 架構是否危險，最快的法則是 Willison 的 **Lethal Trifecta（致命三元組）**——三者同時存在於同一個 session 就有外洩管道：

1. **存取私密資料**
2. **處理不可信內容**（indirect injection 入口）
3. **對外通訊能力**（email、webhook、API、甚至 Markdown 圖片外連）

EchoLeak 正是三者齊備的教科書案例。實務推論：**outbound channel 也是信任邊界的一部分**——如果你無法約束 data flow，你就還沒控制這個 agent。

核心設計哲學由此而來：**不要把安全寄望在模型會乖乖忽略惡意指令**（機率性），而是假設模型可能被影響，然後**約束被影響後產生的 tool call 能做什麼**（確定性）。例如與其讓 agent 自由查資料庫，不如讓資料庫引擎本身以使用者權限 authz 每個請求——信任邊界從「模型」移到「DB 引擎」。更激進的做法是網路層 enclave：邊界外的資源不是被 policy 擋住，而是**從 enclave 內根本網路不可達**。

## 六大設計模式與 CaMeL

Beurer-Kellner 等 11 位作者（IBM、Invariant Labs、ETH Zurich、Google、Microsoft）的論文（arXiv:2506.08837）是目前信任邊界設計的骨幹，指導原則一句話：**一旦 agent 攝入了不可信輸入，就必須被約束到「那個輸入不可能觸發任何有後果的 action」**。論文也誠實承認：只要 agent 和防禦都還靠當前這代 LLM，通用型 agent 就不太可能有可靠的安全保證——所以問題是「今天能建出哪種既有用、又抗注入的 agent」，答案是**用能力換安全**：

| # | 模式 | 一句話 | 邊界畫法 |
|---|---|---|---|
| 1 | Action-Selector | LLM 調制的 switch statement | agent 能觸發 tool 但**收不到回應**——沒有 feedback 就沒有注入路徑 |
| 2 | Plan-Then-Execute | 先定死 plan 再執行 | tool output 可回流，但**不准影響 action 選擇**——行事曆內容能污染信件內文，改不了收件人 |
| 3 | LLM Map-Reduce | 子 agent 碰髒內容，聚合者只收結構化結果 | sub-agent 只回 boolean，協調者不接觸原始髒內容 |
| 4 | Dual LLM | privileged + quarantined 雙模型 | Q-LLM 處理髒內容但**無 tool**，只回 symbolic 變數；髒內容永不進 P-LLM |
| 5 | Code-Then-Execute | P-LLM 生成 sandboxed DSL 程式 | DSL 支援 data flow analysis，污染資料全程被追蹤 |
| 6 | Context-Minimization | 用完即丟 | prompt 轉成 query 後即從 context 移除，避免注入殘留 |

Dual LLM 仍有漏洞，經典反例：「把 Bob 要的文件寄給他，Bob 的 email 在會議記錄裡」——Q-LLM 仍暴露在會議記錄的惡意指令下，攻擊者可覆寫 Bob 的 email。DeepMind 的 **CaMeL**（Defeating Prompt Injections by Design，arXiv:2503.18813）把古典安全工程搬回來解這題：P-LLM 先把控制流抽成 pseudo-Python，由自訂 interpreter 執行，interpreter 維護 **data flow graph** 並用 **capabilities** 強制資料能流到哪些 sink——「Bob 的 email」帶著「來自不可信會議記錄」的標籤，policy 不准它當 `email.send` 的收件人。Willison 評為他看過第一個對 tool-using LLM 抗注入提出**可信解法**的論文。

## 放大到 multi-agent：注入會自我複製

多數 multi-agent 框架把 agent 之間的訊息當成「可信的內部通訊」。NIST 點破：**當 agent 之間用自然語言溝通，每一條 inter-agent 訊息都是潛在的 prompt injection 載體**——外層 agent 委派任務給內層，在架構上就是把不可信輸入跨過信任邊界傳遞。

當注入發生在「會把訊息傳給下一個 agent」的拓樸裡，就從一次性劫持升級成蠕蟲。**Morris II**（arXiv:2403.02817）是第一個針對 GenAI 生態的 zero-click 蠕蟲，三段結構：**replication**——adversarial self-replicating prompt 強迫模型把輸入原樣輸出，agent 摘要了被感染的文件，摘要本身就帶著惡意 prompt；**propagation**——命令被感染 agent 用 email / Slack / DB 把 prompt 送給新目標，RAG 變體裡惡意 email 存進 RAG 後、回覆其他 email 時新收件人就被感染，無需人類介入；**payload**——竊取 PII、phishing、散播垃圾訊息。

**Prompt Infection**（arXiv:2410.07283）把 LLM-to-LLM 注入形式化，並有個更可怕的發現：**即使 agent 之間不直接共享通訊，multi-agent 系統仍高度易感染**。其 payload 可依角色分派任務（某 agent 竊資料外送、最後一個 agent self-destruct 掩蓋痕跡）。提出的防禦是 **LLM Tagging**——標記 AI 生成內容，阻斷自我複製 prompt 的擴散。

真實事件也開始出現：Palo Alto Unit 42 在 2025 年 11 月揭露 **Agent Session Smuggling**——在 Google A2A 協定上，惡意 agent 利用內建信任關係跨多輪對話逐步建立假信任。據 Galileo AI 的模擬研究（單一廠商數據，當趨勢參考），單一被攻陷 agent 可在 4 小時內污染 87% 的下游決策——共通教訓是**級聯失效傳播得比傳統事件回應能圍堵的速度更快**。

## 防禦架構：三層疊加

Multi-agent 防禦是單 agent 原則往上加一層：

**A. 沿用單 agent 的架構約束**：把所有 LLM 輸出（含其他 agent 的輸出）都當不可信；不可信內容跑在隔離 sandbox / enclave；least privilege——每個 agent 只給最窄的 tool 與權限，縮小 blast radius。

**B. Inter-agent 層的新控制**：認證 inter-agent 訊息（NIST 點名的缺口）、約束委派權限（一個 agent 能代表誰、能要求什麼）、LLM Tagging。

**C. 治理框架**：OWASP 於 2025 年 12 月發布 **Top 10 for Agentic Applications**（100+ 研究者共筆），把 agentic 專屬風險獨立出來；廠商觀察（Lasso）認為前三大風險已不是傳統注入，而是 Memory Poisoning、Tool Misuse、Privilege Compromise——因為 agent 有持久記憶、自主呼叫、跨 session 身分。既有框架（LLM Top 10、NIST AI RMF、MITRE ATLAS）多把 LLM 當孤立元件，不足以涵蓋 autonomy + 長期記憶 + 動態 tool 結合後湧現的安全性質。

## 整體來說

研究界的共識很冷靜：**目前沒有可靠方法讓 LLM 在一類文字裡遵循指令、卻安全地把那些指令套用到另一類文字**。所以「把模型調乖」（prompt-based 防禦在攻擊下普遍掉 10–30% utility）不是答案，**架構約束**才是——而架構約束的本質是用「限制 agent 解任意任務的能力」換安全。

實務上的三步檢查：先用 Lethal Trifecta 掃一遍你的 agent（私密資料 × 不可信內容 × 對外通訊，三者並存就危險）；再從六大設計模式挑一個符合任務形狀的（多數業務流程其實塞得進 Plan-Then-Execute 或 Map-Reduce）；multi-agent 則把每條 inter-agent 訊息當外部輸入對待。EchoLeak 之後，這已經不是理論題了。

## 參考資料

- [OWASP — LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection)
- [OWASP — Agentic AI Threats and Mitigations](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations)
- [NIST — Zero Trust Architecture for AI Agent Security](https://downloads.regulations.gov/NIST-2025-0035-0154/attachment_1.pdf)
- [Design Patterns for Securing LLM Agents against Prompt Injections（arXiv:2506.08837）](https://arxiv.org/abs/2506.08837)
- [Defeating Prompt Injections by Design / CaMeL（arXiv:2503.18813）](https://arxiv.org/abs/2503.18813)
- [AgentDojo（arXiv:2406.13352）](https://arxiv.org/abs/2406.13352)
- [Here Comes The AI Worm / Morris II（arXiv:2403.02817）](https://arxiv.org/abs/2403.02817)
- [Prompt Infection: LLM-to-LLM Prompt Injection within Multi-Agent Systems（arXiv:2410.07283）](https://arxiv.org/abs/2410.07283)
- [EchoLeak: The First Real-World Zero-Click Prompt Injection Exploit（arXiv:2509.10540）](https://arxiv.org/abs/2509.10540)
- [Agentic AI Security: Threats, Defenses, Evaluation, and Open Challenges（arXiv:2510.23883）](https://arxiv.org/abs/2510.23883)
- [Simon Willison — Design Patterns for Securing LLM Agents](https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/)
- [Simon Willison — CaMeL offers a promising new direction](https://simonwillison.net/2025/Apr/11/camel/)
- [Simon Willison — The Dual LLM pattern](https://simonwillison.net/2023/Apr/25/dual-llm-pattern/)
- [Varonis — EchoLeak](https://www.varonis.com/blog/echoleak)
- [HackTheBox — Inside CVE-2025-32711](https://www.hackthebox.com/blog/cve-2025-32711-echoleak-copilot-vulnerability)
- [Praetorian — Bypassing LLM Supervisor Agents Through Indirect Prompt Injection](https://www.praetorian.com/blog/indirect-prompt-injection-llm)
- [NeuralTrust — Indirect Prompt Injection: The Complete Guide](https://neuraltrust.ai/blog/indirect-prompt-injection-complete-guide)
- [PromptArmor — Microsoft Copilot Cowork Exfiltrates Files](https://www.promptarmor.com/resources/microsoft-copilot-cowork-exfiltrates-files)
- [Palo Alto Networks — What Is an AI Worm?](https://www.paloaltonetworks.com/cyberpedia/ai-worm)
- [secops.group — Securing Agentic AI: The OWASP Top 10 and Beyond](https://secops.group/blog/securing-agentic-ai-the-owasp-top-10-and-beyond)
- [Lasso Security — Top 10 Agentic AI Security Threats](https://www.lasso.security/blog/agentic-ai-security-threats-2025)
