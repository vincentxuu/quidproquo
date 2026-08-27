---
name: source-eval
description: Evaluate source credibility and bias in a post draft — apply SIFT lateral reading to each reference, flag affiliate links / single-source dependency / missing drawbacks / undisclosed interests, and check whether the article helps readers judge for themselves. Does NOT modify the file. Use when user says 查來源 / 來源可不可靠 / 有沒有業配 / source check / bias check / credibility check, or when writing recommendation / comparison / review articles. Complementary to post-verify (facts) and post-review (style).
---

# source-eval skill

文章裡寫的數字可能是對的，但來源本身不可靠——這層問題 `post-verify` 抓不到。這個 skill 用資訊素養研究的框架來審查「你的來源值不值得信」以及「你的文章有沒有幫讀者自己判斷」。

只報告，**不動文**。

## 何時用 vs 跟其他 skill 區分

| 問題 | 用哪個 skill |
|---|---|
| 「GPT-4 定價寫錯了」 | `post-verify`（事實層） |
| 「標題太弱、tags 分裂」 | `post-review`（品質層） |
| 「這篇推薦文的來源全是官方行銷頁，沒有獨立評價」 | **`source-eval`**（可信度層） |
| 「文章推薦七個平台但沒提任何缺點」 | **`source-eval`** |
| 「參考資料裡有推薦連結」 | **`source-eval`** |

## 理論基礎

這個 skill 的檢查項來自三個有同儕審查或大學圖書館廣泛採用的框架：

1. **側向閱讀與 SIFT**（Stanford 的 Sam Wineburg 團隊；Mike Caulfield 的操作化版本）：專業事實查核員不深讀原文來判斷可信度，而是離開原文去交叉比對。SIFT = Stop → Investigate the source → Find better coverage → Trace claims to origin。
2. **說服知識模型**（Friestad & Wright, 1994；2023 年 Amazeen 等人在原生廣告辨識的實證更新）：人一旦識別出內容是廣告，就會啟動批判性處理。skill 的工作是幫你識別那些訊號。
3. **消費者評論真偽判斷的五類線索**（2023 系統性文獻回顧）：感知、情感、細節、相關性、認知。其中「細節線索」最有鑑別力——具體描述比籠統讚美更容易被驗證為真或假。

## 執行步驟

### 1. 定位草稿

使用者指定的路徑或 slug。多個候選 → 列出讓使用者挑。

### 2. 判斷文章類型與審查強度

| 文章類型 | 審查強度 | 理由 |
|---|---|---|
| 推薦文、比較文、「N 個值得用的 X」 | **完整審查**（步驟 3–7 全跑） | 最高利益衝突風險 |
| 工具介紹、deep-dive | 標準審查（步驟 3–6） | 中等風險 |
| debug 記錄、個人經驗 | 輕量審查（步驟 3–4） | 低風險，來源多為自身經驗 |

### 3. 來源層：對每個參考來源做 SIFT

逐條掃參考資料段落和正文中的 inline link，對每個來源回答四個問題：

| SIFT 步驟 | 要回答的問題 | 怎麼查 |
|---|---|---|
| **Investigate** | 這個來源是誰？跟被推薦的對象有沒有利害關係？ | 看 URL 的 domain——是官方網站、獨立媒體、還是內容農場？官方頁面是一手但有利益；獨立測評更可信但可能有推薦連結 |
| **Find** | 同一個宣稱有沒有獨立來源也這樣說？ | 搜尋該宣稱的關鍵數字，看是只有官方自己說，還是有第三方驗證 |
| **Trace** | 數字的原始出處是哪裡？ | 追蹤鏈條：文章 → 引用來源 → 來源的來源。常見問題：多家二手媒體引用同一篇，看起來是三個來源，其實是一個 |

每條來源給標籤：

| 標籤 | 含義 |
|---|---|
| 🟢 獨立 | 來源與被推薦對象無利害關係（獨立媒體、學術研究、第三方測評） |
| 🟡 官方 | 來源是被推薦對象自己的官網或行銷材料（事實可能正確，但不會自曝弱點） |
| 🟠 有利害關係 | 來源含推薦連結、是合作夥伴、或寫過業配（不代表不可信，但讀者應知情） |
| 🔴 不透明 | 來源無法判斷是誰寫的、為什麼寫、有沒有收費 |

### 4. 連結層：掃描推薦連結與追蹤參數

掃文章中所有超連結的 URL：

```bash
grep -oP 'https?://[^\s\)]+' <post.md> | sort -u
```

檢查：
- [ ] 有沒有 `?ref=`、`?via=`、`?aff=`、`?tag=`、`utm_` 等追蹤參數
- [ ] 有沒有經過短網址（`bit.ly`、`t.co`、`amzn.to`）——這些常包裹推薦連結
- [ ] 連結是否直接指向官網首頁，還是指向特定的註冊/購買頁面（後者是推薦漏斗的訊號）

有追蹤參數不代表文章不可信，但**必須在文中揭露**。

### 5. 內容層：用細節線索檢查文章本身

對文章中每一個「推薦」或「評價」，檢查五個細節指標：

