"""陸劇三份候選檔合併：以簡體片名為鍵（opencc t2s 正規化），計算類別（A–G）。
A 只算非官方評審（白玉蘭、AACA、首爾、艾美、釜山）；A*（飛天、金鷹）與 S（推優）另記 state 欄，不計入類別。
snippet／不計／mention／期待榜 標籤不算。需要：pip install opencc-python-reimplemented"""
import re, json, sys, unicodedata
from pathlib import Path
from opencc import OpenCC
T2S = OpenCC('t2s')
H = Path(__file__).parent
ALIAS = {}
def norm(t):
    t = unicodedata.normalize('NFKC', t)
    t = T2S.convert(t)
    t = re.split(r'[（(\[]|\s/\s|·|／', t)[0]
    t = t.replace('†', '')
    t = re.sub(r'(第[一二三四五六七八九十\d]+[季部]|之.*$|\s*\d+$|2$)', '', t)
    t = re.sub(r'[\s!！?？・·、。,.:：~〜\-–—「」『』《》\'"]', '', t).lower()
    return ALIAS.get(t, t)
def rows(f, start, end=None):
    for l in (H / f).read_text(encoding='utf-8').split('\n')[start:end]:
        if l.startswith('|') and not l.startswith('|---') and not re.match(r'\|\s*(#|台灣譯名|中文片名|簡體)', l):
            yield [c.strip() for c in l.strip().strip('|').split('|')]
def bad(t): return re.search(r'snippet|不計|not counted|mention|期待榜', t, re.I)
D = {}
def put(cn, en, src, cats, tags, tw='', yr='', net='', state=False):
    k = norm(cn)
    if not k: return
    d = D.setdefault(k, {'cn': cn.replace('†', ''), 'en': en, 'cats': set(), 'tags': [], 'tw': '', 'files': set(), 'yr': yr, 'net': net, 'state': False})
    d['cats'] |= cats; d['tags'] += tags; d['files'].add(src); d['state'] |= state
    if tw and not d['tw']: d['tw'] = tw
    if (not d['en'] or d['en'] == '—') and en: d['en'] = en
# A/B
for c in rows('candidates-awards-critics.md', 66, 310):
    if len(c) < 9: continue
    tags = [t.strip() for t in c[6].split(';') if t.strip() and not bad(t)]
    cats = {t[0] for t in tags if re.match(r'^[AB] ', t)}
    state = any(re.match(r'^(A\*|S) ', t) for t in tags)
    put(c[1], c[3].replace('†', ''), 'AB', cats, tags, tw=c[2], yr=c[4], net=c[5], state=state)
# C/D/E
for c in rows('candidates-ratings-viewing-buzz.md', 66, 213):
    if len(c) < 9: continue
    tags = [t for t in re.findall(r'`([^`]*)`', c[6]) if not bad(t)]
    cats = {t[0] for t in tags if re.match(r'^[CDE] ', t)}
    if 'each' in c[7]:  # 分組列：每部各一個同類別來源
        for cn in c[1].split(' / '):
            put(cn, '', 'CDE', cats, tags)
        continue
    tw = c[1].split('·')[-1].strip() if '·' in c[1] else ''
    put(c[1], c[2].replace('†', ''), 'CDE', cats, tags, tw=tw, yr=c[3], net=c[4])
# F/G
for c in rows('candidates-fans-taiwan.md', 61, 272):
    if len(c) < 5: continue
    if '、' in c[0]:  # 分組列
        tagcol = c[4] if len(c) >= 6 else c[3]
        tags = [t for t in re.findall(r'`([^`]*)`', tagcol) if not bad(t)]
        cats = {t[0] for t in tags if re.match(r'^[FG] ', t)}
        for cn, tw in zip(c[1].split('／'), c[0].split('、')):
            put(cn, '', 'FG', cats, tags, tw=tw)
        continue
    cn, _, en = c[1].partition('／')
    tagcol = c[4] if len(c) >= 6 else c[3]
    tags = [t for t in re.findall(r'`([^`]*)`', tagcol) if not bad(t)]
    cats = {t[0] for t in tags if re.match(r'^[FG] ', t)}
    put(cn, re.sub(r'（.*$', '', en), 'FG', cats, tags, tw=re.sub(r'（.*$', '', c[0]), yr=c[2])
out = sorted(D.values(), key=lambda d: (-len(d['cats']), d['cn']))
if '--unmatched' in sys.argv:
    for d in out:
        if len(d['files']) == 1: print(sorted(d['files']), d['cn'], '|', d['tw'], '|', ''.join(sorted(d['cats'])))
    sys.exit()
from collections import Counter
L = [f"<!-- {len(out)} shows; by category count: {dict(sorted(Counter(len(d['cats']) for d in out).items()))} -->",
     '類別只算非官方來源；state 欄 ● 表示另有飛天、金鷹或推優等官方榜（不計入類別）。', '',
     '| # | 台灣譯名 | English | 大陸原名 | 年 | 網／平台 | 類別 | 類別數 | state | tag 數 |', '|---|---|---|---|---|---|---|---|---|---|']
for i, d in enumerate(out, 1):
    L.append(f"| {i} | {d['tw']} | {d['en']} | {d['cn']} | {d['yr']} | {d['net']} | {''.join(sorted(d['cats']))} | {len(d['cats'])} | {'●' if d['state'] else ''} | {len(d['tags'])} |")
(H / 'merged-candidates.md').write_text('# 陸劇三份候選檔合併結果（merge.py 產生，2026-11-12）\n\n' + '\n'.join(L) + '\n', encoding='utf-8')
top = [d for d in out if len(d['cats']) >= 3]
print(len(out), len(top))
for d in top: print(''.join(sorted(d['cats'])), d['cn'], '|', d['tw'], '|', d['en'], '|', 'state' if d['state'] else '')
