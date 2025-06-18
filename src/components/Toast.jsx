import IconBrand, { IconBrandTypes } from '@/components/icons/IconBrand'
import DiscordClasses from '@discord/classes'
import { Text } from '@discord/modules'
import { css } from '@style'
import classNames from 'classnames'

export const ToastTypes = IconBrandTypes

function Toast ({ children, text, type = ToastTypes.INFO }) {
  return (
    <div className={DiscordClasses.Toast.toast}>
      <IconBrand
        type={type}
        className={classNames({
          [DiscordClasses.Toast.icon]: true,
          'BA__toastIcon': true,
          'BA__toastIconDefault': type === ToastTypes.DEFAULT
        })}
      />
      {text && (
        <Text
          color="header-primary"
          variant="text-md/normal"
        >
          {text}
        </Text>
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
