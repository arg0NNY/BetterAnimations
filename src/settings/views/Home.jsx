import IconBrand from '@/components/icons/IconBrand'
import { Button, handleClick, Text, Tooltip } from '@discord/modules'
import meta from '@/meta'
import { css } from '@style'
import ShopIcon from '@/components/icons/ShopIcon'
import ExternalLinkIcon from '@/components/icons/ExternalLinkIcon'
import CircleDollarSignIcon from '@/components/icons/CircleDollarSignIcon'
import { useSection } from '@/settings/stores/SettingsStore'
import SettingsSection from '@enums/SettingsSection'
import IconAuthor from '@/components/icons/IconAuthor'
import SpotlightAnimation from '@/settings/components/SpotlightAnimation'
import { use, useMemo } from 'react'
import { sanitize } from '@utils/text'
import BookIcon from '@/components/icons/BookIcon'
import Documentation from '@shared/documentation'
import { AnimeTransitionContext } from '@components/AnimeTransition'
import PackPicture from '@/settings/components/pack/PackPicture'
import usePackRegistry from '@/hooks/usePackRegistry'
import { useData } from '@/modules/Data'

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

function CatalogPromoTooltip ({ packs, displayLimit = 3, children, ...props }) {
  const nodes = packs.length <= displayLimit
    ? packs
    : packs.slice(0, displayLimit - 1).concat(packs.length - displayLimit + 1)

  return (
    <Tooltip
      shouldShow={packs.length > 0}
      tooltipClassName="BA__catalogPromoTooltip"
      position="bottom"
      color={Tooltip.Colors.BRAND}
      spacing={12}
      allowOverflow
      text={() => (
        <div className="BA__catalogPromoTooltipContent">
          <PackPicture />
          <div>
            {`Check out the newly available ${packs.length > 1 ? 'packs' : 'pack'}: `}
            {nodes.map((node, index) => (
              <>
                {typeof node === 'number' ? `${node} others` : <b>{node.name}</b>}
                {[', ', ' and ', ''][Math.max(0, index - nodes.length + 3)]}
              </>
            ))}
            !
          </div>
        </div>
      )}
      {...props}
    >
      {children}
    </Tooltip>
  )
}

function Home () {
  const [section, setSection] = useSection()

  const madeBy = useMemo(
    () => madeByPhrases[Math.floor(Math.random() * madeByPhrases.length)],
    []
  )

  const { isEnterActive } = use(AnimeTransitionContext)

  const [{ visited: visitedCatalog }] = useData('catalog')
  const registry = usePackRegistry()
  const unknownPacks = registry.getUnknownPacks()
  const highlightCatalog = !visitedCatalog || unknownPacks.length > 0

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
          <CatalogPromoTooltip packs={unknownPacks}>
            {props => (
              <Button
                {...props}
                variant={highlightCatalog ? 'expressive' : 'primary'}
                icon={ShopIcon}
                text="Catalog"
                onClick={() => setSection(SettingsSection.Catalog)}
              />
            )}
          </CatalogPromoTooltip>
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

.BA__catalogPromoTooltip {
    max-width: 100%;
}
.BA__catalogPromoTooltipContent {
    width: 230px;
    position: relative;
    padding: 10px 0 12px 80px;
}
.BA__catalogPromoTooltipContent svg {
    position: absolute;
    left: -62px;
    top: calc(50% + 6px);
    transform: translateY(-50%);
    height: 123px;
}`
`Home`
