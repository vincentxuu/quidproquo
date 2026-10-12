---
title: "長上下文：放得進去為什麼仍找不到答案｜CMU 10-423 第 19 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 27
description: "區分位置/記憶體/資訊取用並設計受控驗收"
draft: false
---

> [English version](/posts/ai/2026-10-11-cmu10423-lecture-19-long-context-en)

**影片狀態：錄影需登入或課程授權。** 本文依 CMU 10-423 Spring 2026 第 19 堂公開投影片整理；算例與變式是本站教學補充。

把公司的所有規章貼進 prompt，模型接受了，卻仍答錯退款期限。這裡至少有三種可能：位置編碼不熟悉那麼遠的位置、attention／KV 記憶體撐不住，或內容雖在上下文內卻沒有被可靠取用。長上下文把這些問題接在一起，但不能用「支援十萬 token」一句話全部解決。

先備是[RoPE 與 KV heads](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa)和[高效推論](/posts/ai/2026-10-11-cmu10423-lecture-18-efficient-inference)。本篇教如何分開位置延伸、運算成本與使用能力；SSM 的架構替代方案另篇展開。

## 位置延伸先處理模型沒看過的距離

RoPE 把位置寫成 query/key 的旋轉，相對位置影響兩向量的內積。訓練只見過長度 L，直接把位置推到數倍 L，會把旋轉推入原訓練不熟悉的範圍。架構允許索引那個位置，不等於參數已學會如何處理。

Position interpolation 的直覺是壓縮新位置：想把可用長度從 L 擴到 L'，便用 `p_scaled=p×L/L'`，讓較長序列的座標落回接近原範圍，再配合適當微調。它與直接外插不同，也有代價：原本相鄰 token 的位置間距縮小，模型必須重新適應。實務上的 RoPE 擴展還有頻率分段或縮放策略，不能把所有方法都化約成同一公式。

本文自擬 L=8、L'=16，position 0、4、8、12 分別映成 0、2、4、6。它只示範座標，不證明新序列能準確理解。變式 L'=32 時 position12 映成3；壓得更多並不是無成本多讀四倍。

## 能算得下是另一道門

完整 attention 的 token 對數量約隨 n² 成長。FlashAttention 透過分塊與記憶體 IO 策略避免存整張 score 矩陣，仍計算 dense attention；它沒有把全部配對消掉。Blockwise、Ring Attention 等設計可沿序列分割並交換區塊，使多裝置處理更長輸入，還要付通訊與調度成本。

KV cache 則是另一筆帳。自擬單一序列、32層、8個KV heads、head dimension64、FP16每scalar2bytes：每個 token 的 K與V共 `32×2×8×64×2=65536` bytes。8,192 tokens約512MiB；32,768 tokens約2GiB。這只算 KV，不含模型權重、temporary tensors 或 batch。若其他條件不變而 KV heads 變4，KV記憶體減半；可用上下文依然要過位置與品質驗收。

訓練時分塊與推論時cache也不同。前者要處理梯度與activation，後者保存歷史K/V給新token讀取。不能拿prefill能完成的證據，當成長篇連續decode的延遲與品質證據。

## 一個可定位的長文實驗

本文自擬四段規章，唯一有效事實是「標準方案退款期限14天」；其他段落保留同長度的無關內容。問題固定為「標準方案退款期限多少天？」把有效段輪流放第1、2、3、4位置，總長度、文字與prompt不變，要求回答數字並指出來源段。

假設三次重排／seed測試，每個位置得到3題，正確數依序3、1、1、3：位置正確率100%、33%、33%、100%，整體8/12。這組假資料不是某模型成績，它示範即使總平均67%，仍掩蓋中間位置失敗。若回答14卻引用錯段，內容分數與來源分數要分開，不因猜中數字就說檢索成功。

再加入衝突段「舊方案7天」，明確標舊版本。現在要測的不只是找到一個數字，還包括按版本與方案選證據；不能把這題與單一needle測試的成功率直接混用。Lost in the Middle研究提示相關資訊的位置會影響一些模型與任務表現，但不代表每個新模型必定有同樣曲線。

## 變式怎樣區分失敗原因

若四位置各四題，正確數4、2、1、4，答案是位置100%、50%、25%、100%，整體11/16。先固定總長度改位置，能觀察位置敏感性；固定位置再增加幹擾段，能觀察長度／幹擾影響。一次同時改兩者，就很難知道改進來自哪裡。

最後問：接受32k輸入而14天回答錯，能說位置延伸失敗嗎？答案不能；還可能是版本混淆、資訊取用或提示問題。先確認無截斷，再用上述受控變式定位。RAG把候選內容縮短、長上下文保留更多背景，各有優勢；兩者都需要證據選擇驗收，輸入容量不是完成標準。


## 延伸閱讀

- [上一篇](/posts/ai/2026-10-11-cmu10423-lecture-18-efficient-inference)
- [下一篇](/posts/ai/2026-09-30-cmu10423-reasoning-models)

## 課程影片來源

官方[課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)提供 Panopto 錄影入口，讀取需登入或課程授權。本篇提供投影片導讀，未提供原音逐字稿、字幕或跟讀材料。

## 參考資料

- [CMU Lecture 19 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture19-long.pdf)
- [Lost in the Middle](https://arxiv.org/abs/2307.03172)
- [Position Interpolation](https://arxiv.org/abs/2306.15595)
- [Ring Attention](https://arxiv.org/abs/2310.01889)
