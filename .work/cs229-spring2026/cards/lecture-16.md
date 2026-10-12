# 範圍卡：CS229 Spring 2026 第 16 堂

- **課程／版本**：Stanford CS229 Machine Learning，Spring 2026（Stanford Online 公開錄影）
- **文章角色**：單堂概念導讀（zh-TW）
- **原課堂次與 order**：影片標題 Lecture 16；`series.order: 15`。第 15、17 堂沒有公開錄影。
- **文章路徑**：`src/content/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning.md`
- **影片**：https://www.youtube.com/watch?v=hHC-SF3utxg（73 分鐘）。YouTube 標題寫「Basic Concept in RL, Policy Gradient」，內容其實是 attention 變體、MoE、ICL、zero-shot、SFT；文章狀態行已明講。
- **講者**：Tengyu Ma（依據：講者說 "in the lecture notes, I did cite some papers"，並接續 "last Wednesday, we talked about attention"；第 1 堂同一位講者說 "this is me and Chris"）。

## 讀者先備

第 14 堂的 token、next-token loss、Q／K／V 投影、single-head attention 矩陣式、causal mask、multi-head。微積分、線性代數、基礎機率（變異數相加）。

## 主問題

attention 與 MLP 在長上下文、大模型下貴在哪裡，各有什麼改法；訓練好的模型怎麼用在下游任務，哪些做法會動參數。

## 讀完的能力

- 算 KV cache 的大小，以及 GQA（τ = n_h / n_g）省下的比例；用 g(j) 找 query head 對應的 key 組。
- 解釋 c = √d_h 的量級估算與它的假設。
- 算 sliding window 的運算量 T·w 與 L 層的回看範圍。
- 手算 MoE 的 top-k 路由與重新正規化後的加權輸出。
- 分清 few-shot、zero-shot、SFT／instruction tuning 誰動參數，SFT 的 loss 算在哪些 token。

## 完整例子

| 例子 | 來源 | 結果 |
|---|---|---|
| KV cache：32 層、n_h=32、d_h=128、2 bytes、T=100,000 | 自擬 | 約 52 GB；n_g=8 約 13 GB；n_g=1 約 1.6 GB |
| g(j)：n_h=8、n_g=2 | 自擬（課堂：n_g=2、n_h=100 → τ=50） | head 1–4 → 組 1，5–8 → 組 2 |
| √d_h：d_h=256，分數差 16 | 自擬 | 不除 e^16≈8.9e6:1；除 16 後 0.73:0.27 |
| sliding window：T=1e6、w=1000 | 課堂數字 | 1e9 對 1e12 |
| 回看範圍：w=3、2 層 | 自擬 | 往回 4 步 = L(w−1) |
| MoE：r=(0.5,0.1,0.3,0.1)、k=2 | 自擬 | α=(0.625,0.375)，輸出 (1.25,1.5) |
| ICL：2~3=5、6~7=13、15~2=? | 課堂與講義 | 17 |
| SFT loss：機率 0.5、0.25 | 自擬 | 2.079；每 token 平均 1.04 |

## 自我檢查題與答案

1. n_h=12、n_g=3，head 7 → 第 2 組；KV cache 1/4。
2. 為何只縮 K、V：生成時 query 只留當下一步，K、V 要留整條序列。
3. w=4096、L=24、T=200,000：回看約 98,304，看不到第 1 個 token；內積約 8.2e8 對 2e10，約 1/24。
4. r=(0.2,0.6,0.1,0.1)、k=2：選 1、2，α=(0.25,0.75)。
5. 只有 instruction tuning 改參數；loss 只算答案 token。

## 來源底本

- 逐字稿 `.work/cs229-spring2026/txt/15-hHC-SF3utxg.txt`（整份讀完，未看板書）
- 主講義 `main_notes.txt` 第 17 章 17.3 末段–17.8（pp.213–219）、式 (7.51)

## 未解之處

- 客座講者姓名字幕作「Samarin」，指標名稱作「MFA」，皆未寫進正文定論。
- 課堂說 d 加倍「compute 4x、memory 2x」，記憶體 2x 對不上 d×d 矩陣，正文只寫乘法次數四倍。
- 最後一個回答 "you can do the longer stuff" 疑為 LoRA，未寫入。
