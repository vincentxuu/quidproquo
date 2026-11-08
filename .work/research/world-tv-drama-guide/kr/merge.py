"""Merge the three Korea candidate files by Korean title; count recommendation categories A–G.

Rules (same as the US pass, plus Korea-specific exclusions):
- A/B file: tags are `;`-separated; a segment without a category letter continues the previous one.
  `A SDA-K` (Seoul International Drama Awards, Korean section) is dropped: it looks popularity-based, not juried.
- C/D/E file: backtick tags; `C Douban` is snippet-only and not counted.
- F/G file: backtick tags from 2a and 2b; `G(轉譯)` (translated Korean polls) is not counted.
Usage: python3 merge.py out.json  (also prints a markdown table to stdout)
"""
import re, json, sys, os, collections
base = os.path.dirname(os.path.abspath(__file__)) + '/'
def kkey(t):
    return re.sub(r'[^가-힣a-z0-9]', '', (t or '').lower())
def ekey(t):
    t = (t or '').lower().replace('&', 'and'); t = re.sub(r'\(.*?\)', '', t)
    t = re.sub(r'[^a-z0-9]+', ' ', t).strip(); return re.sub(r'^the ', '', t)
shows = []; byk = {}; bye = {}
def get(ko, en):
    k, e = kkey(ko), ekey(en)
    s = (byk.get(k) if k else None) or (bye.get(e) if e else None)
    if not s:
        s = {'ko': ko, 'en': en, 'zh': None, 'year': None, 'net': None, 'tags': []}; shows.append(s)
    if k and k not in byk: byk[k] = s
    if e and e not in bye: bye[e] = s
    if not s['ko'] and ko: s['ko'] = ko
    if not s['en'] and en: s['en'] = en
    return s
def table(path, start, end):
    hdr = None
    for l in open(base + path, encoding='utf-8').read().split('\n')[start:end]:
        if not l.startswith('|'): continue
        cells = [c.strip() for c in l.strip().strip('|').split('|')]
        if hdr is None: hdr = cells; continue
        if set(''.join(cells)) <= set('-: '): continue
        if cells == hdr: continue
        yield dict(zip(hdr, cells))
def lines(path): return open(base + path, encoding='utf-8').read().split('\n')
def idx(L, p): return [n for n, l in enumerate(L) if l.startswith(p)][0]
# A/B
L = lines('candidates-awards-critics.md')
for r in table('candidates-awards-critics.md', idx(L, '### 2a'), idx(L, '### 2b')):
    s = get(r['Korean title'], r['English title'])
    s['year'] = s['year'] or r.get('first-air year'); s['net'] = s['net'] or r.get('network/platform')
    cur = None
    for seg in r['evidence tags'].split(';'):
        seg = seg.strip()
        m = re.match(r'([A-G]) ', seg)
        if m: cur = seg
        else: continue
        if seg.startswith('A SDA-K'): continue
        s['tags'].append(seg)
# C/D/E
L = lines('candidates-ratings-viewing-buzz.md')
for r in table('candidates-ratings-viewing-buzz.md', idx(L, '## 3.'), idx(L, '## 4.')):
    s = get(r['韓文片名'].replace('†', '').strip(), r['English title'])
    s['year'] = s['year'] or r.get('First-air'); s['net'] = s['net'] or r.get('Network/platform')
    for t in re.findall(r'`([^`]+)`', r['Evidence tags']):
        if t.startswith('C Douban') or t.startswith('C DB'): continue
        s['tags'].append(t)
# F/G
L = lines('candidates-fans-taiwan.md')
for r in table('candidates-fans-taiwan.md', idx(L, '### 2a'), idx(L, '## 3.')):
    name = r.get('原名／英文名', '')
    m = re.match(r'(.*?)（(.*?)）', name)
    en, ko = (m.group(1), m.group(2)) if m else (name, '')
    s = get(ko, en)
    zh = re.split(r'[（(]', r.get('台灣譯名（來源）', ''))[0].strip()
    if zh and not s['zh']: s['zh'] = zh
    for t in re.findall(r'`([^`]+)`', r.get('Evidence tags', '')):
        if t.startswith('G(轉譯)'): continue
        if re.match(r'[FG] ', t): s['tags'].append(t)
# --- post-merge fixes (manual, see header) ---
def find(en):
    e = ekey(en)
    for s in shows:
        if ekey(s['en']) == e: return s
    raise KeyError(en)
def fold(keep, *others):
    k = find(keep)
    for o in others:
        x = find(o); k['tags'] += x['tags']; k['zh'] = k['zh'] or x['zh']; shows.remove(x)
fold('Weak Hero Class 1 / Class 2', 'Weak Hero Class 1', 'Weak Hero Class 2')
fold('Dr. Romantic', 'Dr. Romantic 3')
# mainly-negative mentions are not recommendations
for en in ('Tempest', 'Typhoon Family'):
    x = find(en); x['tags'] = [t for t in x['tags'] if not t.startswith('G DailyView')]
# bundled cells in the F/G file: credit each named title, then drop the bundle row
BUNDLES = {
 'G LINE TODAY 2023 網友投票': ['King the Land', 'Doctor Cha', 'The Good Bad Mother', 'Crash Course in Romance', 'Celebrity', 'Doona!',
     'The Uncanny Counter', 'Strong Girl Nam-soon', 'See You in My 19th Life', 'Queenmaker', 'D.P.', 'Sweet Home', 'A Good Day to Be a Dog',
     'Destined with You', 'Divorce Attorney Shin', 'Bloodhounds'],
 'F Dcard Z.Y 4分': ["What's Wrong with Secretary Kim", 'SKY Castle', 'Fight for My Way', 'Start-Up', 'Narco-Saints', 'Marry My Husband',
     'Pyramid Game', 'Chief Detective 1958'],
}
for tag, titles in BUNDLES.items():
    for t in titles:
        try: x = find(t)
        except KeyError: x = get('', t)
        x['tags'].append(tag + '（合併列拆出）')
for s in list(shows):
    if not s['ko'] and s['en'] and (s['en'].startswith('LINE TODAY 2023') or s['en'].startswith('Dcard Z.Y')): shows.remove(s)
for s in shows:
    s['cats'] = sorted({t[0] for t in s['tags']})
shows.sort(key=lambda s: (-len(s['cats']), -len(s['tags']), s['en'] or ''))
json.dump(shows, open(sys.argv[1], 'w'), ensure_ascii=False, indent=1)
c = collections.Counter(len(s['cats']) for s in shows)
print(f'<!-- {len(shows)} shows; by category count: {dict(sorted(c.items()))} -->')
print('| # | 台灣譯名 | English | 韓文 | 年 | 網／平台 | 類別 | 類別數 | tag 數 |')
print('|---|---|---|---|---|---|---|---|---|')
for n, s in enumerate([s for s in shows if len(s['cats']) >= 2], 1):
    print(f"| {n} | {s['zh'] or ''} | {s['en']} | {s['ko']} | {s['year'] or ''} | {s['net'] or ''} | {''.join(s['cats'])} | {len(s['cats'])} | {len(s['tags'])} |")
