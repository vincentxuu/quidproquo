---
title: "寫程式的智慧體，先替它造一把順手的 IDE｜Stanford CS329Z 第 9 週"
date: 2026-09-10
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, rag]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 10
tldr: "第九週週三談寫程式智慧體：SWE-agent 證明介面即效能，OpenHands 把沙箱與評測做成通用底座；第二份作業週五到期，本週交付是一道會動的修 bug 考題。"
description: "帶讀 Stanford CS329Z Week 9 兩大主讀物：SWE-agent 的 ACI 介面設計與消融證據、OpenHands 的事件流沙箱與多基準評測，以及 SWE-bench 四元組考題結構與一條可動手的打包建議。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-week9-coding-agents-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

第九週是寫程式週。週一是 Guest 場（十一月十六日）。週三談 Coding 與 Software Agents（十一月十八日）。第二份作業在週五到期（十一月二十日）。

給智慧體一個 GitHub issue，它能不能自己修好，這是本週的起點。端到端流程有五步：讀懂需求、找到相關程式碼、寫出重現腳本、動手改程式、跑測試確認。最後交出的是一份 patch，外加全部通過的測試。

你可以把它想成一位會用電腦的工程師學徒：給它任務與工具，它在沙箱裡試錯前進。本週有兩篇主讀物。[SWE-agent](https://arxiv.org/abs/2405.15793) 回答介面問題：給智慧體什麼樣的工具，它才改得動程式。[OpenHands](https://arxiv.org/abs/2407.16741) 回答平台問題：沙箱、工具庫、評測如何兜成通用底座。Guest 場沒有指定讀物，本篇不寫。

## 沿一次修復追蹤：介面、環境、patch 與驗收

[官方課表](https://cs329z.stanford.edu/)的 11/16 客座課仍標 TBA，11/18 才是 Coding & Software Agents；截至 2026-10-23 尚無公開投影片。本文依 SWE-agent、OpenHands 與長任務 harness 指定閱讀建立預習路徑，不把未知客座內容補成課程事實。對正在維護實際專案的讀者，這週要學的是讓修復可追蹤，而非只讓模型多寫幾行程式。

### 介面決定下一步看得到什麼

假設 bug 是匯出繁中檔名時多出錯誤編碼。先讓 agent 搜尋關聯程式碼、讀取有界片段、寫最小重現，再編輯。[SWE-agent 的 ACI](https://arxiv.org/html/2405.15793)把檔案查看、搜尋與編輯設計成模型能穩定使用的介面。截斷或雜亂輸出會改變模型拿到的證據；介面是系統的一部分，不能只比較模型名稱。

### 動作與觀察要能對回同一次執行

[OpenHands 架構](https://arxiv.org/html/2407.16741)區分 agent 決策與 runtime 執行，透過 action 與 observation 形成回饋。紀錄要包含執行環境、命令、退出狀態與輸出，否則測試通過可能來自舊檔或另一個 checkout。這裡的編碼 bug 是自擬練習，沒有宣稱論文用它作實驗。

### 重現、修復、驗收是三件事

先跑會失敗的重現，確認它對準原問題；改碼後讓它通過，再跑相鄰行為，避免只針對單一輸入硬寫答案。Patch 交出後仍要在乾淨環境驗收。Agent 自己跑過的開發測試與評估 harness 的獨立測試要分開，才不會把「它宣稱測過」當成成功。[長任務 harness 指南](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)補上跨 context 的進度紀錄與可恢復工作方式。

**理解檢查**：agent 修改了測試讓它通過，能否算修復？**答案判準**：先查原始需求與測試是否真的錯。驗收應檢查使用者可觀測行為，保護獨立的測試條件；刪掉失敗案例本身沒有證明 bug 消失。



## 讀物 1｜SWE-agent

原文：[SWE-agent](https://arxiv.org/abs/2405.15793)

### TL;DR

ACI 將搜尋、檢視與編輯做成有界工具，讓回饋支持下一步決策；消融比較介面改動的影響。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 為人設計的shell，是否也是模型最合適的介面？ |
| 證據與邊界 | 12.47% full與18% Lite來自GPT-4 Turbo論文設定；不是只換模型就可比較的現行排名。 |

### 領域背景

程式 agent 依靠搜尋、檔案觀察與執行結果行動，工具介面的資訊密度會改變它的決策。

### 中階導讀

**方法。** 提供有界檔案檢視、彙整搜尋與帶檢查的編輯，讓模型在每次動作後讀回可用觀察。

靈感來自人機互動：人類有 IDE，智慧體也該有專屬介面。論文把這層抽象命名為 ACI，也就是智慧體與電腦之間的介面層。人類會自動忽略雜訊，模型卻要為每個 token 付代價，分心還會拖累表現。所以介面設計的任務很具體：讓狀態好讀、歷史精簡、動作可靠。

設計原則有四條。動作要簡單：文件短、選項少，拿起來就會用。動作要緊湊：找檔、看檔、改檔各自一氣呵成，不必跨多回合拼裝。回饋要精簡：改完立刻看到新內容，不附多餘雜訊。最後是護欄：寫壞立刻攔下，當場重寫，不讓錯誤滾雪球。

落到命令層面，搜尋有三個命令：找檔名、找字串、找目錄，結果太多就退回，請智慧體把查詢寫得更具體。開檔一次只看一百行，配上下捲動與跳行。編輯一次指定起止行並給出替換文字，外加語法檢查：壞編輯直接丟棄重來。

消融證據很直白。拿掉專屬編輯器，Lite 解析率掉將近八個百分點。拿掉語法檢查，也掉三個百分點。逐條翻搜尋結果的迭代式介面最慘：連不給搜尋工具都不如。介面不是包裝，而是效能本身。

智慧體的典型軌跡分兩段。開場先重現或定位：建檔寫重現腳本，或用搜尋命令縮小包圍圈。中段之後幾乎全是編輯加執行的迴圈：改完就跑，跑出新資訊再定位。

```diagram
title: 測試回饋如何進入下一次編輯
desc: 先重現與定位，再編輯並測試；失敗回饋回到編輯，通過後提交 patch。
caption: 整理上文的開發回饋流程；隱藏評分測試另行執行，提交不等於 benchmark 成功。
---
<svg viewBox="0 0 440 592"><path class="dg-line" d="M220 88V128" marker-end="url(#arrow)"/><path class="dg-line" d="M220 192V248" marker-end="url(#arrow)"/><path class="dg-line" d="M220 344V392Q220 400 212 400H120Q112 400 112 408V496" marker-end="url(#arrow)"/><path class="dg-line" d="M380 296H400Q408 296 408 304V456Q408 464 400 464H340Q332 464 332 472V496" marker-end="url(#arrow)"/><path class="dg-line dg-line--dashed" d="M424 536H428Q432 536 432 532V168Q432 160 424 160H400" marker-end="url(#arrow)"/><rect class="dg-box" x="20" y="16" width="400" height="72" rx="6"/><text class="dg-label" x="220.0" y="52.0" text-anchor="middle" dominant-baseline="central">重現問題／定位程式碼</text><rect class="dg-box" x="40" y="128" width="360" height="64" rx="6"/><text class="dg-label" x="220.0" y="160.0" text-anchor="middle" dominant-baseline="central">編輯程式碼</text><path class="dg-box" d="M220 248L380 296L220 344L60 296Z"/><text class="dg-label" x="220" y="296" text-anchor="middle" dominant-baseline="central">開發檢查通過？</text><rect class="dg-box dg-box--accent" x="16" y="500" width="192" height="72" rx="6"/><text class="dg-label" x="112.0" y="536.0" text-anchor="middle" dominant-baseline="central">交出 patch</text><rect class="dg-box" x="240" y="500" width="184" height="72" rx="6"/><text class="dg-label" x="332.0" y="536.0" text-anchor="middle" dominant-baseline="central">讀錯誤回饋</text><text class="dg-edge" x="164" y="372" text-anchor="middle" dominant-baseline="central">通過</text><text class="dg-edge" x="376" y="392" text-anchor="middle" dominant-baseline="central">失敗</text></svg>
```

成功有個時間特徵：交得早的容易對。解出的案例中位數約十二步。卡住的平均步數是二十一步。解出一題的 API 花費約一點六美元。每題預算四美元，超支就自動送出當下進度。

失敗也有肖像。約五成是實作錯誤：patch 看似合理，功能就是不對。另有兩成多是連鎖壞編輯：一次手滑沒救回來，後面全跟著歪。一半以上的軌跡都吞過至少一次壞編輯，救回機率隨次數遞減。

**證據與結果。** ACI消融顯示觀察視窗、搜尋與編輯回饋都會改變修復結果，支持把介面視為研究變數。

### 深入要點

- Linter回饋限制無效編輯，有別於最後才跑完整測試，能縮短局部修正迴圈。
- 沒有示範、只用shell與完整ACI應在相同模型與題集下比較，避免把模型差異算成介面收益。

### Reviewer 一句話評

介面是能力的一部分，不能只比較模型。

### 給你的 take-away

先保存shell基線，再單獨改觀察視窗或編輯回饋，測端到端修復。

## 讀物 2｜OpenHands

原文：[OpenHands](https://arxiv.org/abs/2407.16741)

### TL;DR

平台用action與observation事件流連接agent與沙箱runtime，提供可擴充skills與agent delegation。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 多種軟體工作如何共用runtime、工具與評測？ |
| 證據與邊界 | 26%與22%是特定CodeActAgent與模型；79.3% zero-shot對87.7% SWE-agent one-shot不是同系統加示範的消融。 |

### 領域背景

通用軟體助理需要一致的執行環境與事件紀錄，才能讓不同任務共用工具與評測。

### 中階導讀

**方法。** 將動作與觀察寫入事件流，透過隔離runtime執行工具，並以skills或delegation擴展介面。

OpenHands 把支架做成平台。前身叫 OpenDevin，後來長成社群共建的開放底座，程式碼開放在 [GitHub](https://github.com/OpenHands/openhands)。核心是一條事件流：動作與觀察按時間排成歷史，智慧體每步只讀這條流，再決定下一步。

執行環境是隔離的 Docker 沙箱，裡面有命令列、Python 直譯器與瀏覽器。智慧體的動作走 [CodeAct](https://arxiv.org/abs/2402.01030)：能用程式碼表達的，就不用逐一註冊工具。工具庫只收兩類東西：模型自己寫不出來的，以及要呼叫外部模型的。多智慧體靠委派：通用智慧體把瀏覽子任務交給瀏覽專家。

同一個通用智慧體不改提示詞，軟體、瀏覽、問答三類任務都能跑。以 [Claude](https://www.anthropic.com/claude) 系列為底座，它在 Lite 上拿下約二成六的解析率，與同期專用修 bug 系統相當。換成 GPT-4o，約二成二。短碼修 bug 基準 [HumanEvalFix](https://arxiv.org/abs/2308.07124) 上，零示範約七成九。另一套 SWE-agent 在附成功軌跡的 one-shot 設定下約為 87.7%。這是不同 agent、不同模型與示範條件的比較，不能解讀成替同一套 OpenHands 加示範就從 79.3% 提升到 87.7%。

**證據與結果。** 同一平台可承載軟體修復、瀏覽與問答，但各任務的模型、agent版本與示範條件必須跟分數一起報。

### 深入要點

- Runtime負責把action變成執行結果，agent負責由歷史選下一步，這有助於隔離除錯責任。
- 委派子agent會新增資訊交接與停止條件；平台支援委派不代表每題都值得拆。

### Reviewer 一句話評

平台化讓實驗可組裝，也讓版本與環境條件更需要被記錄。

### 給你的 take-away

把環境身分、動作、觀察與退出狀態一起留存，驗證產物來自本次執行。

## 讀物 3｜Claude Code Best Practices

原文：[Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

### TL;DR

指南強調提供可執行驗證、管理context與拆解工作，讓模型能從工具結果修正。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 如何讓程式agent知道改動真的有效？ |
| 證據與邊界 | 這是產品工程建議，不是保證特定模型或專案成功率的實驗。 |

### 領域背景

程式碼看起來合理與真的符合需求之間，需要測試、重現與回讀工具輸出補上證據。

### 中階導讀

**方法。** 先探索相關程式碼並定義驗收，讓模型實作後執行檢查，再依實際輸出修訂。

**證據與結果。** 指南把可驗證結果與context管理列為操作重點；它提供的是改善工作流程的建議，並沒有一個通用成功率。

### 深入要點

- 重現命令與預期輸出能讓agent辨認失敗，只有「請修好」缺少可比較的回饋。
- 工作範圍過大會擠掉關鍵觀察，必要時先縮小任務並留下可恢復紀錄。

### Reviewer 一句話評

讓agent能驗證，才有機會有效自主。

### 給你的 take-away

在指令裡提供重現命令與成功條件，執行後回讀實際結果。

## 讀物 4｜Effective Harnesses for Long-Running Agents

原文：[Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

### TL;DR

初始化階段鋪環境與功能清單，後續每輪小步推進，以Git與進度紀錄交接可恢復狀態。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | Context重置後，agent怎麼知道做到哪與下一步？ |
| 證據與邊界 | 文章的web開發案例不是所有長任務的完整解法；恢復仍要驗證環境與產物。 |

### 領域背景

Context有限，工作卻可能跨多次session；若狀態只存在對話裡，下一輪就要重新探索。

### 中階導讀

**方法。** 初始化建立環境與功能清單，後續session回讀Git和進度檔，每次只推進可驗證的小部分。

**證據與結果。** 文章以跨context的開發案例展示初始化、進度紀錄與小步提交如何減少下一輪重新猜測。

### 深入要點

- 功能清單要區分待做與驗證通過，不能把一輪自述進度直接升格成完成。
- 新session先檢查環境是否仍能跑，能避免在上一輪遺留的壞狀態上繼續堆功能。

### Reviewer 一句話評

可靠交接要寫到下一輪能重播。

### 給你的 take-away

結束前保存已完成、未完成與驗證命令；下一輪先回讀並重播最小檢查。

## 讀物 5｜SWE-bench

原文：[SWE-bench](https://arxiv.org/abs/2310.06770)

### TL;DR

資料集將issue、base commit與測試綁定，讓系統產生patch，再檢查問題是否解決及既有測試是否維持。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 真實GitHub issue能否成為可自動驗收的修復題？ |
| 證據與邊界 | 原始完整集2294題來自12個Python repo；歷史模型約2%不代表今日能力。 |

### 領域背景

修復既要解決新問題，也要維持原本行為；真實issue與測試能把這兩件事拆開驗收。

### 中階導讀

**方法。** 還原base commit、套用候選patch，在規定環境跑目標與回歸測試，再彙整resolved狀態。

基準本身也是設計。每道考題是四元組：issue 原文、某個 commit 的程式庫快照、修好才會過的新測試、修前修後都要過的舊測試。前者叫 `FAIL_TO_PASS`，後者叫 `PASS_TO_PASS`。智慧體看得到前兩項，看不到後兩項，兩組全過才算解出。

完整集來自十二個 Python 倉庫。題目是兩千多道真實 issue 留下來的。[SWE-bench](https://arxiv.org/abs/2310.06770) 的 Lite 子集只留三百題，省錢省時間。SWE-agent 配當時的 [GPT-4](https://arxiv.org/abs/2303.08774)，完整集解出一成二強。Lite 子集約一成八。只檢索不動手的 [RAG](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag) 基線，在 Lite 上不到三個百分點。

**證據與結果。** 資料集讓模型面對真實issue與整個repo；早期低分揭露長context、定位與修改並非單次文字生成就能處理。

### 深入要點

- Fail-to-pass檢查新問題是否被修，pass-to-pass檢查原本正常的行為是否維持。
- Issue描述可能不完整，測試也有覆蓋限制，benchmark成功仍不等於所有生產需求已滿足。

### Reviewer 一句話評

Patch是否有效，由行為與測試決定。

### 給你的 take-away

固定base commit與乾淨環境，把修復條件和不得退步的行為分開測。


## 怎麼做：給自己的倉庫出一份考題

**怎麼做**：挑自己倉庫裡一個已修好的 issue，把它包成四元組：issue 原文、當時版本、驗證用測試。智慧體只能看前兩項，在隔離沙箱裡重跑一次修 bug。測試全過才算分，沒過就把軌跡存下來，變成下一輪的教材。

## 它在課程裡的位置

[Week 8 的裁判與護欄](/posts/ai/2026-09-10-stanford-cs329z-week8-judge-safety)發了工具，本週直接下場寫程式：ACI 管手感，沙箱管安全，測試管對錯。第二份作業在週五到期，季度專案的展示也就不遠了。修 bug 智慧體正是專案的好題目：考題現成，評分自動，展示效果直觀。

## 本週 Course Material 對照

延伸閱讀有三份。[Anthropic 的 Claude Code 實戰建議](https://www.anthropic.com/engineering/claude-code-best-practices)把上下文窗口當成最稀缺的資源，動手前先給智慧體可執行的驗證手段。第二份是[Young 談長運行智慧體的 harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)，初始化智慧體先鋪環境，每輪小步推進並留下進度紀錄。第三份 [SWE-bench 原文](https://arxiv.org/abs/2310.06770)是整週考題的源頭，發表時最強模型僅解出約二個百分點。

- 週一 11/16 Guest Lecture：客座場，無指定讀物。
- 週三 11/18 Coding & Software Agents：主讀物 SWE-agent、OpenHands（本文已導讀）；延伸閱讀 [Anthropic Claude Code 實戰建議](https://www.anthropic.com/engineering/claude-code-best-practices)、[Young 談長運行智慧體的 harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)、[Jimenez 等人 SWE-bench：LLM 能否解真實 GitHub issue](https://arxiv.org/abs/2310.06770)。
- 課表原文：[CS329Z 官網 Week 9](https://cs329z.stanford.edu/)

## 課程影片來源

官方 Logistics 頁（2026-10-10 即時讀取）的 Lecture Recordings 一節寫明：講課錄影只能登入課程 Canvas 取得。我實際開啟課程 Canvas 入口（canvas.stanford.edu/courses/233286），被導向 Stanford 登入頁，確認有登入牆。課程官網與搜尋都沒有找到公開的 YouTube 或 OCW 錄影，所以沒有可嵌入的影片。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-23：依第一堂模板重整材料狀態、機制、情境與理解檢查；將指定閱讀深讀與課堂預習分開。

- 2026-10-23：將既有教學內容補成圖解與必要對照表；本次未重新查證數據、課表或研究結果。

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[Week 8：模型裁判與安全護欄](/posts/ai/2026-09-10-stanford-cs329z-week8-judge-safety)、[Week 2：工作流與 RAG](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Yang et al., SWE-agent](https://arxiv.org/abs/2405.15793)、[Wang et al., OpenHands, ICLR 2025](https://arxiv.org/abs/2407.16741)、[Jimenez et al., SWE-bench, ICLR 2024](https://arxiv.org/abs/2310.06770)、[Wang et al., CodeAct, ICML 2024](https://arxiv.org/abs/2402.01030)、[Muennighoff et al., OctoPack 與 HumanEvalPack](https://arxiv.org/abs/2308.07124)
- 工具：[SWE-agent](https://swe-agent.com)、[OpenHands](https://github.com/OpenHands/openhands)
