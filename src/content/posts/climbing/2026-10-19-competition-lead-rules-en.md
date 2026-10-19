---
title: "How Competition Lead Is Scored: High Point, the \"+\", Six Minutes, and Ranking Athletes Who Don't Top"
date: 2026-10-19
category: climbing
tags: [climbing, climbing-competitions, sport-climbing]
lang: en
type: guide
description: "Read lead results: two flash routes in qualification, one on-sight route in the semi-final and final, six minutes each; the result is the last hold controlled, with a '+' if the athlete moved for the next one; why clipping out of sequence, unclipping or climbing past the Last Safe Position means no '+'; how the qualification geometric mean works; how ties go to countback and why medal places can be decided on time; and the pacing and rests to watch on a broadcast."
tldr: "In lead, each route gets one attempt of up to six minutes. Athletes who don't top are ranked by the last hold they controlled; if they controlled it and moved for the next hold, the result gets a '+' and ranks above someone who stopped at the same hold. Qualification takes the geometric mean of the ranks on two routes; in the semi-final and final, ties go to countback first, and remaining podium ties are decided on climbing time."
draft: false
series:
  name: "Climbing Competitions and Pro Climbing"
  order: 2
glossary:
  - term: "on-sight"
    aliases: ["onsight"]
    definition: "Climbing a route first go without having seen anyone else climb it or getting any beta. In competition on-sight rounds, athletes get only a collective observation period, no demonstration."
    context: "Lead semi-finals and finals are on-sight."
  - term: "\"+\""
    aliases: ["plus", "postfix +"]
    definition: "A suffix on a lead result. If the athlete controls a hold and makes an advancing movement towards the next hold before falling, the result is recorded as 'hold number +' and ranks above anyone who stopped at the same hold without moving."
    context: "Scoreboards on stream often show results like '38+'."
  - term: "Last Safe Position"
    definition: "A rulebook term. The position where an athlete controls a marked Safety Hold whose quickdraw hasn't been clipped yet, or a hold beyond which the judges consider further progress unsafe. Any climbing movement past it ends the attempt."
---

> 🌏 [中文版](/posts/climbing/2026-10-19-competition-lead-rules)

Lead finals have a brutal kind of moment. Near the top of the route, the athlete's arms are gone. They hold one hold, throw for the next, brush it with their fingertips and fall. The scoreboard shows "41+". Another athlete falls from the same hold without moving for the next one and gets "41". One plus sign apart, and different places.

This is post 2 of the "Climbing Competitions and Pro Climbing" series. [Post 1](/posts/climbing/2026-10-19-competition-bouldering-rules-en) covered how bouldering ranks athletes by points. This post covers lead: one route, one attempt, and how athletes who don't reach the top get ranked. By the end, when two athletes fall from the same hold, you should be able to say who ranks higher and why.

The rules here come from World Climbing's (formerly IFSC) January 2026 [Competition Rules](https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/jaq7awz9jmqwpddwnbpr.pdf) and Annex A (Lead) of the [Event Regulations](https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/brsjsyh2ea4fxinl8nsa.pdf). Lead means clipping the rope into quickdraws as you climb; if you haven't tried it yet, [Gym Lead Climbing](/posts/climbing/2026-10-17-gym-lead-climbing-en) is an introduction.

## A lead event has three rounds

Per Annex A, Table 1:

| Round | Routes | Mode | Time per route | Advancing |
|---|---|---|---|---|
| Qualification | 2 | Flash | 6 minutes | Top 24 |
| Semi-final | 1 | On-sight | 6 minutes | Top 8 |
| Final | 1 | On-sight | 6 minutes | — |

The difference between **flash** and **on-sight** is how much the athlete knows beforehand:

- **Flash (qualification)**: at least 60 minutes before the start, the organiser provides a route demonstration, on video or live (Annex A §4.7). Athletes know the moves the setters intended, but haven't tried the route.
- **On-sight (semi-final, final)**: no demonstration. All athletes observe the route together for 6 minutes (§4.8), then go back to the isolated warm-up area and come out only when it's their turn.

