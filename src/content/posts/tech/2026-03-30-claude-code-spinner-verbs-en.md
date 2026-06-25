---
title: "Claude Code Spinner Verbs: The Complete List of 185 Status Verbs Extracted from Source Code"
date: 2026-03-30
type: guide
category: tech
tags: [claude-code, ai-tools, cli, customization, spinner, ux]
lang: en
tldr: "When processing requests, Claude Code randomly displays one of 185 built-in verbs (like Thinking, Brewing, Clauding), then picks one of 8 completion verbs with elapsed time. You can customize these via spinnerVerbs in settings.json, using either replace or append mode. All data in this post is verified directly from cli.js source code."
description: "Extract the complete list of 185 spinner verbs and 8 completion verbs from Claude Code v2.1.42 source code, explain how to customize spinnerVerbs, and include an unofficial categorization attempt by the author."
draft: false
series:
  name: "Claude Code Automation Guide"
  order: 10
---

🌏 [中文版](/posts/tech/2026-03-30-claude-code-spinner-verbs)

When you type a command in Claude Code, a spinning `✻` appears in the terminal next to a verb — sometimes the sensible `Thinking...`, sometimes the baffling `Flibbertigibbeting...`. How many of these verbs are there? How are they chosen? Can you change them? The fastest way to find out is to read the source code directly.

## Data Sources

All verb lists and configuration formats in this post come from first-hand sources only — no unverified secondary information:

| Data | Source | Location |
|------|------|------|
| 185 spinner verbs | `Q51` variable in `cli.js` | `@anthropic-ai/claude-code@2.1.42` |
| 8 completion verbs | `cW1` variable in `cli.js` | Same |
| `spinnerVerbs` configuration logic | `ZI4` function + Zod schema in `cli.js` | Same |
| `spinnerTipsOverride` configuration | Official JSON Schema | `schemastore.org/claude-code-settings.json` |

> The categorization section later in this post is my own semantic grouping — there is no classification mechanism in the source code.

---

## What Are Spinner Verbs?

While Claude Code processes a request, these verbs cycle through in the terminal:

```
✻ Pondering...
✻ Brewing...
✻ Clauding...
```

Once done, it switches to the past tense with elapsed time:

```
✻ Cooked for 1m 23s
✻ Sautéed for 45s
```

The mechanism is simple: a verb is picked randomly from an array. There is no mapping of different verbs to task types or processing stages.

---

## The Complete 185 Default Verbs

Extracted from the `Q51` array in `cli.js`, sorted alphabetically:

```
Accomplishing    Actioning        Actualizing      Architecting
Baking           Beaming          Beboppin'        Befuddling
Billowing        Blanching        Bloviating       Boogieing
Boondoggling     Booping          Bootstrapping    Brewing
Burrowing        Calculating      Canoodling       Caramelizing
Cascading        Catapulting      Cerebrating      Channeling
Channelling      Choreographing   Churning         Clauding
Coalescing       Cogitating       Combobulating    Composing
Computing        Concocting       Considering      Contemplating
Cooking          Crafting         Creating         Crunching
Crystallizing    Cultivating      Deciphering      Deliberating
Determining      Dilly-dallying   Discombobulating Doing
Doodling         Drizzling        Ebbing           Effecting
Elucidating      Embellishing     Enchanting       Envisioning
Evaporating      Fermenting       Fiddle-faddling  Finagling
Flambéing        Flibbertigibbeting Flowing        Flummoxing
Fluttering       Forging          Forming          Frolicking
Frosting         Gallivanting     Galloping        Garnishing
Generating       Germinating      Gitifying        Grooving
Gusting          Harmonizing      Hashing          Hatching
Herding          Honking          Hullaballooing   Hyperspacing
Ideating         Imagining        Improvising      Incubating
Inferring        Infusing         Ionizing         Jitterbugging
Julienning       Kneading         Leavening        Levitating
Lollygagging     Manifesting      Marinating       Meandering
Metamorphosing   Misting          Moonwalking      Moseying
Mulling          Musing           Mustering        Nebulizing
Nesting          Newspapering     Noodling         Nucleating
Orbiting         Orchestrating    Osmosing         Perambulating
Percolating      Perusing         Philosophising   Photosynthesizing
Pollinating      Pondering        Pontificating    Pouncing
Precipitating    Prestidigitating Processing       Proofing
Propagating      Puttering        Puzzling         Quantumizing
Razzle-dazzling  Razzmatazzing    Recombobulating  Reticulating
Roosting         Ruminating       Sautéing         Scampering
Schlepping       Scurrying        Seasoning        Shenaniganing
Shimmying        Simmering        Skedaddling      Sketching
Slithering       Smooshing        Sock-hopping     Spelunking
Spinning         Sprouting        Stewing          Sublimating
Swirling         Swooping         Symbioting       Synthesizing
Tempering        Thinking         Thundering       Tinkering
Tomfoolering     Topsy-turvying   Transfiguring    Transmuting
Twisting         Undulating       Unfurling        Unravelling
Vibing           Waddling         Wandering        Warping
Whatchamacalliting Whirlpooling   Whirring         Whisking
Wibbling         Working          Wrangling        Zesting
Zigzagging
```

