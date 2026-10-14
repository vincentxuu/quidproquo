---
title: "How to Write a Bug Report That Earns the Full Reward: Quality Multipliers, a One-Page Template, and Expected Value"
date: 2026-10-14
category: tech
type: guide
tags:
  - bug-bounty
  - security
  - vulnerability-research
  - google
  - microsoft
  - meta
  - idor
lang: en
description: "Read Google's report-quality table (0.8x, 1x, 1.2x) and Microsoft's Hyper-V quality definitions, then use a one-page report template (labeled as my suggestion), a toy IDOR example, and made-up numbers to estimate expected value and decide how much time to spend."
tldr: "Google multiplies the reward by 0.8, 1 or 1.2 depending on report quality across seven dimensions, and only counts what you provided before triage; later additions usually do not change it. Write to a one-page template (title, summary, preconditions, steps, impact, fix suggestion), then estimate hourly expected value as probability x amount / hours. A bigger ceiling can still lose to a small payout once the odds are low enough. Every probability and hour count in this post is an assumption, not a statistic."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 11
---

> 🌏 [中文版](/posts/tech/2026-10-14-bug-bounty-zero-11-reports-and-expected-value)

This is part 11 of "Bug Bounty from Zero". The [previous post](/posts/tech/2026-10-14-bug-bounty-zero-10-ai-era-bounty-en) looked at how AI changes this field. This one comes back to two practical questions: once you find a bug, how do you write the report so it is not marked down? And is the whole thing worth your time?

By the end you should be able to write a report from a one-page template, and use your own assumptions to compute a rough expected value that tells you how many hours to commit.

One caveat first: programs differ in what they ask for, so **the program's own page always wins**. This post uses rules written on Google, Microsoft and Meta pages, plus my own suggestions. Suggestions are labeled as such.

## How reports are scored: Google's quality table

The [Google VRP rules page](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules) has a "Report quality" section. It says Google rewards quality because it helps triage, analysis and remediation, and that the final reward is adjusted by a factor of 0.8x, 1x or 1.2x. The panel decides quality at its sole discretion.

The page also says all the conditions below should be met to reach the Good or Exceptional tier. Here are the seven dimensions, with each cell condensed into plain words (original key phrases in parentheses):

| Dimension | Low (0.8x) | Good (1x) | Exceptional (1.2x) |
|---|---|---|---|
| Vulnerability description | Not present, incomplete or incorrect | Incomplete, but still correct | Effectively described |
| Attack preconditions | Not present, incomplete or incorrect | Incomplete, but still correct | Effectively described |
| Impact analysis | Not present, incomplete or incorrect; theoretical or speculative impact | Incomplete, but still correct | Effectively and succinctly described, with product-specific analysis; or impossible to analyze without attacking non-test users |
| Reproduction steps / PoC | Not present, incomplete or incorrect | Present, only minor inaccuracies | Present and complete, easy to understand and reproduce; automated PoC when possible |
| Target information (device, version, URLs) | Not present, incomplete or incorrect | Full target information provided when appropriate | Same as Good |
| Reproduction output (video, debugger, HTTP responses, etc.) | Not present, incomplete or incorrect | Present, but missing information | Effectively and succinctly shows the issue |
| Researcher responsiveness | Significant delays, incomplete or factually incorrect responses, non-technical discussion, "AI slop" | Best-effort responses (under 2 weeks) and/or lacking notable information | Fast (under 3 workdays), concise, technically precise |

A few things stand out:

- **Good allows "incomplete, but still correct."** But the words "incomplete" appear in both the Low and Good columns; Low also covers "not present" and "incorrect," and where exactly the line falls is the panel's call. What is clear is that wrong or missing content lands in the worst column.
- **Impact analysis is the easiest place to lose points.** The Low cell says "theoretical or speculative impact." If proving impact would require touching other people's data, the Exceptional column explicitly counts "impossible to analyze without attacking non-test users," so you never need to cross the line to write this section (scope is covered in [part 1](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope-en)).
- **Responsiveness is behavior after you submit,** not report content. Slow, empty or off-topic replies hit this row directly.
- The page also says the panel may disregard dimensions that do not apply or that a researcher cannot determine.