Each route allows a single scoring attempt. Fall off and it's over, with no second go (Competition Rules §6.1). The only exception is when the judges confirm a Technical Incident (such as a broken or loose hold, as defined in the Competition Rules), in which case the athlete gets a restart (§6.2).

## What is recorded: the last hold controlled

**Top**: clipping the final anchor at the top of the route counts as success (§8.3), recorded as Top.

**No top**: the result is the last scoring hold the athlete controlled with their hands (§9.1). The scoring holds are numbered in advance by the head routesetter, with higher holds getting higher numbers.

"Controlled" covers two cases:

1. The athlete holds it and completes an **establishing movement**, i.e. gets stable on that hold;
2. The athlete holds it and uses it to make an **advancing movement** towards the next hold.

In the second case, the result gets a "+".

### What the "+" means

Suppose hold 30 on the route is a sidepull:

| Athlete | What happens | Result |
|---|---|---|
| A | Moves from hold 29 to hold 30, touches 30 but falls before getting stable | 29+ (moved from hold 29) |
| B | Gets stable on hold 30, falls while adjusting their feet | 30 |
| C | Gets stable on hold 30, moves for hold 31 and misses | 30+ |
| D | Gets stable on hold 31 | 31 |

The ranking is D > C > B > A. A "+" only beats someone at the same hold who didn't move; it never beats someone stable on the next hold. A's hand touched hold 30, but without control it doesn't count as hold 30.

### When there is no "+"

Competition Rules §9.2 says no "+" is awarded when an attempt ends for one of the §8.2 reasons. §8.2 lists three lead-specific failures:

1. **Clipping out of sequence**: skipping a quickdraw and clipping the one above.
2. **Unclipping**: removing a quickdraw that was already clipped, except to fix a z-clip.
3. **Climbing past the Last Safe Position**: carrying on upwards while holding a marked Safety Hold whose quickdraw is still unclipped, or past a point the judges consider unsafe without a clip (see the definitions in the Competition Rules).

The third is the easiest to follow on a broadcast: to save energy, the athlete tries to climb a move or two further before clipping, the judges rule they have passed the Last Safe Position, and the attempt ends. The result stays at the last hold they controlled, with no "+".

## How the ranking works

### A single route

On each route, everyone who topped ranks first, then everyone who didn't, from highest result to lowest (Annex A §7.1).

### Qualification: the geometric mean of two routes

In qualification athletes climb two routes, are ranked on each separately, and their ranks are combined by **geometric mean** (§7.2). Lower is better.

<details>
<summary>The qualification formula and a worked example</summary>

Formula: QP = ⁿ√(P₁ × P₂ × … × Pₙ). Lead qualification has n = 2, so QP = √(rank on route 1 × rank on route 2).

Ranks are fractional: if three athletes tie for 4th, each gets (4 + 5 + 6) ÷ 3 = 5. Results are rounded to three decimal places.

Example:

| Athlete | Route 1 rank | Route 2 rank | QP |
|---|---|---|---|
| E | 1 | 16 | √16 = 4.000 |
| F | 4 | 4 | √16 = 4.000 |
| G | 2 | 9 | √18 ≈ 4.243 |

E has one win and one ordinary result, F is solid on both, and they have the same QP. The effect of the geometric mean is that one outstanding route can make up for the other. G's ranks add up to 11, worse than F's 8, and G is still behind on the geometric mean.

An athlete who has a result on only one route is ranked equal last on the other (Annex A, note 23).

</details>

### Semi-final and final: countback first, then time for medals

The semi-final and final each have one route. When two athletes have the same result, §7.3 applies in order:

1. **Countback to the previous round**: whoever ranked higher after the previous round goes ahead (not used if that round was split into groups).
2. **In the medal round only**: podium ties still left after countback are decided on actual climbing time, shorter is better.

