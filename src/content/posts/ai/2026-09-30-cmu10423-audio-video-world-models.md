---
title: "音訊、影片與世界模型：三份教材的閱讀入口｜CMU 10-423 主題單元"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, speech-to-text, video-generation, world-model, diffusion-model, multimodal]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 50
tldr: "聲音表示、影片的時間關聯、動作條件的世界轉移，是三種不同學習任務。原篇把第24–26堂放一起，最後卻只有音訊練習，無法驗收另外兩堂。這個網址保留為閱讀入口；完整教學已拆成下列五篇，其中第26堂另一份對齊教材也有獨立位置。"
description: "聲音表示、影片的時間關聯、動作條件的世界轉移，是三種不同學習任務。原篇把第24–26堂放一起，最後卻只有音訊練習，無法驗收另外兩堂。這個網址保留為閱讀入口；完整教學已拆成下列五篇，其中第26堂另一份對齊教材也有獨立位置。"
draft: false
glossary:
  - term: "mel-spectrogram"
    aliases: ["梅爾頻譜圖", "log-mel spectrogram"]
    definition: "把音訊切成互相重疊的短窗，每窗做一次傅立葉轉換得到頻譜圖，再把頻率軸映射到較接近人耳感知的 mel 尺度；結果可以像圖片一樣處理；對 mel 頻帶能量取對數後才是 log-mel spectrogram，兩者不是完全相同的表示。"
    context: "CMU 10-423 第 24 堂的音訊表示，Whisper 的輸入就是 log-mel spectrogram。"
    links:
      - label: "Radford et al. 2022：Whisper"
        url: "https://arxiv.org/abs/2212.04356"
  - term: "world model"
    aliases: ["世界模型", "WM"]
    definition: "給定前一個世界狀態 s 和一個動作 a，從分布 p(s′ | s, a) 抽樣或預測下一個狀態 s′ 的模型。"
    context: "CMU 10-423 第 26 堂的互動世界模型教材涵蓋 3D 場景、互動影片與潛在狀態等不同表示；需另外檢驗動作控制和多步轉移。"
    links:
      - label: "Bruce et al. 2024：Genie"
        url: "https://arxiv.org/abs/2402.15391"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-audio-video-world-models-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

聲音表示、影片的時間關聯、動作條件的世界轉移，是三種不同學習任務。原篇把第24–26堂放一起，最後卻只有音訊練習，無法驗收另外兩堂。這個網址保留為閱讀入口；完整教學已拆成下列五篇，其中第26堂另一份對齊教材也有獨立位置。

## 先讀哪一篇

- [音訊表示與辨識](/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr)：依該篇的完整例子與答案自我檢查。
- [音訊生成](/posts/ai/2026-10-11-cmu10423-lecture-24b-audio-generation)：依該篇的完整例子與答案自我檢查。
- [影片生成](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation)：依該篇的完整例子與答案自我檢查。
- [互動世界模型](/posts/ai/2026-10-11-cmu10423-lecture-26a-world-models)：依該篇的完整例子與答案自我檢查。
- [對齊科學](/posts/ai/2026-10-11-cmu10423-lecture-26b-science-of-alignment)：依該篇的完整例子與答案自我檢查。

總覽的 [課程地圖](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)列出完整核心主線；本篇是主題導覽，不是額外課堂。先選你要回答的問題，再去對應的教學篇。

## 用一個例子看出分界

本站自擬世界模型例子：狀態是角色的位置x=0，動作是右移或左移。指定玩具轉移f(x,right)=x+1、f(x,left)=x−1。同一初始狀態下，下一位置分別1與−1；連按右移兩次得到2。這個例子示範要測動作介入，不能只看影片是否連貫。若模型不理動作、總輸出角色走到1，即使畫面漂亮，它也沒通過這個控制測試。音訊的98窗頻譜例只驗聲音表示；它不能驗影片一致性，更不能驗世界轉移。

## 自我檢查

若輸出影片符合「向右走」文字prompt，但系統沒有動作輸入，能當成互動世界模型的驗收嗎？

<details>
<summary>答案與判準</summary>

不足。需能在相同狀態與歷史下更改動作、檢查後續轉移，並測多步rollout；一般文字條件影片不自動具備這種介面與能力。

</details>

## 怎麼使用這張地圖

先不看答案，用自己的話指出輸入、被改動的部分與輸出，再到上面的教學篇完成變式。如果把兩種機制混在一起，回到資料流，找出哪一步的條件不同。這篇只驗關係與分界；不能用它代替各堂的推導、實作或評估。

