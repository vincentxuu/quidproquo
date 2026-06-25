---
title: "Bumblebee: A Design Teardown of Perplexity's Read-Only Supply Chain Endpoint Scanner"
date: 2026-05-25
category: tech
type: deep-dive
tags: [bumblebee, supply-chain-security, perplexity, security, golang, mcp, developer-tools]
lang: en
tldr: "A Go read-only scanner open-sourced by Perplexity in May 2026 (v0.1.1, zero non-stdlib dependencies). It inventories npm/PyPI/Go/RubyGems/Composer/MCP/editor and browser extensions into NDJSON, matches against a custom exposure catalog, and answers the question 'which machines in my fleet are currently affected' the moment a supply chain incident hits. It deliberately never invokes any package manager and is not an EDR."
description: "A deep dive into the internal design of Perplexity's open-source tool Bumblebee: path-shape dispatch, content-addressed record_id hashing, snapshot-only state model, exact-match exposure catalog, single-producer walker concurrency model, and how it differs from OSV-Scanner, Syft, and osquery."
draft: false
---

🌏 [中文版](/posts/tech/2026-05-25-bumblebee-supply-chain-scanner)

Perplexity open-sourced [Bumblebee](https://github.com/perplexityai/bumblebee) in May 2026 — a "read-only" package inventory tool designed to run on developer laptops. It answers a narrow but time-critical question: when an advisory names a specific package, version, extension, or MCP configuration as compromised, **which machines in my fleet currently have it installed on disk?** This post dissects its internal design — why every "non-feature" is intentional, and where it draws the line against tools like OSV-Scanner, Syft, and osquery. The baseline version is v0.1.1, written in Go, with zero non-stdlib dependencies, and supports macOS and Linux only.

## Filling the Gap Between SBOM and EDR

The official README nails the positioning:

> SBOMs help answer what shipped, and EDR helps answer what ran or touched the network, but supply-chain response often needs a different view: messy local state across lockfiles, package-manager metadata, extension manifests, and supported developer-tool configs.

In other words: SBOMs answer "what did we ship" (build artifacts, repos); EDRs answer "what ran and touched the network" (processes, network). The missing piece in between is **what's actually sitting on developer laptops right now** — lockfiles scattered everywhere, package manager installation metadata, editor and browser extension manifests, MCP configuration files. Bumblebee consolidates all of this into structured NDJSON, then runs it against an "exposure catalog" for exact matching. It's an inventory collector with a minimal matcher — not a vulnerability scanner, and it explicitly states "is not an EDR."

This scope was driven by recent events: the ecosystems it covers map directly to ongoing supply chain attack waves like Mini Shai-Hulud, affecting npm, PyPI, RubyGems, Go modules, and Composer, with victims including TanStack, SAP, and Zapier.

## Paranoidly Read-Only: Why It Never Invokes a Package Manager

Bumblebee's core design principle is captured in a single README line:

> A scanner that invokes npm to check for exposure has already triggered the attack it was looking for.

npm lifecycle scripts like `postinstall` are exactly how most supply chain worms spread. A scanner that calls `npm`/`pip`/`go` to "check for exposure" has already triggered the very attack it was trying to find. So `SECURITY.md`'s threat model hardcodes four "nevers": never execute discovered packages, never download package content or fetch threat intelligence at runtime, never parse source code, never require elevated privileges.

In practice, this principle becomes **path-shape dispatch**: the walker in `internal/walk` only "visits directories," and `internal/scanner` dispatches to parsers based on **filename/path shape**. Each parser only opens the exact file it matched. The practical benefit: browser profile files like `Cookies`, `Login Data`, `Cache`, and `IndexedDB` — since they never match any dispatch rule — are never opened, even when the `deep` profile scans the entire home directory. On macOS, the entire `Library/Application Support/<browser>` subtree is excluded (TCC protection).

Secret leak prevention is also a first-class concern: `env` values and key names from MCP configuration files are never captured; remote MCP server URLs are truncated to just `scheme://host`, with userinfo, query, fragment, and path all discarded to prevent credentials embedded in paths from leaking. Even `.env`/`.envrc` files are skipped even if they land in an unexcluded directory. Sensitive values like `--device-id-env` and `--http-token-env` are only read from environment variables, never from CLI arguments, to prevent exposure via process listings.

## What Gets Inventoried and How Confidence Is Assessed

v0.1 covers eight emitted ecosystems, but reads far more file shapes. Critically, it **only reads metadata, never unpacks source code**, and each record carries a `confidence` field (high / medium / low) indicating evidence strength:

- **npm / pnpm / Yarn / Bun** (all emit `ecosystem=npm`): reads `package-lock.json` (v1/v2/v3 handled by a single union schema), `pnpm-lock.yaml`, `yarn.lock` (Classic + Berry), and `bun.lock`. Captures `install_scope`, `direct_dependency`, `has_lifecycle_scripts`, and hook names (`postinstall`, etc.), but **never captures script content**.
- **Go**: `go.sum` lines in `module v1.2.3 h1:...` format yield high confidence; `go.mod` infers direct/indirect using `// indirect` comments, which gives lower confidence. The entire `~/go/pkg/mod` module cache is scanned, so heavy Go users running baseline scans may see tens of thousands of lines — this is intentional package-presence coverage.
- **PyPI**: reads only the RFC-822 header block from `*.dist-info/METADATA`, stopping at the first blank line; the description body is never scanned.
- **MCP**: parses only JSON host configs (`claude_desktop_config.json`, `.mcp.json`, `~/.gemini/settings.json`, etc.), inferring package identity from command/args (`npx -y @scope/pkg` → `@scope/pkg`, docker image tag → version). MCP records default to `confidence=low` — these are "configuration references," not running processes. Only docker images with pinned tags or `@sha256:` digests are promoted to medium.
- **Editor / browser extensions**: reads `package.json` from VS Code / Cursor / Windsurf / VSCodium, and `manifest.json` from Chromium-based browsers (including Comet, Arc, Brave) and `extensions.json` from Firefox.

Extensions and MCP configs are Bumblebee's most distinctive coverage area — traditional SCA tools almost never touch them, yet on developer endpoints they both have direct execution capability, have grown rapidly in 2025–2026, and lack any installed-state correlation tooling.

## record_id Is a Content-Addressed Hash; State Lives Downstream

Bumblebee is **snapshot-only**: endpoints store no delta database, no cache. Each scan emits a complete snapshot plus one `scan_summary` record and terminates. All state derivation is delegated to the receiver, avoiding bad deltas caused by missed runs, parser version changes, or deleted projects.

The key is `record_id` in `internal/model/model.go` — it's a **content-addressed SHA-256**, not a hash of the entire JSON payload, but of "a set of canonical fields for each record type":

```go
func stableID(recordType string, parts []string) string {
    canonical := recordType + "\x00" + joinWithUnitSeparator(parts) // joined with \x1e
    digest := sha256.Sum256([]byte(canonical))
    return recordType + ":" + hex.EncodeToString(digest[:])
}
```

For package records, the tuple includes profile, ecosystem, normalized_name, version, project_path, source_file, and so on. The effect: the same package observed in the same configuration, across runs, across hosts, even if `scanner_version` or `run_id` differs, produces the same `record_id` — making it the receiver's dedupe and join key. By contrast, `run_id` is a "128-bit random hex generated at the start of each scan," entirely decoupled from record_id.

How should receivers use this? The documentation gives one iron rule: **only promote a run to current state after receiving its corresponding `scan_summary` with `status=complete`**. Runs marked `partial`, `error`, timed out, or missing their summary are treated as raw evidence only; the most recent complete run remains authoritative. `state-model.md` even includes five suggested tables (`inventory_records_raw`, `inventory_runs`, `inventory_current`, `inventory_history`, `exposure_findings`) with SQL.

## Exposure Catalog: Exact Matching, Not a Vulnerability Database

This is the sharpest conceptual difference from typical SCA tools. Bumblebee **contains no built-in advisory feed** and makes no automatic queries to OSV, GHSA, or npm advisories. Matching is driven by an operator-supplied catalog, and v0.1 only performs **exact** `(ecosystem, name, version)` matching — no version ranges, no hash matching.

`internal/exposure/exposure.go` indexes each catalog entry by `ecosystem\x00normalized_name`, performs O(1) index lookups and then linear version string comparisons. Before matching, package names in the catalog run through the same normalization used at emit time (`normalize.PyPI` / `normalize.NPM`), so writing `Requests` or `@TanStack/Query-Core` in your catalog will still match. `MatchAll` explicitly supports the case where a single package version is covered by multiple advisories — overlaps are never silently dropped; each hit generates an independent finding.

The catalog format is strict: it must be a JSON object with `schema_version` and `entries`; bare top-level arrays are rejected; future schema versions are rejected; each entry must include `id`, `ecosystem`, `package`, and at least one `versions` entry. `--exposure-catalog` accepts a single file or an entire directory (merged in alphabetical order; all files must share the same schema_version). The repo's `threat_intel/` directory ships 7 ready-made catalogs covering recent incidents including Mini Shai-Hulud, Laravel Lang, and the Nx Console VS Code extension, drafted by Perplexity Computer, submitted via PR, and merged after human review.

## How Scanning Works: Single-Producer Walker + N Workers

The concurrency model in `internal/scanner/scanner.go` is a classic producer/consumer:

```
bumblebee scan --profile P [--exposure-catalog C]
        │  roots.go: profile → resolve roots (baseline/project use curated lists; deep requires explicit --root)
        ▼
   walk (single-threaded producer, dispatches by filename)
        │  job ──► chan(cap 256)
        ▼
   worker 1 .. worker N (default --concurrency 4; each file parser single-threaded)
        │  model.Record
        ▼
   exposure.MatchAll(r)  ── (ecosystem, name, version) exact match
        │  package / finding / scan_summary (NDJSON)
        ▼
   sink: stdout / file / http(S)
```

The walker is the sole single-threaded producer — on filename hit, it pushes a job into the buffered channel. N workers each parse independently: "orchestrator owns concurrency; each ecosystem scanner is single-threaded per file." Shared counters are protected with `sync.Mutex`. `--max-duration` is implemented via `context.WithTimeout`; the walker and workers each `select <-ctx.Done()` before processing each item. On timeout, `scan_summary.timed_out=true`. `main.go` also catches `SIGINT/SIGTERM → cancel()`, so Ctrl-C follows the same cancellation path.

A few details worth noting: `root_kind` is determined by the "longest enclosing configured root containing the file," overriding the value pre-filled by the parser (which is why `.mcp.json` in a project directory gets tagged `project_root`). Error classification is thoughtful — permission denied (EACCES/EPERM, including macOS TCC) is demoted to debug; path not found (ENOENT) to info; everything else to warn. Fleet pipelines don't need to allowlist routine permission denials.

Finally, `selftest`: fixtures and catalogs are embedded into the binary via `//go:embed`, extracted to a temp directory at runtime, scanned with the project profile, and asserted to produce "exactly 3 findings" (one npm, one PyPI, one MCP config with a pinned docker image). Both sinks use `io.Discard`, 30-second timeout, zero network. Fake package names are `bumblebee-selftest-evil@0.0.0`. A non-zero exit means this build can no longer detect what it's supposed to detect — a fast smoke test before fleet rollout.

## Comparison with OSV-Scanner / Syft / osquery

No single tool overlaps completely with it (read-only endpoint inventory + custom exact catalog + extension and MCP coverage), but two axes clarify the landscape:

- **OSV-Scanner** (Google) is the closest analog: both read lockfiles without invoking package managers. The difference is that OSV-Scanner matches against **version ranges** in the OSV.dev vulnerability database, targeting CI and single projects; Bumblebee matches against your **custom exact-version catalog**, targeting fleet-wide incident response, with no built-in feed whatsoever.
- **Syft (+ Grype)** (Anchore): highly overlapping inventory capability, but the output is SBOM (CycloneDX/SPDX), targeting containers and build artifacts, typically paired with Grype for vulnerability finding. Doesn't cover extensions or MCP, and has no "fleet endpoint current-state" receiver model.
- **osquery**: also a fleet endpoint perspective, but queries through OS-level package managers as a persistent agent. Little coverage of developer lockfiles, MCP configs, or extensions.
- **EDR**: Bumblebee explicitly does not touch process/network/file-hash IOCs — that's EDR territory.

One-liner positioning: it's approximately "OSV-Scanner's read-only lockfile approach" + "osquery's fleet endpoint perspective" + "coverage for extensions and MCP," but with deliberately minimal matching logic — designed to rapidly answer "who got hit" the moment an incident breaks.

## Limitations and Trade-offs

Known limitations: **macOS and Linux only, no Windows** (the community's biggest complaint); no coverage for Cargo, Maven/Gradle, NuGet, Hex, Swift PM, Yarn PnP's `.pnp.data.json`, Bun binary `bun.lockb`, or Safari extensions. `version` is often empty for MCP configs and many package managers (configurations don't pin install versions). Exposure matching is exact-only, no version ranges. The `threat_intel` catalog is AI-drafted; the README explicitly requires "review against current advisories before production use."

Overall, every "non-feature" in Bumblebee is a design choice, not laziness: no execution (avoids triggering postinstall worms), no state storage (avoids bad deltas), no built-in feed (correlation offloaded to downstream), no direct object storage transport (avoids scattering cloud credentials to every endpoint), no secret capture (env/URL actively scrubbed). It concentrates complexity in "clean snapshot + stable record_id + receiver-side current-state model," delivering a zero-dependency, auditable, one-shot binary that's safe to run on developer laptops. The trade-off is that it's deliberately blunt — it doesn't understand version ranges, severity, requires you to supply your own catalog and your own backend — but for the narrow question of "at incident time, who in the fleet got hit," it's exactly as blunt as it needs to be.

## References

- [perplexityai/bumblebee (GitHub)](https://github.com/perplexityai/bumblebee)
- [Perplexity Is Open-Sourcing Bumblebee (official blog)](https://www.perplexity.ai/hub/blog/perplexity-is-open-sourcing-bumblebee)
- [Bumblebee docs: inventory-sources.md](https://github.com/perplexityai/bumblebee/blob/main/docs/inventory-sources.md)
- [Bumblebee docs: state-model.md](https://github.com/perplexityai/bumblebee/blob/main/docs/state-model.md)
- [Bumblebee docs: transport.md](https://github.com/perplexityai/bumblebee/blob/main/docs/transport.md)
- [OSV-Scanner](https://github.com/google/osv-scanner)
- [Syft (Anchore)](https://github.com/anchore/syft)
- [Grype (Anchore)](https://github.com/anchore/grype)
- [osquery](https://github.com/osquery/osquery)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Socket: supply chain attack coverage](https://socket.dev/blog)
