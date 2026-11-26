The previous chapter established that Alice can read N-1 and that N-2 belongs to Bob. You ask AI whether an authorization problem exists. It answers “possible IDOR.” That is not yet a finding an engineer can act on: the conditions that would confirm or disprove it are missing.

This chapter makes suspicions testable. Read the [attack-surface chapter](/posts/ai/2026-10-22-ai-security-attack-surface-en) and understand basic HTTP first. Your deliverable connects a model suggestion to observations, one changed variable, confirmation, counterevidence, and an inconclusive state.

## An ID is not a vulnerability

Ticket IDs belong in requests: users need to select resources. The question is whether the backend checks the acting identity’s permission. PortSwigger’s [User ID lab](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter) demonstrates a controllable ID combined with missing authorization. It does not imply that every ID parameter is vulnerable.

Our policy requires both the same tenant and ownership. Alice and Bob belong to north; Carol belongs to south. Separate the hypotheses:

| Hypothesis | Single change | Secure expectation / confirmation |
|---|---|---|
| H-OWNER: ownership check missing | Keep Alice’s session; N-1 becomes N-2 | Deny; confirm only if Bob’s actual ticket content returns |
| H-TENANT: tenant check missing | Keep Alice’s session; N-1 becomes S-1 | Deny; confirm only if Carol’s actual content returns |
| Legitimate control | Bob reads N-2 | Allow, establishing the resource and normal function exist |

This separation explains partial fixes: adding a tenant check might block S-1 while still exposing N-2 to Alice. Cross-tenant tests alone can miss an ownership boundary inside one organization.

## Give the model a table that can disprove it

Download the [hypotheses and prompt template](/examples/ai-security/attack-hypotheses.json). It contains three human-authored candidates, including the later attachment-injection case, rather than measured model output. You may supply its `model_prompt`, observations, and source code to your own model after removing real credentials and customer data.

A candidate needs at least:

```json
{
  "id": "H-OWNER",
  "change": "same Alice session; N-1 -> N-2",
  "confirm": "N-2 content equals Bob owner control",
  "disprove": "403 and no ticket content",
  "inconclusive": "wrong target, timeout, or missing baseline"
}
```

Confirmation deliberately excludes “the model said it worked.” A `200` containing Alice’s N-1 may mean the changed ID was ignored. An empty shell, generic error, or login page also fails to prove N-2 access.

Source-code clues need the same discipline. A direct lookup and return looks suspicious, but an outer middleware might already enforce permission. Ask for the route from request → authentication → resource lookup → policy → response, marking missing context as something to investigate rather than declaring a vulnerability from one line.

## Send requests and retain the safe counterexample

Place the [service](/examples/ai-security/ticket-lab.py) and [runner](/examples/ai-security/attack-runner.py) together and use Python 3.11:

```bash
python3 attack-runner.py hypotheses --build vulnerable-v1 --out hypotheses-before.json
python3 attack-runner.py hypotheses --build fixed-v1 --out hypotheses-after.json
```

Each run starts a fresh service with the same synthetic roles and resources. `same_tenant` and `other_tenant` should be `content_returned` on the vulnerable build and `denied_without_content` on the fixed build. The trace includes Alice’s baseline, both ID substitutions, and Bob’s legitimate control.

The fixed-build counterexample matters. A model reporting the denied request as a confirmed vulnerability needs its judgment corrected. A denial only disproves this request and identity combination, however: it says nothing by itself about search, export, or cache paths.

[NIST’s evaluation investigation](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations) describes ineffective attempts to modify local source without changing a remote target. Tie the source version the model inspected to the running service. Editing a local file does not update a cloud process.

## Inconclusive is a necessary result

Suppose health identifies the expected service, N-1 times out, and N-2 returns `403`. Do not mark H-OWNER disproved: the normal baseline is missing. Keep the error and request time, repair the environment, and rerun.

Other inconclusive conditions include deleted fixtures, a failing Bob control, expired authentication, or a proxy rewriting responses. The runner should stop and expose the cause. The model must not invent an explanation such as “the firewall successfully blocked it.”

On your cloud copy, connect the HTTPS origin, running build, and fixture revision. Supply `--base-url` and `--target-id`; the same status code across environments is not the same evidence. For the PortSwigger exercise, replace “ticket content” with the designated account data and use your instance’s session and success conditions. The method does not require a local target.

## Exercise and answer

The model writes: “Alice received 403 for N-2, therefore the product has no authorization vulnerabilities.” Rewrite it.

A supported conclusion is: “On this build and Alice session, after the N-1 baseline succeeded, N-2 was denied without ticket content. This ownership-bypass hypothesis was not reproduced.” Include Bob’s successful N-2 control. A product-wide conclusion needs other roles and read paths.

What if N-2 returns content identical to Bob’s control, but the actual policy permits company-wide sharing? Correct the policy and expected result first. That behavior is not an ownership violation under that policy. Tests challenge the boundary the product actually promises.

## References

- [PortSwigger: User ID controlled by request parameter](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter): a complete controllable-ID lab for testing authorization hypotheses.
- [NIST: Examples of cheating in CAISI’s agent evaluations](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations): contamination, grading shortcuts, and ineffective local changes.
