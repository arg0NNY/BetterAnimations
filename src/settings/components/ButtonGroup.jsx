import { Clickable, Tooltip } from '@discord/modules'
import { css } from '@style'
import classNames from 'classnames'

function ButtonGroupItem ({ children, tooltip, selected, disabled, className, onClick }) {
  const button = props => (
    <Clickable
      {...props}
      tag="button"
      className={classNames({
        'BA__buttonGroupItem': true,
        'BA__buttonGroupItem--selected': selected,
        'BA__buttonGroupItem--disabled': disabled
      }, className)}
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

function ButtonGroup ({ options, multiple = false, selected, onChange, className, itemClassName, size = 'sm' }) {
  return (
    <div
      className={classNames(
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
          className={classNames(itemClassName, option.className)}
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
    background-color: var(--input-background-default);
    border-style: solid;
    border-color: var(--input-border-default);
    border-top-width: 1px;
    border-bottom-width: 1px;
    color: var(--text-subtle);
    flex: 1;
    transition: background-color .1s, border-color .1s, color .1s;
}
.BA__buttonGroupItem:hover {
    background-color: var(--background-mod-subtle);
    border-color: var(--input-border-hover);
    color: var(--text-strong);
}
.BA__buttonGroupItem.BA__buttonGroupItem--disabled {
    color: var(--text-muted);
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

.BA__buttonGroup--md {
    --ba--button-group-border-radius: 8px;
    height: 36px;
}
.BA__buttonGroup--md > .BA__buttonGroupItem {
    padding: 0 12px;
}

.BA__buttonGroup--lg {
    --ba--button-group-border-radius: 8px;
    height: 42px;
}
.BA__buttonGroup--lg > .BA__buttonGroupItem {
    padding: 0 12px;
}

.BA__buttonGroupItem.BA__buttonGroupItem--selected {
    background-color: var(--brand-500);
    border-color: var(--brand-500);
    color: #FFFFFF;
}
.BA__buttonGroup.BA__buttonGroup--single .BA__buttonGroupItem.BA__buttonGroupItem--selected {
    cursor: default;
}`
`ButtonGroup`
