---
title: "The Human Side: What You Lose as You Hand More to an Always-On Agent, and How to Calibrate Trust"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, automation, human-ai-interaction, trust]
lang: en
tldr: "When an always-on agent makes a mistake, you're the one who has to catch it; but the more you hand over, the worse you get at catching it. That's what Lisanne Bainbridge called the \"ironies of automation\" in 1983. Research since 2025 sees similar signs with AI: endoscopists who routinely used AI polyp detection found fewer adenomas when working without it (an observational study with other possible explanations), and knowledge workers who trust AI more report checking its work less. Trust is also asymmetric: one badly timed intervention costs more trust than a well-timed one earns back. The practical answer is to divide work with two questions, whether you can afford its mistakes and whether you can spot them, and after handing something off, check periodically that you can still do it and are still watching what the agent does."
description: "What Bainbridge's \"ironies of automation\" mean for always-on agents, post-2025 research and counter-evidence on AI deskilling, overreliance and critical thinking, how trust rose and fell in the Proactivity-Gym study of 30 people, why approval fatigue turns confirmations into reflexes, and how to decide what to do yourself, what to hand off and what to check after a few weeks."
series:
  name: "Always-On AI Agents"
  order: 19
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-human-side-of-agents)

| What you hand off | What you may lose | Strength of the evidence |
|---|---|---|
| Routine judgment | Your feel for it, so you can't take over when needed | Consistent across industrial and medical research; little long-term data for AI |
| Checking its work | The ability to catch errors: the more you trust it, the less you check | Surveys and experiments |
| Scheduling, keeping to-dos | Your grip on your own work | Reporters' and users' personal accounts |
| Every confirmation | The meaning of confirming: press it often enough and it becomes a reflex | Vendors' own statements |

The Verge's Allison Johnson handed Claude Duet a work inbox, calendar, Google Docs and Slack for a week. As [the hands-on review recounts](https://www.theverge.com/ai-artificial-intelligence/1032518/claude-duet-ai-agent-hands-on), Duet sometimes genuinely helped. For instance, it noticed that upcoming time off would leave only a couple of working days before another big draft was due, proposed a fix and drafted a Slack message to the editor.

But one thought kept coming back:

> I wonder if it would change how I work if I knew I didn't really need to take responsibility for putting things on my calendar, writing down a to-do list, or paying attention in a meeting because Duet will just handle it. Maybe that's how CEOs live.

Johnson wondered about ending up a bit disconnected from the workplace.

The previous two posts were about agents doing the wrong thing. This one turns to people: what you lose as you hand more over, and how to calibrate your trust.

## The ironies of automation

In 1983, University College London psychologist Lisanne Bainbridge published a five-page paper, "[Ironies of Automation](https://ckrybus.com/static/papers/Bainbridge_1983_Automatica.pdf)." Bainbridge studied factory control rooms and flight decks, but the conclusions transfer almost unchanged to always-on agents.

Designers of automation try to remove the "unreliable" human, and end up leaving people with the two hardest jobs:

- **Taking over when something goes wrong**: only situations the automation can't handle get handed back, but people who haven't done the work by hand in a long time have lost skill. The paper puts it this way: "a formerly experienced operator who has been monitoring an automated process may now be an inexperienced one."
- **Monitoring whether it's doing the job right**: the automation was installed because it does the job better than the person, yet the person is asked to judge whether it's doing it well. Bainbridge's conclusion: "The human monitor has been given an impossible task."

The paper also cites vigilance research: people struggle to keep their attention on a source where very little happens for more than about half an hour. The longer a system runs without problems, the less closely people watch it.

Then comes the paper's most quoted line: the more advanced the system, the more crucial the human role may be. In the original: "the more advanced a control system is, so the more crucial may be the contribution of the human operator."

