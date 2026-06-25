---
title: "Managing Personal and Work GitHub Accounts with Git Conditional Includes"
date: 2026-03-13
type: guide
category: tech
tags: [git, ssh, workflow]
lang: en
tldr: "Use includeIf + SSH Host aliases to let Git automatically switch accounts based on directory path — no more manual switching."
description: "Maintaining both personal and work GitHub accounts? Use Git Conditional Includes with SSH config to let Git automatically pick the right account based on path."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-13-git-conditional-includes)

When juggling personal and work GitHub accounts, the most common pain points are committing with the wrong email or pushing from the wrong account. Manually running `git config` every time is tedious, and forgetting to do so leaves commits with incorrect author information. Git's `includeIf` directive combined with SSH Host aliases can fully automate this.

## Check the Current State

Start by reviewing your current Git configuration:

```bash
git config --list --show-origin
```

Pay attention to two things:

1. `user.name` / `user.email` in `~/.gitconfig` (the global default)
2. `remote.origin.url` in `.git/config` (which SSH host this repo uses)

## SSH Multi-Account Setup

First, check whether `~/.ssh/config` has Host aliases defined. For two GitHub accounts, the config typically looks like this:

```ssh
# Personal account
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal

# Work account
Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
```

For work repos, set the remote URL accordingly:

```bash
git remote set-url origin git@github-work:<org>/<repo>.git
```

## Git Conditional Includes

This is the core configuration. Add a condition to `~/.gitconfig`:

```ini
[user]
    name = personal-name
    email = personal@gmail.com

[includeIf "gitdir:~/works/<company>/"]
    path = ~/.gitconfig-work
```

Create `~/.gitconfig-work`:

```ini
[user]
    name = work-name
    email = work@company.com
```

Now, any repo under `~/works/<company>/` will automatically use the work account settings.

To do this via the command line:

```bash
# Create the work config file
git config -f ~/.gitconfig-work user.name "work-name"
git config -f ~/.gitconfig-work user.email "work@company.com"

# Add the conditional include
git config --global includeIf."gitdir:~/works/<company>/".path "~/.gitconfig-work"
```

## Verify

Inside a work repo directory, run:

```bash
git config user.name
git config user.email
```

You should see the work account details. Switch to any other directory and run the same commands — you should see the personal account.

## Overall Architecture

```
~/.gitconfig              ← Global config; personal account as default
~/.gitconfig-work         ← Work account settings
~/.ssh/config             ← SSH host aliases; separates keys by account

~/works/<company>/repo/   → Automatically uses work account + work SSH key
~/personal/repo/          → Personal account + personal SSH key
```

## Summary

The core advantage of `includeIf` is **zero cognitive overhead** — you never need to remember to switch; the directory path determines the account. This approach works best for developers with a consistent directory structure for work projects. One thing to watch out for: the `gitdir:` path must end with `/`, and `~` expansion may not work in older versions of Git. Using an absolute path is recommended for compatibility.

## References

- [git-config - Conditional includes](https://git-scm.com/docs/git-config#_conditional_includes)
- [Connecting to GitHub with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [OpenSSH ssh_config manual](https://man.openbsd.org/ssh_config)
