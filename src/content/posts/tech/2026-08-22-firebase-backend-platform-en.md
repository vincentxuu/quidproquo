---
title: "Firebase: The BaaS Boundary of Auth, Firestore, Functions, and Security Rules"
date: 2026-08-22
category: tech
type: deep-dive
tags: [firebase, baas, firestore, authentication, serverless]
lang: en
tldr: "Firebase moves quickly because client SDKs directly access managed Auth, Firestore, and Storage; the real backend contract lives in data models, Security Rules, Functions, and cost limits."
description: "Firebase Authentication, Firestore, Realtime Database, Cloud Functions, Security Rules, Emulator Suite, and selection tradeoffs."
series:
  name: "Technology Choices in the AI Era"
  order: 85
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-firebase-backend-platform)

[Firebase](https://firebase.google.com/docs) is not one database. Google's app-backend suite includes Authentication, Cloud Firestore, Realtime Database, Cloud Storage, Cloud Functions, Hosting, Cloud Messaging, App Check, Analytics, and Remote Config. It gives mobile and web clients rapid identity and realtime data while coupling architecture to several product contracts.

## Firestore and Realtime Database are different databases

Cloud Firestore centers on collections, documents, indexed queries, and snapshot listeners. Realtime Database is one JSON tree suited to presence and simple synchronized state. “Realtime” alone is not a reason to mix them; choose from query patterns, transactions, offline behavior, placement, and billing units.

Firestore requires indexes and often denormalizes data around reads. Listener updates, fan-out reads, and retries increase operations, so model costs with realistic documents, subscriptions, and traffic rather than stored gigabytes alone. Cross-document invariants need transactions, batched writes, or a trusted backend.

## Security Rules authorize the public API

When web or mobile SDKs access Firestore and Storage directly, [Security Rules](https://firebase.google.com/docs/firestore/security/get-started) evaluate every request. Validate identity, ownership, role, permitted fields, old-to-new transitions, and query shape. Hiding a UI button is never authorization.

Server and Admin SDKs bypass Firestore Rules and use Google Cloud IAM. Give Functions, CI, and service accounts minimal, environment-specific access and avoid long-lived JSON keys. App Check can reduce unofficial-client abuse but cannot replace user authorization.

## Functions add logic; events still need idempotency

Cloud Functions handles HTTP and callable requests plus Auth, Firestore, Storage, and Pub/Sub events. Triggers may retry or redeliver. Deduplicate by event or idempotency key and persist the state of payments and notifications; do not assume an event and downstream side effect share a transaction.

The [Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) tests Auth, Firestore, Rules, and Functions together. Cover allows and denials, roles and tenants, and attacker-crafted queries and writes. Production limits, latency, IAM, and some product behavior still differ.

Firebase fits mobile-first products, realtime and offline clients, push messaging, and prototypes that accept Google's managed ecosystem. Compare Supabase or Nhost for SQL, joins, and RLS; Convex for function-first reactive backends; Appwrite or PocketBase for more hosting control. Before launch test rule coverage, billing alerts, index migrations, export and restore, regional failure, and project isolation.

## References

- [Firebase documentation](https://firebase.google.com/docs)
- [Cloud Firestore data model](https://firebase.google.com/docs/firestore/data-model)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Test Firestore Security Rules](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Cloud Functions for Firebase](https://firebase.google.com/docs/functions)
- [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite)
