---
title: "World Models and Alignment Theory: Action Interventions and Corrigibility Assumptions | CMU 10-423 Lecture 26"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 31
description: "Separate three world representations and evidence of action control, then examine consensus costs and corrigibility theorem conditions."
draft: false
---

> [繁體中文版](/posts/ai/2026-10-11-cmu10423-lecture-26-world-models-alignment)

**Video status: recordings require login or course authorization.** This guide uses the public slides for Lecture 26 of CMU 10-423 Spring 2026. Worked examples and variations are teaching additions.

Lecture 26 has two slide decks: interactive world models first, then the science of alignment. They share one testing habit: output that looks plausible does not show that a system behaves as intended when you change the conditions. A world model must show that a different action produces a different future; an alignment result must state the assumptions under which control requirements cannot be traded away for task reward.

## World Models: How Actions Change Predicted Futures

A convincing video may not let you choose where its character goes. A world model asks an additional question: from the same current state, what changes if we take a different action? This connects prediction to planning and control.

Prerequisites are [temporal modeling](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation-en) and [state updates](/posts/ai/2026-10-11-cmu10423-lecture-21-state-space-models-en). This part separates the world-model deck's three representations: 3D scenes, interactive video, and latent prediction.

### State, observation, and action

An idealized transition is `p(s_next | s, a)`. Camera images are observations, not necessarily complete states: they may hide objects, velocity, or friction. Models often need history or a latent/belief representation of uncertainty. One image does not always determine the future.

Different actions from the same history should produce distinguishable, semantically appropriate futures. Stochastic environments may require distributions rather than point predictions. The key is a reliable intervention effect over multiple steps.

### Three representations, three tests

3D representations emphasize geometry and viewpoint consistency. NeRF predicts color and density from position and viewing direction, then renders along rays. Gaussian splatting uses explicit Gaussian primitives. Static scene reconstruction supports new views but does not establish dynamics under force. Connecting generative priors to 3D optimization, as in DreamFusion, does not automatically produce controllable physics.

Interactive video models predict frames conditioned on visual history and actions. Genie combines a video tokenizer, a latent action model (LAM), and a dynamics model. LAM infers discrete actions from adjacent frames; dynamics predicts new video tokens from past tokens and an action. Training LAM can use the next observed frame because it is inferring a past transition. At generation time that future frame is unavailable: a user or policy supplies the latent action. Reusing the retrospective inference as an input would leak the future.

Latent prediction need not reconstruct every pixel. V-JEPA-style learning predicts representations rather than all visual details. Predicting masked video latents and planning with actions remain different capabilities; V-JEPA 2 includes a separate action-conditioned component involving robot data. Planning requires informative observations, action semantics, and rollout evaluation, not merely a latent representation.

### Two futures in one corridor

Consider an illustrative five-cell corridor with position x in 0–4 and actions −1, 0, +1. Let `x_next=clip(x+a,0,4)`. From x=2, +1 gives 3 and −1 gives 1. Repeated +1 produces 2→3→4→4; repeated −1 produces 2→1→0→0. Boundary handling matters.

A geometry test asks whether two views of x=2 represent the same object at the same location. An interactive-video test fixes the initial image and checks whether changing the action changes movement direction. A latent test encodes `z=x/4`: x=2 is .5, and a rightward rollout predicts .75→1→1, decoded as 3→4→4. Can a planner select the action sequence reaching the right endpoint? These tests share an environment but establish different properties.

A model that ignores actions and predicts `x_next=x` may reconstruct stationary clips well while immediately failing the intervention test. A model with a correct first step but a third step through the wall also fails multi-step use. Track one-step error, boundary violations, and goal achievement separately.

### Latent codes are not keyboard labels

Genie's LAM learns without original action annotations. Codes can capture directions or jumps, but code 0 is not guaranteed to mean “left.” Code numbering can permute across training runs, and non-action factors may enter the representation. In transferring to real environment controls, the paper uses a small amount of action-labeled data to map latent codes to real actions. Learning controllable latents from unlabeled video is not the same claim as never needing an action mapping.

Variation: begin at x=4 and take +1 twice. The answer is 4→4→4. Taking −1 then +1 gives 4→3→4. If the “right” latent also changes the background color, control and appearance may be entangled. Test the same code across starting scenes before asserting consistent action semantics. Attractive frames cannot fill this evidence gap.

## Alignment Limits: Agreement and Corrigibility Assumptions

A support agent may be asked to solve problems quickly, protect privacy, and follow refund rules. Adding these goals into one reward does not remove conflicts: a high-scoring action may disclose information or bypass a rule. The second deck asks about the cost of agreement and the conditions needed to preserve human control.

