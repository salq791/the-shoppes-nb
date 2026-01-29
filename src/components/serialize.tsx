import React, { Fragment } from 'react'
import Link from 'next/link'

type Node = {
  type: string
  version: number
  [key: string]: any
}

type Props = {
  nodes: Node[]
}

export function serializeLexical({ nodes }: Props): React.ReactNode {
  return (
    <Fragment>
      {nodes.map((node, index) => {
        if (node.type === 'text') {
          let text = <Fragment key={index}>{node.text}</Fragment>
          if (node.format & 1) text = <strong key={index}>{text}</strong>
          if (node.format & 2) text = <em key={index}>{text}</em>
          if (node.format & 8) text = <u key={index}>{text}</u>
          if (node.format & 16) text = <code key={index}>{text}</code>
          if (node.format & 4) text = <s key={index}>{text}</s>
          return text
        }

        if (!node) return null

        const serializedChildren = node.children
          ? serializeLexical({ nodes: node.children })
          : null

        switch (node.type) {
          case 'paragraph':
            return <p key={index}>{serializedChildren}</p>
          case 'heading':
            const Tag = `h${node.tag}` as keyof React.JSX.IntrinsicElements
            return <Tag key={index}>{serializedChildren}</Tag>
          case 'list':
            if (node.listType === 'number') {
              return <ol key={index}>{serializedChildren}</ol>
            }
            return <ul key={index}>{serializedChildren}</ul>
          case 'listitem':
            return <li key={index}>{serializedChildren}</li>
          case 'link':
            const href = node.fields?.url || node.url || '#'
            const target = node.fields?.newTab ? '_blank' : undefined
            if (href.startsWith('/')) {
              return (
                <Link key={index} href={href}>
                  {serializedChildren}
                </Link>
              )
            }
            return (
              <a key={index} href={href} target={target} rel={target ? 'noopener noreferrer' : undefined}>
                {serializedChildren}
              </a>
            )
          case 'quote':
            return <blockquote key={index}>{serializedChildren}</blockquote>
          case 'linebreak':
            return <br key={index} />
          default:
            return <Fragment key={index}>{serializedChildren}</Fragment>
        }
      })}
    </Fragment>
  )
}
