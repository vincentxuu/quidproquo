---
name: tag-audit
description: Audit all tags across src/content/posts/, surface synonym splits, too-generic tags, typos, and missing core tags, then propose a rename map. Does NOT auto-rename. Use when user says 整理 tags / tag 重複 / 清理標籤 / tag 太亂 / tag audit.
---

# tag-audit skill

掃整站 tags，列改名提案，不直接動。使用者拍板後才批次替換。

## 收集

```bash
grep -h "^tags:" src/content/posts/**/*.md \
  | sed -E 's/^tags:\s*\[(.*)\]/\1/' \
  | tr ',' '\n' \
  | sed -E 's/^[ "]+|[ "]+$//g' \
  | grep -v '^$' \
  | sort \
  | uniq -c \
  | sort -rn
```

## tag canonical 規則

`tag-audit` 與 `post-review` 都照這組規則：

1. 全小寫 kebab-case：`claude-code`，不要 `Claude Code` / `claude_code` / `claudecode`。
2. 既有高頻優先：同義詞合併時，通常保留站內使用次數最多的 tag。
3. 官方名稱優先於縮寫失真：例如 `claude-code` 優於 `cc`。
4. 通用縮寫可保留：`llm`、`rag` 這種穩定縮寫可以優先於冗長全名。
5. category 不重複當 tag：不要用 `tech`、`ai`、`learning` 這種只重複分類的 tag，除非跨分類時有明確辨識價值。
6. 核心主題在前：單篇文章 tags 以主要工具/概念/問題排序，不用按字母。
7. 刪除比改名更保守：太一般的 tag 先列成提案，不直接刪；可能影響 `/tags/<tag>` URL。

## 找問題

- **同義詞分裂**：`llm` vs `large-language-model`、`agent` vs `ai-agent`
- **太一般**：`tech`、`programming`、`coding`、`notes`
- **拼錯**：看只出現 1 次的 tag
- **應該有沒有**：抽樣 5-10 篇，確認核心主題有沒有進 tag

## 改名提案

產出表：

```markdown
| 動作 | 從 | 到 | 出現次數 | 影響檔案數 |
|---|---|---|---|---|
| rename | large-language-model | llm | 3 | 3 |
| delete | tech | (移除) | 12 | 12 |
| add | langgraph 到 X 篇 | - | - | 5 |
```

逐項確認後才動作。批次替換時只動 frontmatter `tags:`，不要改內文。

## 驗證

```bash
pnpm check:references
pnpm astro check
```

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 直接 sed 全換不問 | tag 是公開 URL，改錯可能 404 |
| 一個 commit 全部改 | 出問題不好 revert |
| 文中內文也一起 sed | tag 整理只該動 frontmatter |

## 詳細參考

- tag 命名規則：`../post/references/writing-guide.md` 與 `../post/references/frontmatter-schema.md`
