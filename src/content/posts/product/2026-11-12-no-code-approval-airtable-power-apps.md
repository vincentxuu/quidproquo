---
title: "設備報修的申請與審核怎麼用無程式碼工具做：Airtable Interface、核准按鈕與 Power Apps 對照"
date: 2026-11-12
category: product
type: guide
tags: [low-code, airtable, power-apps, workflow-automation, analytics]
lang: zh-TW
tldr: "用 Airtable 做設備報修派工：貼上表格就能匯入、中文描述就產生正確公式、Kanban 看板加「核准」按鈕完成審核；按鈕的顯示條件要 Business 方案。Power Apps 需要公司或學校帳號，本篇以官方文件與案例對照。"
description: "「無程式碼工具實戰」第 3 篇：申請與審核類任務。以設備報修為例實作 Airtable 的資料表、關聯欄位、AI 公式、Interface 看板與核准按鈕，記錄免費方案卡住的地方，並對照 Power Apps 的審核做法。"
series:
  name: "無程式碼工具實戰"
  order: 3
draft: false
---

> 🌏 [English version](/posts/product/2026-11-12-no-code-approval-airtable-power-apps-en)

設備壞了要報修，是每個有實體據點的組織都會碰到的流程：門市的冷藏櫃、學校的冷氣、辦公室的印表機。常見做法是傳 LINE 給主管，主管再打電話叫廠商，過幾天沒人記得修好了沒。

