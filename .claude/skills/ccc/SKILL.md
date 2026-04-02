---
name: ccc
description: 抓取 Claude Code 最新 changelog 並摘要，快速了解近期更新
---

# ccc — Claude Code Changelog 摘要

用 WebFetch 抓取 Claude Code 官方 changelog，產出簡潔的中文摘要。

## 觸發方式

使用者輸入 `/ccc` 或說「Claude Code 更新了什麼」

## 執行步驟

1. **抓取 changelog 頁面**：使用 WebFetch 取得 https://docs.anthropic.com/en/docs/claude-code/changelog 的內容
2. **摘要最近更新**：
   - 列出最近 3～5 次版本更新
   - 每個版本包含：版本號、日期、重點功能（用繁體中文條列）
   - 標註特別值得注意的新功能或破壞性變更
3. **輸出格式**：

```
## Claude Code 近期更新

### <版本號> — <日期>
- 功能 1
- 功能 2
- ⚠️ 破壞性變更（如有）

### <版本號> — <日期>
- ...
```

## 注意事項

- 全部以繁體中文輸出
- 簡潔為主，每個功能一行
- 如果抓取失敗，告知使用者並建議手動查看連結
