import { Component } from 'react'
import ErrorManager from '@error/manager'
import InternalError from '@error/structs/InternalError'
import ErrorCard from '@error/components/ErrorCard'
import { Button, Text } from '@discord/modules'
import IconBrand, { IconBrandTypes } from '@/components/icons/IconBrand'
import Modules from '@/modules/Modules'

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
  return errorBoundary(callback, fallback, { module: Modules.getModule(moduleId) })
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
    if (this.state.error === ErrorBoundary.NO_ERROR) return this.props.children
    if (this.props.noop) return null
    if (this.props.fallback !== undefined) return this.props.fallback

    return (
      <ErrorCard>
        <IconBrand
          type={IconBrandTypes.ERROR}
          size="xl"
        />
        <Text variant="text-md/bold">An error occurred.</Text>
        <Button
          size={Button.Sizes.SMALL}
          onClick={() => ErrorManager.showModal([this.state.error])}
        >
          View
        </Button>
      </ErrorCard>
    )
  }
}
