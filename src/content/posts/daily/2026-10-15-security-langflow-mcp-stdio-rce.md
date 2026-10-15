---
title: "資安警報｜Langflow 任何登入帳號都能全伺服器淪陷——CVE-2026-105740 正被野外大量攻擊"
date: 2026-10-15
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "Langflow 的 MCP stdio 設定 API 接受任何已登入帳號提交的 OS 指令且不做任何驗證，攻擊者已從 9 月中開始大規模掃描利用，至今超過 1,600 次攻擊嘗試"
tldr: "CVE-2026-105740（CVSS 9.9）：Langflow 1.9.0 之前版本，任何已登入帳號（含非管理員）都能透過 MCP stdio 伺服器設定 API 寫入任意 OS 指令，指令在讀取伺服器清單時就會自動執行，等於未授權使用者也能拿到完整伺服器執行權限。安全公司 Previdian 的蜜罐從 9/19 起觀測到 1,600+ 次攻擊嘗試、28 個不同攻擊來源 IP，10/11 起攻擊量暴增，同一批基礎設施也在打 Flowise 與其他 Langflow 舊漏洞。防禦：立即升級到 1.9.0+，關閉 `LANGFLOW_AUTO_LOGIN`，不要把 Langflow 直接曝露在不受信任的網路上。"
series:
  name: "AI Security Alert"
  order: 54
---

> 🌏 [English version](/posts/daily/2026-10-15-security-langflow-mcp-stdio-rce-en)

## 事件概述

