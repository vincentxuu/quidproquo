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

LLM training data skews heavily toward Mainland Chinese content, so the "Traditional Chinese" these models write is often **correct in glyphs but wrong in vocabulary**: 軟件 for 軟體, 視頻 for 影片, 用戶 for 使用者.

My site already had an 18-term grep pattern guarding against this — but it was a line on a checklist that someone had to remember to run, so it never ran. I wanted to replace it with a tool somebody else maintains.

I found five, tested all of them, got three things wrong along the way, and ended up doing something quite different from what I set out to do.

# 1. Sort the tools first

These five are not five of the same thing. Sorting them makes the comparison possible.

| Category | Project | What it does |
|---|---|---|
| **Linters** | [zhtw-mcp](https://github.com/sysprog21/zhtw-mcp), [twlint](https://github.com/HCYT/twlint) | Read your draft, flag words to change |
| **Wordlist** | [Chinese-Vocabulary-Radar](https://github.com/aronhack/Chinese-Vocabulary-Radar) | Data only; you write the code |
| **Simplified→Traditional** | [tongwen-dict](https://github.com/tongwentang/tongwen-dict), [OpenCC](https://github.com/BYVoid/OpenCC) | Convert Simplified articles to Traditional |

**Rule out the third category immediately — it structurally cannot help.** Probing tongwen-dict's 7,186 phrase entries:

```
视频 → 視訊       ✓ in dictionary
視頻 → ✗ not in dictionary
软件 → 軟體       ✓ in dictionary
軟件 → ✗ not in dictionary
用户 → 使用者     ✓ in dictionary
用戶 → ✗ not in dictionary
```

Every key is **Simplified**, and OpenCC's `s2twp` is the same by definition. But what an LLM produces is **Traditional glyphs carrying Mainland vocabulary** — 視頻 is not 视频, so to a Simplified-to-Traditional converter it is an already-converted, ordinary word.

Not a bug, a different goal: theirs is "make a Simplified article readable in Taiwan"; mine is "audit an already-Traditional article for Mainland vocabulary." Different input shape, different dictionary keys.

That leaves the two linters:

- **zhtw-mcp** (sysprog21, MIT, Rust) enforces Taiwan Ministry of Education standards for punctuation and character forms, with cross-strait vocabulary grounded in OpenCC's TWPhrases/TWVariants — 1,882 rules. CLI and MCP server, and it asks the host AI assistant to adjudicate ambiguous terms.
- **twlint** (published as `@termdock/twlint`, Apache-2.0) is an ESLint-style CLI with two rules — `simplified-chars` (error) and `mainland-terms` (warning) — across eight domain dictionaries totalling roughly 1,946 entries.

# 2. The three things I got wrong

These matter more than the tool comparison, because they are all the same mistake: **each time I thought I had an objective number, and each time the assumption underneath it went unchecked.**

## First: the sample, so I measured my sampling rather than the tools

Round one took 120 posts (`ls src/content/posts/*/*.md | head -120`):

| Source | Hits | Precision |
|---|---|---|
| twlint `--deep` | 1,588 | 0.3% |
| Chinese-Vocabulary-Radar | 1,463 | 0.3% |

I very nearly wrote "none of these are usable."

Then I checked one thing: **across those 120 posts, 用戶, 視頻, 網絡, 質量, 軟件, and 界面 each appeared exactly zero times.**

The sample contained none of what I was looking for, so the numerator was guaranteed to be near zero. `head -120` sorts by filename, so I got almost entirely posts from one category.

**Measuring precision on a sample with no positives measures your sampling method.**

## Second: the ground truth, so I scored right answers as wrong

I rebuilt the sample from the **109 posts that actually contain Mainland vocabulary**, holding 567 true positives. That first produced 25.6% for zhtw-mcp and 18.6% for twlint.

But my ground-truth list held only 17 terms. zhtw-mcp had caught 激活, 插件, 反饋, 兼容, and 智能 — genuine Mainland vocabulary that scored as false positives purely because my list omitted them.

With those added:

| Tool | Findings | True | Precision | Recall |
|---|---|---|---|---|
| **zhtw-mcp** (cross_strait) | 1,888 | 556 | **29.4%** | **85.2%** |
| twlint `--deep` | 2,522 | 535 | 21.2% | 82.5% |

Both recall above 80% — a completely different conclusion from "0.3%."

The error ran the other way too. My list treats 審計 as Mainland vocabulary; it appears 36 times; zhtw-mcp never flagged it — **and it was right**. All 36 are "SOC2 審計" contexts, and 審計部 is an ROC government institution. The word is standard in Taiwan.

Detection rates on the main terms:

| Term | In corpus | zhtw-mcp flagged |
|---|---|---|
| 用戶 | 424 | 418 |
| 信號 | 52 | 51 |
| 視頻 | 4 | 3 |
| 界面 | 4 | 3 |
| 智能 | 21 | 8 (context-gated; left 人工智慧 alone) |
| 質量 | 14 | 3 (physics contexts excluded) |
| 審計 | 36 | 0 (correctly silent) |

## Third: what I adopted, which nearly wrecked every AI passage

I promoted all five of those terms to my blocking list and ran a bulk replacement. **The preview is what revealed that 激活 was a mistake.**

All 23 occurrences of 激活 on the site are machine-learning activations — 激活空間, 激活量化, 非線性激活, 激活監控. Not one means "enable." Replacing it would have destroyed every passage about neural networks.

The same preview caught two more: `貼標 → 貼上標籤` collides with 貼標籤, producing 貼上標籤籤; and the script **rewrote this very article**, because this article discusses those words — the table became "外掛 | 19 | 19 | 外掛".

zhtw-mcp was not wrong to flag 激活. I was wrong to adopt it without checking context. **A tool hands you candidates; whether to accept one depends on your own corpus.**

# 3. The kind of noise matters more than precision

29.4% against 21.2% — eight percentage points. The *category* of false positives differs far more, and that is what decides usability.

## twlint: 195 error-level findings, all legitimate Traditional characters called Simplified

| The tool says | Count | Why it's wrong |
|---|---|---|
| 干 is Simplified, use 幹 | 60 | 干擾, 干預, 若干 |
| 污 is Simplified, use 汙 | 47 | Both are Traditional; not a simplification |
| 只 is Simplified, use 隻 | 15 | 只是, 只有 |
| 占 is Simplified, use 佔 | 14 | 占卜, 占星 |
| 岩 is Simplified, use 巖 | 7 | 岩 is the standard Taiwan form |
| 准 is Simplified, use 準 | 6 | 准許, 批准 |

This whole class is error-level and `--fix` acts on it. Running it turns 只是 into 隻是 and 干擾 into 幹擾.

## zhtw-mcp: false positives are word-choice positions, not character corruption

| The tool says | Count | My call |
|---|---|---|
| 場景 → 情境 | 122 | Defensible, but I'm not changing it |
| 開源 → 開放原始碼 | 19 | Right for formal docs, too heavy for a blog |
| 循環 → 迴圈 | 2 | Right in a programming context |
| 函式 → 函數 / 函數 → 函式 | 1 each | Rules in both directions; internally inconsistent |

These are **positions you can argue with**, not broken characters. Disagree and you disable the rule; nothing gets corrupted.

## The difference comes from how the rules are built

In zhtw-mcp's `assets/ruleset.json`, 413 of the 1,882 rules (22%) carry anti-false-positive machinery: 66 with `exceptions`, 349 with `context_clues`, 72 with `negative_context_clues`.

Three of them land exactly on the traps I hit:

**`文件 → 檔案` is explicitly marked `disabled`**, with the reasoning stored in the data:

> tw 「文件」= document (正確用法)；cn 「文件」= file。裸詞歧義無法消歧，停用以避免誤判。複合詞 (文件夾→資料夾、頭文件→標頭檔) 不受影響

The same word drew 50 findings from twlint and 632 from Chinese-Vocabulary-Radar.

**`用戶 → 使用者` carries `exceptions: ["用戶端", "用戶端作業系統"]`.**

**The 只 rule runs the other way**: `隻 → 只`, typed `confusable`, explained as "OpenCC may mis-convert 只 (only) into 隻." twlint encoded that very bug as a rule.

One more happens at build time: the character-table generator prints **"Ambiguous: 15 chars excluded"** — one-Simplified-to-many-Traditional characters are dropped from automatic conversion entirely. All 195 of twlint's errors belong to that class.

The 優化 rule carries `context_suggestions`: clues like 微服務 / 服務端 / 用戶端 suggest 最佳化, while 流程 / 體驗 / 服務 / 營運 suggest 改善 or 提升. The docs explain why both sets aren't merged into `to` — that would disable auto-fix for the IT sense too.

# 4. What I actually ended up doing

**I did not wire zhtw-mcp into CI.** Its noise is spread across **187 distinct terms** — disabling the 50 loudest still only removes 79%, leaving 294 findings across 109 posts, about 2.7 per file. Too chatty for a hard pre-commit gate.

But it did something more valuable: **it caught the errors in my hand-maintained list** — three terms promoted to blocking, one removed (審計), two downgraded to report-only (激活, 智能).

So, three layers:

| Role | Use | Why |
|---|---|---|
| **Gate** (blocks every commit) | your own narrow list | zero noise, so every red light is worth reading |
| **Checkup** (run periodically) | zhtw-mcp | surfaces Mainland terms you didn't know you were using |
| Simplified→Traditional conversion | OpenCC / tongwen | that's what they were built for |

Following that, 419 occurrences on my site were cleaned up, 8 more that needed sentence rewrites were fixed by hand, and only then did the check go into CI.

# 5. What you can do

## If you don't write code

Everything above is commands and config files, but most people bothered by an AI writing 軟件, 視頻, 用戶 into their drafts are working in ChatGPT, Word, or Notion — not in a repo.

**Easiest: install a browser extension.** [中國用語雷達 (Chinese Vocabulary Radar)](https://chromewebstore.google.com/detail/lecgchakaccigfbbaeialhjplbmgipge) for Chrome highlights Mainland vocabulary in yellow on any page — including what you type into Google Docs, Notion, or a ChatGPT prompt box. No configuration. It highlights but never edits, which is the right behaviour: **no tool can decide for you whether 質量 in this sentence means physics.**

**Paste and go: online converters.** [繁化姬](https://zhconvert.org/) converts characters and vocabulary in one pass; [the Taiwan.md converter](https://taiwan.md/terminology/converter/) has 3,901 rules and shows what changed. Neither needs an account; both get tedious for long pieces.

**Just ask the AI.** If you already draft in ChatGPT or Claude:

```
Check the following text against this Taiwan/Mainland vocabulary list
and list what you find — do NOT rewrite it:
https://raw.githubusercontent.com/aronhack/Chinese-Vocabulary-Radar/refs/heads/main/chrome-extension/taiwan_china_vocabs.json

(your text)
```

**"Do not rewrite it" matters.** Let it edit directly and you lose the chance to judge — and it will get a few wrong.

## Four things hold regardless of tool

These came out of the three mistakes above and have nothing to do with tooling:

1. **Tools will flag ordinary words from your field.** Every 質量 in my drone posts is mass; every 激活 in my AI posts is activation. You have to recognize your own domain vocabulary.
2. **Never change quoted speech.** Quoting 「這個視頻的質量真的不行」 — not one character may move. Changing it falsifies the quote.
3. **Never change proper nouns.** 北京人工智能研究院 is an institution's name; 博客來 is a bookstore, not 部落格來.
4. **Look before you bulk-replace.** This applies just as much to Word's Replace All: **hit "Find" and read every result before you hit "Replace All."**

## The more fundamental fix: say it before the AI writes

Rather than catching it afterwards, add this to your ChatGPT custom instructions or Claude Project instructions:

```
Write in Taiwanese Mandarin. Never use: 軟件, 視頻, 用戶, 質量, 默認,
插件, 兼容, 屏幕, 鼠標, 賦能, 抓手, 閉環, 對標, 復盤.
Use instead: 軟體, 影片, 使用者, 品質, 預設, 外掛, 相容, 螢幕, 滑鼠.
```

Far less work than proofreading afterwards, and **listing the specific words works much better than "please use Taiwanese Chinese"** — the latter is too abstract for a model to act on.

## If you have a repo

1. **Start from your own dozen terms**, not someone else's 1,000-entry dictionary. Two tiers: A for words with no legitimate Taiwan usage (用戶, 視頻, 軟件, 插件…) which block the commit; B for context-dependent ones (質量, 智能, 信號, 反饋…) which only report.
2. **Exclude four regions**: code blocks and inline code, link URLs, blockquotes, and external article titles in reference lists. Add word-level carve-outs too — 用戶 matches inside 用戶端, 對標 inside 針**對標**註, 博客 inside 博客來. And you need to **exempt whole articles**: a post like this one, which discusses the words, will always false-positive.
3. **Use zhtw-mcp to calibrate the list, not replace it.** Disable the words you deliberately use in `overrides.json` first:

   ```json
   {"from": "優化", "to": ["最佳化"], "type": "cross_strait", "disabled": true}
   ```

4. **Always preview a bulk replacement** — see the third mistake above.
5. **Only make it a gate once it's green.** My order: write the check (report-only) → fix 419 occurrences → hand-fix the remaining 8 → Tier A at zero → *then* wire it into CI. The other way round locks everyone out.

# Sources

## References

- [sysprog21/zhtw-mcp](https://github.com/sysprog21/zhtw-mcp) — zh-TW linguistic linter, MIT, Rust; MoE punctuation and character standards, 1,882 vocabulary rules (tested against the May 2026 main branch, built locally with `cargo build --release`)
- [HCYT/twlint](https://github.com/HCYT/twlint) — zh-TW terminology CLI linter, Apache-2.0, published as `@termdock/twlint` (tested at 1.3.2)
- [aronhack/Chinese-Vocabulary-Radar](https://github.com/aronhack/Chinese-Vocabulary-Radar) — Chrome extension; code MIT, dictionary CC0, 788 entries
- [tongwentang/tongwen-dict](https://github.com/tongwentang/tongwen-dict) — New Tongwentang dictionary, 7,186 phrase entries
- [BYVoid/OpenCC](https://github.com/BYVoid/OpenCC) — Open Chinese Convert; `s2twp` is Simplified to Taiwan Standard with Taiwan phrases
- [frank890417/taiwan-md terminology database](https://github.com/frank890417/taiwan-md/tree/main/data/terminology) — 1,339+ YAML entries, severity A blocks commits / B is informational, with a false-positive table (not tested here)
- [alexclassroom/WordPress-zh_TW-Glossary](https://github.com/alexclassroom/WordPress-zh_TW-Glossary) — Taiwan IT English-Chinese glossary, 2,000+ CSV entries (not tested here)
- [l10n-tw/iicm-glossary-backup](https://github.com/l10n-tw/iicm-glossary-backup) — Institute of Information & Computing Machinery glossary backup, as CSV / SQLite / TBX (not tested here)
