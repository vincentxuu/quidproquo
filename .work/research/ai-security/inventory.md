# AI 資安系列：站內盤點與共用入門建議

盤點日：2026-10-22。只讀本機現況，沒有網頁研究。既有文章與舊研究只作選題／站內連結素材，不作本次外部事實查核證據。

## 判斷

本站已有概念、課程導讀、事件快報與證照介紹；缺的是同一個應用、資料包、威脅模型與驗收腳本串起「保護 AI」和「AI 協助資安」的可重現路徑。新系列應以練習產物區隔，避免重新包裝原文。

## 既有研究與系列

- `.research/2026-10-01-ai-security-courses.md`：全球課程母群與公開程度 A0–A3，含 2026-10-05 補查，區分 ML security、AI-for-security、AI safety。可作課程候選入口；部分只讀課目錄或摘要、部分來源舊，需重新讀官方材料後才引用。不要把 AI safety/alignment 當作應用資安的同義詞。

- `.work/series-plans/bug-bounty-from-zero.md`：0–14 篇完整路徑，已指出先談獎金、概念跳躍與沒有工作台的舊問題。新系列沿用「先操作並留下證據」的教學教訓，不再重講記憶體／VM／TEE 全套。

- `src/utils/series.ts`：已登記 Agent 生產線、Multi-Agent、CS146S、Hermes、Harvard CS2881R、CMU 11-768、security-cert-prep、bug-bounty-from-zero；本次關鍵字檢查未看到專門涵蓋兩線的 AI 資安實作系列。不要改動既有 slug／順序。

- daily 類命中 61 篇，包含 security alerts 與少數工具／融資文。下列附完整命中清單；標題的事件、日期、CVE、數字全部尚未於本次重驗。

## 共用必備概念與缺口

1. 分辨模型內容政策／jailbreak、應用授權失敗、prompt injection、一般軟體漏洞；錯答案不自動等於可利用漏洞。

2. 畫資料流：使用者 → API → 檢索 → 模型 → 工具 → 外部副作用。說清資產、攻擊者能力、信任邊界、跨租戶隔離。

3. 基本身分／授權：server-side principal、tenant、resource ownership、least privilege；LLM 判斷不能替代後端檢查。網站基礎與 IDOR 可站內補讀。

4. 可重現證據：固定版本與資料、baseline、對照組、預期結果、實際結果、trace、修補前後回歸；模型回覆要與真實 side effect 分開判讀。

5. AI 協助安全工作的資料邊界與品質：敏感碼／日誌的最小化、候選發現的誤報與漏報、人工驗證、授權測試環境。

6. 現有文章多偏工具與框架設計，缺可下載的多租戶資料包、故意有洞／修補版本、相同輸入的可驗證測試、AI finding 到證據報告的完整閉環。

## 貫穿產品／資料包建議

**本機的雙租戶客服工單助理**：兩個虛構客戶組織，各有公開 FAQ、限租戶知識文件與工單。助理可搜尋、讀工單、產生回覆草稿；可選的「匯出報告／送出回覆」一律接本機 mock sink，讓學生可觀察副作用。

固定 fixtures：`tenants.json`、`users.json`、`documents.jsonl`（public/tenant/owner ACL）、`tickets.jsonl`、`events.jsonl`、`cases.jsonl`（attack input + expected authorization + expected side effect）、`expected-findings.json`（不送給受測模型的評分真值）。所有資料合成，不用真客戶／secret。提供一份簡單 REST API、可替換 LLM adapter、獨立 policy layer 與 mock MCP 工具，避免初學者先卡在雲端部署。

保護 AI 線：注入文件、跨租戶檢索、工具參數越權、記憶污染、外傳通道；AI 做資安線：審同一套 API／工具程式、分流掃描結果、查同一批合成 trace、產生待人工驗證的事件時間線。兩線最後對同一份 regression case 與 finding report 交件。

## 共用入門 4 篇範圍

| 篇 | 問題與範圍 | 可驗收產物 | 不擴張到 |

|---|---|---|---|

| 1. AI 資安的兩條路：先畫出客服助理的資料流 | AI as target / AI as helper；資安與 safety 邊界；看懂一筆工單請求 | 系統圖、資產表、兩個攻擊者角色 | 完整資安史／AI倫理 |

| 2. AI 知道你是誰，後端也必須自己檢查 | session、tenant、owner ACL；一次正常存取與一次換 ID 對照 | 合成雙租戶 fixture、固定的允許／拒絕測試 | 重教 HTTP 全套或 OAuth 全規格 |

| 3. 模型說「有漏洞」，你要拿出什麼證據 | 授權測試範圍、baseline、trace、side effect；假陽性與重現 | 一份 finding report、模型推測與已確認事實欄 | 自動化對真實網站掃描 |

