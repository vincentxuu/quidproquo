---
title: "AI Engineer 面試日練 — 2026-09-19：Paper Reading"
date: 2026-09-19
category: daily
type: digest
tags: [ai-engineer-interview, daily, paper-reading]
lang: zh-TW
description: "今天讀剛登上 Nature 的《Paper2Agent》——一篇教你怎麼用多個 specialist agent 把研究論文的程式碼自動變成可靠 MCP 工具的論文,順便拆解『自動生成的 agent 忠不忠於原論文』這種審稿人視角的面試追問。"
tldr: "今天的 Paper Reading 輪練是 arXiv:2509.06917《Paper2Agent》——剛在 2026 年登上 Nature 的論文,提出一套自動框架,用多個 specialist agent 分析研究論文與它的開源程式碼,建構出可測試、可迭代精煉的 Model Context Protocol(MCP)伺服器,再接上 Claude Code 這類 chat agent,用自然語言重現論文結果、甚至回答原論文沒問過的新問題;作者用 AlphaGenome、ScanPy、TISSUE 三個案例驗證,並宣稱因此發現了一個跟 ADHD 風險相關的新剪接變異。核心概念涵蓋 specialist + coordinator 的多 agent 分工模式、MCP 作為『論文能力』到『可呼叫工具』的標準化介面、iterative generate-test-refine 迴圈怎麼取代一次性人工驗證、以及『忠實重現原結果』跟『正確回答新查詢』是兩種要分開驗證的可靠性標準。練習題走審稿人視角,討論怎麼設計實驗驗證這類自動生成 agent 不是在幻覺,以及要把這套系統落地成公司內部工具時該加什麼防護。"
series:
  name: "AI Engineer 面試日練"
  order: 31
---

> 🌏 [English version](/en/posts/daily/2026-09-19-ai-interview-daily-en)

## 今日主題

星期六輪到 Paper Reading。這關考的不是你有沒有讀過這篇論文,而是給你 10-20 分鐘讀完摘要和方法,能不能講出問題定義、方法核心設計選型的取捨,以及實驗證據撐不撐得住論文宣稱的結論。今天選的《Paper2Agent》特別適合拿來練,因為它本身就是一個「多 agent 系統」的實作案例——研究怎麼把論文變成 agent,論文自己的方法論就是一套多 agent pipeline,拿來練 Research 或 LLM/Agent 團隊面試的 paper reading 環節剛好對題,也順帶練到 system design 的骨架。

## 核心概念速記

### Specialist + coordinator:多 agent 分工不是「一個大 agent 全包」

Paper2Agent 沒有用單一 agent 讀完論文、寫完程式碼、跑完測試,而是由一個 coordinator 派遣多個並行的 specialist agent 分頭處理——分析論文內容、理解關聯的程式碼庫、抽取可用的函式與工作流程。這種分工的好處是每個 specialist 的 context window 只需要裝它負責的那塊資訊,不會被整篇論文加整個 repo 的 token 量撐爆;面試官問「什麼時候該拆多 agent、什麼時候單 agent 就夠」時,「單一 agent 的 context 會被無關資訊稀釋,拆开後每個 agent 能更專注」是可以直接說出口的判準。

### MCP:把「論文的能力」變成「可測試、可呼叫的工具」

Model Context Protocol(MCP)在這篇論文裡不是終點,是中介層——Paper2Agent 把分析出來的程式碼邏輯包裝成一個 MCP 伺服器,讓任何支援 MCP 的 chat agent(像 Claude Code)都能連上去,用自然語言呼叫論文裡的具體工作流程(例如用 AlphaGenome 解讀基因變異)。這個設計選擇的價值在於「可攜性」:一旦包成標準化的 MCP 工具,不需要為每個下游 client 重新寫整合,這跟一般後端工程「把內部邏輯包成穩定 API」是同一個道理,只是這裡的呼叫端換成了 LLM agent。

### Iterative generate-test-refine:可靠性不是靠人工驗一次,是靠迴圈

論文的核心可靠性機制是「系統性地生成測試、跑測試、再依失敗結果修正 MCP 工具實作」的迴圈,直到工具能穩定重現預期行為為止——這比「agent 寫完程式碼就交付」多了一層自我驗證。面試時被問「你怎麼保證 LLM 生成的程式碼是對的」,「不是靠人工 review 一次就結案,而是設計一個能自動生成測試案例、跑起來、把失敗回饋進下一輪修正」的迴圈式做法,是比「我會請人 review」更有系統性的答案。

### 兩種不同的可靠性標準:重現舊結果 vs 回答新問題

