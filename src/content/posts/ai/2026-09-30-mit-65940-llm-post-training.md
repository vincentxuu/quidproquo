---
title: "MIT 6.5940 第 14 講：LLM 後訓練——從 SFT、RLHF 到只動 1% 參數的高效微調"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, fine-tuning, lora, peft, multimodal]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 18
tldr: "第 14 講分三段。第一段是微調：SFT 用想要的回答做 next-token prediction，RLHF 先訓 reward model 再用帶 KL 懲罰的 RL 微調，DPO 把兩階段壓成一次監督式訓練；接著一路比較 PEFT：BitFit 只調 bias、Adapter 插小層但推論變慢、Prompt/Prefix-Tuning 佔用輸入長度，LoRA 用可併回權重的低秩分支解決推論延遲，QLoRA 再把主幹量化成 NF4，BitDelta 把微調差值壓到 1 bit。第二段是多模態 LLM：Flamingo 用 cross-attention、PaLM-E 與 VILA 把影像當 token、VILA-U 讓模型也能輸出影像。第三段是 prompt engineering：zero/few-shot、CoT 與 RAG。"
description: "MIT 6.5940 EfficientML（Fall 2024）第 14 講 LLM Post-Training 導讀：SFT、RLHF、DPO，BitFit、TinyTL、Adapter、Prompt-Tuning、Prefix-Tuning、LoRA、QLoRA、BitDelta 的取捨，Flamingo、PaLM-E、VILA、VILA-U 兩種多模態架構，以及 in-context learning、chain-of-thought 與 RAG。附 Fall 2026 對照。"
draft: false
glossary:
  - term: "PEFT"
    aliases: ["parameter-efficient fine-tuning", "參數高效微調"]
    definition: "微調大模型時只更新一小部分參數（或新增少量參數），其餘凍結的方法總稱。好處是每個下游任務只需存一份小的差異，而不是一整份模型。"
    context: "第 14 講第一段的主軸，從 BitFit 一路講到 BitDelta。"
  - term: "QLoRA"
    definition: "把凍結的主幹模型量化成 4-bit NormalFloat（NF4）、只訓練 LoRA 分支的微調方法。另外把量化用的 scaling factor 再量化一次（double quantization），並用可分頁、可卸載到 CPU 的 optimizer 狀態省記憶體。"
    context: "第 14 講第 36–39 頁，投影片的結論是讓中階或入門 GPU 也能微調 LLM。"
  - term: "BitDelta"
    definition: "把微調後權重與基底權重的差值（delta）量化成 1 bit，每個 tensor 只保留一個可微調的 scaling factor。多個微調版本可共用同一份基底權重，適合同時服務很多微調模型。"
    context: "第 14 講第 40–42 頁，屬於 Song Han 實驗室的研究。"
  - term: "Perceiver Resampler"
    definition: "Flamingo 用來把大小不一的影像特徵壓成固定少數幾個視覺 token 的模組：用一組可學習的 query 對影像特徵做 attention，輸出數量等於 query 數。"
    context: "第 14 講第 47 頁，用 27 個視覺 token、5 個 query 的例子說明形狀變化。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-llm-post-training-en)

**本文依據 [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940) Fall 2024。** 這是 [MIT 6.5940 導讀](/posts/ai/2026-09-30-mit-65940-course-overview)系列第 18 篇。

**系列位置**：上一篇 [Fall 2026 補充：Lab 1 GPU Basics](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics)｜下一篇 [L15 長上下文 LLM](/posts/ai/2026-09-30-mit-65940-long-context-llm)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

