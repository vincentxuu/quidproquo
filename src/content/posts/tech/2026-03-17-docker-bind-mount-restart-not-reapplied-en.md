---
title: "docker restart Does Not Re-apply Volumes — Debugging a Bind Mount Failure"
date: 2026-03-17
type: guide
category: tech
tags: [docker, docker-compose, bind-mount, devops]
lang: en
tldr: "docker restart does not recreate the container, so changes to volumes in docker-compose.yml only take effect after running docker-compose down && up."
description: "A full walkthrough of debugging a Docker bind mount failure: the container and host saw different directory contents, files went missing, and how to prevent it from happening again after a power loss."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-17-docker-bind-mount-restart-not-reapplied)

## TL;DR

`docker restart` does not recreate the container, so after changing the `volumes` section in `docker-compose.yml`, you must run `docker-compose down && docker-compose up -d` for the changes to take effect. A plain restart will not update the bind mount.

## Context

A NestJS backend service running inside a Docker container had an export feature that moved processed PDFs to a designated directory — mapped via bind mount to `/data/exports/{category}/` on the host. One day the export feature suddenly broke.

## The Error

```
Log_Level: "warn"
Log_Message: "Export failed, target directory does not exist: /app/exports/category-a/files/type-b"

Log_Level: "error"
Log_Message: "BadRequestException: Export failed, please check the data directory and try again"
  at validateTargetDirectories
```

`validateTargetDirectories` checks that the target directory exists before starting an export. This error meant the path had simply disappeared.

## Debugging Steps

**Step 1: Confirm the host directory exists**

Initially suspected the directory was missing on the host, but it was there and had data in it.

**Step 2: Check inside the container**

```bash
docker exec my-app ls /app/exports/category-a/files
# Output: 20260317
```

The host had a `type-b/` directory, but inside the container there was only something called `20260317`. Tried to list it as a directory:

```bash
docker exec my-app ls /app/exports/category-a/files/20260317/
# ls: /app/exports/category-a/files/20260317/: Not a directory
```

`20260317` was a **file**, not a directory, and it matched today's date. The app had created it directly on the container's own filesystem — completely unrelated to the host. The two sides had entirely different contents, confirming that **the bind mount was not in effect**.

**Step 3: Check docker inspect**

```bash
docker inspect my-app --format '{{json .Mounts}}' | python3 -m json.tool
```

```json
{
  "Source": "/data/exports/category-a/files",
  "Destination": "/app/exports/category-a/files",
  "Mode": "rw",
  "RW": true
}
```

The configuration was there — it just wasn't being applied.

## Fix

```bash
docker-compose down && docker-compose up -d
```

`down` fully removes the container; `up` recreates it and applies the volumes configuration.

After recreation, verified bidirectional sync:

```bash
# HOST → CONTAINER
touch /data/exports/category-a/files/type-b/test.txt
docker exec my-app ls /app/exports/category-a/files/type-b/
# test.txt is visible ✓

# CONTAINER → HOST
docker exec my-app touch /app/exports/category-a/files/type-b/test2.txt
ls /data/exports/category-a/files/type-b/
# test2.txt is visible ✓
```

## Why This Happens

Docker bind mounts are applied when the container is **created** (`docker create`), not when it starts. `docker restart` / `docker stop + start` only stops and restarts the same container — it does not update the container's metadata, which includes the volumes configuration.

The correct workflow is: modify `volumes` in `docker-compose.yml` → `docker-compose down` (removes the container) → `docker-compose up` (recreates it with the new configuration).

## Collateral Damage

During the period when the bind mount was not working, the app performed an export (copy + delete):

```
/app/storage/files/.../file.pdf   ← moved from here (on the host, valid)
  → /app/exports/category-a/files/type-b/file.pdf  ← written to container filesystem (not mounted)
```

The source file on the host was deleted, while the destination was written to the container's own ephemeral filesystem. When the container was recreated, that filesystem was wiped — **the file was gone from both sides, with no way to recover it**. The only option was to re-upload.

## Preventing Failures After a Power Outage

After a power loss and reboot, if Docker containers start before the storage mount points are ready, the bind mounts may silently attach to an empty directory.

**Local disk**: a restart policy is sufficient.

```yaml
services:
  my-app:
    restart: unless-stopped
```

**NFS or network storage**: make Docker wait until NFS is ready before starting.

```ini
# /etc/systemd/system/docker.service.d/override.conf
[Unit]
After=network-online.target remote-fs.target
Wants=network-online.target remote-fs.target
```

```bash
systemctl daemon-reload && systemctl restart docker
```

## Takeaway

`docker restart` ≠ recreating the container. If you change the volumes configuration, always do `down + up`.

## References

- [Docker bind mounts](https://docs.docker.com/engine/storage/bind-mounts/)
- [docker compose up reference](https://docs.docker.com/reference/cli/docker/compose/up/)
- [docker compose down reference](https://docs.docker.com/reference/cli/docker/compose/down/)
- [Docker restart policies](https://docs.docker.com/engine/containers/start-containers-automatically/)
