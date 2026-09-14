# Final validation

PASS: target-pair references; target-pair quality (nonblocking career-tag advisory); zh terminology; equal external source sets and heading counts; unchanged publication identity; scoped git diff --check; repository lint.

Full pnpm verify after both translations: failed six checks due to existing out-of-scope worktree issues (Astro types, references, quality, zh terminology, series order, language parity). AIP pair is absent from final failure output. See verify-final.log and Q-024.

No commit or deployment. AIF reference article unchanged.
