import { Common } from '@/modules/DiscordModules'
import { css } from '@/modules/Style'

function ButtonGroupItem ({ children, tooltip, selected, disabled, onClick }) {
  const button = props => (
    <Common.Clickable
      {...props}
      tag="button"
      className={`BA__buttonGroupItem ${selected ? 'BA__buttonGroupItem--selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
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

function ButtonGroup ({ options, multiple = false, vertical = false, selected, onChange }) {
  return (
    <div className={`BA__buttonGroup ${vertical ? 'BA__buttonGroup--vertical' : ''} ${!multiple ? 'BA__buttonGroup--single' : ''}`}>
      {options.map(option => (
        <ButtonGroupItem
          {...option}
          key={option.value}
          selected={multiple ? option.selected : selected === option.value}
          onClick={multiple ? option.onClick : () => selected !== option.value && onChange(option.value)}
          children={option.children ?? option.label}
        />
      ))}
    </div>
  )
}

export default ButtonGroup

css
`.BA__buttonGroup {
    display: flex;
    border: 1px solid var(--background-tertiary);
    border-radius: 4px;
    height: 28px;
    box-sizing: border-box;
}
.BA__buttonGroup > .BA__buttonGroupItem {
    padding: 0 8px;
}
.BA__buttonGroup > .BA__buttonGroupItem:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}
.BA__buttonGroup > .BA__buttonGroupItem:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}
.BA__buttonGroup.BA__buttonGroup--vertical {
    flex-direction: column;
    width: 28px;
    height: auto;
}
.BA__buttonGroup.BA__buttonGroup--vertical > .BA__buttonGroupItem {
    padding: 8px 0;
}
.BA__buttonGroup.BA__buttonGroup--vertical > .BA__buttonGroupItem:first-child {
    border-radius: 4px 4px 0 0;
}
.BA__buttonGroup.BA__buttonGroup--vertical > .BA__buttonGroupItem:last-child {
    border-radius: 0 0 4px 4px;
}

.BA__buttonGroupItem {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--background-primary);
    color: var(--interactive-normal);
    flex: 1;
}
.BA__buttonGroupItem:hover {
    background-color: var(--background-modifier-hover);
}
.BA__buttonGroupItem:disabled {
    color: var(--interactive-muted);
    cursor: not-allowed;
}

.BA__buttonGroupItem.BA__buttonGroupItem--selected {
    background-color: var(--brand-500);
    color: var(--white-500);
}
.BA__buttonGroup.BA__buttonGroup--single .BA__buttonGroupItem.BA__buttonGroupItem--selected {
    cursor: default;
}`
`ButtonGroup`
