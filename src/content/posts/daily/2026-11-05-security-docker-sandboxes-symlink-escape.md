---
title: "資安警報｜Docker Sandboxes 符號連結沙箱逃逸——sbx cp 讓 AI coding agent 摸到主機 SSH 金鑰與雲端憑證（CVE-2026-103916）"
date: 2026-11-05
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "AI 供應鏈安全公司 Endor Labs 11/3 揭露 CVSS 8.2 的 Docker Sandboxes 漏洞：sbx cp 複製指令不檢查工作區白名單，讓沙箱內的 agent 用符號連結讀寫沙箱外的主機檔案，Docker 11/3 發布 v0.51.0 修復。"
tldr: "Endor Labs 11/3 公開 CVE-2026-103916（CVSS 8.2）：Docker Sandboxes 的 sbx cp 指令不檢查工作區白名單，只要在已核准的工作區裡放一個符號連結，就能讓主機端的複製指令讀出 ~/.ssh、~/.aws 等敏感檔案，或把任意內容寫進主機任意目錄。Claude Code、Codex、Gemini CLI 都可能用這套沙箱跑 agent，原訂 10/13 的修補其實不完整，11/3 才真正修好，務必升級到 v0.51.0。"
series:
  name: "AI Security Alert"
  order: 72
---

> 🌏 [English version](/posts/daily/2026-11-05-security-docker-sandboxes-symlink-escape-en)

## 事件概述