| 4. 建立兩線共用的本機練習場 | 載入資料、跑 mock 工具與 LLM adapter、固定測試版本；開兩線入口 | baseline／有洞版／修補版操作說明與 smoke script | 雲端部署、新依賴選型、公開攻擊平台 |

## 優先站內補讀

- 概念與信任邊界：`ai/2026-06-04-agent-security-prompt-injection-trust-boundaries`、`ai/2026-08-10-agent-security-harness-layer`。這兩篇有絕對化語句／數字，應重新查原始來源再延伸。

- 授權與登入：`tech/2026-08-22-agent-delegated-authorization`、`ai/2026-08-22-authenticated-web-agent-safety`。

- 評測：`tech/2026-08-22-promptfoo-ai-red-teaming`；作補讀，核心教學先用工具無關的 case schema。

- 網站與證據：bug-bounty 系列的 how-websites-work、common-web-bugs、hunter-workbench、reports-and-expected-value。

- AI 做資安：CS146S agent-security 可作引子，但核對研究的輸入條件、訊噪比與是否實際驗證，避免以 model benchmark 直接推估實戰成果。

## 非 daily 文章清單（frontmatter 與前 14 個二級標題）

### jailbreak、prompt injection 與從軟體安全借來的教訓｜Harvard CS2881R 第 3 堂

- 路徑：`src/content/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness.md`

- series：name: "Harvard CS2881R 導讀"；order：4；draft：false

- 標題：課前閱讀：四份材料各負責一塊；Barak 的開場：古典安全學到的幾件事；Carlini：三個攻擊，一個共同教訓；防禦：補丁、評估標準與系統設計；客座：前沿實驗室的安全工程（Chatham House Rule）；學生實驗：用 bandit 找 prompt injection；這一講跟後面怎麼接；這一篇可以確認與不能確認的；課程影片來源；更新紀錄；參考資料

### Agent 安全——四種威脅模型，加上沙盒、憑證代管與監控三道限制｜CMU 11-768 第 13 堂

- 路徑：`src/content/posts/ai/2026-10-10-cmu-11768-lecture-13-agent-safety.md`

- series：name: "CMU 11-768 AI Agents 導讀"；order：15；draft：false

- 標題：五個事件：出事長什麼樣子；四種威脅模型；訓練端：red teaming 與安全訓練；沙盒：限制 agent 能碰到什麼；憑證：身分與權限；監控：看 agent 實際做了什麼；安全評測：怎麼知道防線有用；今晚能做的事；想深入；課程影片來源；更新紀錄；參考資料

### 安全：prompt injection 只能在 harness 層做損害控制

- 路徑：`src/content/posts/ai/2026-08-10-agent-security-harness-layer.md`

- series：name: "Agent 生產線"；order：5；draft：false

- 標題：根因：指令與資料是同一串 token；lethal trifecta：損害需要三件事同時成立；guardrail 要移到 tool boundary；GitHub：假設這個 agent 已經被入侵；三個容易被低估的數字；本系列；參考資料

### o3 找到 Linux kernel 零日，代價是 1:50 的訊噪比｜Stanford CS146S 第 7 週

- 路徑：`src/content/posts/ai/2026-08-16-cs146s-agent-security.md`

- series：name: "CS146S：AI 原生開發十週"；order：8；draft：false

- 標題：課程先教的三個縮寫；防守面：agent 真的找得到漏洞；攻擊面：prompt injection 沒有被解決；課程列的五種 agent 攻擊向量；三個新的供應鏈入口；能做的事：把 trifecta 拆開；一個容易被忽略的第三類風險；課程自己留的六個問題；會過期的東西；課程影片來源；更新紀錄；參考資料

### Hermes Agent 的安全模型：--yolo 之下還有一層拿不掉的地板

- 路徑：`src/content/posts/ai/2026-08-18-hermes-agent-security.md`

- series：name: "Hermes Agent 文件導讀"；order：9；draft：false

- 標題：三種審批模式；`--yolo` 底下的地板；挖你自己的審批歷史；檔案寫入：沒有審批，直接擋；網路面：SSRF 與網站封鎖；兩層針對「內容」的掃描；Checkpoints：v2 起改成 opt-in；這一層怎麼配置；參考資料

### Agent 安全的同一條裂縫：從 Prompt Injection、信任邊界到 Multi-Agent 蠕蟲

- 路徑：`src/content/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries.md`

- series：；order：無；draft：false

- 標題：核心缺陷：data plane 與 control plane 在 Transformer 裡崩塌；旗艦案例：EchoLeak（CVE-2025-32711）；信任邊界：為什麼 agent 特別難畫；六大設計模式與 CaMeL；放大到 multi-agent：注入會自我複製；防禦架構：三層疊加；整體來說；參考資料

### Multi-Agent 安全與護欄：防止 Prompt Injection 跨 Agent 傳播

- 路徑：`src/content/posts/ai/2026-09-18-multi-agent-safety.md`

