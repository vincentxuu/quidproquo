# 證據紀錄：動作前把關靠不靠得住（series order 3）

來源：post-verify 報告（session scratchpad `review-verify-b2.md`，2026-10-24），原始文件抓檔在同一 scratchpad 的 `src/`。研究筆記：`.work/research/ai-agent-security-tooling/research-note.md`、`sources/deepC-guardrails.md`、`deepE-detection.md`。

| 正文主張 | 一手來源 | 讀取程度 | 備註 |
|---|---|---|---|
| `PreToolUse` 在工具呼叫執行前觸發，可阻擋；結束碼 2 為阻擋 | https://code.claude.com/docs/en/hooks（事件表、結束碼節） | 行 13、37、780–790 | 已驗 |
| 大多數事件上 hook 失敗或逾時，動作照常執行 | 同上（「On most events, when a hook fails or times out, Claude Code still carries out the action」） | 行 900–970 整節 | 已驗；PreToolUse 逾時是回到一般權限流程，稿中已照寫；Windows 無 Git Bash 時 shell-form hook 失敗反而會擋，稿中未寫 |
| `"onFailure": "block"` 適用 command／http hook，需 2.1.295；對 Stop 等事件無效 | 同上 | 行 447、499、904 | 已驗 |
| 腳本以 0 或 2 以外的結束碼離開、無法啟動、逾時都算失敗 | 同上（失敗清單，行 942–951） | 同上 | 已驗；官方另列 HTTP error 與輸出無法解析，稿中省略 |
| 官方測試法：刪腳本、請 Claude 跑 `ls` | 同上（行 932、939） | 同上 | 已驗 |
| `/hooks` 是唯讀清單，標示每個 hook 來自哪一層 | 同上（「The /hooks menu」） | 審稿後新增，我核對 scratchpad 抓檔 | 已核對 |
| managed hooks 不能被使用者／專案／本機的 `disableAllHooks` 關掉；`allowManagedHooksOnly` | 同上；settings-reference | 審稿後新增，我核對抓檔 | 已核對 |
| 最小 `block-rm.sh` hook 範例與 `${CLAUDE_PROJECT_DIR}` | https://code.claude.com/docs/en/hooks-guide（官方範例） | 審稿後新增，我核對抓檔 | 已核對範例的來源；`"args": []` 欄位、`onFailure` 與 args 並用的寫法未逐字比對 |
| Claude Code 寫入 `.claude/` 預設會先問、`bypassPermissions` 模式下不問；被騙的 agent 可能改掉自己的檢查腳本 | 官方 permissions 文件 | 審稿後新增，未核對 | 未驗證 |
| 用 `Edit(...)` 拒絕規則把 hook 目錄列為不可編輯；沙箱 `denyWrite` 擋 Bash 改檔 | 官方 permissions／sandboxing 文件 | `denyWrite` 鍵存在（抓檔有）；兩種做法的實際效果未驗 | 未驗證（作法建議） |
| AGT 外掛有三個 command hook（SessionStart、UserPromptSubmit、PreToolUse），timeout 30，腳本 catch 區塊 `process.exit(2)`；hooks.json 沒有 `onFailure` | https://github.com/microsoft/agent-governance-toolkit，`agent-governance-claude-code/hooks/*`（HEAD 9c85646，2026-10-22） | 讀本機 clone | 已驗 |
| AGT：Public Preview，GA 前可能有破壞性變更；支援限 GitHub Issues／Discussions | README、SUPPORT.md | 全文 | 已驗；「沒有 SLA」已從稿中刪除 |
| AGT repo 描述「Covers 10/10 OWASP Agentic Top 10」；自己的對照文件 7 Full、3 Partial、內部自評非認證 | GitHub 頁面；docs/compliance/owasp-agentic-top10-architecture.md | 全文 | 已驗 |
| AGT 預設：沒載入政策時放行 | AGT README／文件 | 驗證者讀；稿中此句驗證者未單列一行 | 部分已驗（研究筆記有，未在 25 列中單獨核對）；建議主人確認 |
| AGT 政策引擎與 agent 同程序；正式環境建議每個 agent 一個容器 | README Security 段（原文 "The policy engine and agents share the same process boundary. Production recommendation: Run each agent in a separate container"） | 研究筆記 layer3.md 引原文 | 已核對引文，非驗證者 25 列內 |
| AGT MCP 閘道偵測是啟發式（45 個 regex、SHA-256 指紋、編輯距離），無 LLM；語意意圖分類器是無 ML 的關鍵字加權啟發式 | `agent_os/mcp_security.py`、`semantic_policy.py` | 讀原始碼 | 已驗 |
| cc-safety-net：設定檔壞掉退回保護性預設、標 degraded；在 Claude Code 上 hook 當掉或逾時放行（fail-open）；README 明說不是沙箱 | https://github.com/kenryu42/cc-safety-net README；官方 policy 頁、known-limitations 頁 | 兩頁全文、README | 已驗；repo 可能改名 claude-code-safety-net，兩者內容相同 |
| pipelock：偵測是規則（regex、熵、env scan、BIP-39）；注入偵測是語法層級；代理本身不是沙箱；基準是 first-party | https://github.com/pipelab-org/pipelock，docs/bypass-resistance.md（行 177、186）、README | 讀 | 已驗 |
| pipelock 有選用 `pipelock sandbox`、`contain` | README | 讀 | 已驗；強度未評估 |
| pipelock「沒有分類模型」 | README、comparison 皆未提 ML | 讀 | 單一來源推論（文件沒提）；稿中已寫成「文件描述…沒有提到」 |
| pipelock 規則在代理自己的設定裡、agent 不經手 | 設計描述 | 未單獨核對 | 未驗證（作法描述） |
| NeMo：偵測器連不上時放行；只針對英文；啟發式 31.19%／7.44%（Length per Perplexity）、49/50 GCG／0.04%（Prefix and Suffix Perplexity）；另有 random-forest 模型偵測器 | https://docs.nvidia.com/nemo/guardrails/configure-guardrails/guardrail-catalog/jailbreak-protection | 頁面全文 | 已驗；資料集是 NVIDIA 自己整理，稿中已註明 |
| NeMo 是給你自己寫的對話應用的函式庫 | https://github.com/NVIDIA-NeMo/Guardrails README | 讀 | 已驗 |
| NeMo 規則在應用程式設定裡 | 設計描述 | 未單獨核對 | 未驗證 |
| Docker MCP Gateway：prompt injection、工具描述投毒、被啟用的惡意 server 濫用授權是「Out-of-scope report examples」（prompt injection 有「除非繞過閘道邊界」但書）；對外網路預設不全域封鎖 | https://github.com/docker/mcp-gateway，docs/security.md | 全文 | 已驗 |
| IBM ContextForge 是註冊中心兼代理 | https://github.com/IBM/mcp-context-forge README | 讀 | 已驗 |
| hol-guard 透過原生 agent hooks 與受管 MCP proxy 連接，含 Claude Code | https://github.com/hashgraph-online/hol-guard README | 讀 | 已驗 |
| llm-guard：2026-07-09 封存；README 寫不再積極開發或維護；PyPI 最後 0.3.16（2025-05-19），無棄用標記 | https://github.com/protectai/llm-guard；pypi.org JSON | 讀 | 已驗 |
| llm-guard 封存沒有官方原因、無繼任者／遷移指引 | README、PR 文字 | 單來源（PR #355 body 為 null，未獨立複查） | 負面主張，單來源 |
| rebuff：2025-05-16 封存；README 沒有封存通知；自稱仍是原型、不能提供 100% 保護 | https://github.com/protectai/rebuff（API `archived: true`）、README 行 40 | 讀 | 已驗 |
| Guardrails AI：沒封存；硬性截止 2026-08-25，Hub 安裝、私有 registry、託管推論停止；驗證器改 PyPI；理由為 pip 安裝不順與免費託管成本高 | https://github.com/guardrails-ai/guardrails/issues/1560 | issue 全文 | 已驗公告內容。**未驗證：截止日是否已實際執行**；issue 內另一處寫託管推論「August 6, 2026」，與 8/25 自相矛盾 |
| 「偵測型護欄停止更新後，對新攻擊只會越來越不準」 | 無 | 無 | 作者判斷，已在稿中標「我的看法」，沒有來源 |
