import io, subprocess, re, difflib

head = subprocess.run(["git", "show", "HEAD:src/utils/series.ts"], capture_output=True, text=True, check=True).stdout
cur = io.open("src/utils/series.ts", encoding="utf-8").read()

m = re.search(r"  \{\n    slug: 'laos-crags',.*?\n  \},\n", cur, re.S)
laos_block = m.group(0)

mk = re.search(r"  \{\n    slug: 'korea-crags',.*?\n  \},\n", head, re.S)
assert mk
after = head[: mk.end()] + laos_block + head[mk.end() :]
assert "malaysia-crags" not in after and "laos-crags" in after

diff = difflib.unified_diff(
    head.splitlines(keepends=True),
    after.splitlines(keepends=True),
    fromfile="a/src/utils/series.ts",
    tofile="b/src/utils/series.ts",
    n=3,
)
patch = "diff --git a/src/utils/series.ts b/src/utils/series.ts\n" + "".join(diff)
io.open("/tmp/laos-series.patch", "w", encoding="utf-8").write(patch)
print(patch)
