---
title: "AWS Lambda: Understand Events, Retries, and Concurrency Before Choosing Functions"
date: 2026-08-22
category: tech
type: deep-dive
tags: [aws, lambda, serverless, event-driven, cloud-computing]
lang: en
tldr: "Lambda fits short-lived, event-driven, bursty work; its design center is invocation, retries, idempotency, and downstream capacity—not merely smaller containers."
description: "AWS Lambda invocation, event source mappings, retries, concurrency, cold starts, packaging, and Lambda-versus-Fargate decisions."
series:
  name: "AI 時代的技術選擇"
  order: 50
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-aws-lambda-compute)

[AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html) is event-driven function compute. You deploy code and configuration; AWS creates execution environments as requests arrive. The team stops managing hosts but must design invocation, concurrency, and failure semantics.

## Separate the three invocation models

A synchronous caller waits and usually owns retries for function errors. An asynchronous call first enters a Lambda-managed queue, with separate behavior for failures, throttling, and event age. Event source mappings for SQS or Kinesis poll batches and add source-specific retries, visibility timeouts, partial failures, and checkpoints.

Those distinctions determine duplicate and loss risks. AWS [retry guidance](https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html) says code should tolerate the same event more than once. For payments, email, or external writes, create an idempotency record keyed by event ID. Route terminal failures to a destination or DLQ and monitor queue age, not only function errors.

## Automatic scaling does not scale dependencies

Concurrency counts in-flight invocations. A burst can create enough environments to overwhelm database connections, third-party quotas, or downstream queues. Reserved concurrency can cap as well as reserve capacity; provisioned concurrency trades money for more predictable startup. The [scaling documentation](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html) includes account, function, and scaling-rate quotas, so inspect the target Region before deployment.

Do not judge cold starts by averages alone. Runtime, dependencies, VPC setup, initialization, and package size affect tail latency. Measure p95 and p99 before shrinking dependencies, moving setup outside the handler, or buying provisioned concurrency.

## A container image is not a general container platform

Lambda accepts zip archives and [container images](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html), but an image must implement the Lambda runtime API and accept its read-only filesystem and `/tmp` boundary. A Dockerfile does not turn Lambda into Fargate or support an arbitrary persistent daemon.

Keep handlers stateless and store durable state in a database or object store. Reused environments may reuse clients, but globals and `/tmp` are not reliable state. Apply least privilege to the function role and inspect resource policies and cross-account boundaries on event sources.

## Lambda, Fargate, or App Runner

Lambda is usually operationally smallest for event-triggered, short, bursty work. Choose Fargate for long processes, custom runtime behavior, sidecars, stable connection pools, or container-level resources. App Runner is higher-level when the requirement is simply turning an HTTP container repository into a service.

Test more than one happy HTTP request. Redeliver an event, time out the handler, exhaust concurrency, and disable a dependency. Verify idempotency, backoff, DLQs, alarms, and reserved concurrency under those failures.

## References

- [Understanding Lambda invocation methods](https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html)
- [Understanding retry behavior in Lambda](https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html)
- [Understanding Lambda function scaling](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html)
- [Lambda container images](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)
- [AWS Fargate or AWS Lambda decision guide](https://docs.aws.amazon.com/decision-guides/latest/fargate-or-lambda/fargate-or-lambda.html)
