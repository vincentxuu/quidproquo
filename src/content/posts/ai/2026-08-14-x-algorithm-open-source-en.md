---
title: "Reading X's Open-Sourced Ranking Algorithm: The Weights Are Public, But the Growth Guides Are Still Quoting 2023"
date: 2026-08-14
category: ai
type: deep-dive
tags: [recommendation, ranking, ai-transparency, open-source, algorithm]
lang: en
tldr: "On 2026-08-13 xAI published the For You ranking weights for the first time: reply 5.0, favorite 0.5, report −234.0. The widely quoted 'a reply is worth 27 likes' comes from the 2023 repo — the current model does not even have that prediction head."
description: "Reading xai-org/x-algorithm from source: what each of the three releases actually shipped, the Phoenix ranking architecture, the full weight table, and why publishing the weights did not make the system auditable."
draft: false
glossary:
  - term: "candidate isolation"
    definition: "An attention mask that prevents candidate items from attending to each other during inference, so each item's score depends only on the user context, not on which other items are in the batch."
    definition_en: "An attention mask that prevents candidate items from attending to each other during inference, so each item's score depends only on the user context, not on which other items are in the batch."
    advanced: "The cost is giving up slate-level optimization; the payoff is scores that are cacheable and reproducible."
    context: "Used here to explain why Phoenix scores are stable."
  - term: "semantic ID"
    aliases: ["SID"]
    definition: "Discrete codes obtained by residual-quantizing an item's multimodal embedding (X uses 6 levels x 256 codes), used as the item identity; similar content shares code prefixes."
    definition_en: "Discrete codes obtained by residual-quantizing an item's multimodal embedding (X uses 6 levels x 256 codes), used as the item identity; similar content shares code prefixes."
    advanced: "Unlike pure hashed IDs, semantic IDs give the model content-level generalization to items it has never seen."
    context: "Used here to explain how X represents posts in the retrieval stage."
  - term: "visibility filtering"
    definition: "A rule system separate from ranking that answers, for each post-viewer pair, whether to allow, show behind an interstitial, or drop."
    definition_en: "A rule system separate from ranking that answers, for each post-viewer pair, whether to allow, show behind an interstitial, or drop."
    context: "Used here to explain what the August 2026 release actually added."
---

> 🌏 [中文版](/posts/ai/2026-08-14-x-algorithm-open-source)

Start with two numbers.

The most-quoted claim about X's algorithm is that a reply is weighted 27 times a like. And in `home-mixer/params/param.rs`, published for the first time on 2026-08-13 in [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm), both numbers are written out plainly: `FavoriteWeight` is 0.5, `ReplyWeight` is 5.0. The ratio is 10.

