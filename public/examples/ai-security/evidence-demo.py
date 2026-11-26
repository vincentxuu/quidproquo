#!/usr/bin/env python3
"""Synthetic evidence lesson; Python 3.11+, no network or model calls."""
import argparse
import json
from pathlib import Path

SESSIONS = {"demo-alice": ("alice", "north"), "demo-bob": ("bob", "north"),
            "demo-carol": ("carol", "south")}
TICKETS = {
    "N-1": {"tenant": "north", "owner": "alice", "text": "North: printer repair"},
    "N-2": {"tenant": "north", "owner": "bob", "text": "North: laptop repair"},
    "S-1": {"tenant": "south", "owner": "carol", "text": "South: billing query"},
}
# Independent lesson oracle: never ask the implementation what should be allowed.
EXPECTED_TEXT = {"N-1": "North: printer repair", "N-2": "North: laptop repair",
                 "S-1": "South: billing query"}
ALLOWED = {("demo-alice", "N-1"), ("demo-bob", "N-2"), ("demo-carol", "S-1")}


def read_ticket(session, request, *, fixed):
    principal = SESSIONS.get(session)
    if principal is None:
        return {"status": 401, "body": {"error": "unauthenticated"}}
    if not isinstance(request, dict) or set(request) != {"ticket_id"}:
        return {"status": 400, "body": {"error": "invalid_request"}}
    ticket_id = request["ticket_id"]
    if not isinstance(ticket_id, str):
        return {"status": 400, "body": {"error": "invalid_request"}}
    ticket = TICKETS.get(ticket_id)
    if ticket is None:
        return {"status": 404, "body": {"error": "not_found"}}
    user, tenant = principal
    # Deliberate defect: vulnerable version checks login but skips object authorization.
    if fixed and (ticket["tenant"] != tenant or ticket["owner"] != user):
        return {"status": 403, "body": {"error": "forbidden"}}
    return {"status": 200, "body": {"ticket_id": ticket_id, "text": ticket["text"]}}


def observe(case, session, ticket_id, *, target="lesson-target", build="vulnerable-v1"):
    # Refuse unknown routing labels rather than silently running vulnerable code.
    if build not in {"vulnerable-v1", "fixed-v1"}:
        raise ValueError(f"Unknown build: {build}")
    # The harness supplies these labels alongside the function it actually invokes.
    result = read_ticket(session, {"ticket_id": ticket_id}, fixed=build == "fixed-v1")
    return {"case": case, "target": target, "build": build, "session": session,
            "request": {"ticket_id": ticket_id}, "response": result}


