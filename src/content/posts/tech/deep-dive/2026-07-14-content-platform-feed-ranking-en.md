---
title: "How Content Platforms Rank Their Feeds: From Reddit's Formula to TikTok's Interest Graph"
date: 2026-07-14
type: deep-dive
category: tech
tags: [feed, ranking, recommendation, algorithm, reddit, tiktok, product]
lang: en
tldr: "Take apart the feed ranking of ten platforms and they're all solving the same problem: how to trade off between newest, best, and letting new content be seen. What actually decides your answer isn't how clever the algorithm is, but whether your content is oversupplied or scarce — big platforms rank to filter content out, small communities want every post to be seen."
description: "A tour through content-platform feed algorithms: from the formula-based ranking of Reddit Hot and Hacker News, to the ML multi-objective ranking of Facebook/Instagram/Twitter, to TikTok/YouTube's interest graph and Mastodon/Bluesky's chronological feeds — each platform's mechanism, formula, and cold-start strategy, distilled into a decision framework for small communities."
glossary:
  - term: "cold start"
    aliases: ["冷啟動"]
    definition: "Freshly published content with no interaction history lacks the signals a ranking algorithm scores on, so it easily sinks the moment it's posted. Giving new content initial exposure is the cold-start problem."
    context: "The core observation of this piece: nearly every platform reserves a dedicated exposure path for cold start — none lets pure engagement ranking decide a new post's fate."
  - term: "dwell time"
    aliases: ["停留時間"]
    definition: "The number of seconds a user actually spends on a piece of content. Compared with a binary signal like 'did they like it', dwell time is continuous, low-noise, and abundant — it's a core ranking signal for platforms like LinkedIn."
    context: "LinkedIn uses it as both a positive signal (passive consumption is preference) and a negative one (predicting posts you'll skip quickly, and downranking them)."
  - term: "EdgeRank"
    definition: "Facebook's early, publicly-described News Feed formula, which scored each post by multiplying three factors: affinity, content weight, and time decay. Replaced by machine learning after 2011."
    context: "Its three concepts still live inside the intuition of today's ML models — the best starting point for understanding the 'engagement ranking' mindset."
---

🌏 [中文版](/posts/tech/deep-dive/2026-07-14-content-platform-feed-ranking)

Every feed pulls against two forces. One is **time** — the newest content should be seen. The other is **engagement** — the content most people like, comment on, and finish should be seen. Rank purely by time and good content gets washed away; rank purely by engagement and fresh, not-yet-reacted-to content sinks forever. Every ranking algorithm, at its core, is just tuning the mix of these two forces.

But before comparing approaches, there's a more important — and often ignored — premise: **supply and demand**. Big platforms rank to solve content **oversupply**; their job is to *filter out*. Small communities face content **scarcity**; you actually want every post to be seen. This difference decides everything. As you read each platform below, the real question isn't "how clever is it," but "is it solving oversupply or scarcity?"

## Formula-based ranking: one line of math balancing time and votes

The most transparent kind. No machine learning — just a formula anyone can read.

**Reddit's Hot** puts votes and age into the same score:

```
hot = sign(s) · log₁₀(max(|s|, 1)) + (t_post − 1134028003) / 45000
      s = upvotes − downvotes,  t_post = post creation epoch seconds
```

The soul of it is that **votes are logarithmic while time is a linear additive term**. The first 10 votes carry as much weight as the next 100 — early votes matter enormously. The time term bakes the moment of posting directly into the score as a permanent head start: the score doesn't decay with time, newer posts simply start higher. The constant `45000` seconds means a post roughly 12.5 hours older needs about 10× the net votes to hold its position.

**Hacker News** looks similar but works in reverse:

```
score = (P − 1)^0.8 / (T + 2)^1.8 × penalties
        P = votes (minus the author's self-vote),  T = age (hours)
```

The denominator exponent (1.8) exceeds the numerator exponent (0.8), so the score **genuinely decays** with age, continuously and steeply — even a high-scoring story falls off the front page within a day. This is real decay, versus Reddit's "frozen timestamp" additive term. HN also multiplies in an opaque layer of penalties (flags, vote-ring detection, a controversy/flame-war penalty).

