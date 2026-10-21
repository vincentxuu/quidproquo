#!/usr/bin/env python3
"""Validate sector JSON files against the required schema."""
import json
import pathlib
import sys

REQUIRED_ROUTE_KEYS = [
    "grade", "stars", "name", "url", "style", "length", "pitches", "bolts",
    "desc", "setter", "warnings",
]
REQUIRED_SECTOR_KEYS = ["sector", "url", "area_route_count", "routes"]


def main():
    sector_dir = pathlib.Path(sys.argv[1])
    problems = []
    for path in sorted(sector_dir.glob("*.json")):
        if path.name.startswith("_"):
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(data, list):
            problems.append(f"{path.name}: top level is not a list")
            continue
        for block in data:
            for k in REQUIRED_SECTOR_KEYS:
                if k not in block:
                    problems.append(f"{path.name}: sector block missing '{k}'")
            for r in block.get("routes", []):
                for k in REQUIRED_ROUTE_KEYS:
                    if k not in r:
                        problems.append(
                            f"{path.name}: route '{r.get('name')}' missing '{k}'")
                if not isinstance(r.get("stars"), int):
                    problems.append(
                        f"{path.name}: route '{r.get('name')}' stars not int")
                if not isinstance(r.get("warnings"), list):
                    problems.append(
                        f"{path.name}: route '{r.get('name')}' warnings not list")
                if r.get("url") and not r["url"].startswith("https://www.thecrag.com/"):
                    problems.append(
                        f"{path.name}: route '{r.get('name')}' bad url {r['url']}")
                if r.get("desc") and "\n" in r["desc"]:
                    problems.append(
                        f"{path.name}: route '{r.get('name')}' desc has newline")

    # combined file
    all_path = sector_dir / "_all.json"
    if all_path.exists():
        all_routes = json.loads(all_path.read_text(encoding="utf-8"))
        for r in all_routes:
            if "sector" not in r:
                problems.append(f"_all.json: route '{r.get('name')}' missing sector")

    if problems:
        print("PROBLEMS:")
        for p in problems:
            print(" -", p)
        sys.exit(1)
    print("OK: all sector files valid")


if __name__ == "__main__":
    main()
