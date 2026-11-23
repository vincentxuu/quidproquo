# 語意審稿：CME295 2026 第 4 講（RL with LLMs）

## 2026-11-23

- 審稿者：獨立審稿子代理（未參與撰寫）
- 文章：`src/content/posts/ai/2026-09-29-cme295-rl-with-llms.md`、`-en.md`
- 審後版本 sha256 前 16 碼：zh `4530e87831a742da`、en `ef7efab30763f308`（含本次修正）
- 對照來源：`.work/cme295-2026-l4/transcript.txt`（人工 CC 字幕）、`slides.txt` 與 `pg/` 轉圖（p30–p134）、解答 PDF 轉圖（第 13–14 頁）、`qwen3.txt` 表 21

### 審稿結論：通過（修正 5 處後）

身分／標題、事實、教學品質分開說：

- **身分／標題**：課名、堂次、日期（2026-10-16）、講者分工（Afshine 到 GRPO、Shervine 接 OPD）與課表、字幕一致。新標題已同步到 `2026-09-30-ntu-adl2025-post-training-rlhf{,-en}.md` 第 448 行的連結文字。其他站內連結文字不引舊標題。
- **事實**：投影片公式（policy gradient、IS、玩具例 p36、value/advantage p50、clip p58、KL p61、DPO、GRPO、p100 正負號表、p104 DAPO/Dr. GRPO、p108、p124–125、p127、p132、p134）與正文一致；Qwen3 表 21（55.0→67.6／17,920 h；74.4／1,800 h）核對無誤；缺口表 p65–66（PPO 的 value function 箭頭同時指向缺口 1、2）、p109–110 與正文的地圖表一致。
- **教學品質**：每節有錄影時段、機制解說、例子（101/100 玩具例、box token advantage、四個泰迪熊回答、ρ=1.4 clip 計算、(1,1,0,0) GRPO）、自我檢查；文末練習附判準。本文整理（統一式子、mermaid 圖、baseline 無偏證明、KL 估計量、RLOO 代數）都有「本文補充／本文整理」標示。

### 期中考選擇題答案

撰寫紀錄說解答 PDF 未標選項；實際上正確選項在 PDF 中以紅字標示，`pdftotext` 抽不出顏色。轉圖確認：1B、2A、3C、4D、5B、6A、7D、8B。正文採用的第 1、2、3、4、6、7、8 題答案全部與官方一致，逐題依講課內容重推也成立（第 7 題：組平均 9 與 3，獎勵 8 為負、4 為正）。正文不需改；已更正 `.work/cme295-2026-l4/evidence.md` 的說明。

### `<details>` 內的 KaTeX

`astro.config.mjs` 的 `remarkMathOptIn`（frontmatter `math: true` 時用 remark-math 重新解析）＋ `rehype-katex`。`<details>`／`<summary>` 後有空行，CommonMark 的 HTML 區塊在空行結束，`$$` 仍以 Markdown 解析。用 `@astrojs/markdown-remark` 的 `createMarkdownProcessor` + remark-math + rehype-katex 實際渲染兩篇：L4 共 17 個 katex-display（details 內 1/1/1/4），輸出沒有殘留 `$$`，0 個 katex-error。不需移出 details。

### 修正（中英同步）

1. value model「通常共用骨幹、加一個回歸頭」：講者只說 shared backbone，刪「回歸頭」。
2. 「一般 PPO 實作會把 KL 懲罰併進獎勵」（兩處）：講者說的是「many variations… one of the variations」，改成「常見的一種」。
3. 難度偏差「Dr. GRPO 的建議是拿掉標準差」：投影片 p108 只引 DAPO，講者沒指名；改成「講者的建議是拿掉標準差（Dr. GRPO 論文就是這麼做的）」。
4. 被教師罰的 token：投影片 p124 只標 o_3、o_4 步驟 2 的「stays」，zh 原寫「（盒子）留在房間」整段；改成只標「留」，與 en 一致。
5. NTU ADL 2025 post-training 中英兩篇連結文字改成新標題。

### 未改、提醒

- 「整段回答的機率會不會小到不行」的問答實際在 13:44（第二節時段內），正文放在第一節敘述裡。內容正確，只是時段不在該節範圍；影響小，未搬。
- `2026-09-29-cme295-course-overview{,-en}.md` 第 131 行仍說 order 10–13 是「課前預寫版」，不在本次範圍，建議主對話另行更新。