The 27 is not invented — it is the old value from [twitter/the-algorithm](https://github.com/twitter/the-algorithm), the 2023 release. Three years on, the system has been rewritten from Scala into Rust plus JAX, the model has been replaced by a Grok-family transformer, and the growth guides are still republishing the same table.

This is what came out of cloning the repo and reading it: what each of the three releases actually shipped, how ranking really works, which circulating numbers do not survive contact with the source, and one uncomfortable conclusion — the weights are public, and the system did not become more auditable.

## Three releases, two orders of magnitude apart

The repo's git history has only 5 commits, all produced by a CI agent, all with the identical message. But `--stat` tells the story:

| Release date | Files changed | Lines added | Contents |
|---|---|---|---|
| 2026-01-20 | 79 | 8,816 | Four directories: `home-mixer`, `phoenix`, `thunder`, `candidate-pipeline` |
| 2026-05-15 | 187 | 18,263 | Grox content understanding, ads blending, new candidate sources |
| 2026-08-13 | **2,053** | **363,246** | Weights, visibility filtering, the safety-labeling chain, Phoenix production training code |

[TechCrunch reported](https://techcrunch.com/2026/08/13/x-open-sources-its-ranking-algorithm-letting-users-see-if-theyve-been-shadowbanned) that this release made the codebase "roughly 10 to 15 times larger than it was before," which matches git.

More telling than the size is **what the first two releases left out**. In the January and May versions, `ranking_scorer.rs` was already calling `params.get(FavoriteWeight)` — but the `home-mixer/params/` directory was not in the repo at all. You could read the code and not the numbers. When [Engadget interviewed three researchers in February](https://www.engadget.com/social-media/xs-open-source-algorithm-isnt-a-win-for-transparency-researchers-say-181836233.html), X's stated reason for the omission was "security reasons."

The August release fills that in: 183 `param!` declarations, covering the weights for all 26 actions.

## The ranking formula is surprisingly simple

The whole For You ranking is one line:

```
Final Score = Σ (weight_i × P(action_i))
```

Phoenix reads your recent action sequence and emits 26 probabilities per candidate post; `RankingScorer` combines them using the constants in `param.rs`. These are the production defaults as of 2026-08-13:

| Category | Action | Weight |
|---|---|---|
| Engagement | favorite | 0.5 |
| | reply | 5.0 |
| | reply (boost for original posts from mutual follows) | **+15.0** |
| | retweet | 1.0 |
| | quote | 5.0 |
| | share | 2.0 |
| | share via DM | 5.0 |
| | **share via copy link** | **20.0** |
| Clicks | click / open link / profile click | 0.4 / 0.2 / 0.0 |
| | photo expand / video open / video quality view | 0.05 / 0.05 / 0.05 |
| Attention | dwell / continuous dwell time | 0.0 / 0.004 |
| Author | follow author | 4.0 |
| Negative | not interested | **−43.2** |
| | block author | **−31.2** |
| | mute author | **−58.8** |
| | report | **−234.0** |
| | not dwelled | −0.02 |

Before converting `report = −234.0` into "one report costs you 468 likes of reach," read the comment sitting directly above the weight declarations in the same file:

> These weights reflect a combination of how much an action is valued in ranking and typical propensities of these actions across the X network (e.g. negative feedback is overall rare).

In other words, **the weights already absorb each action's base rate**. The actual contribution is weight × P(action), and P(report) is orders of magnitude below P(favorite). Dividing two weights to get "worth N likes" is arithmetically fine and drops the premise.

Three adjustments follow the weighted sum, all in `ranking_scorer.rs`: each post after an author's first is multiplied by a decay factor of 0.5 down to a floor of 0.25; posts from accounts you do not follow are multiplied by 0.75; and authors with fewer than 1,000 impressions and at most 1,000 followers get posts under 24 hours old lifted toward slots 15–16.

## The numbers that do not check out

Comparing the growth guides against the source line by line, the error rate is remarkable:

| Circulating claim | What the source says |
|---|---|
| A reply is worth 27 likes | That is the 2023 repo. Current ratio is 10x (up to 20x for original posts from mutual follows) |
| "Author replies to your reply" is worth 75x | **That prediction head does not exist** among the current 26 targets. The signal is not there |
| X Premium gives a 2–4x reach multiplier | Searching `home-mixer/` for `premium`, `verified`, `subscription` turns up two things only: an **access** filter for subscriber-only posts, and logging in ads and stats. No ranking term is keyed on subscription level |
| External links cut reach by 50% | `OpenLinkWeight = 0.2`. Positive, just small |
| First-30-minutes engagement velocity carries a 1000x weight | Not in the code. The only time mechanisms are `MAX_POST_AGE = 48 * 60 * 60` (a hard 48-hour drop, not decay) and the 24-hour cold-start window |
| There is a pretrained checkpoint to download | The May release had one (`oss-phoenix-artifacts.zip`, a 128-dim 4-layer mini model). **The August release removed it** in favor of training on synthetic data yourself |

That last one is worth noting: the August release also deleted the Git LFS configuration in `.gitattributes`, because there are no model files left in the repo. `phoenix/TRAINING.md` states it directly: "No pretrained checkpoint is included."

## The real black box is inside Phoenix

The complexity did not disappear; it was absorbed into the model. The README is blunt about it:

> We have eliminated every single hand-engineered feature and most heuristics from the system.

`phoenix/README.md` gives the production configuration: the ranking model runs at embedding dimension 2560, 8 transformer layers, grouped-query attention with 20 query heads over 4 KV heads, a history sequence length of 1022, 64 candidates scored per request, and hashed vocabularies of 100M users / 100M items / 30M authors. Retrieval is a two-tower model over a candidate index of 10.24M posts (28.67M on the combined config).

Two design decisions are worth remembering:

**Candidate isolation.** During inference, candidates cannot attend to each other — only to the user and history. A post's score therefore does not depend on which other posts are in the batch, which makes scores cacheable and reproducible. The cost is giving up slate-level optimization.

**Semantic IDs.** Besides hashed IDs, posts carry residual-quantized codes (6 levels × 256) derived from a multimodal embedding. Posts on the same topic share code prefixes, giving the model content-level generalization to posts it has never seen.

This is exactly where the researchers' objection lands. Cornell's John Thickstun told Engadget that decision-making is moving "not just out of public view, but actually really out of view or understanding of even the internal engineers." Graz's Ruggero Lazzaroni put it more bluntly: "We have the code to run the algorithm, but we don't have the model that you need to run the algorithm."

The August release does add training code and synthetic data generators; `phoenix/QUICKSTART.md` claims a single GPU can run training and gRPC serving end to end. TechCrunch reports that, ahead of launch, external researchers trained and ran Phoenix from the open source code — without getting per-post scores. **Production weights and training data remain unpublished.** (I have not verified the training path myself — no GPU on hand.)

## What is actually new is visibility filtering

Judged on ranking alone, the August release is a modest increment. What is genuinely new is `visibility-filtering/` and the labeling stack feeding it — and X draws the line explicitly in the README:

```
Ranking decides the order        →  home-mixer/scorers/
Visibility decides if it appears →  visibility-filtering/
                                    different services, inputs, rules
```

`visibility-filtering/rules/registry.rs` answers one of three things for each post-viewer pair: allow, interstitial (behind a tappable warning), or drop. Rules come in two sets, and the first rule that answers drop ends evaluation:

- **Base policy**: suspended / deactivated authors, viewer blocks or mutes the author, legal takedowns, spam labels, interstitials for adult and violent media.
- **Recommendations-only policy**: 27 additional rules that apply **only when the post is a recommendation from an account the viewer does not follow, and that can only drop**. High-recall spam, DMCA media, geo-restricted media, impersonation, read-only accounts all live here.

That design deserves a pause: the same post can be visible to a follower and dropped for someone being recommended it. What used to be argued about as "shadowbanning" is now a public list you can read and criticize rule by rule.

Shipping alongside it is the [Under the Hood](https://x.com/i/under_the_hood) tool: eligible accounts (at least a year old, 10 or more posts in the past month) can download a JSON file showing which visibility-limiting labels were applied to their account and posts over the past calendar month. It is a randomized pilot for now.

What was held back is equally concrete. `grox/flows/*/prompts.py` loads a dozen or so Jinja2 templates, and the number of `.j2` files in the entire repo is **zero**. The operative definition of "does this post violate a rule" is not published at all. X's VP of Product Keith Coleman told TechCrunch this is to stop bad actors from working around the rules to flood the network with spam.

## Overall

What this release changes is not whether you can reproduce X's feed. You cannot — no weights, no data.

What it changes is **where the argument happens**. The old argument was whether they were quietly suppressing people. The new one can be about whether those 27 rules in `registry.rs` are reasonable, whether report deserving 468 times the weight of a favorite is the right magnitude, and whether dialing `bidirectional_follow_reply_weight_boost` from 20 down to 15 because people were not seeing enough World Cup discussion is good product judgment — that last one is documented by X itself in [`docs/BIDIRECTIONAL_BOOST_CHANGE.md`](https://github.com/xai-org/x-algorithm/blob/main/docs/BIDIRECTIONAL_BOOST_CHANGE.md), down to the 7/10 A/B test, the 7/13 broad launch, and the 7/24 adjustment.

That is real transparency, and it is narrow. It makes the *rules* public text while pushing the *judgment* deeper into a model. And the thing the EU's DSA actually asks for — researcher access to the platform's **outputs** — is precisely what X's API pricing forecloses; [the Hacker News thread](https://news.ycombinator.com/item?id=46688173) spends more energy on that than on the code.

One more thing: in January, Musk promised updates every four weeks with comprehensive developer notes. Git history shows three releases in seven months.

If you build recommendation systems, this repo is probably the most complete production-grade reference architecture publicly available, under Apache-2.0 and usable commercially. If you are a creator trying to work out why your reach dropped, reading `param.rs` helps — but remember that the weights are the constants. The part that varies is the probability you cannot see.

## References

- [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm) — source for the X For You feed algorithm, Apache-2.0
- [x-algorithm: docs/BIDIRECTIONAL_BOOST_CHANGE.md](https://github.com/xai-org/x-algorithm/blob/main/docs/BIDIRECTIONAL_BOOST_CHANGE.md) — X's own day-by-day record of a ranking parameter change
- [x-algorithm: phoenix/README.md](https://github.com/xai-org/x-algorithm/blob/main/phoenix/README.md) — Phoenix ranking and retrieval architecture, production config table
- [twitter/the-algorithm](https://github.com/twitter/the-algorithm) — the 2023 open source release
- [X open sources its ranking algorithm, letting users see if they've been 'shadowbanned'](https://techcrunch.com/2026/08/13/x-open-sources-its-ranking-algorithm-letting-users-see-if-theyve-been-shadowbanned) — TechCrunch, with an interview with X VP of Product Keith Coleman
- [X open sources its algorithm while facing a transparency fine and Grok controversies](https://techcrunch.com/2026/01/20/x-open-sources-its-algorithm-while-facing-a-transparency-fine-and-grok-controversies/) — TechCrunch on the January 2026 release
- [X's 'open source' algorithm isn't a win for transparency, researchers say](https://www.engadget.com/social-media/xs-open-source-algorithm-isnt-a-win-for-transparency-researchers-say-181836233.html) — Engadget, interviewing researchers at Cornell, Graz and CMU
- [X For You Feed Algorithm — Hacker News](https://news.ycombinator.com/item?id=46688173) — community discussion at the time of the January release
- [Under the Hood label transparency tool](https://x.com/i/under_the_hood) — X's pilot page for per-account label stats
