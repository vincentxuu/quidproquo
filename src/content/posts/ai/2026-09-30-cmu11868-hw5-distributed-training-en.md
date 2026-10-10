---
title: "CMU 11-868 HW5: Writing Data Parallelism and Pipeline Parallelism Yourself on Two GPUs"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, homework, distributed-training, pytorch, gpu]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 14
tldr: "CMU 11-868's fifth assignment switches to PyTorch and Hugging Face GPT-2. Using only torch.distributed and torch.multiprocessing, you write data parallelism (partition the data, set up a process group, average gradients; 50 points), then a GPipe-style pipeline (split the model, generate a clock schedule, run micro-batches on worker threads; 50 points). Both parts need benchmarks and plots on at least two GPUs: data parallelism must reach at least 1.5x speedup on 2 GPUs, and the pipeline must beat plain model parallelism. The Spring 2026 deadline was 3/25."
description: "A guide to CMU 11-868 LLM Systems (Spring 2026) Assignment 5, Distributed Training and Parallelism: the llmsys_hw5 starter code and its rules, the three parts of Problem 1 (data parallel) and Problem 2 (pipeline parallel), benchmarks and grading thresholds, the PSC and two-GPU hardware requirement, where the handout and starter code disagree, and which ideas from L14–L16 it exercises. No solutions."
draft: false
glossary:
  - term: "process group"
    definition: "A set of processes in torch.distributed that perform collectives together. Each process has a rank; the group size is the world size."
    context: "HW5 Problem 1.2 has you create one with init_process_group, using MASTER_PORT 11868."
  - term: "micro-batch"
    definition: "A smaller slice of a mini-batch in pipeline parallelism, so different stages can work on different slices at once and sit idle less."
    context: "The Pipe module in HW5 Problem 2.2 splits the input into micro-batches and computes them on a clock schedule."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-hw5-distributed-training)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> **This guide follows the Spring 2026 edition of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/).** It is part 14 of [Reading CMU 11-868 LLM Systems](/en/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en). The handout and repo are described as seen on 2026-09-30. The homework site is shared across semesters and may be changed for Fall 2026.

This assignment puts parts 11 through 13 into practice: [data parallelism](/en/posts/ai/2026-09-30-cmu11868-data-parallel-training-en) (L14–L15) and [pipeline parallelism](/en/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en) (first half of L16). [ZeRO from the previous post](/en/posts/ai/2026-09-30-cmu11868-zero-memory-optimization-en) isn't part of it; you run ZeRO through DeepSpeed in HW6.

## Course video sources

The official Spring 2026 syllabus has been checked: it publicly lists slides, readings and homework, but no recording link for the corresponding lectures. This article therefore guides readers through slides, papers or assignments and has no corresponding lecture player. This observation concerns the public official page and does not establish whether internal recordings exist.

Official sources:

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

Checked on 2026-10-10.

## At a glance

