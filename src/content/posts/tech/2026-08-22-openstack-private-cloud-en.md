---
title: "OpenStack: Not a Virtualization UI, but Cloud Services You Operate Continuously"
date: 2026-08-22
category: tech
type: deep-dive
tags: [openstack, private-cloud, iaas, virtualization, infrastructure]
lang: en
tldr: "OpenStack combines Keystone, Nova, Neutron, Glance, Placement, Cinder, and other services into multi-tenant IaaS; adopting it means staffing a cloud platform team, not finishing an installation."
description: "OpenStack core services, control and data planes, deployment tooling, multi-tenancy, HA, upgrades, and Proxmox or hyperscaler tradeoffs."
series:
  name: "Technology Choices in the AI Era"
  order: 71
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-openstack-private-cloud)

[OpenStack](https://docs.openstack.org/) is an open-source IaaS cloud operating system exposing APIs and dashboards for datacenter compute, networks, images, identity, and storage. It is neither one daemon nor a polished UI over KVM. Independently deployed and upgraded services compose each capability.

## A minimal cloud is already distributed

The [official minimum](https://docs.openstack.org/install-guide/openstack-services.html) includes Keystone identity, Glance images, Placement inventory, Nova compute, and Neutron networking, commonly joined by Horizon and Cinder block storage. Production also needs databases, message queues, load balancing, DNS, keys, telemetry, and object or file storage.

Nova creates instances through hypervisors on compute nodes. Neutron implements virtual networks through agents and plugins. Cinder drivers connect storage backends. APIs appear consistent while performance, HA, and features depend on the hypervisor, SDN, storage, drivers, and hardware.

## Multi-tenancy is value and attack surface

Keystone domains, projects, users, groups, roles, and service catalogs form tenant boundaries; quotas constrain consumption. Threat-model network isolation, security groups, image provenance, metadata, secrets and keys, host aggregates, and admin APIs. An overly broad control-plane credential compromises a cloud, not one VM.

Self-service APIs require capacity management. Flavors, Placement traits, availability zones, quotas, and schedulers must reflect CPU overcommit, NUMA, GPUs, bandwidth, and storage IOPS. Schedulable does not mean the workload meets its SLO.

## Do not hand-install production

The [Installation Guide](https://docs.openstack.org/install-guide/overview.html) calls its example a learning PoC, not production. Use Kolla-Ansible, OpenStack-Ansible, or a vendor distribution to automate packages or containers, configuration, certificates, database migrations, and HA topology.

Choose a release and deployment tool, then maintain an upgrade train. Test project release notes, APIs and database migrations, RPC compatibility, live migration, Neutron and Cinder drivers, and rollback in a production-like environment. Tenant VMs surviving does not prove a control-plane upgrade succeeded.

## OpenStack, Proxmox, or public cloud

OpenStack can fit extensive self-service tenancy, API-compatible private IaaS, unusual hardware, sovereignty, and datacenter scale. Proxmox is more direct for a few clusters and operators. Without a platform/SRE team or sufficient scale, public or managed private cloud often costs less overall.

Fail controllers, message queues, databases, compute hosts, Neutron paths, and Cinder backends. Upgrade a release and restore the control-plane database. Verify tenant workloads, quotas, audit, showback, and support runbooks under real failures.

## References

- [OpenStack documentation](https://docs.openstack.org/)
- [OpenStack Installation Guide overview](https://docs.openstack.org/install-guide/overview.html)
- [OpenStack core services](https://docs.openstack.org/install-guide/openstack-services.html)
- [OpenStack Nova documentation](https://docs.openstack.org/nova/latest/)
- [OpenStack deployment guides](https://docs.openstack.org/2026.1/deploy/)
- [OpenStack security guide](https://docs.openstack.org/security-guide/)
