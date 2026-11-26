# 證據紀錄：用 AI 審計自己的專案（series order 5）

來源：2026-10-24 獨立 post-verify 報告（session scratchpad `review-verify-b3.md`）。Cloudflare 與 Trail of Bits 兩個 repo 是本機淺層 clone 後 grep／讀檔，未執行任何內容：cloudflare/security-audit-skill @ c1c8a8c（2026-09-14），trailofbits/skills @ 196a907（2026-10-23）。

| 正文主張 | 一手來源 | 讀取程度 | 判定／備註 |
|---|---|---|---|
| Cloudflare skill 六階段：偵察、覆蓋台帳引導的獵捕與覆蓋審查、候選驗證（獨立 verifier 試著推翻）、結構化輸出、獨立複驗、報告 | https://github.com/cloudflare/security-audit-skill SKILL.md "Full audit workflow"；README；VALIDATION-AND-REPORTING.md | 全文 | 成立。官方部落格講的是 7 階段舊版，repo 現行 6 階段，稿件以 repo 為準 |
| Cloudflare skill 不呼叫 Semgrep 或 CodeQL | 全 repo `grep -rniE "semgrep|codeql"` 零命中 | clone＋grep | 成立（否定句，依全 repo grep） |
| 內部 harness 把 Semgrep 接進整條流程，Hunter 一個月內呼叫 0 次，因為寧可讀碼跑碼 | https://blog.cloudflare.com/build-your-own-vulnerability-harness（2026-06-18） | 全文 | 成立（"They would rather read and run the code"） |
| 單次執行只找得到多次執行總和的約一半，偏向較簡單、不細緻的漏洞 | 同部落格；repo README | 全文 | 成立 |
| 不宣稱假陰性率 | 同部落格 "We don't claim a false-negative rate" | 全文 | 成立 |
| 內部 harness 大範圍掃描是定期批次，最長一次超過 14 小時 | 同部落格 "What it costs" | 全文 | 成立；主詞是 harness 整 repo 掃描，不是公開 skill |
| repo 兩支腳本只檢查 JSON 結構與台帳一致 | `validate-findings.cjs`、`validate-coverage-ledger.cjs`；VALIDATION-AND-REPORTING.md "format and ledger consistency only" | 檔頭與 fs 呼叫；其餘未逐行讀 | 成立 |
| 無 OS 層沙箱時不執行目標程式碼；需執行才能確認的線索停在 `needs_validation`（無嚴重度）；光靠原始碼追完的仍可判 confirmed | SKILL.md；DATA-ISOLATION 附檔；README Requirements | 全文／grep | 成立（稿件已修過強處） |
| `quick`／`standard`／`deep` profile，`run-metadata.json` 的 budget＝agent 呼叫次數上限；預設為 guidance mode | SKILL.md "Run profiles and scope"、"Cost budget" | 全文 | 成立 |
| Cloudflare skill 是 MIT | repo LICENSE | 讀 | 成立 |
| ToB skills repo 現有 46 個 plugin（2026-10-23） | trailofbits/skills `plugins/` 目錄 | clone | 成立 |
| `static-analysis`：Semgrep＋CodeQL 腳本＋SARIF 合併 | plugin README；`skills/semgrep/scripts/run-scans.sh`、`merge_sarif.py` | 讀 | 成立 |
| `insecure-defaults`：recon、平行 discover、refuting agents 驗證 | plugin README "How it runs" | 讀 | 成立 |
| `fp-check`：說明 "LLMs are biased toward seeing bugs and overrating severity" | `plugins/fp-check/skills/fp-check/SKILL.md` 第 34 行 | grep＋讀 | 成立 |
| `differential-review` 審 PR／commit／diff | plugin README | 讀 | 成立 |
| `supply-chain-risk-auditor` 用腳本收集維護者數、下載量，不憑印象估 | SKILL.md；`scripts/collect.py` | 讀 | 成立 |
| 該審計器只讀 `package-lock.json`／`npm-shrinkwrap.json`（及 uv.lock、go.mod 等），明寫不讀 `pnpm-lock.yaml`、`yarn.lock`，偵測到時報告註明 present but not read，版本退回 manifest 釘選或最新版 | SKILL.md workflow 第 1 點；`collect.py` 的 `UNREAD_LOCKFILES` | 讀 | 成立；稿件「只讀…npm 系列」限定在 JS 語境 |
| 兩份鎖檔並存時，只要 `package-lock.json` 存在就用它解析版本，不比對新舊 | `collect.py` 的 `_npm_all_locked`／`_npm_locked_versions` | 讀程式碼，**沒有實跑** | 程式碼閱讀推論；文件沒寫此情境。稿件已標「我讀了程式碼，沒有實跑」 |
| Semgrep 規則集依副檔名對應，`.js/.jsx/.ts/.tsx` 對到 javascript、typescript、react、nodejs、express、nextjs、angular；無 Astro | `plugins/static-analysis/skills/semgrep/references/rulesets.md` 第 62–63 行；整個 plugin grep "astro" 零命中 | grep＋讀 | 成立 |
| ToB skills 授權 CC-BY-SA-4.0 | repo README、LICENSE | 讀 | 成立；署名／相同方式分享義務是條款一般內容，非法律意見 |
| Semgrep 規則放在另一個 repo trailofbits/semgrep-rules，授權 AGPLv3 | `rulesets.md` 第 128 行；https://github.com/trailofbits/semgrep-rules LICENSE（GNU AFFERO GPL v3） | 讀開頭 | 成立 |
| 兩個 repo 都沒有 Workers、D1、KV、Astro、Vectorize 專屬檢查 | 全 repo 反證 grep（wrangler／cloudflare／vectorize／durable object／workers ai／miniflare／astro／D1／KV）；Cloudflare 只有泛用 "edge workers"、"serverless functions"（CLOUD-AND-DEPLOYMENT.md 第 5、22 行）與 ATTACK-CLASSES.md 第 19 行 | clone＋全 repo grep | 成立（否定句，依 grep；ToB 的 `astro` 命中全是 "catastrophic"，`D1`／`KV` 命中與 Workers 無關） |
| Cloudflare 雲端附檔有 "Edge/runtime boundary mismatch" | CLOUD-AND-DEPLOYMENT.md | 讀 | 成立 |
| 核心攻擊類別有預覽／草稿／暫存洩漏（搜尋、RSS、sitemap、API listing） | ATTACK-CLASSES.md 第 80 行 | 讀 | 成立 |
| 資料隔離附檔檢查搜尋、快取、嵌入、縮圖、RSS、預覽、索引等衍生副本在主記錄權限改變後有沒有失效 | DATA-ISOLATION-AND-LIFECYCLE.md 第 36 行 | 讀 | 成立；原文無「草稿」，稿件已拆開寫 |
| 要求不能假設原始碼以外的部署控制存在或不存在，改用 `needs_validation` | SKILL.md "Respect source visibility" | 讀 | 成立（意譯，稿件已去引號） |
| AI 與 LLM 附檔有 RAG 間接注入、跨租戶 embedding、記憶污染；"Prompt injection alone is not a finding"；無特定向量資料庫產品條目 | AI-AND-LLM.md（第 12 行等） | 讀 | 成立 |
| binding 宣告在 `wrangler.jsonc`、secrets 實際值與帳號端資源不在原始碼 | 作者推論；本站 repo 根目錄有 `wrangler.jsonc` | — | 作者推論，不是兩個 repo 的文字；稿件已寫成作者陳述 |
| 兩者沒有公開在真實專案上的準確率或誤報率；ToB 部分 plugin 有自建 evals（回歸測試） | Cloudflare README 與部落格；ToB README 搜 precision／recall 命中的是 property-based-testing 與 variant-analysis 的 eval 說明 | grep | 成立（否定句）；**沒有逐個 plugin 讀 evals 結果** |
| HN：一人在小型 FastAPI 專案至少 15 萬 token 撞 session 上限；另一人在中型程式庫丟 100 萬 token 無結果；另有人說針對 PR 這種範圍比較好用 | https://news.ycombinator.com/item?id=49736466（留言者 jesse_dot_id、drchaim、SkyPuncher；HN API 全文，約 40 則） | 全文 | 成立；個人經驗，不是統計。稿件已不再拿網友回報當建議依據 |
| 建議 `pnpm audit` 處理只有 pnpm-lock.yaml 的依賴弱點 | 無（作者建議） | — | **未能驗證**，報告沒有查 `pnpm audit` 適用性 |
| 建議 `git log -1 --format=%cs -- package-lock.json`、`ls …`、`grep -rilw …` | 無（作者建議的標準 git／shell 用法） | — | 未在報告中實測 |
| 怎麼用順序（範圍、最小試跑、沙箱、鎖檔、背景範例） | 無 | — | 作者依文件推的建議，稿件已寫「我沒有跑過」 |
| Cloudflare 是 Workers 供應商；Trail of Bits 是資安顧問公司 | 常識性身分描述 | — | 報告未單獨查證，兩家 repo／部落格作者身分明確 |

