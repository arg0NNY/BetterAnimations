import { css } from '@style'
import { Text } from '@discord/modules'
import PackVerificationBadge from '@/settings/components/pack/PackVerificationBadge'

function PackHeader ({ pack, icon, popoutType, size = 'sm' }) {
  return (
    <div className="BA__packHeader">
      {icon ?? (
        <PackVerificationBadge
          pack={pack}
          popoutType={popoutType}
          size={size}
        />
      )}
      <Text
        tag="h2"
        variant={size === 'md' ? 'heading-lg/bold' : 'heading-md/bold'}
        color="header-primary"
        lineClamp={2}
      >
        {pack.name}
      </Text>
    </div>
  )
}

export default PackHeader

css
`.BA__packHeader {
    display: flex;
    align-items: flex-start;
    gap: 4px;
}
.BA__packHeader svg {
    flex-shrink: 0;
}
.BA__packHeader h2 {
    word-break: break-word;
}`
`PackHeader`
