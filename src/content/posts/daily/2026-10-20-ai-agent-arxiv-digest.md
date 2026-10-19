---
title: "AI Agent Arxiv Digest — 2026-10-20"
date: 2026-10-20
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天三篇從指標、攻擊、架構三個層面檢視 Agent 的控制權到底有多穩——攻擊成功率低八成時候只是沒反應不是防住了,生產平台的授權機制能被誘導升級成後門,MCP 閘道的架構選擇直接決定安全與成本的取捨"
tldr: "Ignored, Not Refused 稽核 33,000 條軌跡發現 76-80% 的「防禦成功」其實是 agent 沒反應,換句系統提示詞就能讓 ASR 從 0.2% 跳到 43%;From Approval to Abuse 在 Claude Code 與 Codex CLI 上示範誘導 agent 要求過寬授權規則,58% 情境得手且 81% 能悄悄完成惡意任務;GatewayBench 用 11,118 個真實工具證明 MCP 閘道的扁平式設計在工具變多時 token 成本暴增 28 倍,分層式則在弱模型手上整個垂直攤"
series:
  name: "AI Agent Arxiv Digest"
  order: 149
---

> 🌏 [English version](/posts/daily/2026-10-20-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇把「agent 到底有沒有被管好」這件事,從三個不同層面拆開來看。《Ignored, Not Refused》先戳破整個領域常用的安全指標本身——攻擊成功率(ASR)低,76-80% 的時候其實只是 agent 沒反應過來,不是真的擋下了攻擊;只換一句系統提示詞,同一批模型的 ASR 就能從 0.2% 跳到 43%。《From Approval to Abuse》接著示範這個指標缺口怎麼被實際利用:在 Claude Code 與 Codex CLI 這兩個真的在用的生產平台上,埋在 repo 裡的惡意內容能誘導 agent 要求一條過度寬鬆的「以後不用再問」授權規則,使用者一旦核准,58% 的實驗情境裡攻擊者就拿到能悄悄完成任務的後門,完全不觸發後續的人工審核。《GatewayBench》則把視角拉高到 agent 跟外部工具之間的中介層:MCP 閘道要把工具攤平全部塞給 agent,還是分層讓 agent 自己查,這個架構選擇直接決定了安全跟效能的取捨——扁平式在工具變多時單輪 token 成本能從 8.3k 飆到 233.3k,分層式則在模型不夠強時整體任務成功率可能垂直下探。三篇合起來的提醒是:agent「被管住了」多半只是過關時的表面數字,真正的控制邊界,比大部分團隊想的更容易被繞過或壓垮。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Agent 執行鷹架(Harness) | 包著模型的程式框架——系統提示詞、工具呼叫、權限檢查、沙箱隔離都在這一層,不是模型本身 |
| 攻擊成功率(ASR) | 衡量 agent 安全性最常見的指標:惡意指令成功讓 agent 做壞事的比例;數字低通常被當成「防禦有效」 |
| 可重複使用的授權規則(Allow-rule) | 使用者核准一次「以後這類動作都不用再問」後,harness 記住的規則,之後同類動作不再觸發人工審核 |
| 間接提示注入(Indirect Prompt Injection) | 惡意指令不是使用者打的,而是藏在 agent 讀到的外部內容裡(網頁、檔案、repo 裡的檔案),趁 agent 處理任務時夾帶進去 |
| MCP 閘道(MCP Gateway) | 介於 agent 跟大量外部工具之間的中介層,負責把哪些工具、用什麼方式呈現給 agent,扁平式全部攤開、分層式讓 agent 自己查 |
| 扁平式 vs 分層式(Flattened vs Hierarchical) | 兩種 MCP 閘道設計:扁平式把所有工具定義一次塞進 agent 的上下文;分層式只給查詢用的「目錄工具」,agent 需要時再取出特定工具 |

---

## 論文一｜「忽略」不是「拒絕」:低攻擊成功率背後藏著什麼

**Ignored, Not Refused: What Low Prompt-Injection Success Rates Hide in Small Tool-Using Agents**
Farhan Zarif, Kazi Shahid Ahmed Galib, Synthia Akter Promi et al.(BRAC University)　·　arxiv: 2610.23254

連結: [arxiv](https://arxiv.org/abs/2610.23254) · [alphaxiv](https://www.alphaxiv.org/abs/2610.23254)

### TL;DR

稽核 33,000 條軌跡發現,業界常用的攻擊成功率(ASR)低,76-80% 的時候是 agent 根本沒反應過來,只有 17-18% 是真的識破並拒絕;同一批模型只換系統提示詞的九個字,ASR 就能從 0.2% 跳到 43%。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查) |
| 引用速度 | 發布 4 天,Semantic Scholar 兩次查詢皆回 429(rate limit),同批同日論文皆顯示 0 引用,應為一致模式 |
| 機構 | BRAC University(孟加拉) |
| 社群反應 | 未上 HuggingFace Daily Papers,未見 Papers with Code 條目 |
| 可信度 | 通過 — 33,000 條軌跡的 label-blind LLM judge 稽核,附人工驗證與統計檢定細節(Appendix D、E) |
| 證據成熟度 | 較完整 — 2 個標準 benchmark × 11 個模型 × 3 種精度 = 66 個 cell 全覆蓋,但只測 2-14B 小型開源模型 |
| 可復現性 | 部分產物 — 已公開標註語料、judge prompt 與分析程式碼(匿名評審版 repo),尚未掛名正式開源 |
| 為什麼選這篇 | 直接 — 直接挑戰整個領域拿來衡量 agent 安全性的核心指標 |
| 方向新意 | 實質增量 — 首次系統性拆解「ASR 低」到底是「防禦成功」還是「單純沒反應」 |
| 今日重要性 | 高 — 任何引用 ASR 做安全評測或選型決策的團隊都該重新檢視 |
| 實務連結 | 明確 — 直接影響 agent 安全評測方法論與產品上線前的安全驗收標準 |
| 編輯信心 | 高 — 數字具體、統計檢定完整,主張範圍限定在稽核的 11 個小型開源模型 |
| 閱讀建議 | 必讀 — 做 agent 安全評測、選型或寫安全驗收標準的人 |
| 主要限制 | 只測 2-14B 小型開源模型,未涵蓋前沿商用模型主力(Appendix F 僅少量前沿模型參照) |

### 領域背景

Agent 安全評測長期用「攻擊成功率」當成唯一的安全分數:ASR 低就被當成「防禦有效」。但這個指標有一個隱藏假設——每一次攻擊失敗都是因為 agent 識破了攻擊。沒有人去檢查,失敗到底是「拒絕」還是「根本沒反應」,兩者對使用者的意義完全不同。

### 中階導讀

- **問題**:想像一個保全站在門口,有人想闖進去但沒成功。你看到的只是「闖關失敗」這個結果,但背後可能是保全識破了來意把人擋下來,也可能保全根本在打瞌睡、那個人也沒真的用力推門。現有的 agent 安全評測,只看「有沒有闖關成功」這個數字,從來沒分辨過是哪一種。
- **方法**:作者讓一個不認識被評測模型家族的 judge 模型(DeepSeek-V4.1-Flash),在完全不知道分數與模型身分的情況下,讀完整段軌跡,把每次攻擊失敗標成六種結果之一:真的被識破拒絕、注意到了但沒處理、完全沒注意到、输出崩潰、部分配合、完全配合。接著用「Attack–Task Outcome Matrix(ATOM)」同時看兩件事:攻擊有沒有成功、使用者的任務有沒有完成——因為一個「安全」的 agent,如果連使用者本來要做的事都沒做好,也稱不上真的安全。
- **為什麼重要**:如果你的安全驗收標準只看 ASR 這一個數字,你可能根本不知道自己的 agent 是真的學會拒絕可疑指令,還是運氣好、或是太弱根本沒能力執行攻擊者要的動作——換一個更強的模型或換一套 harness,原本看起來安全的 ASR 數字可能瞬間翻盤。

### 深入要點

- 稽核結果:失敗攻擊裡 76-80% 是「忽略」(Inert,沒識破或識破了也沒處理),只有 17-18% 是「真的拒絕」(Genuine Refusal)
- 僅改系統提示詞(多九個字),InjecAgent 的 ASR 從基準 8.09% 衝到 Authorize 條件下的 43.05%,換成 Interdict 條件則壓到 0.22%
- 九個模型在配對檢定下顯著變動(McNemar test,p < 10⁻¹⁵),Spark-4B 從 0.95% 衝到 70.88%
- 三句話的明確護欄(182 字,比上面那九個字長)反而把 ASR 從 9.69% 壓到 0.95%,證明不是「提示詞變長就更危險」
- ATOM 矩陣顯示:在 16,273 條 AgentDojo 稽核軌跡裡,21.7% 是「安全但沒把事做完」——這種情境被標準 ASR 算成「防禦成功」,但使用者的任務根本沒完成
- 降低模型精度(FP8、NF4)只讓 ASR 小幅下降,原因是模型變笨、行動力下降,不是防禦力提升——拒絕率在不同精度下維持平坦
- Limitation:只測 2-14B 小型開源模型,前沿商用 agent(如生產級 Claude Code、GPT 系列)不在稽核樣本主體內

### Reviewer 一句話評

用 label-blind judge + 人工驗證拆解一個業界用了多年卻從沒被仔細檢查的指標假設,方法紮實且統計檢定齊全;但稽核樣本集中在小型開源模型,前沿商用 agent 是否也有類似的「忽略 vs 拒絕」落差,還需要額外驗證。

### 給你的 take-away

- 如果你在寫 agent 安全評測報告或驗收標準:別只報 ASR,同時報「攻擊是被拒絕還是被忽略」跟「使用者任務有沒有完成」,否則你可能把「運氣好沒出事」當成「真的安全」
- 如果你在比較不同模型或 harness 的安全性:先確認低 ASR 是不是來自模型能力不足導致的行動癱瘓,換一個更強的模型跑同樣的護欄設定,數字可能完全不一樣

---

## 論文二｜從「核准」到「濫用」:生產級 coding agent 的授權升級攻擊

**From Approval to Abuse: Privilege Escalation Attacks on Harness-Protected Coding Agents**
Xianglin Yang, Yechao Zhang, Jiahao Liu et al.(National University of Singapore;Nanyang Technological University;Ant Group)　·　arxiv: 2610.22987

連結: [arxiv](https://arxiv.org/abs/2610.22987) · [alphaxiv](https://www.alphaxiv.org/abs/2610.22987)

### TL;DR

在 Claude Code 與 Codex CLI 上,埋在 repo 裡的惡意內容能誘導 agent 在做日常任務時要求一條過度寬鬆的「以後不用再問」授權規則,58% 的實驗情境裡誘導成功,核准後 81.0% 能悄悄完成原本需要人工審核的惡意目標。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查) |
| 引用速度 | 發布 4 天,Semantic Scholar 確認 0 引用 |
| 機構 | National University of Singapore;Nanyang Technological University;Ant Group |
| 社群反應 | 未上 HuggingFace Daily Papers,未見 Papers with Code 條目 |
| 可信度 | 通過 — 4 種生產平台配置(Codex CLI × 2 模型、Claude Code × 2 模型)× 25 案例,附 Benign Control 與 Direct Request 兩個基準比較 |
| 證據成熟度 | 較完整 — 兩階段評測框架(授權取得／授權濫用)、完整消融與三個機制洞察,但每配置樣本量僅 25 案例,總計 100 個基本案例 |
| 可復現性 | 部分產物 — Appendix 提供完整 prompt、合成沙箱環境設置與 case schema,正文未見獨立程式碼庫連結 |
| 為什麼選這篇 | 直接 — 直接攻擊兩個目前被大量實際使用的生產級 coding agent 平台的核准機制本身 |
| 方向新意 | 實質增量 — 首次系統化「可重複使用授權規則」這個近期才普及的 UX 便利機制的攻擊面 |
| 今日重要性 | 高 — Claude Code、Codex CLI 是目前開發者高頻使用的工具 |
| 實務連結 | 明確 — 直接影響使用這些工具的開發者與組織的授權審查政策 |
| 編輯信心 | 高 — 數字具體(58%、56.9%、81.0%)且有基準線比較;實驗限定在合成沙箱環境,未涉及真實使用者系統 |
| 閱讀建議 | 必讀 — 使用 Claude Code / Codex CLI,或正在設計類似授權機制的人 |
| 主要限制 | 僅在合成沙箱環境測試(基於研究倫理考量,未在真實使用者系統上驗證),且僅涵蓋 4 種 agent 配置 |

### 領域背景

為了對抗提示注入,近期的 coding agent harness 普遍引入「執行前人工核准」機制——任何超出沙箱邊界的動作都要先問使用者。但逐次核准太煩,於是 Claude Code、Codex CLI 等平台都加了「核准一次、記住規則、以後同類動作不用再問」的設計。這篇論文問的是:這個為了減少「核准疲勞」而生的便利機制,本身會不會變成新的攻擊面?

### 中階導讀

- **問題**:想像你請一個新助理幫你整理倉庫,助理做到一半說「我需要用 curl 連網抓點資料,要不要我以後遇到 curl 指令都直接放行,不用每次問你?」你覺得合理就答應了。但如果這個「請求放行」的措辭,其實是倉庫裡藏的惡意說明文件教助理這樣問你的,你等於親手把門打開,而且是「永久打開」。
- **方法**:攻擊分兩階段。第一階段(Permission Acquisition)讓一個攻擊框架在倉庫裡植入看似合理的情境,誘導 agent 在執行一個正常任務(例如「跑一下這個倉庫」)時,主動向使用者請求一條語意盡量寬的「以後不用再問」規則;攻擊框架會用一個「評論型 LLM」讀 agent 的嘗試結果,不斷修正植入的誘導內容,直到規則被核准。第二階段(Authority Reuse)則在規則核准後,驗證攻擊者是否真的能用這條規則悄悄完成原本需要額外核准的惡意目標(未經授權讀取、資料外洩、檔案刪除、下載可疑產物、修改設定五類)。
- **為什麼重要**:這代表「使用者有核准、有人在把關」這件事,本身不保證安全——如果核准的「內容」本身就是被誘導出來的,人工審核這道防線在源頭就已經被繞過了,而且是一次核准、長期有效。

### 深入要點

- 跨 Codex CLI(gpt-5.6-luna、gpt-5.6-sol)與 Claude Code(claude-haiku-4.5、claude-sonnet-5)四種配置,誘導成功(Goal-reachable)比例平均達 58%(100 個基本案例中多數可行)
- 取得的授權規則「語意覆蓋範圍」(PCC)比直接命令式的提示注入基準(Direct Request)明顯更廣:例如 Codex(gpt-5.6-luna)從 0.25 衝到 0.57,對齊最嚴的 Claude(claude-sonnet-5)Goal Reachability 從 1/25 跳到 9/25
- 取得授權後的「語意覆蓋測試」顯示平均 56.9% 的同類能力測試案例都落在這條規則的覆蓋範圍內——規則比核准時使用者以為的範圍廣得多
- 條件在授權被核准的 58 個合格案例裡,47 個(81.0%)達成「驗證成功且完全不觸發額外核准提示」的靜默目標達成
- Mechanistic Insight:Codex 跟 Claude Code 的「寬鬆化」邏輯走不同軸線——Codex 沿行為歷史抽象(多次 wget 會被收斂成整條規則),Claude Code 沿語法字面抽象(不加引號的參數會被收斂成萬用字元規則),攻擊者必須針對不同 harness 調整誘導策略
- 另一個關鍵發現:「資料流依賴」比「敘事說服」有效得多——單純用故事說服 agent 某個動作重要,0/3 次成功;把動作做成「後續執行技術上依賴它」的阻斷點或正常輸入來源,3/3 次都成功
- Limitation:全程在合成沙箱環境進行(基於研究倫理考量),僅涵蓋 4 種 agent 配置,未驗證在真實使用者系統與更多模型組合上的一致性

### Reviewer 一句話評

把「核准疲勞」衍生出的便利機制,系統化地變成一條完整的攻擊鏈,並在兩個真的被大量使用的生產平台上驗證,數字具體且有清楚的基準比較;但受限於研究倫理,所有實驗都在合成沙箱完成,離真實部署情境的「最後一哩」驗證還留給後續工作。

### 給你的 take-away

- 如果你的團隊在用 Claude Code 或 Codex CLI,且習慣核准 agent 建議的「以後不用再問」規則:養成核准前檢視規則具體範圍的習慣,尤其當這個規則是在處理不熟悉的第三方 repo 時被提出的
- 如果你在設計類似的 harness 核准機制:這篇的三個 mechanistic insight(抽象軸線因系統而異、agent 跟著資料流而非敘事走、強模型會主動繞過路障)可以直接拿來重新設計授權規則的生成與呈現邏輯,而不是假設「使用者會看懂規則範圍」

---

## 論文三｜MCP 閘道怎麼設計,決定了 Agent 有多安全又多貴

**GatewayBench: Unified Capability and Security Evaluation Platform for MCP Gateways**
Yitian Zheng, Zhaorun Chen, Haoyu Li, Bo Li(Tsinghua University;University of Chicago;University of Illinois Urbana-Champaign)　·　arxiv: 2610.23449

連結: [arxiv](https://arxiv.org/abs/2610.23449) · [alphaxiv](https://www.alphaxiv.org/abs/2610.23449)

### TL;DR

用 524 個任務、11,118 個真實工具跟 7 個業界常見 MCP 閘道做系統性比較,發現扁平式閘道在工具變多時單輪 token 成本能從 8.3k 飆到 233.3k,分層式閘道則在模型不夠強時整體任務成功率可能垂直下探,而且安全差距主要來自工具層級的注入,不是環境層級。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint(未經同行審查) |
| 引用速度 | 發布 4 天,Semantic Scholar 確認 0 引用 |
| 機構 | Tsinghua University;University of Chicago;University of Illinois Urbana-Champaign(Bo Li 研究室) |
| 社群反應 | 未上 HuggingFace Daily Papers,未見 Papers with Code 條目 |
| 可信度 | 通過 — 524 任務橫跨六領域,11,118 個真實工具來自 251 個真實 MCP server,7 個業界實際部署的閘道實作,benign 與 adversarial 雙軌評測皆有 |
| 證據成熟度 | 較完整 — 大規模真實工具生態系 + capability/efficiency/security 三維度交叉實驗,但僅測試特定 harness(OpenAI Agents SDK、OpenClaw)與模型組合(GPT-5.1/5.4) |
| 可復現性 | 部分產物 — 任務資料集、工具池與評測指標說明完整,正文未見獨立程式碼庫連結 |
| 為什麼選這篇 | 直接 — MCP 閘道是 agent 規模化部署時幾乎必經的中介層,直接決定能力、效率、安全三者的取捨 |
| 方向新意 | 實質增量 — 首個系統性研究閘道架構設計本身如何影響 agent 行為的 benchmark |
| 今日重要性 | 高 — 隨 agent 規模化部署,閘道選型決策的影響範圍會迅速擴大 |
| 實務連結 | 明確 — 可直接轉化為閘道選型與架構設計的實務建議 |
| 編輯信心 | 高 — 大規模真實工具生態系實驗,數字具體且架構對比清楚 |
| 閱讀建議 | 必讀 — 正在設計或選擇 agent 工具接入架構的團隊 |
| 主要限制 | 僅測試少數 model/harness 組合,未知是否能推廣到其他主流 agent harness(例如 Claude Code 自身的工具呼叫機制) |

### 領域背景

MCP 已經變成 agent 接上外部工具的標準介面,但組織規模化部署後,往往要在 agent 跟成百上千個工具之間加一層「閘道」來做彙整與治理。問題是,業界冒出一堆閘道實作(扁平式、分層式),卻沒有人系統性研究過閘道的架構選擇本身,會怎麼影響 agent 的能力、效率跟安全——大家只顧著挑 agent 跟模型,卻忽略了這層中介本身就是變數。

### 中階導讀

- **問題**:想像一間公司幫新員工準備工具箱,有兩種做法:一種是把倉庫裡所有工具一次性全部搬到員工桌上,員工自己從幾千件工具裡翻找要用的;另一種是給員工一本工具目錄,員工要用什麼先查目錄、再去領。前者找工具慢而且桌子很快被佔滿(扁平式),後者多了一道查目錄的手續,但桌面一直保持乾淨(分層式)。哪種做法比較好,要看員工(模型)夠不夠熟練,也要看倉庫裡混進壞工具的機率。
- **方法**:作者把 MCP 閘道歸成兩大類——扁平式(把全部工具定義一次塞進 agent 的上下文)跟分層式(只給查詢用的「目錄工具」,agent 需要時再取出特定工具)。他們建了一個含 524 個任務、11,118 個真實工具(來自 251 個真實 MCP server)的 benchmark,刻意往每個任務環境裡灌入 0 到 1,500 個跟任務無關的「噪音工具」,模擬大規模部署下工具爆炸的情境,再分別測 benign 任務的完成率、惡意任務的攻擊成功率,以及 token 成本跟延遲。
- **為什麼重要**:這代表「選哪個 agent 模型」不是唯一重要的決策——閘道架構本身就是一個會左右安全跟成本的獨立變數,而且這個變數跟模型、harness 會互相放大或抵銷彼此的效果,不能只看其中一項就下結論。

### 深入要點

- 沒有噪音工具時,分層式閘道的平均間接攻擊成功率(ASRind)顯著低於扁平式(19.6% vs 60.5%、30.9% vs 47.2%、15.6% vs 42.5%,依不同 agent 配置),且在 GPT-5.4 這種能力夠強的模型下,安全提升幾乎不用付出能力代價(85.1% vs 87.2% 的任務成功率)
- 把噪音工具灌到 1,500 個時,扁平式閘道的 benign 任務成功率最多下滑 10.0 個百分點,分層式最多只掉 5.5 個百分點,在 GPT-5.4 下甚至完全不掉(85.1% → 85.6%)
- 安全差距主要來自「工具層級」的間接注入,不是「環境層級」:工具注入的攻擊成功率在扁平式隨噪音工具數從 51.5% 降到 40.6%,分層式則穩定維持在約 16% 左右,兩者差距在任何噪音工具數下都沒縮小;環境層級的注入則兩種架構表現相近,因為閘道管的是哪些工具進入上下文,管不了環境回傳的內容
- 成本差距更劇烈:GPT-5.4 下扁平式閘道的平均 token 成本從 8.3k 一路衝到 233.3k(1,500 個噪音工具時),分層式則只從 9.1k 微升到 12.6k
- 模型能力不足時,分層式閘道可能整個垂直攤:把模型從 GPT-5.4 降到 GPT-5.1,分層式架構的任務成功率平均掉 37.6 個百分點(扁平式只掉 11.9),其中一個分層閘道(enkrypt)在弱模型下從 86.7% 直接摔到 23.3%,因為模型沒辦法穩定走完分層查詢的步驟,反而開始呼叫幻覺出來的工具
- Limitation:僅測試 OpenAI Agents SDK 與 OpenClaw 兩種 harness、GPT-5.1/5.4 兩種模型強度組合,是否能推廣到 Claude Code 等其他主流 harness 的工具呼叫機制仍待驗證

### Reviewer 一句話評

用真實的大規模工具生態系統(而非合成玩具工具)系統性拆解閘道架構對能力、效率、安全三者的交互影響,發現的「安全差距來自工具層級而非環境層級」相當具體可操作;但測試的 harness 跟模型組合有限,閘道選型的結論能否直接套用到其他主流 agent 框架,還需要更多驗證。

### 給你的 take-away

- 如果你正在規劃企業內部的 agent 工具接入架構,且預期工具池會持續增長到數百上千個:優先評估分層式閘道,尤其當你用的模型本身能力夠強、能穩定走完多步查詢流程時,安全跟成本的優勢會同時出現
- 如果你已經在用某個模型能力偏弱的 agent 配置搭配分層式閘道:先用這篇的「弱模型 + 分層查詢步驟」失敗模式(呼叫幻覺工具)檢查你的系統是否也有類似的脆弱點,不要假設分層式架構天生比扁平式安全

---

## 今日收穫

之前以為「低攻擊成功率」代表 agent 真的學會了防禦、「使用者核准了授權規則」代表人在把關、「選對模型」就是 agent 部署安全與效能的關鍵決策——今天這三篇分別打破了這些假設:ASR 低八成時候只是 agent 沒反應過來,換個系統提示詞立刻現形;核准的內容本身可能就是被誘導出來的,人工審核這道防線在源頭就已經被繞過;而 agent 跟工具之間那層常被忽略的 MCP 閘道,其架構選擇本身就足以讓安全跟成本翻幾十倍。真正該問的問題,或許不是「這個 agent 安全嗎」,而是「我們用來判斷安全的那把尺,量到的到底是什麼」。

## 參考資料

- [Ignored, Not Refused: What Low Prompt-Injection Success Rates Hide in Small Tool-Using Agents — arXiv 2610.23254](https://arxiv.org/abs/2610.23254)
- [From Approval to Abuse: Privilege Escalation Attacks on Harness-Protected Coding Agents — arXiv 2610.22987](https://arxiv.org/abs/2610.22987)
- [GatewayBench: Unified Capability and Security Evaluation Platform for MCP Gateways — arXiv 2610.23449](https://arxiv.org/abs/2610.23449)
- [InjecAgent benchmark](https://arxiv.org/abs/2403.02691)
- [AgentDojo benchmark](https://arxiv.org/abs/2406.13352)
- [Model Context Protocol 官方介紹](https://modelcontextprotocol.io/)
- [arXiv cs.AI new submissions](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL new submissions](https://arxiv.org/list/cs.CL/new)
