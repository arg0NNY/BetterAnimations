import { Component } from 'react'
import ErrorManager from '@error/manager'
import InternalError from '@error/structs/InternalError'
import ErrorCard from './components/ErrorCard'
import { Button, Text } from '@discord/modules'
import IconBrand, { IconBrandTypes } from '@/components/icons/IconBrand'
import Core from '@/modules/Core'

export function errorBoundary (callback, fallback = () => undefined, options = {}) {
  return (...args) => {
    try {
      return callback(...args)
    } catch (error) {
      ErrorManager.registerInternalError(
        new InternalError(error.stack, options)
      )
    }
    return fallback(...args)
  }
}

export function moduleErrorBoundary (moduleId, callback, fallback) {
  return errorBoundary(callback, fallback, { module: Core.getModule(moduleId) })
}

export function attempt (callback, fallback, options) {
  return errorBoundary(callback, fallback, options)()
}

export class ErrorBoundary extends Component {
  static NO_ERROR = {}
  state = { error: ErrorBoundary.NO_ERROR }

  componentDidCatch (error, errorInfo) {
    this.props.onError?.({ error, errorInfo })

    const internalError = new InternalError(
      error.stack + errorInfo.componentStack,
      { module: this.props.module }
    )
    this.setState({ error: internalError })
    ErrorManager.registerInternalError(internalError)
  }

  render () {
    const {
      noop,
      fallback,
      children,
      actions = e => e,
      module,
      ...props
    } = this.props

    if (this.state.error === ErrorBoundary.NO_ERROR) return children
    if (noop) return null
    if (fallback !== undefined) return fallback

    const _actions = (
      <Button
        size="sm"
        text="View"
        onClick={() => ErrorManager.showModal([this.state.error])}
      />
    )

    return (
      <ErrorCard
        {...props}
        text="An error occurred."
        actions={actions(_actions)}
      />
    )
  }
}

ErrorBoundary.wrap = (Component, boundaryProps) => props => (
  <ErrorBoundary {...boundaryProps}>
    <Component {...props} />
  </ErrorBoundary>
)
