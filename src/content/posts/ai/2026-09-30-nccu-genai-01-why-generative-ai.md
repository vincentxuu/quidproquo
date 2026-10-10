---
title: "政大蔡炎龍 生成式AI L01：為什麼要研究生成式 AI，課程介紹與 Colab"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, generative-ai, colab, homework]
lang: zh-TW
series:
  name: "政大蔡炎龍 生成式AI 導讀"
  order: 1
tldr: "第一講前半說明課程規則與閃電秀，中段回答「為什麼要學原理」：蔡炎龍把學 AI 的焦慮拆成三種，主張懂原理才知道模型的限制、不必追著每個新工具跑。後半是 Colab 入門，從魔術指令、四行標準套件、plt.plot 到 Markdown 與 ipywidgets 互動。第一份作業是在 Colab 畫一個函數圖形；長庚衛星班的評分標準裡，照改範例只拿 6 分，沒教過的函數加上漂亮的 Markdown 註解才拿 10 分。"
description: "政大蔡炎龍《生成式 AI》1132 學期第 1 講導讀：課程規則與每週直播流程、學 AI 的三種焦慮與「瞭解原理才能沒有焦慮」、AI 就是把問題化為函數、Colab 與 Jupyter 的基本操作（魔術指令、標準套件、plt.plot、zip、TAB 補完、Markdown、interact），以及第一週作業的繳交內容與評分標準。"
draft: false
glossary:
  - term: "閃電秀"
    aliases: ["Lightning Talk"]
    definition: "本課每次直播第三節的學生分享時段，每人 5 分鐘內，談自己的作業、心得或對上課內容的整理。"
    context: "政大 1132 參加閃電秀可在學期成績額外加 2 分；長庚衛星班頁面也列為額外加分項目。"
  - term: "魔術指令"
    aliases: ["magic command"]
    definition: "Jupyter／Colab 裡以 % 開頭的特殊指令，例如 %matplotlib inline、%timeit，用來控制筆記本環境，而不是 Python 語法本身。"
    context: "課程每份 notebook 開頭都會用 %matplotlib inline。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nccu-genai-01-why-generative-ai-en)

**系列位置**：上一篇 [總覽與自學路線](/posts/ai/2026-09-30-nccu-genai-course-overview)｜下一篇 [L02 神經網路的概念](/posts/ai/2026-09-30-nccu-genai-02-neural-networks)｜[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)

