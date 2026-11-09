"""日劇三份候選檔合併：以日文片名為鍵，計算類別（A–G），snippet／不計標籤不算。"""
import re, json, sys, unicodedata
from pathlib import Path
H = Path(__file__).parent
ALIAS = {}  # 正規化鍵 → 合併鍵（看過未對上的清單後手動補）
def norm(t):
    t = unicodedata.normalize('NFKC', t)
    t = re.sub(r'[（(\[].*?[)）\]]', '', t)
    t = t.replace('†', '')
    t = re.split(r'[~〜―]|\s-|-(?=\S)', t)[0] or t
    t = re.sub(r'第\d+シーズン|THE \w+ SEASON', '', t, flags=re.I)
    t = re.sub(r'(season|シーズン|S)\s*\d+.*$', '', t, flags=re.I)
    t = re.sub(r'[\s!！?？・、。,.:：~〜\-–—「」『』\'"]', '', t).lower()
    return ALIAS.get(t, t)
def rows(f, start, end=None):
    L = (H / f).read_text(encoding='utf-8').split('\n')
    for l in L[start:end]:
        if l.startswith('|') and not l.startswith('|---') and not re.match(r'\|\s*(#|日文|日文原名)', l):
            yield [c.strip() for c in l.strip().strip('|').split('|')]
def bad(t): return re.search(r'snippet|不計|not counted', t, re.I)
D = {}
def put(jp, en, src, cats, tags, extra=None, yr='', net=''):
    k = norm(jp)
    if not k: return
    d = D.setdefault(k, {'jp': re.sub(r'†', '', jp), 'en': en, 'cats': set(), 'tags': [], 'tw': '', 'files': set(), 'yr': yr, 'net': net})
    d['cats'] |= cats; d['tags'] += tags; d['files'].add(src)
    if extra: d['tw'] = d['tw'] or extra
    if not d['en'] or d['en'] == '—': d['en'] = en
# A/B
for c in rows('candidates-awards-critics.md', 52, 271):
    if len(c) < 7: continue
    tags = [t.strip() for t in re.split(r';', c[5])]
    tags = [t for t in tags if not bad(t)]
    cats = {t[0] for t in tags if re.match(r'^[AB] ', t)}
    put(c[1], c[2].replace('†', ''), 'AB', cats, tags, yr=c[3], net=c[4])
# C/D/E
for c in rows('candidates-ratings-viewing-buzz.md', 58, 261):
    if len(c) < 8: continue
    tags = re.findall(r'`([^`]*)`', c[6])
    tags = [t for t in tags if not bad(t)]
    cats = {t[0] for t in tags if re.match(r'^[CDE] ', t)}
    for jp in re.split(r'\s*/\s*(?=[^\d])', c[1]) if ' / ' in c[1] and '（' not in c[1] else [c[1]]:
        put(jp, c[2].replace('†', ''), 'CDE', cats, tags, yr=c[3], net=c[4])
# F/G
for c in rows('candidates-fans-taiwan.md', 53, 162):
    if len(c) < 6: continue
    jp, _, en = c[0].partition('／')
    tags = re.findall(r'`([^`]*)`', c[4])
    tags = [t for t in tags if not bad(t)]
    cats = {t[0] for t in tags if re.match(r'^[FG] ', t)}
    tw = re.sub(r'（.*$', '', c[1])
    put(jp, re.sub(r'（.*$', '', en), 'FG', cats, tags, tw, yr=c[2], net=c[3])
out = sorted(D.values(), key=lambda d: (-len(d['cats']), d['jp']))
if '--unmatched' in sys.argv:
    for d in out:
        if len(d['files']) == 1: print(sorted(d['files']), d['jp'], '|', d['en'], '|', ''.join(sorted(d['cats'])))
else:
    for d in out:
        d['cats'] = ''.join(sorted(d['cats'])); d['files'] = sorted(d['files'])
    if '--md' in sys.argv:
        from collections import Counter
        L = [f"<!-- {len(out)} shows; by category count: {dict(sorted(Counter(len(d['cats']) for d in out).items()))} -->",
             '| # | 台灣譯名 | English | 日文 | 年 | 網／平台 | 類別 | 類別數 | tag 數 |', '|---|---|---|---|---|---|---|---|---|']
        for i, d in enumerate(out, 1):
            L.append(f"| {i} | {d['tw']} | {d['en']} | {d['jp']} | {d['yr']} | {d['net']} | {d['cats']} | {len(d['cats'])} | {len(d['tags'])} |")
        (H / 'merged-candidates.md').write_text('# 日劇三份候選檔合併結果（merge.py 產生，2026-11-09）\n\n' + '\n'.join(L) + '\n', encoding='utf-8')
        top = [d for d in out if len(d['cats']) >= 3]
        rows_ = ['en\tja\tzh_hint\tyear\tnet\tcats'] + [f"{d['en']}\t{d['jp']}\t{d['tw']}\t{d['yr']}\t{d['net']}\t{d['cats']}" for d in top]
        half = (len(top) + 1) // 2
        (H / 'tw-batch-1.tsv').write_text('\n'.join(rows_[:half + 1]) + '\n', encoding='utf-8')
        (H / 'tw-batch-2.tsv').write_text('\n'.join([rows_[0]] + rows_[half + 1:]) + '\n', encoding='utf-8')
        sys.exit()
    json.dump(out, open(sys.argv[1] if len(sys.argv) > 1 else '/dev/stdout', 'w'), ensure_ascii=False, indent=1)
