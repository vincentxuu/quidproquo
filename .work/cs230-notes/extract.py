import json, re, sys, pathlib
d = pathlib.Path('raw')
out = pathlib.Path('txt'); out.mkdir(exist_ok=True)
for f in sorted(d.glob('*.raw')):
    s = f.read_text()
    # unwrap: either a bare {"markdown": ...} json, or [{"type":"text","text":"{...}"}]
    md = None
    try:
        o = json.loads(s)
        if isinstance(o, list):
            o = json.loads(o[0]['text'])
        md = o['markdown']
    except Exception as e:
        md = s
    p = out / (f.stem + '.txt')
    p.write_text(md)
    title = re.search(r'^# \[(.+?)\]', md, re.M)
    print(f.stem, len(md), '|', title.group(1) if title else '??')
