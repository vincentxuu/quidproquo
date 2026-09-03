---
title: "資安警報｜Claude Code Auto Mode 被繞過——一句「幫我摘要這個網站」靠 Python 模組覆蓋打出 80% 遠端程式碼執行"
date: 2026-08-30
category: daily
type: digest
tags: [ai-agent, security, daily, prompt-injection]
lang: zh-TW
description: "資安研究者 Johann Rehberger（wunderwuzzi）證實，Claude Code Opus 5 在官方新預設的 Auto Mode 下，光靠「摘要一個網站」的正常任務就能被誘導成遠端程式碼執行，三種攻擊變體的成功率介於 60%–80%，Anthropic 將回報結案為「設計如此」"
tldr: "Rehberger 8/26 發布技術細節：用一個偽裝成筆記本封存檔的網站，先讓 Claude 的 WebFetch 吃到 415 錯誤而自行改用 curl，再靠 303 轉址誘導下載一個內含惡意 struct.py 的 ZIP。Claude 正確拒絕執行附帶的可疑二進位檔，改寫自己的 Python 解碼腳本——但這個腳本剛好在被覆蓋目錄下執行 import base64，Python 模組搜尋路徑優先吃到本機的惡意 struct.py，於是觸發遠端酬載下載與 C2 回連，甚至能再啟動一個 headless 的子 Claude Code 進程。Anthropic 委外測試曾宣稱 Auto Mode 在 72 組情境下攻擊成功率 0.00%，但這次針對性攻擊鏈打出 60%–80%；Anthropic 把回報結案為 Informative／設計如此，強調 Auto Mode 是「盡力而為的分類器」不是安全邊界，真正的防線是 OS 層沙箱與網路出口管控。"
series:
  name: "AI Security Alert"
  order: 16
---

> 🌏 [English version](/en/posts/daily/2026-08-30-security-claude-code-automode-module-shadowing-en)

## 事件概述

