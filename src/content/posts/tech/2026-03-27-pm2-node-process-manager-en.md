---
title: "PM2: The Practical Choice for Node.js Process Management"
date: 2026-03-27
type: guide
category: tech
tags: [pm2, nodejs, process-manager, deployment]
lang: en
tldr: "PM2 keeps your Node.js app running on a server — auto-restarts on crash, supports cluster mode to max out CPU cores, and handles log management. Nearly every Node.js app deployed on a VM or VPS needs it."
description: "A practical guide to PM2's core features: daemon mode, cluster mode, log management, ecosystem config files, and zero-downtime restarts. Illustrated with DaoDao's production deployment architecture."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-03-27-pm2-node-process-manager)

When running Node.js on a server, you can't just do `node index.js` and close the terminal — the process dies with it. PM2 is a process manager that keeps your Node.js app running as a daemon, auto-restarts it on crash, enables cluster mode for multi-core CPUs, and centralizes log management.

These may sound like basic requirements, but solving them without PM2 means building a fair amount of infrastructure yourself.

## Installation and Basic Usage

```bash
npm install -g pm2
```

Start an application:

```bash
pm2 start dist/index.js --name my-api
```

List all running processes:

```bash
pm2 list
```

Output looks something like this:

```
┌────┬──────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┐
│ id │ name     │ namespace   │ version │ mode    │ pid      │ status │ cpu  │
├────┼──────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┤
│ 0  │ my-api   │ default     │ 1.0.0   │ fork    │ 12345    │ online │ 0%   │
└────┴──────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┘
```

Other commonly used commands:

```bash
pm2 restart my-api    # restart
pm2 stop my-api       # stop
pm2 delete my-api     # remove from list
pm2 logs my-api       # view logs (live stream)
pm2 monit             # interactive monitoring dashboard
```

## Cluster Mode

Node.js is single-threaded — one process can only use one CPU core. If your server has 8 cores, a single Node.js process wastes 7 of them.

PM2's cluster mode uses Node.js's built-in `cluster` module to automatically spawn multiple worker processes. Each worker runs a copy of your app, and PM2 distributes incoming traffic via round-robin:

```bash
pm2 start dist/index.js --name my-api -i max
```

`-i max` spawns as many workers as there are CPU cores. You can also specify a fixed count:

```bash
pm2 start dist/index.js --name my-api -i 4
```

One prerequisite for cluster mode: your application must be stateless. If you store in-memory state inside the process (e.g., sessions in local memory), different workers won't share that state and you'll get bugs. Store sessions in Redis, not process memory.

## Ecosystem Config File

Typing a long list of CLI flags every time you start the app gets tedious. Use an `ecosystem.config.js` file to manage your configuration:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "api",
      script: "dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      max_memory_restart: "500M",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
```

Start using the config file:

```bash
# development
pm2 start ecosystem.config.js

# production
pm2 start ecosystem.config.js --env production
```

`max_memory_restart` automatically restarts a process when it exceeds the memory threshold, preventing a memory leak from taking down the server.

## Log Management

By default, PM2 writes stdout and stderr to `~/.pm2/logs/`. The ecosystem config above redirects logs to `./logs/`, which is easier to find.

View logs in real time:

```bash
pm2 logs             # all processes
pm2 logs api         # only the "api" process
pm2 logs api --lines 100  # last 100 lines
```

Log files grow indefinitely. Use `pm2-logrotate` to rotate them automatically:

```bash
pm2 install pm2-logrotate
```

By default it rotates daily, also rotates when a file exceeds 10 MB, and retains the last 30 days.

## Zero-Downtime Restarts

A standard `pm2 restart` stops then starts the process, causing a brief service interruption. The `reload` command performs a rolling restart — in cluster mode, workers restart one by one while the others keep serving traffic:

```bash
pm2 reload my-api
```

This lets you deploy a new version without any downtime.

## PM2 at DaoDao

DaoDao's deployment stack is Docker + PM2 + GitHub Actions. Docker provides the containerized environment; PM2 manages the Node.js process inside the container.

Why use PM2 inside a container? Docker has its own restart policy, but PM2's cluster mode and log management aren't things Docker provides out of the box. For a Node.js backend running on a VM, cluster mode makes full use of all CPU cores — the throughput difference is significant in practice.

CI/CD flow:
1. GitHub Actions triggers, builds the Docker image
2. Pushes the image to a registry
3. SSHes into the server, pulls the new image, starts the new container
4. Inside the container, PM2 manages Node.js in cluster mode
5. Deployment complete; Discord webhook sends a notification

## Auto-Start on Boot

```bash
pm2 startup
```

PM2 outputs a command tailored to your OS. Copy and run it, and PM2 will automatically start all your apps after a reboot.

Save the current process list:

```bash
pm2 save
```

This tells PM2 which processes to restore after a reboot.

## Trade-offs

**Pros:**
- Simple setup — up and running in minutes
- Cluster mode plugs directly into Node.js with no application code changes
- Log management works out of the box

**Cons:**
- Cluster mode requires stateless applications; apps with in-memory state need refactoring first
- Far less capable and flexible than Kubernetes — though K8s is also far more complex
- In a fully containerized (Kubernetes) environment, process management is handled by K8s, making PM2's role redundant

PM2's positioning is clear: you have one (or a few) servers and need a straightforward way to manage Node.js processes. No Kubernetes, no serverless — just PM2.

## References

- [PM2 Official Docs](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [PM2 Cluster Mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/)
- [PM2 Ecosystem File](https://pm2.keymetrics.io/docs/usage/application-declaration/)
- [pm2-logrotate](https://github.com/keymetrics/pm2-logrotate)
- [DaoDao Technical Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — DaoDao's Docker + PM2 deployment architecture
