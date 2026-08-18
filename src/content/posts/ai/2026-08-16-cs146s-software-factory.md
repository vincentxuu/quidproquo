---
title: "CS146S Week 10：software factory 不是自動化，是把回饋迴圈交出去"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - ai-agent
  - agentic-coding
  - observability
  - multi-agent
  - orchestration
lang: zh-TW
type: deep-dive
series:
  name: "CS146S：AI 原生開發十週"
  order: 11
tldr: "最後一週的講題是「self-running, self-improving software systems」。前九週的零件其實都出現過：確定性驗證迴圈、可寫回的 skill、背景 agent、集中治理。課程投影片有個容易被忽略的比例——寫程式只佔工程時間的 30%，另外 70% 是把它跑在 production 上。"
description: "拆解 Stanford CS146S Fall 2026 第十週「The Software Factory + The Future」：自我運行與自我改進系統的組成零件、部署後的 agent 維運與觀測，以及這門課十週下來沒有回答的問題。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-16-cs146s-software-factory-en)

這是 [CS146S 系列](/posts/ai/2026-08-16-cs146s-course-map)的最後一篇，對應 Fall 2026 的第十週。

課程主題三條：自我運行、自我改進的軟體系統；部署後的 agent 執行與安全；AI 軟體工程接下來往哪走。講題就叫「The Software Factory: self-running, self-improving software systems」。

「software factory」這個詞也出現在課程描述的收尾：學生結業時應該能「apply software-factory principles to building and evolving software at greater speed and scale」。它是這門課的終點命題。

## 拆開這個詞

工廠的核心不是自動化，是**流程可重複、缺陷可回溯、產線可調整**。搬到軟體上，「self-running, self-improving」需要三個東西同時到位：

**一、機器可判定的驗收。** 沒有這個，「自我改進」沒有改進的方向。這正是 [Week 5 的確定性驗證迴圈](/posts/ai/2026-08-16-cs146s-agent-ready-codebase)——linter、type checker、測試、掃描這些非過即敗的訊號。Factory 把它講得很直接：「A codebase with poor feedback loops will defeat any agent you throw at it.」

**二、可以被寫回去的流程知識。** agent 做完一件事，學到的東西要能沉澱成下一次會用到的東西。Anthropic 在 [Agent Skills 的官方文章](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)結尾把這件事寫成明確的方向：

> Looking further ahead, we hope to enable agents to create, edit, and evaluate Skills on their own, letting them codify their own patterns of behavior into reusable capabilities.

**三、不需要人啟動的執行。** 也就是 [Week 8 的背景 agent](/posts/ai/2026-08-16-cs146s-background-agents)：issue 進來、agent 開工、PR 出去。

三者湊齊，「self-improving」才不是修辭：agent 跑一輪 → 驗證迴圈給出通過與否 → 失敗的經驗被寫回 skill 或指示檔 → 下一輪成功率提高。**這條迴圈的品質完全取決於第一項。** 驗收標準含糊的系統，跑再多輪也只是隨機遊走。

## 「部署後」是被低估的那一半

