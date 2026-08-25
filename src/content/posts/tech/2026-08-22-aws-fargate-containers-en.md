---
title: "AWS Fargate: No EC2 Management Does Not Mean No ECS Management"
date: 2026-08-22
category: tech
type: deep-dive
tags: [aws, fargate, ecs, containers, cloud-computing]
lang: en
tldr: "Fargate removes container-host operations, but task definitions, ECS services, VPCs, IAM, scaling, deployment, and observability remain your system."
description: "AWS Fargate and ECS responsibility boundaries, tasks, services, networking, IAM, storage, scaling, and Lambda/App Runner tradeoffs."
series:
  name: "Technology Choices in the AI Era"
  order: 51
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-aws-fargate-containers)

[AWS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html) is serverless container compute for ECS and EKS. With ECS, you stop creating EC2 clusters, patching hosts, and tuning bin packing. You still define images, CPU and memory, ports, health checks, IAM, networking, desired count, and deployment policy.

## A task deploys; a service keeps it running

A task definition is a versioned runtime specification. It may contain a primary container and tightly coupled sidecars. Containers in one task share a lifecycle and cannot scale independently, so APIs, workers, and scheduled jobs usually use separate task families.

Run one-off batch work as tasks. An ECS service maintains desired count for a persistent API and connects load balancing, health checks, and rolling or blue/green deployment. Application Auto Scaling changes task count; concurrency inside a task remains a function of the application and its CPU and memory.

## Every task enters your VPC

Fargate requires `awsvpc`. [Each task receives an ENI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html), private IP, and security groups. A private subnet needs NAT for public services or VPC endpoints for dependencies such as ECR, CloudWatch, and Secrets Manager. Their cost and failure modes are often easier to underestimate than the container itself.

Separate the task execution role from the task role. ECS uses the former to pull images, publish logs, and obtain startup secrets. The application uses the latter for AWS APIs. Do not turn broad execution permissions into application permissions or bake static AWS keys into images.

## Serverless still has state boundaries

Tasks are replaceable, so local disk is ephemeral. The [storage documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-storage.html) defines configurable ephemeral storage; durable data belongs in S3, RDS, DynamoDB, or an appropriate network filesystem. On termination, stop accepting work and finish or requeue in-flight jobs.

After choosing a CPU/memory combination, monitor utilization, OOMs, startup, deployment failures, target response, and queue depth. Validate scale-in protection, minimum healthy percentage, circuit breakers, and rollback through failure injection.

## Fargate, Lambda, App Runner, or EC2

Fargate fits standard containers, persistent services or workers, sidecars, deep VPC integration, and teams that do not want hosts. Lambda fits short bursty events; App Runner requires less setup for a simple HTTP service; ECS on EC2 can suit steady high utilization, unusual hardware, or host control.

Fargate delegates host responsibility rather than eliminating platform engineering. Stop a task, break an image pull, exhaust subnet addresses, and disable NAT or an endpoint. Confirm deployment, alarms, and rollback recover the service.

## References

- [Amazon ECS task definition differences for Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html)
- [Fargate task networking](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html)
- [Fargate task ephemeral storage](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-storage.html)
- [Choosing an AWS container service](https://docs.aws.amazon.com/decision-guides/latest/containers-on-aws-how-to-choose/choosing-aws-container-service.html)
