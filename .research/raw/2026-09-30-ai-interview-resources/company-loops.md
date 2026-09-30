# Agent D notes — 5 家 AI 公司面試 loop 交叉比對（研究日 2026-09-30）

讀取等級：✅ 全文讀（Groundlane web_fetch，部分頁面 output 截斷但相關段落已讀）｜🟡 僅搜尋摘要
來源類型：[官方] [媒體轉述官方/內部文件] [候選人原始] [備考站] [GitHub]
判定：✅ 共識（≥2 獨立來源，含官方者尤佳）｜⚠️ 單一來源｜❌ 衝突

## toolDegradation
- Reddit 討論串：Groundlane web_fetch 403/JS challenge → firecrawl_scrape「不支援此網站」→ jina read_url 401。所有 Reddit 內容只有 🟡 搜尋摘要。
- anthropic.com/careers：jina 401，改用 Groundlane format=text 成功。
- openai.com/interview-guide：Groundlane markdown 模式只抓到前三段；改 format=html + selector=main 取得全文（✅）。沙箱 curl 被 egress proxy 擋。
- Glassdoor / Blind：未讀（沒有嘗試全文；Blind 只有 om repo 引用連結）。
- Groundlane search：tavily/exa 回報 unavailable，實際由 brave+you 供應。

## GitHub repo 盤點
- om = ombharatiya/AI-Engineer-Interview-Questions `14-company-interview-questions/{anthropic,openai,cursor-anysphere,meta-ai,google-deepmind}.md`：每家有 loop 表＋Sources（多為 interviewing.io / Exponent / IGotAnOffer / 官方頁；標註 "(reported, varies)"）。本筆記的 claims 多數就是從此出發再回查原始頁。
- pallavi-shekhar README（無來源）：loop 描述與 om 幾乎逐字相同（Anthropic「~4 progressive levels」「AI-collaboration round where Claude is provided」；Cursor「two-day in-person project onsite (or an ~8-hour remote version)」；Meta「AI-assisted coding round in three stages」）。[推論] 兩 repo 彼此抄或同源，不能算兩個獨立來源。
- alexeygrigorev/ai-engineering-field-guide（clone @ ed59031, 2026-09-23）：**沒有**按公司整理的 loop 資料。相關內容只有：
  - `interview/05-trends.md`：OpenAI「AI tools allowed during coding rounds」（引 Exponent Medium 2026-02）；Anthropic candidate-ai-guidance 列為「公開 AI 指引」；in-person 面試比例 24%(2022)→38%(2025)（引 interviewquery）；Microsoft Round1 AI-assisted / Round2 禁 AI（Reddit）。
  - `interview/data/research-exports/interview-experiences.md`（Grok 研究匯出，2026-02）：Meta SWE-ML E4 onsite 含「AI-assisted coding (finish tasks in unfamiliar codebase)」，來源標 "Reddit, late 2025"（無 URL）。
  - `interview/data/research-exports/home-assignments.md`：Anthropic perf take-home「原 4 小時、Claude 超越人類後加難、已開源」。
  - `interview/questions/06-home-assignments.md` Sources 有 goncharov-anthropic / linkjob-anthropic / linkjob-openai 腳註，但正文沒有引用它們（孤兒腳註）。
  - Cursor / DeepMind 在該 repo 無 loop 資料。

---
## 1. Anthropic

