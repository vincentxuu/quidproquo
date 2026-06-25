---
title: "Downloading Files from a VPS Using SSH Config Aliases"
date: 2026-03-15
type: guide
category: tech
tags: [ssh, scp, vps, cli, docker]
lang: en
tldr: "Once SSH config is set up, scp works directly with aliases — no need to type out the full IP every time"
description: "How to use scp with SSH config aliases to download files from a VPS to your local machine"
draft: false
---

🌏 [中文版](/posts/tech/2026-03-15-scp-ssh-config-alias)

## TL;DR

Once `~/.ssh/config` is set up, `scp` works directly with aliases — no need to type the IP, port, and username every time.

## The Problem

When you need to pull a file from a VPS to your local machine, the straightforward approach is `scp`:

```bash
scp -P 22 root@your-vps-ip:/path/to/file .
```

But if you manage more than one VPS, or if the port isn't the default 22, remembering the IP and port for each server gets tedious fast.

## The Solution

`~/.ssh/config` lets you define an alias for each host, centralizing all connection details in one place:

```
Host daodao
    HostName your-vps-ip
    User root
    Port 22
    IdentityFile ~/.ssh/id_rsa
```

With this in place, `ssh daodao` is equivalent to `ssh -p 22 -i ~/.ssh/id_rsa root@your-vps-ip`.

The key insight is that **`scp` and `rsync` both respect `~/.ssh/config`**, so you can use the alias directly:

```bash
# Download a single file
scp daodao:/path/to/file .

# Download an entire directory
scp -r daodao:/path/to/dir ./local-destination
```

For large files or directories, `rsync` is the better choice — it supports incremental transfers and can resume interrupted operations:

```bash
rsync -avz daodao:/path/to/dir ./local-destination
```

- `-a`: preserve file permissions, timestamps, and other metadata
- `-v`: show transfer progress
- `-z`: compress during transfer, helpful on slow connections

## Advanced: Pulling Files from a Docker Container

If the file you need lives inside a Docker container on the VPS, there's one extra step. Using an nginx container as an example:

**Option 1: Two steps**

```bash
# First, copy the file from the container to the VPS
ssh daodao "docker cp nginx:/etc/nginx/nginx.conf /tmp/nginx.conf"

# Then pull it from the VPS to your local machine
scp daodao:/tmp/nginx.conf .
```

**Option 2: One-liner**

```bash
ssh daodao "docker cp nginx:/etc/nginx/nginx.conf /tmp/nginx.conf" && scp daodao:/tmp/nginx.conf .
```

`docker cp <container-name>:<path-inside-container> <path-on-vps>` moves the file out of the container, after which you download it from the VPS the same way as any other file.

## Key Takeaway

Both `scp` and `rsync` honor `~/.ssh/config`. Set up an alias once, and you can use the same name for SSH connections and file transfers alike. For files inside containers, use `docker cp` to move them to the host first, then follow the same download workflow.

## References

- [OpenSSH ssh_config manual](https://man.openbsd.org/ssh_config)
- [scp manual](https://man.openbsd.org/scp)
- [rsync documentation](https://rsync.samba.org/documentation.html)
- [docker cp reference](https://docs.docker.com/reference/cli/docker/container/cp/)
- [島島阿學 Technical Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
