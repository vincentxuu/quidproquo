---
title: "Your Phone Isn't Listening: What FTC Filings and Meta's Own Docs Say About Why the Ads Are So Accurate"
date: 2026-08-06
category: tech
type: deep-dive
tags: [privacy, ad-tech, tracking, meta, data-broker, ftc, gdpr]
lang: en
tldr: "Northeastern tested 17,260 Android apps and found zero activating the microphone. In May 2026 the FTC ruled that Cox Media Group — the company that claimed to be listening — collected no voice data at all and was reselling data-broker email lists, settling for $930,000. The real pipelines are off-site event feedback, lookalike spillover, contact-graph uploads, and location brokers."
description: "Dismantling the phone-eavesdropping myth: the Panoptispy study, the FTC's action over Cox Media Group's 'Active Listening', Meta's Pixel and Conversions API documentation, the official PYMK signal list, and the Webex counterexample where audio is read while muted."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-06-phone-listening-ad-targeting)

You have never searched for rock climbing. You just talked about it face to face with a friend, phone sitting nearby. A few hours later Instagram starts pushing climbing content.

Almost everyone has had this experience, and the intuitive explanation — the phone is listening — is **the weakest of all the available explanations**. Not because you should trust the platforms, but because people have actually gone and measured it, more than once. The real question isn't "is it listening," it's "why doesn't it **need** to."

## Putting the eavesdropping hypothesis on the bench

