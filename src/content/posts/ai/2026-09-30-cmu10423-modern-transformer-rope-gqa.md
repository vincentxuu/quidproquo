---
title: "現代 Transformer：位置旋轉與 KV 共享改了甚麼｜CMU 10-423 第 4 堂"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, transformer, attention, pre-training, long-context]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 5
tldr: "第 2 堂的 attention 知道如何比對內容，但實際語言模型還需要順序資訊，也要承受生成時的記憶體成本。"
description: "Spring 2026 公開課程材料教學：現代 Transformer：位置旋轉與 KV 共享改了甚麼｜CMU 10-423 第 4 堂"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en)

**影片狀態：錄影需登入或課程授權。** 本文依公開投影片與作業整理，數值例子為本站補充，不是課堂逐字稿。

第 2 堂的 attention 知道如何比對內容，但實際語言模型還需要順序資訊，也要承受生成時的記憶體成本。本篇把三種修改放回各自的位置：RoPE 修改 query/key 的位置表示，GQA 修改 key/value 的共享方式，區域性 attention 修改可見範圍。讀完應能追一組小向量與快取大小，而不是把三者都稱為「更快的 attention」。

## RoPE 用旋轉讓內積帶上相對位置

在一個二維子空間中，位置 m 把向量旋轉 mθ。旋轉矩陣 R(mθ) 不改向量長度，但改方向。query 位於 m、key 位於 n 時，內積變成 qᵀR((n−m)θ)k，因為 R(mθ)ᵀR(nθ)=R((n−m)θ)。位置差因而進入匹配分數。

以下是自擬例子，θ=90°，q=k=[1,0]。位置 0 的 query 是 [1,0]，位置 1 的 key 是 [0,1]，內積為 0。同位置的 query/key 內積為 1；相距兩個位置則為 −1。實際 RoPE 用多組不同頻率旋轉向量對，不是所有維度都轉 90°，本例只讓你看清楚相對位置如何出現。

把兩者都往後移一步，query 變成 [0,1]，key 變成 [−1,0]，內積仍為 0。這個不變性依賴兩邊使用相同的旋轉規則。若只旋轉 Q、忘記 K，或者兩邊位置 offset 不同，相對位置性質就被破壞。通常旋轉的是 Q/K；不能順手把 V 也當成必須相同處理。

RoPE 不是把位置編號加到 token embedding，也不是自動保證任意長度外插。超出訓練位置分佈仍可能失效，長上下文另有獨立篇處理。

## GQA 減少 KV heads，保留 query heads

標準多頭 attention 每個 query head 通常都有自己的 K/V head。GQA 將數個 query heads 分成一組，共用一組 K/V，但每個 query 仍各自算分數與取值。極端所有 query 共用一組 KV 是 MQA；KV head 數等於 query head 數則回到 MHA。

假設自擬模型有 4 個 query heads、每頭維度 2、序列長度 3、batch=1。MHA 的 K cache 有 1×4×3×2=24 個元素，V 同樣 24，合計 48。GQA 用 2 個 KV heads 時，各有 12，合計 24；若元素都是兩 bytes，這一層的 K/V 快取從 96 bytes 變成 48 bytes。這只是小模型的 cache，不含權重、activation、allocator 與其他層。

query heads 仍有 4 個，輸出依然要合併 4 個 head 的結果。常見錯誤是把 KV heads 減少後，輸出也砍成兩個 query heads，這已經改了模型維度。另一個錯誤是先永久把 cache 複製回 4 頭，雖然可能得到正確數值，卻失去原本節省儲存的目的。

## 區域性 attention 限制的是誰能被讀到

causal mask 只限制不能看未來；區域性視窗再限制不能直接看太遠的過去。若視窗大小 w=2 包含自己，位置 3 可看位置 2、3，不能直接看位置 1。相對於全 attention，單層的配對數從約 T² 降到約 Tw，但更早的資訊可能需要經過多層中間位置傳遞。

視窗邊界要先說清楚。有的程式把 w 定義成「前面最多 w 個，加上自己」，跟本例「總共兩個」不同。測試若沒有註明這件事，即使得到不同結果也很難判定錯誤。區域性 attention 也不代表長文中的任意兩個 token 都能在一層直接互相取值。

## 預訓練與微調是訓練階段，架構是運算結構

同一套 RoPE/GQA 架構可以拿來預訓練，也可以微調；不能把 GQA 說成一種微調資料策略。第 3 堂介紹更新參數與選取輸出的差別，這堂增加的是模型內部設計。若拿兩個模型比較效果，要同時留意資料、規模與訓練預算，不能把所有差異都歸因於單一架構名稱。

## 變式題與答案

同樣 4 個 query heads、每頭維度 2，batch 改成 2、長度改成 5、KV heads=1。K/V 合計元素是 2×2×1×5×2=40；若 KV heads=4，則是 160，快取理論上縮成四分之一。兩邊的 query head 數仍為 4。

RoPE 的 query 在位置 1、key 在位置 3，同時平移到 5、7，理想旋轉內積會改變嗎？不會，兩次位置差都是 2。但這不等於模型在沒見過的長位置上一定有同樣品質。

作業 1 接著把這些機制變成 shape、mask、offset 與 train/eval 測試。先守住每項修改的資料流，再追 GPU 記憶體數值。

[上一篇](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding)｜[下一篇](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 課程影片來源

官方錄影入口位於 SCS Panopto。匿名資料夾未載入並提示登入；這表示未取得公開播放內容，不代表沒有錄影。原音與字幕須依課程授權存取。

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 參考資料

- [Lecture 4 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa.pdf)
- [RoFormer](https://arxiv.org/abs/2104.09864)
- [GQA](https://arxiv.org/abs/2305.13245)
- [Longformer](https://arxiv.org/abs/2004.05150)
- [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [課堂手寫版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa-ink.pdf)
- [GQA](https://arxiv.org/pdf/2305.13245.pdf)
- [Longformer](https://arxiv.org/pdf/2004.05150.pdf)
- [RoFormer](https://arxiv.org/pdf/2104.09864.pdf)
- [ViT](https://arxiv.org/pdf/2010.11929.pdf)
- [Spring 2026 practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [Lecture 5 投影片（開頭的 Modern Transformers 回顧）](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture5-cnn-vit.pdf)
- [HW1 handout（hw1.zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw1.zip)