> **版本說明**：本文依據政大 1132 學期（2025-02-18）第 1 講的[直播錄影](https://www.youtube.com/watch?v=4BRBxy0EMT8)（2 小時 52 分）與 [GenAI01 投影片](https://yenlung.me/1132GenAI)（121 頁）。作業題目與評分標準出自[長庚衛星班頁面](https://yangchihyuan.github.io/courses/GenerativeAI2025)，是長庚版本。事實皆於 2026-09-30 打開官方材料核對。

第一講的標題是「為什麼要研究生成式 AI？」。它有三件事：說明這門課怎麼上、回答為什麼要花時間學原理、讓每個人在 Colab 上跑出第一張圖。對程式基礎不多的讀者，第三件事最重要，因為接下來 13 講的作業全部在 Colab 上完成。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=4BRBxy0EMT8
title: 【生成式 AI】01. 為什麼要研究生成式 AI？（課程介紹）
```

原始影片：[【生成式 AI】01. 為什麼要研究生成式 AI？（課程介紹）](https://www.youtube.com/watch?v=4BRBxy0EMT8)

課程與錄影入口：

- [官方課程與錄影入口](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## 這一講在課程中的位置

依錄影說明欄的分段，三節課大致這樣分：

| 時段 | 內容 |
|---|---|
| 第一節 | 課程說明：直播連結、NTU COOL、作業注意事項、評分、期末專案、閃電秀；老師自介 |
| 第二節 | 學 AI 的三種焦慮、ChatGPT Deep Research 實測、課程學習目標、AI 就是把問題化為函數、現在流行的生成式 AI、Colab 實作、畫一個函數、第一次作業說明 |
| 第三節 | 作業繳交說明、閃電秀說明、助教介紹、Colab 權限開啟教學 |

投影片第 23 頁寫了每週直播的固定流程：前 2 小時（4:10–6:00pm）是蔡炎龍上課，最後 1 小時（6:10–7:00pm）是閃電秀、實作與助教時間，由各校老師安排。自學時可以只看前兩節，第三節多半是課務。

## 課程規則：鼓勵用 AI，但不接受「一個 prompt 的作業」

投影片第 18 頁寫得很直接：當然可以用生成式 AI 的模型，但嚴禁直接 copy paste 等抄襲方式，生成式 AI 一次直接可以生出的作業是不能接受的。

作業原則上每週一次，截止時間是兩週之後，題型有發想題、實作題、程式題（第 22 頁）。期末專案是自由形式：可以是程式專案、用生成式 AI 解決問題的應用方案，也可以是某個生成式 AI 相關的教學（第 20 頁）。期末以 Gather Town 線上研討會分享，由各校選出優秀的專案上台。

**閃電秀**是這門課的特色。任何同學都可以報名，在第三節用 5 分鐘分享自己的作業、心得或對上課內容的整理。政大 1132 參加閃電秀可在學期成績額外加 2 分（第 116 頁）。

評分比例在各校不同，詳見[總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)。政大 1132 是作業 70%、期末專案 25%、上課參與 5%（第 115 頁）。

## 為什麼一定要強調原理

投影片把課程特色寫成兩個詞：強調原理、實作練習。第 43 頁給了理由：**瞭解原理，才能沒有焦慮**，好好應用，並且成為一個 AI 學習的強者。旁邊附了一行小字：原理的確有包括數學。

接著他把學 AI 的焦慮拆成三種：

| 焦慮 | 投影片的說法 |
|---|---|
| 我是不是會被 AI 取代？ | AI 是不是比我還要厲害？也常聽到「會取代你的是會用 AI 的人」 |
| 發展這麼快，我要怎麼學？ | 每天都有新的工具出來，哪個才是最好的、要學哪個？ |
| 學 AI 感覺好難 | 「你一定要知道的 10 個 prompt 技巧！」「他那沒什麼，我有 100 個！！」 |

第三種焦慮的那頁把技巧清單的軍備競賽畫成一句對白：你有 10 個，他有 100 個。錄影第二節接著實測 ChatGPT 的 Deep Research，投影片第 48 頁的標題是「真的是『博士級』的嗎？」，實測結果放在 [yenlung.me/IVE_DR](https://yenlung.me/IVE_DR)。

第 49 頁的學習目標，就是這三種焦慮的解方：

- 知道原理，就知道 AI 的限制，並且可以思考怎麼樣突破
- 應用上，不會太擔心 A 模型是不是比 B 模型強（或是怎麼找適合的模型）
- 知道為什麼這樣的引導（prompt）會有好處
- 讓自己變成一個學習 AI 能力非常強的吸收器

這套說法跟本站其他課程導讀的出發點一致：新工具換得很快，底下的原理換得很慢。

## AI 就是把問題化為函數

這一講埋了一個之後每一講都會用到的觀念。投影片第 51 頁把 AI 模型畫成一台「函數學習機」$f_\theta$，蔡炎龍叫它**呆萌型 AI 機器人**：你只要知道輸入長什麼樣子、輸出長什麼樣子。

例子是賞鳥。在野外拍到一隻八哥，想知道牠是哪一種八哥：輸入是一張照片，輸出是八哥的種類。

生成式 AI 也是同一種呆萌型機器人，只是輸入與輸出換了：

| 類型 | 輸入 | 輸出 | 例子（投影片列的） |
|---|---|---|---|
| 圖像生成型 AI | prompt，例如 "a rabbit wearing a rabbit ear hat" | 圖像 | Midjourney、Stable Diffusion、DALL·E |
| 文字生成型 AI | prompt，例如「請列出五個學習生成式 AI 該注意的重點」 | 一段文字 | ChatGPT、Gemini、Claude、Llama |

那麼大家最初為什麼開始討論生成式 AI？投影片給了三個理由：讓電腦創作；圖靈在 1950 年問過，隔著無線打字機對話時，我們能不能分辨對方是人還是機器；以及費曼那句 "What I cannot create, I do not understand."，真的要懂，就要能創造。

下一講會把「函數學習機」拆開，看它內部怎麼用神經網路組起來。

## Colab 入門：這門課的工作台

[Colab](https://colab.research.google.com/) 是 Google 的雲端運算系統，不必安裝，用 Google 帳號登入，還能免費使用 GPU 或 TPU。它可以看成雲端版的 [Jupyter Notebook](https://jupyter.org/)；Jupyter 的前身是 IPython Notebook，原作者是 Fernando Pérez。

投影片第 61–113 頁是一份很完整的 Colab 操作說明，下面挑自學最需要的部分。

### 開檔與設定

- **開老師的 notebook**：開啟筆記本時選 GitHub 標籤，輸入 `yenlung`，就能找到 [AI-Demo](https://github.com/yenlung/AI-Demo) 裡的範例。打開後記得「在雲端硬碟中儲存副本」，改的才是你自己的版本。
- **關掉干擾的自動完成**：工具 > 設定 > 編輯器，考慮取消勾選自動完成建議；縮排寬度建議改成 4。自動補完不會不見，因為還有 TAB 鍵。
- **療癒設定**：工具 > 設定 > 其他，勾選柯基犬模式、貓咪模式與螃蟹模式。
- **開 GPU**：編輯 > 筆記本設定，可以選 GPU 或 TPU。
- **執行 cell**：Shift + Enter。投影片把它稱為「最重要的動作」。

### 四行標準套件

每份作業都從這四行開始。投影片第 81 頁把它叫做「我們的標準開始」：

```python
%matplotlib inline

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
```

第一行是**魔術指令**，讓圖直接顯示在網頁上。長庚衛星班的評分標準寫明：沒有引入老師的固定 4 行套件，總分扣 1 分。

其他常用的魔術指令有 `%cd`（切換路徑）、`%save`、`%run`、`%timeit`（測量執行時間）。前面加驚嘆號，例如 `!pwd`，則是直接下系統指令。

### 畫圖王牌指令 plt.plot

`plt.plot(X, Y)` 會把點的 x 座標串列與 y 座標串列連成折線。投影片的例子：

```python
plt.plot([0.8, 1.2, 2.1, 2.8], [2, -5, 3.2, 5])
```

點常常有兩種表示法：一串 `(x, y)` 的點，或 x、y 分開的兩個串列。兩者可以用 `zip` 互換：

```python
X = [0.8, 1.2, 2.1, 2.8]
Y = [2, -5, 3.2, 5]
points = list(zip(X, Y))   # 合起來
X, Y = zip(*points)        # 拆開（unzip 其實也是 zip）
```

### 求助、Markdown 與互動

- 函數名稱打到一半按 Shift + Tab 會跳出說明，按兩次看完整說明
- `\pi` 加 TAB 可以打出希臘字母，能拿來當變數名稱
- Markdown cell 可以寫標題、條列、超連結、插圖，還支援 LaTeX 數學式
- `from ipywidgets import interact`：寫一個帶參數的函數，交給 `interact` 就有滑桿或下拉選單

投影片最後的互動例子，把畫圖與滑桿接在一起：

```python
x = np.linspace(-5, 5, 1000)

def draw(n=1):
    y = np.sinc(n*x)
    plt.plot(x, y, lw=3)

interact(draw, n=(1., 10.))
```

## 第一週作業：在 Colab 畫一個函數圖形

以下是長庚衛星班版本（截止 3/10 23:59）。題目只有一句：**請在 Colab 中畫一個函數圖形。**

繳交內容必須包含三樣：Colab 連結（共用權限要打開）、對這份作業的重點說明、重點截圖。

評分標準把「做得跟範例多像」拉成一條光譜：

| 分數 | 條件 |
|---|---|
| 0 | 程式連結無法順利開啟，且無截圖 |
| 1 | 程式開啟後只有匯入基本套件 |
| 2 | 程式連結無法順利開啟，但有部分截圖 |
| 3 | 作業與本週主題無關 |
| 6 | 基本分：程式內容與課堂範例十分近似，例如 sin(x) 改成 cos(x) 或 2sin(x) |
| 8 | 常見的一元二次函數 |
| 9 | 圖形很有創意（本週老師沒教到的函數都可以） |
| 10 | 圖形很有創意，且有漂亮的 Markdown 文字註解 |

兩條註記要特別注意：沒有引入固定 4 行套件總分扣 1；「連結無法開啟」包含權限未開、交的不是 Colab 連結、程式碼無法完整執行三種情況。

自學時，這份作業的重點不在函數本身，而是把 Colab 的工作流程走一遍：從 GitHub 開檔、存副本、寫 Markdown、開分享權限。後面每一週都要重複這套流程。

## 自學檢查點

- 你能在新的 Colab 筆記本裡跑出四行標準套件，沒有錯誤
- 你能說出 `%matplotlib inline` 和 `!pwd` 差在哪（前者是魔術指令，後者是系統指令）
- 你能用 `zip(*points)` 把一串點拆成 X、Y
- 你能用一句話說明「呆萌型 AI 機器人」：只需要知道輸入與輸出長什麼樣子的函數學習機
- 你的第一份作業用的函數不是 sin 的變形，而且有 Markdown 說明

今晚可以做的一件事：選一個課堂沒教過的函數（例如極座標的玫瑰線），用 `interact` 做成可以拉滑桿調參數的圖。

## Fall 2026 的第一講

1151 學期第 1 講在 2026-09-08 直播，[錄影](https://www.youtube.com/watch?v=oRPRnGJwA8c)標題改成「如何不焦慮地學 AI：用原理站穩腳步，用專業教 AI 做事」。從說明欄的分段看，主軸沒變（掌握 AI 原理降低學習焦慮、八哥辨識、圖靈測試、Colab 入門、函數繪圖），多了「生成式 AI 的轉變：從提供建議到執行任務」與「從提示詞到 AI Agent」兩段。

## 延伸閱讀

- 課程歸屬、評分版本與完整作業表：[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)
- 另一門也用 Colab 從零開始的台灣課程：[台大李宏毅 機器學習 2026 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)
- 各校課程公開程度的比較：[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [【生成式 AI】01. 為什麼要研究生成式 AI？（課程介紹）](https://www.youtube.com/watch?v=4BRBxy0EMT8) — 1132 第 1 講直播錄影與分段時間軸（2025-02-18）
- [1132 投影片資料夾（yenlung.me/1132GenAI）](https://yenlung.me/1132GenAI) — GenAI01 課程介紹，121 頁；本文引用第 18、20–23、43–60、62–113、115–116 頁
- [長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025) — 第一週作業說明、繳交內容與評分標準
- [yenlung/AI-Demo](https://github.com/yenlung/AI-Demo) — 在 Colab 以 GitHub 使用者 `yenlung` 開啟的範例 repo
- [1132 YouTube 播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv) — 全學期 14 支錄影
- [1151 第 1 講：如何不焦慮地學 AI](https://www.youtube.com/watch?v=oRPRnGJwA8c) — Fall 2026 版本的分段時間軸
- [Google Colab](https://colab.research.google.com/) — 課程使用的雲端 notebook 平台
