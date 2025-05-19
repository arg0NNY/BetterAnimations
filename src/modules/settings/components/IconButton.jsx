import { css } from '@style'
import { Clickable, Tooltip } from '@/modules/DiscordModules'
import { Utils } from '@/BdApi'

function IconButton ({ children, tooltip, disabled = false, active = false, className, ...props }) {
  const button = _props => (
    <div className={className} {..._props}>
      <Clickable
        tag="button"
        className={Utils.className(
          'BA__iconButton',
          { 'BA__iconButton--active': active }
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </Clickable>
    </div>
  )

  if (!tooltip) return button({})

  const tooltipProps = typeof tooltip === 'string'
    ? { text: tooltip }
    : tooltip

  return (
    <Tooltip {...tooltipProps}>
      {button}
    </Tooltip>
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