AI 供應鏈安全公司 Endor Labs 在 11 月 3 日公開一個編號 CVE-2026-103916 的漏洞，影響 Docker Sandboxes（以 `sbx` CLI 操作的獨立微虛擬機沙箱，用來隔離 Claude Code、Codex、Gemini CLI 等 AI coding agent）。問題出在 `sbx cp`——沙箱與主機之間複製檔案用的指令——完全不檢查使用者事先核准的工作區白名單；只要沙箱裡的 agent 在已核准的工作區中放一個指向主機任意路徑的符號連結，接下來操作者在主機上執行的任何一次 `sbx cp`，就可能把主機的敏感檔案讀進沙箱，或把沙箱控制的內容寫到主機任意目錄。Docker 原訂 10 月 13 日在 v0.48.0 修補，但事後發現修補不完整，真正的修復版本是 11 月 3 日發布的 v0.51.0。CVSS 3.1 評為 8.2（High），目前沒有證據顯示已被公開利用，但技術細節與可重現的 PoC 已經全文公開。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | 沙箱邊界逃逸（CWE-59 Improper Link Resolution Before File Access，符號連結追蹤） |
| 影響範圍 | Docker Sandboxes（`sbx` CLI），所有在修補前透過 `sbx cp` 搬移檔案的使用情境；受影響的 agent 平台包含 Claude Code、Codex、Gemini CLI 等跑在 Docker Sandboxes 上的工具 |
| 嚴重程度 | High（CVSS 3.1 8.2；CVSS 4.0 7.3） |
| CVE | CVE-2026-103916 |
| 修補版本 | Docker Sandboxes ≥ v0.51.0（10/13 的 v0.48.0 修補不完整） |
| 來源 | [Endor Labs 研究報告](https://www.endorlabs.com/learn/docker-sandboxes-vulnerability-lets-ai-agents-access-sensitive-files-outside-their-sandbox-cve-2026-103916)、[Rapid7 漏洞資料庫](https://www.rapid7.com/db/vulnerabilities/cve-2026-103916)、[CVE Record](https://www.cve.org/CVERecord?id=CVE-2026-103916) |

## 攻擊面分析

Docker Sandboxes 的安全模型靠一份「白名單」運作：開發者明確核准幾個資料夾（通常是專案工作區）透過 virtio-fs 掛進沙箱的微虛擬機，agent 理論上只能碰到白名單裡的路徑。問題是 `sbx cp` 走的是另一條完全獨立的通道——它不是透過共享檔案系統，而是 CLI 行程在主機端直接做一般的檔案 I/O，用操作者本人的完整權限執行，從頭到尾都沒有查過白名單。真正的漏洞藏在這條指令怎麼處理符號連結：Endor Labs 指出一次複製的路徑有四個「連結可能出現的位置」（複製目的地的最後一段／上層目錄、複製來源的最後一段／上層目錄），`sbx cp` 唯一的防護旗標 `-L` 只守住其中一個位置（複製來源的最後一段），另外三個位置預設都會原樣追蹤連結。因為工作區對沙箱是可讀寫的，沙箱裡的 agent 可以把工作區裡任何一個子目錄換成指向主機任意路徑的符號連結——放連結這個動作本身在沙箱內完全無害（連結在沙箱裡是斷鏈的），只有當操作者在主機端對著這個看起來像工作區子路徑的目的地執行 `sbx cp` 時，連結才會在主機上被解析並生效。

Endor Labs 示範了兩個方向：寫入時，沙箱在工作區放一個指向 `~/.ssh` 的連結，操作者複製一個 log 檔案出來，結果內容被寫進了 `~/.ssh/notes.txt`；讀取時，沙箱把連結放在路徑的上層目錄，操作者複製一個看起來在工作區內的檔案進沙箱，結果主機上 `~/.aws/credentials` 之類的檔案被整份讀進了沙箱。最關鍵的是,這兩個操作都是 `sbx cp --help` 教的標準用法,而且 agent 在一般工作流程裡本來就常常是「建議」操作者執行這類複製指令的一方——操作者很可能只是照著 agent 的建議貼一行指令,完全看不出目的地其實已經被偷換過。複製成功時沒有任何輸出,也不像 `sbx mount` 會印出解析後的路徑,人在旁邊監看也抓不到異常。

```diagram
title: Docker Sandboxes sbx cp 符號連結逃逸鏈（CVE-2026-103916）
desc: 沙箱內的 agent 用符號連結偷換工作區子目錄，誘使操作者在主機執行的 sbx cp 讀寫沙箱外的檔案
caption: 步驟 1–6 皆為 Endor Labs 已實測重現的攻擊路徑，-L 旗標只防護其中一個連結位置
step: 不受信任內容（網頁、依賴套件）夾帶指令，誘使沙箱內的 agent 在工作區放符號連結
step: Agent 把工作區子目錄換成指向主機 ~/.ssh 或 ~/.aws 的符號連結（沙箱內看不出異常，連結是斷鏈）
step: Agent 建議操作者執行一個像是搬移 log／建置產物的 sbx cp 指令
step: 操作者在主機信任這個建議，執行 sbx cp
step: sbx cp 在主機端解析路徑時原樣追蹤符號連結，allowlist 完全沒被檢查
step: 主機敏感檔案被複製進沙箱，或沙箱內容被寫進主機任意目錄（如 ~/.ssh/authorized_keys）
---
<svg viewBox="0 0 640 460">
  <line class="dg-rule" x1="140" y1="72" x2="140" y2="440"/>
  <line class="dg-rule" x1="500" y1="72" x2="500" y2="440"/>

  <g data-step="1">
    <path class="dg-line dg-line--dashed" d="M144 112H492" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="318" y="100" text-anchor="middle" dominant-baseline="central">夾帶指令的不受信任內容</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M144 160H492" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="318" y="148" text-anchor="middle" dominant-baseline="central">ln -s 工作區子目錄 → 主機路徑</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--dashed" d="M496 208H144" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="320" y="196" text-anchor="middle" dominant-baseline="central">建議執行 sbx cp</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M144 256H492" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="318" y="244" text-anchor="middle" dominant-baseline="central">操作者執行 sbx cp</text>
  </g>
  <g data-step="5">
    <path class="dg-line" d="M144 304H492" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="318" y="292" text-anchor="middle" dominant-baseline="central">追蹤符號連結，略過 allowlist</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--accent" d="M504 352H532Q540 352 540 360V368Q540 376 532 376H508" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="552" y="364" dominant-baseline="central">讀出／寫入主機檔案</text>
  </g>

  <rect class="dg-box" x="496" y="100" width="8" height="280" rx="2" data-step="1 2 3 4 5 6"/>

  <rect class="dg-box" x="60" y="24" width="160" height="48" rx="6"/>
  <text class="dg-label" x="140" y="48" text-anchor="middle" dominant-baseline="central">沙箱內的 Agent</text>

  <rect class="dg-box" x="408" y="24" width="184" height="48" rx="6"/>
  <text class="dg-label" x="500" y="40" text-anchor="middle" dominant-baseline="central">操作者主機</text>
  <text class="dg-sub" x="500" y="60" text-anchor="middle" dominant-baseline="central">sbx cp</text>
</svg>
```

對照 OWASP LLM Top 10：觸發這條攻擊鏈的起點是 **LLM01 Prompt Injection**——不受信任的內容（網頁、依賴套件、文件）指示 agent 去放置符號連結；但真正造成損害的根因是 **LLM08 Excessive Agency**，agent 在「已核准工作區可讀寫」這個合理授權之下，被允許去操縱一條沙箱安全模型完全沒有管到的檔案通道，使得它拿到的實際權限遠超過白名單原本想授予的範圍。

## 防禦做法

**立即動作**
- 檢查目前使用的 Docker Sandboxes 版本：`sbx --version`，v0.51.0 以前都受影響，10/13 的 v0.48.0 並未真正修好
- 立刻升級到 v0.51.0
- 升級前，把 `sbx cp` 當成一個不受信任方寫的指令來對待：不管是複製進或複製出，先用 `realpath` 自己確認路徑真的落在工作區內，再執行；對 agent 自己建議的複製指令要特別提高警覺

**長期架構**
- 稽核任何「白名單 / allowlist 作為信任邊界」的沙箱設計是否真的覆蓋了所有進出通道——這次問題不在 virtio-fs 共享檔案系統本身，而在另一條平行的複製通道完全被漏檢；同一研究者今年稍早在 brig 專案也發現同一種「第二條通道被遺漏」的模式
- 把搬動檔案在內的沙箱輔助指令也納入 agent 執行監控，而不是只信任沙箱邊界本身；可考慮導入 Zenity 這類 agent runtime 安全工具，持續記錄 agent 對檔案系統與主機路徑的存取模式，讓類似的靜默複製有事後可查的軌跡
- 優先選擇會把解析後路徑印出來的工具行為（如 Docker 自家 `sbx mount` 的做法），複製動作不出現任何輸出本身就是一個該被淘汰的設計

## 影響範圍

Endor Labs 沒有公開有多少環境在使用 Docker Sandboxes，但凡是用 `sbx run claude`、`sbx run codex` 之類指令跑 AI coding agent 的開發機，只要曾經或正在執行低於 v0.51.0 的版本、又用過 `sbx cp` 搬動檔案，理論上都暴露在這個風險下。寫入原語可以把任意內容放進操作者整個家目錄下任何已存在的路徑，進而改寫 `~/.ssh/authorized_keys`、`~/.gitconfig` 的 pager 設定或 git hook 腳本，把一次檔案寫入轉成下一次操作者執行一般指令時的程式碼執行——Endor Labs 說明了這條推理但未實際示範；讀取原語相對弱一些,需要操作者自己打對一個存在的檔名,但由於這類複製指令往往是 agent 自己建議的,猜中檔名（如 `~/.aws/credentials`、`~/.ssh/id_ed25519`）並不難。目前沒有公開資料顯示此漏洞已遭在野利用,但技術細節、CVSS 評分與可重現步驟都已經公開,掃描與利用的門檻不高。

## 今日收穫

這次事件提醒我,沙箱安全模型的風險常常不在被反覆稽核的主要邊界（這次是 virtio-fs 掛載與白名單),而在看起來像是「操作者自己的動作」、因此被排除在威脅模型之外的輔助通道——複製指令跑在主機端、以操作者權限執行,安全設計很容易假設「反正是人自己要複製的,應該安全」,卻忘了 agent 可以提前佈置好陷阱,等操作者的手去觸發。同一位研究者在另一個沙箱產品 brig 上發現同樣的模式,說明這不是 Docker 特有的疏漏,而是「主要共享通道管得很嚴,次要的檔案搬移通道完全沒人管」這種結構性盲點,值得在稽核任何 agent 沙箱時單獨拉出來檢查。

## 參考資料

- [Endor Labs — Docker Sandboxes vulnerability lets AI agents access sensitive files outside their sandbox (CVE-2026-103916)](https://www.endorlabs.com/learn/docker-sandboxes-vulnerability-lets-ai-agents-access-sensitive-files-outside-their-sandbox-cve-2026-103916)
- [Rapid7 Vulnerability Database — CVE-2026-103916](https://www.rapid7.com/db/vulnerabilities/cve-2026-103916)
- [CVE Record — CVE-2026-103916](https://www.cve.org/CVERecord?id=CVE-2026-103916)
- [Endor Labs — Project Mount: Symlink Traversal in Brig（同一研究者早前在 brig 發現的同類漏洞）](https://www.endorlabs.com/learn/project-mount-symlink-traversal-in-brig-how-a-sandbox-reaches-host-directories-it-was-never-given)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
