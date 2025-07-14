import IconBrand from '@/components/icons/IconBrand'
import { Button, handleClick, Text } from '@discord/modules'
import meta from '@/meta'
import { css } from '@style'
import ShopIcon from '@/settings/components/icons/ShopIcon'
import ExternalLinkIcon from '@/settings/components/icons/ExternalLinkIcon'
import CircleDollarSignIcon from '@/settings/components/icons/CircleDollarSignIcon'
import { useSection } from '@/settings/stores/SettingsStore'
import SettingsSection from '@enums/SettingsSection'
import IconAuthor from '@/components/icons/IconAuthor'
import SpotlightAnimation from '@/settings/components/SpotlightAnimation'
import { use, useMemo } from 'react'
import { sanitize } from '@utils/text'
import BookIcon from '@/settings/components/icons/BookIcon'
import Documentation from '@shared/documentation'
import { AnimeTransitionContext } from '@components/AnimeTransition'

const madeByPhrases = [
  'Made by',
  'Developed by',
  'Created by',
  'Authored by',
  'Brought to you by',
  'Crafted by',
  'Produced by',
  'Built by',
  'Designed by',
  'Brought to life by',
  'Cultivated by',
  'Established by'
]

function Home () {
  const [section, setSection] = useSection()

  const madeBy = useMemo(
    () => madeByPhrases[Math.floor(Math.random() * madeByPhrases.length)],
    []
  )

  const { isEnterActive } = use(AnimeTransitionContext)

  return (
    <div className="BA__home">
      <div className="BA__homeHeading">
        {!isEnterActive && (
          <SpotlightAnimation className="BA__homeSpotlightAnimation" />
        )}
        <IconBrand
          size="custom"
          width={120}
          height={120}
          className="BA__homeIcon"
        />
        <Text
          className="BA__homeTitle"
          variant="heading-xxl/bold"
          tag="h3"
          color="header-primary"
        >
          {meta.name}
        </Text>
        <Text
          className="BA__homeDescription"
          variant="text-md/normal"
          color="header-primary"
        >
          {sanitize(meta.description)}
        </Text>
        <div className="BA__homeHeadingActions">
          <Button
            variant="expressive"
            icon={ShopIcon}
            text="Catalog"
            onClick={() => setSection(SettingsSection.Catalog)}
          />
          <Button
            variant="secondary"
            icon={BookIcon}
            text="Documentation"
            onClick={() => handleClick({ href: Documentation.homeUrl })}
          />
        </div>
      </div>
      <div className="BA__homeAuthorSection">
        <Text
          className="BA__homeAuthorLabel"
          variant="text-sm/normal"
          color="text-muted"
        >
          {madeBy}
        </Text>
        <div className="BA__homeAuthor">
          <IconAuthor
            className="BA__homeAuthorAvatar"
            size="custom"
            width={36}
            height={36}
          />
          <Text variant="text-lg/medium">{meta.author}</Text>
        </div>
        <div className="BA__homeAuthorActions">
          <Button
            variant="active"
            icon={CircleDollarSignIcon}
            text="Support the author"
            fullWidth
            onClick={() => handleClick({ href: meta.donate })}
          />
          <Button
            size="sm"
            variant="secondary"
            icon={ExternalLinkIcon}
            iconPosition="end"
            text={`Plugins made by ${meta.author}`}
            fullWidth
            onClick={() => handleClick({ href: meta.authorLink })}
          />
        </div>
      </div>
      <div className="BA__homeSystemInfo">
        <Text
          variant="text-sm/medium"
          color="text-muted"
        >
          v{meta.version} {import.meta.env.MODE === 'development' ? '(Dev Bundle)' : ''}
        </Text>
      </div>
    </div>
  )
}

export default Home

css
`.BA__home {
    position: absolute;
    inset: 0;
    padding: 60px 40px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    text-align: center;
}

.BA__homeHeading {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 8vh;
    position: relative;
    isolation: isolate;
}
.BA__homeDescription {
    margin-top: 12px;
}
.BA__homeHeadingActions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 24px;
}
.BA__homeSpotlightAnimation {
    z-index: -1;
}

.BA__homeAuthorSection {
    position: relative;
    margin-top: 11vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.BA__homeAuthorLabel {
    margin-bottom: 12px;
    text-transform: uppercase;
}
.BA__homeAuthor {
    display: flex;
    align-items: center;
    gap: 12px;
}
.BA__homeAuthorActions {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    margin-top: 28px;
    width: 250px;
}

.BA__homeSystemInfo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 16px;
    display: flex;
    align-items: center;
}`
`Home`
