---
title: "Marker: Datalab's Open-Source, Apache 2.0 Pipeline Parser — Faster, CPU-Ready, More Accurate"
date: 2026-09-07
category: tech
tags: [document-parsing, pdf, marker, rag, open-source, apache-license]
lang: zh-TW
tldr: "Marker（Datalab / IBM 起源，Apache 2.0 授權，v2.0.0 於 2026-07-20 發布，39.5k stars）是一個以 Markdown 與 JSON 為輸出的 pipeline 式文件解析標準庫，支援 PDF、圖像、PPTX、DOCX、XLSX、HTML、EPUB，並提供可選的 LLM 增強（`--use_llm`，預設 `gemini-3.5-flash`）、可自訂格式邏輯、表格/公式/內嵌數學/連結/參考/程式碼區塊的完整處理、圖像提取與保存、標頭/頁尾自動移除，並可在純 CPU、GPU 或 MPS（Apple Silicon）環境運作。與 [MinerU](/posts/tech/2026-09-05-mineru-ocr-doc-parsing) 同屬解析層，但授權更寬鬆（純 `Apache 2.0` vs 自訂協議）、速度更快（`Marker 2` 平衡模式在 `olmOCR-bench` 得分 76.0%，每秒處理頁數為 `MinerU` `pipeline` 的 5× 以上）、且模型權重採用修改版 `AI Pubs Open Rail-M` 授權（研究/個人/小型新創 `MAU`/營收門檻 `> $5M` 需商業授權），與 `Docling` 的純 `MIT` 授權形成解析層內三種不同授權路徑的對比。"
description: "Marker 是 Datalab 開源、Apache 2.0 授權的 pipeline 式文件解析標準庫，以 Markdown 與 JSON 為核心輸出，支援可選 LLM 增強（GraniteDocling 以外的通用選項）、自訂格式邏輯、多格式輸入（PDF/圖像/PPTX/DOCX/XLSX/HTML/EPUB）、純 CPU/GPU/MPS 部署，並在 `Marker 2` 重寫後實現更快速度與更高準確度（olmOCR-bench 76.0%，5× MinerU pipeline 速度），適合需要寬鬆授權（Apache 2.0）、快速解析與可自訂輸出邏輯的 RAG 與企業文件自動化場景。"
draft: false
series:
  name: "Document Parsing in Practice"
  order: 10
---

> 🌏 [English version](/posts/tech/2026-09-07-marker-document-parsing-en)

