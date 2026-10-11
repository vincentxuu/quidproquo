---
title: "李宏毅 ML 2026 Self-Correction：模型能改自己的錯嗎？改 decoding、改 workflow、改參數各換到什麼"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ai-course, self-correction, reasoning, rlvr]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 13
tldr: "這一講問：沒有人介入時，模型能不能自己發現錯誤並改正？李老師把做法分成三條路。改 inference：contrastive decoding 一家族都在「製造一個會答錯的版本，再把它減掉」，差別只在錯誤版本怎麼來。改 workflow：插一句「再檢查一下」有時有用但不穩定，外部回饋比自我反思可靠，而且在算力有限時，拿同樣算力多抽幾個答案投票往往更划算。改參數：直接教自我修正會遇到「訓練後犯的錯不一樣了」，所以業界改用 RL；RL 到底是教會新能力還是只把本來就有的路徑變常見，目前仍在爭論。"
description: "台大李宏毅《機器學習 2026 Spring》4/24 Self-Correction 講次導讀：Contrastive Decoding、DoLa、LayerCD、ICD、CAD、影像與音訊版本、MTI；自我修正 benchmark、RefineBench、confidence level 與 critique score、反思指令的用詞、verification 在固定算力下划不划算；ReVISE、直接教自我修正的極限、RLVR、為什麼 reasoning 要先錯再對、RL 到底學到了什麼。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-self-correction-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據 [機器學習 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) 4/24「如何教育模型 (2)：Self-Correction」。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 13 篇。用到的官方材料是講義 [Self-Correction.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/Self-Correction.pdf)（65 頁，另有 pptx）與影片 [AI 能自我修正嗎？從 decoding、workflow 到 reasoning 的技術發展整理](https://youtu.be/m3i2mk5hs8U)。存取等級是 **A3**：投影片與錄影都公開。

## 課程影片來源

