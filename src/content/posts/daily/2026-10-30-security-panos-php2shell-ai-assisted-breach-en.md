---
title: "AI Security Alert: PHP2Shell chained with Fragnesia roots 25 PAN-OS firewalls — the exploit chain itself was built with AI assistance, three US government servers breached"
date: 2026-10-30
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "Security firm Dream uncovered a suspected China-nexus campaign that chained two known bugs — PHP2Shell and Fragnesia — into a single unauthenticated request that roots PAN-OS firewalls, breaching 25 servers including three inside a US government-affiliated network; artifacts point to Claude Code and a DeepSeek/Kimi-backed attack platform being used to build the exploit chain itself."
tldr: "Dream researchers found an attack operation on October 25 that chains PHP2Shell (CVE-2026-109618/109619) with a Linux kernel bug called Fragnesia (CVE-2026-46300) into one unauthenticated HTTP request, rooting PAN-OS firewalls in under 15 minutes. The campaign hit 25 servers across the US, Japan, Taiwan and South Korea, with three inside a US government-affiliated environment where the attacker pivoted into Active Directory. Installed Claude Code, an attack platform called aiscan wired to Chinese LLMs DeepSeek and Kimi, and consistent code style across ~40 scripts all point to AI-assisted development of the exploit chain itself. Palo Alto Networks' Unit 42 independently verified the findings and is shipping fixes per branch; the immediate action is pulling management interfaces off the public internet and patching on the published schedule."
series:
  name: "AI Security Alert"
  order: 67
---

> 🌏 [中文版](/posts/daily/2026-10-30-security-panos-php2shell-ai-assisted-breach)

## What happened

Security firm Dream published findings on October 25 from proactive threat hunting that uncovered a complete attack operation — exploit scripts, target lists, exploitation logs, and roughly 40 custom post-exploitation scripts — attributed to a suspected China-nexus actor. The attacker chained two known vulnerabilities, PHP's PHP2Shell (CVE-2026-109618/CVE-2026-109619) and a Linux kernel bug called Fragnesia (CVE-2026-46300), into a single unauthenticated HTTPS request that roots an internet-exposed PAN-OS firewall's management interface in under 15 minutes. After a global scan, the campaign targeted the US, Japan, Taiwan and South Korea, rooting 25 servers in total — three of them inside a US government-affiliated environment, where the attacker pivoted into the internal Active Directory domain, attempting to decrypt service-account credentials and spray passwords. Artifacts at the scene — an installed copy of Claude Code, an attack platform called aiscan configured with the Chinese LLMs DeepSeek and Kimi, and highly consistent coding style across nearly 40 scripts — point to AI-assisted development of the exploit chain itself. Palo Alto Networks' Unit 42 independently verified Dream's findings, confirmed the affected products, and is rolling out fixes across branches.

**Key facts**

