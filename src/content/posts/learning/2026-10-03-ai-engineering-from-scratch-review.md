---
title: "AI Engineering from Scratch 導讀：從線性代數手刻到多 agent 的免費課程"
date: 2026-10-03
category: learning
type: deep-dive
tags: [ai-course, open-course, self-study, open-source, llm]
lang: zh-TW
tldr: "AI Engineering from Scratch 是 GitHub 上約 6.3 萬星、MIT 授權的免費課程：20 個 phase、523 堂，從線性代數、傳統 ML、深度學習，一路排到 LLM、agent 與 AI 安全，每堂先手刻再用框架對照。前段的數學與深度學習核心可以照著學，Phase 10 的 SFT／RLHF／DPO 先別信，其餘 phase 當主題地圖用。"
description: "介紹 rohitg00/ai-engineering-from-scratch 這套開源 AI 工程課：每堂課的結構、20 個 phase 各教什麼、適合誰與要花多久、一堂課（Phase 1 自動微分）從頭走到尾，以及學之前要知道的限制與搭配資源。"
draft: false
glossary:
  - term: "自動微分"
    aliases: ["autodiff", "automatic differentiation", "autograd"]
    definition: "程式記錄每一步運算，再用鏈鎖律從輸出往回算出所有參數的梯度。PyTorch、TensorFlow、JAX 訓練網路時用的就是這個機制。"
    context: "本文用 Phase 1 第 5 課當範例：課程用約百行 Python 手刻一個迷你版，再拿去訓練 XOR。"
  - term: "梯度檢查"
    aliases: ["gradient checking"]
    definition: "把自動微分算出的梯度，跟用數值方法（前後各差一小步再相除）估出的梯度比對，確認 backward 沒寫錯。"
    context: "本文範例課的 Build It 第 6 步。"
  - term: "對抗式覆核"
    aliases: ["adversarial verification"]
    definition: "覆核者先假設原本的指控是錯的，主動找反證；推翻不了才判定成立。"
    context: "本文用它說明審閱這套課時，最嚴重的錯誤指控是怎麼被複查的。"
---

