---
title: "AI Agent GitHub Digest — 2026-09-14"
date: 2026-09-14
category: daily
tags: [ai-agent, github, open-source, daily, developer-tools, model-inference, agent-skills]
lang: zh-TW
description: "colibri 用純 C 把 2.8T 參數 MoE 模型塞進一般顯卡、alibaba 開源自家 code review agent、OpenMontage 把整套影片製作流程包進 agent skill——今天 GitHub trending 在往『每個垂直領域都要有自己的 agent』的方向走"
tldr: "JustVugg/colibri 用記憶體多層調度把 744B–2.8T 參數的 MoE 模型塞進消費級硬體跑；tech-leads-club/agent-skills 想在 agent skill 變成下一個 npm 供應鏈風險之前先做好驗證；alphaXiv/OpenResearch 把 Claude Code / Codex 變成能跑實驗的研究員；calesthio/OpenMontage 用 agent 包辦從腳本到成片的整條影片產線；alibaba/open-code-review 用「規則引擎 + LLM agent」混合架構開源自家 code review 工具；Claude Code v2.1.269 把 Workflow tool 的並行 agent 上限拉到 256"
series:
  name: "AI Agent GitHub Digest"
  order: 30
---

## 今日亮點

今天的 trending 呈現兩條並行的路線：一邊是 agent 開始把觸手伸進更專門的垂直領域——OpenMontage 把整套影片後期製作流程包進 agent skill，alibaba 把 code review 拆成「規則引擎 + LLM agent」的混合架構搬上 GitHub，OpenResearch 讓你把 Claude Code、Codex 這些 coding agent 直接變成跑實驗的研究員；另一邊則是讓這些 agent 更便宜、更安全地跑起來的基礎工程——colibri 用純 C 把 2.8T 參數的 MoE 模型塞進一般人的顯卡，tech-leads-club 則想先把「agent skill」這個新型態套件的供應鏈治理好。

## Trending Repos

### JustVugg/colibri ⭐ 29,375 (+960)

