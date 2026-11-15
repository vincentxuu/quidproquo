# Deploy failure repair

Root cause: check:crag-coverage rejects stale Odo Kaigan and Seoninbong review statistics.
Scope: two review records; preserve article content, validators and workflows.
Evidence: /tmp/qp-deploy-failed.log; existing research records and current gallery.
Next: run pnpm verify, inspect diff, publish only repair scope, verify Actions and production status with authorization.

Validation: pnpm check:crag-coverage (38 checked, 0 problems), git diff --check, full pnpm verify all green.
Publication: user authorized commit push on 2026-11-04; commit and deployment tracking in progress.
