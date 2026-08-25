---
title: "Stanford CS111 Lecture 25: Truth, Trust, and Technology—How Algorithms, Generative AI, and Deepfakes Reshape Trust"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 26
tldr: "Lecture 25 separates assumption, inference, and substitution as ways to establish trust, then examines how social recommendations, generative AI, and synthetic media amplify over-trust; the response is preserved provenance, independent validation, and coordinated responsibility."
description: "A page-by-page guide to Stanford CS111 Spring 2026 Lecture 25, covering trust, confirmation bias, social recommendation, AI hallucination, deepfakes, and source validation."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-25-truth-trust-technology)

This is installment 26 of the [Stanford CS111 guide](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 25**. Mendel Rosenblum taught it on May 27, 2026, under the official title [Truth, Trust, and Technology](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/25/Lecture25.pdf). This article follows the 13-page public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The recording is behind Canvas/Panopto and is not presented as reviewed.

This lecture deliberately leaves conventional OS mechanisms and returns to Lecture 12's trust framework: when people cannot verify every claim themselves, how do they delegate judgment to platforms, AI, and media? Its message is not “all technology is untrustworthy.” Trust extends agency while creating exposure to deception.

## Page-by-page agenda

- Pages 1–2: title and no assigned optional reading.
- Page 3: trust; assumption, inference, and substitution; over-trust and untrustworthiness.
- Pages 4–5: disagreement about basic facts; information costs, confirmation bias, and “many people say so.”
- Pages 6–7: attention incentives, personalized social content, and responsibility.
- Pages 8–9: authoritative tone, concrete details, generative-AI hallucination, and independent validation.
- Pages 10–11: deepfakes, the deniability of both fake and real evidence, and labeling, detection, and institutional responses.
- Pages 12–13: observable signals of trustworthy sources, group discussion, and conclusion.

## Trust extends agency by accepting exposure

Page 3 uses the definition adopted in [The Ethics of Advanced AI Assistants](https://arxiv.org/abs/2404.16244): a trustor expects another party to perform something important and therefore accepts vulnerability to that party's actions despite being unable to monitor or control them. The point is not sentiment but **accepting the vulnerability created by dependence**.

The slides give three routes. **Assumption** believes before checking; it is cheap but fragile. **Inference** extrapolates from track record, competence, and conduct; it offers the most information but can be corrupted by bias. **Substitution** rests judgment on another trusted mechanism or institution—for example, using a source that discloses methods, accepts review, and retains correction records instead of personally reproducing every experiment.

Failure has two sides. A trustor can extend trust too far—over-trust. A trustee can lack reliability, integrity, or care and be unworthy of trust. Trust enables what a person cannot accomplish alone, but none of the three routes guarantees truth automatically.

## From factual conflict to confirmation bias

Page 4 uses elections, the economy, crime, and climate to show that groups can disagree even about basic facts. Its line that there is only one truth and therefore tens of millions are wrong exposes the logical conflict; this article does not adjudicate each example.

Page 5 says what a person believes greatly exceeds what they directly perceive. Individuals cannot reproduce every statistic, investigation, or scientific measurement and must select others' information and conclusions. That necessary delegation meets two shortcuts: trusting a source because it validates an existing belief, and treating volume or repetition as truth. The second ignores that many messages can trace back to one origin.

A useful check is procedural rather than demanding that oneself be “unbiased.” Before searching, write down what evidence would change the conclusion. Read opposing material with traceable sources. When many sources repeat a claim, follow their links backward and test whether they really provide independent evidence.

## Social recommendation: engagement is not a truth signal

Page 6 gives an incentive chain: attention can become revenue; reinforcing fear or prior views may increase engagement; personalization then supplies belief-congruent material. Besides giving people different information environments, repetition can turn “I see this often” into “everyone believes this.” Page 7 stresses that likes, interactions, and shares are engagement signals, not truth evidence. “The algorithm showed me” also differs from an editor selecting material under an accountable procedure.

The slides list anxiety, depression, body-image harms, and suicidal thoughts, but compress causation and court rulings too aggressively. A safer comparison is the U.S. Surgeon General's [Social Media and Youth Mental Health advisory](https://www.hhs.gov/surgeongeneral/reports-and-publications/youth-mental-health/social-media/index.html). It describes meaningful risks and possible benefits while acknowledging evidence gaps; it does not support “any use necessarily causes a particular disorder.” This article likewise does not treat the slide's court summary as a legal conclusion.

Who is responsible? The slides name platforms, government/legislation, and users, then call for coordination. Platforms control ranking objectives and data; policymakers can set transparency and safety requirements; users can change sharing and verification habits. No actor has all the authority and information needed to solve the problem alone.

## Generative AI: fluency and specificity are not reliability

Page 8 acknowledges that ChatGPT and Claude can produce useful information, then asks why they readily gain trust. It lists authoritative tone, detailed explanations, concrete “facts,” and confidence even when wrong. [Bansal et al. 2021](https://dl.acm.org/doi/10.1145/3411764.3445717) examines appropriate reliance on explanations in AI-assisted decisions; [Bower et al. 2024](https://link.springer.com/article/10.3758/s13423-023-02433-9) studies how experts and novices infer knowledge from language. They support the narrower claim that presentation affects trust judgments, not that every AI answer deceives every user.

NIST's [Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) uses **confabulation** for confidently presented false, erroneous, or inconsistent content and warns that plausible reasoning or citations can deepen inappropriate trust. This describes a risk; it does not mean every output is false.

When AI is hidden inside search, documents, or messaging software, users may forget that a sentence came from a model. After copying and summarization, one hallucination can appear to have multiple supporting sources. Page 9's operational conclusion is to treat output as a hypothesis, not evidence created by generation. For consequential facts, return to independent primary sources and validate through substitution.

## Deepfakes: believing fakes and denying reality

Page 10 notes that convincing photographs, voices, and videos once cost more to fabricate, giving people some reason to infer trust from the medium. Generative technology lowers the cost of persuasive synthetic content. The slides pair two errors: believing a video labeled as AI and dismissing likely authentic audio as a deepfake. The latter shows that harm includes not only believing fakes but making unfavorable evidence easier to deny, eroding epistemic trust. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/25/Lecture25.pdf))

Page 11 asks students to abandon unconditional trust in images and audio and add validation. It proposes labeling AI content, improving detection, supporting journalists and trusted institutions, and protecting people from unauthorized voice or image cloning. The [C2PA Content Credentials specification](https://spec.c2pa.org/) can provide verifiable provenance and edit history, but explicitly does not judge truth or value: provenance is not proof of a proposition, and an absent credential does not itself prove a fake.

The slide also attributes to Hannah Arendt a passage about people losing their capacity to judge when they can no longer believe anything. This article preserves its role in the lecture's argument but does not treat a slide as a primary source for exact wording. A verbatim quotation still requires checking the work, edition, and context.

## Turning the discussion into a checklist

Page 12 asks what observables suggest trustworthiness or untrustworthiness. The following is not an official answer; it makes the prompt operational.

1. **Find the original source:** Can the claim be traced to data, a judgment, a paper, an official record, or a complete statement?
2. **Inspect methods and corrections:** Does the source disclose methods, limitations, and a visible correction record?
3. **Test independence:** Do multiple sources all repeat one post, press release, or model output?
4. **Separate signals:** Followers, shares, fluent prose, and high-resolution media describe distribution or presentation.
5. **Write falsification conditions first:** Before searching, record what evidence would overturn the current view.
6. **Scale the threshold to risk:** Medical, legal, financial, and civic decisions demand more authoritative sources and independent checks.

## Where this lecture fits in CS111

Lecture 25 may seem to leave file systems, but it continues the course's habit: do not inspect only interface output. Ask who maintains state, what invariant is promised, and what is observable under failure. Here the shared resource is society's trust in information; failure modes are obscured provenance, copied errors, and delegated judgment.

Page 13 offers neither a detector nor a statute as a universal cure. Trust remains essential and confirmation bias is hard to eliminate. Technology can make untrustworthy sources look credible and convenient sources easier to over-trust. The lecture sees hope in institutions with established records, then asks whether people will trust them. The design problem is to make provenance, procedure, correction, and responsibility observable instead of asking users to guess truth from appearance.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 25 slides: Truth, Trust, and Technology](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/25/Lecture25.pdf)
- [Gabriel et al., The Ethics of Advanced AI Assistants](https://arxiv.org/abs/2404.16244)
- [Bansal et al., Does the Whole Exceed its Parts?](https://dl.acm.org/doi/10.1145/3411764.3445717)
- [Bower et al., How experts and novices judge other people’s knowledgeability from language use](https://link.springer.com/article/10.3758/s13423-023-02433-9)
- [U.S. Surgeon General, Social Media and Youth Mental Health](https://www.hhs.gov/surgeongeneral/reports-and-publications/youth-mental-health/social-media/index.html)
- [NIST AI 600-1, Generative Artificial Intelligence Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [C2PA Content Credentials specifications](https://spec.c2pa.org/)