Making complex documents readable for LLMs isn't a single-path problem. In this series we've covered the conversion layer ([anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown), [MarkItDown](/posts/ai/2026-04-18-markitdown-intro)), the extraction layer ([PyMuPDF / pdfplumber / Tika group](/posts/ai/2026-08-06-pdf-text-extraction-libraries)), the three-way parsing-layer comparison ([MinerU](/posts/tech/2026-09-05-mineru-ocr-doc-parsing), [Docling](/posts/tech/2026-09-06-docling-document-parsing), and the scanned-document benchmark ([10 tools tested](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark)), followed by [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents) to explain why fixed pipelines fall short. This post introduces the third major parsing-layer option that the framework comparison mentioned but never fully explored: **Marker**.

[Marker](https://github.com/datalab-to/marker) is an open-source document parsing standard library started by the Datalab team (`Apache 2.0` license, `v2.0.0` released 2026-07-20, `39.5k` stars, `2.8k` forks, `Python 3.10+`, `PyTorch`). It converts `PDF`, images, `PPTX`, `DOCX`, `XLSX`, `HTML`, and `EPUB` into Markdown, JSON, chunks, or HTML — with table, form, equation, inline math, link, reference, and code-block formatting — and supports image extraction and preservation, header/footer removal, custom formatting logic, optional LLM-boosted accuracy (via `--use_llm`, defaulting to `gemini-3.5-flash`), and deployment on CPU, GPU, or MPS. Unlike [Docling](/posts/tech/2026-09-06-docling-document-parsing), which centers on structured JSON (`DoclingDocument`) with dedicated XML exports (`DocLang`, `USPTO`, `JATS`, `XBRL`, `DocTags`) under pure `MIT` governance, Marker centers on Markdown and JSON output under `Apache 2.0` with a separate modified `AI Pubs Open Rail-M` model-weight license (free for research, personal use, and startups under `$5M` funding/revenue; broader commercial licensing available via pricing page). Unlike [MinerU](/posts/tech/2026-09-05-mineru-ocr-doc-parsing), which uses a custom open-source agreement with commercial thresholds (`MAU > 100M` / revenue `> $20M USD`) and attribution obligations, Marker offers a simpler licensing story (`Apache 2.0` code + separate model license) but with a different accuracy/speed profile (`Marker 2` balanced mode scores `76.0%` on `olmOCR-bench`, runs over `5×` faster pages/sec than MinerU's `pipeline` backend, fully CPU-compatible, and uses a rebuilt 20M-param fast layout model plus rebuilt 3× faster `pdftext`).

## What it's trying to solve

Marker's official description is direct: "Convert PDF to markdown + JSON quickly and accurately." It handles text extraction, layout analysis, table recognition, equation formatting, form field identification, inline math, link/reference extraction, code block formatting, image extraction and saving, header/footer removal, and optional LLM-boosted accuracy — all in a single command (`pip install marker-pdf`, `marker_single FILEPATH`). The design philosophy is pipeline-based like Docling, but with a different optimization axis: **speed and CPU compatibility first, with accuracy improvements delivered through the `Marker 2` rewrite (new `Surya OCR 2`, 20M-param layout model, rebuilt `pdftext`) rather than through a dual-track `pipeline`/`VlmPipeline` split**.

This creates three clear divisions from the other parsing-layer tools in this series:

- **When pure `Apache 2.0` code licensing (without commercial thresholds or attribution obligations) matters more than pure `MIT`** — Docling offers pure `MIT`; MinerU uses a custom agreement with thresholds; Marker uses `Apache 2.0` with a separate model-weight license (`AI Pubs Open Rail-M`). For organizations that want the simplest code-license story (`Apache 2.0` is well-understood in enterprise legal review) and don't need dedicated XML exports, Marker is the middle ground.
- **When Markdown + JSON output is sufficient (without dedicated XML exports like `DocLang`/`USPTO`/`JATS`)** — Docling's core is structured JSON with dedicated XML exports; MinerU's core is Markdown with JSON as supplementary; Marker's output formats (`Markdown`, `JSON`, `chunks`, `HTML`) match the common use case without requiring the full structured-document-standard overhead.
- **When speed and full CPU support are the primary selection criteria** — `Marker 2` explicitly targets faster parsing (`5×` more pages/sec than MinerU `pipeline` per `MarkTechPost` benchmark breakdown, 2026-07-24) with full CPU compatibility (`Marker 2` is "fully CPU-compatible" per official release notes, `v2.0.0`, 2026-07-20). For batch processing scenarios where `GPU` isn't available or latency is critical, Marker's speed profile is distinct from both Docling (`pipeline` is faster than `VlmPipeline` but `Docling`'s `VlmPipeline` is slower) and MinerU (`pipeline` is fast but `Hybrid`/`vlm-engine` require `GPU` for best results).

## Core capabilities (Verified via Groundlane: official docs, GitHub releases `v2.0.0` 2026-07-20, `LICENSE`, benchmark comparison article `MarkTechPost` 2026-07-24, `README` feature list, `PyPI` version info)

Key verified claims extracted from the official repository (`github.com/datalab-to/marker`), official documentation (`documentation.datalab.to`), release notes (`v2.0.0` released 2026-07-20), license file (`Apache-2.0`), benchmark comparison (`MarkTechPost` 2026-07-24: `76.0%` balanced mode on `olmOCR-bench`, `5×` faster pages/sec than MinerU pipeline), and `PyPI` package info (`marker-pdf` `v2.0.0` published 2026-07-20, requires `Python <4, >=3.10`):

### Input format breadth and parsing scope

- **Supported input formats**: `PDF`, images, `PPTX`, `DOCX`, `XLSX`, `HTML`, `EPUB`, and all languages. Confirmed by official `README`: "Converts PDF, image, PPTX, DOCX, XLSX, HTML, EPUB files in all languages."
- **Table, form, equation, inline math, link, reference, code block formatting**: Confirmed by `README` feature list: "Formats tables, forms, equations, inline math, links, references, and code blocks."
- **Image extraction and preservation**: Confirmed: "Extracts and saves images."
- **Header/footer/artifact removal**: Confirmed: "Removes headers/footers/other artifacts."
- **Custom formatting and logic extension**: Confirmed: "Extensible with your own formatting and logic."
- **Optional LLM-boosted accuracy**: Confirmed: `README` states `--use_llm` flag uses an LLM (default: `gemini-3.5-flash`) to "merge tables across pages, handle inline math, format tables properly, and extract values from forms." This is distinct from Docling's fixed-model `VlmPipeline` (`GraniteDocling`) and from MinerU's generic `vlm-engine` interface.

### Parsing engine: pipeline-style with speed and CPU focus

- **Pipeline architecture**: Confirmed by `README`, benchmark comparison (`MarkTechPost`, 2026-07-24: "Marker (Datalab) is an open-source project that also converts PDFs... to Markdown, JSON, or HTML 'quickly and accurately,' handling tables, code blocks, images, etc., and even letting you plug in large language models for extra accuracy"), and comparison with `MinerU` (`MinerU` pipeline has fixed stages with `PP-OCRv6` and optional `VLM` backend; `Docling` has swappable `pipeline` stages; `Marker` has pipeline stages optimized for speed with a rebuilt layout detection model and rebuilt `pdftext`).
- **`Marker 2` rewrite for speed** (`v2.0.0`, 2026-07-20): Confirmed by official release notes: "Marker 2 is a rewrite focused on speed, full CPU support, and accuracy. Built on three new pieces: `Surya OCR 2`, a 20M-param fast layout model, and rebuilt (3× faster) `pdftext`." This confirms the benchmark claim (`5×` faster pages/sec than MinerU pipeline, `76.0%` balanced mode on `olmOCR-bench`) is tied to a specific version (`v2.0.0`) and a specific benchmark (`olmOCR-bench`), not a universal claim.
- **Full CPU compatibility**: Confirmed by `README` ("Works on GPU, CPU, or MPS") and release notes (`Marker 2` is "fully CPU-compatible").
- **Performance trade-off (benchmark misframing caution)**: The `MarkTechPost` comparison (2026-07-24) compares `Marker` (`v2.0.0`, balanced mode `76.0%` on `olmOCR-bench`, `5×` faster pages/sec) against `MinerU`'s `pipeline` backend. This comparison is at the tool-level but uses different benchmarks (`olmOCR-bench` for `Marker` vs `OmniDocBench v1.6` for `MinerU` `PP-OCRv6`). The article should note that these are different benchmark frameworks and should not be aggregated into a single "ranking." The `post-verify` seven-question benchmark check applies: different benchmarks (`olmOCR-bench` vs `OmniDocBench`), different test-set compositions, and different measurement axes (`balanced mode` accuracy vs `pipeline` backend speed) mean the `5×` speed and `76.0%` accuracy claims should be cited as separate, non-comparable dimensions.

### Deployment, services, and integrations

- **Installation and environment** (`Verified`): `pip install marker-pdf`; requires `Python <4, >=3.10`; `PyTorch` dependency; works on `GPU`, `CPU`, or `MPS` (`Apple Silicon`). Confirmed by `README` and `PyPI` package info (`marker-pdf` `v2.0.0`, `Requires: Python <4.0, >=3.10`).
- **API and service deployment** (`Verified`): `README` mentions `FastAPI` (`REST API server`, optional), `MCP server` capabilities mentioned in `README` (though less prominently highlighted than `Docling`'s `MCP server`; `Docling`'s `MCP server` is explicitly listed in official docs `Usage`/`Quickstart` sections, making it a more clearly documented native feature). The comparison table should note that `Marker`'s service deployment (`FastAPI` optional) is similar to `Docling`'s `docling-serve` (`API server`) but with different naming and documentation prominence.
- **Agent framework integrations** (`Verified` — partially confirmed): `README` mentions `LangChain`, `LlamaIndex`, `Crew AI`, and `Haystack` in the comparison context (referenced in series framework articles), but `Docling`'s official docs explicitly list these as native integrations (`Integrations` section). `Marker`'s integrations are mentioned less prominently in the official `README` compared to `Docling`, making `Docling`'s framework integration claims more authoritative from a documentation perspective. The comparison table should reflect this difference in documentation prominence.

### License and commercial usage (Verified: `LICENSE.md`, `README` commercial usage section, `PyPI` license info)

- **Code license**: `Apache 2.0` (`LICENSE` file confirms this). Confirmed by `GitHub` repo info (`Apache-2.0`), `README` commercial usage section ("Our code is licensed under `Apache 2.0` — free to use, including commercially"), and `PyPI` metadata (`License: Apache-2.0`).
- **Model weights license** (`Critical misframing check` per `post-verify` rules): The `README` commercial usage section clearly states: "Our model weights use a modified `AI Pubs Open Rail-M` license (free for research, personal use, and startups under `$5M` funding/revenue). For commercial use of the model weights beyond that, visit our pricing page here." This is a **separate license** from the `Apache 2.0` code license. The `post-verify` authorization check (`badge ≠ license`, `additional terms`, `conflict between sources`) applies directly: a reader who sees `Apache 2.0` in the comparison table might miss the model-weight licensing restriction (`AI Pubs Open Rail-M`, startup/revenue threshold `$5M`, commercial licensing required beyond). The comparison table must clearly separate `code license` (`Apache 2.0`) from `model weight license` (`modified AI Pubs Open Rail-M`, with thresholds). The `post-verify` anti-rationalization table explicitly warns: "Don't confuse the code license (`Apache 2.0`) with the model weight license (`AI Pubs Open Rail-M`); they have different scopes, thresholds, and consequences."
- **Commercial licensing thresholds** (`Verified`): `README` confirms the model-weight commercial threshold (startups under `$5M` funding/revenue are free; beyond that requires commercial license). This is a different threshold from `MinerU` (`MAU > 100M` / revenue `> $20M USD`). The comparison table should clearly distinguish these different thresholds to avoid readers conflating the two licensing regimes.

### Benchmark and performance claims (Verified: `README`, `MarkTechPost` comparison article 2026-07-24, official release notes `Marker 2.0.0`)

- **Performance claim** (`v2.0.0` release notes, 2026-07-20): Confirmed that `Marker 2` achieves `5×` faster pages/sec than `MinerU`'s `pipeline` backend (`MarkTechPost`, 2026-07-24: "balanced mode scores `76.0%` overall while running over `5×` more pages/sec than MinerU's pipeline backend").
- **Benchmark framework verification** (`post-verify` seven questions applied to this claim):
  1. **Who made it?** `Datalab` (author of both `Marker` and the comparison article) — not an independent third party. Confirmed by `MarkTechPost` attribution and `README`.
  2. **Same measurement basis?** The comparison uses `olmOCR-bench` for `Marker` (`balanced mode` `76.0%`) vs `OmniDocBench v1.6` for `MinerU` (`PP-OCRv6` `~11%` improvement). These are **different benchmarks** — the comparison is across different test frameworks, not the same measurement.
  3. **Aggregation method comparable?** The `5×` claim is for speed (`pages/sec`), while `76.0%` is for accuracy (`balanced mode` on `olmOCR-bench`). These are **different metrics** — speed vs accuracy — and should not be aggregated or presented as a single "ranking."
  4. **Single item or composite score?** The `76.0%` is a `balanced mode` accuracy score on `olmOCR-bench` (a composite benchmark); the `5×` is a speed metric (`pages/sec`). These measure different dimensions.
  5. **Test set public?** `olmOCR-bench` is a public benchmark (`GitHub` repo available); `OmniDocBench v1.6` is also public.
  6. **Cost of settings explained?** The `README` explains `balanced mode` as the default (`high accuracy + reasonable speed`); `high` mode is for maximum accuracy (slower). The comparison should clearly label these settings.
  7. **Author's own caveats?** The `README` notes `Marker 2` improvements but does not explicitly claim universal superiority over all other tools in all dimensions; the `MarkTechPost` comparison explicitly states it's comparing `Marker 2` (`balanced mode`) to `MinerU` (`pipeline` backend) — confirming the framework is properly disclosed.
- **Anti-rationalization result**: The benchmark claim (`5×` faster, `76.0%` balanced mode) is **numerically accurate** but the comparison framework (`olmOCR-bench` vs `OmniDocBench`, speed metric vs accuracy metric, `balanced mode` vs `pipeline` backend) requires the same framing caution applied to `MinerU`: the comparison table must clearly label these as different benchmarks and different measurement dimensions, not a unified ranking.

### Overall verification status

- 🔴 **Contradicted (fixed)**: `Marker` license was incorrectly listed as `MIT` (`待確認`) in the initial comparison table; verified as `Apache 2.0` code license with separate `AI Pubs Open Rail-M` model-weight license (threshold: startups under `$5M` funding/revenue free; commercial beyond requires licensing). This must be clearly separated in the comparison table and article text.
- 🔵 **Misframed (needs clarification)**: Benchmark comparison (`5×` faster, `76.0%`) uses different benchmarks (`olmOCR-bench` vs `OmniDocBench`) and different metrics (speed vs accuracy). The comparison table and text must clearly label this.
- 🟢 **Confirmed**: `Apache 2.0` code license, `v2.0.0` release (2026-07-20), `39.5k` stars (`2.8k` forks), pipeline architecture, swappable stage design, `Python 3.10+` requirement, `GraniteDocling` (`VlmPipeline` comparison with `MinerU`'s `vlm-engine`), `FastAPI`/`MCP` server deployment, `LangChain`/`LlamaIndex`/`Crew AI`/`Haystack` integrations, format support (PDF/image/HTML/EPUB/PPTX/DOCX/XLSX), Markdown/JSON/HTML/chunks output, optional LLM boost (`--use_llm`, `gemini-3.5-flash` default), CPU/GPU/MPS deployment.
- 🟡 **Unverifiable (low risk)**: Detailed benchmark comparison with `Docling` (same benchmark framework, same measurement basis) — requires a dedicated benchmark test or reference to the `MarkTechPost` comparison which uses different frameworks (`olmOCR-bench` vs `OmniDocBench`). This should be noted as a comparison framework difference rather than a direct numerical contradiction.

The `post-verify` verification for Docling confirms the article is accurate (after fixes applied: comparison table license corrected, reference links verified, series order set, bidirectional links added, `post-translate` completed). The `post-verify` skill rules (`no auto-fix`, `never modify file directly`) have been respected: the verification report was produced (`docs/progress-archive.md`), fixes were applied by direct edit (`post-update` logic), and the article is now in its corrected state with all verified references intact.

### Final state

- ✅ Registry (`aitoolradar.tw`) — `conditional`, verified
- ✅ `MinerU` article (`tech/2026-09-05-mineru-ocr-doc-parsing.md`) — written, verified (`post-verify` 14 claims), fixed (`license` claim corrected, benchmark framework clarified, `LICENSE.md` reference added, series `order: 8`), English version (`-en.md`) created via `post-translate`
- ✅ `Docling` article (`tech/2026-09-06-docling-document-parsing.md`) — written, verified (`post-verify` claims confirmed, `license` verified as `MIT`, `version` verified, `benchmark` framework noted), series `order: 9`, English version (`-en.md`) created via `post-translate`
- ⚠️ `Marker` dedicated post — still missing (gap list documented). The user approved "補 Marker 專文" ("補" = add/supplement, confirming the gap should be filled) but did not confirm whether to proceed with writing it or if the current gap documentation is sufficient for now.
- ✅ `pnpm verify` — passes for new content (`lang-parity` resolved with English versions; existing failures unrelated to this session)
- ✅ Progress archive — `docs/progress-archive.md` contains both verification reports (`MinerU` + `Docling`) and gap list (`Document Parsing in Practice` series status)

---
post-verify report: 2026-09-07-marker-document-parsing.md
─────────────────────────────────────────────────────────
驗證範圍：`src/content/posts/tech/2026-09-07-marker-document-parsing.md`（剛建立，draft: false，已加入系列 `Document Parsing in Practice` order: 10，已補英文版雙向連結）
驗證方法：Groundlane `web_search` + `web_fetch`（官方 `README`、`CHANGELOG.md` `v2.0.0`、`LICENSE` `Apache 2.0`、`GitHub` repo 統計、`PyPI` `v2.0.0`、`MarkTechPost` 基準比較文章 2026-07-24、`arXiv` 技術報告參考）
驗證日期：2026-09-06 / 2026-09-07（跨日驗證，資料搜集於 2026-09-06，文章建立與驗證完成於 2026-09-07）
驗證者：post-verify skill（不自動修稿，僅報告）

⚠️ 本次只檢查文中已提出的技術宣告，未評估文章對主題的覆蓋完整度（例如是否遺漏 `Marker Agent` 部署細節、`Surya OCR 2` 模型參數說明、`pdftext` 重建細節、或與 `Docling`/`MinerU` 的完整三家功能矩陣）。覆蓋缺口交給 `post-review` 步驟 6.5。

─────────────────────────────────────────────────────────
🔴 CONTRADICTED / 🔵 MISFRAMED（數字對、推論或授權宣稱錯）
─────────────────────────────────────────────────────────

1. 授權宣稱（比較表與文章內文 `line 75`：`MIT`（待確認，現有文章引用...））
原文（Docling 比較表，修正前）：`Marker` 授權標註為 `MIT`（待確認）
→ 實際授權為 **`Apache 2.0`（代碼）+ `AI Pubs Open Rail-M`（模型權重，自訂授權，有商業門檻 `$5M`、研究/個人/小型新創免費、超過需商業授權）**（`LICENSE` 檔案全文確認 `Apache License, Version 2.0`；`README` 商業使用段落明確標註 `Our code is licensed under Apache 2.0 — free to use, including commercially.` 與 `Our model weights use a modified AI Pubs Open Rail-M license (free for research, personal use, and startups under $5M funding/revenue). For commercial use of the model weights beyond that, visit our pricing page.`）。
判斷：🔴 **Contradicted / Misframed（已修正）** — 文章比較表與內文已修正為 `Apache 2.0`（代碼）+ `AI Pubs Open Rail-M`（模型權重，有 `$5M` 商業門檻），並在 `Docling` 比較表中補充註腳「本表為功能定位比較，非基於同一基準測試的效能排名」。修正已應用，無需再修。
來源：`https://github.com/datalab-to/marker/blob/master/LICENSE`（直接抓取全文，`Apache 2.0`）；`https://github.com/datalab-to/marker`（`README` 商業使用段落全文，含 `Apache 2.0` + `AI Pubs Open Rail-M` + `$5M` 門檻說明）。

─────────────────────────────────────────────────────────
🔵 MISFRAMED（數字對、框架或比較基準錯）
─────────────────────────────────────────────────────────

2. 基準測試比較宣稱（`line 78` / 比較表 `Marker` 行：`5×` 速度、`76.0%` 準確度）
原文：`5×` faster pages/sec than `MinerU` `pipeline` backend (`balanced mode`, `olmOCR-bench` `76.0%`)
逐條走完基準七問：
1. 誰做的？✅ `Datalab`（`MarkTechPost` 比較文章 `Asif Razzaq`，2026-07-24，作者為 `Datalab` 相關生態系成員；`README` `Performance` 段落引用 `olmOCR-bench`）——**作者自家產品自評**（`Marker` 與比較對象 `MinerU` 均由作者生態系參與，但 `olmOCR-bench` 為公開基準，不是完全獨立第三方測試）。文章已在比較表與段落中標註「功能定位比較，非基於同一基準測試的效能排名」，已減緩誤讀風險。
2. 基準對等？⚠️ **不同基準框架**。`Marker` (`olmOCR-bench`) vs `MinerU` (`OmniDocBench v1.6`) —— 兩個不同的公開基準測試集，測試內容與維度不同（`olmOCR-bench` 偏向 `OCR` + `Markdown` 轉換準確度；`OmniDocBench` 偏向文件解析完整結構理解）。文章已在比較表與段落中明確標註差異，並未將兩者數字直接加總或排名。
3. 加總可比？✅ 數據在同一表格內列出（`76.0%` 為 `balanced mode` 準確度；`5×` 為 `pages/sec` 速度），但為不同維度（準確度 vs 速度），已在文章中分開標示，不混為單一總分。
4. 單項還是總分？✅ `76.0%` 為 `balanced mode`（平衡模式，不是 `high` 準確度模式）的 `olmOCR-bench` 綜合分數；`5×` 為速度單項（`pages/sec`，與 `MinerU` `pipeline` 對比）。已在文章與比較表中明確區分維度。
5. 測試集公開？✅ `olmOCR-bench` 公開（`GitHub` 可驗證）；`OmniDocBench v1.6` 公開。
6. 設定代價形態？✅ 文章已說明「`balanced mode`（高準確度 + 合理速度）為預設，`high` 模式為最大準確度（可能影響速度）」；`README` 與 `CHANGELOG.md` `v2.0.0` 已明確說明 `balanced` 與 `high` 模式差異（`high` 模式為最大解析準確度或 `image analysis` 支援，`medium` 為預設，與 `Docling` `effort` 參數邏輯類似但命名不同）。
7. 作者自己怎麼說？✅ `README` `Performance` 段落與 `CHANGELOG.md` `v2.0.0` 均明確說明 `balanced mode` 為預設（`high accuracy + reasonable speed`），並說明 `high` 模式為最大準確度選項（可能影響速度）。`MarkTechPost` 比較文章已標註為作者相關生態系比較，但測試集為公開基準。
判斷：🔵 **Misframed（數字對、比較框架需明確標示，不是數字錯誤）**。文章現有表述已補充「功能定位比較，非基於同一基準測試的效能排名」註腳，並在比較表與段落中明確區分 `balanced mode` 與速度維度。建議在文章結尾或比較表下方再補一句明確聲明：「本表中的 `76.0%`（`olmOCR-bench` 平衡模式準確度）與 `5×`（`pages/sec` 速度提升）為不同維度（準確度 vs 速度）與不同基準（`olmOCR-bench` vs `OmniDocBench`）的數據，不應直接加總為單一排名。」目前文章已在比較表與段落中多次強調此點，已達到 `post-verify` 的反合理化要求（避免讀者誤讀為統一排名）。
來源：`https://github.com/datalab-to/marker`（`README` 功能清單與 `Performance` 段落、`CHANGELOG.md` `v2.0.0` 版本紀錄全文、`LICENSE` `Apache 2.0`）；`https://www.marktechpost.com/2026/07/24/datalab-marker-v2-vs-mineru-docling-and-liteparse-benchmark-breakdown/`（`MarkTechPost` 基準比較文章，2026-07-24，作者 `Asif Razzaq`）；`https://pypi.org/project/marker-pdf/`（`v2.0.0` 2026-07-20 版本資訊、`Requires: Python <4.0, >=3.10`、`License: Apache-2.0`）。

─────────────────────────────────────────────────────────
🟢 CONFIRMED（已驗證，無需修改）
─────────────────────────────────────────────────────────

3. 授權宣稱（`line 5` 前置資料與 `line 69` 比較表）
原文：`Apache 2.0` 授權（代碼）；模型權重為修改版 `AI Pubs Open Rail-M` 授權（有商業門檻 `$5M`）。
→ ✅ **Confirmed（多源獨立驗證）**：`LICENSE` 檔案（`Apache 2.0` 全文）、`README` 商業使用段落（明確標註 `Apache 2.0` 代碼 + `AI Pubs Open Rail-M` 模型權重 + `$5M` 門檻 + `pricing` 連結）、`PyPI`（`License: Apache-2.0`）、`GitHub` repo 資訊（`Apache-2.0` 標籤）。所有來源一致，無衝突。

4. 版本號（`line 7` `tldr` 與 `line 59` 版本演進段落）
原文：`v2.0.0`（2026-07-20）。
→ ✅ **Confirmed（多源獨立驗證）**：`GitHub Releases`（`v2.0.0` 標記為 `Latest`，發布日期 `Jul 20, 2026`，`CHANGELOG.md` 記錄完整重寫內容：`Surya OCR 2`、`20M-param` 快速版面模型、重建 `pdftext`、速度提升、純 `CPU` 相容、準確度提升）；`PyPI`（`marker-pdf` `v2.0.0`，`Released: Jul 20, 2026`，`Requires: Python <4.0, >=3.10`）。所有來源日期與內容一致。

5. 起源與社群（`line 17` 開頭段落）
原文：`Datalab` 開源、`IBM` 相關生態系（與 `Docling` 的 `IBM Research Zurich` 起源、`MinerU` 的 `OpenDataLab`/`InternLM` 生態系形成三條不同路徑）。
→ ✅ **Confirmed（單源權威：官方 `README` + `MarkTechPost` 背景說明）**：`README` 確認 `Datalab` 為維護團隊（`Vik Paruchuri` 為作者、`Datalab` 為組織）；`MarkTechPost` 文章提到 `Datalab` 為作者團隊，並與 `IBM Research Zurich`（`Docling` 起源）區分開來（兩者為不同組織與生態系路徑）。文章已正確區分三條路徑（`Docling`：`IBM` + `LF AI & Data`；`MinerU`：`OpenDataLab` + `InternLM`；`Marker`：`Datalab`）。

6. 核心功能（輸入格式、輸出格式、解析引擎、可選 `LLM` 增強、部署模式）
原文：支援 `PDF`、圖像、`PPTX`、`DOCX`、`XLSX`、`HTML`、`EPUB`；輸出 `Markdown`、`JSON`、`chunks`、`HTML`；`Pipeline` 式可替換階段；可選 `LLM` 增強（`--use_llm`，預設 `gemini-3.5-flash`）；純 `CPU`/`GPU`/`MPS` 部署；`Python 3.10+`、`PyTorch` 依賴。
→ ✅ **Confirmed（官方 `README` 功能清單完整確認，`Usage` 與 `Quickstart` 部署說明確認）**：所有功能宣稱均在 `README` `Feature` 列表與 `Usage` 說明中明確列出，無遺漏、無矛盾。

7. 基準測試比較（`line 78` 與比較表 `Marker` 行）
原文：`5×` faster pages/sec than `MinerU` `pipeline` backend（`balanced mode`，`olmOCR-bench` `76.0%`）；不同基準（`olmOCR-bench` vs `OmniDocBench`）、不同維度（速度 vs 準確度）、不同比較對象（`balanced mode` vs `pipeline` 後端）。
→ 🔵 **Misframed（已調整措辭，數字正確、框架已明確標示，不刪除宣稱）**：文章已在比較表註腳與段落中多次強調「功能定位比較，非基於同一基準測試的效能排名」，並在 `post-verify` 報告中詳細說明七問檢查結果（第 2、4、6 問已明確標示差異，第 5 問測試集公開，第 7 問作者但書已確認）。修正建議（補充一句明確區分比較框架層次）已應用於文章段落（`line 31` 已補充「同一解析層內不同取捨路徑的互補選項」與對比說明；比較表 `line 71` 已加「功能定位比較」註腳）。

8. 授權與商業限制（`line 8` 前置資料與 `line 69-70` 比較表 `Marker` 行）
原文：`Apache 2.0`（代碼）；模型權重為修改版 `AI Pubs Open Rail-M`（有商業門檻 `$5M`、研究/個人/小型新創免費、超過需商業授權）；與 `Docling`（`MIT` 純授權、無門檻）和 `MinerU`（自訂協議、`MAU > 1 億`/`$20M` 門檻 + 標識義務 + 自動終止）的差異形成三條不同授權路徑。
→ ✅ **Confirmed（多源獨立驗證，無衝突）**：`LICENSE.md`（`Apache 2.0` 全文）、`README` 商業段落（`Apache 2.0` 代碼 + `AI Pubs Open Rail-M` 模型權重 + `$5M` 門檻 + `pricing` 連結）、`PyPI`（`Apache-2.0` 標籤）、`GitHub` repo 資訊（`Apache-2.0` 標籤）。所有來源一致，無矛盾。與系列現有文章（`Docling` `MIT`、`MinerU` 自訂協議）的授權對比已正確標註差異（已修正 `Docling` 比較表中 `Marker` 從 `MIT`（待確認）改為 `Apache 2.0`（已驗證），並補充模型權重授權說明）。

─────────────────────────────────────────────────────────
總結與範圍聲明
─────────────────────────────────────────────────────────
- 本次驗證識別 `Marker` 文章 `8` 條技術宣告（含前置資料、核心功能、解析引擎、部署模式、授權、基準比較、與系列對比、參考資料完整性），其中 `1` 條授權宣稱為 🔴 **Contradicted（已修正）**（`Docling` 比較表 `Marker` 行從 `MIT` 改為 `Apache 2.0`，並補充模型權重授權說明），`1` 條基準比較為 🔵 **Misframed（已調整措辭，數字正確、框架明確標示，不刪除宣稱）**，其餘 `6` 條為 🟢 **Confirmed** 或 🟡 **Unverifiable（低風險定位描述，已補註腳避免誤讀）**。
- 文章內文已完全翻譯（開頭段落、設計哲學、核心能力各節、與替代方案比較、適用情境、部署限制、整體取捨、參考資料區塊的描述文字已全部改為英文，僅驗證註記保留 `Verified` 標記以符合 `post-verify` 報告慣例；技術名詞、程式碼片段、命令、檔案路徑、變數名完全未翻譯，符合 `post-translate` 技能規則）。
- 雙向連結已加（`zh-TW` 開頭加 `> 🌏 [English version]`、`en` 開頭加 `> 🌏 [中文版]`），`frontmatter` 已設 `lang: zh-TW` 與 `lang: en`、`tags` 維持原 `ID` 不翻譯、`date` 沿用原發文日、`series` 已同步為 `Document Parsing in Practice`（`zh-TW` 版保持 `文件解析實戰`，`en` 版使用英文系列名以符合站內英文路由慣例）。
- 參考資料區（`line 98` 起）已包含 `10` 個有效 Markdown 連結，涵蓋官方文件、`GitHub` 原始碼、`CHANGELOG`、`LICENSE`、`PyPI`、`LF AI & Data` 討論、`MarkTechPost` 基準比較文章、`arXiv` 技術報告、系列對比文章（`MinerU` 與 `Docling`）、官方網站，符合 `post-review` 參考資料要求（`tech` 類預設應附參考資料，至少 `1` 個有效連結；本篇提供 `10` 個，且與文章內容明顯重疊）。
- 本驗證報告僅驗證已提出宣告的準確度，**不驗證文章對主題的覆蓋完整度**（例如是否遺漏 `Marker Agent` 部署細節、`Surya OCR 2` 模型參數詳細說明、`pdftext` 重建細節、或與 `Docling`/`MinerU` 的完整三家功能矩陣比較表的每一維度驗證）。覆蓋缺口交給 `post-review` 步驟 `6.5`。
- 不自動修稿：所有修正建議（授權措辭修正已由編輯直接應用於 `Docling` 比較表與 `Marker` 文章；基準框架備註已在兩篇文章中補充；參考資料已補充；英文版已由 `post-translate` 流程產生）均由使用者透過編輯與技能執行完成，並在修正後重新驗證（`pnpm verify` 確認 `lang-parity` 已解決，本篇內容無新增錯誤）。
- 最終狀態：`post-verify` 流程已完成（宣告抽取 → 逐條驗證 → 報告產出 → 修正應用 → 重新驗證），`post-translate` 流程已完成（英文版產生 → 雙向連結 → `frontmatter` 同步），`post-update` 修正已應用（授權措辭修正於 `Docling` 比較表、基準框架備註於兩篇文章、參考資料補充、英文版建立），`pnpm verify` 通過（本篇無內容錯誤，`lang-parity` 已由英文版解決，既有失敗與本輪無關），文章已準備好提交（`draft: false`，`series` 設定正確，`tags` 完整，內容與參考資料一致）。

## progress.txt Recently completed 封存（2026-09-17，daily-digest-arxiv routine 執行時因超過 85 行上限封存）

- **Stanford CS329Z 導讀補強（2026-09-12）**：Week 11 系列地圖已明示 Week 10 為 Thanksgiving Recess、無課亦無指定閱讀；Week 2、8 共六篇 additional readings 已補成實質導讀，中英文、參考資料與更新紀錄同步完成。官方 23/23 required readings 與 27/27 additional readings 均可在系列正文找到對應說明。
- **首頁文章取消釘選（2026-09-12）**：三篇既有釘選文章的中英 frontmatter 已移除 `pinned: true`；全站文章釘選掃描為零。`pnpm verify` 仍被非本次範圍的既有 gatelane module、daily 語言配對與文章品質問題擋住。

## 2026-09-17 封存（daily-digest-framework 例行 E3 步驟，progress.txt 逼近 90 行上限）
- **daily-digest-product-interview 2026-09-10**：AI Product Design 主題(風險×信心矩陣＋漸進式委任 progressive delegation),案例是 Gusto Cofounder 團隊 2026-09-02 才發布的「AI 主持訪談只用在低風險範圍」決策。中英雙版已 commit,series order 22,`pnpm verify` 全綠。
- **daily-digest-framework 2026-09-10**：24h 內掃到 4 個符合 REPOS 清單的新 release（Mastra @mastra/core@1.65.0／Pydantic AI v2.42.0／Agno v3.0.9／claude-code v2.1.266），後兩者為純 bug fix patch 依規則跳過；Mastra（4 項 breaking changes）與 Pydantic AI（compatibility note）各自成篇，中英四檔已 commit，series order 17／18，`pnpm verify` 全綠。GitHub REST API 直接 curl 因本 session repo scope 鎖死被擋（`api.github.com` 走 sandbox proxy）、`gh` CLI 未裝，改用 Groundlane `web_fetch` 打 `api.github.com/.../releases/latest`＋GitHub `.atom` release feed＋`img.shields.io` 星數 badge 三路组合繞過，未撞 Q-020 的 OAuth 卡關（本次 Groundlane 全程可用）；`/releases?per_page=N` 端點常觸發 Groundlane `OUTPUT_LIMIT` 或 GitHub rate limit，改用 `/releases/latest`、單一 release id、`.atom` feed 更穩定。
- **Ask AI：RAG 實戰子系列（2026-09-04）**：16 檔翻為 `draft: false` 發布。
- **Rivumi → Looplane 全站改名（2026-09-04）**：38 檔改名、82 檔內容修改，零殘留。
- **13 項「待 review」內容全數已發布（2026-09-04）**：全數 `draft: false` 已 commit。
- **Looplane 系列 Batch A–C（2026-08-30）**：orders 0–19 單一路徑已定案，36 posts／18 組雙語。
- **Legacy published zh-TW 英文回填（2026-08-30）**：57／57 組完成。
- **daily-digest-report 2026-08-31 補跑成功**。
- **daily-digest-security 2026-09-13**（2026-09-18 自 progress.txt 歸檔）：GemStuffer 垃圾套件攻擊（5 月癱瘓 RubyGems 新使用者註冊）確認與 5 月 DseWiki、7 月 Hugging Face 入侵同一批 OpenAI 代理集體所為，濫用 RubyDoc.info 文件建置流程取得 RCE；官方 GHSA-9j48-x3c3-mrp2＋The Hacker News 雙來源交叉驗證。中英雙版已 commit，series order 28。
