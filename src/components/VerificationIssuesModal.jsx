import Modal from '@/components/Modal'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, colors, ModalActions, ModalSize, Popout, Text, Tooltip } from '@discord/modules'
import { css } from '@style'
import usePackRegistry from '@/hooks/usePackRegistry'
import classNames from 'classnames'
import RedoIcon from '@/settings/components/icons/RedoIcon'
import { ContextMenu } from '@/BdApi'
import MoreIcon from '@/settings/components/icons/MoreIcon'
import {
  VerificationIssueResolveMethod,
  verificationIssueResolveMethods,
  VerificationStatus, verificationStatuses
} from '@/settings/data/verification'
import PackHeader from '@/settings/components/PackHeader'
import CheckIcon from '@/settings/components/icons/CheckIcon'
import { isDismissed } from '@/hooks/useDismissible'
import DismissibleModal from '@/components/DismissibleModal'
import { ErrorBoundary } from '@error/boundary'

function useResolveMethods (pack) {
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

function ResolveMethodSelector ({ size = 'sm', pack, method, setMethod, disabled = false }) {
  const additionalButtonRef = useRef()
  const { main, additional } = useResolveMethods(pack)

  const selectMethod = useCallback(method => {
    const dismissibleName = `verificationIssueResolveMethodConfirmation:${method.value}`

    if (!method.confirmation || isDismissed(dismissibleName)) return setMethod(method.value)

    ModalActions.openModal(props => (
      <DismissibleModal
        {...props}
        name={dismissibleName}
        size={ModalSize.MEDIUM}
        title={method.label}
        cancelText="Cancel"
        confirmText={method.confirmation.confirmText}
        confirmButtonVariant="critical-primary"
        onConfirm={() => setMethod(method.value)}
      >
        <Text variant="text-md/normal">
          {method.confirmation.text(pack)}
        </Text>
      </DismissibleModal>
    ))
  }, [pack, setMethod])

  const MethodsContextMenu = ContextMenu.buildMenu(
    additional.map(method => ({
      label: method.label,
      icon: method.icon && (() => <method.icon size="sm" color="currentColor" />),
      color: method.variant === 'critical-primary' ? 'danger' : undefined,
      action: () => selectMethod(method)
    }))
  )

  const selectedMethod = verificationIssueResolveMethods[method]

  const children = selectedMethod ? (
    <>
      <Tooltip text="Undo">
        {props => (
          <Button
            {...props}
            variant="secondary"
            size={size}
            icon={RedoIcon}
            onClick={() => setMethod(null)}
            disabled={disabled}
          />
        )}
      </Tooltip>
      <div
        className={classNames([
          'BA__verificationIssueSelection',
          `BA__verificationIssueSelection--${selectedMethod.variant}`
        ])}
      >
        {selectedMethod.icon && (
          <selectedMethod.icon
            size={size}
            color="currentColor"
          />
        )}
        <Text
          variant="text-md/semibold"
          color="currentColor"
        >
          {selectedMethod.label}
        </Text>
      </div>
    </>
  ) : (
    <>
      {main.map(method => (
        <Button
          variant={method.variant}
          icon={method.icon}
          text={method.label}
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
          <ErrorBoundary>
            <MethodsContextMenu
              {...props}
              onClose={closePopout}
            />
          </ErrorBoundary>
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
    </>
  )

  return (
    <div className="BA__verificationIssueActions">
      {children}
    </div>
  )
}

function VerificationIssue ({ pack, method, setMethod, disabled }) {
  const status = useMemo(
    () => verificationStatuses[pack.verificationStatus],
    [pack.verificationStatus]
  )

  return (
    <div className="BA__verificationIssue">
      <div className="BA__verificationIssueInfo">
        <PackHeader
          pack={pack}
          popoutType="tooltip"
          size="sm"
          icon={method != null ? (
            <CheckIcon
              size="sm"
              color={colors.STATUS_POSITIVE}
            />
          ) : undefined}
        />
        <ResolveMethodSelector
          pack={pack}
          method={method}
          setMethod={setMethod}
          disabled={disabled}
        />
      </div>
      {method == null && status?.description && (
        <Text
          className="BA__verificationIssueDescription"
          variant="text-sm/normal"
        >
          {status.description}
        </Text>
      )}
    </div>
  )
}

function VerificationIssuesModal ({ onClose, ...props }) {
  const registry = usePackRegistry()
  const loading = registry.hasPending
  const issues = registry.verifier.getIssues()

  const [selectedMethods, setSelectedMethods] = useState({})

  useEffect(() => {
    if (!issues.length) onClose?.()
  }, [issues.length])

  const resolvers = issues
    .filter(pack => selectedMethods[pack.id] != null)
    .map(pack => ({ pack, method: selectedMethods[pack.id] }))

  const confirmText = useMemo(() => {
    if (!resolvers.length) return 'Resolve issues'
    if (resolvers.length < issues.length) return `Resolve ${resolvers.length} out of ${issues.length} issues`
    return 'Resolve all issues'
  }, [resolvers.length])

  const onConfirm = async preventClose => {
    preventClose()
    if (await registry.verifier.resolveIssues(resolvers)) onClose()
  }

  return (
    <Modal
      {...props}
      onClose={onClose}
      size={ModalSize.MEDIUM}
      title="Resolve issues"
      cancelText="Cancel"
      confirmText={confirmText}
      confirmButtonVariant="primary"
      loading={loading}
      disabled={!resolvers.length || loading}
      onConfirm={onConfirm}
    >
      <div className="BA__verificationIssuesList">
        {issues.map(pack => (
          <VerificationIssue
            key={pack.filename}
            pack={pack}
            method={selectedMethods[pack.id]}
            setMethod={method => setSelectedMethods(prev => ({ ...prev, [pack.id]: method }))}
            disabled={loading}
          />
        ))}
      </div>
    </Modal>
  )
}

export default VerificationIssuesModal

css
`.BA__verificationIssue {
    padding: 16px 0;
    border-bottom: 1px solid var(--border-subtle);
}
.BA__verificationIssueInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
}
.BA__verificationIssueActions {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}
.BA__verificationIssueSelection {
    display: flex;
    align-items: center;
    gap: 4px;
}
.BA__verificationIssueSelection--primary {
    color: var(--text-brand);
}
.BA__verificationIssueSelection--critical-primary {
    color: var(--text-feedback-critical);
}
.BA__verificationIssueDescription {
    margin-top: 12px;
}`
`VerificationIssuesModal`
