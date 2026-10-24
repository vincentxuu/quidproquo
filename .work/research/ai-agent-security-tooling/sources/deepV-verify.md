# 母群盤點「可疑項目」與「未驗證宣稱」核對（deepV-verify）

核對日：2026-10-22。對象：population-scan.md D 節。
標記說明：【一手】= 官方 repo／官方公告／論文本身；【二手】= 媒體、部落格、聚合站、搜尋摘要；【推論】= 我由證據推出，不是來源原文。
結論只分三種：已證實／已推翻／無法判定。

## 0. 工具與限制（先講清楚）

- 主要工具：Groundlane web_fetch（讀 api.github.com、raw.githubusercontent.com、官方公告正文、HN Algolia API、arXiv）與 Groundlane web_search。後備鏈（cloudflare／linkup／jina／Exa／WebFetch）沒有進入，因為 Groundlane 對本次需要的頁面都成功。
- 讀不到或讀不全的項目：
  | 項目 | 試過的工具＋網址 | 失敗原因 |
  |---|---|---|
  | stargazer 時間戳（cloudflare 星數成長曲線） | `gh api -H "Accept: application/vnd.github.star+json" repos/cloudflare/security-audit-skill/stargazers`（Bash） | 403，session 未啟用該 repo 的 GitHub 存取（add_repo 流程）；我沒有為了這件事去 add_repo |
  | 同上 | curl 同網址 | 同一個 403 訊息 |
  | 同上 | Groundlane web_fetch `api.github.com/repos/cloudflare/security-audit-skill/stargazers?per_page=100&page=200` | HTTP 401 Requires authentication（未登入 API 不給 stargazers 列表） |
  | star-history.com 圖表頁 | Groundlane web_fetch `https://www.star-history.com/cloudflare/security-audit-skill/` | 只回得到 meta（35.2k stars、4 contributors、this week +5.4k），圖表資料是 JS 繪製，擷取不到時間序列 |
  | tutorsbot 文章正文 | Groundlane web_fetch `tutorsbot.com/blog/pyrit-microsoft-open-source-ai-red-teaming-2026` | 內容擷取只剩導覽列；它的說法是從 meta description 與搜尋摘要讀到的 |
  | Cisco 新聞稿後半 | Groundlane web_fetch newsroom.cisco.com（輸出上限 9,000 字元） | 我只讀到 DefenseClaw 段落的前半，Splunk 等後段沒讀 |
  | GitHub MCP get_file_contents | 未嘗試 | 任務指示已限制 |
- GitHub 未登入 API 速率限制 60 次／小時，本次共用約 20 次，未觸頂。

---

## 1. 星數合理性

### 1.1 cloudflare/security-audit-skill

| 項目 | 證據 | 來源 |
|---|---|---|
| 星數與建立日屬實 | 37,333★、2,335 forks、79 open issues、139 subscribers；created 2026-06-18；pushed_at 2026-09-14；org 為 cloudflare（Organization）；MIT；default branch main | 【一手】api.github.com/repos/cloudflare/security-audit-skill |
| 最近一筆提交 | 2026-09-14「Clarify guidance and full audit modes」by Dan Jones | 【一手】commits API |
| 官方導流事件 | Cloudflare 官方部落格〈Build your own vulnerability harness〉2026-07-15，文中說起點是約 450 行的 security-audit skill；repo README 開頭說「This is the skill that seeded Cloudflare's vulnerability discovery harness」並連到該文 | 【一手】blog.cloudflare.com（搜尋摘要）＋ repo README（全文已讀） |
| HN | 2026-09-17 04:36 UTC 發文，213 分、38 則留言（story_id 49736466） | 【一手】hn.algolia.com API |
| 外媒 | Korben 2026-09-17 報導；explainx 稱 25.6k★ 並提 HN 213 分 | 【二手】搜尋摘要 |
| 中文社群 | Trendshift 頁面摘錄一則中文貼文「Cloudflare 把内部安全审计的方法做成了一个开源 Skill…已经 1.1 万+ Stars」 | 【二手】搜尋摘要，貼文原文與日期未讀 |
| 星數時間點（交叉） | 9/17：6,504★（本站日報，當日 +1,249）→ 9/30：23.2k★（本站日報）→ GitHub 頁面快照 25k／fork 1.5k（日期不明）→ star-history 35.2k（本週 +5.4k）→ 10/22：37,333★（API） | 本站日報【一手，但是本站自己的紀錄】＋ star-history meta【二手】＋ API【一手】 |
| fork 比 | cloudflare 6.25%；對照 trailofbits/skills 8.66%（667/7,704）、NVIDIA/SkillSpector 8.77%、daytonaio/daytona 7.9%、ifixai 5.04% | 【一手】各 repo API，比值是我算的 |

