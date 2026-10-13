---
title: "從 PyTorch、Hugging Face 到 LoRA、量化與 vLLM 部署｜台大陳縕儂 深度學習之應用 助教課"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, pytorch, hugging-face, lora, moe, quantization, vllm]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 導讀"
  order: 16
tldr: "ADL Fall 2025 課程頁排了 7 堂助教課、10 支影片：Colab 與 PyTorch、ipdb 除錯 → NLP 專案的一生 → 四種 NLP 任務的資料格式 → LoRA 與 QLoRA → scaling law、LLaMA 架構與 MoE → 量化與評估 → 用 vLLM 部署。影片是助教在 2023 與 2024 年錄的，Fall 2025 沿用，影片裡說的作業一、作業三是當年的作業。課程頁上的 5 份講義連結都 404，同名檔在 Fall 2024 路徑可以打開，Deployment 只有影片。本文依影片口述逐堂整理助教實際示範的步驟與提醒，附可以手算的例子。"
description: "導讀台大陳縕儂 ADL Fall 2025（114-1）的 7 堂助教課，依 10 支助教影片的口述、5 份助教講義（f113 路徑同名檔）與 2 份 Colab 整理：Colab 的 GPU 設定與 PyTorch tensor 操作、用 ipdb 找出裝置不一致的錯誤、資料到 Demo 的專案流程與 train／validation／test 切分、Hugging Face Trainer 與 Gradio、BIO 標記與 run_ner／run_summarization／run_qa 三支腳本、LoRA 的參數量與 QLoRA 的 4-bit 量化、訓練 FLOPs 估算與 Chinchilla、RMSNorm／RoPE／KV cache、MoE 的 capacity factor 與負載平衡 loss、AWQ／GPTQ、MMLU／MT-Bench／Chatbot Arena，以及 vLLM 的離線推論、tensor parallel 與 OpenAI 相容 API。附手算例子、常見誤解與自我檢查。"
draft: false
glossary:
  - term: "QLoRA"
    definition: "把凍結的預訓練權重先量化成 4-bit 存放，再在上面訓練 LoRA 的低秩矩陣；目的是連預訓練權重本身占的記憶體也一起壓下來。"
    context: "LoRA 助教講義第 18 頁先指出 LoRA 的限制（預訓練權重仍占大量記憶體），接著第 21–27 頁講 QLoRA。"
  - term: "MoE"
    aliases: ["Mixture of Experts", "混合專家模型"]
    definition: "把 Transformer 的前饋層換成多個「專家」，由 router 替每個 token 只挑少數幾個專家計算；總參數很多，但每個 token 實際用到的參數少。"
    context: "LLM Basics & MoE 助教講義第 18–33 頁：dense vs MoE、共享專家、token dropping、負載平衡、expert choice 路由與 Mixture-of-Depths。"
  - term: "AWQ"
    aliases: ["Activation-aware Weight Quantization"]
    definition: "一種訓練後量化方法：挑選縮放係數時，以「量化後 activation 的誤差最小」為目標，而不是只看權重本身，所以需要一小批校正資料。"
    context: "Inference & Eval 助教講義第 12–15 頁，標為 Data Dependent；同講義也講 GPTQ。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **本文依據 ADL Fall 2025（114-1，2025/09/01–12/15）。** 這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)系列的助教課篇，也是最後一篇。講課篇只放助教課連結，助教課的內容集中在這裡講。

[ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)的課表每一週分成 Lecture 與 Recitation 兩欄。講課負責原理，助教課負責「怎麼真的跑起來」。[Course Logistics 投影片](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf)第 6 頁把助教課的範圍寫成七項：開發環境與工具（Colab、GPU、PyTorch）、DL 工作流程、Hugging Face 基礎、LLM 架構、LLM 評估、LLM 訓練、LLM 推論。

這篇回答一個問題：**講課講原理，助教課補了哪些動手能力？** 助教在第一支影片開頭自己交代了安排：第一週講 Colab、GPU 與 PyTorch，接著帶大家完整跑一遍深度學習專案，再用 Hugging Face 的 Datasets 與 Transformers 套件做幾種基本的 NLP 任務，後四堂講大型語言模型的架構、評估、訓練技巧與推論加速。

**本文依據**：課程頁 Recitation 欄、10 支助教影片（沒有字幕，本文用音訊轉成的逐字稿整理）、5 份助教講義 PDF（Fall 2024 路徑同名檔）與 2 份助教 Colab。指令、程式碼與數字以講義頁面和 Colab 為準。標成「本文自編」的例子與計算不是助教課的內容。

讀完要能做六件事：

1. 在 Colab 確認 PyTorch 看得到 GPU，並用 ipdb 找出「模型和資料不在同一個裝置上」這類錯誤。
2. 說出訓練集、驗證集、測試集各自能不能看、什麼時候用，並用 Hugging Face 的 `Trainer` 跑完一次句子分類。
3. 看到一個 NLP 需求，判斷它屬於四種任務的哪一種，並說出那一種任務的資料該長什麼樣子。
4. 算出 LoRA 把可訓練參數減少了多少，說明 QLoRA 多解決了什麼問題。
5. 用 capacity factor 與負載平衡 loss 的手算例子，解釋 MoE 的路由為什麼難訓練。
6. 手算一次 2-bit 量化的誤差，並說出用 vLLM 部署時最常踩到的三個設定。

## 先看全貌

