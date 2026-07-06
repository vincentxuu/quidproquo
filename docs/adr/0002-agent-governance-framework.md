# ADR 0002: Agent 治理框架（operating charter + 機械化閘門）

日期：2026-07-06
狀態：Accepted

## 背景

此環境長期由較小的模型營運；使用者以一次高階模型 session 建立制度。盤點發現三個靠模型自律必然劣化的點：

1. `.claude/skills` 與 `.agents/skills` 宣稱鏡像關係，實際已九檔漂移，且遺留一個嵌套垃圾目錄（`tw-stock-screen/tw-stock-screen/`）——手工維護雙版本不可持續。
2. 品質檢查分散（lint、check:references、post-quality、glossary），沒有單一入口；pre-commit 與 CI 各跑各的子集。
3. `progress.txt` 無格式協定，正在退化成 append-only 日誌；CLAUDE.md 還強制引用一個不存在的 `~/.claude/skills/format-commit.md`。

## 決定

1. **營運憲章**：`docs/governance/operating-charter.md`，核心是四級行動分級（自主／過閘門／先問／禁止）與不確定時的決策預設。CLAUDE.md 與 AGENTS.md 內嵌摘要。
2. **統一閘門**：`pnpm verify`（lint + check:references + skills-sync + progress 協定），接進 pre-commit、Claude Stop hook、session-start、preview CI。deploy CI 刻意只保留 build 關鍵檢查，避免治理性紅燈擋住每日排程部署。
3. **Skills 單一事實來源**：`.agents/skills/` 唯一可編輯，`.claude/skills/` 由 `pnpm skills:sync` 產生、逐位元組相同、由 verify 強制。合併時以較豐富的 `.claude` 版為基底、嫁接 runtime 中立段落，兩邊內容都未丟失。runtime 差異寫在 skill 內文條件式段落。
4. **progress.txt 協定**：working memory 定位、90 行硬上限（verify 強制）、歸檔到 `docs/progress-archive.md`。
5. **Escalation queue**：`docs/governance/escalation-queue.md` 收 Tier 2 決策與超出能力的任務；agent 不得主動執行佇列項目。
6. **Commit 規範內嵌**：取代對機器本地 skill 檔的硬依賴。

## 理由

判斷力會隨模型變小而消失，制度不會。能用腳本檢查的不靠自律；不可逆的不讓模型自己決定。閘門必須「單一入口 + 處處相同」，否則小模型會在不同 hook 之間漏掉子集。

## 後果

- 所有 commit 變慢幾秒（verify）；換得漂移類問題在 commit 時就被擋下。
- 修改 skill 多一步 `pnpm skills:sync`；忘記會被 verify 擋下，錯誤訊息內含修復命令。
- 憲章本身的修改屬 Tier 2 且需新 ADR。
