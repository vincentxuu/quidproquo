#!/bin/bash
set -e

SESSION="${SESSION:-}"
BASE="${BASE:-http://localhost:4321}"

if [ -z "$SESSION" ]; then
  echo "Usage: SESSION=<token> [BASE=<url>] $0"
  exit 1
fi

PIPELINES="content-ops post-quality embed-sync crawl-sync translation research-brief youtube-brief glossary-gap freshness-review series-suggestions knowledge-graph-prototype metadata-suggestions internal-links"

PASS=0
FAIL=0

for id in $PIPELINES; do
  response=$(curl -s -X POST \
    -b "session=$SESSION" \
    -H "Content-Type: application/json" \
    -d '{"inputs":{}}' \
    "$BASE/api/admin/pipelines/$id/run" 2>&1)

  if echo "$response" | grep -q '"flowRunId"\|"jobId"'; then
    echo "PASS: $id"
    PASS=$((PASS + 1))
  else
    echo "FAIL: $id — $response"
    FAIL=$((FAIL + 1))
  fi
done

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
