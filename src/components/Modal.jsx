import {
  Button,
  Heading,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalRoot,
  Tooltip
} from '@discord/modules'
import IconBrand from '@/components/icons/IconBrand'
import { css } from '@style'
import meta from '@/meta'

function Modal ({
  title,
  children,
  onClose,
  confirmText = 'Close',
  confirmButtonColor = Button.Colors.PRIMARY,
  cancelText,
  onConfirm,
  onCancel,
  loading = false,
  ...props
}) {
  return (
    <ModalRoot
      className="BA__modal"
      {...props}
    >
      <ModalHeader separator={false}>
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
              size="custom"
              width={36}
              height={36}
            />
          )}
        </Tooltip>
        <Heading variant="heading-lg/semibold">
          {title ?? meta.name}
        </Heading>
      </ModalHeader>
      <ModalContent className="BA__modalContent">
        {children}
      </ModalContent>
      <ModalFooter>
        <Button
          type="submit"
          color={confirmButtonColor}
          submitting={loading}
          onClick={() => {
            onConfirm?.()
            onClose()
          }}
        >
          {confirmText}
        </Button>
        {cancelText ? (
          <Button
            type="button"
            look={Button.Looks.LINK}
            color={Button.Colors.PRIMARY}
            disabled={loading}
            onClick={() => {
              onCancel?.()
              onClose()
            }}
          >
            {cancelText}
          </Button>
        ) : null}
      </ModalFooter>
    </ModalRoot>
  )
}

export default Modal

css
`.BA__modal {
    min-height: unset;
}

.BA__modalIcon {
    margin-right: 4px;
}

.BA__modalContent {
    padding-bottom: 20px;
}`
`Modal`