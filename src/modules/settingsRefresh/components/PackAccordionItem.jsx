import { Common } from '@/modules/DiscordModules'
import { css } from '@/modules/Style'

function PackAccordionItem ({ pack, children, isOpen, onToggle }) {
  return (
    <div className="BA__packAccordionItem">
      <div role="button" className="BA__packAccordionItemHeader" onClick={onToggle}>
        <div className="BA__packAccordionItemHeading">
          <Common.Text
            variant="heading-md/semibold"
            color={isOpen ? 'header-primary' : 'header-muted'}
          >{pack.name}</Common.Text>
          <Common.Text
            variant="text-xs/normal"
            color={isOpen ? 'text-normal' : 'text-muted'}
          >v{pack.version} by {pack.author}</Common.Text>
        </div>
        <div className="BA__packAccordionItemArrow">
          {
            isOpen
              ? <Common.ChevronSmallUpIcon />
              : <Common.ChevronSmallDownIcon />
          }
        </div>
      </div>
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
    background-color: var(--background-secondary);
    display: flex;
    align-items: center;
    padding: 16px;
    cursor: pointer;
    transition: background-color .2s;
}
.BA__packAccordionItemHeader:hover {
    background-color: var(--background-secondary-alt);
}

.BA__packAccordionItemHeading {
    flex: 1;
}

.BA__packAccordionItemContent {
    padding-top: 8px;
}`
`PackAccordionItem`
