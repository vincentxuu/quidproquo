---
title: "AI 日報 — 2026-11-22"
date: 2026-11-22
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "三個獨立 CVE 和新加坡、台灣同週的治理動作都指向同一個瓶頸——Agent 規模化卡住的不是模型，是身分與授權驗證"
tldr: "Claude Agent SDK、某 agent framework 核准快取、Pydantic AI 同天各自曝出身分或授權漏洞，Cairn 入侵醫療影像工具 MONAI Label 的 zero-day 本週正式取得 CVE 編號；新加坡金管局公布 Agentic Money Sandbox 的 know-your-agent 協定，台灣資安署預告年底發布 AI Agent 資安指引、以權限控管為最優先；Apple 自建裝置 agent 消息與 Google Duplex 升級同天曝光；Thinking Machines 開源循環 transformer 架構的 Inkling 2 Mini；Isomorphic Labs 完成本週最大一筆 5B 美元融資"
draft: false
series:
  name: "AI 日報"
  order: 99
---

## 一句話判斷

**今天三個獨立安全漏洞和新加坡、台灣同週的治理動作，共同指向同一個瓶頸——Agent 規模化卡住的不是模型能力，是「怎麼驗證這個 agent 是誰、授權到什麼範圍」；台灣資安署正在最後諮詢的 AI Agent 資安指引把「權限控管」列最優先，現在評估導入的團隊可以提早對齊，不必等正式發佈才改架構。**

## 深度分析：身分與授權正在變成 Agent 規模化的新交易成本

我認為今天把三個獨立漏洞和兩個地區的治理動作放在一起看，指向同一件事：Agent 規模化的真正瓶頸已經從「模型夠不夠聰明」，轉移到「怎麼驗證這個 agent 是誰、授權到什麼範圍」——這是一種交易成本，而且防禦端和監管端今天同時在補這一課。（框架：交易成本）

證據 A：今天公開的三個獨立 CVE，根因都指向同一個洞。Claude Agent SDK 的 CVE-2026-96620 讓未驗證的 resume 參數被注入成惡意 MCP server 設定，CLI 啟動時就能任意執行命令；某 AI agent framework 的工具核准快取只認工具名稱、不認實際風險（CVE-2026-56074），核准一次 `ls -la` 後連 `env` 都被自動放行；Pydantic AI 的 CVE-2026-25580 則是訊息歷史裡的 URL 直接觸發 SSRF。三個漏洞沒有一個是模型被騙去做壞事，全都是系統沒真正驗證呼叫者身分或實際動作。

證據 B：同一週，制度層面也在補同一塊。新加坡金管局把「know-your-agent」身分識別協定做成 Agentic Money Sandbox，讓銀行能驗證 agent 代表哪個客戶、取得哪些授權；台灣數位發展部資通安全署預告年底至 2027 年初發布「AI Agent 資安指引」，約 60 至 70 項控制措施收斂到「權限控管」最優先，署長蔡福隆直接點名授權過大的開源 agent（如 OpenClaw）風險較高，建議審查較嚴謹的平台如 NVIDIA NeMo。

對從業者的意義：身分驗證、最小權限、審計追蹤這些「交易成本」基礎設施，決定的是能不能規模化，不是模型能力——這呼應 Capgemini 的數字：只有 2% 企業已把 agent 規模化部署到生產環境，GCC 國家治理完善的規模化比例也只有 10%。對台灣團隊而言，資安署指引還在做最後專家諮詢，現在正是把自己的 agent 架構拿去對照「權限最小化」原則的時間點，不必等正式發佈才改架構。

```diagram
title: 漏洞側與治理側同時指向身分與授權
desc: 三個獨立 CVE 都栽在身分或授權驗證，同一週新加坡與台灣的治理動作也把「驗證 agent 身分」列為最優先，兩邊共同指向同一個瓶頸。
caption: Capgemini Enterprise AI 調查：僅 2% 企業已把 agent 規模化部署到生產環境。
---
<svg viewBox="0 0 680 220">
  <path class="dg-line" d="M170 76 V96 H340 V140" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M510 76 V96 H340 V140" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="10" y="20" width="320" height="56" rx="6"/>
  <text class="dg-label" x="170" y="39" text-anchor="middle" dominant-baseline="central">漏洞側：3 個 CVE 都栽在身分驗證</text>
  <text class="dg-sub" x="170" y="59" text-anchor="middle" dominant-baseline="central">resume 注入 / 核准快取 / SSRF</text>

  <rect class="dg-box" x="350" y="20" width="320" height="56" rx="6"/>
  <text class="dg-label" x="510" y="39" text-anchor="middle" dominant-baseline="central">治理側：同週補上「驗證身分」</text>
  <text class="dg-sub" x="510" y="59" text-anchor="middle" dominant-baseline="central">新加坡 Know-Your-Agent / 台灣資安指引</text>

  <rect class="dg-box dg-box--warn" x="130" y="140" width="420" height="70" rx="6"/>
  <text class="dg-label" x="340" y="166" text-anchor="middle" dominant-baseline="central">身分與授權＝Agent 規模化的新交易成本</text>
  <text class="dg-sub" x="340" y="188" text-anchor="middle" dominant-baseline="central">多數企業卡住的不是模型，是信任機制沒搭好</text>
</svg>
```

