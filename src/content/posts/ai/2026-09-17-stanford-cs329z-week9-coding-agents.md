---
title: "Stanford CS329Z 導讀 Week 9：寫程式的智慧體，先替它造一把順手的 IDE"
date: 2026-09-10
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, rag]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 10
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 28
tldr: "第九週週三談寫程式智慧體：SWE-agent 證明介面即效能，OpenHands 把沙箱與評測做成通用底座；第二份作業週五到期，本週交付是一道會動的修 bug 考題。"
description: "帶讀 Stanford CS329Z Week 9 兩大主讀物：SWE-agent 的 ACI 介面設計與消融證據、OpenHands 的事件流沙箱與多基準評測，以及 SWE-bench 四元組考題結構與一條可動手的打包建議。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-17-stanford-cs329z-week9-coding-agents-en)

第九週是寫程式週。週一是 Guest 場（十一月十六日）。週三談 Coding 與 Software Agents（十一月十八日）。第二份作業在週五到期（十一月二十日）。

給智慧體一個 GitHub issue，它能不能自己修好，這是本週的起點。端到端流程有五步：讀懂需求、找到相關程式碼、寫出重現腳本、動手改程式、跑測試確認。最後交出的是一份 patch，外加全部通過的測試。

你可以把它想成一位會用電腦的工程師學徒：給它任務與工具，它在沙箱裡試錯前進。本週有兩篇主讀物。[SWE-agent](https://arxiv.org/abs/2405.15793) 回答介面問題：給智慧體什麼樣的工具，它才改得動程式。[OpenHands](https://arxiv.org/abs/2407.16741) 回答平台問題：沙箱、工具庫、評測如何兜成通用底座。Guest 場沒有指定讀物，本篇不寫。

## ACI：智慧體是新的一類終端使用者

靈感來自人機互動：人類有 IDE，智慧體也該有專屬介面。論文把這層抽象命名為 ACI，也就是智慧體與電腦之間的介面層。人類會自動忽略雜訊，模型卻要為每個 token 付代價，分心還會拖累表現。所以介面設計的任務很具體：讓狀態好讀、歷史精簡、動作可靠。

設計原則有四條。動作要簡單：文件短、選項少，拿起來就會用。動作要緊湊：找檔、看檔、改檔各自一氣呵成，不必跨多回合拼裝。回饋要精簡：改完立刻看到新內容，不附多餘雜訊。最後是護欄：寫壞立刻攔下，當場重寫，不讓錯誤滾雪球。

落到命令層面，搜尋有三個命令：找檔名、找字串、找目錄，結果太多就退回，請智慧體把查詢寫得更具體。開檔一次只看一百行，配上下捲動與跳行。編輯一次指定起止行並給出替換文字，外加語法檢查：壞編輯直接丟棄重來。

消融證據很直白。拿掉專屬編輯器，Lite 解析率掉將近八個百分點。拿掉語法檢查，也掉三個百分點。逐條翻搜尋結果的迭代式介面最慘：連不給搜尋工具都不如。介面不是包裝，而是效能本身。

## 鷹架即設計決策：OpenHands 的事件流與沙箱

OpenHands 把支架做成平台。前身叫 OpenDevin，後來長成社群共建的開放底座，程式碼開放在 [GitHub](https://github.com/OpenHands/openhands)。核心是一條事件流：動作與觀察按時間排成歷史，智慧體每步只讀這條流，再決定下一步。

執行環境是隔離的 Docker 沙箱，裡面有命令列、Python 直譯器與瀏覽器。智慧體的動作走 [CodeAct](https://arxiv.org/abs/2402.01030)：能用程式碼表達的，就不用逐一註冊工具。工具庫只收兩類東西：模型自己寫不出來的，以及要呼叫外部模型的。多智慧體靠委派：通用智慧體把瀏覽子任務交給瀏覽專家。

同一個通用智慧體不改提示詞，軟體、瀏覽、問答三類任務都能跑。以 [Claude](https://www.anthropic.com/claude) 系列為底座，它在 Lite 上拿下約二成六的解析率，與同期專用修 bug 系統相當。換成 GPT-4o，約二成二。短碼修 bug 基準 [HumanEvalFix](https://arxiv.org/abs/2308.07124) 上，零示範約七成九。SWE-agent 附成功軌跡作示範，拉到近八成八。

## 測試即回饋：先重現，再動手

智慧體的典型軌跡分兩段。開場先重現或定位：建檔寫重現腳本，或用搜尋命令縮小包圍圈。中段之後幾乎全是編輯加執行的迴圈：改完就跑，跑出新資訊再定位。

成功有個時間特徵：交得早的容易對。解出的案例中位數約十二步。卡住的平均步數是二十一步。解出一題的 API 花費約一點六美元。每題預算四美元，超支就自動送出當下進度。

失敗也有肖像。約五成是實作錯誤：patch 看似合理，功能就是不對。另有兩成多是連鎖壞編輯：一次手滑沒救回來，後面全跟著歪。一半以上的軌跡都吞過至少一次壞編輯，救回機率隨次數遞減。

## SWE-bench 四元組：考題長什麼樣

基準本身也是設計。每道考題是四元組：issue 原文、某個 commit 的程式庫快照、修好才會過的新測試、修前修後都要過的舊測試。前者叫 `FAIL_TO_PASS`，後者叫 `PASS_TO_PASS`。智慧體看得到前兩項，看不到後兩項，兩組全過才算解出。

完整集來自十二個 Python 倉庫。題目是兩千多道真實 issue 留下來的。[SWE-bench](https://arxiv.org/abs/2310.06770) 的 Lite 子集只留三百題，省錢省時間。SWE-agent 配當時的 [GPT-4](https://arxiv.org/abs/2303.08774)，完整集解出一成二強。Lite 子集約一成八。只檢索不動手的 [RAG](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag) 基線，在 Lite 上不到三個百分點。

## 怎麼做：給自己的倉庫出一份考題

**怎麼做**：挑自己倉庫裡一個已修好的 issue，把它包成四元組：issue 原文、當時版本、驗證用測試。智慧體只能看前兩項，在隔離沙箱裡重跑一次修 bug。測試全過才算分，沒過就把軌跡存下來，變成下一輪的教材。

## 它在課程裡的位置

[Week 8 的裁判與護欄](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety)發了工具，本週直接下場寫程式：ACI 管手感，沙箱管安全，測試管對錯。第二份作業在週五到期，季度專案的展示也就不遠了。修 bug 智慧體正是專案的好題目：考題現成，評分自動，展示效果直觀。

## 本週 Course Material 對照

延伸閱讀有三份。[Anthropic 的 Claude Code 實戰建議](https://www.anthropic.com/engineering/claude-code-best-practices)把上下文窗口當成最稀缺的資源，動手前先給智慧體可執行的驗證手段。第二份是[Young 談長運行智慧體的 harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)，初始化智慧體先鋪環境，每輪小步推進並留下進度紀錄。第三份 [SWE-bench 原文](https://arxiv.org/abs/2310.06770)是整週考題的源頭，發表時最強模型僅解出約二個百分點。

- 週一 11/16 Guest Lecture：客座場，無指定讀物。
- 週三 11/18 Coding & Software Agents：主讀物 SWE-agent、OpenHands（本文已導讀）；延伸閱讀 [Anthropic Claude Code 實戰建議](https://www.anthropic.com/engineering/claude-code-best-practices)、[Young 談長運行智慧體的 harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)、[Jimenez 等人 SWE-bench：LLM 能否解真實 GitHub issue](https://arxiv.org/abs/2310.06770)。
- 課表原文：[CS329Z 官網 Week 9](https://cs329z.stanford.edu/)

## 參考資料

- 站內：[Week 8：模型裁判與安全護欄](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety)、[Week 2：工作流與 RAG](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Yang et al., SWE-agent](https://arxiv.org/abs/2405.15793)、[Wang et al., OpenHands, ICLR 2025](https://arxiv.org/abs/2407.16741)、[Jimenez et al., SWE-bench, ICLR 2024](https://arxiv.org/abs/2310.06770)、[Wang et al., CodeAct, ICML 2024](https://arxiv.org/abs/2402.01030)、[Muennighoff et al., OctoPack 與 HumanEvalPack](https://arxiv.org/abs/2308.07124)
- 工具：[SWE-agent](https://swe-agent.com)、[OpenHands](https://github.com/OpenHands/openhands)
