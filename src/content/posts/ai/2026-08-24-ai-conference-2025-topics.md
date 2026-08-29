---
title: "2025 AI 頂會在收什麼題目：Agent 爆發與 Reasoning 革命"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, research-trends, "2025", topic-analysis, ai-agent, reasoning, world-model, rlhf, diffusion-model]
lang: zh-TW
tldr: "2025 年 AI 頂會的兩個最強訊號：reasoning 論文從 47 篇暴增到 216 篇（4.6 倍）、agent 相關關鍵詞合計超過 150 篇（4.3–11 倍成長）。Diffusion model 已從「爆發」進入「基礎設施」階段，RAG 以五會議全覆蓋的罕見擴散速度成為企業 AI 的主流架構，而 state space model 和 world model 正複製 2020–2021 年 Vision Transformer 的早期軌跡。純 prompt engineering 論文開始遭遇 reviewer fatigue。"
description: "從 80,000+ 篇 2017–2025 年 AI 頂會論文的主題分布數據出發，分析 2025 年九大會議（NeurIPS、ICML、ICLR、ACL、EMNLP、CVPR、AAAI、IJCAI、ICCV）在收什麼題目：哪些方向全面爆發、哪些開始冒頭、哪些已飽和，以及從 2026 年回頭看哪些方向的投資回報最高。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 25
glossary:
  - term: "test-time compute"
    definition: "在推理階段（而非訓練階段）投入額外計算資源來提升模型表現的策略。典型做法包括 chain-of-thought、搜尋樹、自我驗證等，讓模型「多想一會兒」再回答。"
    context: "2025 年 reasoning 論文爆發的核心概念，OpenAI o1 系列模型的技術基礎。"
  - term: "RLVR"
    definition: "Reinforcement Learning with Verifiable Rewards，用可驗證的獎勵訊號（如數學題的正確答案）來做強化學習微調，不需要人類標註偏好。"
    context: "2025 年 NeurIPS Runner-up 論文質疑 RLVR 是否真的教會模型新的推理能力。"
  - term: "world model"
    definition: "學習環境動態的內部表徵：給定當前狀態和動作，預測下一個狀態。讓 agent 能在腦中模擬未來，而不是盲目行動。"
    context: "2025 年以 4.0 倍成長率進入「預爆發」階段的新興方向。"
---

2025 年是 AI 頂會歷史上投稿量最大的一年：NeurIPS 收了 21,575 篇、CVPR 13,008 篇、ICML 12,107 篇、AAAI 12,957 篇，每一場都在刷新自己的紀錄。但投稿量只是表象——真正的故事在題目的分布裡。一篇對五大會議（ACL、CVPR、ICLR、ICML、NeurIPS）2017–2025 年共 80,814 篇主軌論文的大規模主題分析（Khanbayov & Kurban, 2026）揭示了一個清晰的模式：AI 研究的主題不是平滑演進的，而是經歷「主題相變」（topical phase transitions）——在邊緣待上幾年，然後在一到三年內跨會議同時爆發。

2025 年，我們正目睹至少兩場這樣的相變。

## 全面爆發：Reasoning 與 Test-Time Compute

如果要用一個詞總結 2025 年 AI 頂會的主旋律，那就是 **reasoning**。

2024 年底 OpenAI o1 的發佈在走廊裡引爆了討論；2025 年這股興趣直接反映在論文數字上：「reasoning」關鍵詞從 2024 年的 47 篇暴增到 216 篇，成長 4.6 倍，是所有追蹤方向中成長最快的單一關鍵詞。同時「chain-of-thought」和「scaling laws」分別成長 3.3–4.7 倍，三個高度相關的詞同時加速——這種「多個相關關鍵詞同步起飛」的模式，跟 2022–2023 年 LLM 爆發前的特徵一模一樣。

Jay Alammar 對 NeurIPS 2025 全部約 5,800 篇接受論文的視覺化分析佐證了這個觀察：reasoning 是該屆最大的突破主題之一，約 766 篇論文以 reasoning 為核心焦點，佔全部接受論文的 13%。

