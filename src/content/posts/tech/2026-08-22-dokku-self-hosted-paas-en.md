---
title: "Dokku: Turning One Docker Host into a Git-Push PaaS"
date: 2026-08-22
category: tech
type: deep-dive
tags: [dokku, paas, self-hosting, docker, devops]
lang: en
tldr: "Dokku combines a Git receiver, buildpacks or Dockerfiles, process models, Nginx, and plugins for a single-host Heroku workflow; simplicity comes from narrow orchestration scope."
description: "Dokku application deployment, buildpacks, process scaling, proxies, plugins, storage, backups, and single-host responsibility."
series:
  name: "Technology Choices in the AI Era"
  order: 83
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-dokku-self-hosted-paas)

[Dokku](https://dokku.com/docs/deployment/application-deployment/) turns a Linux and Docker server into a Heroku-like PaaS. After app creation, `git push` triggers build and release; Dockerfiles and existing images also work. The `dokku` CLI manages processes, config, domains, proxies, and linked services.

## Build, release, and run form a host pipeline

Herokuish buildpacks convert source to an image by default, or a Dockerfile can make the build explicit. Apps listen on `PORT`, Procfile process types split web and worker roles, and `ps:scale` sets counts. Nginx proxies web processes and round-robins their containers.

Builds execute repository content, making deploy keys, the Docker socket, caches, and host disk attack surfaces. Restrict push authority, pin builders and images, keep production SSH keys outside build contexts, and monitor image and cache growth.

## Plugins expand capability and operations

Core Dokku does not ship databases. Official or community plugins create and link data services or automate Let's Encrypt. Plugins may install root hooks, change proxies, and own state, so inventory provenance, versions, compatibility, and restoration before upgrades. An injected `DATABASE_URL` provides connectivity, not migrations, backups, or HA.

Container filesystems are volatile. [Storage](https://dokku.com/docs/advanced-usage/persistent-storage/) mounts host directories or volumes but binds apps to the host. Prefer object storage for uploads and database-native dumps or logs over copying live data directories.

## Single-host simplicity is the boundary

[Backup and Recovery](https://dokku.com/docs/advanced-usage/backup-recovery/) must cover Dokku config, apps, plugins, TLS, storage, and every datastore. Restored custom plugins can require installation triggers. Losing the host loses control plane, runtime, and local state together, so rehearse recovery onto a clean server.

Dokku fits small, single-host deployments with a CLI and Git workflow and a team comfortable operating Linux. Coolify or Dokploy add dashboards and remotes; Swarm or Kubernetes add multi-node scheduling. Test whole-host reconstruction, bad-release rollback, worker redelivery, certificate renewal, and database restore.

## References

- [Dokku application deployment](https://dokku.com/docs/deployment/application-deployment/)
- [Dokku process management](https://dokku.com/docs/processes/process-management/)
- [Dokku Nginx proxy](https://dokku.com/docs/networking/proxies/nginx/)
- [Dokku persistent storage](https://dokku.com/docs/advanced-usage/persistent-storage/)
- [Dokku backup and recovery](https://dokku.com/docs/advanced-usage/backup-recovery/)
