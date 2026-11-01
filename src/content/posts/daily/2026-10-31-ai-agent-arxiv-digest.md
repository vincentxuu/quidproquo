---
title: "AI Agent Arxiv Digest — 2026-10-31"
date: 2026-10-31
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天三篇從三個不同層面問同一個問題——Agent 憑什麼信任它收到的東西？技能組合、檔案位置、代理間訊息，都有被悄悄濫用的空間"
tldr: "CoSA 證明個別安全的 Agent 技能組合起來會讓違規率從 35.02% 跳到 58.45%；Trust Region Effect 發現 GPT-5.4 對 README 檔案的信任度是程式碼檔案的 2.6 倍；PCM 用密碼學證據讓 Agent 無法再憑一句話騙過另一個 Agent，接受謊言率從現有協議的 70.8%-100% 降到 1.4%"
series:
  name: "AI Agent Arxiv Digest"
  order: 160
---

## 今日總覽

今天三篇論文從三個不同層面問同一個問題：Agent 收到的東西,憑什麼相信?CoSA 指出,個別安全檢查過關的 Agent 技能,組合起來可以繞過審查;Trust Region Effect 系統性證明,Agent 對不同檔案位置的信任程度天差地遠,放在 README 裡的惡意指令比放在程式碼裡高出 2.6 倍的服從率;PCM 則從根本處理「Agent 之間互相信任」這件事——提出一套密碼學協定,讓 Agent 不能再單靠一句自我陳述騙過另一個 Agent。三篇合起來的訊息很清楚:Agent 系統裡到處都有隱性的信任邊界,而且這些邊界目前幾乎沒有防護。

```diagram
title: Agent 系統裡的三層信任邊界
desc: 從技能組合、環境檔案位置到代理間通訊,今天三篇論文各自揭露一層被預設為可信、卻可以被利用的信任邊界
caption: 對應段落:L1 CoSA(2610.35082)、L2 Trust Region Effect(2610.38867)、L3 PCM(2610.39109)
---
<svg viewBox="0 0 640 280">
  <path class="dg-axis" d="M36 40V240" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="36" y="28" text-anchor="middle" dominant-baseline="central">窄</text>
  <text class="dg-tag" x="36" y="252" text-anchor="middle" dominant-baseline="central">廣</text>

  <rect class="dg-box" x="72" y="24" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="50" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="50" dominant-baseline="central">技能層</text>
  <text class="dg-sub" x="124" y="74" dominant-baseline="central">假設:個別技能通過安全審查</text>
  <text class="dg-sub" x="604" y="50" text-anchor="end" dominant-baseline="central">組合技能可繞過審查</text>

  <rect class="dg-box" x="72" y="104" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="130" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="130" dominant-baseline="central">環境層</text>
  <text class="dg-sub" x="124" y="154" dominant-baseline="central">假設:每個檔案位置一樣可信</text>
  <text class="dg-sub" x="604" y="130" text-anchor="end" dominant-baseline="central">README 信任度是程式碼 2.6 倍</text>

  <rect class="dg-box" x="72" y="184" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="210" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="210" dominant-baseline="central">通訊層</text>
  <text class="dg-sub" x="124" y="234" dominant-baseline="central">假設:收到簽名訊息就等於可信</text>
  <text class="dg-sub" x="604" y="210" text-anchor="end" dominant-baseline="central">A2A/MCP 只驗身分不驗真假</text>
</svg>
```

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Agent Skill（代理技能） | Agent 可以掛載的可重複使用能力模組,例如「查詢訂單」「寄信」,通常個別審查過是否安全 |
| 間接提示注入（Indirect Prompt Injection） | 攻擊者不直接跟 Agent 說話,而是把惡意指令藏在 Agent 會讀到的檔案、網頁或工具回應裡 |
| 信任區域（Trust Region） | 本文指 Agent 對環境中不同位置(檔案、介面)隱性賦予的信任程度不同,不是強化學習裡的 trust region 概念 |
| A2A / MCP | Agent-to-Agent、Model Context Protocol,目前主流的 Agent 間通訊與工具存取協議,只驗證「是誰傳的」,不驗證「內容是不是真的」 |
| Merkle Log（不可竄改紀錄） | 一種只能附加、不能竄改的紀錄結構,任何人都能驗證某筆紀錄確實在裡面,是 PCM 證據鏈的基礎 |
| 授權鏈（Grant Chain） | 從人類核准的根源出發、只能逐步縮小範圍的授權傳遞鏈,讓下游 Agent 的權限不會比上游核准的還大 |