| Item | Detail |
|---|---|
| Incident type | PHP memory-corruption RCE chained with a Linux kernel privilege-escalation bug; the exploit chain's development appears AI-assisted |
| Scope | All supported PAN-OS (10.2/11.1/11.2/12.1/12.2) and Panorama management interfaces; 25 servers confirmed rooted, with roughly 19,000 internet-exposed management interfaces already fingerprinted by the attacker |
| Severity | Critical (CVE-2026-109618/109619: CVSS 9.2; CVE-2026-46300: CVSS 7.8) |
| CVE | CVE-2026-109618, CVE-2026-109619 (PHP2Shell), CVE-2026-46300 (Fragnesia, Linux kernel XFRM ESP-in-TCP) |
| Sources | [Dream Research](https://dreamgroup.com/blog/chained-php2shell-exploit-roots-25-servers), [The Hacker News](https://thehackernews.com/2026/10/php2shell-attack-roots-25-servers.html), [Palo Alto Networks Unit 42 threat brief](https://unit42.paloaltonetworks.com/cve-2026-109618-cve-2026-109619/), [Palo Alto Networks advisory CVE-2026-109618](https://security.paloaltonetworks.com/CVE-2026-109618) |

## Attack surface analysis

The chain runs in two stages. PHP2Shell abuses a control-flow flaw in how PHP handles out-of-memory errors via `longjmp()`: the attacker first floods the PAN-OS management web server (appweb, running PHP 8.0.30) with crafted multipart POST requests carrying oversized filenames, pushing the memory allocator toward a predictable layout. A second request forges a stale session-ID length to trigger an out-of-bounds read, leaking the base address of `libphp.so` through the `Set-Cookie` response header. Another round of memory pressure turns `http_session_vars` into a live `zend_reference` and leaves a stale reference behind; the final request forges a PHP HashTable entry inside that freed memory whose destructor callback (`pDestructor`) points to `zif_system`, so when PHP runs its cleanup handler it executes an attacker-chosen shell command as the `nobody` user. The second stage, Fragnesia, abuses the Linux kernel's XFRM ESP-in-TCP subsystem to perform a page-cache write that overwrites the 774-byte `/etc/pam.d/su` file with `pam_permit.so` (accept everything), after which `su root` succeeds without a password. Both stages run inside a single HTTP request, taking the attacker from an unauthenticated connection to a persistent root webshell in under 15 minutes.

The engineering behind this was substantial. The recovered artifacts include 11 memory-offset profiles calibrated for different PAN-OS versions — complete with `libphp.so` SHA256 hashes, ELF build IDs, and heap-spray geometry parameters — covering 9 exploitable versions, one of which had been fully validated against a live VM. For reconnaissance, the attacker used the Chinese internet-asset search engine FOFA to find roughly 19,000 internet-exposed management interfaces, narrowed that to 5,000 live devices via version fingerprinting, then filtered by geography and version to 240 targets. An automated batch runner with five-way concurrency and a 30-minute timeout per target rooted 24 firewalls in the first pass. Two of those belonged to a US government-affiliated organization (identified by CAC-authentication config and government-style naming conventions); the attacker ran a dedicated campaign against the second one, then built a reboot-surviving reverse SSH tunnel back into the internal network, used the same exploit chain to compromise a central firewall-management server, decrypted the LDAP service-account password from it, enumerated the entire domain, and — since the domain had no account-lockout threshold (`lockoutThreshold=0`) — sprayed passwords against every account and attempted to create backdoor accounts.

What's worth recording here is *how* the chain was built: the scene included an installed copy of Claude Code, an AI attack platform called aiscan configured with the Chinese LLMs DeepSeek and Kimi, API keys for the Chinese reconnaissance platform FOFA, and Chinese-language prompts inside aiscan's session logs. Dream is explicit that it has no direct evidence the AI tools were used to write the exploit or post-exploitation scripts themselves — but the consistent code structure and commenting style across nearly 40 scripts points to AI-assisted development rather than each script being written independently by hand. Mapped to the OWASP LLM Top 10, this incident is unusual in that it isn't really about attacking an AI system — it's about **AI being used as part of the attacker's own tooling**, the pattern security researchers have started calling "living off the AI land": the attacker doesn't need to bypass a model's safety guardrails, just use an AI coding assistant to accelerate development of a conventional infrastructure exploit.

```diagram
title: PHP2Shell + Fragnesia exploit chain
desc: RCE and kernel privilege escalation complete in a single HTTP request, then a reverse tunnel reaches the internal Active Directory
---
<svg viewBox="0 0 640 460">
  <path class="dg-line" d="M320 76V100" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 156V180" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 236V260" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M320 316V340" marker-end="url(#arrow-accent)"/>
  <path class="dg-line dg-line--accent" d="M320 396V420" marker-end="url(#arrow-accent)"/>

  <rect class="dg-box" x="120" y="20" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="39" text-anchor="middle" dominant-baseline="central">A1 memory exhaustion (~383MB) + B1 leak libphp.so address</text>
  <text class="dg-sub" x="320" y="59" text-anchor="middle" dominant-baseline="central">PHP2Shell stage one</text>

  <rect class="dg-box" x="120" y="100" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="128" text-anchor="middle" dominant-baseline="central">A2 stale reference setup + B2 forge HashTable destructor</text>

  <rect class="dg-box dg-box--warn" x="120" y="180" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="199" text-anchor="middle" dominant-baseline="central">Arbitrary command execution as nobody</text>
  <text class="dg-sub" x="320" y="219" text-anchor="middle" dominant-baseline="central">Completed inside one HTTP request</text>

  <rect class="dg-box" x="120" y="260" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="288" text-anchor="middle" dominant-baseline="central">Fragnesia: page-cache overwrite of /etc/pam.d/su</text>

  <rect class="dg-box dg-box--warn" x="120" y="340" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="368" text-anchor="middle" dominant-baseline="central">Passwordless su root succeeds, persistent root webshell in under 15 minutes</text>

  <rect class="dg-box" x="120" y="420" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="439" text-anchor="middle" dominant-baseline="central">Reverse SSH tunnel inward → central management server → decrypt LDAP service credentials</text>
</svg>
```

## Defense

**Immediate actions**
- Confirm the firewall management interface (appweb / the surface fronting the GlobalProtect portal) is **not reachable from the internet at all** — restrict it to a trusted internal network or a single jump box; both Dream and Palo Alto emphasize this as the first line of defense
- Check your current PAN-OS/Panorama version with `show system info` against the per-branch patch schedule in [CVE-2026-109618](https://security.paloaltonetworks.com/CVE-2026-109618) and schedule the update as soon as the fix for your branch ships
- If you can't patch immediately, enable TLS decryption on management-interface traffic so existing detection rules can see it, and match against Unit 42's published hunting queries (suspicious process chains spawned from the PHP worker, credential access, reverse-shell indicators)
- If exposure is suspected, don't limit the check to the firewall itself: also verify whether Active Directory LDAP service-account credentials need rotating and whether the account-lockout threshold is set to a non-zero value (this domain had none, which let the password-spray run unlimited attempts)

**Longer-term architecture**
- Management-interface-type services should default to not-internet-facing; run an asset-inventory pass before going live to catch accidental exposure — a single FOFA scan found 19,000 exposed targets in this one product line alone, which gives a sense of the scale of the attack surface a single vendor's single product can represent
- Set `lockoutThreshold` to a non-zero value domain-wide, and periodically audit loosely-defaulted settings like `MachineAccountQuota` so that a privilege-escalation foothold doesn't translate directly into unrestricted password spraying or backdoor account creation
- Treat unusual installs and call patterns of internal AI coding tools (like Claude Code) or AI attack platforms as potential indicators of compromise in their own right; if you already run something like WitnessAI for enterprise agent traffic visibility, consider adding "an AI coding agent appearing in an unexpected environment" as an alert condition rather than relying only on traditional IOCs
- This incident is another data point for how fast the window between disclosure and weaponization is shrinking — the PHP fix shipped October 21, and a custom exploit was already observed in active use by October 23. Patch cadence needs to keep pace with that, not run on a monthly schedule

## Impact

Twenty-five PAN-OS-related servers are confirmed breached: 22 firewalls remain "parked" with an active webshell but no further action taken, while three sit inside a US government-affiliated environment where the attacker pivoted into Active Directory. Dream says the available artifacts can't confirm whether the password spray succeeded, whether backdoor accounts were created, or whether SAML signing keys were extracted from the Keycloak IdP — meaning the actual depth of compromise could be greater than what's confirmed. The attacker still holds roughly 19,000 fingerprinted potential targets and an apparently still-active reverse tunnel, and Palo Alto Networks' device telemetry shows continued exploitation attempts against exposed PAN-OS devices. For anyone running agentic systems, the takeaway cuts two ways: traditional infrastructure (a firewall's management interface) remains a primary entry point for nation-state actors, and patch discipline there can't slip just because attention has shifted to the application layer of AI systems; at the same time, attackers using AI coding tools to accelerate exploit-chain development is going to become more common, and threat modeling should treat "did the adversary use AI assistance" as a variable that changes attack speed and scale, not just a piece of trivia.

## Today's takeaway

I'd been assuming "AI security incidents" fell into two buckets — AI systems getting attacked (prompt injection, MCP vulnerabilities) or AI systems being weaponized for malicious ends (agentic ransomware). This incident is a third kind: AI used in the dull, engineering-heavy work of building a conventional exploit chain, letting a single attacker calibrate reliable memory exploits across 9 different software versions and produce nearly 40 stylistically consistent post-exploitation scripts. It's a reminder that threat assessment shouldn't just ask "is the target AI" — an attacker's development speed being amplified by AI is itself something the risk model needs to account for.

## References

- [Dream Research — Chained PHP2Shell Exploit Roots 25 Servers, including US Government Servers](https://dreamgroup.com/blog/chained-php2shell-exploit-roots-25-servers)
- [The Hacker News — PHP2Shell Attack Roots 25 Servers, Breaches U.S. Government-Affiliated Network](https://thehackernews.com/2026/10/php2shell-attack-roots-25-servers.html)
- [Palo Alto Networks Unit 42 — Threat Brief: Critical Vulnerabilities in PHP: CVE-2026-109618, CVE-2026-109619](https://unit42.paloaltonetworks.com/cve-2026-109618-cve-2026-109619/)
- [Palo Alto Networks advisory — CVE-2026-109618 Impact of Critical Vulnerabilities in PHP on Palo Alto Networks Products](https://security.paloaltonetworks.com/CVE-2026-109618)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
