# 文中數字與主張 → 來源位置（2026-10-25）

論文 = arXiv:2610.26860（完整版 HTML）。表號為論文原表號。「自算」表示文中數字由我從來源數字計算，非來源直接寫出。

## 成績與比較
| 文中 | 數值／主張 | 來源位置 |
|---|---|---|
| 22 項基準，四類 | 22；計數與定位、視覺搜尋與深度研究、一般 VQA 與幻覺、空間理解 | 論文 §3.1；附錄 D 表 21 |
| 七個主模型平均進步 | 9.7 至 12.6 分 | README Highlights 與 Results 表（七個模型）；論文摘要寫八個 backbone 同範圍，口徑不同，文中用 README |
| 第八個模型 Qwen2.5-VL-7B | 結果在附錄，與微調方法比較 | 論文 §3.1、§3.2；附錄表 9；README 說該設定不在釋出版 |
| GPT-6 Astra 全部 22 項進步 | — | 論文 §3.2；專案頁 Analysis |
| Luna 中等強度：不用工具／Codex／本框架 | 45.8／43.8／56.5 | 論文 §3.2；表 1；表 13（Base 45.76、Codex 43.78、Ours 56.52） |
| Visual Sketchpad 與不用工具差不多 | 45.6 對 45.8 | 專案頁 Comparison with Other Harnesses；表 13 medium（45.55 對 45.76） |
| Codex 最高強度才略高於不用工具 | 48.58 對 48.04（+0.5） | 表 13；附錄 B.6 說明 |
| Codex 多數題目幾乎不執行程式 | 0.16%（low）至 6.17%（max） | 附錄 B.6 說明與表 15 |
| Codex、Visual Sketchpad 沒有搜尋；Codex 搜尋刻意關閉 | — | 附錄 G 表 25 Search 欄；G.1 Codex 段；B.6 Setup |
| 33.5 對最高 28.0；三個微調方法也沒有搜尋 | 33.45；25.29／28.02／25.02 | 論文 §3.2；附錄表 9；表 25 |
| 最高強度不用工具 | 44.3 → 48.0 | 論文 §3.3；表 13（44.31、48.04） |
| 費用最多 37% | 0.92 美元對 Codex max 2.52 美元＝36.5%（自算）；論文原文「at most 37% of their model-token cost」 | 論文 §3.3；表 13「$ / 1k」欄 |
| 每題 token 其實比不用工具多 | 輸入約 1.7 萬（Ours medium）對約 1,800（Base） | 附錄表 14 |
| 消融五個數字 | 37.1／40.8／44.2／44.9／47.1（8B，整體欄） | 論文表 3（37.06、40.84、44.23、44.93、47.14）。注意：內文「+3.1／+4.5」與表內差值對不上，文中只引表內數字 |
| 最後一步在視覺搜尋進步最大 | +6.2（8B） | 論文 §3.4 |
| 文字版記憶增幅與執行間波動相當 | +0.7／+0.3 對標準差 0.2–0.35 | 論文 §3.4；附錄 H「Ablation」段、表 27 |
| Qwen3-VL 平均標準差不超過 0.35 | 0.16–0.35 | 附錄 H 表 26 與 Main results 段 |

## 失敗分析與調整
| 文中 | 數值／主張 | 來源位置 |
|---|---|---|
| 近一萬條失敗軌跡 | 9,893 | 論文 §3.5；附錄 E.1 |
| 擁擠畫面（超過 25 物件）、工具輸出錯誤占 75% | 75% | 論文 §3.5 |
| 視覺搜尋近半沒呼叫工具 | 49% | 論文 §3.5 |
| 最低強度略低於不用工具（GPT-6 Luna） | 61.51 對 61.63；54.45 對 56.54 | 論文 §3.3；附錄表 13 |
| harness search 約 +4、寫新工具幾乎沒幫助 | ERQA +4.1／RealWorldQA +3.7 對 +0.2／+0.1 | 論文 §3.6 |
| 寫新工具約 +8、改文字略退步 | SparBench +8.2 對 −0.5 | 論文 §3.6 |
| 兩種做法由 Codex＋GPT-5.5 操作 | — | 附錄 E.3 |

## 評分與其他
| 文中 | 來源位置 |
|---|---|
| 搜尋與深度研究用 GPT-4o 評分；其他開放式題目用 Qwen3-VL-8B | 附錄 C.6 Judges；D.1 Scoring；SECURITY.md |
| GPT 模型對人物辨識題拒答、被算錯 | 附錄 D.2「Refusals on identity queries」 |
| 附錄十七條範例軌跡是手選 | 附錄 F 導言 |

## 部署與風險
| 文中 | 來源位置 |
|---|---|
| 輔助模型預設 Qwen3-VL-8B；感知服務獨立 GPU；Serper 付費且有免費起始額度 | README Quick start（Prepare models and tools） |
| `examples/local_tools.yaml` 只需三個環境變數、不需 GPU 與 Serper | README Configure and extend（Disable capabilities you do not need） |
| 簽名網址一小時、物件不自動刪除；內建圖片主機加 tunnel 為另一選項 | SECURITY.md Data that leaves your machine；README Search |
| 子行程以使用者權限執行、逾時不是沙盒；router 無驗證、預設 127.0.0.1；只指向自己架的 router | SECURITY.md What runs where；README Run a question 警告 |
| 資料流向：主模型收到圖片、輔助模型收到被搜尋的圖、Serper 收到查詢與網址 | SECURITY.md Data that leaves your machine |
| `/backend-status` degradations | README Run a question |
| 2026-10-19 上傳 arXiv；MIT | arXiv 摘要頁 Submission history；README License |

## 台灣脈絡
| 文中 | 來源位置 |
|---|---|
| 論文與附錄沒有任何中文結果 | 完整版全文搜尋 chinese／mandarin／taiwan／traditional／multilingual，除參考文獻標題外零命中 |
| Multi-TW：900 題、圖文與音訊各 450、取自華語文能力測驗；閉源領先、圖文差距最明顯；Qwen2.5-VL-7B 與 UI-TARS-1.5-7B 領先 VLM；受測為 2025 年初模型 | arXiv:2508.01274 §2.1、§2.2、§3.2、§4 |
| PaddleOCR-VL 自建評測含繁體中文，編輯距離 0.048 | arXiv:2510.14528 評測段（表 6） |
| 個資法第 2、4、21、51 條；修正條文未施行 | 全國法規資料庫（2026-10-24 查詢）全文與第 51 條單條頁、沿革頁 |

## 已知問題與未核對
- 論文表 3 內文與表內差值不一致（見上）；成績皆為作者自報。
- 未逐列核對：附錄 E.2 逐資料集表格、F 的軌跡原文、I 相關研究。
- PaddleOCR-VL 報告只讀評測段；Visual Sketchpad、Kimi K3、Grounding DINO、DeepSeek-OCR、Codex 只讀摘要或首頁。
- GPT-6 發表頁（openai.com）代理回「上游中斷」，未驗，文章未引用。
