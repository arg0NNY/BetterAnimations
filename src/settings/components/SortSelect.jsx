import { ContextMenu } from '@/BdApi'
import { Button, Popout } from '@discord/modules'
import ArrowSmallUpDownIcon from '@/components/icons/ArrowSmallUpDownIcon'
import { useRef } from 'react'

function SortSelect ({ options, value, onChange }) {
  const buttonRef = useRef()

  const selectedSort = options.find(o => o.value === value)

  return (
    <Popout
      targetElementRef={buttonRef}
      position="bottom"
      align="right"
      renderPopout={props => (
        <ContextMenu.Menu {...props}>
          <ContextMenu.Group label="Sort">
            {options.map(option => (
              <ContextMenu.RadioItem
                key={option.value}
                id={`sort-${option.value}`}
                group="sort"
                label={option.label}
                checked={option.value === value}
                action={() => onChange(option.value)}
              />
            ))}
          </ContextMenu.Group>
        </ContextMenu.Menu>
      )}
    >
      {props => (
        <Button
          {...props}
          ref={buttonRef}
          variant="secondary"
          rounded={true}
          icon={ArrowSmallUpDownIcon}
          text={selectedSort?.label ?? 'Sort'}
        />
      )}
    </Popout>
  )
}

export default SortSelect
