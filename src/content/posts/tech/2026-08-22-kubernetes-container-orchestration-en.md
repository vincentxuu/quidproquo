---
title: "Kubernetes: Container Orchestration from Pods and Controllers to Declarative Reconciliation"
date: 2026-08-22
category: tech
type: deep-dive
tags: [kubernetes, containers, orchestration, cloud-native, devops]
lang: en
tldr: "Kubernetes is fundamentally API objects, controllers, and reconciliation loops—not YAML; it manages workload lifecycles without solving application state, data consistency, or organizational governance."
description: "Kubernetes control planes, Pods, Deployments, Services, ConfigMaps, Secrets, probes, autoscaling, storage, and selection boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 90
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-kubernetes-container-orchestration)

[Kubernetes](https://kubernetes.io/docs/concepts/) is a declarative control plane for containerized workloads. Teams submit API objects describing desired state, while controllers continuously reconcile actual state. Its value is common scheduling, discovery, rollout, self-healing, and extension—not turning all operations into YAML.

## The control plane coordinates; Nodes execute

The API server is the entry point, etcd stores cluster state, the scheduler assigns Pods, and controller managers reconcile resources. On Nodes, kubelet enforces Pod specs, a container runtime executes them, and the network data plane routes Services.

A Pod is the smallest deployment unit, not a durable machine. Deployments use ReplicaSets for stateless replicas and rolling updates. StatefulSets add stable identity and volume ordering but not database replication. DaemonSets place agents across Nodes, while Jobs and CronJobs model completion.

## A Service stabilizes addressing, not health semantics

Services select Pods by labels and expose stable virtual endpoints; Ingress or Gateway handles external HTTP routing. Incorrect selectors can reach incompatible versions or no endpoints. NetworkPolicy depends on CNI support, and default allow or deny behavior must be deliberate.

[Probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/) have separate jobs: startup protects slow initialization, readiness controls traffic, and liveness triggers restart. Putting transient database loss in liveness creates restart storms; making readiness depend on every downstream amplifies failures.

## Config and Secret are not a complete security system

ConfigMaps and Secrets separate configuration from images, but a Kubernetes Secret is a sensitive API object, not automatic end-to-end encryption. Enable etcd encryption, least-privilege RBAC, service-account controls, external secret management, auditing, and rotation. A workload allowed to read a Secret still receives plaintext.

Requests and limits affect scheduling and eviction. HPA, VPA, and cluster autoscaling address different dimensions and depend on metrics and application behavior. They do not erase cold starts, backpressure, database connection storms, or capacity ceilings.

PersistentVolumes and claims abstract provisioning, while access modes, zones, snapshots, replication, and restoration remain properties of the CSI and storage system. Recreated Pods do not imply restored data; test application-native backup and failover.

Kubernetes fits multi-team, multi-service organizations needing a standard runtime API, policy, operators, or hybrid infrastructure. Managed PaaS is often cheaper for a few services; prefer a managed control plane when a cluster is justified. Test node and zone loss, bad rollouts, probes, RBAC escalation, network isolation, quota exhaustion, control-plane recovery, and data restoration.

## References

- [Kubernetes concepts](https://kubernetes.io/docs/concepts/)
- [Kubernetes components](https://kubernetes.io/docs/concepts/overview/components/)
- [Kubernetes workloads](https://kubernetes.io/docs/concepts/workloads/)
- [Services, load balancing, and networking](https://kubernetes.io/docs/concepts/services-networking/)
- [Liveness, readiness, and startup probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/)
- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
