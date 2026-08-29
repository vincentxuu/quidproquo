---
name: writing-phrase-ledger
description: 記錄 quidproquo 寫作中被使用者指出不自然、太 AI、太翻譯腔或不像台灣中文的語句與句型，並在後續潤稿前掃描避免重複使用。當使用者說「這句怪」「台灣不這樣講」「又出現這種句型」「收錄起來」「避免再次使用」時觸發。
---

# writing-phrase-ledger skill

這支 skill 的工作是維護「語句用詞 ledger」。它不負責事實查證，也不負責完整改稿；它負責把每次被指出的語氣問題變成可重複檢查的紀錄。

## 使用時機

- 使用者指出某句「不像台灣中文」「很 AI」「太模板」「太翻譯腔」。
- 修改文章後，發現同一類句型反覆回流。
- 開始 zh-TW 文章潤稿前，需要先看本站已知禁忌與高風險句型。

## 必讀資料

- `references/ledger.md`：已收錄的語句、問題原因、替代結構。

## 工作流程

### 1. 判斷是不是要收錄

只有符合以下任一條才收：

- 使用者明確指出這句不自然。
- 同一篇文章中同一個句型出現多次，造成模板感。
- 詞本身沒有錯，但在台灣文章裡讀起來像翻譯或行政腔。
- 這次已經實際改掉，且未來很可能回流。

不要收：

- 單純錯字。
- 專有名詞、引用原文、法規或官方文件逐字。
- 只有當篇脈絡才成立的個別偏好。

### 2. 更新 ledger

在 `references/ledger.md` 新增一筆，欄位要有：

- 日期
- 原句或句型
- 問題類型
- 為什麼不自然
- 建議替代
- 來源檔案或情境

若是句型問題，記句型；若是用詞問題，記詞與常見錯搭配。

### 3. 掃描目標文章

```bash
bash .agents/skills/writing-phrase-ledger/scripts/scan-ledger.sh src/content/posts/<category>/<file>.md
```

命中不等於一定要改。先看語意：

- 引用、專有名詞、官方名稱：通常保留。
- 同篇出現 1 次且有反直覺力道：可保留。
- 同篇出現多次，或出現在標題、開頭、結尾：優先改。

### 4. 改寫原則

不要做同義詞替換。用結構替代：

- 模板化轉折 → 改成具體場景。
- 抽象詞 → 改成台灣讀者實際查的資料、碰到的制度或要做的決策。
- 「值得看，是因為」 → 改成事件或產品邊界本身。
- 「不是 A，而是 B」 → 改成「真正卡住的是 B」或直接寫 B 的證據。

### 5. 驗證

改完至少跑：

```bash
bash .agents/skills/writing-phrase-ledger/scripts/scan-ledger.sh <post.md>
bash .agents/skills/post-polish/scripts/register-scan.sh <post.md>
pnpm check:tw <post.md>
```

涉及 skill 修改時再跑：

```bash
pnpm skills:sync
pnpm verify
```