---

## The 8 Completion Verbs

When processing finishes, one verb is randomly selected from the `cW1` array and displayed with elapsed time:

```javascript
cW1 = ["Baked","Brewed","Churned","Cogitated","Cooked","Crunched","Sautéed","Worked"]
```

| Completion Verb | Display Example |
|----------|---------|
| Baked | `✻ Baked for 45s` |
| Brewed | `✻ Brewed for 1m 2s` |
| Churned | `✻ Churned for 30s` |
| Cogitated | `✻ Cogitated for 2m 15s` |
| Cooked | `✻ Cooked for 1m 23s` |
| Crunched | `✻ Crunched for 55s` |
| Sautéed | `✻ Sautéed for 38s` |
| Worked | `✻ Worked for 3m 10s` |

Five of the eight completion verbs have a culinary theme (Baked, Brewed, Churned, Cooked, Sautéed). This is not speculation — it's exactly what the code says.

---

## Unofficial Categorization (Author's Own)

The 185 verbs in the source code sit in a single flat array and are picked randomly — **there are no category labels**. The following groupings are my own semantic classification, provided purely for readability.

### Culinary (~20 verbs)

Baking, Blanching, Brewing, Caramelizing, Cooking, Drizzling, Fermenting, Flambéing, Frosting, Garnishing, Infusing, Julienning, Kneading, Leavening, Marinating, Proofing, Sautéing, Seasoning, Simmering, Stewing, Tempering, Whisking, Zesting

This mirrors the culinary theme of the completion verbs — the whole spinner can be read as "the AI is cooking your request and will serve it when done."

### Cognitive Thinking (~10 verbs)

Cerebrating, Cogitating, Considering, Contemplating, Deciphering, Deliberating, Elucidating, Musing, Philosophising, Pondering, Ruminating

The most "serious" category — these verbs directly describe the AI thinking through a problem.

### Natural Phenomena (~15 verbs)

Billowing, Cascading, Ebbing, Evaporating, Flowing, Fluttering, Gusting, Misting, Precipitating, Sprouting, Swirling, Thundering, Undulating, Whirlpooling

Physical processes from the natural world used as metaphors for computation.

### Animal Behavior (~10 verbs)

Burrowing, Frolicking, Galloping, Hatching, Herding, Pollinating, Pouncing, Roosting, Scampering, Slithering, Swooping, Waddling

### Science (~8 verbs)

Crystallizing, Ionizing, Nebulizing, Nucleating, Osmosing, Photosynthesizing, Sublimating, Symbioting

### Music / Dance (~7 verbs)

Beboppin', Boogieing, Grooving, Harmonizing, Improvising, Jitterbugging, Sock-hopping

### Whimsical Coinages and Humor (~15 verbs)

Booping, Canoodling, Combobulating, Dilly-dallying, Discombobulating, Fiddle-faddling, Flibbertigibbeting, Flummoxing, Hullaballooing, Lollygagging, Razzle-dazzling, Razzmatazzing, Recombobulating, Shenaniganing, Tomfoolering, Topsy-turvying, Whatchamacalliting

Among these, `Combobulating` and `Recombobulating` are back-formed words derived from `Discombobulate` — they don't exist in standard dictionaries. `Recombobulating` has a fun origin: Milwaukee's airport installed a sign reading "Recombobulation Area" after the security checkpoint, inviting travelers to "reassemble themselves."

### Easter Eggs

