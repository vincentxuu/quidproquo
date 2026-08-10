---
title: "安全：prompt injection 只能在 harness 層做損害控制"
date: 2026-08-10
category: ai
type: deep-dive
tags: [security, ai-agent, prompt-engineering, mcp, llm]
lang: zh-TW
series:
  name: "Agent 生產線"
  order: 5
tldr: "2025-11 三大實驗室聯手把先前提出的 12 種 prompt injection 防禦全部攻破。EchoLeak 的 payload 通過了微軟自己的專用分類器。所以目標不是擋住每次攻擊，是攻擊成功時活下來——而這只能在 harness 做。"
description: "為什麼 prompt injection 在模型層無解：指令與資料共用同一串 token。以及 harness 層的損害控制手段——lethal trifecta、Agents Rule of Two、guardrail 移到 tool boundary、GitHub 的零秘密架構與 safe outputs。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-10-agent-security-harness-layer-en)

前面四篇如果還讓人覺得「模型再強一點就好了」，這一篇可以徹底斷了這個念頭。

## 根因：指令與資料是同一串 token

只有一句話：**LLM 把指令與資料當成同一串 token 接收，序列裡沒有任何標記把兩者分開。**

參數化查詢在資料庫邊界解決了同構的問題——你明確告訴引擎「這一段是資料，不管它長得多像 SQL」。**自然語言沒有等價物**，因為指令和資訊都是用文字表達的，沒有型別可以標。

這不是「還沒有人去做」，是**已經有人認真試過並失敗**。2025 年 11 月 OpenAI、Anthropic、Google DeepMind 聯合發表的研究，在允許攻擊自適應迭代的條件下，**把先前提出的 12 種 prompt injection 與 jailbreak 防禦全部攻破**。

