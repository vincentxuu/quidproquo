# Q：P 批建議補讀（主對話自讀）

### Searching for "Harmful Refusal": A Psychometric Audit of an AI Safety Benchmark（2026）
- 網址：https://arxiv.org/abs/2610.12409 （v1，2026-10-08；AI Measurement Science Workshop @ COLM 2026）
- 讀取狀態：✅（正文與限制）
- 讀取紀錄：pdftotext 約 61,700 字元。依序讀摘要、§1 引言、§2 方法（warrant 框架、MIRT、DIF）、§3 結果（維度、DIF、provenance）、§4 討論、§5 結論、限制段、致謝、參考文獻、附錄 A（實作細節）開頭。附錄 B（特徵值圖）、附錄 C（模型族穩健性表）只讀正文對它的轉述，未讀原表。
- 類型：研究論文（workshop）
- 研究設計：以 HELM Safety v1.17.0（2026-06-21 取用）的逐題判分，檢驗「harmful refusal」是否為單一可量的構念。81 個模型 × 398 題 HarmBench（n < p）；兩個 LLM judge 五分量表，嚴格在 1.0 二值化。方法：Bernoulli-null 特徵值檢查、探索式 MIRT 1D–10D、驗證式 3D（standard／contextual／copyright）與 7D（語意領域）、5 次 80/20 留出、每格 20 個起始值；DIF 用 Mantel-Haenszel 加 ridge-logistic，以 5,000 次無 DIF 模擬定 family-wise 門檻。
- 會被引用的結果：
  - HELM Safety 四個 harmful refusal 相關資料集中，三個已飽和（AnthropicRedTeam、SimpleSafetyTests、XSTest harmful 子集平均通過率 0.92–0.94）。原文：“with almost every model passing almost every item.”（§1）
  - 單維不夠：1D 2PL 留出 log-loss 0.470；2D–10D 約 0.28；驗證式 3D 0.258、7D 0.255；最強單維（3PL）0.322，3D 比它低 0.064，五個分割全部偏好 3D（§3、Table 1）。原文：“HarmBench responses are not organized by one harmful refusal dimension.”
  - 去掉 copyright 題後，standard 與 contextual 分成兩維仍在五個分割都較好（0.278 vs 0.293）。
  - DIF：單一分數下，能力匹配後 OpenAI 與 Anthropic 模型仍有 13 題（MH）／17 題（logistic）表現不同；分成 3D 後降到 1／2 題。原文：“broad developer-linked DIF appears under the single score, then mostly disappears once models are matched within a more specific scope.”
  - copyright 題主要反映記憶而非拒答傾向：“mixing two different drivers, refusal disposition and memorization, into one number.”（§4）
- 作者自列限制：81 個模型是依開發者聚集的便利樣本（OpenAI 21、Anthropic 11），同家模型不獨立；判分來自兩個 LLM judge，繼承其偏誤；只做 HELM 的 HarmBench 操作化，沒用 HarmBench 原始分類器管線重做；嚴格二值化丟掉分級資訊；只有一個 benchmark 一個版本。只否定單維，不確定真正維度數（3D 與 7D 預測力相近）。
- 與摘要說法不一致處：逐項對過，沒有。摘要對 DIF 的措辭（“consistent with aggregation effects but not sufficient to rule out domain-specific developer differences”）與正文一致。
- 反證或後續修正：無（2026-10 新文）。作者含 Botter（Measurement 期刊文作者，P 批 ✉️ 那篇），本篇引用其 Problems 1–3 說明小樣本 IRT 的限制。
- 對系列的用途：order 5「量到的是不是你想量的」的實例：一個叫「拒答有害請求」的分數其實混了三種行為；且同一套 HELM Safety 四個資料集三個已飽和（接 order 4）。order 19 的聚合失真也可引：HELM Safety 最上層單一分數再把多個資料集平均。檢驗方法（維度檢查＋能力匹配 DIF）只需逐題結果，可放進 order 22／23 的「評分器與報告驗證」作進階工具。
