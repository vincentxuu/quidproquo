---
title: "社群活動的報名與簽到怎麼用無程式碼工具做：Glide 用一段中文需求產出報名 App"
date: 2026-11-12
category: product
type: guide
tags: [low-code, glide, mobile, workflow-automation]
lang: zh-TW
tldr: "上傳一份活動與報名名單的 Excel，用中文寫四點需求，Glide 約 1.5 分鐘產出有活動、報名、簽到、統計四頁的手機 App：剩餘名額自動扣、額滿不能選、勾選簽到就算出席率。免費方案不能發布，正式上線最低每月 25 美元。"
description: "「無程式碼工具實戰」第 4 篇：報名與名單管理類任務。用新版 Glide 實作社群活動的報名、名額控管、現場簽到與出席統計，記錄 AI 產生 App 的過程、資料存放方式與免費方案的限制。"
series:
  name: "無程式碼工具實戰"
  order: 4
draft: false
---

> 🌏 [English version](/posts/product/2026-11-12-no-code-event-signup-glide-en)

辦活動最常見的工具組合是 Google 表單收報名、試算表整理名單、活動當天印紙本簽到表。表單不知道名額剩多少，額滿了還有人報；簽到完要再一筆一筆打回試算表，才算得出出席率。

這是「無程式碼工具實戰」系列的第 4 篇，任務類型是**報名與名單管理**，比較方法見[系列導讀](/posts/product/2026-11-12-no-code-tools-series-intro)。本篇用 [Glide](https://www.glideapps.com/) 實作。資料是模擬的：3 場活動、58 筆報名，姓名虛構，Email 都是 `example.com`。

## 情境：誰在用、流程怎麼走

| 角色 | 要做的事 |
|---|---|
| 報名者 | 看活動、選場次、填資料報名 |
| 活動負責人 | 看名額還剩多少，活動當天現場簽到 |
| 主辦單位 | 看各場名額使用率與出席率 |

| 場次 | 名額 | 報名數 |
|---|---|---|
| EV01 讀書會（線上） | 30 | 24 |
| EV02 手作工作坊（B 據點） | 15 | 15（額滿） |
| EV03 社群交流晚會（A 據點） | 40 | 19 |

這類任務的重點有兩個：名額要即時扣，額滿就不能再報；簽到要能在手機上一個個勾，勾完數字就出來。

## 做法

### 1. 上傳 Excel，用中文寫需求

新版 Glide（官方叫 GlideOS）的首頁只有一個輸入框和「Drop a spreadsheet or build something new」。我上傳 `events.xlsx`（兩張工作表：活動、報名），輸入四點需求：

1. 活動列表顯示日期、地點、剩餘名額，額滿要標示。
2. 報名表單：選活動時看得到剩餘名額，額滿的不能選。
3. 簽到頁：選活動後列出報名名單，可以勾選出席。
4. 統計頁：各活動的名額使用率與出席率。介面用繁體中文。

約 1.5 分鐘後，Glide 產出 App「社群活動報名」，有四個頁籤：活動、報名、簽到、統計。過程中 AI 會在左側列出它跑了哪些指令、建了哪些資料表，最後主動建議下一步，例如活動前一天自動寄提醒、額滿時自動排候補。

### 2. 逐頁檢查

| 頁面 | 看到什麼 | 實測 |
|---|---|---|
| 活動 | 三場活動、剩餘名額（6/30、0/15、21/40），額滿紅標、可報名綠標，有搜尋 | 數字與原始資料一致 ✅ |
| 報名 | 姓名、Email、選活動（下拉顯示剩餘名額）、票種 | 額滿的工作坊在下拉選單是灰色、選不到 ✅；送出後顯示「報名成功」，讀書會剩餘名額 6→5 ✅ |
| 簽到 | 選活動後出現已到、報名人數、名額、出席率四張卡片，名單前有圓圈可勾 | 讀書會勾 3 人，已到 3、出席率 13%（3/24）✅ |
| 統計 | 活動數 3、報名總人數 58、整體出席率；各場名額使用率 48%/100%/80% | 使用率與原始資料一致 ✅ |

手機預覽有底部導覽列，四個頁籤用拇指就按得到。

### 3. 資料存在哪裡

上傳的 Excel 會被**複製**進 Glide 的內建資料表 Events 和 Registrations，欄名改成英文（`event_date`、`capacity`…）。之後在 App 裡報名、簽到，只會寫進 Glide 的表，**不會回寫原本的 Excel**。

右上角的 Connect 可以產生唯讀或可讀寫的連線，讓外部工具讀這些資料。如果團隊習慣在試算表裡看名單，要另外處理同步，或改從 Google Sheets 起手（官方說明連 Google Sheets 的 App 上限是 25,000 列，同步功能從付費方案起才有，見[整合頁](https://www.glideapps.com/data-sources/google-sheets)）。

## 卡在哪

| 狀況 | 影響 | 做法 |
|---|---|---|
| 免費方案按 Publish 出現「Upgrade to publish」 | 只能在編輯器裡預覽，報名者拿不到連結 | 正式使用要升級 |
| Excel 只匯入一次，不回寫 | 試算表和 App 的資料會分家 | 從 Google Sheets 起手，或用 Connect 讓外部工具讀 |
| 欄名被改成英文 | 之後要改資料表時，要對照中英欄名 | 在資料表頁面手動改回中文欄名 |
| 自動提醒、候補名單沒做 | AI 有建議，但我沒有實作 | 下一步可以直接用中文請 AI 加 |

這次沒有遇到 AI 理解錯需求的情況。四點需求都做到，連「額滿的不能選」這種細節也照做。

## 成本

點 Publish 跳出的方案表（2026-11-12 介面顯示，每月固定價，不是每人計價）：

| 方案 | 每月 | 重點 |
|---|---|---|
| Free | 免費 | 可建 App 和預覽，不能發布 |
| Basic | 25 美元 | 100 credits、2 個已發布 App、10 個專案、1 個 workflow |
| Plus | 50 美元 | 250 credits、可發布公開 App、5 個 App、5 個 workflow、版本歷史 |
| Pro | 125 美元 | 500 credits、5 位成員、無限 App 與 workflow、每日備份 |

最新價格以 [Glide 定價頁](https://www.glideapps.com/pricing)為準。報名表要讓不特定的人填，需要「公開 App」，從 Plus 方案開始。一個社群一年辦十幾場活動，每月 50 美元要跟「繼續用 Google 表單加紙本簽到」比較划不划算。

## 公開案例

Glide 的[客戶故事](https://www.glideapps.com/customers/tedx-lisboa)提到，全由志工組成的 TEDxLisboa 用 Glide 做活動 App，報到時掃 QR code 安裝，裡面有議程、講者介紹、場地地圖，還能直接傳訊息給志工。官方寫 620 位參加者登入，App 約 3 天做好。這是廠商撰寫的案例，數字是自述。

這個案例做的是「給參加者看的資訊 App」，跟本篇的「報名與簽到」是同一場活動的前後兩段。

## 適合誰

- **Glide**：想快速做出給手機用的報名、簽到工具，願意每月付費發布的社群或小型組織。從需求到能用的版本，比本系列其他工具都快。
- **不適合**：資料一定要留在自己的試算表、或不打算付費的團隊；免費方案只能自己預覽。
- 對照系列的三個原則：「系統先算」做得很好，剩餘名額、出席率都自動算；「結論先給」只做一半，統計頁有數字，但沒有像「哪場出席率偏低」這種提示。

## 參考資料

- [Glide](https://www.glideapps.com/)
- [Glide Pricing](https://www.glideapps.com/pricing)
- [Glide Google Sheets Integration](https://www.glideapps.com/data-sources/google-sheets)
- [TEDxLisboa Customer Story - Glide](https://www.glideapps.com/customers/tedx-lisboa)
- [How to build a custom event attendee app using no-code - Glide Blog](https://www.glideapps.com/blog/event-attendee-app)
- [無程式碼工具實戰：系列導讀](/posts/product/2026-11-12-no-code-tools-series-intro)
- [設備報修的申請與審核怎麼用無程式碼工具做（本系列第 3 篇）](/posts/product/2026-11-12-no-code-approval-airtable-power-apps)
