---
name: post-tone
description: Tone-layer review and rewrite for a post draft under src/content/posts/<category>/ — strip LLM writing tells (filler openers, forced parallelism, over-emphasis, fake balance, cheerleading endings) and move the draft toward the user's own voice, then produce a line-by-line 原句 → 建議 table. Proposes rewrites; only edits after the user says go. Complementary to `post-review` (structure/validators) and `post-verify` (facts). Use when user says 語氣怪 / 讀起來不像我 / 改語氣 / 這句換一下 / 調一下用詞 / tone / 太官腔 / 太像 AI 寫的 and references a draft or a specific passage.
---

# post-tone skill

發文前的第三關。`post-review` 看結構、`post-verify` 看事實、**`post-tone` 看「這讀起來像不像人寫的、像不像他寫的」**。

## ⚠️ 這個 skill 的判準不是「跟站上文章一致」

站上 `src/content/posts` 的中文文章**幾乎全部經 LLM 產出或改寫**（78% 的 posts commit 含 Claude co-author；沒被 AI 碰過的中文文章 0 篇；單月曾產出 194 篇）。

所以拿既有文章當語氣基準，等於**讓 AI 味自我複製**。查證細節與三層架構 → `references/voice-profile.md`。

實際判準是兩條：

1. **有沒有 AI 味** — 對照 `references/ai-tells.md`
2. **像不像他** — 對照 `voice-profile.md` 第三層「人聲樣本」

站上既有寫法只用來「認得出慣性」，不用來當通過理由。

## 何時用

| 情境 | 用 | 不用 |
|---|---|---|
| 「這段語氣怪，改一下」 | ✅ | |
| 「太像 AI 寫的」 | ✅ | |
| 「讀起來不像我」 | ✅ | |
| 「這句換個說法」 | ✅ | |
| 「幫我檢查格式跟 tag」 | | ❌ → `post-review` |
| 「這個版本號對嗎」 | | ❌ → `post-verify` |
| 「幫我寫一篇新的」 | | ❌ → `post` |

## 執行步驟

### 1. 定位範圍

整篇、一段、或只有一句。**不要自動擴大範圍**——他說「這段」就只處理那段，其他地方即使覺得怪也只在報告最後列出來問。

### 2. 掃 AI 味

逐項比對 `references/ai-tells.md` 的 A~H 項。命中就記下位置與命中項目。

特別注意 D 項的例外：**事實不確定時該 hedge 就 hedge，那是誠實不是 AI 味。** 要刪的是「沒有不確定卻硬要兩面說」。

### 3. 對照人聲樣本

翻 `voice-profile.md` 第三層。重點是 **3.1 詞彙指紋**與 **3.2 句法指紋**：

- 「自己」是否該取代「我」（降低斷言強度，保持觀察者位置）
- 有沒有機會用「蠻／好／超／大推」而不是「非常／極為」
- 長句該串接還是切短？他的習慣是**逗號串接、句號少**
- 三項並列是**遞進加碼**還是為了對稱湊數？
- 有沒有做到「觀察 → 暫定解方 → 自己指出限制」

再問三個問題：

- 這件事他自己會怎麼講？對話裡有沒有現成的講法？
- 這個寫法在 3.7「他否決過的清單」裡嗎？
- 這是 3.4 的 register 標記嗎？（驚嘆號、emoji、招呼語在社群可以，在文章不行，**不要跨平台照搬**）

**如果他在對話中已經講過這件事，直接用他的原話。** 那比任何改寫都更像他。這是本 skill 最高優先的規則。

### 4. 遇到「不確定是他的偏好還是模型慣性」就問

`voice-profile.md` 第二層有 ⚠️ 待裁決清單。這些**無法從部落格語料判斷歸屬**，因為語料本身是 AI 產的。

已用真人樣本結案的兩項，直接當 AI 味處理，不用再問：

- **破折號 `——`** — 部落格每篇 5.3 次，真人樣本 **0 次**
- **「不是 A，而是 B」** — 部落格 288 次，真人樣本 **0 次**

其餘 ⚠️ 項目（粗體密度、「值得注意」等）遇到時**問他，不要自己決定**。他裁決過的，寫進第一層或第三層並註明日期。

### 4.5 語料不足時去補

第三層樣本少是這個 skill 目前最大的限制。要補就去一手來源抓（見 `voice-profile.md` 3.0，附各平台可用工具）：

- Threads 可讀，是目前主要語料來源
- IG 只拿得到 bio，貼文鎖登入
- Firecrawl 不支援 Meta 系網站，要用 `tavily_extract`

**不要拿站上文章來補。** 那是汙染源。

### 5. 產出對照表

**只提建議，不動檔案。**

```markdown
| 位置 | 原句 | 建議 | 命中 |
|---|---|---|---|
| L23 | 總之，這個工具值得一試！ | 這個工具的取捨很清楚：X 換 Y。 | A 填充語 / E 喊話結尾 / F 驚嘆號 |
```

「命中」欄要指到 `ai-tells.md` 的具體項目，不要寫「比較通順」這種無法反駁的理由。

### 6. 給選項而不是給答案

語氣是主觀的。同一句至少給 **2 個方向**（例如「更直白」vs「保留距離」），讓他選。只有明確命中 ai-tells 的硬項目（驚嘆號、emoji 裝飾、「總之」）才給單一建議。

### 7. 他點頭後才改，並回填樣本

得到明確同意再動檔案。改完：

```bash
pnpm verify
```

然後做兩件常被跳過的事：

1. **同步英文版** — 語氣是雙語的。英文對應的 AI 味見 `ai-tells.md` H 項。
2. **回填人聲樣本** — 把他這次採用的講法、否決的寫法，補進 `voice-profile.md` 第三層，附日期。**這是這個 skill 唯一會變準的機制**，跳過它就永遠停在今天的準度。

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 「站上文章都這樣寫，所以沒問題」 | 站上文章 100% 經 AI 產出。這是 AI 味的來源，不是基準 |
| 「順手把整篇語氣都調一遍」 | 他只說某段。擅自改已定稿段落＝未確認就 revert 他的字 |
| 「憑感覺說這句怪」 | 要指到 ai-tells 的具體項目，否則只是用我的品味蓋掉他的 |
| 「給一個最佳解就好」 | 語氣沒有最佳解。給選項讓他選 |
| 「破折號太多，直接砍」 | 那在 ⚠️ 待裁決清單裡，歸屬未知，要問 |
| 「他的口語太隨便，我幫他潤過再用」 | 他的原話是最準的語料。潤過就不是他了 |
| 「改完不用回填樣本」 | 不回填，這個 skill 永遠不會變準 |
| 「中文改完就好」 | 英文版是對譯不是摘要，語氣不同步等於兩篇文章 |

## 跟其他 skill 的關係

- **post → post-tone**：新文寫完，語氣自審
- **post-review / post-verify / post-tone**：結構 / 事實 / 語氣三關互補，可各自獨立跑
- **post-update → post-tone**：改舊文後確認語氣沒跟原文斷裂

## 詳細參考

- AI 味清單：`references/ai-tells.md`
- 語氣輪廓與語料汙染說明：`references/voice-profile.md`
- 寫作風格總則（使用者親筆）：`../post/references/writing-guide.md`
