---
title: "框架更新｜Pydantic AI v2.44.0"
date: 2026-09-18
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI 2.44 修補四個安全漏洞，其中一個讓 web_fetch 在事件迴圈上以超線性時間處理回應，單一惡意頁面就能卡住整個 process 裡的所有 agent"
tldr: "Pydantic AI v2.44.0 三個重點：(1) 修補四個安全漏洞，最嚴重的一個是 `web_fetch` 在 HTML 轉換與 charset 解碼上都以超線性時間跑在事件迴圈裡，攻擊者選一個頁面就能讓整個 process 裡的所有 agent 卡住；(2) Compatibility Notes 有三項行為變更：`RunContext.enqueue()` 改成能從 worker thread 安全呼叫、UI adapter 現在要求請求帶 JSON `Content-Type`、per-request hook 呼叫的 capability `@durable_operation` 改成走 dispatch 而不是直接 inline 跑；(3) 新增 Vercel AI SDK／Eve 遷移 skill，`AgentRunResult` 有了穩定的序列化格式。"
series:
  name: "AI Framework Changelog"
  order: 22
---

> 🌏 [English version](/en/posts/daily/2026-09-18-framework-pydantic-ai-2.44.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.44.0 |
| 前一版 | v2.43.0 |
| 發布日 | 2026-09-17 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.44.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20k |

## 這個版本為什麼重要

[上一篇（2.42.0）](/posts/daily/2026-09-10-framework-pydantic-ai-2.42.0)是一次規模很小的補洞版本，2.44 規模也不大，但性質完全不同：這是一次安全修補版本，一次修了四個獨立的安全漏洞，全部都出在 `web_fetch_tool` 或 OpenTelemetry instrumentation 這兩條路徑上。最值得注意的是一個中等嚴重度的 DoS 問題——`web_fetch` 在 HTML 轉換和 charset 解碼上都以超線性時間跑在事件迴圈裡，代表攻擊者只要準備一個特定構造的網頁，讓 agent 的 `web_fetch` 工具去抓，就能讓同一個 process 裡所有的 agent 一起卡死。對任何讓 agent 自主瀏覽網頁的部署來說，這是一個直接關乎服務可用性的修補，優先權應該高於一般的功能更新。

## 重要變更

- **修補 `web_fetch` 超線性時間處理（GHSA-fpf4-vwcp-v4hp，中等）**：HTML 轉換與 charset 解碼在事件迴圈上都以超線性時間執行 → 單一攻擊者選定的頁面就能讓 process 裡的每一個 agent 一起卡住，是四個修補中影響面最廣的一個
- **修補 IPv6 zone identifier 繞過本機網路封鎖（GHSA-vmxc-h2x2-jmf3，中等）**：`FileUrl(force_download='allow-local')` 或 `web_fetch_tool(allow_local_urls=True)` 開啟本機網路存取時，雲端 metadata／私有 IP 的封鎖清單可以被 IPv6 zone identifier 繞過 → 兩者預設都是關閉，但有開啟本機網路存取需求的部署要留意
- **修補網域封鎖清單比對方式（GHSA-22h6-qm39-v87j，低）**：`web_fetch_tool` 的網域清單過去按照書寫方式逐字比對，而非用 resolver 實際比對的形式，導致換個拼法就能繞過被封鎖的網域
- **修補 instrumentation 洩漏內容（GHSA-4x9p-g9wm-8q7f，低）**：設定 `InstrumentationSettings(include_content=False)` 後，span 仍然會帶有例外、錯誤狀態、instructions 與 output template，等於「關閉內容記錄」沒有真的關乾淨
- **`RunContext.enqueue()` 支援從 worker thread 安全呼叫**：過去在非主執行緒呼叫可能不安全，這版修正
- **UI adapter 要求 JSON `Content-Type`**：UI adapter 的請求現在強制要求 JSON `Content-Type` 標頭
- **`AgentRunResult` 有穩定的序列化格式**：一個跑完的 streaming 結果現在會 settle 成有固定形狀的序列化結果
- **新增 Vercel AI SDK／Eve 遷移 skill**：協助從這兩個框架搬過來的團隊對照 API

## Breaking Changes

官方沒有把這些列為正式 breaking changes，但 Compatibility Notes 標記了三項行為變更：

- 每個安全修補都是「收緊」而非新增功能，升級後原本依賴舊行為（例如某個網域拼法沒被封鎖清單擋下）的程式碼會直接被擋
- 由 hook 呼叫的 capability `@durable_operation` 改成走正式 dispatch，不再默默 inline 執行
  - 影響範圍：在 per-request hook 裡呼叫 durable operation 的專案，行為（特別是錯誤處理與重試語意）可能與升級前不同
- UI adapter 請求缺少 JSON `Content-Type` 會被拒絕
  - 影響範圍：手動組請求送給 UI adapter、沒有明確設定 `Content-Type: application/json` 的呼叫端

## 遷移指南

### 從 2.43.x 升級到 2.44.0

```bash
pip install --upgrade pydantic-ai==2.44.0
```

四個安全修補都在 `2.44.0`（v2）與 `1.107.6`（v1）同步修好，沒有需要改程式碼的地方——升級版本號就拿到修補。真正需要檢查既有程式碼的是三項相容性變更：

```python
# 若你的程式碼手動組請求打 UI adapter，確認帶了 JSON Content-Type
headers = {"Content-Type": "application/json"}  # 2.44.0 起是必要的
```

```python
# 若你在 per-request hook 裡呼叫 durable operation
# 舊行為：可能被靜默 inline 執行
# 新行為：一律走正式 dispatch，確認重試與錯誤處理邏輯沒有依賴舊的 inline 語意
```

建議升級後跑一次涉及 `web_fetch_tool`、UI adapter 請求、以及 OpenTelemetry instrumentation 的既有測試，確認沒有踩到這三項相容性變更。

## 與其他框架的對比觀察

比起 LangGraph、CrewAI 這類還在往 agent 原語堆功能的框架，Pydantic AI 這次的版本重心完全放在安全修補和邊界收緊上，呼應它「型別即契約」的一貫立場——connection 到外部世界的每個入口（web fetch、UI adapter、telemetry）都要求明確的驗證與宣告，而不是預設信任。這類專門處理 `web_fetch_tool` 安全問題的版本在同類框架裡並不常見，某種程度反映 Pydantic AI 團隊對「agent 自主瀏覽網頁」這個攻擊面已經有明確的安全流程在盯。

## 今日收穫

之前以為 agent 框架的安全問題多半出在工具執行（像是 shell、程式碼直譯）上，這次看到 `web_fetch` 本身的 HTML 轉換和 charset 解碼都能被構造成超線性時間的 DoS 向量才意識到：任何「處理不受信任外部內容」的路徑都是攻擊面，不只是「執行不受信任程式碼」——一個看似單純的字串解碼函式，複雜度沒控制好一樣可以卡死整個 process。

## 參考資料

- [Pydantic AI v2.44.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.44.0)
- [Pydantic AI GitHub](https://github.com/pydantic/pydantic-ai)
- [Pydantic AI v2.42.0 — 上一篇框架更新](/posts/daily/2026-09-10-framework-pydantic-ai-2.42.0)
- [GHSA-fpf4-vwcp-v4hp：web_fetch superlinear time DoS](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-fpf4-vwcp-v4hp)
- [GHSA-vmxc-h2x2-jmf3：IPv6 zone identifier bypass](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-vmxc-h2x2-jmf3)
- [GHSA-22h6-qm39-v87j：domain blocklist comparison bypass](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-22h6-qm39-v87j)
- [GHSA-4x9p-g9wm-8q7f：instrumentation content leak](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-4x9p-g9wm-8q7f)
- [Full Changelog: v2.43.0...v2.44.0](https://github.com/pydantic/pydantic-ai/compare/v2.43.0...v2.44.0)