### Only pre-triage information counts

This is easy to miss. In the page's words, roughly: once a report is triaged (usually when a bug is filed with the product team), the security team starts remediation, and to keep things consistent and efficient, **only the information available before triage is considered when setting the reward. Later additions to the report usually will not affect the rating.**

In other words, your first submission is your report card. Sending a rough draft and planning to fill it in later usually does not work under Google's rules.

The rules page has two other items that touch on adding information later. One is the appeal: if you believe the reward decision does not align with the program rules, you can appeal within one month of the reward notification, and an appeal usually needs new information not discussed in the report to succeed. The other is the FAQ entry "What if I found a vulnerability, but I don't know how to exploit it?": reward amounts are decided on the maximum impact of the vulnerability, and the panel is willing to reconsider an amount based on new information (such as a chain of bugs or a revised attack scenario). That is the context of that one answer, not a guarantee for every report.

The rules page does not say whether the quality rating can be appealed. My understanding is that the quality rating looks at what you sent at submission, while whether the amount matches the rules can be appealed with new information. That distinction is mine, not something the page states, and how it plays out is up to the panel.

### Two concrete pieces of Google advice

Two pages in Google's Bug Hunters learning section seem the most useful for beginners:

- [Write down the attack scenario](https://bughunters.google.com/learn/improving-your-reports/how-to-report/write-down-the-attack-scenario): an attack scenario briefly states who wants to exploit the bug, for what gain, and in what way. The point is not to repeat the reproduction steps. The article notes that writing it sometimes reveals the impact is smaller than you thought, for example when the attacker would need a privilege level where the bug gains nothing new.
- [Create an exceptional automated PoC](https://bughunters.google.com/learn/improving-your-reports/how-to-report/create-an-exceptional-automated-poc): a good automated PoC is minimal, self-contained, documented, and lets the reviewer plug in their own cookies or credentials. It also says that if automation would not be useful (for example DOM-based XSS that needs a browser to run JavaScript), do not include one and explain why.

The rules page also says to be succinct: a short proof-of-concept link is more valuable than a video explaining the consequences of an XSS bug.

## Microsoft's approach: three quality levels, and Hyper-V asks the most

The [Microsoft Hyper-V Bounty Program page](https://www.microsoft.com/en-us/msrc/bounty-hyper-v) ties quality directly into the reward table, not as a multiplier but as different maximums. Part 0 already covered the L1 guest escape rows: a working exploit with a high-quality report is up to $250,000; without an exploit, high quality is up to $200,000, medium $100,000, low $50,000. The column header says Maximum Award.

The same page says a high-quality report gives an engineer what they need to quickly reproduce, understand and fix the issue. That typically means a concise write-up with background and a description of the bug, plus a proof of concept that **reproduces without relying on a debugger** for things like suspending threads or modifying memory or code.

MSRC also has a page of [example reports and quality definitions](https://www.microsoft.com/en-us/msrc/bounty-example-report-submission) that defines three levels clearly:

| Level | What it contains |
|---|---|
| Low | Enough information to reproduce, but no reliable PoC. Needs: vulnerability type, affected component (name, version), target environment (type, version), reproduction output, PoC |
| Medium | Low plus a reliable and minimized PoC |
| High | Medium plus a detailed and correct analysis, and reproduction without relying on a debugger |

That page includes one high-quality and one low-quality example. The high-quality one has a title, platform, class, summary, description, PoC, expected result and observed result, and suggests a fix direction. The low-quality one is mostly disassembly snippets and logs, and I did not see reproduction steps in it. Both are worth opening; seeing them teaches more than ten paragraphs of explanation.

The "Eligible submissions" section of the Hyper-V page additionally asks reports to include the impact and, if not obvious, the attack vector.

## A one-page template (my suggestion, not any program's rule)

The format below is my own arrangement based on the quality dimensions above. It is not an official requirement. Before submitting, check the target program's form and rules, and follow its fields if it has them.

| Field | What to write | Matching official dimension |
|---|---|---|
| Title | Bug type + which feature or endpoint + one-line consequence | Vulnerability description |
| Summary | Two or three sentences: what the bug is, where, worst case | Vulnerability description |
| Target information | Product name, version, URL, type of test account, date | Target information |
| Preconditions | Where the attacker starts (login needed? something from the victim?), whether the victim must do anything | Attack preconditions |
| Reproduction steps | Numbered steps, one action each; attach an automated script if you can | Reproduction steps / PoC |
| Expected vs actual | One line each, with a response snippet or screenshot | Reproduction output |
| Impact | What you actually proved and what you did not test; keep worst case and its conditions separate | Impact analysis |
| Fix suggestion | A sentence or two of direction; optional but helpful | No matching dimension (the MSRC example report includes one) |

Three habits while writing:

1. **One issue per report.** Meta's process also says one issue per report.
2. **Separate what you tested from what you infer.** Put "I confirmed X" and "I suspect Y" in different sentences, which also keeps you out of the "theoretical or speculative" bucket.
3. **Have someone follow your steps once.** A friend, a classmate, or yourself tomorrow. By Google's own description, your reader is a triaging security engineer, not you.

## A worked example: a report on the toy IDOR program from part 3

The target is the `demo.mjs` from [part 3](/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs-en), which binds only to `127.0.0.1`. It is not any real website. The report below is a format demonstration; the bug and the output come from that post.

```text
Title: Notes demo: GET /notes/{id} lacks an ownership check, any logged-in user can read other users' notes (IDOR)

Summary
The vulnerable server's /notes/{id} only checks that the requester is logged in,
not that the note belongs to the requester.
alice, using her own session, requests /notes/2 and receives bob's full note.

Target information
- Program: demo.mjs (the toy program from part 3 of this series, vulnerable instance)
- Environment: Node.js v22.22.0, server bound to 127.0.0.1 only
- Test accounts: alice (session=alice-token), bob (session=bob-token), both built-in fake data

Preconditions
- The attacker needs any valid login (alice here).
- Note ids are sequential integers (1, 2, 3); no guessing needed.
- The victim does not need to do anything.

Steps to reproduce
1. Save demo.mjs and run: node demo.mjs
2. Look at the "== IDOR" section of the output. The script requests /notes/2
   with alice's session.
   (Manual equivalent: GET /notes/2 with Cookie: session=alice-token)

Expected: 404 not found (id 2 belongs to bob; alice should not read it)
Actual:   200 Bob's bank memo

Impact
- Tested: any logged-in user can read the full text of any note by id. Because ids
  are sequential, all notes can be walked in order.
- Not tested: write, delete (this endpoint only implements reading).
- Depends on conditions: in a real system whose ids are not sequential, the attacker
  would first need the other person's id; this toy program does not cover that.

Fix suggestion
After loading the note, compare note.owner with the logged-in user and return 404
(the same response as "does not exist") on mismatch. The fixed version in the demo
does this; alice reading her own id=1 still works.

Attachment
Full demo.mjs output (recorded in part 3).
```

### Field by field against Google's quality table

This is a **self-assessment** to practice reading the criteria. Google's panel decides actual quality, and since this is a toy there is no real reward.

| Google dimension | How the example report maps | Column it aims for |
|---|---|---|
| Vulnerability description | Title and summary give type, endpoint and the missing check in two sentences | Exceptional: effectively described |
| Attack preconditions | The Preconditions field lists login required, sequential ids, no victim interaction | Exceptional: effectively described |
| Impact analysis | Split into "tested," "not tested," "depends on conditions"; no untested claims like "may leak all users' secrets" | Avoids Low's "theoretical or speculative" |
| Reproduction steps / PoC | Two steps, plus the script itself serves as an automated PoC | Exceptional: complete, with automated PoC |
| Target information | Program, Node version, bind address, accounts | Good and Exceptional ask the same |
| Reproduction output | One line each for expected and actual, response pasted directly | Exceptional: succinct and effective |
| Researcher responsiveness | Not in the report; counted after submission: reply within three workdays when asked | Exceptional: fast, concise, technically precise |

Look at the Impact field once more. If it said "This is extremely severe and may leak all users' confidential data" with nothing tested, that is exactly the theoretical or speculative impact in the Low column. Separating what was tested from what was not is the habit most worth copying from this example.

### How much is the quality multiplier worth?

Take Google's own example: an IDOR on a `*.google.com` domain that exfiltrates a user's saved address has a cell of $13,337 (T2, S2b). The multiplier only moves it between 0.8x and 1.2x:

- 0.8x: 13,337 × 0.8 = $10,669.6
- 1x: $13,337
- 1.2x: 13,337 × 1.2 = $16,004.4

The multiplication is mine, and the panel still sets the final amount. What matters is the scale: the gap between a good and a poor report is 1.5x (1.2 ÷ 0.8), far smaller than the gap caused by which cell the bug lands in. Take the column for normal Google applications (T2) on the rules page: XSS (C0) is $10,000, while the three IDOR-type cells are $3,133.7, $13,337 and $31,337, so IDOR's own lowest and highest cells differ by about 10x. So writing well collects the value that is already there; it does not turn a no-impact bug into a valuable one.

## Why reports get closed

Even a well-written report earns nothing if it does not belong in the program. The [Meta program scope page](https://bugbounty.meta.com/scope/) has a section "Conditions for closing reports as invalid" listing the main reasons:

1. The report describes a general software bug, not a security issue.
2. The report describes a missing feature or a feature suggestion.
3. The issue is out of scope, for example something outside Meta's control.
4. The scenario is social engineering or a spam attack.
5. The issue falls below the bar for a monetary reward.

The duplicate rule is on the same page: for duplicates, the bounty goes to the first person to submit, Meta decides what counts as a duplicate, and it is not obliged to share details of prior reports. There is one exception: if a later report shows the vulnerability still remains or is more serious than first judged, Meta may pay for it. Google's FAQ is blunter: "First in, best dressed". Only the first person to alert Google to a previously unknown flaw qualifies.

Two more details on Meta's page help beginners: amounts depend on factors including impact, ease of exploitation and report quality, and if a bounty is paid the minimum is $500; and "extremely low-risk issues may not qualify for a bounty at all."

Mapped back to reports: **first confirm scope and that it is a security issue, then worry about how well it is written.** Part 1 covers scope.

## Is it worth the time? An expected-value calculation with made-up numbers

Every probability and hour count in this section is **an assumption I invented** to demonstrate the arithmetic. They are not statistics and do not represent anyone's actual results. I did not find official or research figures for beginners (success rates, average payouts, beginner income), so I am not citing any, and you should not treat the numbers below as fact.

Expected value means: multiply each outcome's amount by its probability, then add them up. For one investment of effort, a rough form is:

> hourly expected value = probability × amount ÷ hours invested

The "probability" here must satisfy four things at once: you find a bug, it is in scope, it is accepted as a valid security issue, and nobody reported it first. The rules above map to the last three: scope, invalid reasons, duplicates. Multiplying four probabilities gives a number much smaller than any single one.

Two hypothetical scenarios:

| | Scenario A: small, common bug class | Scenario B: top-tier cell |
|---|---|---|
| Assumed amount | $500 | $100,000 |
| Assumed effort | 40 hours | 400 hours |
| Assumed probability (all four hold) | 10% | 0.2% |
| Expected value | 0.10 × 500 = $50 | 0.002 × 100,000 = $200 |
| Per hour | 50 ÷ 40 = $1.25 | 200 ÷ 400 = $0.50 |

What to read from the table:

- **A higher ceiling does not mean a higher expectation.** B's amount is 200 times A's, but its expected value is only 4 times, and per hour it is lower, because it takes 10 times the hours at 1/50 of the probability. Numbers in reward tables are ceilings: the Hyper-V column header says Maximum Award, and Google's cells are baselines with the final amount chosen by the panel.
- **Probability is the number you know least and the one that matters most.** Halve A's probability to 5% and the hourly expectation becomes $0.625. What you get is a range, not an answer.
- **The formula leaves out a lot:** skills learned, a public track record, and what your time is worth elsewhere. I deliberately do not convert these to money because I have no reliable way to.

### Turning it into a decision

My suggestion: do not treat this as an income source to calculate. Treat it first as a learning budget with a cap.

1. **Set an hour cap first.** For example 5 hours a week for 12 weeks, 60 hours total. This is what you are willing to pay for learning, not money you expect to earn back.
2. **Keep your own books.** For each attempt, write down the hours and what happened: judged a duplicate, invalid, out of scope, or nothing found. After three months you have ratios of your own, which will beat any number I could give you.
3. **Recompute with your own ratios.** Plug your records into the formula above. If the hourly expectation is far from what your time is worth, and the learning is not enough to make up for it, cut back.
4. **Skip cells that need a lot of prior skill and start with what you can do.** Part 0 showed that top payouts often depend on a working exploit and a high-quality report, a much higher bar than ordinary web bugs.

These points are my judgment, not any program's advice.

## What to do tonight

1. Open the Report quality table on the [Google VRP rules page](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules), compare it with the example report above, and mark the weakest row in red.
2. Open [MSRC's example report page](https://www.microsoft.com/en-us/msrc/bounty-example-report-submission) and list three differences between the high- and low-quality examples.
3. Run part 3's `demo.mjs` once, then use the template to write a report for the XSS section. Only the toy program, never a real site.
4. On a sheet of paper, write your own three assumptions (probability, amount, hours), compute the hourly expectation, and write down the total hours you plan to commit.

## Limits

- The rules here come from Google, Microsoft and Meta pages I read on 2026-10-14. Programs differ in forms, formats and scoring, and they change; use the page as it stands when you submit.
- Quality is each program's discretionary call. My field-by-field mapping is practice, not a prediction.
- The template is my suggestion. Apart from Microsoft asking for impact and (when not obvious) the attack vector, I did not find a program that mandates fixed fields.
- All probabilities and hours in the expected-value section are assumptions. I did not cite HackerOne or Bugcrowd annual reports because I did not find figures that map to beginners, and I did not want to lean on an unrelated sample.
- This post does not teach how to exploit bugs. Test scope and legal boundaries are in part 1.

Next is [certifications and a learning map](/posts/tech/2026-10-14-bug-bounty-zero-12-certifications-and-learning-map-en).

## References

- [Google and Alphabet VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules) (Report quality table, pre-triage information, appeals, reward examples, FAQ)
- [Google Bug Hunters: Write down the attack scenario](https://bughunters.google.com/learn/improving-your-reports/how-to-report/write-down-the-attack-scenario)
- [Google Bug Hunters: Create an exceptional automated PoC](https://bughunters.google.com/learn/improving-your-reports/how-to-report/create-an-exceptional-automated-poc)
- [Microsoft Hyper-V Bounty Program (MSRC)](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)
- [Example Report Submissions to the MSRC (quality definitions and examples)](https://www.microsoft.com/en-us/msrc/bounty-example-report-submission)
- [Meta Bug Bounty: Program scope](https://bugbounty.meta.com/scope/) (invalid-report reasons, duplicates, payout factors)
- In this series: [Part 0 Top payouts fact check](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check-en), [Part 1 Rules and scope](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope-en), [Part 3 XSS and IDOR](/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs-en), [Part 10 Bounties in the AI era](/posts/tech/2026-10-14-bug-bounty-zero-10-ai-era-bounty-en), [Part 12 Certifications and learning map](/posts/tech/2026-10-14-bug-bounty-zero-12-certifications-and-learning-map-en)