| Claim | 支持來源 | 判定 |
|---|---|---|
| 官方 AI 政策：申請可用 Claude 潤稿（先自己寫初稿）；take-home 與 live interview **預設禁 AI，除非明說** | [官方] anthropic.com/candidate-ai-guidance（Last updated 2025-07-10）✅；[備考站] interviewing.io（2026-04-07）✅；om ✅ | ✅ |
| 所有面試走 Google Meet；技術職用 Colab 與 CodeSignal；「可以查資料」 | [官方] anthropic.com/careers ✅（無日期，2026-09-30 讀） | ⚠️ 官方單一，但權威 |
| 流程：recruiter 30min → coding challenge → onsite 4–5h（HM、coding、system design、第二場 coding、values），總計 3–4 週 | [備考站] interviewing.io ✅；om/pallavi（引用 interviewing.io）| ⚠️（實質上單源；om 說 3 週～2 個月）|
| CodeSignal OA：一題、spec 分 **4 levels**、黑盒測試、要全過才能進下一級 | interviewing.io 候選人引述 ✅；[候選人] Reddit r/leetcode「55 min CodeSignal」2026-02-05 🟡（"pass all test cases in each level before progressing"）；[候選人] Reddit「580/600」~2026-09 🟡（90 分鐘）；[備考站] interviewfox 2026-08 🟡（4 levels, ~90 min）；linkjob 2026-04 🟡；aonecode 🟡（4×250=1000 分）| ✅ 4 levels 本身 |
| OA 時長 | 90 min（interviewing.io 多數人、Reddit 580/600、interviewfox）vs **「All in two hours」**（interviewing.io 內引的單一候選人）vs **55 min**（Reddit 標題）vs 60 min live（interviewing.io 稱官網提到）| ❌ 衝突（可能因角色/年份不同，[推論]）|
| 分數制：580/600（Reddit）vs 1000 分制（aonecode）| 🟡 皆摘要 | ❌ 衝突（小細節）|
| 題型：銀行交易系統、in-memory DB（SET/GET→scan→TTL→compaction）| interviewing.io ✅；linkjob 🟡；pallavi | ✅ |
| **AI-collaboration round**（給你 Claude、評你怎麼用）| [備考站] Exponent MLE guide（2026-01-09）✅：技術 phone screen「with access to the company's AI tools as a collaborator」；Exponent FDE guide（2026-06-11）✅：technical use-case screen「may be given access to Claude」；techinterview.org 2026-05 ✅「Anthropic explicitly grades AI-collaboration」；om 標 "(reported, varies by role)" | ⚠️→部分共識：只在 MLE / FDE 報告出現，**官方無任何文字**；且與下列衝突 |
| 「AI use in Anthropic interviews is strictly prohibited」 | interviewing.io ✅（SWE 視角）| ❌ 與上列 AI-collaboration 報告衝突（官方政策「除非明說」可容納兩者，[推論]）|
| Performance-eng take-home **明確允許 AI**；原 4h→後改 2h；Claude Opus 4 打敗多數人、Opus 4.5 追平頂尖者，已改版三次並開源原題 | [官方] Anthropic Engineering blog「Designing AI-resistant technical evaluations」Tristan Hume 2026-01-21 ✅；[媒體] TechCrunch 2026-01-22 ✅（含更正：AI 明確允許）；field-guide home-assignments | ✅ |
| Values/culture round 是最多人掛的關卡 | interviewing.io（引 recruiter）✅；Exponent MLE ✅（"one of the harder"）；om | ✅（皆備考站）|
| 系統設計貼近 LLM serving/batching/GPU | interviewing.io ✅；om | ⚠️ |
| FDE：MCP scenario、客戶 solution design、references 可能早要 | Exponent FDE ✅ | ⚠️ |
| MLE final 可能是 ML design（當企業客戶顧問）+ behavioral + culture；或 panel | Exponent MLE ✅ | ⚠️ |

## 2. OpenAI

