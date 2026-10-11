---
title: "李宏毅 ML 2026 HW6：Model Editing，只改一條知識、不動其他的"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ai-course, model-editing, fine-tuning]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 14
tldr: "HW6 不用訓練模型，全部在 NTU COOL 上作答：6 分是讀 ROME、MEND、MEMIT、WISE 四篇論文後答 16 題選擇題，4 分是把 Colab 裡的 fine-tuning 換成 ROME，在 GPT2-XL 上做 single editing（自己編一條知識、寫 5 種測試提示）與 multiple editing（CounterFact 子集 10 筆、80 筆，再換 MEMIT），回報 efficacy、paraphrase、neighborhood、portability 四個分數。作業投影片與 47 個 cell 的 Colab 都公開，但測驗題本身與解答只在 COOL 上。"
description: "台大李宏毅《機器學習 2026 Spring》HW6「Model Editing」導讀：投影片怎麼把 IKE、MEND、ROME／MEMIT 放進「不動參數／人類決定怎麼改／AI 學怎麼改」的分類，四篇指定論文，Colab 實驗的 single editing 五種提示與 multiple editing 四個分數，ROME 更新式的提示，繳交規則，以及校外讀者拿不到的部分。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據 [機器學習 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) 的 HW6。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 14 篇。官方材料有三份：作業投影片 [hw6.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw6.pdf)、[作業 Colab](https://colab.research.google.com/drive/1gnaowsSzOT3VSw8j_MIDnksQiaZeKikA?usp=sharing)（47 個 cell），以及助教的[說明影片](https://youtu.be/AR1bNACLOAU)。助教是鄭安妤、楊樂霖、尹廷安、林育正。4/24 公告，截止時間 2026/05/14 23:59:59（UTC+8），不收遲交，成績在 2026/05/17 23:59:59 前公布。

存取分級是 **A3 減評分**：投影片與 Colab 公開，照著做得出實驗結果；但**測驗題目本身**在 NTU COOL 上，需要台大帳號，hw6.pdf 只寫了題數與配分，沒有印出題目。

## 課程影片來源

