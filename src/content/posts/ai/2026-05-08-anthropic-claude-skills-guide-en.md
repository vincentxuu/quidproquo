---
title: "Claude Skills: Package Domain Knowledge into a Folder, Teach Once and It Remembers"
date: 2026-05-08
type: deep-dive
category: ai
tags: [claude, anthropic, claude-skills, prompt-engineering, agent, context-engineering]
lang: en
tldr: "A Skill is a folder with a SKILL.md. Three-layer progressive disclosure lets Claude load details only when needed, eliminating the need to re-explain preferences every conversation."
description: "Breaking down Anthropic's official guide 'The Complete Guide to Building Skills for Claude': folder structure, three-layer progressive disclosure, YAML frontmatter rules, and the authoring and testing workflow."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-08-anthropic-claude-skills-guide)

It gets tedious telling Claude every single conversation that "our company presentations use sans-serif, citations must follow APA, and PR titles can't exceed 70 characters." Anthropic's official guide released in January 2026 consolidates this setup pattern into one concept: **a Skill is a folder** -- you set it up once, and Claude automatically loads it whenever needed. This post covers the Skill structure, three-layer loading mechanism, frontmatter rules, and what to watch out for when writing your own Skill.

## What Is a Skill

A Skill is a packaged instruction set that teaches Claude how to handle a specific type of work. It's not a single prompt, nor a fine-tune, but a folder with a defined structure:

```
your-skill-name/
├── SKILL.md         # Required: YAML frontmatter + Markdown instructions
├── scripts/         # Optional: executable code (Python / Bash)
├── references/      # Optional: supplementary docs linked from SKILL.md
└── assets/          # Optional: templates, fonts, icons, etc.
```

Compared to system prompts, the key difference is **composability** and **portability**: you can mount multiple Skills simultaneously, and the same Skill behaves consistently across Claude.ai, Claude Code, and the API. Compared to MCP, MCP provides tool access (API connectivity) while Skills provide domain knowledge (how to use those tools) -- stacking both together is what produces reliable workflows.

## Progressive Disclosure: Three-Layer Loading

The core design of Skills is **progressive disclosure** -- don't stuff everything into the context window at once; load on demand:

| Layer | Content | When Loaded |
|-------|---------|-------------|
| 1 | YAML frontmatter (`name` + `description`) | Loaded into system prompt every conversation |
| 2 | SKILL.md body (Markdown instructions) | When Claude determines this Skill is relevant to the current task |
| 3 | Files in `references/`, `scripts/`, `assets/` | When explicitly referenced in the body and Claude deems them necessary |

Layer 1 contains only "what this Skill does and when to use it" -- just enough for Claude to decide whether to dig deeper. Layer 2 holds the actual instructions, but should ideally stay under 5,000 words (the official docs recommend keeping the SKILL.md body under 500 lines). The real details -- API specs, lengthy examples, templates -- go into Layer 3.

This design maps directly to token economics: Layer 1 always costs tokens, Layer 2 costs once per relevant conversation then stays in context, and Layer 3 loads only when needed. Cramming everything into SKILL.md forces every conversation to bear the full cost.

## YAML Frontmatter Rules

The minimum viable frontmatter requires just two fields:

```yaml
---
name: pdf-form-filler
description: Fills PDF forms using field metadata. Use when user uploads a .pdf form, asks to "fill in this form", or mentions form auto-completion.
---
```

Hard rules:

- `name` must match the folder name, **kebab-case only**
- `description` has a 1024-character limit and must include both "what it does" + "when to use it"
- No XML angle brackets (`<` `>`) allowed
- Name cannot contain `claude` or `anthropic` (reserved words)

Optional fields include `license`, `compatibility` (environment requirements, 1-500 characters), and `metadata` (custom key-value pairs, e.g., author, version, mcp-server).

## The Description Is a Trigger Condition, Not an Introduction

How well you write `description` directly determines whether the Skill gets triggered. Anthropic's formula:

> **[What it does] + [When to use it] + [Key capabilities]**

Examples:

```
✅ Good: Analyzes Figma design files and generates developer
   handoff documentation. Use when user uploads .fig files,
   asks for "design specs", or "design-to-code handoff".

❌ Too vague: Helps with projects
❌ Missing trigger words: Creates sophisticated documentation
❌ Machine-speak: Implements the Project entity model
```

The key is to write "what the user would say," not "what the Skill does internally." When Claude decides whether to trigger a Skill, it matches against the tone and keywords of the current conversation, not technical details.