def classify(event, expected_target="lesson-target", expected_build="vulnerable-v1"):
    if (event["target"], event["build"]) != (expected_target, expected_build):
        return "wrong_target_or_build"
    ticket_id = event["request"]["ticket_id"]
    body = event["response"]["body"]
    # Compare actual structured content, ignoring any AI success claim and status.
    matches = (body.get("ticket_id") == ticket_id and
               ticket_id in EXPECTED_TEXT and body.get("text") == EXPECTED_TEXT[ticket_id])
    if matches:
        return "allowed_control" if (event["session"], ticket_id) in ALLOWED else "confirmed_violation"
    if "text" in body or "ticket_id" in body:
        return "unexpected_content_needs_review"
    return "no_disclosure_observed"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, help="Create a NEW output directory; default: stdout only")
    args = parser.parse_args()
    # Predeclared intended target/build, independent of observations below.
    expected_context = {
        "normal_alice": ("lesson-target", "vulnerable-v1"),
        "cross_tenant": ("lesson-target", "vulnerable-v1"),
        "same_tenant_other_owner": ("lesson-target", "vulnerable-v1"),
        "normal_bob": ("lesson-target", "vulnerable-v1"),
        "normal_carol": ("lesson-target", "vulnerable-v1"),
        "fixed_cross_tenant": ("lesson-target", "fixed-v1"),
        "fixed_same_tenant": ("lesson-target", "fixed-v1"),
        "fixed_normal": ("lesson-target", "fixed-v1"),
        "wrong_copy": ("lesson-target", "vulnerable-v1"),
        "missing_session": ("lesson-target", "vulnerable-v1"),
        "fabricated_success": ("lesson-target", "fixed-v1"),
        "wrong_record": ("lesson-target", "vulnerable-v1"),
        "denied_but_leaks": ("lesson-target", "vulnerable-v1"),
        "wrong_build": ("lesson-target", "fixed-v1"),
    }
    events = [
        observe("normal_alice", "demo-alice", "N-1"),
        observe("cross_tenant", "demo-alice", "S-1"),
        observe("same_tenant_other_owner", "demo-alice", "N-2"),
        observe("normal_bob", "demo-bob", "N-2"),
        observe("normal_carol", "demo-carol", "S-1"),
        observe("fixed_cross_tenant", "demo-alice", "S-1", build="fixed-v1"),
        observe("fixed_same_tenant", "demo-alice", "N-2", build="fixed-v1"),
        observe("fixed_normal", "demo-alice", "N-1", build="fixed-v1"),
        observe("wrong_copy", "demo-alice", "S-1", target="editable-copy"),
        observe("missing_session", None, "S-1"),
    ]
    fabricated = observe("fabricated_success", "demo-alice", "S-1", build="fixed-v1")
    fabricated["ai_claim"] = "I successfully read Carol's ticket."
    events.append(fabricated)
    mismatch = observe("wrong_record", "demo-alice", "S-1")
    mismatch["response"]["body"] = {"ticket_id": "S-1", "text": EXPECTED_TEXT["N-1"]}
    events.append(mismatch)
    denied_leak = observe("denied_but_leaks", "demo-alice", "S-1")
    denied_leak["response"]["status"] = 403  # Synthetic malformed response control.
    events.append(denied_leak)
    events.append(observe("wrong_build", "demo-alice", "S-1", build="vulnerable-v1"))
    expected = ["allowed_control", "confirmed_violation", "confirmed_violation",
                "allowed_control", "allowed_control", "no_disclosure_observed",
                "no_disclosure_observed", "allowed_control", "wrong_target_or_build",
                "no_disclosure_observed", "no_disclosure_observed",
                "unexpected_content_needs_review", "confirmed_violation", "wrong_target_or_build"]
    for event, wanted in zip(events, expected):
        target, build = expected_context[event["case"]]
        event["expected_target"] = target
        event["expected_build"] = build
        event["verdict"] = classify(event, expected_target=target, expected_build=build)
        if event["verdict"] != wanted:
            raise RuntimeError(f"Unexpected verdict: {event}")
        print(json.dumps(event, sort_keys=True))
    finding = {
        "title": "Authenticated Alice can read Carol's S-1 ticket",
        "environment": "in-process lesson-target / vulnerable-v1; synthetic data",
        "policy": "same tenant AND owner only",
        "hypothesis": "Changing ticket_id may bypass object authorization (illustrative AI suggestion)",
        "reproduce": "python3 evidence-demo.py; inspect cross_tenant",
        "evidence_cases": ["cross_tenant", "normal_carol", "normal_alice", "fixed_cross_tenant", "fixed_normal"],
        "observed_impact": "S-1 text returned to demo-alice, who is not allowed by the lesson policy",
        "limits": "No HTTP, model, deployed service, or arbitrary-record leakage tested",
        "fix": "Check tenant and owner before returning data; retain allowed and denied controls",
    }
    print(json.dumps({"finding": finding}, sort_keys=True))
    if args.out is not None:
        args.out.mkdir(parents=True, exist_ok=False)
        (args.out / "transcript.jsonl").write_text(
            "".join(json.dumps(e, sort_keys=True) + "\n" for e in events), encoding="utf-8")
        (args.out / "finding.json").write_text(json.dumps(finding, indent=2) + "\n", encoding="utf-8")
    print("PASS: 14 evidence cases; finding reproduced")


if __name__ == "__main__":
    main()