| Claim | 來源 | 判定 |
|---|---|---|
| 官方流程：履歷審 ~1 週 → intro call（HM 或 recruiter）→ skills-based assessment（pair coding / take-home / technical test，可能多於一個）→ final 4–6h、4–6 人、1–2 天、預設 virtual（可選 SF onsite）→ 1 週內決定、可能要 references | [官方] openai.com/interview-guide ✅（2026-09-30 讀）| ✅（官方）|
| 官方評分：well-designed solution、high-quality code、optimal performance、good test coverage；溝通協作 | 官方 ✅ | ✅ |
| **官方 AI 政策**：「Expectations for AI and other tools vary by interview: some formats intentionally allow them, while others are designed to assess your independent problem-solving without AI tools… ask your recruiter」 | 官方 ✅ | ✅（官方）|
| Agentic coding round（beta）：既有 codebase、題目大到手寫不完、要驅動 AI agent | interviewing.io ✅；om ✅ | ⚠️（單一備考站，om 引用它）|
| AI 在其他 round | interviewing.io：「strictly prohibited, except in the beta agentic coding」✅ vs Exponent Medium 2026-02-23：「AI tools are allowed during the coding round… share screen and narrate; don't dump the whole problem」✅（field-guide 05-trends 引用此）| ❌ 衝突（官方說依 round 而異，兩者可能各看到不同 round，[推論]）|
| Coding：多段 / 4 gates，過 2 gates 就算過（Exponent）；「around four parts」（interviewing.io）| 兩站 ✅ | ✅ 多段題型；「過 2 gate」⚠️ |
| 有 refactoring round（100–120 行難看的程式碼）| Exponent Medium ✅ | ⚠️ |
| Presentation round（45 min，準備投影片談過往專案）| interviewing.io ✅；Exponent Medium ✅ | ✅ |
| System design 在 Excalidraw；可能兩次（onsite 前後）| interviewing.io ✅ | ⚠️ |
| 時程 6–8 週（interviewing.io）vs 3–8 週（om）| | ❌ 小衝突 |
| 工具：非同步 HackerRank、live CoderPad | interviewing.io ✅ | ⚠️ |
| ~48h work trial / take-home | om 引 IGotAnOffer（未讀）| ⚠️ 未驗 |
| FDE：~1 週 take-home（可跑的 app + 錄影 walkthrough + live deep-dive）、AI-enabled coding、LLM-deployment 系統設計、project deep dive | Exponent FDE 2026-06-11 ✅ | ⚠️ |

## 3. Cursor (Anysphere)

| Claim | 來源 | 判定 |
|---|---|---|
| 每位工程/設計候選人都有 **2 天 onsite work trial**，用凍結的 codebase snapshot | [創辦人] Michael Truell on a16z podcast（經 a16z X 貼文 🟡、Business Insider 2025-11-11 🟡 摘要）；[媒體] BI 2026-08-11 ✅（"two-day on-site work trial… frozen version of its codebase"）；Truell on YC podcast 2025-06（BI 轉述 🟡）| ✅ |
| Head of Talent Adam Ward（Lenny's Podcast, 2026-08）：堅持 onsite、雖貴且對候選人要求高；要「two-way」、精挑候選人互動對象（含午餐同桌）| BI 2026-08-11 ✅ | ⚠️（單一媒體轉述官方人員）|
| **~8 小時 remote 版**（部分候選人、含 new grad）| [候選人] Exponent experience（New Grad, 2026）✅「8 to 9 hour remote onsite… part of the codebase, a Slack channel… build a feature autonomously, and present it」；Exponent guide ✅「two-day in-person for most; some incl. new grads report ~8h remote」；jobsbyculture 🟡；techinterview.org 🟡（senior take-home 4–8h）| ✅（存在 8h 版）|
| 「8-hour **paid** onsite, done remotely, you pick the window」是**標準**決勝關 | Interview Coder 2026-05-30 ✅（注意：該站販售面試 AI 輔助工具，可信度低）| ❌ 與官方「2 天 on-site」衝突 |
| 付費與否 | Interview Coder 說 paid vs Reddit r/startups 2025-10-01 候選人 🟡「2-day **unpaid** work trial」（om 另引 Blind 同類貼文）| ❌ 衝突（不選邊）|
| 前段：recruiter/HM 45 min（Exponent）vs 30 min（Interview Coder）；1–3 場 60 min 技術 screen | Exponent ✅；Interview Coder ✅；new grad 經驗 ✅（1 場）| ✅ 形狀；時長 ❌ 小衝突 |
| 技術 screen 在真實 Cursor repo 實作 hash tree / 找重複檔 | Exponent guide ✅；候選人經驗 ✅ | ✅ |
| Screen 的 AI 政策：「最早一場可能只准 autocomplete；repo 類 screen 可用 Cursor/ChatGPT/Google 做 targeted syntax help」| Exponent ✅；候選人 ✅（Google/GPT/Cursor for targeted syntax help）| ✅ |
| Screen 的 AI 政策：「Cursor allowed, expected even」| Interview Coder ✅ | ❌ 與「僅限 syntax help / 最早一場不行」有張力 |
| Onsite AI 全開，最後向小 panel demo | Exponent ✅；候選人（present）✅ | ✅ |
| 官方 careers 頁只有文化宣言（"obsess over talent… self-motivated ICs"），沒寫流程 | cursor.com/careers ✅ | — |

