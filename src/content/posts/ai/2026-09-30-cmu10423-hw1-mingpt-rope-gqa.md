---
title: "minGPT 實作驗收：用形狀、遮罩與位置找錯｜CMU 10-423 作業 1"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, homework, transformer, attention, pytorch]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 6
tldr: "作業 1 把 RNN、Transformer 與現代 attention 的觀念拉到程式層。"
description: "Spring 2026 公開課程材料教學：minGPT 實作驗收：用形狀、遮罩與位置找錯｜CMU 10-423 作業 1"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa-en)

**影片狀態：錄影需登入或課程授權。** 本文依公開投影片與作業整理，數值例子為本站補充，不是課堂逐字稿。

作業 1 把 RNN、Transformer 與現代 attention 的觀念拉到程式層。難處往往不是背不出公式，而是 reshape、head 分組、位置 offset 與 dropout 在數值上偷偷改了運算。本篇教你建立能定位錯誤的驗收順序；所有補充例子都是自擬測試，不是官方待填題的完整解答。

先備是作業 0 的 autograd、第 2 堂的 causal mask、第 4 堂的 RoPE/GQA。官方底本是 coursework 上的 `hw1.zip`，內含 PDF、starter 與 `test_model.py`；實際提交與 AI 使用方式以當學期規範為準。舊版導讀已記錄原檔與檔案部分不一致，這裡把需要你確認的地方留在操作流程，不把早先環境結果說成你的環境必然如此。

## 先建立基準，再改模組

下載並解壓官方 handout，依隨附環境檔安裝 Python、PyTorch 與 einops，保留一份未修改副本。在 starter 目錄執行 `python test_model.py`。尚未實作的部分可能出現 `NotImplementedError`；先辨認是 TODO 造成、套件匯入失敗，還是資料路徑錯誤。不要把所有紅燈一律當成 attention 數學錯誤。

讀 `CausalSelfAttention.forward` 時，逐行記錄輸入與輸出維度。官方 starter 內的其他 attention 是比較基準；把「我猜模型大概這樣做」換成「這個 tensor 的第幾軸代表甚麼」，通常就能發現第一個問題。

## 自擬 shape ledger

設 B=2、T=3、embedding=8、query heads=4、KV heads=2，每頭維度 2。輸入是 `[2,3,8]`。Q 投影後元素數為 48，整理成 `[2,4,3,2]`；K/V 投影各有 24，整理成 `[2,2,3,2]`。每兩個 query heads 共用一個 KV head，配對後分數是 `[2,4,3,3]`。

每個 head 的加權值是 `[2,4,3,2]`，轉回 `[2,3,8]` 再過輸出投影。不要直接把 `[B,H,T,D]` reshape 成 `[B,T,H×D]` 而不先交換 H/T 軸，否則相同元素數會把不同位置與 head 的數字混在一起。這種錯誤不會一定丟例外。

本例 K/V 合計 48 個元素；四個獨立 KV heads 時合計 96。若為運算暫時 expand/repeat，記錄它是否建立實體副本，以及持久 cache 到底存了哪個版本。正確輸出與節省記憶體是兩個需要分別驗證的條件。

## 用因果不變性抓洩漏

取三個位置的輸入，關掉 dropout 或切到 eval。先算輸出，再只改第三個輸入；前兩個輸出應在浮點容許誤差內不變，第三個可以改變。這個測試不依賴特定訓練權重，能直接檢查未來資訊是否穿過 mask。

若第一個輸出也改變，先看 mask 是否在 softmax 之前、三角方向是否反了、reshape 是否把位置混掉。若差異只發生在 train mode，先排除 dropout 兩次使用不同亂數。固定 seed 有助重現，但不代表所有硬體與 kernel 都逐位元相同。

## RoPE 用 offset 驗收，dropout 用模式驗收

第 4 堂的一維向量對例子可檢查旋轉：q=k=[1,0]，每位置轉 90°，差一位內積為 0，差兩位為 −1。把 query/key 同時平移，分數保持相同。真正程式必須按模型指定頻率與維度配對；測試可以用這個縮小版隔離旋轉與索引。

增量生成若 cache 已有兩個位置，新 token 應使用絕對位置 2，不是每次重設為 0。比較「整段 forward」與「使用相同 token 的逐步 cached forward」，最後一步應一致。這裡相同 token 很重要：若每次真的抽樣不同字，結果不同不能用來歸咎 cache。

eval 下 dropout 應停止隨機丟棄；train 下則啟用。官方測試對 GQA、RoPE、dropout 與整合各有檢查，但測試透過只證明檢查涵蓋的行為，不替代人工評分或訓練品質。

## 變式題與答案

改成 embedding=12、query heads=3、KV heads=1，每頭維度 4，B=1、T=5。Q shape 是 `[1,3,5,4]`，K/V 各 `[1,1,5,4]`，分數 `[1,3,5,5]`，合併輸出 `[1,5,12]`。K/V cache 合計 40 個元素。

如果只改未來 token，eval 下早期輸出不變，但完整 forward 與 cached forward 最後一步不同，下一個最值得查甚麼？答案是 cache 內容、位置 offset、mask 對舊/新長度的定義，而不是先改 optimizer。最後才訓練短 smoke run，分別記 shape、loss、生成與記憶體，保留 held-out 評估，避免只看一段順眼文字就宣稱成功。

[上一篇](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa)｜[下一篇](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 課程影片來源

官方錄影入口位於 SCS Panopto。匿名資料夾未載入並提示登入；這表示未取得公開播放內容，不代表沒有錄影。原音與字幕須依課程授權存取。

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 參考資料

- [HW1 official archive](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw1.zip)
- [HW1 recitation](https://docs.google.com/presentation/d/1IpSzQ5dkr3iO0riNfareQiif9J9O684amTBATiybuVk/edit?usp=sharing)
- [Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [minGPT](https://github.com/karpathy/minGPT)
- [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Overleaf 唯讀模板](https://www.overleaf.com/read/sdrhkbjjdhwv#8049a1)
- [講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 4 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa.pdf)
- [Su et al. 2021：RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
- [Ainslie et al. 2023：GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints](https://arxiv.org/abs/2305.13245)
