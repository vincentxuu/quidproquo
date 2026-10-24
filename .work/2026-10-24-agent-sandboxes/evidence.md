# 證據紀錄：沙箱怎麼選（series order 2）

來源：post-verify 報告（session scratchpad `review-verify-b2.md`，2026-10-24），原始文件抓檔在同一 scratchpad 的 `src/`。研究筆記：`.work/research/ai-agent-security-tooling/research-note.md`、`sources/deepD-sandbox.md`。讀取程度欄指驗證者實際讀了什麼。

| 正文主張 | 一手來源 | 讀取程度 | 備註 |
|---|---|---|---|
| Claude Code 沙箱預設關閉；只包 shell 指令與子程序；Read／Edit／WebFetch、本機 MCP server、command hooks 在沙箱外 | https://code.claude.com/docs/en/sandboxing（「off by default」「What runs outside the sandbox」） | 全文（103 KB） | 已驗 |
| Claude Code：macOS Seatbelt、Linux bubblewrap；網路經本機 proxy，允許網域一開始是空的 | 同上 | 全文 | 已驗 |
| Claude Code 讀取幾乎整台機器含 `~/.ssh`、`~/.aws/credentials`；無內建憑證拒絕清單 | 同上 | 全文 | 已驗 |
| `sandbox.credentials` 只管沙箱內 Bash；專案／本機設定檔的 credentials 條目不生效；Read 工具要另設 deny | 同上、https://code.claude.com/docs/en/settings-reference | 全文與相關鍵 | 已驗（v2.1.246 起的行為以 2026-10-24 讀到為準） |
| `allowUnsandboxedCommands: false` 為官方的 Strict sandbox mode；預設 true 時失敗指令可用 `dangerouslyDisableSandbox` 重試 | settings-reference、sandboxing | 全文 | 已驗 |
| 沙箱起不來時預設不用沙箱照常執行；`failIfUnavailable: true` 改為拒絕 | sandboxing（WARNING）、settings-reference | 全文 | 已驗 |
| `excludedCommands` 用完整權限執行 | sandboxing | 全文 | 已驗 |
| 官方驗證法 `touch ~/sandbox-probe` | sandboxing（驗證表格） | 審稿後新增，我對 scratchpad 內抓檔核對 | 已核對；不在驗證者原 36 列內 |
| 自動允許模式下沙箱內 Bash 不逐條詢問 | sandboxing「Auto-allow mode」 | 審稿後新增，我核對該節存在 | 部分核對（細節語句未逐字比對） |
| 「Sandboxing reduces risk but is not a complete isolation boundary」；允許 github.com 等廣泛網域是外洩路徑 | sandboxing（Limitations） | 全文 | 已驗 |
| `srt claude`、`npm install -g @anthropic-ai/sandbox-runtime`、`~/.srt-settings.json` | https://code.claude.com/docs/en/sandbox-environments（Sandbox runtime 一節）；https://github.com/anthropics/sandbox-runtime README | 全文 | 已驗用法在 Claude Code 文件而非 README；「預設拒絕所有網路」括號說明未逐字核對 |
| 同核 OS 隔離涵蓋 sandbox-runtime、Codex CLI、nono | Claude sandboxing；Codex agent-approvals-security（Seatbelt、bwrap plus seccomp）；https://nono.sh/docs/cli/internals/security-model | 全文 | 已驗 |
| Codex：`workspace-write` 為本機預設；網路預設關；Linux 預設 bwrap＋seccomp；`.git`、`.agents`、`.codex`、`.aws` 唯讀 | https://developers.openai.com/codex/sandboxing 與 /agent-approvals-security（轉址 learn.chatgpt.com） | 全文 | 已驗 |
| Codex 網路 proxy 只過濾沙箱內指令流量；`network_proxy` 預設關 | agent-approvals-security | 全文 | 已驗 |
| `--yolo` 同時關核准與沙箱；`--sandbox danger-full-access` 只關沙箱 | agent-approvals-security | 全文 | 已驗 |
| Codex 預設讀取範圍 | 官方頁未說明 | 無第一手來源 | 未驗證；文章已寫「文件沒有列出預設讀取範圍」。第三方文章稱 `--ro-bind / /`，未實測，未採用 |
| kubernetes-sigs/agent-sandbox 把隔離交給 gVisor／Kata | https://github.com/kubernetes-sigs/agent-sandbox README | 全文 | 已驗 |
| smolvm：獨立 guest kernel，需 KVM 等硬體虛擬化 | https://github.com/smol-machines/smolvm README 與 docs/security-model.md | README、security-model 全文 | 已驗 |
| E2B：每個沙箱是 Firecracker microVM，與其他沙箱和主機隔離，用來跑 LLM 產生或使用者提供的程式碼 | https://docs.e2b.dev/faq/security-and-compliance | FAQ 全文 | 已驗；e2b-dev/E2B README 本身沒寫 Firecracker，出處在 docs 與 runtime repo |
| Daytona：2026-06 起公開 repo 凍結，最後版本 v0.190.0（2026-06-23），官方宣布轉閉源 | https://www.daytona.io/dotfiles/updates/daytona-is-going-closed-source；https://github.com/daytonaio/daytona README 與 releases | 公告全文、README、releases | 已驗；公告頁本身無日期，日期出處是 README 與 releases |
| CVE-2026-25725：bubblewrap 沒保護啟動時不存在的 `.claude/settings.json`，可注入 SessionStart 等 hook，重啟後以主機權限執行；2.1.2 修復 | https://nvd.nist.gov/vuln/detail/CVE-2026-25725（NVD API JSON：services.nvd.nist.gov） | NVD JSON 全文 | 已驗；detail 頁是 JS 渲染，內容讀 API 版 |
| CVE-2026-39861：沙箱內指令建符號連結，沙箱外的 Claude Code 之後寫入跟著連結出工作區；各自寫不到、合起來可以；2.1.64 修復；需 prompt injection | https://nvd.nist.gov/vuln/detail/CVE-2026-39861 | NVD JSON 全文 | 已驗 |
| CVE-2025-59532：Codex 0.39.0 以前，模型產生的 cwd 被當成 writable root | https://nvd.nist.gov/vuln/detail/CVE-2025-59532 | NVD JSON（驗證者做反證搜尋時讀） | 已驗 |
| CVE-2025-66479：sandbox-runtime 0.0.16 以前，沒設允許網域時網路沙箱沒生效 | https://nvd.nist.gov/vuln/detail/CVE-2025-66479 | NVD JSON | 已驗 |
| `allowUnixSockets` 放行 `/var/run/docker.sock` 等於交出主機 | Claude sandboxing（官方文件自列） | 全文 | 已驗（驗證者 S-14 ⑦） |
| Pillar：agent 能波及的是它寫得進去、主機之後會信任的所有東西 | https://www.pillar.security/blog/the-week-of-sandbox-escapes（2026-10-20） | 全文 | 已驗；該系列研究 Cursor、Codex、Gemini CLI、Antigravity，不含 Claude Code |
| Strix：被 prompt injection 騙去執行指令，拿到有 sudo 的 shell；作者寫沙箱「significantly lowers the impact」；未示範逃出沙箱 | https://baldur.dk/blog/strix-ai-pentester-rce/（2026-05-27） | 全文 | 已驗；「對外連線」有間接證據（reverse shell），「API 憑證」已從稿中移除 |
| nono：不是防逃逸的沙箱；目前不建議用在正式環境 | https://nono.sh/docs/cli/internals/security-model；nono SECURITY.md | 兩者全文 | 已驗 |
| clawk 預設跳過權限提示，`--safe` 才關；ssh-agent 轉發；掛載什麼等於放行什麼 | https://github.com/clawkwork/clawk README | 全文 | 已驗 |
| 「公開案例繞過的是邊界旁邊的設定檔、檢查腳本、Docker socket 和規則產生邏輯，不是 Seatbelt／bubblewrap 本身」 | 上列 CVE、Pillar、Claude 官方文件；驗證者另做反證搜尋 | 反證搜尋 | 負面主張。驗證者沒找到打穿核心的案例，但搜尋不能證明不存在；稿中已限定「就目前公開的…案例來看」並標為判斷 |
| 目前沒有獨立研究量過這些沙箱實際擋得住多少 | 無 | 無 | 未驗證（負面主張，驗證者沒有針對它搜尋）。稿中以陳述句寫出，建議主人確認要不要加「我沒有找到」 |
| 一個單一來源：CodeAnt 2026-08-18（Claude Code 2.1.214 macOS，路徑含 `**` 時 Seatbelt 規則放寬） | 單一廠商文章，無 NVD | 驗證者讀 | 未採入正文 |
| `claude --version`、`/sandbox` 指令、`Read(~/.ssh/**)` 規則語法、JSON 範例可被接受 | 官方 settings／permissions 文件 | 審稿後新增，未逐項對文件 | 未驗證 |
