#!/usr/bin/env python3
"""In-process authorization lesson. Fake identities/data; no HTTP or model calls."""
from dataclasses import dataclass
import json


@dataclass(frozen=True)
class Principal:
    user_id: str
    tenant: str


# Stand-in for a trusted authentication middleware result, NOT real tokens.
# Never accept a user_id/tenant claim in request JSON as authentication.
DEMO_SESSIONS = {
    "demo-alice": Principal("alice", "north"),
    "demo-bob": Principal("bob", "north"),
    "demo-carol": Principal("carol", "south"),
}
TICKETS = {
    "N-1": {"tenant": "north", "owner": "alice", "text": "North: printer repair"},
    "N-2": {"tenant": "north", "owner": "bob", "text": "North: laptop repair"},
    "S-1": {"tenant": "south", "owner": "carol", "text": "South: billing query"},
}


def response(status, **body):
    return {"status": status, "body": body}


def read_ticket(session, request):
    # In a real service, verified middleware supplies principal here.
    principal = DEMO_SESSIONS.get(session)
    if principal is None:
        return response(401, error="unauthenticated")
    # Reject identity claims rather than silently trusting them.
    if not isinstance(request, dict) or set(request) != {"ticket_id"}:
        return response(400, error="invalid_request")
    ticket_id = request["ticket_id"]
    if not isinstance(ticket_id, str):
        return response(400, error="invalid_request")
    ticket = TICKETS.get(ticket_id)
    if ticket is None:
        return response(404, error="not_found")
    # Deliberately narrow lesson policy: same tenant AND owner.
    if ticket["tenant"] != principal.tenant or ticket["owner"] != principal.user_id:
        return response(403, error="forbidden")
    return response(200, ticket_id=ticket_id, text=ticket["text"])


def main():
    cases = [
        ("own_ticket", "demo-alice", {"ticket_id": "N-1"}, 200),
        ("other_tenant", "demo-alice", {"ticket_id": "S-1"}, 403),
        ("same_tenant_other_owner", "demo-alice", {"ticket_id": "N-2"}, 403),
        ("forged_identity", "demo-alice", {"ticket_id": "S-1", "user_id": "carol", "tenant": "south"}, 400),
        ("other_owner_allowed", "demo-bob", {"ticket_id": "N-2"}, 200),
        ("second_tenant_allowed", "demo-carol", {"ticket_id": "S-1"}, 200),
        ("missing_auth", None, {"ticket_id": "N-1"}, 401),
        ("unknown_ticket", "demo-alice", {"ticket_id": "missing"}, 404),
        ("invalid_id_type", "demo-alice", {"ticket_id": ["N-1"]}, 400),
    ]
    for name, session, request, expected in cases:
        result = read_ticket(session, request)
        assert result["status"] == expected, (name, result)
        if expected != 200:
            assert set(result["body"]) == {"error"}, (name, result)
        else:
            assert result["body"]["text"] == TICKETS[request["ticket_id"]]["text"]
        print(json.dumps({"case": name, **result}, sort_keys=True))
    print("PASS: 9 cases; denied responses contain no ticket content")


if __name__ == "__main__":
    main()