得獎論文直接映射了這個趨勢：

- **NeurIPS 2025 Runner-up**：「Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?」（Yang Yue 等，清華大學）——用 pass@k 大 k 值系統性探測 RLVR 訓練後 LLM 的推理能力邊界，發現 RLVR 改善的是取樣效率而非推理能力本身，base model 在 k 夠大時反而更強。這篇論文的結論是清醒的：「current RLVR methods have not fully realized the potential of RL to elicit genuinely novel reasoning abilities in LLMs」
- **ICML 2025 Outstanding Paper**：「Train for the Worst, Plan for the Best: Understanding Token Ordering in Masked Diffusions」（Jaeyeon Kim 等，Harvard/MIT）——展示 masked diffusion model 在推理時可以「先解最有信心的 token」，把 Sudoku 準確率從 7% 拉到 90%
- **ICML 2025 Outstanding Paper**：「Roll the dice & look before you leap: Going beyond the creative limits of next-token prediction」（Nagarajan 等，CMU）——實證論證 next-token prediction 本質上限制了創造力，多 token 方法和 input-side seed-conditioning 是出路

這些得獎論文的共同特徵：不是在展示「reasoning model 有多強」，而是在追問「reasoning 的邊界在哪裡、為什麼到不了更遠」。2025 年的 reasoning 研究已經從「demo 階段」進入「科學理解階段」。

## 全面爆發：Agentic AI 與多代理系統

Agent 是 2025 年的第二個爆發級訊號。四個部分重疊的關鍵詞同時符合「預爆發」特徵：「agent」4.3 倍、「agents」8.3 倍、「llm agents」11.0 倍、「multi-agent system」4.7 倍。合計超過 150 篇論文，分布在五個會議中的四個。

NeurIPS 2025 的 367 篇 agent 相關論文覆蓋了 15 個研究領域：agent benchmarking、tool use、reasoning、multi-agent collaboration、safety。一篇對這 367 篇的綜合分析指出，這屆的核心敘事是從「能力展示」轉向「批判性評估」——發現 agent 系統的根本性短板比展示新能力更重要。

幾個關鍵發現：

- **Multi-agent 協作系統性失敗**：由 capable 個體 LLM 組成的多代理系統在協調上系統性失敗——LLM 缺乏原生的社會智能（溝通協議、theory of mind、合作行為）。agent 之間的同意率高達 90%+，反而限制了它們挑戰錯誤解答的能力
- **Safety alignment 不遷移到 agentic 場景**：模型在靜態 QA 場景下的安全對齊，在有工具存取和環境互動的 autonomous agent 場景下無效
- **ICLR 2025 Outstanding Paper**：「Safety Alignment Should be Made More Than Just a Few Tokens Deep」（Xiangyu Qi 等，Princeton/Google）——發現安全對齊只改變了模型最前面幾個 token 的生成分佈（shallow alignment），這就是為什麼 fine-tuning attack、prefilling attack、decoding parameter attack 都能繞過

ACL 2025 的 4 篇 Best Paper 中，DeepSeek 團隊和北大楊耀東團隊的「Native Sparse Attention (NSA)」直接針對 agent 場景的長上下文效率問題。ICML 2025 的 CollabLLM（Microsoft）則是少數真正展示 LLM 主動協作（而非被動回應）的 Outstanding Paper——使用者滿意度提升 17.6%，任務完成時間縮短 10.4%。

## 穩定主流：Diffusion Model 成為基礎設施

Diffusion model 在 2025 年的位置很特殊：它不再是「爆發中的新方向」，而是已經穩定成為 AI 研究的基礎設施層。

NeurIPS 2025 Best Paper「Why Diffusion Models Don't Memorize」（Bonnaire 等，ENS Paris）是一篇純理論論文——研究 diffusion model 為什麼能泛化而不是記住訓練資料。這類「理解已成熟技術的原理」的論文拿 Best Paper，本身就是技術成熟的訊號。

