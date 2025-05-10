import { Text } from '@/modules/DiscordModules'
import { css } from '@/modules/Style'
import { Utils } from '@/BdApi'
import { useMemo } from 'react'

const Sizes = {
  Small: 'small',
  Medium: 'medium',
  Large: 'large'
}

function WIP ({ name, size = Sizes.Large, color = 'header-primary' }) {
  const headingVariant = useMemo(() => {
    switch (size) {
      case Sizes.Large: return 'heading-xl/bold'
      case Sizes.Medium: return 'heading-md/bold'
      case Sizes.Small: return 'heading-sm/bold'
    }
  }, [size])

  const textVariant = useMemo(() => {
    switch (size) {
      case Sizes.Large: return 'text-md/normal'
      default: return 'text-sm/normal'
    }
  }, [size])

  return (
    <div className={Utils.className('BA__wip', `BA__wip--${size}`)}>
      <span>🚧</span>
      <Text
        variant={headingVariant}
        color={color}
        tag="h4"
      >
        Work in Progress
      </Text>
      {name && (
        <Text
          variant={textVariant}
          color={color}
          tag="p"
        >
          {name} is currently under&nbsp;active&nbsp;development
        </Text>
      )}
    </div>
  )
}

WIP.Sizes = Sizes
export default WIP

css
`.BA__wip {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 16px;
}
.BA__wip > span {
    font-size: 48px;
}
.BA__wip > h4 {
    margin-top: 24px;
}
.BA__wip > p {
    margin-top: 10px;
    margin-bottom: 0;
}

.BA__wip--medium > span {
    font-size: 32px;
}
.BA__wip--medium > h4 {
    margin-top: 16px;
}
.BA__wip--medium > p {
    margin-top: 4px;
}

.BA__wip--small > span {
    font-size: 24px;
}
.BA__wip--small > h4 {
    margin-top: 12px;
}`
`WIP`
