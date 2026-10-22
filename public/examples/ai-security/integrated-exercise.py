#!/usr/bin/env python3
"""Run the synthetic HTTP exercise end to end; Python 3.11+, no model calls.

Save next to ticket-lab.py. This starts its own local targets and never accepts
an arbitrary external URL. Cloud/authorized-system exercises need a separate,
explicit scope and client configuration; this runner makes no claims about them.
"""
import argparse
from contextlib import contextmanager
from datetime import datetime
import json
import hashlib
from pathlib import Path
from queue import Queue, Empty
import subprocess
import sys
from threading import Thread
from urllib.error import HTTPError
from urllib.request import Request, urlopen

# The expected policy/outcomes are declared separately from the tested service.
CASES = [
    ("normal-alice", "demo-alice", "alice", "N-1", True, "North: printer repair"),
    ("same-tenant-owner", "demo-alice", "alice", "N-2", False, "North: laptop repair"),
    ("cross-tenant", "demo-alice", "alice", "S-1", False, "South: billing query"),
    ("normal-bob", "demo-bob", "bob", "N-2", True, "North: laptop repair"),
    ("normal-carol", "demo-carol", "carol", "S-1", True, "South: billing query"),
]


def request(base, path, token=None, payload=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    req = Request(base + path, headers=headers,
                  data=None if payload is None else json.dumps(payload).encode())
    try:
        response = urlopen(req, timeout=5)
    except HTTPError as error:
        response = error
    with response:
        return {"status": response.status, "body": json.loads(response.read())}


@contextmanager
def start_target(server, build, audit):
    process = subprocess.Popen(
        [sys.executable, str(server), "--port", "0", "--build", build,
         "--target", "lesson-target", "--audit", str(audit)],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    ready = Queue()
    Thread(target=lambda: ready.put(process.stdout.readline()), daemon=True).start()
    try:
        try:
            line = ready.get(timeout=5)
        except Empty as error:
            raise RuntimeError("Target startup timed out") from error
        if not line:
            raise RuntimeError("Target failed to start: " + process.stderr.read())
        record = json.loads(line)
        if record.get("build") != build:
            raise RuntimeError("Unexpected target build")
        yield record["url"]
    finally:
        process.terminate()
        try:
            process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=3)


def run(output, server):
    output.mkdir(parents=True, exist_ok=False)
    summaries = {}
    combined = []
    for build in ("vulnerable-v1", "fixed-v1"):
        folder = output / build
        folder.mkdir()
        observations = []
        with start_target(server, build, folder / "audit.jsonl") as base:
            health = request(base, "/health")
            if (health["status"] != 200 or health["body"].get("build") != build
                    or health["body"].get("target_id") != "lesson-target"):
                raise RuntimeError("Health response does not match the intended build")
            for case, token, actor, resource, allowed, expected_text in CASES:
                result = request(base, "/tools/read_ticket", token, {"ticket_id": resource})
                expected_status = 200 if allowed or build == "vulnerable-v1" else 403
                content_match = (result["body"].get("ticket_id") == resource
                                 and result["body"].get("text") == expected_text)
                passed = result["status"] == expected_status
                passed = passed and (content_match if expected_status == 200
                                     else set(result["body"]) == {"error"})
                row = {"case_id": case, "run_id": build, "actor": actor,
                       "request": {"ticket_id": resource}, "policy_allows": allowed,
                       "expected_status": expected_status, "actual": result,
                       "confirmed_unauthorized_read": not allowed and content_match,
                       "test_passed": passed}
                observations.append(row)
                if not passed:
                    raise RuntimeError("Unexpected wire result: " + json.dumps(row))
            audit = request(base, "/audit", "demo-operator")
            if audit["status"] != 200 or len(audit["body"].get("events", [])) != len(CASES):
                raise RuntimeError("Incomplete audit trace")
            events = audit["body"]["events"]
            disk_events = [json.loads(line) for line in (folder / "audit.jsonl").read_text().splitlines()]
            if disk_events != events:
                raise RuntimeError("Saved audit and served audit do not match")
            for index, (event, row) in enumerate(zip(events, observations), 1):
                if (event.get("actor") != row["actor"]
                        or event.get("resource") != row["request"]["ticket_id"]
                        or event.get("status") != row["actual"]["status"]
                        or event.get("build") != build
                        or event.get("target_id") != "lesson-target"
                        or event.get("event_id") != f"evt-{index:06d}"):
                    raise RuntimeError("Audit event does not match its HTTP observation")
                if event.get("decision") != ("allow" if row["actual"]["status"] == 200 else "deny"):
                    raise RuntimeError("Audit decision does not match observed result")
                if row["actual"]["status"] == 200 and event.get("returned_ticket_id") != row["request"]["ticket_id"]:
                    raise RuntimeError("Audit resource does not match returned ticket")
                datetime.fromisoformat(event["timestamp"])
                combined.append({"run_id": build, **event})
        (folder / "health.json").write_text(json.dumps(health, indent=2) + "\n")
        (folder / "transcript.jsonl").write_text("".join(json.dumps(row) + "\n" for row in observations))
        summaries[build] = {
            "requests": len(observations),
            "passed": sum(row["test_passed"] for row in observations),
            "unauthorized_reads": sum(row["confirmed_unauthorized_read"] for row in observations),
            "allowed_controls": sum(row["policy_allows"] and row["test_passed"] for row in observations),
        }
    report = {
        "scope": "Self-started local synthetic HTTP target; no model or third-party test",
        "python": sys.version.split()[0], "platform": sys.platform,
        "server_sha256": hashlib.sha256(server.read_bytes()).hexdigest(),
        "runner_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "policy": "same tenant AND owner; known demo bearer strings are not real authentication",
        "finding": "Alice read N-2 and S-1 in vulnerable-v1; fixed-v1 denied both",
        "evidence": ["vulnerable-v1/transcript.jsonl", "fixed-v1/transcript.jsonl"],
        "summary": summaries,
        "limits": ["Only five fixed cases per build", "No model effectiveness measured",
                   "No production, cloud deployment, or whole-product security claim"],
    }
    (output / "report.json").write_text(json.dumps(report, indent=2) + "\n")
    (output / "events.jsonl").write_text("".join(json.dumps(event) + "\n" for event in combined))
    timeline = ["# Observed HTTP events", "", "Event IDs are unique only within each run; use run_id + event_id.", ""]
    for event in sorted(combined, key=lambda row: row["timestamp"]):
        timeline.append(f"- {event['timestamp']} {event['run_id']}:{event['event_id']} "
                        f"{event['actor']} {event['resource']} {event['decision']} HTTP {event['status']}")
    (output / "timeline.md").write_text("\n".join(timeline) + "\n")
    print(json.dumps(summaries, sort_keys=True))
    print("PASS: 10 HTTP cases; two unauthorized reads blocked after the fix; three normal controls pass in each build")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True, help="NEW output directory; refuses overwrite")
    parser.add_argument("--server", type=Path, default=Path(__file__).with_name("ticket-lab.py"))
    args = parser.parse_args()
    if not args.server.is_file():
        parser.error("Save ticket-lab.py next to this file, or provide --server")
    run(args.out.resolve(), args.server.resolve())


if __name__ == "__main__":
    main()