Jay Alammar 的分析把 Diffusion 列為 NeurIPS 2025 與 LLM、RL 並列的三大主題之一，但注意到它的角色已經從「新架構」變成「跨領域基礎工具」——vision、audio、molecular design、3D generation 都在用 diffusion 作為底層生成引擎。

CVPR 2025 的趨勢也反映了這一點：Best Paper Honorable Mention 的「Navigation World Models」用 video diffusion 做導航場景的預測，是 diffusion 跨出「生成好看圖片」進入「理解世界動態」的案例。Flow matching（diffusion 的連續時間推廣）以 3.9 倍、118 篇的速度成長，正在成為 diffusion 的技術繼承者。

## 穩定主流：Multimodal 與 LLM 持續深化

LLM 在 2025 年不算「新趨勢」——它在 2023 年就已經是各會議的最大主題，2025 年只是繼續鞏固。NeurIPS 2025 約 28% 的論文以 multimodality 為主焦點，LLM 相關論文遍布幾乎每個 cluster。

但 LLM 研究的質在變：

- **架構層面**：NeurIPS 2025 Best Paper「Gated Attention for Large Language Models」（阿里巴巴 Qwen 團隊）提出在 attention 後加 sigmoid gate，改善非線性和稀疏性，消除 attention sink——這種「對核心架構的精細手術」取代了 2023 年那種「用更大的模型做更多事」的研究風格
- **理論理解**：NeurIPS 2025 Runner-up「Superposition Yields Robust Neural Scaling」（MIT）用 Anthropic 的 toy model 解釋 neural scaling law 的起源——scaling 不再是黑箱經驗法則
- **知識編輯**：ICLR 2025 Outstanding Paper「AlphaEdit」（中科大）用 null-space projection 做模型知識編輯，平均提升 36.7%——解決 LLM 幻覺問題的精確干預工具
- **微調理論**：ICLR 2025 Outstanding Paper「Learning Dynamics of LLM Finetuning」（UBC）提出理論框架解釋為什麼 DPO 訓練太久反而降低品質——fine-tuning 從手藝變成有理論指導的工程

ACL 2025 的 26 篇 Outstanding Papers 的主題分布也值得注意：多語言/低資源語言（6 篇）、LLM 能力邊界與評估（5 篇）、幻覺檢測（2 篇）、效率與推理加速（3 篇）。「Byte Latent Transformer: Patches Scale Better Than Tokens」（Meta）和 DeepSeek 的 NSA 代表了「讓 LLM 更高效」比「讓 LLM 更大」更受重視的趨勢轉向。

EMNLP 2025 在蘇州舉辦，Best Paper 是「Infini-gram mini: Exact n-gram Search at the Internet Scale with FM-Index」（Hao Xu 等，UW），Outstanding Papers 涵蓋 LLM 推理忠實度測量、個人化偏好學習、LLM 與語言學家的差距、LLM 價值觀與行為的落差——NLP 社群在 2025 年明顯轉向「診斷 LLM 的問題」而非「展示 LLM 的能力」。

## 新冒頭：World Model、RAG、State Space Model

這些方向在 2025 年處於「預爆發」階段——論文量已經可觀（40–118 篇），成長率 3.8–4.4 倍，跨 3–5 個會議出現，但還沒到主流量級。根據歷史模式（LLM、diffusion 的爆發軌跡），它們預計在 2026–2027 年達到爆發點。

| 方向 | 2023 篇數 | 2024 篇數 | 2025 篇數 | 成長率 | 會議覆蓋 |
|---|---|---|---|---|---|
| Multimodal LLMs | 0 | 12 | 67 | 5.6× | 3 |
| Reasoning | – | 47 | 216 | 4.6× | 3 |
| RAG | 1 | 22 | 97 | 4.4× | **5（全覆蓋）** |
| Agent / LLM agents | 1 | 12 | 51 | 4.3× | 4 |
| Video generation | 4 | 20 | 84 | 4.2× | 4 |
| World model | 4 | 10 | 40 | 4.0× | 3 |
| Flow matching | 1 | 30 | 118 | 3.9× | 4 |
| State space model | 3 | 11 | 42 | 3.8× | 4 |
| Mechanistic interp. | 13 | 27 | 100 | 3.7× | 3 |

