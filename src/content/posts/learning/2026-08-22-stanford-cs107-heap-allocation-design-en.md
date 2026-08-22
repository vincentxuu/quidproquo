---
title: "Stanford CS107 Lecture 21: A First Heap Allocator and the Tension Between Speed and Space"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, systems-programming, memory-management, malloc, heap]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 22
tldr: "CS107 Lecture 21 starts with alignment, throughput, and utilization, then uses a bump allocator and an implicit free list to explain metadata, splitting, placement, internal and external fragmentation, and the need to coalesce freed blocks."
description: "A guided reading of Stanford CS107 Winter 2026 Lecture 21: the heap allocator interface, performance metrics, fragmentation, bump allocation, implicit free lists, block headers, placement, splitting, and coalescing."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-heap-allocation-design)

Lecture 20 ended by changing perspective from a client of `malloc` to its implementer. An allocator receives a contiguous heap and must arrange requests with different sizes and lifetimes inside it. Lecture 21 asks the first implementation question: what must an allocator remember to allocate and reclaim space repeatedly when it knows neither object types nor future requests?

The goal is not one universally best data structure. An allocator simultaneously wants correct alignment, fast responses, and high space utilization, but improving one can damage another. A bump allocator spends almost no time searching but cannot truly reuse individual blocks. An implicit free list reuses space but scans allocated blocks too. This lecture progressively adds bookkeeping and accounts for both the capability it buys and the cost it creates.

## Materials and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Offering: Winter 2026
- Official session: Lecture 21, February 25, 2026
- Official title: Managing the Heap, Take I
- Instructor: the syllabus lists Jerry Cain; the PDF does not identify a guest speaker
- Materials read: the official calendar, the complete official slides, the C17 draft allocation contract, the CS:APP Malloc Lab handout, and Doug Lea's allocator-design article
- Material gaps: the Canvas recording and AFS lecture code are not public; this article does not invent classroom narration, live demos, or starter-code details

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) identifies this as the first heap-management lecture. The complete slide path covers allocator goals, alignment, throughput and utilization, internal and external fragmentation, a bump allocator, block metadata, an implicit free list, first-fit search, placement and splitting, and previews of coalescing and in-place `realloc`. Other free-list organizations belong to the next lecture and are not presented here as conclusions of this one.

## A client sees bytes; an allocator sees a sequence of blocks

To a client, `malloc(n)` means “give me at least n bytes.” The allocator has a more concrete job: find sufficient space in its managed interval, return a suitably aligned payload pointer, and retain enough information for later `free` and `realloc` calls. C does not hand the allocator the client's type, array length, or final-use time.