觀察到的訊號：
- 「無異常」方向：(a) 有可對上的公開導流（官方部落格 7/15、HN 9/17、外媒與中文轉貼）；(b) 9/17 之前走勢平緩（建立 6/18 至 9/17 約 87 天累積約 5.3k，折合約 60★/天），9/17 起暴增，時間點與 HN 上榜吻合；(c) fork 比 6.25% 落在對照 repo（5.0%–8.8%）的範圍內，forks 比 stars 更難灌；(d) 官方 org 帳號。
- 「需留意」方向：(a) 9/14 後沒有新提交，但 9/17 起仍每週加數千星，星數成長與專案本身活動脫鉤（這在「被大量轉貼」的專案很常見，不是疑點的證據，只是說明星數反映的是曝光不是使用）；(b) 週增 5.4k 的速度我只有 star-history 的 meta，沒有逐日資料。
- 做不到的檢查：stargazer 時間戳抽樣與帳號年齡／活躍度抽樣（見第 0 節，401／403）。所以「每一顆星是不是真人」我沒有證據可判。
- 「main 只有 14 筆 commit」：我只取了最新 1 筆提交，沒有數總數，這個數字我未驗證。star-history meta 寫 4 contributors。

結論：**無法判定**。僅就可取得的證據：未見明確異常訊號（有官方導流、時間對得上、fork 比在常態範圍）；但最關鍵的證據（stargazer 時間戳與帳號品質）取不到，不能說已排除。星數屬實（37,333），但它是「曝光量」指標，不是採用量。

### 1.2 ifixai-ai/iFixAi

| 項目 | 證據 | 來源 |
|---|---|---|
| 基本數字 | 32,102★、1,618 forks、420 subscribers、9 open issues；created 2026-04-27；pushed_at 2026-10-22；Apache-2.0；Python | 【一手】API |
| 組織 | `ifixai-ai` org 建立於 2026-04-24（repo 前 3 天），名稱 ifixai.ai、地點 United Kingdom、public repos 3、followers 272、is_verified false | 【一手】api.github.com/orgs/ifixai-ai |
| 貢獻者 | 最高貢獻者 rudycelekli 197 次；第 2、3 名帳號 id 為 26xxxxxxx（GitHub 新近帳號區段，我只讀到前三位，未逐一查帳號建立日） | 【一手】contributors API（輸出被截斷） |
| HN | 三則提交（2026-05-04、08-09、08-12）全部 ≤4 分、0–1 則留言，作者為 dimneo／dimneo24 同一人或同組 | 【一手】hn.algolia.com |
| 星數時間點 | 10/2：18,280★（本站日報）；Reddit r/BestGitHubRepos 10/2 貼文稱 17,900；Trendshift 摘錄中文貼文稱「單日新增 2143 颗星」「2.7 万 star」；10/22：32,102★ | 本站日報【一手】；Reddit、Trendshift【二手】；API【一手】 |
| 商業背景 | ifixai.ai 官網賣 Pro／Growth 等付費審計方案與「Audited by iFixAi」徽章；README 聯絡信箱 info@ime.life | 【二手】搜尋摘要（官網未全文讀） |
| 官方公告／大廠導流 | 未找到 | — |

觀察：
- 10/2 至 10/22 的 20 天約增 13.8k 星（平均約 690★/天），且有中文社群貼文單日 +2,143 的紀錄。
- 官方層級的導流證據弱：HN 三則皆低分、沒有大廠或主流媒體報導；導流主要線索是中文社群貼文（原文未讀）。
- open issues 只有 9（對照 SkillSpector 169、trailofbits 131、cloudflare 79）。這可能代表專案維護得乾淨，也可能代表使用者互動少，單看這個數字不能下結論。
- fork 比 5.04% 在對照範圍內，subscribers 420 是這批裡最高的（對照 cloudflare 139、SkillSpector 81）。

