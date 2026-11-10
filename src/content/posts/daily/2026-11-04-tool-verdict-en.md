---
title: "Tool of the Day｜Verdict — a 197 KB local classifier that calls out “exit code 0 means success”"
date: 2026-11-04
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "An open-source, 197 KB local classifier that reads command, exit code, stdout, and stderr to tell whether a CLI tool call was actually success, failure, blocked, or unknown"
tldr: "Verdict is an Apache-2.0, 197 KB local classifier that reads four inputs — command, exit code, stdout, stderr — and decides whether a CLI tool call was success, failure, blocked, or unknown. Install: git clone, then pip install . inside the project directory. It solves the problem of exit code 0 not actually proving a task finished: on 48 CLI families never seen during training, it hits 93.2% accuracy versus 47.9% for exit code alone."
series:
  name: "AI Tool of the Day"
  order: 73
---

> 🌏 [中文版](/posts/daily/2026-11-04-tool-verdict)

## Tool info

| Item | Value |
|---|---|
| Name | Verdict |
| Type | CLI / Python SDK (local classifier) |
| GitHub | [Balanov/verdict](https://github.com/Balanov/verdict) |
| Stars | 223 (at time of writing) |
| Language | Python (standard library only, no runtime dependencies) |
| License | Apache-2.0 (code and model weights); the synthetic training corpus is CC0-1.0 |
| Install | `pip install .` (inside the project directory after `git clone`) |

## What problem it solves

When your coding agent finishes running a command, whether it retries, stops, or tells you "done" usually comes down to a single bit: was the exit code 0. But exit code 0 can mean no tests were ever collected (`pytest` exits cleanly even when it finds nothing to run), a background worker it's still waiting on, or an API that returned a 500 without the CLI reflecting that in its exit status. Conversely, a non-zero exit can just mean a permissions, dependency, or network problem blocked execution — not that the program's logic actually failed. An agent needs to tell these apart before it decides to retry, stop and ask, or move on — yet most agent harnesses still make that call with exactly one bit of information.

Verdict feeds four inputs — command, exit_code, stdout, stderr — into a 197 KB int8-quantized logistic regression model (hashed character 3–5-grams and word 1–3-grams as features), running pure-Python inference with a median latency of 0.54 ms on CPU, no network calls, no telemetry. It outputs one of four labels — `success`, `failure`, `blocked`, `unknown` — with class probabilities attached. The author repeats throughout the README and the Hugging Face model card that this is advisory classification, not authoritative proof that a task completed, and that it shouldn't alone authorize destructive actions or declare critical work done — exit codes, deterministic validators, and authoritative environment-state checks still have to be the final word.

```diagram
title: How Verdict classifies one tool call into 4 outcomes
desc: Command, exit code, stdout, and stderr feed together into a 197 KB local classifier, which outputs one of success, failure, blocked, or unknown; in the pytest example shown here, no tests were collected, so the classifier calls it unknown, not success.
caption: Simplified: omits hashed feature extraction and probability output details.
---
<svg viewBox="0 0 560 280">
  <path class="dg-line" d="M170 44H190" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M170 108H190" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M170 172H190" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M170 236H190" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M350 44H370" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M350 108H370" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M350 172H370" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M350 236H370" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="20" y="20" width="150" height="48" rx="6"/>
  <text class="dg-label" x="95" y="38" text-anchor="middle" dominant-baseline="central">Command</text>
  <text class="dg-sub" x="95" y="56" text-anchor="middle" dominant-baseline="central">pytest tests/</text>

  <rect class="dg-box" x="20" y="84" width="150" height="48" rx="6"/>
  <text class="dg-label" x="95" y="102" text-anchor="middle" dominant-baseline="central">Exit code</text>
  <text class="dg-sub" x="95" y="120" text-anchor="middle" dominant-baseline="central">0</text>

  <rect class="dg-box" x="20" y="148" width="150" height="48" rx="6"/>
  <text class="dg-label" x="95" y="166" text-anchor="middle" dominant-baseline="central">stdout</text>
  <text class="dg-sub" x="95" y="184" text-anchor="middle" dominant-baseline="central">no tests ran</text>

  <rect class="dg-box" x="20" y="212" width="150" height="48" rx="6"/>
  <text class="dg-label" x="95" y="230" text-anchor="middle" dominant-baseline="central">stderr</text>
  <text class="dg-sub" x="95" y="248" text-anchor="middle" dominant-baseline="central">(empty)</text>

  <rect class="dg-box dg-box--accent" x="190" y="20" width="160" height="240" rx="6"/>
  <text class="dg-label" x="270" y="131" text-anchor="middle" dominant-baseline="central">Verdict classifier</text>
  <text class="dg-sub" x="270" y="151" text-anchor="middle" dominant-baseline="central">197 KB・CPU・&lt;1ms</text>

  <rect class="dg-box" x="370" y="20" width="150" height="48" rx="6"/>
  <text class="dg-label" x="445" y="38" text-anchor="middle" dominant-baseline="central">success</text>
  <text class="dg-sub" x="445" y="56" text-anchor="middle" dominant-baseline="central">positive evidence</text>

  <rect class="dg-box" x="370" y="84" width="150" height="48" rx="6"/>
  <text class="dg-label" x="445" y="102" text-anchor="middle" dominant-baseline="central">failure</text>
  <text class="dg-sub" x="445" y="120" text-anchor="middle" dominant-baseline="central">concrete failure</text>

  <rect class="dg-box" x="370" y="148" width="150" height="48" rx="6"/>
  <text class="dg-label" x="445" y="166" text-anchor="middle" dominant-baseline="central">blocked</text>
  <text class="dg-sub" x="445" y="184" text-anchor="middle" dominant-baseline="central">env, not logic</text>

  <rect class="dg-box dg-box--accent" x="370" y="212" width="150" height="48" rx="6"/>
  <text class="dg-label" x="445" y="230" text-anchor="middle" dominant-baseline="central">unknown</text>
  <text class="dg-sub" x="445" y="248" text-anchor="middle" dominant-baseline="central">insufficient evidence</text>
</svg>
```

Good fit: wiring it into a coding agent's harness as an extra semantic check before the agent retries, stops, or tells you a task is "done"; or into a CI observability layer to catch a test suite that never actually ran even though it showed a green exit 0. Not a fit as the sole basis for a safety or correctness judgment — it only classifies what the evidence of one call looks like, not whether the code is correct or safe.

## Quick start

### Install

```bash
git clone https://github.com/Balanov/verdict.git
cd verdict
python -m pip install .
```

### Basic usage

```python
from verdict_tiny import Verdict

model = Verdict()
result = model.predict(
    command="pytest tests/",
    exit_code=0,
    stdout="collected 0 items\nno tests ran in 0.01s",
)
print(result)
```

```json
{
  "label": "unknown",
  "confidence": 0.999981,
  "probabilities": {
    "success": 0.000019,
    "failure": 0.0,
    "blocked": 0.0,
    "unknown": 0.999981
  },
  "advisory": true
}
```

There's also a CLI that reads from stdin:

```bash
printf 'collected 0 items\nno tests ran\n' | verdict \
  --command 'pytest tests/' --exit-code 0
```

### Advanced usage

The model, the training corpus, and the training scripts are all public (the synthetic data is CC0-licensed), so you can rerun the whole pipeline yourself to verify the 93.2% figure, or retrain on your own corpus:

```bash
python -m pip install -e '.[train,dev]'
python training/train.py
pytest -q
```

`training/train.py` regenerates the public corpus, trains from scratch, exports int8 weights, and re-runs the benchmark into `bench/results.json`.

## Compared to existing approaches

| | Verdict | Exit code alone | LLM-as-judge (a separate LLM call judging the output) |
|---|---|---|---|
| Inference cost | 197 KB, CPU, median 0.54ms, zero API calls | Nearly free, but only one bit of signal | Every judgment needs another LLM API call — latency and cost |
| Accuracy (48 CLI families unseen in training) | 93.2% | 47.9% | Not benchmarked head-to-head here; depends on the model and prompt used |
| Offline, zero telemetry | ✅ No network calls | ✅ | ❌ Depends on an external API |
| Reproducible training corpus and scripts | ✅ Public (CC0), `python training/train.py` reruns it | — | Mostly a black box, not reproducible |
| Output labels | 4 classes: success/failure/blocked/unknown, with probabilities | 2 classes: zero/non-zero | Custom per prompt, no standardized output contract |

## Things to watch out for

- **This is a research preview, not a production release.** `pyproject.toml` marks it `Development Status :: 3 - Alpha`. Both the training and test corpora are programmatically generated synthetic data (1,440 training records, 192 test records, from 60/48 CLI template families respectively) and are English-biased. The author states plainly in the README that it "has not been validated on a representative production trace corpus" — 93.2% measures generalization across held-out templates, not production reliability. Validate against your own real logs before picking a threshold for your own harness.
- **Probabilities aren't calibrated.** The README is explicit that these probabilities are "not calibrated confidence in a safety-critical sense." Don't let a high-looking probability on one label alone trigger a retry, rollback, or any other action with real side effects.
- **It classifies what the evidence looks like, not whether something is correct or safe.** The model card's out-of-scope list is explicit: no general task-completion judgment, no code-correctness judgment, no safety or policy enforcement, and it's not meant for general natural-language text outside CLI output.

## Today's takeaway

An exit code only ever encodes one bit — zero or non-zero — but what an agent actually needs to tell apart is at least four situations. Closing that semantic gap turns out not to require another call to a cloud LLM: a 197 KB, pure-standard-library model that runs in under a millisecond on CPU takes accuracy from 47.9% to 93.2%. It's a reminder that the "did this actually finish" layer in a lot of agent harnesses is still as coarse as a single bit — and filling that gap doesn't have to mean adding a heavier dependency (another LLM call, another observability platform). It can go the other way: lighter, with zero latency, zero cost, and something you can audit offline.

## References

- [Balanov/verdict — GitHub](https://github.com/Balanov/verdict)
- [Verdict README](https://github.com/Balanov/verdict/blob/main/README.md)
- [Verdict — Hugging Face model card](https://huggingface.co/BalanovAN/verdict)
- [bench/results.json (raw benchmark data)](https://github.com/Balanov/verdict/blob/main/bench/results.json)
- [LICENSE (Apache-2.0, code and weights)](https://github.com/Balanov/verdict/blob/main/LICENSE)
- [data/LICENSE (CC0-1.0, synthetic training data)](https://github.com/Balanov/verdict/blob/main/data/LICENSE)
- [Verdict research page and browser demo](https://balanov.pro/research/verdict/)
