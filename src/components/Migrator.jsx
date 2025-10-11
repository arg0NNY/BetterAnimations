import Modal from '@/components/Modal'
import Messages from '@shared/messages'
import { Alert, AlertTypes, Button, ButtonGroup, Stack, Text } from '@discord/modules'
import { useEffect } from 'react'
import { css } from '@style'
import classNames from 'classnames'

export function MigratorModal ({ migrator, ...props }) {
  const {
    isActive,
    message,
    actions
  } = migrator.use()

  useEffect(() => {
    if (!isActive) props.onClose?.()
  }, [isActive])

  return (
    <Modal
      {...props}
      title={Messages.SETTINGS_MIGRATOR}
      footer={(
        <ButtonGroup direction="horizontal-reverse">
          {actions.map(props => (
            <Button {...props} />
          ))}
        </ButtonGroup>
      )}
    >
      <Text variant="text-md/normal">
        {message}
      </Text>
    </Modal>
  )
}

export function MigratorAlert ({ migrator, ...props }) {
  const {
    message,
    actions
  } = migrator.use()

  return (
    <Alert
      {...props}
      messageType={AlertTypes.WARNING}
    >
      <Stack gap={8}>
        {message}
        <ButtonGroup size="sm">
          {actions.map(props => (
            <Button {...props} size="sm" />
          ))}
        </ButtonGroup>
      </Stack>
    </Alert>
  )
}

export function MigratorContainer ({ migrator, children, className, contentClassName }) {
  const { isActive } = migrator.use()

  return (
    <div
      className={classNames({
        'BA__migratorContainer': true,
        'BA__migratorContainer--blocked': isActive
      }, className)}
    >
      {isActive && <MigratorAlert migrator={migrator} />}
      <div className={classNames('BA__migratorContainerContent', contentClassName)}>
        {children}
      </div>
    </div>
  )
}

css
`.BA__migratorContainer {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.BA__migratorContainer--blocked .BA__migratorContainerContent {
    pointer-events: none;
    opacity: .4;
}`
`Migrator Components`
