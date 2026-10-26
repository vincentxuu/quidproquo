# 母群盤點：AI agent / skill / MCP 資安開源工具與標準（research-selection 步驟一）

> 盤點日：2026-10-22。只做盤點，不安裝、不執行、不對任何目標掃描。所有 stars／日期／授權來自 GitHub search_repositories 回傳，查不到寫「未取得」。
> 重要限制：GitHub 資料分兩種精度。(1) 13 個 topic 搜尋拿到的 repo 有完整欄位（stars、created_at、pushed_at、archived、license）；(2) 只出現在 awesome 清單或網頁搜尋、後來用 `repo:` 補查的 repo，工具只回 minimal 欄位，沒有 pushed_at 與 license，表中「最後動態」改用 updated_at（標「代」）、授權寫「未取得」。updated_at 會被 star／issue 活動刷新，會高估活躍度。

**候選總數：172 筆（另有 1 筆無 GitHub repo 的標準：OWASP Top 10 for Agentic Applications，列在 H 層表末，故合計 173 筆）**；已研究樣本在表中以「★樣本」標示（11 個樣本中 10 個有 repo，在母群內找到 10 個；OWASP Agentic Top 10 另列）。

欄位說明：來源 = T（命中幾個 GitHub topic 搜尋前 20 名）/ A（出現在幾份 awesome 清單：gov=awesome-ai-agent-governance、ml=awesome-MLSecOps、ll=Awesome-LLMSecOps）/ W（網頁搜尋聚合是否提及）。「總來源」= T+A+W 的數量加總。

## A. 完整清單（按層分組）

### A. 審計 skill（5 筆）

