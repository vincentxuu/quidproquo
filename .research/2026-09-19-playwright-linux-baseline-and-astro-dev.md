# Linux Playwright baselines from a Mac + Astro dev-server 30s timeout

Researched 2026-09-19. Read levels: ✅ full read · 🟡 snippet/search-result only · [推論] = my inference, not sourced.

Repo facts (read from disk ✅):
- `@playwright/test ^1.58.2`, `astro 7.3.2`, `@astrojs/cloudflare ^14.3.1`, `wrangler 4.131.2`
- `playwright.config.ts` already sets `snapshotPathTemplate: '{testDir}/{testFileName}-snapshots/{arg}-{projectName}-{platform}{ext}'`
- 8 baselines committed: 4 `-chromium-darwin`, 4 `-chromium-linux`
- config comment records the prior experiment: sharing mac baselines with ubuntu produced **~8000px diff against a 300px cap**, never green.

---

## Problem A — ranked options

### The crux question first: does arm64 vs amd64 Linux rendering differ?

**Yes, and it is the documented blocker.** Source: microsoft/playwright issue #13873 "[Question] Visual testing in docker on different CPU architecture" ✅ (read issue + all comments via `gh api`) — https://github.com/microsoft/playwright/issues/13873

- The reporter ran the **same** `mcr.microsoft.com/playwright:vX-focal` image on `linux/arm64` vs `linux/amd64` and got visibly different screenshots (side-by-side + diff images in the issue body).
- Playwright maintainer **dgozman**: *"It is expected that arm docker image vs intel docker image produce different screenshots — after all, they have different libraries/executables inside. Ideally, you would force intel image everywhere as you tried, but I guess that does not work as you've linked above. As for mitigation, we have maxDiffPixels and maxDiffPixelRatio in addition to threshold, but diff image suggests that you'll need pretty big values, so tests will not be that useful."*
- Reporter's final outcome: *"We tried everything in the book... Regardless of what we did, there was always about **10% of our screenshots that failed with diffs ranging from 0.01% to over 5%**. Laxing the threshold to 5% would have defeated the utility of the screenshots."*
- His resolution: *"The only way we could make it consistent with 0% threshold, was to just update the screenshot on CI machines via a GitHub PR comment and handle updating the screenshots by committing directly to the PR from CI."*

Magnitude calibration [推論, from the two sourced numbers]: darwin↔linux is a *different fonts installed* problem (this repo measured ~8000px). arm64↔amd64 Linux is a *sub-pixel AA / library build* problem (0.01%–5% of pixels, ~10% of shots affected). The second is far smaller but still blows past a 300px cap on the shots it hits.