## Instruction Structure

The SKILL.md body should include these sections:

1. **Clear step-by-step workflow**: What to do first, what to do second -- avoid open-ended advice like "please consider the following points"
2. **Specific executable instructions**: Which script to run, which tool to call, with exact command lines included
3. **Error handling**: Common failure modes + corresponding remediation
4. **Examples**: What good input and good output look like
5. **Troubleshooting**: The most common pitfalls users encounter

Same discipline as writing a CLAUDE.md: **state what to do, don't narrate why**. Once a Skill is loaded, every turn pays token cost -- every line must earn its keep. Long examples, spec tables, and API schemas belong in `references/`; the body should only contain pointers like "check references/api-schema.md when needed."

## Three Typical Use Cases

The official guide categorizes Skills into three types:

**1. Document and Asset Generation**: Presentations, reports, design specs, code -- all following the organization's existing standards. Examples include "company presentation template," "code style guide," and "APA citation format." The Skill codifies these implicit standards so output stays consistent.

**2. Workflow Automation**: Multi-step processes with validation at each step. Examples include "PR review process," "incident response runbook," and "customer onboarding." The value lies in a consistent methodology, not a single output.

**3. MCP Enhancement**: MCP provides raw API connectivity; Skills layer domain knowledge on top. For example, a Salesforce MCP gives you CRUD, while a Salesforce Skill teaches Claude how to correctly create a lead and which fields need what values.

## Testing Three Things

After writing a Skill, you can't just test whether "it runs." The official guide recommends three testing dimensions:

```
Triggering Tests
├── Direct request → should trigger
├── Rephrased request → should trigger
└── Unrelated topic → should NOT trigger

Functional Tests
├── Output validity
├── API calls succeed
├── Error handling works
└── Edge case coverage

Performance Comparison
├── Token usage decreased?
├── Message round-trips decreased?
└── API failure rate decreased?
```

The iteration signals are clear: **under-triggering** means add keywords and scenarios to the description; **over-triggering** means add negative conditions and narrow the scope; **execution errors** mean revise the instructions and add error handling.

## Overall Architecture

Placing Skills alongside other components, the responsibility distribution looks like this:

```
┌─────────────────────────────────────────┐
│             User Conversation            │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────▼──────────┐
        │    System Prompt    │
        │  + All Skills'      │
        │    YAML frontmatter │  ← Level 1 (always loaded)
        └──────────┬──────────┘
                   │
        Determine which Skill is relevant
                   │
        ┌──────────▼──────────┐
        │   SKILL.md body     │  ← Level 2 (loaded when relevant)
        └──────────┬──────────┘
                   │
        Read only when instructions explicitly point to it
                   │
        ┌──────────▼──────────┐
        │ references/ scripts/│  ← Level 3 (loaded when needed)
        │     assets/         │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   MCP Tools / API   │  ← Execution layer (Skill teaches how to use)
        └─────────────────────┘
```

This structure means Skills **aren't a replacement for prompts** but an organizational tool for prompts. The implicit knowledge previously scattered across system prompts, CLAUDE.md, and conversation memory is now broken into units with clear trigger conditions, versioning, and shareability.

## The Big Picture

Claude Skills don't solve the "can it do this" problem -- they solve the "can it do this consistently and without being told again" problem. The core trade-off: are you willing to invest effort once to write a workflow as a folder structure, in exchange for never having to explain it again in subsequent conversations?

Good fit: Teams with shared conventions (code style, document templates, review processes), domain workflows paired with MCP tools, tasks that need consistent behavior across Claude.ai / Code / API.

Poor fit: One-off questions, highly unstable personal preferences (changing every day), pure creative brainstorming (trigger conditions are hard to define).

Writing your first Skill takes roughly 15-30 minutes. Starting with the `skill-creator` meta-skill is the fastest approach. Pick the most annoying repetitive task you have, write it as a folder, and see if it works.

## References

- [The Complete Guide to Building Skills for Claude (PDF)](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)
- [Anthropic: Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Claude API Docs: Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Claude API Docs: Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Claude Code Docs: Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [Claude Cookbook: Introduction to Claude Skills](https://platform.claude.com/cookbook/skills-notebooks-01-skills-introduction)
- [Anthropic Skilljar: Introduction to agent skills (interactive course)](https://anthropic.skilljar.com/introduction-to-agent-skills)
- [joyrexus/gist: PDF to Markdown full version](https://gist.github.com/joyrexus/ff71917b4fc0a2cbc84974212da34a4a)
