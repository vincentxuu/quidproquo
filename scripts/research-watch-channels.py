#!/usr/bin/env python3
"""Optional YouTube-native metadata adapter; no cookies, media download or pool writes."""
import argparse
import concurrent.futures
import json
import re
import shutil
import subprocess
from pathlib import Path
from urllib.parse import urlsplit


def scan(request, terms, executable):
    url = request['url'].rstrip('/') + '/videos'
    parts = urlsplit(url)
    if parts.scheme != 'https' or parts.netloc != 'www.youtube.com' or not re.fullmatch(r'/(?:channel/UC[A-Za-z0-9_-]+|@[A-Za-z0-9_.%-]+)/videos', parts.path):
        raise ValueError('Only public YouTube channel URLs are supported')
    result = {'request_id': request['id'], 'query': url, 'tool': 'yt-dlp public channel uploads metadata',
              'status': 'failed', 'coverage': 'Requested newest 12 uploads without config/cookies or media download.', 'results': []}
    if not executable:
        result['error'] = 'yt-dlp is unavailable; use a bounded platform-native or MCP fallback and preserve its actual scope.'
        return result
    try:
        process = subprocess.run([executable, '--ignore-config', '--flat-playlist', '--dump-single-json',
                                  '--playlist-end', '12', '--retries', '0', '--extractor-retries', '0',
                                  '--socket-timeout', '12', url], capture_output=True, text=True, timeout=50)
        if process.returncode:
            result['error'] = f'Upload-list metadata request failed (exit {process.returncode}); no result inferred.'
            return result
        data = json.loads(process.stdout)
        if not isinstance(data, dict):
            raise ValueError('Metadata response must be an object')
        entries = data.get('entries')
        if not isinstance(entries, list):
            raise ValueError('Metadata response has no upload entries')
        if len(entries) > 12:
            raise ValueError('Upload response exceeded the requested bound')
        rows = []
        for entry in entries:
            if not isinstance(entry, dict):
                raise ValueError('Malformed upload entry')
            title, video_id = entry.get('title', ''), entry.get('id', '')
            if not isinstance(title, str) or not isinstance(video_id, str) or not re.fullmatch(r'[A-Za-z0-9_-]{11}', video_id):
                raise ValueError('Malformed upload entry')
            if not terms or any(term.casefold() in title.casefold() for term in terms):
                rows.append({'url': f'https://www.youtube.com/watch?v={video_id}', 'title': title, 'source_type': 'video',
                             'creator_source_id': request['source_id'],
                             'reason': ('Upload-list title matches a configured title term; topic relevance, footage and publication date need review.' if terms else
                                        'Public upload metadata retained without a title filter; topic relevance, footage and publication date need review.')})
        filtering = 'retained configured title-term matches only' if terms else 'no title/location filter applied; topic relevance unconfirmed'
        result.update(status='ok', coverage=f'Inspected {len(entries)} newest upload titles (limit12); {filtering}. Older uploads, footage and audio not covered.', results=rows)
    except (subprocess.TimeoutExpired, ValueError, OSError, TypeError) as error:
        result['error'] = f'Metadata adapter {type(error).__name__}; request incomplete, no result inferred.'
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--plan', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    options = parser.parse_args()
    plan = json.loads(options.plan.read_text())
    requests = [r for r in plan['requests'] if r['kind'] == 'channel']
    if len(requests) > 20 or len({r['id'] for r in requests}) != len(requests):
        raise ValueError('Invalid channel request bound or duplicate identity')
    watch = plan['watch']
    # Explicit title_terms takes precedence, including [] to disable filtering.
    # General research topics need no geographic fields.
    terms = watch['title_terms'] if 'title_terms' in watch else watch.get('place_terms', [])
    if not isinstance(terms, list) or not all(isinstance(t, str) and t.strip() for t in terms):
        raise ValueError('Optional title terms must be an array of nonempty strings')
    executable = shutil.which('yt-dlp')
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        rows = list(pool.map(lambda r: scan(r, terms, executable), requests))
    options.output.parent.mkdir(parents=True, exist_ok=True)
    options.output.write_text(json.dumps({'requests': rows}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'attempted': len(rows), 'ok': sum(r['status'] == 'ok' for r in rows), 'matches': sum(len(r['results']) for r in rows)}))


if __name__ == '__main__':
    main()
