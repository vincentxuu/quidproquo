---
name: post-review
description: Self-review a Markdown post draft under src/content/posts/<category>/ before publishing — run validators (check:references / lint / astro check), score frontmatter / tldr / references coverage / tag hygiene against the writing guide, and return a structured issue list. Does NOT modify the file. Use when user says review 一下 / 審稿 / 發文前看一下 / 幫我檢查這篇 and references a draft post by path.
---

# post-review skill

發文前的最後一關。**只報告，不動文**——這個 skill 的價值就在於使用者可以決定要不要採納。

## 執行步驟

### 1. 定位草稿

使用者指定的路徑或關鍵字。多個候選 → 列出讓使用者挑。

### 2. 機械檢查（先跑命令）

```bash
pnpm check:references
pnpm lint
pnpm astro check
```

任何一項紅，先列在報告開頭，**這些是必修**。

### 3. frontmatter 檢查

對照 `../post/references/frontmatter-schema.md`：

- [ ] 必填齊全：`title` / `date` / `category` / `tags` / `lang`
- [ ] `date` 格式為 `YYYY-MM-DD`
- [ ] `category` 在合法清單內
- [ ] `tags` 全小寫 kebab-case
- [ ] `tags` 數量 3-7（過多或過少都標）
- [ ] `lang` 是 `zh-TW` 或 `en`
- [ ] `tldr` 對 `tech` / `ai` / `deep-dive` 類有沒有填
- [ ] `description` 跟 `tldr` 內容是不是一樣（重複是 smell）
- [ ] `type` 跟內容性質是否一致（debug 文卻標 deep-dive 等）

### 4. tldr / description 強度

| 弱 | 強 |
|---|---|
| 「介紹這個工具的特色」 | 「Skill 是一個資料夾、一份 SKILL.md。三層 progressive disclosure 讓 Claude 在需要時才載入細節」 |

檢查點：
- 有具體名詞、數字、版本嗎？
- 有點出「跟讀者切身相關的資訊」嗎？
- 是不是「這篇有多好」（弱）而不是「這篇講什麼」（強）

### 5. tags 衛生

跟同 category 既有 tag 比對：

```bash
grep -h "^tags:" src/content/posts/<category>/*.md | sort -u
```

找：
- 同義詞分裂（`llm` vs `large-language-model`、`agent` vs `ai-agent`）
- 過於一般（`tech`、`programming` — 不傳達資訊）
- 拼錯字
- 該有沒有的核心 tag（題目主軸沒進 tag）

Canonical 判斷跟 `tag-audit` 一致：
- 全小寫 kebab-case。
- 既有高頻 tag 優先，除非低頻 tag 明顯更符合官方名稱或更不易誤解。
- 通用縮寫如 `llm` / `rag` 可保留；不穩定縮寫不要新增。
- category 名稱不要重複當 tag，除非跨分類時有額外辨識價值。
- 核心主題排在 tags 前面，不要求字母排序。

### 6. 結構

按 `type` 對應預期：

- `debug`：情境 → 問題 → 嘗試 → 解法 → 原因 → 學到的事
- `deep-dive`：開頭段 → 多個展開段 → 整體架構（如有）→ 整體來說 → 參考資料
- `guide`：前置 → 步驟 → 預期輸出 → 常見錯誤
- `project`：問題 → 為什麼做 → 怎麼做 → 現況

缺主要段落 → 列。

### 7. 標題與清單可讀性

對照 Google-style 的可掃讀原則，檢查文章是否容易被人和模型穩定解析：

- [ ] heading 層級沒有跳級（例如 `##` 後直接 `####`）
- [ ] heading 具體，不用「介紹」「補充」「其他」「一些想法」這種空標
- [ ] heading 底下不是空段落，也不是只有一個孤立清單
- [ ] 清單前有引導句，讀者知道這串項目在回答什麼問題
- [ ] 同一個清單的項目語意平行，不混合步驟、原因、結論
- [ ] 超過 6 項且需要比較的清單，評估是否改成表格

### 8. 參考資料覆蓋

- [ ] `tech` / `ai` / `learning` / `education` / `policy` / `design` / `marketing` / `product` 類有沒有 `## 參考資料` 段
- [ ] 文中提到的每個工具 / 框架 / 論文 / 模型有沒有對應條目
- [ ] 每條連結是不是指向**該主題的官方頁**（不是某個泛用首頁）
- [ ] `lang: en` 的文章中，中文資源有沒有標 `(in Mandarin)`；`lang: zh-TW` 不需要

### 9. 寫作品質（風格層）

對照 `../post/references/writing-guide.md`：

- [ ] 標題具體（不是「一些想法」「淺談 X」）
- [ ] 開頭直接，不客套
- [ ] 沒有「綜上所述」「眾所周知」這種廢字
- [ ] 程式碼塊有指定語言
- [ ] 表格 / ASCII 圖如果有比較多項，比文字描述更清楚

### 10. 報告格式

把所有 issue 分成三層回報：

```
🔴 必修（影響發布）
- ...

🟡 建議修（影響可讀性 / 一致性）
- ...

🟢 可選（風格偏好）
- ...
```

每條 issue 帶：
- 位置（行號或段落名）
- 為什麼是 issue
- 建議怎麼改

**不要直接動文**。讓使用者選要採納哪些。

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 「直接幫他改下去」 | review 跟 update 是兩件事；這 skill 只報告，使用者要主動觸發 post-update 才動 |
| 「跑完命令沒紅就 OK」 | 機械檢查通過 ≠ 內容好；要讀內文做品質檢查 |
| 「不檢查 tag 分裂」 | 站內聚合靠 tag，這是長期負債 |
| 「tldr 弱算了不提」 | tldr 弱直接影響點擊率，是發文前最該修的 |

## 詳細參考

- 寫作風格：`../post/references/writing-guide.md`
- frontmatter schema：`../post/references/frontmatter-schema.md`
- 改文章流程：使用 `post-update` skill
