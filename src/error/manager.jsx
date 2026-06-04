import { ErrorManager as BaseErrorManager } from '@shared/error/manager'
import Logger from '@logger'
import { createToast, ModalActions, popToast, useToastStore, ToastStoreModule } from '@discord/modules'
import ErrorModal from '@/components/error/ErrorModal'
import ErrorToast, { ErrorToastText } from '@/components/error/ErrorToast'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import Config from '@/modules/Config'
import SuppressErrors from '@enums/SuppressErrors'
import AnimationError from '@error/structs/AnimationError'
import { isDev } from '@/env'
import Notifications from '@/modules/Notifications'

const ErrorManagerToastSymbol = Symbol('ErrorManagerToast')
const ERROR_MANAGER_NOTIFICATION_ID = 'BA__errorManagerNotification'

export default new class ErrorManager extends BaseErrorManager {
  get timeoutDuration () { return 10000 }
  get maxErrors () { return 20 }

  constructor () {
    super()
    this.errors = []
    this.errorsOverload = false
    this.timeout = null
    this.notification = null
  }

  initialize () {
    this.clear()
    Logger.info(this.name, 'Initialized.')
  }

  shouldSuppress (error) {
    if (error.silent && !isDev) return true

    switch (Config.current.general.suppressErrors) {
      case SuppressErrors.All: return true
      case SuppressErrors.Animation: return error instanceof AnimationError
      default: return false
    }
  }

  registerError (error, suppress = false) {
    super.registerError(error)

    if (suppress || this.shouldSuppress(error)) return

    this.errors.unshift(error)
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors)
      this.errorsOverload = true
    }

    Emitter.emit(Events.ErrorOccurred)

    if (this.isToastActive()) clearTimeout(this.timeout)
    else this.showToast()

    this.timeout = setTimeout(this.clear.bind(this), this.timeoutDuration)
  }

  get usingNotifications () {
    return !createToast || !ToastStoreModule || !useToastStore || !popToast
  }

  onView () {
    this.showModal()
    this.clear()
  }
  showToast () {
    if (this.usingNotifications) {
      this.notification = Notifications.error({
        id: ERROR_MANAGER_NOTIFICATION_ID,
        content: <ErrorToastText />,
        duration: Infinity,
        actions: [{
          label: 'View',
          onClick: this.onView.bind(this)
        }],
        onClose: this.clear.bind(this)
      })
      return
    }

    useToastStore.setState(state => ({
      ...state,
      currentToastMap: new Map([
        ...state.currentToastMap,
        ['APP', createToast(null, ErrorManagerToastSymbol, {
          component: <ErrorToast onView={this.onView.bind(this)} />,
          duration: 0
        })]
      ])
    }))
  }
  closeToast () {
    if (this.usingNotifications) return this.notification?.close()
    if (this.isToastActive()) popToast('APP', true)
  }
  isToastActive () {
    if (this.usingNotifications) return this.notification?.isVisible() ?? false
    return useToastStore.getState().currentToastMap.get('APP')?.type === ErrorManagerToastSymbol
  }

  clear () {
    this.errors = []
    this.errorsOverload = false
    clearTimeout(this.timeout)
    this.timeout = null
    this.closeToast()
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
