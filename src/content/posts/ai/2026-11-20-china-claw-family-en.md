---
title: "China's Claw Family: Wrapping OpenClaw Into Products, and Why Deeper Wrapping Means a Bigger Attack Surface"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, openclaw, china, ai-security]
lang: en
tldr: "In March 2026, \"raising lobsters\" went viral in China: big tech companies lined people up to install OpenClaw, then launched their own packaged versions. There are two ways of wrapping it: cloud hosting (Kimi Claw, Volcano Engine's ArkClaw, MiniMax's MaxClaw) and one-click local apps (Tencent's QClaw, Zhipu's AutoClaw), both tied into messaging apps like WeChat, Feishu and DingTalk. An evaluation by Xidian University and China Unicom tested the original and five wrapped versions with 205 attack cases: attack success rates ranged from about 16% for MaxClaw and 19% for the original to about 55% for QClaw. The same model in different wrappers carried different risks. QClaw has announced it will shut down on December 24, the first product in this category to close."
description: "How China's \"raising lobsters\" craze started, the two ways OpenClaw gets wrapped (cloud hosting and one-click installers), what Kimi Claw, ArkClaw, MaxClaw, QClaw and AutoClaw each are, a security evaluation of six Claw systems, regulators' risk warnings, how QClaw's shutdown unfolded, and how to tell hosted OpenClaw, wrapped apps and vendors' own agents apart."
series:
  name: "Always-On AI Agents"
  order: 15
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-china-claw-family)

| Wrapping | Where it runs | Examples | What you're responsible for |
|---|---|---|---|
| Cloud hosting | The vendor's cloud sandbox | Kimi Claw, ArkClaw, MaxClaw | Paying the subscription, managing the accounts you connect |
| One-click local app | Your computer | QClaw, AutoClaw | Keeping the computer on; the app has high local privileges |
| Messaging-app integration | Both of the above | WeChat, Feishu, DingTalk, WeCom | Who can give it commands in a chat |