結論：**無法判定**。「異常訊號」：有（弱到中等）——星數成長快、官方可見導流少、組織新設且帶商業產品；「無異常訊號」：fork 比正常、有持續提交（pushed_at 當日）、有中文社群導流可對應。沒有證據支持「刷星」，也不足以排除。建議不要把它的星數當作「被廣泛採用」的證據；若要列入樣本，需用其他指標（實際採用案例、第三方評測）補強。

### 1.3 NVIDIA/SkillSpector

| 項目 | 證據 | 來源 |
|---|---|---|
| 基本數字 | 20,855★、1,829 forks、169 open issues、81 subscribers；created 2026-03-21；pushed 2026-10-21；Apache-2.0；org NVIDIA；custom properties 有 `approval-to-make-public` 與 `nspect-id`（NVIDIA 內部公開審核流程標記） | 【一手】API |
| 公開時間點 | HN 2026-06-12 21:49 UTC 49 分、4 則留言；aiinsiders 2026-06-13 報導；X 貼文 2026-06-21；Help Net Security 2026-08-03；NetGuide 2026-08-27；Towards Data Science 稱 NVIDIA-Verified Agent Skills 計畫於 5/19 宣布 | HN【一手】；其餘【二手】 |
| 星數時間點 | 9/6：16,316★（本站日報）→ 10/22：20,855★，約 99★/天 | 本站日報＋API |
| fork 比 | 8.77% | 【一手】算出 |

觀察：repo 的 created_at（3/21）早於最早的公開討論（6/12–6/13），加上 `approval-to-make-public` 標記，合理的解讀是 repo 先建立、後來才公開（【推論】，沒有看 repo 公開日的直接證據）。若以 6/12 起算約 132 天，平均約 158★/天，與 NVIDIA 官方計畫（Verified Skills）與多家媒體報導相符。

結論：**未見異常訊號**（有大廠官方帳號、有多點獨立報導、fork 比與 open issues 正常、成長曲線平穩）。屬「已證實：星數屬實且有可對應的導流來源」，但「每顆星是否真人」同樣沒有逐顆檢查。

---

## 2. daytonaio/daytona（archived=true 卻當日有更新）

結論：**已證實 archived；盤點的「矛盾」已推翻——不矛盾。**

| 證據 | 來源 |
|---|---|
| API：`archived: true`、`pushed_at` 2026-07-24、`updated_at` 2026-10-22T05:46Z、71,509★、5,639 forks、457 open issues、`license: null`、default branch main | 【一手】api.github.com/repos/daytonaio/daytona |
| README 首段 IMPORTANT：「This repository is no longer maintained. As of June 2026, Daytona's core development has moved to a private codebase. This repository will receive no further updates, fixes, or releases. It remains public and free to use, fork, and build on under the LICENSE (v0.190.0)… Daytona resources are available at github.com/daytona.」 | 【一手】raw.githubusercontent.com/daytonaio/daytona/main/README.md |
| 最新一筆 commit 是 2026-06-25「Fix license link in README」，把授權連結固定到 v0.190.0 | 【一手】commits API |
| bex.co 兩篇（2026-09-09、09-12）：「Daytona 在 2026 年 6 月把核心移到私有 codebase，公開 repo 凍結在 v0.190.0（AGPL-3.0）；仍販售託管雲；社群 fork 名為 Nightona」 | 【二手】搜尋摘要；bex.co 是競品（自稱 Render 替代品），立場不中立；AGPL-3.0 與 fork 名稱我沒有一手確認 |
| 公司仍在營運：本站日報 2026-10-21 記 Series B $60M（FirstMark 領投、估值 $1B） | 本站紀錄【一手於本站、二手於外部】，外部原文未讀 |

說明：`updated_at` 會被 star／issue 活動刷新，所以 archived 後仍會顯示當日更新；pushed_at（7/24）與最後 commit（6/25）之間有 1 個月落差，我沒有查出 7/24 是什麼推送（可能是 tag 或 branch，未驗證）。
改搬或改名：沒有改名。「搬」的是開發：核心進私有 codebase；README 指向 github.com/daytona 作為資源入口（該 org 我沒有讀）。

對母群的影響：71.5k★ 是凍結專案的星數，不應與活躍維護的專案並列計算活躍度；若列入，需標「開源版已凍結，商用託管服務持續營運」。

站上既有文章：`src/content/posts/ai/2026-08-22-daytona-agent-sandbox.md:97` 已正確寫出「自 2026 年 6 月起停止維護，核心開發移到私有 codebase」，無需更正。