這是「無程式碼工具實戰」系列的第 3 篇，任務類型是**申請與審核**。比較方法見[系列導讀](/posts/product/2026-11-12-no-code-tools-series-intro)。本篇用 [Airtable](https://www.airtable.com/) 實作一次，再拿 Power Apps 的官方做法對照。資料是模擬的，3 個據點、8 台設備、24 張報修單。

## 情境：誰在用、流程怎麼走

| 角色 | 要做的事 |
|---|---|
| 申請人（據點人員） | 送出報修：哪台設備、什麼問題、多急 |
| 主管 | 看待核准的單子，核准或退回 |
| 維修廠商 | 更新維修進度 |
| 總部 | 看哪類設備最常壞、平均修多久 |

```text
待核准 ──核准──> 已核准 ──> 維修中 ──> 已完成
   └──退回──> 退回
```

審核流程最能測出一個工具是不是真的適合多角色：同一份資料，申請人、主管、總部要看到不同的畫面、能做不同的事。

## 做法

### 1. 資料表：貼上就能匯入

兩張表：**設備清單**（設備ID、名稱、類別、據點）和**報修單**（單號、設備、問題描述、優先度、狀態、申請人、申請日期、核准日期、完成日期、維修廠商）。

Airtable 左側的「Paste data」可以直接貼上試算表的內容。匯入時會自動判斷欄位型別：類別、據點、狀態、優先度變成單選，日期欄變成日期型別，這步完全不用手動設定。

### 2. 關聯欄位：設備ID 連到設備清單

把報修單的「設備ID」改成 **Link to another record**，連到設備清單，並關掉「允許連結多筆」（一張單只對應一台設備）。轉換完，Airtable 會主動問要不要加 **Lookup** 欄位，勾選設備名稱、類別、據點，報修單上就自動帶出這些資訊。

這跟 [AppSheet 篇](/posts/product/2026-11-12-no-code-food-waste-appsheet-looker)的 Ref 欄位是同一個概念，但 Airtable 多做了一步，會主動提示你加 Lookup 欄位。

### 3. 用 AI 產生「維修天數」公式

新增公式欄位時有「Create formula with AI」。我用中文輸入「計算從申請日期到完成日期的天數，尚未完成就留空」，它產生：

```text
IF({狀態} = "已完成", DATETIME_DIFF({完成日期}, {申請日期}, 'days'), BLANK())
```

預覽第一筆是 3 天（11/01 申請、11/04 完成），結果正確。上一篇在 AppSheet 用自然語言建規則，只得到一條空白規則；同一類功能，這次一次就成功。

### 4. Interface：審核看板與核准按鈕

[Interface Designer](https://www.airtable.com/platform/interface-designer) 是 Airtable 給不同角色做畫面的地方。我做了一個「設備報修中心」，裡面有兩頁：

**審核看板**（Kanban，依狀態分欄）

- 卡片顯示設備名稱、問題、優先度、據點、申請日期。
- 打開「Add records through a form」，右上角出現「Add record」，申請人從這裡送單。
- 打開「Click into record details」，點卡片就能看詳細內容。
- 詳細頁加一顆按鈕：動作選 **Update record**，把狀態設成「已核准」，按下後按鈕變綠色、顯示「已核准」。

實測：打開 R023（待核准）按「核准」，卡片立刻移到「已核准」欄，看板上的待核准從 4 張變 3 張。

看板的欄位順序跟著「狀態」單選選項的順序走。要排成待核准 → 已核准 → 維修中 → 已完成 → 退回，得到資料表的欄位設定裡拖曳選項。

**管理總覽**（Dashboard）

- 平均維修天數（已完成的單）：約 3 天。
- 「哪類設備最常報修」長條圖：冷藏設備 9 件最多，飲料設備 7 件。

儀表板元件少，沒有 Looker Studio 那種條件式格式，但跟資料放在同一個地方，不用另外接資料來源。

## 卡在哪

| 狀況 | 影響 | 做法 |
|---|---|---|
| 按鈕的顯示條件（只在待核准時顯示）要 **Business 方案** | 已核准的單子也看得到「核准」按鈕 | 免費方案靠按鈕的「已核准」狀態提示，或交給 Automation |
| 按鈕只能把日期設成固定值 | 無法自動記下「核准日期」 | 改用 Automation 在狀態變更時寫入日期 |
| 表單會列出所有欄位 | 申請人也看得到「狀態」「核准日期」 | 調整表單欄位、狀態預設「待核准」 |
| 主欄位是手打的單號 | 單號可能重複 | 改用 Autonumber 欄位 |
| 拖曳卡片換欄 | 我用自動化操作拖曳沒有作用，原因不確定 | 用詳細頁的按鈕或下拉選單改狀態 |
| 開新 base 時一直跳 Team 試用和 AI 功能的推銷視窗 | 第一次用會分心 | 直接關掉，不影響免費方案 |

Automation 這次沒有做，免費方案每月有 100 次執行額度（見下方成本）。

## 成本

實作時點到付費功能，Airtable 跳出的升級視窗列出（2026-11-12 介面顯示）：

| 方案 | 價格 | 重點額度 |
|---|---|---|
| Free | 免費 | 每個 base 1,000 筆、附件 1GB、每月 100 次自動化、每人每月 500 AI credits |
| Business | 每人每月 45 美元 | 每個 base 125,000 筆、每月 100,000 次自動化、每人每月 20,000 AI credits、免費唯讀使用者 |

建立 base 時另外跳出 Team 方案的 14 天免費試用（原價每人每月 20 美元）。最新價格以 [Airtable 定價頁](https://airtable.com/pricing)為準。

對一個 3 據點、每月幾十張報修單的規模，免費方案的筆數夠用；卡住的是按鈕條件、自動化次數這類流程功能。

## AI 功能

| 功能 | 狀態 |
|---|---|
| Create formula with AI | ✅ 實測成功，中文描述可用 |
| Link 欄位「Use AI to show top matches」 | 看到選項，沒測 |
| Field agents（Analyze attachment、Generate content、Deep match 等） | 看到選項，沒測；會消耗 AI credits |
| Omni（用 AI 建 App、產生報表） | 看到入口，沒測 |

**Analyze attachment** 可以分析附件，例如報修照片，等於 AppSheet 要 Enterprise Plus 才有的照片辨識。差別在 Airtable 的免費方案每人每月有 500 AI credits 可以試用，不過一次分析要花多少 credits，這次沒有測。

## 對照：Power Apps 怎麼做審核（未實測）

Power Apps 的免費[開發者方案](https://learn.microsoft.com/en-us/power-platform/developer/plan)只接受由 Microsoft Entra ID 管理的公司或學校帳號，個人帳號無法申請，所以本篇沒有實作，以下是官方文件與案例整理。

- **審核交給 Power Automate**：[Power Automate 的 approvals](https://learn.microsoft.com/en-us/power-automate/get-started-approvals) 有四種類型：「所有人都要核准」「第一個回應即生效」，以及兩種自訂選項的版本。申請人送出後，核准者會收到通知。
- **在 Teams 裡核准**：[Approvals in Microsoft Teams](https://learn.microsoft.com/en-us/power-automate/teams/native-approvals-in-teams) 可以從聊天、頻道或 Approvals App 發起和處理審核。
- **公開案例**：Microsoft 的[客戶故事](https://www.microsoft.com/en/customers/story/24543-oklahoma-city-fire-department-microsoft-power-platform)指出，奧克拉荷馬市消防局把檢查、紀錄與審核做成 15 個整合在 SharePoint 和 Teams 的 Power Apps，搭配 Power BI 儀表板，手動作業減少 40%。這是廠商撰寫的案例，數字是自述。

兩者的差別在審核的「深度」：Airtable 的核准是改一個欄位值；Power Automate 的審核是一個獨立的流程，有多人簽核、等待回應、通知這些機制。公司已經在用 Microsoft 365 和 Teams，需要多層簽核時，Power Apps 加 Power Automate 比較合適。

## 適合誰

- **Airtable**：團隊不大、流程一兩層、想很快做出「資料表 + 看板 + 儀表板」的組織。資料、畫面、圖表都在同一個地方，上手最快。
- **Power Apps + Power Automate**：已經有 Microsoft 365，需要多人簽核、Teams 通知、跟 SharePoint 整合的組織。
- 回到系列的三個原則：這次「系統先算」做到了（維修天數、Lookup 自動帶出）；「結論先給」只做了一半，儀表板只有數字和圖表，結論還是要人自己讀。

## 參考資料

- [Airtable](https://www.airtable.com/)
- [Airtable Interface Designer](https://www.airtable.com/platform/interface-designer)
- [Getting started with Airtable Interface Designer](https://support.airtable.com/articles/8078126534-getting-started-with-airtable-interface-designer)
- [Airtable Pricing](https://airtable.com/pricing)
- [Power Apps Developer Plan - Microsoft Learn](https://learn.microsoft.com/en-us/power-platform/developer/plan)
- [Get started with Power Automate approvals - Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/get-started-approvals)
- [Approvals in Microsoft Teams - Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/teams/native-approvals-in-teams)
- [OKCFD transforms operations with Power Apps（Microsoft 客戶故事）](https://www.microsoft.com/en/customers/story/24543-oklahoma-city-fire-department-microsoft-power-platform)
- [無程式碼工具實戰：系列導讀](/posts/product/2026-11-12-no-code-tools-series-intro)
- [門市鮮食報廢怎麼用無程式碼工具管（本系列第 2 篇）](/posts/product/2026-11-12-no-code-food-waste-appsheet-looker)
