---
title: "AWS Lambda: Understand Events, Retries, and Concurrency Before Choosing Functions"
date: 2026-08-22
category: tech
type: deep-dive
tags: [aws, lambda, serverless, event-driven, cloud-computing]
lang: en
tldr: "Lambda fits short-lived, event-driven, bursty work; its design center is invocation, retries, idempotency, and downstream capacity—not merely smaller containers."
description: "AWS Lambda invocation, event source mappings, retries, concurrency, cold starts, packaging, durable functions, and choosing between Lambda, Step Functions, and Fargate."
series:
  name: "Technology Choices in the AI Era"
  order: 50
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-22-aws-lambda-compute)

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

## Multi-step workflows: durable functions move the boundary

A classic Lambda invocation does one short thing; multi-step state had to live in your own store or in Step Functions. [Lambda durable functions](https://docs.aws.amazon.com/lambda/latest/dg/durable-functions.html), generally available since December 2025, pull that into Lambda itself: wrap business logic in `step`, pause with `wait`, and Lambda checkpoints automatically. On failure or resume, the code replays from the start but skips completed steps and uses their stored results. A durable execution can run for up to a year, with no compute charge while waiting.

It is a checkpoint/replay model, the same family as Temporal or Inngest durable execution, and the same design rules apply:

- **Code outside steps re-runs on every replay**, so it must be deterministic; put external API calls, clock reads, and random numbers inside steps.
- **Each invocation is still bound by the function timeout.** The one-year limit is for the whole execution, which is split into many invocations at `wait` and step boundaries; nothing runs for a year in one go. Since November 2026 the on-demand function timeout limit rose from 15 to [30 minutes](https://aws.amazon.com/blogs/compute/announcing-30-minute-timeout-for-on-demand-aws-lambda-event-functions/).
- **The one-year limit applies to asynchronous invocation.** Synchronous invocation or a function URL caps the durable execution at 30 minutes.
- **It can only be enabled when creating a function**, not added to an existing one. It currently supports selected Node.js, Python, Java, and .NET runtimes plus container images, with 100 MB of checkpoint data per execution and 1 MB per operation ([quotas](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)).

On the split with Step Functions, the [AWS documentation](https://docs.aws.amazon.com/lambda/latest/dg/durable-functions.html) says: choose durable functions when the workflow is tightly coupled to business logic and you want ordinary code; choose Step Functions for orchestration across many AWS services with visual design and native integrations.

## Lambda, Step Functions, or Fargate

Lambda is usually operationally smallest for event-triggered, short, bursty work. For multi-step flows that wait on human approval or external events and last hours or days, the old answer was Step Functions or a long-running Fargate worker; now check first whether durable functions fit, which they do as long as each segment of compute fits within the function timeout.

Choose Fargate for persistent processes, continuous compute longer than the function timeout, custom runtime behavior, sidecars, stable connection pools, or container-level resources. For simply turning an HTTP container into a public service, App Runner used to be the suggestion, but it closed to new customers on April 30, 2026 (see the [App Runner post](/posts/tech/2026-08-22-aws-app-runner-en)); new projects should use ECS Express Mode, which also runs on Fargate.

Test more than one happy HTTP request. Redeliver an event, time out the handler, exhaust concurrency, and disable a dependency. Verify idempotency, backoff, DLQs, alarms, and reserved concurrency under those failures. With durable functions, add one more: fail an invocation between two steps and confirm replay does not repeat completed side effects.

## Update history

- 2026-11-23: Added a durable functions section (GA in December 2025, up to one year, checkpoint/replay) and redrew the Lambda, Step Functions, and Fargate boundary; removed App Runner as an option (closed to new customers on April 30, 2026; new projects should use ECS Express Mode); noted that the on-demand function timeout limit rose to 30 minutes in November 2026.

## References

- [Understanding Lambda invocation methods](https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html)
- [Understanding retry behavior in Lambda](https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html)
- [Understanding Lambda function scaling](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html)
- [Lambda container images](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)
- [AWS Fargate or AWS Lambda decision guide](https://docs.aws.amazon.com/decision-guides/latest/fargate-or-lambda/fargate-or-lambda.html)
- [Lambda durable functions](https://docs.aws.amazon.com/lambda/latest/dg/durable-functions.html)
- [AWS Lambda announces durable functions (2025-12-02)](https://aws.amazon.com/about-aws/whats-new/2025/12/lambda-durable-multi-step-applications-ai-workflows/)
- [Lambda quotas](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)
- [Announcing 30-minute timeout for on-demand AWS Lambda Event Functions](https://aws.amazon.com/blogs/compute/announcing-30-minute-timeout-for-on-demand-aws-lambda-event-functions/)
