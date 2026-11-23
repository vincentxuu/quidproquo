---
title: "Agents That Move Into Super Apps: LINE, Kakao and Naver Skip the New Computer and Put Agents Inside the Apps You Already Use"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, line, kakao, naver]
lang: en
tldr: "The first three routes all give the agent a computer. Super apps in Japan, Korea and Taiwan take another route: the agent lives in your chats, uses internal APIs for the company's own services, and opens an isolated browser only for outside websites. In October, LINE Taiwan announced a chat-room agent (no launch date), an AI agent platform for official accounts (targeting Q1 2027), and shopping and gift assistants (2027). Japan's Agent i is already live and in September added a task feature that keeps watching and notifies you only when something changes. Kakao's Kanana Space enters closed beta in December, and Naver's personal agent app is due by year-end. Checked against the four tests, most don't yet count as always-on. The questions to ask before they launch: how end-to-end encrypted chats get read by AI, whether others in a group consent, and whether the company's own products get ranked first."
description: "How super-app agents differ structurally from agents with their own computers like Muse and Duet, the status of LINE Taiwan's CONVERGE 2026 roadmap, Japan's Agent i task feature and Agent i in chat, Kakao's Kanana Space and Kanvas, and Naver's personal agent app, a check against the four tests for always-on agents, and the privacy and authorization questions to ask when these features launch."
series:
  name: "Always-On AI Agents"
  order: 16
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-super-app-agents)

| Product | Company / region | Status (November 23) |
|---|---|---|
| Chat-room agent | LINE Taiwan | Announced; Taiwan launch date not yet public |
| Official account AI agent platform | LINE Taiwan | Brand trials from late 2026, targeting Q1 2027 |
| Shopping and gift assistants | LINE Taiwan | Planned for 2027 |
| Agent i (with task feature) | LY Corporation, Japan | Live; Agent i in chat due within 2026 |
| Kanana Space | Kakao, Korea | Closed beta in December, full launch Q1 2027 |
| Personal agent app | Naver, Korea | Due by end of 2026 |

