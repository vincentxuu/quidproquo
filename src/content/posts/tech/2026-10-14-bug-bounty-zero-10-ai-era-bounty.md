---
title: "AI 產品的 Bug Bounty 怎麼算：Google、OpenAI、Anthropic、Meta 的收件範圍與獎金對照"
date: 2026-10-14
category: tech
type: guide
tags:
  - bug-bounty
  - security
  - ai-security
  - prompt-injection
  - owasp
lang: zh-TW
description: "拿到 LLM 或 AI agent 產品的 bug bounty 頁面時，怎麼判斷哪類問題收、哪類不收、大概值多少。逐條對照 Google、OpenAI、Anthropic、Meta 的官方頁面，每一格都標出處，查不到的寫未查證。"
tldr: "AI 產品的獎金頁多半不收「模型說了什麼」（越獄、幻覺、有害輸出），收「模型被叫去對別人做了什麼」（間接 prompt injection 造成的動作與資料外洩）和產品周邊的傳統漏洞。Google AI VRP 的基準獎金是 100 到 20,000 美元，OpenAI Safety Bug Bounty 每筆 250 到 7,500 美元。以上為 2026-10-14 查閱的版本。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 10
---

> 🌏 [English version](/posts/tech/2026-10-14-bug-bounty-zero-10-ai-era-bounty-en)

[上一篇](/posts/tech/2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing)講了可信執行環境，這一篇回到更常見的場景：目標是一個 LLM 產品或 AI agent，bug bounty 怎麼算？讀完你應該能做到一件事：拿到任何 AI 產品的獎金頁，判斷哪類問題收、哪類不收，以及大概落在哪個價位。

先給結論，後面逐條對證。我讀的頁面歸納成三堆，這個歸納是我的判斷：

1. **模型說了什麼**：越獄、有害內容、幻覺。四家的主計畫都不收，走另外的回報管道。
2. **模型被叫去對別人做了什麼**：外部內容夾帶指令，讓 agent 替受害者改資料、外洩資料。這是 AI 獎金頁真正付錢的新類別。
3. **AI 產品周邊的傳統軟體**：網頁、API、授權、瀏覽器擴充功能。照傳統漏洞的方式算，[第 3 篇](/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs)與[第 4 篇](/posts/tech/2026-10-13-bug-bounty-zero-04-what-is-rce)的東西全部適用。

分堆的理由，是我從各家條文讀出來的判斷，不是任何一家的原話。條文的依據在下面的表。所有規則與金額都是 2026-10-14 查閱的版本，各計畫變動很快，動手前請再看一次原頁。

## AI 目標跟傳統網站差在哪

傳統漏洞的判準很單純：你能不能讓系統做它不該做的事。LLM 多了一層麻煩：系統的行為取決於它讀到的文字，而文字可以來自任何人。

[OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)（2025 版）把這件事排在第一名。它對 [LLM01 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) 的定義是：使用者的提示以非預期的方式改變了 LLM 的行為或輸出。它分成兩種：直接注入是使用者自己輸入的提示改變模型行為；間接注入是模型讀到網站、檔案這類外部內容，內容裡的東西改變了模型行為。OWASP 同時說，越獄是 prompt injection 的一種形式，也就是讓模型完全無視安全規則。

OWASP 的分類是「技術上發生了什麼」，獎金頁問的是另一件事：**有沒有真人受害，以及有沒有跨過一道安全邊界**。所以同一個技術（prompt injection）在不同情境，可能一毛不給，也可能是整頁最高的獎金。下面這張表把 OWASP 的十個類別對到我讀到的獎金條文，沒有明文的標未查證。