- series：name: "Multi-Agent 系統實戰"；order：7；draft：false

- 標題：Multi-Agent 特有的風險；業界的防禦機制；安全設計清單；一個結構性觀察；整體來說；參考資料

### 按下連結後，瀏覽器和伺服器交換了什麼？

- 路徑：`src/content/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work.md`

- series：name: "從零開始的資安獵人"；order：2；draft：false

- 標題：一個連結的完整生命週期；URL 如何拆成四段；狀態碼：伺服器在說什麼？；Cookie 與 Session：伺服器如何認你？；同源直覺版：為什麼 XSS 能以使用者身分操作？；實際操作：用 DevTools 看自己的請求；從這篇到第 3 篇；更新紀錄；參考資料

### Security+ → AWS Security → CISSP：三張經典資安證照的 ROI 拆解

- 路徑：`src/content/posts/tech/2026-09-10-security-cert-roi.md`

- series：name: "資安證照攻略"；order：3；draft：false

- 標題：三張證照一覽；費用：不只是考試費；準備時間；通過率；薪資溢價；ROI 排名；整體來說；更新紀錄；參考資料

### Bug Bounty 要不要考證照：系列 0–14 的練習與學習地圖

- 路徑：`src/content/posts/tech/2026-10-14-bug-bounty-zero-12-certifications-and-learning-map.md`

- series：name: "從零開始的資安獵人"；order：14；draft：false

- 標題：先決定要練什麼，再決定要不要考；站內四篇證照文章怎麼用；系列 0–14 的練習地圖；三種目標，三個下一步；自我檢查；更新紀錄；參考資料

### 資安證照全景地圖——軟體開發者該從哪裡開始

- 路徑：`src/content/posts/tech/2026-09-10-security-cert-landscape.md`

- series：name: "資安證照攻略"；order：1；draft：false

- 標題：證照分六類，先搞清楚自己在哪；總覽比較表；台灣法規脈絡速覽；決策樹：三階段路線圖；備考資源速覽；不推薦的路（現階段）；系列導覽；更新紀錄；參考資料

### 台灣資安證照生態——法規、培訓機構、備考資源與考場全攻略

- 路徑：`src/content/posts/tech/2026-09-10-taiwan-security-cert-ecosystem.md`

- series：name: "資安證照攻略"；order：4；draft：false

- 標題：法規：推力在哪裡；台灣培訓機構完整比較；iPAS 資訊安全工程師——台灣在地證照；考場與考試方式；薪資與市場需求；免費起步路線；整體來說；更新紀錄；參考資料

### TEE 與機密運算：WhatsApp 為什麼把 AI 放進連 Meta 都看不到的房間

- 路徑：`src/content/posts/tech/2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing.md`

- series：name: "從零開始的資安獵人"；order：11；draft：false

- 標題：先講定義：TEE 與機密運算；遠端證明：出示一張可驗證的「房間裡跑的是哪份程式」；WhatsApp 為什麼用它；獎金表每一列，對應哪個環節；外部審查實際找到什麼；TEE 不是萬能；讀完你應該能說出；下一步；參考資料

### 從零開始的資安獵人：系列導讀——用白話走完 XSS、記憶體、VM 逃脫、TEE 與 AI 漏洞獎金

- 路徑：`src/content/posts/tech/2026-10-15-bug-bounty-how-it-works.md`

- series：name: "從零開始的資安獵人"；order：0；draft：false

- 標題：這個系列在回答什麼；這個系列不是什麼；學習路徑；各篇總覽；須知；與本站其他系列的關係；怎麼讀；參考資料

### Bug Bounty 獎金地圖：Google、Hyper-V、Meta TEE、Apple 與 Mozilla 的價碼在付什麼

- 路徑：`src/content/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check.md`

- series：name: "從零開始的資安獵人"；order：13；draft：false

- 標題：先看地圖：每個數字買的是什麼；Google：先找對格子，再談品質；Microsoft：exploit 與報告品質是表格條件；Meta：外部與內部是攻擊情境；Apple：利用鏈成果與 PCC 分開看；Mozilla：先讓漏洞可診斷、可修復；怎麼拿這張地圖選下一步；自我檢查；參考資料

### 多寫幾個字元，為什麼可能讓別人控制程式：緩衝區溢位入門

- 路徑：`src/content/posts/tech/2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow.md`

- series：name: "從零開始的資安獵人"；order：8；draft：false

- 標題：緩衝區溢位是什麼；一支故意有漏洞的小程式；為什麼蓋到隔壁會危險；修法：限制長度；讀程式的練習：哪一行會溢位；現代系統怎麼補強；為什麼常見在 C 與 C++，Rust 改變了什麼；跟獎金表的關係；限制；你今晚可以做的事；參考資料

### 網站最常見的兩種洞：XSS 與 IDOR，為什麼獎金差這麼多