（資料來源：Khanbayov & Kurban, 2026，基於 ACL/CVPR/ICLR/ICML/NeurIPS 五大會議 2017–2025 主軌論文）

幾個值得注意的細節：

- **RAG** 是唯一達到五會議全覆蓋的預爆發方向——這種跨會議滲透速度更像是已經在爆發年，而非預爆發。預計 2026 年會鞏固為 top-10 主題，並可能催生二階子領域（retrieval-augmented reasoning、compound retrieval）
- **World model** 坐落在 video generation（4.2 倍）和 model-based RL 兩個最快成長 cluster 的交叉點，繼承了雙方的動能。NeurIPS 2025 的 Richard Sutton 受邀演講直接呼籲「We need world models and planning」
- **State space model**（以 Mamba 為代表）以 3.8 倍成長到 42 篇，跨 4 個會議。論文開始出現在原本由 Transformer ablation 主導的 session 裡——替代動態已經可見，跟 2020–2021 年 Vision Transformer 取代 CNN 的早期軌跡相似
- **Mechanistic interpretability** 從 2024 的 27 篇成長到 100 篇（3.7 倍），反映了「理解模型在做什麼」這個需求的急迫性

## 已飽和或下降

**純 prompt engineering 論文**：2023 年 prompt engineering 是頂會的熱門詞，到 2025 年已經出現明顯的 reviewer fatigue。基本的 prompt 技巧（zero-shot、few-shot、prompt template 設計）被視為工程實踐而非研究貢獻。NeurIPS 2025 的 367 篇 agent 論文綜合分析直接建議研究者避免「claiming reasoning improvements without verifying latent capability activation」——暗示太多論文只是換了 prompt 就宣稱推理改進。

**靜態 benchmark 上的增量改進**：NeurIPS 2025 有 30+ 篇 benchmark 論文和多篇系統性評估批判，指出現有 benchmark 系統性高估模型能力（contamination、distribution shift、task simplification）。NeurIPS 2025 D&B Track Best Paper「Artificial Hivemind」本身就是一個案例：它創建了新的 Infinity-Chat 資料集來測量 LLM 的 mode collapse，因為現有 benchmark 完全無法捕捉這個問題。研究者對「在已有 benchmark 上刷分」這件事的態度正在根本性轉變。

**傳統 GAN 架構**：已經被 diffusion 和 flow matching 徹底取代，2025 年幾乎找不到以 GAN 架構創新為主題的得獎論文。

## 2025 vs 2024：有什麼變了

| 面向 | 2024 | 2025 |
|---|---|---|
| Reasoning | o1 發佈引起討論，但論文還少 | 全面爆發，766 篇 NeurIPS 論文涉及 reasoning |
| Agent | 早期探索，主要展示能力 | 轉向批判性評估，發現系統性短板 |
| Diffusion | 仍在快速擴張 | 穩定為基礎設施，研究轉向理論理解 |
| LLM 研究重心 | 更大、更多 | 更高效、更可理解、更精確 |
| Safety/Alignment | RLHF 深化 | 發現 shallow alignment 問題，認識到 agentic safety 是新問題 |
| 評估方法 | benchmark 刷分 | benchmark 批判，轉向 contamination-resistant 評估 |

## 得獎論文總覽

