---
title: "裝 skill 與 MCP 前怎麼掃：SkillSpector、Cisco、Snyk agent-scan 與 AgentSeal 能擋什麼"
date: 2026-10-24
category: ai
type: deep-dive
tags: [security, agent-skills, mcp, supply-chain, ai-agent]
lang: zh-TW
series:
  name: "AI Agent 資安工具地圖"
  order: 1
tldr: "安裝前掃描器有三種做法：靜態規則、LLM 判斷、實際連線讀 MCP server。Cisco 自己的文件顯示，規則單獨只抓到約 8% 的惡意樣本；第三方測試也顯示，換一批樣本數字就大幅改變。掃描器適合當輔助篩選，「沒有發現」不等於安全。"
description: "比較四個開源的 skill 與 MCP 安裝前掃描器的做法、資料外送與執行風險，並說明報告怎麼讀、公開的偵測數字為什麼不能直接拿來比，以及實際怎麼用。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-10-24-skill-mcp-pre-install-scanners-en)

你從 GitHub 找到一個看起來很實用的 skill，準備放進自己的 skill 目錄。安裝前掃描器做的事很單純：在你裝之前，先讀它的檔案和說明，找有沒有惡意的模式，例如偷讀憑證、把資料送到外面、藏在說明裡的指令。

