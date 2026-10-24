---
title: "Building Anchors: Redundancy, No Extension, and How Much Force an Anchor Really Takes"
date: 2026-10-17
category: climbing
tags: [climbing, trad-climbing, multi-pitch, outdoor-climbing, taiwan]
lang: en
type: guide
series:
  name: "Sport and Trad Climbing"
  order: 11
description: "How to build an anchor two people can hang on from nuts and cams when there are no bolts at the top: what the SERENE and ERNEST checklists are checking, Petzl's real-person fall forces, the quad vs cordelette trade-off, and the 2019 Long Dong accident on #313 where a whole trad anchor pulled out."
tldr: "An anchor has to pass three tests: each piece is strong, another piece takes over if one fails (redundancy), and a failure does not drop the load onto the remaining pieces (no extension). In Petzl's tests with 80 kg people, a factor 1 fall put about 4 kN on the climber, 2 kN on the belayer and 6 kN on the top piece. A quad adapts to changes in direction but shock-loads the other point if one fails. In 2019 a three-piece trad anchor on Long Dong's #313 pulled out completely as two climbers weighted it."
draft: false
glossary:
  - term: "Anchor"
    aliases: ["固定點", "belay station", "確保站"]
    definition: "Several pieces of protection linked together so climbers can clip in to belay or rest. On a single pitch it is at the top; on a multi-pitch route it is at the end of each pitch."
    context: "This post covers anchors you build from nuts and cams when there are no bolts at the top."
  - term: "Master point"
    aliases: ["主點", "equalization point"]
    definition: "The loop or knot where the force from all the anchor pieces comes together. The belay device, rope and tethers clip here."
    context: "With a cordelette, the master point is usually a figure 8 on a bight."
  - term: "Fall factor"
    aliases: ["墜落係數"]
    definition: "Fall length divided by the length of rope between belayer and climber. The higher it is, the less rope there is to absorb the energy, and the harsher the fall. In climbing it ranges from 0 to 2."
    context: "This post uses Petzl's definition and test data."
  - term: "Extension"
    aliases: ["延伸", "shock load"]
    definition: "When one anchor piece fails and the master point drops some distance before the other pieces catch it. That drop hits the remaining pieces with a sudden load."
    context: "The No Extension in SERENE and ERNEST is about preventing this."
  - term: "Quad"
    aliases: ["四股均分"]
    definition: "A long sling or cord doubled into four strands, with a knot near each end; the master carabiner clips two of the four strands between the knots. Both points keep sharing the load when the direction of pull changes."
    context: "Petzl lists it as one of the common belay anchors on bolted multi-pitch routes."
---

> 🌏 [中文版](/posts/climbing/2026-10-17-building-anchors)

May 16, 2019, route #313 Canaleta in Long Dong's Auditorium area. According to the [Long Dong chronicle kept by TOCC (臺灣戶外攀岩協會, a Taiwanese outdoor climbing association)](https://www.tocc-climbing.org/chronicle-of-events), a party of three was climbing the route. The leader topped out, built an anchor with trad gear and belayed the second up. When the second reached the belay and both climbers weighted the anchor, all three pieces popped out for reasons that remain unknown. The two fell about 20 meters to the ground, and one was left with a permanent disability. TOCC records it as the first serious multiple-casualty accident at Long Dong.

The anchor is the last thing the whole party relies on. A lead fall sends force into it; when you belay a second, both of you hang from it. The previous post, [Trad Protection](/posts/climbing/2026-10-17-trad-protection-nuts-cams-en), covered how to place a single piece well. This one covers how to combine pieces into an anchor and how much force it really has to hold.

By the end you should be able to check an anchor someone else built: is it redundant, and will it extend?

To be clear up front: **this post does not replace a course.** You learn anchors by building them again and again in front of someone experienced who takes them apart and tells you what is wrong.

## Intuition: three tests

Think of an anchor as a hammock hung from several ropes. You would ask three things:

