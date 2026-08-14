---
title: "X Open-Sources Its Algorithm: Publishing the Weights Made It Clearer Where the Black Box Is"
date: 2026-08-14
category: ai
type: deep-dive
tags: [recommendation, ranking, ai-transparency, open-source, algorithm]
lang: en
tldr: "The 2026-08-13 release added 363,246 lines and published the For You ranking weights for the first time: favorite 0.5, reply 5.0, report −234.0. But the weights are constants — the P(action) that actually decides order comes from a 2560-dim, 8-layer transformer."
description: "Reading xai-org/x-algorithm from source across its three releases: the full weight table, the Phoenix ranking architecture, and what the release actually adds — visibility filtering and the labeling stack behind it."
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

On 2026-08-13, [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm) landed a commit adding 363,246 lines across 2,053 changed files, and handed over the thing people had been demanding for three years: the ranking weights.

The two earlier releases had an awkward detail. In the January and May versions, `home-mixer/scorers/ranking_scorer.rs` was already calling `params.get(FavoriteWeight)` — but the `home-mixer/params/` directory was not in the repo at all. You could read the code and not the numbers. When [Engadget interviewed three researchers in February](https://www.engadget.com/social-media/xs-open-source-algorithm-isnt-a-win-for-transparency-researchers-say-181836233.html), X's stated reason for the omission was "security reasons."

Now it is there: 183 `param!` declarations covering all 26 actions.

And this is the part worth writing about: **once the weights are public, what becomes clearer is how little they decide.**

## Three releases, two orders of magnitude apart

The repo's git history has only 5 commits, all produced by a CI agent, all with the identical message. `--stat` tells the story:

| Release date | Files changed | Lines added | Contents |
|---|---|---|---|
| 2026-01-20 | 79 | 8,816 | Four directories: `home-mixer`, `phoenix`, `thunder`, `candidate-pipeline` |
| 2026-05-15 | 187 | 18,263 | Grox content understanding, ads blending, new candidate sources |
| 2026-08-13 | **2,053** | **363,246** | Weights, visibility filtering, the safety-labeling chain, Phoenix production training code |

[TechCrunch reported](https://techcrunch.com/2026/08/13/x-open-sources-its-ranking-algorithm-letting-users-see-if-theyve-been-shadowbanned) the release made the codebase "roughly 10 to 15 times larger than it was before," which matches git. Worth noting in passing: in January Musk promised updates every four weeks with comprehensive developer notes. Seven months, three releases.

## The weights are constants; the probabilities are what move

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

Three adjustments follow the weighted sum, all in `ranking_scorer.rs`: each post after an author's first is multiplied by a decay factor of 0.5 down to a floor of 0.25; posts from accounts you do not follow are multiplied by 0.75; and authors with fewer than 1,000 impressions and at most 1,000 followers get posts under 24 hours old lifted toward slots 15–16. Post age is a hard cut — `MAX_POST_AGE = 48 * 60 * 60`, dropped outright at 48 hours, with no decay function anywhere.

Before converting `report = −234.0` into "one report costs you 468 likes of reach," read the comment sitting directly above the weight declarations in the same file:

> These weights reflect a combination of how much an action is valued in ranking and typical propensities of these actions across the X network (e.g. negative feedback is overall rare).

**The weights already absorb each action's base rate.** The actual contribution is weight × P(action), and P(report) is orders of magnitude below P(favorite). Dividing two weights to get "worth N likes" is arithmetically fine and drops the premise.

Which is the line worth taking away from the whole table: **the weights are constants, and the only thing varying between two posts is P(action).** Where your post lands is not decided by these 26 numbers. It is decided by the model that emits the probabilities.

(In passing: the widely circulated "a reply is worth 27 likes" is the old value from [twitter/the-algorithm](https://github.com/twitter/the-algorithm), the 2023 release; the current ratio is 10. And "author replies to your reply is worth 75x" refers to a prediction head that **does not exist** among the current 26 targets.)

## Where the black box went

The complexity did not disappear; it was absorbed into the model. The README is blunt about it:

> We have eliminated every single hand-engineered feature and most heuristics from the system.

[`phoenix/README.md`](https://github.com/xai-org/x-algorithm/blob/main/phoenix/README.md) gives the production configuration: the ranking model runs at embedding dimension 2560, 8 transformer layers, grouped-query attention with 20 query heads over 4 KV heads, a history sequence length of 1022, 64 candidates scored per request, and hashed vocabularies of 100M users / 100M items / 30M authors. Retrieval is a two-tower model over a candidate index of 10.24M posts (28.67M on the combined config).

Two design decisions are worth remembering:

**Candidate isolation.** During inference, candidates cannot attend to each other — only to the user and history. A post's score therefore does not depend on which other posts are in the batch, which makes scores cacheable and reproducible. The cost is giving up slate-level optimization.

**Semantic IDs.** Besides hashed IDs, posts carry residual-quantized codes (6 levels × 256) derived from a multimodal embedding. Posts on the same topic share code prefixes, giving the model content-level generalization to posts it has never seen.

This is exactly where the researchers' objection lands. Cornell's John Thickstun told Engadget that decision-making is moving "not just out of public view, but actually really out of view or understanding of even the internal engineers." Graz's Ruggero Lazzaroni put it more bluntly: "We have the code to run the algorithm, but we don't have the model that you need to run the algorithm."

The August release does add training code and synthetic data generators, and `phoenix/QUICKSTART.md` claims a single GPU can run training and gRPC serving end to end; the 128-dim 4-layer mini checkpoint shipped in May was removed, and `TRAINING.md` states plainly that "No pretrained checkpoint is included." TechCrunch reports that ahead of launch, external researchers trained and ran Phoenix from the open source code, without getting per-post scores. **Production weights and training data remain unpublished.** (I have not verified the training path myself — no GPU on hand.)

## What the release actually adds: visibility filtering

Judged on ranking alone, the August release is a modest increment. What is genuinely new is `visibility-filtering/` and the labeling stack feeding it — and X draws the line explicitly in the README:

```
Ranking decides the order        →  home-mixer/scorers/
Visibility decides if it appears →  visibility-filtering/
                                    different services, inputs, rules
```

`visibility-filtering/rules/registry.rs` answers one of three things for each post-viewer pair: allow, interstitial (behind a tappable warning), or drop. Rules come in two sets, and **the first rule that answers drop ends evaluation**:

- **Base policy**: suspended / deactivated / erased / offboarded authors, protected accounts, viewer blocks or mutes the author, muted retweets, spam labels, legal and local-law takedowns, stale posts, interstitials for adult and gore content, and sensitive-content blocks for logged-out, underage or age-unstated viewers.
- **Recommendations-only policy**: 27 further rules that apply **only when the post is a recommendation from an account the viewer does not follow, and that can only drop**. High-recall spam, DMCA media, geo-restricted media, malicious URLs, do-not-amplify, high-precision impersonation, compromised accounts, read-only accounts, accounts with adult avatars or banners.

The same post can be visible to a follower and dropped for someone being recommended it — that design deserves a pause. What used to be argued about as "shadowbanning" is now a public list you can read and criticize rule by rule. It also cascades: `AncillaryVFFilter` removes any post whose ancestor, quoted post or reposted post was itself dropped.

Where do those labels come from? This release puts the whole production line up:

```
Content understanding (runs continuously, off the request path)
  grox/                 classifiers for posts and media (Grok-family)
  media-model-proxy/    image and video models: adult, gore, hateful symbols
  clip/                 the image-text embeddings those models consume
  agatha/               labels an account from how others respond to it
                        (blocks and reports relative to favorites)
  bdsm/                 detects inauthentic accounts from behavioral sequences
  user-cred-v2/         PageRank over the follow graph and engagement edges
        ↓
Labeling rules
  scarecrow/            event-triggered, embeds botmaker as its rule engine
  botmaker/             the rule language itself: syntax, compiler, runtime
  abuse-enforcement-service/  labels, challenges or suspends on model scores
        ↓
  storage → read back on the request path → visibility-filtering
```

The `bdsm/` README is worth reading on its own: a bidirectional transformer encoder over an account's action sequence, using **time-aware RoPE** — rotary position embeddings driven by normalized action timestamps rather than token index — so the model natively represents inter-action timing, burstiness and mechanical cadence. Eight task heads classify FollowBot, LikeBot, EngagementAmplifier, ReplySpamBot, TweetSpamBot, RTBot, MultiActionBot and LegitimateUser.

Shipping alongside it is [Under the Hood](https://x.com/i/under_the_hood): eligible accounts (at least a year old, 10 or more posts in the past month) can download a JSON file showing which visibility-limiting labels were applied to their account and posts over the past calendar month. It is a randomized pilot for now.

What was held back is equally concrete. `grox/flows/*/prompts.py` loads a dozen or so Jinja2 templates, and the number of `.j2` files in the entire repo is **zero**. The operative definition of "does this post violate a rule" is not published at all. X's VP of Product Keith Coleman told TechCrunch this is to stop bad actors from working around the rules to flood the network with spam.

## Overall

What this release changes is not whether you can reproduce X's feed. You cannot — no weights, no data.

What it changes is **where the argument happens**. The old argument was whether they were quietly suppressing people. The new one can be about where those 27 only-drop rules draw the line, whether `report` deserves 468 times the magnitude of `favorite`, and whether dialing `bidirectional_follow_reply_weight_boost` from 20 down to 15 because people were not seeing enough World Cup discussion is good product judgment — that last one is documented by X itself in [`docs/BIDIRECTIONAL_BOOST_CHANGE.md`](https://github.com/xai-org/x-algorithm/blob/main/docs/BIDIRECTIONAL_BOOST_CHANGE.md), down to the 7/10 A/B test, the 7/13 broad launch and the 7/24 adjustment.

That is real transparency, and it is narrow. It turns the *rules* into public text while pushing the *judgment* deeper into models: the ranking judgment lives in Phoenix's 2560 dimensions, and the rule-violation judgment lives in the j2 prompts that were not published. Meanwhile the thing the EU's DSA actually asks for — researcher access to the platform's **outputs** — is precisely what X's API pricing forecloses; [the Hacker News thread](https://news.ycombinator.com/item?id=46688173) spends more energy on that than on the code.

If you build recommendation systems, this repo is probably the most complete production-grade reference architecture publicly available, under Apache-2.0 and usable commercially. If what you care about is why your own posts are not being seen, `param.rs` can only tell you what the platform **values**. To find out what it **decided about you**, you have to download that JSON from Under the Hood.

## References

- [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm) — source for the X For You feed algorithm, Apache-2.0
- [x-algorithm: phoenix/README.md](https://github.com/xai-org/x-algorithm/blob/main/phoenix/README.md) — Phoenix ranking and retrieval architecture, production config table
- [x-algorithm: docs/BIDIRECTIONAL_BOOST_CHANGE.md](https://github.com/xai-org/x-algorithm/blob/main/docs/BIDIRECTIONAL_BOOST_CHANGE.md) — X's own day-by-day record of a ranking parameter change
- [twitter/the-algorithm](https://github.com/twitter/the-algorithm) — the 2023 open source release
- [X open sources its ranking algorithm, letting users see if they've been 'shadowbanned'](https://techcrunch.com/2026/08/13/x-open-sources-its-ranking-algorithm-letting-users-see-if-theyve-been-shadowbanned) — TechCrunch, with an interview with X VP of Product Keith Coleman
- [X open sources its algorithm while facing a transparency fine and Grok controversies](https://techcrunch.com/2026/01/20/x-open-sources-its-algorithm-while-facing-a-transparency-fine-and-grok-controversies/) — TechCrunch on the January 2026 release
- [X's 'open source' algorithm isn't a win for transparency, researchers say](https://www.engadget.com/social-media/xs-open-source-algorithm-isnt-a-win-for-transparency-researchers-say-181836233.html) — Engadget, interviewing researchers at Cornell, Graz and CMU
- [X For You Feed Algorithm — Hacker News](https://news.ycombinator.com/item?id=46688173) — community discussion at the time of the January release
- [Under the Hood label transparency tool](https://x.com/i/under_the_hood) — X's pilot page for per-account label stats
