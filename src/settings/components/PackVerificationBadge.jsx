import { verificationIssueResolveMethods, verificationStatuses } from '@/settings/data/verification'
import { Popout, Text, Timeout, Tooltip } from '@discord/modules'
import { useCallback, useMemo, useRef, useState } from 'react'
import { css } from '@style'
import usePackRegistry from '@/hooks/usePackRegistry'
import { stop } from '@/settings/utils/eventModifiers'
import VerificationIssueActions from '@/components/VerificationIssueActions'
import VerificationIssueSelection from '@/components/VerificationIssueSelection'

function BadgePopout ({ pack, onClose }) {
  const registry = usePackRegistry()
  const { icon, label, description } = verificationStatuses[pack.verificationStatus]
  const resolveMethod = verificationIssueResolveMethods[registry.verifier.getResolveMethod(pack)]

  return (
    <div className="BA__badgePopout">
      <div className="BA__badgePopoutIcon">
        {icon({
          size: 'custom',
          width: 64,
          height: 64
        })}
      </div>
      <div className="BA__badgePopoutInfo">
        <Text variant="heading-lg/semibold">{label}</Text>
        {description && (
          <Text
            className="BA__badgePopoutDescription"
            variant="text-sm/normal"
          >
            {description}
          </Text>
        )}
        {!registry.verifier.check(pack) ? (
          <VerificationIssueActions
            className="BA__badgePopoutActions"
            pack={pack}
            onSelect={method => {
              registry.verifier.resolveIssue({ pack, method: method.value })
              onClose?.()
            }}
            size="sm"
            disabled={registry.hasPending}
          />
        ) : (resolveMethod && (
          <VerificationIssueSelection
            {...resolveMethod}
            className="BA__badgePopoutActions"
            label={resolveMethod.label(true)}
            onUndo={() => registry.verifier.removeFromWhitelist(pack)}
          />
        ))}
      </div>
    </div>
  )
}

function PackVerificationBadge ({ pack, size = 'sm', popoutType = 'popout' }) {
  const { icon, tooltipColor, label } = verificationStatuses[pack.verificationStatus]

  const iconRef = useRef()
  const [shouldShow, setShouldShow] = useState(false)

  const showTimeout = useMemo(() => new Timeout, [])
  const hideTimeout = useMemo(() => new Timeout, [])

  const handleEnter = useCallback(() => {
    hideTimeout.stop()
    showTimeout.start(200, () => setShouldShow(true))
  }, [showTimeout, hideTimeout, setShouldShow])
  const handleLeave = useCallback(() => {
    showTimeout.stop()
    hideTimeout.start(200, () => setShouldShow(false))
  }, [showTimeout, hideTimeout, setShouldShow])

  if (popoutType === 'tooltip') return (
    <Tooltip text={label} color={tooltipColor}>
      {props => icon({ ...props, size })}
    </Tooltip>
  )

  return (
    <Popout
      targetElementRef={iconRef}
      shouldShow={shouldShow}
      position="right"
      align="center"
      spacing={0}
      renderPopout={() => (
        <div
          className="BA__badgePopoutContainer"
          onMouseEnter={() => hideTimeout.stop()}
          onMouseLeave={handleLeave}
          onClick={stop()}
        >
          <BadgePopout
            pack={pack}
            onClose={() => setShouldShow(false)}
          />
        </div>
      )}
    >
      {() => icon({
        ref: iconRef,
        onMouseEnter: handleEnter,
        onMouseLeave: handleLeave,
        size
      })}
    </Popout>
  )
}

export default PackVerificationBadge

css
`.BA__badgePopoutContainer {
    padding: 8px;
}
.BA__badgePopout {
    box-shadow: var(--shadow-high);
    background-color: var(--background-surface-high);
    border-radius: 8px;
    border: 1px solid var(--border-subtle);
    max-width: 400px;
    padding: 16px;
    display: flex;
    align-items: stretch;
    gap: 8px;
}
.BA__badgePopoutIcon {
    width: 64px;
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
}
.BA__badgePopoutInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.BA__badgePopoutDescription {
    margin-top: 2px;
}
.BA__badgePopoutActions {
    margin-top: 8px;
}`
`PackVerificationBadge`
