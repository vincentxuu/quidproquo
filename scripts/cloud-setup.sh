#!/usr/bin/env bash
# 雲端 session（claude.ai/code）開機時補裝轉錄管線需要的工具：ffmpeg、yt-dlp。
# 本機（CLAUDE_CODE_REMOTE 不是 true）直接跳過。安裝失敗只印警告，不擋 session 啟動。
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0

SUDO=""
[ "$(id -u)" -ne 0 ] && command -v sudo >/dev/null 2>&1 && SUDO="sudo"

if ! command -v ffmpeg >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then
    ($SUDO apt-get update -qq && $SUDO apt-get install -y -qq ffmpeg) >/dev/null 2>&1 \
      || echo "cloud-setup: ffmpeg 安裝失敗（apt-get），轉錄無法切段"
  else
    echo "cloud-setup: 沒有 apt-get，略過 ffmpeg"
  fi
fi

if ! command -v yt-dlp >/dev/null 2>&1; then
  (pip install -q -U yt-dlp || pip3 install -q -U yt-dlp) >/dev/null 2>&1 \
    || echo "cloud-setup: yt-dlp 安裝失敗（pip），檢查 pypi.org 是否在網路白名單"
fi

for v in CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_API_TOKEN; do
  [ -n "${!v:-}" ] || echo "cloud-setup: 未設定 $v，scripts/transcribe.mjs 無法呼叫 Workers AI"
done
exit 0
