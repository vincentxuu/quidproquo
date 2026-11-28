---
title: "Transformer Explainer: Taking Apart a Real GPT-2 in Your Browser"
date: 2026-11-26
category: ai
type: guide
tags: [transformer, attention, gpt-2, visualization]
lang: en
tldr: "Transformer Explainer is an interactive teaching tool from Georgia Tech. It runs a real GPT-2 (small) in your browser: type a sentence and watch it go from tokenization and embeddings through 12 layers of attention and MLP to the probability of the next token. You can also drag the temperature slider and switch between top-k and top-p to see how the distribution changes. It suits anyone who wants to understand how an LLM continues text without first reading the paper or the code. It only shows the GPT-2 architecture, so modern changes like RoPE and GQA have to be learned separately."
description: "An introduction to Transformer Explainer, the interactive Transformer visualization from Polo Club published at CHI 2026: what it shows you, who it is for, how to walk one sentence through a full prediction, and the limits of a tool built on GPT-2."
draft: false
glossary:
  - term: "Logit"
    def: "The raw score the model's last layer assigns to each token in the vocabulary; softmax turns these scores into probabilities"
  - term: "Temperature"
    def: "The number the logits are divided by before sampling; below 1 sharpens the distribution and makes output more stable, above 1 flattens it and makes output more random"
---

> :globe: [中文版](/posts/ai/2026-11-26-transformer-explainer)

