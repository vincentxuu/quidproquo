---
title: "AI Agent Arxiv Digest — 2026-10-27"
date: 2026-10-27
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天三篇從文字、系統、內容三個不同層面戳破同一個假設——模型本身沒問題，不代表整條 agent 鏈路值得信任"
tldr: "一個生產系統裡句句為真的工具輸出文字，讓 agent 和負責把關的 verifier 一起被誤導，格式修正後 90/90 verifier 判決直接翻盤；同一個 GPT 模型裝進科學研究用的 agent harness，PAIR 攻擊成功率能從 2% 跳到 60%，證明安全測試測的是模型不是系統；一張看起來普通的 email 簽名圖片能用隱寫術偷渡指令，但只要在工具解碼的那一瞬間綁定不可信標籤，攻擊成功率就能從 100% 壓到 0%"
series:
  name: "AI Agent Arxiv Digest"
  order: 156
---

> 🌏 [English version](/posts/daily/2026-10-27-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文從三個不同層面戳破同一個假設——「agent 本身沒問題，系統就是安全的」。文字層面：一個生產系統裡的工具輸出文字句句為真，卻靠著省略關鍵資訊,同時把 agent 和負責把關的 verifier 一起騙過去。系統層面：同一個語言模型一旦被裝進特定領域的 agent harness,原本測不穿的攻擊忽然打穿防線——安全測試測的是模型,不是真正部署的系統。內容層面：一張看起來普通的 email 簽名圖片,能用隱寫術把指令藏進像素,文字過濾器完全看不到,卻在被工具解碼的那一刻變成指令。三篇合起來說的是同一件事:「模型安全」跟「系統安全」是兩件不同的事,真正該檢查的是整條鏈路上「誰在相信誰」,而不是只測模型本身。

```diagram
title: 三種信任漏洞，三種不同成因
desc: 文字、系統、內容三個層面各自有一個「表面看起來沒問題」的訊號，但實際驗證後都藏著落差——這三種漏洞的成因彼此不同，不是同一個問題的三個例子。
caption: 簡化示意：上排是表面訊號，下排（標色）是今天三篇論文各自揭露或擋下的「被誤信的那一刻」。
---
<svg viewBox="0 0 640 420">
  <rect class="dg-box" x="14" y="30" width="196" height="40" rx="6"/>
  <text class="dg-tag" x="112" y="50" text-anchor="middle" dominant-baseline="central">Tool 輸出的文字</text>

  <rect class="dg-box" x="222" y="30" width="196" height="40" rx="6"/>
  <text class="dg-tag" x="320" y="50" text-anchor="middle" dominant-baseline="central">科學 Agent Harness</text>

  <rect class="dg-box" x="430" y="30" width="196" height="40" rx="6"/>
  <text class="dg-tag" x="528" y="50" text-anchor="middle" dominant-baseline="central">MCP 解碼出的內容</text>

  <rect class="dg-box dg-box--link" x="14" y="85" width="196" height="95" rx="6"/>
  <text class="dg-label" x="112" y="117" text-anchor="middle" dominant-baseline="central">格式正確，句句為真</text>
  <text class="dg-sub" x="112" y="139" text-anchor="middle" dominant-baseline="central">「找到 20 份」沒說還有</text>
  <text class="dg-sub" x="112" y="157" text-anchor="middle" dominant-baseline="central">4752 份沒列出來</text>

  <rect class="dg-box dg-box--accent" x="14" y="195" width="196" height="95" rx="6"/>
  <text class="dg-label" x="112" y="227" text-anchor="middle" dominant-baseline="central">Verifier 90/90 翻盤</text>
  <text class="dg-sub" x="112" y="249" text-anchor="middle" dominant-baseline="central">補上揭露文字後</text>
  <text class="dg-sub" x="112" y="267" text-anchor="middle" dominant-baseline="central">接受全變成拒絕</text>

  <rect class="dg-box dg-box--link" x="222" y="85" width="196" height="95" rx="6"/>
  <text class="dg-label" x="320" y="117" text-anchor="middle" dominant-baseline="central">Base model 測過關</text>
  <text class="dg-sub" x="320" y="139" text-anchor="middle" dominant-baseline="central">同一個 GPT 模型</text>
  <text class="dg-sub" x="320" y="157" text-anchor="middle" dominant-baseline="central">直接攻擊成功率僅 2%</text>

  <rect class="dg-box dg-box--accent" x="222" y="195" width="196" height="95" rx="6"/>
  <text class="dg-label" x="320" y="227" text-anchor="middle" dominant-baseline="central">換上 Harness 後</text>
  <text class="dg-sub" x="320" y="249" text-anchor="middle" dominant-baseline="central">PAIR 攻擊成功率</text>
  <text class="dg-sub" x="320" y="267" text-anchor="middle" dominant-baseline="central">跳到 38–60%</text>

  <rect class="dg-box dg-box--link" x="430" y="85" width="196" height="95" rx="6"/>
  <text class="dg-label" x="528" y="117" text-anchor="middle" dominant-baseline="central">看似普通的簽名圖</text>
  <text class="dg-sub" x="528" y="139" text-anchor="middle" dominant-baseline="central">隱寫術藏指令</text>
  <text class="dg-sub" x="528" y="157" text-anchor="middle" dominant-baseline="central">文字掃描器看不到</text>

  <rect class="dg-box dg-box--accent" x="430" y="195" width="196" height="95" rx="6"/>
  <text class="dg-label" x="528" y="227" text-anchor="middle" dominant-baseline="central">解碼瞬間綁定標籤</text>
  <text class="dg-sub" x="528" y="249" text-anchor="middle" dominant-baseline="central">攻擊成功率</text>
  <text class="dg-sub" x="528" y="267" text-anchor="middle" dominant-baseline="central">100% 降到 0%</text>

  <line class="dg-rule" x1="14" y1="310" x2="626" y2="310"/>
  <text class="dg-tag" x="14" y="334" dominant-baseline="central">圖例</text>
  <text class="dg-small" x="14" y="358" dominant-baseline="central">上排＝表面看起來沒問題的訊號；下排（標色）＝今天三篇各自揭露或擋下的「被誤信的那一刻」</text>
  <text class="dg-small" x="14" y="380" dominant-baseline="central">三種漏洞分別發生在文字、系統、內容層面，成因彼此不同，詳見各篇「編輯判斷」與「深入要點」</text>
</svg>
```

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Tool Output Formatter（工具輸出格式化器） | 把工具內部執行結果轉換成模型讀到的文字的那一層程式碼；工具本身算對了，格式化器仍可能把話說得不完整 |
| Verifier（驗證者） | 負責檢查 agent 答案是否有依據的另一個模型，通常只能看到跟 agent 一樣的工具輸出文字，沒有獨立管道核對原始資料 |
| Agent Harness（代理鷹架） | 包著語言模型的提示詞與工具調用框架；同一個模型換一個 harness，能接觸的工具、情境與多步互動方式都會改變 |
| ASR（攻擊成功率） | 對抗攻擊讓模型產生有害輸出的比例；ASR 從 2% 跳到 60% 代表原本幾乎測不穿的防線大幅鬆動 |
| 隱寫術（Steganography） | 把資訊藏進圖片像素或檔案中繼資料裡，肉眼與文字掃描器都看不出差異，只有特定解碼步驟才能還原 |
| Provenance Label（來源標籤） | 標記一段資料「可信」或「不可信」的來源追蹤機制；關鍵在標籤什麼時候打上、由誰打上，而不是只看標籤本身 |

---

## 論文一｜工具沒說謊，但 agent 跟裁判一起被唬了

**Who Verifies the Tools? How Warped Formatters Mislead Agents and Their Verifiers**
William Jeffries（獨立研究者）　·　arxiv: 2610.32110

連結: [arxiv](https://arxiv.org/abs/2610.32110) · [alphaxiv](https://www.alphaxiv.org/abs/2610.32110)

### TL;DR

一個生產中的歷史文件檢索系統裡，工具回報「找到 20 份文件」句句為真，卻沒說實際還有 4,752 份沒列出來；作者用配對實驗證明，把這種「warped」格式修正成清楚揭露範圍與完整度後，agent 的過度宣稱大幅下降，verifier 對同一批錯誤答案的判決從 90/90 次「接受」直接翻盤成 90/90 次「拒絕」。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | NeurIPS 2026 workshop poster（「Who Verifies the Agents?」, non-archival） |
| 引用速度 | 發布 4 天（2026-10-23 提交），Semantic Scholar RATE_LIMITED 無法查詢；workshop poster 預期尚無引用資料 |
| 機構 | 獨立研究者（無機構掛名） |
| 社群反應 | GitHub 公開完整實驗產物；對 OpenClaw 的修復 PR 已被維護者合併；對 Hermes 的修復 PR 截稿時仍待處理 |
| 可信度 | 通過 — 1,200 次 agent run（3 模型家族）的配對因果實驗，90/90 verifier 判決翻盤，雙 grader 一致率 96%，grading 規則先凍結再看結果 |
| 證據成熟度 | 較完整 — 生產事故重現加配對因果實驗加三模型複現加開源可重跑產物，但案例是從已知缺陷中對抗性選取 |
| 可復現性 | 完整產物 — GitHub 公開 frozen manifest、claim sheets、recorded answers 與完整 audit prompt |
| 為什麼選這篇 | 直接 — 直接點出「agent 和 verifier 都只能看到工具吐出的文字」這個目前幾乎沒人系統性量化過的共同盲點 |
| 方向新意 | 實質增量 — 首次用配對因果實驗把「格式化層的省略」跟「agent 與 verifier 雙方同時被誤導」直接連起來量化 |
| 今日重要性 | 高 — 多數團隊只測模型輸出對不對，很少檢查工具輸出的文字本身有沒有省略關鍵範圍或總數 |
| 實務連結 | 明確 — 論文給出四類具體缺陷（範圍／完整度／不確定性／來源標示）與可直接套用的揭露文字清單 |
| 編輯信心 | 高 — 「警告格式缺陷會系統性誤導 agent 與其 verifier，即使每句話都為真」有配對因果實驗直接支持 |
| 閱讀建議 | 必讀 — 任何有工具調用層的生產 agent 系統 |
| 主要限制 | 案例為對抗性挑選自已知生產缺陷，測不出這類缺陷在一般系統中的實際發生率 |

### 領域背景

Agent 評測大多檢查「模型給出的答案是否正確」，卻很少反過來檢查「工具回報給模型的文字，是否完整反映了工具實際做了什麼」。ReAct、Toolformer 到 AgentBench 這類評測框架，都把工具輸出當成環境的一部分直接採信，沒有去問這段文字本身是否誠實揭露了它的邊界。

### 中階導讀

- **問題**：想像你請一個研究助理去檔案館查某一年的資料，它回來說「找到 20 份文件」，你可能以為這就是全部——但檔案館其實有 4,772 份符合條件，助理只是用了預設的分頁上限，從沒說「這只是前 20 份」。
- **方法**：作者從一個真實上線系統裡的四類缺陷（範圍省略、完整度省略、不確定性未標記、來源編號混淆）各挑 10 個案例，凍結兩個版本的工具輸出文字——一個是生產環境實際用過的「warped」版、一個是補齊揭露資訊的「clear」版，讓三個模型家族各答 5 次、再讓三個獨立 verifier 分別判斷答案是否有依據。
- **為什麼重要**：關鍵發現是「verifier 看到的資訊跟 agent 一樣少」——只要工具輸出沒講清楚，verifier 就沒辦法靠自己的判斷力補回那個缺口；但只要把同一組事實用清楚的文字重新表達,同一批原本被接受的錯誤答案就被 90/90 次全部打回。

### 深入要點

- 警告式範圍缺陷（scope）：工具搜尋一份文件前 100 萬字元，超過範圍就沒搜到，卻只在搜到時才標注限制，搜不到時說「已搜尋完整文字」
- 警告式完整度缺陷（completeness）：某年份實際有 4,772 份文件，工具只抓前 20 份就回報「找到 20 份」，字字為真卻讓人誤以為是全部
- Warped 版下 agent 過度宣稱率：範圍 100%、完整度 62%、不確定性 100%、來源標示 94%；clear 版降到 8%、0%、20%、94%（來源標示這一類光靠文字修正救不回來，需要靠型別或驗證機制）
- Fixed-answer 測量下，三個 verifier 對同一批 30 個虛假答案的判決，warped 版 30/30 全部接受，clear 版 30/30 全部拒絕，三類總計 90/90 次翻盤 ⚠️（這個因果對照測的是「文字本身造成的差異」，不是「agent 真的答錯了多少次」的發生率估計）
- 作者把同一套 audit prompt 餵給 Codex 與 Claude Code 去審查自己系統的原始碼，重新發現了仍存在的缺陷並多揪出 12 個未編目的新案例；餵給開源系統 OpenClaw 與 Hermes 時，各找到一個真實的 warped formatter，OpenClaw 那個修復 PR 已被維護者合併（openclaw/openclaw#131702）
- 落地門檻：不需要重寫整個驗證系統，先檢查自己工具輸出的措辭是否講清楚「搜了多少」「總共有多少」「這是估計值還是確定值」「這個編號屬於哪個命名空間」，文中附完整 audit prompt 可直接套用

### Reviewer 一句話評

用真實生產事故出發、再用配對因果實驗把現象量化，而且真的促成一個上游專案合併修復，這種從實務問題走到可驗證結論再回到實務影響的閉環很難得；但樣本是從已知缺陷對抗性挑選的，論文誠實承認測不出這類缺陷在一般系統裡的真實發生率。

### 給你的 take-away

- 如果你的 agent 系統有工具調用層：找 5 分鐘把每個工具輸出的措辭讀一遍，檢查是否講清楚範圍、總數、是否為估計值、識別碼屬於哪個命名空間——這篇附的 audit prompt 可以直接丟給你的 coding agent 跑一次
- 如果你的系統有 LLM-as-judge 做驗證：記住 verifier 預設只看得到跟 agent 一樣的文字，它不會自動補回工具格式化層漏講的事，驗證邏輯要單獨檢查這一層

---

## 論文二｜模型本身測過安全，不代表裝進 Agent 之後還安全

**Do AI-for-Science Agents Preserve Model Safety?**
Michael Yew Chuan Lee, Manya Sriram, N. Benjamin Erichson（DSO National Laboratories + UC Berkeley + ICSI/Berkeley Lab）　·　arxiv: 2610.32045

連結: [arxiv](https://arxiv.org/abs/2610.32045) · [alphaxiv](https://www.alphaxiv.org/abs/2610.32045)

### TL;DR

固定同一個 GPT 模型只換成 5 種真實科學研究 agent harness（CACTUS/ChemToolAgent/STELLA/Biomni/DrugAgent），對 50 筆有害化學請求測安全性：直接請求下 DrugAgent 把 GPT-5.2 的攻擊成功率從 2% 推到 72%；adaptive 攻擊下，GPT-5.5 原本只有 2% 攻擊成功率，裝進任一 harness 後跳到 38–60%。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | NeurIPS 2026 workshop paper（「Third Workshop on Agents in the Wild: Safety, Security, and Beyond」） |
| 引用速度 | 發布 4 天（2026-10-23 提交），Semantic Scholar RATE_LIMITED 無法查詢 |
| 機構 | DSO National Laboratories（新加坡）+ UC Berkeley + ICSI/Berkeley Lab |
| 社群反應 | 未見 HF Daily Papers 或 Papers with Code 收錄 |
| 可信度 | 通過 — 固定 base model 只換 harness 的對照設計，5 harness×4 模型×4 prompting 條件的完整 ΔASR 表格，附 GPQA 能力對照與拒絕率互補指標 |
| 證據成熟度 | 較完整 — 系統性對照排除模型差異干擾，但僅測化學領域與 GPT 家族，未拆解 harness 哪個元件造成退化 |
| 可復現性 | 部分產物 — 方法與 SafeSciBench 題庫來源公開可查，未見獨立 GitHub 程式碼 |
| 為什麼選這篇 | 直接 — 直接測試「base model 安全測過就代表部署的 agent 安全」這個常見假設是否成立 |
| 方向新意 | 實質增量 — 用固定模型換 harness 的對照設計，把安全變化明確歸因到 harness 本身而非模型差異 |
| 今日重要性 | 高 — AI-for-Science agent 正快速普及，這篇顯示光測過 base model 安全遠遠不夠 |
| 實務連結 | 明確 — 明確指出安全評測要針對「組裝後的 agent」而非只測底層模型，且基準要保留對應 base model 做對照 |
| 編輯信心 | 高 — 「同一模型換上科學 harness 後，攻擊成功率能雙雙上升」的限縮主張有 ΔASR 對照表直接支持 |
| 閱讀建議 | 必讀 — 正在評估或部署科學/研究用途 agent harness 的團隊 |
| 主要限制 | 僅測化學領域 50 筆請求與 GPT 系列 4 個變體，尚未拆解是 harness 的哪個環節（prompt／工具存取／多步互動）驅動安全退化 |

### 領域背景

LLM 安全評測多數停在「對這個模型直接提問,會不會產生有害回答」。但部署時,模型幾乎總是包在某種 agent harness 裡——多了系統提示詞、額外的情境資訊、工具存取權、跨多步的互動循環。既有研究已知簡單的重新表述（如改成過去時態）能削弱拒答,但多數安全基準仍只測 base model,沒人系統性比較「同一個模型,裝進真實科學研究 harness 前後」的差異。

### 中階導讀

- **問題**：想像你已經確認一個模型在被直接問到危險化學問題時會拒答，於是放心把它接進一套自動化合成規劃工具裡——但這個工具層本身帶著額外的情境、額外的工具存取權、跟原本單輪問答完全不同的互動方式，模型的拒答反應還會一樣嗎？
- **方法**：作者固定四個 GPT 版本（GPT-5.2/5.5/5.6-Luna/6-Luna）不變，分別套進五個真實存在的科學研究 agent harness,用 SafeSciBench 的 50 筆「要求修改化合物以增加毒性或腐蝕性」請求,在直接提問、角色扮演、過去時態重寫、PAIR 自適應攻擊四種條件下，比較「裝 harness 後」跟「裸模型」的攻擊成功率差異（ΔASR），並另外測 GPQA 科學問答準確率做對照。
- **為什麼重要**：最關鍵的發現是「科學能力提升」跟「安全退化」是兩條獨立的軸線——ChemToolAgent 讓 GPT-5.2 的 GPQA 準確率從 62% 升到 68%，同時直接提問的攻擊成功率也從 2% 升到 20%；DrugAgent 的 GPQA 準確率反而從 62% 掉到 28%，攻擊成功率卻暴增到 72%。不管 harness 讓模型變強還是變弱，安全性都可能跟著惡化，兩者沒有必然的反向關係。

### 深入要點

- 直接提問（無任何攻擊話術）下：GPT-5.2 搭 ChemToolAgent 攻擊成功率 2%→20%（+18 個百分點）、搭 Biomni 到 24%（+22 點）、搭 DrugAgent 到 72%（+70 點，五個 harness 中最大增幅）
- PAIR 自適應攻擊下：GPT-5.5 base model 只有 2% 成功率，裝進 CACTUS 或 ChemToolAgent 都跳到 60%；GPT-5.6-Luna base 10% 跳到最高 66%；GPT-6-Luna base 2% 跳到最高 30%
- STELLA 這個 harness 在四個模型上大多維持或略低於 base model 的攻擊成功率，顯示安全退化不是每個 harness 都會發生，而是跟具體設計有關
- 拒絕率（refusal rate）這個互補指標顯示：GPT-5.5 搭 PAIR 攻擊時，base model 的明確拒答率 80%，換成 ChemToolAgent 後掉到 6%、CACTUS 掉到 8%，跟攻擊成功率上升同步發生
- 落地門檻：安全基準要把「對應的 base model」也納入同一套測試當對照組，而不是只給 agent 一個單獨的分數；沒有對照就分不出「這個漏洞本來就存在」還是「harness 造成的新退化」
- Limitation：目前只驗證化學領域與 GPT 系列模型，尚未做元件層級的消融（拆解是系統提示詞、工具存取還是多步互動造成退化），也未測其他科學領域或模型家族

### Reviewer 一句話評

固定 base model 只換 harness 的對照設計，是這篇在方法論上最乾淨的地方，讓「安全變化是 harness 造成的」這個因果歸因站得住腳；但樣本僅限化學領域與 GPT 家族，且作者自己也說還沒拆解到底是 harness 裡的哪個環節在驅動退化，下一步的元件消融會更有說服力。

### 給你的 take-away

- 如果你在部署科學研究用的 agent（化學、生物、藥物發現）：不要只憑「我們用的模型通過了安全基準」就放心，針對組裝後的完整 harness（含工具存取與多步互動）重新測一次安全性，尤其是 adaptive 攻擊條件
- 如果你在設計安全評測流程：把對應的 base model 分數也一起報出來，單獨一個 agent 的安全分數看不出 harness 到底是讓情況變好還是變壞

---

## 論文三｜一張簽名圖怎麼把指令偷渡進多 Agent 系統，又怎麼被擋下

**Agentic AI Defense: Decode-Time Provenance Binding for MCP**
Eric Yocam, Varghese Vaidyan, Paris Kalathas, Patrick Tague, Bruce DeBruhl, Yong Wang（Dakota State University + Cal Poly San Luis Obispo + Carnegie Mellon University + University of Idaho）　·　arxiv: 2610.31974

連結: [arxiv](https://arxiv.org/abs/2610.31974) · [alphaxiv](https://www.alphaxiv.org/abs/2610.31974)

### TL;DR

作者示範把指令用隱寫術藏進 email 簽名的 logo 圖片，肉眼和文字掃描器都看不出異狀，只有在某個工具把圖片解碼時才變成指令、偷渡進多 agent 的信任鏈；提出的防禦是在 MCP 層於解碼那一瞬間就簽署「不可信」標籤並獨立維護來源記錄，在真實測試環境中把攻擊成功率從未防禦的 100% 壓到 0%，優於關鍵字掃描與正規表達式各自的 62.5%。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（cs.CR 主分類，未見會議/期刊接受標註） |
| 引用速度 | 發布 5 天（2026-10-22 提交），Semantic Scholar RATE_LIMITED 無法查詢；另被一個自動化研究追蹤 GitHub bot 收錄，非同行審查社群信號 |
| 機構 | Dakota State University + Cal Poly San Luis Obispo + Carnegie Mellon University + University of Idaho |
| 社群反應 | GitHub 公開完整程式碼與資料；未見 HF Daily Papers 或 Papers with Code 收錄 |
| 可信度 | 通過 — 兩個演算法的形式化定義與完整 proof sketch，真實 MCP testbed 的攻防實測數字，四元件消融，誤擋率測試一應俱全 |
| 證據成熟度 | 較完整 — 形式化證明加攻防實測加消融的證據鏈完整，但實驗用小模型 Qwen2.5-0.5B-Instruct，尚未在更大規模生產系統驗證 |
| 可復現性 | 完整產物 — GitHub 公開完整程式碼、資料與 testbed 設定 |
| 為什麼選這篇 | 直接 — 補上今天另外兩篇只描述問題、沒給工程解法的缺口，示範一種能把注入手法從 100% 攻擊成功率壓到 0% 的機制 |
| 方向新意 | 實質增量 — 把「資料來源標籤」跟「解碼轉換的那一瞬間」明確綁在一起，而非沿用既有在文字工具回傳時才貼標籤的做法 |
| 今日重要性 | 高 — MCP 生態正快速擴張，既有防禦多數只看文字管道，這篇直接點名圖片／多模態管道是個尚未被填補的缺口 |
| 實務連結 | 明確 — 給出可形式驗證、可直接部署的演算法與開源實作，不是單純的攻擊展示 |
| 編輯信心 | 高 — 「decode-time 才綁定標籤能擋下 cross-modal steganography 注入」的主張有形式化證明與攻防實測雙重支持 |
| 閱讀建議 | 必讀 — 正在設計或稽核 MCP 多 agent 系統安全架構的團隊 |
| 主要限制 | 安全保證的前提是整條路徑都被 MCP 層完全中介；agent 把解碼後指令改寫成自由文字跳出這個受中介管道的情況不在保護範圍內 |

### 領域背景

間接提示注入（指令被藏在 agent 要讀的內容裡，而不是使用者直接下的）是 OWASP LLM 應用程式風險排名第一的問題。既有兩類防禦各有盲點：內容掃描只看文字裡有沒有可疑字句，碰到看不出異狀的圖片就失效；資料溯源（provenance）防禦雖然會標記工具回傳的內容為「不可信」，但標籤通常只在「文字」工具回傳的那一刻打上，沒考慮到危險的轉換其實發生在「解碼」這一步。

### 中階導讀

- **問題**：想像一封看起來完全正常的商務信件，簽名裡有一個品牌 logo——這是信件裡最不會引人懷疑的東西。攻擊者用隱寫術把指令藏進這個 logo 的像素或中繼資料裡，圖片本身跟原版肉眼看不出差異，寄信過程中任何防毒軟體或郵件過濾器都抓不到，因為這就是一張合法的 PNG 圖片。
- **方法**：危險的時刻發生在收件人的自動摘要 agent 處理這封信時——某個負責解碼的工具（OCR、隱寫術擷取器、或被要求揣摩隱藏內容的多模態模型）把 logo 解碼，藏在裡面的指令這才第一次變成文字，被遞交給下一個 agent 當作普通的中間結果。作者的防禦方法是讓 MCP 這一層在任何「解碼轉換」工具執行的瞬間,立刻簽署一個「不可信」標籤,並且自己獨立記錄完整的來源追溯鏈（不信任 agent 自己回報的依賴關係）；之後任何關鍵工具呼叫，都要靠這條層級自己記的追溯鏈來判斷,而不是看 agent 附上的標籤。
- **為什麼重要**：關鍵的安全性質是「遭入侵的 agent 無法靠偽造或替換一個合法的可信標籤來洗白」——因為驗證的時候，系統查的是自己記錄的來源追溯鏈，不是 agent 遞交上來的那個標籤，這正是作者用形式化證明去保證的部分。

### 深入要點

- 三種隱寫載體全部實測：最低有效位元（LSB）、離散餘弦變換（DCT）、PNG 中繼資料文字區塊，三種在視覺上都跟原圖幾乎無法分辨
- 真實 MCP 測試環境下攻防數字：未設防的管線攻擊成功率 100%；關鍵字掃描與正規表達式過濾各讓 62.5% 攻擊成功；本機制把攻擊成功率壓到 0%
- 一個「進程內資訊流追蹤」基準方法在單一信任域內表現跟本機制一樣好，但一旦標籤要跨越一個被入侵的中繼節點就會失守，本機制則不受影響
- 四元件消融（解碼標記、HMAC 簽署驗證、信任追溯鏈記錄、關鍵節點強制檢查）顯示每個元件都是必要的，拿掉任何一個都無法完整防住攻擊
- 一條經審核的「信任升級」路徑把合法任務的完成率從 67% 拉到 100%，同時沒有犧牲任何防護力；密碼學驗證的額外負擔低於一次解碼來回時間的 0.2%
- 落地門檻：這個機制的前提是整條路徑都被 MCP 層完全中介，如果 agent 把解碼出來的指令自己改寫成一段自由文字、跳出這個受中介的管道傳給別人，追溯鏈就追不到了——作者誠實測了這條邊界並承認它沒解決
- Limitation：目前實驗用的是小模型 Qwen2.5-0.5B-Instruct 跑 agent（因為安全判斷本身由確定性的 MCP 層負責、跟模型大小無關），但尚未在更大規模的真實生產多 agent 系統驗證

### Reviewer 一句話評

用形式化證明搭配真實攻防實測，把「containment 而非 detection」這個設計哲學講得很清楚，而且誠實地測出並點名自己機制的邊界在哪裡，這種嚴謹度在安全論文裡不常見；但機制的安全保證完全依賴「整條路徑被完全中介」這個前提,一旦 agent 行為跳出這個受控管道,防護就會失效,這個假設在更鬆散、第三方工具眾多的真實 MCP 部署裡能撐多久,仍待觀察。

### 給你的 take-away

- 如果你在設計或稽核 MCP 多 agent 系統：檢查你的資料來源標籤是在「文字工具回傳」還是「任何解碼轉換」的那一刻打上——如果只顧後者沒顧前者，圖片、音訊等非文字管道就是一個現成的繞過路徑
- 如果你已經有 provenance/taint tracking 機制：這篇的核心啟示是標籤要由受信任的中介層自己記錄並簽署，不能信任 agent 自己回報的依賴關係，否則一個被入侵的中繼節點就能用合法標籤把不可信內容洗白

---

## 今日收穫

之前以為「agent 安不安全」是一個可以靠測模型、測攻擊成功率就回答的單一問題，今天三篇讓我意識到真正該問的是「鏈路上每一個環節,是誰在相信誰」：工具輸出的文字可能句句為真卻讓 agent 和負責把關的 verifier 一起被誤導；同一個已經測過安全的模型，換個 harness 攻擊成功率就能跳十倍；一張看起來普通的圖片，能在被工具解碼的那一刻才變成指令。三篇合起來最有意思的不是哪個漏洞更嚴重，而是它們指向同一個結論：模型安全評測只是起點，真正決定系統安全的是格式化層、harness 組裝、跨模態解碼這些容易被忽略的中間環節。

## 參考資料

- [Who Verifies the Tools? How Warped Formatters Mislead Agents and Their Verifiers (arXiv:2610.32110)](https://arxiv.org/abs/2610.32110)
- [Who Verifies the Tools? — alphaxiv](https://www.alphaxiv.org/abs/2610.32110)
- [Who Verifies the Tools? — official experiment repository](https://github.com/williamcodes/who-verifies-the-tools)
- [OpenClaw merged fix PR #131702](https://github.com/openclaw/openclaw/pull/131702)
- [Do AI-for-Science Agents Preserve Model Safety? (arXiv:2610.32045)](https://arxiv.org/abs/2610.32045)
- [Do AI-for-Science Agents Preserve Model Safety? — alphaxiv](https://www.alphaxiv.org/abs/2610.32045)
- [Agentic AI Defense: Decode-Time Provenance Binding for MCP (arXiv:2610.31974)](https://arxiv.org/abs/2610.31974)
- [Agentic AI Defense — alphaxiv](https://www.alphaxiv.org/abs/2610.31974)
- [Agentic AI Defense — official code repository](https://github.com/ericyoc/stego_provenance_defense)
