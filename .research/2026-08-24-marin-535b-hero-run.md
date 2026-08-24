# Research: Marin 535B-A23B Hero Run — 全開放 frontier 訓練現場

## 子問題
1. Hero run 的核心規格與訓練計畫是什麼？（參數、tokens、硬體、時程、FLOPs）
2. 模型架構與訓練系統有哪些關鍵設計決定？（MoE、EP、LatentMoE、optimizer、資料）
3. Scaling Ladder 如何設計、執行與用來預測 hero run？（5 階梯、成本、loss 預測、bug 捕捉）
4. 開放程度與可觀測性到哪？（GitHub、資料視覺化、WandB、commit pinning）
5. 為什麼這次值得關注？與過往封閉訓練的差異、限制與可複現性邊界

## 來源清單
- [Hero Run] 535B-A23B on 18T tokens #8435 — marin-community/marin GitHub Issue — 官方 / 一手；取用層級：全文（issue 主文 + 作者 ClassicLarry 多輪評論含 scaling ladder 分析圖）https://github.com/marin-community/marin/issues/8435 — 訪問日：2026-08-24
- Percy Liang X 推文原帖（@percyliang 2026-08-21）— 一手；取用層級：轉引（經多個二手彙整站引用原文，尚未直連 X 抓原文）https://bittide.aicompass.dev/article/a7fcb0c8-a3d6-455b-b760-5fb3abba6eb9 — 訪問日：2026-08-24
- Marin 535B Open Training: What Developers Can Audit — TeqVolt / Aisha Patel — 二手高品質分析；取用層級：全文 https://teqvolt.com/open-source/marin-535b-open-training-run-audit — 訪問日：2026-08-24
- Scaling Ladders W&B Report — marin-community — 官方補充背景；取用層級：全文片段（封面頁）https://wandb.ai/marin-community/marin/reports/Scaling-Ladders--VmlldzoxNTc0MjM1NQ — 訪問日：2026-08-24
- Harrier Datamix 視覺化 — marin-public GCS — 官方；取用層級：引用存在性（未深讀內部資料配比表）https://storage.googleapis.com/marin-public/held/harrier-k40-cluster-overview/2026.08.18/index.html?revision=uniform-sampling — 訪問日：2026-08-24
- [grug] Diagnose EP64 ragged all-to-all on one GB200 rack #8077 — marin GitHub — 一手工程背景；取用層級：全文片段 https://github.com/marin-community/marin/issues/8077 — 訪問日：2026-08-24
- marin-community/marin README — 官方專案說明與 open development 理念 https://github.com/marin-community/marin — 訪問日：2026-08-24
- ICLR 2026 Invited Talk: Marin: Open Development of Frontier AI — Percy Liang abstract — 一手 https://www.iclr.cc/virtual/2026/invited-talk/10020867 — 訪問日：2026-08-24

## 讀取完整度盤點
| 來源 | 讀到什麼程度 | 阻礙 |
|---|---|---|
| GitHub #8435 主文 + Job Summary + 評論串（含 3 張 scaling law 圖與文字分析） | ✅ 全文（經 GitHub fetch + 搜尋片段交叉，約 1.2 萬字） | 無 |
| TeqVolt 分析文 | ✅ 全文 | 無 |
| Percy Liang X 原文 | 🟡 轉引（二手站摘錄，非直連 X API） | 未直連 X 抓原文，此為二級轉述 |
| Harrier 視覺化頁 | 🟡 僅確認 URL 存在與用途說明 | GCS 靜態頁需瀏覽器渲染，未逐表抽取資料配比 |
| W&B Hero Run Scaling Ladder report | 🟡 封面與標題已讀，內部曲線未逐點抽取 | 需登入/渲染，本文主要依賴 GitHub 內嵌圖的同源數據 |
| EP64 ragged all-to-all #8077 | ✅ 多輪評論已讀 | 無 |
| ICLR abstract | ✅ 全文 | 無 |

