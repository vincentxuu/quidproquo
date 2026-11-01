---
title: "AI Agent Arxiv Digest — 2026-11-01"
date: 2026-11-01
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天的主題是規模不等於更好——多 agent 分工多付了協調稅卻沒換到準確率，多 agent 討論逼近的是自信的錯誤共識而非真相，AI 研究 agent 寫錯的數字多數是歸屬錯誤而非捏造"
tldr: "拆成三階段的 multi-agent pipeline 成本是單次強模型呼叫的 3.22 倍卻沒多解出題目；73,080 次受控測量顯示 LLM 群體共識崩壞古典收斂理論，拓撲救不了集體錯誤共識；重新分析 540 筆判決顯示 AI 研究 agent 論文裡近五分之四的可疑數字是歸屬錯誤而非捏造"
series:
  name: "AI Agent Arxiv Digest"
  order: 161
---

## 今日總覽

今天三篇從三個不同角度戳破關於 agent 系統的樂觀假設：協調稅告訴你分工本身要付錢，而且常常白付——拆成 multi-agent pipeline 既沒有變便宜也沒有變準，真正省錢的是挑對模型而非拆任務；共識崩壞告訴你讓多個 agent 互相討論不會自動逼近真相——網路怎麼連都擋不住群體一起自信地相信錯的事；歸屬錯誤告訴你 AI 研究 agent 寫出來的數字，「沒被查到有問題」不代表是真的，也不代表是假的——多數失誤是記錄配對錯了對象，不是憑空捏造。三篇合起來是一句忠告：無論是把任務拆給更多 agent、讓它們互相辯論，還是直接採信它們寫出來的報告，規模或人數本身都不會自動帶來更好的結果或更可信的答案。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| 共識動力學（Consensus Dynamics） | 多個獨立個體反覆交換意見後，集體意見如何隨時間演變的理論框架 |
| 凸組合更新（Convex Combination） | 更新後的立場必須落在目前看到的各方意見範圍之內，不能比任何人更極端；古典共識理論的核心假設 |
| 協調稅／異質紅利（Coordination Tax / Heterogeneity Dividend） | 把任務拆給多個 agent 要多付的成本（重複建上下文、協議交接），對沖掉把部分工作丟給便宜模型省下的錢 |
| 來源歸因（Provenance） | 驗證一個數字不只是「這個值有沒有出現在輸出裡」，而是「這個值真的來自它宣稱的那次實驗、那個指標、那次執行」 |
| LLM 當裁判（LLM-as-a-Judge） | 用另一個大型語言模型打分、審核別的模型或 agent 輸出；本文顯示換一家供應商的裁判會給出不同的通過率 |

---

## 論文一｜協調稅：多 agent pipeline 什麼時候才划算

**The Coordination Tax and the Heterogeneity Dividend: Break-Even Conditions for Multi-Agent LLM Pipelines**
Andreas Zettl, Diego Gosmar（VoiceInteroperability.ai／Linux Foundation AI & Data）　·　arxiv: 2610.37700