Most Transformer tutorials stall at the same point. The diagram shows Q, K, V, softmax and 12 blocks, but you cannot tell what happens to *the sentence you just typed*. [Transformer Explainer](https://poloclub.github.io/transformer-explainer/) fills that gap: it runs a real GPT-2 in your browser, and when you change a word, the numbers in every layer are recomputed on screen.

This post covers what it lets you see, who it is for, how to walk one sentence through a full prediction, and what is still missing once you are done.

## What it is

Transformer Explainer is an open-source teaching tool from Georgia Tech's [Polo Club](https://poloclub.github.io/) (MIT license, [GitHub](https://github.com/poloclub/transformer-explainer)). The same lab built [CNN Explainer](https://poloclub.github.io/cnn-explainer/) and [GAN Lab](https://poloclub.github.io/ganlab/) with the same approach: a real model, real data, and controls you can change in a web page.

Three things set it apart from an illustrated article:

- **The model is live.** The page loads GPT-2 (small), 124 million parameters, derived from Karpathy's [nanoGPT](https://github.com/karpathy/nanoGPT) and converted to [ONNX Runtime](https://onnxruntime.ai/) so it runs inference in the browser. The model downloads on your first visit and is then cached in the browser's IndexedDB. Nothing to install, no GPU needed.
- **You can move between levels of detail.** The main view is a data-flow overview: input enters on the left, passes through the embedding and the repeated Transformer blocks, and leaves on the right as probabilities. Click any component to expand its matrix operations and formulas.
- **The output is real sampling.** Press Generate and the predicted token is appended to your sentence. Keep pressing to see how early sampling choices shape later predictions.

```youtube
url: https://www.youtube.com/watch?v=TFUc41G2ikY
title: Transformer Explainer official demo video
```

The team wrote it up as a paper [published at CHI 2026](https://dl.acm.org/doi/10.1145/3772318.3791725) ([arXiv version](https://arxiv.org/abs/2408.04619)). An earlier two-page version won the Best Poster Award at IEEE VIS 2024, and by the time the paper was written the tool had more than 490,000 users.

## Who it is for and what you need to know first

It works best for three groups:

- **People who know ChatGPT "predicts the next word" but cannot say how.** No linear algebra needed; the overview alone gives you the shape of it.
- **Engineers who tune temperature and top-p every day but have never seen what those settings change.** Dragging a slider and watching the distribution shift is faster than reading API docs.
- **Teachers.** Open the page in class; students do not need to set anything up.

Prerequisites: knowing what a vector and a matrix multiplication are will help with the expanded details, but the overview makes sense without them. For an intuition-first introduction to attention, see [Transformers and Attention: How Models Decide Which Words to Look At](/posts/ai/2026-08-26-understanding-ai-models-transformer-en) on this site.

## What you see when you open it

Left to right, the screen is the complete path one token takes to be predicted. The diagram below plays step by step when you scroll to it; use the buttons to stop on any step.

```flow-diagram
{
  "title": "One prediction in Transformer Explainer",
  "lang": "en",
  "width": 440,
  "height": 680,
  "nodes": [
    {"id": "input", "label": "Your sentence", "x": 150, "y": 50, "shape": "actor"},
    {"id": "embed", "label": "Tokenize + Embedding\n768 dims per token", "x": 150, "y": 170, "w": 220, "h": 60},
    {"id": "block", "label": "Transformer Block × 12\nattention → MLP", "x": 150, "y": 290, "w": 220, "h": 60, "tone": "accent"},
    {"id": "logit", "label": "Linear + softmax\n50,257 probabilities", "x": 150, "y": 410, "w": 220, "h": 60},
    {"id": "sample", "label": "temperature\ntop-k / top-p sampling", "x": 150, "y": 530, "w": 220, "h": 60},
    {"id": "next", "label": "Next token", "x": 150, "y": 635, "w": 160}
  ],
  "edges": [
    {"from": "input", "to": "embed", "step": 1, "label": "Split into tokens", "labelAt": [162, 112]},
    {"from": "embed", "to": "block", "step": 2, "label": "Add position", "labelAt": [162, 232]},
    {"from": "block", "to": "logit", "step": 3, "label": "Layer by layer", "labelAt": [162, 352]},
    {"from": "logit", "to": "sample", "step": 4, "label": "Reshape", "labelAt": [162, 472]},
    {"from": "sample", "to": "next", "step": 5, "label": "Draw one", "labelAt": [162, 584]},
    {"from": "next", "to": "input", "step": 6, "label": "Append", "via": [[400, 635], [400, 50]], "labelAt": [388, 340], "labelSide": "left"}
  ],
  "steps": [
    "The input sentence is split into tokens; GPT-2's vocabulary has 50,257 tokens",
    "Each token is looked up as a 768-dimensional vector, and a position vector is added",
    "The vectors pass through 12 Transformer blocks in order; each block runs multi-head attention, then an MLP",
    "The final linear layer gives every token a logit, and softmax turns logits into probabilities",
    "Temperature, top-k and top-p reshape the distribution, and one token is drawn",
    "Press Generate and the drawn token is appended to the sentence for the next round"
  ]
}
```

Each of the three sections can be expanded:

| Section | What you see when expanded | Numbers worth noticing |
|---|---|---|
| **Embedding** | Tokenization, each token's vector, how the position vector is added | A 50,257 × 768 table, about 39 million parameters on its own |
| **Transformer Block** | How Q/K/V are computed, the split into 12 heads, the attention matrix with future tokens masked out, the MLP expanding then shrinking | The MLP expands from 768 to 3,072, then back to 768 |
| **Output Probabilities** | Each candidate token's logit and probability, how temperature and top-k/top-p rewrite the distribution | Probabilities sum to 1; sampling only happens among the candidates left |

Attention is where to spend your time. The tool breaks masked self-attention into four steps: dot products for scores, scaling and masking the upper triangle, softmax, and multiplying by V. Hover over a token to highlight which earlier tokens it attends to. Seeing the mask once makes the point stick: when predicting the next word, the model can only look left.

The site's analogy for Q/K/V is easy to remember: **the Query is what you type into a search box, the Key is the title of each search result, and the Value is the content you get when you click through.**

## Try it: what temperature's "creativity" really is

The default example sentence is `Data visualization empowers users to`. In the paper's interface screenshot, GPT-2 gives `create` a probability of 20.87%, the highest of any candidate.

The defaults are temperature 0.8 and top-k = 5, so only the top five candidates can be drawn. Then do three things, each under a minute:

1. **Drag temperature down to 0.2.** The top candidate takes almost all the probability. Press Generate a few times and the continuation barely changes.
2. **Drag it up to 2.0.** The bars for the top five become nearly equal, and each press of Generate starts producing a different word.
3. **Raise k to 50, or switch to top-p.** With more candidates, low-ranked tokens get drawn too, and the sentence drifts further and further.

After that you will see that temperature is not a "creativity switch." It does one thing: divides the logits by a number before sampling. Below 1, high scores get relatively higher; above 1, the gaps shrink. The `temperature` and `top_p` settings in an API reshape exactly this distribution.

## Does this approach work?

The paper ran a 90-person controlled study. Participants were randomly assigned to learn the same material from Transformer Explainer, Jay Alammar's blog post [The Illustrated GPT-2](https://jalammar.github.io/illustrated-gpt2/), or an educational video, with a 45-minute limit, then took the same quiz.

| Group | Average quiz accuracy |
|---|---|
| Transformer Explainer | 73.3% |
| Blog post | 59.5% |
| Educational video | 61.9% |

The interactive group scored significantly higher on the quiz and rated their experience significantly higher than both other groups; on self-rated learning, it was significantly ahead of the blog group but about the same as the video group. The paper names three limits of its own: the quiz came right after the session, so long-term retention was not measured; it tested concepts, not the math; and participants were mostly beginners, while teachers and engineers might use the tool differently. So the conclusion stops at "for beginners, interaction is easier to follow than reading a post or watching a video." It does not extend to "use this and you will have learned Transformers."

## Limits: it teaches the GPT-2-era architecture

GPT-2 is a 2019 model. Its skeleton matches today's LLMs, which makes it a good starting point, but several pieces have since been replaced in mainstream models:

- **Positional encoding**: GPT-2 uses learned position vectors; most current models use RoPE.
- **Attention**: in GPT-2 every head has its own K and V; GQA, where several heads share K and V to save memory, is now common.
- **Normalization and MLP**: GPT-2 uses LayerNorm and GELU; many newer models use RMSNorm and SwiGLU, and some replace the MLP with MoE.
- **Scale**: long inputs crowd the screen, and the paper notes that running larger models in the browser is still technically hard.

After Transformer Explainer, read [Modern Transformers: What Position Rotation and KV Sharing Change](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en) to cover these changes. The other gap is that it only shows a text model; the paper lists other modalities such as ViT and Whisper as future directions.

## How to start

- **Use it online**: open [poloclub.github.io/transformer-explainer](https://poloclub.github.io/transformer-explainer/). The first visit downloads the model, so give it a moment on a slow connection.
- **Suggested order**: look at the overview and press Generate a few times, then drag the temperature slider, and only then expand attention. Opening every component at the start is an easy way to get lost.
- **Run it locally**: you need Node.js 20 or later.

```bash
git clone https://github.com/poloclub/transformer-explainer.git
cd transformer-explainer
npm install
npm run dev
# open http://localhost:5173 in your browser
```

- **See it again from the code side**: the tool's model comes from nanoGPT. Continue with [Karpathy's nanochat, nanoGPT and llm.c](/posts/ai/2026-09-06-karpathy-nanochat-nanogpt-llm-c-en) to map each box on screen back to a few dozen lines of PyTorch.

## References

- [Transformer Explainer website](https://poloclub.github.io/transformer-explainer/): the interactive tool and a full written walkthrough of the architecture
- [poloclub/transformer-explainer](https://github.com/poloclub/transformer-explainer): source code, local setup, MIT license
- [Transformer Explainer: Learning LLM Transformers with Interactive Visual Explanation and Experimentation](https://arxiv.org/abs/2408.04619): the CHI 2026 paper, with design goals, implementation and the 90-person user study ([ACM version](https://dl.acm.org/doi/10.1145/3772318.3791725))
- [Official demo video](https://www.youtube.com/watch?v=TFUc41G2ikY)
- [The Illustrated GPT-2](https://jalammar.github.io/illustrated-gpt2/): the blog post used as a baseline in the user study
- [karpathy/nanoGPT](https://github.com/karpathy/nanoGPT): source of the GPT-2 model the tool uses
- [Transformers and Attention: How Models Decide Which Words to Look At](/posts/ai/2026-08-26-understanding-ai-models-transformer-en): this site's introduction to attention
- [Modern Transformers: What Position Rotation and KV Sharing Change | CMU 10-423 Lecture 4](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en): architecture changes since GPT-2
