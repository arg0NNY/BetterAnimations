import { Clickable, colors, Text } from '@discord/modules'
import { css } from '@style'
import ChevronSmallUpIcon from '@/settings/components/icons/ChevronSmallUpIcon'
import ChevronSmallDownIcon from '@/settings/components/icons/ChevronSmallDownIcon'
import IconButton from '@/settings/components/IconButton'
import ErrorManager from '@error/manager'
import CircleWarningIcon from '@/settings/components/icons/CircleWarningIcon'
import classNames from 'classnames'

function PackAccordionItem ({ pack, children, isActive, isOpen, onToggle }) {
  return (
    <div className={classNames(
      'BA__packAccordionItem',
      {
        'BA__packAccordionItem--active': isActive && !isOpen,
        'BA__packAccordionItem--partial': pack.partial
      }
    )}>
      <Clickable tag="div" className="BA__packAccordionItemHeader" onClick={onToggle}>
        <div className="BA__packAccordionItemHeading">
          <Text
            variant="heading-md/semibold"
            color={isActive || isOpen ? 'header-primary' : 'header-muted'}
          >{pack.name}</Text>
          {pack.version || pack.author ? (
            <Text
              variant="text-xs/normal"
              color={isActive || isOpen ? 'text-normal' : 'text-muted'}
            >
              {
                [pack.version && `v${pack.version}`, pack.author && `by ${pack.author}`]
                  .filter(Boolean).join(' ')
              }
            </Text>
          ) : null}
        </div>
        <div className="BA__packAccordionItemIcon">
          {
            pack.partial
              ? (
                <IconButton
                  tooltip="An error occurred"
                  onClick={() => ErrorManager.showModal([pack.error])}
                >
                  <CircleWarningIcon color={colors.STATUS_DANGER} />
                </IconButton>
              )
              : isOpen
                ? <ChevronSmallUpIcon />
                : <ChevronSmallDownIcon />
          }
        </div>
      </Clickable>
      {isOpen ? (
        <div className="BA__packAccordionItemContentWrapper">
          <div className="BA__packAccordionItemContent">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default PackAccordionItem

css
`.BA__packAccordionItemHeader {
    border-radius: 8px;
    background-color: var(--background-base-lowest);
    border: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    padding: 16px;
    cursor: pointer;
    transition: background-color .2s;
}
.BA__packAccordionItem:not(.BA__packAccordionItem--partial) .BA__packAccordionItemHeader:hover {
    background-color: var(--background-base-lower);
}

.BA__packAccordionItemHeading {
    flex: 1;
}

.BA__packAccordionItemContent {
    padding-top: 8px;
}

.BA__packAccordionItem--active .BA__packAccordionItemHeader {
    box-shadow: 0 0 0 2.5px var(--brand-500);
}
.BA__packAccordionItem--partial .BA__packAccordionItemHeader {
    cursor: default;
}`
`PackAccordionItem`
