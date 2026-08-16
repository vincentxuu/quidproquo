# CS230 Autumn 2025 — 來源清單

playlist：https://www.youtube.com/playlist?list=PLoROMvodv4rNRRGdS0rBbXOUGA0wjdh1X
syllabus：https://cs230.stanford.edu/syllabus/ （2026-08 時仍是 2025 秋季版）

| 講次 | video id | 標題 | 長度 | 講者 |
|---|---|---|---|---|
| 1 | `_NLHFoVNlbg` | Introduction to Deep Learning | 1:00:17 | Ng |
| 2 | `DNCn1BpCAUY` | Supervised, Self-Supervised, & Weakly Supervised Learning | 1:39:48 | Katanforoosh |
| 3 | `MGqQuQEUXhk` | Full Cycle of a DL project | 1:07:04 | Ng |
| 4 | `aWlRtOlacYM` | Adversarial Robustness and Generative Models | 1:47:17 | Katanforoosh |
| 5 | `4E27qlfYw0A` | Deep Reinforcement Learning | 1:45:01 | Katanforoosh |
| 6 | `s6JVGzABKho` | AI Project Strategy | 1:15:18 | Ng |
| — | — | *（11/4 Democracy Day 停課，無 Lecture 7）* | — | — |
| 8 | `k1njvbBmfsw` | Agents, Prompts, and RAG | 1:49:54 | Katanforoosh |
| 9 | `AuZoDsNmG_s` | Career Advice in AI | 1:45:09 | Ng |
| 10 | `Ozb1AR_F5MU` | What's Going On Inside My Model? | 1:46:54 | Katanforoosh |

## 重建逐字稿

`raw/` `txt/` 不入庫（816KB，YouTube 自動字幕）。重建方式：
用 firecrawl scrape 抓上表 video id 的 YouTube 頁面存成 `raw/L0N.raw`，再跑 `python3 extract.py`。

## 已知的來源問題

- **syllabus 的 Lecture 6 條目沒更新**：寫的是職涯／論文閱讀／醫療客座配 fall_2024 投影片，
  但實際影片是 AI Project Strategy。**一律以影片為準。**
- Lecture 8、9 的投影片放在 `fall_2025/7/`、`fall_2025/8/` 目錄下，編號比講次少 1，
  是停課後講次順延但目錄沒改的痕跡。
- 逐字稿是自動字幕，人名與專有名詞常錯（例：Awni Hannun 被聽成 Honan/Hanun）。
  引用人名、論文名、數字前必須另外查證。
