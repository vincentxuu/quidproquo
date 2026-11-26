---
title: "Security Alert | Cairn's Autonomous AI Agents Found a Zero-Day in MONAI Label on Their Own, and CISA Added It to KEV (CVE-2026-133968)"
date: 2026-11-25
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "Amazon reports that a suspected China-nexus actor gave the open-source AI pentest framework Cairn a single goal, 'obtain shell access,' and its agents found a path traversal zero-day in MONAI Label, going from API mapping to arbitrary file write in about 11 minutes and then to root; CISA added CVE-2026-133968 to KEV on 11/23."
tldr: "Amazon Threat Intelligence says the attacker gave Cairn one goal, 'obtain shell access,' and its AI agents found a path traversal zero-day in the medical imaging annotation server MONAI Label by themselves: about 11 minutes from API mapping to arbitrary file write, then a root shell via sitecustomize.py. CISA has added CVE-2026-133968 to KEV. Versions up to 0.8.5 are affected; upgrade to 0.8.6, turn on authentication, and take servers off untrusted networks."
series:
  name: "AI Security Alert"
  order: 86
---

> :globe: [中文版](/posts/daily/2026-11-25-security-monai-label-cairn-zero-day-cisa-kev)

## Incident Overview

Amazon Threat Intelligence published its investigation on 2026-11-20. On September 10 it found a publicly hosted, unauthenticated Cairn server. Cairn is an open-source autonomous AI penetration-testing framework built for defenders' research: the user gives it a starting point and a goal in plain language, and it coordinates multiple AI agents to find a path. This server's operational history was open to anyone, so Amazon could see the project configurations, the attacker's prompts and the AI output. The operator wrote prompts in Simplified Chinese, the script timestamps were set to China Standard Time, and the campaign targeted IP addresses of universities in East Asia outside mainland China over roughly 48 hours starting September 8. The goals were variations of "obtain shell access." One target ran MONAI Label, an open-source medical-imaging AI annotation server. The agents identified its framework, mapped its API, and found an upload endpoint with a filename parameter that was vulnerable to path traversal. In about 11 minutes they went from API mapping to writing arbitrary files on the server. In a later session they wrote a Python reverse shell into `sitecustomize.py` and triggered a training API to spawn a new Python process, which gave a reverse shell running as root. Amazon assessed with high confidence that this was a zero-day and with moderate confidence that the actor is China-nexus. On 2026-11-23 CISA added the flaw ([CVE-2026-133968](https://www.cve.org/CVERecord?id=CVE-2026-133968)) to its Known Exploited Vulnerabilities (KEV) catalog, together with a second flaw in N-able Mail Assure.

**Key Facts**

