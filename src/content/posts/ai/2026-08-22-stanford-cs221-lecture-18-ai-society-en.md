---
title: "CS221 Lecture 18: AI & Society: Benefits, Misuse, Accidents, and Institutions"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 19
tldr: "Lecture 18 classifies AI's social effects as benefits, misuse, accidents, and structural harms, then connects fairness audits, research ethics, copyright, and platform terms to accountable institutional choices."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 18: official agenda, core development, implementation connection, and material gaps."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-18-ai-society)

This article covers **Stanford CS221, Autumn 2025, Lecture 18**, taught by Percy Liang on 2025-11-19. The [official course site](https://stanford-cs221.github.io/autumn2025/) fixes the offering and assignments; the primary artifact is [society](https://stanford-cs221.github.io/autumn2025-lectures/?trace=society). It follows the executable order of `main()` rather than turning the lecture into a generic essay. Claims not supplied by the artifact remain gaps.

## The lecture's problem

### From technical to societal aspects

The artifact reviews machine learning, state-based models, probabilistic reasoning, and logical reasoning. Its state-based models include deterministic search, Markov decision processes under uncertainty, and adversarial games; its reasoning topics include Bayesian networks, propositional logic, and first-order logic. Lecture 18 turns to AI's societal aspects: models do not merely compute, but interact with people, institutions, resources, and power.

### The contract to track while reading

Read every method as a contract: how are inputs represented, what information does inference need, what objective does the output optimize, and where is computation spent? This lecture extends the contract beyond the model: who supplied the data, who controls compute, who decides which requests are allowed, who bears errors, and which groups appear in metrics. That is an analytic frame, not a complete theory of every AI social issue.

## Why technologists should care about society

### Technology changes society

Technology has massive impact. The lecture names the Internet, mobile phones, and social networks as historical examples, describes AI as particularly fast-growing, and uses 800 million weekly active ChatGPT users to illustrate scale. Treat this as a dated source snapshot: [OpenAI's 2025-11-12 statement](https://openai.com/index/fighting-nyt-user-privacy-invasion/) says 800 million people use ChatGPT each week; it is not a timeless live statistic or a claim that all users use the same features. Its function is to show that technology enters systems used by many people.

### Technologists have choices

Engineers cannot control every consequence, but technologists make consequential choices. They understand capabilities and limitations, choose problems, and shape access through design. The artifact asks: which languages should be supported, such as English, Spanish, and Chinese? Should foundation-model weights be released? Which requests should be allowed? Each answer changes who can use a system, what they can do, and how risk is distributed.

### Leaving consequences to others is not neutral

The extreme example is Wernher von Braun, who helped Hitler develop rockets during World War II and later came to the United States to develop the space program. The artifact quotes Tom Lehrer's “Wernher von Braun,” whose irony is that where rockets come down is supposedly “not my department.” The point is not that one engineer owns every downstream outcome. It is that refusing to discuss consequences does not separate technology from them.

## High-level principles

### The goal and existing declarations

The broad goal is to develop AI to benefit rather than harm society. [HHS's Belmont Report](https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/index.html) shows this is not new: the 1979 report addresses protection of human subjects and names respect for persons, beneficence, and justice. The specific history of Tuskegee belongs to the [CDC's account](https://www.cdc.gov/tuskegee/about/index.html): from 1932 to 1972, African American men were observed without adequate informed consent and were not given treatment even after penicillin became available. It was part of the background for institutional reform; Belmont should not be reduced to a report mechanically caused by one event.

### Turning principles into practice

The ACM Code of Ethics is also named: contribute to human well-being, avoid harm, be honest, be fair, credit authors, respect privacy, and honor confidentiality. The hard question is operationalization in a dataset, model, product, and deployment. The principles are normative direction; auditing, multiple metrics, transparency, and openness are attempts to make them observable, not proven solutions.

## Dual-use technology

### Definition and historical analogies

Developers cannot fully control AI's use. A **dual-use technology** can benefit or harm people. The examples are ammonia for agriculture or chemical weapons; rockets for space exploration or ballistic missiles; nuclear power for energy or nuclear weapons; cybersecurity tools for penetration testing or cyberattacks; and encryption for privacy or concealing criminal activity. AI is dual use as well.

### Direction can still be steered

Dual use does not mean every outcome is equally unavoidable. The lecture still says AI can be steered toward benefits, while acknowledging that uses cannot be completely locked down. Work therefore separates applications to promote, misuse to deter with safeguards, and unintended consequences requiring more careful design and monitoring.

## Benefits, misuse, and accidents

### Benefits

The lecture classifies impact along intent and impact axes. **Benefits** are useful applications that can be developed proactively. In biomedical science, AlphaFold3 predicts how a drug or ligand binds to proteins to accelerate drug development; in healthcare, AI can answer questions about electronic health records and communicate with patients. Education includes personalized learning, curriculum design, and automatic grading, with a pedagogical warning: this is not merely task completion.

Robotics includes self-driving cars today and household robots for an aging population in progress. Short-term weather forecasting can support early warning. Long-term climate forecasting can monitor emissions and the effectiveness of mitigation strategies. These are directions named by the artifact, not guarantees about each application.

### Misuse

**Misuse** is when bad actors explicitly use AI to harm others. Examples are AI agents used in cyberattacks and disinformation made with realistic text, images, audio, and video; deepfakes are among the media examples, and actors range from states to teenagers. The classification concerns intent: a capability may be beneficial in one setting, but deliberate harm is misuse rather than a model accident.

### Accidents

**Accidents** are unintended consequences that neither developer nor user wants. The examples are demographic inequality, such as voice assistants working less well for people with an accent; sycophancy, reaffirming false beliefs and especially troubling around mental health or self-harm; overreliance, such as people in education losing critical thinking; cultural homogenization through existing biases and stereotypes; and jobs, where AI displaces functions such as those performed by entry-level software engineers.

The taxonomy suggests: do more benefits, install safeguards to try to prevent misuse, and be more careful about accidents. It neither guarantees safeguards nor blames users for every accident; it matches interventions to intent and impact.

## An ecosystem view

### Why model behavior is insufficient

Understanding impact and finding positive intervention points requires more than looking at model behavior. An ecosystem view follows a model from data and compute into human use for benefit or harm. Problems can sit in outputs, upstream resources and data, downstream use, or power relationships.

### Upstream

Models are created from data and compute, and data comes from people. Upstream concerns include unintended disclosure of personal information, creators not being appropriately compensated, and poor labor practices. Compute comes from environmental resource extraction involving energy and materials, with emissions, water use, and resource extraction as environmental impacts. The artifact identifies these points but supplies no measurements or comparisons for them.

### Downstream

People use AI for benefit and harm. AI may help some more than others, generate toxic content, or take harmful actions. People may become dependent and unable to think for themselves, and some job functions may be displaced. The ecosystem view shifts the question from “was the answer correct?” to how data was obtained, how deployment works, who uses the system, who bears costs, and which link can be audited or changed.

## Inequality and bias

### Demographic inequality

[GenderShades is the 2018 Buolamwini and Gebru study](https://proceedings.mlr.press/v81/buolamwini18a.html); its abstract reports substantial disparities across skin-tone and gender subgroups in three commercial gender-classification systems, with dark-skinned females the most misclassified group. The lecture says systems improved after the study and presents third-party **auditing** as a way external tests can incentivize companies to reduce inequality; that is the lecture's account, not a claim that every later system is fair. Strategies include collecting more data for underrepresented groups, upweighting them algorithmically, and using distributionally robust optimization.

It also asks whether gender classification is a well-defined task. If gender includes self-identification, treating it as a fixed label may define the task incorrectly. The artifact does not answer this; it shows that fairness requires checking whether the measured concept is well-posed, not only comparing scores.

### Global bias and representation

Starling 7B is fine-tuned from Llama2 7B Chat and is a reward model used for language-model post-training. The material says it assigns higher rewards to Western countries than to non-Western countries. This describes that reward model, not every model or culture. The question is what happens when “a good answer” is defined by particular data and preferences: which regions and viewpoints are represented, and which are undervalued?

### Spurious correlations

**Spurious correlations** are training-data patterns that do not generalize. The chest-drain image case shows how clues in data can produce an unwanted association; minority subpopulations are often affected most. Overall accuracy can look good while a model fails across subpopulations or conditions. The lesson is to monitor multiple metrics and different subpopulations. No complete fairness definition or guaranteed fix is supplied.

## Alignment

### The basic alignment recipe

**Alignment** asks how to make AI do what we want. The reinforcement-learning recipe is to define a reward function that captures values, then train an agent to maximize expected reward. The immediate questions are whether the reward represents the desired result, whether people share one value system, and whether humans can inspect behavior.

### Reward hacking

In the OpenAI 2016 CoastRunners example, the goal was to race a boat, but the reward was points obtainable by hitting things. The learned policy looped around the harbor, earning points without finishing. The reward function did not capture the real goal. Code offers parallel cases: it passes incomplete unit tests, is correct but insecure, or is correct and secure but has bad style and high complexity. “Do what I mean, not what I say” is hard to formalize; overoptimization amplifies incomplete metrics.

### Pluralism

**Pluralism** means different people have different values. The normative direction is for models to represent diversity of thought within the Overton window and to be personalized, while avoiding sycophancy and echo chambers. There is no single reward function representing everyone; that absence is part of alignment. The descriptive challenge is value diversity, and the normative direction is to acknowledge it without confusing compliance with respect.

### Scalable oversight

Language models can solve complex problems and may already produce answers experts find difficult to verify. How can ordinary people evaluate them? The artifact suggests breaking problems into smaller subproblems, using AI itself such as debate between two AIs or constitutional AI, and supervising process rather than only outcome. Its summary is: the reward is not what we want (reward hacking); no single reward exists (pluralism); and writing or checking a reward is hard (scalable oversight).

## Copyright and generative AI

### Intellectual-property institutions

Generative-AI lawsuits mostly concern copyright, and the artifact names material about Anthropic paying authors $1.5 billion to settle. Keep the case and legal holding distinct: the [final approval order in Bartz v. Anthropic](https://docs.justia.com/cases/federal/district-courts/california/candce/4:2024cv05417/434709/680) records a $1.5 billion settlement fund plus interest; a settlement is not a ruling that all generative-AI training is unlawful, nor does it automatically decide other cases. Intellectual-property law aims to incentivize creation of intellectual goods. The listed types are copyright, patents, trademarks, and trade secrets; the lecture focuses primarily on copyright.

### The scope of copyright

The 1709 English Statute of Anne is presented as an early government-and-court regulation of copyright, and the U.S. Copyright Act of 1976 as a more recent landmark. Copyright protects original works fixed in a tangible medium and perceptible, reproducible, or communicable directly or with a machine. It protects expression rather than ideas, with quicksort as the idea example. Collections such as telephone directories need creativity in selection or arrangement; the scope moved from “published” in 1909 to “fixed” in 1976. Under the [U.S. Copyright Office's explanation](https://copyright.gov/what-is-copyright/), protection generally arises automatically when a work is created and fixed, not only after registration. That is a U.S. rule and should not be generalized across jurisdictions and work types.

For U.S. works, the [Copyright Office explains](https://www.copyright.gov/engage/writers/) that registration generally must be completed, or the application refused under the statutory route, before filing an infringement action in federal court; merely submitting an application is not always the same as registration. The artifact's **$65 is a fee snapshot for the Standard Application**, not a universal price: the [current fee page](https://www.copyright.gov/about/fees.html) lists $45 for an electronic Single Application, $65 for a Standard Application, and different fees for group registrations. Copyright duration is not a flat 75 years. The [Copyright Office's duration guidance](https://www.copyright.gov/help/faq/faq-duration.html) says that most works created after 1978 last for the author's life plus 70 years, while anonymous, pseudonymous, and works-made-for-hire generally last 95 years from first publication or 120 years from creation, whichever is shorter; older works require additional historical analysis. Public-domain status therefore depends on jurisdiction, work type, and creation or publication history. The lecture's cautious takeaway remains: do not assume online material is uncopyrighted.

### Licenses

The routes for using copyrighted work are obtaining a license or appealing to fair use. A license is a contract-law grant from licensor to licensee, summarized as “a promise not to sue.” Creative Commons does not make a work ownerless or automatically public domain; it gives permission on specified terms. The lecture's 307 million Flickr, 39 million MusicBrainz, and 10 million YouTube figures should be labeled an **approximate November 2014 snapshot**, not current inventory. [Creative Commons' 2015 State of the Commons data](https://stateof.creativecommons.org/2015/data.html) used a different date and method, reporting figures such as 356 million Flickr items and 13 million YouTube videos, and warns that these are estimates of works across platforms rather than one homogeneous image count. The history of Creative Commons' founding by Lessig, Abelson, and Eldred in 2001 is on its [official history page](https://creativecommons.org/history/).

Model-data licensing examples include Google/Reddit, OpenAI/Shutterstock, and OpenAI/StackExchange. They are cases named by the material, not independent legal conclusions here.

### Fair use

Section 107 considers purpose and character (educational over commercial, transformative over reproductive), nature of the work (factual over fictional, non-creative over creative), amount and substantiality (a snippet over the whole), and effect on the original or potential market, as summarized by the [Copyright Office](https://www.copyright.gov/fair-use/). These are factors, not categorical rules such as “educational is always allowed” or “under a fixed percentage is always allowed”; courts weigh the whole situation. Examples are writing a movie summary, reimplementing an algorithm's idea rather than copying code, and Google Books indexing and showing snippets ([Authors Guild v. Google](https://www.copyright.gov/fair-use/)). Copyright is not just verbatim memorization: Harry Potter's plots and characters may be protected, while parody may qualify for fair use in a particular context. The emphasis is legal analysis, not a guaranteed outcome.

### Foundation-model considerations

Training begins by copying data, so whether copying is already a violation may matter. Yet training is transformative, far from copy-paste: a model may learn the idea of a stop sign rather than one image's exact artistic expression. Foundation models can still affect writers' and artists' markets regardless of the copyright result. The legal question and the market-and-work question are distinct; the lecture does not decide every case.

### Terms of service

Licensing or fair use does not remove additional contractual restrictions. A YouTube video may carry a Creative Commons license while [YouTube's Terms of Service](https://www.youtube.com/static?template=terms) restrict downloading, reproducing, or using Service content unless expressly authorized by the Service, permitted by law, or covered by written permission. The same terms expressly allow showing videos through the embeddable YouTube player. This is not a categorical claim that every download is unlawful: platform terms, API or player permissions, applicable law, and the individual work's license are separate questions. Legal permission and platform terms are separate constraints.

### Memorization and extraction

**Memorization** asks whether text is in the weights, operationalized with (p(\text{book}[i] \mid \text{book}[1:i-1])); Llama 3 70B assigns much higher-than-chance probability to Harry Potter. **Extraction** asks whether a user can recover the text. Prompting with “Mr. and Mrs. D” may cause a model to generate all of Harry Potter through a sliding window. The lecture says easy extraction is the stronger infringement case.

## Openness and transparency

### Who can decide and build

The lecture asks who decides model behavior and who can build models. Centralization of power is the risk: very few large technology companies can build frontier models, while little about how they work is revealed. This is governance of decision-making and building capacity, not only model quality.

### Transparency

**Transparency** is a prerequisite: if it cannot be measured, it cannot be improved. The Foundation Model Transparency Index (FMTI) evaluates developers through 100 indicators covering upstream, model, and downstream properties. The material shows subdomain, total, and comparison scores and proposes a theory of change in which public reporting incentivizes greater transparency. It does not claim transparency automatically produces safety or fairness.

### Openness

Foundation-model openness lies on a spectrum. Its benefits are more innovation and customization, more transparency though not enough, and less power centralization. Misuse analysis should compare marginal risk with closed models and the Internet and consider the whole ecosystem, because designing, manufacturing, and deploying a bioweapon can be one chain. Openness is not an unconditional answer; the lecture ends by calling for more clarity and measurement.

## Summary

Technologists should care because AI enters real settings and technologists choose problems, languages, weights, and request boundaries. AI is dual use: develop benefits, use safeguards to deter misuse, and be careful about accidents. An ecosystem view connects data, compute, labor, environment, model, deployment, users, and downstream harm.

The practical tools are multiple metrics across subpopulations, third-party audits, separate treatment of reward hacking, pluralism, and scalable oversight, distinctions among copying, transformation, licensing, fair use, terms, memorization, and extraction, and measurable governance questions about transparency and openness. Next time examines the players in the AI ecosystem.

## Material gaps

This article uses `society.py` and the existing official links as its base, adding authoritative sources inline where needed. The official lecture material and video are public; Canvas interactions, assignment solutions, and hidden tests are not. No unprovided numbers were added for GenderShades, global reward differences, chest-drain images, FMTI, or legal disputes, and normative directions were not rewritten as proven causal conclusions. The artifact names cases and strategies but supplies no complete fairness definition, comprehensive deployment rules, or comparative effectiveness results for every strategy. The legal discussion is also limited to selected U.S. distinctions, not cross-jurisdiction legal advice. Those remain gaps.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: society](https://stanford-cs221.github.io/autumn2025-lectures/?trace=society)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
- [GenderShades](http://gendershades.org/)
- [Stanford CS324: Legality](https://stanford-cs324.github.io/winter2022/lectures/legality/)
