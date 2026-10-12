---
title: "搜尋與深度研究：候選很多，怎麼選出可交付的答案｜Stanford CS329A 第 8 堂"
date: 2026-10-11
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, reasoning, evaluation]
lang: zh-TW
series:
  name: "Stanford CS329A 導讀"
  order: 8
description: "從程式候選的篩選與分群，到研究過程的按需檢索，學會分辨兩種搜尋及它們的驗證限制。"
tldr: "候選搜尋解決選擇問題，文件檢索補知識缺口；兩者都需要保留規格與可檢查的依據。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-11-stanford-cs329a-lecture-08-search-deep-research-en)

**影片狀態：已附影片。** 官方錄影文字轉錄已取得；字幕類型、原音回聽與跟讀播放器尚待核對。

[Stanford CS329A](https://cs329a.stanford.edu/) Autumn 2025 第 8 堂談兩種容易混淆的搜尋：從模型產生的程式候選裡找解答，以及到外部文件找推理缺少的知識。前者擴大可能的解法，後者補上未知的事實；工具同樣叫 search，但解決的瓶頸不同。

本文以官方當堂閱讀 [AlphaCode](https://arxiv.org/html/2203.07814)、[AlphaCode 2](https://storage.googleapis.com/deepmind-media/AlphaCode2/AlphaCode2_Tech_Report.pdf) 與 [Search-o1](https://arxiv.org/html/2501.05366) 為底本，並對照官方錄影的文字轉錄。適合會讀基本程式、知道搜尋結果不等於可信答案的讀者。目標是設計一條能篩選與檢查候選的流程，而不是把工具呼叫數當成研究深度。

需要先補先備概念，可先讀[工具回饋](/posts/ai/2026-10-11-stanford-cs329a-lecture-04-tool-code-feedback)與[多步規劃](/posts/ai/2026-10-11-stanford-cs329a-lecture-05-reasoning-planning)。

## 在解答空間搜尋：生成、篩選、分群

AlphaCode 先大量生成程式，再利用題目範例測試篩掉不合要求的候選；之後依額外測試輸入上的執行行為分群，避免有限提交機會都花在相似解答。AlphaCode 2 延續這個結構，並用評分模型挑選群內候選。分群代表在有限測試下行為相似，不是證明兩個程式在所有輸入上等價。

這種設計把「至少生成過一次正解」與「最後交出正解」分開。第一個問題靠生成涵蓋率；第二個靠篩選與選擇。若正解早已在候選裡，多抽一批可能沒有改善真正瓶頸。

## 完整例子：不要把三個相似錯解都提交

以下是本文自擬的縮小版搜尋例子。任務是回傳非空整數陣列的最大值，輸入可能全是負數。公開範例只有 `[2, 5] → 5`，四個候選都通過：A 從 0 開始逐一取最大；B 回傳最後一項；C 從第一項開始逐一取最大；D 排序後取最後一項。

只看公開範例，無法知道誰可靠。加入行為探針 `[-3, -1]`，四者輸出 0、−1、−1、−1；加入 `[4, 1]`，輸出 4、1、4、4。兩個探針構成的行為向量分別是 A=(0,4)、B=(−1,1)、C=(−1,4)、D=(−1,4)，因此形成三群。

若只有兩次提交機會，選 C 與 D 並沒有增加這組測試下的行為覆蓋。更好的做法是先把全負數及最大值不在尾端列成明確規格，檢查預期輸出，再淘汰 A 與 B。此時 C/D 都通過，但仍須檢查空陣列是否在範圍內、輸入能否修改，以及排序成本。分群幫你節省選擇機會，規格與測試才決定什麼算對。

## 在知識空間搜尋：缺哪一塊才找哪一塊

Search-o1 讓推理模型遇到知識缺口時產生檢索查詢，再由獨立的 Reason-in-Documents 階段，結合問題、已有推理與查到的文件，抽出能接上下一步的資訊。長文件不整包塞回主流程，可以減少無關內容干擾，但壓縮時也可能丟掉限制條件。

用另一個自擬例子看差別：你要比較服務 A 與 B 的免費額度，題目規定估算一個月 30 天、每天 100 次請求的成本。已知需求是 3,000 次，但 A 的額度單位不明。此時查詢應是「A 免費額度 每月或每日」，不是重新搜尋整個產品介紹。

假設提供的教學資料寫 A 每月 2,000 次、超額每次 0.01 元；B 每月 5,000 次。整理後保留單位與價格，算出 A 超額 1,000 次、成本 10 元，B 在額度內。這些數字是假設，不是實際服務價格。若文件只寫「2,000 次」沒有期間，應保留未知，不能自行補成每月。

## 變式練習與答案

第一題：只增加 `[7, 7]` 能分開 C 與 D 嗎？不能，兩者仍輸出 7；分群結果依探針而定。若規格禁止修改原陣列，而 D 原地排序，就要另外檢查副作用，單看回傳值不夠。

第二題：A 免費額度改成每天 80 次、超額價格不變，每天需求 100 次。月成本多少？每天超額 20 次，30 天共 600 次，成本 6 元。把每日額度誤當每月，會算錯；文件精煉必須保留時間單位。

## 常見誤解與可做的動作

搜尋次數多，不代表新資訊多；分群數多，也不代表正解多。程式搜尋需要可執行的測試，研究搜尋需要保留支持主張的文件與條件。兩種流程都不能靠模型自信程度替代外部檢查。

今天選一個小任務，列出三個可能解答與兩個能區分它們的測試；再把一個事實查詢整理成「主張、來源、期間、單位、未知」五欄。前一張表找選擇瓶頸，後一張表找知識缺口。做到這裡才決定是否值得加大搜尋預算。

## 英文練習：原音跟讀待補

已取得當堂錄影的文字轉錄，可供內容對照；字幕類型、精確時間定位、原音回聽與三段播放器重播尚未完成核對，因此跟讀材料待補。本文沒有把自擬例子當作講者原話，也不以英文版文章代替原音逐字稿。

## 課程影片來源

[Stanford Online — Part 7](https://www.youtube.com/watch?v=Uni9dqyuuDM)

```youtube
url: https://www.youtube.com/watch?v=Uni9dqyuuDM
title: Stanford CS329A — Lecture 8
captions: en
```

## 參考資料

- [Stanford CS329A — Autumn 2025 official schedule](https://cs329a.stanford.edu/)
- [AlphaCode](https://arxiv.org/html/2203.07814)
- [AlphaCode 2 technical report](https://storage.googleapis.com/deepmind-media/AlphaCode2/AlphaCode2_Tech_Report.pdf)
- [Search-o1](https://arxiv.org/html/2501.05366)
- [Stanford Online — official lecture video](https://www.youtube.com/watch?v=Uni9dqyuuDM)
