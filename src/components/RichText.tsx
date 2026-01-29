'use client'

import { serializeLexical } from './serialize'

type Props = {
  content: any
  className?: string
}

export function RichText({ content, className = '' }: Props) {
  if (!content) return null

  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      {serializeLexical({ nodes: content.root?.children || [] })}
    </div>
  )
}