[GitHub](https://github.com/JustVugg/colibri)　·　C　·　Apache-2.0

- **是什麼**：用純 C、零依賴寫成的推理引擎，把 744B 到 2.8T 參數的前沿 MoE 模型（GLM-5.3、Kimi K3、DeepSeek V4 等）塞進一般人買得起的消費級硬體上跑。
- **為什麼值得看**：核心想法是把 VRAM、RAM、硬碟當成同一層記憶體階層，專家（expert）用到才從硬碟串流進來，不必讓整顆模型常駐顯卡。作者講得很白：「沒有速度 SLA，但語意有硬保證」——記憶體不夠只會變慢，不會偷偷降精度或改路由邏輯，這點對想拿它當研究平台的人比效能數字更重要。
- **tech stack**：純 C + 記憶體多層調度（storage / RAM / VRAM tiering）+ 自家 `coli` CLI / web dashboard
- **上手難度**：低——裝好後 `./coli chat` 一行就能跑，但要在 744B 模型上吃到合理速度還是得有像樣的多卡機器。

---

### tech-leads-club/agent-skills ⭐ 5,538 (+215)

[GitHub](https://github.com/tech-leads-club/agent-skills)　·　TypeScript　·　自訂授權

- **是什麼**：給 Antigravity、Claude Code、Cursor、Copilot 這些 AI coding agent 用的「skill 註冊表」，主打每個 skill 上架前都經過驗證。
- **為什麼值得看**：Agent skill 現在的安裝方式基本上是「複製一份 SKILL.md 貼進資料夾」，等於重演早期 npm 套件生態沒有簽章、沒有審核的階段。這個專案想做的是在 skill 變成 agent 界的 npm 之前，先把供應鏈驗證機制立起來，而不是等出事後再補。
- **tech stack**：TypeScript + npm 套件發布 + skill 驗證 pipeline
- **上手難度**：低——npm 安裝即可，skill 本身照 SKILL.md 慣例撰寫。

---

### alphaXiv/OpenResearch ⭐ 1,939 (+304)

[GitHub](https://github.com/alphaXiv/OpenResearch)　·　Rust　·　MIT

- **是什麼**：本地優先的「研究 agent 工作台」，把 Claude Code、Codex、OpenCode、Cursor 變成能讀文獻、提假說、跑實驗、寫產出的研究員。
- **為什麼值得看**：重點不是又一個 agent 框架，而是它把「實驗可重現」這件事用 git-native 的方式刻進工作流——每個研究方向各自一個獨立 git worktree、每次跑都對應一個不可變的 commit 快照。內建的 autoresearch 模式能讓 agent 自己跑完整迴圈：提想法、改程式碼、跑實驗、看結果、決定下一步，多個方向還能平行探索，靠 experiment tree 保留彼此的血緣關係。
- **tech stack**：Rust + git worktree / experiment tree + 可接 Slurm / K8s / Ray / Modal 等遠端運算
- **上手難度**：中——本機用 `orx up` 就能跑，但要接遠端 GPU 或自架 compute 得自己弄好 SSH / 排程環境。

---

### calesthio/OpenMontage ⭐ 58,268 (+383)

[GitHub](https://github.com/calesthio/OpenMontage)　·　Python　·　AGPL-3.0

- **是什麼**：號稱第一個開源的「全自動影片製作 agent 系統」，把 12 套產製流程、100+ 工具、700+ agent skill 檔案包進一套讓 coding agent 變身影片工作室的框架。
- **為什麼值得看**：跟「把幾張靜態圖片動畫化充數」的 AI 影片工具不同，它強調能從免費素材庫和開放資料庫組出真的動態片段，剪成時間軸再算圖輸出——腳本、分鏡、素材生成到最終合成整條產線都讓 agent 接手，人只需要用自然語言描述想要什麼。
- **tech stack**：Python + FFmpeg + Remotion + Stable Diffusion / Flux（圖像）+ ElevenLabs（語音）
- **上手難度**：中——需要準備好各家生成式 API 金鑰（影像、語音、影片模型），操作本身走 agent 對話式介面，不用寫程式。

---

### alibaba/open-code-review ⭐ 23,168 (+438)

[GitHub](https://github.com/alibaba/open-code-review)　·　Go　·　Apache-2.0

- **是什麼**：阿里巴巴內部大規模跑過的 code review 工具開源版，用「決定性規則引擎 + LLM agent」的混合架構抓 NPE、執行緒安全、XSS、SQL injection 等問題，直接在程式碼行級別留言。
- **為什麼值得看**：純 LLM agent 做 code review 常見的問題是不穩定、容易漏抓規則就能判斷的低級錯誤；這個專案把「規則能判的先用規則判」和「需要上下文理解的才交給 agent」分工，兼顧速度與涵蓋率，也同時相容 OpenAI 和 Anthropic 的模型後端，不綁死單一供應商。
- **tech stack**：Go + 多語言規則引擎 + LLM Agent（OpenAI / Anthropic 相容）
- **上手難度**：中——支援 Windows / macOS / Linux，也能跟 Claude Code / Codex 整合，但要吃到「Alibaba 規模」的效果需要先設好規則集跟 CI 整合。

## Notable Releases

### Claude Code v2.1.269

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.269)

- **重要變更**：新增 `claude plugin eval`，可以直接跑 plugin 的 eval suite，拿到可重現的分數報告（JSON + HTML）；新增 `/output-style [name]` 切換輸出風格，連 Remote Control 和雲端 / headless session 都能用；Bash 工具改檔案時會把 diff 附進工具結果（設定 `bashEditDiffEnabled`）；新增 `CLAUDE_CODE_WORKFLOW_MAX_CONCURRENT_AGENTS`，讓 Workflow tool 的同時併發 agent 數上限可以拉到 1–256，方便推論密集的 fan-out 任務。
- **Breaking Changes**：無。
- **對你的影響**：如果你在用 Claude Code 的 Workflow tool 做多 agent 並行任務，原本的併發上限可能是瓶頸，升級後可以透過環境變數直接拉高；在寫、發布 plugin 的話，`claude plugin eval` 讓你在推出前先拿到量化分數，不用只靠手動測試。

## 今日收穫

原本以為「agent skill」只是 Claude Code、Cursor 之間比較誰的套件市集大，但 tech-leads-club 這個「先驗證再上架」的動作提醒我，skill 這個新的分發單位正在重演 npm 供應鏈信任問題的早期階段——而且這次貼的是可以直接控制 agent 行為的內容，一旦被惡意 skill 打穿，代價比裝到一個有問題的 npm 套件要高得多。

## 參考資料

- [JustVugg/colibri — GitHub](https://github.com/JustVugg/colibri)
- [tech-leads-club/agent-skills — GitHub](https://github.com/tech-leads-club/agent-skills)
- [alphaXiv/OpenResearch — GitHub](https://github.com/alphaXiv/OpenResearch)
- [calesthio/OpenMontage — GitHub](https://github.com/calesthio/OpenMontage)
- [alibaba/open-code-review — GitHub](https://github.com/alibaba/open-code-review)
- [GitHub Trending（daily，2026-09-14 擷取）](https://github.com/trending?since=daily)
- [Claude Code v2.1.269 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.269)