---

## 3. aliasrobotics/cai

結論：**已證實：archived，且已不維護；「中文文章稱活躍」已推翻（過時）。**

| 證據 | 來源 |
|---|---|
| API：`archived: true`、default branch `archive`（受保護）、另有 gh-pages；9,843★、1,519 forks；pushed_at 2026-08-22；license NOASSERTION | 【一手】api.github.com/repos/aliasrobotics/cai ＋ branches API |
| `archive` 分支 README：「This repository is archived. CAI is no longer under active development. This branch holds the complete final source tree, read-only, as a research artifact… consolidated into a single archival commit… No further releases, bug fixes, security patches or support will be provided.」 | 【一手】raw…/cai/archive/README.md（讀前 6,000 字元） |
| README 表格：最後開源版 0.5.10（PyPI cai-framework，2025-12）；最後專業版 v1.1.5（僅付費客戶、私有套件庫）；開發期間 2025-03 至 2026-08，1,078 commits／103 authors 合併成一筆；社群約 9.8k stars；授權標示「MIT + Proprietary」 | 【一手】同上 |
| 後繼產品：Cybersecurity Superintelligence（CSI），為 Alias Robotics 商業產品，付費客戶建議遷移 | 【一手】同上 |

說明：default branch 叫 `archive` 是刻意的——主線被改寫成單一封存 commit（原話 "Browsable commit-by-commit history" 列在「不再提供」欄）。中文文章稱「活躍 9.4k 星」：星數接近，但「活躍」不成立（我未讀那篇中文文章原文，只知盤點記錄的轉述）。
站上文章：搜尋 `aliasrobotics`、`Cybersecurity AI` 在 src/content/posts 無命中。

---

## 4. PyRIT

### 4.1 Azure/PyRIT 與 microsoft/PyRIT 的關係

結論：**已證實：官方搬遷，Azure 版是指向新家的空殼；微軟版才是主 repo。**

| 項目 | Azure/PyRIT | microsoft/PyRIT |
|---|---|---|
| repo id | 1191146757 | 730753909 |
| created_at | 2026-03-25 | 2023-12-12 |
| pushed_at | 2026-03-25（建立後 28 分鐘） | 2026-10-22 |
| 星／fork | 121／35 | 4,668／973 |
| archived／issues | archived；has_issues false；open issues 0 | 未封存；161 open issues |
| README | 僅一句：「PyRIT has moved! Please see https://github.com/microsoft/PyRIT」 | 完整專案 |
| custom properties | activeRepoStatus=false | activeRepoStatus=false（另有 global-rulesets-opt-out） |

來源：【一手】api.github.com 兩個 repo ＋ Azure/PyRIT/main/README.md 全文（442 bytes）。
補充【推論】：Azure/PyRIT 的 repo id 比 microsoft/PyRIT 大很多，且只有 1 次推送，說明它是新建的轉址空殼，不是原 repo 被封存；原本的 Azure/PyRIT（含歷史星數）大概已轉移到 microsoft 組織。這是從 id 與日期推出的，我沒有看到轉移的官方說明。Mend 文章說 "archived and moved" 與此吻合（二手，原文未讀）。
母群處理：應只算 microsoft/PyRIT 一筆，Azure/PyRIT 剔除。

### 4.2 tutorsbot「PyRIT 2026-09-10 才首次開源」

結論：**已推翻（錯誤）。**

| 證據 | 來源 |
|---|---|
| Microsoft Security Blog 2024-02-22〈Announcing Microsoft's open automation framework to red team generative AI systems〉：「Today we are releasing an open automation framework, PyRIT…」，作者 Ram Shankar Siva Kumar；並說它由 2022 年起的一次性腳本演變而來 | 【一手】microsoft.com/security/blog（正文前段已讀） |
| The Hacker News 2024-02-23、kurtsh.com 2024-02-23 轉載同一發布 | 【二手】搜尋摘要 |
| microsoft/PyRIT created_at 2023-12-12；ToxSec（2026-07）稱 2026-04 時 3.6k★、年初 3.4k★ | 【一手】API；【二手】ToxSec |
| tutorsbot 文章（發布 2026-09-12，作者 Fazlur Rahman）宣稱「Microsoft released PyRIT as open-source on September 10, 2026 (Microsoft Security Blog)」；頁面是印度金奈的培訓課程網站；我搜尋沒有找到 2026-09-10 的微軟部落格文章 | 【二手】meta description 與搜尋摘要（正文擷取失敗） |

