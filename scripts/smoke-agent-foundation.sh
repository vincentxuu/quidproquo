#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:4321}"
: "${SESSION_COOKIE:?SESSION_COOKIE is required, for example: session=<token>}"
: "${CRAWL_SECRET:?CRAWL_SECRET is required}"

pass() {
  printf 'PASS %s\n' "$1"
}

check_status() {
  local name="$1"
  local expected="$2"
  shift 2
  local status
  status="$(curl -sS -o /tmp/agent-foundation-smoke-body -w '%{http_code}' "$@")"
  if [[ "$status" != "$expected" ]]; then
    printf 'FAIL %s: expected %s, got %s\n' "$name" "$expected" "$status" >&2
    sed -n '1,20p' /tmp/agent-foundation-smoke-body >&2
    exit 1
  fi
  pass "$name"
}

check_json_keys() {
  local name="$1"
  shift
  jq -e "$@" /tmp/agent-foundation-smoke-body >/dev/null
  pass "$name envelope"
}

check_status 'GET /api/admin/status' 200 \
  -H "Cookie: ${SESSION_COOKIE}" \
  "${BASE_URL}/api/admin/status"
check_json_keys 'GET /api/admin/status' '.statuses and .index and .content'

check_status 'GET /api/admin/pipelines' 200 \
  -H "Cookie: ${SESSION_COOKIE}" \
  "${BASE_URL}/api/admin/pipelines"
check_json_keys 'GET /api/admin/pipelines' '.pipelines and .tools and .schedules and .jobs'

check_status 'GET /api/admin/settings' 200 \
  -H "Cookie: ${SESSION_COOKIE}" \
  "${BASE_URL}/api/admin/settings"
check_json_keys 'GET /api/admin/settings' '.secrets and .config and .defaults'

check_status 'PUT /api/admin/settings' 200 \
  -X PUT \
  -H "Cookie: ${SESSION_COOKIE}" \
  -H 'Content-Type: application/json' \
  -d '{"rate_limit":{"per_minute":60}}' \
  "${BASE_URL}/api/admin/settings"
check_json_keys 'PUT /api/admin/settings' '.success and .updated'

check_status 'GET /api/admin/providers' 200 \
  -H "Cookie: ${SESSION_COOKIE}" \
  "${BASE_URL}/api/admin/providers"
check_json_keys 'GET /api/admin/providers' '.providers and .catalog and .providerKeys'

check_status 'GET /api/admin/agent-skills' 200 \
  -H "Cookie: ${SESSION_COOKIE}" \
  "${BASE_URL}/api/admin/agent-skills"
check_json_keys 'GET /api/admin/agent-skills' '.ok and .key and .raw'

check_status 'GET /api/admin/deep-research' 200 \
  -H "Cookie: ${SESSION_COOKIE}" \
  "${BASE_URL}/api/admin/deep-research"
check_json_keys 'GET /api/admin/deep-research' '.ok and .reports'

check_status 'GET /api/admin/stats/export?days=30' 200 \
  -H "Cookie: ${SESSION_COOKIE}" \
  "${BASE_URL}/api/admin/stats/export?days=30"
pass 'GET /api/admin/stats/export?days=30 csv'

check_status 'POST /api/admin/pipelines/scheduled' 200 \
  -X POST \
  -H "X-Crawl-Secret: ${CRAWL_SECRET}" \
  -H 'Content-Type: application/json' \
  -d '{"pipelineId":"series-suggestions"}' \
  "${BASE_URL}/api/admin/pipelines/scheduled"
check_json_keys 'POST /api/admin/pipelines/scheduled' '.ok and .jobId and .status'

check_status 'POST /api/admin/traces/retention' 200 \
  -X POST \
  -H "Cookie: ${SESSION_COOKIE}" \
  -H 'Content-Type: application/json' \
  -d '{"dryRun":true}' \
  "${BASE_URL}/api/admin/traces/retention"
check_json_keys 'POST /api/admin/traces/retention' '.ok and .dryRun and .planned'
