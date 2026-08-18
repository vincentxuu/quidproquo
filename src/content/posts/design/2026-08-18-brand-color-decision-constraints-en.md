---
title: "Deciding a Brand Color for a New Product: Converge from Three Constraints, Don't Start from a Swatch"
date: 2026-08-18
type: guide
category: design
tags: [brand-color, design-system, accessibility, wcag, design-tokens, product-design]
lang: en
tldr: "A brand color does belong at the start of a new product — but the usual decision order is backwards. Rather than picking a color you like and then checking it, use constraints to narrow the field to three or four candidates first. The three constraints: hues already claimed by function, the accessibility thresholds, and the gap in your competitive set. The first is widely misread: W3C's SC 1.4.1 states that where information relies on accurately perceiving a particular color — the spec's own example is a green outline for valid versus red for invalid — an additional visual indicator is required *regardless of contrast ratio*. So avoiding red and green is not the fix; adding an icon is. Separately, APCA is often described as 'the WCAG 3 algorithm,' while the current draft says the algorithm is yet to be determined."
description: "Using three verifiable constraints — hues claimed by state feedback, WCAG contrast thresholds, and the gap in your competitive set — to narrow brand color candidates down to a decidable number, plus what SC 1.4.1 actually requires of state colors, the conditions attached to color blindness prevalence figures, APCA's real relationship to WCAG 3, and how to lock the final color into Tailwind v4 and shadcn tokens."
draft: false
glossary:
  - term: "SC 1.4.1"
    aliases: ["Use of Color"]
    definition: "A WCAG success criterion (Level A): color must not be the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element."
    definition_en: "A WCAG success criterion (Level A): color must not be the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element."
    advanced: "The criterion's notes draw a distinction. If two colors differ in hue *and* in lightness enough to reach a 3:1 contrast ratio, that luminance difference counts as an additional visual distinction. But where the information relies on the user accurately perceiving a particular color — the spec's own example is a green outline for valid versus red for invalid — an additional visual indicator is required regardless of the contrast ratio."
    advanced_en: "The criterion's notes draw a distinction. If two colors differ in hue *and* in lightness enough to reach a 3:1 contrast ratio, that luminance difference counts as an additional visual distinction. But where the information relies on the user accurately perceiving a particular color — the spec's own example is a green outline for valid versus red for invalid — an additional visual indicator is required regardless of the contrast ratio."
    context: "For correct/incorrect or pass/fail state feedback, this is the criterion that forces an icon or text label; changing the hue does not satisfy it."
    context_en: "For correct/incorrect or pass/fail state feedback, this is the criterion that forces an icon or text label; changing the hue does not satisfy it."
---

> 🌏 [中文版](/posts/design/2026-08-18-brand-color-decision-constraints)

If you are launching a new product, the brand color belongs at the start. It travels with the logo, the OG images, the app icon, and the marketing material — changing it later is not one line of CSS.

The question is not *whether* to decide now. It is that **the decision order is usually backwards**: most people open a palette tool, pick a color they like, and only then check contrast, check whether it collides with a competitor, check whether it clashes with state colors. That order makes you discover the problems *after* you have fallen for a color — at which point you start persuading yourself the problems are not that bad.

Doing it in reverse is less work: **let constraints narrow the field to three or four candidates, and only spend your taste on the last step.** This piece covers what those three constraints are, how to verify each, and the one that is commonly misread badly enough to send people in the wrong direction.

The implementation layer — wiring the final color into Tailwind v4 and shadcn tokens — is in the companion piece, [Auditing Design Resource Sites Against Tailwind v4](/posts/tech/deep-dive/2026-08-18-design-resource-sites-tailwind-v4-en).

## Constraint 1: which hues are already claimed by function

Any product with *state* — correct/incorrect in a learning platform, healthy/failing in a monitoring console, valid/invalid in a form — assigns a few hues to function before you get a say. Users' expectations about those pairings are strong enough that you cannot move them: green passes, red fails.

The common advice is "keep the brand color away from red and green." The direction is right, but it misidentifies what the specification actually requires.