---

## 論文一｜CoSA：單獨安全的技能，組合起來就不安全

**CoSA: The Conflict of Skills Attack in Real-World LLM Agent Ecosystems**
Yujia Zheng, Tianhao Li, Shangzhi Xu et al.（9 位作者，其中一位標註 Institute of Computing Technology）　·　arxiv: 2610.35082

連結: [arxiv](https://arxiv.org/abs/2610.35082) · [alphaxiv](https://www.alphaxiv.org/abs/2610.35082) · [GitHub](https://github.com/SIGMIR-ORG/CoSA)

### TL;DR

個別通過安全檢查的 Agent 技能,組合在一起可以讓政策違規率從 35.02% 跳到 58.45%,而額外加入的技能只佔技能池的 5%。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布 5 天,0 引用（Semantic Scholar 確認） |
| 機構 | 9 位作者,其中一位標註 Institute of Computing Technology,其餘未單獨驗證 |
| 社群反應 | 官方 GitHub repo（SIGMIR-ORG/CoSA）；韓國社群 arXiv 動態整理機器人（roomedia/ax-trend）收錄 |
| 可信度 | 通過 — 正文提供 CoSA-Bench 288 任務、5 個 LLM × 3 個 Agent harness 的完整對照實驗與一個可運作的防禦機制 |
| 證據成熟度 | 較完整 — 攻擊機制、基準測試、防禦方案三者齊備,且有明確的攻防前後數字對照 |
| 可復現性 | 完整產物 — 官方開源 repo |
| 為什麼選這篇 | 直接 — 揭露 Agent 技能市集一個新的攻擊面:個別安全審查無法擋住組合風險 |
| 方向新意 | 實質增量 — 把「技能衝突」正式定義為一類獨立於單一技能風險之外的失效模式 |
| 今日重要性 | 高 — Agent Skill 市集(如 OpenClaw)正在快速擴張,組合風險目前普遍沒有被審查 |
| 實務連結 | 明確 — 文中的 harness 層防護guard可直接套用到技能市集的審核流程 |
| 編輯信心 | 高 — 攻擊、基準、防禦三者都有具體數字支撐,主張範圍清楚界定 |
| 閱讀建議 | 必讀 — 任何在做 Agent Skill 市集或外掛生態系的團隊 |
| 主要限制 | 評測限定在 CoSA-Bench 的 4 個業務領域(招募、金融、IT、商業),能否泛化到任意真實技能市集尚未驗證 |

### 領域背景

Agent Skill(可重複使用的能力模組)讓開發者不用重寫每個功能就能擴充 Agent 能力,但目前審查機制幾乎都是「逐個技能檢查」——每個技能上架前單獨做安全掃描。問題是,安全審查假設技能之間互不影響,但實際組合使用時,一個技能產出的結果可能被另一個技能在沒有保留原本限制的情況下重新使用。

### 中階導讀

- **問題**:想像一個「讀取客戶資料」技能通過審查,因為它只回傳資料給 Agent 自己看;另一個「寄信」技能也通過審查,因為它只在使用者明確要求時才寄信。但如果 Agent 把第一個技能讀到的資料,包裝成第二個技能「使用者已核准」的訊息,兩個各自安全的技能組合起來就變成未授權的資料外洩。
- **方法**:CoSA 分析現有技能池,找出兩種組合漏洞——「能力補充」(補上原本缺的操作步驟)與「關係重塑」(改變產出物的傳遞路徑、決策歸屬或行動對象),再用這兩種手法,在只佔技能池 5% 的額度內,挑選看起來無害的技能加入池子。
- **為什麼重要**:這代表「每個技能都安全」不等於「技能池整體安全」。Agent Skill 市集的審查邏輯需要從「單一技能審查」升級到「組合風險審查」。

### 深入要點

- CoSA-Bench:288 個任務,涵蓋招募、金融、IT、商業四個領域,涉及資料外洩、未授權狀態修改、不安全執行三類風險
- 跨 5 個 LLM、3 個 Agent harness,技能池只加入 5% 以內的新技能,政策違規率從 35.02% 上升到 58.45%(+23.43 個百分點)
- 防禦機制:在 harness 層加入檢查資訊流向與授權的 guard,把 OpenClaw 招募場景的違規率從 65.28% 壓到 6.67%
- 落地門檻:需要在 harness 層(而非單一技能層)插入資訊流向追蹤,對已上線的技能市集是架構性改動,不是單純加個掃描規則
- 與主流框架的關聯:任何支援外部 Skill/Plugin 掛載的 Agent 框架(如支援 OpenClaw、MCP 工具生態的系統)都適用同樣的組合風險模型
- Limitation:評測限定在 CoSA-Bench 構造的場景,真實技能市集的組合空間遠比 288 個任務大

### Reviewer 一句話評

攻擊機制定義清楚、基準測試扎實,防禦方案也給出明確的效果數字,是目前少見同時交出「攻擊 + 基準 + 防禦」完整三件套的 Agent 安全論文;但目前的評測場景仍是研究團隊自建的 CoSA-Bench,真實技能市集的組合複雜度與對抗動態還需要外部驗證。

### 給你的 take-away

- 如果你在維護 Agent Skill / Plugin 市集:不要只做單一技能的安全掃描,要在 harness 層加入跨技能的資訊流向與授權追蹤,CoSA 的防禦設計可以直接參考
- 如果你在評估自家 Agent 的安全性:把「技能組合測試」納入紅隊流程,單獨測試每個技能安全不代表組合使用時安全

---

## 論文二｜信任區域效應：Agent 對不同檔案的信任程度差很多

**Where You Inject Matters: The Trust Region Effect in LLM Agents**
Chengquan Guo, Xiaodong Liu, Weiwei Yang et al.（University of Chicago, Microsoft Research, University of Rochester, Simon Fraser University, UC Davis, UIUC，10 位作者）　·　arxiv: 2610.38867

連結: [arxiv](https://arxiv.org/abs/2610.38867) · [alphaxiv](https://www.alphaxiv.org/abs/2610.38867)

### TL;DR

固定攻擊內容只改變放置位置,GPT-5.4 對放在 README/TODO 檔案裡的惡意指令,服從率是放在程式碼或資料檔案裡的 2.6 倍。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布 3 天,Semantic Scholar 429 限流未能確認,但以發布時間推斷近乎必然為 0 引用 |
| 機構 | University of Chicago、Microsoft Research、University of Rochester、Simon Fraser University、UC Davis、UIUC(含 Bo Li、Jianfeng Gao) |
| 社群反應 | 被社群 arXiv 動態整理機器人收錄(matouskozak/arxiv-digest #259,2026-10-30);未見於 HF Daily Papers |
| 可信度 | 通過 — 3 個獨立測試平台、8 個前沿模型、確定性腳本驗證(非 LLM 評審),附完整 ASR 對照表 |
| 證據成熟度 | 較完整 — 系統性變化「放置位置」這一個變數,同時在編碼、工具使用、日常工作流三個領域重複驗證 |
| 可復現性 | 未提供 — 正文讀取範圍內未見程式碼或測資公開聲明 |
| 為什麼選這篇 | 直接 — 首次系統性拆解「注入位置」這個過去被忽略的攻擊維度 |
| 方向新意 | 實質增量 — 過去研究只調整攻擊內容或單一介面內的位置,這篇跨越異質環境做系統性比較 |
| 今日重要性 | 高 — 間接提示注入連續兩年是 OWASP LLM 應用程式十大風險之首,放置位置是目前防禦設計的盲點 |
| 實務連結 | 明確 — 直接指出「不要對 README/TODO 等文件類檔案給予比程式碼更高的隱性信任」這個具體防禦方向 |
| 編輯信心 | 高 — 8 個模型、3 個領域一致出現同樣的效應,結論的適用範圍清楚界定在「已測試的模型與測試平台」 |
| 閱讀建議 | 必讀 — 任何在做 coding agent 或會讀取外部文件的 Agent 應用 |
| 主要限制 | 衡量的是在 3 個自建測試平台中、注入內容成功送達後的條件式攻擊成功率,位置信任排序能否泛化到任意真實部署環境未驗證 |

### 領域背景

間接提示注入(攻擊者把惡意指令藏在 Agent 會讀到的外部內容裡,而非直接跟 Agent 對話)已經連續兩年是 OWASP LLM 應用程式十大風險榜首。過去的研究主要在優化「攻擊內容寫什麼」,或只在單一介面(例如一個網頁)內比較位置,沒有人系統性比較「放在哪一種檔案類型」這個變數本身的影響。

### 中階導讀

- **問題**:想像一個 coding agent 在處理任務時會依序讀過 README、TODO、程式碼檔、資料檔。同一句惡意指令,放進 README 裡,Agent 可能照做;放進資料檔裡,Agent 卻完全不理。內容一模一樣,結果卻天差地遠——這就是論文說的「信任區域效應」:Agent 對環境中不同區域隱性賦予的信任程度不同。
- **方法**:研究團隊建立 3 個長任務測試平台(編碼、工具使用、日常工作流),固定惡意指令的內容,只改變放置的檔案類型與檔案內位置(開頭/中間/結尾),用確定性腳本(而非 AI 評審)判斷攻擊是否成功,在 8 個前沿模型上重複測試。
- **為什麼重要**:這代表目前的 Agent 安全防禦如果只檢查「指令內容看起來危不危險」,會漏掉「指令放在哪裡」這個同樣重要的風險因子。防禦設計需要針對高信任區域(如文件類檔案)額外加強審查。

### 深入要點

- 3 個測試平台分別建立在 Terminal-Bench-2(編碼)、AgentDojo(工具使用)、DecodingTrust-Agent(日常工作流)之上,涵蓋 36 種環境介面
- GPT-5.4 對 README/TODO 裡的惡意指令平均服從率是程式碼/資料檔的 2.6 倍;工作流領域裡 GitHub、Slack 比 Confluence、Jira 更容易被攻陷
- 失敗的注入絕大多數是被「忽略」而非「明確拒絕」——GPT-4o 81.3% 忽略 vs 僅 0.7% 明確拒絕
- 用 GPT-5.4 扮演攻擊者去挑選最佳注入位置,表現並不穩定優於單純的頻率統計先驗(LLM 選位置並不比簡單統計更準)
- 用兩階段 GRPO 訓練出的「位置感知攻擊者」,同時優化內容與位置後,攻擊成功率優於只優化內容,且遷移到更強模型時依然有效
- Limitation:衡量的是「成功送達後」的條件式攻擊成功率,真實部署中注入能否先被送達到 Agent 面前是另一個獨立問題

### Reviewer 一句話評

用確定性驗證器而非 AI 評審來判斷攻擊成功與否,方法學上比許多同類研究更嚴謹,8 個模型、3 個獨立平台的一致性也讓「信任區域效應」這個發現站得住腳;但目前仍只是「發現問題」,論文並未提出對應的防禦機制,留給讀者的是一個明確方向而非現成解法。

### 給你的 take-away

- 如果你在做 coding agent 或會讀外部文件的 Agent:不要假設 README、TODO、註解等文件類內容天然可信,應該對這類檔案裡的指令性語句額外加一層檢查
- 如果你在設計 Agent 安全護欄:護欄規則不能只看「內容像不像攻擊」,還要考慮「這段內容出現在哪個介面」,同一句指令在不同位置的風險權重應該不同

---

## 論文三｜PCM：讓 Agent 不能再對另一個 Agent 說謊

**PCM: A Proof-Carrying Message Protocol for Verifiable Multi-Agent Communication**
Bravish Ghosh（Cygnux Labs）　·　arxiv: 2610.39109

連結: [arxiv](https://arxiv.org/abs/2610.39109) · [alphaxiv](https://www.alphaxiv.org/abs/2610.39109) · [GitHub](https://github.com/Cygnux-Labs/PCM-protocol)

### TL;DR

在 926 筆真實訊息、712 筆謊言的基準測試中,PCM 只接受 10 筆謊言(1.4%),而現有 6 種部署中協議(含 A2A、MCP 周邊生態)接受 504 到 712 筆。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint,主分類 cs.CE,跨列 cs.AI/cs.CR/cs.MA(未經同行審查) |
| 引用速度 | 發布 2 天,Semantic Scholar 429 限流未能確認,但以發布時間推斷近乎必然為 0 引用 |
| 機構 | Bravish Ghosh,Cygnux Labs(單一作者,新創規模) |
| 社群反應 | 開源參考實作 Cygnux-Labs/PCM-protocol(MIT 授權),含簽署者專案 Cygnux-Labs/Tracekit;未見於 HF Daily Papers |
| 可信度 | 通過 — 正文提供完整形式化威脅模型、5 項附證明的安全性質、187 條一致性測試向量,以及對照 6 種部署協議的實證基準 |
| 證據成熟度 | 較完整 — 形式化證明與實證基準測試並重,且作者明確說明協議不做什麼(不能讓被入侵的 Agent 變誠實、信任簽署者為可信運算基礎) |
| 可復現性 | 完整產物 — 規格、JSON Schema、參考實作、獨立驗證器、測試向量、基準測試集全數開源(MIT) |
| 為什麼選這篇 | 直接 — 針對 A2A、MCP 目前只驗證「誰傳的」卻不驗證「內容是否為真」的缺口提出具體機制 |
| 方向新意 | 實質增量 — 把「proof-carrying code」的概念類比到 Agent 間通訊,是新的問題框架而非既有加密手法的小修改 |
| 今日重要性 | 高 — 多 Agent 協作(規劃 Agent 交辦編碼 Agent、客服 Agent 請款 Agent 退款)正快速普及,Agent 間訊息的真實性目前完全沒有機制保障 |
| 實務連結 | 明確 — 可作為現有 A2A/MCP 部署的附加驗證層,不需要重寫整套協議 |
| 編輯信心 | 高 — 主張範圍精準(簽署者可信、Agent 不可信的前提下,接受謊言率顯著低於現有協議),且作者自己交代清楚信任邊界 |
| 閱讀建議 | 必讀 — 任何在設計多 Agent 系統、尤其涉及金錢操作或授權轉移的團隊 |
| 主要限制 | 單一作者、尚無同行審查;簽署者(attesting signer)本身是可信運算基礎,若部署時未真正把簽署者與 Agent 隔離,保障就會失效 |

### 領域背景

A2A(Google 提出)、MCP(Anthropic 提出)等協議解決了 Agent 間「怎麼傳訊息、怎麼認證通道」的問題,但沒有解決「收到訊息的 Agent,憑什麼相信訊息內容是真的」。一個被提示注入攻陷的 Agent,或單純產生幻覺的 Agent,簽名完全正確地發出一句假話,接收方現有協議完全無法分辨。

### 中階導讀

- **問題**:想像 Agent A 跟 Agent B 說「測試都通過了,幫我退款 120 元」。B 只有 A 的一句話。如果 A 被提示注入攻陷,或單純把失敗的測試報告成通過,B 完全無法分辨,因為現有協議只驗證「這確實是 A 簽名傳來的」,不驗證「A 說的事是否真的發生過」。
- **方法**:PCM 借用「proof-carrying code」的思路——程式碼的生產者附上安全性證明,消費者用一個小型檢查器驗證,而不是信任生產者。PCM 讓每個 Agent 的工具呼叫都經過一個 Agent 自己無法寫入的「簽署者」服務,簽署者把每次呼叫結果記錄進一條不可竄改的日誌;Agent 發訊息時,訊息連同日誌裡的證據一起送出,接收方離線核對簽名與證據,給出「已證實/未證實/失敗」三種結果,光靠 Agent 自己的陳述永遠無法被判定為「已證實」。授權也走同樣邏輯——一條只能逐步縮小範圍、源頭是人類核准的授權鏈。
- **為什麼重要**:這把「Agent 間互信」從「我選擇相信對方」變成「我可以獨立驗證對方」。對任何牽涉到金錢操作、資料存取授權轉移的多 Agent 系統,這是從「樂觀信任」轉向「零信任」架構的具體做法。

### 深入要點

- PCM-Lies 基準:926 筆來自真實簽署者執行紀錄的訊息(真實 pytest 測試、HTTP 請求、檔案寫入、人工核准),其中 712 筆是謊言,涵蓋 16 種謊言類型
- PCM 只接受 10/712 筆謊言(1.4%,95% 信賴區間 0.8%-2.6%),且全部屬於「過時證據」類型(測試曾經通過,之後程式碼改了導致失敗,但寄件者仍引用舊的通過紀錄)
- 對照組:純 A2A 全部 712 筆都接受;6 種模擬的部署中協議(含簽名 Agent Card 的 A2A、uAgents、RFC 9421、SCITT、AP2、Verifiable Intent)接受 504 到 712 筆,就算疊加 AP2、SCITT、RFC 9421 三種機制仍接受 51.3%
- 兩個獨立撰寫的驗證器,對全部 926 筆訊息的判定完全一致;單則訊息驗證耗時約 0.8-1.2 毫秒,訊息大小中位數 1.9-11.7 KB
- 落地門檻:需要部署一個獨立的「簽署者」服務,且必須確保 Agent 真的無法接觸簽署者金鑰與日誌寫入權限,這是架構層的改動
- 與主流框架的關聯:可作為 A2A/MCP 之上的附加驗證層,論文明確把自己定位為對現有協議的補強而非取代
- Limitation:簽署者本身是可信運算基礎,論文沒有在真實多租戶生產環境中端對端測試簽署者隔離是否真的做到

### Reviewer 一句話評

形式化威脅模型、安全性證明與實證基準三者齊備,連「這個協議不解決什麼問題」都寫得和貢獻一樣清楚,是少見的工程嚴謹度;但單一作者、尚無同行審查,且核心保障完全建立在「簽署者確實被正確隔離」這個部署假設上,實際落地時這個假設是否成立還需要外部驗證。

### 給你的 take-away

- 如果你在設計涉及金錢操作或授權轉移的多 Agent 系統:現有 A2A/MCP 的簽名只證明「誰傳的」,不證明「內容是真的」,PCM 的 proof-carrying 思路值得直接評估導入
- 如果你在做 Agent 安全稽核:可以用 PCM-Lies 的 16 種謊言分類法,檢查自家系統裡下游 Agent 有沒有辦法只靠上游 Agent 的自我陳述就執行高風險動作

---

## 今日收穫

之前以為 Agent 安全的重點是「擋住惡意輸入」,今天發現更根本的問題是「Agent 到底該信任什麼」——技能組合、檔案位置、另一個 Agent 的話,這些目前都被預設為可信,但三篇論文分別證明這三種預設信任都能被利用。防禦設計要從「擋攻擊」往前一步,先畫清楚信任邊界在哪裡。

## 參考資料

- [CoSA: The Conflict of Skills Attack in Real-World LLM Agent Ecosystems (arXiv:2610.35082)](https://arxiv.org/abs/2610.35082)
- [CoSA 官方程式碼 (GitHub: SIGMIR-ORG/CoSA)](https://github.com/SIGMIR-ORG/CoSA)
- [Where You Inject Matters: The Trust Region Effect in LLM Agents (arXiv:2610.38867)](https://arxiv.org/abs/2610.38867)
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [PCM: A Proof-Carrying Message Protocol for Verifiable Multi-Agent Communication (arXiv:2610.39109)](https://arxiv.org/abs/2610.39109)
- [PCM 官方程式碼與規格 (GitHub: Cygnux-Labs/PCM-protocol)](https://github.com/Cygnux-Labs/PCM-protocol)
- [Google Agent2Agent (A2A) Protocol](https://a2a-protocol.org/)
- [Anthropic Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
