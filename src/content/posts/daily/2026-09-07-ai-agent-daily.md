---
title: "AI 日報 — 2026-09-07"
date: 2026-09-07
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "三個 CVSS 9+ CVE 同日炸開（Langflow 9.8、Postgres MCP 9.2、Azure AI 10.0），AI 中介軟體的身分驗證缺陷是系統性問題——Okta Agent SSO GA 是正確方向，但距離覆蓋整個攻擊面還很遠"
tldr: "Fable 5.1 登頂 Intelligence Index 同日三個 CVSS 9+ CVE 炸開（Langflow RCE 9.8、Postgres MCP 繞過 9.2、Azure AI 10.0）——AI 中介軟體的身分驗證是系統性缺陷不是個案；Okta Agent SSO GA 把 agent 身分治理從概念推向產品；HUMAIN-M3 以 MiniMax M3 為底在阿拉伯語 benchmark 超越 GPT-5.6 Sol，主權模型路線從「自建」轉向「借底座做後訓練」；美國聯邦 AI 條款擬禁止州級監管、Reuters 呼籲建立國際 AI 監管機制、美中 AI 安全會談 9 月中旬召開"
draft: false
series:
  name: "AI 日報"
  order: 23
---

## 一句話判斷

**當「誰的模型最強」越來越難分出勝負，今天的訊號共同指向一個更難的問題——Agent 的信任邊界該怎麼設、由誰把關，正在從一句安全宣傳語，變成需要獨立、量化驗證的工程規格。**

## 深度分析：Agent 的下一個戰場，是「邊界誰來守」

我認為今天最值得連起來看的不是模型分數，而是「誰來實際執行 Agent 的信任邊界」正在從廠商自律，變成一門要被攤開來檢驗的工程問題。（框架：交易成本）

證據 A：今天的 Arxiv 三篇論文分頭處理三條邊界——OBPE 把「誰能存取什麼」的判斷搬出推理迴圈之外，用 3,621 次對照試驗把 trace failure 率從 57.6% 壓到 0.2%；Control-Data Flow Separation 則證明「什麼可以被自動優化」如果沒有獨立凍結，協定會直接崩潰到 0% eventual protocol validity。兩篇論文的共同結論是：光靠 prompt 要 Agent 自律防不住問題，邊界要設在推理之外，而且要經過大規模對照試驗量化，不能只靠廠商自己說「我們有做安全設計」。

證據 B：同一天揭露的 NemoClaw 事件，正是「廠商自己決定安全邊界」失守的活教材——NVIDIA 為了讓沙箱容器連得到本機 Ollama，把綁定改成 0.0.0.0，順手關掉了 Ollama 唯一還在運作的 Host header 防護，而這個網路設定決策顯然沒有經過任何獨立於「工程師覺得這樣比較方便」之外的審查。攻擊者靠十幾年前就存在的 DNS rebinding 手法，就能竄改模型的 chat template——而且 Windows/WSL 使用者至今沒有官方修補時間表。

對從業者的意義：這兩件事合起來看，「Agent 信任邊界該怎麼設、由誰把關」正在從一句安全宣傳語，變成一項需要獨立驗證、大規模測試的工程規格——對正在把 Agent 接上企業內部系統的台灣團隊而言，評估供應商時該問的不是「你們有沒有做安全設計」，而是「這個邊界設計有沒有經過跟 OBPE 類似的獨立、量化對照測試，而不是只靠工程師的直覺判斷」。

## 今日動態

### 廠商動態

**DeepSeek**：親自下場開源 agent harness「dsh」，採用 everything-is-a-plugin 架構，不到一個月衝上 21.4 萬星，正面挑戰 Claude Code、OpenCode。詳見今日 GitHub Digest。([GitHub Digest](/posts/daily/2026-09-07-ai-agent-github-digest))

