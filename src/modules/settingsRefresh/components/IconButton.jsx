import { css } from '@/modules/Style'
import { Common } from '@/modules/DiscordModules'

function IconButton ({ children, tooltip, disabled = false, ...props }) {
  const button = _props => (
    <div {..._props}>
      <Common.Clickable
        tag="button"
        className="BA__iconButton"
        disabled={disabled}
        {...props}
      >
        {children}
      </Common.Clickable>
    </div>
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
.BA__iconButton:active {
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