| 會議 | 獎項 | 論文 | 方向 |
|---|---|---|---|
| NeurIPS | Best Paper | Why Diffusion Models Don't Memorize | Diffusion 理論 |
| NeurIPS | Best Paper | 1000 Layer Networks for Self-Supervised RL | RL × Scaling |
| NeurIPS | Best Paper | Gated Attention for LLMs | LLM 架構 |
| NeurIPS | Best Paper (D&B) | Artificial Hivemind | LLM 評估 |
| NeurIPS | Runner-up | Does RL Really Incentivize Reasoning? | Reasoning 邊界 |
| NeurIPS | Runner-up | Superposition Yields Robust Neural Scaling | Scaling 理論 |
| NeurIPS | Runner-up | Optimal Mistake Bounds for Transductive Online Learning | 學習理論 |
| NeurIPS | Test of Time | Faster R-CNN（2015） | 物件偵測 |
| ICML | Outstanding | CollabLLM | LLM × 協作 |
| ICML | Outstanding | Train for the Worst, Plan for the Best | Masked Diffusion |
| ICML | Outstanding | Roll the dice & look before you leap | 創造力邊界 |
| ICML | Outstanding | Conformal Prediction as Bayesian Quadrature | 不確定性量化 |
| ICML | Outstanding | Score Matching with Missing Data | 生成模型理論 |
| ICML | Outstanding | The Value of Prediction in Identifying the Worst-Off | ML × 社會政策 |
| ICML | Position Paper | The AI Conference Peer Review Crisis | 審稿危機 |
| ICML | Position Paper | AI Safety should prioritize the Future of Work | AI Safety × 勞動 |
| ICML | Test of Time | TRPO（2015）、Normalizing Flows（2015） | RL / 生成模型 |
| ICLR | Outstanding | Safety Alignment: More Than a Few Tokens Deep | LLM Safety |
| ICLR | Outstanding | Learning Dynamics of LLM Finetuning | LLM 微調理論 |
| ICLR | Outstanding | AlphaEdit: Null-Space Model Editing | 知識編輯 |
| ICLR | Honorable | Data Shapley in One Training Run | 資料估值 |
| ICLR | Honorable | SAM 2 | 視覺分割 |
| ICLR | Honorable | Faster Cascades via Speculative Decoding | 推理效率 |
| ICLR | Test of Time | Adam（2014） | 最佳化 |
| ACL | Best Paper | Native Sparse Attention (NSA) | 注意力效率 |
| ACL | Best Paper | Language Models Resist Alignment | Alignment 理論 |
| ACL | Best Paper | Difference Awareness | 公平性 |
| ACL | 26 Outstanding | 多語言、幻覺、效率、評估 | NLP 全領域 |
| EMNLP | Best Paper | Infini-gram mini | n-gram 搜尋 |
| EMNLP | Outstanding | LingGym、MiCRo、CoT Faithfulness 等 | 語言學、偏好、推理 |
| CVPR | Best Paper | VGGT: Visual Geometry Grounded Transformer | 3D 視覺 |
| CVPR | Best Student | Neural Inverse Rendering from Propagating Light | 逆渲染 |
| CVPR | Honorable | MegaSaM、Navigation World Models、Molmo/PixMo | 3D、World Model、VLM |
| AAAI | Outstanding | Every Bit Helps（社會選擇）、Abductive Reflection（NeSy）、Revelations（POMDP） | 理論 |
| IJCAI | Distinguished | Combining MORL with Restraining Bolts（規範行為）、Robust Compression、Hyper-Heuristics | RL × 倫理 |

## 從 2026 年回頭看：展望

根據 2017–2025 年的相變模式和約兩年的典型前置時間，以下方向預計在 2026–2028 年成為主流：

1. **Reasoning 和 test-time compute** 是最強的訊號，預計 2026–2027 年跨會議達到 500+ 篇/年，成為跟 LLM 並列的頂級主題
2. **Agentic AI** 的多個子關鍵詞正在整合中（跟 diffusion model 當年從碎片關鍵詞到統一術語的過程一樣），整合完成後會出現更急劇的成長
3. **World model** 同時受 video generation 和 model-based RL 兩股力量推動，預計在 2025–2026 年進入爆發
4. **RAG** 已經在 2025 年達到五會議全覆蓋，嚴格來說已不是「預爆發」而是「正在爆發」，2026 年會催生二階子領域
5. **State space model** 如果在 multimodal 和 long-context 場景上表現出競爭力，可能在 2026–2027 年急速擴張