| 週次 | 助教課 | 影片（時長） | 講義 | 同週講課 |
|---|---|---|---|---|
| 9/01 | Dev Infra & Tooling | [PyTorch](https://youtu.be/zuiACAhRUzA)（17:45）、[Debugging](https://youtu.be/RYkEoCkJWeA)（11:46） | 無，改用 [Colab](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT) | Sequence Modeling |
| 9/08 | NLP Lifecycle | [Step by Step](https://youtu.be/anK1_PK464k)（36:10） | [w2-ProjLife.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf)（46 頁）＋[Colab](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ) | Attention、Transformer、Tokenization、BERT；HW1 公布 |
| 9/15 | Underlying Logics of Projects | [Step by Step](https://youtu.be/255ZzsTTHoU)（24:00） | [w3-UnderlyLogic.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w3-UnderlyLogic.pdf)（43 頁） | Pretraining & Prompt Learning |
| 9/22 | LLM LoRA Training | [LoRA](https://youtu.be/eGQMzbhokg0)（18:15） | [w5-LoRA.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf)（30 頁） | Post-Training、LLM Adaptation；HW2 公布 |
| 10/13 | LLM Basics & MoE | [Basics](https://youtu.be/BBw-ki4_06o)（20:16）、[Architecture](https://youtu.be/TzhCZOILzlI)（11:15）、[MoE](https://youtu.be/AgZuF7lsu-8)（23:17） | [w4-LLMBasicsMOE.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w4-LLMBasicsMOE.pdf)（33 頁） | RAG；HW3 公布 |
| 10/27 | LLM Inference & Evaluation | [Infer & Eval](https://youtu.be/mulWMLla-AM)（17:00） | [w6-LLMInferenceEval.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w6-LLMInferenceEval.pdf)（37 頁） | NLG Decoding、NLG Evaluation |
| 11/03 | LLM Deployment | [Deployment](https://youtu.be/4JPJkLxW84w)（22:34） | 無 | Issues in Pre-Trained Models；期末專題公布 |

兩個順序上的細節：

- 講義檔名的週次（w2–w6）來自舊學期。Fall 2025 把 LoRA（w5）排在 9/22，比 LLM Basics & MoE（w4）的 10/13 還早。本文照 Fall 2025 課程頁的順序走。
- 9/29、10/06 是教師節與中秋節，10/20 是期中停課，這三週沒有助教課。11/10 以後的課表也沒有再排助教課。

## 讀之前要知道：影片與講義都是舊學期的

這是這條支線最重要的背景。10 支影片的 YouTube 說明欄都寫「Lectured by Yen-Ting Lin 林彥廷 @ NTU CSIE」，錄製日期則分成兩批：

- **2023 年秋季**：PyTorch 與 Debugging（2023/09/07）、NLP Lifecycle（2023/09/21）、Underlying Logic（2023/10/05）、LoRA（2023/11/16）、Inference & Evaluation（2023/11/30）
- **2024 年秋季**：LLM Basics、Architecture、MoE（2024/10/09），Deployment（2024/12/04）

講義也一樣。w2 封面寫「ADL 2023 Fall - Recitation 2」，w4 封面寫「Sep 30, 2024」，w5 與 w6 封面分別是 2023 年 11 月 16 日與 30 日。Fall 2025 課程頁沿用這些材料，沒有重錄。

這對讀者有三個實際影響，都可以在影片口述裡對到：

1. **影片裡的作業是當年的作業。** LoRA 那支一開場就說「作業三」是做 instruction tuning、訓練 7B 的模型，講義第 4 頁也寫「Homework 3 Instruction tuning」。那是 2023 年的 HW3，不是 Fall 2025 的 HW3（RAG）。NLP Lifecycle 那支用的是之前 ADL 的作業（意圖分類，講義第 27 頁連到 2021 年的 HW1），助教說那份作業用了兩三年，也不是 Fall 2025 的 HW1（中文抽取式問答）。
2. **影片裡的「這一週」「最後一次」是當年的順序。** Inference & Evaluation 那支開頭說這是最後一次實習課，那是 2023 年的排法；Fall 2025 後面還有一堂 Deployment。LoRA 那支說上一週講過 Transformer 的模型架構，在 Fall 2025 的順序裡，架構那堂反而排在三週之後。2024 年錄的 LLM Basics 則說這堂課去年上過類似的內容，沒變的部分請大家看去年的影片。
3. **示範的套件版本停在 2023–2024 年。** 照著跑要有改 API 的準備，後面各段會指出具體的地方。

## 1. Dev Infra & Tooling：Colab、tensor 與 ipdb（9/01）

這堂沒有投影片，教材是一份 30 格的 [Colab](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT)，標題是「Recitation on Development Infrastructure and PyTorch Tutorial」，目錄分四段：Google Colab 基礎、Colab 的 GPU 環境、PyTorch 入門、Python 除錯工具。兩支影片分別是 [PyTorch Tutorial 一步步上手深度學習](https://youtu.be/zuiACAhRUzA)與 [PyTorch Debugging 有BUG怎麼辦!?](https://youtu.be/RYkEoCkJWeA)，助教照著 Colab 由上往下執行。

### 先確認拿到 GPU

Colab 預設給的是 CPU。助教示範的第一步是在「執行階段」選單點「變更執行階段類型」，選 Python 3 與 T4 GPU，並說這次實習只要免費的 T4 就夠。接著依序做三件事：

1. **掛載 Google Drive**（非必要）。想把模型存到自己的雲端硬碟時才需要，執行後 Colab 會要求授權，之後列出 `/content/drive/MyDrive/` 就能看到自己的檔案。
2. **`!pip show torch`**。前面的驚嘆號代表這一行交給命令列執行，不是 Python。影片裡顯示的版本是 2.0.1，助教說大於第二版就符合大部分作業的需求。
3. **`torch.cuda.is_available()` 與 `!nvidia-smi`**。前者確認 PyTorch 看不看得到 GPU，後者列出驅動程式版本、CUDA 版本、GPU 型號與顯示卡記憶體（影片裡的 T4 約 15 GB）。

助教在第三步停留最久。機器上明明有 GPU，PyTorch 卻看不到，是很常見的狀況，原因多半是 CUDA 版本不合：例如安裝的 PyTorch 是用 CUDA 11.8 編出來的，機器上的 CUDA 卻是 12 版。在自己的電腦上訓練時，每次裝完環境都要先確認這一點，看不到就要重裝 PyTorch 或調整 CUDA 版本。

### PyTorch 是管理 tensor 並替你算梯度的套件

助教給 PyTorch 的定位很簡短：它管理向量與多維向量的運算，並在一連串矩陣運算之後替你算梯度（一階微分）。深度學習的訓練需要算微分，所以它是主要的工具。語法和 NumPy 很像。

示範的順序與 Colab 一致：

- **建立一維 tensor**：`torch.arange(10)` 產生 0 到 9；`torch.linspace(2.0, 3.0, steps=5)` 從 2 走到 3，等分成 5 個值；`torch.rand` 從 0 到 1 的均勻分布取樣，`torch.randn` 從常態分布取樣；`torch.ones`、`torch.zeros`；從 Python list 建立；`clone()` 複製。
- **要不要記錄運算**：PyTorch 會記下對 tensor 做過的運算，之後才算得出梯度。放進 `with torch.no_grad():` 的運算不會被記錄，也就不能拿來算梯度，好處是比較快、比較省記憶體。助教說這個寫法通常用在推論，因為推論不做梯度下降。建立 tensor 時也可以用 `dtype` 與 `requires_grad` 指定型別和是否需要梯度。
- **多維 tensor**：`torch.zeros(3, 4)`、`torch.full((3, 4), 7)`、`torch.rand(3, 4)`；想要一個和現有 tensor 同形狀的新 tensor 時用 `zeros_like`、`ones_like`、`full_like`。
- **和 NumPy 互轉**：pandas 等工具讀進來的資料常是 NumPy 陣列，要先用 `torch.tensor(ndarray)` 轉換。助教提醒 NumPy 陣列不能直接和 tensor 做運算，兩者底層不相容。
- **形狀操作**：`torch.cat` 接合、`view` 改形狀、`transpose` 與 `permute` 換軸、`unsqueeze` 與 `squeeze` 增減長度為 1 的維度。

**例子（助教在影片裡示範的）**。條件：`x` 是 3×4 的 tensor，共 12 個元素。`x.view(2, 6)` 把它改成 2×6。不確定第一個維度該填多少時可以寫 `x.view(-1, 6)`，PyTorch 會用 12 ÷ 6 自動填 2。如果寫成 `x.view(-1, 5)`，12 除以 5 有餘數，就會報錯。意義：`-1` 只是「請幫我算」，元素總數對不上時它幫不了忙。

`transpose` 和 `permute` 容易混淆，助教用一個 2×3×4 的三維 tensor 說明：`transpose(0, 1)` 指定哪兩個軸對調，結果是 3×2×4；`permute(1, 0, 2)` 要把新的軸順序完整寫出來，結果同樣是 3×2×4。兩者做的事相同，寫法不同。軸多的時候 `permute` 可以一次調動多個軸，可讀性比較好。

這一段的結尾，助教解釋為什麼要把這些基本操作跑一遍：現在遇到問題可以問 ChatGPT，但要先知道 PyTorch 有哪些功能，關鍵字才下得對，也才有辦法判斷它給的答案有沒有亂講。

### 用 ipdb 除錯：一個裝置不一致的例子

第二支影片先把錯誤分類，Colab 上也有同一張清單：語法錯誤直接把程式碼和錯誤訊息貼給 ChatGPT；執行期錯誤與 tensor 錯誤（形狀不對、放在不同裝置上）用 ipdb；GPU 相關的錯誤（例如記憶體不足）留到下一堂。ipdb 是 Python 內建除錯器 pdb 的改良版，Colab 沒有預先安裝，要先 `!pip install ipdb`。

助教說最常用的指令是三個：`c`（continue，一路執行到下一個斷點才停）、`n`（next，執行下一行）、`q`（quit，離開）。要印出變數用 `p`。Colab 另外列了 `l`（列出程式碼）與 `s`（進入函式）。

啟動方式 Colab 列了五種，助教最推薦第二種與第四種：

| 方式 | 寫法 | 助教的說明 |
|---|---|---|
| 1 | `python -m ipdb your_script.py` | 停在程式第一行等你下指令 |
| 2 | `python -m ipdb -c continue your_script.py` | 像平常一樣執行，遇到斷點或報錯才停下來 |
| 3 | `python -m ipdb your_script.py --your-arg value` | 腳本原本的參數照樣加在後面 |
| 4 | 在程式裡 `import ipdb`，想停的那一行寫 `ipdb.set_trace()` | 停在那一行，可以印出上面的變數 |
| 5 | `with ipdb.launch_ipdb_on_exception(): main()` | `main()` 出錯時才啟動 ipdb |

接著是一個完整的訓練範例。資料是假的：1000 筆、每筆 10 個特徵，標籤照「3 倍的特徵總和加 2，再加一點雜訊」產生。`DataLoader` 每次隨機取 32 筆。模型 `SimpleMLP` 是兩層線性層，損失函數是 mean squared error，optimizer 是 Adam，訓練 10 個 epoch。助教藉這段程式把訓練迴圈唸了一遍：模型吃進一個 batch 產生預測，和答案算 loss，把 optimizer 的狀態清空，對 loss 做反向傳播，再讓 optimizer 更新參數。你只需要定義 forward，backward 由 PyTorch 代勞。

這段程式跑得很快，loss 也有下降。但助教接著印出模型參數所在的裝置，發現它在 CPU 上，而這個環境明明有一張 T4。於是他把程式複製一份，加上 `model = model.to(device)`，其中 `device` 是 `cuda:0`（只有一張 GPU 時寫 `cuda` 即可，多張時冒號後面的數字指定第幾張）。

**例子（助教在影片裡示範的）**。條件：模型搬到 GPU 之後再執行訓練迴圈。結果：跳出 RuntimeError，訊息是 Expected all tensors to be on the same device，一個在 `cuda:0`，一個在 `cpu`。推理的過程如下：

1. 在出錯的那一行前面加 `ipdb.set_trace()`，重新執行，程式停在那裡。
2. 用 `p` 印出 `batch_X` 的形狀，形狀正常。
3. 印出 `batch_X` 的裝置，是 CPU。
4. 印出模型的裝置，是第 0 張 GPU。問題找到了：模型搬了，資料沒搬。
5. 按 `q` 離開（按 `c` 會繼續執行，然後再報一次同樣的錯）。
6. 把斷點拿掉，把 `batch_X` 也 `.to(device)`。助教補充標籤 `batch_y` 同樣要搬。

修正後訓練正常收斂。意義：`.to(device)` 要對模型、輸入、標籤三者都做，少一個就會得到這個錯誤訊息。

助教最後解釋為什麼推薦第二種啟動方式。還沒出錯之前，你不會知道該在哪裡印出什麼。用 `python -m ipdb -c continue` 執行，一出錯就會停在當下，可以直接檢查 tensor 的形狀與裝置，不用重跑。載入模型與參數常常要花三十秒到一分鐘，每次重跑都很耗時間。

**延伸練習（本文自編）**。同一份 Colab 的範例還藏著一個不會報錯的問題。條件：模型最後一層是 `nn.Linear(5, 1)`，輸出形狀是 `(32, 1)`；標籤 `y` 由 `X.sum(dim=1)` 算出，形狀是 `(32,)`。推理：`nn.MSELoss` 遇到形狀不同的兩個 tensor 會先做 broadcasting，`(32, 1)` 對 `(32,)` 會被展開成 `(32, 32)`，等於每一筆預測都和每一筆標籤相減。結果：程式照跑，PyTorch 只會給一則警告，loss 的數值卻不是你要的那個。檢查方式：在 `loss = criterion(outputs, batch_y)` 前面下斷點，`p outputs.shape`、`p batch_y.shape`，再把輸出改成 `outputs.squeeze(-1)`。意義：tensor 的形狀錯誤不一定會讓程式停下來，所以除錯時形狀和裝置都要看；助教的示範也是先印形狀、再印裝置。

沒寫過 PyTorch 的讀者，這堂應該排在讀[第 2 堂：神經網路與反向傳播](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop)之前或同時。

## 2. NLP 專案的一生：資料 → 模型 → Demo（9/08）

[w2-ProjLife.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf) 開頭寫這堂要學兩件事：從資料、模型開發到 Demo 的流程，以及常用工具與套件。整份講義用「資料 → 模型 → Demo」三格圖反覆定位。

助教在[影片](https://youtu.be/anK1_PK464k)開頭說明為什麼要講這個題目：大部分的人以後不會當研究者，會當工程師、做專案，而且多半會碰到文字的題目。在業界常常是資料沒有、模型沒有、框架也沒有，全部要自己從頭建。他對三格的輕重也有明確的看法：成敗在最前面的資料，重要性在最後面的 Demo。沒有 Demo 或 API，東西沒上線、沒人能用，在業界就等於沒做。做完 Demo 之後是一直重複這個流程：看到模型或 Demo 的問題，回頭改資料或改訓練。他也提到，課程的作業不需要做 Demo，期末專題可能需要，所以特別在這裡強調。

### 資料：收集、清洗、標注

**收集**。講義列的來源是網路爬蟲、客戶資料、自行生成與 GPT-4。助教說最常見的是爬蟲，很會寫爬蟲是很大的優勢。GPT-4 的用法是：先準備 10 到 100 筆涵蓋應用情境的好例子，請它換句話說，花幾十到幾百元臺幣就能生出幾千到幾萬筆資料，一個人負擔得起。講義第 9 頁附了兩篇資料擴增的論文，助教推薦第二篇（用於意圖偵測的 in-context 資料擴增），因為它處理的正是分類問題。

**清洗**。助教強調「乾淨」沒有固定的定義，要看最終的用途。同一批詐騙簡訊，如果你要做詐騙偵測，它們就是你要的資料；如果你要做使用者的情緒分析，它們就是該清掉的髒資料。

**標注**。自己或小團隊標，可以用開源的標注平臺 doccano（講義第 11 頁），助教說它連框選這類複雜的標注都能做，介面好看，也可以架在自己的機器上。規模到百萬筆等級時，他舉 Scale AI 為例，建議想往這個方向鑽研的人去看這家公司怎麼做。

### 模型：先把問題歸成四種任務

助教說模型這一段只要搞清楚一件事：輸入是什麼格式，輸出是什麼格式。做 NLP 的人看到問題，心裡會先把它歸到四種形狀之一（講義第 16–21 頁）：

| 任務 | 輸入 | 輸出 | 講義與影片的例子 |
|---|---|---|---|
| 分類整句 | 一整句話 | 一個類別 | 情感分析（正面、負面、中立）、垃圾郵件偵測、意圖偵測 |
| 分類句中每個單詞 | 一整句話 | 每個詞一個標籤，十個詞就有十個標籤 | 詞性、命名實體（人名、地名、時間，或醫療領域的藥名） |
| 生成文本內容 | 一段文字 | 一段文字 | 對話、翻譯、摘要、填空 |
| 從文本中提取答案 | 問題加上一段上下文 | 上下文裡的一段文字 | 上下文「法國的首都是巴黎」，問題「首都是什麼？」，答案「巴黎」 |

口述補了三個講義上沒有的細節：

- 分類單詞時，不想分類的詞也要給標籤，給它一個「不屬於任何類別」的標籤就好。
- 填空題可以把空格放在句首或句中。助教說這是 decoder 模型一統江湖之前，BERT、RoBERTa 那一類模型常用的方式。
- 第四種任務適合「不准模型用自己的知識，只能從我給的文章裡回答」的情境。只問「首都是什麼」沒有指明國家，模型無從回答；給了上下文，答案就限定在上下文裡。

### Demo：FastAPI 與 Gradio

助教以實驗室的繁體中文模型示範站 [twllm.com](http://twllm.com) 說明 Demo 的價值：只放模型或資料，很少人有 GPU 可以載入，有 GPU 的人也不一定會去跑；有一個點進去就能用的頁面，大家才會真的試。

做法是兩個套件。後端開 API 常用 FastAPI，因為它會自動產生一部分文件。前端用 Gradio，只要寫 Python，不必碰 JavaScript。助教也說了 Gradio 的缺點：它很慢，真的要做成產品得考慮別的方案，做 Demo 則夠用。

### 切資料：誰可以看、什麼時候用

這是講義第 31–38 頁，也是助教講得最仔細的一段。他用考試比喻：不希望模型模擬考答得很好，大考卻考了不同的科目。

| 資料集 | 模型訓練時 | 用途 | 數量 |
|---|---|---|---|
| 訓練集 | 可以看 | 學習 | 最多 |
| 驗證集 | 不可以看 | 訓練時驗證 | 約 10–30% |
| 測試集 | 絕對不可以看 | 訓練後驗證 | 約 10–30% |

驗證集的「不可以看」指的是不能拿來學習，但可以拿來推論：訓練到 10%、20% 的時候，把模型拉出來跑一次驗證集，因為有答案，就能對答案、算分數。測試集要等訓練整個結束才用，目的是估計模型在外部資料上的表現。助教舉了一組數字：驗證集得到八成、測試集只有六成，那上線後的表現會比較接近六成。測試集一旦被模型看過，整套流程的邏輯就不成立，只能重新去收更多資料，反而更費工。

助教還補了一段講義上沒有的話：訓練大型語言模型時，其實常常沒有照這個框架走。訓練資料多到每一筆只看一次，驗證集不夠多，而且一個問題可以有很多種合理的回答，驗證集卻只收了其中一種，沒辦法好好反映模型的表現。他說這是模型非常大的時候才需要考慮的事。

### 實作：用以前的作業一做意圖分類

實作用的是以前 ADL 作業一的資料（講義第 27 頁連到 GitHub 上 2021 年 ADL HW1 的 `data/intent`）。那份作業同時有分類整句與分類單詞兩個任務，這堂只做分類整句。資料是客服情境的句子，欄位是 `text` 與 `intent`，例如一句請對方代訂機票的英文句子要分到訂機票這一類，助教形容這有點像對 Siri 說話。講義第 43 頁另舉「播放田馥甄的歌」對應「音樂播放」。這種任務叫意圖偵測。

助教建議沒有敏感內容的資料集都上傳到 Hugging Face：它用 Git 管理版本，不必自己記檔案放在哪裡；有敏感內容也可以設成 private，同樣不收費。上傳之後網頁會顯示欄位、筆數、占用的空間，可以直接瀏覽每個切分。

配套的 [NLP Lifecycle Colab](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ)（68 格）改寫自 Hugging Face 的「Fine-tuning a model on a text classification task」範例。助教執行的順序與途中的提醒如下：

1. **確認執行階段有 GPU。** 在 Colab 不用處理 NVIDIA 驅動程式與 CUDA 的版本；在自己的機器上要自己安裝，助教說這仍然有點麻煩，建議用 conda 管理環境。
2. **`!pip install "transformers[torch]" datasets`。** Transformers 只是定義模型架構的套件，要告訴它底層用 PyTorch 執行。
3. **`notebook_login()` 與 `!apt install git-lfs`。** Colab 關掉後檔案就不見了，所以模型要推到 Hugging Face 上存放，這需要一組金鑰。模型檔很大，Git 要搭配 LFS 才處理得了。
4. **確認 Transformers 版本。** Colab 的說明寫至少 4.11.0，錄影當時已經出到 4.33。
5. **`model_checkpoint = "distilbert-base-uncased"`、`batch_size = 16`。** 選蒸餾過的小模型是為了讓示範跑得快。Batch size 是模型一次平行處理幾筆資料，取決於 GPU 的記憶體。助教的建議是把記憶體用滿：16 筆只用掉一半，就加到 32，像二分搜尋那樣試。
6. **`load_dataset("yentinglin/ntu_adl_recitation")`。** 在資料集頁面點「Use in dataset library」可以直接複製這一行。Colab 接著把 `intent` 欄改名成 `label` 並編碼成類別。印出資料集會看到三個切分和各自的欄位，訓練資料有 15,000 筆。
7. **隨機看幾筆資料。** 例如查詢帳戶餘額、兌換點數、凍結帳戶。助教說這一步很值得做：很多人以前寫這份作業時，其實不知道輸入和輸出長什麼樣子。
8. **載入 tokenizer：`AutoTokenizer.from_pretrained(model_checkpoint, use_fast=True)`。** 模型吃的是整數，每個整數對應一個 token。助教用中文的部首和輸入法比喻：有些字本身就是一個單位，有些字會被拆成好幾個。Tokenizer 一定要用模型自己的那一個，就像不能用日文輸入法去打中文介面。
9. **`dataset.map(preprocess_function, batched=True)`。** 把前處理一次套用到所有切分，資料多的時候可能要等一兩分鐘。
10. **`AutoModelForSequenceClassification` 加上 `Trainer`。** 設定是 learning rate 2e-5、5 個 epoch、每個 epoch 評估一次、以 accuracy 挑最佳模型，另外有 weight decay（助教解釋為 L2 的懲罰項）。
11. **`trainer.train()`、`trainer.evaluate()`、`trainer.push_to_hub()`。**
12. **最後一格的 Gradio Demo。**

有四個地方助教特別停下來說明。

**第一個 token 永遠是 101。** 把一句話丟進 tokenizer，會得到一串整數。把句子整個換掉再試一次，後面的數字都變了，第一個還是 101。助教解釋，大部分模型會在開頭自動加一個特別的起始 token，用來標示一段輸入從這裡開始。另一個輸出 `attention_mask` 要對 Transformer 架構比較熟才有感覺，現在只要知道文字可以變成一串整數就夠了。

**類別數寫在模型的架構裡。** 預訓練模型不知道你要拿它分幾類，載入時要告訴它類別數，它最後一層的輸出維度才會對。助教以 77 類為例：如果客戶之後說要改成 76 類或 78 類，就是要重新訓練模型，因為輸出層的參數整個變了。另外，載入模型時檔案會先下載到家目錄下的快取資料夾。助教提醒一直載入不同的模型可能出問題（這一段錄音轉錄不清楚，只聽得出他提到電腦登不進去；推測是指快取占滿磁碟）。

**為什麼不自己寫訓練迴圈。** `Trainer` 會幫你做 forward、backward、跑完指定的 epoch 數並存檔。助教說，除了練習與學習之外，現在沒有人會重寫一個 trainer：自己寫頂多跑在一張 GPU 上，要擴展到 8 張甚至更多，中間有太多工程問題。需要改動時只改其中某一段計算就好。他也提醒，作業如果規定要自己寫，還是得自己寫，而且直接把 `Trainer` 的程式碼搬出來通常行不通。

**看進度條判斷有沒有用到 GPU。** 開始訓練後進度條顯示總共 4690 步。助教說這是參數更新的次數，不是資料筆數，並示範怎麼讀每秒更新幾次、目前跑到第幾個 epoch。這個數字的用途是：如果預估時間突然變成 24 小時，多半是根本沒用到 GPU。很多程式沒用到 GPU 時不會報錯，只會默默改用 CPU 算。所以要對「這個專案每秒大概能處理多少筆」有概念，才不會傻等。

**例子（本文自編，數字取自影片）**。條件：訓練資料 15,000 筆，batch size 16，訓練 5 個 epoch。推理：一個 epoch 要 15,000 ÷ 16 = 937.5 步，最後不滿一個 batch 的資料也算一步，所以是 938 步；5 個 epoch 是 938 × 5 = 4,690 步。結果：和影片裡進度條顯示的 4690 相符。意義：進度條的分母可以自己先算出來。算出來的數字和畫面上差很多時，通常是 batch size 或資料筆數沒有照你以為的設定。

訓練完之後，助教示範的 `evaluate` 分數很低，他說是因為示範時提前中斷、訓練次數太少。`push_to_hub` 會把模型、tokenizer 與一份自動產生的說明文件推到 Hugging Face 上的 repository。模型頁面的「Use in Transformers」按鈕提供兩種載入方式：`pipeline` 適合推論，它把「文字轉 token、模型計算、輸出對回標籤」包成一條流水線；直接載入模型則適合繼續訓練或需要掌控細節的時候。助教建議寫作業時也把模型傳上去並自己寫說明，比放在系上工作站好管理。

Gradio 的 Demo 只有幾行：先用 `pipeline` 建立分類器，指定任務（這裡是文字分類）、模型名稱與裝置；`device` 傳 -1 是用 CPU，傳 0 是用第 0 張 GPU。再用 `gr.Interface` 指定處理輸入的函式、輸入元件（文字方塊）、輸出與範例。助教強烈建議在 Demo 裡放範例句子，因為很多人點進來腦袋是空的，看到什麼就點什麼。他也說明，正式提供服務時要把這段寫成獨立的 Python 腳本，網址才分享得出去；在 Colab 裡只是示範。

這份筆記本寫於舊版套件，現在照跑可能遇到幾個地方要改：

- `datasets` 的 `load_metric`，新版改用獨立的 `evaluate` 套件。
- `TrainingArguments` 的 `evaluation_strategy`，新版改名為 `eval_strategy`。
- `compute_metrics` 裡的 `predictions = predictions[:, 0]` 是原範例給迴歸任務（STS-B）用的寫法。分類任務要改成 `predictions = np.argmax(predictions, axis=1)`（記得 `import numpy as np`），否則拿去和標籤比的是第 0 類的 logit，算出來的 accuracy 沒有意義，以 accuracy 挑最佳模型也會挑錯。這一條是本文讀程式碼得出的判斷，助教沒有提。本文沒有執行整份筆記本，只用模擬資料驗算過這個計算方式：2000 筆、77 類、一個其實有九成準的模型，取 argmax 算出的 accuracy 是 0.925，照 `predictions[:, 0]` 算是 0。
- 最後的 Gradio 格只是樣板：`pipeline` 的 task 寫的是 `'ner'`，模型名稱寫著「你的模型」，`fn=...` 要自己補。照影片的說法，這裡的 task 應該是文字分類。另外那一行寫成 `pipeline(task='ner', '你的模型', device=0)`，關鍵字引數後面接了位置引數，Python 會直接判成語法錯誤（本文把這一行單獨拿去編譯，錯誤訊息是 positional argument follows keyword argument），要把模型名稱改成 `model='…'` 的寫法。

助教的總結是：模型架構不是重點。重點是先把資料流程建起來、模型訓練過一次、做出一個 Demo，然後快速迭代。模型能進步的空間不多，把資料做好、把成果呈現好，才會是整個流程裡最有效的投入。他說寫作業大概也是如此。

## 3. NLP 專案的底層邏輯：四種任務各怎麼準備資料（9/15）

[w3-UnderlyLogic.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w3-UnderlyLogic.pdf) 封面寫「應用深度學習 - 實作三」，目標是「如何準備四大任務的資料、訓練、預測」與「使用 Huggingface 生態系」。助教在[影片](https://youtu.be/255ZzsTTHoU)裡說，任何 NLP 專案最後都能拆回這四種任務，或是幾種任務接起來的流水線。分類整句上一堂做過了，這堂補另外三種，每一種都照「資料長什麼樣子、用哪支現成的腳本訓練、怎麼做 Demo」的順序講。三個步驟對應的工具是 Hugging Face 的 Datasets、Transformers 與 Spaces。

| 任務 | 講義頁 | 示範資料集 | 訓練腳本與模型 |
|---|---|---|---|
| 分類整句 | 回顧 | 上一堂的意圖分類 | 上一堂的 Colab |
| 分類句中每個單詞 | 第 10–31 頁 | CoNLL-2003 | `run_ner.py`，`bert-base-uncased` |
| 文本生成（摘要） | 第 33–36 頁 | CNN/DailyMail | `run_summarization.py`，`t5-small` |
| 抽取式問答 | 第 38–42 頁 | SQuAD | `run_qa.py`，`bert-base-uncased` |

### 分類單詞：BIO 標記

講義第 10 頁的例子是一句新聞，裡面標了四種實體：組織（WeWork）、人（Adam Neumann）、地點、金額。這個任務叫命名實體辨識（NER）。助教說分類單詞的用途不只找實體，也可以找主詞、動詞、受詞，或判斷哪個字後面該加哪一種標點。

他用自己的實習經驗說明這種任務為什麼實用：先用分類單詞把藥名和受體的名稱抽出來，再接一個分類整句的模型，判斷藥與藥、藥與受體之間的關係。把任務疊起來，就能做出很複雜的系統。

找資料的地方是 [Hugging Face Datasets](https://huggingface.co/datasets)，左邊的任務篩選選 Token Classification。助教選的是 CoNLL-2003，這個資料集定義了一種很經典的格式（講義第 17 頁）：

- `tokens`：把一句話斷成一個一個詞，例如 The、European、Commission、said。
- `ner_tags`：每個詞對應一個整數，同一句的前四個是 0、3、4、0。

整數的意義在講義第 18 頁：

| 編號 | 標籤 | 意思 |
|---|---|---|
| 0 | O | 不屬於任何實體 |
| 1、2 | B-PER、I-PER | 人名的開頭、人名的內部 |
| 3、4 | B-ORG、I-ORG | 組織的開頭、內部 |
| 5、6 | B-LOC、I-LOC | 地點的開頭、內部 |
| 7、8 | B-MISC、I-MISC | 其他類的開頭、內部 |

為什麼每種實體要分 B 與 I 兩個標籤？助教回到 Adam Neumann 的例子：這個人名有兩個詞。如果兩個詞都標「人」，就分不出這是一個人還是兩個人。所以第一個詞標 B-PER（beginning），第二個詞標 I-PER（inside）。如果第二個詞也標 B-PER，意思就變成兩個不同的人。下一個不屬於這個名字的詞標 O。這種標法叫 BIO tagging。編號的順序可以隨便排，重要的是 B 與 I 的區分，解碼時要靠它判斷哪些詞連在一起。

**例子（講義第 17–19 頁）**。條件：句子開頭是 The European Commission said，標籤是 0、3、4、0。推理：European 是 3，也就是 B-ORG；Commission 是 4，也就是 I-ORG，接在 B-ORG 後面，所以兩個詞合起來是一個組織；said 回到 0。同一句後面的 German 與 British 標 7（B-MISC），後面沒有 I，所以各自是單一個詞的實體。意義：讀標籤時要連著看，B 開始一個實體，後面連續的 I 都屬於它。

**例子（本文自編）**。條件：你的專案只在意三種實體：藥名、劑量、症狀。問題：分類器的輸出要有幾類？推理：助教給的規則是 n 種實體需要 2n + 1 個類別，每種實體各一個 B、一個 I，再加一個 O。結果：2 × 3 + 1 = 7 類。CoNLL-2003 有 4 種實體，所以是 9 類，和上表的 0 到 8 相符。意義：決定要標幾種實體，也就同時決定了模型輸出層的大小。

**怎麼訓練**。助教說這類任務通常用 encoder 類的模型（BERT，或更早的 RNN、LSTM），這堂的目的是給一個馬上能跑的 strong baseline；要追求最好的成績，還是得自己讀論文、看資料找線索。做法是到 Hugging Face Transformers 的 GitHub repository，進 `examples/pytorch/token-classification`（講義第 24 頁），裡面有一支可以直接執行的 `run_ner.py`。講義第 25 頁的指令是：

```bash
python run_ner.py \
  --model_name_or_path bert-base-uncased \
  --dataset_name conll2003 \
  --output_dir /tmp/test-ner \
  --do_train \
  --do_eval
```

資料集名稱可以在資料集頁面按一下複製，貼到 `--dataset_name`。訓練多久之類的細節，要看腳本提供哪些參數，執行 `python run_ner.py -h` 會全部列出來。助教很推薦把參數表整個讀過一次：每個參數都有意義，以後一定會遇到需要調它的時候，先知道有這個東西，到時候改參數就好，不用自己實作。他舉 gradient accumulation 為例，這個功能自己寫並不好寫，腳本裡卻只是一個 `gradient_accumulation_steps` 參數。

**怎麼做 Demo**。Transformers 的 `pipeline` 有一個任務就叫 `ner`。它會把文字編碼、送進模型，再把模型輸出的 BIO 標籤合併，直接告訴你哪幾個詞是哪種實體。模型名稱填上一堂教過的、推到 Hugging Face 上的那個 ID，再用 `gr.Interface` 包起來，最後 `demo.launch()`。

自己架站要處理網路與防火牆設定，所以助教介紹 Hugging Face Spaces（講義第 27–31 頁）：在個人選單點 New Space，取名字，SDK 選 Gradio，到 Files 頁建立新檔案，把剛才的腳本貼上去並 commit，它會自動建置並上線。可以公開也可以設成 private。需要 GPU 有付費方案，助教說一開始測試用免費的 CPU 就夠了。

### 文本生成：以摘要為例

摘要是把長文變短文。助教選的資料集是 CNN/DailyMail，欄位是 `article`（原文）與 `highlights`（摘要）（講義第 34 頁），助教口頭補充還有 `id`。

他在這裡給了一個省事的技巧：自己收資料訓練摘要模型時，欄位名稱完全照這個資料集取，原文叫 `article`、摘要叫 `highlights`，之後跑現成的腳本會少遇到很多問題。

講義第 36 頁的指令：

```bash
python examples/pytorch/summarization/run_summarization.py \
    --model_name_or_path t5-small \
    --do_train \
    --do_eval \
    --dataset_name cnn_dailymail \
    --dataset_config "3.0.0" \
    --source_prefix "summarize: " \
    --output_dir /tmp/tst-summarization \
    --per_device_train_batch_size=4 \
    --per_device_eval_batch_size=4 \
    --overwrite_output_dir \
    --predict_with_generate
```

助教解釋了兩個參數：

- `--source_prefix "summarize: "`：T5 預訓練時同時學了很多種任務，在輸入前面加上這個提示，比較容易喚起它學過的摘要能力。
- `--per_device_train_batch_size=4`：`per_device` 的 device 指一張 GPU。有 8 張 GPU 時，實際的 batch size 是 8 × 4 = 32。

這裡示範的是 encoder-decoder 架構。助教說，如果要用現在流行的 causal language model 來做，要換別的腳本，Hugging Face 上同樣找得到。

### 抽取式問答：答案要附起始位置

助教這樣介紹這個任務的動機：模型常常亂講，走到最極端，就是規定它只能從給定的文字裡把答案抽出來。經典的資料集是 Stanford 的 SQuAD，欄位是 `context`（上下文）、`question` 與 `answers`。

`answers` 裡除了答案文字 `text`，還有 `answer_start`。講義第 40 頁的例子是 `"text": ["Saint Bernadette Soubirous"], "answer_start": [515]`，意思是答案從上下文的第 515 個字元開始。結束位置不用給，因為用起始位置加上答案長度就算得出來。

為什麼不能只給答案文字？助教用自我介紹當例子：上下文是「大家好，我叫林彥廷。林彥廷是台大的博士生。」問題是「誰是台大的博士生？」同一個名字在上下文出現兩次，但真正回答這個問題的是第二次出現的那一個。只給文字，程式得自己去比對，而且可能比對到好幾處；給了起始位置，就沒有歧義。

講義第 42 頁的指令：

```bash
python run_qa.py \
  --model_name_or_path bert-base-uncased \
  --dataset_name squad \
  --do_train \
  --do_eval \
  --per_device_train_batch_size 12 \
  --learning_rate 3e-5 \
  --num_train_epochs 2 \
  --max_seq_length 384 \
  --doc_stride 128 \
  --output_dir /tmp/debug_squad/
```

助教特別說明最後兩個長度參數。`--max_seq_length 384` 是一次送進模型的長度上限，單位是 token。上下文超過這個長度時，腳本會用滑動視窗把它切成好幾段。相鄰兩段不是完全分開的，`--doc_stride 128` 設定兩段之間重疊的量；設成 0 就完全不重疊。

**例子（本文自編，簡化版）**。條件：上下文有 600 個 token，視窗長 384，相鄰視窗重疊 128。為了好算，先不計問題與特殊 token 占掉的位置。推理：每個視窗比前一個往後移 384 − 128 = 256 個 token。第一個視窗蓋住第 0 到 383 個，第二個從第 256 個開始，蓋到第 639 個，已經超過 600。結果：切成 2 段，第 256 到 383 個 token 同時出現在兩段裡。意義：答案如果剛好落在第 384 個 token 附近，不重疊的切法會把它切成兩半，任何一段都抽不出完整的答案；有重疊，至少有一段完整包住它。

這段對 Fall 2025 的讀者特別有用。[HW1 中文抽取式問答](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa)要做的 span selection，就是這一段的任務形狀。建議先看完這堂，再去讀 HW1 規格。

助教的結語是：四種任務各自去哪裡找資料格式、用哪支腳本訓練、怎麼接 `pipeline` 與 Spaces 做 Demo，都交代了，每一支腳本都是今晚 clone 下來就能跑的。再進階，就是把一個任務的輸出接到另一個任務的輸入，一步步組出業界真的需要的系統。

## 4. LLM LoRA Training：模型太大怎麼調（9/22）

[w5-LoRA.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf) 把 LLM 開發畫成「預訓練 → instruction tuning → learning from feedback」三段，LoRA／QLoRA 標在 instruction tuning 那一段。這堂是 2023 年的現場錄影，助教開場先問同學當年的作業三開始做了沒有。整堂的推進是一條「記憶體」主線。

### 先問跑不跑得動

助教說 instruction tuning 最大的問題是跑不跑得動。大部分人拿不到 A100 或 H100，用家用等級的顯示卡時，就得做量化，或調整 optimizer 與其他設定。

講義第 5–6 頁介紹 Hugging Face Space「[Can you run it? LLM version](https://huggingface.co/spaces/Vokturz/can-it-run-llm)」。輸入模型名稱、選一張 GPU，它會算出這個模型在 float32、float16／bfloat16、int8、int4 幾種格式下，做推論、完整訓練、LoRA 微調各需要多少記憶體、幾張卡。講義截圖的例子是 Mistral 7B 配 24 GB 的 A10。助教說這個工具省掉自己算的麻煩，買顯示卡之前也可以先查。

### 為什麼低秩就夠

講義第 7 頁的動機來自一篇研究語言模型 intrinsic dimensionality 的論文：大型語言模型內在的維度其實很低，這可以解釋為什麼用少量資料就能有效微調它。

助教在這裡加了一個講義上沒有的提醒。這裡說的 rank 是概念上的，不是真的拿模型裡某個 d×d 的權重矩陣做列運算或 SVD 算出來的那個 rank。它要傳達的想法是：既然微調時真正需要改動的方向很少，就可以只訓練一小組參數。

### LoRA 本體

助教先指出 LoRA 用在哪裡。Transformer 的每一層有 normalization、self-attention 與 feed-forward network，LoRA 通常只加在 self-attention。Self-attention 裡有四個投影矩陣：W_q、W_k、W_v 與輸出的 W_o，都是把向量投影到同樣維度的矩陣。

講義第 11 頁是一張動畫的截圖。同一個輸入走兩條路：左邊是原本的預訓練權重，完全不動；右邊是新加的兩個小矩陣，連乘兩次。兩邊的結果相加，就是輸出。訓練時只更新右邊。

原本的權重 W 是 d×d。LoRA 加的兩個矩陣是 A（d×r）與 B（r×d），r 遠小於 d。講義第 12 頁寫 r 通常在 1 到 32 之間。

**例子（助教在影片裡舉的，計算由本文補完）**。條件：d = 512，r = 4。推理：原本的矩陣有 512 × 512 = 262,144 個參數；LoRA 的兩個矩陣共有 512 × 4 × 2 = 4,096 個。結果：可訓練的參數是原來的 4,096 ÷ 262,144 ≈ 1.56%。意義：這是單一個矩陣的比例。實際的模型裡，LoRA 只加在少數幾個矩陣上，其他參數全部凍結，所以助教說程式常會印出可訓練參數只占原模型很小的比例，看到那一行就代表 LoRA 設定生效了。

講義第 13 頁列的好處有兩項：記憶體少（預訓練權重不用算梯度）、LoRA 權重可以插拔。助教對後者多說了一些：LoRA 的權重很小，載入與卸下都快，也可以同時掛好幾個。他說這在影像生成的社群用得最多，例如一個 LoRA 學某種畫風、另一個學另一種畫風，兩個一起掛上去就得到混合的風格。

### 加在哪些矩陣、rank 取多少

講義第 14 頁引 LoRA 論文的表 5，在可訓練參數量相同（18M）的條件下比較：

| 加 LoRA 的矩陣 | rank | WikiSQL | MultiNLI |
|---|---|---|---|
| 只加 W_q | 8 | 70.4 | 91.0 |
| 只加 W_v | 8 | 73.0 | 91.0 |
| W_q 與 W_k | 4 | 71.4 | 91.3 |
| W_q 與 W_v | 4 | 73.7 | 91.3 |
| 四個都加 | 2 | 73.7 | 91.7 |

參數量固定時，加的矩陣越多，每個矩陣能用的 rank 就越低。助教的結論是現在大家至少會加 W_q 與 W_v 兩個，rank 取 4。Rank 再往上（8、64），進步越來越有限。他不建議用 1 或 2，理由是 rank 太低時，在 GPU 上做的幾乎只是向量相乘，沒有發揮硬體做矩陣乘法的特性。

講義第 16 頁引 LoRA 論文的表 4，把 LoRA 和完整微調、BitFit、兩種 prefix 類方法（PreEmbed、PreLayer）與 adapter 放在 GPT-3 上比較。助教口頭舉的 PEFT 方法是 adapter、prefix tuning、prompt tuning 與只微調前幾層，其中後兩種不在這一頁的表上。助教的看法是：其他方法或許在某些情況有用，但 LoRA 比較簡單，效果也可以，所以用 LoRA 就好。

### LoRA 的限制與浮點數格式

講義第 18 頁指出 LoRA 的限制：預訓練權重本身仍然占大量記憶體。助教說，只用 LoRA 訓練還是常常遇到記憶體不足，問題不在右邊那兩個小矩陣，在左邊那個大矩陣。它不用算梯度，但計算時還是要載入。模型動輒 13B、34B、70B，連推論都有困難。

進 QLoRA 之前，助教先講浮點數格式（講義第 19 頁，圖取自 NVIDIA）：

| 格式 | 表示範圍的位元 | 表示精度的位元 |
|---|---|---|
| FP32 | 8 | 23 |
| FP16 | 5 | 10 |
| BFLOAT16 | 8 | 7 |

他的說明是：forward 需要精度，backward 需要範圍。FP16 的範圍只有 5 個位元，用它訓練時數值常常 overflow 或 underflow，loss 會出現突然飆高的尖峰。他舉 Meta 一個 1,750 億參數的模型為例，訓練時常遇到這種尖峰，問題就出在 FP16。BFLOAT16 的做法是保留和 FP32 一樣的 8 個範圍位元，犧牲精度來換，所以助教說它是現在業界訓練的標準格式。

講義第 20 頁再往下是兩種 FP8：E4M3（4 個指數位元、3 個尾數位元）與 E5M2。助教說範圍位元多的那種用在 backward，精度位元多的那種用在 forward，另外還要搭配縮放的技術。

### QLoRA

QLoRA 的做法是把左邊凍結的預訓練權重用 4-bit 存放，格式是論文自訂的 4-bit NormalFloat；右邊兩個 LoRA 矩陣維持正常精度（助教說是 bfloat16）。權重在記憶體裡是 4-bit，資料真的流進來要計算時，再把它還原成 16-bit，這一步叫 dequantize。

講義第 25 頁引論文的量化公式，以 FP32 轉 Int8 為例：先找出 tensor 裡絕對值最大的數，用 127 除以它得到一個縮放常數 c，把每個數乘上 c 再四捨五入。還原時除以 c。助教舉的例子是：絕對值最大的數是 2000（原本是 −2000），就把它壓到 127。

**例子（本文自編）**。條件：一組權重是 [0.5, −1.0, 2.0]，要量化成範圍 −127 到 127 的整數。推理：絕對值最大的是 2.0，c = 127 ÷ 2.0 = 63.5。乘上 c 得到 [31.75, −63.5, 127]，四捨五入成 [32, −64, 127]。還原時除以 63.5，得到約 [0.504, −1.008, 2.0]。結果：最大的那個數還原得分毫不差，其他的數有不到 0.01 的誤差。意義：如果這組權重裡混進一個 200，c 就變成 0.635，前三個數乘上去只剩 0.3、−0.6、1.3，四捨五入後是 0、−1、1，原本的差異幾乎全部消失。

這正是助教強調的 block-wise。量化不是對整個 tensor 找一個最大值，是切成一小塊一小塊各自找。這樣一個極端值只會影響它所在的那一小塊。

論文裡還有兩個設計，助教各說了幾句：

- **Double quantization**：縮放常數 c 本身是 32-bit 的，數量一多也占空間，所以把 c 再量化一次。還原時因此要做兩次。
- **Paged optimizer**：記憶體不夠時，把 optimizer 的狀態暫時換到 CPU 的記憶體。助教的建議是能不用就不用，因為非常慢。

效果上，講義第 27 頁引 QLoRA 論文的表 3，三種做法的分數很接近：六欄裡完整微調只在 T5-780M 與 T5-11B 兩欄領先約 1 分，其餘幾欄 LoRA 略高；LoRA 與 4-bit 加 double quantization 的 QLoRA 幾乎一樣。表格標題寫的也是 QLoRA 重現了 16-bit LoRA 與完整微調的結果。助教口頭的說法是完整微調當然最好，做不到的話直接用 QLoRA（逐字稿這裡聽成 LoRA，依上下文判讀為 QLoRA）。

**例子（本文自編）**。條件：一個 7B（70 億參數）的模型。推理：用 16-bit 存放，每個參數 2 bytes，光是權重就要 70 億 × 2 = 14 GB；用 4-bit 存放，每個參數 0.5 byte，是 3.5 GB。結果：差了四倍。意義：這只算了權重本身，訓練時還有 activation、梯度與 optimizer 的狀態，實際的需求要用前面那個工具查。但它說明了為什麼 LoRA 解決不了的記憶體問題，要靠量化凍結的權重來解決。

### 怎麼用：一份設定檔

講義最後三頁（第 28–30 頁）示範實際的做法，用的是開源工具 [Axolotl](https://github.com/OpenAccess-AI-Collective/axolotl)。助教說整個過程幾乎不用寫程式，把資料整理成指定的格式、裝好套件、寫一份設定檔就可以。第 30 頁是它的範例設定檔 `examples/llama-2/qlora.yml`，助教點出的幾行是：

```yaml
load_in_4bit: true
adapter: qlora
lora_r: 32
lora_alpha: 16
lora_dropout: 0.05
lora_target_modules:
```

`load_in_4bit` 打開 4-bit 載入；`lora_r` 是前面講的 rank；`lora_alpha` 是 LoRA 那條路加回去的強度；`lora_dropout` 是要不要做 dropout；`lora_target_modules` 指定要加在 Q、K、V 的哪幾個。`datasets` 那一段換成自己的資料，工具支援多種格式。啟動訓練的指令是：

```bash
accelerate launch -m axolotl.cli.train examples/llama-2/qlora.yml
```

助教補充，想掌握更多底層細節的人，還是可以用 Hugging Face 的函式庫自己寫訓練程式。

時間上，這堂和講課的 LLM Adaptation（7.5）同一週，也和 HW2 公布同週。Fall 2025 的 HW2 題目是「LLM Tuning and Prompt Tuning for Classical Chinese Translation」。規格文件沒有公開，但 Fall 2025 的助教在 HW2 說明影片裡說這次作業用 LoRA 與 QLoRA 微調模型，和這堂的主題相同。這堂的錄影是 2023 年的版本，影片裡提到的資料格式與訓練腳本都屬於當年的作業，細節不一定對得上當期。講課端的 LoRA 原理見[第 7 堂](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf)的後半。

## 5. LLM Basics、Transformer 架構與 MoE（10/13）

[w4-LLMBasicsMOE.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w4-LLMBasicsMOE.pdf) 對應三支 2024 年錄的影片，分成三塊。

### LLM Basics：規模怎麼算、怎麼花

[影片](https://youtu.be/BBw-ki4_06o)對應講義第 2–14 頁。助教先複習 LLM 開發的三個階段，講義第 3 頁替它們各加了一個詞：預訓練對應 scale，instruction tuning 對應 adaptation，learning from feedback 對應 alignment。他對第三階段的描述是：模型不斷生成，另一個評分的模型（reward model）不斷打分，訓練時提高好回答的機率、降低壞回答的機率，如此反覆。這堂只講第一階段的規模。

**Scaling law 在實務上的用途**。講義第 4 頁的圖取自 GPT-4 的技術報告。橫軸是訓練用掉的計算量，把 GPT-4 定為 1，往左每一格少 100 倍。縱軸是模型在一批它沒看過的程式碼上的表現，越低越好。圖上的灰點是計算量小了好幾個數量級的小模型。助教說這張圖的重點是：訓練那些灰點很便宜，如果能用它們的趨勢準確預測最貴的那個點，就可以先在小模型上換各種資料、參數與架構，看哪一組設定預測出來的結果最好，最後才用那組設定去訓練最大的模型。

講義第 5 頁把實驗室的 Taiwan-LLM 標在同一張圖上。助教說他們自己的體會是：把模型變大、資料變多，其他東西不要大改，表現就會好很多。前提是多收的資料要維持原本的水準，不能把不好的資料一起灌進來。

**Emergent abilities**。講義第 6 頁的定義是「小模型沒有、大模型才出現的能力」。助教的說法是量變產生質變，這裡的量指的是訓練的計算量：有些任務在計算量沒超過某個門檻之前完全做不好，一超過，表現就突然上升。他提到，當初做這個實驗的研究者看到結果太好，一開始以為是程式有 bug，反覆驗證之後才發表。

**計算量怎麼估**。講義第 8–9 頁：

> Training FLOPs ≈ 6 × Model Size × Number of Tokens

助教解釋係數 6 的來源：像 Llama、Mistral 這類 dense 模型，每個參數處理每個 token 時大約要做 6 次運算。講義直接代了兩組數字：

- Taiwan-LLM：6 × 70e9 × 500e9 ≈ 2e23
- GPT-4：約 2e25

也就是 700 億參數的模型看過 5,000 億個 token，計算量是 6 × 7×10¹⁰ × 5×10¹¹ = 2.1×10²³，比 GPT-4 小兩個數量級。助教說 GPT-4 的數字是外界的估計，而且估算時通常只看數量級，不太計較前面的係數。

**前沿模型的成本**。講義第 10 頁把計算量和金額排在一起：GPT-4 約 2e25、約 1 億美元（2023 年第一季）；下一代 2e26、約 10 億美元；再下一代 2e27、約 100 億美元。後兩列在講義上都打了問號。助教的推論是每年成長 10 倍：從純文字擴到影像、聲音、影片，資料量乘 10 並不難；晶片與演算法的進步是係數等級的，追不上指數等級的成長。這是 2024 年 9 月的估計。

**Chinchilla 的問題：預算固定時怎麼分**。講義第 12 頁的問題設定是：計算預算 C 固定，模型大小 N 與訓練 token 數 D 該怎麼分配，才能讓最後的預訓練 loss 最低？

助教先回答一個常見的疑問：資料不是收到多少就全部看一遍嗎？實務上不是。不同來源的資料重要性不同，書的價值比社群網站上隨手寫的貼文高，所以有些資料要看很多遍，有些看一遍都嫌多。訓練 LLM 時會依來源調配出一份 data mixture，各來源的比例與總量都是可以調的。

講義第 13 頁的圖取自 Llama 3 的論文。左圖每一條曲線代表一個固定的計算預算，橫軸是訓練 token 數。同一條線上，模型越大，能看的 token 越少，落在左邊；模型越小，能看的 token 越多，落在右邊。曲線呈 U 字形，最低點就是這個預算下最好的分配。把每條曲線的最低點連起來，得到右圖：計算預算與最佳 token 數的關係。助教提醒，右圖看起來只是一條回歸線，其實每個點都是左邊掃過一整排模型大小才找到的。

**預訓練 loss 能不能預測下游表現**。講義第 14 頁同樣取自 Llama 3 的論文。助教的說明是：先看這些小模型在某個 benchmark 上的 loss 與計算量的關係，相當線性，用它預測最大模型的結果也很準。再看 loss 能不能換算成答對率，結果也不錯。他同時提醒這不是每個 benchmark 都做得到，benchmark 要夠乾淨、沒有被訓練資料污染。但至少可以確認趨勢是往好的方向走，確保最後訓練出來的大模型會比上一代好。最大的模型只能訓練一次，開始之前就要有把握它會成功，否則訓練到一半才發現不如預期，浪費的成本非常大。

### Transformer Architecture：LLaMA 和原始 Transformer 差在哪裡

[影片](https://youtu.be/TzhCZOILzlI)對應講義第 15–16 頁。講義只有一頁清單：RMS Normalization、Rotary Positional Encoding、KV-Cache、Group Query Attention、SwiGLU，旁邊註明細節請見去年的實習課影片。這支 11 分鐘的影片把五項各講了一小段。助教說這些投影片很多是從別人的投影片擷取下來的，並推薦大家點講義上的連結去看原作者的講解；LoRA 講義第 10 頁那張「Transformer vs LLaMA」對照圖上標的出處是 Umar Jamil 的 pytorch-llama-notes。

助教先定了基調：從最早的 GPT 到現在的 LLaMA，架構的差異其實很小，都是一點一點的改進，而且這些改動大多沒有很強的理論，是實驗出來有效就留下來。

| 改動 | 原始 Transformer | LLaMA | 助教的說明 |
|---|---|---|---|
| Normalization | Layer norm，放在子層之後 | RMSNorm，移到子層之前 | 見下方 |
| 位置編碼 | 絕對位置，加在輸入 | Rotary（RoPE），作用在 query 與 key | 相對位置的概念，用旋轉來表示 |
| 推論加速 | 無 | KV cache | 寫程式時通常只是一個開關 |
| Attention | Multi-head | Grouped-query | 介於 multi-head 與 multi-query 之間 |
| 啟動函數 | ReLU | SwiGLU | 比 ReLU、GELU 更平滑，實驗上有效 |

**RMSNorm**。助教先用一個 10×3 的矩陣複習 normalization：10 筆資料、每筆 3 個特徵，可以沿著列算每筆資料的平均與標準差，也可以沿著行算每個特徵的。Normalization 的目的是讓層與層之間看到的分布不要差太多，梯度比較穩定。Layer norm 要做兩件事：減掉平均、除以標準差。RMSNorm 的作者認為真正有用的是調整數值的尺度，不是把中心移到 0，所以拿掉減平均那一步，少了一部分計算，效果一樣好。助教坦白說，要問為什麼，沒有很好的理論解釋，花大量計算資源去驗證兩種 normalization 在大模型上孰優孰劣也不太可行。

**RoPE**。絕對位置編碼替每個位置配一個固定的向量。相對位置編碼關心的是兩個 token 之間差幾個位置。RoPE 延伸相對位置的想法，把位置表示成旋轉的角度。助教說數學推導看起來很難，但概念就是這樣。它的好處是位置變成連續的量，所以訓練時只看過某個長度的模型，有機會延伸到更長的輸入。

**KV cache**。生成第 1、2、3、4 個 token 時，如果每次都重算整個 attention 矩陣，會有兩種浪費：矩陣的右上半部本來就不能用，因為前面的 token 不能看後面的；前幾列每次算出來都一樣。真正需要新算的只有最下面那一列。所以做法是把先前算好的 key 與 value 存起來，新的 token 進來時只算它自己的，再接到後面。這樣比較快。助教說講這一段是為了讓大家在 Hugging Face 的程式裡看到 KV cache 的開關時，知道它在做什麼。

**Grouped-query attention**。Multi-head attention 的每個 head 各有自己的 query、key、value。另一個極端是 multi-query attention：所有 head 共用同一組 key 與 value，省記憶體，但表現會明顯下降。Grouped-query 取中間：幾個 query 共用一組 key 與 value。

**SwiGLU**。助教只用幾句話帶過：ReLU、GELU 之外的另一條更平滑的曲線，實驗上有效。只換啟動函數，差異其實不大，但現在大家都用它。

最後他說 LLaMA 是目前開放權重模型的主流架構，後來的許多模型都完全沿用或只做小幅修改，原因是整個軟體生態都圍繞著它，換架構的支援度會差很多。

### MoE：把前饋層換成多個專家

[影片](https://youtu.be/AgZuF7lsu-8)對應講義第 17–33 頁，是這份講義篇幅最大的部分。

**為什麼參數總量和實際用到的量不一樣**。講義第 18 頁列了五個開放權重的 MoE 模型：

| 模型 | 機構 | 專家數 | 實際用到的參數／總參數 |
|---|---|---|---|
| Mixtral 8x7B | Mistral | 8 | 13B／56B |
| Grok-1 | X.AI | 8 | 86B／314B |
| DBRX | Databricks | 16 | 36B／132B |
| Arctic | Snowflake | 128 | 17B／480B |
| DeepSeekMoE | DeepSeek | 162（其中 2 個共享） | 21B／236B |

助教用 Mixtral 8x7B 解釋這個命名：可以想成一個 7B 的模型有 8 個分身，但每個 token 每次只經過其中 2 個。所以每個 token 實際碰到的參數（active parameters）遠少於總參數，這也是它被稱為 sparse（稀疏）架構的原因。他指出一個規律：大家拼命堆總參數，卻都把 active parameters 維持在 100B 以下，因為再大，生成的速度就不符合使用者的期待。

**MoE 加在哪裡**。講義第 19 頁對照 dense 與 MoE。Dense 的每一層是 attention 加一個 MLP（前饋層）。MoE 通常只改 MLP：把一個前饋網路複製成很多個（8 個、16 個、128 個都有人做），前面加一個 gate（也叫 router）決定這個 token 要送去哪幾個。如果每個都送，就和 dense 沒有差別。

**「專家」這個名字不要照字面理解**。助教在這裡給了一個很明確的個人看法：到 2024 年 9 月為止，他不認為這些專家真的各自專精某個領域。理由是從服務提供者的角度想，使用者同時湧進來時，你希望他們被打散到不同的專家，不要全部擠到同一個，否則那個專家很忙，能服務的人就變少。這和軟體工程的 load balancing 是同一個概念。既然訓練的目標是把 token 打散，就不會自然長出各有專長的專家。他說這一點見仁見智，歡迎找反例。

**共享專家**。講義第 20 頁引 DeepSeekMoE：除了由 router 分配的專家之外，另外設幾個每個 token 都會經過的共享專家。論文的說法是共享專家可以學共通的知識。助教轉述了這個直覺：假設共享專家負責算術，其他專家負責不同的語言，那麼任何語言的算術題都是共享專家搭配一個語言專家。但他自己的解讀不同：共享專家可以做得比較大，享有 dense 模型收斂快、風險小的好處；其他專家做得小，用來堆參數。他形容這是一種高低搭配。

**Attention 也做 MoE 嗎**。原理上可以，任何矩陣乘法都能拆成多個再相加。講義第 21 頁引的 JetMoE 就是兩邊都做。但助教認為不值得，講義第 22 頁用 Llama 3.1 405B 的參數形狀說明。

**例子（數字取自講義第 22 頁，計算是本文做的）**。條件：一層裡，MLP 有三個矩陣，形狀都是 16,384 × 53,248；attention 的 q 與 o 兩個矩陣是 16,384 × 16,384，k 與 v 兩個是 1,024 × 16,384。推理：MLP 的參數是 3 × 16,384 × 53,248 ≈ 26.2 億。Attention 是 2 × 16,384 × 16,384 + 2 × 1,024 × 16,384 ≈ 5.4 億 + 0.3 億 = 5.7 億。結果：attention 只占這一層的 5.7 ÷ (26.2 + 5.7) ≈ 18%。助教在影片裡口頭說的是大約三成（逐字稿聽成「三層」，不夠清楚）；照講義的形狀實際算是 18%，兩個數字不同，結論相同。意義：MoE 的目的是堆參數而不增加每個 token 的計算量，同時它會讓訓練變得不穩定。要冒這個風險，就該做在參數多、收益高的地方，也就是 MLP。講義那一頁的結論寫的是「Attn 做 MoE 好處不大」。

**Token 先決的路由**。講義第 24 頁。一個 token 的表示 x 進來，先乘上一個 gating 矩陣 W_g。助教舉的數字是：模型維度 1024、4 個專家，W_g 就是 1024×4，相乘得到 4 個分數。取分數最高的 k 個專家，把 token 送過去，再用分數當權重把各專家的輸出加起來。乘上分數這一步很重要，它讓 router 可以微分、可以跟著訓練。助教說目前開放權重的 MoE 模型都是這種做法，只在 loss 上有些變化。

這種做法的問題是會塞車。Token 自己決定去哪裡，熱門的專家可能同時有很多 token 想去，冷門的專家沒事做。每個專家一次能處理的量有上限，超過的 token 就不被處理，叫 token dropping。助教說，以前有人試過讓擠不進去的 token 改去第二、第三志願，當時的實驗沒有比較好，現在大家的做法是丟掉就丟掉。

上限由 capacity factor 決定，講義第 25 頁的公式是：

> expert_capacity = num_tokens ÷ num_experts × capacity_factor

**例子（講義第 25 頁，助教在影片裡講解）**。條件：一個 batch 有 6 個 token、3 個專家。推理：平均分配是每個專家 6 ÷ 3 = 2 個。Capacity factor 是 1.0 時，每個專家最多收 2 個，只要有一個專家被 3 個 token 選中，第三個就會被丟掉。Capacity factor 是 1.5 時，上限變成 2 × 1.5 = 3。結果：同樣的分配，1.0 時掉一個 token，1.5 時全部處理得完。意義：factor 不能小於 1，否則保證有 token 被丟；也不能無限調大，因為每個專家都要預留對應的記憶體。助教提醒，訓練 MoE 模型時常會遇到這個參數，不同框架的名稱不同，概念一樣。

**負載平衡 loss 與它的毛病**。為了讓 token 分散，訓練時會加一個負載平衡的 loss（講義第 26 頁，引 Switch Transformers）。它的計算方式是：對每個專家，把「實際分到的 token 比例 f」乘上「router 給它的平均機率 P」，再加總。設計的本意是分配越均勻，這個值越低。

**例子（講義第 27 頁）**。條件：3 個 token、2 個專家，每個 token 送去機率最高的那一個。

左邊的情況，三個 token 對兩個專家的機率都是 0.5、0.5。講義的設定是專家 1 拿到兩個 token（f₁ = 2/3），專家 2 拿到一個（f₂ = 1/3）。P₁ = P₂ = 0.5。Loss = 2/3 × 0.5 + 1/3 × 0.5 = 0.5。

右邊的情況，token 1 與 token 2 的機率是 0.51、0.49，token 3 是 0、1。分配和左邊一樣，f₁ = 2/3、f₂ = 1/3。P₁ = (0.51 + 0.51 + 0) ÷ 3 = 0.34，P₂ = (0.49 + 0.49 + 1) ÷ 3 = 0.66。Loss = 2/3 × 0.34 + 1/3 × 0.66 ≈ 0.447。

結果：右邊的機率分布明顯比較極端，loss 卻比完全均勻的左邊低。意義：這個 loss 有時會獎勵極端的路由分布。助教說平常問題不大，但大模型的訓練規模極大，一旦 loss 突然飆高，訓練就會變得不穩定，這是大家不喜歡負載平衡 loss 的原因。

**Token 先決的兩個問題與兩個改法**。講義第 28 頁整理成兩點，並各配一個解法：

| 問題 | 改法 |
|---|---|
| 負載不平衡、balancing loss 不穩定 | 專家先決（expert-choice routing） |
| 每個 token 用的計算量都一樣 | Mixture-of-Depths |

專家先決把方向反過來：每個專家固定挑幾個 token。這樣負載天生平衡，不需要額外的 loss。副作用是有的 token 被很多專家選中，有的沒被選中；可以解讀成困難的 token 得到比較多計算量。

助教說實驗上效果很顯著，但開放權重的模型都沒有採用。講義第 31 頁寫出原因：訓練與推論時 router 的輸入不同。專家挑 token 時看的是整條序列；語言模型生成第 5 個 token 時，卻只看得到前 4 個和自己，看不到後面。Token 先決沒有這個問題，因為每個 token 的分數只依賴它自己和它前面的內容。

Mixture-of-Depths（講義第 33 頁）的想法更單純：每一層加一個二元分類器，決定這個 token 在這一層要不要處理，不處理就直接跳過。它比以前的 early exit 更細，不是從某一層起全部跳掉，是一層一層個別決定。

助教解釋它為什麼也還沒被大規模採用，理由和部署有關。論文裡哪些層被跳過的那張圖，畫的是一條序列。服務提供者一個 batch 要同時處理很多使用者的請求，每個請求跳過的層都不一樣，批次處理時彼此還是得互相等。所以它在 batch size 是 1 的時候加速最明顯，放大到實際服務的 batch size 就不顯著了。他順帶提了一個可能的研究方向：讓同一個 batch 的請求都跳同一層。但那會讓同一個問題的回答隨著同批的其他請求而變，要處理的問題也不少。

## 6. LLM Inference & Evaluation：量化與三種評估（10/27）

[w6-LLMInferenceEval.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w6-LLMInferenceEval.pdf) 前半講推論加速，後半講評估。[影片](https://youtu.be/mulWMLla-AM)是 2023 年的現場錄影。

### 推論：先用對框架，再談量化

大綱頁（第 2 頁）列了五項：Quantization、AWQ、GPTQ、PagedAttention、FlashAttention。助教一開始就說後兩項細節太多，這堂不講，請大家自己找資料，主流的推論框架都已經實作了。所以實際展開的只有量化。

在講量化之前，他先給了一個實用的建議：有大量推論需求時，盡量用專門的推論框架，例如 vLLM 或 Hugging Face 的 TGI（Text Generation Inference）。他說這比直接用 Transformers 載入模型來跑快很多，不做量化就差很多了。vLLM 的用法見本文第 7 節。

量化的動機是：訓練通常用 bfloat16，也就是 16-bit，但這對消費等級的 GPU 還是太大，所以訓練完之後再壓到 8-bit、4-bit 甚至更低。助教區分了兩種時機。上一堂 QLoRA 是訓練時就量化；這堂講的是訓練後量化（post-training quantization），模型訓練完才壓縮。講義第 5 頁依硬體分兩條路：

- GPU：AWQ、GPTQ
- CPU：GGUF／GGML

想找某個模型有沒有量化好的版本，助教說可以到 Hugging Face 上找 TheBloke（講義第 4 頁），這個帳號上傳了大量模型的各種量化版本。

### 手算：量化到 2 bits

講義第 6–11 頁用一個小例子說明兩種做法的差別。

**例子（講義第 6–11 頁，還原的那一步是本文補的）**。條件：權重 W 是對角線為 9、4、1 的矩陣，輸入 x = (1, 2, 3)，原本的輸出是 (9, 8, 3)。2 bits 只能表示 0、1、2、3 四個值。

做法一，round to nearest：把每個權重換成四個值裡最接近的那個。9 變成 3，4 變成 3，1 還是 1。量化後的輸出是 (3, 6, 3)，和 (9, 8, 3) 差很多。助教指出這個做法只看 W，和輸入 x 完全無關。

做法二，先縮放再量化：先把 W 乘上一個係數 0.33，得到 2.97、1.32、0.33，再取最接近的值，變成 3、1、0。量化後的輸出是 (3, 2, 0)。這是縮放過的結果，要除以 0.33 還原才能和原本的輸出比較：約 (9.09, 6.06, 0)。

結果：做法一的誤差是 (6, 2, 0)，平方和 40。做法二還原後的誤差約是 (0.09, 1.94, 3)，平方和約 12.8。助教在影片裡只說先縮放的結果好一點點，沒有算誤差；上面的數字是本文補算的。意義：先縮放，讓原本的數值範圍對齊可以表示的範圍，以本文補算的數字來看誤差比較小。但最小的那個權重被壓成 0，資訊完全不見了。係數選多少會直接影響結果，這就是下一個方法要解決的問題。

助教補充了係數的直覺：它一定介於 0 與 1 之間，因為原本的範圍比較大，要乘上小於 1 的數才壓得進去。

### AWQ 與 GPTQ：都需要資料

**AWQ**（講義第 12–15 頁）是一套挑係數的演算法：選一個讓 activation error 最小的係數。Activation error 是「量化後的權重乘上輸入」與「原本的權重乘上輸入」的差。講義第 13 頁畫出係數從 0 到 1 時誤差的變化，助教說上面例子用的 0.33 離最低點已經不遠。

講義把 AWQ 標為 Data Dependent。因為目標函數裡有輸入 x，挑出來的係數會隨你餵給它的資料而不同。資料偏向某一類，量化後的模型就對那一類稍微好一點。

**GPTQ**（講義第 16–24 頁）的名字是 post-training quantization 接在 GPT 後面。做法是一層一層來：從最底下那一層開始，找一組量化後的權重，讓這一層的輸出和原本輸出的差（reconstruction loss）最小；做完一層再做上一層。它同樣要用資料，而且因為逐層進行，每一層的輸入來自前面已經量化過的層，所以助教說它比 AWQ 對資料更敏感。

他接著講了一個實際遇到的例子。很多人量化模型時直接照抄範例，範例用的校正資料通常是英文。有人這樣量化實驗室的繁體中文模型，結果不好，後來改用中文的文句來量化，就好很多。他的建議是：模型主要用在哪個領域，就拿那個領域的文字來做量化的校正資料，例如法律領域的模型就餵它法條。

兩種方法都有現成的工具（AutoAWQ、AutoGPTQ）。助教提醒，做量化的運算本身也需要 GPU。

### 評估：三類做法

助教說評估是很棘手的部分：好的 benchmark 一出來，模型很快就追上，所以得不斷推出新的。他認為最好的評估是先明確知道自己要怎麼用模型，再照那個用法收集資料來評，這樣最貼近實際的使用情境。

講義第 25 頁把評估分成三類：

| 類型 | 講義舉例 | 怎麼評 |
|---|---|---|
| 傳統 benchmark | MMLU、TruthfulQA | 選擇題，算 accuracy |
| 模型當評審 | MT-Bench、AlpacaEval | 請一個很強的模型打分或比較 |
| 人類評估 | Chatbot Arena | 真人盲測兩個模型，算 Elo 分數 |

**MMLU**。很多學科的選擇題，每題有題幹與 A、B、C、D 四個選項，涵蓋 STEM、社會科學、人文等領域，難度從小學到研究所都有。助教說這是他自己判斷一個模型好不好時最主要看的分數，因為大家都會報告它，想看模型的知識面時看這個。

**TruthfulQA**。題目專挑很多人也會答錯的問題，例如陰謀論。助教舉的例子是問 9/11 事件是誰造成的，早期的 GPT-3 給了一個沒有根據的陰謀論當答案。原因是模型學的是網路上的文字，網路上多數人講的不一定正確。講義第 29 頁的圖顯示一個反直覺的現象，助教請大家看最左邊的 GPT-3：從 350M 到 175B，模型越大分數越低。圖上的 GPT-2 也是遞減，GPT-Neo/J 與 UnifiedQA 則不是一路下降。助教說做專題時把題目一題一題讀過，認為題目挑得很仔細。

**MT-Bench**。Multi-turn 的 benchmark。每一題有兩個問題是出題者事先寫好的：第一輪的問題和第二輪的追問。助教指出它的限制：不管受測模型第一輪答了什麼，第二輪的追問都一樣。理想上追問應該和第一輪的回答有關，但為了能大量出題、做成標準化的測驗，只能這樣設計。講義上的數學題例子是：第一輪給一個函數，求 f(2)；第二輪求它的根。兩輪不會互相矛盾。

評分用一個很強的模型當評審（錄影當時是 GPT-4 或 Claude 2）。給評審的 prompt 有三個部分（講義第 32 頁）：judge instruction（你是公正的評審、要評什麼、打 1 到 10 分）、使用者原本的指令、受測模型的回覆。各個領域跑完可以畫成雷達圖，看模型哪個領域強、哪個領域弱。助教建議想自己做評估的人可以照這個做法：一個問題加一個追問。

**AlpacaEval**。和 MT-Bench 很像，差別在它是成對比較（講義第 34 頁）：同一個指令，把兩個模型的回覆一起給評審，問哪個比較好。其中一個固定是基準模型，助教說用的是一個 instruction following 能力比較弱的舊模型，所以最後報告的是每個受測模型對它的勝率。

**Chatbot Arena**。使用者輸入一段話，左右兩個匿名模型各自回答。使用者評完哪個比較好之後，才會知道兩個模型是誰。助教用電玩的積分和下棋來比喻：誰對誰的勝負累積起來，就能算出 Elo 分數。大家對人類評估還是比較有信心，所以這個排行榜很常被引用。他也提醒，Elo 的計分方式對新加入的模型比較不利。

講課端同一週講 NLG 的評估指標（BLEU、ROUGE、perplexity、LLM-Eval），見[第 9 堂：NLG 解碼與評估](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation)。兩邊合起來看，一邊是「句子生成得好不好」，一邊是「整個模型能力到哪裡」。

## 7. LLM Deployment：用 vLLM 把模型端上線（11/03）

這堂沒有講義，只有 [LLM Deployment 手把手教你如何部署大型語言模型](https://youtu.be/4JPJkLxW84w)這支 2024 年錄的影片，全程是螢幕操作。助教用 [vLLM](https://github.com/vllm-project/vllm) 示範部署實驗室以 Llama 3 為基礎的模型，分 8B 與 70B 兩個版本，機器是兩張各 80 GB 的 H100。

### 安裝與估記憶體

助教說 vLLM 算好裝：用比較新的 NVIDIA 顯示卡，用 conda 開一個新環境，CUDA 升到 12.1，直接安裝即可。CUDA 是 11.8 的話文件也有對應的裝法，但他建議直接升級比較省事。

第一步是先看手上有幾張卡、各有多少記憶體（助教沒有唸出指令；第 1 堂教的 `nvidia-smi` 就可以）。8B 的模型一張 80 GB 的卡綽綽有餘。準備兩張是為了示範 70B。

**例子（數字取自影片，計算是本文做的）**。條件：70B 的模型有 700 億個參數，用 bfloat16 載入時每個參數占 2 bytes。推理：光是權重就要 700 億 × 2 bytes = 140 GB。一張卡有 80 GB，兩張共 160 GB。結果：一張放不下，兩張才夠。照同樣的方式算，8B 是 16 GB，一張卡還剩很多。意義：部署前先用「參數量 × 每個參數的位元組數」估一次，就知道要幾張卡、要不要量化。

### 離線推論：三個會改的參數

助教說 vLLM 的程式碼很短，難的是看懂參數。建立模型時，他自己會去改的只有三個：

1. **`dtype`**。新的顯示卡支援 bfloat16，用預設值就好。比較舊的卡不支援時，要手動改成 float16。他說這是第一個常見的坑。
2. **`enforce_eager`**。vLLM 預設會建 CUDA graph 讓推論更有效率，但它要占額外的記憶體，所以實際用量會比你估的高一點。助教口述是：把這個參數傳成 false，記憶體用量會少一點，代價是速度慢一點。本文補充：這和 vLLM 的說明方向相反。vLLM 原始碼（[`config/model.py`](https://github.com/vllm-project/vllm/blob/main/vllm/config/model.py)，main 分支，2026-10-13 查）寫 `enforce_eager` 預設是 False；設成 True 才會停用 CUDA graph、一律用 eager 模式，設成 False 則是 CUDA graph 與 eager 混用以求效能。所以要省記憶體是設成 True。影片用的版本沒有唸出來，請再對一次你安裝的版本。
3. **量化**。助教的看法是：會想去調其他參數，通常代表記憶體不夠。與其調一堆細項來省一點空間，不如直接把模型量化，例如 FP8 或 AWQ，通常能省掉一半。

接著是 offline 與 online 的區別。Offline 指 prompt 事先都準備好了，不管是一筆還是一百萬筆。做研究、處理資料大多是這種情況。Online 指像 [twllm.com](http://twllm.com) 那樣，不知道使用者什麼時候進來、會輸入什麼。Offline 的整體吞吐量比較高，因為 online 的請求可能一下子全擠在一起，也可能很久沒有人來。

Offline 推論的步驟如下。其中 `LLM`、`SamplingParams`、`max_tokens` 是本文對應到 vLLM 的寫法；逐字稿裡聽到的是「LM 的 class」「sampling parameters」「max token」，沒有逐字唸出類別名稱。

1. 建立 `LLM` 物件，指定模型。模型可以在本機，也可以是 Hugging Face 上的名稱。常見的架構 vLLM 大多支援。
2. 設定 `SamplingParams`。助教說這裡有第二個坑：**`max_tokens` 的預設值非常小**，一定要自己調大，否則生成到一半就被截斷。助教口述是預設值他記得是 32 還是 128，自己也不確定。本文補充：vLLM 原始碼（[`sampling_params.py`](https://github.com/vllm-project/vllm/blob/main/vllm/sampling_params.py)，main 分支，2026-10-13 查）寫的預設值是 16，比他記得的還小。影片用的版本沒有唸出來，請再對一次你安裝的版本。另外可以調 temperature（越高越隨機）、top-p、top-k 與 min-p。
3. 準備 prompt。助教用的是對話形式，依序寫 system、user、assistant 幾輪，最後停在 user。
4. 執行。啟動時會印出參數與版本，然後載入模型。8B 的模型分成 4 個檔案，載入大約一分鐘。

助教在這裡強調**第一次一定要先離線跑一兩筆，親眼確認輸出合理**。Tokenizer、模型或浮點數格式只要有一個載錯，表現就會差很多，而這些錯誤不一定會報錯。

### 多張卡：tensor parallel

70B 一張卡放不下，要平行化到兩張卡上。助教說推論最常用的是 tensor parallel：把一個矩陣拆開，例如左半邊在第一張 GPU、右半邊在第二張。拆得最有意義的是前饋層的那幾個矩陣。拆開之後，兩張卡各算各的，再透過通訊把結果傳給對方合併。

另一種是 pipeline parallel。助教說它通常用在跨節點的情況：一臺機器的 8 張卡都塞滿了還不夠，要用到下一臺機器。除非要跑 405B 那種等級的模型，否則很少用到。

對使用者來說，要做的只有把 tensor parallel 的數量設成 GPU 的張數：一張卡是 1，兩張卡是 2。影片裡 70B 的下載與載入都很久，助教沒有等它跑完。

### 線上服務：OpenAI 相容的 API

線上服務比離線多一層：前面要有一個 web server 接收 HTTP 請求、回報目前有哪些模型在線上，後面才是 LLM 的推論引擎。vLLM 兩者都包了。

助教說現在幾乎所有人都採用 OpenAI 的格式：用戶端直接用 OpenAI 的套件，只把 API 的 base URL 從 OpenAI 的伺服器改成自己的位址，可以是 localhost，也可以是公開的網址。這就是所謂 OpenAI 相容的 API。

啟動方式是在命令列執行 `vllm serve`，後面接模型名稱。加 `--help` 可以看到所有參數，其中有 tensor parallel 的張數，也有 API 的 host 與 port。

示範時他開了兩個終端機，一邊是 server，一邊是 client。過程裡有兩個值得記下的地方：

- Server 還沒準備好時，client 的請求會連不上。要等 server 那邊顯示已經在某個 port 上執行。
- 第一次送出對話請求時得到 not found 的錯誤。Server 那邊只說找不到資源，client 那邊的錯誤訊息比較詳細：沒有這個模型。原因是範例指令裡的模型名稱沒有改。助教的做法是先查詢伺服器上有哪些模型，把正確的名稱貼進請求裡。

改對之後，回傳的 JSON 和呼叫 OpenAI 的 API 得到的格式相同，其他程式可以直接解析。接著他用 Python 的 OpenAI 套件再示範一次，同樣要改模型名稱。

### 線上服務要看的指標

助教說評估線上服務有兩端：latency 與 throughput。他用一組對比說明取捨：同時服務 1,000 個人、每人每秒拿到 1 個 token，還是只服務 10 個人、每人每秒拿到 50 個 token。可以透過限制同時上線的人數，決定要偏向哪一邊。

Server 執行時會持續印出幾個數字：處理輸入 prompt 的速度（每秒幾個 token）、生成的速度，以及 KV cache 的命中情形。助教說快取命中越多，推論越快，使用者夠多時可以用這個數字判斷服務的狀況。示範時只有他一個人在用，所以看不出來。KV cache 的原理見本文第 5 節的架構那一段。

最後他建議想深入的人直接讀 vLLM 的原始碼，因為文件有時更新得沒那麼快。這堂用的範例在 vLLM repository 的 examples 資料夾裡找得到，程式碼只有幾行。

這堂和作業沒有直接對應。它比較像期末專題與實際工作會用到的最後一哩。

## 助教課和作業怎麼對

課程頁沒有寫「哪堂助教課對應哪份作業」。助教表只寫分工：兩位助教負責 HW1／HW2，兩位負責 HW3，兩位負責期末專題。下表是依「同一週」排出來的時間對齊，不是官方對應：

| 作業 | 公布週 | 同週或之前的助教課 | 公開程度 |
|---|---|---|---|
| HW1 中文抽取式問答 | 9/08 | Dev Infra、NLP Lifecycle；下一週的 Underlying Logic 講抽取式問答的資料格式 | 規格完整公開 |
| HW2 LLM Tuning＋Prompt Tuning（文言文翻譯） | 9/22 | LLM LoRA Training | 只有說明影片 |
| HW3 Retriever & Reranker Training for RAG | 10/13 | LLM Basics & MoE | 只有說明影片 |
| 期末專題（Jailbreaking Olympics） | 11/03 | LLM Deployment | 只有說明影片 |

對照影片的口述，要留意三個地方：

- 影片裡的「作業一」是意圖分類與分類單詞，「作業三」是 instruction tuning。它們是 2023 年或更早的作業，和 Fall 2025 的 HW1、HW3 題目不同。
- 內容上真正對得上 Fall 2025 作業的有兩處：Underlying Logic 的抽取式問答段落對 HW1，LoRA 那堂對 HW2。
- HW3 公布那一週的助教課講的是 scaling law 與 MoE，和 RAG 沒有直接關係。HW3 需要的內容在[第 8 堂：RAG](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3)。

## 存取與缺口

整個系列的分級是 A2（依[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的定義：教材部分開放）。只看助教課這條線，影片與 Colab 完整，講義要繞路：

1. **課程頁的 5 份講義連結全部 404。** 課程頁連的是 `f114-adl/doc/w2-ProjLife.pdf` 等路徑，2026-09-30 打開都回傳 404，2026-10-13 再試仍然是 404。本文引用的是 Fall 2024 路徑（`f113-adl/doc/`）下的同名檔，5 份都能打開。
2. **Deployment 沒有講義**，只能看影片。
3. **Dev Infra 沒有講義**，只有 Colab。
4. **影片與講義都是 2023–2024 年的版本**，裡面提到的作業編號與內容屬於當年。
5. **10 支影片都沒有字幕。** 講義裡多數程式碼是截圖，文字層抽不出來，要看圖或搭配影片。
6. **LoRA 與 Inference & Evaluation 兩支是現場錄影**，助教會對著臺下提問，同學的回答沒有錄進去。

## 怎麼用這篇

- **完全沒寫過 PyTorch**：先跑 Dev Infra Colab，再讀[第 1 堂](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction)與[第 2 堂](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop)。
- **準備做 HW1**：讀完[第 5 堂](/posts/ai/2026-09-30-ntu-adl2025-bert-family) 後，依序看 NLP Lifecycle 與 Underlying Logic 兩堂，再進 [HW1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa)。
- **只想補 LLM 工程**：直接看後四堂，順序可以改成 Basics & MoE → LoRA → Inference & Eval → Deployment，也就是舊學期講義檔名 w4→w5→w6 的順序。LoRA 那支影片會說上一週講過架構，照這個順序看才接得上。

今晚可以做的一件事：打開 [NLP Lifecycle Colab](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ)，把 `evaluation_strategy` 改成 `eval_strategy`、把 `load_metric` 換成 `evaluate.load`，再把 `compute_metrics` 裡的 `predictions = predictions[:, 0]` 改成先取 argmax（`predictions = np.argmax(predictions, axis=1)`），跑到 `trainer.train()` 為止。開始訓練後先看進度條的總步數是不是 4690，再看每秒更新幾次。能跑完，代表你的環境已經準備好做 HW1。提醒：argmax 那一項不改，程式照樣跑得完，但每個 epoch 印出來的 accuracy 不能信。這三處修改本文查過套件原始碼（2026-10-13，main 分支）：transformers 的 `TrainingArguments` 現在只有 `eval_strategy`，沒有 `evaluation_strategy`；datasets 已不再匯出 `load_metric`（2.21.0 還有）；argmax 那一項用模擬資料驗算過。本文沒有把整份筆記本從頭跑完，新版套件可能還有別的地方要調。

## 常見的誤解

以下是本文的歸納，不是課堂上逐條列出的內容。

- **「機器有 GPU，PyTorch 就會用它。」** 不會自動用。要先確認 `torch.cuda.is_available()`，再把模型、輸入與標籤都 `.to(device)`。很多程式沒用到 GPU 時不報錯，只是變慢。
- **「驗證集不能看，所以訓練過程中不能碰它。」** 不能拿來學習，但可以拿來推論、對答案。它的用途就是在訓練途中檢查模型。絕對不能碰的是測試集。
- **「專案做不好是模型架構不夠好。」** 助教的看法相反：模型能進步的空間不多，成敗在資料，價值在 Demo。先把整個流程跑通再迭代。
- **「LoRA 讓模型變小了。」** 變少的是要訓練的參數。原本的權重還是整個載入，記憶體不夠的問題要靠 QLoRA 把凍結的權重量化成 4-bit 來解決。
- **「MoE 的每個專家各自專精一個領域。」** 訓練的目標是把 token 打散、讓負載平均，不是讓專家分工。助教認為目前看不到真正的專家，這是他的個人看法。
- **「MoE 模型的參數越多，推論越慢。」** 決定速度的是每個 token 實際經過的參數量。總參數可以到幾百 B，active parameters 都還維持在 100B 以下。
- **「量化只和權重有關，拿範例的校正資料就好。」** AWQ 與 GPTQ 都依賴輸入資料。校正資料的語言或領域和實際用途不合，量化後的模型會變差。
- **「模型越大，每一種 benchmark 的分數都越高。」** TruthfulQA 是反例：講義圖上的 GPT-3 系列，模型越大分數越低。助教的解釋是模型學的是網路上的文字，而網路上多數人講的不一定正確。
- **「vLLM 跑起來沒報錯就是對的。」** 助教說 `max_tokens` 的預設值很小，不調大輸出會被截斷；tokenizer 或浮點數格式載錯也不一定報錯。先離線跑一兩筆，看過輸出再說。

## 自我檢查

題目是本文自擬的，答案都能從上面的內容找到。

**1. `x` 是 3×4 的 tensor。`x.view(-1, 6)` 和 `x.view(-1, 5)` 各會得到什麼？**

前者得到 2×6，因為 12 ÷ 6 = 2。後者會報錯，因為 12 不能被 5 整除。

**2. 把模型 `.to("cuda:0")` 之後訓練，出現「Expected all tensors to be on the same device」。用 ipdb 怎麼找原因？要改哪裡？**

在出錯那一行前面加 `ipdb.set_trace()`，停下來後用 `p` 分別印出輸入 batch 與模型的裝置。會看到輸入在 CPU、模型在 GPU。把輸入和標籤也 `.to(device)`。

**3. 驗證集得到 80%、測試集得到 60%。上線後的表現比較接近哪一個？為什麼？**

比較接近 60%。驗證集在訓練過程中被反覆用來挑模型，測試集是訓練結束後才第一次使用的外部資料，比較能代表沒看過的情況。

**4. 訓練資料 8,000 筆，batch size 32，訓練 3 個 epoch。進度條的總步數應該是多少？**

一個 epoch 是 8,000 ÷ 32 = 250 步，3 個 epoch 是 750 步。

**5. 「把客服對話裡的訂單編號和日期標出來」屬於四種任務的哪一種？用 BIO 標記需要幾個類別？**

分類句中每個單詞。兩種實體，需要 2 × 2 + 1 = 5 個類別：B-訂單、I-訂單、B-日期、I-日期、O。

**6. SQuAD 的答案為什麼除了文字還要附 `answer_start`？**

同一段文字可能在上下文裡出現好幾次，只有其中一處是在回答這個問題。附上起始的字元位置才沒有歧義；結束位置可以用起始位置加上答案長度算出來。

**7. 權重矩陣是 1024×1024，LoRA 的 rank 取 8。可訓練參數是原本的幾分之幾？**

原本有 1,024 × 1,024 = 1,048,576 個。LoRA 有 1,024 × 8 × 2 = 16,384 個。比例是 16,384 ÷ 1,048,576 = 1/64，約 1.56%。

**8. 為什麼訓練時用 bfloat16 而不是 FP16？**

兩者都是 16-bit。FP16 表示範圍的位元只有 5 個，反向傳播時數值容易 overflow 或 underflow，loss 會出現尖峰。Bfloat16 保留和 FP32 相同的 8 個範圍位元，用較低的精度來換。

**9. 一個 batch 有 8 個 token、4 個專家，capacity factor 是 1.5。每個專家最多處理幾個 token？超過的會怎樣？**

8 ÷ 4 × 1.5 = 3 個。超過上限的 token 在這一層不會被任何專家處理，也就是 token dropping。

**10. 專家先決的路由可以解決負載不平衡，為什麼開放權重的模型都沒有採用？**

專家挑 token 時看的是整條序列。語言模型生成時只看得到目前位置之前的內容，所以訓練與推論時 router 的輸入不一樣。

**11. 權重是 6 與 2，輸入是 (1, 1)，只能用 0、1、2、3 表示。直接 round to nearest 和先乘 0.5 再量化，哪個誤差小？**

直接量化：6 變成 3，2 還是 2，輸出 (3, 2)，和原本的 (6, 2) 差 (3, 0)。先乘 0.5：得到 3 與 1，剛好都能表示，輸出 (3, 1)，除以 0.5 還原是 (6, 2)，沒有誤差。先縮放的做法誤差小。

**12. MT-Bench 和 AlpacaEval 都請模型當評審，差在哪裡？**

MT-Bench 一次只看一個模型的回覆，由評審打 1 到 10 分，而且是兩輪對話。AlpacaEval 把受測模型和一個固定的基準模型的回覆放在一起比，報告的是對基準模型的勝率。

**13. 手上有兩張 48 GB 的卡，要用 bfloat16 部署一個 34B 的模型。放得下嗎？vLLM 要設定什麼？**

權重要 340 億 × 2 bytes = 68 GB。一張 48 GB 放不下，兩張共 96 GB 放得下，但實際用量會比估的高（例如 CUDA graph 要占額外的記憶體）。把 tensor parallel 的數量設成 2。空間仍然吃緊時，助教的建議是直接量化。

**14. 用 vLLM 生成的回答每次都只有短短一句就斷掉，最可能的原因是什麼？**

`SamplingParams` 的 `max_tokens` 沒有調大。助教說它的預設值很小。

## 延伸閱讀

- [CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)：把本篇後四堂的主題（LoRA、量化、MoE、serving）講到系統層。個別單元見 [PEFT 與 LoRA](/posts/ai/2026-09-30-cmu11868-peft-lora)、[模型量化](/posts/ai/2026-09-30-cmu11868-model-quantization)、[Model Parallel 與 MoE](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)、[SGLang 與 vLLM](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm)。
- [Stanford CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)：從零實作語言模型，[Attention 變體與 MoE](/posts/ai/2026-08-22-cs336-attention-moe) 與[推論](/posts/ai/2026-08-22-cs336-inference)兩篇和第 5、7 堂重疊。
- [CS224N：Tinker 與 LoRA](/posts/ai/2026-08-22-cs224n-tinker-lora)：另一門課的 LoRA 實作。

---

上一篇：[第 14 堂：無標註學習與多模態](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal)
系列總覽：[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)

## 課程影片來源

以下影片已於 2026-10-10 對照官方課程頁與官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=zuiACAhRUzA
title: ADL TA Recitation: PyTorch Tutorial 一步步上手深度學習（YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=RYkEoCkJWeA
title: ADL TA Recitation: PyTorch Debugging 有BUG怎麼辦!?（YouTube）
```

原始影片：[ADL TA Recitation: PyTorch Tutorial 一步步上手深度學習（YouTube）](https://www.youtube.com/watch?v=zuiACAhRUzA)、[ADL TA Recitation: PyTorch Debugging 有BUG怎麼辦!?（YouTube）](https://www.youtube.com/watch?v=RYkEoCkJWeA)、[ADL TA Recitation: NLP Project Lifecycle NLP專案的一生（YouTube）](https://www.youtube.com/watch?v=anK1_PK464k)、[ADL TA Recitation: Underlying Logic of NLP Projects NLP專案的底層邏輯（YouTube）](https://www.youtube.com/watch?v=255ZzsTTHoU)、[ADL TA Recitation: LLM LoRA Training 大型語言模型太大怎麼調整呢?（YouTube）](https://www.youtube.com/watch?v=eGQMzbhokg0)、[ADL TA Recitation: LLM Basics 大型語言模型基礎概念（YouTube）](https://www.youtube.com/watch?v=BBw-ki4_06o)、[ADL TA Recitation: Transformer Architecture 各種 Dense 模型架構的小技巧（YouTube）](https://www.youtube.com/watch?v=TzhCZOILzlI)、[ADL TA Recitation: Mixture-of-Experts (MoE) Architecture 混合專家模型的架構（YouTube）](https://www.youtube.com/watch?v=AgZuF7lsu-8)、[ADL TA Recitation: LLM Inference & Evaluation 使用與評估語言模型（YouTube）](https://www.youtube.com/watch?v=mulWMLla-AM)、[ADL TA Recitation: LLM Deployment 手把手教你如何部署大型語言模型（YouTube）](https://www.youtube.com/watch?v=4JPJkLxW84w)

最後兩支（LLM Inference & Evaluation、LLM Deployment）是 2026-10-13 補列的，連結與本文「先看全貌」表格相同；這兩支這次沒有另外對照官方播放清單。

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-13。

內容核對：已依影片核對（2026-10-13）：十支助教課影片都沒有可用的字幕，本文把音訊用語音辨識轉成逐字稿後整理，逐字稿可能有聽錯的專有名詞與數字。指令、程式碼與數字以講義頁面為準。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方課程頁、播放清單的講次相符。
- 2026-10-10：嘗試依字幕核對兩支 PyTorch 助教影片，但取不到字幕，內容未核對；確認錄製日期與講者與文章一致。
- 2026-10-13：查證歷程移出正文；系列內互相引用由篇序改為堂次。
- 2026-10-13：依 HW2 說明影片更新 LoRA 助教課與作業的關係。
- 2026-10-13：依十支影片的口述重寫各堂內容，補上例子、常見誤解與附答案的自我檢查。
- 2026-10-13：依獨立審稿修正：分清講義表格與助教口述（LoRA 講義第 13、16、27 頁、TruthfulQA 的圖），拿掉沒有出處的 vLLM 版本號，補上 Colab `compute_metrics` 要先取 argmax 的提醒，影片來源補列兩支。
- 2026-10-13：查證來源外的四處並寫明依據：vLLM 的 `enforce_eager` 與 `max_tokens` 預設值（對原始碼）、Colab 的 `pipeline` 語法錯誤與 argmax（實際編譯與模擬驗算）、兩個 API 改名（對套件原始碼）。

## 參考資料

- [ADL Fall 2025（114-1）課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 課表 Recitation 欄、助教分工表
- [Course Logistics 投影片（250901_Course.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) — 第 6 頁助教課範圍
- [助教 Colab：Dev Infra & Tooling](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT)
- [助教 Colab：NLP Lifecycle（text classification fine-tuning）](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ)
- [w2-ProjLife.pdf：NLP 專案的一生（Fall 2024 路徑同名檔）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf)
- [w3-UnderlyLogic.pdf：NLP 專案的底層邏輯（Fall 2024 路徑同名檔）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w3-UnderlyLogic.pdf)
- [w4-LLMBasicsMOE.pdf：LLM Basics and MoE Architecture（Fall 2024 路徑同名檔）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w4-LLMBasicsMOE.pdf)
- [w5-LoRA.pdf：LLM LoRA Training（Fall 2024 路徑同名檔）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf)
- [w6-LLMInferenceEval.pdf：LLM Inference and Eval（Fall 2024 路徑同名檔）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w6-LLMInferenceEval.pdf)
- [ADL TA Recitation: PyTorch Tutorial 一步步上手深度學習（YouTube）](https://youtu.be/zuiACAhRUzA)
- [ADL TA Recitation: PyTorch Debugging 有BUG怎麼辦!?（YouTube）](https://youtu.be/RYkEoCkJWeA)
- [ADL TA Recitation: NLP Project Lifecycle NLP專案的一生（YouTube）](https://youtu.be/anK1_PK464k)
- [ADL TA Recitation: Underlying Logic of NLP Projects NLP專案的底層邏輯（YouTube）](https://youtu.be/255ZzsTTHoU)
- [ADL TA Recitation: LLM LoRA Training 大型語言模型太大怎麼調整呢?（YouTube）](https://youtu.be/eGQMzbhokg0)
- [ADL TA Recitation: LLM Basics 大型語言模型基礎概念（YouTube）](https://youtu.be/BBw-ki4_06o)
- [ADL TA Recitation: Transformer Architecture 各種 Dense 模型架構的小技巧（YouTube）](https://youtu.be/TzhCZOILzlI)
- [ADL TA Recitation: Mixture-of-Experts (MoE) Architecture 混合專家模型的架構（YouTube）](https://youtu.be/AgZuF7lsu-8)
- [ADL TA Recitation: LLM Inference & Evaluation 使用與評估語言模型（YouTube）](https://youtu.be/mulWMLla-AM)
- [ADL TA Recitation: LLM Deployment 手把手教你如何部署大型語言模型（YouTube）](https://youtu.be/4JPJkLxW84w)
- [vLLM（GitHub）](https://github.com/vllm-project/vllm)
- [Axolotl（GitHub）](https://github.com/OpenAccess-AI-Collective/axolotl) — LoRA 講義第 29–30 頁示範的微調工具
- [Can you run it? LLM version（Hugging Face Space）](https://huggingface.co/spaces/Vokturz/can-it-run-llm) — LoRA 講義第 6 頁
- [Hu et al. (2021). LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
- [Dettmers et al. (2023). QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314)