Both handle cold start with a chronological back door: new content first lands in Reddit's **New** or HN's `/newest` to gather its first votes, and Reddit's **Rising** specifically surfaces posts whose vote velocity is unusually high relative to their very young age — giving genuinely trending new content an early path to visibility.

## ML multi-objective ranking: predict what you'll do, then weight it

The mainstream for large social platforms. No longer one formula, but predicting "the probability you'll like / comment / share / finish" each candidate, then summing with weights.

The origin of this mindset is Facebook's **EdgeRank** (`affinity × content weight × time decay`). After 2011 the three hand-tuned coefficients were replaced by machine learning; by 2013 Facebook said the model considered "100,000+" signals. The 2018 "Meaningful Social Interactions" change was a deliberate pivot: **upranking posts that spark back-and-forth conversation between people, downranking passive consumption** like pre-recorded video and publisher content — while "engagement-bait" that goads people into commenting was explicitly excluded and kept demoted.

**Instagram's** key is the line Mosseri repeats: "Instagram is not one algorithm." Feed, Stories, Explore, and Reels each have their own ranking with entirely different objectives — Stories favors close relationships, Explore favors discovery, Reels favors watch-through. A strategy that wins on one surface fails on another.

**Twitter/X** open-sourced its full pipeline in 2023: from ~500M daily posts, it distills the For You feed through "candidate sourcing (~1,500, roughly 50/50 in-network vs out-of-network) → light ranker / heavy ranker (a ~48M-parameter neural net outputting ~10 engagement probabilities per post) → heuristic filtering and mixing." The open-sourced heavy-ranker weights are instructive:

| Predicted engagement signal | Weight |
|---|---|
| Reply, and the author replies back to you | +75 |
| Reply | +27 |
| Like (the baseline) | +0.5 |
| Negative feedback (show less / block / mute) | −74 |
| Report | −369 |

A reply is worth ~54 likes, and a reply the author responds to is worth ~150 likes — **conversation is king**. Meanwhile a single report is nearly a kill switch: **negative signals dominate overwhelmingly**.

