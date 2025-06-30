import { Alert } from '@discord/modules'
import XIcon from '@/settings/components/icons/XIcon'
import IconButton from '@/settings/components/IconButton'
import { css } from '@style'

function DismissibleAlert ({ children, onDismiss, ...props }) {
  return (
    <Alert {...props}>
      <div className="BA__dismissibleAlert">
        <div>
          {children}
        </div>
        <IconButton
          className="BA__dismissibleAlertDismiss"
          onClick={onDismiss}
        >
          <XIcon size="xs" color="currentColor" />
        </IconButton>
      </div>
    </Alert>
  )
}

export default DismissibleAlert

css
`.BA__dismissibleAlert {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
}
.BA__dismissibleAlertDismiss {
    flex-shrink: 0;
}`
`DismissibleAlert`