課程主題裡的「running and securing agents post-deployment」在 Fall 2025 是整整一週（Week 9「Agents Post-Deployment」，客座是 Resolve 的 CTO 與技術人員），指定讀物包含 [Google 的 SRE Book](https://sre.google/sre-book/introduction/)與 [observability 基礎](https://last9.io/blog/traces-spans-observability-basics/)。Fall 2026 把它壓縮進最後一週。

Fall 2025 那一堂（[投影片](https://docs.google.com/presentation/d/1Mfe-auWAsg9URCujneKnHr0AbO8O-_U4QXBVOlO4qp0/edit)）開場的兩個數字就把比重講清楚了：

> Coding represents just **30 percent** of engineering time. Harder **70 percent** is running that code in production where complexity, tool silos, knowledge gaps, and interdependencies all collide

課程另外引用估計，停機與服務降級每年讓 Global 2000 損失約 **4,000 億美元**。**寫程式只佔工程時間的三成**——如果 AI 只解那三成，它解的是比較小的那一半。

課程教的基本功仍然是 SRE 那套：監控的四大黃金訊號（latency、traffic、errors、saturation），並提醒成功與失敗的請求要分開追，因為失敗請求會扭曲平均值，而「慢的錯誤」最可疑。它甚至給了一份凌晨 3:12 收到資料庫 500 暴增警報時的八步 playbook：確認並評估 → 照黃金訊號查 DB 與 app → 找出最近改了什麼（deploy、migration、feature flag、autoscaling，有相關就立刻 rollback）→ 縮小影響範圍 → 執行緩解 → 穩定並觀察 → 每 10–15 分鐘對外更新 → 收尾記錄。

**這份 playbook 值得注意的地方是它完全沒提 AI。** 它是那個 AI SRE 要去自動化的對象——你得先知道人怎麼做，才能判斷機器有沒有做對。

課程對「AI SRE」列了四個特徵：動態建構知識圖譜、跨 observability stack 與雲的 agentic 系統、產生即時敘事並指出可能根因與**支持證據**、以及**「heavy emphasis on explainability and auditability of predictions/reasoning」**。

限制那頁同樣誠實：能處理的事故複雜度有限、現代 production stack 太異質、而且**真正改 code 修好還做不到**（「all providers are starting with root cause analysis」）。其中一句最實用：

> Good root cause analysis requires good monitoring gardening.

**沒有先把監控養好，根因分析就沒有東西可以分析。** 這跟 [Week 5 的驗證迴圈](/posts/ai/2026-08-16-cs146s-agent-ready-codebase)是同一條原則在維運端的版本。

被壓縮不代表變簡單。agent 進了 production 之後會有兩層要看：

**agent 產出的程式碼**——這一層跟一般服務沒有兩樣，SRE 那套照用。

**agent 系統本身**——這一層才是新的。要回答的問題包括：這一輪跑了多久、燒了多少 token、用了哪些工具、在哪一步卡住、重試了幾次、最後有沒有達成驗收標準。這些不會出現在你現有的 APM 儀表板上，因為它們不是請求延遲或錯誤率。

沒有第二層，你就只能用「感覺最近比較不準」來管理一個每天跑幾百次的系統。

## 這門課十週的形狀

把十週排在一起，論證線其實非常清楚：

```
W1  agent 的骨架        →  沒有魔法，是一個 while 迴圈
W2  context 工程        →  瓶頸在你給它什麼，不在它多聰明
W3  skills             →  流程知識要能封裝、按需載入
W4  客製 agent 與 repo   →  規則、閘門、context 隔離
W5  codebase 就緒度     →  環境決定 agent 能自主跑多久
W6  code review        →  誰來檢查產出
W7  安全               →  agent 自己就是攻擊面
W8  背景 agent          →  從盯著跑到交出去
W9  團隊化              →  從個人偏好到組織治理
W10 software factory   →  以上全部接成一條會自我強化的迴圈
```

**W1 到 W4 是「你怎麼用 agent」，W5 到 W10 是「你的環境與組織怎麼配合 agent」。** 分界線落在第五週——這也是為什麼 Agent-Ready Codebases 是新大綱裡最關鍵的一格：它是整門課的樞紐。

對照 [Fall 2025 那一版](/posts/ai/2026-08-16-cs146s-course-map)（一週講終端機、一週講 UI 生成、一週講 prompting）就更明顯了。**一年之間，這門課從「工具導覽」變成了「系統設計」。**

## 這門課沒有解決的三件事

寫完十篇，有三個缺口值得標出來。三個都不是技術問題，其中一個課程有問但沒答，另外兩個連問都沒問：

**一、誰為 agent 產出的程式碼負責——這題課程有問，但沒有答。**

這裡我要修正自己先前的說法。我原本寫「課程沒有在談責任歸屬」，那是錯的：[Week 7 安全那一堂](/posts/ai/2026-08-16-cs146s-agent-security)最後一頁的六個 open questions，最後一題正是「**Who is accountable if an AI-generated patch introduces a vulnerability?**」；而 [Week 6 code review](/posts/ai/2026-08-16-cs146s-agentic-code-review) 那堂的收尾更直接：「You own the code that is merged and shipped, no blaming of the AI.」

所以課程的立場是：**合併的人負責**。但它把這句話停在個人層級，沒有往上處理組織層級——當一份 PR 由 agent 寫、由另一個 agent review、由背景流程合併，「合併的人」可能只是按下按鈕的那個人，甚至沒有人按。這在受監理的產業裡不是哲學問題，而課程自己把它列為未解。

**二、資淺工程師怎麼養成。** 課程先修要求是 CS111/CS161 等同程度——也就是它假設你**已經**會寫程式了。那些技能過去是靠做完課程假設你已經會的那些工作養出來的。如果那類工作被 agent 接走，下一代從哪裡長出「知道 agent 什麼時候在胡說」的判斷力？這門課沒有回答，因為它的先修條件把問題排除在外了。

**三、宣稱與量測之間的落差。** 這一整個領域充斥著沒有可重現方法的倍數：「2-3X faster」、「10x productivity」、「82% catch rate」。這個系列裡真正拿得出方法與數字的來源只有幾個——Google 的 [AutoCommenter 論文](https://arxiv.org/abs/2405.13565)（留言解決率約 40%）、Sean Heelan 的 [o3 實驗](https://sean.heelan.io/2025/05/22/how-i-used-o3-to-find-cve-2025-37899-a-remote-zeroday-vulnerability-in-the-linux-kernels-smb-implementation/)（100 次跑 8 次中、28 次誤報）、Factory 的[評分變異數](https://factory.ai/news/agent-readiness)（7% → 0.6%）。**它們的共同點是都同時報告了失敗率。**

這是我讀完整份大綱最想留下的一條判準：**看到一個 AI 開發工具的宣稱，先找它的失敗率。找不到就當它沒說。**

補充一句：課程自己是符合這條標準的。它在安全那堂報了 AI SAST 的 50–100% 誤報率，在 code review 那堂列了限制清單，幾乎每一堂的最後幾頁都是 limitations 與 open questions。**一份會把自己的限制放進投影片的教材，比任何行銷素材可信。**

## 這個系列到此結束

十一篇寫完了。要提醒的是，Fall 2026 在寫作當下（2026 年 8 月）還沒開課——**Fall 2026 的部分讀的是大綱，課堂內容全部來自 Fall 2025 的公開投影片**。9 月 22 日之後，投影片、reading list 與作業會陸續公開，屆時值得回頭對照：哪些主題被實際講成了什麼、哪些格子跟大綱寫的不一樣。

想自學的話，[Fall 2025 的完整教材](https://themodernsoftware.dev/fall2025)仍然是最好的起點，[作業 repo](https://github.com/mihail911/modern-software-dev-assignments) 也還在。從 `week2` 手刻一個 agent 開始，比讀十篇文章有用。

## 會過期的東西

- Fall 2026 的 Week 10 客座尚未公布
- 「software factory」目前主要是課程與少數廠商在用的說法，還沒有共識定義
- 本文列的第二、三個缺口是我的判斷；第一個（責任歸屬）是課程自己列為 open question

## 參考資料

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 10 主題與課程描述
- [CS146S Fall 2025](https://themodernsoftware.dev/fall2025) — 完整 reading list、slides 與 Agents Post-Deployment 那一週的材料
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Anthropic Engineering，agent 自行建立 skill 的方向
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory，回饋迴圈與評分變異數
- [Introduction to Site Reliability Engineering](https://sre.google/sre-book/introduction/) — Google SRE Book，Fall 2025 Week 9 指定讀物
- [Observability Basics You Should Know](https://last9.io/blog/traces-spans-observability-basics/) — Fall 2025 Week 9 指定讀物
- [AI DevOps](https://docs.google.com/presentation/d/1Mfe-auWAsg9URCujneKnHr0AbO8O-_U4QXBVOlO4qp0/edit) — Fall 2025 Week 9 課堂投影片，含 30/70 比例、四大黃金訊號與事故 playbook
- [The Build System](https://www.youtube.com/@modernsoftwaredeveloper) — 課程講師的實作影片系列
