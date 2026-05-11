# 多語言翻譯 Pipeline

目標：把中文原文轉成可發布的英文版，不是逐字翻譯，而是可讀、自然、保留技術準確度。

## Pipeline

1. `Translator`
   - 任務：先做完整技術翻譯
   - 重點：保留術語、產品名、版本號、程式碼、連結
   - 輸出：英文初稿 + 術語表 + 不確定處

2. `Cultural Reviewer`
   - 任務：把中文語境轉成英文讀者能直接吸收的說法
   - 重點：口氣、段落節奏、舉例是否需要換說法
   - 輸出：修訂稿 + 改寫理由

3. `Native Checker`
   - 任務：做最後語感與出版檢查
   - 重點：自然度、語法、標題是否像英文文章、是否還有中式英文
   - 輸出：最終稿 + 發布前檢查清單

## Prompt 模板

- `.github/prompts/translation-translator.prompt.md`
- `.github/prompts/translation-cultural-reviewer.prompt.md`
- `.github/prompts/translation-native-checker.prompt.md`

## 檔案規則

- 中文原文照原本路徑
- 英文版另外建立一篇 `.md`
- frontmatter 至少要改這些欄位：
  - `title`
  - `lang: en`
  - `description`
  - `tldr`
  - `tags` 視情況保留或換成英文語意更準的寫法

## Hand-off 格式

每一階段都要把下面這段一起傳下去：

```md
## Source
- path:
- title:
- category:
- audience:

## Constraints
- Keep all code blocks unchanged unless a comment needs translation.
- Preserve product names, API names, versions, and error messages.
- Do not invent references or claims not in the source article.

## Open Questions
- ...
```

## 發布前檢查

- Frontmatter 完整
- 內部連結仍可用
- 程式碼區塊沒有被誤翻
- 錯誤訊息、CLI 指令、API 欄位名稱保持原文
- `pnpm check:references` 通過

## 建議用法

如果是用多 agent 工具鏈，直接照這個順序：

```text
Translator -> Cultural Reviewer -> Native Checker
```

不要讓三個角色同時各自重翻，這會讓用字和術語漂掉。
