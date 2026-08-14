---
name: post-review
description: Self-review a Markdown post draft under src/content/posts/<category>/ before publishing — run validators (check:references / lint / astro check), score frontmatter / tldr / references coverage / tag hygiene / heading-list readability against the writing guide, and return a structured issue list. Does NOT modify the file. Use when user says review 一下 / 審稿 / 發文前看一下 / 幫我檢查這篇 and references a draft post by path, slug, or title.
---

# post-review skill

發文前的最後一關。**只報告，不動文**——這個 skill 的價值就在於使用者可以決定要不要採納。

## 執行步驟

### 1. 定位草稿

使用者指定的路徑、slug 或關鍵字。多個候選 → 列出讓使用者挑，**不要自己選**。

### 2. 機械檢查（先跑命令）

```bash
pnpm check:references
pnpm check:tw-usage <post>
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

### 4.5 衍生內容的事實一致性（tldr / faq / glossary）

`tldr`、`faq`、frontmatter `glossary` 都是從正文改寫來的**衍生內容**，而且比正文更短、更斷言、更容易被搜尋引擎與 answer engine 整段抽走。它們也最常在最後一刻趕出來，是錯誤最容易溜進去的地方。

逐條檢查：

- [ ] 每個數字都跟正文一致（不是「差不多」——效果量、樣本數、百分比要逐字對）
- [ ] **數字帶著它的對照條件**：「效果量 0.51」不算，「相較重讀 +0.51」才算
- [ ] **歸屬正確**：衍生內容常把相鄰兩段的研究併成一句。檢查每個「某某研究發現 X」的 X 真的出自那一篇，不是隔壁段落的
- [ ] 強度沒有被放大：正文寫「傾向」「其中一項分析顯示」，摘要不能變成「證明」「最有效」
- [ ] 樣本數小、未同儕審查、預印本等限制，若正文有標，摘要不該悄悄拿掉
- [ ] `faq` 的答案可獨立閱讀（會被單獨引用），但**不得因此省略但書**

判斷原則：**改寫等於重新宣稱一次。** 有疑慮就回原始來源對，不是回正文對——正文的錯會被原封不動複製過來。

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

### 8.5 inline source link 覆蓋（數據與引述）

逐段掃文章正文，找出所有「引用外部事實」的句子——包含數字、百分比、研究結論、人物引言、公司行為描述——然後檢查：

- [ ] 每個外部數據（如「45% 的生成程式碼引入了 OWASP Top 10 漏洞」）在該句就有 inline link 指向來源
- [ ] 每個人物引言（如「Sal Khan 說...」）在人名或引言處有 inline link
- [ ] 每個公司行為描述（如「LinkedIn 結束 APM 計畫」）在該句就有 inline link
- [ ] 讀者不需要跳到文末參考資料去對照——所有引述在原位就能點

如果一段有數字或引述但沒有超連結，標為 🔴 必修。理由：讀者不會主動去文末參考資料對照，沒有 inline link 等於沒有來源。

### 9. 寫作品質（風格層）

對照 `../post/references/writing-guide.md`：

- [ ] 標題具體（不是「一些想法」「淺談 X」）
- [ ] 開頭直接，不客套
- [ ] 沒有「綜上所述」「眾所周知」這種廢字
- [ ] 程式碼塊有指定語言
- [ ] 表格 / ASCII 圖如果有比較多項，比文字描述更清楚

### 9.5 台灣用語（只查 `lang: zh-TW`）

繁體字不等於台灣用語——模型的中文語料以中國內容為大宗，中國詞彙與翻譯腔會自動流進來。先跑腳本，再逐句看翻譯腔：

```bash
pnpm check:tw-usage <post>
```

腳本輸出分兩組：「必須修」（中國用語，`pnpm verify` 會擋 commit → 一律 🔴）與「人工判讀」（`項目` / `天花板` / `鷹架` / `阻塞` / `對齊` / `卸載`，看語境決定 → 逐筆判斷）。

- [ ] 「必須修」那組清空，或該處確實是例外並加了 `<!-- tw-usage-ignore -->`
- [ ] 「人工判讀」那組每一筆都給出判斷（要改 / 可留 + 理由），不要整組跳過
- [ ] 翻譯腔五型逐句掃（腳本完全抓不到）：形容詞直譯（「很不性感」）、名詞化（「執法啟動」）、英文語序（「辯護每個選擇」）、術語硬譯（framing →「框架」多半該寫「說法」）、隱喻直譯（ceiling →「天花板」、ticket →「票」）
- [ ] 金額寫成「4,000 萬美元」而不是「$4,000 萬」
- [ ] 從英文材料翻寫的段落特別檢查——那是翻譯腔密度最高的地方

替換對照表在 `../post/references/writing-guide.md#台灣用語`。翻譯腔標 🟡 建議修，除非整段讀起來明顯不像中文母語者寫的（🔴）。

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
| 「tldr / faq 是從正文抄的，正文對就對」 | 改寫會併句、會丟掉對照條件、會把「其中一項分析」變成「研究證明」。這三種錯都只在衍生內容裡，正文檢查抓不到 |
| 「這段沒改過，跳過」 | 沒改過只代表沒被檢查過。review 是看現在的文章對不對，不是看這次改了什麼 |

## 詳細參考

- 寫作風格：`../post/references/writing-guide.md`
- frontmatter schema：`../post/references/frontmatter-schema.md`
- 改文章流程：使用 `post-update` skill
