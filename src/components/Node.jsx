import { useLayoutEffect, useMemo, useRef } from 'react'
import { applyScrolls, attributesToProps } from '@/utils/html'

function Node ({ ref = useRef(), node, scrollsMapping }) {
  const Element = useMemo(() => node.localName, [node])
  const props = useMemo(() => attributesToProps(node), [node])

  useLayoutEffect(() => {
    ref.current?.replaceChildren(...node.childNodes)
    if (scrollsMapping) applyScrolls(ref.current, scrollsMapping)
  }, [node])

  return <Element {...props} ref={ref} />
}

export default Node
