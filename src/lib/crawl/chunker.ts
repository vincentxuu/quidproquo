import { MAX_CHUNK_CHARS } from './config';
import { createHash } from 'node:crypto';

export interface DocChunk {
  id: string;           // sha256(source_url + chunk_index)[:16]
  source_url: string;
  source_name: string;
  chunk_index: number;
  content: string;
}

function generateChunkId(sourceUrl: string, chunkIndex: number): string {
  return createHash('sha256')
    .update(`${sourceUrl}::${chunkIndex}`)
    .digest('hex')
    .slice(0, 16);
}

/**
 * 單一段落仍超過上限（典型：整段無空行的 markdown 表格／長清單）時，
 * 按行累積切片；單行本身超過上限則按字元硬切。
 */
function splitOversizedParagraph(paragraph: string): string[] {
  const pieces: string[] = [];
  let lines = paragraph.split('\n');
  let buffer = '';

  for (const line of lines) {
    if (buffer.length + line.length + 1 > MAX_CHUNK_CHARS && buffer.length > 0) {
      pieces.push(buffer);
      buffer = '';
    }
    if (line.length > MAX_CHUNK_CHARS) {
      for (let offset = 0; offset < line.length; offset += MAX_CHUNK_CHARS) {
        pieces.push(line.slice(offset, offset + MAX_CHUNK_CHARS));
      }
      continue;
    }
    buffer += (buffer ? '\n' : '') + line;
  }

  if (buffer.length > 0) pieces.push(buffer);
  return pieces;
}

/**
 * 將 markdown 按 ## / ### 標題切成 chunks。
 * 若單一 section 超過 MAX_CHUNK_CHARS，進一步按段落切。
 */
export function chunkMarkdown(
  markdown: string,
  sourceUrl: string,
  sourceName: string
): DocChunk[] {
  // 按 ## 或 ### 標題切割
  const sections = markdown.split(/(?=^#{1,3} )/m).filter(s => s.trim().length > 0);

  const chunks: DocChunk[] = [];

  for (const section of sections) {
    if (section.length <= MAX_CHUNK_CHARS) {
      const idx = chunks.length;
      chunks.push({
        id: generateChunkId(sourceUrl, idx),
        source_url: sourceUrl,
        source_name: sourceName,
        chunk_index: idx,
        content: section.trim(),
      });
    } else {
      // 超長 section 按段落進一步切
      const paragraphs = section.split(/\n\n+/).filter(p => p.trim().length > 0);
      let buffer = '';

      for (const para of paragraphs) {
        // 單一段落本身超過上限（如無空行的大表格）時，強制切成多個 chunk，
        // 避免 embedding 模型因單筆輸入過長而拒收、卡死整條索引 pipeline。
        if (para.length > MAX_CHUNK_CHARS) {
          if (buffer.trim().length > 0) {
            const idx = chunks.length;
            chunks.push({
              id: generateChunkId(sourceUrl, idx),
              source_url: sourceUrl,
              source_name: sourceName,
              chunk_index: idx,
              content: buffer.trim(),
            });
            buffer = '';
          }
          for (const piece of splitOversizedParagraph(para)) {
            const idx = chunks.length;
            chunks.push({
              id: generateChunkId(sourceUrl, idx),
              source_url: sourceUrl,
              source_name: sourceName,
              chunk_index: idx,
              content: piece,
            });
          }
          continue;
        }
        if (buffer.length + para.length + 2 > MAX_CHUNK_CHARS && buffer.length > 0) {
          const idx = chunks.length;
          chunks.push({
            id: generateChunkId(sourceUrl, idx),
            source_url: sourceUrl,
            source_name: sourceName,
            chunk_index: idx,
            content: buffer.trim(),
          });
          buffer = '';
        }
        buffer += (buffer ? '\n\n' : '') + para;
      }

      if (buffer.trim().length > 0) {
        const idx = chunks.length;
        chunks.push({
          id: generateChunkId(sourceUrl, idx),
          source_url: sourceUrl,
          source_name: sourceName,
          chunk_index: idx,
          content: buffer.trim(),
        });
      }
    }
  }

  return chunks;
}
