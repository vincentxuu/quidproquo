---
title: "從實戰整理：AI Native 團隊該做好的事"
date: 2026-04-17
category: ai
tags: [ai-native, coding-agent, spec-driven-development, monorepo, ci-cd, code-review, agent-platform, security, observability, git-worktree, adr]
lang: zh-TW
tldr: "不是每個人都該直接用 coding agent 改 code。AI Native 團隊要先搞定 interface 規格、測試先行、monorepo、專案級 rules、小 PR 文化、branch 隔離、security guardrail、agent 監控，在 coding agent 上面再建一層 agent platform 才是正途。"
description: "從實戰踩坑歸納出 13 條 AI Native 開發團隊該做好的事：agent platform、interface 先行、測試先行、monorepo、專案級設定、CI/CD、code review、小 PR、context engineering、branch 隔離、security guardrail、agent observability、文件即 context，每條對應產業文獻佐證。"
draft: false
---

這不是什麼高深技巧，對很多人來說可能都很基本。但這些都是這陣子實際帶團隊轉 AI Native 過程中得到的慘痛教訓，每一條都是撞過牆之後才真正理解的。

---

## 1. 不要讓每個人直接用 coding agent 改 codebase

這是最先踩到的坑。把 coding agent 直接丟給所有人用，結果就是：coding style 不一致、架構被隨意改動、PR 品質參差不齊。每個人用的 prompt 不同，agent 產出的東西也不同。

正確做法是在 coding agent 上面再搭一層 **agent platform**，設計出團隊專用的開發 / 測試 / Review Agent。這些 agent 要設定好 rule、command、skill、reference 等規範，確保產出統一。

用 Claude Marketplace 等方式可以做到一定程度，但還是會有機率偏差。自己在 coding agent 上面包一層 agent platform 生出來的 agent，可控性好得多。

