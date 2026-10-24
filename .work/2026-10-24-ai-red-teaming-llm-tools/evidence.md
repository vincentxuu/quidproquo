# 證據紀錄：測試你的 LLM 應用抗不抗攻擊（series order 6）

讀取程度說明：下表「查證依據」欄是 2026-10-24 獨立 post-verify 子代理（`review-verify-b4.md`）回到一手來源核對的結果；我（撰寫本檔者）沒有重新打開這些網址，只回頭核對「稿上現在寫的是否與子代理確認的一致」。標「未驗證」者代表沒有任何人讀到一手原文。研究筆記：`.work/research/ai-agent-security-tooling/research-note.md`。

縮寫：HA = https://arxiv.org/html/2606.18193v2；FJ = https://arxiv.org/html/2410.16527v3。

| 正文主張 | 一手來源 | 查證依據 | 備註 |
|---|---|---|---|
| HackAgent 標題數字是「五個 judge 至少四個判有害」，來自 TAP+PAP 配對子集，每個目標 15,652 次嘗試 | HA §3.5、Table 4 | 子代理逐格核對 | Confirmed |
| 表：≥1/5 為 Opus 4.8 10.39%、Fable 5 4.45%、Fable 5.1 9.91%；≥4/5 為 5.76%、2.72%、8.19% | HA Table 4 | 子代理逐格核對 | Confirmed |
| 最寬鬆門檻（≥1/5、≥2/5）Opus 4.8 比 Fable 5.1 脆弱；≥3/5 起順序翻轉；Fable 5 在每個門檻都最穩；先後 "bar-dependent" | HA §3.5 | 子代理核對原文 | 稿上正文提到 3/5，但表只列 1/5 與 4/5，3/5 的數字在稿上讀者無法驗證 |
| Fable 5 有回應 56%、Opus 4.8 91%；TAP 下差距大半是拒答，PAP 下排除拒答差距不變（3.07/0.69/9.50%） | HA §3.5 | 子代理核對原文 | PAP 的三個數字沒放進稿，只放結論 |
| Fable 5 與 Fable 5.1 兩輪用不同攻擊者模型（Qwen3-32B-abliterated vs Qwen3.8-27B-abliterated），只有方向可信 | HA §5 | 子代理核對原文 | 稿上沒寫模型名 |
| 分母算嘗試次數不算意圖種類，拒答留在分母 | HA 方法節 | 子代理核對 | Confirmed |
| 五個 judge 嚴格度：一個 20%，其他 58%–67% | HA | 子代理核對（66.5/66.0/59.2/58.3/20.0%） | Confirmed |
| 沒有 judge 對人工標註的準確率；絕對數字沒有大規模人工稽核 | HA §3.5 | 子代理核對 | 缺席證據僅限這份白皮書 |
| 白皮書是工具作者自己做的測試 | HA footnote（AI Security Lab at AI4I） | 子代理核對 | Confirmed |
| garak FAQ：結果沒有科學效度、各 probe 分數無共同標準化尺度、不是 benchmark、別依賴超過六個月的分數；另有 Z-score 校準 | https://raw.githubusercontent.com/NVIDIA/garak/main/FAQ.md | 子代理逐點核對 | Confirmed |
| FAQ：完整跑可能花上數小時，相依套件約 9GB | 同上 | 子代理核對 | 「數天」無來源，已從稿上刪除 |
| Fujitsu 2024：測 garak v0.9，某些類別錯誤率最高約 37%（MOE 26%）；「unethical」被當成拒絕 | FJ（Table IV Example 1） | 子代理核對 | 37% 是最大值，稿上已標明 |
| 現行 garak 為 v0.17 | https://github.com/NVIDIA/garak/releases | 子代理核對（最新 v0.17.1） | 稿上沒加日期 |
| garak 論文：像 Metasploit，會影響正式環境，須授權使用 | https://arxiv.org/abs/2406.11036 | 子代理核對原句 | Confirmed |
| promptfoo 的 LLM judge 預設 gpt-5 | https://www.promptfoo.dev/docs/red-team/troubleshooting/false-positives/ | 子代理核對 | Confirmed |
| 2026 年 3 月 OpenAI 公告同意收購 promptfoo，成交須滿足一般條件；README 寫 "Promptfoo is now part of OpenAI"；沒找到成交公告 | https://openai.com/index/openai-to-acquire-promptfoo/ 與 promptfoo 部落格（2026-03-09）；promptfoo README | 子代理核對 | 「沒找到成交公告」是缺席證據 |
| README 說 eval「100% 在本機執行」；紅隊有 remote-only plugin，沒自帶 API key 時預設走託管 | promptfoo README；https://www.promptfoo.dev/docs/red-team/troubleshooting/data-handling/ | 子代理核對 | 稿上已補「預設（沒自帶 API key）」 |
| CSA：PyRIT 評估 LLM 文字回應，不是 agent 實際狀態變化或工具呼叫 | https://cloudsecurityalliance.org/artifacts/evaluating-pyrit-for-agentic-ai-red-teaming | 子代理核對原句 | Confirmed |
| PyRIT 論文：微軟內部用於 100 多次紅隊作業；「沒有攻擊成功率的表」 | https://arxiv.org/abs/2410.02828 | 前半 Confirmed；後半只讀到部分論文 | 稿上已限定為「我讀到的部分」 |
| HackAgent：AI4I 旗下 AI Security Lab 開發，有託管版本，文件要求書面授權 | https://github.com/AISecurityLab/hackagent README | 子代理核對 | 「義大利」是網域推得，已從稿上刪除 |
| 模型廠商買下紅隊工具要多看利益關係；目前沒有第三方資料 | 無 | 未驗證 | 稿上以作者判斷呈現，不是引述；原稿「有社群提出」因找不到來源已刪 |
| 對第三方 API 發大量有毒提示可能違反使用條款 | 無 | 未驗證 | 稿上標為「這是推論」 |

## 沒有放進正文的東西
- promptfoo「授權聲明只涵蓋測試 promptfoo 自己」：safe-harbor 條款未重讀，從稿上刪除。
- 「到數天」、「義大利」、「社群提出利益衝突」：無來源，已刪。
