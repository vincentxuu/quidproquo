#!/usr/bin/env python3
"""Combine per-sector theCrag route JSON files into _all.json and print a summary.

Usage: python3 build_all.py <sector-dir>
"""
import json
import pathlib
import re
import sys

# FR grade ordering (as displayed by theCrag, FR system).
GRADE_ORDER = [
    "4b+", "4c", "4c+", "5a", "5a+", "5b", "5b+", "5c", "5c+",
    "6a", "6a+", "6b", "6b+", "6c", "6c+", "7a", "7a+", "7b", "7b+", "7c",
    "7c+", "8a", "8a+", "8b", "8b+", "8c", "8c+", "9a", "9a+", "9b", "9b+",
    "9c", "9c+",
]
RANK = {g: i for i, g in enumerate(GRADE_ORDER)}


def grade_key(grade):
    """Sort key for an FR grade string. Handles '6b+/c', '7c+/8a', '8a/a+' etc.

    Returns (best_rank, worst_rank) so a range grade sorts by its easiest
    end while still ordering sanely against single grades.
    """
    if not grade:
        return (999, 999)
    parts = [p for p in re.split(r"[/]", grade) if p]
    ranks = [RANK.get(p.strip(), 998) for p in parts]
    if not ranks:
        return (999, 999)
    return (min(ranks), max(ranks))


def main():
    sector_dir = pathlib.Path(sys.argv[1])
    sector_files = sorted(
        p for p in sector_dir.glob("*.json")
        if not p.name.startswith("_")
    )

    all_routes = []
    per_sector = []
    for path in sector_files:
        data = json.loads(path.read_text(encoding="utf-8"))
        for sector_block in data:
            sector = sector_block["sector"]
            routes = sector_block["routes"]
            for r in routes:
                r = dict(r)
                r["sector"] = sector
                all_routes.append(r)
            per_sector.append((sector, sector_block["area_route_count"], routes))

    out = sector_dir / "_all.json"
    out.write_text(
        json.dumps(all_routes, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    print(f"wrote {out} ({len(all_routes)} routes)")
    print()
    print(f"{'sector':<32}{'count':>6}  {'grade range (FR)'}")
    print("-" * 70)
    for sector, count, routes in per_sector:
        gs = [r["grade"] for r in routes if r.get("grade")]
        if gs:
            lo = min(gs, key=grade_key)
            hi = max(gs, key=grade_key)
            rng = f"{lo}-{hi}" if lo != hi else lo
        else:
            rng = "n/a"
        flag = "" if len(routes) == count else f"  (heading says {count})"
        print(f"{sector:<32}{len(routes):>6}  {rng}{flag}")
    print("-" * 70)
    print(f"{'TOTAL':<32}{len(all_routes):>6}")


if __name__ == "__main__":
    main()