| Item | Details |
|---|---|
| Handout | [Assignment 5: Distributed Training and Parallelism](https://llmsystem.github.io/llmsystemhomework/assignment_5/) |
| Starter code | The page links `llmsys_f25_hw5`, which 301-redirects to [llmsystem/llmsys_hw5](https://github.com/llmsystem/llmsys_hw5) |
| Due | 3/25 in Spring 2026 (Week 11 on the [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)); the Syllabus doesn't list a release date |
| Points | Problem 1 Data Parallel 50, Problem 2 Pipeline Parallel 50 |
| Hardware | At least 2 GPUs; the handout strongly recommends PSC |
| Environment | A conda env with Python 3.9; `requirements.txt` pins torch 2.2.0, transformers 4.37.2, datasets 3.6.0 |
| Lectures | L14–L15 (data parallelism), L16 (pipelines); Recitation 6 on 3/20 covers Distributed Training |

The biggest change from the first four assignments: **this one doesn't use MiniTorch.** The starter `project/run_data_parallel.py` loads Hugging Face's pretrained `GPT2LMHeadModel` on `bbaaaa/iwslt14-de-en-preprocess`, takes only the first 5,000 training examples, and runs 10 epochs by default. The focus shifts from building a framework to building the distributed layer yourself.

## Rules: two packages for communication

Problem 1 allows only `torch.distributed` and `torch.multiprocessing.Process` for GPU communication, and forbids adding new `import`s. Problem 2 allows only packages the starter code already imports. Every region you implement is marked with `BEGIN_HW5_*` and `END_HW5_*` comments, and all edits must stay inside them. The handout says staff will inspect the code by hand to check the package restrictions.

## Problem 1: data parallelism (50 points)

**1.1 Partition the data.** Implement three things in `data_parallel/dataset.py`:

- `Partition`: a dataset class that returns items by a list of indices
- `DataPartitioner`: shuffles the indices and splits them by fractions (for four GPUs, `[0.25, 0.25, 0.25, 0.25]`); `use(rank)` returns one partition
- `partition_dataset`: computes the per-GPU batch size (a total batch of 128 on four GPUs gives 32 each), takes this rank's partition, and wraps it in a `DataLoader`

Test `a5_1_1` only checks that partitions don't overlap.

**1.2 Set up the process group and average gradients.** In `project/run_data_parallel.py`, implement `setup`: set `MASTER_ADDR` to localhost and `MASTER_PORT` to 11868, then call `init_process_group`. The main block must create, start, and cleanly shut down `world_size` processes. Then implement `average_gradients`, which walks the model's parameters and aggregates gradients with `torch.distributed`, and call it after backward in `train` in `project/utils.py`.

To test, run one batch with `world_size` 2 so each rank saves its gradients as `model{rank}_gradients.pth`, then run `a5_1_2` to check that both GPUs hold the same gradients.

**1.3 Benchmark.** Compare training time and tokens per second on one GPU (batch 64) and two GPUs (total batch 128). The handout specifies the math: average training time across GPUs, and sum tokens per second across GPUs for throughput. It suggests dropping the first epoch or at least doing one warmup run. Plot each metric separately and save the figures in `submit_figures`. Full marks require **at least 1.5x speedup on 2 GPUs** in both training time and throughput.

## Problem 2: pipeline parallelism (50 points)

This part implements the GPipe-style schedule from L16: split the model by layer across GPUs, split the input into micro-batches, and let stages work on different micro-batches at the same time.

**2.1 Split the model and build the schedule.** In `pipeline/partition.py`, implement `_split_module`, which cuts an `nn.Sequential` into layer-wise partitions, one per GPU. In `pipeline/pipe.py`, implement `_clock_cycles(num_batches, num_partitions)`, which produces, for each time step, which stage processes which micro-batch. Test `a5_2_1`.

**2.2 The Pipe module.** Read `worker.py` first, then implement `Pipe.forward` and `Pipe.compute`. `Pipe` is a generic wrapper that turns any `nn.Sequential` into a pipelined module. `create_workers` starts one worker thread per GPU; each takes tasks from `in_queue` and puts results in `out_queue`. Your job is to wrap computations as `Task` objects, put them on the right device's queue, and collect the results. The handout stresses that `forward` must put its output on **the last device**; leaving it on the device of the input `x` breaks pipeline training. Test `a5_2_2`.

**2.3 Wire it into GPT-2.** In `pipeline/model_parallel.py`, implement `_prepare_pipeline_parallel`. `GPT2ModelCustom.parallelize` has already placed GPT-2's blocks on different GPUs; you extract the transformer blocks in `self.h` and package them as an `nn.Sequential` for `Pipe`. The handout warns that `GPT2Block` returns a tuple, not a tensor, and you only need the hidden states. If you add a helper module with no parameters, wrap it in `WithDevice`, or it will be treated as living on the CPU.

Finally, train on two GPUs with `--model_parallel_mode='model_parallel'` and `'pipeline_parallel'` and plot the comparison. Full marks require **faster training time and higher throughput with the pipeline** than with plain model parallelism.

## Submission and grading

The handout provides `scripts/create_submission_zip.sh` for packaging and `scripts/run_benchmarks.py` for performance logs, `submit_figures/performance_summary.json`, and plots. Staff compile and run the code, check the figures, and manually check the package restrictions.

## Where the handout and starter code disagree

Comparing the handout with the `llmsys_hw5` main branch on 2026-09-30 turned up three mismatches:

1. **`partition_dataset` signature**: the handout shows `partition_dataset(dataset, batch_size=128, collate_fn=None)`; the starter code has `partition_dataset(rank, world_size, dataset, batch_size=128, collate_fn=None)`. Go with the starter code.
2. **Submission name**: the Submission section says to "submit the whole `llmsys_s25_hw5` as a zip on canvas," still using the Spring 2025 repo name.
3. **Speedup threshold**: Problem 1.3 asks for 1.5x on both training time and throughput, but the grader-mode example uses `--dp-time-threshold 1.2 --dp-throughput-threshold 1.5` (and 1.0 for both pipeline metrics). The official pages don't say which values grading actually uses.

Also, the last commit on main is dated 2026-04-30, so it still reflects spring. The repo also has a `merged-hw5-hw6` branch. If Fall 2026 changes the assignment, the changes may land there or on main. To match the spring version, checking out a commit from before 2026-03-25 is the safest bet.

## Where outside readers get stuck

- **Two GPUs**: this is the first assignment in the series that strictly needs more than one GPU. The [Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) page describes PSC as a resource provided to enrolled students, so outside readers need to rent a two-GPU cloud machine. Logistics also warns that PSC uses job-based scheduling with no guarantee of when a job will start
- **1.5x doesn't come for free**: syncing gradients across two GPUs has a cost (the subject of L14–L15). How much speedup you get from batch 64 on one GPU versus 128 on two depends on your interconnect and your implementation
- **No Canvas, no manual grading**: the tests only check correctness (no overlapping data, matching gradients, a correct schedule). You have to check performance and the package rules yourself

## Try it yourself: three exercises without enrolling

1. **Get data parallelism working on CPU first.** With the `gloo` backend and two processes, `init_process_group` runs on a laptop, so you can verify `DataPartitioner` and `average_gradients` before measuring speedup on GPUs.
2. **Write a clock schedule by hand.** On paper, draw the GPipe forward schedule for 3 stages and 4 micro-batches, listing the (micro-batch, stage) pairs at each time step, then compare with the `_clock_cycles` tests.
3. **Measure the bubble.** Once the pipeline works, vary the split with `run_pipeline.py`'s `--n_chunk` (the number of micro-batches, default 4), record how throughput changes, and compare with L16's bubble formula O((K−1)/(M+K−1)).

## Further reading

- Previous in series: [L18 ZeRO: memory optimization for distributed training](/en/posts/ai/2026-09-30-cmu11868-zero-memory-optimization-en)
- Next in series: [L19–L20 Model quantization](/en/posts/ai/2026-09-30-cmu11868-model-quantization-en)
- Previous assignment: [HW4: fused CUDA kernels for Softmax and LayerNorm](/en/posts/ai/2026-09-30-cmu11868-hw4-transformer-cuda-acceleration-en); next assignment: [HW6: DeepSpeed ZeRO + LoRA training, SGLang inference](/en/posts/ai/2026-09-30-cmu11868-hw6-training-inference-systems-en)
- On this site: [CS336 parallelism mechanics](/en/posts/ai/2026-08-22-cs336-parallelism-mechanics-en), [CS336 parallelism strategies](/en/posts/ai/2026-08-22-cs336-parallelism-strategies-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Re-verified the live official course pages and public video sources; no public recording for this lecture was found, so the status stands.

## References

- Handout: [Assignment 5: Distributed Training and Parallelism](https://llmsystem.github.io/llmsystemhomework/assignment_5/) (checked 2026-09-30)
- Starter code: [llmsystem/llmsys_hw5](https://github.com/llmsystem/llmsys_hw5) (main branch, last commit 2026-04-30; `requirements.txt`, `project/run_data_parallel.py`, `project/run_pipeline.py`, `data_parallel/dataset.py`, `pipeline/pipe.py`)
- Course: [CMU 11-868 LLM Systems Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) (HW5 due date, Recitation 6), [Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) (PSC computing resources)
- Slides: [L16 Model Parallel Training](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-16-model-parallel-83b41612547620ee0e172caa1ee448ed.pdf) (GPipe and the bubble formula)
- Docs: [PyTorch torch.distributed](https://pytorch.org/docs/stable/distributed.html) (`init_process_group`, collectives)
