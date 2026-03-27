---
title: "Code Review Comment 怎麼分類？從 Conventional Comments 到 AI Review 工具的分類體系"
date: 2026-03-26
category: tech
tags: [code-review, conventional-comments, ai-code-review, coderabbit, github-copilot, sonarqube, dx]
lang: zh-TW
tldr: "主流分類系統有三種路線：Conventional Comments（標籤制）、Google 嚴重度前綴（Nit/Optional/FYI）、SonarQube 四象限（Bug/Vulnerability/Code Smell/Hotspot）。AI review 工具各自發展出不同分類，但核心維度收斂在正確性、安全、效能、可維護性四大塊。"
description: "整理 code review comment 的主流分類標準（Conventional Comments、Google Eng Practices、SonarQube），對比六大 AI code review 工具的分類體系與設計哲學差異，附經典文章與學術研究推薦。"
draft: false
---

Code review 留 comment 最常見的問題：reviewer 覺得是 blocking issue，author 當成建議就跳過了。不是誰的錯，是 comment 本身沒帶分類資訊，雙方各自解讀。

這篇整理三件事：主流的 comment 分類標準有哪些、AI review 工具各自怎麼分類、以及值得讀的經典文章和研究。

## 三大主流分類標準

### Conventional Comments — 最被廣泛採用的標籤制

