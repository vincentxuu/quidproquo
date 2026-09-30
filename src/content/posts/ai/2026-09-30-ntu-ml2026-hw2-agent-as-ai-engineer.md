---
title: "台大李宏毅 ML 2026 導讀：HW2 讓 AI Agent 當 AI 工程師——用 AIDE 式樹搜尋，讓開源 LLM 自己寫出 MyGO & Ave Mujica 臉部辨識"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, coding-agent, computer-vision, image-classification]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 5
tldr: "HW2 不讓你直接寫分類器，而是寫 prompt 與流程，讓一個跑在 Colab T4 上的開源 LLM（預設 gemma-3-12b-it 的 4-bit GGUF）自己規劃、寫 code、執行、除錯，做出 10 類 MyGO & Ave Mujica 角色臉部辨識。起始碼改自 AIDE：Interpreter 執行程式、Node 記錄每一版、Journal 組成解答樹、Agent 決定下一步要 draft、debug 還是 improve。最值得先發現的一件事：起始碼的評估函式是空的，每一版都被標成 metric 1.0、不是 bug，所以樹搜尋在你補上評估之前其實是瞎選。規定寫得很重：「LLM agent 是你的代理人」，不准手改程式與預測檔。"
description: "台大李宏毅《機器學習 2026 Spring》HW2（AI Agent as an AI Engineer）導讀，依 hw2.pdf、Colab 起始碼與作業說明影片：Context is Everything 與 Intentional Compaction、資料集與 Accuracy 指標、ResNet18 建議、AIDE 的 Interpreter／Node／Journal／Agent 結構與搜尋策略、三個 baseline、規定與校外讀者能做到哪裡。"
draft: false
glossary:
  - term: "Intentional Compaction"
    aliases: ["刻意壓縮"]
    definition: "在 context 滿之前，主動請 agent 把目前做了什麼、方法、步驟與失敗寫進一份檔案（例如 progress.md），再用這份檔案開新的對話繼續。"
    context: "HW2 投影片第 9–10 頁引用 advanced-context-engineering-for-coding-agents 的做法，搭配 Research → Plan → Implement 三階段。"
  - term: "AIDE"
    aliases: ["AI-Driven Exploration"]
    definition: "把機器學習工程當成程式碼最佳化問題，用樹搜尋在候選解之間反覆 draft、debug、improve 的 LLM agent。"
    context: "HW2 的 Colab 起始碼改自 WecoAI 的 aideml 專案。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-hw2-agent-as-ai-engineer-en)

**本文依據[台大李宏毅《機器學習 2026 Spring》](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)的 HW2。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 5 篇。前兩篇講了 [Context Engineering](/posts/ai/2026-09-30-ntu-ml2026-context-engineering) 與 [agent 對研究工作的衝擊](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work)，這份作業讓你親手做一個縮小版：**讓 agent 替你當一次 AI 工程師**。

