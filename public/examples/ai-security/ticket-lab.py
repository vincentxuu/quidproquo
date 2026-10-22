#!/usr/bin/env python3
"""Synthetic HTTP teaching target, Python 3.11+. Demo bearer strings are NOT authentication.

Run only in an environment you control. The vulnerable build deliberately omits
object authorization. No model, database, external network requests, or real data.
"""
import argparse
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from pathlib import Path
from urllib.parse import urlsplit

SESSIONS = {
    "demo-alice": ("alice", "north"),
    "demo-bob": ("bob", "north"),
    "demo-carol": ("carol", "south"),
}
TICKETS = {
    "N-1": {"tenant": "north", "owner": "alice", "text": "North: printer repair"},
    "N-2": {"tenant": "north", "owner": "bob", "text": "North: laptop repair"},
    "S-1": {"tenant": "south", "owner": "carol", "text": "South: billing query"},
}
BUILDS = ("vulnerable-v1", "fixed-v1")


def make_handler(build, target, audit_stream=None):
    events = []

    class Handler(BaseHTTPRequestHandler):
        # Closing each connection keeps this small single-process server simple.
        protocol_version = "HTTP/1.0"

        def log_message(self, *_args):
            pass

        def reply(self, status, body):
            raw = json.dumps(body, sort_keys=True).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(raw)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(raw)

        def token(self):
            header = self.headers.get("Authorization", "")
            return header.removeprefix("Bearer ") if header.startswith("Bearer ") else None

        def do_GET(self):
            path = urlsplit(self.path).path
            if path == "/health":
                return self.reply(200, {"target_id": target, "build": build,
                                        "fixture_revision": "tickets-v1",
                                        "policy": "same-tenant-owner"})
            if path == "/audit":
                if self.token() != "demo-operator":
                    return self.reply(403, {"error": "operator_required"})
                return self.reply(200, {"events": list(events)})
            return self.reply(404, {"error": "not_found"})

        def do_POST(self):
            if urlsplit(self.path).path != "/tools/read_ticket":
                return self.reply(404, {"error": "not_found"})
            principal = SESSIONS.get(self.token())
            resource = None

            def finish(status, body, reason):
                event = {
                    "event_id": f"evt-{len(events) + 1:06d}",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "target_id": target, "build": build,
                    "actor": principal[0] if principal else None,
                    "tenant": principal[1] if principal else None,
                    "action": "read_ticket", "resource": resource,
                    "decision": "allow" if status == 200 else "deny",
                    "status": status, "reason": reason,
                }
                if status == 200:
                    event["returned_ticket_id"] = body["ticket_id"]
                events.append(event)
                if audit_stream:
                    audit_stream.write(json.dumps(event, sort_keys=True) + "\n")
                    audit_stream.flush()
                self.reply(status, body)

            if principal is None:
                return finish(401, {"error": "unauthenticated"}, "missing_demo_identity")
            try:
                length = int(self.headers.get("Content-Length", "0"))
                if length < 1 or length > 4096:
                    raise ValueError("body_size")
                request = json.loads(self.rfile.read(length))
            except (ValueError, UnicodeDecodeError):
                return finish(400, {"error": "invalid_request"}, "invalid_json_or_length")
            if (not isinstance(request, dict) or set(request) != {"ticket_id"}
                    or not isinstance(request["ticket_id"], str)):
                return finish(400, {"error": "invalid_request"}, "invalid_arguments")
            resource = request["ticket_id"]
            ticket = TICKETS.get(resource)
            if ticket is None:
                return finish(404, {"error": "not_found"}, "unknown_resource")
            if build == "fixed-v1" and (
                    ticket["tenant"] != principal[1] or ticket["owner"] != principal[0]):
                return finish(403, {"error": "forbidden"}, "object_policy_denied")
            reason = "object_policy_allowed" if build == "fixed-v1" else "login_only_no_object_check"
            return finish(200, {"ticket_id": resource, "text": ticket["text"]}, reason)

    return Handler


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--build", choices=BUILDS, default="fixed-v1")
    parser.add_argument("--target", default="lesson-target")
    parser.add_argument("--audit", type=Path, help="NEW JSONL file; refuses to overwrite an existing file")
    args = parser.parse_args()
    stream = args.audit.open("x", encoding="utf-8") if args.audit else None
    try:
        with HTTPServer((args.host, args.port), make_handler(args.build, args.target, stream)) as server:
            # An advertised wildcard bind is not a routable client address.
            client_host = "127.0.0.1" if args.host == "0.0.0.0" else args.host
            print(json.dumps({"url": f"http://{client_host}:{server.server_port}",
                              "target_id": args.target, "build": args.build}), flush=True)
            try:
                server.serve_forever()
            except KeyboardInterrupt:
                pass
    finally:
        if stream:
            stream.close()


if __name__ == "__main__":
    main()
