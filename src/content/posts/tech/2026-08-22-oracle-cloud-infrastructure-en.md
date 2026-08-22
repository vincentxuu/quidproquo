---
title: "Oracle Cloud Infrastructure: Start with Compartments, VCNs, and Fault Domains"
date: 2026-08-22
category: tech
type: deep-dive
tags: [oracle-cloud, oci, cloud-computing, kubernetes, infrastructure]
lang: en
tldr: "OCI is a full hyperscale cloud; architecture starts with tenancy and compartment IAM, region/AD/fault domains, and VCNs before selecting Compute, OKE, databases, and storage."
description: "Oracle OCI tenancy, compartments, IAM policies, regions and availability and fault domains, VCNs, Compute, OKE, databases, and HA."
series:
  name: "AI 時代的技術選擇"
  order: 69
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-oracle-cloud-infrastructure)

[Oracle Cloud Infrastructure (OCI)](https://docs.oracle.com/en-us/iaas/Content/GSG/Concepts/concepts-core.htm) is a full public cloud spanning VM, bare-metal, and GPU Compute, Oracle Kubernetes Engine (OKE), Functions, networking, object/block/file storage, and Autonomous, Base, and Exadata database services.

Calling it merely “Oracle's cloud” misses its governance and failure-domain vocabulary. Define a landing zone first or resources quickly scatter across the tenancy.

## Compartments are not folders

The tenancy is the top account boundary. Compartments organize resources and apply IAM policies and quotas. [IAM policies](https://docs.oracle.com/en-us/iaas/Content/Identity/Concepts/overview.htm) combine groups or dynamic groups, verbs, resource types, compartments, and conditions. Avoid placing everything and every administrator in the root compartment or giving application users static credentials.

Separate platform, networking, security, production, non-production, and team responsibilities. Use dynamic groups or workload identity for short-lived access from instances, Functions, and OKE. Test policies outside production; readable syntax does not make tenancy-wide `manage all-resources` safe.

## Region, AD, and fault domain are three layers

A region is geographic, an availability domain (AD) is an isolated datacenter group, and fault domains divide hardware and maintenance inside an AD. Not every region has multiple ADs, so do not copy a fixed three-zone template. Follow target-region topology and service resilience in [OCI HA guidance](https://docs.oracle.com/en-us/iaas/Content/cloud-adoption-framework/high-availability.htm).

Spread Compute across fault domains or ADs behind a load balancer. Block Volume attachment has scope constraints while Object Storage is regional. Cross-region DR needs another network, replicated compute and data, traffic switching, credentials, and runbooks—not only backups.

## VCNs are the network foundation

A VCN contains regional or AD subnets, routes, security lists or network security groups, and internet, NAT, service, or dynamic-routing gateways. [Network access control](https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/accesscontrol.htm) intersects compartment policies. Put applications in private subnets, administer through Bastion, VPN, or FastConnect, and verify service-gateway paths to OCI services.

Security Lists apply to subnets; NSGs apply to VNICs or resources. Mixing them without ownership makes rules unauditable. Enable flow logs, Audit, Cloud Guard, Vault keys, budgets, and quotas in the landing zone.

## Where OCI fits

OCI integration matters when Oracle Database or Exadata, bare metal, GPU/HPC, enterprise networking, and Oracle licensing are central. General cloud-native workloads work too, but compare skills, regional services, ecosystem, support, and exit paths—not Compute prices alone.

Revoke a dynamic-group policy, lose a fault domain, restore a volume or database, and disconnect NAT or a service gateway. Verify applications, alarms, audit, and DR runbooks operate in the intended compartment and region.

## References

- [OCI core services concepts](https://docs.oracle.com/en-us/iaas/Content/GSG/Concepts/concepts-core.htm)
- [OCI IAM overview](https://docs.oracle.com/en-us/iaas/Content/Identity/Concepts/overview.htm)
- [OCI Compute overview](https://docs.oracle.com/en-us/iaas/Content/Compute/Concepts/computeoverview.htm)
- [OCI network access control](https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/accesscontrol.htm)
- [OCI high availability](https://docs.oracle.com/en-us/iaas/Content/cloud-adoption-framework/high-availability.htm)
