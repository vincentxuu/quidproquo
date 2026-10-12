# CMU 10-423 現有中文 24 篇稽核

稽核範圍：本機 24 篇 zh-TW 與原始規劃，2026-10-11。這是文章教學設計稽核，沒有重新下載官方 PDF，不能據此宣稱逐頁官方覆蓋完整。段落存證見 audit-excerpts.md（腳本縮取）。

## 判準與結論

不能只因跨兩堂就判定偷懶。現文已有公式、機制說明與部分自編數字例子；問題是沒有逐堂訂學習成果與獨立驗收，機制解說經常結束在「自己去算／讀論文」，缺固定輸入、可對照輸出與錯誤診斷。作業篇刻意不給官方作業解答是合理邊界，應補獨立暖身題，而不是洩漏 graded homework。

最嚴重的合併：影音世界模型、風險對齊、長上下文 SSM、分散式高效推論、文生圖 VLM、cross-attention DiT P2P Q-Former。拆篇是必要但不足條件，每一新篇仍需機制走讀和自編答案。

原始規劃的證據：第 67 行用「常見 8–22 篇」作篇數參照；第 99 行說「一講處理一個跳躍」但合併 L2/L3；第 103 行把四種機制放進內部機制一篇；第 105 行說進階講各自獨立卻合 L19/L21；第 134 行待辦坦承規劃未逐份打開 PDF。此規劃不能作課次覆蓋的充分證据。

## 逐篇判定（行號為各文章本機版本）