連結: [arxiv](https://arxiv.org/abs/2610.37700) · [alphaxiv](https://www.alphaxiv.org/abs/2610.37700)

### TL;DR

三階段拆解的 multi-agent pipeline 成本是單次強模型呼叫的 3.22 倍、耗時 3.24 倍，卻沒多解出任何題目；真正省錢的是挑對模型，不是拆 agent。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布 7 天，Semantic Scholar 429 無法確認，依發布天數推斷近乎必然 0 引用 |
| 機構 | VoiceInteroperability.ai／Linux Foundation AI & Data 開放語音互通倡議工作小組 |
| 社群反應 | 被 GitHub 策展清單 chen742/Awesome_multi-agent-system（2026-10-30 issue）收錄；無 HF Daily Papers／Papers with Code |
| 可信度 | 通過 — 正文提供封閉形式模型推導，加上 135 任務、2430 次執行的配對統計檢定 |
| 證據成熟度 | 較完整 — 協議開銷直接量測（非推算），6 種架構對照，涵蓋 router／oracle 兩個基準線 |
| 可復現性 | 完整產物 — harness、任務建構腳本、原始執行紀錄、分析腳本皆 MIT 授權公開 |
| 為什麼選這篇 | 直接 — 把「要不要上 multi-agent」從感覺題變成可以算出門檻的算術題 |
| 方向新意 | 實質增量 — 首次把拆解稅與異質紅利拆開算，並納入 router／oracle 當對照組 |
| 今日重要性 | 高 — 許多團隊正在導入 A2A／OFP 等互通協議，卻沒人算過這筆帳 |
| 實務連結 | 明確 — 給出可直接套用的打平公式 f* 與可行性上限 α<1/r |
| 編輯信心 | 高 — 窄範圍主張（這 135 個程式碼任務上分工沒有比單次呼叫划算）有統計檢定支持 |
| 閱讀建議 | 必讀 — 任何在評估 multi-agent 架構 ROI 的人 |
| 主要限制 | 僅測程式碼生成任務，兩個模型同屬一家供應商，協議稅是否因協議不同而不同尚未驗證 |

### 領域背景

Agent 互通協議（OFP、A2A、MCP）這兩年快速鋪開，多半以「能力更強」為理由推廣，運行成本被當成未知大小的額外開銷。既有的 multi-agent 框架評測多半只看準確率，把成本和延遲當附註；真正該比較的對照組——單次呼叫便宜模型、用路由器挑模型——幾乎從未被納入比較。

### 中階導讀

- **問題**：想像你的團隊要不要把一個任務拆成「規劃者、寫手、審核者」三個 agent 接力做。大家假設分工至少不會貴太多，但沒人量過協議本身加了多少成本，也沒人拿「挑一個便宜模型自己做」當對照組。
- **方法**：作者先推導封閉形式公式，把「拆解稅」（重複上下文、膨脹的輸出量）和「異質紅利」（部分角色換便宜模型省下的錢）分開算，給出打平門檻；再在 135 個程式碼任務上跑 6 種架構（單次強呼叫、單次便宜呼叫、路由器、純多步、加 OFP 協議的多步、混合模型的多步）驗證。
- **為什麼重要**：這讓「要不要上 multi-agent」變成可以先算、再決定的事，而不是先拆再補救。

### 深入要點

- 135 個 HumanEval／ClassEval 任務、2430 次執行：三階段 pipeline（加 OFP 協議）成本是單次 Claude Opus 5.5 呼叫的 3.22 倍，耗時 3.24 倍，Δpass@1 僅 -1.5 個百分點（p=0.28，不顯著）
- OFP 協議本身每次交接只加 7.2 毫秒，佔 pipeline 總耗時的 0.11%——協議稅不是問題，分工本身才是
- 把規劃者／審核者換成 Claude Haiku 5.5 後成本降到 0.39 倍，但 pass@1 掉 6.7 個百分點，整體仍比單次強呼叫貴 27%（1.27 倍）、且更慢更不準
- 真正划算的做法不是拆 agent：在單次強呼叫與單次便宜呼叫之間做 oracle 選擇，可以 94.3% 執行成功率，只付強呼叫一半的「每解出任務成本」
- 可行性上限 α<1/r：這組價格比下（r=0.025）分工最多可撐大輸出量到 40 倍還有機會打平，但實測膨脹倍數僅 2.78–5.56 倍，問題不是沒拆夠，是拆解本身沒讓任務變簡單也沒變準
- Limitation：只測程式碼生成任務，兩個模型都來自 Anthropic，換成需要人工評分的任務或跨供應商協議是否仍成立，留給未來工作

### Reviewer 一句話評

公式推導乾淨，135 任務、2430 次執行的配對統計也做得紮實，協議開銷直接量測而非推算是本篇最紮實的一步；但兩個模型同屬一家供應商、任務全是可執行驗證的程式碼生成，換成人工評分任務或跨供應商協議，門檻是否還站得住仍待驗證。

### 給你的 take-away

- 如果你在規劃要不要上 multi-agent pipeline：先量任務拆解後輸出量會膨脹幾倍（α），查手上便宜/強模型的價格比（r），算出打平所需比例（f*），算完再決定要不要拆
- 如果你已經在用 multi-agent 框架：檢查有沒有把「單次呼叫便宜模型」和「單次呼叫強模型配路由器」放進對照組——多數宣稱的「分工更省」常常只因為少了這兩個對照組才看起來成立

```diagram
title: 六種多 agent 架構的成本，相對單次強模型呼叫
desc: 分工加協議的多 agent pipeline（C）成本是單次強模型呼叫的 3.22 倍，混合模型（D）仍比單次呼叫貴 27%；真正便宜的是換成便宜模型（A′，0.04 倍）或用路由器挑模型（R，0.18 倍），不是把任務拆給多個 agent。
caption: 資料來源：2610.37700 Table 3，135 個 HumanEval/ClassEval 任務、2430 次執行的配對比較（相對單次 Claude Opus 5.5 呼叫）。B（純多 call、無協議）成本是 3.20 倍，與 C（加 OFP 協議）幾乎相同，顯示協議只佔每次交接 0.11% 時間、不是分工變貴的原因，圖中以 C 代表；基線 y=300，k=60/單位，數值從 0 起算。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">成本倍數（相對單次強模型呼叫）</text>
  <line class="dg-grid" x1="72" y1="60" x2="612" y2="60"/>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">4</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">2</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="94" y="240" width="64" height="60"/>
    <rect class="dg-bar dg-bar--soft" x="202" y="298" width="64" height="2"/>
    <rect class="dg-bar dg-bar--soft" x="310" y="289" width="64" height="11"/>
    <rect class="dg-bar dg-bar--soft" x="526" y="224" width="64" height="76"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="418" y="107" width="64" height="193"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="126" y="230" text-anchor="middle" dominant-baseline="central">1.00×</text>
  <text class="dg-sub" x="234" y="288" text-anchor="middle" dominant-baseline="central">0.04×</text>
  <text class="dg-sub" x="342" y="279" text-anchor="middle" dominant-baseline="central">0.18×</text>
  <text class="dg-label dg-text--accent" x="450" y="97" text-anchor="middle" dominant-baseline="central">3.22×</text>
  <text class="dg-sub" x="558" y="214" text-anchor="middle" dominant-baseline="central">1.27×</text>

  <text class="dg-sub" x="126" y="320" text-anchor="middle" dominant-baseline="central">單次強模型</text>
  <text class="dg-sub" x="234" y="320" text-anchor="middle" dominant-baseline="central">單次便宜版</text>
  <text class="dg-sub" x="342" y="320" text-anchor="middle" dominant-baseline="central">路由選模型</text>
  <text class="dg-label dg-text--accent" x="450" y="320" text-anchor="middle" dominant-baseline="central">分工＋協議</text>
  <text class="dg-sub" x="558" y="320" text-anchor="middle" dominant-baseline="central">混合分工</text>
</svg>
```

---

## 論文二｜拓撲救不了集體錯誤共識

**Network Topology Does Not Matter: The Breakdown of Classical Consensus in LLM Populations**
Sahil Rajesh Dhayalkar（Arizona State University）　·　arxiv: 2610.37699

連結: [arxiv](https://arxiv.org/abs/2610.37699) · [alphaxiv](https://www.alphaxiv.org/abs/2610.37699)

### TL;DR

73,080 次受控交換直接量測發現，LLM 的意見更新常常違反古典共識理論的基本假設；外推到萬人規模後，網路怎麼連都救不了——四個模型的群體會自信地一致同意客觀錯誤的說法。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布 8 天，Semantic Scholar 確認 0 引用 |
| 機構 | Arizona State University（單一作者） |
| 社群反應 | 被 GitHub 策展清單 chen742/Awesome_multi-agent-system（2026-10-30 issue）收錄；無 HF Daily Papers／Papers with Code |
| 可信度 | 通過 — 正文提供形式證明，加上 8 模型、73,080 次受控交換的實徵量測與萬人規模外推模擬 |
| 證據成熟度 | 較完整 — 三個獨立量測工具（運算子量測、真實群體驗證、外推模擬）互相印證 |
| 可復現性 | 部分產物 — 附錄給出完整提示詞與量測公式，未見程式碼或資料集公開連結 |
| 為什麼選這篇 | 直接 — 揭露「多 agent 討論」這個常見設計模式的理論缺陷 |
| 方向新意 | 實質增量 — 首次直接量測 LLM 的更新運算子，而非假設它符合古典共識理論 |
| 今日重要性 | 高 — 任何用多 agent 討論做事實核查或決策輔助的系統都該知道 |
| 實務連結 | 明確 — 直接指出「調拓撲結構救不了」的工程誤區 |
| 編輯信心 | 高 — 主張範圍限定在測試的 8 個 0.5B–9B 模型，形式證明與實驗結果一致 |
| 閱讀建議 | 必讀 — 做 multi-agent debate／社群模擬的人 |
| 主要限制 | 測試模型僅到 9B，前沿閉源模型（GPT／Claude／Gemini）的 token 機率通常不可得，無法直接驗證是否同樣崩壞 |

### 領域背景

古典分散式共識理論假設 agent 反覆對鄰居意見做加權平均，收斂速度由圖的代數連通度決定，這讓網路拓撲成為系統設計者的主要調整對象。多 agent debate 框架近年流行，但多半假設 LLM 的行為會乖乖符合這套理論，少有工作直接量測 LLM 真正的更新規則。

### 中階導讀

- **問題**：想像你設計一個多 agent 討論系統，想讓幾個 agent 互相聽取意見逼近正確答案。古典理論說只要網路連通，大家終會收斂，收斂速度取決於怎麼連。LLM 真的像理論假設那樣老實做加權平均嗎？
- **方法**：作者直接從 token 機率讀出模型對一個命題的信念強度，系統性量測「看到同儕立場後我的立場怎麼變」，橫跨 8 個模型、73,080 次交換。量到的規則有時讓新立場比雙方原本立場都更極端，甚至反向移動——這在數學上無法用任何「老實做加權平均」的網路模型表示。外推到萬人模擬群體後，圖的連通程度幾乎不影響最終結果。
- **為什麼重要**：很多系統設計者以為調整討論的網路結構可以控制或改善多 agent 討論的結果，這篇說這個槓桿幾乎不存在——決定結果的是模型自己的偏誤和訊息怎麼寫，不是誰跟誰講話。

### 深入要點

- 8 個模型（0.5B–9B）、73,080 次受控交換：量到的更新規則系統性違反凸組合假設，部分情況下出現負的「實現權重」(agent 聽到同儕意見後反而更堅持己見甚至反向移動)，無法用任何非負列隨機矩陣表示
- 外推到 10,000 個 agent 的模擬群體：圖的代數連通度幾乎解釋不了最終結果的變異量
- 8 個模型裡有 4 個（包含一個僅 7B 參數的 Qwen 模型）不論網路怎麼連，群體最終都自信地一致同意客觀錯誤的說法；3B 的 Qwen、Llama-8B、Mistral-7B、Gemma-2-9B 都沒有出現這個行為，顯示是個別模型的內在偏誤，不是模型規模
- Limitation：測試模型只到 9B，前沿閉源模型的 token 機率通常拿不到，無法直接套用同一套量測方法驗證是否也有同樣的崩壞

### Reviewer 一句話評

三個古典假設逐一用形式證明搭配大規模受控實驗拆解，量測工具的設計（直接讀 token 機率而非解析文字）是這篇可信度的關鍵；但受限於能拿到完整 token 機率的開源模型規模都在 9B 以下，前沿閉源模型是否一樣崩壞，目前只能是推測，不是結論。

### 給你的 take-away

- 如果你在設計多 agent 辯論或共識機制：不要靠調整誰跟誰講話來防止群體被帶偏，先去量你用的模型本身在這個議題上的更新偏誤方向，偏誤比拓撲更決定結果
- 如果你在用多 agent 討論做事實核查或決策輔助：把「多個 agent 達成共識」當成「這個答案被充分檢驗過」的訊號是危險的——共識本身可能只是群體一起被帶往錯的方向，跟驗證沒有關係

---

## 論文三｜AI 研究 agent 寫錯的數字，多數是歸屬錯誤不是捏造

**Beyond fabrication: Misattributed numbers in papers written by AI research agents**
Mosab Alfaqeeh, Omar Hourani, Muath Hourani et al.（Al-Ahliyya Amman University／Binghamton University, SUNY）　·　arxiv: 2610.38691

連結: [arxiv](https://arxiv.org/abs/2610.38691) · [alphaxiv](https://www.alphaxiv.org/abs/2610.38691)

### TL;DR

重新分析 540 筆官方判決加上人工標註 256 筆數字聲明，AI 研究 agent 論文裡「沒來源支撐」的數字，約五分之四其實是歸屬到錯的實驗，不是憑空捏造；換一家供應商的裁判會讓通過率翻倍，但排名不變。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint，正文標註投稿期刊 Data Science and Management（審稿狀態未確認） |
| 引用速度 | 發布 4 天，Semantic Scholar 429 無法確認，依發布天數推斷近乎必然 0 引用 |
| 機構 | Al-Ahliyya Amman University（約旦）＋ Binghamton University, SUNY |
| 社群反應 | 被社群策展 bot「agents-radar」2026-10-30 當日 50 篇中列入 14 篇重點推薦；無 HF Daily Papers／Papers with Code |
| 可信度 | 通過 — 重新分析 540 筆官方判決，加上人工標註 256 筆數字聲明，兩位標註者交叉驗證 Cohen's κ=0.89 |
| 證據成熟度 | 較完整 — 開發／確認樣本分離設計，操作規則在標註前就鎖定，跨 99 份投稿的基準測試 |
| 可復現性 | 完整產物 — 程式碼、標註、衍生資料全公開（GitHub mos3b-faqeeh/agent-integrity-analysis） |
| 為什麼選這篇 | 直接 — 直接影響「要不要相信 AI 研究 agent 寫出來的數字」這個正在發生的決策 |
| 方向新意 | 實質增量 — 首次把「捏造」與「歸屬錯誤」分開量化，證明後者才是主因 |
| 今日重要性 | 高 — 愈多團隊讓 agent 自己跑實驗寫報告，這個問題愈迫切 |
| 實務連結 | 明確 — 給出可直接套用的 claim-to-evidence 查核方法，與「不要把未驗證當作假」的操作建議 |
| 編輯信心 | 高 — 主張（這個 benchmark 上誤歸屬比捏造常見）有分層證據支持，作者亦明確界定不可外推之處 |
| 閱讀建議 | 必讀 — 使用 AI research agent 產出報告或結果的團隊 |
| 主要限制 | 僅分析單一 benchmark（Into the Unknown）的資料，不同 benchmark／agent 群體下的比例可能不同 |

### 領域背景

LLM agent 已經能自己跑實驗、寫完整論文，組織愈來愈倚賴它們報告的數字做決策。既有的整合性檢查多半靠單一 LLM 裁判打分，或只確認「這個值出現在輸出裡」，兩者都無法判斷一個數字到底是從它宣稱的那次實驗算出來的，還是張冠李戴。

### 中階導讀

- **問題**：想像一個 AI research agent 自己跑實驗、寫論文，報告裡寫著「準確率達到 92%」。只去 agent 留下的檔案裡搜尋「92%」這個字串，搜得到就能放心嗎？
- **方法**：作者重新檢視一個公開 benchmark 的全部判決紀錄，再人工標註 256 個數字聲明，逐個問「這個數字真的來自它宣稱的那次實驗嗎？」。沒被驗證通過的數字裡，大部分不是憑空生造，而是真的存在於 agent 的檔案裡，只是貼到了錯誤的實驗、指標或執行批次上。作者接著打造一個規則在標註前就鎖定的檢查器，比對周邊文字有沒有講清楚來源，而不只是比對數字本身。
- **為什麼重要**：「這個值有沒有出現在輸出裡」是最容易寫、也最容易被攻破的檢查方式；想稽核 AI 產出的報告，要查的是「哪一次執行產生了這個數字」，不是「這個數字存不存在」。

### 深入要點

- 重新分析 Into the Unknown 這個 benchmark 全部 540 筆官方判決（9 個 agent、15 個開放研究問題）：讓論文沒過整合性檢查的，幾乎都是「論文內容和實際跑出來的東西對不上」，不是能抓到作弊證據的項目
- 人工標註 256 筆數字聲明（18 份投稿）：沒有來源支撐的數字裡，約五分之四存在於 agent 自己的檔案裡，只是對錯了實驗、指標或執行批次
- checker 在操作規則鎖定前就定案：對照人工標註，通過驗證的聲明裡 92% 真的可查證來源（78/85，含 held-out 樣本 27/29，Cohen's κ=0.89），但只覆蓋 23% 的聲明；沒被驗證的聲明裡仍有 57%–72% 事後被人工認定可追溯——未驗證不等於假
- 單純比對「數字有沒有出現在輸出裡」完全抓不到這種錯誤：測試樣本中這種簡單比對把 87%–95% 的誤歸屬數字判定為通過，也把 88% 刻意設計的誘餌值誤判為支持
- 換一家供應商的 LLM 裁判重跑 30 份投稿：agent 排名維持一致，但通過率是原裁判的兩倍——裁判選擇會改變「通過了多少」，不會改變「誰比較強」
- Limitation：只分析了一個 benchmark 的資料，不同 benchmark 或 agent 群體下，捏造與誤歸屬的比例可能不一樣

### Reviewer 一句話評

把「捏造」和「歸屬錯誤」分開量化、並用凍結操作規則的 checker 和雙標註者交叉驗證，方法論嚴謹且誠實列出「未驗證不等於假」這個常被忽略的推論陷阱；但整份分析建立在單一 benchmark 的資料上，結論能不能跨到其他研究 agent 評測場景，作者自己也還沒有答案。

### 給你的 take-away

- 如果你的團隊讓 AI research agent 自己跑實驗寫報告：稽核時不要只搜「這個數字出現在哪個檔案」，要確認「哪一次執行、哪一個指標產生了這個數字」——否則會放過八成以上的誤歸屬
- 如果你在設計或採用 agent 輸出的驗證機制：把「沒通過驗證」和「是假的」分開處理，未驗證的聲明應該送人工複查，不是直接判定失敗，否則會錯殺大量其實可追溯的真實結果

---

## 今日收穫

之前以為「多 agent 討論」「多 agent 分工」「讓 agent 自己寫報告」這幾件事，風險頂多是比較貴或偶爾會錯；今天才知道這些風險是結構性的——分工多數時候連便宜都換不到，討論多數時候連真相都逼近不了，而報告裡「沒查到問題的數字」本身什麼都不能證明。規模與人數，從來不是 agent 系統可信或划算的理由。

## 參考資料

- [The Coordination Tax and the Heterogeneity Dividend（arxiv 2610.37700）](https://arxiv.org/abs/2610.37700)
- [The Coordination Tax — alphaxiv](https://www.alphaxiv.org/abs/2610.37700)
- [Coordination Tax 復現 harness（GitHub, MIT）](https://github.com/azettl/coordination-tax-harness)
- [Network Topology Does Not Matter（arxiv 2610.37699）](https://arxiv.org/abs/2610.37699)
- [Network Topology Does Not Matter — alphaxiv](https://www.alphaxiv.org/abs/2610.37699)
- [Beyond fabrication: Misattributed numbers（arxiv 2610.38691）](https://arxiv.org/abs/2610.38691)
- [Beyond fabrication — alphaxiv](https://www.alphaxiv.org/abs/2610.38691)
- [Beyond fabrication 查核器與標註資料（GitHub）](https://github.com/mos3b-faqeeh/agent-integrity-analysis)
- [社群策展：Awesome_multi-agent-system arXiv watch issue #27（收錄本篇兩篇多 agent 論文）](https://github.com/chen742/Awesome_multi-agent-system/issues/27)
- [社群策展：agents-radar ArXiv AI 研究日報 2026-10-30（收錄 Beyond fabrication）](https://github.com/leisure3318/agents-radar/issues/2958)