| OWASP 類別（2025） | 在獎金頁讀到的對應 |
|---|---|
| LLM01 Prompt Injection | 間接注入造成動作或外洩，Google 與 OpenAI Safety 明文收；Meta 的 GenAI 頁規定注入本身不收，經連結資料源外洩受害者資料時改按存取私人使用者內容分流；只讓模型講怪話的，各家都不收 |
| LLM02 Sensitive Information Disclosure | 外洩受害者資料，Google 與 OpenAI Safety 收；Meta 範圍頁對訓練資料外洩有興趣，GenAI 頁把訓練資料的讀寫列為最高 $30k，外洩使用者私人內容最高 $130k |
| LLM03 Supply Chain | 未查證：我讀的頁面沒有對應條文 |
| LLM04 Data and Model Poisoning | 未查證：同上 |
| LLM05 Improper Output Handling | 未查證：同上 |
| LLM06 Excessive Agency | 沒有同名條文；OpenAI Safety 的 agentic 工具、Google 的 Rogue Actions 描述的是同一類現象（這是我的對應，不是頁面寫的） |
| LLM07 System Prompt Leakage | Google 明文不收（限內容不敏感時）；OpenAI Safety 與 Meta GenAI 頁明文不收，沒有附加敏感度條件 |
| LLM08 Vector and Embedding Weaknesses | 未查證：同上 |
| LLM09 Misinformation | 幻覺類，Google、OpenAI、Anthropic、Meta 明文不收 |
| LLM10 Unbounded Consumption | 最接近的是 DoS 條文：Google 只收跨使用者的持續性 DoS，Anthropic 與 Meta 把 DoS 列為範圍外 |

OWASP 這一欄我只逐條核對了 LLM01、LLM02、LLM07 的內文，其餘類別只確認了名稱與開頭的定義句。

## 對照表：問題類型、各計畫收不收、價位

表裡每一格都來自官方頁面明文，出處用代號標在格子裡，對照表在表後。**未查證**表示我讀到的頁面沒有提這件事，不等於不收，也不等於收。

先看「模型被叫去做事或洩漏東西」這一類：

| 問題類型 | Google AI VRP | OpenAI | Anthropic | Meta |
|---|---|---|---|---|
| 間接 prompt injection，讓 agent 替受害者改資料或動作 | 收，S1 Rogue Actions：旗艦 $20,000、標準 $15,000、其他 $10,000 [G] | Safety 的 Agentic Tools 收：P1 $5,500–$7,500，P4 $250–$500 [O2]；Security 的 Codex 段落：只有 prompt injection、沒有另一道安全邊界被突破，不收；但 ChatGPT 目標下的「Application-layer prompt injection mitigations」表示有興趣的是低互動、把使用者資料傳給第三方的合理攻擊鏈，須落在應用層，不接受模型本身緩解措施的報告 [O1] | 未查證 | prompt injection 單獨不收；prompt smuggling（第三方字串在 agent 眼中等同使用者或系統提示、穩定重現）最高 $5k，無人確認就觸發金流等特權動作最高 $20k [M2] |
| 外洩受害者的個資或敏感資料 | 收，S2 Sensitive Data Exfiltration：旗艦與標準 $15,000、其他 $10,000 [G] | Safety 收，與上一列同一張價表 [O2] | 未查證 | 最高 $130k*：洩漏使用者對話、連接器資料（信箱、行事曆）與個資，或第三方 OAuth token；經連結資料源的 prompt injection 外洩受害者資料，歸入這一類。需要不切實際的使用者互動的攻擊，目前不給獎金 [M2] |
| 萃取訓練資料、模型參數、推理過程 | 只收「完整、詳細、機密的模型參數」，A2 Model Theft：旗艦 $5,000、標準 $500；訓練語料幾乎都不算機密，不收 [G] | Safety 收「回傳完整未摘要的思維鏈」，同一張價表 [O2]；模型權重與訓練資料的學術研究，極少數情況可能給獎，論文寄 email [O1] | 未查證 | 範圍頁列為有興趣（以模型反推、萃取攻擊洩漏訓練資料）[M]；GenAI 頁的「存取內部 Meta 資料」最高 $30k*，例子含訓練資料讀寫、專有模型權重與架構 [M2] |
| 套出 system prompt | 內容不含敏感非公開資訊就不收 [G] | Safety：system prompt 與 context 內其他資訊（思維鏈除外）不收 [O2] | 未查證 | prompt injection 導致 system prompt 外洩，不收 [M2] |