tutorsbot 這類文章日期與引用來源對不上，不能當時間證據。

---

## 5. 被收購／併入傳聞

### 5.1 promptfoo 被 OpenAI 收購

結論：**已證實，但官方措辭是「同意收購、交易完成待成交條件」，且我沒有找到「交易已完成」的獨立公告。**

| 證據 | 來源 |
|---|---|
| OpenAI 官方〈OpenAI to acquire Promptfoo〉（正文已讀）：「We're acquiring Promptfoo… Once the acquisition is finalized we will integrate Promptfoo's technology directly into OpenAI Frontier… The closing of the acquisition is subject to customary closing conditions.」兩位創辦人 Ian Webster、Michael D'Angelo；「trusted by over 25 percent of Fortune 500 companies」 | 【一手】openai.com/index/openai-to-acquire-promptfoo/ |
| Promptfoo 官方〈Promptfoo is joining OpenAI〉2026-03-09：「Promptfoo has agreed to be acquired by OpenAI. The open-source project will continue…」 | 【一手】promptfoo.dev/blog（搜尋摘要；正文未另讀） |
| TechCrunch 2026-03-09、SecurityWeek 2026-03-11：交易金額未揭露；Promptfoo 累計融資約 $23M、2025-07 估值 $86M（PitchBook） | 【二手】搜尋摘要 |
| promptfoo/promptfoo README 現況原文：「Promptfoo is now part of OpenAI. Promptfoo remains open source and MIT licensed.」 | 【一手】raw…/promptfoo/main/README.md |
| 盤點提到 README 有 "Used by OpenAI and Anthropic"：我讀到的 README 前 4,000 字元沒有這句，改為「Battle-tested: Powers LLM apps serving 10M+ users in production」 | 【一手】同上；可能已改版，未驗證 |

要點：盤點寫「2026-03 被收購」日期正確（2026-03-09）。「已被收購」比官方公告更肯定；README 現在用完成式 "is now part of OpenAI"，成交日我沒找到公告。
站上文章：`src/content/posts/ai/2026-08-22-promptfoo-llm-evaluation.md:17` 寫「同意收購…交易完成仍待一般成交條件」，與官方措辭一致，沒有問題；但那是 8/22 的狀態，現在 README 已寫 "now part of OpenAI"，可考慮更新。`tech/2026-08-21-ai-era-tech-choices-guide.md:132,166` 與 `tech/2026-08-31-omp-vs-looplane.md:80,82` 把 promptfoo 當獨立工具推薦，沒有提到歸屬 OpenAI。

### 5.2 Invariant Labs 被 Snyk 收購、mcp-scan 改名 snyk/agent-scan

結論：**已證實。**

| 證據 | 來源 |
|---|---|
| Snyk 官方新聞稿 2025-06-24（正文已讀）：「Snyk… today announced the acquisition of Invariant Labs」；提到 Invariant 的 Guardrails、「scan MCP servers for vulnerabilities」、tool poisoning、MCP rug pulls；Invariant 為 ETH Zurich 衍生公司，CEO Marc Fischer | 【一手】snyk.io/news/…invariant-labs… |
| 同日 Snyk Labs 部落格 labs.snyk.io 也宣布 | 【一手】搜尋摘要 |
| API：請求 `api.github.com/repos/invariantlabs-ai/mcp-scan` 被導向 `/repositories/962024783`，即 `snyk/agent-scan`（id 962024783，created 2025-04-07，3,161★、293 forks、Apache-2.0、pushed 2026-10-21） | 【一手】api.github.com 轉址 |
| snyk/agent-scan README：「Snyk Agent Scan… scan agent components… (agents, MCP servers, skills)」，並說明 v0.4 起加入 skills 掃描 | 【一手】raw…/snyk/agent-scan/main/README.md |
| 本站 arXiv digest（2026-09-28）把 Luca Beurer-Kellner（Invariant Labs 共同創辦人，見 Snyk 新聞稿）列為 Snyk 所屬作者 | 本站紀錄，輔助證據 |

