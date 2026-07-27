---
name: post-tone
description: Tone-layer review and rewrite for a post draft under src/content/posts/<category>/ — measure the draft against this site's measured voice profile (person, connectives, emphasis density, opening/closing shape, banned filler), then produce a line-by-line 原句 → 建議 table. Proposes rewrites; only edits the file after the user says go. Complementary to `post-review` (structure/validators) and `post-verify` (facts). Use when user says 語氣怪 / 讀起來不像我 / 改語氣 / 這句換一下 / 調一下用詞 / tone / 太官腔 / 太像 AI 寫的 and references a draft or a specific passage.
---

# post-tone skill

發文前的第三關。`post-review` 看結構、`post-verify` 看事實、**`post-tone` 看「這讀起來像不像這個站寫的」**。

LLM 寫出來的中文有很穩定的壞味道：填充語（「總之」「值得一提的是」）、對稱排比、過度客氣的轉折、結尾喊話。這個 skill 抓的就是那些，並且用**站上 339 篇既有文章實測出來的語氣輪廓**當基準，不是用通用寫作建議。

完整語氣輪廓（含實測數據）→ `references/voice-profile.md`

## 何時用

| 情境 | 用 | 不用 |
|---|---|---|
| 「這段語氣怪，改一下」 | ✅ | |
| 「讀起來不像我寫的」 | ✅ | |
| 「太官腔／太像 AI」 | ✅ | |
| 「這句換個說法」 | ✅ | |
| 「幫我檢查格式跟 tag」 | | ❌ → `post-review` |
| 「這個版本號對嗎」 | | ❌ → `post-verify` |
| 「幫我寫一篇新的」 | | ❌ → `post` |

## 執行步驟

### 1. 定位範圍

使用者可能給整篇、給一段、或只給一句。**不要自動擴大範圍**——他說「這段」就只改那段，其他地方即使你覺得怪也只在報告最後列出來問。

### 2. 逐項量測

對照 `references/voice-profile.md` 的七個維度掃一遍。每個維度回報「符合 / 偏離」，偏離要指出**具體是哪一句**：

1. **人稱** — 對讀者說「你」，作者「我」節制，幾乎不用「我們」
2. **連接詞** — 口語詞優先（所以 > 因此），破折號 `——` 是主要轉折器
3. **句型** — 「不是 A，而是 B」是招牌；避免對稱排比堆疊
4. **強調密度** — 粗體標論點不標名詞，一段至多一處
5. **開場形狀** — 事件／反差／提問／明示範圍四選一，禁止背景鋪陳
6. **收尾形狀** — 收在取捨，不是摘要重複，不喊話
7. **禁用清單** — 填充語、驚嘆號、emoji 裝飾、業內行話

### 3. 產出對照表

**只提建議，不動檔案。** 格式：

```markdown
| 位置 | 原句 | 建議 | 理由 |
|---|---|---|---|
| L23 | 總之，這個工具值得一試！ | 這個工具的取捨很清楚：X 換 Y。 | 填充語 +驚嘆號 +喊話結尾，三項都違反 |
```

理由欄要指向 voice-profile 的具體條目，不要寫「比較通順」這種無法反駁的話。

### 4. 給選項而不是給答案

語氣是主觀的。同一句話至少給 **2 個方向**（例如「更直白」vs「保留一點距離」），讓使用者選。只有在明確違反禁用清單時（驚嘆號、emoji 裝飾、「總之」）才單一建議。

如果使用者的原話裡已經有他自己的說法（例如他在對話中講了「想說研究一下有什麼特別的」），**優先直接採用他的原話**，那比任何改寫都更像他。

### 5. 使用者點頭後才改

得到明確同意再動檔案。改完跑：

```bash
pnpm verify
```

中文版改了語氣，**英文版要同步**——語氣是雙語的，不是只有中文有。英文版對應的壞味道是 "Moreover," / "It's worth noting that" / "In conclusion" / 驚嘆號 / 過度 hedging。

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 「順手把整篇語氣都調一遍」 | 使用者只說某段。擅自改動已定稿的段落＝未確認就 revert 他的字 |
| 「憑感覺說這句怪」 | 語氣輪廓是實測出來的，要指到具體維度，否則只是用我的品味蓋掉他的 |
| 「給一個最佳解就好」 | 語氣沒有最佳解。給選項，讓他選 |
| 「中文改完就好，英文之後再說」 | 英文版是對譯不是摘要，語氣不同步等於兩篇文章 |
| 「改完不用跑 verify」 | 動到 posts 就是 Tier 1，要過閘門 |
| 「使用者講的口語太隨便，我幫他潤過」 | 他的原話是最準的語料。潤過就不是他了 |

## 跟其他 skill 的關係

- **post → post-tone**：新文寫完，語氣自審
- **post-review / post-verify / post-tone**：三關互補，結構 / 事實 / 語氣，可各自獨立跑
- **post-update → post-tone**：改舊文後確認語氣沒跟原文斷裂

## 詳細參考

- 語氣輪廓與實測數據：`references/voice-profile.md`
- 寫作風格總則：`../post/references/writing-guide.md`
