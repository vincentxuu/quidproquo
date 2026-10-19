---
title: "資安警報｜MCP「能力洗白」漏洞：21,097 個伺服器篩出 787 個可疑、150 個確認可讀走你的 SSH 金鑰"
date: 2026-10-18
category: daily
tags: [ai-agent, security, daily, data-exfiltration, mcp]
lang: zh-TW
description: "大規模研究 MCP-FSD 掃描 21,097 個 MCP server，發現 16.4% 有未宣告的檔案系統存取能力,動態測試確認 150 個可被利用讀取宣告範圍外的憑證檔案,連 Anthropic 官方 Git MCP Server 都中兩個 CVE"
tldr: "論文《My Credentials, Please》（arXiv:2610.22301,2026/10/15）定義「檔案系統能力洗白」：工具宣告的用途（如 git_add）跟它實際能碰到的檔案範圍不一致,使用者批准呼叫不等於限制了伺服器能讀寫的範圍。掃描 21,097 個 MCP server,4,806 個完成分級,787 個（16.4%）有未宣告的檔案存取能力,動態測試確認 150 個可利用,其中 96% 用最簡單的路徑穿越就得手。連 Anthropic 官方 Git MCP Server 都因此修了兩個 CVE（CVE-2025-68143、CVE-2026-27735）。防禦：本機 MCP server 一律用容器或限權帳號跑,不要讓它跑在存有 SSH 金鑰、雲端憑證的帳號下。"
series:
  name: "AI Security Alert"
  order: 57
---

> 🌏 [English version](/posts/daily/2026-10-18-security-mcp-filesystem-capability-laundering-en)

## 事件概述

