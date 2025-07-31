import classNames from 'classnames'
import { Button, ButtonGroup, Text, Tooltip } from '@discord/modules'
import RedoIcon from '@/components/icons/RedoIcon'
import { css } from '@style'

function VerificationIssueSelection ({ variant, icon: Icon, label, onUndo, size = 'sm', disabled = false, ...props }) {
  return (
    <ButtonGroup
      {...props}
      size={size}
    >
      <div
        className={classNames([
          'BA__verificationIssueSelection',
          `BA__verificationIssueSelection--${variant}`
        ])}
      >
        {Icon && (
          <Icon
            size={size}
            color="currentColor"
          />
        )}
        <Text
          variant="text-md/semibold"
          color="currentColor"
        >
          {typeof label === 'function' ? label() : label}
        </Text>
      </div>
      {onUndo && (
        <Tooltip text="Undo">
          {props => (
            <Button
              {...props}
              variant="secondary"
              size={size}
              icon={RedoIcon}
              onClick={onUndo}
              disabled={disabled}
            />
          )}
        </Tooltip>
      )}
    </ButtonGroup>
  )
}

export default VerificationIssueSelection

css
`.BA__verificationIssueSelection {
    display: flex;
    align-items: center;
    gap: 4px;
}
.BA__verificationIssueSelection--primary {
    color: var(--text-brand);
}
.BA__verificationIssueSelection--critical-primary {
    color: var(--text-feedback-critical);
}`
`VerificationIssueSelection`
