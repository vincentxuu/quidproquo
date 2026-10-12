# 範圍卡：Stanford CS229 第 20 堂

- **課程／版本**：Stanford CS229 Machine Learning，Spring 2026（Stanford Online 公開錄影）；講義為 2026 年 8 月版 main_notes。
- **文章角色**：概念導讀（單堂）。
- **原課堂次與 order**：第 20 堂（影片標題編號；學期最後一堂，第 19 堂時段放假），`series.order: 17`，播放清單第 17 支，videoId `J7CossjMvEg`。
- **文章路徑**：`src/content/posts/ai/2026-10-12-stanford-cs229-lecture-20-ppo-rl-for-reasoning.md`
- **標題與內容不符**：YouTube 標題寫「GMM (EM), PCA」，實際內容是 policy gradient 收尾、PPO、CISPO、CoT 與 RLVR。
- **講者**：依內容判斷為 Tengyu Ma（21:47 段「I had a heuristic examples in my lecture notes」，講義署名 Tengyu Ma and Andrew Ng）；字幕無自我介紹。

## 讀者先備

上一堂的 policy gradient 公式（log 機率梯度乘總報酬）、MDP 的狀態／動作／轉移、期望值與條件期望值、連鎖律、語言模型逐 token 生成。

## 主問題

policy gradient 的權重可以怎麼簡化而不改變期望值？怎麼重複使用舊策略的樣本（PPO）？只檢查最後答案對不對，為什麼足以訓練出長思維鏈？

## 讀完的能力

1. 寫出 score 期望為零的證明，並用全期望值定理說明過去獎勵與 $B(s_t)$ 可以拿掉。
2. 給定 $\hat A_t$、$r_t$、$\epsilon$，算出 PPO 截斷項的值並判斷有沒有梯度；說出 CISPO 的係數。
3. 把語言模型生成對應到 MDP 的五個元件。
4. 給定同一題 8 個樣本的 0/1 獎勵，算出 group baseline 調整後的權重（含除以標準差）。

## 完整例子

1. Baseline 降變異數：講義第 21 章註腳 3（reward-to-go 為 1001／998、score 為 ±z），減 1000 前後平均都是 1.5z，偏差由 ±999.5z 降到 ±0.5z（變異數為本文計算）。
2. PPO 截斷表：ε=0.2、Â=±2，r=10、0.5、1.1、3 共五列（r=10 與 0.5 為課堂口頭數字，其餘自擬）。
3. Group baseline：1 對 7 錯 → 7/8 與 −1/8；4 對 4 錯 → ±0.5（課堂數字）；除以標準差後為 ≈2.65／−0.38 與 ±1（本文依講義式 18.7 補算）。

## 自我檢查題與答案

1. baseline 為何不能依賴 $a_t$：提不出內層期望值，梯度期望值會被改掉。
2. ε=0.2、Â=−1：r=0.6 → C=−0.8，無梯度；r=1.5 → C=−1.5，有梯度；CISPO 係數 0.6、1.2。
3. 8 個樣本 2 個答對：+0.75／−0.25；除以標準差 0.433 → +1.73／−0.58。
4. on-policy 為何不能連走兩步；PPO 未修正的是狀態分布。
5. 轉移確定但可能學不動：全錯時每個樣本權重為 0，沒有梯度，需要偶爾能答對的起點。

## 來源底本

- 逐字稿 `.work/cs229-spring2026/txt/17-J7CossjMvEg.txt`（全篇讀完，未看板書）。
- 主講義第 21 章（pp. 258–265）、第 18 章（pp. 220–225）。
