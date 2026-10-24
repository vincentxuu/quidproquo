---
title: "裝 skill 與 MCP 前怎麼掃：SkillSpector、Cisco skill-scanner、Snyk agent-scan 與 AgentSeal 能看出什麼"
date: 2026-10-24
category: ai
type: deep-dive
tags: [security, agent-skills, mcp, supply-chain, ai-agent]
lang: zh-TW
series:
  name: "AI Agent 資安工具地圖"
  order: 1
tldr: "這四個安裝前掃描器的做法可以分成靜態規則、LLM 判斷、實際連線讀 MCP server 三種，多數同時用兩種以上。Cisco 自己的文件顯示，只靠規則時，面對沒見過的惡意樣本只抓到約 8%；第三方測試也顯示，換一批樣本數字就大幅改變。掃描器適合當輔助篩選，「沒有發現」不等於安全。"
description: "比較四個公開原始碼的 skill 與 MCP 安裝前掃描器的做法、資料外送與執行風險，說明報告怎麼讀、公開的偵測數字為什麼不能直接比較，以及實際怎麼用。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-10-24-skill-mcp-pre-install-scanners-en)

你從 GitHub 找到一個看起來很實用的 skill，準備放進自己的 skill 目錄。安裝前掃描器做的事很單純：在你裝之前，先讀它的檔案和說明，找有沒有惡意的模式，例如偷讀憑證、把資料送到外面、藏在說明裡的指令。

在[系列地圖](/posts/ai/2026-10-24-ai-agent-security-tooling-map)上，這是第一類工具，管的是「你裝進去的東西」這個入口：skill 還躺在目錄裡、還沒被 agent 讀到之前。掃描器多做的，是把整個目錄批次過一遍，交給你一份要人工看的清單；它沒有多做的，是替你判斷安不安全。