| repo | 定位（取自 GitHub description） | 維護者類型 | 語系/國別 | ★ | 建立 | 最後動態 | arch | 授權 | 來源 T/A/W（總） | 掃描來源明細 | 樣本 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [asamassekou10/ship-safe](https://github.com/asamassekou10/ship-safe) | The independent security agent for AI-written software. Finds issues, investigates whether | 個人/小團隊(User帳號) | 未判斷 | 861 | 2026-02-02 | 2026-10-17 | 否 | MIT | 2/0/0（2） | topic:agent-security,prompt-injection |  |
| [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) | Coding-agent skill for multi-phase security audits | 大廠 | 美國(組織所在推測) | 37278 | 2026-06-18 | 2026-10-22(代) | 否 | 未取得 | 0/0/0（0） |  | ★樣本 |
| [trailofbits/skills](https://github.com/trailofbits/skills) | Trail of Bits Claude Code skills for security research/audit | 資安廠商 | 美國(組織所在推測) | 7704 | 2026-01-14 | 2026-10-22(代) | 否 | 未取得 | 0/0/0（0） |  | ★樣本 |
| [agamm/claude-code-owasp](https://github.com/agamm/claude-code-owasp) | Claude Code skill for OWASP best practices incl. agentic | 未判斷 | 未判斷 | 390 | 2026-01-30 | 2026-10-21(代) | 否 | 未取得 | 0/0/0（0） |  |  |
| [Hainrixz/cyber-neo](https://github.com/Hainrixz/cyber-neo) | Cybersecurity analysis agent/skill for Claude Code (OWASP 2025, CWE 25) | 未判斷 | 未判斷 | 290 | 2026-04-12 | 2026-10-22(代) | 否 | 未取得 | 0/0/0（0） |  |  |

### B. 安裝前掃描（32 筆）

| repo | 定位（取自 GitHub description） | 維護者類型 | 語系/國別 | ★ | 建立 | 最後動態 | arch | 授權 | 來源 T/A/W（總） | 掃描來源明細 | 樣本 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [graygnatconsole/mcp-audit-tool](https://github.com/graygnatconsole/mcp-audit-tool) | 🛡️ Security audit CLI for Model Context Protocol (MCP) servers — scan AI agent configs for | 個人/小團隊(User帳號) | 未判斷 | 585 | 2026-09-26 | 2026-09-26 | 否 | MIT | 3/0/1（4） | topic:mcp-security,mcp-scanner,llm-guardrails; web |  |
| [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) | Security scanner for AI agent skills. Detect vulnerabilities, malicious patterns, security | 大廠 | 美國(組織所在推測) | 20855 | 2026-03-21 | 2026-10-21 | 否 | Apache-2.0 | 2/0/1（3） | topic:agent-security,prompt-injection; web | ★樣本 |
| [snyk/agent-scan](https://github.com/snyk/agent-scan) | Security scanner for AI agents, MCP servers and agent skills (formerly Invariant mcp-scan) | 資安廠商 | 歐洲(推測) | 3161 | 2025-04-07 | 2026-10-21(代) | 否 | 未取得 | 0/1/1（2） | awesome:gov; web |  |
| [splx-ai/agentic-radar](https://github.com/splx-ai/agentic-radar) | A security scanner for your LLM agentic workflows | 新創 | 歐洲(推測) | 1058 | 2025-02-12 | 2025-11-27 | 否 | Apache-2.0 | 2/0/0（2） | topic:ai-red-teaming,llm-security |  |
| [Pantheon-Security/medusa](https://github.com/Pantheon-Security/medusa) | AI-first security scanner. NEW in v2026.7: Claude Code compromise detection — vet .claude/ | 資安廠商 | 未判斷 | 1006 | 2025-11-15 | 2026-08-10 | 否 | AGPL-3.0 | 2/0/0（2） | topic:agent-security,llm-security |  |
| [toby-bridges/api-relay-audit](https://github.com/toby-bridges/api-relay-audit) | Local security audit for AI API relays and LLM proxies: detects prompt injection, model su | 個人/小團隊(User帳號) | 未判斷 | 887 | 2026-03-30 | 2026-10-17 | 否 | AGPL-3.0 | 1/1/0（2） | topic:prompt-injection; awesome:ml |  |
| [Repello-AI/Agent-Wiz](https://github.com/Repello-AI/Agent-Wiz) | CLI threat modeling & visualization of AI agents | 新創 | 未判斷 | 394 | 2025-03-31 | 2026-10-20(代) | 否 | 未取得 | 0/2/0（2） | awesome:ml,ll |  |
| [ClawSecure/clawsecure-openclaw-security](https://github.com/ClawSecure/clawsecure-openclaw-security) | Free OpenClaw security scanner. 3,000+ agents audited. 3-Layer Audit Protocol. OWASP ASI 1 | 個人/小團隊(User帳號) | 未判斷 | 38 | 2026-02-26 | 2026-10-05 | 否 | MIT | 2/0/0（2） | topic:ai-agent-security,agentic-security |  |
| [bawbel/scanner](https://github.com/bawbel/scanner) | Open-source CLI scanner for agentic AI components such as skills, MCP servers, system prom | 組織帳號(性質未細分) | 未判斷 | 12 | 2026-04-14 | 2026-10-22 | 否 | Apache-2.0 | 2/0/0（2） | topic:skill-scanner,mcp-scanner |  |
| [cisco-ai-defense/skill-scanner](https://github.com/cisco-ai-defense/skill-scanner) | Security Scanner for Agent Skills | 資安廠商 | 美國(組織所在推測) | 2620 | 2026-01-29 | 2026-10-22(代) | 否 | 未取得 | 0/0/1（1） | web | ★樣本 |
| [cisco-ai-defense/mcp-scanner](https://github.com/cisco-ai-defense/mcp-scanner) | Scan MCP servers for threats (YARA + LLM + API) | 資安廠商 | 美國(組織所在推測) | 1096 | 2025-09-24 | 2026-10-21(代) | 否 | 未取得 | 0/0/1（1） | web |  |
| [berabuddies/Semia](https://github.com/berabuddies/Semia) | Semia, security audit for AI agent skills. | 組織帳號(性質未細分) | 未判斷 | 613 | 2026-05-05 | 2026-09-01 | 否 | Apache-2.0 | 1/0/0（1） | topic:skill-scanner |  |
| [getagentseal/agentseal](https://github.com/getagentseal/agentseal) | Security toolkit for AI agents. Scan your machine for dangerous skills and MCP configs, mo | 新創 | 未判斷 | 380 | 2026-03-03 | 2026-06-11 | 否 | NOASSERTION | 1/0/0（1） | topic:mcp-security | ★樣本 |
| [alexgreensh/repo-forensics](https://github.com/alexgreensh/repo-forensics) | Offline security scanner for AI-agent repos, skills, plugins, and MCP servers. | 個人/小團隊(User帳號) | 未判斷 | 194 | 2026-02-27 | 2026-10-18 | 否 | NOASSERTION | 1/0/0（1） | topic:ai-agent-security |  |
| [openclaw/clawscan](https://github.com/openclaw/clawscan) | Composable security scanning harness for agent skills | 組織帳號(性質未細分) | 未判斷 | 145 | 2026-06-23 | 2026-10-21 | 否 | MIT | 1/0/0（1） | topic:skill-scanner |  |
| [sinewaveai/agent-security-scanner-mcp](https://github.com/sinewaveai/agent-security-scanner-mcp) | Security scanner MCP server for AI coding agents. Prompt injection firewall, package hallu | 個人/小團隊(User帳號) | 未判斷 | 124 | 2026-02-04 | 2026-10-18 | 否 | MIT | 1/0/0（1） | topic:ai-agent-security |  |
| [Berserk-hub150/skillhawk](https://github.com/Berserk-hub150/skillhawk) | Zero-dep scanner for Agent Skills, SKILL.md and MCP configs | 未判斷 | 未判斷 | 66 | 2026-08-16 | 2026-10-22(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [HuTa0kj/vetix](https://github.com/HuTa0kj/vetix) | Vetix — Automated scanning, identification, and assessment of SKILL security risks, based  | 個人/小團隊(User帳號) | 未判斷 | 50 | 2026-05-13 | 2026-09-29 | 否 | MIT | 1/0/0（1） | topic:skill-scanner |  |
| [hackwither/reap](https://github.com/hackwither/reap) | reconnaissance for agent attack surfaces | 個人/小團隊(User帳號) | 未判斷 | 42 | 2026-07-26 | 2026-09-26 | 否 | MIT | 1/0/0（1） | topic:ai-agent-security |  |
| [IkarusAILabs/SafeAI](https://github.com/IkarusAILabs/SafeAI) | Static analysis and attack-surface scanner for AI agents — SAST for prompts, tools, MCP se | 個人/小團隊(User帳號) | 未判斷 | 29 | 2026-07-18 | 2026-10-19 | 否 | Apache-2.0 | 1/0/0（1） | topic:ai-agent-security |  |
| [sattyamjjain/agent-audit-kit](https://github.com/sattyamjjain/agent-audit-kit) | Static scanner for MCP-connected agent pipelines (414 rules, self-claimed) | 未判斷 | 未判斷 | 12 | 2026-04-05 | 2026-10-21(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [NMitchem/SkillScan](https://github.com/NMitchem/SkillScan) | Security scanner for AI agent SKILL.md files. Static analysis, LLM behavioral prediction,  | 個人/小團隊(User帳號) | 未判斷 | 8 | 2026-03-04 | 2026-03-04 | 否 | MIT | 1/0/0（1） | topic:skill-scanner |  |
| [chuckyatsuk/acidtest](https://github.com/chuckyatsuk/acidtest) | Security scanner for AI agent skills and MCP servers — static analysis, taint tracking, pr | 個人/小團隊(User帳號) | 未判斷 | 8 | 2026-02-05 | 2026-10-03 | 否 | MIT | 1/0/0（1） | topic:mcp-scanner |  |
| [kurtpayne/skillscan-security](https://github.com/kurtpayne/skillscan-security) | Security scanner for AI agent skills and MCP tool bundles — prompt injection, IOC matching | 個人/小團隊(User帳號) | 未判斷 | 8 | 2026-02-08 | 2026-07-04 | 是 | Apache-2.0 | 1/0/0（1） | topic:skill-scanner |  |
| [eltociear/skill-audit-mcp](https://github.com/eltociear/skill-audit-mcp) | Static scanner for MCP servers/skills; also pay-per-call x402 API | 未判斷 | 未判斷 | 5 | 2026-04-30 | 2026-10-09(代) | 否 | 未取得 | 0/1/0（1） | awesome:ml |  |
| [opentrapp/skill-firewall](https://github.com/opentrapp/skill-firewall) | Scan agent skills and plugins for malware and prompt injection before an agent loads them. | 組織帳號(性質未細分) | 未判斷 | 2 | 2026-06-20 | 2026-06-22 | 否 | MIT | 1/0/0（1） | topic:skill-scanner |  |
| [Ventrova/sentinel-scan-cli](https://github.com/Ventrova/sentinel-scan-cli) | MCP security scanner (CLI + MCP server): detects tool poisoning, prompt injection, and rug | 個人/小團隊(User帳號) | 未判斷 | 1 | 2026-08-20 | 2026-08-25 | 否 | MIT | 1/0/0（1） | topic:mcp-scanner |  |
| [AxioRank/mcpaudit](https://github.com/AxioRank/mcpaudit) | Scan any MCP server for prompt injection, tool poisoning, and leaked secrets. One command, | 組織帳號(性質未細分) | 未判斷 | 1 | 2026-06-14 | 2026-06-16 | 否 | MIT | 1/0/0（1） | topic:mcp-scanner |  |
| [ctrl-adam/Husk](https://github.com/ctrl-adam/Husk) | Static security scanner for AI agent skills. Built against the bypass techniques that beat | 個人/小團隊(User帳號) | 未判斷 | 1 | 2026-09-21 | 2026-10-11 | 否 | AGPL-3.0 | 1/0/0（1） | topic:skill-scanner |  |
| [Frank-Masciopinto/ironheights](https://github.com/Frank-Masciopinto/ironheights) | Local-first scanner for OpenClaw/ClawHub agent skills | 未判斷 | 未判斷 | 0 | 2026-10-09 | 2026-10-21(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [jamesdfinance-dev/lazaretto-plugins](https://github.com/jamesdfinance-dev/lazaretto-plugins) | Claude Code plugins: check packages/MCP/skills before agent installs | 未判斷 | 未判斷 | 0 | 2026-09-23 | 2026-10-21(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [cisco-ai-defense/a2a-scanner](https://github.com/cisco-ai-defense/a2a-scanner) | Scan A2A agents for threats | 資安廠商 | 美國(組織所在推測) | 166 | 2025-12-04 | 2026-10-10(代) | 否 | 未取得 | 0/0/0（0） |  |  |

### C. 執行期護欄/閘道（53 筆）

| repo | 定位（取自 GitHub description） | 維護者類型 | 語系/國別 | ★ | 建立 | 最後動態 | arch | 授權 | 來源 T/A/W（總） | 掃描來源明細 | 樣本 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [NVIDIA-NeMo/Guardrails](https://github.com/NVIDIA-NeMo/Guardrails) | NeMo Guardrails is an open-source toolkit for easily adding programmable guardrails to LLM | 大廠 | 美國(組織所在推測) | 7342 | 2023-04-18 | 2026-10-22 | 否 | NOASSERTION | 2/3/0（5） | topic:llm-security,guardrails; awesome:gov,ml,ll |  |
| [hashgraph-online/hol-guard](https://github.com/hashgraph-online/hol-guard) | Open-source antivirus for AI agents: block risky tools, secret access, prompt injection, m | 組織帳號(性質未細分) | 未判斷 | 963 | 2026-03-28 | 2026-10-22 | 否 | Apache-2.0 | 4/1/0（5） | topic:agent-security,mcp-security,prompt-injection,ai-agent-security; awesome:ml |  |
| [maximhq/bifrost](https://github.com/maximhq/bifrost) | Open-source, high-performance AI gateway that works as your LLM gateway, MCP gateway and a | 新創 | 未判斷 | 9008 | 2025-03-19 | 2026-10-22 | 否 | Apache-2.0 | 1/2/1（4） | topic:guardrails; awesome:gov,ml; web |  |
| [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit) | AI Agent Governance Toolkit — Policy enforcement, zero-trust identity, execution sandboxin | 大廠 | 美國(組織所在推測) | 6454 | 2026-03-02 | 2026-10-21 | 否 | MIT | 1/2/1（4） | topic:owasp; awesome:gov,ml; web | ★樣本 |
| [protectai/llm-guard](https://github.com/protectai/llm-guard) | The Security Toolkit for LLM Interactions | 資安廠商 | 美國(組織所在推測) | 3217 | 2023-07-27 | 2026-07-08 | 是 | MIT | 2/2/0（4） | topic:llm-security,prompt-injection; awesome:gov,ll |  |
| [pipelab-org/pipelock](https://github.com/pipelab-org/pipelock) | Open-source AI agent firewall for MCP security and agent egress. Scans mediated HTTP, MCP, | 新創 | 未判斷 | 951 | 2026-02-08 | 2026-10-22 | 否 | Apache-2.0 | 4/0/0（4） | topic:agent-security,mcp-security,prompt-injection,ai-agent-security |  |
| [guardrails-ai/guardrails](https://github.com/guardrails-ai/guardrails) | Adding guardrails to LLMs (I/O validation framework) | 未判斷 | 未判斷 | 7553 | 2023-01-29 | 2026-10-22(代) | 否 | 未取得 | 0/2/0（2） | awesome:gov,ll |  |
| [superagent-ai/superagent](https://github.com/superagent-ai/superagent) | Superagent protects your AI applications against prompt injections, data leaks, and harmfu | 新創 | 未判斷 | 6770 | 2023-05-10 | 2026-08-25 | 否 | MIT | 2/0/0（2） | topic:prompt-injection,guardrails |  |
| [meta-llama/PurpleLlama](https://github.com/meta-llama/PurpleLlama) | Set of tools to assess and improve LLM security | 大廠 | 美國(組織所在推測) | 4444 | 2023-12-06 | 2026-10-21(代) | 否 | 未取得 | 0/2/0（2） | awesome:gov,ll |  |
| [kenryu42/cc-safety-net](https://github.com/kenryu42/cc-safety-net) | A pre-execution guard for AI coding agents. It blocks destructive Git and file system comm | 個人/小團隊(User帳號) | 未判斷 | 1739 | 2025-12-25 | 2026-10-21 | 否 | MIT | 1/1/0（2） | topic:guardrails; awesome:gov |  |
| [protectai/rebuff](https://github.com/protectai/rebuff) | LLM Prompt Injection Detector | 資安廠商 | 美國(組織所在推測) | 1531 | 2023-04-24 | 2024-08-07 | 是 | Apache-2.0 | 1/1/0（2） | topic:prompt-injection; awesome:ll |  |
| [whylabs/langkit](https://github.com/whylabs/langkit) | 🔍 LangKit: An open-source toolkit for monitoring Large Language Models (LLMs). 📚 Extracts  | 新創 | 未判斷 | 1003 | 2023-04-26 | 2024-11-22 | 否 | Apache-2.0 | 1/1/0（2） | topic:prompt-injection; awesome:ll |  |
| [emiliaprotocol/emilia-protocol](https://github.com/emiliaprotocol/emilia-protocol) | Authority control plane for autonomous work. EMILIA Gate enforces finite customer-owned ma | 組織帳號(性質未細分) | 未判斷 | 611 | 2026-03-13 | 2026-10-19 | 否 | Apache-2.0 | 2/0/0（2） | topic:agent-security,mcp-security |  |
| [TheLunarCompany/lunar](https://github.com/TheLunarCompany/lunar) | lunar.dev: Agent native MCP Gateway for governance and security | 新創 | 未判斷 | 504 | 2023-08-15 | 2026-10-21 | 否 | MIT | 1/0/1（2） | topic:mcp-security; web |  |
| [lasso-security/mcp-gateway](https://github.com/lasso-security/mcp-gateway) | A plugin-based gateway that orchestrates other MCPs and allows developers to build upon it | 新創 | 未判斷 | 396 | 2025-04-14 | 2026-01-22 | 否 | MIT | 1/0/1（2） | topic:mcp-security; web |  |
| [OWASP/www-project-agent-memory-guard](https://github.com/OWASP/www-project-agent-memory-guard) | Runtime defense against agent memory poisoning (OWASP ASI06) | 基金會/社群 | 國際/基金會 | 189 | 2026-02-16 | 2026-10-22(代) | 否 | 未取得 | 0/2/0（2） | awesome:ml,ll |  |
| [NeuralTrust/TrustGate](https://github.com/NeuralTrust/TrustGate) | Open-source AI gateway: guardrails + MCP support (Go) | 新創 | 未判斷 | 16 | 2026-05-26 | 2026-10-22(代) | 否 | 未取得 | 0/2/0（2） | awesome:ml,ll |  |
| [sunglasses-dev/sunglasses](https://github.com/sunglasses-dev/sunglasses) | Open source input firewall for AI agents (beta) | 未判斷 | 未判斷 | 10 | 2026-03-30 | 2026-10-22(代) | 否 | 未取得 | 0/2/0（2） | awesome:gov,ll |  |
| [IBM/mcp-context-forge](https://github.com/IBM/mcp-context-forge) | AI gateway/registry/proxy for MCP/A2A with guardrails & plugins | 大廠 | 美國(組織所在推測) | 4676 | 2025-05-08 | 2026-10-22(代) | 否 | 未取得 | 0/0/1（1） | web |  |
| [lennney/stop-that-shit](https://github.com/lennney/stop-that-shit) | Stop That Shit（别再造史了）｜面向 Codex/GPT 场景的多平台 Hook + Skill Guard：拦截 AI coding agent 无需求的哈希、校验和 | 個人/小團隊(User帳號) | 中文圈 | 2950 | 2026-08-11 | 2026-10-19 | 否 | MIT | 1/0/0（1） | topic:guardrails |  |
| [docker/mcp-gateway](https://github.com/docker/mcp-gateway) | docker mcp CLI plugin / MCP Gateway (containers isolation) | 大廠 | 美國(組織所在推測) | 1612 | 2025-04-22 | 2026-10-21(代) | 否 | 未取得 | 0/0/1（1） | web |  |
| [archestra-ai/OpenAPPA](https://github.com/archestra-ai/OpenAPPA) | Deterministic guardrails that don't break agents | 組織帳號(性質未細分) | 未判斷 | 1598 | 2026-08-18 | 2026-10-21 | 否 | MIT | 1/0/0（1） | topic:guardrails |  |
| [microsoft/mcp-gateway](https://github.com/microsoft/mcp-gateway) | Reverse proxy & management layer for MCP servers on K8s | 大廠 | 美國(組織所在推測) | 890 | 2025-05-14 | 2026-10-21(代) | 否 | 未取得 | 0/0/1（1） | web |  |
| [hoophq/hoop](https://github.com/hoophq/hoop) | Open-source enforcement at runtime that masks sensitive data and blocks destructive comman | 新創 | 未判斷 | 833 | 2022-08-29 | 2026-10-22 | 否 | MIT | 1/0/0（1） | topic:guardrails |  |
| [ThinkWatchProject/ThinkWatch](https://github.com/ThinkWatchProject/ThinkWatch) | Self-hosted AI API and MCP gateway for organizations: SSO and RBAC, per-user identity for  | 組織帳號(性質未細分) | 未判斷 | 819 | 2026-04-02 | 2026-10-22 | 否 | NOASSERTION | 1/0/0（1） | topic:mcp-security |  |
| [arcjet/arcjet-js](https://github.com/arcjet/arcjet-js) | Runtime security for AI apps and agents: prompt injection detection, tool-call authorizati | 新創 | 未判斷 | 693 | 2023-11-30 | 2026-10-21 | 否 | Apache-2.0 | 1/0/0（1） | topic:agent-security |  |
| [decionis/agent-safe-pipeline](https://github.com/decionis/agent-safe-pipeline) | An execution-authority gateway for AI agents and APIs. It intercepts consequential HTTP ac | 組織帳號(性質未細分) | 未判斷 | 687 | 2026-08-13 | 2026-10-22 | 否 | Apache-2.0 | 1/0/0（1） | topic:agent-security |  |
| [invariantlabs-ai/invariant](https://github.com/invariantlabs-ai/invariant) | Guardrails for secure agent development (rule language) | 新創 | 歐洲(推測) | 472 | 2024-05-08 | 2026-10-14(代) | 否 | 未取得 | 0/1/0（1） | awesome:ll |  |
| [speakeasy-api/gram](https://github.com/speakeasy-api/gram) | AI control plane / enterprise MCP gateway | 新創 | 未判斷 | 274 | 2025-08-06 | 2026-10-22(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [trailofbits/mcp-context-protector](https://github.com/trailofbits/mcp-context-protector) | MCP security wrapper | 資安廠商 | 美國(組織所在推測) | 226 | 2025-04-28 | 2026-09-21(代) | 否 | 未取得 | 0/0/1（1） | web |  |
| [trylonai/gateway](https://github.com/trylonai/gateway) | The Open Source Firewall for LLMs. A self-hosted gateway to secure and control AI applicat | 組織帳號(性質未細分) | 未判斷 | 179 | 2025-06-12 | 2025-06-25 | 否 | NOASSERTION | 1/0/0（1） | topic:llm-guardrails |  |
| [solongate/agent-security](https://github.com/solongate/agent-security) | Local-first, open-source security gateway for AI coding agents. Enforce tool-call policies | 組織帳號(性質未細分) | 未判斷 | 161 | 2026-09-27 | 2026-10-21 | 否 | Apache-2.0 | 1/0/0（1） | topic:ai-agent-security |  |
| [ZenGuard-AI/fast-llm-security-guardrails](https://github.com/ZenGuard-AI/fast-llm-security-guardrails) | The fastest Trust Layer for AI Agents | 組織帳號(性質未細分) | 未判斷 | 155 | 2024-03-11 | 2026-02-03 | 否 | MIT | 1/0/0（1） | topic:llm-guardrails |  |
| [open-bias/open-bias](https://github.com/open-bias/open-bias) | Open Source policy enforcement proxy: Make your agents follow rules. | 組織帳號(性質未細分) | 未判斷 | 145 | 2026-02-16 | 2026-10-07 | 否 | Apache-2.0 | 1/0/0（1） | topic:llm-guardrails |  |
| [tenuo-ai/tenuo](https://github.com/tenuo-ai/tenuo) | Task-scoped authorization (cryptographic warrants) for agents | 新創 | 未判斷 | 101 | 2025-12-03 | 2026-10-22(代) | 否 | 未取得 | 0/1/0（1） | awesome:ll |  |
| [ArmorerLabs/Armorer-Guard](https://github.com/ArmorerLabs/Armorer-Guard) | Public SDKs/integration contracts for Armorer Guard | 未判斷 | 未判斷 | 45 | 2026-04-12 | 2026-10-21(代) | 否 | 未取得 | 0/1/0（1） | awesome:ll |  |
| [saivedant169/AegisFlow](https://github.com/saivedant169/AegisFlow) | Local-first policy gateway for coding agents. Allow, review, or block MCP, shell, SQL, Git | 個人/小團隊(User帳號) | 未判斷 | 36 | 2026-03-24 | 2026-10-20 | 否 | Apache-2.0 | 1/0/0（1） | topic:ai-agent-security |  |
| [pixiebrix/agent-browser-shield](https://github.com/pixiebrix/agent-browser-shield) | Browser extension, 35+ rules keeping browsing agents safe | 新創 | 未判斷 | 34 | 2026-05-30 | 2026-10-20(代) | 否 | 未取得 | 0/1/0（1） | awesome:ll |  |
| [IgorGanapolsky/ThumbGate](https://github.com/IgorGanapolsky/ThumbGate) | Pre-action checks (PreToolUse) for coding agents | 未判斷 | 未判斷 | 29 | 2026-03-03 | 2026-10-21(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [agent-chaperone/agent-chaperone](https://github.com/agent-chaperone/agent-chaperone) | Screens an AI agent's tool calls before they run and tool results before the agent reads t | 組織帳號(性質未細分) | 未判斷 | 23 | 2026-09-18 | 2026-10-21 | 否 | Apache-2.0 | 1/0/0（1） | topic:ai-agent-security |  |
| [myProjectsRavi/sentinel-protocol](https://github.com/myProjectsRavi/sentinel-protocol) | Open-source AI security firewall. 81 engines for PII detection,  prompt injection defense, | 個人/小團隊(User帳號) | 未判斷 | 19 | 2026-02-17 | 2026-10-18 | 否 | MIT | 1/0/0（1） | topic:agentic-security |  |
| [webpro255/agentlock](https://github.com/webpro255/agentlock) | Pre-action authorization reference impl for agent tool calls | 未判斷 | 未判斷 | 19 | 2026-03-18 | 2026-10-05(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [sattyamjjain/agent-airlock](https://github.com/sattyamjjain/agent-airlock) | Type-checker/contract layer for agent tool calls, deny-by-default | 未判斷 | 未判斷 | 16 | 2026-01-31 | 2026-10-21(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [Shalimov04/mcp-airlock](https://github.com/Shalimov04/mcp-airlock) | Stateless governance proxy for MCP | 未判斷 | 未判斷 | 15 | 2026-09-13 | 2026-10-20(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [mdombrov-33/go-promptguard](https://github.com/mdombrov-33/go-promptguard) | LLM prompt injection detection for Go applications | 個人/小團隊(User帳號) | 未判斷 | 15 | 2025-12-19 | 2026-06-08 | 否 | MIT | 1/0/0（1） | topic:llm-guardrails |  |
| [gethelio/helio](https://github.com/gethelio/helio) | Governance proxy for MCP: block/hold tool calls, approvals, audit | 未判斷 | 未判斷 | 14 | 2026-05-19 | 2026-10-19(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [open-coder-ai/chock](https://github.com/open-coder-ai/chock) | Governance-as-code for AI coding agents via git hooks/CI | 未判斷 | 未判斷 | 10 | 2026-08-17 | 2026-10-20(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [CIRVIX/agent-control](https://github.com/CIRVIX/agent-control) | Runtime authorization infra for agent tool calls | 未判斷 | 未判斷 | 3 | 2026-08-21 | 2026-10-12(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [writ-agent/provio](https://github.com/writ-agent/provio) | One policy for Claude Code/Codex/Cursor/MCP, kernel-backstopped | 未判斷 | 未判斷 | 2 | 2026-09-21 | 2026-10-14(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [Prime-agentai/agent-approval-gate](https://github.com/Prime-agentai/agent-approval-gate) | PreToolUse hook gating spend/account/fund moves | 未判斷 | 未判斷 | 2 | 2026-08-10 | 2026-08-27(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [LuciferForge/prompt-shield](https://github.com/LuciferForge/prompt-shield) | Zero-dep prompt injection scanner (75 regex) | 未判斷 | 未判斷 | 1 | 2026-02-28 | 2026-06-19(代) | 否 | 未取得 | 0/1/0（1） | awesome:ll |  |
| [verax-ai/verax](https://github.com/verax-ai/verax) | MCP server: policy gate + signed receipts for agent tool calls | 未判斷 | 未判斷 | 0 | 2026-09-04 | 2026-10-17(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [pofky/provenrail](https://github.com/pofky/provenrail) | Guardrails for agents with signed hash-chained receipts | 未判斷 | 未判斷 | 0 | 2026-08-04 | 2026-10-12(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |

### D. 沙箱隔離（20 筆）

| repo | 定位（取自 GitHub description） | 維護者類型 | 語系/國別 | ★ | 建立 | 最後動態 | arch | 授權 | 來源 T/A/W（總） | 掃描來源明細 | 樣本 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [nolabs-ai/nono](https://github.com/nolabs-ai/nono) | agent runtime security - zero trust, zero setup, zero latency agent sandboxing | 新創 | 未判斷 | 4609 | 2026-01-31 | 2026-10-21 | 否 | Apache-2.0 | 5/0/0（5） | topic:agent-security,mcp-security,llm-security,agent-sandbox,ai-agent-security |  |
| [smol-machines/smolvm](https://github.com/smol-machines/smolvm) | An embeddable, portable, branchable virtual machine to safely run Agents locally. | 新創 | 未判斷 | 6791 | 2025-12-18 | 2026-10-22 | 否 | Apache-2.0 | 1/0/1（2） | topic:agent-sandbox; web |  |
| [stacklok/toolhive](https://github.com/stacklok/toolhive) | ToolHive is an enterprise-grade platform for running and managing Model Context Protocol ( | 新創 | 未判斷 | 2304 | 2025-03-12 | 2026-10-21 | 否 | Apache-2.0 | 1/1/0（2） | topic:mcp-security; awesome:gov |  |
| [FootprintAI/Containarium](https://github.com/FootprintAI/Containarium) | Open-source agent runtime — SSH-native isolation, eBPF egress policy, Kubernetes + LXC bac | 新創 | 未判斷 | 310 | 2025-12-28 | 2026-10-22 | 否 | Apache-2.0 | 1/0/1（2） | topic:agent-sandbox; web |  |
| [agent-sandbox/agent-sandbox](https://github.com/agent-sandbox/agent-sandbox) | Agent-Sandbox is an easy-to-use, enterprise-grade sandbox platform for AI Agents — letting | 新創 | 未判斷 | 221 | 2025-12-05 | 2026-10-22 | 否 | Apache-2.0 | 1/0/1（2） | topic:agent-sandbox; web |  |
| [daytonaio/daytona](https://github.com/daytonaio/daytona) | Secure and elastic infrastructure for AI-generated code | 新創 | 未判斷 | 71509 | 2024-02-06 | 2026-10-22(代) | 是 | 未取得 | 0/0/1（1） | web |  |
| [NVIDIA/OpenShell](https://github.com/NVIDIA/OpenShell) | Safe, private runtime for autonomous AI agents | 大廠 | 美國(組織所在推測) | 17057 | 2026-02-24 | 2026-10-22(代) | 否 | 未取得 | 0/0/1（1） | web |  |
| [e2b-dev/E2B](https://github.com/e2b-dev/E2B) | Open-source secure environment for agents | 新創 | 美國(組織所在推測) | 14495 | 2023-03-04 | 2026-10-22(代) | 否 | 未取得 | 0/0/1（1） | web |  |
| [kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox) | K8s isolated stateful singleton workloads for agent runtimes | 基金會/社群 | 國際/基金會 | 4348 | 2025-08-12 | 2026-10-22(代) | 否 | 未取得 | 0/0/1（1） | web |  |
| [clawkwork/clawk](https://github.com/clawkwork/clawk) | Give coding agents a disposable Linux VM, not your laptop | 組織帳號(性質未細分) | 未判斷 | 1030 | 2026-07-06 | 2026-08-13 | 否 | Apache-2.0 | 1/0/0（1） | topic:agent-sandbox |  |
| [afshinm/zerobox](https://github.com/afshinm/zerobox) | Lightweight, cross-platform process sandboxing powered by OpenAI Codex's runtime. Sandbox  | 個人/小團隊(User帳號) | 未判斷 | 723 | 2026-03-17 | 2026-05-17 | 否 | Apache-2.0 | 1/0/0（1） | topic:mcp-security |  |
| [delta-box/deltabox-lite](https://github.com/delta-box/deltabox-lite) | Lightweight, agent-native sandboxing with diff, commit and abort | 組織帳號(性質未細分) | 未判斷 | 362 | 2026-08-05 | 2026-10-21 | 否 | Apache-2.0 | 1/0/0（1） | topic:agent-sandbox |  |
| [gominimal/minimal](https://github.com/gominimal/minimal) | Run your agent in a Minimal box. Ship and run software with isolation on your own computer | 組織帳號(性質未細分) | 未判斷 | 222 | 2025-08-13 | 2026-10-22 | 否 | Apache-2.0 | 1/0/0（1） | topic:agent-sandbox |  |
| [mattolson/agent-sandbox](https://github.com/mattolson/agent-sandbox) | Secure local dev environment for collaboration with AI coding agents | 個人/小團隊(User帳號) | 未判斷 | 211 | 2026-01-17 | 2026-10-21 | 否 | MIT | 1/0/0（1） | topic:agent-sandbox |  |
| [Ephemeral-AI-Lab/ephemeral-sandbox](https://github.com/Ephemeral-AI-Lab/ephemeral-sandbox) | Open-source agent sandbox infrastructure for parallel coding agents: isolated workspaces,  | 組織帳號(性質未細分) | 未判斷 | 117 | 2026-04-04 | 2026-08-09 | 否 | MIT | 1/0/0（1） | topic:agent-sandbox |  |
| [tinylabscom/mvm](https://github.com/tinylabscom/mvm) | Manage secure microVMs — one command from zero to secure sessions, locally and remotely. | 組織帳號(性質未細分) | 未判斷 | 44 | 2026-02-08 | 2026-10-22 | 否 | Apache-2.0 | 1/0/0（1） | topic:ai-agent-security |  |
| [didvc/ai-bwrap](https://github.com/didvc/ai-bwrap) | Better agentic security inside a sandbox; one wrapper, any agent. | 個人/小團隊(User帳號) | 未判斷 | 27 | 2026-07-01 | 2026-10-20 | 否 | MIT | 1/0/0（1） | topic:agentic-security |  |
| [IronSecCo/ironclaw](https://github.com/IronSecCo/ironclaw) | Security-first self-hosted agents with gVisor isolation | 未判斷 | 未判斷 | 19 | 2026-06-16 | 2026-10-22(代) | 否 | 未取得 | 0/1/0（1） | awesome:ml |  |
| [albertdobmeyer/opentrapp](https://github.com/albertdobmeyer/opentrapp) | A safer way to run autonomous CLI agents on your own computer. Open-source, MIT, community | 個人/小團隊(User帳號) | 未判斷 | 2 | 2026-03-02 | 2026-09-13 | 否 | MIT | 1/0/0（1） | topic:skill-scanner |  |
| [deeplethe/forkd](https://github.com/deeplethe/forkd) | fork() for AI agent microVMs (KVM, CoW) | 新創 | 未判斷 | 2900 | 2026-05-11 | 2026-10-22(代) | 否 | 未取得 | 0/0/0（0） |  |  |

### E. 行為偵測稽核（11 筆）

| repo | 定位（取自 GitHub description） | 維護者類型 | 語系/國別 | ★ | 建立 | 最後動態 | arch | 授權 | 來源 T/A/W（總） | 掃描來源明細 | 樣本 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [secureagentics/Adrian](https://github.com/secureagentics/Adrian) | Open-source runtime AI agent security tool - monitors and controls AI agents, catching mal | 新創 | 未判斷 | 588 | 2026-05-11 | 2026-10-21 | 否 | Apache-2.0 | 3/2/1（6） | topic:agent-security,mcp-security,agentic-security; awesome:ml,ll; web |  |
| [uber/ADR](https://github.com/uber/ADR) | ADR secures enterprise AI agents through observability, security benchmarking, and threat  | 大廠 | 美國(組織所在推測) | 2073 | 2026-04-19 | 2026-10-19 | 否 | Apache-2.0 | 3/0/0（3） | topic:agent-security,llm-security,prompt-injection |  |
| [PrismorSec/prismor](https://github.com/PrismorSec/prismor) |  Self-hosted runtime control plane for AI agents. Observe or HITL approve or Block rogue t | 新創 | 未判斷 | 424 | 2026-02-20 | 2026-10-21 | 否 | Apache-2.0 | 1/1/1（3） | topic:skill-scanner; awesome:ml; web |  |
| [perplexityai/numbat](https://github.com/perplexityai/numbat) | Visibility into AI agent activity on endpoints, with on-device detection, optional pre-act | 大廠 | 美國(組織所在推測) | 1143 | 2026-07-24 | 2026-10-21 | 否 | Apache-2.0 | 2/0/0（2） | topic:agent-security,ai-agent-security |  |
| [FailproofAI/failproofai](https://github.com/FailproofAI/failproofai) | Observability and enforcement for AI agent harnesses. Capture every run and runtime reliab | 新創 | 未判斷 | 5996 | 2026-04-06 | 2026-10-21 | 否 | NOASSERTION | 1/0/0（1） | topic:guardrails |  |
| [cisco-ai-defense/defenseclaw](https://github.com/cisco-ai-defense/defenseclaw) | Security governance for agentic AI | 資安廠商 | 美國(組織所在推測) | 888 | 2026-03-23 | 2026-10-22(代) | 否 | 未取得 | 0/0/1（1） | web |  |
| [backbay-labs/clawdstrike](https://github.com/backbay-labs/clawdstrike) | Agentic AI EDR for developer workstations and autonomous agent swarms. Build Swarm Detecti | 新創 | 未判斷 | 299 | 2026-01-31 | 2026-10-21 | 否 | Apache-2.0 | 1/0/0（1） | topic:agentic-security |  |
| [GetSHIM/shim-cli](https://github.com/GetSHIM/shim-cli) | Local traffic visibility/privacy controls for coding agents | 未判斷 | 未判斷 | 39 | 2026-08-24 | 2026-10-21(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [core-aix/agitrack](https://github.com/core-aix/agitrack) | Audit trail: every agent turn becomes a traceable commit | 未判斷 | 未判斷 | 24 | 2026-06-03 | 2026-10-21(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [efij/AgentDFIR](https://github.com/efij/AgentDFIR) | Open-source digital forensics and incident response for AI agents (Claude Code, Codex, Cur | 個人/小團隊(User帳號) | 未判斷 | 11 | 2026-08-31 | 2026-10-01 | 否 | MIT | 1/0/0（1） | topic:agentic-security |  |
| [hermes-labs-ai/agent-gorgon](https://github.com/hermes-labs-ai/agent-gorgon) | User-space runtime policy guard for agent process trees | 未判斷 | 未判斷 | 3 | 2026-02-27 | 2026-09-29(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |

### F. 紅隊滲透（32 筆）

| repo | 定位（取自 GitHub description） | 維護者類型 | 語系/國別 | ★ | 建立 | 最後動態 | arch | 授權 | 來源 T/A/W（總） | 掃描來源明細 | 樣本 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [Tencent/AI-Infra-Guard](https://github.com/Tencent/AI-Infra-Guard) | A full-stack AI Red Teaming platform securing AI ecosystems via Agent Scan, Skills Scan, M | 大廠 | 中文圈 | 6933 | 2024-12-25 | 2026-10-22 | 否 | Apache-2.0 | 5/1/1（7） | topic:agent-security,ai-red-teaming,llm-security,prompt-injection,skill-scanner; awesome:gov; web |  |
| [NVIDIA/garak](https://github.com/NVIDIA/garak) | the LLM vulnerability scanner | 大廠 | 美國(組織所在推測) | 9636 | 2023-05-10 | 2026-10-21 | 否 | Apache-2.0 | 1/3/1（5） | topic:llm-security; awesome:gov,ml,ll; web |  |
| [msoedov/agentic_security](https://github.com/msoedov/agentic_security) | Agentic LLM Vulnerability Scanner / AI red teaming kit 🧪 | 個人/小團隊(User帳號) | 未判斷 | 2024 | 2024-04-11 | 2026-10-19 | 否 | Apache-2.0 | 3/2/0（5） | topic:agent-security,llm-security,llm-guardrails; awesome:ml,ll |  |
| [microsoft/PyRIT](https://github.com/microsoft/PyRIT) | Python Risk Identification Tool for generative AI (red teaming) | 大廠 | 美國(組織所在推測) | 4668 | 2023-12-12 | 2026-10-22(代) | 否 | 未取得 | 0/3/1（4） | awesome:gov,ml,ll; web | ★樣本 |
| [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) | Prompt/agent/RAG testing, red teaming, vulnerability scanning | 新創 | 美國(組織所在推測) | 26252 | 2023-04-28 | 2026-10-22(代) | 否 | 未取得 | 0/2/1（3） | awesome:ml,ll; web |  |
| [Giskard-AI/giskard-oss](https://github.com/Giskard-AI/giskard-oss) | 🐢 Open-Source Evaluation & Testing library for LLM Agents | 新創 | 歐洲(推測) | 5916 | 2022-03-06 | 2026-10-20 | 否 | Apache-2.0 | 1/1/1（3） | topic:llm-security; awesome:ml; web |  |
| [ASCIT31/Dark-Moon](https://github.com/ASCIT31/Dark-Moon) | Open-source autonomous AI penetration testing. 50 specialist agents across web, API, cloud | 組織帳號(性質未細分) | 未判斷 | 1127 | 2024-11-26 | 2026-10-01 | 否 | GPL-3.0 | 2/1/0（3） | topic:ai-red-teaming,llm-security; awesome:gov |  |
| [humanbound/humanbound](https://github.com/humanbound/humanbound) | Open-source adversarial testing engine, SDK, and CLI for AI agents. Runs locally or agains | 新創 | 未判斷 | 212 | 2026-02-08 | 2026-10-21 | 否 | Apache-2.0 | 1/2/0（3） | topic:ai-red-teaming; awesome:gov,ml |  |
| [Repello-AI/whistleblower](https://github.com/Repello-AI/whistleblower) | Whistleblower is a offensive security tool for testing against system prompt leakage and c | 新創 | 未判斷 | 179 | 2024-06-23 | 2025-10-31 | 否 | 未取得 | 1/2/0（3） | topic:ai-red-teaming; awesome:ml,ll |  |
| [confident-ai/deepteam](https://github.com/confident-ai/deepteam) | DeepTeam is a framework to red team LLMs and AI agents. | 新創 | 未判斷 | 3035 | 2025-03-05 | 2026-10-20 | 否 | Apache-2.0 | 1/0/1（2） | topic:llm-guardrails; web |  |
| [microsoft/AI-Red-Teaming-Playground-Labs](https://github.com/microsoft/AI-Red-Teaming-Playground-Labs) | AI Red Teaming playground labs to run AI Red Teaming trainings including infrastructure. | 大廠 | 未判斷 | 2103 | 2025-05-07 | 2026-02-13 | 否 | MIT | 2/0/0（2） | topic:ai-red-teaming,prompt-injection |  |
| [cyberark/FuzzyAI](https://github.com/cyberark/FuzzyAI) | A powerful tool for automated LLM fuzzing. It is designed to help developers and security  | 大廠 | 以色列(推測) | 1587 | 2024-12-03 | 2026-02-06 | 否 | Apache-2.0 | 1/0/1（2） | topic:llm-security; web |  |
| [utkusen/promptmap](https://github.com/utkusen/promptmap) | a security scanner for custom LLM applications | 個人 | 未判斷 | 1288 | 2023-07-15 | 2025-12-01 | 否 | GPL-3.0 | 1/1/0（2） | topic:prompt-injection; awesome:gov |  |
| [AgentSafeLabs/safelabs-eval](https://github.com/AgentSafeLabs/safelabs-eval) | Red-teaming and evaluation framework for AI agents, built around an OWASP-inspired ASI01–A | 新創 | 未判斷 | 910 | 2026-05-25 | 2026-10-19 | 否 | Apache-2.0 | 2/0/0（2） | topic:agent-security,prompt-injection |  |
| [prompt-security/ps-fuzz](https://github.com/prompt-security/ps-fuzz) | Test and harden GenAI app system prompts (fuzzer) | 資安廠商 | 未判斷 | 719 | 2023-12-23 | 2026-10-21(代) | 否 | 未取得 | 0/2/0（2） | awesome:ml,ll |  |
| [deadbits/vigil-llm](https://github.com/deadbits/vigil-llm) | Detect prompt injections/jailbreaks in LLM inputs | 未判斷 | 未判斷 | 507 | 2023-09-04 | 2026-10-21(代) | 否 | 未取得 | 0/2/0（2） | awesome:ml,ll |  |
| [ReversecLabs/spikee](https://github.com/ReversecLabs/spikee) | Simple Prompt Injection Kit for Evaluation and Exploitation | 資安廠商 | 未判斷 | 268 | 2024-12-05 | 2026-10-21(代) | 否 | 未取得 | 0/1/1（2） | awesome:ll; web |  |
| [NuGuardAI/nuguard](https://github.com/NuGuardAI/nuguard) | AI red-teaming tool and LLM security framework to evaluate agentic AI applications. Tests  | 新創 | 未判斷 | 64 | 2026-03-20 | 2026-10-22 | 否 | NOASSERTION | 1/1/0（2） | topic:ai-red-teaming; awesome:ll |  |
| [usestrix/strix](https://github.com/usestrix/strix) | Open-source AI penetration testing tool to find and fix your app’s vulnerabilities. | 新創 | 美國(組織所在推測) | 70891 | 2025-08-05 | 2026-10-22 | 否 | Apache-2.0 | 1/0/0（1） | topic:llm-security | ★樣本 |
| [KeygraphHQ/shannon](https://github.com/KeygraphHQ/shannon) | Shannon is an AI pentester for web applications and APIs. It analyzes your source code, id | 新創 | 美國(組織所在推測) | 49198 | 2025-09-27 | 2026-10-15 | 否 | AGPL-3.0 | 1/0/0（1） | topic:owasp |  |
| [GreyDGL/PentestGPT](https://github.com/GreyDGL/PentestGPT) | Automated penetration testing agentic framework | 個人 | 未判斷 | 16070 | 2023-02-27 | 2026-10-22(代) | 否 | 未取得 | 0/0/1（1） | web |  |
| [aliasrobotics/cai](https://github.com/aliasrobotics/cai) | Cybersecurity AI (CAI) framework | 資安廠商 | 未判斷 | 9843 | 2025-03-31 | 2026-10-22(代) | 是 | 未取得 | 0/0/1（1） | web |  |
| [CyberStrikeus/CyberStrike](https://github.com/CyberStrikeus/CyberStrike) | Open-source AI-powered offensive security harness for automated penetration testing. | 組織帳號(性質未細分) | 未判斷 | 3218 | 2026-02-14 | 2026-10-20 | 否 | AGPL-3.0 | 1/0/0（1） | topic:llm-security |  |
| [KeyValueSoftwareSystems/agent-opfor](https://github.com/KeyValueSoftwareSystems/agent-opfor) | Open-source adversary emulation for AI agents and MCP servers.  | 新創 | 未判斷 | 583 | 2026-04-06 | 2026-10-21 | 否 | NOASSERTION | 1/0/0（1） | topic:ai-red-teaming |  |
| [CyberSunil/LLMVault](https://github.com/CyberSunil/LLMVault) | Intentionally vulnerable OWASP LLM Top 10 training platform | 未判斷 | 未判斷 | 342 | 2026-07-15 | 2026-10-20(代) | 否 | 未取得 | 0/1/0（1） | awesome:ll |  |
| [appsecco/vulnerable-mcp-servers-lab](https://github.com/appsecco/vulnerable-mcp-servers-lab) | A collection of servers which are deliberately vulnerable to learn Pentesting MCP Servers. | 資安廠商 | 未判斷 | 281 | 2025-12-18 | 2025-12-18 | 否 | MIT | 1/0/0（1） | topic:ai-red-teaming |  |
| [BishopFox/BrokenHill](https://github.com/BishopFox/BrokenHill) | Productionized GCG attack tool for LLMs | 資安廠商 | 未判斷 | 176 | 2024-07-25 | 2026-10-20(代) | 否 | 未取得 | 0/1/0（1） | awesome:ll |  |
| [BCG-X-Official/artkit](https://github.com/BCG-X-Official/artkit) | Automated prompt-based testing of GenAI apps | 未判斷 | 未判斷 | 174 | 2024-06-09 | 2026-10-21(代) | 否 | 未取得 | 0/1/0（1） | awesome:ml |  |
| [Fausto-404/skill-evasion-lab](https://github.com/Fausto-404/skill-evasion-lab) | 面向 Agent Skills 安全研究的检测绕过实验仓库，用于验证恶意 Skill 在静态扫描、语义分析与运行时执行之间可能存在的检测盲区。 | 個人/小團隊(User帳號) | 中文圈 | 7 | 2026-08-06 | 2026-08-10 | 否 | Apache-2.0 | 1/0/0（1） | topic:skill-scanner |  |
| [m0rvayne/mcp-redteam](https://github.com/m0rvayne/mcp-redteam) | Active red-teaming for MCP servers. Source analysis + live exploitation + auto-fix. Claude | 個人/小團隊(User帳號) | 未判斷 | 3 | 2026-06-07 | 2026-09-14 | 否 | MIT | 1/0/0（1） | topic:mcp-scanner |  |
| [0x4m4/hexstrike-ai](https://github.com/0x4m4/hexstrike-ai) | MCP server letting agents run 150+ offensive security tools | 新創 | 未判斷 | 13004 | 2025-07-10 | 2026-10-22(代) | 否 | 未取得 | 0/0/0（0） |  | ★樣本 |
| [AISecurityLab/hackagent](https://github.com/AISecurityLab/hackagent) | Security toolkit to detect vulnerabilities of AI agents | 學術 | 未判斷 | 528 | 2025-05-14 | 2026-10-20(代) | 否 | 未取得 | 0/0/0（0） |  | ★樣本 |

### G. 偵測規則標準（3 筆）

| repo | 定位（取自 GitHub description） | 維護者類型 | 語系/國別 | ★ | 建立 | 最後動態 | arch | 授權 | 來源 T/A/W（總） | 掃描來源明細 | 樣本 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [Agent-Threat-Rule/agent-threat-rules](https://github.com/Agent-Threat-Rule/agent-threat-rules) | Open detection-rule standard for AI agent security threats — like Sigma, but for AI agents | 組織帳號(性質未細分) | 未判斷 | 421 | 2026-03-09 | 2026-10-22 | 否 | MIT | 1/0/0（1） | topic:mcp-security |  |
| [agentbaseline/agentbaseline](https://github.com/agentbaseline/agentbaseline) | Six security outcomes an enterprise must achieve to run AI agents, and the controls that e | 組織帳號(性質未細分) | 未判斷 | 71 | 2026-07-28 | 2026-10-14 | 否 | CC-BY-4.0 | 1/0/0（1） | topic:ai-agent-security |  |
| [backbay-labs/hush](https://github.com/backbay-labs/hush) | Portable security rules for the action boundary of AI agents | 新創 | 未判斷 | 25 | 2026-03-15 | 2026-10-19 | 否 | Apache-2.0 | 1/0/0（1） | topic:agentic-security |  |

### H. 威脅分類（6 筆）

| repo | 定位（取自 GitHub description） | 維護者類型 | 語系/國別 | ★ | 建立 | 最後動態 | arch | 授權 | 來源 T/A/W（總） | 掃描來源明細 | 樣本 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [webpro255/awesome-ai-agent-attacks](https://github.com/webpro255/awesome-ai-agent-attacks) | A curated timeline of real AI agent security incidents, breaches, and vulnerabilities (202 | 個人/小團隊(User帳號) | 未判斷 | 84 | 2026-04-07 | 2026-10-21 | 否 | MIT | 1/1/0（2） | topic:ai-agent-security; awesome:gov |  |
| [cloudsecurityalliance/maestro](https://github.com/cloudsecurityalliance/maestro) | (API 未回傳) | 基金會/社群 | 國際/基金會 | 未取得 | 未取得 | 未取得 | 未取得 | 未取得 | 0/1/1（2） | awesome:gov; web |  |
| [continuum-ai-corp/orca-ai-incident-archive](https://github.com/continuum-ai-corp/orca-ai-incident-archive) | (API 未回傳) | 未判斷 | 中文圈 | 未取得 | 未取得 | 未取得 | 未取得 | 未取得 | 0/2/0（2） | awesome:gov,ll |  |
| [OWASP/www-project-top-10-for-large-language-model-applications](https://github.com/OWASP/www-project-top-10-for-large-language-model-applications) | OWASP Top 10 for Large Language Model Apps (Part of the GenAI Security Project) | 基金會/社群 | 國際/基金會 | 1461 | 2023-05-16 | 2026-08-05 | 否 | NOASSERTION | 1/0/0（1） | topic:llm-security |  |
| [OWASP/www-project-agentic-skills-top-10](https://github.com/OWASP/www-project-agentic-skills-top-10) | OWASP Agentic Skills Top 10 (web repo) | 基金會/社群 | 國際/基金會 | 332 | 2026-03-21 | 2026-10-21(代) | 否 | 未取得 | 0/0/1（1） | web |  |
| [aveproject/ave](https://github.com/aveproject/ave) | AVE: Agentic Vulnerability Enumeration, behavioral classification standard | 未判斷 | 未判斷 | 23 | 2026-04-14 | 2026-10-18(代) | 否 | 未取得 | 0/1/0（1） | awesome:gov |  |
| OWASP Top 10 for Agentic Applications 2026（genai.owasp.org，GitHub repo 未找到） | 同行審查的 agentic 十大風險框架（2025-12-10 發布，官方頁自述 100+ 業界協作者） | 基金會/社群 | 國際/基金會 | 不適用 | 2025-12（頁面日期） | 未取得 | 否 | 未取得 | 0/0/1（1；另被 awesome 清單內文提及但無獨立連結） | web | ★樣本 |

### I. 評測 benchmark（10 筆）

| repo | 定位（取自 GitHub description） | 維護者類型 | 語系/國別 | ★ | 建立 | 最後動態 | arch | 授權 | 來源 T/A/W（總） | 掃描來源明細 | 樣本 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [ethz-spylab/agentdojo](https://github.com/ethz-spylab/agentdojo) | A Dynamic Environment to Evaluate Attacks and Defenses for LLM Agents. | 學術 | 歐洲(推測) | 950 | 2024-02-29 | 2026-06-02 | 否 | MIT | 1/1/1（3） | topic:prompt-injection; awesome:gov; web |  |
| [ifixai-ai/iFixAi](https://github.com/ifixai-ai/iFixAi) | Independent Auditing of AI Agents. Run by human or the agent itself, to answer the most cr | 新創 | 未判斷 | 32059 | 2026-04-27 | 2026-10-22 | 否 | Apache-2.0 | 2/0/0（2） | topic:llm-security,prompt-injection |  |
| [Privatris/AgentLeak](https://github.com/Privatris/AgentLeak) | Open benchmark for privacy leakage in LLM agents | 學術 | 未判斷 | 35 | 2025-12-24 | 2026-10-19(代) | 否 | 未取得 | 0/2/0（2） | awesome:gov,ll |  |
| [microsoftarchive/promptbench](https://github.com/microsoftarchive/promptbench) | Unified evaluation framework for LLM adversarial robustness | 大廠 | 未判斷 | 2820 | 2023-06-13 | 2026-10-20(代) | 是 | 未取得 | 0/1/0（1） | awesome:gov |  |
| [meridianlabs-ai/inspect_petri](https://github.com/meridianlabs-ai/inspect_petri) | Alignment auditing agent | 未判斷 | 未判斷 | 1385 | 2025-08-19 | 2026-10-21(代) | 否 | 未取得 | 0/1/0（1） | awesome:ml |  |
| [NVIDIA/SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator) | Multi-tier framework for evaluating AI agent skills with quality gates, semantic overlap d | 大廠 | 美國(組織所在推測) | 587 | 2026-06-24 | 2026-10-22 | 否 | Apache-2.0 | 1/0/0（1） | topic:agent-security |  |
| [agiresearch/ASB](https://github.com/agiresearch/ASB) | Agent Security Bench | 學術 | 未判斷 | 319 | 2024-10-03 | 2026-10-21(代) | 否 | 未取得 | 0/1/0（1） | awesome:ll |  |
| [UKGovernmentBEIS/control-arena](https://github.com/UKGovernmentBEIS/control-arena) | Settings/protocols for AI control experiments | 學術 | 歐洲(推測) | 256 | 2025-02-06 | 2026-10-21(代) | 否 | 未取得 | 0/1/0（1） | awesome:ml |  |
| [whitecircle/circle-guard-bench](https://github.com/whitecircle/circle-guard-bench) | Benchmark for LLM guard systems | 學術 | 未判斷 | 82 | 2025-04-24 | 2026-10-16(代) | 否 | 未取得 | 0/1/0（1） | awesome:ml |  |
| [lakeraai/pint-benchmark](https://github.com/lakeraai/pint-benchmark) | (API 未回傳) | 新創 | 中文圈 | 未取得 | 未取得 | 未取得 | 未取得 | 未取得 | 0/1/0（1） | awesome:ll |  |

## B. 覆蓋矩陣草稿（層 × 維度）

每格格式：`數量: repo名…`（最多列 5 個，其餘以 +N 表示）；`（空）`= 缺口。分母為本清單 172 筆，不是整個 GitHub；各維度的判斷口徑見各表下方。

### B.1 層 × 規模（stars）

| 層 | 大(≥5000) | 中(500-4999) | 小(<500) |
|---|---|---|---|
| A 審計 skill | 2: security-audit-skill★, skills★ | 1: ship-safe | 2: claude-code-owasp, cyber-neo |
| B 安裝前掃描 | 1: SkillSpector★ | 8: agent-scan, skill-scanner★, mcp-scanner, agentic-radar, medusa +3 | 23: Agent-Wiz, agentseal★, repo-forensics, a2a-scanner, clawscan +18 |
| C 執行期護欄/閘道 | 5: bifrost, guardrails, Guardrails, superagent, agent-governance-toolkit★ | 18: mcp-context-forge, PurpleLlama, llm-guard, stop-that-shit, cc-safety-net +13 | 30: invariant, mcp-gateway, gram, mcp-context-protector, www-project-agent-memory-guard +25 |
| D 沙箱隔離 | 4: daytona, OpenShell, E2B, smolvm | 6: nono, agent-sandbox, forkd, toolhive, clawk +1 | 10: deltabox-lite, Containarium, minimal, agent-sandbox, agent-sandbox +5 |
| E 行為偵測稽核 | 1: failproofai | 4: ADR, numbat, defenseclaw, Adrian | 6: prismor, clawdstrike, shim-cli, agitrack, AgentDFIR +1 |
| F 紅隊滲透 | 9: strix★, shannon, promptfoo, PentestGPT, hexstrike-ai★ +4 | 13: PyRIT★, CyberStrike, deepteam, AI-Red-Teaming-Playground-Labs, agentic_security +8 | 10: LLMVault, vulnerable-mcp-servers-lab, spikee, humanbound, whistleblower +5 |
| G 偵測規則標準 | （空） | （空） | 3: agent-threat-rules, agentbaseline, hush |
| H 威脅分類 | （空） | 1: www-project-top-10-for-large-language-model-applications | 3: www-project-agentic-skills-top-10, awesome-ai-agent-attacks, ave |
| I 評測 benchmark | 1: iFixAi | 4: promptbench, inspect_petri, agentdojo, SkillEvaluator | 4: ASB, control-arena, circle-guard-bench, AgentLeak |

口徑：stars ≥5000 大、500–4999 中、<500 小；3 筆沒有 metadata 未計。

### B.2 層 × 維護者類型

| 層 | 大廠 | 資安廠商 | 新創 | 學術 | 基金會/社群 | 個人 | 個人/小團隊(User帳號) | 組織帳號(性質未細分) | 未判斷 |
|---|---|---|---|---|---|---|---|---|---|
| A 審計 skill | 1: security-audit-skill★ | 1: skills★ | （空） | （空） | （空） | （空） | 1: ship-safe | （空） | 2: claude-code-owasp, cyber-neo |
| B 安裝前掃描 | 1: SkillSpector★ | 5: agent-scan, skill-scanner★, mcp-scanner, medusa, a2a-scanner | 3: agentic-radar, Agent-Wiz, agentseal★ | （空） | （空） | （空） | 13: api-relay-audit, mcp-audit-tool, repo-forensics, agent-security-scanner-mcp, vetix +8 | 5: Semia, clawscan, scanner, skill-firewall, mcpaudit | 5: skillhawk, agent-audit-kit, skill-audit-mcp, ironheights, lazaretto-plugins |
| C 執行期護欄/閘道 | 6: Guardrails, agent-governance-toolkit★, mcp-context-forge, PurpleLlama, mcp-gateway +1 | 3: llm-guard, rebuff, mcp-context-protector | 13: bifrost, superagent, langkit, pipelock, hoop +8 | （空） | 1: www-project-agent-memory-guard | （空） | 5: stop-that-shit, cc-safety-net, AegisFlow, sentinel-protocol, go-promptguard | 10: OpenAPPA, hol-guard, ThinkWatch, agent-safe-pipeline, emilia-protocol +5 | 15: guardrails, Armorer-Guard, ThumbGate, agentlock, agent-airlock +10 |
| D 沙箱隔離 | 1: OpenShell | （空） | 8: daytona, E2B, smolvm, nono, forkd +3 | （空） | 1: agent-sandbox | （空） | 4: zerobox, agent-sandbox, ai-bwrap, opentrapp | 5: clawk, deltabox-lite, minimal, ephemeral-sandbox, mvm | 1: ironclaw |
| E 行為偵測稽核 | 2: ADR, numbat | 1: defenseclaw | 4: failproofai, Adrian, prismor, clawdstrike | （空） | （空） | （空） | 1: AgentDFIR | （空） | 3: shim-cli, agitrack, agent-gorgon |
| F 紅隊滲透 | 5: garak, AI-Infra-Guard, PyRIT★, AI-Red-Teaming-Playground-Labs, FuzzyAI | 5: cai, ps-fuzz, vulnerable-mcp-servers-lab, spikee, BrokenHill | 11: strix★, shannon, promptfoo, hexstrike-ai★, giskard-oss +6 | 1: hackagent★ | （空） | 2: PentestGPT, promptmap | 3: agentic_security, skill-evasion-lab, mcp-redteam | 2: CyberStrike, Dark-Moon | 3: vigil-llm, LLMVault, artkit |
| G 偵測規則標準 | （空） | （空） | 1: hush | （空） | （空） | （空） | （空） | 2: agent-threat-rules, agentbaseline | （空） |
| H 威脅分類 | （空） | （空） | （空） | （空） | 3: www-project-top-10-for-large-language-model-applications, www-project-agentic-skills-top-10, maestro | （空） | 1: awesome-ai-agent-attacks | （空） | 2: ave, orca-ai-incident-archive |
| I 評測 benchmark | 2: promptbench, SkillEvaluator | （空） | 2: iFixAi, pint-benchmark | 5: agentdojo, ASB, control-arena, circle-guard-bench, AgentLeak | （空） | （空） | （空） | （空） | 1: inspect_petri |

口徑：大廠／資安廠商／新創／學術／基金會為人工依 org 判斷；「User帳號」「組織帳號」是 GitHub owner.type 的機械回填，沒有細分到新創或資安廠商，這兩欄是「未判斷」的變體，不應解讀為真的個人或真的公司。

### B.3 層 × 地理/語系圈

| 層 | 美國(組織所在推測) | 歐洲(推測) | 以色列(推測) | 中文圈 | 國際/基金會 | 未判斷 |
|---|---|---|---|---|---|---|
| A 審計 skill | 2: security-audit-skill★, skills★ | （空） | （空） | （空） | （空） | 3: ship-safe, claude-code-owasp, cyber-neo |
| B 安裝前掃描 | 4: SkillSpector★, skill-scanner★, mcp-scanner, a2a-scanner | 2: agent-scan, agentic-radar | （空） | （空） | （空） | 26: medusa, api-relay-audit, Semia, mcp-audit-tool, Agent-Wiz +21 |
| C 執行期護欄/閘道 | 9: Guardrails, agent-governance-toolkit★, mcp-context-forge, PurpleLlama, llm-guard +4 | 1: invariant | （空） | 1: stop-that-shit | 1: www-project-agent-memory-guard | 41: bifrost, guardrails, superagent, cc-safety-net, OpenAPPA +36 |
| D 沙箱隔離 | 2: OpenShell, E2B | （空） | （空） | （空） | 1: agent-sandbox | 17: daytona, smolvm, nono, forkd, toolhive +12 |
| E 行為偵測稽核 | 3: ADR, numbat, defenseclaw | （空） | （空） | （空） | （空） | 8: failproofai, Adrian, prismor, clawdstrike, shim-cli +3 |
| F 紅隊滲透 | 5: strix★, shannon, promptfoo, garak, PyRIT★ | 1: giskard-oss | 1: FuzzyAI | 2: AI-Infra-Guard, skill-evasion-lab | （空） | 23: PentestGPT, hexstrike-ai★, cai, CyberStrike, deepteam +18 |
| G 偵測規則標準 | （空） | （空） | （空） | （空） | （空） | 3: agent-threat-rules, agentbaseline, hush |
| H 威脅分類 | （空） | （空） | （空） | 1: orca-ai-incident-archive | 3: www-project-top-10-for-large-language-model-applications, www-project-agentic-skills-top-10, maestro | 2: awesome-ai-agent-attacks, ave |
| I 評測 benchmark | 1: SkillEvaluator | 2: agentdojo, control-arena | （空） | 1: pint-benchmark | （空） | 6: iFixAi, promptbench, inspect_petri, ASB, circle-guard-bench +1 |

口徑：GitHub 資料沒有國別欄位，只能依 org 名與 description 語言推測；「未判斷」佔絕大多數，這一維度的缺口主要是資料缺口，不是母群缺口。

### B.4 層 × 生命週期

| 層 | 活躍(≤30d) | 近期有動(30-180d) | 停更>180d | archived |
|---|---|---|---|---|
| A 審計 skill | 5: security-audit-skill★, skills★, ship-safe, claude-code-owasp, cyber-neo | （空） | （空） | （空） |
| B 安裝前掃描 | 23: SkillSpector★, agent-scan, skill-scanner★, mcp-scanner, api-relay-audit +18 | 6: medusa, Semia, agentseal★, skill-firewall, sentinel-scan-cli +1 | 2: agentic-radar, SkillScan | 1: skillscan-security |
| C 執行期護欄/閘道 | 42: bifrost, guardrails, Guardrails, agent-governance-toolkit★, mcp-context-forge +37 | 5: superagent, mcp-context-protector, go-promptguard, agent-approval-gate, prompt-shield | 4: langkit, mcp-gateway, gateway, fast-llm-security-guardrails | 2: llm-guard, rebuff |
| D 沙箱隔離 | 15: OpenShell, E2B, smolvm, nono, agent-sandbox +10 | 4: clawk, zerobox, ephemeral-sandbox, opentrapp | （空） | 1: daytona |
| E 行為偵測稽核 | 11: failproofai, ADR, numbat, defenseclaw, Adrian +6 | （空） | （空） | （空） |
| F 紅隊滲透 | 24: strix★, shannon, promptfoo, PentestGPT, hexstrike-ai★ +19 | 2: skill-evasion-lab, mcp-redteam | 5: AI-Red-Teaming-Playground-Labs, FuzzyAI, promptmap, vulnerable-mcp-servers-lab, whistleblower | 1: cai |
| G 偵測規則標準 | 3: agent-threat-rules, agentbaseline, hush | （空） | （空） | （空） |
| H 威脅分類 | 3: www-project-agentic-skills-top-10, awesome-ai-agent-attacks, ave | 1: www-project-top-10-for-large-language-model-applications | （空） | （空） |
| I 評測 benchmark | 7: iFixAi, inspect_petri, SkillEvaluator, ASB, control-arena +2 | 1: agentdojo | （空） | 1: promptbench |

口徑：以 pushed_at（無則 updated_at）距 2026-10-22 天數；archived 以 API archived 欄位為準。

### B.5 層 × 授權

| 層 | OSI常見授權(GitHub偵測) | NOASSERTION(需人工讀LICENSE) | 未取得 |
|---|---|---|---|
| A 審計 skill | 1: ship-safe | （空） | 4: security-audit-skill★, skills★, claude-code-owasp, cyber-neo |
| B 安裝前掃描 | 20: SkillSpector★, agentic-radar, medusa, api-relay-audit, Semia +15 | 2: agentseal★, repo-forensics | 10: agent-scan, skill-scanner★, mcp-scanner, Agent-Wiz, a2a-scanner +5 |
| C 執行期護欄/閘道 | 24: bifrost, superagent, agent-governance-toolkit★, llm-guard, stop-that-shit +19 | 3: Guardrails, ThinkWatch, gateway | 26: guardrails, mcp-context-forge, PurpleLlama, mcp-gateway, mcp-gateway +21 |
| D 沙箱隔離 | 14: smolvm, nono, toolhive, clawk, zerobox +9 | （空） | 6: daytona, OpenShell, E2B, agent-sandbox, forkd +1 |
| E 行為偵測稽核 | 6: ADR, numbat, Adrian, prismor, clawdstrike +1 | 1: failproofai | 4: defenseclaw, shim-cli, agitrack, agent-gorgon |
| F 紅隊滲透 | 17: strix★, shannon, garak, AI-Infra-Guard, giskard-oss +12 | 2: agent-opfor, nuguard | 13: promptfoo, PentestGPT, hexstrike-ai★, cai, PyRIT★ +8 |
| G 偵測規則標準 | 3: agent-threat-rules, agentbaseline, hush | （空） | （空） |
| H 威脅分類 | 1: awesome-ai-agent-attacks | 1: www-project-top-10-for-large-language-model-applications | 4: www-project-agentic-skills-top-10, ave, maestro, orca-ai-incident-archive |
| I 評測 benchmark | 3: iFixAi, agentdojo, SkillEvaluator | （空） | 7: promptbench, inspect_petri, ASB, control-arena, circle-guard-bench +2 |

口徑：GitHub 偵測不到 SPDX 的 NOASSERTION 可能是 source-available（FSL/BUSL 等）、雙授權或自訂條款，需人工讀 LICENSE；本輪沒有逐一讀。未取得 = 補查路徑沒回授權欄位。

### B.6 層 × 成立時間

| 層 | 早(<2024) | 中(2024-01~2025-06) | 近(≥2025-07) |
|---|---|---|---|
| A 審計 skill | （空） | （空） | 5: security-audit-skill★, skills★, ship-safe, claude-code-owasp, cyber-neo |
| B 安裝前掃描 | （空） | 3: agent-scan, agentic-radar, Agent-Wiz | 29: SkillSpector★, skill-scanner★, mcp-scanner, medusa, api-relay-audit +24 |
| C 執行期護欄/閘道 | 10: guardrails, Guardrails, superagent, PurpleLlama, llm-guard +5 | 9: bifrost, mcp-context-forge, mcp-gateway, mcp-gateway, invariant +4 | 34: agent-governance-toolkit★, stop-that-shit, cc-safety-net, OpenAPPA, hol-guard +29 |
| D 沙箱隔離 | 1: E2B | 2: daytona, toolhive | 17: OpenShell, smolvm, nono, agent-sandbox, forkd +12 |
| E 行為偵測稽核 | （空） | （空） | 11: failproofai, ADR, numbat, defenseclaw, Adrian +6 |
| F 紅隊滲透 | 8: promptfoo, PentestGPT, garak, giskard-oss, PyRIT★ +3 | 12: cai, AI-Infra-Guard, deepteam, AI-Red-Teaming-Playground-Labs, agentic_security +7 | 12: strix★, shannon, hexstrike-ai★, CyberStrike, safelabs-eval +7 |
| G 偵測規則標準 | （空） | （空） | 3: agent-threat-rules, agentbaseline, hush |
| H 威脅分類 | 1: www-project-top-10-for-large-language-model-applications | （空） | 3: www-project-agentic-skills-top-10, awesome-ai-agent-attacks, ave |
| I 評測 benchmark | 1: promptbench | 4: agentdojo, ASB, control-arena, circle-guard-bench | 4: iFixAi, inspect_petri, SkillEvaluator, AgentLeak |

口徑：created_at；早 <2024-01、中 2024-01~2025-06、近 ≥2025-07。注意 created_at 是該 repo 建立日，改名或搬家（如 Azure/PyRIT）會失真。

### A 節補充：值得提及的閉源／不納入產品與排除項

**閉源或商業平台（排除原因：非開源，無法納入母群；僅從網頁搜尋片段得知，未查證細節）**

| 產品 | 出處 | 排除原因 |
|---|---|---|
| Mindgard（平台） | Mindgard 自家部落格、NeuralTrust 與 Kosmoy 比較文 | 平台為專有授權，僅有 CLI 工具可取得（比較文自述 "Proprietary (CLI tooling available)"） |
| Lakera Red、HiddenLayer AutoRT、Protect AI RECON | Mindgard、Mend 比較文 | 商業 SaaS |
| Noma、Zenity、Operant（平台；其 Woodpecker 為開源） | NeuralTrust、securecoding 比較文 | 商業平台 |
| Palo Alto Prisma AIRS、Cortex AES、Cato、Silverfort、Aembit、Descope | ReVerb、securecoding、Gartner 相關頁面 | 商業平台 |
| Repello SkillCheck | repello.ai 部落格 | 瀏覽器版閉源掃描器（只見其部落格，未見 repo） |
| ESET AI Skills Checker | cybersectools.com 比較頁 | 自述為免費工具，但是否開源未查（歸類「未驗證」，不納入） |
| Gartner Market Guide for Guardian Agents（2026-02-25）、AI TRiSM Market Guide | gartner.com 目錄頁、廠商轉述 | 付費報告，僅讀到摘要與廠商轉述，無法取得完整廠商清單 |

**開源但依母群定義排除（只列在 awesome 清單／topic 中高頻出現者）**：OPA、Cedar、Casbin、Ory Keto（通用授權引擎，與 agent 無直接關係）；Arize Phoenix、OpenLLMetry、Opik、Helicone、LiteLLM（LLM 可觀測性／閘道，非安全）；OWASP CheatSheetSeries、WSTG、Juice Shop、Amass、MobSF、Coraza、CRS（傳統資安）；verazuo/jailbreak_llms、tg12/gpt_jailbreak_status（純越獄資料集）；llm-attacks/llm-attacks、protectai/modelscan（模型層攻擊／模型序列化掃描，非面向 coding agent 開發者）；各類 awesome 清單本身（Puliczek/awesome-mcp-security 等，作為掃描來源但不計入工具）。

## C. 偏誤初判

比較基準：本清單 172 筆（+OWASP Agentic Top 10 一筆標準）vs 已研究 11 個樣本。**這是「候選母群」的偏誤，不是整個領域的偏誤**，因為母群本身來自 awesome 清單與 topic 搜尋，有自己的偏向（見 C.4）。

### C.1 樣本偏向哪裡（以數字說明）

| 維度 | 樣本 | 母群 | 讀法 |
|---|---|---|---|
| stars 中位數 | 7,079（n=10） | 380（n=169） | 樣本是母群的約 19 倍；樣本幾乎全是「已經很紅」的 repo |
| 規模 | 大 6／中 3／小 1 | 大 23／中 55／小 91 | 小型專案占母群 54%，樣本只有 1 個（agentseal，380★） |
| 成立時間 | 近 8／中 1／早 1 | 近 118／中 30／早 21 | 樣本偏近期，與母群比例相近（近期都占多數），偏誤不在這一軸 |
| 維護者 | 大廠 4／資安廠商 2／新創 3／學術 1／個人 0 | 大廠 18／資安廠商 15／新創 42／學術 6／基金會 5／個人與 User 帳號約 30 | 樣本完全沒有個人或小團隊（母群 User 帳號與個人合計約 17%，其中 User 帳號是機械回填），也沒有基金會工具；大廠占樣本 40% vs 母群 10% |
| 層 | A2／B3／C1／F4 | A5／B32／C53／D20／E11／F32／G3／H6／I10 | 樣本只覆蓋 4 個層（其中 OWASP Agentic Top 10 補在 H 層，實質上 5 層）；D 沙箱、E 行為偵測、G 規則標準、I 評測完全沒有樣本 |
| 授權 | 偵測到 OSI 常見授權的 3、NOASSERTION 1（agentseal）、其餘未取得 | — | 樣本中只有 agentseal 是 NOASSERTION，其他資料缺口來自補查路徑；無法判斷樣本是否偏 source-available |
| 生命週期 | 活躍 9／近期 1 | 活躍 133／停更 11／archived 6 | 樣本完全沒有停更或 archived 專案（母群 17 筆，約 10%） |
| 語系／國別 | 美國（推測）7／未判斷 3 | 中文圈 5、歐洲 6、以色列 1 | 樣本沒有任何非英語圈或非美國工具；但母群裡可判斷國別的比例也很低，此欄可信度有限 |

### C.2 11 樣本漏掉的層與類型

1. **沙箱隔離（D）整層缺席**：母群 20 筆，含 daytona、E2B、NVIDIA OpenShell、kubernetes-sigs/agent-sandbox、nono、smolvm、forkd。網頁搜尋「AI agent sandbox open source comparison」自成一個產品類別，且比較文裡常見的 Claude Code 沙箱底層 `anthropic-experimental/sandbox-runtime`、OpenAI Codex CLI 的 Seatbelt／Landlock 沙箱，在 GitHub topic 結果中完全沒出現（本輪補查 `sandbox-runtime` 只找到第三方移植版，原 repo 未取得，需另查）。
2. **行為偵測與稽核（E）整層缺席**：Adrian（6 個來源，母群最高頻之一）、Cisco DefenseClaw、perplexityai/numbat、backbay-labs/clawdstrike（自稱 Agentic AI EDR）、Prismor、uber/ADR。
3. **規則標準（G）與威脅分類（H）幾乎缺席**：只有 OWASP Agentic Top 10 一個。母群裡還有 Agent-Threat-Rule（自稱像 Sigma 的偵測規則標準）、AVE（Agentic Vulnerability Enumeration）、CSA MAESTRO、OWASP Agentic Skills Top 10、OWASP LLM Top 10。
4. **評測（I）缺席**：AgentDojo（3 個來源）、ASB、AgentLeak、control-arena、circle-guard-bench、pint-benchmark 等。樣本中的評測類只有 PyRIT／hackagent 這種「工具」，沒有 benchmark。
5. **安裝前掃描（B）樣本只有 3 個**（SkillSpector、skill-scanner、agentseal），母群 32 筆，缺少 snyk/agent-scan（3,161★，樣本同題材卻漏掉，且有網頁搜尋命中）、cisco mcp-scanner、splx-ai/agentic-radar、graygnatconsole/mcp-audit-tool（4 個來源，見 D 節）。
6. **紅隊（F）樣本偏「agent 型滲透工具」**：strix、hexstrike-ai、hackagent 是「用 AI 去打別人」或「測 AI agent」，缺了 LLM 紅隊三大常客 garak（5 個來源）、promptfoo（3 個來源）、Giskard、DeepTeam，也缺 Tencent/AI-Infra-Guard（7 個來源，母群最高）。
7. **執行期護欄（C）只有 agent-governance-toolkit 一個**，母群 53 筆是最大的層，包含 NeMo Guardrails（5 個來源）、guardrails-ai、llm-guard（archived）、Bifrost（4 個來源）、pipelock（4 個來源）、hol-guard（5 個來源）、docker／IBM／Microsoft 三家 MCP gateway。

### C.3 「出現在多個來源、但 11 樣本沒涵蓋」的高頻工具（總來源 ≥3）

| 總來源 | repo | 層 | ★ | 備註 |
|---|---|---|---|---|
| 7 | Tencent/AI-Infra-Guard | F | 6,933 | 5 個 topic + gov awesome + web；中文圈大廠（Tencent 朱雀實驗室，依 description 判斷） |
| 6 | secureagentics/Adrian | E | 588 | 3 個 topic + awesome×2 + web |
| 5 | NVIDIA-NeMo/Guardrails | C | 7,342 | 2 個 topic + 3 份 awesome；授權欄為 NOASSERTION；awesome 寫作 NVIDIA/NeMo-Guardrails（已合併別名） |
| 5 | hashgraph-online/hol-guard | C | 963 | 4 個 topic + ml-awesome |
| 5 | nolabs-ai/nono | D | 4,609 | 5 個 topic，不在任何 awesome；建立 2026-01 |
| 5 | NVIDIA/garak | F | 9,636 | 1 topic + 3 份 awesome + web |
| 5 | msoedov/agentic_security | F | 2,024 | 3 topic + 2 awesome |
| 4 | graygnatconsole/mcp-audit-tool | B | 585 | 3 個 topic + web；建立 26 天，見 D 節 |
| 4 | pipelab-org/pipelock | C | 951 | 4 個 topic |
| 4 | protectai/llm-guard | C | 3,217 | 2 個 topic + gov + ll；archived |
| 4 | maximhq/bifrost | C | 9,008 | 1 topic + gov + ml + web（LLM 閘道，安全屬性偏弱） |
| 3 | PrismorSec/prismor、uber/ADR、promptfoo/promptfoo、Giskard-AI/giskard-oss、humanbound/humanbound、ASCIT31/Dark-Moon、Repello-AI/whistleblower、ethz-spylab/agentdojo | E／E／F／F／F／F／F／I | — | — |

這些多來源工具的共通點：樣本裡的 F 層四個都是紅隊工具，卻漏掉了紅隊層最高頻的 garak／promptfoo／AI-Infra-Guard。若選案以「被多個清單同時提及」為代表性依據，這些應優先納入候選。

### C.4 這個母群自己的偏誤（要先講清楚，避免把盤點當成全貌）

1. **topic 取 stars 前 20 的截斷**：llm-security（4,698 筆）、prompt-injection（5,641）、guardrails（3,948）、owasp（3,894）四個 topic 的前 20 名被傳統資安或越獄資料集占滿，真正相關的長尾沒進來；agent-security（1,962）、mcp-security（563）也只取到頭 20 名。相對地 skill-scanner（29）與 mcp-scanner（13）幾乎取全，所以 B 層「小專案很多」部分是這兩個 topic 範圍小造成的，不代表 B 層比 C 層更分散。
2. **awesome 清單本身有偏向**：systempromptio/awesome-ai-agent-governance 的條目很多是 2026 年新建、0–40 stars 的個人專案（作者自薦型），包含不少名稱與描述雷同的「governance gate／receipt／hash-chain audit」repo（是否為作者自薦未查證）；這類在 C 層占比高（53 筆）。
3. **語言偏英文**：中文搜尋只找到文章與 TSecBench 之類的目錄頁，沒有找到可直接當候選的中文圈 repo（除了 topic 結果裡的 Tencent/AI-Infra-Guard、lennney/stop-that-shit、Fausto-404/skill-evasion-lab），日文／韓文／德文／法文完全沒搜。
4. **資料精度不一**：172 筆中 74 筆沒有授權欄位（補查工具限制），「授權」維度的覆蓋矩陣在這些 repo 上是空的，不是真的沒有授權。
5. **沒有讀任何 README**：「定位」欄是 GitHub description，自我宣稱未驗證；層的歸類是依 description 與 topic 人工判定，邊界案例（例如 Pantheon-Security/medusa 同時像掃描器與入侵偵測、tenuo 屬授權還是護欄）可能需要調整。

## D. 可疑項目（逐一標出，不下結論）

判準：以 GitHub API 資料機械篩出「stars／建立天數 ≥ 15」，再人工補看 forks 與 description。以下全是「需要進一步看」的訊號，不代表刷星。

| repo | 觀察到的數字 | 為何列出 |
|---|---|---|
| cloudflare/security-audit-skill | 37,278★ / 2,330 forks；建立 2026-06-18（126 天，約 296★/天） | 一個 skill repo 4 個月 3.7 萬星，高於 trailofbits/skills（7,704★、建立 281 天）約 5 倍。是 11 樣本之一，樣本的代表性前提需要先確認這個數字是否自然成長 |
| ifixai-ai/iFixAi | 32,059★ / 1,618 forks；建立 2026-04-27（178 天，約 180★/天）；description 為 "Independent Auditing of AI Agents. Run by human or the agent itself" | 組織帳號，非大廠；星數與 fork 比（約 20:1）與 cloudflare 那個不同，但絕對數值同樣極高 |
| usestrix/strix | 70,891★ / 7,859 forks；建立 2025-08-05（443 天） | 樣本之一；母群最高星 AI 滲透工具之一。fork 比約 9:1，相對自然，但絕對數字仍高 |
| KeygraphHQ/shannon | 49,198★ / 5,632 forks；建立 2025-09-27（390 天） | 與 strix 同為 AI pentester 類，星數級距接近 |
| NVIDIA/SkillSpector | 20,855★ / 1,829 forks；建立 2026-03-21（215 天，約 97★/天） | 樣本之一；大廠帳號，但 skill 掃描器 7 個月 2 萬星 |
| daytonaio/daytona | 71,509★；API 回傳 `archived: true` 但 updated_at 為 2026-10-22 | archived 與活躍更新同時出現，矛盾；可能是 minimal 輸出欄位或當日資料延遲，需重查。也是母群第一高星 |
| aliasrobotics/cai | 9,843★；`archived: true`，default_branch 為 `archive`；updated 2026-10-22 | 網頁搜尋（中文文章）仍稱其「活躍 9.4k 星」；實際可能已把主線搬到別處，需重查 |
| Azure/PyRIT | 121★；建立 2026-03-25、archived | 與 microsoft/PyRIT（建立 2023-12-12，4,668★）並存；網頁搜尋的 Mend 文說 Azure repo "archived and moved"。另有 tutorsbot.com 文章宣稱 PyRIT 於 2026-09-10 才「首次開源」，與 repo 建立日 2023-12-12 矛盾，疑為不可靠聚合內容，不能當時間證據 |
| nolabs-ai/nono | 4,609★ / 317 forks / 270 open issues；建立 2026-01-31 | 5 個 topic 命中，不在任何 awesome；星數級距在新專案中偏高 |
| deeplethe/forkd | 2,900★；建立 2026-05-11（164 天） | microVM 沙箱，新專案高星 |
| lennney/stop-that-shit | 2,950★ / 60 forks；建立 2026-08-11（72 天，約 41★/天）；forks 僅 2% | 個人帳號、中文 description、repo 大小僅 957 KB；star 與 fork 比偏離常態 |
| graygnatconsole/mcp-audit-tool | 585★ / 5 forks / 1 open issue；建立 2026-09-26（26 天，約 22★/天）；forks 僅 0.9% | 個人帳號、4 個來源命中（3 個 topic + web）；與 PRIA4D/mcp-audit-tool（0★，同名不同帳號）、網頁上另一個 Apache-2.0 的 "mcp-audit"（appsecsanta 評測）可能混淆，需確認是哪個 |
| archestra-ai/OpenAPPA | 1,598★；建立 2026-08-18（65 天） | 新專案高星 |
| Asymptote-Labs/agent-beacon | 2,498★；description 以 "Join our…" 結尾，描述的是記憶層，不是安全工具 | 出現在 topic 結果但與安全關聯弱，疑似為求曝光掛上 topic，未收進清單 |
| Berserk-hub150/skillhawk | 66★ / 44 forks；建立 2026-08-16 | forks 為 stars 的 67%，遠高於本表其他 repo 的比例（本輪未做統計） |
| agentguard-ai/tealtiger | 37★ / 47 forks | forks 多於 stars |
| HuTa0kj/vetix | 50★ / 0 forks | 對照組：星高於 fork 的極端 |
| 描述誇大／自我宣稱 | microsoft/agent-governance-toolkit："Covers 10/10 OWASP Agentic Top 10"；sattyamjjain/agent-audit-kit："414 rules, 14 compliance frameworks, OWASP Agentic 10/10 + MCP 10/10"；promptfoo："Used by OpenAI and Anthropic"；sunglasses："1,583 patterns across 117 categories"；Keyvanhardani/mythos-research："Outside-in replication of Anthropic's Mythos Preview / Project Glasswing" | 皆為 repo 自述，未驗證 |
| 「被併購／併入」類宣稱 | 多篇網頁搜尋結果稱 promptfoo「已被 OpenAI 收購（2026-03）、repo 稱 Promptfoo is now part of OpenAI」；Invariant Labs 的 mcp-scan 被 Snyk 收購後改名 snyk/agent-scan（2025-06-24，來自中文文章）；「Cisco 在 RSA 2026 公布 MCP 安全工具」「DefenseClaw 是 Cisco 的開源掃描框架」 | 全部來自二手文章片段，我沒有讀 primary source；snyk/agent-scan 的 created_at 為 2025-04-07，早於被稱的收購日，與「前身 mcp-scan」說法並不矛盾，但沒有檢查 repo 歷史 |
| 疑似行銷／廠商比較文 | getmaxim.ai、akto.io、kosmoy.com、neuraltrust.ai、mindgard.ai、confident-ai.com、repello.ai、e2b.dev、containarium.dev 的「best X」文章 | 作者為所比較的產品之一的廠商，榜單排序本身就是行銷。這些文章只用來發現候選名單，沒有採用其排名或結論 |
| 其他 | ProjectZeroDays/AI-Driven-Zero-Click-Exploit-Deployment-Framework（141★，topic 命中）；beelzebub-labs/beelzebub（欺敵框架） | 描述字眼聳動，與 agent 資安的關聯弱，未收進清單 |

## E. 掃描紀錄

### E.1 各來源實際取得量

| 來源 | 結果 | 取得量 |
|---|---|---|
| 1. systempromptio/awesome-ai-agent-governance（已存檔 JSON） | 成功。用 `python3 -I` 讀 `data.content`，68,447 字元 | 123 個 GitHub 連結（去重後 118 個 repo；同一 repo 在不同小節重複出現，如 PurpleLlama、ThumbGate、helio、kepil、provenrail） |
| 2a. RiccardoBiosas/awesome-MLSecOps | Groundlane web_fetch 成功（raw.githubusercontent.com/…/master/README.md，extract full，49,602 bytes，未截斷） | 116 個去重 GitHub repo（多為傳統對抗式 ML、隱私與攻擊論文程式碼，與 agent／MCP 直接相關的占少數；未逐筆計數） |
| 2b. wearetyomsmnv/Awesome-LLMSecOps | Groundlane web_fetch 成功（…/main/README.md，70,472 bytes，未截斷） | 93 個去重 GitHub repo |
| 3. GitHub topic ×13（search_repositories，sort=stars，perPage=20） | 13 次全部成功。命中總數：agent-security 1,962／mcp-security 563／ai-red-teaming 170／llm-security 4,698／prompt-injection 5,641／guardrails 3,948／agent-sandbox 160／skill-scanner 29／mcp-scanner 13／ai-agent-security 270／llm-guardrails 295／agentic-security 82／owasp 3,894 | 取到 253 個 topic 命中（210 個去重 repo），其中 99 個依母群定義收進清單，其餘多為傳統資安、越獄資料集或無關專案。只取前 20 名，topic 總量見左，長尾被截斷 |
| 補查 repo 欄位 | 以 `repo:` 查詢約 20 次（每次最多 8 個 repo），minimal 輸出 | 清單中有 70 筆靠此取得 stars／created_at／updated_at／archived；**沒有 pushed_at 與 license**。另有 3 筆（MAESTRO、Orca-AI-Incident-Archive、pint-benchmark）完全未取得 metadata，部分請求的 repo 也沒有回傳（見 E.2）；其中 51 筆是只出現在 awesome 清單、沒有命中任何 topic 的候選 |
| 4. 網頁搜尋聚合（Groundlane web_search） | 7 條指定查詢 + 3 條補充查詢（OWASP、CSA、Gartner/Forrester）全部有結果；沒有做 time range 限制的是中文兩條 | 約 100 筆搜尋結果（每條 10 筆，補充三條 4–6 筆）；**只讀搜尋片段，沒有點進任何文章全文** |
| 5. 業界報告 | OWASP Top 10 for Agentic Applications 官方頁、CSA MAESTRO 與 CSAI 頁面可見；Gartner Market Guide for Guardian Agents（2026-02-25）、AI TRiSM Market Guide 只見目錄頁與廠商轉述 | 無 Forrester 結果；Gartner 全文為付費牆，沒有廠商清單 |

### E.2 讀不到或不完整的項目與原因

| 項目 | 試過的工具 | 結果與原因 |
|---|---|---|
| GitHub 完整欄位（pushed_at、license）對補查 repo | `mcp__github__search_repositories`（minimal_output=true，以避免每次回傳 5 千字元以上的輸出污染上下文） | minimal 輸出不含 pushed_at 與 license。**沒有改用 minimal_output=false 逐批補查**，這是我的取捨，不是工具失敗；因此 74 筆授權為「未取得」 |
| `gh` CLI | `gh api repos/NVIDIA/SkillSpector` | HTTP 403：session 未啟用該 repo 的 GitHub 存取（add_repo 流程），沒有為此去 add_repo（任務是盤點 70+ repo，不適合逐一附加） |
| `mcp__github__get_file_contents` | 未嘗試 | 任務指示說此 session 已限制，故沒試 |
| OWASP Agentic Top 10 的 GitHub repo | `search_repositories`（"OWASP agentic top 10"）、web_search | 官方在 genai.owasp.org 頁面；GitHub 搜尋只找到 OWASP/www-project-agentic-skills-top-10（另一份）。官方 Agentic Top 10 的 repo 未取得 |
| 以下被請求但 API 沒回傳的 repo | search_repositories（`repo:` 查詢） | CloudSecurityAlliance/MAESTRO、IBM/adversarial-robustness-toolbox、Mindgard/cli、Giskard-AI/giskard（改名為 giskard-oss 才查到）、leondz/garak（搬到 NVIDIA/garak）、laiyer-ai/llm-guard（搬到 protectai/llm-guard）、invariantlabs-ai/mcp-scan（併入 snyk/agent-scan）、lakeraai/pint-benchmark、Continuum-AI-Corp/Orca-AI-Incident-Archive、anthropic-experimental/sandbox-runtime、OWASP 官方 Agentic Top 10 repo。可能是改名、搬遷、private 或 search 索引缺漏，**未逐一用其他方式確認** |
| 搜尋工具警告 | Groundlane web_search | 多次回報 brave／tavily／exa 之一 unavailable，僅 you 或 keenable 提供結果；單一搜尋供應商的偏誤無法排除 |
| 未用到的 fallback 鏈 | cloudflare get_url_markdown、linkup-fetch、jina read_url、Exa、WebFetch | **沒有試**：Groundlane web_fetch 與 web_search 在所有需要抓頁面的步驟都成功，沒有進入降級流程（因此沒有 toolDegradation 紀錄）。我沒有拿任何文章全文，所以沒有「讀不到某頁」的宣稱 |

### E.3 建議的後續步驟（不在本次範圍）

1. 對清單前 40 名（以總來源數與 stars 排序）用 `minimal_output=false` 補 pushed_at 與 license，並對 9 個 NOASSERTION 逐一讀 LICENSE，判斷是否為 FSL／BUSL 等 source-available。
2. 重查 D 節的 3 個矛盾點：daytonaio/daytona 的 archived、aliasrobotics/cai 的 archive 分支、cloudflare/security-audit-skill 的星數成長曲線（可用 star history，但需要 GitHub 之外的資料來源）。
3. 補抓 anthropic-experimental/sandbox-runtime、OpenAI Codex 沙箱、CSA MAESTRO、OWASP Agentic Top 10 的 repo，這些是 D／H 層的官方來源。
4. 若要宣稱「母群」，需要補一輪非英語搜尋（日、韓、德、法）與 topic 長尾分頁（page 2 以後）。
