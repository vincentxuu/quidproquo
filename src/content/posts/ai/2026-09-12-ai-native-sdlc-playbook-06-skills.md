---
title: "AI-Native SDLC Playbook L6：Skills 把組織規範編碼成可重用知識"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, agent-skills, claude-skills, governance]
lang: zh-TW
tldr: "Skill 是組織隱性知識的編碼形式——一個資料夾加一份 SKILL.md，讓 Claude 在觸發條件成立時自動載入並執行標準作業程序。課程的關鍵原則：skill 讓違規變少見，hook 讓違規接近不可能。"
description: "Claude Academy AI-Native SDLC Playbook 第六課導讀：Skills 的定位、五步建立流程、與 Hooks 的搭配策略，以及 60+ skill 維護的實戰經驗。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 6
---

每個組織都有一些規範是「只有老手知道要做」的：API 上線前要跑安全檢查清單、PR 開出去前要確認 lint 全綠、部署到 staging 有哪些步驟。這些規範通常散在 wiki、onboarding 文件、或是 Slack 裡某個 pinned message。新人不知道、AI agent 更不知道。

[Claude Academy 第六課](https://academy.claude.com/courses/ai-native-sdlc-playbook/skills-as-institutional-knowledge)的核心主張是：**把這些隱性知識打包成 skill，讓 agent 自動載入、一致執行。**

## 課程教了什麼

### Skill 是什麼

依課程定義，skill 是**讓組織的隱性知識（institutional knowledge）變得可操作的方式**。指令是明確的、有版控的、可以廣泛套用的，政策變更時集中更新一次就全部生效。

課程給了一個清楚的判斷原則：

> 需要一致套用的隱性知識 → 建成 skill
> 屬於 CLAUDE.md 或 prompt 的東西 → 不要建成 skill

### 五步建立流程

1. **辨識**：找出一件目前執行不一致的知識——資安標準、API 設計慣例、品牌規範都算
2. **撰寫**：寫一個資料夾，裡面有 `SKILL.md`，frontmatter 定義觸發條件，body 說明執行步驟。工程師從政策負責人的真相來源（source of truth）撰寫，可以請 Claude 協助
3. **放置**：放在 repo 的 `.claude/skills/<name>/` 跟程式碼一起版控，或透過 plugin 全組織發布
4. **測試觸發**：用不同方式請 Claude 做相關任務，確認 skill 每次都有載入
5. **更新**：政策變更時更新 skill，取得政策負責人簽核。工程師在下一次 session 就會自動套用新版

### 範例：API 安全審查 skill

```markdown
---
name: secure-api-review
description: Apply the API security standard. Use whenever creating or
  modifying an external-facing endpoint, reviewing API code, or
  generating an OpenAPI spec.
---
# Secure API review
When you create or change an API endpoint:
1. Authentication: every endpoint requires the gateway JWT;
   no anonymous routes outside /health.
2. Input validation: validate request bodies against the OpenAPI
   schema and reject unknown fields.
3. Audit: every state-changing endpoint emits an audit event with
   actor, action, entity and timestamp.
4. Data classification: fields tagged pii in the schema must never
   appear in logs or error messages.
Run scripts/check-endpoints.sh and include its output in your summary.
```

這個範例展示了 skill 的典型結構：**frontmatter 定義何時觸發**（建立或修改對外 API 時）、**body 定義做什麼**（四項檢查 + 一個自動化腳本）。

### Skill vs Hook：建議性 vs 確定性

課程在這裡畫了一條重要的界線：

> 「Skill 讓違規變少見，hook 讓違規接近不可能。」

Skill 是**建議性控制**（advisory control）——Claude 在寫程式碼時「很可能」會遵守 skill 的指示，但技術上不是強制的。如果某個政策**必須**成立，就需要在 skill 背後加一個 hook 做確定性的攔截。

比如 API 安全的例子：skill 告訴 Claude「每個 endpoint 都要有 JWT 認證」，hook 則在 commit 前自動掃描有沒有未認證的 route——前者是預防，後者是兜底。

### Build 階段的 Hook

課程在這堂課也預告了 build 階段適合的 hook：

- 阻擋對受保護路徑的修改（生成的類別、凍結的套件）
- 檔案修改後自動跑 formatter 和 linter
- 阻止憑證出現在 diff 裡
- 為必須成立的政策提供確定性保障

關鍵限制：**build 階段的 hook 要跑得快，範圍限定在被修改的檔案**。完整測試套件這種重量級檢查屬於 commit 或 PR 階段。

課程也特別指出：「需要人類核准的 hook 屬於 Stage 5: Deploy，因為在 build 階段彈核准提示會把人拉回所有平行 session 的關鍵路徑上。」

## 實戰對照：從 5 個 skill 到 60+

我們在一個中型專案裡從 5 個 skill 開始，現在已經累積超過 60 個。幾個關鍵學到的事：

### Skill 觸發是最大的挑戰

課程說「測試觸發」是第四步，但在實務上這是最花時間的一步。`description` 欄位寫得太模糊，Claude 就不會載入；寫得太廣，不相關的任務也會觸發。我們反覆調整觸發詞，直到每個 skill 的觸發率穩定。

一個有效的做法：在 `description` 裡列出明確的觸發詞清單，而不是寫一段描述性文字。例如「Use when user mentions 新增模型、PricingRule、定價規則、credit、計費」比「Use when relevant to pricing」觸發得更穩定。

### 鏡像同步機制

我們的 skill 編輯統一在 `.agents/skills/` 進行，透過 `skills:sync` 腳本同步到 `.claude/skills/`——後者是 Claude 實際讀取的位置，但不允許手動編輯。verify gate 會檢查兩邊是否一致，不一致就擋下 commit。

這個機制解決了一個實際問題：**當 skill 數量多到一定程度，「誰改了什麼」需要有明確的 source of truth**。`.agents/skills/` 是唯一的編輯入口，其他都是衍生物。

### Skill 的生命週期管理

60+ 個 skill 不可能全部保持最新。我們的做法是：

- 每個 skill 對應一個 owner（通常是最初撰寫的人）
- 當 skill 的觸發率持續低於預期，列入待清理清單
- 被 hook 完全取代的 skill 規則，從 skill 中移除（避免重複檢查）
- 政策變更時，先改 skill、再改程式碼——順序很重要

## 給讀者的起步建議

### 第一步：從一個痛點開始

不要一次建 10 個 skill。找出團隊裡**目前執行最不一致的一件事**——可能是 PR 的檢查清單、API 的錯誤處理慣例、或是特定模組的修改流程。把它寫成一個 skill，測試觸發，用兩週看看效果。

### 第二步：讓政策負責人參與

Skill 的內容應該來自政策負責人（資安主管、tech lead、API 標準的維護者），不是開發者自己猜。工程師的角色是把政策翻譯成 Claude 能理解的 `SKILL.md` 格式。

### 第三步：Skill + Hook 搭配使用

對於「出事成本很高」的規則（資安、合規、敏感資料），不要只靠 skill。Skill 是第一道防線（寫程式碼時就遵守），hook 是第二道（commit/push 時強制檢查）。兩層一起用，覆蓋率最高。

### 第四步：定期清理

每月檢視一次：哪些 skill 觸發率太低（可能觸發詞有問題）？哪些 skill 的規則已經被 hook 取代了？哪些 skill 的政策來源已經過時？Skill 跟程式碼一樣需要維護——不維護就會腐爛。

## 參考資料

- [Skills as Institutional Knowledge — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/skills-as-institutional-knowledge)
- [Claude Code Skills — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/skills)
- [AI-Native SDLC Playbook 課程導讀](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