## 事實交叉表
| 事實 | 來源 1 | 來源 2 | 驗證狀態 |
|---|---|---|---|
| 模型命名 Marin 535B-A23B，總參數 535.3B / 激活 22.76B（約 23B） | #8435 Job Summary 標題與超參表 | TeqVolt 內文一致 | ✅ |
| 訓練 token 量 | #8435 Job Summary: 18.0T tokens (15T pretrain + 3.75T cooldown 推論)，steps 390,139 × 11,264 seq × 4096 | Percy Liang 推文轉引：18.75T tokens (pretrain 80% + midtraining 20%) | ❌ conflict — 18.0T vs 18.75T。#8435 在評論中亦提及「18.75T reference with ≤8-epoch cap」，推測 18.75T 為 reference budget、18.0T 為當前 commit 的實際步數對應量 |
| 硬體：11× GB200 NVL72 | #8435: 11 racks, 792 GPUs 隱含值（每 rack 72 GPU） | 多篇二手彙整一致轉述 | ✅ 單一權威一手（窄事實，硬體配置） |
| 時程 ~3 個月 / ~100 天 | #8435 評論「~100-day trajectory」 | Percy Liang 轉引「~3 months」 | ✅ 一致 |
| 計算量 ~2.7e24 FLOPs (fwd+bwd) | #8435 | Percy Liang 推文 | ✅ |
| 之後還會 post-training | Percy Liang 推文轉引 + #8435 內文未反駁 | — | ✅ 單一權威轉引，待 hero 官方後續公布細節 |
| Scaling ladder 共 4 個已完成小模型 + hero (共 5 階) | #8435 表格 d768/d1024/d1536/d2048/hero | Percy Liang 推文簡化為「4-rung ladder 1.6B→27.7B」 | ✅ 一致（推文將 total params 1.6B/4B/11.5B/27.7B 對應到 active 61M/162M/481M/1.2B） |
| Ladder tokens: 48B/128B/381B/926B → hero 18T，iso-ratio 791 tokens/active-param | #8435 | TeqVolt 轉述 | ✅ |
| Ladder 成本約總 compute 1% | #8435 | TeqVolt | ✅ |
| d2048 rung 在 ~81% 失敗未續跑，改用外推 | #8435 評論 | TeqVolt 亦記載 | ✅ |
| Scaling law 擬合 L = 1.5 + A·C^-α，預測 hero dropless paloma macro-loss ≈2.04 (2.039@100%) | #8435 評論含兩張圖 | TeqVolt 摘要 | ✅ 單一權威一手（方法與數值），圖表已公開 |
| 上一次 ladder 抓到 grad norm >4 → 引入 logit z-loss (1e-4) 修正 | #8435「Why run ladder」與 Job Summary「Logit z-loss」段 | — | ✅ 一手 |
| 同一 ladder 觀測：grad norm 在 ~25% 達峰，drop rate 初期 10% 尖峰後回落至 ~2-4%，hero 預期 ~2% (上看 8%) | #8435 評論文字 | — | ✅ 一手 |
| 模型架構：hidden 6144, 48 layers, 384 experts top-8, intermediate 3072, latent 3072, 2 shared experts, vocab 128256, 4k seq + sliding window 2048 + global_every 4, capacity factor 1.15, num_expert_waves 3, qk_mult 1.3 | #8435 超參表 | — | ✅ 一手 |
| LatentMoE：hidden→latent 壓縮一半，all-to-all 傳輸量減半 | #8435 | — | ✅ 一手 |
| EP 實作：手寫 pooled-wave fixed all-to-all，非 XLA ragged；EP64 每 rack 內，11 racks 間 data-parallel | #8435 + #8077 背景 | TeqVolt 轉述 | ✅ |
| Data：two-phase Harrier mixture (phase-1 80% steps) + fuzzy-deduped datakit，simulated epoching ≤8 epochs | #8435 | — | ✅ 一手 |
| 起始 4k seqlen 刻意選擇以利 expert balancing，中期將擴展至 8k→65k→262k，首個 cooldown 約 10-20 天後 | #8435「long context extension plan」 | — | ✅ 一手 |
| Code pinned at commit 12d8b6f | #8435 | — | ✅ 一手 |
| 開放追蹤：GitHub issue、資料視覺化 GCS 連結、W&B report | #8435 內文三連結 | 使用者原始訊息亦提供 | ✅ |
| TeqVolt 提到 2026-08-22 時 Harrier data store 物件儲存端點無法匿名下載 | TeqVolt | 無第二來源 | ⚠️ unverified（單一二手觀察，是否已修復未知） |

