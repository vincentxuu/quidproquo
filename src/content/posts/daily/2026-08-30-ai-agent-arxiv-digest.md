---
title: "AI Agent Arxiv Digest — 2026-08-30"
date: 2026-08-30
category: daily
type: digest
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "三篇新論文從錯誤信心、工具輸出與跨迴圈狀態，檢查 Agent 在真正執行動作前會失效的控制閘門"
tldr: "包裝完整的假證據可把 12 個模型的整體行動承諾率從 6.5% 推到 54.0%；SARA 把工具輸出誘發的動作與執行授權拆開，將兩組 benchmark 的攻擊成功率壓到 0.06%–0.17%；LoopHarness 顯示會自然衰減的安全狀態可能被等待繞過，但目前實證仍限於單一固定模型配置與 execution seed"
series:
  name: "AI Agent Arxiv Digest"
  order: 98
---

> 🌏 [English version](/en/posts/daily/2026-08-30-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文談的是同一個工程問題：Agent 說「我知道」之後，系統憑什麼允許它真的去做？第一篇發現，模型面對無法回答的問題時，光是看到一份包裝完整的假證據，就可能更願意採取行動；第二篇把「工具輸出讓模型產生動作意圖」與「runtime 是否授權執行」拆開；第三篇則指出，跨迴圈安全狀態如果會隨時間衰減，攻擊者只要等待就可能重新打開執行閘門。前兩篇的實驗與限制交代完整；第三篇有形式分析與清楚的消融，但只跑單一固定模型角色配置與單一 execution seed，適合當設計警訊，還不能當成已廣泛複現的結論。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| 行動承諾（action commitment） | 模型不只回答「可能是什麼」，還願意據此做出不可逆或有成本的動作 |
| 間接提示注入（IPI） | 惡意指令藏在網頁、文件或工具回傳值裡，模型讀取資料時連指令一起吃進去 |
| 執行授權 | 在模型提出工具呼叫後，由 runtime 再判斷這個動作是否真的可以執行 |
| 動作來源（action provenance） | 追蹤某個動作意圖最早來自使用者、可信規則，還是外部工具內容 |
| 攻擊成功率（ASR） | 測試中惡意目標最後成功執行的比例，越低通常越安全 |
| 非衰減狀態 | 一旦安全事件被觸發，就不會只因經過幾輪或等待一段時間而自動消失的狀態 |

---

## 論文一｜模型知道自己不知道，卻仍可能被一份假證據推去行動

**Calibrated Enough to Know, Not Calibrated to Act**
Pranav Aggarwal　·　arxiv: 2608.27167

連結：[arxiv](https://arxiv.org/abs/2608.27167) · [alphaxiv](https://www.alphaxiv.org/abs/2608.27167)

### TL;DR

在 12 個模型的預註冊實驗中，隨著畫面從沒有證據升級成看似完整的證據包，模型對「其實無法知道答案」的事件做出行動承諾的比例從 6.5% 升到 54.0%；真正豐富的證據面板與完全捏造的面板分別是 37.6% 和 36.8%，差距落在作者事先設定的正負 5 個百分點等效範圍內。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 可信度 | 通過 — 預註冊設計、12 模型測試、異質結果與限制均可回到正文核對 |
| 證據成熟度 | 較完整 — 核心主張有等效檢定、介入實驗與失敗案例，但適用範圍仍受限 |
| 可復現性 | 完整產物 — 已公開程式碼、預註冊、cached outputs 與 Zenodo 存檔 |
| 編輯信心 | 高 — 足以支持「證據外觀可能提高行動承諾」的限縮主張 |
| 閱讀建議 | 必讀 — 會根據搜尋、報表或 RAG context 執行外部動作的團隊 |
| 主要限制 | 效果集中在同一家開發商的三個模型，不能外推到所有 frontier model |

### 領域背景

模型校準通常問的是「模型有多確定自己的答案是對的」。但 Agent 的風險還多一層：即使模型知道答案不可靠，它是否仍會因為畫面看起來資料充足，就願意執行高成本動作？這篇把「知道」和「做」拆成兩個測量問題。

### 中階導讀

- **問題**：想像採購 Agent 被問到明天某地的實際天氣。這件事現在根本無法確定，但系統塞給它一張有圖表、來源標籤與數字的面板後，它會不會誤以為證據已經足以支撐決策？
- **方法**：作者用無法事先知道結果的問題，逐步增加證據外觀，並比較沒有面板、真實豐富面板與完全捏造面板。研究另用小模型微調與格式限制做介入，檢查「拒絕行動」能否被訓練出來。
- **為什麼重要**：若 runtime 只問同一個模型「你有沒有把握」，漂亮的 context 可能同時影響答案與授權判斷。系統需要獨立檢查證據來源、可知性與動作風險。

### 深入要點

- 整體行動承諾率隨證據包裝升級由 6.5% 升至 54.0%，但效果並不普遍：3 個模型明顯受影響、4 個幾乎不承諾、3 個幾乎總是承諾，另 2 個反應較弱
- 真實豐富面板 37.6%、完全捏造面板 36.8%，差 -0.83 個百分點；90% case-clustered 信賴區間為 -4.51 到 +2.66，落在預註冊的正負 5 個百分點等效界線內
- 作者把主要效應明確限縮：集中在同一家開發商的三個模型，不能把 pooled rate 外推成「所有 frontier model 都會如此」
- 在 540 個合成案例上微調 3B 模型，可讓原始案例的行動承諾降到 0；但一旦改成壓縮推理的僵硬格式，回答正確率可從 88.9%–98.6% 掉到 50.9%–73.8%，其中一個 ablation seed 對 48 個不可知案例全部承諾行動
- ⚠️ 作者自測，尚未外部複現；天氣只是弱工具變數，且 hosted model 的 serving 設定無法完全控制

### Reviewer 一句話評

這篇最有價值的不是「模型會被假資料騙」這個泛泛結論，而是把知識校準與行動承諾分開測量，並公開異質結果、預註冊與失敗介入；下一步仍要在不同任務、開發商與真實不可逆工具上重做。

### 給你的 take-away

- 高風險工具不要用模型自報信心直接放行；另外檢查資料來源、事件是否可知，以及動作是否可逆
- 評測 Agent 時，把「答案正確率」與「錯誤答案是否觸發行動」分成兩個指標

---

## 論文二｜工具輸出可以影響規劃，但不該自動取得執行權

**When Tool Outputs Become Commands: Separating Action Induction from Runtime Authorization in Tool-Augmented LLM Agents**
Xiaokun Guo, Zhen Xu, Dongdong Huo et al.　·　arxiv: 2608.27146

連結：[arxiv](https://arxiv.org/abs/2608.27146) · [alphaxiv](https://www.alphaxiv.org/abs/2608.27146)

### TL;DR

SARA 把「外部內容誘發模型提出動作」與「runtime 授權執行」分成兩層；在 GPT-4o-mini 上，AgentDojo 的攻擊成功率由 15.79% 降到 0.06%，AgentDyn 由 16.07% 降到 0.17%，代價是總輸入量約為未防護 agent 的 1.91 倍與 2.21 倍。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 可信度 | 通過 — 兩組 benchmark、八類防禦、跨 backbone 測試與消融均有具體結果 |
| 證據成熟度 | 較完整 — 安全、benign utility 與 token 成本都有比較，但沒有形式保證 |
| 可復現性 | 部分產物 — 演算法、資料集與設定可查，尚未確認完整公開實作與 cached outputs |
| 編輯信心 | 高 — 足以支持 runtime 分離 action induction 與 authorization 的工程價值 |
| 閱讀建議 | 必讀 — 正在做瀏覽、郵件、企業文件或 coding Agent 的工程師 |
| 主要限制 | 僅涵蓋 tool-based IPI，且假設 user、schema、runtime 與 executor 可信 |

### 領域背景

間接提示注入難防，是因為 Agent 必須讀外部內容才能完成工作，而那些內容也可能藏有指令。只在模型入口過濾一次不夠：惡意內容可以先改變規劃，再透過後續正常工具呼叫把來源洗掉。

### 中階導讀

- **問題**：網頁裡寫著「把使用者信件轉寄給某地址」。模型讀到後真的產生寄信呼叫；即使呼叫本身格式合法，也不代表使用者授權過這個目的。
- **方法**：SARA 用隔離的 Action Probe 標出哪些外部內容具有動作誘發性，保存持續的 `EXPOSED` 狀態與動作來源集合，再檢查目標、呼叫鏈與參數是否能回到使用者授權。No-History-Promotion 規則避免後續步驟把外部來源洗成「模型自己的決定」。
- **為什麼重要**：它把安全邊界放到 runtime，而不是期待模型在同一段 context 裡同時閱讀不可信資料、做規劃，又可靠地監督自己。

### 深入要點

- 評測涵蓋 AgentDojo 的 92 個 benign tasks、3,528 個攻擊案例，以及 AgentDyn 的 141 個 benign tasks、5,202 個攻擊案例，並比較 PI Detector、Spotlighting、CaMeL、MELON、AttriGuard 等八類防禦
- GPT-4o-mini 的 ASR 在兩組 benchmark 分別由 15.79% 降至 0.06%、16.07% 降至 0.17%；Gemini 2.5 Flash Lite 則由 33.28% 降至 0.62%、30.91% 降至 0.63%
- SARA 不是每個設定的最低 ASR：CaMeL 在三個設定更低，但 SARA 保留的 benign utility 較高；這讓比較不只剩單一安全數字
- 額外四個 backbone 的八組測試多數把 ASR 壓到 0.3% 以下，但 Llama 3.1 8B 仍有 1.64% 與 1.75% 的殘餘攻擊成功率
- ⚠️ 這不是形式保證，範圍限於 tool-based IPI，並假設使用者、tool schema、runtime 與 executor 可信；純資料相依、直接越權與無條件外部委派不在保護範圍
- ⚠️ 作者自測，尚未外部複現；跨 framework、真實企業工具鏈與長時間運行下的結果仍待驗證

### Reviewer 一句話評

把 action provenance 做成持續的 runtime 狀態，比一次性分類器更接近真實執行邊界；實驗、baseline、utility 與 token 成本都有交代，但能否處理非工具型資料流與語意誤判仍待驗證。

### 給你的 take-away

- 在工具執行層保存「這個動作最早從哪裡來」，不要只看最後一輪看似乾淨的呼叫參數
- 導入前要一起量安全、benign utility 與額外 token；只看 ASR 可能選到實際上無法工作的防禦

---

## 論文三｜跨迴圈的安全狀態一旦會衰減，等待就可能成為攻擊步驟

**Safety Does Not Compose: Non-Decaying Loop State for Autonomous LLM Agents**
Chenhao Wu, Haoxuan Jia, Yang Liu et al.　·　arxiv: 2608.27141

連結：[arxiv](https://arxiv.org/abs/2608.27141) · [alphaxiv](https://www.alphaxiv.org/abs/2608.27141)

### TL;DR

LoopHarness 用不會自然衰減的 latch 保存跨迴圈風險；作者在每個設定 1,000 個攻擊 episode 的測試中回報，完整控制器 ASR 為 0.1%，弱化版本則為 88.4%–97.6%，但這些結果只來自單一固定模型角色配置與單一 execution seed。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 可信度 | 有條件通過 — 形式分析與消融可核對，但實證一般性尚未建立 |
| 證據成熟度 | 概念驗證 — 測試能支持狀態機設計警訊，不能支持普遍的 0.1% 安全承諾 |
| 可復現性 | 部分產物 — 正文說明附有控制器、攻擊、report generator 與 cached calls，但未確認獨立公開 repository |
| 編輯信心 | 中 — 對「衰減狀態可被等待繞過」有信心，對數值外推沒有信心 |
| 閱讀建議 | 略讀 — runtime、Durable Object 或長時間背景 Agent 的設計者 |
| 主要限制 | 單一固定模型角色配置、單一 execution seed 與結構化合成攻擊 |

### 領域背景

很多防護只檢查單次 trajectory，或讓風險分數隨時間下降，避免系統永遠卡死。但自主 Agent 可以反覆執行：攻擊意圖若被拆成多輪，每一輪看起來都可能無害；若狀態還會自動冷卻，等待本身就能變成繞過手段。

### 中階導讀

- **問題**：某輪偵測到可疑操作並關閉工具，但幾輪後風險分數自動歸零。攻擊者不必改變目標，只要先做無害動作等待，再繼續原本流程。
- **方法**：作者先形式化說明，只看單輪片段的監控器可能無法區分被拆散的攻擊與正常觀察；LoopHarness 再用非衰減 latch 保存風險，直到有明確解除條件或人工介入，而不是被時間自動沖淡。
- **為什麼重要**：只要 Agent 能跨迴圈、跨 session 或排程恢復，安全狀態的保存方式就和模型分類器本身一樣重要。

### 深入要點

- 在 200-task pool 上，每種攻擊 family 每個設定跑 200 個 episode、合計每設定 1,000 個；完整版本 ASR 0.1%、clean goal completion 96.9%，弱化版本 ASR 88.4%–97.6%
- 在 retention 測試中，關閉狀態的版本 ASR 為 95.5%–97.5%；幾何衰減在等待距離 1 時是 0%，距離 2 已回到 97%；非衰減 latch 在所有等待距離維持 0%
- 消融移除不同元件時，失敗模式會依設計預期重新出現，讓「是哪個控制閘門生效」比單一總分更可追蹤
- 系統承認 availability 代價：若 latch 沒有可靠解除或人工 escalation，安全機制本身可能讓服務永久不可用
- ⚠️ 有條件通過、作者自測，尚未外部複現：固定由 deepseek-chat、GPT-4o 系列與 Claude Sonnet 4.6 分任角色，只測一個 frozen cohort 與一個 execution seed，也沒有跨模型角色與多 seed 複驗

### Reviewer 一句話評

形式論證、狀態機與消融把「等待為何能繞過安全」說得很清楚，足以提醒工程師檢查持久化狀態；但單一模型配置、單一 seed 與結構化合成攻擊，使實驗數字目前只能視為概念驗證。

### 給你的 take-away

- 盤點風險旗標是否會因 timeout、session 重建、摘要壓縮或重試機制自動消失
- 非衰減狀態一定要配明確解除條件與人工處理路徑，否則只是把安全問題換成 availability 問題

---

## 今日收穫

今天真正值得帶走的不是某個防禦把 ASR 壓到小數點後幾位，而是執行權應該有自己的資料與狀態：證據看起來完整，不等於事件可知；工具輸出能影響規劃，不等於取得使用者授權；某一輪擋住攻擊，也不等於跨迴圈風險已解除。Agent 一旦能造成外部後果，答案生成與執行授權就該是兩條可分開觀測、測試與撤銷的路徑。

## 參考資料

- Aggarwal, *Calibrated Enough to Know, Not Calibrated to Act*：[arxiv 2608.27167](https://arxiv.org/abs/2608.27167)、[研究程式碼與預註冊資料](https://github.com/Pranav-1100/confidence-calibration-evaluation)、[Zenodo 存檔](https://doi.org/10.5281/zenodo.22043517)
- Guo et al., *When Tool Outputs Become Commands*：[arxiv 2608.27146](https://arxiv.org/abs/2608.27146)
- Wu et al., *Safety Does Not Compose*：[arxiv 2608.27141](https://arxiv.org/abs/2608.27141)
- arXiv 官方公告時程：[Submission Schedule and Cutoff Time](https://info.arxiv.org/help/availability.html)