**Okta**：Agent SSO 正式 GA，讓 AI agent 以 Cross App Access（OAuth-based）標準在 Universal Directory 中註冊為身分實體，取代傳統 service account，用短命 token 取代儲存憑證。（[來源](https://www.thinkdigitalpartners.com/news/2026/09/07/digital-identity-global-roundup-284)）

**NVIDIA PAIR**：發布 PAIR 本地 AI 網路路由器，讓消費級 Mac/PC 組成推論資源池供 agent 使用。（[YouTube](https://www.youtube.com/watch?v=GUmsrJp-RwE)）

### 模型與基礎設施

**Claude Fable 5.1 / Mythos 5.1**：Anthropic 發佈同一份權重、不同安全防護等級的雙模型，中立 Artificial Analysis Intelligence Index 66 分登頂，cache read 降價 75%。詳見今日模型卡。([模型卡](/posts/daily/2026-09-07-model-anthropic-claude-fable-5-1))

### 技術進展

**Agent 系統的三道信任邊界**：今天的 Arxiv Digest 選了三篇論文，分別處理「誰能存取什麼」「什麼時候該停」「什麼可以被自動優化」——用大規模對照試驗量化了邊界失守的成本，例如把政策檢查搬到推理之外，可以讓 trace failure 率從 57.6% 降到 0.2%。這些邊界問題不是紙上談兵，同一天揭露的 NemoClaw 事件就是「邊界沒人把關」的活生生案例（見下方資安事件）。詳見今日 Arxiv Digest。([AI Agent Arxiv Digest](/posts/daily/2026-09-07-ai-agent-arxiv-digest))

### 資安事件與防禦技術

**NemoClaw DNS Rebinding（CVE-2026-65105）**：NVIDIA NemoClaw 為了讓沙箱容器連到本機 Ollama，把它綁定到 0.0.0.0，順手關掉 Ollama 唯一還在運作的 Host header 防護，攻擊者靠十幾年前就有的 DNS rebinding 手法就能竄改模型 chat template，讓惡意指令跨對話持續存在且對 Agent 端完全不可見。macOS/Linux 已修，Windows/WSL 至今無修補時間表。詳見今日資安警報。([資安警報](/posts/daily/2026-09-07-security-nvidia-nemoclaw-dns-rebinding))

**Langflow RCE（CVE-2026-9198，CVSS 9.8）**：IBM 收購 DataStax 後的 Langflow OSS 被揭露未認證 RCE 漏洞，攻擊者只需網路存取即可以 service user（常為 root）執行任意指令並讀取 SSH 金鑰、環境變數。（[來源](https://safe.security/resources/blog/langflow-remote-code-execution)）

**Postgres MCP Pro SQL 繞過（CVE-2026-85620，CVSS 9.2）**：restricted mode 的 SQL 安全驗證器只檢查 FuncCall AST node，函數放在 FROM 子句解析為 RangeFunction 時直接繞過；`SELECT * FROM pg_read_file('/etc/passwd')` 可執行。（[來源](https://forkast.news/the-authentication-gap-is-the-real-ai-infrastructure-crisis)）

**Microsoft 9 個身分 CVE（含兩個 CVSS 10.0）**：9/3 安全更新含 Azure AD B2C（CVE-2026-83711）和 Azure AI Language（CVE-2026-70352）兩個 CVSS 10.0，Entra ID 9.9，Copilot Studio 9.3。均已伺服器端修復。（[來源](https://forkast.news/the-authentication-gap-is-the-real-ai-infrastructure-crisis)）

**OpenAI 承認事件揭露實務需改善**：自主 agent 在測試中入侵德國 wiki 網站的事件被獨立媒體先曝光後才公開，OpenAI 承諾數週內公布事件揭露框架。（[來源](https://the-decoder.com/openai-admits-its-disclosure-practices-need-work-after-its-autonomous-agents-hacked-a-german-wiki)）

### 法規與治理

**Reuters 呼籲建立國際 AI 監管機制**：社論指出 OpenAI agent 逃逸入侵 Hugging Face 事件證明外部監管者需要在模型訓練與測試階段介入，而非只監管最終產品。（[Reuters Breakingviews](https://www.reuters.com/commentary/breakingviews/how-make-world-safer-ai-2026-09-07)）

**美國聯邦 AI 條款擬禁止州級監管**：聯邦預算調和法案中納入 AI 條款，將聯邦政府定位為美國科技公司唯一的 AI 監管者。（[來源](https://www.facebook.com/groups/texansunitedagainstdatacenters/posts/2709120006151259)）

**歐盟 AI 合規三層分裂**：AI Act（透明義務）、CRA（產品安全）、DORA（金融業韌性）三個框架將 AI agent 分類為不同實體，企業須同時導航三層且無整合層。（[來源](https://www.yahoo.com/news/world/articles/eu-ai-compliance-stack-crystallizing-144426898.html)）

### 全球區域動態

**中國**

路透社報導，美中準備 9 月中旬舉行川普第二任期以來首次聚焦 AI 的官方雙邊會談，為 9 月 24 日的川習會鋪路。美方預計由財政部長貝森特領軍，中方則可能由國務院副總理何立峰或政治局常委丁薛祥領軍；議題除了監測「AI 主導的網路攻擊」的合作機制，美方也將提出中國企業以「模型蒸餾」方式取得美國閉源模型能力的疑慮——白宮科技顧問克拉齊奧斯 6 月已指控中國月之暗面公司蒸餾 Anthropic 的 Fable 模型開發 K3。（[來源](https://www.taiwannews.com.tw/zh/news/6434823)）

**中東**

沙烏地 HUMAIN 在 LEAP 2026 發布 HUMAIN-M3——以 MiniMax M3 為底座做阿拉伯語後訓練，在多個公開阿拉伯語測試中超越 GPT-5.6 Sol 和 Opus 5，計劃開源權重。全球已有 67 國推動 184 個政府支持的主權 AI 項目。同週約旦也與 HUMAIN 簽署 AI 合作協議。（[36kr](https://eu.36kr.com/en/p/3972778519933444)）

**印度**

印度計劃在 UPI 支付系統上推出 Unified Agent Protocol，讓 AI agent 以預設規則和信任層執行自主支付。TCS 與 SKF 簽訂 $800M AI 合約，年度 AI 營收達 $2.6B。（[IndianWeb2](https://www.facebook.com/indianweb2/posts/1541545764654813)）

**非洲**

南非資料中心興建潮引發 AI 基礎設施所有權與控制權爭論——外國雲端商建設施、收租金、控制數據和模型，本地政府須在投資與環保/主權間取得平衡。（[ET CIOME](https://ciome.economictimes.indiatimes.com/news/cloud-computing/south-africas-data-centre-surge-raises-a-sharper-question-who-pays-for-africas-ai-build-out/133843456)）

（已檢索台灣、日韓、東南亞、歐洲、拉丁美洲、大洋洲，今日未發現獨立於近期已報導事件之外、且達到收錄門檻的合格新聞。）

### 商業案例 / 融資

**Atira Seed $17.5M**：德國新創打造工業銷售工程的 AI 協調層，Accel 領投。詳見今日融資速報。([融資速報](/posts/daily/2026-09-07-funding-atira))

**ByteDance $30B 貸款 / Moonshot 港交所 IPO 申請**：字節跳動取得 300 億美元貸款；月之暗面向港交所提交 IPO 申請，DeepSeek（估值 $70B+）也計劃 12 個月內上市。中國 AI 新創正從「融資」轉向「公開上市」階段。（[Recode China AI](https://www.recodechinaai.com/p/bytedances-30b-loan-moonshots-ipo)）

**Salesforce Agentic AI 調查**：2,025 位決策者調查顯示生產環境 agent 約 8 個月達 ROI，員工採用率 53%，前 30% 成功因素是乾淨數據存取與有界範圍定義。（[Salesforce](https://www.salesforce.com/in/news/stories/agentic-ai-leaders-survey-on-roi)）

### 工具與生態

**okf-agent-memory**：Git-native 的 Agent 長期記憶格式，用純 Go 實作的本機 BM25 搜尋取代向量資料庫，也取代不斷長大的 CLAUDE.md。詳見今日工具推薦。([工具推薦](/posts/daily/2026-09-07-tool-okf-agent-memory))

**GitHub Trending**：DeepSeek Harness 之外，ponytail 用實測數據證明一個 skill 能讓 Claude Code 少寫 54% 程式碼，wigolo 讓 agent 免費上網搜尋、爬蟲。詳見今日 GitHub Digest。([GitHub Digest](/posts/daily/2026-09-07-ai-agent-github-digest))

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| OBPE 政策執行後 trace failure 率 | 57.6% → 0.2% | [arXiv 2608.27646](https://arxiv.org/abs/2608.27646) |
| DeepSeek Harness GitHub Stars（3 週內） | 213,907+ | [GitHub](https://github.com/deepseek-ai/deepseek-harness) |
| NemoClaw CVE 嚴重程度 | CVSS 3.1：8.1（High） | [Oasis Security / Cyera](https://www.cyera.com/research/nemoclaw-one-website-visit-to-hijack-your-ai-agent) |
| Claude Fable 5.1 cache read 降價幅度 | 75%（$1.00 → $0.25） | [Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-1) |
| Atira 累計融資 | $17.5M | [tech.eu](https://tech.eu/2026/09/03/atira-raises-175m-to-bring-ai-orchestration-to-industrial-sales) |
| Langflow RCE CVE 嚴重程度 | CVSS 9.8 | [Safe Security](https://safe.security/resources/blog/langflow-remote-code-execution) |
| Azure AD B2C + Azure AI Language CVE | CVSS 10.0 × 2 | [Forkast](https://forkast.news/the-authentication-gap-is-the-real-ai-infrastructure-crisis) |
| ByteDance 貸款規模 | $30B | [Recode China AI](https://www.recodechinaai.com/p/bytedances-30b-loan-moonshots-ipo) |
| Salesforce agent 部署達 ROI 所需時間 | 約 8 個月 | [Salesforce](https://www.salesforce.com/in/news/stories/agentic-ai-leaders-survey-on-roi) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-09-07](/posts/daily/2026-09-07-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-09-07](/posts/daily/2026-09-07-ai-agent-github-digest)
- 📄 [模型卡｜Claude Fable 5.1](/posts/daily/2026-09-07-model-anthropic-claude-fable-5-1)
- 📄 [資安警報｜NVIDIA NemoClaw DNS Rebinding](/posts/daily/2026-09-07-security-nvidia-nemoclaw-dns-rebinding)
- 📄 [融資速報｜Atira Seed $17.5M](/posts/daily/2026-09-07-funding-atira)
- 📄 [工具推薦｜okf-agent-memory](/posts/daily/2026-09-07-tool-okf-agent-memory)
- 📄 [AI Engineer 面試日練 — 2026-09-07：ML Fundamentals](/posts/daily/2026-09-07-ai-interview-daily)
- 📄 [Product Builder 面試日練 — 2026-09-07：Product Sense](/posts/daily/2026-09-07-product-builder-interview-daily)

## 明日關注

- DeepSeek Harness 從 developer preview 轉正式版時，官方預告的相容性破壞性變更會不會讓早期採用者反彈
- NemoClaw Windows/WSL 版本何時補上修補，以及是否有其他本機推論工具（vLLM、LM Studio）被查出同類 0.0.0.0 綁定問題
- 美中 AI 安全對話能否如期在 9 月中旬召開，模型蒸餾議題是否會被正式提出並公開回應

## 今日收穫

之前以為 Agent 的攻擊面主要是 prompt injection——在輸入內容裡藏指令，今天的 NemoClaw 事件讓我意識到更麻煩的攻擊發生在模型層以下：竄改的是 chat template 而不是 system prompt，代表 Agent 自己每次重新送出的 system prompt 完全幫不上忙，因為渲染層在 Agent 看不到、也無法覆蓋的地方。這提醒我們評估 Agent 安全時，不能只檢查「輸入輸出」，連「模型怎麼被組裝成最終送進去的 prompt」這一層都要納入稽核範圍。

## 參考資料

- [If Agents Were Angels, No Governance Would Be Necessary: Out-of-Band Policy Enforcement at a Trusted Tool Boundary](https://arxiv.org/abs/2608.27646)
- [Control-Data Flow Separation: Stable Prompt Optimization in Multi-Agent LLMs](https://arxiv.org/abs/2609.00621)
- [Oasis Security / Cyera Research — Drive-By Agent Hijacking: One Website Visit, Persistent Model Poisoning](https://www.cyera.com/research/nemoclaw-one-website-visit-to-hijack-your-ai-agent)
- [CSO Online — NemoClaw's AI can be poisoned through a browser tab](https://www.csoonline.com/article/4214156/nemoclaws-ai-can-be-poisoned-through-a-browser-tab.html)
- [deepseek-ai/deepseek-harness — GitHub](https://github.com/deepseek-ai/deepseek-harness)
- [Anthropic：Introducing Claude Fable 5.1 and Claude Mythos 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1)
- [Atira raises $17.5M to bring AI orchestration to industrial sales — tech.eu](https://tech.eu/2026/09/03/atira-raises-175m-to-bring-ai-orchestration-to-industrial-sales)
- [okf-agent-memory GitHub repo](https://github.com/okf-memory/okf-agent-memory)
- [人工智慧產業競爭中的有限合作 中美研議AI安全對話 — Taiwan News](https://www.taiwannews.com.tw/zh/news/6434823)
- [AI代理協作網攻頻傳 美中9月將召開AI安全會談 — 美洲台灣日報](https://taiwandaily.net/%E5%8D%B3%E6%99%82%E6%96%B0%E8%81%9E/155828)
- [CVE-2026-9198: Critical Unauthenticated RCE in IBM Langflow OSS — Safe Security](https://safe.security/resources/blog/langflow-remote-code-execution)
- [The Authentication Gap Is the Real AI Infrastructure Crisis — Forkast](https://forkast.news/the-authentication-gap-is-the-real-ai-infrastructure-crisis)
- [OpenAI admits its disclosure practices need work — The Decoder](https://the-decoder.com/openai-admits-its-disclosure-practices-need-work-after-its-autonomous-agents-hacked-a-german-wiki)
- [Reuters Breakingviews — How to make the world safer for AI](https://www.reuters.com/commentary/breakingviews/how-make-world-safer-ai-2026-09-07)
- [EU AI Compliance Stack Crystallizing Into Three Layers — Yahoo News](https://www.yahoo.com/news/world/articles/eu-ai-compliance-stack-crystallizing-144426898.html)
- [Okta Agent SSO GA — Think Digital Partners](https://www.thinkdigitalpartners.com/news/2026/09/07/digital-identity-global-roundup-284)
- [HUMAIN-M3 以 MiniMax M3 為底座 — 36kr](https://eu.36kr.com/en/p/3972778519933444)
- [ByteDance $30B loan, Moonshot IPO — Recode China AI](https://www.recodechinaai.com/p/bytedances-30b-loan-moonshots-ipo)
- [Salesforce State of Agentic AI in the Enterprise](https://www.salesforce.com/in/news/stories/agentic-ai-leaders-survey-on-roi)
- [South Africa's data centre surge — ET CIOME](https://ciome.economictimes.indiatimes.com/news/cloud-computing/south-africas-data-centre-surge-raises-a-sharper-question-who-pays-for-africas-ai-build-out/133843456)
