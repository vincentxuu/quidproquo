"""台劇三份候選檔合併：以片名為鍵（opencc t2s 正規化），計算類別（A–G）。
LINE TODAY 聚光賞只算 G（fans 檔），awards 檔裡的 B LINE 標籤不計，避免重複。金鐘獎算 A。
snippet／不計／mention 標籤不算。需要：pip install opencc-python-reimplemented"""
import re, sys, unicodedata
from pathlib import Path
from opencc import OpenCC
T2S = OpenCC('t2s')
H = Path(__file__).parent
ALIAS = {}
def norm(t):
    t = unicodedata.normalize('NFKC', t)
    t = T2S.convert(t).replace('†', '')
    t = re.split(r'[（(\[]|\s/\s|／', t)[0]
    t = re.sub(r'(第[一二三四五六七八九十\d]+[季部]|\s*(ii|2)$|\s*\+.*$)', '', t, flags=re.I)
    t = re.sub(r'[\s!！?？・·、。,.:：~〜\-–—「」『』《》\'"＊*]', '', t).lower()
    return ALIAS.get(t, t)
def rows(f, start, end):
    for l in (H / f).read_text(encoding='utf-8').split('\n')[start:end]:
        if l.startswith('|') and not l.startswith('|---') and not re.match(r'\|\s*(#|台灣片名|中文片名|Chinese)', l):
            yield [c.strip() for c in l.strip().strip('|').split('|')]
def bad(t): return re.search(r'snippet|不計|not counted|mention', t, re.I)
D = {}
def put(tw, en, src, cats, tags, yr='', net=''):
    k = norm(tw)
    if not k: return
    d = D.setdefault(k, {'tw': re.sub(r'[†]', '', tw), 'en': en, 'cats': set(), 'tags': [], 'files': set(), 'yr': yr, 'net': net})
    d['cats'] |= cats; d['tags'] += tags; d['files'].add(src)
    if (not d['en'] or d['en'] in ('—', '待查')) and en: d['en'] = en
for c in rows('candidates-awards-critics.md', 64, 181):
    if len(c) < 7: continue
    tags = [t.strip() for t in c[5].split(';') if t.strip() and not bad(t) and 'LINE' not in t]
    cats = {t[0] for t in tags if re.match(r'^[AB] ', t)}
    names = c[1].split(' / ') if 'each' in c[6] else [c[1]]
    for n in names: put(n, c[2].replace('†', ''), 'AB', cats, tags, c[3], c[4])
for c in rows('candidates-ratings-viewing-buzz.md', 66, 166):
    if len(c) < 9: continue
    tags = [t for t in re.findall(r'`([^`]*)`', c[6]) if not bad(t)]
    cats = {t[0] for t in tags if re.match(r'^[CDE] ', t)}
    names = c[1].split(' / ') if c[7].strip().startswith('1') and ' / ' in c[1] else [c[1]]
    for n in names: put(n, c[2].replace('†', '') if len(names) == 1 else '', 'CDE', cats, tags, c[3], c[4])
for c in rows('candidates-fans-taiwan.md', 53, 155):
    if len(c) < 6 or '範圍外' in c[0]: continue
    tags = [t for t in re.findall(r'`([^`]*)`', c[4]) if not bad(t)]
    cats = {t[0] for t in tags if re.match(r'^[FG] ', t)}
    if '／' in re.sub(r'（.*?）', '', c[0]):  # 分組列
        for n in re.sub(r'（.*?）', '', c[0]).split('／'): put(n, '', 'FG', cats, tags, c[2], c[3])
        continue
    put(c[0], re.sub(r'（.*$', '', c[1]), 'FG', cats, tags, c[2], c[3])
out = sorted(D.values(), key=lambda d: (-len(d['cats']), d['tw']))
if '--unmatched' in sys.argv:
    for d in out:
        if len(d['files']) == 1: print(sorted(d['files']), d['tw'], '|', d['en'], '|', ''.join(sorted(d['cats'])))
    sys.exit()
from collections import Counter
L = [f"<!-- {len(out)} shows; by category count: {dict(sorted(Counter(len(d['cats']) for d in out).items()))} -->",
     '| # | 台灣片名 | English | 年 | 網／平台 | 類別 | 類別數 | tag 數 |', '|---|---|---|---|---|---|---|---|']
for i, d in enumerate(out, 1):
    L.append(f"| {i} | {d['tw']} | {d['en']} | {d['yr']} | {d['net']} | {''.join(sorted(d['cats']))} | {len(d['cats'])} | {len(d['tags'])} |")
(H / 'merged-candidates.md').write_text('# 台劇三份候選檔合併結果（merge.py 產生，2026-11-13）\n\nLINE TODAY 聚光賞只算 G 類（awards 檔的 B LINE 標籤不計）。\n\n' + '\n'.join(L) + '\n', encoding='utf-8')
top = [d for d in out if len(d['cats']) >= 3]
print(len(out), len(top))
for d in top: print(''.join(sorted(d['cats'])), d['tw'], '|', d['en'], '|', d['yr'], '|', d['net'][:30])
