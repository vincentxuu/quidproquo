# post-review：每篇都跑的基本清單（步驟 3、5、7、8、8.5、9）

> 從 `SKILL.md` 原文搬出，內容未改。步驟編號與 `SKILL.md` 相同；本檔沒寫到的引導句、判準與連結留在 `SKILL.md` 同一步驟。

### 3. frontmatter 檢查

- [ ] 必填齊全：`title` / `date` / `category` / `tags` / `lang`
- [ ] `date` 格式為 `YYYY-MM-DD`
- [ ] `category` 在合法清單內
- [ ] `tags` 全小寫 kebab-case
- [ ] `tags` 數量 3-7（過多或過少都標）
- [ ] `lang` 是 `zh-TW` 或 `en`
- [ ] `tldr` 對 `tech` / `ai` / `deep-dive` 類有沒有填
- [ ] `description` 跟 `tldr` 內容是不是一樣（重複是 smell）
- [ ] `type` 跟內容性質是否一致（debug 文卻標 deep-dive 等）

### 5. tags 衛生

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

### 7. 標題與清單可讀性

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

### 8.5 inline source link 覆蓋（數據與引述）

- [ ] 每個外部數據（如「45% 的生成程式碼引入了 OWASP Top 10 漏洞」）在該句就有 inline link 指向來源
- [ ] 每個人物引言（如「Sal Khan 說...」）在人名或引言處有 inline link
- [ ] 每個公司行為描述（如「LinkedIn 結束 APM 計畫」）在該句就有 inline link
- [ ] 讀者不需要跳到文末參考資料去對照——所有引述在原位就能點

### 9. 寫作品質（風格層）

- [ ] 標題具體（不是「一些想法」「淺談 X」）
- [ ] 開頭直接，不客套
- [ ] 沒有「綜上所述」「眾所周知」這種廢字
- [ ] 程式碼塊有指定語言
- [ ] 表格 / ASCII 圖如果有比較多項，比文字描述更清楚
