import { useCallback, useMemo, useRef } from 'react'
import usePackRegistry from '@/hooks/usePackRegistry'
import {
  VerificationIssueResolveMethod,
  verificationIssueResolveMethods,
  VerificationStatus
} from '@/settings/data/verification'
import { isDismissed } from '@/hooks/useDismissible'
import { Button, ButtonGroup, ModalActions, ModalSize, Popout, Text } from '@discord/modules'
import DismissibleModal from '@/components/DismissibleModal'
import { ContextMenu } from '@/BdApi'
import MoreIcon from '@/settings/components/icons/MoreIcon'

export function useResolveMethods (pack) {
  const registry = usePackRegistry()
  const hasUpdate = registry.hasUpdate(pack)

  return useMemo(() => {
    const additional = [
      verificationIssueResolveMethods[VerificationIssueResolveMethod.ALLOW_ONCE],
      verificationIssueResolveMethods[VerificationIssueResolveMethod.ALLOW_ALWAYS]
    ]

    switch (pack.verificationStatus) {
      case VerificationStatus.UNKNOWN: return {
        main: [verificationIssueResolveMethods[VerificationIssueResolveMethod.ALLOW_ONCE]],
        additional: [verificationIssueResolveMethods[VerificationIssueResolveMethod.ALLOW_ALWAYS]]
      }
      case VerificationStatus.UNVERIFIED: return {
        main: [verificationIssueResolveMethods[VerificationIssueResolveMethod.DELETE]],
        additional
      }
      case VerificationStatus.FAILED: return {
        main: [
          hasUpdate
            ? verificationIssueResolveMethods[VerificationIssueResolveMethod.UPDATE]
            : verificationIssueResolveMethods[VerificationIssueResolveMethod.REINSTALL]
        ],
        additional: [
          verificationIssueResolveMethods[VerificationIssueResolveMethod.UNINSTALL],
          ...additional
        ]
      }
      default: return {
        main: [],
        additional
      }
    }
  }, [pack.verificationStatus, hasUpdate])
}

function VerificationIssueActions ({ pack, onSelect, size = 'sm', disabled = false, ...props }) {
  const additionalButtonRef = useRef()

  const { main, additional } = useResolveMethods(pack)

  const selectMethod = useCallback(method => {
    const dismissibleName = `verificationIssueResolveMethodConfirmation:${method.value}`

    if (!method.confirmation || isDismissed(dismissibleName)) return onSelect(method)

    ModalActions.openModal(props => (
      <DismissibleModal
        {...props}
        name={dismissibleName}
        size={ModalSize.MEDIUM}
        title={method.label()}
        cancelText="Cancel"
        confirmText={method.confirmation.confirmText}
        confirmButtonVariant="critical-primary"
        onConfirm={() => onSelect(method)}
      >
        <Text variant="text-md/normal">
          {method.confirmation.text(pack)}
        </Text>
      </DismissibleModal>
    ))
  }, [pack, onSelect])

  return (
    <ButtonGroup
      {...props}
      size={size}
    >
      {main.map(method => (
        <Button
          variant={method.variant}
          icon={method.icon}
          text={method.label()}
          size={size}
          onClick={() => selectMethod(method)}
          disabled={disabled}
        />
      ))}
      <Popout
        targetElementRef={additionalButtonRef}
        position="bottom"
        align="right"
        renderPopout={({ closePopout, ...props }) => (
          <ContextMenu.Menu
            {...props}
            onClose={closePopout}
          >
            {additional.map(method => (
              <ContextMenu.Item
                key={method.value}
                id={method.value}
                label={method.label()}
                icon={method.icon}
                color={method.variant === 'critical-primary' ? 'danger' : undefined}
                action={() => selectMethod(method)}
              />
            ))}
          </ContextMenu.Menu>
        )}
      >
        {props => (
          <Button
            {...props}
            buttonRef={additionalButtonRef}
            variant="secondary"
            size={size}
            icon={MoreIcon}
            disabled={disabled}
          />
        )}
      </Popout>
    </ButtonGroup>
  )
}

export default VerificationIssueActions
