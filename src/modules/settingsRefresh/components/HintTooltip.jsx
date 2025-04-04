import { Tooltip } from '@/modules/DiscordModules'
import CircleInfoIcon from '@/modules/settingsRefresh/components/icons/CircleInfoIcon'
import { css } from '@/modules/Style'
import { useCallback } from 'react'

function HintTooltip ({ text: _text, color = Tooltip.Colors.BRAND, children, ...props }) {
  const text = useCallback(() => (
    <div className="BA__hintTooltip">
      <CircleInfoIcon size="xs" color="currentColor" />
      <span>{_text}</span>
    </div>
  ), [_text])

  return (
    <Tooltip
      text={text}
      color={color}
      {...props}
    >
      {children}
    </Tooltip>
  )
}

export default HintTooltip

css
`.BA__hintTooltip {
    display: flex;
    gap: 4px;
}
.BA__hintTooltip > svg {
    flex-shrink: 0;
}`
`HintTooltip`
