---
title: "CS146S Week 3：Agent Skills 是一個資料夾，難的是那兩行 description"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - agent-skills
  - claude-code
  - agent-cli
  - context-engineering
  - ai-agent
lang: zh-TW
type: deep-dive
series:
  name: "CS146S：AI 原生開發十週"
  order: 4
tldr: "Agent Skills 的規格小到一句話講得完：一個含 SKILL.md 的資料夾。真正的設計在三層 progressive disclosure——開機只載 name 與 description，命中才讀全文，需要才展開附檔。本站自己的 repo 有 35 個 skill、7,893 行 SKILL.md，開機成本仍然只有那 35 組 metadata。"
description: "拆解 Stanford CS146S Fall 2026 第三週「Agent Skills and CLI」：SKILL.md 的三層 progressive disclosure、skill 裡放腳本與放指示的分界、skill 與 MCP 的分工，以及 skill 的安全風險。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-16-cs146s-agent-skills-en)

這是 [CS146S 系列](/posts/ai/2026-08-16-cs146s-course-map)的第四篇，對應 Fall 2026 的第三週。

課程主題三條：skills 是什麼、SKILL.md 加腳本怎麼把一套工作流編碼起來、web skills 與把 agent 能力延伸到 repo 之外，再加上「working effectively from the CLI」。客座是 [Lee Robinson](https://leerob.com/cursor)，他在 2025 年 7 月從 Vercel 轉去 Cursor 做開發者教育。

這一週在 Fall 2025 完全不存在——那時 Agent Skills 還沒發表。

## 規格小得有點可疑

Anthropic 在 [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)（2025 年 10 月）給的定義是：

> At its simplest, a skill is a directory that contains a `SKILL.md` file. This file must start with YAML frontmatter that contains some required metadata: `name` and `description`.

就這樣。沒有 DSL、沒有註冊流程、沒有執行時 API。2025 年 12 月 18 日，Anthropic 把它[開放成跨平台標準](https://agentskills.io/)，同一份資料夾可以餵給不同家的 agent。

一個看起來這麼薄的東西為什麼值得一整週？因為它解的不是「怎麼描述能力」，是「怎麼在不炸掉 context 的前提下擁有很多能力」。

## 三層 progressive disclosure

這是整個設計的核心，也是唯一需要記住的機制：

| 層 | 內容 | 什麼時候進 context |
|---|---|---|
| 1 | frontmatter 的 `name` + `description` | 開機時，全部 skill 都載 |
| 2 | `SKILL.md` 本文 | 模型判斷這個 skill 跟當前任務相關時 |
| 3 | skill 目錄裡被引用的其他檔案 | 模型讀了本文之後，決定需要時 |

Anthropic 的比喻是一本編排良好的手冊：「starts with a table of contents, then specific chapters, and finally a detailed appendix」。他們舉的例子是 PDF skill——填表單的指示被拆到獨立的 `forms.md`，主檔保持精簡，「trusting that Claude will read `forms.md` only when filling out a form」。

結論那句很關鍵：因為有檔案系統與程式執行能力，「the amount of context that can be bundled into a skill is effectively unbounded」。

拿本站自己的 repo 當實例：`.agents/skills/` 底下有 **35 個 skill、50 個檔案、7,893 行 SKILL.md**。如果這些內容全部塞進 system prompt，開機就先燒掉十幾萬 token；三層機制下，開機成本只有那 35 組 name 與 description。

## 所以 description 才是那個難的部分

第一層是唯一「一定會被讀到」的東西。模型要不要展開你的 skill，全靠那兩行。

Anthropic 的建議是：「Pay special attention to the `name` and `description` of your skill. Claude will use these when deciding whether to trigger the skill in response to its current task.」

實際上這代表 description 不該寫成介紹，該寫成**檢索鍵**：把使用者可能講出口的說法直接寫進去。比較一下：

```yaml
# 檢索不到
description: "文章寫作工具"

# 檢索得到
description: "把對話、筆記或經驗轉成 src/content/posts/<category>/ 底下的
  Markdown 文章。使用者說「寫成文章」「記錄一下」「寫成介紹文」「deep dive」
  或貼上筆記要求發佈時使用。不要用來改既有文章——那要用 post-update skill。"
```

第二個版本做了三件事：講清楚產出物、列出觸發語（含中英文）、**明確排除**不適用的情境。最後那一項最常被漏掉，也是最容易造成 skill 互搶的原因。

## 腳本 vs 指示：什麼該寫成 code

skill 可以夾帶程式碼讓 agent 執行。Anthropic 對分界的說法很實際：

> sorting a list via token generation is far more expensive than simply running a sorting algorithm. Beyond efficiency concerns, many applications require the deterministic reliability that only code can provide.

一條可用的判準：**答案唯一、可驗證、會重複跑的 → 寫成腳本；需要判斷、依情境變化的 → 寫成指示**。他們的 PDF skill 就是這樣切的：抽取表單欄位是 Python 腳本（Claude 跑它，不用把腳本或 PDF 讀進 context），怎麼填、填什麼是指示。

本站的 skill 也是同樣切法：`pnpm check:references`、`pnpm lint` 這些驗證是指令，「什麼情況需要參考資料」是寫在 SKILL.md 裡的規則。

## skill 跟 MCP 差在哪

這是最常被問的問題，分界其實乾淨：

- **MCP 給的是能力**——agent 原本碰不到那個系統，接上 MCP server 才碰得到
- **skill 給的是流程**——agent 原本就有工具，只是不知道你們公司的做法

Anthropic 自己也把兩者放在互補位置，說會探索「how Skills can complement MCP servers by teaching agents more complex workflows that involve external tools and software」。

課程主題裡的「web skills and extending agent capability beyond the repo」大概就落在這個交界上。具體內容要等 9 月開課才知道——syllabus 目前只有這一行。

## 安全：這是一個會執行的資料夾

Anthropic 在同一篇裡放了警告：

> malicious skills may introduce vulnerabilities in the environment where they're used or direct Claude to exfiltrate data and take unintended actions.

建議是只裝可信來源的 skill；來源不夠可信就先逐檔讀過，特別注意程式相依套件、夾帶的資源檔，以及會叫 agent 連上外部網路的指示。

換句話說：**裝一個 skill 等於在你的 agent 身上執行別人寫的東西**，安全模型跟裝一個 npm 套件同級，不是跟收藏一個 prompt 同級。這條線接到 [Week 7 的供應鏈與 prompt injection](/posts/ai/2026-08-16-cs146s-agent-security)。

## 怎麼寫出一個真的會被觸發的 skill

Anthropic 給的四條開發建議，濃縮起來是：

1. **從評估開始**——先跑真實任務，看 agent 在哪裡卡住，再針對那個缺口寫 skill；不要先寫再找用途
2. **為規模而拆檔**——SKILL.md 變厚就拆出去；互斥或少用的內容分開放
3. **從模型視角看**——觀察它實際怎麼用你的 skill，特別注意有沒有該觸發沒觸發
4. **跟模型一起迭代**——做完一個任務就請它把成功做法與踩到的坑寫回 skill；出錯時請它自我檢討哪裡走偏

第 4 條有個容易忽略的效果：你會發現 agent 真正需要的 context，跟你**以為**它需要的並不一樣。

## 會過期的東西

- 「web skills」是 Fall 2026 syllabus 的用詞，課程尚未公布具體定義
- Agent Skills 成為跨平台標準後各家實作進度不一，能不能直接搬要個別確認
- 本站 repo 的 skill 數字是 2026-08-16 當下的狀態

## 參考資料

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 3 主題與客座
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Anthropic Engineering，2025-10-16
- [Agent Skills 開放標準](https://agentskills.io/) — 2025-12-18 起的跨平台規格
- [anthropics/skills](https://github.com/anthropics/skills) — 官方開源 skill 集
- [Agent Skills 官方文件](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
- [Cursor | Lee Robinson](https://leerob.com/cursor) — 本週客座的現職說明
