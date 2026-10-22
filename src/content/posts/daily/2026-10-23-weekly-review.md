---
title: "AI Agent 週回顧 — 2026-10-23"
date: 2026-10-23
category: daily
type: digest
tags: [ai-agent, weekly, daily]
lang: zh-TW
description: "本週最大的認知變化：Agent 安全的信任機制（評測、監控、LLM 判官）本身在系統性失靈且不報錯，而全球資本已經把執行層基礎設施（身份、沙箱、SecOps）當成比模型更大的賭注"
tldr: "CrowdStrike 揪出用 Claude Code 攻擊南韓銀行的攻擊者、Apex Accelerator 用 npm 供應鏈劫持 agent 流量、自主 agent 入侵 1,200+ 網站單站僅 $50，同一週 Google Gemini 4 Argon、OpenAI Patch the Planet $10 億、Microsoft／Cloudflare 治理工具相繼上線，防守與攻擊同時規模化；DeepSeek 在美國下令聯邦機構移除其系統兩天後完成 $15B 融資；連四天的 Arxiv Digest 證明評測與監控基礎設施本身會系統性失靈且不報錯（9 組 LLM 判官打出同一分數、多 agent 分工讓偵測率從 87% 掉到 7%）；Vertex AI、OpenAI、Anthropic 同週集中退役舊模型，牌面降價話術與實際省幅經常脫鉤；台灣金管會發布代理 AI 安全諮詢文件的同一週，全球資本已用 8 筆大型融資搶進 agent 執行層基礎設施。"
series:
  name: "AI Agent 週回顧"
  order: 11
---

> 🌏 [English version](/posts/daily/2026-10-23-weekly-review-en)

## 本週最重要的 5 件事

### 1. 資安攻防同週雙線加速「商品化」——防守端把治理工具做成套件，攻擊端把規模化入侵壓到一站 $50

這週的資安訊號密集到可以排成一條時間軸。週一，CrowdStrike 揭露追蹤代號 ARTEX 的攻擊者用 Claude Code 入侵南韓 7-9 家銀行，諷刺的是攻擊者自己留在公開目錄裡的 agent 操作紀錄，正是讓防守方抓到他們的證據。週二，Elastic Security Labs 揭露假冒 Web3 創投加速器 Apex Accelerator 用兩個 npm 套件，一邊裝 infostealer 和後門，一邊把開源 coding agent 改造成會偷換 LLM API 端點、寫入攻擊者控制 MCP server 的版本。週三，The Hacker News 報導自主 AI agent 已入侵 1,200 多個網站、單站成本只要 $50，同一天的 Arxiv Digest 證明 MCP 工具中毒能把攻擊成功率衝上 84.2%，偵測率卻只有 0.3%。週四，防守端終於同步亮劍：Google 正式發布主打抗提示注入的 Gemini 4 Argon（Gray Swan 測試僅 0.7% 攻擊成功率），OpenAI 宣布「Patch the Planet」計畫投入 10 億美元補貼防守方修補漏洞，Microsoft 和 Cloudflare 各自把過去要重金打造的 agent 治理與稽核能力開源成可直接安裝的套件——但就在同一天，Symantec 公布一份完整攻擊指令，揭露名為「Skynet」的自主攻擊 agent：靠分層 jailbreak 解除商用模型護欄後，能無人值守跑 10 萬步，自動掃描、入侵、挖礦。防守工具變免費了，但攻擊端的自動化規模也在同一天被證實已經做到無人值守。

