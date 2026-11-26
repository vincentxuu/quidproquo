# UI delivery project configuration

Copy to `ui-delivery.config.md` only when integrating this workflow into a repository. Replace the example descriptions with actual project facts; omit irrelevant entries.

- Design components and source paths:
- Tokens and styling framework:
- Route/consumer discovery commands:
- Lint, type, and behavior commands:
- Existing accessibility/visual checks:
- Supported viewport/theme targets:
- Tool restrictions and manual acceptance owner:
- Work-log/evidence location:
- Required checks before commit, merge, and acceptance:
- Known baseline failures, evidence, and review date:

## Repository integration

Add an appropriate instruction to AGENTS.md: “For interactive UI changes, use the ui-delivery workflow and this project's ui-delivery.config.md. Report automated, interaction, visual, and deployment evidence separately.”

For portability, link a repository-owned copy or document the actual skill location available to contributors; do not assume everyone has one user's home directory.

## PR template excerpt

- Affected screens/states:
- Automated checks and results:
- Interaction evidence:
- Visual evidence (revision, viewport, theme):
- Pending acceptance and reasons:
- Deployment revision/readback, if applicable:

## CI integration

Use the project's actual commands as required jobs. Keep deterministic checks blocking; treat uncalibrated styling heuristics as review warnings. Establish reviewed visual baselines before enforcing comparison. Human review remains responsible for usability. Do not claim enforcement until workflow jobs and branch protection are actually configured and verified.
