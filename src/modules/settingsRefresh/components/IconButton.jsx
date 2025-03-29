import { css } from '@/modules/Style'
import { Common } from '@/modules/DiscordModules'
import { Utils } from '@/BdApi'

function IconButton ({ children, tooltip, disabled = false, active = false, className, ...props }) {
  const button = _props => (
    <Common.Clickable
      tag="button"
      className={Utils.className(
        'BA__iconButton',
        { 'BA__iconButton--active': active },
        className
      )}
      disabled={disabled}
      {..._props}
      {...props}
    >
      {children}
    </Common.Clickable>
  )

  if (!tooltip) return button({})

  return (
    <Common.Tooltip text={tooltip}>
      {button}
    </Common.Tooltip>
  )
}

export default IconButton

css
`.BA__iconButton {
    display: block;
    color: var(--interactive-normal);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
}
.BA__iconButton:hover {
    color: var(--interactive-hover);
}
.BA__iconButton:active,
.BA__iconButton--active {
    color: var(--interactive-active);
}
.BA__iconButton:disabled {
    color: var(--interactive-muted);
    cursor: not-allowed;
}

.BA__iconButton svg {
    display: block;
    fill: currentColor;
}`
`IconButton`
