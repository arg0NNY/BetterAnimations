import {
  Button,
  ModalActionBar,
  ModalBody,
  ModalHeader,
  ModalRoot,
  Tooltip
} from '@discord/modules'
import IconBrand from '@/components/icons/IconBrand'
import { css } from '@style'
import meta from '@/meta'

function Modal ({
  title,
  subtitle,
  children,
  onClose,
  confirmText = 'Close',
  confirmButtonVariant = 'secondary',
  cancelText,
  onConfirm,
  onCancel,
  actions,
  actionsFullWidth = false,
  actionBarLeading,
  loading = false,
  ...props
}) {
  return (
    <ModalRoot
      className="BA__modal"
      onClose={onClose}
      {...props}
    >
      <ModalHeader
        title={title ?? meta.name}
        subtitle={subtitle}
        leading={(
          <Tooltip
            text={meta.name}
            shouldShow={!!title}
            position="bottom"
            align="left"
          >
            {props => (
              <IconBrand
                {...props}
                className="BA__modalIcon"
                size="xl"
              />
            )}
          </Tooltip>
        )}
      />
      <ModalBody className="BA__modalContent">
        {children}
      </ModalBody>
      <ModalActionBar
        actions={actions ?? [
          cancelText && {
            variant: 'secondary',
            text: cancelText,
            disabled: loading,
            onClick: () => {
              onCancel?.()
              onClose()
            }
          },
          {
            variant: confirmButtonVariant,
            text: confirmText,
            loading,
            onClick: () => {
              onConfirm?.()
              onClose()
            }
          }
        ].filter(Boolean)}
        actionsFullWidth={actionsFullWidth}
        leading={actionBarLeading}
      />
    </ModalRoot>
  )
}

export default Modal

css
`/*.BA__modal {
    min-height: unset;
}

.BA__modalIcon {
    margin-right: 4px;
}

.BA__modalContent {
    padding-bottom: 20px;
}*/`
`Modal`