再看「模型說了什麼」與「周邊」這一類：

| 問題類型 | Google AI VRP | OpenAI | Anthropic | Meta |
|---|---|---|---|---|
| 越獄、有害內容 | 不收，走產品內回報 [G] | Security 與 Safety 都不收、無獎金，改填 Model Behavior Feedback 表單；另有不定期的私下活動，例如生物風險內容 [O1][O2][O3] | 主計畫不收 [A1]；另有 Model Safety Bug Bounty，針對突破 Constitutional Classifiers 的新穎通用越獄，題目是生物威脅相關的有害問題，最高 $35,000，需申請並簽保密協議 [A2] | 單獨不收，除非串接另一個可獲獎的風險；內容回報走 llama_output_feedback 表單 [M][M2] |
| 幻覺、錯誤輸出 | 不收；錯誤輸出沒有可信的傷害路徑也不收 [G] | 不收 [O1] | 不收 [A1] | 不收：輸出事實錯誤或看似隨機，以及無法穩定重現的注入或越獄，即使串接可獲獎的風險也不收 [M2] |
| 在沙盒裡執行程式碼 | 不收（Gemini 本來就提供程式執行工具）[G] | 沙盒內不收；要主張 RCE 必須證明跳出沙盒 [O1] | 未查證 | 未查證 |
| AI 產品周邊的傳統漏洞（XSS、SQLi、授權缺陷） | AI VRP 頁面沒有給這類金額；Vertex AI 等雲端產品歸 Cloud VRP [G] | Security 收：API 與 ChatGPT 的 P1 $2,000–$6,500，P4 $200–$500 [O1] | 收：核心資產的 Critical $7,500–$10,000，非核心 $3,000–$5,000 [A1] | meta.ai 與 Meta AI 應用在範圍清單內，範圍頁寫有發獎金時最低 $500 [M]；GenAI 頁寫 AI 專屬問題最高 $130k*，其中 CSRF、XSS 的額外獎金依一般 payout guidelines 計算，傳統漏洞本身的金額我未查證 [M2] |
| 濫用與平台完整性（大量註冊、繞過限流） | A5 未授權使用功能：旗艦 $1,000、標準 $100；A6 跨使用者持續性 DoS：旗艦 $500、標準 $100 [G] | Safety 的 Account and Platform Integrity：同一張價表；限流繞過要證明至多 5 個帳號一天內 1,000 次完成 [O2] | DoS 列為範圍外 [A1] | DoS 列為範圍外 [M] |

出處對照：

