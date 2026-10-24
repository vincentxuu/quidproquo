# 證據紀錄：事後怎麼看見 agent 做過什麼（series order 4）

來源：2026-10-24 獨立 post-verify 報告（session scratchpad `review-verify-b3.md`）。讀取程度欄沿用報告：全文＝整份讀過；grep＝存檔後 grep 再讀上下文。「判定」是 post-verify 時的結果，稿件已依此修過（見 `.work/reviews/2026-10-24-agent-detection-audit.md`）。

| 正文主張 | 一手來源 | 讀取程度 | 判定／備註 |
|---|---|---|---|
| ADR Sensor 每小時解析 Claude Code（`~/.claude/projects/` JSONL）、Cursor、Codex 的 session 紀錄 | 論文 https://arxiv.org/abs/2605.17380 §3.1（每小時、平均 0.182 秒）；Sensor README https://github.com/uber/ADR（表列 Claude JSONL、Cursor SQLite、Codex） | 論文 HTML grep；README 全文 | 成立。「每小時」出處是論文，README 沒寫 |
| 「在 Uber 部署」是作者自述 | 論文摘要；根 README；簡報 https://mlsys.org/media/mlsys-2026/Slides/3853_k9cXWDE.pdf | 全文 | 成立 |
| 開源版不含 Prevention 元件 | https://github.com/uber/ADR 根 README（"not included in the current open-source release"） | 全文 | 成立 |
| Detection 目錄 README 寫明不可用於正式環境 | https://github.com/uber/ADR 的 Detection/README（"Not for production use"） | 前段全文，目錄樹後段截斷 | 成立；範圍是 ADR-Bench 與偵測器評測框架 |
| Uber 另有 regex 為主的 pre-prompt hook，未開源 | 論文 §3.1（hybrid：sensor 事後鑑識＋inline hooks 即時阻擋）、§6.2 | HTML grep | 成立 |
| ADR-Bench：42 個惡意樣本抓到 28 個，召回率約 0.667，題目與偵測器為作者自建 | 論文（perfect precision 1.000、28 of 42、302 任務） | HTML grep | 成立；稿件未引用精確率 1.0 |
| 上線後人工複核警報：49% FP、34% TP、17% TPNM | 論文 §6.1 | HTML grep | 成立；作者替 FP 的辯護說法只在二手整理看到，稿件未引用 |
| prompt injection 在 Uber 環境裡出乎意料地少見 | 簡報 | 全文（約 8k 字，經 jina read_url） | 成立 |
| 簡報列主要疑慮：機密外洩（標最常見）、破壞性指令、資料外洩、人沒有真正在把關（YOLO、批准 50 次以上、批准疲勞） | 簡報 "Findings from deployment: top concerns" | 全文 | 成立；只有機密外洩被標 "Most common"，論文全文沒有 "destructive" |
| numbat 內建規則全是 monitor-only；要擋需複製 YAML、同 id、`enforce: true`、升版號；只有同步 pre-action hook 能擋 | https://github.com/perplexityai/numbat README；https://github.com/perplexityai/numbat/blob/HEAD/docs/enforcement.md | 全文 | 成立 |
| numbat 規則出錯／崩潰／輸出失敗／sink 不可用時抑制 deny，宿主仍可能詢問或拒絕 | docs/enforcement.md（"suppress the numbat deny"；"does not guarantee that the tool executes"） | 全文 | 稿件已修成不等於放行 |
| numbat 預設輸出檔屬於同一 OS 使用者；未簽章 case bundle manifest 只證明內部一致；`hook status` 只驗證設定存在 | enforcement.md；README；docs/deployment.md | 全文 | 成立 |
| Claude Code hook 失敗預設是 non-blocking，動作照常 | https://code.claude.com/docs/en/hooks | 全文存檔 297,898 字元，grep 後讀 exit code／non-blocking error 段 | 成立；未逐段讀各 event schema |
| 微軟 AGT 外掛腳本內例外時以 2 結束（擋下）——引自第 3 篇 | 第 3 篇與其來源；本篇未重新查證 | 非本次 verify 範圍 | 交叉引用，依第 3 篇 |
| 微軟 AGT 稽核紀錄記的是 agent 嘗試做什麼，不驗證動作是否成功 | https://github.com/microsoft/agent-governance-toolkit/blob/HEAD/docs/LIMITATIONS.md §2 | 本機 clone（HEAD 9c85646）讀第 48–70 行 | 成立 |
| Adrian 預設 Audit；分析活動紀錄與推理軌跡；SDK／Claude Code 外掛；audit／block 設定 | https://github.com/secureagentics/Adrian README；https://docs.adrian.secureagentics.ai/（how-it-works、reliability） | 全文 | 預設 Audit 成立（docs "default for most deployments"）；其餘為產品自述，報告未逐項列判定，無第三方準確度 |
| DefenseClaw 首次設定為 observe；LLM judge 預設關（需 `--judge-model`）；本機審計 DB 預設保留 7 天；`retain_judge_bodies` 預設 true | https://github.com/cisco-ai-defense/defenseclaw README、Observability 頁、Guardrail 頁 | 全文（Observability 頁 404KB 完整正文） | 成立；judge 實作行為未讀 |
| DefenseClaw 屬 Cisco | README "Copyright 2026 Cisco Systems"；org `cisco-ai-defense` | 全文 | 成立 |
| failproofai 安裝後不啟用任何政策 | https://github.com/FailproofAI/failproofai README（"picks no policies"） | 全文 | 成立 |
| Prismor 預設全部 observe；本機稽核有雜湊鏈＋Ed25519 簽章；金鑰在同機同 uid 可讀，故 tamper-evident 非 tamper-proof；緩解為不可覆寫規則與匯出簽章 checkpoint | https://github.com/PrismorSec/prismor README；https://github.com/PrismorSec/prismor/blob/HEAD/docs/audit-trail.md | 全文 | 成立 |
| clawdstrike：每筆判決 Ed25519 簽章回執；雜湊鏈（Spine）屬企業版；單機金鑰由 `clawdstrike init --keygen` 寫本機；自稱預設 fail-closed | https://github.com/backbay-labs/clawdstrike README、THREAT_MODEL.md、enforcement-tiers.md | 全文 | 成立；**Spine 實作 README 前一輪 404，未驗** |
| transcript 路徑 `~/.claude/projects/<project>/<session>.jsonl`，明文，預設 30 天清理（`cleanupPeriodDays`） | Claude Code 文件 `.claude directory` 頁（code.claude.com/docs/en/ 下）；hooks 文件 `transcript_path` | 全文／grep | 成立 |
| transcript 非同步寫入、可能落後 | hooks 文件 | grep | 成立 |
| hook 輸入有 `prompt_id`，對應 OTEL `prompt.id` | hooks 文件 common input fields；https://code.claude.com/docs/en/monitoring-usage | grep | 成立 |
| OTEL 預設把 prompt 內容遮成 `<REDACTED>`；`OTEL_LOG_USER_PROMPTS`、`OTEL_LOG_TOOL_DETAILS`、`OTEL_LOG_TOOL_CONTENT` 預設 disabled；`OTEL_LOG_TOOL_CONTENT` 僅 tracing（beta） | monitoring-usage 變數表 | 原頁 1.29MB，只讀前 100,461 字元 | 成立；後半事件欄位表與 Security and privacy 段未讀 |
| 專案內 `.claude/settings.json`、`.claude/settings.local.json` 的 OTEL 變數被忽略；使用者層與 shell 仍有效 | monitoring-usage 第 414 行 | 讀過 | 成立 |
| managed settings 可鎖定 OTLP 目的地 | monitoring-usage "How managed settings lock the OTLP destination" | 讀過 | 成立；exporter selector 也需鎖才能防關閉，稿件未補 |
| 怎麼用 #3 的變數名 `CLAUDE_CODE_ENABLE_TELEMETRY`、`OTEL_LOGS_EXPORTER`、`OTEL_EXPORTER_OTLP_ENDPOINT` | monitoring-usage 變數表 | 前 100k 字元 | 報告確認前者與三個 `OTEL_LOG_*`；後兩者報告未逐項列判定，稿件已註明「以官方 Monitoring 頁為準」 |
| 「個人機器沒有 managed settings 這條路」與其設定位置 | 無 | — | **未能驗證**，稿件用「請管理員放進 managed settings」措辭避開，沒寫檔案位置 |
| `find … grep -lE` 指令的路徑與格式 | 同 transcript 路徑；報告在本機 sandbox 試跑計數（24 個 jsonl 中 22 個命中舊 pattern，只作噪音示例，不可外推） | 本機實測 | 新 pattern 未在報告中實測，屬作者收緊；稿件已警告會有誤報 |
| 「被騙的 agent 與你同使用者、通常能改自己的紀錄」 | 無單一來源 | — | 作者從權限模型推論；佐證：numbat deployment.md 與 Prismor audit-trail.md 的同 uid 說明。**未能由文件直接驗證**，稿件以推論口吻寫 |
| 「關鍵是金鑰與日誌放哪、把紀錄轉送另一台機器」 | 作者主張；佐證 numbat deployment.md（forward records promptly to an admin-controlled sink）、Prismor（export a signed checkpoint…somewhere the agent can't reach） | 全文 | 作者看法，稿件已標「我的看法」 |
| 怎麼用 #2「先監控後擋、一次改一條」、#5 `echo canary-12345` 做法 | 無 | — | 作者建議，非來源主張 |

## 連結檢查（post-verify）
uber/ADR、numbat、Adrian、DefenseClaw、clawdstrike、failproofai、Prismor 皆可讀到 README；arXiv 2605.17380 標題與作者符合；hooks、monitoring-usage 回 200；站內連結檔案皆存在。

## 沒驗到的範圍
Claude Code monitoring-usage 後半、各 event 的 hook schema、clawdstrike Spine 實作、DefenseClaw judge 實作行為；Uber 數字全為作者自述，沒有第三方驗證。