**LinkedIn** sits at the most relevance-leaning end. It treats **dwell time** as a core signal (the rationale: it's more continuous and less noisy than sparse, binary clicks), and explicitly states the system is **deliberately designed not to optimize for virality**, systematically reducing distribution of bait and spam — "the most successful posts won't always be the ones with the most likes."

## Interest graph + exploration: not who you follow, just your interests

The most radical end. Ranking barely depends on the social graph.

**TikTok** explicitly states that follower count and a creator's past hits are *not* direct ranking factors: who a video reaches depends on how well it matches that audience's interests, so a zero-follower account's first video can reach millions. The ranking equation from the leaked document looks like this:

```
score = Plike·Vlike + Pcomment·Vcomment + Eplaytime·Vplaytime + Pplay·Vplay
        P = predicted probability of an action,  E = expected value,  V = the action's assigned value weight
```

Its cold start is the most explicit in the industry: a new video is first shown to a small **test audience**, its completion rate, rewatches, and interactions are measured, and only if it clears a bar does it **scale out wave by wave** — which is why videos can "go viral days later" and old videos can "resurface."

**YouTube** optimizes for **expected watch time**, not clicks (ranking by click-through rate breeds clickbait). It uses a two-stage architecture (candidate generation → ranking) and handles freshness with a feature called **example age**: during training, the age of each example is fed in as a feature; at inference it's set to zero, effectively telling the model "we're at the very end of the training window," which boosts freshly uploaded videos.

## Chronological and composable: handing the decision back to the user

The other end of the spectrum. **Mastodon**'s design principle is reverse-chronological, no algorithm, no ads — the only ranking-like behavior, "trending," is quarantined to the Explore tab and requires admin approval. **Bluesky** goes further: the default Following timeline is purely chronological, but through the AT Protocol's **feed generators**, anyone can publish a feed algorithm that users freely subscribe to, pin, and reorder — turning "whether to use an algorithm, and which one" into an open marketplace rather than a single ranking imposed by the platform.

## The big picture: one spectrum

Line up all ten on a single axis and a clean gradient appears — the left is where the user/time decides the order, the right is where the platform/engagement signals decide:

```
Cold (time) ←──────────────────────────────────────────→ Warm (algorithm)

Mastodon      Bluesky        Reddit Hot     Facebook / IG      TikTok
Bluesky       custom feeds   Hacker News    Twitter For You    YouTube
(Following)   (composable)   (formula)      LinkedIn (ML)      (interest graph)

pure chrono   marketplace    one equation   predict your        interest-only
no ranking    pick a ranker  transparent    actions, weight     actively tests
                                            and rank            new content
```

And no matter where a platform lands on this spectrum, they all do one thing: **reserve a dedicated initial-exposure path for new content**. TikTok's exploration pool, Reddit's Rising, YouTube's example age, Instagram/LinkedIn's small-audience testing, Mastodon/Bluesky's chronological "guaranteed delivery" — these are the same idea implemented differently: **give new content an exposure window first, then let early reactions decide whether to amplify**. The only difference is how big the window is and how aggressively it scales — which comes back to supply and demand: the more oversupplied the content, the smaller the window and the harsher the filtering.

## What this means for small communities

If your product's content is **scarce** (only a handful of new posts a day), every engagement-ranking approach above — all designed for oversupply — will backfire and bury the little new content you have. A few directly usable conclusions:

- **The right answer for scarcity is chronological, not engagement ranking.** Small communities forcing on engagement ranking is usually premature optimization.
- **"Bump on interaction" is a mature old trick.** Forum bumping and Reddit Rising both do it. In practice you can use `activity_time = GREATEST(created_at, last_interaction_at)` as the sort key: new content enters by creation time, old content bumps back up when interacted with, and new and old naturally interleave.
- **Give new content a guaranteed exposure window.** This isn't something you invent — it's the minimalist version of TikTok's exploration pool / YouTube's example age / Reddit's Rising: guarantee every new post is seen at least once.
- **If you want "hot," make it a separate tab — don't fold it into the main feed's ranking.** Reddit (Hot / New / Rising), X (For You / Following) all split rankings into user-selectable tabs.
- **Don't re-rank inside a cursor window.** Big platforms paginate with a session snapshot + offset, not "fetch a batch → re-rank live → then paginate by time" — the latter permanently skips demoted content when you page. The sort key must match the cursor, and be monotonic.

## Overall

What big platforms actually teach us isn't "how to rank," but **"when you don't need to rank"** — and that even when you do, you always leave new content a guaranteed path to exposure. The complexity of ranking algorithms only pays off once content is so oversupplied that chronological can't hold it. Until that day comes, chronological + bump-on-interaction + a new-content exposure window is almost always the better choice.

---

## References

- [How Reddit ranking algorithms work (with _sorts.pyx source)](https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111e33d0d9)
- [Evan Miller — Deriving the Reddit Formula (Wilson interval)](https://www.evanmiller.org/deriving-the-reddit-formula.html)
- [Ken Shirriff — How Hacker News ranking really works](http://www.righto.com/2013/11/how-hacker-news-ranking-really-works.html)
- [Mosseri — Bringing People Closer Together (Facebook MSI announcement)](https://about.fb.com/news/2018/01/news-feed-fyi-bringing-people-closer-together/)
- [Mosseri — Instagram Ranking Explained (2023)](https://about.instagram.com/blog/announcements/instagram-ranking-explained)
- [Twitter Engineering — Twitter's Recommendation Algorithm (official)](https://blog.x.com/engineering/en_us/topics/open-source/2023/twitter-recommendation-algorithm)
- [GitHub — twitter/the-algorithm](https://github.com/twitter/the-algorithm)
- [LinkedIn Engineering — Understanding Feed Dwell Time](https://www.linkedin.com/blog/engineering/feed/understanding-feed-dwell-time)
- [TikTok Newsroom — How TikTok recommends videos #ForYou](https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you)
- [Covington et al. — Deep Neural Networks for YouTube Recommendations (RecSys 2016)](https://research.google.com/pubs/archive/45530.pdf)
- [Bluesky — Algorithmic Choice with Custom Feeds](https://bsky.social/about/blog/7-27-2023-custom-feeds)
- [Mastodon 3.0 in depth (trends require admin approval)](https://blog.joinmastodon.org/2019/10/mastodon-3.0-in-depth/)