更早一點的 EchoLeak（[CVE-2025-32711](https://nvd.nist.gov/vuln/detail/CVE-2025-32711)）示範了這件事在真實產品上長什麼樣：一封信就讓 M365 Copilot 把公司內部檔案送到外部伺服器，**使用者完全沒有互動**。最值得記的是後半段——**那個 payload 通過了微軟專門針對 cross-prompt injection 訓練的分類器**。輸入過濾單獨使用時是會漏的。

已記錄的其他案例：GitHub MCP server 被公開 repo 的惡意 issue 誘導洩漏私有 repo 內容；GitLab Duo 被隱藏指令誘導洩漏私有內容；某汽車經銷商的 chatbot 被談成一美元賣車；某加密交易 agent 被社交工程轉走 55 ETH。連 Anthropic 官方的 Git MCP server 在 2025 年都收到三個注入相關的 CVE。

所以現實目標不是「擋住每次攻擊」，而是**攻擊成功時活下來**——也就是 defense in depth。這只能在 harness 做。

## lethal trifecta：損害需要三件事同時成立

[〈LLM Security Basics〉](https://blog.bytebytego.com/p/llm-security-basics-the-full-threat)是這批材料裡引用品質最高的一篇（13 筆參考全部可追，多為 arXiv 論文、CVE 編號、OWASP 與官方 blog），它給的結構最實用：真正造成損害的位置有明確條件，三者同時握在一個 agent 手上才會出事。

1. **存取私有資料**（信箱、客戶資料庫、原始碼庫）
2. **接觸不可信內容**（網頁、郵件、共享文件）
3. **有對外送出資料或行動的通道**

**拿掉任何一個都能降低曝險，而最便宜的通常是切掉對外通道或收窄可存取範圍——比加強過濾器便宜得多。**

這個結構也解釋了一種常見的資源錯配：模型竊取、訓練資料萃取這類「模型內部攻擊」最受關注，但成本高、範圍窄、多半已被供應商緩解；真正的風險集中在三元組。原文那句話很銳利——「一個團隊忙著防模型竊取，同時部署了權限過寬的 agent，等於處理了罕見攻擊、放著常見的不管。」

兩個把這件事制度化的框架：

- **Meta 的 Agents Rule of Two**——在沒有 human-in-the-loop 的情況下，一個 agent 最多只能同時滿足三個危險屬性中的兩個（處理不可信輸入 / 持有敏感存取 / 對外行動）。Meta 自陳這是最小權限原則的補充，不是完整解法
- **Google DeepMind 的 CaMeL**——把模型本身視為不可信，用獨立的特權元件做規劃，並隔離外部檢索到的資料，使資料本身無法觸發敏感操作

## guardrail 要移到 tool boundary

[第一篇](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries)提過 guardrail 依位置分三族：input / tool / output。Microsoft 點出為什麼中間那一族在 agent 情境下變成主戰場：

chatbot 只需要篩使用者輸入與模型輸出，因為它只讀這兩樣東西。**agent 還會讀工具輸出和檢索到的文件**——而間接 prompt injection 正好藏在那裡。只守 input 與 output 等於守了兩個沒人走的門。

## GitHub：假設這個 agent 已經被入侵

[GitHub 的 agentic workflow 安全架構](https://blog.bytebytego.com/p/the-security-architecture-of-github)是整批材料裡最完整的一份施工藍圖，它的立場從第一句就很硬：**整套設計都假設 agent 已經被入侵。**

先說為什麼 agent 打破了 CI/CD 的前提：傳統 pipeline 所有元件共用一個信任域，因為每個元件都是確定性腳本。agent 會在執行期推理、消化沒被設計過的輸入、做臨場決定——共用信任域的安全前提就不成立了。

**三層互相獨立的防線**（任一層失效，其他層仍各自生效）：

- **substrate**：Actions runner VM + 多個 Docker 容器，提供隔離、系統呼叫控制、核心層通訊邊界。即使 agent 容器內被任意程式碼執行也擋得住
- **configuration**：編譯器把 workflow 定義**編譯成**帶明確權限、輸出、稽核與網路約束的 Action，也決定哪個秘密進哪個容器——**agent 的容器永遠拿不到**
- **planning**：把工作切成分階段流程，階段之間有明確的資料交換

**零秘密架構**：agent 跑在私有網路上自己的容器；對外走專用防火牆容器；MCP 工具走 MCP gateway 容器（獨佔持有 PAT）；LLM 呼叫走 API proxy（持有模型 token）。整條鏈上 agent 從不碰到秘密——proxy 與 gateway 代它認證。

為了讓 agent 仍能用到主機上的編譯器與工具，做法很漂亮：**把整個 VM 主機檔案系統唯讀掛載到 `/host`，用空的 tmpfs 層蓋掉含秘密的路徑，再把 agent chroot 到 `/host`。** 這個「唯讀掛載 + tmpfs 遮蔽敏感路徑」的模式在 agent 情境之外也用得上。

**Safe outputs（最有特色的一段）**：GitHub MCP server 對 agent 只給**唯讀**；所有寫入走另一個 safe output MCP server，**只緩衝不執行**。agent 結束後，緩衝的變更才走一條確定性分析管線——①型別對照 workflow 作者定義的白名單（作者沒允許開 PR，暫存的 PR 就被丟掉）②數量上限 ③內容清洗（掃洩漏的秘密、移除 URL、內容審核）。只有整條管線都通過的輸出才會真的寫進 GitHub。

**在每個信任邊界記錄日誌**——防火牆記網路目的地、API proxy 記模型請求、MCP gateway 記工具呼叫，甚至在 agent 容器裡加了環境變數存取的稽核。原文點出的長期用意適用範圍遠超安全：

> 每一個你能觀察通訊的點，也都是你未來能介入管制的點。今天的可觀測性就是明天的控制平面。

作者也誠實列出取捨：安全 vs 可用（比本地開發受限得多）、strict-by-default 是強意見（Claude Code 與 Gemini CLI 的沙箱都是 opt-in，GitHub 預設就開），而且**prompt injection 本質上仍未解決**——這是損害控制策略不是預防策略，確定性的輸出審查只抓得到事先想到的模式。

值得記的收斂：GitHub 用 proxy + gateway、OpenAI Codex 用兩階段（秘密只在 setup 階段可用，agent 階段前移除、預設關閉網路），兩隊各自走到同一個原則——**agent 不該碰到秘密**。

## 三個容易被低估的數字

- **PoisonedRAG**：只要在數百萬筆的知識庫裡插入 **5 段**惡意內容，就能對特定問題達到 90% 攻擊成功率
- Anthropic 與 UK AI Security Institute、Alan Turing 的聯合研究：**約 250 份惡意文件就足以在 6 億到 130 億參數的模型裡植入後門，且數量幾乎不隨模型大小增加**（作者註明該後門只產生亂碼，屬低風險行為）
- **slopsquatting**：AI 幻覺出不存在的套件名、攻擊者搶註。USENIX Security 2025 的研究發現 57.6 萬個生成樣本中 **19.7% 推薦的套件不存在**，共 20.5 萬個不重複的幻覺套件名。**最關鍵的是這些幻覺會重複**——43% 在 10 次查詢中重現。可重複性才是這條攻擊路徑成立的前提，不可重複的隨機錯誤攻擊者無法預先佈局

## 本系列

1. [概念界線：agent、workflow、RAG、MCP 到底差在哪](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries)
2. [模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)
3. [context 與記憶：agent 失敗的真正位置](/posts/ai/2026-08-10-agent-context-memory-failure)
4. [上線才是工作的開始：企業案例橫向讀](/posts/ai/2026-08-10-enterprise-agent-case-studies)
5. **安全：prompt injection 只能在 harness 層做損害控制**（本篇）
6. [引用之前：把 19 份一手來源查一遍](/posts/ai/2026-08-10-verifying-agent-numbers)
7. [協定層：MCP、A2A、ACP、Skills 各解什麼問題](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer)
8. [RAG 的三種形態與 evaluator paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants)

## 參考資料

- [ByteByteGo — LLM Security Basics: The Full Threat Model](https://blog.bytebytego.com/p/llm-security-basics-the-full-threat)
- [ByteByteGo — The Security Architecture of GitHub Agentic Workflow](https://blog.bytebytego.com/p/the-security-architecture-of-github)
- [ByteByteGo — How Microsoft Ships AI Agents at Enterprise Scale](https://blog.bytebytego.com/p/how-microsoft-ships-ai-agents-at)
- [ByteByteGo — How OpenAI Codex Works](https://blog.bytebytego.com/p/how-openai-codex-works)
- [NVD — CVE-2025-32711（EchoLeak）](https://nvd.nist.gov/vuln/detail/CVE-2025-32711)
- [Spracklen et al. — We Have a Package for You!（arXiv:2406.10279）](https://arxiv.org/abs/2406.10279)
- [USENIX Security 2025 — We Have a Package for You!（官方 PDF）](https://www.usenix.org/system/files/usenixsecurity25-spracklen.pdf)
- [OWASP — Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
