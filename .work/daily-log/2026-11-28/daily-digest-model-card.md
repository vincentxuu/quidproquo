產出：GigaChat 4 (708B-A41B) 模型卡（中英雙語），Sber 2026-11-26 以 MIT 授權開源的旗艦模型。

- 候選篩選：HF trending 掃到 KRAFTON/Raon-1-mini（正式版），但該 base model 的 preview 已於 2026-10-23 寫過模型卡，依兩層過濾規則「已寫過模型卡的後續衍生版」跳過；Ming-Image-0.2-Design（InclusionAI）與 Aion-1.0-Instruct（Microsoft）兩個候選因主題與 Agent 開發關聯性較低，本次未選入。
- 圖解：Benchmark 表現段落加一張 dumbbell 前後對照圖（GigaChat 4 vs 前代 GigaChat 3.5 Ultra 四項指標），英文版座標相同但 BFCL 標籤因英文較長縮短為「BFCL v4 (tools)」以通過 check:diagram-text。
- diagram-preview 未跑：無瀏覽器，check:diagram-geometry／check:diagram-text 皆已過（中英各一次）。
- check:references 一次通過，無 WARN。