- **Clauding** — the only verb coined from the product's own name
- **Gitifying** — a nod to every developer's daily workflow
- **Reticulating** — a reference to the classic *The Sims* loading screen easter egg "Reticulating Splines"
- **Prestidigitating** — a conjurer's sleight of hand
- **Newspapering** — humorously turning a noun into a verb

---

## Customizing Spinner Verbs

Set `spinnerVerbs` in `settings.json`. The following is the actual logic from the source code (`ZI4` function, simplified):

```javascript
function getSpinnerVerbs() {
  const config = getSettings().spinnerVerbs;
  if (!config) return DEFAULT_VERBS;              // not configured → use default 185
  if (config.mode === "replace")
    return config.verbs.length > 0
      ? config.verbs                               // replace → full replacement
      : DEFAULT_VERBS;                             // empty array → fall back to default
  return [...DEFAULT_VERBS, ...config.verbs];      // append → merge
}
```

### Full Replacement

Only display the verbs you specify:

```json
{
  "spinnerVerbs": {
    "mode": "replace",
    "verbs": ["Hacking", "Shipping", "Deploying", "Scaling"]
  }
}
```

### Append to Defaults

Your verbs are added to the 185 and picked randomly together:

```json
{
  "spinnerVerbs": {
    "mode": "append",
    "verbs": ["Bubble-tea-ing", "Boba-sipping"]
  }
}
```

### Schema Definition

Confirmed from the official JSON Schema (schemastore.org):

```json
{
  "spinnerVerbs": {
    "type": "object",
    "properties": {
      "mode": {
        "type": "string",
        "enum": ["append", "replace"]
      },
      "verbs": {
        "type": "array",
        "items": { "type": "string", "minLength": 1 },
        "minItems": 1
      }
    },
    "required": ["verbs"]
  }
}
```

`mode` is not in `required` — from the source code, omitting `mode` falls through to `append` logic.

Configuration location: `~/.claude/settings.json` (global) or `.claude/settings.json` (project level).

---

## Customizing Spinner Tips

In addition to the verbs, the tip text shown during processing can also be customized. Structure confirmed from the JSON Schema:

```json
{
  "spinnerTipsOverride": {
    "tips": [
      "Use /compact to compress the conversation and free up context window",
      "Shift+Tab to quickly toggle permission mode"
    ],
    "excludeDefault": true
  }
}
```

Set `excludeDefault` to `true` to show only your tips; set to `false` or omit to mix with the defaults.

---

## A Few Interesting Facts

Observed directly from the source code, not speculation:

1. **British and American spellings coexist**: `Philosophising` (British) and `Channelling` (British) appear alongside `Channeling` (American).

2. **Longest verbs**: `Flibbertigibbeting` (18 letters) and `Photosynthesizing` (17 letters).

3. **Plenty of coined words**: `Combobulating`, `Recombobulating`, `Gitifying`, `Quantumizing`, and `Symbioting` are all non-standard English.

4. **Completion verbs have counterparts among spinner verbs**: `Churned ↔ Churning`, `Cogitated ↔ Cogitating`, `Cooked ↔ Cooking`, `Crunched ↔ Crunching` — though not every completion verb has a corresponding spinner verb (e.g., `Baking` exists for `Baked`, and `Brewing` exists for `Brewed`).

5. **Cooking is the hidden throughline**: About 20 culinary verbs appear in the spinner list, and 5 of the 8 completion verbs are cooking-related. The proportion jumps from 11% to 63%.

---

## In Summary

Spinner verbs are a purely decorative feature with no effect on actual behavior. But they are part of Claude Code CLI's brand personality — the differentiation from other AI coding assistants isn't just about capability, it's also in these small details.

If 185 default verbs aren't enough, use `append` to add your own. If `Flibbertigibbeting` feels too chaotic, use `replace` to swap in something you prefer. Changes to the config file take effect immediately — no restart needed.

## References

- [Claude Code Official Docs: Feature Overview and Spinner Settings](https://docs.anthropic.com/en/docs/claude-code/overview)
- [Claude Code GitHub Source Code (cli.js spinner verbs)](https://github.com/anthropics/claude-code)
- [Anthropic Official Blog: Claude Code Launch Announcement](https://www.anthropic.com/news/claude-code)
- [npm - @anthropic-ai/claude-code (spinner verbs customization docs)](https://www.npmjs.com/package/@anthropic-ai/claude-code)