這一篇比較四個開源工具：NVIDIA 的 [SkillSpector](https://github.com/NVIDIA/SkillSpector)、Cisco 的 [skill-scanner](https://github.com/cisco-ai-defense/skill-scanner)、Snyk 的 [agent-scan](https://github.com/snyk/agent-scan)，以及 [AgentSeal](https://github.com/getagentseal/agentseal)。適合讀過[系列地圖](/posts/ai/2026-10-24-ai-agent-security-tooling-map)、手上已有一批 skill 或 MCP 設定的人。內容依據各專案的原始碼與文件，以及公開的研究，沒有安裝實測。

## 三種做法

**靜態規則。** 用正規表示式、語法樹和 YARA 規則比對已知的惡意模式。SkillSpector 以這類做法為主，LLM 是可選的輔助，而且 LLM 只能增加發現，不能撤銷規則已經抓到的項目。它的 README 寫明掃描過程不會執行被掃描的 skill。

**LLM 判斷。** 讓模型讀 skill 的說明和程式碼，判斷意圖。Cisco 的規則本身很輕，官方文件寫：只用規則，在沒見過的惡意樣本上只抓到約 8%，所以推薦的設定都要開 LLM judge。

**實際連線。** 對 MCP server，直接連上去讀它對外宣告的工具描述。這要先把 server 跑起來：AgentSeal 的 `scan-mcp` 會把目標 server 當子行程啟動，Snyk 的 agent-scan 也會啟動 stdio 類型的 MCP server，並在啟動前問你同意。為了掃描而先執行它，跟「安裝前不執行」的原則是互相衝突的。agent-scan 原本是 Invariant Labs 的 mcp-scan，舊網址現在導向 Snyk 的 repo；它會自動找出 `~/.claude` 底下的 skill 與 `.mcp.json`，再把內容送到 Snyk 的遠端 API 分析，需要 token。

| 工具 | 主要做法 | 會不會執行目標 | 內容送去哪 |
|---|---|---|---|
| SkillSpector | 規則、AST、YARA，LLM 可選 | 自述不執行 | LLM 預設啟用，檔案內容送給你設定的 provider；加 `--no-llm` 才留在本機 |
| skill-scanner | 規則、YARA、AST，建議搭配 LLM judge | 文件沒有明說 | 依你設定的 LLM，另可選接 VirusTotal 與 Cisco 的雲端服務 |
| agent-scan | 本機找出設定，遠端分析 | 會啟動 stdio 類型的 MCP server，啟動前有同意提示 | 設定與工具描述送到 Snyk 的 API，需要 token |
| AgentSeal | 規則、去混淆、嵌入模型；`scan-mcp` 連線 | `scan-mcp` 會啟動目標 server | 授權為 FSL-1.1（不是開放原始碼授權），最後一次更新在 2026-06 |

## 一份掃描報告怎麼讀

SkillSpector 的輸出是一個風險分數，超過門檻就標成「不要安裝」。分數由各項發現依嚴重度加權相加。

外部使用者在 [issue #644](https://github.com/NVIDIA/SkillSpector/issues/644) 回報：關掉 LLM 時，有幾組規則的發現全是誤報，例如把檔案開頭的 BOM 當成隱藏指令，或把 `relationshipList` 裡的 `plist` 當成可疑字串。最大的分數來源是一組逐行重複的高嚴重度發現，一個沒有實際問題的 skill 也可能因此被判成「不要安裝」。

反過來，「沒有發現」只代表沒有比對到已知的模式。Cisco 的 README 自己寫明，它不保證 skill 是安全的。

所以今晚就能做的是：挑你最常用的那個 skill，掃一次。對報告裡每一項發現，打開對應的那一行，問兩個問題：這是這個 skill 本來就該做的事嗎？它的說明有沒有提到？一個 GitHub 自動化 skill 會讀 token，這是它的本職；一個整理筆記的 skill 去讀 `~/.ssh`，才是該停下來的訊號。

## 這些數字能不能信

規則單獨的表現，Cisco 的[實測文件](https://github.com/cisco-ai-defense/skill-scanner/blob/main/docs/reference/measured-results.md)公開得很清楚，也寫了一件多數廠商不會說的事：規則在開發用的資料上，召回率約 31%，到了沒見過的資料上只剩約 8%。同一份文件還承認，開發過程中有兩次違規用了原本凍結的測試資料。

搭配 LLM judge 之後，召回率拉到約 67%，誤報率約 15%，代價是更慢、更貴。

第三方的測試顯示掃描器容易被繞過。[Trail of Bits 在 2026 年 6 月的文章](https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/)裡，用十萬個換行把惡意程式碼擠出 LLM 的上下文，或把惡意邏輯藏進 `.pyc` 位元組碼，繞過了 Cisco 的掃描器。[Adversa 的測試](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/)涵蓋 8 個開源掃描器，在關閉 LLM 判斷的條件下，每一個都讓惡意 skill 通過；SkillSpector 被同形字、改寫過的注入指令和圖片裡的文字繞過。SkillSpector 的 README 自己列出的限制，也包含非英文內容、圖片攻擊與加密或二進位程式碼。Adversa 同時賣類似的資安產品，讀它的結論時要記得這個背景。

數字也會隨資料集大幅改變。[MalSkillBench](https://arxiv.org/abs/2606.07131) 是獨立研究者做的評測資料集：VirusTotal 在全部樣本上的召回率是 21.6%，在其中的野外樣本子集上是 87.9%。作者的解釋是，野外樣本幾乎都屬於同一種行為，高召回主要由這一種行為撐起來，不代表涵蓋廣。這個資料集本身也有爭議，有第三方指出一成多的惡意樣本其實是空目錄。

結論是，目前沒有一份大家公認的中立評測能告訴你哪個掃描器比較準。廠商公布的數字，是在它自己選的資料上跑出來的。

## 怎麼用

1. **當輔助篩選，不當閘門。** 新 skill 先掃一次，有高風險發現就先人工看那一行，再決定要不要裝。
2. **把「沒讀完」當成沒通過。** SkillSpector 有 `--fail-on-incomplete` 這類選項，掃描覆蓋不完整就回傳失敗，這個概念值得照抄：掃不完的檔案，不代表沒問題。
3. **掃之前先想內容會送去哪。** 含有私人資料或內部程式碼的 skill，用 `--no-llm` 或本機模型，不要直接送給雲端 provider。
4. **知道哪些掃描會把目標跑起來。** 對還不信任的 MCP server，會啟動它的掃描方式要先放進隔離環境，不要直接在日常的工作環境執行。下一篇談的沙箱就是這個用途。
5. **別把輸出直接接進自動化。** agent-scan 的 README 寫明輸出格式是實驗性質，可能不預警改變；用腳本解析它的輸出再做擋或放的決定，升級後可能悄悄失效。

## 整體來說

安裝前掃描器的價值是在你還沒執行任何東西之前，先幫你挑出該人工看的地方。它們擋不住改寫過的注入、圖片裡的指令，或是裝了之後才改內容的 skill。公開的偵測數字都來自作者自己或有利益關係的測試，不能直接比較。把它當成第一道篩子，而不是通行證。下一篇談第二道：假設 agent 已經被騙，沙箱能限制它碰到什麼。

## 參考資料

- [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector)
- [SkillSpector issue #644：誤報回報](https://github.com/NVIDIA/SkillSpector/issues/644)
- [cisco-ai-defense/skill-scanner](https://github.com/cisco-ai-defense/skill-scanner)
- [skill-scanner 的實測結果文件](https://github.com/cisco-ai-defense/skill-scanner/blob/main/docs/reference/measured-results.md)
- [snyk/agent-scan](https://github.com/snyk/agent-scan)
- [getagentseal/agentseal](https://github.com/getagentseal/agentseal)
- [Trail of Bits：The sorry state of skill distribution](https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/)
- [Adversa AI：八個 agent skill 掃描器的繞過測試](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/)
- [MalSkillBench（arXiv:2606.07131）](https://arxiv.org/abs/2606.07131)
- [AI Agent 的資安工具怎麼分：風險入口、七類工具與三個共通限制](/posts/ai/2026-10-24-ai-agent-security-tooling-map)