影片來源已對照官方課程頁，並於 2026-10-10 即時查核：講次與影片一致，YouTube 公開且可嵌入。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=m3i2mk5hs8U
title: 影片：AI 能自我修正嗎？從 decoding、workflow 到 reasoning 的技術發展整理
```

原始影片：[影片：AI 能自我修正嗎？從 decoding、workflow 到 reasoning 的技術發展整理](https://www.youtube.com/watch?v=m3i2mk5hs8U)

課程與錄影入口：

- [官方課程與錄影入口](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：影片 m3i2mk5hs8U（1:27:42）字幕全文已讀。核對三條路線的分法、representation 偵測錯誤與 TruthX（字幕誤聽為 True Facts）、contrastive decoding 的 (1+α)z−αz⁻ 與每個 token 都要多跑一次、歐巴馬／GPT-2 Small 例子、DoLa（logit lens、Hugging Face 內建、第一作者為實驗室前專題生）、LayerCD、ICD 降智咒語、CAD 與黑色香蕉／衝浪板例子、音訊版、MTI（借用 KV Cache、Output Error、62% 到 72%、換字變差）、VISTA／ACG、再檢查一下的兩個直覺與批判不一定比生成容易的但書、Can LLMs Correct Themselves 與 RefineBench 的結論、confidence level 與 critic score 公式及指令用詞影響、verification 的兩張圖與 majority vote baseline（字幕說約 100 倍以上算力換 3.8%，文中寫 128 倍為投影片數字）、希拉蕊出生地例子、ReVISE 兩階段、直接教修正的分佈偏移、RLVR、cost of thinking、K^(T+1) 與 6 位元 parity 例子、pass@k 之爭與 The Debate on RLVR，皆與字幕一致，未發現錯誤。CL／CS 表的具體數字、各論文編號與投影片頁碼屬講義內容，字幕無法驗證。

## 問題：沒人提醒時，模型能不能自己改

你跟模型說「你錯了，錯在這裡」，它通常改得過來。這一講問的是更難的版本：**模型輸出答案後，沒有任何人介入，它能不能自己發現錯、自己改對？**

李老師說這個題目以前講過兩次。2023 年的[「ChatGPT 可以自我反省！」](https://youtu.be/m7dUFlX-yQI)是第一次；這一講有很大一部分是 2025 年[第七講「深度思考（Reasoning）」](https://youtu.be/bJFtcwLSNxI)的延伸，而且「不會重複過去太多內容」。投影片在幾個段落都附了那支 2025 影片的時間點，沒看過的話可以對照著補。

整講的骨架是三條路，由淺入深：

| 路線 | 動的是什麼 | 要不要訓練 | 代價 |
|---|---|---|---|
| 修改 Inference 過程 | 每一步生成的機率分布 | 不用 | 多跑一次（或一部分）推論 |
| 修改 Harness（Workflow） | 生成後插一句反思指令 | 不用 | 每題都多產生一段 token |
| 修改 Model Parameters（Reasoning） | 模型參數 | 要 | 訓練成本 |

## 第一條路：改 inference

### 錯誤訊號藏在 representation 裡

老師先用兩篇較早的研究說明「偵測」與「修正」都可能自動做。第一篇（[arXiv 2304.13734](https://arxiv.org/abs/2304.13734)）收集模型答對與答錯時的 representation，訓練一個二元分類器，發現它能在沒看過的問題上某種程度預測答案對不對。第二篇 [TruthX](https://arxiv.org/abs/2402.17811) 把答對與答錯的 representation 各自平均再相減，得到一個「正確減錯誤」的向量，加回模型本來會答錯的 representation 上，模型就可能改答對。

兩者共同的缺點寫在投影片上：**需要蒐集額外的資料**。

### Contrastive decoding：製造一個會答錯的版本，再把它減掉

不蒐集資料的辦法是 contrastive decoding。同一個問題跑兩次：一次正常輸入，一次**故意製造出可能會答錯的狀態**，再把兩者的輸出相減，把答案推離錯誤那一邊。每生成一個 token 都要做一次。

<details>
<summary>式子長什麼樣</summary>

老師的講法是：正常輸出記為 $z$，錯誤版本記為 $z^-$，相減後乘上一個通常小於 1 的 $\alpha$ 再加回去，等於

$$
(1+\alpha)\,z - \alpha\, z^-
$$

文獻上最常見的是在最終的 logit 或機率分布上做，而不是中間的 hidden layer。後面 CAD、音訊版的投影片寫成 $(1-\alpha)$ 與 $\alpha$ 的組合，意思一樣：提高正常成分、扣掉錯誤成分。

</details>

投影片直接寫了它的取捨：**優點是不改模型參數**，訓練完隨時能套；**缺點是額外運算**，本來推論一次，現在要多跑一次錯誤版本。

最早用這個名詞的是 2022 年的 [Contrastive Decoding](https://arxiv.org/abs/2210.15097)。老師舉的例子是「歐巴馬生在檀香山，他生於」：GPT-2 大模型機率最高的是 Hawaii（錯，應該接年份），拿 GPT-2 Small 的輸出當錯誤版本相減後，最高的變成 1961。因為兩個模型層數不同，相減只能做在最終輸出上。

之後的方法幾乎都在回答同一個問題：**錯誤版本從哪裡來？** 投影片最後用一張表整理，這裡照它的欄位列出：

| 方法 | 怎麼拿到錯誤結果 | 改哪裡 |
|---|---|---|
| [Contrastive Decoding](https://arxiv.org/abs/2210.15097) | 小模型 | output |
| [DoLa](https://arxiv.org/abs/2309.03883) | 淺層用 logit lens 生成的結果 | output |
| [LayerCD](https://arxiv.org/abs/2509.25177) | 用淺層的影像 encoder layer | output |
| [ICD](https://arxiv.org/abs/2311.00233) | 降智咒語 | output |
| [CAD](https://arxiv.org/abs/2305.14739) | 拿掉 context（例如 RAG 檢索到的文件） | output |
| [VCD](https://arxiv.org/abs/2311.16922) | 影像加雜訊、打亂 patch、蓋住重要部分 | output |
| [Audio-aware Decoding](https://arxiv.org/abs/2506.07233) | 移除聲音 | output |
| [MTI](https://arxiv.org/abs/2510.13940) | 降智咒語，目標是減少算力消耗 | output |
| [VISTA](https://arxiv.org/abs/2502.03628) | 移除影像 | hidden representation |
| [ACG](https://arxiv.org/abs/2601.13707) | 移除影像 | attention |

幾個值得多講一句的：

- **DoLa** 建立在 [logit lens](https://www.lesswrong.com/posts/AcKRB8wDpdaN6v6ru/interpreting-gpt-the-logit-lens) 上：把 LM head 接到中間層也能解碼。投影片的例子是問 Llama 2「法文 fleur 的中文翻譯」，中間層解出來是英文 flower。DoLa 假設淺層解出來的比較可能是錯的，拿它當錯誤版本；因為淺層本來就要跑，額外成本很小。老師提到 Hugging Face Transformers 已經內建 DoLa 的選項，而 DoLa 的第一作者是他實驗室以前的專題生。
- **ICD** 的「降智咒語」就是在輸入後面加一句「你都給錯誤的答案」這類話。
- **CAD** 原本用在 RAG：有些模型自認知道答案，不讀檢索來的文件。把文件拿掉跑一次當錯誤版本，再減掉。影像版最直觀：給一根黑色香蕉問顏色，模型在「香蕉就是黃的」的先入之見和畫面之間拉鋸；把圖拿掉或加強雜訊，它就只憑先入之見答「黃」，減掉之後「黑」浮上來。
- **MTI** 想省算力：只在模型最猶豫（entropy 高）的 token 上做 contrastive decoding。問題是要得到那個位置的錯誤版本，本來得重跑整段輸入。MTI 的解法是借用[跨對話 KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache)：把「降智咒語」接在最後面（論文用的是「Output Error」兩個 token），前面整段都能 cache hit，只需要重算這兩個 token。老師引用的結果是正確率從 62% 提升到 72% 左右；換成「Output Correct」、「Monkey」這類詞效果就變差。

老師的評價很務實：這些方法不需要訓練模型，「反正不用訓練，跑一下也沒有什麼損失」。改在 logit 以外的地方（hidden representation、attention）哪裡最有效，他認為還是開放問題。

## 第二條路：改 workflow

### 插一句「再檢查一下」

這裡的 workflow 是 [Harness Engineering](/posts/ai/2026-09-30-ntu-ml2026-harness-engineering) 講過的 generation + verification：模型答完後，程式自動插入一句跟題目無關的反思指令（例如「再檢查一下」），看它會不會自己改。因為這句是程式插的，仍然算自我修正。更多 workflow 變形老師請大家看 2025 第七講，這裡只講基本概念。

投影片給了兩個它可能有用的直覺：

- **批判比生成容易**：不會寫小說也能判斷小說好不好看。
- **生成無法回頭**：第一個 token 抽錯就只能一路掰下去；插入反思指令，等於給模型一個接出修正內容的「機會」。

老師也提醒這只是人類的直覺。有研究測出模型挑出自己正確答案的能力並不比生成強，但那篇把批判做成選擇題，也可能只是模型不會做選擇題。所以要看實驗。

### 實驗怎麼說

**[Can LLMs Correct Themselves?](https://arxiv.org/pdf/2510.16062)** 在很多模型與 benchmark（HotpotQA、CS-QA、GPQA、AQUA、GSM8K、MATH、HumanEval）上比較反思前後的正確率。只靠自己反思（internal）很多時候有進步，但**不穩定**，不少情況反而變差；給外部回饋（external，例如執行程式看錯誤訊息、上網搜尋）比較穩，變差的情況少，掉得也不多。

**[RefineBench](https://arxiv.org/pdf/2511.22173)** 得到類似結論。老師的講解是：對 Claude 3.5 Sonnet 這類強模型，自我反思五輪只有很小的進步；給它部分 checklist、完整 checklist、完整回饋，進步一級比一級大。**外部回饋才是最能讓模型進步的訊號。**

### 頑固與耳根軟：confidence level 與 critique score

[這篇分析](https://arxiv.org/pdf/2412.19513)把修正前後分成四種情況，定義兩個數字：

- **Confidence Level（CL）**：修正前對、修正後仍然對的機率。
- **Critique Score（CS）**：修正前錯、修正後改對的機率。

兩者直接決定修正後的正確率：

$$
\text{ACC}_2 = \text{ACC}_1 \times \text{CL} + (1-\text{ACC}_1)\times \text{CS}
$$

投影片的表上，多數模型 CL 很高、CS 很低：通常不會把對的改錯，但也很少把錯的改對。老師把這解讀成模型的「個性」，頑固和接受批評看起來有點互斥。

反思指令的用詞也會改變個性。論文在 Llama 3 上比較三種指令：Reask（再做一次）、Confidence（你應該是對的，給我最終答案）、Critique（你確定嗎？再好好想想）。以 GSM8K 為例，CL 從 Reask 的 91.7 變成 Confidence 的 93.5、Critique 的 77.7；CS 從 44.9 變成 32.9 與 47.9。**肯定它，它就更堅持；質疑它，它就更願意改，也更容易把對的改錯。** 老師推測，文獻上「反思到底有沒有用」結論分歧，可能就是因為各篇插的指令不同、模型個性也不同。

### Verification 真的划算嗎

反思要花算力。同樣的算力拿去多抽幾個答案做 majority vote，會不會更好？[這篇論文](https://arxiv.org/abs/2504.01005)做了兩張圖：

- **橫軸是答案數量時**，加上 verification 看起來很好：同樣正確率只要約四分之一的答案數。
- **橫軸換成算力（FLOPs）時**，結論翻轉：算力有限時，不做 verification、單純多抽答案投票反而比較好。要等多抽答案這條路飽和後，verification 才開始有用；投影片標出要多拿到 3.8% 的進步，得投入約 128 倍的算力。

老師的結論是：verification 像奢侈品。如果你要提新的反思 workflow，最基本的 baseline 就是同算力下的 majority vote，沒比過它的結果很可能會被質疑。

## 第三條路：改參數

### 從 workflow 到 reasoning

workflow 每題都硬插一句反思，不管答案對錯都逼模型多想。reasoning 的目標是讓模型**自己學會該改時才改**，不該改時就停，可能更省也更聰明。

但知識不等於會自我修正。投影片引用的[研究](https://arxiv.org/pdf/2505.16170)舉例：要模型舉一位出生在紐約的政治人物，它答希拉蕊；另外問它希拉蕊在哪出生，它知道是芝加哥。它有正確知識，卻沒有察覺前面的答案錯了。老師補充，那篇論文發現自我修正像是一種可以抽成 steering vector 的「狀態」，所以需要額外訓練才會具備。

### 直接教：ReVISE 與它的極限

[ReVISE](https://arxiv.org/pdf/2502.14565) 把自我修正拆成兩階段教：先教錯誤偵測（看到錯的輸出就接 `[REFINE]`，看到對的就接 `[END]`），再教錯誤修正（在錯的輸出加 `[REFINE]` 之後接正確答案）。老師說論文發現分開學比合在一起學容易。

不過 2024 年[另一篇論文](https://arxiv.org/abs/2409.12917)點出直接教的問題：模型學完之後參數變了，**犯的錯也不一樣了**。訓練時它只見過怎麼改舊的錯誤，推論時遇到的是新的錯誤，是「訓練時沒看過的狀態」，可能反而更差。所以要把產生答案和自我修正整條流程一起訓練，這就是業界改用強化學習的原因。

### RL：只看答案對不對

用可驗證獎勵的 RL（RLVR）只管最終答案，數學與程式題最適合，因為對錯一翻兩瞪眼。有趣的是，這樣訓練完，模型會自然出現「先提一個解 → 回頭檢查 → 換個方法」的行為。自我修正是自己長出來的，沒有人專門教。

### 為什麼不一開始就做對

老師給了兩個角度。第一個是 MIT News 報導的[「思考的代價」](https://news.mit.edu/2025/cost-of-thinking-1119)：在一些任務上，模型的 reasoning token 數和人類解題時間大致成正比。他也自己批評了這個比較：token 對應的應該是人在計算紙上寫的字數，不是時間。

第二個角度來自 2025 年 2 月的三篇論文（[2502.04667](https://arxiv.org/abs/2502.04667)、[2502.08991](https://arxiv.org/abs/2502.08991)、[2502.18273](https://arxiv.org/abs/2502.18273)）：假設每一步有 $K$ 種變化，一步到位要學會 $K^{T+1}$ 種輸入輸出組合，拆成 $T+1$ 步只要 $K(T+1)$ 筆。老師的具體例子是 6 位元的 parity check：直接背要 $2^6 = 64$ 筆；拆成連續做 XOR，每步只有 4 種組合、共 5 步，20 筆就夠。他也提到，如果只處理跟訓練資料同分布的題目，不 reasoning、直接背答案也行；要泛化才需要 reasoning。

### RL 到底學到了什麼

這是整講最後、也最開放的一段，兩派都有證據：

- **只是把本來就有的路徑變常見**：[這篇論文](https://arxiv.org/abs/2504.13837)用 pass@k 比較 RL 前後。$k=1$ 時 RL 後的模型好很多；$k$ 開到 256 時兩者差不多，RL 後甚至略低。意思是正確答案 base model 本來就抽得到，只是機率低。順著這個想法，[一個不訓練、只改 sampling 的方法](https://arxiv.org/abs/2510.14901)在 MATH500、HumanEval、GPQA 上接近甚至超過 GRPO 訓練的版本。
- **真的學到新東西**：[另一篇](https://arxiv.org/pdf/2506.14245)認為大 $k$ 下 base model 答對可能只是猜中。改用 CoT-Pass@k（推理過程也要對才算）後，RL 前後的差距重新拉開。老師的批評是：推理過程對不對，也是另一個語言模型判的。
- **兩者都有**：[The Debate on RLVR Reasoning Capability Boundary](https://arxiv.org/abs/2510.04028) 的結論是訓練初期主要是調整既有路徑的機率，訓練夠久才可能出現新能力。什麼樣的演算法與 reward 比較能激發新能力，仍在研究中。

## 這一講給工程師的判斷

- 想**不動模型**就提升正確率：先試 contrastive decoding 家族，DoLa 在 Hugging Face 裡有現成選項，成本最低。
- 想加**自我反思步驟**：先確認有沒有外部回饋可用（測試、執行結果、檢索），它比自我反思穩；再用同算力的 majority vote 當 baseline，比過了才值得留。
- 反思指令的**用詞**會改變模型的行為，換模型時要重測。

**今晚就能做的事**：拿你手上一個有標準答案的小任務（20 題就夠），比較兩種做法：各抽 4 個答案投票，以及抽 2 個答案、每個再插一句「再檢查一下」。兩者算力大致相當，記下哪一個正確率高。

## 想深入

- 這講的前身：2025 年[第七講「深度思考（Reasoning）」](https://youtu.be/bJFtcwLSNxI)，投影片在 workflow、ReVISE、RL 段都附了對應時間點。
- **延伸閱讀**：reasoning model 與 GRPO 的完整介紹看 [CME295 第 6 講](/posts/ai/2026-09-29-cme295-llm-reasoning)；多抽答案、投票與 test-time scaling 的取捨看 [BrowseConf 與 test-time scaling](/posts/ai/2026-09-19-browseconf-test-time-scaling)；RL 本身從頭學看 [Berkeley CS285 導讀](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)。

## 這一篇可以確認與不能確認的

可以確認：講義 65 頁的文字與主要圖表（benchmark 散點圖、RefineBench 曲線、CL／CS 表、verification 兩張圖、pass@k 圖都直接看了投影片影像）、影片的 zh-TW 字幕、影片與 2023／2025 相關錄影的標題與上傳者。

不能確認：字幕把 TruthX 聽成「True Facts」，本文以投影片為準。老師提到「有一篇測過模型批判能力不比生成強的論文」，他說忘了放進投影片，本文找不到對應的引用，所以沒有附連結。MTI 的 62%→72% 與 RefineBench 用的模型名稱取自老師口述，本文沒有另外回原論文核對數字。

系列導覽：上一篇 [HW5：微調而不遺忘](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting)｜下一篇 [HW6：Model Editing](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing)｜[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。對照官方課程頁與 YouTube，講次與嵌入影片一致、可公開嵌入，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。影片主題與文中說法相符，無需修改內文。

## 參考資料

- [台大李宏毅《機器學習 2026 Spring》課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [Self-Correction.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/Self-Correction.pdf)
- [影片：AI 能自我修正嗎？從 decoding、workflow 到 reasoning 的技術發展整理](https://youtu.be/m3i2mk5hs8U)
- [【生成式AI時代下的機器學習(2025)】第七講：Reasoning](https://youtu.be/bJFtcwLSNxI)
- [【生成式AI】ChatGPT 可以自我反省!（2023）](https://youtu.be/m7dUFlX-yQI)
- [The Internal State of an LLM Knows When It's Lying（arXiv 2304.13734）](https://arxiv.org/abs/2304.13734)
- [TruthX: Alleviating Hallucinations by Editing Large Language Models in Truthful Space（arXiv 2402.17811）](https://arxiv.org/abs/2402.17811)
- [Contrastive Decoding（arXiv 2210.15097）](https://arxiv.org/abs/2210.15097)
- [DoLa: Decoding by Contrasting Layers（arXiv 2309.03883）](https://arxiv.org/abs/2309.03883)
- [interpreting GPT: the logit lens（LessWrong）](https://www.lesswrong.com/posts/AcKRB8wDpdaN6v6ru/interpreting-gpt-the-logit-lens)
- [LayerCD（arXiv 2509.25177）](https://arxiv.org/abs/2509.25177)
- [Instruction Contrastive Decoding（arXiv 2311.00233）](https://arxiv.org/abs/2311.00233)、[arXiv 2403.18715](https://arxiv.org/abs/2403.18715)
- [Context-aware Decoding（arXiv 2305.14739）](https://arxiv.org/abs/2305.14739)
- [Visual Contrastive Decoding（arXiv 2311.16922）](https://arxiv.org/abs/2311.16922)
- [Audio-aware Decoding（arXiv 2506.07233）](https://arxiv.org/abs/2506.07233)
- [Less is More: Improving LLM Reasoning with Minimal Test-Time Intervention（arXiv 2510.13940）](https://arxiv.org/abs/2510.13940)
- [VISTA（arXiv 2502.03628）](https://arxiv.org/abs/2502.03628)、[Attention-space Contrastive Guidance（ACG，arXiv 2601.13707）](https://arxiv.org/abs/2601.13707)
- [Can LLMs Correct Themselves? A Benchmark of Self-Correction in LLMs（arXiv 2510.16062）](https://arxiv.org/pdf/2510.16062)
- [RefineBench（arXiv 2511.22173）](https://arxiv.org/pdf/2511.22173)
- [Confidence v.s. Critique: A Decomposition of Self-Correction Capability for LLMs（arXiv 2412.19513）](https://arxiv.org/pdf/2412.19513)
- [When To Solve, When To Verify（arXiv 2504.01005）](https://arxiv.org/abs/2504.01005)
- [When Do LLMs Admit Their Mistakes? Understanding The Role Of Model Belief In Retraction（arXiv 2505.16170）](https://arxiv.org/pdf/2505.16170)
- [ReVISE: Learning to Refine at Test-Time via Intrinsic Self-Verification（arXiv 2502.14565）](https://arxiv.org/pdf/2502.14565)
- [Training Language Models to Self-Correct via Reinforcement Learning（arXiv 2409.12917）](https://arxiv.org/abs/2409.12917)
- [MIT News：The cost of thinking](https://news.mit.edu/2025/cost-of-thinking-1119)
- [arXiv 2502.04667](https://arxiv.org/abs/2502.04667)、[arXiv 2502.08991](https://arxiv.org/abs/2502.08991)、[arXiv 2502.18273](https://arxiv.org/abs/2502.18273)
- [Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?（arXiv 2504.13837）](https://arxiv.org/abs/2504.13837)
- [Reasoning with Sampling: Your Base Model is Smarter Than You Think（arXiv 2510.14901）](https://arxiv.org/abs/2510.14901)
- [Reinforcement Learning with Verifiable Rewards Implicitly Incentivizes Correct Reasoning in Base LLMs（arXiv 2506.14245）](https://arxiv.org/pdf/2506.14245)
- [The Debate on RLVR Reasoning Capability Boundary（arXiv 2510.04028）](https://arxiv.org/abs/2510.04028)