According to [The Beijing News](https://www.bjnews.com.cn/detail/1773055598129368.html) (in Chinese), on March 6 nearly a thousand people lined up on the north plaza of Tencent's Shenzhen headquarters, waiting for engineers to help them install an open-source AI tool called OpenClaw. Tencent Cloud sent 20 engineers, who worked from morning to night.

OpenClaw's icon is a red lobster, so Chinese internet users called installing and using it "raising lobsters." The craze spawned a whole industry: in-home installation was quoted at 299 to 800 yuan, and mini PCs were stamped with lobster logos and sold as "all-in-one" machines.

A [Beijing Youth Daily report](https://bjqn-app.bjd.com.cn/content/s69b83ec9e4b0cd719e9f173d.html) (in Chinese) a few days later was stranger still: some people saw no value after installing it and deleted it overnight. Then "lobster uninstall services" appeared, with the same sellers charging first to install and then to uninstall.

This post is about China's Claw family: how wrapping OpenClaw brought always-on agents to the mass market, and what the deeper wrapping costs.

## Why wrap it

OpenClaw itself is free, but you have to install Node.js, get a model API key and set permissions yourself, which is a barrier for most people. As [the previous post](/posts/ai/2026-11-20-self-hosted-always-on-agents-en) covered, self-hosting means handling the machine, the patches and the defaults yourself.

Vendors saw something else: always-on agents burn tokens. [National Business Daily, citing Huaxi Securities](https://www.nbd.com.cn/articles/2026-03-10/4287155.html) (in Chinese), reported that in the week of February 23 to March 1, OpenClaw accounted for 2.26T of OpenRouter's 2.39T total tokens. Whoever lowers the deployment barrier and brings users into its own models and cloud captures that traffic.

So on a single day, March 9, ByteDance, Tencent and Moonshot AI all announced Claw-related products.

## Two ways of wrapping

### Cloud hosting: the vendor runs it for you

- **Kimi Claw** (Moonshot AI): [the help center](https://www.kimi.com/en/help/kimi-claw/overview) says you can deploy an OpenClaw in the cloud with one click at kimi.com/bot. The model and web search are configured automatically, with no server to buy and no command line. It connects to Feishu, WeCom, Weibo and other platforms. A deployed cloud host [deducts about 0.6% of membership credits a day](https://www.kimi.com/en/help/membership/membership-pricing), even when no tasks are running; if you're not using it, save your memory and workspace files, then delete the host.
- **ArkClaw** (ByteDance's Volcano Engine): a cloud SaaS version of OpenClaw launched March 9, usable straight from a web page and deeply integrated with Feishu.
- **MaxClaw** (MiniMax): [the international page](https://agent.minimax.io/activity/max-claw) says it deploys in 10 seconds with one click, no server, Docker or API key needed. It runs MiniMax's own model, costs $19 a month, and connects to Telegram, Discord and Slack.

### One-click local apps: running on your computer

- **QClaw** (Tencent's PC Manager team): built around controlling your computer from WeChat. Messages go from WeChat through Tencent's gateway to the QClaw client on your computer, which hands them to the OpenClaw Gateway to execute.
- **AutoClaw** (Zhipu, Chinese name "Aolong"): Zhipu [calls it](https://autoclaw.zhipuai.cn/blog/news/autoclaw-product-introduction/) (in Chinese) "China's first one-click-install local version of OpenClaw." It installs in about a minute, comes with 50-plus preset skills, connects to Feishu, and emphasizes that data stays local.

Tencent also has WorkBuddy, [launched the same day, March 9](https://www.nbd.com.cn/articles/2026-03-10/4287155.html), which is compatible with OpenClaw skills and aimed at office work.

Both wrappings tie the agent into messaging apps. The upside is there's no new interface to learn; you assign work in the chats you already use. The cost is that a single chat account becomes an entry point that can command your computer or cloud host.

## Security evaluation: attack success rates for six Claw systems

In April, researchers from Xidian University and China Unicom published [a systematic evaluation](https://arxiv.org/abs/2604.03131) of the original OpenClaw and five wrapped versions. Rather than checking whether a model refuses in a standalone chat, they tested whether the whole system could be broken once tools, multi-step planning, local execution and state persistence were attached.

The test set had 205 cases covering 13 categories of attack behavior, based on MITRE ATT&CK: from reconnaissance and initial access to credential theft, lateral movement and data exfiltration. [A summary by secrss](https://www.secrss.com/articles/89363) (in Chinese) lists each system's overall attack success rate:

| System | Wrapping | Attack success rate | Most prominent weakness |
|---|---|---|---|
| QClaw | Local app, WeChat remote control | 54.85% | Credential access 85.71%, data exfiltration 80% |
| AutoClaw | Local app | 49.51% | Planning stage led astray (70%) |
| Kimi Claw | Cloud, web bridge | 40.78% | Pushes attacks all the way to lateral movement |
| ArkClaw | Cloud SaaS | 29.61% | State persisting after execution gets exploited |
| OpenClaw (original) | Self-hosted | 19.42% | Reconnaissance 71.43%, discovery 55.17% |
| MaxClaw | Cloud | 16.02% | Reconnaissance and discovery still loose |

Several key findings:

- **None of the systems can be called safe.** The differences are only in how large the exposure is and where the risk concentrates.
- **The most common weaknesses are at the very start.** Reconnaissance and discovery averaged over 65% success. They look like normal diagnostics and troubleshooting, so systems struggle to stop them early; once an attacker has environment information, later steps get easier.
- **The same model in a different wrapper carries different risk.** With the Kimi K2.5 model, the original OpenClaw's reconnaissance rate rose to 85.71%; the same Kimi K2.5 inside Kimi Claw was more likely to push through to lateral movement. The paper concludes that an agent's security isn't determined by the model alone, but by model capability, tool permissions, multi-step planning and the runtime together.

The evaluation tested this spring's versions, and every product has been updated since; it's one evaluation, not long-term tracking. But the structure it points to is clear: the closer the entry point is to everyday chat, and the more directly the execution layer can touch local files and commands, the larger the attack surface. QClaw has both, which is why it scored highest.

## Regulators' warnings

During the craze, Chinese regulators issued warnings too. On March 8, the Ministry of Industry and Information Technology's cybersecurity threat and vulnerability sharing platform said some OpenClaw instances were high-risk under default or improper configuration. [On March 11 it listed recommendations](https://bjqn-app.bjd.com.cn/content/s69b83ec9e4b0cd719e9f173d.html):

- Don't use third-party images or old versions.
- Don't use skill packages that ask you to "download a ZIP," "run a shell script" or "enter a password."
- Don't deploy with an administrator account.
- Don't expose agent instances directly to the internet; if you need outside access, use an encrypted channel like SSH and restrict source addresses.
- Don't turn off detailed audit logging.

These apply beyond Chinese products; they hold for self-hosted OpenClaw too.

## QClaw's shutdown: the first in this category to close

On September 24, Tencent's QClaw team announced that [QClaw would stop operating at 00:00 on December 24, 2026](https://news.qq.com/rain/a/20260924A0DF5T00) (in Chinese):

- From the announcement, new registrations and subscription purchases and renewals stopped.
- Unused subscriptions can be refunded.
- Data can be migrated to Tencent's WorkBuddy, with the migration tool open until March 24, 2027; users who complete migration get 1,000 credits.

QClaw entered closed testing in March, reportedly passed a million users within 10 days, and was the first "lobster" product to connect directly to WeChat. In July, Tencent moved the QClaw business into the department that owns WorkBuddy. Tencent's explanation was consolidating resources to provide better agent services.

That's another risk of wrapped products: your memory, skills and settings live in the vendor's product, and when the product closes, you have to move. Open-source OpenClaw doesn't disappear because one company reorganizes; the products wrapping it can.

## Telling the three kinds of products apart

When you meet a new Claw product, these questions tell you whether it's hosted OpenClaw, a wrapped app or the vendor's own agent:

| Question | Hosted OpenClaw | Wrapped app | Vendor's own agent |
|---|---|---|---|
| Where does the code run? | The vendor's cloud sandbox | Your computer | Depends on the product |
| Is OpenClaw underneath? | Yes, usually stated | Yes, usually stated | No, or it's only skill-compatible |
| Can it touch your local files and commands? | No | Yes, usually with high privileges | Depends on the product |
| Where do you give commands? | Web, messaging apps | Messaging apps controlling your computer | Depends on the product |
| What happens to your data if it closes? | Export memory and workspace first | Files are local, but settings are tied to the product | Depends on the vendor's migration tool |

Then check the attack surface against the evaluation's findings:

- **Entry**: who can give it commands in a chat? Can other people in a group?
- **Execution layer**: can it run local commands and read files directly? Is there a sandbox?
- **Credentials**: where are your passwords and API keys stored? Can the agent read them?
- **Exit**: can it send data to outside addresses?

A local app with messaging-app remote control opens all four, so be especially careful.

## Who it suits, and who it doesn't

**Suits you if:**
- You want to try always-on agents without setting one up yourself: cloud-hosted versions have the lowest barrier.
- Your team already works in Feishu, WeCom or DingTalk.
- You want Chinese models at lower prices.

**Doesn't suit you if:**
- You want a local version on your main computer but don't want to manage permissions: the evaluation found local wrapped versions riskiest.
- You need long-term stability: QClaw has already shown what happens when a product closes.
- Your organization's data is regulated and can't sit in a Chinese vendor's cloud.

For Taiwan, Kimi Claw and MaxClaw have international sites, and AutoClaw has an overseas site (autoclaw.z.ai). Whether you can subscribe and which messaging apps you can connect should be confirmed when you sign up. ArkClaw is a Volcano Engine service, and QClaw has stopped accepting new registrations.

The first three routes all give the agent a computer, whether the vendor's cloud, your own machine or a wrapped version. [Route 4, next](/posts/ai/2026-11-20-super-app-agents-en), doesn't open a new computer: the agent moves into the apps you already use every day.

## References

- [A Systematic Security Evaluation of OpenClaw and Its Variants](https://arxiv.org/abs/2604.03131) (Wang et al., Xidian University and China Unicom, arXiv, 2026-04-03)
- [OpenClaw与5款国产类Claw智能体安全评测报告](https://www.secrss.com/articles/89363) (secrss, 2026-04-13, in Chinese)
- [一只“龙虾”搅动江湖：国产大模型厂商“吃撑”，大厂急了](https://www.bjnews.com.cn/detail/1773055598129368.html) (The Beijing News, 2026-03-09, in Chinese)
- [疯狂的OpenClaw：Token放量、资本热捧，大厂卡位战已打响](https://www.nbd.com.cn/articles/2026-03-10/4287155.html) (National Business Daily, 2026-03-10, in Chinese)
- [这波“养虾潮”还能热多久？](https://bjqn-app.bjd.com.cn/content/s69b83ec9e4b0cd719e9f173d.html) (Beijing Youth Daily, 2026-03-17, in Chinese)
- [腾讯QClaw宣布将关停](https://news.qq.com/rain/a/20260924A0DF5T00) (iHeima via Tencent News, 2026-09-24, in Chinese)
- [What Is Kimi Claw?](https://www.kimi.com/en/help/kimi-claw/overview) and [Membership Pricing and Plan Overview](https://www.kimi.com/en/help/membership/membership-pricing) (Kimi Help Center)
- [MaxClaw](https://agent.minimax.io/activity/max-claw) (MiniMax)
- [智谱AutoClaw官方正版产品介绍](https://autoclaw.zhipuai.cn/blog/news/autoclaw-product-introduction/) (Zhipu, 2026-10-21, in Chinese)
