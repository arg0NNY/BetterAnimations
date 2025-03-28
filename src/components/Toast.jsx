import IconBrand from '@/components/icons/IconBrand'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import { Common } from '@/modules/DiscordModules'
import { css } from '@/modules/Style'
import IconBrandInfo from '@/components/icons/IconBrandInfo'
import IconBrandSuccess from '@/components/icons/IconBrandSuccess'
import IconBrandWarning from '@/components/icons/IconBrandWarning'
import IconBrandError from '@/components/icons/IconBrandError'

export const ToastTypes = {
  DEFAULT: 0,
  INFO: 1,
  SUCCESS: 2,
  WARNING: 3,
  ERROR: 4
}

function ToastIcon ({ type, className }) {
  switch (type) {
    case ToastTypes.INFO: return <IconBrandInfo className={className} />
    case ToastTypes.SUCCESS: return <IconBrandSuccess className={className} />
    case ToastTypes.WARNING: return <IconBrandWarning className={className} />
    case ToastTypes.ERROR: return <IconBrandError className={className} />
    default: return <IconBrand className={className + ` BA__toastIconDefault`} />
  }
}

function Toast ({ children, text, type = ToastTypes.INFO }) {
  return (
    <div className={DiscordClasses.Toast.toast}>
      <ToastIcon
        type={type}
        className={`${DiscordClasses.Toast.icon} BA__toastIcon`}
      />
      {text && (
        <Common.Text
          color="header-primary"
          variant="text-md/normal"
        >
          {text}
        </Common.Text>
      )}
      {children}
    </div>
  )
}

export default Toast

css
`.BA__toastIcon {
    width: 32px !important;
    height: 32px !important;
    margin-right: 12px;
}

.BA__toastIconDefault {
    margin-right: 4px;
}`
`Toast`