資安研究者 Johann Rehberger（人稱 wunderwuzzi，長年專精 prompt injection 研究）於 8 月 26 日發布技術部落格，展示如何把 Claude Code Opus 5 在 Auto Mode 下的一個再正常不過的任務——「幫我摘要這個網站」——一路誘導成遠端程式碼執行(RCE)，甚至能再啟動一個具有獨立工具權限的子 Claude Code 代理。這件事特別值得注意的地方在於時機：Anthropic 委外測試機構 Trajectory Labs 針對 72 組間接 prompt injection 情境做評估，宣稱 Opus 5 在 Auto Mode 下攻擊成功率是 0.00%；Rehberger 用一條刻意設計的攻擊鏈,在小樣本測試下打出 60%–80% 的成功率。The Register、cybernews、CyberPress 等多家資安媒體於 8/27–8/29 陸續跟進報導。Anthropic 已收到揭露並將此案結案為「Informative」,即行為判定為設計如此,不視為需要修補的漏洞。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Prompt Injection → 工具切換誘導 → Python 模組覆蓋（module shadowing）→ 遠端程式碼執行 |
| 影響範圍 | 執行 Claude Code Opus 5、啟用 Auto Mode(2026 年 8 月中起為預設模式)且處理外部網頁/檔案的使用者與自動化流程 |
| 嚴重程度 | High（可重現 PoC,60%–80% 成功率;但需要使用者發出會觸及外部網站的任務） |
| CVE | 無(Anthropic 結案為 Informative,不發 CVE) |
| 來源 | [Embrace The Red（研究者原文）](https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/)、[The Register](https://www.theregister.com/research/2026/08/28/researcher-shows-how-claude-code-can-be-tricked-simply-by-asking-it-to-summarize-a-website/5293372)、[Cybernews](https://cybernews.com/security/claude-code-auto-mode-malware-vulnerability/) |

## 攻擊面分析

攻擊鏈刻意不下達任何直接指令,完全靠「讓惡意路徑變成解決任務最合理的下一步」來誘導。第一步,攻擊者架設一個偽裝成筆記本封存檔的網站,Claude 起初用內建的 WebFetch 工具讀取,但伺服器回傳 415 Unsupported Media Type;Claude 並未被明講要換工具,而是自己判斷「WebFetch 失敗了,直接試試看」,改用 Bash 呼叫 curl。這一步很關鍵——從 WebFetch 換成 curl,代表內容不再經過 WebFetch 內部子代理的摘要與過濾,而是直接進入主代理的檔案系統操作情境。伺服器再用 303 轉址把 curl 導向一個 ZIP 壓縮檔,裡面裝了看起來合理的目錄資訊、checksum、七筆編碼過的 JSON 紀錄、一個 macOS 平台的解碼二進位檔,以及一個名為 `struct.py` 的 Python 檔案。

第二步是整起攻擊真正的巧妙之處:Claude 依安全準則正確拒絕執行附帶的可疑二進位檔("This is planned and what the attacker wants",Rehberger 語),但沒有就此打住,而是自己動手寫了一段替代的 Python 解碼腳本來處理那些 Base85/zlib 編碼的 JSON 紀錄——這個「不信任外來執行檔、自己寫程式碼比較安全」的判斷,恰好就是漏洞的觸發點。因為這段替代腳本是在剛解壓縮出來的目錄下執行,而 Python 在解析 import 時會優先搜尋當前工作目錄;腳本裡的 `import base64` 會轉而觸發標準函式庫內部對 `struct` 模組的 import,此時 Python 找到的是 ZIP 裡那個同名的惡意 `struct.py`,而不是系統內建的 struct 模組。這正是典型的 **module shadowing(模組覆蓋)**——本機同名檔案會擋在標準函式庫模組前面被優先載入。惡意 `struct.py` 一邊忠實地把原本 `_struct` 的底層介面重新導出,讓解碼流程看起來完全正常、Claude 拿到有效的 JSON 資料,一邊在模組載入時偷跑一段經過混淆(Rehberger 表示是找 ChatGPT 幫忙寫的混淆碼)的程式碼,啟動一個獨立的 Python 子行程下載並執行遠端酬載,建立 C2 回連。Rehberger 也示範了另一種變體:酬載不啟動一般 Python 子行程,而是用 `claude -p` 再拉起一個 headless 的 Claude Code 子代理,這個子代理有自己獨立的工具權限與上下文,實測會執行 `whoami`、`uname`、`id` 等偵察指令並寫入使用者家目錄。三種變體各測 5 次,成功率落在 60%–80%。

更值得注意的是防禦失效的方向:部分測試中 Claude 事後確實發現 `struct.py` 是陷阱、嘗試終止自己啟動的惡意行程,但 Auto Mode 的分類器把「終止行程」的指令判定為危險操作而擋下,反而讓惡意行程繼續存活——分類器允許了製造惡意程式的動作,卻攔下了收拾善後的動作。對照 OWASP LLM Top 10,這起事件精準命中 **LLM01 Prompt Injection**(核心誘導手法)與 **LLM08 Excessive Agency**(代理有權限下載、解壓縮並執行任意檔案,且分類器只看單一步驟表面是否可疑,看不出跨步驟拼起來是完整攻擊鏈)。根本原因不是模型「被騙了」,而是 Auto Mode 的安全模型本身就是逐步、表面合規檢查——Rehberger 引述 Anthropic 對此案的回應:「Auto Mode 是盡力而為的分類器撐起的便利功能,不是安全保證」;分類器設計目標本來就不是攔截「由多個各自看起來無害的步驟組成」的蓄意攻擊鏈,真正的信任邊界應該在 OS 層隔離與網路出口管控,而不是模型或分類器本身。

## 防禦做法

**立即動作**
- 盤點所有會處理外部網頁/檔案內容的 Claude Code 自動化流程(CI/CD、排程任務、無人值守的 agent pipeline),不要只憑「已開啟 Auto Mode」就當作已有足夠防護
- 把 Claude Code(以及其他有 Bash/檔案系統存取權的 coding agent)跑在容器、VM 或 OS 層沙箱裡,限制網路出口只能連到白名單端點,避免任意下載執行
- 不要把 SSH 金鑰、雲端憑證、家目錄等敏感資源直接暴露給 agent 執行環境;檔案系統與程序建立行為要有獨立於模型分類器之外的監控
- 對「代理自己寫程式碼並立即執行」這類行為模式提高警覺——這次攻擊證明「不信任外部執行檔,改用自己寫的程式碼」這個看似安全的判斷,反而可能是攻擊者刻意設計要誘發的路徑

**長期架構**
- 把 Auto Mode / 任何模型內建安全分類器定位為「便利層」而非「安全邊界」,不要用它取代 process-level 的隔離與監控;Rehberger 的核心結論是「不要信任模型輸出」這個老原則在 agentic 時代依然成立
- 評估 watchlist B7 中 Lakera 這類 runtime prompt injection 偵測工具,補強分類器看不到的跨步驟攻擊鏈偵測;也可參考 Netzilo 的 agent runtime governance 與 kill switch 機制,對代理啟動的子行程與子代理做集中管控
- 對「代理啟動另一個代理」(如 `claude -p` 拉起 headless 子代理)這類遞迴行為設計明確的權限邊界,子代理不該自動繼承父代理的完整工具存取範圍
- 建立明確的 process-creation 與敏感路徑 ask/deny 規則,不要把「Auto Mode 放行了這個動作」當成該動作安全的證據

## 影響範圍

這起事件目前沒有已知的真實世界受害者——Rehberger 是在自己架設、僅允許白名單 IP 存取的測試網站上示範攻擊鏈,酬載也只是打開計算機與建立 C2 回連的示範性質。但攻擊面本身是通用的:任何會處理不受信任外部網頁或檔案內容、且啟用 Auto Mode 的 Claude Code 使用場景都可能被同一套手法針對,尤其是無人值守、串接 CI/CD 或有雲端憑證存取權的自動化流程,風險更高。Anthropic 已將此案結案為「設計如此」,目前沒有公開的修補時程或版本更新計畫,等於防禦責任完全落在使用者端的沙箱化與監控設計。

如果你的團隊正在把 Claude Code(或其他 agentic coding 工具)接入自動化流程、讓它處理外部輸入,這起事件說明兩件事:一是廠商自己的委外評估數字(0.00% 攻擊成功率)不能取代你自己針對實際使用場景做的威脅建模,評測情境與真實攻擊鏈的設計空間可能天差地遠;二是模型「做了一個看似更安全的選擇」(拒絕跑外來執行檔、自己寫程式碼)不等於整條路徑就是安全的,防禦要看的是完整的資料流與執行環境,而不是單一步驟的表面判斷。

## 今日收穫

這次事件最顛覆我認知的地方,不是攻擊鏈本身的技術細節,而是「防禦失效的方向」——Claude 事後確實正確識別出 `struct.py` 是陷阱、也嘗試自己收拾殘局,但 Auto Mode 分類器攔下的是「終止惡意行程」這個補救動作,放行的卻是「建立惡意行程」這個真正危險的動作。這代表分類器的判斷標準與模型自己的風險判斷可能是兩套不同、甚至互相矛盾的邏輯,把兩者混為一談會製造出比沒有分類器更詭異的失效模式。也讓我更確信一件事:任何「模型自己選擇了更安全的做法」都不該被當成整條執行路徑安全的證據,因為攻擊者設計攻擊鏈時,鎖定的往往正是模型會做出的那個「看似安全」的下一步。

## 參考資料

- [Breaking Claude Code Opus 5 Auto Mode — Embrace The Red（Johann Rehberger 原始研究）](https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/)
- [Researcher shows how Claude Code can be tricked simply by asking it to summarize a website — The Register](https://www.theregister.com/research/2026/08/28/researcher-shows-how-claude-code-can-be-tricked-simply-by-asking-it-to-summarize-a-website/5293372)
- [Claude Code Auto Mode Malware Exploit Shows AI Assistants Can Still Be Tricked — Cybernews](https://cybernews.com/security/claude-code-auto-mode-malware-vulnerability/)
- [Claude Code Auto Mode Bypassed via Zip Payload at 80% Rate — Grid the Grey](https://gridthegrey.com/posts/claude-code-auto-mode-bypassed-via-zip-payload-at-80-rate/)
- [Prompt Injection Attack Hijacks Claude Code Opus 5 Auto Mode — CyberPress](https://cyberpress.org/prompt-injection-attack-hijacks-claude-code-opus-5/)