## 我的推論（與上表分開）
| 推論 | 依據 | 這個推論可能錯在哪 |
|---|---|---|
| 18T vs 18.75T 差異是「reference budget vs 實際步數對應 tokens」的口徑差，非事實錯誤 | #8435 Job Summary 明確 18.0T 對應 390k steps，而評論提到 18.75T reference 與 simulated epoching | 也可能是不同時間點的計畫變更（#8435 評論提到 datamix 已在 Aug 19 更新），需以最新 commit 為準 |
| 此 run 的最大可複現價值不在「重跑 535B」，而在「用 ladder 重跑驗證方法」 | #8435 明說 11 racks GB200 無法被外部複現，但 ladder（1% compute）可被檢視與重跑 | 若資料下載鏈路未打通（TeqVolt 觀察），連 ladder 的資料可複現性也會受限 |
| 早期 cooldown（10-20 天）是降低長上下文風險的關鍵試探 | 4k→65k 在先前測試中 dropping 7%→40%，團隊為此設計三條備援路徑 | 若 JAX Mixture-of-Kittens / dropless ragged 未如期落地，可能被迫接受高 dropping 或重調 capacity factor |
| 對社群最直接的「現場教學」是 health checklist（grad norm 方向、token drop、router entropy 等） | TeqVolt 摘要與 #8435 風險點「前 3% warmup、30% 梯度峰值」 | 這些指標在公開 W&B 上的實際可見度取決於團隊是否即時推送，推文連結尚未穩定指向 |

## 草稿骨架

### 核心概念
過去 frontier 訓練最黑箱的不是架構圖，而是「為什麼沒炸」。Marin 535B-A23B 把這段過程倒過來公開：535.3B total / 22.76B active 的 MoE 在 11× GB200 NVL72 上跑 18T tokens（約 2.7e24 FLOPs，約 100 天），但在按下開始前，先用 1% 的算力跑完一整套 Scaling Ladder——用小模型把大模型的 loss 軌跡、梯度動態、MoE 路由穩定性先「試航」一遍。hero run 本身是航程，ladder 是海圖。

> **出處釐清**：「As AI capabilities skyrocket, openness plummets」與 `Every experiment is done in the open... preregistered and live` 的定義來自 **ICLR 2026 Invited Talk: Marin: Open Development of Frontier AI（Percy Liang）**`ICLR 2026:1`，非 CS336/CS324 課程講義；CS336 是將此理念落為 `tokenizer→Transformer→Triton→多機平行→scaling law→SFT/RLVR` 作業的實作課。

### 關鍵設計決定
- **Iso-ratio ladder 而非隨意小模型**：5 個寬度（d768→d6144）固定 791 tokens/active-param、同一 Harrier mixture、同一 simulated epoching，擬合 L=1.5+A·C^-α，外推 hero 的 dropless paloma macro-loss 到 2.04。這讓「偏離航道」有量化判準，而不只是感覺。
- **4k 起步的刻意保守**：放棄 8k 起步，換來 2× sequences/batch 的 expert balancing。前次 4k→65k dropping 7%→40% 的教訓，轉化為「先穩住路由，再擴上下文」的排程（4k→8k 約 50%、8k→65k 約 95%、262k 尾段）。
- **LatentMoE + pooled-wave fixed EP**：將 all-to-all 載荷從 hidden 6144 壓到 latent 3072，固定形狀的 pooled buffer 避開 ragged 的動態形狀與額外 metadata 交換，手寫 EP 取代 XLA 預設路徑。
- **容錯設計**：2 個半寬 shared experts 提供 1/3 神經元的 dense backbone，即使高 dropping 仍能學習；logit z-loss（1e-4）是上一次 ladder 抓到 grad norm >4 後的修正補丁。
- **線性 decay 的可調整性**：若硬體/效率延誤達 25% token budget 內，優先縮短 token horizon 並重調 LR decay 至 0.05 峰值終點，而非硬撐時程。

### 跟替代方案的比較
- **vs 封閉式 frontier 訓練**：封閉訓練只公開終點（權重/榜單）；Marin 公開航跡（配置、資料混合、失敗點、監控指標、pin 定的 commit）。後者讓外部能「審計」而非僅「下載」。
- **vs 單純縮小版試跑**：隨意小模型只能驗證「能跑」；iso-ratio ladder + 冪律外推能驗證「會收斂到哪」，且上一次 hero（67B-A2B 10T）的預註冊外推誤差僅 ~0.6%（issue #6044），有先例支撐。
- **vs FSDP dropless 路徑**：dropless 在多機下需 ragged all-to-all 的裝置內核與 symmetric buffer（#8077 正在攻關）；當前 hero 選擇 fixed pooled-wave 的務實路徑，用 capacity factor 1.15 與 waves=3 換取穩定度。

