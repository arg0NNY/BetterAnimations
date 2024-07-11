import { React } from '@/BdApi'

// https://github.com/software-mansion/react-freeze/blob/2e6ced224d72163d1890ce15fe87ebc4a987def9/src/index.tsx

const infiniteThenable = { then () {} }

function Suspender ({ freeze, children }) {
  if (freeze) {
    throw infiniteThenable
  }
  return <React.Fragment>{children}</React.Fragment>
}

function Freeze ({ freeze, children, placeholder = null, nodeRef }) {
  React.useEffect(() => {
    if (freeze && nodeRef?.current) {
      nodeRef.current.style.display = ''
      nodeRef.current.childNodes.forEach(n => n.style.display = '')
    }
  }, [freeze])

  return (
    <React.Suspense fallback={placeholder}>
      <Suspender freeze={freeze}>{children}</Suspender>
    </React.Suspense>
  )
}

export default Freeze
