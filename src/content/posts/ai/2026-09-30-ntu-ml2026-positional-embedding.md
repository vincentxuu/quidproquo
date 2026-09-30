---
title: "台大李宏毅 ML 2026 導讀：Positional Embedding——模型怎麼知道順序、怎麼吃超長輸入"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ai-course, course-guide, transformer, attention, long-context]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 9
tldr: "Self-attention 本身看不出「你打我」和「我打你」的差別，所以要另外告訴它位置。李宏毅這一講從 Sinusoidal 絕對位置講到 ALiBi、T5 的相對位置，再到今天 Llama、Qwen、Gemma 都在用的 RoPE。後半段處理「訓練短、測試長」：RoPE 轉到沒看過的角度就會壞，於是有 Position Interpolation、NTK-Aware、YaRN、Dynamic Scaling、LongRoPE 這一串修法。最後一個轉折是 NoPE：decoder-only 的因果注意力本來就帶有位置資訊，甚至可以在訓練後把位置編碼拿掉。"
description: "台大李宏毅《機器學習 2026 Spring》3/27「深入模型內部架構：模型如何處理超長輸入」導讀，依 pos.pdf 64 頁與影片：Absolute／Sinusoidal、ALiBi、T5 relative bias、RoPE 與「越遠越小？」、Train Short Test Long、Position Interpolation、NTK-Aware、YaRN、Dynamic Scaling、LongRoPE、NoPE 與 DroPE。"
draft: false
glossary:
  - term: "RoPE"
    aliases: ["Rotary Position Embedding", "旋轉位置編碼"]
    definition: "把 query 與 key 向量每兩維看成一個平面，依 token 位置旋轉一個角度；兩個 token 的內積只和它們的位置差有關。"
    context: "投影片指出 Llama、Qwen、Gemma 都使用 RoPE，而且它不改 attention 的計算流程，與 KV cache 相容。"
  - term: "Position Interpolation"
    aliases: ["PI", "位置內插"]
    definition: "把超出訓練長度的位置編號等比例壓縮回訓練看過的範圍，讓 RoPE 不會轉到沒見過的角度。"
    context: "投影片標註它「仍然需要微調模型參數」，並引出之後只壓低頻維度的 frequency-based 方法。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding-en)

**本文依據[台大李宏毅《機器學習 2026 Spring》](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)3/27 那一週的教材。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 9 篇。前兩講在談生成為什麼慢：[Flash Attention](/posts/ai/2026-09-30-ntu-ml2026-flash-attention) 處理記憶體搬運，[KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache) 處理重複計算，上一篇 [HW3](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference) 把它們放到 GPU 上量測。這一講換一個問題：**agent 動輒吃進幾十萬 token 的輸入，模型怎麼知道每個 token 在第幾個位置？訓練時沒看過那麼長，測試時又為什麼會壞？**

