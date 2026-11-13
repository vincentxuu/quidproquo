---
title: "門市鮮食報廢怎麼用無程式碼工具管：AppSheet、Google Sheet、Looker Studio 與短少率"
date: 2026-11-12
category: product
type: guide
tags: [low-code, appsheet, looker-studio, google-sheets, retail, analytics]
lang: zh-TW
tldr: "用 Google Sheet 當資料庫、AppSheet 當店員 App、Looker Studio 當總部儀表板，把鮮食報廢從「手填」改成「確認」；短少率超過 10% 的門市自動標紅。"
description: "以便利商店鮮食報廢為例，示範 AppSheet + Google Sheet + Looker Studio 的分工、欄位與公式設定、儀表板的 insight 與 action，以及 AI 可以放在哪一段。"
series:
  name: "無程式碼工具實戰"
  order: 2
glossary:
  - term: "Slice"
    aliases: ["切片"]
    definition: "AppSheet 裡依條件篩出的資料子集合，類似試算表的篩選，可以拿來當成某個畫面的資料來源。"
    context: "本文用它做出只列出「還沒確認」報廢品的清單。"
    links:
      - label: "Slices: The Essentials - AppSheet Help"
        url: "https://support.google.com/appsheet/answer/10106592?hl=en"
  - term: "短少率"
    definition: "（應報廢數量 − 實際報廢數量）÷ 應報廢數量。系統算出應該剩下幾個，貨架上卻少了，差距就是短少。"
    context: "本文用它分辨「訂太多」和「東西不見」兩種問題。"
draft: false
---

> 🌏 [English version](/posts/product/2026-11-12-no-code-food-waste-appsheet-looker-en)

便利商店的鮮食到期沒賣完就要下架報廢，很多門市到現在還是用紙本或 LINE 回報，總部月底才拿到一份彙整。這篇用三個 Google 工具做出一套小系統：店員在手機 App 確認報廢，資料寫進試算表，總部打開儀表板就知道哪間店該查、哪個品項該少訂。

整套不寫程式，大約半天能做出來。資料是我自己模擬的，重點是做法和判斷，不是數字本身。這是「無程式碼工具實戰」系列的第 2 篇，系列要比哪些工具、用什麼維度比，見[系列導讀](/posts/product/2026-11-12-no-code-tools-series-intro)。

## 三個工具各做什麼

