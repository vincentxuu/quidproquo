# 範圍卡：CS229 Spring 2026 第 14 堂

- **課程／版本**：Stanford CS229 Machine Learning，Spring 2026（Stanford Online 公開錄影）
- **文章角色**：單堂概念導讀（zh-TW）
- **原課堂次／order**：第 14 堂／series.order 14
- **文章**：`src/content/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention.md`
- **講者**：Tengyu Ma（依據：字幕 03:08「in my notes there is this word LLMification」、1:05:40「in the note, I call it attention 1h」，主講義作者為 Tengyu Ma 與 Andrew Ng，講義記號正是 att1h）
- **讀者先備**：softmax 與交叉熵、最大概似估計、矩陣乘法；反向傳播只需知道「可自動微分」
- **主問題**：整段文字的機率怎麼變成可訓練的損失？Transformer 裡 attention 每一步在算什麼？
- **讀完的能力**：
  1. 由鏈式法則寫出 next-token 交叉熵損失
  2. 手算 temperature 對 softmax 的影響
  3. 手算一列 masked attention 的權重與輸出
  4. 說明 attention 參數量與 T 無關、計算量為 T²·d_h
- **完整例子**：
  - 課堂：softmax(2,1,−1) ≈ (0.705, 0.259, 0.035)；放大成 (200,100,−100) 後 ≈ (1,0,0)，第二項 ≈ e^−100 ≈ 3.7e−44
  - 自擬：兩個 token 的損失，0.349 + 0.862 = 1.211，平均 0.606，對照 log 3 ≈ 1.099
  - 自擬：T=3、d_h=2 的 masked attention，輸出 (1,0)、(0.269,0.731)、(0.910,0.335)；不加 mask 時位置 2 為 (0.578,0.845)
  - 自擬：250,000^10 ≈ 9.5e53
- **自我檢查題與答案**：
  1. τ=2 → (0.547, 0.331, 0.122)
  2. q3 改 (0,1) → 權重 (0.155,0.422,0.422)，輸出 (0.578,0.845)
  3. d=512、n_h=8、d_h=64 → 1,048,576 個參數；T 加倍，參數 1 倍、內積 4 倍
  4. 訓練為何仍需 causal mask → 損失第 t 項要求 u_t 只依賴 x_0..x_{t−1}
  5. 為何不用大 MLP → 參數量隨 T 暴增、形狀綁死在 T
- **來源底本**：`.work/cs229-spring2026/txt/14-pwQ0l4hFCVI.txt`（英文字幕，未看板書）；`main_notes.txt` 第 17 章 17.1–17.3（pp.202–213）
- **這堂沒講**：in-context learning（標題有）、位置編碼、KV cache、top-p、GQA/MQA
- **數值驗算**：全部以 Python 重算過（2026-10-12）
