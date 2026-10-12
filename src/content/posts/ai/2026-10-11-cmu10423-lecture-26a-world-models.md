---
title: "世界模型：動作如何改變預測的未來｜CMU 10-423 第 26 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 35
description: "區分三種世界表示與動作介入證據"
draft: false
---

> [English version](/posts/ai/2026-10-11-cmu10423-lecture-26a-world-models-en)

**影片狀態：錄影需登入或課程授權。** 本文依 CMU 10-423 Spring 2026 第 26 堂公開投影片整理；算例與變式是本站教學補充。

一支影片可以把角色畫得很自然，卻不讓你決定角色往哪走。世界模型多問了一件事：「目前狀態相同，如果採取另一個動作，未來會怎樣？」這個問題把生成畫面連到規劃與控制，而不是只追求好看的續片。

先備是[時間關聯](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation)與[狀態更新](/posts/ai/2026-10-11-cmu10423-lecture-21-state-space-models)。本篇把第 26 堂 world-model deck 的三種表示分開：3D 場景、互動影片與 latent prediction；另一份 alignment deck 另篇處理。

## 狀態、觀測與動作先分清楚

理想化轉移寫成 `p(s_next | s, a)`，其中 s 是狀態、a 是動作。相機畫面只是觀測，可能看不到牆後物體、速度或摩擦係數。真正可用的模型往往要讀歷史，或維護代表不確定性的 latent／belief；一張畫面不能總是決定下一刻。

給相同歷史與不同 a，模型應產生可區分且符合動作語意的未來。這不表示未來一定是單一點：隨機環境可輸出分佈。重點是動作有介入效果，而且多步後不至於只剩視覺上像真的漂移。

## 三種表示，各解決不同難題

3D 場景表示先追幾何與視角一致性。NeRF 用位置與觀看方向預測顏色及密度，再沿相機射線做體積渲染；Gaussian splatting 用顯式高斯集合表示場景。它們可在新視角重現同一場景，但靜態場景重建不等於物體受力後的動力學。DreamFusion 等方法把生成先驗接到 3D 優化，也不能由輸出 3D 物件直接推出可控制物理世界。

互動影片模型把歷史視覺表示與動作接到下一幀生成。Genie 的 video tokenizer 壓縮畫面，latent action model（LAM）從相鄰畫面推斷離散 latent action，dynamics model 再用過去 video tokens 與 action 預測新畫面。訓練 LAM 時可以讀下一幀，因為正在推斷發生過的變化；遊玩生成時沒有真的下一幀，動作由使用者或策略提供。把訓練的事後推斷直接當作推論輸入會洩漏未來。

Latent prediction 則不一定重建所有像素，而預測與任務有關的表示。V-JEPA 路線讓表示學習避開部分像素細節；但「能預測 masked video latent」與「能按動作規劃」仍不同。V-JEPA 2 的 action-conditioned 部分另外連接動作與機器人資料。能做規劃需要足夠的可觀測資訊、動作語意與 rollout 評估，不能由 latent 這個名詞推定。

## 同一格子世界的兩個未來

本文自擬一條有五格的走廊，位置 x 在 0–4，動作 a 是 −1、0、+1。轉移為 `x_next=clip(x+a,0,4)`。起點 x=2，選 +1 得 3，選 −1 得 1。再連續做 +1，從 2→3→4→4；連續 −1 則 2→1→0→0。邊界阻擋讓這不只是把 x 每步加固定數。

3D／幾何驗收問：從兩個視角看 x=2，是否是同一物體、同一位置？互動影片驗收問：固定起始畫面，換 action 是否走向右或左？latent 驗收問：把 x 編成 `z=x/4`，則 x=2 對應 .5；+1 路徑預測 .75→1→1，解碼回 3→4→4，是否能選出到右端的動作序列？三種驗收可以共享世界，但證據不能互相代用。

若模型忽略 a，只學 `x_next=x`，它在靜止片段可能重建很好，卻在上述動作反事實測試立刻失敗。若只第一步正確、第三步越過牆，也不能算多步可用。應分開記單步誤差、多步邊界錯誤與達成目標的比例。

## Genie 的 latent action 不等於鍵盤標籤

LAM 沒有原始操作標籤，離散碼可能學到方向與跳躍等變化，卻不保證 code 0 必定是「左」。換一個訓練結果，碼號可重新排列；非動作因素也可能混入表示。論文在轉移到真實環境操作時，使用少量有 action labels 的資料建立 latent-to-real-action mapping。無標籤影片學到可控 latent，與完全不需要動作映射，是兩個不同聲明。

變式：把起點改為 x=4，連做兩次 +1，答案是 4→4→4；若先 −1 再 +1，答案 4→3→4。若「右」latent 同時使背景換色，代表動作可能與外觀纏在一起，必須在不同起始場景驗證同碼是否維持控制語意。漂亮畫面不能補上這個缺口。


## 延伸閱讀

- [上一篇](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation)
- [下一篇](/posts/ai/2026-10-11-cmu10423-lecture-26b-science-of-alignment)

## 課程影片來源

官方[課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)提供 Panopto 錄影入口，讀取需登入或課程授權。本篇提供投影片導讀，未提供原音逐字稿、字幕或跟讀材料。

## 參考資料

- [CMU Lecture 26 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture26-world-models.pdf)
- [Genie](https://arxiv.org/abs/2402.15391)
- [NeRF](https://arxiv.org/abs/2003.08934)
- [V-JEPA 2](https://arxiv.org/abs/2506.09985)