According to [Business Next](https://www.bnext.com.tw/article/92615/line-converge-2026-agentic-ai) (in Chinese), at its annual press conference on October 13, LINE introduced its chat-room agent with a familiar scene:

Friends in a LINE group are planning a weekend trip. Someone books the restaurant, someone handles transport, someone suggests places to visit. In the future, AI will follow the conversation, sort out who's doing what, write it into the group's notes and add confirmed dates to the calendar. After the trip, it will sort the photos shared in the chat into albums.

Users don't open a new app or copy the conversation anywhere else. As LINE Taiwan's chairman and CEO put it, users don't have to adapt to a new way of doing things; they hand off tasks inside the LINE they already know, and AI completes them.

This post is about route 4: what happens when the agent doesn't get its own computer, but moves into the apps you use every day and calls the company's own services directly.

## How it differs from the first three routes

Whether it's Muse's cloud VM, a self-hosted OpenClaw machine or Kimi Claw's cloud sandbox, the first three routes all work the same way: give the agent a computer. It opens a browser and clicks through web pages like a person would.

Super apps don't need to. Their services are already their own:

- **Internal APIs for the company's own services**: at [Naver's November 12 earnings call](https://en.sedaily.com/business/2026/11/12/naver-to-launch-personal-ai-agent-app-this-year-linking), CEO Choi Soo-yeon said Naver's agent will execute through its own shopping, Place, Maps and Naver Pay APIs. Choi described that as executing "quickly and accurately."
- **An isolated browser only for outside sites**: for external services it isn't integrated with, Naver plans to have the agent operate them directly [in an isolated browser environment](https://en.edaily.co.kr/news/eda202611125256/), then negotiate official integrations one by one.
- **Requests come from the chat**: LINE and Kakao both pick up requests from the conversation, so users don't have to type a separate instruction.

[Digital Today](https://www.digitaltoday.co.kr/en/view/126463/naver-kakao-ai-agent-race-external-service-links) lays out the trade-off between the two approaches. Direct integration is fast and stable, but needs the other company's cooperation. Browser control needs no partnership and reaches more services; but computing costs are higher, success rates and stability still need work, and some companies restrict AI access. Kakao said that when it pursued direct integrations one company at a time, it ran into staffing, schedules and conflicting interests, so it chose to test demand through browser control first, then connect major services directly.

## LINE Taiwan: three things, none live yet

LINE has about 22 million monthly active users in Taiwan. [The October 13 press conference](https://www.linecorp.com/pr/news/2026/1013-2) (in Chinese) announced three lines of work:

**1. Chat-room agent**: answers questions in groups, organizes tasks into notes, pulls event dates into the calendar, and sorts photos into albums. [LY Corporation's report](https://www.lycorp.co.jp/en/story/20261113/converge_2026.html) notes that the Taiwan rollout schedule will be announced later.

**2. AI agent platform for official accounts**: lets businesses build their own AI agents in the official account back end, starting with three types: booking, sales and customer service. LINE's example is a nail salon: when a customer's preferred manicurist is booked, the AI checks the other staff's schedules, finds open slots, and completes the booking once the customer confirms. Businesses can also connect POS, CRM, membership and scheduling systems. Brand trials begin at the end of 2026, with launch targeted for Q1 2027; pricing hasn't been set.

**3. Shopping and gift assistants**: the shopping assistant accepts text, images, links and even screenshots of group chats. It extracts quantity, budget, specs and delivery time, compares prices and builds a shopping list, ordering only after the user confirms. LINE Shopping is also connecting across platforms through Google's Universal Commerce Protocol (UCP). The gift assistant starts from "who is this for." Both are planned for 2027.

## Japan's Agent i: already following up on its own

In Japan, LINE is run by LY Corporation, which is further ahead than Taiwan. Agent i, launched in April 2026, merged Yahoo! JAPAN's AI assistant and LINE AI into a new brand.

The part most relevant to always-on agents is [the task feature added on September 11](https://www.lycorp.co.jp/ja/news/release/020805/) (in Japanese):

- **Keyword tracking**: register a topic, and Agent i keeps checking for news at the frequency you set (daily, weekly, a specific day and time).
- **Price-drop alerts**: register a product, and at the times you choose it checks prices across several shopping sites, notifies you once when the drop exceeds your threshold, then stops tracking.
- **Event alerts**: weekly notifications of events in the prefecture and scenario you choose (with kids, alone, on a date).

Agent i can suggest a task in chat for one-tap registration; results appear on Agent i's home screen and as push notifications from LINE or Yahoo! JAPAN. LY says it will expand to tasks like booking restaurants and buying products.

For chats, [Agent i in chat, announced July 2](https://prtimes.jp/main/html/rd/p/000001754.000129774.html) (in Japanese), is due within 2026: summon Agent i in a one-on-one or group chat, and its answers and results are visible to everyone in the room. The features nearly match what Taiwan announced: organizing tasks, adding to the calendar, building albums, with message summaries and receipt-based bill splitting to follow.

The chat-room Agent i features already live (reply suggestions, tone changes and so on) are available only to users who consent to analysis of their chat history, and LY says chat history isn't used to train AI. Free users get 3 uses a day.

Can you use Agent i in Taiwan? LINE Taiwan's help center has no Traditional Chinese documentation, and the Japanese help center's AI category redirects to the home page when switched to Traditional Chinese. For now it's Japan-only.

## Korea: Kakao and Naver

**Kakao's Kanana Space**: [unveiled October 13 at if(kakao)26](https://www.kakaocorp.com/page/detail/12184). Swipe with two fingers anywhere in KakaoTalk and the character Ryan appears; ask by voice or text to send messages, manage your calendar, search the web or change KakaoTalk settings. Examples on [the official site](https://space.kakao.com/) (in Korean) include "summarize my unread messages" and "what did my wife tell me to bring?", which it answers by searching past conversations.

Kakao plans to let it complete orders, gifts, reservations and money transfers with a single request. For example, if you say "order bottled water," it picks the brand you bought last time, applies coupons and prepares everything through payment. Closed beta starts in December, with [full launch in Q1 2027](https://www.asiae.co.kr/en/article/2026101313233820471). Kakao's head of design said users must check and approve important actions like sending messages or payments themselves.

Kakao also unveiled Kanvas, for building a team of agents on your own PC, with recurring and scheduled tasks; each agent uses a separate browser to keep access information isolated. [The Korea Times reports](https://www.koreatimes.co.kr/business/tech-science/20261013/kakao-unveils-kanana-space-as-kakaotalk-expands-into-ai-interface) that Kakao plans a space in KakaoTalk in the first half of 2027 where users can call these agents from the chat interface.

**Naver's personal agent app**: Naver says it will launch by the end of 2026. Its structure is as described above: internal APIs for its own services, an isolated browser for outside sites. [Edaily, citing the earnings call](https://en.edaily.co.kr/news/eda202611125256/), reports that payments and reservation confirmations require the user's direct approval, and sending emails or adding calendar events requires confirmation first. Each user gets an isolated zone with encrypted data, and conversations with users are handled only by Naver's own models.

## The four tests: most don't count yet

Applying the series' [four tests](/posts/ai/2026-11-20-always-on-agents-overview-en):

| | Keeps running while you're away | Decides what to do when it wakes | Remembers your goals across conversations | Acts for you |
|---|---|---|---|---|
| LINE chat-room agent (announced) | Not stated | Not stated | Reads chat context | Writes notes, calendar, albums |
| Agent i task feature (live) | ✓ Runs on schedule | Conditionally: notifies only on change | Registered tasks | Notifies only; actions not yet available |
| Kanana Space (closed beta) | Not stated | Not stated | Reads past conversations | Sends messages, adds events; payments need approval |
| Naver personal agent (not launched) | Says it will "take care of tasks ahead of time" | Not stated | Transaction history | Bookings and payments need approval |

The closest today is Agent i's task feature: it runs on a schedule and speaks only when conditions are met, which is L2. The rest mostly act only when you call them.

This route is still worth watching, because its starting point differs from the other three. It doesn't have to persuade you to hand your inbox and accounts to a new computer: your chats, schedule, purchase history and payments are already in its hands. Once it adds scheduling and self-waking, it could pass the four tests faster than anyone.

## Questions to ask when these launch

When LINE's features roll out next year, ask these first.

**1. How does AI read end-to-end encrypted chats?**

LINE Taiwan says end-to-end encryption is a basic principle of its chats and won't change because of AI. But [Business Next notes](https://www.bnext.com.tw/article/92615/line-converge-2026-agentic-ai) that LINE hasn't explained how AI will process chat content while keeping encryption, or what runs on the phone versus in the cloud. At launch, check whether it asks for separate consent, as Japan's Agent i does.

**2. Do others in the group consent?**

A group agent reads everyone's messages. LINE Taiwan's chairman said group chats involve the wishes of different members, and LINE will assess personal data and privacy before deciding how to roll it out. Your consent isn't everyone else's. At launch, check whether consent from the person summoning it is enough or whether every member must agree, and whether people who don't want to be read can opt out.

**3. Will the company's own products be ranked first?**

When the shopping assistant compares prices, is it comparing LINE Shopping's 1,300-plus partners, or the whole web? Naver openly says its advantage is using its own shopping and payment data to "lead to actual purchases." A super-app agent knows your purchase history best, and has the most incentive to steer you toward its own services.

**4. How far can it act for you?**

LINE's shopping assistant, Kakao and Naver all say payments and booking confirmations need your own tap. At launch, check that this holds, and whether there's a "don't ask me again" switch.

**5. Where is data stored, and is it used for training?**

Japan's Agent i states that chat history isn't used to train AI, and it runs on Gemini or OpenAI APIs. Whether Taiwan's version will be the same isn't known yet.

## Who it suits, and who it doesn't

**Suits you if:**
- Your life already runs on LINE, KakaoTalk or Naver: no new tool to learn.
- Your main needs are everyday tasks like organizing group plans, schedules, price comparisons and bookings.
- You run a LINE official account: the AI agent platform may be the lowest-barrier way to adopt agents.

**Doesn't suit you if:**
- You need an agent working across several platforms for long stretches: super-app agents serve their own services first.
- You don't want AI reading your group chats: wait until encryption and consent are explained.
- You want whole-web price comparisons: check the scope of its comparisons first.

In Taiwan, only LINE's features apply to you, and none are live yet; Agent i, Kanana Space and Naver's agent have no Taiwan versions for now.

The four routes are about where these agents are designed to stop and wait for your approval. Next, cases where they didn't stop: no attack, and they still did things you didn't ask for.

## References

- [LINE 官方帳號邁入 AI 代理時代](https://www.linecorp.com/pr/news/2026/1013-2) (LINE Taiwan, 2026-10-13, in Chinese)
- [LINE官方帳號也要AI了！](https://www.bnext.com.tw/article/92615/line-converge-2026-agentic-ai) (Business Next, 2026-10-14, in Chinese)
- [LINE Taiwan "LINE CONVERGE 2026" Report](https://www.lycorp.co.jp/en/story/20261113/converge_2026.html) (LY Corporation, 2026-11-13)
- [Agent i 、情報収集など日常の作業を自律的・継続的に代行し、通知する「タスク機能」を提供開始](https://www.lycorp.co.jp/ja/news/release/020805/) (LY Corporation, 2026-09-11, in Japanese)
- [「Agent i in chat」2026年内に提供予定](https://prtimes.jp/main/html/rd/p/000001754.000129774.html) (LY Corporation, 2026-07-02, in Japanese)
- [Kakao Unveils Personalized, End-to-End Agent Services and Technologies at if(kakao)26](https://www.kakaocorp.com/page/detail/12184) (Kakao, 2026-10-13)
- [Kanana Space](https://space.kakao.com/) (Kakao, in Korean)
- [Kakao unveils Kanana Space as KakaoTalk expands into AI interface](https://www.koreatimes.co.kr/business/tech-science/20261013/kakao-unveils-kanana-space-as-kakaotalk-expands-into-ai-interface) (The Korea Times, 2026-10-13)
- [KakaoTalk Evolves into an AI Assistant](https://www.asiae.co.kr/en/article/2026101313233820471) (The Asia Business Daily, 2026-10-13)
- [NAVER to Launch Personal AI Agent App This Year](https://en.sedaily.com/business/2026/11/12/naver-to-launch-personal-ai-agent-app-this-year-linking) (Seoul Economic Daily, 2026-11-12)
- [Naver to Launch Personal Agent AI App by Year-End](https://en.edaily.co.kr/news/eda202611125256/) (Edaily, 2026-11-12)
- [Naver, Kakao step up AI agent race with links to external services](https://www.digitaltoday.co.kr/en/view/126463/naver-kakao-ai-agent-race-external-service-links) (Digital Today, 2026-11-17)