Vera Liao, who studies human–AI interaction at the University of Michigan, summarized what this means for AI agents for [a Vox reporter](https://www.vox.com/advice/506547/muse-instinct-chatgpt-dots-ai-personal-agent). More advanced automation leads to more consequential errors; the more people rely on automation, the worse they get at catching those errors.

## What research since 2025 has found

Bainbridge's argument came from industrial settings. As AI has spread, studies have started testing it directly.

**Worse without AI after using it**: four endoscopy centers in Poland introduced AI-assisted polyp detection at the end of 2021. [Budzyń and colleagues, writing in The Lancet Gastroenterology & Hepatology in 2025](https://pubmed.ncbi.nlm.nih.gov/40816301/), compared colonoscopies done without AI in the three months before and after. The adenoma detection rate fell from 28.4% to 22.4%. All 19 endoscopists had performed more than 2,000 colonoscopies each.

The study has clear limits, which the authors acknowledge: it's observational. Among [expert reactions collected by the UK Science Media Centre](https://www.sciencemediacentre.org/expert-reaction-to-observational-study-looking-at-detection-rate-of-precancerous-growths-in-colonoscopies-by-health-professionals-who-perform-them-before-and-after-the-routine-introduction-of-ai/), one researcher pointed out that the number of colonoscopies nearly doubled after AI was introduced, and a heavier workload alone could lower detection rates. Experienced doctors losing skill in three months also raises the question of whether habits changed rather than skills eroded. It's the first large-scale real-world evidence, not a settled finding.

**More trust in AI, less checking**: [Lee and colleagues from Microsoft Research and Carnegie Mellon, at CHI 2025](https://dl.acm.org/doi/full/10.1145/3706598.3713778), surveyed 319 knowledge workers who use generative AI at work at least weekly, collecting 936 real examples. The more confident people were that AI could do a task well, the less critical thinking they reported; the more confident they were in their own ability to do it, the more they checked the AI's output.

It's a self-report survey measuring whether people feel they're thinking, not actual performance. But it points the same way as Bainbridge: the people who actually check are those who could do the work themselves.

## More trust isn't always better

Human factors researchers talk about "trust calibration": your trust should match how reliable the system actually is. Too little trust and you won't use a good tool; too much and you stop checking, as above.

In 2026, Oh and colleagues proposed [Proactivity-Gym](https://harryoh99.github.io/foundations_of_proactive_agents/) for evaluating proactive agents. They had 30 people read week-long interaction logs and compare how different agents behaved, and found several things:

- **Right answer, wrong timing, still unwelcome**: at equal content quality, participants chose the agent whose interventions suited them in 88.3% of comparisons. Correct help that competed with ongoing work was accepted only 26.7% of the time; help done during sleep time that still needed revision the next morning was accepted 97.8% of the time.
- **Trust falls fast and recovers slowly**: going from a well-aligned intervention to a misaligned one cost an average of 1.86 points of trust on a five-point scale; the reverse gained only 1.27. After an aligned, misaligned, aligned sequence, trust ended at 3.43, short of the starting 4.43. One participant said: "After one wrong action, an agent has to consistently behave well for a long time to recover trust."

Participants read written scenarios rather than using their own agents over time, as the authors note. The study shows a direction, not how you'll actually react.

Another finding worth knowing: overreliance isn't purely a psychological weakness. [Vasconcelos and colleagues at Stanford](https://dl.acm.org/doi/10.1145/3579605) ran five experiments (731 people in total) and found people "strategically" decide whether to check an AI: the costlier checking is, the more likely they are to accept its answer as is. So making checking cheaper, for instance by having the agent say exactly which email or file it relied on, works better than telling people to "pay more attention."

## Approval fatigue

The standard answer for always-on agents is "ask before anything important." But ask too often and the problem changes.

[OpenAI, describing how it manages persistent agents internally](https://developers.openai.com/blog/securing-persistent-agents-like-openclaw-at-openai), puts it bluntly: constantly requiring human review creates review fatigue, training people to blindly accept every permission prompt. Its approach is to have a second model filter first, saving human attention for approvals that matter. [Order 13](/posts/ai/2026-11-20-openclaw-enterprise-en) covers that design.

It's Bainbridge's monitoring problem in another form: the more often you press "approve," the less each press means.

## Handing off isn't necessarily bad

Psychologists call handing mental work to a tool "cognitive offloading." [Risko and Gilbert's 2016 review](https://samgilbert.net/pubs/Risko2016TiCS.pdf) notes real benefits: reminders are more reliable than memory, and stored information distorts less than what's kept in your head.

The costs are documented too: people who drove a route with turn-by-turn navigation remembered less of the scenery and drove worse the second time without it. And people often overestimate the benefit of offloading, writing down even things they'd easily remember.

So the point isn't "don't hand things off," it's choosing what to hand off. Liao's advice to Vox: "Choose to use agents for tasks that you can tolerate the consequences of errors."

MIT's Pattie Maes, in the same article, pointed to another cost. If everyone hands their tasks to agents, the world fills with more AI-generated messages, emails and bookings; the people forced to deal with them are on the other end. [Order 22](/posts/ai/2026-11-20-the-other-end-en) of this series covers that side.

## Dividing the work: what to hand off and what to keep

Two questions sort the tasks you might give an agent into four boxes:

| | You can spot its mistakes | You can't spot its mistakes |
|---|---|---|
| **You can afford its mistakes** | Hand it off, spot-check occasionally | You can hand it off, but accept that errors may go unnoticed |
| **You can't afford its mistakes** | Hand it off, but approve every time | Keep doing it yourself |

Add one more question: **do you need to keep this skill?**

- Yes (your professional judgment, your writing, relationships with key clients) → even if it lands in the "hand it off" box, do it yourself now and then.
- No (sorting receipts, scheduling meetings) → just hand it off.

Johnson's conclusion makes a good example. Having Duet find overlooked discrepancies across messages works "as a backstop for my own organizational systems, not as a replacement for them"; the writing stays entirely in human hands.

## What to check after a few weeks

Two to four weeks after handing something off, ask yourself:

1. **When did you last catch it making a mistake?** If you can't remember, that doesn't mean it hasn't made any; you may not be looking.
2. **Can you still do it without the agent?** Pick one task you've handed off and do it yourself once.
3. **Do you still read before pressing "approve"?** If you mostly press it straight away, cut down what needs your confirmation, and make what's left worth reading.
4. **Is its timing still right?** Notifications that interrupt you while you're focused, even correct ones, should be batched and delivered later.
5. **Does your trust match its track record?** After one big mistake, have you stopped using it altogether; or because it hasn't made one, have you stopped checking entirely?

## When to be especially careful

This isn't a product post, so here's when to be especially careful instead:

- What you've handed off is the core of your expertise, and you haven't done it by hand in a long time.
- The agent rarely makes mistakes, and you've mostly stopped looking at what it does.
- There are so many confirmation prompts that you press approve without reading.
- You're new to the job and still learning it: Bainbridge warned that later generations don't get to build the skills earlier ones developed by doing the work.

These issues have nothing to do with any particular product; they apply to every always-on agent available in Taiwan, and to self-hosted OpenClaw and Hermes alike.

Trust has to be calibrated against evidence. [Next](/posts/ai/2026-11-20-evaluating-always-on-agents-en): how to evaluate whether an always-on agent is actually useful, what reporters' hands-on tests are worth, and what existing benchmarks do and don't measure.

## References

- [Ironies of Automation](https://ckrybus.com/static/papers/Bainbridge_1983_Automatica.pdf) (Lisanne Bainbridge, Automatica 19(6), 1983)
- [Claude's Duet agent is a little neurotic and surprisingly helpful](https://www.theverge.com/ai-artificial-intelligence/1032518/claude-duet-ai-agent-hands-on) (The Verge, 2026-11-13)
- [AI agents like Muse and Instinct can do your tedious tasks. But should they?](https://www.vox.com/advice/506547/muse-instinct-chatgpt-dots-ai-personal-agent) (Vox, 2026-10-16)
- [Endoscopist deskilling risk after exposure to artificial intelligence in colonoscopy](https://pubmed.ncbi.nlm.nih.gov/40816301/) (Budzyń et al., The Lancet Gastroenterology & Hepatology, 2025)
- [Expert reaction to observational study looking at detection rate of precancerous growths in colonoscopies](https://www.sciencemediacentre.org/expert-reaction-to-observational-study-looking-at-detection-rate-of-precancerous-growths-in-colonoscopies-by-health-professionals-who-perform-them-before-and-after-the-routine-introduction-of-ai/) (Science Media Centre, 2025-08-12)
- [The Impact of Generative AI on Critical Thinking](https://dl.acm.org/doi/full/10.1145/3706598.3713778) (Lee et al., CHI 2025)
- [Foundations of Proactive Agents](https://harryoh99.github.io/foundations_of_proactive_agents/) (Oh et al., 2026, including Proactivity-Gym)
- [Explanations Can Reduce Overreliance on AI Systems During Decision-Making](https://dl.acm.org/doi/10.1145/3579605) (Vasconcelos et al., CSCW 2023)
- [Cognitive Offloading](https://samgilbert.net/pubs/Risko2016TiCS.pdf) (Risko and Gilbert, Trends in Cognitive Sciences, 2016)
- [Securing persistent agents like OpenClaw at OpenAI](https://developers.openai.com/blog/securing-persistent-agents-like-openclaw-at-openai) (OpenAI Developers)