這一篇比較四個公開原始碼的工具：NVIDIA 的 [SkillSpector](https://github.com/NVIDIA/SkillSpector)、Cisco 的 [skill-scanner](https://github.com/cisco-ai-defense/skill-scanner)、Snyk 的 [agent-scan](https://github.com/snyk/agent-scan)，以及 [AgentSeal](https://github.com/getagentseal/agentseal)（它的授權不算開放原始碼，見表）。適合手上已有一批 skill 或 MCP 設定的人。內容依據各專案的原始碼與文件，以及公開的研究，沒有安裝實測。

## 先講兩個詞

召回率是一百個壞 skill 裡抓到幾個；誤報率是一百個好 skill 裡被錯殺幾個。兩個要一起看：把所有 skill 都標成危險，召回率就是 100%，誤報率也是 100%。

## 三種做法

**靜態規則。** 用正規表示式、語法樹和 YARA 規則比對已知的惡意模式。SkillSpector 以這類做法為主，LLM 是可選的輔助，只能替規則抓到的項目補上說明、提高信心，不能撤銷或調低。它的 README 寫明掃描過程不會執行被掃描的 skill。

**LLM 判斷。** 讓模型讀 skill 的說明和程式碼，判斷意圖。Cisco 的文件寫：只用規則，面對沒見過的惡意樣本只抓到約 8%，所以推薦的設定都要開 LLM judge。

**實際連線。** 對 MCP server，直接連上去讀它對外宣告的工具描述，要先把 server 跑起來。AgentSeal 的 `scan-mcp` 在 stdio 模式下會把目標 server 當子程序啟動（`--sse` 模式只連線）。Snyk 的 agent-scan 也會啟動 stdio 類型的 MCP server；互動執行時啟動前會問你同意，加上 `--dangerously-run-mcp-servers` 就略過詢問。這類掃描要先執行目標，所以掃描本身就有執行風險，官方建議對不信任的設定在容器或虛擬機裡掃。

| 工具 | 主要做法 | 會不會執行目標 | 內容送去哪 | 授權與維護 |
|---|---|---|---|---|
| SkillSpector | 規則、AST、YARA，LLM 可選 | 自述不執行 | LLM 預設啟用，檔案內容送給你設定的 provider；加 `--no-llm` 後留在本機，但依賴套件名稱與版本仍會送 OSV.dev 查弱點 | Apache-2.0 |
| skill-scanner | 規則、YARA、AST，建議搭配 LLM judge | 文件沒有明說 | 依你設定的 LLM，另可選接 VirusTotal 與 Cisco 的雲端服務 | Apache-2.0 |
| agent-scan | 本機找出設定，遠端分析 | stdio 類型的 MCP server 會啟動 | MCP 設定、工具描述與 skill 內容（機密先遮蔽）送到 Snyk 的 API，需要 token | Apache-2.0；原本是 Invariant Labs 的 mcp-scan，舊網址導向 Snyk 的 repo |
| AgentSeal | 規則、去混淆、嵌入模型；`scan-mcp` 連線 | stdio 模式會啟動 | README 稱 guard 全在本機執行，同一份也列了查詢雲端信任分數的選項 | FSL-1.1：原始碼公開但不是開放原始碼授權，兩年後轉 Apache 2.0，競爭用途受限；最後一次程式碼推送在 2026-06-11 |

## 一份掃描報告怎麼讀

SkillSpector 的輸出是 0 到 100 的風險分數，加上依嚴重度對應的建議：安全、留意、不要安裝。

使用者在 [issue #644](https://github.com/NVIDIA/SkillSpector/issues/644) 回報，他掃一批公開 skill、關掉 LLM 時，有幾組規則的發現全是誤報，例如把檔案開頭看不見的標記（BOM）當成隱藏指令，這類誤報已在 9 月底的修正裡處理。他也指出，在他掃的那批 skill 裡，分數最高的一類發現是「檔案超過解析上限」，被評成高嚴重度、每個引用它的行各報一次，沒有實際問題的 skill 因此被判成「不要安裝」。之後有好幾個修正減少了這類誤觸發，但評成高嚴重度、逐行重複報的做法有沒有改，我沒有查到。

反過來，掃描器回報沒有發現，可以直接安裝嗎？不行。沒有發現只代表沒有比對到它認得的模式，Cisco 的 README 自己寫明它不保證 skill 是安全的。

## 這些數字能不能信

Cisco 的[實測文件](https://github.com/cisco-ai-defense/skill-scanner/blob/main/docs/reference/measured-results.md)寫得很清楚：規則是照開發用的資料調的。以中風險以上算抓到，規則在那份資料的開發部分召回率約 31%，到了沒見過來源的測試部分只剩約 8%；改以高風險以上計，是 7.7%，誤報率 4.0%。

加上 LLM judge 後，約 67% 的惡意樣本會進到人工審查佇列（中風險以上，誤報約 15%）；只算會被直接擋下的高風險以上，是約 34%，誤報約 6%。代價是更慢、更貴。

這些是 Cisco 自己量的。名叫 [MaliciousSkillBench](https://arxiv.org/abs/2608.19901) 的資料集，作者另外用同一份沒見過來源的測試部分（839 個惡意、545 個良性），以固定的本機設定、高風險以上才算抓到，重跑了 Cisco 的掃描器，召回率只有 2.5%；SkillSpector 關掉 LLM 的設定是 0%。他們的環境與官方不完全相同（相依套件版本有出入），所以這個數字不能直接和 7.7% 相減，但可以看出掃描器的成績取決於誰在什麼設定下量。

第三方的測試顯示掃描器容易被繞過。[Trail of Bits 在 2026 年 6 月的文章](https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/)裡，把惡意程式碼放進 `.pyc` 位元組碼、用 `.docx` 夾帶腳本，或用貌似企業配置的說明話術說服 LLM，繞過了 Cisco 的掃描器；另一招是在惡意程式碼前塞十萬個換行，讓 ClawHub 的掃描器截斷後看不到內容。文章沒有公布受測版本，現況要自己重測。

[Adversa 的測試](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/)涵蓋 8 個掃描器：7 個以離線、不開 LLM 判斷的設定實測，純 LLM 判斷的那一個另用本機模型測。每一個都讓至少一個惡意 skill 通過。SkillSpector 擋住了編碼包裝與換行填充這類（Adversa 認為編碼包裝是靠結尾的管線轉 shell 才被抓到），被外觀相同的字元、改寫過的注入指令和圖片裡的文字繞過；Adversa 測的 SkillSpector 是從 `__pycache__` 位元組碼還原的，作者自己說驗證比其他幾個弱。它的 README 自己列出的限制，也有非英文內容、圖片攻擊、加密或二進位程式碼。Adversa 自己也做同類的掃描器，讀它的結論時要記得這個背景。

數字也會隨資料集大幅改變。名字相近的 [MalSkillBench](https://arxiv.org/abs/2606.07131) 是另一組獨立研究者做的評測資料集：VirusTotal 在全部樣本上的召回率是 21.6%，在其中真實環境蒐集到的樣本子集上是 87.9%。作者的解釋是，那個子集有八成多屬於同一種行為，高召回主要由這一種行為撐起來，不代表涵蓋廣。Adversa 另外指出，它下載的這份資料副本裡約一成三的惡意樣本是空目錄，拉低了可能達到的召回上限。

目前沒有一份大家公認的中立評測能告訴你哪個掃描器比較準。廠商公布的數字，是在它自己選的資料上跑出來的；獨立資料集則顯示換一批樣本，數字就不一樣。對你來說，這些數字只能用來排「先看哪個」，不能用來決定放不放行。

## 怎麼用

1. **今晚先挑一個你最常用的 skill 掃一次。** skill 含私人資料，就用 SkillSpector 加 `--no-llm`，檔案內容留在本機（依賴套件名稱仍會查 OSV.dev）；想快一點可以用 agent-scan，但它會把內容送到 Snyk。掃完，對報告每一項發現打開它指的那一行，問兩個問題：這是這個 skill 本來就該做的事嗎？它的說明有提到嗎？GitHub 自動化 skill 讀 token 是它的本職；整理筆記的 skill 去讀 `~/.ssh`，才是該停下來的訊號。
2. **當輔助篩選，不當閘門。** 新 skill 有高風險發現，先人工看那一行再決定要不要裝。
3. **把「沒讀完」當成沒通過。** SkillSpector 的 `--fail-on-incomplete` 會在掃描沒覆蓋完整時回傳失敗。用別的工具時，自己照這個規則：哪些檔案沒被掃到，就把那些檔案打開看，不要算成沒問題。
4. **要掃還不信任的 MCP server，就在一次性的環境裡掃。** 例如一台沒放 `~/.ssh` 和雲端憑證的虛擬機，或用完即丟的容器。Claude Code 內建的 Bash 沙箱不會包住本機的 MCP server，所以開了內建沙箱不代表掃描安全。
5. **別解析輸出來做自動化決定。** agent-scan 的 README 寫明輸出格式是實驗性質，可能隨時改變、不另行通知。要做自動化，只看退出碼；升級工具前先用同一個測試 skill 跑一次，確認結果沒變。

## 整體來說

掃描器的價值，是在你還沒執行任何東西之前，先幫你挑出該人工看的地方。公開的偵測數字都來自工具作者或同類產品的廠商，獨立資料集又顯示換一批樣本結果就不同，所以把它當成第一道篩選，不要當成放行的依據。[第 2 篇](/posts/ai/2026-10-24-agent-sandboxes)談第二道：假設 agent 已經被騙，沙箱能限制它碰到什麼。

## 參考資料

- [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector)
- [SkillSpector issue #644：誤報回報](https://github.com/NVIDIA/SkillSpector/issues/644)
- [cisco-ai-defense/skill-scanner](https://github.com/cisco-ai-defense/skill-scanner)
- [skill-scanner 的實測結果文件](https://github.com/cisco-ai-defense/skill-scanner/blob/main/docs/reference/measured-results.md)
- [snyk/agent-scan](https://github.com/snyk/agent-scan)
- [getagentseal/agentseal](https://github.com/getagentseal/agentseal)
- [Trail of Bits：The sorry state of skill distribution](https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/)
- [Adversa AI：八個 agent skill 掃描器的繞過測試](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/)
- [MaliciousSkillBench（arXiv:2608.19901）](https://arxiv.org/abs/2608.19901)
- [MalSkillBench（arXiv:2606.07131）](https://arxiv.org/abs/2606.07131)
- [AI Agent 的資安工具怎麼分：風險入口、七類工具與三個反覆出現的限制](/posts/ai/2026-10-24-ai-agent-security-tooling-map)