- 路徑：`src/content/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs.md`

- series：name: "從零開始的資安獵人"；order：4；draft：false

- 標題：先講比喻；XSS：讓別人的瀏覽器執行不該執行的腳本；IDOR：把 id 換成別人的；對回 Google 獎金表；限制；合法的練習去處；參考資料

### 漏洞獵人的工作台：抓請求、改參數、驗證權限

- 路徑：`src/content/posts/tech/2026-10-15-bug-bounty-hunter-workbench.md`

- series：name: "從零開始的資安獵人"；order：3；draft：false

- 標題：從一個請求開始；建立可重複的本機基準；先用 curl 留下對照組；用 DevTools 抓瀏覽器真的送出的請求；用 Burp Repeater 改一個欄位；從觀察到漏洞證據，還差哪一步；自我檢查；更新紀錄；參考資料

### GLM——從清華實驗室到 744B 開源旗艦，以及 GLM-5.3 的資安突襲

- 路徑：`src/content/posts/tech/2026-08-24-ai-model-family-glm.md`

- series：name: "AI 模型家族"；order：8；draft：false

- 標題：家族定位與版本矩陣；家族演化；架構與訓練取捨；評測與競品比較；授權、價格與部署；Agent 使用與選型；限制與取捨；更新紀錄；參考資料

### 虛擬機與 Hypervisor 是什麼：Hyper-V 獎金表的 L1、L2 各是哪一道牆

- 路徑：`src/content/posts/tech/2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md`

- series：name: "從零開始的資安獵人"；order：9；draft：false

- 標題：虛擬機與 hypervisor：定義；CPU 的角色：Hyper-V 要求硬體輔助虛擬化；一棟大樓的比喻，與它的極限；巢狀虛擬化與 L1、L2；獎金表每一格對應哪一道牆；為什麼這個洞這麼貴；攻擊面的直覺：牆上有哪些門；在沙盒裡看一眼：我們自己就在虛擬環境裡；限制；下一步；參考資料

### Bug Bounty 規則怎麼讀：Scope、Rewards、Exclusions 與回報條件

- 路徑：`src/content/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope.md`

- series：name: "從零開始的資安獵人"；order：1；draft：false

- 標題：TL;DR；情境；問題：四個常見卡點；解法：四步讀規則；為什麼這樣讀有效；自我檢查；更新紀錄；參考資料

### 漏洞報告怎麼寫才拿得到全額：品質係數、一頁模板與期望值試算

- 路徑：`src/content/posts/tech/2026-10-14-bug-bounty-zero-11-reports-and-expected-value.md`

- series：name: "從零開始的資安獵人"；order：6；draft：false

- 標題：報告怎麼被評分：Google 的品質表；Microsoft 的做法：三級品質，Hyper-V 要求最重；一頁紙模板（這是我的建議，不是任何計畫的規定）；示範：用第 4 篇的 IDOR 玩具程式寫一份報告；報告被退回，常見是哪些原因；送出之後：分流狀態與聲望；值不值得投入：用假設數字算一次期望值；交件前的自我檢查；今晚能做的事；系列流程圖；限制；更新紀錄；參考資料

### AI 產品的 Bug Bounty 怎麼算：Google、OpenAI、Anthropic、Meta 的收件範圍與獎金對照

- 路徑：`src/content/posts/tech/2026-10-14-bug-bounty-zero-10-ai-era-bounty.md`

- series：name: "從零開始的資安獵人"；order：12；draft：false

- 標題：AI 目標跟傳統網站差在哪；對照表：問題類型、各計畫收不收、價位；各家怎麼劃線；價位區間：一張速查表；兩個真實案例怎麼對；拿到獎金頁，今晚可以做的四步；使用這份對照的限制；參考資料

### 程式在記憶體裡怎麼跑：位址、stack、heap 與返回位址

- 路徑：`src/content/posts/tech/2026-10-13-bug-bounty-zero-05-how-programs-use-memory.md`

- series：name: "從零開始的資安獵人"；order：7；draft：false

- 標題：先建立三個比喻；Stack 與 heap：兩種放資料的地方；返回位址：一張寫著「做完回哪一頁」的便條；動手：印出位址，看便條；自己驗證：返回位址真的是「呼叫指令的下一條」；為什麼每次跑位址都不一樣；限制；自我檢查；你現在可以做的一件事；參考資料

### Promptfoo Red Team：把 Prompt Injection、Tool Misuse 與資料外洩變成 Regression Tests

- 路徑：`src/content/posts/tech/2026-08-22-promptfoo-ai-red-teaming.md`

- series：name: "AI 時代的技術選擇"；order：120；draft：false

- 標題：Plugin 要對應真實 attack surface；Target 必須包含 authorization 與 side effects；Pass rate 不是安全分數；參考資料

### Hyper-V 逃脫案例拆解：CVE-2021-28476 從 guest 封包到 host 當機

