---
title: "AWS SQS and SNS: One Stores Work, the Other Fans Out Events"
date: 2026-08-22
category: tech
type: deep-dive
tags: [aws-sqs, aws-sns, message-queue, pub-sub, serverless, background-jobs]
lang: en
tldr: "SQS is a pull-based durable queue and SNS is a push-based topic. Reliable fan-out commonly connects one SNS topic to multiple SQS queues rather than sharing one queue across services."
description: "SQS Standard and FIFO queues, visibility timeouts and DLQs, plus SNS fan-out, filtering, and the correct composition of both services."
series:
  name: "Technology Choices in the AI Era"
  order: 31
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-aws-sqs-sns)

[Amazon SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html) and [Amazon SNS](https://docs.aws.amazon.com/sns/latest/dg/welcome.html) often appear together but own different responsibilities. SQS stores messages for consumers to pull, process, and delete. SNS receives a publication and pushes it to HTTP, Lambda, email, SQS, and other subscriptions. When multiple services must reliably process one event, the standard topology fans one SNS topic out to multiple SQS queues.

## SQS Standard accepts duplicates and approximate ordering

Standard queues provide at-least-once delivery and best-effort ordering. Receiving a message does not delete it. The message becomes hidden from other consumers during the visibility timeout and is deleted after successful processing. If it is not deleted before timeout, it becomes visible again.

```text
ReceiveMessage -> invisible -> process -> DeleteMessage
                             \-> timeout -> visible again
```

Consumers must be idempotent. Set visibility long enough for normal work but short enough for timely crash recovery. Long tasks can extend it with ChangeMessageVisibility. AWS recommends Step Functions or smaller tasks for very long multi-step processing rather than treating visibility as a workflow checkpoint.

## FIFO ordering is scoped to message groups

FIFO queues preserve order inside a MessageGroupId. MessageDeduplicationId or content-based deduplication suppresses duplicate publication. Separate groups run in parallel; placing every message in one group serializes throughput.

FIFO does not make consumer side effects exactly once. A crash after processing but before deletion can still cause redelivery. Deduplication primarily protects the publish boundary; payments, email, and database writes still need idempotency keys.

## A DLQ isolates failures; it does not resolve them

A redrive policy sends repeatedly received messages to a dead-letter queue. The DLQ needs alarms, inspection, a repair and redrive workflow, and adequate retention. Creating a queue nobody monitors only delays data loss.

Long polling reduces empty receives and cost, while batch receive and delete improve efficiency. Encryption, queue policies, VPC endpoints, and KMS permissions matter when bodies or attributes expose tenants and data locations.

## SNS fans out; it does not track each consumer's work

SNS topics push to multiple endpoint types, and filter policies select subscriptions by attributes or body. Direct HTTP delivery follows SNS retry policy. An SQS subscription gives each downstream service its own backlog, DLQ, visibility timeout, and scaling boundary.

```text
order event -> SNS topic
                +-> fulfillment SQS
                +-> analytics SQS
                +-> notification SQS
```

Three worker services reading one SQS queue do not fan out; they compete for one delivery. Separate subscribed queues give all three services a copy.

## Selection boundaries

SQS and SNS are strong defaults for AWS-native systems with bursty workloads and no appetite for broker operations. RabbitMQ fits richer AMQP routing and low-latency broker topology. Kafka, Redpanda, and Pulsar fit long replay, partition logs, and stream processing.

Agent platforms can queue parsing, embedding, tools, and batch inference in SQS and publish state changes through SNS. Messages should carry task ID, tenant, attempt, and S3 URI. Consumers with external side effects use message or business IDs for idempotency rather than inferring a guarantee from FIFO branding.

## References

- [Amazon SQS queue types](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-queue-types.html)
- [Amazon SQS visibility timeout](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html)
- [Amazon SQS dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)
- [Amazon SNS fanout](https://docs.aws.amazon.com/sns/latest/dg/sns-common-scenarios.html)
