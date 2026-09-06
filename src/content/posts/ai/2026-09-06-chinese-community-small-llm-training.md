---
title: "中文社群怎麼從零訓練 LLM：語料、tokenizer 與三個開源專案的取捨"
date: 2026-09-06
category: ai
type: deep-dive
tags: [llm, training, open-source, pre-training, sft, tokenizer, chinese-nlp]
lang: zh-TW
series:
  name: "從零訓練一個 LLM"
  order: 3
tldr: "拆解三個中文圈從零訓練 LLM 的開源專案——baby-llama2-chinese（218M、634 億 tokens）、ChatLM-mini-Chinese（0.2B T5、1,023 萬條對話）、Steel-LLM（1.12B、1 兆 tokens、8 個月）——比較語料策略、tokenizer 決策與社群生態；誠實呈現評測：baby-llama2 在 MiniMind 的橫評中 21 分墊底，ChatLM 知識紮實（62 分）但程式能力弱。"
description: "介紹中文社群從零訓練小模型的開源路線：baby-llama2-chinese、ChatLM-mini-Chinese、Steel-LLM 三個專案的設計差異、中文語料與 tokenizer 取捨，以及誠實的評測數據。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-06-chinese-community-small-llm-training-en)

上一篇（[Karpathy 的 nanochat](/posts/ai/2026-09-06-karpathy-nanochat-nanogpt-llm-c)）代表英文圈的從零訓練路線；這篇看中文圈。選了三個定位互補的專案：[baby-llama2-chinese](https://github.com/DLLXW/baby-llama2-chinese)（教科書式 Llama2 複現）、[ChatLM-mini-Chinese](https://github.com/charent/ChatLM-mini-Chinese)（資源下限最低）、[Steel-LLM](https://github.com/zhanshijinwat/Steel-LLM)（個人煉 1B 的完整紀錄）。

先標偏誤：本系列聚焦英語圈與中文圈 GitHub 明星專案；退場案例只談研究用途的 Pythia / TinyLlama；非英語非中文圈（如日本的 LLM-jp）與非 Transformer 架構（RWKV / Mamba 系）不在覆蓋範圍。

## 中文從零訓練，跟英文圈差在哪

模型結構其實不是難點——三個專案用的都是現成架構（Llama2、[T5](https://arxiv.org/abs/1910.10683)、Qwen1.5）。真正的差異在三個地方：

**tokenizer 是第一個決策**。[Llama](https://github.com/meta-llama/llama3) 原生詞彙表的中文部分只有 700 個 token，直接拿來訓中文模型，中文能力聊勝於無。所以中文圈專案的第一步都是詞彙表取捨，而且三個專案給了三種答案：

- **baby-llama2 借用** [ChatGLM2-6B](https://github.com/THUDM/ChatGLM2-6B) **的分詞器**（64793 個詞）。README 特別指出這個數字剛好落在 uint16 表示範圍內，每個 token 只需 2 位元組，語料儲存省一半空間。
- **ChatLM 自己訓**了一個只有 29298 詞的詞彙表，僅中文加少量英文。
- **Steel-LLM 乾脆不訓**，直接用 [Qwen1.5](https://github.com/QwenLM/Qwen1.5) 的現成詞彙表。

對照 [MiniMind](https://github.com/jingyaogong/minimind) 自訓的 6,400 詞表，這條光譜從「精簡到極致」到「直接繼承」，對應的是不同的參數預算與生態策略。

**中文預訓練語料要自己拼**。英文圈有 FineWeb、Dolma 這類現成大規模語料；中文圈的選擇少得多，得靠中文維基、百度百科、C4_zh、智源 [WuDaoCorpora](https://data.baai.ac.cn/details/WuDaoCorporaText)、知乎問答這些來源自己拼，清洗流程也是各自手搓（baby-llama2 用 Minhash / Simhash 去重，Steel-LLM 用 [data-juicer](https://github.com/modelscope/data-juicer)）。對話資料則大量依賴 GPT 蒸餾產物——[BELLE](https://github.com/LianjiaTech/BELLE)、alpaca-zh 都是。

**生態不同**。權重與語料分發走百度網盤提取碼而非 HuggingFace；過程紀錄發在知乎與微信公眾號長文而非部落格；模型託管除了 HuggingFace 還有 ModelScope。想照著跑，得先習慣這套基礎設施。

## 三個專案，三種賭法：baby-llama2-chinese、ChatLM-mini-Chinese、Steel-LLM

| 專案 | 架構 | 參數 | 語料 | tokenizer 策略 |
|---|---|---|---|---|
| [baby-llama2-chinese](https://github.com/DLLXW/baby-llama2-chinese) | Llama2 | 92M / 218M | 634 億 tokens（維基、百科、C4_zh、悟道） | 借 ChatGLM2（64793） |
| [ChatLM-mini-Chinese](https://github.com/charent/ChatLM-mini-Chinese) | T5 Seq2Seq | 0.2B | 1,023 萬條對話 | 自訓（29298） |
| [Steel-LLM](https://github.com/zhanshijinwat/Steel-LLM) | Qwen1.5 改 | 1.12B | 1 兆 tokens | 繼承 Qwen1.5 |

**baby-llama2-chinese** 走最正統的路：從頭預訓練 + SFT，24GB 單卡可跑。它的價值在語料工程攤得最開——整理了中文預訓練語料清單、開源清洗後的 634 億 tokens 語料、展示了去重實測（百度百科 563 萬行經 Minhash 去重剩 273 萬行），還做了同語料不同模型大小（92M vs 218M）與不同詞彙表大小的對比實驗。目標是 500M–1B 的垂直領域模型，目前以 218M 的醫學對話模型落地。獎勵模型與 RL 在 README 裡標著「待做」，始終沒補上。

**ChatLM-mini-Chinese** 押的是資源下限：0.2B 的 T5 encoder-decoder（encoder 與 decoder 各 10 層），16GB 記憶體加 4GB VRAM 就能預訓練，fp16 推理只要 512MB。預訓練資料全是公開單輪對話——社區問答 webtext2019zh（清洗後 260 萬條）、百科問答、醫療問答、知乎、BELLE、維基條目，共 1,023 萬條。它是三個專案裡唯一走 encoder-decoder 路線的，也把 SFT（2 天）和 DPO（3 小時）走完，另外給了三元組資訊抽取的下游微調範例。作者誠實標注：預訓練資料只有 900 多萬條，會有答非所問、「廢話產生器」的情況。

**Steel-LLM** 賭的是規模：一個人用 1 兆 tokens 預訓練 1.12B 模型，從 2024 年 3 月到 8 月訓了 8 個月，最後用 8 張 H800。基於 Qwen1.5 改了兩處——FFN 層用 softmax MoE、雙層 SwiGLU；預訓練框架改自 TinyLlama。它最有價值的產出是過程本身：資料收集與清洗、框架改造、訓練曲線，全部寫成知乎與公眾號長文，後來整理成技術報告（[arXiv:2502.06635](https://arxiv.org/abs/2502.06635)），被 ICLR 2025 workshop 接收。

## 誠實的評估

[MiniMind](https://github.com/jingyaogong/minimind) 的 README（見[系列第一篇](/posts/ai/2026-09-06-minimind-train-llm-from-scratch)）做了三個專案中兩個的橫評，結果不留情面：

- **主觀評測中 baby-llama2-chinese 墊底**。MiniMind 作者把四個小模型的問答丟給 GPT-5.4 當評審打分（100 分制）：minimind-3-moe 68 分、ChatLM-mini 62 分、minimind-3 61 分、baby-llama2-chinese 21 分。baby-llama2 的長江題答成「中國是世界上最長的城市」，程式碼題輸出完全不可用的程式碼。要說明的是這是小樣本主觀評測，但 baby-llama2 README 自己貼的續寫樣本（如《小王子》續寫）同樣顯示基礎語言能力不足。
- **ChatLM-mini 知識紮實但程式弱**。它在這輪評測中知識準確性最高（準確性維度 25/30）：萬有引力正確歸給牛頓並引用 1687 年《自然哲學的數學原理》，長江發源地與流經省區都對。但程式碼題只拿 3/20——判斷條件寫反，函式完全無法運作；摘要題直接棄答。
- **客觀分數要打折看**。Steel-LLM 自報 C-Eval 41.9 分、C-MMLU 36 分，但 MiniMind 用 [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) 重測同一個模型，C-Eval 只有 24.9 分——同一個模型，評測框架不同，分數差 17 分。誰都沒有造假：小模型評測本來就對格式與計分方式極度敏感；MiniMind 的 README 也提醒，這個量級的模型在選擇題評測上常在隨機水準附近徘徊。

## 維護頻率低，不是失敗

三個專案的維護現況：ChatLM 最後更新停在 2024 年 1 月；Steel-LLM 在 2025 年 3 月發完強化學習部落格後靜默；baby-llama2 從 2024 年 5 月停更近兩年，2026 年 8 月才修了預訓練的取樣器與梯度累積問題、補上統一推理入口 `infer.py`。若用「活躍度」衡量開源專案，三個都算半退場。

但這條路線的目標本來就不是產品。三個專案從第一天的定位就是教學與復現：程式碼量小到能讀完、每個階段有資料來源與清洗腳本、訓練成本壓在個人可負擔範圍。模型本身在實際任務上都不堪用——README 們也都這麼承認——它們的價值在於把「一個 LLM 怎麼被造出來」的每個決策攤開。維護停下來，不代表這份教材失效；2026 年 baby-llama2 還能修復並適配新版 PyTorch，正說明有人仍在靠它入門。相較之下，MiniMind 是這條路線裡持續迭代的例外，從 v1 一路做到 Agentic RL——維護頻率是專案目標的函數，不是品質的函數。

## 整體來說

中文圈從零訓練的第一難關從來不是模型結構，而是語料與 tokenizer：語料要自己拼自己清，詞彙表要在「自訓小詞表、借用生態詞表」之間做選擇，分發與社群靠的是網盤、知乎與 ModelScope 這套基礎設施。想在最小的資源下跑通全流程，ChatLM 的 4GB VRAM 門檻最低；想讀語料工程，看 baby-llama2；想看一個人怎麼煉 1B，Steel-LLM 的過程紀錄是目前最完整的一份。若語料效率本身才是你想研究的題目，下一篇的 [YuLan-Mini](/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining) 把「用更少資料訓得更強」推得更遠；而當你真的要決定「該不該從零訓練」，留到[系列最後一篇](/posts/ai/2026-09-06-when-to-train-llm-from-scratch)再回答。

## 參考資料

- [baby-llama2-chinese GitHub](https://github.com/DLLXW/baby-llama2-chinese)
- [ChatLM-mini-Chinese GitHub](https://github.com/charent/ChatLM-mini-Chinese)
- [Steel-LLM GitHub](https://github.com/zhanshijinwat/Steel-LLM)
- [Steel-LLM: From Scratch to Open Source（arXiv:2502.06635）](https://arxiv.org/abs/2502.06635)
- [T5: Exploring the Limits of Transfer Learning（arXiv:1910.10683）](https://arxiv.org/abs/1910.10683)
- [ChatGLM2-6B GitHub](https://github.com/THUDM/ChatGLM2-6B)
- [BELLE GitHub](https://github.com/LianjiaTech/BELLE)
- [MiniMind GitHub](https://github.com/jingyaogong/minimind)
- [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness)
- [站內：MiniMind：用 3 塊錢從零訓練一個 LLM](/posts/ai/2026-09-06-minimind-train-llm-from-scratch)
