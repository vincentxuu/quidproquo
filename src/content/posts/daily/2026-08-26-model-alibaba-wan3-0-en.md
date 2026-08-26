---
title: "Model Card｜Wan3.0"
date: 2026-08-26
category: daily
tags: [ai-agent, model-release, daily, alibaba, model-family-wan]
lang: en
description: "Alibaba Cloud's Tongyi Wan officially releases Wan3.0 — single-shot 30-second video generation, document/slide/spreadsheet input support, priced at $0.05–$0.20 per second, and the first Wan release to drop open-source weights"
tldr: "Wan3.0: single-shot length doubles from Wan2.7's 15s to 30s, up to 1080P, supports doc/xls/ppt/pdf/md files and web pages as generation inputs, priced at 480P $0.05 / 720P $0.10 / 1080P $0.20 per second — roughly 50% cheaper than Google Veo 3.1 Standard, but now closed-source API-only, and not yet independently tested by third parties"
series:
  name: "AI Model Tracker"
  order: 6
glossary:
  - term: "Wan"
    def: "A video generation model family developed by Alibaba Cloud's Tongyi Wan team"
---

> 🌏 [中文版](/posts/daily/2026-08-26-model-alibaba-wan3-0)

## Model Information

| Field | Value |
|---|---|
| Model ID | `wan3.0-video` |
| Vendor | Alibaba Cloud (Tongyi Wan team) |
| Parameters | Undisclosed |
| Context Window | Not a text model — no context window concept; max single-shot generation is 30 seconds at up to 1080P/30fps |
| Input Pricing (USD/1M tokens) | N/A (billed per generated second; see pricing below) |
| Output Pricing (USD/1M tokens) | 480P $0.05/sec, 720P $0.10/sec, 1080P $0.20/sec (a 30-sec 1080P video ≈ $6.00) |
| Open Source | No (Wan 2.1/2.2 were open-sourced under Apache 2.0; Wan3.0 onward is API-only, closed-source) |
| Release Date | 2026-08-24 (public beta since 2026-08-06) |
| Official Announcement | [Alibaba Cloud Model Studio: Wan 3.0](https://modelstudio.console.alibabacloud.com/model-releases/wan3.0-video) |
| HuggingFace | None (closed-source, not listed) |
| Family | Wan 3.x (predecessor: Wan2.7, released 2026-04-03) |

## Key Capabilities

- Single-shot generation length doubles from Wan2.7's 15 seconds to 30 seconds — one of the few mainstream video models that supports half-minute single-take narratives
- New "Omni Reference": doc, xls, ppt, pdf, md files and web pages can all serve as generation inputs, converting tables, slides, and document content directly into video
- Up to 10 reference images can simultaneously lock character, scene, and prop consistency, maintaining appearance and spatial relationships across multi-shot transitions
- Native audio-visual synchronized generation with multilingual lip-sync (official demo shows a single character singing consecutively in 8 languages)

## Benchmark Performance

| Comparison | Wan3.0 | Wan2.7 (predecessor) | Strongest competitor (Google Veo 3.1 Standard) |
|---|---|---|---|
| Single-shot length | 30 sec | 15 sec | No clear public limit (Veo 3.1 ≈ 8 sec per shot) |
| Max resolution | 1080P | 1080P | 1080P |
| 1080P pricing (per second) | $0.20 | Not listed per-second (billed per generation) | $0.40 |
| Document/web page input | Supported (doc/xls/ppt/pdf/md/web pages) | Not supported | Not supported |

⚠️ The generation length, consistency, and lip-sync quality claims above are all from Alibaba's official demos. No third-party independent testing or standardized benchmark scores exist yet; pricing figures are from official announcements.

## Comparison with Predecessors and Competitors

Compared to Wan2.7, the biggest improvement is a straight doubling of generation length (15s → 30s), plus the new Omni Reference capability that lets any file type serve as input. Previously you could only feed images, video, and audio — now slides, spreadsheets, PDFs, and web pages can all become video script inputs. This is a meaningful product differentiation for marketing, education, and enterprise content production, rather than just parameter stacking.

Compared to Google Veo 3.1, Wan3.0 at $0.20 per second for 1080P is half the price of Veo 3.1 Standard's $0.40, a clear cost advantage. However, Veo 3.1 has more third-party testing and ecosystem integrations. Wan3.0 is currently only available through an application-based API preview and has not fully opened access — this has been repeatedly noted in coverage as a caveat that "quality claims remain to be verified."

A notable strategic shift: Wan 2.1/2.2 were among the few mainstream video models to open-source weights on Hugging Face/GitHub (Apache 2.0). From Wan 2.5 onward, the series has progressively moved to API-only, and Wan3.0 continues this closed-source trajectory. If you previously relied on Wan's open-source versions for self-hosted inference, Wan 2.2 is currently the last downloadable version — Wan3.0 is only available through the cloud API.

## Implications for Agent Development

Omni Reference turns "document-to-video" into a single API call, directly impacting agents that build content automation pipelines. Previously you'd need a separate agent to summarize a PDF/slide deck into a text script before feeding it to a video model — now you can skip the intermediate summarization step and pass the raw document directly to Wan3.0.

- If you're building marketing/educational content automation agents: you can design a single-step workflow of "upload slides → directly produce a 30-second short video," without maintaining a document-to-script middleware layer
- If you're building multimodal content review or localization agents: the 30-second length plus multilingual lip-sync is suitable for batch-generating multiple language versions of the same video
- Not suitable for: scenarios requiring offline/local deployment (Wan3.0 has no open-source weights, cloud API only), and production content requiring strict quality guarantees (quality claims are not yet third-party verified, and the API is still in application-based preview — stability and quotas remain to be seen)

## Takeaway

I used to think the "video model arms race" would only push toward higher resolution and longer generation length. But Wan3.0's Omni Reference (accepting doc/xls/ppt/pdf/md as generation inputs) is a reminder that real product differentiation often lies in "how open the input interface is" rather than "how impressive the output specs are." It's also a reminder that open source is not a permanent vendor commitment — Wan went from Apache 2.0 at 2.1/2.2 all the way to fully API-only at 3.0, which means when evaluating models you can't just check "has this family ever been open source" — you need to look at the actual license terms of the latest version.

## References

- [Alibaba Cloud Model Studio: Wan 3.0 Video Generation](https://modelstudio.console.alibabacloud.com/model-releases/wan3.0-video)
- [Reuters: Alibaba launches Wan3.0 AI video model after $10 billion share sale](https://www.reuters.com/business/retail-consumer/alibaba-launches-wan30-ai-video-model-after-10-billion-share-sale-2026-08-24/)
- [TechNode: Alibaba launches Wan3.0 video model with 30-second generation and document input](https://technode.com/2026/08/24/alibaba-launches-wan3-0-video-model-with-30-second-generation-and-document-input/)
- [eWeek: Alibaba's Wan3.0 Generates 30-Second AI Videos From Documents](https://www.eweek.com/news/alibaba-wan3-ai-video-documents-apac-china/)
- [TheNextWeb: Alibaba launches Wan3.0, its 30-second video model, days after raising $10bn](https://thenextweb.com/news/alibaba-wan3-video-model-after-share-sale)
- [Alibaba Cloud Help Center: Wan3.0 Video Generation API Reference](https://help.aliyun.com/en/model-studio/wan3-video-generation-api-reference)
- [vidcella.ai: Wan 2.7 vs Wan 2.6 — What Actually Changed](https://vidcella.ai/posts/wan-2-7-vs-wan-2-6)
