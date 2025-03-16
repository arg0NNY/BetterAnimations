import { Common } from '@/modules/DiscordModules'
import Toast, { ToastTypes } from '@/components/Toast'

export default class Toasts {
  static get Types () { return ToastTypes }

  static success (content, options = {}) {return this.show(content, Object.assign(options, { type: Toasts.Types.SUCCESS }))}
  static info (content, options = {}) {return this.show(content, Object.assign(options, { type: Toasts.Types.INFO }))}
  static warning (content, options = {}) {return this.show(content, Object.assign(options, { type: Toasts.Types.WARNING }))}
  static error (content, options = {}) {return this.show(content, Object.assign(options, { type: Toasts.Types.ERROR }))}
  static default (content, options = {}) {return this.show(content, Object.assign(options, { type: Toasts.Types.DEFAULT }))}

  static show (content, options = {}) {
    const { type = Toasts.Types.DEFAULT, ...rest } = options
    Common.showToast(
      Common.createToast(null, null, {
        component: <Toast type={type} text={content} />,
        ...rest
      })
    )
  }
}
