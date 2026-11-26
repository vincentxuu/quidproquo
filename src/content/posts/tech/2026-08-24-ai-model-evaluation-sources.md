---
title: "AI 模型評測來源指南——怎麼判斷一個模型好不好用"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, benchmark, evaluation, model-selection]
lang: zh-TW
tldr: "模型廠商的自測數字不能直接信。這篇整理 2026 年最重要的獨立評測平台（Artificial Analysis Intelligence Index v5.0.1、Arena、LiveBench 2.0、Vals AI、Epoch AI）、領域 benchmark（SWE-bench、Terminal-Bench、HLE-Diamond 等）、市場熱度指標和官方來源，說明各自測什麼、怎麼解讀、偏差在哪，附上不同情境的選型該看哪些數字。"
description: "2026 年 AI 模型評測完整指南：Artificial Analysis、Arena（原 LMArena）、LiveBench、Vals AI、Epoch AI、SWE-bench、Terminal-Bench、OpenRouter Rankings 等來源的解讀方法、限制和常見陷阱"
type: guide
draft: false
glossary:
  - term: "ELO"
    def: "一種競技排名系統，透過兩兩對比的勝負紀錄算出相對實力分數"
  - term: "benchmark gaming"
    def: "模型廠商針對特定測試題目優化模型表現，導致分數膨脹但實際能力未提升"
  - term: "contamination"
    def: "測試題目洩漏進模型訓練資料，導致模型「背答案」而非真正理解"
---

> :globe: [English version](/posts/tech/2026-08-24-ai-model-evaluation-sources-en)

模型廠商發新模型時都會貼一堆 benchmark 數字，但哪些能信、哪些在灌水？這篇把 2026 年主要的評測來源拆開來看——每個來源測什麼、怎麼解讀、有什麼偏差。

目標不是列出所有 benchmark，而是讓你在看到一個模型的數字時，知道「這個數字從哪來、代表什麼、該不該當真」。

## 綜合評測平台

這五個平台試圖從不同角度給出「模型整體好不好」的答案。

### Artificial Analysis

