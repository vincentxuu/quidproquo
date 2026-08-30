---
title: "How to Use Cloudflare Observability: Workers Logs, Traces, and Analytics Engine"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, observability, analytics-engine, monitoring, logs, metrics]
lang: en
tldr: "Workers Observability is for debugging and request tracing; Workers Analytics Engine is for high-cardinality product events and custom metrics; GraphQL Analytics API is for querying existing Cloudflare product data. Keeping those roles separate prevents logs from becoming a database and keeps billing, monitoring, and product analytics from blending together."
description: "A practical guide to Cloudflare Workers Logs, real-time logs, Tail Workers, Logpush, traces, metrics, Workers Analytics Engine, SQL API, and GraphQL Analytics API for production apps on Cloudflare."
draft: false
series:
  name: "Cloudflare Edge Platform"
  order: 16
additionalSeries:
  - name: "Cloudflare AI Stack"
    order: 13
---

> 🌏 [中文版](/posts/tech/2026-08-30-cloudflare-observability-analytics-engine)

After moving a site or app to Cloudflare, the first question is usually how to run it. The next question appears quickly: where do you look when something breaks? Workers do not give you a machine to SSH into, and there is no traditional `/var/log` sitting on a VM. What you have is a distributed runtime: edge requests, binding calls, queue consumers, Durable Objects, Email handlers, AI Gateway calls, and R2/KV/D1 operations.

Cloudflare Observability is therefore more than sending `console.log` to a dashboard. The practical design question is: which data is for debug logs, which data belongs to request lifecycle traces, which data should become long-term per-customer or per-feature metrics, and which data is already collected by Cloudflare products such as HTTP, Firewall, or Load Balancing analytics?

