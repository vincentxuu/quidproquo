# Lecture 26: Flash Memory

- Date: 2026-05-29
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Artifact audit: Lecture26 SHA-256 `7745111abf5ce9fbc1a7bf5d7f0e633ad2adfbe87b5695c2490ba10482ad0ed5` differs from adjacent Lectures 25 and 27; no duplicate.
- Editorial focus: erase blocks, FTLs, wear leveling, garbage collection, and SSDs

## Extracted agenda cues

- Flash Memory
- ●   Flash memory has replaced magnetic disks in most devices
- ○ Phones, laptops, etc
- ○ Packaged into a storage device: solid state disks (SSDs)
- Flash compared to other memory technologies
- Comparison to magnetic disk:
- ● No moving parts, so more reliable, more shock-resistant
- ● ~100–1000× lower latency for random access
- ● Cost/bit 3-10x higher than disk
- Comparison to DRAM:
- ● Nonvolatile: values persist even if device is powered off
- ● Cost/bit 5-20x lower
- ● 100-1000x slower
- Flash memory cell characteristics
- ●   Reads are relatively fast
- ○ Typically ~10–100 microseconds
- ●   Flash cell writes are asymmetric:
- ○ Changing 1 → 0 is relatively fast (~100–1000 microseconds)
- ○ Changing 0 → 1 is much slower (~1000–10,000 microseconds)
- ●   Memory is accessed in pages
- ○ Typical sizes 4 Kbytes - 16 Kbytes)
- ○ More like a disk than main memory
- ●   Total chip capacity up to 2 Terabytes
- Flash memory weirdness: writes
- ●   Need to erase (write all "1"s) before writing a page
- ○ Storage divided into erase units (typically 1-8 Mbytes, many pages)
- ○ Slow: 1000 - 10,000 microseconds
- ●   Write: modifies an individual page, can only clear bits to 0
- ○ Effectively a logical AND operation
- ○ Can write a page multiple times but only clear more bits
- ○ Need to erase the "erase unit" containing the page to write a 1
- ●   Erasing wears out the erase unit
- ○ 100 - 100,000 times before it can't reliably hold information
- FTL direct-map failure and out-of-place block mapping.
- A-W-G page lifecycle and startup scan crash detection.
- Garbage collection, utilization U, and write amplification 1/(1-U).
- Hot/cold temperature segregation, wear leveling, cross-layer information loss, and TRIM.
