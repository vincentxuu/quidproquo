#!/usr/bin/env python3
"""Offline record checks for Python 3.11+. Never connects to a target."""
import json
import math
import sys
from pathlib import Path


def validate(doc):
    errors = []
    if not isinstance(doc, dict):
        return ["manifest must be an object"]

    def obj(parent, key):
        value = parent.get(key)
        if not isinstance(value, dict):
            errors.append(f"{key} must be an object")
            return {}
        return value

    def text(parent, key):
        value = parent.get(key)
        if not isinstance(value, str) or not value.strip():
            errors.append(f"{key} needs nonempty text")

    if doc.get("environment") not in ("local", "ctf", "cloud", "authorized"):
        errors.append("environment must be local, ctf, cloud or authorized")
    scope = obj(doc, "scope")
    for key in ("target", "basis", "automation_rule"):
        text(scope, key)
    actions = scope.get("allowed_actions")
    if not isinstance(actions, list) or not actions or any(
        not isinstance(a, str) or not a.strip() for a in actions
    ):
        errors.append("allowed_actions needs a nonempty list of action names")
    if scope.get("automation") not in ("allowed", "forbidden"):
        errors.append("automation must be explicitly allowed or forbidden")
    for section, keys in {
        "recipe": ("version", "initial_state", "observation"),
        "success": ("allowed_control", "denied_control", "finding"),
        "recovery": ("stop", "reset"),
    }.items():
        group = obj(doc, section)
        for key in keys:
            text(group, key)
    success = doc.get("success", {})
    if isinstance(success, dict):
        values = [success.get(k) for k in ("allowed_control", "denied_control", "finding")]
        if all(isinstance(v, str) for v in values) and len(set(values)) < 3:
            errors.append("controls and finding must describe distinct outcomes")
    limits = obj(doc, "limits")
    if limits.get("mode") not in ("manual", "automated"):
        errors.append("mode must be manual or automated")
    if limits.get("mode") == "automated" and scope.get("automation") != "allowed":
        errors.append("automated run requires explicit automation allowance")
    for key in ("max_requests", "max_minutes"):
        value = limits.get(key)
        if type(value) is not int or value <= 0:
            errors.append(f"{key} must be a positive integer")
    cost = limits.get("max_cost_usd")
    if type(cost) not in (int, float) or not math.isfinite(cost) or cost < 0:
        errors.append("max_cost_usd must be a finite nonnegative number")
    return errors


def main():
    if len(sys.argv) != 2:
        print("Usage: python3 experiment-preflight.py experiment-manifest.json", file=sys.stderr)
        return 2
    try:
        doc = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        print(f"Cannot read manifest: {exc}", file=sys.stderr)
        return 2
    errors = validate(doc)
    for error in errors:
        print(f"FAIL: {error}")
    if errors:
        return 1
    print("PASS: record checks only; authorization, safety and reproducibility are unverified.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
