---
title: "Running MiniMind on RunPod: From Zero to a Chatting Model"
date: 2026-09-06
category: ai
type: deep-dive
tags: [minimind, runpod, llm, training, gpu, pytorch]
lang: en
series:
  name: "從零訓練一個 LLM"
  order: 10
tldr: "The hands-on installment of the series: rent an RTX 3090 on RunPod (Secure Cloud $0.5/hr, Community Cloud $0.22/hr), follow the MiniMind README through pretrain (~1.21h) + SFT (~1.10h), spend roughly $0.55–1.50 USD total, and chat with your own 64M model trained from scratch in the terminal."
description: "A complete walkthrough — signing up for RunPod, launching a 3090 pod, SSH access, downloading minimind_dataset, running train_pretrain.py and train_full_sft.py, then chatting via eval_llm.py — with a cost breakdown and honest 'not verified on real hardware' annotations."
draft: false
---

> [中文版](/posts/ai/2026-09-06-run-minimind-on-runpod)

The previous nine installments covered the "whether", "what", and "with what": the [MiniMind design deep-dive](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en) (order 1), [LitGPT's framework route](/en/posts/ai/2026-09-06-litgpt-from-scratch-framework-en) (order 9), and the [decision framework for training from scratch](/en/posts/ai/2026-09-06-when-to-train-llm-from-scratch-en) (order 6). This is the only hands-on piece in the series: no architecture talk — rent an RTX 3090 on [RunPod](https://www.runpod.io/) and run [MiniMind](https://github.com/jingyaogong/minimind) end to end: pretrain → SFT → chat with the result.

Set expectations first: **I have not verified this on a rented GPU.** Every command below comes from the MiniMind README and RunPod's official documentation (listed at the end), and the training durations quote the README's own single-3090 measurements. But console UI details, template versions, and download speeds all drift — treat the official docs as the source of truth before you click Deploy.

## Why RunPod, not AutoDL

The README's "3 yuan" cost table is priced against China's GPU rental market: a 3090 at about 1.3 RMB/hour, so 2.31 hours (pretrain_t2t_mini + sft_t2t_mini, one epoch each) costs about 3 RMB. The usual platform is [AutoDL](https://www.autodl.com/) — [our order 1 analysis](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en) notes it has the lowest rates and the smoothest ModelScope/Aliyun pip mirror experience — but signing up requires a Chinese phone number and payment method, which rules out most readers outside China.

RunPod has no such gate: email signup, credit card or crypto top-up. The cost is a higher hourly rate. Per RunPod's official [RTX 3090 page](https://www.runpod.io/gpu-models/rtx-3090) (updated 2026-08-27): Secure Cloud $0.5/hr, Community Cloud $0.22/hr. For roughly 2.5 hours, Secure Cloud runs about $1.25 and Community about $0.55 — against AutoDL's 3 RMB (~$0.42), you pay less than a dollar more for not needing a Chinese account.

## Step 0: Sign up and add an SSH key

RunPod signup takes an email; top up before deploying. Use SSH for access. The official guide ([Connect to a Pod with SSH](https://docs.runpod.io/pods/configuration/use-ssh)) recommends:

```bash
# Generate a key locally (skip if you have one)
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub
```

Paste the output (the full line starting with `ssh-ed25519`) into the **SSH Public Keys** field in your Runpod account settings. The docs flag two pitfalls: pasting the `SHA256:` fingerprint instead of the key fails, and multiple keys must be one per line.

## Step 1: Launch a 3090 pod

In the [Runpod console](https://console.runpod.io/pods) pick **Pods → Deploy**, GPU: RTX 3090 (24GB GDDR6X). The official page contrasts the two clouds: Secure Cloud costs more but offers enterprise-grade reliability and 24/7 support; Community Cloud is roughly half price, sourced from independent providers, with more regions. For practice, Community is fine — but machine quality varies and instances can be reclaimed. Fortunately the training scripts support resuming from checkpoints (below), so an interruption costs you little.

Choose the official **Runpod PyTorch** template: it ships PyTorch and CUDA, and the docs state that official templates like Runpod PyTorch have "full SSH access... already configured for you", so you don't install an SSH daemon yourself. Give it 30GB+ of disk (2.8GB of dataset plus the torch environment and checkpoints), then Deploy.

## Step 2: SSH in

Once the pod is running, copy the SSH command from the pod's **Connect** tab. Full SSH over a public IP looks like this (from the official docs):

```bash
ssh root@<POD_IP> -p <PORT> -i ~/.ssh/id_ed25519
```

The user is always `root`; the IP and port change per pod, so copying the command from the console is the safe route. Inside, work under `/workspace`, which persists across pod restarts — keep training artifacts there.

## Step 3: Clone and install

Step 0 of the README:

```bash
git clone --depth 1 https://github.com/jingyaogong/minimind
cd minimind && pip install -r requirements.txt
```

**Key difference: drop the `-i https://mirrors.aliyun.com/pypi/simple` that the README includes.** That's the Aliyun pip mirror — an accelerator inside China, but on RunPod's overseas nodes it can be slower or unreachable. The README targets Chinese readers; on international platforms, use default PyPI. This is the only place you need to *reverse-edit* an official command.

Then confirm the GPU is visible (the README suggests this too):

```bash
python -c "import torch; print(torch.cuda.is_available())"
```

Only proceed if it prints `True`. If not, the template's torch and driver versions likely mismatch — switching to another official PyTorch template is usually faster than hand-reinstalling torch.

## Step 4: Download the dataset

You need two files: `pretrain_t2t_mini.jsonl` (1.2GB) and `sft_t2t_mini.jsonl` (1.6GB), placed in `./dataset/`. The README notes you don't need to clone the whole repo of data — grab individual files. The dataset lives on [HuggingFace](https://huggingface.co/datasets/jingyaogong/minimind_dataset) (also mirrored on ModelScope; HF is faster from international nodes).

One heads-up: the dataset viewer on that page is currently broken — the HF worker throws a `DatasetGenerationError` because the jsonl files have inconsistent schemas (dpo.jsonl uses `chosen/rejected`, SFT files use `conversations`). So don't try `load_dataset()` on the whole repo; fetch the two files directly.

Option 1, the HuggingFace CLI for specific files (note: the old `huggingface-cli` entry point is deprecated and no longer works — recent versions only ship `hf`):

```bash
pip install -U huggingface_hub
hf download jingyaogong/minimind_dataset \
  pretrain_t2t_mini.jsonl sft_t2t_mini.jsonl \
  --repo-type dataset --local-dir ./dataset
```

Option 2, wget straight to the resolve URLs:

```bash
mkdir -p dataset
wget -P dataset https://huggingface.co/datasets/jingyaogong/minimind_dataset/resolve/main/pretrain_t2t_mini.jsonl
wget -P dataset https://huggingface.co/datasets/jingyaogong/minimind_dataset/resolve/main/sft_t2t_mini.jsonl
```

The two files total 2.8GB; RunPod nodes usually have decent bandwidth to HuggingFace, so expect a few minutes (this step not verified on real hardware). On licensing: the README states the data pipeline complies with Apache-2.0 and CC-BY-NC-2.0 — fine for running the tutorial yourself, but check the underlying licenses before any commercial use.

## Step 5: Pretraining

```bash
cd trainer && python train_pretrain.py
```

The terminal streams per-step loss. The README includes a loss curve for the 768-dim config: fast initial drop, then a flattening tail. One epoch of `pretrain_t2t_mini` on a single 3090 takes about **1.21 hours**, producing `out/pretrain_768.pth`. Curious what the model knows mid-run? Go back up a level and run `python eval_llm.py --weight pretrain` — the README's sample shows this stage can already answer "why is the sky blue", but it only continues text; it can't really converse yet.

## Step 6: SFT

```bash
cd trainer && python train_full_sft.py
```

Full-parameter fine-tuning, about **1.10 hours**, producing `out/full_sft_768.pth`. This teaches the model the multi-turn chat template (README: `user / assistant / system / tool` roles plus instruction following). The `sft_t2t_mini` data already mixes in Tool Call samples, so the resulting `full_sft` weights carry basic tool-calling format out of the box.

Both stages support resuming: after an interruption, add `--from_resume 1` and the scripts restore from `./checkpoints/` (model, optimizer state, and progress). On Community Cloud this is your insurance — if the machine is reclaimed, you don't start from zero.

## Step 7: Chat with your model

```bash
cd .. && python eval_llm.py --weight full_sft
```

This opens the README's emoji-marked interactive loop (`💬:` your input, `🧠:` the model). What should you expect? The README's own Zero samples show fluent Chinese with confabulated facts (recommending Hangzhou food, it invents "eel head" among real dishes) and gibberish English. **This is the expected outcome** — 2.31 hours and 2.8GB of data produce a 64M model that scores near chance (~25%) on C-Eval/C-MMLU. The value of this step is verifying firsthand that the model really grew out of random initialization on your GPU, not getting a usable product.

## Cost breakdown

| Item | Secure Cloud | Community Cloud |
|---|---|---|
| 3090 hourly rate (RunPod official page) | $0.5/hr | $0.22/hr |
| Pure training 2.31h (README measurement) | ≈ $1.16 | ≈ $0.51 |
| With setup + downloads, ~2.5–3h | ≈ $1.25–1.50 | ≈ $0.55–0.66 |
| Comparison: AutoDL, same workflow | ≈ 3 RMB (~$0.42) | — |

RunPod bills by usage, and **a running pod keeps charging**. After training and a quick chat, terminate the pod in the console. To keep the weights, `scp` the `.pth` files from `out/` (a 64M model is small) back to your machine, or put them on persistent storage. Storage and bandwidth pricing details are on [RunPod's pricing page](https://www.runpod.io/pricing).

## Limitations and likely pitfalls

Honest annotation once more: the steps above were **not verified on real hardware**; the README and RunPod's official docs are the source of truth. Foreseeable risks:

- **Version drift**: the author's environment is CUDA 12.2, Python 3.10.16. RunPod's PyTorch template versions change over time, and `requirements.txt` pins may conflict with the template's bundled torch — if so, trust the template's version and trim requirements rather than reinstalling CUDA.
- **Download speed**: HuggingFace can be slow from some regions; the CLI in option 1 supports resumable downloads, and ModelScope is a fallback mirror.
- **Community machines are flaky**: they can be reclaimed; `--from_resume 1` is the safety net. Pay for Secure Cloud if continuity matters.
- **The ceiling**: don't expect the Zero model to be useful. Its value is a complete pipeline where every line is readable — the "understand what you train" ethos that the [CS336](/en/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en) course keeps emphasizing.

## The takeaway

The whole path is: sign up → SSH key → launch pod → clone (minus the mirror flag) → fetch two jsonl files → two training commands → one chat command. The actual training code is two lines of `python train_*.py` — that's MiniMind's value as a teaching project: engineering friction is squeezed to nearly zero so your time goes into reading every line under `trainer/`. Returning to the bias note from the series intro — this collection still skews toward English- and Chinese-circle GitHub star projects — international rental platforms like RunPod are what make the reproduction path accessible to readers without Chinese accounts. If you're still deciding whether to spend the money, go back to [order 6's decision framework](/en/posts/ai/2026-09-06-when-to-train-llm-from-scratch-en); the previous installment, [LitGPT](/en/posts/ai/2026-09-06-litgpt-from-scratch-framework-en), handed you a training skeleton, and this one hands you the machine. For where to go next, the [series overview](/en/posts/ai/2026-09-06-train-llm-from-scratch-series-intro-en) maps the remaining stops.

## References

- [MiniMind GitHub README](https://github.com/jingyaogong/minimind)
- [MiniMind training dataset (HuggingFace Datasets)](https://huggingface.co/datasets/jingyaogong/minimind_dataset)
- [jingyaogong/minimind-3 (HuggingFace model page)](https://huggingface.co/jingyaogong/minimind-3)
- [RunPod: Rent NVIDIA RTX 3090 GPUs](https://www.runpod.io/gpu-models/rtx-3090)
- [RunPod docs: Connect to a Pod with SSH](https://docs.runpod.io/pods/configuration/use-ssh)
- [MiniMind: 用 3 塊錢從零訓練一個 LLM (series order 1, in Chinese)](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en)
- [LitGPT framework deep-dive (series order 9)](/en/posts/ai/2026-09-06-litgpt-from-scratch-framework-en)
- [When to train an LLM from scratch (series order 6)](/en/posts/ai/2026-09-06-when-to-train-llm-from-scratch-en)