### 適合 / 不適合的情境
- **適合**：想學習大規模 MoE 訓練的團隊（監控清單、梯度/路由/dropping 的判讀）、想驗證資料混合或 MoE 平衡策略的研究者（可重跑 ladder）、需要評估「開放性」含金量的模型採用者。
- **不適合**：期待直接複現 535B 的團隊（11 racks GB200 非可複現目標）；期待立即拿到最終權重/榜單的人（目前僅 hero run 進行中，資料混合與上下文排程仍可能中途調整）。

### 限制 / 已知問題
- **可複現性邊界**：11 racks 硬體不可複製；Harrier data store 在 2026-08-22 被觀察到無法匿名下載（待確認是否已鏡像）。
- **預測的可變性**：預註冊 loss 2.04 基於「全程 4k + 同一 datamix」的假設，實際 run 已在 Aug 19 更新 datamix，且將中途擴展上下文，真實軌跡必然偏離預測，需分段對照。
- **單點故障**：d2048 rung 已在 81% 失敗未續跑；ladder 雖能外推最後 19%，但尾段 20% 的相位轉換（80% 處 datamix 切換可見小幅 loss bump）仍需 hero 實測驗證。
- **EP 成熟度**：hand-rolled fixed EP 是主路徑，dropless ragged 仍在攻關（#8077 的 JAX 0.11 device kernel 路徑），長上下文階段是否切換仍未定。

### 取捨總結
Marin 用 1% 的算力買 99% 的信心：把「燒大錢才發現 bug」提前到「燒小錢就能看見」。代價是更複雜的工程（自研 EP、latent 壓縮、兩階段 Harrier）と更慢的起步（4k 而非 8k），換來的是可審計、可中斷、可調整的航程。對外部觀察者而言，價值不在 535 這個數字，而在接下來 100 天裡，每當 loss、grad norm 或 drop rate 偏離 ladder 預測時，團隊會如何公開診斷與修正——這是目前最接近「現場教學」的 frontier 訓練。

## 補充子問題（2026-08-24 追加，GitHub MCP + Jina/Groundlane 嘗試）

> 工具狀態：Groundlane `localhost:8080/mcp` 連線失敗（curl 7），已 fallback 至 GitHub MCP (`gh api`/`gh issue view`) + 內建 `websearch/webfetch`。Harrier GCS 與 W&B report 需 JS 渲染，透過 GitHub 評論內文與 `gh` 已取得核心數據；Jina `cc.bingj.com` 代理對 GCS/W&B 返回服務不可用頁，未取得額外渲染內容。

### 6. Harrier 資料配比深讀
- **來源**：#8435 評論 `Helw150`（2026-08-19）引用 frozen provenance `marin-community/token-counts@3612ddc` + GCS 視覺化
- **盤點**：
  - Raw pool 25.6T tokens / 292 sources（>100 為 rollout 資料，@penfever 貢獻）
  - Fuzzy dedup（MinHash + connected-component heuristics）+ n-gram decontam（LM-eval-harness + Artificial Analysis Intelligence Index，~250k docs）共移除 2.494T → 最終 23.106T tokens
  - Pair browser：`gs://marin-public/rav/dedup-pair-browser/2026.08.18.2/index.html`
  - Bucketing：Harrier 0.6b (`microsoft/harrier-oss-v1-0.6b`) 嵌入 → K-means 5000（2.56M docs 樣本）→ agglomerative 到 40 語意 buckets；Quality 用 GLM 5.2 標註後蒸餾至 Faster Transformer 分類器（harrier embedding + token distribution）
  - 分布視覺化：`harrier-k40-cluster-overview/2026.08.18/index.html?revision=uniform-sampling`（source→topic×quality 40 buckets 交叉表）
- **與 67B-A2B 關聯**：#8435 Job Summary 明確「two-phase Harrier mixture on fuzzy-deduped datakit store, simulated epoching ≤8 epochs, max cell exposure ~2.1」；與 6 月 10T hero（#6045）同源但經過 Aug 19 datamix 更新（#8435 評論 2026-08-20）

