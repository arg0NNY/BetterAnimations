import { css } from '@style'
import PackPicture from '@/settings/components/PackPicture'
import { Button, Text } from '@discord/modules'
import SettingsSection from '@enums/SettingsSection'
import ShopIcon from '@/settings/components/icons/ShopIcon'
import { useSection } from '@/settings/stores/SettingsStore'
import BookCheckIcon from '@/components/icons/BookCheckIcon'

function NoPacksPlaceholder ({
  title = 'Install Animation Packs',
  description = (
    <>
      Expand your animation library with collections
      of&nbsp;community-made animations
    </>
  ),
  actions = ['catalog', 'library']
}) {
  const [section, setSection] = useSection()

  return (
    <div className="BA__noPacks">
      <PackPicture className="BA__noPacksPicture" />
      <div class="BA__noPacksContent">
        <Text
          className="BA__noPacksTitle"
          variant="heading-xl/bold"
        >
          {title}
        </Text>
        <Text
          className="BA__noPacksDescription"
          variant="text-md/normal"
        >
          {description}
        </Text>
        {actions && (
          <div className="BA__noPacksActions">
            {actions.map(action => {
              switch (action) {
                case 'catalog':
                  return (
                    <Button
                      icon={ShopIcon}
                      text="Catalog"
                      onClick={() => setSection(SettingsSection.Catalog)}
                    />
                  )
                case 'library':
                  return (
                    <Button
                      variant="secondary"
                      icon={BookCheckIcon}
                      text="Library"
                      onClick={() => setSection(SettingsSection.Library)}
                    />
                  )
                default: return action
              }
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default NoPacksPlaceholder

css
`.BA__noPacks {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 48px;
    justify-content: center;
}
.BA__noPacksContent {
    padding-bottom: 20px;
}
.BA__noPacksPicture {
    flex-shrink: 0;
}
.BA__noPacksDescription {
    margin-top: 8px;
    max-width: 360px;
}
.BA__noPacksActions {
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}`
`NoPacksPlaceholder`