[artificialanalysis.ai](https://artificialanalysis.ai)

**測什麼**：品質、價格、速度、延遲的綜合比較。涵蓋文字、影像、影片、語音多個模態，也追蹤各家 API 的實際吞吐量和成本。文字模型的主指標是 [Intelligence Index](https://artificialanalysis.ai/methodology/intelligence-benchmarking)，目前是 v5.0.1：9 個評測分成知識工作、程式、科學、通用四類，各佔 25%，包含 AA-Briefcase、FrontierCode-AA 2.0、Terminal-Bench 4.0、Terminal-Bench-Science、CritPt v2、AA-Omniscience、HLE-Diamond 等，多數是代理式（agentic）任務而不是選擇題。影像、影片榜則各自用 v2.1 版的 Elo 榜。

**怎麼解讀**：兩個價值。一是**價格和速度的標準化比較**：當你要選 API 供應商時，它的 output tokens/sec 和 $/1M tokens 數據比自己跑更準，因為它持續監控多個 provider 的即時表現。二是**所有模型在同一套條件下跑同一組評測**，可以直接橫向比；站上的[模型總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)與各家族文就是用它的 Intelligence Index 與 Terminal-Bench 4.0、FrontierCode 2.0 做比較。Intelligence Index 的版本一換，題組與權重就跟著換，不同版本的分數不能直接比。

**偏差**：主要測 API 模型，本地部署的模型覆蓋有限。部分評測（AA-Briefcase、FrontierCode-AA、AA-Omniscience 等）是私有題庫，外部無法重跑驗證。

### Arena（原 LMArena、Chatbot Arena）

[arena.ai](https://arena.ai)（[2026-01-28 由 LMArena 改名](https://arena.ai/blog/lmarena-is-now-arena)，網址從 lmarena.ai 搬過去；更早是 lmsys.org 的 Chatbot Arena）

**測什麼**：人類偏好。使用者同時跟兩個匿名模型對話，投票選比較好的回答，用 ELO 排名系統算出每個模型的分數。

**怎麼解讀**：ELO 分數代表「一般使用者覺得哪個模型回答比較好」。這是目前最接近「真實使用體驗」的評測——不是考試題，是人覺得好不好用。分數差距 < 20 分通常沒有統計顯著性。

**偏差**：
- **投票者偏差**：使用者傾向選比較長、比較有格式的回答，即使內容不一定更正確
- **風格 vs 正確性**：一個模型可以靠語氣好拿高分，即使事實有誤
- **提示分布偏差**：使用者提交的問題偏向日常對話，coding 和專業領域的覆蓋較薄
- **匿名洩漏**：有經驗的使用者可以從語氣猜出模型身份，影響投票中立性

儘管有這些偏差，Arena ELO 仍然是最廣泛引用的綜合排名。它的價值在於「沒有人刻意針對它優化」——不像靜態 benchmark 可以被 gaming。

### LiveBench

[livebench.ai](https://livebench.ai)

**測什麼**：2026-10 起改版為 LiveBench 2.0，從短題目改成長時間的實際工作——做簡報、寫研究報告、修 bug、做能跑好幾小時的 app——分 Agentic、Design、Coding、Browser Use、Data Analysis、Research、Reasoning 七組，並列出每個成功任務的成本。核心設計目標仍是**避免 contamination**：題目持續更換，模型不可能在訓練時背過答案；2.0 上線後一個月內就出了三個 release（2026-10-14、10-25、11-06）。

**怎麼解讀**：跟 MMLU 之類的靜態 benchmark 比，LiveBench 的分數更能反映模型的真實能力，因為題目是新的；2.0 的「每個成功任務成本」欄也能直接拿來比價效比。但也因為題目定期更換，不同 release 的分數不能直接比較——要看同一個 release 下的排名，1.x 與 2.0 更是完全不同的測驗。

**偏差**：題目設計團隊的選題偏好會影響結果。LiveBench 由 Abacus AI 維護，官網寫明結果也用來驅動它自己的 agent 產品。

### Vals AI

[vals.ai/benchmarks](https://www.vals.ai/benchmarks)

**測什麼**：各產業的實際任務。目前跑 43 個獨立評測，橫跨法律、金融、醫療、程式、數學、稅務等，每個榜都比準確率、成本與延遲。綜合指標 Vals Index 把金融、程式、法律、稅務的代理式任務，按各產業佔美國 GDP 的比重加權；另有 Finance、Legal、Science 等分項指數，以及比較同一個開放權重模型在不同推論服務商表現的 Inference Provider Index。

**怎麼解讀**：如果你的場景是法律、金融這類專業工作，Vals 的分項榜比通用指數更貼近。2026-11-19 的 Vals Index 前三是 Claude Fable 5.2（71.31%）、Gemini 4 Neon（70.87%）、Claude Sonnet 5.5（70.85%），差距在 0.5 個百分點內，實務上等於同一梯隊。站上的模型家族文也常引用它的分項分數。

**偏差**：題庫多數不公開，外部無法重跑；以美國的產業結構與法規為主，在地法規與非英語文件的覆蓋有限。

### Epoch AI

[epoch.ai/benchmarks](https://epoch.ai/benchmarks)

**測什麼**：研究機構維護的 benchmark 資料庫，追蹤 431 個模型、99 個 benchmark，部分自己跑（GPQA Diamond、FrontierMath 等），部分收錄外部結果。綜合指標 Epoch Capabilities Index（ECI）把多個 benchmark 合成一條能力刻度，2026-11 的紀錄保持者是 Claude Fable 5.2；另有 FrontierMath 系列，2026-09 推出的 FrontierMath Erdős 用 68 個未解的 Erdős 問題，要求模型用 Lean 寫出證明。

**怎麼解讀**：適合看長期趨勢——同一個 benchmark 上能力隨時間、算力、開放程度怎麼變。ECI 換成貝氏模型後會附不確定區間，比較兩個模型時先看區間有沒有重疊。

**偏差**：新模型剛發佈時可能只有 Epoch 自己的少數評測，ECI 會隨更多結果進來而調整；Epoch 的官網也註明首發時的紀錄是依發佈前測試，可能變動。

## 領域 Benchmark

綜合平台告訴你「整體好不好」，領域 benchmark 告訴你「做某件事行不行」。

### SWE-bench / SWE-bench Verified

[swebench.com](https://www.swebench.com)

**測什麼**：從 12 個 Python 開源專案（Django、Flask、scikit-learn 等）擷取真實的 GitHub issue，讓模型讀完整 repo 後修 bug。評判標準是修完後能不能通過對應的測試。

**SWE-bench Verified**：原版 SWE-bench（2,294 題）有些 issue 本身有歧義或測試不夠好。Verified 是人工審核過的子集（500 題），品質更高，是最常被引用的版本。官方榜另有幾個變體：Bash Only（Verified 的預設檢視，所有模型都在同一個 mini-SWE-agent 環境跑，最適合橫向比）、Lite（300 題）、Multilingual（42 個 repo、9 種語言、300 題）、Multimodal（480 題，issue 帶有圖片）。

**怎麼解讀**：高分代表模型能理解大型程式碼庫、定位 bug、寫出正確修正。但注意：原版與 Verified 只測 Python、只測 bug fix，不測新功能開發與重構；要看其他語言就看 Multilingual。廠商公告裡的 Verified 分數多半是用自己的 agent 框架跑的，跟官方榜的 Bash Only 不是同一個條件。

**偏差**：
- 原版與 Verified 只有 Python，不代表其他語言的能力
- 有些 issue 的修正方式不只一種，但只接受通過原始測試的解法
- 模型廠商可能針對這 12 個 repo 的程式風格做特別訓練

### Terminal-Bench

[tbench.ai](https://www.tbench.ai/)

**測什麼**：在終端機裡完成長任務——編譯、設定環境、除錯、跑資料處理——用測試套件判斷成功與否，報告解決率與 95% 信賴區間。目前官網的最新版是 Terminal-Bench 4.1，4.0 的榜仍並列。榜上每一筆是「模型＋agent 框架」的組合（例如 Claude Code、Codex、GitHub Copilot），並列出 token 用量與成本。

**怎麼解讀**：這是 2026 年 coding agent 最常被引用的評測之一。Artificial Analysis 把 Terminal-Bench 4.0（66 題）放進 Intelligence Index，站上的模型總覽也用它比 coding 能力。看官方榜時要注意同一個模型換框架分數就變，比較時固定框架，或改看 Artificial Analysis 用統一條件跑的版本。

**偏差**：任務偏 Linux 終端機操作，不涵蓋 IDE 內的互動式編輯；不同版本（2.x、3.0、4.0、4.1）題組不同，分數不能跨版本比。

### Aider Polyglot

[aider.chat/docs/leaderboards](https://aider.chat/docs/leaderboards/)

**測什麼**：用 Aider（AI pair programming 工具）實際測試模型的程式碼編輯能力。225 個 Exercism 練習題，涵蓋 C++、Go、Java、JavaScript、Python、Rust，模型要修改現有檔案讓測試通過。同時記錄每次測試的 API 成本。

**怎麼解讀**：設計上比 SWE-bench 更貼近日常 coding 場景——不是修大型 repo 的 bug，而是「我叫 AI 改這段 code，它改對了嗎？」。但榜上最新的結果停在 2025 年的模型（GPT-5 (high) 88%、$29），2026 年的前沿模型都沒有收錄，現在只能當歷史參考；要比現役模型改看 Terminal-Bench 或 LiveBench 的 Coding 組。

**偏差**：Aider 本身的 prompt 設計會影響結果。同一個模型在不同 coding 工具（Cursor、Copilot、Claude Code）的表現可能不同。

### HumanEval

**測什麼**：164 道 Python 程式設計題，給函式簽名和 docstring，模型寫出函式體，跑測試。OpenAI 在 2021 年推出。

**怎麼解讀**：2026 年已經嚴重飽和——頂尖模型都在 95%+ 區間，分不出差距。作為入門級 coding benchmark 仍有參考價值，但不應作為選型依據。

**偏差**：題目太簡單、只有 Python、已被大量模型訓練資料收錄。

### MMLU-Pro

**測什麼**：MMLU（Massive Multitask Language Understanding）的加強版。約 12,000 題，橫跨 14 個學科，選項從 4 個增加到 10 個，需要多步推理。

**怎麼解讀**：比原版 MMLU 更能區分頂尖模型，因為隨機猜答的正確率從 25% 降到 10%，且題目需要 chain-of-thought 推理。但它本質上還是選擇題——測的是「知道什麼」而非「能做什麼」。

**偏差**：選擇題格式有天然限制。知識型 benchmark 容易受訓練資料覆蓋度影響。

### GPQA Diamond

**測什麼**：198 道研究生等級的科學問題（物理、化學、生物）。由領域專家出題，並驗證過「有 Google 的非專家也答不出來」。

**怎麼解讀**：2026 年最難的知識推理 benchmark 之一。分數代表模型在專業科學推理上的天花板。因為題量只有 198 題，小幅分數波動可能來自隨機性。

**偏差**：只測自然科學，不測工程、社會科學、人文。題量小意味著信賴區間大。

### AIME（美國數學邀請賽）

**測什麼**：15 道數學競賽題，答案是 0-999 的整數。題目來自真實的高中數學競賽，需要多步推理和創造性解題。

**怎麼解讀**：純粹測數學推理能力。因為答案空間有限（整數），不太會受格式偏差影響。通常報告的是正確率（如 AIME 2024: 83.3%）。

**偏差**：歷年題目可能被收錄進訓練資料。2024 年的題目比較新，但以後也會被 contaminate。

### Humanity's Last Exam (HLE)

**測什麼**：Scale AI 與 CAIS 合作，由數千位各領域專家出題，跨 100+ 學科的極難問題，已發表於 Nature（Nature 649, 1139–1146）。設計目標是「人類出的最難的 AI 考試」——連領域專家都要花很久才能解。2025-01 發表時，前沿模型只拿到個位數。

**HLE-Diamond**：2026-09-22 [推出的精修版](https://lastexam.ai/blog/hle-diamond)，經過一年的清理，從原本 2,500 題的題庫（含保留題）挑出 1,000 題，分成推理與知識各 500 題，題組固定、題號穩定，不同時間的分數可以直接比。Artificial Analysis 的 Intelligence Index v5.0.1 改用 HLE-Diamond（不帶工具，含 272 道附圖題）；它原本用的是完整題庫裡 2,158 道純文字題，那組結果另外列。

**怎麼解讀**：HLE 的分數進步很快。2026 年 8 月原版 HLE 的前段約 55%（Claude Fable 5 55.5%、Claude Opus 5 54.9%）。官方公布的 HLE-Diamond 不帶工具成績，第一是 Claude Fable 5.2 74.3%，其次 GPT-6.2 Astra 66.6%、Gemini 4 Neon 65.2%；推理題普遍比知識題高。Scale 預估 Diamond 還能再撐 6 到 12 個月才飽和。

**偏差**：HLE 是「來源差異」最明顯的 benchmark 之一。原版 HLE 有全題庫、純文字子集、帶工具與不帶工具幾種跑法，2026-08 時 Artificial Analysis 用純文字題報 Claude Opus 5 約 55%，BenchLM 報同一模型 64.7%。現在又多了 HLE-Diamond，跟原版分數不能互換。看 HLE 分數時務必確認是哪個題組、有沒有帶工具、誰跑的。

## 多模態模型評測（VLM）

視覺語言模型（VLM）需要同時理解圖片和文字，評測維度比純文字模型多一層。

### MMMU / MMMU-Pro

[mmmu-benchmark.github.io](https://mmmu-benchmark.github.io/)

**測什麼**：MMMU 包含 11,500 道大學等級的多模態題目，橫跨 30 個學科（含圖表、圖片、樂譜、化學結構式等），測試模型在視覺情境下的知識推理。MMMU-Pro 是加強版——選項從 4 個增到 10 個，移除了不看圖就能答的題目。

**怎麼解讀**：原版 MMMU 2025 年後已飽和（頂尖模型 > 80%），MMMU-Pro 仍有區分度。Gemini 3.1 Pro 82%、GPT-5.4 81%、Qwen3.6 Plus 78.8%，開源最強的 Qwen3-VL-235B 69.3%——閉源在廣泛學科推理上仍領先開源約 10pp。

### MathVista

[mathvista.github.io](https://mathvista.github.io/)

**測什麼**：6,141 道視覺數學推理題——讀圖表算數、看幾何圖證明、從統計表推論。測的不只是「看懂圖」，還要「看懂之後做數學」。

**怎麼解讀**：開源模型在這個 benchmark 反超閉源——Qwen3-VL-235B 85.8% 高於所有閉源模型。這是少數開源領先的多模態 benchmark。

### DocVQA / ChartQA / OCRBench

**測什麼**：文件理解的實用能力。DocVQA 用掃描文件（發票、合約、表格）問問題；ChartQA 測圖表理解；OCRBench v2 測雙語文字辨識。

**怎麼解讀**：這些跟企業應用最直接相關。Qwen2.5-VL-72B 在 DocVQA 拿 96.4%，甚至高於 GPT-5.4 的 95%。如果你在做文件處理 pipeline，這些比 MMLU 重要得多。

## 影像生成評測

影像生成沒有像文字那樣的「客觀答案」，評測更依賴人類偏好投票和多維度自動評分。

### Arena Text-to-Image

[arena.ai/leaderboard/text-to-image](https://arena.ai/leaderboard/text-to-image)

**測什麼**：跟文字 Arena 同樣的 ELO 機制——使用者看到同一 prompt 生成的兩張圖，盲選比較好的。目前 87 個模型參與，並附每張圖的成本中位數。

**2026-11-21 Top 5**：GPT-Image-2.5 Sunburst (1429)、GPT-Image-2.6 Sunburst Medium (1412)、GPT-Image-2.5 Flare (1400)、MAI-Image-2.7 (1385)、GPT-Image-2 Medium (1382)。開放權重最高的是 Qwen-Image-2.1。

### Artificial Analysis Image Arena

[artificialanalysis.ai/image/leaderboard/text-to-image](https://artificialanalysis.ai/image/leaderboard/text-to-image)

**測什麼**：另一個獨立的圖片 ELO 排名（目前是 AA-Image-T2I v2.1），加上**每千張圖的 API 定價比較**——讓你同時看品質和成本。2026-11-23 第一是 GPT Image 2.6 Sunburst (max) 1263、$210.72/千張；同在前五的 MAI-Image-2.7 是 1215、$34.82/千張，價格約六分之一。

### Evalytic

[evalytic.ai/leaderboard](https://evalytic.ai/leaderboard)

**測什麼**：33 個模型、100 個 prompt、6 個 AI 評審（CLIP Score、PickScore、HPSv2、ImageReward、VQAScore、VLM judge）。除了整體排名，還拆出視覺品質（VQ）、prompt 忠實度（PA）、文字渲染（TR）等子維度。

**怎麼解讀**：如果你需要比較特定能力（例如「圖裡的文字渲不渲染得出來」），Evalytic 的子維度比 Arena 的單一 ELO 有用。

**偏差**：AI 評審的偏好跟人類不完全一致。自動指標（CLIP Score、NIMA、sharpness）捕捉的是技術品質，不是美學偏好。

### 傳統指標：FID / CLIP Score

**FID**（Fréchet Inception Distance）測生成圖與真實圖的分布相似度，**CLIP Score** 測圖文匹配度。這些指標在 2024 年前是主流，但 2026 年的評測共識是：它們跟人類偏好的相關性不夠高，應該作為輔助而非主要參考。

## 影片生成評測

影片生成是 2026 年競爭最激烈的戰場，排名每幾週就大洗牌。

### Artificial Analysis Video Arena

[artificialanalysis.ai/video/leaderboard/text-to-video](https://artificialanalysis.ai/video/leaderboard/text-to-video)

**測什麼**：盲目投票的 ELO 排名，分 Text-to-Video 和 Image-to-Video 兩個榜，各自再分「含音訊」和「不含音訊」。30+ 個模型，附 API 定價（$/分鐘）。目前是 v2.1 版，把 Kling 3.0 1080p (Pro) 固定在 1000 當基準點。

**2026-11-23 Top 5（T2V 含音訊，AA-Video-T2V v2.1）**：Wan 3.0 (1175)、Utopai X (1171)、MiniMax H3 768p (1163)、Hyperflow H3 (1157)、Seedance 2.5 (1156)。換到 v2.1 後分數基準變了，不能跟 2026-08 版本文引用的舊榜（當時 Wan 3.0 1244）直接比。各模型的取得方式與授權，見[影片生成模型家族](/posts/tech/2026-08-26-ai-model-family-video-generation)。

**偏差**：影片 Arena 的排名波動比文字和圖片大得多。同一個模型（如 Kling 3.0 1080p Pro）在不同時間點的 Elo 可以差 137 分、排名差 3 名，榜單改版時分數基準也會整個換掉。引用影片排名時務必帶日期與榜單版本。

### Arena Image-to-Video

[arena.ai/leaderboard/image-to-video](https://arena.ai/leaderboard/image-to-video)

**測什麼**：50 個 I2V 模型的 ELO 排名，附每支影片的成本中位數。2026-11-08 的資料是 Gemini Omni 1.2 Flash 以 1503 分領先，Seedance 2.5 720p（1494）與 MiniMax H3（1493）緊追；MiniMax H3 也是開放權重第一。

### VBench / VBench-2.0

[vchitect.github.io/VBench-project](https://vchitect.github.io/VBench-project/)

**測什麼**：學術級的自動評測框架。VBench 把影片品質拆成 16 個維度（主體一致性、動作流暢度、時間閃爍、美學品質等）。VBench-2.0（2026 年 3 月）加了 18 個維度測「物理真實性」——水倒出來有沒有正確流動、碰撞有沒有遵守慣性。

**怎麼解讀**：Arena 測人的主觀偏好，VBench 測客觀技術品質。兩者有時候不一致。開源領先的 Wan 2.2 在 VBench 拿 84.7%，但頂尖模型在 VBench-2.0 的物理動作維度只拿約 50%。

## 語音與音樂評測

### Artificial Analysis Speech Arena

[artificialanalysis.ai/text-to-speech/arena](https://artificialanalysis.ai/text-to-speech/arena)

**測什麼**：TTS 模型的盲聽 ELO 排名。使用者聽兩段同文字的合成語音，選比較自然的。2026-11-23 的第一名是 Eleven v4 Turbo 與 Eleven v4（同為 1340），其次是 StepAudio 3 TTS（1307）。

### TTS-Bench

[github.com/5uck1ess/tts-bench](https://github.com/5uck1ess/tts-bench)

**測什麼**：65 個 TTS 模型的三維度評測——速度（TTFA、RTFx）、聽感（盲聽 A/B）、客觀分數（UTMOS 自然度、WER 清晰度、SIM 聲音複製度）。三種硬體各跑一次（RTX 5090 / M4 / RTX 3090）。

**怎麼解讀**：如果你要做本地 TTS 部署，這是最實用的基準——直接告訴你哪個模型在你的硬體上跑多快、聽起來多自然。附帶的 [TTS Voting Arena](https://5uck1ess-tts-arena.hf.space) 是公開的盲聽投票。

### MINT-Bench

[arxiv.org/abs/2604.17958](https://arxiv.org/abs/2604.17958)

**測什麼**：多語言指令跟隨 TTS 的專門評測，涵蓋 10 種語言、分內容一致性／指令跟隨／感知品質三層。發現前沿商用系統在英文領先，但 Qwen3-TTS 在中文反超 Gemini。

### 語音辨識（ASR）指標

**WER**（Word Error Rate）是 ASR 的標準指標。主要評測：[OpenASR Leaderboard](https://huggingface.co/spaces/hf-audio/open_asr_leaderboard)（HuggingFace）跑 LibriSpeech、Common Voice 等資料集。Whisper Large V3 仍然是最廣泛使用的基準模型。

### 音樂生成評測

音樂生成的評測還在早期階段。主要指標：

- **FAD**（Fréchet Audio Distance）：類似圖片的 FID，測生成音樂與真實音樂的分布距離
- **MusicCaps**：Google 的音樂描述資料集，常用於文字轉音樂的匹配度測試
- **SongBench**（[騰訊, 2026](https://github.com/Tencent/SongBench)）：目前最大的歌曲生成評測，7 個維度（人聲、樂器、旋律、結構、編曲、混音、音樂性），11,717 個專家標注樣本

音樂評測的挑戰在於**主觀性極高**——同一首生成的歌，音樂人和一般聽眾的評價可能完全不同。

## Embedding 與 Rerank 評測

### MTEB Leaderboard

[huggingface.co/spaces/mteb/leaderboard](https://huggingface.co/spaces/mteb/leaderboard)

**測什麼**：Massive Text Embedding Benchmark，評測 embedding 模型在檢索、分類、聚類、語義相似度等任務上的表現。是選 embedding 模型的標準排名。

**怎麼解讀**：注意區分多語言和純英文的排名。BGE-M3 在多語言場景領先；Qwen3-Embedding 和 Voyage 在程式碼語料有優勢。

### BEIR

[github.com/beir-cellar/beir](https://github.com/beir-cellar/beir)

**測什麼**：跨領域的資訊檢索 benchmark，用 nDCG@10 測 reranker 的精度。Jina Reranker v3.5 (63.2)、Qwen3-Reranker-8B、BGE-Reranker 是主要競爭者。

**怎麼解讀**：2026 年的 RAG 金標準是「BGE-M3 或 Qwen3-Embedding 做召回 + reranker 做精排」。BEIR 的 nDCG@10 是選 reranker 的首要指標。

## 市場熱度指標

Benchmark 告訴你模型「能力」如何，市場熱度告訴你「多少人在用」——兩者不一定一致。

### OpenRouter Rankings

[openrouter.ai/rankings](https://openrouter.ai/rankings)

**測什麼**：OpenRouter 是一個 AI model 聚合 API，提供上百個模型的統一接口。Rankings 按各模型的實際 token 處理量排名（prompt + completion tokens 加總）。數據以 CC BY 4.0 授權公開，也提供 [Data API](https://openrouter.ai/docs/cookbook/administration/data-api) 讓你程式化存取。

**2026-11 週榜 Top 10**（資料截至 11/22，近 7 天）：

| 排名 | 模型 | tokens 處理量 |
|---|---|---|
| 1 | DeepSeek V4.1 Flash 1017 | 65T |
| 2 | DeepSeek V4.1 Flash | 15.4T |
| 3 | GLM 5.3 Flash (z-ai) | 12.2T |
| 4 | Hy4 flash (tencent) | 10.2T (new) |
| 5 | GPT-6 Luna | 8.31T |
| 6 | Claude Opus 5.5 | 6.97T |
| 7 | MiniMax M3.1 Flash | 4.29T |
| 8 | Kimi K3.1 Pro | 4.07T |
| 9 | Nemotron 3 Ultra (free) | 3.93T |
| 10 | MiMo-V2.6-Flash (xiaomi) | 3.7T |

**怎麼解讀**：這是最接近「市場實際採用度」的指標。注意它測的是 adoption，不是品質——官方明確說明「these rankings measure adoption, not quality」。一個模型在 benchmark 上分數很高但 OpenRouter 用量很低，通常代表定價太貴或 API 不穩定。反過來，用量高但 benchmark 分數不是最頂的模型，代表價效比好或生態系統成熟。

**偏差**：
- OpenRouter 的使用者偏向開發者和技術使用者，不代表企業內部部署的用量
- 某些廠商（如 Anthropic、OpenAI）的使用者大多直接用官方 API，不經過 OpenRouter
- 各家的 tokenizer 不同，所以跨 provider 的 token 數不能直接比較（Anthropic 的 1 token ≠ OpenAI 的 1 token）
- 免費 tier 的模型（如 Nemotron 3 Ultra free）用量可能被灌水

### HuggingFace Downloads / Likes

[huggingface.co/models](https://huggingface.co/models)

**測什麼**：開源模型的下載量和社群按讚數。可以按 pipeline_tag（任務類型）、按 7 日趨勢、按總量排序。

**怎麼解讀**：
- **Downloads**：代表實際被拉取使用的次數。包含 CI/CD pipeline 的自動下載，所以數字可能比實際使用者多
- **Likes**：代表社群關注度。新模型剛發佈時 likes 飆升不代表長期採用
- **Trending Score**：7 日加權的熱度分數，最能反映「現在什麼最紅」

注意量化版本的下載量通常比原版高（因為更多人跑得動），但這不代表量化版更好。

**偏差**：只覆蓋開源模型。下載量不等於真正在用（很多人下載了但沒部署）。

### Ollama Library

[ollama.com/library](https://ollama.com/library)

**測什麼**：Ollama 是最流行的本地 LLM 執行工具。Library 的排序和拉取量反映「本地部署最受歡迎的模型」。

**怎麼解讀**：如果你想知道「大家在自己電腦上跑什麼模型」，Ollama 是最好的指標。它的前幾名通常代表在消費級硬體上跑得順且品質可接受的模型。

**偏差**：只反映個人和小團隊的使用，企業用 vLLM / TGI / SGLang 部署的模型不會出現在這裡。

## 官方來源

### 廠商 Model Card / Blog

每個模型發佈時，廠商會在官方 blog 貼公告，附上 benchmark 數字、架構說明、定價。這些是最一手的資料，但也最需要警惕。

**怎麼讀**：
- **自測 vs 獨立複現**：廠商自己跑的 benchmark 要標注 :warning:。同一個 benchmark，不同的提示模板、溫度設定、few-shot 數量都會影響分數。只有獨立團隊（如 SWE-bench 官方、Artificial Analysis）用統一流程跑的結果才能直接比較
- **選擇性報告**：廠商只會貼表現好的 benchmark。如果一個模型的公告裡沒提 SWE-bench，很可能是因為分數不好看
- **「首次突破」的措辭**：注意「在 X benchmark 上達到 Y%」跟「在 X benchmark 上超越所有模型」是不同的。前者可能只比前代好，後者才是真的第一
- **定價要抓定價頁**：Blog 裡的定價可能是首發優惠價。去 pricing page 看有沒有分標準/batch/cached 價格

主要廠商的官方來源：

| 廠商 | 公告 | 定價 |
|---|---|---|
| Anthropic | [anthropic.com/news](https://www.anthropic.com/news) | [anthropic.com/pricing](https://www.anthropic.com/pricing) |
| OpenAI | [openai.com/blog](https://openai.com/blog) | [openai.com/api/pricing](https://openai.com/api/pricing/) |
| Google | [blog.google/technology/ai](https://blog.google/technology/ai/) | [ai.google.dev/pricing](https://ai.google.dev/pricing) |
| Meta | [ai.meta.com/blog](https://ai.meta.com/blog/) | 開源，無 API 定價 |
| xAI | [x.ai/blog](https://x.ai/blog) | [docs.x.ai](https://docs.x.ai/) |
| Mistral | [mistral.ai/news](https://mistral.ai/news/) | [mistral.ai/products](https://mistral.ai/products/) |
| DeepSeek | [api-docs.deepseek.com/news](https://api-docs.deepseek.com/news) | [api-docs.deepseek.com](https://api-docs.deepseek.com/quick_start/pricing) |
| Qwen | [qwenlm.github.io/blog](https://qwenlm.github.io/blog/) | 開源 + 通義 API |
| Cohere | [cohere.com/blog](https://cohere.com/blog) | [cohere.com/pricing](https://cohere.com/pricing) |

## 常見陷阱

### Benchmark Gaming

模型廠商知道大家看什麼 benchmark，所以會針對性優化。最常見的手段：

- 在訓練資料裡混入 benchmark 題目或類似題型
- 在推論時針對已知 benchmark 的格式做特殊處理
- 選擇性地報告對自己最有利的 benchmark 版本

**怎麼防**：看獨立複現的結果，不看自測。優先看有 contamination 防禦的 benchmark（LiveBench、HLE）。

### Leaderboard 飽和

HumanEval、原版 MMLU 已經飽和——頂尖模型都在 95%+ 區間。這時候 0.5% 的分數差距沒有實際意義，但廠商仍然會拿來宣傳「超越競品」。

**怎麼防**：看分數的信賴區間。如果兩個模型的分數在信賴區間內重疊，它們實際上沒有差異。

### Self-Reported 數字

廠商自己跑的分數和獨立團隊跑的分數經常不一致。差異來源包括：提示模板不同、溫度設定不同、few-shot 設定不同、後處理方式不同。

**怎麼防**：同一個 benchmark 只比較同一個評估者的結果。Anthropic 自測的 MMLU-Pro 不能直接跟 OpenAI 自測的 MMLU-Pro 比。

### Cherry-Picking

廠商會選最有利的比較對象。「超越 GPT-4o」聽起來很厲害，但如果比較的是六個月前的 GPT-4o 版本，而不是最新的 GPT-4o，那就是 cherry-picking。

**怎麼防**：確認比較對象的版本號和日期。「GPT-4o」可能是 2024-08-06 版、2025-02-15 版、或者 chatgpt-4o-latest，性能差距很大。

### 過時數據

AI 模型的迭代速度極快。一篇 2026 年 3 月的比較文章，到 8 月可能已經有三代新模型了。

**怎麼防**：確認文章的發布日期和引用的模型版本。優先看持續更新的來源（Artificial Analysis、Arena、LiveBench、Vals AI、Epoch AI）而非一次性的比較文章；不再更新的榜（例如停在 2025 年模型的 Aider Polyglot）也要當成過時數據。

## 選型框架：不同情境看什麼

不是每個 benchmark 都跟你的場景有關。根據你在做的事，該看的指標不同：

### 做 Agent / 工具呼叫

| 優先看 | 來源 |
|---|---|
| SWE-bench Verified（Bash Only） | 多步驟任務完成能力 |
| Terminal-Bench 4.0／4.1 | 終端機長任務解決率 + 成本 |
| Artificial Analysis FrontierCode-AA 2.0 | 真實開源 repo 的程式修改 |
| LiveBench 2.0（Agentic 組） | 長時間代理任務 + 每個成功任務成本 |
| tau-bench | 多輪工具呼叫成功率（各廠商自測） |

### 做 RAG / 搜尋

| 優先看 | 來源 |
|---|---|
| [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard)（HuggingFace） | Embedding 模型品質排名 |
| [BEIR](https://github.com/beir-cellar/beir) nDCG@10 | Reranker 檢索精度 |
| Context Window 大小 | 各廠商 model card |
| Long-context retrieval（[RULER](https://github.com/hsiehjackson/RULER)、Needle in a Haystack） | 長文檢索能力 |

### 省錢 / 高吞吐

| 優先看 | 來源 |
|---|---|
| Artificial Analysis（Price + Speed） | 標準化的 $/1M tokens 和 tokens/sec |
| Terminal-Bench 與 LiveBench 的成本欄 | 完成同一組任務的實際花費 |
| OpenRouter Rankings | 高用量模型通常是價效比好的 |

### 通用聊天 / 客服

| 優先看 | 來源 |
|---|---|
| Arena ELO | 使用者實際偏好 |
| MMLU-Pro | 知識廣度 |
| 多語言 benchmark（如 Aya 評估） | 如果服務非英語使用者 |

### 推理 / 數學 / 科學

| 優先看 | 來源 |
|---|---|
| AIME | 數學推理 |
| GPQA Diamond | 科學推理 |
| HLE-Diamond | 跨領域極限推理 |
| Epoch AI（FrontierMath、ECI） | 數學前沿與能力長期趨勢 |
| LiveBench（Reasoning 類別） | 防 contamination 的推理測試 |

### 影像生成

| 優先看 | 來源 |
|---|---|
| Arena / Artificial Analysis Image Arena | 人類偏好 ELO |
| Evalytic 子維度（TR / PA） | 文字渲染和 prompt 忠實度 |
| $/千張圖 | Artificial Analysis 定價欄 |

### 影片生成

| 優先看 | 來源 |
|---|---|
| Artificial Analysis Video Arena（帶日期） | 人類偏好 ELO，注意排名波動大 |
| VBench / VBench-2.0 | 技術品質 16+18 維度 |
| $/分鐘 | 各 provider 定價 |

### 語音合成（TTS）

| 優先看 | 來源 |
|---|---|
| Artificial Analysis Speech Arena | 人類偏好 ELO |
| TTS-Bench | 本地部署速度 + 聽感 + 客觀分數 |
| SEED-TTS-Eval | 聲音複製品質 |

### 多模態理解（VLM）

| 優先看 | 來源 |
|---|---|
| MMMU-Pro | 跨學科視覺推理 |
| DocVQA / ChartQA | 文件理解實用能力 |
| MathVista | 視覺數學推理 |

## 整體來說

沒有一個 benchmark 能告訴你「這個模型好不好」。正確的做法是：

1. **先確定你的場景**，從選型框架找到對應的 2-3 個指標
2. **看獨立評測**，不看廠商自測
3. **交叉驗證**：品質 benchmark + 市場熱度 + 你自己的測試
4. **永遠帶日期**：記錄你查到的數字是什麼時候、什麼版本的

最危險的不是選錯模型，而是用錯誤的數字選模型。

---

## 更新紀錄

- 2026-11-23：資料更新到 2026-11。Artificial Analysis 改寫為 Intelligence Index v5.0.1 的組成（9 個評測、四類各 25%），原寫的 Coding Agent Index 改為 Intelligence Index 內含的 Terminal-Bench 4.0 與 FrontierCode-AA 2.0；LMArena 改為 2026-01-28 改名後的 Arena（arena.ai）；LiveBench 改寫為 2.0（長時間實際任務、七組、每個成功任務成本），修正原本「每六個月更新」；新增 Vals AI、Epoch AI、Terminal-Bench 三節；SWE-bench 補官方榜的 Bash Only、Multilingual 等變體；Aider Polyglot 修正為 225 題、六種語言，並註明榜單停在 2025 年的模型；HLE 補 2026-09 的 HLE-Diamond 與 Artificial Analysis 改用它，刪除與事實不符的「2025 年 4 月 Gemini 3 Pro 38.3%」；影像、影片、語音榜與 OpenRouter 週榜換成 2026-11 的資料；選型框架的 Agent、省錢、通用聊天、推理各表同步更新。

## 參考資料

- [Artificial Analysis](https://artificialanalysis.ai) — AI 模型品質、價格、速度的獨立比較平台
- [Artificial Analysis Intelligence Benchmarking Methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking) — Intelligence Index v5.0.1 的評測組成與權重
- [Arena](https://arena.ai) — 基於人類偏好投票的模型 ELO 排名（原 LMArena）
- [LMArena is now Arena](https://arena.ai/blog/lmarena-is-now-arena) — 2026-01-28 改名公告
- [LiveBench](https://livebench.ai) — contamination-free benchmark，2026-10 起為 2.0 版
- [Vals AI Benchmarks](https://www.vals.ai/benchmarks) — 產業任務評測與 Vals Index
- [Epoch AI Benchmarks](https://epoch.ai/benchmarks) — benchmark 資料庫與 Epoch Capabilities Index
- [SWE-bench](https://www.swebench.com) — 真實 GitHub issue 修復的 coding agent benchmark
- [Terminal-Bench](https://www.tbench.ai/) — 終端機長任務的 agent benchmark
- [Introducing HLE-Diamond](https://lastexam.ai/blog/hle-diamond) — 1,000 題的 HLE 精修版
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/) — 跨語言程式碼編輯 benchmark，附成本數據（停在 2025 年的模型）
- [OpenRouter Rankings](https://openrouter.ai/rankings) — AI model API 聚合平台的實際用量排名
- [HuggingFace Models](https://huggingface.co/models) — 開源模型下載量、likes、trending 資料
- [Ollama Library](https://ollama.com/library) — 本地 LLM 部署的模型拉取量排名
- [MMLU-Pro (arXiv:2406.01574)](https://arxiv.org/abs/2406.01574) — MMLU 加強版，10 選項 + 多步推理
- [GPQA (arXiv:2311.12022)](https://arxiv.org/abs/2311.12022) — 研究生等級科學問答 benchmark
- [Humanity's Last Exam (arXiv:2501.14249)](https://arxiv.org/abs/2501.14249) — 數千位專家出題的極限 AI 測試
- [MMMU Benchmark](https://mmmu-benchmark.github.io/) — 11.5K 大學等級多模態題目，30 學科
- [MathVista](https://mathvista.github.io/) — 6,141 道視覺數學推理題
- [Arena Text-to-Image](https://arena.ai/leaderboard/text-to-image) — 影像生成 ELO 排名（87 個模型）
- [Arena Image-to-Video](https://arena.ai/leaderboard/image-to-video) — 圖生影片 ELO 排名（50 個模型）
- [Artificial Analysis Image Arena](https://artificialanalysis.ai/image/leaderboard/text-to-image) — 影像生成 ELO + 定價比較
- [Evalytic Image Leaderboard](https://evalytic.ai/leaderboard) — 6 評審、33 模型、多維度影像評測
- [Artificial Analysis Video Arena](https://artificialanalysis.ai/video/leaderboard/text-to-video) — 影片生成 ELO 排名（含/不含音訊）
- [VBench](https://vchitect.github.io/VBench-project/) — 影片生成 16+18 維度學術評測（CVPR 2024）
- [TTS-Bench](https://github.com/5uck1ess/tts-bench) — 65 個 TTS 模型速度 + 聽感 + 客觀分數
- [Artificial Analysis Speech Arena](https://artificialanalysis.ai/text-to-speech/arena) — TTS 盲聽 ELO 排名
- [MINT-Bench (arXiv:2604.17958)](https://arxiv.org/abs/2604.17958) — 多語言指令跟隨 TTS 評測
- [SongBench](https://github.com/Tencent/SongBench) — 歌曲生成 7 維度評測（11,717 專家標注樣本）
- [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) — Embedding 模型標準排名
- [BEIR](https://github.com/beir-cellar/beir) — 跨領域資訊檢索 benchmark
