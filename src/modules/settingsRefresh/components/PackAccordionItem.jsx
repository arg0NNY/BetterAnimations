import { colors, Common } from '@/modules/DiscordModules'
import { css } from '@/modules/Style'
import ChevronSmallUpIcon from '@/modules/settingsRefresh/components/icons/ChevronSmallUpIcon'
import ChevronSmallDownIcon from '@/modules/settingsRefresh/components/icons/ChevronSmallDownIcon'
import { Utils } from '@/BdApi'
import IconButton from '@/modules/settingsRefresh/components/IconButton'
import ErrorManager from '@/modules/ErrorManager'
import CircleWarningIcon from '@/modules/settingsRefresh/components/icons/CircleWarningIcon'

function PackAccordionItem ({ pack, children, isOpen, onToggle }) {
  return (
    <div className={Utils.className(
      'BA__packAccordionItem',
      { 'BA__packAccordionItem--partial': pack.partial }
    )}>
      <Common.Clickable tag="div" className="BA__packAccordionItemHeader" onClick={onToggle}>
        <div className="BA__packAccordionItemHeading">
          <Common.Text
            variant="heading-md/semibold"
            color={isOpen ? 'header-primary' : 'header-muted'}
          >{pack.name}</Common.Text>
          {pack.version || pack.author ? (
            <Common.Text
              variant="text-xs/normal"
              color={isOpen ? 'text-normal' : 'text-muted'}
            >
              {
                [pack.version && `v${pack.version}`, pack.author && `by ${pack.author}`]
                  .filter(Boolean).join(' ')
              }
            </Common.Text>
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
      </Common.Clickable>
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

.BA__packAccordionItem--partial .BA__packAccordionItemHeader {
    cursor: default;
}`
`PackAccordionItem`
