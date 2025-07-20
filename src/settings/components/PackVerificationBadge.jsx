import { verificationStatuses } from '@/settings/data/verification'
import { Tooltip } from '@discord/modules'

function PackVerificationBadge ({ type, size = 'sm', popoutType = 'popout' }) {
  const { icon, tooltipColor, label } = verificationStatuses[type]

  if (popoutType === 'tooltip') return (
    <Tooltip text={label} color={tooltipColor}>
      {props => icon({ ...props, size })}
    </Tooltip>
  )

  return icon({ size }) // TODO: Popout
}

export default PackVerificationBadge
