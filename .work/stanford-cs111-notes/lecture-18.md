# Lecture 18: Magnetic Disks

- Date: 2026-05-08
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Editorial focus: disk geometry and timing, the linear-block abstraction, MMIO registers, interrupts, PIO, DMA, and modern queue/doorbell flow

## Extracted agenda cues

- Magnetic Disks
- Hard Disk Drive
- Actuator Arm
- Platters 1-10
- Spin at 5000-15000 RPM
- 2.5 inch and 3.5 inch sizes
- Actuator
- Organization of disk data
- ●   Circular tracks corresponding to a particular position of a disk head
- ○ Typical density today: few hundred thousand to about 500,000 tracks per radial inch
- ●   Tracks divided into 4096-byte sectors
- ○ Thousands to tens of thousands of sectors per track
- Platter
- ●   Typical total drive capacities: 500GB–30TB+
- ○ 1TB can store roughly 500 million pages of text
- Sector
- Reading and writing disks
- 1.   Seek: move actuator arm to position heads over desired track
- ○  Typical seek time: 3-10ms
- 2.   Select a particular head
- 3.   Rotational latency: wait for desired sector to pass under the head
- ○   One-half disk rotation on average (4ms @ 7500RPM)
- 4.   Transfer: read or write one or more sectors as they pass under the head
- ○  Typical transfer rates: 150–280 MBytes/sec
- 5.   Latency refers to the sum of seek time plus rotational latency; typically 5-15ms
- Disks are very high-tech devices
- ●   Read-write head must get extremely close to the disk surface
- ○   But not touch
- ○    Typical flying heights today are roughly 3–10 nm
- ○    For comparison, a human hair is about 80,000–100,000 nm thick
- ●   Tiny contaminants can damage the disk surface or head
- ●   Modern drives are sealed in extremely clean enclosures
- ○    Older drives used a landing zone directly on the disk surface
- ●   Modern HDDs also compensate for vibration and thermal expansion automatically
- Linear block API hides track/surface geometry, zone-dependent sector counts, and bad-sector remapping.
- Memory-mapped I/O divides physical addresses between ordinary memory and uncached device registers.
- Device-register bits carry parameters, status, and controls and do not behave like ordinary memory.
- Polling spins on ready; interrupts allow other CPU work, then trap to a kernel vector for service and acknowledgement.
- PIO makes the CPU move bytes; DMA moves bytes directly between device and physical memory after CPU setup.
- Modern interface: shared command/response queues, MMIO doorbell, DMA command fetch, DMA data transfer, DMA completion write, then interrupt.
- Final two slides are historical images of magnetic tape and a System/360 datacenter; they introduce no additional executable agenda.

## Coverage decision

- All 18 public PDF pages are covered, including the historical-image ending.
- Hardware densities, capacities, flying heights, and timing/rate figures are explicitly scoped as deck snapshots rather than universal specifications.
- The deck does not teach SSTF/SCAN/C-SCAN or another disk scheduling policy despite the older draft's topic wording; none is inferred from another offering.
- Canvas/Panopto recording remains inaccessible, so no unseen-video claims are made.
