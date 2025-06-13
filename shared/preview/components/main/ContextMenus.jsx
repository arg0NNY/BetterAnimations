import { css } from '@style'
import Floating from '@preview/components/Floating'
import { Divider, Icon, Text } from '@preview/components'
import ChevronIcon from '@preview/components/icons/ChevronIcon'
import { useRef } from 'react'
import useModule from '@preview/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import useStages from '@preview/hooks/useStages'
import useMouse from '@preview/hooks/useMouse'
import PreviewTransition from '@preview/components/PreviewTransition'
import Position from '@enums/Position'
import classNames from 'classnames'

const coords = { x: 36, y: 157 }
const auto = {
  position: Position.Right,
  align: Position.Top
}

const items = [
  { type: 'action', length: 79 },
  { type: 'submenu', length: 82 },
  { type: 'action', length: 35 },
  { type: 'action', length: 52 },
  { type: 'action', length: 87 },
  { type: 'divider' },
  { type: 'action', length: 60 },
  { type: 'action', length: 75 },
  { type: 'action', length: 32 },
  { type: 'action', length: 81 },
  { type: 'action', length: 116 },
  { type: 'divider' },
  { type: 'action', length: 97 }
]

const submenuIndex = items.findIndex(item => item.type === 'submenu')
const submenuItems = [
  { type: 'action', length: 48 },
  { type: 'action', length: 88 },
  { type: 'action', length: 62 },
  { type: 'action', length: 54 },
  { type: 'action', length: 99 },
  { type: 'action', length: 66 },
  { type: 'action', length: 82 },
  { type: 'action', length: 41 },
  { type: 'divider' },
  { type: 'action', length: 97 }
]

function ContextMenuItem ({ type, length, active = false, ...props }) {
  if (type === 'divider') return <Divider length="100%" my={8} />

  return (
    <div
      className={classNames({
        'BAP__contextMenuItem': true,
        'BAP__contextMenuItem--active': active
      })}
      {...props}
    >
      <Text length={length} color="text-heading" />
      {type === 'submenu' ? (
        <ChevronIcon size={20} />
      ) : (
        <Icon size={20} />
      )}
    </div>
  )
}

function ContextMenu ({ items, itemRefs = useRef([]), active = -1, ...props }) {
  return (
    <Floating {...props}>
      <div className="BAP__contextMenu">
        {items.map((props, i) => (
          <ContextMenuItem
            key={i}
            ref={ref => { itemRefs.current[i] = ref }}
            active={i === active}
            {...props}
          />
        ))}
      </div>
    </Floating>
  )
}

function ContextMenus () {
  const menuRef = useRef()
  const submenuRef = useRef()
  const itemRefs = useRef([])

  const [module, isActive] = useModule(ModuleKey.ContextMenu)
  const stage = useStages(4, isActive)

  const mouse = useMouse(coords)

  if (!isActive) return null

  return (
    <>
      <PreviewTransition
        in={stage > 0}
        module={module}
        containerRef={menuRef}
        auto={auto}
        mouse={mouse}
      >
        <ContextMenu
          ref={menuRef}
          top={coords.y}
          left={coords.x}
          items={items}
          itemRefs={itemRefs}
          active={stage === 2 ? submenuIndex : -1}
        />
      </PreviewTransition>
      <PreviewTransition
        in={stage === 2}
        module={module}
        containerRef={submenuRef}
        auto={auto}
        anchor={() => itemRefs.current[submenuIndex]}
      >
        <ContextMenu
          ref={submenuRef}
          top={202}
          left={261}
          items={submenuItems}
        />
      </PreviewTransition>
    </>
  )
}

export default ContextMenus

css
`.BAP__contextMenu {
    width: 204px;
    border-width: 1px !important;
    box-shadow: 0 12px 24px 0 rgba(0, 0, 0, .24);
    background-color: var(--bap-background-surface-overlay);
    border-radius: 8px;
    padding: 8px;
}
.BAP__contextMenuItem {
    height: 36px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
}
.BAP__contextMenuItem svg {
    rotate: -90deg;
}
.BAP__contextMenuItem--active {
    background-color: var(--bap-border-subtle);
}`
`Preview: ContextMenus`