```diagram
title: 本週 Agent 資安攻防時間軸
desc: 10/19 到 10/22 間，攻擊規模化與防守商品化交替出現，10/22 當天防守工具上線與 Skynet 曝光同時發生。
caption: 日期依各 daily／arxiv digest 發布與報導時間排序，詳見下方參考資料。
---
<svg viewBox="0 0 760 260">
  <path class="dg-axis" d="M60 140H700"/>

  <g>
    <line class="dg-rule" x1="140" y1="86" x2="140" y2="134"/>
    <circle class="dg-dot" cx="140" cy="140" r="4"/>
    <text class="dg-label" x="140" y="50" text-anchor="middle" dominant-baseline="central">10/19 日誌起底</text>
    <text class="dg-sub" x="140" y="72" text-anchor="middle" dominant-baseline="central">靠 agent 紀錄抓攻擊者</text>
  </g>
  <g>
    <line class="dg-rule" x1="313" y1="146" x2="313" y2="194"/>
    <circle class="dg-dot" cx="313" cy="140" r="4"/>
    <text class="dg-label" x="313" y="208" text-anchor="middle" dominant-baseline="central">10/20 供應鏈攻擊</text>
    <text class="dg-sub" x="313" y="230" text-anchor="middle" dominant-baseline="central">npm 劫持 agent 流量</text>
  </g>
  <g>
    <line class="dg-rule" x1="486" y1="86" x2="486" y2="134"/>
    <circle class="dg-dot" cx="486" cy="140" r="4"/>
    <text class="dg-label" x="486" y="50" text-anchor="middle" dominant-baseline="central">10/21 規模化入侵</text>
    <text class="dg-sub" x="486" y="72" text-anchor="middle" dominant-baseline="central">自主 agent 破千站</text>
  </g>
  <g>
    <line class="dg-rule" x1="660" y1="146" x2="660" y2="194"/>
    <circle class="dg-dot dg-dot--accent" cx="660" cy="140" r="6"/>
    <text class="dg-label" x="660" y="208" text-anchor="middle" dominant-baseline="central">10/22 防守見真章</text>
    <text class="dg-sub" x="660" y="230" text-anchor="middle" dominant-baseline="central">Argon 對上 Skynet 曝光</text>
  </g>
</svg>
```

