---
title: "Tailscale: Your Agent Lives at Home, You're Not Dialing Home"
date: 2026-08-21
category: tech
type: deep-dive
tags: [tailscale, self-hosted, ai-agent, zero-trust, networking, agent-security]
lang: en
series:
  name: "Technology Choices in the AI Era"
  order: 15
tldr: "Self-hosting an agent that runs 24/7 means opening something on your own network that must be reachable from outside and must never sit on the public internet. This post takes apart what each Tailscale mechanism actually solves: the tailnet for reachability, subnet routers for private resources, tags plus ACLs for the permission boundary, and seconds-fast policy propagation plus Tailnet Lock for revocation. Pricing checked 2026-08: Personal is free, up to 6 users, unlimited user devices, 50 tagged resources included."
description: "Tailscale from the angle of a self-hosted always-on agent: how the WireGuard data plane and Tailscale's own control plane divide the work, what subnet routers and exit nodes each solve, why a tag is the right identity for an agent box, and how to actually pull access back when something goes wrong."
draft: false
---

🌏 [中文版](/posts/tech/2026-08-21-tailscale-for-self-hosted-agents)

Self-hosting an agent that runs 24/7 means opening something on your own network that **must be reachable from outside and must never sit on the public internet**. You want to poke it from your phone. It wants to reach the database on your LAN. And it is, at the same time, a program that can be steered by prompt injection and that initiates network connections on its own.