| order / 檔名尾段 | 已有教學證據 | 缺口與重規劃處置 |
|---|---|---|
| 0 generative-ai-overview | 34–175 課程政策、六單元、存取與路線，符合總覽定位 | 不是講座內容；需改成新篇對照圖，不能把 A3 或公開材料充足等同已完整教完 |
| 1 rnn-lm-autodiff | 64–127 模組 autodiff、n-gram、RNN 機率機制 | 149–153 檢核只轉練習考卷與 Colab。補小型前向、梯度與 next-token 機率的固定例子及答案 |
| 2 transformer-lm-decoding | 70–178 attention、因果遮罩、训练、KV cache、tokenizer、解碼 | L2 架構與 L3 訓練解碼各有獨立目標；187 練習只驗位置，不驗 NLL 或採樣。分開 L2/L3，加 attention 數值與 token 機率例子 |
| 3 modern-transformer-rope-gqa | 84–179 RoPE/GQA/window 的公式與比較 | 187 有具體 RoPE 檢核，但「算通只剩形狀」過度簡化 GQA/HW1；補 head 分組形狀、cache bytes 與邊界遮罩 |
| 4 hw1-mingpt-rope-gqa | 84–175 起始碼、測試、環境、形狀指引 | 屬作業導覽，可保留；加獨立 toy shape 答案。173 未實作狀態只驗 4 個 NotImplementedError，不能當完整可跑驗證 |
| 5 cnn-bert-vit | 44–127 CNN、BERT、ViT 核心 | 同一官方 L5，不應單按三名詞拆堂；134 patch 參數量練習缺結果，且單層權重比較不能直接證成資料依賴。补答案與比較限制 |
| 6 gans | 56–82 minimax/交替更新；129–135 有自編數字與答案 | 99–107 機率圖模型是另一目標；數字例子只驗 GAN，補 factor graph 正規化例子。是已有可保留內容，不宜全稱空洞 |
| 7 diffusion-models | 56–155 forward/reverse、閉式加噪、三種目標、演算法 | 163–169 叫讀者自行推與讀 Algorithm；補一筆 x0/epsilon/alpha-bar 加噪、重建、loss 的可核對結果 |
| 8 variational-inference-vae | 75–182 KL→ELBO、重參數化、VAE/DDPM 連結有完整公式 | L8 前半 diffusion 收尾與 L8/L9 VAE 是合理概念跨頁，但欠講次頁碼對照；190–196 把完整驗收外包 MNIST/論文。分 L8/L9 或按官方橋接區段明標，补 Gaussian KL 與梯度例子 |
| 9 hw2-ddpm | 86–163 DDPM 檔案、測試與環境 | 作業導覽可保留；179 只 T01/T02 綠為未實作起點；補獨立 toy q_sample/p_mean 檢核，不需官方答案 |
| 10 peft-in-context-learning | 75–184 多種 PEFT、LoRA、ICL 敏感度 | 實際涵蓋 L9 末/L10/L11 前（55、156），稱「兩講」錯縮來源；192–198 參數量與初始化練習無對照。按 L9/L10/L11 回歸課次，補答案 |
| 11 ift-rlhf-dpo | 51–168 IFT、InstructGPT、RL形式化、DPO推導 | 跨 L11/L12 可理解但兩堂目標不同；176–182 沒固定偏好概率與 loss 值，拆講並補 reference-policy ratio 例子 |
| 12 hw3-lora-gpt2 | 92–169 LoRA實作與訓練流程 | 保留作業導覽；以獨立 2×2 更新矩陣檢核 LoRA，不要求作業解答；實際 GPU訓練未驗證要續標 |
| 13 text-to-image-vlm | 66–103 LDM，118–176 CLIP/VQ-VAE/VLM 有公式 | L12條件生成與 L13圖文理解各自重要；182–188 CLIP N=3 練習沒矩陣值/答案，最後只驗 QKV。拆 L12/L13；避免把能否出圖簡化成連續/整數唯一條件 |
| 14 cross-attention-dit-qformer | 33–186 五種機制（含 CFG） | 本篇不是只四名詞，而是多個独立機制；192–198 最後只驗 P2P，Q-Former三遮罩交給 Figure2。拆 L14/L15，Q-Former加token/遮罩/凍結參數走讀 |
| 15 hw4-qformer-text-to-image | 75–167 凍結GPT2/DiT與可訓中介流程 | 作業導覽可保留；173 填 pass 後13失敗只是基線，不是可訓驗證。補一個合法 toy mask/shape 答案、保持GPU時數限制 |
| 16 scaling-laws-moe | 59–95 scaling，100–150 routing/capacity/load balance | L15後半與L16兩個不同決策問題；152–159 沒計算预算或routing結果的完整核對。拆 L15/L16，保留2025 slide版本提示 |
| 17 distributed-efficient-inference | 37–96各種平行；98–145 FlashAttention/解碼 | L17訓練資源與L18推論IO是獨立目標；158只驗online softmax，不能驗通信/分布保持。拆堂，補 all-reduce bytes 與 rejection小例子 |
| 18 long-context-ssm | 105–191 SSM recurrence/conv/hybrid 有機制 | L19與L21非連續，两个 Quiz 範圍；199具體SSM輸入未列結果，長context完全未獨立驗。拆堂，補 y=[2,1,6.5,5.25]（h0=0）及窗口/檢索漏召回例子 |
| 19 reasoning-models | 72–153 RL/GRPO；177固定reward優勢有答案 | 155–167 mechanistic interpretability是同L20的後半可留；全同reward分母零需區分論文式與實作epsilon，補解釋與不把CoT當忠實機制證據 |
| 20 risks-alignment | 79–161實務風險；163–219理論主張 | L22與L26另一份PDF、不同前提；227只做偏見prompt不驗corrigibility/字典序效用。必拆；理論主張標假設與範圍，不當普遍定論 |
| 21 code-generation-agents | 53–77评估；104–153工具與coding迴圈 | 同一官方L23可留；179讓讀者算pass@1/@5缺 estimator固定答案；补 n=5,c=2,k=1/5 的估計與sandbox/tool error狀態 |
| 22 audio-video-world-models | 47–101音訊，103–156影片，158–218世界模型；有時空reshape | 三份PDF112頁被同篇處理，227只驗音訊logmel；影片、action conditioning、rollout漂移缺独立驗收。必拆L24/L25/L26世界模型，L26 alignment另篇 |
| 23 exam-hw623-project | 82–195各項評量/專案，197–208自學流程 | 不是多堂講座合併，是行政/驗收總覽；可保留或分支。210–212「正式範圍不能確認」與多篇引L18提醒L1–15需釐清證據來源，不消掉矛盾 |

## 撰寫驗收要求

每篇明確列官方 Lecture/PDF段落、先修、讀完能做什麼；一條機制用固定輸入走到輸出；自編題至少一道附推導或可核對答案；標讀者常見誤解及反例；只有圖的投影片應目視檢查，不能只因pdftotext拿不到就跳過；每講有独立範圍與檢核。作業篇則保持不交付官方graded解答，補獨立暖身。
