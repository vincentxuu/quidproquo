---
title: "Making a Vision Model See Better Without Retraining: OpenVLHarness Tools, Per-Question Memory, and Deployment Cost"
date: 2026-10-23
type: deep-dive
category: ai
tags: [harness-engineering, ai-agent, multimodal, open-source]
lang: en
tldr: "OpenVLHarness is an open-source visual agent harness from UCLA and Apple researchers: it keeps model weights untouched, gives a multimodal model nine tools plus per-question memory, and lifts the 22-benchmark average by 9.7 to 12.6 points. You still have to supply the model endpoints, GPU perception services, and a paid search API."
description: "A walkthrough of the OpenVLHarness paper and official repo: the nine vision tools, how per-question multimodal memory works, how to read the 22-benchmark results and costs, and the services, data egress, and code-execution risks to plan for."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-23-openvlharness-visual-agent-memory)

Multimodal models tend to fail on images in three ways: they miscount in crowded scenes, they miss small text in a corner, and they cannot name an object that needs outside knowledge to identify. [OpenVLHarness](https://arxiv.org/abs/2610.26860) (arXiv:2610.26860) attacks all three the same way. It leaves the model weights alone and wraps the model in tools, so it can crop, locate, search, and compute before it answers.

The paper comes from researchers at UCLA and Apple, was posted to arXiv on 19 October 2026, and the [code](https://github.com/uclanlp/OpenVLHarness) is released under the MIT license. The authors also host a [live demo](https://openvlharness.github.io/) that connects to your own model. It is a research framework, not an Apple product announcement.

This post answers three questions: which tools the model gets, what "multimodal memory" actually stores, and whether the results and deployment costs together justify a trial on your own image tasks.

## Nine tools: what the model can call

At each step the model decides which tool to call; it does not run all of them on every question. The default nine capabilities are below, and each backend can be swapped.

| Capability | What it does | Default backend |
|---|---|---|
| Visual grounding | Find objects from text; return boxes, masks, and an annotated image | [SAM 3](https://github.com/facebookresearch/sam3) |
| OCR | Read text in the image | [PaddleOCR-VL](https://github.com/PaddlePaddle/PaddleOCR) |
| Depth estimation | Per-pixel depth, with the numeric array kept | [Depth Anything 3](https://github.com/ByteDance-Seed/Depth-Anything-3) |
| Camera trajectory | Estimate camera poses across ordered images | Depth Anything 3 |
| Zoom-in | Crop a region for a closer look | Built-in image processing |
| Text search | Web, image, and news search with summaries | [Serper](https://serper.dev/) + [Qwen3-VL](https://github.com/QwenLM/Qwen3-VL) |
| Image search | Reverse image search | Serper Lens + Qwen3-VL |
| Webpage visit | Extract evidence relevant to a goal from a page | Serper + Qwen3-VL |
| Python coding agent | Write code over stored tool results | The main model + local Python |

Two design details matter. First, each tool sits behind a task-level interface, so "grounding" can swap in Grounding DINO and "OCR" can swap in DeepSeek-OCR without changing how the model calls them. Second, tool output is rendered into observations the model can read: a mask does not dump a long RLE string into the conversation but comes back as a numbered overlay, a short description, and normalized boxes; depth estimation returns a colorized map while the raw array is kept aside. In the paper's framing, the model sees evidence and the raw numbers are saved for later computation.

## Memory stores handles, not summaries

When a question starts, the framework creates a registry, and everything a tool produces is registered in one of three categories:

- **Images**: input images, tool-generated images, and retrieved images, with handles such as `input_image_3` and `tool_generated_image_6`. Duplicate images share an entry.
- **Structured data**: boxes, scores, masks, depth arrays, camera parameters, and OCR results, each with a description of its fields and shapes.
- **Web references**: retrieved URLs with handles such as `webpage_url_1`, so the model does not have to retype a URL to open the page later.

After every tool turn, an Environment Update tells the model which handles now exist. Later calls just name a handle, and the framework swaps in the real content.

Here is the paper's example: "how far is each cabinet from the camera?"

1. The model calls visual grounding for "cabinet" and gets five objects. The overlay goes into the image category; boxes and masks go into structured data.
2. The model calls depth estimation. The colorized map is shown to the model and the raw array is stored.
3. The model hands "compute the average depth inside each detected region" to the Python coding agent. That agent gets descriptions of the stored data in a fresh context, writes a program, and runs it with the real masks and depth array as variables. The result comes back as text.

No large array is copied into any request, and later steps do not have to guess positions from earlier text descriptions.

```diagram
title: How evidence flows within one question
desc: The orchestrator calls tools in the capability layer, results are stored in per-question memory, the Python coding agent reads data from memory, and memory reports the available handles back to the orchestrator.
caption: Simplified: every new question starts with empty memory.
---
<svg viewBox="0 0 640 376">
  <path class="dg-line" d="M168 164H300Q308 164 308 156V84Q308 76 316 76H450" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M168 212H300Q308 212 308 220V292Q308 300 316 300H450" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M536 112V150" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M536 264V226" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M450 188H172" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="20" y="144" width="148" height="88" rx="6"/>
  <text class="dg-label" x="94" y="180" text-anchor="middle" dominant-baseline="central">Orchestrator</text>
  <text class="dg-sub" x="94" y="202" text-anchor="middle" dominant-baseline="central">picks tools</text>

  <rect class="dg-box" x="452" y="40" width="168" height="72" rx="6"/>
  <text class="dg-label" x="536" y="66" text-anchor="middle" dominant-baseline="central">Capability layer</text>
  <text class="dg-sub" x="536" y="88" text-anchor="middle" dominant-baseline="central">perception, search</text>

  <rect class="dg-box dg-box--store" x="452" y="152" width="168" height="72" rx="6"/>
  <text class="dg-label" x="536" y="178" text-anchor="middle" dominant-baseline="central">Memory</text>
  <text class="dg-sub" x="536" y="200" text-anchor="middle" dominant-baseline="central">per-question store</text>

  <rect class="dg-box" x="452" y="264" width="168" height="72" rx="6"/>
  <text class="dg-label" x="536" y="290" text-anchor="middle" dominant-baseline="central">Coding agent</text>
  <text class="dg-sub" x="536" y="312" text-anchor="middle" dominant-baseline="central">Python over stored data</text>

  <text class="dg-edge" x="384" y="64" text-anchor="middle" dominant-baseline="central">call tool</text>
  <text class="dg-edge" x="384" y="288" text-anchor="middle" dominant-baseline="central">what to compute</text>
  <text class="dg-edge" x="548" y="131" text-anchor="start" dominant-baseline="central">store handles</text>
  <text class="dg-edge" x="548" y="245" text-anchor="start" dominant-baseline="central">read data</text>
  <text class="dg-edge" x="240" y="176" text-anchor="middle" dominant-baseline="central">available handles</text>
</svg>
```

Memory lives for one question only. The framework states that each new question starts with empty memory, so it keeps evidence connected within a question; it is not a way to remember a user or a conversation history. For cross-conversation memory, see [Agent memory systems](/posts/ai/2026-03-19-agent-memory-systems).

## How to read the results

The 22 benchmarks fall into four groups: counting and grounding, visual search and deep research, general VQA and hallucination, and spatial understanding. The results a reader can act on:

**Adding the framework to the same model raises the average every time.** For the seven main models listed in the README, the average gain is between 9.7 and 12.6 points. Qwen3-VL-8B, for example, goes from 34.2 to 45.4, and GPT-6 Astra improves on all 22 benchmarks. The paper tests eight models in total; the eighth, Qwen2.5-VL-7B, is used only for the comparison with fine-tuned methods.

**A general coding agent does not automatically help.** With GPT-6 Luna, no tools scores 45.8, Codex 43.8, and OpenVLHarness 56.5, while Visual Sketchpad is about level with no tools. Codex lands below the no-tool baseline; the paper's conclusion is that a general coding agent does not automatically improve multimodal reasoning, and tool outputs need to be designed for vision tasks.

**No fine-tuning can still beat fine-tuning.** Qwen2.5-VL-7B with its original weights and this framework scores 33.5, while the best of three methods that fine-tune the model reaches 28.0. That configuration is not in the public release.

**More thinking does not replace the tools.** With the same GPT-6 Luna, raising reasoning effort to the highest setting lifts the no-tool version only to 48.0. OpenVLHarness reaches 56.5 at medium effort while spending at most 37% of the model tokens the baselines use at their highest effort. That cost counts model tokens only, not search APIs or GPU services on the tool side.

**What each part contributes.** The paper adds components one at a time on Qwen3-VL-8B. The table is its overall column. Its basis differs from the 22-benchmark average above, so do not compare the baselines across the two; look only at what each layer adds:

| Configuration | Overall |
|---|---|
| No tools | 37.1 |
| Raw tool access | 40.8 |
| + Capability layer (interfaces and evidence rendering) | 44.2 |
| + Textual memory | 44.9 |
| + Multimodal memory (image handles) | 47.1 |

Handing the model raw tools helps only a little. Rendering tool output into readable observations adds more. The last step, letting earlier images be referenced again, gains the most in visual search. Textual memory, which only describes tool-generated images and has no reusable image handles, adds almost nothing.

## Limits: how it fails

The paper had Kimi K3 critique nearly ten thousand failed Qwen3-VL-8B trajectories and checked a sample against human labels. The results below are for the 8B model and differ by domain:

- **Counting and grounding**: in crowded scenes with more than 25 objects, grounding misses or merges instances, and incorrect tool output accounts for 75% of failures in this domain. For dense counting, spot-check the boxes and masks instead of trusting the final number.
- **Visual search**: nearly half of failures (49%) are cases where the model should have called a tool and did not. The fix may be clearer prompts or a different tool composition.
- **Easy questions**: on general VQA and spatial understanding at the lowest reasoning effort, OpenVLHarness scores slightly below the no-tool model; it leads across the board only from medium effort up.

The paper also tried two ways to adapt the harness to your own data. On datasets where fixes are mostly textual, editing system prompts and tool descriptions (harness search) gains about 4 points, while writing new tools barely helps. On datasets that lack a dedicated computation, such as SparBench, which needs metric 3D relations, a new tool gains about 8 points and editing text slightly hurts. Which to pick depends on whether your failures are missed tool calls or a missing specialized computation.

Two more notes on reliability: Qwen3-VL results are averages of three runs, while GPT and Kimi were run once because of API cost; and search and deep-research scoring uses GPT-4o as the judge.

## Deployment: what to prepare and where data goes

Running all nine tools means you supply:

- **Models**: beyond the main model, search summarization and webpage extraction default to a separate Qwen3-VL-8B. Even if the main model is a hosted GPT or Kimi, you still need this auxiliary model once search is enabled.
- **Perception services**: SAM 3, PaddleOCR-VL, and Depth Anything 3 each run as a separate GPU service behind a router.
- **Search**: the three search tools use Serper, a paid Google search API with a free starter quota.

Data leaves the machine at several points, so trace each tool instead of looking only at where the main model runs:

- The main model endpoint receives the question, images, and tool evidence; the auxiliary model receives search results, page text, and the images being searched; Serper receives queries and the URLs of visited pages.
- Reverse image search needs Serper to fetch the image. The image is uploaded to your S3 or GCS bucket and handed over as a signed URL valid for one hour. The objects are not deleted automatically, so add a lifecycle rule.

The official [security notes](https://github.com/uclanlp/OpenVLHarness/blob/main/SECURITY.md) are direct about three execution risks:

- Model-written Python runs as your user in a subprocess on the host, with network and filesystem access; the timeout is not a sandbox.
- The router and GPU workers are unauthenticated and bind to `127.0.0.1` by default. Anyone who can reach them can use your GPUs, model endpoints, and Serper key.
- The agent executes Python returned from whatever `TOOL_SERVER_URL` points at, so point it only at a router you run.

## How to start

1. **Collect a batch of images your model keeps getting wrong, with correct answers.** Compare on your own questions; the 22-benchmark average does not describe your task.
2. **Start from the smallest setup.** The official `examples/local_tools.yaml` enables only zoom and the Python coding agent, with the main model on a hosted GPT endpoint, so you need no GPU workstation, Serper, or cloud storage. After setting `MODEL_BASE_URL`, `MODEL_API_KEY`, and `TOOL_SERVER_URL`:

   ```bash
   python -m openvlharness.services.server --config examples/local_tools.yaml
   ```

   ```python
   from openvlharness.bootstrap import build_agent

   agent = build_agent("examples/local_tools.yaml")
   result = agent.generate([
       {"type": "image", "value": "/path/to/image.jpg"},
       {"type": "text", "value": "How many bottles are visible?"},
   ])
   print(result["prediction"])
   trajectory = result["extra_records"]["trajectory"]
   ```

3. **Read the trajectory for every question.** It records each turn's tool calls and evidence. Check whether the boxes are right first, then whether the computation is right; the first wrong step is easy to find.
4. **Add capabilities only when you need them.** Start GPU services when you need grounding, OCR, or depth; enable search last. If images cannot leave your environment, remove `image_search` from `capabilities.tools`.
5. **Run in isolation.** Use a container or VM, keep important data off it, and do not expose the router to a public network. Before going live, check `degradations` at the router's `/backend-status`: search summaries that timed out, image URLs that could not be fetched, and exhausted Serper credits all accumulate there.

## Bottom line

The trade-off is clear: more services and more model calls per question, in exchange for an evidence chain you can inspect step by step. It suits teams that already ship an image product and know their errors are "can't see it, can't count it, can't recognize it". It does not suit someone looking for a ready-made app, or a task that only describes a simple picture. If images cannot leave your environment and you cannot self-host, start with just zoom and computation and see whether that helps; that makes it easier to tell which change worked than connecting all nine tools at once.

## References

- [OpenVLHarness: Real World Visual Agentic Tool-Use with Multimodal Memory](https://arxiv.org/abs/2610.26860) (arXiv:2610.26860, abstract page; full text in [HTML](https://arxiv.org/html/2610.26860))
- [OpenVLHarness project page](https://openvlharness.github.io/): authors, step-by-step trajectories, per-benchmark results
- [uclanlp/OpenVLHarness](https://github.com/uclanlp/OpenVLHarness): code, README, install and configuration examples
- [OpenVLHarness SECURITY.md](https://github.com/uclanlp/OpenVLHarness/blob/main/SECURITY.md): where things run and what data leaves your machine
- [OpenVLHarness 視覺代理框架：不重訓模型，工具與多模態記憶能改善哪些看圖工作？](https://www.aiposthub.com/openvlharness-visual-agent-multimodal-memory-tools) (AI Post Hub, in Chinese; secondary summary tracing back to the sources above)
- [Agent memory systems](/posts/ai/2026-03-19-agent-memory-systems) (this site: approaches to cross-conversation memory)