論文特別區分了兩種驗證:paper agent 能不能重現原論文本身報告過的結果(reproducibility),以及能不能正確處理原論文沒問過的全新使用者查詢(generalization)。這兩者不是同一件事——一個系統可能死記硬背地重現了論文圖表,卻在使用者換一個輸入資料集時就崩潰;面試官深挖時,「這篇論文有沒有分開驗證這兩種能力」是判斷實驗設計嚴謹度的關鍵切入點。

### 從「被動文件」到「主動協作系統」:知識傳播的典範轉移

作者把 Paper2Agent 定位成「讓靜態論文變成能對話、能協作的 AI co-scientist」的第一步——多個 paper agent 之間甚至能互相對話、串連彼此的能力。這個願景聽起來很宏大,但面試時值得追問的是落地問題:當論文本身有錯誤或方法有限制,agent 化之後會不會讓使用者更容易忽略「這只是把論文的既有侷限包裝得更好用」這件事,把方法論的邊界誤當成可以無限外推的通用能力。

## 今日練習題

### 題目

「最近一篇發表在 *Nature* 的論文《Paper2Agent》主張:把任何一篇有公開程式碼的研究論文,自動轉換成一個基於 MCP 的 AI agent,讓使用者能用自然語言重現論文結果、甚至問出原論文沒問過的新問題。作者用 AlphaGenome(基因體變異解讀)、ScanPy 與 TISSUE(單細胞與空間轉錄體分析)三個案例驗證,並宣稱這套系統自動發現了一個與 ADHD 風險相關的新剪接變異。請說明:(1) 如果你是審稿人,你會怎麼設計實驗去驗證『這個自動生成的 agent 真的忠實反映原論文方法,而不是產出看似合理但其實幻覺出來的結果』;(2) 論文用『多個 specialist agent 分析程式碼建構 MCP,再用測試迭代精煉』這個架構,這個設計選型解決了什麼問題、又留下什麼風險;(3) 如果要把這套系統落地成公司內部『把研究成果自動包裝成內部工具』的 pipeline,你會加什麼防護措施。」

**來源**：改編自 arXiv:2509.06917《Paper2Agent》論文動機與案例設計,自擬面試情境　**難度**：進階　**環節**：Research / System Design 混合(onsite)

### 拆解思路

1. **先釐清問題**：先問清楚「忠實反映原論文方法」在這個情境裡具體指什麼——是輸出的數值跟論文報告的一致(reproducibility),還是呼叫的底層函式邏輯跟原始程式碼一致(faithfulness),這兩者可能分道揚鑣(數值巧合對上、邏輯其實錯的情況並非不可能)。也要問清楚驗證的資源限制——審稿週期通常只有幾週,不可能重新跑遍所有可能輸入。
2. **建立框架**：把驗證拆成論文自己隱含的兩層——reproducibility 測試(拿原論文報告過的具體案例當 ground truth,跑一次 agent 生成的流程,比對輸出跟論文數字/圖表是否一致)跟 generalization 測試(構造原論文沒問過的新輸入,交叉驗證 agent 呼叫的底層邏輯是否仍對應原始程式碼的正確用法,而不是表面上看起來合理但邏輯錯誤)。
3. **深入核心**：多 agent 分工 + 測試迴圈解決的是「單一大 agent 在龐大程式碼庫上容易漏讀關鍵細節、又缺乏自我修正機制」的問題,但留下的風險是:specialist agent 之間的資訊斷層(某個 agent 沒看到另一個 agent 已經發現的邊界條件)、以及測試案例本身是誰寫的——如果測試也是同一套 LLM pipeline 自動生成,測試可能跟程式碼共享同一種盲點,形成「自己考自己出的題目,自己都會過」的假可靠性。這點在論文只提測試迭代、沒詳述測試案例的獨立性來源時,是審稿人該追問的地方。
4. **收尾**：落地成公司內部 pipeline 時,關鍵防護是「不要讓自動生成的工具直接對外服務」——先讓它跑一段時間的影子模式(shadow mode),把輸出跟人工專家的判斷比對;對高風險領域(像論文案例裡的基因體、醫療)額外要求人工在關鍵決策點簽核,而不是讓 agent 的輸出直接變成下游決策依據。收尾時點出:這跟上週練過的「評測基礎設施要信任伺服器端證據、不能只信任 agent 自己回報」是同一種思路——這裡則是不能只信任 agent 自己生成又自己驗證的測試。

### 範例回答（面試時可以這樣講）

