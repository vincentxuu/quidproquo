---
title: "Benchmark 異動｜CursorBench：Claude Fable 5.1 首次上榜即登頂，Grok 4.6 跌到第三"
date: 2026-09-02
category: daily
type: digest
tags: [ai-agent, benchmark, daily, cursorbench, coding-agent]
lang: zh-TW
description: "Claude Fable 5.1 尚未經 Anthropic 官方宣布，卻已直接空降 CursorBench 冠亞軍，把原本第一的 Grok 4.6 Extra High 擠到第三"
tldr: "CursorBench 3.2：Fable 5.1 Max 73.4%（前冠軍 Grok 4.6 Extra High 70.8%）首次上榜即包辦第一、第二名；Fable 5.1 Max 比舊冠軍高 2.6 個百分點，且每題成本只要 $9.64，比前代 Fable 5 Max 的 $17.32 便宜 44%；Anthropic 官方網站目前仍只列出 Fable 5，Fable 5.1 尚無正式公告"
series:
  name: "AI Benchmark Watch"
  order: 1
---

> 🌏 [English version](/en/posts/daily/2026-09-02-benchmark-cursorbench-en)

## 異動摘要

CursorBench（Cursor 官方的 agentic coding 評測榜）今天出現本榜自 3.2 版以來最大的一次洗牌：兩個標示為「Fable 5.1」的設定檔——Max（73.4%）與 Extra High（72.8%）——同時空降第一、第二名，把前次快照（2026-08-31）的冠軍 Grok 4.6 Extra High（70.8%）擠到第三名。特別的是，Anthropic 官方網站與模型文件截至目前都還只列出 Fable 5，沒有 Fable 5.1 的正式公告——這次上榜比官方公告先到。

## 排名變化

### CursorBench 3.2 — 2026-09-02

| 排名 | 模型/設定 | 分數 | 前次分數 | 變化 |
|---|---|---|---|---|
| 🥇 | Fable 5.1 Max | 73.4% | 新上榜 | 🆕 |
| 🥈 | Fable 5.1 Extra High | 72.8% | 新上榜 | 🆕 |
| 🥉 | Grok 4.6 Extra High | 70.8% | 70.8%（🥇） | ↓2 |
| 4 | Fable 5 Max | 70.5% | 70.5%（🥈） | ↓2 |
| 5 | Opus 5 Max | 70.0% | 70.0%（🥉） | ↓2 |

來源：[cursor.com/cursorbench](https://cursor.com/cursorbench) · 快照日期：2026-09-02

原第三到第五名的分數完全沒變，純粹是被兩個新設定擠掉名次——這次異動不是既有模型重新測分，而是新模型直接卡進最前面。

## 分析：這次洗牌代表什麼

### 技術面

這次最值得注意的不是「贏了多少分」，而是「用什麼代價贏」。CursorBench 同時公布每題平均花費：Fable 5.1 Max 每題 $9.64，比前代 Fable 5 Max 的 $17.32 便宜 44%，用的 token 也從 103,525 降到 72,060（少了 30%），分數卻還高出 2.9 個百分點（73.4% vs 70.5%）。更明顯的是 Fable 5.1 Extra High：每題只要 $6.96，比舊冠軍 Fable 5 Max 的 $17.32 便宜六成以上，分數卻更高（72.8% vs 70.5%）。這種「同代點版升級」通常只微調分數，這次卻同時做到分數上升與成本下砍，比較像是訓練或路由策略的改動，不是單純加大算力堆分數。

### 方法論面

⚠️ 需要謹慎解讀的地方：Anthropic 官方網站（[anthropic.com/claude/fable](https://www.anthropic.com/claude/fable)）與模型文件（[platform.claude.com](https://platform.claude.com/docs/en/models/fable-5/introducing-claude-fable-5-and-claude-mythos-5)）截至撰文時都只列出 `claude-fable-5`，沒有 Fable 5.1 的模型卡、定價頁或正式發布公告。「Fable 5.1」這個名字目前完全來自社群觀察——Amazon Bedrock 上出現新的模型代號、內部代稱「Melon」「Marshmallow」的早期存取（EAP）測試痕跡，多篇追蹤文章推測發布窗口落在 8 月 31 日到 9 月上旬之間。CursorBench 是 Cursor 自建、非模型廠商自測的第三方評測，可信度比廠商自報高，但目前仍是唯一觀察到這個新版本分數的公開榜單，還沒有第二個獨立來源交叉驗證，也不排除這是尚未定案的早期測試版分數。

### 產業面

如果「Fable 5.1」屬實，這代表 Anthropic 在還沒對外公告新模型的情況下，先透過第三方榜單釋出訊號——這跟先前 Opus 5 在正式發布前先以「Honeycomb」EAP 代號流出的模式一致。對正在用 Fable 5 Max 跑 coding agent 的團隊來說，這次異動的實際意義可能不是「要不要換模型」，而是「同一個模型家族的下一版，可能會用更低的成本拿到更高的分數」——如果後續官方定價維持不變，Fable 5.1 Extra High 用不到 Fable 5 Max 一半的成本就打平甚至超車，會直接改變效益／成本的選型結論。

## 今日收穫

原本以為「點版升級」（5 → 5.1）多半只是小幅調分、價格不動，但這次 CursorBench 的數據顯示，同一代模型的小版本更新也可能同時砍成本、砍 token 用量又拉分數——用更便宜的設定檔打贏上一代最貴的設定檔。評估「新版本值不值得換」時，不能只看分數有沒有漲，還要對照每題成本和 token 用量，否則會低估點版升級的實際幅度。

## 參考資料

- [CursorBench — Cursor 官方即時排行榜](https://cursor.com/cursorbench)
- [CursorBench 方法論說明 — Cursor Blog](https://cursor.com/blog/cursorbench)
- [Claude Fable — Anthropic 官方頁面（截至撰文僅列出 Fable 5）](https://www.anthropic.com/claude/fable)
- [Introducing Claude Fable 5 and Claude Mythos 5 — Anthropic 模型文件](https://platform.claude.com/docs/en/models/fable-5/introducing-claude-fable-5-and-claude-mythos-5)
- [Claude Fable 5.1 & Opus 5.1: delayed until next week — OrcaRouter](https://www.orcarouter.ai/blog/claude-fable-5-1-opus-5-1-delay-leak)
- [Fable 5.1: Release Date, Rumors, and What We Actually Know — Cellcog](https://cellcog.ai/blog/fable-5-1-release-date)