## 連結檢查（post-verify）
cloudflare/security-audit-skill、blog.cloudflare.com/build-your-own-vulnerability-harness、trailofbits/skills、HN item 49736466 皆 200 且指向所說內容；站內連結（地圖、第 2 篇沙箱、第 4 篇）檔案皆存在。

## 沒驗到的範圍
`collect.py` 兩份鎖檔並存行為只讀未跑；`validate-*.cjs` 只讀開頭與 fs 呼叫；ToB 各 plugin evals 結果；所有 skill 的實際審計準確度（兩邊都沒有公開資料，本篇也沒試跑）。

## 2026-10-24 補查
- 審計器讀的鎖檔：https://github.com/trailofbits/skills/blob/HEAD/plugins/supply-chain-risk-auditor/skills/supply-chain-risk-auditor/SKILL.md 與 README：npm 讀 `package-lock.json`／`npm-shrinkwrap.json`，另讀 `uv.lock` 與 Go 1.17+ `go.mod`；不讀 `yarn.lock`、`pnpm-lock.yaml`、`poetry.lock`（報告註明 present but not read，直接依賴版本退回 manifest 釘選或最新版，間接依賴掃描做不了）。已改稿字面（原稿只寫 npm 系列）。
- 只有 pnpm-lock 時的影響：README 寫直接依賴仍有完整準則、版本退回 manifest；稿原「這項審計是空的」過頭，已改為「拿不到實際版本、掃不了間接依賴，其他準則照 package.json」。`pnpm audit` 與審計器互不衝突（pnpm 自己的指令，pnpm.io/cli/audit：檢查已安裝套件）。
- 兩份鎖檔並存：讀 `scripts/collect.py`（`_npm_locked_versions`、`_npm_all_locked`）：依序找 `package-lock.json`、`npm-shrinkwrap.json`，用第一個存在的，沒有比較檔案新舊的程式。可確定，仍標「讀程式碼、沒實跑」。
- `grep -rilw -e astro -e vectorize -e wrangler .`：假資料實跑正確（-w 排除 astrology）；clone 後會掃到 .git，已加 `--exclude-dir=.git`。`ls … 2>/dev/null`、`git log -1 --format=%cs -- <file>`（git 2.43）實跑可用。
