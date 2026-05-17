---
name: tag-audit
description: Audit all tags across src/content/posts/, surface synonym splits (e.g. `llm` vs `large-language-model`), too-generic tags, typos, and missing core tags, then propose a rename map. Does NOT auto-rename — produces a plan for the user to approve before batch replacement. Use when user says 整理 tags / tag 重複 / 清理標籤 / tag 太亂 / tag audit.
---

# tag-audit skill

掃整站 tags，找問題，**列改名提案，不直接動**。使用者拍板後才批次替換。

## 執行步驟

### 1. 收集

```bash
# 全站 tag 出現次數
grep -h "^tags:" src/content/posts/**/*.md \
  | sed -E 's/^tags:\s*\[(.*)\]/\1/' \
  | tr ',' '\n' \
  | sed -E 's/^[ "]+|[ "]+$//g' \
  | grep -v '^$' \
  | sort \
  | uniq -c \
  | sort -rn
```

存成表，按頻次排序。

## tag canonical 規則

`tag-audit` 與 `post-review` 都照這組規則判斷，不要各自發明標準：

1. **全小寫 kebab-case**：`claude-code`，不要 `Claude Code` / `claude_code` / `claudecode`。
2. **既有高頻優先**：同義詞合併時，通常保留站內使用次數最多、讀者已熟悉的 tag。
3. **官方名稱優先於縮寫失真**：產品/框架/模型有清楚官方名稱時，保留不會誤解的形式，例如 `claude-code` 優於 `cc`。
4. **通用縮寫可保留**：`llm`、`rag` 這種站內與業界都穩定的縮寫，可以優先於冗長全名。
5. **category 不重複當 tag**：不要用 `tech`、`ai`、`learning` 這種只重複分類的 tag，除非它在該分類外有明確辨識價值。
6. **核心主題在前**：單篇文章的 tags 以主要工具/概念/問題排序，不用按字母。
7. **刪除比改名更保守**：太一般的 tag 先列成提案，不直接刪；可能影響 `/tags/<tag>` URL。

### 2. 找問題（四類）

**A. 同義詞分裂**

人工眼看：相同概念有沒有兩個寫法？

| 高頻 | 低頻別名（建議改成高頻） |
|---|---|
| `llm` (53) | `large-language-model` (3)、`llms` (1) |
| `agent` (27) | `ai-agent` (8)、`agents` (4) |
| `claude-code` (19) | `claudecode` (1) |
| `rag` (45) | `retrieval-augmented-generation` (1) |

合併到 canonical tag。通常是高頻那個；如果低頻 tag 明顯更符合官方名稱或更不易誤解，就反過來改。

**B. 太一般**

不傳達資訊的：
- `tech` / `programming` / `coding`（跟 category 重複）
- `learning` / `study`（誰寫文章不是在學）
- `notes` / `thoughts`

列出來，逐個問使用者要不要刪。

**C. 拼錯**

```bash
# 抓出現次數 = 1 的 tag，眼看
grep -h "^tags:" src/content/posts/**/*.md ... | uniq -c | awk '$1==1'
```

人工檢查：是真的小眾 tag，還是錯字？

**D. 應該有沒有**

抽樣 5-10 篇文，確認核心題目有沒有進 tag。例如一篇講 LangGraph 的文章 tags 裡沒有 `langgraph` → 漏 tag。

### 3. 改名提案

產出表：

```
| 動作 | 從 | 到 | 出現次數 | 影響檔案數 |
|---|---|---|---|---|
| rename | large-language-model | llm | 3 | 3 |
| rename | claudecode | claude-code | 1 | 1 |
| delete | tech | (移除) | 12 | 12 |
| add | langgraph 到 X 篇 | — | — | 5 |
```

把這張表給使用者看，**逐項確認**才動作。

### 4. 批次替換（核可後）

每個 rename 一條：

```bash
# 範例：large-language-model → llm
find src/content/posts -name "*.md" -exec \
  sed -i 's/large-language-model/llm/g' {} \;
```

注意：
- `sed -i` 在 mac 要 `sed -i ''`，linux 直接 `sed -i`
- **每次替換都跑 git diff 看一下**，避免改到內文中提到的字串
- 比較安全的做法：只在 frontmatter 裡改，用更精確的 regex

更安全的精確替換（只動 frontmatter `tags:` 行）：

```bash
find src/content/posts -name "*.md" -print0 | xargs -0 perl -i -pe '
  if (/^tags:/) {
    s/\bold-tag\b/new-tag/g;
  }
'
```

### 5. 驗證

```bash
pnpm check:references
pnpm astro check
```

### 6. Commit（單一邏輯動作 → 單一 commit）

不要把 5 個 rename 全包一個 commit。每類動作一個 commit：

```bash
git commit -m "chore(tags): rename large-language-model → llm"
git commit -m "chore(tags): drop generic tag 'tech'"
git commit -m "chore(tags): add missing langgraph tag to 5 posts"
```

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 「直接 sed 全換不問」 | tag 是公開 URL（`/tags/<tag>`），改錯外站連結就 404 |
| 「一個 commit 全部改」 | 出問題沒辦法精確 revert |
| 「不跑 astro check 就送」 | tag schema 是 `string[]`，YAML 寫壞 build 直接掛 |
| 「文中內文也一起 sed」 | 只該動 frontmatter；內文是讀者讀的，不該因為 tag 整理被改 |

## 不在這個 skill 範圍

- 自動為新文章補 tag（那是 post / post-review 的事）
- 翻譯 tag 成英文（tag 是 ID 不翻）

## 詳細參考

- tag 命名規則：`../post/references/writing-guide.md` 與 `../post/references/frontmatter-schema.md`