| Field | Value |
|---|---|
| Incident type | Path traversal (CWE-22) leading to arbitrary file write and remote code execution, found and exploited by autonomous AI agents during a live intrusion |
| Scope | All MONAI Label versions up to and including 0.8.5 from Project MONAI. Authentication is off by default, so any client that can reach the server can exploit it without credentials; with authentication on, the `ANNOTATOR` role is still enough |
| Severity | Critical (rated critical in the GitHub advisory; The Hacker News cites CVSS 9.8) |
| CVE | [CVE-2026-133968](https://www.cve.org/CVERecord?id=CVE-2026-133968) (GHSA-qc22-rmgc-vg94) |
| Fix status | Fixed in 0.8.6 (released 2026-11-22) |
| Sources | [Amazon Security Blog](https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/), [CISA KEV alert](https://www.cisa.gov/news-events/alerts/2026/11/23/cisa-adds-two-known-exploited-vulnerabilities-catalog), [GitHub advisory](https://github.com/Project-MONAI/MONAILabel/security/advisories/GHSA-qc22-rmgc-vg94), [BleepingComputer](https://www.bleepingcomputer.com/news/security/hackers-use-autonomous-ai-tool-cairn-to-find-zero-day-take-over-server), [The Hacker News](https://thehackernews.com/2026/11/hackers-exploit-n-able-mailassure-flaw.html) |

## Attack Surface Analysis

The flaw itself is ordinary. According to the GitHub advisory, `PUT /datastore/image` takes a caller-controlled `image` query parameter and uses it as the image ID without validation. `LocalDatastore.add_image()` appends the file extension, joins the result onto the datastore directory, and writes the file with `shutil.copy()` without ever checking that the resolved path is still inside the datastore. `PUT /datastore/label` builds its destination the same way in `save_label()`. An uploader who puts a parent-directory sequence in the parameter can therefore write content anywhere the MONAI Label process can write. The advisory notes that arbitrary file write can become remote code execution, for example by overwriting application code or adding entries to `.ssh/authorized_keys` or cron. There are two root causes: file paths were never confined to the storage directory, and the default `MONAI_LABEL_AUTH_ENABLE=False` puts no authentication in front of the endpoints.

What is new is how the flaw was found. By Amazon's account, the agents identified the application framework, enumerated API endpoints, found the upload endpoint with a filename parameter, and tested it for path traversal, with no operator choosing each step. They then used the same flaw to write `sitecustomize.py` (a file Python imports automatically at interpreter startup) and triggered a training API so that a new Python process imported the payload and opened a reverse shell running as root. The operator stepped in once: after the zero-day was found, they gave the agents a proxy into a second university network. The server behind it ran the same vulnerable software, and Amazon infers the actor had used the zero-day to compromise it and set up the tunnel. The actor then told the agents to use it against other machines in that network. The failures are just as telling. Against an unauthenticated Redis instance the agents spent about 16 hours and 148 sequential actions, trying replication abuse, scripting-sandbox escape, config-file writes, memory corruption and Log4Shell, and all of it failed. Against a university GPU server they built a list of about 80 real usernames from public pages and tried more than 30,000 credential combinations, also without success. Amazon's conclusion is that the agents kept adapting for nearly a full day without human direction.

Mapping to the OWASP LLM Top 10: the victim is an ordinary web application and the flaw is not LLM-specific, so there is no single clean match. The attacker's use of autonomous agents is closest to **LLM06 Excessive Agency** seen from the offensive side: an AI agent given wide autonomy with no human checkpoint. For defenders, it means the time from a flaw becoming public to being exploited can shrink to minutes, which manual alert triage will not keep up with.

```diagram
title: Timeline from the attack campaign to CISA's KEV listing
desc: The attacker's Cairn agents hit university servers in early September and found the MONAI Label zero-day; the fix was merged in mid-October, the advisory and public report followed in mid-November, 0.8.6 shipped November 22, and CISA listed it in KEV on November 23.
caption: Compiled from Amazon, the GitHub advisory and CISA's alert; all dates are 2026.
step: 9/8-9/10: the Cairn agents' campaign against East Asian universities runs about 48 hours; the MONAI Label zero-day is found and used
step: 10/19: the fix (PR #1915) is merged into MONAI Label's main branch
step: 11/18: GitHub advisory GHSA-qc22-rmgc-vg94 is published, rated critical
step: 11/20: Amazon publishes its investigation and media coverage follows
step: 11/22: MONAI Label 0.8.6 is released, fixing CVE-2026-133968
step: 11/23: CISA adds CVE-2026-133968 to KEV
---
<svg viewBox="0 0 640 596">
  <path class="dg-line" d="M320 88V128" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M320 188V228" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M320 288V328" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M320 388V428" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M320 488V528" marker-end="url(#arrow-accent)" data-step="5"/>

  <g data-step="1">
    <rect class="dg-box" x="170" y="32" width="300" height="56" rx="6"/>
    <text class="dg-label" x="320" y="51" text-anchor="middle" dominant-baseline="central">9/8-9/10  Attack campaign</text>
    <text class="dg-sub" x="320" y="71" text-anchor="middle" dominant-baseline="central">Agents run about 48 hours, find the 0-day</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="190" y="132" width="260" height="56" rx="6"/>
    <text class="dg-label" x="320" y="151" text-anchor="middle" dominant-baseline="central">10/19  Fix merged</text>
    <text class="dg-sub" x="320" y="171" text-anchor="middle" dominant-baseline="central">PR #1915 on main, no release yet</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="180" y="232" width="280" height="56" rx="6"/>
    <text class="dg-label" x="320" y="251" text-anchor="middle" dominant-baseline="central">11/18  Advisory published</text>
    <text class="dg-sub" x="320" y="271" text-anchor="middle" dominant-baseline="central">GHSA-qc22-rmgc-vg94, critical</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="190" y="332" width="260" height="56" rx="6"/>
    <text class="dg-label" x="320" y="351" text-anchor="middle" dominant-baseline="central">11/20  Amazon report</text>
    <text class="dg-sub" x="320" y="371" text-anchor="middle" dominant-baseline="central">Media coverage same day</text>
  </g>

  <g data-step="5">
    <rect class="dg-box" x="170" y="432" width="300" height="56" rx="6"/>
    <text class="dg-label" x="320" y="451" text-anchor="middle" dominant-baseline="central">11/22  0.8.6 released</text>
    <text class="dg-sub" x="320" y="471" text-anchor="middle" dominant-baseline="central">Fixes CVE-2026-133968</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--accent" x="170" y="532" width="300" height="56" rx="6"/>
    <text class="dg-label" x="320" y="551" text-anchor="middle" dominant-baseline="central">11/23  CISA lists it in KEV</text>
    <text class="dg-sub" x="320" y="571" text-anchor="middle" dominant-baseline="central">Federal deadline: 11/26</text>
  </g>
</svg>
```

## Defense Strategies

**Immediate Actions**
- Inventory who is running MONAI Label, including research teams' own GPU hosts and cloud accounts, which are often missing from central IT's asset list. Upgrade anything at 0.8.5 or earlier: `pip install -U monailabel==0.8.6` (or the matching Docker image)
- Assume exposure before you upgrade: the 0.8.6 release notes advise that if a 0.8.5 or older server was reachable from an untrusted network, you should review it for unexpected file changes before returning it to service. Upgrading does not remove an attacker who is already on the host
- Whatever the version, apply the advisory's three mitigations: set `MONAI_LABEL_AUTH_ENABLE=True` and give the `ANNOTATOR` role only to trusted users, do not expose the server to untrusted networks, and run it as an unprivileged user whose write access is limited to the datastore
- Search logs for `PUT` requests to `/datastore/image` or `/datastore/label` whose `image` parameter contains `../`, encoded traversal sequences or absolute paths, and check `sitecustomize.py`, `usercustomize.py` and any `.pth` files in site-packages for unexpected changes. Amazon also published two source IPs seen between 9/8 and 9/10, `142[.]4.98.145` and `142[.]4.107.34`, which you can search for in historical logs

**Long-Term Architecture**
- Bring research AI services (annotation servers, notebooks, model-serving endpoints, vector databases) under the same inventory and vulnerability scanning as production systems, and require authentication by default rather than leaving them open because they are "only for research"
- Run services as a non-root user, keep application and Python paths read-only where possible, and add integrity monitoring for interpreter startup files, so that an arbitrary-file-write bug cannot land in a location that gets loaded automatically
- Shorten the time from detection to response: Amazon recommends prioritizing high-confidence detections that trigger automated response, with humans overseeing outcomes instead of reviewing every action. Vendors in watchlist B7 that focus on agentic AI security (for example Noma Security) can help inventory agent-related assets
- Track security fixes in your open-source dependencies at the commit level, not only at release level: this fix was merged on 10/19 but no installable version existed until 11/22, a gap of more than a month

## Impact

The confirmed victims are university research servers, and public reporting does not mention clinical systems or patient data being affected. The affected organizations were not AWS customers and AWS had no direct way to notify them, so it worked with a government partner to do so. There is no public count of how many MONAI Label instances are exposed to the internet. CISA's KEV listing means there is evidence of real-world exploitation; according to The Hacker News, Federal Civilian Executive Branch agencies are told to apply fixes by 2026-11-26.

The fix timeline deserves attention: the fix was merged on 10/19, the advisory appeared on 11/18, and 0.8.6 shipped on 11/22. For that stretch, the fixing code and the advisory were public while the versions a package manager would fetch did not contain the fix. If your agent or research infrastructure has unauthenticated internal services, the lesson here is that an attacking agent does not need to know about a vulnerability in advance; given one unauthenticated endpoint, it will probe until something gives.

## Today's Takeaway

I assumed that "AI autonomously finding a zero-day" would show up first against big vendors and complex software. This incident shows the first hit landing on a small research tool with authentication off by default and no path confinement, and the agent needed only about 11 minutes. What changed is not how hard bugs are to find but what finding them costs: compute. Even with a modest per-target success rate, a long enough target list pays off. Defenders do not first need fancier detection; they need to pull these default-open research services back to basic authentication and least privilege.

## References

- [Chinese-nexus actor's Cairn AI agents found a zero-day on their own — Amazon Security Blog](https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/)
- [CISA Adds Two Known Exploited Vulnerabilities to Catalog — CISA](https://www.cisa.gov/news-events/alerts/2026/11/23/cisa-adds-two-known-exploited-vulnerabilities-catalog)
- [Path traversal in datastore upload endpoints allows arbitrary file write (GHSA-qc22-rmgc-vg94) — Project MONAI / MONAILabel](https://github.com/Project-MONAI/MONAILabel/security/advisories/GHSA-qc22-rmgc-vg94)
- [MONAI Label 0.8.6 Release Notes — GitHub](https://github.com/Project-MONAI/MONAILabel/releases/tag/0.8.6)
- [CVE Record: CVE-2026-133968 — CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-133968)
- [Hackers use autonomous AI tool Cairn to find zero-day, take over server — BleepingComputer](https://www.bleepingcomputer.com/news/security/hackers-use-autonomous-ai-tool-cairn-to-find-zero-day-take-over-server)
- [Hackers Exploit N-able MailAssure Flaw While AI Agents Exploit MONAI Label Zero-Day — The Hacker News](https://thehackernews.com/2026/11/hackers-exploit-n-able-mailassure-flaw.html)
- [MONAI Label Zero-Day: AI Agents Exploit Medical Imaging Research Servers — Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-monai-label-agent-discovered-zero-day-2026)
