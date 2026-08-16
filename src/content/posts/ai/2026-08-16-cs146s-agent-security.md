---
title: "CS146S Week 7：o3 找到 Linux kernel 零日，代價是 1:50 的訊噪比"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - security
  - prompt-injection
  - ai-agent
  - sandbox
  - agentic-coding
lang: zh-TW
type: deep-dive
series:
  name: "CS146S：AI 原生開發十週"
  order: 8
tldr: "同一週要處理兩件相反的事：用 agent 找漏洞，以及 agent 自己就是漏洞。前者有實績——o3 找出 ksmbd 的 use-after-free（CVE-2025-37899），但作者自己記錄基準測試 100 次只中 8 次、28 次誤報。後者的結構性問題是 lethal trifecta：私密資料、不可信內容、對外通道，三者同時具備就等著被搬空。"
description: "拆解 Stanford CS146S Fall 2026 第七週「Security」：SAST/SCA 與相依套件風險、prompt injection 為何連三年排 OWASP 第一、lethal trifecta 威脅模型，以及 agent 輔助的漏洞分流實績與代價。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-16-cs146s-agent-security-en)

這是 [CS146S 系列](/posts/ai/2026-08-16-cs146s-course-map)的第八篇，對應 Fall 2026 的第七週。

課程主題三條：SAST / SCA、相依套件與密鑰外洩漏洞；prompt injection 與 agent 特有的攻擊面；agent 輔助的分流與修補。客座是 Semgrep 執行長 Isaac Evans，兩版大綱都有他。

安全是十週裡**唯一兩版都在的主題**。但這週要同時處理兩件方向相反的事：拿 agent 當防守工具，以及把 agent 本身當成新的攻擊面。

## 防守面：agent 真的找得到漏洞

先講有實績的那一半。