用到的官方材料：作業投影片 [hw2.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw2.pdf)（59 頁）、[Colab 起始碼](https://colab.research.google.com/drive/1hAT97f4GmBQFpWKHiRymIDJiXEsPlXS1?usp=sharing)（32 個 cell），以及助教的[作業說明影片](https://youtu.be/3xhwSsuNTM0)。作業 3/13 公告，截止時間是 2026/4/2 23:59（UTC+8）。

## 校外讀者能做到哪裡

存取等級 **A3（評分鏈除外）**：

- 拿得到：投影片、Colab 起始碼，以及起始碼裡用 `gdown` 下載的資料集 `hw2_data.zip`（2026-09-30 實測仍可下載，約 99 MB）。
- 拿不到：評分平台 JudgeBoi 目前連不上，程式碼繳交在需要台大帳號的 NTU COOL。所以你看不到 public／private 的實際分數。
- 替代做法：資料集附了 300 張的驗證集，你可以用驗證集 accuracy 對照投影片公布的 baseline 門檻自評。

## 作業的前提：Context is Everything

投影片前 11 頁先講一件作業以外的事：**怎麼和 AI agent 一起寫程式**。

第 6 頁引用一份大規模開發者研究的圖：用 AI 寫軟體之後，重工（rework）變多了。第 7–8 頁的回答是「Context is Everything」：LLM 每一步都是依目前的 context 決定下一個動作，context 裡有錯的方向（例如「不要用 XYZ 做法」這種反覆糾正），後面就會一路歪。

第 9–10 頁給出的解法是 **Intentional Compaction**：在 context 滿之前，請 agent 把「做過什麼、用什麼方法、目前卡在哪」寫進 `progress.md`，再用這份檔案開新的一輪。投影片示意的比例是 10 萬行程式碼壓成 1 萬行 markdown，並搭配三階段流程：

1. **Research**（可選）：理解 codebase、相關檔案、資訊怎麼流動。
2. **Plan**：寫出精確的修改步驟與每一階段的驗證方式。
3. **Implement**：照計畫一階段一階段做，每做完一段就把狀態壓回計畫檔。

第 11 頁的結論是一句話：**The Agent is only as smart as the context you provide.** 這正是[上一講](/posts/ai/2026-09-30-ntu-ml2026-context-engineering)的「卸載記憶」與「subagent 即壓縮」落到日常工作的版本。

## 任務：10 類角色臉部辨識

第 14–16 頁：

| 項目 | 內容 |
|---|---|
| 任務 | 給一張臉，分成 10 個角色之一 |
| 類別 | MyGO：tomori、anon、soyo、taki、rana；Ave Mujica：sakiko、nyamuchi、umiri、uika、mutsumi |
| 資料量 | 約 2,400 張：訓練 1,600、驗證 300、測試 500（public 與 private 各 250） |
| 格式 | 150×150×3 的圖片，JSON 標註 `{"id", "filename", "label"}` |
| 指標 | Accuracy |

投影片第 17 頁直接給了方向：**fine-tune ResNet18 跑 5 到 10 個 epoch 就足以超過 strong baseline。**第 18–21 頁複習 CNN 的卷積、激勵函數、池化、全連接，以及局部連接與權重共享，並列出李宏毅 2017、2021 的 CNN 課與 2025 年生成式 AI 課 HW6 當補充。

限制有兩條要特別注意：只能用 CNN 與 LLM，**VLM 與其他更強的模型禁止使用**；也不能去找額外資料或測試集答案。

## 起始碼：一個縮小版的 AIDE

Colab 第一格就寫明，程式改自 [WecoAI 的 aideml](https://github.com/WecoAI/aideml)，也就是論文 [AIDE: AI-Driven Exploration in the Space of Code](https://arxiv.org/abs/2502.13138)。投影片第 23 頁把 AIDE 的主旨濃縮成一句：啟發式的最佳優先搜尋，**哪一版程式跑出最好結果，就以它為基礎做下一步最佳化。**

起始碼的模組對應如下：

| Colab 區塊 | 做什麼 |
|---|---|
| LLM 載入 | 用 `llama-cpp-python` 載入 `gemma-3-12b-it-Q4_0.gguf`，`n_ctx=16384`，生成用 `temperature=0` |
| Interpreter（不准改） | 在子行程裡執行 agent 寫的 `runfile.py`，收集輸出、例外與執行時間 |
| Node | 一版解答：plan、code、執行結果、是否 buggy、metric；分成 draft／debug／improve 三種階段 |
| Journal | 所有 Node 組成的樹；能列出 buggy 與 good 節點、找最佳節點、產生給 LLM 看的歷史摘要 |
| Agent | `search_policy` 決定下一步，`_draft`／`_debug`／`_improve` 各自組 prompt，`parse_exec_result` 解析執行結果 |
| Config | `steps`（迭代次數）、`debug_prob`、`num_drafts` |

`search_policy` 的邏輯只有三步：draft 數量不足就先 draft；否則以 `debug_prob` 的機率挑一個 buggy 的葉節點去修；不然就挑 metric 最高的好節點去 improve。投影片第 25–26 頁用圖說明了這個 action space。

### 先發現這個：評估是空的

打開 `parse_exec_result` 會看到，起始碼雖然請 LLM 讀了執行輸出，最後卻寫死：

```python
node.is_buggy = False
node.metric = 1.0
```

也就是說，**在你補上評估之前，每一版都被當成沒有 bug、分數一樣**。`get_best_node` 取 metric 最大值時等於隨便挑，debug 分支也永遠不會被觸發。註解裡提示可以用 instructor 強制 LLM 輸出結構化結果，把 accuracy 抽出來。這是整份作業最關鍵的一個 TODO：沒有可靠的評估，樹搜尋就沒有方向。

另外，Config 預設 `steps: 1`、`num_drafts: 1`，只會產生一份 draft。投影片第 32 頁說跑預設程式碼就能過 simple baseline，而 simple baseline 的門檻是 0.00。

## 評分與 baseline

第 32–35 頁：程式碼繳交 4 分，public／private 各三條 baseline 各 1 分，合計 10 分。

| Public baseline | 分數 | 預估 drafting 時間 | 預估訓練時間 |
|---|---|---|---|
| Simple | 0.00 | 5–10 分鐘 | 0–3 分鐘 |
| Medium | 0.65 | 5–10 分鐘 | 3–5 分鐘 |
| Strong | 0.87 | 10–30 分鐘 | 3–5 分鐘 |

時間是在 Colab T4 上估的。投影片特別提醒：過了 public baseline 不保證過 private。JudgeBoi 每天可以上傳 5 次 `pred.json`。

投影片第 32 頁與第 45–54 頁列出的改進方向：prompt engineering（「想像你在教學生寫程式」）、資料增強（水平／垂直翻轉、±45 度旋轉、裁切、亮度、模糊、雜訊、灰階）、換 LLM 或 CNN、多 draft 並多做 improve 與 debug、補上評估。最後一頁的建議很具體：換 LLM 時先試約 10 GB 的 checkpoint；prompt 要精簡明確；先做資料增強並換一個強一點的 LLM；可以自由修改 pipeline。

## 規定：LLM agent 是你的代理人

第 37 頁的第一行寫得很重：**LLM agent 是你的代理人，它違規就等於你違規。**具體規定包括：

- 不准使用 GPT-5、Gemini-3 等閉源 LLM API，只能用開源模型（投影片建議從 Hugging Face 挑）。
- 不准手動修改輸入檔或預測檔。FAQ 也一再強調：沒產生預測檔、JSON 格式錯，都要**改 prompt 讓 agent 修**，不能自己改 Python 或 JSON。
- 固定亂數種子，讓助教能重現預測。
- 不准找額外資料或測試集答案，不准分享程式碼與預測檔。

違規第一次是該作業 0 分且學期總成績乘 0.9，超過一次直接 F。

這條規定其實就是作業的教學目標：你真正交出去的，是**一套能讓 agent 穩定產出分類器的 prompt 與流程**。

## 這一篇可以確認與不能確認的

可以確認：hw2.pdf 的全部規定與數字、Colab 起始碼的結構與預設值（逐格讀過）、資料集下載連結在 2026-09-30 仍可用。作業說明影片的標題與上傳者已用 YouTube oEmbed 核對。

不能確認：本文沒有逐字聽寫作業說明影片，也沒有實際在 T4 上跑完整流程，所以沒有自己的 accuracy 數字。private baseline 門檻、JudgeBoi 排行榜與助教的批改結果，校外都拿不到。

**怎麼做**：今晚打開 Colab，先別換模型，只做兩件事：把 `parse_exec_result` 改成真的從執行輸出抽出驗證集 accuracy，再把 `steps` 調到 5。跑完之後看 Journal 裡哪幾個節點被標成 buggy、哪個是最佳節點。這一步做對了，後面所有的 prompt 調整才有回饋可看。

延伸閱讀：站上的 [CS231n：CNN 與影像分類](/posts/ai/2026-09-30-cs231n-cnn-image-classification)補 CNN 本身；[coding agent 的 context 壓縮](/posts/ai/2026-08-25-coding-agent-context-compaction)補 Intentional Compaction 的工程細節。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)｜上一篇 [AI Agent 之間的互動與對工作的衝擊](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work)｜下一篇 [加快生成（上）：Flash Attention](/posts/ai/2026-09-30-ntu-ml2026-flash-attention)

## 參考資料

- [台大李宏毅《機器學習 2026 Spring》課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [HW2 投影片 hw2.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw2.pdf)
- [HW2 Colab 起始碼](https://colab.research.google.com/drive/1hAT97f4GmBQFpWKHiRymIDJiXEsPlXS1?usp=sharing)
- [影片：ML 2026 Spring hw2 AI Agent as an AI Engineer](https://youtu.be/3xhwSsuNTM0)
- [AIDE: AI-Driven Exploration in the Space of Code（arXiv 2502.13138）](https://arxiv.org/abs/2502.13138)
- [WecoAI/aideml](https://github.com/WecoAI/aideml)
- [humanlayer：advanced-context-engineering-for-coding-agents](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents)
- [instructor：llama-cpp-python 整合](https://python.useinstructor.com/integrations/llama-cpp-python/)
- [unsloth/gemma-3-12b-it-GGUF（Hugging Face）](https://huggingface.co/unsloth/gemma-3-12b-it-GGUF)
