import { UI } from '@/BdApi'
import meta from '@/meta'
import IconBrand from '@/components/icons/IconBrand'

export default class Notifications {

  static info (options = {}) {return this.show(Object.assign({}, options, { type: 'info', iconType: IconBrand.Types.INFO }))}
  static warn (options = {}) {return this.show(Object.assign({}, options, { type: 'warning', iconType: IconBrand.Types.WARNING }))}
  static error (options = {}) {return this.show(Object.assign({}, options, { type: 'error', iconType: IconBrand.Types.ERROR }))}
  static success (options = {}) {return this.show(Object.assign({}, options, { type: 'success', iconType: IconBrand.Types.SUCCESS }))}

  static show (options = {}) {
    return UI.showNotification({
      title: meta.name,
      icon: () => <IconBrand type={options.iconType ?? IconBrand.Types.DEFAULT} />,
      ...options,
    })
  }

}