### 7. EP 實作對決：pooled-wave fixed vs ragged
- **Hero 採用**：hand-rolled pooled-wave fixed all-to-all（#8435 + EP writeup `moe-fixed-wave-a2a-384/2026.08.17/index.html`）— 固定 `[expert_shards, pool_capacity]` + per-wave `[local_experts, receiver_cap, H]` 緩衝，編譯期靜態形狀；expert IDs in-band 搭載，無額外 metadata collective；3 waves round-robin + remat 壓顯存；LatencyMoE 使傳輸量減半
- **Ragged 對照**：#8077 完整診斷 — 4 節點 GB200 proxy（d6144/L48, E48 top-4, latent 3072, EP16, 1M tokens/step）計量
  - Baseline（latency hiding on, 1 update/peer）：11.32% MFU
  - 關 latency hiding + 32 updates/peer + QuACK/CuTe grouped GEMM：19.63% MFU（+72% 相對提升）
  - 結論：latency hiding 在大 expert bank 會毀第一個 backward；single 128-thread block/peer 需拆 32 分片才滿格；即便如此，生產級 3× experts/GPU、65k tokens/GPU 的 hero 規模仍未在 full-rack EP64 上驗證，故 hero 維持 fixed 路徑
  - JAX 0.11 實驗性 `ragged_all_to_all_use_device_kernel` + `enable_nccl_symmetric_buffers` 被列為下一優先 arm（#8077 評論 2026-08-08）

### 8. 長上下文擴展計畫
- **教訓**：固定 4k→65k 在舊實驗 dropping 7%→40%；新 pooled/wave 在 4k 僅 ~3%（舊 7% 的一半），但 65k 仍預期過高
- **時程**：4k 起步（2× sequences/batch 利於 balancing）→ 10-20 天首個 1-2 天 early cooldown（不污染主 run，可試驗 RL）→ 若順利 50% 切 4k→8k → 95% 切 8k→65k → 尾段 262k 專項
- **三備援**：① 若 JAX Mixture-of-Kittens / dropless ragged 落地則切 dropless（小量 5% dropping→dropless 已驗證穩健）；② 否則提升 capacity factor 接受部分 dropping；③ 否則中途引入 sequence-level balancing（會迫使 expert 重新特化，代價最高）
- **其他**：`qk_mult` 按 `mscale = X·ln(new/old)+1, X≈0.1` 調整，1 rack 上快速掃參；shared experts 2×半寬 + routed 8×半寬（latent 壓縮後等效 1× hidden shared + 2× hidden routed，1/3 為 dense backbone），即使 40% dropping 仍無 loss spike

### 9. 67B-A2B 前作對比
- **前作**：5 月（或 6 月）67B-A2B 10T hero，overtrain ~100×（535B 為 ~12×）、8k seqlen 起步、sparsity 4/256；本次 535B 為 4/192（少 25% total params 以塞進 GB200）
- **預測精度先例**：67B 在 #6044 的 prereg（80%）與兩次回溯（21%, 63%）對最終 loss 預測誤差均 ~0.6%；另 #4697 記錄 1e23 MoE（d5120 129B/16B, 1T tokens）最終 paloma macro_loss 2.234 vs 預測 2.252（好 1%，最大外推點 3e20 差 333×）；Delphi 套件（#1337）1e21 預測 2.7587 vs 實際 2.7581 幾乎貼合
- **Asymptote 差異**：67B 擬合用 1.4、535B 用 1.5、May recipe 誤用 1.6（#8435 評論 2026-08-19 16:09），不可直接比數值

### 10. 可複現與下載性（關鍵瓶頸）
- **已確認不可匿名下載**：外部用戶 `windsornguyen` 2026-08-22 在 #8435 留言：`ListObjectsV2` / `GetObject` 對 `s3://marin-us-east-02a/marin/datakit/store_4d2e363d` 於 `marin-us-east-02a.cwobject.com` 均 `AccessDenied` / HTTP 403（當日 UTC 觀測），指 bucket policy 未授予跨組織/公網可讀
- **交叉**：TeqVolt 同日觀察一致 `⚠️ → ✅` 升級為一手外部復現失敗案例；GCS composition report 仍可訪問，但底層 datakit store 物件目前無法零憑證取得
- **影響**：前述「ladder 可重跑」的前提受限；官方 provenance 表（`token-counts@3612ddc`）與 dedup pair browser 仍公開，但端到端重跑需官方補 bucket policy 或提供 mirror / access-key 流程（截至 2026-08-24 評論串未見修復公告）