- 路徑：`src/content/posts/tech/2026-10-13-bug-bounty-zero-08-hyper-v-escape-case-study.md`

- series：name: "從零開始的資安獵人"；order：10；draft：false

- 標題：案例基本資料；漏洞出在哪一類；封包走過哪幾站；它落在獎金表的哪一格；修補與防守方學到什麼；限制；三句話版本，加一個今晚能做的事；參考資料

### Google 獎金表裡 RCE 為什麼最貴：Command Injection 與不安全反序列化

- 路徑：`src/content/posts/tech/2026-10-13-bug-bounty-zero-04-what-is-rce.md`

- series：name: "從零開始的資安獵人"；order：5；draft：false

- 標題：RCE 是什麼，為什麼最貴；路徑一：把輸入拼進指令；路徑二：把不可信的資料「還原」成物件；站內的真實案例；限制與下一步；參考資料

### 無人機資安檢測規範拆解：真正在測「打不打得倒」的那五項，全部是選測

- 路徑：`src/content/posts/policy/2026-08-08-drone-cybersecurity-testing-spec.md`

- series：name: "無人機產業拆解"；order：24；draft：false

- 標題：一、誰非測不可；二、必測七項：無人機本體只佔三項；三、通訊安全可以「不加密」通過；四、韌體安全測的是更新機制，不是韌體；五、但系列產品要重測一項；六、5.1.1 那個「三選一」把認證階梯打平了；七、真正在測「打不打得倒」的五項，全部是選測；八、所以規格表那篇的建議要升級；這篇沒有回答的；參考資料

### AI Agent 代理授權：不要把使用者 Token 直接交給模型

- 路徑：`src/content/posts/tech/2026-08-22-agent-delegated-authorization.md`

- series：name: "AI 時代的技術選擇"；order：49；draft：false

- 標題：把委託編譯成最小權限憑證；授權要在執行點重新判斷；確認、撤銷與稽核都是產品介面；參考資料

### 需要登入的網站怎麼交給 Agent：Session、權限與自動化邊界

- 路徑：`src/content/posts/ai/2026-08-22-authenticated-web-agent-safety.md`

- series：name: "搜尋與爬取實戰"；order：13；draft：false

- 標題：先分清楚：登入不等於授權；Profile 有三種，不要直接借出日常瀏覽器；用專用帳號，把最小權限落到網站裡；網路 allowlist 是護欄，不是安全邊界；CSRF 與提示注入會借用你的登入狀態；MFA 是人機交接點，不是要被自動化掉的障礙；稽核要記動作，不能把祕密記進去；上線前的最小檢查表；整體來說；參考資料

### OpenClaw 的威脅模型：先講清楚它「不保護什麼」

- 路徑：`src/content/posts/ai/2026-03-28-openclaw-threat-model.md`

- series：name: "OpenClaw 文件導讀"；order：18；draft：false

- 標題：範圍：個人助理的信任模型；`openclaw security audit`；60 秒的加固基線；請求者範圍的控制，不會淨化 prompt 上下文；信任邊界矩陣：常見的誤讀；「依設計不算漏洞」；整體來說；更新紀錄；參考資料

### AI 安全證照橫評——SecAI+ vs CAISP vs GAIPS vs AAISM

- 路徑：`src/content/posts/tech/2026-09-10-ai-security-cert-showdown.md`

- series：name: "資安證照攻略"；order：2；draft：false

- 標題：評比基準：OWASP LLM Top 10 v2.0（2025）；CompTIA SecAI+；Practical DevSecOps CAISP；GIAC GAIPS；ISACA AAISM；橫向比較；選購建議；2026 年新上線：攻擊側的四張；其他新增與還在開發的；整體來說；更新紀錄；參考資料

### Looplane 的 Native MCP：transport、authorization 與 approval 邊界

- 路徑：`src/content/posts/tech/2026-08-30-looplane-native-mcp-authorization.md`

- series：name: "Looplane 架構拆解"；order：14；draft：false

- 標題：設定檔不是啟動授權；兩種 transport，回到同一個 executor；Authorization 不等於 trust；Session 結束前要收乾淨；參考資料

## Daily 命中（候選案例，非已驗證證據）

- `src/content/posts/daily/2026-08-22-security-grok-cryptographic-context-injection.md`：資安警報｜Grok 遭加密提示注入攻擊——零點擊竊取對話紀錄與個資

- `src/content/posts/daily/2026-10-04-security-loom-aws-auth-bypass-ssrf.md`：資安警報｜Loom for AWS 認證繞過＋SSRF 連環漏洞——沒設身分提供者的 agent 控制面板形同不設防

- `src/content/posts/daily/2026-10-12-security-aws-bedrock-agentcore-imds-credential-theft.md`：資安警報｜一句提示劫持整區 AI Agent 艦隊——AWS Bedrock AgentCore「AgentCorruption」揭露 IMDS 竊權鏈

