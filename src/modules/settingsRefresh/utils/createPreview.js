import { forwardRef } from 'react'

function createPreview (component) {
  return forwardRef((props, ref) => {
    const { style, ...rest } = props

    const value = component(props, ref)
    value.ref = ref
    value.props.style = Object.assign({}, value.props.style, style)
    Object.assign(value.props, rest)

    return value
  })
}

export default createPreview
