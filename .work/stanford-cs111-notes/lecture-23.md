# Lecture 23: File System Crash Recovery

- Date: 2026-05-20
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Editorial focus: crash models, update ordering, fsck, and write-ahead logging

## Duplicate-artifact audit and editorial split

- Lecture23 SHA-256: `a099b49ac2be90356272ebc1493b729c0e6d8db60808c86de9ce5bea96e73c54`.
- Lecture24 SHA-256: `ec9781e6326f0e9dd3504af48fa331d5a53b69345ae90dde0bdde14ce40bd624`.
- Different hashes do not establish different content. Both PDFs have 23 pages with identical headings, bullets, examples, and ordering; extracted text differs only in `/lost+found` and four periods.
- Series split: Lecture 23 owns pages 1–15 (crash model, fsck, ordered writes, WAL entry). Lecture 24 owns pages 16–23 (entry formats, transactions, replay, checkpoints, consistency/durability, fsync, media failure).

## Extracted agenda cues

- File System Crash Recovery
- ●   Chapter 14 up through Section 14.1
- Operating System Crash Recovery
- ●   Crash recovery isn't hard for most of an operating system
- ○ Everything is wiped out on reboot
- ○ Just start again with a clean slate
- ●   Doesn't work for a file system:
- ○ People expect information on disks to survive crashes
- Today's topic: how to recover from crashes without losing file data
- Challenges for file system crash recovery
- ●   Data lost
- ○ Recent changes may not have been written to disk yet
- ○ Delay writes: Original Unix: up to 30 seconds worth of changes
- ●   Inconsistency
- ○ Crash in the middle of a modification that affects multiple blocks
- ○ Examples:
- ■ Adding block to file: free map was updated, but inode updated to point to block
- ■ Creating link to a file: new directory entry created, but reference count not updated
- ○ Ideally disk would give us atomic multiblock operations, but they don't
- ●   The block cache may reorder writes
- Approach #1: repair after crash
- ●   Example: Unix fsck ("file system check")
- ○ During every system system startup fsck is executed
- ○ Checks to see if system was shut down cleanly; if so, no more work to do
- ○ Otherwise, scan file system: identify and fix inconsistencies
- ●   How to tell if the disk shut down cleanly?
- ○ Have shutdown code write a clean bit to file system when done
- ●   How to identify and fix problems?
- ○ Read all of file system metadata looking for inconsistencies and repair
- fsck consistency checks and repair
- ●   Read metadata
- ○ Inodes, Indirect, and doubly indirect blocks
- ○ Free map
- ○ Directories
