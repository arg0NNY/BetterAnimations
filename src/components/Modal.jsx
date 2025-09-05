import {
  Button,
  ButtonGroup,
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
import { ErrorBoundary } from '@error/boundary'
import useEmitterEffect from '@/hooks/useEmitterEffect'
import Events from '@enums/Events'

function Modal ({
  title,
  children,
  footerLeading,
  footer,
  onClose,
  confirmText = 'Close',
  confirmButtonVariant = 'secondary',
  cancelText,
  onConfirm,
  onCancel,
  loading = false,
  disabled = loading,
  ...props
}) {
  useEmitterEffect(Events.PluginDisabled, onClose)

  const onCallback = callback => () => {
    let shouldClose = true
    const preventClose = () => shouldClose = false
    callback?.(preventClose)
    if (shouldClose) onClose?.()
  }

  return (
    <ModalRoot
      className="BA__modal"
      {...props}
    >
      <ErrorBoundary>
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
        {footer !== false && (
          <ModalFooter>
            {footer ?? (
              <ButtonGroup
                className="BA__modalButtonGroup"
                direction="horizontal-reverse"
              >
                <Button
                  type="submit"
                  variant={confirmButtonVariant}
                  text={confirmText}
                  loading={loading}
                  disabled={disabled}
                  onClick={onCallback(onConfirm)}
                />
                {cancelText ? (
                  <Button
                    type="button"
                    variant="secondary"
                    text={cancelText}
                    disabled={loading}
                    onClick={onCallback(onCancel)}
                  />
                ) : null}
              </ButtonGroup>
            )}
            {footerLeading}
          </ModalFooter>
        )}
      </ErrorBoundary>
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
}

.BA__modalButtonGroup {
    width: auto;
}`
`Modal`
