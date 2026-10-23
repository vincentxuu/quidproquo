---
name: ui-delivery
description: Implement or repair UI changes with affected-screen coverage, project-specific checks, and separate behavioral, visual, and deployment evidence. Use for interactive UI work or recurring interface regressions; not for backend-only changes or discussion without implementation.
---

# UI delivery

Make UI delivery reviewable across projects. A successful build is not evidence of usable layout or correct interaction.

## Establish scope

Read repository instructions and existing design components before changing code. Discover all consumers of the changed feature through imports, routes, and runtime-created DOM; do not restrict the fix to the screenshot's location. Preserve unrelated work.

Read `ui-delivery.config.md` at the project root if present. If missing, infer commands and conventions from source and record those assumptions in the task report. Use [assets/project-config.md](assets/project-config.md) when establishing project integration. Do not silently modify repository-wide policy or CI merely because this skill is invoked.

Create or update a task report in the project's existing work-log location using [assets/task-report.md](assets/task-report.md). Keep one report per task, not one per control. For a small cosmetic change, a short scope and evidence table is enough.

## Implement against a coverage matrix

Record affected routes, shared components, and applicable states before implementation. Expand coverage when discovering another consumer. For stateful features, include guest/authenticated, loading, empty, success, and failure where meaningful. Include viewport, theme, and keyboard checks appropriate to the change; mark inapplicable cases with a reason rather than mechanically requiring every combination.

Reuse existing controls and design tokens. For new patterns, define hierarchy, primary action, feedback, and recovery before implementing. Keep technical explanations secondary to the user's next action. Verify that success removes obsolete actions and authenticated states do not retain guest-only controls.

Inspect CSS reachability, not just class names: runtime-created nodes, portals, scoped CSS, utility generation, inheritance, hover/focus/disabled rules, and stylesheet imports. A class without matching rules is not styling. Preserve user data and distinguish authentication, network errors, and empty results.

## Gate before commit

Run applicable project lint, type, and behavior checks. Add regression coverage for changed logic when required or useful; do not add tests that merely reproduce class names or markup.

Review changed interactive controls for an explicit styling source, valid tokens, accessible names, focus visibility, and usable target sizes. Custom controls may be exceptions to a design-system component rule, but document the reason and equivalent checks. Do not use broad regex findings as proof of defects or absence of defects.

If the project has automated UI checks, run them within authorization. When introducing a checker, tie it to the actual framework/design system, test representative valid and invalid cases, and separate heuristic warnings from deterministic failures. Never add a fake generic scanner and claim UI quality is enforced.

Required checks failing means the change is not ready for the corresponding delivery stage. Do not bypass hooks, weaken assertions, or bless new screenshot baselines to obtain a green result. Distinguish existing failures from new failures using evidence.

## Verify interaction and appearance

Use available and permitted tools to exercise representative flows and inspect the actual rendered result. Capture route, viewport, theme, state, revision, and evidence location. Check hierarchy, clipping, spacing, readable text, feedback, recovery, and keyboard behavior. Screenshot comparison alone does not verify interaction.

Honor tool restrictions. If browser use is prohibited or rendering is unavailable, complete source/logic checks and explicitly mark visual and unexercised interaction checks pending. User-supplied screenshots support only the pictured state/revision. Do not replace runtime evidence with source inspection or claim a mockup is a product screenshot.

## Release and report

Follow existing commit, review, and deployment permissions; this skill grants none. After release, verify the deployed revision and applicable routes/assets before claiming deployment confirmation. Recheck after changes that invalidate prior evidence; do not rerun unrelated expensive checks without reason.

Report four statuses independently: source/automated checks, interaction, visual review, and deployment. Use pass, fail, pending, or not applicable with evidence and reasons. Never mark the overall UI accepted while required acceptance remains pending. A user may authorize publication with pending acceptance; preserve that distinction in the report.