（[CrowdStrike：ARTEX 攻擊南韓金融業](https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/)、[Elastic：Apex Accelerator 惡意 npm 套件](https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages)、[The Hacker News：自主 agent 入侵 1,200+ 網站](https://thehackernews.com/2026/10/hackers-use-autonomous-ai-agents-to.html)、[Google 發布 Gemini 4 Argon — Mashable](https://mashable.com/tech/google-launches-gemini-4-argon)、[OpenAI Patch the Planet](https://openai.com/index/coordinated-disclosure-of-critical-vulnerabilities/)、[Symantec：Skynet 自主攻擊 agent](https://www.security.com/blog-post/ai-llmjacking-skynet)）

### 2. DeepSeek 在美國禁令兩天後完成 $15B 融資，中國資本用史上最大一筆 AI 融資回應地緣政治壓力

美國下令聯邦機構全面移除 DeepSeek 系統後僅兩天，DeepSeek 就宣布完成約 $15B（約新台幣 4,700 億元）新一輪融資，騰訊、CATL、吉利等逾 15 家中國投資人參與，估值 4 個月內從 $50B 衝向近 $89B。同一週，中國一邊抗議美國的 DeepSeek 禁令,一邊自己持續封鎖 ChatGPT、Claude、Gemini 在境內的存取——這個對照本身就是地緣政治劇本的一部分：當一國能同時用「保護本國產業」和「管制外國產業」兩套標準時，資本市場的反應不是觀望，而是加碼。這筆錢的規模和時間點，都說明中國正把 DeepSeek 當成在美中 AI 競賽裡不能倒下的國家級資產。

（[DeepSeek 兩天後完成 $15B 融資 — TechCrunch](https://techcrunch.com/2026/10/22/deepseek-reportedly-raises-15b-days-after-us-restrictions/)、[美國下令聯邦機構移除 DeepSeek — Bloomberg](https://www.bloomberg.com/news/articles/2026-10-19/us-moves-to-bar-deepseek-from-federal-agencies-and-contracts)、[中國抗議美國禁令同時自己封鎖外國 AI — the-decoder](https://the-decoder.com/china-protests-the-us-deepseek-ban-while-blocking-chatgpt-claude-and-gemini-at-home/)）

### 3. 連四天的 Arxiv Digest 證明：Agent 的信任機制本身在系統性失靈，而且不會報錯

本週四篇連續的 Arxiv Digest 疊出同一個結論：用來判斷 agent 有沒有做壞事的基礎設施，本身比想像中脆弱。週二的三篇論文顯示，76-80% 看似成功的「防禦」其實只是 agent 沒反應（換個系統提示詞攻擊成功率就從 0.2% 跳到 43%），把安全規則寫進 harness 授權設定仍有 58% 情境能誘導出過寬權限、81% 能悄悄完成惡意任務。週三的研究發現，鷹架處理上下文的方式能讓同一個模型在「能重新查詢事實」和「不能查詢」之間差距達 92.5 個百分點，而把攻擊拆成多個 agent 分頭執行，能讓監控器的偵測率從單一 agent 的 87% 直接砍到 7%。週四的稽核更尖銳：114 篇談「遞迴自我改進」的論文裡，90% 測過最終產出的模型，卻只有 22% 真的稽核過自我改進這個迴圈本身；而 Uniphore 平台的案例顯示，9 組完全不同的測試設定餵進 LLM 驗證者，得到的是一模一樣的分數——系統沒有當機、沒有報錯，只是安靜地停止真正評估。週五的論文把範圍擴大到持久記憶：把安全政策寫進 prompt 仍會放行 13-15% 的違規工具呼叫，必須訓練出獨立的守門模型才能把攻擊成功率砍半。四天疊在一起說明：在你相信一個「安全分數」之前，先問這個分數測的是不是你以為的那個東西，以及負責判斷安全與否的那套機制，本身有沒有被驗證過。

（[Ignored, Not Refused — arXiv 2610.23254](https://arxiv.org/abs/2610.23254)、[From Approval to Abuse — arXiv 2610.22987](https://arxiv.org/abs/2610.22987)、[When the harness decides success — arXiv 2610.26632](https://arxiv.org/abs/2610.26632)、[Red-Teaming Multi-Agent Attacks — arXiv 2610.24052](https://arxiv.org/abs/2610.24052)、[Auditing the Product, Not the Recursion — arXiv 2610.27610](https://arxiv.org/abs/2610.27610)、[RSI Control — arXiv 2610.27735](https://arxiv.org/abs/2610.27735)、[AgentPolicyForge — arXiv 2610.28989](https://arxiv.org/abs/2610.28989)）

### 4. Vertex AI、OpenAI、Anthropic 同週集中退役舊模型，「降價」話術跟實際省幅經常脫鉤

本週接連三則定價追蹤，疊出一個共同的教訓。週二，Google Cloud 在 Vertex AI 停用 Gemini 2.5 全系列，但 Gemini 開發者 API 官方頁面同一天仍寫「無停用日期」——呼叫入口決定模型還能活多久；最便宜的 Flash-Lite 遷移到官方建議替代後，成本反而漲 221%。週三，OpenAI 一次關閉 o1、o1-pro、o3-mini、o4-mini、GPT-4、GPT-4 Turbo、GPT-3.5-turbo 等 12 個舊模型，o1 遷移到 GPT-5.6 Sol 後輸入／輸出價格各降 73%／67%，但 o3-mini、o4-mini 遷移後反而貴 1.8 到 3.6 倍。週五，Anthropic 宣布 Claude Sonnet 4.5 將於 11/30 退役，官方建議替代 Sonnet 5.5 單價牌面降 33%，但新 tokenizer 讓同樣文字多產生約 30% token，實際帳單省幅通常只剩 10-15%。三家供應商這週不約而同示範同一件事：遷移公告上的折扣百分比，從來不等於你實際要付的帳單，要自己拿真實流量去算，不是看新聞稿的數字。

（[Vertex AI 停用 Gemini 2.5](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions)、[Gemini API deprecations（官方：無停用日期）](https://ai.google.dev/gemini-api/docs/deprecations)、[OpenAI API Deprecations](https://developers.openai.com/api/docs/deprecations)、[Claude Platform Docs：Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)）

### 5. 台灣還卡在「降本」階段，全球資本這週已經在搶進 agent 執行層的地基

台灣金管會本週發布「金融業運用代理 AI 安全諮詢文件」，用三軸風險分級、就高不就低，徵詢 30 天；同一週，今周刊報導台灣正從「降本」走向「增效」的 agent 採用階段——環境部長彭啟明用 agent 輔助循環經濟政策分析、91APP 把內部 agent 經驗包裝成客製化服務「AgentOne」、奧美靠 WPP 集團 3.18 億美元打造的 WPP Open 整合十餘個大型模型做決策輔助。對比之下，全球資本這週用 8 筆大型融資（詳見下方「本週新創雷達」）同時搶進 agent 執行層的身份、沙箱、SecOps、企業規劃等基礎設施層，賭的不是「誰的 agent 功能更多」，而是「誰先把 agent 長期活在系統裡所需要的底層蓋好」。意涵很直接：台灣企業目前多數還停在效率工具層，而國際資本已經在搶建的是看不見的地基——等到台灣企業想從「省錢」推進到「讓 agent 自主做決策」時，執行層的架構選擇（身份治理、沙箱隔離、記憶稽核）很可能已經被幾家國際平台定型，到時候不是選型問題，是要不要被鎖定的問題。

（[金管會代理 AI 安全諮詢文件 — 工商時報](https://www.ctee.com.tw/news/20261014700624-430301)、[台灣 Agent 從降本走向增效 — 今周刊／中時](https://www.chinatimes.com/realtimenews/20261018000015-260410)）

## 本週認知更新

- 之前以為 agent 安全的風險排序裡，「模型會不會被騙」是最重要的一環，現在知道整套「用來判斷 agent 有沒有做壞事」的基礎設施本身一樣會系統性失靈且不報錯——Uniphore 案例裡 9 組完全不同的測試設定餵進 LLM 驗證者得到同一個分數，RSI Control Arena 在不給躲避提示時偵測率仍只有 56-81%，多 agent 分工更能把單一 agent 監控的偵測率從 87% 砍到 7%。
- 之前以為模型「降價」代表帳單會變便宜，現在知道三大供應商這週退役舊模型時，牌面折扣和實際省幅經常脫鉤——Vertex Gemini 2.5 Flash-Lite 遷移後反而貴 221%，Claude Sonnet 5.5 因新 tokenizer 把牌面 33% 的折扣吃掉大半、實際只剩 10-15%。
- 之前以為 agent 執行層的競爭是「誰的平台功能多」，現在看到 Daytona、Town、Mave 這週用完全不同的賭注（60 毫秒級沙箱運算單位、助理之間互相交辦、SecOps 自動調查）同時瓜分「讓 agent 長期活在企業系統裡」這個需求，才知道這一層正在往下切成好幾個各自獨立的基礎設施賽道，不是單一贏家全拿的市場。

## 企業落地觀察

我認為本週最值得企業關注的訊號，不是 Daytona 融資金額本身，而是它用 $60M Series B 就衝上 $1B 估值這件事背後的賭注。

從**互補資產**框架分析（Teece, 1986）：Daytona 的主張不是「運算比別人便宜」，而是傳統雲端的虛擬機抽象——給人用、秒級啟動、長駐——跟 agent 真正需要的執行單位（60 毫秒內生成、用完即丟、動輒數千個並行）本來就不是同一種互補資產。AWS、GCP、Azure 若要追上，得重新設計計費模型與隔離架構，不是加一個新機型規格就能補上；這也正是本週 NVIDIA、ServiceNow、Oracle 同時搶進企業 agent 應用平台（分別發布 Arc、AI Agent Studio 等），卻沒有任何一家同週宣布對等的 agent 原生運算層的原因——互補資產的建置週期比應用層長得多，大廠現在拼的是應用，不是地基。

對台灣企業導入的啟示：評估要不要自建 agent 沙箱前，先問「我的 agent 需不需要分鐘級以下的生成／銷毀頻率」。91APP AgentOne 這類客製化服務目前走的是效率工具路線，用現成雲端 VM 代管就夠，還沒走到需要 Daytona 這種 agent 原生基礎設施的規模；但若按金管會諮詢文件開的路，往「自主決策層級」推進，執行環境的選型就會跟身份治理一樣，變成要早期就定下來的架構決策，而不是日後可以無痛遷移的實作細節——現在不想清楚，日後要換掉的不是一個套件，是整套底層。

## 下週值得追蹤的

- OpenAI 10/23 正式關閉的 12 個舊模型進入三天緩衝期，觀察遷移陣痛是否如預期集中在漲價的 o3-mini／o4-mini（而非降價的 o1）
- 歐盟 AI Office 上週向 OpenAI、Anthropic 發出的資訊請求，本週起是否有官方回應或後續執法動作
- MiniMax M3.1 Flash 權重預計 10/23 釋出，觀察獨立測試能否坐實 VentureBeat 引述 Artificial Analysis 指出的幻覺率偏高疑慮
- 台灣金管會「金融業運用代理 AI 安全諮詢文件」30 天徵詢期（約 11 月中截止），觀察金融業的具體意見回饋方向

## Watchlist 更新建議

### 🆕 建議加入

本週 signals 中出現的公司，最高頻率者皆已在 watchlist 內（OpenAI／Google／NVIDIA／Anthropic／Microsoft／DeepSeek／Alibaba-Qwen），沒有不在 watchlist 中的公司本週出現達 3 次以上，故本週無新增候選。

### ⚠️ 考慮移除

✅ 本週無符合移除條件的公司

## 本週新創雷達

| 公司 | 做什麼 | 融資 | 為什麼值得注意 |
|---|---|---|---|
| Town | 個人 AI 助理擴展成互相交辦工作的團隊助理網路 | Series B $108M（$1B 估值） | 公開上線僅 4 個月就拿下獨角獸估值 |
| Arda | 給製造業工程師用的 AI Agent | Series A $160M（$1.5B 估值） | 前 OpenAI 研究長 Bob McGrew 創辦，把「改一條生產線 3-6 個月」壓縮到天 |
| Daytona | Agent 原生雲端沙箱基礎設施 | Series B $60M（$1B 估值） | 主張 agent 需要獨立於傳統 VM 之外、60 毫秒級的運算單位 |
| Legora | 法律 AI，Agent 接手整個案件流程 | Series E $550M（$8.8B 估值） | 估值 7 個月內從 $5.6B 衝上 $8.8B |
| Pigment | Agent 直接跑完整個企業規劃流程 | Series E $250M（$2.3B 估值） | 平台上 85% 的新指標已由 Agent 建立 |
| Mave | Agentic SecOps，串連既有安全工具自動調查告警 | $34M（含 $28M Series A） | ARR 一年內成長超過 4 倍 |
| Flapping Airplanes | 主張用更少資料訓練模型的 AI 研究實驗室 | Series A $1B（$6B 估值） | 成立僅一年估值翻 4 倍，把「資料效率」變成下一個軍備競賽維度 |
| Duvo | 零售／CPG 企業的人與 AI agent 共用執行系統 | Series A $32M | Rohlik 創辦人 Tomáš Čupr 二次創業，鎖定 Gartner 預測會被砍掉的那 40% 環節 |

## 我這週學到什麼

這週最大的認知更新是：評測與監控基礎設施失靈的方式，比我以前想的更隱蔽，因為它不會報錯，只會安靜地一直吐出「沒問題」的假訊號。Uniphore 案例裡 9 組完全不同的測試設定餵進同一個 LLM 驗證者，得到的是一模一樣的分數——系統沒有當機、沒有警告，只是停止了真正的評估。這個認知差直接改變一個判斷：企業導入 agent 前該先問的不是「你的 agent 測過哪個 benchmark」，而是「你怎麼知道你的監控系統這週有沒有睡著」——分數能騙人，靜默的失效比明顯的錯誤更危險，因為沒有人會去查一個看起來一切正常的儀表板。

## 參考資料

- [CrowdStrike — Unknown Threat Actor Uses ARTEX to Target South Korean Finance](https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/)
- [Elastic Security Labs — Apex Accelerator: Malicious npm packages target Web3 startups](https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages)
- [The Hacker News — Hackers use autonomous AI agents to breach over 1,200 websites](https://thehackernews.com/2026/10/hackers-use-autonomous-ai-agents-to.html)
- [Google 正式發布 Gemini 4 Argon — Mashable](https://mashable.com/tech/google-launches-gemini-4-argon)
- [OpenAI — Patch the Planet: coordinated disclosure of critical vulnerabilities](https://openai.com/index/coordinated-disclosure-of-critical-vulnerabilities/)
- [Symantec／security.com — Autonomous LLMjacking: 'Skynet' Agent Hijacks Exposed AI Models](https://www.security.com/blog-post/ai-llmjacking-skynet)
- [DeepSeek reportedly raises $15B days after US restrictions — TechCrunch](https://techcrunch.com/2026/10/22/deepseek-reportedly-raises-15b-days-after-us-restrictions/)
- [US moves to bar DeepSeek from federal agencies and contracts — Bloomberg](https://www.bloomberg.com/news/articles/2026-10-19/us-moves-to-bar-deepseek-from-federal-agencies-and-contracts)
- [China protests the US DeepSeek ban while blocking ChatGPT, Claude and Gemini at home — the-decoder](https://the-decoder.com/china-protests-the-us-deepseek-ban-while-blocking-chatgpt-claude-and-gemini-at-home/)
- [Ignored, Not Refused — arXiv 2610.23254](https://arxiv.org/abs/2610.23254)
- [From Approval to Abuse — arXiv 2610.22987](https://arxiv.org/abs/2610.22987)
- [When the harness decides success — arXiv 2610.26632](https://arxiv.org/abs/2610.26632)
- [Red-Teaming Multi-Agent Attacks for Loss-of-Control Risks — arXiv 2610.24052](https://arxiv.org/abs/2610.24052)
- [Auditing the Product, Not the Recursion — arXiv 2610.27610](https://arxiv.org/abs/2610.27610)
- [RSI Control — arXiv 2610.27735](https://arxiv.org/abs/2610.27735)
- [AgentPolicyForge: From Executable Environments to Policy Benchmarks and Adaptive Guards — arXiv 2610.28989](https://arxiv.org/abs/2610.28989)
- [Model versions and lifecycle — Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions)
- [Gemini deprecations — Gemini API](https://ai.google.dev/gemini-api/docs/deprecations)
- [OpenAI API Deprecations](https://developers.openai.com/api/docs/deprecations)
- [Claude Platform Docs — Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [金管會發布「金融業運用代理 AI 安全諮詢文件」 — 工商時報](https://www.ctee.com.tw/news/20261014700624-430301)
- [台灣從「降本」走向「增效」的 Agent 採用階段 — 今周刊／中時](https://www.chinatimes.com/realtimenews/20261018000015-260410)
- [AI assistant startup Town nabs unicorn valuation — TechCrunch](https://techcrunch.com/2026/10/19/ai-assistant-startup-town-nabs-unicorn-valuation-four-months-after-launch/)
- [Ex-OpenAI executive builds $1.5 billion AI manufacturing startup Arda — CNBC](https://www.cnbc.com/2026/10/20/ex-openai-executive-builds-1point5-billion-ai-manufacturing-startup-arda.html)
- [Daytona, a startup building the 'agentic cloud', valued at $1 billion — Fortune](https://fortune.com/2026/10/20/daytona-startup-building-the-agentic-cloud-valued-at-1-billion-in-latest-funding-round/)
- [Legal AI startup Legora raises $550M Series E at $8.8B valuation — TechCrunch](https://techcrunch.com/2026/10/21/legal-ai-startup-legora-raises-550m-series-e-at-8-8b-valuation/)
- [Pigment Raises $250M at $2.3B Valuation — PR Newswire](https://www.prnewswire.com/news-releases/pigment-raises-250m-at-2-3b-valuation-302914892.html)
- [Mave Raises $34 Million to Build the Agentic SecOps System — PR Newswire](https://www.prnewswire.com/news-releases/mave-raises-34-million-to-build-the-agentic-secops-system-for-the-modern-enterprise-302916859.html)
- [Year-old AI lab Flapping Airplanes raises $1B at a $6B valuation — TechCrunch](https://techcrunch.com/2026/10/21/year-old-ai-lab-flapping-airplanes-raises-1b-at-a-6b-valuation/)
- [Duvo Raises $32 Million Series A — PR Newswire](https://www.prnewswire.com/news-releases/duvo-raises-32-million-series-a-to-become-the-one-platform-enterprises-run-their-operations-on-302908575.html)
</content>