**2 天 vs 8 小時的結論（不選邊）**：官方/創辦人層級說法一律是「2 天 on-site」；8 小時 remote 版有一位具體 new-grad 候選人一手描述＋Exponent 採納，屬「變體」而非取代。「8 小時 paid 為標準」只見於 Interview Coder。

## 4. Meta

| Claim | 來源 | 判定 |
|---|---|---|
| 2025-07 內部貼文招募 mock candidates：「new type of coding interview in which candidates have access to an AI assistant… more representative… makes LLM-based cheating less effective」；發言人證實在測試 | [媒體] Wired/404 Media 2025-07-29 ✅；BI 2025-07-29 🟡 | ✅ |
| 2025-10 開始上線 AI-enabled coding，取代 onsite 兩場 coding 之一；仍保留一場傳統無 AI | Hello Interview 2026-08-05 ✅；interviewing.io blog 2026-01-21 ✅；Exponent/UMiami 2026-05 ✅ | ✅ |
| **官方**：「many of Meta's interviews now include an AI assistant… Candidates are expected to use this AI assistant」；可選 Claude/ChatGPT/Gemini/Meta models；**design interviews 也在 CoderPad + Mermaid、同一個 AI 助手**；禁止外部 AI；支援 Python/Java/TS/C++/C#/Kotlin/Swift/Rust/Go | [官方] metacareers.com/hiring-process FAQ ✅（2026-09-30 讀）| ✅ 官方 |
| 「AI 使用是 optional、不影響結果」 | interviewing.io 2026-01 ✅ 稱「official prep materials」這麼說 | ❌ 與目前官方 FAQ「expected to use」衝突（可能是時間差，[推論]）|
| 60 min，多檔 CoderPad，AI 只能在聊天欄回答、不能改檔 | Hello Interview ✅；interviewing.io ✅；Exponent ✅ | ✅ |
| 三階段：bug fix → core implementation（~120+ 行）→ optimization；做不完也可能拿 offer | Hello Interview ✅；Exponent ✅；pallavi（explore&fix / implement / extend）；field-guide（Reddit, E4 SWE-ML）| ✅ |
| 評分四項：problem solving、code quality、verification、communication | Hello Interview ✅；Exponent ✅ | ✅ |
| 面試中的 AI 被「削弱」（system prompt 限制不直接指 bug）| Hello Interview ✅（多名候選人，理論未證實）；om | ⚠️（傳聞）|
| 題庫約 9 題 | Hello Interview ✅（「internal source」）| ⚠️ |
| 適用範圍：E4/E5 SWE（lockedinai 🟡）vs SWE+EM 到 E7/M2（Hello Interview ✅）vs 「select roles」（官方）| | ❌ 範圍描述不一 |
| ML full loop：最多 6 場 45 分鐘 | [官方] metacareers.com/ML-prep-onsite ✅ | ✅ 官方 |
| 流程通常 2–3 個月 | 官方 FAQ ✅ | ✅ 官方 |
| ML system design、behavioral 五軸 | om（引官方 PDF，未讀 PDF）| ⚠️ |

## 5. Google DeepMind（及 Google）