This post separates the stack into three layers: [Workers Observability](https://developers.cloudflare.com/workers/observability/) for application runtime visibility, [Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/) for custom high-cardinality events, and [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/) for existing Cloudflare product analytics.

## Three Kinds of Data

I would decide the destination with this table:

| What you want to know | Where it belongs | Typical question |
|---|---|---|
| Why did one request return 500? | Workers Logs / traces | Which handler, binding call, or exception failed? |
| Did the deploy break production? | Real-time logs, metrics | Did error rate, CPU time, or duration move? |
| How many times did each customer use a feature? | Analytics Engine | Usage-based billing, feature adoption, per-customer health |
| What happened across Cloudflare network products? | GraphQL Analytics API | Requests, bytes, status codes, WAF / LB dimensions |
| How do we send telemetry to our existing stack? | OTLP export, Logpush, Tail Workers | Honeycomb, Grafana Cloud, Axiom, Sentry, S3/R2 |

This split matters more than the dashboard itself. Logs give context around a slice of execution. Metrics support long-term aggregation. Traces show the path of a request. Analytics APIs query aggregated product data already collected by Cloudflare.

Treating logs as a product database hurts later. Recording billing events only in `console.log` is just as fragile.

## Workers Logs: Make Requests Searchable First

[Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/) collects invocation logs, custom logs, errors, and uncaught exceptions. Newly created Workers have observability enabled by default; existing Workers can configure it in Wrangler:

```jsonc
{
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1
  }
}
```

For high-traffic production Workers, `head_sampling_rate` can be lowered. For example, `0.01` means 1% sampling. The official docs define the valid range as 0 to 1, and the default is 1 when unset.

I would use structured JSON logs from day one:

```ts
console.log({
  event: "email_send_attempt",
  requestId,
  userId,
  template: "magic_link",
  status: "queued",
});
```

Avoid logging only this:

```ts
console.log(`sent email for user ${userId}`);
```

The first form can be filtered by fields. The second can only be searched as text. Cloudflare's docs recommend JSON logs because Workers Logs can extract and index the fields.

The limits shape the logging strategy too. Workers Free includes 200,000 log events per day with 3 days of retention. Workers Paid includes 20 million log events per month with 7 days of retention, then charges per additional million log events. A single log entry is capped at 256 KB and oversized logs are truncated.

Logs should help debug behavior, but they should not carry full request bodies, prompts, emails, PII, or large objects. Store payloads that need retention in R2; logs should contain pointers, status, and minimal metadata.

## Real-Time Logs, Tail Workers, and Logpush

Workers Observability has several log exits:

- Real-time logs: near-real-time feedback during deploys or local debugging.
- Tail Workers: custom filtering, sampling, and transformation logic for telemetry.
- Workers Logpush: sends Workers Trace Event Logs to R2, S3, or logging providers.
- OpenTelemetry export: sends traces and logs to systems with an OTLP endpoint.

If a team already uses Grafana Cloud, Honeycomb, Axiom, or Sentry, the Cloudflare dashboard does not need to be the only observability surface. A clean split is to use the Cloudflare dashboard for first response, and export telemetry for longer incident workflows and cross-service correlation.

Tail Workers fit cases where telemetry needs filtering or transformation before it leaves Cloudflare. Logpush is useful for raw-event retention, compliance, audit trails, and long investigations. OTLP export is the more standard path for modern tracing and logging systems.

## Traces: See the Path of a Request

Workers tracing automatically captures fetch calls, binding operations, and handler invocations. This matters in the Edge Platform because one request can touch:

- Worker handler
- KV read
- D1 query
- Durable Object RPC
- R2 object read
- Queues producer
- External `fetch()`

Logs can tell you that an error happened. Traces help show where it happened. If a Durable Object is slow, a D1 query gets longer, or an external API times out, a trace points at the bottleneck faster than isolated logs.

AI apps have the same problem. One chat turn can involve AI Gateway, a Vectorize query, R2 document reads, D1 conversation writes, and agent tool calls. A final response status will not tell you whether the model, retrieval, database, or tool layer caused the issue.

## Metrics: Use Built-In Runtime Health First

Workers metrics and analytics include request counts, error rates, CPU time, wall time, and execution duration. These are the first layer of monitoring.

I would start with a few operational questions:

- Did request count suddenly drop to zero?
- Did 5xx or exception rate rise?
- Is CPU time getting close to plan limits?
- Is wall time being stretched by external APIs?
- Are queue consumers accumulating failures?
- Are Email handlers reporting `EXCEEDED_CPU`?

These do not require fully custom instrumentation on day one. First use Workers metrics and logs to understand runtime health, then write product-level events to Analytics Engine.

## Analytics Engine: Custom High-Cardinality Events

[Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/) has a different shape. Cloudflare describes it as unlimited-cardinality analytics that can be written from Workers and queried with a SQL API. It is not for asking why a single request failed. It is for:

- API usage by customer.
- Feature adoption by tenant or user segment.
- Per-customer latency or error health.
- Usage-based billing.
- AI app token, retrieval, tool-call, and gateway cache-hit metrics.

The Wrangler binding looks like this:

```jsonc
{
  "analytics_engine_datasets": [
    {
      "binding": "EVENTS",
      "dataset": "app_events"
    }
  ]
}
```

Then the Worker writes a data point:

```ts
env.EVENTS.writeDataPoint({
  blobs: ["email", "magic_link", "success"],
  doubles: [Date.now() - startedAt],
  indexes: [tenantId],
});
```

`blobs` are string dimensions for grouping and filtering. `doubles` are numeric values. `indexes` provide the sampling key. The official docs also point out that `writeDataPoint()` currently accepts ordered arrays, so field order must remain consistent. Although `indexes` is an array, only one index should be provided.

Queries go through the SQL API:

```sql
SELECT
  blob1 AS area,
  blob2 AS action,
  SUM(_sample_interval) AS events
FROM app_events
WHERE timestamp >= NOW() - INTERVAL '1' DAY
GROUP BY area, action
ORDER BY events DESC
LIMIT 20
```

Analytics Engine limits also matter: each `writeDataPoint` can include up to 20 blobs, 20 doubles, and 1 index; total blobs per data point are capped at 16 KB; each Worker invocation can write up to 250 data points; data is retained for three months.

## Pricing: Watch Written Points and Read Queries

Analytics Engine pricing is based on data points written and read queries. The official pricing page dated 2026-04-23 lists:

- Workers Free: 100,000 data points per day and 10,000 read queries per day.
- Workers Paid: 10 million data points per month and 1 million read queries per month; additional usage is $0.25 per million data points and $1.00 per million read queries.

The same page also says Workers Analytics Engine usage is not currently billed; the pricing is published in advance so teams can estimate costs once Cloudflare starts billing for usage.

For product design, I would treat one data point per request as the default ceiling. When multiple events are needed, they should represent distinct business events, not debug logs converted into analytics records.

## GraphQL Analytics API: Query Existing Cloudflare Data

[GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/) queries Cloudflare network and product analytics datasets, including HTTP requests, Firewall, and Load Balancing data. It is useful for dashboards, reports, and trend queries.

Its endpoint is:

```txt
https://api.cloudflare.com/client/v4/graphql
```

GraphQL Analytics API is separate from Analytics Engine. Analytics Engine stores custom events you explicitly write from Workers. GraphQL Analytics API queries product analytics Cloudflare already collects. The official docs also warn that GraphQL Analytics API data should not be used as the billing usage source, because it measures overall consumption or usage, while billable traffic uses a different definition.

## My First Production Observability Setup

For a small Cloudflare app, I would start with this:

1. Enable `observability.enabled` in Wrangler.
2. Set a production-appropriate `head_sampling_rate`.
3. Include `requestId`, `tenantId`, `route`, and `status` in request logs.
4. Keep full PII, prompts, and email bodies out of logs.
5. Write important business events to Analytics Engine: signup, email sent, queue job done, AI request, retrieval hit.
6. When using Queues, Workflows, or Email Service, include job IDs, workflow IDs, and message IDs in both logs and analytics events.
7. Add OTLP export or Logpush only when long retention or an existing incident workflow needs it.

This setup is not elaborate, but it answers three production questions: is it broken now, why did this one request fail, and which customer or feature is consuming the system?

## How This Connects to the AI Stack

AI apps need stronger observability because failures are rarely just HTTP 500s. A model can be slow, AI Gateway can fall back, Vectorize can miss, an R2 document can be absent, an agent tool can fail, and a Sandbox execution can time out.

I would record AI events with a stable schema:

```ts
env.EVENTS.writeDataPoint({
  blobs: ["ai", "chat", model, gatewayStatus],
  doubles: [tokensIn, tokensOut, latencyMs],
  indexes: [tenantId],
});
```

Then use logs and traces for single-request debugging, and Analytics Engine for long-term trends. That avoids stuffing full prompts into logs, while still making it possible to see when one tenant, one model, or one retrieval path starts misbehaving.

Observability is the safety net after an Edge Platform app goes live. In the AI Stack, it becomes the shared language for cost, quality, and reliability.

## References

- [Cloudflare Workers Observability](https://developers.cloudflare.com/workers/observability/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/)
- [Get started with Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/get-started/)
- [Workers Analytics Engine limits](https://developers.cloudflare.com/analytics/analytics-engine/limits/)
- [Workers Analytics Engine pricing](https://developers.cloudflare.com/analytics/analytics-engine/pricing/)
- [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/)