課表上這一列的標題是「深入模型內部架構：模型如何處理超長輸入」，用到的官方材料是講義 [pos.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/pos.pdf)（64 頁，另有 [pptx](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/pos.pptx)）與影片[如何讓 Transformer 知道輸入 Token 的順序？Absolute、Relative、RoPE、到沒有 Positional Embedding](https://youtu.be/Ll-wk8x3G_g)。存取等級是 **A3**：投影片與錄影都公開，本講沒有對應的測驗或排行榜。

## 場景：「你打我」和「我打你」

投影片第 2–3 頁的例子很短：把 A B C D 四個 token 丟進 self-attention，對 D 來說，前面三個 token 的順序換成 C B A，attention 的加權總和完全一樣。可是「你 打 我」和「我 打 你」意思相反。所以 Transformer 需要額外的位置資訊。

第 4 頁把整講切成五段，本文照這個順序走：

1. Absolute Positional Embedding
2. Relative Positional Embedding
3. RoPE
4. Train short, test long
5. No Positional Embedding?!

## 絕對位置：Sinusoidal 與它的盲點

最早的做法是給每個位置一個向量 p，直接加到 token 向量 x 上（第 6 頁）。[Attention Is All You Need](https://arxiv.org/abs/1706.03762) 用的 Sinusoidal 版本是用不同頻率的 sin、cos 組成這個向量。投影片用時鐘比喻：高頻維度像秒針，轉得快，分辨相鄰位置；低頻維度像時針，轉得慢，分辨遠距離的位置（第 9–11 頁）。

第 13–14 頁提出真正的需求：**相對位置才重要**。「貓 吃 了 魚」出現在句首或第 101 個 token，「貓」和「魚」的關係應該一樣；兩個字中間隔了一大段，關係就該弱很多。

第 16–22 頁把加上位置後的 attention 分數拆開：x+p 的內積會展開成「只跟內容有關」「內容與位置交互」「只跟位置有關」幾項。Sinusoidal 的問題是，你看不出這幾項和**相對位置**有直接關聯。第 22 頁寫下目標：希望位置那一項「只跟相對位置有關」。

<details>
<summary>展開：Sinusoidal 的式子</summary>

依原論文，位置 pos、第 i 對維度：

- PE(pos, 2i) = sin(pos / 10000^(2i/d))
- PE(pos, 2i+1) = cos(pos / 10000^(2i/d))

i 越小頻率越高（秒針），i 越大頻率越低（時針）。投影片第 10 頁標出的 6.3、628.3、54410.1 就是不同維度轉一圈所需的位置數。

</details>

## 相對位置：ALiBi 與 T5

既然相對位置才重要，乾脆不要加 p，直接改 attention 分數。

- **[ALiBi](https://arxiv.org/abs/2108.12409)（第 24 頁）**：分數減掉 b×(m−n)，m−n 是兩個 token 的距離。投影片的註解是「距離越遠，attention 越小，就這樣！」b 是手動設定的，不同 attention head 設不同值。
- **[T5](https://arxiv.org/abs/1910.10683)（第 26 頁）**：同樣是在分數上加一個依距離決定的 bias，但這個 bias 是**可訓練參數**。

## RoPE：用旋轉表示位置

第 27 頁點名 [RoPE](https://arxiv.org/abs/2104.09864) 是 Llama、Qwen、Gemma 採用的做法，並強調兩個優點：它不影響 attention 的計算過程，也和 KV Cache 相容。

直覺是這樣：把 query、key 的每兩維看成平面上的一個箭頭，位置 n 的 token 就把箭頭轉 nθ。兩個 token 做內積時，只剩下角度差 (m−n)θ 有影響，所以「貓」「魚」在位置 1、3 和位置 101、103 算出來的分數一樣（投影片第 32 頁的例子；旋轉的圖在第 29–31 頁）。

<details>
<summary>展開：旋轉角度怎麼設</summary>

每一對維度用不同的基礎角度 θ_i = 1 / 10000^(2i/d)，i = 0, 1, …, d/2−1（投影片第 49 頁）。i 小的維度轉得快，i 大的轉得慢，和 Sinusoidal 的「秒針、時針」是同一個結構，只是從「加法」改成「旋轉」。

</details>

### RoPE 越遠越小？

常見的說法是 RoPE 讓 attention 隨距離衰減。第 39–40 頁引用 [Round and Round We Go!](https://arxiv.org/abs/2410.06205) 反駁：RoPE **沒有**越遠越小。這篇論文分析 Gemma 7B，認為衰減不太可能是 RoPE 有用的主因。投影片附了一份[範例 Colab](https://colab.research.google.com/drive/1rWDtAkScrb2K3tcprSTzwuRQo5bGiyKJ?usp=sharing)讓你自己畫。

第 40 頁接著說「不一定是一件壞事」：query 可以被訓練成剛好對準某個距離的 key。投影片的例子是「我 的 貓」「他 的 狗」，讓「貓」固定去看往前兩格的那個字。

## Train Short, Test Long

第 42 頁的情境：訓練時序列都短於 1M token，測試時卻要處理超過 1M 的輸入。第 45 頁用一張圖解釋 RoPE 為什麼會壞：訓練時 key 最多只轉到 Nθ，測試時轉到 2Nθ，模型從沒見過那個方向的向量。

講義第 41 頁列出這一段的整理參考是 Aman Arora 的 [How LLMs Scaled from 512 to 2M Context](https://amaarora.github.io/posts/2025-09-21-rope-context-extension.html)。修法依序是：

| 方法 | 做法（依投影片） | 代價 |
|---|---|---|
| [Position Interpolation](https://arxiv.org/abs/2306.15595)（第 46–47 頁） | 把 1、2、3、4 壓成 0.5、1、1.5、2，所有位置都等比例壓回訓練範圍；同時期也有 [kaiokendev](https://kaiokendev.github.io/context) 的做法 | 投影片寫明「仍然需要微調模型參數」 |
| Frequency-based（第 48–49 頁） | 高頻維度在訓練長度內早就轉過好幾圈，超過 N 也無妨，不動；低頻維度在訓練時連一圈都沒轉完，才需要壓縮 | 要決定哪些維度算高頻 |
| NTK-Aware Scaling（第 50–51 頁） | 第 i 對維度乘上 f(L, i) = (1/L)^(2i/(d−2))：最高頻的 θ_0 完全不動，最低頻的維度壓成 1/L，中間平滑過渡；投影片引用社群貼文的圖，LLaMA 7B 不微調就能撐到遠超過 2048 的長度 | 來源是 Reddit 貼文，不是論文 |
| [YaRN](https://arxiv.org/abs/2309.00071)（第 52 頁） | Yet another RoPE extensioN method，frequency-based 路線的論文版 | 仍屬於縮放位置的思路 |
| Dynamic Scaling（第 53–54 頁） | 固定壓縮會讓「長序列能做了，短序列反而變差」；改成只在序列超過訓練長度時才壓 | 壓縮比例隨長度變 |
| [LongRoPE](https://arxiv.org/abs/2402.13753)（第 56 頁） | frequency-based 加上 dynamic，每個維度的縮放比例用 evolutionary search 找 | 需要搜尋 |

## No Positional Embedding?!

最後一段把開頭的前提推翻。第 59 頁畫了兩個 decoder：輸入「貓 吃 魚 嗎」和「魚 吃 貓 嗎」。因為每個 token 只能看自己和前面的 token，最後一個「嗎」看到的集合雖然一樣，中間幾個位置看到的前文卻不同，層層疊上去，輸出就不同了。投影片的結論是「所以沒有必要加 Positional Embedding！」

支持這個說法的兩篇論文：

- **[NoPE](https://arxiv.org/abs/2305.19466)（第 61 頁）**：比較 decoder-only Transformer 在 APE、T5 relative、ALiBi、Rotary 與完全不加位置編碼下的長度泛化，NoPE 在他們的推理與數學任務上表現最好。
- **[DroPE](https://arxiv.org/abs/2512.12167)（第 62–63 頁；第 52 頁 YaRN 的圖也出自這篇）**：位置編碼在預訓練時幫助收斂，但也是模型無法泛化到更長序列的原因；訓練完拿掉它，經過短暫重新校準，就能零樣本延長 context。

我的讀法：位置編碼的角色從「沒有它模型不懂順序」變成「訓練時的輔助輪」。這也解釋了為什麼前面那一串縮放法都有極限：它們都還在跟顯式的位置訊號搏鬥。

## 連回模型：這一講回答了什麼

回到開頭的問題。現代 LLM 大多用 RoPE 表示位置，因為它把相對距離放進內積、和 KV cache 相容。context 從幾千延伸到上百萬，主要靠在推論時縮放 RoPE 的角度，再搭配少量微調，甚至完全不微調。當你在模型說明頁看到「rope scaling」「YaRN」「128K context」這些字，指的就是這一講的後半段。

**怎麼做**：打開你常用的開源模型的 `config.json`，找 `rope_theta` 與 `rope_scaling` 兩個欄位。如果 `rope_scaling` 有值，對照上面的表格看它屬於哪一種方法，再看它宣稱的 context 長度是訓練長度的幾倍。

## 這一篇可以確認與不能確認的

可以確認：講義 64 頁的結構、每頁標題、圖上的標註與引用來源；每篇論文的標題與摘要都在 arXiv 核對過；影片標題與上傳者用 YouTube oEmbed 核對過。

不能確認：本文沒有逐字聽寫影片，老師口頭補充的例子與數字沒有寫進來。NTK-Aware 與 Dynamic Scaling 的來源是 Reddit 貼文，投影片只引用了它們的圖，本文沒有另外驗證那些數字。

## 延伸閱讀

- Stanford CME295 導讀的 [Transformer 技巧](/posts/ai/2026-09-29-cme295-transformer-tricks)，同樣從位置編碼講到 RoPE
- CMU 11-785 導讀的 [Transformer 架構](/posts/ai/2026-08-22-cmu-11785-19-transformer-architectures)

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)｜上一篇 [HW3：LLM Fast Inference](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference)｜下一篇 [HW4：訓練 Transformer](/posts/ai/2026-09-30-ntu-ml2026-hw4-training-transformer)

## 參考資料

- [台大李宏毅《機器學習 2026 Spring》課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [pos.pdf（Positional Embedding 講義）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/pos.pdf)
- [影片：如何讓 Transformer 知道輸入 Token 的順序？Absolute、Relative、RoPE、到沒有 Positional Embedding](https://youtu.be/Ll-wk8x3G_g)
- [Attention Is All You Need（arXiv 1706.03762）](https://arxiv.org/abs/1706.03762)
- [Train Short, Test Long: Attention with Linear Biases Enables Input Length Extrapolation（ALiBi，arXiv 2108.12409）](https://arxiv.org/abs/2108.12409)
- [Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer（T5，arXiv 1910.10683）](https://arxiv.org/abs/1910.10683)
- [RoFormer: Enhanced Transformer with Rotary Position Embedding（arXiv 2104.09864）](https://arxiv.org/abs/2104.09864)
- [Round and Round We Go! What makes Rotary Positional Encodings useful?（arXiv 2410.06205）](https://arxiv.org/abs/2410.06205)
- [Extending Context Window of Large Language Models via Positional Interpolation（arXiv 2306.15595）](https://arxiv.org/abs/2306.15595)
- [kaiokendev：Extending Context is Hard](https://kaiokendev.github.io/context)
- [YaRN: Efficient Context Window Extension of Large Language Models（arXiv 2309.00071）](https://arxiv.org/abs/2309.00071)
- [LongRoPE: Extending LLM Context Window Beyond 2 Million Tokens（arXiv 2402.13753）](https://arxiv.org/abs/2402.13753)
- [The Impact of Positional Encoding on Length Generalization in Transformers（NoPE，arXiv 2305.19466）](https://arxiv.org/abs/2305.19466)
- [Extending the Context of Pretrained LLMs by Dropping Their Positional Embeddings（DroPE，arXiv 2512.12167）](https://arxiv.org/abs/2512.12167)
- [Aman Arora：How LLMs Scaled from 512 to 2M Context: A Technical Deep Dive](https://amaarora.github.io/posts/2025-09-21-rope-context-extension.html)
- [NTK-Aware Scaled RoPE（r/LocalLLaMA 貼文）](https://www.reddit.com/r/LocalLLaMA/comments/14lz7j5/ntkaware_scaled_rope_allows_llama_models_to_have/)
- [Dynamically Scaled RoPE（r/LocalLLaMA 貼文）](https://www.reddit.com/r/LocalLLaMA/comments/14mrgpr/dynamically_scaled_rope_further_increases/)