> 🌏 [English version](/posts/learning/2026-10-03-ai-engineering-from-scratch-review-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

[AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch) 是 GitHub 上一套免費、MIT 授權的開源 AI 工程課程。作者 Rohit Ghumare 是 DevRel 出身，[個人網站](https://rohitghumare.com/)列有 Docker Captain、CNCF Ambassador、Google Developer Expert 等頭銜。整套課有 20 個 phase、523 堂，從線性代數排到多 agent 系統與 AI 安全，repo 約有 6.3 萬顆星（2026-10-03 查詢）。

它的做法是「先手刻、再用框架」：每個演算法先用 NumPy 或標準函式庫寫出小版本，再用 PyTorch 之類的框架做同一件事。讀完不只會呼叫 API，也看得懂框架底下在做什麼。

結論先講：**前段的數學與深度學習核心可以照著學，Phase 10 的訓練課先別信，其餘 phase 當主題地圖用。** 下面先介紹這套課的結構與內容，再挑一堂課從頭走到尾，最後交代學之前要知道的限制。

## 給誰、先備知識、要花多久

[README](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/README.md) 的先備條件只有兩條：會寫程式（任何語言，Python 比較有幫助），以及想弄懂 AI 實際怎麼運作，而不只是呼叫 API。

起點依背景而定。下表是 README 的「Where to start」，時數是作者自己的估計：

| 背景 | 起點 | README 估時 |
|---|---|---|
| 沒寫過程式也沒碰過 AI | Phase 0 環境設定 | 約 306 小時 |
| 會 Python、沒學過 ML | Phase 1 數學基礎 | 約 270 小時 |
| 懂 ML、剛學深度學習 | Phase 3 深度學習核心 | 約 200 小時 |
| 懂深度學習、想學 LLM 與 agent | Phase 10 從零做 LLM | 約 100 小時 |
| 資深工程師、只想學 agent | Phase 14 Agent 工程 | 約 60 小時 |

README 開頭寫整套約 342 小時，與上表各起點的估時對不太起來，當量級參考就好。如果只想學一個主題，README 也列了專攻路線：MCP 約 23 小時，Agent Skills 約 9.5 小時。

## 一堂課長什麼樣

每堂課是一個資料夾：講義 `docs/en.md`、程式 `code/`、產出物 `outputs/`，多數還有 `quiz.json`。講義依[課程範本](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/LESSON_TEMPLATE.md)走固定的幾段：

1. **Motto**：一句話點出這堂課的核心。
2. **The Problem**：不會這個會卡在哪裡。
3. **The Concept**：用圖與直覺建立概念，先不寫程式。
4. **Build It**：分步驟從零實作。
5. **Use It**：換成框架或函式庫做同一件事，跟自己手刻的版本對照。
6. **Ship It**：交出一份可重用的產出物，可能是 prompt、skill、agent 或 MCP server。

之後還有練習題、關鍵術語表與延伸閱讀。

## 內容地圖：20 個 phase 各教什麼

以下依 repo 的 [phases 目錄](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases)與 README 的課程列表整理，括號是堂數。

| Phase | 主題 | 主要教什麼 |
|---|---|---|
| 0 | Setup & Tooling（12） | 開發環境、Git、GPU 與雲端、API 金鑰、Jupyter、Docker、終端機、除錯與 profiling |
| 1 | Math Foundations（22） | 線性代數、微積分、鏈鎖律與自動微分、機率與 Bayes、最佳化、資訊理論、SVD、傅立葉、圖論 |
| 2 | ML Fundamentals（18） | 線性與邏輯回歸、決策樹、SVM、kNN、特徵工程、模型評估、集成學習、時間序列、異常偵測 |
| 3 | Deep Learning Core（13） | 感知器、反向傳播、activation 與 loss、optimizer、正則化、自建迷你框架、PyTorch、JAX |
| 4 | Computer Vision（28） | 卷積與 CNN、偵測與分割、GAN 與 diffusion、ViT、CLIP、OCR、3D（NeRF、Gaussian Splatting）、world model |
| 5 | NLP（29） | 文字處理、word embedding、seq2seq 與 attention、翻譯與摘要、檢索、結構化輸出、RAG chunking、評估 |
| 6 | Speech & Audio（17） | 頻譜與 mel 特徵、ASR 與 Whisper、說話者辨識、TTS、音樂生成、即時語音、neural codec、浮水印 |
| 7 | Transformers Deep Dive（16） | self-attention、multi-head、位置編碼、BERT 與 GPT、MoE、KV cache 與 FlashAttention、scaling laws |
| 8 | Generative AI（15） | VAE、GAN、DDPM、latent diffusion、ControlNet 與 LoRA、影片／音訊／3D 生成、flow matching |
| 9 | Reinforcement Learning（12） | MDP、動態規劃、Q-learning、DQN、policy gradient、actor-critic、PPO、reward modeling |
| 10 | LLMs from Scratch（24） | tokenizer、資料 pipeline、預訓練 mini-GPT、SFT、RLHF、DPO、量化、推論最佳化、DeepSeek-V3 導讀 |
| 11 | LLM Engineering（17） | prompt 與 few-shot、structured outputs、embeddings、context engineering、RAG、LoRA 微調、guardrails、LangGraph |
| 12 | Multimodal AI（25） | CLIP、BLIP-2、LLaVA、Qwen-VL、Chameleon、any-to-any 模型、VLA、ColPali、computer use |
| 13 | Tools & Protocols（31） | function calling、tool schema、MCP（server、client、transport、授權、安全）、A2A、Agent Skills |
| 14 | Agent Engineering（54） | agent loop、Reflexion、記憶、各家 agent 框架與 SDK、benchmark、可觀測性、agent workbench、產品判斷 |
| 15 | Autonomous Systems（22） | 長時程 agent、AlphaEvolve、自我改進、權限模式、durable execution、kill switch、安全框架 |
| 16 | Multi-Agent & Swarms（25） | 通訊協定、supervisor 與階層架構、辯論、handoff、blackboard、共識、MARL、失敗模式 |
| 17 | Infrastructure & Production（28） | vLLM 與 SGLang、GPU autoscaling、量化、快取與路由、gateway、canary、SRE、FinOps |
| 18 | Ethics, Safety & Alignment（30） | reward hacking、sycophancy、alignment faking、red teaming、jailbreak、公平、差分隱私、浮水印、各國法規 |
| 19 | Capstone Projects（85） | 17 個端到端專案，加 9 條 deep-build 軌（從 tokenizer 到 GPT、分散式訓練、RAG、eval、安全閘） |

Phase 19 的專案與軌道分法出自 [README 的 Phase 19 說明](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/README.md)。想看某個 phase 的完整課表，進該資料夾的 README 即可。

## 一堂課走讀：Phase 1 第 5 課「Chain Rule & Automatic Differentiation」

這堂課在 [`phases/01-math-foundations/05-chain-rule-and-autodiff`](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases/01-math-foundations/05-chain-rule-and-autodiff)。講義標示 Type 是 Build、語言是 Python、先修是上一課的導數與梯度、預估約 90 分鐘。學習目標有四個：

- 手刻一個會記錄運算、用 reverse-mode 算梯度的迷你 autograd 引擎。
- 用拓樸排序走過計算圖，完成 forward 與 backward。
- 只靠自己的引擎訓練一個多層感知器解 XOR。
- 用數值微分檢查自動微分有沒有算對。

**Motto** 只有一句：「The chain rule is the engine behind every neural network that learns.」

**The Problem** 先講為什麼需要它。神經網路是幾百個函數層層合成，訓練時要算 loss 對每個權重的梯度。手算不可能，數值微分又太慢。鏈鎖律給數學，自動微分給演算法，講義說它能讓你在約一次 forward 的時間內，算出任意函數合成的精確梯度。

**The Concept** 用 mermaid 圖畫出 `relu(x1*x2 + 1)` 的計算圖：數值往前流，梯度往後流。接著比較 forward mode 與 reverse mode：輸入少、輸出多用前者，神經網路有百萬個權重卻只有一個 loss，所以 backprop 用後者。講義還補了 dual number 的 forward mode，以及 PyTorch 的 `autograd` 在底層做了什麼。

**Build It** 分七步：

1. 寫 `Value` 類別，存數值、梯度、backward 函式與子節點。
2. 加上 `+`、`*`、`relu`，每個運算各帶一個知道怎麼算局部梯度的 closure。梯度用 `+=` 累加，因為同一個值可能被用在多個運算。
3. 寫 `backward()`：先拓樸排序，再把種子梯度設為 1.0，倒著走一遍。
4. 補上減、冪、除、`exp`、`log`、`tanh`。其中減與除是用既有運算組出來的，梯度自動正確。
5. 用 `Neuron`、`Layer`、`MLP` 搭出網路，在 XOR 上訓練（2-4-1 結構、學習率 0.05、100 步）。
6. 做梯度檢查，拿 `(f(x+h) - f(x-h)) / 2h` 對照自動微分的結果。
7. 手算 `relu(x1*x2 + 1)`，確認 `dy/dx1 = 3`、`dy/dx2 = 2`。

我在沒裝 PyTorch 的環境直接跑了 `code/autodiff.py`。XOR 的 loss 從第 0 步的 4.1491 降到第 99 步的 0.1783，四筆輸入的預測是 -0.853、+0.771、+0.801、-0.753，目標依序為 -1、+1、+1、-1，符號全對。五個梯度檢查的差距落在 1e-9 到 1e-10。

**Use It** 用 PyTorch 重做同一個算式：`x1`、`x2` 設 `requires_grad=True`，呼叫 `backward()`，講義註明梯度同樣是 3.0 與 2.0。這段我沒跑，因為環境沒有 PyTorch，`code/autodiff.py` 也設計成沒裝時自動跳過這一步。

**Ship It** 交出兩樣東西：能自己擴充的 `code/autodiff.py`，以及 [`outputs/skill-autodiff.md`](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/01-math-foundations/05-chain-rule-and-autodiff/outputs/skill-autodiff.md)。後者是一份 agent skill，列出除錯梯度的清單，例如忘了在每次 backward 前把梯度清零、in-place 運算弄斷計算圖、`.item()` 或 `.detach()` 把張量從圖上拿掉。講義最後說這個 `Value` 類別是 Phase 3 訓練迴圈的基礎。

最後還有四題練習（例如用 dual number 實作 forward mode，驗證結果和 reverse mode 一致），以及 5 題測驗。

## 學之前要知道的限制

我讓 AI agent 逐堂讀過講義、實際跑過程式，再對最嚴重的錯誤指控做對抗式覆核。審閱者與覆核者都是 AI，覆核只涵蓋最嚴重、能直接驗證的指控，次要的年份、作者與 benchmark 數字沒有逐一覆核，誤報率也不能外推。所以下面的結論只拿來比相對可用度，不是絕對分數。

- **Phase 10 的 SFT、RLHF、DPO 不是真的訓練。** [SFT 課](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/10-llms-from-scratch/06-instruction-tuning-sft/code/main.py#L157-L160)的權重更新是 `block.ffn.W1 -= lr * np.random.randn(*block.ffn.W1.shape) * 0.01`，也就是加隨機雜訊；[RLHF 課](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/10-llms-from-scratch/07-rlhf/code/main.py#L261-L266)與 [DPO 課](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/10-llms-from-scratch/08-dpo/code/main.py#L195-L201)是同一個模式，只是雜訊再乘上獎勵或偏好方向的係數。程式能跑完，講義卻把它寫成梯度更新，照著學的人會以為對權重加雜訊就是訓練。
- **前段扎實，後段變薄。** Phase 1 最紮實，[autodiff](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases/01-math-foundations/05-chain-rule-and-autodiff)、[統計](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases/01-math-foundations/15-statistics-for-ml)、[線性方程組](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases/01-math-foundations/17-linear-systems)都可以直接用。Phase 2–9 是前段手刻、後段多用 stub。Phase 10–12 的訓練類課多半不是真的，只適合當概念導覽。Phase 14 的 54 堂沒有一堂呼叫真的 LLM。Phase 15–18 比較像主題清單，Phase 19 的 capstone 多半沒有 import 前面 phase 的程式。
- **數字與事實要自己查。** [KV cache 課](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/07-transformers-deep-dive/12-kv-cache-flash-attention/docs/en.md?plain=1#L41)算 7B 模型時漏乘 32 個 head，每 token 寫 16 KB，實際是 512 KB。[音樂生成課](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/06-speech-and-audio/09-music-generation/docs/en.md?plain=1#L24)把 MusicGen 標成 MIT，但 [Hugging Face 模型卡](https://huggingface.co/facebook/musicgen-large)寫明程式碼是 MIT、權重是 CC-BY-NC 4.0。[AI 治理課](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/15-autonomous-systems/22-cais-caisi-societal-risk/docs/en.md?plain=1#L3)還寫「加州 SB-53 if signed」，[州長辦公室](https://www.gov.ca.gov/2025/09/29/governor-newsom-signs-sb-53-advancing-californias-world-leading-artificial-intelligence-industry)在 2025-09-29 就簽署了。安全相關的宣稱更不能照抄：[第 49 課](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/phases/19-capstone-projects/49-lm-eval-harness/code/main.py#L209-L223)把 `__builtins__` 換掉，就宣稱模型輸出碰不到檔案系統，覆核時卻能用 `().__class__.__base__.__subclasses__()` 一路找到 `os` 模組並列出根目錄。
- **Phase 13 的新版課程可以用。** 第 06–18、22–31 課依 [MCP 2026-07-28 規格](https://blog.modelcontextprotocol.io/posts/2026-07-28)重寫並附測試，例如 [Streamable HTTP](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases/13-tools-and-protocols/09-mcp-transports) 與[取消與流量控制](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases/13-tools-and-protocols/29-mcp-reliability-cancellation-and-flow-control)；第 01–05、19–21 課還是舊模板，先跳過。

## 怎麼用、搭配什麼

- **想補數學與深度學習基礎**：照上面的起點表從 Phase 1 或 Phase 3 開始。每課先自己寫完 Build It，再對講義的答案；對不上時，先查一遍再懷疑自己。
- **想有個家教帶著走**：在已裝 Node.js 與 coding agent 的環境執行 `npx skills add rohitg00/ai-engineering-from-scratch`，Claude Code 裡輸入 `/start-learning`，Codex 則從 `/skills` 選 `start-learning`，做法見 [README](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/README.md)。
- **想學 LLM 訓練**：Phase 10 的 SFT、RLHF、DPO 先跳過，改看 [Karpathy 的 Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html)。
- **想學 agent 框架**：搭配 [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction) 或 [Microsoft ai-agents-for-beginners](https://github.com/microsoft/ai-agents-for-beginners)，這兩套會真的呼叫 LLM。
- **想學 MCP**：讀 Phase 13 新版那幾課，並開著[官方規格](https://modelcontextprotocol.io/specification/2026-07-28)對照。
- **想對照大學課程的作業與考試回饋**：參考本站的[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)與 [Berkeley CS189 版本地圖](/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map)。

## 課程影片來源

已核對課程 GitHub repo 的 README（2026-10-10 即時查看）：課程以文字課程與程式碼為主，頁面沒有列出講課錄影連結（README 內出現的 video 都是課程主題，如影片生成、影片理解）。這項結論只限官方公開頁面。

官方來源：

- [rohitg00/ai-engineering-from-scratch](https://github.com/rohitg00/ai-engineering-from-scratch)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-10：補上影片狀態，核對課程 repo 未列講課錄影。
- 2026-10-03：改寫成課程介紹文。新增課程結構、各 phase 內容地圖、適合對象與時數、Phase 1 第 5 課走讀與搭配資源；審查發現縮成「學之前要知道的限制」，移除審查流程圖、宣稱與實際的落差表與長錯誤清單；星數更新為 6.3 萬。

## 參考資料

- [rohitg00/ai-engineering-from-scratch（本文對照版本 3be078b）](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b)
- [AI Engineering from Scratch README（版本 3be078b）](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/README.md)
- [AI Engineering from Scratch 課程範本 LESSON_TEMPLATE.md](https://github.com/rohitg00/ai-engineering-from-scratch/blob/3be078b/LESSON_TEMPLATE.md)
- [Phase 1 第 5 課：Chain Rule & Automatic Differentiation](https://github.com/rohitg00/ai-engineering-from-scratch/tree/3be078b/phases/01-math-foundations/05-chain-rule-and-autodiff)
- [AI Engineering from Scratch 官網](https://aiengineeringfromscratch.com/)
- [Rohit Ghumare 個人網站](https://rohitghumare.com/)
- [Model Context Protocol：The 2026-07-28 Specification](https://blog.modelcontextprotocol.io/posts/2026-07-28)
- [MCP 2026-07-28 規格](https://modelcontextprotocol.io/specification/2026-07-28)
- [facebook/musicgen-large 模型卡（Hugging Face）](https://huggingface.co/facebook/musicgen-large)
- [Governor Newsom signs SB 53（California Governor's Office, 2025-09-29）](https://www.gov.ca.gov/2025/09/29/governor-newsom-signs-sb-53-advancing-californias-world-leading-artificial-intelligence-industry)
- [Andrej Karpathy：Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html)
- [Hugging Face AI Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction)
- [microsoft/ai-agents-for-beginners](https://github.com/microsoft/ai-agents-for-beginners)
