---
title: "門市設備點檢怎麼用無程式碼工具做：同一段需求交給 Glide 和 Airtable Omni"
date: 2026-11-12
category: product
type: guide
tags: [low-code, glide, airtable, mobile, workflow-automation]
lang: zh-TW
tldr: "同一份點檢資料、同一段中文需求，分別交給 Glide 和 Airtable 的 Omni。兩邊都做出點檢、改善追蹤、合格率總覽三頁，數字都對；Airtable 多了結論卡與必填驗證提示，Glide 較快、手機版現成。兩邊也犯了同一個錯：同一天點檢兩次會被合併計算，根因在資料設計。"
description: "「無程式碼工具實戰」第 6 篇：巡檢與稽核類任務。以 3 個據點、8 個檢查項目的門市設備點檢為例，用相同資料與 prompt 對照 Glide 與 Airtable Omni 產出的 App，記錄實測結果、共同的錯誤與各自的限制。"
series:
  name: "無程式碼工具實戰"
  order: 6
draft: false
---

> 🌏 [English version](/posts/product/2026-11-12-no-code-inspection-glide-airtable-en)

門市每週要點檢冷藏櫃溫度、滅火器、逃生通道，常見做法是一張紙本表格掛在後場，主管巡店時翻一翻。紙本能記下「不合格」，但很難回答兩個問題：哪家店最近變差了？上次發現的問題修好了沒？

