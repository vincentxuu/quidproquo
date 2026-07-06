# quidproquo 營運憲章（Operating Charter）

本文件是這個 repo 的 agent 治理規則，適用於**每一個 agent session、任何 runtime（Claude / Codex / 其他）、任何模型等級**。它假設執行者是能力有限的模型：規則刻意寫成命令式、可機械檢查、不依賴判斷力。

設計原則：**判斷力會隨模型變小而消失，制度不會。所以凡是能用腳本檢查的，就不要靠模型自律；凡是不可逆的，就不要讓模型自己決定。**

## 1. 行動分級

做任何事之前，先對照這張表。不確定落在哪一級 → 當作高一級處理。

### Tier 0 — 自主執行（不用問）

- 讀檔、搜尋、跑任何 `check:*` / `pnpm verify` / `pnpm test` 等只讀檢查
- 依 skill 流程寫文章、更新文章、翻譯、review、fact-check（skill 內建的確認點照常執行）
- 更新 `progress.txt`、`docs/progress-archive.md`、`docs/governance/escalation-queue.md`
- 在 feature branch 上 commit（前提：`pnpm verify` 全綠）

### Tier 1 — 過閘門才能做

- **任何 commit**：pre-commit 會跑 `pnpm verify`，紅了就修，不准繞過（`--no-verify` 視同違規）
- **發佈內容**：走對應 skill（post / post-update / post-translate），跑完 skill 要求的驗證
- **修改 skill**：只改 `.agents/skills/`，改完跑 `pnpm skills:sync` 再 `pnpm verify`

### Tier 2 — 先問使用者，拿到明確同意才做

- 改 content schema（`src/content.config.ts`）——會讓既有文章 build 失敗
- 新增或執行 D1 migration（`migrations/`）
- 翻轉 production feature flag（開或關都算）
- 執行 `pnpm deploy` / `pnpm sync:prod` 等任何打到 production 的命令
- 刪除或改名已發佈文章、改 slug、改 frontmatter `date`（URL 與 RSS 會壞）
- 改 CI workflow（`.github/workflows/`）、git hooks、`.claude/settings.json` 權限
- 新增 dependency（會擴大供應鏈與維運面）
- 批次改動超過 20 個檔案的操作（tag rename、backfill 等，先給計畫與樣本）
- 修改本憲章、`pnpm verify` 的檢查內容、或任何治理腳本

### Tier 3 — 永遠禁止

- 對 `main` force-push；`git reset --hard`；`rm -rf`（settings 已 deny，不要找替代寫法）
- 手改 `.claude/skills/`（它是產物，改了會被 `pnpm skills:sync` 覆蓋掉）
- 為了讓檢查變綠而弱化檢查（改門檻、跳過步驟、刪 assert）——檢查紅了只有兩條路：修真問題，或把「為什麼這個檢查可能是錯的」寫進 escalation queue 讓人拍板
- 在沒有外部來源的情況下，把版本號、價格、日期、統計寫進文章（用 post-verify）
- 未經使用者確認 revert 使用者的檔案改動

## 2. 不確定時的決策預設

1. **驗證器贏過直覺。** 你覺得對但 `pnpm verify` 說錯 → 相信 verify。你覺得 verify 的規則不合理 → 不准繞過，登錄 escalation queue。
2. **可逆優先。** 兩條路效果差不多時，選事後好撤銷的那條（草稿優先於發佈、branch 優先於 main、flag off 優先於刪 code）。
3. **一個精準問題。** 需要問使用者時，把決策收斂成一個可以一句話回答的問題，附上你的建議選項。不要丟開放式問題清單。
4. **問題比錯答便宜，但只在 Tier 2。** Tier 0/1 的事不要問，直接做；Tier 2 的事不要做，直接問。
5. **小步提交。** 一個邏輯改動一個 commit；出問題才能精準 revert。
6. **不會驗證的事不要開工。** 動手前先確認「做完之後我要跑什麼來證明它是對的」；答不出來就先問。

## 3. 制度資產地圖