## 今日動態

### 廠商動態

- **[Apple](https://finance.yahoo.com/markets/article/apples-secret-ai-agent-shows-john-ternus-is-done-sitting-out-the-ai-race-164226953.html)**（Yahoo Finance）：Bloomberg、Fox News 等多家媒體交叉證實蘋果內部由硬體工程主管 John Ternus 主導開發自主 AI agent，目標操作裝置、瀏覽器、App 與寫程式碼，對照 OpenAI、Anthropic、Meta 等既有產品。
- **[Google](https://research.google/blog/how-google-duplex-evolved-to-also-call-businesses-for-you-in-gemini/)**（Google Research）：Duplex 技術演進為 Gemini 的代打電話能力，agent 可主動聯繫店家確認營業時間、庫存等資訊並回報使用者。
- **[阿里雲](https://www.alibabacloud.com/blog/ack-one-fleet-scaling-agent-sandboxes-from-single-cluster-to-multi-cluster_603797)**（Alibaba Cloud Blog）：ACK One Fleet 新增多叢集擴展能力，針對 AI agent 沙箱工作負載做全球排程與可用性優化。
- **Anthropic**：數學家 Levent Alpöge 在筆記中宣稱與 Claude 合作完成廣義黎曼猜想的證明草稿，形容 Claude 在收尾階段「遠遠超前」；此主張尚待數學社群同行審查，先當作觀察訊號。（[來源](https://simonwillison.net/2026/Nov/20/levent-alpoge/)）

### 模型與基礎設施

- **[Thinking Machines Inkling 2 Mini](https://thinkingmachines.ai/news/inkling-2-mini/)**（The Decoder）：開源「循環 transformer」架構 MoE 模型，24 層中 12 層重複跑三次以延長內部推理，總參數 26.4B、啟用 5.4B，支援文字與圖像、百萬 token context，Apache 2.0 授權。
- 今天的 Benchmark Watch：CursorBench 官方榜 11-20 從 4.0 版轉正到 4.1 版，Gemini 4 Neon 以 65.4% 登頂，坐實了兩天前還只是廠商自測的同一個數字，原冠軍 Gemini 4 Carbon 退居第二；SWE-bench Verified、Arena Agent、Artificial Analysis Coding Agent Index 三個榜單均無異動（[Benchmark 異動](/posts/daily/2026-11-22-benchmark-cursorbench-4-1-neon)）。

### 技術進展

今天的 Arxiv Digest 從理論與實證兩個角度回答同一個問題：Agent 安全到底能不能被驗證？第一篇用電腦運算理論證明保證安全本質上不可判定，連限制在有限範圍內都是 PSPACE-complete；第二篇把 108 起新聞報過的 Agent 安全事故離線重建，89% 能重現，而且多數有實害的事故根本沒有攻擊者——這個發現剛好跟今天三個「不是被攻擊、是沒驗證好」的 CVE 互相呼應（[AI Agent Arxiv Digest](/posts/daily/2026-11-22-ai-agent-arxiv-digest)）。

### 工具與生態

今天的 GitHub Digest 主線是 agent 記憶層的「共用層」路線：`agentmemory` 用 54 個 MCP 工具同時服務 Claude Code、Codex CLI、Copilot CLI 等十幾種 runtime；Claude Code 同日升級到 v2.1.330，補上企業帳號登入與內建畫圖 mod（[AI Agent GitHub Digest](/posts/daily/2026-11-22-ai-agent-github-digest)）。

- **[EYRA](/posts/daily/2026-11-22-tool-eyra)**（站內文章）：Rust 寫成的 Windows MCP server，直接讀 UI Automation 樹取代截圖猜座標，`see_diff` 單步成本可壓到 40 token 以內（Stage 1 已有詳細文章）。
- **[Sourcegraph](https://sourcegraph.com/blog/ruby2shell-cve-2026-132825-find-vulnerable-ruby)**（Sourcegraph Blog）：搶在 PoC 公開前發佈 Ruby2Shell（CVE-2026-132825）掃描查詢，協助企業找出未認證 RCE 風險的 Ruby 執行環境。
  - **為什麼重要**：官方 MCP Registry 本身也被點名缺乏審核機制、形同 AI 工具的供應鏈（[文章](https://dev.to/razvanm4/inside-the-official-mcp-registry-a-supply-chain-for-ai-tools-314n)），選用第三方掃描工具或 MCP server 前，同樣要做來源與權限核對。

### 資安事件與防禦技術

- **[Claude Agent SDK](https://www.ox.security/ox-radar/cve/CVE-2026-96620/)**（OX Security）：CVE-2026-96620，Python SDK（<0.2.121）的 resume 參數未驗證，可注入 `--mcp-config` 定義惡意 stdio MCP server，CLI 啟動時任意命令執行；已於 0.2.121 修復。
  - **為什麼重要**：受影響的是把未驗證輸入直接傳進 resume 的應用，要重新檢查自己的 session 管理邏輯，不能假設 SDK 內建防護就足夠。
- **[Cairn / MONAI Label](https://thehackernews.com/2026/11/attackers-ai-agents-found-zero-day-in.html)**（The Hacker News）：中國關聯駭客用自主滲透框架 Cairn 攻破醫療影像工具 MONAI Label 的 zero-day，本週正式取得 CVE-2026-133968（CVSS 9.8），Amazon 公布 agent 在約 11 分鐘內找到任意檔案寫入漏洞並取得 root 權限的完整技術時序，目前仍無修補版本可安裝。
  - **為什麼重要**：這是「agent 自主找到並利用 zero-day」第一次有完整技術時序公開佐證，不是推測；使用 MONAI Label 的團隊現在就該先限制網路存取、開啟驗證，不必等補丁。
- **[Pydantic AI](https://ox.security/ox-radar/cve/CVE-2026-25580)**（OX Security）：CVE-2026-25580，0.0.26 至 1.56.0 前的 URL 下載功能可被訊息歷史裡的惡意 URL 觸發 SSRF；已於 1.56.0 修復。
- **某 AI agent framework**（[pulseaugur](https://pulseaugur.com/cluster/370218-ai-agent-framework-vulnerability-allows-broad-command-execution-via-flawed)）：工具核准快取只依工具名稱判斷（CVE-2026-56074），核准一次 `ls -la` 後同工具的高風險呼叫（含 `env`）皆被自動放行，且會把完整環境變數傳給子行程。
- **[Google](https://www.govinfosecurity.com/google-builds-fake-internet-to-test-ai-agent-security-a-33479)**（GovInfoSecurity）：打造「假網路」沙盒測試 browser-use agent 的安全行為，但發現部分 agent 能察覺自己正處於測試環境，影響行為觀察的真實性。

### 法規與治理

- **[美國國會](https://wpde.com/news/nation-world/ai-industry-braces-for-tougher-oversight-under-incoming-democratic-congress-artificial-intelligence-data-centers-cybersecurity-rogue-agents)**（WPDE）：業界預期即將上任的民主黨國會將推動前沿模型安全準則、資料中心、網路安全與「失控 agent」相關法案，監管力度預期明顯上升。
- **[GAO](https://casrai.org/news/gao-report-ai-cybersecurity-cyberattacks-defense-2026)**（美國政府責任署）：發布報告分析 AI 如何同時加速網路攻擊與強化聯邦網路防禦，提出 16 項政策選項供國會參考。

### 區域動態

- **台灣**：數位發展部資通安全署署長蔡福隆宣布，年底至 2027 年初將發布「AI Agent 資安指引」，涵蓋 LLM 與 agent 全生命周期、約 60 至 70 項控制措施，強調企業自建或買現成 agent 都該優先做好「權限控管」；他直接點名授權過大的開源 agent（如 OpenClaw）風險較高，審查較嚴謹的 NVIDIA NeMo 相對安全。（[來源](https://udn.com/news/story/7240/9888953)）
- **中國／香港**：南華早報報導香港正推動 agentic commerce，能自主比價、購物的 AI agent 開始配備自己的支付錢包，監管與銀行業者仍在摸索因應方式。（[來源](https://www.scmp.com/tech/big-tech/article/3375253/ai-agents-are-getting-wallets-hong-kong-ready-them)）
- **東南亞**：新加坡金管局公布 Agentic Money Sandbox 兩項試驗，測試用「know-your-agent」協定讓銀行驗證 agent 代表哪個客戶、取得哪些授權，為自主 agent 的穩定幣支付鋪路。（[來源](https://vibetrader.com/news/e5dde3dc-1bb1-4d04-8f63-c4bdadedd921)）
- **歐洲**：歐盟另一條監管軌道《Digital Omnibus on AI》延後高風險規則上路時間，與既有 GDPR、ePrivacy 規則疊加，凸顯歐洲在 AI 主權與外國雲端依賴間的拉扯；執委會同時醞釀《數位公平法》，要求 AI 購物 agent 須向消費者公開比價資訊。（[來源 A](https://windowsforum.com/news/europes-ai-sovereignty-challenge-gdpr-reform-foreign-cloud-dependence-and-resilience.453547/)、[來源 B](https://qz.com/european-shoppers-ai-agents-prices-digital-fairness-111726)）
- **中東**：調查顯示阿聯與沙烏地已有 75% 企業在跑 AI agent，但僅 10% 能把具治理機制的 agentic AI 真正規模化部署；DataRobot 同週與 Dell Technologies 宣布合作，為當地企業提供「可自主掌控」的主權 agentic AI 部署方案。（[來源 A](https://www.middleeastainews.com/p/only-10-of-gcc-firms-scale-governed)、[來源 B](https://www.datarobot.com/newsroom/press/datarobot-collaborates-with-dell-technologies-to-bring-operationally-sovereign-agentic-ai-to-middle-east-enterprises/)）
- **非洲**：泛非創投 Enza Capital 完成專注非洲 AI 的「AI Africa Fund」首輪募資，到位約 2,100 萬美元（約當 6,000 萬美元目標的 35%），將以 25 萬至 300 萬美元支票投早期金融、醫療、教育、農業領域的非洲 AI 公司。（[來源](https://www.howwemadeitinafrica.com/p/why-this-investor-is-betting-on-african)）
- **拉丁美洲**：智利的一般性 AI 法案已進入立法後期階段，預計 2027 年通過，可望成為拉丁美洲第一個完整的 AI 治理框架。（[來源](https://fiscalnote.com/reports/global-policy-report-2027)）
- **大洋洲**：澳洲政府宣布將在即將上路的 AI Standards 立法中納入六項前沿模型開發者安全義務，並設專責 AI 安全監管機關；生產力與競爭事務部次長 Andrew Leigh 同時表示政府正檢討競爭法，以跟上消費者透過 AI agent 購物、支付的趨勢，並評估是否需規範「監控定價」。（[來源 A](https://autonainews.com/australia-legislates-six-ai-safety-obligations-for-frontier-developers)、[來源 B](https://tradersunion.com/news/regulators/show/4352827-australia-ai-agent-shopping-laws)）

日本／韓國、印度／南亞：今日檢索的候選多與 AI agent 無直接關聯（人才培訓合作、監管聲明、企業內部導入調查），未見足夠獨立的合格事件，暫不收錄。

### 商業案例／融資

- **[Genesis AI](https://www.wsj.com/cio-journal/genesis-ai-a-robotics-startup-raises-500-million-35198457)**（WSJ）：成立僅兩年的機器人新創完成 $500M A 輪融資，估值達 $3.5B，資金用於具身智能機器人研發。
- **[Isomorphic Labs](https://techcrunch.com/2026/11/17/isomorphic-labs-raises-5b-as-it-looks-to-take-drug-candidates-to-clinical-trials?amp=1)**（TechCrunch）：DeepMind 旗下 AI 藥物研發公司完成 $5B Series C，由 Greenoaks 與 Sequoia 共同領投，是本週 AI 領域規模最大的一筆投資。
- **[Arva AI](/posts/daily/2026-11-22-funding-arva-ai)**（站內文章）：銀行合規／放貸決策 AI agent 新創完成 $20M Series A，Arthur Ventures 領投，讓銀行把金融犯罪合規、准入、放貸等端到端決策交給可稽核的 agent 執行（Stage 1 已有詳細文章）。

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Isomorphic Labs Series C | $5B | [TechCrunch](https://techcrunch.com/2026/11/17/isomorphic-labs-raises-5b-as-it-looks-to-take-drug-candidates-to-clinical-trials?amp=1) |
| Genesis AI A 輪／估值 | $500M／$3.5B | [WSJ](https://www.wsj.com/cio-journal/genesis-ai-a-robotics-startup-raises-500-million-35198457) |
| CVE-2026-133968（Cairn / MONAI Label）CVSS | 9.8 | [The Hacker News](https://thehackernews.com/2026/11/attackers-ai-agents-found-zero-day-in.html) |
| CVE-2026-96620（Claude Agent SDK）CVSS | 9.2 | [OX Security](https://www.ox.security/ox-radar/cve/CVE-2026-96620/) |
| Enza Capital AI Africa Fund 首輪募資 | $21M（目標 $60M 的 35%） | [How We Made It In Africa](https://www.howwemadeitinafrica.com/p/why-this-investor-is-betting-on-african) |

## 今日 Digest 一覽

- :file: [AI Agent Arxiv Digest — 2026-11-22](/posts/daily/2026-11-22-ai-agent-arxiv-digest)
- :file: [AI Agent GitHub Digest — 2026-11-22](/posts/daily/2026-11-22-ai-agent-github-digest)
- :file: [Benchmark 異動｜CursorBench 轉正 4.1：Gemini 4 Neon 拿下官方榜認證第一](/posts/daily/2026-11-22-benchmark-cursorbench-4-1-neon)
- :file: [融資速報｜Arva AI Series A $20M](/posts/daily/2026-11-22-funding-arva-ai)
- :file: [工具推薦｜EYRA](/posts/daily/2026-11-22-tool-eyra)
- :file: [AI Engineer 面試日練 — 2026-11-22：Behavioral & Weekly Review](/posts/daily/2026-11-22-ai-interview-daily)
- :file: [Product Builder 面試日練 — 2026-11-22：Behavioral & Weekly Review](/posts/daily/2026-11-22-product-builder-interview-daily)

## 明日關注

- Cairn / MONAI Label 的 CVE-2026-133968 目前仍無修補版本，觀察還有哪些機構被證實遭入侵、修補何時真正上線。
- 台灣資安署「AI Agent 資安指引」完成最後專家諮詢後的正式內容，60 至 70 項控制措施會不會再有增減。
- Thinking Machines Inkling 2 Mini 開源後，社群用「循環 transformer」架構的實測是否驗證其推理品質宣稱。

## 今日收穫

之前以為 agent 安全事故多半是被攻擊，今天把三個獨立 CVE 跟 Arxiv Digest 裡 ROGUE-AI 論文的統計放在一起看才發現，這個直覺剛好被同一天的證據反過來證實：resume 參數沒驗證、核准快取只認工具名稱、SSRF 走訊息歷史——三個漏洞的共同點不是「被騙」，而是「正常使用方式裡本來就有洞」，跟論文統計的 72 起有實害事故中 62 起沒有攻擊者，是同一個故事的兩個版本。

## 參考資料

- [AI Agent Arxiv Digest — 2026-11-22](/posts/daily/2026-11-22-ai-agent-arxiv-digest)
- [AI Agent GitHub Digest — 2026-11-22](/posts/daily/2026-11-22-ai-agent-github-digest)
- [Apple's secret AI agent shows John Ternus is done sitting out the AI race - Yahoo Finance](https://finance.yahoo.com/markets/article/apples-secret-ai-agent-shows-john-ternus-is-done-sitting-out-the-ai-race-164226953.html)
- [How Google Duplex evolved to also call businesses for you in Gemini - Google Research](https://research.google/blog/how-google-duplex-evolved-to-also-call-businesses-for-you-in-gemini/)
- [ACK One Fleet: Scaling Agent Sandboxes from Single-Cluster to Multi-Cluster - Alibaba Cloud Blog](https://www.alibabacloud.com/blog/ack-one-fleet-scaling-agent-sandboxes-from-single-cluster-to-multi-cluster_603797)
- [Levent Alpöge, Claude, and a possible proof of the generalized Riemann Hypothesis - Simon Willison](https://simonwillison.net/2026/Nov/20/levent-alpoge/)
- [Inkling 2 Mini - Thinking Machines](https://thinkingmachines.ai/news/inkling-2-mini/)
- [CVE-2026-96620 - OX Security](https://www.ox.security/ox-radar/cve/CVE-2026-96620/)
- [CVE-2026-25580 - OX Security](https://ox.security/ox-radar/cve/CVE-2026-25580)
- [AI agent framework vulnerability allows broad command execution via flawed approval cache - pulseaugur](https://pulseaugur.com/cluster/370218-ai-agent-framework-vulnerability-allows-broad-command-execution-via-flawed)
- [Attackers' AI agents found a zero-day in medical-imaging software and gained root access - The Hacker News](https://thehackernews.com/2026/11/attackers-ai-agents-found-zero-day-in.html)
- [Ruby2Shell (CVE-2026-132825): find vulnerable Ruby - Sourcegraph Blog](https://sourcegraph.com/blog/ruby2shell-cve-2026-132825-find-vulnerable-ruby)
- [Inside the official MCP Registry: a supply chain for AI tools - dev.to](https://dev.to/razvanm4/inside-the-official-mcp-registry-a-supply-chain-for-ai-tools-314n)
- [Google builds "fake internet" to test AI agent security - GovInfoSecurity](https://www.govinfosecurity.com/google-builds-fake-internet-to-test-ai-agent-security-a-33479)
- [AI industry braces for tougher oversight under incoming Democratic Congress - WPDE](https://wpde.com/news/nation-world/ai-industry-braces-for-tougher-oversight-under-incoming-democratic-congress-artificial-intelligence-data-centers-cybersecurity-rogue-agents)
- [GAO report on AI, cybersecurity, cyberattacks and defense - CASRAI](https://casrai.org/news/gao-report-ai-cybersecurity-cyberattacks-defense-2026)
- [AI Agent 免成企業資安破口！資安署年底將推安全指引 揭4招防駭 - 聯合新聞網](https://udn.com/news/story/7240/9888953)
- [AI agents are getting wallets, Hong Kong wants them ready - SCMP](https://www.scmp.com/tech/big-tech/article/3375253/ai-agents-are-getting-wallets-hong-kong-ready-them)
- [Singapore's Central Bank plans AI agent payment protocol with stablecoin testing sandbox - vibetrader](https://vibetrader.com/news/e5dde3dc-1bb1-4d04-8f63-c4bdadedd921)
- [Europe's AI sovereignty challenge - windowsforum](https://windowsforum.com/news/europes-ai-sovereignty-challenge-gdpr-reform-foreign-cloud-dependence-and-resilience.453547/)
- [European shoppers, AI agents and prices: the Digital Fairness Act - qz](https://qz.com/european-shoppers-ai-agents-prices-digital-fairness-111726)
- [Only 10% of GCC firms scale governed agentic AI - middleeastainews](https://www.middleeastainews.com/p/only-10-of-gcc-firms-scale-governed)
- [DataRobot collaborates with Dell Technologies to bring operationally sovereign agentic AI to Middle East enterprises](https://www.datarobot.com/newsroom/press/datarobot-collaborates-with-dell-technologies-to-bring-operationally-sovereign-agentic-ai-to-middle-east-enterprises/)
- [Why this investor is betting on African AI - How We Made It In Africa](https://www.howwemadeitinafrica.com/p/why-this-investor-is-betting-on-african)
- [Chile general AI bill - FiscalNote Global Policy Report 2027](https://fiscalnote.com/reports/global-policy-report-2027)
- [Australia legislates six AI safety obligations for frontier developers - autonainews](https://autonainews.com/australia-legislates-six-ai-safety-obligations-for-frontier-developers)
- [Australia reviews competition law for AI agent shopping - tradersunion](https://tradersunion.com/news/regulators/show/4352827-australia-ai-agent-shopping-laws)
- [Genesis AI, a robotics startup, raises $500 million - WSJ](https://www.wsj.com/cio-journal/genesis-ai-a-robotics-startup-raises-500-million-35198457)
- [Isomorphic Labs raises $5B as it looks to take drug candidates to clinical trials - TechCrunch](https://techcrunch.com/2026/11/17/isomorphic-labs-raises-5b-as-it-looks-to-take-drug-candidates-to-clinical-trials?amp=1)
- [融資速報｜Arva AI Series A $20M](/posts/daily/2026-11-22-funding-arva-ai)
- [工具推薦｜EYRA](/posts/daily/2026-11-22-tool-eyra)
- [Benchmark 異動｜CursorBench 轉正 4.1](/posts/daily/2026-11-22-benchmark-cursorbench-4-1-neon)
