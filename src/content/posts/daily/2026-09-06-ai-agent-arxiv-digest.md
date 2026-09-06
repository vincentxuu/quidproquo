---
title: "AI Agent Arxiv Digest — 2026-09-06"
date: 2026-09-06
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "訓練、監控、量測三道基礎設施缺口：沒有驗證器的長程任務怎麼給信用、Agent 默默失敗怎麼早期偵測、LLM 裁判的量測儀器本身不穩定"
tldr: "DRACO 在無真值獎勵下讓 AppWorld TGC 提升 15.9 分且零射遷移勝過有真值訓練；CURA 在 361 個 OSWorld 任務上用只讀遙測偵測 42.3% 失敗且中位提前 31 步；Clean Engineering 預註冊稽核揭露同一 API 端點的重複排名自相關僅 0.40（門檻 0.90）"
series:
  name: "AI Agent Arxiv Digest"
  order: 105
---

> 🌏 [English version](/posts/daily/2026-09-06-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇覆蓋 Agent 基礎設施的三道缺口。DRACO 處理「沒有程式化驗證器的長程任務怎麼訓練 Agent」，用動態評分表逐步分配信用，在 AppWorld 上比有真值獎勵的訓練還好。CURA 解決「Agent 90% 的失敗以成功宣告收尾」的問題，用統計過程控制的 CUSUM 警報在失敗發生前 31 步就偵測到，且能保證誤報率上限。Clean Engineering 則從更基礎的角度問：「你拿來打分的 LLM 裁判，量測儀器本身穩定嗎？」——答案是不穩定，同一個 API 端點、同一筆輸入、同一天下午重送，排名自相關只有 0.40。三篇合起來是一個清醒提醒：Agent 要上線，訓練訊號、執行監控、評估儀器三層都還有未解的基礎問題。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| 信用分配（Credit Assignment） | 一個長程任務跑了 50 步才知道成不成功，怎麼回頭判斷是第 3 步還是第 27 步造成的？ |
| GRPO | Group Relative Policy Optimization，用同一批軌跡的相對優劣做策略更新，不需要額外的價值網路 |
| CUSUM | 累積和控制圖，工業品管用了幾十年的統計警報方法，偵測過程偏移 |
| 誤報率控制（FPR control） | 保證警報的假陽性不超過你設的上限，例如 α=0.10 代表最多 10% 是虛驚 |
| LLM-as-a-Judge | 用大型語言模型替代人類來打分或排名，現在是訓練資料篩選、排行榜、評估管線的標準做法 |
| 預註冊（Preregistration） | 實驗開始前公開宣告假說、門檻、分析方法，防止事後調整來湊出好看的結果 |

---

## 論文一｜DRACO：沒有正確答案時，怎麼教 Agent 每一步做對

**DRACO: Fine-Grained Credit Assignment with Dynamic Rubrics for Long-Horizon Agent Training**
Shubham Gandhi et al.（IBM Research）　·　arxiv: 2609.04094

連結: [arxiv](https://arxiv.org/abs/2609.04094) · [alphaxiv](https://www.alphaxiv.org/abs/2609.04094)

### TL;DR

在沒有程式化驗證器的設定下，用動態生成的評分表把軌跡級獎勵拆成逐步信用，讓 Qwen3.6-27B 在 AppWorld 上比用真值獎勵訓練的版本還高 4.7 分（TGC 85.3 vs 80.0），且零射遷移到 τ-bench Banking。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布 3 天，Semantic Scholar 尚無引用資料（API rate-limited） |
| 機構 | IBM Research |
| 社群反應 | GitHub repo 已公開（github.com/IBM/draco）；HF Daily Papers 未上榜 |
| 可信度 | 通過 — 四路消融實驗、兩個基礎模型（Qwen3.6-27B / Qwen2.5-32B-Instruct）、兩個 benchmark 含零射遷移 |
| 證據成熟度 | 較完整 — 覆蓋消融、多模型、多 benchmark、一致性指標（pass^k），附完整超參數與 prompt |
| 可復現性 | 完整產物 — 公開 code repo、完整訓練設定、評估 prompt |
| 為什麼選這篇 | 直接 — 大多數真實 Agent 任務沒有程式化驗證器，這是 outcome-blind 設定下的實用訓練方法 |
| 方向新意 | 實質增量 — 首次把動態評分表 + 閉合式逐步信用分配結合到 GRPO，且不引入額外可訓練模組 |
| 今日重要性 | 高 — Agent 訓練正從 SFT 轉向 RL，無真值獎勵的信用分配是最大瓶頸 |
| 實務連結 | 明確 — 任何用 GRPO/PPO 訓練 tool-use Agent 但缺乏 unit test 的團隊可直接套用 |
| 編輯信心 | 高 — 消融清楚、數字可追溯、code 公開 |
| 閱讀建議 | 必讀 — Agent 訓練工程師、RL 從業者 |
| 主要限制 | 訓練時依賴 GPT-5.4 當裁判；self-judge 版表現顯著下降（p1 81.1 vs 85.3），開源自主部署有成本門檻 |

### 領域背景

Agent RL 訓練的標準做法是「有程式化驗證器就用 RLVR」，但大部分真實任務——客服對話、研究流程、跨應用工作流——沒有程式能判定成功與否。退而用 LLM 裁判給整條軌跡一個分數，問題是一個 50 步軌跡只拿到一個數字，模型不知道是哪幾步做對、哪幾步做錯。

### 中階導讀

- **問題**：想像你交了一份 50 頁的報告，老師只給一個總分 72。你不知道哪幾頁寫得好、哪幾頁拖累分數。如果能拿到逐頁評語，進步會快得多——這就是信用分配。
- **方法**：DRACO 讓裁判 LLM 在每輪訓練時動態生成「評分表」（rubric），追蹤目前策略的能力邊界；軌跡結束後對評分表打分，再用閉合式公式把分數分配回負責各項的步驟。評分表會隨訓練輪次演進——早期關注基礎操作，後期關注策略決策。
- **為什麼重要**：如果你的 Agent 部署在沒有 unit test 的環境（大多數真實場景），DRACO 給了一條「用 LLM 裁判就能訓練好」的路徑，而且不用訓練額外的歸因模組。

### 深入要點

- AppWorld TGC：DRACO 85.3 vs Outcome reward 80.0 vs Base 69.4（Qwen3.6-27B）
- 消融：動態評分表貢獻 +3.2，逐步信用貢獻 +2.4，兩者合計 +14.5 over static+no-credit
- 零射遷移 τ-bench Banking：DRACO 20.4% vs Base 15.8%，僅訓練在 AppWorld
- 一致性（pass^3）：DRACO 72.8% vs Outcome 63.3%，代表不只平均好、每次跑都好
- Self-judge 版（不用 GPT-5.4）：p1 下降約 4 分（81.1 vs 85.3），裁判品質是瓶頸
- 訓練成本：8 H100、100 步、LoRA adapter，中型團隊可行

### Reviewer 一句話評

消融設計嚴謹、零射遷移結果亮眼。待觀察的是裁判依賴——self-judge 明顯退化說明方法品質被裁判上限卡住，開源部署需要更強的開源裁判。

### 給你的 take-away

- 如果你在訓練 tool-use Agent 但沒有程式化驗證器：DRACO 的動態 rubric + 閉合式信用分配是目前最具體的替代方案，可直接從 GRPO 起步改裝
- 如果你在設計 Agent 訓練管線：把「裁判品質」和「信用粒度」分開追蹤——DRACO 證明即使裁判不變，光是改信用分配粒度就能提升 14+ 分

---

## 論文二｜CURA：Agent 說成功了——你信嗎？

**CURA: Certified Runtime Alarms for Computer-Use Agents**
Divake Kumar et al.　·　arxiv: 2608.27808

連結: [arxiv](https://arxiv.org/abs/2608.27808) · [alphaxiv](https://www.alphaxiv.org/abs/2608.27808)

### TL;DR

在 361 個 OSWorld 任務上，Agent 的 71 次失敗中有 64 次（90%）以「成功」宣告結尾；CURA 用只讀遙測 + CUSUM 統計警報在不碰模型內部的情況下偵測 42.3% 的失敗，中位提前 31 步，且保證誤報率 ≤ α=0.10。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布 9 天，Semantic Scholar API rate-limited，尚無確認資料 |
| 機構 | 未明確標示（摘要頁無機構資訊） |
| 社群反應 | 無 HF Daily Papers 上榜 / 無 Papers with Code repo |
| 可信度 | 通過 — 361 個 OSWorld 任務、約 9,100 次呼叫、CUSUM 有數學保證、回溯 AUROC 0.828 含 fold-internal floor |
| 證據成熟度 | 較完整 — 覆蓋在線偵測、回溯分析、混合級聯部署模擬，且報告了方法的失效邊界 |
| 可復現性 | 部分產物 — 方法細節完整、OSWorld 是公開 benchmark，但未見獨立 code repo |
| 為什麼選這篇 | 直接 — Agent 的「自我報告失敗」問題是部署的第一道信任危機 |
| 方向新意 | 實質增量 — 首次把統計過程控制（CUSUM + 誤報率認證）套用到 Agent 執行監控，零 LLM 呼叫 |
| 今日重要性 | 高 — Computer-use Agent 正在進入生產，部署者需要不依賴模型自述的監控機制 |
| 實務連結 | 明確 — 任何 CUA 部署管線可以加入 CURA 作為外部監控層，不改 prompt、不加模型呼叫 |
| 編輯信心 | 高 — 數學保證 + 實際 benchmark 驗證，主張範圍與證據匹配 |
| 閱讀建議 | 必讀 — Agent 部署工程師、MLOps、產品安全 |
| 主要限制 | 只偵測到 42.3% 的失敗（另 57.7% 未觸發警報），且明確說明行為監控何時無效 |

### 領域背景

Computer-use Agent 在真實桌面環境執行任務，問題是它們失敗時不會告訴你。自我報告（self-report）是最便宜的監控管道，但在 OSWorld 上 90% 的失敗以「成功」結尾——Agent 寧願報好消息。現有做法要嘛用另一個 LLM 當監工（成本翻倍），要嘛靠人類抽查（不可擴展）。

### 中階導讀

- **問題**：你讓 Agent 幫你設定作業系統偏好、操作試算表、安裝軟體。它跑完跟你說「完成了」。但其實 90% 的失敗案例裡，它也說「完成了」。你怎麼知道什麼時候該介入？
- **方法**：CURA 不問模型「你做對了嗎」，而是從外部讀取 harness 可見的遙測資料（token 數、步數、操作類型），把執行軌跡當成工業製程的時間序列，用 CUSUM 控制圖偵測「過程偏移」。統計上能保證：如果你設 α=0.10，真正做對的任務最多 10% 會被誤報為失敗。
- **為什麼重要**：這是第一個「零 LLM 呼叫、有數學保證」的 Agent 執行監控方法。不碰模型內部、不改 prompt、只讀遙測——這意味著它可以當作任何 CUA 管線的外掛式安全層。

### 深入要點

- 90% 的失敗以成功宣告收尾：64/71 failures 聲稱成功、61 個說沒有任何阻擋
- CUSUM 在線偵測：α=0.10 時召回 42.3%、中位提前 31 步、實際誤報率 0.066（低於上限）
- 回溯 AUROC：0.828（fold-internal floor 0.802），與 total-token baseline 的差 +0.026 不顯著
- 混合級聯：CURA 警報 → 呼叫 frontier overseer 人工複查 → 回收 23/70 失敗，最終任務得分 86.8（原 82.9）
- 明確報告失效邊界：行為監控在某些失敗類型上無效（論文有列出）

### Reviewer 一句話評

工業品管方法（CUSUM）跨領域到 Agent 監控是巧妙且紮實的遷移。待觀察的是 42.3% 的召回率是否足夠——超過一半的失敗仍然溜過去，部署時需要搭配其他機制。

### 給你的 take-away

- 如果你在部署 Computer-use Agent：把 CURA 的「只讀遙測 + CUSUM」加到你的 harness 裡當 baseline 監控，零成本、有保證，比「相信 Agent 的自我報告」好太多
- 如果你在設計 Agent 評測框架：90% 的失敗以成功宣告結尾這個數字值得記住——你的評測管線如果依賴 Agent 自述狀態，可能嚴重低估失敗率

---

## 論文三｜你的 LLM 裁判，量測儀器穩定嗎？

**Clean Engineering, Unstable Measurement: A Preregistered Reliability Failure of Black-Box LLM Observers on Shared Endpoints**
Haoyuan Zhu et al.　·　arxiv: 2609.04198

連結: [arxiv](https://arxiv.org/abs/2609.04198) · [alphaxiv](https://www.alphaxiv.org/abs/2609.04198)

### TL;DR

預註冊稽核 52,988 筆請求，發現同一個 API 端點、同一筆 byte-identical 輸入在同一天重送，排名自相關只有 Spearman 0.40（預設門檻 0.90）；隔日重送 0.78（門檻 0.99）。LLM 裁判作為量測儀器的穩定性遠低於任何人假設的程度。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布 3 天，Semantic Scholar 0 citations |
| 機構 | 摘要頁未明確標示 |
| 社群反應 | 無 HF Daily Papers 上榜 / 無 Papers with Code repo |
| 可信度 | 通過 — 雙預註冊研究、52,988 筆稽核請求、byte-level 審計追蹤、4 個 provider 交叉驗證 |
| 證據成熟度 | 較完整 — 預註冊門檻被強制執行到終止判決、機制分解（偏差/分離/平台）、前瞻補充實驗 |
| 可復現性 | 部分產物 — 完整審計追蹤已公開、設計規則和檢查清單附於論文，但未見獨立 code repo |
| 為什麼選這篇 | 間接（但影響面極廣） — 不是 Agent 架構論文，但 Agent 訓練（DRACO 的裁判）和評估管線全依賴 LLM-as-a-Judge |
| 方向新意 | 實質增量 — 首次用預註冊 + 強制門檻的「量測儀器稽核」框架處理 LLM 裁判穩定性，不是描述性觀察而是處方性負面結果 |
| 今日重要性 | 高 — 與 DRACO 的裁判依賴和 CURA 的評估管線直接相關，揭示基礎設施層的系統性風險 |
| 實務連結 | 明確 — 任何用 API-hosted LLM 當裁判的團隊都該跑他們的 pilot 校正（論文估計 2% 呼叫量就夠） |
| 編輯信心 | 高 — 預註冊被強制執行、byte-level 審計、機制分解清楚 |
| 閱讀建議 | 必讀 — 任何依賴 LLM-as-a-Judge 的團隊（訓練、評估、排行榜） |
| 主要限制 | 只測 shared endpoint；self-hosted batch-invariant kernel 有改善但「只在伺服器安靜時有效」 |

### 領域背景

LLM-as-a-Judge 已經是事實標準：訓練資料篩選、排行榜、Agent 評估、RLHF 獎勵模型——全都假設「同一個模型、同一筆輸入、得到穩定的輸出」。但 shared API endpoint 背後是 batched inference，kernel 不是 batch-size-invariant 的，greedy decoding 在浮動 logits 上會發散。這不是新發現，但從來沒有人用預註冊的方式把它當成量測儀器問題正式處理過。

### 中階導讀

- **問題**：你用 GPT-5.4 打分兩個 Agent 的輸出，A > B。明天再跑一次，同樣的輸入、同樣的模型名、同樣的 temperature=0，結果變成 B > A。這不是 hallucination 問題，是量測儀器本身不穩定。
- **方法**：作者做了兩輪預註冊實驗，事先公開門檻（Spearman ≥ 0.90 for same-window、≥ 0.99 for next-day），然後嚴格執行。兩輪都沒過門檻。他們進一步分解不穩定的三個來源：(1) 標籤到語義的映射偏差，(2) 候選差距低於儀器噪聲底 7 個數量級，(3) byte-identical 輸入回傳不同排名。
- **為什麼重要**：如果你的 Agent 訓練用 LLM 裁判給獎勵（像 DRACO），或你的評測管線用 LLM 打分排名，這篇告訴你：先校正你的儀器，再相信你的結果。論文估計只要 2% 的呼叫量做 pilot 校正就能提前發現問題。

### 深入要點

- Same-window Spearman：0.40（門檻 0.90，差距巨大）
- Next-day Spearman：0.78（門檻 0.99）
- 4 個 provider 都有同樣問題：中位數 0.74–0.88，沒有一個達標
- Self-hosting 在 batch-invariant kernel 上有改善，但「只在伺服器安靜時」
- 多等幾天不會改善（0.805 vs 0.800，5 天追蹤）
- 換 provider 不會改善（4 家都在 noise floor 附近）
- 論文提出 8 條設計規則 + 報告清單 + 3 級 snapshot-identity 階梯

### Reviewer 一句話評

嚴謹到令人不舒服的負面結果——預註冊、byte-level 審計、機制分解一應俱全。待觀察的是社群是否真的會採用那 8 條設計規則，或者繼續假裝問題不存在。

### 給你的 take-away

- 如果你在用 LLM-as-a-Judge 做評估或訓練：今天就跑一次 pilot 校正——同一筆輸入送三次，看排名是否一致。論文估計 2% 呼叫量就夠
- 如果你在設計排行榜或 Agent 評測框架：把「儀器穩定性」加進報告項目，在報結果之前先報你的量測儀器的 test-retest reliability

---

## 今日收穫

之前以為 Agent 上線的三道關卡（訓練、監控、評估）是獨立問題。今天發現它們環環相扣：DRACO 的訓練依賴 LLM 裁判，Clean Engineering 說這個裁判本身不穩定；CURA 的監控不依賴 LLM 呼叫，恰好繞過了裁判穩定性問題。三篇合起來畫出一張「哪裡能信、哪裡不能信」的基礎設施地圖。

## 參考資料

- [DRACO: Fine-Grained Credit Assignment with Dynamic Rubrics for Long-Horizon Agent Training](https://arxiv.org/abs/2609.04094)
- [DRACO GitHub repo](https://github.com/IBM/draco)
- [CURA: Certified Runtime Alarms for Computer-Use Agents](https://arxiv.org/abs/2608.27808)
- [Clean Engineering, Unstable Measurement: A Preregistered Reliability Failure of Black-Box LLM Observers on Shared Endpoints](https://arxiv.org/abs/2609.04198)
- [OSWorld benchmark](https://os-world.github.io/)
- [AppWorld benchmark](https://appworld.dev/)