這是「無程式碼工具實戰」系列的第 6 篇，任務類型是**巡檢與稽核**，比較方法見[系列導讀](/posts/product/2026-11-12-no-code-tools-series-intro)。前兩篇都用 [Glide](https://www.glideapps.com/)（[活動報名](/posts/product/2026-11-12-no-code-event-signup-glide)、[器材借用](/posts/product/2026-11-12-no-code-equipment-loan-glide)），[第 3 篇](/posts/product/2026-11-12-no-code-approval-airtable-power-apps)用 [Airtable](https://www.airtable.com/) 手動拉出介面。這篇換個比法：**同一份資料、同一段中文需求**，交給 Glide 和 Airtable 的 AI 建置工具 [Omni](https://www.airtable.com/platform/app-building)，看兩邊做出什麼。

## 情境：誰在用、流程怎麼走

| 角色 | 要做的事 |
|---|---|
| 點檢人（店員或主管） | 在現場逐項勾合格或不合格，不合格要寫原因、拍照 |
| 區域主管 | 看哪家店合格率最低、比上次好還是壞 |
| 負責改善的人 | 看待改善清單，修好後標記 |

模擬資料：3 個據點、8 個檢查項目（溫控、消防、環境、用電各類），11/05 與 11/12 各點檢一次，共 48 筆紀錄。

| 據點 | 11/05 合格率 | 11/12 合格率 | 11/12 待改善 |
|---|---|---|---|
| A | 87.5% | 100% | — |
| B | 100% | 87.5% | 緊急照明 |
| C | 87.5% | 75% | 排水孔、逃生通道 |

這張表就是驗收標準：總覽頁要把 C 排在最前面，並顯示待改善 3 件。

## 做法

給兩邊的需求一字不差：

1. 點檢頁：選據點後列出 8 個檢查項目與合格標準，逐項勾合格或不合格，不合格要填備註，可拍照。
2. 改善追蹤頁：列出所有「待改善」的項目（據點、項目、發現日期、點檢人），可以標記為已改善。
3. 總覽頁：各據點最近一次點檢的合格率，以及與上一次比較，合格率最低的據點排最前面。
4. 以 2026-11-12 為今天，介面用繁體中文。

### Glide：上傳 Excel 加需求，幾分鐘出 App

做法跟前兩篇一樣：首頁上傳 `inspection.xlsx`、貼需求。這次 Glide 自己開了新專案，產出 App「門市設備點檢」，三個頁籤：總覽、點檢、改善追蹤。

AI 的回報很清楚：預覽正常，但「送出點檢、拍照、標記已改善尚未實測」；照片欄位是它自己加的。

### Airtable：匯入 Excel，再請 Omni 建介面

Airtable 首頁左下的 Import 可以直接選 Microsoft Excel。上傳後會預覽兩張工作表，一次匯入，據點、結果、改善狀態都自動變成單選欄位，比第 3 篇用的貼上匯入省事。

接著到 Interfaces 按「Try building with AI」，在 Omni 的對話框貼同一段需求。Omni 把思考過程寫在對話裡：

- 判斷「標準儀表板元件算不出最近一次與上一次的合格率比較，也不能依合格率動態排序」，決定改用寫程式的[自訂元件](https://support.airtable.com/articles/6845086569-ai-generated-interface-elements-in-airtable)。
- 要新增「現場照片」附件欄位前，先跳出 Approve／Deny 問我。
- 建置時一個套件版本格式寫錯，自己發現、修正後重建。

最後產出「門市設備點檢系統」，三個頁面：點檢作業、點檢總覽、改善追蹤。整個過程比 Glide 久，大約多花幾分鐘。

## 逐項實測

| 測試 | Glide | Airtable Omni |
|---|---|---|
| 總覽：C 75%、B 87.5%、A 100%，C 排第一 | ✅ 附「比上次 ±12.5」 | ✅ 附「比上次 ±12.5%」，C 標「優先改善」 |
| 總覽：結論卡 | 今天日期、待改善件數 | 全部平均 87.5%、待改善 3 件、最低據點、最佳據點 |
| 點檢：不合格必填備註 | 選不合格出現必填備註；8 項沒填完送出鍵是灰的 | 選不合格出現紅框；沒填就送出會被擋下並提示 |
| 點檢：拍照 | 有「拍照上傳」按鈕 | 有「拍照或上傳照片」區塊 |
| 點檢：一鍵全部合格 | 沒有 | 有 |
| 送出 A 據點點檢（緊急照明不合格） | ✅ 待改善 3→4 | ✅ 待改善 3→4，自動編號接續 C049 |
| 改善追蹤：標記已改善 | ✅ 4→3 | ✅ 4→3，另有「已改善記錄」檢視 |
| 手機版 | 編輯器內建手機預覽 | 這次沒測 |

兩邊都把需求做完了。差別在細節：Airtable 的總覽頁多了「結論先給」的卡片和「優先改善」標籤，點檢頁多了「一鍵全部合格」；Glide 的介面比較精簡，手機預覽現成。

## 兩邊犯了同一個錯

我在 A 據點 11/12 再送一次點檢（7 項合格、1 項不合格），預期 A 最近一次的合格率是 87.5%。兩邊的總覽都顯示 **93.8%（15/16）**：把同一天的兩次點檢合併計算了。

原因不在 AI，在我的資料。紀錄表只有「點檢日期」，沒有「這一次點檢」的編號，所以兩個 AI 都只能把同一天當成同一次。正式使用時要多一個「點檢批次」欄位（例如據點加日期加時間），總覽才能分得出第幾次。

這是本系列第一次兩個工具犯同一個錯，也說明了一件事：AI 能把需求做成畫面，但資料表少了什麼，它不一定會提醒你。

## 卡在哪

| 狀況 | 工具 | 做法 |
|---|---|---|
| 同一天多次點檢被合併 | 兩者 | 資料表加「點檢批次」欄位，再請 AI 改用批次分組 |
| 「今天」與比較日期寫死 | 兩者（Omni 的規劃寫明用 11-12 對 11-05） | 請 AI 改成系統日期、自動找前一次 |
| 拍照沒實測 | 兩者 | 我在電腦上操作，正式用前要拿手機實拍 |
| 免費方案不能發布 | Glide | 至少 Basic 方案 |
| 介面未發布 | Airtable | 發布後只給 base 協作者用（見[第 3 篇](/posts/product/2026-11-12-no-code-approval-airtable-power-apps)）；外部或大量使用者要看方案 |
| Toast 提示蓋住底部導覽 | Glide | 等它消失再點 |

## 成本

- **Glide**：免費方案能建、能預覽，不能發布；Basic 每月 25 美元起（2026-11-12 介面顯示），見 [Glide 定價頁](https://www.glideapps.com/pricing)。
- **Airtable**：免費方案每個 base 1,000 筆、每人每月 500 AI credits。這次用 Omni 建完整個介面，AI credits 面板仍顯示 500 available，看起來沒有扣，或還沒反映。點檢紀錄每週 24 筆，一年約 1,250 筆，會超過免費方案的 1,000 筆上限；正式用要升級或定期封存舊紀錄，見 [Airtable 定價頁](https://airtable.com/pricing)。

## 公開案例

Glide 的[客戶故事](https://www.glideapps.com/customers/champion-industries)提到，在美國北卡羅來納州提供與維修商用洗碗機的 Champion Industries，用 Glide 取代手寫的出廠測試檢查表：每台機器依序號逐項檢查，結果都存起來，之後技師維修時可以查。官方寫已測試 370 台以上機器，比傳統開發省下 12 萬美元。這是廠商撰寫的案例，數字是自述。

這個案例是「出廠品質檢查」，本篇是「門市定期點檢」，結構相同：一張檢查項目表、一張逐次紀錄表，加上一個在現場逐項勾選的畫面。

## 適合誰

- **Glide**：想最快拿到手機上能用的點檢 App，點檢人主要用手機的團隊。
- **Airtable + Omni**：點檢資料還要跟其他表（設備清單、報修單）串在一起，或需要總覽頁直接給結論的團隊。
- **不論選哪個**：先把資料表想清楚，尤其是「一次點檢」怎麼識別，再交給 AI。
- 對照系列的三個原則：「系統先算」兩邊都做到；「結論先給」Airtable 這次做得比較完整，總覽頁第一眼就看得到哪家店要優先處理。

## 參考資料

- [Glide](https://www.glideapps.com/)
- [Glide Pricing](https://www.glideapps.com/pricing)
- [Airtable](https://www.airtable.com/)
- [Airtable Omni](https://www.airtable.com/platform/app-building)
- [Using Omni AI in Airtable](https://support.airtable.com/articles/1744327578-using-omni-ai-in-airtable)
- [AI-generated interface elements in Airtable](https://support.airtable.com/articles/6845086569-ai-generated-interface-elements-in-airtable)
- [Airtable Pricing](https://airtable.com/pricing)
- [Champion Industries Customer Story - Glide](https://www.glideapps.com/customers/champion-industries)
- [無程式碼工具實戰：系列導讀](/posts/product/2026-11-12-no-code-tools-series-intro)
- [設備報修的申請與審核怎麼用無程式碼工具做（本系列第 3 篇）](/posts/product/2026-11-12-no-code-approval-airtable-power-apps)
- [器材借用與歸還怎麼用無程式碼工具做（本系列第 5 篇）](/posts/product/2026-11-12-no-code-equipment-loan-glide)
