# Creator platform migration 中英稿交叉審稿

審稿日期：2026-09-17
範圍：

- `src/content/posts/product/2026-09-17-creator-platform-migration-assets.md`
- `src/content/posts/product/2026-09-17-creator-platform-migration-assets-en.md`

方法：依 `post-review` 與 `post-verify` 檢查中英一致、官方來源與推論邊界、ELI5、圖表、系列 metadata。公開頁面以 Groundlane `web_fetch` 重新讀取官方全文；沒有使用 fallback。

## 結論

主架構成立，ELI5「夜市搬店」直觀，六層表格也比逐平台列功能更能幫助選型。Patreon 與 Vocus 的限制寫得克制，Ghost 自有 Stripe 的事實與推論亦有分界。

發佈前仍有 **2 項必修**：Substack 付款搬遷流程寫反且少了讀者重新訂閱；Medium 現行文件已明說新 email subscriber 的地址不再提供給作者，文章卻用舊式搬遷路徑呈現 email 可攜性。另有 series order 0–5 尚未出現在 worktree，需由整合者確認。

## 必修

### 1. Substack billing 流程的順序與摩擦寫錯

位置：中文 71 行、英文 71 行。

文章目前寫：

- 中文：「先用 complimentary access 或 trial 維持權限，再設定 Stripe」
- 英文：「using complimentary access or trials ... before configuring Stripe」