Prerequisites are [preference training](/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf-en) and [operational risks](/posts/ai/2026-10-11-cmu10423-lecture-22-real-world-risks-en). A failed answer is not itself a formal theorem, and the theorems do not establish that all alignment is impossible.

### Agreement has a precise target

The agreement paper considers M tasks and N agents. Each task has a finite state space and an objective function. Agents have private information and potentially different priors, exchange messages, and update judgments. Epsilon limits tolerated disagreement; delta controls failure probability. Agreement about objective judgments is not identical to sharing every moral value.

The general lower bound has an essential quantifier: **there exist** functions, input sets, and priors for which any protocol requires on the order of `M N² log(1/epsilon)` bits. Unlimited idealized computation does not remove information exchange in hard instances. This does not impose that cost on every easy task; bits are not LLM tokens or seconds.

Additional dependence on state-space size D occurs in a lower bound for a restricted protocol class; D also appears in upper bounds. Conditions from different results cannot be combined into an unconditional formula for every system. The results motivate selecting tasks, participants, and scope rather than forecasting a particular model's training bill.

### An agreement example, not a complexity proof

Consider an illustrative delivered/not-delivered order state and a function representing refund eligibility. Agent A estimates .8 and B .3. With epsilon=.1, their .5 gap fails. After exchanging traceable delivery records, their estimates become .55 and .50: a .05 gap meets the criterion for this task.

A second privacy task with estimates .9 and .2 still fails. Agreement on refunds cannot substitute for agreement on disclosure. This example demonstrates a criterion, not guaranteed convergence or a lower-bound proof.

Variation: updated estimates .55 and .43 differ by .12 and fail at epsilon=.1. They pass at .15, but relaxing the requirement is not improved training. Testing one order state does not establish a probability guarantee across all states.

### Corrigibility differs from task success

Corrigibility concerns responsiveness to human intervention and preservation of shutdown or modification options. The second paper separates five utilities: deference, switch-access preservation, truthfulness, low-impact behavior, and bounded task reward. Strict weight gaps implement priorities so task gains cannot buy away control requirements.

For a simplified two-utility example, let safety S be binary and task reward R lie in [0,10]. Score `11S+R`. Safe behavior with zero task reward scores 11; unsafe behavior with maximum task reward scores 10. Task gain cannot compensate for losing a full safety unit. With weight 5, the comparison reverses: 5 versus 10.

This is **not the paper's complete construction**. If safety is continuous and a violation costs only .001, weight 11 may be insufficient. If task reward is unbounded, the comparison also fails. The example depends on binary safety and bounded R; merely saying “safety has the largest weight” is inadequate.

### The guarantees have assumptions

The single-step theorem assumes a specified partially observable off-switch game, the paper's five utility definitions, an optimal assistant policy, and weight-gap conditions W1–W3. W1, for example, makes the highest-priority weight exceed a particular combination of lower-priority benefit bounds. Descending weights alone do not suffice. The conclusion concerns the stated corrigibility criteria in that setting. Multi-step results separately handle learning and planning errors; the exact single-step guarantee cannot be transferred to an unknown environment.

Reward hacking means exploiting a proxy objective. It does not imply that every reward in every finite environment must be hacked. For arbitrary modified programs over unbounded horizons, the paper uses a halting-problem reduction to identify obstacles to universal guarantees; finite-horizon restrictions yield more tractable subproblems. Utility estimates, observations, and environmental assumptions still need validation.

Final variation: increase R's upper bound to 20 while keeping safety weight 11. Dominance fails: safe/zero scores 11, unsafe/maximum scores 20. For binary S, a weight above 20 restores this comparison. State assumptions before transferring conclusions into system design.

## Continue reading

- [Previous](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation-en)
- [Next](/posts/ai/2026-10-11-cmu10423-practice-exam-en)

## Course video sources

The official [course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/) provides a Panopto recording link; access requires login or course authorization. This is a slide-based guide; it does not include a recording transcript, captions, or original-audio shadowing material.

## References

- [CMU Lecture 26 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture26-world-models.pdf)
- [Genie](https://arxiv.org/abs/2402.15391)
- [NeRF](https://arxiv.org/abs/2003.08934)
- [V-JEPA 2](https://arxiv.org/abs/2506.09985)
- [CMU Lecture 26 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture26-alignment.pdf)
- [Agreement-based complexity analysis](https://arxiv.org/abs/2502.05934)
- [Core Safety Values for Provably Corrigible Agents](https://arxiv.org/abs/2507.20964)