| Claim | 來源 | 判定 |
|---|---|---|
| 官方四階段：Initial（30 min recruiter，可能加 HM）→ Skills interviews（2–3 場）→ Final（Team Leads & leadership，含未來主管；文化/使命/價值）→ Decision | [官方] deepmind.google/careers ✅ | ✅ 官方 |
| 5–7 場 loop、hiring committee、6–10 週 | techinterview.org 2026-05-04 ✅；om | ⚠️（備考站；官方說 2–3 場 skills + final）|
| RE/RS：ML breadth「quiz」、ML coding 從零實作（loss/attention/sampler）、paper discussion、math | techinterview.org ✅；om（引 Gordić 2021、Omar Reid 等舊文）| ⚠️（quiz 描述年代較舊）|
| AI 工具：技術 round 大致禁止或嚴格限制；少數 applied 職位個別允許 | techinterview.org ✅；om（"candidate reports describe strict no-AI"）| ⚠️（無官方文字）|
| Google 2025 恢復至少一場 in-person 面試（Pichai on Lex Fridman 2025-06；確認 ~2025-08）| [媒體] India Today 2025-08-26 🟡、Economic Times 2025-08-18 🟡、TOI 🟡（皆引 Pichai 原話 "at least one round of in-person interviews… make sure the fundamentals are there"）| ✅（多媒體；DeepMind 是否一體適用 [推論] 未證）|
| **Google 2026 pilot：code comprehension round 可用核准 AI（Gemini）**，評「AI fluency, prompt engineering, output validation, debugging」；G&L round 加入過往專案的技術設計討論；junior 以 open-ended 題取代一場技術面；junior–mid、美國特定團隊（Cloud、Platforms & Devices），2026 下半年起 | [媒體] BI 2026-05-07 ✅（內部文件＋發言人與 VP recruiting Brian Ong 證實）；Exponent/UMiami 2026-05-14 ✅ | ✅（但屬 Google SWE，**非 DeepMind**）|
| DeepMind 對 AI 保守 vs Google SWE pilot 開放 AI | techinterview vs BI | ❌ 張力（不同組織，[推論]不一定矛盾）|

---
## 跨公司趨勢（2026）

1. **AI-allowed / AI-native coding round 從實驗變常態**：Meta 官方 FAQ 已寫「expected to use」（✅官方）；Google 2026 pilot（✅BI 證實）；OpenAI 官方「some formats intentionally allow them」＋ agentic beta（官方＋interviewing.io）；Anthropic 部分 MLE/FDE 回報給 Claude（備考站）；Cursor onsite AI 全開。Canva 2025-06 官方部落格（canva.dev「Yes, you can use AI in our interviews」🟡，經 Exponent 轉述）；Cognition 人資主管（BI 2026-05 ✅）。
2. **同一 loop 內「有 AI」與「無 AI」並存**：Meta 保留一場傳統題；OpenAI 官方明說依 round 而異；Anthropic 預設禁、特定題允許；Microsoft R1 AI / R2 禁（field-guide 引 Reddit 🟡）。
3. **評分重點轉向 verification / 讀懂既有 codebase**：Meta（bug fix→implement→optimize）、Google code comprehension、OpenAI refactoring round、Cursor frozen codebase、Anthropic MLE「analyze internal tool code」。
4. **Work trial / 長時程 take-home**：Cursor 2 天（官方創辦人）；Anthropic perf take-home 2–4h 允許 AI（官方）；OpenAI FDE ~1 週 take-home（Exponent）。
5. **FDE / 客戶情境 round**：OpenAI FDE、Anthropic FDE（MCP scenario、solution design）皆 Exponent 2026-06 ✅。
6. **Project deep-dive / presentation**：OpenAI presentation（2 站）、Anthropic HM project walk（interviewing.io）、Google G&L 加入過往專案技術討論（BI）。
7. **對抗 AI 作弊**：Google 恢復 in-person（Pichai）；Meta 內部貼文明說 AI round「makes LLM-based cheating less effective」；Anthropic 反覆重設計 take-home（官方 blog）；in-person 比例 24%→38%（field-guide 引 interviewquery）。
8. **Values/mission round 是真關卡**：Anthropic（interviewing.io, Exponent）、OpenAI 「Why OpenAI」（Exponent Medium, 官方 guide 強調 mission）。