Time is measured in whole seconds, rounded down (Annex A, note 24). For a top, it runs from leaving the ground to the gate closing on the final anchor clip; without a top, it runs to the moment of the fall.

## What to watch for on a broadcast

**Every clip is a decision.** To clip, a lead climber holds on with one hand and pulls rope with the other. Clip too early and you reach higher, which costs more; clip too late and you risk passing the Last Safe Position. Where an athlete clips, and how smoothly, tells you how well they've read the route.

**Rests.** Six minutes sounds like a lot, but [World Climbing's lead page](https://www.worldclimbing.com/lead/index) puts the competition wall at 15 metres, and athletes stop on better holds to shake out and chalk so their forearms recover. Watch where they stop and for how long: rest too long and the clock eats you; don't rest and your arms blow up.

**The "+" near the top.** High on the route, athletes are often out of strength. Moving for the next hold earns a "+" even without catching it, which is why you see athletes make one last desperate lunge before they fall.

**The clock.** In the medal round, ties can be decided on time. So near the top, athletes need to climb fast as well as high. But time only comes in when athletes reach the same hold and countback can't separate them; most of the time height decides everything.

**On-sight observation.** The collective observation before the final lasts only 6 minutes. Athletes point at the wall, mime moves, and plan the whole route in their heads. Broadcasts often show it. Try reading along with them: where does it look hardest? When they climb, do they do it the way they planned?

## Practice: four scenarios

Answers are under each question. Think first, then check.

**1. Athlete H gets stable on hold 35 and falls moving for hold 36. Athlete I touches hold 36 but falls before getting stable. Who ranks higher?**

<details><summary>Answer</summary>

Both score 35+. H controlled hold 35 and moved for the next hold. I touched hold 36 but didn't control it, so the last hold I controlled is still 35, and I also moved from 35 towards 36, so it's 35+ too. They are tied, and it goes to countback to the previous round.

</details>

**2. Athlete J reaches hold 27, keeps going without clipping, and the judges rule he has climbed past the Last Safe Position just as he gets stable on hold 28. What is his result?**

<details><summary>Answer</summary>

Under §8.2, climbing past the Last Safe Position ends the attempt, and §9.2 says no "+" in that case. The result stays at the last hold controlled before passing the Last Safe Position, without a "+". Exactly which hold that is, the judges decide against the head routesetter's scoring topo.

</details>

**3. In qualification, athlete K ranks 3rd and 12th on the two routes; athlete L ranks 6th on both. Who has the better qualification score?**

<details><summary>Answer</summary>

K has √(3 × 12) = √36 = 6.000; L has √(6 × 6) = 6.000. They are equal. Under the geometric mean, one very good route plus one ordinary route can tie with two solid ones.

</details>

**4. In the final both athletes top. M ranked higher than N in the previous round, but N climbed 20 seconds faster. Who gets gold?**

<details><summary>Answer</summary>

M. §7.3 goes to countback first, and M ranked higher, so M wins. Climbing time is used only if they are still tied after countback.

</details>

## Next

Boulder and lead routes change every event, but speed uses the same route everywhere in the world. Why do speed records keep falling? Why is a reaction time under 0.1 seconds a false start? What is the four-lane format in 2026? That is [post 3: speed climbing](/posts/climbing/2026-10-19-competition-speed-climbing-en).

## References

- [World Climbing Competition Rules v3 (2026-01, PDF)](https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/jaq7awz9jmqwpddwnbpr.pdf)
- [World Climbing Event Regulations v3 (2026-01, PDF), Annex A: Lead](https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/brsjsyh2ea4fxinl8nsa.pdf)
- [Lead (World Climbing discipline page)](https://www.worldclimbing.com/lead/index)
- [New rule changes take effect for IFSC World Cup Series 2025 (World Climbing, 2025-03-05)](https://worldclimbing.com/news/new-rule-changes-take-effect-for-ifsc-world-cup-series-2025)
