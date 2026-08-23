---
title: "Stanford CS111 Lecture 22: Directory Lookup, Hard Links, and Symbolic Links"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 23
tldr: "Directories map text names to file-system-local inode numbers; hard links share inode identity and reference counts, while symlinks store paths and permit cross-filesystem references with loops and dangling targets."
description: "A reading of Stanford CS111 Spring 2026 Lecture 22: inode arrays, hierarchical directories, pathname traversal, working directories, hard links, and symbolic links."
draft: true
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-22-directories-links)

This is part 23 of [Reading Stanford CS111](/series/stanford-cs111), covering **Spring 2026 Lecture 22**, taught by Mendel Rosenblum on 2026-05-18 under [Directories and Links](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/22/Lecture22.pdf). It follows the public PDF and [calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar); inaccessible Canvas/Panopto video is not treated as reviewed. SHA-256 auditing shows Lecture 22 differs from adjacent Lectures 21 and 23, so there is no duplicate artifact.

## From inode blocks to persistent i-numbers

The previous lecture found file blocks from an inode; this one finds an inode from a name. The inode array is divided into blocks at known disk locations. Its index, the i-number, uniquely identifies an inode within that file system.

Original Unix placed a fixed inode array at the disk start, later Unix moved it to the middle for shorter seeks, and BSD distributed groups so inodes sit near data. Placement changes locality, not the i-number contract.

An open inode remains in memory and is written back on close. Even reads can update access time, so unchanged file bytes do not imply unchanged inode metadata. This is the deck model, not a claim that every modern mount updates atime on each read.

## A directory maps names to i-numbers

Directories map text names to i-numbers. Early PCs could use one disk directory; TOPS-10-like systems used one per user; hierarchy lets entries name child directories.

Linux/macOS separate levels with slash and Windows examples use backslash. A UNIX directory is a typed file containing unordered name/i-number pairs. The slide's fourteen-byte-name struct is historical, not a universal current format.

Only the OS writes directory contents because arbitrary writes could invent invalid i-numbers or corrupt namespace structure. Applications use directory interfaces rather than editing bytes.

## open("/a/b/c") traverses one component at a time

The kernel splits the path and begins at root inode 1 in [The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/22/Lecture22.pdf) model. It reads root blocks to find a, reads a's inode and blocks to find b, then finds c and reads c's inode before open completes.

The diagram maps a→17, b→23, and c→42. Subsequent read through the file descriptor uses inode 42 without repeating pathname traversal. Names select the object at open time; the descriptor supports later I/O ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/22/Lecture22.pdf)).

Each level can require inode and directory-block I/O, making caches important. Intermediate components must be traversable directories. The deck does not teach permission algorithms, but lookup is necessarily component-by-component.

## Absolute paths and working directories

The OS stores one working-directory identity per process; `pwd` prints its name. A leading slash starts at root, while a relative path starts at the process working directory.

The working directory is lookup state, not permanent string rewriting. Changing cwd changes what `a/b` selects, while an already-open descriptor continues to identify its earlier object.

## Hard links: many names, one inode

A directory entry is a link. Several entries may contain one i-number, making equal hard-link names for one file. The inode reference count tracks them; removing one decrements the count, and the file becomes deletable after the last link disappears.

With original c at inode 42, creating c and t in /g makes three entries name 42 and raises the count from one to three. None is an original versus shortcut; all are equal inode references ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/22/Lecture22.pdf)).

`rm` removes a hard link rather than necessarily erasing data. Every directory also has `.` naming itself and `..` naming its parent, using the same lookup model under file-system control.

## Why hard links have two limits

Users cannot hard-link directories because arbitrary links create cycles and complicate parent relationships and reclamation. Controlled dot entries do not grant permission to build arbitrary cycles.

Hard links cannot cross file systems because an i-number is locally meaningful. Another system's inode 42 may be unrelated. BSD added symlinks, which store a pathname rather than sharing an inode number.

## A symbolic link stores a pathname

A symlink is a typed file whose contents are another path. Lookup prepends that content to the remaining path. An absolute target restarts at root; a relative target continues from the directory containing the symlink.

After `ln -s e/f b` in /a, `cat /a/b/c` expands b to e/f and resolves /a/e/f/c. A relative target is based at the symlink's containing directory, not the caller's cwd.

Paths can cross file systems and name directories, but can loop or dangle. Dangling targets may be intentional. The kernel still needs a termination bound for cyclic expansion.

## Separate identity from indirection

A hard link adds a reference to one inode; edits through any name expose the same bytes, and unlink changes the count. A symlink has its own inode and path bytes; renaming or removing the target does not move that stored path.

Three checks separate them: hard links survive target rename by identity; symlinks can cross file systems; relative symlinks expand from their containing directory. These distinguish inode identity from pathname indirection.

## Update history

- 2026-08-22: Rewritten against Lecture 22 through inode placement, traversal, working directories, hard links, and symlinks, with adjacent-artifact SHA auditing.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 22 slides: Directories and Links](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/22/Lecture22.pdf)
- [POSIX link()](https://pubs.opengroup.org/onlinepubs/9799919799/functions/link.html)
- [POSIX symlink()](https://pubs.opengroup.org/onlinepubs/9799919799/functions/symlink.html)