## URL 清單（讀取等級）
- ✅ https://www.anthropic.com/candidate-ai-guidance (2025-07-10)
- ✅ https://www.anthropic.com/careers (undated)
- ✅ https://www.anthropic.com/engineering/AI-resistant-technical-evaluations (2026-01-21)
- ✅ https://techcrunch.com/2026/01/22/anthropic-has-to-keep-revising-its-technical-interview-test-so-you-cant-cheat-on-it-with-claude/
- ✅ https://interviewing.io/anthropic-interview-questions (2026-04-07)
- ✅ https://www.tryexponent.com/guides/anthropic-machine-learning-engineer-interview (2026-01-09)
- ✅ https://www.tryexponent.com/guides/anthropic-forward-deployed-engineer-interview (2026-06-11，截斷)
- 🟡 https://www.reddit.com/r/leetcode/comments/1qx0hyj/ (2026-02-05)
- 🟡 https://www.reddit.com/r/leetcode/comments/1wn5hpu/ (~2026-09)
- 🟡 https://interviewfox.ai/interview-questions/anthropic-codesignal-oa-tips/ (2026-08-08)
- 🟡 https://www.linkjob.ai/interview-questions/codesignal-anthropic-practice/ (2026-04-01)
- 🟡 https://aonecode.com/iq/docs/antropic/online-assessment/how-it-works
- ✅ https://openai.com/interview-guide/
- ✅ https://interviewing.io/openai-interview-questions (undated)
- ✅ https://medium.com/exponent/what-its-actually-like-to-interview-at-openai-in-2026-03a646c9436c (2026-02-23)
- ✅ https://www.tryexponent.com/guides/openai-forward-deployed-engineer-interview (2026-06-11，截斷)
- ✅ https://www.businessinsider.com/cursor-work-trials-tips-candidate-hiring-head-talent-2026-8 (2026-08-11)
- 🟡 https://www.businessinsider.com/cursor-hiring-recruitment-strategy-engineers-michael-truell-anysphere-ai-vibecoding-2025-11 (2025-11-11)
- 🟡 https://x.com/a16z/status/1987963295446475108
- ✅ https://www.tryexponent.com/guides/cursor-software-engineer-interview (2025-12-09 / 更新 2026-07)
- ✅ https://www.tryexponent.com/experiences/cursor-software-engineer-interview-a9c32f (2026)
- ✅ https://www.interviewcoder.co/blog/cursor-software-engineer-interview (2026-05-30；賣面試 AI 工具，低可信)
- 🟡 https://www.reddit.com/r/startups/comments/1nuu67a/ (2025-10-01)
- 🟡 https://www.techinterview.org/companies/cursor/ (2026-07-15)
- ✅ https://cursor.com/careers
- ✅ https://www.wired.com/story/meta-ai-job-interview-coding/ (2025-07-29)
- 🟡 https://www.businessinsider.com/meta-job-candidates-use-ai-coding-interviews-2025-7
- ✅ https://www.metacareers.com/hiring-process/
- ✅ https://www.metacareers.com/ML-prep-onsite/
- ✅ https://www.hellointerview.com/blog/meta-ai-enabled-coding (2026-08-05，截斷)
- ✅ https://interviewing.io/blog/how-to-use-ai-in-meta-s-ai-assisted-coding-interview-with-real-prompts-and-examples (2026-01-21，截斷)
- 🟡 https://www.lockedinai.com/blog/companies-allowing-ai-in-interviews (2026-04-16)
- ✅ https://deepmind.google/careers/
- ✅ https://www.techinterview.org/post/3233474918/deepmind-interview-process-2026/ (2026-05-04)
- ✅ https://www.businessinsider.com/google-job-interview-software-engineers-ai-assistant-coding-2026-5 (2026-05-07)
- ✅ https://customcareer.miami.edu/blog/2026/05/14/googles-ai-assisted-coding-interview-2026-guide/ (Exponent 轉載 2026-05-14)
- 🟡 https://www.indiatoday.in/technology/news/story/google-brings-back-in-person-job-interviews-as-ceo-sundar-pichai-cracks-down-on-ai-cheating-2776843-2025-08-26
- 🟡 https://economictimes.indiatimes.com/tech/artificial-intelligence/google-brings-back-in-person-interviews-to-skirt-ai-cheating/articleshow/123356265.cms