| 指標 | 通過 | 不通過 |
|---|---|---|
| **有缺點嗎** | 明確提到至少一個限制或不適合的場景 | 只有優點，零缺點 |
| **有比較嗎** | 跟至少一個替代方案做過取捨比較 | 孤立推薦，不提替代品 |
| **有具體數字嗎** | 引用可驗證的數字（價格、使用者數、通過率） | 只有形容詞（「很多」「很好」「很快」） |
| **數字有歸屬嗎** | 寫「X 官方宣稱有 20 萬筆職缺」 | 直接寫「有 20 萬筆職缺」（讀者無法區分是誰說的） |
| **有體驗細節嗎** | 具體使用場景或結果（「投了 23 個、面試 4 個」） | 泛泛而談（「用起來不錯」） |

計分：5 項全通過 = 高可信度段落；3–4 項 = 中等；≤ 2 項 = 低，標記為需要補強。

### 6. 透明度層：文章有沒有幫讀者自己判斷

- [ ] **利益揭露**：文章有沒有聲明自己跟被推薦對象的關係（有/無推薦連結、有/無收費、有/無免費帳號）
- [ ] **資訊來源揭露**：有沒有說明文章的資訊從哪來（個人使用體驗 vs 官網公開資訊 vs 第三方測評）
- [ ] **限制聲明**：有沒有標明文章覆蓋不到的範圍（「本文未實測」「價格以查詢時為準」）
- [ ] **數字歸屬**：文中引用的平台數據，有沒有標明是「平台宣稱」而非作者驗證

### 7. 結構偏差：推薦文特有的問題

只對推薦/比較類文章檢查：

- [ ] **覆蓋偏差**：是不是只推薦了一種類型的方案？（例如只推薦付費平台、只推薦美國平台）
- [ ] **排序偏差**：排在前面的是不是恰好是有推薦連結的那幾個？
- [ ] **資訊密度偏差**：某些推薦寫得很詳細，某些只有兩句帶過？（可能暗示作者只熟悉其中幾個）
- [ ] **時效偏差**：價格、功能、數據是什麼時候查的？有沒有標日期？

## 報告格式

```
source-eval report: <slug>
─────────────────────────

📊 來源組成
- 🟢 獨立來源：X 個
- 🟡 官方來源：Y 個
- 🟠 有利害關係：Z 個
- 🔴 不透明：W 個

🔴 必修（影響可信度）
1. 連結 https://xxx.com/?ref=abc123 含推薦連結但文中未揭露
2. 七個平台的資訊全部來自官方網站，沒有任何獨立來源交叉驗證
3. ...

🟡 建議修（提升透明度）
1. 「有 20 萬筆職缺」缺乏歸屬——建議改為「FlexJobs 宣稱有近 20 萬筆」
2. Toptal 段落零缺點，建議至少補一個限制
3. ...

🟢 做得好（讀者能自己判斷）
1. 文末有利益揭露聲明
2. 每個平台都有「注意」段落提醒缺點
3. ...
```

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 「來源是官方網站，一定可靠」 | 官方是一手但有利益——價格和功能通常正確，但不會自曝弱點。推薦文的可信度需要至少一些獨立來源 |
| 「沒有推薦連結就不需要揭露」 | 沒有推薦連結也應該主動聲明，讓讀者不用自己猜 |
| 「缺點以後再補」 | 零缺點的推薦文是可信度最大的紅旗。讀者看到「沒有缺點」不會覺得這個東西完美，會覺得你在推銷 |
| 「post-verify 會查事實，source-eval 多餘」 | post-verify 查「數字對不對」；source-eval 查「數字的來源可不可信」和「文章有沒有幫讀者判斷」。一個數字可以是正確的但來自有偏見的來源 |
| 「每個推薦都加比較太累」 | 不需要每個都跟所有替代品比。但如果一篇文章推薦了七個平台而完全不說「什麼情況下不要用」，這篇文章就不是在幫讀者選擇，是在條列推銷 |
| 「學術引用太學究了，文章是寫給一般人的」 | skill 的框架來自學術研究，但報告輸出是實用的。讀者不需要知道什麼是 SIFT，但作者需要用 SIFT 的邏輯去檢查自己的來源 |
| 「文章已經通過 post-review 和 post-verify 了」 | 三個 skill 查不同層。post-review 看結構風格，post-verify 看事實正確，source-eval 看來源可信度與透明度。全綠 ≠ 可信 |

## 跟既有 skill 的關係

```
   post (新文)              post-update (改舊文)
        │                          │
        ▼                          ▼
  ┌─────────────────────────────────────┐
  │ post-review   post-verify   source-eval │
  │ (結構風格)    (事實正確)    (來源可信度)  │
  └─────────────────────────────────────┘
                    │
                    ▼
               使用者決定要修哪些
                    │
                    ▼
              post-update 動手改
```

三個 skill 可以同時跑（不衝突），報告分開閱讀。

## 參考文獻

- Wineburg, S. & McGrew, S. (2017). Lateral Reading: Reading Less and Learning More When Evaluating Digital Information. Stanford History Education Group Working Paper.
- Caulfield, M. (2019). SIFT (The Four Moves). https://hapgood.us/2019/06/19/sift-the-four-moves/
- Friestad, M. & Wright, P. (1994). The Persuasion Knowledge Model: How People Cope with Persuasion Attempts. Journal of Consumer Research, 21(1), 1–31.
- Amazeen, M. A. et al. (2023). Disclosure-Driven Recognition of Native Advertising: A Test of Two Competing Mechanisms. Journal of Interactive Advertising, 23(2).
- Koch, T. et al. (2023). A systematic literature review about the consumers' side of fake review detection – Which cues do consumers use to determine the veracity of online user reviews? Electronic Markets, 33(1).