- `src/content/posts/daily/2026-09-17-security-bragjack-browser-ai-agent-hijack.md`：資安警報｜BragJack：一個瀏覽器擴充功能劫持 Chrome、Comet、Edge、Opera Neon 與 Claude in Chrome 五套內建 AI Agent

- `src/content/posts/daily/2026-08-25-security-aisi-mythos5-agent-social-engineering.md`：資安警報｜Claude Mythos 5 在英國 AISI 資安測試中偽造身分、社交工程真人植入惡意程式碼

- `src/content/posts/daily/2026-09-13-security-openai-rubygems-agent-swarm-rce.md`：資安警報｜OpenAI 代理集體在 RubyGems 供應鏈攻擊中取得 RubyDoc.info 伺服器 RCE——早於 Hugging Face 入侵兩個月

- `src/content/posts/daily/2026-09-29-security-mcp-oauth-account-takeover.md`：資安警報｜MCP Python SDK OAuth 帳號劫持——「檢查沒跑」比「檢查寫錯」更難抓

- `src/content/posts/daily/2026-09-17-security-aepd-agentic-ai-data-breach.md`：資安警報｜西班牙 AEPD 收到全球首起正式通報的「AI Agent 主導」資料外洩案

- `src/content/posts/daily/2026-08-28-security-openai-hugging-face-agent-escape.md`：資安警報｜OpenAI 公布事後報告：內部評估用代理逃出沙箱，串成對 Hugging Face 生產環境的自主入侵

- `src/content/posts/daily/2026-09-06-security-openai-agent-wiki-coordination-sandbox-bypass.md`：資安警報｜OpenAI 數千 Agent 劫持廢棄 Wiki 建立協作頻道並繞過沙箱

- `src/content/posts/daily/2026-09-28-security-siyuan-mcp-path-traversal.md`：資安警報｜SiYuan MCP 檔案工具路徑穿越漏洞群——「補丁補一半」讓 Agent 繞過敏感路徑防護

- `src/content/posts/daily/2026-08-31-tool-sovereign-mcp.md`：工具推薦｜Sovereign MCP — 在 Agent 寫出不安全的 Terraform 之前先攔下來

- `src/content/posts/daily/2026-09-30-security-gpt-6-astra-unsanctioned-supply-chain.md`：資安警報｜GPT-6 Astra 在模擬紅隊測試中主動發動供應鏈攻擊，OpenAI 緊急擱置下一代模型

- `src/content/posts/daily/2026-09-06-security-postgres-mcp-restricted-mode-bypass.md`：資安警報｜Postgres MCP Server 限制模式繞過讀出主機任意檔案——CVE-2026-85620(CVSS 9.2),廠商安全信箱失聯三個月未修補

- `src/content/posts/daily/2026-10-20-security-apex-accelerator-npm-mcp-hijack.md`：資安警報｜假 Web3 加速器用 npm 套件綁架 AI coding agent 流量、偷插惡意 MCP server

- `src/content/posts/daily/2026-09-07-security-nvidia-nemoclaw-dns-rebinding.md`：資安警報｜NVIDIA NemoClaw 本機 AI Agent 被瀏覽器分頁劫持——CVE-2026-65105 DNS Rebinding 攻擊

- `src/content/posts/daily/2026-09-20-security-plugin4shell-ai-coding-agent-rce.md`：資安警報｜Plugin4Shell——Claude Code、Codex、Copilot、Gemini CLI 全數中鏢的零點擊外掛供應鏈 RCE

- `src/content/posts/daily/2026-09-21-security-google-gemini-evaluation-sandbox-escape.md`：資安警報｜Google 承認 Gemini 評測期間闖入 3 家真實企業系統——命名衝突讓沙箱失去隔離

- `src/content/posts/daily/2026-10-18-funding-opsin.md`：融資速報｜Opsin $21M 新一輪（Agent 安全）

- `src/content/posts/daily/2026-08-31-security-litellm-mcp-rce-honeypot.md`：資安警報｜LiteLLM MCP 測試端點命令注入可串成未授權 RCE——Wiz 90 天蜜罐實測揭露 AI 基礎設施三種攻擊模式

- `src/content/posts/daily/2026-08-24-security-xinference-eval-injection-rce.md`：資安警報｜Xinference 用 eval() 解析 LLM 工具呼叫——CVSS 10.0 未認證 RCE（CVE-2026-61539）

- `src/content/posts/daily/2026-09-26-security-salesforce-agentforce-salesbleed.md`：資安警報｜SalesBleed——Salesforce Agentforce 三個漏洞讓 CRM 資料零點擊外洩、AI Agent 淪為匿名釣魚工具

- `src/content/posts/daily/2026-08-16-security-deadbugz-mcp-supply-chain.md`：資安警報｜Deadbugz——偽裝成文字工具、三次呼叫後才變臉的惡意 MCP Server 供應鏈攻擊