Langflow 是 IBM/DataStax 旗下用來搭建 AI agent 與工作流的開源平台。任何已登入的 Langflow 使用者（包括非管理員帳號）都能透過新增一個「Stdio」傳輸型態的 MCP 伺服器，取得伺服器端的任意指令執行權限。問題出在設定 API 把使用者填的 `command` 欄位直接丟進 `bash -c "exec {command}"`，完全不做驗證、不設允許清單、不做沙箱隔離。更麻煩的是這段指令不需要使用者主動「執行」什麼東西——只要有人（任何使用者或管理員）去讀取 MCP 伺服器清單，指令就自動跑起來。安全公司 Previdian 的蜜罐從 9 月 19 日就開始觀測到實際攻擊流量，10 月 11 日起攻擊量暴增，到 10 月 15 日累計超過 1,600 次攻擊嘗試，是一起正在進行中的大規模掃描利用。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | OS Command Injection → 認證後任意指令執行（Authenticated RCE） |
| 影響範圍 | Langflow 1.9.0 之前版本（含 MCP stdio 伺服器設定功能的所有部署） |
| 嚴重程度 | Critical（CVSS 9.9，已確認野外主動利用） |
| CVE | CVE-2026-105740 |
| 修補版本 | Langflow >= 1.9.0 |
| 來源 | [GitHub Security Advisory GHSA-7w94-79vh-5mr2](https://github.com/langflow-ai/langflow/security/advisories/GHSA-7w94-79vh-5mr2)、[The Hacker News](https://thehackernews.com/2026/10/langflows-critical-authenticated-rce.html)、[Previdian 遙測頁](https://previdian.com/CVE-2026-105740) |

## 攻擊面分析

攻擊路徑很直接，不需要繞過任何 AI 模型的防線，純粹是 Web API 層的指令注入。第一步，攻擊者先用任何方式取得一個登入帳號——不需要管理員權限，一般使用者註冊帳號就夠。第二步，對 `POST /api/v2/mcp/servers/{server_name}` 送出一個 JSON body，`command` 欄位填入任意 shell 指令（例如 reverse shell payload），`env` 欄位還能夾帶自訂環境變數。API 收到後完全不檢查這個指令是什麼，直接存起來。第三步，攻擊者（或任何之後去瀏覽 MCP 設定頁、觸發 `GET /api/v2/mcp/servers?action_count=true` 的人，哪怉是管理員）一旦讀取伺服器清單，後端就會把存好的 `command` 字串原封不動塞進 `bash -c "exec {command}"` 執行，攻擊者端的監聽器就收到連線。

根本原因是伺服器端拿到使用者輸入後，從頭到尾沒有做輸入驗證、沒有限制可執行的指令範圍（既沒有允許清單也沒有封鎖清單），`_validate_node_installation` 這個唯一的檢查只確認「如果指令字串裡有 `npx` 就檢查 Node.js 有沒有裝」，完全不是安全控制。`env` 欄位直接合併進子程序環境變數，等於開放 `LD_PRELOAD` 注入共享函式庫、`PATH` 覆寫劫持系統指令這兩條額外路徑。更陰險的是持久性：MCP 伺服器設定存在專案設定裡，不像自訂元件程式碼那樣會顯示在 flow 編輯器中，一般人做程式碼審查看不到，而且只要清單被讀取一次，惡意指令就重新執行一次，形同一個會自動復活的後門。對照 OWASP LLM Top 10，這起事件同時命中 **LLM05 Supply Chain Vulnerabilities**（廣泛部署的開源 agent 平台本身有未修補漏洞）與 **LLM06 Excessive Agency**（一般非管理員帳號被賦予了遠超「設定一個工具整合」所需要的伺服器端執行權）。

值得注意的是，這不是 Langflow 今年唯一一次因為 MCP stdio 設定被打穿。上個月 Langflow 才修補過同類型的另一個 CVE-2026-105697（CVSS 同樣 9.9），而 Previdian 觀測到的攻擊來源 IP（如 `192.255.229.92`）同時也在打 Flowise 的 CVE-2026-69255 以及 Langflow 更早的 CVE-2026-55255、CVE-2026-9198、CVE-2026-0768——代表這是某個未知攻擊者有系統地掃描整個 AI workflow 平台生態圈的既有漏洞,不是單一事件。

## 防禦做法

**立即動作**
- 檢查目前執行的 Langflow 版本：`pip show langflow` 或看 Docker image tag，低於 1.9.0 一律視為已暴露，立即升級
- 無法馬上升級的話，先設定 `LANGFLOW_AUTO_LOGIN=false`，並確認 Langflow 沒有直接對外公開（不受信任網路可連到）
- 檢查既有的 MCP 伺服器設定清單（Settings → MCP Servers），找有沒有自己或團隊沒印象新增過的 stdio 伺服器項目，尤其留意 `command`/`env` 欄位內容
- 稽核 `/api/v2/mcp/servers/` 相關 API 的存取紀錄，特別是非管理員帳號對這個端點的寫入請求，以及異常的 `/api/v1/auto_login` 嘗試

**長期架構**
- 任何「使用者輸入最終會變成伺服器端 shell 指令」的功能，驗證必須在輸入端做（允許清單優於封鎖清單），不能靠「反正要裝 Node.js 才能用 npx」這類旁敲側擊的檢查頂著
- 幫 Langflow 之類會執行外部程序的 AI agent/workflow 平台設最小權限的執行帳號，降低即使被 RCE 也只能拿到的實際可用範圍
- 考慮用 Netzilo 的 MCP server runtime governance 做 allowlist 與執行期範圍檢查，或 Noma Security／Lasso Security 這類專做 agent 工具供應鏈稽核的產品，在 MCP 設定寫入時就攔下未經審核的指令樣式

## 影響範圍

Previdian 的蜜罐遙測顯示，攻擊從 9 月 19 日就已開始（在 CVE 正式公開揭露的 10 月 5 日之前），10 月 11 日單日攻擊量跳到 333 次，10 月 15 日當天截稿前仍有 66 次新嘗試，累計超過 1,600 次、來自 28 個不同 IP、分布 16 個國家。觀察到的攻擊手法包括：確認 Langflow 版本、嘗試用 `/api/v1/auto_login` 自動登入（蜜罐環境已停用因此回 403）、改用常見帳密組合登入成功後直接打 MCP 設定端點；payload 包含竊取 `LANGFLOW_SECRET_KEY`、`LANGFLOW_SUPERUSER_PASSWORD` 等環境變數並回傳到攻擊者控制的伺服器、嘗試用 Docker 指令讀取主機 `/etc/passwd`，以及 `id`、`whoami` 這類基本的執行探測。目前沒有公開的受害者清單，但攻擊已從被動掃描進入主動且持續攀升的階段，任何對外公開的 Langflow 部署都該假設自己正在被同一套自動化攻擊腳本掃描。

如果你的團隊用 Langflow 架設內部或對外的 agent 應用，這起事件代表的風險不是理論性的——攻擊基礎設施已經就位、而且同一批攻擊者正系統性地掃過整個 Langflow/Flowise 生態圈的多個已知漏洞。拖著不升級等於把伺服器完整執行權限開放給任何能註冊帳號的人。

## 今日收穫

這起事件和前陣子的 obsidian-tc 漏洞有個共通的提醒：MCP 協定把「新增一個工具整合」這件事本身變成了一個高權限操作，但很多實作並沒有把這個操作當成高權限操作來設計存取控制。當「讀取清單」這種看起來像唯讀的動作，背後卻會觸發指令執行，等於把一個 side-effect-free 的操作偷偷升級成了遠端程式碼執行的觸發點——這種介面設計上的落差，比單純漏寫一行驗證碼更難在程式碼審查時被發現。

## 參考資料

- [GitHub Security Advisory GHSA-7w94-79vh-5mr2 — Authenticated RCE via MCP Stdio transport](https://github.com/langflow-ai/langflow/security/advisories/GHSA-7w94-79vh-5mr2)
- [The Hacker News — Langflow's Critical Authenticated RCE Flaw Targeted in 1,423 Honeypot Exploit Attempts](https://thehackernews.com/2026/10/langflows-critical-authenticated-rce.html)
- [Previdian — CVE-2026-105740 exploitation intelligence](https://previdian.com/CVE-2026-105740)
- [CVE.org — CVE-2026-105740 Record](https://www.cve.org/CVERecord?id=CVE-2026-105740)
- [GitHub Security Advisory GHSA-w794-rj3p-xv45 — 上個月的另一起同類 Langflow MCP CVE-2026-105697](https://github.com/langflow-ai/langflow/security/advisories/GHSA-w794-rj3p-xv45)