Playwright first-party guidance on cross-platform stability (the ask's item 5) — `docs/src/test-snapshots-js.md` ✅ (https://github.com/microsoft/playwright/blob/main/docs/src/test-snapshots-js.md):
> ⚠️ "Browser rendering can vary based on the host OS, version, settings, hardware, power source (battery vs. power adapter), headless mode, and other factors. **For consistent screenshots, run tests in the same environment where the baseline screenshots were generated.**"

and:
> "`chromium-darwin` — the browser name and the platform. Screenshots differ between browsers and platforms due to different rendering, fonts and more, so you will need different snapshots for them."

That is the entirety of first-party cross-platform guidance. `docs/src/docker.md` ✅ contains **zero** mentions of arm64/amd64/architecture — Playwright documents no arch story at all.

---

### Option 1 (recommended) — CI-side `--update-snapshots` job that commits back

**How.** A `workflow_dispatch` (and/or PR-comment / PR-label) job on the same `ubuntu-*` runner + same container as the normal visual job, running `pnpm playwright test --update-snapshots`, then committing the changed PNGs to the PR branch.

Real-world examples (all ✅ read the raw YAML):
- **siemens/element** `.github/workflows/vrt-update.yaml` — https://github.com/siemens/element/blob/main/.github/workflows/vrt-update.yaml
  `on: workflow_dispatch` with inputs `ref` (branch) and `regenerate_all` (boolean: delete existing snapshots first), plus `workflow_call` and a `pull_request` re-run path. Runs `runs-on: ubuntu-24.04` with `container: mcr.microsoft.com/playwright:v1.62.1-noble@sha256:dcc5531e...` — **image pinned by digest**, which is the part that makes the baselines reproducible. Gated by `author_association` in `["COLLABORATOR","MEMBER","OWNER"]`. Configures git identity and checks out `steps.check.outputs.target-ref` with `lfs: true`.
- **Comfy-Org/ComfyUI_frontend** `.github/workflows/pr-update-playwright-expectations.yaml` — https://github.com/Comfy-Org/ComfyUI_frontend/blob/main/.github/workflows/pr-update-playwright-expectations.yaml
  Triggered by `pull_request: [labeled]` with label `New Browser Test Expectations`, **or** `issue_comment` starting with `/update-playwright`, gated on `author_association`. Uses `peter-evans/find-comment` + `create-or-update-comment` to give the requester an 👀 reaction and status. Notable comment in the file: *"issue_comment loads this workflow from the default branch. Resolve the image from the checked-out PR so regenerated snapshots match its CI."* — i.e. it re-resolves the container image from the PR branch so the update job and the verify job use the identical image.
- **elastic/elastic-charts** — the same pattern, per the #13873 author's own summary (link he gives: elastic-charts PR #1819 comment). ✅ via issue comments.
- Other hits from the same code search 🟡 (titles only, not read): `GlassKitApp/glasskit-ui/.github/workflows/visual-baselines.yml`, `superdingo101/daylight-calendar-card/.github/workflows/generate-playwright-baselines-pr.yml`, `xpadev-net/niconicomments/.github/workflows/playwright-update.yml`, `Mininglamp-OSS/octo-web/.github/workflows/e2e-baseline-bootstrap.yml`, `electrikhq/slate/.github/workflows/visual-regression.yml`.

Useful CLI detail for the job (`docs/src/test-cli-js.md` ✅):
> `-u` / `--update-snapshots [mode]` — "Possible values are `all`, `changed`, `missing`, `none` and `default`. Running tests without the flag defaults to `default`; running tests with the flag but without a value defaults to `changed`."

So `--update-snapshots=changed` (the bare-flag default) is right for a refresh; `--update-snapshots=missing` is right for a bootstrap-only job that must never silently overwrite an existing baseline; `regenerate_all` in the siemens workflow is implemented by deleting the snapshot files first, not by a flag.

**Cost / caveats.**
- Needs `permissions: contents: write` on the job and a push to the PR head branch; a push by `GITHUB_TOKEN` does **not** re-trigger workflows, so the verify run has to be dispatched separately or the job has to push with a PAT/app token [推論 — standard Actions behaviour, not sourced in this session].
- `pull_request_target` / `issue_comment` triggers run from the default branch and need the `author_association` gate both examples use, or a fork PR can run arbitrary code with write perms.
- Round-trip latency: still a CI round trip, but it is *one deliberate dispatch* instead of "let CI fail → download artifact → eyeball → commit".
- You still must review the diff — but the diff arrives as a commit on your branch, which is reviewable in the PR's Files-changed view instead of as a zip.

**Evidence strength.** Strongest of all options: it is what the #13873 reporter converged on after exhausting local options, endorsed implicitly by the maintainer thread, and there are ≥2 independently-written production workflows implementing it.

---

### Option 2 — Docker with `--platform linux/amd64` (emulation) on the Mac

**How.** The MCR image is genuinely multi-arch — I queried the registry manifest list directly ✅:
```
$ curl mcr.microsoft.com/v2/playwright/manifests/v1.58.0-noble (with MCR oauth token)
mediaType: application/vnd.docker.distribution.manifest.list.v2+json
{'architecture': 'amd64', 'os': 'linux'}
{'architecture': 'arm64', 'os': 'linux'}
```
so `--platform linux/amd64` resolves to a real amd64 image rather than failing.

Sketch (flags all from `docs/src/docker.md` ✅ — `--ipc=host`, `--init` are the documented recommendations):
```bash
# On the Mac host, first start the dev server (see Problem B for why):
ASTRO_DEV_BACKGROUND=0 pnpm dev --port 4321

# Then, in the container, point Playwright at the host and skip its own webServer:
docker run --rm --init --ipc=host \
  --platform linux/amd64 \
  -v "$PWD":/work -w /work \
  -e PW_TEST_HTML_REPORT_OPEN=never \
  mcr.microsoft.com/playwright:v1.58.2-noble \
  npx playwright test --update-snapshots
```
You must neutralise `webServer` + `baseURL` for the container run (e.g. a `playwright.docker.config.ts` that extends the base config with `baseURL: 'http://host.docker.internal:4321'` and no `webServer`) — the elastic-charts repro in #13873 used exactly `http://host.docker.internal:9002` ✅. Mounting the repo also means the container sees `node_modules/` built for darwin-arm64; safer to run `npx playwright test` with a container-local install or to mount only `tests/` + config [推論].

**Cost / caveats.**
- Docker's own docs, quoted in #13873 ✅: *"attempts to run Intel-based containers on Apple silicon machines under emulation can crash as qemu sometimes fails to run the container... Even when the containers do run correctly under emulation, they will be slower and use more memory... running Intel-based containers on Arm-based machines should be regarded as 'best effort' only."* (https://docs.docker.com/desktop/mac/apple-silicon/#known-issues, quoted verbatim in the issue).
- The #13873 reporter **tried this and it did not work for him** — he hit microsoft/playwright#13724 (comment 1112358113) running tests under `--platform=linux/amd64` on an M1 even with Rosetta 2 installed and current Docker. 🟡 (I read his description of #13724, not #13724 itself.)
- Docker Desktop's Rosetta-for-x86 setting and OrbStack's Rosetta support have both improved substantially since 2022 (that issue is from May 2022), so this may simply work today on Apple Silicon — **but I found no 2024+ source confirming it, and no source confirming that Rosetta-emulated Chromium rasterises identically to native amd64.** Treat "rendering is identical to CI" as unverified. Rosetta translates the x86 binary but the FP/SIMD paths Skia takes are the emulated x86 ones, so identity is plausible but must be proven empirically [推論].
- **Verification recipe before trusting it:** generate one baseline under `--platform linux/amd64` locally, commit it, and run the existing CI job. If CI goes green at the current 300px cap, the approach is proven for this repo; if not, drop to Option 1.
- Speed: expect a multiple of native runtime; the 4-screenshot suite here is small enough that this is not the deciding factor [推論].

---

### Option 3 — Native `linux/arm64` Docker image on the Mac

**How.** Same command as Option 2 minus `--platform` (Docker picks arm64 natively). Fast, no emulation, no qemu crashes.

**Cost / caveats.** The baselines it produces are **for arm64, and GitHub's `ubuntu-latest` is amd64** — so they are the wrong baselines unless you also move CI. Exactly the failure documented in #13873 ✅.

Two ways to make it viable:
- **Move the CI job to an arm64 runner** (`runs-on: ubuntu-24.04-arm`). Then Mac-native-arm64 Docker and CI agree on architecture. 🟡 *I did not verify GitHub's arm64 runner labels or their availability/pricing for this repo in this session — verify against GitHub's runner docs before acting.* If it holds, this is the cheapest steady state after Option 1: baselines regenerate locally in seconds.
- Accept the 0.01%–5% arm/amd drift and raise `maxDiffPixels` — which the maintainer explicitly warned makes the tests "not that useful" ✅.

---

### Option 4 — The undocumented `ssim-cie94` comparator

**How.** In `playwright.config.ts`:
```ts
expect: {
  toHaveScreenshot: { _comparator: 'ssim-cie94' },
  toMatchSnapshot:  { _comparator: 'ssim-cie94' },
}
```

**Evidence.** Proposed by Playwright maintainer **aslushnikov** at the end of #13873 ✅: *"TL;DR: please try out the new experimental `ssim-cie94` image comparator. ... It was designed to combat browser rendering non-determinism."* User `gselsidi` in the same thread ✅: *"confirmed working! went back down to .0001% diffpixelratio and passing"* and later *"0 worked!"* (with a caveat two comments down that a handful of tests still failed at exactly 0 and needed `0.0001%`).

It is **still in the shipped source today** — `packages/utils/comparators.ts:81` `if (options.comparator === 'ssim-cie94')` ✅ (https://github.com/microsoft/playwright/blob/main/packages/utils/comparators.ts).

**Cost / caveats.**
- **Not in the public docs.** I grepped `docs/src/test-api/class-testconfig.md`, `class-testinfo.md`, `class-testoptions.md` ✅ — the only documented knobs are `maxDiffPixels`, `maxDiffPixelRatio`, `threshold` (pixelmatch/YIQ, default 0.2), `stylePath`, `pathTemplate`. The word "comparator" appears only inside the `threshold` prose; "ssim" appears nowhere. The leading underscore in `_comparator` is Playwright's marker for an internal option — **no stability guarantee, can break on any minor upgrade.**
- It targets *rendering non-determinism* (AA, sub-pixel). It will not close an ~8000px darwin↔linux font-substitution gap — different glyphs are a different problem from differently-antialiased glyphs [推論].
- Best used as a *multiplier* on Option 2 or 3, not as a standalone fix.

---

### Option 5 — Drop `{platform}` from `snapshotPathTemplate` / `_snapshotSuffix = ''`

**What the docs say.** `TestInfo.snapshotSuffix` exists but is marked **discouraged** ✅ (`docs/src/test-api/class-testinfo.md:430-439`): *"Use of `TestInfo.snapshotSuffix` is discouraged. Please use `TestConfig.snapshotPathTemplate` to configure snapshot paths."* `TestConfig.snapshotDir` carries the same discouragement notice. There is **no `_snapshotSuffix` in the public docs** — if you have seen that spelling it is the old internal name; do not rely on it.

The supported way to drop the platform is simply to remove the `{platform}` token from the existing `snapshotPathTemplate`:
```ts
snapshotPathTemplate: '{testDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}'
```

**What breaks.** For darwin↔linux, this is already proven not to work **in this repo**: the config's own comment records ~8000px diff vs a 300px cap, never green ✅ (read from `playwright.config.ts`). It contradicts the first-party warning quoted above. Only consider it for linux-arm64↔linux-amd64 *after* measuring the actual diff.

---

### Option 6 — Just loosen `maxDiffPixels` / `threshold`

Documented ✅ (`test-snapshots-js.md`, `class-testconfig.md`): `maxDiffPixels` (int), `maxDiffPixelRatio` (0..1), `threshold` (0..1, pixelmatch YIQ, default 0.2), settable globally under `expect.toHaveScreenshot` or per-assertion.

Maintainer's verdict for exactly this cross-arch use case ✅: *"you'll need pretty big values, so tests will not be that useful."* Reporter's verdict: 5% would have "defeated the utility". **Not a solution; a last-resort escape valve.**

---

### Dead end worth naming: `rebaselines.patch`

`--update-source-method [patch|3way|overwrite]` and the `rebaselines.patch` file printed with `git apply …` **only apply to snapshots embedded in source code** (aria snapshots / inline `toMatchSnapshot` values) — `packages/playwright/src/runner/rebase.ts` ✅ builds the patch from source files via `createPatch(relativeToGit, source, result)`. It does **not** emit PNG baselines, so it cannot be used to ship linux image baselines back from CI as a patch.

---

## Problem B — `astro dev` "Dev server failed to start within 30s"

**This is not a platformProxy / workerd / miniflare problem. Root cause found, reproduced, and fixed.** All of this is read directly from the installed `astro@7.3.2` in `node_modules` ✅ plus official Astro docs ✅.

### Cause

1. Astro 7 auto-backgrounds the dev server when it detects an AI agent.
   `node_modules/astro/dist/cli/dev/index.js:86-91` ✅:
   ```js
   const agentDetected = !process.env.ASTRO_DEV_BACKGROUND && isRunByAgent();
   if (agentDetected) { flags.json = true; }
   const wantsBackground = !!flags.background || agentDetected;
   ```
   `node_modules/astro/dist/cli/agent.js` ✅ delegates to the `am-i-vibing` package: `detectAgenticEnvironment().type === 'agent'`. The CLI's own message (same file, line 21): *"an auto-detected AI agent environment, which runs the dev server in the background automatically"*.
2. Background mode waits a **hardcoded 30 s** for the child to write the lock file.
   `node_modules/astro/dist/cli/server.js:148,167` ✅:
   ```js
   const timeout = 3e4;                       // <- hardcoded, no flag, no env var
   ...
   logger.error("SKIP_FORMAT", `${config.displayName} failed to start within ${timeout / 1e3}s.`);
   ```
3. The lock file is only written **after** the dev server is fully up — `node_modules/astro/dist/cli/dev/index.js:161-170` ✅ calls `writeLockFile(...)` only after `await devServer(inlineConfig)` resolves and a URL exists.
4. This repo takes longer than 30 s to reach that point. **Measured ✅: 37 s** to print `┃ Local http://localhost:4399/`. Contributing factors visible in `.astro/dev.log` ✅: `"Astro config changed"` → `"Clearing content store"` → a full content re-sync with Shiki re-highlighting every post, against a **118 MB `.astro/data-store.json`**. Cloudflare bindings (D1/KV/Vectorize/AI/Images) initialise fine and early in that log — workerd is not the bottleneck.

So: the server actually starts every time. The launcher gives up at 30 s, SIGTERMs the healthy child, deletes the lock file, and exits 1.

### Fix (officially documented)

Astro docs, "Background mode for AI coding agents" ✅ — https://docs.astro.build/en/guides/build-with-ai/#background-mode:
> "To opt out of automatic background mode, set the `ASTRO_DEV_BACKGROUND` or `ASTRO_PREVIEW_BACKGROUND` environment variable before running the command:
> ```shell
> ASTRO_DEV_BACKGROUND=0 astro dev
> ASTRO_PREVIEW_BACKGROUND=0 astro preview
> ```"

**Verified working on this machine ✅** — `ASTRO_DEV_BACKGROUND=1 npx astro dev --port 4399` ran in the foreground and was serving in 37 s. (The code only tests whether the variable is *set*, so `0` and `1` behave identically; use the documented `=0`.)

Concrete application: export `ASTRO_DEV_BACKGROUND=0` in the Playwright `webServer` env, or in `pnpm dev`. The Playwright `webServer.timeout` here is already 300 s, so once Astro stops self-terminating, the existing config is fine.

### Non-fixes, explicitly checked

- **There is no env var or flag to raise the 30 s timeout.** `3e4` is a literal in `server.js`; the full documented flag list for `astro dev` (`cli-reference.mdx` ✅ — `--background`, `--mode`, `--port`, `--host`, `--open`, `--force`, `--ignore-lock`, `--allowed-hosts`, `--json`, `--root`, `--config`, …) contains nothing timeout-related. Do not go looking for one.
- **`--ignore-lock` does not help on 7.3.2.** In the *installed* build, `wantsBackground` ignores `ignoreLock` (line 91 above). On Playwright—sorry, on Astro `main` it was changed so agent-inferred background yields to `--ignore-lock` (source comment cites withastro/astro#17903 ✅, https://github.com/withastro/astro/blob/main/packages/astro/src/cli/dev/index.ts). Don't rely on it at 7.3.2.
- **No port/firewall/sandbox cause.** `.astro/dev.log` shows Vite `connected.`, `.dev.vars` loaded, and the Cloudflare binding warnings (AI, AI Search, Vectorize `remote: true` notices) all appearing normally before the timeout fired.

### Secondary, worth doing anyway

- `.astro/data-store.json` at **118 MB** ✅ is the reason startup is 37 s rather than ~5 s. `astro dev --force` clears the content-layer cache (documented ✅ in `cli-reference.mdx`: *"--force  Clear the content layer cache, forcing a full rebuild."*) — a one-off rebuild may shrink it. Repeated "Astro config changed → Clearing content store" in the log means every config touch pays the full re-sync.
- Astro exposes a **health endpoint `/_astro/status`** returning `{"ok": true}`, dev-server-only ✅ (same docs page). That is a cleaner readiness probe for `tests/visual/global-setup.ts` than fetching a page.
- The Cloudflare warnings suggest setting `remote: true` on the AI / AI Search bindings in wrangler config to silence them; Vectorize *"do[es] not support local development"* locally ✅ (from `.astro/dev.log`, i.e. wrangler's own output).

---

## Suggested plan for this repo

1. **Now, free:** `ASTRO_DEV_BACKGROUND=0` in `pnpm dev` / Playwright `webServer.env`. Problem B closed.
2. **Best durable fix for A:** add `.github/workflows/visual-baselines-update.yml` — `workflow_dispatch` (inputs: `ref`, `regenerate_all`) running the same ubuntu runner/container as the verify job, `pnpm playwright test --update-snapshots`, commit the changed `*-chromium-linux.png` back to the branch. Model it on `siemens/element/.github/workflows/vrt-update.yaml`, in particular **pinning the Playwright container by digest** so the update job and the verify job cannot drift.
3. **Optional local accelerator, needs one empirical proof:** try `--platform linux/amd64` Docker with the dev server on the host via `host.docker.internal`. Generate one baseline, push, see if CI goes green at the 300px cap. If yes, you get a local loop; if it crashes under qemu or the diff exceeds the cap, fall back to (2) and stop spending time on it.
4. **Do not** drop `{platform}` from `snapshotPathTemplate`, and do not raise `maxDiffPixels` to paper over arch drift — both are documented dead ends and one is already recorded as failed in this repo's own config comment.