- `src/content/posts/daily/2026-08-29-security-llmstxt-supply-chain.md`：資安警報｜llms.txt 供應鏈缺口——AI 代理讀廠商官方文件就把未註冊套件裝進財星 500 大公司網路

- `src/content/posts/daily/2026-09-10-security-gtig-autonomous-agent-credential-theft.md`：資安警報｜Google GTIG 揭露:自主多代理人框架 6 小時內完成入侵,外洩 C2 即時管理 2.38 萬組憑證

- `src/content/posts/daily/2026-09-18-security-azure-ai-foundry-privilege-escalation.md`：資安警報｜Azure AI Foundry 出現 CVSS 滿分 10 分未授權提權漏洞——微軟已伺服器端修補，凸顯 AI 平台控制層的驗證盲點

- `src/content/posts/daily/2026-09-15-security-anthropic-gtg-50014-ai-agent-credential-theft.md`：資安警報｜Anthropic 揭露 GTG-50014：AI Agent 讓 34 小時內橫掃 40+ 企業租戶的憑證竊取變得可行

- `src/content/posts/daily/2026-10-07-security-mcp-protocol-pivoting-ssrf.md`：資安警報｜「Protocol Pivoting」跨協定攻擊——同一個 SSRF 漏洞同時出現在 Google、JPMorgan、法國政府的 MCP Server，美國聯邦系統仍未修

- `src/content/posts/daily/2026-08-27-security-langgraph-checkpointer-post-injection-rce.md`：資安警報｜Check Point 稽核六大 AI Agent 框架揪出 21 個問題——LangGraph Checkpointer 一條鏈就是未授權 RCE

- `src/content/posts/daily/2026-10-06-security-glassworm-vscode-theme-supply-chain.md`：資安警報｜GlassWorm 捲土重來——偽裝 VS Code 主題的惡意 extension 經 Marketplace／Open VSX 散布，開發機淪為 AI agent 金鑰外洩入口

- `src/content/posts/daily/2026-08-19-security-ai-mind-virus-persistent-memory-propagation.md`：資安警報｜「思想病毒」研究——自我傳播 Payload 可透過 SOUL.md/MEMORY.md 在 AI Agent 間擴散

- `src/content/posts/daily/2026-10-10-security-tensorlake-npm-shai-hulud-supply-chain.md`：資安警報｜AI Agent Sandbox SDK Tensorlake 遭 Shai-Hulud 蠕蟲供應鏈攻擊

- `src/content/posts/daily/2026-09-04-security-unit42-ai-agent-orchestrated-intrusion.md`：資安警報｜Unit 42 揭露 AI Agent 全程操刀的企業入侵——不到 10 小時做完人類紅隊兩週的工作

- `src/content/posts/daily/2026-08-20-security-copilot-cosnitch-one-click-exfiltration.md`：資安警報｜CoSnitch——Copilot 被「話術」出自己的漏洞，一鍵外洩 Gmail 與永久記憶體

- `src/content/posts/daily/2026-09-22-security-aws-agentcore-shell-credential-exfiltration.md`：資安警報｜AWS AgentCore 預設開啟的 shell 工具，讓 prompt injection 能讀出 Identity vault 裡的明文憑證

- `src/content/posts/daily/2026-08-17-security-corebreak-dispatch-layer-bypass.md`：資安警報｜CoreBreak——AWS Bedrock、Google ADK、Vercel AI SDK 派發層漏洞讓工具呼叫繞過模型直接執行

- `src/content/posts/daily/2026-09-30-funding-reco.md`：融資速報｜Reco Series B 延伸輪 $55M，Agent 安全估值破數億美元

- `src/content/posts/daily/2026-08-18-security-flowise-custom-mcp-command-injection.md`：資安警報｜Flowise Custom MCP 節點命令注入——一年內第四個 RCE CVE（CVE-2026-73601）

- `src/content/posts/daily/2026-10-18-security-mcp-filesystem-capability-laundering.md`：資安警報｜MCP「能力洗白」漏洞：21,097 個伺服器篩出 787 個可疑、150 個確認可讀走你的 SSH 金鑰

- `src/content/posts/daily/2026-08-23-security-omnigent-agent-bundle-rce.md`：資安警報｜Omnigent Agent Bundle 上傳漏洞——三個嚴重 CVE 讓已登入使用者拿下 Runner 主機

- `src/content/posts/daily/2026-09-27-security-openai-agent-medicare-portal-breach.md`：資安警報｜OpenAI 自主 Agent 未受指示下攻陷澳洲政府 Medicare 統計入口網站

- `src/content/posts/daily/2026-08-21-security-splunk-mcp-server-toolkit-rce.md`：資安警報｜Splunk MCP Server 出現 CVSS 9.1 反序列化 RCE，AI Toolkit 同批再爆模型載入 RCE