一份 2026 年 10 月 15 日發表在 arXiv 的研究〈My Credentials, Please: Detecting Filesystem Capability Laundering in MCP Servers at Scale〉（Huang、Tang、Guan、Sun、He,arXiv:2610.22301）給一個長期被低估的 MCP 風險取了名字:「檔案系統能力洗白」(filesystem capability laundering)。問題核心是——使用者在 MCP client 裡批准一個工具呼叫,只決定了「這次呼叫會不會執行」,完全沒有限制「伺服器程式能碰到哪些檔案」。因為本機 MCP server 是用你自己的帳號跑起來的子程序,只要程式碼沒做路徑檢查,它就跟你本人一樣能讀寫任何檔案。研究團隊打造了一套叫 MCP-FSD 的掃描管線,對 9 個登錄庫共 21,097 個 MCP server 做分級,4,806 個進入最終篩選,其中 787 個(16.4%)雖然沒被歸類為「檔案系統類」伺服器,卻顯示出檔案存取能力;動態測試確認 150 個真的能被利用,拿到宣告範圍外的憑證檔案。最嚴重的是,連 Anthropic 官方維護的 Git MCP Server 參考實作都因此修補了兩個 CVE。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | MCP 工具範圍逃逸 / 未授權檔案存取(Filesystem Capability Laundering) |
| 影響範圍 | 本機部署的 MCP server 生態系,含 Anthropic 官方 Git/Filesystem 參考伺服器 |
| 嚴重程度 | High(大規模系統性問題,已有真實可利用實例) |
| CVE | CVE-2025-68143、CVE-2026-27735(Anthropic Git MCP Server);研究同時引用既有 CVE-2025-53110、CVE-2025-53109(Filesystem MCP Server)作為漏洞模式benchmark |
| 來源 | [arXiv:2610.22301](https://arxiv.org/abs/2610.22301)、[skycloak.io 技術解讀](https://skycloak.io/blog/mcp-filesystem-capability-laundering/) |

## 攻擊面分析

攻擊路徑分兩段,而且不需要繞過任何 LLM 的安全防線——重點完全在 MCP server 的程式碼品質,不是 prompt 層。第一段是「怎麼讓伺服器碰到不該碰的路徑」:攻擊者通常不是直接操控使用者,而是透過 agent 讀到的外部文字(一個惡意網頁、一則 issue 留言)去誘導模型把工具參數填成別的路徑。論文舉的範例是 Git MCP Server 的 `git_init`——這個工具接受使用者指定的路徑卻完全不檢查是否落在設定好的工作目錄內,攻擊者誘導模型對 `~/.ssh` 執行 `git_init`,就把你的 SSH 金鑰目錄變成一個 Git repo;接下來只要呼叫看起來完全無害的 `git_add` 跟 `git_diff_staged`,私鑰內容就會以 diff 輸出的形式回傳給 agent。整個過程沒有一步看起來像「讀取敏感檔案」,這正是「洗白」(laundering)這個詞的來源——危險的讀取動作,是包在一個看起來合法、而且已經被批准過的呼叫裡面送出來的。

第二段是「為什麼批准視窗擋不住」:MCP client 的批准提示只會顯示工具名稱跟參數,沒有任何元件會把參數解析成真實路徑、追蹤 symlink、再跟允許目錄做比對——除非伺服器程式碼自己做這件事,否則沒人做。研究把漏洞模式拆成三層:完全沒做檢查(Python 伺服器最常見,占「缺少驗證」類別發現的 53.8%)、檢查存在但能被繞過(如 Filesystem MCP Server 的 CVE-2025-53110,用字串前綴比對導致 `/data/project-secrets` 這種手足目錄也通過了針對 `/data/project` 的檢查;以及 CVE-2025-53109 的 symlink 穿越),以及「工具宣告範圍窄、實際影響範圍寬」——Git MCP Server 案例就屬於這一類。研究團隊也指出,MCP TypeScript SDK 本身沒有提供路徑限制的 helper 函式,導致每個伺服器各自土炮,Node 伺服器在每種繞過規則中占比都達 57%–63%。對照 OWASP LLM Top 10,這個漏洞類別同時命中 **LLM06 Excessive Agency**(工具實際擁有的系統權限遠超過它宣告的用途)與 **LLM05 Supply Chain Vulnerabilities**(問題出在廣泛被引用的參考實作上,影響面隨生態系擴散)。

## 防禦做法

**立即動作**
- 盤點目前已安裝、會接受路徑/檔名/目錄參數的 MCP server,包括名稱聽起來與檔案無關的「build」「log」「diff」類工具——這類工具只要會回傳檔案內容,就是一個讀取原語,需要跟明確的讀取工具一樣的範圍限制
- 絕對不要讓本機 MCP server 跑在持有 SSH 金鑰、雲端憑證、瀏覽器登入狀態的同一個帳號下;改用專用的限權帳號或容器啟動
- 檢查正在使用的 Git / Filesystem 類 MCP server 版本:Git MCP Server 修補版本為 2025.9.25(移除 `git_init`)與 2026.1.14(`git_add` 改交由 Git CLI 處理,拒絕庫外路徑)

**長期架構**
- 對每個自建或引入的 MCP server 要求「宣告讀寫範圍」:工具該能讀哪些目錄、寫哪些目錄,要在文件裡寫清楚,拿不到路徑限制說明的工具先當作不安全
- 路徑比對一律用「解析成絕對正規路徑(處理 `..` 與 symlink)後比較路徑元件」,不要用字串前綴比對——這正是 CVE-2025-53110 被突破的原因
- 採用作業系統層級沙箱(容器、chroot、或 macOS Seatbelt 之類的應用沙箱)作第二道防線,讓伺服器程式碼裡的檢查漏洞不會直接變成真正的檔案洩漏;論文的動態測試也證實,在測試用的 sandbox 政策下,150 個已確認漏洞實例在沙箱內全部被擋下
- 導入 Netzilo 這類跨平台 agent runtime governance 工具做統一的 kill switch 與執行環境治理,或參考 Invariant Labs 在 agent 安全研究與 formal verification 上的方法,把「工具實際行為是否符合宣告」納入上線前的驗證流程

## 影響範圍

21,097 個登錄的 MCP server 裡,只有 7,222 個(34.2%)是本機開源、且走得到完整測試流程的伺服器,最終篩選出 4,806 個——換句話說,這個研究能講的是「它們實測跑得動的開源伺服器」的狀況,不是整個生態系的普遍比例。787 個(16.4%)是篩選信號、代表值得進一步檢視,不是 787 個都已確認有漏洞;真正動態測試確認可利用的是 150 個,而其中 144 個(96%)光靠最基本的路徑穿越字串就能得手,不需要特別的格式化或編碼手法。研究團隊已對 13 個發現提交協調披露,論文撰寫時部分上游修補或 CVE 指派仍在等待中。

如果你的 Agent 系統有讓本機 MCP server 存取檔案系統(幾乎所有本機 stdio 型的 server 都是),這個研究提醒的是一個很具體、很容易被忽略的檢查項目:工具批准畫面上看到的參數,跟伺服器實際會碰到的路徑,中間完全沒有任何東西幫你把關,除非伺服器自己做。

## 今日收穫

一直以為 MCP 的批准機制(client 跳出「允許這個工具呼叫嗎」的提示)至少提供了某種程度的範圍限制,但這份研究說得很直白:批准只決定呼叫會不會發生,完全不限制伺服器程式碼能碰到什麼。真正能把關的只有伺服器自己的路徑驗證,跟作業系統層的沙箱——而這兩層,連 Anthropic 官方維護的參考實作都曾經漏掉。

## 參考資料

- [arXiv:2610.22301 — My Credentials, Please: Detecting Filesystem Capability Laundering in MCP Servers at Scale](https://arxiv.org/abs/2610.22301)
- [skycloak.io — MCP Filesystem Capability Laundering: When a Harmless Tool Can Read Your SSH Keys](https://skycloak.io/blog/mcp-filesystem-capability-laundering/)
- [MCP 官方規格 — Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)
