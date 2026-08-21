---
title: "Testing Five zh-TW Terminology Linters: One Is Usable, One's --fix Turns 只是 Into 隻是"
date: 2026-08-21
category: tech
type: deep-dive
tags: [taiwan, linter, content-strategy, zh-tw, tooling]
lang: en
tldr: "On 109 posts that genuinely contain Mainland vocabulary, zhtw-mcp scored 29.4% precision at 85.2% recall; twlint scored 21.2% / 82.5% — but 195 of twlint's error-level findings are legitimate Traditional characters misread as Simplified (干→幹 60 times, 只→隻 15), so --fix corrupts the text. The most useful result was not a winner: zhtw-mcp found five Mainland terms my own list had missed, and correctly declined to flag one it wrongly included (審計). These tools calibrate your wordlist; they do not replace it."
description: "An empirical test of zhtw-mcp, twlint, Chinese-Vocabulary-Radar, tongwen-dict, and OpenCC — including the sampling mistake that nearly inverted the conclusion."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-21-zh-tw-terminology-linters-tested)

LLM training data skews heavily toward Mainland Chinese content, so the "Traditional Chinese" these models write is often **correct in glyphs but wrong in vocabulary**: 軟件 for 軟體, 視頻 for 影片, 用戶 for 使用者. I wanted to replace this site's hand-maintained 18-term grep pattern with a maintained tool, found five candidates, and tested all of them.

I got the measurement wrong once, and nearly published the wrong conclusion from it. That part is worth more than the tool comparison, so it goes first.

## The five candidates