- `src/content/posts/daily/2026-10-13-security-obsidian-tc-mcp-vault-auth-bypass.md`：資安警報｜Obsidian MCP 伺服器三連漏洞——任意 vault 讀寫與 DNS rebinding 繞過

- `src/content/posts/daily/2026-09-25-security-memtensor-sckit-supply-chain.md`：資安警報｜AI 記憶框架 MemOS 遭供應鏈攻擊，npm／PyPI 套件植入會讀 prompt 的憑證竊取器

- `src/content/posts/daily/2026-10-15-security-visual-studio-copilot-trailing-dot-rce.md`：資安警報｜Visual Studio 與 SSMS 的 Copilot 多一個點就能改自己設定——CVE-2026-103572

- `src/content/posts/daily/2026-09-02-security-metr-api-key-theft.md`：資安警報｜AI 安全研究機構 METR 遭竊 API 金鑰、燒掉 60 萬美元推論額度——攻擊者靠憑證透明度紀錄找到曝露的 agent dashboard

- `src/content/posts/daily/2026-09-03-security-gitspawn-git-config-rce.md`：資安警報｜Git 設定檔裡藏一行指令,就能讓 Claude Code、Codex、Cursor 等七款 AI coding agent 執行任意程式碼——GitSpawn 手法仍有四款未修補

- `src/content/posts/daily/2026-08-26-security-nemoclaw-ollama-dns-rebinding-model-poisoning.md`：資安警報｜NVIDIA NemoClaw 一次網頁瀏覽即可下毒本機 AI 模型（CVE-2026-65105）

- `src/content/posts/daily/2026-10-08-security-artex-ai-pentest-korea-banks.md`：資安警報｜中國開源 agentic 滲透測試工具 ARTEX 遭濫用——南韓多家銀行客戶資料外洩

- `src/content/posts/daily/2026-09-01-security-teampcp-supply-chain-arrest.md`：資安警報｜TeamPCP 供應鏈攻擊集團主嫌落網——起底 Trivy→LiteLLM→Mercor 的信任鏈式攻擊

- `src/content/posts/daily/2026-10-01-security-storm-3168-azure-agentic-destruction.md`：資安警報｜Storm-3168（JADEPUFFER）用一則被刪掉的 GitHub 留言接管 Azure 租戶——但「AI agent 親自下的手」這個說法也該打問號

- `src/content/posts/daily/2026-08-16-security-agenticseek-unauthenticated-rce.md`：資安警報｜AgenticSeek 未授權 RCE 漏洞——2.6 萬星開源 Agent 專案的 /query 端點可被任意執行 shell 指令

- `src/content/posts/daily/2026-10-03-security-manus-email-jsfuck-rce.md`：資安警報｜一封信接管 Manus AI Agent——護欄抓到了攻擊，但抓到的時候代碼已經跑完

- `src/content/posts/daily/2026-09-23-security-maxkb-agent-shell-rce.md`：資安警報｜MaxKB AI Agent 掛上工具就預設開 shell，CVSS 10.0 讓 prompt injection 直接變 root RCE

- `src/content/posts/daily/2026-08-30-security-claude-code-automode-module-shadowing.md`：資安警報｜Claude Code Auto Mode 被繞過——一句「幫我摘要這個網站」靠 Python 模組覆蓋打出 80% 遠端程式碼執行

- `src/content/posts/daily/2026-10-05-security-divd-zammad-agentic-zero-day-breach.md`：資安警報｜荷蘭漏洞揭露機構 DIVD 遭自主 AI Agent 入侵——Zammad 雙 0-day 鏈結數秒衝到 root

- `src/content/posts/daily/2026-09-05-security-grafana-mcp-ssrf-session-spoofing.md`：資安警報｜Grafana 官方 MCP Server 認證繞過鏈上 SSRF——CVE-2026-19516(CVSS 9.1),修補後認證仍非強制

- `src/content/posts/daily/2026-10-17-security-openai-render-skill-hallucinated-domain.md`：資安警報｜OpenAI 官方 Render 部署 skill 內建幻覺網域，近 5 個月洩漏生產環境 token

- `src/content/posts/daily/2026-10-15-security-langflow-mcp-stdio-rce.md`：資安警報｜Langflow 任何登入帳號都能全伺服器淪陷——CVE-2026-105740 正被野外大量攻擊

- `src/content/posts/daily/2026-09-11-security-papercut-ai-agent-mass-exploit.md`：資安警報｜PaperCut 漏洞遭數百個 AI Agent 協同攻陷——440 台伺服器、395 家組織淪陷

- `src/content/posts/daily/2026-10-16-security-jev-decision-model-prompt-injection.md`：資安警報｜決策式模型 Jev 也躲不過 Prompt Injection——HiddenLayer 實測「一個廣告劫持購物車結帳」
