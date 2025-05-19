import { Clickable, Tooltip } from '@/modules/DiscordModules'
import { css } from '@style'
import { Utils } from '@/BdApi'

const Sizes = {
  SMALL: 'small',
  MEDIUM: 'medium'
}

function ButtonGroupItem ({ children, tooltip, selected, disabled, onClick }) {
  const button = props => (
    <Clickable
      {...props}
      tag="button"
      className={`BA__buttonGroupItem ${selected ? 'BA__buttonGroupItem--selected' : ''} ${disabled ? 'BA__buttonGroupItem--disabled' : ''}`}
      onClick={onClick}
    >
      {children}
    </Clickable>
  )

  if (!tooltip) return button({})

  return (
    <Tooltip {...(typeof tooltip === 'string' ? { text: tooltip } : tooltip)}>
      {button}
    </Tooltip>
  )
}

function ButtonGroup ({ options, multiple = false, selected, onChange, className, size = Sizes.SMALL }) {
  return (
    <div
      className={Utils.className(
        'BA__buttonGroup',
        `BA__buttonGroup--${size}`,
        {
          'BA__buttonGroup--single': !multiple
        },
        className
      )}
    >
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

ButtonGroup.Sizes = Sizes

export default ButtonGroup

css
`.BA__buttonGroup {
    --ba--button-group-border-radius: 4px;
    
    display: flex;
    border-radius: var(--ba--button-group-border-radius);
    height: 28px;
    box-sizing: border-box;
}

.BA__buttonGroupItem {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background-color: var(--input-background);
    border-style: solid;
    border-color: var(--input-border);
    border-top-width: 1px;
    border-bottom-width: 1px;
    color: var(--interactive-normal);
    flex: 1;
}
.BA__buttonGroupItem:hover {
    background-color: var(--background-modifier-hover);
}
.BA__buttonGroupItem.BA__buttonGroupItem--disabled {
    color: var(--interactive-muted);
    cursor: not-allowed;
}    

.BA__buttonGroup > .BA__buttonGroupItem {
    padding: 0 8px;
}
.BA__buttonGroup > .BA__buttonGroupItem:first-of-type {
    border-top-left-radius: var(--ba--button-group-border-radius);
    border-bottom-left-radius: var(--ba--button-group-border-radius);
    border-left-width: 1px;
}
.BA__buttonGroup > .BA__buttonGroupItem:last-of-type {
    border-top-right-radius: var(--ba--button-group-border-radius);
    border-bottom-right-radius: var(--ba--button-group-border-radius);
    border-right-width: 1px;
}

.BA__buttonGroup--medium {
    --ba--button-group-border-radius: 8px;
    height: 42px;
}
.BA__buttonGroup--medium > .BA__buttonGroupItem {
    padding: 0 12px;
}

.BA__buttonGroupItem.BA__buttonGroupItem--selected {
    background-color: var(--brand-500);
    border-color: var(--brand-500);
    color: var(--white-500);
}
.BA__buttonGroup.BA__buttonGroup--single .BA__buttonGroupItem.BA__buttonGroupItem--selected {
    cursor: default;
}`
`ButtonGroup`
