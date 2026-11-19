---
title: "AI Agent Arxiv Digest — 2026-11-19"
date: 2026-11-19
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天的主題是 Agent 的共享記憶：測不出差異的評測基準、委派調查時在交接處消失的證據、以及把衝突證據過濾乾淨反而更容易被攻破的設計"
tldr: "RAG in a Trenchcoat 證明簡化到極致的記憶系統能在三個標準基準上打平頂尖設計，問題在基準測不出差異；Multi-Agent Memory Inconsistency 用真實法律文件審查任務顯示委派調查時證據會卡在 worker 和 lead 的交接處；Surfacing Disagreement Beats Resolving It 用嚴謹消融證明把矛盾證據藏起來比留著更容易被下毒攻擊"
series:
  name: "AI Agent Arxiv Digest"
  order: 179
---

## 今日總覽

今天三篇論文從不同角度檢視同一件事：Agent 的共享記憶系統，在「整理證據」這一步到底是在幫忙還是在藏禍。RAG in a Trenchcoat（NeurIPS 2026 正式收錄）用一個刻意做到極簡的記憶系統打平業界複雜設計，證明現有基準根本測不出記憶架構的差異，真正的差異要用對抗式探針才能看到；Multi-Agent Memory Inconsistency 用真實的法律文件審查任務顯示，委派多個 worker 分頭調查雖然讓更多證據被讀到，但衝突偵測率反而從 16.2% 掉到 13.2%，因為證據卡在 worker 回報給 lead 的那一步；Surfacing Disagreement Beats Resolving It 則用嚴謹的消融實驗推翻一個業界常見假設——幫 Agent 把矛盾證據過濾乾淨、只留一個「正確答案」,反而讓系統更容易被下毒攻擊。三篇合起來的教訓：Agent 記憶系統出問題的地方，往往不是記得不夠多，而是在「誰該看到什麼證據」這個交接設計上。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| 共享記憶（Shared Memory） | 多個 Agent 共用的一塊記憶空間，彼此寫入和讀取證據、結論的地方 |
| 委派（Delegation） | Lead agent 把部分調查工作拆給多個 worker agent 分頭執行，再彙整結果 |
| 證據流（Evidence Flow） | 一筆證據從被讀到、被某個 agent 回報、一直到出現在最終結論裡的完整路徑 |
| 信任閘（Trust Gate） | 在寫入共享記憶前先打分、過濾可疑內容的機制，分數不夠高就擋下 |
| 溯源權重（Provenance Weighting） | 根據一筆資訊是誰寫的、何時寫的來決定可信度的加權方式 |
| 對抗式探針（Adversarial Probe） | 故意不在問題裡提示「要用到哪段記憶」,測試 Agent 能否自己想到該用哪段記憶的測試設計 |

---

## 論文一｜記憶系統脫了外套，其實只是極簡 RAG

**RAG in a Trenchcoat: When Minimal Memory Is Enough for Agentic Systems, and When It Isn't**
Jingyu Liu, Zongze Li, Zach Xu et al.（University of Chicago + UC Berkeley）　·　arxiv: 2611.22179

