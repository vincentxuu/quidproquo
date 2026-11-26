# 語意審稿：CME295 2026 第 5 講（LLM systems）

## 2026-11-23

- 審稿者：獨立審稿子代理（未參與撰寫）
- 文章：`src/content/posts/ai/2026-09-29-cme295-llm-systems.md`、`-en.md`
- 審後版本 sha256 前 16 碼：zh `6acf51784f2d14b1`、en `bcf25d3b977fa5d2`（含本次修正）
- 對照來源：`.work/cme295-2026-l5/transcript-para.txt`（人工 CC 字幕）、`slides-paged.txt`、`png/` 與 PDF 轉圖（p92、p140、p141、p144）、`syllabus.html`；外部即時核對 2025 期中考 PDF 題號、vLLM speculative decoding 文件原句、NVIDIA H100 規格頁

### 審稿結論：通過（修正 1 處後）

- **身分／標題**：日期 2026-10-30、片長 1:47:01、講者分工（Afshine：FlashAttention 與分散式訓練；Shervine：推論）與課表、字幕一致；期末考 12 月 9 日與課表一致。
- **事實**：TTFT/TPOT/TTLT 公式（p92，含 (O−1)）、p100 數量級、p125 h=24／G=2、p144 接受規則與殘差分布、p146 免費多一個 token、p153 收尾、FlashAttention 數據表、Chen 等人引用與「[BOS] my teddy bear → is cute and smart」例子都與投影片一致。課堂口述（FLOPs/FLOPS、HBM 約 1 TB/s 與 SRAM 數十 TB/s／百 MB、指數下溢不要緊、ZeRO 與模型平行的區分、「慢慢訓練或根本訓練不了」、5D parallelism、FA 3/4 對應 Hopper/Blackwell、TTLT 較少用來評系統、輸出價約 5 倍、cached 約 1/10、log 座標、B=16、G 的 grid search、MLA 可與 GQA 二選一、MTP 第一個頭當驗證者、Artificial Analysis 三分之二版面）都在字幕裡找得到。2025 期中考 III.3／III.5／III.6／IV.10 題號正確。H100 BF16 稠密 989 TFLOPS（頁面 1,979 為含 sparsity）、3.35 TB/s 正確。vLLM 文件原句「medium-to-low QPS (queries per second), memory-bound workloads」存在。
- **自擬數值**重算：逐塊 softmax 21.547、TTLT 10.48 s、ZeRO 120 GB→1.875 GB、KV cache 128 KiB/token 與 16 GiB、Leviathan 3.36、spec 例 0.7／(0,1)／0.6 皆正確。
- **教學品質**：每節有時間連結、機制、例子與自我檢查（含判準）；本文例子與本文整理表都有標示。課表上沒講的主題（量化、continuous batching、kernel 細節）有明說，沒有把預寫內容當課堂內容。
- **KaTeX**：本篇 `$$` 公式都在 details 外；details 內只有行內 `$...$`（逐塊表格）與 code block。實際渲染 10 個 katex-display、0 個 katex-error，無殘留 `$$`。

### 修正（中英同步）

1. roofline 段的學生提問：原寫「為什麼不乾脆把 SRAM 做大」，字幕是「頻寬既然是瓶頸，為什麼不做快一點」，講者答元件佔晶片面積、要取捨、理想上 SRAM 與運算單元越多越好。依字幕改寫。

### 未改、提醒

- p125 的「Qwen3.8-Flash-Next 用 G = 2」來自講者口述與投影片引用，未另查模型卡；正文寫法是轉述講者，可接受。
- `2026-09-29-cme295-course-overview{,-en}.md` 第 131 行仍稱 order 10–13 為「課前預寫版」，不在本次範圍。
