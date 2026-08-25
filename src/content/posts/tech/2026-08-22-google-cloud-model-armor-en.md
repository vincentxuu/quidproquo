---
title: "Google Cloud Model Armor: Runtime Filters around Prompts, Responses, and Agent Tools"
date: 2026-08-22
category: tech
type: deep-dive
tags: [model-armor, prompt-injection, ai-security, google-cloud, guardrails]
lang: en
tldr: "Model Armor can inspect prompt injection, jailbreaks, sensitive data, malicious URLs, and unsafe content at runtime; it is a probabilistic detector, not an authorization or sandbox boundary."
description: "Google Cloud Model Armor templates, input and output filters, confidence thresholds, Sensitive Data Protection, floor settings, logging, failure modes, and agent boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 119
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-google-cloud-model-armor)

[Google Cloud Model Armor](https://docs.cloud.google.com/model-armor/overview) is a runtime screening service in generative-AI request and response paths. Templates enable prompt-injection and jailbreak detection, harmful-content filters, malicious URI and malware checks, and Sensitive Data Protection, with confidence thresholds and inspect-only or inspect-and-block enforcement.

## Inputs and outputs need different policies

User prompts, retrieved chunks, web pages, uploaded documents, and tool results can carry indirect injection. Input templates should emphasize untrusted instructions, malicious URIs, and uploaded secrets. Output templates should emphasize credential or PII leakage, harmful content, and malicious links. The official guidance recommends separate templates because risks and false-positive costs differ.

Lower thresholds catch more suspicious content and block more legitimate requests. Begin in inspect-only mode against production-like traffic, build a confusion matrix, and tune by route and tool risk. A high-risk payment, deletion, or write tool still needs deterministic authorization and confirmation when the classifier finds nothing; a low-risk FAQ cannot become unusable from false positives.

## A filter result cannot be the only security decision

Classifiers have false negatives and can be bypassed by new languages, encodings, or modalities, while legitimate security discussion may look malicious. Layer defenses: separate instructions from untrusted data, constrain tool schemas and arguments, authorize per user, minimize privilege, confirm side effects, sandbox execution, restrict egress, and audit. Model Armor reduces dangerous content crossing the model boundary; it does not replace those controls.

Templates are IAM-controlled policy objects. Organization, folder, and project floor settings can impose minimum filters so teams cannot create weaker templates. Test setting precedence, integration coverage, and bypass paths to ensure every relevant model, provider, and tool call passes the expected policy.

Prompt and response logs help incidents but may copy PII, credentials, and proprietary context. Keep sanitize-operation content logging off unless governed, with retention, redaction, access, and region controls. REST APIs can protect models across clouds, but benchmark latency, token and file limits, streaming, fail-open or fail-closed behavior, and service outages.

## References

- [Model Armor overview](https://docs.cloud.google.com/model-armor/overview)
- [Create and manage templates](https://docs.cloud.google.com/model-armor/manage-templates)
- [Configure floor settings](https://docs.cloud.google.com/model-armor/configure-floor-settings)
- [Model Armor logging](https://docs.cloud.google.com/model-armor/configure-logging)
- [Model Armor audit logging](https://docs.cloud.google.com/model-armor/audit-logging-model-armor)
