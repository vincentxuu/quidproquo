# 系列規劃：AI 小白的研究型部落格（Claude Code / Codex 雙軌）

規劃日期：2026-07-27　｜　狀態：待使用者拍板（Tier 2 決策見文末）

目標：讓「完全不會寫程式、也不熟 AI」的人，跟著系列走完之後，擁有一個**能持續把 AI 研究資料變成文章的部落格**，而且這套流程在 Claude Code 與 Codex 上都能跑。

不是「教你叫 AI 寫文章」。是教你建一條**研究 → 寫作 → 查核 → 發布**的產線，AI 負責跑，人負責決定。

---

## 1. 為什麼值得寫（市場空缺）

同題材已經很擁擠，但擁擠的是同一塊：

| 已被寫爛 | 代表作 |
|---|---|
| 非工程師的 Claude Code 入門 | [Michael Crist 的完整指南](https://michaelcrist.substack.com/p/claude-code)、[vista.tw 文組人自學指南](https://www.vista.tw/blog/claude-code-liberal-arts-guide) |
| 用 Claude Code 架部落格 | [codotx](https://codotx.com/news/claude-code-blog-setup-concepts/)、[raven.tw](https://raven.tw/blog/claude-code-personal-blog-complete-guide)（都是 Astro + Cloudflare） |
| 把寫作風格封裝成 skill | [oberonlai](https://oberonlai.blog/2026-03-04-claude-code-skill-creator-blog-writing/) |

四個沒人好好寫的缺口，正好是本系列的骨架：

1. **雙軌兼容**。中文教學清一色綁死 Claude Code。但 Agent Skills 已是[開放標準](https://agentskills.io/specification)，Codex 也吃 SKILL.md——只是兩邊載入路徑完全不同（`.claude/skills` vs `.agents/skills`），memory 檔也不同（`CLAUDE.md` vs `AGENTS.md`）。「一份設定兩邊跑」的具體做法目前沒有中文資料。
2. **研究層**。競品都停在「叫 AI 幫我寫一篇」。子問題拆解、來源分級、交叉驗證這層是空白。
3. **把關層**。沒人談發文前的事實查核，而這正好對上 Google 的 scaled content abuse 政策——2026 年 AI 寫作唯一真正的風險。
4. **可長期運作**。競品是一次性教學（架起來就結束），沒處理累積後的治理、成本、內容過期。

本站的獨特籌碼：quidproquo 已有 671 篇文章、7 個內容 skill、一道 `pnpm verify` 閘門、一套治理章程。這是**已經跑了幾個月的真實產線**，不是示範專案。

---

## 2. 系列設計原則

- **每篇 = 一個可交付的成果**。讀完第 N 篇，讀者手上多一個實體東西（裝好的工具 / 上線的網址 / 一個 skill）。沒有純觀念篇。
- **雙軌並列，不分叉**。每篇的操作段落用同一組「Claude Code / Codex」對照表呈現，不寫成兩套教學。差異大到寫不進表格的，集中到第 9 篇。
- **先能動，再求好**。前 4 篇不談 skill、不談治理。讓人先發出第一篇文章。
- **不假裝零成本**。方案費用、usage limit、免費託管天花板都攤開講。
- **每篇結尾都有「這步會出什麼錯」**。小白教學的死亡率在卡關，不在資訊量。

---

## 3. 文章清單

### 核心 8 篇

| # | 暫定標題 | 讀完後手上有什麼 | type |
|---|---|---|---|
| 1 | Agent 不是 chatbot：研究型部落格的三段式產線 | 一張工具地圖 + 判斷該用哪個介面 | guide |
| 2 | 裝起來：Claude Code 與 Codex 的雙軌入門與費用真相 | 兩個能跑的 CLI、一個乾淨的專案資料夾 | guide |
| 3 | 讓 agent 幫你把部落格生出來並上線 | 一個有網址的部落格 | guide |
| 4 | AGENTS.md 與 CLAUDE.md：把「我是誰、我要什麼」寫下來 | 一份兩邊都吃的專案記憶 | guide |
| 5 | 研究不是叫 AI 搜尋：子問題、來源分級、交叉驗證 | 一份帶來源清單與事實交叉表的 research note | guide |
| 6 | 從 research note 到一篇文章 | 你的第一篇研究型文章 | guide |
| 7 | 發文前的三道關卡：審稿、查證、連結檢查 | 一份可重複執行的發文檢查清單 | guide |
| 8 | 把整條流程封裝成 skill，Claude 與 Codex 共用一份 | 你自己的 `post` / `research` skill | guide |

### 延伸 3 篇（核心跑順之後再出）

| # | 暫定標題 | 主軸 | type |
|---|---|---|---|
| 9 | 雙軌兼容的工程細節 | skill 路徑差異、sync vs symlink、`/` vs `$`、context budget | deep-dive |
| 10 | 不要讓它長歪：治理、成本與內容過期 | 行動分級、verify gate、usage limit、freshness | deep-dive |
| 11 | 讓文章被找到：英文版、排程發布、AEO/GEO | 翻譯 pipeline、未來日期發布、結構化資料 | guide |

---

## 4. 逐篇規劃

### 第 1 篇｜Agent 不是 chatbot：研究型部落格的三段式產線

**讀者狀態**：用過 ChatGPT 網頁版，覺得「AI 寫的東西很空」，不知道差在哪。

**核心論點**：差別不在模型，在**它有沒有手**。Chatbot 回你一段字；agent 會讀你的檔案、開你的終端機、改你的檔案、跑你的檢查。研究型部落格需要的是後者，因為研究資料要落地成檔案、文章要進版控、事實要被驗證器擋。

**要講的段落**：
- 三段式：研究（產出 research note）→ 寫作（note 變文章）→ 查核（發文前的閘門）。整個系列就是這三段。
- 工具地圖：Claude 網頁/桌面版、Claude Code、Claude Cowork、ChatGPT、Codex CLI 各適合什麼。表格呈現，讓讀者知道自己該裝哪個。
- 為什麼是 CLI 而不是網頁：檔案落地、可版控、可重複執行、skill 可攜。
- 反面案例：直接叫 AI「寫一篇關於 X 的文章」會拿到什麼（無來源、無立場、無法查證）。

**引用來源**：agentskills.io/home（progressive disclosure 概念）、Anthropic engineering 的 Agent Skills 文。

**內部連結**：`ai/2026-03-17-ai-agents-context-cognition-action`、`ai/2026-04-01-agent-cli-guidelines`、`ai/2026-04-02-agent-cli-claude-code`、`ai/2026-04-02-agent-cli-openai-codex`。

**風險**：容易寫成純觀念文。必須以「一張你能照著選的工具地圖」作為交付物。

---

### 第 2 篇｜裝起來：Claude Code 與 Codex 的雙軌入門與費用真相

**讀者狀態**：沒開過終端機。

**要講的段落**：
- 兩軌安裝（macOS / Windows / WSL），一步一圖。
- **費用真相**（本系列的誠實點）：
  - Claude Code 含在 Pro $20/mo（年繳約 $17/mo）、Max $100 / $200（[官方定價](https://claude.com/pricing)）。
  - 關鍵坑：Claude 網頁、桌面、手機與 Claude Code **共用同一個 usage pool**，5 小時滾動視窗加週上限（[官方支援文件](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)）。小白最常見的挫折是「聊天用一用，寫文章時額度沒了」。
  - Codex CLI 的方案歸屬（⚠️ 發文前必須回 OpenAI 官方定價頁確認，目前只有二手來源）。
- **安全紅線**（放在這篇，不要往後推）：
  - 只在專屬資料夾啟動 agent，不要在家目錄或桌面開——它看得到那個資料夾底下的全部檔案。
  - 不要把有密碼、金鑰的資料夾交給它。
  - 先裝 git 再開始，否則沒有回頭路。
- 第一個任務：叫它讀一份你自己的筆記並摘要。目的是建立「它真的看得到我的檔案」的體感。

**引用來源**：claude.com/pricing、support.claude.com 11145838、ccforeveryone 的費用時間軸（僅作背景，數字回官方）。

**內部連結**：`tech/2026-03-16-claude-code-dangerously-skip-permissions`、`tech/2026-03-28-claude-code-troubleshooting-collection`。

**待確認**：Codex CLI 方案歸屬；2026-06-15 程式化用量 credit pool 政策現況（會影響第 11 篇的排程發布）。

---

### 第 3 篇｜讓 agent 幫你把部落格生出來並上線

**讀者狀態**：CLI 裝好了，還沒有網站。

**要講的段落**：
- 選型：為什麼是 Astro + Cloudflare 而不是 WordPress / Notion / Substack。判準只有三個——**檔案是不是你的、agent 能不能直接改、要不要付月費**。
- Markdown 為什麼是關鍵：agent 讀寫 Markdown 沒有摩擦，讀寫 CMS 後台有。
- 實作：叫 agent 建專案 → 本機看得到 → 推上 GitHub → 接 Cloudflare → 綁網域。
- **成本天花板攤開**：Cloudflare Pages 免費方案 500 builds/月、每專案 100 自訂網域、20,000 檔案、靜態請求與頻寬不計費（[官方限制頁](https://developers.cloudflare.com/pages/platform/limits/)）；Workers 免費 100,000 requests/日、每次 10ms CPU（[官方定價](https://developers.cloudflare.com/workers/platform/pricing/)）。個人部落格幾乎不可能撞到。網域約 $8/年起（Cloudflare Registrar 成本價）。
- 這步最常卡的地方：git 沒設好、Node 版本、Cloudflare 綁定 DNS。

**內部連結**：`product/2026-03-12-quidproquo-blog-from-scratch`（本站的選型理由，pinned）、`tech/2026-03-27-cloudflare-workers-edge-compute`、`tech/2026-03-27-github-actions-ci-cd`。

**風險**：這篇與 codotx、raven.tw 高度重疊。差異化必須靠「成本天花板 + 為什麼不用 CMS 的判準」，不要比誰的步驟更細。

---

### 第 4 篇｜AGENTS.md 與 CLAUDE.md：把「我是誰、我要什麼」寫下來

**讀者狀態**：有網站了，但 agent 每次都要重講一遍規則。

**這篇是整個系列的第一個「雙軌」關鍵點，也是最容易踩雷的一篇。**

**核心事實**（官方明說）：**Claude Code 讀 `CLAUDE.md`，不讀 `AGENTS.md`**（[官方 memory 文件](https://code.claude.com/docs/en/memory)）。Codex 則以 `AGENTS.md` 為主。

**官方給的兩個相容做法**：

```markdown
<!-- CLAUDE.md -->
@AGENTS.md

## Claude Code 專屬
（只有 Claude Code 需要遵守的規則寫這裡）
```

或（不需要加 Claude 專屬內容時）：

```bash
ln -s AGENTS.md CLAUDE.md
```

Windows 建立 symlink 需要管理員或開發者模式，所以**小白一律教 import 寫法**，symlink 只當進階選項提一句。

**其他要講的**：
- 該寫什麼進去：慣例、常用指令、「永遠要做 X」。不該寫什麼：多步驟流程（那是 skill 的事）。
- 官方建議單檔 200 行以內，太長會降低遵循率。
- `/init` 可以幫你生第一版。

**內部連結**：`tech/2026-04-05-symlink-agents-md-claude-md`（本站已有，正好接續）、`ai/2026-03-24-context-engineering-guide`。

---

### 第 5 篇｜研究不是叫 AI 搜尋：子問題、來源分級、交叉驗證

**讀者狀態**：想寫一篇「我研究了 X」，但不知道怎麼開始才不會寫出空話。

**這篇是系列的價值核心，也是所有競品都沒做的一段。**

**要講的段落**：
- 為什麼「幫我研究 X」會失敗：題目太大，agent 只能給你維基百科等級的東西。
- **拆子問題**：把題目變成 3–6 個可獨立查證的問題。先讓人看一眼再開搜——**錯題比錯答更貴**。
- **來源分級**：官方文件 / release notes / 論文 > 作者本人 blog / X > HN / Reddit / 高星 repo issue > 內容農場（跳過）。
- **每個子問題至少 2 個來源**，衝突的事實列出來不選邊。
- **事實交叉表**：把每條事實標成 ✅ 已驗證 / ⚠️ 單一來源 / ❌ 來源衝突。這張表是後面第 7 篇查核的輸入。
- 工具：能搜就不用爬、能爬單頁就不用整站、能整站就不用瀏覽器。每升一階成本與失敗率都升一階。
- 產出物：一份 research note（可直接示範本站 `.research/` 的實際檔案結構）。

**雙軌差異**：Claude Code 走 MCP 搜尋工具；Codex 走內建 web 搜尋。用對照表呈現。

**內部連結**：`ai/2026-05-10-llm-writing-pipeline-learnings`（Nova 的 golden source seeds、三輪 gap analysis、兩階段 filtering 可直接引用）、`ai/2026-06-04-autonomous-deep-research-agent`。

**第一手素材**：本站 `.agents/skills/deep-research/` 的實際內容與 `.research/` 的真實檔案。

---

### 第 6 篇｜從 research note 到一篇文章

**讀者狀態**：手上有 research note，要變成能發的文章。

**要講的段落**：
- 為什麼要分兩步（研究 / 寫作）而不是一步到位：一步到位會讓模型在沒有素材時開始編。
- 模板選擇：踩坑文 / 深入介紹 / 自由結構，三種結構差在哪。
- Frontmatter 是什麼、為什麼機器需要它。
- **inline 引用是有量化效果的**：Princeton GEO 論文（KDD 2024）測到 inline 引用 +28%、加數字 +33%、引用原文 +41%、關鍵字塞詞 −9%。本站已有這組數據，直接內連。
- tldr / description 怎麼寫（給人看 vs 給機器看）。
- **不要讓 AI 寫「我」的部分**：第一人稱經驗、判斷、取捨必須是你自己的。這是 AI 內容與非 AI 內容真正的分水嶺。

**內部連結**：`ai/2026-05-10-llm-writing-pipeline-learnings`、`marketing/2026-04-18-ai-search-engine-aeo-geo-strategy`、`tech/2026-03-27-blog-seo-optimization-guide`。

---

### 第 7 篇｜發文前的三道關卡：審稿、查證、連結檢查

**讀者狀態**：文章寫好了，手指懸在發布鍵上。

**這篇是全系列最有立場的一篇，也是最該被讀的一篇。**

**核心論點**：AI 寫作在 2026 年唯一真正的風險不是「被抓到用 AI」，是**你發了一篇沒人查證過的東西**。

**Google 官方實際說了什麼**（引用，不轉述二手）：
- Google 不因「AI 生成」本身處罰內容。scaled content abuse 政策明寫適用於任何產製方式——「no matter how it's created」（[spam policies](https://developers.google.com/search/docs/essentials/spam-policies)）。
- 官方 gen-AI 指引：AI 特別適合用於**研究主題與建立結構**，但「用生成式 AI 產出大量頁面而未為使用者增加價值」可能違反 scaled content abuse（[官方指引](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)）。
- 官方還建議：如果內容是自動產製的，考慮以合適方式讓讀者知道自動化是怎麼被使用的。

翻譯成人話：**用 AI 做研究和結構是 Google 明講可以的事。禁區是量產無價值頁面。**這條線非常清楚，而第 5 到第 7 篇就是站在線內的方法。

**三道關卡**：
1. **審稿**（結構層）：frontmatter 齊不齊、tldr 是不是廢話、標題階層能不能讀、tag 有沒有亂長。
2. **查證**（事實層）：把版本號、API 名稱、價格、指令、日期、統計數字全部抽出來，逐條對回權威來源，標成 Confirmed / Outdated / Unverifiable / Contradicted。
3. **連結檢查**（機械層）：內部連結有沒有斷、外部連結還活著嗎。

**關鍵設計**：第 3 道必須是**機器跑的**，不是 AI 判斷的。可以被驗證器擋下來的東西，就不要交給模型判斷。

**雙軌差異**：兩邊都能跑同一組檢查指令，因為檢查是 npm script，不是 agent 能力。

**內部連結**：`ai/2026-06-04-agent-change-rigorous-evaluation`、`marketing/2026-04-18-ai-search-engine-aeo-geo-strategy`。

**第一手素材**：本站 `post-review` / `post-verify` skill、`pnpm verify` 閘門、`check:references` script。

---

### 第 8 篇｜把整條流程封裝成 skill，Claude 與 Codex 共用一份

**讀者狀態**：跑過一輪了，不想每次重講流程。

**要講的段落**：
- 什麼時候該把東西變成 skill：當你第三次貼同一段指示的時候。
- **SKILL.md 就是一個資料夾加一個檔案**。必填只有兩個欄位（[官方規格](https://agentskills.io/specification)）：
  - `name`：≤64 字、只能小寫字母數字與連字號、不能頭尾是連字號、**必須等於資料夾名**。
  - `description`：≤1024 字，要同時說清楚「做什麼」和「什麼時候用」。這欄決定 agent 會不會在對的時候叫它。
- 選填：`license`、`compatibility`、`metadata`、`allowed-tools`（實驗性）。
- **progressive disclosure 三階段**：啟動時只載入 name + description（約 100 tokens）→ 命中才載入整份 SKILL.md（建議 <5000 tokens）→ 附屬檔按需讀取。所以 SKILL.md 要控制在 500 行內，細節放 `references/`。
- 兩邊都有內建生成器：Claude Code 走 `skill-creator` plugin，Codex 打 `$skill-creator`。
- 驗證：`skills-ref validate ./my-skill`。

**呼叫語法對照**：

| | 呼叫 | 個人 skill | 專案 skill |
|---|---|---|---|
| Claude Code | `/skill-name` | `~/.claude/skills/<name>/SKILL.md` | `.claude/skills/<name>/SKILL.md` |
| Codex | `$skill-name` 或 `/skills` | `$HOME/.agents/skills/<name>/` | `$CWD/.agents/skills/<name>/` |

**內部連結**：`ai/2026-05-08-anthropic-claude-skills-guide`、`ai/2026-04-10-agent-skills-engineering-workflows`、`ai/2026-03-30-skill-vs-subagent-comparison`、`ai/2026-06-06-llm-agent-skill-lifecycle`。

---

### 第 9 篇（延伸）｜雙軌兼容的工程細節

deep-dive。把第 8 篇刻意簡化掉的東西攤開。

**要講的**：
- **路徑差異是真正的痛點**。Codex 掃 `.agents/skills`（從 CWD 往上到 repo root）、`$HOME/.agents/skills`、`/etc/codex/skills`；Claude Code 掃 `.claude/skills` 與 `~/.claude/skills`。同一份 skill 要兩邊看得到，只有三條路：
  1. **symlink**——兩邊官方都支援 symlink 的 skill 資料夾。最省事。
  2. **同步腳本**——單一來源放 `.agents/skills/`，用腳本鏡像到 `.claude/skills/`，並用驗證器擋住手改鏡像。本站走這條（`pnpm skills:sync` + `pnpm check:skills-sync`），代價是多一個步驟，好處是 CI 上不依賴 symlink 行為。
  3. **兩份各自維護**——不要。
- Windows 的 symlink 限制（需管理員或開發者模式），決定了教學該推哪一條。
- **Codex 的 context budget**：初始 skill 清單最多佔模型 context 的 2%（未知時 8,000 字元）；skill 太多時 Codex 會先縮短描述，甚至略過部分 skill 並警告。這意味著 description 要**把關鍵用途和觸發詞寫在前面**。
- Claude Code 的同名優先序：enterprise > personal > project；plugin skill 走 `plugin:skill` 命名空間不衝突。
- Claude Code 的自訂 command 已併入 skill：`.claude/commands/deploy.md` 與 `.claude/skills/deploy/SKILL.md` 都會產生 `/deploy`。
- 跑在雲端時的陷阱：Cowork 與 cloud session **不讀本機** `~/.claude/skills/`；cloud session 只讀 repo 內 `.claude/skills/`。所以想讓排程/雲端跑得動，skill 必須進版控。
- Codex 可用 `~/.codex/config.toml` 的 `[[skills.config]]` 停用單一 skill 而不刪檔。

**第一手素材**：本站 `.agents/skills/` → `.claude/skills/` 的同步機制與踩過的坑，是這篇的主體。

**內部連結**：`tech/2026-04-02-ai-agent-global-skills-paths`、`tech/2026-04-05-symlink-agents-md-claude-md`、`tech/2026-03-27-claude-code-global-skills-not-found`。

---

### 第 10 篇（延伸）｜不要讓它長歪：治理、成本與內容過期

deep-dive。寫給已經跑了兩三個月、開始出現熵的人。

- 行動分級：哪些讓 agent 自己做、哪些要過閘門、哪些必須先問、哪些永遠禁止。
- 為什麼「為了讓檢查變綠而弱化檢查」是最該禁止的一條。
- 一份輕量的 session memory（本站 `progress.txt`，上限 90 行由驗證器強制）勝過一本日誌。
- 成本控管：usage pool 共用的實際影響、一次一個任務、context 用到一半就換新對話。
- 內容會過期：版本號、價格、API 名稱都有保鮮期。freshness 檢查與「更新紀錄」章節。
- tag 腐化與同義詞分裂。

**第一手素材**：`docs/governance/operating-charter.md`、`progress.txt` 協定、`tag-audit` skill。

---

### 第 11 篇（延伸）｜讓文章被找到：英文版、排程發布、AEO/GEO

- 翻譯 pipeline 與雙語互連。
- 未來日期發布（`date` 設未來 + 每日定時 deploy）。
- 結構化資料、RSS、`llms.txt`。
- AEO/GEO 與傳統 SEO 的差別。

**內部連結**：`marketing/2026-04-18-ai-search-engine-aeo-geo-strategy`、`marketing/2026-04-21-aeo-geo-tracking-tools-landscape`、`docs/translation-pipeline.md`、`docs/publishing-schedule.md`。

**待確認**：程式化用量（`claude -p` / GitHub Actions）的 credit pool 政策現況，會直接影響「排程自動化」這段能寫多滿。

---

## 5. 發布設定建議

- **category**：全系列 `ai`。理由是主題是 agent 工作流，不是網站技術；第 3 篇雖然偏建置，但拆到 `tech` 會斷開系列。
- **series**：`name: "AI 小白的研究型部落格"`，order 1–11。
- **type**：核心 8 篇 `guide`；第 9、10 篇 `deep-dive`；第 11 篇 `guide`。
- **tags 基礎組**：`claude-code`、`codex`、`agent-skills`、`beginner`、`blogging`、`content-pipeline`；分篇再各加 2–3 個（如 `astro`、`cloudflare`、`fact-checking`、`seo`）。
- **語言**：先出 zh-TW 全系列，跑順之後再走 `post-translate` 出英文版。理由是這系列的差異化在中文市場，英文市場競爭者強。
- **節奏**：核心 8 篇建議一週 1–2 篇連續出完（系列斷更等於系列死掉），延伸 3 篇再依素材成熟度排。

---

## 6. 素材盤點

**已經有的（不用另外做）**：
- 671 篇文章的真實產線、7 個內容 skill、`pnpm verify` 閘門、治理章程、`.research/` 實例、`.agents/skills` → `.claude/skills` 同步機制。
- 可直接內連的既有文章 20+ 篇（各篇規劃中已標）。

**需要現做的**：
- 第 2、3 篇的安裝與部署截圖。小白教學沒有截圖，完成率會掉很多。
- 第 5、6 篇需要一個**全新的、從零跑一遍的示範題目**——不能拿舊文章倒推，否則會寫成事後合理化。建議挑一個當下真的想研究的小題目，全程錄下來。
- Codex 側的實機驗證。目前雙軌的知識來自官方文件，但小白會踩的坑必須實際跑過才知道。

---

## 7. 已知風險

| 風險 | 處理 |
|---|---|
| 第 3 篇與中文既有教學高度重疊 | 差異化改用「成本天花板 + 為什麼不用 CMS 的判準」，不比步驟細膩度 |
| 工具版本變動快，教學半年就過期 | 步驟寫「意圖 + 官方文件連結」，少寫會變的 UI 細節；第 10 篇順勢談 freshness |
| 雙軌會讓篇幅膨脹一倍 | 統一用對照表；差異大的集中到第 9 篇，核心 8 篇不分叉 |
| 教人量產內容，反而踩到 scaled content abuse | 第 7 篇正面處理，並把「不要讓 AI 寫『我』的部分」寫進第 6 篇 |
| 系列太長，讀者中途流失 | 每篇都有獨立交付物；核心 8 篇可各自單獨閱讀 |

---

## 8. 事實查核狀態（發文前必須處理）

⚠️ 以下三項目前只有二手來源，**寫進文章前必須回官方確認**：

1. Codex CLI 是否確實含在 ChatGPT Plus 方案（影響第 2 篇的費用表）。
2. 2026-05-06 Anthropic 加倍 5 小時額度、移除尖峰限速的公告細節。
3. 2026-06-15 起程式化用量改走獨立 credit pool 的現況（影響第 2 篇與第 11 篇）。

完整來源清單與事實交叉表：`.research/2026-07-27-beginner-research-blog-claude-code-codex.md`（未入版控）。

---

## 9. 待使用者拍板（Tier 2）

1. **系列規模**：核心 8 篇先跑，還是 8 + 3 一次規劃到底？
2. **示範題目**：第 5、6 篇要用哪個真實題目全程走一遍？（需要一個你當下真的想研究的東西）
3. **要不要附 starter repo**：能大幅降低第 3 篇的門檻，但要長期維護。
4. **截圖／錄影**：要做到什麼程度？完全不做的話第 2、3 篇的完成率會受影響。
5. **category 歸屬**：全系列放 `ai`，或第 3 篇拆到 `tech`？
