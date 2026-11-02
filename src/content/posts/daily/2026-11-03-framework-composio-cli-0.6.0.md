---
title: "框架更新｜Composio CLI 0.6.0"
date: 2026-11-03
category: daily
type: digest
tags: [ai-agent, framework, daily, composio]
lang: zh-TW
description: "Composio CLI 0.6.0 把「中斷執行時發生什麼」與「多帳號情境選哪個帳號」兩件原本隱性的行為，改成明確、可被腳本依賴的契約"
tldr: "Composio CLI 0.6.0 三個重點：(1) Breaking：SIGINT/SIGTERM/SIGHUP 中斷改回報明確 exit code（130/143/129），不再視同成功結束；(2) Breaking：developer 帳號連結要求能解析出明確的 project 與 acting user，否則直接失敗；(3) Breaking：一個 toolkit 下有多個帳號又沒有 default 別名時，不再隱性挑最新帳號，須明確指定。"
series:
  name: "AI Framework Changelog"
  order: 60
---

> 🌏 [English version](/posts/daily/2026-11-03-framework-composio-cli-0.6.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Composio |
| 版本 | CLI v0.6.0 |
| 前一版 | CLI v0.5.0 |
| 發布日 | 2026-11-01 |
| Release Notes | [CLI @composio/cli@0.6.0](https://github.com/ComposioHQ/composio/releases/tag/%40composio%2Fcli%400.6.0) |
| GitHub | [ComposioHQ/composio](https://github.com/ComposioHQ/composio) |
| Stars | 31k |

## 這個版本為什麼重要

Composio 是讓 agent 串接 200+ 外部工具整合的 CLI/SDK，這版把兩件原本「隱性假設」的行為，變成明確、可依賴的契約。以前中斷一個跑著的 composio 指令（Ctrl+C、逾時被上層腳本殺掉），CLI 的行為並不會明確區分「使用者主動取消」跟「真的跑完」，包著 composio 的自動化腳本只能自己猜。這版把三種中斷訊號各自對應固定的 exit code，腳本可以明確分支處理。另一個修正是多帳號情境下，以前指令會偷偷挑「最新建立」的帳號當預設，這版要求明確指定帳號或別名——對會同時操作多個已連線帳號的 agent 來說，這原本是個不會跳錯誤、只會悄悄連錯帳號的風險點。

## 重要變更

- **中斷訊號對應明確 exit code**：SIGINT/SIGTERM/SIGHUP 分別對應 130/143/129，`run` 會把訊號轉給子行程群並保留子行程的真實結果 → CI／agent 腳本能用 exit code 分支處理「使用者取消」與「正常結束」，不必再猜中斷算不算失敗
- **Developer 指令一致解析 acting user/project**：`dev connected-accounts link` 固定用 developer project，root `link` 保留 consumer-project 行為，指令會拒絕它不能兌現的共用旗標 → 多帳號／多專案情境下的指令語意不再模糊
- **`--fail-fast` 中止選項**：`listen` 與 `dev triggers listen` 新增 `--fail-fast`，sink 失敗時可以選擇立即中止而非吞掉繼續跑 → 長跑的 webhook／trigger 監聽行程可以接進既有的「失敗就讓流程掛掉」告警邏輯
- **連線清單補齊欄位**：`connections list` 補上帳號 ID、別名與服務顯示名稱等欄位 → 靠腳本解析輸出時,不用再回頭多打一次 API 補欄位
- **其他修正**：toolkit 篩選修正底線 slug 比對、本地檔案上傳保留原始 MIME type、proxy 呼叫強制套用 consumer 權限檢查 → 幾個先前靠邊界行為拼湊出來的小 bug 被收斂成明確規則

## Breaking Changes

- 中斷訊號改回報明確 exit code（SIGINT→130、SIGTERM→143、SIGHUP→129），不再視同「成功結束」：
  - 影響範圍：任何把 composio CLI 中斷當成「正常完成」處理的腳本（例如逾時殺行程後仍判定成功）都要改成辨識新的 exit code
- developer 帳號連結要求能解析出明確的 developer project 與 acting user：
  - 影響範圍：還沒初始化工作目錄、或沒有明確選定 project 就呼叫 `dev connected-accounts link` 的腳本會直接失敗，需要先初始化或明確指定 project
- 一個 toolkit 底下有多個帳號又沒有 `default` 別名時，不再隱性挑「最新建立」的帳號：
  - 影響範圍：多帳號場景下依賴「composio 自己猜一個帳號」的呼叫，升級後要改成明確傳 `--account <id|alias>`，或先替其中一個帳號指定預設別名

## 遷移指南

### 從 0.5.0 升級到 0.6.0

```bash
curl -fsSL https://composio.dev/install | sh
composio upgrade
composio --version
```

```bash
# 若腳本把「使用者按 Ctrl+C」當成失敗處理，要改讀新的訊號 exit code
# 130 = SIGINT、143 = SIGTERM、129 = SIGHUP
composio run my-flow
if [ $? -eq 130 ]; then
  echo "cancelled by user, not a real failure"
fi

# 多帳號場景明確指定帳號，不要依賴隱性的「最新帳號」
composio dev connected-accounts link --account my-prod-account
```

其餘功能為新增能力與行為修正，沒有踩到上述三個情境的腳本不升級程式碼也能照常運作。

## 與其他框架的對比觀察

前幾天（2026-10-29）Agno 在 v3.1.12 把 agent 自己的權限請求接進 AgentOS 既有的 Approval UI，讓 run 能暫停成可持久化的 `PAUSED` 狀態等人核准，處理的是「agent 執行層」要不要繼續跑下去的問題。Composio 這版修的不是 agent 的決策流程，而是工具整合層更底層的兩件事——「連線身份該算誰的」與「被中斷時狀態算不算正常」。兩者都在補「agent 長時間、跨帳號或跨工具運作」時會出現的模糊地帶，只是一個站在 agent 執行層，一個站在 agent 呼叫外部工具的整合層。

## 今日收穫

之前以為 CLI 工具「被 Ctrl+C 中斷」只是個邊緣情境，不太需要認真設計；看到 Composio 這版把三種訊號各自對應固定 exit code 才意識到——只要這個 CLI 會被寫進任何自動化或 agent 腳本裡呼叫，「中斷時發生了什麼」就不是邊緣情境，而是腳本能不能正確判斷「這次執行到底成功沒有」的核心契約。同一版修的「多帳號預設挑最新一個」問題也是同一類：單人手動操作時幾乎不會注意到，但換成 agent 跨帳號跑的時候,悄悄連錯帳號比直接報錯更危險。

## 參考資料

- [Composio CLI 0.6.0 Release Notes](https://github.com/ComposioHQ/composio/releases/tag/%40composio%2Fcli%400.6.0)
- [ComposioHQ/composio GitHub](https://github.com/ComposioHQ/composio)
- [Full Changelog: CLI 0.5.0...0.6.0](https://github.com/ComposioHQ/composio/compare/%40composio%2Fcli%400.5.0...%40composio%2Fcli%400.6.0)
- [Agno v3.1.12 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.12)