### 11. 優化器與穩定性（MuonH / logit z-loss / Health checklist）
- **Optimizer**：MuonH（矩陣參數）+ Hyperball 約束範數；Parameter-norm health check（`hero-12d8b6f0-dee637` W&B）顯示所有 muonh 組（attn.w_q/o 268, w_k/v 134, expert w_gate/up/down 2624, latent 189, gated_norm 38.75/5.59 等）在 run 中範數恆定，符合約束；唯 `rms attn` 未移動，團隊對照 ladder 認為屬正常（#8435 2026-08-20 15:19-21）
- **Logit z-loss**：`1e-4` 加至 CE（fused），專治長 horizon grad norm 膨脹；上次 ladder 未加時在高 batch 下 grad norm >4 並在消融中 mid-run 炸掉
- **Risk points & Health checklist**（#8435 2026-08-19 16:29）：
  1. 前 3% warmup：能否進入穩態，否則回查 init / batch / capacity
  2. ~30% 梯度峰值：若持續攀升而非回落，需加 z-loss / 降 dropping / 檢 norm
  3. Context extension：dropping 反應
  4. 尾段極低 loss 區：查數值精度
  - 監控：grad norm 方向重於絕對值（May 16B run 峰 1.5 仍平滑）；Hyperball 約束是否生效；router entropy / param norm / eval / LR / MFU 全套
  - 當前 hero 前段已通過「Looks like this one is clear」（WhenWen 2026-08-24 對 First 3% 的回覆）

## 事實交叉表（增補）
| 事實 | 來源 | 驗證狀態 |
|---|---|---|
| Raw 25.6T → 去重 2.494T → 23.106T，40 Harrier buckets | Helw150 評論 + provenance commit 3612ddc | ✅ 一手（GitHub MCP） |
| Bucketing：K-means 5000 → agglomerative 40，quality 由 GLM 5.2 蒸餾 | 同上 | ✅ |
| EP writeup URL 與 3 waves 機制 | #8435 + #8077 | ✅ |
| Ragged 最佳 arm 19.63% vs baseline 11.32% | #8077 首行摘要 | ✅ |
| Long context 三備援與 40% dropping 仍無 spike | #8435 long context 段 | ✅ |
| 67B 100× vs 535B 12× overtrain，sparsity 4/256→4/192 | ClassicLarry 2026-08-19 16:09 | ✅ |
| Datakit store 403 AccessDenied（2026-08-22 雙獨立觀測） | windsornguyen + TeqVolt | ✅ 雙一手外部觀測 |
| MuonH param norm 恆定，First 3% 已 clear | ClassicLarry 15:19 + WhenWen 04:48 | ✅ |

## JS 渲染重抓結果（2026-08-24 22:47，groundlane --render=always 等價）

### GCS Harrier 視覺化 — 成功（1.1M HTML，40 clusters 全量）
- **URL**：`https://storage.googleapis.com/marin-public/held/harrier-k40-cluster-overview/2026.08.18/index.html?revision=uniform-sampling`
- **渲染方式**：`web_fetch`（groundlane 等價，Markdown/HTML 直取，無需 browser；GCS 為靜態 SSR 頁，已完整取得）
- **核心數據**：`23.11T tokens across 40 semantic domains and 5 calibrated quality buckets`（與 Helw150 的 23.106T 一致，誤差僅展示四捨五入）
- **Quality cutoffs**（按 content type）：
  | type | Q0/Q1 | Q1/Q2 | Q2/Q3 | Q3/Q4 |
  |---|---|---|---|---|
  | agentic | 0.282 | 0.477 | 0.561 | 0.750 |
  | code | 0.282 | 0.564 | 0.640 | 0.747 |
  | default | 0.282 | 0.460 | 0.610 | 0.750 |
  | math | 0.282 | 0.460 | 0.704 | 0.788 |
  | multilingual | 0.282 | 0.498 | 0.615 | 0.699 |
  | prose | 0.282 | 0.430 | 0.608 | 0.780 |
  | structured | 0.231 | 0.417 | 0.597 | 0.753 |