影片來源已對照官方課程頁，並於 2026-10-10 即時查核：講次與影片一致，YouTube 公開且可嵌入。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=AR1bNACLOAU
title: HW6 說明影片（YouTube）
```

原始影片：[HW6 說明影片（YouTube）](https://www.youtube.com/watch?v=AR1bNACLOAU)

課程與錄影入口：

- [官方課程與錄影入口](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

查核日期：2026-10-10。

影片字幕：2026-10-10 嘗試取得，但此影片沒有可取得的字幕，本文未核對影片口述內容；上述作業說明僅來自作業 PDF 與 Colab，沒有對影片內容做具體說法。

## 先備：本學期沒有講 Model Editing

HW6 跟本學期任何一講都沒有一對一關係。hw6.pdf 沒有指定先備影片，不過 2025 年同一門課的課程頁有一講[「人工智慧的微創手術 — 淺談 Model Editing」](https://youtu.be/9HPsz7F0mJg)（[edit.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/edit.pdf)）；那學期的作業表上也有一份 HW8 Model Editing。本文建議先看那一講當背景（這是本文的建議，不是官方指定）。Colab 下載的資料檔還叫 `HW8_data.json`，可見這份作業是從 2025 年的版本沿用過來的。

## Model Editing 在問什麼

[HW5](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting) 的問題是：微調一整個能力時，怎麼不把其他行為洗掉。HW6 把粒度縮到最小：**只想改模型的一條知識**（例如把「美國總統是誰」的答案改掉），能不能只改到這一條、其他都不動？

投影片用一張分類圖把三類方法串起來：

| 分類 | 代表方法 | 投影片上的示意 |
|---|---|---|
| 不動參數 | IKE | 把新知識和幾個示範寫進 context，讓模型照著答 |
| 改參數：人類決定如何編輯 | ROME、MEMIT | 找到要改的權重 $W$，算出一組 $k^*$、$v^*$，讓最終輸出變成新答案（圖上的例子是 Taipei） |
| 改參數：人工智慧學習如何編輯 | MEND | 訓練一個 hypernetwork，吃「要改的知識」和中間層的輸出，產生 $\theta$ 的修改量 $e$ |

IKE 那張圖的示範分三種：Copying（直接照抄新事實）、Updating（事實換了，問法相同）、Retaining（跟新事實無關的問題要維持原答案）。最後一種就是整份作業的核心要求：**改得到，也不能改過頭**。

## 第一部分：論文閱讀（6%，16 題選擇題）

指定四篇論文，讀完到 COOL 答題：

- **[ROME](https://arxiv.org/abs/2202.05262)**（Locating and Editing Factual Associations in GPT）
- **[MEND](https://arxiv.org/abs/2110.11309)**（Fast Model Editing at Scale）
- **[MEMIT](https://arxiv.org/abs/2210.07229)**（Mass-Editing Memory in a Transformer）
- **[WISE](https://arxiv.org/abs/2405.14768)**（Rethinking the Knowledge Memory for Lifelong Model Editing of Large Language Models）

注意分類圖裡的 IKE 不在閱讀清單上，反而是圖上沒出現的 WISE 在清單裡。hw6.pdf 的 Reference 也只列這四篇。

## 第二部分：實驗（4%，10 題）

Colab 預設跑的是 **fine-tuning** 編輯法。第一格就用粗體警告：直接執行只會跑 fine-tuning，**一定要先改程式碼**再作答。規定只能用 **GPT2-XL** 當基礎模型，Colab 裡寫死 `MODEL_NAME = "gpt2-xl"`。Colab 會下載 [MEMIT 的程式庫](https://github.com/kmeng01/memit)來用它的工具函式。

### Single editing：自己編一條知識

1. **補完 ROME**：`apply_rome_to_model()` 裡有一行被註解掉、需要你填寫的程式碼。
2. **切換方法**：主流程裡呼叫 ROME 的那一行也被註解掉了，把 `FTHyperParams, apply_ft...` 換成 ROME 的版本就好。
3. **寫編輯請求**：在 `requests` 裡填 `prompt`、`subject`、`target_new`、`target_true`。
4. **寫 5 個 generation prompts**，每一種測的是不同面向：

| 類型 | 規則 | 投影片範例 |
|---|---|---|
| original | 把 `{}` 換成 subject | 「Steve Jobs was the founder of」 |
| paraphrase | 同 subject、同 target 的另一種說法 | 先講 Apple II，再接「Steve Jobs founded」 |
| neighborhood | 和原句很像，但 subject 與 target 都不同 | 「Mark Zuckerberg, the founder of」 |
| reversion | 主受詞反過來，用 `target_new` 當新主詞 | 「Microsoft is founded by」 |
| portability | 和原句有邏輯關係的延伸 | 「After Y2K, the company Steve Jobs founded released the operating system,」 |

然後跑 ROME，回報 5 個提示的 [Post-Edit] 結果，再判斷其中哪幾個算編輯成功（1 分）。

投影片特別標了 IMPORTANT：**要用自己的知識與提示**，照抄範例、分享或抄別人的提示都算違規。

這五種提示本身就是 model editing 的評估框架。paraphrase 測泛化（換個說法還記得嗎），neighborhood 測局部性（有沒有誤傷鄰近知識），reversion 與 portability 測模型是否真的「理解」了新事實，還是只記住一個字串對應。

### Multiple editing：CounterFact 子集

助教準備了 80 筆資料，每筆有一個編輯請求、一個 paraphrase 提示、一個 neighborhood 提示、一個 portability 提示。portability 提示是手寫或 ChatGPT 產生的，其餘來自 CounterFact 資料集。投影片提醒：因為模型有隨機性，用原本正確答案算出來的原始分數不一定是 1.0。

三個小題各 1 分：

1. 取前 10 筆，用 ROME 編輯，回報 efficacy、paraphrase、neighborhood、portability 四個分數（post）。
2. 改用全部 80 筆，重做一次。Colab 裡把 `requests = json.load(file)[0:10]` 換成註解掉的那一行即可。
3. 改用 **MEMIT**，再回報四個分數。

要比較的就是：一次改 10 條和一次改 80 條，ROME 撐不撐得住；專門為批次編輯設計的 MEMIT 又如何。

## 兩個提示

1. ROME 論文裡的 `upd_matrix` 有一個更新式，附錄裡還有另一條會用到的式子。投影片說答案「就是兩個向量的外積」，並提醒 GPT2-XL 和 GPT-J 的參數是**轉置過的**。
2. 要換成別的方法，鼓勵去讀 [ROME](https://github.com/kmeng01/rome) 與 [MEMIT](https://github.com/kmeng01/memit) 的原始碼，特別是 `experiments/py/demo.py`。

<details>
<summary>為什麼 ROME 的更新是一個外積（本文補充）</summary>

ROME 把 MLP 的一層權重 $W$ 看成一個 key-value 記憶：輸入 $k$（subject 最後一個 token 的表示）、輸出 $v$。要讓 $W k^* = v^*$，同時盡量不影響其他 key，論文推出的更新是一個秩為 1 的矩陣，也就是一個列向量乘一個行向量。實作時要注意 Hugging Face 的 GPT-2 用的是 `Conv1D`，權重的形狀和一般 `Linear` 是轉置的，這就是投影片那句提醒的原因。細節以 ROME 論文與程式庫為準。

</details>

## 繳交規則

- 在 NTU COOL 繳程式碼並完成測驗。測驗沒有繳交次數限制，以最後一次為準。
- 只能用 GPT2-XL。
- 不准分享或抄襲提示、程式碼與答案。違規第一次是學期總成績乘 0.9 且本作業 0 分，第二次學期 F。

hw6.pdf 有兩處看得出是沿用舊版：single editing 的兩頁寫「report them on Gradescope」，其餘頁面與課程頁都寫 NTU COOL；聯絡信箱寫的是 `ntu-ml-2025-spring-ta@googlegroups.com`。本文以課程頁和投影片其餘頁面的 NTU COOL 為準。

## 校外讀者拿不到的部分

- **測驗題目與解答**：16 題論文選擇題與 10 題實驗題都只在 COOL 上。本文沒有找到公開版本。
- **自動判分**：實驗題要回報的是你自己跑出來的分數與判斷，校外沒辦法對答案。

**自己練的做法**（這是本文的建議，不是官方流程）：照 Colab 跑完 single editing 的 5 個提示，把 fine-tuning 和 ROME 的 [Post-Edit] 結果並排，看 neighborhood 那一句有沒有被誤改。multiple editing 則畫一張 10 筆與 80 筆、ROME 與 MEMIT 的四分數對照表。論文題可以替自己出題：每篇各回答「改哪一層、怎麼算更新量、怎麼評估局部性」三個問題。

**今晚就能做的事**：打開 Colab，先不改任何程式碼，用 fine-tuning 對一條你自己選的知識做 single editing，記下 5 個提示的結果。明天換成 ROME 再跑一次，比較哪幾句的結果不一樣。

## 延伸閱讀

- 微調整個能力時的遺忘問題：[HW5：微調而不遺忘](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting)
- 同一週的講次，另一種「不改參數也能修正」的思路：[Self-Correction](/posts/ai/2026-09-30-ntu-ml2026-self-correction)

系列導覽：上一篇 [Self-Correction：模型能改自己的錯嗎](/posts/ai/2026-09-30-ntu-ml2026-self-correction)｜下一篇 [AI 自我成長（上）](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1)｜[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。對照官方課程頁與 YouTube，講次與嵌入影片一致、可公開嵌入，狀態改為已附影片。
- 2026-10-10：嘗試依字幕核對影片內容，但影片沒有可取得的字幕，影片口述內容未核對；本文對作業的說明僅依 PDF 與 Colab。

## 參考資料

- [Machine Learning 2026 Spring 課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) — HW6 公告日、截止時間、助教、平台
- [ML 2026 Spring HW6：Model Editing（hw6.pdf）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw6.pdf) — 分類圖、題數與配分、實驗步驟、提示、規定
- [HW6 Colab](https://colab.research.google.com/drive/1gnaowsSzOT3VSw8j_MIDnksQiaZeKikA?usp=sharing)
- [HW6 說明影片（YouTube）](https://youtu.be/AR1bNACLOAU)
- [【生成式AI時代下的機器學習(2025)】第十講：人工智慧的微創手術 — 淺談 Model Editing](https://youtu.be/9HPsz7F0mJg)、[edit.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/edit.pdf)
- [Locating and Editing Factual Associations in GPT（ROME，arXiv 2202.05262）](https://arxiv.org/abs/2202.05262)
- [Fast Model Editing at Scale（MEND，arXiv 2110.11309）](https://arxiv.org/abs/2110.11309)
- [Mass-Editing Memory in a Transformer（MEMIT，arXiv 2210.07229）](https://arxiv.org/abs/2210.07229)
- [WISE: Rethinking the Knowledge Memory for Lifelong Model Editing of Large Language Models（arXiv 2405.14768）](https://arxiv.org/abs/2405.14768)
- [kmeng01/rome（GitHub）](https://github.com/kmeng01/rome)
- [kmeng01/memit（GitHub）](https://github.com/kmeng01/memit)