| 工具 | 角色 | 誰在用 |
|---|---|---|
| [Google Sheet](https://workspace.google.com/products/sheets/) | 資料庫，存所有紀錄 | 一般人不用直接碰 |
| [AppSheet](https://about.appsheet.com/) | 讀試算表，自動變成手機 App | 門市人員、店長 |
| [Looker Studio](https://lookerstudio.google.com/) | 讀同一份試算表做儀表板 | 總部、區經理 |

```text
店員手機 (AppSheet) ──寫入──> Google Sheet ──讀取──> 總部儀表板 (Looker Studio)
```

三個工具讀寫的是同一份資料，不用匯出、不用寄 Excel。Looker Studio 的介面最近顯示改名為「數據分析」，Google 的[說明文件](https://support.google.com/looker-studio/answer/6299685?hl=en)標題也寫成 Data Studio，是同一個產品。

## 先講第一版做錯的地方

我一開始做的是「銷售紀錄」：店員在 App 新增一筆，選門市、商品、數量，系統算出銷售額。做完才發現不對：**結帳時 POS 就已經記下銷售了**，叫店員再打一次是製造負擔。

這次學到的原則是：

- POS、ERP 已經有的資料，直接接進儀表板，不讓門市重複輸入。
- AppSheet 用在系統抓不到、現在還靠紙本或 LINE 的流程，例如報廢、設備報修、巡店稽核、冷藏溫度紀錄。

## 報廢不是「填寫」，是「確認」

接著又碰到一個問題：鮮食到期沒賣出就是要報廢，那系統不是自己就算得出來嗎？

算得出來的是**理論值**：

```text
應報廢數量 = 進貨數量 − POS 已賣出數量
```

但貨架上的**實際值**常常對不上：被偷、提早破損下架、員工私吃都會讓實際比理論少。這個差距就是短少，也是損耗管理真正要抓的東西。

所以流程改成確認制：

| 欄位 | 誰處理 |
|---|---|
| 品名、單價、應報廢數量、到期時間、門市 | 系統先帶好 |
| 實際報廢數量、報廢原因、照片 | 店員確認，數量一樣就直接存 |
| 短少數量、報廢金額、狀態、確認人、確認時間 | 系統自動算 |

店員實際只做兩三個動作。照片是稽核證據，避免「沒點就按確認」。

## Google Sheet：兩張表

**商品主檔**（模擬從 POS 匯入）：條碼、品名、類別、單價。

**報廢紀錄**：報廢ID、到期時間、門市、商品條碼、商品名稱、應報廢數量、實際報廢數量、短少數量、報廢金額、狀態、報廢原因、照片、確認人、確認時間。

只有一個規則要守：第一列是欄位名稱，一列一筆資料，不要合併儲存格。我模擬了 5 間門市、96 筆紀錄，其中 10 筆是今天「待確認」。

## AppSheet：把試算表變成店員的 App

在試算表選「擴充功能 → AppSheet → 建立應用程式」，AppSheet 會讀欄位自動生成 App。接下來都在編輯器左側的 Data 和 Views 設定：

| 設定 | 做法 | 效果 |
|---|---|---|
| 商品條碼設成 **Ref** | 參照商品主檔（[References between tables](https://support.google.com/appsheet/answer/10106510?hl=en)） | 類似 VLOOKUP，用條碼查出品名與單價 |
| 商品條碼勾 **Scannable** | 欄位屬性 → Other Properties | 欄位旁出現掃描圖示，手機鏡頭可以掃條碼（[barcode scanner](https://support.google.com/appsheet/answer/10106618?hl=en)） |
| 商品主檔設 **Read-Only** | 加入表格時選 Read-Only | 店員不能改主檔 |
| 照片設 **Image** | 欄位型別 | 變成拍照按鈕 |
| **App formula** | 見下方公式 | 店員不用填 |
| **Slice**「待確認報廢」 | 條件 `ISBLANK([實際報廢數量])` | 只列出還沒確認的品項 |
| **View**「今日待確認」 | 資料來源選上面的 slice | 店員打開就是待辦清單 |
| **Format rule** | 條件 `[短少數量] > 0`，文字紅色 | 有短少的紀錄在清單裡標紅 |

幾個欄位的公式：

```text
商品名稱 = [商品條碼].[商品名稱]
報廢金額 = [實際報廢數量] * [商品條碼].[單價]
短少數量 = [應報廢數量] - [實際報廢數量]
狀態     = IF(ISBLANK([實際報廢數量]), "待確認", "已確認")
確認人   = USEREMAIL()
確認時間 = NOW()
```

我用店員身分確認了一筆鮮奶吐司：按 ＋ 把實際數量設成 1、選「到期未售出」，品名、金額 29 元、短少 0、確認人和時間全部自動帶出，存檔後立刻寫回試算表。

**要知道的小事**：

- 用電腦瀏覽器開 App，會是左清單、右明細的雙欄版；手機才是一次一個畫面。展示時用手機或編輯器右側的手機預覽，比較貼近店員實際看到的樣子。
- App 沒有正式部署前，擁有者打開會看到頂端「Preview of your app」橫條，這是原型模式，不是壞掉。
- 確認人、確認時間用公式寫入有個缺點：同一筆再被編輯會覆寫。正式上線改用按鈕（Action）寫入比較穩。

## Looker Studio：從四張圖到能行動的儀表板

第一版儀表板只有總額、長條圖、圓餅圖和趨勢圖，打開的人會問兩個問題：「這是什麼時候的資料？」「所以要做什麼？」第二版針對這兩題改：

1. **標明資料期間與來源**：標題下加一行「資料期間 11/01–11/11（已確認報廢，不含今日待確認）｜來源｜更新頻率」，右上角放日期範圍控制項，預設同一個區間。
2. **計算欄位**：新增 `短少率 = SUM(短少數量) / SUM(應報廢數量)`，型別改成百分比（[About calculated fields](https://support.google.com/looker-studio/answer/6299685?hl=en)）。
3. **條件式格式**：門市排名表中，短少率大於 10% 的整列標紅（[Table reference](https://docs.cloud.google.com/looker/docs/studio/table-reference)）。
4. **圖表標題寫成問題**：「報廢金額最高的商品（訂貨調整優先）」比「商品名稱 × 報廢金額」好讀。
5. **結論放最上面**：在 KPI 上方放一張「本期重點與行動建議」，主管先看結論再看細節。
6. **顏色有語意**：一個主色給一般數據、一個強調色給結論、紅色只留給異常。

一個踩到的限制：Looker 的評量表（KPI 卡）標籤和數字共用同一個字型顏色。想要「數字彩色、標籤灰色」，要打開「隱藏欄位名稱」，再用文字框自己放標籤。

另外，資料來源預設每 15 分鐘更新，店員剛確認的資料不會立刻出現在儀表板上。

## 儀表板讀出的 insight 與 action

同樣是「報廢多」，處方可能完全不同。以下門市用代號：

| 門市 | 報廢金額 | 短少率 | 判斷 | 行動 |
|---|---|---|---|---|
| A 店 | 3,383 | **16.42%** | 平均 6.46% 的 2.5 倍，東西不見了 | 區經理查盤點與確認時段，4 週內降到 8% 以下 |
| B 店 | **3,813**（最高） | 2.41% | 幾乎沒短少，是訂太多 | 報廢前三品項訂貨下修 10–20%，同時追蹤缺貨率 |
| C 店 | 2,848 | 0% | 完全沒短少反而可疑 | 抽查是否實際清點，報廢必須拍照 |

另外三個發現：

- **到期未售出約佔報廢金額的 80%**：主因是訂貨與需求不匹配。短期在到期前 3 小時推即期折扣，中期導入需求預測。
- **便當類報廢金額最高**：便當單價高，報廢 1 個約等於 3 個飯糰，優先調整高單價品項的訂貨量最划算。
- **儀表板看不到的事**：大店本來就報廢比較多，要用「報廢金額 ÷ 進貨金額」才能公平比較。只看報廢，店長會傾向少訂，結果變成缺貨，所以報廢率和缺貨率要一起看。

## AI 可以放在哪一段

從「AI 放在哪一段、解決誰的痛點」來想，比從「有哪些 AI 功能」開始有用：

| 流程 | 痛點 | AI 怎麼幫 | 可行性 |
|---|---|---|---|
| 訂貨 | 全靠店長經驗 | 依星期、天氣、商圈活動預測訂貨量 | 需要資料團隊，難度最高、效益最大 |
| 即期品 | 快到期才發現 | 預估賣不完的量，提前推播折扣建議 | 預測結果寫回試算表，AppSheet 推播 |
| 報廢登記 | 打字、選原因 | 拍照辨識品項和數量 | 需付費方案，見下方 |
| 稽核 | 假報廢難發現 | 短少率異常偵測 | 先用規則，再換模型 |
| 總部分析 | 自己看圖寫週報 | 自動產生「本期重點」摘要 | 目前結論卡是手寫的，正好是下一步 |

前兩段讓報廢**變少**，第三段讓登記**變快**，後兩段讓管理**變準**。

拍照辨識要用 AppSheet 的 AI Task（Extract、Categorize），官方說明寫明[只開放給 Enterprise Plus 帳號](https://support.google.com/appsheet/answer/16045284?hl=en)，2025 年 7 月[正式上線](https://workspaceupdates.googleblog.com/2025/07/appsheet-extract-and-categorize-with-gemini-generally-available.html)。拍照存證本身不用付費。不升級方案的做法有兩個：先用條碼掃描取代辨識；或照片存進 Drive 後，用 Apps Script 呼叫 Gemini API 辨識再寫回試算表。

我也試了 AppSheet 用自然語言建立規則的功能，輸入「短少數量大於 0 的報廢紀錄用紅色字體標示」，它只建了一條空白規則，條件最後還是手寫的。

AppSheet 本身的費用：原型免費，最多可以邀請 10 位測試使用者；正式導入要授權，[官方定價頁](https://about.appsheet.com/pricing/)說部分 Google Workspace 方案已內含 AppSheet Core。

## 拿這套 demo 跟主管或團隊展示

把展示講成一個故事，不要變成工具功能介紹，大約 6–8 分鐘：

1. **痛點（30 秒）**：報廢每天都要做、多半靠紙本，總部分不出「報廢」和「被偷」。
2. **店員端（2 分鐘）**：打開「今日待確認」，故意把實際數量填少 1 個，選原因、拍照、存檔，回清單看到這筆變紅字。
3. **試算表（20 秒）**：剛剛那筆已經寫進去。
4. **總部端（2 分鐘）**：先講結論卡，再看 KPI 和門市排名，指出 A 店查損耗、B 店調訂貨。
5. **回頭追查（1 分鐘）**：回 App 搜尋 A 店，看確認人和照片，從發現問題到追查在同一套工具完成。
6. **下一步（1 分鐘）**：規則先跑起來，再談需求預測和 AI 辨識。

展示前先準備好一筆已確認的資料，並確認儀表板的日期範圍涵蓋它，避免現場因為 15 分鐘的更新延遲找不到資料。

## 還沒做完的

- **自動通知**：確認時有短少就寄信給店長，要用 AppSheet 的 Automation，這次沒做。
- **結論卡是手寫的**：資料更新後要人工改寫。
- **資料是模擬的**：A 店的異常是刻意設計來示範判斷流程。

這篇屬於「現場確認與回報」這類任務。接下來的篇章會換成申請審核、報名名單、庫存資產、巡檢稽核等任務，用 Power Apps、Glide、Airtable 測同一組維度，篇目見[系列導讀](/posts/product/2026-11-12-no-code-tools-series-intro)。

## 參考資料

- [AppSheet 官方網站](https://about.appsheet.com/)
- [AppSheet Pricing](https://about.appsheet.com/pricing/)
- [References between tables - AppSheet Help](https://support.google.com/appsheet/answer/10106510?hl=en)
- [Slices: The Essentials - AppSheet Help](https://support.google.com/appsheet/answer/10106592?hl=en)
- [Use a barcode scanner - AppSheet Help](https://support.google.com/appsheet/answer/10106618?hl=en)
- [Configure column properties - AppSheet Help](https://support.google.com/appsheet/answer/10106509?hl=en)
- [Overview of AI in automations - AppSheet Help](https://support.google.com/appsheet/answer/16045284?hl=en)
- [Extract and categorize data in AppSheet with Gemini（GA 公告）](https://workspaceupdates.googleblog.com/2025/07/appsheet-extract-and-categorize-with-gemini-generally-available.html)
- [About calculated fields - Looker Studio / Data Studio Help](https://support.google.com/looker-studio/answer/6299685?hl=en)
- [Table reference - Data Studio](https://docs.cloud.google.com/looker/docs/studio/table-reference)
- [Looker Studio](https://lookerstudio.google.com/)
- [Google Sheets](https://workspace.google.com/products/sheets/)
- [無程式碼工具實戰：系列導讀](/posts/product/2026-11-12-no-code-tools-series-intro)
