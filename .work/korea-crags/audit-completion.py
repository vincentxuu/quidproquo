"""Audit the agreed Korean series delivery, without changing content."""
from pathlib import Path
import re
import json

slugs = ['insubong', 'seoninbong', 'ulsanbawi', 'janggunbong', 'jeokbyeok',
         'yuseondae', 'ganhyeon', 'seonunsan', 'halmae-bawi', 'munsusan',
         'daeryukbong', 'musucheon', 'jeju-bouldering']
root = Path('src/content/posts/climbing')
errors = []
rows = []
for order, slug in enumerate(['overview'] + slugs):
    base = '2026-10-21-korea-crags-overview' if order == 0 else f'2026-10-21-korea-crag-{slug}'
    pair = []
    for suffix, lang, series in [('', 'zh-TW', '韓國岩場'), ('-en', 'en', 'Korea Climbing Crags')]:
        p = root / (base + suffix + '.md')
        if not p.exists():
            errors.append(f'Missing {p}')
            continue
        text = p.read_text()
        fm = text.split('---', 2)[1]
        for pattern, label in [(rf'^lang: {lang}$', 'language'),
                               (rf'^  order: {order}$', 'order'),
                               (r'^draft: false$', 'published content status')]:
            if not re.search(pattern, fm, re.M): errors.append(f'{p}: {label}')
        if series not in fm: errors.append(f'{p}: series name')
        if suffix == '': expected = base + '-en'
        else: expected = base
        if f'/posts/climbing/{expected})' not in text: errors.append(f'{p}: language link')
        for target in re.findall(r'\]\(/posts/climbing/(2026-10-21-korea[^)#]+)', text):
            if not (root / (target + '.md')).exists(): errors.append(f'{p}: missing target {target}')
        if order and ('**指南書**' if not suffix else '**Guidebooks') not in text:
            errors.append(f'{p}: guidebook entry')
        pair.append(text)
    review = Path('.work/reviews') / (base + '.md')
    if not review.exists(): errors.append(f'Missing review {review}')
    else:
        for heading in ['post-verify', 'post-review', 'post-polish']:
            if f'## {heading}' not in review.read_text(): errors.append(f'{review}: missing {heading}')
    note = Path('.research') / (base + '.md')
    if not note.exists(): errors.append(f'Missing research {note}')
    rows.append({'order': order, 'slug': slug, 'language_files': len(pair)})

out = {'topics': len(rows), 'expected_articles': len(rows)*2, 'rows': rows, 'errors': errors}
print(json.dumps(out, ensure_ascii=False, indent=2))
raise SystemExit(bool(errors))
