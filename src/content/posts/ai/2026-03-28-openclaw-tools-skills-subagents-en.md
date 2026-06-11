---
title: "OpenClaw Tools (Part 2): Skills System and Sub-Agents"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, skills, clawhub, sub-agents, skill-md, agent-skills]
lang: en
tldr: "Skills are AgentSkills-compatible SKILL.md folders with a 6-tier loading priority. ClawHub is the public marketplace. Sub-agents can nest up to 5 levels deep."
description: "OpenClaw's Skills system (loading priority, format, gating, ClawHub marketplace) and the Sub-Agent mechanism."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-tools-skills-subagents)

OpenClaw uses Skills to teach agents how to use tools, and Sub-Agents to let agents spawn subtasks. This post covers both systems.

## Skills System

### What Is a Skill

Each Skill is a directory containing a `SKILL.md` file (with YAML frontmatter and instructions). When loading, OpenClaw filters skills based on the environment, configuration, and whether required binaries exist.

### Loading Priority (Highest to Lowest)

| Priority | Source | Path |
|---|---|---|
| 1 (highest) | Workspace skills | `<workspace>/skills` |
| 2 | Project agent skills | `<workspace>/.agents/skills` |
| 3 | Personal agent skills | `~/.agents/skills` |
| 4 | Managed/local skills | `~/.openclaw/skills` |
| 5 | Bundled skills | npm package or OpenClaw.app |
| 6 (lowest) | Extra dirs | `skills.load.extraDirs` |

When skills share the same name, higher-priority ones override lower ones. Plugin skills are at the same level as `extraDirs`.

### SKILL.md Format

```markdown
---
name: image-lab
description: Generate or edit images via a provider-backed image workflow
metadata: {"openclaw": {"requires": {"bins": ["uv"], "env": ["GEMINI_API_KEY"]}}}
---

Instructions for the agent...
Use {baseDir} to reference the skill folder path.
```

### Gating (Filtering at Load Time)

`metadata.openclaw` controls when a skill is available:

| Field | Purpose |
|---|---|
| `always: true` | Always loaded |
| `os` | Restrict to specific platforms (`darwin`, `linux`, `win32`) |
| `requires.bins` | All binaries must be in PATH |
| `requires.anyBins` | At least one binary must be in PATH |
| `requires.env` | Environment variables must exist |
| `requires.config` | Config path must be truthy |
| `primaryEnv` | Maps to `skills.entries.<name>.apiKey` |

**Sandbox note:** `requires.bins` is checked at load time on the host. If the agent runs inside a sandbox, the binaries must also exist inside the container (install them via `setupCommand`).

### Advanced Frontmatter

| Key | Default | Description |
|---|---|---|
| `user-invocable` | `true` | Whether it appears as a user slash command |
| `disable-model-invocation` | `false` | Exclude from model prompt |
| `command-dispatch` | — | Set to `tool` to call a tool directly, bypassing the model |
| `command-tool` | — | Tool name to call when `command-dispatch: tool` is set |

### Config Overrides

```json5
{
  skills: {
    entries: {
      "image-lab": {
        enabled: true,
        apiKey: { source: "env", provider: "default", id: "GEMINI_API_KEY" },
        env: { GEMINI_API_KEY: "..." },
        config: { endpoint: "https://example.invalid", model: "nano-pro" }
      }
    }
  }
}
```

- `enabled: false` disables the skill
- `env` is injected into `process.env` at agent run start, and restored afterward
- `apiKey` supports plaintext or SecretRef
- `allowBundled` can restrict which bundled skills are available

### Session Snapshot

OpenClaw snapshots available skills when a session starts and reuses them throughout the same session. A skills watcher can hot reload when `SKILL.md` changes.

### Remote macOS Node

When a Linux Gateway is connected to a macOS node, macOS-only skills become available (the agent executes them via `nodes.run`).

### Token Cost

The overhead of skills in the system prompt:

- Base: 195 characters (when any skill is present)
- Per skill: 97 characters + name + description + location length
- Rough estimate: approximately 24+ tokens per skill

## ClawHub

OpenClaw's public skill marketplace. Browse at [clawhub.com](https://clawhub.com).

### Common Commands

```bash
openclaw skills search <keyword>     # Search
openclaw skills install <skill-slug> # Install to workspace/skills
openclaw skills update --all         # Update all
```

### Security Model

- Publishing requires a GitHub account registered for at least one week
- Skills that receive more than 3 independent reports are automatically hidden
- Moderators can manage visibility, delete, and ban

### Publishing (clawhub CLI)

```bash
clawhub sync --all    # Scan + publish updates
```

### Security Considerations

- **Treat third-party skills as untrusted code -- read them before enabling**
- Run untrusted input in a sandbox
- The skill directory's realpath must be within the configured root
- `skills.entries.*.env` and `apiKey` are injected into the host process, not the sandbox

## Sub-Agents

Agents can spawn child agents to handle independent tasks.

### Core Concepts

- Sub-agents have their own independent session, workspace, and sandbox
- Maximum nesting depth is 5 levels (`maxSpawnDepth`)
- The parent agent can monitor, steer, or terminate child agents

### Management Commands

```bash
/subagents list                    # List child agents
/subagents kill <id>               # Terminate
/subagents log <id>                # View logs
/subagents send <id> <message>     # Send a message
/subagents steer <id> <directive>  # Steer direction
/subagents spawn <config>          # Spawn a new child agent
```

### Session Tools

| Tool | Purpose |
|---|---|
| `sessions_list` | List available sessions |
| `sessions_history` | Retrieve conversation history |
| `sessions_send` | Send a message to another session |
| `sessions_spawn` | Create an isolated child session |

### Security

- In a sandbox environment, a child agent can only see its own session and sessions it has spawned
- Each child agent has its own independent tool permissions and sandbox configuration

## Summary

Skills make OpenClaw's capabilities infinitely extensible -- from community-contributed ClawHub skills to custom workspace skills. Sub-agents allow complex tasks to be decomposed and handled in parallel. Combined, an agent can spawn child agents to use specific skills for subtasks.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/tools/skills.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/skills.md) -- Skills system
- [docs/tools/clawhub.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/clawhub.md) -- ClawHub marketplace
- [docs/tools/sub-agents.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/sub-agents.md) -- Sub-Agents
- [docs/concepts/session-tool.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/session-tool.md) -- Session Tools