> **問題框定**：在設計驗證實驗之前,我想先把「忠實反映原論文方法」拆成兩層分開處理——一層是輸出數值有沒有對上論文報告的結果(reproducibility),另一層是底層呼叫的邏輯有沒有真的對應原始程式碼的正確用法(faithfulness)。這兩者可能脫鉤:巧合對上數字、但邏輯其實錯的情況在複雜的科學程式碼裡並不少見,審稿時我會特別留意論文有沒有分開驗證這兩者,還是只報了一種。
>
> **核心邏輯**：我會設計兩組測試。第一組直接拿論文本身報告過的具體案例(比如某個基因變異的解讀結果)當 ground truth,重跑一次 agent 生成的完整流程,逐項比對輸出;第二組刻意構造原論文沒問過的新輸入——換一個沒在論文裡出現過的基因座或資料集,交叉檢查 agent 呼叫的函式路徑跟參數選擇,是不是真的對應原始程式碼的正確使用方式,而不是表面上格式對、邏輯錯。對於論文用的多 agent + 迭代測試架構,我認為它解決的核心問題是單一大 agent 在龐大程式碼庫上容易漏讀關鍵細節、又沒有自我修正機制;但它留下的風險是「測試案例本身是誰寫的」——如果測試也是同一條 LLM pipeline 自動生成,程式碼跟測試很可能共享同一種盲點,變成自己出題自己考,通過率高但不代表真的可靠。
>
> **落地防護**：如果要把這套系統做成公司內部工具,我不會讓自動生成的 agent 一上線就直接服務下游決策,而是先跑一段影子模式,把它的輸出持續跟領域專家的人工判斷比對,收斂到一定信賴度才開放給非專家使用者;對高風險領域(像論文案例裡的基因體分析)我會額外要求關鍵輸出經過人工簽核關卡。這跟上週練的評測基礎設施要信任伺服器端證據、不能只信任 agent 自己回報,是同一種「不自證清白」的設計原則,只是這裡搬到了測試案例的獨立性上。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 把「忠實反映原論文」拆成 reproducibility 跟 faithfulness/generalization 兩層分開驗證 | |
| 有具體提出怎麼構造原論文沒問過的新輸入做交叉驗證 | |
| 討論多 agent 分工解決了什麼問題(context 過載、單 agent 漏讀) | |
| 點出「測試案例自己生成、自己驗證」可能形成假可靠性的風險 | |
| 落地防護有提到影子模式 / 人工簽核關卡,而不是直接上線服務 | |
| 加分項:連結到「不能只信任 agent 自己回報,要看基礎設施側證據」這類跨主題原則 | |

## 延伸閱讀

- [Paper2Agent GitHub — jmiao24/Paper2Agent](https://github.com/jmiao24/Paper2Agent) — 專案原始碼與架構說明,可以看到 coordinator 派遣 specialist agent、產生並驗證 MCP 伺服器的具體流程,以及 AlphaGenome / ScanPy / TISSUE 三個案例的實際呼叫範例。
- [5 best MCP testing tools for agent evals in 2026 — Braintrust](https://www.braintrust.dev/articles/best-mcp-testing-tools-agent-evals-2026) — 補強「MCP 伺服器要怎麼測」這個角度,涵蓋 isolated decision、完整 trajectory、regression suite 到生產環境行為的分層測試策略,跟今天練習題裡「測試案例獨立性」的討論互相呼應。
- [Reimagining research papers as interactive and reliable AI agents — Nature](https://www.nature.com/articles/s41586-026-11044-y) — 正式發表版本,含 peer review 過程中補強的實驗細節,適合對照 arXiv 預印本版本差異。

## 參考資料

- [Paper2Agent: Reimagining Research Papers As Interactive and Reliable AI Agents — arXiv:2509.06917](https://arxiv.org/abs/2509.06917) — 今日 Paper Reading 核心概念速記與練習題設計的原始論文,含完整方法設計與 AlphaGenome / ScanPy / TISSUE 案例研究。
- [Reimagining research papers as interactive and reliable AI agents — Nature](https://www.nature.com/articles/s41586-026-11044-y) — 論文的正式 Nature 發表版本與 DOI。
- [Paper2Agent GitHub — jmiao24/Paper2Agent](https://github.com/jmiao24/Paper2Agent) — 「specialist + coordinator」多 agent 分工段落與 MCP 伺服器產出流程的實作細節來源。
- [Manuscripts-turned AI agents can now 'talk' to each other, and make new discoveries — Stanford Medicine](https://med.stanford.edu/news/all-news/2026/09/ai-agents-talk.html) — 「從被動文件到主動協作系統」段落與 ADHD 風險剪接變異案例的背景報導來源。