[Tailscale](https://tailscale.com/) works at exactly that layer. It builds a private network across all your devices — Tailscale calls it a tailnet. Every machine gets a stable `100.x.x.x` address and talks to the others over encrypted peer-to-peer connections. No port forwarding, no public IP, no central VPN gateway. Once it's up, "connecting to the agent box at home from outside" and "connecting to it from the same room" are the same thing at the network layer. For a personal setup the price is zero; the details are in the pricing table at the end.

One boundary first. This site already has a post on [reaching your home Mac from outside](/posts/tech/2026-05-08-cloudflare-tunnel-mac-remote-2026-en), which compares Tailscale, Cloudflare Tunnel, ZeroTier, Pangolin and NetBird. That post's problem is "a **person** connecting back to a desktop at home." This post runs the other direction: **the thing lives inside**. It has to be callable from outside, it has to reach inward, and when something goes wrong you have to be able to pull access back. The head-to-head tool comparison is done over there; it isn't repeated here.

The gap is on the record. Before this post, 12 zh-TW posts on this site mentioned Tailscale, and nearly all of them in a self-hosted-agent context: [OpenClaw's Gateway networking](/posts/ai/2026-03-28-openclaw-gateway-network-en), [OpenClaw in the cloud](/posts/ai/2026-03-28-openclaw-install-cloud-en), [Hermes's security model](/posts/ai/2026-08-18-hermes-agent-security-en), [the self-hosted personal agent landscape](/posts/ai/2026-08-18-self-hosted-personal-agents-landscape-en). Apart from that Cloudflare Tunnel post, every mention was in passing. (Counted with both `grep -rlE "\bTailscale\b"` and `grep -rli tailscale`; the two methods agree.)

## WireGuard Is the Data Plane; the Control Plane Is Tailscale's Own

A common shorthand is "Tailscale is just WireGuard." That's inaccurate, and the inaccurate part is precisely where the product lives.

The [WireGuard](https://www.wireguard.com/) site is explicit about its own scope:

> All issues of key distribution and pushed configurations are out of scope of WireGuard; these are issues much better left for other layers.

WireGuard gives you an encrypted tunnel: two ends each hold the other's public key and can start exchanging packets. How those public keys reach each other, what IP the peer is on right now, how it reconnects after moving to a café Wi-Fi, who is allowed to join at all — WireGuard says outright that it doesn't handle any of it.

That's the layer Tailscale supplies. Per the official [How Tailscale works](https://tailscale.com/blog/how-tailscale-works), the data plane is WireGuard, specifically the userspace Go variant `wireguard-go`. The control plane is Tailscale's own coordination server at `login.tailscale.com`, which the post describes as "a shared drop box for public keys." Each node leaves its public key and current location there, downloads the public keys of the other nodes in the same tailnet, and configures WireGuard itself.

Three consequences matter directly for a self-hosted agent:

- **The private key never leaves the node.** The coordination server only handles public keys, so it cannot see the contents of your traffic.
- **The control plane is hub-and-spoke; the data plane is a mesh.** The central path carries only keys and policy. Actual traffic goes directly between two machines instead of detouring through a concentrator.
- **DERP relays cover the cases where NAT traversal fails.** On networks that block UDP, traffic falls back to Tailscale's DERP relay servers — which also hold no private keys and blindly forward already-encrypted packets.

Something to check tonight: run `tailscale status` on the agent box and look at whether the line for your phone says `direct` or `relay`. `relay` means NAT traversal failed and you're going through DERP, at a meaningful latency cost.

## Problem One: Reachable, but Not on the Public Internet

The first networking decision for a self-hosted agent is where its control interface binds. [The OpenClaw Gateway post](/posts/ai/2026-03-28-openclaw-gateway-network-en) covered the official stance: the Gateway binds to loopback by default, and binding to anything other than loopback forces authentication. A tailnet is what makes "bind to loopback" and "reachable from outside" stop being mutually exclusive — the service listens only on the local machine, and is exposed to tailnet devices via Tailscale's `100.x` address.

Tailscale has two features here with similar names and very different consequences:

| | Tailscale Serve | Tailscale Funnel |
|---|---|---|
| Who can reach it | Only devices in your tailnet | Anyone on the public internet |
| Identity headers | Adds `Tailscale-User-Login` and friends, and strips spoofed copies from incoming requests | None |
| Ports | Unrestricted | 443, 8443, 10000 only |
| Status | GA | Marked beta in the docs, with non-configurable bandwidth limits |

[Serve](https://tailscale.com/kb/1312/serve) gives you a `https://<machine>.<tailnet>.ts.net` URL with a Tailscale-issued certificate, reachable only from inside the tailnet. [Funnel](https://tailscale.com/kb/1223/funnel) pushes the same service out onto the public internet.

An agent's control interface belongs on Serve. Funnel's legitimate use is exposing a webhook endpoint for an external service to call, not hosting the agent's operator UI. Putting the UI on Funnel adds back exactly the public exposure you just avoided, and Funnel carries no identity headers, so the backend cannot tell who is calling. If you do use Funnel for a webhook, the docs recommend having the backend listen on localhost only; otherwise anyone off that machine can bypass Serve and send forged headers straight in.

## Problem Two: The Agent Needs Private Resources, and You Don't Want the Database on the Public Internet

Agents routinely need something that is *not* in the tailnet: the NAS at home, the company Postgres, a printer that can't run a client, an RDS instance inside a cloud VPC.

That's what a [subnet router](https://tailscale.com/kb/1019/subnets) solves — not an exit node. The two get conflated constantly, but they run in opposite directions:

- **Subnet router**: a machine running Tailscale that advertises the network segment behind it (say `192.168.1.0/24`). Devices in the tailnet can then reach those machines by their LAN IPs without Tailscale being installed on them at all. The docs put it plainly: `Managed service access—securely connect to cloud-managed services like Amazon RDS or Google Cloud SQL without exposing them to the public internet.` A practical bonus: devices behind a subnet router don't count toward your plan's device limit.
- **Exit node**: sends **all** of a device's outbound traffic (that is, the default routes `0.0.0.0/0` and `::/0`) out through another machine. It answers "which IP does my traffic appear from on the internet," not "how do I reach the LAN." It needs a separate permission: the docs note that allowing connections *to* the exit node machine (SSH, say) is not the same as allowing it to be used as a gateway, which requires a rule whose `dst` is `autogroup:internet`.

Both are useful for a self-hosted agent, for different things. A subnet router lets the agent read an internal database without that database going public. An exit node pins the agent's outbound traffic to a fixed egress; if you have services gated by IP allowlist, that's immediately practical.

What you can do tonight: enable IP forwarding on that Linux box, then run

```bash
sudo tailscale up --advertise-routes=192.168.1.0/24
```

Then approve the route on the Machines page of the admin console. Here's the spot that catches a lot of people, and the docs call it out specifically: **route approval and access rules are two separate mechanisms.** Approval only decides whether the route gets injected into other devices' routing tables; whether traffic is actually permitted is still up to the ACL. You need both.

Also note that subnet routers enable SNAT by default: traffic coming out from behind the router appears to originate from the router, not the original device. If you audit by source IP on the database side, that default will hide the real source from you.

## Problem Three: Where the Agent's Permission Boundary Is Written

This is the section worth the most of your time, and the one most often misread.

**The most important trap first: a freshly created tailnet is wide open.** The [ACL docs](https://tailscale.com/kb/1018/acls) say it flatly:

> When you first create your tailnet, the default tailnet policy file enables communication between all devices within the tailnet.

And "deny-by-default" only holds once you've actually written an `acls` section — the same passage goes on to say that in the absence of an `acls` section, Tailscale applies the default allow-all policy. So "I installed Tailscale, therefore I have a boundary" is wrong. You installed Tailscale, therefore that agent box can now reach every machine in your tailnet, laptop included.

First thing to do tonight: open the Access controls page of the admin console and check whether the `acls` section is still the default allow-all.

Writing the boundary down happens at two layers.

**Layer one is identity.** A [tag](https://tailscale.com/kb/1068/tags) is the identity used for non-user devices; the docs call tags "essentially service accounts." Tags are defined by their owners in the policy file's `tagOwners` section, and only a tag's owners can apply it to a device. Three properties affect agent deployments:

- Applying a tag **removes** the device's user identity, and vice versa. A machine is one or the other, never both.
- After you tag a device and re-authenticate it, that device's key expiry is disabled by default.
- A device with a tag identity **cannot** use Tailscale SSH to connect to a device with a user identity.

That third one is exactly the default boundary a self-hosted agent wants: the agent box can't SSH into your MacBook. So bring that always-on agent up with `--advertise-tags=tag:agent` rather than logging it in with your personal account. Logging it in as you means it inherits *your* identity, and every rule you've written against `autogroup:member` applies to it too.

**Layer two is rules.** The unit of an ACL is `src`, `dst`, and port, enforced by the local packet filter on each device. Per the docs, enforcement "happens on each device directly, without further involvement from Tailscale's coordination server." Note that Tailscale now steers people toward its next-generation syntax, grants. The same page says ACLs will be supported **indefinitely**, but that "ACLs will not receive any new features" — so write new policy in grants.

The rule set for an agent looks like this: you can reach `tag:agent`; `tag:agent` can reach the database box and nothing else. The free Personal plan includes 3 ACL groups, which is plenty for a personal deployment; Standard has 10 and Premium 300.

## Problem Four: How You Pull Access Back When Something Goes Wrong

Agent incidents don't look like ordinary service incidents. The agent may not be compromised at all — it may simply have read a document with hidden instructions and helpfully complied. So treat "pulling access back" as a routine operation, not a disaster-recovery procedure.

The good news is that Tailscale is fast at it. After you save a policy change, the docs say clients "respond to the new rules within seconds," and that this **terminates connections already established**. Revocation doesn't wait for a session to expire.

The bad news comes in three parts, all in the details.

**First, removing a device is not the same as revoking it.** The official [remove-a-device doc](https://tailscale.com/docs/features/access-control/device-management/how-to/remove) says a removed device immediately loses its connection to every resource in the tailnet. But the same passage continues: "If device approval is not enabled in your tailnet, the device can be added back to the tailnet without needing re-authorization by a tailnet admin." If that machine still holds valid credentials or an auth key, it can walk right back in. The same page has another easy-to-miss line: uninstalling the Tailscale client does not remove the device from the tailnet.

**Second, the key-expiry default that comes with tags cuts both ways.** The [key expiry doc](https://tailscale.com/docs/features/access-control/key-expiry) says new domains default to reauthentication every 180 days, configurable from 1 to 180. But tagged devices have expiry disabled by default — which is what you want (your agent won't drop offline at 3am waiting for a human to log in), at the cost that the machine never expires on its own and revocation is entirely manual. Which is why device approval has to be on.

**Third, the control plane belongs to someone else.** You are trusting Tailscale's coordination server not to quietly insert a node into your tailnet. To move that trust back into your own network, the official answer is [Tailnet Lock](https://tailscale.com/kb/1226/tailnet-lock). With it enabled, a new node's public key must be signed by a signing node you designated, and peers verify the signature before accepting a connection. The docs are refreshingly blunt about the point of it:

> With Tailnet Lock enabled, even if Tailscale were malicious or Tailscale infrastructure hacked, attackers can't send or receive traffic in your tailnet.

Know the cost first. You must designate at least two signing nodes, and initialization produces 10 disablement secrets, of which you need only one to disable it. Those secrets are displayed once, at initialization. The docs state that if you lose them and didn't leave one with Tailscale support, the tailnet cannot be recovered. It's also a TOFU model: you still have to trust the control plane the first time, and only afterward does the center of trust move onto your own nodes.

There's one more layer above the network: the model provider API key sitting on the agent box. [Aperture](https://tailscale.com/docs/aperture), which Tailscale shipped in 2026, is aimed at that. It's an AI gateway that keeps provider credentials inside the gateway; clients authenticate with their Tailscale identity, and the gateway calls upstream on their behalf. You get a session log and spending limits per request, and it can proxy MCP servers with identity-based access control. The official blog describes the problem it targets concretely:

> It gets copied into a local .env file for testing. Then into a CI pipeline. Then into a container. Then into an agent runtime so it can call a model or tool on its own.

Keep the proportions straight: checked 2026-08, the docs page marks Aperture as beta, while the earlier announcement post called it alpha. It's purchased separately from Tailscale plans. Worth knowing about, not yet "go do this."

## Pricing: Checked 2026-08

| Plan | Price | Users | ACL groups | Notes |
|---|---|---|---|---|
| Personal | $0 | up to 6 | 3 | Unlimited user devices, 50 tagged resources included, 1,000 ephemeral minutes/month |
| Standard | $8 per user/month | Per seat | 10 | Tailscale SSH on up to 5 hosts, SCIM |
| Premium | $18 per user/month | Per seat | 300 | Network flow logs, log streaming |
| Enterprise | Custom | Per seat | Custom | Pay by invoice, SLAs |

A few details that catch people, all from the FAQ on the official pricing page:

- Billing is by **seat**, not device. User devices are unlimited on every plan, but each plan includes 50 tagged resources, with additional ones at $1/month each. Your agent box, subnet router and exit node should all be tagged resources — so a personal deployment won't come close to that line, but the number is "50," not "unlimited."
- The Personal plan is explicitly **non-commercial only**. Signing up with a custom domain is treated as business use and automatically starts a trial; to stay on Personal you have to opt out of the trial in the admin console.
- Non-profits and educational institutions get a 50% discount, with documentation of the registered entity.

While we're here, a correction to an older number on this site: the Cloudflare Tunnel post above describes the free tier as "100 devices, 3 users," which was the old Personal plan. Per the 2026-08 pricing page, it is now up to 6 users with unlimited user devices.

## When Not to Use It

**It's a connectivity layer, not a sandbox.** Tailscale decides which machines can talk to which ports on which other machines. The agent still has a shell on that box, can read local files, and can make outbound HTTP calls. A network boundary does not stop any of that — that needs [isolated backends and tool permissions](/posts/ai/2026-08-18-hermes-agent-security-en). Treating a tailnet as evidence that "the agent is contained" is the single conclusion this post least wants you to draw.

**You can't accept a SaaS control plane, and Tailnet Lock costs too much for you.** That road is self-hosting [Headscale](https://github.com/juanfont/headscale) — everything in Tailscale is open source except the control server and the GUI clients for Windows and Apple platforms, and Headscale is exactly that missing control server. The Tailnet Lock docs list it as an alternative themselves, while noting plainly that it gives up the availability guarantees and low maintenance overhead of the SaaS model. Headscale is also narrow by design: it supports a single tailnet, aimed at self-hosters and small open-source organizations.

**You want to publish a service to the general public.** That's the Cloudflare Tunnel or reverse-proxy question, not the tailnet one.

**Your deployment spans a lot of platforms.** Parts of Funnel and Serve are limited by the sandbox on the App Store build of the macOS client — serving files and directories only works on the open source variants. Check those platform differences before you commit to a cross-device setup.

## Overall

The networking problem for a self-hosted always-on agent splits into four, and Tailscale has a concrete mechanism for each. Reachable without going public: the tailnet plus Serve. Reaching private resources: subnet routers. The permission boundary: tags plus ACLs/grants. Getting access back: seconds-fast policy propagation, device approval, and Tailnet Lock.

If you take one thing from this post: **a freshly created tailnet is wide open.** That agent box can reach your laptop right now. Go look at the Access controls page, and write an `acls` section that permits only the paths that should exist.

---

## References

- [Tailscale Pricing](https://tailscale.com/pricing) — seat-based billing, Personal plan allowances, tagged / ephemeral resource definitions (checked 2026-08)
- [How Tailscale works](https://tailscale.com/blog/how-tailscale-works) — WireGuard data plane, coordination server, NAT traversal and DERP
- [WireGuard](https://www.wireguard.com/) — cryptokey routing, and the statement that key distribution is out of scope
- [Manage permissions using ACLs — Tailscale Docs](https://tailscale.com/kb/1018/acls) — default allow-all, when deny-by-default actually holds, grants vs ACLs
- [Group devices with tags — Tailscale Docs](https://tailscale.com/kb/1068/tags) — tags as service accounts, tagOwners, tag and user identity being mutually exclusive
- [Subnet routers — Tailscale Docs](https://tailscale.com/kb/1019/subnets) — advertising and approving routes, SNAT, route approval vs access rules
- [Exit nodes — Tailscale Docs](https://tailscale.com/kb/1103/exit-nodes) — default routes, `autogroup:internet`, fail-close on expired connector keys
- [Tailscale Serve — Tailscale Docs](https://tailscale.com/kb/1312/serve) — tailnet-only exposure, identity headers and anti-spoofing
- [Tailscale Funnel — Tailscale Docs](https://tailscale.com/kb/1223/funnel) — public exposure, port limits, beta status and bandwidth caps
- [Tailnet Lock — Tailscale Docs](https://tailscale.com/kb/1226/tailnet-lock) — signing nodes, the TKA, disablement secrets and the TOFU model
- [Key expiry — Tailscale Docs](https://tailscale.com/docs/features/access-control/key-expiry) — the 180-day default, custom periods, behavior for tagged devices
- [Remove a device — Tailscale Docs](https://tailscale.com/docs/features/access-control/device-management/how-to/remove) — the conditions under which a removed device can rejoin itself
- [Tailscale SSH — Tailscale Docs](https://tailscale.com/docs/features/tailscale-ssh) — policy taking effect within seconds and cutting live connections, check mode
- [Aperture by Tailscale: More secure AI now available via self-serve](https://tailscale.com/blog/aperture-self-serve) — the description of key sprawl
- [Aperture — Tailscale Docs](https://tailscale.com/docs/aperture) — AI gateway, identity-based auth, MCP proxying and spend control
- [Headscale — GitHub](https://github.com/juanfont/headscale) — self-hosted control server, single-tailnet design scope
- [Reaching your home Mac from outside: Cloudflare Tunnel and the 2026 alternatives](/posts/tech/2026-05-08-cloudflare-tunnel-mac-remote-2026-en) — the opposite problem, plus the tool-by-tool comparison
- [OpenClaw Gateway networking](/posts/ai/2026-03-28-openclaw-gateway-network-en) — bind defaults, authentication requirements and recommended topologies
- [Hermes's agent security model](/posts/ai/2026-08-18-hermes-agent-security-en) — the tool-permission and isolation layer above the network
