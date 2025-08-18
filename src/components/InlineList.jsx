import { Fragment } from 'react'

function InlineList ({
  items,
  limit = 3,
  dividers = [', ', ' and '],
  tag: Tag = Fragment,
  itemTag: ItemTag = 'b'
}) {
  const nodes = items.length <= limit
    ? items
    : items.slice(0, limit - 1).concat(items.length - limit + 1)

  if (!nodes.length) return null

  return (
    <Tag>
      {nodes.map((node, index) => (
        <>
          {typeof node === 'number' ? `${node} others` : <ItemTag>{node}</ItemTag>}
          {[...dividers, ''][Math.max(0, index - nodes.length + dividers.length + 1)]}
        </>
      ))}
    </Tag>
  )
}

export default InlineList
