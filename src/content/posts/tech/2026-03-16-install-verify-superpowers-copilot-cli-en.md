---
title: "Installing and Verifying Superpowers for GitHub Copilot CLI: Implementation, Diagnostics, and Validation"
date: 2026-03-16
type: guide
category: tech
tags: [github-copilot,copilot-cli,superpowers,plugin-install,debugging]
lang: en
tldr: "A hands-on log of installing Superpowers (packaged by DwainTR) for Copilot CLI on a local machine — including the diagnostic process when skills didn't appear after installation, the fix, and practical tips."
description: "An implementation journal covering everything from the install script to plugin registration, fault diagnosis, and validation commands — for engineers who want to add Superpowers to their local Copilot workflow."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-16-install-verify-superpowers-copilot-cli)

## Introduction

This post documents a real-world operation: installing Superpowers (Jesse Vincent's skill library) into the local GitHub Copilot CLI via the community package DwainTR/superpowers-copilot, encountering a "skills not visible after restart" issue, and walking through the full diagnostic and resolution process. The goal is to help you reproduce the installation, troubleshoot quickly, and understand why "skills exist on disk but aren't loaded in the session" can happen.

## Background

Superpowers is a comprehensive set of skill-driven workflows: brainstorming, TDD, systematic-debugging, writing-plans, subagent-driven-development, and more. DwainTR's repo wraps obra/superpowers into a Copilot CLI-compatible plugin (with a marketplace manifest and install script), making it easy to set up symlinks and agent configs under `~/.copilot`.

## What I Did (Implementation Steps)

1. Identified the candidates:
   - Found the upstream obra/superpowers repo and DwainTR/superpowers-copilot (the Copilot CLI wrapper).
2. Used DwainTR's Copilot-native package and ran the one-liner install script:
```bash
curl -fsSL https://raw.githubusercontent.com/DwainTR/superpowers-copilot/main/install.sh | bash
```
3. The script:
   - `git clone`s the repo to `~/.copilot/marketplace-cache/dwaintr-superpowers-copilot`
   - Creates a symlink in `~/.copilot/skills` pointing to `plugins/superpowers/skills`
   - Creates a symlink in `~/.copilot/agents` for `code-reviewer.md`
   - Appends an instruction snippet to `~/.copilot/copilot-instructions.md`
4. Initial checks confirmed the symlinks and instructions were in place, but after restarting the session in the Copilot interactive interface or VS Code, the new skills were not visible.

## The Problem

The install script successfully created the files and symlinks, but after restarting Copilot the Superpowers skills were still absent (or the UI showed fewer skills than expected). This is typically caused by either "files exist but aren't registered in Copilot's plugin registry" or "the current session hasn't reloaded the new plugin."

## Diagnostic Process (How I Traced the Root Cause)

I ran the following checks to find the issue:

- Verify symlinks and files exist:
```bash
ls -la ~/.copilot/skills
ls -la ~/.copilot/marketplace-cache/dwaintr-superpowers-copilot/plugins/superpowers/skills
ls -la ~/.copilot/agents
grep -n "<!-- superpowers-installed -->" ~/.copilot/copilot-instructions.md || true
```
- Check Copilot version and config:
```bash
copilot --version
sed -n '1,200p' ~/.copilot/config.json
```
- List skills non-interactively (quick check of what's loaded in the current session):
```bash
copilot -i "/skills list" --allow-all --silent
```
The output showed the system could "see" some openspec / project-local skills, but if the plugin wasn't formally installed in the marketplace registry, the interactive UI might not list it automatically.

## The Fix (What Made It Work)

The most reliable approach is to formally register and install the marketplace plugin within Copilot — rather than relying solely on symlinks:

```bash
copilot plugin marketplace add DwainTR/superpowers-copilot
copilot plugin install superpowers@superpowers-copilot
```

After installation, verify again non-interactively:
```bash
copilot -i "/skills list" --allow-all --silent
```

At this point you should see all 14 Superpowers skills (e.g., brainstorming, test-driven-development, systematic-debugging, etc.), confirming the Copilot session loads them correctly.

If skills are still missing, common remedies include:
- Run `/restart` inside an interactive session, or fully close and reopen Copilot / VS Code.
- Temporarily allow Copilot to access the skills directory (e.g., `copilot --add-dir ~/.copilot/skills`) and restart the session to verify.
- Check the logs (`~/.copilot/logs`) for plugin load errors.

## Verification Output (Example)

After the fix, running:
```bash
copilot -i "/skills list" --allow-all --silent
```
returns a list that includes:
- `openspec-*` (project-local skills)
- As well as: `brainstorming`, `test-driven-development`, `systematic-debugging`, `writing-plans`, and the other Superpowers skills

(Full output omitted here — paste your own results in for future reference.)

## Recommendations and Notes

- The install script and symlinks are convenient, but for the interactive UI to display skills reliably, register and install through Copilot's plugin marketplace (the two commands above).
- After every installation, validate with the non-interactive `/skills list` command — it's more reliable than checking the UI and works well in automation.
- If your team replicates environments via CI or shared config, include the marketplace-cache or install steps in your onboarding script to avoid broken single-machine symlinks.
- To update, run `copilot plugin update` or re-run the install script to sync the latest changes.

## Closing Thoughts

The real lesson here isn't "the install failed" — it's understanding Copilot's two layers: the **filesystem layer** (symlinks, agents, instructions) and the **registry layer** (plugin marketplace / registered plugins). Simply placing files in the right directory isn't enough: for a session to reliably use a plugin, Copilot needs to formally recognize it and load it at session start. The practical debugging pattern for this class of issue is: check files → inspect logs → formally register plugin → restart session → validate with a non-interactive command.

## References

- [GitHub - obra/superpowers — Upstream Copilot CLI Superpowers skill library](https://github.com/obra/superpowers)
- [GitHub - DwainTR/superpowers-copilot — Copilot CLI Superpowers installer](https://github.com/DwainTR/superpowers-copilot)
- [GitHub Copilot in the CLI — Official docs: installation, verification, and plugin usage](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-in-the-command-line)
- [GitHub Copilot Official Docs — CLI plugin marketplace and skills loading mechanism](https://docs.github.com/en/copilot)