| 機制 | 位置 | 什麼時候用 |
|---|---|---|
| 統一驗證閘門 | `pnpm verify`（`scripts/verify.mjs`） | 每次 commit 前自動跑；手動隨時可跑 |
| Skills 鏡像同步 | `pnpm check:skills-sync` / `pnpm skills:sync` | 改完 `.agents/skills/` 之後 |
| Session 記憶 | `progress.txt`（協定見 §5） | 任務狀態實質改變時 |
| 記憶歸檔 | `docs/progress-archive.md` | progress.txt 超過上限、條目完成或過期 |
| 升級佇列 | `docs/governance/escalation-queue.md`（協定見 §6） | 遇到 Tier 2 決策、太難或太危險的事 |
| 決策紀錄 | `docs/adr/NNNN-*.md`（規則見 §7) | 做了不可逆或架構性決定之後 |
| 結構化開發流程 | `openspec/` + opsx skills | 多步驟 feature 開發 |
| 部署前檢查 | `deploy-preflight` skill | 使用者說要 deploy 之前 |
| 營運 runbook | `docs/agent-*-runbook.md` | 操作對應子系統時先讀 |

## 4. Skills 管理規則

- `.agents/skills/` 是**唯一**編輯處。`.claude/skills/` 是 `pnpm skills:sync` 的產物，逐位元組相同，由 `pnpm verify` 強制。
- Runtime 差異（Claude 用 MCP、Codex 用 web.run 之類）寫在 skill 內文的條件式段落，**不准**用分岔檔案表達。歷史教訓：2026-05 手工維護雙版本，九個檔案漂移、還留下一個嵌套垃圾目錄。
- `.codex/skills/` 是 Codex 專用實驗區，不在同步範圍內；實驗成熟就搬進 `.agents/skills/`。
- 每個 skill 必須有 frontmatter `name` + `description`（description 要說清楚何時用、何時不要用）。
- 修 skill 的流程：改 `.agents/skills/<skill>/` → `pnpm skills:sync` → `pnpm verify` → commit（skill 檔案與鏡像同一個 commit）。

## 5. progress.txt 協定

- 定位：**working memory，不是日誌**。新 session 讀它就知道現在做到哪。
- 硬規則（`pnpm verify` 強制）：必須存在、必須有 `Last updated: YYYY-MM-DD`、全檔 ≤ 90 行。
- 結構：Current focus / In progress / Next steps / Recently completed / Notes。
- 完成、過期、或不需要每個 session 都看到的條目 → 移到 `docs/progress-archive.md`（最新段落在上）。
- 未完成的決策**不准**只靠歸檔保存——歸檔前先登錄 escalation queue。

## 6. Escalation queue 協定

`docs/governance/escalation-queue.md` 收兩種東西：

1. **Tier 2 決策**：agent 判斷需要做但無權自己做的事。
2. **超出當前能力的任務**：試了兩次都失敗、或明顯需要大規模重構/深度判斷的事。與其硬做出爛結果，不如寫清楚留給人類或更強的模型 session。

規則：

- 每個條目要有：做什麼、為什麼現在不能做（缺什麼前置條件或誰要拍板）、做的時候第一步看哪個檔案。寫到「一個沒有本次對話上下文的 session 能直接接手」的程度。
- **不要主動執行佇列裡的項目**。只有使用者明確指定（「處理 queue 裡的 X」）才動工。
- 完成的條目標記日期後移到檔尾的 Done 區。

## 7. 決策紀錄（ADR）

以下情況，在 `docs/adr/` 加一份 `NNNN-短標題.md`（編號遞增）：

- 不可逆的技術選型（換框架、換儲存、刪子系統）
- 會約束未來所有 session 的規則變更（含本憲章的修改）
- 推翻先前 ADR 的決定

格式照 `docs/adr/0001-rag-phase1b-decisions.md`：背景 → 決定 → 理由 → 後果。三段落寫得完就不要寫十段。

## 8. Commit 規範

格式：`<type>(<scope>): <summary>`，scope 可省略。

| type | 用途 |
|---|---|
| `post` | 文章新增／更新，scope 是 category，例：`post(ai): ...` |
| `feat` / `fix` | 功能與修錯 |
| `docs` | 文件（含本憲章、runbook、TODO） |
| `skill` | `.agents/skills/` 的變更（含鏡像同步） |
| `chore` | 雜項（tags 整理、依賴、設定） |
| `test` / `refactor` | 測試、重構 |

Summary 用改動的實際語言寫（中文內容用中文），一行說清楚做了什麼。

## 9. 修改本憲章

本憲章的修改是 Tier 2：先問使用者，同意後修改，並留一份 ADR。憲章與機制衝突時（例如 verify 檢查了憲章沒寫的東西），以憲章為準並修正機制——或者修憲。

---

制定：2026-07-06，Claude（Fable 5）single-session governance setup。背景：此環境後續由較小模型長期營運，本憲章把判斷力沉澱為機制。