本文沿用Spring 2026公開教材；自擬例子不是官方考題或課堂口述。原課程錄影仍須依授權存取。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開文字教材整理，沒有重建未取得的課堂口述或提供原音逐字稿。

- [官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)

## 更新紀錄

- 2026-10-11：重整教學範圍、完整例子與理解檢查，保留原網址及發文日期。

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。確認登入牆屬實（匿名開啟 Panopto 資料夾無影片並提示登入），官方頁面也沒有公開 YouTube 版本，狀態維持不變。

## 參考資料

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [課程講次表（Lecture 24–26、Quiz 6、專案時程）](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 24 投影片：Audio Understanding and Synthesis](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio.pdf)
- [Lecture 24 投影片（課堂手寫版）](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio-ink.pdf)
- [Lecture 25 投影片：Video Generation and Understanding](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture25-video.pdf)
- [Lecture 26 投影片：Interactive World Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture26-world-models.pdf)
- [Radford et al. 2022：Robust Speech Recognition via Large-Scale Weak Supervision（Whisper）](https://arxiv.org/abs/2212.04356)
- [Wu et al. 2024：Towards audio language modeling — an overview](https://arxiv.org/abs/2402.13236)
- [Huang et al. 2018：Music Transformer](https://arxiv.org/abs/1809.04281)
- [Copet et al. 2023：Simple and Controllable Music Generation（MusicGen，NeurIPS）](https://proceedings.neurips.cc/paper_files/paper/2023/hash/94b472a1842cd7c56dcb125fb2765fbd-Abstract-Conference.html)
- [Liu et al. 2023：AudioLDM](https://arxiv.org/abs/2301.12503)
- [Evans et al. 2024：Fast Timing-Conditioned Latent Audio Diffusion（Stable Audio）](https://arxiv.org/abs/2402.04825)
- [Das et al. 2024：SpeechVerse](https://arxiv.org/abs/2405.08295)
- [Veo 3 Tech Report](https://storage.googleapis.com/deepmind-media/veo/Veo-3-Tech-Report.pdf)
- [Chen et al. 2024：Panda-70M](https://arxiv.org/abs/2402.19479)
- [Ho et al. 2022：Video Diffusion Models](https://arxiv.org/abs/2204.03458)
- [Çiçek et al. 2016：3D U-Net](https://arxiv.org/abs/1606.06650)
- [Arnab et al. 2021：ViViT: A Video Vision Transformer](https://arxiv.org/abs/2103.15691)
- [Blattmann et al. 2023：Align your Latents（Video LDM）](https://arxiv.org/abs/2304.08818)
- [Peebles & Xie 2022：Scalable Diffusion Models with Transformers（DiT）](https://arxiv.org/abs/2212.09748)
- [OpenAI：Video generation models as world simulators（Sora）](https://openai.com/index/video-generation-models-as-world-simulators/)
- [Zheng et al. 2025：Open-Sora 2.0](https://arxiv.org/abs/2503.09642)
- [Liu et al. 2024：World Model on Million-Length Video And Language With Blockwise RingAttention（Large World Model）](https://arxiv.org/abs/2402.08268)
- [Rivard et al. 2025：NeuralOS](https://arxiv.org/abs/2507.08800)
- [Zhuge et al. 2026：Neural Computers](https://arxiv.org/abs/2604.06425)
- [Mildenhall et al. 2020：NeRF](https://arxiv.org/abs/2003.08934)
- [Kerbl et al. 2023：3D Gaussian Splatting for Real-Time Radiance Field Rendering](https://arxiv.org/abs/2308.04079)
- [Poole et al. 2022：DreamFusion](https://arxiv.org/abs/2209.14988)
- [Chen et al. 2023：Text-to-3D using Gaussian Splatting（GSGen）](https://arxiv.org/abs/2309.16585)
- [Bruce et al. 2024：Genie: Generative Interactive Environments](https://arxiv.org/abs/2402.15391)
- [Chang et al. 2022：MaskGIT](https://arxiv.org/abs/2202.04200)
- [Google DeepMind：Genie 3](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/)
- [Assran et al. 2025：V-JEPA 2](https://arxiv.org/abs/2506.09985)
- [PAN Team 2025：PAN: A World Model for General, Actionable, and Long-Horizon World Simulation](https://arxiv.org/abs/2511.09057)
- [HW623 handout（論文清單）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf)
