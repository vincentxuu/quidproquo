---
title: "CS146S Week 5：Express 拿 28 分、CockroachDB 拿 74 分——agent 就緒度是可以量的"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - agentic-coding
  - developer-experience
  - ai-agent
  - testing
  - code-quality
lang: zh-TW
type: deep-dive
series:
  name: "CS146S：AI 原生開發十週"
  order: 6
tldr: "Factory 把「repo 夠不夠格讓 agent 動」拆成八根柱子、五個等級，並公開了實測分數：CockroachDB L4（74%）、FastAPI L3（53%）、Express L2（28%）。核心論點是 agent readiness ≈ codebase 裡確定性驗證迴圈的密度——linter、type checker、測試，這些對 agent 來說是獎勵訊號。"
description: "拆解 Stanford CS146S Fall 2026 第五週「Agent-Ready Codebases」：Factory 的八柱五級 agent readiness 框架、80% 過級規則、公開評分實例，以及不用任何工具也能自己審一次 repo 的檢查表。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-16-cs146s-agent-ready-codebase-en)

這是 [CS146S 系列](/posts/ai/2026-08-16-cs146s-course-map)的第六篇，對應 Fall 2026 的第五週。

課程主題三條：什麼讓一個 repo 變得 agent-ready（結構、文件、測試、檢查）、就緒度的評分與稽核、以及真實 repo 裡常見的阻礙。客座是 [Factory](https://factory.ai/) 共同創辦人兼 CTO Eno Reyes，講題就是 agent readiness。

這一週可能是整份新大綱裡**最反直覺的一週**：它主張你手上 agent 表現不好，通常不是模型的問題。

## 這一週不是憑空冒出來的

我原本寫「這一週在 Fall 2025 完全不存在」。讀完舊投影片後要修正：**主題確實沒有獨立成週，但概念早就在了。**

Fall 2025 Week 3 的 [From first prompt to optimal IDE setup](https://docs.google.com/presentation/d/11pQNCde_mmRnImBat0Zymnp8TCS_cT_1up7zbcj6Sjg/edit) 有一頁寫著：

> Optimize your codebase so that a human and an agent could understand what's going on. **Much of LLM confusion comes from trying to finish a task with a messy repo as context.**

同一頁列了要寫進文件的八項：repo 導覽、檔案結構、setup 與環境、最佳實踐、程式風格、存取模式、API 與契約——外加一句「a monorepo design in your repo is highly encouraged」。

把它跟 Factory 的八根柱子擺在一起看很有意思：**課程那份偏「寫給人與 agent 看的文件」，Factory 那份偏「機器可判定的檢查」。** 一年之間，這個主題從「請把 repo 整理乾淨」變成「你的 repo 可以被打分數」。

## 「壞掉的不是 agent，是環境」

Factory 在 [Introducing Agent Readiness](https://factory.ai/news/agent-readiness)（2026 年 1 月）裡把問題描述得很精準：

> Teams deploying AI coding agents often see uneven results. They blame the model, try a different agent, get the same thing. The real problem is usually the codebase itself.
>
> The agent is not broken. The environment is.

接著是三個具體例子：沒有 pre-commit hook，agent 就得等十分鐘的 CI 而不是五秒的本機回饋；環境變數沒寫在文件裡，agent 只能猜、失敗、再猜；build 流程藏在某條 Slack 討論串裡，agent 根本沒辦法驗證自己做的東西對不對。

Eno Reyes 對這件事的一句話總結流傳得更廣：**agent readiness 就是 codebase 裡確定性驗證迴圈的密度**——linter、type checker、安全掃描、端對端測試，這些非過即敗的東西，對 agent 來說等同於密集的獎勵訊號。訊號越密，agent 能自己跑越久而不需要人介入。

這跟 [Week 4 的 hooks](/posts/ai/2026-08-16-cs146s-agent-customization) 是同一個機制的兩種說法：hook 之於單次任務是閘門，驗證迴圈之於整個 repo 是地形。

## 八根柱子

Factory 的框架把 repo 拆成八個面向評分：

| 柱子 | 在問什麼 |
|---|---|
| Style & Validation | 有沒有 linter、formatter、type checker |
| Build System | build 能不能重現、要不要口耳相傳的知識 |
| Testing | 測試存不存在、跑不跑得動、涵蓋到哪 |
| Documentation | 環境變數、架構、慣例有沒有寫下來 |
| Dev Environment | 新環境從零到能跑要幾步 |
| Code Quality | 複雜度、重複、死碼 |
| Observability | 出事的時候看得到什麼 |
| Security & Governance | 掃描、CODEOWNERS、branch protection |

每一項對應一個他們在實際部署裡觀察到的失效模式。以 Style & Validation 為例，缺了它的後果被寫成：「Agent submits code with formatting issues, waits for CI, fixes blindly, repeats.」

## 五個等級，以及那條 80% 規則

分數會把 repo 落到五個成熟度等級：**Functional → Documented → Standardized → Optimized → Autonomous**。

Level 3 Standardized 被明確標為目標：「Production-ready for agents... Level 3 is the target. Most teams should aim here first.」到這一級的 repo，agent 能穩定接手例行維護——修 bug、補測試、補文件、升相依套件。

過級規則值得注意：**要解鎖某一級，必須通過該級與所有前面等級 80% 的條目**。文章解釋這個設計是為了「building on solid foundations rather than cherry-picking easy wins at higher levels」——不能跳過測試直接去補 observability 換分數。

組織層級的指標也刻意選得不一樣：他們追蹤的是「有多少比例的活躍 repo 到達 L3 以上」，理由是「'80% of our active repos are agent-ready' is more actionable than 'our average score is 73.2%'」。

## 公開分數：同樣成功的專案，差距很大

Factory 把幾個知名開源專案的評分[公開出來](https://factory.ai/agent-readiness)，這是這個框架最有說服力的部分：

| 專案 | 語言 | 等級 | 分數 |
|---|---|---|---|
| cockroachdb/cockroach | Go | L4 | 74% |
| fastapi/fastapi | Python | L3 | 53% |
| expressjs/express | TypeScript | L2 | 28% |

他們自己的評論很誠實：

> The contrast is instructive. CockroachDB at Level 4 has extensive CI, comprehensive testing, clear documentation, and security scanning. Express at Level 2 lacks several foundational signals. Both are successful, widely-used projects. But an agent will have a much easier time contributing to CockroachDB.

**這才是重點**：Express 不是爛專案，它是被幾百萬個專案依賴的成熟函式庫。「對人友善」跟「對 agent 友善」是兩個不同的軸，而多數 repo 從來沒被第二個軸量過。

## 一個關於評分本身的細節

用 LLM 評 60 幾條條目會有非決定性問題——同一個 repo 連跑兩次分數不一樣，這會直接毀掉信任。Factory 揭露了他們怎麼處理：把每次評估 grounding 在該 repo 的前一份報告上。

> Before the fix, variance averaged 7% with spikes to 14.5%. After grounding, variance dropped to 0.6% and has stayed there for six weeks across 9 benchmark repositories.

多數評分條目其實是檔案存在檢查或設定檔解析（linter config 在不在、branch protection 開了沒、測試能不能本機跑），每條非過即敗。**這個設計選擇本身就是一課**：能用確定性檢查的地方就別讓模型判斷。

## 不用任何工具，自己審一次

框架是廠商的，但檢查表可以自己跑。從八根柱子挑出最能立即見效的六個問題：

1. **新機器 clone 下來到跑起來要幾步？** 超過三步就寫成腳本
2. **改一行 code 到看到 lint / type 錯誤要多久？** 超過十秒就該有本機閘門
3. **測試能單獨跑某一個嗎？** 只能整包跑的話，agent 每次驗證都要付全額
4. **環境變數有沒有一份完整清單？** 沒有的話 agent 只能猜
5. **build 有沒有哪一步只存在於某人腦中？** 那一步就是 agent 的天花板
6. **失敗訊息看得出下一步該做什麼嗎？** 「Error: 1」對 agent 跟對新人一樣沒用

第 6 條最常被忽略。agent 讀到的錯誤訊息就是它的全部回饋——訊息模糊，它就只能亂猜。

## 這個框架的邊界

要說清楚幾件事：

- 這是**廠商框架**。Factory 賣的就是 coding agent，「你的 repo 還沒準備好」對他們是有利的敘事。八根柱子本身站得住腳，但等級門檻與權重是他們定的
- 分數由 LLM 產生。他們把變異數壓到 0.6%，但穩定不等於正確
- 高分不保證 agent 表現好，只是移除了一批已知障礙

不過文章最後那句話是對的，而且跟廠商利益無關：

> This is not just about Factory. A more agent-ready codebase improves the performance of all software development agents.

**一個有快回饋、清楚文件、可重現 build 的 repo，本來就是對人也比較好的 repo。** agent 只是把代價變得更明顯了。

## 會過期的東西

- 三個公開專案的分數是評估當下的快照，repo 會變
- 八柱五級的條目細節可能隨產品迭代調整
- Fall 2026 這週的實際教材與作業要開課後才知道

## 參考資料

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 5 主題與客座
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory，2026-01-20，八柱五級框架與評分方法
- [Agent Readiness Reports](https://factory.ai/agent-readiness) — 公開開源專案評分
- [Making Codebases Agent Ready – Eno Reyes, Factory AI](https://www.youtube.com/watch?v=ShuJ_CN6zr4) — 本週客座的同主題演講
- [From first prompt to optimal IDE setup](https://docs.google.com/presentation/d/11pQNCde_mmRnImBat0Zymnp8TCS_cT_1up7zbcj6Sjg/edit) — Fall 2025 Week 3 課堂投影片，agent-ready codebase 的前身
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic Engineering，檔案結構與命名對 agent 的訊號價值
