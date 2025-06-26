import { cloneElement, useEffect, useRef, useState } from 'react'
import Node from '@/components/Node'
import { clone } from '@/utils/html'

const PENDING = 0
const ENTERING = 1
const ENTERED = 2

const callHook =
  (element, name, callback) =>
    (...args) => {
      if (element.props[name]) element.props[name](...args)
      callback()
    }

const overrides = {
  freeze: false,
  mountOnEnter: false,
  unmountOnExit: false
}

function HTMLSwitchTransition ({ component: Component = 'div', children, ...props }) {
  const currentKey = children?.key ?? null

  const ref = useRef()
  const exitElementRef = useRef()

  const [key, setKey] = useState(currentKey)
  const [status, setStatus] = useState(ENTERED)
  const [exitElement, setExitElement] = useState(null)

  useEffect(() => {
    if (status === PENDING) setStatus(ENTERING)
  }, [status])

  if (key !== currentKey) {
    setKey(currentKey)

    const node = ref.current?.nodeRef.current
    if (!node) {
      setStatus(ENTERED)
      return
    }

    setStatus(PENDING)
    setExitElement(
      <Node ref={exitElementRef} {...clone(node)} />
    )
  }

  const render = [
    cloneElement(children, {
      ...overrides,
      key: 'render',
      ref,
      exit: false,
      mountOnEnter: false,
      unmountOnExit: false,
      in: status !== PENDING,
      onEntered: callHook(children, 'onEntered', () => setStatus(ENTERED))
    }),
    exitElement && cloneElement(children, {
      ...overrides,
      key: 'clone',
      in: status === PENDING,
      container: false,
      containerRef: exitElementRef,
      children: exitElement,
      onExited: callHook(children, 'onExited', () => setExitElement(null))
    })
  ]

  return Component != null ? <Component {...props}>{render}</Component> : render
}

export default HTMLSwitchTransition
