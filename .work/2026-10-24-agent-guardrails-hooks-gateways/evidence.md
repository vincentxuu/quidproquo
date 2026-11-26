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

## 後續查證（審稿後新增句，2026-10-24，已修）

| 正文主張 | 結果 | 來源 |
|---|---|---|
| Guardrails AI 截止日 | 已修：issue #1560（2026-07-06，zsimjee）寫 8/25 為 hard cutoff，停 `guardrails hub install` 與私有 registry；代管推論伺服器，官方文件寫 8/6 停止，issue 內文自己有一處寫 8/25 一處寫 8/6。稿中改為兩個日期分述並註明照官方文件。日期已過；**實際停掉與否我連不到 pypi.guardrailsai.com／hub.api（環境擋），僅有第三方（beri.net、tooldirectory.ai）稱 8/25 起 hub install 失效**，稿中只寫「日期現在都過了」，沒寫已驗證失效。另補 9/9 Harvey 宣布收購（Harvey 官方公告，公告未提開源框架維護） | https://github.com/guardrails-ai/guardrails/issues/1560 、 https://www.guardrailsai.com/docs/concepts/remote_validation_inference 、 https://www.harvey.ai/blog/guardrails-ai-joins-harvey 、 https://github.com/guardrails-ai/guardrails/releases/tag/v0.11.0 |
| `.claude/` 寫入在各權限模式的行為 | 已修：default／acceptEdits 詢問、auto 交分類器、dontAsk 拒絕、bypassPermissions 放行；plan 模式較複雜，稿中略 | https://code.claude.com/docs/en/permission-modes#protected-paths |
| `Edit(...)` deny 保護 hook 目錄 | 已驗：deny 規則每個模式都生效（含 bypassPermissions）；但只涵蓋 Claude Code 認得的檔案指令（sed、tee、重新導向），擋不了腳本自己開檔，已補進稿 | https://code.claude.com/docs/en/permission-modes 、 https://code.claude.com/docs/en/permissions |
| 沙箱 denyWrite 擋 Bash 改檔 | 已修：沙箱預設就禁止 Bash 寫 `.claude` 設定檔與 `.claude/hooks`（protected paths），denyWrite 用於補其他路徑 | https://code.claude.com/docs/en/sandboxing#protected-paths |
| `"args": []` 欄位 | 已驗：官方 hooks 範例 block-rm.sh 即如此寫；`onFailure: block` 可與 args 並用 | https://code.claude.com/docs/en/hooks |
| managed hooks／`allowManagedHooksOnly` | 已驗：該設定下使用者、專案、本機、外掛 hook 不跑（管理員強制啟用的外掛除外）；`disableAllHooks` 關不掉 managed hooks | https://code.claude.com/docs/en/hooks 、 https://code.claude.com/docs/en/settings-reference#allowmanagedhooksonly |
| pipelock 規則位置 | 已修：`pipelock.yaml`，檔案監看或 SIGHUP 重載；README 的「能力分離」是強制部署下才成立的條件 | https://github.com/pipelab-org/pipelock README |
| NeMo 規則位置 | 已修：`RailsConfig.from_path` 載入的設定資料夾（config.yml、Colang） | https://github.com/NVIDIA-NeMo/Guardrails README |
| Docker MCP Gateway 誰能改規則 | 已補：官方 security.md 把本機 Docker MCP 設定檔列為可信，能改它們的人在防護範圍外；catalog 必須在 `~/.docker/mcp/catalogs/` | https://github.com/docker/mcp-gateway/blob/main/docs/security.md |
| cc-safety-net 誰能改規則 | 已補：`~/.cc-safety-net/policy.json`＋專案 `.cc-safety-net/policy.json`；官方寫 agent 不能改任一層；專案可放寬但會被報告；`CC_SAFETY_NET_PROJECT_TIGHTEN_ONLY=1` | https://ccsafetynet.com/docs/configuration/policy |
| hol-guard 誰能改規則 | 已補（僅官方文件描述的完整性驗證）：本機決定以完整性金鑰驗證，`policies verify` 偵測竄改 | https://github.com/hashgraph-online/hol-guard/blob/main/docs/guard/local-vs-cloud.md |
| AGT 政策檔位置 | 已修：外掛依序 `AGT_CLAUDE_POLICY_PATH`、`~/.claude/agt/policy.json`、隨附 default-policy.json | microsoft/agent-governance-toolkit `agent-governance-claude-code/README.md`（HEAD 9c85646） |
| AGT「沒載入政策預設放行」 | 已修（範圍更正）：出處 docs/LIMITATIONS.md，指政策評估器（函式庫）沒載入任何政策；Claude Code 外掛則退回隨附預設，`defaultEffect: review`。稿中 tldr、規則強度段、怎麼用第 6 點都改成區分外掛與函式庫 | https://github.com/microsoft/agent-governance-toolkit/blob/main/docs/LIMITATIONS.md |