- **[G]** [Google AI Vulnerability Reward Program Rules](https://bughunters.google.com/about/rules/google-friends/ai-vulnerability-reward-program-rules)
- **[O1]** [OpenAI Security Bug Bounty（Bugcrowd）](https://bugcrowd.com/engagements/openai)
- **[O2]** [OpenAI Safety Bug Bounty（Bugcrowd）](https://bugcrowd.com/engagements/openai-safety)
- **[O3]** [OpenAI 的 Safety Bug Bounty 公告](https://openai.com/index/safety-bug-bounty/)
- **[A1]** [Anthropic 的 HackerOne 計畫頁](https://hackerone.com/anthropic)
- **[A2]** [Claude Help Center 的 Model Safety Bug Bounty Program](https://support.claude.com/en/articles/12119250-model-safety-bug-bounty-program)
- **[M]** [Meta Bug Bounty 範圍頁](https://bugbounty.meta.com/scope/)
- **[M2]** [Meta GenAI payout guidelines](https://bugbounty.meta.com/payout-guidelines/meta-genai/)（Meta AI 專屬的獎金準則）

表中的 P1 到 P4 是 Bugcrowd 平台的嚴重度等級，P1 最嚴重。Meta 金額後面的星號是頁面原有的，頁面文字沒有解釋它的含義，我也沒能查證；該頁另列「緩解因素」，最後金額會從上限往下扣。Google 表中的「旗艦、標準、其他」是它自己的產品分級：旗艦包含 Google 搜尋、Gemini Apps 與 Gmail、Drive 等 Workspace 核心應用；標準包含 AI Studio、Jules 與 NotebookLM 等；其他是剩下的 AI 整合。

## 各家怎麼劃線

**Google** 的劃線用語最直白。不收的理由寫在條文裡：模型在「攻擊者自己的對話」裡產生違規、誤導或錯誤的內容，包含標準的越獄與幻覺。它還排除「受害者自己設定的 [MCP](https://modelcontextprotocol.io/) 伺服器造成的不安全互動」。收的範例則是受害者沒有確認的情況下被影響：間接 prompt injection 讓 Google Home 開門鎖，或讓助理摘要受害者的全部信件，寄到攻擊者的帳號。表格上的獎金是基準，品質好壞會乘上 0.8、1 或 1.2，特別新穎的報告另加 1,000 到 5,000 美元，最後金額由評審小組決定。

**OpenAI** 分成兩個計畫，而且會互相轉送：[Security Bug Bounty](https://bugcrowd.com/engagements/openai) 收傳統漏洞，Safety Bug Bounty 收 AI 特有的濫用。Safety 的 agentic 類別要求第三方文字能穩定劫持受害者的 agent；公告寫「至少 50% 的時間能重現」，Bugcrowd 規則頁則說可接受機率性的利用，但舉證責任在研究者。還有一條值得記住：測試用的注入文字不可以放在真實使用者或他們的 agent 找得到的公開地方。

OpenAI 的 Codex 段落把界線寫得最細，我認為這是整批頁面裡最有參考價值的一段：只是說服模型濫用它本來就有的權限，即使資料外洩、動作發生，也不算漏洞；要有另一個可證明的安全邊界缺陷（例如沙盒、瀏覽器同源政策、核准機制被繞過）才算。這類只涉及模型行為的報告，頁面指出可能適用另外的 Safety 計畫。Security 頁在 ChatGPT 目標下另有一條相反方向的規定：有興趣的是低互動、經由 prompt injection 把使用者資料傳給第三方的合理攻擊鏈，但必須落在應用層，與模型本身緩解措施有關的報告不收。所以「Security 計畫完全不收 prompt injection」並不準確，它收的是應用層的資料外流路徑。

**Anthropic** 的主計畫只收基礎設施與程式碼的漏洞，越獄、有害內容、幻覺明確列為範圍外。越獄另開專案：Help Center 那頁的目標是通用越獄，要通過它的 Constitutional Classifiers 防護，題目限定為生物威脅相關的有害問題（問題集只分享給通過申請的參與者），需要先申請，且要簽保密協議，所以不能公開討論細節。HackerOne 主頁還寫了：越獄特定模型家族的報告要投到另一個專屬計畫，其他模型的安全問題則是寄信附上可重現的細節；我沒有讀到那個專屬計畫的獎金條文，標為未查證。

**Meta** 的規則分在兩頁。[範圍頁](https://bugbounty.meta.com/scope/)的 Meta AI 段落很短：只對「Meta 大型語言模型的隱私與安全問題」有興趣，例如用模型反推或萃取攻擊洩漏訓練資料；功能問題、有風險的輸出、違反使用政策，各有另外的回報管道，不在獎金內。真正的獎金準則在範圍頁底部 Payout guidelines 索引下的 [Meta GenAI 專頁](https://bugbounty.meta.com/payout-guidelines/meta-genai/)，它處理 AI 產品與服務特有的問題，分四級：存取私人使用者內容最高 $130k*（含對話、連接器資料、第三方 OAuth token）、存取內部 Meta 資料最高 $30k*（含訓練資料、模型權重）、觸發特權或危險動作最高 $20k*、prompt smuggling 最高 $5k*。排除項寫得很直接：在另有可獲獎風險串接之前，prompt injection 與越獄都不收；注入導致 system prompt 外洩不收；經連結資料源（信件、行事曆、文件）的注入若外洩受害者資料，改按存取私人使用者內容分流；幻覺不收。所以 Meta 對「模型說了什麼」同樣不付錢，付錢的是受害者資料或特權動作。另外要澄清一個常見的混淆：頁面上的 30 萬美元屬於 WhatsApp Private Processing，是只限受邀、驗證可信執行環境的專案，不是 Meta AI 的獎金；細節在[第 0 篇](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check)。

## 價位區間：一張速查表

| 計畫 | 我讀到的單筆範圍 |
|---|---|
| Google AI VRP | 基準 $100 到 $20,000（「其他」層級的低階類別只給 credit）；品質係數 0.8 到 1.2，新穎性加碼 $1,000 到 $5,000 [G] |
| OpenAI Safety | P4 $250–$500 到 P1 $5,500–$7,500；頁面顯示近三個月平均發出 $812.50、累計 10 筆 [O2] |
| OpenAI Security | API 與 ChatGPT：P4 $200–$500 到 P1 $2,000–$6,500；Bugcrowd 頁 What's new 的公告（2025-03-26）把最高上限調到 $100,000（針對特別突出的 critical 發現）；近三個月平均 $1,091.11 [O1] |
| Anthropic 主計畫 | 依嚴重度 $100 到 $10,000 [A1] |
| Anthropic Model Safety | 針對生物威脅題庫的新穎通用越獄，每個最高 $35,000，依內部評分標準浮動 [A2] |
| Meta AI（GenAI 頁） | 最高 $130k*（存取私人使用者內容）；內部資料 $30k*、特權動作 $20k*、prompt smuggling $5k*，上限會依緩解因素下調 [M2] |
| Meta 其他 | 有發獎金時最低 $500；Private Processing 最高 $300K（受邀）[M] |

這些都是「單筆範圍」，不是你的期望值。頁面上的平均數遠低於上限，下一篇會講怎麼把它換算成值不值得花時間。

## 兩個真實案例怎麼對

本站的資安日報有兩個案例，可以拿來練習分類。

[Manus 案](/posts/daily/2026-10-03-security-manus-email-jsfuck-rce)：一封編碼過的信，讓 agent 在自己的雲端沙盒執行程式碼，進而取得使用者連結服務的 OAuth token。日報寫它已透過 Meta 的 bug bounty 修補。依上面的分堆，它是第 2 堆：外部內容驅使 agent 對受害者做事、外洩憑證，不是「模型講了怪話」。至於它在哪個計畫、領了多少，日報沒有寫金額，我也沒有查，這裡不推測。

[BragJack 案](/posts/daily/2026-09-17-security-bragjack-browser-ai-agent-hijack)：一個只有兩個常見權限的瀏覽器擴充功能，冒充受信任的來源去指揮瀏覽器內建的 AI agent。日報引用研究團隊的說法，這不是 prompt injection。依分堆它更接近第 3 堆：一道信任邊界被繞過，AI 只是被攻擊的對象之一。文字上最接近的，是 OpenAI Codex 段落所列的「冒充受信任的來源、擴充功能，或呼叫者」與「濫用瀏覽器到擴充功能之間的通訊」，這是我的類比，不代表那五家廠商實際用哪個條文付款。

兩個案例合起來的啟發：這兩類問題的共同點都是「跨過一道邊界」，而不是「模型的輸出很怪」。

## 拿到獎金頁，今晚可以做的四步

挑一個你有帳號的 AI 產品，打開它的獎金頁，依序問：

1. **範圍清單裡有沒有這個產品？** 沒有就停，這跟[第 1 篇](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope)的第一個問題一樣。
2. **頁面怎麼處理「模型內容」？** 找 out of scope 裡的 jailbreak、harmful content、hallucination。多數頁面會直接寫不收，也會指出另一個回報管道。
3. **有沒有一類是「別人的文字讓 agent 替受害者做事」？** 有的話，它多半是價位最高的 AI 類別（以本篇表中的 Google 與 OpenAI 為例）。要看清楚它對重現率、受害者確認、測試方式的要求。
4. **價位落在哪一層？** 先找頁面的獎金表，再看產品分級（旗艦或核心資產通常給得較高），最後看最低與最高的差距。

做完四步，把答案填進一張像上面那樣的表，查不到的格子寫「未查證」。這張表會比任何部落格的整理都更貼近你當下要打的目標。測試時一律用自己的測試帳號，不要碰真實使用者或他們的 agent，這是上面幾家頁面共同的底線。

下一篇是[報告怎麼寫、期望值怎麼算](/posts/tech/2026-10-14-bug-bounty-zero-11-reports-and-expected-value)。

## 限制與未查證

- 規則與金額是 2026-10-14 查閱的版本。Google 的頁面、Meta 的範圍頁與 GenAI 頁、OpenAI 公告是即時讀取；Bugcrowd 與 HackerOne 的頁面（OpenAI Security 標示最後更新 2026-08-19、Safety 標示 2026-08-07、Anthropic 政策標示 2026-09-28 更新，獎金表標示 2025-05-29 更新）讀到的是快取版本，可能落後原頁。
- 搜尋結果與新聞報導裡出現過「Google AI VRP 最高 3 萬」之類的數字，我在規則頁上找不到單一的「最高」數字，只有上表的基準、係數與加碼，所以本文不引用。
- Anthropic 對 prompt injection、system prompt 外洩、沙盒的處理，我讀到的頁面沒有明文，標為未查證；Meta 的沙盒內執行程式碼同樣沒找到明文。Meta GenAI 頁金額後的星號，頁面沒有解釋，我也沒查到；Meta 一般 payout guidelines 索引下的其他頁面我沒有讀。OpenAI 也有其他私下活動與表單，我沒有逐一展開。
- 本文不提供任何可直接套用的越獄或 prompt injection 內容，只講分類與規則。

## 參考資料

- [Google AI Vulnerability Reward Program Rules](https://bughunters.google.com/about/rules/google-friends/ai-vulnerability-reward-program-rules)（2026-10-14 查閱）
- [OpenAI Security Bug Bounty，Bugcrowd](https://bugcrowd.com/engagements/openai)（2026-10-14 查閱，快取版；$100,000 上限的 2025-03-26 公告在此頁的 What's new）
- [OpenAI Safety Bug Bounty，Bugcrowd](https://bugcrowd.com/engagements/openai-safety)（2026-10-14 查閱，快取版）
- [Introducing the OpenAI Safety Bug Bounty program](https://openai.com/index/safety-bug-bounty/)（OpenAI，2026-03-25）
- [Anthropic Bug Bounty Program，HackerOne](https://hackerone.com/anthropic)（2026-10-14 查閱，快取版）
- [Model Safety Bug Bounty Program，Claude Help Center](https://support.claude.com/en/articles/12119250-model-safety-bug-bounty-program)（2026-10-14 查閱，快取版）
- [Meta Bug Bounty 範圍頁](https://bugbounty.meta.com/scope/)（2026-10-14 查閱）
- [Meta GenAI payout guidelines](https://bugbounty.meta.com/payout-guidelines/meta-genai/)（2026-10-14 查閱）
- [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/llm-top-10/)
- [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OWASP LLM02:2025 Sensitive Information Disclosure](https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/)
- [OWASP LLM07:2025 System Prompt Leakage](https://genai.owasp.org/llmrisk/llm072025-system-prompt-leakage/)
- [資安警報：一封信接管 Manus AI Agent](/posts/daily/2026-10-03-security-manus-email-jsfuck-rce)（本站日報）
- [資安警報：BragJack](/posts/daily/2026-09-17-security-bragjack-browser-ai-agent-hijack)（本站日報）