**官方材料**：[Lec14-LLM-Post-training.pdf](https://www.dropbox.com/scl/fi/ed32dovpq8no4571xmkzs/Lec14-LLM-Post-training.pdf?rlkey=5re66ef6shk3tr3v31ey6hzzo&st=d9n9h7ql&dl=0)（94 頁，以下頁碼皆指這份 PDF）、[第 14 講錄影](https://youtu.be/OCdwWfVoQ-Q)。F24 課頁把這講排在 2024 年 10 月 24 日，同一天公布期末專題題目。存取等級 **A3**：投影片與錄影公開；這一講沒有對應的 lab。2026-09-30 核對。

> 小提醒：PDF 封面寫的是「Lecture 13 LLM Post-Training Part II」，第 26 頁也夾了一張內容不同的舊版 Lecture Plan（提到 PockEngine、LongLoRA）。課頁與錄影標題都是第 14 講，本文以課頁為準，並以第 3 頁的 Lecture Plan 為地圖。

**Fall 2026 對照**：[Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940)同樣排了「LLM Post Training」（10 月 29 日，第 14 講），截至 2026-09-30 投影片與錄影還是空連結，無法比對內容。

## 這一講在解什麼

[第 13 講](/posts/ai/2026-09-30-mit-65940-llm-deployment)處理的是「已經訓練好的 LLM 怎麼跑得快」。這一講往前退一步：預訓練完的模型還不會當助理、不會看圖，要怎麼用最少的成本把它調成你要的樣子？

第 3 頁的 Lecture Plan 分三段：

| 段落 | 投影片頁 | 內容 |
|---|---|---|
| 1. LLM 微調 | 5–42 | SFT、RLHF（含 DPO）、PEFT：BitFit、TinyTL、Adapter、Prompt-Tuning、Prefix-Tuning、LoRA、QLoRA、BitDelta |
| 2. 多模態 LLM | 44–73 | Cross-attention 路線（Flamingo）、視覺 token 路線（PaLM-E、VILA）、能輸出影像的 VILA-U |
| 3. Prompt engineering | 75–93 | In-context learning、chain-of-thought、RAG |

這門課的主題是效率，所以 PEFT 那一串是本文寫最細的部分：每個方法都在修前一個方法留下的問題，順著讀下來就是一條清楚的演進線。

## 第一段：微調

### SFT、RLHF 與 DPO：三種「教模型怎麼回答」

- **SFT**（第 5 頁）：目標函數仍是 next-token prediction，差別只在資料只放「想要的回答」。投影片舉 Llama-2 的 SFT 資料為例，分成 helpfulness 與 safety 兩類；沒做 SFT 的回答乾而短，做過之後才像客服。
- **RLHF**（第 7–9 頁）：引用 [Ouyang et al.（InstructGPT）](https://arxiv.org/abs/2203.02155)。動機是 BLEU、ROUGE 這類靜態指標量不到創意、真實性、有用程度，RLHF 讓模型直接朝人的偏好最佳化。流程分兩步：先用成對比較資料訓 reward model，再用 RL 最大化 reward，同時用 KL 項拉住模型別離參考模型太遠，避免它過擬合 reward model。
- **DPO**（第 10–11 頁）：[Rafailov et al.](https://arxiv.org/abs/2305.18290) 把兩階段、多個模型的 RLHF 換成一次監督式訓練，不需要 reward model 也不需要 RL 演算法。第 11 頁用「上海在哪裡」當例子：`y_win` 是「上海是中國的城市」、`y_lose` 是「上海不存在」，參考模型那一側的 log 機率可以離線先算好。

<details>
<summary>三個目標函數（第 8、9、10 頁）</summary>

Reward model：

$$
\max_{r_\theta}\ \mathbb{E}_{(x,y_{win},y_{lose})\sim\mathcal{D}}\left[\log\sigma\big(r_\theta(x,y_{win})-r_\theta(x,y_{lose})\big)\right]
$$

RL 微調：

$$
\max_{\pi_\theta}\ \mathbb{E}_{x\sim\mathcal{D},\,y\sim\pi_\theta(y|x)}\left[r_\theta(x,y)\right]-\beta\,\mathbb{D}_{KL}\left[\pi_\theta(y|x)\,\|\,\pi_{ref}(y|x)\right]
$$

DPO：

$$
\max_{\pi_\theta}\ \mathbb{E}\left[\log\sigma\left(\beta\log\frac{\pi_\theta(y_{win}|x)}{\pi_{ref}(y_{win}|x)}-\beta\log\frac{\pi_\theta(y_{lose}|x)}{\pi_{ref}(y_{lose}|x)}\right)\right]
$$

</details>

這三個方法在其他課講得更深（見文末延伸閱讀）。6.5940 只用 7 頁帶過，重點放在下一段：不管用哪種訓練目標，**全參數微調一次要動幾十億個參數，存幾十份模型更貴**。

### PEFT：每個方法都在修前一個的缺點

第 17 頁用一組數字點出為什麼要 PEFT：1000 個下游任務、每個都存一份完整的 7B LLaMA，要 14 PB；如果每個任務只存 14 MB 的 adapter，總共 14 GB。

下面照投影片順序走一遍：

| 方法 | 頁 | 做法 | 留下的問題 |
|---|---|---|---|
| [BitFit](https://arxiv.org/abs/2106.10199) | 13–15 | 只更新 bias。BERT-base 有 110M 參數，bias 只有 0.1M，差了一千倍以上 | 小到中型資料集上能和全參數微調打平甚至更好，資料一多就輸 |
| [TinyTL](https://arxiv.org/abs/2007.11622) | 16 | 只調 bias，再加上 lite residual 模組補容量；原則是讓 activation 保持很小（降解析度、避開 inverted bottleneck） | 為裝置端訓練設計，第 21 講會再展開 |
| [Adapter](https://arxiv.org/abs/1902.00751) | 17–19 | 在每個 Transformer 層插入小的 bottleneck 層，只訓練它們；新任務不必回頭動舊任務 | 多出來的層在推論時是串接的，會增加延遲 |
| [Prompt-Tuning](https://arxiv.org/abs/2104.08691) | 20–22 | 把手寫 prompt 換成一段可訓練的連續向量，接在輸入前面；同一個 batch 可以混用不同任務的 prompt；模型越大，準確率越接近全參數微調 | 只加在第一層 |
| [Prefix-Tuning](https://arxiv.org/abs/2101.00190) | 23–24 | 每一層都加可訓練的 prefix，表現穩定優於只調 embedding | 見下 |

第 25 頁把 Prompt-Tuning 與 Prefix-Tuning 的共同缺點講白：兩者都**拉長輸入**，推論變慢，也吃掉原本可用的序列長度。投影片在這裡丟出整段的關鍵問題：能不能微調，卻完全不增加推論延遲？

### LoRA：訓練時是分支，推論時併回去

**直覺**。Adapter 慢，是因為多出來的層串在原本的路徑上。如果改成**並聯**，而且這條並聯分支最後能直接加回原本的權重矩陣，推論時就跟沒改過一樣。

**機制**（第 27–30 頁）。[LoRA](https://arxiv.org/abs/2106.09685) 在每層旁邊加兩個小矩陣：A 把維度 d 投影到低秩 r，用高斯分布初始化；B 再從 r 投影回 d，初始化成全 0。因為 B 一開始是 0，剛加上去時輸出完全不變：

$$
h = xW + xAB = x(W + AB) = xW'
$$

訓練完把 $AB$ 加進 $W$，得到新的 $W'$，推論不多花任何時間。

第 31–35 頁示範 LoRA 不只用在語言模型：同一個 stable-diffusion-v1-5，掛上從 Civitai 下載的不同 LoRA，就能換成水墨風、細節增強等畫風。

### QLoRA 與 BitDelta：把量化接進微調

學過第 5–6 講的量化，這兩個方法就很好懂：

- **[QLoRA](https://arxiv.org/abs/2305.14314)**（第 36–39 頁）：LoRA 的做法不變，但凍結的主幹改用 4-bit 存。三個零件：新資料型別 NormalFloat（NF4，第 37 頁列出 16 個確切數值）、double quantization（連 scaling factor 也量化）、可卸載到 CPU 的 paged optimizer。投影片的結論是讓中階、入門級 GPU 也能微調 LLM。
- **[BitDelta](https://arxiv.org/abs/2402.10193)**（第 40–42 頁）：直覺是微調加進模型的新資訊不多，所以微調後的權重差值應該很好壓縮。做法是把差值量化到 **1 bit**，每個 tensor 只微調一個 scaling factor。第 41 頁提到他們寫了融合反量化與 GEMM 的 binary kernel，讓 1-bit delta 在批次推論時保持量化狀態；第 42 頁把它用在多租戶 serving，示範模型都從 Mistral-7B 微調而來。投影片的標語是「The more you serve, the more you save」。

整條 PEFT 線可以濃縮成一句：**先減少要訓練的參數（BitFit、Adapter、Prompt），再消除推論代價（LoRA），最後連存與服務的成本也壓下去（QLoRA、BitDelta）**。

## 第二段：多模態 LLM

第 45 頁把讓 LLM 看圖的做法分成兩派：

1. **Cross-attention 注入**（Flamingo 路線）
2. **視覺 token 當輸入**（PaLM-E 路線）

### Flamingo：凍結 LLM，中間插 cross-attention

[Flamingo](https://arxiv.org/abs/2204.14198)（第 46–50 頁）保持 LLM 凍結，在中間層插入 cross-attention 讓文字去看影像。兩個零件：

- **Perceiver Resampler**（第 47 頁）：把大小不一的影像特徵壓成固定幾個視覺 token。投影片的例子是 27 個視覺 token 加 5 個可學習 query，K、V 共 32 個，attention map 是 5×32，輸出 5 個 token。
- **Gated cross-attention**（第 48 頁）：用 tanh gate 控制要放多少視覺資訊進來，gate 初始化為 0，所以一開始 LLM 的行為完全不變。這跟 LoRA 把 B 初始化成 0 是同一個想法。

### PaLM-E 與 VILA：把影像變成 token

- **[PaLM-E](https://arxiv.org/abs/2303.03378)**（第 51 頁）把影像、機器人狀態、3D 表示都當成 token 餵進 LLM；第 52 頁接到 [RT-2](https://arxiv.org/abs/2307.15818)，直接輸出控制訊號。
- **[VILA](https://arxiv.org/abs/2312.07533)**（第 53–64 頁）是 Song Han 實驗室的模型，訓練分三階段：projector 訓練、預訓練、SFT。第 54–57 頁列出四個發現：
  - 預訓練時凍結 LLM，zero-shot 還可以，但沒有 in-context learning 能力，要解凍 LLM 才有。
  - 交錯排列的圖文資料有幫助，只用圖文配對不夠好。
  - SFT 時把純文字指令資料混回來，不只補回純文字任務的退步，還提升視覺語言任務。
  - 原始解析度比 token 數量更重要。

第 64 頁的比較是在相同 prompt、相同基底 LLM 下勝過 LLaVA-1.5。第 65–66 頁補充兩種支援高解析度的做法：InternVL 1.5 把圖切成 448×448 的 tile 並附縮圖，CogAgent 用 cross-attention 接一個輕量的高解析度編碼器。

### VILA-U：也能輸出影像

[VILA-U](https://arxiv.org/abs/2409.04429)（第 67–73 頁）把影片、影像、文字的理解與生成放進同一個自迴歸模型。兩個關鍵：

- **統一的 vision tower**：同時用圖文 contrastive loss（抓語意）與 reconstruction loss（保留外觀，才能生成），並用 residual quantization 把影像變成離散 token。
- **Token in, token out**：所有模態都變成 token，訓練時對任何 token 都能套 LM loss，推論時再用解碼器還原成文字、影像或影片。

第 70 頁的主張是：這是離散視覺 token 的 VLM 第一次在理解任務上追上連續 token。這個「影像 token 化再自迴歸生成」的思路，[第 16 講的 HART](/posts/ai/2026-09-30-mit-65940-efficient-vision-gan-video-pointcloud) 會從效率角度再講一次。

## 第三段：Prompt engineering

最後一段不需要訓練，重點是怎麼問：

- **Zero-shot**（第 75–76 頁）：以前一個任務一個模型（翻譯一個 BERT、情緒分類一個 BERT），模型夠大後出現 emergent abilities，一個基礎模型靠 prompt 就能做不同任務。
- **Few-shot／in-context learning**（第 77–78 頁）：在 prompt 裡給幾個示範。第 78 頁的兩個技巧很實用：分類任務每類示範數量要平均；示範格式要一致。
- **Chain-of-thought**（第 79–80 頁）：讓模型寫出中間推理步驟；zero-shot 情境加一句「Let's think step by step」也有效。
- **Diffusion 的 prompt**（第 84–91 頁）：用 SDXL 示範逐步加描述詞與 negative prompt 的效果。第 83 頁另外放了一個已被修補的「奶奶越獄」例子。
- **[RAG](https://arxiv.org/abs/2005.11401)**（第 92–93 頁）：LLM 記不住所有長尾知識。簡單的 RAG pipeline 有四個零件：embedding model（用 MTEB 之類的 benchmark 評估）、retriever、可選的 reranker、最後生成答案的語言模型。

## 自學怎麼做

1. 先把第 25 頁那個問題（「能不能微調又不增加推論延遲？」）讀懂，再看第 30 頁的 $W' = W + AB$。這兩頁連起來，就能說清楚 LoRA 為什麼贏 Adapter。
2. 把第 17 頁的 14 PB vs 14 GB 換成自己的情境算一次：你有幾個微調版本？每個全量存要多少、用 LoRA 存要多少？
3. 今晚就能做的一件事：挑一個你用過的 LoRA checkpoint（語言或 diffusion 都行），打開它的設定檔找出 rank r，再用 d×r×2 估算它的參數量，和原本的層比一比。

## 延伸閱讀

- 同系列：[L13 LLM 部署](/posts/ai/2026-09-30-mit-65940-llm-deployment)、[L5 量化基礎](/posts/ai/2026-09-30-mit-65940-quantization-basics)（NF4 前置知識）、[L15 長上下文 LLM](/posts/ai/2026-09-30-mit-65940-long-context-llm)（LongLoRA）
- RLHF／DPO：[CS224N 第 8 講：instruction tuning、RLHF 到 DPO](/posts/ai/2026-08-22-cs224n-post-training)、[CS224R L9：RLHF、DPO 與偏好最佳化](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization)
- LoRA／QLoRA：[CMU 11-868 L23 大模型的高效微調](/posts/ai/2026-09-30-cmu11868-peft-lora)、[CS224N Tinker 與 LoRA](/posts/ai/2026-08-22-cs224n-tinker-lora)
- 多模態：[CS231N L16 視覺與語言](/posts/ai/2026-09-30-cs231n-vision-language)

## 參考資料

- [Lec14-LLM-Post-training.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/ed32dovpq8no4571xmkzs/Lec14-LLM-Post-training.pdf?rlkey=5re66ef6shk3tr3v31ey6hzzo&st=d9n9h7ql&dl=0) — 本文所有頁碼、數字與段落劃分
- [第 14 講錄影（YouTube）](https://youtu.be/OCdwWfVoQ-Q)
- [MIT 6.5940 Fall 2024 課頁](https://hanlab.mit.edu/courses/2024-fall-65940) — 排程與日期
- [MIT 6.5940 Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940) — 第 14 講排程與上線狀態
- [Ouyang et al., Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155)、[Rafailov et al., Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [Ben Zaken et al., BitFit](https://arxiv.org/abs/2106.10199)、[Cai et al., TinyTL](https://arxiv.org/abs/2007.11622)、[Houlsby et al., Parameter-Efficient Transfer Learning for NLP](https://arxiv.org/abs/1902.00751)
- [Lester et al., The Power of Scale for Parameter-Efficient Prompt Tuning](https://arxiv.org/abs/2104.08691)、[Li & Liang, Prefix-Tuning](https://arxiv.org/abs/2101.00190)
- [Hu et al., LoRA](https://arxiv.org/abs/2106.09685)、[Dettmers et al., QLoRA](https://arxiv.org/abs/2305.14314)、[Liu et al., BitDelta](https://arxiv.org/abs/2402.10193)
- [Alayrac et al., Flamingo](https://arxiv.org/abs/2204.14198)、[Driess et al., PaLM-E](https://arxiv.org/abs/2303.03378)、[Brohan et al., RT-2](https://arxiv.org/abs/2307.15818)
- [Lin et al., VILA](https://arxiv.org/abs/2312.07533)、[Wu et al., VILA-U](https://arxiv.org/abs/2409.04429)
- [Lewis et al., Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