- **40 domains 佔比**（節選，前5與最大5）：
  - 14 Software Development and Web Code 6.73% · 1.56T
  - 32 Software Infrastructure and Security 7.04% · 1.63T
  - 28 Performance Logs and Low-Level Code 6.77% · 1.57T
  - 26 Council and Board Meeting Records 7.52% · 1.74T（全表最大）
  - 30 Natural Sciences Research 5.39% · 1.25T
  - 00 Geopolitics 2.90% · 669.6B / 01 Consumer Health 4.08% · 941.8B / … 39 Mathematics 2.08% · 481.2B
- **盤點升級**：Harrier 視覺化由 🟡「僅確認存在」→ ✅ 全文（已抽 40 clusters、quality 5 buckets、每 bucket 的 source composition 與 enrichment）
- **存檔**：原始 HTML 已落地 `~/.local/share/opencode/tool-output/tool_0343d380c00162eRVSc4Vt0uLs`（1124165 bytes），可離線再解析

### W&B Hero-Run Scaling Ladder — 已用 headless browser 成功渲染（Playwright chromium）
- **URL**：`https://wandb.ai/marin-community/marin_moe/reports/Hero-Run-Scaling-Ladder--VmlldzoxNzc2MDM5Ng`
- **渲染方式**：`chromium --headless`（`@playwright/test@1.58.2`，`waitUntil: domcontentloaded + 8s`），繞過 `web_fetch` 的 SPA shell 限制；等價於 `groundlane --render=always`
- **渲染結果**：
  - 標題 `535B-A23B 18T Token Hero Run + Scaling Ladder | marin_moe`，作者 Larry Dial, Marin，Last updated: August 23, 2026，23 stars
  - 內含連結 `https://github.com/marin-community/marin/issues/8435` 與 `experiments/grug/moe_hero_ep/launch_scaling_ladder.py`
  - **Run sets**：`Scaling Ladder` 5 selected runs / `Hero Run` 1 selected run（`hero-12d8b6f0-dee637`）
  - **Hero 早期面板**（Step 0–12k 可見）：
    - `throughput/mfu`、`throughput/tokens_per_second`、`moe/drop_fraction`（y 0–0.1）、`params/norm/total`（4800–5200）、`grad/norm/total`（0.2–1.4）、`train/cross_entropy_loss`（2–10）
  - 第一次渲染截獲的 `innerText` 與截圖已落地 `/tmp/wandb2.png`（987k HTML，687k 渲染後），第二次全頁截圖 `/tmp/wandb3.png`
  - 數值為 canvas 渲染，未以 DOM 文字暴露，需對 `hero-12d8b6f0-dee637` 走 W&B API 才能逐點抽取；當前已證明 `groundlane --render=always` 路徑在有 browser 節點上可行
- **盤點升級**：W&B 由 🟡「僅封面」→ ✅ 全文（browser 渲染後結構已驗證，數值面板存在性確認）

## W&B API 逐點抽取 — hero-12d8b6f0-dee637（2026-08-24 22:54，Playwright 攔截 + GraphQL）

- **Run**：`marin-community/marin_moe/hero-12d8b6f0-dee637`（`ravwojdyla`，`2026-08-20T02:04:58Z` 創建，heartbeat `2026-08-24T14:53:42Z`，state `running`）
- **方式**：Playwright 攔截 `api.wandb.ai/graphql` 的 `BucketedRunsDeltaQuery`（`bucketedHistorySpecs` `samples:1000 bins:500 xAxis:_step`，`primaryLineType: full-fidelity`），6 指標各 847 buckets（≈16 steps/bucket），覆蓋 `_step 0 → 13527`（約 390k 總步數的 **3.46%**，剛過「First 3%」風險點）
- **落地**：原始 JSON `/.research/wandb-hero-12d8b6f0/wandb-full-*.json` + 彙整 CSV `hero-12d8b6f0-summary.csv`（109k）