說明：盤點裡 "created_at 2025-04-07 早於收購日" 的疑慮已解開——repo 是同一個（id 不變），是被轉移並改名，所以建立日保留。改名發生的確切日期我沒有查（收購新聞稿本身沒提改名）。
站上文章：約 40 篇資安日報在「watchlist B7」裡把 Invariant Labs 當獨立廠商推薦（例：`daily/2026-09-29-security-mcp-oauth-account-takeover.md:49`、`daily/2026-10-07-security-mcp-protocol-pivoting-ssrf.md:49`、`daily/2026-08-18-security-flowise-custom-mcp-command-injection.md:52` 稱「Invariant Labs 的 MCP 掃描與可視性工具」）。這些不算事實錯誤，但已過時：該公司自 2025-06 起屬 Snyk，掃描器現名 Snyk Agent Scan。

### 5.3 「Cisco 在 RSA 2026 公布 MCP 安全工具」與「DefenseClaw 是 Cisco 的開源掃描框架」

結論：**前者已證實（但籠統）；後者「Cisco 的」已證實，「掃描框架」說法不精確。**

| 證據 | 來源 |
|---|---|
| Cisco 官方新聞稿 2026-03-23（正文前段已讀）：「At RSA Conference 2026, Cisco is introducing…」；News Summary 列出：(1) Zero Trust Access 延伸到 agent，含 Secure Access SSE 的「model context protocol (MCP) policy enforcement and adaptive risk protection」，工具流量走 MCP gateway；(2) AI Defense: Explorer Edition；(3)「Cisco introduces DefenseClaw, an open source secure agent framework that automates security and inventory, with plans to integrate with NVIDIA OpenShell」 | 【一手】newsroom.cisco.com/…/cisco-reimagines-security-for-the-agentic-workforce.html |
| 同稿：DefenseClaw「By integrating a suite of essential open source tools — including Skills Scanner, MCP Scanner, AI BoM, and CodeGuard」 | 【一手】同上 |
| repo：`cisco-ai-defense/defenseclaw`，org 為 Cisco AI Defense，Apache-2.0，created 2026-03-23，888★、161 forks、149 open issues，Go；description "Security Governance for Agentic AI" | 【一手】API |
| README：「Security governance for AI coding agents and agentic runtimes. Scan capabilities before use, inspect runtime traffic, and export durable audit evidence.」由 Python CLI、Go gateway、connector hooks、policy、scanners、observability exporters 組成，自述是「enforcement and evidence layer; it does not prove that an agent… is risk-free」 | 【一手】raw…/defenseclaw/main/README.md |
| cisco-ai-defense/mcp-scanner created 2025-09-24（盤點資料） | 【一手】盤點引用的 API 數字，本次未重查 |

要點：
- 「RSA 2026 公布 MCP 安全工具」屬實，但 MCP Scanner 這個工具本身 2025-09 就已存在，RSA 2026 新增的是 MCP policy enforcement（Secure Access）與把 MCP Scanner 納入 DefenseClaw。
- DefenseClaw 歸 Cisco（cisco-ai-defense 組織），日期對得上（repo 建立日＝發布日）。把它叫「開源掃描框架」只對了一半：官方稱 "secure agent framework"，README 稱 "security governance… enforcement and evidence layer"，掃描只是其中一部分。
- 站上文章：src/content/posts 對 `DefenseClaw`、`RSA 2026`、`RSAC` 無命中。

---

## 6. 站上既有文章引用清單

### 6.1 「SkillSpector 71 種規則，26.1% skill 有漏洞、5.2% 疑似惡意」——一手出處與數字意義

**一手出處：不是 NVIDIA 官方部落格，也不是 SkillSpector 的掃描結果，而是一篇獨立論文。**
- 論文：Yi Liu 等，〈Agent Skills in the Wild: An Empirical Study of Security Vulnerabilities at Scale〉，arXiv:2601.10338，2026-01-15 提交。【一手】arxiv.org/abs/2601.10338（摘要已讀；方法細節來自 arxiv HTML 版搜尋摘要與 themoonlight 評述，【二手】）
- SkillSpector README 引用方式（已讀全文開頭）：「In the 31,132-skill analyzed subset of the research dataset, 26.1% of skills contain vulnerabilities and 5.2% show likely malicious intent.」——README 沒有在該句附連結，我是用 31,132 這個數字反查到論文；README 與論文的關聯是【推論】（數字完全吻合，但 README 沒寫論文名）。