1. **Is each rope tied to something solid?** (each piece is strong)
2. **If one rope breaks, do the others hold?** (redundancy)
3. **When one breaks, does the hammock drop before the others catch it?** (no extension)

Climbers have turned this into acronyms. [American Alpine Institute](https://alpineinstitute.com/serene-and-ernest-anchors) lists the two most common, SERENE and ERNEST, and says they are "basically equivalent": some schools teach one, some the other.

| Letter | Meaning | What it checks |
|---|---|---|
| S (Solid) | Strong pieces | Each piece is strong enough on its own |
| R (Redundant) | Redundancy | More than one piece; if one fails, another holds |
| E (Equalized) | Load sharing | Each piece shares the load |
| N.E. (No Extension) | No extension | One failure does not shock-load the rest |
| T / E (Timely / Efficient) | Speed | You can build it in a reasonable time |

Trad courses in Taiwan use these too: [Adventure Taiwan's single-pitch trad course](https://www.adventuretaiwan.com/product/single-pitch-trad-climbing/) teaches E.A.R.N.E.S.T., and [Wild Lily Rocks](https://www.wildlily.rocks/full-course) teaches SERENE. An acronym is just a checklist; the sections below look at the reasoning behind each item.

### Redundancy: how many pieces

[Petzl's belay anchor tech tip](https://petzl.com/us/en/sport/tech-tips/basic-techniques/building-a-belay-anchor-and-belaying-on-a-bolted-multi-pitch-route/Relais-grande-voie_SPO_a77Tx000000E3MEIA0.html) sets the floor at two linked anchor points, in case one fails. That is for bolted multi-pitch routes; Petzl notes that on trad routes with nuts and cams, some of its concepts may not apply.

With trad gear the number goes up. AMGA Certified Rock Guide [Elaina Arenz](https://www.climbing.com/skills/gym-to-crag-trad-climbing-outdoor-research/) asks for at least three pieces in a gear anchor. Her check is easy to remember: if someone cut any part of it with magic scissors, the whole thing should not fall apart.

HowNOT2 actually ran the magic-scissors test. From 11:40, they cut one leg of a loaded Dyneema sling with a knife to mimic a rock edge or a failed piece: master points tied with a girth hitch or a clove hitch slipped all the way through the knot, and the girth hitch let go at about 4 kN. It is a backyard slow pull with one or two tries per setup, and Ryan calls it entertainment, not science. What it shows is that the master point itself has to survive the scissors check; it does not answer how many pieces you need.

```youtube
url: https://www.youtube.com/watch?v=-MmX8h4F0po
title: Are climbing master points made with a girth hitch or clove hitch REDUNDANT??? (HowNOT2)
start: 700
```

### Equalization: never perfectly even

Equalization sounds like each piece taking the same share of the load. In practice that is hard. [Karsten Delap writes in "Strong Anchors"](https://www.karstendelap.com/blog/strong-anchors) that true equalization is fairly unachievable even in lab settings. So the vocabulary is shifting from "equalized" toward "distribution of force": directing more of the load to the pieces you judge to be stronger.

Delap also argues that strength is the most important attribute, and that chasing redundancy means carrying more gear and building more slowly. But his advice for beginning trad climbers is still **at least three pieces**, because redundancy covers mistakes you cannot yet see.

### Angle: the wider the legs, the more each piece takes

The smaller the angle between the two legs running to the master point, the lower the load on each piece. Petzl suggests **90° as an upper limit**, easy to remember and to spot; Arenz says no more than 60 to 90°.

In HowNOT2's "American Death Triangle is a Myth", start at the third test (7:23). Instructor Bobby explains that he teaches students to stay under Petzl's limit, then they spread the legs well past it and each bolt sees about 1.5 times the master-point load. Two people pull by hand and the angles are eyeballed with a protractor, so the loads are only a few kN. The "myth" in the title is that the forces were less dramatic than Ryan expected; he also says in the video that this rig is not redundant and should not be copied.

```youtube
url: https://www.youtube.com/watch?v=7sQNpjnJe40
title: American Death Triangle is a Myth (HowNOT2)
start: 443
```

**Something to do tonight**: hang a sling with two carabiners between two door handles (or chair backs), tie a knot for a master point and pull down. Move the two points farther apart and pull again. Watch how the angle between the legs changes.

## Mechanism: how much force does an anchor take?

### Fall factor: a ratio, not a distance

[Petzl's explanation of fall factor](https://petzl.com/us/en/sport/tech-tips/basic-techniques/fall-factor-and-impact-force---theory/CORDES-chute-theorie_SPO_a77w0000000KywUAAS.html): how severe a fall is depends on the ratio of fall length to the rope paid out. The longer the rope, the more energy it can absorb.

Take the same 4 m fall: with 10 m of rope out, severity is low; with only 2 m out, it is high.

<details><summary>The formula and two examples (Petzl)</summary>

Theoretical fall factor = fall length ÷ rope length (the rope between belayer and climber)

- Rope 10 m, fall 4 m: 4 ÷ 10 = 0.4, low severity.
- Rope 2 m, fall 4 m: 4 ÷ 2 = 2, high severity.

In climbing the value ranges from 0 to 2. In reality, friction against the rock and in quickdraws means only part of the rope stretches to absorb the energy. Petzl therefore defines an actual fall factor = fall length ÷ effective rope length. With poor rope drag management, the actual factor can be much higher than the theoretical one.

</details>

This explains something counterintuitive: **a short fall just after leaving a multi-pitch belay is harsher than a longer fall halfway up a pitch.** With little rope out, the factor is high. Petzl's belay anchor tech tip says a lead fall is when the anchor sees the highest loads, and even more so at the start of a pitch: less rope, a high fall factor, and little quickdraw friction.

Hard Is Easy comes at the same idea from another angle. From 11:22 the video compares a long whipper with a short fall just above a bolt where the belayer catches hard. Working out stopping distance from rope stretch by hand, the author concludes the big fall is about 2.5 times softer on the climber, which matches the idea that more rope absorbs more. But his video description says he deliberately skipped fall factor, which he thinks means almost nothing in lead climbing because the formula ignores whether the catch was soft or hard. The two views sit side by side: this post follows Petzl and uses fall factor to compare the effect of rope length, while the softness of the catch is a separate variable to look at on its own. The video's numbers are the author's estimate, not measured falls.

```youtube
url: https://www.youtube.com/watch?v=WyExE2qH4Fs
title: Falling physics that Every Climber Needs to know (Hard Is Easy)
start: 682
```

### Real-person tests: the top piece takes the most

The big numbers you see in specs mostly come from standard tests: metal masses, fixed points, harsh conditions. Petzl ran [a series of field falls with real people](https://petzl.com/us/en/sport/tech-tips/product-information-and-specifications/forces-at-work-in-a-real-fall/CORDES-chute-efforts_SPO_a77w0000000KywPAAS.html): an 80 kg climber, an 80 kg belayer, and a GRIGRI 2.

| Situation | Fall factor | Climber | Belayer | Top piece |
|---|---|---|---|---|
| Ordinary single-pitch fall (6.9 m of rope, 2 m fall) | 0.3 | ≈2.5 kN | ≈1.5 kN | ≈4 kN |
| Start of a multi-pitch pitch (3 m of rope, 2 m fall) | 0.7 | ≈3 kN | ≈2 kN | ≈5 kN |
| Just leaving a multi-pitch belay (3.6 m of rope, 3.6 m fall) | 1 | ≈4 kN | ≈2 kN | ≈6 kN |

Petzl puts the uncertainty at about ±0.3 kN and says the values apply only to the tested setups. The pattern is still clear: **the top piece takes the most force every time**, and the numbers equal the climber's and belayer's loads added together. The rope changes direction there; Petzl calls it the pulley effect.

For the factor 1 test, Petzl's note is that 6 kN is no problem for a solid fixed anchor, but critical on a dubious point such as a small wire or a bad piton. Recall the standard from the previous post: the minimum for a nut is only 2 kN.

<details><summary>Why the top piece takes double</summary>

The rope runs through the top piece and turns back down, with the climber on one side and the belayer on the other. In a fall both sides go tight, so the piece is pulled down by both. Petzl's belay anchor tech tip calls this overloading the redirect point and lists it as the first major risk in a lead fall: with a high fall factor, the force can exceed what a less reliable point can hold, especially the redirect.

</details>

In HowNOT2's "Gym Climbing Forces", from 1:40, Ryan puts three LineScale 3 load cells on the climber, the belayer and the quickdraw at the same time. The pattern matches Petzl's: the quickdraw takes the most, and in the gym falls he compiled it mostly landed in the high-3 to mid-4 kN range. The difference is that he often found the quickdraw reading higher than climber plus belayer, which he puts down to friction between rope and draw. These are a handful of gym falls at different body weights from Petzl's test, and the LineScale 3 is a device Ryan helped develop and sells in his shop. Go by Petzl's table for the numbers; the video is useful for seeing the top draw being pulled from both sides.

```youtube
url: https://www.youtube.com/watch?v=fZIj5HAV8xA
title: Gym Climbing Forces - Climbing Science (HowNOT2)
start: 100
```

**Something to do tonight**: next time you watch someone lead in the gym, find their highest quickdraw. If they fell now, that draw would be pulled by both the climber and the belayer.

## Back to practice: quad, cordelette and the master point

There are many ways to build an anchor. Here are two common ones, with the focus on what happens when one piece fails.

### Quad: adapts to direction, but extends

Petzl lists the quad as a common belay anchor on bolted multi-pitch routes and gives specific pros and cons:

- **Pros**: both points keep sharing the load when the direction of pull changes; the master loop can be split into two independent loops, which makes clipping several carabiners easier.
- **Cons**: if one point fails, the equalization point falls to the end of the loop and shock-loads the other point. The farther apart the knots, the more lateral movement, but the higher the impact force if a point fails.
- **Key detail**: the master carabiner must clip two of the four strands between the knots.

### Cordelette: a knot locks the master point

The gear anchor Arenz teaches uses a cordelette (a long loop of accessory cord) or a double-length sling:

1. Clip it into all three pieces.
2. With your index finger, pull the cord between the pieces into three loops and floss the strands side to side so each leg shares the load.
3. Tie a figure 8 on a bight for the master point. The knot also gives the connecting material redundancy and limits extension if any single placement fails.
4. Pluck each leg like a guitar string. Every one should be tight; a loose leg means uneven load sharing, so retie the master point.

Petzl's description of a "mono-directional equalized" belay anchor is a useful comparison: no shock load when a point fails, but poor load distribution under a sideways pull. My reading is that tying off the master point trades in the opposite direction from the quad: less extension, at the cost of load sharing that degrades when the direction of pull changes.

### Do knots weaken the sling?

Yes, but it is usually still enough. [Black Diamond's QC Lab](https://blackdiamondequipment.com/blogs/stories/qc-lab-sling-strength-in-3-anchor-configurations) tested three setups on a 48-inch sling:

- Sliding X: the tensile tester could not break it.
- Sliding X with knots, and figure 8: both broke above 20 kN, always at the knot. Knots reduced strength by 40 to 60%.

Two things to keep in mind. First, BD tested one sample per setup. Second, BD states that it is only comparing strength and **not addressing extension, shock loading, or how equalized each setup really is**. So the test tells you a knotted sling is strong enough; it does not tell you which anchor is safer.

American Alpine Institute adds that a self-equalizing sliding X (the "Magic X") must have load-limiting knots, or it will extend if a piece fails. Petzl's semi-directional version likewise needs a twist in one strand so the sling captures the carabiner if a point fails.

HowNOT2 has broken knotted slings too. From 6:20, they tie an overhand knot in the middle of a narrow Dyneema sling and pull it: every one breaks at the knot, and Ryan works out a loss of more than 60%. That is a bigger drop than BD's, possibly because narrow Dyneema is especially sensitive to knots, so the two are not directly comparable. Later in the video they pull a sliding X with limiter knots, and when a knot breaks the whole thing unravels, so it is not fully redundant. Each setup is two new and two old slings, all slow pulls; in the same video the slings that were several years old were clearly weaker than new ones even in a straight pull.

```youtube
url: https://www.youtube.com/watch?v=NwbMfh4FqT4
title: Mammut Dyneema Climbing Slings Tested - Limiter Knots are NOT redundant!!! (HowNOT2)
start: 380
```

**Something to do tonight**: with a 180 cm sling (the length Petzl uses for a quad), build a quad and then a sliding X between two door handles. Unclip one side each time and see how far the master point drops.

## Multi-pitch: how the belay method changes what the anchor must hold

A single-pitch anchor only has to hold a top rope. On a multi-pitch route the belay also has to hold a leader fall, and how the leader is belayed changes the direction and size of the force on it. [Multi-Pitch Basics](/posts/climbing/2026-10-17-multi-pitch-basics-en#two-schools-belaying-off-the-anchor-or-off-the-harness) compares each country's default for belaying the leader; this section covers only what that means for the anchor.

### ACMG: when to switch to a fixed-point belay, and how strong the anchor must be

The Association of Canadian Mountain Guides' [TechFiles](http://web.archive.org/web/20220402105149/https://www.acmg.ca/05pdf/TechFiles/TechFiles_Vol1_No1.pdf) defines a fixed-point belay as belaying the leader with a device or Munter hitch attached directly to a fixed point on the anchor: the force of a fall goes straight to the anchor, and the belayer only provides braking. It lists four situations to consider one:

- A leader fall is likely: a hard grade or wet rock.
- A high fall factor is possible.
- A long fall is possible: slab routes or alpine ice.
- The belay itself is compromised: an inexperienced belayer, icy ropes, a poor stance.

A fixed-point belay raises the bar for the anchor:

- **At least two good multi-directional pieces**: two bolts, horizontally placed cams, ice screws. A leader fall can pull upward, so pieces that only hold a downward pull don't count.
- **The fixed point itself must be anchor strength**: about 20 kN, says the ACMG. With common webbing or cord, the fixed point may need a doubled strand.
- **The fixed point at about chest height**, so rope handling stays efficient.
- **Device choice**: the Munter is often the most versatile. With a tube device, redirect the brake strand, or have reliable leader protection near the belay.

### CAI: three belay methods, three different anchor loads

The Italian Alpine Club's national schools commission, in its [2016 teaching paper on belay stations](https://organizzazione.cai.it/commissione-nazionale-scuole-alpinismo-scialpinismo-arrampicata-libera-vfg/wp-content/uploads/sites/107/2025/01/2016-03-29-Soste-per-Alpinismo-Didattica.pdf), has students learn three ways to belay a leader:

- **Classic** (classica): a Munter hitch on the anchor. Beginner courses teach this first, because the student isn't drawn directly into the leader's fall and holds it more effectively.
- **Balanced** (bilanciata) and **ventral** (ventrale): the belayer hangs from the anchor's master point and becomes part of the system when the leader falls. In the ventral method the device is on the harness, and a "false runner" must be clipped to the master point as a directional.

The ventral method is a trade-off. The false runner acts like a pulley, so the anchor takes more force than with the other two methods: about 1–1.5 kN more in CAI's tests. But the load on the leader's last runner drops a lot, which is why it's used. CAI's conclusion: the leader should place the first runner right after leaving the belay, so the anchor doesn't carry that extra load for long.

When the belayer hangs from the master point, CAI asks for two more things: a fixed anchor (master point locked with a knot) rather than a sliding one, and the belayer's tether on the master point. That way, if one piece fails, the belayer doesn't drop with it. On adventure terrain where you build your own belays, CAI recommends the ventral method to reduce the load on runners, combined with a fixed anchor and a false runner on the master point.

**Something you can do tonight**: lay out the gear you usually build belays with. Picture which way the pull goes if the leader falls just after leaving the stance, then ask: can every piece hold an upward pull?

## Checking someone else's anchor

When you arrive at a belay as the second, or see someone's anchor at the crag, check it in this order:

1. **Is each piece a good placement?** Use the three conditions from the previous post: rock, size, direction. Anchor strength starts with single pieces.
2. **How many independent pieces?** At least three for a gear anchor. Imagine cutting any one part: does the rest still hold?
3. **If one piece fails, how far does the master point drop?** Find the knots. The spacing between a quad's knots, or whether a sliding X has limiting knots, sets the extension.
4. **What is the angle between the legs?** Above 90°, adjust it.
5. **Will the direction of pull change?** Belaying the second and a lead fall after leaving the belay can pull in different directions. Petzl lists "shares the load when the direction changes" as the quad's main advantage for exactly this reason.

Back to #313. According to Petzl, climbers simply hanging on an anchor apply a static body-weight load, which cannot make reliable anchor points fail. The #313 anchor came out at exactly that moment, as two people weighted it, and the cause is still unknown. We do not know which link failed, but one thing is certain: **the moment before you weight an anchor is your last chance to check it.** When the second arrives and before either of you commits your weight, both of you should look at the anchor.

## Going further

This post stops at single-pitch anchors. Multi-pitch belays add more: a lead fall just after leaving the belay, the belayer being pulled into the rock, and who clips where during a changeover. The next post, [Multi-Pitch Basics](/posts/climbing/2026-10-17-multi-pitch-basics-en), covers those.

For a course, Adventure Taiwan's single-pitch trad course is two days and 14 hours and teaches E.A.R.N.E.S.T. along with pre-equalized and self-equalizing systems. Wild Lily Rocks' full course includes a SERENE belay demonstration and simple fall-force calculations. Course comparisons and the order to learn things in are in [Learning Path and Common Accidents](/posts/climbing/2026-10-17-sport-to-trad-learning-path-en).

## Practice: four scenarios

The answer is under each question; think first, then look. For more questions, try [nobodyclimb's rope-system practice: trad anchors](https://nobodyclimb.cc/games/rope-system/learn/trad-anchor).

**1. You second up to the belay and find the leader built the anchor from two cams, both well placed. Clip in and weight it?**

<details><summary>Answer</summary>

Talk to the leader first. Petzl's two-point minimum is for bolted belays; for gear anchors, both Arenz's requirement and Delap's advice for beginners are at least three pieces. Until you can judge that two pieces are strong enough, a third piece is redundancy covering mistakes you cannot see.

</details>

**2. A quad has its two knots tied far apart, so the master point slides a long way side to side. What is the cost?**

<details><summary>Answer</summary>

Per Petzl: the farther apart the knots, the more lateral movement, but if one point fails, the master point drops farther and shock-loads the other point harder.

</details>

**3. On a multi-pitch route, the leader falls 2 m after leaving the belay, with under 3 m of rope out. How serious is this fall?**

<details><summary>Answer</summary>

Serious. Fall factor is about the ratio of fall length to rope length, not how many meters you drop. Little rope means a high factor, and Petzl's belay anchor tech tip lists this as when the anchor sees the highest loads. Petzl's advice: the first piece after the belay must be solid.

</details>

**4. You build a cordelette anchor, pluck the three legs, and one is slack.**

<details><summary>Answer</summary>

That leg is not taking any load, so the anchor is really hanging on the other two pieces. Arenz's fix is to retie the figure 8 master point so all three legs are tight.

</details>

## Further viewing: gear-testing and instruction channels

The videos embedded above come from the two channels below. They are a good place to keep digging; keep each channel's limits in mind.

- **[HowNOT2](https://www.youtube.com/@HowNOT2)**: run by Ryan Jenks. It started in 2016 as highline safety instruction and grew into breaking climbing, caving and canyoneering gear, plus the Bolt Busters series that pulls bolts out of real rock. Its value is in the cases beyond the rated number: knots, wear, old gear, bad placements. Limits: most tests are slow pulls on a home-built rig with one to three samples, and Ryan himself calls it entertainment, not science; the channel is backed by an online gear shop, and some tested items are sold there.
- **[Hard Is Easy](https://www.youtube.com/@HardIsEasy)**: run solo by a climber who signs as Ben, a former software developer. After watching a hard catch slam a climber into the rock in Tonsai, Thailand, he designed his first experiment; the channel now focuses on experiments and physics explanations about belaying, ropes, carabiners and belay devices, with several recent episodes filmed in Mammut's lab. Limits: most experiments are his own design, not EN/UIAA standard tests.

## Update Log

- 2026-10-23: Added "Multi-pitch: how the belay method changes what the anchor must hold", covering the ACMG's fixed-point belay conditions and anchor requirements and how CAI's three belay methods change anchor loads
- 2026-10-23: Added gear-testing videos from HowNOT2, Hard Is Easy and similar channels, plus a channel guide

## References

- [TOCC Long Dong chronicle: the May 16, 2019 accident on #313 (in Mandarin and English)](https://www.tocc-climbing.org/chronicle-of-events)
- [Fixed-point belays and auto-braking devices: TechFiles Vol. 1 No. 1 (ACMG, 2012, Wayback Machine archive)](http://web.archive.org/web/20220402105149/https://www.acmg.ca/05pdf/TechFiles/TechFiles_Vol1_No1.pdf)
- [Belay methods and anchor loads: Soste per alpinismo: didattica (CAI national alpinism schools commission, 2016, Italian PDF)](https://organizzazione.cai.it/commissione-nazionale-scuole-alpinismo-scialpinismo-arrampicata-libera-vfg/wp-content/uploads/sites/107/2025/01/2016-03-29-Soste-per-Alpinismo-Didattica.pdf)
- [Building a belay anchor and belaying on a bolted multi-pitch route (Petzl)](https://petzl.com/us/en/sport/tech-tips/basic-techniques/building-a-belay-anchor-and-belaying-on-a-bolted-multi-pitch-route/Relais-grande-voie_SPO_a77Tx000000E3MEIA0.html)
- [Fall factor and impact force – theory (Petzl)](https://petzl.com/us/en/sport/tech-tips/basic-techniques/fall-factor-and-impact-force---theory/CORDES-chute-theorie_SPO_a77w0000000KywUAAS.html)
- [Forces at work in a real fall (Petzl)](https://petzl.com/us/en/sport/tech-tips/product-information-and-specifications/forces-at-work-in-a-real-fall/CORDES-chute-efforts_SPO_a77w0000000KywPAAS.html)
- [SERENE and ERNEST Anchors (American Alpine Institute)](https://alpineinstitute.com/serene-and-ernest-anchors)
- [Gym to Crag: Trad Climbing (Elaina Arenz, Climbing, 2019)](https://www.climbing.com/skills/gym-to-crag-trad-climbing-outdoor-research/)
- [Strong Anchors (Karsten Delap, 2020)](https://www.karstendelap.com/blog/strong-anchors)
- [QC Lab: Sling Strength in 3 Anchor Configurations (Black Diamond)](https://blackdiamondequipment.com/blogs/stories/qc-lab-sling-strength-in-3-anchor-configurations)
- [Adventure Taiwan: Single-pitch trad climbing (in Mandarin)](https://www.adventuretaiwan.com/product/single-pitch-trad-climbing/)
- [Wild Lily Rocks: Single-pitch trad full course (in Mandarin)](https://www.wildlily.rocks/full-course)
- [nobodyclimb rope-system practice: trad anchors](https://nobodyclimb.cc/games/rope-system/learn/trad-anchor)
- [Trad Protection: Nuts and Cams](/posts/climbing/2026-10-17-trad-protection-nuts-cams-en)
- [Multi-Pitch Basics](/posts/climbing/2026-10-17-multi-pitch-basics-en)
- [Learning Path and Common Accidents](/posts/climbing/2026-10-17-sport-to-trad-learning-path-en)
