---
title: "影片生成：時間軸如何進入模型｜CMU 10-423 第 25 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 34
description: "能追時空attention shape並區分影片時間與去噪時間"
draft: false
---

> [English version](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation-en)

**影片狀態：錄影需登入或課程授權。** 本文依 CMU 10-423 Spring 2026 第 25 堂公開投影片整理；算例與變式是本站教學補充。

想像逐張生成「紅球從左滾到右」的圖片。每張都漂亮，球卻可能忽大忽小、變成藍色，或下一張突然回到左邊。影片生成要學的不只有每張畫面的分佈，還有相鄰畫面之間的關係。把圖片生成重複十次，不會自動得到穩定運動。

先備是[diffusion 的訓練與採樣](/posts/ai/2026-10-11-cmu10423-lecture-08-diffusion-training-sampling)、[條件注意力與 DiT](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit)。音訊生成不是必要先備。本篇處理時間關聯與張量；可被動作控制的世界模型另篇驗收。

## 模型多看見一條軸

圖片張量可寫成 `(B,H,W,C)`，影片加上時間成 `(B,T,H,W,C)`。3D convolution 的 kernel 同時跨時間與空間，能學局部變化；但時間感受野仍由 kernel、層數與下採樣決定，不是加了一維就知道全部長期事件。

注意力則可把所有時空位置當 token，讓每個位置直接看其他位置。若共有 `T×H×W` 個 token，完整 attention 的 score 數是它的平方。長片因此不只是多幾張圖片，可能讓 score 成長非常快。

課堂的另一種設計是分離 spatial 與 temporal attention。先讓每一幀內的空間位置交流，再讓同一空間位置跨幀交流。交替堆疊後，不同空間位置的資訊可以透過中間表示與時間路徑傳遞；單一 temporal layer 本身只直接連相同位置。這種因式分解改了互動方式，不能冒充一次完整全域 attention。

## 完整 reshape 算例

用本文自擬 latent 張量 `(B,T,H,W,C)=(2,3,2,2,4)`，共有 `2×3×2×2×4=96` 個 scalar。先做 spatial attention：把 batch 與時間合併，空間攤平，得到 `(B×T,H×W,C)=(6,4,4)`，代表六張畫面各有四個 token。

每張畫面的單 head score 是 `(4,4)`，六張共 96 個 score。做完 attention，把它還原到 `(2,3,2,2,4)`，再**交換軸**，把每個空間位置的三個時間點放在一起，得到 temporal shape `(B×H×W,T,C)=(8,3,4)`。八條時間序列各有 `(3,3)` score，共 72 個。兩種 attention 共 168 個 score；同樣資料若每段影片做完整 12-token attention，兩個 batch 有 `2×12²=288` 個。

這比較只算一個 head 的 score entries，不是整個模型的 FLOPs 或 GPU 峯值記憶體。重要的是 reshape 必須保留「哪個時間、哪個位置」。對連續記憶體直接 reshape 成 `(8,3,4)` 而沒有正確 permute，會把不同位置拼成假時間序列。scalar 數沒變，語意卻錯了。

## 噪音與時間不是同一個 t

影片 diffusion 對乾淨影片或 latent 加噪，模型依噪音程度與文字等條件預測去噪方向。影片第 3 幀的時間索引，與擴散第 3 步是兩個不同變數。一次去噪可更新整段影片；逆向迭代是在降低噪音，不是把第 1 幀播到第 2 幀。

Video LDM 把空間內容壓到 latent 再建模，並加入時間模組，使既有圖片模型的視覺能力可被利用。課堂也談 joint image/video training：圖片可以貢獻外觀學習，影片才提供時間關聯。若訓練批次混合兩者，要讓時間分支與 mask 正確處理只有一幀的資料，不能靠圖片品質推定運動學得好。

條件還可以是首幀、部分已知幀或文字。續片與插幀都需要讓已知內容約束生成；reconstruction guidance 是把重建條件納入採樣引導的路徑，不代表任何續片都物理正確。DiT／時空 patch 也改變骨幹與表示，不會自動消除時間漂移。

## 變式與時間驗收

變式：把 T 從 3 改為 6，其餘不變。spatial shape 是 `(12,4,4)`，temporal shape 是 `(8,6,4)`；單 head score 分別 192 與 288，共 480。完整 attention 則是 `2×24²=1152`。時間分支仍有 T² 成長，不能把分離式 attention 描述為全部成本都對 T 線性。

再問：球的顏色每幀一致，但位置突然跳回起點，是否通過影片生成驗收？答案是否定的。顏色一致驗收外觀，位置連續性驗收時間行為。可用已知起點與方向的短序列，記每幀球位置、尺寸與遮擋後再現；比較同提示不同 seed，避免只挑最好看的一支。

影片 VLM 又是讀取影片並回答，不是影片生成器本身。最後，球看似一直往右移，也還沒有證明能按「向左」指令轉向。那需要下一篇的動作介入測試，不能由視覺連貫代替。


## 延伸閱讀

- [上一篇](/posts/ai/2026-10-11-cmu10423-lecture-24b-audio-generation)
- [下一篇](/posts/ai/2026-10-11-cmu10423-lecture-26a-world-models)

## 課程影片來源

官方[課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)提供 Panopto 錄影入口，讀取需登入或課程授權。本篇提供投影片導讀，未提供原音逐字稿、字幕或跟讀材料。

## 參考資料

- [CMU Lecture 25 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture25-video.pdf)
- [Video Diffusion Models](https://arxiv.org/abs/2204.03458)
- [Video LDM](https://arxiv.org/abs/2304.08818)