數字意義與樣本（論文摘要【一手】；括號內為細節【二手】）：
| 數字 | 意義 |
|---|---|
| 42,447 → 31,132 | 從兩個 skill 市集收集 42,447 個 skill，過濾後分析 31,132 個（去重、<10 行的佔位內容、非英文、已刪除 repo）（細節出自評述：市集為 skills.rest 與 skillsmp.com，2025 年 12 月的快照，作者自承有存活者偏誤） |
| 26.1%（8,126 個） | 「contain at least one vulnerability」＝至少命中 14 種模式之一；論文把「漏洞」定義得很寬，含故意惡意、疏忽不安全與危險模式（評述）；經抽樣校正估計 26.5%（95% CI 23–30%）（評述） |
| 5.2% | 「exhibit high-severity patterns strongly suggesting malicious intent」＝高嚴重度、強烈暗示惡意意圖的模式（例：混淆程式碼、憑證收集）；另有中嚴重度 8.1%、低嚴重度 12.8%（評述）。論文自己的措辭是「strongly suggesting」，不是已確認惡意 |
| 偵測品質 | 論文自報 precision 86.7%、recall 82.5%（摘要）；偵測器是論文自己的 SkillScan，不是 SkillSpector |
| 分類別 | 論文提醒 Security／Red-team 類別的高比例應讀成「需人工複核」，不是「確認惡意」（評述） |
| 71 種 | SkillSpector README：「71 vulnerability patterns across 17 categories」【一手】；Help Net Security 2026-08-03 寫 64 patterns【二手】，說明規則數隨版本增加 |

**站上相關句子（均為唯讀搜尋結果）：**

| 檔案：行 | 句子（摘錄） | 核對 |
|---|---|---|
| `daily/2026-09-06-ai-agent-github-digest.md:25`（en 同行） | 「研究指出 26.1% 的 skill 有漏洞、5.2% 有惡意意圖。SkillSpector 涵蓋 71 種漏洞模式、17 個類別」 | 「研究指出」歸因正確。但「5.2% 有惡意意圖」比論文的「strongly suggesting malicious intent」說得更肯定；71 種、17 類與 README 相符 |
| `daily/2026-09-06-ai-agent-github-digest.md:8`（tldr）、`:74`（en :74） | 「SkillSpector 掃描 agent skill 的 71 種漏洞模式」 | 與 README 相符 |
| `daily/2026-09-06-ai-agent-daily.md:81` | 「涵蓋 71 種漏洞模式，是 NVIDIA Verified Skills pipeline 的核心」 | 與 README 相符 |
| `daily/2026-08-23-ai-agent-daily.md:9`（tldr）、`:28`、`:30`、`:111`、`:128`（en 版同） | 「NVIDIA 開源 SkillSpector 掃描發現公開 skill 中 26.1% 含漏洞、5.2% 疑似惡意」；`:28`「NVIDIA 這時候開源 SkillSpector 掃描 Claude Code、Codex、Gemini CLI 的公開 skill，結果是 26.1%…」；`:111` 表格「SkillSpector 掃描結果｜26.1% 含漏洞、5.2% 疑似惡意」；`:128`「把『26.1% 含漏洞』這個數字擴大驗證到更大樣本」 | **歸因錯誤**：這組數字來自 2026-01 的獨立論文（SkillScan 工具、兩個第三方市集），不是 NVIDIA 用 SkillSpector 掃描的結果；SkillSpector 的 repo 要到約 6 月才公開討論。「5.2% 疑似惡意」措辭與論文接近，但前面的歸因動詞（NVIDIA 掃描發現）不成立 |

### 6.2 其他說法在站上的出現

| 說法 | 站上情況 |
|---|---|
| cloudflare/security-audit-skill 星數 | `daily/2026-09-17-ai-agent-daily.md:67,148`（單日 +1,249）、`daily/2026-09-17-ai-agent-github-digest-en.md:20`（6,504★）、`daily/2026-09-30-ai-agent-daily.md:27,57`（23.2k★）。與第 1.1 節時間線一致，沒有衝突 |
| iFixAi 星數 | `daily/2026-10-02-ai-agent-github-digest-en.md:33`（18,280，+340）、`daily/2026-10-02-ai-agent-daily.md:59`（18.3k★）。10/2 當時的數字與 Reddit 17.9k 相符 |
| Daytona 停止維護 | 已正確（見第 2 節）；`tech/2026-08-30-execution-environment-sandbox-comparison.md:142` 與 `tech/2026-08-21-ai-era-tech-choices-guide.md:129` 把 Daytona 列為雲端沙箱選項，沒有提開源版凍結，但那兩處談的是託管服務，不算錯 |
| PyRIT、aliasrobotics/cai、DefenseClaw、RSA 2026、mcp-scan／agent-scan | 無命中 |
| Snyk 收購 Invariant | 無任何文章提到；約 40 篇仍把 Invariant Labs 當獨立廠商（見 5.2） |
| Promptfoo 被 OpenAI 收購 | `ai/2026-08-22-promptfoo-llm-evaluation.md:17` 已寫且措辭正確；其他兩篇推薦文未提 |

