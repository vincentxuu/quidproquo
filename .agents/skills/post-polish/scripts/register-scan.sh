#!/usr/bin/env bash
# 語域掃描：量出文章的「研究感」指標。只報數字，不改稿。
# 用法：bash register-scan.sh <post.md>
set -euo pipefail
F="${1:?用法: register-scan.sh <post.md>}"

# 正文 = 去掉 frontmatter、附錄與參考資料之後的部分
body() {
  awk '/^---$/{n++; next} n>=2' "$F" \
  | awk '/^#+ (附錄|Appendix)/{exit} {print}'
}
# 去掉 markdown 連結網址、程式碼、表格列，只留可讀散文
prose() {
  body | grep -v '^[|>#]' | grep -v '^\s*$' \
       | sed -E 's/\[([^]]*)\]\([^)]*\)/\1/g; s/https?:\/\/[^ )]*//g; s/`[^`]*`//g'
}

n_para=$(prose | wc -l | tr -d ' ')
echo "正文段落數：$n_para"

echo
echo "── 1. 長句（氣口）：兩個句號之間超過 60 字"
prose | tr '。' '\n' | awk '{ n=length($0)/3; if (n>60) printf "  %d 字｜%s…\n", n, substr($0,1,45) }' | head -8
echo "  合計 $(prose | tr '。' '\n' | awk '{if (length($0)/3>60) c++} END{print c+0}') 句"

echo
echo "── 2. 但書密度：含轉折詞的段落佔比"
h=$(prose | grep -c '但\|不過\|然而\|雖然\|話說回來\|值得注意' || true)
echo "  $h / $n_para 段（$(( h * 100 / (n_para>0?n_para:1) ))%）"

echo
echo "── 3. 引述區塊（正文，不含語言導覽列）"
body | grep '^> ' | grep -vc 'English version\|中文版\|本文是\|This is part' || echo "  0"

echo
echo "── 4. 數字密度：單段 4 個以上數字"
prose | awk '{c=gsub(/[0-9]+([.,][0-9]+)?/,"&"); if(c>=4) printf "  %d 個｜%s…\n", c, substr($0,1,45)}' | head -8

echo
echo "── 5. 研究者姓名當段落主詞"
prose | grep -cE '^\*?\*?[A-Z][a-zA-Z-]+( (et al\.|與|and) ?[A-Za-z]*)?( 等人)?[  ]*[0-9]{4}?[  ]*(年)?' || echo "  0"

echo
echo "── 6. 建議讀者做的事，有沒有配具體動作"
echo "  「怎麼做」段落數：$(grep -c '\*\*怎麼做\*\*\|\*\*What to do\*\*' "$F" || true)"
echo "  （人工核對：每個判 ✅／建議照做的項目都該有一段）"

echo
echo "── 7. 模板化轉折句型（同篇反覆會有 AI 感）"
prose | grep -nE '不是[^。；]*而是|不只是[^。；]*而是|可以[^。；]*但不能|有意思[，,]?但|值得[^。；]*是因為|不能只[^。；]*必須|不是單純[^。；]*而是|還不到[^。；]*(理由|程度|答案)' \
  | sed -E 's/^/  /' | head -12 || true
echo "  合計 $(prose | grep -cE '不是[^。；]*而是|不只是[^。；]*而是|可以[^。；]*但不能|有意思[，,]?但|值得[^。；]*是因為|不能只[^。；]*必須|不是單純[^。；]*而是|還不到[^。；]*(理由|程度|答案)' || true) 處"
