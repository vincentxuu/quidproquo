---
title: "Tool Pick｜shipstores — Letting an AI Agent Carry a Mobile App All the Way to Store Review"
date: 2026-10-04
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source MCP server that wires an agent into App Store Connect, Google Play Console, and Expo EAS, automating the API-less steps too — privacy labels, age ratings, replying to App Review — so it can carry a build all the way to submission"
tldr: "shipstores is an MCP server that lets an agent like Claude operate App Store Connect and Google Play Console directly. Install: claude mcp add shipstores -- uvx shipstores. It solves the problem where the app is built, but publishing still takes about 40 manual steps, half of which have no public API."
series:
  name: "AI Tool of the Day"
  order: 44
---

> 🌏 [中文版](/posts/daily/2026-10-04-tool-shipstores)

## Tool Info

| Item | Value |
|---|---|
| Name | shipstores |
| Type | MCP server |
| GitHub | [FidelisMM/shipstores](https://github.com/FidelisMM/shipstores) |
| Stars | 13 (created 2026-10-01, actively developed) |
| Language | Python |
| License | MIT |
| Install | `claude mcp add shipstores -- uvx shipstores` |

## What Problem It Solves

Say your agent has already written the app and produced a build. What stops you next isn't code — it's publishing. App Store Connect and Google Play Console together add up to roughly 40 manual steps: filling in version metadata, uploading screenshots, setting the privacy label, picking an age rating, working through Google Play's eleven "App content" forms, and — if Apple rejects the build — recording a screen capture of the app to reply to App Review. About half of these steps have no public API at all. The agent can write the code; it just stalls at the storefront.

shipstores chains the whole path together: build, upload, fill in store metadata, submit, and reply to review feedback. Wherever a public API exists — uploading builds, managing versions, subscriptions, pricing — it uses that API directly. Wherever one doesn't — privacy labels, App Review replies, Google Play's App content forms — it drives the console's own web endpoints through a dedicated, already-logged-in browser profile, the same family of undocumented endpoints that fastlane's Spaceship module relies on. The README is upfront about the risk: Apple or Google can change these endpoints without notice; they work today, with no guarantee beyond that.

Where this fits: you're already shipping an app with an agent — especially an Expo/EAS project — and publishing is the bottleneck. Or you're already using a public-API-only MCP server like [app-publish-mcp](https://github.com/mikusnuz/app-publish-mcp) or [mobile-release-mcp](https://github.com/Jeronimo0228/mobile-release-mcp) and keep getting stuck on the privacy label or an App Review reply — the parts those tools can't touch.

## Getting Started

### Install

```bash
# Requires Python 3.12+ and uv; iOS uploads also need the Xcode command line tools
claude mcp add shipstores \
  -e ASC_KEY_ID=ABC123XYZ \
  -e ASC_ISSUER_ID=00000000-0000-0000-0000-000000000000 \
  -e ASC_PRIVATE_KEY_PATH=~/.config/shipstores/AuthKey_ABC123XYZ.p8 \
  -e PLAY_SERVICE_ACCOUNT_PATH=~/.config/shipstores/play-service-account.json \
  -- uvx shipstores
```

After installing, have the agent run `store_doctor` once — it validates both sets of credentials with real API calls and detects your Apple Team ID from any existing bundle ID.

### Basic Usage

```text
"Upload this build to TestFlight and update the release notes"
→ the agent chains eas_build_start → apple_list_builds (waits for VALID)
  → apple_attach_build → apple_update_listing

"App Review said we violated 2.1 — what's the reason?"
→ apple_review_messages reads the rejection message and its guideline
```

Any tool that actually publishes or submits something (`apple_submit_for_review`, `play_upload_bundle`, and similar) says so in its own description, so the agent checks with you before running it.

### Advanced Usage

```bash
# Expose only the Apple and EAS tools — useful if you haven't set up a Google Play service account yet
claude mcp add shipstores -e SHIPSTORES_TOOLSETS=apple,eas -- uvx shipstores
```

`SHIPSTORES_TOOLSETS` can also live in `~/.config/shipstores/config.toml` if you'd rather not pass it as an environment variable every time.

## Compared to Existing Approaches

| | shipstores | app-publish-mcp / mobile-release-mcp | Working both consoles by hand |
|---|---|---|---|
| Public-API steps (uploads, versions, subscriptions) | ✅ | ✅ | Manual clicking |
| Privacy label / App content forms (no API) | ✅ (console automation) | ❌ | Manual clicking |
| Reading and replying to App Review rejections (with video) | ✅ | ❌ | Manual recording and upload |
| Expo/EAS build integration | ✅ | Depends on the project | Switch tools yourself |
| Confirms before publishing or submitting | ✅ (stated in tool descriptions) | Depends on the implementation | — |

## Things to Watch

- **Console automation runs on undocumented endpoints.** Privacy labels, App Review replies, and Google Play's App content forms all go through the console's internal web endpoints. Either platform can break this with a redesign at any time — the README says so directly: it works today, with no guarantee beyond that.
- **A new developer account's first submission will almost certainly get bounced on Guideline 2.1.** Apple expects a screen recording, starting from the Home Screen on a physical device, that walks through login and account deletion. shipstores can't generate that recording for you — you still have to make it yourself.
- **The credential setup isn't trivial.** iOS needs an App Store Connect API key (a `.p8` file) plus the Xcode command line tools; Android needs a Google service account JSON with release permissions. Getting both provisioned can take longer than installing the tool itself.
- **This is a solo-maintained project.** It has 17 open issues and recent activity, but no corporate backing — weigh that before making it your only path to production releases.

## Today's Takeaway

This tool surfaces an underrated fact: a lot of "the agent wrote the code but got stuck" moments aren't a model-capability problem — they're a missing-API problem on the platform's side. App Store and Google Play review and compliance still run largely through web forms, years into the agent era. shipstores chooses to fill that gap with browser automation rather than wait for an API, which is an admission that an MCP server sometimes has to simulate a human clicking through a page instead of calling a clean endpoint — at the cost of stability tied to a console UI that can change out from under it. It's the same old RPA trade-off, just wearing an MCP shell this time.

## References

- [FidelisMM/shipstores — GitHub](https://github.com/FidelisMM/shipstores)
- [shipstores README (install, the 60-tool list, hard-won lessons)](https://github.com/FidelisMM/shipstores#readme)
- [app-publish-mcp — a public-API-only comparison project](https://github.com/mikusnuz/app-publish-mcp)
- [mobile-release-mcp — another public-API-only comparison project](https://github.com/Jeronimo0228/mobile-release-mcp)
- [Model Context Protocol specification](https://modelcontextprotocol.io/specification)