The body of [W3C's SC 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) (Level A) is a single sentence:

> Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.

The part worth reading is the two notes. The first offers an escape hatch:

> If content is conveyed through the use of colors that differ not only in their hue, but that also have a significant difference in lightness, then this counts as an additional visual distinction, as long as the difference in relative luminance between the colors leads to a contrast ratio of 3:1 or greater.

So two colors differing in hue *and* in lightness enough to hit 3:1 can have that luminance difference count as the second cue.

The second note immediately withdraws that escape hatch — and the example it uses is precisely your state colors:

> However, if content relies on the user's ability to accurately perceive or differentiate a particular color an additional visual indicator will be required regardless of the contrast ratio between those colors. For example, knowing whether an outline is green for valid or red for invalid.

**"Regardless of the contrast ratio."** So for information like correct/incorrect that requires accurate color perception, the requirement is not "pick a different hue" — it is that **there must be an icon or a text label**. A ✓ and an ✗, "Correct" and "Try again." Without that, swapping to blue and orange fails just the same.

That reshapes the constraint:

- **Mandatory**: state feedback needs a non-color cue. This is Level A, not a nice-to-have.
- **Still advisable**: keep the brand color off the state hues. The reason is no longer accessibility compliance but **cognitive load** — when the submit button is the same green as "correct," users spend an extra half-second every time working out what that green is saying. That is an experience problem rather than a compliance one, but it is worth avoiding all the same.

Separating the two matters because: if your brand goes the Duolingo route and has to be green, you are not blocked. You simply have to do the differentiation work — iconography, position, area, motion. The route works; it just costs more.

## Constraint 2: the accessibility thresholds (this part is calculated)

A brand color is not there to be looked at. It becomes buttons, links, and focus rings. It has to hold up in four positions, each with a number attached:

| Position | Basis | Threshold |
|---|---|---|
| Button background with white text | [SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | 4.5:1 |
| Plain text link on white | SC 1.4.3 | 4.5:1 (3:1 for large text) |
| Button borders, focus rings, icons | [SC 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) | 3:1 against adjacent colors |
| The dark-mode counterpart | Same, recalculated | Same |

Those four cells eliminate a lot of colors that look great in isolation. The classic casualty is the vivid mid-tone — saturated teal, bright orange, mid yellow — which fails 4.5:1 as a button background with white text, and clashes tonally with black text.

The practical fix is not abandoning the hue but **keeping two values of it**: a bright one for large areas and brand identity, a darker one for text and anywhere contrast is required. shadcn's token model already separates these (`--primary` and `--primary-foreground` are a pair), so this is not extra work.

One easy misreading worth flagging: SC 1.4.3 explicitly exempts logos — "Text used as part of a logo or logotype is exempted from contrast requirements." So a low-contrast color in a logo is not a violation, but **the exemption disappears the moment that color becomes a button or a link**. Brand color and UI primary can be the same value or deliberately different; that is a decision to make consciously.

### Aside: APCA is not "the WCAG 3 algorithm"

Color tools love to describe APCA (Advanced Perceptual Contrast Algorithm) as the modern replacement for WCAG 2's contrast math; [Radix Colors](https://www.radix-ui.com/colors) uses it for its contrast targets. APCA is serious research, but its status is routinely overstated.

[Adrian Roselli surveyed the state of things in April 2026](https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html): APCA was marked for removal from the draft back in early 2023, and the editor's note on the current WCAG 3 draft's contrast item reads "The contrast algorithm used in WCAG 3 is yet to be determined." APCA's author, Andrew Somers, commented on that post to clarify:

> I want to be completely clear: APCA is draft guidance we are actively testing and evaluating. This is not a final standard, and no one should be calling it "WCAG 3".

Practical conclusion: **verify compliance against WCAG 2's 4.5:1 and 3:1**, which is the current standard and the version legislation references. APCA is useful as a second opinion — its judgement on thin text over dark backgrounds genuinely tracks perception better — but do not treat passing APCA as evidence of compliance.

## Constraint 3: the gap in your competitive set

The first two constraints remove what you cannot use. The third decides among what is left. The method is crude but effective, and requires no design sense:

1. List 10–15 existing products in your category, domestic and international.
2. Open each homepage and sample the background color of the primary button with dev tools.
3. Record the hue angles.
4. Plot them on a 0–360 line and find **the empty stretch**.

You will usually find heavy clustering — SaaS crowds between blue and indigo, health products crowd into green, finance into deep navy. The empty region is your opening, and identifying it is an observation, not a taste judgement.

This step also answers "what if I don't know design?" You do not need to. You need to be able to count.

## A number that gets cited without its conditions

Discussions of state color often cite "8% of men have red-green color blindness." Roughly right — but **it comes with conditions**.

The [National Eye Institute](https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/color-blindness) puts it as "About 1 in 12 men have color vision deficiency," and [Colour Blind Awareness](https://www.colourblindawareness.org/colour-blindness/) gives roughly 1 in 12 men (8%) and 1 in 200 women. What most citations drop is that these figures generally describe populations of **Northern European ancestry**, and prevalence varies meaningfully across populations. The literature review in a [study of six North Indian populations](https://pmc.ncbi.nlm.nih.gov/articles/PMC6150100/) lists male prevalence ranging from Libya 2.2%, Saudi Arabia 2.9%, Nepal 3.9%, Singapore 5.3%, Thailand 5.6%, and Korea 5.9%, up to Jordan 8.7% and Eastern India 8.73%.

(Jennifer Birch's [Worldwide prevalence of red-green color deficiency](https://opg.optica.org/josaa/abstract.cfm?uri=josaa-29-3-313), JOSA A 2012, includes a table specifically for Taiwan, Korea, and Singapore — but the text sits behind a paywall. I read only the abstract and table captions and did not obtain the values, so no figures from it are quoted here.)

In practice this changes nothing about what you build — SC 1.4.1 is Level A whether prevalence is 3% or 9%. But when writing a spec or convincing a team, a number carried together with its conditions holds up better than a bare "8%."

## Only after converging do you actually pick

With the three constraints applied, you are typically left with three or four candidate hues. Now taste gets its turn — and there is a simple way to avoid the "the longer I stare the stranger it looks" trap:

**Apply each candidate to a real interface, screenshot it, and look again the next morning.** Do not decide the same day. A brand color decided in one sitting has a high chance of being second-guessed the following week.

"Real interface" is the operative phrase — not swatches in a row, but a primary button, a secondary button, a link, a card, and a piece of state feedback, all rendered. Tools like [Realtime Colors](https://realtimecolors.com/) exist for exactly this, or you can compare directly in the [shadcn/create](https://ui.shadcn.com/create) preview.

## Once decided: lock it into tokens, don't scatter it through components

The moment the color is settled it becomes a semantic token — and **name it by purpose, not by color**:

```css
:root {
  --primary: oklch(0.55 0.19 265);      /* brand color */
  --primary-foreground: oklch(0.99 0 0);
  --correct: oklch(0.72 0.15 155);      /* not --green */
  --correct-foreground: oklch(0.98 0 0);
  --incorrect: oklch(0.63 0.20 25);
  --incorrect-foreground: oklch(0.98 0 0);
}
.dark { /* same set, re-tuned values — not the lightness inverted */ }

@theme inline {
  --color-primary: var(--primary);
  --color-correct: var(--correct);
  --color-correct-foreground: var(--correct-foreground);
  /* and so on */
}
```

Two things worth emphasising:

- **Do not skip the `@theme inline` layer.** Tailwind v4 only honours namespaces; write only `:root` and the `bg-correct` class will not exist. Details in [the companion piece](/posts/tech/deep-dive/2026-08-18-design-resource-sites-tailwind-v4-en).
- **Call it `correct`, not `green`.** Changing the color later, adding a high-contrast mode, or introducing a second cue beyond the icon all become one-line edits. And per SC 1.4.1, that icon is going in sooner or later regardless.

## Overall

A brand color does belong at the start of a new product — but it is a **convergence problem**, not a taste problem. Remove the hues function has claimed, remove the ones that fail the contrast thresholds, remove the ones that collide with your competitive set, and among what remains most choices are fine.

Only one of the three constraints is a rule you must obey (SC 1.4.1, plus the 1.4.3 / 1.4.11 thresholds); the other two are the engineering that keeps a product from being forgettable. And the easiest thing to get wrong is treating "avoid red and green" as the accessibility fix. The specification never asked for a different hue. It asked for **a second cue that is not color** — and you owe that whether or not you avoided red and green.

## References

- [W3C — Understanding SC 1.4.1: Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [W3C — Understanding SC 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C — Understanding SC 1.4.11: Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)
- [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
- [Adrian Roselli — WCAG3 Contrast as of April 2026](https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html)
- [National Eye Institute — Color Blindness](https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/color-blindness)
- [Colour Blind Awareness — About Colour Blindness](https://www.colourblindawareness.org/colour-blindness/)
- [Prevalence and gene frequency of color vision impairments among children of six populations from North Indian region](https://pmc.ncbi.nlm.nih.gov/articles/PMC6150100/)
- [Jennifer Birch — Worldwide prevalence of red-green color deficiency (JOSA A, 2012)](https://opg.optica.org/josaa/abstract.cfm?uri=josaa-29-3-313) (abstract only; full text not obtained)
- [Radix Colors](https://www.radix-ui.com/colors)
- [Realtime Colors](https://realtimecolors.com/)
- [shadcn/create](https://ui.shadcn.com/create)
- [shadcn/ui — Theming documentation](https://ui.shadcn.com/docs/theming)
- [Tailwind CSS — Theme variables documentation](https://tailwindcss.com/docs/theme)
- On this site: [Auditing Design Resource Sites Against Tailwind v4](/posts/tech/deep-dive/2026-08-18-design-resource-sites-tailwind-v4-en)