2025 年 5 月，Sean Heelan 用 o3 在 Linux kernel 的 ksmbd 模組裡找到一個遠端零日漏洞（CVE-2025-37899），是 `smb2_session_logoff` 處理流程裡的 use-after-free。他[寫下的完整過程](https://sean.heelan.io/2025/05/22/how-i-used-o3-to-find-cve-2025-37899-a-remote-zeroday-vulnerability-in-the-linux-kernels-smb-implementation/)強調做法有多樸素：「no scaffolding, no agentic frameworks, no tool use」——就是 API 加一段 prompt。

但這篇最有價值的是它同時把成本寫出來了。他先用一個已知漏洞當基準，餵進約 3.3k 行程式碼（約 27k tokens）：

> o3 finds the kerberos authentication vulnerability in the benchmark in 8 of the 100 runs. In another 66 of the runs o3 concludes there is no bug present in the code (false negatives), and the remaining 28 reports are false positives.

一百次跑八次中，六十六次說沒事，二十八次誤報。他對整體結果的形容是「the signal to noise ratio of ~1:50 in this case」，並且直說「o3 is not infallible」。

**這個組合正是「AI 輔助分流」該有的樣子**：模型負責產生候選，人負責篩。1:50 的訊噪比對自動化流程是災難，對一個原本要手動審 12,000 行程式碼的研究者卻是巨大加速。這跟 [Week 6 的 code review](/posts/ai/2026-08-16-cs146s-agentic-code-review) 是同一個道理——瓶頸永遠在噪音那一側。

Semgrep 自己也發過[用 Claude Code 與 Codex 找現代 web app 漏洞](https://semgrep.dev/blog/2025/finding-vulnerabilities-in-modern-web-apps-using-claude-code-and-openai-codex/)的實驗紀錄，方向一致：規則型的 SAST 抓已知模式，模型抓需要理解語意與跨檔案推理的那一類。兩者是互補，不是取代。

## 攻擊面：prompt injection 沒有被解決

現在講另一半。

OWASP 在 2026 年 8 月 4 日發布的 [GenAI / LLM Top 10 2026 版](https://genai.owasp.org/llm-top-10/)裡，prompt injection **連續第三年排第一**。這一版的排序是 75% 社群投票加 25% 真實事故資料，而 OWASP 手上約有一萬筆 AI 安全事故紀錄。

排第一的原因不是大家不努力，是這個問題**在結構上還沒有解**：模型無法可靠地區分「使用者的指示」與「資料裡長得像指示的文字」。

最好用的威脅模型是 Simon Willison 提的 [lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)（2025 年 6 月）——三個能力同時具備就會出事：

1. **存取私密資料**（你的 repo、你的密鑰、你的資料庫）
2. **接觸不可信內容**（issue 內文、網頁、相依套件的 README、PR 評論）
3. **對外通訊能力**（發 HTTP request、開 PR、寄信）

單獨任何一項都安全，三項湊齊，攻擊者只要控制第二項就能把第一項透過第三項送出去。

問題是**一個典型的 coding agent 預設就三項全開**：它讀你的私有 repo、它會去讀 issue 與網路文件、它能推 branch 跟呼叫 API。

真實案例不缺。Fall 2025 的指定讀物之一就是 [GitHub Copilot 透過 prompt injection 達成遠端程式碼執行](https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/)的分析。

## 三個新的供應鏈入口

除了 prompt injection，agent 生態多開了三個相依關係，每個都是供應鏈風險：

**MCP server**——你連上的每一個 server 都能看到你送過去的東西，也能回傳任意內容進 context。工具描述本身就是可以被注入的位置。

**Agent Skills**——Anthropic 在[官方文件](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)裡自己警告：「malicious skills may introduce vulnerabilities in the environment where they're used or direct Claude to exfiltrate data and take unintended actions.」建議是只裝可信來源，來源不明就逐檔讀過。裝一個 skill 的安全層級等同裝一個 npm 套件（見 [Week 3](/posts/ai/2026-08-16-cs146s-agent-skills)）。

**模型建議的套件名**——agent 會 import 不存在的套件，攻擊者可以先去註冊那個名字。這類 slopsquatting 有實測：[arXiv:2406.10279](https://arxiv.org/abs/2406.10279) 用 16 個模型產生 576,000 份 Python 與 JavaScript 程式碼樣本，量到「the average percentage of hallucinated packages is at least 5.2% for commercial models and 21.7% for open-source models」，共 205,474 個不重複的幻覺套件名。

## 能做的事：把 trifecta 拆開

由於 prompt injection 沒有可靠的一般解，實務上的防守是**破壞那三項的同時成立**：

| 拆哪一項 | 具體做法 |
|---|---|
| 私密資料 | agent 用最小權限的憑證；密鑰不進 context，走環境變數與 secret manager |
| 不可信內容 | 把外部內容標記成資料而非指示；跨信任邊界的內容進來前先過濾 |
| 對外通道 | 網路出口白名單；寫入類動作（push、發布、寄信）要人核准 |
| 全部 | 沙箱——[Claude Code 的沙箱設計](https://www.anthropic.com/engineering/claude-code-sandboxing)是可參考的一種實作 |

補上兩條流程面的：

- **agent 產生的 code 走跟人一樣的關卡**，不要因為「AI 寫的比較快」就開快速道
- **密鑰掃描要在 pre-commit，不是在 CI**。agent 一輪可以動十幾個檔案，等到 CI 才擋，密鑰已經在 branch 歷史裡了

## 一個容易被忽略的第三類風險

除了「被攻擊」與「產生漏洞」，還有第三類：**agent 自己搞砸**。一個有 `bash` 權限的 agent 不需要任何攻擊者就能刪掉你的分支。這類事故不會出現在 OWASP 清單上，因為它不是安全漏洞，是權限設計問題——而修法完全一樣：最小權限、沙箱、破壞性動作要確認。

## 會過期的東西

- o3 的實驗是 2025 年 5 月，模型已換代；那組數字說明的是**方法的形狀**，不是今天的命中率
- OWASP 清單每年改版，寫作當下最新是 2026-08-04 發布的 GenAI / LLM Top 10 2026
- 各家 agent 的沙箱與權限預設值變動頻繁，實作前查當下文件

## 參考資料

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 7 主題與客座
- [How I used o3 to find CVE-2025-37899](https://sean.heelan.io/2025/05/22/how-i-used-o3-to-find-cve-2025-37899-a-remote-zeroday-vulnerability-in-the-linux-kernels-smb-implementation/) — Sean Heelan，2025-05-22，含完整命中率與誤報數字
- [The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) — Simon Willison，2025-06-16
- [OWASP GenAI / LLM Top 10 2026](https://genai.owasp.org/llm-top-10/) — 2026-08-04 發布，prompt injection 連三年第一
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — 舊版入口，已轉到 GenAI Security Project
- [GitHub Copilot Remote Code Execution via Prompt Injection](https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/) — Fall 2025 Week 6 指定讀物
- [Finding Vulnerabilities in Modern Web Apps Using Claude Code and OpenAI Codex](https://semgrep.dev/blog/2025/finding-vulnerabilities-in-modern-web-apps-using-claude-code-and-openai-codex/) — Semgrep，Fall 2025 Week 6 指定讀物
- [Agentic AI Threats: Identity Spoofing and Impersonation Risks](https://unit42.paloaltonetworks.com/agentic-ai-threats/) — Unit 42，Fall 2025 Week 6 指定讀物
- [Claude Code sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing) — Anthropic Engineering