連結: [arxiv](https://arxiv.org/abs/2611.22179) · [alphaxiv](https://www.alphaxiv.org/abs/2611.22179)

### TL;DR

一個刻意做到極簡的 RAG 記憶系統 BRIDGE，在三個標準記憶基準上打平或贏過業界複雜設計（EverMemBench 贏過最強基準 5.7–6.3 分，只用 17–154 倍更少的 token），作者認為這代表現有基準根本測不出記憶架構的真正差異；換成五種對抗式探針後，才看出不同設計各有各的弱點。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | NeurIPS 2026 正式收錄（Main Conference） |
| 引用速度 | 發布 1–2 天，Semantic Scholar 持續 429 無法查詢，以時間推論接近 0 |
| 機構 | University of Chicago（Ce Zhang 實驗室）+ UC Berkeley（Dawn Song） |
| 社群反應 | 檢查當日 HuggingFace Daily Papers 前兩頁未上榜；Papers with Code 未查 |
| 可信度 | 通過 — 正文提供三個標準基準的完整對照表、五種對抗式探針各 20 情境的通過率表，以及一個把規則貼到提示詞頂端讓分數從 52.6% 跳到 94.7% 的控制實驗 |
| 證據成熟度 | 較完整 — 多基準、多 reader 模型家族、多次重跑方向一致，且作者自己承認差異在 15 分以內不下定論 |
| 可復現性 | 部分產物 — 探針情境與分級標準寫在正文,未見明確公開程式碼連結 |
| 為什麼選這篇 | 直接 — 直指記憶架構評測方法本身的缺陷，影響所有要選記憶系統的團隊 |
| 方向新意 | 實質增量 — 用一個刻意簡化的系統反過來證明基準測不出差異，是評測方法論上的貢獻 |
| 今日重要性 | 高 — 多數團隊選記憶系統時仍只看這三類基準分數,這篇直接說明那些分數可能沒有鑑別力 |
| 實務連結 | 明確 — 若你的記憶系統要處理「要不要套用一條沒被明說的規則」這種情境，LangMem 式的原子事實記憶比摘要式記憶更可靠 |
| 編輯信心 | 高 — 多基準加控制實驗的組合足以支持「現有基準鑑別力不足」這個限縮主張 |
| 閱讀建議 | 必讀 — 正在評估或選擇 Agent 記憶系統的團隊 |
| 主要限制 | 探針情境由模型生成，人工覆核僅為抽查；grader 只檢查限制有沒有被遵守，不檢查答案整體品質 |

### 領域背景

Agent 記憶系統這兩年出現了一堆看起來很複雜的設計——原子事實抽取、知識圖譜合成、反思式重寫——但業界一直缺少一個對照組：如果什麼都不做、只用最簡單的 RAG，分數會差多少？這篇論文補上了這個對照組。

### 中階導讀

- **問題**：想像你要幫團隊選一套 Agent 長期記憶系統，手上有三個業界常用的基準分數可以比較。這篇論文問的是：這些分數真的能告訴你哪套設計比較好嗎？還是說，不管用什麼設計，分數都差不多？
- **方法**：作者做了一套刻意簡化到底的記憶系統 BRIDGE——把對話切成段落、用一個 LLM 寫一段觀察筆記、用 BM25 加上向量相似度做混合檢索、依時間排序呈現給 reader。沒有知識圖譜、沒有反思、沒有複雜的衝突消解。拿它去跑三個標準基準，分數跟業界複雜設計打平甚至贏過。接著作者設計了五種「對抗式探針」——問題裡從不提示該用哪段記憶,逼 Agent 自己想起該套用哪條規則或模式——結果才在這裡看出設計差異：記原子事實的 LangMem 擅長「要不要套用一條規則」,BRIDGE 的摘要式記憶擅長「要不要延續一個模式」。
- **為什麼重要**：如果你只看三個標準基準的分數來選記憶系統,你可能根本沒選到真正適合你任務的設計,因為那些分數測不出差異。要知道哪套設計真的適合,得先搞清楚你的任務比較像「套用明說的規則」還是「延續沒被明說的模式」。

### 深入要點

- EverMemBench：BRIDGE 贏過最強基準 MemOS 5.7–6.3 分，只用 5–7K token，比全文基準少 17–154 倍
- LongMemEval-S、BEAM 100K：BRIDGE 與業界基準打平,95% 信賴區間重疊 ⚠️（作者自測，尚待外部複現）
- 對抗式探針（20 情境／探針）：LangMem 在「規則套用」拿 80%，BRIDGE 只有 35%；BRIDGE 在「模式延續」拿 88%，LangMem 只有 55%
- 控制實驗：把規則貼到提示詞頂端的獨立標籤區，BRIDGE 的規則套用分數從 52.6% 跳到 94.7%，證明差距是「呈現方式」不是「有沒有檢索到」
- 落地門檻：要建一套對抗式探針評測需要自己設計場景與分級標準，不像跑標準基準那樣直接套套件
- 與主流框架的關聯：Mem0、LangMem、Graphiti 都被拿來當對照基準，本篇的 RRF 混合檢索做法可直接套用到任何 RAG-based 記憶層
- Limitation：探針情境由模型生成、只做抽查式人工覆核；20 情境的樣本量下，15 分以內的差異不下定論

### Reviewer 一句話評

用刻意簡化的系統反證基準沒有鑑別力，這個論證角度很聰明，而且五個探針的設計確實抓到了原子記憶與摘要記憶的真實差異；但探針樣本量偏小（每種 20 題），且判分本身仍依賴 LLM judge，下一步該驗證的是這套探針在更大規模、真人標註下是否還站得住。

### 給你的 take-away

- 如果你在選 Agent 記憶系統：別只看 LongMemEval、BEAM 這類標準基準的分數，先想清楚你的任務是不是「要套用沒被明說的規則」,再決定該用原子事實型還是摘要型記憶
- 如果你在設計記憶評測：這篇的「對抗式探針」設計（問題不提示該用哪段記憶）值得直接參考，比單純比對檢索準確率更能抓出真實差異

---

## 論文二｜委派調查讀到更多證據，卻更少被拼起來

**Multi-Agent Memory Inconsistency: Where Factual Conflicts Disappear in LLM Agents**
Hejia Zhang, Zhongming Yu, Yimin Ding et al.（UC San Diego + Intel + Hewlett Packard Enterprise）　·　arxiv: 2611.22245

連結: [arxiv](https://arxiv.org/abs/2611.22245) · [alphaxiv](https://www.alphaxiv.org/abs/2611.22245)

### TL;DR

用真實的法律文件審查任務測試三種委派策略，發現強制委派（worker 分頭調查、lead 不讀原始文件）把「兩個互相矛盾的數字都被讀到」的比例從 50.2% 推高到 68.7%，但最終被 Agent 正確揭露並處理的衝突比例反而從 16.2% 掉到 13.2%，因為 68.7% 裡有 43.4 個百分點是「兩個矛盾數字分別卡在不同 worker 手上」,從未同時出現在同一個訊息裡。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（尚未同行審查） |
| 引用速度 | 發布 1–2 天，Semantic Scholar 持續 429 無法查詢，以時間推論接近 0 |
| 機構 | UC San Diego + Intel（部分作者為 Intel 實習生身分完成此研究）+ Hewlett Packard Enterprise |
| 社群反應 | 檢查當日 HuggingFace Daily Papers 前兩頁未上榜；Papers with Code 未查 |
| 可信度 | 有條件通過 — 198 次任務執行、1,314 筆衝突觀察的規模足夠,但正文明確說明只回報描述性百分比,沒有做顯著性檢定或信賴區間，且判分完全依賴單一 LLM judge |
| 證據成熟度 | 初步 — 方向在三個模型、三種策略下一致，但未經統計檢定，樣本為 11 個任務各跑 2 次,量級有限 |
| 可復現性 | 部分產物 — 證據流追蹤器與基準建構方式寫得清楚，未見公開程式碼或資料連結 |
| 為什麼選這篇 | 直接 — 委派調查是多 Agent 系統最常見的設計模式之一,這篇直接指出它在衝突偵測上的代價 |
| 方向新意 | 實質增量 — 把「證據流」拆成 source／worker／lead／final 四個階段分別量測，是方法論上的新貢獻 |
| 今日重要性 | 高 — 任何用多 Agent 分工做盡職調查、審計、研究彙整的團隊都該知道這個交接漏洞 |
| 實務連結 | 明確 — 若你的系統要求 worker 回報完整上下文而非結論摘要，或讓 lead 能抽查原始來源,衝突偵測率明顯較高 |
| 編輯信心 | 中 — 方向一致且任務貼近真實場景,但缺乏統計檢定讓精確數字的把握度打折 |
| 閱讀建議 | 必讀 — 正在用多 Agent 分工做調查、審核類任務的團隊 |
| 主要限制 | 只用 11 個任務、每組合跑 2 次，且判分依賴 LLM judge，沒有人工一致性數據 |

### 領域背景

多 Agent 系統很常見的一個設計是「lead 分派任務給 worker，worker 各自去查資料再回報」，理由是平行處理可以查得更廣更快。但這篇論文問的是：worker 查到的東西,真的會完整傳到 lead 手上嗎？如果傳不到，分工查得更廣反而沒有意義。

### 中階導讀

- **問題**：想像一個法務團隊在做企業併購的盡職調查，文件堆裡同一個數字在不同檔案裡被改過，有些地方還是舊數字。如果派三個助理分頭查三個資料夾,最後彙整報告的人,真的會知道兩個數字對不上嗎？
- **方法**：作者在 Harvey LAB 的真實文件審查任務裡,故意在文件堆裡埋入 73 個數字衝突（同一個值在某些地方被改成另一個值,但其他地方沒改），然後比較三種策略：不委派（一人全查）、可選委派（lead 自行決定要不要分派）、強制委派（worker 分頭查、lead 只彙整不讀原始文件）。用一個「證據流分析器」追蹤每個衝突值從被讀到、worker 回報、到 lead 收到、最後出現在報告裡的完整路徑。
- **為什麼重要**：強制委派確實讓更多原始證據被某個 worker 讀到（68.7% vs 不委派的 50.2%），但這些證據裡有一大半是「兩個矛盾數字分別卡在不同 worker 手上」,從沒同時出現在同一份回報裡,lead 自然偵測不到衝突。對任何設計多 Agent 審核流程的人來說，這代表「分頭查更廣」和「查得出衝突」是兩件不同的事，需要分開設計。

### 深入要點

- 三種策略的「兩個矛盾值同時被讀到」比例：不委派 50.2%、可選委派 62.8%、強制委派 68.7%
- 但最終被正確揭露並處理的衝突比例（Judge Pass）：不委派 16.2%、可選委派 24.2%（三個模型裡最高）、強制委派只有 13.2%
- 強制委派下，301 筆「原始證據兩個值都被讀到」的衝突中，只有 106 筆（35.2%）進入 worker 回報，到 lead 手上只剩 107 筆（24.4%）
- Claude Haiku 5.5 在可選委派下會主動建立 worker 處理 22/22 次任務,遠高於 GPT-5.6（9/22）與 GPT-6（10/22），顯示委派傾向本身也是模型特性之一
- 落地門檻：要求 worker 回報完整上下文而非結論摘要，會增加 token 成本，但這篇顯示這是衝突偵測率的關鍵變數
- 與主流框架的關聯：LangGraph、AutoGen 的 supervisor-worker 模式都適用這個發現,尤其是審計、合規、盡職調查類應用
- Limitation：樣本量有限（11 個任務 × 2 次執行），且作者自己承認未做統計檢定，精確數字需保守看待

```diagram
title: 強制委派下，證據一路流失
desc: 在強制委派策略下，68.7% 的矛盾衝突讓兩個矛盾值都被某個 worker 讀到，但只有 24.4% 同時出現在 worker 回報裡，15.8% 同時寫進最終報告，最後只有 13.2% 被 Judge 判定確實揭露並正確處理
caption: 數字來自 Required 委派策略的池化結果（198 次任務執行、1,314 筆衝突觀察），論文未報告信賴區間
---
<svg viewBox="0 0 640 372">
  <path class="dg-axis" d="M40 348V40" marker-end="url(#arrow)"/>
  <text class="dg-small" x="52" y="320" dominant-baseline="central">委派後，</text>
  <text class="dg-small" x="52" y="338" dominant-baseline="central">證據一路流失</text>

  <text class="dg-small" x="320" y="26" text-anchor="middle" dominant-baseline="central">68.7% 進入漏斗：兩個矛盾值都被某個 worker 讀到</text>

  <polygon class="dg-box" points="60,44 580,44 490,140 150,140"/>
  <polygon class="dg-box" points="150,144 490,144 440,244 200,244"/>
  <polygon class="dg-box dg-box--accent" points="200,248 440,248 424,348 216,348"/>

  <text class="dg-big" x="320" y="78" text-anchor="middle" dominant-baseline="central">24.4%</text>
  <text class="dg-sub" x="320" y="108" text-anchor="middle" dominant-baseline="central">worker 回報同時提及</text>

  <text class="dg-big" x="320" y="180" text-anchor="middle" dominant-baseline="central">15.8%</text>
  <text class="dg-sub" x="320" y="210" text-anchor="middle" dominant-baseline="central">最終報告同時寫出</text>

  <text class="dg-big dg-text--accent" x="320" y="284" text-anchor="middle" dominant-baseline="central">13.2%</text>
  <text class="dg-sub" x="320" y="314" text-anchor="middle" dominant-baseline="central">Judge 判定正確揭露並處理</text>

  <text class="dg-small" x="548" y="90" dominant-baseline="central">−44.3pp</text>
  <text class="dg-small" x="476" y="194" dominant-baseline="central">−8.6pp</text>
  <text class="dg-small" x="444" y="298" dominant-baseline="central">−2.6pp</text>
</svg>
```

### Reviewer 一句話評

用真實的法律文件審查任務而非合成基準來測委派策略，這個選擇很加分，而且「證據流四階段拆解」的方法論值得其他多 Agent 研究借用；但正文坦言沒做統計檢定、判分依賴單一 LLM judge，下一步該驗證的是這個交接漏洞在更大樣本、人工覆核判分下是否仍然顯著。

### 給你的 take-away

- 如果你在設計多 Agent 審核/調查流程：不要只看「委派後查到更多證據」就滿足，要求 worker 回報完整上下文（不只結論）,並讓 lead 保留抽查原始來源的權限,這篇顯示這兩點直接影響衝突偵測率
- 如果你在評估要不要用強制委派：先問自己的任務最在意「查得廣」還是「查得出矛盾」,這篇顯示兩者在強制委派下是互相拉扯的

---

## 論文三｜把矛盾證據藏起來，反而更好攻破

**Surfacing Disagreement Beats Resolving It: A Gated Ablation Study of Provenance-Weighted Memory for Multi-Agent Debate**
Ziaullah Khan, Abdul Rehman Khalid, Shrestha Nischal Lal et al.（Inje University, Korea）　·　arxiv: 2611.22461

連結: [arxiv](https://arxiv.org/abs/2611.22461) · [alphaxiv](https://www.alphaxiv.org/abs/2611.22461)

### TL;DR

對多 Agent 辯論的共享記憶做逐一消融測試，發現唯一真正有效的機制是「把矛盾證據原樣保留、連排序後的衝突清單一起交給辯論者」而不是「先幫忙選出一個答案」——這個改動讓 F1 提升 0.34、把下毒攻擊的成功次數從 122 筆裡的 22 筆降到 7 筆；反而是「寫入前先打信任分數過濾」和「幫檢索器加溯源權重」這兩個聽起來更安全的機制,實測效果是負的。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（尚未同行審查） |
| 引用速度 | 發布 1–2 天，Semantic Scholar 查得到但引用數為 0（新發布，尚無引用） |
| 機構 | Inje University，韓國（數位抗衰老醫療學系 + 電腦工程學系） |
| 社群反應 | 檢查當日 HuggingFace Daily Papers 前兩頁未上榜；Papers with Code 未查 |
| 可信度 | 通過 — 39 次跑、paired bootstrap（10,000 次重抽樣）、Wilcoxon 與 McNemar exact 檢定，每個機制都有事先定好的門檻，作者還誠實揭露了一個讓前測結果從 +0.084 修正到 +0.340 的 harness bug 並說明怎麼修的 |
| 證據成熟度 | 較完整 — 兩種檢索後端重現、HotpotQA 跨語料庫方向性複現、連 p 值對 tie-handling 的敏感度都誠實揭露 |
| 可復現性 | 完整產物 — 作者聲明公開 harness、攻擊集與完整 log |
| 為什麼選這篇 | 直接 — 直接挑戰「共享記憶該幫 Agent 解決衝突」這個常見設計假設 |
| 方向新意 | 實質增量 — 用五個機制逐一消融而不是整套系統比較，定位出真正有效的那一個 |
| 今日重要性 | 高 — 多 Agent 系統設計者常預設「衝突消解」是好設計，這篇用數據反駁 |
| 實務連結 | 明確 — 任何用共享記憶做多 Agent 協作或辯論的系統，都可以直接檢查自己是不是在悄悄幫 Agent 消解衝突 |
| 編輯信心 | 高 — 事前定門檻、誠實揭露 bug 與統計敏感度，這種透明度支撐文章採用的敘述強度 |
| 閱讀建議 | 必讀 — 正在設計多 Agent 共享記憶或辯論系統的團隊 |
| 主要限制 | 注入的矛盾是模板生成、不是自然產生的衝突；僅在一個模型家族（gpt-oss-120b）上測試，第二個模型家族因算力限制未能完成 |

### 領域背景

多 Agent 共享記憶系統設計時，常見的直覺是「幫 Agent 把雜訊濾掉、把衝突解決好，呈現乾淨的單一答案」,這樣 Agent 才不會被矛盾資訊搞混。這篇論文直接測試這個直覺對不對。

### 中階導讀

- **問題**：想像幾個 Agent 在辯論一個問題，共享記憶庫裡同時存著兩筆互相矛盾的證據——一筆是真的，一筆是被人惡意塞進去的假證據。如果記憶系統先幫忙「選出看起來比較可信的那一筆」再交給 Agent，這樣真的比較安全嗎？
- **方法**：作者做了一套叫 DebateGraph 的共享記憶服務，可以獨立開關五種常見的記憶機制。核心對照組是「Collapse」（只把排名最高的那筆證據交給辯論者）vs「Surface」（把完整的排序後衝突清單連同溯源資訊一起交給辯論者）。結果：Surface 比 Collapse 讓 F1 提升 0.340，而且把惡意證據成功誤導結論的次數從 122 筆裡的 22 筆降到 7 筆。反而「信任閘」（寫入前先打分過濾可疑內容）和「溯源權重的檢索路由器」這兩個聽起來更安全的機制,實測分數是負的——因為被下毒的假證據往往指向圖裡已經存在的實體,看起來比真正的證據更「有憑有據」。
- **為什麼重要**：這篇推翻了一個常見假設——「幫 Agent 把答案整理乾淨」不等於「幫 Agent 做出更好的判斷」。對設計共享記憶系統的人來說,保留矛盾、讓 Agent 自己面對分歧,可能比預先幫忙篩選更安全。

### 深入要點

- 核心對照：Surface vs Collapse 在 cap=200（矛盾證據可被檢索到的設定）下，F1 提升 0.340（95% CI [0.267, 0.414]，p < 10⁻⁴）
- 下毒攻擊成功次數：Collapse 下 122 筆裡有 22 筆被誤導，Surface 下降到 7 筆（McNemar exact p = 0.0003）
- 信任閘機制：寫入前過濾可疑內容反而讓 F1 掉 0.075（p = 0.039），因為被下毒的假證據指向圖裡已存在的實體，比真證據更容易通過「有憑有據」的檢查
- 溯源權重檢索路由器：加了反而讓 F1 掉 0.096（p = 0.030）
- 作者誠實揭露：cap=40 時的初版結果只有 +0.084，追查後發現衝突候選集被一個預設上限卡住、約四分之三的矛盾證據根本進不了候選集，修正後才看到 +0.340 的完整效果
- Limitation：注入的矛盾是模板生成的「type-consistent」假證據，不是自然發生的衝突；只測了一個模型家族（gpt-oss-120b），HotpotQA 上的複現只在特定子集顯著,全樣本信賴區間包含零

### Reviewer 一句話評

事前定門檻、誠實揭露並修正自己的 harness bug、連統計檢定對 tie-handling 的敏感度都講清楚，這種透明度在 Agent 論文裡少見，值得信任；下一步該驗證的是這個「保留衝突比消解衝突好」的結論,在自然發生（而非模板注入）的矛盾證據上是否依然成立。

### 給你的 take-away

- 如果你在設計多 Agent 共享記憶：先檢查系統是不是在寫入或檢索階段悄悄幫 Agent 把矛盾證據篩掉了,這篇顯示保留衝突清單（連同溯源資訊）交給 Agent 自己判斷,效果和安全性都更好
- 如果你正在加「信任分數」或「溯源權重」這類聽起來合理的安全機制：先用消融實驗驗證它是不是真的有效,這篇顯示這兩個機制實測都是負效果

---

## 今日收穫

之前以為 Agent 記憶系統的問題是「記得不夠多、記得不夠準」，今天發現真正的問題常常出在交接和整理這一步：委派調查時證據卡在 worker 和 lead 之間、共享記憶幫忙消解衝突時反而把危險藏起來。記憶系統要解決的不是容量問題，是「誰該完整看到什麼」的設計問題。

## 參考資料

- [RAG in a Trenchcoat: When Minimal Memory Is Enough for Agentic Systems, and When It Isn't (arXiv:2611.22179)](https://arxiv.org/abs/2611.22179)
- [Multi-Agent Memory Inconsistency: Where Factual Conflicts Disappear in LLM Agents (arXiv:2611.22245)](https://arxiv.org/abs/2611.22245)
- [Surfacing Disagreement Beats Resolving It: A Gated Ablation Study of Provenance-Weighted Memory for Multi-Agent Debate (arXiv:2611.22461)](https://arxiv.org/abs/2611.22461)
- [arXiv cs.AI new submissions, 2026-11-18 announcement batch](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL new submissions, 2026-11-18 announcement batch](https://arxiv.org/list/cs.CL/new)
- [arXiv cs.MA new submissions, 2026-11-18 announcement batch](https://arxiv.org/list/cs.MA/new)
