import { useEffect, Suspense, Fragment } from 'react'

// https://github.com/software-mansion/react-freeze/blob/2e6ced224d72163d1890ce15fe87ebc4a987def9/src/index.tsx

const infiniteThenable = { then () {} }

function Suspender ({ freeze, children }) {
  if (freeze) {
    throw infiniteThenable
  }
  return <Fragment>{children}</Fragment>
}

function Freeze ({ freeze, children, placeholder = null, nodeRef }) {
  useEffect(() => {
    if (freeze && nodeRef?.current) {
      nodeRef.current.style.display = ''
      ;[].forEach.call(nodeRef.current.children, n => n.style.display = '')
    }
  }, [freeze])

  return (
    <Suspense fallback={placeholder}>
      <Suspender freeze={freeze}>{children}</Suspender>
    </Suspense>
  )
}

export default Freeze