這跟 2026 年的 [Multi-Agent Architecture](https://developers.openai.com/codex/guides/build-ai-native-engineering-team) 趨勢一致：Planner → Architect → Implementer → Tester → Reviewer，每個 agent 各司其職，而不是一個通用 agent 打天下。

## 2. 開發前先把 interface 寫好

對，這在人類開發也一樣重要，但在 AI Native 開發裡更加關鍵。

包含但不限於：
- 前端的 hook 定義
- 後端的 API request / response schema
- DB schema

沒有明確的 interface，agent 就是在猜。猜出來的東西前後端對不上、schema 衝突，最後花更多時間修。

這就是 **Spec-Driven Development (SDD)** 的核心概念。[GitHub 的 spec-kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) 和 [Kiro](https://kiro.dev/) 都在推這套：先寫 contract（scope、constraints、verification criteria），再讓 agent 實作。你寫的 interface 就是 spec 的一部分。

[Martin Fowler 的 SDD 系列](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)特別值得一讀，他把 Kiro、spec-kit、Tessl 三個工具的設計哲學做了完整比較。

## 3. 不用手寫 code，但要手寫測試

開發者的角色從寫 production code 轉向寫驗收條件。先寫好所有的單元測試、e2e 測試，這些就是你的 acceptance criteria。

可以請 AI 代勞寫測試嗎？可以。但你一定要親自 review，確保測試邏輯真的符合你要的行為，而不是 agent 自己「覺得對」的行為。

這對應到 2026 年最關鍵的 pattern：**Agent-Driven Test Loop** — agent 寫 code、跑測試、修 bug、再跑，全部在開 PR 之前完成。但這個 loop 的品質，完全取決於你寫的測試有多精確。

[Addy Osmani 的 LLM coding workflow](https://addyosmani.com/blog/ai-coding-workflow/) 就強調了這個轉變：人類的價值不在寫 code，在定義「什麼是對的」。

## 4. Monorepo

不然真的 context 缺少太苦了。

雖然有很多方法可以處理 polyrepo 的 context 問題（cross-repo context injection、shared AGENTS.md），但 monorepo 就是最直接的解法。Agent 能看到所有相關的 code、shared types、internal packages，不用你手動餵 context。

[Spectro Cloud](https://www.spectrocloud.com/blog/will-ai-turn-2026-into-the-year-of-the-monorepo) 直接問了：「AI 會讓 2026 成為 monorepo 之年嗎？」答案看起來是肯定的。

配合 [nested AGENTS.md](https://dev.to/datadog-frontend-dev/steering-ai-agents-in-monorepos-with-agentsmd-13g0) 的 closest-wins 策略，root 層放全局規則，子目錄放領域規則，agent 自動載入最相關的 context，不會被無關資訊塞爆。

[Nx 的 AI agent skills](https://nx.dev/blog/nx-ai-agent-skills) 也展示了另一個做法：讓 agent 透過 project graph 導航 monorepo，按需載入 context，而不是暴力塞進 context window。

## 5. 專案級別的 Hook / Rules / CLAUDE.md / AGENT.md

這是讓團隊 agent 行為一致的基礎設施。

- **CLAUDE.md / AGENTS.md**：專案根目錄的規則檔，agent 開 session 就自動讀取
- **Hook**：在特定事件（tool call、commit）觸發 shell command，強制執行 lint、format、security check
- **Rules / Skills**：把團隊的 coding convention、architecture decision 編成 agent 能理解的指令

重點是 [HumanLayer 那篇](https://www.humanlayer.dev/blog/writing-a-good-claude-md)說的：**instructions 越少越好，只放 universally applicable 的**。不要把 CLAUDE.md 寫成百科全書，agent 的 context window 也是有限的。

[DeployHQ 的跨工具設定指南](https://www.deployhq.com/blog/ai-coding-config-files-guide)也值得參考，涵蓋了 CLAUDE.md、AGENTS.md、Cursor Rules 等主流工具的設定對照。

## 6. 完整的 CI/CD

這部分跟人類開發沒啥差別。該有的 lint、test、build、deploy pipeline 一個都不能少。

差別在於：AI 生成的 code 更容易在 edge case 翻車，CI 的守門角色比以前更重要。不是「有跑 CI 就好」，是 CI 要涵蓋足夠多的 case。

## 7. 更仔細的 Review Code 跟驗收功能

AI 寫 code 變便宜了，但 review 變成瓶頸。

每一行 AI 生成的 code 都要當成「新人寫的」來 review：邏輯對不對、有沒有 security issue、有沒有偷偷引入不必要的 dependency、有沒有改到不該改的地方。

[Cortex 的 2026 engineering leader guide](https://www.cortex.io/post/the-engineering-leaders-guide-to-ai-tools-for-developers-in-2026) 把這個轉變說得很清楚：senior engineer 的角色從寫 code 轉向 review AI output、定義 system constraints、做 architectural decisions。

## 8. PR 越小越好

人類跟 AI 都是有限度的 context window。

大 PR 不只人類 review 不動，agent 生成的品質也會隨著 scope 變大而下降。一個 PR 解決一件事、改動範圍清楚、測試對應明確 — 這個原則在 AI 時代只會更重要，不會更不重要。

SDD 裡面把這叫做 **small reviewable chunks**：每個 task 可以獨立實作和測試，reviewer 一次只看一個 focused change。

## 9. Context Engineering > Prompt Engineering

最後補一個從文獻中反覆看到的觀點：2026 年的共識是「把對的東西放進 context」比「寫好 prompt」重要。

你的 CLAUDE.md、Skills、AGENTS.md、monorepo 結構、test suite — 這些全部都是 context engineering。你不是在教 agent 怎麼寫 code，你是在建構一個環境，讓 agent 在裡面自然寫出對的 code。

Skill 應該是 **progressive disclosure**：按需載入，不要一次全塞進去。這跟 [Nx 的做法](https://nx.dev/blog/nx-and-ai-why-they-work-together)一致 — 先從 domain level 找到相關區域，再透過 project graph 收斂到對的 project，最後才進到 file system。

## 10. Branch 隔離：Agent 不能直接碰 main

跟第 1 點「不讓每個人直接改 codebase」相關但不同層次 — 這是 git workflow 層級的防護。

Agent 應該在隔離的 branch 或 [git worktree](https://www.augmentcode.com/guides/git-worktrees-parallel-ai-agent-execution) 工作。多個 agent 同時在同一個 working directory 操作，會造成 silent file overwrites、stale context、git lock contention。Worktree 讓每個 agent 有自己的 working directory 和 git index，衝突延遲到 merge time 才處理，用標準 git 工具就能解決。

Claude Code 已經[原生支援 worktree isolation](https://popularaitools.ai/blog/claude-code-git-worktrees-parallel-coding-2026)，subagent 加上 `isolation: worktree` 就自動隔離。但要注意 [runtime isolation](https://www.penligent.ai/hackinglabs/git-worktrees-need-runtime-isolation-for-parallel-ai-agent-development/) 是另一個問題 — port、database、cache、test state 也需要隔離，光靠 git worktree 不夠。

## 11. Security Guardrail：不能靠人眼抓安全問題

這條是血淋淋的教訓。Agent 會不小心 commit `.env`、引入有漏洞的 dependency、產出有 injection 風險的 code。靠 review 人眼抓？抓不完。

數據很嚇人：GitGuardian 的 [2026 State of Secrets Sprawl](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/) 報告顯示，2025 年公開 GitHub 上新曝露了 **2,860 萬個 secrets**，年增 34%。AI-service 相關的洩漏暴增 81%。AI 輔助的 commit [secret 洩漏率是 3.2%](https://www.helpnetsecurity.com/2026/04/15/product-showcase-gitguardian-ggshield-ai-hook/)，比基線 1.5% 高出一倍。

而且 AI 工具[很少驗證 package 真實性](https://cycode.com/blog/ai-security-vulnerabilities/)，AI 輔助開發讓 dependency sprawl 增加 20-30%，typosquatting 攻擊風險大增。

解法是在 hook 和 CI 層強制攔截：
- **Pre-commit hook**：用 [GitGuardian ggshield](https://www.helpnetsecurity.com/2026/04/15/product-showcase-gitguardian-ggshield-ai-hook/) 掃描 secrets
- **CI pipeline**：dependency audit、SAST、container scan
- **Agent-level guardrail**：限制 agent 能存取的檔案範圍、禁止修改特定目錄

## 12. Agent Observability / Evals：沒有量化就沒有改進

團隊的 agent 要像 production service 一樣有監控。哪些 task type 成功率高、哪些 prompt pattern 容易翻車、token 花了多少、每次 session 的品質如何。

[Anthropic 的 evals 指南](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)把這件事講得最清楚：automated evals 跑快速迭代、production monitoring 看真實表現、定期 human review 做校準。三個缺一不可。

Gartner 預測到 2028 年，60% 的軟體團隊會使用 AI evaluation 和 observability 平台。現在的領先團隊已經[從 day one 就把 trace、eval、governance 建進 agent 架構](https://www.braintrust.dev/articles/best-ai-agent-observability-tools-2026)，而不是事後補。

工具生態已經很成熟：[Braintrust](https://www.braintrust.dev/articles/best-ai-agent-observability-tools-2026)、Langfuse、Arize、[Confident AI](https://www.confident-ai.com/knowledge-base/compare/best-ai-observability-tools-2026) 都提供完整的 tracing、evaluation、production monitoring。

## 13. 文件即 Context：ADR 不再只是給人看的

不只是 CLAUDE.md，而是把架構決策寫成 agent 能理解的格式。Agent 做決策時才有依據，不會每次重新發明輪子。

**Architecture Decision Records (ADR)** 是最好的載體。每個 ADR 記錄：我們決定了什麼、為什麼這樣決定、考慮了哪些替代方案。人類開發時代 ADR 常常寫了沒人看，但在 AI Native 時代，ADR 就是 agent 的 context — [Archgate](https://github.com/archgate/cli) 甚至能把 ADR 變成 CI 裡的 governance rule 和 pre-commit hook，讓架構決策自動執行。

更進一步，[Agent Decision Records (AgDR)](https://github.com/me2resh/agent-decision-record) 擴展了 ADR 標準，專門記錄 AI agent 做的技術決策。當 agent 選擇了某個 library 或某種 pattern，AgDR 記下原因，下次其他 agent（或人類）就知道為什麼。

---

## 整體來說

這 13 條不是什麼新發明，很多在人類開發時代就是 best practice。但 AI Native 放大了不遵守這些規則的代價：沒有 spec 就是亂猜、沒有測試就是亂寫、沒有 review 就是亂 merge、沒有 monorepo 就是 context 斷裂、沒有 security guardrail 就是洩漏 secrets、沒有 observability 就是盲飛。

AI 讓寫 code 的成本趨近於零，但讓「確保 code 是對的」的成本變得更高。團隊的核心能力從「寫得快」轉向「規格清楚、驗收嚴格、review 到位、治理完善」。

這些教訓每一條背後都有產業文獻支持，不是個人感覺。希望能幫到正在走同一條路的人少踩幾個坑。

## 參考資料

- [Building an AI-Native Engineering Team – OpenAI Codex](https://developers.openai.com/codex/guides/build-ai-native-engineering-team)
- [Building AI-Native Development Teams in 2026 – Unicrew](https://unicrew.com/blog/building-ai-native-development-teams/)
- [The State of AI Coding Agents 2026 – Dave Patten](https://medium.com/@dave-patten/the-state-of-ai-coding-agents-2026-from-pair-programming-to-autonomous-ai-teams-b11f2b39232a)
- [My LLM coding workflow going into 2026 – Addy Osmani](https://addyosmani.com/blog/ai-coding-workflow/)
- [AI Coding Tools in 2026 – The Main Thread](https://www.the-main-thread.com/p/ai-coding-tools-2026-java-developers-agents-control)
- [Engineering Leader's Guide to AI Tools – Cortex](https://www.cortex.io/post/the-engineering-leaders-guide-to-ai-tools-for-developers-in-2026)
- [Spec-driven development with AI – GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- [Exploring SDD: Kiro, spec-kit, and Tessl – Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [GitHub spec-kit](https://github.com/github/spec-kit)
- [Kiro – Agentic AI Development](https://kiro.dev/)
- [What Is Spec-Driven Development? – Augment Code](https://www.augmentcode.com/guides/what-is-spec-driven-development)
- [Will AI turn 2026 into the year of the monorepo? – Spectro Cloud](https://www.spectrocloud.com/blog/will-ai-turn-2026-into-the-year-of-the-monorepo)
- [Steering AI Agents in Monorepos with AGENTS.md – Datadog](https://dev.to/datadog-frontend-dev/steering-ai-agents-in-monorepos-with-agentsmd-13g0)
- [Teach Your AI Agent How to Work in a Monorepo – Nx](https://nx.dev/blog/nx-ai-agent-skills)
- [Monorepos & AI – monorepo.tools](https://monorepo.tools/ai)
- [Writing a good CLAUDE.md – HumanLayer](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [Claude Code Customization Guide – alexop.dev](https://alexop.dev/posts/claude-code-customization-guide-claudemd-skills-subagents/)
- [How to Configure Every AI Coding Assistant – DeployHQ](https://www.deployhq.com/blog/ai-coding-config-files-guide)
- [Nx and AI – Why They Work Together](https://nx.dev/blog/nx-and-ai-why-they-work-together)
- [Git Worktrees for Parallel AI Agent Execution – Augment Code](https://www.augmentcode.com/guides/git-worktrees-parallel-ai-agent-execution)
- [Git Worktrees Need Runtime Isolation – Penligent](https://www.penligent.ai/hackinglabs/git-worktrees-need-runtime-isolation-for-parallel-ai-agent-development/)
- [The State of Secrets Sprawl 2026 – GitGuardian](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/)
- [Stop secrets from leaking through AI coding tools – GitGuardian ggshield](https://www.helpnetsecurity.com/2026/04/15/product-showcase-gitguardian-ggshield-ai-hook/)
- [AI Security Vulnerabilities to Watch in 2026 – Cycode](https://cycode.com/blog/ai-security-vulnerabilities/)
- [As Coders Adopt AI Agents, Security Pitfalls Lurk – Dark Reading](https://www.darkreading.com/application-security/coders-adopt-ai-agents-security-pitfalls-lurk-2026)
- [Demystifying Evals for AI Agents – Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [5 Best AI Agent Observability Tools 2026 – Braintrust](https://www.braintrust.dev/articles/best-ai-agent-observability-tools-2026)
- [Archgate – Enforce ADRs as Executable Rules](https://github.com/archgate/cli)
- [Agent Decision Records (AgDR)](https://github.com/me2resh/agent-decision-record)
- [Architecture Decision Record Examples – Joel Parker Henderson](https://github.com/joelparkerhenderson/architecture-decision-record)