In 2018 a team at Northeastern University spent a year producing [Panoptispy: Characterizing Audio and Video Exfiltration from Android Applications](https://petsymposium.org/popets/2018/popets-2018-0030.php) (PoPETs 2018, 18(4):33–50). They ran static and dynamic analysis over **17,260 Android apps** from Google Play, AppChina, Mi.com and Anzhi — driving them with Exerciser Monkey, capturing traffic with mitmproxy, then carving media files out of the packets.

Co-author David Choffnes put the result bluntly in [Northeastern's write-up](https://news.northeastern.edu/2018/07/06/is-your-smartphone-spying-on-you/):

> "There were no audio leaks at all — not a single app activated the microphone."

They did find something else. Roughly **9,000** apps had the capability to take screenshots, and the paper flags a previously unreported risk: third-party libraries that "record and upload screenshots and videos of the screen without informing the user and without requiring any permissions." The caught-in-the-act case was the delivery app GoPuff, sending screen recordings to the analytics firm Appsee.

So the correct conclusion isn't "your phone is clean." It's that **there are cheaper, more accurate and entirely legal channels available**.

The engineering costs also stand in the way. Instagram head Adam Mosseri's argument in a [video posted on 2025-10-01](https://www.instagram.com/reel/DPRA3qyEgWw) is actually verifiable: continuous recording would visibly drain your battery, and an indicator would light up on screen. That isn't PR spin — [Apple's documentation](https://support.apple.com/en-us/108331) states that since iOS 14 an orange dot appears when the microphone is in use, and the [Android Open Source Project](https://source.android.com/docs/core/permissions/privacy-indicators) documents that Android 12 and later show microphone and camera indicators in the status bar.

## The company that claimed to be listening got caught not listening

The strongest evidence for the eavesdropping theory has always been Cox Media Group's (CMG) **Active Listening**. CMG promoted the service on its own blog in November 2023; [404 Media](https://www.404media.co/heres-the-pitch-deck-for-active-listening-ad-targeting) first reported on it in December 2023, then obtained the full pitch deck in August 2024, which explicitly named Facebook, Google, Amazon and Bing as partners. Google promptly removed CMG from its Partners Program, and Meta asked CMG to clarify that the program was not based on Meta data.

It looked like a smoking gun. Then **on 2026-05-21 the [FTC closed the case](https://www.ftc.gov/news-events/news/press-releases/2026/05/ftc-require-cox-media-group-two-other-firms-pay-nearly-1-million-settle-charges-they-deceived)**, and the conclusion was the opposite:

> "According to the complaints, this service did not, in fact, listen in on consumers' conversations or use voice data at all—nor did the service accurately place ads in customers' desired locations. Instead, the service the companies provided consisted of reselling—at a significant markup—email lists obtained from other data brokers."

The FTC filed three complaints against CMG Media Corporation, MindSift LLC and 1010 Digital Works LLC. The three will pay **$930,000** in total (CMG $880,000, the other two $25,000 each), used to provide redress to the defrauded **small-business customers** — the victims here were the businesses buying ads, not consumers. The Commission voted 2-0, and each future violation of the order carries a civil penalty of up to $53,088.

The FTC also nailed down a legal point along the way. CMG claimed consumers had "opted in" by accepting app terms of service; the FTC rejected that outright — **clicking through mandatory terms of service does not constitute opt-in consent** for voice data collection. And even if the service had worked as advertised, collecting voice data without adequate consent would itself violate Section 5 of the FTC Act.

Which makes the full story this: **an ad company selling a product that didn't exist used "we're listening to you" as its pitch to resell second-hand data-broker email lists — and along the way convinced the world its phone was listening.**

## Pipeline one: off-site events flowing back

The real first pipeline is written into Meta's own developer documentation. [Conversions API](https://developers.facebook.com/documentation/ads-commerce/conversions-api) is defined as:

> "The Conversions API is designed to create a connection between an advertiser's marketing data (such as website events, app events, business messaging events and offline conversions) from an advertiser's server, website platform, mobile app, or CRM to Meta systems that optimize ad targeting, decrease cost per result and measure outcomes."

The important part comes next: server events are "processed like events sent using the Meta Pixel, Facebook SDK for iOS or Android, mobile measurement partner SDK, offline event set, or .csv upload." The Meta Pixel is JavaScript running in the browser, so ad blockers and cookie restrictions degrade it. The Conversions API is server-to-server, and the [Meta Business Help Centre](https://www.facebook.com/business/help/AboutConversionsAPI) says plainly that its data "is less affected than the Meta pixel by browser loading errors, connectivity issues and ad blockers."

In other words: your behaviour on any storefront, blog or ticketing site is sent to Meta **by the site itself**. This path requires you to do nothing on Facebook at all.

## Pipeline two: lookalike spillover

The second is [Lookalike Audiences](https://www.facebook.com/business/help/164749007013531). An advertiser uploads a seed list — a customer file, or Pixel visitors — and per the official description:

> "To create a lookalike audience, our system leverages information such as demographics, interests and behaviors from your source audience to find new people who share similar qualities."

This is the heart of it. **You never searched for climbing, but people whose behaviour resembles yours did.** That is exactly the mechanism Mosseri described: advertisers share visitor data with Meta, and Meta shows the ads to people with similar interests.

## Pipeline three: the social graph and uploaded contacts

Meta's [Facebook People You May Know AI system](https://transparency.meta.com/features/explaining-ranking/fb-people-you-may-know/) page (updated 2024-12-13) enumerates the input signals for each prediction model. One deserves to be pulled out on its own:

> "Whether or not your contact was uploaded by the person being suggested"

That is Meta stating in writing that **someone else uploading their address book is a model input determining whether you get suggested to them**. This is the substance behind "shadow profiles" — you never authorised anything, but your friend's contact list put you in the graph. Kashmir Hill's [long-running Gizmodo investigation](https://gizmodo.com/how-facebook-figures-out-everyone-youve-ever-met-1819822691) collected hundreds of uncanny cases (a sperm donor suggested the resulting child; a mistress suggested to a spouse), and most trace back here.

Worth noting: on the question of whether PYMK uses location data, Facebook confirmed and then retracted **within 24 hours** in June 2016. [The Guardian](https://www.theguardian.com/technology/2016/jun/29/how-does-facebook-suggest-potential-friends-not-location-data-not-now) documented the whole reversal; the final version claimed only a four-week city-level ranking test at the end of 2015. That episode is itself the lesson: official statements don't have enough resolution. Use official documentation, not official spokespeople.

## Pipeline four: location data brokers

The fourth is simply purchased. Since 2022 the FTC has brought a run of enforcement actions against location data aggregators: Kochava (2022), X-Mode/Outlogic and InMarket (January 2024), Mobilewalla and [Gravy Analytics/Venntel](https://www.ftc.gov/news-events/news/press-releases/2024/12/ftc-takes-action-against-gravy-analytics-venntel-unlawfully-selling-location-data-tracking-consumers) (December 2024 — the agency called this its fifth such action). The allegations are broadly the same: selling precise location data that can track consumers to reproductive health clinics, places of worship and military sites.

CMG's pitch deck was also priced by 10-mile and 20-mile radius — **that is geofencing, not a microphone**.

## The household-IP theory needs more caution than intuition suggests

A popular explanation online: you and your friend are on the same Wi-Fi, so you get bundled into one advertising profile. This mechanism **does exist, but it has to be described in two layers**.

**The raw material layer**: Meta does collect everything required. The [Meta Privacy Policy](https://www.facebook.com/privacy/policy/) (updated 2026-07-23) lists Device signals as including "GPS, Bluetooth signals, **nearby Wi-Fi access points**, beacons and cell towers," plus information about the network you connect to "including your IP address." The policy also contains this:

> "Some location-related information, even if Location Services is turned off in your device settings. This includes using IP addresses to estimate your general location."

**The usage layer**: but the official PYMK signal list above contains **no location, IP or device signal whatsoever** — it is entirely social-graph and behavioural signals.

So the honest statement is: **IP co-location is standard practice among third-party ad tech, and Meta holds the same raw materials, but has not publicly acknowledged using them for recommendations.** The technique itself is powerful — one study of cross-device identity resolution measured that adding an IP co-location graph raised the share of linkable device IDs from **6.19% using single sign-on alone to 43.78%**, a sevenfold increase. But attributing it to Meta is not something the available sources support.

## An honest counterexample: Webex reads your microphone while you're muted

An article that only argues "nobody is listening" is running interference. Microphone risk is real; it just has a different shape than you expect.

[Are You Really Muted?: A Privacy Analysis of Mute Buttons in Video Conferencing Apps](https://petsymposium.org/popets/2022/popets-2022-0077.pdf) (PoPETs 2022 — the same journal as Panoptispy, also presented at FTC PrivacyCon 2022) used runtime binary analysis to trace audio from the driver all the way to the network. It found three mute policies among video conferencing apps: continuous sampling, accessible-but-not-accessed, and software-level cutoff.

Cisco Webex on Windows falls into the first category:

> "We discovered that while muted, Webex continuously reads audio data from the microphone and transmits statistics of that data once per minute to its telemetry servers."

The researchers then collected **over 180 hours** of simulated background noise to train a classifier, and from the intercepted telemetry values alone identified six common background activities — cooking, cleaning, typing — at **81.9% macro accuracy**.

There is a similar story with voice assistants. Lopez v. Apple (N.D. Cal. 19-cv-04577) settled for **$95M** over allegations that Siri was accidentally activated without a wake word, recorded, and reviewed by human contractors; [Apple denies all the allegations](https://www.reuters.com/legal/apple-pay-95-million-settle-siri-privacy-lawsuit-2025-01-02/). And in March 2016 the [FTC sent warning letters to 12 app developers](https://www.ftc.gov/news-events/news/press-releases/2016/03/ftc-issues-warning-letters-app-developers-using-silverpush-code) whose apps embedded the SilverPush SDK, using the microphone to pick up inaudible ultrasonic beacons in TV advertising. **It was listening to your television, not to you.**

## The cognitive layer: frequency illusion and reverse causation

[Frequency illusion](https://en.wikipedia.org/wiki/Frequency_illusion) — popularly the Baader-Meinhof phenomenon — is built from selective attention plus confirmation bias. Climbing content may well have scrolled past you several times already without registering. After the conversation your threshold drops, and the first time you *notice* it gets misfiled as the first time it *appeared*. You also only remember the hits, never the hundreds of misses.

Mosseri's video raises a more interesting possibility: the causation may run backwards. You scrolled past the content **first**, internalised it, and **then** brought it up in conversation.

## Back to the climbing scenario

Four paths can all be true at once, and none of them needs a microphone:

```
   your friend                            you
        │                                  │
        ├─ searches/buys climbing gear ─┐  │
        │                               ▼  │
        │           advertiser Pixel / CAPI │
        │                               │  │
        │                               ▼  │
        │           Lookalike "similar people" ──► climbing ads
        │                                  │
        ├─ uploads contacts (incl. you) ──► social graph
        │                                  │
        └─ same location ──► location broker / geofence
                                           │
      you actually scrolled past it ──► then talked about it
                                        (reverse causation)
      the content was always there ──► you only just saw it
                                        (frequency illusion)
```

Most likely ordering: **your friend is the vector** (they searched, they bought, and you two are linked through mutual friends, contact uploads or shared location) → geofencing → reverse causation → frequency illusion.

## The trend is getting worse, and you can see who has jurisdiction

Two dates worth remembering.

**2025-12-16**: Meta began using users' conversations with Meta AI for ad and content personalisation. There is no full opt-out short of not using the AI features, and [EPIC and 35 other groups petitioned the FTC](https://epic.org/press-release-advocates-urge-ftc-to-halt-metas-plan-to-use-ai-chatbot-data-for-ads/) to halt it. The policy initially excludes the EU, UK and South Korea.

**2026-06**: Meta announced it is [removing the "Your activity off Meta technologies" setting](https://about.fb.com/news/2026/06/better-personalization-and-changes-to-controls-for-your-activity-from-other-businesses/) — the switch that let you disconnect off-site data from your account — while expanding what off-site data is used for, from ads to Feed content and AI responses:

> "In the future, we'll use this information to personalize other parts of your experience, including the content you see in your Feed and AI responses."

The announcement states the change takes effect "in the US and a number of other countries next month." The EU is not named. And the EU trajectory runs the other way: in April 2025 the European Commission found Meta's "Consent or Pay" model in breach of DMA Article 5(2) and fined it **€200 million**; on 2025-12-08 Meta committed to giving EU users an effective choice, which the Commission noted was [the first time such a choice has been offered on Meta's social networks](https://digital-markets-act.ec.europa.eu/meta-commits-give-eu-users-choice-personalised-ads-under-digital-markets-act-2025-12-08_en), rolling out in January 2026.

Taiwan? The amended Personal Data Protection Act was promulgated on 2025-11-11, but **its effective date is still to be designated by the Executive Yuan and remains unset**. The Personal Data Protection Commission has not formally been established — its organic act is still in the legislative process — and the private sector has a transition period of up to six years (see the [PDPC preparatory office](https://www.pdpc.gov.tw/), in Chinese). Taiwan has no equivalent to DMA Article 5(2)'s obligation to offer a less-data equivalent option, and no legal basis for a right to object to automated decision-making.

**Same company, same system: where the DMA reaches, it must offer you a free "less data" option; where it doesn't, the controls come out and the uses expand.**

## Overall

"It's listening to me" is a **comforting** explanation, because it points at a switch you could turn off. The truth is harder to handle: the data seeps in through everyone around you, every site you visit, and every location record that gets bought and sold — and most of those links are documented in official policy and entirely legal.

This system used to decide which ads you saw. From 2026 onward, it decides which world you see.

## References

- [Panoptispy: Characterizing Audio and Video Exfiltration from Android Applications](https://petsymposium.org/popets/2018/popets-2018-0030.php) — PoPETs 2018, 18(4):33–50
- [Is your smartphone spying on you?](https://news.northeastern.edu/2018/07/06/is-your-smartphone-spying-on-you/) — Northeastern Global News, 2018
- [Are You Really Muted?: A Privacy Analysis of Mute Buttons in Video Conferencing Apps](https://petsymposium.org/popets/2022/popets-2022-0077.pdf) — PoPETs 2022
- [FTC to Require Cox Media Group, Two Other Firms to Pay Nearly $1 Million to Settle Charges They Deceived Customers About "Active Listening"](https://www.ftc.gov/news-events/news/press-releases/2026/05/ftc-require-cox-media-group-two-other-firms-pay-nearly-1-million-settle-charges-they-deceived) — FTC, 2026-05-21
- [FTC Takes Action Against Gravy Analytics, Venntel for Unlawfully Selling Location Data](https://www.ftc.gov/news-events/news/press-releases/2024/12/ftc-takes-action-against-gravy-analytics-venntel-unlawfully-selling-location-data-tracking-consumers) — FTC, 2024-12
- [FTC Issues Warning Letters to App Developers Using 'Silverpush' Code](https://www.ftc.gov/news-events/news/press-releases/2016/03/ftc-issues-warning-letters-app-developers-using-silverpush-code) — FTC, 2016-03
- [Here's the Pitch Deck for 'Active Listening' Ad Targeting](https://www.404media.co/heres-the-pitch-deck-for-active-listening-ad-targeting) — 404 Media, 2024-08
- [Conversions API](https://developers.facebook.com/documentation/ads-commerce/conversions-api) — Meta for Developers documentation
- [About Conversions API](https://www.facebook.com/business/help/AboutConversionsAPI) — Meta Business Help Centre
- [About Lookalike Audiences](https://www.facebook.com/business/help/164749007013531) — Meta Business Help Centre
- [Facebook People You May Know AI system](https://transparency.meta.com/features/explaining-ranking/fb-people-you-may-know/) — Meta Transparency Center
- [Meta Privacy Policy](https://www.facebook.com/privacy/policy/) — updated 2026-07-23
- [Facebook Does Not Use Your Phone's Microphone for Ads or News Feed Stories](https://about.fb.com/news/2016/06/facebook-does-not-use-your-phones-microphone-for-ads-or-news-feed-stories/) — Meta Newsroom, 2016
- [Better Personalization and Changes to Controls for Your Activity From Other Businesses](https://about.fb.com/news/2026/06/better-personalization-and-changes-to-controls-for-your-activity-from-other-businesses/) — Meta Newsroom, 2026-06
- [Adam Mosseri: "Myth busting: I swear, we do not listen to your microphone"](https://www.instagram.com/reel/DPRA3qyEgWw) — Instagram, 2025-10-01
- [About the orange and green indicators in your iPhone status bar](https://support.apple.com/en-us/108331) — Apple Support
- [Privacy indicators](https://source.android.com/docs/core/permissions/privacy-indicators) — Android Open Source Project
- [How Facebook Figures Out Everyone You've Ever Met](https://gizmodo.com/how-facebook-figures-out-everyone-youve-ever-met-1819822691) — Kashmir Hill, Gizmodo, 2017
- [How does Facebook suggest potential friends? Not location data – not now](https://www.theguardian.com/technology/2016/jun/29/how-does-facebook-suggest-potential-friends-not-location-data-not-now) — The Guardian, 2016
- [Apple to pay $95 million to settle Siri privacy lawsuit](https://www.reuters.com/legal/apple-pay-95-million-settle-siri-privacy-lawsuit-2025-01-02/) — Reuters, 2025-01
- [Meta commits to give EU users choice on personalised ads under Digital Markets Act](https://digital-markets-act.ec.europa.eu/meta-commits-give-eu-users-choice-personalised-ads-under-digital-markets-act-2025-12-08_en) — European Commission, 2025-12-08
- [Advocates Urge FTC to Halt Meta's Plan to Use AI Chatbot Data for Ads](https://epic.org/press-release-advocates-urge-ftc-to-halt-metas-plan-to-use-ai-chatbot-data-for-ads/) — EPIC, 2025-10
- [Personal Data Protection Commission preparatory office](https://www.pdpc.gov.tw/) — Taiwan PDPA amendment progress (in Chinese)
- [Frequency illusion](https://en.wikipedia.org/wiki/Frequency_illusion) — Wikipedia
