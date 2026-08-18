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
tldr: "課程量到的 AI SAST 誤報率是 50–100%，而傳統 SAST 本來也有 50% 以上——真正的新問題是非決定性：同一個 prompt 跑兩次結果不同，你無法回答「掃完了沒有」。課程列的 agent 攻擊向量有五種，其中 intent breaking 攻擊的是 agent 的計畫本身。"
description: "拆解 Stanford CS146S Fall 2026 第七週「Security」：SAST/SCA 與相依套件風險、prompt injection 為何連三年排 OWASP 第一、lethal trifecta 威脅模型，以及 agent 輔助的漏洞分流實績與代價。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-16-cs146s-agent-security-en)

這是 [CS146S 系列](/posts/ai/2026-08-16-cs146s-course-map)的第八篇，對應 Fall 2026 的第七週。

課程主題三條：SAST / SCA、相依套件與密鑰外洩漏洞；prompt injection 與 agent 特有的攻擊面；agent 輔助的分流與修補。客座是 Semgrep 執行長 Isaac Evans，兩版大綱都有他。

安全是十週裡**唯一兩版都在的主題**。但這週要同時處理兩件方向相反的事：拿 agent 當防守工具，以及把 agent 本身當成新的攻擊面。

## 課程先教的三個縮寫

Fall 2026 這週的第一條主題直接寫 SAST / SCA。Fall 2025 的對應課堂是 Week 6「AI QA, SAST, DAST, and Beyond」（[投影片](https://docs.google.com/presentation/d/1C05bCLasMDigBbkwdWbiz4WrXibzi6ua4hQQbTod_8c/edit)），把三個縮寫定義清楚：

| | 全名 | 是什麼 | 抓什麼 |
|---|---|---|---|
| **SAST** | Static Application Security Testing | 白箱，分析原始碼與 binary，用 pattern matching 掃 | SQL injection、command injection、XSS。在 SDLC 早期做，修正成本最低。工具：Bandit、Semgrep、ESLint + extensions |
| **DAST** | Dynamic Application Security Testing | 黑箱，模仿真實攻擊者的動作 | 同上加 broken authentication。**誤報比 SAST 少**。技術：input fuzzing、操弄 session token、header 測試、暴力 rate-limit 測試 |
| **SCA** | Software Composition Analysis | 深入分析你用的開源套件 | 分析套件 metadata、解析 transitive dependency、比對漏洞資料庫、掃 binary 與 artifact |

課程對三者關係的一句話總結是「cover code + runtime + dependencies」——**分別對應程式碼、執行期、相依**。這三塊沒有一塊能被另外兩塊取代，也沒有一塊能被 LLM 取代。

課程給的動機同樣直接：「When an LLM is writing most of your code, you need extensive guardrails to prevent those errors.」

## 防守面：agent 真的找得到漏洞

先講有實績的那一半。

2025 年 5 月，Sean Heelan 用 o3 在 Linux kernel 的 ksmbd 模組裡找到一個遠端零日漏洞（CVE-2025-37899），是 `smb2_session_logoff` 處理流程裡的 use-after-free。他[寫下的完整過程](https://sean.heelan.io/2025/05/22/how-i-used-o3-to-find-cve-2025-37899-a-remote-zeroday-vulnerability-in-the-linux-kernels-smb-implementation/)強調做法有多樸素：「no scaffolding, no agentic frameworks, no tool use」——就是 API 加一段 prompt。

但這篇最有價值的是它同時把成本寫出來了。他先用一個已知漏洞當基準，餵進約 3.3k 行程式碼（約 27k tokens）：

> o3 finds the kerberos authentication vulnerability in the benchmark in 8 of the 100 runs. In another 66 of the runs o3 concludes there is no bug present in the code (false negatives), and the remaining 28 reports are false positives.

一百次跑八次中，六十六次說沒事，二十八次誤報。他對整體結果的形容是「the signal to noise ratio of ~1:50 in this case」，並且直說「o3 is not infallible」。

**這個組合正是「AI 輔助分流」該有的樣子**：模型負責產生候選，人負責篩。1:50 的訊噪比對自動化流程是災難，對一個原本要手動審 12,000 行程式碼的研究者卻是巨大加速。這跟 [Week 6 的 code review](/posts/ai/2026-08-16-cs146s-agentic-code-review) 是同一個道理——瓶頸永遠在噪音那一側。

Semgrep 自己也發過[用 Claude Code 與 Codex 找現代 web app 漏洞](https://semgrep.dev/blog/2025/finding-vulnerabilities-in-modern-web-apps-using-claude-code-and-openai-codex/)的實驗紀錄，方向一致：規則型的 SAST 抓已知模式，模型抓需要理解語意與跨檔案推理的那一類。兩者是互補，不是取代。

課程自己也量過這件事，而且數字比我上面引的更不客氣。同一份投影片的 Limitations 頁寫著：

> In AI SAST, false positive rates are incredibly high
> - **Claude Code/Codex can be 50-100% depending on the vulnerability**
> - Compare to **50+%** for traditional SAST techniques

**兩邊都很高。** 這是這一頁最誠實的地方——它沒有拿 AI 的高誤報去對比一個虛構的完美傳統工具，而是指出傳統 SAST 本來就有 50% 以上的誤報。差別在別的地方：課程接著點出 AI 的**非決定性**才是真正的新問題——「Run the same prompt multiple times and get different results → how do you know you're catching all vulnerabilities?」並把 context rot 與 compaction 列為成因。

一個每次跑結果都不同的掃描器，你沒辦法回答「我掃完了沒有」。傳統 SAST 再吵，至少每次吵的是同一件事。

## 攻擊面：prompt injection 沒有被解決

現在講另一半。

OWASP 在 2026 年 8 月 3 日發布 [GenAI / LLM Top 10 2026 版](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/)，官方說明寫這一版「grounded in thousands of real-world AI security incidents」，並把風險對應到 NIST、MITRE ATLAS、CWE 與 Agentic Applications 那份清單。[SD Times 的報導](https://sdtimes.com/security/prompt-injection-tops-2026-owasp-genai-llm-top-ten-vulnerabilities/)指出 prompt injection **連續第三年排第一**，並引述專案共同主席 Steve Wilson 的說法：過去主要靠專家投票排序，這一版把票數拿去對照事故紀錄——「OWASP now has a database containing roughly 10,000 real-world AI security incidents」。

排第一的原因不是大家不努力，是這個問題**在結構上還沒有解**：模型無法可靠地區分「使用者的指示」與「資料裡長得像指示的文字」。

最好用的威脅模型是 Simon Willison 提的 [lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)（2025 年 6 月）——三個能力同時具備就會出事：

1. **存取私密資料**（你的 repo、你的密鑰、你的資料庫）
2. **接觸不可信內容**（issue 內文、網頁、相依套件的 README、PR 評論）
3. **對外通訊能力**（發 HTTP request、開 PR、寄信）

單獨任何一項都安全，三項湊齊，攻擊者只要控制第二項就能把第一項透過第三項送出去。

問題是**一個典型的 coding agent 預設就三項全開**：它讀你的私有 repo、它會去讀 issue 與網路文件、它能推 branch 跟呼叫 API。

真實案例不缺。Fall 2025 的指定讀物之一就是 [GitHub Copilot 透過 prompt injection 達成遠端程式碼執行](https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/)的分析。

## 課程列的五種 agent 攻擊向量

我上面只寫了 prompt injection 與供應鏈兩類。課程的分類是五類，而且每一類都給了定義：

1. **Prompt injection**——隱藏或誤導的指示，讓系統偏離預期行為
2. **Tool misuse**——用欺騙性的 prompt 操弄 agent，濫用它接上的工具
3. **Intent breaking**——操弄 agent 的**計畫**，把行動導離原本的意圖
4. **Identity spoofing**——利用被入侵的認證，假冒成合法的 agent
5. **Code attacks**——利用 agent 執行程式碼的能力，取得執行環境的未授權存取

第 3 類值得特別看。**intent breaking 攻擊的不是輸入也不是工具，是 agent 的規劃**——它讓 agent 仍然「照自己的計畫」行動，只是那個計畫已經被改過了。這在有 planner／implementer 分工的架構裡特別危險，因為 implementer 沒有理由懷疑 planner 給的計畫。

第 4 類在 multi-agent 系統裡才成立，也正是 Fall 2025 指定 [Unit 42 那篇](https://unit42.paloaltonetworks.com/agentic-ai-threats/)的原因。

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

## 課程自己留的六個問題

投影片最後一頁是六個沒有答案的問題，值得原樣抄下來——它們比任何結論都更準確地標出這個領域現在的邊界：

> - How to reduce false positives and hallucinations in vulnerability detection?
> - How do we verify that LLM-generated patches are secure and don't introduce regressions?
> - How can LLMs explain why they flag a vulnerability or propose a fix?
> - What are the right benchmarks for measuring LLMs' AppSec performance?
> - How should LLMs be embedded in CI/CD without overwhelming teams with noise?
> - **Who is accountable if an AI-generated patch introduces a vulnerability?**

最後一題不是技術問題。**課程把它擺在技術問題的同一張清單上，而且沒有回答。**

## 會過期的東西

- o3 的實驗是 2025 年 5 月，模型已換代；那組數字說明的是**方法的形狀**，不是今天的命中率
- OWASP 清單每年改版，寫作當下最新是 2026-08-03 發布的 GenAI / LLM Top 10 2026
- 各家 agent 的沙箱與權限預設值變動頻繁，實作前查當下文件

## 參考資料

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 7 主題與客座
- [How I used o3 to find CVE-2025-37899](https://sean.heelan.io/2025/05/22/how-i-used-o3-to-find-cve-2025-37899-a-remote-zeroday-vulnerability-in-the-linux-kernels-smb-implementation/) — Sean Heelan，2025-05-22，含完整命中率與誤報數字
- [The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) — Simon Willison，2025-06-16
- [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) — 官方資源頁，2026-08-03
- [Prompt Injection tops 2026 OWASP GenAI / LLM Top Ten vulnerabilities](https://sdtimes.com/security/prompt-injection-tops-2026-owasp-genai-llm-top-ten-vulnerabilities/) — SD Times，含 Steve Wilson 對排序方法的說明
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — 舊版入口，已轉到 GenAI Security Project
- [GitHub Copilot Remote Code Execution via Prompt Injection](https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/) — Fall 2025 Week 6 指定讀物
- [Finding Vulnerabilities in Modern Web Apps Using Claude Code and OpenAI Codex](https://semgrep.dev/blog/2025/finding-vulnerabilities-in-modern-web-apps-using-claude-code-and-openai-codex/) — Semgrep，Fall 2025 Week 6 指定讀物
- [Agentic AI Threats: Identity Spoofing and Impersonation Risks](https://unit42.paloaltonetworks.com/agentic-ai-threats/) — Unit 42，Fall 2025 Week 6 指定讀物
- [AI QA, SAST, DAST, and Beyond](https://docs.google.com/presentation/d/1C05bCLasMDigBbkwdWbiz4WrXibzi6ua4hQQbTod_8c/edit) — Fall 2025 Week 6 課堂投影片，含三個縮寫的定義、五種攻擊向量與 AI SAST 誤報率
- [Claude Code sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing) — Anthropic Engineering
