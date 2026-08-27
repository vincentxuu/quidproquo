# Research: Linkup、AgentQL、AutoScraper 免費額度

## 子問題

1. 免費額度是否按月重置，未使用額度是否累積？
2. 超過免費額度後會停用，還是進入按量計費？
3. 免費試用與長期免費方案是否為同一件事？
4. 是否需要付款方式，公開文件有沒有寫清楚？

## 來源清單

- [Linkup Pricing](https://docs.linkup.so/pages/documentation/platform/pricing) — 官方；訪問日：2026-08-21
- [Linkup credit balance API](https://docs.linkup.so/pages/documentation/endpoints/account/balance) — 官方；訪問日：2026-08-21
- [AgentQL Pricing](https://www.agentql.com/pricing) — 官方；訪問日：2026-08-21
- [AgentQL pricing update](https://www.agentql.com/blog/2024-pricing-update) — 官方；訪問日：2026-08-21
- [AgentQL Terms of Service](https://www.agentql.com/legal/terms-of-service) — 官方；訪問日：2026-08-21
- [AutoScraper GitHub repository](https://github.com/alirezamika/autoscraper) — 官方原始碼庫；訪問日：2026-08-21

## 讀取完整度盤點

| 來源 | 讀到什麼程度 | 阻礙 |
|---|---|---|
| Linkup Pricing | ✅ 完整定價頁 | 無；但頁面沒有定義 `eligible accounts` |
| Linkup credit balance API | ✅ 完整文件頁 | 無 |
| AgentQL Pricing | ✅ 完整定價頁 | tooltip 內容與登入後 Billing UI 無法從公開頁取得 |
| AgentQL pricing update | ✅ 完整官方公告 | 公告未說明 Starter 綁卡與超額處理流程 |
| AgentQL Terms of Service | ✅ 完整條款頁 | 實際 Subscription Terms 只在購買／註冊流程呈現 |
| AutoScraper GitHub repository | ✅ README、授權與安裝方式 | 無 |

## 事實交叉表

| 事實 | 來源 1 | 來源 2 | 驗證狀態 |
|---|---|---|---|
| Linkup 以 professional email 註冊時自動取得 $20；eligible accounts 每月補回 $20 | Linkup Pricing | Linkup balance API 證實帳戶採 credit balance，但未補充 eligibility | ✅ 金額與補回方式；⚠️ eligibility 未公開定義 |
| Linkup 是預付餘額；用完後回傳 HTTP 429，不會直接形成超額帳單 | Linkup Pricing | Linkup balance API | ✅ |
| Linkup 成功請求才扣款，錯誤不扣 credit | Linkup Pricing | 無第二份獨立官方說明 | ✅ 一手來源 |
| AgentQL Starter 為 $0/月，含 50 API calls/month，之後標價 $0.02/call | AgentQL Pricing | AgentQL pricing update | ✅ |
| AgentQL 免費試用含 300 API calls、1 小時 remote browser，且不需信用卡 | AgentQL Pricing | AgentQL pricing update（證實 300 calls 與免信用卡） | ✅ |
| AgentQL Starter 列出 10 小時 remote browser included 與 $0.12/hr | AgentQL Pricing | 官網首頁重複同一方案文案 | ✅ 文案；⚠️ 未明寫 10 小時是否按月重置及何時開始收費 |
| AgentQL Starter 是否必須綁卡，以及沒有付款方式時超額請求會停用或累積帳款 | 公開定價頁未說明 | Terms 將細節交給註冊時的 Subscription Terms | ⚠️ unverified |
| AutoScraper 是可在本機安裝執行的 MIT 開源 Python library | AutoScraper repository README | repository LICENSE | ✅ |
| AutoScraper 沒有官方託管 API，因此沒有每月 API 額度或超額費率 | AutoScraper repository 結構與安裝／使用方式 | 無官方 SaaS 定價頁 | ✅ 對此專案本身成立 |

## 我的推論（與上表分開）

| 推論 | 依據 | 這個推論可能錯在哪 |
|---|---|---|
| Linkup 的「top up back to $20」代表餘額補至 $20，而非每月額外疊加 $20 | 官方用語 `back to $20`，且採單一 prepaid balance | 官方未公開免費與付費 credit 的內部到期／扣除順序 |
| AgentQL 的 300 calls 應視為試用額度，而不是每月額度 | 官方將 free trial 與 Starter 的 `/month` 額度分開列示 | 官方頁沒有公開試用期限與能否轉方案的完整規則 |
| AgentQL 的 10 小時 remote browser 很可能是每個 Starter 計費週期的 included usage | 它列在 `$0/monthly` Starter 方案內，Professional 也採同樣寫法 | 文案沒有直接寫 `/month`，不能當成已確認事實 |

## 草稿骨架

### 核心概念

三者不能只用「有沒有免費額度」比較：Linkup 是每月補回的預付 credit，AgentQL 同時有一次性試用與月度免費方案，AutoScraper 則是自己執行的開源 library。

### 關鍵設計決定

- Linkup：預付 credit，用完即 429，成本最容易封頂；但免費資格限 professional email 與未公開定義的 eligible accounts。
- AgentQL：Starter 允許超過 included usage 後按量計價，但公開頁沒有交代綁卡與無付款方式時的行為。
- AutoScraper：不收工具 API 費，把執行、代理與維護成本留給使用者。

### 跟替代方案的比較

- 要免費測搜尋 API：Linkup 的 $20 credit 可做較完整測試。
- 要測語意式網頁操作／抽取：AgentQL 的 trial 比 Starter 月額度寬裕，但兩者不能混寫。
- 要完全避免 SaaS 用量計費：AutoScraper 合適，但不處理瀏覽器、反爬與基礎設施成本。

### 適合 / 不適合的情境

- Linkup 適合可使用公司／組織信箱、希望預付封頂的搜尋工作流。
- AgentQL 適合少量抽取與瀏覽器自動化原型；正式長跑前應在登入後 Billing UI 確認超額控制。
- AutoScraper 適合靜態 HTML、結構重複且願意自己維護規則的網站。

### 限制 / 已知問題

- Linkup 未公開 `eligible accounts` 的完整資格與每月補額日期。
- AgentQL 未在公開文件說清楚 Starter 是否綁卡、remote browser included hours 是否明確按月重置、能否設定 spending cap。
- AutoScraper 沒有 SaaS 額度，也沒有 SaaS 代管能力；網站改版後規則可能要重建。

### 取捨總結

文章應將「免費試用」「每月免費額度」「開源免費」拆成三欄，不能都標成 free tier。

## 待解問題

- 登入 Linkup 後確認帳戶是否顯示下次 credit top-up 日期，以及 eligibility 說明。
- 登入 AgentQL Billing 後確認 Starter 是否要求付款方式、是否有 hard limit／spending cap、remote browser included hours 的重置週期。
