---
title: "Claude Code 個人設定稽核：CLAUDE.md、hook 與 auto memory 各管什麼"
date: 2026-11-13
category: ai
type: guide
tags: [claude-code, claude-md, hooks, agent-memory, context-engineering]
lang: zh-TW
tldr: "掃了 7 天、85 個 session：104 次 compaction、20 次 SIGKILL、24 次型別檢查 OOM、72 則使用者追問。結論是硬規則從 CLAUDE.md 搬進 PreToolUse hook，MEMORY.md 刪掉 16 條 git 查得到或已失效的條目。"
description: "一次 Claude Code 個人設定稽核的完整過程：依官方文件把偏好寫進 CLAUDE.md、用 hook 強制「本機測試要先同意」、用串流腳本統計 session 的重複錯誤，以及照 auto memory 規則清理 MEMORY.md。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-11-13-claude-code-config-audit-en)

## TL;DR

我把個人偏好寫進 [Claude Code](https://code.claude.com/docs/en/overview) 的全域 [`~/.claude/CLAUDE.md`](https://code.claude.com/docs/en/memory)，接著掃了近 7 天、85 個 session 的 transcript，找重複犯錯和資源浪費，再照官方文件整理 auto memory。三個結論：

1. 「未經同意不准在本機跑測試」這種沒有例外的規則，寫在 CLAUDE.md 不夠，要寫成 [PreToolUse hook](https://code.claude.com/docs/en/hooks)。
2. 最大的浪費不在規則，在長 session：前 8 大 session 各吃掉 8.7 到 18 億 token，多數被 compaction 了 4 到 6 次。
3. MEMORY.md 裡有一批「PR 進度」類條目，git 一查就有，而且早就過期，其中兩條還把沒上線的機制寫成現行規則。

## 情境

機器只有 18 GB RAM，同時開好幾個 Claude Code session，各自跑 pytest、vue-tsc、headless 瀏覽器和 dev server。我想做三件事：

- 把溝通與解題偏好寫成全域指示：繁體中文、結論先行、分清症狀和根因。
- 限制資源：開工前先看負載，無頭瀏覽器同時最多 3 個，用完就關。
- 未經同意，不在本機跑任何測試。

問題是全域 `CLAUDE.md` 前半段是團隊 CLI 同步的範本，後半段才是個人區，而且記憶資料夾裡已經累積了 147 條 auto memory。

## 問題一：規則寫在哪裡才有用

官方文件講得很直接，CLAUDE.md 是 context，不是強制設定：

> "Claude treats them as context, not enforced configuration. To block an action regardless of what Claude decides, use a PreToolUse hook instead."
> — [Claude Code 文件：How Claude remembers your project](https://code.claude.com/docs/en/memory)

Best practices 頁還用型別檢查舉例，說寫在 CLAUDE.md 的「完成前要跑 typecheck」：

> "works most of the time, not every time."
> — [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices)

所以我把規則分成兩類：

| 類型 | 例子 | 放哪裡 |
|---|---|---|
| 判斷型偏好 | 結論先行、分清事實與推測、不擴大範圍 | CLAUDE.md |
| 不能有例外 | 未同意不跑測試、開工前看資源 | hook，CLAUDE.md 只留一行指向它 |

個人區放在團隊範本的 `<!-- END ... -->` 標記之後，同步工具只覆寫標記之間的內容。節首寫明「與共用指引或 skill／harness 流程衝突時，以本節為準」。官方提醒過，兩條指示衝突時模型「may pick one arbitrarily」，不寫清楚優先順序，團隊流程裡「push 前要跑 pytest」就會跟個人規則打架。

## 問題二：7 天的 session 到底浪費在哪

transcript 是 `~/.claude/projects/<project>/*.jsonl`，7 天累積了約 978 MB。當時機器 load 在 15 左右、可用記憶體 34%，所以我沒有開 subagent 去讀，改用一支 Python 逐行串流解析，只累計計數。重點欄位：

- `tool_result.is_error`：工具錯誤，依工具名稱和錯誤首行正規化後分組。
- `system` 且 `subtype == "compact_boundary"`：compaction 次數。
- `[Request interrupted`：使用者中斷。
- assistant 訊息的 `usage`：input、cache read、cache creation token 加總。
- 使用者文字裡的「為什麼」「又」「不對」等字，用來抓修正與追問。

```python
for line in open(path, errors="ignore"):
    if len(line) > 2_000_000:   # 跳過超大行，避免吃爆記憶體
        continue
    o = json.loads(line)
    if o.get("type") == "system" and o.get("subtype") == "compact_boundary":
        compactions[sid] += 1
    usage = (o.get("message") or {}).get("usage")
    if o.get("type") == "assistant" and usage:
        tokens[sid] += sum(usage.get(k, 0) for k in
                           ("input_tokens", "cache_read_input_tokens",
                            "cache_creation_input_tokens"))
```

結果：

| 指標 | 數字 |
|---|---|
| Session 數 | 85 |
| Compaction | 104 次；前 8 大 session 各 4 到 6 次 |
| Token（含 cache read） | 約 154 億；單一 session 最多約 18 億 |
| 使用者中斷／拒絕工具 | 54 次／21 次 |
| 程序被 SIGKILL | 20 次 |
| vue-tsc heap OOM／SIGABRT | 24 次，每次都卡住 commit |
| 記憶體守護程式暫停程序 | 77 次 |
| 搜尋工具額度用完後仍反覆呼叫 | 28 次 |

錯誤訊息裡還有一類跟模型能力無關：shell 是 zsh，模型卻照 bash 習慣寫。

- `[ "$a" == "$b" ]`：zsh 會把 `==` 當成檔名展開，報 `== not found`。我自己寫稽核腳本時也踩了一次。
- 把指令存進變數再執行：zsh 不做 word splitting，報 `command not found: env -u ...`。
- `~/.zshenv` 裡一行 `. "$HOME/.cargo/env"`，但檔案不存在，每個 Bash 輸出開頭都多一行錯誤，所有輸出都多一層雜訊。

72 則使用者訊息裡，追問大致分三類：

- **擅自擴大範圍**：「為什麼要分這麼多開關？」「為什麼要改？」
- **停在半路沒講**：「為什麼還沒開 PR？」「為什麼還是 draft？」
- **驗證順序錯**：「還沒合併，要怎麼在 dev 驗？」

這三類都是判斷問題，hook 擋不了，所以寫成 CLAUDE.md 裡可檢核的句子：

```markdown
- 範圍：只做被要求的。要新增開關、設定、gate、流程，或找其他人之前，先問並說明為什麼不能更小。
- 完成：說「完成」前逐項對照原始需求；沒做完（含 PR 還是 draft、還沒開）就明講剩什麼與原因。
- Shell 是 zsh：`[ ]` 比較用 `=` 不用 `==`；不把指令存進變數再執行；等待條件用 Monitor，不用 sleep 輪詢。
```

照 [Claude Academy](https://academy.claude.com/courses/claude-code-in-action/a-claude-md-that-follows) 的建議，每條都寫出替代做法（name the replacement），不只寫「不要 X」。

## 解法一：用 hook 強制「本機測試要先同意」

`~/.claude/hooks/local-test-consent` 是 PreToolUse(Bash) hook。它把指令依 `&&`、`;`、`|` 切成片段，剝掉 `env`、`nice` 這類前綴，再判斷片段開頭是不是測試執行器：

- 直接擋：`pytest`、`vitest`、`jest`、`playwright`、`vue-tsc`、`python -m pytest`、`manage.py test`、`pnpm test`／`type:check`／`e2e`。
- `git commit` 只在前端 repo 擋，因為那裡的 pre-commit 會跑全專案 vue-tsc，最多吃 8 GB。
- 放行：`grep pytest`、`cat pytest.ini`、`echo pnpm test`、`pnpm lint`、`ruff check`、`makemigrations --check`。

命中時 exit 2，stderr 告訴模型先問使用者。使用者同意後，模型在指令尾端加 `# [test-consent]` 才放行。我用 19 條指令測過，擋與放行都符合預期。

```python
def main():
    data = json.load(sys.stdin)
    cmd = (data.get("tool_input") or {}).get("command", "")
    if not cmd or "[test-consent]" in cmd:
        return 0
    hits = [seg for seg in re.split(r"&&|\|\||;|\||\n", cmd)
            if is_test(words(seg.strip()))]
    if not hits:
        return 0
    sys.stderr.write("⛔ 這條指令會在本機跑測試。先向使用者說明範圍與負載，"
                     "同意後在指令尾加 `# [test-consent]` 重送；不可自行加。\n")
    return 2
```

沒用 `permissionDecision: "ask"` 的原因：我的 session 開著 bypass 權限模式，我在文件裡找不到 ask 在這個模式下會不會跳確認的明確說明。exit 2 不管什麼模式都一定會擋下。缺點是標記理論上模型可以自己加，所以 stderr 和 CLAUDE.md 都寫了「不可自行加」，subagent 也被要求回報主對話，不能自己決定。

順手查到一個舊 bug：本來就有的 push 檢查 hook，用 `json.load(stdin).get('command')` 讀指令，但 PreToolUse 的輸入結構是 `tool_input.command`。所以它從裝上那天起一次都沒擋過，只是看起來有在運作。改成 `(d.get('tool_input') or {}).get('command')`，並把訊息改成跟新規則一致：要嘛使用者同意後跑過測試，要嘛在 PR 註明「未本機驗證，以 CI 為準」。

## 解法二：SessionStart hook 自動帶資源摘要

「開工前先查 `memory_pressure` 和 load」寫在 CLAUDE.md，只能靠模型記得去查。[SessionStart hook](https://code.claude.com/docs/en/hooks) 的 stdout 會被加進 context，所以直接讓它在每個 session 開頭印一行：

```bash
#!/bin/bash
free=$(memory_pressure 2>/dev/null | awk -F': ' '/free percentage/{print $2}')
load=$(sysctl -n vm.loadavg | awk '{print $2", "$3", "$4}')
top3=$(top -l 1 -o mem -n 3 -stats command,mem | tail -3 \
       | awk '{m=$NF; $NF=""; sub(/ +$/,""); printf "%s %s；", $0, m}')
echo "本機資源（18 GB RAM、12 核）：可用記憶體 ${free}，load ${load}，前三名 ${top3}" \
     "可用 <25% 或 load > 核心數時，重負載工作一律依序執行。"
```

`awk` 那段是為了處理程序名稱有空格的情況（例如 `Orca Helper`）：取最後一欄當記憶體，其餘當名稱。每個 session 多花不到 100 token。

## 解法三：照官方規則清理 auto memory

官方對 auto memory 的定義：

> "`project`: ongoing work, deadlines, and decisions that Claude can't derive from the code or git history"
>
> "Claude skips anything it can derive from the codebase, such as architecture, file paths, or debugging fixes."
> — [Claude Code 文件：Auto memory](https://code.claude.com/docs/en/memory)

另外兩個容易忽略的事實：

- MEMORY.md 每個 session 只載入「first 200 lines or 25KB, whichever comes first」。我原本 147 行、22.7 KB，快到上限了。
- memory 檔不在 `cleanupPeriodDays` 的自動清理範圍內，會永遠留著，直到有人刪掉。

[`/doctor prompt-audit`](https://code.claude.com/docs/en/memory) 文件列出的稽核範圍是 CLAUDE.md、rules、skills、commands、subagents，不含 auto memory。所以 memory 互相矛盾或過期，只能自己抓。

我逐條讀，再用 `gh pr view` 和 `git ls-tree origin/develop` 核對每條提到的事實：

| 問題 | 數量 | 例子 | 處理 |
|---|---|---|---|
| 只記 PR 進度，PR 已合併 | 8 | 「三支 PR 已於某日合併」 | 刪 |
| 把沒上線的東西寫成現行規則 | 2 | 「高風險改動必經某人審查」，但 PR 已關閉、檔案不在 develop | 刪 |
| 跟另一條 memory 矛盾 | 4 | 一條說「換 worktree 要加 `--create-db`」，另一條說「不要加」，索引描述又寫「先 DROP」 | 改成同一口徑 |
| 寫了檔案但沒進索引 | 2 | 「本機 DB 絕不 DROP 重建」從沒被載入過 | 補索引或合併 |
| 跟新規則衝突 | 5 | 「push 前必跑 pytest」「驗收一律錄影」 | 改成「列範圍、等同意；沒跑就明說」 |

最後 MEMORY.md 從 147 行降到 132 行。真正有價值、我全部保留的，是 git 查不到的東西：環境陷阱（某個 port 被長期佔用、CI 跟本機用的 prettier 版本不同）、使用者做過的決策和理由、外部資源在哪裡。

另外在 CLAUDE.md 補了一條，避免同類條目再累積：

```markdown
- 不記 git／gh 查得到的事（PR 狀態、合併日期、commit、分支進度）；project 類只記查不到的決策、約定與卡點，並寫明「刪除條件」，條件達成就刪。
```

「刪除條件」是這次最實用的格式。例如「修正 PR 合併後刪除」「11/14 重算完成並回報後刪除」。下次整理時只要檢查條件有沒有達成，不必重新判斷整條還有沒有用。

## 為什麼會這樣

- **CLAUDE.md 和 memory 都是 context，不會自己執行。** 寫得再清楚，遇到 skill 或流程的指示衝突，模型仍可能選另一邊。沒有例外的規則要放進會真的攔下指令的地方。
- **auto memory 只會增加，不會自己變少。** 寫入時的大小檢查只在快滿時提醒，內容過期、彼此矛盾、記的是 git 的副本，都不會觸發任何提醒。
- **最大的成本是長 session，不是規則寫得不好。** 一個 session 被 compaction 4 到 6 次，每次都重讀大量 cache。官方 Help Center 的建議是：

  > "When you switch from 'fix the login bug' to 'refactor the billing module,' run `/clear` and start fresh."
  > — [Give Claude context: CLAUDE.md and better prompts](https://support.claude.com/en/articles/14553240-give-claude-context-claude-md-and-better-prompts)

## 學到的事

判斷型的偏好寫在 CLAUDE.md，沒有例外的規則寫成 hook，過期的事實從 memory 刪掉。三種東西放錯地方，就會出現「規則寫了沒人遵守」「hook 裝了從沒觸發」「memory 記了反而誤導」。

## 參考資料

- [How Claude remembers your project（CLAUDE.md 與 auto memory）](https://code.claude.com/docs/en/memory)
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [Hooks reference](https://code.claude.com/docs/en/hooks)
- [A CLAUDE.md that follows — Claude Academy](https://academy.claude.com/courses/claude-code-in-action/a-claude-md-that-follows)
- [Give Claude context: CLAUDE.md and better prompts — Claude Help Center](https://support.claude.com/en/articles/14553240-give-claude-context-claude-md-and-better-prompts)