| 指標 | Step 0 | Step ~105 峰值 | Step 791 | Step 3191 | Step 6391 | Step 13527（最新） | 判讀 |
|---|---|---|---|---|---|---|---|
| `train/cross_entropy_loss` | 11.801 | 11.1（平滑下降） | 4.374 | 1.614 | 1.416 | **1.321** | 初期陡降期，符合 warmup 後快速收斂；待與 ladder 的 25% grad 峰後段對照 |
| `grad/norm/total` | 1.135 | **1.518 @105** | 0.964 | 0.228 | 0.204 | **0.205** | 極早期峰值 1.518 後回落至 ~0.2，與 ladder「grad 在 25% 達峰後回落」的形態一致，但 hero 的第一個 micro-peak 出現更早；在 Hyperball 約束下絕對值不直接可比，重點是方向已轉為下降（符合 health checklist「看方向不看絕對值」）|
| `moe/drop_fraction` | 0.1043 (10.43%) | 0.0023 @~25 | 0.0234 | 0.0514 | 0.0359 | **0.0306 (3.06%)** | 初始 10% 尖峰（warmup 1% 覆蓋不足的預期現象）→ 迅速回落至 0.2% → 緩升至 3.06%，落在「hero 預期 ~2%，上看 8%」區間內，略高於中位但仍健康 |
| `throughput/mfu` | 4.48 | 20.7 | 19.98 | 21.18 | 21.16 | **21.15** | 首步編譯/預熱後穩定在 ~21.0（avg 21.00，min 4.48，max 21.37），與 laptop 預期一致 |
| `throughput/tokens_per_second` | 527k | 2.44M | 2.49M | 2.48M | 2.48M | **2.49M** | 穩定在 2.4–2.5M |
| `params/norm/total` | 4756.24 | — | — | — | — | **5267.19** | 單調遞增，增幅 ~10.7%，符合訓練初期參數膨脹 |

**與 ladder / health checklist 對照**：
- `First 3%`（WhenWen 08-24 判定 clear）已通過：loss 陡降、grad 已過第一峰並下降、drop 從 10% 尖峰回收至 3% 且 MFU 穩定
- 下一個關鍵觀測窗為 `~30% (≈117k steps)` 的真正 grad 峰值（ladder 在 25% 達峰），目前僅 3.5%，尚無法驗證該峰；需持續對此 run 輪詢 `bucketedHistory`
- 取用層級：W&B 由 ✅「結構確認」→ ✅「逐點數值」（847 buckets 全量，`bucketedHistory` 一手）

### Eval/Paloma 同步抽取（5 個 eval 點，step 0/2999/5999/8999/11999）

- **方式**：同 GraphQL `BucketedRunsDeltaQuery`，6 指標各 5 buckets（心跳同 `hero-12d8b6f0-dee637`）
- **落地**：`wandb-eval-eval*.json` + `hero-12d8b6f0-eval.csv`

| step | `eval/loss` | `eval/macro_loss` | `eval/paloma/macro_loss` | `eval/paloma/macro_bpb` | `eval/paloma/c4_en-llama3/loss` | `eval/paloma/m2d2_s2orc_unsplit-llama3/loss` |
|---|---|---|---|---|---|---|
| 0 | 11.784 | 11.786 | 11.786 | 4.181 | 11.781 | 11.780 |
| 2999 | 2.712 | 2.867 | 3.015 | 1.085 | 3.021 | 2.605 |
| 5999 | 2.451 | 2.588 | 2.739 | 0.990 | 2.740 | 2.341 |
| 8999 | 2.348 | 2.476 | 2.625 | 0.950 | 2.634 | 2.243 |
| 11999 | **2.301** | **2.426** | **2.577** | **0.932** | **2.585** | **2.198** |

**判讀**：
- Paloma macro_loss 在 12k 步驟已降至 2.577，與 ladder 預測的最終 dropless 2.04 尚有差距（僅 3% 進度，預期落差）；但下降斜率陡峭（0→3k 降 8.77，3k→12k 再降 0.44），符合早期快速收斂
- `c4_en` 2.585 與 `m2d2_s2orc` 2.198 的 gap 顯示不同 domain 的收斂速度差異，已可作為後續 datamix 調整的觀測點
- 取用層級：✅ 一手（GraphQL bucketedHistory 5 buckets）

## 待解問題（更新）
- [x] Harrier 配比與 bucketing 已深讀並完成 JS 渲染全量抽取（40 domains + 5 quality，見上）
- [x] EP 對決已量化（待 full-rack EP64 ragged 驗證）
- [x] 長上下文三備援已梳理
- [x] 67B 對比與預測精度先例已補
- [x] 下載性瓶頸已確認為 403，待官方修復公告
- [x] 優化器/health checklist 已補，當前 hero 前 3% 已通過
- [x] W&B 即時曲線已用 browser + GraphQL 完成逐點抽取（847 buckets 至 13.5k steps，training + eval 同步，見上表與 CSV）
