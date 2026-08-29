#!/usr/bin/env bash
# Scan zh-TW drafts for phrase-ledger patterns. Reports only; does not edit.
set -euo pipefail

F="${1:?Usage: scan-ledger.sh <post.md>}"

body() {
  awk '/^---$/{n++; next} n>=2' "$F" \
  | awk '/^#+ (附錄|Appendix|參考資料|References)/{exit} {print}'
}

prose() {
  body | grep -v '^[|>#]' | grep -v '^\s*$' \
       | sed -E 's/\[([^]]*)\]\([^)]*\)/\1/g; s/https?:\/\/[^ )]*//g; s/`[^`]*`//g'
}

echo "Phrase ledger scan: $F"
echo

echo "── 模板化轉折"
prose | grep -nE '不是[^。；]*而是|不只是[^。；]*而是|可以[^。；]*但不能|有意思[，,]?但|值得[^。；]*是因為|還不到[^。；]*(程度|理由|答案|直接替換)|不能只[^。；]*(必須|要)' \
  | sed -E 's/^/  /' || true

echo
echo "── 台灣中文高風險用詞"
prose | grep -nE '台灣語境|本地[[:alnum:]一-龥]*|在地媒體' \
  | sed -E 's/^/  /' || true