The [C17 draft's allocated-object rules](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) require a returned pointer to be suitably aligned for any type with fundamental alignment; the allocated content is initially indeterminate. Those statements constrain implementation. Finding n adjacent bytes is insufficient if the payload begins at an invalid alignment, and clients cannot assume fresh storage is zeroed.

The heap can be modeled as a block sequence maintained by the allocator:

```text
heap start                                             heap end
   |                                                       |
   v                                                       v
+--------+----------------+--------+----------+--------+----+
| header | client payload | header | payload  | header | ...|
+--------+----------------+--------+----------+--------+----+
```

The header is private bookkeeping, not part of the requested payload. At minimum it commonly records block size and allocation state. The client pointer addresses the payload; on `free(ptr)`, the implementation moves back by a fixed offset to recover the header and learn the block extent. That also explains why `free` needs no length argument: the length did not disappear; the allocator stored it near the block.

## Correctness comes first: alignment and boundaries cannot be accidental

Suppose payloads must start on 8-byte boundaries. When a client requests 13 bytes, the allocator cannot begin the next block immediately after byte 13, because its next payload might be misaligned. It rounds the occupied size upward and includes the header. Padding is invisible to the client but consumes real heap space.

```c
size_t roundup(size_t n, size_t alignment) {
    return (n + alignment - 1) & ~(alignment - 1);
}
```

This bit trick assumes `alignment` is a power of two and that `n + alignment - 1` does not overflow. A real allocator checks the upper bound before adding. Otherwise an enormous request can wrap to a small number and receive an undersized block. The integer-representation lectures were not decorative prerequisites: size arithmetic is a memory-safety boundary.

Alignment also enables compact headers. If all block sizes are multiples of eight, their low three bits are otherwise zero, so one can hold an allocated flag. Code masks flags out when reading size and selects the bit when reading state. This saves a field but creates a strict invariant: every header access must use consistent masks, and pointer arithmetic must never treat the flag-bearing word as a pure size.

A practical check is to work three requests through the layout by hand: zero, a non-aligned size, and a value near `SIZE_MAX`. Compute header, padding, and total size. Tests containing only ordinary small values systematically hide alignment and overflow defects.

## Throughput and utilization are different rulers

Throughput describes how many allocation and release operations complete per unit time. Utilization compares live client payload with the heap acquired from the underlying system. “Fast” and “compact” cannot be collapsed into one score.

The [CS:APP Malloc Lab](https://csapp.cs.cmu.edu/3e/malloclab.pdf) likewise separates space utilization from throughput and measures both with traces. The trace matters because request order shapes allocator behavior. Equal-size allocations, interleaved releases, and a sudden large request create different searches and fragmentation patterns.

Extreme designs reveal the tension. Scanning the entire heap may find a close-sized hole but makes latency grow with block count. Always taking new space from the end avoids search but abandons old holes. More bookkeeping may shorten searches while metadata dominates small requests. Any engineering judgment therefore needs a workload assumption rather than a universal ranking.

## Internal fragmentation: space inside a block that the client cannot use

Internal fragmentation is occupied block space outside the client's valid payload. It includes headers, alignment padding, and extra space introduced by size classes or minimum block sizes. These bytes are distributed inside allocated blocks and unavailable to other requests.

For a 13-byte request, an implementation might need an 8-byte header and round the total to 24 bytes. The client still has a 13-byte object. The other 11 bytes are not a bonus array. Treating physical block size as client capacity depends on private layout and exceeds the API contract.

Metadata becomes proportionally expensive for tiny requests. A thousand one-byte allocations can spend most of the heap on headers and padding. Headers cannot simply vanish because `free` still needs block identity. The relevant question is whether the workload should allocate each object independently or use an arena, pool, or packed array to amortize management cost.

Calculations must state their denominator and time point. A single block can compare requested payload with its footprint; a trace can compare peak live payload with heap size. Those definitions support different decisions and should not be used to rank tools without qualification.

## External fragmentation: enough total space, no sufficiently large interval

External fragmentation distributes free space among separated holes. Three free 32-byte blocks provide 96 free bytes in total, yet cannot satisfy a 64-byte request if live blocks separate them. `malloc` must return one contiguous region, not package disconnected addresses as an ordinary C pointer.

```text
[used 32][free 32][used 32][free 32][used 32][free 32]
```

The size and physical adjacency of free blocks diagnose this problem. Adjacent free blocks can merge; holes separated by live objects cannot move because the allocator cannot rewrite client pointers.

The two forms of fragmentation can trade against one another. Rounding requests to larger classes increases internal waste but may produce regular, reusable blocks. Splitting close to the requested size reduces immediate padding but can leave unusable remainders. Real traces, not a one-step intuition, decide the outcome.

## A bump allocator: one pointer is fast, but `free` means almost nothing

A minimal allocator retains `next`, rounds each request, returns the current position, and advances:

```c
void *bump_malloc(size_t n) {
    size_t need = roundup(n, 8);
    if (need > (size_t)(heap_end - next)) return NULL;
    void *result = next;
    next += need;
    return result;
}
```

Its strengths are real: no free-list search, a short path, and little metadata. It is appropriate when all objects share a lifetime, such as an arena discarded wholesale after one compilation request. Its inability to reclaim individual objects does not make it bad for every setting.

General `malloc` clients, however, may free in arbitrary order. `next` alone does not identify earlier free blocks and cannot safely retreat when objects below it remain live. A no-op `free` preserves current live data but makes a long-running process grow until the heap is exhausted.

## An implicit free list makes the heap itself the list

An implicit free list stores no separate next pointer. Each header records total block size and an allocated bit. Starting at the heap beginning, adding the current size reaches the next physical block. The list is implicit in layout.

```text
[size=32,A][payload...][size=48,F][unused...][size=24,A][payload...]
      +32 bytes ----------> +48 bytes ---------->
```

Traversal depends on three invariants. Size denotes the allocator-defined footprint, not merely client payload. It is nonzero and aligned, so iteration progresses correctly. The heap has a clear termination rule, such as an epilogue header or known boundary. If a client overflow corrupts metadata, traversal can interpret arbitrary bytes as a size.

The elegance is that minimal metadata supports placement, release, and traversal. The cost is equally direct: a free-block search crosses allocated blocks too. As the heap accumulates live objects, search can become long even when very few holes exist. Lecture 22's explicit free list attacks exactly this cost.

## First fit, next fit, and best fit alter both search and hole shape

First fit scans from a fixed beginning and stops at the first sufficient free block, but repeated splitting can accumulate small holes near the beginning. Next fit resumes after the previous stopping point, avoiding repeated prefix scans while making results more dependent on history.

Best fit seeks the smallest sufficient free block to minimize the immediate remainder. On an implicit list, proving it is smallest generally requires a full scan, and the resulting tiny remainder may be unusable. “Best” names a local selection rule, not a guarantee of best overall throughput or utilization.

[Doug Lea's discussion of a general-purpose allocator](https://gee.cs.oswego.edu/dl/html/malloc.html) lists time, space, fragmentation, locality, and tunability as simultaneous goals and explicitly discusses their tradeoffs. Placement must be evaluated with free-list organization, splitting thresholds, coalescing timing, and workload—not by policy name alone.

To compare policies, keep the trace fixed and record average and worst search lengths, heap high-water mark, and failed requests. Changing both policy and trace destroys attribution.

## Splitting a large hole is useful only if the remainder is a legal block

After finding an oversized free block, the allocator can hand over the whole block or carve out the required prefix and retain a free remainder. Whole-block placement avoids another header but turns surplus into internal fragmentation. Splitting preserves reusable space, but not every remainder deserves to exist.

The remainder must hold free-block metadata, satisfy alignment, and support a minimum payload. If eight bytes remain and the header itself takes eight, listing that block provides no useful capacity and adds traversal work. Implementations define a minimum block size and let the allocation absorb smaller remainders.

Update order also protects invariants. Compute and validate allocated and remainder sizes first, write the new free header, then mark the prefix allocated. No intermediate state should overlap blocks or make traversal lose its endpoint.

Test requests immediately below and above the splitting threshold. After release, traverse the entire heap and verify that block sizes sum to the managed interval and every payload remains aligned.

## Clearing one bit in `free` is insufficient: adjacent holes must recombine

In an implicit list, `free(ptr)` can find the header and clear its allocated bit. If it stops there, adjacent free blocks remain separate holes. A later large request can fail even though combining them would suffice. Coalescing recognizes physically adjacent free blocks and replaces them with one valid block.

The right neighbor is easy to find by adding current size. The left neighbor is harder because a header describes itself, not where its predecessor begins. A basic implementation can walk again from the heap start. A boundary tag at the block end lets the next block read the previous size directly. Extra metadata buys faster neighbor discovery—the lecture's recurring tradeoff.

Coalescing can be immediate or deferred. Immediate merging removes adjacent small holes but may repeatedly merge and split blocks of a frequently requested size. Deferred merging shortens `free`, while a later allocation can inherit a large consolidation cost. Without a workload, neither label selects the answer.

## `realloc` preview: staying in place is ideal

The slides close by previewing in-place `realloc`. To shrink a block, an allocator can split its tail. To grow it, a free right neighbor may be merged while preserving the pointer. This avoids copying and keeps the client's address stable.

If adjacent capacity is insufficient, the allocator generally finds a new block, copies old content, and releases the old one. The [C17 draft](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) requires preservation up to the smaller old or new size; on success the old object is deallocated, while failure leaves it intact. Safe client code therefore does not overwrite its only pointer immediately:

```c
void *tmp = realloc(items, new_size);
if (tmp != NULL) {
    items = tmp;
}
```

The implementation must likewise respect overlap and failure atomicity: it cannot destroy the old block before knowing a replacement exists. Lecture 21 does not present the full algorithm, but the preview unifies placement, splitting, and coalescing. Clear block boundaries create more valid in-place paths.

## An allocator checklist from this lecture

Write invariants before the main `malloc` loop: payload alignment, whether header size includes itself, minimum block size, the allocated-bit location, heap termination, overflow rejection, legality of both split products, and coalescing timing.

The lasting lesson is not memorizing first fit. Every piece of metadata purchases an ability: a header enables traversal and reclamation, padding ensures alignment, search enables reuse, splitting improves utilization, and coalescing restores large intervals. Each also costs something. The next lecture extracts free blocks into an explicit list, once again buying a shorter search with more structure.

## References

- [Stanford CS107 Winter 2026 — Course Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 21 — Managing the Heap, Take I](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/21/Lecture21.pdf)
- [ISO C17 Committee Draft N1570 — Memory Management Functions](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
- [CS:APP Malloc Lab](https://csapp.cs.cmu.edu/3e/malloclab.pdf)
- [Doug Lea — A Memory Allocator](https://gee.cs.oswego.edu/dl/html/malloc.html)