---

## 7. 總表

| # | 項目 | 結論 | 最關鍵的證據 | 主要未決 |
|---|---|---|---|---|
| 1a | cloudflare 37k★ | 無法判定（未見明確異常訊號） | HN 9/17 213 分＋官方部落格 7/15；星數 9/17 6.5k→10/22 37.3k；fork 比 6.25% 在常態內 | stargazer 時間戳／帳號品質取不到（401／403）；14 commits 未驗證 |
| 1b | iFixAi 32k★ | 無法判定（有弱到中等異常訊號） | HN 三則 ≤4 分；org 建立於 repo 前 3 天；10/2 18.3k→10/22 32.1k；中文社群單日 +2,143 | 中文貼文原文未讀；stargazer 抽樣做不到 |
| 1c | SkillSpector 20.8k★ | 未見異常訊號 | NVIDIA 官方 org；HN 6/12、多家媒體；約 99–158★/天 | 無 |
| 2 | Daytona | 已證實 archived；「矛盾」已推翻 | README 橫幅：2026-06 起核心轉私有；updated_at 被星／issue 刷新 | 7/24 推送內容、github.com/daytona 未讀 |
| 3 | aliasrobotics/cai | 已證實 archived；「仍活躍」已推翻 | archive 分支 README：不再維護，後繼為商業的 CSI | 中文文章原文未讀 |
| 4a | Azure/PyRIT | 已證實：官方搬遷的空殼 | README 只剩「PyRIT has moved」；created 2026-03-25 | 轉移機制為推論 |
| 4b | tutorsbot「2026-09 首次開源」 | 已推翻 | 微軟部落格 2024-02-22；repo created 2023-12-12 | tutorsbot 正文未取得 |
| 5a | promptfoo 被 OpenAI 收購 | 已證實（官方措辭為「同意收購」） | OpenAI 公告全文；promptfoo README「now part of OpenAI」 | 成交完成公告未找到 |
| 5b | Invariant→Snyk、mcp-scan→agent-scan | 已證實 | Snyk 新聞稿 2025-06-24；API 轉址至 snyk/agent-scan（同 repo id） | 改名確切日期 |
| 5c | Cisco RSA 2026／DefenseClaw | 已證實（「掃描框架」不精確） | Cisco 新聞稿 2026-03-23；repo 屬 cisco-ai-defense | 新聞稿後半未讀 |
| 6 | 26.1%／5.2%／71 | 數字有一手出處；站上 8/23 日報歸因錯誤 | arXiv:2601.10338（SkillScan，31,132 個，2025-12 快照）；SkillSpector README 引用 | README 與論文關聯為推論（數字吻合，README 沒附連結） |

## 8. 給後續工作的建議（不採取行動，僅列出）

1. 母群處理：Azure/PyRIT 剔除；daytonaio/daytona 與 aliasrobotics/cai 標註「開源版已封存／凍結」，不計入「活躍維護」；snyk/agent-scan 的「前身 mcp-scan」併為同一筆。
2. 樣本代表性：cloudflare 與 iFixAi 的星數反映曝光，建議不要以星數作為入選或排序依據。
3. 站上待更正（需使用者決定，涉及已發佈文章，屬 Tier 2 範圍外的內容修正應走 post-update skill）：`daily/2026-08-23-ai-agent-daily.md`（含 en）的 SkillSpector 歸因；「Invariant Labs」相關日報可補「已屬 Snyk」；`daily/2026-09-06-ai-agent-github-digest.md:25` 的「5.2% 有惡意意圖」可改為「5.2% 呈現強烈暗示惡意意圖的高嚴重度模式」。
