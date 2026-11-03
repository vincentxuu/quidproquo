# Commit SOP（標準作業流程）

這個文件記錄 quidproquo 專案的 commit 規則，避免重複踩同樣的 CI 檢查錯誤。所有規則皆來源於 `AGENTS.md` 治理協定與 `docs/governance/operating-charter.md`。

---

## 流程 1：修改 skill

`.agents/skills/` 是唯一編輯處；`.claude/skills/` 是 `pnpm skills:sync` 產生的逐位元組鏡像，**禁止手改**。

```
1. 只改 .agents/skills/<skill>/SKILL.md（與同資料夾下的 references/、templates/、scripts/）
2. pnpm skills:sync                # 同步到 .claude/skills/（兩份必須逐位元組相同）
3. pnpm verify                     # 全站檢查必須全綠
4. git add .agents/skills/<skill>/ .claude/skills/<skill>/
5. git commit -m "skill(<skill>): ..."
```

**禁止行為**：只改 `.agents/` 而不同步 `.claude/`、只 commit 一邊、手改 `.claude/skills/`。

---

## 流程 2：任何 commit 前的強制檢查

```
1. git status --short
   # 確認只 commit 該次要改的檔案，不要亂帶無關的進行中工作
2. pnpm verify
   # lint + references + skills-sync + progress 必須全綠，紅了修真問題，不准繞過
3. wc -l progress.txt
   # 必須 ≤ 90 行；超過 85 行時先把已完成/過時條目移到 docs/progress-archive.md
4. git add <只該次的檔案>
5. git commit -m "<type>(<scope>): <描述>"
   # 不要用 --no-verify，除非有正當理由並先登錄 docs/governance/escalation-queue.md
```

**為什麼**：pre-commit 會自動跑 `pnpm verify:staged`，跳過 `--no-verify` 只會把問題拖到 CI 再爆出，修起來更慢。

---

## 流程 3：progress.txt 管理（working memory ≤ 90 行）

```
每次狀態變更時：
1. wc -l progress.txt              # 檢查行數
2. 若 ≥ 85 行，先把已完成/過時條目移到 docs/progress-archive.md
3. 寫入新記錄（一條一行，簡潔，不寫成日誌）
4. 若需要人拍板或無法完成的事項，登錄 docs/governance/escalation-queue.md
```

---

## 常見錯誤與避免方式

| 錯誤 | 後果 | 避免方式 |
|------|------|----------|
| 只改 `.agents/skills/`，不跑 `pnpm skills:sync` | CI `skills-sync` 失敗，deploy 被擋 | 修 skill 後必須跑 `pnpm skills:sync`，兩份一起 commit |
| `progress.txt` 超過 90 行 | CI `progress.txt protocol` 失敗 | 寫入前先 `wc -l`，超過就歸檔舊條目 |
| commit 前不跑 `pnpm verify` | CI 在遠端爆錯，修起來慢 | 每次 commit 前先跑一次 `pnpm verify` |
| 用 `--no-verify` 繞過 pre-commit | 問題拖到 CI，且違反治理協定 | 除非有正當理由並登錄 escalation-queue，否則不准使用 |

---

**參考**：`AGENTS.md` 治理章節、`docs/governance/operating-charter.md`、`docs/governance/escalation-queue.md`
