---
title: "定價追蹤｜Claude Opus 4.8 Fast Mode 11/30 下架，轉去 Opus 5.5 不但沒變貴還降兩成"
date: 2026-11-09
category: daily
type: digest
tags: [ai-agent, pricing, daily, anthropic]
lang: zh-TW
description: "Anthropic 在 2026-10-30 的 Claude Platform release notes 宣布 Claude Opus 4.8 的 fast mode 將於 2026-11-30 下架，官方建議遷移至 Claude Opus 5.5 fast mode；新舊費率都是標準價的 2 倍，但 Opus 5.5 標準價更低，換算下來遷移後反而降價 20%"
tldr: "Claude Opus 4.8 的 fast mode（研究預覽，$10/$50 每百萬 tokens）將於 2026-11-30 下架，官方建議遷移到 Claude Opus 5.5 的 fast mode（已 GA，$8/$40）。兩者都是各自標準價的 2 倍，但 Opus 5.5 標準價本身更低，所以遷移後單次 50 輪 coding agent session 成本從 $8.00 降到 $5.70，降 28.75%。"
series:
  name: "AI Pricing Watch"
  order: 33
---

> 🌏 [English version](/posts/daily/2026-11-09-pricing-anthropic-claude-opus-4-8-fast-mode-sunset-en)

## 變更摘要

Anthropic 在 2026-10-30 的 [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview) 寫下一句話：「We've deprecated fast mode for Claude Opus 4.8, with removal on November 30, 2026. After removal, requests to `claude-opus-4-8` with `speed: "fast"` will return an error.」這不是模型本身退役——Claude Opus 4.8 的標準模式完全不受影響，被下架的只是它的加速推理層。官方指定的遷移目標是 Claude Opus 5.5 的 fast mode，而這次下架最反直覺的地方是：Opus 4.8 fast mode 當研究預覽用了快一年，需要 `fast-mode-2026-02-01` beta header 才能呼叫；Opus 5.5 fast mode 已經是 GA（一般可用）功能，Start/Build/Scale 用量層內建額度、不需要申請 beta header。功能從「研究預覽」升級成「正式支援」的同時，單價還降了 20%——因為兩個模型的 fast mode 定價公式都是「標準價 × 2」，而 Opus 5.5 的標準價本來就比 Opus 4.8 低。

## 前後對照

| 項目 | 舊（Claude Opus 4.8 fast mode，研究預覽） | 新（Claude Opus 5.5 fast mode，GA） | 變化 | 生效日 |
|---|---|---|---|---|
| Input | $10.00/1M tokens | $8.00/1M tokens | ↓20% | 2026-11-30 |
| Output | $50.00/1M tokens | $40.00/1M tokens | ↓20% | 2026-11-30 |
| Cache hit（疊加在 fast mode 費率上，官方標示「on top of」） | $1.00/1M tokens（標準快取倍率 10%） | $0.40/1M tokens（標準快取倍率 5%） | ↓60% | 2026-11-30 |
| 存取門檻 | 需 `fast-mode-2026-02-01` beta header | 免 beta header，用量層內建額度 | 研究預覽→GA | 2026-11-30 起 Opus 4.8 無法再用 fast mode |

(對照：兩個模型的標準模式——不開 fast mode——分別是 Claude Opus 4.8 的 $5.00/$25.00 與 Claude Opus 5.5 的 $4.00/$20.00，fast mode 的費率剛好都是標準價的 2 倍。)

Fast mode 本身不支援 Batch API、也不能疊加 Priority Tier 承諾，換來的是輸出速度（OTPS）最高 2.5 倍於標準模式，時間到首個 token（TTFT）不受影響。下架後若原本靠 `speed: "fast"` 吃延遲敏感場景（IDE 內即時補全、語音/串流 agent）的呼叫方沒先遷移，2026-11-30 起每一筆請求都會直接回錯誤，不是降速而是整個失敗。

## 成本試算

**場景**：延續 Data Studios 本週同一組基準，一個跑 50 輪的 coding agent session，每輪 40,000 input tokens（其中 35,000 命中快取）+ 1,500 output tokens。

| | Opus 4.8 fast mode（11/30 下架） | Opus 5.5 fast mode（遷移目標） | Opus 5.5 標準模式（不開 fast mode，供對照） |
|---|---|---|---|
| 單次 session | $8.00 | $5.70（↓28.75%） | $2.85（↓64.4%，但犧牲 fast mode 最高 2.5x 的輸出速度） |
| 1,000 次 session/月 | $8,000.00 | $5,700.00（↓28.75%） | $2,850.00（↓64.4%） |

算式：每輪未命中快取的 5,000 input tokens 按 fast mode base 費率計，命中快取的 35,000 tokens 按「快取倍率 × fast mode base 費率」計，1,500 output tokens 按 fast mode output 費率計，50 輪加總。單純因為下架而被迫遷移、什麼優化都不做的團隊，帳單就先降了快三成。

## 對開發者/企業的影響

### 誰最受益

