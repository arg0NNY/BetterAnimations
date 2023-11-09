import { React } from '@/BdApi'
import { applyScrolls } from '@/helpers/scrollers'

function HTMLNode ({ scrolls }, ref) {
  const nodeRef = React.useCallback(nodeRef => {
    if (!nodeRef) return

    nodeRef.append(...ref.current.childNodes)
    if (attrs.style) nodeRef.setAttribute('style', attrs.style)

    if (scrolls) applyScrolls(nodeRef, scrolls)

    ref.current = nodeRef
  }, [])

  const attrs = Array.from(ref.current.attributes)
    .reduce(
      (attrs, i) => Object.assign(attrs, { [i.name.replace(/^class$/, 'className')]: i.value }),
      {}
    )

  return React.createElement(
    ref.current.nodeName.toLowerCase(),
    Object.assign(attrs, { style: undefined, ref: nodeRef, 'data-cloned': '' })
  )
}

export default React.forwardRef(HTMLNode)
