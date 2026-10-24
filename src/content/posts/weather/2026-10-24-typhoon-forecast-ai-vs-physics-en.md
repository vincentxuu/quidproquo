---
title: "How to Read Typhoon Forecast Maps: Track, Intensity, and Ensemble Proportions in AI vs. European Models"
date: 2026-10-24
category: weather
tags: [typhoon, ai-weather-models, ecmwf, google-deepmind, ensemble-forecast, taiwan]
lang: en
tldr: "In 2025 evaluations, AI models such as AIFS had smaller typhoon track errors than traditional models such as ECMWF's IFS, while intensity and wind-and-rain forecasts remain weak. When reading a forecast map, first separate a single track from an ensemble proportion, and track from intensity. Treat disagreement more than three days out as undecided."
description: "Typhoons Champi, Bavi, and Saudel all drew conflicting track forecasts from AI models and traditional European models. This post explains how the two kinds of model differ, where AI is strong and weak, and three questions for reading a forecast map."
draft: true
---

> 🌏 [中文版](/posts/weather/2026-10-24-typhoon-forecast-ai-vs-physics)

Days before Typhoon Champi (薔琵) came near Taiwan, the news was already comparing two sets of forecasts. Forecast centers nudge the starting conditions slightly and run dozens to thousands of forecasts at once. Together they are called an ensemble forecast, and each run is a member. On October 20, United Daily News (in Mandarin) cited one weather expert's tally. [39 of the 50 members of ECMWF's traditional model, the IFS,](https://udn.com/news/story/7266/9825453) leaned toward landfall in the Hualien–Taitung area. Only 31 of Google's 1,000 members passed over Taiwan, most of them between Miyako and Ishigaki islands. Same typhoon, same day: nearly 80% on one side, about 3% on the other.

As I write on October 24, Champi is moving away from Taiwan and its final track is not yet settled. So the case studies below use two typhoons that have already run their course, Bavi (巴威) and Saudel (沙德爾). The question is this: when AI and European models disagree in the news, which disagreements matter, which can wait, and what should you look at on a forecast map?

## How the two kinds of model differ

Traditional physics-based models divide the atmosphere into a grid and solve the equations of fluid dynamics step by step. The European Centre for Medium-Range Weather Forecasts (ECMWF) runs one, the IFS, and the US runs another, the GFS. [AIFS](https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ensemble-ai-forecasts-become-operational) is ECMWF's AI model. It is trained on historical weather data and learns directly how an atmosphere that looks like this one usually evolves, without solving the equations. ECMWF launched a single-forecast version in 2025, then a 51-member ensemble, AIFS ENS, that runs alongside the IFS. AIFS ENS has a grid spacing of about 31 km. The IFS's is about 9 km.

So when the news says "the European model," check which one is meant. The European centre runs both kinds. Another model often put in the comparison is Google DeepMind's [WeatherNext Cyclones](https://deepmind.google/blog/weathernext-ai-model-achieves-breakthrough-in-forecasting-cyclones/), described in a paper in [Nature](https://www.nature.com/articles/s41586-026-10953-2) this August. The code and model weights are public, and DeepMind says it now runs 1,000 members for each typhoon.

## Track: AI errors are usually smaller, and the gap grows with lead time

The [annual evaluation](http://qxqk.nmc.cn/qx/article/pdf/202604090129) (in Mandarin) by the Shanghai Typhoon Institute and China's National Meteorological Centre compared forecasts for all 27 named typhoons of the 2025 western North Pacific season. Mean track errors, in km:

| Lead time | AIFS | IFS | National Meteorological Centre official forecast |
|---|---|---|---|
| 24 hours | 54 | 55 | 57 |
| 72 hours | 118 | 151 | 157 |
| 120 hours | 319 | 441 | 453 |

At 24 hours the three are nearly the same. From 72 hours AIFS pulls ahead, and by 120 hours its error is about 120 km smaller than the IFS's. The Hong Kong Observatory brought AI models into operations for the first time in 2025, and [its own verification](https://www.sciencedirect.com/science/article/pii/S222560322600038X) points the same way. When it combines the forecasts of five AI models, the 72-hour error is about 60% of what it gets from combining five traditional models. The AI track also settles on the final path earlier, and jumps less between successive forecasts.

The seven AI models in the evaluation differ a lot. AIFS has the smallest error of the group from 72 hours onward and FourCastNet the largest. At 72 hours two AI models have larger errors than the IFS, and at 120 hours three do. So "AI is more accurate" holds only for the models that perform well, and for combined forecasts like the Hong Kong Observatory's. It does not hold for every AI model.

In the Nature paper, Google reports that in hindcasts WeatherNext's track error at day 5 is about 230 km, a level the ECMWF ensemble already reaches at about 3.75 days. That is about 30 more hours of warning at the same accuracy. The paper does not break out results for the western North Pacific.

Two conditions apply to these numbers. The evaluations cover only one or two typhoon seasons, and at long lead times the traditional models have fewer samples than AIFS. Recurving typhoons are a different case: the same annual evaluation, pooling 2023 to 2025, finds that beyond 96 hours the AI models' mean error is larger than the traditional models'.

## Intensity and wind and rain: where AI is weakest

AI models generally underestimate intensity. An ECMWF blog post describes a correction method (developed with the University of Cambridge and still at the research stage). [The uncorrected AIFS had a global wind-speed bias of about 29 knots too low in 2025](https://www.ecmwf.int/en/about/media-centre/aifs-blog/2026/ai-tropical-cyclone-forecasts), and about 2 knots after the correction. The annual evaluation also finds that uncorrected AI models have intensity errors above 10 m/s at every lead time, with a systematic low bias. The Hong Kong Observatory still relies mainly on physics-based models for intensity.

Wind and rain depend even more on detail. [A report from PTS, Taiwan's public broadcaster,](https://news.pts.org.tw/article/818850) (in Mandarin) says AI forecasts today have a grid spacing of about 25 km, so Taipei and Keelung can fall in the same grid cell. The director of the forecast center at the [Central Weather Administration](https://www.cwa.gov.tw/) (CWA) says wind-and-rain forecasting "still has a way to go." Bavi's center never made landfall in Taiwan, yet it [still caused 43 flooding incidents and 22 slope disasters](https://www.ncdr.nat.gov.tw/UploadFile/Newsletter/8f3b8649a2aa47e280ee05b9521e0fbd.pdf) (in Mandarin), and Nanzhuang in Miaoli received 759.5 mm of rain in a single day. Seeing "AI predicts no landfall" does not mean nothing will happen.

## Two case studies: Bavi and Saudel

Both typhoons have finished their runs, so the actual tracks can be checked against the Japan Meteorological Agency's best tracks.

### Bavi: AI to the north, traditional models to the south

Bavi affected Taiwan from early to mid July this year. Its center passed over the sea north of Taiwan and made landfall in Zhejiang between late on July 11 and the early hours of July 12 ([JMA best track](https://agora.ex.nii.ac.jp/digital-typhoon/summary/wnp/l/202609.html.en)). The [post-event analysis](https://www.ncdr.nat.gov.tw/UploadFile/Newsletter/8f3b8649a2aa47e280ee05b9521e0fbd.pdf) (in Mandarin) from Taiwan's National Science and Technology Center for Disaster Reduction (NCDR) compared 3 traditional models and 9 AI models. The traditional models' forecast tracks sat consistently to the left of the actual track (south of it), closer to Taiwan, and some members even had it making landfall on Taiwan's eastern half. Most AI models sat to the right (north). After the sea warning was issued, the AI forecasts converged better. In the first three days the two groups' mean errors were similar. From day 4 both groups' mean errors exceeded 150 km, and that is where AI was clearly better. The analysis covers a single typhoon, and its authors say so.

### Saudel: three forecasts a week before landfall

On August 21, [EBC News](https://tw.news.yahoo.com/%E6%B2%99%E5%BE%B7%E7%88%BE%E9%A2%B1%E9%A2%A8-%E7%94%A9%E5%B0%BE%E7%8C%9B%E8%A1%9D%E5%8F%B0%E7%81%A3-%E9%97%9C%E9%8D%B5%E6%99%82%E9%96%93%E9%BB%9E%E6%9B%9D-3%E8%B7%AF%E5%BE%91%E5%A8%81%E8%84%85%E8%B6%85%E9%AB%98-015600110.html) (in Mandarin) cited one weather expert's roundup of three forecasts side by side. The IFS had Saudel making landfall in the Hualien–Taitung area. Both the traditional European forecast and the European AI forecast had it possibly skirting the sea off northern Taiwan. The CWA forecast a turn north toward Japan. The report said the key was when the Pacific high would extend westward.

Saudel actually passed north of Okinawa first, turned west in the East China Sea on August 27 ([JMA best track](https://agora.ex.nii.ac.jp/digital-typhoon/summary/wnp/l/202618.html.en)), and made [landfall](https://www.cma.gov.cn/en/research/news/202609/t20260902_8021247.html) in Taizhou, Zhejiang the next morning. Its remnant circulation re-intensified over the northern South China Sea in late August and dissipated over eastern Guangdong in early September. None of the three forecasts matched what happened. The disagreement itself was information: the models had not yet converged on the steering flow, and at that point waiting another day was worth more than betting on one side.

## Three questions for reading a forecast map

When you look at the news or a forecast map, ask three things first:

| Question | How to read it |
|---|---|
| Is this one line or a bundle of lines? | One line is a single forecast, a bundle is an ensemble. Look at what share of the lines come near you |
| Is it forecasting track, or intensity and wind and rain? | Use AI for track. For intensity, storm size, and local wind and rain, use the CWA and physics-based models |
| How many days until closest approach? | Treat disagreement more than three days out as undecided. Look at convergence after the sea warning |

**One line or a bundle.** An ensemble map is a bundle of thin lines, each one a member. First check the legend or title to see whether it is a single forecast or an ensemble. There are too many lines to count one by one, so look at two things instead. First, check whether the map labels a number such as the probability of passing near a place. If it does not, look at where most of the lines cluster and whether the outliers are a few or half. ECMWF's [forecast charts page](https://charts.ecmwf.int/) has AIFS ensemble maps, and Google's [Weather Lab](https://deepmind.google.com/science/weatherlab/) has WeatherNext's typhoon forecasts. Compare the two by proportion, not by the number of members: 39 of 50 for the IFS, 31 of 1,000 for Google. The two sides do not count the same thing. The IFS figure is "leaning toward landfall in Hualien–Taitung," Google's is "passing over Taiwan," so the proportions are only a rough comparison. The same tally pooled all the ensembles and found about 6.3% passing over Taiwan. Google makes up nearly 90% of the members, so the pooled share mostly reflects Google's view.

**Track or intensity and wind and rain.** When a headline says "AI predicts no landfall," ask what it is forecasting. Use AI for the track. For how big the storm is and where the heavy rain will fall, look at the CWA's warnings and special weather statements.

**How many days out.** In Bavi's case, both groups' mean errors exceeded 150 km from day 4, and only after the sea warning (about a day before the impact on Taiwan) did both converge on the sea north of Taiwan. Treat disagreement more than three days out as undecided. Take preparations you can undo, such as stocking water, charging backup batteries, or checking rebooking rules for flights. Leave the decisions you cannot undo until after the sea warning is issued.

In the end, follow the warnings issued by the Central Weather Administration. The CWA itself uses both traditional and AI models, and its forecasters merge them into the official track ([PTS report](https://news.pts.org.tw/article/818850), in Mandarin). The United Daily News report cited at the top also ends with a note that weather forecasts should defer to the CWA.

## References

- [United Daily News: Will Typhoon Champi hit Taiwan or head for Okinawa? A weather expert reveals track results from more than 1,000 ensemble members](https://udn.com/news/story/7266/9825453) (in Mandarin, 2026-10-20)
- [ECMWF: ECMWF's ensemble AI forecasts become operational](https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ensemble-ai-forecasts-become-operational) (2025-07-01)
- [ECMWF AIFS blog: Improving tropical cyclone intensity forecasts with a simple AI correction](https://www.ecmwf.int/en/about/media-centre/aifs-blog/2026/ai-tropical-cyclone-forecasts) (2026-08)
- [Google DeepMind: WeatherNext: AI model achieves breakthrough in forecasting cyclones](https://deepmind.google/blog/weathernext-ai-model-achieves-breakthrough-in-forecasting-cyclones/) (2026-08-06)
- [Nature: Operational tropical cyclone forecasting with AI](https://www.nature.com/articles/s41586-026-10953-2) (2026)
- [Yang Mengqi et al.: Accuracy evaluation of typhoon forecasts over the western North Pacific and South China Sea in 2025](http://qxqk.nmc.cn/qx/article/pdf/202604090129) (in Mandarin; Shanghai Typhoon Institute and National Meteorological Centre)
- [Hong Kong Observatory: Operational Experience of Using Artificial Intelligence Global Models for Tropical Cyclone Forecasting in the Western North Pacific and the South China Sea](https://www.sciencedirect.com/science/article/pii/S222560322600038X) (2026)
- [NCDR: Meteorological and impact analysis of Typhoon Bavi, 2026](https://www.ncdr.nat.gov.tw/UploadFile/Newsletter/8f3b8649a2aa47e280ee05b9521e0fbd.pdf) (in Mandarin; newsletter no. 254, 2026-09)
- [Digital Typhoon: Bavi (202609), JMA best track](https://agora.ex.nii.ac.jp/digital-typhoon/summary/wnp/l/202609.html.en)
- [Digital Typhoon: Saudel (202618), JMA best track](https://agora.ex.nii.ac.jp/digital-typhoon/summary/wnp/l/202618.html.en)
- [EBC News: Typhoon Saudel's "tail whip" toward Taiwan: key timing revealed, three tracks pose a high threat](https://tw.news.yahoo.com/%E6%B2%99%E5%BE%B7%E7%88%BE%E9%A2%B1%E9%A2%A8-%E7%94%A9%E5%B0%BE%E7%8C%9B%E8%A1%9D%E5%8F%B0%E7%81%A3-%E9%97%9C%E9%8D%B5%E6%99%82%E9%96%93%E9%BB%9E%E6%9B%9D-3%E8%B7%AF%E5%BE%91%E5%A8%81%E8%84%85%E8%B6%85%E9%AB%98-015600110.html) (in Mandarin, 2026-08-21)
- [PTS News: How does AI forecast typhoons? Better tracks, but is wind and rain the weak point?](https://news.pts.org.tw/article/818850) (in Mandarin, 2026-07-22)
- [China Meteorological Administration: AI-TRANS forecasts Typhoon Saudel landfall with high accuracy](https://www.cma.gov.cn/en/research/news/202609/t20260902_8021247.html) (2026-09-02; landfall time and place)
