---
title: "Funding Alert｜Genesis AI Series A $500M"
date: 2026-11-23
category: daily
type: digest
tags: [ai-agent, funding, daily, genesis-ai, physical-ai]
lang: en
description: "Robotics startup Genesis AI raised a $500M Series A at a $3.5B valuation, co-led by Khosla Ventures, Premji Invest and Eclipse, using sensor gloves to capture human motion data for training GENE, an AI brain meant to transfer across robot forms"
tldr: "Genesis AI raised a $500M Series A at a $3.5B valuation, co-led by Khosla Ventures, Premji Invest and Eclipse. The round signals that VCs are treating a general-purpose robot brain that transfers across hardware forms as the next foundation-model-scale battleground."
series:
  name: "AI Agent Funding"
  order: 151
---

> :globe: [中文版](/posts/daily/2026-11-23-funding-genesis-ai)

## Funding Details

| Item | Value |
|---|---|
| Company | Genesis AI (dual-based in San Carlos, California, and Paris, France) |
| Round | Series A |
| Amount | $500M |
| Lead investors | Premji Invest, Khosla Ventures, and Eclipse (co-leading) |
| Other investors | Durable Capital Partners, accounts advised by T. Rowe Price Associates, Bpifrance, HSG, NVIDIA, AMD Ventures, Zoom, Samsung Next, Ericsson, plus individual backers Eric Schmidt, Eric Yuan, Jerry Yang, Xavier Niel, and Zach Kirkhorn |
| Valuation | $3.5B post-money (this is the first publicly disclosed Series A, so there's no prior-round valuation to compare) |
| Total raised | Undisclosed prior rounds (the $500M announced here is the only publicly known round so far) |
| Founded | 2024 |
| Headcount | Undisclosed (the release mentions 100+ global "operators" who wear sensor gloves to collect data, without saying whether they count as formal employees) |

## What the company does

Genesis AI builds a "general-purpose robot brain" rather than the most human-looking robot. The goal is an AI model that transfers across different robot hardware forms, giving machines human-level dexterity.

The product spans four pieces: Eno, the robot body, deliberately skipping a humanoid look in favor of mass production and deployability; GENE, an AI foundation model the company calls the industry's most advanced "robotic brain"; a dexterous hand modeled closely on human hand structure, paired with a data-capture glove that ordinary workers wear during everyday tasks so the robot can learn from their motion; and Genesis World, a simulation platform where robot skills are trained and tested virtually before real-world deployment.

Deployment currently focuses on industrial settings — manufacturing, logistics, labs — with plans to expand into hospitality and healthcare, and eventually consumer and outdoor use. Customer count and revenue are undisclosed. Compared with humanoid robotics companies like Figure or Agility, Genesis AI differentiates on data-collection method: it leans heavily on force signals, captured by human workers wearing sensor gloves and head-mounted cameras while doing everyday work.

```flow-diagram
{
  "title": "Genesis AI's pipeline from human motion to robot deployment",
  "lang": "en",
  "width": 540,
  "height": 600,
  "nodes": [
    {"id": "operator", "label": "Operator demos tasks in gloves", "x": 270, "y": 50, "w": 320, "shape": "actor"},
    {"id": "data", "label": "Force / motion training data", "x": 270, "y": 180, "w": 300, "shape": "db"},
    {"id": "gene", "label": "AI brain GENE trains on it", "x": 270, "y": 310, "w": 300, "shape": "chip"},
    {"id": "sim", "label": "Tested in Genesis World sim", "x": 270, "y": 440, "w": 300},
    {"id": "eno", "label": "Eno deploys in the real world", "x": 270, "y": 560, "w": 320, "tone": "accent"}
  ],
  "edges": [
    {"from": "operator", "to": "data", "step": 1},
    {"from": "data", "to": "gene", "step": 2},
    {"from": "gene", "to": "sim", "step": 3},
    {"from": "sim", "to": "eno", "step": 4}
  ],
  "steps": [
    "Human operators wear sensor gloves and head cameras to demo everyday tasks in factories, warehouses, and labs, capturing force and motion data",
    "The collected motion data trains GENE, the foundation model that is the company's core robotic intelligence",
    "Robot skills are tested and validated repeatedly inside the Genesis World simulator before they're trusted in the real world",
    "Validated skills are deployed onto Eno robots, which carry out real tasks in factories, logistics, and labs"
  ]
}
```

## What this round signals

### What it means for the agent ecosystem

A $500M Series A that pushes the valuation straight to $3.5B makes this one of the largest single Series A rounds in the physical-AI/robot-brain space to date. The money goes toward scaling data collection and large-scale training, deploying Eno at scale with customers, and hiring AI researchers and robotics engineers. It signals that capital is starting to treat a "general brain that transfers across robot forms" as the next foundation-model-scale battleground, rather than betting on one particular robot shape.

### What investors are betting on

Beyond the three co-leads, chip and telecom giants NVIDIA, AMD Ventures, Samsung, and Ericsson also joined — a sign that hardware incumbents want a position in the robot-AI infrastructure layer. Silicon Valley veterans Eric Schmidt, Jerry Yang, and Zach Kirkhorn joined as individual backers, suggesting the prior generation of tech leadership broadly views "physical AI" as the next platform shift, not just an incremental upgrade to robot hardware.

### Numbers worth watching

The $500M round represents roughly 14% of the $3.5B valuation — a relatively high dilution ratio, implying investors were willing to trade for a larger stake to secure a position early. Compared with other physical-world AI plays — General Intuition (September, $6.2B valuation) and SiMa.ai (September, $1.45B) — Genesis AI, only two years old, has already reached one of the highest valuations in its peer group.

## Watchlist status

Genesis AI is not yet on the watchlist. Together with Humyn Labs (covered the same day) and General Intuition (covered in September), there are now three startups focused on "physical AI / robot brains and data" raising rounds in quick succession. We recommend evaluating a dedicated watchlist category (tentatively "Physical AI / Robotics") instead of continuing to flag these case by case.

## Today's takeaway

Genesis AI's glove-based data collection is fundamentally the same playbook as LLM pretraining on text corpora — just with human motion trajectories standing in for text. Whoever can turn "how humans do things" into structured training data fastest and most cheaply holds the data moat for this generation of robot AI — not whoever builds the robot that looks most human.

## References

- [Genesis AI Raises $500M Series A at $3.5B Valuation to Master Human-Level Dexterity in General-Purpose Robots and Deploy at Scale](https://prnewswire.com/news-releases/genesis-ai-raises-500m-series-a-at-3-5b-valuation-to-master-human-level-dexterity-in-general-purpose-robots-and-deploy-at-scale-302941249.html)
- [Genesis AI Lands $500 Million Series A to Scale Glove-Wearing Robots](https://techtoday.techotd.in/news/5201/AI-and-Machine-Learning/Robotics/November-22-2026/Genesis-AI-Lands-500-Million-Series-A-to-Scale-Glove-Wearing-Robots)