來自 [conventionalcomments.org](https://conventionalcomments.org/)，格式是 `<label> [decorations]: <subject>`。

七個核心標籤：

| 標籤 | 說明 | 通常是否阻擋 |
|------|------|-------------|
| `praise` | 讚美正面做法 | N/A |
| `nitpick` | 小而瑣碎的改動 | 不阻擋 |
| `suggestion` | 具體改進建議 | 看情況 |
| `issue` | 使用者會遇到的問題 | 阻擋 |
| `question` | 不確定是否有問題，先提問 | 不阻擋 |
| `thought` | 延伸想法 | 不阻擋 |
| `chore` | 合併前必須完成的雜事 | 阻擋 |

裝飾詞消除模糊地帶：`(blocking)` 必須改、`(non-blocking)` 建議但不強制、`(if-minor)` 小改就順手。

```
suggestion (blocking): 請把這個 SQL query 改用 parameterized query 避免注入風險。
```

這套的價值在於：reviewer 被迫在寫 comment 時就想清楚「這到底是不是 blocking」。

### Google Engineering Practices — 輕量嚴重度前綴

Google 的 [eng-practices](https://google.github.io/eng-practices/review/reviewer/comments.html) 用三個前綴：

| 前綴 | 意義 |
|------|------|
| `Nit:` | 技術上該改但不關鍵 |
| `Optional:` / `Consider:` | 建議但非必要 |
| `FYI:` | 供參考，不期望在這個 PR 處理 |

核心原則：review 應該看「這段 code 是否改善了整體 codebase 健康度」，不追求完美。不要因為 nit 阻擋 PR。Google 的 review 周轉時間約 4 小時，靠的是小 change（35%+ 只改一個檔案）。

### SonarQube — 規則驅動的四象限分類

6500+ 規則、35+ 語言，是業界最成熟的靜態分析分類體系。

| 類型 | 說明 | 目標誤報率 |
|------|------|-----------|
| **Bug** | 會導致執行時錯誤 | 趨近 0% |
| **Vulnerability** | 可被攻擊者利用 | <20% |
| **Security Hotspot** | 安全敏感但需人工判斷 | 需 review |
| **Code Smell** | 可維護性問題 | 趨近 0% |

嚴重度五級：BLOCKER → CRITICAL → MAJOR → MINOR → INFO。

SonarQube 10.3+ 開始轉向 Clean Code 屬性和軟體品質維度（Reliability / Security / Maintainability），逐步取代舊分類。

### 非正式但人人都懂的前綴

| 前綴 | 意義 |
|------|------|
| `nit:` | 外觀瑣碎，不值得阻擋 |
| `LGTM` | Looks Good To Me |
| `PTAL` | Please Take Another Look |
| `TODO:` | 待處理 |
| `FIXME:` | 有問題需馬上修 |
| `ACK` / `NAK` | Acknowledged / Not（Linux kernel 常用） |

## AI Code Review 工具的分類體系

### Claude Code Review — 寧缺勿濫

只有三個嚴重度，預設只看 correctness：

| 標記 | 分類 | 說明 |
|------|------|------|
| 🔴 | Normal | 會影響 production 的 bug |
| 🟡 | Nit | 小問題，值得修但不阻擋 |
| 🟣 | Pre-existing | 不是這個 PR 引入的既有 bug |

多個 agent 平行分析，驗證步驟過濾誤報，去重排序後才貼 comment。不管格式偏好，不管測試覆蓋率——除非你在 `REVIEW.md` 明確要求。每個發現附 extended reasoning 解釋為什麼被標記。

### CodeRabbit — 全面覆蓋

雙軸分類：類型 × 嚴重度。

回饋類型三種：⚠️ Potential issue、🛠️ Refactor suggestion、🧹 Nitpick（僅 Assertive 模式）。

嚴重度四級（agent 層）：Critical → High → Medium → Low。

特色是也會產出正面回饋（praise），以及整合 Jira/Linear 做 ticket compliance 檢查。代價是噪音——獨立評測發現約 28% 的 comment 是噪音或錯誤假設。

### GitHub Copilot Code Review — 零門檻但淺

五大領域：Security、Performance、Code Quality、Architecture & Design、Testing & Documentation。

優勢是零配置，缺點是深度不足。偏向表面建議（命名、格式、common best practices）。有研究發現 117 個檔案中漏掉所有安全漏洞，另一測試 47 個建議中 31 個是 ESLint 就能抓到的、7 個是錯的。

### Qodo PR-Agent — 高度可配置

開源核心，每個維度都能開關。自動標籤包含 `possible security issue`、`review effort [1-5]`、`ticket compliance`。每個 issue 按品質維度（reliability / maintainability / security）分類，附帶 remediation prompt 可直接複製到 AI 工具修復。

可配置的 review 區塊：PR 評分、是否含測試、review 工作量估算、是否建議拆分 PR。

### Greptile — 高信噪比

分類和其他工具類似（Critical Bugs / Refactoring / Performance / Validation / Nitpicks），但刻意減少評論數量。每個 comment 附 confidence score，寧可少說也不誤報。全 codebase 索引，能抓到跨層問題。

## 各工具 Review 維度覆蓋對照

| 維度 | Claude | CodeRabbit | Copilot | Qodo | SonarQube | Greptile |
|------|--------|-----------|---------|------|-----------|---------|
| Bug / 正確性 | ✅ 核心 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 安全漏洞 | ✅ | ✅ | ⚠️ 弱 | ✅ | ✅ 最強 | ✅ |
| 效能 | 可擴展 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 可維護性 | 可擴展 | ✅ | ✅ | ✅ | ✅ 核心 | ✅ |
| 風格/格式 | 預設不管 | Assertive 模式 | ✅ | 可配置 | ✅ | 低優先 |
| 測試覆蓋 | 預設不管 | ❌ | ✅ | ✅ | ✅ | ❌ |
| 既有問題標記 | ✅ 🟣 | ❌ | ❌ | ❌ | ✅ | ❌ |
| 正面回饋 | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Ticket 合規 | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## 設計哲學對照

| 工具 | 哲學 |
|------|------|
| Claude Code Review | 寧缺勿濫——預設只報 correctness，用驗證步驟過濾誤報 |
| CodeRabbit | 全面覆蓋——多維度深度分析，代價是噪音較高 |
| Copilot | 低門檻——零配置整合 GitHub，廣度有但深度不足 |
| Qodo | 可配置——開源核心，每個維度都能開關和自訂 |
| SonarQube | 規則驅動——6500+ 確定性規則，AI 是補充 |
| Greptile | 高信噪比——寧可少說也不誤報，附 confidence score |

三大公司的研究（Google 900 萬次 review、Microsoft 50000+ 開發者、Meta 實驗）收斂在同一結論：code review 要能規模化，核心應放在知識共享，讓自動化處理不需人類判斷的事。

## 經典文章與研究推薦

### 學術論文

- [Modern Code Review: A Case Study at Google (2018)](https://sback.it/publications/icse2018seip.pdf) — 分析 900 萬次 review，主要價值是知識傳播而非抓 bug
- [Expectations, Outcomes, and Challenges of Modern Code Review](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/ICSE202013-codereview.pdf) — 期望與實際成果的落差
- [Characteristics of Useful Code Reviews at Microsoft](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/bosu2015useful.pdf) — 什麼讓 review 真正有用
- Code Reviews Do Not Find Bugs (2015) — 挑戰傳統觀念，review 的主要價值不在找 bug

### 工程實務

- [Google Engineering Practices](https://google.github.io/eng-practices/review/) — Google 官方 review 指南
- [Good Code Reviews, Better Code Reviews](https://blog.pragmaticengineer.com/good-code-reviews-better-code-reviews/) — Uber/Microsoft 實戰經驗
- [How to Make Good Code Reviews Better](https://stackoverflow.blog/2019/09/30/how-to-make-good-code-reviews-better/) — Stack Overflow 談 review 中的同理心
- [How to Do Code Reviews Like a Human](https://mtlynch.io/human-code-reviews-1/) — review 是社交互動，不是純技術流程
- [30 Proven Code Review Best Practices from Microsoft](https://www.michaelagreiler.com/code-review-best-practices/) — Dr. Michaela Greiler 的微軟研究
- [Unlearning Toxic Behaviors in a Code Review Culture](https://medium.com/@sandya.sankarram/unlearning-toxic-behaviors-in-a-code-review-culture-b7c295571a2c) — 用反面教材教正確做法

### 資源彙整

- [awesome-code-review](https://github.com/joho/awesome-code-review) — 最完整的 code review 資源清單
- [Conventional Comments](https://conventionalcomments.org/) — 結構化 comment 標準
- [CHECK Framework](https://elijahmanor.com/blog/check-pull-request-review-comments) — Curious、Helpful、Exact、Clear、Kind，訓練 review 語氣

## 整體來說

分類系統不是重點，重點是團隊對「這個 comment 需不需要處理」有共識。

最低成本的做法：用 `nit:` 前綴區分阻擋和不阻擋，就能解決八成問題。想要更完整就上 Conventional Comments。AI 工具的分類可以當作參考，但別指望它取代團隊自己的判斷標準。

一個有趣的數據：CodeRabbit 發現 AI 生成的程式碼比人寫的多 1.7 倍問題/PR，邏輯錯誤多 75%。AI 寫 code、AI 做 review 已經是現實，但分類和判斷的最後一道防線還是人。

## 參考資料

- [Conventional Comments](https://conventionalcomments.org/)
- [Google Engineering Practices — Review Comments](https://google.github.io/eng-practices/review/reviewer/comments.html)
- [SonarQube Documentation](https://docs.sonarsource.com/sonarqube/)
- [Claude Code Review 官方文件](https://docs.anthropic.com/en/docs/claude-code/github-actions#code-review)
- [CodeRabbit](https://coderabbit.ai/)
- [Qodo PR-Agent](https://github.com/Codium-ai/pr-agent)
- [Greptile](https://www.greptile.com/)
- [Modern Code Review: A Case Study at Google (2018)](https://sback.it/publications/icse2018seip.pdf)
- [awesome-code-review](https://github.com/joho/awesome-code-review)
