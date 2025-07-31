import Modal from '@/components/Modal'
import { useEffect, useMemo, useState } from 'react'
import { Alert, AlertTypes, colors, ModalSize, Text } from '@discord/modules'
import { css } from '@style'
import usePackRegistry from '@/hooks/usePackRegistry'
import { verificationIssueResolveMethods, verificationStatuses } from '@/settings/data/verification'
import PackHeader from '@/settings/components/pack/PackHeader'
import CheckIcon from '@/components/icons/CheckIcon'
import VerificationIssueActions from '@/components/VerificationIssueActions'
import VerificationIssueSelection from '@/components/VerificationIssueSelection'
import Messages from '@shared/messages'
import { ErrorBoundary } from '@error/boundary'

function ResolveMethodSelector ({ size = 'sm', pack, method, setMethod, disabled = false }) {
  const selectedMethod = verificationIssueResolveMethods[method]

  const children = selectedMethod ? (
    <VerificationIssueSelection
      {...selectedMethod}
      size={size}
      onUndo={() => setMethod(null)}
    />
  ) : (
    <VerificationIssueActions
      pack={pack}
      onSelect={method => setMethod(method.value)}
      size={size}
      direction="horizontal-reverse"
      disabled={disabled}
    />
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
  }, [resolvers.length, issues.length])

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
      <ErrorBoundary>
        {registry.hasError && (
          <Alert messageType={AlertTypes.ERROR}>{Messages.CATALOG_OUT_OF_DATE}</Alert>
        )}
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
      </ErrorBoundary>
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
.BA__verificationIssueDescription {
    margin-top: 12px;
}`
`VerificationIssuesModal`
