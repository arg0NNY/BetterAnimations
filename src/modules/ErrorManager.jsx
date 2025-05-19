import BaseErrorManager from '@shared/error/manager'
import Logger from '@logger'
import { createToast, ModalActions, popToast, popToastKeyed, useToastStore } from '@/modules/DiscordModules'
import ErrorModal from '@/components/error/ErrorModal'
import ErrorToast from '@/components/error/ErrorToast'
import Emitter from '@/modules/Emitter'
import Events from '@shared/enums/Events'
import Patcher from '@/modules/Patcher'

const ErrorManagerToastSymbol = Symbol('ErrorManagerToast')

export default new class ErrorManager extends BaseErrorManager {
  get timeoutDuration () { return 10000 }
  get maxErrors () { return 20 }

  constructor () {
    super()
    this.errors = []
    this.errorsOverload = false
    this.timeout = null
  }

  initialize () {
    this.patchPopToast()
    Logger.info(this.name, 'Initialized.')
  }

  isToastActive () {
    return useToastStore.getState().currentToast?.type === ErrorManagerToastSymbol
  }

  patchPopToast () {
    Patcher.instead(...popToastKeyed, (self, [force], original) => {
      if (force !== true && this.isToastActive()) return
      return original()
    })
  }

  clear () {
    this.errors = []
    this.errorsOverload = false
    clearTimeout(this.timeout)
    this.timeout = null
    if (this.isToastActive()) popToast(true)
  }

  registerError (error) {
    this.errors.unshift(error)
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors)
      this.errorsOverload = true
    }

    Logger.error(this.name, error)
    Emitter.emit(Events.ErrorOccurred)

    if (this.isToastActive()) clearTimeout(this.timeout)
    else this.showToast()

    this.timeout = setTimeout(this.clear.bind(this), this.timeoutDuration)
  }

  onView () {
    this.showModal()
    this.clear()
  }
  showToast () {
    useToastStore.setState(state => ({
      ...state,
      currentToast: createToast(null, ErrorManagerToastSymbol, {
        component: <ErrorToast onView={this.onView.bind(this)} />,
        duration: 0
      })
    }))
  }

  showModal (errors = this.errors) {
    if (!errors?.length) return

    ModalActions.openModal(props => (
      <ErrorModal
        errors={errors}
        {...props}
      />
    ))
  }

  shutdown () {
    this.clear()
    Logger.info(this.name, 'Shutdown.')
  }
}