用 fast mode 跑互動式 coding agent（IDE 內即時建議、長對話串流）的團隊受益最大——這類場景同時吃到「單價降 20%」和「從研究預覽轉正式支援、免 beta header、用量層內建額度」兩層好處，遷移後的服務穩定性和官方支援等級都比留在 Opus 4.8 研究預覽更高。

### 競爭格局影響

把「加速推理層」拉出來看，各家的做法其實是同一套公式——「標準價 × 固定倍數」,只是倍數和被乘的標準價不同：

| 模型／方案 | 標準價 Input/Output | 加速層 Input/Output | 加速倍數 |
|---|---|---|---|
| GPT-6.1 Sol（OpenAI Fast，原 Priority） | $2.00/$10.00 | $4.00/$20.00 | 2x |
| **Claude Opus 5.5 fast mode** | **$4.00/$20.00** | **$8.00/$40.00** | **2x** |
| Claude Opus 4.8 fast mode（即將下架） | $5.00/$25.00 | $10.00/$50.00 | 2x |
| GPT-6 Astra（OpenAI Fast，原 Priority） | $10.00/$50.00 | $20.00/$100.00 | 2x |

OpenAI 把原本的 Priority processing 直接改名成 Fast mode（2026-07-30），同樣是標準價的 2 倍。兩家的加速層定價機制幾乎一致，代表這次 Anthropic 的「降價」其實不是重新議定加速層的乘數，而是把乘數套用在一個更便宜的新模型上——跟著模型世代升級走，比單獨去議加速層折扣更有效率。

### 行動建議

- 如果你在用 `claude-opus-4-8` 的 `speed: "fast"`：2026-11-30 前一定要遷移，過期後請求直接回錯誤，不是降速而是整個 fail；遷移同時把單價砍 20%，沒有理由拖到最後一天才動
- 如果你還在走 `fast-mode-2026-02-01` beta header 流程：遷移到 Opus 5.5 後可以把這段 header 邏輯整個砍掉，GA 功能不需要
- 如果你的 agent session 快取命中率高（像上面場景的 87.5%）：優先看快取倍率差異（10%→5%），這對高快取命中場景的降幅（60%）比 base 費率的降幅（20%）更大
- 如果你本來就沒在用 fast mode、只是跑標準模式：這次變動跟你無關，Opus 4.8 和 Opus 5.5 的標準價本身沒有變化

## 時效提醒（如有促銷/sunset）

⚠️ **停用日期**：2026-11-30。Claude Opus 4.8 的 fast mode 將於此日移除，`speed: "fast"` 請求之後會回傳錯誤。遷移指南：[Migrating to Claude Opus 5.5 from Claude Opus 4.8](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide#migrating-from-claude-opus-4-8)。

## 今日收穫

這次下架公告讓我們看清楚一件事：Anthropic 的 fast mode 從來不是「獨立定價的加速服務」，而是「標準價 × 固定 2 倍」的派生費率——OpenAI 的 Fast mode（原 Priority）用的也是同一套邏輯。這代表追蹤加速層的漲跌，不該去查加速層本身有沒有調整折扣，而是去查它掛在哪個模型世代上；模型世代往前走、標準價降了，加速層的帳單自動跟著降，不需要廠商額外宣布「加速層降價」。這跟我們在 11/4 報導 Gemini 2.5 Pro 轉導的觀察呼應——停用公告這次又沒有變成漲價事件，但原因完全不同：那次是官方把流量轉去更便宜的新模型，這次是同一套費率公式疊加在更便宜的新模型上，兩種機制都通向「停用＝降價」的結果,但不能假設所有 sunset 公告都會這樣,還是要逐篇查證。

## 參考資料

- [Anthropic: Claude Platform release notes（官方 2026-10-30 條目，宣布 Opus 4.8 fast mode 下架與 2026-11-30 移除日）](https://platform.claude.com/docs/en/release-notes/overview)
- [Anthropic: Fast mode（官方功能頁，含 Opus 5.5／Opus 4.8 fast mode 費率表與下架警告）](https://platform.claude.com/docs/en/build-with-claude/fast-mode)
- [Anthropic: Model pricing（官方定價頁，Claude Opus 5.5／Opus 4.8 標準價與快取倍率）](https://platform.claude.com/docs/en/about-claude/pricing)
- [Anthropic: Model deprecations（官方模型生命週期頁）](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Data Studios: AI API pricing this week — GPT-6 Cyber, Gemini Omni 1.2 Flash, Opus 4.8 fast mode（2026-11-06 報導，確認 session 成本試算基準與交叉驗證）](https://www.datastudios.org/post/ai-api-pricing-this-week-gpt-6-cyber-gemini-omni-1-2-flash-opus-4-8-fast-mode)
- [costgoat.com: OpenAI ChatGPT API Pricing Calculator（OpenAI Fast mode＝2x Standard 的倍率確認）](https://costgoat.com/pricing/openai-api)
- [本系列 11/4：Gemini 2.5 Pro／Flash 補上 Developer API 停用日](/posts/daily/2026-11-04-pricing-google-gemini-2-5-pro-flash-developer-api-sunset)