同時要注意的風險：NeurIPS 2025 的整體敘事是「這個領域正在從能力展示轉向科學嚴謹」——benchmark 有效性、能力泛化、safety alignment 都受到了前所未有的質疑。Richard Sutton 的受邀演講直言「AI 作為一個巨大產業，在某種程度上已經迷失了方向」。2025 年的得獎論文有一個共同特徵：它們追問的是「為什麼」和「邊界在哪」，而不是「能不能更好」。選擇研究方向時，「科學理解」和「批判性評估」這條路的投資回報，可能比「在新 benchmark 上刷 SOTA」高得多。

---

## 參考資料

- [Khanbayov & Kurban (2026). "Topical Phase Transitions in Artificial Intelligence Research: Large-Scale Evidence and an Early-Warning Signature for Emerging Topics." Zenodo.](https://doi.org/10.5281/zenodo.20635335) — 對照 reasoning、agentic、diffusion model、multimodal、world model、RAG、state space model 等 2024–2025 topic shift。
- [NeurIPS 2025 Best Paper Awards 官方公告](https://blog.neurips.cc/2025/11/26/announcing-the-neurips-2025-best-paper-awards/)
- [NeurIPS 2025 Fact Sheet（官方 PDF）](https://media.neurips.cc/Conferences/NeurIPS2025/press/NeurIPS2025-Fact_Sheet.pdf)
- [Jay Alammar — "Inside NeurIPS 2025: The Year's AI Research, Mapped"](https://newsletter.languagemodels.co/p/the-illustrated-neurips-2025-a-visual)
- [ICML 2025 Outstanding Papers（joltml.com 彙整）](https://joltml.com/icml-2025/awards/)
- [AIhub — Congratulations to the ICML 2025 award winners](https://aihub.org/2025/07/16/congratulations-to-the-icml2025-award-winners/)
- [ICLR 2025 Outstanding Paper Awards（官方 PDF）](https://media.iclr.cc/Conferences/ICLR2025/ICLR2025_Outstanding_Paper_Awards.pdf)
- [ICLR 2025 Fact Sheet（官方 PDF）](https://media.iclr.cc/Conferences/ICLR2025/ICLR2025_Fact_Sheet.pdf)
- [ICLR 2025 Blog — Announcing the Outstanding Paper Awards at ICLR 2025](https://blog.iclr.cc/2025/04/22/announcing-the-outstanding-paper-awards-at-iclr-2025/)
- [ACL 2025 Awards 官方頁面](https://2025.aclweb.org/program/awards/)
- [36kr — DeepSeek NSA 論文獲 ACL 2025 Best Paper](https://eu.36kr.com/en/p/3401632759482502)
- [EMNLP 2025 Awards 官方頁面](https://2025.emnlp.org/program/awards/)
- [CVPR 2025 Best Papers and Best Demos 官方頁面](https://cvpr.thecvf.com/Conferences/2025/BestPapersDemos)
- [CVPR 2025 Awards Press Release](https://cvpr.thecvf.com/Conferences/2025/News/Awards_Press)
- [AAAI-25 Paper Awards 官方頁面](https://aaai.org/about-aaai/aaai-awards/aaai-25-paper-awards/)
- [AIhub — Congratulations to the IJCAI 2025 distinguished paper award winners](https://aihub.org/2025/08/20/congratulations-to-the-ijcai2025-distinguished-paper-award-winners/)
- [FeijiangHan/Top-Conference-Best-Papers（GitHub 彙整）](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
- [Dendi Suhubdy — Notable Papers from ICLR, ICML, NeurIPS, CVPR, EMNLP (2025–2026)](https://backpropagation.ai/posts/notable-papers-icml-iclr-neurips-cvpr-emnlp-2025-2026/)
