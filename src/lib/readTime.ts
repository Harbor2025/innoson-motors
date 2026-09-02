// src/lib/readTime.ts

/** Minimal shape of a Lexical (Payload richText) editor state we need to walk. */
interface LexicalNode {
  type?: string
  text?: string
  children?: LexicalNode[]
}
interface LexicalRoot {
  root?: LexicalNode
}

const WORDS_PER_MINUTE = 200

/** Recursively extracts plain text from a Lexical rich text JSON value. */
export function lexicalToPlainText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  const root = (value as LexicalRoot).root
  if (!root) return ''

  const chunks: string[] = []
  const walk = (node?: LexicalNode) => {
    if (!node) return
    if (typeof node.text === 'string') chunks.push(node.text)
    node.children?.forEach(walk)
  }
  walk(root)
  return chunks.join(' ')
}

/** Computes a rounded-up "N min read" value from plain text, minimum 1. */
export function calculateReadTimeMinutes(plainText: string): number {
  const words = plainText.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