**[zhtw-mcp](https://github.com/sysprog21/zhtw-mcp)** (sysprog21, MIT, Rust) enforces Taiwan Ministry of Education standards for punctuation and character forms, with cross-strait vocabulary grounded in OpenCC's TWPhrases/TWVariants — 1,882 vocabulary rules. It ships both a CLI and an MCP server, and asks the host AI assistant to adjudicate ambiguous terms.

**[twlint](https://github.com/HCYT/twlint)** (published as `@termdock/twlint`, Apache-2.0) is an ESLint-style CLI with two rules — `simplified-chars` (error) and `mainland-terms` (warning) — across eight domain dictionaries totalling roughly 1,946 entries.

**[Chinese-Vocabulary-Radar](https://github.com/aronhack/Chinese-Vocabulary-Radar)** is a Chrome extension whose dictionary is a single CC0 JSON file with 788 entries.

**[tongwen-dict](https://github.com/tongwentang/tongwen-dict)** is the New Tongwentang dictionary, 7,186 phrase entries.

**[OpenCC](https://github.com/BYVoid/OpenCC)**'s `s2twp` converts Simplified to Taiwan Standard Traditional with Taiwan phrasing — the de facto standard here.

## My first measurement was wrong

Round one took 120 posts (`ls src/content/posts/*/*.md | head -120`) and produced this:

| Source | Hits | Precision |
|---|---|---|
| twlint `--deep` | 1,588 | 0.3% |
| Chinese-Vocabulary-Radar | 1,463 | 0.3% |

I very nearly wrote "none of these are usable."

Then I checked one thing: **across those 120 posts, 用戶, 視頻, 網絡, 質量, 軟件, and 界面 each appeared exactly zero times.**

The sample contained none of what I was looking for. The numerator of precision was guaranteed to be near zero regardless of tool quality. The only five true positives were instances of 調用.

**Measuring precision on a sample with no positives measures your sampling, not the tool.** I had used `head -120`, which sorts by filename, so I got almost entirely posts from one category.

## Round two

I rebuilt the sample from the **109 posts that actually contain Mainland vocabulary** (selected with the site's own 18-term pattern), holding 567 true positives, and added zhtw-mcp:

| Tool | Findings | True | Precision | Recall |
|---|---|---|---|---|
| **zhtw-mcp** (cross_strait) | 1,888 | 556 | **29.4%** | **85.2%** |
| twlint `--deep` | 2,522 | 535 | 21.2% | 82.5% |

Both recall above 80%. That is a completely different conclusion from "0.3%" — **both tools find the problem; what separates them is how much noise they add, and what kind.**

(These figures were themselves corrected once. My first pass produced 25.6% / 18.6%, because my ground-truth list held only 17 terms and scored genuine Mainland vocabulary the tools caught as false positives — see "The tools corrected my wordlist" below.)

## The tools corrected my wordlist, in both directions

Computing precision requires ground truth. Mine was the site's existing 18-term pattern — and that list turned out to be wrong in two directions, both of which zhtw-mcp surfaced.

**Five genuine Mainland terms my list had missed:**

| Term | In corpus | zhtw-mcp flagged | Taiwan form |
|---|---|---|---|
| 激活 | 23 | 23 | 啟用 |
| 插件 | 19 | 19 | 外掛 |
| 反饋 | 17 | 17 | 回饋 |
| 智能 | 21 | 8 | 智慧 |
| 兼容 | 1 | 1 | 相容 |

智能 was flagged only 8 times out of 21 because the rule is context-gated and left 人工智慧 alone. Likewise 質量: 14 occurrences, 3 flagged — physics contexts excluded.

**And one entry it correctly refused to flag.** My pattern treats 審計 as Mainland vocabulary; it appears 36 times. zhtw-mcp never flagged it, and it is right: all 36 are "SOC2 審計" contexts, and 審計部 is an ROC government institution. The word is standard in Taiwan.

Detection rates on the main terms:

| Term | In corpus | zhtw-mcp flagged |
|---|---|---|
| 用戶 | 424 | 418 |
| 信號 | 52 | 51 |
| 視頻 | 4 | 3 |
| 界面 | 4 | 3 |
| 審計 | 36 | 0 (correctly silent) |

## The kind of noise matters more than the number

Eight percentage points separate them on precision. The *category* of their false positives differs far more.

### twlint: 195 error-level findings, all legitimate Traditional characters called Simplified

| The tool says | Count | Why it's wrong |
|---|---|---|
| 干 is Simplified, use 幹 | 60 | 干擾, 干預, 若干 |
| 污 is Simplified, use 汙 | 47 | Both are Traditional; not a simplification |
| 只 is Simplified, use 隻 | 15 | 只是, 只有 |
| 占 is Simplified, use 佔 | 14 | 占卜, 占星 |
| 岩 is Simplified, use 巖 | 7 | 岩 is the standard Taiwan form |
| 准 is Simplified, use 準 | 6 | 准許, 批准 |

This whole class is error-level and `--fix` acts on it. Running it turns 只是 into 隻是 and 干擾 into 幹擾.

### zhtw-mcp: false positives are word-choice positions, not character corruption

| The tool says | Count | My call |
|---|---|---|
| 場景 → 情境 | 122 | Defensible, but I'm not changing it |
| 開源 → 開放原始碼 | 19 | Right for formal docs, too heavy for a blog |
| 循環 → 迴圈 | 2 | Right in a programming context |
| 函式 → 函數 / 函數 → 函式 | 1 each | Rules in both directions; internally inconsistent |

These are **positions you can argue with**, not broken characters. Disagree and you disable the rule; nothing gets corrupted.

## How zhtw-mcp's ruleset is built

In `assets/ruleset.json`, 413 of the 1,882 rules (22%) carry anti-false-positive machinery: 66 with `exceptions`, 349 with `context_clues`, 72 with `negative_context_clues`.

Three of them land exactly on the traps I hit:

**`文件 → 檔案` is explicitly marked `disabled`**, with the reasoning stored in the data:

> tw 「文件」= document (正確用法)；cn 「文件」= file。裸詞歧義無法消歧，停用以避免誤判。複合詞 (文件夾→資料夾、頭文件→標頭檔) 不受影響

The same word drew 50 findings from twlint and 632 from Chinese-Vocabulary-Radar.

**`用戶 → 使用者` carries `exceptions: ["用戶端", "用戶端作業系統"]`.**

**The 只 rule runs the other way**: `隻 → 只`, typed `confusable`, explained as "OpenCC may mis-convert 只 (only) into 隻." twlint encoded that very bug as a rule.

There is one more at build time: the character-table generator prints **"Ambiguous: 15 chars excluded"** — one-Simplified-to-many-Traditional characters are dropped from automatic conversion entirely. All 195 of twlint's errors belong to that class.

The 優化 rule carries `context_suggestions`: clues like 微服務 / 服務端 / 用戶端 suggest 最佳化, while 流程 / 體驗 / 服務 / 營運 suggest 改善 or 提升. The docs explain why both sets aren't merged into `to` — doing so would disable auto-fix for the IT sense too.

## Why tongwen and OpenCC structurally cannot help

These are the most mature projects here, and the problem is **direction**. Probing tongwen-dict:

```
视频 → 視訊       ✓ in dictionary
視頻 → ✗ not in dictionary
软件 → 軟體       ✓ in dictionary
軟件 → ✗ not in dictionary
用户 → 使用者     ✓ in dictionary
用戶 → ✗ not in dictionary
```

All 7,186 keys are **Simplified**. OpenCC's `s2twp` likewise.

What LLM output actually looks like is **Traditional glyphs carrying Mainland vocabulary**. 視頻 is not 视频; to a Simplified-to-Traditional converter it is an already-converted, ordinary word.

Not a bug — a different goal. Theirs is "make a Simplified article readable in Taiwan"; mine is "audit an already-Traditional article for Mainland vocabulary." Different input shape, different dictionary keys.

## Conclusion: calibrate the list with the tool, gate with the list

I did not wire zhtw-mcp into CI after testing, because its noise is spread across **187 distinct terms** — disabling the 50 loudest still only removes 79%, leaving 294 findings across 109 posts, about 2.7 per file. Too chatty for a hard pre-commit gate.

But it did something more valuable: **it caught both errors in my hand-maintained list** — five terms to add, one to remove.

So the division of labour is:

| Role | Use | Why |
|---|---|---|
| **Gate** (blocks every commit) | your own narrow list | zero noise, so every red light is worth reading |
| **Checkup** (run periodically) | zhtw-mcp | surfaces Mainland terms you didn't know you were using, to fold into the list |
| Simplified→Traditional conversion | OpenCC / tongwen | that's what they were built for |

Concretely:

1. **Disable the words your site deliberately uses.** zhtw-mcp supports a project-level `.zhtw-mcp.toml` and a user-level `overrides.json`, and the docs use 優化 as the worked example:

   ```json
   {"from": "優化", "to": ["最佳化"], "type": "cross_strait", "disabled": true}
   ```

   For my style guide that's 優化, 數據, 場景, 開源, 設備.
2. **Don't touch `--fix` until you've read a full report.** The twlint lesson: 195 of its auto-fixable findings would damage the text.
3. **Benchmark on a sample that contains the problem, not a random one.** My biggest error — `head -120` gave me files with no positives, I measured 0.3%, and nearly published "none of these work."
4. **Read the tool's report as a list of candidates, not a list of chores.** It reported 1,888 findings; what I wanted from it was the five terms that belonged in my list.

One last thing: I finished the first version of this post, ran every validator, and even checked the external links before noticing the sampling was wrong — and after fixing that, discovered the ground-truth list was wrong too. **All-green formatting says nothing about whether the method was sound, and a sound method says nothing about whether your criteria are right.**

## The version you can copy

The above is my set of trade-offs; your style guide differs. Abstracted, the process is:

### 1. Start from your own narrow list

Don't start from someone else's 1,000-entry dictionary. Start from the dozen or so terms **you are certain about**, in two tiers:

- **Tier A**: no legitimate Taiwan usage — block the commit (用戶, 視頻, 軟件, 插件…)
- **Tier B**: context-dependent — report only (質量, 智能, 信號, 反饋…)

The test is whether the word has a legitimate use *in your subject matter*. Every 質量 in my drone posts is physics; every 激活 in my AI posts is "activation." On someone else's blog both might be pure Mainland vocabulary.

### 2. Exclude four regions, or you will corrupt text

| Region | Why |
|---|---|
| Code blocks and inline code | Variable names aren't Chinese prose |
| Link URLs | You didn't write the characters in a URL |
| Blockquotes | Quoting a Mainland interviewee saying 「這個視頻的質量真的不行」 — not one character may change |
| External article titles in reference lists | Someone else's title isn't yours to correct |

You also need word-level carve-outs: 用戶 matches inside the legitimate Taiwan term 用戶端, 對標 matches inside 針**對標**註, 博客 matches inside 博客來 (a Taiwanese bookstore).

### 3. Use zhtw-mcp to calibrate the list, not to replace it

Run it, read the report, and ask of each term: does this belong in my list? Its value is surfacing **the words you didn't know you were using** — all four of my additions (激活, 插件, 反饋, 兼容) came from it.

Before running, disable the words you deliberately use in `overrides.json`, or noise will bury the signal.

### 4. Always dry-run a bulk replacement

My dry run caught three changes that would have damaged content:

- `激活 → 啟用` would wreck every machine-learning passage (activation)
- `貼標 → 貼上標籤` collides with 貼標籤, producing 貼上標籤籤
- **it rewrote this very article** — this post discusses those words, so the table became "外掛 | 19 | 19 | 外掛"

The third is the easiest to miss: **exempt articles that discuss terminology**, or your checker will corrupt its own documentation.

### 5. Only make it a gate once it's green

My order was: write the check (report-only) → fix 419 occurrences → hand-fix the remaining 8 → Tier A at zero → *then* wire it into `pnpm verify`. Doing it the other way round locks everyone out.

## References

- [sysprog21/zhtw-mcp](https://github.com/sysprog21/zhtw-mcp) — zh-TW linguistic linter, MIT, Rust; MoE punctuation and character standards, 1,882 vocabulary rules (tested against the May 2026 main branch, built locally with `cargo build --release`)
- [HCYT/twlint](https://github.com/HCYT/twlint) — zh-TW terminology CLI linter, Apache-2.0, published as `@termdock/twlint` (tested at 1.3.2)
- [aronhack/Chinese-Vocabulary-Radar](https://github.com/aronhack/Chinese-Vocabulary-Radar) — Chrome extension; code MIT, dictionary CC0, 788 entries
- [tongwentang/tongwen-dict](https://github.com/tongwentang/tongwen-dict) — New Tongwentang dictionary, 7,186 phrase entries
- [BYVoid/OpenCC](https://github.com/BYVoid/OpenCC) — Open Chinese Convert; `s2twp` is Simplified to Taiwan Standard with Taiwan phrases
- [frank890417/taiwan-md terminology database](https://github.com/frank890417/taiwan-md/tree/main/data/terminology) — 1,339+ YAML entries, severity A blocks commits / B is informational, with a false-positive table (not tested here)
- [alexclassroom/WordPress-zh_TW-Glossary](https://github.com/alexclassroom/WordPress-zh_TW-Glossary) — Taiwan IT English-Chinese glossary, 2,000+ CSV entries (not tested here)
- [l10n-tw/iicm-glossary-backup](https://github.com/l10n-tw/iicm-glossary-backup) — Institute of Information & Computing Machinery glossary backup, as CSV / SQLite / TBX (not tested here)
