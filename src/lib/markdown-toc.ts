// Markdown tool module for Cloudflare Workers environment
// This module provides markdown processing utilities that work without Node.js dependencies

export function convertBufferToMarkdown(text: string): string {
  // Convert common Markdown patterns to HTML
  let converted = text
  
  // Escape HTML tags first to prevent rendering
  converted = converted.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  
  // Convert inline code
  converted = converted.replace(/`([^`]+)`/g, '<code>$1</code>')
  
  // Convert code blocks
  converted = converted.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
  
  // Convert bold text
  converted = converted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  
  // Convert italic text
  converted = converted.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  
  // Convert links [text](url)
  converted = converted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
  
  // Convert headers
  converted = converted.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  converted = converted.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  converted = converted.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  
  // Convert unordered lists
  converted = converted.replace(/^- (.+)$/gm, '<li>$1</li>')
  converted = converted.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
  
  // Wrap list items in ul/ol
  converted = converted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  
  // Convert blockquotes
  converted = converted.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  
  return converted
}
