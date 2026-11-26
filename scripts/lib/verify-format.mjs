// verify.mjs 失敗項的輸出整理。
// 舊做法只印前 30 行；astro check 開頭的設定訊息加警告就佔滿，真正的錯誤排在後面被截掉，
// CI 日誌看不到失敗原因（2026-10-24 main 的 TS7053 就是這樣多繞了一圈）。
// 超過上限時改成：開頭 3 行 + 每個錯誤行（連同後面 2 行上下文）+ 結尾 5 行。

const ANSI = /\u001b\[[0-9;]*m/g;
const ERROR_LINE = /\berror\b|\bTS\d{4}\b|✖|✗|\bFAIL(?:ED)?\b|\bError:|Cannot find|ERR_[A-Z_]+/i;
const HEAD = 3;
const TAIL = 5;
const CONTEXT = 2;

export function formatFailure(detail, { limit = 30 } = {}) {
  const lines = detail.replace(ANSI, '').split('\n');
  if (lines.length <= limit) return lines;

  const middle = lines.slice(HEAD, lines.length - TAIL);
  const budget = Math.max(limit - HEAD - TAIL - 1, 1);
  const kept = [];
  for (let i = 0; i < middle.length && kept.length < budget; i++) {
    if (!ERROR_LINE.test(middle[i]) || /\bwarning\b/i.test(middle[i])) continue;
    for (let j = i; j <= i + CONTEXT && j < middle.length && kept.length < budget; j++) {
      if (j > i && ERROR_LINE.test(middle[j]) && !/\bwarning\b/i.test(middle[j])) break;
      kept.push(middle[j]);
      i = j;
    }
  }
  const omitted = middle.length - kept.length;
  return [
    ...lines.slice(0, HEAD),
    ...(kept.length ? ['…', ...kept] : []),
    `（省略 ${omitted} 行；單獨執行該指令看完整輸出）`,
    ...lines.slice(lines.length - TAIL),
  ];
}