但 [Substack 官方搬入指南](https://support.substack.com/hc/en-us/articles/34558456517396-How-do-I-move-from-my-current-platform-to-Substack) 的順序是：

1. 在 Substack 建立／連接新的 Stripe account。
2. 匯入會員。
3. 依既有到期日給付費會員 comp。
4. 通知會員；comp 到期前，會員要按 Subscribe，付款資料才會存入新的 Stripe account。

因此這不只是「名單與扣款是兩個專案」的抽象提醒。官方流程本身顯示，舊平台 payment credential 並未隨 CSV 自動接續，讀者需要重新訂閱。建議中英同步改成「先設定新的 Stripe，再以 comp 銜接權限；讀者仍須重新訂閱，付款資料才會進入新帳戶」。

Verdict：🔴 Contradicted／material omission。

### 2. Medium email 可攜性漏掉現行官方限制

位置：中文／英文 61–65 行。

[Medium 現行 Email notifications 文件](https://help.medium.com/hc/en-us/articles/360059837393-Email-notifications) 明確註記：讀者新訂閱作者文章通知時，email address 已不再分享給作者；作者只能繼續匯出既有 email list。原文使用的舊 URL 目前也會重新導向這一頁。

文章雖然泛稱 follower 可能沒有 email，卻在下一段用 Ghost 的 Medium migrator 說明「另匯入 Audience stats 訂閱者名單」，容易讓讀者以為現行 Medium subscriber 都能匯出 email。Ghost 的搬遷說明只能證明 migrator 接受一份可取得的 subscriber export，不能推翻 Medium 對新訂閱者的限制。

建議明寫時間與範圍：「Medium 目前不再把新 email subscriber 的地址分享給作者；只能匯出既有名單。因此 follower、email notification subscriber 與可攜 email list 更不能畫上等號。」中英稿應同步。

Verdict：🔵 Misframed／outdated boundary。

## 整合前必確認

### Series metadata 目前只有 order 6

兩稿 metadata 中英互相一致：

- 中文：`誰掌握創作者與讀者的關係`，`order: 6`
- 英文：`Who Controls the Creator-Reader Relationship`，`order: 6`

但目前 repo 搜尋只找到這一對文章使用這兩個 series name，order 0–5 尚未出現在 worktree。`check:series-order` 不把缺號當 blocking，因此指令雖通過，網站仍會呈現只有第 6 篇的新系列。若其他稿件由平行工作補入，整合後再驗即可；否則應確認 series 名稱或 order 是否應沿用既有 creator 系列。

## 建議修

### 1. 付款驗收動作要避免暗示直接拿真會員測試

表格寫「小批續扣與退款測試」／`Test a small renewal and refund cohort`，實務上可能造成真實扣款、退款費用、通知或帳務副作用。若平台提供 sandbox／test mode，應優先使用；需要 production 驗證時，應寫成自有測試會員或經明確同意的小額流程，並先確認稅務與退款紀錄。這是行動安全問題，不是來源真假問題。

### 2. Ghost 推論合理，但應保持現在的限定語氣

[Ghost 官方文件](https://ghost.org/help/are-there-really-no-transaction-fees/) 支持兩項事實：Ghost site 直接連到 publisher 自己的 Stripe account；Ghost 不另收 transaction fee，仍有 Stripe processing fee。文章進一步寫「付款關係比較接近創作者自己的基礎設施」是合理推論，而且已用「比較接近」降級，沒有寫成完全可攜或零成本，建議保留這個邊界。

不建議把「自己的 Stripe」再放大成「訂閱 token 一定能搬到任何新平台」；後者還取決於 Stripe account、目標系統與 migration support。

### 3. Patreon 與 Vocus 的界線正確

- [Patreon Relationship Manager](https://support.patreon.com/hc/en-us/articles/360045516212-How-to-use-your-Relationship-manager) 支持 CSV／會員欄位管理，也明寫 fan 可選擇不向 creator 分享 email。文章沒有把「可匯出會員」誇大成「每位 patron 都有可攜 email」，合格。
- [Vocus 官方說明](https://vocus.cc/help_center/TnC9HOz4dEujYDlmdPTg) 只支持訂單資料明細可匯出 CSV，用途是訂單與回饋品管理。文章明確說不能由此推導 follower、文章與扣款關係都能搬走，證據邊界正確。

### 4. 參考資料覆蓋可以更精準

正文 inline links 整體充足，但文末 References 少列正文已使用的三頁：Medium email notifications、Ghost Medium migration、Ghost no transaction fees。反過來，References 列了 Ghost import members，正文實際連的是 no-transaction-fees。建議讓文末清單與正文證據一一對齊。

`check:references` 也對中文稿給出「標題／主要段落與參考資料關鍵詞重疊不足」warning；雖不是 blocking error，補齊上述頁面會讓來源覆蓋更清楚。

### 5. 台灣讀者位置可以再多一個選型問題

文章採用夜市比喻，中文自然，`check:tw` 為 0 blocking／0 review。不過主題與台灣創作者直接相關，正文尚未提醒「台灣收款、發票／稅務、跨境 Stripe 可用性要依創作者實體與當時政策另查」。不宜在本文下法律結論，但可把它列為搬遷前必問問題，避免讀者把 Ghost／Substack 的 Stripe 文件直接當成台灣適用性保證。

## 中英 parity、ELI5 與視覺檢查

### 中英 parity

- Frontmatter、標題承諾、六層框架、表格、兩張 Mermaid、平台案例與結論均一致。
- `check:lang-parity`：通過。
- 唯一共同的實質問題是 Substack 順序，並非翻譯落差；兩語都需一起修。

### ELI5

開頭「夜市攤位搬到自己的店面」有效對應：桌椅＝內容、熟客通訊錄＝email、付款方式＝billing、位置與人潮＝推薦流量。讀者在前三段就能理解「export 不等於整門生意搬完」，合格。

### Mermaid 與表格

1. 第一張 Mermaid 將六層資產拆開，能防止讀者把 CSV 當完整可攜性，資訊價值高。
2. 第二張 Mermaid 是可重現演習流程，不只是裝飾；但節點 `文章、會員、網址都通過？` 少了 email consent 與 billing，與本文六層框架相比稍微縮窄。可考慮改成「內容、受眾、權限、入口都通過？」；平台 discovery 本來就無法用匯入測試恢復，可留在缺口紀錄。
3. 表格把每一層配上 acceptance test，是全文最實用的工具。除付款測試的安全措辭外，其餘欄位都有明確驗收作用。

## 機械檢查

- `git diff --check`：通過。
- `pnpm check:tw <zh>`：0 blocking、0 review。
- `pnpm check:links <zh>`：10 個外部連結無 broken；Medium 與 Substack 回 403、工具列為人工確認，但本次已另用 Groundlane 成功讀到兩頁官方全文。
- `pnpm check:references`：0 errors；全庫 72 warnings，其中本篇 1 個 coverage warning。
- `pnpm lint`：0 warnings、0 errors。
- `check:series-order`：無 blocking，但本系列目前只有 order 6，見前述整合提醒。
- `check:lang-parity`：通過。

## 查證範圍聲明

本次核對文章已提出的主要平台可攜性宣告與推論邊界，重點為 Substack billing、Medium／Patreon email、Vocus CSV、Ghost Stripe 與 Beehiiv export；未以真實帳號執行匯出、扣款或跨平台遷移，也未評估各平台所有合約、稅務與地區限制。
