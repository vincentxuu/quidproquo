---
title: "工具推薦｜jmeter-mcp-server — 讓 Agent 用打字組 JMeter 壓測計畫，不用手刻 XML"
date: 2026-09-08
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "把 JMeter 壓測計畫變成一棵可用 ID 逐節點編輯的 JSON 樹，MCP server 負責序列化成 .jmx 並跑真實 JMeter，避免 LLM 手刻 XML 時常見的靜默錯誤"
tldr: "jmeter-mcp-server 是一個 stdio MCP server，讓 Agent 用型別化工具呼叫建立、編輯、執行 JMeter 壓測計畫並讀回聚合報表。安裝：`claude mcp add jmeter -e JMETER_HOME=... -- npx -y jmeter-mcp-server`。解決了 LLM 手刻 `.jmx` XML 容易產生『格式合法但語意錯誤、且不會報錯』的問題。"
series:
  name: "AI Tool of the Day"
  order: 24
---

> 🌏 [English version](/en/posts/daily/2026-09-08-tool-jmeter-mcp-server-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | jmeter-mcp-server |
| 類型 | Stdio MCP server |
| GitHub | [juliodelimas/jmeter-mcp-server](https://github.com/juliodelimas/jmeter-mcp-server) |
| Stars | 83 |
| 語言 | TypeScript |
| 授權 | MIT |
| 安裝 | `claude mcp add jmeter -e JMETER_HOME=/path/to/jmeter -- npx -y jmeter-mcp-server` |

## 解決什麼問題

你是不是也試過直接叫 LLM 幫你寫一份 JMeter 的 `.jmx` 壓測計畫？它做得到——`.jmx` 說到底就是 XML，模型看過夠多範例。問題出在「怎麼錯」：JMeter 的格式是一棵 `hashTree`，裡面塞滿容易記錯的細節——`guiclass`/`testclass` 要精確配對、屬性名稱常常跟 GUI 上看到的標籤對不起來（`ThreadGroup.num_threads` 其實是 `stringProp` 不是 `intProp`）、斷言比對模式是用整數 bitmask 表示、父子節點還得靠成對的 `<hashTree>` 標籤嚴格對齊。這些全部都不會被 XML schema 擋下來——值填錯了照樣是一份合法、能載入的 XML，只是安靜地做錯事。

README 裡就講了一個真實案例：早期版本的 If Controller 生成了一個叫 `useExpression` 的屬性設成 `true`，字面上讀起來像「對，把我的條件當表達式求值」，但 JMeter 原始碼的實際行為剛好相反——`useExpression=true` 其實是「不要」把它當表達式解析，只是去比對字串是不是字面上等於 `"true"`。結果每一個非平凡的條件都靜默地、永久地失敗，沒有任何錯誤或警告，子節點的 sampler 就是不會被執行——這個問題是實際跑了產生出來的計畫、看到 sample count 是零才被抓到的。

jmeter-mcp-server 的做法是把這套容易出錯的 XML 知識封裝成一次性寫好、經過測試的序列化器/解析器，對外只暴露型別化的工具呼叫：計畫不是一段文字 XML，而是一棵帶穩定節點 ID 的 JSON 樹，新增、刪除、改名、搬移、停用某個元件都是「對某個 ID 呼叫一次工具」，不用整份 `.jmx` 重寫；既有的 `.jmx`（手寫或從 GUI 匯出）也能匯入成同一種樹狀結構繼續編輯。執行是非同步的——`execute_test_plan` 立刻回傳 `executionId`，長時間壓測不會卡住對話；讀回來的是 `get_execution_report` 算好的聚合統計（error %、平均/中位數/p90/p95/p99、throughput），不是叫你自己平均幾千筆原始樣本。

適合場景：QA 或後端工程師想用自然語言描述壓測情境（「20 個使用者打 POST /orders 兩分鐘，5% think time，超過 800ms 算失敗」），讓 Agent 直接組出可執行的壓測計畫並跑出報表；需要對既有 `.jmx` 做小幅編輯（加一個斷言、調整執行緒數）又不想整份重新生成的場景；或是想把「LLM 生成配置」這件事收斂成一條被測試過的程式碼路徑，而不是每次都重新賭一次 XML 記對了沒有。

## 快速上手

### 安裝

```bash
# 前提：本機要裝好 Apache JMeter,
# JMETER_HOME 指向安裝目錄（要包含 bin/jmeter）
# macOS 用 Homebrew: brew install jmeter

claude mcp add jmeter \
  -e JMETER_HOME=/opt/homebrew/opt/jmeter/libexec \
  -- npx -y jmeter-mcp-server

# 確認註冊成功
claude mcp list
```

### 基本用法

Agent 拿到的是一組型別化工具，涵蓋 34 種元件（sampler、controller、timer、extractor、assertion、listener）加上編輯與 `.jmx` 匯入匯出：

```
建立計畫並跑一次壓測（Agent 實際會依序呼叫下面這些工具）：

create_test_plan                      → { planId, rootNodeId }
add_thread_group   (parentId: root)   → { nodeId: threadGroupId }
add_http_sampler   (parentId: threadGroupId, method: "POST", path: "/orders")
add_duration_assertion (parentId: samplerId, duration: 800)
add_aggregate_report_listener (parentId: threadGroupId)
execute_test_plan  (planId)           → { executionId }
get_execution_status (executionId)    ← 輪詢直到 "completed"
get_execution_report  (executionId)   → 聚合後的延遲/錯誤率統計
```

### 進階用法

```bash
# 對已存在的計畫做局部編輯，不用重新生成整份 XML
# （對某個節點 ID 操作，而不是重寫整棵樹）
update_element   (nodeId: threadGroupId, props: { num_threads: "50" })
move_element     (nodeId: assertionId, newParentId: otherSamplerId)
reorder_children (nodeId: threadGroupId, order: [samplerId1, samplerId2])

# 把 GUI 匯出的既有 .jmx 匯入成同一種可編輯的樹
import_test_plan (path: "./legacy-test.jmx")
# 回傳 unknownElementCount / unknownElementTypes，
# 告訴你哪些元件沒被完整解析(但原始 XML 會被保留、原封不動地輸出)
```

## 與現有工具的比較

README 自己整理了一份對照表，比較對象是 GitHub 上同樣做「JMeter + MCP」的另外八個公開專案（截至 2026-09-03）：

| | jmeter-mcp-server | 多數同類專案的常見做法 |
|---|---|---|
| `.jmx` 雙向轉換（匯入 + 匯出） | ✅ | 通常只能單向生成，或只能執行既有檔案 |
| 用節點 ID 做局部編輯 | ✅ | ❌，大多是「整份參數重新生成」 |
| 非同步執行，長壓測不卡對話 | ✅ | ❌，多數是同步等待完成 |
| 有自動化測試（166 個，含真實 JMeter 執行） | ✅ | ❌，多數專案沒有測試套件 |
| 真的呼叫 Apache JMeter 執行 | ✅ | 部分專案自己重寫了一套 HTTP 壓測邏輯，底層不是 JMeter |

## 注意事項

- **`add_csv_data_set` 的檔案路徑必須是絕對路徑**：JMeter 執行時是從每次獨立的執行目錄啟動的，相對路徑（在 GUI 裡是相對 `.jmx` 檔案位置解析）在這裡解析不到；而且絕對路徑寫死了機器特定的位置，`plan.json` 分享給別人用時不會直接可用。
- **v1 還沒做的功能**：沒有自動偵測「找出系統撐得住的最大併發數」（README 的 roadmap 裡叫 `find_breaking_point`），也沒有 parent-type 驗證——目前不會阻止你把元件掛在語意上錯誤的父節點下，`add_*`/`move_element`/`import_test_plan` 都不檢查這件事。
- **JDBC / FTP / Backend Listener 只做過結構驗證**：這些工具產生的 XML 是正確、JMeter 可載入的，但因為專案本身沒附資料庫、FTP server、InfluxDB 這類基礎設施,並沒有對著真實後端跑過,用之前自己先驗一次。

## 今日收穫

過去看「LLM 生成配置檔」這類工具,常見的賣點停在「模型會寫」,卻很少有人把「寫錯了會怎樣」當一回事處理。jmeter-mcp-server 的 README 用一個真實踩坑案例說明了為什麼這件事重要——`useExpression=true` 這種語意剛好相反的屬性,寫錯了 XML 照樣合法載入,只是安靜地永遠不執行。把這類知識收斂成一條被 166 個測試(含真實 JMeter 執行)把關的序列化路徑,再包成型別化工具呼叫,本質上是把「每次都重新賭一次記對了沒」換成「錯誤只需要被修一次」。

## 參考資料

- [jmeter-mcp-server GitHub repo](https://github.com/juliodelimas/jmeter-mcp-server)：README、Stars、語言、授權（MIT）均出自官方 repo 與 GitHub API。
- [README「Why not just ask an LLM」章節](https://github.com/juliodelimas/jmeter-mcp-server#why-not-just-ask-an-llm-to-write-the-jmx-itself)：`useExpression` 踩坑案例與設計動機。
- [README「Tools」章節](https://github.com/juliodelimas/jmeter-mcp-server#tools)：完整 34 種元件工具清單與編輯/檢視工具。
- [README「How this compares」章節](https://github.com/juliodelimas/jmeter-mcp-server#how-this-compares)：與另外八個公開 JMeter MCP 專案的對照表（截至 2026-09-03）。
- [Apache JMeter 官方文件](https://jmeter.apache.org/)：JMeter 本身的安裝與測試計畫格式。
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)：MCP 協定介紹。
